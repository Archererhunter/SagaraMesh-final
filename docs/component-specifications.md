# SagaraMesh Component Specifications

> These are recommended prototype/MVP specifications for the SagaraMesh hackathon build. Final sea deployment must use certified marine-grade, corrosion-resistant, waterproof, frequency-compliant parts.

## 1. Fisherman Boat Device

| Part | Recommended specification for prototype | Purpose in SagaraMesh | Final deployment upgrade |
|---|---|---|---|
| SOS push button | Waterproof momentary push button, IP65/IP67, large red cap, 3.3V/5V logic input, long-press firmware trigger | Manual distress alert from fisherman | Guarded marine emergency push button, IP67/IP68, anti-accidental press cover |
| Microcontroller | ESP32 DevKit / Arduino Nano / Raspberry Pi Pico; 3.3V logic; low-power sleep support; UART/SPI/I2C pins | Reads GPS/sensors, creates SOS packet, controls LoRa and indicators | Rugged low-power MCU board with conformal coating and watchdog |
| GPS/GNSS module | u-blox NEO-6M / NEO-M8N class; UART; 3.3V/5V module; external ceramic/active antenna; typical 2.5 m accuracy in open sky | Provides boat latitude/longitude and last-known location | Multi-GNSS receiver with external waterproof antenna and faster cold start |
| LoRa radio module | SX1278/SX1276/SX1262; SPI interface; 3.3V; selectable legal band; low data-rate long-range packets | Sends SOS, GPS, battery, and status to nearest buoy/shore receiver | Certified LoRa/ISM radio module with region-compliant frequency and output power |
| Boat antenna | 433/868/915 MHz LoRa whip/fiberglass antenna, SMA connector, mounted high above waterline | Improves radio range from boat to buoy | Marine-grade fiberglass antenna, waterproof cable, lightning/surge protection |
| Battery | 3.7V Li-ion or 6.4/12.8V LiFePO4 pack; protected BMS; capacity based on runtime target, commonly 2000–10000 mAh for prototype | Powers boat device during fishing trip | Replaceable protected LiFePO4 pack with waterproof charging and battery gauge |
| Battery charger/protection | TP4056 for single-cell Li-ion prototype or LiFePO4 charger/BMS; overcharge/overdischarge protection | Safe battery charging and protection | Marine-rated BMS with fuse, reverse-polarity and overcurrent protection |
| Optional solar charger | 5W–10W small/flexible solar panel with charge controller | Extends battery life during long trips | UV/salt-resistant flexible marine solar panel |
| Indicator LEDs | Red/green/yellow high-brightness LEDs with resistors | Shows power, signal, SOS sent, acknowledgement received | Sunlight-readable waterproof LED indicators |
| Small display | 0.96–1.3 inch OLED/I2C display or 16x2 LCD; 3.3V/5V | Shows GPS lock, signal, alert status, acknowledgement | Waterproof sunlight-readable display with Tamil/local-language alert support |
| Buzzer | Piezo buzzer, 3.3V/5V active buzzer or waterproof 12V buzzer | Local warning for SOS/auto-distress/acknowledgement | Loud waterproof marine buzzer/siren |
| IMU tilt sensor | MPU6050/BNO055/ICM-20948; I2C; accelerometer + gyroscope; optional magnetometer | Detects capsize risk, unusual tilt, impact, collision movement | Calibrated marine IMU with boat-specific thresholds |
| Water level/flood sensor | Float switch, bilge water sensor, or conductive water sensor; digital input | Detects flooding/water entering boat and triggers auto-SOS | Rugged bilge sensor with saltwater-resistant contacts |
| Pressure/depth sensor | Waterproof pressure sensor/transducer; I2C/analog depending on module | Detects submersion/sinking risk | Marine depth/pressure transducer with sealed connector |
| Waterproof casing | IP67 handheld plastic enclosure with rubber gasket and cable glands | Protects boat electronics from rain, spray, and salt | Floating rugged IP68 enclosure with shock-resistant mount |
| Charging port | Rubber-sealed USB-C/DC jack or magnetic waterproof connector | Recharge boat device safely | Marine-grade waterproof charging connector |
| Mount/strap | Bracket, Velcro strap, or clamp | Fixes device to boat, prevents loss | Shock-resistant permanent mount with tether |

### Boat Device Data Packet

| Field | Example / specification |
|---|---|
| Boat ID | Unique alphanumeric ID, e.g. `BOAT-TN-001` |
| GPS location | Latitude, longitude, optional accuracy and timestamp |
| Emergency type | Manual SOS / tilt / flooding / sinking / impact / communication loss |
| Battery level | Voltage or percentage |
| Sensor source | Which sensor triggered distress |
| Acknowledgement status | Pending / received / rescue dispatched |
| Message size | Keep small for LoRa, typically under a few hundred bytes |

---

## 2. Floating Smart Buoy Unit

| Part | Recommended specification for prototype | Purpose in SagaraMesh | Final deployment upgrade |
|---|---|---|---|
| Buoy float body | HDPE float, sealed plastic buoy, or foam-filled float body; high visibility color | Keeps electronics and antenna floating and visible | Marine-grade HDPE/fiberglass/composite buoy with stability testing |
| Waterproof electronics enclosure | IP67/IP68 box with gasket, cable glands, desiccant, corrosion protection | Protects controller, battery, radio, and wiring from saltwater | Marine certified enclosure, breathable vent, stainless fittings |
| Internal frame/brackets | Acrylic/aluminium/3D-printed brackets | Holds battery, electronics and sensors in stable position | Stainless steel or marine-grade aluminium frame |
| Solar panel | 20W–100W panel depending on buoy size; 12V nominal recommended for bigger prototype | Main renewable power source | Marine solar panel with UV, salt, and impact resistance |
| Wave energy harvester | Demo linear generator, pendulum generator, or magnet-coil wave motion module | Demonstrates wave-powered charging concept | Field-tested rugged wave energy module with mechanical protection |
| Rechargeable battery | LiFePO4 preferred; 6.4V/12.8V pack; BMS; capacity based on load, commonly 10Ah+ for buoy prototype | Stores energy for night/cloudy operation | Marine-grade LiFePO4 with BMS, temperature protection, fusing |
| Solar charge controller | PWM/MPPT controller matching battery voltage/current; MPPT preferred | Safely charges battery from solar panel | Marine-rated MPPT controller with telemetry |
| Power management board | DC-DC buck/boost converters for 5V and 3.3V rails; fuse; reverse polarity protection | Regulates stable power to electronics and sensors | Surge, lightning, overcurrent, and corrosion-protected marine power system |
| Microcontroller | ESP32 / Pico / Arduino; low power; UART/SPI/I2C; watchdog | Controls sensors, LoRa mesh, beacon, siren and self-checks | Industrial low-power controller with conformal coating |
| Onboard computer | Raspberry Pi / Jetson Nano only if video, AI, or dashboard bridge is needed | Advanced processing, drone/ROV bridge, image handling | Rugged edge computer with thermal and waterproof enclosure |
| LoRa mesh module | SX1276/SX1278/SX1262; SPI; legal ISM band; external antenna | Buoy-to-boat and buoy-to-buoy mesh messaging | Certified long-range radio with protocol testing and legal approval |
| VHF/radio backup | Demo radio module only for concept | Backup/extension communication path | Certified marine VHF equipment operated by licensed users where required |
| Optional satellite module | Satellite IoT/messenger placeholder for prototype | Backup when mesh/shore link fails | Certified satellite IoT module/messenger, subject to local regulation |
| High-gain antenna | Fiberglass LoRa antenna, SMA/N-type connector, mounted high; waterproof coax | Increases communication range | Marine antenna mast, lightning arrestor, waterproof RF connectors |
| GPS/GNSS module | NEO-6M/NEO-M8N/u-blox class with external antenna | Buoy position, drift detection, self-repositioning reference | High-accuracy multi-GNSS receiver with waterproof active antenna |
| IMU/compass | MPU6050/BNO055/ICM-20948; accelerometer, gyroscope, optional magnetometer | Detects tilt, movement, wave behavior, abnormal orientation | Marine-calibrated IMU/compass with calibration routine |
| Anchor tension sensor | Load cell + HX711 amplifier; inline rope/load measurement concept | Detects anchor detachment, rope failure, abnormal tension | Rugged inline marine load/tension sensor |
| Electric thrusters | Small waterproof DC thrusters; current sized to buoy weight and sea conditions | Moves buoy back toward preset GPS coordinate in demo | Protected marine thrusters with anti-net/anti-debris guard |
| Motor controller / ESC | ESC or H-bridge motor driver matched to thruster voltage/current | Controls direction/speed of thrusters | Waterproof ESC with current monitoring, thermal protection, failsafe |
| LED beacon | High-brightness waterproof LED beacon/strobe, 5V/12V | Night visibility, local distress indication | Marine navigation/safety beacon compliant with local standards |
| Siren/buzzer | Waterproof buzzer/siren, 5V/12V | Local audible warning near buoy | Marine-rated siren with controlled duty cycle |
| Temperature/weather sensor | DHT22/BME280 for prototype | Weather and sea condition monitoring | Weatherproof marine temperature/humidity station |
| Barometric pressure sensor | BMP280/BME280 | Detects pressure/weather trend | Weatherproof barometric sensor module |
| Wind sensor | Cup anemometer or wind vane module | Measures wind speed/direction | Marine-grade ultrasonic/mechanical anemometer |
| Water temperature sensor | Waterproof DS18B20 probe | Measures sea surface temperature | Marine-grade temperature probe |
| Salinity/EC sensor | EC/salinity sensor kit | Optional salinity/pollution data | Industrial marine salinity probe with calibration |
| pH/turbidity sensor | pH sensor and turbidity module | Optional water-quality monitoring | Calibrated marine water-quality sensors |
| Waterproof connectors | Cable glands, GX waterproof connectors, heat-shrink, silicone sealant | Safe cable entry and maintenance | Marine-grade IP68 connectors with strain relief |
| Fuse/breaker | Inline fuse or waterproof fuse holder sized to battery/current | Prevents short-circuit/fire risk | Waterproof breaker/fuse panel with proper ratings |
| Tamper switch | Magnetic reed switch or enclosure-open switch | Detects unauthorized opening/removal | GPS tamper + enclosure-open alarm |

---

## 3. Shore Command Center / Receiver Gateway

| Part | Recommended specification for prototype | Purpose in SagaraMesh | Final deployment upgrade |
|---|---|---|---|
| Shore LoRa receiver | ESP32/Arduino/Pico + SX1276/SX1278/SX1262 LoRa module | Receives SOS and buoy messages from sea mesh | Certified base-station radio with high-gain antenna and filtering |
| High-gain shore antenna | Directional Yagi or fiberglass omnidirectional antenna matched to LoRa band | Improves shore reception range | Professionally mounted marine/coastal antenna mast with lightning protection |
| Gateway computer | Laptop/Raspberry Pi/mini PC running dashboard/server | Bridges LoRa data to web dashboard and alerts | Rugged mini PC/industrial gateway with UPS and internet backup |
| Internet/SMS alert system | Web dashboard, Telegram/SMS/email/API alert integration | Notifies rescue teams and family contacts | Official integration with Coast Guard/harbor/rescue control room systems |
| Dashboard software | Static/web app showing map, distress panel, buoy health, messages, reports | Operator interface for rescue coordination | Production dashboard with authentication, audit logs, redundancy, GIS layers |
| Power backup | UPS/power bank for receiver and gateway | Keeps shore station alive during power cuts | UPS + generator/solar backup |

---

## 4. Deployable Emergency Payload

| Part | Recommended specification for prototype | Purpose in SagaraMesh | Final deployment upgrade |
|---|---|---|---|
| Floating payload capsule | Waterproof dry box or floating capsule, bright color | Carries survival supplies and tracking beacon | Marine-grade rescue capsule, visible color, impact resistant |
| Foam/flotation ring | EVA foam/life-ring material | Keeps payload floating | Certified flotation material if used for rescue |
| Release mechanism | Servo latch or solenoid lock, failsafe release logic | Drops payload from buoy during confirmed distress | Corrosion-resistant fail-safe marine release mechanism |
| GPS tracker | GPS module + MCU, optional LoRa beacon | Tracks payload position | Satellite/GNSS tracker with waterproof antenna |
| LoRa beacon | Low-power LoRa module periodically broadcasting payload ID/location | Helps shore/buoy locate payload | Waterproof beacon with long-life battery and certified radio |
| Satellite phone placeholder | Dummy phone or protected compact sat-phone concept | Demonstrates emergency voice communication option | Legal/certified satellite phone if permitted |
| Satellite messenger placeholder | Garmin inReach/Zoleo-type concept | Lower-cost emergency satellite message option | Certified messenger service appropriate for region |
| LED strobe beacon | Waterproof flashing LED strobe | Night visibility for fisherman/rescuers | Marine rescue strobe light |
| Fluorescent break stick | Chemical glow stick | Battery-free night signal | Marine high-visibility glow stick |
| Whistle | Pealess plastic safety whistle | Manual audio signal | Marine safety whistle |
| Signal mirror | Small rescue mirror | Daytime visual signal | Rescue-grade signal mirror |
| Dummy/training flare | Non-functional demo flare | Represents regulated visual distress signal | Real marine flare only under legal/safety compliance |
| Mini first-aid kit | Bandage, antiseptic, gauze in waterproof pouch | Minor injury support | Waterproof marine medical pouch |
| Thermal blanket | Emergency foil blanket, sealed | Reduces exposure/hypothermia risk | Vacuum-sealed emergency blanket |
| Drinking water pouch | Sealed water sachet/pouch | Short-term hydration | Shelf-stable emergency water sachets |
| ORS packets | Oral rehydration salts in waterproof sachet | Rehydration support | Waterproof sealed ORS sachets |
| Energy bar/ration | Compact long-shelf-life bar | Short-term calories | Marine survival ration bar |
| Inflatable flotation aid | Compact inflatable float/life-jacket concept | Helps person remain afloat | Certified flotation aid/life jacket module |
| Rope/throw line | Nylon/floating rope | Pulling payload/person, securing rescue line | Floating rescue rope with high-visibility color |
| Multi-tool/safety cutter | Rust-resistant small safety cutter | Cutting nets/ropes in emergency | Safety cutter, not weapon-like, corrosion-resistant |
| Waterproof instruction card | Laminated Tamil/English instructions | Guides fisherman during emergency | Local-language waterproof rescue instructions |
| Small power bank | Waterproof USB power bank | Powers beacon/phone charging | Waterproof protected battery pack |
| Mini solar charger | Foldable 5W panel | Emergency charging support | Rugged waterproof solar charger |
| Water contact sensor | Conductive water sensor or sealed water-activation switch | Confirms payload entered water | Sealed low-power water activation switch |
| Payload IMU | MPU6050 or similar low-power IMU | Detects deployment/impact | Low-power deployment confirmation sensor |

---

## 5. Drone / ROV Rescue Assessment Module

| Part | Recommended specification for prototype | Purpose in SagaraMesh | Final deployment upgrade |
|---|---|---|---|
| Drone dock / waterproof drone | Demo drone/dock model or waterproof drone concept | Aerial assessment after distress | Marine-rated waterproof UAV with automatic launch/landing dock |
| Camera | 1080p camera module or drone camera | Visual situation assessment | Stabilized daylight camera with encrypted video link |
| Thermal camera | Optional low-resolution thermal module such as MLX90640-class for demo | Detects people at night/low visibility | Search-and-rescue thermal camera |
| Payload drop mechanism | Servo/solenoid release | Drops emergency payload | Tested fail-safe drop mechanism with safety lock |
| ROV body | Small tethered underwater robot concept | Underwater assessment near boat/buoy | Marine ROV with depth rating and tether management |
| Underwater camera | Waterproof camera module | Visual underwater inspection | Low-light underwater camera |
| ROV lights | Waterproof LED lights | Visibility underwater | High-output underwater lights with thermal protection |
| Sonar placeholder | Concept/demo sonar module | Detects underwater obstacles/objects | Certified compact imaging/scanning sonar |

---

## 6. Minimum MVP Purchase/Build List

For a practical hackathon demo, prioritize these parts first:

| Subsystem | Minimum parts |
|---|---|
| Boat device | ESP32/Pico, LoRa module, GPS module, SOS button, IMU, flood sensor, buzzer/LED, battery, waterproof box |
| Floating buoy | Waterproof box/float body, ESP32/Pico, LoRa module, GPS module, solar panel, battery, charge controller, LED beacon, anchor drift simulation sensor/logic |
| Shore station | LoRa receiver, laptop/Raspberry Pi, high-gain antenna, dashboard web app |
| Payload | Floating dry box, LED strobe, whistle, glow stick, first-aid mini kit, thermal blanket, water pouch, ORS, rope, dummy flare, GPS/LoRa beacon mockup |

## Important Notes

- LoRa cannot carry live video; it should carry only small SOS/GPS/status packets.
- Drone/ROV video needs a separate high-bandwidth link such as Wi-Fi, LTE/5G near shore, or recorded/compressed status reports.
- Real marine flares and satellite phones may require legal permission. Use dummy placeholders for hackathon demos.
- Saltwater destroys ordinary electronics quickly. Final deployment needs IP68 sealing, marine connectors, conformal coating, corrosion-resistant metals, and field validation.
