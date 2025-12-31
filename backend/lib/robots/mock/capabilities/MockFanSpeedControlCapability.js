const entities = require("../../../entities");
const FanSpeedControlCapability = require("../../../core/capabilities/FanSpeedControlCapability");
const NoCloudSelectionPreset = require("../../../entities/core/NoCloudSelectionPreset");
const stateAttrs = entities.state.attributes;

/**
 * @extends FanSpeedControlCapability<import("../MockNoCloudRobot")>
 */
class MockFanSpeedControlCapability extends FanSpeedControlCapability {
    /**
     * @param {object} options
     * @param {import("../MockNoCloudRobot")} options.robot
     */
    constructor(options) {
        let presets = [
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.OFF, value: 0}),
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MIN, value: 1}),
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.LOW, value: 2}),
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MEDIUM, value: 3}),
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.HIGH, value: 4}),
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.TURBO, value: 5}),
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MAX, value: 6})
        ];
        super({
            robot: options.robot,
            presets: presets
        });

        this.StateAttr = new stateAttrs.PresetSelectionStateAttribute({
            type: stateAttrs.PresetSelectionStateAttribute.TYPE.FAN_SPEED,
            value: stateAttrs.PresetSelectionStateAttribute.INTENSITY.MEDIUM
        });

        this.robot.state.upsertFirstMatchingAttribute(this.StateAttr);
    }

    /**
     * @param {string} preset
     * @returns {Promise<void>}
     */
    async selectPreset(preset) {
        const matchedPreset = this.presets.find(p => {
            return p.name === preset;
        });

        if (matchedPreset) {
            this.StateAttr.value = matchedPreset.name;
        } else {
            throw new Error("Invalid Preset");
        }
    }
}

module.exports = MockFanSpeedControlCapability;
