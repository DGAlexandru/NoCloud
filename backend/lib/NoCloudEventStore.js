const EventEmitter = require("events").EventEmitter;

class NoCloudEventStore {
    /**
     *
     * @param {object} options
     */
    constructor(options) {
        /** @private */
        this.eventEmitter = new EventEmitter();

        this.events = new Map();
    }

    /**
     *
     * @param {import("./NoCloud_events/NoCloudEventHandlerFactory")} factory
     */
    setEventHandlerFactory(factory) {
        this.eventHandlerFactory = factory;
    }

    /**
     * @public
     *
     * @param {string} id
     * @returns {import("./NoCloud_events/events/NoCloudEvent")}
     */
    getById(id) {
        // noinspection JSValidateTypes
        return this.events.get(id);
    }

    /**
     * @public
     * @returns {Array<import("./NoCloud_events/events/NoCloudEvent")>}
     */
    getAll() {
        // noinspection JSValidateTypes
        return Array.from(this.events.values()).reverse();
    }

    /**
     * @public
     * @param {import("./NoCloud_events/events/NoCloudEvent")} event
     */
    raise(event) {
        if (!this.events.has(event.id)) {
            if (this.events.size >= LIMIT) {
                this.events.delete(this.events.keys().next()?.value);
            }
        }

        this.events.set(event.id, event);
        this.eventEmitter.emit(EVENT_RAISED, event);
        this.eventEmitter.emit(EVENTS_UPDATED, event);
    }

    /**
     * Sometimes, events might stop being relevant due to external circumstances
     * In these situations, this can be called to set them processed without an interaction
     *
     * @public
     * @param {string} event_id
     * @return {void}
     */
    setProcessed(event_id) {
        const event = this.getById(event_id);

        if (!event) {
            throw new Error("No such Event");
        }

        if (event.processed === true) {
            return;
        }

        event.processed = true;
        //Even though this isn't required as we're interfacing with it by reference. Just for good measure
        this.events.set(event.id, event);
        this.eventEmitter.emit(EVENTS_UPDATED, event);
    }

    /**
     * @param {*} listener
     * @public
     */
    onEventRaised(listener) {
        this.eventEmitter.on(EVENT_RAISED, listener);
    }

    /**
     * @param {*} listener
     * @public
     */
    onEventsUpdated(listener) {
        this.eventEmitter.on(EVENTS_UPDATED, listener);
    }

    /**
     * @param {import("./NoCloud_events/events/NoCloudEvent")} event
     * @param {import("./NoCloud_events/handlers/NoCloudEventHandler").INTERACTIONS} interaction
     */
    async interact(event, interaction) {
        if (!this.eventHandlerFactory) {
            throw new Error("Missing Event handler Factory");
        }

        if (event.processed === true) {
            throw new Error("Event is already processed");
        }

        const handler = this.eventHandlerFactory.getHandlerForEvent(event);

        if (handler) {
            const result = await handler.interact(interaction);

            if (result === true) {
                this.setProcessed(event.id);
            }
        } else {
            throw new Error("Missing Handler for Event: " + event.__class);
        }
    }

}

const LIMIT = 50;
const EVENT_RAISED = "event_raised";
const EVENTS_UPDATED = "events_updated";

module.exports = NoCloudEventStore;
