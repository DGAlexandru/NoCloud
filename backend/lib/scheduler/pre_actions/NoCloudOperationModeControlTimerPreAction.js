const NoCloudPresetSelectionTimerPreAction = require("./NoCloudPresetSelectionTimerPreAction");
const OperationModeControlCapability = require("../../core/capabilities/OperationModeControlCapability");

class NoCloudOperationModeControlTimerPreAction extends NoCloudPresetSelectionTimerPreAction {
    /**
     * @param {object} options
     * @param {import("../../core/NoCloudRobot")} options.robot
     * @param {string} options.value
     */
    constructor(options) {
        super({
            ...options,
            capability_type: OperationModeControlCapability.TYPE
        });
    }
}

module.exports = NoCloudOperationModeControlTimerPreAction;
