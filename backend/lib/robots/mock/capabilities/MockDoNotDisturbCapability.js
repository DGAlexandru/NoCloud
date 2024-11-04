const DoNotDisturbCapability = require("../../../core/capabilities/DoNotDisturbCapability");
const NoCloudDNDConfiguration = require("../../../entities/core/NoCloudDNDConfiguration");

/**
 * @extends DoNotDisturbCapability<import("../MockRobot")>
 */
class MockDoNotDisturbCapability extends DoNotDisturbCapability {
    /**
     * @param {object} options
     * @param {import("../MockRobot")} options.robot
     */
    constructor(options) {
        super(options);

        this.dndConfig = new NoCloudDNDConfiguration({
            enabled: true,
            start: {
                hour: 22,
                minute: 0
            },
            end: {
                hour: 8,
                minute: 0
            }
        });
    }

    /**
     * @returns {Promise<import("../../../entities/core/NoCloudDNDConfiguration")>}
     */
    async getDndConfiguration() {
        return new NoCloudDNDConfiguration(this.dndConfig);
    }

    /**
     * @param {import("../../../entities/core/NoCloudDNDConfiguration")} dndConfig
     * @returns {Promise<void>}
     */
    async setDndConfiguration(dndConfig) {
        this.dndConfig = dndConfig;
    }
}

module.exports = MockDoNotDisturbCapability;
