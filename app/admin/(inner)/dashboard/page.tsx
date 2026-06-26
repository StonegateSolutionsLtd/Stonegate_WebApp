import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import StatusSelect from '../_components/StatusSelect'
import DeleteButton from '../_components/DeleteButton'
import AddMovingOrderModal from '../_components/AddMovingOrderModal'
import StatusFilter from '../_components/StatusFilter'
import { APARTMENT_SIZE_LABELS, type ApartmentSize } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function MovingOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const supabase = createServiceClient()
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data: orders } = await query

  return (
    <div className="mo-wrap" style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative', left: '-50px' }}>
      <style>{`
        .mo-table { display: block; }
        .mo-cards { display: none; }
        @media (max-width: 768px) {
          .mo-wrap { left: 0 !important; padding: 16px 12px !important; }
          .mo-table { display: none; }
          .mo-cards { display: flex; flex-direction: column; gap: 12px; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ color: '#254220', fontSize: '20px', fontWeight: 700, margin: 0 }}>
          Moving Orders
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#9A8E83', marginLeft: '8px' }}>
            ({orders?.length ?? 0} total)
          </span>
        </h1>
        <AddMovingOrderModal />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Suspense><StatusFilter /></Suspense>
      </div>

      {/* Desktop Table */}
      <div className="mo-table" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F5F0EB' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#254220' }}>
              {['Order #', 'Submitted', 'Customer', 'Move Date', 'Size', 'Status', 'Quote', ''].map((h, i) => (
                <th key={h || i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'white', letterSpacing: '0.5px', whiteSpace: 'nowrap', borderRadius: i === 0 ? '11px 0 0 0' : i === 7 ? '0 11px 0 0' : undefined }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, i) => {
              const year = new Date(order.created_at).getFullYear()
              const num = String(order.order_number ?? (i + 1)).padStart(4, '0')
              const orderNum = `SG-${year}-${num}`
              const sizeLabel = APARTMENT_SIZE_LABELS[order.apartment_size as ApartmentSize] ?? order.apartment_size
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #F5F0EB' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 700, color: '#254220', whiteSpace: 'nowrap' }}>{orderNum}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B5E54', whiteSpace: 'nowrap' }}>{new Date(order.created_at).toLocaleDateString('en-CA')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1714' }}>{order.customer_name}</div>
                    <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.customer_email}</div>
                    <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.phone}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#1A1714', whiteSpace: 'nowrap' }}>{new Date(order.moving_date + 'T12:00:00').toLocaleDateString('en-CA')}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B5E54', whiteSpace: 'nowrap' }}>{sizeLabel}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusSelect orderId={order.id} current={order.status} apiPath="/api/admin/orders" />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {order.estimated_price != null ? (
                      <span style={{ background: '#D6E8D3', color: '#254220', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>${Number(order.estimated_price).toFixed(2)}</span>
                    ) : (
                      <span style={{ background: '#F5F0EB', color: '#9A8E83', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Pending</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {order.estimated_price != null && (
                        <Link href={`/admin/quote/${order.id}/print`} target="_blank" style={{ background: 'white', color: '#254220', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1.5px solid #254220' }}>
                          View PDF
                        </Link>
                      )}
                      <Link href={`/admin/quote/${order.id}`} style={{ background: '#254220', color: 'white', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                        {order.estimated_price != null ? 'Edit' : 'Generate Quote'}
                      </Link>
                      <DeleteButton orderId={order.id} customerName={order.customer_name} apiPath="/api/admin/orders" />
                    </div>
                  </td>
                </tr>
              )
            })}
            {(!orders || orders.length === 0) && (
              <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#9A8E83', fontSize: '14px' }}>No moving orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mo-cards">
        {(!orders || orders.length === 0) && (
          <p style={{ textAlign: 'center', color: '#9A8E83', fontSize: '14px', padding: '32px 0' }}>No moving orders yet.</p>
        )}
        {orders?.map((order, i) => {
          const year = new Date(order.created_at).getFullYear()
          const num = String(order.order_number ?? (i + 1)).padStart(4, '0')
          const orderNum = `SG-${year}-${num}`
          const sizeLabel = APARTMENT_SIZE_LABELS[order.apartment_size as ApartmentSize] ?? order.apartment_size
          return (
            <div key={order.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F5F0EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#254220' }}>{orderNum}</span>
                <StatusSelect orderId={order.id} current={order.status} apiPath="/api/admin/orders" />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1714' }}>{order.customer_name}</div>
                <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.customer_email}</div>
                <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.phone}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#9A8E83', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '2px' }}>MOVE DATE</div>
                  <div style={{ fontSize: '13px', color: '#1A1714' }}>{new Date(order.moving_date + 'T12:00:00').toLocaleDateString('en-CA')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#9A8E83', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '2px' }}>SIZE</div>
                  <div style={{ fontSize: '13px', color: '#1A1714' }}>{sizeLabel}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#9A8E83', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '2px' }}>SUBMITTED</div>
                  <div style={{ fontSize: '13px', color: '#1A1714' }}>{new Date(order.created_at).toLocaleDateString('en-CA')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#9A8E83', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '2px' }}>QUOTE</div>
                  {order.estimated_price != null ? (
                    <span style={{ background: '#D6E8D3', color: '#254220', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>${Number(order.estimated_price).toFixed(2)}</span>
                  ) : (
                    <span style={{ background: '#F5F0EB', color: '#9A8E83', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Pending</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F5F0EB', paddingTop: '12px' }}>
                {order.estimated_price != null && (
                  <Link href={`/admin/quote/${order.id}/print`} target="_blank" style={{ flex: 1, background: 'white', color: '#254220', padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', textAlign: 'center', border: '1.5px solid #254220' }}>
                    View PDF
                  </Link>
                )}
                <Link href={`/admin/quote/${order.id}`} style={{ flex: 1, background: '#254220', color: 'white', padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                  {order.estimated_price != null ? 'Edit' : 'Generate Quote'}
                </Link>
                <DeleteButton orderId={order.id} customerName={order.customer_name} apiPath="/api/admin/orders" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
