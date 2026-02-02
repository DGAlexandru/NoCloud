const capabilities = require("./capabilities");
const entities = require("../../entities");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const NoCloudRestrictedZone = require("../../entities/core/NoCloudRestrictedZone");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const RoborockNoCloudRobot = require("./RoborockNoCloudRobot");
const RoborockQuirkFactory = require("./RoborockQuirkFactory");


class RoborockS6MaxVNoCloudRobot extends RoborockNoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        super(
            Object.assign(
                {},
                options,
                {
                    fanSpeeds: FAN_SPEEDS,
                    waterGrades: WATER_GRADES,
                }
            )
        );


        this.registerCapability(new capabilities.RoborockCombinedVirtualRestrictionsCapability({
            robot: this,
            supportedRestrictedZoneTypes: [
                NoCloudRestrictedZone.TYPE.REGULAR,
                NoCloudRestrictedZone.TYPE.MOP
            ]
        }));

        this.registerCapability(new capabilities.RoborockWaterUsageControlCapability({
            robot: this,
            presets: Object.keys(this.waterGrades).map(k => {
                return new entities.core.NoCloudSelectionPreset({name: k, value: this.waterGrades[k]});
            })
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
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.BUTTON_LEDS)
            ]
        }));
    }

    getModelName() {
        return "S6 MaxV";
    }

    getModelDetails() {
        return Object.assign(
            {},
            super.getModelDetails(),
            {
                supportedAttachments: [
                    entities.state.attributes.AttachmentStateAttribute.TYPE.WATERTANK,
                    entities.state.attributes.AttachmentStateAttribute.TYPE.MOP,
                ]
            }
        );
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(RoborockNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && (deviceConf.model === "roborock.vacuum.a10" || deviceConf.model === "roborock.vacuum.a09"));
    }
}

const FAN_SPEEDS = {
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.LOW]: 101,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MEDIUM]: 102,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.HIGH]: 103,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MAX]: 104,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.OFF] : 105 //also known as mop mode
};

const WATER_GRADES = {
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.OFF] : 200,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.LOW]: 201,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MEDIUM]: 202,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.HIGH]: 203
};

module.exports = RoborockS6MaxVNoCloudRobot;
