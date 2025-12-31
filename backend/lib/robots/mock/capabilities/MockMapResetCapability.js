const MapResetCapability = require("../../../core/capabilities/MapResetCapability");

/**
 * @extends MapResetCapability<import("../MockNoCloudRobot")>
 */
class MockMapResetCapability extends MapResetCapability {
    /**
     * @returns {Promise<void>}
     */
    async reset() {
        this.robot.buildMap();
    }
}

module.exports = MockMapResetCapability;
