const SerializableEntity = require("../SerializableEntity");

class NoCloudConsumable extends SerializableEntity {
    /**
     * @param {object} options
     * @param {NoCloudConsumableType} options.type
     * @param {NoCloudConsumableSubType} [options.subType]
     * @param {object} [options.metaData]
     * @param {object} options.remaining
     * @param {number} options.remaining.value
     * @param {NoCloudConsumableRemainingUnit} options.remaining.unit
     */
    constructor(options) {
        super(options);

        this.type = options.type;
        this.subType = options.subType ?? NoCloudConsumable.SUB_TYPE.NONE;

        this.remaining = options.remaining;
    }
}

/**
 *  @typedef {string} NoCloudConsumableType
 *  @enum {string}
 *
 */
NoCloudConsumable.TYPE = Object.freeze({
    FILTER: "filter",
    BRUSH: "brush",
    MOP: "mop",
    DETERGENT: "detergent",
    BIN: "bin",
    CLEANING: "cleaning"
});

/**
 *  @typedef {string} NoCloudConsumableSubType
 *  @enum {string}
 *
 */
NoCloudConsumable.SUB_TYPE = Object.freeze({
    NONE: "none",
    ALL: "all",
    MAIN: "main",
    SECONDARY: "secondary",
    SIDE_LEFT: "side_left",
    SIDE_RIGHT: "side_right",
    DOCK: "dock",
    SENSOR: "sensor",
    WHEEL: "wheel"
});

/**
 *
 * @typedef {string} NoCloudConsumableRemainingUnit
 * @enum {string}
 */
NoCloudConsumable.UNITS = Object.freeze({
    MINUTES: "minutes",
    PERCENT: "percent"
});


module.exports = NoCloudConsumable;
