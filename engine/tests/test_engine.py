import math

import pytest

from fleet_engine import (
    Costs, DumpStation, Fleet, Job, Location, Truck, Window, evaluate_windows, plan_day,
)


class GridTravel:
    """Locations on a flat km grid (lng = x, lat = y), 60 km/h: 1 km = 1 min."""

    def matrices(self, locations):
        km = [[math.dist((a.lng, a.lat), (b.lng, b.lat)) for b in locations] for a in locations]
        return [[round(d * 60) for d in row] for row in km], [[round(d * 1000) for d in row] for row in km]


def at(x, y, name=""):
    return Location(lat=y, lng=x, name=name)


def h(hours):
    return round(hours * 60)


TRAVEL = GridTravel()
DEPOT = at(0, 0, "depot")
DUMP = at(0, 10, "dump")


def fleet(trucks=1, capacity=20, dump_hours=None):
    return Fleet(
        depot=DEPOT,
        trucks=[Truck(f"T{n + 1}", capacity, Window(h(6), h(22))) for n in range(trucks)],
        dump_stations=[DumpStation(DUMP, setup_min=20, unload_min_per_yd3=1, hours=dump_hours)],
        costs=Costs(crew_per_hour=60, truck_per_km=1),
    )


DAYTIME = Window(h(6), h(17))


def junk(id, x, y, volume=5, service=30, window=None):
    return Job(id, at(x, y, id), service_min=service, window=window, volume_yd3=volume)


def test_single_job_goes_to_the_dump_and_back():
    plan = plan_day(fleet(), [junk("A", 10, 0, volume=5)], TRAVEL)

    assert [s.kind for s in plan.routes[0].stops] == ["start", "pickup", "dump", "end"]
    # depot -> A 10 km, A -> dump ~14.1 km, dump -> depot 10 km.
    assert plan.drive_km == pytest.approx(10 + math.hypot(10, 10) + 10, abs=0.01)
    # 30 on site + 20 dump setup + 5 unloading.
    assert plan.routes[0].on_site_min == pytest.approx(55)
    assert plan.cost == pytest.approx((plan.paid_min / 60) * 60 + plan.drive_km, abs=0.02)


def test_small_loads_share_one_dump_visit():
    plan = plan_day(fleet(), [junk("A", 5, 0, volume=5), junk("B", 5, 2, volume=5)], TRAVEL)
    assert plan.dump_visits == 1
    dump = next(s for s in plan.routes[0].stops if s.kind == "dump")
    assert set(dump.job_ids) == {"A", "B"}
    # Setup once, unloading for both.
    assert dump.service_min == pytest.approx(20 + 10)


def test_dump_on_the_way_home_beats_the_one_nearest_the_job():
    near_job = DumpStation(at(10, 4, "near job"), setup_min=20, unload_min_per_yd3=1)
    near_depot = DumpStation(at(3, 0, "near depot"), setup_min=20, unload_min_per_yd3=1)
    two_dumps = Fleet(DEPOT, fleet().trucks, [near_job, near_depot], fleet().costs)

    plan = plan_day(two_dumps, [junk("A", 10, 0)], TRAVEL)

    dump = next(s for s in plan.routes[0].stops if s.kind == "dump")
    assert dump.location.name == "near depot"
    # depot -> A 10, A -> dump 7, dump -> depot 3 (vs. 10 + 4 + 10.8 via the other one).
    assert plan.drive_km == pytest.approx(20, abs=0.01)


def test_full_truck_goes_to_the_dump_before_the_next_job():
    plan = plan_day(fleet(capacity=20), [junk("A", 5, 0, volume=15), junk("B", 5, 2, volume=15)], TRAVEL)
    kinds = [s.kind for s in plan.routes[0].stops]
    assert kinds == ["start", "pickup", "dump", "pickup", "dump", "end"]
    assert max(s.load_yd3 for s in plan.routes[0].stops) <= 20


def test_job_on_the_way_to_the_dump_is_nearly_free():
    booked = [junk("A", 0, 3, window=Window(h(10), h(12)))]
    # Right on the depot -> dump road.
    on_the_way = junk("R", 0.5, 7)
    off_route = junk("R", 15, -10)

    near = evaluate_windows(fleet(), booked, on_the_way, TRAVEL, [Window(h(10), h(12))]).options[0]
    far = evaluate_windows(fleet(), booked, off_route, TRAVEL, [Window(h(10), h(12))]).options[0]

    assert near.feasible and far.feasible
    assert near.extra_dump_visits == 0
    assert near.extra_km < 2
    assert near.extra_cost < far.extra_cost


def test_window_that_forces_back_and_forth_costs_more():
    # A in the west in the morning, C in the east in the afternoon; the request is next to C.
    booked = [
        junk("A", -20, 0, window=Window(h(8), h(10))),
        junk("C", 20, 0, window=Window(h(14), h(16))),
    ]
    request = junk("R", 21, 1)
    result = evaluate_windows(fleet(), booked, request, TRAVEL)
    by_window = {o.window.start: o for o in result.options}

    # 6-8: east for R, back west for A, east again for C.
    before_a = by_window[h(6)]
    # 14-16 / 16-18: done right next to C.
    next_to_c = by_window[h(16)]
    assert before_a.feasible and next_to_c.feasible
    assert next_to_c.extra_km < 5
    assert before_a.extra_cost > next_to_c.extra_cost + 20
    assert result.cheapest().extra_cost == pytest.approx(next_to_c.extra_cost, abs=1)


def test_booked_jobs_are_never_dropped_for_the_request():
    # A starts exactly at 10:00 and takes 4 hours: the truck is busy until 14:00.
    booked = [junk("A", 5, 0, service=240, window=Window(h(10), h(10)))]
    request = junk("R", 5, 1, service=60)
    result = evaluate_windows(fleet(), booked, request, TRAVEL, [Window(h(10), h(12)), Window(h(14), h(16))])

    clash, after = result.options
    assert not clash.feasible
    assert after.feasible
    assert after.plan.unassigned == []


def test_second_truck_takes_a_clashing_request():
    booked = [junk("A", 5, 0, service=240, window=Window(h(10), h(10)))]
    request = junk("R", 5, 1, service=60)
    option = evaluate_windows(fleet(trucks=2), booked, request, TRAVEL, [Window(h(10), h(12))]).options[0]
    assert option.feasible
    assert len(option.plan.routes) == 2


def test_junk_is_dumped_before_a_move():
    move = Job("M", at(10, 0, "move from"), service_min=120, window=Window(h(12), h(12)),
               dropoff=at(20, 0, "move to"), dropoff_service_min=90)
    plan = plan_day(fleet(), [junk("A", 5, 0, window=Window(h(8), h(10))), move], TRAVEL)
    stops = [(s.kind, s.job_ids) for s in plan.routes[0].stops]
    assert stops == [
        ("start", ()), ("pickup", ("A",)), ("dump", ("A",)), ("pickup", ("M",)), ("dropoff", ("M",)), ("end", ()),
    ]


def test_load_after_the_dump_closes_rides_home_overnight():
    plan = plan_day(fleet(dump_hours=DAYTIME), [junk("A", 10, 0, volume=5, window=Window(h(18), h(20)))], TRAVEL)

    route = plan.routes[0]
    assert plan.unassigned == []
    assert [s.kind for s in route.stops] == ["start", "pickup", "end"]
    assert route.overnight_yd3 == pytest.approx(5)
    # Tomorrow: depot -> dump -> depot (20 km, 20 min) + 20 min setup + 5 min unloading.
    assert route.morning_dump_cost == pytest.approx((20 + 20 + 5) / 60 * 60 + 20, abs=0.05)
    assert route.dump_visits == 1


def test_load_before_closing_is_dumped_the_same_day():
    plan = plan_day(fleet(dump_hours=DAYTIME), [junk("A", 10, 0, window=Window(h(10), h(12)))], TRAVEL)
    route = plan.routes[0]
    assert route.overnight_yd3 == 0
    dump = next(s for s in route.stops if s.kind == "dump")
    assert h(6) <= dump.start_min <= h(17)


def test_small_loads_share_tomorrows_dump_visit():
    # One visit tomorrow beats one today plus one tomorrow.
    jobs = [junk("A", 10, 0, window=Window(h(8), h(10))), junk("B", 12, 0, window=Window(h(20), h(22)))]
    plan = plan_day(fleet(dump_hours=DAYTIME), jobs, TRAVEL)
    assert plan.unassigned == []
    assert plan.routes[0].overnight_yd3 == pytest.approx(10)
    assert plan.dump_visits == 1


def test_morning_load_dumped_today_when_both_dont_fit_overnight():
    jobs = [junk("A", 10, 0, volume=15, window=Window(h(8), h(10))),
            junk("B", 12, 0, volume=10, window=Window(h(20), h(22)))]
    plan = plan_day(fleet(capacity=20, dump_hours=DAYTIME), jobs, TRAVEL)
    route = plan.routes[0]
    assert plan.unassigned == []
    dump = next(s for s in route.stops if s.kind == "dump")
    assert dump.job_ids == ("A",)
    assert dump.start_min <= h(17)
    assert route.overnight_yd3 == pytest.approx(10)


def test_yesterdays_load_is_dumped_before_the_truck_fills_up():
    jobs = [junk("A", 10, 0, volume=10, window=Window(h(10), h(12)))]
    plan = plan_day(fleet(capacity=20, dump_hours=DAYTIME), jobs, TRAVEL, carry_in_yd3=15)

    stops = plan.routes[0].stops
    assert plan.unassigned == []
    assert stops[0].load_yd3 == 15
    assert stops[1].kind == "dump" and stops[1].job_ids == ("carried over",)
    assert stops[2].job_ids == ("A",)
    assert max(s.load_yd3 for s in stops) <= 20


def test_evening_slot_fits_overnight_but_costs_tomorrows_dump_run():
    result = evaluate_windows(fleet(dump_hours=DAYTIME), [], junk("R", 10, 0), TRAVEL,
                              [Window(h(10), h(12)), Window(h(20), h(22))])
    day, evening = result.options
    assert day.feasible and evening.feasible
    assert evening.plan.overnight_yd3 > 0
    assert evening.extra_cost > day.extra_cost


def test_more_than_a_truckload_needs_manual_review():
    with pytest.raises(ValueError, match="manual review"):
        plan_day(fleet(capacity=20), [junk("A", 5, 0, volume=25)], TRAVEL)


def test_empty_day():
    plan = plan_day(fleet(), [], TRAVEL)
    assert plan.routes == [] and plan.cost == 0
