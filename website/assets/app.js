const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const assets = {
  'BUOY-01': { type: 'Buoy', battery: 84, contact: '09:41 IST', status: 'Route relay north sector' },
  'BUOY-02': { type: 'Buoy', battery: 71, contact: '09:40 IST', status: 'Near restricted zone watch' },
  'BUOY-03': { type: 'Buoy', battery: 88, contact: '09:42 IST', status: 'Weather sensor online' },
  'BUOY-04': { type: 'Buoy', battery: 76, contact: '09:39 IST', status: 'Mesh hop to Nagapattinam shore' },
  'BUOY-05': { type: 'Buoy', battery: 80, contact: '09:41 IST', status: 'Bay of Bengal relay' },
  'BUOY-06': { type: 'Buoy', battery: 69, contact: '09:38 IST', status: 'High-wave advisory broadcast' },
  'BUOY-07': { type: 'Buoy', battery: 78, contact: '09:42 IST', status: 'Emergency relay standby' },
  'BUOY-08': { type: 'Buoy', battery: 82, contact: '09:42 IST', status: 'Fishing zone F-12 gateway' },
  'BUOY-09': { type: 'Buoy', battery: 64, contact: '09:37 IST', status: 'South mesh route online' },
  'BUOY-10': { type: 'Buoy', battery: 73, contact: '09:40 IST', status: 'Offshore watch node' },
  'BUOY-11': { type: 'Buoy', battery: 79, contact: '09:42 IST', status: 'Vessel traffic relay' },
  'BUOY-12': { type: 'Buoy', battery: 55, contact: '09:27 IST', status: 'Battery service due' },
  'TN-09-FB-101': { type: 'Fishing Vessel', battery: 91, contact: '09:35 IST', status: 'Normal fishing route' },
  'TN-09-FB-112': { type: 'Fishing Vessel', battery: 86, contact: '09:28 IST', status: 'Position report received' },
  'TN-09-FB-175': { type: 'Fishing Vessel', battery: 89, contact: '09:36 IST', status: 'Returning to harbor' },
  'TN-09-FB-214': { type: 'Distress Vessel', battery: 42, contact: '09:38 IST', status: 'SOS active: off Cuddalore Coast' }
};

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
  const fishingZones = [
    { name: 'F-12 permitted fishing corridor', color: '#28e37a', coords: [[11.05,79.55],[11.25,79.70],[11.18,80.00],[10.95,79.92]] },
    { name: 'F-10 northern permitted zone', color: '#28e37a', coords: [[12.35,80.05],[12.75,80.10],[12.65,80.42],[12.25,80.34]] },
    { name: 'Weather caution / restricted zone', color: '#f0333d', coords: [[10.75,80.05],[11.15,80.18],[10.95,80.55],[10.55,80.32]] }
  ];
  fishingZones.forEach(zone => L.polygon(zone.coords, { color: zone.color, fillColor: zone.color, fillOpacity: 0.12, weight: 2 }).bindPopup(zone.name).addTo(map));
}

function updateRealMap(data) {
  if (!window.sagaraLeafletMap) initRealMap();
  const map = window.sagaraLeafletMap;
  if (!map || typeof L === 'undefined') return;
  const markers = window.sagaraLeafletMarkers;
  for (const asset of data.assets || []) {
    if (!asset.lat || !asset.lon) continue;
    const popup = `<strong>${asset.id}</strong><br>${asset.kind}<br>Battery: ${Math.round(asset.battery)}%<br>Status: ${asset.status}<br><small>Stored in SQLite • ${new Date(asset.updated_at).toLocaleString('en-IN')}</small>`;
    if (markers[asset.id]) {
      markers[asset.id].setLatLng([asset.lat, asset.lon]).setPopupContent(popup);
    } else {
      markers[asset.id] = L.marker([asset.lat, asset.lon], { icon: leafletIcon(asset) }).bindPopup(popup).addTo(map);
      markers[asset.id].on('click', () => selectAsset(asset.id));
    }
  }
  if (!window.sagaraOpenDataLayer) window.sagaraOpenDataLayer = L.layerGroup().addTo(map);
  window.sagaraOpenDataLayer.clearLayers();
  for (const place of data.open_data?.places || []) {
    L.circleMarker([place.lat, place.lon], { radius: 6, color: '#ffc928', weight: 2, fillColor: '#ffc928', fillOpacity: 0.5 })
      .bindPopup(`<strong>${place.name}</strong><br>${place.kind}<br><small>${place.source}</small>`)
      .addTo(window.sagaraOpenDataLayer);
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

function applySnapshot(data) {
  if (!data) return;
  const onlineAssets = data.assets?.filter(a => a.status === 'online').length ?? 0;
  const totalAssets = data.assets?.length ?? 0;
  const statCards = $$('.stat-card strong');
  if (statCards[2] && totalAssets) statCards[2].textContent = `${onlineAssets} / ${totalAssets}`;
  const latestWeather = data.weather;
  const temp = latestWeather?.forecast?.current?.temperature_2m;
  const wave = latestWeather?.marine?.current?.wave_height;
  if (statCards[0] && temp !== undefined) statCards[0].textContent = `${Math.round(temp)}°C`;
  const weatherEm = $('.weather-card em');
  if (weatherEm && wave !== undefined) weatherEm.textContent = `Wave height ${wave} m • Open-Meteo`;
  for (const asset of data.assets || []) {
    if (assets[asset.id]) {
      assets[asset.id].battery = Math.round(asset.battery);
      assets[asset.id].contact = new Date(asset.updated_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      assets[asset.id].status = asset.status;
    }
  }
  const storedCount = data.storage?.messages ?? 0;
  updateRealMap(data);
  setRealtimeStatus(`Realtime + SQLite connected • ${storedCount} stored messages`, true);
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
connectRealtime();
const initialTitle = $('#viewTitle');
if (initialTitle && document.body.dataset.page === 'overview') initialTitle.textContent = 'Live Maritime Map';
