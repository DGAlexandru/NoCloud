const NoCloudPushNotifClientState = require("./NoCloudPushNotifClientState");

class NoCloudPushNotifClientEnabledState extends NoCloudPushNotifClientState {
    /**
     * PushNotifClient is enabled but there hasn't been an attempt to send a message
     *
     * @param {object} options
     * @class
     */
    constructor(options) {
        super(options);
    }
}

module.exports = NoCloudPushNotifClientEnabledState;
