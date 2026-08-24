const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const assets = {
  'BUOY-01': { type: 'Buoy', battery: 84, contact: '09:41 IST', status: 'Route relay north sector', lat: 11.98, lon: 79.83 },
  'BUOY-02': { type: 'Buoy', battery: 71, contact: '09:40 IST', status: 'Near restricted zone watch', lat: 11.86, lon: 79.72 },
  'BUOY-03': { type: 'Buoy', battery: 88, contact: '09:42 IST', status: 'Weather sensor online', lat: 11.74, lon: 79.78 },
  'BUOY-04': { type: 'Buoy', battery: 76, contact: '09:39 IST', status: 'Mesh hop to Nagapattinam shore', lat: 11.45, lon: 79.84 },
  'BUOY-05': { type: 'Buoy', battery: 80, contact: '09:41 IST', status: 'Bay of Bengal relay', lat: 12.25, lon: 80.18 },
  'BUOY-06': { type: 'Buoy', battery: 69, contact: '09:38 IST', status: 'High-wave advisory broadcast', lat: 11.22, lon: 80.10 },
  'BUOY-07': { type: 'Buoy', battery: 78, contact: '09:42 IST', status: 'Emergency relay standby', lat: 11.67, lon: 79.92 },
  'BUOY-08': { type: 'Buoy', battery: 82, contact: '09:42 IST', status: 'Fishing zone F-12 gateway', lat: 10.95, lon: 79.92 },
  'BUOY-09': { type: 'Buoy', battery: 64, contact: '09:37 IST', status: 'South mesh route online', lat: 10.70, lon: 79.88 },
  'BUOY-10': { type: 'Buoy', battery: 73, contact: '09:40 IST', status: 'Offshore watch node', lat: 9.15, lon: 79.35 },
  'BUOY-11': { type: 'Buoy', battery: 79, contact: '09:42 IST', status: 'Vessel traffic relay', lat: 8.85, lon: 78.45 },
  'BUOY-12': { type: 'Buoy', battery: 55, contact: '09:27 IST', status: 'Battery service due', lat: 12.55, lon: 80.28 },
  'TN-09-FB-101': { type: 'Fishing Vessel', battery: 91, contact: '09:35 IST', status: 'Normal fishing route', lat: 11.80, lon: 79.96 },
  'TN-09-FB-112': { type: 'Fishing Vessel', battery: 86, contact: '09:28 IST', status: 'Position report received', lat: 10.98, lon: 79.75 },
  'TN-09-FB-175': { type: 'Fishing Vessel', battery: 89, contact: '09:36 IST', status: 'Returning to harbor', lat: 9.25, lon: 79.42 },
  'TN-09-FB-214': { type: 'Distress Vessel', battery: 42, contact: '09:38 IST', status: 'SOS active: off Cuddalore Coast', lat: 11.61, lon: 79.98 }
};

const MOCK_FISHING_ZONES = [
  { id: 'F-10', name: 'F-10 Chennai Nearshore Fishing Zone', status: 'Permitted • calm morning window', color: '#28e37a', coords: [[12.35, 80.00], [12.75, 80.08], [12.65, 80.42], [12.24, 80.33]] },
  { id: 'F-12', name: 'F-12 Cuddalore-Nagapattinam Fishing Zone', status: 'Permitted • buoy gateway BUOY-08', color: '#28e37a', coords: [[10.80, 79.58], [11.42, 79.72], [11.24, 80.08], [10.62, 79.94]] },
  { id: 'R-03', name: 'R-03 Weather Caution / Avoid Zone', status: 'Restricted mock zone • high-wave watch', color: '#f0333d', coords: [[10.65, 80.08], [11.10, 80.18], [10.96, 80.58], [10.50, 80.34]] }
];

const MOCK_OPEN_DATA = {
  source: 'Demo coastal reference points',
  places: [
    { name: 'Chennai Port', kind: 'port', lat: 13.1067, lon: 80.2936, source: 'public coordinate reference' },
    { name: 'Cuddalore Harbour', kind: 'harbour', lat: 11.7084, lon: 79.7787, source: 'public coordinate reference' },
    { name: 'Nagapattinam Harbour', kind: 'harbour', lat: 10.7656, lon: 79.8496, source: 'public coordinate reference' },
    { name: 'Thoothukudi Port', kind: 'port', lat: 8.7510, lon: 78.1994, source: 'public coordinate reference' }
  ]
};

function demoSnapshot() {
  const now = new Date().toISOString();
  return {
    assets: Object.entries(assets).map(([id, data]) => ({ id, kind: data.type.includes('Distress') ? 'distress' : data.type.includes('Vessel') ? 'vessel' : 'buoy', lat: data.lat, lon: data.lon, battery: data.battery, status: data.status, updated_at: now })),
    incidents: [{ id: 'INC-DEMO-001', vessel_id: 'TN-09-FB-214', status: 'active', description: 'Mock SOS active off Cuddalore Coast', created_at: now, updated_at: now }],
    storage: { messages: 0 },
    open_data: MOCK_OPEN_DATA
  };
}

function updateClock() {
  const clock = $('#clock');
  const dateLabel = $('#dateLabel');
  if (!clock || !dateLabel) return;
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(now);
  const date = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric'
  }).format(now);
  clock.textContent = `${time} IST`;
  dateLabel.textContent = date;
}

function toast(message) {
  const box = $('#toast');
  if (!box) return;
  box.textContent = message;
  box.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => box.classList.remove('show'), 2800);
}

function addTimeline(title, detail, className = '') {
  const timeline = $('#timeline');
  if (!timeline) return;
  const li = document.createElement('li');
  if (className) li.className = className;
  const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  const timeEl = document.createElement('time');
  const titleEl = document.createElement('strong');
  const detailEl = document.createElement('span');
  timeEl.textContent = `${time} IST`;
  titleEl.textContent = title;
  detailEl.textContent = detail;
  li.append(timeEl, titleEl, detailEl);
  timeline.prepend(li);
}

function selectAsset(id, silent = false) {
  const data = assets[id];
  if (!data) return;
  $$('.marker').forEach(marker => marker.classList.toggle('selected', marker.dataset.id === id));
  const selectedAsset = $('#selectedAsset');
  if (selectedAsset) selectedAsset.textContent = id;
  const lastContact = $('#lastContact');
  if (lastContact) lastContact.textContent = data.contact;
  const batteryCell = $$('.buoy-summary dd')[1];
  if (batteryCell) batteryCell.textContent = `▰ ${data.battery}%`;
  const viewTitle = $('#viewTitle');
  if (viewTitle) viewTitle.textContent = `${data.type}: ${id}`;
  if (window.sagaraLeafletMarkers?.[id]) {
    window.sagaraLeafletMarkers[id].openPopup();
    window.sagaraLeafletMap?.panTo(window.sagaraLeafletMarkers[id].getLatLng(), { animate: true });
  }
  if (!silent) toast(`${id} selected — ${data.status}`);
}

function leafletIcon(asset) {
  const label = asset.kind === 'distress' ? 'SOS' : asset.kind === 'vessel' ? '🚤' : '⛯';
  const cls = asset.kind === 'distress' ? 'leaflet-sagara distress' : asset.kind === 'vessel' ? 'leaflet-sagara vessel' : 'leaflet-sagara buoy';
  return L.divIcon({ className: cls, html: `<span>${label}</span>`, iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -16] });
}

function initRealMap() {
  const mapCanvas = $('#mapCanvas');
  if (!mapCanvas || typeof L === 'undefined' || window.sagaraLeafletMap) return;
  mapCanvas.innerHTML = '<div id="realMap" class="real-map" role="application" aria-label="Real OpenStreetMap coastal map"></div><div class="map-source-badge">OpenStreetMap + Open-Meteo + SQLite telemetry</div>';
  const map = L.map('realMap', { zoomControl: true, scrollWheelZoom: true }).setView([11.35, 79.85], 7);
  const baseLayers = {
    'OpenStreetMap Standard': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }),
    'OpenStreetMap HOT': L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors, Tiles style by HOT'
    }),
    'OpenTopoMap': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Style: &copy; OpenTopoMap'
    })
  };
  baseLayers['OpenStreetMap Standard'].addTo(map);
  L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);
  setTimeout(() => map.invalidateSize(), 150);
  window.sagaraLeafletMap = map;
  window.sagaraLeafletMarkers = {};
  window.sagaraZoneLayer = L.layerGroup().addTo(map);
  MOCK_FISHING_ZONES.forEach(zone => L.polygon(zone.coords, {
    color: zone.color,
    fillColor: zone.color,
    fillOpacity: zone.id.startsWith('R-') ? 0.18 : 0.12,
    weight: 2,
    dashArray: zone.id.startsWith('R-') ? '8 7' : null
  }).bindPopup(`<strong>${zone.name}</strong><br>${zone.status}<br><small>Mock fishing zone for prototype planning</small>`).addTo(window.sagaraZoneLayer));
}

function updateRealMap(data) {
  if (!window.sagaraLeafletMap) initRealMap();
  const map = window.sagaraLeafletMap;
  if (!map || typeof L === 'undefined') return;
  const markers = window.sagaraLeafletMarkers;
  const bounds = [];
  for (const asset of data.assets || []) {
    if (!asset.lat || !asset.lon) continue;
    const popup = `<strong>${asset.id}</strong><br>${asset.kind}<br>Battery: ${Math.round(asset.battery)}%<br>Status: ${asset.status}<br><small>Stored in SQLite • ${new Date(asset.updated_at).toLocaleString('en-IN')}</small>`;
    if (markers[asset.id]) {
      markers[asset.id].setLatLng([asset.lat, asset.lon]).setPopupContent(popup);
    } else {
      markers[asset.id] = L.marker([asset.lat, asset.lon], { icon: leafletIcon(asset) }).bindPopup(popup).addTo(map);
      markers[asset.id].on('click', () => selectAsset(asset.id));
    }
    bounds.push([asset.lat, asset.lon]);
  }
  if (!window.sagaraOpenDataLayer) window.sagaraOpenDataLayer = L.layerGroup().addTo(map);
  window.sagaraOpenDataLayer.clearLayers();
  for (const place of data.open_data?.places || []) {
    L.circleMarker([place.lat, place.lon], { radius: 6, color: '#ffc928', weight: 2, fillColor: '#ffc928', fillOpacity: 0.5 })
      .bindPopup(`<strong>${place.name}</strong><br>${place.kind}<br><small>${place.source}</small>`)
      .addTo(window.sagaraOpenDataLayer);
  }
  if (!window.sagaraMapFitted && bounds.length) {
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 8 });
    window.sagaraMapFitted = true;
    setTimeout(() => map.invalidateSize(), 100);
  }
}

function bindDashboard() {
  $$('.marker').forEach(marker => {
    marker.addEventListener('click', () => selectAsset(marker.dataset.id));
  });

  $$('[data-select-asset]').forEach(button => {
    button.addEventListener('click', () => selectAsset(button.dataset.selectAsset));
  });

  const assetSearch = $('#assetSearch');
  if (assetSearch) {
    assetSearch.addEventListener('input', event => {
      const query = event.target.value.trim().toUpperCase();
      if (!query) {
        $$('.marker').forEach(marker => marker.style.opacity = '1');
        return;
      }
      let firstMatch = null;
      $$('.marker').forEach(marker => {
        const match = marker.dataset.id.includes(query);
        marker.style.opacity = match ? '1' : '.22';
        if (match && !firstMatch) firstMatch = marker.dataset.id;
      });
      if (firstMatch && query.length >= 4) selectAsset(firstMatch);
    });
  }

  const messageForm = $('#messageForm');
  if (messageForm) {
    messageForm.addEventListener('submit', event => {
      event.preventDefault();
      const input = $('#messageInput');
      const text = input?.value.trim() || '';
      const asset = $('#selectedAsset')?.textContent || 'BUOY-07';
      if (!text) {
        toast('Type a message before sending.');
        return;
      }
      addTimeline(`Message sent to ${asset}`, text);
      storeMessage(asset, text)
        .then(() => toast(`Message stored in SQLite and queued to ${asset}`))
        .catch(() => toast(`Message queued locally; backend storage offline for ${asset}`));
      input.value = '';
    });
  }

  const respondBtn = $('#respondBtn');
  if (respondBtn) {
    respondBtn.addEventListener('click', () => {
      addTimeline('Rescue response acknowledged', 'TN-09-FB-214 assigned to nearest buoy relay', 'warn');
      ackIncident().catch(() => {});
      selectAsset('TN-09-FB-214');
      respondBtn.textContent = 'Acknowledged';
      respondBtn.disabled = true;
      toast('Distress response acknowledged and stored when backend is online.');
    });
  }

  const viewDistressBtn = $('#viewDistressBtn');
  if (viewDistressBtn) {
    viewDistressBtn.addEventListener('click', () => {
      selectAsset('TN-09-FB-214');
      const viewTitle = $('#viewTitle');
      if (viewTitle) viewTitle.textContent = 'Distress Track: TN-09-FB-214';
      toast('Distress vessel centered in the command map.');
    });
  }

  const relayBtn = $('#relayBtn');
  if (relayBtn) {
    relayBtn.addEventListener('click', () => {
      const asset = $('#selectedAsset')?.textContent || 'BUOY-07';
      addTimeline('Emergency relay triggered', `${asset} broadcasting SOS acknowledgement and weather-safe route`, 'warn');
      const pill = $('.system-pill');
      if (pill) {
        pill.innerHTML = '<i></i> Emergency Relay Active';
        pill.style.color = '#ffc928';
      }
      toast('Emergency relay simulation active.');
    });
  }

  const resetMap = $('#resetMap');
  if (resetMap) {
    resetMap.addEventListener('click', () => {
      if (assetSearch) assetSearch.value = '';
      $$('.marker').forEach(marker => marker.style.opacity = '1');
      selectAsset('BUOY-07');
      const viewTitle = $('#viewTitle');
      if (viewTitle) viewTitle.textContent = 'Live Maritime Map';
    });
  }

  const saveSettingsBtn = $('#saveSettingsBtn');
  const apiBaseInput = $('#apiBaseInput');
  if (apiBaseInput) {
    apiBaseInput.value = localStorage.getItem('sagaramesh_api_base') || defaultApiBase();
  }
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      if (apiBaseInput) localStorage.setItem('sagaramesh_api_base', apiBaseInput.value.trim() || defaultApiBase());
      toast('Settings saved. Realtime backend URL stored in this browser.');
      connectRealtime(true);
    });
  }
}

function defaultApiBase() {
  if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') return location.origin;
  return localStorage.getItem('sagaramesh_api_base') || 'http://127.0.0.1:8000';
}

function apiBase() {
  return (localStorage.getItem('sagaramesh_api_base') || defaultApiBase()).replace(/\/$/, '');
}

function setRealtimeStatus(text, ok = false) {
  let badge = $('#realtimeStatus');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'realtimeStatus';
    badge.className = 'realtime-status';
    $('.topbar')?.appendChild(badge);
  }
  badge.textContent = text;
  badge.classList.toggle('online', ok);
}

function applyWeatherSummary(weather) {
  const statCards = $$('.stat-card strong');
  const temp = weather?.forecast?.current?.temperature_2m;
  const wave = weather?.marine?.current?.wave_height;
  if (statCards[0] && temp !== undefined) statCards[0].textContent = `${Math.round(temp)}°C`;
  const weatherEm = $('.weather-card em');
  if (weatherEm && wave !== undefined) weatherEm.textContent = `Wave height ${wave} m • Open-Meteo`;
}

function applySnapshot(data, markRealtime = true) {
  if (!data) return;
  const onlineAssets = data.assets?.filter(a => a.status !== 'offline').length ?? 0;
  const totalAssets = data.assets?.length ?? 0;
  const statCards = $$('.stat-card strong');
  if (statCards[2] && totalAssets) statCards[2].textContent = `${onlineAssets} / ${totalAssets}`;
  const latestWeather = data.weather;
  applyWeatherSummary(latestWeather);
  for (const asset of data.assets || []) {
    if (assets[asset.id]) {
      assets[asset.id].battery = Math.round(asset.battery);
      assets[asset.id].contact = new Date(asset.updated_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      assets[asset.id].status = asset.status;
    }
  }
  const storedCount = data.storage?.messages ?? 0;
  updateRealMap(data);
  renderForecast(data.weather);
  if (markRealtime) setRealtimeStatus(`Realtime + SQLite connected • ${storedCount} stored messages`, true);
}

function groupMarineByDay(marine) {
  const grouped = {};
  const hourly = marine?.hourly || {};
  (hourly.time || []).forEach((time, index) => {
    const day = time.slice(0, 10);
    grouped[day] ||= { waves: [], swells: [], periods: [] };
    if (hourly.wave_height?.[index] !== null && hourly.wave_height?.[index] !== undefined) grouped[day].waves.push(hourly.wave_height[index]);
    if (hourly.swell_wave_height?.[index] !== null && hourly.swell_wave_height?.[index] !== undefined) grouped[day].swells.push(hourly.swell_wave_height[index]);
    if (hourly.wave_period?.[index] !== null && hourly.wave_period?.[index] !== undefined) grouped[day].periods.push(hourly.wave_period[index]);
  });
  return grouped;
}

function maxOrNull(values) {
  return values.length ? Math.max(...values.map(Number).filter(Number.isFinite)) : null;
}

function windLabel(kmh) {
  if (kmh >= 50) return 'Very windy';
  if (kmh >= 30) return 'Windy';
  if (kmh >= 18) return 'Moderate wind';
  return 'Light wind';
}

function renderForecast(weather) {
  let box = $('#threeDayForecast');
  if (!box) return;
  if (!weather?.forecast?.daily) {
    box.innerHTML = '<article class="forecast-day"><strong>Loading live 3-day forecast…</strong><span>Open-Meteo data will appear here when reachable.</span></article>';
    return;
  }
  const daily = weather.forecast.daily;
  const marineByDay = groupMarineByDay(weather.marine);
  box.innerHTML = daily.time.slice(0, 3).map((day, index) => {
    const wave = maxOrNull(marineByDay[day]?.waves || []);
    const swell = maxOrNull(marineByDay[day]?.swells || []);
    const period = maxOrNull(marineByDay[day]?.periods || []);
    const wind = daily.wind_speed_10m_max?.[index];
    const gust = daily.wind_gusts_10m_max?.[index];
    const tempMax = daily.temperature_2m_max?.[index];
    const tempMin = daily.temperature_2m_min?.[index];
    const rain = daily.precipitation_probability_max?.[index];
    const label = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(`${day}T12:00:00+05:30`));
    const risk = wave >= 2.5 || wind >= 35 ? 'Caution' : wave >= 1.5 || wind >= 24 ? 'Moderate' : 'Good';
    return `<article class="forecast-day ${risk.toLowerCase()}">
      <strong>${label}</strong>
      <b>${risk}</b>
      <span>${Math.round(tempMin)}–${Math.round(tempMax)}°C • ${windLabel(wind)}</span>
      <dl><div><dt>Max wind</dt><dd>${Math.round(wind)} km/h</dd></div><div><dt>Gusts</dt><dd>${Math.round(gust)} km/h</dd></div><div><dt>Wave</dt><dd>${wave?.toFixed(1) ?? '—'} m</dd></div><div><dt>Swell</dt><dd>${swell?.toFixed(1) ?? '—'} m</dd></div><div><dt>Rain chance</dt><dd>${rain ?? '—'}%</dd></div><div><dt>Period</dt><dd>${period?.toFixed(0) ?? '—'} s</dd></div></dl>
    </article>`;
  }).join('');
  const source = $('#forecastSource');
  if (source) source.textContent = `Accurate live forecast from Open-Meteo for ${weather.lat?.toFixed?.(2) ?? '11.75'}, ${weather.lon?.toFixed?.(2) ?? '79.77'} • fetched ${new Date(weather.fetched_at || Date.now()).toLocaleString('en-IN')}`;
}

async function fetchLiveForecast() {
  const lat = 11.75;
  const lon = 79.77;
  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.search = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,wind_speed_10m,wind_direction_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
    forecast_days: '3',
    timezone: 'Asia/Kolkata'
  });
  const marineUrl = new URL('https://marine-api.open-meteo.com/v1/marine');
  marineUrl.search = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'wave_height,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height',
    hourly: 'wave_height,wind_wave_height,swell_wave_height,wave_period',
    forecast_days: '3',
    timezone: 'Asia/Kolkata'
  });
  const [forecast, marine] = await Promise.all([fetch(forecastUrl), fetch(marineUrl)]);
  if (!forecast.ok || !marine.ok) throw new Error('Open-Meteo forecast unavailable');
  const weather = { source: 'Open-Meteo Marine + Forecast', lat, lon, forecast: await forecast.json(), marine: await marine.json(), fetched_at: new Date().toISOString() };
  renderForecast(weather);
  applyWeatherSummary(weather);
}

async function fetchSnapshot() {
  const response = await fetch(`${apiBase()}/api/snapshot`);
  if (!response.ok) throw new Error(`snapshot ${response.status}`);
  applySnapshot(await response.json());
}

let realtimeSocket;
function connectRealtime(force = false) {
  if (realtimeSocket && !force) return;
  if (realtimeSocket) realtimeSocket.close();
  fetchSnapshot().catch(() => setRealtimeStatus('Demo mode • backend offline', false));
  const wsUrl = `${apiBase().replace(/^http/, 'ws')}/ws`;
  try {
    realtimeSocket = new WebSocket(wsUrl);
    realtimeSocket.onopen = () => setRealtimeStatus('Realtime backend connected', true);
    realtimeSocket.onmessage = event => applySnapshot(JSON.parse(event.data));
    realtimeSocket.onerror = () => setRealtimeStatus('Demo mode • backend offline', false);
    realtimeSocket.onclose = () => setTimeout(() => connectRealtime(true), 8000);
  } catch (_) {
    setRealtimeStatus('Demo mode • backend offline', false);
  }
}

async function storeMessage(target, body) {
  const response = await fetch(`${apiBase()}/api/messages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ target, body })
  });
  if (!response.ok) throw new Error(`message ${response.status}`);
  return response.json();
}

async function ackIncident() {
  const response = await fetch(`${apiBase()}/api/incidents/INC-2026-0824-001/ack`, { method: 'POST' });
  if (!response.ok) throw new Error(`ack ${response.status}`);
  return response.json();
}

updateClock();
setInterval(updateClock, 1000);
bindDashboard();
selectAsset('BUOY-07', true);
initRealMap();
updateRealMap(demoSnapshot());
applySnapshot(demoSnapshot(), false);
fetchLiveForecast().catch(() => renderForecast(null));
connectRealtime();
const initialTitle = $('#viewTitle');
if (initialTitle && document.body.dataset.page === 'overview') initialTitle.textContent = 'Live Maritime Map';
