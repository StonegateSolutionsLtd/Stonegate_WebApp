import { NextResponse, type NextRequest } from 'next/server'
import type { OrderChatReply, OrderChatRequest } from '@/lib/order-chat'

// The Python chat server (chatbot_server/) runs alongside Next and is never
// exposed to the browser directly.
const CHATBOT_SERVER_URL = process.env.CHATBOT_SERVER_URL ?? 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
  let body: OrderChatRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  let path: string
  let payload: unknown
  if (body.action === 'start') {
    path = '/sessions'
    payload = { form: body.form, unsure: body.unsure }
  } else if (body.action === 'answer' && /^[0-9a-f]{32}$/.test(body.sessionId ?? '')) {
    path = `/sessions/${body.sessionId}/answers`
    payload = { answer: body.answer }
  } else {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  let res: Response
  try {
    res = await fetch(`${CHATBOT_SERVER_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('Order chat server unreachable:', err)
    return NextResponse.json({ error: 'Assistant is unavailable right now' }, { status: 503 })
  }

  if (!res.ok) {
    console.error('Order chat server error:', res.status, await res.text())
    return NextResponse.json({ error: 'Assistant could not process that' }, { status: 502 })
  }

  const reply: OrderChatReply = await res.json()
  return NextResponse.json(reply)
}
