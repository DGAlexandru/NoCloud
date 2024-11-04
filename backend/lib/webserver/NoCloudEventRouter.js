const express = require("express");

class NoCloudEventRouter {
    /**
     *
     * @param {object} options
     * @param {import("../NoCloudEventStore")} options.NoCloudEventStore
     * @param {*} options.validator
     */
    constructor(options) {
        this.router = express.Router({mergeParams: true});

        this.NoCloudEventStore = options.NoCloudEventStore;
        this.validator = options.validator;

        this.initRoutes();
    }


    initRoutes() {
        this.router.get("/", (req, res) => {
            res.json(this.NoCloudEventStore.getAll());
        });

        this.router.get("/:id", (req, res) => {
            const event = this.NoCloudEventStore.getById(req.params.id);

            if (event) {
                res.json(event);
            } else {
                res.sendStatus(404);
            }
        });

        this.router.put("/:id/interact", this.validator, async (req, res) => {
            const event = this.NoCloudEventStore.getById(req.params.id);

            if (event) {
                if (req.body.interaction) {
                    try {
                        await this.NoCloudEventStore.interact(event, req.body.interaction);
                    } catch (e) {
                        return res.status(500).send("Failed to interact with event: " + e?.message);
                    }

                    res.json(event);
                } else {
                    res.sendStatus(400);
                }
            } else {
                res.sendStatus(404);
            }
        });
    }

    getRouter() {
        return this.router;
    }
}

module.exports = NoCloudEventRouter;
