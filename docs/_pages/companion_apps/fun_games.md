---
title: Fun & Games
category: Companion Apps
order: 20
---
# 1. [Valetudo Minecraft Mapper](https://github.com/Hypfer/Valetudo-Minecraft-Mapper)

A small and rather hackish script, which takes a [NoCloud](https://github.com/DGAlexandru/NoCloud)Map JSON and renders it to a Minecraft World.

<img src="./img/NoCloud-minecraft-mapper.png" alt="image" width="817" height="531">


# 2. [NoCloud-To-VMF](https://github.com/Sch1nken/Valetudo-To-VMF)

A script which can be used to convert [NoCloud](https://github.com/DGAlexandru/NoCloud)Map data (containing segments) to Source-Engine VMF Maps (for use with the Hammer Editor).


# 3. Remote control using a Gamepad

## * [PyGame-based NoCloud Gamepad Remote Control](https://gist.github.com/depau/904ce14b04d935b6f9829cdf2cda64f3)

## * NoCloud GamepPad Experiments (JavaScript):
```javascript
/*
 * This small JS script enables you to control your NoCloud-enabled robot using a gamepad
 * You will need to install node-hid as well as needle by running npm install node-hid and npm install needle
 *
 * Then, before using this code, edit NoCloudHost variable so that it matches your setup.
 *
 * Keep in mind that there are no sanity checks and there's also no error handling.
 * Your robot needs to implement the ManualControlCapability and your controller needs to be already connected
 *
 * Keymap:
 *
 * Movement is done via the D-Pad, because that was much easier to implement. Updates are sent every 60ms
 *
 * Start Button: Starts manual control
 * Select Button: Stops manual control
 *
 * X Button: Stops the robot
 * Y Button: Sends the robot back to the dock
 *
 */
const NoCloudHost = "http://localhost:3197";


const HID = require('node-hid');
const needle = require("needle");


//VendorID and productId of the xbox360 controller. Works with ds4win and the dualshock 4
const controller = new HID.HID(1118, 654);

let state = {};

setInterval(() => {
    handleControllerState(state);
}, 60)


controller.on("data", data => {
    state = parseControllerState(data);
})

/**
 * @param state
 */
function handleControllerState(state) {
    if (state["button:X"] === 1) {
        basicAction("stop");
    } else if(state["button:Y"] === 1) {
        basicAction("home");
    } else if (state["button:Select"] === 1) {
        toggle(false);
    } else if (state["button:Start"] === 1) {
        toggle(true);
    } else if (state["button:Right"] === 1) {
        move("rotate_clockwise");
    } else if (state["button:Left"] === 1) {
        move("rotate_counterclockwise");
    } else if (state["button:Up"] === 1) {
        move("forward")
    } else if (state["button:Down"] === 1) {
        move("backward")
    }
}

function toggle(enabled) {
    needle.put(NoCloudHost + '/api/v2/robot/capabilities/ManualControlCapability', {
        "action": enabled === true ? "enable" : "disable",
    }, { json: true }, function(error, response) {
        if(error) {
            console.error(error);
        }
    });
}

function basicAction(action) {
    needle.put(NoCloudHost + '/api/v2/robot/capabilities/BasicControlCapability', {
        "action": action,
    }, { json: true }, function(error, response) {
        if(error) {
            console.error(error);
        }
    });
}

function move(action) {
    needle.put(NoCloudHost + '/api/v2/robot/capabilities/ManualControlCapability', {
        "action": "move",
        "movementCommand": action
    }, { json: true }, function(error, response) {
        if(error) {
            console.error(error);
        }
    });
}

/**
 * This is a very poor and hacked function to fetch the keypresses from the raw HID events.
 * Feel free to extend it so that it actually becomes a proper parse.
 *
 * @param {Buffer} data
 */
function parseControllerState(data) {
    const state = {};

    state["button:Start"] = data[10] >> 7 & 1;
    state["button:Select"] = data[10] >> 6 & 1;

    state["button:A"] = data[10] & 1;
    state["button:B"] = data[10] >> 1 & 1;
    state["button:X"] = data[10] >> 2 & 1;
    state["button:Y"] = data[10] >> 3 & 1;
    state["button:L1"] = data[10] >> 4 & 1;
    state["button:R1"] = data[10] >> 5 & 1;

    switch(data[11]) {
        case 0:
            state['button:Up'] = 0;
            state['button:Right'] = 0;
            state['button:Down'] = 0;
            state['button:Left'] = 0;
            break;
        case 4:
            state['button:Up'] = 1;
            state['button:Right'] = 0;
            state['button:Down'] = 0;
            state['button:Left'] = 0;
            break;
        case 8:
            state['button:Up'] = 1;
            state['button:Right'] = 1;
            state['button:Down'] = 0;
            state['button:Left'] = 0;
            break;
        case 12:
            state['button:Up'] = 0;
            state['button:Right'] = 1;
            state['button:Down'] = 0;
            state['button:Left'] = 0;
            break;
        case 16:
            state['button:Up'] = 0;
            state['button:Right'] = 1;
            state['button:Down'] = 1;
            state['button:Left'] = 0;
            break;
        case 20:
            state['button:Up'] = 0;
            state['button:Right'] = 0;
            state['button:Down'] = 1;
            state['button:Left'] = 0;
            break;
        case 24:
            state['button:Up'] = 0;
            state['button:Right'] = 0;
            state['button:Down'] = 1;
            state['button:Left'] = 1;
            break;
        case 28:
            state['button:Up'] = 0;
            state['button:Right'] = 0;
            state['button:Down'] = 0;
            state['button:Left'] = 1;
            break;
        case 32:
            state['button:Up'] = 1;
            state['button:Right'] = 0;
            state['button:Down'] = 0;
            state['button:Left'] = 1;
            break;
    }

    return state;
}
```

