/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useSnackbar } from "notistack";
import React from "react";
import {
    QueryClient,
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
    UseQueryResult
} from "@tanstack/react-query";
import {
    BasicControlCommand,
    deleteTimer,
    fetchAutoEmptyDockAutoEmptyControlState,
    fetchAutoEmptyDockAutoEmptyInterval,
    fetchAutoEmptyDockAutoEmptyIntervalProperties,
    fetchCameraLightControlState,
    fetchCapabilities,
    fetchCarpetModeState,
    fetchCarpetSensorMode,
    fetchCarpetSensorModeProperties,
    fetchCollisionAvoidantNavigationControlState,
    fetchCombinedVirtualRestrictionsProperties,
    fetchConsumableProperties,
    fetchConsumableStateInformation,
    fetchCurrentStatistics,
    fetchCurrentStatisticsProperties,
    fetchDoNotDisturbConfiguration,
    fetchHighResolutionManualControlState,
    fetchHTTPBasicAuthConfiguration,
    fetchKeyLockState,
    fetchManualControlProperties,
    fetchManualControlState,
    fetchMap,
    fetchMapSegmentationProperties,
    fetchMopDockMopWashTemperature,
    fetchMopDockMopWashTemperatureProperties,
    fetchMopExtensionControlState,
    fetchMQTTConfiguration,
    fetchMQTTProperties,
    fetchMQTTStatus,
    fetchNetworkAdvertisementConfiguration,
    fetchNetworkAdvertisementProperties,
    fetchNoCloudCustomizations,
    fetchNoCloudEvents,
    fetchNoCloudInformation,
    fetchNoCloudLog,
    fetchNoCloudLogLevel,
    fetchNoCloudVersionInformation,
    fetchNTPClientConfiguration,
    fetchNTPClientStatus,
    fetchObstacleAvoidanceControlState,
    fetchObstacleImagesProperties,
    fetchObstacleImagesState,
    fetchPersistentMapState,
    fetchPetObstacleAvoidanceControlState,
    fetchPresetSelections,
    fetchQuirks,
    fetchRobotInformation,
    fetchRobotProperties,
    fetchSegments,
    fetchSpeakerVolumeState,
    fetchStateAttributes,
    fetchSystemHostInfo,
    fetchSystemRuntimeInfo,
    fetchTimerInformation,
    fetchTimerProperties,
    fetchTotalStatistics,
    fetchTotalStatisticsProperties,
    fetchUpdaterConfiguration,
    fetchUpdaterState,
    fetchVoicePackManagementState,
    fetchWifiConfigurationProperties,
    fetchWifiScan,
    fetchWifiStatus,
    fetchZoneProperties,
    MopDockCleanManualTriggerCommand,
    MopDockDryManualTriggerCommand,
    sendAutoEmptyDockAutoEmptyControlEnable,
    sendAutoEmptyDockAutoEmptyInterval,
    sendAutoEmptyDockManualTriggerCommand,
    sendBasicControlCommand,
    sendCameraLightControlState,
    sendCarpetModeEnable,
    sendCarpetSensorMode,
    sendCleanSegmentsCommand,
    sendCleanZonesCommand,
    sendCollisionAvoidantNavigationControlState,
    sendCombinedVirtualRestrictionsUpdate,
    sendConsumableReset,
    sendDismissWelcomeDialogAction,
    sendDoNotDisturbConfiguration,
    sendGoToCommand,
    sendHighResolutionManualControlInteraction,
    sendHTTPBasicAuthConfiguration,
    sendJoinSegmentsCommand,
    sendKeyLockEnable,
    sendLocateCommand,
    sendManualControlInteraction,
    sendMapReset,
    sendMopDockCleanManualTriggerCommand,
    sendMopDockDryManualTriggerCommand,
    sendMopDockMopWashTemperature,
    sendMopExtensionControlState,
    sendMQTTConfiguration,
    sendNetworkAdvertisementConfiguration,
    sendNoCloudCustomizations,
    sendNoCloudEventInteraction,
    sendNoCloudLogLevel,
    sendNTPClientConfiguration,
    sendObstacleAvoidanceControlState,
    sendObstacleImagesState,
    sendPersistentMapEnabled,
    sendPetObstacleAvoidanceControlState,
    sendRenameSegmentCommand,
    sendRestoreDefaultConfigurationAction,
    sendSetQuirkValueCommand,
    sendSpeakerTestCommand,
    sendSpeakerVolume,
    sendSplitSegmentCommand,
    sendStartMappingPass,
    sendTimerAction,
    sendTimerCreation,
    sendTimerUpdate,
    sendUpdaterCommand,
    sendUpdaterConfiguration,
    sendVoicePackManagementCommand,
    sendWifiConfiguration,
    subscribeToLogMessages,
    subscribeToMap,
    subscribeToStateAttributes,
    updatePresetSelection,
} from "./client";
import {
    PresetSelectionState,
    RobotAttribute,
    RobotAttributeClass,
    StatusState,
} from "./RawRobotState";
import { isAttribute } from "./utils";
import {
    AutoEmptyDockAutoEmptyInterval,
    Capability,
    CarpetSensorMode,
    CombinedVirtualRestrictionsUpdateRequestParameters,
    ConsumableId,
    DoNotDisturbConfiguration,
    HighResolutionManualControlInteraction,
    HTTPBasicAuthConfiguration,
    ManualControlInteraction,
    MapSegmentationActionRequestParameters,
    MapSegmentEditJoinRequestParameters,
    MapSegmentEditSplitRequestParameters,
    MapSegmentRenameRequestParameters,
    MopDockMopWashTemperature,
    MQTTConfiguration,
    NetworkAdvertisementConfiguration,
    NoCloudCustomizations,
    NoCloudEventInteractionContext,
    NoCloudInformation,
    NTPClientConfiguration,
    NTPClientStatus,
    Point,
    SetLogLevelRequest,
    Timer,
    UpdaterConfiguration,
    VoicePackManagementCommand,
    WifiConfiguration,
    ZoneActionRequestParameters,
} from "./types";
import type { MutationFunction } from "@tanstack/query-core";

enum QueryKey {
    Attributes = "attributes",
    AutoEmptyDockAutoEmpty = "auto_empty_dock_auto_empty",
    AutoEmptyDockAutoEmptyInterval = "auto_empty_dock_auto_empty_interval",
    AutoEmptyDockAutoEmptyIntervalProperties = "auto_empty_dock_auto_empty_interval_properties",
    CameraLightControl = "camera_light_control",
    Capabilities = "capabilities",
    CarpetMode = "carpet_mode",
    CarpetSensorMode = "carpet_sensor_mode",
    CarpetSensorModeProperties = "carpet_sensor_mode_properties",
    CollisionAvoidantNavigation = "collision_avoidant_navigation",
    CombinedVirtualRestrictionsProperties = "combined_virtual_restrictions_properties",
    ConsumableProperties = "consumable_properties",
    Consumables = "consumables",
    CurrentStatistics = "current_statistics",
    CurrentStatisticsProperties = "current_statistics_properties",
    DoNotDisturb = "do_not_disturb",
    HighResolutionManualControl = "high_resolution_manual_control",
    HTTPBasicAuth = "http_basic_auth",
    KeyLockInformation = "key_lock",
    Log = "log",
    LogLevel = "log_level",
    ManualControl = "manual_control",
    ManualControlProperties = "manual_control_properties",
    Map = "map",
    MapSegmentationProperties = "map_segmentation_properties",
    MopDockMopWashTemperature = "mop_dock_mop_wash_temperature",
    MopDockMopWashTemperatureProperties = "mop_dock_mop_wash_temperature_properties",
    MopExtensionControl = "mop_extension_control",
    MQTTConfiguration = "mqtt_configuration",
    MQTTProperties = "mqtt_properties",
    MQTTStatus = "mqtt_status",
    NetworkAdvertisementConfiguration = "network_advertisement_configuration",
    NetworkAdvertisementProperties = "network_advertisement_properties",
    NoCloudCustomizations = "NoCloud_customizations",
    NoCloudEvents = "NoCloud_events",
    NoCloudInformation = "NoCloud_information",
    NoCloudVersion = "NoCloud_version",
    NTPClientConfiguration = "ntp_client_configuration",
    NTPClientStatus = "ntp_client_status",
    ObstacleAvoidance = "obstacle_avoidance",
    ObstacleImages = "obstacle_image",
    ObstacleImagesProperties = "obstacle_image_properties",
    PersistentMap = "persistent_map",
    PetObstacleAvoidance = "pet_obstacle_avoidance",
    PresetSelections = "preset_selections",
    Quirks = "quirks",
    RobotInformation = "robot_information",
    RobotProperties = "robot_properties",
    Segments = "segments",
    SpeakerVolume = "speaker_volume",
    SystemHostInfo = "system_host_info",
    SystemRuntimeInfo = "system_runtime_info",
    TimerProperties = "timer_properties",
    Timers = "timers",
    TotalStatistics = "total_statistics",
    TotalStatisticsProperties = "total_statistics_properties",
    UpdaterConfiguration = "updater_configuration",
    UpdaterState = "updater_state",
    VoicePackManagement = "voice_pack",
    WifiConfigurationProperties = "wifi_configuration_properties",
    WifiScan = "wifi_scan",
    WifiStatus = "wifi_status",
    ZoneProperties = "zone_properties",
}

const useOnCommandError = (capability: Capability | string): ((error: unknown) => void) => {
    const {enqueueSnackbar} = useSnackbar();

    return React.useCallback((error: any) => {
        let errorMessage = "";
        if (typeof error?.toString === "function") {
            errorMessage = error.toString();
        }

        if (typeof error?.response?.data === "string") {
            errorMessage = error.response.data;
        }

        enqueueSnackbar(`An error occurred while sending command to ${capability}:\n${errorMessage}`, {
            preventDuplicate: true,
            key: capability,
            variant: "error",
        });
    }, [capability, enqueueSnackbar]);
};

const useOnSettingsChangeError = (setting: string): ((error: unknown) => void) => {
    const {enqueueSnackbar} = useSnackbar();

    return React.useCallback((error: unknown) => {
        enqueueSnackbar(`An error occurred while updating ${setting} settings: ${error}`, {
            preventDuplicate: true,
            key: setting,
            variant: "error",
        });
    }, [setting, enqueueSnackbar]);
};

const useSSECacheUpdater = <T>(
    key: QueryKey,
    subscriber: (listener: (data: T) => void) => () => void
): void => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        return subscriber((data) => {
            queryClient.setQueryData<T>([key], (oldData) => {
                return data;
            }, {
                updatedAt: Date.now()
            });
        });
    }, [key, queryClient, subscriber]);
};

const useSSECacheAppender = <T>(
    key: QueryKey,
    subscriber: (listener: (data: T) => void) => () => void,
): void => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        return subscriber((data) => {
            let currentLog = queryClient.getQueryData([key]);
            let newData;

            if (typeof currentLog === "string" || currentLog instanceof String) {
                currentLog = currentLog.trim();
                newData = `${currentLog}\n${data}`;
            } else {
                newData = `${data}`;
            }

            return queryClient.setQueryData<T>([key], newData as T);
        });
    }, [key, queryClient, subscriber]);
};

export const useCapabilitiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.Capabilities],
        queryFn: fetchCapabilities,

        staleTime: Infinity
    });
};

export const useRobotMapQuery = () => {
    useSSECacheUpdater(QueryKey.Map, subscribeToMap);

    return useQuery({
        queryKey: [QueryKey.Map],
        queryFn: fetchMap,

        staleTime: 1000
    });
};

export function useRobotAttributeQuery<C extends RobotAttributeClass>(
    clazz: C
): UseQueryResult<Extract<RobotAttribute, { __class: C }>[]>;
export function useRobotAttributeQuery<C extends RobotAttributeClass, T>(
    clazz: C,
    select: (attributes: Extract<RobotAttribute, { __class: C }>[]) => T
): UseQueryResult<T>;
export function useRobotAttributeQuery<C extends RobotAttributeClass>(
    clazz: C,
    select?: (attributes: Extract<RobotAttribute, { __class: C }>[]) => any
): UseQueryResult<any> {
    useSSECacheUpdater(QueryKey.Attributes, subscribeToStateAttributes);

    return useQuery({
        queryKey: [QueryKey.Attributes],
        queryFn: fetchStateAttributes,

        staleTime: 1000,
        select: (attributes) => {
            const filteredAttributes = attributes.filter(isAttribute(clazz));

            return select ? select(filteredAttributes) : filteredAttributes;
        },
    });
}

export function useRobotStatusQuery(): UseQueryResult<StatusState>;
export function useRobotStatusQuery<T>(
    select: (status: StatusState) => T
): UseQueryResult<T>;
export function useRobotStatusQuery(select?: (status: StatusState) => any) {
    useSSECacheUpdater(QueryKey.Attributes, subscribeToStateAttributes);

    return useQuery({
        queryKey: [QueryKey.Attributes],
        queryFn: fetchStateAttributes,

        staleTime: 1000,
        select: (attributes) => {
            const status =
                attributes.filter(isAttribute(RobotAttributeClass.StatusState))[0] ??
                ({
                    __class: RobotAttributeClass.StatusState,
                    metaData: {},
                    value: "error",
                    flag: "none",
                } as StatusState);

            return select ? select(status) : status;
        },
    });
}

export const usePresetSelectionsQuery = (
    capability: Capability.FanSpeedControl | Capability.WaterUsageControl | Capability.OperationModeControl
) => {
    return useQuery({
        queryKey: [QueryKey.PresetSelections, capability],
        queryFn: () => {
            return fetchPresetSelections(capability);
        },

        staleTime: Infinity,
    });
};

export const capabilityToPresetType: Record<Parameters<typeof usePresetSelectionMutation>[0],
    PresetSelectionState["type"]> = {
        [Capability.FanSpeedControl]: "fan_speed",
        [Capability.WaterUsageControl]: "water_grade",
        [Capability.OperationModeControl]: "operation_mode",
    };
export const usePresetSelectionMutation = (
    capability: Capability.FanSpeedControl | Capability.WaterUsageControl | Capability.OperationModeControl
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (level: PresetSelectionState["value"]) => {
            return updatePresetSelection(capability, level).then(
                fetchStateAttributes
            );
        },
        onSuccess: (data) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
        },
        onError: useOnCommandError(capability),
    });
};

export const useBasicControlMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: BasicControlCommand) => {
            return sendBasicControlCommand(command).then(fetchStateAttributes);
        },
        onError: useOnCommandError(Capability.BasicControl),
        onSuccess: (data) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
        },
    });
};

export const useGoToMutation = (
    options?: UseMutationOptions<RobotAttribute[], unknown, Point>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (coordinates: { x: number; y: number }) => {
            return sendGoToCommand(coordinates).then(fetchStateAttributes);
        },
        ...options,

        onError: useOnCommandError(Capability.GoToLocation),
        onSuccess: async (data, ...args) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
            await options?.onSuccess?.(data, ...args);
        },
    });
};

export const useZonePropertiesQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.ZoneProperties],
        queryFn: fetchZoneProperties,

        staleTime: Infinity,
    });
};

export const useCleanZonesMutation = (
    options?: UseMutationOptions<RobotAttribute[], unknown, ZoneActionRequestParameters>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (parameters: ZoneActionRequestParameters) => {
            return sendCleanZonesCommand(parameters).then(fetchStateAttributes);
        },
        ...options,

        onError: useOnCommandError(Capability.ZoneCleaning),
        onSuccess: async (data, ...args) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
            await options?.onSuccess?.(data, ...args);
        },
    });
};

export const useSegmentsQuery = () => {
    return useQuery({
        queryKey: [QueryKey.Segments],
        queryFn: fetchSegments
    });
};

// As conditional hooks aren't allowed, this query needs a way to be disabled but referenced
// for cases where a component might need the properties but only if the capability exists
export const useMapSegmentationPropertiesQuery = (enabled?: boolean) => {
    return useQuery({
        queryKey: [QueryKey.MapSegmentationProperties],
        queryFn: fetchMapSegmentationProperties,

        staleTime: Infinity,
        enabled: enabled ?? true
    });
};

export const useCleanSegmentsMutation = (
    options?: UseMutationOptions<RobotAttribute[], unknown, MapSegmentationActionRequestParameters>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (parameters: MapSegmentationActionRequestParameters) => {
            return sendCleanSegmentsCommand(parameters).then(fetchStateAttributes);
        },
        ...options,

        onError: useOnCommandError(Capability.MapSegmentation),
        onSuccess: async (data, ...args) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
            await options?.onSuccess?.(data, ...args);
        },
    });
};

export const useJoinSegmentsMutation = (
    options?: UseMutationOptions<RobotAttribute[], unknown, MapSegmentEditJoinRequestParameters>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (parameters: MapSegmentEditJoinRequestParameters) => {
            return sendJoinSegmentsCommand(parameters).then(fetchStateAttributes); //TODO: this should actually refetch the map
        },
        ...options,

        onError: useOnCommandError(Capability.MapSegmentEdit),
        onSuccess: async (data, ...args) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
            await options?.onSuccess?.(data, ...args);
        },
    });
};

export const useSplitSegmentMutation = (
    options?: UseMutationOptions<RobotAttribute[], unknown, MapSegmentEditSplitRequestParameters>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (parameters: MapSegmentEditSplitRequestParameters) => {
            return sendSplitSegmentCommand(parameters).then(fetchStateAttributes); //TODO: this should actually refetch the map
        },
        ...options,

        onError: useOnCommandError(Capability.MapSegmentEdit),
        onSuccess: async (data, ...args) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
            await options?.onSuccess?.(data, ...args);
        },
    });
};

export const useRenameSegmentMutation = (
    options?: UseMutationOptions<RobotAttribute[], unknown, MapSegmentRenameRequestParameters>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (parameters: MapSegmentRenameRequestParameters) => {
            return sendRenameSegmentCommand(parameters).then(fetchStateAttributes); //TODO: this should actually refetch the map
        },
        ...options,

        onError: useOnCommandError(Capability.MapSegmentRename),
        onSuccess: async (data, ...args) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
            await options?.onSuccess?.(data, ...args);
        },
    });
};

export const useLocateMutation = () => {
    return useMutation({
        mutationFn: sendLocateCommand,
        onError: useOnCommandError(Capability.Locate)
    });
};

export const useConsumableStateQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.Consumables],
        queryFn: fetchConsumableStateInformation,
        staleTime: 300_000,
        refetchInterval: 300_000
    });
};

const useNoCloudFetchingMutation = <TData, TVariables>(options: {
    onError: ((error: unknown) => void),
    queryKey: Array<QueryKey>,
    mutationFn: MutationFunction<TData, TVariables>
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: options.mutationFn,
        onSuccess: (data) => {
            queryClient.setQueryData<TData>(options.queryKey, data, {
                updatedAt: Date.now(),
            });
        },
        onError: options.onError
    });
};

export const useConsumablePropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.ConsumableProperties],
        queryFn: fetchConsumableProperties,

        staleTime: Infinity
    });
};

export const useConsumableResetMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.Consumables],
        mutationFn: (parameters: ConsumableId) => {
            return sendConsumableReset(parameters).then(fetchConsumableStateInformation);
        },
        onError: useOnCommandError(Capability.ConsumableMonitoring)
    });
};

export const useAutoEmptyDockManualTriggerMutation = () => {
    return useMutation({
        mutationFn: sendAutoEmptyDockManualTriggerCommand,
        onError: useOnCommandError(Capability.AutoEmptyDockManualTrigger)
    });
};

export const useRobotInformationQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.RobotInformation],
        queryFn: fetchRobotInformation,

        staleTime: Infinity,
    });
};

export const useNoCloudInformationQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.NoCloudInformation],
        queryFn: fetchNoCloudInformation,

        staleTime: Infinity,
    });
};

export const useDismissWelcomeDialogMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => {
            return sendDismissWelcomeDialogAction().then(fetchNoCloudInformation).then((state) => {
                queryClient.setQueryData<NoCloudInformation>([QueryKey.NoCloudInformation], state, {
                    updatedAt: Date.now(),
                });
            });
        },
        onError: useOnSettingsChangeError("Welcome Dialog")
    });
};

export const useRestoreDefaultConfigurationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => {
            return sendRestoreDefaultConfigurationAction().then(() => {
                queryClient.refetchQueries().catch(() => {
                    /*intentional*/
                });
            });
        },
        onError: useOnSettingsChangeError("Config Restore")
    });
};

export const useNoCloudVersionQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.NoCloudVersion],
        queryFn: fetchNoCloudVersionInformation,

        staleTime: Infinity,
    });
};

export const useSystemHostInfoQuery = () => {
    return useQuery({
        queryKey: [QueryKey.SystemHostInfo],
        queryFn: fetchSystemHostInfo,

        staleTime: 5_000,
        refetchInterval: 5_000
    });
};

export const useSystemRuntimeInfoQuery = () => {
    return useQuery({
        queryKey: [QueryKey.SystemRuntimeInfo],
        queryFn: fetchSystemRuntimeInfo
    });
};

export const useMQTTConfigurationQuery = () => {
    return useQuery({
        queryKey: [QueryKey.MQTTConfiguration],
        queryFn: fetchMQTTConfiguration,

        staleTime: Infinity,
    });
};

export const useMQTTConfigurationMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.MQTTConfiguration],
        mutationFn: (mqttConfiguration: MQTTConfiguration) => {
            return sendMQTTConfiguration(mqttConfiguration).then(fetchMQTTConfiguration);
        },
        onError: useOnSettingsChangeError("MQTT"),
    });
};

export const useMQTTStatusQuery = () => {
    return useQuery({
        queryKey: [QueryKey.MQTTStatus],
        queryFn: fetchMQTTStatus,

        staleTime: 5_000,
        refetchInterval: 5_000
    });
};

export const useMQTTPropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.MQTTProperties],
        queryFn: fetchMQTTProperties,

        staleTime: Infinity,
    });
};

export const useHTTPBasicAuthConfigurationQuery = () => {
    return useQuery({
        queryKey: [QueryKey.HTTPBasicAuth],
        queryFn: fetchHTTPBasicAuthConfiguration,

        staleTime: Infinity,
    });
};

export const useHTTPBasicAuthConfigurationMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.HTTPBasicAuth],
        mutationFn: (configuration: HTTPBasicAuthConfiguration) => {
            return sendHTTPBasicAuthConfiguration(configuration).then(fetchHTTPBasicAuthConfiguration);
        },
        onError: useOnSettingsChangeError("HTTP Basic Auth")
    });
};

export const useNetworkAdvertisementConfigurationQuery = () => {
    return useQuery({
        queryKey: [QueryKey.NetworkAdvertisementConfiguration],
        queryFn: fetchNetworkAdvertisementConfiguration,

        staleTime: Infinity,
    });
};

export const useNetworkAdvertisementConfigurationMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.NetworkAdvertisementConfiguration],
        mutationFn: (networkAdvertisementConfiguration: NetworkAdvertisementConfiguration) => {
            return sendNetworkAdvertisementConfiguration(networkAdvertisementConfiguration).then(fetchNetworkAdvertisementConfiguration);
        },
        onError: useOnSettingsChangeError("Network Advertisement")
    });
};

export const useNetworkAdvertisementPropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.NetworkAdvertisementProperties],
        queryFn: fetchNetworkAdvertisementProperties,

        staleTime: Infinity,
    });
};

export const useNTPClientStatusQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.NTPClientStatus],
        queryFn: fetchNTPClientStatus,

        staleTime: 5_000,
        refetchInterval: 5_000
    });
};

export const useNTPClientConfigurationQuery = () => {
    return useQuery({
        queryKey: [QueryKey.NTPClientConfiguration],
        queryFn: fetchNTPClientConfiguration,

        staleTime: Infinity,
    });
};

export const useNTPClientConfigurationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (configuration: NTPClientConfiguration) => {
            return sendNTPClientConfiguration(configuration).then(fetchNTPClientConfiguration).then((configuration) => {
                queryClient.setQueryData<NTPClientConfiguration>([QueryKey.NTPClientConfiguration], configuration, {
                    updatedAt: Date.now(),
                });
            }).then(fetchNTPClientStatus).then((state) => {
                queryClient.setQueryData<NTPClientStatus>([QueryKey.NTPClientStatus], state, {
                    updatedAt: Date.now(),
                });
            });
        },
        onError: useOnSettingsChangeError("NTP Client")
    });
};

export const useTimerInfoQuery = () => {
    return useQuery({
        queryKey: [QueryKey.Timers],
        queryFn: fetchTimerInformation
    });
};

export const useTimerPropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.TimerProperties],
        queryFn: fetchTimerProperties,

        staleTime: Infinity
    });
};

export const useTimerCreationMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.Timers],
        mutationFn: (timer: Timer) => {
            return sendTimerCreation(timer).then(fetchTimerInformation);
        },
        onError: useOnSettingsChangeError("Timer")
    });
};

export const useTimerModificationMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.Timers],
        mutationFn: (timer: Timer) => {
            return sendTimerUpdate(timer).then(fetchTimerInformation);
        },
        onError: useOnSettingsChangeError("Timer")
    });
};

export const useTimerActionMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.Timers],
        mutationFn: (params: {timerId: string, timerAction: "execute_now"}) => {
            return sendTimerAction(params.timerId, params.timerAction).then(fetchTimerInformation);
        },
        onError: useOnSettingsChangeError("Timer")
    });
};

export const useTimerDeletionMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.Timers],
        mutationFn:(timerId: string) => {
            return deleteTimer(timerId).then(fetchTimerInformation);
        },
        onError: useOnSettingsChangeError("Timer")
    });
};

export const useNoCloudEventsQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.NoCloudEvents],
        queryFn: fetchNoCloudEvents,

        staleTime: 30_000,
        refetchInterval: 30_000
    });
};

export const useNoCloudEventsInteraction = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.NoCloudEvents],
        mutationFn: (interaction: NoCloudEventInteractionContext) => {
            return sendNoCloudEventInteraction(interaction).then(fetchNoCloudEvents);
        },
        onError: useOnSettingsChangeError("NoCloud Events")
    });
};

export function useNoCloudLogQuery(): UseQueryResult<string>;
export function useNoCloudLogQuery<T>(
    select: (status: StatusState) => T
): UseQueryResult<T>;
export function useNoCloudLogQuery() {
    useSSECacheAppender(QueryKey.Log, subscribeToLogMessages);

    return useQuery({
        queryKey: [QueryKey.Log],
        queryFn: fetchNoCloudLog,

        staleTime: Infinity,
    });
}

export const useLogLevelQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.LogLevel],
        queryFn: fetchNoCloudLogLevel,

        staleTime: Infinity
    });
};

export const useLogLevelMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.LogLevel],
        mutationFn: (logLevel: SetLogLevelRequest) => {
            return sendNoCloudLogLevel(logLevel).then(fetchNoCloudLogLevel);
        },
        onError: useOnSettingsChangeError("Log level")
    });
};

export const usePersistentMapQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.PersistentMap],
        queryFn: fetchPersistentMapState,

        staleTime: Infinity
    });
};

export const usePersistentMapMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.PersistentMap],
        mutationFn: (enabled: boolean) => {
            return sendPersistentMapEnabled(enabled).then(fetchPersistentMapState);
        },
        onError: useOnCommandError(Capability.PersistentMapControl)
    });
};

export const useMapResetMutation = () => {
    return useMutation({
        mutationFn: sendMapReset,
        onError: useOnCommandError(Capability.MapReset),
    });
};

export const useStartMappingPassMutation = () => {
    return useMutation({
        mutationFn: sendStartMappingPass,
        onError: useOnCommandError(Capability.MappingPass),
    });
};

export const useSpeakerVolumeStateQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.SpeakerVolume],
        queryFn: fetchSpeakerVolumeState,

        staleTime: Infinity
    });
};

export const useSpeakerVolumeMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.SpeakerVolume],
        mutationFn: (volume: number) => {
            return sendSpeakerVolume(volume).then(fetchSpeakerVolumeState);
        },
        onError: useOnCommandError(Capability.SpeakerVolumeControl)
    });
};

export const useSpeakerTestTriggerTriggerMutation = () => {
    return useMutation({
        mutationFn: sendSpeakerTestCommand,
        onError: useOnCommandError(Capability.SpeakerTest)
    });
};

export const useVoicePackManagementStateQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.VoicePackManagement],
        queryFn: fetchVoicePackManagementState,

        staleTime: 500,
    });
};

export const useVoicePackManagementMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.VoicePackManagement],
        mutationFn: (command: VoicePackManagementCommand) => {
            return sendVoicePackManagementCommand(command).then(fetchVoicePackManagementState);
        },
        onError: useOnCommandError(Capability.VoicePackManagement)
    });
};

export const useKeyLockStateQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.KeyLockInformation],
        queryFn: fetchKeyLockState,

        staleTime: Infinity
    });
};

export const useKeyLockStateMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.KeyLockInformation],
        mutationFn: (enable: boolean) => {
            return sendKeyLockEnable(enable).then(fetchKeyLockState);
        },
        onError: useOnCommandError(Capability.KeyLock)
    });
};

export const useCarpetModeStateQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.CarpetMode],
        queryFn: fetchCarpetModeState,

        staleTime: Infinity
    });
};

export const useCarpetModeStateMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.CarpetMode],
        mutationFn: (enable: boolean) => {
            return sendCarpetModeEnable(enable).then(fetchCarpetModeState);
        },
        onError: useOnCommandError(Capability.CarpetModeControl)
    });
};

export const useObstacleAvoidanceControlQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.ObstacleAvoidance],
        queryFn: fetchObstacleAvoidanceControlState,

        staleTime: Infinity
    });
};

export const useObstacleAvoidanceControlMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.ObstacleAvoidance],
        mutationFn: (enable: boolean) => {
            return sendObstacleAvoidanceControlState(enable).then(fetchObstacleAvoidanceControlState);
        },
        onError: useOnCommandError(Capability.ObstacleAvoidanceControl)
    });
};

export const usePetObstacleAvoidanceControlQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.PetObstacleAvoidance],
        queryFn: fetchPetObstacleAvoidanceControlState,

        staleTime: Infinity
    });
};

export const usePetObstacleAvoidanceControlMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.PetObstacleAvoidance],
        mutationFn: (enable: boolean) => {
            return sendPetObstacleAvoidanceControlState(enable).then(fetchPetObstacleAvoidanceControlState);
        },
        onError: useOnCommandError(Capability.PetObstacleAvoidanceControl)
    });
};


export const useAutoEmptyDockAutoEmptyControlQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.AutoEmptyDockAutoEmpty],
        queryFn: fetchAutoEmptyDockAutoEmptyControlState,

        staleTime: Infinity
    });
};

export const useAutoEmptyDockAutoEmptyControlMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.AutoEmptyDockAutoEmpty],
        mutationFn: (enable: boolean) => {
            return sendAutoEmptyDockAutoEmptyControlEnable(enable).then(fetchAutoEmptyDockAutoEmptyControlState);
        },
        onError: useOnCommandError(Capability.AutoEmptyDockAutoEmptyControl)
    });
};

export const useCollisionAvoidantNavigationControlQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.CollisionAvoidantNavigation],
        queryFn: fetchCollisionAvoidantNavigationControlState,

        staleTime: Infinity
    });
};

export const useCollisionAvoidantNavigationControlMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.CollisionAvoidantNavigation],
        mutationFn: (enable: boolean) => {
            return sendCollisionAvoidantNavigationControlState(enable).then(fetchCollisionAvoidantNavigationControlState);
        },
        onError: useOnCommandError(Capability.CollisionAvoidantNavigation)
    });
};

export const useDoNotDisturbConfigurationQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.DoNotDisturb],
        queryFn: fetchDoNotDisturbConfiguration,

        staleTime: Infinity
    });
};

export const useDoNotDisturbConfigurationMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.DoNotDisturb],
        mutationFn: (configuration: DoNotDisturbConfiguration) => {
            return sendDoNotDisturbConfiguration(configuration).then(fetchDoNotDisturbConfiguration);
        },
        onError: useOnCommandError(Capability.DoNotDisturb)
    });
};

export const useWifiStatusQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.WifiStatus],
        queryFn: fetchWifiStatus,

        staleTime: Infinity
    });
};

export const useWifiConfigurationPropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.WifiConfigurationProperties],
        queryFn: fetchWifiConfigurationProperties,

        staleTime: Infinity
    });
};

export const useWifiConfigurationMutation = (
    options?: UseMutationOptions<void, unknown, WifiConfiguration>
) => {
    const {
        refetch: refetchWifiStatus,
    } = useWifiStatusQuery();

    return useMutation({
        mutationFn: sendWifiConfiguration,
        onError: useOnCommandError(Capability.WifiConfiguration),
        onSuccess: async (data, ...args) => {
            refetchWifiStatus().catch(() => {
                /*intentional*/
            });

            await options?.onSuccess?.(data, ...args);
        }
    });
};

export const useWifiScanQuery = () => {
    return useQuery({
        queryKey: [QueryKey.WifiScan],
        queryFn: fetchWifiScan,

        staleTime: Infinity,
    });
};


export const useManualControlStateQuery = () => {
    return useQuery({
        queryKey: [QueryKey.ManualControl],
        queryFn: fetchManualControlState,

        staleTime: 10_000,
        refetchInterval: 10_000
    });
};

export const useManualControlPropertiesQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.ManualControlProperties],
        queryFn: fetchManualControlProperties,

        staleTime: Infinity
    });
};

export const useManualControlInteraction = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.ManualControl],
        mutationFn: (interaction: ManualControlInteraction) => {
            return sendManualControlInteraction(interaction).then(() => {
                if (interaction.action !== "move") {
                    return fetchManualControlState();
                }
            });
        },
        onError: useOnCommandError(Capability.ManualControl)
    });
};

export const useHighResolutionManualControlStateQuery = () => {
    return useQuery({
        queryKey: [QueryKey.HighResolutionManualControl],
        queryFn: fetchHighResolutionManualControlState,

        staleTime: 10_000,
        refetchInterval: 10_000
    });
};

export const useHighResolutionManualControlInteraction = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.HighResolutionManualControl],
        mutationFn: (interaction: HighResolutionManualControlInteraction) => {
            return sendHighResolutionManualControlInteraction(interaction).then(() => {
                if (interaction.action !== "move") {
                    return fetchHighResolutionManualControlState();
                }
            });
        },
        onError: useOnCommandError(Capability.HighResolutionManualControl)
    });
};

export const useCombinedVirtualRestrictionsPropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.CombinedVirtualRestrictionsProperties],
        queryFn: fetchCombinedVirtualRestrictionsProperties,

        staleTime: Infinity
    });
};

export const useCombinedVirtualRestrictionsMutation = (
    options?: UseMutationOptions<RobotAttribute[], unknown, CombinedVirtualRestrictionsUpdateRequestParameters>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (parameters: CombinedVirtualRestrictionsUpdateRequestParameters) => {
            return sendCombinedVirtualRestrictionsUpdate(parameters).then(fetchStateAttributes); //TODO: this should actually refetch the map
        },
        onError: useOnCommandError(Capability.CombinedVirtualRestrictions),
        ...options,
        onSuccess: async (data, ...args) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
            await options?.onSuccess?.(data, ...args);
        },
    });
};

export const useUpdaterConfigurationQuery = () => {
    return useQuery({
        queryKey: [QueryKey.UpdaterConfiguration],
        queryFn: fetchUpdaterConfiguration,

        staleTime: Infinity,
    });
};

export const useUpdaterConfigurationMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.UpdaterConfiguration],
        mutationFn: (updaterConfiguration: UpdaterConfiguration) => {
            return sendUpdaterConfiguration(updaterConfiguration).then(fetchUpdaterConfiguration);
        },
        onError: useOnSettingsChangeError("Updater")
    });
};

export const useUpdaterStateQuery = () => {
    return useQuery({
        queryKey: [QueryKey.UpdaterState],
        queryFn: fetchUpdaterState,

        staleTime: 5_000,
        refetchInterval: 5_000
    });
};

export const useUpdaterCommandMutation = () => {
    const {
        refetch: refetchUpdaterState,
    } = useUpdaterStateQuery();

    return useMutation({
        mutationFn: sendUpdaterCommand,
        onError: useOnCommandError("Updater"),
        onSuccess: () => {
            refetchUpdaterState().catch(() => {/*intentional*/});
        }
    });
};

export const useCurrentStatisticsQuery = () => {
    return useQuery({
        queryKey: [QueryKey.CurrentStatistics],
        queryFn: fetchCurrentStatistics,

        staleTime: 30_000,
        refetchInterval: 30_000
    });
};

export const useCurrentStatisticsPropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.CurrentStatisticsProperties],
        queryFn: fetchCurrentStatisticsProperties,

        staleTime: Infinity
    });
};

export const useTotalStatisticsQuery = () => {
    return useQuery({
        queryKey: [QueryKey.TotalStatistics],
        queryFn: fetchTotalStatistics,

        staleTime: 60_000,
        refetchInterval: 60_000
    });
};

export const useTotalStatisticsPropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.TotalStatisticsProperties],
        queryFn: fetchTotalStatisticsProperties,

        staleTime: Infinity
    });
};

export const useQuirksQuery = () => {
    return useQuery({
        queryKey: [QueryKey.Quirks],
        queryFn: fetchQuirks
    });
};

export const useSetQuirkValueMutation = () => {
    const {
        refetch: refetchQuirksState,
    } = useQuirksQuery();

    return useMutation({
        mutationFn: sendSetQuirkValueCommand,
        onError: useOnCommandError(Capability.Quirks),
        onSuccess: () => {
            refetchQuirksState().catch(() => {/*intentional*/});
        }
    });
};

export const useRobotPropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.RobotProperties],
        queryFn: fetchRobotProperties,

        staleTime: Infinity,
    });
};

export const useMopDockCleanManualTriggerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: MopDockCleanManualTriggerCommand) => {
            return sendMopDockCleanManualTriggerCommand(command).then(fetchStateAttributes);
        },

        onError: useOnCommandError(Capability.MopDockCleanManualTrigger),
        onSuccess: (data) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
        },
    });
};

export const useMopDockDryManualTriggerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (command: MopDockDryManualTriggerCommand) => {
            return sendMopDockDryManualTriggerCommand(command).then(fetchStateAttributes);
        },
        onError: useOnCommandError(Capability.MopDockDryManualTrigger),
        onSuccess: (data) => {
            queryClient.setQueryData<RobotAttribute[]>([QueryKey.Attributes], data, {
                updatedAt: Date.now(),
            });
        },
    });
};

export const useMopExtensionControlQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.MopExtensionControl],
        queryFn: fetchMopExtensionControlState,

        staleTime: Infinity
    });
};

export const useMopExtensionControlMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.MopExtensionControl],
        mutationFn: (enable: boolean) => {
            return sendMopExtensionControlState(enable).then(fetchMopExtensionControlState);
        },
        onError: useOnCommandError(Capability.MopExtensionControl)
    });
};

export const useCameraLightControlQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.CameraLightControl],
        queryFn: fetchCameraLightControlState,

        staleTime: Infinity
    });
};

export const useCameraLightControlMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.CameraLightControl],
        mutationFn: (enable: boolean) => {
            return sendCameraLightControlState(enable).then(fetchCameraLightControlState);
        },
        onError: useOnCommandError(Capability.CameraLightControl)
    });
};

export const useNoCloudCustomizationsQuery = () => {
    return useQuery({
        queryKey: [QueryKey.NoCloudCustomizations],
        queryFn: fetchNoCloudCustomizations,

        staleTime: Infinity,
    });
};

export const useNoCloudCustomizationsMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.NoCloudCustomizations],
        mutationFn: (configuration: NoCloudCustomizations) => {
            return sendNoCloudCustomizations(configuration).then(fetchNoCloudCustomizations);
        },
        onError: useOnSettingsChangeError("NoCloud Customizations")
    });
};

export const useCarpetSensorModeQuery = () => {
    return useQuery({
        queryKey: [QueryKey.CarpetSensorMode],
        queryFn: fetchCarpetSensorMode
    });
};

export const useCarpetSensorModeMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.CarpetSensorMode],
        mutationFn: (mode: CarpetSensorMode) => {
            return sendCarpetSensorMode({mode: mode}).then(fetchCarpetSensorMode);
        },
        onError: useOnCommandError(Capability.CarpetSensorModeControl)
    });
};

export const useCarpetSensorModePropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.CarpetSensorModeProperties],
        queryFn: fetchCarpetSensorModeProperties,

        staleTime: Infinity
    });
};


export const useAutoEmptyDockAutoEmptyIntervalQuery = () => {
    return useQuery({
        queryKey: [QueryKey.AutoEmptyDockAutoEmptyInterval],
        queryFn: fetchAutoEmptyDockAutoEmptyInterval
    });
};

export const useAutoEmptyDockAutoEmptyIntervalMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.AutoEmptyDockAutoEmptyInterval],
        mutationFn: (interval: AutoEmptyDockAutoEmptyInterval) => {
            return sendAutoEmptyDockAutoEmptyInterval({interval: interval}).then(fetchAutoEmptyDockAutoEmptyInterval);
        },
        onError: useOnCommandError(Capability.AutoEmptyDockAutoEmptyIntervalControl)
    });
};

export const useAutoEmptyDockAutoEmptyIntervalPropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.AutoEmptyDockAutoEmptyIntervalProperties],
        queryFn: fetchAutoEmptyDockAutoEmptyIntervalProperties,

        staleTime: Infinity
    });
};

export const useObstacleImagesQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.ObstacleImages],
        queryFn: fetchObstacleImagesState,

        staleTime: Infinity
    });
};

export const useObstacleImagesMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.ObstacleImages],
        mutationFn: (enable: boolean) => {
            return sendObstacleImagesState(enable).then(fetchObstacleImagesState);
        },
        onError: useOnCommandError(Capability.ObstacleImages)
    });
};


export const useObstacleImagesPropertiesQuery = () => {
    return useQuery( {
        queryKey: [QueryKey.ObstacleImagesProperties],
        queryFn: fetchObstacleImagesProperties,

        staleTime: Infinity,
    });
};

export const prefetchObstacleImagesProperties = async (queryClient : QueryClient) => {
    const queryKey = [QueryKey.ObstacleImagesProperties];

    if (!queryClient.getQueryData(queryKey)) {
        return queryClient.prefetchQuery({
            queryKey: [QueryKey.ObstacleImagesProperties],
            queryFn: fetchObstacleImagesProperties,
        });
    }
};

export const useMopDockMopWashTemperatureQuery = () => {
    return useQuery({
        queryKey: [QueryKey.MopDockMopWashTemperature],
        queryFn: fetchMopDockMopWashTemperature,
    });
};

export const useMopDockMopWashTemperatureMutation = () => {
    return useNoCloudFetchingMutation({
        queryKey: [QueryKey.MopDockMopWashTemperature],
        mutationFn: (temperature: MopDockMopWashTemperature) => {
            return sendMopDockMopWashTemperature({ temperature: temperature }).then(
                fetchMopDockMopWashTemperature
            );
        },
        onError: useOnCommandError(Capability.MopDockMopWashTemperatureControl),
    });
};

export const useMopDockMopWashTemperaturePropertiesQuery = () => {
    return useQuery({
        queryKey: [QueryKey.MopDockMopWashTemperatureProperties],
        queryFn: fetchMopDockMopWashTemperatureProperties,

        staleTime: Infinity,
    });
};
