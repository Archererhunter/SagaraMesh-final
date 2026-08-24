# Judge Q&A

## What problem are you solving?

We are solving unreliable emergency communication for fishermen at sea, especially where mobile networks are unavailable. The system helps send SOS, share location, receive warnings, and coordinate rescue quickly.

## How is SagaraMesh different from ISRO DAT-SG?

ISRO DAT-SG is an important satellite distress system. SagaraMesh differs because it is shared floating infrastructure using local buoy-to-buoy mesh, renewable power, automatic distress detection, and autonomous rescue assessment through drone/payload/ROV modules.

## Why use LoRa?

LoRa is long-range, low-power, low-cost, and suitable for small data like SOS, GPS, and alerts. It is practical for MVP demonstration.

## Can LoRa send live video?

No. LoRa is for small emergency data. Drone video requires a separate high-bandwidth link or compressed images/status reports.

## How does the buoy detect anchor detachment?

It uses anchor tension sensing, GPS drift monitoring, IMU movement data, and distance from the preset GPS coordinate. If drifting is detected, it alerts the command center and activates thrusters.

## Is the underwater robot necessary?

No. It is an advanced module. The MVP focuses on communication, GPS, dashboard alerts, automatic distress detection, and simulated deployment.

## Can you build it?

Yes. The MVP can be built with ESP32/Pico, LoRa, GPS, SOS button, solar panel, battery, waterproof box, receiver gateway, dashboard, IMU, and water-level sensors. Advanced marine-grade features would be future modules.

## Why can this win?

It solves a life-or-death problem, is relevant to Tamil Nadu and India, combines hardware, renewable energy, communication, robotics, and disaster management, has a feasible MVP, and scales from one village to a coastline.
