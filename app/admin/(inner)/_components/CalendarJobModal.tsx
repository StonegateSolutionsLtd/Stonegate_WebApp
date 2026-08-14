'use client'
import { useState } from 'react'
import type { CalendarJob, CalendarJobType } from '@/lib/types'

const SIZES = [
  { value: '', label: 'Not set' },
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 Bedroom' },
  { value: '2br', label: '2 Bedrooms' },
  { value: '3br', label: '3 Bedrooms' },
  { value: '4br+', label: '4+ Bedrooms' },
]

const TIMES = Array.from({ length: 33 }, (_, i) => {
  const totalMins = 6 * 60 + i * 30
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  const label = `${h > 12 ? h - 12 : h}:${m === 0 ? '00' : m} ${h >= 12 ? 'PM' : 'AM'}`
  const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  return { value, label }
})

const JOB_TYPES: { value: CalendarJobType; label: string; icon: string }[] = [
  { value: 'moving', label: 'Moving', icon: '🚛' },
  { value: 'junk_removal', label: 'Junk Removal', icon: '🗑️' },
]

interface FormState {
  jobType: CalendarJobType
  eventDate: string
  eventTime: string
  isSubcontract: boolean
  companyName: string
  pickupAddress: string
  size: string
  customerName: string
  notes: string
}

function emptyForm(defaultDate?: string): FormState {
  return {
    jobType: 'moving',
    eventDate: defaultDate || '',
    eventTime: '',
    isSubcontract: false,
    companyName: '',
    pickupAddress: '',
    size: '',
    customerName: '',
    notes: '',
  }
}

function formFromJob(job: CalendarJob): FormState {
  return {
    jobType: job.job_type,
    eventDate: job.event_date,
    eventTime: job.event_time ?? '',
    isSubcontract: job.is_subcontract,
    companyName: job.company_name ?? '',
    pickupAddress: job.pickup_address ?? '',
    size: job.size ?? '',
    customerName: job.customer_name ?? '',
    notes: job.notes ?? '',
  }
}

interface Props {
  open: boolean
  job?: CalendarJob | null
  defaultDate?: string
  onClose: () => void
  onSaved: () => void
}

export default function CalendarJobModal({ open, job, defaultDate, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(() => (job ? formFromJob(job) : emptyForm(defaultDate)))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.eventDate) { setError('Select a date'); return }
    setSaving(true)
    setError('')

    const payload = {
      job_type: form.jobType,
      event_date: form.eventDate,
      event_time: form.eventTime || null,
      is_subcontract: form.isSubcontract,
      company_name: form.isSubcontract ? form.companyName : '',
      pickup_address: form.pickupAddress,
      size: form.jobType === 'moving' ? form.size : '',
      customer_name: form.customerName,
      notes: form.notes,
    }

    const res = job
      ? await fetch(`/api/admin/calendar/${job.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/calendar', {
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

  async function handleDelete() {
    if (!job) return
    if (!confirm('Remove this job from the calendar?')) return
    setDeleting(true)
    const res = await fetch(`/api/admin/calendar/${job.id}`, { method: 'DELETE' })
    setDeleting(false)
    if (res.ok) {
      onSaved()
      onClose()
    } else {
      alert('Failed to delete. Try again.')
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
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '560px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ background: '#254220', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{job ? 'Edit Calendar Job' : 'Add to Calendar'}</span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Job Type *</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {JOB_TYPES.map(t => (
                <button key={t.value} type="button"
                  onClick={() => set('jobType', t.value)}
                  style={{ flex: 1, padding: '9px', border: '1.5px solid', borderColor: form.jobType === t.value ? '#254220' : '#E8E0D5', borderRadius: '8px', background: form.jobType === t.value ? '#254220' : 'white', color: form.jobType === t.value ? 'white' : '#6B5E54', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
                >{t.icon} {t.label}</button>
              ))}
            </div>
          </div>

          <div style={{ ...row, marginBottom: '16px' }}>
            <div>
              <label style={lbl}>Date *</label>
              <input style={inp} type="date" required value={form.eventDate} onChange={e => set('eventDate', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Time</label>
              <select style={inp} value={form.eventTime} onChange={e => set('eventTime', e.target.value)}>
                <option value="">Not set</option>
                {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Subcontracting Job?</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: form.isSubcontract ? '10px' : 0 }}>
              {[true, false].map(v => (
                <button key={String(v)} type="button"
                  onClick={() => set('isSubcontract', v)}
                  style={{ flex: 1, padding: '8px', border: '1.5px solid', borderColor: form.isSubcontract === v ? '#254220' : '#E8E0D5', borderRadius: '8px', background: form.isSubcontract === v ? '#254220' : 'white', color: form.isSubcontract === v ? 'white' : '#6B5E54', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
                >{v ? 'Yes' : 'No'}</button>
              ))}
            </div>
            {form.isSubcontract && (
              <input style={inp} value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Company we're subcontracting for" />
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Pickup Address</label>
            <input style={inp} value={form.pickupAddress} onChange={e => set('pickupAddress', e.target.value)} placeholder="123 Main St, Vancouver" />
          </div>

          <div style={{ ...row, marginBottom: '16px' }}>
            {form.jobType === 'moving' && (
              <div>
                <label style={lbl}>Size</label>
                <select style={inp} value={form.size} onChange={e => set('size', e.target.value)}>
                  {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            )}
            <div>
              <label style={lbl}>Customer Name</label>
              <input style={inp} value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Optional" />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Notes</label>
            <textarea style={{ ...inp, minHeight: '64px', resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anything worth remembering about this job..." />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px', justifyContent: job ? 'space-between' : 'flex-end' }}>
            {job && (
              <button type="button" onClick={handleDelete} disabled={deleting}
                style={{ padding: '10px 16px', border: '1.5px solid #ef4444', borderRadius: '8px', background: 'white', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: deleting ? 'not-allowed' : 'pointer' }}
              >
                {deleting ? 'Removing…' : 'Remove'}
              </button>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={onClose}
                style={{ padding: '10px 20px', border: '1.5px solid #E8E0D5', borderRadius: '8px', background: 'white', color: '#6B5E54', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving}
                style={{ padding: '10px 24px', background: saving ? '#9A8E83' : '#254220', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? 'Saving…' : job ? 'Save Changes' : 'Add to Calendar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
