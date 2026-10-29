"""Can a new request be squeezed into the day, and what does each arrival
window cost us? For every candidate window the whole day is re-planned with
the request pinned to that window, and compared against the day without it.
Re-planning (rather than just slotting the job between two stops) lets the
solver reorder booked jobs within their own windows and combine dump runs,
which is where most of the saving comes from."""

from dataclasses import dataclass, replace

from .model import Fleet, Job, Window
from .routing import DayPlan, plan_day
from .travel import TravelProvider

# Same buckets the booking form offers (lib/scheduling.ts: 6:00-22:00, 2 h steps).
BUSINESS_START_MIN = 6 * 60
BUSINESS_END_MIN = 22 * 60
SLOT_STEP_MIN = 120


@dataclass(frozen=True)
class WindowOption:
    window: Window
    feasible: bool
    # Set only when feasible.
    plan: DayPlan | None = None
    # What adding the request in this window costs over the day without it.
    extra_cost: float | None = None
    extra_paid_min: float | None = None
    extra_km: float | None = None
    extra_dump_visits: int | None = None


@dataclass(frozen=True)
class InsertionResult:
    baseline: DayPlan
    options: list[WindowOption]

    def cheapest(self) -> WindowOption | None:
        feasible = [o for o in self.options if o.feasible]
        return min(feasible, key=lambda o: o.extra_cost) if feasible else None


def slot_windows() -> list[Window]:
    return [
        Window(start, start + SLOT_STEP_MIN)
        for start in range(BUSINESS_START_MIN, BUSINESS_END_MIN, SLOT_STEP_MIN)
    ]


def evaluate_windows(
    fleet: Fleet,
    booked: list[Job],
    request: Job,
    travel: TravelProvider,
    windows: list[Window] | None = None,
    carry_in_yd3: float = 0,
) -> InsertionResult:
    """`booked` are the day's committed jobs; `request`'s own window is ignored
    and replaced by each of `windows` (default: the booking form's slots).
    `carry_in_yd3`: junk still on the truck from the day before."""
    baseline = plan_day(fleet, booked, travel, carry_in_yd3=carry_in_yd3)
    options = []
    for window in windows or slot_windows():
        plan = plan_day(fleet, booked + [replace(request, window=window)], travel, frozenset({request.id}),
                        carry_in_yd3)
        # Infeasible if the request didn't fit, or (only possible on an already
        # overbooked day) fitting it pushed out a job that fit before.
        if request.id in plan.unassigned or len(plan.unassigned) > len(baseline.unassigned):
            options.append(WindowOption(window=window, feasible=False))
            continue
        options.append(WindowOption(
            window=window,
            feasible=True,
            plan=plan,
            # VROOM is a heuristic, so on a tiny day the plan with the request
            # can come out marginally cheaper than the baseline; never below 0.
            extra_cost=round(max(0.0, plan.cost - baseline.cost), 2),
            extra_paid_min=max(0.0, plan.paid_min - baseline.paid_min),
            extra_km=max(0.0, plan.drive_km - baseline.drive_km),
            extra_dump_visits=plan.dump_visits - baseline.dump_visits,
        ))
    return InsertionResult(baseline=baseline, options=options)
