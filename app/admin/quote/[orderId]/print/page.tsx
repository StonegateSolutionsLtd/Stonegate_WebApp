import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { APARTMENT_SIZE_LABELS, type ApartmentSize } from '@/lib/types'
import PrintButton from './PrintButton'

export async function generateMetadata({ params }: { params: Promise<{ orderId: string }> }): Promise<Metadata> {
  const { orderId } = await params
  const supabase = createServiceClient()
  const { data: order } = await supabase.from('orders').select('order_number,created_at').eq('id', orderId).single()
  if (!order) return { title: 'Quote' }
  const year = new Date(order.created_at).getFullYear()
  const num = String(order.order_number ?? '001').padStart(4, '0')
  return { title: `Moving Estimate SG-${year}-${num}` }
}

export default async function PrintQuotePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order || order.estimated_price == null) {
    notFound()
  }

  const year = new Date(order.created_at).getFullYear()
  const num = String(order.order_number ?? '001').padStart(4, '0')
  const estimateNum = `SG-${year}-${num}`
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const moveDate = new Date(order.moving_date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const moveTime = new Date(`1970-01-01T${order.moving_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  const price = Number(order.estimated_price)
  const estHours = Number(order.estimated_hours)
  const hourlyRate = Number(order.hourly_rate ?? 80)
  const additionalCharges = Math.round(Math.max(0, Number(order.additional_fees ?? 0)) * 100) / 100
  const baseAmount = Math.round(estHours * hourlyRate * 100) / 100
  const sizeLabel = APARTMENT_SIZE_LABELS[order.apartment_size as ApartmentSize] ?? order.apartment_size

  const G = '#254220'

  const printCss = `
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&family=Dancing+Script:wght@700&display=swap');
    body { background: #f0f0f0; font-family: 'Raleway', 'Segoe UI', Arial, sans-serif; }
    .toolbar { background: #254220; padding: 10px 20px; display: flex; justify-content: flex-end; position: sticky; top: 0; z-index: 10; }
    .toolbar button { background: white; color: #254220; border: none; padding: 8px 18px; border-radius: 6px; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
    .page { background: white; width: 210mm; min-height: 297mm; margin: 0 auto; padding: 12mm 14mm; }
    @media print {
      body { background: white; }
      .toolbar { display: none; }
      .page { margin: 0; padding: 12mm 14mm; box-shadow: none; width: 100%; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      @page { size: A4 portrait; margin: 0; }
    }
  `

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: printCss }} />

      {/* Toolbar sits above the document - hidden when printing */}
      <div className="toolbar">
        <PrintButton />
      </div>

      <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10mm' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SG" style={{ height: '68px', width: 'auto', objectFit: 'contain' }} />
            <div style={{ borderLeft: '1.5px solid #ccc', paddingLeft: '14px' }}>
              <div style={{ fontSize: '19px', fontWeight: 800, color: G, letterSpacing: '2px', lineHeight: 1 }}>STONEGATE</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: G, letterSpacing: '3px', marginTop: '2px' }}>MOVING SOLUTIONS</div>
              <div style={{ fontSize: '9px', color: '#777', letterSpacing: '1.5px', marginTop: '5px' }}>PROFESSIONAL. RELIABLE. STRESS-FREE.</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: G, letterSpacing: '1px' }}>MOVING ESTIMATE</div>
            <table style={{ marginTop: '8px', marginLeft: 'auto', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ fontSize: '10px', fontWeight: 700, color: G, paddingRight: '10px', letterSpacing: '0.5px', paddingBottom: '2px' }}>ESTIMATE #:</td>
                  <td style={{ fontSize: '10px', color: '#333', paddingBottom: '2px' }}>{estimateNum}</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '10px', fontWeight: 700, color: G, paddingRight: '10px', letterSpacing: '0.5px' }}>DATE:</td>
                  <td style={{ fontSize: '10px', color: '#333' }}>{today}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: `2px solid ${G}`, marginBottom: '7mm' }} />

        {/* ── Info Section ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 220px', gap: '14px', marginBottom: '7mm' }}>
          {/* Customer */}
          <div>
            <SectionHeader icon={<PersonIcon />} title="CUSTOMER INFORMATION" />
            <InfoRow label="Name" value={order.customer_name} />
            <InfoRow label="Phone" value={order.phone} />
            <InfoRow label="Email" value={order.customer_email} />
            <InfoRow label="Move Date" value={`${moveDate}, ${moveTime}`} />
          </div>

          {/* Move Details */}
          <div>
            <SectionHeader icon={<TruckIcon />} title="MOVE DETAILS" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <PinIcon color="#254220" />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: G, letterSpacing: '0.5px' }}>FROM</span>
                </div>
                <div style={{ fontSize: '11px', color: '#333', marginBottom: '4px', lineHeight: 1.4 }}>{order.pickup_address}</div>
                <MoveDetailRow label="Type" value={sizeLabel} />
                <MoveDetailRow label="Elevator" value={order.pickup_has_elevator ? 'Yes' : 'No'} />
                <MoveDetailRow label="Floor" value={String(order.pickup_floor)} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <PinIcon color="#254220" />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: G, letterSpacing: '0.5px' }}>TO</span>
                </div>
                <div style={{ fontSize: '11px', color: '#333', marginBottom: '4px', lineHeight: 1.4 }}>{order.dropoff_address}</div>
                <MoveDetailRow label="Elevator" value={order.dropoff_has_elevator ? 'Yes' : 'No'} />
                <MoveDetailRow label="Floor" value={String(order.dropoff_floor)} />
              </div>
            </div>
          </div>

          {/* Estimated Total Box */}
          <div style={{ background: G, borderRadius: '8px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardIcon />
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '1.5px', marginTop: '8px', marginBottom: '8px' }}>ESTIMATED TOTAL</div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
              ${price.toFixed(2)}<span style={{ fontSize: '14px', fontWeight: 600, marginLeft: '3px' }}>CAD</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.25)', width: '100%', margin: '10px 0' }} />
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
              Estimated Time: {estHours} Hour{estHours !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
              Final cost will be based on the actual time spent on your move.
            </div>
          </div>
        </div>

        {/* ── Service & Pricing Table ── */}
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', marginBottom: '5mm' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderBottom: '1px solid #e0e0e0' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: G, letterSpacing: '1px' }}>SERVICE &amp; PRICING</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: G }}>
                {['#', 'DESCRIPTION', 'DETAILS', 'RATE', 'EST. HOURS', 'AMOUNT (CAD)'].map((h, i) => (
                  <th key={h} style={{ padding: '8px 12px', fontSize: '10px', fontWeight: 700, color: 'white', letterSpacing: '0.5px', textAlign: i === 0 ? 'center' : i >= 3 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>1</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MoversIcon />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>2 Movers + Truck</span>
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: '11px', color: '#555', lineHeight: 1.5 }}>
                  Includes moving crew, truck,<br />equipment, blankets, dollies<br />and all tools
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>${hourlyRate.toFixed(2)} / hr</td>
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>{estHours}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 700 }}>${baseAmount.toFixed(2)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>2</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClockIcon />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Travel Time</span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: '11px', color: '#555' }}>Travel time to and from locations</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>Included</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>-</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>Included</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>3</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FuelIcon />
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Fuel &amp; Mileage</span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: '11px', color: '#555' }}>Fuel costs and mileage</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>Included</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>-</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>Included</td>
              </tr>
              {additionalCharges > 0 && (
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>4</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Additional Charges</span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '11px', color: '#555' }}>Additional services or fees</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>-</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>-</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', fontWeight: 700 }}>${additionalCharges.toFixed(2)}</td>
                </tr>
              )}
              <tr style={{ borderTop: '1px solid #e0e0e0' }}>
                <td colSpan={5} style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600 }}>SUBTOTAL</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', fontWeight: 600 }}>${price.toFixed(2)}</td>
              </tr>
              <tr style={{ borderTop: '2px solid #e0e0e0', background: '#fafafa' }}>
                <td colSpan={5} style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 800 }}>ESTIMATED TOTAL (CAD)</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '15px', fontWeight: 800, color: G }}>${price.toFixed(2)}</td>
              </tr>
              <tr style={{ background: '#f0f7f3' }}>
                <td colSpan={6} style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: G }}>
                  All applicable taxes included (GST &amp; PST)
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ padding: '6px 14px', fontSize: '9px', color: '#aaa', letterSpacing: '1px', fontWeight: 600 }}>
            NO HIDDEN FEES. NO SURPRISES.
          </div>
        </div>

        {/* ── Contact Footer ── */}
        <div className="page-footer" style={{ marginTop: 'auto' }}>
          <div style={{ borderTop: '1.5px solid #e0e0e0', paddingTop: '8px', display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '8px' }}>
            <FooterContact icon={<PhoneIcon />} text="(604) 354-6479" />
            <div style={{ width: '1px', background: '#ccc' }} />
            <FooterContact icon={<MailIcon />} text="orders@stonegatemoving.com" />
            <div style={{ width: '1px', background: '#ccc' }} />
            <FooterContact icon={<GlobeIcon />} text="www.stonegatemoving.com" />
          </div>

          {/* Sign-off */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontFamily: "'Dancing Script', Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontSize: '20px', color: G, fontWeight: 700 }}>
              We look forward to moving with you!
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Helper components ── */

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
      {icon}
      <span style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.5px' }}>{title}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a1a', minWidth: '72px' }}>{label}:</span>
      <span style={{ fontSize: '11px', color: '#333' }}>{value}</span>
    </div>
  )
}

function MoveDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '3px' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a', minWidth: '52px' }}>{label}:</span>
      <span style={{ fontSize: '10px', color: '#555' }}>{value}</span>
    </div>
  )
}

function PaymentMethod({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      {icon}
      <span style={{ fontSize: '9px', color: '#555', textAlign: 'center' }}>{label}</span>
    </div>
  )
}

function FooterContact({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {icon}
      <span style={{ fontSize: '10px', color: '#555' }}>{text}</span>
    </div>
  )
}

function CheckBadge({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="7" fill={color} />
      <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function ClipboardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1" /><rect x="3" y="5" width="18" height="17" rx="2" /><path d="M9 12h6M9 16h4" />
    </svg>
  )
}

function DollarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#254220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v12M9 9a3 3 0 016 0c0 1.66-1.34 3-3 3s-3 1.34-3 3a3 3 0 006 0" />
    </svg>
  )
}

function PinIcon({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function MoversIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="5" r="2" /><path d="M6 20v-5a3 3 0 016 0v5" /><circle cx="17" cy="5" r="2" /><path d="M14 20v-5a3 3 0 016 0v5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function FuelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V7a2 2 0 012-2h6a2 2 0 012 2v15" /><path d="M3 11h10" /><path d="M13 7l2-2 2 2v7a2 2 0 01-2 2h-2" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#254220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function CheckCircleOutlineIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#254220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function CreditCardSvg() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function ETransferSvg() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v12M9 9a3 3 0 016 0c0 1.66-1.34 3-3 3s-3 1.34-3 3a3 3 0 006 0" />
    </svg>
  )
}

function CashSvg() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="22" height="14" rx="2" /><circle cx="12" cy="13" r="3" /><path d="M5 6V4M19 6V4" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  )
}
