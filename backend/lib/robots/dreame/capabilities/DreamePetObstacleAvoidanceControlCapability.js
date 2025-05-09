const DreameMiotHelper = require("../DreameMiotHelper");
const DreameMiotServices = require("../DreameMiotServices");
const DreameUtils = require("../DreameUtils");
const PetObstacleAvoidanceControlCapability = require("../../../core/capabilities/PetObstacleAvoidanceControlCapability");

/**
 * @extends PetObstacleAvoidanceControlCapability<import("../DreameNoCloudRobot")>
 */
class DreamePetObstacleAvoidanceControlCapability extends PetObstacleAvoidanceControlCapability {

    /**
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.siid = DreameMiotServices["GEN2"].VACUUM_2.SIID;
        this.piid = DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.AI_CAMERA_SETTINGS.PIID;

        this.helper = new DreameMiotHelper({robot: this.robot});
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    async isEnabled() {
        const res = await this.helper.readProperty(this.siid, this.piid);
        const deserializedRes = DreameUtils.DESERIALIZE_AI_SETTINGS(res);

        return deserializedRes.petObstacleDetection;
    }

    /**
     * @returns {Promise<void>}
     */
    async enable() {
        const res = await this.helper.readProperty(this.siid, this.piid);
        const deserializedRes = DreameUtils.DESERIALIZE_AI_SETTINGS(res);

        deserializedRes.petObstacleDetection = true;

        await this.helper.writeProperty(
            this.siid,
            this.piid,
            DreameUtils.SERIALIZE_AI_SETTINGS(deserializedRes)
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async disable() {
        const res = await this.helper.readProperty(this.siid, this.piid);
        const deserializedRes = DreameUtils.DESERIALIZE_AI_SETTINGS(res);

        deserializedRes.petObstacleDetection = false;

        await this.helper.writeProperty(
            this.siid,
            this.piid,
            DreameUtils.SERIALIZE_AI_SETTINGS(deserializedRes)
        );
    }
}

module.exports = DreamePetObstacleAvoidanceControlCapability;
