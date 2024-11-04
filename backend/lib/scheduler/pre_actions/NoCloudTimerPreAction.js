const NotImplementedError = require("../../core/NotImplementedError");


class NoCloudTimerPreAction {
    /**
     * @abstract
     * @param {object} options
     * @param {import("../../core/NoCloudRobot")} options.robot
     */
    constructor(options) {
        this.robot = options.robot;
    }

    /**
     * @returns {Promise<void>}
     */
    async run() {
        throw new NotImplementedError();
    }
}

module.exports = NoCloudTimerPreAction;
