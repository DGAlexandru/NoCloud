const capabilities = require("./capabilities");
const DreameGen2LidarNoCloudRobot = require("./DreameGen2LidarNoCloudRobot");
const DreameGen2NoCloudRobot = require("./DreameGen2NoCloudRobot");
const DreameQuirkFactory = require("./DreameQuirkFactory");
const DreameNoCloudRobot = require("./DreameNoCloudRobot");
const entities = require("../../entities");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const NoCloudSelectionPreset = require("../../entities/core/NoCloudSelectionPreset");

class DreameZ10ProNoCloudRobot extends DreameGen2LidarNoCloudRobot {

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

        this.registerCapability(new capabilities.DreameWaterUsageControlCapability({
            robot: this,
            presets: Object.keys(this.waterGrades).map(k => {
                return new NoCloudSelectionPreset({name: k, value: this.waterGrades[k]});
            }),
            siid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID,
            piid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.WATER_USAGE.PIID
        }));

        this.registerCapability(new capabilities.DreameZoneCleaningCapability({
            robot: this,
            miot_actions: {
                start: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID,
                    aiid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.ACTIONS.START.AIID
                }
            },
            miot_properties: {
                mode: {
                    piid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.MODE.PIID
                },
                additionalCleanupParameters: {
                    piid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.ADDITIONAL_CLEANUP_PROPERTIES.PIID
                }
            },
            zoneCleaningModeId: 19
        }));

        this.registerCapability(new capabilities.DreameConsumableMonitoringCapability({
            robot: this,
            miot_properties: {
                main_brush: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.MAIN_BRUSH.SIID,
                    piid: DreameGen2NoCloudRobot.MIOT_SERVICES.MAIN_BRUSH.PROPERTIES.TIME_LEFT.PIID
                },
                side_brush: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.SIDE_BRUSH.SIID,
                    piid: DreameGen2NoCloudRobot.MIOT_SERVICES.SIDE_BRUSH.PROPERTIES.TIME_LEFT.PIID
                },
                filter: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.FILTER.SIID,
                    piid: DreameGen2NoCloudRobot.MIOT_SERVICES.FILTER.PROPERTIES.TIME_LEFT.PIID
                },
                sensor: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.SENSOR.SIID,
                    piid: DreameGen2NoCloudRobot.MIOT_SERVICES.SENSOR.PROPERTIES.TIME_LEFT.PIID
                }
            },
            miot_actions: {
                reset_main_brush: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.MAIN_BRUSH.SIID,
                    aiid: DreameGen2NoCloudRobot.MIOT_SERVICES.MAIN_BRUSH.ACTIONS.RESET.AIID
                },
                reset_side_brush: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.SIDE_BRUSH.SIID,
                    aiid: DreameGen2NoCloudRobot.MIOT_SERVICES.SIDE_BRUSH.ACTIONS.RESET.AIID
                },
                reset_filter: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.FILTER.SIID,
                    aiid: DreameGen2NoCloudRobot.MIOT_SERVICES.FILTER.ACTIONS.RESET.AIID
                },
                reset_sensor: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.SENSOR.SIID,
                    aiid: DreameGen2NoCloudRobot.MIOT_SERVICES.SENSOR.ACTIONS.RESET.AIID
                }
            },
        }));

        this.registerCapability(new capabilities.DreameOperationModeControlCapability({
            robot: this,
            presets: Object.keys(this.operationModes).map(k => {
                return new NoCloudSelectionPreset({name: k, value: this.operationModes[k]});
            }),
            siid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID,
            piid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.MOP_DOCK_SETTINGS.PIID
        }));

        [
            capabilities.DreameCarpetModeControlCapability,
            capabilities.DreameKeyLockCapability,
            capabilities.DreameAutoEmptyDockAutoEmptyControlCapability,
            capabilities.DreameAutoEmptyDockManualTriggerCapability,
            capabilities.DreameLineLaserObstacleAvoidanceControlCapability,
            capabilities.DreameAutoEmptyDockAutoEmptyIntervalControlCapabilityV1
        ].forEach(capability => {
            this.registerCapability(new capability({robot: this}));
        });

        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.CARPET_MODE_SENSITIVITY),
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.TIGHT_MOP_PATTERN),
            ]
        }));

        this.state.upsertFirstMatchingAttribute(new entities.state.attributes.DockStatusStateAttribute({
            value: entities.state.attributes.DockStatusStateAttribute.VALUE.IDLE
        }));

        this.state.upsertFirstMatchingAttribute(new entities.state.attributes.AttachmentStateAttribute({
            type: entities.state.attributes.AttachmentStateAttribute.TYPE.WATERTANK,
            attached: false
        }));
    }

    getStatePropertiesToPoll() {
        const superProps = super.getStatePropertiesToPoll();

        return [
            ...superProps,
            {
                siid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID,
                piid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.MOP_DOCK_SETTINGS.PIID
            }
        ];
    }

    getModelName() {
        return "Z10 Pro";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(DreameNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && (deviceConf.model === "dreame.vacuum.p2028" || deviceConf.model === "dreame.vacuum.p2028a"));
    }
}


module.exports = DreameZ10ProNoCloudRobot;
