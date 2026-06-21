'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { APARTMENT_SIZE_LABELS, type ApartmentSize } from '@/lib/types'

interface Order {
  id: string
  order_number: number | null
  customer_name: string
  customer_email: string
  phone: string
  pickup_address: string
  pickup_floor: number
  pickup_has_elevator: boolean
  dropoff_address: string
  dropoff_floor: number
  dropoff_has_elevator: boolean
  apartment_size: string
  moving_date: string
  moving_time: string
  special_notes: string | null
  status: string
  hourly_rate: number | null
  estimated_hours: number | null
  additional_fees: number | null
  estimated_price: number | null
  created_at: string
}

export default function QuoteEditor({ order }: { order: Order }) {
  const [rate, setRate] = useState(order.hourly_rate?.toString() ?? '80')
  const [hours, setHours] = useState(order.estimated_hours?.toString() ?? '')
  const [fees, setFees] = useState(order.additional_fees?.toString() ?? '0')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const year = new Date(order.created_at).getFullYear()
  const num = String(order.order_number ?? '—').padStart(4, '0')
  const orderNum = `SG-${year}-${num}`
  const sizeLabel = APARTMENT_SIZE_LABELS[order.apartment_size as ApartmentSize] ?? order.apartment_size

  const parsedRate = parseFloat(rate) || 0
  const parsedHours = parseFloat(hours) || 0
  const parsedFees = parseFloat(fees) || 0
  const total = Math.round((parsedRate * parsedHours + parsedFees) * 100) / 100

  async function handleSaveAndPrint() {
    const r = parseFloat(rate)
    const h = parseFloat(hours)
    const f = parseFloat(fees)
    if (isNaN(r) || r <= 0) { setError('Enter a valid hourly rate'); return }
    if (isNaN(h) || h <= 0) { setError('Enter valid hours'); return }
    if (isNaN(f) || f < 0) { setError('Additional fees cannot be negative'); return }

    setSaving(true)
    setError('')

    const res = await fetch(`/api/admin/quote/${order.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hourly_rate: r, estimated_hours: h, additional_fees: f }),
    })

    if (res.ok) {
      router.refresh()
      window.open(`/admin/quote/${order.id}/print`, '_blank')
    } else {
      setError('Failed to save. Try again.')
    }
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <style>{`
        .qe-header { padding: 14px 20px; }
        .qe-title { font-size: 15px; }
        .qe-main { padding: 20px 16px; max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
        .qe-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 768px) {
          .qe-header { padding: 12px 16px; flex-wrap: wrap; gap: 8px; }
          .qe-title { font-size: 13px; }
          .qe-main { grid-template-columns: 1fr; padding: 16px 12px; gap: 16px; }
          .qe-detail-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>

      {/* Header */}
      <header className="qe-header" style={{ background: '#254220', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            ← Dashboard
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span className="qe-title" style={{ color: 'white', fontWeight: 700 }}>Quote — {orderNum}</span>
        </div>
        {order.estimated_price != null && (
          <a
            href={`/admin/quote/${order.id}/print`}
            target="_blank"
            rel="noreferrer"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '7px 12px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Open PDF
          </a>
        )}
      </header>

      <main className="qe-main">
        {/* Order Details */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: '#254220', fontSize: '16px', fontWeight: 700, margin: '0 0 20px', borderBottom: '1px solid #F5F0EB', paddingBottom: '12px' }}>
            Order Details
          </h2>
          <div className="qe-detail-grid">
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '12px' }}>CUSTOMER</div>
              <Row label="Name" value={order.customer_name} />
              <Row label="Email" value={order.customer_email} />
              <Row label="Phone" value={order.phone} />
              <Row label="Move Date" value={new Date(order.moving_date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <Row label="Time" value={order.moving_time} />
              <Row label="Size" value={sizeLabel} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '12px' }}>LOCATIONS</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#254220', marginBottom: '6px' }}>FROM</div>
              <Row label="Address" value={order.pickup_address} />
              <Row label="Floor" value={String(order.pickup_floor)} />
              <Row label="Elevator" value={order.pickup_has_elevator ? 'Yes' : 'No'} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#254220', margin: '12px 0 6px' }}>TO</div>
              <Row label="Address" value={order.dropoff_address} />
              <Row label="Floor" value={String(order.dropoff_floor)} />
              <Row label="Elevator" value={order.dropoff_has_elevator ? 'Yes' : 'No'} />
            </div>
          </div>
          {order.special_notes && (
            <div style={{ marginTop: '20px', padding: '12px 16px', background: '#FAF7F2', borderRadius: '8px', fontSize: '13px', color: '#6B5E54' }}>
              <strong>Notes:</strong> {order.special_notes}
            </div>
          )}
        </div>

        {/* Quote Input Panel */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: '#254220', fontSize: '16px', fontWeight: 700, margin: '0 0 20px', borderBottom: '1px solid #F5F0EB', paddingBottom: '12px' }}>
            Quote Details
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>
              Hourly Rate (CAD)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9A8E83', fontSize: '15px' }}>$</span>
              <input
                type="number"
                min="1"
                step="1"
                value={rate}
                onChange={e => setRate(e.target.value)}
                placeholder="80"
                style={{ width: '100%', padding: '11px 14px 11px 26px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>
              Estimated Hours
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={hours}
              onChange={e => setHours(e.target.value)}
              placeholder="e.g. 5"
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>
              Additional Fees (CAD)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9A8E83', fontSize: '15px' }}>$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fees}
                onChange={e => setFees(e.target.value)}
                placeholder="0.00"
                style={{ width: '100%', padding: '11px 14px 11px 26px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#9A8E83', marginTop: '6px' }}>
              Extra charges beyond hourly rate (stairs, long carry, etc.)
            </p>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <button
            onClick={handleSaveAndPrint}
            disabled={saving}
            style={{ width: '100%', padding: '12px', background: saving ? '#6B5E54' : '#254220', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : 'Save & Open PDF Preview'}
          </button>

          {/* Pricing Summary */}
          <div style={{ marginTop: '20px', padding: '12px', background: '#FAF7F2', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '8px' }}>PRICING SUMMARY</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
              <span>Rate</span><span>${parsedRate.toFixed(2)} / hr</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
              <span>Hours</span><span>{hours || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
              <span>Base ({hours || '0'} × ${parsedRate.toFixed(0)})</span>
              <span>${(parsedRate * parsedHours).toFixed(2)}</span>
            </div>
            {parsedFees > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                <span>Additional Fees</span><span>${parsedFees.toFixed(2)}</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid #E8E0D5', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#254220' }}>
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
      <span style={{ color: '#9A8E83', minWidth: '70px' }}>{label}:</span>
      <span style={{ color: '#1A1714', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
