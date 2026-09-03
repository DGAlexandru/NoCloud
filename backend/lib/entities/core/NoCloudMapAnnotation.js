const SerializableEntity = require("../SerializableEntity");


// noinspection JSUnusedGlobalSymbols
/**
 * @class NoCloudMapAnnotation
 * @property {NoCloudMapAnnotationType} type
 * @property {Array<{x: number, y: number}>} points
 */
class NoCloudMapAnnotation extends SerializableEntity {
    /**
     * @param {object} options
     * @param {NoCloudMapAnnotationType} options.type
     * @param {Array<{x: number, y: number}>} options.points
     * @param {object} [options.metaData]
     */
    constructor(options) {
        super(options);

        this.type = options.type;

        if (!Array.isArray(options.points) || options.points.length < 2) {
            throw new Error("Annotations require at least 2 points");
        }

        this.points = options.points;
    }
}

/**
 *  @typedef {string} NoCloudMapAnnotationType
 *  @enum {string}
 *
 */
NoCloudMapAnnotation.TYPE = Object.freeze({
    CURTAIN: "curtain",
    RAMP: "ramp",
    THRESHOLD: "threshold",
});

module.exports = NoCloudMapAnnotation;
