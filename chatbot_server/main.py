"""Junk removal chat server.

Takes the junk removal form from /book-service, saves it as variables in a
per-session .txt file (JSON), and builds a structured quote state from the
form, the photos and the chat. Photos of the junk are required: the model
checks they are good enough to estimate the volume (if not, it explains
what's wrong and asks for new or more photos) and lists the items, materials
and heavy objects it can see. Then a quoting assistant asks, one at a time,
only the questions whose answers are still missing and would change the
quote (it also decides any field the customer marked "Not sure").

Run:  uvicorn main:app --port 8000   (from this directory)
"""

import base64
import json
import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from openai import OpenAI
from pydantic import BaseModel, Field

# Shares the Next app's .env.local; a local .env, if present, fills in anything
# it doesn't set (load_dotenv never overrides a variable that's already set).
load_dotenv(Path(__file__).parent.parent / ".env.local")
load_dotenv(Path(__file__).with_name(".env"))

MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
# Checks the customer's photos.
PHOTO_MODEL = os.getenv("OPENAI_PHOTO_MODEL", "gpt-4.1")
SESSIONS_DIR = Path(os.getenv("SESSIONS_DIR", Path(__file__).parent / "data" / "sessions"))
# After this many questions the model must commit to its best estimate.
MAX_QUESTIONS = 15
# Same limit as MAX_PHOTOS in lib/photos.ts.
MAX_PHOTOS = 6
# After this many failed photo checks the photos are accepted as they are and
# flagged for staff, so a customer is never stuck unable to book.
MAX_PHOTO_CHECKS = 3
PHOTO_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}
DATA_URL = re.compile(r"data:(image/[a-z]+);base64,([A-Za-z0-9+/=]+)")

# Same labels and fractions as TRUCK_FRACTIONS in lib/quote-pricing.ts.
LOAD_SIZES = ["1/8 Truck", "1/4 Truck", "1/2 Truck", "3/4 Truck", "Full Truck"]
LOAD_SIZE_FRACTIONS = {"1/8 Truck": 1 / 8, "1/4 Truck": 1 / 4, "1/2 Truck": 1 / 2, "3/4 Truck": 3 / 4, "Full Truck": 1.0}
UnsureField = Literal["loadSize", "hasElevator"]

# Load cabin dimensions by truck type; keyed so more trucks can be added later.
TRUCKS = {"standard": {"length_ft": 16, "width_ft": 7.5, "height_ft": 6.5}}
FT3_PER_YD3 = 27


def truck_capacity_ft3(truck: str = "standard") -> float:
    t = TRUCKS[truck]
    return t["length_ft"] * t["width_ft"] * t["height_ft"]


def truck_capacity_yd3(truck: str = "standard") -> float:
    return truck_capacity_ft3(truck) / FT3_PER_YD3


def load_size_from_fraction(fraction: float) -> str:
    """Smallest LOAD_SIZES bucket at or above the fraction: we'd rather send a
    bigger truck/crew than under-quote, so this rounds up, never to nearest."""
    for label in LOAD_SIZES:
        if fraction <= LOAD_SIZE_FRACTIONS[label] + 1e-9:
            return label
    return LOAD_SIZES[-1]


# ---------------------------------------------------------------------------
# Quote state: everything needed to price the job, filled from the form, the
# photo check and the chat. Kept in session["quote"]; snake_case to match the
# spec staff work from.

PHOTOS_COMPLETE = ["yes", "mostly", "no", "unknown"]
VOLUME_CONFIDENCE = ["high", "medium", "low"]
MATERIAL_TYPES = [
    "normal_household", "concrete", "soil_dirt", "rocks", "brick", "tile", "drywall", "roofing_material",
    "scrap_metal", "large_appliances", "refrigerator_freezer", "tires", "paint_chemicals", "batteries",
    "electronics", "other_heavy_material", "none",
]
# Priced by weight rather than (only) by volume.
HEAVY_MATERIALS = {"concrete", "soil_dirt", "rocks", "brick", "tile", "drywall", "roofing_material", "other_heavy_material"}
# May not be accepted, or need special disposal: staff confirm before quoting.
SPECIAL_DISPOSAL = {"paint_chemicals", "batteries"}
HEAVY_ITEM_TYPES = [
    "safe", "piano", "pool_table", "hot_tub", "commercial_equipment", "solid_wood_furniture",
    "commercial_refrigerator", "exercise_equipment", "large_appliance", "other",
]
# Need special handling whatever their weight; still unknown at the end -> manual review.
SPECIALTY_ITEMS = {"safe", "piano", "pool_table", "hot_tub", "commercial_equipment", "commercial_refrigerator"}
LIFTABILITY = ["two_people", "three_to_four_people", "equipment_required", "unknown"]
ITEM_LOCATIONS = [
    "curb", "driveway", "garage", "main_floor", "basement", "upstairs", "backyard", "balcony_patio",
    "storage_locker", "shed", "attic", "commercial_space", "other",
]
STAIR_FLIGHTS = ["less_than_one", "one", "two", "three", "four_plus", "unknown", "not_applicable"]
# How far the truck can park from the junk (the carry distance).
PARKING_DISTANCES = ["beside_or_driveway", "under_15_m", "15_to_30_m", "30_to_60_m", "over_60_m", "unknown"]
ACCESS_OBSTACLES = [
    "stairs", "elevator", "narrow_hallway", "narrow_doorway", "gate", "steep_driveway", "long_hallway",
    "underground_parking", "no_truck_access", "none",
]
# Work before the junk can be carried out; adds labour.
PREPARATION = ["ready", "disassembly", "bagging", "carpet_removal", "disconnection", "other"]
# Junk here is already where the truck parks: no carry, obstacles or stairs.
AT_TRUCK = {"curb", "driveway"}
# Junk here never needs stairs unless the customer says so.
GROUND_LEVEL = AT_TRUCK | {"garage", "main_floor", "backyard", "shed", "storage_locker", "commercial_space"}
QUESTION_TOPICS = [
    "photos_complete", "missing_items", "items_not_to_remove", "confirm_items", "volume_clarification",
    "dimensions", "materials", "heavy_items", "liftability", "locations", "location_split", "stairs",
    "stair_flights", "heavy_items_on_stairs", "parking", "obstacles", "preparation", "curbside_offer",
    "final_confirmation", "elevator", "form_field", "other",
]

# Curbside discount (spec step 9). Curbside removes the carrying labour, not
# disposal or truck space, so the saving is the difference in handling time.
# Fill in CREW_HOURLY_RATE (whole crew, $/hour) to switch the offer on; the
# minute figures are starting points to tune against real jobs.
CREW_HOURLY_RATE: float | None = 60
CURBSIDE_MIN_SAVING = 40  # $; smaller savings aren't worth offering
LOAD_MIN_PER_YD3 = 3  # loading the truck from the curb
CARRY_MIN_PER_YD3 = {  # carrying to the truck, by parking distance
    "beside_or_driveway": 2, "under_15_m": 4, "15_to_30_m": 6, "30_to_60_m": 9, "over_60_m": 12, "unknown": 6,
}
STAIRS_MIN_PER_YD3_PER_FLIGHT = 3
STAIR_FLIGHT_COUNT = {"less_than_one": 0.5, "one": 1, "two": 2, "three": 3, "four_plus": 4, "unknown": 1}
HEAVY_ITEM_MIN = {"two_people": 10, "three_to_four_people": 25, "equipment_required": 45, "unknown": 25}
PREPARATION_MIN = {"disassembly": 30, "bagging": 30, "carpet_removal": 60, "disconnection": 20, "other": 30}


def new_quote_state(form: dict, unsure: list[str]) -> dict:
    return {
        # A. Property / form
        "property_type": form["propertyType"],
        # The form only asks apartments about an elevator.
        "has_elevator": (
            ("unknown" if "hasElevator" in unsure else form["hasElevator"])
            if form["propertyType"] == "apartment"
            else "not_applicable" if form["propertyType"] == "house" else "unknown"
        ),
        # Weak signal only: the photo estimate wins.
        "customer_load_estimate": None if "loadSize" in unsure else (form["loadSize"] or None),
        # B. Photos and load completeness
        "photos_uploaded": False,
        "photos_show_complete_load": "unknown",
        "additional_items_description": None,
        "items_not_to_remove": None,
        # C. Detected items
        "detected_items": [],
        "item_detection_confidence": None,
        "items_confirmed": False,
        # D. Volume
        "ai_estimated_volume_yd3": None,
        "volume_estimate_confidence": None,
        "final_working_volume_yd3": None,
        "estimated_truck_fraction": None,
        "pricing_tier": None,
        # E. Materials / disposal
        "material_types": [],
        "contains_heavy_material": None,
        "heavy_material_details": None,
        "weight_surcharge_required": None,
        # Set by staff in the quote editor (weight mode / tough job fee): weight
        # can't be judged reliably from photos and a chat.
        "weight_surcharge_amount": None,
        # F. Individually heavy objects
        "heavy_items": [],
        # G. Location
        "item_locations": [],
        "location_distribution": None,
        # H. Stairs
        "stairs_required": None,
        "stair_flights": None,
        "heavy_items_on_stairs": None,
        # I. Parking / carry distance
        "truck_parking_distance": None,
        "access_obstacles": [],
        "access_notes": None,
        # J. Preparation / disassembly
        "preparation_needed": [],
        "preparation_details": None,
        # K. Curbside discount (only when CREW_HOURLY_RATE is set)
        "estimated_inside_labour_cost": None,
        "estimated_curbside_labour_cost": None,
        "curbside_savings": None,
        "curbside_interest": None,
        # L. Final confirmation of everything above
        "final_confirmed": False,
        "confirmations_asked": 0,
        # Review
        "manual_review_required": False,
        "manual_review_reasons": [],
        # Reasons the chat model gave; merged into manual_review_reasons.
        "model_review_reasons": [],
        # Topics already asked, so the chat never asks the same thing twice.
        "asked_topics": [],
    }


FIELD_SCHEMAS = {
    "loadSize": {"anyOf": [{"type": "string", "enum": LOAD_SIZES}, {"type": "null"}]},
    "hasElevator": {"type": ["boolean", "null"]},
}

# Used only if the model still can't decide after MAX_QUESTIONS; recorded in
# the session file under "defaulted" so staff know to double-check.
FALLBACK_VALUES = {
    "loadSize": "1/4 Truck",
    "hasElevator": False,
}

# Asked when a field is still open but the model offered no question (usually
# because its guess was discarded for lack of evidence).
FALLBACK_QUESTIONS = {
    "loadSize": "What items do you need removed, and roughly how many?",
    "hasElevator": "Is there an elevator we can use to bring the junk down?",
}

# Always the first quote question, if the model doesn't ask anything itself.
PHOTOS_COMPLETE_QUESTION = "I can see the photos you uploaded. Do they show everything you want us to remove?"
PHOTOS_COMPLETE_OPTIONS = ["Yes, everything is shown", "Mostly — a few more items", "No — there's more not shown"]

# Only used if a session somehow starts without photos.
PHOTO_QUESTION = (
    "Please add a few photos of the junk, ideally from different angles, "
    'using the "Add photos" button below. They help our team see exactly what '
    "needs to go and give you an accurate quote."
)
# Used when the photo check finds a problem but gives no message.
PHOTO_RETRY = (
    "We couldn't quite make out the junk in those photos. Could you add another "
    "photo or two that show the whole pile clearly, in good light?"
)

PHOTO_CHECK_PROMPT = f"""\
You review customer photos for a junk removal booking with Stonegate Moving
Solutions (Burnaby, BC). Our team uses them to estimate the volume of junk
(how much of our {TRUCKS["standard"]["length_ft"]:g} x {TRUCKS["standard"]["width_ft"]:g} x
{TRUCKS["standard"]["height_ft"]:g} ft truck it fills) and how hard it is to
remove. Decide whether the photos, taken together, are good enough for that.

Usable when the junk itself is visible, all of it can be seen across the
photos, and they are bright and sharp enough to tell what the items are and
roughly how big they are.

Not usable, for example: too dark or too blurry; taken so close that only
part of a pile or a single item shows; no junk visible at all (a selfie,
screenshot, logo, document, blank or empty room); or clearly showing only a
small part of what the customer described.

Be practical, not picky: ordinary phone photos of a messy garage are fine if
a person could estimate the volume from them.

Judge only what you can actually see. The customer's description tells you
what to look for, but it is not evidence: if you can't see the items in the
photos, they are not usable. First write in "visible" what the photos really
show (items, lighting, sharpness, framing), then decide.

If not usable, write "message" to the customer: friendly, at most three short
sentences, saying specifically what is wrong and what photo(s) to take
instead (e.g. "step back so the whole pile is in the frame", "turn on a light
or open the garage door"). Tell them to add the new photos with the "Add
photos" button below. If usable, message is null.

Also judge each photo on its own, by its number: "good" is true when it
clearly shows junk (bright and sharp enough to tell what the items are) and
so helps estimate the volume, even if it shows only part of the pile. Only
good photos are kept with the booking.

If usable, also estimate what fraction of the truck's load space the junk
shown would fill, from 0 (nothing) to 1 (completely full) — judge it directly
as a share of the truck box, not by converting to a volume in some other
unit. Rough reference points: a couch or mattress plus some boxes is about
0.15-0.25; the contents of a small room, about 0.5; several rooms, about
0.75; a whole home, basement or large garage, 1 or more. If a fridge, washer,
dryer, mattress, standard door or other item of well-known real-world size is
visible, use it as a scale reference for judging the size of everything else
in the photo — this is more reliable than judging proportions by eye alone.
Base this mainly on what you can actually see. If the customer gave their own
load size estimate,
treat it as one more thing to weigh, not as evidence on its own: it may be
accurate, or the photos may show the pile is bigger or smaller than they
think — go with what the photos support. In volumeEvidence, briefly say what
you based the estimate on (the items and roughly how many) — it must
describe the same amount as your numeric estimate. If not usable, both are
null.

volumeConfidence: "high" when the whole pile is visible and sizes are clear;
"medium" when some of it is hidden or the scale is uncertain; "low" when much
is hidden, the pile's depth can't be judged, or large items are cut off. If
not high, volumeUncertainty says in one short sentence exactly what is
unclear (e.g. "items behind the couch aren't visible", "can't tell how deep
the pile goes", "can't judge the hot tub's size"); otherwise it is null.

If usable, list detectedItems: each kind of item you can see, with its
quantity, rough dimensions only for large items whose size matters (e.g.
"about 9 ft sectional", else null), its approximate volume in cubic yards
(or null if you can't judge it) and your confidence from 0 to 1 that you
identified it correctly. Group small things ("boxes", "garbage bags", "loose
debris") rather than listing each one. itemDetectionConfidence is your
overall confidence from 0 to 1 that the list is right and complete for what
is shown.

materialTypes: the disposal categories you can actually see, from the
allowed list ("normal_household" for ordinary furniture, boxes and bags).
Only include concrete, soil, rocks, brick, tile, drywall, roofing, tires,
paint/chemicals, batteries and the like when they are visibly there.

heavyItems: individually heavy objects you can see (safe, piano, pool table,
hot tub, commercial equipment, solid wood furniture, commercial fridge,
exercise equipment, large appliance), with quantity, a rough weight as a
short string (e.g. "about 300 lb") or null, and liftability only when it is
obvious (a standard washer: two_people), else "unknown".

locationHints: where the junk appears to be (garage, basement, driveway,
backyard, ...) only when the setting is clearly visible, else [].

closedContainers: true when there are closed bags, boxes, bins or covered
piles whose contents you can't see (so heavy or hazardous material could be
inside), false when everything is visible as-is.

looksReady: true when everything looks ready to be carried out as it is —
loose items and bagged or boxed material, nothing that looks installed
(carpet, fixtures, built-ins), connected (appliances, hot tub) or too big to
fit through a door without taking it apart. Otherwise false.

If not usable, detectedItems, materialTypes, heavyItems and locationHints are
[], closedContainers is true, looksReady is false, and the confidence fields
are null.

If usable, also check for anything in the photos that might not actually be
meant for removal: junk sitting on or in a shelf, dresser, cabinet or other
furniture piece that could itself be a keeper; or one item that stands out
from the rest (noticeably newer, cleaner or more valuable-looking) as if it
might not belong with the junk. If you see something like that AND the
customer's own notes haven't already said what to keep or confirmed
everything goes, write itemsToConfirm: a short note naming the specific
item(s) that might be keepers. If nothing like that stands out, or the notes
already cover it, itemsToConfirm is null.
"""


def nullable(schema: dict) -> dict:
    return {"anyOf": [schema, {"type": "null"}]}


def enum(values: list[str]) -> dict:
    return {"type": "string", "enum": values}


def strict_object(properties: dict) -> dict:
    return {"type": "object", "properties": properties, "required": list(properties), "additionalProperties": False}


DETECTED_ITEM_SCHEMA = strict_object({
    "item_type": {"type": "string"},
    "quantity": {"type": "integer"},
    "dimensions": {"type": ["string", "null"]},
    "estimated_volume_yd3": {"type": ["number", "null"]},
    "confidence": {"type": "number"},
})

HEAVY_ITEM_SCHEMA = strict_object({
    "item_type": enum(HEAVY_ITEM_TYPES),
    "description": {"type": ["string", "null"]},
    "quantity": {"type": "integer"},
    "estimated_weight": {"type": ["string", "null"]},
    "liftability": enum(LIFTABILITY),
    "manual_review_required": {"type": "boolean"},
})

PHOTO_CHECK_SCHEMA = strict_object({
    "visible": {"type": "string"},
    "photos": {
        "type": "array",
        "items": strict_object({"number": {"type": "integer"}, "good": {"type": "boolean"}}),
    },
    "usable": {"type": "boolean"},
    "message": {"type": ["string", "null"]},
    "estimatedTruckFraction": {"type": ["number", "null"]},
    "volumeEvidence": {"type": ["string", "null"]},
    "volumeConfidence": nullable(enum(VOLUME_CONFIDENCE)),
    "volumeUncertainty": {"type": ["string", "null"]},
    "detectedItems": {"type": "array", "items": DETECTED_ITEM_SCHEMA},
    "itemDetectionConfidence": {"type": ["number", "null"]},
    "materialTypes": {"type": "array", "items": enum(MATERIAL_TYPES)},
    "heavyItems": {"type": "array", "items": HEAVY_ITEM_SCHEMA},
    "locationHints": {"type": "array", "items": enum(ITEM_LOCATIONS)},
    "closedContainers": {"type": "boolean"},
    "looksReady": {"type": "boolean"},
    "itemsToConfirm": {"type": ["string", "null"]},
})

PHOTO_PROMPT = """\
You help Stonegate Moving Solutions (Burnaby, BC) complete a junk removal
booking. Photos of the junk are needed to book. The customer was asked for
new or more photos (your last message says why) but wrote a message instead.

- If they clearly say they cannot take better or more photos right now, set
  acceptCurrentPhotos to true and message to a short, friendly confirmation
  that the team will work with the photos they have and may follow up.
- Otherwise set acceptCurrentPhotos to false and write "message": answer
  anything they asked briefly and honestly (photos help the team see what
  needs to be removed, how much there is and how hard it is to reach, so the
  quote is accurate; for exact prices, availability or which items we accept,
  say the team will follow up after the booking), then ask again for the
  photos, using the "Add photos" button below. At most three short sentences.
"""

PHOTO_REPLY_SCHEMA = strict_object({"acceptCurrentPhotos": {"type": "boolean"}, "message": {"type": ["string", "null"]}})

SYSTEM_PROMPT = f"""\
You are the quoting assistant for Stonegate Moving Solutions (Burnaby, BC), a
junk removal company. The customer has filled in a booking form and uploaded
photos of the junk. This chat opens for every booking, not only when a field
was marked "Not sure". Your job is to collect ONLY the information that is
still missing for an accurate quote, one short question at a time, and to
keep the quote state up to date.

You are given: the booking form, the photo analysis (items seen, volume
estimate and how confident it is, materials, heavy items, where the junk seems
to be), the current quote state, the topics already asked (asked_topics),
the required topics still open (required_open_topics), the form fields the
customer marked "Not sure", and the conversation so far.

# How to decide what to ask

1. Before every question, check whether the answer is already known from the
   form, the customer's notes, the photo analysis, the quote state or anything
   said in the chat. If it is known or can be reliably inferred, record it in
   "quote" and don't ask.
2. Beyond the required topics, ask only when the answer could materially
   change the price, labour time, access difficulty, disposal cost, crew or
   equipment needed, safety, or whether the job needs manual review.
3. Never ask a topic in asked_topics again unless the customer's answer was
   unclear or contradictory, or new information (e.g. new photos) changed it.
4. One question per message, about one topic. Short, friendly, plain words;
   never mention field names, codes or percentages of the truck.
5. required_open_topics lists the topics the customer still has to answer,
   in order. While it isn't empty you MUST ask about its first topic (a
   photo guess is not an answer — confirm it with the customer). Only when
   it is empty and nothing material is left, set question to null. Don't ask
   "anything else?" and don't recap the booking.

# Topics, in order (skip any that are known or don't apply)

A customer with a couch and a mattress at the curb and clear photos might get
3 questions; basement renovation debris with stairs, a long carry and poor
photos might get 10-15. Ask a question only when the answer could materially
change the quote or decide whether we can safely do the job.

1. Validate what is being removed.
   - photos_complete: "I can see the photos you uploaded. Do the photos show
     everything you want us to remove?" Options: "Yes, everything is shown",
     "Mostly — a few more items", "No — there's more not shown". Skip it only
     if the customer already said so.
   - missing_items (if mostly or no): "Please upload the remaining photos or
     tell me what else needs to be removed." (request_photos true). Record
     additional_items_description.
   - items_not_to_remove: "Is there anything visible in the photos that
     should NOT be removed?" (e.g. "Remove the couch, mattress and boxes, but
     leave the shelving unit"). If the photo analysis flagged a possible
     keeper (itemsToConfirm), name it. Record "none" if everything goes.
   - confirm_items: explicitly summarise: "I see approximately: 1 sofa, 2
     mattresses, 6 bags, 1 dresser and several boxes. Is that correct?"
     Options "Yes", "Edit items". Set items_confirmed true on yes; on edits,
     replace detected_items.
2. Volume (volume_clarification / dimensions). The photo estimate
   (ai_estimated_volume_yd3) is the primary volume; customer_load_estimate is
   a weak signal only, never ground truth. If volume_estimate_confidence is
   low, ask ONE targeted question about the specific uncertainty — usually
   one more photo ("I can't clearly see the items behind the couch. Could you
   upload one photo from the other side?", request_photos true). Ask
   dimensions only for an uncertain large object ("Approximately how long is
   the sectional?", "Is the hot tub approximately 6 × 6 ft, 7 × 7 ft, or
   larger?"). Never ask them to measure everything. When items are added or
   removed, set final_working_volume_yd3 to the adjusted total (our truck
   holds about {truck_capacity_yd3():.0f} yd³); otherwise leave it null.
3. materials: "Does the load contain any of the following?" — concrete,
   soil/dirt, rocks, brick, tile, drywall, roofing material, scrap metal,
   large appliances, refrigerator/freezer, tires, paint/chemicals,
   batteries, electronics, other unusually heavy material, none. Record
   material_types (several allowed; ["none"] if none), contains_heavy_material
   and heavy_material_details (what and roughly how much).
4. heavy_items: "Are there any unusually heavy individual items?" (safe,
   piano, pool table, hot tub, large commercial equipment, large solid-wood
   furniture, commercial refrigerator, exercise equipment, large appliance,
   other item needing several people). If yes, ask roughly how heavy; if
   they don't know: "Could two people reasonably lift it?" Options "2 people
   can lift it", "Probably needs 3–4 people", "Extremely heavy / equipment
   may be required", "Not sure". Record heavy_items with liftability. Photo
   guesses of liftability are not answers.
5. locations: "Where are the items located?" (several allowed: curb /
   driveway, garage, main floor, basement, upstairs, backyard, balcony /
   patio, storage locker, shed, attic, commercial space, other). If several
   (location_split): "Approximately what percentage is in each area?" —
   "70% garage, 30% upstairs" is enough; record location_distribution.
6. Stairs, only when applicable (junk upstairs, in a basement or attic, on a
   balcony, or in an apartment without a usable elevator; never for junk at
   the curb, on the driveway or all at ground level unless they mention
   steps). stairs: "Will our crew need to carry any junk up or down stairs?"
   If yes, stair_flights: "How many flights?" (less than 1, 1, 2, 3, 4+, not
   sure). Then, if there are heavy items, heavy_items_on_stairs: "Are any of
   the large/heavy items on those stairs?" — 20 garbage bags upstairs is not
   a piano upstairs.
7. Parking / carry distance.
   - parking: "How close can our truck park to the junk?" Options: right
     beside it / driveway, less than 15 m, 15–30 m, 30–60 m, more than 60 m,
     not sure. Record truck_parking_distance.
   - obstacles: "Are there any obstacles between the junk and the truck?" —
     stairs, elevator, narrow hallway, narrow doorway, gate, steep driveway,
     long hallway, underground parking, no truck access, none. Record
     access_obstacles (["none"] if none) and anything specific in
     access_notes.
8. preparation: "Is everything ready to be carried out?" Options: "Yes —
   everything is ready", "Some items need disassembly", "Loose material
   needs to be bagged", "Carpet needs to be removed", "Items need to be
   disconnected", "Other preparation required". Record preparation_needed
   (["ready"] if ready) and preparation_details — a rolled-up carpet in the
   garage is not 1,000 sq ft of installed carpet, so ask how much when it
   matters.
9. curbside_offer: the server asks this itself with the calculated saving;
   record curbside_interest from the answer (true if they want it).
10. final_confirmation: the server shows the customer a summary of
   everything and asks "Is everything above correct?". If they say yes, set
   final_confirmed true and question null. If they want to change
   something, ask what, update the quote, and leave final_confirmed false
   (the server will show the corrected summary again).
Elevator: property_type comes from the form — never ask it. Never ask about
an elevator for a house. For an apartment, ask about the elevator only if
they marked it "Not sure" (hasElevator in unsure_fields).

# Form fields marked "Not sure"

Also decide each field listed under unsure_fields, in "values":
- loadSize: one of {", ".join(LOAD_SIZES)}. How much of our truck
  the items fill (the box is {TRUCKS["standard"]["length_ft"]:g} x
  {TRUCKS["standard"]["width_ft"]:g} x {TRUCKS["standard"]["height_ft"]:g} ft, about
  {truck_capacity_ft3():.0f} ft³). A few small items or bags -> 1/8; a couch or
  mattress plus some boxes -> 1/4; a full room or small garage clean-out ->
  1/2; several rooms -> 3/4; a whole home, basement or large garage -> Full.
- hasElevator (apartments only): true only if an elevator can be used to
  bring the junk down.
For every value you fill in, set evidence to the exact words the customer
wrote that support it, copied verbatim (a short phrase). Values without real
evidence are discarded, so if they haven't said anything about a field, leave
it null and ask about it (topic form_field) — ask about things they know
("What items do you need removed?"), not for the technical value itself.

# Answering the customer

- If the customer asks something instead of answering (why it matters, what
  a term means, whether a guess is fine), answer briefly and honestly in one
  or two sentences, then ask your question again, ideally reworded. Both go
  in "question" as one message. Why we ask: the volume decides truck space
  and disposal (the main part of the price); heavy materials are charged by
  weight; stairs, long carries and heavy items add labour time and crew;
  everything is used only to prepare an accurate quote.
- Never quote prices or promise a price. For exact prices, availability,
  which items we accept or special services, say the team will follow up
  after the booking, then continue.
- If they didn't answer your last question, ask it again.
- If they say they don't know, record "unknown" where allowed, don't push,
  and move on; if it's a heavy or specialty item, mark it for manual review.
- If an answer is vague or contradictory, ask a follow-up question.

# Output

- quote: only the fields you are changing; null means "no change". Lists
  replace the whole list. Never invent values: record something only when
  the customer said it or the form or photo analysis clearly supports it.
- review_reason: a short note for staff when something needs manual review
  (e.g. "customer unsure whether the safe can be lifted"), else null.
- question: your next message, or null when done.
- question_topic: the topic of that question (one of the topics above, or
  form_field / other), or null when done.
- options: 2-4 short tap-to-answer replies for a choice question, else [].
- request_photos: true when you're asking for more photos.
"""

QUOTE_UPDATE_SCHEMA = strict_object({
    "has_elevator": {"anyOf": [{"type": "boolean"}, enum(["unknown", "not_applicable"]), {"type": "null"}]},
    "photos_show_complete_load": nullable(enum(PHOTOS_COMPLETE)),
    "additional_items_description": {"type": ["string", "null"]},
    "items_not_to_remove": {"type": ["string", "null"]},
    "items_confirmed": {"type": ["boolean", "null"]},
    "detected_items": nullable({"type": "array", "items": DETECTED_ITEM_SCHEMA}),
    "final_working_volume_yd3": {"type": ["number", "null"]},
    "material_types": nullable({"type": "array", "items": enum(MATERIAL_TYPES)}),
    "contains_heavy_material": {"type": ["boolean", "null"]},
    "heavy_material_details": {"type": ["string", "null"]},
    "heavy_items": nullable({"type": "array", "items": HEAVY_ITEM_SCHEMA}),
    "item_locations": nullable({"type": "array", "items": enum(ITEM_LOCATIONS)}),
    "location_distribution": nullable({
        "type": "array",
        "items": strict_object({"location": enum(ITEM_LOCATIONS), "percent": {"type": "number"}}),
    }),
    "stairs_required": {"type": ["boolean", "null"]},
    "stair_flights": nullable(enum(STAIR_FLIGHTS)),
    "heavy_items_on_stairs": {"type": ["boolean", "null"]},
    "truck_parking_distance": nullable(enum(PARKING_DISTANCES)),
    "access_obstacles": nullable({"type": "array", "items": enum(ACCESS_OBSTACLES)}),
    "access_notes": {"type": ["string", "null"]},
    "preparation_needed": nullable({"type": "array", "items": enum(PREPARATION)}),
    "preparation_details": {"type": ["string", "null"]},
    "curbside_interest": {"type": ["boolean", "null"]},
    "final_confirmed": {"type": ["boolean", "null"]},
})


class ServiceForm(BaseModel):
    address: str = Field(max_length=300)
    date: str
    time: str
    customerName: str = Field(max_length=200)
    customerEmail: str = Field(max_length=200)
    phone: str = Field(max_length=50)
    notes: str = Field(max_length=2000)
    loadSize: str
    propertyType: Literal["house", "apartment", "commercial", "other"]
    hasElevator: bool


# Photos arrive as data URLs (data:image/jpeg;base64,...), already shrunk by the browser.
PhotoList = list[str]


class StartRequest(BaseModel):
    form: ServiceForm
    unsure: list[UnsureField] = Field(default_factory=list)
    photos: PhotoList = Field(default_factory=list, max_length=MAX_PHOTOS)


class AnswerRequest(BaseModel):
    answer: str = Field(min_length=1, max_length=1000)


class PhotosRequest(BaseModel):
    photos: PhotoList = Field(min_length=1, max_length=MAX_PHOTOS)


app = FastAPI(title="Stonegate junk removal chat")
_client: OpenAI | None = None

# Set once this server is reachable over the internet (e.g. behind a tunnel),
# so only the Next.js app (which sends the same value) can call it.
SERVER_SECRET = os.getenv("CHATBOT_SERVER_SECRET")


@app.middleware("http")
async def require_secret(request, call_next):
    if SERVER_SECRET and request.url.path != "/health" and request.headers.get("X-Chatbot-Secret") != SERVER_SECRET:
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})
    return await call_next(request)


def openai_client() -> OpenAI:
    # Created on first use so the server still starts (and serves /health)
    # when no API key is configured.
    global _client
    if _client is None:
        _client = OpenAI()
    return _client


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def session_path(session_id: str) -> Path:
    if not re.fullmatch(r"[0-9a-f]{32}", session_id):
        raise HTTPException(status_code=404, detail="Unknown session")
    return SESSIONS_DIR / f"{session_id}.txt"


def save_session(session: dict) -> None:
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    session["updatedAt"] = now()
    session_path(session["sessionId"]).write_text(json.dumps(session, indent=2), encoding="utf-8")


def load_session(session_id: str) -> dict:
    path = session_path(session_id)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Unknown session")
    return json.loads(path.read_text(encoding="utf-8"))


def clean_value(field: str, value):
    """Reject anything that doesn't fit the form's own constraints."""
    if value is None:
        return None
    if field == "hasElevator":
        return value if isinstance(value, bool) else None
    if field == "loadSize":
        return value if value in LOAD_SIZES else None
    return None


def normalize(text: str) -> str:
    return " ".join(re.sub(r"[^\w\s]", " ", text.lower()).split())


def response_schema(fields: list[str]) -> dict:
    properties = {
        "quote": QUOTE_UPDATE_SCHEMA,
        "review_reason": {"type": ["string", "null"]},
        "question": {"type": ["string", "null"]},
        "question_topic": nullable(enum(QUESTION_TOPICS)),
        "options": {"type": "array", "items": {"type": "string"}},
        "request_photos": {"type": "boolean"},
    }
    if fields:
        properties["values"] = strict_object({
            f: strict_object({"value": FIELD_SCHEMAS[f], "evidence": {"type": ["string", "null"]}})
            for f in fields
        })
    return strict_object(properties)


def photo_findings(session: dict) -> dict | None:
    """What the latest usable photo check saw, for the quoting model."""
    usable = [c for c in session["photoCheckLog"] if c["usable"]]
    if not usable:
        return None
    c = usable[-1]
    return {
        "whatIsVisible": c["visible"],
        "volumeEvidence": c["volumeEvidence"],
        "volumeUncertainty": c["volumeUncertainty"],
        "locationHints": c["locationHints"],
        "closedContainers": c["closedContainers"],
        "looksReady": c["looksReady"],
        "itemsToConfirm": c["itemsToConfirm"],
    }


def apply_inferences(session: dict) -> None:
    """Fill in what the form and photos already settle, so the chat doesn't ask it."""
    q = session["quote"]
    photos = photo_findings(session) or {}
    complete = q["photos_show_complete_load"] == "yes" and not q["additional_items_description"]
    if not q["item_locations"] and complete and photos.get("locationHints"):
        q["item_locations"] = list(photos["locationHints"])
    locations = set(q["item_locations"])
    if locations and locations <= AT_TRUCK:
        # Already at the curb or on the driveway: no carry, obstacles or stairs.
        if q["truck_parking_distance"] is None:
            q["truck_parking_distance"] = "beside_or_driveway"
        if not q["access_obstacles"]:
            q["access_obstacles"] = ["none"]
        if q["stairs_required"] is None:
            q["stairs_required"] = False
    if not q["preparation_needed"] and complete and photos.get("looksReady"):
        q["preparation_needed"] = ["ready"]


def stairs_plausible(q: dict) -> bool:
    locations = set(q["item_locations"])
    return (
        not locations
        or bool(locations - GROUND_LEVEL)
        or (q["property_type"] == "apartment" and q["has_elevator"] is not True)
    )


def open_topics(session: dict) -> list[str]:
    """The definition of done: required facts, in the order to ask them, that are
    still unknown. A fact is known when the form, notes, photos or chat settle it,
    so a simple job gets few questions and a complicated one many. The chat can't
    end while any is open. Each topic is forced at most once (the model handles
    follow-ups), so "not sure" never loops; the final confirmation may repeat
    after the customer changes something."""
    q = session["quote"]
    photos = photo_findings(session) or {}
    complete = q["photos_show_complete_load"] == "yes" and not q["additional_items_description"]
    locations = set(q["item_locations"])
    unknown_lift = any(i["liftability"] == "unknown" for i in q["heavy_items"])
    needed = {
        "photos_complete": q["photos_show_complete_load"] == "unknown",
        "missing_items": q["photos_show_complete_load"] in ("mostly", "no") and not q["additional_items_description"],
        "items_not_to_remove": q["items_not_to_remove"] is None,
        "confirm_items": not q["items_confirmed"],
        "volume_clarification": q["volume_estimate_confidence"] == "low",
        # Only skipped when the photos show the whole load and nothing is hidden in bags or boxes.
        "materials": not (complete and photos.get("closedContainers") is False),
        # Unseen items could be heavy, and photo guesses of liftability aren't answers.
        "heavy_items": bool(q["heavy_items"]) or unknown_lift or not complete,
        "locations": not locations,
        "location_split": len(locations) > 1 and bool(locations - GROUND_LEVEL) and not q["location_distribution"],
        "stairs": stairs_plausible(q) and q["stairs_required"] is None,
        "stair_flights": q["stairs_required"] is True and q["stair_flights"] is None,
        "heavy_items_on_stairs": (
            q["stairs_required"] is True and bool(q["heavy_items"]) and q["heavy_items_on_stairs"] is None
        ),
        "parking": q["truck_parking_distance"] is None,
        "obstacles": not q["access_obstacles"],
        "preparation": not q["preparation_needed"],
        "curbside_offer": (
            q["curbside_savings"] is not None and q["curbside_savings"] >= CURBSIDE_MIN_SAVING
            and q["curbside_interest"] is None and not locations <= AT_TRUCK
        ),
    }
    asked = set(q["asked_topics"])
    # The item summary may also have covered what to keep.
    if "confirm_items" in asked:
        asked.add("items_not_to_remove")
    topics = [t for t, need in needed.items() if need and t not in asked]
    # Confirm everything once nothing else is open; again after any change (max 3 times).
    if not topics and not q["final_confirmed"] and q["confirmations_asked"] < 3:
        topics.append("final_confirmation")
    return topics


def labour_minutes(q: dict, curbside: bool) -> float | None:
    """Rough crew handling time; None until the volume is known."""
    volume = q["final_working_volume_yd3"] or q["ai_estimated_volume_yd3"]
    if not volume:
        return None
    minutes = volume * LOAD_MIN_PER_YD3
    if curbside:
        return minutes
    minutes += volume * CARRY_MIN_PER_YD3[q["truck_parking_distance"] or "unknown"]
    if q["stairs_required"]:
        minutes += volume * STAIRS_MIN_PER_YD3_PER_FLIGHT * STAIR_FLIGHT_COUNT[q["stair_flights"] or "unknown"]
    minutes += sum(HEAVY_ITEM_MIN[i["liftability"]] * i["quantity"] for i in q["heavy_items"])
    minutes += sum(PREPARATION_MIN.get(p, 0) for p in q["preparation_needed"])
    return minutes


def update_curbside(q: dict) -> None:
    """Labour saved if the customer brings everything to the curb first. Off until
    CREW_HOURLY_RATE is set, so customers are never quoted made-up savings."""
    inside, curb = labour_minutes(q, curbside=False), labour_minutes(q, curbside=True)
    if CREW_HOURLY_RATE is None or inside is None or q["truck_parking_distance"] is None:
        q["estimated_inside_labour_cost"] = q["estimated_curbside_labour_cost"] = q["curbside_savings"] = None
        return
    q["estimated_inside_labour_cost"] = round(inside / 60 * CREW_HOURLY_RATE)
    q["estimated_curbside_labour_cost"] = round(curb / 60 * CREW_HOURLY_RATE)
    # Rounded down to $10 so the customer is never promised more than they'd save.
    q["curbside_savings"] = int((q["estimated_inside_labour_cost"] - q["estimated_curbside_labour_cost"]) // 10 * 10)


METRES = {
    "beside_or_driveway": "right beside it or on the driveway", "under_15_m": "less than 15 m away",
    "15_to_30_m": "15–30 m away", "30_to_60_m": "30–60 m away", "over_60_m": "more than 60 m away",
    "unknown": "distance not sure",
}


LIFT_TEXT = {
    "two_people": "2 people can lift it", "three_to_four_people": "needs 3–4 people",
    "equipment_required": "may need equipment",
}


def customer_summary(session: dict) -> str:
    """What the chat believes, for the customer to confirm before finishing."""
    q = session["quote"]
    lines = []
    volume = q["final_working_volume_yd3"] or q["ai_estimated_volume_yd3"]
    if volume:
        low, high = max(1, round(volume * 0.9)), max(1, round(volume * 1.1))
        lines.append(f"About {low}–{high} yd³ of junk" if high > low else f"About {low} yd³ of junk")
    if q["detected_items"]:
        lines.append(", ".join(f"{i['quantity']} {i['item_type']}" for i in q["detected_items"][:8]))
    if q["additional_items_description"]:
        lines.append(f"Plus: {q['additional_items_description']}")
    if q["items_not_to_remove"] and q["items_not_to_remove"].lower() != "none":
        lines.append(f"Leaving behind: {q['items_not_to_remove']}")
    if q["item_locations"]:
        lines.append("Location: " + ", ".join(label(loc) for loc in q["item_locations"])
                     + (f" of a {q['property_type']}" if q["property_type"] in ("house", "apartment") else ""))
    if q["truck_parking_distance"]:
        lines.append(f"Truck parks {METRES[q['truck_parking_distance']]}")
    obstacles = [o for o in q["access_obstacles"] if o != "none"]
    if obstacles:
        lines.append("On the way out: " + ", ".join(label(o) for o in obstacles))
    if q["stairs_required"]:
        lines.append(f"Stairs: {label(q['stair_flights'] or 'some')} flight(s)"
                     + (", with heavy items" if q["heavy_items_on_stairs"] else ""))
    elif q["stairs_required"] is False:
        lines.append("No stairs")
    special = [m for m in q["material_types"] if m not in ("normal_household", "none")]
    if special:
        details = f" ({q['heavy_material_details']})" if q["heavy_material_details"] else ""
        lines.append("Materials: " + ", ".join(label(m) for m in special) + details)
    else:
        lines.append("No unusually heavy material")
    for item in q["heavy_items"]:
        lift = LIFT_TEXT.get(item["liftability"])
        lines.append(f"Heavy item: {item.get('description') or label(item['item_type'])}" + (f" — {lift}" if lift else ""))
    if not q["heavy_items"]:
        lines.append("No unusually heavy individual items")
    prep = [p for p in q["preparation_needed"] if p != "ready"]
    if prep:
        lines.append("Needs: " + ", ".join(label(p) for p in prep))
    elif q["preparation_needed"]:
        lines.append("Everything is ready for removal")
    if q["photos_show_complete_load"] == "yes":
        lines.append("Photos show the complete load")
    return "Here's what I have:\n" + "\n".join(f"• {line}" for line in lines) + "\n\nIs everything above correct?"


def topic_question(session: dict, topic: str) -> tuple[str, list[str], bool]:
    """A plain question for a required topic the model didn't ask: (question, options, request_photos)."""
    q = session["quote"]
    if topic == "photos_complete":
        return PHOTOS_COMPLETE_QUESTION, PHOTOS_COMPLETE_OPTIONS, False
    if topic == "missing_items":
        return (
            'Please upload the remaining photos with the "Add photos" button below, or tell me what else needs to be removed.',
            [], True,
        )
    if topic == "items_not_to_remove":
        return (
            "Is there anything visible in the photos that should NOT be removed?",
            ["No, everything goes", "Yes, some things stay"], False,
        )
    if topic == "confirm_items":
        items = ", ".join(f"{i['quantity']} {i['item_type']}" for i in q["detected_items"][:8])
        return (
            f"I see approximately: {items}. Is that correct?" if items else "What items do you need removed?",
            ["Yes", "Edit items"] if items else [], False,
        )
    if topic == "volume_clarification":
        unclear = (photo_findings(session) or {}).get("volumeUncertainty")
        return (
            (f"{unclear.rstrip('.')}. " if unclear else "Part of the load is hard to see in the photos. ")
            + 'Could you add one more photo from another angle with the "Add photos" button below?',
            [], True,
        )
    if topic == "materials":
        return (
            "Does the load contain any of the following: concrete, soil or dirt, rocks, brick, tile, drywall, "
            "roofing material, scrap metal, large appliances, a fridge or freezer, tires, paint or chemicals, "
            "batteries, electronics, or other unusually heavy material?",
            ["None of these"], False,
        )
    if topic == "heavy_items":
        unknown = [i.get("description") or label(i["item_type"]) for i in q["heavy_items"] if i["liftability"] == "unknown"]
        if unknown:
            return (
                f"Do you know roughly how heavy the {unknown[0]} is? If not: could two people reasonably lift it?",
                ["2 people can lift it", "Probably needs 3–4 people", "Extremely heavy / equipment may be required", "Not sure"],
                False,
            )
        return (
            "Are there any unusually heavy individual items, like a safe, piano, pool table, hot tub, exercise "
            "equipment, large solid-wood furniture or anything else that needs several people?",
            ["No", "Yes"], False,
        )
    if topic == "locations":
        return (
            "Where are the items located? You can pick more than one: curb or driveway, garage, main floor, "
            "basement, upstairs, backyard, balcony or patio, storage locker, shed, attic, commercial space.",
            ["Garage", "Main floor", "Basement", "Curb / driveway"], False,
        )
    if topic == "location_split":
        return "Approximately what share is in each area? Something like 70% garage, 30% upstairs is enough.", [], False
    if topic == "stairs":
        return "Will our crew need to carry any junk up or down stairs?", ["No", "Yes"], False
    if topic == "stair_flights":
        return "How many flights of stairs?", ["Less than 1", "1", "2", "3+"], False
    if topic == "heavy_items_on_stairs":
        return "Are any of the large or heavy items on those stairs?", ["Yes", "No"], False
    if topic == "parking":
        return (
            "How close can our truck park to the junk?",
            ["Right beside it / driveway", "Less than 15 m", "15–30 m", "More than 30 m"], False,
        )
    if topic == "obstacles":
        return (
            "Are there any obstacles between the junk and the truck: stairs, an elevator, a narrow hallway or "
            "doorway, a gate, a steep driveway, a long hallway, underground parking, or no truck access?",
            ["None", "Yes"], False,
        )
    if topic == "preparation":
        return (
            "Is everything ready to be carried out?",
            ["Yes, everything is ready", "Some items need disassembly", "Loose material needs bagging", "Other preparation"],
            False,
        )
    if topic == "curbside_offer":
        return (
            f"You could save approximately ${q['curbside_savings']} by having everything ready at the curb or "
            "driveway before we arrive. Would you like the curbside option?",
            ["Yes, I'll bring it to the curb", "No, please carry it out"], False,
        )
    return customer_summary(session), ["Yes", "Change something"], False


def ask_model(session: dict) -> None:
    """Let the model update the quote state and the "Not sure" fields from everything
    known so far, and pick the next question (if any); updates session in place."""
    quote = session["quote"]
    apply_inferences(session)
    update_derived(session)
    unsure = session["unsure"]
    remaining = [f for f in unsure if session["variables"][f] is None]
    form_for_model = {k: v for k, v in session["form"].items() if k not in unsure}
    questions_asked = sum(1 for m in session["messages"] if m["role"] == "assistant")
    out_of_questions = questions_asked >= MAX_QUESTIONS

    context = {
        "form": form_for_model,
        "unsure_fields": remaining,
        "photo_analysis": photo_findings(session),
        "photos_flagged": session["photosFlagged"],
        "quote_state": {k: v for k, v in quote.items() if k != "model_review_reasons"},
        "required_open_topics": open_topics(session),
    }
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": "Booking context:\n" + json.dumps(context, indent=2)},
        *session["messages"],
    ]
    if out_of_questions:
        messages.append({
            "role": "system",
            "content": "Question limit reached. Record your best estimate for every open item and set question to null.",
        })

    completion = openai_client().chat.completions.create(
        model=MODEL,
        messages=messages,
        response_format={
            "type": "json_schema",
            "json_schema": {"name": "junk_quote", "strict": True, "schema": response_schema(remaining)},
        },
    )
    result = json.loads(completion.choices[0].message.content)
    apply_quote_update(session, result["quote"])
    reason = (result.get("review_reason") or "").strip()
    if reason and reason not in quote["model_review_reasons"]:
        quote["model_review_reasons"].append(reason)

    customer_text = normalize(" ".join([
        session["form"]["address"],
        session["form"]["notes"],
        *(m["content"] for m in session["messages"] if m["role"] == "user"),
    ]))
    for field in remaining:
        answer = (result.get("values") or {}).get(field) or {}
        value = clean_value(field, answer.get("value"))
        # A value only counts if it rests on something the customer really said.
        evidence = normalize(answer.get("evidence") or "")
        if value is not None and not out_of_questions and (not evidence or evidence not in customer_text):
            value = None
        session["variables"][field] = value
    if "hasElevator" in unsure and isinstance(session["variables"]["hasElevator"], bool) and quote["has_elevator"] == "unknown":
        quote["has_elevator"] = session["variables"]["hasElevator"]
    pending = [f for f in unsure if session["variables"][f] is None]

    if pending and out_of_questions:
        for field in pending:
            session["variables"][field] = FALLBACK_VALUES[field]
        session["defaulted"] = pending
        pending = []
    session["pending"] = pending
    apply_inferences(session)
    update_derived(session)

    question = None if out_of_questions else (result.get("question") or "").strip()
    topic = result.get("question_topic")
    options = [o.strip() for o in result.get("options") or [] if o.strip()][:4]
    if pending and not question:
        question, topic, options = FALLBACK_QUESTIONS[pending[0]], "form_field", []
    request_photos = bool(result.get("request_photos"))
    # The model may not end the chat while a required topic is still open.
    still_open = [] if out_of_questions else open_topics(session)
    if not question and still_open:
        topic = still_open[0]
        question, options, request_photos = topic_question(session, topic)
    # The final summary is always built from the quote state, so it shows
    # exactly what staff will get.
    if still_open == ["final_confirmation"] and (topic == "final_confirmation" or not question):
        topic = "final_confirmation"
        question, options, request_photos = topic_question(session, topic)
        if quote["confirmations_asked"]:
            question = "Thanks, I've updated that.\n\n" + question

    if question:
        if topic == "final_confirmation":
            quote["confirmations_asked"] += 1
        if topic and topic not in quote["asked_topics"]:
            quote["asked_topics"].append(topic)
        # The "Add photos" button is offered, but a typed answer still goes to this model.
        session["awaitingPhotos"] = request_photos and len(session["photos"]) < MAX_PHOTOS
        session["photoGate"] = False
        ask(session, question, options)
    else:
        finish(session)


def apply_quote_update(session: dict, update: dict) -> None:
    """Copy the model's changes into the quote state; null means no change."""
    quote = session["quote"]
    for key, value in update.items():
        if value is None:
            continue
        if key == "location_distribution":
            value = {d["location"]: d["percent"] for d in value} or None
        if key in (
            "additional_items_description", "items_not_to_remove", "heavy_material_details", "access_notes",
            "preparation_details",
        ):
            value = value.strip() or None
        quote[key] = value


def update_derived(session: dict) -> None:
    """Recompute everything that follows from the collected answers: working volume,
    truck fraction and pricing tier (which also sets loadSize), weight surcharge and
    manual review."""
    quote = session["quote"]
    volume = quote["final_working_volume_yd3"]
    if not isinstance(volume, (int, float)) or volume <= 0:
        volume = quote["ai_estimated_volume_yd3"]
    reasons = []
    if isinstance(volume, (int, float)) and volume > 0:
        fraction = volume / truck_capacity_yd3()
        quote["estimated_truck_fraction"] = round(fraction, 3)
        quote["pricing_tier"] = load_size_from_fraction(fraction)
        session["variables"]["loadSize"] = quote["pricing_tier"]
        session["pending"] = [f for f in session["pending"] if f != "loadSize"]
        if fraction > 1:
            reasons.append("more than one truckload")
    else:
        quote["estimated_truck_fraction"] = None
        quote["pricing_tier"] = None
        reasons.append("no volume estimate from photos")

    update_curbside(quote)
    if "no_truck_access" in quote["access_obstacles"]:
        reasons.append("no truck access")

    materials = set(quote["material_types"])
    if materials & HEAVY_MATERIALS:
        quote["contains_heavy_material"] = True
    # Weight pricing is for heavy materials only (paint or electronics aren't heavy).
    quote["weight_surcharge_required"] = bool(materials & HEAVY_MATERIALS) or (
        bool(quote["contains_heavy_material"]) and "other_heavy_material" in materials
    )
    if materials & SPECIAL_DISPOSAL:
        reasons.append("paint, chemicals or batteries need special disposal")

    for item in quote["heavy_items"]:
        # Rule-based, so it clears once the customer says two people can lift it.
        item["manual_review_required"] = item["liftability"] == "equipment_required" or (
            item["liftability"] == "unknown" and item["item_type"] in SPECIALTY_ITEMS
        )
        if item["manual_review_required"]:
            reasons.append(f"heavy item: {item.get('description') or label(item['item_type'])}")
    if quote["volume_estimate_confidence"] == "low":
        reasons.append("low-confidence volume estimate")
    if session["photosFlagged"]:
        reasons.append("photos accepted without passing the photo check")

    unique = {normalize(r): r for r in reversed(reasons + quote["model_review_reasons"])}
    quote["manual_review_reasons"] = list(reversed(unique.values()))
    quote["manual_review_required"] = bool(quote["manual_review_reasons"])


def save_photos(session: dict, data_urls: list[str]) -> None:
    """Store new photos next to the session file; reject anything that isn't a supported image."""
    if len(session["photos"]) + len(data_urls) > MAX_PHOTOS:
        raise HTTPException(status_code=400, detail=f"At most {MAX_PHOTOS} photos")
    folder = SESSIONS_DIR / session["sessionId"]
    folder.mkdir(parents=True, exist_ok=True)
    for url in data_urls:
        match = DATA_URL.fullmatch(url)
        if not match or match.group(1) not in PHOTO_TYPES:
            raise HTTPException(status_code=400, detail="Unsupported photo")
        name = f"{len(session['photos']) + 1}.{PHOTO_TYPES[match.group(1)]}"
        (folder / name).write_bytes(base64.b64decode(match.group(2)))
        session["photos"].append(name)
    session["quote"]["photos_uploaded"] = bool(session["photos"])


def photo_data_urls(session: dict) -> list[str]:
    folder = SESSIONS_DIR / session["sessionId"]
    mime = {ext: t for t, ext in PHOTO_TYPES.items()}
    return [
        f"data:{mime[name.rsplit('.', 1)[1]]};base64,"
        + base64.b64encode((folder / name).read_bytes()).decode()
        for name in session["photos"]
    ]


def apply_volume_estimate(session: dict, fraction, evidence) -> None:
    """Record the model's truck-fraction estimate as the primary volume estimate. The
    model already weighed the customer's own load size guess (if any) as context
    alongside the photos (see check_photos), so update_derived can move loadSize up
    or down from whatever the customer said, or decide it outright if they left it
    "Not sure"."""
    if not isinstance(fraction, (int, float)) or fraction <= 0:
        return
    session["estimatedVolumeFt3"] = round(fraction * truck_capacity_ft3(), 1)
    session["estimatedLoadSize"] = load_size_from_fraction(fraction)
    session["volumeEvidence"] = (evidence or "").strip() or None
    session["quote"]["ai_estimated_volume_yd3"] = round(fraction * truck_capacity_yd3(), 1)
    # New photos replace any earlier adjustment; the chat re-adjusts if needed.
    session["quote"]["final_working_volume_yd3"] = None


def apply_photo_findings(session: dict, result: dict) -> None:
    """Fill the quote state with what the photos show. Detected items are replaced on
    every check; materials and heavy items are merged so the customer's answers
    (e.g. liftability) aren't lost."""
    quote = session["quote"]
    apply_volume_estimate(session, result.get("estimatedTruckFraction"), result.get("volumeEvidence"))
    quote["volume_estimate_confidence"] = result["volumeConfidence"]
    quote["detected_items"] = result["detectedItems"]
    quote["item_detection_confidence"] = result["itemDetectionConfidence"]
    quote["material_types"] = list(dict.fromkeys(quote["material_types"] + result["materialTypes"]))
    known = {item["item_type"] for item in quote["heavy_items"]}
    quote["heavy_items"] += [item for item in result["heavyItems"] if item["item_type"] not in known]
    update_derived(session)


def check_photos(session: dict) -> None:
    """Ask the model whether all photos so far are good enough to estimate the volume."""
    session["photoChecks"] += 1
    form = session["form"]
    context = (
        "What the customer told us about the junk: "
        + (form["notes"].strip() or "(nothing)")
        + (f"\nTheir load size estimate: {form['loadSize']}" if form["loadSize"] else "")
    )
    completion = openai_client().chat.completions.create(
        model=PHOTO_MODEL,
        messages=[
            {"role": "system", "content": PHOTO_CHECK_PROMPT},
            {"role": "user", "content": [
                part
                for number, url in enumerate(photo_data_urls(session), start=1)
                for part in (
                    {"type": "text", "text": f"Photo {number}:"},
                    {"type": "image_url", "image_url": {"url": url}},
                )
            ] + [{"type": "text", "text": context}]},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {"name": "photo_check", "strict": True, "schema": PHOTO_CHECK_SCHEMA},
        },
    )
    result = json.loads(completion.choices[0].message.content)
    session["photoCheckLog"].append({"photos": len(session["photos"]), **result})
    session["goodPhotos"] = sorted({
        p["number"] for p in result["photos"] if p["good"] and 1 <= p["number"] <= len(session["photos"])
    })
    if result["usable"]:
        session["photosOk"] = True
        session["photoProblem"] = None
        apply_photo_findings(session, result)
    elif session["photosOk"]:
        # Extra photos added mid-chat didn't help; keep working from the earlier ones.
        pass
    elif session["photoChecks"] >= MAX_PHOTO_CHECKS or len(session["photos"]) >= MAX_PHOTOS:
        accept_photos_as_is(session)
    else:
        session["photoProblem"] = (result["message"] or "").strip() or PHOTO_RETRY


def accept_photos_as_is(session: dict) -> None:
    # Staff see "photosFlagged" in the session file and know to double-check.
    session["photosOk"] = True
    session["photosFlagged"] = True
    session["photoProblem"] = None
    update_derived(session)


def ask(session: dict, question: str, options: list[str] | None = None) -> None:
    session["done"] = False
    session["question"] = question
    session["options"] = options or []
    session["messages"].append({"role": "assistant", "content": question})


def advance(session: dict) -> None:
    """Ask for (better) photos until they're good enough, then let the quoting
    model ask whatever is still missing."""
    if not session["photos"] or not session["photosOk"]:
        session["awaitingPhotos"] = True
        session["photoGate"] = True
        ask(session, session["photoProblem"] or PHOTO_QUESTION)
    else:
        ask_model(session)


def finish(session: dict) -> None:
    session["awaitingPhotos"] = False
    session["photoGate"] = False
    session["done"] = True
    session["question"] = None
    session["options"] = []


def reply_about_photos(session: dict) -> None:
    """The customer typed instead of adding photos: answer them and ask again,
    or accept the photos they have if they say they can't take better ones."""
    completion = openai_client().chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": PHOTO_PROMPT}, *session["messages"]],
        response_format={
            "type": "json_schema",
            "json_schema": {"name": "photo_reply", "strict": True, "schema": PHOTO_REPLY_SCHEMA},
        },
    )
    result = json.loads(completion.choices[0].message.content)
    message = (result["message"] or "").strip()
    if result["acceptCurrentPhotos"] and session["photos"]:
        accept_photos_as_is(session)
        if message:
            session["messages"].append({"role": "assistant", "content": message})
        advance(session)
    else:
        ask(session, message or session["photoProblem"] or PHOTO_QUESTION)


def kept_photos(session: dict) -> list[int]:
    """Numbers (1-based, in upload order) of the photos to keep with the booking.
    If none was judged good, all are kept so staff still have something to see."""
    return session["goodPhotos"] or list(range(1, len(session["photos"]) + 1))


def label(value) -> str:
    return str(value).replace("_", " ")


def quote_summary(session: dict) -> str:
    """Plain-text summary of the quote state for staff, sent with the booking."""
    q = session["quote"]
    lines = []
    if q["manual_review_required"]:
        lines.append("MANUAL REVIEW: " + "; ".join(q["manual_review_reasons"]))
    if q["detected_items"]:
        items = ", ".join(f"{i['quantity']} × {i['item_type']}" for i in q["detected_items"])
        lines.append(f"Items{' (confirmed)' if q['items_confirmed'] else ''}: {items}")
    if q["additional_items_description"]:
        lines.append(f"Not in photos: {q['additional_items_description']}")
    if q["items_not_to_remove"]:
        lines.append(f"Keep (don't remove): {q['items_not_to_remove']}")
    if q["pricing_tier"]:
        volume = q["final_working_volume_yd3"] or q["ai_estimated_volume_yd3"]
        lines.append(
            f"Volume: ~{volume:g} yd³ → {q['pricing_tier']} "
            f"(photo confidence: {q['volume_estimate_confidence'] or 'n/a'}; "
            f"customer guess: {q['customer_load_estimate'] or 'not sure'})"
        )
    if [m for m in q["material_types"] if m not in ("normal_household", "none")]:
        lines.append("Materials: " + ", ".join(label(m) for m in q["material_types"]))
    if q["heavy_material_details"]:
        lines.append(f"Heavy material: {q['heavy_material_details']}")
    if q["weight_surcharge_required"]:
        lines.append("Weight surcharge: required (price by weight)")
    for item in q["heavy_items"]:
        weight = f", {item['estimated_weight']}" if item["estimated_weight"] else ""
        lines.append(
            f"Heavy item: {item['quantity']} × {item.get('description') or label(item['item_type'])}"
            f"{weight}, lift: {label(item['liftability'])}"
        )
    if q["item_locations"]:
        where = ", ".join(
            f"{label(loc)} {q['location_distribution'][loc]:g}%"
            if q["location_distribution"] and loc in q["location_distribution"] else label(loc)
            for loc in q["item_locations"]
        )
        lines.append(f"Location: {where}")
    if q["stairs_required"]:
        on_stairs = " (heavy items on stairs)" if q["heavy_items_on_stairs"] else ""
        lines.append(f"Stairs: {label(q['stair_flights'] or 'unknown')} flight(s){on_stairs}")
    if q["truck_parking_distance"]:
        lines.append(f"Truck parks: {METRES[q['truck_parking_distance']]}")
    obstacles = [o for o in q["access_obstacles"] if o != "none"]
    if obstacles:
        lines.append("Obstacles: " + ", ".join(label(o) for o in obstacles))
    if q["access_notes"]:
        lines.append(f"Access: {q['access_notes']}")
    prep = [p for p in q["preparation_needed"] if p != "ready"]
    if prep:
        details = f" ({q['preparation_details']})" if q["preparation_details"] else ""
        lines.append("Preparation: " + ", ".join(label(p) for p in prep) + details)
    if q["curbside_interest"] is not None:
        lines.append(f"Curbside option (save ~${q['curbside_savings']}): {'wants it' if q['curbside_interest'] else 'declined'}")
    if not q["final_confirmed"]:
        lines.append("Customer did NOT confirm the final summary")
    if q["property_type"]:
        lines.append(f"Property: {q['property_type']}")
    return "\n".join(lines)


def public_view(session: dict) -> dict:
    return {
        "sessionId": session["sessionId"],
        "done": session["done"],
        "question": session["question"],
        "options": session["options"],
        "awaitingPhotos": session["awaitingPhotos"],
        "keptPhotos": kept_photos(session),
        "variables": session["variables"],
        "quote": session["quote"],
        "quoteSummary": quote_summary(session) if session["done"] else None,
    }


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/sessions")
def start_session(body: StartRequest):
    form = body.form.model_dump()
    unsure = list(dict.fromkeys(body.unsure))
    variables = {**form, **{f: None for f in unsure}}
    session = {
        "sessionId": uuid.uuid4().hex,
        "createdAt": now(),
        "model": MODEL,
        "form": form,
        "unsure": unsure,
        "variables": variables,
        "quote": new_quote_state(form, unsure),
        "pending": unsure,
        "defaulted": [],
        "photos": [],
        "photoChecks": 0,
        "photoCheckLog": [],
        "goodPhotos": [],
        "photosOk": False,
        "photosFlagged": False,
        "photoProblem": None,
        "estimatedVolumeFt3": None,
        "estimatedLoadSize": None,
        "volumeEvidence": None,
        # awaitingPhotos shows the "Add photos" button; photoGate means photos are
        # required before the chat can go on, so typed answers go to reply_about_photos.
        "awaitingPhotos": False,
        "photoGate": False,
        "messages": [],
        "question": None,
        "options": [],
        "done": False,
    }
    if body.photos:
        save_photos(session, body.photos)
        check_photos(session)
    advance(session)
    save_session(session)
    return public_view(session)


@app.post("/sessions/{session_id}/answers")
def answer(session_id: str, body: AnswerRequest):
    session = load_session(session_id)
    if session["done"]:
        raise HTTPException(status_code=409, detail="Session already complete")
    session["messages"].append({"role": "user", "content": body.answer.strip()})
    if session["photoGate"]:
        reply_about_photos(session)
    else:
        ask_model(session)
    save_session(session)
    return public_view(session)


@app.post("/sessions/{session_id}/photos")
def photos(session_id: str, body: PhotosRequest):
    session = load_session(session_id)
    if not session["awaitingPhotos"]:
        raise HTTPException(status_code=409, detail="Not waiting for photos")
    save_photos(session, body.photos)
    session["messages"].append({"role": "user", "content": f"[Added {len(body.photos)} photo(s)]"})
    check_photos(session)
    advance(session)
    save_session(session)
    return public_view(session)
