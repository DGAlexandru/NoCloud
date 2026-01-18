const express = require("express");

const capabilities = require("../core/capabilities");
const capabilityRouters = require("./capabilityRouters");

const Logger = require("../Logger");

class CapabilitiesRouter {
    /**
     * Takes a NoCloudRobot and creates routers for each capability it features
     *
     * @param {object} options
     * @param {import("../core/NoCloudRobot")} options.robot
     * @param {*} options.validator
     */
    constructor(options) {
        this.robot = options.robot;
        this.router = express.Router({mergeParams: true});

        this.validator = options.validator;

        this.initRoutes();
    }


    initRoutes() {
        this.router.get("/", (req, res) => {
            res.json(Object.values(this.robot.capabilities).map(c => {
                return c.getType();
            }));
        });

        const missingRouters = [];

        Object.values(this.robot.capabilities).forEach(robotCapability => {
            const matchedRouter = CAPABILITY_TYPE_TO_ROUTER_MAPPING[robotCapability.getType()];

            if (!matchedRouter) {
                missingRouters.push(robotCapability.getType());
            } else {
                this.router.use(
                    "/" + robotCapability.getType(),
                    new matchedRouter({capability: robotCapability, validator: this.validator}).getRouter()
                );
            }
        });

        if (missingRouters.length > 0) {
            missingRouters.forEach(capType =>
                Logger.error(`No matching CapabilityRouter for ${capType}`)
            );
            throw new Error(`Missing routers for the following capabilities: ${missingRouters.join(", ")}`);
        }
    }

    getRouter() {
        return this.router;
    }
}

const CAPABILITY_TYPE_TO_ROUTER_MAPPING = {
    [capabilities.AutoEmptyDockAutoEmptyIntervalControlCapability.TYPE]: capabilityRouters.AutoEmptyDockAutoEmptyIntervalControlCapabilityRouter,
    [capabilities.AutoEmptyDockManualTriggerCapability.TYPE]: capabilityRouters.AutoEmptyDockManualTriggerCapabilityRouter,
    [capabilities.BasicControlCapability.TYPE]: capabilityRouters.BasicControlCapabilityRouter,
    [capabilities.CameraLightControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.CarpetModeControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.CarpetSensorModeControlCapability.TYPE]: capabilityRouters.CarpetSensorModeControlCapabilityRouter,
    [capabilities.CollisionAvoidantNavigationControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.CombinedVirtualRestrictionsCapability.TYPE]: capabilityRouters.CombinedVirtualRestrictionsCapabilityRouter,
    [capabilities.ConsumableMonitoringCapability.TYPE]: capabilityRouters.ConsumableMonitoringCapabilityRouter,
    [capabilities.CurrentStatisticsCapability.TYPE]: capabilityRouters.StatisticsCapabilityRouter,
    [capabilities.DoNotDisturbCapability.TYPE]: capabilityRouters.DoNotDisturbCapabilityRouter,
    [capabilities.FanSpeedControlCapability.TYPE]: capabilityRouters.PresetSelectionCapabilityRouter,
    [capabilities.GoToLocationCapability.TYPE]: capabilityRouters.GoToLocationCapabilityRouter,
    [capabilities.HighResolutionManualControlCapability.TYPE]: capabilityRouters.HighResolutionManualControlCapabilityRouter,
    [capabilities.KeyLockCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.LocateCapability.TYPE]: capabilityRouters.LocateCapabilityRouter,
    [capabilities.ManualControlCapability.TYPE]: capabilityRouters.ManualControlCapabilityRouter,
    [capabilities.ManualMIoTCommandCapability.TYPE ]: capabilityRouters.ManualMIoTCommandCapabilityRouter,
    [capabilities.MapResetCapability.TYPE]: capabilityRouters.MapResetCapabilityRouter,
    [capabilities.MapSegmentEditCapability.TYPE]: capabilityRouters.MapSegmentEditCapabilityRouter,
    [capabilities.MapSegmentMaterialControlCapability.TYPE]: capabilityRouters.MapSegmentMaterialControlCapabilityRouter,
    [capabilities.MapSegmentRenameCapability.TYPE]: capabilityRouters.MapSegmentRenameCapabilityRouter,
    [capabilities.MapSegmentationCapability.TYPE]: capabilityRouters.MapSegmentationCapabilityRouter,
    [capabilities.MapSnapshotCapability.TYPE]: capabilityRouters.MapSnapshotCapabilityRouter,
    [capabilities.MappingPassCapability.TYPE]: capabilityRouters.MappingPassCapabilityRouter,
    [capabilities.MopDockCleanManualTriggerCapability.TYPE]: capabilityRouters.MopDockCleanManualTriggerCapabilityRouter,
    [capabilities.MopDockDryManualTriggerCapability.TYPE]: capabilityRouters.MopDockDryManualTriggerCapabilityRouter,
    [capabilities.MopDockMopAutoDryingControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.MopDockMopWashTemperatureControlCapability.TYPE]: capabilityRouters.MopDockMopWashTemperatureControlCapabilityRouter,
    [capabilities.MopExtensionControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.MopExtensionFurnitureLegHandlingControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.MopGapControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.MopTwistFrequencyControlCapability.TYPE]: capabilityRouters.MopTwistFrequencyControlCapabilityRouter,
    [capabilities.ObstacleAvoidanceControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.ObstacleImagesCapability.TYPE]: capabilityRouters.ObstacleImagesCapabilityRouter,
    [capabilities.OperationModeControlCapability.TYPE]: capabilityRouters.PresetSelectionCapabilityRouter,
    [capabilities.PendingMapChangeHandlingCapability.TYPE]: capabilityRouters.PendingMapChangeHandlingCapabilityRouter,
    [capabilities.PersistentMapControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.PetObstacleAvoidanceControlCapability.TYPE]: capabilityRouters.SimpleToggleCapabilityRouter,
    [capabilities.QuirksCapability.TYPE]: capabilityRouters.QuirksCapabilityRouter,
    [capabilities.SpeakerTestCapability.TYPE]: capabilityRouters.SpeakerTestCapabilityRouter,
    [capabilities.SpeakerVolumeControlCapability.TYPE]: capabilityRouters.SpeakerVolumeControlCapabilityRouter,
    [capabilities.TotalStatisticsCapability.TYPE]: capabilityRouters.StatisticsCapabilityRouter,
    [capabilities.VoicePackManagementCapability.TYPE]: capabilityRouters.VoicePackManagementCapabilityRouter,
    [capabilities.WaterUsageControlCapability.TYPE]: capabilityRouters.PresetSelectionCapabilityRouter,
    [capabilities.WifiConfigurationCapability.TYPE]: capabilityRouters.WifiConfigurationCapabilityRouter,
    [capabilities.WifiScanCapability.TYPE]: capabilityRouters.WifiScanCapabilityRouter,
    [capabilities.ZoneCleaningCapability.TYPE]: capabilityRouters.ZoneCleaningCapabilityRouter
};

module.exports = CapabilitiesRouter;
