const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class MopGapControlCapability extends SimpleToggleCapability {
    getType() {
        return MopGapControlCapability.TYPE;
    }
}

MopGapControlCapability.TYPE = "MopGapControlCapability";

module.exports = MopGapControlCapability;
