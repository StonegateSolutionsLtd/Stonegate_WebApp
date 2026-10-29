"""What the engine plans with: the fleet (trucks, depot, dump stations, costs)
and the jobs of one day. Nothing here is Stonegate-specific: a tenant's
config fills these in. Times are minutes since midnight in the business's
time zone; volumes are cubic yards."""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Location:
    lat: float
    lng: float
    name: str = ""
    # Geocoded to the street, not the building: it can be well off.
    approximate: bool = False


@dataclass(frozen=True)
class Window:
    """When the crew may *arrive* (start service), as minutes since midnight.
    The customer's booked 2-hour slot (e.g. 10:00-12:00) is one of these."""
    start: int
    end: int

    def __post_init__(self):
        if self.start > self.end:
            raise ValueError(f"window starts after it ends: {self}")

    def label(self) -> str:
        return f"{hhmm(self.start)}-{hhmm(self.end)}"


@dataclass(frozen=True)
class Truck:
    id: str
    capacity_yd3: float
    # Working hours: the truck leaves the depot and is back by these times.
    shift: Window


@dataclass(frozen=True)
class DumpStation:
    location: Location
    # Queue, weigh-in and tipping, paid once per visit however many loads are tipped.
    setup_min: float
    # Unloading, per cubic yard tipped.
    unload_min_per_yd3: float
    # When the gate is open; None = whenever the truck works.
    hours: Window | None = None


@dataclass(frozen=True)
class Costs:
    # Whole crew on one truck, paid for driving and on-site time (not idle gaps,
    # which payroll doesn't pay; see Route.idle_min).
    crew_per_hour: float
    truck_per_km: float


@dataclass(frozen=True)
class Fleet:
    depot: Location
    trucks: list[Truck]
    dump_stations: list[DumpStation]
    costs: Costs


@dataclass(frozen=True)
class Job:
    """A job the crew does on the day. Junk removal (no dropoff) is carried to
    the nearest dump station; a move (with dropoff) takes the whole truck from
    pickup to dropoff, so any junk on board has to be dumped first."""
    id: str
    location: Location
    # On-site time at the pickup: loading, carrying, stairs.
    service_min: float
    window: Window | None = None
    volume_yd3: float = 0
    dropoff: Location | None = None
    dropoff_service_min: float = 0

    @property
    def is_move(self) -> bool:
        return self.dropoff is not None


def hhmm(minutes: float) -> str:
    m = round(minutes)
    return f"{m // 60:02d}:{m % 60:02d}"
