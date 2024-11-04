const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");
const NoCloudDataPoint = require("../../entities/core/NoCloudDataPoint");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class CurrentStatisticsCapability extends Capability {
    /**
     * The amount and type of stuff returned here depends on the robots implementation
     *
     * @return {Promise<Array<NoCloudDataPoint>>}
     */
    async getStatistics() {
        throw new NotImplementedError();
    }

    getType() {
        return CurrentStatisticsCapability.TYPE;
    }

    /**
     * @return {{availableStatistics: Array<NoCloudDataPoint.TYPES>}}
     */
    getProperties() {
        return {
            availableStatistics: []
        };
    }
}

CurrentStatisticsCapability.TYPE = "CurrentStatisticsCapability";

module.exports = CurrentStatisticsCapability;
