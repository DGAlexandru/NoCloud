const entities = require("./entities");
const fs = require("fs");
const Logger = require("./Logger");
const NoCloudRuntimeErrorNoCloudEvent = require("./NoCloud_events/events/NoCloudRuntimeErrorNoCloudEvent");
const NoCloudUpdatedNoCloudEvent = require("./NoCloud_events/events/NoCloudUpdatedNoCloudEvent");
const os = require("os");
const path = require("path");
const PhoenixCycleData = require("./core/PhoenixCycleData");
const Tools = require("./utils/Tools");

class PhoenixManager {
    /**
     * @param {object} options
     * @param {import("./NoCloudEventStore")} options.NoCloudEventStore
     * @param {import("./core/NoCloudRobot")} options.robot
     * @param {() => Promise<void>} options.doShutdown
     */
    constructor(options) {
        this.NoCloudEventStore = options.NoCloudEventStore;
        this.robot = options.robot;
        this.doShutdown = options.doShutdown;

        this.cycleData = PhoenixCycleData.FROM_ENV();

        if (this.canReincarnate()) {
            if (this.cycleData.generation > 0) {
                Logger.info(`Current generation: '${this.cycleData.generation}'. Reason: '${this.cycleData.reason}'`);
            }
        } else {
            Logger.info("Reincarnation is impossible");
        }

        this.restoreState();
        this.raiseRebirthEvent();
    }

    restoreState() {
        if (this.cycleData.generation === 0) {
            return;
        }

        const mapPath = path.join(os.tmpdir(), PhoenixManager.MAP_DUMP_FILENAME);
        const eventsPath = path.join(os.tmpdir(), PhoenixManager.EVENTS_DUMP_FILENAME);

        try {
            if (fs.existsSync(mapPath)) {
                const mapData = JSON.parse(fs.readFileSync(mapPath, { encoding: "utf-8" }));
                this.robot.state.map = entities.map.NoCloudMap.DESERIALIZE(mapData);

                Logger.info("Successfully rehydrated map after reincarnation");
            }
        } catch (e) {
            Logger.warn("Failed to restore NoCloudMap.", e);
        } finally {
            try {
                fs.unlinkSync(mapPath);
            } catch {
                // intentional
            }
        }

        try {
            if (fs.existsSync(eventsPath)) {
                const eventsData = JSON.parse(fs.readFileSync(eventsPath, { encoding: "utf-8" }));
                this.NoCloudEventStore.rehydrateEvents(eventsData);

                Logger.info("Successfully rehydrated events after reincarnation");
            }
        } catch (e) {
            Logger.warn("Failed to restore NoCloudEvents.", e);
        } finally {
            try {
                fs.unlinkSync(eventsPath);
            } catch {
                // intentional
            }
        }
    }

    canReincarnate() {
        return process.platform === "linux" && typeof process.execve === "function";
    }

    /**
     * @param {PhoenixRebirthReason} reason
     * @param {object} [metaData]
     * @param {string} [metaData.description]
     * @param {string} [metaData.previousVersion]
     * @param {string} [metaData.newVersion]
     */
    doRebirth(reason, metaData) {
        if (this.cycleData.history.length >= 3 && this.cycleData.history[2].timestamp >= Date.now() - 60 * 1000) {
            Logger.error("Crashloop detected. Exiting...");

            process.exit(1);
        }

        const env = {
            ...process.env,
            NoCloud_PHOENIX_CYCLE_DATA: this.cycleData.prepareNext(reason, metaData).toEnv()
        };

        try {
            fs.writeFileSync(path.join(os.tmpdir(), PhoenixManager.MAP_DUMP_FILENAME), JSON.stringify(this.robot.state.map));
            fs.writeFileSync(path.join(os.tmpdir(), PhoenixManager.EVENTS_DUMP_FILENAME), JSON.stringify(this.NoCloudEventStore.getAll()));
        } catch (e) {
            Logger.warn("Failed to persist state for reincarnation.", e);
        }

        Logger.info("Operation Phoenix initiated");
        this.doShutdown().catch(() => {
            // intentional
        }).finally(() => {
            Logger.closeLogFile();

            Tools.DRAIN_EVENT_LOOP().finally(() => {
                let execArgs = [...process.argv];

                if (execArgs[1] && execArgs[1].startsWith("/snapshot/")) {
                    execArgs.splice(1, 1);
                }

                process.execve(process.argv0, execArgs, env);
            });
        });
    }

    raiseRebirthEvent() {
        if (this.cycleData.generation === 0) {
            return;
        }

        if (this.cycleData.reason === PhoenixManager.REBIRTH_REASONS.MEMORY_USAGE) {
            this.NoCloudEventStore.raise(new NoCloudRuntimeErrorNoCloudEvent({
                reason: NoCloudRuntimeErrorNoCloudEvent.REASONS.MEMORY_USAGE,
                generation: this.cycleData.generation,
                description: this.cycleData.metaData?.description
            }));
        } else if (this.cycleData.reason === PhoenixManager.REBIRTH_REASONS.UPDATED) {
            this.NoCloudEventStore.raise(new NoCloudUpdatedNoCloudEvent({
                generation: this.cycleData.generation,
                previousVersion: this.cycleData.metaData?.previousVersion ?? "Unknown",
                newVersion: this.cycleData.metaData?.newVersion ?? "Unknown"
            }));
        } else {
            Logger.error(`Unable to raise rebirth event. Unknown reason '${this.cycleData.reason}'`);
        }
    }
}

/**
 *  @typedef {string} PhoenixRebirthReason
 *  @enum {string}
 */
PhoenixManager.REBIRTH_REASONS = Object.freeze({
    MEMORY_USAGE: "memory_usage",
    UPDATED: "updated"
});

PhoenixManager.MAP_DUMP_FILENAME = "NoCloud_phnx_map.json";
PhoenixManager.EVENTS_DUMP_FILENAME = "NoCloud_phnx_events.json";

module.exports = PhoenixManager;
