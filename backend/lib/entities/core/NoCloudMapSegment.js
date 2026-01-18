const SerializableEntity = require("../SerializableEntity");

// noinspection JSCheckFunctionSignatures
class NoCloudMapSegment extends SerializableEntity {
    /**
     *
     * @param {object} options
     * @param {string} options.id
     * @param {string} [options.name]
     * @param {object} [options.metaData]
     * @param {import("../map/MapLayer").MapLayerMaterial} [options.material]
     */
    constructor(options) {
        super(options);

        this.id = options.id;
        this.name = options.name;
        this.material = options.material;
    }
}

module.exports = NoCloudMapSegment;
