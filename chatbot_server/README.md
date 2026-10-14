# Junk removal chat server

Python (FastAPI) service behind the "Not sure" answers on the junk removal
form (`/book-service`).

1. The form is posted here (via the Next route `app/api/service-chat`).
2. It is saved as variables in `data/sessions/<sessionId>.txt` (JSON).
3. For each field marked "Not sure" (load size, floor, elevator), OpenAI
   decides the value from what the customer wrote, or asks one question at a
   time until it can.
4. At least one photo of the junk is required. OpenAI (`OPENAI_PHOTO_MODEL`)
   checks that the photos are good enough to estimate the volume; if not, the
   chat says what's wrong and the customer adds new photos with the
   "Add photos" button. After 3 failed checks, 6 photos, or the customer
   saying they can't take better ones, the photos are accepted as they are
   and `photosFlagged` is set in the session file for staff.
5. When everything is filled in, the request (with photos) is submitted to
   `/api/service-requests`.

Photos are kept next to the session file (`data/sessions/<sessionId>/`) and
`photoCheckLog` records each check. The booking's own copy is stored by the
Next route: in local dev without Supabase in `data/service-orders/<orderId>/`,
otherwise in the private `service-order-photos` Storage bucket (migration 013).

## Run locally

```powershell
cd chatbot_server
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
copy .env.example .env      # then put your OPENAI_API_KEY in .env
.venv\Scripts\uvicorn main:app --port 8000
```

Then start Next as usual (`npm run dev`). Next reaches the server at
`http://127.0.0.1:8000` by default; set `CHATBOT_SERVER_URL` in `.env.local`
to change it.

Session files contain customer contact details and are git-ignored.
