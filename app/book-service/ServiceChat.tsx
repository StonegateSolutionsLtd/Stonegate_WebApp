'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Camera } from 'lucide-react'
import { postServiceChat, type ServiceChatReply, type ServiceFormData } from '@/lib/service-chat'
import { UNREADABLE_PHOTO_MESSAGE, photoDataUrl, shrinkPhotos } from '@/lib/photos'

type Message = { role: 'assistant' | 'user'; content: string }

export default function ServiceChat({ sessionId, firstQuestion, firstOptions, firstAwaitingPhotos, photoSlots, onComplete, onBack }: {
  sessionId: string
  firstQuestion: string
  firstOptions: string[]
  firstAwaitingPhotos: boolean
  // How many more photos fit next to the ones from the form.
  photoSlots: number
  // `photos` = all photos the customer added in the chat.
  onComplete: (variables: ServiceFormData, photos: File[], keptPhotos: number[], quoteSummary: string | null) => void
  onBack: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: firstQuestion }])
  const [options, setOptions] = useState(firstOptions)
  const [awaitingPhotos, setAwaitingPhotos] = useState(firstAwaitingPhotos)
  const [chatPhotos, setChatPhotos] = useState<File[]>([])
  const [answer, setAnswer] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    if (!sending) inputRef.current?.focus()
  }, [messages, sending])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    send(answer.trim())
  }

  async function send(text: string) {
    if (!text || sending) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setAnswer('')
    setError('')
    setSending(true)
    try {
      const reply = await postServiceChat({ action: 'answer', sessionId, answer: text })
      handleReply(reply, chatPhotos)
    } catch (err) {
      // Put the answer back so the customer can resend it.
      setMessages(prev => prev.slice(0, -1))
      setAnswer(text)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  function handleReply(reply: ServiceChatReply, photos: File[]) {
    if (reply.done) {
      onComplete(reply.variables, photos, reply.keptPhotos, reply.quoteSummary)
      return
    }
    setOptions(reply.options)
    setAwaitingPhotos(reply.awaitingPhotos)
    setMessages(prev => [...prev, { role: 'assistant', content: reply.question ?? '' }])
  }

  async function sendPhotos(files: File[]) {
    if (sending) return
    setError('')
    const { photos, rejected } = await shrinkPhotos(files.slice(0, photoSlots - chatPhotos.length))
    if (!photos.length) {
      setError(rejected ? UNREADABLE_PHOTO_MESSAGE : 'You can’t add any more photos.')
      return
    }
    const note = `Added ${photos.length} photo${photos.length === 1 ? '' : 's'}`
    setMessages(prev => [...prev, { role: 'user', content: note }])
    setSending(true)
    try {
      // The chat checks the new photos together with the earlier ones.
      const reply = await postServiceChat({
        action: 'photos', sessionId, photos: await Promise.all(photos.map(photoDataUrl)),
      })
      const allChatPhotos = [...chatPhotos, ...photos]
      setChatPhotos(allChatPhotos)
      handleReply(reply, allChatPhotos)
      if (rejected) setError(UNREADABLE_PHOTO_MESSAGE)
    } catch (err) {
      setMessages(prev => prev.slice(0, -1))
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

      {options.length > 0 && !sending && (
        <div className="flex flex-wrap gap-2">
          {options.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => send(option)}
              className="px-4 py-2 rounded-xl border text-sm font-semibold transition-colors hover:bg-[#F0EBE3]"
              style={{ borderColor: '#E0D8D0', color: '#254220', backgroundColor: '#FFFFFF' }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {awaitingPhotos && (
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={e => {
              const files = [...(e.target.files ?? [])]
              e.target.value = ''
              if (files.length) sendPhotos(files)
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={sending}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold transition-opacity disabled:opacity-40"
            style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
          >
            <Camera size={15} strokeWidth={2.5} />
            Add photos
          </button>
        </div>
      )}

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
