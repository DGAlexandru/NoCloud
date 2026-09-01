const CleanCarpetsFirstControlCapability = require("../../../core/capabilities/CleanCarpetsFirstControlCapability");
const DreameMiotServices = require("../DreameMiotServices");

/**
 * @extends CleanCarpetsFirstControlCapability<import("../DreameNoCloudRobot")>
 */
class DreameCleanCarpetsFirstControlCapability extends CleanCarpetsFirstControlCapability {

    /**
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.siid = DreameMiotServices["GEN2"].MOP_EXPANSION.SIID;
        this.piid = DreameMiotServices["GEN2"].MOP_EXPANSION.PROPERTIES.CLEAN_CARPETS_FIRST.PIID;
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

module.exports = DreameCleanCarpetsFirstControlCapability;
