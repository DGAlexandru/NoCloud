const CapabilityMqttHandle = require("./CapabilityMqttHandle");
const ComponentType = require("../homeassistant/ComponentType");
const DataType = require("../homie/DataType");
const EntityCategory = require("../homeassistant/EntityCategory");
const HassAnchor = require("../homeassistant/HassAnchor");
const InLineHassComponent = require("../homeassistant/components/InLineHassComponent");
const Logger = require("../../Logger");
const PropertyMqttHandle = require("../handles/PropertyMqttHandle");
const Unit = require("../common/Unit");
const NoCloudDataPoint = require("../../entities/core/NoCloudDataPoint");

class TotalStatisticsCapabilityMqttHandle extends CapabilityMqttHandle {
    /**
     * @param {object} options
     * @param {import("../handles/RobotMqttHandle")} options.parent
     * @param {import("../MqttController")} options.controller MqttController instance
     * @param {import("../../core/NoCloudRobot")} options.robot
     * @param {import("../../core/capabilities/TotalStatisticsCapability")} options.capability
     */
    constructor(options) {
        super(Object.assign(options, {
            friendlyName: "Total Statistics",
            helpMayChange: {
                "Properties": "Available statistics depend on the robot model.",
            }
        }));
        this.capability = options.capability;

        this.capability.getProperties().availableStatistics.forEach(availableStatistic => {
            switch (availableStatistic) {
                case NoCloudDataPoint.TYPES.TIME:
                    this.registerChild(
                        new PropertyMqttHandle({
                            parent: this,
                            controller: this.controller,
                            topicName: "time",
                            friendlyName: "Total Statistics Time",
                            datatype: DataType.INTEGER,
                            unit: Unit.SECONDS,
                            getter: async () => {
                                return this.controller.hassAnchorProvider.getAnchor(
                                    HassAnchor.ANCHOR.TOTAL_STATISTICS_TIME
                                ).getValue();
                            },
                            helpText: "This handle returns the total statistics time in seconds"
                        }).also((prop) => {
                            this.controller.withHass((hass => {
                                prop.attachHomeAssistantComponent(
                                    new InLineHassComponent({
                                        hass: hass,
                                        robot: this.robot,
                                        name: this.capability.getType() + "_time",
                                        friendlyName: "Total Statistics Time",
                                        componentType: ComponentType.SENSOR,
                                        autoconf: {
                                            state_topic: prop.getBaseTopic(),
                                            icon: "mdi:equalizer",
                                            entity_category: EntityCategory.DIAGNOSTIC,
                                            unit_of_measurement: Unit.SECONDS
                                        }
                                    })
                                );
                            }));
                        })
                    );
                    break;

                case NoCloudDataPoint.TYPES.AREA:
                    this.registerChild(
                        new PropertyMqttHandle({
                            parent: this,
                            controller: this.controller,
                            topicName: "area",
                            friendlyName: "Total Statistics Area",
                            datatype: DataType.INTEGER,
                            unit: Unit.SQUARE_CENTIMETER,
                            getter: async () => {
                                return this.controller.hassAnchorProvider.getAnchor(
                                    HassAnchor.ANCHOR.TOTAL_STATISTICS_AREA
                                ).getValue();
                            }
                        }).also((prop) => {
                            this.controller.withHass((hass => {
                                prop.attachHomeAssistantComponent(
                                    new InLineHassComponent({
                                        hass: hass,
                                        robot: this.robot,
                                        name: this.capability.getType() + "_area",
                                        friendlyName: "Total Statistics Area",
                                        componentType: ComponentType.SENSOR,
                                        autoconf: {
                                            state_topic: prop.getBaseTopic(),
                                            icon: "mdi:equalizer",
                                            entity_category: EntityCategory.DIAGNOSTIC,
                                            unit_of_measurement: Unit.SQUARE_CENTIMETER
                                        }
                                    })
                                );
                            }));
                        })
                    );
                    break;
                case NoCloudDataPoint.TYPES.COUNT:
                    this.registerChild(
                        new PropertyMqttHandle({
                            parent: this,
                            controller: this.controller,
                            topicName: "count",
                            friendlyName: "Total Statistics Count",
                            datatype: DataType.INTEGER,
                            unit: Unit.AMOUNT,
                            getter: async () => {
                                return this.controller.hassAnchorProvider.getAnchor(
                                    HassAnchor.ANCHOR.TOTAL_STATISTICS_COUNT
                                ).getValue();
                            }
                        }).also((prop) => {
                            this.controller.withHass((hass => {
                                prop.attachHomeAssistantComponent(
                                    new InLineHassComponent({
                                        hass: hass,
                                        robot: this.robot,
                                        name: this.capability.getType() + "_count",
                                        friendlyName: "Total Statistics Count",
                                        componentType: ComponentType.SENSOR,
                                        autoconf: {
                                            state_topic: prop.getBaseTopic(),
                                            icon: "mdi:equalizer",
                                            entity_category: EntityCategory.DIAGNOSTIC
                                        }
                                    })
                                );
                            }));
                        })
                    );
                    break;
            }
        });
    }

    async refresh() {
        const totalStatistics = await this.capability.getStatistics();

        for (const point of totalStatistics) {
            const anchorId = DATA_POINT_TYPE_TO_ANCHOR_ID_MAPPING[point.type];

            if (anchorId) {
                await this.controller.hassAnchorProvider.getAnchor(anchorId).post(point.value);
            } else {
                Logger.warn(`No anchor found for TotalStatistics DataPointType ${point.type}`);
            }
        }

        await super.refresh();
    }
}

const DATA_POINT_TYPE_TO_ANCHOR_ID_MAPPING = {
    [NoCloudDataPoint.TYPES.TIME]: HassAnchor.ANCHOR.TOTAL_STATISTICS_TIME,
    [NoCloudDataPoint.TYPES.AREA]: HassAnchor.ANCHOR.TOTAL_STATISTICS_AREA,
    [NoCloudDataPoint.TYPES.COUNT]: HassAnchor.ANCHOR.TOTAL_STATISTICS_COUNT,
};

TotalStatisticsCapabilityMqttHandle.OPTIONAL = true;

module.exports = TotalStatisticsCapabilityMqttHandle;
