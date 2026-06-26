import { createServiceClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import StatusSelect from '../_components/StatusSelect'
import DeleteButton from '../_components/DeleteButton'
import AddServiceOrderModal from '../_components/AddServiceOrderModal'
import StatusFilter from '../_components/StatusFilter'

export const dynamic = 'force-dynamic'

export default async function BinCleaningPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const supabase = createServiceClient()
  let query = supabase.from('service_orders').select('*').eq('order_type', 'bin_cleaning').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data: orders } = await query

  return (
    <div className="bc-wrap" style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative', left: '-50px' }}>
      <style>{`
        .bc-table { display: block; }
        .bc-cards { display: none; }
        @media (max-width: 768px) {
          .bc-wrap { left: 0 !important; padding: 16px 12px !important; }
          .bc-table { display: none; }
          .bc-cards { display: flex; flex-direction: column; gap: 12px; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ color: '#254220', fontSize: '20px', fontWeight: 700, margin: 0 }}>
          Bin Cleaning Orders
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#9A8E83', marginLeft: '8px' }}>
            ({orders?.length ?? 0} total)
          </span>
        </h1>
        <AddServiceOrderModal orderType="bin_cleaning" />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Suspense><StatusFilter /></Suspense>
      </div>

      {/* Desktop Table */}
      <div className="bc-table" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F5F0EB' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#254220' }}>
              {['Order #', 'Submitted', 'Customer', 'Service Date', 'Status', ''].map((h, i) => (
                <th key={h || i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'white', letterSpacing: '0.5px', whiteSpace: 'nowrap', borderRadius: i === 0 ? '11px 0 0 0' : i === 5 ? '0 11px 0 0' : undefined }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, i) => {
              const year = new Date(order.created_at).getFullYear()
              const num = String(order.order_number ?? (i + 1)).padStart(4, '0')
              const orderNum = `BC-${year}-${num}`
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #F5F0EB' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 700, color: '#254220', whiteSpace: 'nowrap' }}>{orderNum}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B5E54', whiteSpace: 'nowrap' }}>{new Date(order.created_at).toLocaleDateString('en-CA')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1714' }}>{order.customer_name}</div>
                    <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.customer_email}</div>
                    <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.phone}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#1A1714', whiteSpace: 'nowrap' }}>{new Date(order.service_date + 'T12:00:00').toLocaleDateString('en-CA')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusSelect orderId={order.id} current={order.status} apiPath="/api/admin/service-orders" />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <DeleteButton orderId={order.id} customerName={order.customer_name} apiPath="/api/admin/service-orders" />
                  </td>
                </tr>
              )
            })}
            {(!orders || orders.length === 0) && (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9A8E83', fontSize: '14px' }}>No bin cleaning orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="bc-cards">
        {(!orders || orders.length === 0) && (
          <p style={{ textAlign: 'center', color: '#9A8E83', fontSize: '14px', padding: '32px 0' }}>No bin cleaning orders yet.</p>
        )}
        {orders?.map((order, i) => {
          const year = new Date(order.created_at).getFullYear()
          const num = String(order.order_number ?? (i + 1)).padStart(4, '0')
          const orderNum = `BC-${year}-${num}`
          return (
            <div key={order.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F5F0EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#254220' }}>{orderNum}</span>
                <StatusSelect orderId={order.id} current={order.status} apiPath="/api/admin/service-orders" />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1714' }}>{order.customer_name}</div>
                <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.customer_email}</div>
                <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.phone}</div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', color: '#9A8E83', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '2px' }}>SERVICE DATE</div>
                <div style={{ fontSize: '13px', color: '#1A1714' }}>{new Date(order.service_date + 'T12:00:00').toLocaleDateString('en-CA')}</div>
              </div>
              <div style={{ borderTop: '1px solid #F5F0EB', paddingTop: '12px' }}>
                <DeleteButton orderId={order.id} customerName={order.customer_name} apiPath="/api/admin/service-orders" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
