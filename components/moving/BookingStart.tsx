'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Phone } from 'lucide-react'
import { ORDER_START_KEY, type OrderStart } from '@/lib/types'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'

const inputClass =
  'w-full min-w-0 rounded-full min-h-[44px] sm:min-h-[52px] px-4 sm:px-5 text-[16px] font-semibold border-0 outline-none transition-shadow focus:shadow-[0_0_0_3px_#C98A45] placeholder:font-medium placeholder:text-[#8A7E74]'

/**
 * Pickup (and on wider screens drop-off) plus Next, on the hero photo. The answers carry over into
 * /order through session storage rather than the URL, so home addresses stay out of links and logs.
 * Phones get one field and no call button here: the header already has Call.
 */
export default function BookingStart({ id }: { id?: string }) {
  const router = useRouter()
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')

  function start(e: FormEvent) {
    e.preventDefault()
    const answers: OrderStart = {
      pickupAddress: pickup.trim() || undefined,
      dropoffAddress: dropoff.trim() || undefined,
    }
    try { sessionStorage.setItem(ORDER_START_KEY, JSON.stringify(answers)) } catch {}
    router.push('/order')
  }

  return (
    <div id={id} className="w-full max-w-[640px]">
      <form onSubmit={start} aria-label="Start your booking">
        <p className="mb-2.5 text-[16px] sm:text-[17px] font-bold [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]" style={{ color: '#FFFFFF' }}>
          Check your moving date:
        </p>
        <div className="flex gap-2 sm:gap-2.5 max-w-[330px] sm:max-w-none">
          <label className="flex-1 min-w-0">
            <span className="sr-only">Moving from</span>
            <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Moving from" autoComplete="street-address" className={inputClass} style={{ backgroundColor: '#FAF7F2', color: '#1A1714' }} />
          </label>
          <label className="hidden sm:block flex-1 min-w-0">
            <span className="sr-only">Moving to</span>
            <input value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Moving to" className={inputClass} style={{ backgroundColor: '#FAF7F2', color: '#1A1714' }} />
          </label>
          <button
            type="submit"
            className="shrink-0 flex items-center justify-center gap-1.5 rounded-full min-h-[44px] sm:min-h-[52px] px-4 sm:px-7 text-[15px] sm:text-[17px] font-extrabold transition-[transform,background-color] duration-150 active:scale-[0.97] hover:bg-[#00341A]"
            style={{ backgroundColor: '#014421', color: '#FAF7F2' }}
          >
            Next <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </form>
      <PhoneLink
        className="hidden sm:inline-flex items-center gap-2 mt-3 rounded-full min-h-[48px] px-5 text-[16px] font-bold [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] transition-[transform,border-color] duration-150 active:scale-[0.97] border-2 border-[#2F7A4D] hover:border-[#4CA372]"
        style={{ color: '#FFFFFF', fontVariantNumeric: 'lining-nums tabular-nums' }}
      >
        <Phone size={16} fill="currentColor" aria-hidden />
        Call <PhoneNumber />
      </PhoneLink>
    </div>
  )
}
