const Capability = require("./Capability");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class NoCloudBasedCapability extends Capability {
    async shutdown() {
        // no-op
    }
}

module.exports = NoCloudBasedCapability;
