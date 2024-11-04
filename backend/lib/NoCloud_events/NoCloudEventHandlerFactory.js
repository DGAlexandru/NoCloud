const events = require("./events");
const handlers = require("./handlers");

class NoCloudEventHandlerFactory {
    /**
     * @param {object} options
     * @param {import("../core/NoCloudRobot")} options.robot
     */
    constructor(options) {
        this.robot = options.robot;
    }

    /**
     *
     * @param {import("./events/NoCloudEvent")} event
     * @returns {import("./handlers/NoCloudEventHandler") | undefined}
     */
    getHandlerForEvent(event) {
        if (event instanceof events.DismissibleNoCloudEvent) {
            return new handlers.DismissibleNoCloudEventHandler({
                robot: this.robot,
                event: event
            });
        } else if (event instanceof events.ConsumableDepletedNoCloudEvent) {
            return new handlers.ConsumableDepletedNoCloudEventHandler({
                robot: this.robot,
                event: event
            });
        } else if (event instanceof events.PendingMapChangeNoCloudEvent) {
            return new handlers.PendingMapChangeNoCloudEventHandler({
                robot: this.robot,
                event: event
            });
        }

        return undefined; // Explicit to make eslint happy
    }
}

module.exports = NoCloudEventHandlerFactory;
