const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class CarpetModeControlCapability extends SimpleToggleCapability {
    getType() {
        return CarpetModeControlCapability.TYPE;
    }
}

CarpetModeControlCapability.TYPE = "CarpetModeControlCapability";

module.exports = CarpetModeControlCapability;
