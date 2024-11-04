const NotImplementedError = require("../../../core/NotImplementedError");

class NoCloudUpdateProvider {
    constructor() {
        //intentional
    }

    /**
     * @abstract
     * @return {Promise<Array<import("./NoCloudRelease")>>} These have to be sorted by release date. Element 0 should be the most recent one
     */
    async fetchReleases() {
        throw new NotImplementedError();
    }

    /**
     * @abstract
     * @param {import("./NoCloudRelease")} release
     * @return {Promise<Array<import("./NoCloudReleaseBinary")>>}
     */
    async fetchBinariesForRelease(release) {
        throw new NotImplementedError();
    }
}

module.exports = NoCloudUpdateProvider;
