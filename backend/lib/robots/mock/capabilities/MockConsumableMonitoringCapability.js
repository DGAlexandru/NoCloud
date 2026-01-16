const ConsumableMonitoringCapability = require("../../../core/capabilities/ConsumableMonitoringCapability");
const NoCloudConsumable = require("../../../entities/core/NoCloudConsumable");
const stateAttrs = require("../../../entities/state/attributes");

const MOCKED_CONSUMABLES = Object.freeze([
    {
        type: NoCloudConsumable.TYPE.BRUSH,
        subType: NoCloudConsumable.SUB_TYPE.MAIN,
        serviceLife: 60,
    },
    {
        type: NoCloudConsumable.TYPE.BRUSH,
        subType: NoCloudConsumable.SUB_TYPE.SIDE_RIGHT,
        serviceLife: 30,
    },
    {
        type: NoCloudConsumable.TYPE.FILTER,
        subType: NoCloudConsumable.SUB_TYPE.MAIN,
        serviceLife: 10,
    },
    {
        type: NoCloudConsumable.TYPE.CLEANING,
        subType: NoCloudConsumable.SUB_TYPE.SENSOR,
        serviceLife: 5,
    },
    {
        type: NoCloudConsumable.TYPE.MOP,
        subType: NoCloudConsumable.SUB_TYPE.MAIN,
        serviceLife: 1,
    },
]);

/**
 * @extends ConsumableMonitoringCapability<import("../MockNoCloudRobot")>
 */
class MockConsumableMonitoringCapability extends ConsumableMonitoringCapability {
    /**
     * @param {object} options
     * @param {import("../MockNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);
        this.remaining = MOCKED_CONSUMABLES.map(c => {
            return c.serviceLife;
        });

        setInterval(() => {
            const statusStateAttribute = this.robot.state.getFirstMatchingAttribute({
                attributeClass: stateAttrs.StatusStateAttribute.name
            });

            if (statusStateAttribute && statusStateAttribute.isActiveState) {
                this.remaining.forEach((_, idx) => {
                    this.remaining[idx] = Math.max(0, this.remaining[idx] - 1);
                });
            }
        }, 60 * 1000);
    }

    /**
     * @returns {Promise<Array<import("../../../entities/core/NoCloudConsumable")>>}
     */
    async getConsumables() {
        const consumables = MOCKED_CONSUMABLES.map((c, idx) => {
            const remaining = this.remaining[idx];

            return new NoCloudConsumable({
                type: c.type,
                subType: c.subType,
                remaining: {
                    value: remaining,
                    unit: NoCloudConsumable.UNITS.MINUTES
                }
            });
        });

        this.raiseEventIfRequired(consumables);

        return consumables;
    }

    /**
     * @param {string} type
     * @param {string} [subType]
     * @returns {Promise<void>}
     */
    async resetConsumable(type, subType) {
        const consumableIdx = MOCKED_CONSUMABLES.findIndex(c => c.type === type && c.subType === subType);

        if (consumableIdx >= 0) {
            this.remaining[consumableIdx] = MOCKED_CONSUMABLES[consumableIdx].serviceLife;

            this.markEventsAsProcessed(type, subType);
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
                    maxValue: 60
                },
                {
                    type: NoCloudConsumable.TYPE.BRUSH,
                    subType: NoCloudConsumable.SUB_TYPE.SIDE_RIGHT,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 30
                },
                {
                    type: NoCloudConsumable.TYPE.FILTER,
                    subType: NoCloudConsumable.SUB_TYPE.MAIN,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 10
                },
                {
                    type: NoCloudConsumable.TYPE.CLEANING,
                    subType: NoCloudConsumable.SUB_TYPE.SENSOR,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 5
                },
                {
                    type: NoCloudConsumable.TYPE.MOP,
                    subType: NoCloudConsumable.SUB_TYPE.MAIN,
                    unit: NoCloudConsumable.UNITS.PERCENT,
                    maxValue: 1
                }
            ]
        };
    }
}

module.exports = MockConsumableMonitoringCapability;
