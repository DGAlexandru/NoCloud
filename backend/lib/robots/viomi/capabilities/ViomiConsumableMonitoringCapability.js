const ConsumableMonitoringCapability = require("../../../core/capabilities/ConsumableMonitoringCapability");
const NoCloudConsumable = require("../../../entities/core/NoCloudConsumable");

/**
 * @extends ConsumableMonitoringCapability<import("../ViomiNoCloudRobot")>
 */
class ViomiConsumableMonitoringCapability extends ConsumableMonitoringCapability {
    /**
     * This function polls the current consumables state and stores the attributes in our robotState
     *
     * @abstract
     * @returns {Promise<Array<import("../../../entities/core/NoCloudConsumable")>>}
     */
    async getConsumables() {
        const data = await this.robot.sendCommand("get_consumables");
        const rawConsumables = {
            mainBrush: data[0],
            sideBrush: data[1],
            filter: data[2],
            mop: data[3]
        };

        const consumables = [
            new NoCloudConsumable({
                type: NoCloudConsumable.TYPE.BRUSH,
                subType: NoCloudConsumable.SUB_TYPE.MAIN,
                remaining: {
                    value: Math.round(Math.max(0, (360 - rawConsumables.mainBrush) * 60)),
                    unit: NoCloudConsumable.UNITS.MINUTES
                }
            }),
            new NoCloudConsumable({
                type: NoCloudConsumable.TYPE.BRUSH,
                subType: NoCloudConsumable.SUB_TYPE.SIDE_RIGHT,
                remaining: {
                    value: Math.round(Math.max(0, (180 - rawConsumables.sideBrush) * 60)),
                    unit: NoCloudConsumable.UNITS.MINUTES
                }
            }),
            new NoCloudConsumable({
                type: NoCloudConsumable.TYPE.FILTER,
                subType: NoCloudConsumable.SUB_TYPE.MAIN,
                remaining: {
                    value: Math.round(Math.max(0, (180 - rawConsumables.filter) * 60)),
                    unit: NoCloudConsumable.UNITS.MINUTES
                }
            }),
            new NoCloudConsumable({
                type: NoCloudConsumable.TYPE.MOP,  // According to python-miio, unverified
                subType: NoCloudConsumable.SUB_TYPE.MAIN,
                remaining: {
                    value: Math.round(Math.max(0, (180 - rawConsumables.mop) * 60)),
                    unit: NoCloudConsumable.UNITS.MINUTES
                }
            }),
        ];

        this.raiseEventIfRequired(consumables);

        return consumables;
    }

    /**
     * @abstract
     * @param {string} type
     * @param {string} [subType]
     * @returns {Promise<void>}
     */
    async resetConsumable(type, subType) {
        let idx;

        switch (type) {
            case NoCloudConsumable.TYPE.BRUSH:
                switch (subType) {
                    case NoCloudConsumable.SUB_TYPE.MAIN:
                        idx = 1;
                        break;
                    case NoCloudConsumable.SUB_TYPE.SIDE_RIGHT:
                        idx = 2;
                        break;
                }
                break;
            case NoCloudConsumable.TYPE.FILTER:
                switch (subType) {
                    case NoCloudConsumable.SUB_TYPE.MAIN:
                        idx = 3;
                        break;
                }
                break;
            case NoCloudConsumable.TYPE.MOP:
                switch (subType) {
                    case NoCloudConsumable.SUB_TYPE.MAIN:
                        idx = 4;
                        break;
                }
                break;
        }

        if (idx) {
            await this.robot.sendCommand("set_consumables", [idx, 0], {});
        } else {
            throw new Error("No such consumable");
        }
    }

    getProperties() {
        return {
            availableConsumables: [
                {
                    type: NoCloudConsumable.TYPE.BRUSH,
                    subType: NoCloudConsumable.SUB_TYPE.MAIN,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 360 * 60
                },
                {
                    type: NoCloudConsumable.TYPE.BRUSH,
                    subType: NoCloudConsumable.SUB_TYPE.SIDE_RIGHT,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 180 * 60
                },
                {
                    type: NoCloudConsumable.TYPE.FILTER,
                    subType: NoCloudConsumable.SUB_TYPE.MAIN,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 180 * 60
                }
            ]
        };
    }
}

module.exports = ViomiConsumableMonitoringCapability;
