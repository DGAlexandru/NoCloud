const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class WifiScanCapability extends Capability {
    /**
     * @abstract
     * @returns {Promise<Array<import("../../entities/core/NoCloudWifiNetwork")>>}
     */
    async scan() {
        throw new NotImplementedError();
    }

    getType() {
        return WifiScanCapability.TYPE;
    }
}

WifiScanCapability.TYPE = "WifiScanCapability";

module.exports = WifiScanCapability;
