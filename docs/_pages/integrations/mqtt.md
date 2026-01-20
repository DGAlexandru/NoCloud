---
title: MQTT
category: Integrations
order: 20
---

# MQTT integration

To make your robot talk to your MQTT broker and integrate with home automation software, such as but not limited to
Home Assistant, openHAB and Node-RED, configure MQTT via NoCloud's web interface (Connectivity → MQTT connectivity).
On this page you can also find the exact topic to which to send commands to or from.

## Autodiscovery

See the specific integration pages for instructions on how to set up autodiscovery for your home automation software
platform:

- [Home Assistant](./home-assistant-integration.md)
- [openHAB](./openhab-integration.md)
- [Node-RED](./node-red.md)

Other home automation software that follows the [Homie convention](https://homieiot.github.io/) should also be able to
automatically discover your NoCloud instance.

<div style="text-align: center;">
    <a href="https://homieiot.github.io" rel="noopener" target="_blank">
        <img src="./img/works-with-homie.svg" />
    </a>
    <br>
    <br>
</div>

## Custom integrations

If you're planning to use one of the home automation platforms listed above, this is all you need to know to get started.

If you're instead planning to do something more custom, in this document you will find a reference to all MQTT topics
provided by this software. Values such as `<TOPIC PREFIX>` and `<IDENTIFIER>` are those configured in the MQTT
settings page.

### Table of contents

 - [Robot](#robot)
   - [Capabilities](#capabilities)
     - [Auto Empty Dock Manual Trigger (`AutoEmptyDockManualTriggerCapability`)](#autoemptydockmanualtriggerautoemptydockmanualtriggercapability)
       - [Auto Empty Dock Manual Trigger (`trigger`)](#autoemptydockmanualtriggertrigger)
     - [Basic control (`BasicControlCapability`)](#basiccontrolbasiccontrolcapability)
       - [Operation (`operation`)](#operationoperation)
     - [Carpet Mode (`CarpetModeControlCapability`)](#carpetmodecarpetmodecontrolcapability)
       - [Carpet Mode (`enabled`)](#carpetmodeenabled)
     - [Carpet Sensor Mode (`CarpetSensorModeControlCapability`)](#carpetsensormodecarpetsensormodecontrolcapability)
       - [Carpet Sensor Mode (`mode`)](#carpetsensormodemode)
     - [Consumables monitoring (`ConsumableMonitoringCapability`)](#consumablesmonitoringconsumablemonitoringcapability)
       - [Consumable (minutes) (`<CONSUMABLE-MINUTES>`)](#consumableminutesconsumable-minutes)
       - [Consumable (percent) (`<CONSUMABLE-PERCENT>`)](#consumablepercentconsumable-percent)
       - [Reset the consumable (`<CONSUMABLE-MINUTES>/reset`)](#resettheconsumableconsumable-minutesreset)
       - [Reset the consumable (`<CONSUMABLE-PERCENT>/reset`)](#resettheconsumableconsumable-percentreset)
     - [Current Statistics (`CurrentStatisticsCapability`)](#currentstatisticscurrentstatisticscapability)
       - [Current Statistics Area (`area`)](#currentstatisticsareaarea)
       - [Current Statistics Time (`time`)](#currentstatisticstimetime)
     - [Fan control (`FanSpeedControlCapability`)](#fancontrolfanspeedcontrolcapability)
       - [Fan (`preset`)](#fanpreset)
     - [Go to location (`GoToLocationCapability`)](#gotolocationgotolocationcapability)
       - [Go to location (`go`)](#gotolocationgo)
     - [Locate (`LocateCapability`)](#locatelocatecapability)
       - [Locate (`locate`)](#locatelocate)
     - [Lock Keys (`KeyLockCapability`)](#lockkeyskeylockcapability)
       - [Lock Keys (`enabled`)](#lockkeysenabled)
     - [Mode control (`OperationModeControlCapability`)](#modecontroloperationmodecontrolcapability)
       - [Mode (`preset`)](#modepreset)
     - [Obstacle Avoidance (`ObstacleAvoidanceControlCapability`)](#obstacleavoidanceobstacleavoidancecontrolcapability)
       - [Obstacle Avoidance (`enabled`)](#obstacleavoidanceenabled)
     - [Pet Obstacle Avoidance (`PetObstacleAvoidanceControlCapability`)](#petobstacleavoidancepetobstacleavoidancecontrolcapability)
       - [Pet Obstacle Avoidance (`enabled`)](#petobstacleavoidanceenabled)
     - [Segment cleaning (`MapSegmentationCapability`)](#segmentcleaningmapsegmentationcapability)
       - [Clean segments (`clean`)](#cleansegmentsclean)
     - [Speaker volume control (`SpeakerVolumeControlCapability`)](#speakervolumecontrolspeakervolumecontrolcapability)
       - [Speaker volume (`value`)](#speakervolumevalue)
     - [Total Statistics (`TotalStatisticsCapability`)](#totalstatisticstotalstatisticscapability)
       - [Total Statistics Area (`area`)](#totalstatisticsareaarea)
       - [Total Statistics Count (`count`)](#totalstatisticscountcount)
       - [Total Statistics Time (`time`)](#totalstatisticstimetime)
     - [Water control (`WaterUsageControlCapability`)](#watercontrolwaterusagecontrolcapability)
       - [Water (`preset`)](#waterpreset)
     - [Wi-Fi configuration (`WifiConfigurationCapability`)](#wi-ficonfigurationwificonfigurationcapability)
       - [Frequency (`frequency`)](#frequencyfrequency)
       - [IP addresses (`ips`)](#ipaddressesips)
       - [Signal (`signal`)](#signalsignal)
       - [Wireless network (`ssid`)](#wirelessnetworkssid)
     - [Zone cleaning (`ZoneCleaningCapability`)](#zonecleaningzonecleaningcapability)
       - [Start zoned cleaning (`start`)](#startzonedcleaningstart)
   - [Map data](#mapdata)
     - [Map segments (`segments`)](#mapsegmentssegments)
     - [Raw map data (`map-data`)](#rawmapdatamap-data)
     - [Raw map data for Home Assistant (`map-data-hass`)](#rawmapdataforhomeassistantmap-data-hass)
   - [NoCloud Events](#nocloudevents)
     - [Events (`NoCloud_events`)](#eventsnocloudevents)
     - [Interact with Events (`NoCloud_events/interact`)](#interactwitheventsnocloudeventsinteract)
   - [Status](#status)
     - [Attachment state (`AttachmentStateAttribute`)](#attachmentstateattachmentstateattribute)
       - [Dust bin (`dustbin`)](#dustbindustbin)
       - [Mop (`mop`)](#mopmop)
       - [Water tank (`watertank`)](#watertankwatertank)
     - [Battery state (`BatteryStateAttribute`)](#batterystatebatterystateattribute)
       - [Battery level (`level`)](#batterylevellevel)
       - [Battery status (`status`)](#batterystatusstatus)
     - [Dock state (`DockStatusStateAttribute`)](#dockstatedockstatusstateattribute)
       - [Status (`status`)](#statusstatus)
     - [Vacuum status (`StatusStateAttribute`)](#vacuumstatusstatusstateattribute)
       - [Error description (`error_description`)](#errordescriptionerrordescription)
       - [Robot Error (`error`)](#roboterrorerror)
       - [Status (`status`)](#statusstatus)
       - [Status flag (`flag`)](#statusflagflag)


### State attributes index

- [AttachmentStateAttribute](#attachmentstateattachmentstateattribute)
- [BatteryStateAttribute](#batterystatebatterystateattribute)
- [DockStatusStateAttribute](#dockstatedockstatusstateattribute)
- [PresetSelectionStateAttribute](#watercontrolwaterusagecontrolcapability)
- [StatusStateAttribute](#vacuumstatusstatusstateattribute)


### Home Assistant components index

- [Battery level (`sensor.mqtt`)](#batterylevellevel)
- [Carpet Mode (`switch.mqtt`)](#carpetmodeenabled)
- [Carpet Sensor Mode (`select.mqtt`)](#carpetsensormodemode)
- [Consumable (minutes) (`sensor.mqtt`)](#consumableminutesconsumable-minutes)
- [Consumable (percent) (`sensor.mqtt`)](#consumablepercentconsumable-percent)
- [Current Statistics Area (`sensor.mqtt`)](#currentstatisticsareaarea)
- [Current Statistics Time (`sensor.mqtt`)](#currentstatisticstimetime)
- [Dock Status (`sensor.mqtt`)](#statusstatus)
- [Dust bin attachment (`binary_sensor.mqtt`)](#dustbindustbin)
- [Error (`sensor.mqtt`)](#vacuumstatusstatusstateattribute)
- [Events (`sensor.mqtt`)](#eventsnocloudevents)
- [Fan (`select.mqtt`)](#fanpreset)
- [Lock Keys (`switch.mqtt`)](#lockkeysenabled)
- [Map data (`camera.mqtt`)](#rawmapdataforhomeassistantmap-data-hass)
- [Map segments (`sensor.mqtt`)](#mapsegmentssegments)
- [Mode (`select.mqtt`)](#modepreset)
- [Mop attachment (`binary_sensor.mqtt`)](#mopmop)
- [Obstacle Avoidance (`switch.mqtt`)](#obstacleavoidanceenabled)
- [Pet Obstacle Avoidance (`switch.mqtt`)](#petobstacleavoidanceenabled)
- [Play locate sound (`button.mqtt`)](#locatelocate)
- [Reset &lt;CONSUMABLE-MINUTES&gt; Consumable (`button.mqtt`)](#resettheconsumableconsumable-minutesreset)
- [Reset &lt;CONSUMABLE-PERCENT&gt; Consumable (`button.mqtt`)](#resettheconsumableconsumable-percentreset)
- [Speaker volume (`number.mqtt`)](#speakervolumevalue)
- [Status Flag (`sensor.mqtt`)](#statusflagflag)
- [Total Statistics Area (`sensor.mqtt`)](#totalstatisticsareaarea)
- [Total Statistics Count (`sensor.mqtt`)](#totalstatisticscountcount)
- [Total Statistics Time (`sensor.mqtt`)](#totalstatisticstimetime)
- [Trigger Auto Empty Dock (`button.mqtt`)](#autoemptydockmanualtriggertrigger)
- [Vacuum (`vacuum.mqtt`)](#robot)
- [Water (`select.mqtt`)](#waterpreset)
- [Water tank attachment (`binary_sensor.mqtt`)](#watertankwatertank)
- [Wi-Fi configuration (`sensor.mqtt`)](#wi-ficonfigurationwificonfigurationcapability)


# MQTT API reference

## Robot <a id="robot" />

*Device*

Home Assistant components controlled by this device:

- Vacuum ([`vacuum.mqtt`](https://www.home-assistant.io/integrations/vacuum.mqtt/))


### Capabilities <a id="capabilities" />

#### Auto Empty Dock Manual Trigger (`AutoEmptyDockManualTriggerCapability`) <a id="autoemptydockmanualtriggerautoemptydockmanualtriggercapability" />

*Node, capability: [AutoEmptyDockManualTriggerCapability](../usage/capabilities-overview.md#autoemptydockmanualtriggercapability-)*

##### Auto Empty Dock Manual Trigger (`trigger`) <a id="autoemptydockmanualtriggertrigger" />

*Property, command, not retained*

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/AutoEmptyDockManualTriggerCapability/trigger/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/AutoEmptyDockManualTriggerCapability/trigger`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `PERFORM`)

Home Assistant components controlled by this property:

- Trigger Auto Empty Dock ([`button.mqtt`](https://www.home-assistant.io/integrations/button.mqtt/))



#### Basic control (`BasicControlCapability`) <a id="basiccontrolbasiccontrolcapability" />

*Node, capability: [BasicControlCapability](../usage/capabilities-overview.md#basiccontrolcapability-)*

##### Operation (`operation`) <a id="operationoperation" />

*Property, command, not retained*

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/BasicControlCapability/operation/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/BasicControlCapability/operation`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `START`, `STOP`, `PAUSE`, `HOME`)



#### Carpet Mode (`CarpetModeControlCapability`) <a id="carpetmodecarpetmodecontrolcapability" />

*Node, capability: [CarpetModeControlCapability](../usage/capabilities-overview.md#carpetmodecontrolcapability-)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the NoCloud configuration.

##### Carpet Mode (`enabled`) <a id="carpetmodeenabled" />

*Property, readable, settable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/CarpetModeControlCapability/enabled`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/CarpetModeControlCapability/enabled/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `ON`, `OFF`)

Sample value:
```
OFF
```

Home Assistant components controlled by this property:

- Carpet Mode ([`switch.mqtt`](https://www.home-assistant.io/integrations/switch.mqtt/))



#### Carpet Sensor Mode (`CarpetSensorModeControlCapability`) <a id="carpetsensormodecarpetsensormodecontrolcapability" />

*Node, capability: [CarpetSensorModeControlCapability](../usage/capabilities-overview.md#carpetsensormodecontrolcapability-)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the NoCloud configuration.

##### Carpet Sensor Mode (`mode`) <a id="carpetsensormodemode" />

*Property, readable, settable, retained*

This handle allows setting the Carpet Sensor Mode. It accepts the preset payloads specified in `$format` or in the HAss json attributes.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/CarpetSensorModeControlCapability/mode`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/CarpetSensorModeControlCapability/mode/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `lift`, `avoid`, `off`)

> [!WARNING]
> Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

| What | Reason |
|------|--------|
| Enum payloads | Different robot models have different Carpet Sensor Modes. Always check `$format`/`json_attributes` during startup. |

Sample value:
```
lift
```

Home Assistant components controlled by this property:

- Carpet Sensor Mode ([`select.mqtt`](https://www.home-assistant.io/integrations/select.mqtt/))



#### Consumables monitoring (`ConsumableMonitoringCapability`) <a id="consumablesmonitoringconsumablemonitoringcapability" />

*Node, capability: [ConsumableMonitoringCapability](../usage/capabilities-overview.md#consumablemonitoringcapability-)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the NoCloud configuration.

> [!WARNING]
> Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

| What | Reason |
|------|--------|
| Properties | Consumables depend on the robot model. |
| Property datatype and units | Some robots send consumables as remaining time, others send them as endurance percent remaining. |

##### Consumable (minutes) (`<CONSUMABLE-MINUTES>`) <a id="consumableminutesconsumable-minutes" />

*Property, readable, retained*

This handle returns the consumable remaining endurance time as an int representing seconds remaining.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/ConsumableMonitoringCapability/<CONSUMABLE-MINUTES>`
- Data type: [integer](https://homieiot.github.io/specification/#integer)

Sample value:
```json
29520
```

Home Assistant components controlled by this property:

- Consumable (minutes) ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))


##### Reset the consumable (`<CONSUMABLE-MINUTES>/reset`) <a id="resettheconsumableconsumable-minutesreset" />

*Property, command, not retained*

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/ConsumableMonitoringCapability/<CONSUMABLE-MINUTES>/reset/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/ConsumableMonitoringCapability/<CONSUMABLE-MINUTES>/reset`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `PERFORM`)

Home Assistant components controlled by this property:

- Reset &lt;CONSUMABLE-MINUTES&gt; Consumable ([`button.mqtt`](https://www.home-assistant.io/integrations/button.mqtt/))


##### Consumable (percent) (`<CONSUMABLE-PERCENT>`) <a id="consumablepercentconsumable-percent" />

*Property, readable, retained*

This handle returns the consumable remaining endurance percentage.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/ConsumableMonitoringCapability/<CONSUMABLE-PERCENT>`
- Data type: [integer percentage](https://homieiot.github.io/specification/#percent) (range: 0 to 100, unit: %)

Sample value:
```json
59
```

Home Assistant components controlled by this property:

- Consumable (percent) ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))


##### Reset the consumable (`<CONSUMABLE-PERCENT>/reset`) <a id="resettheconsumableconsumable-percentreset" />

*Property, command, not retained*

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/ConsumableMonitoringCapability/<CONSUMABLE-PERCENT>/reset/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/ConsumableMonitoringCapability/<CONSUMABLE-PERCENT>/reset`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `PERFORM`)

Home Assistant components controlled by this property:

- Reset &lt;CONSUMABLE-PERCENT&gt; Consumable ([`button.mqtt`](https://www.home-assistant.io/integrations/button.mqtt/))



#### Current Statistics (`CurrentStatisticsCapability`) <a id="currentstatisticscurrentstatisticscapability" />

*Node, capability: [CurrentStatisticsCapability](../usage/capabilities-overview.md#currentstatisticscapability-)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the NoCloud configuration.

> [!WARNING]
> Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

| What | Reason |
|------|--------|
| Properties | Available statistics depend on the robot model. |

##### Current Statistics Area (`area`) <a id="currentstatisticsareaarea" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/CurrentStatisticsCapability/area`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (unit: cm²)

Sample value:
```json
630000
```

Home Assistant components controlled by this property:

- Current Statistics Area ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))


##### Current Statistics Time (`time`) <a id="currentstatisticstimetime" />

*Property, readable, retained*

This handle returns the current statistics time in seconds

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/CurrentStatisticsCapability/time`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (unit: s)

Sample value:
```json
1440
```

Home Assistant components controlled by this property:

- Current Statistics Time ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))



#### Fan control (`FanSpeedControlCapability`) <a id="fancontrolfanspeedcontrolcapability" />

*Node, capability: [FanSpeedControlCapability](../usage/capabilities-overview.md#fanspeedcontrolcapability-)*

Status attributes managed by this node:

- PresetSelectionStateAttribute

##### Fan (`preset`) <a id="fanpreset" />

*Property, readable, settable, retained*

This handle allows setting the fan. It accepts the preset payloads specified in `$format` or in the HAss json attributes.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/FanSpeedControlCapability/preset`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/FanSpeedControlCapability/preset/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `off`, `min`, `low`, `medium`, `high`, `turbo`, `max`)

> [!WARNING]
> Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

| What | Reason |
|------|--------|
| Enum payloads | Different robot models have different fan presets. Always check `$format`/`json_attributes` during startup. |

Sample value:
```
max
```

Home Assistant components controlled by this property:

- Fan ([`select.mqtt`](https://www.home-assistant.io/integrations/select.mqtt/))



#### Go to location (`GoToLocationCapability`) <a id="gotolocationgotolocationcapability" />

*Node, capability: [GoToLocationCapability](../usage/capabilities-overview.md#gotolocationcapability-)*

##### Go to location (`go`) <a id="gotolocationgo" />

*Property, command, not retained*

This handle accepts a JSON object identical to the one used by the REST API.

Simply use the Map in the NoCloud UI, place the GoTo marker and then long-press the button that would start the action.<br/>
This will open a modal containing the copy-pasteable payload.

Sample payload:

```json
{
  "coordinates": {
    "x": 50,
    "y": 50
  }
}
```

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/GoToLocationCapability/go/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/GoToLocationCapability/go`
- Data type: [string](https://homieiot.github.io/specification/#string) (format: `same json as the REST interface`)



#### Lock Keys (`KeyLockCapability`) <a id="lockkeyskeylockcapability" />

*Node, capability: [KeyLockCapability](../usage/capabilities-overview.md#keylockcapability-)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the NoCloud configuration.

##### Lock Keys (`enabled`) <a id="lockkeysenabled" />

*Property, readable, settable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/KeyLockCapability/enabled`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/KeyLockCapability/enabled/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `ON`, `OFF`)

Sample value:
```
OFF
```

Home Assistant components controlled by this property:

- Lock Keys ([`switch.mqtt`](https://www.home-assistant.io/integrations/switch.mqtt/))



#### Locate (`LocateCapability`) <a id="locatelocatecapability" />

*Node, capability: [LocateCapability](../usage/capabilities-overview.md#locatecapability-)*

##### Locate (`locate`) <a id="locatelocate" />

*Property, command, not retained*

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/LocateCapability/locate/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/LocateCapability/locate`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `PERFORM`)

Home Assistant components controlled by this property:

- Play locate sound ([`button.mqtt`](https://www.home-assistant.io/integrations/button.mqtt/))



#### Segment cleaning (`MapSegmentationCapability`) <a id="segmentcleaningmapsegmentationcapability" />

*Node, capability: [MapSegmentationCapability](../usage/capabilities-overview.md#mapsegmentationcapability-)*

##### Clean segments (`clean`) <a id="cleansegmentsclean" />

*Property, command, not retained*

This handle accepts a JSON object identical to the one used by the REST API.

Simply use the Map in the NoCloud UI, select the desired segments and iterations and then long-press the button that would start the action.<br/>
This will open a modal containing the copy-pasteable payload.

Sample payload:

```json
{
  "segment_ids": [
    "20",
    "18",
    "16"
  ],
  "iterations": 2,
  "customOrder": true
}
```

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapSegmentationCapability/clean/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapSegmentationCapability/clean`
- Data type: [string](https://homieiot.github.io/specification/#string) (format: `same json as the REST interface`)



#### Obstacle Avoidance (`ObstacleAvoidanceControlCapability`) <a id="obstacleavoidanceobstacleavoidancecontrolcapability" />

*Node, capability: [ObstacleAvoidanceControlCapability](../usage/capabilities-overview.md#obstacleavoidancecontrolcapability-)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the NoCloud configuration.

##### Obstacle Avoidance (`enabled`) <a id="obstacleavoidanceenabled" />

*Property, readable, settable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/ObstacleAvoidanceControlCapability/enabled`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/ObstacleAvoidanceControlCapability/enabled/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `ON`, `OFF`)

Sample value:
```
ON
```

Home Assistant components controlled by this property:

- Obstacle Avoidance ([`switch.mqtt`](https://www.home-assistant.io/integrations/switch.mqtt/))



#### Mode control (`OperationModeControlCapability`) <a id="modecontroloperationmodecontrolcapability" />

*Node, capability: [OperationModeControlCapability](../usage/capabilities-overview.md#operationmodecontrolcapability-)*

Status attributes managed by this node:

- PresetSelectionStateAttribute

##### Mode (`preset`) <a id="modepreset" />

*Property, readable, settable, retained*

This handle allows setting the mode. It accepts the preset payloads specified in `$format` or in the HAss json attributes.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/OperationModeControlCapability/preset`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/OperationModeControlCapability/preset/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `mop`, `vacuum`, `vacuum_and_mop`)

> [!WARNING]
> Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

| What | Reason |
|------|--------|
| Enum payloads | Different robot models have different mode presets. Always check `$format`/`json_attributes` during startup. |

Sample value:
```
vacuum
```

Home Assistant components controlled by this property:

- Mode ([`select.mqtt`](https://www.home-assistant.io/integrations/select.mqtt/))



#### Pet Obstacle Avoidance (`PetObstacleAvoidanceControlCapability`) <a id="petobstacleavoidancepetobstacleavoidancecontrolcapability" />

*Node, capability: [PetObstacleAvoidanceControlCapability](../usage/capabilities-overview.md#petobstacleavoidancecontrolcapability-)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the NoCloud configuration.

##### Pet Obstacle Avoidance (`enabled`) <a id="petobstacleavoidanceenabled" />

*Property, readable, settable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/PetObstacleAvoidanceControlCapability/enabled`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/PetObstacleAvoidanceControlCapability/enabled/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `ON`, `OFF`)

Sample value:
```
ON
```

Home Assistant components controlled by this property:

- Pet Obstacle Avoidance ([`switch.mqtt`](https://www.home-assistant.io/integrations/switch.mqtt/))



#### Speaker volume control (`SpeakerVolumeControlCapability`) <a id="speakervolumecontrolspeakervolumecontrolcapability" />

*Node, capability: [SpeakerVolumeControlCapability](../usage/capabilities-overview.md#speakervolumecontrolcapability-)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the NoCloud configuration.

##### Speaker volume (`value`) <a id="speakervolumevalue" />

*Property, readable, settable, retained*

This handle returns the current speaker volume

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/SpeakerVolumeControlCapability/value`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/SpeakerVolumeControlCapability/value/set`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (range: 0 to 100)

Sample value:
```json
80
```

Home Assistant components controlled by this property:

- Speaker volume ([`number.mqtt`](https://www.home-assistant.io/integrations/number.mqtt/))



#### Total Statistics (`TotalStatisticsCapability`) <a id="totalstatisticstotalstatisticscapability" />

*Node, capability: [TotalStatisticsCapability](../usage/capabilities-overview.md#totalstatisticscapability-)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the NoCloud configuration.

> [!WARNING]
> Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

| What | Reason |
|------|--------|
| Properties | Available statistics depend on the robot model. |

##### Total Statistics Area (`area`) <a id="totalstatisticsareaarea" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/TotalStatisticsCapability/area`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (unit: cm²)

Sample value:
```json
3150000
```

Home Assistant components controlled by this property:

- Total Statistics Area ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))


##### Total Statistics Count (`count`) <a id="totalstatisticscountcount" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/TotalStatisticsCapability/count`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (unit: #)

Sample value:
```json
5
```

Home Assistant components controlled by this property:

- Total Statistics Count ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))


##### Total Statistics Time (`time`) <a id="totalstatisticstimetime" />

*Property, readable, retained*

This handle returns the total statistics time in seconds

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/TotalStatisticsCapability/time`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (unit: s)

Sample value:
```json
7200
```

Home Assistant components controlled by this property:

- Total Statistics Time ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))



#### Water control (`WaterUsageControlCapability`) <a id="watercontrolwaterusagecontrolcapability" />

*Node, capability: [WaterUsageControlCapability](../usage/capabilities-overview.md#waterusagecontrolcapability-)*

Status attributes managed by this node:

- PresetSelectionStateAttribute

##### Water (`preset`) <a id="waterpreset" />

*Property, readable, settable, retained*

This handle allows setting the water. It accepts the preset payloads specified in `$format` or in the HAss json attributes.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WaterUsageControlCapability/preset`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/WaterUsageControlCapability/preset/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `off`, `min`, `low`, `medium`, `high`, `max`)

> [!WARNING]
> Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

| What | Reason |
|------|--------|
| Enum payloads | Different robot models have different water presets. Always check `$format`/`json_attributes` during startup. |

Sample value:
```
min
```

Home Assistant components controlled by this property:

- Water ([`select.mqtt`](https://www.home-assistant.io/integrations/select.mqtt/))



#### Wi-Fi configuration (`WifiConfigurationCapability`) <a id="wi-ficonfigurationwificonfigurationcapability" />

*Node, capability: [WifiConfigurationCapability](../usage/capabilities-overview.md#wificonfigurationcapability-)*

Home Assistant components controlled by this node:

- Wi-Fi configuration ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))

##### Frequency (`frequency`) <a id="frequencyfrequency" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/frequency`
- Data type: [string](https://homieiot.github.io/specification/#string)

Sample value:
```
2.4ghz
```


##### IP addresses (`ips`) <a id="ipaddressesips" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/ips`
- Data type: [string](https://homieiot.github.io/specification/#string)

Sample value:
```
192.168.100.100,fe80::1ff:fe23:4567:890a,fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff
```


##### Signal (`signal`) <a id="signalsignal" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/signal`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (unit: dBm)

Sample value:
```json
-48
```


##### Wireless network (`ssid`) <a id="wirelessnetworkssid" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/ssid`
- Data type: [string](https://homieiot.github.io/specification/#string)

Sample value:
```
NoCloud Wi-Fi
```



#### Zone cleaning (`ZoneCleaningCapability`) <a id="zonecleaningzonecleaningcapability" />

*Node, capability: [ZoneCleaningCapability](../usage/capabilities-overview.md#zonecleaningcapability-)*

##### Start zoned cleaning (`start`) <a id="startzonedcleaningstart" />

*Property, command, not retained*

This handle accepts a JSON object identical to the one used by the REST API.

Simply use the Map in the NoCloud UI, create the desired zones, select the desired iterations and then long-press the button that would start the action.<br/>
This will open a modal containing the copy-pasteable payload.

Sample payload:

```json
{
  "zones": [
    {
      "points": {
        "pA": {
          "x": 50,
          "y": 50
        },
        "pB": {
          "x": 100,
          "y": 50
        },
        "pC": {
          "x": 100,
          "y": 100
        },
        "pD": {
          "x": 50,
          "y": 100
        }
      }
    }
  ],
  "iterations": 1
}
```

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/ZoneCleaningCapability/start/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/ZoneCleaningCapability/start`
- Data type: [string](https://homieiot.github.io/specification/#string) (format: `same json as the REST interface`)



### Map data <a id="mapdata" />

*Node*

This handle groups access to map data. It is only enabled if `provideMapData` is enabled in the MQTT config.

#### Raw map data (`map-data`) <a id="rawmapdatamap-data" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapData/map-data`
- Data type: [string](https://homieiot.github.io/specification/#string) (format: `json, but deflated`)


#### Raw map data for Home Assistant (`map-data-hass`) <a id="rawmapdataforhomeassistantmap-data-hass" />

*Property, readable, retained*

This handle is added automatically if Home Assistant autodiscovery is enabled. It provides a map embedded in a PNG image that recommends installing the NoCloud Lovelace card.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapData/map-data-hass`
- Data type: [string](https://homieiot.github.io/specification/#string)

Home Assistant components controlled by this property:

- Map data ([`camera.mqtt`](https://www.home-assistant.io/integrations/camera.mqtt/))


#### Map segments (`segments`) <a id="mapsegmentssegments" />

*Property, readable, retained*

This property contains a JSON mapping of segment IDs to segment names.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapData/segments`
- Data type: [string](https://homieiot.github.io/specification/#string) (JSON)

Sample value:
```json
{
  "16": "Hallway",
  "18": "Bathroom",
  "20": "Kitchen"
}
```

Home Assistant components controlled by this property:

- Map segments ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))



### NoCloud Events <a id="nocloudevents" />

*Node*

#### Events (`NoCloud_events`) <a id="eventsnocloudevents" />

*Property, readable, retained*

This property contains all raised and not yet processed NoCloudEvents.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/NoCloudEvents/NoCloud_events`
- Data type: [string](https://homieiot.github.io/specification/#string) (JSON)

Sample value:
```json
{
  "22a1e773-87ed-48e5-8530-d54dc396904f": {
    "__class": "ErrorStateNoCloudEvent",
    "metaData": {},
    "id": "22a1e773-87ed-48e5-8530-d54dc396904f",
    "timestamp": "2026-01-20T21:47:24.946Z",
    "processed": false,
    "message": "This is an error message"
  },
  "pending_map_change": {
    "__class": "PendingMapChangeNoCloudEvent",
    "metaData": {},
    "id": "pending_map_change",
    "timestamp": "2026-01-20T21:47:24.946Z",
    "processed": false
  },
  "mop_attachment_reminder": {
    "__class": "MopAttachmentReminderNoCloudEvent",
    "metaData": {},
    "id": "mop_attachment_reminder",
    "timestamp": "2026-01-20T21:47:24.946Z",
    "processed": false
  },
  "199b73a3-6917-48b7-9c47-dd45963b4a47": {
    "__class": "DustBinFullNoCloudEvent",
    "metaData": {},
    "id": "199b73a3-6917-48b7-9c47-dd45963b4a47",
    "timestamp": "2026-01-20T21:47:24.946Z",
    "processed": false
  }
}
```

Home Assistant components controlled by this property:

- Events ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))


#### Interact with Events (`NoCloud_events/interact`) <a id="interactwitheventsnocloudeventsinteract" />

*Property, command, not retained*

Note that the interaction payload is event-specific, but for most use-cases, the example should be sufficient.

Sample payload for a dismissible event (e.g. an ErrorStateNoCloudEvent):

```json
{
  "id": "b89bd27c-5563-4cfd-87df-2f23e8bbeef7",
  "interaction": "ok"
}
```

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/NoCloudEvents/NoCloud_events/interact/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/NoCloudEvents/NoCloud_events/interact`
- Data type: [string](https://homieiot.github.io/specification/#string) (JSON)



### Status <a id="status" />

#### Attachment state (`AttachmentStateAttribute`) <a id="attachmentstateattachmentstateattribute" />

*Node*

Status attributes managed by this node:

- AttachmentStateAttribute

##### Dust bin (`dustbin`) <a id="dustbindustbin" />

*Property, readable, retained*

This handle reports whether the dust bin attachment is installed.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/AttachmentStateAttribute/dustbin`
- Data type: [boolean](https://homieiot.github.io/specification/#boolean)

Sample value:
```json
true
```

Home Assistant components controlled by this property:

- Dust bin attachment ([`binary_sensor.mqtt`](https://www.home-assistant.io/integrations/binary_sensor.mqtt/))


##### Mop (`mop`) <a id="mopmop" />

*Property, readable, retained*

This handle reports whether the mop attachment is installed.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/AttachmentStateAttribute/mop`
- Data type: [boolean](https://homieiot.github.io/specification/#boolean)

Sample value:
```json
false
```

Home Assistant components controlled by this property:

- Mop attachment ([`binary_sensor.mqtt`](https://www.home-assistant.io/integrations/binary_sensor.mqtt/))


##### Water tank (`watertank`) <a id="watertankwatertank" />

*Property, readable, retained*

This handle reports whether the water tank attachment is installed.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/AttachmentStateAttribute/watertank`
- Data type: [boolean](https://homieiot.github.io/specification/#boolean)

Sample value:
```json
true
```

Home Assistant components controlled by this property:

- Water tank attachment ([`binary_sensor.mqtt`](https://www.home-assistant.io/integrations/binary_sensor.mqtt/))



#### Battery state (`BatteryStateAttribute`) <a id="batterystatebatterystateattribute" />

*Node*

Status attributes managed by this node:

- BatteryStateAttribute

##### Battery level (`level`) <a id="batterylevellevel" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/BatteryStateAttribute/level`
- Data type: [integer percentage](https://homieiot.github.io/specification/#percent) (unit: %)

Sample value:
```json
42
```

Home Assistant components controlled by this property:

- Battery level ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))


##### Battery status (`status`) <a id="batterystatusstatus" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/BatteryStateAttribute/status`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `none`, `charging`, `discharging`, `charged`)

Sample value:
```
charging
```



#### Dock state (`DockStatusStateAttribute`) <a id="dockstatedockstatusstateattribute" />

*Node*

Status attributes managed by this node:

- DockStatusStateAttribute

##### Status (`status`) <a id="statusstatus" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/DockStatusStateAttribute/status`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `error`, `idle`, `pause`, `emptying`, `cleaning`, `drying`)

Sample value:
```
idle
```

Home Assistant components controlled by this property:

- Dock Status ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))



#### Vacuum status (`StatusStateAttribute`) <a id="vacuumstatusstatusstateattribute" />

*Node*

Status attributes managed by this node:

- StatusStateAttribute

Home Assistant components controlled by this node:

- Error ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))

##### Robot Error (`error`) <a id="roboterrorerror" />

*Property, readable, retained*

This property contains the current NoCloudRobotError (if any)

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/StatusStateAttribute/error`
- Data type: [string](https://homieiot.github.io/specification/#string) (JSON)

Sample value:
```json
{
  "severity": {
    "kind": "none",
    "level": "none"
  },
  "subsystem": "none",
  "message": ""
}
```


##### Error description (`error_description`) <a id="errordescriptionerrordescription" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/StatusStateAttribute/error_description`
- Data type: [string](https://homieiot.github.io/specification/#string)

Sample value:
```
No error
```


##### Status flag (`flag`) <a id="statusflagflag" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/StatusStateAttribute/flag`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `none`, `zone`, `segment`, `spot`, `target`, `resumable`, `mapping`)

Sample value:
```
segment
```

Home Assistant components controlled by this property:

- Status Flag ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))


##### Status (`status`) <a id="statusstatus" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/StatusStateAttribute/status`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `error`, `docked`, `idle`, `returning`, `cleaning`, `paused`, `manual_control`, `moving`)

Sample value:
```
cleaning
```



