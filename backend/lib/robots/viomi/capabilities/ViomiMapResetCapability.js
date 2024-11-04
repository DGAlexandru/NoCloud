const MapResetCapability = require("../../../core/capabilities/MapResetCapability");

/**
 * @extends MapResetCapability<import("../ViomiNoCloudRobot")>
 */
class ViomiMapResetCapability extends MapResetCapability {
    /**
     * @returns {Promise<void>}
     */
    async reset() {
        await this.robot.sendCommand("set_resetmap", [], {});

        this.robot.clearNoCloudMap();
    }
}

module.exports = ViomiMapResetCapability;
