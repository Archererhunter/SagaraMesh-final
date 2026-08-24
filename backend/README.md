# SagaraMesh Realtime Backend

Open-source-first realtime + storage backend for the SagaraMesh dashboard.

## What it uses first

Open-source / open-data defaults:

- **FastAPI** for the API and WebSocket server
- **SQLite** for local persistent storage
- **Open-Meteo Marine API** for open marine forecast data
- **Open-Meteo Forecast API** for open wind/temperature data
- Browser-native WebSocket/fetch APIs for realtime updates

Other possible sources later:

- IMD/INCOIS official feeds where access/API permission is available
- AIS providers such as AISHub, MarineTraffic, VesselFinder, Spire, etc.
- Cloud storage/backends such as Supabase, Firebase, Neon, PlanetScale, or managed Postgres

## Run locally

```bash
cd /root/SagaraMesh-final
uv venv .venv
uv pip install --python .venv/bin/python -r backend/requirements.txt
.venv/bin/python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

Open:

- Website: http://127.0.0.1:8000/
- API health: http://127.0.0.1:8000/api/health
- Snapshot: http://127.0.0.1:8000/api/snapshot
- WebSocket: ws://127.0.0.1:8000/ws

SQLite database path by default:

```text
data/sagaramesh.sqlite3
```

Override it:

```bash
SAGARAMESH_DATA_DIR=/path/to/data .venv/bin/python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
```

## Example telemetry ingest

```bash
curl -X POST http://127.0.0.1:8000/api/assets/BUOY-07/telemetry \
  -H 'content-type: application/json' \
  -d '{"battery":77,"signal":91,"payload":{"source":"manual test"}}'
```

## GitHub Pages note

GitHub Pages can host only the static frontend. Realtime APIs, WebSockets, and SQLite storage require this backend to run on a server, VPS, Raspberry Pi/home server, or an open-source backend platform. The static GitHub Pages frontend can connect to the backend URL from the Settings page.
