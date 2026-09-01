const MapLayer = require("../../../../lib/entities/map/MapLayer");
const NoCloudMap = require("../../../../lib/entities/map/NoCloudMap");
const should = require("should");
const {PointMapEntity} = require("../../../../lib/entities/map");

describe("NoCloudMap", function () {
    describe("DESERIALIZE", function () {
        it("should correctly reconstruct a NoCloudMap from a serialized JSON representation", function () {
            const originalMap = new NoCloudMap({
                size: { x: 1000, y: 1000 },
                pixelSize: 5,
                layers: [
                    new MapLayer({
                        type: MapLayer.TYPE.FLOOR,
                        pixels: [
                            10, 10,
                            11, 10,
                            12, 10,
                            10, 11,
                            11, 11
                        ],
                        metaData: {
                            area: 125,
                            segmentId: "20"
                        }
                    })
                ],
                entities: [
                    new PointMapEntity({
                        type: PointMapEntity.TYPE.CHARGER_LOCATION,
                        points: [11, 11]
                    })
                ],
                metaData: {
                    vendorMapId: 42
                }
            });

            const serializedMap = JSON.stringify(originalMap);
            const parsedMapData = JSON.parse(serializedMap);

            const reconstructedMap = NoCloudMap.DESERIALIZE(parsedMapData);

            should(reconstructedMap).be.an.instanceOf(NoCloudMap);
            should(reconstructedMap.size).deepEqual({ x: 1000, y: 1000 });
            should(reconstructedMap.pixelSize).equal(5);

            should(reconstructedMap.metaData.vendorMapId).equal(42);
            should(reconstructedMap.metaData.version).equal(originalMap.metaData.version);

            should(reconstructedMap.layers).have.length(1);
            should(reconstructedMap.layers[0]).be.an.instanceOf(MapLayer);
            should(reconstructedMap.layers[0].type).equal(MapLayer.TYPE.FLOOR);
            should(reconstructedMap.layers[0].compressedPixels).deepEqual(originalMap.layers[0].compressedPixels);
            should(reconstructedMap.layers[0].metaData.segmentId).equal("20");

            should(reconstructedMap.entities).have.length(1);
            should(reconstructedMap.entities[0]).be.an.instanceOf(PointMapEntity);
            should(reconstructedMap.entities[0].type).equal(PointMapEntity.TYPE.CHARGER_LOCATION);
            should(reconstructedMap.entities[0].points).deepEqual([11, 11]);
        });
    });
});
