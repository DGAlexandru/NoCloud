const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

/**
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class MapSegmentEditCapability extends Capability {
    /**
     * @param {import("../../entities/core/NoCloudMapSegment")} segmentA
     * @param {import("../../entities/core/NoCloudMapSegment")} segmentB
     * @returns {Promise<void>}
     */
    async joinSegments(segmentA, segmentB) {
        throw new NotImplementedError();
    }

    /**
     * @param {import("../../entities/core/NoCloudMapSegment")} segment
     * @param {object} pA
     * @param {number} pA.x
     * @param {number} pA.y
     * @param {object} pB
     * @param {number} pB.x
     * @param {number} pB.y
     * @returns {Promise<void>}
     */
    async splitSegment(segment, pA, pB) {
        throw new NotImplementedError();
    }

    getType() {
        return MapSegmentEditCapability.TYPE;
    }
}

MapSegmentEditCapability.TYPE = "MapSegmentEditCapability";

module.exports = MapSegmentEditCapability;
