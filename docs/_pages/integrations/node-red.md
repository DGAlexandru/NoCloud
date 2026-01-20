---
title: Node-RED
category: Integrations
order: 22
---
<h1>$${\color{black}Node-\color{red}RED}$$</h1>

You need to [connect NoCloud to the same MQTT Broker as your Node-RED](./mqtt.md).

Build your flows with `mqtt in` and `mqtt out` nodes using the [NoCloud topics](./mqtt.md).

To draw a map for your Dashboard you can use [Node-Red-contrib-Valetudo](https://flows.nodered.org/node/node-red-contrib-valetudo).
```
npm install node-red-contrib-valetudo
```
<b>Sample flow:</b>
![image](https://raw.githubusercontent.com/alexkn/node-red-contrib-valetudo/master/docs/map-png-sample-flow.png)

If you also enable Homie and install the flow [Node-Red-contrib-Homie-Convention](https://flows.nodered.org/node/node-red-contrib-homie-convention),
autodiscovery should work with Node-RED as well.
```
npm install node-red-contrib-homie-convention
```
![image](https://raw.githubusercontent.com/Christian-Me/node-red-contrib-homie-convention/master/nodes/homie-device/icons/mqtt_homie.jpg)
