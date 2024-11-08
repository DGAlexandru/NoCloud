---
title: Node-RED
category: Integrations
order: 22
---

## Node-RED

You need to [connect NoCloud to the same MQTT Broker as your Node-RED](./mqtt.html).

Build your flows with `mqtt in` and `mqtt out` nodes using the [NoCloud topics](./mqtt.html).

To draw a map for your Dashboard you can use [node-red-contrib-NoCloud](https://flows.nodered.org/node/node-red-contrib-NoCloud).

If you also enable Homie and install the flow [node-red-contrib-homie-convention](https://flows.nodered.org/node/node-red-contrib-homie-convention),
autodiscovery should work with Node-RED as well.