const capabilities = require("./capabilities");

const ConsumableMonitoringCapability = require("../../core/capabilities/ConsumableMonitoringCapability");
const DreameConst = require("./DreameConst");
const DreameMiotServices = require("./DreameMiotServices");
const DreameNoCloudRobot = require("./DreameNoCloudRobot");
const DreameUtils = require("./DreameUtils");
const entities = require("../../entities");
const ErrorStateNoCloudEvent = require("../../NoCloud_events/events/ErrorStateNoCloudEvent");
const LinuxTools = require("../../utils/LinuxTools");
const Logger = require("../../Logger");
const MopAttachmentReminderNoCloudEvent = require("../../NoCloud_events/events/MopAttachmentReminderNoCloudEvent");
const NoCloudRestrictedZone = require("../../entities/core/NoCloudRestrictedZone");
const NoCloudSelectionPreset = require("../../entities/core/NoCloudSelectionPreset");

const stateAttrs = entities.state.attributes;


const MIOT_SERVICES = DreameMiotServices["GEN2"];



class DreameGen2NoCloudRobot extends DreameNoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {object} options.operationModes
     * @param {boolean} [options.detailedAttachmentReport]
     * @param {boolean} [options.highResolutionWaterGrades]
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        super(
            Object.assign(
                {},
                {
                    operationModes: DreameGen2NoCloudRobot.OPERATION_MODES,
                    miotServices: {
                        MAP: MIOT_SERVICES.MAP
                    }
                },
                options,
            )
        );

        this.highResolutionWaterGrades = !!options.highResolutionWaterGrades;
        this.waterGrades = this.highResolutionWaterGrades ? DreameGen2NoCloudRobot.HIGH_RESOLUTION_WATER_GRADES : DreameNoCloudRobot.WATER_GRADES;

        this.detailedAttachmentReport = options.detailedAttachmentReport === true;

        /** @type {Array<{siid: number, piid: number, did: number}>} */
        this.statePropertiesToPoll = this.getStatePropertiesToPoll().map(e => {
            return {
                siid: e.siid,
                piid: e.piid,
                did:  this.deviceId
            };
        });

        this.ephemeralState = {
            autoEmptyDockState: undefined, // Might not be set depending on model
            errorCode: "0",
            isCharging: false,
            mode: 0, // Idle
            mopDockState: undefined, // Might not be set depending on model
            taskStatus: undefined,
        };

        this.registerCapability(new capabilities.DreameBasicControlCapability({
            robot: this,
            miot_actions: {
                start: {
                    siid: MIOT_SERVICES.VACUUM_1.SIID,
                    aiid: MIOT_SERVICES.VACUUM_1.ACTIONS.RESUME.AIID
                },
                stop: {
                    siid: MIOT_SERVICES.VACUUM_2.SIID,
                    aiid: MIOT_SERVICES.VACUUM_2.ACTIONS.STOP.AIID
                },
                pause: {
                    siid: MIOT_SERVICES.VACUUM_1.SIID,
                    aiid: MIOT_SERVICES.VACUUM_1.ACTIONS.PAUSE.AIID
                },
                home: {
                    siid: MIOT_SERVICES.BATTERY.SIID,
                    aiid: MIOT_SERVICES.BATTERY.ACTIONS.START_CHARGE.AIID
                }
            }
        }));

        this.registerCapability(new capabilities.DreameFanSpeedControlCapability({
            robot: this,
            presets: Object.keys(DreameNoCloudRobot.FAN_SPEEDS).map(k => {
                return new NoCloudSelectionPreset({name: k, value: DreameNoCloudRobot.FAN_SPEEDS[k]});
            }),
            siid: MIOT_SERVICES.VACUUM_2.SIID,
            piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.FAN_SPEED.PIID
        }));

        this.registerCapability(new capabilities.DreameLocateCapability({
            robot: this,
            siid: MIOT_SERVICES.AUDIO.SIID,
            aiid: MIOT_SERVICES.AUDIO.ACTIONS.LOCATE.AIID
        }));

        // Shared configuration for map-related capabilities
        const sharedMapCapabilityBody = {
            miot_actions: {
                map_edit: {
                    siid: MIOT_SERVICES.MAP.SIID,
                    aiid: MIOT_SERVICES.MAP.ACTIONS.EDIT.AIID
                }
            },
            miot_properties: {
                mapDetails: {
                    piid: MIOT_SERVICES.MAP.PROPERTIES.MAP_DETAILS.PIID
                },
                actionResult: {
                    piid: MIOT_SERVICES.MAP.PROPERTIES.ACTION_RESULT.PIID
                }
            }
        };
        // Register map-related capabilities using the shared config
        [
            capabilities.DreameMapSegmentEditCapability,
            capabilities.DreameMapSegmentRenameCapability,
            capabilities.DreameMapResetCapability,
            capabilities.DreamePendingMapChangeHandlingCapability
        ].forEach(capability => {
            this.registerCapability(new capability({
                robot: this,
                ...sharedMapCapabilityBody
            }));
        });
        // DreameCombinedVirtualRestrictionsCapability needs the extra supportedRestrictedZoneTypes
        this.registerCapability(new capabilities.DreameCombinedVirtualRestrictionsCapability({
            robot: this,
            supportedRestrictedZoneTypes: [
                NoCloudRestrictedZone.TYPE.REGULAR,
                NoCloudRestrictedZone.TYPE.MOP
            ],
            ...sharedMapCapabilityBody
        }));

        this.registerCapability(new capabilities.DreameSpeakerVolumeControlCapability({
            robot: this,
            siid: MIOT_SERVICES.AUDIO.SIID,
            piid: MIOT_SERVICES.AUDIO.PROPERTIES.VOLUME.PIID
        }));
        this.registerCapability(new capabilities.DreameSpeakerTestCapability({
            robot: this,
            siid: MIOT_SERVICES.AUDIO.SIID,
            aiid: MIOT_SERVICES.AUDIO.ACTIONS.VOLUME_TEST.AIID
        }));

        this.registerCapability(new capabilities.DreameTotalStatisticsCapability({
            robot: this,
            miot_properties: {
                time: {
                    siid: MIOT_SERVICES.TOTAL_STATISTICS.SIID,
                    piid: MIOT_SERVICES.TOTAL_STATISTICS.PROPERTIES.TIME.PIID
                },
                area: {
                    siid: MIOT_SERVICES.TOTAL_STATISTICS.SIID,
                    piid: MIOT_SERVICES.TOTAL_STATISTICS.PROPERTIES.AREA.PIID
                },
                count: {
                    siid: MIOT_SERVICES.TOTAL_STATISTICS.SIID,
                    piid: MIOT_SERVICES.TOTAL_STATISTICS.PROPERTIES.COUNT.PIID
                }
            }
        }));

        this.registerCapability(new capabilities.DreameCurrentStatisticsCapability({
            robot: this,
            miot_properties: {
                time: {
                    siid: MIOT_SERVICES.VACUUM_2.SIID,
                    piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.CLEANING_TIME.PIID
                },
                area: {
                    siid: MIOT_SERVICES.VACUUM_2.SIID,
                    piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.CLEANING_AREA.PIID
                }
            }
        }));

        [
            capabilities.DreameDoNotDisturbCapability,
            capabilities.DreameHighResolutionManualControlCapability,
            capabilities.DreameVoicePackManagementCapability,
            capabilities.DreameManualMIoTCommandCapability
        ].forEach(capability => {
            this.registerCapability(new capability({robot: this}));
        });
    }

    onIncomingCloudMessage(msg) {
        if (super.onIncomingCloudMessage(msg) === true) {
            return true;
        }

        switch (msg.method) {
            case "properties_changed": {
                msg.params.forEach(e => {
                    switch (e.siid) {
                        case MIOT_SERVICES.MAP.SIID: // 6
                            switch (e.piid) {
                                case MIOT_SERVICES.MAP.PROPERTIES.MAP_DATA.PIID:
                                    /*
                                        Most of the time, these will be P-Frames, which NoCloud ignores, however
                                        sometimes, they may be I-Frames as well. Usually that's right when a new map
                                        is being created, as then the map data is small enough to fit into a miio msg
                                     */
                                    this.preprocessAndParseMap(e.value).catch(err => {
                                        Logger.warn("Error while trying to parse map update", err);
                                    });
                                    break;
                            }
                            break;
                        case MIOT_SERVICES.VACUUM_1.SIID:        // 2
                        case MIOT_SERVICES.BATTERY.SIID:         // 3
                        case MIOT_SERVICES.VACUUM_2.SIID:        // 4
                        case MIOT_SERVICES.MAIN_BRUSH.SIID:      // 9
                        case MIOT_SERVICES.SIDE_BRUSH.SIID:      // 10
                        case MIOT_SERVICES.FILTER.SIID:          // 11
                        case MIOT_SERVICES.AUTO_EMPTY_DOCK.SIID: // 15
                        case MIOT_SERVICES.SENSOR.SIID:          // 16
                        case MIOT_SERVICES.SECONDARY_FILTER.SIID:// 17
                        case MIOT_SERVICES.MOP.SIID:             // 18
                        case MIOT_SERVICES.DETERGENT.SIID:       // 20
                        case MIOT_SERVICES.MISC_STATES.SIID:     // 27
                        case MIOT_SERVICES.MOP_EXPANSION.SIID:   // 28
                        case MIOT_SERVICES.WHEEL.SIID:           // 30
                            this.parseAndUpdateState([e]);
                            break;
                        case MIOT_SERVICES.DEVICE.SIID: // 1
                            // Intentionally ignored
                            break;
                        case MIOT_SERVICES.DND.SIID:             // 5
                        case MIOT_SERVICES.AUDIO.SIID:           // 7
                        case MIOT_SERVICES.PERSISTENT_MAPS.SIID: // 13
                            // Intentionally ignored since we only poll that info when required and therefore don't care about updates
                            break;
                        case MIOT_SERVICES.ROBOT_CONFIG.SIID: // 14
                            switch (e.piid) {
                                case MIOT_SERVICES.ROBOT_CONFIG.PROPERTIES.CONFIG.PIID:
                                    Logger.warn(`Unhandled property change! ROBOT_CONFIG (${e.siid}) : CONFIG (${e.piid}). Full message:`, e);
                                    break;
                                default:
                                    Logger.warn(`Unhandled property change! ROBOT_CONFIG (${e.siid}) : UNKNOWN (${e.piid}). Full message:`, e);
                                    break;
                            }
                            break;
                        case MIOT_SERVICES.TIMERS.SIID:           // 8
                        case MIOT_SERVICES.TOTAL_STATISTICS.SIID: // 12
                            // Intentionally left blank (for now?)
                            break;
                        case MIOT_SERVICES.SILVER_ION.SIID: // 19
                        case 21: // Something else that also seems to be some kind of consumable?
                            // Intentionally ignored for now, because I have no idea what that should be or where it could be located
                            // TODO: figure out
                            break;
                        case MIOT_SERVICES.SQUEEGEE.SIID: // 24
                            switch (e.piid) {
                                case MIOT_SERVICES.SQUEEGEE.PROPERTIES.LEFT.PIID:
                                    Logger.warn(`Unhandled property change! SQUEEGEE (${e.siid}) : LEFT (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.SQUEEGEE.PROPERTIES.TIME_LEFT.PIID:
                                    Logger.warn(`Unhandled property change! SQUEEGEE (${e.siid}) : TIME_LEFT (${e.piid}). Full message:`, e);
                                    break;
                                default:
                                    Logger.warn(`Unhandled property change! SQUEEGEE (${e.siid}) : UNKNOWN (${e.piid}). Full message:`, e);
                                    break;
                            }
                            break;
                        case MIOT_SERVICES.ONBOARD_DIRTY_WATER_TANK.SIID: // 25
                            switch (e.piid) {
                                case MIOT_SERVICES.ONBOARD_DIRTY_WATER_TANK.PROPERTIES.LEFT.PIID:
                                    Logger.warn(`Unhandled property change! ONBOARD_DIRTY_WATER_TANK (${e.siid}) : LEFT (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.ONBOARD_DIRTY_WATER_TANK.PROPERTIES.TIME_LEFT.PIID:
                                    Logger.warn(`Unhandled property change! ONBOARD_DIRTY_WATER_TANK (${e.siid}) : TIME_LEFT (${e.piid}). Full message:`, e);
                                    break;
                                default:
                                    Logger.warn(`Unhandled property change! ONBOARD_DIRTY_WATER_TANK (${e.siid}) : UNKNOWN (${e.piid}). Full message:`, e);
                                    break;
                            }
                            break;
                        case MIOT_SERVICES.DIRTY_WATER_TANK.SIID: // 26
                            switch (e.piid) {
                                case MIOT_SERVICES.DIRTY_WATER_TANK.PROPERTIES.LEFT.PIID:
                                    Logger.warn(`Unhandled property change! DIRTY_WATER_TANK (${e.siid}) : LEFT (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.DIRTY_WATER_TANK.PROPERTIES.TIME_LEFT.PIID:
                                    Logger.warn(`Unhandled property change! DIRTY_WATER_TANK (${e.siid}) : TIME_LEFT (${e.piid}). Full message:`, e);
                                    break;
                                default:
                                    Logger.warn(`Unhandled property change! DIRTY_WATER_TANK (${e.siid}) : UNKNOWN (${e.piid}). Full message:`, e);
                                    break;
                            }
                            break;
                        case MIOT_SERVICES.DEODORIZER.SIID: // 29
                            switch (e.piid) {
                                case MIOT_SERVICES.DEODORIZER.PROPERTIES.TIME_LEFT.PIID:
                                    Logger.warn(`Unhandled property change! DEODORIZER (${e.siid}) : TIME_LEFT (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.DEODORIZER.PROPERTIES.PERCENT_LEFT.PIID:
                                    Logger.warn(`Unhandled property change! DEODORIZER (${e.siid}) : PERCENT_LEFT (${e.piid}). Full message:`, e);
                                    break;
                                default:
                                    Logger.warn(`Unhandled property change! DEODORIZER (${e.siid}) : UNKNOWN (${e.piid}). Full message:`, e);
                                    break;
                            }
                            break;
                        case MIOT_SERVICES.SCALE_INHIBITOR.SIID: // 31
                            switch (e.piid) {
                                case MIOT_SERVICES.SCALE_INHIBITOR.PROPERTIES.TIME_LEFT.PIID:
                                    Logger.warn(`Unhandled property change! SCALE_INHIBITOR (${e.siid}) : TIME_LEFT (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.SCALE_INHIBITOR.PROPERTIES.PERCENT_LEFT.PIID:
                                    Logger.warn(`Unhandled property change! SCALE_INHIBITOR (${e.siid}) : PERCENT_LEFT (${e.piid}). Full message:`, e);
                                    break;
                                default:
                                    Logger.warn(`Unhandled property change! SCALE_INHIBITOR (${e.siid}) : UNKNOWN (${e.piid}). Full message:`, e);
                                    break;
                            }
                            break;
                        case MIOT_SERVICES.FACTORY_TEST.SIID: // 99 //Is this a duplicate of the device service - SIID: 1?
                            switch (e.piid) {
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.STATUS.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : STATUS (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.RESULT.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : RESULT (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.SELF_TEST_STATUS.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : SELF_TEST_STATUS (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.LSD_TEST_STATUS.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : LSD_TEST_STATUS (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.DEBUG_SWITCH.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : DEBUG_SWITCH (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.SERIAL.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : SERIAL (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.CALIBRATION_STATUS.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : CALIBRATION_STATUS (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.VERSION.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : VERSION (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.PERFORMANCE_SWITCH.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : PERFORMANCE_SWITCH (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.AI_TEST_STATUS.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : AI_TEST_STATUS (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.PUBLIC_KEY.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : PUBLIC_KEY (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.AUTO_PAIR.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : AUTO_PAIR (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.MCU_VERSION.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : MCU_VERSION (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.MOP_TEST_STATUS.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : MOP_TEST_STATUS (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.FACTORY_TEST.PROPERTIES.PLATFORM_NETWORK.PIID:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : PLATFORM_NETWORK (${e.piid}). Full message:`, e);
                                    break;
                                default:
                                    Logger.warn(`Unhandled property change! FACTORY_TEST (${e.siid}) : UNKNOWN (${e.piid}). Full message:`, e);
                                    break;
                            }
                            break;
                        case MIOT_SERVICES.STREAM.SIID: // 10001
                            /*
                                Seems to have something to do with the AI camera
                                Sample value: {"operType":"properties_changed","operation":"monitor","result":0,"status":0}
                             */
                            //Intentionally ignored
                            switch (e.piid) {
                                case MIOT_SERVICES.STREAM.PROPERTIES.STATUS.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : STATUS (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.AUDIO.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : AUDIO (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.RECORD.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : RECORD (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.TAKE_PHOTO.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : TAKE_PHOTO (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.KEEP_ALIVE.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : KEEP_ALIVE (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.FAULT.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : FAULT (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.CAMERA_LIGHT_BRIGHTNESS.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : CAMERA_LIGHT_BRIGHTNESS (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.CAMERA_LIGHT.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : CAMERA_LIGHT (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.VENDOR.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : VENDOR (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.PROPERTY.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : PROPERTY (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.CRUISE_POINT.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : CRUISE_POINT (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.TASK.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : TASK (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.STEAM_HUMAN_FOLLOW.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : STEAM_HUMAN_FOLLOW (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.OBSTACLE_VIDEO_STATUS.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : OBSTACLE_VIDEO_STATUS (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.OBSTACLE_VIDEO_DATA.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : OBSTACLE_VIDEO_DATA (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.UPLOAD.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : UPLOAD (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.CODE.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : CODE (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.SET_CODE.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : SET_CODE (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.VERIFY_CODE.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : VERIFY_CODE (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.RESET_CODE.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : RESET_CODE (${e.piid}). Full message:`, e);
                                    break;
                                case MIOT_SERVICES.STREAM.PROPERTIES.SPACE.PIID:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : SPACE (${e.piid}). Full message:`, e);
                                    break;
                                default:
                                    Logger.warn(`Unhandled property change! STREAM (${e.siid}) : UNKNOWN (${e.piid}). Full message:`, e);
                                    break;
                            }
                            break;
                        default:
                            Logger.warn(`Unhandled property change: SIID=${e.siid} : PIID=${e.piid}! Full message: `, e);
                    }
                });

                this.sendCloud({id: msg.id, "result":"ok"}).catch((err) => {
                    Logger.warn("Error while sending cloud ack", err);
                });
                return true;
            }
            case "props":
                if (msg.params && msg.params.ota_state) {
                    this.sendCloud({id: msg.id, "result":"ok"}).catch((err) => {
                        Logger.warn("Error while sending cloud ack", err);
                    });
                    return true;
                }
                break;
            case "event_occured": {
                // This is sent by the robot after a cleanup has finished.
                // It will contain the parameters of that past cleanup
                // Therefore, we ignore it in our current status

                this.sendCloud({id: msg.id, "result":"ok"}).catch((err) => {
                    Logger.warn("Error while sending cloud ack", err);
                });
                return true;
            }
            case "ali_lic": {
                // ignore
                return true;
            }
            case "vendor_lic": {
                // ignore
                return true;
            }
            case "lwt": {
                // ignore
                return true;
            }
            case "_sync.update_vacuum_mapinfo": {
                // ignore
                return true;
            }
            case "dev_auth":
                // actually replying to it leads to timeouts for reasons I do not care enough about to debug
                // However, not replying at all will not make the firmware unhappy, so ignoring it is safe
                /*this.sendCloud({
                    id: msg.id,
                    method: "dev_auth",
                    params: { code: 200 }
                }).catch((err) => {
                    Logger.warn("Error while sending cloud ok", err);
                }); */
                return true;
            default:
                Logger.warn(`Unhandled onIncomingCloudMessage method: ${msg.method}. This returns false.`);
        }
        return false;
    }

    /**
     * May be extended by children
     *
     * @return {Array<{piid: number, siid: number}>}
     */
    getStatePropertiesToPoll() {
        const properties = [
            {
                siid: MIOT_SERVICES.VACUUM_2.SIID,
                piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.MODE.PIID
            },
            {
                siid: MIOT_SERVICES.VACUUM_2.SIID,
                piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.TASK_STATUS.PIID
            },
            {
                siid: MIOT_SERVICES.VACUUM_2.SIID,
                piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.FAN_SPEED.PIID
            },
            {
                siid: MIOT_SERVICES.VACUUM_2.SIID,
                piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.WATER_TANK_ATTACHMENT.PIID
            },
            {
                siid: MIOT_SERVICES.VACUUM_2.SIID,
                piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.ERROR_CODE.PIID
            },
            {
                siid: MIOT_SERVICES.BATTERY.SIID,
                piid: MIOT_SERVICES.BATTERY.PROPERTIES.LEVEL.PIID
            },
            {
                siid: MIOT_SERVICES.BATTERY.SIID,
                piid: MIOT_SERVICES.BATTERY.PROPERTIES.CHARGING.PIID
            }
        ];

        if (this.highResolutionWaterGrades) {
            properties.push({
                siid: MIOT_SERVICES.MOP_EXPANSION.SIID,
                piid: MIOT_SERVICES.MOP_EXPANSION.PROPERTIES.HIGH_RES_WATER_USAGE.PIID
            });
        } else {
            properties.push({
                siid: MIOT_SERVICES.VACUUM_2.SIID,
                piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.WATER_USAGE.PIID
            });
        }

        return properties;
    }

    async pollState() {
        const response = await this.sendCommand(
            "get_properties",
            this.statePropertiesToPoll
        );

        if (response) {
            this.parseAndUpdateState(response);
        }

        return this.state;
    }


    parseAndUpdateState(data) {
        if (!Array.isArray(data)) {
            Logger.error("Received non-array state", data);
            return;
        }

        let statusNeedsUpdate = false;
        let dockStatusNeedsUpdate = false;

        for (const elem of data) {
            switch (elem.siid) {
                case MIOT_SERVICES.VACUUM_1.SIID: {
                    //intentionally left blank since there's nothing here that isn't also in VACUUM_2
                    //
                    // Update 2024-06-04: Dreame repurposed PIID 1 on newer robots such as the X40.
                    // It now doesn't contain the same as VACUUM_2 MODE but instead a new and extended status enum
                    // with stuff such as "returning to the dock to install mops"
                    // At the time of writing, the "old" VACUUM_2 MODE still works, so no need to map these for now
                    break;
                }

                case MIOT_SERVICES.VACUUM_2.SIID: {
                    switch (elem.piid) {
                        case MIOT_SERVICES.VACUUM_2.PROPERTIES.MODE.PIID: {
                            this.ephemeralState.mode = elem.value;

                            statusNeedsUpdate = true;
                            break;
                        }
                        case MIOT_SERVICES.VACUUM_2.PROPERTIES.ERROR_CODE.PIID: {
                            this.ephemeralState.errorCode = elem.value ?? "";

                            statusNeedsUpdate = true;
                            break;
                        }
                        case MIOT_SERVICES.VACUUM_2.PROPERTIES.TASK_STATUS.PIID: {
                            this.ephemeralState.taskStatus = elem.value;

                            statusNeedsUpdate = true;
                            break;
                        }
                        case MIOT_SERVICES.VACUUM_2.PROPERTIES.FAN_SPEED.PIID: {
                            let matchingFanSpeed = Object.keys(DreameNoCloudRobot.FAN_SPEEDS).find(key => {
                                return DreameNoCloudRobot.FAN_SPEEDS[key] === elem.value;
                            });

                            if (matchingFanSpeed === undefined) {
                                Logger.warn(`Received unknown fan speed ${elem.value}`);
                            }

                            this.state.upsertFirstMatchingAttribute(new stateAttrs.PresetSelectionStateAttribute({
                                metaData: {
                                    rawValue: elem.value
                                },
                                type: stateAttrs.PresetSelectionStateAttribute.TYPE.FAN_SPEED,
                                value: matchingFanSpeed
                            }));
                            break;
                        }

                        case MIOT_SERVICES.VACUUM_2.PROPERTIES.WATER_USAGE.PIID: {
                            let matchingWaterGrade = Object.keys(this.waterGrades).find(key => {
                                return this.waterGrades[key] === elem.value;
                            });

                            if (matchingWaterGrade === undefined) {
                                Logger.warn(`Received unknown water grade ${elem.value}`);
                            }

                            this.state.upsertFirstMatchingAttribute(new stateAttrs.PresetSelectionStateAttribute({
                                metaData: {
                                    rawValue: elem.value
                                },
                                type: stateAttrs.PresetSelectionStateAttribute.TYPE.WATER_GRADE,
                                value: matchingWaterGrade
                            }));
                            break;
                        }
                        case MIOT_SERVICES.VACUUM_2.PROPERTIES.WATER_TANK_ATTACHMENT.PIID: {
                            const supportedAttachments = this.getModelDetails().supportedAttachments;
                            const parsedAttachmentStates = {
                                [stateAttrs.AttachmentStateAttribute.TYPE.WATERTANK]: elem.value !== 0,
                                [stateAttrs.AttachmentStateAttribute.TYPE.MOP]: elem.value !== 0,
                            };

                            if (this.detailedAttachmentReport) {
                                parsedAttachmentStates[stateAttrs.AttachmentStateAttribute.TYPE.WATERTANK] = !!(elem.value & 0b01);
                                parsedAttachmentStates[stateAttrs.AttachmentStateAttribute.TYPE.MOP] = !!(elem.value & 0b10);
                            }


                            if (supportedAttachments.includes(stateAttrs.AttachmentStateAttribute.TYPE.WATERTANK)) {
                                this.state.upsertFirstMatchingAttribute(new stateAttrs.AttachmentStateAttribute({
                                    type: stateAttrs.AttachmentStateAttribute.TYPE.WATERTANK,
                                    attached: parsedAttachmentStates[stateAttrs.AttachmentStateAttribute.TYPE.WATERTANK]
                                }));
                            }

                            if (supportedAttachments.includes(stateAttrs.AttachmentStateAttribute.TYPE.MOP)) {
                                this.state.upsertFirstMatchingAttribute(new stateAttrs.AttachmentStateAttribute({
                                    type: stateAttrs.AttachmentStateAttribute.TYPE.MOP,
                                    attached: parsedAttachmentStates[stateAttrs.AttachmentStateAttribute.TYPE.MOP]
                                }));
                            }

                            break;
                        }
                        case MIOT_SERVICES.VACUUM_2.PROPERTIES.MOP_DOCK_STATUS.PIID: {
                            this.ephemeralState.mopDockState = elem.value;
                            dockStatusNeedsUpdate = true;

                            break;
                        }
                        case MIOT_SERVICES.VACUUM_2.PROPERTIES.MOP_DOCK_SETTINGS.PIID: {
                            const deserializedValue = DreameUtils.DESERIALIZE_MOP_DOCK_SETTINGS(elem.value);

                            let matchingOperationMode = Object.keys(this.operationModes).find(key => {
                                return this.operationModes[key] === deserializedValue.operationMode;
                            });

                            if (matchingOperationMode === undefined) {
                                Logger.warn(`Received unknown operation mode ${elem.value}`);
                            }

                            this.state.upsertFirstMatchingAttribute(new stateAttrs.PresetSelectionStateAttribute({
                                type: stateAttrs.PresetSelectionStateAttribute.TYPE.OPERATION_MODE,
                                value: matchingOperationMode
                            }));
                            break;
                        }

                        case DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.MISC_TUNABLES.PIID: {
                            const deserializedTunables = DreameUtils.DESERIALIZE_MISC_TUNABLES(elem.value);

                            if (deserializedTunables.SmartHost > 0) {
                                Logger.info("Disabling CleanGenius");
                                // CleanGenius breaks most controls in NoCloud without any user feedback
                                // Thus, we just automatically disable it instead of making every functionality aware of it

                                this.helper.writeProperty(
                                    DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID,
                                    DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.MISC_TUNABLES.PIID,
                                    DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE({
                                        SmartHost: 0
                                    })
                                ).catch(e => {
                                    Logger.warn("Error while disabling CleanGenius", e);
                                });
                            }

                            if (deserializedTunables.FluctuationConfirmResult > 0) {
                                if (deserializedTunables.FluctuationTestResult !== 6) { // 6 Means success
                                    const errorString = DreameConst.WATER_HOOKUP_ERRORS[deserializedTunables.FluctuationTestResult];

                                    this.NoCloudEventStore.raise(new ErrorStateNoCloudEvent({
                                        message: `Water Hookup Error. ${errorString ?? "Unknown error " + deserializedTunables.FluctuationTestResult}`
                                    }));
                                }


                                this.helper.writeProperty(
                                    DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID,
                                    DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.MISC_TUNABLES.PIID,
                                    DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE({
                                        FluctuationConfirmResult: 0
                                    })
                                ).catch(e => {
                                    Logger.warn("Error while confirming water hookup test result", e);
                                });
                            }

                            break;
                        }
                    }
                    break;
                }
                case MIOT_SERVICES.BATTERY.SIID: {
                    switch (elem.piid) {
                        case MIOT_SERVICES.BATTERY.PROPERTIES.LEVEL.PIID:
                            this.state.upsertFirstMatchingAttribute(new stateAttrs.BatteryStateAttribute({
                                level: elem.value
                            }));
                            break;
                        case MIOT_SERVICES.BATTERY.PROPERTIES.CHARGING.PIID:
                            /*
                                1 = On Charger
                                2 = Not on Charger
                                5 = Returning to Charger
                             */
                            this.isCharging = elem.value === 1;
                            statusNeedsUpdate = true;
                            break;
                    }
                    break;
                }

                case MIOT_SERVICES.MAIN_BRUSH.SIID:
                case MIOT_SERVICES.SIDE_BRUSH.SIID:
                case MIOT_SERVICES.FILTER.SIID:
                case MIOT_SERVICES.SENSOR.SIID:
                case MIOT_SERVICES.MOP.SIID:
                case MIOT_SERVICES.SECONDARY_FILTER.SIID:
                case MIOT_SERVICES.DETERGENT.SIID:
                case MIOT_SERVICES.WHEEL.SIID:
                    if (this.capabilities[ConsumableMonitoringCapability.TYPE]) {
                        this.capabilities[ConsumableMonitoringCapability.TYPE].parseConsumablesMessage(elem);
                    }
                    break;
                case MIOT_SERVICES.MOP_EXPANSION.SIID: {
                    switch (elem.piid) {
                        case MIOT_SERVICES.MOP_EXPANSION.PROPERTIES.HIGH_RES_WATER_USAGE.PIID: {
                            let matchingWaterGrade = Object.keys(this.waterGrades).find(key => {
                                return this.waterGrades[key] === elem.value;
                            });

                            if (matchingWaterGrade === undefined) {
                                Logger.warn(`Received unknown water grade ${elem.value}`);
                            }

                            this.state.upsertFirstMatchingAttribute(new stateAttrs.PresetSelectionStateAttribute({
                                metaData: {
                                    rawValue: elem.value
                                },
                                type: stateAttrs.PresetSelectionStateAttribute.TYPE.WATER_GRADE,
                                value: matchingWaterGrade
                            }));
                            break;
                        }
                    }
                    break;
                }
                case MIOT_SERVICES.AUTO_EMPTY_DOCK.SIID: {
                    switch (elem.piid) {
                        case MIOT_SERVICES.AUTO_EMPTY_DOCK.PROPERTIES.STATE.PIID: {
                            this.ephemeralState.autoEmptyDockState = elem.value;
                            dockStatusNeedsUpdate = true;

                            break;
                        }
                    }
                    break;
                }
                case MIOT_SERVICES.MISC_STATES.SIID: {
                    const supportedDockComponents = this.getModelDetails().supportedDockComponents;

                    switch (elem.piid) {
                        case MIOT_SERVICES.MISC_STATES.PROPERTIES.DOCK_FRESHWATER_TANK_ATTACHMENT.PIID: {
                            if (supportedDockComponents.includes(stateAttrs.DockComponentStateAttribute.TYPE.WATER_TANK_CLEAN)) {
                                let value = stateAttrs.DockComponentStateAttribute.VALUE.UNKNOWN;

                                switch (elem.value) {
                                    case 0:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.OK;
                                        break;
                                    case 1:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.MISSING;
                                        break;
                                    case 2:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.EMPTY;
                                        break;
                                    case 3: // Permanent freshwater connection (observed on the X40 Master)
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.OK;
                                        break;
                                }
                                this.state.upsertFirstMatchingAttribute(new stateAttrs.DockComponentStateAttribute({
                                    type: stateAttrs.DockComponentStateAttribute.TYPE.WATER_TANK_CLEAN,
                                    value: value
                                }));
                            }
                            break;
                        }
                        case MIOT_SERVICES.MISC_STATES.PROPERTIES.DOCK_WASTEWATER_TANK_ATTACHMENT.PIID: {
                            if (supportedDockComponents.includes(stateAttrs.DockComponentStateAttribute.TYPE.WATER_TANK_DIRTY)) {
                                let value = stateAttrs.DockComponentStateAttribute.VALUE.UNKNOWN;

                                switch (elem.value) {
                                    case 0:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.OK;
                                        break;
                                    case 1:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.FULL;
                                        break;
                                }
                                this.state.upsertFirstMatchingAttribute(new stateAttrs.DockComponentStateAttribute({
                                    type: stateAttrs.DockComponentStateAttribute.TYPE.WATER_TANK_DIRTY,
                                    value: value
                                }));
                            }
                            break;
                        }
                        case MIOT_SERVICES.MISC_STATES.PROPERTIES.DOCK_DUSTBAG_ATTACHMENT.PIID: {
                            if (supportedDockComponents.includes(stateAttrs.DockComponentStateAttribute.TYPE.DUSTBAG)) {
                                let value = stateAttrs.DockComponentStateAttribute.VALUE.UNKNOWN;

                                switch (elem.value) {
                                    case 0:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.OK;
                                        break;
                                    case 1:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.MISSING;
                                        break;
                                    case 2:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.FULL;
                                        break;
                                }
                                this.state.upsertFirstMatchingAttribute(new stateAttrs.DockComponentStateAttribute({
                                    type: stateAttrs.DockComponentStateAttribute.TYPE.DUSTBAG,
                                    value: value
                                }));
                            }
                            break;
                        }
                        case MIOT_SERVICES.MISC_STATES.PROPERTIES.DOCK_DETERGENT_ATTACHMENT.PIID: {
                            if (supportedDockComponents.includes(stateAttrs.DockComponentStateAttribute.TYPE.DETERGENT)) {
                                let value = stateAttrs.DockComponentStateAttribute.VALUE.UNKNOWN;

                                switch (elem.value) {
                                    case 0:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.OK;
                                        break;
                                    case 1:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.MISSING;
                                        break;
                                    case 2:
                                        value = stateAttrs.DockComponentStateAttribute.VALUE.EMPTY;
                                        break;
                                }
                                this.state.upsertFirstMatchingAttribute(new stateAttrs.DockComponentStateAttribute({
                                    type: stateAttrs.DockComponentStateAttribute.TYPE.DETERGENT,
                                    value: value
                                }));
                            }
                            break;
                        }
                    }
                    break;
                }
                default:
                    Logger.warn(`Unhandled property update: SIID=${elem.siid} : PIID=${elem.piid}! Full message: `, elem);
            }
        }

        if (statusNeedsUpdate === true) {
            let newState;
            let statusValue;
            let statusFlag;
            let statusError;
            let statusMetaData = {};

            /*
                Somewhere in 2022, Dreame firmwares gained the ability to report multiple error codes at once
                only separated by a comma. At the time of writing, the NoCloud abstraction does not support that.
                
                Most of the time, it's two codes with one code being a non-error reminder error code.
                Additionally, in all reported cases where there were two actual error codes, both of them mapped
                to the same error type and description in NoCloud.
                
                We can therefore simply filter the non-error codes and pick the first remaining element.
             */
            if (this.ephemeralState.errorCode.includes(",")) {
                let errorArray = this.ephemeralState.errorCode.split(",");

                errorArray = errorArray.filter(e => !["68", "114", "122"].includes(e));

                this.ephemeralState.errorCode = errorArray[0] ?? "";
            }


            if (this.ephemeralState.errorCode === "0" || this.ephemeralState.errorCode === "") {
                statusValue = DreameNoCloudRobot.STATUS_MAP[this.ephemeralState.mode]?.value ?? stateAttrs.StatusStateAttribute.VALUE.IDLE;
                statusFlag = DreameNoCloudRobot.STATUS_MAP[this.ephemeralState.mode]?.flag;

                if (statusValue === stateAttrs.StatusStateAttribute.VALUE.DOCKED && this.ephemeralState.taskStatus !== 0) {
                    // Robot has a pending task but is charging due to low battery and will resume when battery >= 80%
                    statusFlag = stateAttrs.StatusStateAttribute.FLAG.RESUMABLE;
                } else if (statusValue === stateAttrs.StatusStateAttribute.VALUE.IDLE && statusFlag === undefined && this.isCharging === true) {
                    statusValue = stateAttrs.StatusStateAttribute.VALUE.DOCKED;
                }
            } else {
                if (this.ephemeralState.errorCode === "68") { // Docked with mop still attached. For some reason, dreame decided to have this as an error
                    statusValue = stateAttrs.StatusStateAttribute.VALUE.DOCKED;

                    if (!this.hasCapability(capabilities.DreameMopDockDryManualTriggerCapability.TYPE)) {
                        this.NoCloudEventStore.raise(new MopAttachmentReminderNoCloudEvent({}));
                    }
                } else if (this.ephemeralState.errorCode === "114") { // Reminder message to regularly clean the mop dock
                    statusValue = stateAttrs.StatusStateAttribute.VALUE.DOCKED;
                } else if (this.ephemeralState.errorCode === "122") { // Apparently just an info that the water hookup (kit) worked successfully?
                    statusValue = stateAttrs.StatusStateAttribute.VALUE.DOCKED;
                } else {
                    statusValue = stateAttrs.StatusStateAttribute.VALUE.ERROR;

                    statusError = DreameNoCloudRobot.MAP_ERROR_CODE(this.ephemeralState.errorCode);
                }

            }

            newState = new stateAttrs.StatusStateAttribute({
                value: statusValue,
                flag: statusFlag,
                metaData: statusMetaData,
                error: statusError
            });

            this.state.upsertFirstMatchingAttribute(newState);

            if (newState.isActiveState) {
                this.pollMap();
            }
        }

        if (dockStatusNeedsUpdate === true) {
            const mappedMopDockState = DreameNoCloudRobot.MOP_DOCK_STATUS_MAP[this.ephemeralState.mopDockState];
            const mappedAutoEmptyDockState = DreameNoCloudRobot.AUTO_EMPTY_DOCK_STATUS_MAP[this.ephemeralState.autoEmptyDockState];

            let fullDockState = mappedMopDockState ?? stateAttrs.DockStatusStateAttribute.VALUE.IDLE;
            if (mappedAutoEmptyDockState && mappedAutoEmptyDockState !== stateAttrs.DockStatusStateAttribute.VALUE.IDLE) {
                fullDockState = mappedAutoEmptyDockState;
            }

            this.state.upsertFirstMatchingAttribute(new stateAttrs.DockStatusStateAttribute({
                value: fullDockState
            }));
        }



        this.emitStateAttributesUpdated();
    }

    startup() {
        super.startup();

        if (this.config.get("embedded") === true) {
            try {
                const parsedCmdline = LinuxTools.READ_PROC_CMDLINE();

                if (parsedCmdline.partitions[parsedCmdline.root]) {
                    Logger.info(`Current rootfs: ${parsedCmdline.partitions[parsedCmdline.root]} (${parsedCmdline.root})`);
                }
            } catch (e) {
                Logger.warn("Unable to read /proc/cmdline", e);
            }
        }
    }
}

DreameGen2NoCloudRobot.MIOT_SERVICES = MIOT_SERVICES;

DreameGen2NoCloudRobot.OPERATION_MODES = Object.freeze({
    [stateAttrs.PresetSelectionStateAttribute.MODE.VACUUM]: 0,
    [stateAttrs.PresetSelectionStateAttribute.MODE.MOP]: 1,
    [stateAttrs.PresetSelectionStateAttribute.MODE.VACUUM_AND_MOP]: 2,
});

DreameGen2NoCloudRobot.HIGH_RESOLUTION_WATER_GRADES = Object.freeze({
    [stateAttrs.PresetSelectionStateAttribute.INTENSITY.MIN]: 1,
    [stateAttrs.PresetSelectionStateAttribute.INTENSITY.LOW]: 8,
    [stateAttrs.PresetSelectionStateAttribute.INTENSITY.MEDIUM]: 16,
    [stateAttrs.PresetSelectionStateAttribute.INTENSITY.HIGH]: 24,
    [stateAttrs.PresetSelectionStateAttribute.INTENSITY.MAX]: 32,
});


module.exports = DreameGen2NoCloudRobot;
