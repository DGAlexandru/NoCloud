const SpeakerTestCapability = require("../../../core/capabilities/SpeakerTestCapability");

/**
 * @extends SpeakerTestCapability<import("../RoborockNoCloudRobot")>
 */
class RoborockSpeakerTestCapability extends SpeakerTestCapability {
    /**
     * @returns {Promise<void>}
     */
    async playTestSound() {
        await this.robot.sendCommand("test_sound_volume", [], {});
    }
}

module.exports = RoborockSpeakerTestCapability;
