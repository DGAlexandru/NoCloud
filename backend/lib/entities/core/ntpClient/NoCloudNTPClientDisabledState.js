const NoCloudNTPClientState = require("./NoCloudNTPClientState");

class NoCloudNTPClientDisabledState extends NoCloudNTPClientState {
    /**
     * The NTP Client is disabled
     * 
     * @param {object} options
     * @param {object} [options.metaData]
     * @class
     */
    constructor(options) {
        super(options);
    }
}

module.exports = NoCloudNTPClientDisabledState;
