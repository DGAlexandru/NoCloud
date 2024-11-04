const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class DoNotDisturbCapability extends Capability {
    /**
     *
     * @abstract
     * @returns {Promise<import("../../entities/core/NoCloudDNDConfiguration")>}
     */
    async getDndConfiguration() {
        throw new NotImplementedError();
    }

    /**
     * @abstract
     * @param {import("../../entities/core/NoCloudDNDConfiguration")} dndConfig
     * @returns {Promise<void>}
     */
    async setDndConfiguration(dndConfig) {
        throw new NotImplementedError();
    }

    getType() {
        return DoNotDisturbCapability.TYPE;
    }
}

DoNotDisturbCapability.TYPE = "DoNotDisturbCapability";

module.exports = DoNotDisturbCapability;
