"""Quoting engine server.

The Next app (app/api/quote-options) posts one day's orders (and the day
before's), plus the junk request and the slot the customer picked; this
returns what each slot costs us and the cheaper slots to offer. The engine
never reads the database itself: the caller sends the fleet state.

Run:  uvicorn server:app --port 8001   (from this directory)
"""

import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from fleet_engine import NominatimGeocoder, StraightLineTravel, load_fleet, load_pricing
from fleet_engine.geocode import GeocodingUnavailable
from fleet_engine.model import hhmm
from fleet_engine.stonegate import TRUCK_FRACTIONS, quote_request

ENGINE = Path(__file__).parent
# Shares the Next app's .env.local, like the chat server.
load_dotenv(ENGINE.parent / ".env.local")
load_dotenv(ENGINE / ".env")

TENANT = Path(os.getenv("ENGINE_TENANT", ENGINE / "tenants" / "stonegate.json"))
FLEET = load_fleet(TENANT)
POLICY, BASE_PRICES = load_pricing(TENANT)
GEOCODER = NominatimGeocoder(os.getenv("GEOCODE_CACHE", ENGINE / "data" / "geocode-cache.json"))
TRAVEL = StraightLineTravel()

app = FastAPI(title="Stonegate quoting engine")

# Set once this server is reachable over the internet, so only the Next.js
# app (which sends the same value) can call it.
SERVER_SECRET = os.getenv("ENGINE_SERVER_SECRET")


@app.middleware("http")
async def require_secret(request, call_next):
    if SERVER_SECRET and request.url.path != "/health" and request.headers.get("X-Engine-Secret") != SERVER_SECRET:
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})
    return await call_next(request)


class DayRows(BaseModel):
    """Rows as the Supabase tables have them; see fleet_engine/stonegate.py."""
    service_orders: list[dict] = Field(default_factory=list, max_length=200)
    orders: list[dict] = Field(default_factory=list, max_length=200)
    calendar_jobs: list[dict] = Field(default_factory=list, max_length=200)


class QuoteRequest(BaseModel):
    rows: DayRows
    previousDayRows: DayRows = Field(default_factory=DayRows)
    address: str = Field(min_length=3, max_length=300)
    # The start of the slot the customer picked.
    preferredTime: str = Field(pattern=r"^\d{2}:\d{2}$")
    loadSize: Literal[tuple(TRUCK_FRACTIONS)] | None = None
    # The chat's estimates, when it has them.
    volumeYd3: float | None = Field(default=None, gt=0)
    onSiteMin: float | None = Field(default=None, gt=0, le=720)


@app.get("/health")
def health():
    return {"ok": True}


# Plain def: FastAPI runs it in a worker thread, so a slow geocoding lookup
# or solve doesn't block other requests.
@app.post("/quote")
def quote(body: QuoteRequest):
    if body.loadSize is None and body.volumeYd3 is None:
        raise HTTPException(status_code=422, detail="loadSize or volumeYd3 is needed")
    try:
        run = quote_request(
            FLEET, POLICY, BASE_PRICES, GEOCODER, TRAVEL,
            body.rows.model_dump(), body.previousDayRows.model_dump(),
            body.address, body.preferredTime,
            load_size=body.loadSize, volume_yd3=body.volumeYd3, on_site_min=body.onSiteMin,
        )
    except GeocodingUnavailable as err:
        raise HTTPException(status_code=503, detail=f"Geocoder unavailable: {err}")
    except ValueError as err:
        # The request's address can't be found, or it's more than a truckload.
        raise HTTPException(status_code=422, detail=str(err))

    q = run.quote
    return {
        "tier": run.tier,
        "basePrice": q.base_price,
        "pickedFits": q.picked_fits,
        "pickedCost": q.picked_cost,
        "carryInYd3": round(run.carry_in_yd3, 1),
        "warnings": run.warnings,
        # Cheapest first. ourSaving and margin are for staff, not the customer.
        "offers": [
            {
                "start": hhmm(o.window.start), "end": hhmm(o.window.end), "price": o.price,
                "discount": o.discount, "message": o.message, "ourSaving": o.our_saving, "margin": o.margin,
            }
            for o in q.offers
        ],
        "slots": [
            {"start": hhmm(o.window.start), "end": hhmm(o.window.end), "fits": o.feasible, "extraCost": o.extra_cost}
            for o in run.result.options
        ],
    }
