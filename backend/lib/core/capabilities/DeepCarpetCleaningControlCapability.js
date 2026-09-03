const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class DeepCarpetCleaningControlCapability extends SimpleToggleCapability {
    getType() {
        return DeepCarpetCleaningControlCapability.TYPE;
    }
}

DeepCarpetCleaningControlCapability.TYPE = "DeepCarpetCleaningControlCapability";

module.exports = DeepCarpetCleaningControlCapability;
