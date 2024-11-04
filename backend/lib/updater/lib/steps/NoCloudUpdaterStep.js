const NoCloudUpdaterError = require("../NoCloudUpdaterError");
const NoCloudUpdaterState = require("../../../entities/core/updater/NoCloudUpdaterState");

class NoCloudUpdaterStep {
    /**
     * @abstract
     * 
     * @returns {Promise<NoCloudUpdaterState>}
     * @throws {NoCloudUpdaterError}
     */
    async execute() {
        throw new NoCloudUpdaterError(
            NoCloudUpdaterError.ERROR_TYPE.UNKNOWN,
            "Empty NoCloudUpdaterStep implementation"
        );
    }
}

module.exports = NoCloudUpdaterStep;
