const LinuxWifiConfigurationCapability = require("../linuxCapabilities/LinuxWifiConfigurationCapability");
const NoCloudWifiConfiguration = require("../../../entities/core/NoCloudWifiConfiguration");
const NoCloudWifiStatus = require("../../../entities/core/NoCloudWifiStatus");

/**
 * @extends LinuxWifiConfigurationCapability<import("../../MiioNoCloudRobot")>
 */
class MiioWifiConfigurationCapability extends LinuxWifiConfigurationCapability {
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

        let res = await this.robot.sendCommand("miIO.info");

        if (typeof res === "object") {
            if (res.ap.bssid !== "") {
                output.state = NoCloudWifiStatus.STATE.CONNECTED;
                output.details.ips = [res.netif.localIp];
                output.details.ssid = res.ap.ssid;
                output.details.frequency = NoCloudWifiStatus.FREQUENCY_TYPE.W2_4Ghz;
                output.details.signal = res.ap.rssi;
            } else {
                output.state = NoCloudWifiStatus.STATE.NOT_CONNECTED;
            }
        }

        return new NoCloudWifiStatus(output);
    }

    /**
     * @param {import("../../../entities/core/NoCloudWifiConfiguration")} wifiConfig
     * @returns {Promise<void>}
     */
    async setWifiConfiguration(wifiConfig) {
        if (
            wifiConfig?.ssid !== undefined &&
            wifiConfig.credentials?.type === NoCloudWifiConfiguration.CREDENTIALS_TYPE.WPA2_PSK &&
            wifiConfig.credentials.typeSpecificSettings?.password !== undefined
        ) {
            if (
                !MiioWifiConfigurationCapability.IS_VALID_PARAMETER(wifiConfig.ssid) &&
                wifiConfig.metaData.force !== true
            ) {
                throw new Error(`Due to some broken firmwares, the SSID must not contain any of the following characters: ${INVALID_CHARACTERS.join(" ")}`);
            }

            if (
                !MiioWifiConfigurationCapability.IS_VALID_PARAMETER(wifiConfig.credentials.typeSpecificSettings.password) &&
                wifiConfig.metaData.force !== true
            ) {
                throw new Error(`Due to some broken firmwares, the Password must not contain any of the following characters: ${INVALID_CHARACTERS.join(" ")}`);
            }


            await this.robot.sendCommand(
                "miIO.config_router",
                {
                    "ssid": wifiConfig.ssid,
                    "passwd": wifiConfig.credentials.typeSpecificSettings.password,
                    "uid": 1337, // previously, this was 0, however unfortunately some firmwares of robots such as 0866 of roborock a38 validate it to be non-0
                    "cc": "de",
                    "country_domain": "de",
                    "config_type": "app"
                },
                {
                    interface: "local" //This command will only work when received on the local interface!
                }
            );
        } else {
            throw new Error("Invalid wifiConfig");
        }
    }
}

MiioWifiConfigurationCapability.IS_VALID_PARAMETER = (password) => {
    return !(
        new RegExp(
            `[${INVALID_CHARACTERS.join("")}]`
        ).test(password)
    );
};

const INVALID_CHARACTERS = [
    ";",
    "\\",
    "/",
    "#",
    "'",
    "\""
];

module.exports = MiioWifiConfigurationCapability;
