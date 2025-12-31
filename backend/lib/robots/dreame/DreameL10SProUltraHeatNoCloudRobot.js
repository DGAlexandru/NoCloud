const capabilities = require("./capabilities");
const DreameGen2NoCloudRobot = require("./DreameGen2NoCloudRobot");
const DreameGen4NoCloudRobot = require("./DreameGen4NoCloudRobot");
const DreameQuirkFactory = require("./DreameQuirkFactory");
const DreameNoCloudRobot = require("./DreameNoCloudRobot");
const entities = require("../../entities");
const Logger = require("../../Logger");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const NoCloudSelectionPreset = require("../../entities/core/NoCloudSelectionPreset");
const {IMAGE_FILE_FORMAT} = require("../../utils/const");

const stateAttrs = entities.state.attributes;

class DreameL10SProUltraHeatNoCloudRobot extends DreameGen4NoCloudRobot {

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
                {
                    operationModes: Object.freeze({
                        [stateAttrs.PresetSelectionStateAttribute.MODE.VACUUM_AND_MOP]: 0,
                        [stateAttrs.PresetSelectionStateAttribute.MODE.MOP]: 1,
                        [stateAttrs.PresetSelectionStateAttribute.MODE.VACUUM]: 2,
                    }),
                    highResolutionWaterGrades: true
                },
                options,
            )
        );

        this.registerCapability(new capabilities.DreameMapSegmentationCapability({
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
            segmentCleaningModeId: 18,
            iterationsSupported: 4,
            customOrderSupported: true
        }));

        const quirkFactory = new DreameQuirkFactory({
            robot: this
        });

        this.registerCapability(new capabilities.DreameWaterUsageControlCapability({
            robot: this,
            presets: Object.keys(this.waterGrades).map(k => {
                return new NoCloudSelectionPreset({name: k, value: this.waterGrades[k]});
            }),
            siid: DreameGen2NoCloudRobot.MIOT_SERVICES.MOP_EXPANSION.SIID,
            piid: DreameGen2NoCloudRobot.MIOT_SERVICES.MOP_EXPANSION.PROPERTIES.HIGH_RES_WATER_USAGE.PIID
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
            zoneCleaningModeId: 19,
            maxZoneCount: 4
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
                },
                mop: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.MOP.SIID,
                    piid: DreameGen2NoCloudRobot.MIOT_SERVICES.MOP.PROPERTIES.TIME_LEFT.PIID
                },
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
                },
                reset_mop: {
                    siid: DreameGen2NoCloudRobot.MIOT_SERVICES.MOP.SIID,
                    aiid: DreameGen2NoCloudRobot.MIOT_SERVICES.MOP.ACTIONS.RESET.AIID
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

        this.registerCapability(new capabilities.DreameCarpetSensorModeControlCapability({
            robot: this,
            liftSupported: true
        }));

        this.registerCapability(new capabilities.DreameObstacleImagesCapability({
            robot: this,
            fileFormat: IMAGE_FILE_FORMAT.JPG,
            dimensions: {
                width: 672,
                height: 504
            }
        }));

        [
            capabilities.DreameAICameraGoToLocationCapability,
            capabilities.DreameAICameraLineLaserObstacleAvoidanceControlCapability,
            //capabilities.DreameAICameraObstacleAvoidanceControlCapability,
            capabilities.DreameAutoEmptyDockAutoEmptyIntervalControlCapabilityV2,
            capabilities.DreameAutoEmptyDockManualTriggerCapability,
            capabilities.DreameCarpetModeControlCapability,
            capabilities.DreameCollisionAvoidantNavigationControlCapability,
            capabilities.DreameKeyLockCapability,
            capabilities.DreameMopDockCleanManualTriggerCapability,
            capabilities.DreameMopDockDryManualTriggerCapability,
            capabilities.DreameMopDockMopWashTemperatureControlCapabilityV1,
            capabilities.DreameMopExtensionControlCapabilityV1,
            capabilities.DreamePetObstacleAvoidanceControlCapability,
        ].forEach(capability => {
            this.registerCapability(new capability({robot: this}));
        });

        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.CAMERA_LIGHT),							//"bba079c2-293b-4ad5-99b8-4102a1220b12" : ["On", "Off"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.CARPET_DETECTION_AUTO_DEEP_CLEANING),		//"9450a668-88d7-4ff3-9455-a78b485fb33b" : ["On", "Off"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.CARPET_MODE_SENSITIVITY),					//"f8cb91ab-a47a-445f-b300-0aac0d4937c0" : ["low", "medium", "high"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.CLEAN_ROUTE),								//"ce44b688-f8bc-43a4-b44d-6db0d003c859" : ["Standard", "Intensive", "Deep"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.CLEAN_ROUTE_WITH_QUICK),					//"924c82a8-1c3f-4363-9303-e6158e0ca41c" : ["Standard", "Intensive", "Deep", "Quick"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.DETACH_MOPS),								//"4a52e16b-3c73-479d-b308-7f0bbdde0884" : ["On", "Off"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.DRAIN_INTERNAL_WATER_TANK),				//"3e1b0851-3a5a-4943-bea6-dea3d7284bff" : ["select_to_trigger", "trigger"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.EDGE_EXTENSION_FREQUENCY),				//"8f6a7013-794e-40d9-9bbe-8fdeed7c0b9d" : ["automatic", "each_cleanup", "every_7_days"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.EDGE_MOPPING),							//"7c71db1b-72b6-402e-89a4-d66c72cb9c8c" : ["off", "each_cleanup", "every_7_days"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_AUTO_DRYING),					//"6efc4d62-b5a4-474e-b353-5746a99ee8f9" : ["On", "Off"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_AUTO_REPAIR_TRIGGER),			//"ae753798-aa4f-4b35-a60c-91e7e5ae76f3" : ["select_to_trigger", "trigger"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_CLEANING_PROCESS_TRIGGER),		//"42c7db4b-2cad-4801-a526-44de8944a41f" : ["select_to_trigger", "trigger"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_DETERGENT),						//"a2a03d42-c710-45e5-b53a-4bc62778589f" : ["On", "Off", "Missing detergent cartridge"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_HIGH_RES_WATER_HEATER),			//"68c10990-8e38-4d79-8ef4-84a506752b0e" : ["off", "low", "medium", "high"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_CLEANING_FREQUENCY),			//"a6709b18-57af-4e11-8b4c-8ae33147ab34" : ["every_segment", "every_5_m2", "every_10_m2", "every_15_m2", "every_20_m2", "every_25_m2"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_ONLY_MODE),					//"6afbb882-c4c4-4672-b008-887454e6e0d1" : ["Vacuum and Mop", "Mop only", "Vacuum only", "Vacuum then Mop"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_UV_TREATMENT),					//"7f97b603-967f-44f0-9dfb-35bcdc21f433" : ["On", "Off"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_WATER_HEATER),					//"d6f07d8a-5708-478e-925f-42db1b58d016" : ["On", "Off"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_WATER_USAGE),					//"2d4ce805-ebf7-4dcf-b919-c5fe4d4f2de3" : ["low", "medium", "high"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_WET_DRY_SWITCH),					//"66adac0f-0a16-4049-b6ac-080ef702bb39" : ["Wet", "Dry"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DRYING_TIME),							//"516a1025-9c56-46e0-ac9b-a5007088d24a" : ["1h", "2h", "3h", "4h"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_EXTEND_EDGE_MOPPING),					//"5e1bbac8-78d1-433e-9868-4229463e2761" : ["off", "automatic", "each_cleanup", "every_7_days"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_EXTEND_EDGE_MOPPING_FURNITURE_LEGS),	//"08658d53-5d7b-4bfd-a179-25ceb3c70fe2" : ["On", "Off"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_EXTEND_EDGE_MOPPING_TWIST),			//"3759ae19-3723-4aad-a55e-4f9d8078185d" : ["On", "Off"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_EXTEND_EDGE_MOPPING_V2),				//"0c6dd70d-4a42-4400-a9ea-d4743015edbd" : ["On", "Off"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.SIDE_BRUSH_EXTEND),						//"e560d60c-76de-4ccc-8c01-8ccbcece850e" : ["On", "Off"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.SIDE_BRUSH_ON_CARPET),					//"d23d7e7e-ef74-42a6-8a0a-4163742e437b" : ["On", "Off"]
                //quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.TIGHT_MOP_PATTERN),						//"8471c118-f1e1-4866-ad2e-3c11865a5ba8" : ["On", "Off"]
                quirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.WATER_HOOKUP_TEST_TRIGGER),				//"86094736-d66e-40c3-807c-3f5ef33cbf09" : ["select_to_trigger", "trigger"]
            ]
        }));

        this.state.upsertFirstMatchingAttribute(new entities.state.attributes.DockStatusStateAttribute({
            value: entities.state.attributes.DockStatusStateAttribute.VALUE.IDLE
        }));

        this.state.upsertFirstMatchingAttribute(new entities.state.attributes.AttachmentStateAttribute({
            type: entities.state.attributes.AttachmentStateAttribute.TYPE.MOP,
            attached: false
        }));
    }

    parseAndUpdateState(data) {
        if (!Array.isArray(data)) {
            Logger.error("Received non-array state", data);
            return;
        }

        // Filter out everything that might confuse the regular state parsing
        return super.parseAndUpdateState(data.filter(e => {
            return (
                !(
                    e.siid === DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID &&
                    e.piid === DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.WATER_USAGE.PIID
                )
            );
        }));
    }

    getStatePropertiesToPoll() {
        const superProps = super.getStatePropertiesToPoll();

        return [
            ...superProps.filter(e => {
                return !(
                    e.siid === DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID &&
                    e.piid === DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.WATER_USAGE.PIID
                );
            }),

            {
                siid: DreameGen2NoCloudRobot.MIOT_SERVICES.AUTO_EMPTY_DOCK.SIID,
                piid: DreameGen2NoCloudRobot.MIOT_SERVICES.AUTO_EMPTY_DOCK.PROPERTIES.STATE.PIID
            },
            {
                siid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID,
                piid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.MOP_DOCK_STATUS.PIID
            },
            {
                siid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID,
                piid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.MOP_DOCK_SETTINGS.PIID
            }
        ];
    }


    getModelName() {
        return "L10S Pro Ultra Heat";
    }

    getModelDetails() {
        return Object.assign(
            {},
            super.getModelDetails(),
            {
                supportedAttachments: [
                    stateAttrs.AttachmentStateAttribute.TYPE.MOP,
                ]
            }
        );
    }


    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(DreameNoCloudRobot.DEVICE_CONF_PATH);

        return [
            "dreame.vacuum.r2338a",
            "dreame.vacuum.r2338",
        ].includes(deviceConf?.model);
    }
}


module.exports = DreameL10SProUltraHeatNoCloudRobot;
