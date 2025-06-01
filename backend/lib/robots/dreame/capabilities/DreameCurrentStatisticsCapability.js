const CurrentStatisticsCapability = require("../../../core/capabilities/CurrentStatisticsCapability");

const Logger = require("../../../Logger");
const NoCloudDataPoint = require("../../../entities/core/NoCloudDataPoint");

/**
 * @extends CurrentStatisticsCapability<import("../DreameNoCloudRobot")>
 */
class DreameCurrentStatisticsCapability extends CurrentStatisticsCapability {
    /**
     *
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     *
     * @param {object} options.miot_properties
     * @param {object} options.miot_properties.time
     * @param {number} options.miot_properties.time.siid
     * @param {number} options.miot_properties.time.piid
     *
     * @param {object} options.miot_properties.area
     * @param {number} options.miot_properties.area.siid
     * @param {number} options.miot_properties.area.piid
     */
    constructor(options) {
        super(options);

        this.miot_properties = options.miot_properties;
    }



    /**
     * @return {Promise<Array<NoCloudDataPoint>>}
     */
    async getStatistics() {
        const response = await this.robot.sendCommand("get_properties", [
            this.miot_properties.time,
            this.miot_properties.area
        ].map(e => {
            return Object.assign({}, e, {did: this.robot.deviceId});
        }));

        if (response) {
            return response
                .filter(elem => elem?.code === 0)
                .map(elem => this.parseTotalStatisticsMessage(elem))
                .filter(elem => elem instanceof NoCloudDataPoint);
        } else {
            throw new Error("Failed to fetch total statistics");
        }
    }

    /**
     * @param {object} msg
     * @return {NoCloudDataPoint|undefined}
     */
    parseTotalStatisticsMessage(msg) {
        // Use current time as timestamp; if msg has a timestamp, use it instead (make sure to convert to string if necessary)
        const timestamp = new Date().toISOString();

        if (msg.siid === this.miot_properties.time.siid && msg.piid === this.miot_properties.time.piid) {
            return new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.TIME,
                value: msg.value * 60,
                timestamp: timestamp
            });
        } else if (msg.siid === this.miot_properties.area.siid && msg.piid === this.miot_properties.area.piid) {
            return new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.AREA,
                value: msg.value * 10000,
                timestamp: timestamp
            });
        } else {
            Logger.warn("Unhandled current statistics message", msg);
        }
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

module.exports = DreameCurrentStatisticsCapability;
