const should = require("should");
const NoCloudEventStore = require("../../lib/NoCloudEventStore");
const {
    DustBinFullNoCloudEvent,
    NoCloudRuntimeErrorNoCloudEvent,
    ConsumableDepletedNoCloudEvent
} = require("../../lib/NoCloud_events/events");

describe("NoCloudEventStore", function () {
    describe("rehydrateEvents", function () {
        it("should correctly reconstruct standard events from a serialized JSON representation", function () {
            const store = new NoCloudEventStore({});

            const originalEvents = [
                new DustBinFullNoCloudEvent({
                    id: "evt_1",
                    processed: true,
                    timestamp: new Date("2024-01-01T10:00:00.000Z")
                }),
                new NoCloudRuntimeErrorNoCloudEvent({
                    id: "evt_2",
                    reason: NoCloudRuntimeErrorNoCloudEvent.REASONS.MEMORY_USAGE,
                    generation: 2,
                    description: "Test error context",
                    timestamp: new Date("2024-01-02T10:00:00.000Z")
                }),
                new ConsumableDepletedNoCloudEvent({
                    id: "evt_3",
                    type: "brush",
                    subType: "main",
                    timestamp: new Date("2024-01-03T10:00:00.000Z")
                })
            ];

            const serializedEvents = JSON.stringify(originalEvents);
            const parsedEvents = JSON.parse(serializedEvents);

            store.rehydrateEvents(parsedEvents);

            const rehydratedEvents = store.getAll();

            should(rehydratedEvents).have.length(3);

            const evt1 = rehydratedEvents.find(e => e.id === "evt_1");
            should(evt1).be.an.instanceOf(DustBinFullNoCloudEvent);
            should(evt1.processed).be.true();
            should(evt1.timestamp.toISOString()).equal("2024-01-01T10:00:00.000Z");

            const evt2 = rehydratedEvents.find(e => e.id === "evt_2");
            should(evt2).be.an.instanceOf(NoCloudRuntimeErrorNoCloudEvent);
            should(evt2.reason).equal(NoCloudRuntimeErrorNoCloudEvent.REASONS.MEMORY_USAGE);
            should(evt2.generation).equal(2);
            should(evt2.description).equal("Test error context");
            should(evt2.processed).be.false();
            should(evt2.timestamp.toISOString()).equal("2024-01-02T10:00:00.000Z");

            const evt3 = rehydratedEvents.find(e => e.id === "consumable_depleted_brush_main");
            should(evt3).be.an.instanceOf(ConsumableDepletedNoCloudEvent);
            should(evt3.type).equal("brush");
            should(evt3.subType).equal("main");
            should(evt3.processed).be.false();
            should(evt3.timestamp.toISOString()).equal("2024-01-03T10:00:00.000Z");
        });

        it("should gracefully ignore unknown event classes", function () {
            const store = new NoCloudEventStore({});

            const maliciousPayload = [
                {
                    __class: "DoesNotExistNoCloudEvent",
                    id: "bad_evt",
                    timestamp: new Date().toISOString()
                },
                {
                    __class: "DustBinFullNoCloudEvent",
                    id: "good_evt",
                    timestamp: new Date().toISOString()
                }
            ];

            store.rehydrateEvents(maliciousPayload);

            const rehydratedEvents = store.getAll();
            should(rehydratedEvents).have.length(1);
            should(rehydratedEvents[0]).be.an.instanceOf(DustBinFullNoCloudEvent);
            should(rehydratedEvents[0].id).equal("good_evt");
        });
    });
});
