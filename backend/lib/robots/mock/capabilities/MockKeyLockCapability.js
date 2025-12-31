const KeyLockCapability = require("../../../core/capabilities/KeyLockCapability");

/**
 * @extends KeyLockCapability<import("../MockNoCloudRobot")>
 */
class MockKeyLockCapability extends KeyLockCapability {
    /**
     * @param {object} options
     * @param {import("../MockNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.enabled = false;
    }

    async isEnabled() {
        return this.enabled;
    }

    /**
     * @returns {Promise<void>}
     */
    async enable() {
        this.enabled = true;
    }

    /**
     * @returns {Promise<void>}
     */
    async disable() {
        this.enabled = false;
    }
}

module.exports = MockKeyLockCapability;
