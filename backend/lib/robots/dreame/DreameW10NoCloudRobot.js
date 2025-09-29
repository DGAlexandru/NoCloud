const DreameCarpetSensorModeControlCapability = require("./capabilities/DreameCarpetSensorModeControlCapability");
const DreameMopNoCloudRobot = require("./DreameMopNoCloudRobot");
const DreameQuirkFactory = require("./DreameQuirkFactory");
const DreameNoCloudRobot = require("./DreameNoCloudRobot");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");

class DreameW10NoCloudRobot extends DreameMopNoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        super(options);

        const quirkFactory = new DreameQuirkFactory({
            robot: this
        });

        this.registerCapability(new DreameCarpetSensorModeControlCapability({
            robot: this
        }));

        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_ONLY_MODE),
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_CLEANING_FREQUENCY),
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_WET_DRY_SWITCH),
            ]
        }));
    }

    getModelName() {
        return "W10";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(DreameNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && deviceConf.model === "dreame.vacuum.p2027");
    }
}


module.exports = DreameW10NoCloudRobot;
