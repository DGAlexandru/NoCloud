const DismissibleNoCloudEvent = require("./DismissibleNoCloudEvent");

class MopAttachmentReminderNoCloudEvent extends DismissibleNoCloudEvent {
    /**
     *
     * @param {object}   options
     * @param {object}  [options.metaData]
     * @class
     */
    constructor(options) {
        super(Object.assign({}, options, {id: MopAttachmentReminderNoCloudEvent.ID}));
    }
}

MopAttachmentReminderNoCloudEvent.ID = "mop_attachment_reminder";

module.exports = MopAttachmentReminderNoCloudEvent;
