"""Loads a tenant's fleet and pricing from its JSON config (see tenants/stonegate.json)."""

import json
from pathlib import Path

from .model import Costs, DumpStation, Fleet, Location, Truck, Window
from .pricing import PricingPolicy

FT3_PER_YD3 = 27


def parse_time(value: str) -> int:
    """"HH:MM" or "HH:MM:SS" to minutes since midnight."""
    h, m = value.split(":")[:2]
    return int(h) * 60 + int(m)


def truck_per_km(costs: dict) -> float:
    """Gas plus wear (tires, oil, repairs) per km driven."""
    fuel = costs["fuel_litres_per_100km"] / 100 * costs["fuel_price_per_litre"]
    return round(fuel + costs["wear_per_km"], 4)


def load_pricing(path: str | Path) -> tuple[PricingPolicy, dict[str, float]]:
    """The discount policy, and base prices by load size."""
    pricing = json.loads(Path(path).read_text(encoding="utf-8"))["pricing"]
    policy = PricingPolicy(
        share_of_savings=pricing["share_of_savings"],
        min_discount=pricing["min_discount"],
        max_discount_fraction=pricing["max_discount_fraction"],
        round_to=pricing["round_to"],
    )
    return policy, pricing["base_prices"]


def load_fleet(path: str | Path) -> Fleet:
    config = json.loads(Path(path).read_text(encoding="utf-8"))
    return Fleet(
        depot=Location(config["depot"]["lat"], config["depot"]["lng"], config["depot"]["name"]),
        trucks=[
            Truck(
                id=t["id"],
                capacity_yd3=t["length_ft"] * t["width_ft"] * t["height_ft"] / FT3_PER_YD3,
                shift=Window(parse_time(t["shift"][0]), parse_time(t["shift"][1])),
            )
            for t in config["trucks"]
        ],
        dump_stations=[
            DumpStation(
                location=Location(d["lat"], d["lng"], d["name"]),
                setup_min=d["setup_min"],
                unload_min_per_yd3=d["unload_min_per_yd3"],
                hours=Window(parse_time(d["hours"][0]), parse_time(d["hours"][1])) if d.get("hours") else None,
            )
            for d in config["dump_stations"]
        ],
        costs=Costs(crew_per_hour=config["costs"]["crew_per_hour"], truck_per_km=truck_per_km(config["costs"])),
    )
