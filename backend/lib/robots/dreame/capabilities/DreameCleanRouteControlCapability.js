const CleanRouteControlCapability = require("../../../core/capabilities/CleanRouteControlCapability");
const DreameMiotHelper = require("../DreameMiotHelper");
const DreameMiotServices = require("../DreameMiotServices");
const DreameUtils = require("../DreameUtils");
const {sleep} = require("../../../utils/misc");

/**
 * @extends CleanRouteControlCapability<import("../DreameNoCloudRobot")>
 */
class DreameCleanRouteControlCapability extends CleanRouteControlCapability {

    /**
     * @param {object} options
     * @param {import("../DreameNoCloudRobot")} options.robot
     * @param {boolean} [options.quickSupported]
     */
    constructor(options) {
        super(options);

        this.siid = DreameMiotServices["GEN2"].VACUUM_2.SIID;
        this.piid = DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MISC_TUNABLES.PIID;

        this.helper = new DreameMiotHelper({robot: this.robot});
        this.quickSupported = !options.quickSupported; //default true
    }

    async getRoute() {
        const res = await this.helper.readProperty(this.siid, this.piid);
        const deserializedResponse = DreameUtils.DESERIALIZE_MISC_TUNABLES(res);

        switch (deserializedResponse.CleanRoute) {
            case 4:
                return DreameCleanRouteControlCapability.ROUTE.QUICK;
            case 3:
                return DreameCleanRouteControlCapability.ROUTE.DEEP;
            case 2:
                return DreameCleanRouteControlCapability.ROUTE.INTENSIVE;
            case 1:
                return DreameCleanRouteControlCapability.ROUTE.NORMAL;
            default:
                throw new Error(`Received invalid value ${deserializedResponse.CleanRoute}`);
        }
    }

    async setRoute(newRoute) {
        let val;

        switch (newRoute) {
            case DreameCleanRouteControlCapability.ROUTE.QUICK:
                val = 4;
                break;
            case DreameCleanRouteControlCapability.ROUTE.DEEP:
                val = 3;
                break;
            case DreameCleanRouteControlCapability.ROUTE.INTENSIVE:
                val = 2;
                break;
            case DreameCleanRouteControlCapability.ROUTE.NORMAL:
                val = 1;
                break;
            default:
                throw new Error(`Received invalid value ${newRoute}`);
        }

        await this.helper.writeProperty(
            DreameMiotServices["GEN2"].VACUUM_2.SIID,
            DreameMiotServices["GEN2"].VACUUM_2.PROPERTIES.MISC_TUNABLES.PIID,
            DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE({
                CleanRoute: val
            })
        );

        await sleep(100); // Give the robot some time to think
    }

    getProperties() {
        const properties = {
            supportedRoutes: [
                DreameCleanRouteControlCapability.ROUTE.NORMAL,
                DreameCleanRouteControlCapability.ROUTE.INTENSIVE,
                DreameCleanRouteControlCapability.ROUTE.DEEP,
            ],
            mopOnly: [
                DreameCleanRouteControlCapability.ROUTE.INTENSIVE,
                DreameCleanRouteControlCapability.ROUTE.DEEP,
            ],
            oneTime: []
        };

        if (this.quickSupported) {
            properties.supportedRoutes.unshift(DreameCleanRouteControlCapability.ROUTE.QUICK);
        }

        return properties;
    }
}

module.exports = DreameCleanRouteControlCapability;
