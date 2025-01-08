const fs = require("fs");
const GithubNoCloudNightlyUpdateProvider = require("./lib/update_provider/GithubNoCloudNightlyUpdateProvider");
const GithubNoCloudUpdateProvider = require("./lib/update_provider/GithubNoCloudUpdateProvider");
const Logger = require("../Logger");
const NullUpdateProvider = require("./lib/update_provider/NullUpdateProvider");
const States = require("../entities/core/updater");
const Steps = require("./lib/steps");


class Updater {
    /**
     * @param {object} options
     * @param {import("../Configuration")} options.config
     * @param {import("../core/NoCloudRobot")} options.robot
     */
    constructor(options) {
        this.config = options.config;
        this.robot = options.robot;

        /** @type {import("../entities/core/updater/NoCloudUpdaterState")} */
        this.state = undefined;
        /** @type {import("./lib/update_provider/NoCloudUpdateProvider")} */
        this.updateProvider = undefined;

        this.config.onUpdate((key) => {
            if (key === "updater") {
                this.reconfigure();
            }
        });

        this.cleanupHandler = () => {};
        this.pendingCleanupTimeout = undefined;

        this.reconfigure();
    }

    /**
     * @private
     */
    reconfigure() {
        const updaterConfig = this.config.get("updater");

        clearTimeout(this.pendingCleanupTimeout);
        this.cleanupHandler();

        switch (updaterConfig.updateProvider.type) {
            case GithubNoCloudUpdateProvider.TYPE:
                this.updateProvider = new GithubNoCloudUpdateProvider();
                break;
            case GithubNoCloudNightlyUpdateProvider.TYPE:
                this.updateProvider = new GithubNoCloudNightlyUpdateProvider();
                break;
            default:
                Logger.error(`Invalid UpdateProvider ${updaterConfig.updateProvider.type}`);
                this.updateProvider = new NullUpdateProvider();
        }

        if (updaterConfig.enabled === true) {
            this.state = new States.NoCloudUpdaterIdleState({
                currentVersion: this.updateProvider.getCurrentVersion()
            });
        } else {
            this.state = new States.NoCloudUpdaterDisabledState({});
        }
    }

    /**
     * As everything regarding networking might take a long time, we just accept this request
     * and then asynchronously process it.
     * Updates are reported via the updaters state
     *
     * @return {void}
     */
    triggerCheck() {
        if (
            !(
                this.state instanceof States.NoCloudUpdaterIdleState ||
                this.state instanceof States.NoCloudUpdaterErrorState ||
                this.state instanceof States.NoCloudUpdaterNoUpdateRequiredState
            )
        ) {
            throw new Error("Updates can only be started when the updaters state is idle or error");
        }


        this.state.busy = true;

        const step = new Steps.NoCloudUpdaterCheckStep({
            embedded: this.config.get("embedded"),
            architectures: Updater.ARCHITECTURES,
            spaceRequired: Updater.SPACE_REQUIREMENTS,
            robot: this.robot,
            updateProvider: this.updateProvider
        });

        step.execute().then((state) => {
            this.state = state;
        }).catch(err => {
            this.state = new States.NoCloudUpdaterErrorState({
                type: err.type,
                message: err.message
            });
        });
    }

    /**
     * @return {void}
     */
    triggerDownload() {
        if (!(this.state instanceof States.NoCloudUpdaterApprovalPendingState)) {
            throw new Error("Downloads can only be started when there's pending approval");
        }
        const downloadPath = this.state.downloadPath;
        this.state.busy = true;

        const step = new Steps.NoCloudUpdaterDownloadStep({
            downloadUrl: this.state.downloadUrl,
            downloadPath: this.state.downloadPath,
            expectedHash: this.state.expectedHash,
            version: this.state.version,
            releaseTimestamp: this.state.releaseTimestamp
        });

        const state = new States.NoCloudUpdaterDownloadingState({
            downloadUrl: this.state.downloadUrl,
            downloadPath: this.state.downloadPath,
            expectedHash: this.state.expectedHash,
            version: this.state.version,
            releaseTimestamp: this.state.releaseTimestamp
        });
        this.state = state;
        this.state.busy = true;

        step.onProgressUpdate = (progressPercent) => {
            state.metaData.progress = progressPercent;
        };

        step.execute().then((state) => {
            this.state = state;

            this.cleanupHandler = () => {
                fs.unlinkSync(downloadPath);

                this.state = new States.NoCloudUpdaterIdleState({
                    currentVersion: this.updateProvider.getCurrentVersion()
                });

                this.cleanupHandler = () => {};
            };

            this.pendingCleanupTimeout = setTimeout(() => {
                Logger.warn("Updater: User confirmation timeout.");

                this.cleanupHandler();
            }, 10 * 60 * 1000); // 10 minutes
        }).catch(err => {
            this.state = new States.NoCloudUpdaterErrorState({
                type: err.type,
                message: err.message
            });
        });
    }

    /**
     * @return {void}
     */
    triggerApply() {
        if (!(this.state instanceof States.NoCloudUpdaterApplyPendingState)) {
            throw new Error("Can only apply if there's finalization pending");
        }

        this.state.busy = true;

        const step = new Steps.NoCloudUpdaterApplyStep({
            downloadPath: this.state.downloadPath
        });

        step.execute().catch(err => { //no .then() required as the system will reboot
            this.state = new States.NoCloudUpdaterErrorState({
                type: err.type,
                message: err.message
            });
        });
    }
}

Updater.SPACE_REQUIREMENTS = 40 * 1024 * 1024;
Updater.ARCHITECTURES = {
    "arm": "armv7",
    "arm64": "aarch64"
};

module.exports = Updater;
