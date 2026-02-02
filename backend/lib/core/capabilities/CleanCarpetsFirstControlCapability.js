const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class CleanCarpetsFirstControlCapability extends SimpleToggleCapability {
    getType() {
        return CleanCarpetsFirstControlCapability.TYPE;
    }
}

CleanCarpetsFirstControlCapability.TYPE = "CleanCarpetsFirstControlCapability";

module.exports = CleanCarpetsFirstControlCapability;
