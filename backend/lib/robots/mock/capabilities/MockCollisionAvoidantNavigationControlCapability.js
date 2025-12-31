const CollisionAvoidantNavigationControlCapability = require("../../../core/capabilities/CollisionAvoidantNavigationControlCapability");

/**
 * @extends CollisionAvoidantNavigationControlCapability<import("../MockNoCloudRobot")>
 */
class MockCollisionAvoidantNavigationControlCapability extends CollisionAvoidantNavigationControlCapability {
    /**
     * @param {object} options
     * @param {import("../MockNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.enabled = true;
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

module.exports = MockCollisionAvoidantNavigationControlCapability;
