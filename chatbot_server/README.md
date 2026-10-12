# Order chat server

Python (FastAPI) service behind the "Not sure" answers on `/order`.

1. The booking form is posted here (via the Next route `app/api/order-chat`).
2. It is saved as variables in `data/sessions/<sessionId>.txt` (JSON).
3. For each field marked "Not sure", OpenAI decides the value from what the
   customer wrote, or asks one question at a time until it can.
4. When everything is filled in, the form continues to `/order/confirm`.

If nothing was marked "Not sure", no OpenAI call is made.

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
