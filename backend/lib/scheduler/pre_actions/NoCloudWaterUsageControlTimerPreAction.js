const NoCloudPresetSelectionTimerPreAction = require("./NoCloudPresetSelectionTimerPreAction");
const WaterUsageControlCapability = require("../../core/capabilities/WaterUsageControlCapability");

class NoCloudWaterUsageControlTimerPreAction extends NoCloudPresetSelectionTimerPreAction {
    /**
     * @param {object} options
     * @param {import("../../core/NoCloudRobot")} options.robot
     * @param {string} options.value
     */
    constructor(options) {
        super({
            ...options,
            capability_type: WaterUsageControlCapability.TYPE
        });
    }
}

module.exports = NoCloudWaterUsageControlTimerPreAction;
