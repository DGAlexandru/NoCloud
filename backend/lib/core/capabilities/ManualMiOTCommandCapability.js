const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

/**
 * Capability for sending manual MIoT commands to a robot.
 *
 * This capability exposes a generic interface for interacting with
 * MIoT properties and actions (via siid / piid / value), but does not
 * implement any robot-specific logic itself.
 *
 * Robot- or firmware-specific behavior is expected to be implemented
 * later, either by subclassing this capability or by injecting helpers.
 *
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class ManualMIoTCommandCapability extends Capability {
    /**
     *
     * @param {object} options
     * @param {T} options.robot
     * @param {string[]} [options.supportedManualMIoTCommandActions]
     */
    constructor(options) {
        super(options);

        this.supportedManualMIoTCommandActions = options.supportedManualMIoTCommandActions ?? [];
    }

    /**
     * Execute a manual MIoT command.
     *
     * This method is invoked by:
     * PUT /robot/capabilities/ManualMIoTCommandCapability
     *
     * @abstract
     * @param {object} interaction
     * @param {string} interaction.miotcmd
     *        The MIoT command (e.g. "get_properties").
     * @param {string} interaction.siid
     *        Service Instance ID.
     * @param {string} interaction.piid
     *        Property or Action Instance ID
     * @param {string=} interaction.value
     *        Optional value for action commands, required for write/update/set commands.
     *
     * @returns {Promise<*>}
     */
    async interact(interaction) {
        throw new NotImplementedError(
            "ManualMIoTCommand interaction not implemented"
        );
    }

    /**
     * Return static properties describing this capability.
     *
     * This method is invoked by:
     * GET /robot/capabilities/ManualMIoTCommandCapability/properties
     *
     * It is used by the frontend to populate dropdowns and UI options.
     *
     * @returns {object}
     */
    getProperties() {
        return {
            supportedManualMIoTCommandActions: this.supportedManualMIoTCommandActions,
        };
    }

    /**
     * Return the current runtime state of the capability.
     *
     * This method is invoked by:
     * GET /robot/capabilities/ManualMIoTCommandCapability
     *
     * The frontend currently does not depend on this state, but the
     * endpoint exists for future use (e.g. availability, busy state).
     *
     * @returns {Promise<object>}
     */
    async getState() {
        return {
            available: true,
        };
    }

    /**
     * Return the capability type identifier.
     *
     * @returns {string}
     */
    getType() {
        return ManualMIoTCommandCapability.TYPE;
    }
}

/**
 * Capability type identifier.
 */
ManualMIoTCommandCapability.TYPE = "ManualMIoTCommandCapability";

/**
 * Supported manual MIoT command identifiers.
 *
 * These values are exposed to the frontend and may be extended
 * dynamically depending on robot or firmware capabilities.
 *
 * @typedef {string} NoCloudManualMIoTCommandActions
 * @enum {string}
 */
ManualMIoTCommandCapability.ACTIONS = Object.freeze({
    GET_PROPERTIES: "get_properties",
    SET_PROPERTIES: "set_properties",
    ACTION: "action",
});

module.exports = ManualMIoTCommandCapability;
