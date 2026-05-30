import { APARTMENT_SIZE_LABELS, type ApartmentSize, type OrderFormData } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 text-sm">
      <span className="text-zinc-500 w-40 shrink-0">{label}</span>
      <span className="text-zinc-900 font-medium text-right">{value}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide pt-4 pb-1">{children}</p>
  )
}

export default function OrderSummary({ order }: { order: OrderFormData }) {
  const sizeLabel = APARTMENT_SIZE_LABELS[order.apartmentSize as ApartmentSize] ?? order.apartmentSize
  const formattedDate = order.movingDate
    ? new Date(order.movingDate).toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—'

  const formattedTime = order.movingTime
    ? new Date(`1970-01-01T${order.movingTime}`).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      })
    : '—'

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-zinc-900">Order summary</h2>
        <Badge variant="secondary">Pending confirmation</Badge>
      </div>

      <Separator className="mb-2" />

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
          <p className="text-sm text-zinc-700 py-1">{order.specialNotes}</p>
        </>
      )}
    </div>
  )
}
