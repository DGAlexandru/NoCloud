const CurrentStatisticsCapability = require("../../../core/capabilities/CurrentStatisticsCapability");
const NoCloudDataPoint = require("../../../entities/core/NoCloudDataPoint");

/**
 * @extends CurrentStatisticsCapability<import("../MockRobot")>
 */
class MockCurrentStatisticsCapability extends CurrentStatisticsCapability {
    /**
     * @param {object} options
     * @param {import("../MockRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.currentStatistics = {
            time: 24*60,
            area: 63*10000
        };
    }

    /**
     * @return {Promise<Array<NoCloudDataPoint>>}
     */
    async getStatistics() {
        return [
            new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.TIME,
                value: this.currentStatistics.time
            }),
            new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.AREA,
                value: this.currentStatistics.area
            })
        ];
    }

    getProperties() {
        return {
            availableStatistics: [
                NoCloudDataPoint.TYPES.TIME,
                NoCloudDataPoint.TYPES.AREA
            ]
        };
    }
}

module.exports = MockCurrentStatisticsCapability;
