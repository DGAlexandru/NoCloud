const NotImplementedError = require("../../../core/NotImplementedError");
const Tools = require("../../../utils/Tools");

class NoCloudUpdateProvider {
    constructor() {
        //intentional
    }

    /**
     * This allows checking for updates based on either the NoCloud version, the commit id or something else entirely
     * @return {string}
     */
    getCurrentVersion() {
        return Tools.GET_NoCloud_VERSION();
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
