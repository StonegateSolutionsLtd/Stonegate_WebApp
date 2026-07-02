'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TYPE_LABELS: Record<string, string> = {
  junk_removal: 'Junk Removal',
  bin_cleaning: 'Bin Cleaning',
}

const BACK_HREFS: Record<string, string> = {
  junk_removal: '/admin/junk-removal',
  bin_cleaning: '/admin/bin-cleaning',
}

const TRUCK_LOADS = [
  { label: '1/8 Truck', desc: 'A few small items', price: 99 },
  { label: '1/4 Truck', desc: 'Small room worth', price: 175 },
  { label: '1/2 Truck', desc: 'One-two rooms', price: 275 },
  { label: '3/4 Truck', desc: 'Large haul', price: 375 },
  { label: 'Full Truck', desc: 'Complete cleanout', price: 475 },
]

interface Order {
  id: string
  order_number: number | null
  order_type: string
  customer_name: string
  customer_email: string
  phone: string
  address: string
  service_date: string
  service_time: string
  notes: string | null
  status: string
  hourly_rate: number | null
  estimated_hours: number | null
  additional_fees: number | null
  estimated_price: number | null
  created_at: string
}

function findLoadByPrice(price: number | null) {
  if (price == null) return null
  return TRUCK_LOADS.find(l => l.price === price) ?? null
}

export default function ServiceQuoteEditor({ order }: { order: Order }) {
  const isJunk = order.order_type === 'junk_removal'

  // Junk removal state
  const existingLoad = findLoadByPrice(order.hourly_rate)
  const [selectedLoad, setSelectedLoad] = useState<typeof TRUCK_LOADS[number] | null>(existingLoad)
  const [customPrice, setCustomPrice] = useState(
    existingLoad ? existingLoad.price.toString() : (order.hourly_rate?.toString() ?? '')
  )

  // Bin cleaning state
  const [rate, setRate] = useState(order.hourly_rate?.toString() ?? '80')
  const [hours, setHours] = useState(order.estimated_hours?.toString() ?? '')

  // Shared
  const [fees, setFees] = useState(order.additional_fees?.toString() ?? '0')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const year = new Date(order.created_at).getFullYear()
  const num = String(order.order_number ?? '-').padStart(4, '0')
  const typeLabel = TYPE_LABELS[order.order_type] ?? order.order_type
  const prefix = order.order_type === 'junk_removal' ? 'JR' : 'BC'
  const orderNum = `${prefix}-${year}-${num}`
  const backHref = BACK_HREFS[order.order_type] ?? '/admin/dashboard'

  const parsedFees = parseFloat(fees) || 0

  // Junk: base = selected load price (editable), hours always = 1
  const parsedLoadPrice = parseFloat(customPrice) || 0
  const junkTotal = Math.round((parsedLoadPrice + parsedFees) * 100) / 100

  // Bin cleaning: base = rate × hours
  const parsedRate = parseFloat(rate) || 0
  const parsedHours = parseFloat(hours) || 0
  const binTotal = Math.round((parsedRate * parsedHours + parsedFees) * 100) / 100

  const total = isJunk ? junkTotal : binTotal

  async function handleSaveAndPrint() {
    let hourly_rate: number, estimated_hours: number, additional_fees: number

    if (isJunk) {
      const p = parseFloat(customPrice)
      const f = parseFloat(fees)
      if (isNaN(p) || p <= 0) { setError('Select a load size or enter a price'); return }
      if (isNaN(f) || f < 0) { setError('Additional fees cannot be negative'); return }
      hourly_rate = p
      estimated_hours = 1
      additional_fees = f
    } else {
      const r = parseFloat(rate)
      const h = parseFloat(hours)
      const f = parseFloat(fees)
      if (isNaN(r) || r <= 0) { setError('Enter a valid rate'); return }
      if (isNaN(h) || h <= 0) { setError('Enter valid hours'); return }
      if (isNaN(f) || f < 0) { setError('Additional fees cannot be negative'); return }
      hourly_rate = r
      estimated_hours = h
      additional_fees = f
    }

    setSaving(true)
    setError('')

    const res = await fetch(`/api/admin/service-orders/${order.id}/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hourly_rate, estimated_hours, additional_fees }),
    })

    if (res.ok) {
      router.refresh()
      window.open(`/admin/service-quote/${order.id}/print`, '_blank')
    } else {
      setError('Failed to save. Try again.')
    }
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <style>{`
        .sqe-header { padding: 14px 20px; }
        .sqe-main { padding: 20px 16px; max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
        @media (max-width: 768px) {
          .sqe-main { grid-template-columns: 1fr; padding: 16px 12px; gap: 16px; }
        }
      `}</style>

      <header className="sqe-header" style={{ background: '#254220', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href={backHref} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            ← {typeLabel}
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>Quote - {orderNum}</span>
        </div>
        {order.estimated_price != null && (
          <a href={`/admin/service-quote/${order.id}/print`} target="_blank" rel="noreferrer"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '7px 12px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
          >
            Open PDF
          </a>
        )}
      </header>

      <main className="sqe-main">
        {/* Order Details */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: '#254220', fontSize: '16px', fontWeight: 700, margin: '0 0 20px', borderBottom: '1px solid #F5F0EB', paddingBottom: '12px' }}>
            Order Details
          </h2>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '12px' }}>CUSTOMER</div>
          <Row label="Name" value={order.customer_name} />
          <Row label="Email" value={order.customer_email} />
          <Row label="Phone" value={order.phone} />
          <div style={{ marginTop: '20px', fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '12px' }}>SERVICE DETAILS</div>
          <Row label="Type" value={typeLabel} />
          <Row label="Address" value={order.address} />
          <Row label="Date" value={new Date(order.service_date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
          <Row label="Time" value={order.service_time} />
          {order.notes && (
            <div style={{ marginTop: '16px', padding: '12px 16px', background: '#FAF7F2', borderRadius: '8px', fontSize: '13px', color: '#6B5E54' }}>
              <strong>Notes:</strong> {order.notes}
            </div>
          )}
        </div>

        {/* Quote Panel */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: '#254220', fontSize: '16px', fontWeight: 700, margin: '0 0 20px', borderBottom: '1px solid #F5F0EB', paddingBottom: '12px' }}>
            Quote Details
          </h2>

          {isJunk ? (
            /* ── Junk Removal: Truck Load Selector ── */
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '10px' }}>
                Truck Space Used
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {TRUCK_LOADS.map(load => {
                  const active = selectedLoad?.label === load.label
                  return (
                    <button
                      key={load.label}
                      type="button"
                      onClick={() => {
                        setSelectedLoad(load)
                        setCustomPrice(load.price.toString())
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '11px 14px', borderRadius: '10px',
                        border: `1.5px solid ${active ? '#254220' : '#E8E0D5'}`,
                        background: active ? '#F0F5EF' : 'white',
                        cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: active ? '#254220' : '#1A1714' }}>{load.label}</div>
                        <div style={{ fontSize: '11px', color: '#9A8E83', marginTop: '1px' }}>{load.desc}</div>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: active ? '#254220' : '#6B5E54' }}>${load.price}</div>
                    </button>
                  )
                })}
              </div>

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B5E54', marginBottom: '6px' }}>
                Custom price (override)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9A8E83' }}>$</span>
                <input
                  type="number" min="1" step="1"
                  value={customPrice}
                  onChange={e => { setCustomPrice(e.target.value); setSelectedLoad(null) }}
                  style={{ width: '100%', padding: '9px 12px 9px 24px', border: '1.5px solid #E8E0D5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          ) : (
            /* ── Bin Cleaning: Hourly Rate ── */
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>Hourly Rate (CAD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9A8E83', fontSize: '15px' }}>$</span>
                  <input type="number" min="1" step="1" value={rate} onChange={e => setRate(e.target.value)} placeholder="80"
                    style={{ width: '100%', padding: '11px 14px 11px 26px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>Estimated Hours</label>
                <input type="number" min="0.5" step="0.5" value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 3"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>Additional Fees (CAD)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9A8E83', fontSize: '15px' }}>$</span>
              <input type="number" min="0" step="0.01" value={fees} onChange={e => setFees(e.target.value)} placeholder="0.00"
                style={{ width: '100%', padding: '11px 14px 11px 26px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <button onClick={handleSaveAndPrint} disabled={saving}
            style={{ width: '100%', padding: '12px', background: saving ? '#6B5E54' : '#254220', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : 'Save & Open PDF Preview'}
          </button>

          {/* Summary */}
          <div style={{ marginTop: '20px', padding: '14px', background: '#FAF7F2', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '10px' }}>PRICING SUMMARY</div>

            {isJunk ? (
              <>
                <SummaryRow label={selectedLoad ? selectedLoad.label : 'Load price'} value={`$${parsedLoadPrice.toFixed(2)}`} />
                {parsedFees > 0 && <SummaryRow label="Additional Fees" value={`$${parsedFees.toFixed(2)}`} />}
              </>
            ) : (
              <>
                <SummaryRow label={`${hours || '0'} hrs × $${parsedRate.toFixed(0)}`} value={`$${(parsedRate * parsedHours).toFixed(2)}`} />
                {parsedFees > 0 && <SummaryRow label="Additional Fees" value={`$${parsedFees.toFixed(2)}`} />}
              </>
            )}

            <div style={{ borderTop: '1px solid #E8E0D5', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#254220' }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px' }}>
      <span style={{ color: '#9A8E83', minWidth: '60px' }}>{label}:</span>
      <span style={{ color: '#1A1714', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
      <span>{label}</span><span>{value}</span>
    </div>
  )
}
