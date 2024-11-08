const NoCloudWifiNetwork = require("../../../entities/core/NoCloudWifiNetwork");
const WifiScanCapability = require("../../../core/capabilities/WifiScanCapability");

function getRandomRSSI() {
    return (Math.round(Math.random() * 100) + 10) * -1;
}

/**
 * @extends WifiScanCapability<import("../MockRobot")>
 */
class MockWifiScanCapability extends WifiScanCapability {
    async scan() {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, Math.round(Math.random() * 3000));
        });

        if (Math.random() > 0.78) {
            return [];
        }

        return [
            new NoCloudWifiNetwork({
                bssid: "23:CF:D7:E0:54:5E",
                details: {
                    ssid: "SingleAP",
                    signal: getRandomRSSI()
                }
            }),
            new NoCloudWifiNetwork({
                bssid: "2A:C4:FB:F5:EF:40",
                details: {
                    ssid: "MultiAP",
                    signal: getRandomRSSI()
                }
            }),
            new NoCloudWifiNetwork({
                bssid: "AA:A2:21:E8:38:B6",
                details: {
                    ssid: "MultiAP",
                    signal: getRandomRSSI()
                }
            }),
            new NoCloudWifiNetwork({
                bssid: "72:87:8F:9D:F1:66",
                details: {
                    ssid: "ThirtyTwo_CharacterSSID_SendHelp",
                    signal: getRandomRSSI()
                }
            }),
            new NoCloudWifiNetwork({
                bssid: "66:C6:C5:7D:96:88",
                details: {
                    ssid: "NoSignal",
                }
            }),
            new NoCloudWifiNetwork({
                bssid: "AE:02:EE:A8:00:7A",
                details: {
                    //no ssid
                    signal: getRandomRSSI()
                }
            }),
            new NoCloudWifiNetwork({
                bssid: "24:77:AF:A3:BF:96",
                details: {
                    //no details
                }
            }),
        ];
    }
}

module.exports = MockWifiScanCapability;
