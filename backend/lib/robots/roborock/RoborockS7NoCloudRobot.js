const capabilities = require("./capabilities");
const entities = require("../../entities");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const NoCloudRestrictedZone = require("../../entities/core/NoCloudRestrictedZone");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const RoborockConst = require("./RoborockConst");
const RoborockGen4NoCloudRobot = require("./RoborockGen4NoCloudRobot");
const RoborockNoCloudRobot = require("./RoborockNoCloudRobot");
const RoborockQuirkFactory = require("./RoborockQuirkFactory");

class RoborockS7NoCloudRobot extends RoborockGen4NoCloudRobot {
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
                    waterGrades: WATER_GRADES,
                    supportedAttachments: SUPPORTED_ATTACHMENTS,
                    dockType: RoborockConst.DOCK_TYPE.AUTO_EMPTY
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

        this.registerCapability(new capabilities.RoborockCarpetSensorModeControlCapability({
            robot: this,
            liftModeId: 1
        }));

        [
            capabilities.RoborockAutoEmptyDockAutoEmptyDurationControlCapability,
            capabilities.RoborockAutoEmptyDockAutoEmptyIntervalControlCapability,
            capabilities.RoborockAutoEmptyDockManualTriggerCapability,
            capabilities.RoborockCleanRouteControlCapability,
            capabilities.RoborockKeyLockCapability,
            capabilities.RoborockMappingPassCapability
        ].forEach(capability => {
            this.registerCapability(new capability({robot: this}));
        });

        const quirkFactory = new RoborockQuirkFactory({
            robot: this
        });
        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                //quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.AUTO_EMPTY_DURATION),
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.BUTTON_LEDS),
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.STATUS_LED),
                //quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.MOP_PATTERN),
            ]
        }));
    }

    getModelName() {
        return "S7";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(RoborockNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && (deviceConf.model === "roborock.vacuum.a14" || deviceConf.model === "roborock.vacuum.a15"));
    }
}

const WATER_GRADES = {
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.OFF] : 200,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.LOW]: 201,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MEDIUM]: 202,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.HIGH]: 203
};

const SUPPORTED_ATTACHMENTS = [
    entities.state.attributes.AttachmentStateAttribute.TYPE.WATERTANK,
    entities.state.attributes.AttachmentStateAttribute.TYPE.MOP,
];


module.exports = RoborockS7NoCloudRobot;
