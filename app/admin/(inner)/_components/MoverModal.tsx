'use client'
import { useState } from 'react'
import type { Mover } from '@/lib/types'
import { mondayOf, rateOn, type MoverRate } from '@/lib/mover-rates'

interface FormState {
  name: string
  phone: string
  hourlyRate: string
  active: boolean
  notes: string
}

function emptyForm(): FormState {
  return { name: '', phone: '', hourlyRate: '', active: true, notes: '' }
}

function formFromMover(mover: Mover, rate: number): FormState {
  return {
    name: mover.name,
    phone: mover.phone ?? '',
    hourlyRate: String(rate),
    active: mover.active,
    notes: mover.notes ?? '',
  }
}

const FIRST_RATE_DATE = '2000-01-03'
const weekLabel = (monday: string) => {
  const [y, m, d] = monday.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface Props {
  open: boolean
  mover?: Mover | null
  /** The mover's rate changes, oldest first */
  rateHistory?: MoverRate[]
  /** Monday of the payroll week on screen: the default start for a new rate */
  weekStart?: string
  onClose: () => void
  onSaved: () => void
}

export default function MoverModal({ open, mover, rateHistory = [], weekStart, onClose, onSaved }: Props) {
  // The rate shown is the one for the week on screen, so a change is compared against that week
  const weekRate = mover ? rateOn(rateHistory, weekStart, mover.hourly_rate) : 0
  const [form, setForm] = useState<FormState>(() => (mover ? formFromMover(mover, weekRate) : emptyForm()))
  const [rateFrom, setRateFrom] = useState(() => weekStart ?? mondayOf(new Date().toLocaleDateString('en-CA')))
  const [history, setHistory] = useState(rateHistory)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const rateChanged = !!mover && Number(form.hourlyRate) !== weekRate && form.hourlyRate !== ''

  if (!open) return null

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Enter a name'); return }
    const rate = Number(form.hourlyRate)
    if (!Number.isFinite(rate) || rate < 0) { setError('Enter a valid hourly rate'); return }

    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      phone: form.phone || null,
      // Editing: a rate is only sent when it changed, and applies from the chosen week onwards
      ...(!mover ? { hourly_rate: rate } : rateChanged ? { hourly_rate: rate, rate_effective_from: rateFrom } : {}),
      active: form.active,
      notes: form.notes || null,
    }

    const res = mover
      ? await fetch(`/api/admin/movers/${mover.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/movers', {
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

  async function removeRate(rate: MoverRate) {
    if (!mover || !confirm(`Remove the $${rate.hourly_rate.toFixed(2)}/hr rate? Those weeks go back to the rate before it.`)) return
    const res = await fetch(`/api/admin/movers/${mover.id}/rates/${rate.id}`, { method: 'DELETE' })
    if (res.ok) {
      setHistory(h => h.filter(x => x.id !== rate.id))
      onSaved()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Could not remove the rate.')
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

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ background: '#254220', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{mover ? 'Edit Mover' : 'Add Mover'}</span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Name *</label>
            <input style={inp} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Mike Johnson" />
          </div>

          <div style={{ ...row, marginBottom: '16px' }}>
            <div>
              <label style={lbl}>Phone</label>
              <input style={inp} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <label style={lbl}>{mover ? 'Hourly Rate (this week) *' : 'Hourly Rate *'}</label>
              <input style={inp} type="number" min="0" step="0.5" required value={form.hourlyRate} onChange={e => set('hourlyRate', e.target.value)} placeholder="25.00" />
            </div>
          </div>

          {rateChanged && (
            <div style={{ marginBottom: '16px', padding: '12px', background: '#F3F7F2', border: '1px solid #DCE8D9', borderRadius: '8px' }}>
              <label style={lbl}>New rate applies from the week of</label>
              <input style={inp} type="date" value={rateFrom} onChange={e => e.target.value && setRateFrom(mondayOf(e.target.value))} />
              <p style={{ fontSize: '12px', color: '#6B5E54', margin: '6px 0 0' }}>
                ${Number(form.hourlyRate).toFixed(2)}/hr from Monday, {weekLabel(rateFrom)}. Hours worked before that week keep the rate they were paid at.
              </p>
            </div>
          )}

          {mover && history.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <label style={lbl}>Rate history</label>
              <div style={{ border: '1px solid #F0EBE3', borderRadius: '8px', overflow: 'hidden' }}>
                {[...history].reverse().map(h => (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', fontSize: '12.5px', borderBottom: '1px solid #F5F0EB' }}>
                    <span style={{ color: '#6B5E54' }}>{h.effective_from === FIRST_RATE_DATE ? 'From the start' : `From week of ${weekLabel(h.effective_from)}`}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#1A1714' }}>${h.hourly_rate.toFixed(2)}/hr</strong>
                      {history.length > 1 && (
                        <button type="button" onClick={() => removeRate(h)} title="Remove this rate" style={{ background: 'transparent', border: 'none', color: '#9A8E83', fontSize: '15px', cursor: 'pointer', lineHeight: 1 }}>×</button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '11.5px', color: '#9A8E83', margin: '6px 0 0' }}>To fix an earlier week, view that week and change the rate there.</p>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Status</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[true, false].map(v => (
                <button key={String(v)} type="button"
                  onClick={() => set('active', v)}
                  style={{ flex: 1, padding: '8px', border: '1.5px solid', borderColor: form.active === v ? '#254220' : '#E8E0D5', borderRadius: '8px', background: form.active === v ? '#254220' : 'white', color: form.active === v ? 'white' : '#6B5E54', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
                >{v ? 'Active' : 'Inactive'}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Notes</label>
            <textarea style={{ ...inp, minHeight: '56px', resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional" />
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
              {saving ? 'Saving…' : mover ? 'Save Changes' : 'Add Mover'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
