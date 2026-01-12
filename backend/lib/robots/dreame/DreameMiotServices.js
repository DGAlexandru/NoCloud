module.exports = {
    //https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:dreame-mc1808:1
    "1C": Object.freeze({
        ERROR: {
            SIID: 22,
            PROPERTIES: {
                CODE: {
                    PIID: 1
                }
            }
        },
        VACUUM_2: {
            SIID: 18,
            PROPERTIES: {
                MODE: {
                    PIID: 1
                },
                FAN_SPEED: {
                    PIID: 6
                },
                WATER_USAGE: {
                    PIID: 20
                },
                WATER_TANK_ATTACHMENT: {
                    PIID: 9
                },
                TASK_STATUS: {
                    PIID: 18 // if robot has a task: value = 0
                },
                ADDITIONAL_CLEANUP_PROPERTIES: {
                    PIID: 21
                },
                PERSISTENT_MAPS: {
                    PIID: 23
                },

                CURRENT_STATISTICS_TIME: {
                    PIID: 2
                },
                CURRENT_STATISTICS_AREA: {
                    PIID: 3
                },

                TOTAL_STATISTICS_TIME: {
                    PIID: 13
                },
                TOTAL_STATISTICS_COUNT: {
                    PIID: 14
                },
                TOTAL_STATISTICS_AREA: {
                    PIID: 15
                }
            },
            ACTIONS: {
                START: {
                    AIID: 1
                },
                PAUSE: {
                    AIID: 2
                }
            }
        },
        MANUAL_CONTROL: {
            SIID: 21,
            PROPERTIES: {
                ANGLE: {
                    PIID: 1
                },
                VELOCITY: {
                    PIID: 2
                }
            },
            ACTIONS: {
                MOVE: { // first MOVE action will "start" manual control
                    AIID: 1
                },
                STOP: {
                    AIID: 2
                }
            }
        },
        BATTERY: {
            SIID: 2,
            PROPERTIES: {
                LEVEL: {
                    PIID: 1
                },
                CHARGING: {
                    PIID: 2
                }
            },
            ACTIONS: {
                START_CHARGE: {
                    AIID: 1
                }
            }
        },
        LOCATE: {
            SIID: 17,
            ACTIONS: {
                LOCATE: {
                    AIID: 1
                },
                VOLUME_TEST: {
                    AIID: 3
                }
            }
        },
        VOICE: {
            SIID: 24,
            PROPERTIES: {
                VOLUME: {
                    PIID: 1
                },
                ACTIVE_VOICEPACK: {
                    PIID: 3
                },
                URL: {
                    PIID: 4
                },
                HASH: {
                    PIID: 5
                },
                SIZE: {
                    PIID: 6
                }
            },
            ACTIONS: {
                DOWNLOAD_VOICEPACK: {
                    AIID: 2
                }
            }
        },
        AUDIO: {
            SIID: 7,
            PROPERTIES: {
                VOLUME: {
                    PIID: 1
                }
            },
            ACTIONS: {
                VOLUME_TEST: {
                    AIID: 3
                }
            }
        },
        MAIN_BRUSH: {
            SIID: 26,
            PROPERTIES: {
                TIME_LEFT: { //Hours
                    PIID: 1
                },
                PERCENT_LEFT: {
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        SIDE_BRUSH: {
            SIID: 28,
            PROPERTIES: {
                TIME_LEFT: { //Hours
                    PIID: 1
                },
                PERCENT_LEFT: {
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        FILTER: {
            SIID: 27,
            PROPERTIES: {
                TIME_LEFT: { //Hours
                    PIID: 2
                },
                PERCENT_LEFT: {
                    PIID: 1 //It's only swapped for the filter for some reason..
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },


        MAP: {
            SIID: 23,
            PROPERTIES: {
                MAP_DATA: {
                    PIID: 1
                },
                FRAME_TYPE: { //Can be char I or P (numbers)
                    PIID: 2
                },
                CLOUD_FILE_NAME: {
                    PIID: 3
                },
                MAP_DETAILS: {
                    PIID: 4
                },

                ACTION_RESULT: {
                    PIID: 6
                }
            },
            ACTIONS: {
                POLL: {
                    AIID: 1
                },
                EDIT: {
                    AIID: 2
                }
            }
        }
    }),

    //This is taken from the D9 and Z10 Pro MIOT spec, but it applies to many more
    //https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:dreame-p2009:1
    "GEN2":  Object.freeze({
        DEVICE: {
            SIID: 1,
            PROPERTIES: {
                SERIAL_NUMBER: {
                    PIID: 5
                }
            }
        },
        VACUUM_1: {
            SIID: 2,
            PROPERTIES: {
                STATUS: { /* STATE */
                    PIID: 1
                },
                ERROR: { /* ERROR */
                    PIID: 2
                }
            },
            ACTIONS: {
                RESUME: { /* START */
                    AIID: 1
                },
                PAUSE: {
                    AIID: 2
                }
            }
        },
        BATTERY: {
            SIID: 3,
            PROPERTIES: {
                LEVEL: { /* BATTERY_LEVEL */
                    PIID: 1
                },
                CHARGING: { /* CHARGING_STATUS */
                    PIID: 2
                },
                OFF_PEAK_CHARGING: { /* external data */
                    PIID: 3
                }
            },
            ACTIONS: {
                START_CHARGE: {
                    AIID: 1
                }
            }
        },
        VACUUM_2: {
            SIID: 4,
            PROPERTIES: {
                MODE: { /* STATUS */
                    PIID: 1
                },
                CLEANING_TIME: { /* CLEANING_TIME */
                    PIID: 2
                },
                CLEANING_AREA: { /* CLEANED_AREA */
                    PIID: 3
                },
                FAN_SPEED: { /* SUCTION_LEVEL */
                    PIID: 4
                },
                WATER_USAGE: { /* WATER_VOLUME */
                    PIID: 5
                },
                WATER_TANK_ATTACHMENT: { /* WATER_TANK */
                    PIID: 6
                },
                TASK_STATUS: {
                    PIID: 7
                },
                STATE_CHANGE_TIMESTAMP: { /* CLEANING_START_TIME */
                    PIID: 8 //Value is a unix timestamp
                },
                UNKNOWN_01: { //likely irrelevant /* CLEAN_LOG_FILE_NAME */
                    PIID: 9
                },
                ADDITIONAL_CLEANUP_PROPERTIES: { /* CLEANING_PROPERTIES */
                    PIID: 10
                },
                POST_CHARGE_CONTINUE: { /* RESUME_CLEANING */
                    PIID: 11
                },
                CARPET_MODE: { /* CARPET_BOOST */
                    PIID: 12
                },
                CLEAN_LOG_STATUS: { /* external data */
                    PIID: 13
                },
                SERIAL_NUMBER: { /* external data */
                    PIID: 14
                },
                MANUAL_CONTROL: { /* REMOTE_CONTROL */
                    PIID: 15
                },
                MOP_CLEANING_REMAINDER: { /* external data */
                    PIID: 16
                },
                CLEANING_PAUSED: { /* external data */
                    PIID: 17
                },
                ERROR_CODE: { /* FAULTS */
                    PIID: 18
                },
                NATION_MATCHED: { /* external data */
                    PIID: 19
                },
                LOCATING_STATUS: { /* RELOCATION_STATUS */
                    PIID: 20
                    /*
                        Observed values:
                        0 - knows where it is in its map
                        1 - Trys to locate itself in its map
                        10 - fails to locate itself in its map
                        11 - successfully located itself in its map
                     */
                },
                OBSTACLE_AVOIDANCE: {
                    PIID: 21
                },
                AI_CAMERA_SETTINGS: { /* AI_DETECTION */
                    PIID: 22
                },
                MOP_DOCK_SETTINGS: { /* CLEANING_MODE */
                    PIID: 23
                },
                UPLOAD_MAP: { /* external data */
                    PIID: 24
                },
                MOP_DOCK_STATUS: { /* SELF_WASH_BASE_STATUS */
                    PIID: 25
                },
                CUSTOMIZED_CLEANING: { /* external data */
                    PIID: 26
                },
                KEY_LOCK: { /* CHILD_LOCK */
                    PIID: 27
                },
                CARPET_MODE_SENSITIVITY: { /* CARPET_SENSITIVITY */
                    PIID: 28
                },
                TIGHT_MOP_PATTERN: { /* TIGHT_MOPPING */
                    PIID: 29
                },
                CLEANING_CANCEL: { /* external data */
                    PIID: 30
                },
                Y_CLEAN: { /* external data */
                    PIID: 31
                },
                MOP_DOCK_UV_TREATMENT: { /* WATER_ELECTROLYSIS */
                    PIID: 32
                },
                CARPET_DETECTION_SENSOR: { /* CARPET_RECOGNITION */
                    PIID: 33
                },
                MOP_DOCK_WET_DRY_SWITCH: { /* SELF_CLEAN */
                    PIID: 34
                },
                WARN_STATUS: { /* external data */
                    PIID: 35
                },
                CARPET_DETECTION_SENSOR_MODE: { /* CARPET_CLEANING */
                    PIID: 36
                },
                MOP_DOCK_DETERGENT: { /* AUTO_ADD_DETERGENT */
                    PIID: 37
                },
                CAPABILITY: { /* external data */
                    PIID: 38
                },
                SAVE_WATER_TIPS: { /* external data */
                    PIID: 39
                },
                MOP_DRYING_TIME: { /* DRYING_TIME */
                    PIID: 40
                },
                LOW_WATER_WARNING: { /* external data */
                    PIID: 41
                },
                MAP_INDEX: { /* external data */
                    PIID: 42
                },
                MAP_NAME: { /* external data */
                    PIID: 43
                },
                CRUISE_TYPE: { /* external data */
                    PIID: 44
                },
                MOP_DETACH: { /* AUTO_MOUNT_MOP */
                    PIID: 45
                },
                MOP_DOCK_WATER_USAGE: { /* MOP_WASH_LEVEL */
                    PIID: 46
                },
                SCHEDULED_CLEAN: { /* external data */
                    PIID: 47
                },
                SHORTCUTS: { /* external data */
                    PIID: 48
                },
                INTELLIGENT_RECOGNITION: { /* external data */
                    PIID: 49
                },
                MISC_TUNABLES: { /* AUTO_SWITCH_SETTINGS */
                    PIID: 50
                },
                AUTO_WATER_REFILLING: { /* external data */
                    PIID: 51
                },
                MOP_IN_STATION: { /* external data */
                    PIID: 52
                },
                MOP_PAD_INSTALLED: { /* external data */
                    PIID: 53
                },
                WATER_CHECK: { /* external data */
                    PIID: 54
                },
                DRY_STOP_REMAINDER: { /* external data */
                    PIID: 55
                },
                NUMERIC_MESSAGE_PROMPT: { /* external data */
                    PIID: 56
                },
                MESSAGE_PROMPT: { /* external data */
                    PIID: 57
                },
                TASK_TYPE: { /* external data */
                    PIID: 58
                },
                PET_DETECTIVE: { /* external data */
                    PIID: 59
                },
                DRAINAGE_STATUS: { /* external data */
                    PIID: 60
                },
                DOCK_CLEANING_STATUS: { /* external data */
                    PIID: 61
                },
                BACK_CLEAN_MODE: { /* external data */
                    PIID: 62
                },
                CLEANING_PROGRESS: { /* external data */
                    PIID: 63
                },
                DRYING_PROGRESS: { /* external data */
                    PIID: 64
                },
                DEVICE_CAPABILITY: { /* external data */
                    PIID: 83
                },
                COMBINED_DATA: { /* external data */
                    PIID: 99
                }
            },
            ACTIONS: {
                START: { /* START_CUSTOM */
                    AIID: 1
                },
                STOP: {
                    AIID: 2
                },
                CLEAR_WARNING: { /* external data */
                    AIID: 3
                },
                MOP_DOCK_INTERACT: { /* START_WASHING */
                    AIID: 4
                },
                GET_PHOTO_INFO: { /* external data */
                    AIID: 6
                },
                SHORTCUTS: { /* external data */
                    AIID: 8
                }
            }
        },
        DND: {
            SIID: 5,
            PROPERTIES: {
                ENABLED: { /* DND */
                    PIID: 1
                },
                START_TIME: { /* DND_START */
                    PIID: 2
                },
                END_TIME: { /* DND_END */
                    PIID: 3
                },
                TASK: { /* external data */
                    PIID: 4
                }
            }
        },
        MAP: {
            SIID: 6,
            PROPERTIES: {
                MAP_DATA: {
                    PIID: 1
                },
                FRAME_TYPE: { //Can be char I or P (numbers) /* FRAME_INFO */
                    PIID: 2
                },
                CLOUD_FILE_NAME: { /* OBJECT_NAME */
                    PIID: 3
                },
                MAP_DETAILS: { /* MAP_EXTEND_DATA */
                    PIID: 4
                },
                ROBOT_TIME: { /* external data */
                    PIID: 5
                },
                ACTION_RESULT: { /* RESULT_CODE */
                    PIID: 6
                },
                MULTI_FLOOR_MAP: { /* external data */
                    PIID: 7
                },
                MAP_LIST: { /* external data */
                    PIID: 8
                },
                RECOVERY_MAP_LIST: { /* external data */
                    PIID: 9
                },
                MAP_RECOVERY: { /* external data */
                    PIID: 10
                },
                MAP_RECOVERY_STATUS: { /* external data */
                    PIID: 11
                },
                OLD_MAP_DATA: { /* external data */
                    PIID: 13
                },
                MAP_BACKUP_STATUS: { /* external data */
                    PIID: 14
                },
                WIFI_MAP: { /* external data */
                    PIID: 15
                },
                RESTORE_MAP_BY_AREA: { /* external data */
                    PIID: 16
                }
            },
            ACTIONS: {
                POLL: { /* REQUEST_MAP */
                    AIID: 1
                },
                EDIT: { /* UPDATE_MAP_DATA */
                    AIID: 2
                },
                BACKUP_MAP: { /* external data */
                    AIID: 3
                },
                WIFI_MAP: { /* external data */
                    AIID: 4
                }
            }
        },
        AUDIO: {
            SIID: 7,
            PROPERTIES: {
                VOLUME: {
                    PIID: 1
                },
                ACTIVE_VOICEPACK: { /* VOICE_PACKET_ID */
                    PIID: 2
                },
                VOICEPACK_INSTALL_STATUS: { /* VOICE_CHANGE_STATUS */
                    PIID: 3
                },
                INSTALL_VOICEPACK: { /* VOICE_CHANGE */
                    PIID: 4
                },
                VOICE_ASSISTANT: { /* external data */
                    PIID: 5
                },
                EMPTY_STAMP: { /* external data */
                    PIID: 6
                },
                CURRENT_CITY: { /* external data */
                    PIID: 7
                },
                VOICE_TEST: { /* external data */
                    PIID: 9
                },
                LISTEN_LANGUAGE_TYPE: { /* external data: also VOICE_ASSISTANT_LANGUAGE */
                    PIID: 10
                },
                BAIDU_LOG: { /* external data */
                    PIID: 11
                },
                RESPONSE_WORD: { /* external data */
                    PIID: 12
                },
                DREAME_GPT: { /* external data */
                    PIID: 14
                },
                LISTEN_LANGUAGE: { /* external data */
                    PIID: 15
                },
                LISTEN_LANGUAGE_STATUS: { /* external data */
                    PIID: 16
                }
            },
            ACTIONS: {
                LOCATE: {
                    AIID: 1
                },
                VOLUME_TEST: { /* TEST_SOUND */
                    AIID: 2
                }
            }
        },
        TIMERS: {
            SIID: 8,
            PROPERTIES: {
                TIMEZONE: { /* external data */
                    PIID: 1
                },
                SCHEDULE: { /* external data */
                    PIID: 2
                },
                SCHEDULE_ID: { /* external data */
                    PIID: 3
                },
                SCHEDULE_CANCEL_REASON: { /* external data */
                    PIID: 4
                },
                CRUISE_SCHEDULE: { /* external data */
                    PIID: 5
                }
            },
            ACTIONS: {
                DELETE_SCHEDULE: { /* external data */
                    AIID: 1
                },
                DELETE_CRUISE_SCHEDULE: { /* external data */
                    AIID: 2
                }
            }
        },
        MAIN_BRUSH: {
            SIID: 9,
            PROPERTIES: {
                TIME_LEFT: { //Hours
                    PIID: 1
                },
                PERCENT_LEFT: { /* MAIN_BRUSH_LEFT */
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        SIDE_BRUSH: {
            SIID: 10,
            PROPERTIES: {
                TIME_LEFT: { //Hours
                    PIID: 1
                },
                PERCENT_LEFT: { /* SIDE_BRUSH_LEFT */
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        FILTER: {
            SIID: 11,
            PROPERTIES: {
                TIME_LEFT: { //Hours
                    PIID: 2
                },
                PERCENT_LEFT: { /* FILTER_LEFT */
                    PIID: 1 //It's only swapped for the filter for some reason..
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        TOTAL_STATISTICS: {
            SIID: 12,
            PROPERTIES: {
                TIME: { /* TOTAL_CLEANING_TIME */
                    PIID: 2
                },
                COUNT: { /* CLEANING_COUNT */
                    PIID: 3
                },
                AREA: { /* TOTAL_CLEANED_AREA */
                    PIID: 4
                },
                FIRST_CLEANING_DATE: { /* external data */
                    PIID: 1
                },
                TOTAL_RUNTIME: { /* external data */
                    PIID: 5
                },
                TOTAL_CRUISE_TIME: { /* external data */
                    PIID: 6
                }
            }
        },
        PERSISTENT_MAPS: {
            SIID: 13,
            PROPERTIES: {
                ENABLED: { /* MAP_SAVING */
                    PIID: 1
                }
            }
        },
        ROBOT_CONFIG: {
            SIID: 14,
            PROPERTIES: {
                CONFIG: { /* external data */
                    PIID: 1
                }
            }
        },
        AUTO_EMPTY_DOCK: {
            SIID: 15,
            PROPERTIES: {
                AUTO_EMPTY_ENABLED: { /* AUTO_DUST_COLLECTING */
                    PIID: 1
                },
                INTERVAL: { /* AUTO_EMPTY_FREQUENCY */
                    PIID: 2
                },
                STATUS: { /* DUST_COLLECTION */
                    PIID: 3 //Whether it's currently able to execute the empty action?
                },
                STATE: { /* AUTO_EMPTY_STATUS */
                    PIID: 5 //1 = currently cleaning, 0 = not currently cleaning
                }
            },
            ACTIONS: {
                EMPTY_DUSTBIN: { /* START_AUTO_EMPTY */
                    AIID: 1
                }
            }
        },
        SENSOR: {
            SIID: 16,
            PROPERTIES: {
                TIME_LEFT: { //Hours /* SENSOR_DIRTY_TIME_LEFT */
                    PIID: 2
                },
                PERCENT_LEFT: { /* SENSOR_DIRTY_LEFT */
                    PIID: 1
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        SECONDARY_FILTER: { /* TANK_FILTER */
            SIID: 17,
            PROPERTIES: {
                TIME_LEFT: { //Hours
                    PIID: 2
                },
                PERCENT_LEFT: { /* TANK_FILTER_LEFT */
                    PIID: 1
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        MOP: { /* MOP_PAD */
            SIID: 18,
            PROPERTIES: {
                TIME_LEFT: { //Hours 
                    PIID: 2
                },
                PERCENT_LEFT: { /* MOP_PAD_LEFT */
                    PIID: 1
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        SILVER_ION: {
            SIID: 19,
            PROPERTIES: {
                TIME_LEFT: { //Hours
                    PIID: 2 /* SILVER_ION_LEFT */
                },
                PERCENT_LEFT: { /* SILVER_ION_TIME_LEFT */
                    PIID: 1
                },
                ADD: { /* external data */
                    PIID: 3
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        DETERGENT: {
            SIID: 20,
            PROPERTIES: {
                TIME_LEFT: { //Hours
                    PIID: 2
                },
                PERCENT_LEFT: { /* DETERGENT_LEFT */
                    PIID: 1
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        SQUEEGEE: { // smooth rubber blade, used to remove or control the flow of liquid on a flat surface.
            SIID: 24,
            PROPERTIES: {
                LEFT: { /* external data */
                    PIID: 1
                },
                TIME_LEFT: { /* external data */
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: { /* external data */
                    AIID: 1
                }
            }
        },
        ONBOARD_DIRTY_WATER_TANK: {
            SIID: 25,
            PROPERTIES: {
                LEFT: { /* external data */
                    PIID: 1
                },
                TIME_LEFT: { /* external data */
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: { /* external data */
                    AIID: 1
                }
            }
        },
        DIRTY_WATER_TANK: {
            SIID: 26,
            PROPERTIES: {
                LEFT: { /* external data */
                    PIID: 1
                },
                TIME_LEFT: { /* external data */
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: { /* external data */
                    AIID: 1
                }
            }
        },
        MISC_STATES: {
            SIID: 27,
            PROPERTIES: {
                DOCK_FRESHWATER_TANK_ATTACHMENT: { /* CLEAN_WATER_TANK_STATUS */
                    PIID: 1
                },
                DOCK_WASTEWATER_TANK_ATTACHMENT: { /* DIRTY_WATER_TANK_STATUS */
                    PIID: 2
                },
                DOCK_DUSTBAG_ATTACHMENT: { /* DUST_BAG_STATUS */
                    PIID: 3
                },
                DOCK_DETERGENT_ATTACHMENT: { /* DETERGENT_STATUS */
                    PIID: 4
                },
                STATION_DRAINAGE_STATUS: { /* external data */
                    PIID: 5
                },
                AI_MAP_OPTIMIZATION_STATUS: { /* external data */
                    PIID: 7
                },
                SECOND_CLEANING_STATUS: { /* external data */
                    PIID: 8
                },
                WATER_TANK_STATUS: { /* external data */
                    PIID: 9
                },
                ADD_CLEANING_AREA_STATUS: { /* external data */
                    PIID: 10
                },
                ADD_CLEANING_AREA_RESULT: { /* external data */
                    PIID: 11
                },
                FIRST_CONNECT_WIFI: { /* external data */
                    PIID: 12
                },
                HAND_DUST_STATUS: { /* external data */
                    PIID: 13
                },
                HAND_DUST_CONNECT_STATUS: { /* external data */
                    PIID: 14
                },
                HOT_WATER_STATUS: { /* external data */
                    PIID: 15
                }
            }
        },
        MOP_EXPANSION: {
            SIID: 28,
            PROPERTIES: {
                HIGH_RES_WATER_USAGE: { /* WETNESS_LEVEL */
                    PIID: 1
                },
                CLEAN_CARPETS_FIRST: { /* external data */
                    PIID: 2
                },
                AUTO_LDS_LIFTING: { /* external data */
                    PIID: 3
                },
                LDS_STATE: { /* external data */
                    PIID: 4
                },
                CLEANGENIUS_MODE: { /* external data */
                    PIID: 5
                },
                QUICK_WASH_MODE: { /* external data */
                    PIID: 6
                },
                HIGH_RES_MOP_DOCK_HEATER: { /* WATER_TEMPERATURE */
                    PIID: 8
                },
                CLEAN_EFFICIENCY: { /* external data */
                    PIID: 9
                },
                IMPACT_INJECTION_PUMP: { /* external data */
                    PIID: 12
                },
                OBSTACLE_VIDEOS: { /* external data */
                    PIID: 13
                },
                DND_DISABLE_RESUME_CLEANING: { /* external data */
                    PIID: 14
                },
                DND_DISABLE_AUTO_EMPTY: { /* external data */
                    PIID: 15
                },
                DND_REDUCE_VOLUME: { /* external data */
                    PIID: 16
                },
                HAND_VACUUM_AUTO_DUSTING: { /* external data */
                    PIID: 17
                },
                DYNAMIC_OBSTACLE_CLEAN: { /* external data */
                    PIID: 18
                },
                HUMAN_NOISE_REDUCTION: { /* external data */
                    PIID: 19
                },
                PET_CARE: { /* external data */
                    PIID: 20
                },
                LOWER_HATCH_CONTROL: { /* external data */
                    PIID: 21
                },
                SMART_MOP_WASHING: { /* external data */
                    PIID: 22
                },
                BLOCK_HEALTH_CHECKS: { /* external data */
                    PIID: 23
                },
                MOP_AFTER_VACUUM: { /* external data */
                    PIID: 24
                },
                SMALL_AREA_FAST_CLEAN: { /* external data */
                    PIID: 25
                },
                SHIELD_ULTRASONIC_SIGNALS: { /* external data */
                    PIID: 26
                },
                SILENT_DRYING: { /* external data */
                    PIID: 27
                },
                HAIR_COMPRESSION: { /* external data */
                    PIID: 28
                },
                SIDE_BRUSH_ON_CARPET: { /* SIDE_BRUSH_CARPET_ROTATE */
                    PIID: 29
                },
                ERP_LOW_POWER: { /* external data */
                    PIID: 30
                },
                SHIELD_WASHBOARD_IN_PLACE: { /* external data */
                    PIID: 31
                },
                SELF_CLEANING_PROBLEM: { /* external data */
                    PIID: 32
                },
                WASHING_TEST: { /* external data */
                    PIID: 33
                },
                FEEDBACK_SWITCH: { /* external data */
                    PIID: 36
                },
                CARPET_AI_SEGMENT: { /* external data */
                    PIID: 37
                },
                OBSTACLE_CROSSING: { /* external data */
                    PIID: 38
                },
                VISUAL_RESUME: { /* external data */
                    PIID: 39
                },
                FAN_ABNORMAL_NOISE: { /* external data */
                    PIID: 40
                },
                LARGE_MEMORY_RESET: { /* external data */
                    PIID: 41
                },
                BOW_BEFORE_EDGE: { /* external data */
                    PIID: 42
                },
                VOLTAGE: { /* external data */
                    PIID: 43
                },
                DETERGENT_A: { /* external data */
                    PIID: 44
                },
                DETERGENT_B: { /* external data */
                    PIID: 45
                },
                MOP_TEMPERATURE: { /* external data */
                    PIID: 46
                },
                BATTERY_CHARGE_LEVEL: { /* external data */
                    PIID: 47
                },
                DUST_BAG_DRYING: { /* external data */
                    PIID: 48
                },
                SWEEP_DISTANCE: { /* external data */
                    PIID: 49
                },
                MISC_TUNABLES: { /* external data */
                    PIID: 50
                },
                MOPPING_WITH_DETERGENT: { /* external data */
                    PIID: 52
                },
                PRESSURIZED_CLEANING: { /* external data */
                    PIID: 53
                },
                SCRAPER_FREQUENCY: { /* external data */
                    PIID: 54
                },
                REALTIME_PARTICLE_DETECT: { /* external data */
                    PIID: 58
                },
                IGNORE_STAIRS: { /* external data */
                    PIID: 59
                },
                RING_LIGHT_ALWAYS_ON: { /* external data */
                    PIID: 61
                },
                POWER_SAVING: { /* external data */
                    PIID: 63
                },
                STORE_MODE: { /* external data */
                    PIID: 79
                },
                INTEGRATED_POWER: { /* external data */
                    PIID: 81
                }
            }
        },
        DEODORIZER: {
            SIID: 29,
            PROPERTIES: {
                TIME_LEFT: { /* external data */
                    PIID: 1
                },
                PERCENT_LEFT: { /* external data */
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: { /* external data */
                    AIID: 1
                }
            }
        },
        WHEEL: {
            SIID: 30,
            PROPERTIES: {
                TIME_LEFT: { //Hours /* WHEEL_DIRTY_TIME_LEFT */
                    PIID: 1
                },
                PERCENT_LEFT: { /* WHEEL_DIRTY_LEFT */
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: {
                    AIID: 1
                }
            }
        },
        SCALE_INHIBITOR: {
            SIID: 31,
            PROPERTIES: {
                TIME_LEFT: { /* external data */
                    PIID: 1
                },
                PERCENT_LEFT: { /* external data */
                    PIID: 2
                }
            },
            ACTIONS: {
                RESET: { /* external data */
                    AIID: 1
                }
            }
        },
        FACTORY_TEST: {
            SIID: 99,
            PROPERTIES: {
                STATUS: { /* external data */
                    PIID: 1
                },
                RESULT: { /* external data */
                    PIID: 3
                },
                SELF_TEST_STATUS: { /* external data */
                    PIID: 8
                },
                LSD_TEST_STATUS: { /* external data */
                    PIID: 9
                },
                DEBUG_SWITCH: { /* external data */
                    PIID: 11
                },
                SERIAL: { /* external data */
                    PIID: 14
                },
                CALIBRATION_STATUS: { /* external data */
                    PIID: 15
                },
                VERSION: { /* external data */
                    PIID: 17
                },
                PERFORMANCE_SWITCH: { /* external data */
                    PIID: 24
                },
                AI_TEST_STATUS: { /* external data */
                    PIID: 25
                },
                PUBLIC_KEY: { /* external data */
                    PIID: 27
                },
                AUTO_PAIR: { /* external data */
                    PIID: 28
                },
                MCU_VERSION: { /* external data */
                    PIID: 31
                },
                MOP_TEST_STATUS: { /* external data */
                    PIID: 35
                },
                PLATFORM_NETWORK: { /* external data */
                    PIID: 95
                }
            }
        },
        STREAM: {
            SIID: 10001,
            PROPERTIES: {
                STATUS: { /* external data */
                    PIID: 1
                },
                AUDIO: { /* external data */
                    PIID: 2
                },
                RECORD: { /* external data */
                    PIID: 4
                },
                TAKE_PHOTO: { /* external data */
                    PIID: 5
                },
                KEEP_ALIVE: { /* external data */
                    PIID: 6
                },
                FAULT: { /* external data */
                    PIID: 7
                },
                CAMERA_LIGHT_BRIGHTNESS: { /* external data */
                    PIID: 9
                },
                CAMERA_LIGHT: { /* external data */
                    PIID: 10
                },
                VENDOR: { /* external data */
                    PIID: 11
                },
                PROPERTY: { /* external data */
                    PIID: 99
                },
                CRUISE_POINT: { /* external data */
                    PIID: 101
                },
                TASK: { /* external data */
                    PIID: 103
                },
                STEAM_HUMAN_FOLLOW: { /* external data */
                    PIID: 110
                },
                OBSTACLE_VIDEO_STATUS: { /* external data */
                    PIID: 111
                },
                OBSTACLE_VIDEO_DATA: { /* external data */
                    PIID: 112
                },
                UPLOAD: { /* external data */
                    PIID: 1003
                },
                CODE: { /* external data */
                    PIID: 1100
                },
                SET_CODE: { /* external data */
                    PIID: 1101
                },
                VERIFY_CODE: { /* external data */
                    PIID: 1102
                },
                RESET_CODE: { /* external data */
                    PIID: 1103
                },
                SPACE: { /* external data */
                    PIID: 2003
                }
            },
            ACTIONS: {
                VIDEO: { /* external data */
                    AIID: 1
                },
                AUDIO: { /* external data */
                    AIID: 2
                },
                PROPERTY: { /* external data */
                    AIID: 3
                },
                CODE: { /* external data */
                    AIID: 4
                }
            }
        },
    })
};
