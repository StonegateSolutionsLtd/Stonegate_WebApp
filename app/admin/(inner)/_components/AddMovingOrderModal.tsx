'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SIZES = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 Bedroom' },
  { value: '2br', label: '2 Bedrooms' },
  { value: '3br', label: '3 Bedrooms' },
  { value: '4br+', label: '4+ Bedrooms' },
]

const TIMES = Array.from({ length: 20 }, (_, i) => {
  const totalMins = 6 * 60 + i * 30
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  const label = `${h > 12 ? h - 12 : h}:${m === 0 ? '00' : m} ${h >= 12 ? 'PM' : 'AM'}`
  const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  return { value, label }
})

const EMPTY = {
  pickupAddress: '', pickupFloor: '1', pickupHasElevator: false,
  dropoffAddress: '', dropoffFloor: '1', dropoffHasElevator: false,
  apartmentSize: '', movingDate: '', movingTime: '',
  customerName: '', customerEmail: '', phone: '', specialNotes: '',
}

export default function AddMovingOrderModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function set(field: keyof typeof EMPTY, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.apartmentSize) { setError('Select apartment size'); return }
    if (!form.movingDate) { setError('Select a moving date'); return }
    if (!form.movingTime) { setError('Select a time'); return }
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        phone: form.phone,
        pickupAddress: form.pickupAddress,
        pickupFloor: parseInt(form.pickupFloor) || 1,
        pickupHasElevator: form.pickupHasElevator,
        dropoffAddress: form.dropoffAddress,
        dropoffFloor: parseInt(form.dropoffFloor) || 1,
        dropoffHasElevator: form.dropoffHasElevator,
        apartmentSize: form.apartmentSize,
        movingDate: form.movingDate,
        movingTime: form.movingTime,
        specialNotes: form.specialNotes,
      }),
    })

    setSaving(false)
    if (res.ok) {
      setForm(EMPTY)
      setOpen(false)
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Failed to create order. Try again.')
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
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ background: '#254220', color: 'white', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
      >
        + Add Order
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}
          onClick={e => e.target === e.currentTarget && setOpen(false)}
        >
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '680px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ background: '#254220', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>Add Moving Order</span>
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
              {/* Customer */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '10px' }}>CUSTOMER</div>
                <div style={row}>
                  <div>
                    <label style={lbl}>Full Name *</label>
                    <input style={inp} required value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label style={lbl}>Phone *</label>
                    <input style={inp} required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="604-555-0100" />
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label style={lbl}>Email *</label>
                  <input style={inp} type="email" required value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} placeholder="jane@example.com" />
                </div>
              </div>

              {/* Pickup */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '10px' }}>PICKUP</div>
                <div>
                  <label style={lbl}>Address *</label>
                  <input style={inp} required value={form.pickupAddress} onChange={e => set('pickupAddress', e.target.value)} placeholder="123 Main St, Vancouver" />
                </div>
                <div style={{ ...row, marginTop: '10px' }}>
                  <div>
                    <label style={lbl}>Floor</label>
                    <input style={inp} type="number" min="1" max="50" value={form.pickupFloor} onChange={e => set('pickupFloor', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Elevator</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                      {[true, false].map(v => (
                        <button key={String(v)} type="button"
                          onClick={() => set('pickupHasElevator', v)}
                          style={{ flex: 1, padding: '8px', border: '1.5px solid', borderColor: form.pickupHasElevator === v ? '#254220' : '#E8E0D5', borderRadius: '8px', background: form.pickupHasElevator === v ? '#254220' : 'white', color: form.pickupHasElevator === v ? 'white' : '#6B5E54', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
                        >{v ? 'Yes' : 'No'}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropoff */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '10px' }}>DROP-OFF</div>
                <div>
                  <label style={lbl}>Address *</label>
                  <input style={inp} required value={form.dropoffAddress} onChange={e => set('dropoffAddress', e.target.value)} placeholder="456 Oak Ave, Burnaby" />
                </div>
                <div style={{ ...row, marginTop: '10px' }}>
                  <div>
                    <label style={lbl}>Floor</label>
                    <input style={inp} type="number" min="1" max="50" value={form.dropoffFloor} onChange={e => set('dropoffFloor', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Elevator</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                      {[true, false].map(v => (
                        <button key={String(v)} type="button"
                          onClick={() => set('dropoffHasElevator', v)}
                          style={{ flex: 1, padding: '8px', border: '1.5px solid', borderColor: form.dropoffHasElevator === v ? '#254220' : '#E8E0D5', borderRadius: '8px', background: form.dropoffHasElevator === v ? '#254220' : 'white', color: form.dropoffHasElevator === v ? 'white' : '#6B5E54', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
                        >{v ? 'Yes' : 'No'}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Move Details */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '10px' }}>MOVE DETAILS</div>
                <div>
                  <label style={lbl}>Apartment Size *</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {SIZES.map(s => (
                      <button key={s.value} type="button"
                        onClick={() => set('apartmentSize', s.value)}
                        style={{ padding: '7px 12px', border: '1.5px solid', borderColor: form.apartmentSize === s.value ? '#254220' : '#E8E0D5', borderRadius: '8px', background: form.apartmentSize === s.value ? '#254220' : 'white', color: form.apartmentSize === s.value ? 'white' : '#6B5E54', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}
                      >{s.label}</button>
                    ))}
                  </div>
                </div>
                <div style={{ ...row, marginTop: '10px' }}>
                  <div>
                    <label style={lbl}>Moving Date *</label>
                    <input style={inp} type="date" required value={form.movingDate} onChange={e => set('movingDate', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Arrival Time *</label>
                    <select style={inp} required value={form.movingTime} onChange={e => set('movingTime', e.target.value)}>
                      <option value="">Select time</option>
                      {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label style={lbl}>Special Notes</label>
                  <textarea style={{ ...inp, minHeight: '64px', resize: 'vertical' }} value={form.specialNotes} onChange={e => set('specialNotes', e.target.value)} placeholder="Access codes, heavy items, etc." />
                </div>
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setOpen(false)}
                  style={{ padding: '10px 20px', border: '1.5px solid #E8E0D5', borderRadius: '8px', background: 'white', color: '#6B5E54', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ padding: '10px 24px', background: saving ? '#9A8E83' : '#254220', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Saving…' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
