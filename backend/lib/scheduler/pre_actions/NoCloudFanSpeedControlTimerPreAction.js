const FanSpeedControlCapability = require("../../core/capabilities/FanSpeedControlCapability");
const NoCloudPresetSelectionTimerPreAction = require("./NoCloudPresetSelectionTimerPreAction");

class NoCloudFanSpeedControlTimerPreAction extends NoCloudPresetSelectionTimerPreAction {
    /**
     * @param {object} options
     * @param {import("../../core/NoCloudRobot")} options.robot
     * @param {string} options.value
     */
    constructor(options) {
        super({
            ...options,
            capability_type: FanSpeedControlCapability.TYPE
        });
    }
}

module.exports = NoCloudFanSpeedControlTimerPreAction;
