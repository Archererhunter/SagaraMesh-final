# SagaraMesh

**Live Dashboard:** https://archererhunter.github.io/SagaraMesh-final/

**Solar & Wave Powered Autonomous Floating Sea Rescue Mesh for Fishermen Safety**

SagaraMesh is a shared renewable-powered floating communication and rescue infrastructure for coastal fishermen. It uses smart buoys placed across fishing routes to relay SOS alerts, GPS locations, weather warnings, and rescue messages between boats and shore command centers when mobile networks fail.

In advanced deployments, SagaraMesh can deploy a drone, emergency payload, or underwater robot/ROV to assess distress situations and report back to the command center. The buoy can also detect anchor detachment and move back to its preset GPS coordinate using GPS, IMU, anchor sensors, and thrusters.

## One-line Pitch

> SagaraMesh turns the sea itself into a safety and rescue network.

## Key Uses

- Emergency SOS alert from fishermen
- GPS location sharing
- Faster rescue response
- Weather, cyclone, storm, and tsunami warning broadcast
- Two-way communication and rescue acknowledgement
- Works without mobile network using LoRa/radio mesh
- Boat tracking and last-known-location support
- Tamil/local-language alerts
- International boundary warning
- Disaster communication backup
- Family notification
- Fishing route safety support
- Night-time LED beacon
- Weather and sea-condition monitoring
- Pollution and water-quality monitoring in future versions
- Coast Guard and rescue coordination
- Community safety network
- Low-cost sea connectivity layer
- Multi-purpose coastal infrastructure
- Automatic abnormal tilt/flooding/sinking detection

## How It Works

```text
Fisherman / Boat in Distress
        ↓
SOS button pressed or distress detected automatically
        ↓
Boat device captures GPS location + emergency type
        ↓
Nearest SagaraMesh buoy receives alert
        ↓
Buoy relays message through buoy-to-buoy mesh
        ↓
Shore command center receives alert
        ↓
Drone / payload / underwater robot deployed if needed
        ↓
Situation report sent to command center
        ↓
Rescue team dispatched
        ↓
Acknowledgement sent back to fisherman
```

## MVP Demo

A hackathon MVP can demonstrate:

1. Press SOS on boat device
2. Capture/simulate GPS location
3. Send alert using LoRa
4. Receive alert at buoy/shore receiver
5. Show location and emergency type on dashboard
6. Send acknowledgement back
7. Simulate drone/payload/ROV deployment
8. Simulate anchor detachment and GPS self-correction
9. Simulate abnormal tilt/flooding automatic SOS

## Repository Structure

```text
SagaraMesh/
├── README.md
├── website/
│   ├── index.html
│   ├── IMPROVED_PROMPT.md
│   └── assets/
│       ├── styles.css
│       └── app.js
├── docs/
│   ├── project-description.md
│   ├── working-flow.md
│   ├── components.md
│   ├── existing-solutions.md
│   ├── feasibility.md
│   ├── bill-of-materials.md
│   └── judge-qa.md
└── assets/
    ├── SagaraMesh_Flowchart.png
    ├── SagaraMesh_deck_no_gamma_watermark.pptx
    └── SagaraMesh_Judge_Speech_and_QA.pdf
```

## Dashboard Prototype

A static OceanGuard-inspired SagaraMesh coastal operations dashboard is available in `website/`.

Preview locally:

```bash
cd website
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://127.0.0.1:4173/`.

## Status

Concept and hackathon prototype planning stage.
