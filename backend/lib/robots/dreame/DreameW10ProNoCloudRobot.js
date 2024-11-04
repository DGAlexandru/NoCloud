const capabilities = require("./capabilities");
const DreameMiotServices = require("./DreameMiotServices");
const DreameMopNoCloudRobot = require("./DreameMopNoCloudRobot");
const DreameQuirkFactory = require("./DreameQuirkFactory");
const DreameNoCloudRobot = require("./DreameNoCloudRobot");
const fs = require("fs");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");
const QuirksCapability = require("../../core/capabilities/QuirksCapability");
const stateAttrs = require("../../entities/state/attributes");
const NoCloudSelectionPreset = require("../../entities/core/NoCloudSelectionPreset");

const MIOT_SERVICES = DreameMiotServices["GEN2"];

class DreameW10ProNoCloudRobot extends DreameMopNoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        super(
            Object.assign(
                {},
                {
                    operationModes: Object.freeze({
                        [stateAttrs.PresetSelectionStateAttribute.MODE.VACUUM_AND_MOP]: 0,
                        [stateAttrs.PresetSelectionStateAttribute.MODE.MOP]: 1,
                        [stateAttrs.PresetSelectionStateAttribute.MODE.VACUUM]: 2,
                    })
                },
                options,
            )
        );

        const QuirkFactory = new DreameQuirkFactory({
            robot: this
        });

        this.registerCapability(new capabilities.DreameCarpetSensorModeControlCapability({
            robot: this
        }));

        [
            capabilities.DreameAICameraGoToLocationCapability,
            capabilities.DreameAICameraObstacleAvoidanceControlCapability,
            capabilities.DreamePetObstacleAvoidanceControlCapability,
        ].forEach(capability => {
            this.registerCapability(new capability({robot: this}));
        });

        this.registerCapability(new capabilities.DreameOperationModeControlCapability({
            robot: this,
            presets: Object.keys(this.operationModes).map(k => {
                return new NoCloudSelectionPreset({name: k, value: this.operationModes[k]});
            }),
            siid: MIOT_SERVICES.VACUUM_2.SIID,
            piid: MIOT_SERVICES.VACUUM_2.PROPERTIES.MOP_DOCK_SETTINGS.PIID
        }));

        this.registerCapability(new QuirksCapability({
            robot: this,
            quirks: [
                QuirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_MOP_CLEANING_FREQUENCY),
                QuirkFactory.getQuirk(DreameQuirkFactory.KNOWN_QUIRKS.MOP_DOCK_WET_DRY_SWITCH),
            ]
        }));
    }

    getCloudSecretFromFS() {
        return fs.readFileSync("/mnt/private/ULI/factory/key.txt");
    }

    getModelName() {
        return "W10 Pro";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(DreameNoCloudRobot.DEVICE_CONF_PATH);

        return !!(deviceConf && deviceConf.model === "dreame.vacuum.r2104");
    }
}


module.exports = DreameW10ProNoCloudRobot;
