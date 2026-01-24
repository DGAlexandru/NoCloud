const Ajv = require("ajv").default;
const EventEmitter = require("events").EventEmitter;
const fs = require("fs");
const os = require("os");
const path = require("path");

const env = require("./res/env");
const Logger = require("./Logger");
const SCHEMAS = require("./doc/Configuration.openapi.json");
const Tools = require("./utils/Tools");

class Configuration {

    constructor() {
        /** @private */
        this.eventEmitter = new EventEmitter();
        this.settings = {};  // Start with an empty settings object
        this.schemaAvailable = false; // Track if schemas are loaded successfully

        this.location = process.env[env.ConfigPath] ?? path.join(os.tmpdir(), "NoCloud_config.json");

        this.ajv = new Ajv({strict: true, removeAdditional: true, useDefaults: false, coerceTypes: false, allErrors: false, verbose: false});

        // Load schemas into AJV
        this.loadSchemas();

        // Load configuration
        this.loadConfig();
    }

    /**
     * Read that key's value from configuration file
     * @public
     * @param {string} key
     * @returns {*}
     */
    get(key) {
        const value = this.settings[key];
        // Deep clone if it's an object or array to prevent mutation - returns a new copy
        // For primitives, just return the value
        return value && typeof value === "object" ? structuredClone(value) : value;
    }

    getAll() {
        return structuredClone(this.settings);  // Clone the whole config to prevent accidental mutations
    }

    /**
     * Save that key's value to the running config and calls SaveToFile
     * @public
     * @param {string} key
     * @param {string|object} val
     */
    set(key, val) {
        // Check if the value really has changed
        if (JSON.stringify(this.settings[key]) !== JSON.stringify(val)) {
            this.settings[key] = val;  // Mutate the internal settings
            this.persist();  // Save to file only when the settings have changed - limit disk wear
        }
        this.eventEmitter.emit(CONFIG_UPDATE_EVENT, key);
    }

    /**
     * Save current running config to the configuration file
     * @private
     */
    persist() {
        try {
            fs.writeFileSync(this.location, JSON.stringify(this.settings, null, 2));
        } catch (e) {
            Logger.error("Error while saving configuration to file", e);
        }
    }

    /**
     * @public
     * @param {(key: string) => void} listener
     */
    onUpdate(listener) {
        this.eventEmitter.on(CONFIG_UPDATE_EVENT, listener);
    }

    /**
     * Load OpenAPI configuration schema
     * @private
     */
    loadSchemas() {
        Object.keys(SCHEMAS.components.schemas).forEach(schemaName => {
            try {
                this.ajv.addSchema(SCHEMAS.components.schemas[schemaName], "#/components/schemas/" + schemaName);
                this.schemaAvailable = true;
            } catch (e) {
                this.schemaAvailable = false;
            }
        });
    }

    /**
     * Load, validate and decide if and how to recover configuration
     * @private
     */
    loadConfig() {
        if (fs.existsSync(this.location)) {
            Logger.info("Loading configuration file:", this.location);
            let parsedConfig;
            try { // loading an existing configuration file.
                const configContent = fs.readFileSync(this.location, {"encoding": "utf-8"});
                parsedConfig = JSON.parse(configContent);
                // Check version and migrate if needed
                if (parsedConfig._version !== Tools.GET_NoCloud_VERSION()) {
                    Logger.warn(`Migrating config from ${parsedConfig._version} to ${Tools.GET_NoCloud_VERSION()}`);

                    // BEGIN code for Valetudo to NoCloud migration - NTP configuration
                    if (parsedConfig.ntpClient?.server === "valetudo.ntp.org") {
                        parsedConfig.ntpClient.server = "pool.ntp.org"; // NoCloud sticks to the global one
                    }
                    // END code for Valetudo to NoCloud migration - NTP configuration

                    parsedConfig._version = Tools.GET_NoCloud_VERSION();
                }
            } catch (e) {
                Logger.error("Failed to read or JSON.parse configuration file", e);
                if (!this.schemaAvailable) {
                    Logger.error("Schema unavailable and config unreadable. Exiting.");
                    process.exit(1);
                }
                // Nothing to be recovered, but do backup of the invalid one, beside creating a default configuration
                this.recoverConfig();
                return;
            }
            // Validate entire config against the OpenAPI schema
            if (this.schemaAvailable) {
                if (!this.ajv.validate(SCHEMAS.components.schemas.Configuration, parsedConfig)) {
                    Logger.error("Validation errors:", this.ajv.errors);
                    this.recoverConfig(parsedConfig);  // Try to recover parts of this existing configuration
                } else { // Config file is as expected - assign the validated config
                    this.settings = parsedConfig;
                }
            } else {
                Logger.warn("Loading configuration without validation.");
                this.settings = parsedConfig;
            }
        } else {
            if (!this.schemaAvailable) {
                Logger.error("Schema unavailable and no config file. Exiting.");
                process.exit(1);
            }
            Logger.warn(`No configuration file present. Creating one at: ${this.location}`);
            Tools.MK_DIR_PATH(path.dirname(this.location));
            // Initialize settings with default config
            this.settings = this.buildDefaultConfigFromSchema(SCHEMAS.components.schemas.Configuration);
            this.persist();  // Just save the default config if the config file doesn't exist
        }
    }

    /**
     * Backup invalid config and call rebuild with defaults then call merge valid parts
     * @private
     * @param {any} badConfig
     */
    recoverConfig(badConfig = {}) {
        try {
            // We're here because the read configuration is invalid, but file exist, so rename it for backup
            fs.renameSync(this.location, this.location + ".backup");
            Logger.warn(`Invalid config saved as: ${this.location}.backup`);
        } catch (e) {
            Logger.warn("Failed to rename invalid config file", e);
        }
        // Build default configuration first
        const defaultConfig = this.buildDefaultConfigFromSchema(SCHEMAS.components.schemas.Configuration);
        // Now, if we were able to read some setting, put the valid settings over the default ones
        this.settings = this.mergeWithDefaults(badConfig, defaultConfig, SCHEMAS.components.schemas.Configuration);
        this.persist();
    }

    /**
     * Validate each key from the invalid config and if valid, replace the default one
     * @private
     * @param {any} badConfig
     * @param {any} defaultConfig
     * @param {any} schema
     * @param {any} path
     */
    mergeWithDefaults(badConfig, defaultConfig, schema, path = "") {
        // Defensive fallback
        if (!schema || typeof schema !== "object") {
            Logger.debug(`No schema at path="${path}", using default`);
            return structuredClone(defaultConfig);
        }
        // Resolve $ref early - this shouldn't be needed as we only get here after buildDefaultConfigFromSchema()
        /*if (schema.$ref) {
            const resolved = this.resolveRefSchema(schema.$ref);
            Logger.info(`[merge] Resolved $ref at path="${path}" -> ${schema.$ref}`);
            return this.mergeWithDefaults(badConfig, defaultConfig, resolved, path);
        }*/
        // Primitive or array → validate directly
        if (schema.type !== "object") {
            const valid = this.ajv.validate(schema, badConfig);
            Logger.debug(`Primitive validation at path="${path}": value=${JSON.stringify(badConfig)} valid=${valid}`);
            return valid ? badConfig : structuredClone(defaultConfig);
        }
        // Object handling
        const result = {};
        const props = schema.properties || {};

        for (const key of Object.keys(props)) {
            const nextPath = path ? `${path}.${key}` : key;
            const badValue = badConfig ? badConfig[key] : undefined;
            const defaultValue = defaultConfig ? defaultConfig[key] : undefined;
            Logger.debug(`Proc key="${nextPath}" badV=${JSON.stringify(badValue)} def=${JSON.stringify(defaultValue)}`);
            // Missing value → default
            if (badValue === undefined) {
                Logger.debug(`Missing key="${nextPath}", using default`);
                result[key] = structuredClone(defaultValue);
                continue;
            }
            // Resolve property $ref
            let effectiveSchema = props[key];
            if (effectiveSchema.$ref) {
                effectiveSchema = this.resolveRefSchema(props[key].$ref);
                Logger.debug(`Resolved $ref for key="${nextPath}"`);
            }
            // Object → recurse
            if (
                effectiveSchema.type === "object" &&
                typeof badValue === "object" &&
                badValue !== null &&
                !Array.isArray(badValue)
            ) {
                Logger.debug(`Recursing into object key="${nextPath}"`);
                result[key] = this.mergeWithDefaults(badValue, defaultValue, effectiveSchema, nextPath);
                continue;
            }
            // Primitive / array → validate directly
            const valid = this.ajv.validate(effectiveSchema, badValue);
            Logger.debug(`Validation key="${nextPath}" value=${JSON.stringify(badValue)} valid=${valid}`);
            result[key] = valid ? badValue : structuredClone(defaultValue);
        }
        Logger.debug(`Leaving path="${path || "<root>"}"`);
        return result;
    }

    /**
     * Recursively build the default configuration from the schema
     * @private
     * @param {any} schema
     */
    buildDefaultConfigFromSchema(schema) {
        const defaultConfig = {};

        if (!schema || typeof schema !== "object") {
            return defaultConfig;
        }
        // Handle $ref
        if (schema.$ref) {
            const refSchema = this.resolveRefSchema(schema.$ref);
            if (refSchema) {
                return this.buildDefaultConfigFromSchema(refSchema);
            } else {  // fallback if ref can't be resolved
                return defaultConfig;
            }
        }
        for (const [key, propertySchema] of Object.entries(schema.properties || {})) {
            if (propertySchema.default !== undefined) {
                defaultConfig[key] = propertySchema.default;
            } else if (propertySchema.$ref) {
                // resolve referenced schema
                const refSchema = this.resolveRefSchema(propertySchema.$ref);
                defaultConfig[key] = this.buildDefaultConfigFromSchema(refSchema);
            } else if (propertySchema.type === "object") {
                defaultConfig[key] = this.buildDefaultConfigFromSchema(propertySchema);
            } else if (propertySchema.type === "array") {
                defaultConfig[key] = [];
            } else {
                defaultConfig[key] = null; // fallback
            }
        }
        return defaultConfig;
    }

    /**
     * Helper method to resolve $ref schemas
     * @private
     * @param {any} ref
     */
    resolveRefSchema(ref) {
        // Assuming ref is like "#/components/schemas/SomeSchema"
        const refPath = ref.replace(/^#\/?/, "").split("/"); // split path
        let currentSchema = SCHEMAS; // root schema object
        for (const part of refPath) {
            if (currentSchema && currentSchema[part]) {
                currentSchema = currentSchema[part];
            } else {
                return null; // could not resolve #ref
            }
        }
        return currentSchema;
    }

    /**
     * Reset configuration to defaults (except robot config)
     * @public
     */
    reset() {
        Logger.warn("Restoring config to default settings.");

        // A config reset should not reset the robot config
        const robotSettings = this.settings.robot;

        this.settings = this.buildDefaultConfigFromSchema(SCHEMAS.components.schemas.Configuration);
        this.settings.robot = robotSettings;

        this.persist();

        Object.keys(this.settings).forEach(key => {
            this.eventEmitter.emit(CONFIG_UPDATE_EVENT, key);
        });
    }
}

const CONFIG_UPDATE_EVENT = "ConfigUpdated";

module.exports = Configuration;
