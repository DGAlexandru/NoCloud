const sinon = require("sinon");

const DreameUtils = require("../../../../lib/robots/dreame/DreameUtils");
const Logger = require("../../../../lib/Logger"); // Needed for warning tests

describe("DreameUtils", function () {

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
        it(`Should deserialize MopDockSettings for input ${input}`, function() {
            DreameUtils.DESERIALIZE_MOP_DOCK_SETTINGS(input).Should.deepEqual(expected);
        });

        it(`Should serialize MopDockSettings ${JSON.stringify(expected)}`, function() {
            DreameUtils.SERIALIZE_MOP_DOCK_SETTINGS(expected).Should.equal(input >>> 0);
        });
    });
    it("Should throw error for out-of-range MopDockSettings values", function() {
        const badSettings = mopDockSettings(256, -1, 300);
        (() => DreameUtils.SERIALIZE_MOP_DOCK_SETTINGS(badSettings)).Should.throw(/between 0 and 255/);
    });

    // --- MiscTunables Tests---
    // "[{\"k\":\"AutoDry\",\"v\":1},{\"k\":\"CleanType\",\"v\":0},{\"k\":\"FillinLight\",\"v\":1},{\"k\":\"FluctuationConfirmResult\",\"v\":0},{\"k\":\"LessColl\",\"v\":1},{\"k\":\"StainIdentify\",\"v\":1}]"
    it("Should deserialize misc tunables", function() {
        const json = miscTunablesJSON([
            ["AutoDry", 1],
            ["CleanType", 0],
            ["FillinLight", 1],
            ["FluctuationConfirmResult", 0],
            ["LessColl", 1],
            ["StainIdentify", 1]
        ]);

        const actual = DreameUtils.DESERIALIZE_MISC_TUNABLES(json);
        actual.Should.deepEqual({
            AutoDry: 1,
            CleanType: 0,
            FillinLight: 1,
            FluctuationConfirmResult: 0,
            LessColl: 1,
            StainIdentify: 1
        });
    });

    it("Should return empty object for invalid misc tunables", function() {
        DreameUtils.DESERIALIZE_MISC_TUNABLES("not json").Should.deepEqual({});
    });

    it("Should serialize a single misc tunable", function() {
        DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE({ AutoDry: 1 })
            .Should.equal(JSON.stringify({ k: "AutoDry", v: 1 }));
    });

    it("Should warn when serializing more than one misc tunable", function() {
        const warnStub = sinon.stub(Logger, "warn");
        const obj = { AutoDry: 1, CleanType: 0 };
        const result = DreameUtils.SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE(obj);
        result.Should.equal(JSON.stringify({ k: "AutoDry", v: 1 }));
        warnStub.calledOnce.Should.be.true();
        warnStub.restore();
    });

    // --- AI Settings ---
    const allFlags = Object.keys(DreameUtils.AI_CAMERA_FLAGS_MASK);

    it("Should correctly deserialize AI settings and match helper results", function() {
        const input = 31;
        const actual = DreameUtils.DESERIALIZE_AI_SETTINGS(input);

        allFlags.forEach(flag => {
            const expected = Boolean(input & DreameUtils.AI_CAMERA_FLAGS_MASK[flag]);
            actual[flag].Should.equal(expected);
            DreameUtils.AI_CAMERA_FLAG_STATUS(input, flag).Should.equal(expected);
        });
    });

    it("Should correctly serialize AI settings and helpers Should reflect it", function() {
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
        actual.Should.equal(18);

        allFlags.forEach(flag => {
            DreameUtils.AI_CAMERA_FLAG_STATUS(actual, flag)
                .Should.equal(Boolean(input[flag]));
        });
    });

    it("Should serialize and deserialize AI settings consistently and helpers Should be consistent also", function() {
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

            deserialized[flag].Should.equal(expected);
            DreameUtils.AI_CAMERA_FLAG_STATUS(serialized, flag).Should.equal(expected);
        });
    });

    it("Should enable and disable AI Camera Flags using helpers", function() {
        let bitmask = 0;

        bitmask = DreameUtils.AI_CAMERA_FLAG_SET(bitmask, "obstacleDetection", false);
        DreameUtils.AI_CAMERA_FLAG_STATUS(bitmask, "obstacleDetection").Should.equal(false);

        bitmask = DreameUtils.AI_CAMERA_FLAG_SET(bitmask, "petDetection", true);
        DreameUtils.AI_CAMERA_FLAG_STATUS(bitmask, "petDetection").Should.equal(true);

        bitmask = DreameUtils.AI_CAMERA_FLAG_SET(bitmask, "largeParticlesBoost", false);
        DreameUtils.AI_CAMERA_FLAG_STATUS(bitmask, "largeParticlesBoost").Should.equal(false);

        // ensure a Flag which was set before isn't touched by the usage of helpers for other AI Flags
        DreameUtils.AI_CAMERA_FLAG_STATUS(bitmask, "petDetection").Should.equal(true);
    });

});
