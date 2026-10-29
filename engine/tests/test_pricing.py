from fleet_engine import InsertionResult, Window, WindowOption
from fleet_engine.pricing import PricingPolicy, make_offers
from fleet_engine.routing import DayPlan

POLICY = PricingPolicy(share_of_savings=0.5, min_discount=20, max_discount_fraction=0.25, round_to=5)
BASE = 260


def h(hours):
    return hours * 60


def slot(start_hour, extra_cost):
    window = Window(h(start_hour), h(start_hour + 2))
    if extra_cost is None:
        return WindowOption(window=window, feasible=False)
    return WindowOption(window=window, feasible=True, extra_cost=extra_cost)


def result(*options):
    return InsertionResult(baseline=DayPlan(routes=[], unassigned=[]), options=list(options))


PICKED = Window(h(18), h(20))


def test_cheaper_window_gets_half_the_saving_rounded_down():
    quote = make_offers(result(slot(10, 100), slot(18, 200)), PICKED, BASE, POLICY)
    assert quote.picked_fits and quote.picked_cost == 200
    [offer] = quote.offers
    # Saving 100 -> 50 off.
    assert (offer.window.start, offer.discount, offer.price) == (h(10), 50, 210)
    assert offer.margin == 110
    assert offer.message == ("Would you like to move your pickup 8 hours earlier, to 10:00-12:00, "
                             "for $210 instead of $260?")


def test_same_or_dearer_windows_and_small_savings_are_not_offered():
    quote = make_offers(result(slot(8, 230), slot(10, 165), slot(12, 250), slot(18, 200)), PICKED, BASE, POLICY)
    # 8:00 and 12:00 cost us more; 10:00 saves 35 -> 17.50 -> 15, under the 20 minimum.
    assert quote.offers == []


def test_discount_is_capped():
    [offer] = make_offers(result(slot(10, 0), slot(18, 400)), PICKED, BASE, POLICY).offers
    # Half of 400 is 200, but at most 25% of 260 = 65 -> 65.
    assert offer.discount == 65 and offer.price == 195


def test_never_priced_below_what_the_window_costs_us():
    [offer] = make_offers(result(slot(10, 230), slot(18, 330)), PICKED, BASE, POLICY).offers
    # Half of the 100 saving is 50, but 260 - 50 = 210 is below the 230 it costs: 30 off.
    assert offer.discount == 30 and offer.price == 230 and offer.margin == 0


def test_no_offers_when_the_pick_does_not_fit():
    quote = make_offers(result(slot(10, 100), slot(18, None)), PICKED, BASE, POLICY)
    assert not quote.picked_fits and quote.offers == []


def test_cheapest_first_then_closest_to_the_pick():
    quote = make_offers(result(slot(8, 100), slot(14, 100), slot(16, 150), slot(18, 200)), PICKED, BASE, POLICY)
    assert [(o.window.start, o.price) for o in quote.offers] == [(h(14), 210), (h(8), 210), (h(16), 235)]
    assert quote.offers[0].message.startswith("Would you like to move your pickup 4 hours earlier")
