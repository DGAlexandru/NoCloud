const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class GoToLocationCapability extends Capability {
    /**
     * @abstract
     * @param {import("../../entities/core/NoCloudGoToLocation")} NoCloudGoToLocation
     * @returns {Promise<void>}
     */
    async goTo(NoCloudGoToLocation) {
        throw new NotImplementedError();
    }

    getType() {
        return GoToLocationCapability.TYPE;
    }
}

GoToLocationCapability.TYPE = "GoToLocationCapability";

module.exports = GoToLocationCapability;
