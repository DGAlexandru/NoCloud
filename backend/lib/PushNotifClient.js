const https = require("https");
const Logger = require("./Logger");
const querystring = require("querystring");
const States = require("./entities/core/pushNotifClient");

class PushNotifClient {
    /**
     * @param {object} options
     * @param {import("./Configuration")} options.config
     */
    constructor(options) {
        this.config = options.config;

        this.enabled = false;
        this.shuttingDown = false;
        this.inFlightRequests = 0;
        this.state = new States.NoCloudPushNotifClientDisabledState({});

        this.config.onUpdate((key) => {
            if (key === "pushNotifClient") {
                Logger.debug("PushNotifClient configuration updated.");
                this.reconfigure();
            }
        });
        this.reconfigure();
    }
    /**
     * (Re)Configure PushNotif using the current configuration.
     */
    reconfigure() {
        const pushNotifConfig = this.config.get("pushNotifClient");

        // Show the PushNotifClient configuration when debugging to ensure it's loaded properly
        Logger.debug("PushNotifClient configuration:", pushNotifConfig);

        this.enabled = pushNotifConfig.enabled === true;

        this.state = this.enabled ? new States.NoCloudPushNotifClientEnabledState({}) : new States.NoCloudPushNotifClientDisabledState({});

        Logger.debug(`PushNotifClient ${this.enabled ? "enabled" : "disabled"}`);
    }
    /**
     * Send a PushNotif message
     *
     * @param {object} params
     * @param {string} params.message - Message body (required)
     * @param {string} [params.title] - Notification title
     * @param {string} [params.sound] - Notification sound
     * @param {number} [params.priority=0] - Notification priority (-2..2)
     * @param {number} [params.retry] - Required for Emergency (priority = 2, seconds)
     * @param {number} [params.expire] - Required for Emergency (priority = 2, seconds)
     *
     * @returns {Promise<void>}
     */
    async send({ message, title, sound, priority = 0, retry, expire }) {
        if (this.shuttingDown) {
            Logger.warn("PushNotifClient.send() called during shutdown");
            return;
        }
        if (!this.enabled) {
            Logger.debug("PushNotifClient.send() called while disabled");
            return;
        }
        if (!message || typeof message !== "string") {
            throw new Error("PushNotifClient.send(): 'message' is required");
        }
        const pushNotifConfig = this.config.get("pushNotifClient");

        // Ensure the required config values are present
        if (!pushNotifConfig || !pushNotifConfig.token || !pushNotifConfig.user) {
            Logger.warn("PushNotif: Missing required configuration", pushNotifConfig); // to have the needed details in Log
            throw new Error("PushNotif: Missing configuration: 'token' and 'user' values are required");
        }
        // Prepare the payload for the Pushover API
        const payload = {
            token: pushNotifConfig.token,
            user: pushNotifConfig.user,
            message: message
        };
        if (title) {
            payload.title = title;
        }
        if (sound) {
            payload.sound = sound;
        } else if (pushNotifConfig.sound) {
            payload.sound = pushNotifConfig.sound;
        }
        if (priority) {
            payload.priority = priority;
            // Emergency priority handling
            if (priority === 2) {
                if (typeof retry !== "number" || typeof expire !== "number") {
                    throw new Error("PushNotif: priority 2 (Emergency) requires 'retry' and 'expire' values to be defined!");
                }
                payload.retry = retry;
                payload.expire = expire;
            }
        } else if (pushNotifConfig.priority) {
            payload.priority = pushNotifConfig.priority;
            if (payload.priority === 2) {
                payload.retry = pushNotifConfig.retry;
                payload.expire = pushNotifConfig.expire;
            }
        }
        const postData = querystring.stringify(payload); // format it for application/x-www-form-urlencoded

        const requestOptions = {
            hostname: pushNotifConfig.server,
            port: pushNotifConfig.port,
            path: pushNotifConfig.path,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData)
            },
            timeout: 10_000
        };
        Logger.debug("PushNotif: Sending notification", {
            title: title,
            message: message,
            sound: sound,
            priority: priority
        });
        this.inFlightRequests += 1;

        return new Promise((resolve, reject) => {
            let finished = false;

            const finalize = () => {
                if (!finished) {
                    finished = true;
                    this.inFlightRequests -= 1;
                }
            };
            const handleError = (err) => {
                // Map the error to a type the frontend expects
                let type = "unknown";
                let msg = err.message || "Unknown error";

                if (typeof err.code === "string") {
                    switch (err.code) {
                        case "EAI_AGAIN":
                        case "ENETUNREACH":
                        case "ENETDOWN":
                        case "EAGAIN":
                        case "ECONNABORTED":
                        case "ECONNRESET":
                        case "EPIPE":
                            type = "transient";
                            break;
                        case "ENOTFOUND":
                            type = "name_resolution";
                            break;
                    }
                } else if (msg.toLowerCase().includes("timeout")) {
                    type = "connection";
                } else if (err.stdout !== undefined) {
                    type = "persisting";
                    msg = `${err.stdout.toString()} ${err.stderr.toString()}`;
                }
                this.state = new States.NoCloudPushNotifClientErrorState({ type: type, message: msg });

                if (type === "transient") {
                    Logger.warn(`PushNotif transient error: ${msg}`);
                } else {
                    Logger.warn(`PushNotif error (${type}): ${msg}`);
                }
            };

            try {
                const req = https.request(requestOptions, (res) => {
                    let responseBody = "";

                    res.on("data", (chunk) => {
                        responseBody += chunk;
                    });
                    res.on("end", () => {
                        try {
                            let parsed;

                            try {
                                parsed = JSON.parse(responseBody);
                            } catch (e) {
                                const parseError = new Error(`PushNotif: Invalid JSON response from ${pushNotifConfig.server}`);
                                handleError(parseError);
                                reject(parseError);
                                return;
                            }
                            if (res.statusCode !== 200 || parsed.status !== 1) {
                                const apiError = new Error(
                                    `PushNotif: ${pushNotifConfig.server} error: ${parsed.errors ? parsed.errors.join(", ") : "Unmentioned error"}`
                                );
                                handleError(apiError);
                                reject(apiError);
                                return;
                            }
                            Logger.debug(`PushNotif: Notification sent successfully using ${pushNotifConfig.server}`, {
                                requestId: parsed.request
                            });
                            // Update state to synced with last message details
                            this.state = new States.NoCloudPushNotifClientSyncedState({
                                lastMessage: message,
                                lastTitle: title || null,
                                lastPriority: priority
                            });
                            resolve();
                        } catch (err) {
                            handleError(err);
                            reject(err);
                        } finally {
                            finalize();
                        }
                    });
                });
                req.on("error", (err) => {
                    handleError(err);
                    finalize();
                    reject(err);
                });
                req.on("timeout", () => {
                    const timeoutError = new Error(`PushNotif: connection with ${pushNotifConfig.server} timed out`);
                    handleError(timeoutError);
                    req.destroy();
                    finalize();
                    reject(timeoutError);
                });
                req.write(postData);
                req.end();
            } catch (err) {
                handleError(err);
                finalize();
                reject(err);
            }
        });
    }

    /**
     * Shutdown PushNotifClient
     *
     * @public
     * @returns {Promise<void>}
     */
    shutdown() {
        Logger.debug("PushNotifClient shutdown in progress...");
        this.shuttingDown = true;

        const startTime = Date.now();
        const SHUTDOWN_TIMEOUT = 5000; // 5 seconds

        return new Promise((resolve) => {
            const check = () => {
                if (this.inFlightRequests === 0) {
                    Logger.debug("PushNotifClient shutdown done");
                    return resolve();
                }
                if (Date.now() - startTime > SHUTDOWN_TIMEOUT) {
                    Logger.warn("PushNotifClient shutdown timed out with ", this.inFlightRequests, " in-flight requests");
                    return resolve();
                }
                setTimeout(check, 100);
            };
            check();
        });
    }
}

module.exports = PushNotifClient;
