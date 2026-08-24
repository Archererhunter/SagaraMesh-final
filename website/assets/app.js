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
  'TN-09-FB-101': { type: 'Fishing Vessel', battery: 91, contact: '09:35 IST', status: 'Normal fishing route' },
  'TN-09-FB-112': { type: 'Fishing Vessel', battery: 86, contact: '09:28 IST', status: 'Position report received' },
  'TN-09-FB-175': { type: 'Fishing Vessel', battery: 89, contact: '09:36 IST', status: 'Returning to harbor' },
  'TN-09-FB-214': { type: 'Distress Vessel', battery: 42, contact: '09:38 IST', status: 'SOS active: off Cuddalore Coast' }
};

function updateClock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(now);
  const date = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric'
  }).format(now);
  $('#clock').textContent = `${time} IST`;
  $('#dateLabel').textContent = date;
}

function toast(message) {
  const box = $('#toast');
  box.textContent = message;
  box.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => box.classList.remove('show'), 2800);
}

function addTimeline(title, detail, className = '') {
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
  $('#timeline').prepend(li);
}

function selectAsset(id, silent = false) {
  const data = assets[id];
  if (!data) return;
  $$('.marker').forEach(marker => marker.classList.toggle('selected', marker.dataset.id === id));
  $('#selectedAsset').textContent = id;
  $('#lastContact').textContent = data.contact;
  const batteryCell = $$('.buoy-summary dd')[1];
  if (batteryCell) batteryCell.textContent = `▰ ${data.battery}%`;
  $('#viewTitle').textContent = `${data.type}: ${id}`;
  if (!silent) toast(`${id} selected — ${data.status}`);
}

$$('.marker').forEach(marker => {
  marker.addEventListener('click', () => selectAsset(marker.dataset.id));
});

$$('.nav-item').forEach(button => {
  button.addEventListener('click', () => {
    $$('.nav-item').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    $('#viewTitle').textContent = button.dataset.view === 'Overview' ? 'Live Maritime Map' : button.dataset.view;
    toast(`${button.dataset.view} view loaded in prototype mode`);
  });
});

$('#assetSearch').addEventListener('input', event => {
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

$('#messageForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#messageInput');
  const text = input.value.trim();
  const asset = $('#selectedAsset').textContent;
  if (!text) {
    toast('Type a message before sending.');
    return;
  }
  addTimeline(`Message sent to ${asset}`, text);
  input.value = '';
  toast(`Message queued through SagaraMesh relay to ${asset}`);
});

$('#respondBtn').addEventListener('click', () => {
  addTimeline('Rescue response acknowledged', 'TN-09-FB-214 assigned to nearest buoy relay', 'warn');
  selectAsset('TN-09-FB-214');
  $('#respondBtn').textContent = 'Acknowledged';
  $('#respondBtn').disabled = true;
  toast('Distress response acknowledged and logged.');
});

$('#viewDistressBtn').addEventListener('click', () => {
  selectAsset('TN-09-FB-214');
  $('#viewTitle').textContent = 'Distress Track: TN-09-FB-214';
  toast('Distress vessel centered in the command map.');
});

$('#relayBtn').addEventListener('click', () => {
  const asset = $('#selectedAsset').textContent;
  addTimeline('Emergency relay triggered', `${asset} broadcasting SOS acknowledgement and weather-safe route`, 'warn');
  $('.system-pill').innerHTML = '<i></i> Emergency Relay Active';
  $('.system-pill').style.color = '#ffc928';
  toast('Emergency relay simulation active.');
});

$('#resetMap').addEventListener('click', () => {
  $('#assetSearch').value = '';
  $$('.marker').forEach(marker => marker.style.opacity = '1');
  selectAsset('BUOY-07');
  $('#viewTitle').textContent = 'Live Maritime Map';
});

updateClock();
setInterval(updateClock, 1000);
selectAsset('BUOY-07', true);
$('#viewTitle').textContent = 'Live Maritime Map';
