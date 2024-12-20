const TotalStatisticsCapability = require("../../../core/capabilities/TotalStatisticsCapability");
const NoCloudDataPoint = require("../../../entities/core/NoCloudDataPoint");

/**
 * @extends TotalStatisticsCapability<import("../RoborockNoCloudRobot")>
 */
class RoborockTotalStatisticsCapability extends TotalStatisticsCapability {
    /**
     * @return {Promise<Array<NoCloudDataPoint>>}
     */
    async getStatistics() {
        const res = await this.robot.sendCommand("get_clean_summary", [], {});

        // This is how roborock robots before the S7 reported total statistics
        if (Array.isArray(res) && res.length === 4) {
            return [
                new NoCloudDataPoint({
                    type: NoCloudDataPoint.TYPES.TIME,
                    value: res[0]
                }),
                new NoCloudDataPoint({
                    type: NoCloudDataPoint.TYPES.AREA,
                    value: Math.round(res[1] / 100)
                }),
                new NoCloudDataPoint({
                    type: NoCloudDataPoint.TYPES.COUNT,
                    value: res[2]
                })
            ];
        } else if ( //S7 and up
            res &&
            res.clean_time !== undefined &&
            res.clean_area !== undefined &&
            res.clean_count !== undefined
        ) {
            return [
                new NoCloudDataPoint({
                    type: NoCloudDataPoint.TYPES.TIME,
                    value: res.clean_time
                }),
                new NoCloudDataPoint({
                    type: NoCloudDataPoint.TYPES.AREA,
                    value: Math.round(res.clean_area / 100)
                }),
                new NoCloudDataPoint({
                    type: NoCloudDataPoint.TYPES.COUNT,
                    value: res.clean_count
                })
            ];
        } else {
            throw new Error("Received invalid response");
        }
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

module.exports = RoborockTotalStatisticsCapability;
