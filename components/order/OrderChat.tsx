'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { OrderFormData } from '@/lib/types'
import { postOrderChat } from '@/lib/order-chat'

type Message = { role: 'assistant' | 'user'; content: string }

export default function OrderChat({ sessionId, firstQuestion, onComplete, onBack }: {
  sessionId: string
  firstQuestion: string
  onComplete: (variables: OrderFormData) => void
  onBack: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: firstQuestion }])
  const [answer, setAnswer] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    if (!sending) inputRef.current?.focus()
  }, [messages, sending])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = answer.trim()
    if (!text || sending) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setAnswer('')
    setError('')
    setSending(true)
    try {
      const reply = await postOrderChat({ action: 'answer', sessionId, answer: text })
      if (reply.done) {
        onComplete(reply.variables)
        return
      }
      setMessages(prev => [...prev, { role: 'assistant', content: reply.question ?? '' }])
    } catch (err) {
      // Put the answer back so the customer can resend it.
      setMessages(prev => prev.slice(0, -1))
      setAnswer(text)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
              style={m.role === 'user'
                ? { backgroundColor: '#254220', color: '#FAF7F2', borderBottomRightRadius: 6 }
                : { backgroundColor: '#F5F0EB', color: '#1A1714', borderBottomLeftRadius: 6 }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl text-sm" style={{ backgroundColor: '#F5F0EB', color: '#9A8E83' }}>
              Thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && <p className="text-sm" style={{ color: '#B42318' }}>{error}</p>}

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          ref={inputRef}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          disabled={sending}
          maxLength={1000}
          placeholder="Type your answer…"
          aria-label="Your answer"
          className="flex-1 min-w-0 h-11 px-4 rounded-xl border text-sm transition-all outline-none
            focus:border-[#254220] focus:ring-2 focus:ring-[#254220]/15 placeholder:text-[#C4B8AC] disabled:opacity-60"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E0D8D0', color: '#1A1714' }}
        />
        <button
          type="submit"
          disabled={sending || !answer.trim()}
          className="flex items-center gap-2 px-5 h-11 rounded-xl text-sm font-bold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
        >
          Send
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </form>

      <div className="pt-1">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors hover:bg-[#F0EBE3]"
          style={{ color: '#9A8E83' }}
        >
          ← Edit form
        </button>
      </div>
    </div>
  )
}
