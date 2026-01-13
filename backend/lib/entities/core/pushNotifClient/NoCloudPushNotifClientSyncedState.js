const NoCloudPushNotifClientState = require("./NoCloudPushNotifClientState");

class NoCloudPushNotifClientSyncedState extends NoCloudPushNotifClientState {
    /**
     * PushNotifClient successfuly connected and sent a message
     * 
     * @param {object}  options
     * @param {string} options.lastMessage
     * @param {string | null} options.lastTitle
     * @param {number} options.lastPriority
     * @class
     */
    constructor(options) {
        super(options);

        this.lastMessage = options.lastMessage;
        this.lastTitle = options.lastTitle ?? null;
        this.lastPriority = options.lastPriority;
    }
}

module.exports = NoCloudPushNotifClientSyncedState;
