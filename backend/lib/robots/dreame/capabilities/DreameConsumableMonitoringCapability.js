const ConsumableMonitoringCapability = require("../../../core/capabilities/ConsumableMonitoringCapability");
const NoCloudConsumable = require("../../../entities/core/NoCloudConsumable");
const RobotFirmwareError = require("../../../core/RobotFirmwareError");

/**
 * @extends ConsumableMonitoringCapability<import("../DreameNoCloudRobot")>
 */
class DreameConsumableMonitoringCapability extends ConsumableMonitoringCapability {
    /**
     *
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     *
     * @param {object} options.miot_actions
     * @param {object} options.miot_actions.reset_main_brush
     * @param {number} options.miot_actions.reset_main_brush.siid
     * @param {number} options.miot_actions.reset_main_brush.aiid
     *
     * @param {object} options.miot_actions.reset_side_brush
     * @param {number} options.miot_actions.reset_side_brush.siid
     * @param {number} options.miot_actions.reset_side_brush.aiid
     *
     * @param {object} options.miot_actions.reset_filter
     * @param {number} options.miot_actions.reset_filter.siid
     * @param {number} options.miot_actions.reset_filter.aiid
     *
     * @param {object} [options.miot_actions.reset_sensor]
     * @param {number} options.miot_actions.reset_sensor.siid
     * @param {number} options.miot_actions.reset_sensor.aiid
     *
     * @param {object} [options.miot_actions.reset_mop]
     * @param {number} options.miot_actions.reset_mop.siid
     * @param {number} options.miot_actions.reset_mop.aiid
     * 
     * @param {object} [options.miot_actions.reset_secondary_filter]
     * @param {number} options.miot_actions.reset_secondary_filter.siid
     * @param {number} options.miot_actions.reset_secondary_filter.aiid
     * 
     * @param {object} [options.miot_actions.reset_detergent]
     * @param {number} options.miot_actions.reset_detergent.siid
     * @param {number} options.miot_actions.reset_detergent.aiid
     * 
     * @param {object} [options.miot_actions.reset_wheel]
     * @param {number} options.miot_actions.reset_wheel.siid
     * @param {number} options.miot_actions.reset_wheel.aiid
     *
     *
     * @param {object} options.miot_properties
     * @param {object} options.miot_properties.main_brush
     * @param {number} options.miot_properties.main_brush.siid
     * @param {number} options.miot_properties.main_brush.piid
     *
     * @param {object} options.miot_properties.side_brush
     * @param {number} options.miot_properties.side_brush.siid
     * @param {number} options.miot_properties.side_brush.piid
     *
     * @param {object} options.miot_properties.filter
     * @param {number} options.miot_properties.filter.siid
     * @param {number} options.miot_properties.filter.piid
     *
     * @param {object} [options.miot_properties.sensor]
     * @param {number} options.miot_properties.sensor.siid
     * @param {number} options.miot_properties.sensor.piid
     *
     * @param {object} [options.miot_properties.mop]
     * @param {number} options.miot_properties.mop.siid
     * @param {number} options.miot_properties.mop.piid
     * 
     * @param {object} [options.miot_properties.secondary_filter]
     * @param {number} options.miot_properties.secondary_filter.siid
     * @param {number} options.miot_properties.secondary_filter.piid
     * 
     * @param {object} [options.miot_properties.detergent]
     * @param {number} options.miot_properties.detergent.siid
     * @param {number} options.miot_properties.detergent.piid
     * 
     * @param {object} [options.miot_properties.wheel]
     * @param {number} options.miot_properties.wheel.siid
     * @param {number} options.miot_properties.wheel.piid
     */
    constructor(options) {
        super(options);

        this.miot_actions = options.miot_actions;
        this.miot_properties = options.miot_properties;
    }

    /**
     * This function polls the current consumables
     *
     * @abstract
     * @returns {Promise<Array<import("../../../entities/core/NoCloudConsumable")>>}
     */
    async getConsumables() {
        const props = [
            this.miot_properties.main_brush,
            this.miot_properties.side_brush,
            this.miot_properties.filter
        ];

        if (this.miot_properties.sensor) {
            props.push(this.miot_properties.sensor);
        }

        if (this.miot_properties.mop) {
            props.push(this.miot_properties.mop);
        }

        if (this.miot_properties.secondary_filter) {
            props.push(this.miot_properties.secondary_filter);
        }

        if (this.miot_properties.detergent) {
            props.push(this.miot_properties.detergent);
        }

        if (this.miot_properties.wheel) {
            props.push(this.miot_properties.wheel);
        }

        const response = await this.robot.sendCommand("get_properties", props.map(e => {
            return Object.assign({}, e, {did: this.robot.deviceId});
        }));

        const filteredResponse = response.filter(elem => {
            return elem?.code === 0;
        })
            .map(elem => {
                return this.parseConsumablesMessage(elem);
            })
            .filter(elem => {
                return elem instanceof NoCloudConsumable;
            });

        this.raiseEventIfRequired(filteredResponse);

        return filteredResponse;
    }

    /**
     * @param {string} type
     * @param {string} [subType]
     * @returns {Promise<void>}
     */
    async resetConsumable(type, subType) {
        let payload;

        switch (type) {
            case NoCloudConsumable.TYPE.BRUSH:
                switch (subType) {
                    case NoCloudConsumable.SUB_TYPE.MAIN:
                        payload = this.miot_actions.reset_main_brush;
                        break;
                    case NoCloudConsumable.SUB_TYPE.SIDE_RIGHT:
                        payload = this.miot_actions.reset_side_brush;
                        break;
                }
                break;
            case NoCloudConsumable.TYPE.FILTER:
                switch (subType) {
                    case NoCloudConsumable.SUB_TYPE.MAIN:
                        payload = this.miot_actions.reset_filter;
                        break;
                    case NoCloudConsumable.SUB_TYPE.SECONDARY:
                        payload = this.miot_actions.reset_secondary_filter;
                        break;
                }
                break;
            case NoCloudConsumable.TYPE.CLEANING:
                switch (subType) {
                    case NoCloudConsumable.SUB_TYPE.SENSOR:
                        if (this.miot_actions.reset_sensor) {
                            payload = this.miot_actions.reset_sensor;
                        }
                        break;
                    case NoCloudConsumable.SUB_TYPE.WHEEL:
                        if (this.miot_actions.reset_wheel) {
                            payload = this.miot_actions.reset_wheel;
                        }
                        break;

                }
                break;
            case NoCloudConsumable.TYPE.MOP:
                if (this.miot_actions.reset_mop) {
                    switch (subType) {
                        case NoCloudConsumable.SUB_TYPE.ALL:
                            payload = this.miot_actions.reset_mop;
                            break;
                    }
                }
                break;
            case NoCloudConsumable.TYPE.DETERGENT:
                if (this.miot_actions.reset_detergent) {
                    switch (subType) {
                        case NoCloudConsumable.SUB_TYPE.DOCK:
                            payload = this.miot_actions.reset_detergent;
                            break;
                    }
                }
                break;
        }

        if (payload) {
            await this.robot.sendCommand("action",
                {
                    did: this.robot.deviceId,
                    siid: payload.siid,
                    aiid: payload.aiid,
                    in: []
                }
            ).then(res => {
                if (res.code !== 0) {
                    throw new RobotFirmwareError("Error code " + res.code + " while resetting consumable.");
                }

                this.markEventsAsProcessed(type, subType);
            });
        } else {
            throw new Error("No such consumable");
        }
    }

    parseConsumablesMessage(msg) {
        let consumable;

        switch (msg.siid) {
            case this.miot_properties.main_brush.siid: {
                switch (msg.piid) {
                    case this.miot_properties.main_brush.piid:
                        consumable = new NoCloudConsumable({
                            type: NoCloudConsumable.TYPE.BRUSH,
                            subType: NoCloudConsumable.SUB_TYPE.MAIN,
                            remaining: {
                                value: Math.round(Math.max(0, msg.value * 60)),
                                unit: NoCloudConsumable.UNITS.MINUTES
                            }
                        });
                        break;
                }
                break;
            }
            case this.miot_properties.side_brush.siid: {
                switch (msg.piid) {
                    case this.miot_properties.side_brush.piid:
                        consumable = new NoCloudConsumable({
                            type: NoCloudConsumable.TYPE.BRUSH,
                            subType: NoCloudConsumable.SUB_TYPE.SIDE_RIGHT,
                            remaining: {
                                value: Math.round(Math.max(0, msg.value * 60)),
                                unit: NoCloudConsumable.UNITS.MINUTES
                            }
                        });
                        break;
                }
                break;
            }
            case this.miot_properties.filter.siid: {
                switch (msg.piid) {
                    case this.miot_properties.filter.piid:
                        consumable = new NoCloudConsumable({
                            type: NoCloudConsumable.TYPE.FILTER,
                            subType: NoCloudConsumable.SUB_TYPE.MAIN,
                            remaining: {
                                value: Math.round(Math.max(0, msg.value * 60)),
                                unit: NoCloudConsumable.UNITS.MINUTES
                            }
                        });
                        break;
                }
                break;
            }

            default:
                if (
                    this.miot_properties.sensor &&
                    msg.siid === this.miot_properties.sensor.siid
                ) {
                    if (msg.piid === this.miot_properties.sensor.piid) {
                        consumable = new NoCloudConsumable({
                            type: NoCloudConsumable.TYPE.CLEANING,
                            subType: NoCloudConsumable.SUB_TYPE.SENSOR,
                            remaining: {
                                value: Math.round(Math.max(0, msg.value * 60)),
                                unit: NoCloudConsumable.UNITS.MINUTES
                            }
                        });
                    }
                } else if (
                    this.miot_properties.mop &&
                    msg.siid === this.miot_properties.mop.siid
                ) {
                    if (msg.piid === this.miot_properties.mop.piid) {
                        consumable = new NoCloudConsumable({
                            type: NoCloudConsumable.TYPE.MOP,
                            subType: NoCloudConsumable.SUB_TYPE.ALL,
                            remaining: {
                                value: Math.round(Math.max(0, msg.value * 60)),
                                unit: NoCloudConsumable.UNITS.MINUTES
                            }
                        });
                    }
                } else if (
                    this.miot_properties.secondary_filter &&
                    msg.siid === this.miot_properties.secondary_filter.siid
                ) {
                    if (msg.piid === this.miot_properties.secondary_filter.piid) {
                        consumable = new NoCloudConsumable({
                            type: NoCloudConsumable.TYPE.FILTER,
                            subType: NoCloudConsumable.SUB_TYPE.SECONDARY,
                            remaining: {
                                value: Math.round(Math.max(0, msg.value * 60)),
                                unit: NoCloudConsumable.UNITS.MINUTES
                            }
                        });
                    }
                } else if (
                    this.miot_properties.detergent &&
                    msg.siid === this.miot_properties.detergent.siid
                ) {
                    if (msg.piid === this.miot_properties.detergent.piid) {
                        consumable = new NoCloudConsumable({
                            type: NoCloudConsumable.TYPE.DETERGENT,
                            subType: NoCloudConsumable.SUB_TYPE.DOCK,
                            remaining: {
                                value: Math.max(0, msg.value),
                                unit: NoCloudConsumable.UNITS.PERCENT
                            }
                        });
                    }
                } else if (
                    this.miot_properties.wheel &&
                    msg.siid === this.miot_properties.wheel.siid
                ) {
                    if (msg.piid === this.miot_properties.wheel.piid) {
                        consumable = new NoCloudConsumable({
                            type: NoCloudConsumable.TYPE.CLEANING,
                            subType: NoCloudConsumable.SUB_TYPE.WHEEL,
                            remaining: {
                                value: Math.round(Math.max(0, msg.value * 60)),
                                unit: NoCloudConsumable.UNITS.MINUTES
                            }
                        });
                    }
                }
        }

        return consumable;
    }

    getProperties() {
        /** @type Array<ConsumableMonitoringCapability.ConsumableMeta> **/
        const availableConsumables = [
            {
                type: NoCloudConsumable.TYPE.BRUSH,
                subType: NoCloudConsumable.SUB_TYPE.MAIN,
                unit: NoCloudConsumable.UNITS.MINUTES,
                maxValue: 300 * 60
            },
            {
                type: NoCloudConsumable.TYPE.BRUSH,
                subType: NoCloudConsumable.SUB_TYPE.SIDE_RIGHT,
                unit: NoCloudConsumable.UNITS.MINUTES,
                maxValue: 200 * 60
            },
            {
                type: NoCloudConsumable.TYPE.FILTER,
                subType: NoCloudConsumable.SUB_TYPE.MAIN,
                unit: NoCloudConsumable.UNITS.MINUTES,
                maxValue: 150 * 60
            }
        ];

        if (this.miot_properties.sensor) {
            availableConsumables.push(
                {
                    type: NoCloudConsumable.TYPE.CLEANING,
                    subType: NoCloudConsumable.SUB_TYPE.SENSOR,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 30 * 60
                }
            );
        }

        if (this.miot_properties.mop) {
            availableConsumables.push(
                {
                    type: NoCloudConsumable.TYPE.MOP,
                    subType: NoCloudConsumable.SUB_TYPE.ALL,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 80 * 60
                }
            );
        }

        if (this.miot_properties.secondary_filter) {
            availableConsumables.push(
                {
                    type: NoCloudConsumable.TYPE.FILTER,
                    subType: NoCloudConsumable.SUB_TYPE.SECONDARY,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 300 * 60
                }
            );
        }

        if (this.miot_properties.detergent) {
            availableConsumables.push(
                {
                    type: NoCloudConsumable.TYPE.DETERGENT,
                    subType: NoCloudConsumable.SUB_TYPE.DOCK,
                    unit: NoCloudConsumable.UNITS.PERCENT
                }
            );
        }

        if (this.miot_properties.wheel) {
            availableConsumables.push(
                {
                    type: NoCloudConsumable.TYPE.CLEANING,
                    subType: NoCloudConsumable.SUB_TYPE.WHEEL,
                    unit: NoCloudConsumable.UNITS.MINUTES,
                    maxValue: 30 * 60
                }
            );
        }

        return {
            availableConsumables: availableConsumables
        };
    }
}

module.exports = DreameConsumableMonitoringCapability;
