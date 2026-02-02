const EventEmitter = require("events").EventEmitter;

const AttributeSubscriber = require("../entities/AttributeSubscriber");
const CallbackAttributeSubscriber = require("../entities/CallbackAttributeSubscriber");
const entities = require("../entities");
const ErrorStateNoCloudEvent = require("../NoCloud_events/events/ErrorStateNoCloudEvent");
const Logger = require("../Logger");
const NotImplementedError = require("./NotImplementedError");
const Semaphore = require("semaphore");
const Tools = require("../utils/Tools");
const {StatusStateAttribute} = require("../entities/state/attributes");

/**
 * @abstract
 */
class NoCloudRobot {
    /**
     *
     * @param {object} options
     * @param {import("../Configuration")} options.config
     * @param {import("../NoCloudEventStore")} options.NoCloudEventStore
     */
    constructor(options) {
        /** @private */
        this.eventEmitter = new EventEmitter();
        this.NoCloudEventStore = options.NoCloudEventStore;
        this.config = options.config;
        this.capabilities = {};

        this.state = new entities.state.RobotState({
            map: NoCloudRobot.DEFAULT_MAP
        });

        this.flags = {
            lowmemHost: this.config.get("embedded") === true && Tools.IS_LOWMEM_HOST(),
            hugeMap: false
        };

        this.mapPollMutex = Semaphore(1);
        this.mapPollTimeout = undefined;
        this.postActiveStateMapPollCooldownCredits = 0;

        this.initInternalSubscriptions();

        const modelDetails = this.getModelDetails();
        for (const attachmentType of modelDetails.supportedAttachments) {
            this.state.upsertFirstMatchingAttribute(new entities.state.attributes.AttachmentStateAttribute({
                type: attachmentType,
                attached: false
            }));
        }
    }

    /**
     * @public
     */
    clearNoCloudMap() {
        this.state.map = NoCloudRobot.DEFAULT_MAP;

        this.emitMapUpdated();
    }

    /**
     *
     * @param {import("./capabilities/Capability")} capability
     */
    registerCapability(capability) {
        if (!this.capabilities[capability.type]) {
            this.capabilities[capability.type] = capability;
        } else {
            throw new Error("Attempted to register more than one capability of type " + capability.type);
        }
    }

    /**
     * @public
     * @param {string} capabilityType
     * @returns {boolean}
     */
    hasCapability(capabilityType) {
        return this.capabilities[capabilityType] !== undefined;
    }

    /**
     * Always polls the latest state from the robot
     *
     * @returns {Promise<import("../entities/state/RobotState")>}
     */
    async pollState() {
        return this.state;
    }

    /**
     * Parses a state update and updates the internal state.
     * Updates might be partial
     *
     * @param {*} data
     */
    parseAndUpdateState(data) {
        throw new NotImplementedError();
    }

    /**
     * @protected
     */
    initInternalSubscriptions() {
        this.state.subscribe(
            new CallbackAttributeSubscriber((eventType, status, prevStatus) => {
                if (
                    //@ts-ignore
                    (eventType === AttributeSubscriber.EVENT_TYPE.ADD && status.value === StatusStateAttribute.VALUE.ERROR) ||
                    (
                        eventType === AttributeSubscriber.EVENT_TYPE.CHANGE &&
                        //@ts-ignore
                        status.value === StatusStateAttribute.VALUE.ERROR &&
                        prevStatus &&
                        //@ts-ignore
                        prevStatus.value !== StatusStateAttribute.VALUE.ERROR
                    )
                ) {
                    this.NoCloudEventStore.raise(new ErrorStateNoCloudEvent({
                        //@ts-ignore
                        message: status.error?.message ?? "Unknown Error"
                    }));
                }
            }),
            {attributeClass: StatusStateAttribute.name}
        );

        this.onMapUpdated(() => {
            if (this.flags.hugeMap === false && this.state.map.metaData.totalLayerArea >= HUGE_MAP_THRESHOLD) {
                this.flags.hugeMap = true;

                /*
                    This will be displayed only once after a map larger than 145 m² has been uploaded to a new NoCloud process
                    
                    It should serve as an unobtrusive reminder that while you can use NoCloud in a commercial environment
                    without any limitations whatsoever, doing so and saving money because of that without giving anything
                    back is simply not a very nice thing to do.
                    
                    While there would be the option to introduce something like license keys or a paid version, not only
                    would that be futile in an open source project, but it would also likely harm perfectly fine non-commercial
                    uses of NoCloud in e.g., your local hackerspace, art installations, etc.
                    
                    In the end, I'd rather have some people take advantage of this permissive system than making
                    the project worse for all of its users to prevent that.
                    
                    You're welcome
                 */
                Logger.info("Based on your map size, it looks like you might be using NoCloud in a commercial environment.");
                Logger.info("If NoCloud saves your business money, please consider giving some of those savings back to the project by donating: https://github.com/sponsors/Hypfer");
                Logger.info("Thank you :)");
            }
        });
    }

    /**
     * This function allows us to inject custom routes into the main webserver
     * Usually, this should never be used unless there are _very_ important reasons to do so
     *
     * @param {any} app The expressjs app instance
     */
    initModelSpecificWebserverRoutes(app) {
        //intentional
    }

    /**
     *
     * @protected
     * @abstract
     * @returns {Promise<any>}
     */
    async executeMapPoll() {
        throw new NotImplementedError();
    }

    /**
     * @protected
     * @param {any} pollResponse Implementation specific
     * @return {number} seconds
     */
    determineNextMapPollInterval(pollResponse) {
        let repollSeconds = NoCloudRobot.MAP_POLLING_INTERVALS.DEFAULT;

        let statusStateAttribute = this.state.getFirstMatchingAttribute({
            attributeClass: StatusStateAttribute.name
        });


        let isActive = false;

        if (statusStateAttribute && statusStateAttribute.isActiveState) {
            isActive = true;
            this.postActiveStateMapPollCooldownCredits = 3;
        }

        if (!isActive && this.postActiveStateMapPollCooldownCredits > 0) {
            // Pretend that we're still in an active state to ensure that we catch map updates e.g. after docking
            isActive = true;
            this.postActiveStateMapPollCooldownCredits--;
        }


        if (isActive) {
            repollSeconds = NoCloudRobot.MAP_POLLING_INTERVALS.ACTIVE;

            if (this.flags.lowmemHost) {
                repollSeconds *= 2;
            }
            if (this.flags.hugeMap) {
                repollSeconds *= 2;
            }
        }

        return repollSeconds;
    }

    /**
     * @public
     * @returns {void}
     */
    pollMap() {
        this.mapPollMutex.take(() => {
            let repollSeconds = NoCloudRobot.MAP_POLLING_INTERVALS.DEFAULT;

            // Clear pending timeout, since we’re starting a new poll right now.
            if (this.mapPollTimeout) {
                clearTimeout(this.mapPollTimeout);

                this.mapPollTimeout = undefined;
            }

            this.executeMapPoll().then((response) => {
                repollSeconds = this.determineNextMapPollInterval(response);
            }).catch(() => {
                repollSeconds = NoCloudRobot.MAP_POLLING_INTERVALS.ERROR;
            }).finally(() => {
                this.mapPollTimeout = setTimeout(() => {
                    this.pollMap();
                }, repollSeconds * 1000);

                this.mapPollMutex.leave();
            });
        });
    }


    async shutdown() {
        //intentional
    }

    getManufacturer() {
        return "NoCloud";
    }

    getModelName() {
        return "NoCloudRobot";
    }

    /**
     * @typedef {object} ModelDetails
     * @property {Array<import("../entities/state/attributes/AttachmentStateAttribute").AttachmentStateAttributeType>} supportedAttachments
     */

    /**
     * This method may be overridden to return model-specific details
     * such as which types of attachments to expect in the state
     *
     * @returns {ModelDetails}
     */
    getModelDetails() {
        return {
            supportedAttachments: []
        };
    }

    /**
     * This method may be overridden to return robot-specific well-known properties
     * such as the firmware version
     *
     * @returns {object}
     */
    getProperties() {
        return {};
    }

    /**
     * Basically used to log some more robot-specific information
     */
    startup() {
        //intentional
    }

    /**
     * @protected
     */
    emitStateUpdated() {
        this.eventEmitter.emit(NoCloudRobot.EVENTS.StateUpdated);
    }

    /**
     * @public
     * @param {() => void} listener
     */
    onStateUpdated(listener) {
        this.eventEmitter.on(NoCloudRobot.EVENTS.StateUpdated, listener);
    }

    /**
     * @protected
     */
    emitStateAttributesUpdated() {
        this.emitStateUpdated();

        this.eventEmitter.emit(NoCloudRobot.EVENTS.StateAttributesUpdated);
    }

    /**
     * @public
     * @param {() => void} listener
     */
    onStateAttributesUpdated(listener) {
        this.eventEmitter.on(NoCloudRobot.EVENTS.StateAttributesUpdated, listener);
    }

    /**
     * @protected
     */
    emitMapUpdated() {
        this.emitStateUpdated();

        this.eventEmitter.emit(NoCloudRobot.EVENTS.MapUpdated);
    }

    /**
     * @public
     * @param {() => void} listener
     */
    onMapUpdated(listener) {
        this.eventEmitter.on(NoCloudRobot.EVENTS.MapUpdated, listener);
    }

    /**
     *
     * This very badly named function is used for the implementation autodetection feature
     *
     * Returns true if the implementation thinks that it's the right one for this particular robot
     */
    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        return false;
    }
}

NoCloudRobot.EVENTS = {
    StateUpdated: "StateUpdated",
    StateAttributesUpdated: "StateAttributesUpdated",
    MapUpdated: "MapUpdated"
};

NoCloudRobot.DEFAULT_MAP = require("../res/default_map");

NoCloudRobot.WELL_KNOWN_PROPERTIES = {
    FIRMWARE_VERSION: "firmwareVersion"
};

NoCloudRobot.MAP_POLLING_INTERVALS = Object.freeze({
    DEFAULT: 60,
    ACTIVE: 2,
    ERROR: 30
});


const HUGE_MAP_THRESHOLD = 145 * 10_000; //145m² in cm²

module.exports = NoCloudRobot;
