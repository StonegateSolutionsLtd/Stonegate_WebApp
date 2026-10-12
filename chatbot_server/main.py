"""Order chat server.

Takes the booking form from /order, saves it as variables in a per-session
.txt file (JSON), and for every field the customer marked "Not sure" uses
OpenAI to ask follow-up questions one at a time until each value is decided.

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

APARTMENT_SIZES = ["studio", "1br", "2br", "3br", "4br+"]
UnsureField = Literal["pickupFloor", "pickupHasElevator", "dropoffFloor", "dropoffHasElevator", "apartmentSize"]

FIELD_SCHEMAS = {
    "pickupFloor": {"type": ["integer", "null"]},
    "dropoffFloor": {"type": ["integer", "null"]},
    "pickupHasElevator": {"type": ["boolean", "null"]},
    "dropoffHasElevator": {"type": ["boolean", "null"]},
    "apartmentSize": {"anyOf": [{"type": "string", "enum": APARTMENT_SIZES}, {"type": "null"}]},
}

# Used only if the model still can't decide after MAX_QUESTIONS; recorded in
# the session file under "defaulted" so staff know to double-check.
FALLBACK_VALUES = {
    "pickupFloor": 1,
    "dropoffFloor": 1,
    "pickupHasElevator": False,
    "dropoffHasElevator": False,
    "apartmentSize": "2br",
}

# Asked when a field is still open but the model offered no question (usually
# because its guess was discarded for lack of evidence).
FALLBACK_QUESTIONS = {
    "pickupFloor": "Which floor is your current home on?",
    "dropoffFloor": "Which floor is your new home on?",
    "pickupHasElevator": "Is there an elevator we can use at the pickup address?",
    "dropoffHasElevator": "Is there an elevator we can use at the drop-off address?",
    "apartmentSize": "How many bedrooms does your current home have, and is it fully furnished?",
}

SYSTEM_PROMPT = """\
You help Stonegate Moving Solutions (Burnaby, BC) complete a moving booking.
The customer filled in a booking form but marked some fields as "Not sure".
Using everything they have told us (the form, their special notes and their
chat answers), decide the best value for each of those fields.

Field meanings:
- pickupFloor / dropoffFloor: integer 1-50. Floor of the unit, 1 = ground
  level. For a multi-storey house, use the number of storeys belongings must
  be carried across (a 2-storey house = 2).
- pickupHasElevator / dropoffHasElevator: true only if an elevator can be used
  for the move. Houses and townhouses are false.
- apartmentSize: one of studio, 1br, 2br, 3br, 4br+. Pick the size whose
  amount of belongings best matches what the customer is moving, even if the
  home is not an apartment (e.g. a 2-bedroom house with a full garage -> 3br).

Why we ask (use this when the customer asks why something matters):
- Floors and elevators decide how long carrying takes. Stairs and long
  elevator rides add labour time, so they affect the crew size and the price.
- Apartment size tells us how much there is to move, which decides the truck
  size, how many movers to send and how long to reserve.
- Everything is only used to plan the move and prepare an accurate quote; the
  team confirms the final price with the customer before the move.

Rules:
- Infer a value whenever something the customer actually said supports it
  instead of asking (e.g. "detached house" -> no elevator). Never guess: if
  they have said nothing about a field (e.g. nothing about bedrooms or how
  much they own for apartmentSize), it stays null.
- If the customer asks you something instead of answering (why it matters,
  what a term means, whether a guess is fine), first answer it briefly and
  honestly in one or two sentences, then ask your question again, ideally
  reworded to be easier to answer. Both go in "question", as one message.
- For questions you can't answer from the information above (exact prices,
  availability, special services), say the team will follow up after the
  booking, then continue. Never ignore a question from the customer. Example:
  customer: "how much will it cost?" -> "Our team will send you an exact
  quote after you book. To make it accurate: is it a house or an apartment?"
- If the customer simply didn't answer your last question, ask it again.
- For every value you fill in, set evidence to the exact words the customer
  wrote that support it, copied verbatim (a short phrase). Values without
  real evidence are discarded.
- If anything is still null, ask exactly ONE short, friendly question about
  the most important unknown. Ask about things the customer knows ("Is it a
  house or an apartment building?", "How many bedrooms, and is it fully
  furnished?"), not for the technical value itself.
- If an answer is vague or contradictory, ask a follow-up question.
- When every value is filled in, question must be null.
- Only collect these fields. Never change or ask about anything else.
"""


class OrderForm(BaseModel):
    pickupAddress: str = Field(max_length=300)
    pickupFloor: int
    pickupHasElevator: bool
    dropoffAddress: str = Field(max_length=300)
    dropoffFloor: int
    dropoffHasElevator: bool
    apartmentSize: str
    movingDate: str
    movingTime: str
    customerName: str = Field(max_length=200)
    customerEmail: str = Field(max_length=200)
    phone: str = Field(max_length=50)
    specialNotes: str = Field(max_length=2000)


class StartRequest(BaseModel):
    form: OrderForm
    unsure: list[UnsureField] = Field(default_factory=list)


class AnswerRequest(BaseModel):
    answer: str = Field(min_length=1, max_length=1000)


app = FastAPI(title="Stonegate order chat")
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
    if field in ("pickupFloor", "dropoffFloor"):
        return value if isinstance(value, int) and not isinstance(value, bool) and 1 <= value <= 50 else None
    if field in ("pickupHasElevator", "dropoffHasElevator"):
        return value if isinstance(value, bool) else None
    if field == "apartmentSize":
        return value if value in APARTMENT_SIZES else None
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
            "content": "Booking form (fields the customer was sure about):\n"
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
            "json_schema": {"name": "order_fields", "strict": True, "schema": response_schema(unsure)},
        },
    )
    result = json.loads(completion.choices[0].message.content)

    customer_text = normalize(" ".join([
        session["form"]["pickupAddress"],
        session["form"]["dropoffAddress"],
        session["form"]["specialNotes"],
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
    session["done"] = not pending
    session["question"] = None if session["done"] else question
    if session["question"]:
        session["messages"].append({"role": "assistant", "content": session["question"]})


def public_view(session: dict) -> dict:
    return {
        "sessionId": session["sessionId"],
        "done": session["done"],
        "question": session["question"],
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
        "messages": [],
        "question": None,
        "done": not unsure,
    }
    if unsure:
        ask_model(session)
    save_session(session)
    return public_view(session)


@app.post("/sessions/{session_id}/answers")
def answer(session_id: str, body: AnswerRequest):
    session = load_session(session_id)
    if session["done"]:
        raise HTTPException(status_code=409, detail="Session already complete")
    session["messages"].append({"role": "user", "content": body.answer.strip()})
    ask_model(session)
    save_session(session)
    return public_view(session)
