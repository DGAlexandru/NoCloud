const NoCloudPushNotifClientState = require("./NoCloudPushNotifClientState");

class NoCloudPushNotifClientErrorState extends NoCloudPushNotifClientState {
    /**
     * The PushNotif sync aborted with type, message at timestamp
     * 
     * @param {object}  options
     * @param {NoCloudPushNotifClientErrorType} options.type
     * @param {string}  options.message
     * @class
     */
    constructor(options) {
        super(options);

        this.type = options.type;
        this.message = options.message;
    }
}

/**
 *  @typedef {string} NoCloudPushNotifClientErrorType
 *  @enum {string}
 *
 */
NoCloudPushNotifClientErrorState.ERROR_TYPE = Object.freeze({
    UNKNOWN: "unknown",
    TRANSIENT: "transient",
    NAME_RESOLUTION: "name_resolution",
    CONNECTION: "connection",
    PERSISTING: "persisting"
});

module.exports = NoCloudPushNotifClientErrorState;
