const NoCloudEvent = require("./NoCloudEvent");

class ConsumableDepletedNoCloudEvent extends NoCloudEvent {
    /**
     *
     * @param {object}   options
     * @param {string}   options.type
     * @param {string}  options.subType
     * @param {object}  [options.metaData]
     * @class
     */
    constructor(options) {
        super(Object.assign({}, options, {id: "consumable_depleted_" + options.type + "_" + options.subType}));

        this.type = options.type;
        this.subType = options.subType;
    }
}

module.exports = ConsumableDepletedNoCloudEvent;
