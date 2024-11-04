const DreameD9NoCloudRobot = require("./DreameD9NoCloudRobot");
const DreameNoCloudRobot = require("./DreameNoCloudRobot");
const fs = require("fs");
const MiioNoCloudRobot = require("../MiioNoCloudRobot");

/**
 *  There is no such thing as a D9 Pro+
 *  This implementation is used by D9 Pros that use a backported D9 firmware
 */
class DreameD9ProPlusNoCloudRobot extends DreameD9NoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {import("../../Configuration")} options.config
     * @param {import("../../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        super(options);
    }

    getModelName() {
        return "D9 Pro+";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioNoCloudRobot.READ_DEVICE_CONF(DreameNoCloudRobot.DEVICE_CONF_PATH);
        const isD9Pro = !!(deviceConf && deviceConf.model === "dreame.vacuum.p2187");

        return isD9Pro && fs.existsSync("/etc/dustbuilder_backport");
    }
}


module.exports = DreameD9ProPlusNoCloudRobot;
