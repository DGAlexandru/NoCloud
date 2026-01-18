const Logger = require("../../Logger");

/**
 * Dreame stores all three configurables of their mop docks in a single PIID as one int
 * This int consists of three ints like so (represented here as an 32 bit int because js bitwise operations use those):
 *
 * XXXXXXXXWWWWWWWWPPPPPPPPOOOOOOOO
 *
 * where
 * - X is nothing
 * - W is the water grade (wetness of the mop pads)
 * - P is the pad cleaning frequency (apparently in m² plus 0 for "after each segment")
 * - O is the operation mode (mop, vacuum & mop, vacuum)
 *
 */

// Define one mask for each of the 3 configurables - we could have used only one as they are equal, but for redability...
const WATER_GRADE_MASK = 0xff; // 8 bits
const PAD_CLEAN_FREQ_MASK = 0xff; // 8 bits
const OPERATION_MODE_MASK = 0xff; // 8 bits

class DreameUtils {
    /**
     *
     * @typedef {object} MOP_DOCK_SETTINGS
     * @property {number} waterGrade
     * @property {number} padCleaningFrequency
     * @property {number} operationMode
     */

    /**
     *
     * Deserialize a 32-bit integer into 3 MopDockSettings (leftmost 8 bits are unused)
     * @param {number} input
     * @return {MOP_DOCK_SETTINGS}
     */
    static DESERIALIZE_MOP_DOCK_SETTINGS(input) {
        return {
            waterGrade: input >>> 16 & WATER_GRADE_MASK,
            padCleaningFrequency: input >>> 8 & PAD_CLEAN_FREQ_MASK,
            operationMode: input >>> 0 & OPERATION_MODE_MASK
        };
    }

    /**
     *
     * Serialize 3 Mop Dock Settings into a 32-bit integer (leftmost 8 bits are unused)
     * @param {MOP_DOCK_SETTINGS} settings
     * @return {number}
     */
    static SERIALIZE_MOP_DOCK_SETTINGS(settings) {
        const { waterGrade = 0, padCleaningFrequency = 0, operationMode = 0 } = settings;
        if ([waterGrade, padCleaningFrequency, operationMode].some(n => n < 0 || n > 255)) {
            Logger.warn("Each MopDockSetting values must be between 0 and 255");
        }
        return (
            ((waterGrade & WATER_GRADE_MASK) << 16) |
            ((padCleaningFrequency & PAD_CLEAN_FREQ_MASK) << 8) |
            (operationMode & OPERATION_MODE_MASK)
        ) >>> 0;
    }

    /**
     *
     * @typedef {object} MISC_TUNABLES
     *
     * @property {number} [AutoDry]
     * @property {number} [CleanType]
     * @property {number} [CleanRoute]
     * @property {number} [FillinLight]
     * @property {number} [FluctuationConfirmResult]
     * @property {number} [FluctuationTestResult]
     * @property {number} [HotWash]
     * @property {number} [LessColl] 
     * @property {number} [MaterialDirectionClean]
     * @property {number} [MeticulousTwist]
     * @property {number} [MonitorHumanFollow]
     * @property {number} [MopScalable]
     * @property {number} [PetPartClean]
     * @property {number} [SmartAutoMop]
     * @property {number} [SmartAutoWash]
     * @property {number} [SmartCharge]
     * @property {number} [SmartDrying]
     * @property {number} [SmartHost]
     * @property {number} [StainIdentify]
     * @property {number} [SuctionMax]
     * @property {number} [LacuneMopScalable]
     * @property {number} [MopScalable2]
     * @property {number} [CarpetFineClean]
     * @property {number} [SbrushExtrSwitch]
     * @property {number} [MopExtrSwitch]
     * @property {number} [ExtrFreq]
     */

    /**
     * 
     * @param {string} str
     * @return {MISC_TUNABLES}
     */
    static DESERIALIZE_MISC_TUNABLES(str) {
        try {
            const arr = JSON.parse(str);
            if (!Array.isArray(arr)) {
                Logger.warn("Deserialized Dreame Misc Tunables are not an array");
                return {};
            }
            // Validating that each element actually has k and v. Otherwise, malformed JSON could silently produce { undefined: undefined }.
            return /** @type {MISC_TUNABLES} */ Object.fromEntries(
                arr
                    .filter(item => item && typeof item.k === "string")
                    .map(({ k, v }) => [k, v])
            );
        } catch (e) {
            Logger.warn("Failed to deserialize Dreame Misc Tunables.", e);
            return {};
        }
    }

    /**
     *
     * @param {MISC_TUNABLES} obj
     * @return {string}
     */
    static SERIALIZE_MISC_TUNABLES_SINGLE_TUNABLE(obj) {
        const entries = Object.entries(obj);
        if (entries.length !== 1) {
            Logger.warn(`Expected exactly one MiscTunable, got ${entries.length}.\nUsing only the first one.`, obj);
        }
        const [k, v] = entries[0] || [];
        return JSON.stringify({ k: k, v: v });
    }

    /**
     *
     * Dreame Vacuum bitmask AI Camera Flags
     * bitmasks 0–11 => 12-bit mask
     */
    static get AI_CAMERA_FLAGS_MASK() {
        return Object.freeze({
            furnitureDetection:        1 << 0,   // 1
            obstacleDetection:         1 << 1,   // 2
            obstacleImages:            1 << 2,   // 4
            fluidDetection:            1 << 3,   // 8
            petDetection:              1 << 4,   // 16
            obstacleImageUpload:       1 << 5,   // 32
            AIImage:                   1 << 6,   // 64
            petAvoidance:              1 << 7,   // 128

            fuzzyObstacleDetection:    1 << 8,   // 256
            petPicture:                1 << 9,   // 512
            petFocusedDetection:       1 << 10,  // 1024
            largeParticlesBoost:       1 << 11   // 2048
        });
    }

    /**
     *
     * @typedef {object} AI_CAMERA_SETTINGS
     * @property {boolean} furnitureDetection
     * @property {boolean} obstacleDetection
     * @property {boolean} obstacleImages
     * @property {boolean} fluidDetection
     * @property {boolean} petDetection
     * @property {boolean} obstacleImageUpload
     * @property {boolean} AIImage
     * @property {boolean} petAvoidance
     *
     * @property {boolean} fuzzyObstacleDetection
     * @property {boolean} petPicture
     * @property {boolean} petFocusedDetection
     * @property {boolean} largeParticlesBoost
     */

    /**
     * 
     * @param {number} input
     * @return {AI_CAMERA_SETTINGS}
     */
    static DESERIALIZE_AI_SETTINGS(input) {
        const result = {};
        for (const [flag, mask] of Object.entries(DreameUtils.AI_CAMERA_FLAGS_MASK)) {
            result[flag] = !!(input & mask);
        }
        return /** @type {AI_CAMERA_SETTINGS} */ (result);
    }

    /**
     *
     * @param {AI_CAMERA_SETTINGS} input
     * @return {number}
     */
    static SERIALIZE_AI_SETTINGS(input) {
        let result = 0;
        for (const [flag, mask] of Object.entries(DreameUtils.AI_CAMERA_FLAGS_MASK)) {
            if (input[flag]) {
                result |= mask;
            }
        }
        return result;
    }

    /**
     *
     * Check if a specific AI Camera Flag is set (1 / Enabled)
     * @param {number} bitmask
     * @param {string} flag
     * @returns {boolean}
     */
    static AI_CAMERA_FLAG_STATUS(bitmask, flag) {
        if (!(flag in DreameUtils.AI_CAMERA_FLAGS_MASK)) {
            Logger.warn("AI_CAMERA_FLAG_STATUS: Unknown AI Camera Flag: ", flag);
        }
        const mask = DreameUtils.AI_CAMERA_FLAGS_MASK[flag];
        return (bitmask & mask) !== 0;
    }

    /**
     *
     * Enable or Disable a specific AI Camera Flag
     * @param {number} bitmask
     * @param {string} flag
     * @param {boolean} enabled
     * @returns {number}
     */
    static AI_CAMERA_FLAG_SET(bitmask, flag, enabled) {
        if (!(flag in DreameUtils.AI_CAMERA_FLAGS_MASK)) {
            Logger.warn("AI_CAMERA_FLAG_STATUS: Unknown AI Camera Flag: ", flag);
        }
        const mask = DreameUtils.AI_CAMERA_FLAGS_MASK[flag];
        return enabled ? (bitmask | mask) : (bitmask & ~mask);
    }
}

module.exports = DreameUtils;
