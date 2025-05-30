const CapabilityRouter = require("./CapabilityRouter");
const NoCloudGoToLocation = require("../../entities/core/NoCloudGoToLocation");

class GoToLocationCapabilityRouter extends CapabilityRouter {
    initRoutes() {
        this.router.put("/", this.validator, async (req, res) => {
            if (req.body.action === "goto" && req.body.coordinates !== undefined) {
                try {
                    await this.capability.goTo(new NoCloudGoToLocation({
                        coordinates: {
                            x: req.body.coordinates.x,
                            y: req.body.coordinates.y
                        }
                    }));
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

module.exports = GoToLocationCapabilityRouter;
