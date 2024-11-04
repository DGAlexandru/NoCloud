const GoToLocationCapability = require("../../../core/capabilities/GoToLocationCapability");
const RoborockMapParser = require("../RoborockMapParser");

/**
 * @extends GoToLocationCapability<import("../RoborockNoCloudRobot")>
 */
class RoborockGoToLocationCapability extends GoToLocationCapability {
    /**
     * @param {import("../../../entities/core/NoCloudGoToLocation")} NoCloudGoToLocation
     * @returns {Promise<void>}
     */
    async goTo(NoCloudGoToLocation) {
        await this.robot.sendCommand(
            "app_goto_target",
            [
                Math.floor(NoCloudGoToLocation.coordinates.x * 10),
                Math.floor(RoborockMapParser.DIMENSION_MM - NoCloudGoToLocation.coordinates.y * 10)
            ],
            {}
        );
    }
}

module.exports = RoborockGoToLocationCapability;
