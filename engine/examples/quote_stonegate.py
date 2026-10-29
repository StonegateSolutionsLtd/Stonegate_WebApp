"""The whole path a quote will take: one day's orders, addresses geocoded,
then every window priced against the customer's pick. Run from engine/:

    # Sample day, no database:
    .venv/bin/python examples/quote_stonegate.py [examples/sample_day.json]

    # Your Supabase data (read-only). Without --date, lists the next days with orders:
    .venv/bin/python examples/quote_stonegate.py --supabase
    .venv/bin/python examples/quote_stonegate.py --supabase --date 2026-11-03 \\
        --address "6138 Student Union Blvd, Vancouver" --load-size "1/4 Truck" --time 18:00

Supabase needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, from the
environment or the repo's .env.local (the same ones Next uses). Addresses are
looked up on OpenStreetMap (Nominatim) and cached in data/geocode-cache.json."""

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

ENGINE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ENGINE))

from fleet_engine import NominatimGeocoder, StraightLineTravel, load_fleet, load_pricing  # noqa: E402
from fleet_engine.geocode import SSL_CONTEXT  # noqa: E402
from fleet_engine.stonegate import TRUCK_FRACTIONS, quote_request  # noqa: E402

# Same tables and filters as loadBusyByDate in lib/availability.ts.
TABLES = {
    "service_orders": ("service_date", True,
                       "id,order_number,address,service_date,service_time,load_size,duration_minutes,status"),
    "orders": ("moving_date", True,
               "id,order_number,pickup_address,dropoff_address,moving_date,moving_time,duration_minutes,status"),
    "calendar_jobs": ("event_date", False,
                      "id,job_type,event_date,event_time,duration_minutes,pickup_address,customer_name,"
                      "company_name,order_id,service_order_id"),
}
LIST_DAYS = 14


def env(name: str) -> str:
    if name in os.environ:
        return os.environ[name]
    env_file = ENGINE.parent / ".env.local"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            key, sep, value = line.partition("=")
            if sep and key.strip() == name:
                return value.strip().strip('"').strip("'")
    sys.exit(f"{name} isn't set: add it to .env.local or the environment")


def supabase_rows(table: str, filters: dict[str, str]) -> list[dict]:
    date_column, has_status, columns = TABLES[table]
    query = {"select": columns, **filters}
    if has_status:
        query["status"] = "neq.cancelled"
    url = f"{env('NEXT_PUBLIC_SUPABASE_URL').rstrip('/')}/rest/v1/{table}?{urllib.parse.urlencode(query)}"
    key = env("SUPABASE_SERVICE_ROLE_KEY")
    request = urllib.request.Request(url, headers={"apikey": key, "Authorization": f"Bearer {key}"})
    with urllib.request.urlopen(request, timeout=15, context=SSL_CONTEXT) as response:
        return json.load(response)


def list_days() -> None:
    start = date.today()
    end = start + timedelta(days=LIST_DAYS - 1)
    counts: dict[str, dict[str, int]] = {}
    for table, (date_column, _, _) in TABLES.items():
        rows = supabase_rows(table, {date_column: f"gte.{start}", "and": f"({date_column}.lte.{end})"})
        for row in rows:
            day = counts.setdefault(row[date_column], {t: 0 for t in TABLES})
            day[table] += 1
    if not counts:
        print(f"No orders between {start} and {end}.")
        return
    print("Days with orders (junk / moving / calendar):")
    for day in sorted(counts):
        c = counts[day]
        print(f"  {day}  {c['service_orders']} / {c['orders']} / {c['calendar_jobs']}")
    print("\nQuote one with --date YYYY-MM-DD --address ... --load-size ... --time HH:MM")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("file", nargs="?", default=ENGINE / "examples" / "sample_day.json")
    parser.add_argument("--supabase", action="store_true", help="read the day's orders from Supabase")
    parser.add_argument("--date", help="YYYY-MM-DD")
    parser.add_argument("--address", help="the new request's address")
    parser.add_argument("--load-size", choices=list(TRUCK_FRACTIONS), default="1/4 Truck")
    parser.add_argument("--time", help="the slot the customer picked, HH:MM (06:00, 08:00, ... 20:00)")
    args = parser.parse_args()

    if args.supabase:
        if not args.date:
            list_days()
            return
        if not args.address or not args.time:
            parser.error("--address and --time are needed with --date")
        rows = day_rows(args.date)
        # The day before decides what's still on the truck in the morning.
        previous_rows = day_rows(str(date.fromisoformat(args.date) - timedelta(days=1)))
        ask = {"address": args.address, "load_size": args.load_size, "preferred_time": args.time}
    else:
        day = json.loads(Path(args.file).read_text(encoding="utf-8"))
        rows, ask = day["rows"], day["request"]
        previous_rows = day.get("previous_day_rows", {})

    quote(rows, previous_rows, ask)


def day_rows(day: str) -> dict:
    return {table: supabase_rows(table, {date_column: f"eq.{day}"}) for table, (date_column, _, _) in TABLES.items()}


def quote(rows: dict, previous_rows: dict, ask: dict) -> None:
    tenant = ENGINE / "tenants" / "stonegate.json"
    fleet = load_fleet(tenant)
    policy, base_prices = load_pricing(tenant)
    run = quote_request(
        fleet, policy, base_prices, NominatimGeocoder(ENGINE / "data" / "geocode-cache.json"), StraightLineTravel(),
        rows, previous_rows, ask["address"], ask["preferred_time"], load_size=ask.get("load_size"),
        volume_yd3=ask.get("volume_yd3"), on_site_min=ask.get("on_site_min"),
    )
    result, offer = run.result, run.quote

    if run.carry_in_yd3:
        print(f"On the truck from the day before: {run.carry_in_yd3:.1f} yd³ (dumped today)")
    for warning in run.warnings:
        print(f"Warning: {warning}")
    print("Day as booked:\n" + (result.baseline.describe() or "  nothing booked") + "\n")

    picked = next((o for o in result.options if o.window == offer.picked), None)
    print(f"Request: {run.tier} at {ask['address']}, wants {offer.picked.label()}")
    for o in result.options:
        marker = "  <- customer's pick" if o.window == offer.picked else ""
        if not o.feasible:
            print(f"  {o.window.label()}  doesn't fit{marker}")
            continue
        saving = ""
        if picked and picked.feasible and o.extra_cost < picked.extra_cost:
            saving = f"  saves us ${picked.extra_cost - o.extra_cost:.2f}"
        print(f"  {o.window.label()}  +${o.extra_cost:>6.2f}  +{o.extra_paid_min:>3.0f} min  "
              f"+{o.extra_km:>4.1f} km  {o.extra_dump_visits:+d} dump{marker}{saving}")

    print(f"\nWhat the customer sees ({run.tier}):")
    if not offer.picked_fits:
        print(f"  {offer.picked.label()} doesn't fit the day: no offers")
        return
    print(f"  Your pick, {offer.picked.label()}: ${offer.base_price:,.0f}")
    if not offer.offers:
        print("  (no cheaper time worth offering)")
    for o in offer.offers:
        print(f"  {o.message}   [saves us ${o.our_saving:.0f}, margin ${o.margin:.0f}]")

    if offer.offers:
        accepted = next(opt for opt in result.options if opt.window == offer.offers[0].window)
        print(f"\nThe day if they take {accepted.window.label()}:\n" + accepted.plan.describe())


if __name__ == "__main__":
    main()
