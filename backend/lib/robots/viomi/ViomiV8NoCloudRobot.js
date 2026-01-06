const capabilities = require("./capabilities");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const ViomiNoCloudRobot = require("./ViomiNoCloudRobot");
const ViomiQuirkFactory = require("./ViomiQuirkFactory");


class ViomiV8NoCloudRobot extends ViomiNoCloudRobot {
    /**
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     * @param {object} [options.fanSpeeds]
     * @param {object} [options.waterGrades]
     */
    constructor(options) {
        super(options);

        this.registerCapability(new capabilities.ViomiVoicePackManagementCapability({
            robot: this
        }));

        const quirkFactory = new ViomiQuirkFactory({
            robot: this
        });
        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                quirkFactory.getQuirk(ViomiQuirkFactory.KNOWN_QUIRKS.BUTTON_LEDS),
                quirkFactory.getQuirk(ViomiQuirkFactory.KNOWN_QUIRKS.OUTLINE_MODE),
            ]
        }));
    }

    getModelName() {
        return "V8";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(ViomiNoCloudRobot.DEVICE_CONF_PATH);
        return !!(deviceConf && ["viomi.vacuum.v8", "viomi.vacuum.v9"].includes(deviceConf.model));
    }
}

module.exports = ViomiV8NoCloudRobot;
