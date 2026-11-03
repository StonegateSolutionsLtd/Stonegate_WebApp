import { moveDateLabel, moveSizeLabel, moveTypeLabel, type OrderFormData } from '@/lib/types'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 text-sm">
      <span className="w-32 shrink-0" style={{ color: '#9A8E83' }}>{label}</span>
      <span className="font-medium text-right" style={{ color: '#1A1714' }}>{value}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest pt-4 pb-1" style={{ color: '#254220' }}>{children}</p>
  )
}

export default function OrderSummary({ order }: { order: OrderFormData }) {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: '#F0EBE3', border: '1px solid #E8E0D5' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold" style={{ color: '#1A1714' }}>Estimate request</h2>
        <span
          className="text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
          style={{ color: '#254220', borderColor: '#B5C9B0' }}
        >
          Free
        </span>
      </div>

      <div style={{ borderTop: '1px solid #D9CFC4', marginTop: '8px' }} />

      <SectionTitle>Move details</SectionTitle>
      <Row label="Type" value={moveTypeLabel(order.moveType)} />
      {order.moveType !== 'small' && <Row label="Size" value={moveSizeLabel(order.moveType, order.moveSize, order.apartmentSize)} />}
      <Row label="Moving date" value={moveDateLabel(order.dateFlex, order.movingDate, order.movingTime)} />

      <SectionTitle>Addresses</SectionTitle>
      <Row label="Pickup" value={order.pickupAddress} />
      <Row label="Drop-off" value={order.dropoffAddress} />

      <SectionTitle>Contact</SectionTitle>
      <Row label="Name" value={order.customerName} />
      <Row label="Email" value={order.customerEmail} />
      <Row label="Phone" value={order.phone} />

      {order.specialNotes && (
        <>
          <SectionTitle>Notes</SectionTitle>
          <p className="text-sm py-1" style={{ color: '#6B5E54' }}>{order.specialNotes}</p>
        </>
      )}
    </div>
  )
}
