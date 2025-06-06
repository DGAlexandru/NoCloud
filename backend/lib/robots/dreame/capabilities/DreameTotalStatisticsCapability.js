const TotalStatisticsCapability = require("../../../core/capabilities/TotalStatisticsCapability");

const Logger = require("../../../Logger");
const NoCloudDataPoint = require("../../../entities/core/NoCloudDataPoint");

/**
 * @extends TotalStatisticsCapability<import("../DreameNoCloudRobot")>
 */
class DreameTotalStatisticsCapability extends TotalStatisticsCapability {
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
     * @param {object} options.miot_properties.count
     * @param {number} options.miot_properties.count.siid
     * @param {number} options.miot_properties.count.piid
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
            this.miot_properties.count,
            this.miot_properties.area
        ].map(e => {
            return Object.assign({}, e, {did: this.robot.deviceId});
        }));

        if (response) {
            return response.filter(elem => {
                return elem?.code === 0;
            })
                .map(elem => {
                    return this.parseTotalStatisticsMessage(elem);
                })
                .filter(elem => {
                    return elem instanceof NoCloudDataPoint;
                });
        } else {
            throw new Error("Failed to fetch total statistics");
        }
    }


    parseTotalStatisticsMessage(msg) {
        if (msg.siid === this.miot_properties.time.siid && msg.piid === this.miot_properties.time.piid) {
            return new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.TIME,
                value: msg.value * 60
            });
        } else if (msg.siid === this.miot_properties.area.siid && msg.piid === this.miot_properties.area.piid) {
            return new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.AREA,
                value: msg.value * 10000
            });
        } else if (msg.siid === this.miot_properties.count.siid && msg.piid === this.miot_properties.count.piid) {
            return new NoCloudDataPoint({
                type: NoCloudDataPoint.TYPES.COUNT,
                value: msg.value
            });
        } else {
            Logger.warn("Unhandled total statistics message", msg);
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

module.exports = DreameTotalStatisticsCapability;
