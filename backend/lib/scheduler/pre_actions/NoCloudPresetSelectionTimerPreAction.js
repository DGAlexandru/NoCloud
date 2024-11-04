const NoCloudTimerPreAction = require("./NoCloudTimerPreAction");

class NoCloudPresetSelectionTimerPreAction extends NoCloudTimerPreAction {
    /**
     * @param {object} options
     * @param {import("../../core/NoCloudRobot")} options.robot
     * @param {string} options.capability_type
     * @param {string} options.value
     */
    constructor(options) {
        super(options);

        this.capability_type = options.capability_type;
        this.value = options.value;
    }

    async run() {
        if (this.value === undefined) {
            throw new Error("Missing value");
        }

        if (!this.robot.hasCapability(this.capability_type)) {
            throw new Error(`Robot is missing the ${this.capability_type}`);
        } else {
            return this.robot.capabilities[this.capability_type].selectPreset(this.value);
        }
    }
}

module.exports = NoCloudPresetSelectionTimerPreAction;
