const DreameMiotServices = require("../DreameMiotServices");
const MopTightPatternControlCapability = require("../../../core/capabilities/MopTightPatternControlCapability");
/**
 * @extends MopTightPatternControlCapability<import("../DreameNoCloudRobot")>
 */
class DreameMopTightPatternControlCapability extends MopTightPatternControlCapability {

    /**
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.siid = DreameMiotServices["GEN2"].VACUUM_2.SIID;
        this.piid = DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.TIGHT_MOP_PATTERN.PIID;
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    async isEnabled() {
        const res = await this.robot.miotHelper.readProperty(this.siid, this.piid);

        return res === 1;
    }

    /**
     * @returns {Promise<void>}
     */
    async enable() {
        await this.robot.miotHelper.writeProperty(
            this.siid,
            this.piid,
            1
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async disable() {
        await this.robot.miotHelper.writeProperty(
            this.siid,
            this.piid,
            0
        );
    }
}

module.exports = DreameMopTightPatternControlCapability;
