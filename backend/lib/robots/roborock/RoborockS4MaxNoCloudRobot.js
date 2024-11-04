const capabilities = require("./capabilities");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const RoborockGen4NoCloudRobot = require("./RoborockGen4NoCloudRobot");
const RoborockQuirkFactory = require("./RoborockQuirkFactory");
const RoborockNoCloudRobot = require("./RoborockNoCloudRobot");

class RoborockS4MaxNoCloudRobot extends RoborockGen4NoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        super(options);

        [
            capabilities.RoborockCombinedVirtualRestrictionsCapability
        ].forEach(capability => {
            this.registerCapability(new capability({robot: this}));
        });

        const quirkFactory = new RoborockQuirkFactory({
            robot: this
        });
        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.BUTTON_LEDS),
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.MANUAL_MAP_SEGMENT_TRIGGER)
            ]
        }));
    }
    getModelName() {
        return "S4 Max";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(RoborockNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && deviceConf.model === "roborock.vacuum.a19");
    }
}



module.exports = RoborockS4MaxNoCloudRobot;
