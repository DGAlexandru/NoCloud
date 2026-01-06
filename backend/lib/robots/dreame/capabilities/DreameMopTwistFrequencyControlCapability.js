const DreameMiotHelper = require("../DreameMiotHelper");
const DreameMiotServices = require("../DreameMiotServices");
const DreameUtils = require("../DreameUtils");
const MopTwistFrequencyControlCapability = require("../../../core/capabilities/MopTwistFrequencyControlCapability");

/**
 * @extends MopTwistFrequencyControlCapability<import("../DreameNoCloudRobot")>
 */
class DreameMopTwistFrequencyControlCapability extends MopTwistFrequencyControlCapability {
    /**
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.siid = DreameMiotServices["GEN2"].VACUUM_2.SIID;
        this.piid = DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MISC_TUNABLES.PIID;

        this.helper = new DreameMiotHelper({robot: this.robot});
    }

    /**
     *
     * @returns {Promise<MopTwistFrequencyControlCapability.MOPTWIST>}
     */
    async getMopTwist() {
        const res = await this.helper.readProperty(this.siid, this.piid);
        const deserializedResponse = DreameUtils.DESERIALIZE_MISC_TUNABLES(res);
        // 1 => Each cleanup
        // 7 => Every 7 days -- !!! Applies only to full cleanups !!!
        // + negative variants of those that all mean disabled
        switch (deserializedResponse.MeticulousTwist) {
            case 7:
                return MopTwistFrequencyControlCapability.MOPTWIST.EVERY_7_DAYS;
            case 1:
                return MopTwistFrequencyControlCapability.MOPTWIST.EACH_CLEANUP;
            case -1:
            case -7:
                return MopTwistFrequencyControlCapability.MOPTWIST.OFF;
            default:
                throw new Error(`Received invalid value for MeticulousTwist: ${ deserializedResponse.MeticulousTwist }`);
        }
    }

    /**
     * @param {MopTwistFrequencyControlCapability.MOPTWIST} newMopTwist
     * @returns {Promise<void>}
     */
    async setMopTwist(newMopTwist) {
        let val;

        switch (newMopTwist) {
            case MopTwistFrequencyControlCapability.MOPTWIST.EVERY_7_DAYS:
                val = 7;
                break;
            case MopTwistFrequencyControlCapability.MOPTWIST.EACH_CLEANUP:
                val = 1;
                break;
            case MopTwistFrequencyControlCapability.MOPTWIST.OFF:
                val = -1; //Taking the easy way here: -1 instead of reading the current value and making it negative
                break;
            default:
                throw new Error(`Invalid value to be set for MeticulousTwist: ${ newMopTwist }`);
        }
        await this.helper.writeProperty(
            this.siid,
            this.piid,
            DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE({ MeticulousTwist: val })
        );
    }

    getProperties() {
        return {
            supportedMopTwists: [
                MopTwistFrequencyControlCapability.MOPTWIST.OFF,
                MopTwistFrequencyControlCapability.MOPTWIST.EACH_CLEANUP,
                MopTwistFrequencyControlCapability.MOPTWIST.EVERY_7_DAYS,
            ]
        };
    }
}

module.exports = DreameMopTwistFrequencyControlCapability;
