const NoCloudVoicePackOperationStatus = require("../../../entities/core/NoCloudVoicePackOperationStatus");
const VoicePackManagementCapability = require("../../../core/capabilities/VoicePackManagementCapability");

/**
 * @extends VoicePackManagementCapability<import("../ViomiNoCloudRobot")>
 */
class ViomiVoicePackManagementCapability extends VoicePackManagementCapability {
    /**
     * Returns the current applied voice pack language.
     *
     * @abstract
     * @returns {Promise<string>}
     */
    async getCurrentVoiceLanguage() {
        const res = await this.robot.sendCommand("get_downloadstatus", []);
        // @ts-ignore
        // noinspection JSUnresolvedVariable
        return res.curVoice;
    }

    /**
     * This method should instruct the vacuum to download a voice pack from `presignedUrl`.
     * The actual specifications of what exactly is hosted behind presignedUrl depend on the specific vacuum model.
     * The same goes for the hash, the user should provide a hash or signature as expected by the vacuum.
     *
     * @param {object} options
     * @param {string} options.url
     * @param {string} [options.language]
     * @param {string} [options.hash]
     * @returns {Promise<void>}
     */
    async downloadVoicePack(options) {
        let args = ["it", options.url, "e981750c29a9ac5fc46f228585fb99b2"];
        if (options.language) {
            args[0] = options.language;
        }
        if (options.hash) {
            args[2] = options.hash;
        }

        await this.robot.sendCommand("download_voice", args);
    }

    /**
     * This method should return the status of the current voice pack operation, if one is ongoing.
     *
     * @returns {Promise<NoCloudVoicePackOperationStatus>}
     */
    async getVoicePackOperationStatus() {
        let statusOptions = {
            type: NoCloudVoicePackOperationStatus.TYPE.IDLE,
            progress: undefined,
        };
        const res = await this.robot.sendCommand("get_downloadstatus", []);

        // noinspection JSUnresolvedVariable
        if (res.targetVoice !== "") {
            // noinspection JSUnresolvedVariable
            if (res.progress === 100 || res.targetVoice === "en" || res.targetVoice === "zh") {
                // en and zh are built-in and won't be downloaded, even if a URL is provided.
                statusOptions.type = NoCloudVoicePackOperationStatus.TYPE.INSTALLING;
            } else {
                statusOptions.type = NoCloudVoicePackOperationStatus.TYPE.DOWNLOADING;
            }
            // noinspection JSUnresolvedVariable
            statusOptions.progress = res.progress;
        }

        // noinspection JSUnresolvedVariable
        return new NoCloudVoicePackOperationStatus(statusOptions);
    }
}

module.exports = ViomiVoicePackManagementCapability;
