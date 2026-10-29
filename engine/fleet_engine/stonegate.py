"""Stonegate's orders as engine jobs. The site sends the day's rows with each
quote request (`service_orders`, `orders` and `calendar_jobs`, shaped like the
Supabase tables), so the engine never reads the database itself.

Every row the booking form's availability counts (lib/availability.ts) is a
job here too, including pending orders and subcontract jobs: they all take
the truck."""

from dataclasses import dataclass, replace

from .config import parse_time
from .geocode import Geocoder
from .insertion import InsertionResult, evaluate_windows
from .model import Fleet, Job, Location, Window
from .pricing import PricingPolicy, Quote, make_offers
from .routing import plan_day
from .travel import TravelProvider

# Same labels and fractions as TRUCK_FRACTIONS in lib/quote-pricing.ts.
TRUCK_FRACTIONS = {"1/8 Truck": 1 / 8, "1/4 Truck": 1 / 4, "1/2 Truck": 1 / 2, "3/4 Truck": 3 / 4, "Full Truck": 1.0}
# A booked time is the start of a 2-hour arrival slot (SLOT_STEP_MIN in lib/scheduling.ts).
SLOT_MIN = 120
# The chatbot's handling estimate when the parking distance isn't known
# (LOAD_MIN_PER_YD3 + CARRY_MIN_PER_YD3["unknown"] in chatbot_server/main.py),
# for orders that don't come with the chat's own estimate. A removal rarely
# takes less than 2 hours on site, however small the load.
ON_SITE_MIN_PER_YD3 = 9
MIN_ON_SITE_MIN = 120
# Calendar junk jobs have no load size.
UNKNOWN_LOAD_FRACTION = 1 / 2
# Same defaults as lib/scheduling.ts.
DEFAULT_MOVE_MIN = 300
UNSCHEDULED_JOB_BLOCK_MIN = 360


@dataclass(frozen=True)
class DayJobs:
    jobs: list[Job]
    # Guesses that make the day's costs less reliable, e.g. an address that
    # couldn't be found. The caller decides whether to still offer discounts.
    warnings: list[str]


@dataclass(frozen=True)
class QuoteRun:
    """Everything behind one quote: the offers, and how they were worked out."""
    carry_in_yd3: float
    warnings: list[str]
    request: Job
    tier: str
    result: InsertionResult
    quote: Quote


def quote_request(
    fleet: Fleet,
    policy: PricingPolicy,
    base_prices: dict[str, float],
    geocoder: Geocoder,
    travel: TravelProvider,
    rows: dict,
    previous_day_rows: dict,
    address: str,
    preferred_time: str,
    load_size: str | None = None,
    volume_yd3: float | None = None,
    on_site_min: float | None = None,
) -> QuoteRun:
    """Offers for a junk request on the day of `rows`, against the slot the
    customer picked (`preferred_time`, the slot's start as "HH:MM")."""
    carry_in = carried_over(fleet, previous_day_rows, geocoder, travel)
    booked = booked_jobs(fleet, rows, geocoder)
    request = request_job(fleet, geocoder, address, load_size, volume_yd3, on_site_min)
    warnings = list(booked.warnings)
    if request.location.approximate:
        warnings.append(f"request: {address!r} only found to the street, location may be off")

    start = parse_time(preferred_time)
    picked = Window(start, start + SLOT_MIN)
    tier = load_size or pricing_tier(fleet, request.volume_yd3)
    result = evaluate_windows(fleet, booked.jobs, request, travel, carry_in_yd3=carry_in)
    quote = make_offers(result, picked, base_prices[tier], policy)
    return QuoteRun(carry_in_yd3=carry_in, warnings=warnings, request=request, tier=tier, result=result,
                    quote=quote)


def junk_volume(fleet: Fleet, load_size: str) -> float:
    return TRUCK_FRACTIONS[load_size] * fleet.trucks[0].capacity_yd3


def on_site_minutes(volume_yd3: float) -> float:
    return max(MIN_ON_SITE_MIN, volume_yd3 * ON_SITE_MIN_PER_YD3)


def pricing_tier(fleet: Fleet, volume_yd3: float) -> str:
    """Smallest load size holding the volume; rounds up like the chatbot's
    load_size_from_fraction, so the price never undershoots the load."""
    fraction = volume_yd3 / fleet.trucks[0].capacity_yd3
    return next((label for label, f in TRUCK_FRACTIONS.items() if fraction <= f + 1e-9), "Full Truck")


def request_job(
    fleet: Fleet,
    geocoder: Geocoder,
    address: str,
    load_size: str | None = None,
    volume_yd3: float | None = None,
    on_site_min: float | None = None,
) -> Job:
    """The junk request being quoted. `volume_yd3` and `on_site_min` are the
    chat's estimates when it has them; otherwise they follow from `load_size`.
    Check `location.approximate` before trusting what its windows cost."""
    location = geocoder.locate(address)
    if location is None:
        raise ValueError(f"couldn't locate {address!r}")
    if volume_yd3 is None:
        if load_size not in TRUCK_FRACTIONS:
            raise ValueError("a load size or volume is needed")
        volume_yd3 = junk_volume(fleet, load_size)
    return Job(
        id="request",
        location=location,
        service_min=on_site_min if on_site_min is not None else on_site_minutes(volume_yd3),
        volume_yd3=volume_yd3,
    )


def carried_over(fleet: Fleet, previous_day_rows: dict, geocoder: Geocoder, travel: TravelProvider) -> float:
    """Junk the truck parks with the night before (cubic yards). That day's own
    carry-in, two nights back, is assumed dumped."""
    previous = booked_jobs(fleet, previous_day_rows, geocoder)
    return plan_day(fleet, previous.jobs, travel).overnight_yd3 if previous.jobs else 0.0


def booked_jobs(fleet: Fleet, rows: dict, geocoder: Geocoder) -> DayJobs:
    """`rows`: {"service_orders": [...], "orders": [...], "calendar_jobs": [...]} for one day."""
    jobs: list[Job] = []
    warnings: list[str] = []
    shift_start = fleet.trucks[0].shift.start

    def locate(address: str | None, label: str) -> Location:
        found = geocoder.locate(address) if address else None
        if found:
            if found.approximate:
                warnings.append(f"{label}: {address!r} only found to the street, location may be off")
            return found
        warnings.append(f"{label}: {'no address' if not address else f'could not locate {address!r}'}, "
                        "assumed at the depot")
        return replace(fleet.depot, name=f"{label} (location unknown)")

    junk_ids, move_ids = set(), set()

    for row in rows.get("service_orders", []):
        if row.get("status") == "cancelled" or not row.get("service_time"):
            continue
        label = f"J{row.get('order_number') or row['id']}"
        load_size = row.get("load_size")
        if load_size not in TRUCK_FRACTIONS:
            warnings.append(f"{label}: no load size, assumed {UNKNOWN_LOAD_FRACTION:g} truck")
            volume = UNKNOWN_LOAD_FRACTION * fleet.trucks[0].capacity_yd3
        else:
            volume = junk_volume(fleet, load_size)
        start = parse_time(row["service_time"])
        jobs.append(Job(label, locate(row.get("address"), label), service_min=on_site_minutes(volume),
                        window=Window(start, start + SLOT_MIN), volume_yd3=volume))
        junk_ids.add(row["id"])

    for row in rows.get("orders", []):
        if row.get("status") == "cancelled" or not row.get("moving_time"):
            continue
        label = f"M{row.get('order_number') or row['id']}"
        minutes = row.get("duration_minutes") or DEFAULT_MOVE_MIN
        start = parse_time(row["moving_time"])
        # The move's duration is split between loading and unloading; the
        # engine adds the drive between them on top, so this runs a little long.
        jobs.append(Job(label, locate(row.get("pickup_address"), label), service_min=minutes / 2,
                        window=Window(start, start + SLOT_MIN),
                        dropoff=locate(row.get("dropoff_address"), f"{label} dropoff"),
                        dropoff_service_min=minutes / 2))
        move_ids.add(row["id"])

    for row in rows.get("calendar_jobs", []):
        # Entries linked to an order above are the same job.
        if row.get("order_id") in move_ids or row.get("service_order_id") in junk_ids:
            continue
        label = f"C{(row.get('customer_name') or row.get('company_name') or row['id'])[:20]}"
        location = locate(row.get("pickup_address"), label)
        if row.get("event_time"):
            start = parse_time(row["event_time"])
            window = Window(start, start + SLOT_MIN)
        else:
            # No time: the same half-day-from-opening block the booking form assumes.
            window = Window(shift_start, shift_start)
        if row.get("job_type") == "junk_removal":
            volume = UNKNOWN_LOAD_FRACTION * fleet.trucks[0].capacity_yd3
            minutes = row.get("duration_minutes") or (
                on_site_minutes(volume) if row.get("event_time") else UNSCHEDULED_JOB_BLOCK_MIN)
            jobs.append(Job(label, location, service_min=minutes, window=window, volume_yd3=volume))
        else:
            # No dropoff address in the calendar: the move is treated as taking
            # the (empty) truck at the pickup for its whole duration.
            minutes = row.get("duration_minutes") or (
                DEFAULT_MOVE_MIN if row.get("event_time") else UNSCHEDULED_JOB_BLOCK_MIN)
            jobs.append(Job(label, location, service_min=minutes, window=window, dropoff=location))

    return DayJobs(jobs=jobs, warnings=warnings)
