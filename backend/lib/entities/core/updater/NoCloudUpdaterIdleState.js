const NoCloudUpdaterState = require("./NoCloudUpdaterState");

class NoCloudUpdaterIdleState extends NoCloudUpdaterState {
    /**
     *
     * @param {object} options
     * @param {object} [options.metaData]
     *
     * @param {string} options.currentVersion The currently running NoCloud version
     * @class
     */
    constructor(options) {
        super(options);

        this.currentVersion = options.currentVersion;
    }
}

module.exports = NoCloudUpdaterIdleState;
