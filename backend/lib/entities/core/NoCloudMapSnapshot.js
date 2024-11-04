const SerializableEntity = require("../SerializableEntity");


// noinspection JSCheckFunctionSignatures
class NoCloudMapSnapshot extends SerializableEntity {
    /**
     *
     * @param {object} options
     * @param {string} options.id
     * @param {Date} [options.timestamp]
     * @param {import("../map/NoCloudMap")} [options.map]
     * @param {object} [options.metaData]
     * @class
     */
    constructor(options) {
        super(options);

        this.id = options.id;
        this.timestamp = options.timestamp;
        this.map = options.map;
    }
}

module.exports = NoCloudMapSnapshot;
