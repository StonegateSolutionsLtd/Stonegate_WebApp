'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { APARTMENT_SIZE_LABELS, type ApartmentSize } from '@/lib/types'
import { calcStandardQuote, type DetailedQuoteInputs } from '@/lib/quote-pricing'
import { useDetailedQuoteState } from '@/components/admin/useDetailedQuoteState'
import { DetailedQuoteForm } from '@/components/admin/DetailedQuoteForm'

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
  num_trucks: number | null
  gst: boolean | null
  estimated_price: number | null
  quote_type: string | null
  quote_details: { inputs: DetailedQuoteInputs } | null
  created_at: string
}

const SIZES = Object.entries(APARTMENT_SIZE_LABELS) as [ApartmentSize, string][]

function detailsFromOrder(order: Order) {
  return {
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    phone: order.phone,
    pickupAddress: order.pickup_address,
    pickupFloor: String(order.pickup_floor),
    pickupHasElevator: order.pickup_has_elevator,
    dropoffAddress: order.dropoff_address,
    dropoffFloor: String(order.dropoff_floor),
    dropoffHasElevator: order.dropoff_has_elevator,
    apartmentSize: order.apartment_size,
    movingDate: order.moving_date,
    movingTime: order.moving_time?.slice(0, 5) ?? '',
    specialNotes: order.special_notes ?? '',
  }
}
type OrderDetailsForm = ReturnType<typeof detailsFromOrder>

export default function QuoteEditor({ order }: { order: Order }) {
  const [tab, setTab] = useState<'standard' | 'detailed'>(order.quote_type === 'detailed' ? 'detailed' : 'standard')

  const [editingDetails, setEditingDetails] = useState(false)
  const [details, setDetails] = useState<OrderDetailsForm>(() => detailsFromOrder(order))
  const [savingDetails, setSavingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState('')

  function setDetail<K extends keyof OrderDetailsForm>(field: K, value: OrderDetailsForm[K]) {
    setDetails(d => ({ ...d, [field]: value }))
  }

  function startEditingDetails() {
    setDetails(detailsFromOrder(order))
    setDetailsError('')
    setEditingDetails(true)
  }

  async function handleSaveDetails() {
    setDetailsError('')
    if (!details.customerName.trim()) { setDetailsError('Name is required'); return }
    if (!details.pickupAddress.trim()) { setDetailsError('Pickup address is required'); return }
    if (!details.dropoffAddress.trim()) { setDetailsError('Drop-off address is required'); return }
    if (!details.movingDate) { setDetailsError('Moving date is required'); return }
    if (!details.movingTime) { setDetailsError('Moving time is required'); return }

    setSavingDetails(true)
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: details.customerName,
        customerEmail: details.customerEmail,
        phone: details.phone,
        pickupAddress: details.pickupAddress,
        pickupFloor: parseInt(details.pickupFloor) || 1,
        pickupHasElevator: details.pickupHasElevator,
        dropoffAddress: details.dropoffAddress,
        dropoffFloor: parseInt(details.dropoffFloor) || 1,
        dropoffHasElevator: details.dropoffHasElevator,
        apartmentSize: details.apartmentSize,
        movingDate: details.movingDate,
        movingTime: details.movingTime,
        specialNotes: details.specialNotes,
      }),
    })
    setSavingDetails(false)
    if (res.ok) {
      setEditingDetails(false)
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setDetailsError(data.error || 'Failed to save. Try again.')
    }
  }

  const [rate, setRate] = useState(order.hourly_rate?.toString() ?? '80')
  const [hours, setHours] = useState(order.estimated_hours?.toString() ?? '')
  const [fees, setFees] = useState(order.additional_fees?.toString() ?? '0')
  const [trucks, setTrucks] = useState(order.num_trucks?.toString() ?? '1')
  const [gst, setGst] = useState(order.gst ?? false)

  const { inputs: detailedInputs, result: detailedResult, formProps: detailedFormProps } =
    useDetailedQuoteState(order.quote_details?.inputs)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const year = new Date(order.created_at).getFullYear()
  const num = String(order.order_number ?? '-').padStart(4, '0')
  const orderNum = `SG-${year}-${num}`
  const sizeLabel = APARTMENT_SIZE_LABELS[order.apartment_size as ApartmentSize] ?? order.apartment_size

  const parsedRate = parseFloat(rate) || 0
  const parsedHours = parseFloat(hours) || 0
  const parsedFees = parseFloat(fees) || 0
  const standardResult = calcStandardQuote({ hourlyRate: parsedRate, hours: parsedHours, fees: parsedFees, gst })

  async function handleSaveAndPrint() {
    setError('')

    if (tab === 'standard') {
      const r = parseFloat(rate)
      const h = parseFloat(hours)
      const f = parseFloat(fees)
      const t = parseInt(trucks, 10)
      if (isNaN(r) || r <= 0) { setError('Enter a valid hourly rate'); return }
      if (isNaN(h) || h <= 0) { setError('Enter valid hours'); return }
      if (isNaN(f) || f < 0) { setError('Additional fees cannot be negative'); return }
      if (isNaN(t) || t < 1) { setError('Enter a valid number of trucks'); return }

      setSaving(true)
      const res = await fetch(`/api/admin/quote/${order.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote_type: 'standard', hourly_rate: r, estimated_hours: h, additional_fees: f, num_trucks: t, gst }),
      })
      if (res.ok) {
        router.refresh()
        window.open(`/admin/quote/${order.id}/print`, '_blank')
      } else {
        setError('Failed to save. Try again.')
      }
      setSaving(false)
      return
    }

    if (detailedResult.total <= 0) { setError('Enter at least one quote detail'); return }

    setSaving(true)
    const res = await fetch(`/api/admin/quote/${order.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quote_type: 'detailed', detailed_inputs: detailedInputs }),
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
          <span className="qe-title" style={{ color: 'white', fontWeight: 700 }}>Quote - {orderNum}</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 20px', borderBottom: '1px solid #F5F0EB', paddingBottom: '12px' }}>
            <h2 style={{ color: '#254220', fontSize: '16px', fontWeight: 700, margin: 0 }}>
              Order Details
            </h2>
            {!editingDetails && (
              <button
                type="button"
                onClick={startEditingDetails}
                style={{ background: '#FAF7F2', color: '#254220', border: '1.5px solid #E8E0D5', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Edit
              </button>
            )}
          </div>

          {editingDetails ? (
            <>
              <div className="qe-detail-grid">
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '12px' }}>CUSTOMER</div>
                  <FieldRow label="Name">
                    <input style={editInp} value={details.customerName} onChange={e => setDetail('customerName', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Email">
                    <input style={editInp} type="email" value={details.customerEmail} onChange={e => setDetail('customerEmail', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Phone">
                    <input style={editInp} value={details.phone} onChange={e => setDetail('phone', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Move Date">
                    <input style={editInp} type="date" value={details.movingDate} onChange={e => setDetail('movingDate', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Time">
                    <input style={editInp} type="time" value={details.movingTime} onChange={e => setDetail('movingTime', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Size">
                    <select style={editInp} value={details.apartmentSize} onChange={e => setDetail('apartmentSize', e.target.value)}>
                      {SIZES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </FieldRow>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '12px' }}>LOCATIONS</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#254220', marginBottom: '6px' }}>FROM</div>
                  <FieldRow label="Address">
                    <input style={editInp} value={details.pickupAddress} onChange={e => setDetail('pickupAddress', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Floor">
                    <input style={editInp} type="number" min="1" max="50" value={details.pickupFloor} onChange={e => setDetail('pickupFloor', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Elevator">
                    <ElevatorToggle value={details.pickupHasElevator} onChange={v => setDetail('pickupHasElevator', v)} />
                  </FieldRow>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#254220', margin: '12px 0 6px' }}>TO</div>
                  <FieldRow label="Address">
                    <input style={editInp} value={details.dropoffAddress} onChange={e => setDetail('dropoffAddress', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Floor">
                    <input style={editInp} type="number" min="1" max="50" value={details.dropoffFloor} onChange={e => setDetail('dropoffFloor', e.target.value)} />
                  </FieldRow>
                  <FieldRow label="Elevator">
                    <ElevatorToggle value={details.dropoffHasElevator} onChange={v => setDetail('dropoffHasElevator', v)} />
                  </FieldRow>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B5E54', marginBottom: '6px' }}>Special Notes</label>
                <textarea
                  style={{ ...editInp, minHeight: '64px', resize: 'vertical' }}
                  value={details.specialNotes}
                  onChange={e => setDetail('specialNotes', e.target.value)}
                  placeholder="Access codes, heavy items, etc."
                />
              </div>

              {detailsError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px' }}>{detailsError}</p>}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setEditingDetails(false)}
                  style={{ padding: '9px 18px', border: '1.5px solid #E8E0D5', borderRadius: '8px', background: 'white', color: '#6B5E54', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={savingDetails}
                  style={{ padding: '9px 20px', background: savingDetails ? '#9A8E83' : '#254220', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: savingDetails ? 'not-allowed' : 'pointer' }}
                >
                  {savingDetails ? 'Saving…' : 'Save Details'}
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Quote Input Panel */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: '#254220', fontSize: '16px', fontWeight: 700, margin: '0 0 16px', borderBottom: '1px solid #F5F0EB', paddingBottom: '12px' }}>
            Quote Details
          </h2>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: '#FAF7F2', borderRadius: '10px', padding: '4px' }}>
            {(['standard', 'detailed'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '9px 10px', borderRadius: '8px', border: 'none',
                  background: tab === t ? '#254220' : 'transparent',
                  color: tab === t ? 'white' : '#6B5E54',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                {t === 'standard' ? 'Hourly Rate' : 'Detailed Quote'}
              </button>
            ))}
          </div>

          {tab === 'standard' && (
            <>
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>
                  Number of Trucks
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={trucks}
                  onChange={e => setTrucks(e.target.value)}
                  placeholder="1"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
                <p style={{ fontSize: '12px', color: '#9A8E83', marginTop: '6px' }}>
                  Quote will note this is priced for a 16&apos; truck + 2 movers{parseInt(trucks, 10) > 1 ? ' per truck' : ''}.
                </p>
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

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1A1714', cursor: 'pointer', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  checked={gst}
                  onChange={e => setGst(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#254220' }}
                />
                Add GST (5%)
              </label>
            </>
          )}

          {tab === 'detailed' && <DetailedQuoteForm {...detailedFormProps} showWeightOption={false} showStairsFee />}

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

            {tab === 'standard' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                  <span>Rate</span><span>${parsedRate.toFixed(2)} / hr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                  <span>Hours</span><span>{hours || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                  <span>Trucks</span><span>{trucks || '-'} × 16&apos; Truck</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                  <span>Base ({hours || '0'} × ${parsedRate.toFixed(0)})</span>
                  <span>${standardResult.baseAmount.toFixed(2)}</span>
                </div>
                {parsedFees > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                    <span>Additional Fees</span><span>${parsedFees.toFixed(2)}</span>
                  </div>
                )}
                {gst && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                    <span>GST (5%)</span><span>${standardResult.gstAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #E8E0D5', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#254220' }}>
                  <span>Total</span><span>${standardResult.total.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                {detailedResult.lineItems.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#9A8E83' }}>Enter quote details to see a breakdown.</div>
                )}
                {detailedResult.lineItems.map(li => (
                  <div key={li.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                    <span>{li.label}</span><span>${li.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #E8E0D5', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#254220' }}>
                  <span>Total</span><span>${detailedResult.total.toFixed(2)}</span>
                </div>
              </>
            )}
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

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <span style={{ color: '#9A8E83', minWidth: '70px', fontSize: '13px', flexShrink: 0 }}>{label}:</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function ElevatorToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {[true, false].map(v => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          style={{
            flex: 1, padding: '6px', border: '1.5px solid', borderColor: value === v ? '#254220' : '#E8E0D5',
            borderRadius: '6px', background: value === v ? '#254220' : 'white', color: value === v ? 'white' : '#6B5E54',
            fontSize: '12px', cursor: 'pointer', fontWeight: 500,
          }}
        >
          {v ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  )
}

const editInp: React.CSSProperties = {
  width: '100%', padding: '6px 10px', border: '1.5px solid #E8E0D5', borderRadius: '6px',
  fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'white',
}
