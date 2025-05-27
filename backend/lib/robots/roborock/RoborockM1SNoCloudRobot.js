const capabilities = require("./capabilities");
const entities = require("../../entities");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const RoborockNoCloudRobot = require("./RoborockNoCloudRobot");


class RoborockM1SNoCloudRobot extends RoborockNoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        super(Object.assign({}, options, {fanSpeeds: FAN_SPEEDS}));

        [
            capabilities.RoborockCombinedVirtualRestrictionsCapability,
            capabilities.RoborockHighResolutionManualControlCapability,
            capabilities.RoborockMapResetCapability,
            capabilities.RoborockMapSegmentEditCapability,
            capabilities.RoborockMapSegmentRenameCapability,
            capabilities.RoborockMapSegmentSimpleCapability,
            capabilities.RoborockMapSnapshotCapability,
            capabilities.RoborockPersistentMapControlCapability,
        ].forEach(capability => {
            this.registerCapability(new capability({robot: this}));
        });
    }

    setEmbeddedParameters() {
        this.deviceConfPath = RoborockM1SNoCloudRobot.DEVICE_CONF_PATH;
        this.tokenFilePath = RoborockM1SNoCloudRobot.TOKEN_FILE_PATH;
    }

    getModelName() {
        return "M1S";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(RoborockNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && deviceConf.model === "roborock.vacuum.m1s");
    }
}

RoborockM1SNoCloudRobot.DEVICE_CONF_PATH = "/mnt/default/device.conf";
RoborockM1SNoCloudRobot.TOKEN_FILE_PATH = "/data/miio/device.token";

const FAN_SPEEDS = {
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.LOW]: 101,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MEDIUM]: 102,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.HIGH]: 103,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.MAX]: 104,
    [entities.state.attributes.PresetSelectionStateAttribute.INTENSITY.OFF] : 105 //also known as mop mode
};

module.exports = RoborockM1SNoCloudRobot;
