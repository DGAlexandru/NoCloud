Sources: </br>
  https://home.miot-spec.com/spec/dreame.vacuum.r2232c (DreameBot L10s Prime) </br>
  https://home.miot-spec.com/spec/dreame.vacuum.r2228z (DreameBot L10s Ultra) </br>
  https://home.miot-spec.com/spec/dreame.vacuum.r2232 (?) </br>
  https://home.miot-spec.com/spec/dreame.vacuum.r2320 (?) </br>
  https://home.miot-spec.com/spec/xiaomi.vacuum.d103cn (Mijia All-round Sweeping and Mopping Robot M30 S) </br>

SIID 2 = Robot Cleaner or vacuum
  - PIID 1 = Status (uint8); Read / Notifications
    - 1 - Sweeping
    - 2 - Idle
    - 3 - Paused
    - 4 - Error
    - 5 - Go Charging
    - 6 - Charging
    - 7 - Mopping
    - 8 - Drying
    - 9 - Washing
    - 10 - Go Washing
    - 11 - Building
    - 12 - Sweeping and Mopping
    - 13 - Charging Completed
    - 14 - Upgrading
    - 15 - Summon
    - 16 - Self Repairing
    - 17 - Back Install Mop
    - 18 - Back Remove Mop
    - 19 - WaterInspecting (xiaomi)
    - 21 - WashingMopPause (xiaomi)
    - 22 - DustCollecting (xiaomi)
    - 23 - RemoteClean (xiaomi)
    - 30 - SelfStationClean (xiaomi)
- PIID 2 = Fault (uint8); Read / Notifications
    - Range: 0 ~ 255
    - Step: 1
- PIID 3 = Mode (uint8); Read / Write / Notifications
    - 0 - Silent
    - 1 - Basic
    - 2 - Strong
    - 3 - Full Speed
- PIID 4 = Room IDs (string)
- AIID 1 = Start Sweep
- AIID 2 = Stop Sweeping
- AIID 3 = Start Room Sweep
  - optional parameter: Room IDs

SIID 3 = Battery
  - PIID 1 = Battery Level (uint8); percentage; Read / Notification
    - Range: 0 ~ 100
    - Step: 1
  - PIID 2 = Charging State	(uint8); Read / Notification
    - 1 - Charging
    - 2 - Not Charging
    - 5 - Go Charging
  - AIID 1 = Start Charge
