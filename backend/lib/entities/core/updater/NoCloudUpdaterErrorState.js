const NoCloudUpdaterState = require("./NoCloudUpdaterState");

class NoCloudUpdaterErrorState extends NoCloudUpdaterState {
    /**
     * The update process aborted with type, message at timestamp
     *
     * @param {object}  options
     * @param {import("../../../updater/lib/NoCloudUpdaterError").NoCloudUpdaterErrorType} options.type
     * @param {string}  options.message
     * @param {object} [options.metaData]
     * @class
     */
    constructor(options) {
        super(options);

        this.type = options.type;
        this.message = options.message;
    }
}


module.exports = NoCloudUpdaterErrorState;
