const DreameGen2NoCloudRobot = require("./DreameGen2NoCloudRobot");

const capabilities = require("./capabilities");

class DreameGen2LidarNoCloudRobot extends DreameGen2NoCloudRobot {
    constructor(options) {
        super(options);

        this.registerCapability(new capabilities.DreameMappingPassCapability({robot: this}));
    }
}


module.exports = DreameGen2LidarNoCloudRobot;
