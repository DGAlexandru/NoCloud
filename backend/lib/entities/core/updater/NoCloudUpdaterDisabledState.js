const NoCloudUpdaterState = require("./NoCloudUpdaterState");

class NoCloudUpdaterDisabledState extends NoCloudUpdaterState {
    /**
     *
     * @param {object} options
     * @param {object} [options.metaData]
     * @class
     */
    constructor(options) {
        super(options);
    }
}

module.exports = NoCloudUpdaterDisabledState;
