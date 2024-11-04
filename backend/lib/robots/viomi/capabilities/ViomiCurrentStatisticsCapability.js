const CurrentStatisticsCapability = require("../../../core/capabilities/CurrentStatisticsCapability");
const NoCloudDataPoint = require("../../../entities/core/NoCloudDataPoint");

/**
 * @extends CurrentStatisticsCapability<import("../ViomiNoCloudRobot")>
 */
class ViomiCurrentStatisticsCapability extends CurrentStatisticsCapability {
    /**
     * @param {object} options
     * @param {import("../ViomiNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.currentStatistics = {
            time: undefined,
            area: undefined
        };
    }

    /**
     * @return {Promise<Array<NoCloudDataPoint>>}
     */
    async getStatistics() {
        await this.robot.pollState(); //fetching robot state populates the capability's internal state. somewhat spaghetti :(

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

module.exports = ViomiCurrentStatisticsCapability;
