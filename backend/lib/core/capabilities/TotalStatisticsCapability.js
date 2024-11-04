const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");
const NoCloudDataPoint = require("../../entities/core/NoCloudDataPoint");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class TotalStatisticsCapability extends Capability {
    /**
     * The amount and type of stuff returned here depends on the robots implementation
     *
     * @return {Promise<Array<NoCloudDataPoint>>}
     */
    async getStatistics() {
        throw new NotImplementedError();
    }

    getType() {
        return TotalStatisticsCapability.TYPE;
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

TotalStatisticsCapability.TYPE = "TotalStatisticsCapability";

module.exports = TotalStatisticsCapability;
