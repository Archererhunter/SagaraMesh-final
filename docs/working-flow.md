# Working Flow

## Main SOS Flow

```text
Boat / Fisherman in Distress
        ↓
SOS Signal or Automatic Distress Detected
        ↓
GPS Location + Emergency Type Captured
        ↓
Nearest Floating SagaraMesh Buoy
        ↓
Buoy-to-Buoy Mesh Relay
        ↓
Shore Gateway / Command Center
        ↓
Rescue Team + Family Alert
        ↓
Acknowledgement Sent Back to Fisherman
        ↓
Drone / Payload / ROV Assessment if Needed
        ↓
Rescue Action
```

## Weather Alert Flow

```text
Weather Department / Shore Station
        ↓
SagaraMesh Buoys
        ↓
Tamil / Local-language Alert Broadcast
        ↓
Fishermen Receive Warning
        ↓
Boats Return or Move to Safe Route
```

## Anchor Detachment Flow

```text
Buoy anchored at preset GPS location
        ↓
GPS + Anchor Tension Sensor Monitoring
        ↓
Anchor Detached / Buoy Drifting Detected
        ↓
Alert Sent to Command Center
        ↓
Thrusters Activated
        ↓
Buoy Navigates Back to Preset GPS Coordinate
        ↓
Position Stabilized
        ↓
System Returns to Monitoring Mode
```

## Automatic Distress Detection Flow

```text
Boat moving normally
        ↓
IMU detects unusual tilt / water sensor detects flooding
        ↓
Device gives local buzzer/LED warning
        ↓
If danger continues beyond threshold
        ↓
Automatic SOS is triggered
        ↓
GPS + emergency type sent to nearest buoy
        ↓
Buoy relays alert to command center
```
