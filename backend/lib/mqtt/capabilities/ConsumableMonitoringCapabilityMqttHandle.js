const CapabilityMqttHandle = require("./CapabilityMqttHandle");

const Commands = require("../common/Commands");
const ComponentType = require("../homeassistant/ComponentType");
const DataType = require("../homie/DataType");
const DeviceClass = require("../homeassistant/DeviceClass");
const EntityCategory = require("../homeassistant/EntityCategory");
const HassAnchor = require("../homeassistant/HassAnchor");
const InLineHassComponent = require("../homeassistant/components/InLineHassComponent");
const NoCloudConsumable = require("../../entities/core/NoCloudConsumable");
const PropertyMqttHandle = require("../handles/PropertyMqttHandle");
const StateClass = require("../homeassistant/StateClass");
const Unit = require("../common/Unit");

class ConsumableMonitoringCapabilityMqttHandle extends CapabilityMqttHandle {
    /**
     * @param {object} options
     * @param {import("../handles/RobotMqttHandle")} options.parent
     * @param {import("../MqttController")} options.controller MqttController instance
     * @param {import("../../core/NoCloudRobot")} options.robot
     * @param {import("../../core/capabilities/ConsumableMonitoringCapability")} options.capability
     */
    constructor(options) {
        super(Object.assign(options, {
            friendlyName: "Consumables monitoring",
            helpMayChange: {
                "Properties": "Consumables depend on the robot model.",
                "Property datatype and units": "Some robots send consumables as remaining time, others send them as " +
                    "endurance percent remaining.",
            }
        }));
        this.capability = options.capability;
        /* @type {Array<import("../../entities/core/NoCloudConsumable")>} */
        this.consumables = [];

        this.capability.getProperties().availableConsumables.forEach(consumable => {
            this.addNewConsumable(
                this.genConsumableTopicId(consumable.type, consumable.subType),
                consumable.type,
                consumable.subType,
                consumable.unit
            );
        });
    }

    /**
     * @private
     * @param {import("../../entities/core/NoCloudConsumable").TYPE} type
     * @param {import("../../entities/core/NoCloudConsumable").SUB_TYPE} subType
     * @return {string}
     */
    genConsumableTopicId(type, subType) {
        let name = type;
        if (subType !== NoCloudConsumable.SUB_TYPE.NONE) {
            name += "-" + subType;
        }
        return name;
    }

    /**
     * @private
     * @param {import("../../entities/core/NoCloudConsumable").TYPE} type
     * @param {import("../../entities/core/NoCloudConsumable").SUB_TYPE} subType
     * @return {string}
     */
    genConsumableFriendlyName(type, subType) {
        let name = "";
        if (subType !== NoCloudConsumable.SUB_TYPE.NONE && subType !== NoCloudConsumable.SUB_TYPE.ALL) {
            name += SUBTYPE_MAPPING[subType] + " ";
        }
        name += TYPE_MAPPING[type];
        return name;
    }

    /**
     * @private
     * @param {string} topicId
     * @param {import("../../entities/core/NoCloudConsumable").TYPE} type
     * @param {import("../../entities/core/NoCloudConsumable").SUB_TYPE} subType
     * @param {import("../../entities/core/NoCloudConsumable").UNITS} unit
     * @return {void}
     */
    addNewConsumable(topicId, type, subType, unit) {
        this.registerChild(
            new PropertyMqttHandle({
                parent: this,
                controller: this.controller,
                topicName: topicId,
                friendlyName: this.genConsumableFriendlyName(type, subType),
                datatype: DataType.INTEGER,
                unit: unit === NoCloudConsumable.UNITS.PERCENT ? Unit.PERCENT : undefined,
                format: unit === NoCloudConsumable.UNITS.PERCENT ? "0:100" : undefined,
                getter: async () => {
                    const consumable = this.consumables.find(c => c.type === type && c.subType === subType);

                    if (consumable) {
                        // Raw value for Home Assistant
                        await this.controller.hassAnchorProvider.getAnchor(
                            HassAnchor.ANCHOR.CONSUMABLE_VALUE + topicId
                        ).post(consumable.remaining.value);

                        // Convert value to seconds for Homie
                        return consumable.remaining.value * (unit === NoCloudConsumable.UNITS.PERCENT ? 1 : 60);
                    }

                    return null;
                },
                helpText: unit === NoCloudConsumable.UNITS.PERCENT ?
                    "This handle returns the consumable remaining endurance percentage." :
                    "This handle returns the consumable remaining endurance time as an int representing seconds remaining."
            }).also((prop) => {
                this.controller.withHass((hass) => {
                    prop.attachHomeAssistantComponent(
                        new InLineHassComponent({
                            hass: hass,
                            robot: this.robot,
                            name: `${this.capability.getType()}_${topicId.replace("-", "_")}`,
                            friendlyName: this.genConsumableFriendlyName(type, subType),
                            componentType: ComponentType.SENSOR,
                            baseTopicReference: this.controller.hassAnchorProvider.getTopicReference(
                                HassAnchor.REFERENCE.HASS_CONSUMABLE_STATE + topicId
                            ),
                            autoconf: {
                                state_topic: this.controller.hassAnchorProvider.getTopicReference(
                                    HassAnchor.REFERENCE.HASS_CONSUMABLE_STATE + topicId
                                ),
                                unit_of_measurement: unit === NoCloudConsumable.UNITS.PERCENT ? Unit.PERCENT : Unit.MINUTES,
                                icon: "mdi:progress-wrench",
                                entity_category: EntityCategory.DIAGNOSTIC,
                                state_class: StateClass.MEASUREMENT,
                                device_class: unit === NoCloudConsumable.UNITS.MINUTES ? DeviceClass.DURATION : undefined
                            },
                            topics: {
                                "": this.controller.hassAnchorProvider.getAnchor(
                                    HassAnchor.ANCHOR.CONSUMABLE_VALUE + topicId
                                )
                            }
                        })
                    );
                });
            })
        );

        this.registerChild(
            new PropertyMqttHandle({
                parent: this,
                controller: this.controller,
                topicName: `${topicId}/reset`,
                friendlyName: "Reset the consumable",
                datatype: DataType.ENUM,
                format: Commands.BASIC.PERFORM,
                setter: async (value) => {
                    await this.capability.resetConsumable(type, subType);
                    await this.updateInternalState(); // FIXME: this should also republish the state of the other child
                }
            }).also((prop) => {
                this.controller.withHass((hass) => {
                    prop.attachHomeAssistantComponent(
                        new InLineHassComponent({
                            hass: hass,
                            robot: this.robot,
                            name: `${this.capability.getType()}_${topicId.replace("-", "_")}_reset`,
                            friendlyName: `Reset ${this.genConsumableFriendlyName(type, subType)} Consumable`,
                            componentType: ComponentType.BUTTON,
                            autoconf: {
                                command_topic: `${prop.getBaseTopic()}/set`,
                                payload_press: Commands.BASIC.PERFORM,
                                icon: "mdi:restore",
                                entity_category: EntityCategory.DIAGNOSTIC
                            }
                        })
                    );
                });
            })
        );
    }

    async refresh() {
        await this.updateInternalState();
        await super.refresh();
    }

    async updateInternalState() {
        let newConsumables;
        try {
            newConsumables = await this.capability.getConsumables();
            this.consumables = newConsumables;
        } catch (e) {
            /* intentional */
        }
    }
}

const TYPE_MAPPING = Object.freeze({
    [NoCloudConsumable.TYPE.BRUSH]: "Brush",
    [NoCloudConsumable.TYPE.FILTER]: "Filter",
    [NoCloudConsumable.TYPE.CLEANING]: "Cleaning",
    [NoCloudConsumable.TYPE.MOP]: "Mop",
    [NoCloudConsumable.TYPE.DETERGENT]: "Detergent",
    [NoCloudConsumable.TYPE.BIN]: "Bin",
});

const SUBTYPE_MAPPING = Object.freeze({
    [NoCloudConsumable.SUB_TYPE.MAIN]: "Main",
    [NoCloudConsumable.SUB_TYPE.SECONDARY]: "Secondary",
    [NoCloudConsumable.SUB_TYPE.SIDE_RIGHT]: "Right",
    [NoCloudConsumable.SUB_TYPE.SIDE_LEFT]: "Left",
    [NoCloudConsumable.SUB_TYPE.ALL]: "",
    [NoCloudConsumable.SUB_TYPE.NONE]: "",
    [NoCloudConsumable.SUB_TYPE.DOCK]: "Dock",
    [NoCloudConsumable.SUB_TYPE.SENSOR]: "Sensor",
    [NoCloudConsumable.SUB_TYPE.WHEEL]: "Wheel",
});

ConsumableMonitoringCapabilityMqttHandle.OPTIONAL = true;

module.exports = ConsumableMonitoringCapabilityMqttHandle;
