const express = require("express");
const Logger = require("../Logger");

class PushNotifClientRouter {
    /**
     *
     * @param {object} options
     * @param {import("../PushNotifClient")} options.pushNotifClient
     * @param {import("../Configuration")} options.config
     * @param {*} options.validator
     */
    constructor(options) {
        this.router = express.Router({ mergeParams: true });

        this.config = options.config;
        this.pushNotifClient = options.pushNotifClient;
        this.validator = options.validator;

        this.initRoutes();
    }

    initRoutes() {
        // Status Route
        this.router.get("/status", (req, res) => {
            // The state is already a class instance with timestamp, lastMessage, etc.
            res.json({
                state: this.pushNotifClient.state,
                robotTime: new Date().toISOString()
            });
        });

        // Get configuration Route
        this.router.get("/config", (req, res) => {
            res.json(this.config.get("pushNotifClient"));
        });

        // Update configuration Route
        this.router.put("/config", this.validator, (req, res) => {
            const { enabled, server, path, port, token, user, sound, priority, rateLimit, rateLimitTime, pushEvents, processEvents } = req.body;

            // Validate parameters and alert if any are missing or incorrect
            if (typeof enabled !== "boolean") {
                return res.status(400).send({ error: "Invalid value for 'enabled' (expecting a boolean)" });
            }

            if (typeof server !== "string" || !server.trim()) {
                return res.status(400).send({ error: "Invalid or missing 'server' value (expecting a non-empty string)" });
            }

            if (typeof path !== "string") {
                return res.status(400).send({ error: "Invalid value for 'path' (expecting a string)" });
            }

            if (typeof port !== "number" || port < 1 || port > 65535) {
                return res.status(400).send({ error: "Invalid value for 'port' (expecting a number between 1 and 65535)" });
            }

            if (typeof token !== "string" || !token.trim()) {
                return res.status(400).send({ error: "Invalid or missing 'token' value (expecting a non-empty string)" });
            }

            if (typeof user !== "string" || !user.trim()) {
                return res.status(400).send({ error: "Invalid or missing 'user' value (expecting be a non-empty string)" });
            }

            if (typeof sound !== "string") {
                return res.status(400).send({ error: "Invalid value for 'sound' (expecting be a string)" });
            }

            if (typeof priority !== "number" || priority < -2 || priority > 2) {
                return res.status(400).send({ error: "Invalid value for 'priority' (expecting a number between -2 and 2)" });
            }

            if (typeof rateLimit !== "number" || rateLimit < 1 || rateLimit > 20) {
                return res.status(400).send({ error: "Invalid value for 'rateLimit' (expecting a number between 1 and 20)" });
            }

            if (typeof rateLimitTime !== "number" || rateLimitTime < 1 || rateLimitTime > 5*60_000) {
                return res.status(400).send({ error: "Invalid value for 'rateLimitTime' (expecting a number between 1 and 5x60_000'; milliseconds)" });
            }

            if (typeof pushEvents !== "boolean") {
                return res.status(400).send({ error: "Invalid value for 'pushEvents' (expecting a boolean)" });
            }

            if (typeof processEvents !== "boolean") {
                return res.status(400).send({ error: "Invalid value for 'processEvents' (expecting a boolean)" });
            }

            try {
                // Update the configuration in the config object
                this.config.set("pushNotifClient", req.body);

                // Send success response
                res.status(200).send({ message: "Configuration updated successfully" });
            } catch (error) {
                // Log and handle errors for configuration update failure
                Logger.error("Error updating PushNotifClient configuration", error);
                res.status(500).send({ error: "Failed to update configuration" });
            }
        });

        // Send push notification Route
        this.router.post("/send", this.validator, async (req, res) => {
            // No validation here - PushNotifClient validates the params
            try {
                // Call PushNotifClient to send the notification
                await this.pushNotifClient.send(req.body);
                res.status(200).send({ message: "Push notification sent successfully" });
            } catch (error) {
                Logger.error("Error sending push notification", error);
                res.status(500).send({ error: "Failed to send push notification" });
            }
        });
    }

    getRouter() {
        return this.router;
    }
}

module.exports = PushNotifClientRouter;
