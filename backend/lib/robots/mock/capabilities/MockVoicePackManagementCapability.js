const NoCloudVoicePackOperationStatus = require("../../../entities/core/NoCloudVoicePackOperationStatus");
const VoicePackManagementCapability = require("../../../core/capabilities/VoicePackManagementCapability");

/**
 * @extends VoicePackManagementCapability<import("../MockNoCloudRobot")>
 */
class MockVoicePackManagementCapability extends VoicePackManagementCapability {
    /**
     * @param {object} options
     * @param {import("../MockNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.current_language = "EN";
        this.status = NoCloudVoicePackOperationStatus.TYPE.IDLE;
        this.progress = undefined;
    }

    async getCurrentVoiceLanguage() {
        return this.current_language;
    }

    async downloadVoicePack(options) {
        this.status = NoCloudVoicePackOperationStatus.TYPE.DOWNLOADING;
        this.progress = 0;

        // Simulate download
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.progress += 20;
            }, i * 1000);
        }

        setTimeout(() => {
            this.status = NoCloudVoicePackOperationStatus.TYPE.INSTALLING;
            this.progress = 0;
        }, 6000);

        // Simulate installing
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.progress += 20;
            }, 7000 + i * 1000);
        }

        setTimeout(() => {
            this.status = NoCloudVoicePackOperationStatus.TYPE.IDLE;
            this.current_language = options.language;
        }, 13000);
    }

    async getVoicePackOperationStatus() {
        let statusOptions = {
            type: this.status,
            progress: this.progress,
        };

        return new NoCloudVoicePackOperationStatus(statusOptions);
    }
}

module.exports = MockVoicePackManagementCapability;
