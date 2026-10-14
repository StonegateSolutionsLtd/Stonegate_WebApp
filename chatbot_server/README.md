# Junk removal chat server

Python (FastAPI) service behind the "Not sure" answers on the junk removal
form (`/book-service`).

1. The form is posted here (via the Next route `app/api/service-chat`).
2. It is saved as variables in `data/sessions/<sessionId>.txt` (JSON).
3. For each field marked "Not sure" (load size, floor, elevator), OpenAI
   decides the value from what the customer wrote, or asks one question at a
   time until it can.
4. If no photos were added on the form, it then asks for some. The customer
   adds them with the "Add photos" button in the chat, or skips.
5. When everything is filled in, the request (with photos) is submitted to
   `/api/service-requests`.

Photos never reach this server; it only records how many were added or that
the customer skipped. They are stored by the Next route: in local dev without
Supabase in `data/service-orders/<orderId>/`, otherwise in the private
`service-order-photos` Storage bucket (see migration 013).

OpenAI is only called for "Not sure" fields, or when the customer types a
message instead of adding photos.

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
