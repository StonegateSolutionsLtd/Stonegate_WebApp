import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PrintButton from './PrintButton'

const TYPE_LABELS: Record<string, string> = {
  junk_removal: 'JUNK REMOVAL',
  bin_cleaning: 'BIN CLEANING',
}

const ORDER_PREFIXES: Record<string, string> = {
  junk_removal: 'JR',
  bin_cleaning: 'BC',
}

export async function generateMetadata({ params }: { params: Promise<{ orderId: string }> }): Promise<Metadata> {
  const { orderId } = await params
  const supabase = createServiceClient()
  const { data: order } = await supabase.from('service_orders').select('order_number,created_at,order_type').eq('id', orderId).single()
  if (!order) return { title: 'Quote' }
  const year = new Date(order.created_at).getFullYear()
  const num = String(order.order_number ?? '001').padStart(4, '0')
  const prefix = ORDER_PREFIXES[order.order_type] ?? 'SG'
  return { title: `${TYPE_LABELS[order.order_type] ?? 'Service'} Estimate ${prefix}-${year}-${num}` }
}

export default async function ServicePrintPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('service_orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order || order.estimated_price == null) notFound()

  const year = new Date(order.created_at).getFullYear()
  const num = String(order.order_number ?? '001').padStart(4, '0')
  const prefix = ORDER_PREFIXES[order.order_type] ?? 'SG'
  const estimateNum = `${prefix}-${year}-${num}`
  const typeLabel = TYPE_LABELS[order.order_type] ?? 'SERVICE'
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const serviceDate = new Date(order.service_date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const serviceTime = new Date(`1970-01-01T${order.service_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  const isJunk = order.order_type === 'junk_removal'
  const price = Number(order.estimated_price)
  const hourlyRate = Number(order.hourly_rate ?? 80)
  const estHours = Number(order.estimated_hours)
  const additionalCharges = Math.round(Math.max(0, Number(order.additional_fees ?? 0)) * 100) / 100
  const baseAmount = isJunk
    ? Math.round(hourlyRate * 100) / 100          // load price stored in hourly_rate
    : Math.round(estHours * hourlyRate * 100) / 100

  // Map load price back to a label for the PDF
  const LOAD_MAP: [number, string][] = [[99,'1/8 Truck'],[175,'1/4 Truck'],[275,'1/2 Truck'],[375,'3/4 Truck'],[475,'Full Truck']]
  const loadLabel = LOAD_MAP.find(([p]) => p === hourlyRate)?.[1] ?? 'Custom Load'

  const G = '#254220'

  const printCss = `
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&family=Dancing+Script:wght@700&display=swap');
    body { background: #f0f0f0; font-family: 'Raleway', 'Segoe UI', Arial, sans-serif; }
    .toolbar { background: #254220; padding: 10px 20px; display: flex; justify-content: flex-end; position: sticky; top: 0; z-index: 10; }
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

      <div className="toolbar">
        <PrintButton />
      </div>

      <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
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
            <div style={{ fontSize: '24px', fontWeight: 800, color: G, letterSpacing: '1px' }}>{typeLabel} ESTIMATE</div>
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

        <div style={{ borderTop: `2px solid ${G}`, marginBottom: '7mm' }} />

        {/* Info Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px', marginBottom: '7mm' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <PersonIcon />
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.5px' }}>CUSTOMER INFORMATION</span>
            </div>
            <InfoRow label="Name" value={order.customer_name} />
            <InfoRow label="Phone" value={order.phone} />
            <InfoRow label="Email" value={order.customer_email} />
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ServiceIcon />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.5px' }}>SERVICE DETAILS</span>
              </div>
              <InfoRow label="Service" value={typeLabel.replace('_', ' ')} />
              <InfoRow label="Address" value={order.address} />
              <InfoRow label="Date" value={`${serviceDate}, ${serviceTime}`} />
              {order.notes && <InfoRow label="Notes" value={order.notes} />}
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
            {isJunk ? (
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                Load Size: {loadLabel}
              </div>
            ) : (
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                Estimated Time: {estHours} Hour{estHours !== 1 ? 's' : ''}
              </div>
            )}
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
              {isJunk ? 'Price is based on truck space used.' : 'Final cost is based on actual time spent.'}
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', marginBottom: '5mm' }}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid #e0e0e0' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: G, letterSpacing: '1px' }}>SERVICE &amp; PRICING</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: G }}>
                {(isJunk
                  ? ['#', 'DESCRIPTION', 'LOAD SIZE', 'BASE PRICE', 'AMOUNT (CAD)']
                  : ['#', 'DESCRIPTION', 'DETAILS', 'RATE', 'EST. HOURS', 'AMOUNT (CAD)']
                ).map((h, i, arr) => (
                  <th key={h} style={{ padding: '8px 12px', fontSize: '10px', fontWeight: 700, color: 'white', letterSpacing: '0.5px', textAlign: i === 0 ? 'center' : i >= arr.length - 2 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isJunk ? (
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>1</td>
                  <td style={{ padding: '12px', fontSize: '12px', fontWeight: 700 }}>Junk Removal Service</td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#333', fontWeight: 600 }}>{loadLabel}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>${baseAmount.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 700 }}>${baseAmount.toFixed(2)}</td>
                </tr>
              ) : (
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>1</td>
                  <td style={{ padding: '12px', fontSize: '12px', fontWeight: 700 }}>Bin Cleaning Service</td>
                  <td style={{ padding: '12px', fontSize: '11px', color: '#555', lineHeight: 1.5 }}>Includes crew, equipment,<br />and all necessary supplies</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>${hourlyRate.toFixed(2)} / hr</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>{estHours}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 700 }}>${baseAmount.toFixed(2)}</td>
                </tr>
              )}
              {additionalCharges > 0 && (
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>2</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 700 }}>Additional Charges</td>
                  {!isJunk && <td style={{ padding: '10px 12px', fontSize: '11px', color: '#555' }}>Additional services or fees</td>}
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>-</td>
                  {!isJunk && <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555' }}>-</td>}
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

        {/* Footer */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ borderTop: '1.5px solid #e0e0e0', paddingTop: '8px', display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '8px' }}>
            <FooterContact icon={<PhoneIcon />} text="(604) 354-6479" />
            <div style={{ width: '1px', background: '#ccc' }} />
            <FooterContact icon={<MailIcon />} text="orders@stonegatemoving.com" />
            <div style={{ width: '1px', background: '#ccc' }} />
            <FooterContact icon={<GlobeIcon />} text="www.stonegatemoving.com" />
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontFamily: "'Dancing Script', Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontSize: '20px', color: G, fontWeight: 700 }}>
              Thank you for choosing Stonegate!
            </span>
          </div>
        </div>
      </div>
    </>
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

function FooterContact({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {icon}
      <span style={{ fontSize: '10px', color: '#555' }}>{text}</span>
    </div>
  )
}

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function ServiceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
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
