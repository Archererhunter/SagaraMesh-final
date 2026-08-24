# Improved Website Brief — SagaraMesh Coastal Operations Dashboard

Build a responsive static web dashboard inspired by the supplied OceanGuard reference, adapted for **SagaraMesh**: a Tamil Nadu / India focused fisherman safety and offshore connectivity command platform.

## Positioning
SagaraMesh is a renewable-powered buoy mesh that relays SOS alerts, GPS locations, weather warnings, fishing-zone permissions, and rescue acknowledgements when mobile networks fail offshore.

## Audience
- Coastal control room operators
- Fisheries department / Coast Guard coordinators
- Hackathon judges and demo viewers
- Fishermen safety network administrators

## Visual direction
- Dark maritime command-center UI
- Deep navy background, glass panels, cyan borders, green operational status, amber warning accents, red SOS states
- Dense but readable cockpit layout similar to the reference dashboard
- India/Tamil Nadu terminology and content

## Required sections
1. Left navigation: Overview, Live Map, Weather, Fishing Zones, Distress, Buoys, Messages, Reports, Settings.
2. Header: SagaraMesh brand, Tamil Nadu Coastal Safety Grid selector, search, system status, alerts, operator profile.
3. KPI cards: sea weather, mesh link status, active buoys, tracked vessels.
4. Live maritime map: Tamil Nadu coast, Bay of Bengal, buoys, vessels, distress marker, permitted/restricted/risk zones, legend, zoom controls.
5. Right rail: marine warnings, nearby distress, emergency buoy link, message input and emergency relay trigger.
6. Bottom cards: 24-hour forecast chart, fishing permission status, recent communications timeline.

## Interactions
- Clicking sidebar items switches page context/highlight text.
- Clicking buoy/vessel/SOS markers updates selected asset and buoy-link panel.
- Search filters/selects visible assets by id.
- Send Message appends a timeline event.
- Respond button acknowledges the distress card.
- Emergency Relay button simulates relay activation and updates status.
- Clock updates in IST.

## Constraints
- Static site only: HTML, CSS, JavaScript.
- No copyrighted map/image assets; use original SVG/CSS map approximation.
- Mobile responsive: dashboard stacks on smaller screens.
- Suitable for hackathon demo and GitHub Pages/local preview.
