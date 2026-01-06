const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class MopTwistFrequencyControlCapability extends Capability {
    /**
     *
     * @param {object} options
     * @param {T} options.robot
     * @class
     */
    constructor(options) {
        super(options);
    }

    /**
     * @returns {Promise<MopTwistFrequencyControlCapabilityMopTwist>}
     */
    async getMopTwist() {
        throw new NotImplementedError();
    }

    /**
     *
     * @param {MopTwistFrequencyControlCapabilityMopTwist} newMopTwist
     * @returns {Promise<void>}
     */
    async setMopTwist(newMopTwist) {
        throw new NotImplementedError();
    }

    /**
     * @returns {{supportedMopTwists: Array<MopTwistFrequencyControlCapabilityMopTwist>}}
     */
    getProperties() {
        return {
            supportedMopTwists: []
        };
    }

    getType() {
        return MopTwistFrequencyControlCapability.TYPE;
    }
}

MopTwistFrequencyControlCapability.TYPE = "MopTwistFrequencyControlCapability";

/**
 *  @typedef {string} MopTwistFrequencyControlCapabilityMopTwist
 *  @enum {string}
 *
 */
MopTwistFrequencyControlCapability.MOPTWIST = Object.freeze({
    OFF: "off",
    EACH_CLEANUP: "each_cleanup",
    EVERY_7_DAYS: "every_7_days",
});


module.exports = MopTwistFrequencyControlCapability;
