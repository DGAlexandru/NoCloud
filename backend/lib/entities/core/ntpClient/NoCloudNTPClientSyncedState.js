const NoCloudNTPClientState = require("./NoCloudNTPClientState");

class NoCloudNTPClientSyncedState extends NoCloudNTPClientState {
    /**
     * The NTP sync has been successful at timestamp with offset from previous vacuum time
     * 
     * @param {object}  options
     * @param {number}  options.offset
     * @param {object} [options.metaData]
     * @class
     */
    constructor(options) {
        super(options);

        this.offset = options.offset;
    }
}

module.exports = NoCloudNTPClientSyncedState;
