const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class CollisionAvoidantNavigationControlCapability extends SimpleToggleCapability {
    getType() {
        return CollisionAvoidantNavigationControlCapability.TYPE;
    }
}

CollisionAvoidantNavigationControlCapability.TYPE = "CollisionAvoidantNavigationControlCapability";

module.exports = CollisionAvoidantNavigationControlCapability;
