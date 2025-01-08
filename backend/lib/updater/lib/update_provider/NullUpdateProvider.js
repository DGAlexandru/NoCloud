const NoCloudUpdateProvider = require("./NoCloudUpdateProvider");

class NullUpdateProvider extends NoCloudUpdateProvider {
    /**
     * @return {Promise<Array<import("./NoCloudRelease")>>}
     */
    async fetchReleases() {
        return [];
    }

    /**
     * @param {import("./NoCloudRelease")} release
     * @return {Promise<Array<import("./NoCloudReleaseBinary")>>}
     */
    async fetchBinariesForRelease(release) {
        return [];
    }
}

module.exports = NullUpdateProvider;
