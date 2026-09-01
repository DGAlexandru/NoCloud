const SpeakerTestCapability = require("../../../core/capabilities/SpeakerTestCapability");

/**
 * @extends SpeakerTestCapability<import("../DreameNoCloudRobot")>
 */
class DreameSpeakerTestCapability extends SpeakerTestCapability {

    /**
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     *
     * @param {number} options.siid MIOT Service ID
     * @param {number} options.aiid MIOT Action ID
     */
    constructor(options) {
        super(options);

        this.siid = options.siid;
        this.aiid = options.aiid;
    }

    /**
     * @returns {Promise<void>}
     */
    async playTestSound() {
        await this.robot.miotHelper.executeAction(this.siid, this.aiid);
    }

}

module.exports = DreameSpeakerTestCapability;
