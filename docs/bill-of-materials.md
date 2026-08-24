# Bill of Materials (BOM)

This BOM is separated into the three major SagaraMesh hardware blocks:

1. **Floating Smart Buoy Unit**
2. **Fisherman Boat Device**
3. **Submersible / Deployable Emergency Payload**

> Note: This is a hackathon and prototype-level BOM. Final marine deployment requires certified marine-grade parts, waterproofing validation, communication permissions, and safety/regulatory approvals.

---

## 1. Floating Smart Buoy Unit BOM

The buoy is the main floating communication, power, rescue-assessment, and self-repositioning platform.

| Category | Component | Purpose / Notes | Prototype Option | Final Deployment Notes |
|---|---|---|---|---|
| Floating body | Buoy float body | Keeps the system floating and stable | HDPE float / sealed plastic buoy body | Marine-grade HDPE, fiberglass, or composite buoy body |
| Enclosure | Waterproof electronics box | Protects electronics from saltwater | IP67/IP68 enclosure | Marine-grade sealed enclosure with corrosion-resistant fittings |
| Mounting | Internal frame / brackets | Holds battery, electronics, and sensors | Acrylic/Aluminium brackets | Stainless steel / marine-grade aluminium |
| Power | Solar panels | Main renewable power source | 20W–100W solar panel depending on size | Marine solar panels with UV and salt resistance |
| Power | Wave energy harvester | Generates power from wave movement | Small linear generator / pendulum demo model | Rugged wave-energy module after field testing |
| Power | Rechargeable battery pack | Stores energy for night/cloudy operation | Li-ion/LiFePO4 battery pack | LiFePO4 recommended for safety and cycle life |
| Power | Solar charge controller | Safely charges battery from solar | MPPT/PWM charge controller | Marine-rated MPPT controller |
| Power | Power management board | Regulates power for electronics | DC-DC buck/boost converter | Surge, reverse polarity, and overcurrent protection needed |
| Processing | Microcontroller | Controls sensors and communication | ESP32 / Arduino / Raspberry Pi Pico | Low-power industrial controller for final version |
| Processing | Onboard computer | Handles advanced logic/dashboard bridge/AI modules | Raspberry Pi / Jetson Nano for demo | Rugged edge computer if drone/video processing is needed |
| Communication | LoRa module | Low-power long-range mesh messaging | SX1278/SX1262 LoRa module | Frequency must follow local regulation |
| Communication | VHF/radio module | Marine radio backup/extension | Radio module demo | Certified marine VHF equipment needed |
| Communication | Satellite module | Backup when mesh/shore link is unavailable | Optional satellite modem | Certified satellite IoT/messenger module |
| Communication | High-gain antenna | Improves range | LoRa antenna / fiberglass antenna | Marine-grade antenna and lightning protection |
| Location | GPS module | Tracks buoy position | NEO-6M / u-blox GPS | Higher-accuracy GNSS for final deployment |
| Motion | IMU / compass | Direction and movement detection | MPU6050 / BNO055 / ICM-20948 | Marine-calibrated IMU/compass |
| Anchor safety | Anchor tension sensor | Detects anchor detachment or rope failure | Load cell + HX711 module | Rugged inline load/tension sensor |
| Repositioning | Electric thrusters | Moves buoy back to preset GPS coordinate | Small waterproof thrusters | Protected marine thrusters with anti-net design |
| Repositioning | Motor controller / ESC | Controls thrusters | ESC / H-bridge motor driver | Waterproof ESC with current monitoring |
| Alert | LED beacon | Night visibility and emergency signalling | High-brightness LED beacon | Marine navigation/safety beacon standards |
| Alert | Siren / buzzer | Local audible alert | Waterproof buzzer/siren | Marine-rated siren |
| Weather | Temperature sensor | Weather/sea condition data | DHT22 / BME280 | Marine weather station sensor |
| Weather | Pressure sensor | Detects weather pressure changes | BMP280 / BME280 | Weatherproof pressure sensor |
| Weather | Wind sensor | Wind speed/direction | Anemometer module | Marine-grade ultrasonic/mechanical anemometer |
| Ocean sensing | Water temperature sensor | Measures sea temperature | DS18B20 waterproof probe | Marine-grade water temperature sensor |
| Ocean sensing | Salinity / EC sensor | Pollution/salinity monitoring | EC sensor kit | Industrial salinity probe |
| Ocean sensing | pH / turbidity sensor | Water quality monitoring | pH/turbidity modules | Calibrated marine water-quality sensors |
| Interfaces | Waterproof connectors | Safe cable entry and maintenance | Cable glands / GX waterproof connectors | Marine-grade connectors |
| Safety | Fuse / breaker | Protects against short circuits | Inline fuse | Waterproof fuse holder/breaker |
| Security | Tamper detection switch | Detects unauthorized opening/removal | Magnetic reed switch | GPS tamper + enclosure open sensor |

---

## 2. Fisherman Boat Device BOM

The boat device is the low-cost unit carried or installed on each fishing boat.

| Category | Component | Purpose / Notes | Prototype Option | Final Deployment Notes |
|---|---|---|---|---|
| Input | SOS push button | Manual emergency trigger | Waterproof push button | Large protected emergency button with long-press logic |
| Location | GPS module | Sends exact boat location | NEO-6M / u-blox GPS | Reliable GNSS with external antenna |
| Communication | LoRa/radio module | Sends SOS/data to nearest buoy | SX1278/SX1262 LoRa | Certified frequency-compliant radio |
| Antenna | Boat antenna | Improves range | LoRa whip antenna | Marine-grade external antenna |
| Processing | Microcontroller | Controls sensors and sends alert | ESP32 / Arduino / Pico | Low-power rugged controller |
| Display | Indicator LEDs | Shows power, signal, SOS status | Red/green/yellow LEDs | Bright sunlight-readable indicators |
| Display | Small screen | Shows alerts and acknowledgement | OLED/LCD display | Waterproof sunlight-readable display |
| Audio | Buzzer | Local warning before auto-SOS | Piezo buzzer | Loud waterproof buzzer |
| Power | Battery | Powers the device | Li-ion/LiFePO4 pack | Replaceable/rechargeable protected pack |
| Power | Small solar charger | Optional charging during long trips | 5W–10W solar panel | Rugged flexible marine solar panel |
| Power | Charge/protection board | Battery safety | TP4056/protection board | Safer marine-rated battery management system |
| Enclosure | Waterproof casing | Protects electronics from rain/salt spray | IP67 handheld box | Rugged floating waterproof case |
| Auto distress | IMU accelerometer/gyroscope | Detects unusual tilting, capsize risk, collision | MPU6050/BNO055 | Calibrated with boat-specific thresholds |
| Auto distress | Water level/flood sensor | Detects water entering boat | Float switch / conductive sensor | Bilge water sensor |
| Auto distress | Pressure/depth sensor | Detects submersion/sinking risk | Waterproof pressure sensor | Rugged depth/pressure transducer |
| Auto distress | Heartbeat/check-in logic | Detects communication loss | Firmware feature | Periodic check-in with last-known-location |
| Safety | Waterproof charging port | Safe charging | Rubber-sealed USB/DC port | Magnetic/waterproof marine connector |
| Mounting | Boat mount/strap | Secures device to boat | Bracket/Velcro strap | Shock-resistant fixed mount |

### Boat Device Emergency Data Packet

The boat device should send:

- Boat ID
- GPS latitude/longitude
- Emergency type
- Time
- Battery level
- Sensor trigger source: manual SOS / tilt / flooding / sinking / impact / communication loss
- Optional acknowledgement status

---

## 3. Submersible / Deployable Emergency Payload BOM

The deployable payload is released by the buoy during a confirmed distress situation. It can float, signal, provide survival supplies / survival kit items, and optionally support short-term communication.

| Category | Component | Purpose / Notes | Prototype Option | Final Deployment Notes |
|---|---|---|---|---|
| Body | Waterproof floating payload capsule | Carries emergency supplies and electronics | Waterproof dry box / floating capsule | Bright colored marine-grade rescue capsule |
| Buoyancy | Foam / flotation ring | Keeps payload floating | EVA foam / life-ring material | SOLAS-style flotation material if certified version |
| Release | Payload release mechanism | Releases from buoy when distress is confirmed | Servo latch / solenoid lock | Fail-safe corrosion-resistant release system |
| Tracking | GPS tracker | Tracks payload location | GPS module + LoRa beacon | Satellite/GNSS tracker for real sea use |
| Communication | LoRa beacon | Reports payload position to buoy/shore | LoRa module | Low-power beacon with waterproof antenna |
| Communication | Satellite phone | Emergency communication with rescue/family/command center | Compact satellite phone in waterproof pouch | Must be charged, protected, and legally permitted |
| Communication | Satellite messenger | Lower-cost alternative/backup to satellite phone | Garmin inReach/Zoleo-type concept | Certified device depending on region |
| Signalling | Marine flare | Visual distress signal | Training/dummy flare for prototype | Real flares are regulated and must be handled safely |
| Signalling | Fluorescent break stick | Night visibility, no battery needed | Chemical glow stick | High-visibility marine glow sticks |
| Signalling | LED strobe beacon | Night rescue visibility | Waterproof LED strobe | Marine rescue strobe light |
| Signalling | Whistle | Manual acoustic signal | Plastic safety whistle | Pealess marine whistle |
| Signalling | Signal mirror | Daytime visual signal | Small mirror | Rescue signal mirror |
| Survival | Mini first-aid kit | Treats minor injuries until rescue | Bandage, antiseptic, gauze | Waterproof medical pouch |
| Survival | Thermal blanket | Prevents hypothermia/exposure | Emergency foil blanket | Vacuum-sealed waterproof pack |
| Survival | Water pouch | Emergency drinking water | Small sealed water pouch | Shelf-stable emergency water sachets |
| Survival | ORS packets | Rehydration support | ORS sachets | Waterproof sachets |
| Survival | Energy bars | Short-term calories | Compact energy bar | Long-shelf-life ration bar |
| Survival | Inflatable flotation aid | Helps a person stay afloat | Compact inflatable float | Certified flotation aid/life jacket module |
| Survival | Rope / throw line | Helps pull payload/person | Nylon rope | Floating rescue rope |
| Survival | Multi-tool / safety knife | Cutting nets/ropes in emergency | Small safety cutter | Rust-resistant safety cutter, not weapon-like |
| Protection | Waterproof document card | Instructions in Tamil/English | Laminated card | Local-language survival instructions |
| Power | Small battery pack | Powers beacon/strobe/phone charging | USB power bank | Waterproof power bank with safety protection |
| Power | Mini solar charger | Emergency charging support | Foldable 5W panel | Rugged waterproof solar charger |
| Sensors | Water contact sensor | Confirms payload entered water | Conductive water sensor | Sealed water-activation switch |
| Sensors | IMU | Detects deployment/impact | MPU6050 | Low-power deployment confirmation |

### Suggested Payload Contents

Minimum emergency payload:

- Fluorescent break stick
- LED strobe beacon
- Whistle
- Signal mirror
- Thermal blanket
- Mini first-aid kit
- Drinking water pouch
- ORS sachets
- Floating rope
- GPS/LoRa beacon
- Waterproof instruction card in Tamil and English

Advanced payload:

- Satellite phone or satellite messenger
- Marine flare
- Inflatable flotation aid
- Energy ration bar
- Waterproof power bank
- Mini solar charger
- Safety cutter

### Safety Note on Flares and Satellite Phone

- Real marine flares are regulated and should not be used in a classroom/hackathon demo. Use a dummy/training flare for demonstration.
- Satellite phones may require legal permission depending on location and use case. For prototype demonstration, represent it as a placeholder module or use a satellite messenger concept.

---

## MVP BOM Recommendation

For the first hackathon prototype, keep the build practical:

### Buoy MVP

- Waterproof box
- ESP32/Pico
- LoRa module
- GPS module
- Solar panel
- Battery pack
- Charge controller
- LED beacon
- Basic anchor drift simulation

### Boat Device MVP

- SOS button
- GPS module
- LoRa module
- IMU tilt sensor
- Water level/flood sensor
- Buzzer/LED
- Battery
- Waterproof casing

### Payload MVP

- Floating waterproof box
- LED strobe
- Fluorescent break stick
- Whistle
- Thermal blanket
- First-aid mini kit
- Water pouch
- ORS sachet
- Rope
- Dummy flare
- Dummy satellite phone / satellite messenger placeholder
- LoRa/GPS tracker mockup

---

## BOM Summary

| Subsystem | Main Role | MVP Priority |
|---|---|---|
| Floating smart buoy | Mesh communication, power, rescue coordination, self-repositioning | High |
| Boat device | SOS, GPS, automatic tilt/flooding/sinking detection | High |
| Submersible/deployable payload | Survival supplies, signalling, tracking, communication support | Medium |
| Drone/ROV module | Situation assessment before rescue arrival | Future/advanced |
| Shore command center | Dashboard and rescue coordination | High |
