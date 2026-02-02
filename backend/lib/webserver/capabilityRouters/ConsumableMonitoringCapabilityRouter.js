const CapabilityRouter = require("./CapabilityRouter");

class ConsumableMonitoringCapabilityRouter extends CapabilityRouter {
    initRoutes() {
        this.router.get("/", async (req, res) => {
            try {
                res.json(await this.capability.getConsumables());
            } catch (e) {
                this.sendErrorResponse(req, res, e);
            }
        });

        this.router.put("/:type{/:sub_type}", this.validator, async (req, res) => {
            const parameters = {
                type: req.params.type,
                sub_type: req.params.sub_type ?? undefined
            };

            if (req.body.action === "reset") {
                try {
                    await this.capability.resetConsumable(parameters.type, parameters.sub_type);
                    res.sendStatus(200);
                } catch (e) {
                    this.sendErrorResponse(req, res, e);
                }
            } else {
                res.sendStatus(400);
            }
        });
    }
}

module.exports = ConsumableMonitoringCapabilityRouter;
