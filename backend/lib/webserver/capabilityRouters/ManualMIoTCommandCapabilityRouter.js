const CapabilityRouter = require("./CapabilityRouter");

/**
 * Router for ManualMIoTCommandCapability.
 * Handles HTTP requests for sending MIoT commands to the robot.
 * Currently, the GET / route is a dummy endpoint, since no runtime status is needed.
 */
class ManualMIoTCommandCapabilityRouter extends CapabilityRouter {
    initRoutes() {
        // Dummy GET endpoint - could return metadata if needed in the future
        this.router.get("/", async (req, res) => {
            try {
                // Most probably this function won't be ever used for getting something,
                // but let's give it a purpose so it's not a too dummy function.
                res.json({
                    message: "This endpoint is a placeholder and does not return real status."
                });
            } catch (e) {
                this.sendErrorResponse(req, res, e);
            }
        });

        // PUT endpoint - for sending manual MIoT commands
        this.router.put("/", this.validator, async (req, res) => {
            const { miotcmd, siid, piid, value } = req.body;

            if (!miotcmd || !siid || !piid) {
                return res.sendStatus(400).json({ error: "Missing required fields" });
            }

            try {
                // Call the capability's interact method, which will be implemented per robot
                await this.capability.interact({ miotcmd: miotcmd, siid: siid, piid: piid, value: value });
                res.sendStatus(200);
            } catch (e) {
                this.sendErrorResponse(req, res, e);
            }
        });
    }
}

module.exports = ManualMIoTCommandCapabilityRouter;
