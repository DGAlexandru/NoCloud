/**
 * @typedef {import("./NoCloudVirtualWall")} NoCloudVirtualWall
 * @typedef {import("./NoCloudRestrictedZone")} NoCloudRestrictedZone
 */

const SerializableEntity = require("../SerializableEntity");


// noinspection JSUnusedGlobalSymbols
/**
 * @class NoCloudVirtualRestrictions
 * @property {Array<NoCloudVirtualWall>} virtualWalls
 * @property {Array<NoCloudRestrictedZone>} restrictedZones
 */
class NoCloudVirtualRestrictions extends SerializableEntity {
    /**
     * This is a named container which contains RestrictedZones and virtualWalls
     *
     * @param {object} options
     * @param {Array<NoCloudVirtualWall>} options.virtualWalls
     * @param {Array<NoCloudRestrictedZone>} options.restrictedZones
     * @param {object} [options.metaData]
     * @class
     */
    constructor(options) {
        super(options);

        this.virtualWalls = options.virtualWalls;
        this.restrictedZones = options.restrictedZones;
    }
}

module.exports = NoCloudVirtualRestrictions;
