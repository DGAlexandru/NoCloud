const CapabilityRouter = require("./CapabilityRouter");
const NoCloudMapSegment = require("../../entities/core/NoCloudMapSegment");

class MapSegmentMaterialControlCapabilityRouter extends CapabilityRouter {
    initRoutes() {
        this.router.put("/", this.validator, async (req, res) => {
            if (req.body.action === "set_material") {
                if ( req.body.segment_id && req.body.material !== undefined) {
                    try {
                        await this.capability.setMaterial(
                            new NoCloudMapSegment({id: req.body.segment_id}),
                            req.body.material
                        );

                        res.sendStatus(200);
                    } catch (e) {
                        this.sendErrorResponse(req, res, e);
                    }
                } else {
                    res.sendStatus(400);
                }
            } else {
                res.sendStatus(400);
            }
        });
    }
}

module.exports = MapSegmentMaterialControlCapabilityRouter;
