const NoCloudEvent = require("./NoCloudEvent");

class PendingMapChangeNoCloudEvent extends NoCloudEvent {
    /**
     *
     * @param {object}   options
     * @param {object}  [options.metaData]
     * @class
     */
    constructor(options) {
        super(Object.assign({}, options, {id: "pending_map_change"}));
    }
}

module.exports = PendingMapChangeNoCloudEvent;
