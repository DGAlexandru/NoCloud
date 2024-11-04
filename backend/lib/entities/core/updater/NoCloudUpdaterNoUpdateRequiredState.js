const NoCloudUpdaterState = require("./NoCloudUpdaterState");

class NoCloudUpdaterNoUpdateRequiredState extends NoCloudUpdaterState {
    /**
     *
     * @param {object} options
     * @param {object} [options.metaData]
     *
     * @param {string} options.currentVersion The currently running NoCloud version
     * @param {string} [options.changelog] Github flavoured Markdown
     * @class
     */
    constructor(options) {
        super(options);

        this.currentVersion = options.currentVersion;
        this.changelog = options.changelog;
    }
}

module.exports = NoCloudUpdaterNoUpdateRequiredState;
