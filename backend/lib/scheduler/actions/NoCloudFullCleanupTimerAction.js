const BasicControlCapability = require("../../core/capabilities/BasicControlCapability");
const NoCloudTimerAction = require("./NoCloudTimerAction");

class NoCloudFullCleanupTimerAction extends NoCloudTimerAction {
    async run() {
        if (!this.robot.hasCapability(BasicControlCapability.TYPE)) {
            throw new Error("Robot is missing the BasicControlCapability");
        } else {
            return this.robot.capabilities[BasicControlCapability.TYPE].start();
        }
    }
}

module.exports = NoCloudFullCleanupTimerAction;
