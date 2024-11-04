const SerializableEntity = require("../SerializableEntity");


class NoCloudWifiConfiguration extends SerializableEntity {
    /**
     * @param {object} options
     * @param {string} options.ssid
     * @param {object} options.credentials
     * @param {NoCloudWifiConfigurationCredentialsType} options.credentials.type
     * @param {object} options.credentials.typeSpecificSettings //e.g. key or user/password
     * @param {object} [options.metaData]
     *
     * @class
     */
    constructor(options) {
        super(options);

        this.ssid = options.ssid;
        this.credentials = options.credentials;
    }
}

/**
 *  @typedef {string} NoCloudWifiConfigurationCredentialsType
 *  @enum {string}
 *
 */
NoCloudWifiConfiguration.CREDENTIALS_TYPE = Object.freeze({
    WPA2_PSK: "wpa2_psk"
});

module.exports = NoCloudWifiConfiguration;
