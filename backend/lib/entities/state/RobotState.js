const ContainerEntity = require("../ContainerEntity");

/**
 * This represents the state of a robot
 *
 * The Robots state is mostly defined through its attributes.
 * Attributes can be added/updated or removed.
 */
class RobotState extends ContainerEntity {
    /**
     *
     * @param {object} options
     * @param {import("../map/NoCloudMap")} options.map
     * @param {Array<import("./attributes/StateAttribute")>} [options.attributes]
     * @param {object} [options.metaData]
     */
    constructor(options) {
        super(options);

        this.map = options.map;

        this.metaData.version = 1;
    }

    toJSON() {
        const json = super.toJSON();
        json.map = this.map;

        return json;
    }
}

module.exports = RobotState;
