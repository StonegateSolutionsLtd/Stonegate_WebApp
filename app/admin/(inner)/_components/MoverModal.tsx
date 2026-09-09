'use client'
import { useState } from 'react'
import type { Mover } from '@/lib/types'

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

function formFromMover(mover: Mover): FormState {
  return {
    name: mover.name,
    phone: mover.phone ?? '',
    hourlyRate: String(mover.hourly_rate),
    active: mover.active,
    notes: mover.notes ?? '',
  }
}

interface Props {
  open: boolean
  mover?: Mover | null
  onClose: () => void
  onSaved: () => void
}

export default function MoverModal({ open, mover, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(() => (mover ? formFromMover(mover) : emptyForm()))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
      hourly_rate: rate,
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
              <label style={lbl}>Hourly Rate *</label>
              <input style={inp} type="number" min="0" step="0.5" required value={form.hourlyRate} onChange={e => set('hourlyRate', e.target.value)} placeholder="25.00" />
            </div>
          </div>

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
