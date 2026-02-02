const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class MopTightPatternControlCapability extends SimpleToggleCapability {
    getType() {
        return MopTightPatternControlCapability.TYPE;
    }
}

MopTightPatternControlCapability.TYPE = "MopTightPatternControlCapability";

module.exports = MopTightPatternControlCapability;
