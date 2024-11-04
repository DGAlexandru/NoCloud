const SerializableEntity = require("../SerializableEntity");

class NoCloudDataPoint extends SerializableEntity {
    /**
     * @param {object} options
     * @param {object} [options.metaData]
     * @param {Date} [options.timestamp]
     * @param {NoCloudDataPointType} options.type
     * @param {number} options.value
     */
    constructor(options) {
        super(options);

        this.timestamp = options.timestamp ?? new Date();

        this.type = options.type;
        this.value = options.value;
    }
}

/**
 *
 * @typedef {string} NoCloudDataPointType
 * @enum {string}
 */
NoCloudDataPoint.TYPES = Object.freeze({
    COUNT: "count",
    TIME: "time", //in seconds
    AREA: "area" //in cm²
});

module.exports = NoCloudDataPoint;
