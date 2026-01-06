const entities = require("../../../entities");
const NoCloudSelectionPreset = require("../../../entities/core/NoCloudSelectionPreset");
const OperationModeControlCapability = require("../../../core/capabilities/OperationModeControlCapability");
const stateAttrs = entities.state.attributes;

/**
 * @extends OperationModeControlCapability<import("../MockNoCloudRobot")>
 */
class MockOperationModeControlCapability extends OperationModeControlCapability {
    /**
     * @param {object} options
     * @param {import("../MockNoCloudRobot")} options.robot
     */
    constructor(options) {
        let presets = [
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.MODE.MOP, value: 0}),
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.MODE.VACUUM, value: 1}),
            new NoCloudSelectionPreset({name: entities.state.attributes.PresetSelectionStateAttribute.MODE.VACUUM_AND_MOP, value: 2})
        ];
        super({
            robot: options.robot,
            presets: presets
        });

        this.StateAttr = new stateAttrs.PresetSelectionStateAttribute({
            type: stateAttrs.PresetSelectionStateAttribute.TYPE.OPERATION_MODE,
            value: stateAttrs.PresetSelectionStateAttribute.MODE.VACUUM
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

module.exports = MockOperationModeControlCapability;
