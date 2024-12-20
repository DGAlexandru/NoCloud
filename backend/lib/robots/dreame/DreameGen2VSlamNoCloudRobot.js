const DreameGen2NoCloudRobot = require("./DreameGen2NoCloudRobot");

const capabilities = require("./capabilities");
const entities = require("../../entities");
const NoCloudSelectionPreset = require("../../entities/core/NoCloudSelectionPreset");


class DreameGen2VSlamNoCloudRobot extends DreameGen2NoCloudRobot {
    constructor(options) {
        super(options);

        //Looks like this is always enabled for LIDAR robots but a toggle for vSlam ones?
        this.registerCapability(new capabilities.DreamePersistentMapControlCapability({
            robot: this,
            siid: DreameGen2NoCloudRobot.MIOT_SERVICES.PERSISTENT_MAPS.SIID,
            piid: DreameGen2NoCloudRobot.MIOT_SERVICES.PERSISTENT_MAPS.PROPERTIES.ENABLED.PIID
        }));

        this.registerCapability(new capabilities.DreameWaterUsageControlCapability({
            robot: this,
            presets: Object.keys(this.waterGrades).map(k => {
                return new NoCloudSelectionPreset({name: k, value: this.waterGrades[k]});
            }),
            siid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.SIID,
            piid: DreameGen2NoCloudRobot.MIOT_SERVICES.VACUUM_2.PROPERTIES.WATER_USAGE.PIID
        }));

        this.registerCapability(new capabilities.DreameCarpetModeControlCapability({robot: this}));

        this.state.upsertFirstMatchingAttribute(new entities.state.attributes.AttachmentStateAttribute({
            type: entities.state.attributes.AttachmentStateAttribute.TYPE.WATERTANK,
            attached: false
        }));
    }
}


module.exports = DreameGen2VSlamNoCloudRobot;
