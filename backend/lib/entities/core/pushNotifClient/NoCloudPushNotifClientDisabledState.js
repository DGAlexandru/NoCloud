const NoCloudPushNotifClientState = require("./NoCloudPushNotifClientState");

class NoCloudPushNotifClientDisabledState extends NoCloudPushNotifClientState {
    /**
     * PushNotifClient in disabled state
     *
     * @param {object} options
     * @class
     */
    constructor(options) {
        super(options);
    }
}

module.exports = NoCloudPushNotifClientDisabledState;
