import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import LogoutButton from './LogoutButton'
import DeleteButton from './DeleteButton'
import StatusSelect from './StatusSelect'
import { APARTMENT_SIZE_LABELS, type ApartmentSize } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createServiceClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <header style={{ background: '#254220', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Image src="/logo.png" alt="Stonegate" width={38} height={38} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '16px', lineHeight: 1 }}>Admin Dashboard</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '2px' }}>Stonegate Moving Solutions</div>
          </div>
        </div>
        <LogoutButton />
      </header>

      <main style={{ padding: '32px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#254220', fontSize: '22px', fontWeight: 700, margin: 0 }}>
            Move Orders
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#9A8E83', marginLeft: '10px' }}>
              ({orders?.length ?? 0} total)
            </span>
          </h1>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F5F0EB' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#254220' }}>
                {['Order #', 'Submitted', 'Customer', 'Move Date', 'Size', 'Status', 'Quote', ''].map((h, i) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'white', letterSpacing: '0.5px', whiteSpace: 'nowrap', borderRadius: i === 0 ? '11px 0 0 0' : i === 7 ? '0 11px 0 0' : undefined }}>{h}</th>
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
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B5E54', whiteSpace: 'nowrap' }}>
                      {new Date(order.created_at).toLocaleDateString('en-CA')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1714' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.customer_email}</div>
                      <div style={{ fontSize: '12px', color: '#9A8E83' }}>{order.phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#1A1714', whiteSpace: 'nowrap' }}>
                      {new Date(order.moving_date + 'T12:00:00').toLocaleDateString('en-CA')}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B5E54', whiteSpace: 'nowrap' }}>{sizeLabel}</td>
                    <td style={{ padding: '14px 16px' }}><StatusSelect orderId={order.id} current={order.status} /></td>
                    <td style={{ padding: '14px 16px' }}>
                      {order.estimated_price != null ? (
                        <span style={{ background: '#D6E8D3', color: '#254220', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          ${Number(order.estimated_price).toFixed(2)}
                        </span>
                      ) : (
                        <span style={{ background: '#F5F0EB', color: '#9A8E83', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Link
                          href={`/admin/quote/${order.id}`}
                          style={{ background: '#254220', color: 'white', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
                        >
                          {order.estimated_price != null ? 'Edit Quote' : 'Generate Quote'}
                        </Link>
                        <DeleteButton orderId={order.id} customerName={order.customer_name} />
                      </div>
                    </td>
                  </tr>
                )
              })}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#9A8E83', fontSize: '14px' }}>
                    No orders yet. They will appear here when customers submit the booking form.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
