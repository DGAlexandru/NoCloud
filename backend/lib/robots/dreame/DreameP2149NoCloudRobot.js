const DreameMopNoCloudRobot = require("./DreameMopNoCloudRobot");
const DreameNoCloudRobot = require("./DreameNoCloudRobot");
const DreameQuirkFactory = require("./DreameQuirkFactory");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");

class DreameP2149NoCloudRobot extends DreameMopNoCloudRobot {
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

        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_ONLY_MODE),
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_CLEANING_FREQUENCY),
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_UV_TREATMENT)
            ]
        }));
    }

    getModelName() {
        return "P2149";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(DreameNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && deviceConf.model === "dreame.vacuum.p2149o");
    }
}


module.exports = DreameP2149NoCloudRobot;
