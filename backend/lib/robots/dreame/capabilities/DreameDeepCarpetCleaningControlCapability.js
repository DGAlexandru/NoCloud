const DeepCarpetCleaningControlCapability = require("../../../core/capabilities/DeepCarpetCleaningControlCapability");
const DreameMiotServices = require("../DreameMiotServices");
const DreameUtils = require("../DreameUtils");

/**
 * @extends DeepCarpetCleaningControlCapability<import("../DreameNoCloudRobot")>
 */
class DreameDeepCarpetCleaningControlCapability extends DeepCarpetCleaningControlCapability {

    /**
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.siid = DreameMiotServices["GEN2"].VACUUM_2.SIID;
        this.piid = DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MISC_TUNABLES.PIID;
    }

    /**
     * Checks if deep carpet cleaning is enabled.
     * Evaluates to true only if CarpetFineClean is 1.
     * Both 0 and -1 naturally return false (Off/Disabled).
     *
     * @returns {Promise<boolean>}
     */
    async isEnabled() {
        const res = await this.robot.miotHelper.readProperty(this.siid, this.piid);
        const deserializedResponse = DreameUtils.DESERIALIZE_MISC_TUNABLES(res);

        return deserializedResponse.CarpetFineClean === 1;
    }

    /**
     * @returns {Promise<void>}
     */
    async enable() {
        await this.robot.miotHelper.writeProperty(
            this.siid,
            this.piid,
            DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE({
                CarpetFineClean: 1
            })
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async disable() {
        await this.robot.miotHelper.writeProperty(
            this.siid,
            this.piid,
            DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE({
                CarpetFineClean: 0
            })
        );
    }
}

module.exports = DreameDeepCarpetCleaningControlCapability;
