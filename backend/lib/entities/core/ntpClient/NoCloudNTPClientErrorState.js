const NoCloudNTPClientState = require("./NoCloudNTPClientState");

class NoCloudNTPClientErrorState extends NoCloudNTPClientState {
    /**
     * The NTP sync aborted with type, message at timestamp
     * 
     * @param {object}  options
     * @param {NoCloudNTPClientErrorType} options.type
     * @param {string}  options.message
     * @param {object} [options.metaData]
     * @class
     */
    constructor(options) {
        super(options);

        this.type = options.type;
        this.message = options.message;
    }
}

/**
 *  @typedef {string} NoCloudNTPClientErrorType
 *  @enum {string}
 *
 */
NoCloudNTPClientErrorState.ERROR_TYPE = Object.freeze({
    UNKNOWN: "unknown",
    TRANSIENT: "transient",
    NAME_RESOLUTION: "name_resolution",
    CONNECTION: "connection",
    PERSISTING: "persisting"
});

module.exports = NoCloudNTPClientErrorState;
