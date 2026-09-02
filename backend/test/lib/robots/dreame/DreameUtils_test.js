const assert = require("node:assert");
const { describe, it, mock } = require("node:test");

const DreameUtils = require("../../../../lib/robots/dreame/DreameUtils");
const Logger = require("../../../../lib/Logger"); // Needed for warning tests

describe("DreameUtils", () => {

    // --- Helper functions ---
    const mopDockSettings = (water, pad, oper) => ({
        waterGrade: water,
        padCleaningFrequency: pad,
        operationMode: oper
    });

    const miscTunablesJSON = arr => JSON.stringify(arr.map(([k, v]) => ({ k: k, v: v })));

    // --- MopDockSettings Tests ---
    [
        { input: 197889, expected: mopDockSettings(3, 5, 1) },
        { input: 133632, expected: mopDockSettings(2, 10, 0) },
        { input: 0, expected: mopDockSettings(0, 0, 0) },
        { input: 0xFFFFFF, expected: mopDockSettings(255, 255, 255) }
    ].forEach(({ input, expected }) => {
        it(`Deserializes MopDockSettings for input ${input}`, () => {
            assert.deepStrictEqual(DreameUtils.DESERIALIZE_MOP_DOCK_SETTINGS(input), expected);
        });

        it(`Serializes MopDockSettings ${JSON.stringify(expected)}`, () => {
            assert.strictEqual(DreameUtils.SERIALIZE_MOP_DOCK_SETTINGS(expected), input >>> 0);
        });
    });
    it("Warns for out-of-range MopDockSettings values", () => {
        const warnStub = mock.method(Logger, "warn");
        const badSettings = mopDockSettings(256, -1, 300);
        try {
            DreameUtils.SERIALIZE_MOP_DOCK_SETTINGS(badSettings);

            assert.strictEqual(warnStub.mock.callCount(), 1);
            assert.match(warnStub.mock.calls[0].arguments[0], /between 0 and 255/);
        } finally {
            warnStub.mock.restore();
        }
    });

    // --- MiscTunables Tests---
    // "[{\"k\":\"AutoDry\",\"v\":1},{\"k\":\"CleanType\",\"v\":0},{\"k\":\"FillinLight\",\"v\":1},{\"k\":\"FluctuationConfirmResult\",\"v\":0},{\"k\":\"LessColl\",\"v\":1},{\"k\":\"StainIdentify\",\"v\":1}]"
    it("Deserializes misc tunables", () => {
        const json = miscTunablesJSON([
            ["AutoDry", 1],
            ["CleanType", 0],
            ["FillinLight", 1],
            ["FluctuationConfirmResult", 0],
            ["LessColl", 1],
            ["StainIdentify", 1]
        ]);

        assert.deepStrictEqual(DreameUtils.DESERIALIZE_MISC_TUNABLES(json), {
            AutoDry: 1,
            CleanType: 0,
            FillinLight: 1,
            FluctuationConfirmResult: 0,
            LessColl: 1,
            StainIdentify: 1
        });
    });

    it("Returns empty object for invalid misc tunables", () => {
        const warnStub = mock.method(Logger, "warn");

        try {
            assert.deepStrictEqual(DreameUtils.DESERIALIZE_MISC_TUNABLES("not json"), {});
            assert.strictEqual(warnStub.mock.callCount(), 1);
        } finally {
            warnStub.mock.restore();
        }
    });

    it("Serializes a single misc tunable", () => {
        assert.strictEqual(
            DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE({ AutoDry: 1 }),
            JSON.stringify({ k: "AutoDry", v: 1 })
        );
    });

    it("Warns when serializing more than one misc tunable", () => {
        const warnStub = mock.method(Logger, "warn");
        const obj = { AutoDry: 1, CleanType: 0 };
        try {
            const result = DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE(obj);
            assert.strictEqual(result, JSON.stringify({ k: "AutoDry", v: 1 }));
            assert.strictEqual(warnStub.mock.callCount(), 1);
        } finally {
            warnStub.mock.restore();
        }
    });

    // --- AI Settings ---
    const allFlags = Object.keys(DreameUtils.AI_CAMERA_FLAGS_MASK);

    it("Correctly deserializes AI settings and matches helper results", () => {
        const input = 31;
        const actual = DreameUtils.DESERIALIZE_AI_SETTINGS(input);

        allFlags.forEach(flag => {
            const expected = Boolean(input & DreameUtils.AI_CAMERA_FLAGS_MASK[flag]);
            assert.strictEqual(actual[flag], expected);
            assert.strictEqual(DreameUtils.AI_CAMERA_FLAG_STATUS(input, flag), expected);
        });
    });

    it("Correctly serializes AI settings and helpers Should reflect it", () => {
        const input = {
            furnitureDetection: false,
            obstacleDetection: true,
            obstacleImages: false,
            fluidDetection: false,
            petDetection: true,
            obstacleImageUpload: false,
            AIImage: false,
            petAvoidance: false,
            fuzzyObstacleDetection: false,
            petPicture: false,
            petFocusedDetection: false,
            largeParticlesBoost: false
        };
        // expected bitmask: 0b0000000000010010 = 18

        const actual = DreameUtils.SERIALIZE_AI_SETTINGS(input);
        assert.strictEqual(actual, 18);

        allFlags.forEach(flag => {
            assert.strictEqual(DreameUtils.AI_CAMERA_FLAG_STATUS(actual, flag), Boolean(input[flag]));
        });
    });

    it("Serializes and deserializes AI settings consistently and helpers Should be consistent also", () => {
        const input = {
            obstacleDetection: true,
            obstacleImages: true,
            petDetection: false,
            largeParticlesBoost: true
        };

        const serialized = DreameUtils.SERIALIZE_AI_SETTINGS(input);
        const deserialized = DreameUtils.DESERIALIZE_AI_SETTINGS(serialized);

        allFlags.forEach(flag => {
            const expected = Boolean(input[flag]);

            assert.strictEqual(deserialized[flag], expected);
            assert.strictEqual(DreameUtils.AI_CAMERA_FLAG_STATUS(serialized, flag), expected);
        });
    });

    it("Enables and disables AI Camera Flags using helpers", () => {
        let bitmask = 0;

        bitmask = DreameUtils.AI_CAMERA_FLAG_SET(bitmask, "obstacleDetection", false);
        assert.strictEqual(DreameUtils.AI_CAMERA_FLAG_STATUS(bitmask, "obstacleDetection"), false);

        bitmask = DreameUtils.AI_CAMERA_FLAG_SET(bitmask, "petDetection", true);
        assert.strictEqual(DreameUtils.AI_CAMERA_FLAG_STATUS(bitmask, "petDetection"), true);

        bitmask = DreameUtils.AI_CAMERA_FLAG_SET(bitmask, "largeParticlesBoost", false);
        assert.strictEqual(DreameUtils.AI_CAMERA_FLAG_STATUS(bitmask, "largeParticlesBoost"), false);

        // ensure a Flag which was set before isn't touched by the usage of helpers for other AI Flags
        assert.strictEqual(DreameUtils.AI_CAMERA_FLAG_STATUS(bitmask, "petDetection"), true);
    });

});
