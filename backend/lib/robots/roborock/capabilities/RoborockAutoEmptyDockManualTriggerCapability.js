const AutoEmptyDockManualTriggerCapability = require("../../../core/capabilities/AutoEmptyDockManualTriggerCapability");

/**
 * @extends AutoEmptyDockManualTriggerCapability<import("../RoborockNoCloudRobot")>
 */
class RoborockAutoEmptyDockManualTriggerCapability extends AutoEmptyDockManualTriggerCapability {
    async triggerAutoEmpty() {
        await this.robot.sendCommand("app_start_collect_dust", [], {});
    }
}

module.exports = RoborockAutoEmptyDockManualTriggerCapability;
