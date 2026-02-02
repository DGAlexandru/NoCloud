const capabilities = require("./capabilities");
const entities = require("../../entities");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const NoCloudRestrictedZone = require("../../entities/core/NoCloudRestrictedZone");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const RoborockNoCloudRobot = require("./RoborockNoCloudRobot");
const RoborockQuirkFactory = require("./RoborockQuirkFactory");

class RoborockS6NoCloudRobot extends RoborockNoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        super(Object.assign({}, options, {fanSpeeds: FAN_SPEEDS}));

        this.registerCapability(new capabilities.RoborockCombinedVirtualRestrictionsCapability({
            robot: this,
            supportedRestrictedZoneTypes: [
                NoCloudRestrictedZone.TYPE.REGULAR,
                NoCloudRestrictedZone.TYPE.MOP
            ]
        }));

        [
            capabilities.RoborockCarpetModeControlCapability,
            capabilities.RoborockHighResolutionManualControlCapability,
            capabilities.RoborockMapSegmentEditCapability,
            capabilities.RoborockMapSegmentRenameCapability,
            capabilities.RoborockMapSegmentationCapability,
            capabilities.RoborockMultiMapMapResetCapability,
            capabilities.RoborockMultiMapPersistentMapControlCapability,
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
        return "S6";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(RoborockNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && (deviceConf.model === "roborock.vacuum.s6" || deviceConf.model === "roborock.vacuum.t6"));
    }
}

const FAN_SPEEDS = {
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.LOW]: 101,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MEDIUM]: 102,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.HIGH]: 103,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MAX]: 104,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.OFF] : 105 //also known as mop mode
};

module.exports = RoborockS6NoCloudRobot;
