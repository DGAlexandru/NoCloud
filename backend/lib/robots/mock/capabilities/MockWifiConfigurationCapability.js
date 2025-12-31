const NoCloudWifiStatus = require("../../../entities/core/NoCloudWifiStatus");
const WifiConfigurationCapability = require("../../../core/capabilities/WifiConfigurationCapability");

/**
 * @extends WifiConfigurationCapability<import("../MockNoCloudRobot")>
 */
class MockWifiConfigurationCapability extends WifiConfigurationCapability {
    /**
     * @param {object} options
     * @param {import("../MockNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(Object.assign({}, options, {networkInterface: "wlan0"}));

        this.connected = true;
        this.ssid = "NoCloud Wi-Fi";
    }

    /**
     * @returns {Promise<NoCloudWifiStatus>}
     */
    async getWifiStatus() {
        if (this.robot.config.get("embedded") === true) {
            return super.getWifiStatus();
        }

        const output = {
            state: this.connected ? NoCloudWifiStatus.STATE.CONNECTED : NoCloudWifiStatus.STATE.NOT_CONNECTED,
            details: {}
        };

        if (this.connected) {
            Object.assign(output.details, {
                signal: Math.floor(-20 - (70 * Math.random())),
                upspeed: 72.2,
                downspeed: 54,
                ips: ["192.168.100.100", "fe80::1ff:fe23:4567:890a", "fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff"],
                frequency: NoCloudWifiStatus.FREQUENCY_TYPE.W2_4Ghz,
                ssid: this.ssid
            });
        }

        return new NoCloudWifiStatus(output);
    }

    /**
     * @param {import("../../../entities/core/NoCloudWifiConfiguration")} wifiConfig
     * @returns {Promise<void>}
     */
    async setWifiConfiguration(wifiConfig) {
        this.ssid = wifiConfig.ssid;
        this.connected = false;
        setTimeout(() => {
            this.connected = true;
        }, 10 * 1000);
    }
}

module.exports = MockWifiConfigurationCapability;
