'use client'
import { useState } from 'react'

interface Props {
  open: boolean
  moverId: string
  moverName: string
  periodStart: string
  periodEnd: string
  suggestedAmount: number
  onClose: () => void
  onSaved: () => void
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function RecordPaymentModal({ open, moverId, moverName, periodStart, periodEnd, suggestedAmount, onClose, onSaved }: Props) {
  const [amount, setAmount] = useState(suggestedAmount > 0 ? suggestedAmount.toFixed(2) : '')
  const [paidDate, setPaidDate] = useState(todayStr())
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) { setError('Enter a valid amount'); return }
    if (!paidDate) { setError('Select a paid date'); return }

    setSaving(true)
    setError('')

    const res = await fetch(`/api/admin/movers/${moverId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amt,
        period_start: periodStart,
        period_end: periodEnd,
        paid_date: paidDate,
        notes: notes || null,
      }),
    })

    setSaving(false)
    if (res.ok) {
      onSaved()
      onClose()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Failed to record payment. Try again.')
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1.5px solid #E8E0D5',
    borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: 'white',
  }
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B5E54', marginBottom: '4px',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ background: '#254220', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>Record Payment · {moverName}</span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Amount *</label>
            <input style={inp} type="number" min="0" step="0.01" required autoFocus value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Paid Date *</label>
            <input style={inp} type="date" required value={paidDate} onChange={e => setPaidDate(e.target.value)} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Notes</label>
            <input style={inp} value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Paid early, e-transfer" />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '10px 20px', border: '1.5px solid #E8E0D5', borderRadius: '8px', background: 'white', color: '#6B5E54', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{ padding: '10px 24px', background: saving ? '#9A8E83' : '#254220', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Saving…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
