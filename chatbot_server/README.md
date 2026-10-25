# Junk removal chat server

Python (FastAPI) service behind the quoting chat on the junk removal form
(`/book-service`). The chat opens for every booking, not only when a field is
marked "Not sure", and asks whatever is still unknown for the quote.

1. The form is posted here (via the Next route `app/api/service-chat`).
2. It is saved as variables in `data/sessions/<sessionId>.txt` (JSON).
3. At least one photo of the junk is required. OpenAI (`OPENAI_PHOTO_MODEL`)
   checks that the photos are good enough to estimate the volume; if not, the
   chat says what's wrong and the customer adds new photos with the
   "Add photos" button. After 3 failed checks, 6 photos, or the customer
   saying they can't take better ones, the photos are accepted as they are
   and `photosFlagged` is set in the session file for staff. The same check
   lists the items, materials and heavy objects it sees and how confident its
   volume estimate is.
4. Everything goes into a structured quote state (`quote` in the session
   file, see `new_quote_state` in `main.py`): property, photo completeness,
   detected items, volume and pricing tier, materials, heavy items, location
   and stairs. The quoting assistant (`SYSTEM_PROMPT`) asks, one at a time,
   only what is still unknown and would change the quote, and also decides
   any field marked "Not sure" (load size; the elevator, which the form only
   asks for apartments). Property type comes from the form and is never
   asked in the chat; stairs are asked there only when they're plausible. The photo volume
   estimate is primary; the customer's own load size is only a hint.
   `manual_review_required` is set for equipment-only or unclear specialty
   items, special-disposal materials, low-confidence volumes and flagged
   photos.
5. When everything is filled in, the request (with photos) is submitted to
   `/api/service-requests`, with a plain-text summary of the quote state
   appended to the notes for staff.

Photos are kept next to the session file (`data/sessions/<sessionId>/`) and
`photoCheckLog` records each check. The booking's own copy is stored by the
Next route: in local dev without Supabase in `data/service-orders/<orderId>/`,
otherwise in the private `service-order-photos` Storage bucket (migration 013).

## Run locally

```powershell
cd chatbot_server
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\uvicorn main:app --port 8000
```

The server reads its settings from the root `.env.local` (shared with Next):
add `OPENAI_API_KEY` there. `OPENAI_MODEL` (default `gpt-4.1-mini`) and
`OPENAI_PHOTO_MODEL` (default `gpt-4.1`) are optional overrides. A
`chatbot_server/.env` still works and fills in anything `.env.local` doesn't
set.

Then start Next as usual (`npm run dev`). Next reaches the server at
`http://127.0.0.1:8000` by default; set `CHATBOT_SERVER_URL` in `.env.local`
to change it.

Session files contain customer contact details and are git-ignored.
