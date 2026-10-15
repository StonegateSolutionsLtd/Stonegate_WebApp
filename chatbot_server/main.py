"""Junk removal chat server.

Takes the junk removal form from /book-service, saves it as variables in a
per-session .txt file (JSON), and for every field the customer marked
"Not sure" uses OpenAI to ask follow-up questions one at a time until each
value is decided. Photos of the junk are required: the model checks they are
good enough to estimate the volume and, if not, explains what's wrong and
asks for new or more photos.

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
from openai import OpenAI
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).with_name(".env"))

MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
# Checks the customer's photos.
PHOTO_MODEL = os.getenv("OPENAI_PHOTO_MODEL", "gpt-4.1")
SESSIONS_DIR = Path(os.getenv("SESSIONS_DIR", Path(__file__).parent / "data" / "sessions"))
# After this many questions the model must commit to its best estimate.
MAX_QUESTIONS = 8
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
UnsureField = Literal["loadSize", "floor", "hasElevator"]

# Load cabin dimensions by truck type; keyed so more trucks can be added later.
TRUCKS = {"standard": {"length_ft": 16, "width_ft": 7.5, "height_ft": 6.5}}


def truck_capacity_ft3(truck: str = "standard") -> float:
    t = TRUCKS[truck]
    return t["length_ft"] * t["width_ft"] * t["height_ft"]


def load_size_from_fraction(fraction: float) -> str:
    """Smallest LOAD_SIZES bucket at or above the fraction: we'd rather send a
    bigger truck/crew than under-quote, so this rounds up, never to nearest."""
    for label in LOAD_SIZES:
        if fraction <= LOAD_SIZE_FRACTIONS[label] + 1e-9:
            return label
    return LOAD_SIZES[-1]


FIELD_SCHEMAS = {
    "loadSize": {"anyOf": [{"type": "string", "enum": LOAD_SIZES}, {"type": "null"}]},
    "floor": {"type": ["integer", "null"]},
    "hasElevator": {"type": ["boolean", "null"]},
}

# Used only if the model still can't decide after MAX_QUESTIONS; recorded in
# the session file under "defaulted" so staff know to double-check.
FALLBACK_VALUES = {
    "loadSize": "1/4 Truck",
    "floor": 1,
    "hasElevator": False,
}

# Asked when a field is still open but the model offered no question (usually
# because its guess was discarded for lack of evidence).
FALLBACK_QUESTIONS = {
    "loadSize": "What items do you need removed, and roughly how many?",
    "floor": "Where is the junk right now: on the ground floor, in a garage or at the curb, or upstairs or in a basement?",
    "hasElevator": "Is there an elevator we can use to bring the junk down?",
}

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

If usable, also check for anything in the photos that might not actually be
meant for removal: junk sitting on or in a shelf, dresser, cabinet or other
furniture piece that could itself be a keeper; or one item that stands out
from the rest (noticeably newer, cleaner or more valuable-looking) as if it
might not belong with the junk. If you see something like that AND the
customer's own notes haven't already said what to keep or confirmed
everything goes, write itemsToConfirm: a short, friendly question naming the
specific item(s) and asking whether they should be removed too or kept. If
nothing like that stands out, or the notes already cover it, itemsToConfirm
is null — don't ask just to be safe, and don't ask again about something
already answered.
"""

PHOTO_CHECK_SCHEMA = {
    "type": "object",
    "properties": {
        "visible": {"type": "string"},
        "photos": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"number": {"type": "integer"}, "good": {"type": "boolean"}},
                "required": ["number", "good"],
                "additionalProperties": False,
            },
        },
        "usable": {"type": "boolean"},
        "message": {"type": ["string", "null"]},
        "estimatedTruckFraction": {"type": ["number", "null"]},
        "volumeEvidence": {"type": ["string", "null"]},
        "itemsToConfirm": {"type": ["string", "null"]},
    },
    "required": [
        "visible", "photos", "usable", "message", "estimatedTruckFraction", "volumeEvidence", "itemsToConfirm",
    ],
    "additionalProperties": False,
}

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

PHOTO_REPLY_SCHEMA = {
    "type": "object",
    "properties": {"acceptCurrentPhotos": {"type": "boolean"}, "message": {"type": ["string", "null"]}},
    "required": ["acceptCurrentPhotos", "message"],
    "additionalProperties": False,
}

SYSTEM_PROMPT = """\
You help Stonegate Moving Solutions (Burnaby, BC) complete a junk removal
booking. The customer filled in a booking form but marked some fields as
"Not sure". Using everything they have told us (the form, their notes and
their chat answers), decide the best value for each of those fields.

Field meanings:
- loadSize: one of 1/8 Truck, 1/4 Truck, 1/2 Truck, 3/4 Truck, Full Truck.
  How much of our junk removal truck the items will fill. The truck box is
  16 ft long, 7.5 ft wide and 6.5 ft high (about 780 ft³); a couch, a
  mattress, a dresser and about a dozen boxes fill half of it. Rough guide: a
  few small items or bags -> 1/8; a couch or mattress plus some boxes ->
  1/4; the contents of a full room or a small garage clean-out -> 1/2;
  several rooms -> 3/4; a whole home, basement or large garage -> Full.
- floor: integer 1-50. The floor the junk is on, 1 = ground level. Junk in a
  garage, yard, driveway or at the curb is 1. A basement or an upper floor
  means stairs: use the number of floors it must be carried across (a
  basement or a 2nd floor = 2).
- hasElevator: true only if an elevator can be used to bring the junk down.
  Houses, townhouses and anything on the ground floor are false.

Why we ask (use this when the customer asks why something matters):
- Load size decides how much truck space and disposal we need, which is the
  main part of the price.
- Floors and elevators decide how long carrying takes. Stairs add labour
  time, so they affect the crew size and the price.
- Everything is only used to plan the job and prepare an accurate quote; the
  team confirms the final price with the customer before the job.

Rules:
- Infer a value whenever something the customer actually said supports it
  instead of asking (e.g. "it's all in the garage" -> floor 1, no elevator;
  "an old couch and a mattress" -> 1/4 Truck). Never guess: if they have said
  nothing about a field (e.g. nothing about what or how much they are
  throwing out for loadSize), it stays null.
- If the customer asks you something instead of answering (why it matters,
  what a term means, whether a guess is fine), first answer it briefly and
  honestly in one or two sentences, then ask your question again, ideally
  reworded to be easier to answer. Both go in "question", as one message.
- For questions you can't answer from the information above (exact prices,
  availability, which items we accept, special services), say the team will
  follow up after the booking, then continue. Never ignore a question from
  the customer. Example: customer: "how much will it cost?" -> "Our team will
  send you an exact quote after you book. To make it accurate: what items do
  you need removed?"
- If the customer simply didn't answer your last question, ask it again.
- For every value you fill in, set evidence to the exact words the customer
  wrote that support it, copied verbatim (a short phrase). Values without
  real evidence are discarded.
- If anything is still null, ask exactly ONE short, friendly question about
  the most important unknown. Ask about things the customer knows ("What
  items do you need removed?", "Is the junk in a garage, a basement or an
  apartment?"), not for the technical value itself.
- If an answer is vague or contradictory, ask a follow-up question.
- When every value is filled in, question must be null.
- Only collect these fields. Never change or ask about anything else.
"""


class ServiceForm(BaseModel):
    address: str = Field(max_length=300)
    date: str
    time: str
    customerName: str = Field(max_length=200)
    customerEmail: str = Field(max_length=200)
    phone: str = Field(max_length=50)
    notes: str = Field(max_length=2000)
    loadSize: str
    floor: int
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


def openai_client() -> OpenAI:
    # Created on first use so the server still starts (and serves forms with
    # nothing marked "Not sure") when no API key is configured.
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
    if field == "floor":
        return value if isinstance(value, int) and not isinstance(value, bool) and 1 <= value <= 50 else None
    if field == "hasElevator":
        return value if isinstance(value, bool) else None
    if field == "loadSize":
        return value if value in LOAD_SIZES else None
    return None


def normalize(text: str) -> str:
    return " ".join(re.sub(r"[^\w\s]", " ", text.lower()).split())


def response_schema(fields: list[str]) -> dict:
    return {
        "type": "object",
        "properties": {
            "values": {
                "type": "object",
                "properties": {
                    f: {
                        "type": "object",
                        "properties": {"value": FIELD_SCHEMAS[f], "evidence": {"type": ["string", "null"]}},
                        "required": ["value", "evidence"],
                        "additionalProperties": False,
                    }
                    for f in fields
                },
                "required": fields,
                "additionalProperties": False,
            },
            "question": {"type": ["string", "null"]},
        },
        "required": ["values", "question"],
        "additionalProperties": False,
    }


def ask_model(session: dict) -> None:
    """Let the model fill in what it can and pick the next question; updates session in place.
    Fields already decided (e.g. loadSize from a photo volume estimate) aren't re-asked."""
    unsure = session["unsure"]
    remaining = [f for f in unsure if session["variables"][f] is None]
    if not remaining:
        advance(session)
        return
    form_for_model = {k: v for k, v in session["form"].items() if k not in unsure}
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": "Junk removal booking form (fields the customer was sure about):\n"
            + json.dumps(form_for_model, indent=2)
            + "\n\nFields marked \"Not sure\": "
            + ", ".join(remaining),
        },
        *session["messages"],
    ]
    questions_asked = sum(1 for m in session["messages"] if m["role"] == "assistant")
    out_of_questions = questions_asked >= MAX_QUESTIONS
    if out_of_questions:
        messages.append({
            "role": "system",
            "content": "Question limit reached. Give your best estimate for every field and set question to null.",
        })

    completion = openai_client().chat.completions.create(
        model=MODEL,
        messages=messages,
        response_format={
            "type": "json_schema",
            "json_schema": {"name": "junk_fields", "strict": True, "schema": response_schema(remaining)},
        },
    )
    result = json.loads(completion.choices[0].message.content)

    customer_text = normalize(" ".join([
        session["form"]["address"],
        session["form"]["notes"],
        *(m["content"] for m in session["messages"] if m["role"] == "user"),
    ]))
    for field in remaining:
        answer = result["values"].get(field) or {}
        value = clean_value(field, answer.get("value"))
        # A value only counts if it rests on something the customer really said.
        evidence = normalize(answer.get("evidence") or "")
        if value is not None and not out_of_questions and (not evidence or evidence not in customer_text):
            value = None
        session["variables"][field] = value
    pending = [f for f in remaining if session["variables"][f] is None]

    if pending and out_of_questions:
        for field in pending:
            session["variables"][field] = FALLBACK_VALUES[field]
        session["defaulted"] = pending
        pending = []

    question = (result.get("question") or "").strip()
    if pending and not question:
        question = FALLBACK_QUESTIONS[pending[0]]

    session["pending"] = pending
    if pending:
        ask(session, question)
    else:
        advance(session)


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


def photo_data_urls(session: dict) -> list[str]:
    folder = SESSIONS_DIR / session["sessionId"]
    mime = {ext: t for t, ext in PHOTO_TYPES.items()}
    return [
        f"data:{mime[name.rsplit('.', 1)[1]]};base64,"
        + base64.b64encode((folder / name).read_bytes()).decode()
        for name in session["photos"]
    ]


def apply_volume_estimate(session: dict, fraction, evidence) -> None:
    """Record the model's truck-fraction estimate and use it for loadSize. The model
    already weighed the customer's own load size guess (if any) as context alongside
    the photos (see check_photos), so this can move loadSize up or down from whatever
    the customer said, or decide it outright if they left it "Not sure"."""
    if not isinstance(fraction, (int, float)) or fraction <= 0:
        return
    photo_load_size = load_size_from_fraction(fraction)
    session["estimatedVolumeFt3"] = round(fraction * truck_capacity_ft3(), 1)
    session["estimatedLoadSize"] = photo_load_size
    session["volumeEvidence"] = (evidence or "").strip() or None
    session["variables"]["loadSize"] = photo_load_size
    if "loadSize" in session["pending"]:
        session["pending"] = [f for f in session["pending"] if f != "loadSize"]


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
        apply_volume_estimate(session, result.get("estimatedTruckFraction"), result.get("volumeEvidence"))
        if not session["itemsAsked"]:
            session["itemsQuestion"] = (result.get("itemsToConfirm") or "").strip() or None
    elif session["photoChecks"] >= MAX_PHOTO_CHECKS or len(session["photos"]) >= MAX_PHOTOS:
        accept_photos_as_is(session)
    else:
        session["photosOk"] = False
        session["photoProblem"] = (result["message"] or "").strip() or PHOTO_RETRY


def accept_photos_as_is(session: dict) -> None:
    # Staff see "photosFlagged" in the session file and know to double-check.
    session["photosOk"] = True
    session["photosFlagged"] = True
    session["photoProblem"] = None


def ask(session: dict, question: str) -> None:
    session["done"] = False
    session["question"] = question
    session["messages"].append({"role": "assistant", "content": question})


def advance(session: dict) -> None:
    """Every field is decided: ask for (better) photos if needed, then once about any
    items the photos suggest might not be junk, else finish."""
    if not session["photos"]:
        session["awaitingPhotos"] = True
        ask(session, PHOTO_QUESTION)
    elif not session["photosOk"]:
        session["awaitingPhotos"] = True
        ask(session, session["photoProblem"])
    elif session["itemsQuestion"] and not session["itemsAsked"]:
        session["awaitingPhotos"] = False
        session["itemsAsked"] = True
        session["awaitingItemsAnswer"] = True
        ask(session, session["itemsQuestion"])
    else:
        session["awaitingPhotos"] = False
        session["done"] = True
        session["question"] = None


def handle_items_answer(session: dict, answer: str) -> None:
    """Fold the customer's answer about what to keep into the booking notes for staff."""
    session["awaitingItemsAnswer"] = False
    notes = session["variables"].get("notes") or ""
    note = f'Items to keep (not remove) — customer said: "{answer}"'
    session["variables"]["notes"] = (notes + "\n\n" + note).strip() if notes else note
    advance(session)


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


def public_view(session: dict) -> dict:
    return {
        "sessionId": session["sessionId"],
        "done": session["done"],
        "question": session["question"],
        "awaitingPhotos": session["awaitingPhotos"],
        "keptPhotos": kept_photos(session),
        "variables": session["variables"],
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
        "itemsQuestion": None,
        "itemsAsked": False,
        "awaitingItemsAnswer": False,
        "awaitingPhotos": False,
        "messages": [],
        "question": None,
        "done": False,
    }
    if body.photos:
        save_photos(session, body.photos)
        check_photos(session)
    if unsure:
        ask_model(session)
    else:
        advance(session)
    save_session(session)
    return public_view(session)


@app.post("/sessions/{session_id}/answers")
def answer(session_id: str, body: AnswerRequest):
    session = load_session(session_id)
    if session["done"]:
        raise HTTPException(status_code=409, detail="Session already complete")
    session["messages"].append({"role": "user", "content": body.answer.strip()})
    if session["awaitingPhotos"]:
        reply_about_photos(session)
    elif session["awaitingItemsAnswer"]:
        handle_items_answer(session, body.answer.strip())
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
