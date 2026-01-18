const Logger = require("./Logger");

/**
 * Handles real-time push notifications for NoCloud events with batching and rate-limiting.
 */
class NoCloudEventPushNotif {
    /**
     * @param {object} options
     * @param {object} options.config
     * @param {import("./PushNotifClient")} options.pushNotifClient
     * @param {import("./NoCloudEventStore")} options.eventStore
     */
    constructor({ pushNotifClient, eventStore, config }) {
        this.config = config;
        this.pushNotifClient = pushNotifClient;
        this.eventStore = eventStore;

        this.inFlightRequests = 0;
        this.shuttingDown = false;
        this.enabled = false; // default false, Push Notifications Connectivity logic
        this.rateLimit = 5;
        this.rateLimitInterval = 60_000;
        this.sentEventsTimestamps = [];
        this.pushEvents = false; // default false, Forward Events or not
        this.processEvents = false; // default false, Process (clear) Events or not

        // Get configuration from UI/config
        this.reconfigure();

        // Hook into event store
        this.eventStore.onEventRaised((event) => this.handleEvent(event));

        // Optional: react to live config changes
        if (this.config.onUpdate) {
            this.config.onUpdate((key) => {
                if (key === "pushNotifClient") {
                    this.reconfigure();
                }
            });
        }
        Logger.debug(
            "NoCloudEventPushNotif initialized with: " +
            `enabled: ${this.enabled}, ` +
            `rate limit: max ${this.rateLimit} events per ${this.rateLimitInterval}ms, ` +
            `pushEvents: ${this.pushEvents}, processEvents: ${this.processEvents}.`
        );
    }
    /**
     * Re-read configuration (enabled, rate limit, rate interval, pushEvents, processEvents, titleID) from the config
     */
    reconfigure() {
        const cfg = this.config.get?.("pushNotifClient") || {};

        this.enabled = cfg.enabled === true;
        this.rateLimit = typeof cfg.rateLimit === "number" ? cfg.rateLimit : 5;
        this.rateLimitInterval = typeof cfg.rateLimitTime === "number" ? cfg.rateLimitTime : 30_000;
        this.pushEvents = cfg.pushEvents === true;
        this.processEvents = cfg.processEvents === true;
        this.titleID = cfg.titleID;

        Logger.debug(
            "NoCloudEventPushNotif reconfigured: " +
            `enabled: ${this.enabled}, ` +
            `rate limit: max ${this.rateLimit} events per ${this.rateLimitInterval}ms, ` +
            `pushEvents: ${this.pushEvents}, processEvents: ${this.processEvents}.`
        );
    }
    /**
     * Check if we're within the rate limit
     */
    canSend() {
        const now = Date.now();
        // Remove timestamps older than the interval
        this.sentEventsTimestamps = this.sentEventsTimestamps.filter(ts => now - ts < this.rateLimitInterval);
        return this.sentEventsTimestamps.length < this.rateLimit;
    }
    /**
     * Safely extract the title from an event
     * @param {object} event
     * @private
     */
    getEventTitle(event) {
        return event.__class || event.type || "Event";
    }
    /**
     * Safely extract the message from an event
     * @param {object} event
     * @private
     */
    getEventMessage(event) {
        if (typeof event.message === "string") {
            return event.message;
        }
        if (event.metaData?.message) {
            return String(event.metaData.message);
        }
        return "No message";
    }
    /**
     * Handle a single new event
     * @param {import("./NoCloud_events/events/NoCloudEvent")} event
     */
    async handleEvent(event) {
        if (this.shuttingDown) {
            return;
        }
        if (!this.enabled) {
            Logger.debug("Push Notifications Connectivity is disabled, skipping event:", event.id);
            return;
        }
        if (!this.pushEvents) {
            Logger.debug("NoCloudEventPushNotif is disabled, skipping event:", event.id);
            return;
        }
        if (event.processed) {
            Logger.debug("NoCloudEventPushNotif: eventID: ", event.id, " already processed");
            return;
        }
        if (!this.canSend()) {
            Logger.warn("NoCloudEventPushNotif: rate limit reached, skipping event: ", event.id);
            return;
        }
        // Gather unprocessed events for a batch notification
        const eventsToSend = this.eventStore.getAll().filter(e => !e.processed);

        if (eventsToSend.length === 0) {
            return;
        }
        // Group events by title and message to avoid duplicates - reduce usage of Push Notification service
        const grouped = eventsToSend.reduce((acc, e) => {
            const title = this.getEventTitle(e);
            const message = this.getEventMessage(e);

            const key = JSON.stringify([title, message]);
            if (!acc[key]) {
                acc[key] = { title: title, message: message, count: 0 };
            }
            acc[key].count += 1;
            return acc;
        }, Object.create(null));
        const notificationLines = Object.values(grouped).map(({ title, message, count }) => {
            return count > 1 ?
                `[${title}]: ${message} (x${count})` :
                `[${title}]: ${message}`;
        });
        const payload = {
            title: `${this.titleID} Events (${eventsToSend.length})`,
            message: notificationLines.join("\n"),
        };
        this.inFlightRequests += 1;

        try {
            await this.pushNotifClient.send(payload);
            // Mark events as processed after successfully sending, if Processing (clearing) Events is enabled
            if (this.processEvents) {
                for (const e of eventsToSend) {
                    this.eventStore.setProcessed(e.id);
                }
            }
            // Track timestamp for rate limiting
            this.sentEventsTimestamps.push(Date.now());
        } catch (err) {
            Logger.warn("NoCloudEventPushNotif: Failed to send notification:", err);
        } finally {
            this.inFlightRequests -= 1;
        }
    }
    /**
     * Shutdown gracefully
     *
     * @public
     * @returns {Promise<void>}
     */
    async shutdown() {
        Logger.debug("NoCloudEventPushNotif: shutdown in progress...");
        this.shuttingDown = true;

        const startTime = Date.now();
        const SHUTDOWN_TIMEOUT = 5000; // 5 seconds

        return new Promise((resolve) => {
            const check = () => {
                if (this.inFlightRequests === 0) {
                    Logger.debug("NoCloudEventPushNotif: shutdown done");
                    return resolve();
                }
                if (Date.now() - startTime > SHUTDOWN_TIMEOUT) {
                    Logger.warn("NoCloudEventPushNotif: shutdown timed out with ", this.inFlightRequests," in-flight requests",);
                    return resolve();
                }
                setTimeout(check, 100);
            };
            check();
        });
    }
}

module.exports = NoCloudEventPushNotif;
