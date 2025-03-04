const capabilities = require("./capabilities");
const entities = require("../../entities");
const fs = require("fs");
const Logger = require("../../Logger");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const RoborockConst = require("./RoborockConst");
const RoborockGen4NoCloudRobot = require("./RoborockGen4NoCloudRobot");
const RoborockQuirkFactory = require("./RoborockQuirkFactory");
const RoborockNoCloudRobot = require("./RoborockNoCloudRobot");
const NoCloudRestrictedZone = require("../../entities/core/NoCloudRestrictedZone");

class RoborockG10SNoCloudRobot extends RoborockGen4NoCloudRobot {
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
                    dockType: RoborockConst.DOCK_TYPE.ULTRA
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
            capabilities.RoborockAutoEmptyDockAutoEmptyControlCapability,
            capabilities.RoborockAutoEmptyDockManualTriggerCapability,
            capabilities.RoborockMopDockCleanManualTriggerCapability,
            capabilities.RoborockMopDockDryManualTriggerCapability,
            capabilities.RoborockKeyLockCapability,
            capabilities.RoborockMappingPassCapability,
            capabilities.RoborockObstacleAvoidanceControlCapability,
            capabilities.RoborockPetObstacleAvoidanceControlCapability,
            capabilities.RoborockCollisionAvoidantNavigationControlCapability
        ].forEach(capability => {
            this.registerCapability(new capability({robot: this}));
        });

        const quirkFactory = new RoborockQuirkFactory({
            robot: this
        });
        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.AUTO_EMPTY_DURATION),
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_CLEANING_MODE),
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_CLEANING_FREQUENCY),
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.BUTTON_LEDS),
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.MOP_PATTERN),
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_AUTO_DRYING),
                quirkFactory.getQuirk(RoborockQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_AUTO_DRYING_TIME),
            ]
        }));
    }

    getModelName() {
        return "G10S";
    }

    getFirmwareVersion() {
        try {
            const rr_info = fs.readFileSync("/etc/rr-info").toString();
            const parsedFile = /^Version:(?<version>[\d._]*)$/m.exec(rr_info);

            if (parsedFile !== null && parsedFile.groups && parsedFile.groups.version) {
                return parsedFile.groups.version;
            } else {
                Logger.warn("Unable to determine the Firmware Version");

                return null;
            }
        } catch (e) {
            Logger.warn("Unable to determine the Firmware Version", e);

            return null;
        }
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(RoborockNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && deviceConf.model === "roborock.vacuum.a46");
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


module.exports = RoborockG10SNoCloudRobot;
