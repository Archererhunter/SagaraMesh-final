from __future__ import annotations

import asyncio
import json
import math
import os
import random
import sqlite3
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = Path(os.getenv("SAGARAMESH_DATA_DIR", ROOT / "data"))
DB_PATH = DATA_DIR / "sagaramesh.sqlite3"
WEBSITE_DIR = ROOT / "website"
OPEN_METEO_MARINE = "https://marine-api.open-meteo.com/v1/marine"
OPEN_METEO_FORECAST = "https://api.open-meteo.com/v1/forecast"
OVERPASS_URLS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
DEFAULT_LAT = float(os.getenv("SAGARAMESH_LAT", "11.75"))
DEFAULT_LON = float(os.getenv("SAGARAMESH_LON", "79.77"))

BUOYS = {
    f"BUOY-{i:02d}": {"kind": "buoy", "name": f"BUOY-{i:02d}", "lat": DEFAULT_LAT + (i - 6) * 0.045, "lon": DEFAULT_LON + (i % 4) * 0.075, "battery": b}
    for i, b in enumerate([84, 71, 88, 76, 80, 69, 78, 82, 64, 73, 79, 55], start=1)
}
VESSELS = {
    "TN-09-FB-101": {"kind": "vessel", "name": "TN-09-FB-101", "lat": 11.68, "lon": 79.91, "battery": 91},
    "TN-09-FB-112": {"kind": "vessel", "name": "TN-09-FB-112", "lat": 11.53, "lon": 79.84, "battery": 86},
    "TN-09-FB-175": {"kind": "vessel", "name": "TN-09-FB-175", "lat": 11.62, "lon": 80.04, "battery": 89},
    "TN-09-FB-214": {"kind": "distress", "name": "TN-09-FB-214", "lat": 11.61, "lon": 79.98, "battery": 42},
}
SEED_ASSETS = {**BUOYS, **VESSELS}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with connect() as conn:
        conn.executescript(
            """
            create table if not exists assets (
              id text primary key,
              kind text not null,
              name text not null,
              lat real not null,
              lon real not null,
              battery real not null,
              status text not null,
              updated_at text not null
            );
            create table if not exists telemetry (
              id integer primary key autoincrement,
              asset_id text not null,
              ts text not null,
              lat real,
              lon real,
              battery real,
              signal real,
              payload text not null,
              foreign key(asset_id) references assets(id)
            );
            create table if not exists messages (
              id integer primary key autoincrement,
              ts text not null,
              target text not null,
              body text not null,
              status text not null
            );
            create table if not exists incidents (
              id text primary key,
              vessel_id text not null,
              status text not null,
              description text not null,
              created_at text not null,
              updated_at text not null
            );
            create table if not exists weather_snapshots (
              id integer primary key autoincrement,
              ts text not null,
              source text not null,
              lat real not null,
              lon real not null,
              payload text not null
            );
            create table if not exists open_data_cache (
              key text primary key,
              ts text not null,
              source text not null,
              payload text not null
            );
            """
        )
        for asset_id, asset in SEED_ASSETS.items():
            conn.execute(
                "insert or ignore into assets(id, kind, name, lat, lon, battery, status, updated_at) values(?,?,?,?,?,?,?,?)",
                (asset_id, asset["kind"], asset["name"], asset["lat"], asset["lon"], asset["battery"], "online", now_iso()),
            )
        conn.execute(
            "insert or ignore into incidents(id, vessel_id, status, description, created_at, updated_at) values(?,?,?,?,?,?)",
            ("INC-2026-0824-001", "TN-09-FB-214", "active", "SOS active off Cuddalore Coast; nearest relay BUOY-07", now_iso(), now_iso()),
        )


def rows(query: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
    with connect() as conn:
        return [dict(r) for r in conn.execute(query, params).fetchall()]


def row(query: str, params: tuple[Any, ...] = ()) -> dict[str, Any] | None:
    with connect() as conn:
        r = conn.execute(query, params).fetchone()
        return dict(r) if r else None


def snapshot() -> dict[str, Any]:
    assets = rows("select * from assets order by id")
    incidents = rows("select * from incidents order by created_at desc")
    latest_weather = row("select * from weather_snapshots order by id desc limit 1")
    open_data = row("select * from open_data_cache where key='tamil_nadu_coast_places'")
    messages = rows("select * from messages order by id desc limit 20")
    return {
        "ts": now_iso(),
        "storage": {"sqlite_path": str(DB_PATH), "assets": len(assets), "messages": len(messages)},
        "assets": assets,
        "incidents": incidents,
        "weather": json.loads(latest_weather["payload"]) if latest_weather else None,
        "open_data": json.loads(open_data["payload"]) if open_data else None,
        "messages": messages,
    }


class TelemetryIn(BaseModel):
    lat: float | None = None
    lon: float | None = None
    battery: float | None = Field(default=None, ge=0, le=100)
    signal: float | None = Field(default=None, ge=0, le=100)
    payload: dict[str, Any] = Field(default_factory=dict)


class MessageIn(BaseModel):
    target: str = "BUOY-07"
    body: str = Field(min_length=1, max_length=500)


async def fetch_weather(lat: float = DEFAULT_LAT, lon: float = DEFAULT_LON) -> dict[str, Any]:
    async with httpx.AsyncClient(timeout=12) as client:
        marine_req = client.get(OPEN_METEO_MARINE, params={"latitude": lat, "longitude": lon, "current": "wave_height,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height", "hourly": "wave_height,wind_wave_height,swell_wave_height,wave_period", "forecast_days": 3, "timezone": "Asia/Kolkata"})
        forecast_req = client.get(OPEN_METEO_FORECAST, params={"latitude": lat, "longitude": lon, "current": "temperature_2m,wind_speed_10m,wind_direction_10m", "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant", "forecast_days": 3, "timezone": "Asia/Kolkata"})
        marine, forecast = await asyncio.gather(marine_req, forecast_req)
        marine.raise_for_status(); forecast.raise_for_status()
    payload = {"source": "Open-Meteo Marine + Forecast", "lat": lat, "lon": lon, "marine": marine.json(), "forecast": forecast.json(), "fetched_at": now_iso()}
    with connect() as conn:
        conn.execute("insert into weather_snapshots(ts, source, lat, lon, payload) values(?,?,?,?,?)", (now_iso(), payload["source"], lat, lon, json.dumps(payload)))
    return payload


REAL_TN_COASTAL_PLACES = [
    {"name": "Chennai Port", "kind": "port", "lat": 13.1067, "lon": 80.2936, "source": "curated public coordinates"},
    {"name": "Ennore / Kamarajar Port", "kind": "port", "lat": 13.2639, "lon": 80.3464, "source": "curated public coordinates"},
    {"name": "Cuddalore Harbour", "kind": "harbour", "lat": 11.7084, "lon": 79.7787, "source": "curated public coordinates"},
    {"name": "Nagapattinam Harbour", "kind": "harbour", "lat": 10.7656, "lon": 79.8496, "source": "curated public coordinates"},
    {"name": "Karaikal Port", "kind": "port", "lat": 10.8365, "lon": 79.8499, "source": "curated public coordinates"},
    {"name": "Pamban / Rameswaram Fishing Coast", "kind": "fishing coast", "lat": 9.2795, "lon": 79.2117, "source": "curated public coordinates"},
    {"name": "Thoothukudi / V.O.C. Port", "kind": "port", "lat": 8.7510, "lon": 78.1994, "source": "curated public coordinates"},
    {"name": "Kanniyakumari Fishing Harbour", "kind": "harbour", "lat": 8.0883, "lon": 77.5385, "source": "curated public coordinates"},
]


async def fetch_open_coastal_places() -> dict[str, Any]:
    query = """
    [out:json][timeout:20];
    (
      node["harbour"](8.0,77.4,13.5,80.5);
      way["harbour"](8.0,77.4,13.5,80.5);
      node["seamark:type"="harbour"](8.0,77.4,13.5,80.5);
      node["man_made"="lighthouse"](8.0,77.4,13.5,80.5);
      node["amenity"="ferry_terminal"](8.0,77.4,13.5,80.5);
    );
    out center tags 60;
    """
    places: list[dict[str, Any]] = []
    source = "OpenStreetMap Overpass API"
    last_error = None
    for overpass_url in OVERPASS_URLS:
        try:
            async with httpx.AsyncClient(timeout=25) as client:
                response = await client.post(overpass_url, data={"data": query})
                response.raise_for_status()
            for element in response.json().get("elements", []):
                tags = element.get("tags", {})
                lat = element.get("lat") or element.get("center", {}).get("lat")
                lon = element.get("lon") or element.get("center", {}).get("lon")
                name = tags.get("name") or tags.get("seamark:name")
                if lat is None or lon is None or not name:
                    continue
                places.append({
                    "name": name,
                    "kind": tags.get("harbour") or tags.get("seamark:type") or tags.get("man_made") or tags.get("amenity") or "coastal place",
                    "lat": lat,
                    "lon": lon,
                    "source": f"{source} ({overpass_url})",
                    "osm_id": element.get("id"),
                })
            if places:
                break
        except Exception as exc:
            last_error = exc
    if not places:
        places = [{**place, "fallback_reason": str(last_error)} for place in REAL_TN_COASTAL_PLACES]
        source = "curated public coordinates fallback; Overpass unavailable"
    if len(places) < 4:
        existing_names = {p["name"] for p in places}
        places.extend([place for place in REAL_TN_COASTAL_PLACES if place["name"] not in existing_names])
    payload = {"source": source, "fetched_at": now_iso(), "places": places[:40]}
    with connect() as conn:
        conn.execute(
            "insert or replace into open_data_cache(key, ts, source, payload) values(?,?,?,?)",
            ("tamil_nadu_coast_places", now_iso(), source, json.dumps(payload)),
        )
    return payload


async def simulator() -> None:
    while True:
        await asyncio.sleep(8)
        asset_id = random.choice(list(SEED_ASSETS))
        asset = row("select * from assets where id=?", (asset_id,))
        if not asset:
            continue
        battery = max(5.0, min(100.0, float(asset["battery"]) + random.uniform(-0.45, 0.2)))
        lat = float(asset["lat"]) + random.uniform(-0.003, 0.003)
        lon = float(asset["lon"]) + random.uniform(-0.003, 0.003)
        signal = max(40.0, min(100.0, 75 + random.uniform(-12, 14)))
        payload = {"simulated": True, "status": "online", "source": "SagaraMesh simulator"}
        with connect() as conn:
            conn.execute("update assets set lat=?, lon=?, battery=?, status=?, updated_at=? where id=?", (lat, lon, battery, "online", now_iso(), asset_id))
            conn.execute("insert into telemetry(asset_id, ts, lat, lon, battery, signal, payload) values(?,?,?,?,?,?,?)", (asset_id, now_iso(), lat, lon, battery, signal, json.dumps(payload)))


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    try:
        await fetch_weather()
        await fetch_open_coastal_places()
    except Exception:
        pass
    task = asyncio.create_task(simulator())
    try:
        yield
    finally:
        task.cancel()


app = FastAPI(title="SagaraMesh Realtime API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])


@app.get("/api/health")
def health():
    return {"ok": True, "ts": now_iso(), "storage": str(DB_PATH), "open_source_sources": ["OpenStreetMap tiles", "OpenStreetMap Overpass API", "Open-Meteo Marine API", "SQLite", "FastAPI"]}


@app.get("/api/snapshot")
def api_snapshot():
    return snapshot()


@app.get("/api/assets")
def api_assets():
    return {"assets": rows("select * from assets order by id")}


@app.post("/api/assets/{asset_id}/telemetry")
def ingest_telemetry(asset_id: str, item: TelemetryIn):
    asset = row("select * from assets where id=?", (asset_id,))
    if not asset:
        return {"ok": False, "error": "unknown asset"}
    lat = item.lat if item.lat is not None else asset["lat"]
    lon = item.lon if item.lon is not None else asset["lon"]
    battery = item.battery if item.battery is not None else asset["battery"]
    signal = item.signal if item.signal is not None else 80
    with connect() as conn:
        conn.execute("update assets set lat=?, lon=?, battery=?, status=?, updated_at=? where id=?", (lat, lon, battery, "online", now_iso(), asset_id))
        conn.execute("insert into telemetry(asset_id, ts, lat, lon, battery, signal, payload) values(?,?,?,?,?,?,?)", (asset_id, now_iso(), lat, lon, battery, signal, json.dumps(item.payload)))
    return {"ok": True, "asset_id": asset_id, "stored": True}


@app.get("/api/telemetry/latest")
def latest_telemetry(limit: int = 50):
    return {"telemetry": rows("select * from telemetry order by id desc limit ?", (min(limit, 200),))}


@app.get("/api/weather/current")
async def current_weather(lat: float = DEFAULT_LAT, lon: float = DEFAULT_LON):
    return await fetch_weather(lat, lon)


@app.get("/api/open-data/coastal-places")
async def open_data_coastal_places(refresh: bool = False):
    cached = row("select * from open_data_cache where key='tamil_nadu_coast_places'")
    if refresh or not cached:
        return await fetch_open_coastal_places()
    return json.loads(cached["payload"])


@app.post("/api/messages")
def create_message(msg: MessageIn):
    with connect() as conn:
        cur = conn.execute("insert into messages(ts, target, body, status) values(?,?,?,?)", (now_iso(), msg.target, msg.body, "queued"))
    return {"ok": True, "id": cur.lastrowid, "stored": True, "status": "queued"}


@app.post("/api/incidents/{incident_id}/ack")
def acknowledge_incident(incident_id: str):
    with connect() as conn:
        conn.execute("update incidents set status=?, updated_at=? where id=?", ("acknowledged", now_iso(), incident_id))
    return {"ok": True, "incident_id": incident_id, "status": "acknowledged", "stored": True}


@app.websocket("/ws")
async def websocket_updates(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(snapshot())
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        return


app.mount("/assets", StaticFiles(directory=WEBSITE_DIR / "assets"), name="assets")


@app.get("/{page:path}")
def static_site(page: str = "index.html"):
    if not page or page == "/":
        page = "index.html"
    target = (WEBSITE_DIR / page).resolve()
    if target.is_dir():
        target = target / "index.html"
    if not str(target).startswith(str(WEBSITE_DIR.resolve())) or not target.exists():
        target = WEBSITE_DIR / "index.html"
    return FileResponse(target)
