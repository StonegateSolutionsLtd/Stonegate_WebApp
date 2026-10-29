"""A made-up Metro Vancouver day on Stonegate's fleet: which windows are
cheapest for a new junk request? Run from engine/:
    .venv/bin/python examples/demo_day.py"""

import sys
from pathlib import Path

# Run as a plain script: make fleet_engine importable from engine/.
ENGINE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ENGINE))

from fleet_engine import Job, Location, StraightLineTravel, Window, evaluate_windows, load_fleet  # noqa: E402


def h(hours: float) -> int:
    return round(hours * 60)


fleet = load_fleet(ENGINE / "tenants" / "stonegate.json")

booked = [
    Job("#101 Kitsilano", Location(49.2684, -123.1683, "Kitsilano"), service_min=45,
        window=Window(h(8), h(10)), volume_yd3=7),
    Job("#102 Richmond", Location(49.1666, -123.1336, "Richmond"), service_min=60,
        window=Window(h(12), h(14)), volume_yd3=14),
    Job("#103 Coquitlam", Location(49.2838, -122.7932, "Coquitlam"), service_min=40,
        window=Window(h(16), h(18)), volume_yd3=4),
]

# Next to the morning Kitsilano job, but the customer picked the evening.
request = Job("NEW Point Grey", Location(49.2644, -123.1953, "Point Grey"), service_min=30, volume_yd3=5)
preferred = Window(h(18), h(20))

result = evaluate_windows(fleet, booked, request, StraightLineTravel())

print("Day as booked:\n" + result.baseline.describe() + "\n")
print(f"Adding {request.id} (customer wants {preferred.label()}):")
for o in result.options:
    marker = "  <- customer's pick" if o.window == preferred else ""
    if o.feasible:
        print(f"  {o.window.label()}  +${o.extra_cost:>6.2f}  +{o.extra_paid_min:>3.0f} min  "
              f"+{o.extra_km:>4.1f} km  {o.extra_dump_visits:+d} dump{marker}")
    else:
        print(f"  {o.window.label()}  doesn't fit{marker}")

best = result.cheapest()
print(f"\nCheapest: {best.window.label()}\n" + best.plan.describe())
