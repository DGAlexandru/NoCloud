const CapabilityRouter = require("./CapabilityRouter");

class MopTwistFrequencyControlCapabilityRouter extends CapabilityRouter {
    initRoutes() {
        this.router.get("/", async (req, res) => {
            try {
                res.json({
                    mopTwist: await this.capability.getMopTwist()
                });
            } catch (e) {
                this.sendErrorResponse(req, res, e);
            }
        });

        this.router.put("/", this.validator, async (req, res) => {
            if (req.body.mopTwist) {
                try {
                    await this.capability.setMopTwist(req.body.mopTwist);

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

module.exports = MopTwistFrequencyControlCapabilityRouter;
