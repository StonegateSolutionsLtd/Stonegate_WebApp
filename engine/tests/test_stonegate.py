from pathlib import Path

import pytest

from fleet_engine import Location, StraightLineTravel, Window, load_fleet, load_pricing
from fleet_engine.stonegate import booked_jobs, carried_over, pricing_tier, request_job

FLEET = load_fleet(Path(__file__).resolve().parent.parent / "tenants" / "stonegate.json")
FULL_TRUCK_YD3 = 16 * 7.5 * 6.5 / 27


class FakeGeocoder:
    def __init__(self, known: dict[str, tuple]):
        self.known = known

    def locate(self, address):
        point = self.known.get(address)
        return Location(point[0], point[1], address, *point[2:]) if point else None


GEO = FakeGeocoder({
    "1 Kits St": (49.268, -123.168),
    "2 Rich Rd": (49.167, -123.134),
    "3 From Ave": (49.25, -123.10),
    "4 To Ave": (49.28, -123.05),
    "No. 3 Rd": (49.110, -123.138, True),
})


def test_stonegate_config():
    assert len(FLEET.trucks) == 1
    assert FLEET.trucks[0].capacity_yd3 == pytest.approx(FULL_TRUCK_YD3)
    # The last slot starts by 20:00 and runs 2 hours; then the drive home.
    assert FLEET.trucks[0].shift == Window(6 * 60, 23 * 60)
    assert "Metrotown" in FLEET.depot.name
    # 18 L/100 km at $1.75/L, plus $0.20/km wear.
    assert FLEET.costs.truck_per_km == pytest.approx(0.515)
    assert len(FLEET.dump_stations) >= 2


def test_rows_become_jobs():
    rows = {
        "service_orders": [
            {"id": "s1", "order_number": 101, "address": "1 Kits St", "service_time": "10:00:00",
             "load_size": "1/2 Truck", "status": "pending"},
            {"id": "s2", "order_number": 102, "address": "2 Rich Rd", "service_time": "12:00",
             "load_size": "1/4 Truck", "status": "cancelled"},
        ],
        "orders": [
            {"id": "o1", "order_number": 200, "pickup_address": "3 From Ave", "dropoff_address": "4 To Ave",
             "moving_time": "08:00:00", "duration_minutes": 240, "status": "confirmed"},
        ],
        "calendar_jobs": [
            # Same job as service order s1: not counted twice.
            {"id": "c1", "job_type": "junk_removal", "service_order_id": "s1", "event_time": "10:00:00",
             "pickup_address": "1 Kits St"},
            {"id": "c2", "job_type": "moving", "customer_name": "Smith", "event_time": None,
             "pickup_address": "3 From Ave", "duration_minutes": None},
        ],
    }
    day = booked_jobs(FLEET, rows, GEO)
    by_id = {j.id: j for j in day.jobs}

    assert set(by_id) == {"J101", "M200", "CSmith"}
    junk = by_id["J101"]
    assert junk.window == Window(10 * 60, 12 * 60)
    assert junk.volume_yd3 == pytest.approx(FULL_TRUCK_YD3 / 2)
    assert junk.service_min == pytest.approx(FULL_TRUCK_YD3 / 2 * 9)

    move = by_id["M200"]
    assert move.is_move and move.dropoff.name == "4 To Ave"
    assert move.service_min + move.dropoff_service_min == 240

    # Untimed calendar job: blocks from opening, like the booking form assumes.
    untimed = by_id["CSmith"]
    assert untimed.window == Window(6 * 60, 6 * 60)
    assert untimed.service_min == 360
    assert day.warnings == []


def test_unknown_address_is_assumed_at_the_depot_with_a_warning():
    rows = {"service_orders": [{"id": "s1", "order_number": 7, "address": "nowhere", "service_time": "10:00",
                                "load_size": "1/8 Truck", "status": "pending"}]}
    day = booked_jobs(FLEET, rows, GEO)
    assert day.jobs[0].location.lat == FLEET.depot.lat
    assert "J7" in day.warnings[0]


def test_street_only_match_is_kept_with_a_warning():
    rows = {"service_orders": [{"id": "s1", "order_number": 8, "address": "No. 3 Rd", "service_time": "10:00",
                                "load_size": "1/8 Truck", "status": "pending"}]}
    day = booked_jobs(FLEET, rows, GEO)
    assert day.jobs[0].location.lat == 49.110
    assert "J8" in day.warnings[0] and "street" in day.warnings[0]


def test_evening_job_the_day_before_is_still_on_the_truck():
    previous = {"service_orders": [{"id": "s0", "order_number": 99, "address": "1 Kits St", "service_time": "20:00",
                                    "load_size": "1/4 Truck", "status": "confirmed"}]}
    assert carried_over(FLEET, previous, GEO, StraightLineTravel()) == pytest.approx(FULL_TRUCK_YD3 / 4)
    assert carried_over(FLEET, {}, GEO, StraightLineTravel()) == 0


def test_stonegate_pricing_matches_the_pricing_page():
    policy, base_prices = load_pricing(Path(__file__).resolve().parent.parent / "tenants" / "stonegate.json")
    assert base_prices == {"1/8 Truck": 145, "1/4 Truck": 260, "1/2 Truck": 405, "3/4 Truck": 555, "Full Truck": 700}
    assert 0 < policy.share_of_savings <= 1


def test_volume_rounds_up_to_a_pricing_tier():
    assert pricing_tier(FLEET, FULL_TRUCK_YD3 / 4) == "1/4 Truck"
    assert pricing_tier(FLEET, FULL_TRUCK_YD3 / 4 + 0.5) == "1/2 Truck"
    assert pricing_tier(FLEET, FULL_TRUCK_YD3 * 2) == "Full Truck"


def test_removal_takes_at_least_two_hours_on_site():
    assert request_job(FLEET, GEO, "1 Kits St", load_size="1/8 Truck").service_min == 120


def test_request_uses_the_chat_estimates_when_given():
    from_load_size = request_job(FLEET, GEO, "1 Kits St", load_size="1/4 Truck")
    assert from_load_size.volume_yd3 == pytest.approx(FULL_TRUCK_YD3 / 4)

    from_chat = request_job(FLEET, GEO, "1 Kits St", load_size="1/4 Truck", volume_yd3=6, on_site_min=50)
    assert (from_chat.volume_yd3, from_chat.service_min) == (6, 50)

    with pytest.raises(ValueError, match="locate"):
        request_job(FLEET, GEO, "nowhere", load_size="1/4 Truck")
