import swaggerJsdoc from "swagger-jsdoc";
import SwaggerParser from "swagger-parser";
import Tools from "../backend/lib/utils/Tools.js";
import * as fs from "fs";
import * as path from "path";
const __dirname = path.resolve();

process.on("uncaughtException", function (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
});

const options = {
    failOnErrors: false,
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NoCloud REST API",
            version: Tools.GET_NoCloud_VERSION()
        },
        tags: [ //Swagger UI respects the order of these
            {name: "NoCloud", description: "NoCloud management API"},
            {name: "NoCloudEvents", description: "NoCloud Events"},
            {name: "Robot", description: "Robot API"},
            {name: "System", description: "System API"},
            {name: "MQTT", description: "MQTT Controller API"},
            {name: "NetworkAdvertisement", description: "Network Advertisement Manager API"},
            {name: "NTP", description: "NTP Client API"},
            {name: "Timers", description: "Timers API"},
            {name: "Updater", description: "Update NoCloud using NoCloud"},

            {name: "BasicControlCapability", description: "Basic control capability"},
            {name: "FanSpeedControlCapability", description: "Fan speed control capability"},
            {name: "WaterUsageControlCapability", description: "Water usage control capability"},
            {name: "WifiConfigurationCapability", description: "Wi-Fi configuration capability"},
            {name: "WifiScanCapability", description: "Wi-Fi scan capability"},
            {name: "ZoneCleaningCapability", description: "Zone cleaning capability"},
            {name: "MapSegmentationCapability", description: "Map segment cleaning capability"},
            {name: "ManualControlCapability", description: "Manual control capability"},
            {name: "DoNotDisturbCapability", description: "Do-not-disturb configuration capability"},
            {name: "ConsumableMonitoringCapability", description: "Consumable monitoring capability"},
            {name: "LocateCapability", description: "Robot locate capability"},
            {name: "GoToLocationCapability", description: "Go-to location capability"},
            {name: "CarpetModeControlCapability", description: "Carpet mode settings capability"},
            {name: "MapResetCapability", description: "Map reset capability"},
            {name: "MapSegmentEditCapability", description: "Map segment edit capability"},
            {name: "MapSegmentRenameCapability", description: "Map segment rename capability"},
            {name: "MapSnapshotCapability", description: "Map snapshots capability"},
            {name: "PersistentMapControlCapability", description: "Persistent map control capability"},
            {name: "SpeakerTestCapability", description: "Speaker test capability"},
            {name: "SpeakerVolumeControlCapability", description: "Speaker volume control capability"},
            {name: "VoicePackManagementCapability", description: "Voice pack management capability"},
            {name: "CombinedVirtualRestrictionsCapability", description: "Combined virtual restrictions capability"},
            {name: "PendingMapChangeHandlingCapability", description: "Pending map change handling capability"},
            {name: "MappingPassCapability", description: "Mapping pass capability"},
            {name: "KeyLockCapability", description: "Key lock capability"},
            {name: "AutoEmptyDockManualTriggerCapability", description: "Auto empty dock manual trigger capability"},
            {name: "MopDockCleanManualTriggerCapability", description: "Mop Dock clean manual trigger capability"},
            {name: "MopDockDryManualTriggerCapability", description: "Mop Dock dry manual trigger capability"},
            {name: "OperationModeControlCapability", description: "Operation mode control capability"},
            {name: "ObstacleAvoidanceControlCapability", description: "Obstacle avoidance control capability"},
            {name: "PetObstacleAvoidanceControlCapability", description: "Pet obstacle avoidance control capability"},
            {name: "CarpetSensorModeControlCapability", description: "Carpet sensor mode control capability"},
            {name: "CollisionAvoidantNavigationControlCapability", description: "Collision avoidant navigation control capability"},
            {name: "TotalStatisticsCapability", description: "Total statistics capability"},
            {name: "CurrentStatisticsCapability", description: "Current statistics capability"},
        ],
        components: {
            responses: {
                "200": {description: "Ok"},
                "201": {description: "Created"},
                "202": {description: "Accepted"},
                "400": {description: "Bad request"},
                "403": {description: "Forbidden"},
                "404": {description: "Not found"},
                "500": {description: "Internal server error"},
            },
            parameters: {},
            securitySchemes: {
                BasicAuth: {
                    type: "http",
                    scheme: "basic"
                }
            }
        },
        security: [
            {BasicAuth: []}
        ],
    },
    apis: [
        path.join(__dirname, "./backend/util/openapi_defs/*.openapi.json"),
        path.join(__dirname, "./backend/lib/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/webserver/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/webserver/capabilityRouters/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/webserver/middlewares/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/entities/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/entities/map/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/entities/core/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/entities/core/ntpClient/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/entities/core/updater/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/entities/state/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/entities/state/attributes/doc/*.openapi.json"),
        path.join(__dirname, "./backend/lib/core/capabilities/doc/*.openapi.json")
    ]
};

const spec = await swaggerJsdoc(options);

await SwaggerParser.validate(spec);

// For internal use by NoCloud + inbuilt swagger UI
fs.writeFileSync(
    path.join(__dirname, "./backend/lib/res/NoCloud.openapi.schema.json"),
    JSON.stringify(spec)
);

// For external use as a reference resource
fs.mkdirSync(path.join(__dirname, "./build/"), { recursive: true })
fs.writeFileSync(
    path.join(__dirname, "./build/NoCloud.openapi.schema.json"),
    JSON.stringify(spec, null, 2)
)
