const SerializableEntity = require("../../SerializableEntity");


class NoCloudUpdaterState extends SerializableEntity {
    /**
     *
     * @param {object} options
     * @param {object} [options.metaData]
     * @class
     * @abstract
     */
    constructor(options) {
        super(options);

        this.timestamp = new Date();
        this.busy = false;
    }
}

module.exports = NoCloudUpdaterState;
