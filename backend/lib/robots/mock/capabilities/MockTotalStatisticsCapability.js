const TotalStatisticsCapability = require("../../../core/capabilities/TotalStatisticsCapability");

const NoCloudDataPoint = require("../../../entities/core/NoCloudDataPoint");

/**
 * @extends TotalStatisticsCapability<import("../MockRobot")>
 */
class MockTotalStatisticsCapability extends TotalStatisticsCapability {
    constructor(options) {
        super(options);

        const count = 5;
        this.totalStatistics = {
            time: count * 24 * 60,
            area: count * 63 * 10000,
            count: count
        };
    }

    /**
     * @return {Promise<Array<NoCloudDataPoint>>}
     */
    async getStatistics() {
        return [
            new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.TIME,
                value: this.totalStatistics.time
            }),
            new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.AREA,
                value: this.totalStatistics.area
            }),
            new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.COUNT,
                value: this.totalStatistics.count
            })
        ];
    }

    getProperties() {
        return {
            availableStatistics: [
                NoCloudDataPoint.TYPES.TIME,
                NoCloudDataPoint.TYPES.AREA,
                NoCloudDataPoint.TYPES.COUNT
            ]
        };
    }
}

module.exports = MockTotalStatisticsCapability;
