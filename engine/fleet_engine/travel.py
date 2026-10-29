"""Travel time and distance between locations. The engine only needs a matrix,
so the provider is swappable: straight-line estimates now, a road router
(OSRM / Google Distance Matrix) once real addresses are geocoded."""

import math
from typing import Protocol

from .model import Location

EARTH_RADIUS_KM = 6371


class TravelProvider(Protocol):
    def matrices(self, locations: list[Location]) -> tuple[list[list[int]], list[list[int]]]:
        """(durations in seconds, distances in metres), indexed [from][to]."""
        ...


def haversine_km(a: Location, b: Location) -> float:
    lat1, lat2 = math.radians(a.lat), math.radians(b.lat)
    dlat, dlng = lat2 - lat1, math.radians(b.lng - a.lng)
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2
    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(h))


class StraightLineTravel:
    """Great-circle distance stretched by a road-detour factor, driven at an
    average city speed. Good enough to compare windows against each other;
    not for telling a customer an arrival time."""

    def __init__(self, speed_kmh: float = 35, detour_factor: float = 1.3):
        self.speed_kmh = speed_kmh
        self.detour_factor = detour_factor

    def matrices(self, locations: list[Location]) -> tuple[list[list[int]], list[list[int]]]:
        km = [[haversine_km(a, b) * self.detour_factor for b in locations] for a in locations]
        durations = [[round(d / self.speed_kmh * 3600) for d in row] for row in km]
        distances = [[round(d * 1000) for d in row] for row in km]
        return durations, distances
