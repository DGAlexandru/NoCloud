const EventEmitter = require("events").EventEmitter;
const Tools = require("./Tools");

class NoCloudHelper {
    /**
     * The NoCloudHelper is sorta like the Tools class but with state
     * 
     * @param {object} options
     * @param {import("../Configuration")} options.config
     * @param {import("../core/NoCloudRobot")} options.robot
     */
    constructor(options) {
        this.config = options.config;
        this.robot = options.robot;

        this.eventEmitter = new EventEmitter();


        this.config.onUpdate((key) => {
            if (key === "NoCloud") {
                this.eventEmitter.emit(FRIENDLY_NAME_CHANGED);
            }
        });
    }

    hasFriendlyName() {
        const NoCloudConfig = this.config.get("NoCloud");

        return NoCloudConfig.customizations.friendlyName !== "";
    }

    getFriendlyName() {
        const NoCloudConfig = this.config.get("NoCloud");

        if (this.hasFriendlyName()) {
            return NoCloudConfig.customizations.friendlyName;
        } else {
            return `NoCloud ${this.robot.getModelName()} ${Tools.GET_HUMAN_READABLE_SYSTEM_ID()}`;
        }
    }

    /**
     * @public
     * @param {() => void} listener
     */
    onFriendlyNameChanged(listener) {
        this.eventEmitter.on(FRIENDLY_NAME_CHANGED, listener);
    }
}

const FRIENDLY_NAME_CHANGED = "FriendlyNameChanged";



module.exports = NoCloudHelper;
