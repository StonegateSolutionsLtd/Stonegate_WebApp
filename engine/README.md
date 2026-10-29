# Fleet engine

The quoting engine from the business plan: before a customer books, work out
what each arrival window would cost the fleet, so cheaper windows can be
offered at a lower price. Kept apart from the Stonegate site on purpose: the
site calls it like any other tenant would, sending the day's orders with each
request, so the engine never reads the database itself.

```
browser -> POST /api/quote-options (Next) -> POST /quote (engine/server.py)
            loads the day's orders              plans the day, prices each slot
            (and the day before's) from
            Supabase; returns only the
            customer-facing offers
```

## What's here

- `server.py`: the HTTP service (FastAPI, port 8001, next to the chat server
  on 8000). `POST /quote` takes `rows` and `previousDayRows` (the Supabase
  tables' rows for the day and the day before), `address`, `preferredTime`
  ("HH:MM", the picked slot's start), `loadSize`, and optionally the chat's
  `volumeYd3` / `onSiteMin`. It returns the offers (cheapest first), every
  slot's extra cost, the base price, and warnings. With `ENGINE_SERVER_SECRET`
  set, callers must send it as `X-Engine-Secret`.
- `app/api/quote-options` (in the Next app, with `lib/quote-engine.ts`): loads
  the day's rows with the same filters as availability (no customer names or
  contact details are sent), calls the engine, drops offers for slots the
  booking form no longer has open, and returns only time, price, discount and
  message. Our costs and margins never reach the browser. Errors return 503;
  the booking then goes ahead at the normal price.
- `fleet_engine/routing.py`: `plan_day` runs [VROOM](https://github.com/VROOM-Project/vroom)
  via `pyvroom`. Each junk job is a shipment from the customer to a dump
  station with the truck's volume as capacity, so the solver adds dump runs
  when the truck fills up, tips several loads in one visit, and picks up jobs
  on the way to or from the dump. Each dump visit then moves to the station
  cheapest between the stops either side of it (e.g. on the way home to the
  depot) while that makes the day cheaper. Dumps keep opening hours
  (06:00-17:00); a late load can ride home overnight instead, costed with
  tomorrow's dump stop (priced as a round trip from the depot), and a load
  carried in from yesterday is tipped today. A move takes the whole truck, so
  junk is dumped first. Booked jobs have top priority and are never dropped.
- `fleet_engine/insertion.py`: `evaluate_windows` re-plans the day with the
  new request pinned to each booking-form slot (6-8, 8-10, ... 20-22) and
  returns the extra cost, paid minutes, km and dump visits for each, or that
  it doesn't fit.
- `fleet_engine/pricing.py`: `make_offers` turns those costs into offers. The
  customer's pick keeps the base price (by load size, from the public pricing
  page). Every other window that's cheaper for us is offered with a share of
  the saving off (50%), rounded down to $5, at least $20 and at most 25% of
  the base price, and never below what that window costs us. Each offer comes
  with a message: "Would you like to move your pickup 2 hours earlier, to
  10:00-12:00, for $215 instead of $260?"
- `fleet_engine/stonegate.py`: the site's rows (`service_orders`, `orders`,
  `calendar_jobs`, as in Supabase) to jobs, the same rows the booking form's
  availability counts. Load size to volume; on-site time from volume with the
  chatbot's handling rate, never under 2 hours, unless an estimate is passed
  in (the chat's, or a better formula later).
  Returns warnings for guesses (unknown or street-only addresses, missing
  load sizes). `carried_over` plans the day before to see what's still on
  the truck in the morning.
- `fleet_engine/geocode.py`: addresses to coordinates with OpenStreetMap's
  free Nominatim, cached in `data/geocode-cache.json` (git-ignored: customer
  addresses). Set `NOMINATIM_USER_AGENT` to identify the app, e.g.
  `stonegate-fleet-engine/0.1 (you@example.com)`, as its usage policy asks.
- `fleet_engine/travel.py`: `StraightLineTravel` (great-circle × 1.3 at
  35 km/h) until a road router is chosen.
- `tenants/stonegate.json`: one truck (16 × 7.5 × 6.5 ft, out 06:00-23:00 so
  the 20:00 slot's job can finish and drive home), depot at Metrotown, the
  Metro Vancouver transfer stations, costs, and pricing.

Cost of a route = (driving + on-site minutes) × crew $/hour + km × $/km, where
$/km = fuel (L/100 km × $/L) + wear. Idle time waiting for a window is
reported but not costed (payroll doesn't pay it).

**Placeholders to replace with real numbers** in `tenants/stonegate.json`:
crew $60/h (from the chatbot), 18 L/100 km, $1.75/L, $0.20/km wear, and
25-30 min queue/weigh-in plus 1 min/yd³ unloading at every station. Dump
fees aren't costed (they're the same whichever window the job goes in). The
pricing numbers are a first guess at "relevant", not tuned.

## Run

```sh
cd engine
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/pytest
.venv/bin/python examples/demo_day.py        # fixed coordinates, no network
.venv/bin/python examples/quote_stonegate.py # sample rows -> geocoding -> quote
```

Against your Supabase data (read-only; the same tables and filters the
booking form's availability uses). Pass the keys just for the script, so local
`npm run dev` keeps writing bookings to files:

```sh
export NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="..."
.venv/bin/python examples/quote_stonegate.py --supabase            # days with orders
.venv/bin/python examples/quote_stonegate.py --supabase --date 2026-11-03 \
  --address "6138 Student Union Blvd, Vancouver" --load-size "1/4 Truck" --time 18:00
```

This reads Supabase directly only to test without the site; in normal use
the site sends the same rows with each quote request.

### Run the server

```sh
cd engine
.venv/bin/uvicorn server:app --port 8001
```

It reads the root `.env.local`, like the chat server. Settings (all optional):

| Where | Variable | Default |
|---|---|---|
| engine | `ENGINE_SERVER_SECRET` | none: no check (fine on localhost only) |
| engine | `NOMINATIM_USER_AGENT` | `stonegate-fleet-engine/0.1` |
| engine | `ENGINE_TENANT`, `GEOCODE_CACHE` | `tenants/stonegate.json`, `data/geocode-cache.json` |
| Next | `ENGINE_SERVER_URL` | `http://127.0.0.1:8001` |
| Next | `ENGINE_SERVER_SECRET` | same value as the engine's |
| Next | `QUOTE_SIGNING_SECRET` | required outside `npm run dev`, or no offers are made |

### In the booking form

Once the chat is done (so the load size is settled), `/book-service` asks
`/api/quote-options` for the cheapest other slot that day. If there is one,
the customer sees "Would you like to move your pickup 8 hours earlier, to
10:00am–12:00pm, for $225 instead of $260?" with Yes / No; no offer, an
error, or no answer within 8 s sends the request as picked. Each offer is
signed (`lib/offer-token.ts`, 30 minutes), and `/api/service-requests` only
honours one that matches the booking exactly, saving the price, the normal
price and the first-picked slot on the order (migration 015). Staff see it
in the email and as "Offer $225" on the admin junk removal list.

Locally without Supabase, offers are quoted against the junk removals the
form saved to `data/service-orders/`, so book a couple first to see one.

Try it with Next running (`npm run dev`):

```sh
curl -X POST localhost:3000/api/quote-options -H 'Content-Type: application/json' \
  -d '{"address":"6138 Student Union Blvd, Vancouver","date":"2026-11-03","time":"18:00","loadSize":"1/4 Truck"}'
```

Without Supabase configured, the site quotes against the junk removals saved
in `data/service-orders/` (see "In the booking form" above).

## Known limits (to revisit)

- Nominatim lacks many BC house numbers and then matches elsewhere on the
  street (flagged as approximate). A paid geocoder fixes this if it matters.
- Tomorrow's dump stop for an overnight load is priced as a round trip from
  the depot, which overstates it when the dump is on the way to the first job.
  Only one night back is looked at for a carried-in load.
- Dump choice is a heuristic (nearest stations, then each station for every
  load, then each visit moved to the best station between its neighbours): it
  can still miss an unusual combination.
- VROOM may split loads that are on board together across two dump visits;
  the cost is the same either way.
- A move needs the truck empty, using the biggest truck's capacity, so the
  fleet is assumed to be one truck type for now. A move's duration is split
  between loading and unloading, and the drive between is added on top.
- More than one truckload is rejected (the chat already sends those to manual
  review).
