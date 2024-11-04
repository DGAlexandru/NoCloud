const MiioWifiConfigurationCapability = require("../../common/miioCapabilities/MiioWifiConfigurationCapability");
const NoCloudWifiStatus = require("../../../entities/core/NoCloudWifiStatus");

class RoborockWifiConfigurationCapability extends MiioWifiConfigurationCapability {
    /**
     * @returns {Promise<NoCloudWifiStatus>}
     */
    async getWifiStatus() {
        if (this.robot.config.get("embedded") === true) {
            return super.getWifiStatus();
        }

        const output = {
            state: NoCloudWifiStatus.STATE.UNKNOWN,
            details: {}
        };

        let res = await this.robot.sendCommand("get_network_info");

        if (res !== "unknown_method") {
            if (typeof res === "object" && res.bssid !== "") {
                output.state = NoCloudWifiStatus.STATE.CONNECTED;

                output.details.signal = parseInt(res.rssi);
                output.details.ips = [res.ip];
                output.details.ssid = res.ssid;
                output.details.frequency = NoCloudWifiStatus.FREQUENCY_TYPE.W2_4Ghz;
            } else {
                output.details.state = NoCloudWifiStatus.STATE.NOT_CONNECTED;
            }
        }


        return new NoCloudWifiStatus(output);
    }
}

module.exports = RoborockWifiConfigurationCapability;
