import {AttachmentStateAttributeType, DockComponentStateAttributeType} from "./RawRobotState";

export enum Capability {
    AutoEmptyDockAutoEmptyDurationControl = "AutoEmptyDockAutoEmptyDurationControlCapability",
    AutoEmptyDockAutoEmptyIntervalControl = "AutoEmptyDockAutoEmptyIntervalControlCapability",
    AutoEmptyDockManualTrigger = "AutoEmptyDockManualTriggerCapability",
    BasicControl = "BasicControlCapability",
    CameraLightControl = "CameraLightControlCapability",
    CarpetModeControl = "CarpetModeControlCapability",
    CarpetSensorModeControl = "CarpetSensorModeControlCapability",
    CleanCarpetsFirstControl = "CleanCarpetsFirstControlCapability",
    CleanRouteControl = "CleanRouteControlCapability",
    CollisionAvoidantNavigation = "CollisionAvoidantNavigationControlCapability",
    CombinedVirtualRestrictions = "CombinedVirtualRestrictionsCapability",
    ConsumableMonitoring = "ConsumableMonitoringCapability",
    CurrentStatistics = "CurrentStatisticsCapability",
    DoNotDisturb = "DoNotDisturbCapability",
    FanSpeedControl = "FanSpeedControlCapability",
    FloorMaterialDirectionAwareNavigationControl = "FloorMaterialDirectionAwareNavigationControlCapability",
    GoToLocation = "GoToLocationCapability",
    HighResolutionManualControl = "HighResolutionManualControlCapability",
    KeyLock = "KeyLockCapability",
    Locate = "LocateCapability",
    ManualControl = "ManualControlCapability",
    ManualMIoTCommand = "ManualMIoTCommandCapability",
    MapReset = "MapResetCapability",
    MapSegmentEdit = "MapSegmentEditCapability",
    MapSegmentMaterialControl = "MapSegmentMaterialControlCapability",
    MapSegmentRename = "MapSegmentRenameCapability",
    MapSegmentation = "MapSegmentationCapability",
    MapSnapshot = "MapSnapshotCapability",
    MappingPass = "MappingPassCapability",
    MopDockCleanManualTrigger = "MopDockCleanManualTriggerCapability",
    MopDockDryManualTrigger = "MopDockDryManualTriggerCapability",
    MopDockMopAutoDryingControl = "MopDockMopAutoDryingControlCapability",
    MopDockMopDryingTimeControl = "MopDockMopDryingTimeControlCapability",
    MopDockMopWashTemperatureControl = "MopDockMopWashTemperatureControlCapability",
    MopExtensionControl = "MopExtensionControlCapability",
    MopExtensionFurnitureLegHandlingControl = "MopExtensionFurnitureLegHandlingControlCapability",
    MopGapControl = "MopGapControlCapability",
    MopTightPatternControl = "MopTightPatternControlCapability",
    MopTwistFrequencyControl = "MopTwistFrequencyControlCapability",
    ObstacleAvoidanceControl = "ObstacleAvoidanceControlCapability",
    ObstacleImages = "ObstacleImagesCapability",
    OperationModeControl = "OperationModeControlCapability",
    PersistentMapControl = "PersistentMapControlCapability",
    PetObstacleAvoidanceControl = "PetObstacleAvoidanceControlCapability",
    Quirks = "QuirksCapability",
    SpeakerTest = "SpeakerTestCapability",
    SpeakerVolumeControl = "SpeakerVolumeControlCapability",
    TotalStatistics = "TotalStatisticsCapability",
    VoicePackManagement = "VoicePackManagementCapability",
    WaterUsageControl = "WaterUsageControlCapability",
    WifiConfiguration = "WifiConfigurationCapability",
    WifiScan = "WifiScanCapability",
    ZoneCleaning = "ZoneCleaningCapability",
}

export type Point = {
    x: number;
    y: number;
};

export interface Zone {
    points: {
        pA: Point;
        pB: Point;
        pC: Point;
        pD: Point;
    };
}

export interface ZoneActionRequestParameters {
    zones: Zone[];
    iterations?: number;
}

export interface ZoneProperties {
    zoneCount: {
        min: number;
        max: number;
    };
    iterationCount: {
        min: number;
        max: number;
    };
}

export interface MapSegmentationProperties {
    iterationCount: {
        min: number;
        max: number;
    };
    customOrderSupported: boolean;
}

export interface Segment {
    id: string;
    name?: string;
}

export interface RobotInformation {
    manufacturer: string;
    modelName: string;
    modelDetails: {
        supportedAttachments: Array<AttachmentStateAttributeType>;
        supportedDockComponents: Array<DockComponentStateAttributeType>;
    }
    implementation: string;
}

export interface NoCloudInformation {
    embedded: boolean;
    systemId: string;
    welcomeDialogDismissed: boolean;
}

export interface NoCloudVersion {
    release: string;
    commit: string;
}

export enum CPUUsageType {
    USER = "user",
    NICE = "nice",
    SYS = "sys",
    IDLE = "idle",
    IRQ = "irq"
}

export interface SystemHostInfo {
    hostname: string;
    arch: string;
    mem: {
        total: number;
        free: number;
        NoCloud_current: number;
        NoCloud_max: number;
    };
    uptime: number;
    load: {
        1: number;
        5: number;
        15: number;
    };
    cpus: Array<{
        usage: Record<CPUUsageType, number>
    }>
}

export interface SystemRuntimeInfo {
    uptime: number;
    argv: Array<string>;
    execArgv: Array<string>;
    execPath: string;
    uid: number;
    gid: number;
    pid: number;
    versions: Record<string, string>;
    env: Record<string, string>
}

export interface MapSegmentationActionRequestParameters {
    segment_ids: string[];
    iterations?: number;
    customOrder?: boolean;
}

export interface MapSegmentEditJoinRequestParameters {
    segment_a_id: string;
    segment_b_id: string;
}

export interface MapSegmentEditSplitRequestParameters {
    segment_id: string;
    pA: Point;
    pB: Point;
}

export enum MapSegmentMaterial {
    Carpet = "carpet",
    Generic = "generic",
    Tile = "tile",
    LowPileCarpet = "low_pile_carpet",
    MediumPileCarpet = "medium_pile_carpet",
    Wood = "wood",
    WoodHorizontal = "wood_horizontal",
    WoodVertical = "wood_vertical"
}

export interface MapSegmentMaterialControlProperties {
    supportedMaterials: Array<MapSegmentMaterial>;
}

export interface MapSegmentMaterialControlRequestParameters {
    segment_id: string;
    material: MapSegmentMaterial;
}

export interface MapSegmentRenameRequestParameters {
    segment_id: string;
    name: string;
}

export type CleanRoute = "quick" | "normal" | "intensive" | "deep";

export interface CleanRoutePayload {
    route: CleanRoute
}

export interface CleanRouteControlProperties {
    supportedRoutes: Array<CleanRoute>,
    mopOnly: Array<CleanRoute>,
    oneTime: Array<CleanRoute>,
}

export type ConsumableType = "filter" | "brush" | "mop" | "detergent" | "bin" | "cleaning";
export type ConsumableSubType = "none" | "all" | "main" | "secondary" | "side_left" | "side_right" | "dock" | "sensor" | "wheel";
export type ConsumableUnit = "minutes" | "percent";

export interface ConsumableState {
    type: ConsumableType;
    subType?: ConsumableSubType;
    remaining: {
        value: number;
        unit: ConsumableUnit;
    }
}

export interface ConsumableId {
    type: ConsumableType;
    subType?: ConsumableSubType;
}

export interface ConsumableMeta {
    type: ConsumableType,
    subType: ConsumableSubType,
    unit: ConsumableUnit,
    maxValue?: number
}

export interface ConsumableProperties {
    availableConsumables: Array<ConsumableMeta>
}

export enum NoCloudTimerActionType {
    FULL_CLEANUP = "full_cleanup",
    SEGMENT_CLEANUP = "segment_cleanup"
}

export enum NoCloudTimerPreActionType {
    FAN_SPEED_CONTROL = "fan_speed_control",
    WATER_USAGE_CONTROL = "water_usage_control",
    OPERATION_MODE_CONTROL = "operation_mode_control"
}

export interface Timer {
    id: string;
    enabled: boolean;
    label?: string;
    dow: Array<number>;
    hour: number;
    minute: number;
    action: {
        type: NoCloudTimerActionType;
        params: Record<string, unknown>;
    };
    pre_actions?: Array<{
        type: NoCloudTimerPreActionType;
        params: Record<string, unknown>;
    }>;
}

export interface TimerInformation {
    [id: string]: Timer;
}

export interface TimerProperties {
    supportedActions: Array<NoCloudTimerActionType>;
    supportedPreActions: Array<NoCloudTimerPreActionType>
}

export interface MQTTConfiguration {
    enabled: boolean;
    connection: {
        host: string;
        port: number;
        tls: {
            enabled: boolean;
            ca: string;
            ignoreCertificateErrors: boolean;
        };
        authentication: {
            credentials: {
                enabled: boolean;
                username: string;
                password: string;
            };
            clientCertificate: {
                enabled: boolean;
                certificate: string;
                key: string;
            };
        };
    };
    identity: {
        identifier: string;
    };
    customizations: {
        topicPrefix: string;
        provideMapData: boolean;
    };
    interfaces: {
        homie: {
            enabled: boolean;
            cleanAttributesOnShutdown: boolean;
        };
        homeassistant: {
            enabled: boolean;
            cleanAutoconfOnShutdown: boolean;
        };
    };
    optionalExposedCapabilities: Array<string>;
}

export interface MQTTStatus {
    state: "init" | "ready" | "disconnected" | "lost" | "alert",
    stats: {
        messages: {
            count: {
                received: number;
                sent: number;
            },
            bytes: {
                received: number;
                sent: number;
            }
        },
        connection: {
            connects: number;
            disconnects: number;
            reconnects: number;
            errors: number;
        }
    }
}

export interface MQTTProperties {
    defaults: {
        identity: {
            identifier: string;
        };
        customizations: {
            topicPrefix: string;
        };
    };
    optionalExposableCapabilities: Array<string>;
}

export interface HTTPBasicAuthConfiguration {
    enabled: boolean;
    username: string;
    password: string;
}

export interface NetworkAdvertisementConfiguration {
    enabled: boolean;
}

export interface NetworkAdvertisementProperties {
    port: number;
    zeroconfHostname: string;
}

export interface NTPClientState {
    __class: "NoCloudNTPClientDisabledState" | "NoCloudNTPClientEnabledState" | "NoCloudNTPClientErrorState" | "NoCloudNTPClientSyncedState";
    timestamp: string;
    type?: "unknown" | "transient" | "name_resolution" | "connection" | "persisting";
    message?: string;
    offset?: number;
}

export interface NTPClientStatus {
    state: NTPClientState,
    robotTime: string
}

export interface NTPClientConfiguration {
    enabled: boolean;
    server: string;
    port: number;
    interval: number;
    timeout: number;
}

export interface PushNotifClientState {
    __class: "NoCloudPushNotifClientDisabledState" | "NoCloudPushNotifClientEnabledState" | "NoCloudPushNotifClientErrorState" | "NoCloudPushNotifClientSyncedState";
    timestamp: string;
    type?: "unknown" | "transient" | "name_resolution" | "connection" | "persisting";
    message?: string;
    lastMessage?: string | null;
    lastTitle?: string | null;
    lastPriority?: number;
}

export interface PushNotifClientStatus {
    state: PushNotifClientState,
    robotTime: string
}

export interface PushNotifClientConfiguration {
    enabled: boolean;
    server: string;
    path: string;
    port: number;
    token: string;
    user: string;
    sound: string;
    priority: number;
    retry: number;
    expire: number;
    titleID: string;
    url: string;
    rateLimit: number;
    rateLimitTime: number;
    pushEvents: boolean;
    processEvents: boolean;
}

export interface SendPushNotifClientParams {
    message: string;
    title?: string;
    sound?: string;
    priority?: number;
    retry?: number;
    expire?: number;
    titleID?: string;
    url?: string;
}

export interface NoCloudEvent {
    __class: string;
    id: string;
    timestamp: string;
    processed: boolean;
    type?: string;
    subType?: string;
    message?: string;
}

export interface NoCloudEventInteraction {
    interaction: "ok" | "yes" | "no" | "reset";
}

// Helper for Hook
export interface NoCloudEventInteractionContext {
    id: string;
    interaction: NoCloudEventInteraction;
}

export enum LogLevel {
    trace = "trace",
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error"
}

export interface LogLevelResponse {
    current: string;
    presets: Array<LogLevel>;
}

export interface SetLogLevelRequest {
    level: LogLevel;
}

export interface LogLine {
    timestamp: Date,
    level: LogLevel,
    content: string
}

export interface SimpleToggleState {
    enabled: boolean;
}

export interface SpeakerVolumeState {
    volume: number;
}

export interface VoicePackManagementStatus {
    currentLanguage: string;
    operationStatus: {
        type: "idle" | "downloading" | "installing" | "error";
        progress?: number;
    }
}

export interface VoicePackManagementCommand {
    action: "download";
    url: string;
    language: string;
    hash: string;
}

export interface DoNotDisturbTime {
    hour: number;
    minute: number;
}

export interface DoNotDisturbConfiguration {
    enabled: boolean;
    start: DoNotDisturbTime;
    end: DoNotDisturbTime;
}

export interface WifiConfiguration {
    ssid: string;
    credentials: {
        type: "wpa2_psk";
        typeSpecificSettings: {
            password: string;
        };
    }

}

export interface WifiStatus {
    state: "connected" | "not_connected" | "unknown";
    details: {
        ssid?: string;
        downspeed?: number;
        upspeed?: number;
        signal?: number;
        ips?: string[];
        frequency?: "2.4ghz" | "5ghz";
    };
}

export interface WifiConfigurationProperties {
    provisionedReconfigurationSupported: boolean;
}

export interface NoCloudWifiNetwork {
    bssid: string,
    details: {
        ssid?: string,
        signal?: number
    }
}

export type ManualMIoTCommandAction = "get_properties" | "set_properties" | "action" | string;

export interface ManualMIoTCommandProperties {
    supportedManualMIoTCommandActions: Array<ManualMIoTCommandAction>;
}

export interface ManualMIoTCommandInteraction {
    miotcmd: ManualMIoTCommandAction; // allows any string
    siid: string;
    piid: string; // used also for aiid
    value?: string;
}

export type ManualControlAction = "enable" | "disable" | "move";

export type ManualControlCommand = "forward" | "backward" | "rotate_clockwise" | "rotate_counterclockwise";

export interface ManualControlProperties {
    supportedMovementCommands: Array<ManualControlCommand>;
}

export interface ManualControlInteraction {
    action: ManualControlAction;
    movementCommand?: ManualControlCommand;
}

export interface NoCloudManualMovementVector {
    velocity: number;
    angle: number;
}

export interface HighResolutionManualControlInteraction {
    action: ManualControlAction;
    vector?: NoCloudManualMovementVector;
}

export enum NoCloudRestrictedZoneType {
    Regular = "regular",
    Mop = "mop"
}

export interface NoCloudRestrictedZone {
    type: NoCloudRestrictedZoneType,
    points: {
        pA: Point,
        pB: Point,
        pC: Point,
        pD: Point
    }
}

export interface CombinedVirtualRestrictionsUpdateRequestParameters {
    virtualWalls: Array<{
        points: {
            pA: Point,
            pB: Point
        }
    }>,
    restrictedZones: Array<NoCloudRestrictedZone>
}

export interface CombinedVirtualRestrictionsProperties {
    supportedRestrictedZoneTypes: Array<NoCloudRestrictedZoneType>
}

export interface UpdaterConfiguration {
    updateProvider: "github" | "github_nightly";
}

export interface UpdaterStateMetaData {
    progress: number | undefined;
}

export interface UpdaterState {
    __class: "NoCloudUpdaterIdleState" | "NoCloudUpdaterErrorState" | "NoCloudUpdaterApprovalPendingState" | "NoCloudUpdaterDownloadingState" | "NoCloudUpdaterApplyPendingState" | "NoCloudUpdaterDisabledState" | "NoCloudUpdaterNoUpdateRequiredState";
    timestamp: string;
    metaData: UpdaterStateMetaData;
    busy: boolean;
    type?: "unknown" | "not_embedded" | "not_docked" | "not_writable" | "not_enough_space" | "download_failed" | "no_matching_binary" | "missing_manifest" | "invalid_manifest" | "invalid_checksum" | "not_idle";
    message?: string;
    currentVersion?: string;
    version?: string;
    releaseTimestamp?: string;
    changelog?: string;
    downloadUrl?: string;
    expectedHash?: string;
    downloadPath?: string;
}

export type NoCloudDataPointType = "count" | "time" | "area"

export interface NoCloudDataPoint {
    timestamp: string,
    type: NoCloudDataPointType,
    value: number
}

export interface StatisticsProperties {
    availableStatistics: Array<NoCloudDataPointType>
}

export interface Quirk {
    id: string,
    options: Array<string>,
    title: string,
    description: string,
    value: string
}

export interface SetQuirkValueCommand {
    id: string,
    value: string
}

export interface RobotProperties {
    firmwareVersion: string
}

export interface NoCloudCustomizations {
    friendlyName: string;
}

export type CarpetSensorMode = "off" | "avoid" | "lift" | "detach" | "cross";

export interface CarpetSensorModePayload {
    mode: CarpetSensorMode
}

export interface CarpetSensorModeControlProperties {
    supportedModes: Array<CarpetSensorMode>
}

export type AutoEmptyDockAutoEmptyDuration = "auto" | "short" | "medium" | "long";

export interface AutoEmptyDockAutoEmptyDurationPayload {
    duration: AutoEmptyDockAutoEmptyDuration
}

export interface AutoEmptyDockAutoEmptyDurationControlProperties {
    supportedDurations: Array<AutoEmptyDockAutoEmptyDuration>,
}

export type AutoEmptyDockAutoEmptyInterval = "off" | "infrequent" | "normal" | "frequent" ;

export interface AutoEmptyDockAutoEmptyIntervalPayload {
    interval: AutoEmptyDockAutoEmptyInterval
}

export interface AutoEmptyDockAutoEmptyIntervalProperties {
    supportedIntervals: Array<AutoEmptyDockAutoEmptyInterval>
}

export interface ObstacleImagesProperties {
    dimensions: {
        width: number,
        height: number
    }
}

export type MopDockMopDryingDuration = "1h" | "2h" | "3h" | "4h" | "cold";

export interface MopDockMopDryingTimePayload {
    duration: MopDockMopDryingDuration
}

export interface MopDockMopDryingTimeControlProperties {
    supportedDurations: Array<MopDockMopDryingDuration>,
}

export type MopDockMopWashTemperature = "cold" | "warm" | "hot" | "scalding" | "boiling";

export interface MopDockMopWashTemperaturePayload {
    temperature: MopDockMopWashTemperature;
}

export interface MopDockMopWashTemperatureProperties {
    supportedTemperatures: Array<MopDockMopWashTemperature>;
}

export type MopTwistFrequency = "off" | "each_cleanup" | "every_7_days";

export interface MopTwistFrequencyPayload {
    mopTwist: MopTwistFrequency
}

export interface MopTwistFrequencyControlProperties {
    supportedMopTwists: Array<MopTwistFrequency>
}
