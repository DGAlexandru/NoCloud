const NoCloudEventHandler = require("./NoCloudEventHandler");
const PendingMapChangeHandlingCapability = require("../../core/capabilities/PendingMapChangeHandlingCapability");

class PendingMapChangeNoCloudEventHandler extends NoCloudEventHandler {
    /**
     * @param {NoCloudEventHandler.INTERACTIONS} interaction
     * @returns {Promise<boolean>}
     */
    async interact(interaction) {
        if (interaction === NoCloudEventHandler.INTERACTIONS.YES) {
            return this.interactHelper(true);
        } else if (interaction === NoCloudEventHandler.INTERACTIONS.NO) {
            return this.interactHelper(false);
        } else {
            throw new Error("Invalid Interaction");
        }
    }

    /**
     * @private
     * @param {boolean} accept
     */
    async interactHelper(accept) {
        if (this.robot.hasCapability(PendingMapChangeHandlingCapability.TYPE)) {
            if (accept === true) {
                await this.robot.capabilities[PendingMapChangeHandlingCapability.TYPE].acceptChange();
            } else {
                await this.robot.capabilities[PendingMapChangeHandlingCapability.TYPE].rejectChange();
            }

            return true;
        } else {
            throw new Error("Robot is missing the required PendingMapChangeHandlingCapability");
        }
    }
}

module.exports = PendingMapChangeNoCloudEventHandler;
