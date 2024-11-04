const DismissibleNoCloudEvent = require("./DismissibleNoCloudEvent");

class ErrorStateNoCloudEvent extends DismissibleNoCloudEvent {
    /**
     *
     *
     * @param {object}   options
     * @param {object}  options.message
     * @class
     */
    constructor(options) {
        super({});

        this.message = options.message;
    }
}

module.exports = ErrorStateNoCloudEvent;
