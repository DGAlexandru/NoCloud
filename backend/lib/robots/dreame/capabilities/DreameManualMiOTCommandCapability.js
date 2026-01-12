const DreameMiotHelper = require("../DreameMiotHelper");
const ManualMIoTCommandCapability = require("../../../core/capabilities/ManualMIoTCommandCapability");

/**
 * @extends ManualMIoTCommandCapability<import("../DreameGen2NoCloudRobot")>
 */
class DreameManualMIoTCommandCapability extends ManualMIoTCommandCapability {
    /**
     *
     * @param {object} options
     * @param {import("../DreameGen2NoCloudRobot")} options.robot
     * @param {string[]} [options.supportedManualMIoTCommandActions] - Optional list of supported commands, defaults to ["get_properties", "set_properties", "action"]
     */
    constructor(options) {
        super(Object.assign({}, options, {
            // If not provided, default to the 3 main MIOT commands
            supportedManualMIoTCommandActions: options.supportedManualMIoTCommandActions ?? [
                ManualMIoTCommandCapability.ACTIONS.GET_PROPERTIES,
                ManualMIoTCommandCapability.ACTIONS.SET_PROPERTIES,
                ManualMIoTCommandCapability.ACTIONS.ACTION,
            ]
        }));

        /**
         * Helper for sending MIoT commands
         * @type {DreameMiotHelper}
         */
        this.helper = new DreameMiotHelper({ robot: this.robot });
    }

    /**
     * Convert a string or number to a numeric ID for DreameMiotHelper
     *
     * @param {string | number} id
     * @returns {number}
     */
    convertId(id) {
        const n = Number(id);
        if (Number.isNaN(n)) { throw new Error(`Invalid numeric ID: ${id}`); }
        return n;
    }

    /**
     * Execute a manual MIOT command by sending it through DreameMiotHelper
     *
     * @param {object} interaction
     * @param {string} interaction.miotcmd - The MIoT command  (get_properties, set_properties, action)
     * @param {string | number} interaction.siid - Service ID
     * @param {string | number} interaction.piid - Property or Action ID
     * @param {string | number} [interaction.value] - Optional value for set/action commands
     * @returns {Promise<void>}}
     */
    //@param {import("../../../core/capabilities/ManualMIoTCommandCapability").NoCloudManualMIoTCommandInteraction} interaction
    async interact(interaction) {
        const { miotcmd, siid, piid, value = undefined } = interaction;
        // Convert siid/piid to numbers
        const siidNum = this.convertId(siid);
        const piidNum = this.convertId(piid);

        // Validate ranges
        if (siidNum < 1 || siidNum > 99999) {
            throw new Error(`siid must be a number between 1 and 99999. Got "${siid}"`);
        }
        if (piidNum < 1 || piidNum > 9999) {
            throw new Error(`piid/aiid must be a number between 1 and 9999. Got "${piid}"`);
        }
        switch (miotcmd) {
            case ManualMIoTCommandCapability.ACTIONS.GET_PROPERTIES:
                // return the property value
                return await this.helper.readProperty(siidNum, piidNum);
            case ManualMIoTCommandCapability.ACTIONS.SET_PROPERTIES: {
                // write/update property value
                if (value === undefined) {
                    throw new Error("Value is required for set_properties command");
                }
                const valueNum = !isNaN(Number(value)) ? Number(value) : value;
                return await this.helper.writeProperty(siidNum, piidNum, valueNum);
            }
            case ManualMIoTCommandCapability.ACTIONS.ACTION:
                // execute an action
                return await this.helper.executeAction(siidNum, piidNum, value !== undefined ? [value] : []);
            default:
                throw new Error(`Unsupported MIoT command: ${miotcmd}`);
        }
    }

    /**
     * Returns static properties of this capability
     *
     * @returns {{ supportedManualMIoTCommandActions: string[] }}
     */
    getProperties() {
        return {
            supportedManualMIoTCommandActions: this.supportedManualMIoTCommandActions
        };
    }
}

module.exports = DreameManualMIoTCommandCapability;
