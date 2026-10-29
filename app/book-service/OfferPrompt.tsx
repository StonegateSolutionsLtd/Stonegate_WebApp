'use client'

import { Button } from '@/components/ui/button'
import { offerMessage, type BestOffer } from '@/lib/quote-offer'
import { SLOT_STEP_MIN, formatSlotRange, timeToMinutes } from '@/lib/scheduling'

// Shown once the chat is done, before the request is sent: a cheaper slot the
// same day that fits our route better.
export default function OfferPrompt({ best, pickedTime, loadSize, submitting, onAccept, onDecline }: {
  best: BestOffer
  pickedTime: string
  loadSize: string
  submitting: boolean
  onAccept: () => void
  onDecline: () => void
}) {
  const picked = formatSlotRange(timeToMinutes(pickedTime), SLOT_STEP_MIN)
  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
      <span
        className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 rounded-full px-3 py-1"
        style={{ color: '#9A4B12', backgroundColor: '#FDE4C8' }}
      >
        Save ${best.basePrice - best.offer.price}
      </span>
      <p className="text-lg font-bold leading-snug mb-3" style={{ color: '#1A1714' }}>
        {offerMessage(pickedTime, best)}
      </p>
      <p className="text-sm mb-6" style={{ color: '#6B5E54' }}>
        That time fits our crew&apos;s route better, so it costs us less and we pass the saving on. Estimated
        price for a {loadSize} load; our team confirms the load size on site before starting.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          onClick={onAccept}
          disabled={submitting}
          className="rounded-full text-sm font-bold py-6 border-0 flex-1"
          style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
        >
          {submitting ? 'Sending…' : `Yes, move it to ${best.offer.label}`}
        </Button>
        <Button
          type="button"
          onClick={onDecline}
          disabled={submitting}
          className="rounded-full text-sm font-bold py-6 flex-1"
          style={{ backgroundColor: '#FFFFFF', color: '#254220', border: '1.5px solid #254220' }}
        >
          No, keep {picked}
        </Button>
      </div>
    </div>
  )
}
