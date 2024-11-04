const NoCloudNTPClientState = require("./NoCloudNTPClientState");

class NoCloudNTPClientEnabledState extends NoCloudNTPClientState {
    /**
     * The NTP Client is enabled but there hasn't been an attempt to sync yet
     * 
     * @param {object} options
     * @param {object} [options.metaData]
     * @class
     */
    constructor(options) {
        super(options);
    }
}

module.exports = NoCloudNTPClientEnabledState;
