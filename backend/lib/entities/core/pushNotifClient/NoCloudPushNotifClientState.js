const SerializableEntity = require("../../SerializableEntity");


class NoCloudPushNotifClientState extends SerializableEntity {
    /**
     * Base class for PushNotifClient States
     * @param {object} options
     * @class
     * @abstract
     */
    constructor(options) {
        super(options);

        this.timestamp = new Date();
    }
}

module.exports = NoCloudPushNotifClientState;
