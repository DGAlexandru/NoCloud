const NoCloudRelease = require("./NoCloudRelease");
const NoCloudReleaseBinary = require("./NoCloudReleaseBinary");
const NoCloudUpdateProvider = require("./NoCloudUpdateProvider");
const {get} = require("../UpdaterUtils");

class GithubNoCloudUpdateProvider extends NoCloudUpdateProvider {

    /**
     * @return {Promise<Array<import("./NoCloudRelease")>>}
     */
    async fetchReleases() {
        const rawReleasesResponse = await get(GithubNoCloudUpdateProvider.RELEASES_URL);

        if (!Array.isArray(rawReleasesResponse?.data)) {
            throw new Error("GithubNoCloudUpdateProvider: Received invalid releases response");
        }

        return this.parseReleaseOverviewApiResponse(rawReleasesResponse.data);
    }

    /**
     * @param {import("./NoCloudRelease")} release
     * @return {Promise<Array<import("./NoCloudReleaseBinary")>>}
     */
    async fetchBinariesForRelease(release) {
        if (!release.metaData.githubReleaseUrl) {
            throw new Error("Missing Github Release URL in Release Metadata");
        }

        const rawReleaseResponse = await get(release.metaData.githubReleaseUrl);
        let releaseBinaries = [];




        // @ts-ignore
        if (!Array.isArray(rawReleaseResponse?.data?.assets)) {
            throw new Error("GithubNoCloudUpdateProvider: Received invalid release response");
        }

        // @ts-ignore
        let manifestAsset = rawReleaseResponse.data.assets.find(a => {
            return a.name === GithubNoCloudUpdateProvider.MANIFEST_NAME;
        });

        if (!manifestAsset) {
            throw new Error(`GithubNoCloudUpdateProvider: Missing ${GithubNoCloudUpdateProvider.MANIFEST_NAME}`);
        }

        const rawManifestResponse = await get(manifestAsset.browser_download_url);

        // @ts-ignore
        if (!rawManifestResponse.data || rawManifestResponse.data.version !== release.version) {
            throw new Error(`GithubNoCloudUpdateProvider: Invalid ${GithubNoCloudUpdateProvider.MANIFEST_NAME}`);
        }

        const manifest = rawManifestResponse.data;

        // @ts-ignore
        releaseBinaries = rawReleaseResponse.data.assets.filter(a => {
            return a.name !== GithubNoCloudUpdateProvider.MANIFEST_NAME;
        }).map(a => {
            return new NoCloudReleaseBinary({
                name: a.name,
                // @ts-ignore
                sha256sum: manifest.sha256sums[a.name] ?? "", //This will cause any install to fail but at least it's somewhat valid
                downloadUrl: a.browser_download_url
            });
        });

        return releaseBinaries;
    }

    /**
     * @param {object} data
     * @return {Array<import("./NoCloudRelease")>}
     */
    parseReleaseOverviewApiResponse(data) {
        const releases = data.filter(rR => {
            return rR.prerelease === false && rR.draft === false;
        }).map(rR => {
            return new NoCloudRelease({
                version: rR.tag_name,
                releaseTimestamp: new Date(rR.published_at),
                changelog: rR.body,
                metaData: {
                    githubReleaseUrl: rR.url
                }
            });
        });

        releases.sort((a, b) => {
            return b.releaseTimestamp.getTime() - a.releaseTimestamp.getTime();
        });

        return releases;
    }
}


GithubNoCloudUpdateProvider.TYPE = "github";

GithubNoCloudUpdateProvider.RELEASES_URL = "https://api.github.com/repos/DGAlexandru/NoCloud/releases";
GithubNoCloudUpdateProvider.MANIFEST_NAME = "NoCloud_release_manifest.json";


module.exports = GithubNoCloudUpdateProvider;
