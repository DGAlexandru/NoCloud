const DreameMiotServices = require("../DreameMiotServices");
const DreameUtils = require("../DreameUtils");
const ObstacleAvoidanceControlCapability = require("../../../core/capabilities/ObstacleAvoidanceControlCapability");

/**
 * @extends ObstacleAvoidanceControlCapability<import("../DreameNoCloudRobot")>
 */
class DreameAICameraObstacleAvoidanceControlCapability extends ObstacleAvoidanceControlCapability {

    /**
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.siid = DreameMiotServices["GEN2"].VACUUM_2.SIID;
        this.piid = DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.AI_CAMERA_SETTINGS.PIID;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async isEnabled() {
        const res = await this.robot.miotHelper.readProperty(this.siid, this.piid);
        return DreameUtils.AI_CAMERA_FLAG_STATUS(res, "obstacleDetection");
    }

    /**
     * @returns {Promise<void>}
     */
    async enable() {
        const res = await this.robot.miotHelper.readProperty(this.siid, this.piid);
        const newBitmask = DreameUtils.AI_CAMERA_FLAG_SET(res, "obstacleDetection", true);
        await this.robot.miotHelper.writeProperty(this.siid, this.piid, newBitmask);
    }

    /**
     * @returns {Promise<void>}
     */
    async disable() {
        const res = await this.robot.miotHelper.readProperty(this.siid, this.piid);
        const newBitmask = DreameUtils.AI_CAMERA_FLAG_SET(res, "obstacleDetection", false);
        await this.robot.miotHelper.writeProperty(this.siid, this.piid, newBitmask);
    }
}

module.exports = DreameAICameraObstacleAvoidanceControlCapability;
