const express = require("express");
const jstoxml = require("jstoxml");
const Logger = require("../Logger");
const Tools = require("../utils/Tools");


class SSDPRouter {
    /**
     *
     * @param {object} options
     * @param {import("../core/NoCloudRobot")} options.robot
     * @param {import("../Configuration")} options.config
     * @param {import("../utils/NoCloudHelper")} options.NoCloudHelper
     */
    constructor(options) {
        this.router = express.Router({mergeParams: true});

        this.config = options.config;
        this.robot = options.robot;
        this.NoCloudHelper = options.NoCloudHelper;

        this.initRoutes();
    }


    initRoutes() {
        this.router.get("/NoCloud.xml", (req, res) => {
            Logger.debug(`SSDP: Received device description request from ${req.ip}`);

            res.set("Content-Type", "text/xml");
            res.send(this.getDeviceDescription(req.hostname));
        });
    }

    getRouter() {
        return this.router;
    }

    /**
     * @private
     * @param {string} address
     * @returns {*}
     */
    getDeviceDescription(address) {
        return jstoxml.toXML({
            _name: "root",
            _attrs: {
                xmlns: "urn:schemas-upnp-org:device-1-0",
            },
            _content: {
                specVersion: [
                    {
                        "major": 1
                    },
                    {
                        "minor": 0
                    }
                ],
                device: [
                    {
                        //http://upnp.org/specs/basic/UPnP-basic-Basic-v1-Device.pdf
                        "deviceType": "urn:schemas-upnp-org:device:Basic:1"
                    },
                    {
                        "friendlyName": this.NoCloudHelper.getFriendlyName()
                    },
                    {
                        "manufacturer": this.robot.getManufacturer()
                    },
                    {
                        "manufacturerURL": "https://NoCloud.cloud"
                    },
                    {
                        "modelDescription": "NoCloud-enabled robot"
                    },
                    {
                        "modelName": this.robot.getModelName()
                    },
                    {
                        "modelNumber": Tools.GET_NoCloud_VERSION() + " (NoCloud)"
                    },
                    {
                        "modelURL": "https://NoCloud.cloud"
                    },
                    {
                        "UDN": "uuid:" + Tools.GET_SYSTEM_ID()
                    },
                    {
                        "presentationURL": "http://" + address
                    }
                ],
            },
        },
        {
            header: true,
            indent: "  ",
        });
    }
}

module.exports = SSDPRouter;
