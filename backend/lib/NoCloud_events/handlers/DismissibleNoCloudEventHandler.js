const NoCloudEventHandler = require("./NoCloudEventHandler");

class DismissibleNoCloudEventHandler extends NoCloudEventHandler {
    /**
     * @param {NoCloudEventHandler.INTERACTIONS} interaction
     * @returns {Promise<boolean>}
     */
    async interact(interaction) {
        if (interaction === NoCloudEventHandler.INTERACTIONS.OK) {
            return true;
        } else {
            throw new Error("Invalid Interaction");
        }
    }
}

module.exports = DismissibleNoCloudEventHandler;
