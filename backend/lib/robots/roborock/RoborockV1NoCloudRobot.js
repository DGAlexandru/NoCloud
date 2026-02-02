const capabilities = require("./capabilities");
const entities = require("../../entities");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const RoborockNoCloudRobot = require("./RoborockNoCloudRobot");



class RoborockV1NoCloudRobot extends RoborockNoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        super(Object.assign({}, options, {fanSpeeds: FAN_SPEEDS}));


        this.registerCapability(new capabilities.RoborockHighResolutionManualControlCapability({
            robot: this,
            velocityLimit: 0.29
        }));

        this.registerCapability(new capabilities.RoborockCarpetModeControlCapability({
            robot: this,
        }));
    }

    getModelName() {
        return "V1";
    }

    getModelDetails() {
        return Object.assign(
            {},
            super.getModelDetails(),
            {
                supportedAttachments: [
                    entities.state.attributes.AttachmentStateAttribute.TYPE.WATERTANK,
                    entities.state.attributes.AttachmentStateAttribute.TYPE.MOP,
                ]
            }
        );
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(RoborockNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && deviceConf.model === "rockrobo.vacuum.v1");
    }
}

const FAN_SPEEDS = {
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MIN]: 1,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.LOW]: 38,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MEDIUM]: 60,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.HIGH]: 75,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MAX]: 100
};

module.exports = RoborockV1NoCloudRobot;
