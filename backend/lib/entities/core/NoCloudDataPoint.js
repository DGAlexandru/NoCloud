const SerializableEntity = require("../SerializableEntity");

class NoCloudDataPoint extends SerializableEntity {
    /**
     * @param {object} options
     * @param {object} [options.metaData]
     * @param {string|Date} [options.timestamp] // Accepts string or Date
     * @param {NoCloudDataPointType} options.type
     * @param {number} options.value
     */
    constructor(options) {
        super(options);

        // Ensure timestamp is stored as a string in ISO8601 format
        if (typeof options.timestamp === "string") {
            this.timestamp = options.timestamp;
        } else if (options.timestamp instanceof Date) {
            this.timestamp = options.timestamp.toISOString();
        } else {
            this.timestamp = new Date().toISOString();
        }

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
