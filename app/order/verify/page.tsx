'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import PageCanvas from '@/components/PageCanvas'

function readEmail(): string {
  if (typeof window === 'undefined') return ''
  try {
    const raw = sessionStorage.getItem('pendingOrder')
    if (!raw) return ''
    return JSON.parse(raw)?.customerEmail ?? ''
  } catch { return '' }
}

function readName(): string {
  if (typeof window === 'undefined') return ''
  try {
    const raw = sessionStorage.getItem('pendingOrder')
    if (!raw) return ''
    return JSON.parse(raw)?.customerName ?? ''
  } catch { return '' }
}

export default function VerifyPage() {
  const router = useRouter()
  const [email] = useState<string>(readEmail)
  const [name]  = useState<string>(readName)
  const [digits, setDigits]     = useState(['', '', '', '', '', ''])
  const [error, setError]       = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent]     = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { if (!email) router.replace('/order') }, [email, router])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...digits]
    next[index] = value.slice(-1)
    setDigits(next)
    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0)
      inputs.current[index - 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...digits]
    pasted.split('').forEach((char, i) => { next[i] = char })
    setDigits(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleVerify() {
    const code = digits.join('')
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); return }
    setError('')
    setVerifying(true)
    const res = await fetch('/api/verify/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    setVerifying(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Invalid code. Please try again.')
      return
    }
    router.push('/order/confirm')
  }

  async function handleResend() {
    setResending(true); setResent(false); setError('')
    await fetch('/api/verify/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    })
    setResending(false); setResent(true)
    setDigits(['', '', '', '', '', ''])
    inputs.current[0]?.focus()
  }

  if (!email) return null

  return (
    <PageCanvas backHref="/order" backLabel="← Edit order">
      <div className="max-w-xl mx-auto pt-4 text-center">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#1A1714' }}>
          Check your email
        </h1>
        <p className="mt-3 text-base" style={{ color: '#9A8E83' }}>
          We sent a 6-digit code to{' '}
          <span className="font-semibold" style={{ color: '#1A1714' }}>{email}</span>
        </p>

        <div className="mt-10 rounded-2xl p-10" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 32px rgba(0,0,0,0.08)', border: '1px solid #EDE6DE' }}>
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: '#FAF7F2',
                  border: `2px solid ${digit ? '#4D6B47' : '#D9CFC4'}`,
                  color: '#1A1714',
                }}
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
          {resent && <p className="text-sm text-center mb-4" style={{ color: '#4D6B47' }}>A new code has been sent.</p>}

          <Button
            className="w-full font-bold rounded-xl py-6 border-0"
            style={{ backgroundColor: '#4D6B47', color: '#FAF7F2' }}
            onClick={handleVerify}
            disabled={verifying}
          >
            {verifying ? 'Verifying...' : 'Verify Email'}
          </Button>

          <div className="mt-4 text-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm transition-colors"
              style={{ color: '#9A8E83' }}
            >
              {resending ? 'Sending...' : "Didn't receive it? Resend code"}
            </button>
          </div>
        </div>
      </div>
    </PageCanvas>
  )
}
