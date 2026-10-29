"""Addresses to coordinates. Orders only store the address as typed, so every
job has to be located before it can be routed.

NominatimGeocoder uses OpenStreetMap's free geocoder. Its usage policy allows
at most one request a second and asks that results be cached, so every
lookup (found or not) is kept in a JSON file and an address is only ever
looked up once. The cache holds customer addresses: keep it out of git.

OpenStreetMap is missing many BC house numbers; Nominatim then matches some
other point on the street (for "6551 No. 3 Road, Richmond", a fishing pier
6 km away). A match without the house number is marked approximate."""

import json
import os
import ssl
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Protocol

import certifi

from .model import Location

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
# Prefer matches in Metro Vancouver (lng/lat: west, north, east, south) without
# ruling out the rest of Canada.
METRO_VANCOUVER_VIEWBOX = "-123.35,49.45,-122.40,49.00"
MIN_SECONDS_BETWEEN_REQUESTS = 1.1
TIMEOUT_SECONDS = 10
# python.org's Python on macOS ships without root certificates.
SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())


class GeocodingUnavailable(Exception):
    """The geocoder couldn't be reached; nothing is known about the address."""


class Geocoder(Protocol):
    def locate(self, address: str) -> Location | None:
        """None when the address can't be found; GeocodingUnavailable when
        the geocoder itself can't be reached."""
        ...


def normalize(address: str) -> str:
    return " ".join(address.lower().replace(",", " ").split())


class NominatimGeocoder:
    def __init__(self, cache_path: str | Path, user_agent: str | None = None):
        self.cache_path = Path(cache_path)
        # Nominatim asks for an identifying User-Agent, ideally with a contact.
        self.user_agent = user_agent or os.environ.get("NOMINATIM_USER_AGENT", "stonegate-fleet-engine/0.1")
        # normalized address -> {"lat", "lng", "approximate"}, or None when not found.
        self.cache: dict[str, dict | None] = (
            json.loads(self.cache_path.read_text(encoding="utf-8")) if self.cache_path.exists() else {}
        )
        self._last_request = 0.0
        # The server quotes in parallel: one lookup at a time keeps the rate
        # limit and the cache file intact.
        self._lock = threading.Lock()

    def locate(self, address: str) -> Location | None:
        key = normalize(address)
        with self._lock:
            if key not in self.cache:
                self.cache[key] = self._lookup(address)
                self.cache_path.parent.mkdir(parents=True, exist_ok=True)
                self.cache_path.write_text(json.dumps(self.cache, indent=2), encoding="utf-8")
            point = self.cache[key]
        return Location(point["lat"], point["lng"], address, point["approximate"]) if point else None

    def _lookup(self, address: str) -> dict | None:
        wait = self._last_request + MIN_SECONDS_BETWEEN_REQUESTS - time.monotonic()
        if wait > 0:
            time.sleep(wait)
        query = urllib.parse.urlencode({
            "q": address, "format": "jsonv2", "limit": 1, "countrycodes": "ca", "viewbox": METRO_VANCOUVER_VIEWBOX,
            "addressdetails": 1,
        })
        request = urllib.request.Request(f"{NOMINATIM_URL}?{query}", headers={"User-Agent": self.user_agent})
        try:
            with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS, context=SSL_CONTEXT) as response:
                results = json.load(response)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as err:
            # Not cached: it says nothing about the address.
            raise GeocodingUnavailable(str(err)) from err
        finally:
            self._last_request = time.monotonic()
        if not results:
            return None
        best = results[0]
        return {
            "lat": float(best["lat"]),
            "lng": float(best["lon"]),
            "approximate": "house_number" not in best.get("address", {}),
        }
