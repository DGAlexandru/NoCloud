const DreameMiotServices = require("../DreameMiotServices");
const DreameUtils = require("../DreameUtils");
const FanSpeedTurboControlCapability = require("../../../core/capabilities/FanSpeedTurboControlCapability");

/**
 * @extends FanSpeedTurboControlCapability<import("../DreameNoCloudRobot")>
 */
class DreameFanSpeedTurboControlCapability extends FanSpeedTurboControlCapability {

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
     * Checks if one-time fan speed turbo is active.
     * Evaluates to true only if SuctionMax is 1.
     *
     * @returns {Promise<boolean>}
     */
    async isEnabled() {
        const res = await this.robot.miotHelper.readProperty(this.siid, this.piid);
        const deserializedResponse = DreameUtils.DESERIALIZE_MISC_TUNABLES(res);

        return deserializedResponse.SuctionMax === 1;
    }

    /**
     * @returns {Promise<void>}
     */
    async enable() {
        await this.robot.miotHelper.writeProperty(
            this.siid,
            this.piid,
            DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE({
                SuctionMax: 1
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
                SuctionMax: 0
            })
        );
    }
}

module.exports = DreameFanSpeedTurboControlCapability;
