
// It seems that everything the AI models can detect shares the same ID space
const AI_CLASSIFIER_IDS = Object.freeze({
    "0": "Unknown",
    "1": "Bedside Table",
    "2": "Wall Air Conditioner",
    "3": "Chair",
    "4": "Unknown",
    "5": "End Table",
    "6": "TV Monitor",
    "7": "TV Cabinet",
    "8": "Dining Table",
    "9": "Range Hood",
    "10": "Cupboard",
    "11": "Gas Water Heater",
    "12": "Toilet",
    "13": "Shower Head",
    "14": "Electric Water Heater",
    "15": "Refrigerator",
    "16": "Washer Dryer",

    "32": "Unknown",

    "40": "Unknown",
    "41": "Balcony",
    "42": "Bathroom",
    "43": "Bedroom",
    "44": "Corridor",
    "45": "Dining Room",
    "46": "Kitchen",
    "47": "Living Room",


    "128": "Pedestal",
    "129": "Bathroom Scale",
    "130": "Power Strip", // Thread?
    "131": "Wire (131)", // was Unknown
    "132": "Toy",
    "133": "Shoes",
    "134": "Sock",
    "135": "Feces", // Poo
    "136": "Trash Can",
    "137": "Fabric",
    "138": "Cable (138)", // Thread? or Power Strip
    "139": "Stain", // Liquid Stain
    "140": "Dock Entrance",
    "141": "Dock",
    "142": "Obstacle", // Ambiguous obstacle
    "143": "Black Desk Leg",

    "144": "Roller",
    "145": "Sweeper",
    "146": "Cleaning Robot",

    "147": "Ambiguous Other",
    "148": "Carpet Segment",
    "149": "Ground",
    "150": "Carpet",
    "151": "Unknown",
    "152": "Ceramic",

    "157": "Human",
    "158": "Pet",

    "159": "Furniture Leg",
    "160": "Furniture Leg Black",
    "161": "Wheel",
    "162": "Robot Cleaner",
    "163": "Cleaner", // Cleaning Tools
    "164": "Unknown",
    "165": "Bottle",
    "166": "Unknown",
    "167": "Pet Bowl",
    "168": "Mirror",
    "169": "Door Stop",  // Detected Stain
    "170": "Remote Control",
    "171": "Flower Pot",

    "173": "Stain Need Filter", // ???
    "174": "Hand Gesture: unknown",
    "175": "Hand Gesture: Stop",
    // Various body key points I'm not going to document here because they'll certainly only be used within the robots
    // firmware for some kind of gesture control

    "200": "Blocked Room",
    "201": "Bar Stool", // Easy to Stuck Furniture - any kind of furniture that can act as a prison for the robot: can be entered but not left
    "202": "Mixed Stain", // Solid Liquid
    "203": "Human Body",
    "204": "Human Leg",
    "205": "Large Particles", // Particles Area
    "206": "Dried Stain", // Stubborn Stain
    "207": "Pet House",
    "208": "Yoga Mat",
    "209": "Food Bowl",
    "210": "Pet Bed",

    "214": "Cleaned Stain",
    "215": "Cleaned Mixed Stain",
    "216": "Cleaned Dried Stain",
    "217": "Cleaned Large Particles",
});

const WATER_HOOKUP_ERRORS = Object.freeze({
    1: "Tank replacements not installed",
    2: "External control box not installed",
    3: "Freshwater input abnormal. Check anything affecting water pressure",
    4: "Wastewater output abnormal. Check the pump",
    5: "Wastewater output abnormal. Check the filter",
    // 6 is success
    7: "Pump failure" // No clue which pump, but some pump for sure has failed. "MOTOR_PERISTALTIC_TEST_FAIL"
});

module.exports = {
    WATER_HOOKUP_ERRORS: WATER_HOOKUP_ERRORS,
    AI_CLASSIFIER_IDS: AI_CLASSIFIER_IDS
};
