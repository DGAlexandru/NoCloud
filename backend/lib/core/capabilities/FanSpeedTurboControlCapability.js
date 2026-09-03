const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class FanSpeedTurboControlCapability extends SimpleToggleCapability {
    getType() {
        return FanSpeedTurboControlCapability.TYPE;
    }
}

FanSpeedTurboControlCapability.TYPE = "FanSpeedTurboControlCapability";

module.exports = FanSpeedTurboControlCapability;
