const SerializableEntity = require("../SerializableEntity");

class NoCloudRobotError extends SerializableEntity {
    /**
     * @param {object} options
     * @param {object} [options.metaData]
     * 
     * @param {object} options.severity
     * @param {NoCloudRobotErrorSeverityKind} options.severity.kind
     * @param {NoCloudRobotErrorSeverityLevel} options.severity.level
     * @param {NoCloudRobotErrorSubsystem} options.subsystem
     * 
     * @param {string} options.message
     * @param {string} options.vendorErrorCode
     */
    constructor(options) {
        super(options);

        this.severity = options.severity;
        this.subsystem = options.subsystem;

        this.message = options.message;
        this.vendorErrorCode = options.vendorErrorCode;
    }
}

/**
 *  @typedef {string} NoCloudRobotErrorSeverityKind
 *  @enum {string}
 *
 */
NoCloudRobotError.SEVERITY_KIND = Object.freeze({
    TRANSIENT: "transient",
    PERMANENT: "permanent",

    UNKNOWN: "unknown",

    NONE: "none"
});

/**
 *  @typedef {string} NoCloudRobotErrorSeverityLevel
 *  @enum {string}
 *
 */
NoCloudRobotError.SEVERITY_LEVEL = Object.freeze({
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
    CATASTROPHIC: "catastrophic",

    UNKNOWN: "unknown",

    NONE: "none"
});

/**
 *  @typedef {string} NoCloudRobotErrorSubsystem
 *  @enum {string}
 *
 */
NoCloudRobotError.SUBSYSTEM = Object.freeze({
    CORE: "core",
    POWER: "power",
    SENSORS: "sensors",
    MOTORS: "motors",
    NAVIGATION: "navigation",
    ATTACHMENTS: "attachments",
    DOCK: "dock",

    UNKNOWN: "unknown",

    NONE: "none"
});



module.exports = NoCloudRobotError;
