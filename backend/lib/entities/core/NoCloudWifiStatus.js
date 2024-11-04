const SerializableEntity = require("../SerializableEntity");

/*
    Further expansion could include the Wi-Fi channel used
 */

class NoCloudWifiStatus extends SerializableEntity {
    /**
     * @param {object} options
     * @param {NoCloudWifiState} options.state
     * @param {object} options.details
     * @param {string} [options.details.ssid]
     * @param {string} [options.details.bssid]
     * @param {number} [options.details.downspeed] unit: mbps
     * @param {number} [options.details.upspeed] unit: mbps
     * @param {number} [options.details.signal] unit: dBm
     * @param {Array<string>} [options.details.ips] all the ips that we can find
     * @param {NoCloudWifiStatusFrequencyType} [options.details.frequency]
     * @param {object} [options.metaData]
     *
     * @class
     */
    constructor(options) {
        super(options);

        this.state = options.state;
        this.details = options.details;
    }
}

/**
 *  @typedef {string} NoCloudWifiStatusFrequencyType
 *  @enum {string}
 *
 */
NoCloudWifiStatus.FREQUENCY_TYPE = Object.freeze({
    W2_4Ghz: "2.4ghz", //Cannot start with a number. Therefore, prefixed with w
    W5Ghz: "5ghz"
});

/**
 *  @typedef {string} NoCloudWifiState
 *  @enum {string}
 *
 */
NoCloudWifiStatus.STATE = Object.freeze({
    CONNECTED: "connected",
    NOT_CONNECTED: "not_connected",
    UNKNOWN: "unknown"
});


module.exports = NoCloudWifiStatus;
