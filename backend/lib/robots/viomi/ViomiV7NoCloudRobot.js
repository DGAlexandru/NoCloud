const capabilities = require("./capabilities");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const ViomiNoCloudRobot = require("./ViomiNoCloudRobot");
const ViomiQuirkFactory = require("./ViomiQuirkFactory");


class ViomiV7NoCloudRobot extends ViomiNoCloudRobot {
    /**
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     * @param {object} [options.fanSpeeds]
     * @param {object} [options.waterGrades]
     */
    constructor(options) {
        super(options);

        [
            capabilities.ViomiCleanRouteControlCapability,
        ].forEach(capability => {
            this.registerCapability(new capability({robot: this}));
        });

        const quirkFactory = new ViomiQuirkFactory({
            robot: this
        });
        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                quirkFactory.getQuirk(ViomiQuirkFactory.KNOWN_QUIRKS.BUTTON_LEDS),
                //quirkFactory.getQuirk(ViomiQuirkFactory.KNOWN_QUIRKS.MOP_PATTERN),
                quirkFactory.getQuirk(ViomiQuirkFactory.KNOWN_QUIRKS.OUTLINE_MODE),
            ]
        }));
    }

    getModelName() {
        return "V7";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(ViomiNoCloudRobot.DEVICE_CONF_PATH);
        return !!(deviceConf && deviceConf.model === "viomi.vacuum.v7");
    }
}

module.exports = ViomiV7NoCloudRobot;
