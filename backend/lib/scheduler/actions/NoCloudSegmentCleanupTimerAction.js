const MapSegmentationCapability = require("../../core/capabilities/MapSegmentationCapability");
const NoCloudMapSegment = require("../../entities/core/NoCloudMapSegment");
const NoCloudTimerAction = require("./NoCloudTimerAction");

class NoCloudSegmentCleanupTimerAction extends NoCloudTimerAction {
    /**
     * @param {object} options
     * @param {import("../../core/NoCloudRobot")} options.robot
     * @param {Array<string>} options.segmentIds
     * @param {number} [options.iterations]
     * @param {boolean} [options.customOrder]
     */
    constructor(options) {
        super(options);

        this.segmentIds = options.segmentIds;
        this.iterations = options.iterations;
        this.customOrder = options.customOrder;
    }

    async run() {
        if (!(Array.isArray(this.segmentIds) && this.segmentIds.length > 0)) {
            throw new Error("Missing segmentIds");
        }

        if (!this.robot.hasCapability(MapSegmentationCapability.TYPE)) {
            throw new Error("Robot is missing the MapSegmentationCapability");
        } else {
            return this.robot.capabilities[MapSegmentationCapability.TYPE].executeSegmentAction(
                this.segmentIds.map(sid => {
                    return new NoCloudMapSegment({
                        id: sid
                    });
                }),
                {
                    iterations: this.iterations ?? 1,
                    customOrder: this.customOrder ?? false
                }
            );
        }
    }
}

module.exports = NoCloudSegmentCleanupTimerAction;
