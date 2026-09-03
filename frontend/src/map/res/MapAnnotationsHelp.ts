export const MapAnnotationsHelp = `
## Map Annotations

Map annotations are the generic concept to house any kind of "there is something on the map the robot needs to be aware of, which might not be reliably auto-determined".
For example, depending on firmware support, that could be a curtain, a ramp, a passable threshold or similar.

These things existing in the map make the firmware behave differently in some way relating to the location they're at.
It might then take a specific path or trust its obstacle avoidance less or really anything like that.

Specifically:

#### Curtains

Curtains hint the firmware that the obstacle it is looking at actually isn't one and that it can just drive into it.
Without the annotation, it doesn't realize that that is the case.

#### Ramps

Ramps hint the firmware that there is a working dedicated path to take to reach a specific area.
Without the annotation, it might not realize that it exists.

#### Thresholds

Thresholds hint the firmware that the obstacle it is seeing is actually something it can cross if it just tries harder.
Without the annotation, it might not realize that it can.

`;
