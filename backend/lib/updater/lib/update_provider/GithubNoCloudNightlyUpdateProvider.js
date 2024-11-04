const NoCloudRelease = require("./NoCloudRelease");
const NoCloudReleaseBinary = require("./NoCloudReleaseBinary");
const NoCloudUpdateProvider = require("./NoCloudUpdateProvider");
const {get} = require("../UpdaterUtils");

class GithubNoCloudNightlyUpdateProvider extends NoCloudUpdateProvider {

    /**
     * @return {Promise<Array<import("./NoCloudRelease")>>}
     */
    async fetchReleases() {
        let rawBranchResponse = await get(GithubNoCloudNightlyUpdateProvider.REPO_URL);

        if (
            !(
                rawBranchResponse?.data?.commit?.sha &&
                rawBranchResponse.data.commit.commit?.committer?.date &&
                rawBranchResponse.data.commit.commit.message
            )
        ) {
            throw new Error("GithubNoCloudNightlyUpdateProvider: Received invalid branch response");
        }

        let changelog = rawBranchResponse.data.commit.commit.message;
        let manifest;

        try {
            manifest = await this.fetchManifest();

            if (typeof manifest?.changelog === "string") {
                changelog = manifest.changelog;
            }
        } catch (e) {
            // intentional
        }

        return [
            new NoCloudRelease({
                version: rawBranchResponse.data.commit.sha,
                releaseTimestamp: new Date(rawBranchResponse.data.commit.commit.committer.date),
                changelog: changelog,
            })
        ];
    }

    /**
     * @param {import("./NoCloudRelease")} release
     * @return {Promise<Array<import("./NoCloudReleaseBinary")>>}
     */
    async fetchBinariesForRelease(release) {
        const manifest = await this.fetchManifest();

        // @ts-ignore
        return Object.keys(manifest.sha256sums).map(name => {
            return new NoCloudReleaseBinary({
                name: name,
                // @ts-ignore
                sha256sum: manifest.sha256sums[name] ?? "", //This will cause any install to fail but at least it's somewhat valid
                downloadUrl: `${GithubNoCloudNightlyUpdateProvider.ASSET_BASE_URL}${GithubNoCloudNightlyUpdateProvider.BINARY_NAMES[name]}`
            });
        });
    }


    /**
     * @private
     * @return {Promise<any>}
     */
    async fetchManifest() {
        let rawManifestResponse = await get(`${GithubNoCloudNightlyUpdateProvider.ASSET_BASE_URL}${GithubNoCloudNightlyUpdateProvider.MANIFEST_NAME}`);

        // @ts-ignore
        if (!rawManifestResponse.data) {
            throw new Error(`GithubNoCloudNightlyUpdateProvider: Invalid ${GithubNoCloudNightlyUpdateProvider.MANIFEST_NAME}`);
        }

        return rawManifestResponse.data;
    }
}


GithubNoCloudNightlyUpdateProvider.TYPE = "github_nightly";

GithubNoCloudNightlyUpdateProvider.REPO_URL = "https://api.github.com/repos/UnKn0wn/NoCloud-nightly-builds/branches/master";
GithubNoCloudNightlyUpdateProvider.ASSET_BASE_URL = "https://raw.githubusercontent.com/UnKn0wn/NoCloud-nightly-builds/master/";
GithubNoCloudNightlyUpdateProvider.MANIFEST_NAME = "NoCloud_release_manifest.json";

GithubNoCloudNightlyUpdateProvider.BINARY_NAMES = {
    "NoCloud-armv7": "armv7/NoCloud",
    "NoCloud-armv7-lowmem": "armv7/NoCloud-lowmem",
    "NoCloud-aarch64": "aarch64/NoCloud",

    "NoCloud-armv7.upx": "armv7/NoCloud.upx",
    "NoCloud-armv7-lowmem.upx": "armv7/NoCloud-lowmem.upx",
    "NoCloud-aarch64.upx": "aarch64/NoCloud.upx",
};


module.exports = GithubNoCloudNightlyUpdateProvider;
