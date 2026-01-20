---
title: I Can't Believe It's Not NoCloud
category: Companion Apps
order: 18
---

# [I Can't Believe It's Not Valetudo](https://github.com/Hypfer/Icantbelieveitsnotvaletudo)

ICBINV is a companion microservice - meant to be run on another host - for [NoCloud](https://github.com/DGAlexandru/NoCloud) that renders [NoCloud](https://github.com/DGAlexandru/NoCloud)Map data to raster graphics - PNG images.

Incoming [NoCloud](https://github.com/DGAlexandru/NoCloud)Map data is received via MQTT. Rendered map images are published to MQTT and can optionally also be requested via HTTP (if enabled)

Useful for stuff like e.g. using Home Automation software to send a notification including the latest map image or if you're using FHEM or ioBroker.

<b>This project is archived. The next one might be a good successor:</b>

# [ValetudoPNG](https://github.com/erkexzcx/valetudopng)

ValetudoPNG is a service designed to render map from NoCloud-enabled vacuum robot into a more accessible PNG format.<br/>
This PNG map is sent to Home Assistant via MQTT, where it can be viewed as a real-time camera feed.

ValetudoPNG was specifically developed to integrate with third-party frontend cards, such as the [Lovelace Xiaomi Vacuum Map Card](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card).
