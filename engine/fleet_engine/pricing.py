"""Turns what each window costs us into what the customer is offered.

The customer's own pick is quoted at the normal (base) price. Any other
window that's cheaper for us is offered at a discount: a share of what we
save by doing the job then instead. Small discounts aren't worth asking the
customer to move for, big ones are capped, and an offer is never priced
below what the job costs us in that window."""

import math
from dataclasses import dataclass

from .insertion import InsertionResult
from .model import Window


@dataclass(frozen=True)
class PricingPolicy:
    # Of what we save by doing the job in another window, how much goes to the customer.
    share_of_savings: float
    # Smaller discounts aren't offered.
    min_discount: float
    # Never more off than this share of the base price.
    max_discount_fraction: float
    # Discounts are rounded down to a multiple of this.
    round_to: float


@dataclass(frozen=True)
class Offer:
    window: Window
    price: float
    discount: float
    # What doing the job here instead of the customer's pick saves us.
    our_saving: float
    # Price minus what the job costs us in this window.
    margin: float
    message: str


@dataclass(frozen=True)
class Quote:
    picked: Window
    base_price: float
    # False when the customer's pick doesn't fit the day: no offers then.
    picked_fits: bool
    # What the job costs us in the customer's pick.
    picked_cost: float | None
    # Cheapest first.
    offers: list[Offer]


def make_offers(result: InsertionResult, picked: Window, base_price: float, policy: PricingPolicy) -> Quote:
    pick = next((o for o in result.options if o.window == picked), None)
    if pick is None or not pick.feasible:
        return Quote(picked=picked, base_price=base_price, picked_fits=False, picked_cost=None, offers=[])

    offers = []
    for option in result.options:
        if not option.feasible or option.window == picked:
            continue
        saving = pick.extra_cost - option.extra_cost
        if saving <= 0:
            continue
        discount = min(saving * policy.share_of_savings, base_price * policy.max_discount_fraction)
        # Never below what the job costs us in this window.
        discount = min(discount, base_price - option.extra_cost)
        discount = math.floor(discount / policy.round_to) * policy.round_to
        if discount < policy.min_discount:
            continue
        price = base_price - discount
        offers.append(Offer(
            window=option.window,
            price=price,
            discount=discount,
            our_saving=round(saving, 2),
            margin=round(price - option.extra_cost, 2),
            message=offer_message(picked, option.window, base_price, price),
        ))
    offers.sort(key=lambda o: (o.price, abs(o.window.start - picked.start)))
    return Quote(picked=picked, base_price=base_price, picked_fits=True, picked_cost=pick.extra_cost, offers=offers)


def offer_message(picked: Window, offered: Window, base_price: float, price: float) -> str:
    """E.g. "Would you like to move your pickup 2 hours earlier, to 10:00-12:00,
    for $215 instead of $260?" """
    shift = offered.start - picked.start
    hours = abs(shift) / 60
    amount = f"{hours:g} hour{'' if hours == 1 else 's'} {'earlier' if shift < 0 else 'later'}"
    return (f"Would you like to move your pickup {amount}, to {offered.label()}, "
            f"for ${price:,.0f} instead of ${base_price:,.0f}?")
