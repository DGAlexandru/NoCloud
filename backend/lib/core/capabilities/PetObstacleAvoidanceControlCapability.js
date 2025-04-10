const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class PetObstacleAvoidanceControlCapability extends SimpleToggleCapability {
    getType() {
        return PetObstacleAvoidanceControlCapability.TYPE;
    }
}

PetObstacleAvoidanceControlCapability.TYPE = "PetObstacleAvoidanceControlCapability";

module.exports = PetObstacleAvoidanceControlCapability;
