const NotImplementedError = require("../../core/NotImplementedError");

class NoCloudEventHandler {
    /**
     * @param {object} options
     * @param {import("../../core/NoCloudRobot")} options.robot
     * @param {import("../events/NoCloudEvent")} options.event
     */
    constructor(options) {
        this.robot = options.robot;
        this.event = options.event;
    }

    /**
     * @abstract
     * @param {NoCloudEventInteraction} interaction
     * @returns {Promise<boolean>} True if the Event should be set to processed
     */
    async interact(interaction) {
        throw new NotImplementedError();
    }
}

/**
 *
 *  Inspired by Winforms
 *  https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.dialogresult
 *
 *  @typedef {string} NoCloudEventInteraction
 *  @enum {string}
 *
 */
NoCloudEventHandler.INTERACTIONS = Object.freeze({
    OK: "ok",
    YES: "yes",
    NO: "no",
    RESET: "reset"
});

module.exports = NoCloudEventHandler;
