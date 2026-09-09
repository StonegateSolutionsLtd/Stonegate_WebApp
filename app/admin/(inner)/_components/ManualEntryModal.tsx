'use client'
import { useState } from 'react'

type EntryMode = 'hours' | 'amount'

interface Props {
  open: boolean
  moverId: string
  moverName: string
  hourlyRate: number
  defaultDate: string
  onClose: () => void
  onSaved: () => void
}

export default function ManualEntryModal({ open, moverId, moverName, hourlyRate, defaultDate, onClose, onSaved }: Props) {
  const [mode, setMode] = useState<EntryMode>('hours')
  const [workDate, setWorkDate] = useState(defaultDate)
  const [hours, setHours] = useState('')
  const [amount, setAmount] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workDate) { setError('Select a date'); return }

    const payload: Record<string, unknown> = { mover_id: moverId, work_date: workDate, label: label || null }
    if (mode === 'hours') {
      const n = Number(hours)
      if (!Number.isFinite(n) || n <= 0) { setError('Enter valid hours'); return }
      payload.hours = n
    } else {
      const n = Number(amount)
      if (!Number.isFinite(n) || n <= 0) { setError('Enter a valid amount'); return }
      payload.amount_override = n
    }

    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/mover-assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)
    if (res.ok) {
      onSaved()
      onClose()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Failed to save. Try again.')
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
  const row: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }

  const hoursAmount = Number(hours)
  const estimatedPay = mode === 'hours' && Number.isFinite(hoursAmount) && hoursAmount > 0 ? hoursAmount * hourlyRate : null

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '440px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ background: '#254220', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>Add Entry · {moverName}</span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Entry Type</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" onClick={() => setMode('hours')}
                style={{ flex: 1, padding: '9px', border: '1.5px solid', borderColor: mode === 'hours' ? '#254220' : '#E8E0D5', borderRadius: '8px', background: mode === 'hours' ? '#254220' : 'white', color: mode === 'hours' ? 'white' : '#6B5E54', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
              >⏱ Hours Worked</button>
              <button type="button" onClick={() => setMode('amount')}
                style={{ flex: 1, padding: '9px', border: '1.5px solid', borderColor: mode === 'amount' ? '#254220' : '#E8E0D5', borderRadius: '8px', background: mode === 'amount' ? '#254220' : 'white', color: mode === 'amount' ? 'white' : '#6B5E54', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
              >💵 Flat Amount</button>
            </div>
          </div>

          <div style={{ ...row, marginBottom: '16px' }}>
            <div>
              <label style={lbl}>Date *</label>
              <input style={inp} type="date" required value={workDate} onChange={e => setWorkDate(e.target.value)} />
            </div>
            {mode === 'hours' ? (
              <div>
                <label style={lbl}>Hours *</label>
                <input style={inp} type="number" min="0" step="0.25" required value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 5" />
              </div>
            ) : (
              <div>
                <label style={lbl}>Amount *</label>
                <input style={inp} type="number" min="0" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 50.00" />
              </div>
            )}
          </div>

          {estimatedPay !== null && (
            <p style={{ fontSize: '12px', color: '#6B5E54', margin: '-8px 0 16px' }}>
              {hoursAmount} hrs × ${hourlyRate.toFixed(2)}/hr = <strong>${estimatedPay.toFixed(2)}</strong>
            </p>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Note</label>
            <input style={inp} value={label} onChange={e => setLabel(e.target.value)} placeholder={mode === 'hours' ? 'e.g. Warehouse cleanup' : 'e.g. Bonus, advance, fuel'} />
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
              {saving ? 'Saving…' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
