"""Plans one day's routes with VROOM (https://github.com/VROOM-Project/vroom).

Every junk job is a VROOM shipment: picked up at the customer, delivered to a
dump station, with the truck's volume as the capacity. VROOM has no "go and
unload mid-route" step, but shipments give us that for free: once the truck
would overflow, the solver has to fit a dump visit in, and it can pick up
another job on the way to or from the dump when that's cheaper.

A shipment's delivery has one fixed place, so VROOM can't pick the dump
station itself. We start each load at the station nearest its pickup, then
move every dump visit to the station that's cheapest between the stops
either side of it (e.g. the one on the way home to the depot) and re-plan,
for as long as that makes the day cheaper.

Dumps keep opening hours, so a late load can instead ride home overnight and
be dumped the next morning on the way to work: it becomes a plain VROOM job
whose pickup stays on board until the route ends. We try keeping the latest
loads on board and keep that if the day (with tomorrow's dump stop) is
cheaper. A load carried in from yesterday is a VROOM delivery, on board from
the start and tipped at a dump.

A move is a shipment of the whole truck from pickup to dropoff, so junk on
board is always dumped before the move starts."""

from dataclasses import dataclass, replace

import vroom

from .model import Fleet, Job, Location, hhmm
from .travel import TravelProvider

# VROOM: higher priority = more important. Booked jobs must never be dropped to
# make room for a new request; a request that doesn't fit is left unassigned.
COMMITTED_PRIORITY = 100
# VROOM amounts are integers: tenths of a cubic yard.
UNITS_PER_YD3 = 10
EXPLORATION_LEVEL = 5
THREADS = 4
# Re-plans after moving dump visits to better stations; one or two is usually enough.
DUMP_PASSES = 3
# In place of a dump station: the load stays on the truck overnight.
OVERNIGHT = -1
# Job id shown for a load on board since yesterday.
CARRIED_OVER = "carried over"


@dataclass(frozen=True)
class Stop:
    kind: str  # "start", "pickup", "dump", "dropoff" or "end"
    # A dump visit can tip several loads at once.
    job_ids: tuple[str, ...]
    location: Location
    arrival_min: float
    # Arrival plus any wait for the job's window (or the dump's gate) to open.
    start_min: float
    # Time spent here; at a dump, setup (once per visit) plus unloading.
    service_min: float
    # On board after this stop.
    load_yd3: float


@dataclass(frozen=True)
class Route:
    truck_id: str
    stops: list[Stop]
    drive_min: float
    on_site_min: float
    # Waiting for a job's window to open. Payroll doesn't pay it, but the
    # truck can't be used elsewhere either; pricing decides what it's worth.
    idle_min: float
    drive_km: float
    # On board when the truck parks for the night.
    overnight_yd3: float
    # Estimate of tomorrow's dump stop for that load; part of `cost`.
    morning_dump_cost: float
    cost: float

    @property
    def paid_min(self) -> float:
        return self.drive_min + self.on_site_min

    @property
    def dump_visits(self) -> int:
        """Including tomorrow morning's, for a load kept overnight."""
        return sum(1 for s in self.stops if s.kind == "dump") + (1 if self.overnight_yd3 > 0 else 0)


@dataclass(frozen=True)
class DayPlan:
    routes: list[Route]
    # Jobs that didn't fit anywhere.
    unassigned: list[str]

    @property
    def cost(self) -> float:
        return sum(r.cost for r in self.routes)

    @property
    def paid_min(self) -> float:
        return sum(r.paid_min for r in self.routes)

    @property
    def drive_km(self) -> float:
        return sum(r.drive_km for r in self.routes)

    @property
    def dump_visits(self) -> int:
        return sum(r.dump_visits for r in self.routes)

    @property
    def overnight_yd3(self) -> float:
        return sum(r.overnight_yd3 for r in self.routes)

    def describe(self) -> str:
        lines = []
        for r in self.routes:
            lines.append(
                f"Truck {r.truck_id}: ${r.cost:.2f}, {r.paid_min:.0f} min paid "
                f"({r.drive_min:.0f} driving, {r.on_site_min:.0f} on site), "
                f"{r.idle_min:.0f} min idle, {r.drive_km:.1f} km, {r.dump_visits} dump visit(s)"
            )
            for s in r.stops:
                jobs = f" [{', '.join(s.job_ids)}]" if s.job_ids else ""
                waited = f", arrived {hhmm(s.arrival_min)}" if s.start_min > s.arrival_min else ""
                lines.append(
                    f"  {hhmm(s.start_min)}  {s.kind:<8}{jobs} {s.location.name}"
                    f"  ({s.service_min:.0f} min, {s.load_yd3:.1f} yd³ on board{waited})"
                )
            if r.overnight_yd3 > 0:
                lines.append(f"  Parks with {r.overnight_yd3:.1f} yd³ on board; "
                             f"dumping it tomorrow morning ≈ ${r.morning_dump_cost:.2f} (included)")
        if self.unassigned:
            lines.append(f"Unassigned: {', '.join(self.unassigned)}")
        return "\n".join(lines)


@dataclass(frozen=True)
class _DumpVisit:
    # Matrix indices of the stops either side of the visit.
    before: int
    after: int
    # Positions in the dump choice list (a job, or the carried-over load).
    loads: tuple[int, ...]


def plan_day(
    fleet: Fleet,
    jobs: list[Job],
    travel: TravelProvider,
    optional_ids: frozenset[str] = frozenset(),
    carry_in_yd3: float = 0,
) -> DayPlan:
    """Cheapest routes doing every job, by the fleet's costs. Jobs in
    `optional_ids` (a request being quoted) are dropped rather than any other
    job when not everything fits. `carry_in_yd3` is junk still on the truck
    from yesterday, to be dumped today."""
    if not jobs and not carry_in_yd3:
        return DayPlan(routes=[], unassigned=[])

    problem = _Problem(fleet, jobs, travel, optional_ids, carry_in_yd3)
    best = problem.improve(problem.nearest_dumps())
    # Every load to one station: catches tight days (closing time, one station
    # on the way to the next job) that starting from the nearest ones misses.
    for station in problem.dump_index:
        candidate = problem.improve(problem.same_dump(station))
        if _rank(candidate) < _rank(best):
            best = candidate
    # Keep the latest loads on board overnight: those starting at or after
    # each booked start time in turn, latest first.
    junk = [n for n, job in enumerate(jobs) if not job.is_move and job.window]
    for start in sorted({jobs[n].window.start for n in junk}, reverse=True):
        dumps = problem.nearest_dumps()
        for n in junk:
            if jobs[n].window.start >= start:
                dumps[n] = OVERNIGHT
        candidate = problem.improve(dumps)
        if _rank(candidate) < _rank(best):
            best = candidate
    return best


def _rank(plan: DayPlan) -> tuple[int, float]:
    return len(plan.unassigned), plan.cost


def _clean(load_yd3: float) -> float:
    """Float leftovers from adding and removing loads, e.g. -1e-15 for empty."""
    return 0.0 if abs(load_yd3) < 1e-6 else load_yd3


class _Problem:
    """The day's matrices, built once and solved for several dump choices."""

    def __init__(self, fleet: Fleet, jobs: list[Job], travel: TravelProvider, optional_ids: frozenset[str],
                 carry_in_yd3: float):
        self.fleet, self.jobs, self.optional_ids = fleet, jobs, optional_ids
        self.capacity_units = max(round(t.capacity_yd3 * UNITS_PER_YD3) for t in fleet.trucks)
        for job in jobs:
            if not job.is_move and round(job.volume_yd3 * UNITS_PER_YD3) > self.capacity_units:
                raise ValueError(f"job {job.id} is more than one truckload: needs manual review")
        self.carry_in_yd3 = carry_in_yd3
        # The carried-over load's position in the dump choice list and its VROOM id.
        self.carry_id = len(jobs)

        # Matrix indices: depot, then dump stations, then each job's pickup (and dropoff).
        self.locations = [fleet.depot] + [d.location for d in fleet.dump_stations]
        self.dump_index = {1 + i: d for i, d in enumerate(fleet.dump_stations)}
        self.pickup_index, self.dropoff_index = [], []
        for job in jobs:
            self.pickup_index.append(len(self.locations))
            self.locations.append(job.location)
            if job.dropoff:
                self.dropoff_index.append(len(self.locations))
                self.locations.append(job.dropoff)
            else:
                self.dropoff_index.append(None)

        self.durations, self.distances = travel.matrices(self.locations)
        # The dump's setup goes into the travel time *into* it (pyvroom can't cost
        # task time), so the solver sees it. Consecutive drops at the same dump have
        # zero travel between them, so it's paid once per visit, as in real life.
        for d, station in self.dump_index.items():
            for i in range(len(self.locations)):
                if i != d:
                    self.durations[i][d] += round(station.setup_min * 60)

    def edge_cost(self, i: int, j: int) -> float:
        costs = self.fleet.costs
        return self.durations[i][j] / 3600 * costs.crew_per_hour + self.distances[i][j] / 1000 * costs.truck_per_km

    def nearest_dumps(self) -> list[int | None]:
        """One entry per job (None for moves), then one for the carried-over load."""
        dumps = [
            None if job.is_move else min(self.dump_index, key=lambda d: self.edge_cost(self.pickup_index[n], d))
            for n, job in enumerate(self.jobs)
        ]
        dumps.append(min(self.dump_index, key=lambda d: self.edge_cost(0, d)) if self.carry_in_yd3 else None)
        return dumps

    def same_dump(self, station: int) -> list[int | None]:
        return [None if d is None else station for d in self.nearest_dumps()]

    def best_dump_between(self, before: int, after: int) -> int:
        return min(self.dump_index, key=lambda d: self.edge_cost(before, d) + self.edge_cost(d, after))

    def improve(self, dumps: list[int | None]) -> DayPlan:
        plan, visits = self.solve(dumps)
        for _ in range(DUMP_PASSES):
            better = list(dumps)
            for visit in visits:
                station = self.best_dump_between(visit.before, visit.after)
                for n in visit.loads:
                    better[n] = station
            if better == dumps:
                break
            candidate, candidate_visits = self.solve(better)
            if _rank(candidate) >= _rank(plan):
                break
            plan, visits, dumps = candidate, candidate_visits, better
        return plan

    def dump_windows(self, d: int) -> list:
        """The gate's hours, shifted by the setup folded into the travel time."""
        station = self.dump_index[d]
        if not station.hours:
            return []
        setup_s = round(station.setup_min * 60)
        return [vroom.TimeWindow(station.hours.start * 60 + setup_s, station.hours.end * 60 + setup_s)]

    def morning_dump_cost(self, volume_yd3: float) -> float:
        """Tomorrow's stop for a load kept overnight. Where tomorrow starts
        isn't known yet, so it's priced as a round trip from the depot; on the
        way to the first job it's usually less."""
        d = min(self.dump_index, key=lambda d: self.edge_cost(0, d) + self.edge_cost(d, 0))
        unload_min = volume_yd3 * self.dump_index[d].unload_min_per_yd3
        return self.edge_cost(0, d) + self.edge_cost(d, 0) + unload_min / 60 * self.fleet.costs.crew_per_hour

    def solve(self, dumps: list[int | None]) -> tuple[DayPlan, list[_DumpVisit]]:
        """`dumps[n]`: the matrix index of the station job n's load goes to, or OVERNIGHT."""
        fleet = self.fleet
        problem = vroom.Input()
        problem.set_durations_matrix(profile="car", matrix_input=self.durations)
        problem.set_distances_matrix(profile="car", matrix_input=self.distances)
        for n, truck in enumerate(fleet.trucks):
            problem.add_vehicle(vroom.Vehicle(
                n + 1,
                start=0,
                end=0,
                capacity=[round(truck.capacity_yd3 * UNITS_PER_YD3)],
                time_window=vroom.TimeWindow(truck.shift.start * 60, truck.shift.end * 60),
                # In cents: VROOM costs are integers.
                costs=vroom.VehicleCosts(
                    per_hour=round(fleet.costs.crew_per_hour * 100),
                    per_km=round(fleet.costs.truck_per_km * 100),
                ),
            ))

        for n, job in enumerate(self.jobs):
            windows = [vroom.TimeWindow(job.window.start * 60, job.window.end * 60)] if job.window else []
            priority = 0 if job.id in self.optional_ids else COMMITTED_PRIORITY
            service_s = round(job.service_min * 60)
            if dumps[n] == OVERNIGHT:
                # A pickup-only job: VROOM keeps it on board until the route ends.
                problem.add_job(vroom.Job(n, location=self.pickup_index[n], default_service=service_s,
                                          pickup=[round(job.volume_yd3 * UNITS_PER_YD3)],
                                          time_windows=windows, priority=priority))
                continue
            if job.is_move:
                d, amount, unload_min, drop_windows = (self.dropoff_index[n], self.capacity_units,
                                                       job.dropoff_service_min, [])
            else:
                d = dumps[n]
                amount = round(job.volume_yd3 * UNITS_PER_YD3)
                unload_min = job.volume_yd3 * self.dump_index[d].unload_min_per_yd3
                drop_windows = self.dump_windows(d)
            problem.add_job(vroom.Shipment(
                pickup=vroom.ShipmentStep(n, location=self.pickup_index[n], default_service=service_s,
                                          time_windows=windows),
                delivery=vroom.ShipmentStep(n, location=d, default_service=round(unload_min * 60),
                                            time_windows=drop_windows),
                amount=[amount],
                priority=priority,
            ))

        if self.carry_in_yd3:
            # A delivery-only job: VROOM has it on board from the start.
            d = dumps[self.carry_id]
            problem.add_job(vroom.Job(
                self.carry_id, location=d,
                default_service=round(self.carry_in_yd3 * self.dump_index[d].unload_min_per_yd3 * 60),
                delivery=[round(self.carry_in_yd3 * UNITS_PER_YD3)],
                time_windows=self.dump_windows(d), priority=COMMITTED_PRIORITY,
            ))

        solution = problem.solve(exploration_level=EXPLORATION_LEVEL, nb_threads=THREADS)

        routes, visits = [], []
        assigned: set[int] = set()
        for vehicle_id, rows in solution.routes.groupby("vehicle_id", sort=True):
            truck = fleet.trucks[int(vehicle_id) - 1]
            routes.append(self._route(truck.id, rows, assigned))
            visits += self._dump_visits(rows)

        unassigned = [job.id for n, job in enumerate(self.jobs) if n not in assigned]
        if self.carry_in_yd3 and self.carry_id not in assigned:
            unassigned.append(CARRIED_OVER)
        return DayPlan(routes=routes, unassigned=unassigned), visits

    def _is_dump_drop(self, kind: str, loc: int) -> bool:
        # Deliveries at a dump, and the carried-over load (a plain job at a dump).
        return kind in ("delivery", "job") and loc in self.dump_index

    def _dump_visits(self, rows) -> list[_DumpVisit]:
        steps = [(int(r.location_index), r.type, None if r.type in ("start", "end") else int(r.id))
                 for r in rows.itertuples()]
        visits = []
        i = 0
        while i < len(steps):
            loc, kind, _ = steps[i]
            if not self._is_dump_drop(kind, loc):
                i += 1
                continue
            j = i
            while j < len(steps) and self._is_dump_drop(steps[j][1], steps[j][0]) and steps[j][0] == loc:
                j += 1
            visits.append(_DumpVisit(before=steps[i - 1][0], after=steps[j][0],
                                     loads=tuple(s[2] for s in steps[i:j])))
            i = j
        return visits

    def _route(self, truck_id, rows, assigned) -> Route:
        jobs, locations, dump_index = self.jobs, self.locations, self.dump_index
        stops: list[Stop] = []
        # VROOM puts the carried-over load on the first truck's route.
        load = 0.0
        if self.carry_in_yd3 and (rows.type.eq("job") & rows.id.eq(self.carry_id)).any():
            load = self.carry_in_yd3
        folded_setup_s = 0
        on_site_s = 0
        prev_location = None
        for row in rows.itertuples():
            loc = int(row.location_index)
            arrival_s, service_s = int(row.arrival), int(row.service)
            start_s = arrival_s + int(row.waiting_time)
            if row.type in ("start", "end"):
                stops.append(Stop(row.type, (), locations[loc], arrival_s / 60, start_s / 60, 0, load))
            elif self._is_dump_drop(row.type, loc):
                n = int(row.id)
                assigned.add(n)
                if n == self.carry_id:
                    label, volume = CARRIED_OVER, self.carry_in_yd3
                else:
                    label, volume = jobs[n].id, jobs[n].volume_yd3
                load = _clean(load - volume)
                if loc == prev_location and stops[-1].kind == "dump":
                    # Same visit as the drop before: no queue again, just unloading.
                    last = stops[-1]
                    stops[-1] = replace(last, job_ids=last.job_ids + (label,),
                                        service_min=last.service_min + service_s / 60, load_yd3=load)
                else:
                    # VROOM's arrival is after the setup folded into the travel time.
                    setup_s = round(dump_index[loc].setup_min * 60)
                    folded_setup_s += setup_s
                    stops.append(Stop("dump", (label,), locations[loc], (arrival_s - setup_s) / 60,
                                      (start_s - setup_s) / 60, (setup_s + service_s) / 60, load))
            elif row.type in ("pickup", "job"):
                job = jobs[int(row.id)]
                assigned.add(int(row.id))
                load += job.volume_yd3
                stops.append(Stop("pickup", (job.id,), locations[loc], arrival_s / 60, start_s / 60,
                                  service_s / 60, load))
            else:  # a move's dropoff
                stops.append(Stop("dropoff", (jobs[int(row.id)].id,), locations[loc], arrival_s / 60,
                                  start_s / 60, service_s / 60, load))
            on_site_s += service_s
            prev_location = loc

        last = rows.iloc[-1]
        drive_min = (int(last.duration) - folded_setup_s) / 60
        on_site_min = (on_site_s + folded_setup_s) / 60
        drive_km = int(last.distance) / 1000
        overnight = load
        morning = self.morning_dump_cost(overnight) if overnight > 0 else 0.0
        costs = self.fleet.costs
        cost = (drive_min + on_site_min) / 60 * costs.crew_per_hour + drive_km * costs.truck_per_km + morning
        return Route(
            truck_id=truck_id,
            stops=stops,
            drive_min=drive_min,
            on_site_min=on_site_min,
            idle_min=int(rows.waiting_time.sum()) / 60,
            drive_km=drive_km,
            overnight_yd3=overnight,
            morning_dump_cost=round(morning, 2),
            cost=round(cost, 2),
        )
