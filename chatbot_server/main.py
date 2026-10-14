"""Junk removal chat server.

Takes the junk removal form from /book-service, saves it as variables in a
per-session .txt file (JSON), and for every field the customer marked
"Not sure" uses OpenAI to ask follow-up questions one at a time until each
value is decided. If no photos of the junk were added on the form, the chat
then asks for some (the customer may skip).

Run:  uvicorn main:app --port 8000   (from this directory)
"""

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
SESSIONS_DIR = Path(os.getenv("SESSIONS_DIR", Path(__file__).parent / "data" / "sessions"))
# After this many questions the model must commit to its best estimate.
MAX_QUESTIONS = 8

# Same labels as TRUCK_FRACTIONS in lib/quote-pricing.ts.
LOAD_SIZES = ["1/8 Truck", "1/4 Truck", "1/2 Truck", "3/4 Truck", "Full Truck"]
UnsureField = Literal["loadSize", "floor", "hasElevator"]

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

# Asked last, when the form had no photos. The button names match the chat UI.
PHOTO_QUESTION = (
    "Could you add a few photos of the junk, ideally from different angles? "
    "They help our team see exactly what needs to go and give you an accurate quote. "
    'Use the "Add photos" button below, or "Skip" if you can\'t right now.'
)

PHOTO_PROMPT = """\
You help Stonegate Moving Solutions (Burnaby, BC) complete a junk removal
booking. The customer was asked to add photos of their junk, but wrote a
message instead. Reply in at most three short sentences:
- If they asked something, answer briefly and honestly. Photos help the team
  see exactly what needs to be removed, how much there is and how hard it is
  to reach, so the quote is accurate. For anything you can't answer (exact
  prices, availability, which items we accept), say the team will follow up
  after the booking.
- Then ask again for photos, ideally from different angles, using the
  "Add photos" button below the chat, or "Skip" if they can't take any now.
- Never pressure them; skipping is fine.
"""

SYSTEM_PROMPT = """\
You help Stonegate Moving Solutions (Burnaby, BC) complete a junk removal
booking. The customer filled in a booking form but marked some fields as
"Not sure". Using everything they have told us (the form, their notes and
their chat answers), decide the best value for each of those fields.

Field meanings:
- loadSize: one of 1/8 Truck, 1/4 Truck, 1/2 Truck, 3/4 Truck, Full Truck.
  How much of our junk removal truck the items will fill. Rough guide: a
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


class StartRequest(BaseModel):
    form: ServiceForm
    unsure: list[UnsureField] = Field(default_factory=list)
    photoCount: int = Field(default=0, ge=0, le=20)


class AnswerRequest(BaseModel):
    answer: str = Field(min_length=1, max_length=1000)


class PhotosRequest(BaseModel):
    # 0 = the customer skipped adding photos.
    count: int = Field(ge=0, le=20)


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
    """Let the model fill in what it can and pick the next question; updates session in place."""
    unsure = session["unsure"]
    form_for_model = {k: v for k, v in session["form"].items() if k not in unsure}
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": "Junk removal booking form (fields the customer was sure about):\n"
            + json.dumps(form_for_model, indent=2)
            + "\n\nFields marked \"Not sure\": "
            + ", ".join(unsure),
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
            "json_schema": {"name": "junk_fields", "strict": True, "schema": response_schema(unsure)},
        },
    )
    result = json.loads(completion.choices[0].message.content)

    customer_text = normalize(" ".join([
        session["form"]["address"],
        session["form"]["notes"],
        *(m["content"] for m in session["messages"] if m["role"] == "user"),
    ]))
    for field in unsure:
        answer = result["values"].get(field) or {}
        value = clean_value(field, answer.get("value"))
        # A value only counts if it rests on something the customer really said.
        evidence = normalize(answer.get("evidence") or "")
        if value is not None and not out_of_questions and (not evidence or evidence not in customer_text):
            value = None
        session["variables"][field] = value
    pending = [f for f in unsure if session["variables"][f] is None]

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


def ask(session: dict, question: str) -> None:
    session["done"] = False
    session["question"] = question
    session["messages"].append({"role": "assistant", "content": question})


def advance(session: dict) -> None:
    """Every field is decided: ask for photos if there are none yet, else finish."""
    if session["photoCount"] == 0 and not session["photosSkipped"]:
        session["awaitingPhotos"] = True
        ask(session, PHOTO_QUESTION)
    else:
        session["awaitingPhotos"] = False
        session["done"] = True
        session["question"] = None


def reply_about_photos(session: dict) -> None:
    """The customer typed instead of adding photos: answer them and ask again."""
    completion = openai_client().chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": PHOTO_PROMPT}, *session["messages"]],
    )
    question = (completion.choices[0].message.content or "").strip() or PHOTO_QUESTION
    ask(session, question)


def public_view(session: dict) -> dict:
    return {
        "sessionId": session["sessionId"],
        "done": session["done"],
        "question": session["question"],
        "awaitingPhotos": session["awaitingPhotos"],
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
        "photoCount": body.photoCount,
        "photosSkipped": False,
        "awaitingPhotos": False,
        "messages": [],
        "question": None,
        "done": False,
    }
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
    else:
        ask_model(session)
    save_session(session)
    return public_view(session)


@app.post("/sessions/{session_id}/photos")
def photos(session_id: str, body: PhotosRequest):
    session = load_session(session_id)
    if not session["awaitingPhotos"]:
        raise HTTPException(status_code=409, detail="Not waiting for photos")
    session["photoCount"] = body.count
    session["photosSkipped"] = body.count == 0
    note = f"[Added {body.count} photo(s)]" if body.count else "[Skipped adding photos]"
    session["messages"].append({"role": "user", "content": note})
    advance(session)
    save_session(session)
    return public_view(session)
