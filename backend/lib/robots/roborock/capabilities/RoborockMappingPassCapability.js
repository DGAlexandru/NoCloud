const MappingPassCapability = require("../../../core/capabilities/MappingPassCapability");

/**
 * @extends MappingPassCapability<import("../RoborockNoCloudRobot")>
 */
class RoborockMappingPassCapability extends MappingPassCapability {
    async startMapping() {
        await this.robot.sendCommand("app_start_build_map", [], {});
    }
}

module.exports = RoborockMappingPassCapability;
