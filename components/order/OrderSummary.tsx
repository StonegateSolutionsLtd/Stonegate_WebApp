import { APARTMENT_SIZE_LABELS, type ApartmentSize, type OrderFormData } from '@/lib/types'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 text-sm">
      <span className="w-40 shrink-0" style={{ color: '#9A8E83' }}>{label}</span>
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
  const sizeLabel = APARTMENT_SIZE_LABELS[order.apartmentSize as ApartmentSize] ?? order.apartmentSize
  const formattedDate = order.movingDate
    ? new Date(order.movingDate).toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'Not set'

  const formattedTime = order.movingTime
    ? new Date(`1970-01-01T${order.movingTime}`).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      })
    : 'Not set'

  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: '#F0EBE3', border: '1px solid #E8E0D5' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold" style={{ color: '#1A1714' }}>Order summary</h2>
        <span
          className="text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
          style={{ color: '#254220', borderColor: '#B5C9B0' }}
        >
          Pending
        </span>
      </div>

      <div style={{ borderTop: '1px solid #D9CFC4', marginTop: '8px' }} />

      <SectionTitle>Pickup</SectionTitle>
      <Row label="Address" value={order.pickupAddress} />
      <Row label="Floor" value={order.pickupFloor} />
      <Row label="Elevator" value={order.pickupHasElevator ? 'Yes' : 'No'} />

      <SectionTitle>Drop-off</SectionTitle>
      <Row label="Address" value={order.dropoffAddress} />
      <Row label="Floor" value={order.dropoffFloor} />
      <Row label="Elevator" value={order.dropoffHasElevator ? 'Yes' : 'No'} />

      <SectionTitle>Move details</SectionTitle>
      <Row label="Apartment size" value={sizeLabel} />
      <Row label="Moving date" value={formattedDate} />
      <Row label="Arrival time" value={formattedTime} />

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



