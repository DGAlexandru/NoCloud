const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

/**
 * List and restore map snapshots which are generated by the firmware
 * 
 * @template {import("../NoCloudRobot")} T
 * @extends Capability<T>
 */
class MapSnapshotCapability extends Capability {
    /**
     * @abstract
     * @returns {Promise<Array<import("../../entities/core/NoCloudMapSnapshot")>>}
     */
    async getSnapshots() {
        throw new NotImplementedError();
    }

    /**
     * @param {import("../../entities/core/NoCloudMapSnapshot")} snapshot
     * @returns {Promise<void>}
     */
    async restoreSnapshot(snapshot) {
        throw new NotImplementedError();
    }

    getType() {
        return MapSnapshotCapability.TYPE;
    }
}

MapSnapshotCapability.TYPE = "MapSnapshotCapability";

module.exports = MapSnapshotCapability;