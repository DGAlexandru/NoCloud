const NotImplementedError = require("../NotImplementedError");

/**
 * @template {import("../NoCloudRobot")} T
 */
class Capability {
    /**
     * @param {object} options
     * @param {T} options.robot
     */
    constructor(options) {
        this.type = this.getType();
        this.robot = options.robot;
    }

    /**
     * @abstract
     * @returns {string}
     */
    getType() {
        throw new NotImplementedError();
    }

    /**
     * This may contain capability-specific information, restrictions etc, which can't be handled
     * by splitting the problem into separate capabilities
     *
     * @returns {object}
     */
    getProperties() {
        return {};
    }
}

module.exports = Capability;
