'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Clock, Users, Phone } from 'lucide-react'
import { ORDER_START_KEY, APARTMENT_SIZE_LABELS, type ApartmentSize, type OrderStart } from '@/lib/types'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'

const GREEN = '#014421'
const INK = '#1A1714'
const MUTED = '#6B5E54'
const CREAM = '#FAF7F2'
const CLAY = '#C98A45'

const MIN_HOURS = 3

/**
 * Average times from our own moves (1-bedroom 3-6 h, 2-bedroom 4-9 h, the same figures as the moving-time guide).
 * Homes bigger than a 2-bedroom apartment take about 6 hours to a full day, so they show a "from" price and a call instead.
 */
const ESTIMATES: Record<ApartmentSize, { crew: 2 | 3; hours: [number, number] | null }> = {
  studio: { crew: 2, hours: [3, 3] },
  '1br': { crew: 2, hours: [3, 6] },
  '2br': { crew: 2, hours: [4, 9] },
  '3br': { crew: 3, hours: null },
  '4br+': { crew: 3, hours: null },
}

const RATE = { 2: 130, 3: 170 } as const
const CREW_LABEL = { 2: '2 movers + truck', 3: '3 movers + 16\' truck' } as const
/** Bigger homes: about 6 hours to a full day */
const BIG_HOME_MIN_HOURS = 6

const money = (n: number) => `$${n.toLocaleString('en-CA')}`

/** Pick a home size, see the crew, typical hours and the hourly cost; Book carries the size into /order */
export default function PriceEstimator() {
  const router = useRouter()
  const [size, setSize] = useState<ApartmentSize>('1br')
  const { crew, hours } = ESTIMATES[size]
  const rate = RATE[crew]

  function book() {
    const start: OrderStart = { apartmentSize: size }
    try { sessionStorage.setItem(ORDER_START_KEY, JSON.stringify(start)) } catch {}
    router.push('/order')
  }

  return (
    <div className="rounded-3xl p-5 sm:p-8 lg:p-10 grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 18px 48px -24px rgba(26,23,20,0.25)' }}>
      <div>
        <p className="font-bold text-lg mb-4" style={{ color: INK }}>How big is your home?</p>
        <div role="radiogroup" aria-label="Home size" className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-2.5">
          {(Object.keys(ESTIMATES) as ApartmentSize[]).map(k => {
            const on = k === size
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setSize(k)}
                className="rounded-2xl min-h-[60px] px-3 text-[15px] font-bold transition-[transform,background-color,color] duration-150 active:scale-[0.97]"
                style={on
                  ? { backgroundColor: GREEN, color: CREAM }
                  : { backgroundColor: '#F5F0EB', color: INK }}
              >
                {APARTMENT_SIZE_LABELS[k]}
              </button>
            )
          })}
        </div>
        <p className="mt-5 text-sm leading-relaxed" style={{ color: MUTED }}>
          An estimate from typical moves. You pay for the hours worked, plus GST and a one-time travel fee. The travel fee covers the truck&apos;s drive to you and back, is fixed, and is confirmed before your move.
        </p>
      </div>

      {/* Keyed so the result fades in fresh on every choice */}
      <div key={size} className="rounded-2xl p-6 sm:p-7 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ backgroundColor: GREEN }} aria-live="polite">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5">
          <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#B5C9B0' }}>
            <Users size={16} aria-hidden /> {CREW_LABEL[crew]} · ${rate}/hr
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#B5C9B0' }}>
            <Clock size={16} aria-hidden /> {hours ? (hours[0] === hours[1] ? `About ${hours[0]} hours` : `${hours[0]}–${hours[1]} hours`) : 'About 6 hours to a full day'}
          </span>
        </div>
        {hours ? (
          <p className="flex flex-wrap items-end gap-x-2 leading-none" style={{ color: CREAM }}>
            <span className="text-[2.6rem] min-[400px]:text-5xl sm:text-6xl font-extrabold tracking-tight whitespace-nowrap">
              {money(rate * Math.max(MIN_HOURS, hours[0]))}{hours[1] > hours[0] && <>–{money(rate * hours[1])}</>}
            </span>
            <span className="text-base font-semibold mb-1.5" style={{ color: '#B5C9B0' }}>+ fixed travel fee + GST</span>
          </p>
        ) : (
          <p className="flex flex-wrap items-end gap-x-2 leading-none" style={{ color: CREAM }}>
            <span className="text-base font-semibold mb-2" style={{ color: '#B5C9B0' }}>From</span>
            <span className="text-[2.6rem] min-[400px]:text-5xl sm:text-6xl font-extrabold tracking-tight whitespace-nowrap">{money(rate * BIG_HOME_MIN_HOURS)}</span>
            <span className="text-base font-semibold mb-1.5" style={{ color: '#B5C9B0' }}>+ fixed travel fee + GST</span>
          </p>
        )}
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#D6E2D3' }}>
          {hours
            ? `On average, ${APARTMENT_SIZE_LABELS[size].toLowerCase()} moves take ${hours[0] === hours[1] ? `about ${hours[0]} hours` : `${hours[0]} to ${hours[1]} hours`}. Stairs, elevators and how close the truck can park decide where yours lands.`
            : 'Bigger homes take from about 6 hours to a full day, depending on stairs, access and how much is moving. Call us with your list for a closer estimate.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={book}
            className="flex items-center justify-center gap-2 rounded-full min-h-[54px] px-7 font-extrabold transition-[transform,background-color] duration-150 active:scale-[0.97] hover:bg-white"
            style={{ backgroundColor: CREAM, color: GREEN }}
          >
            Request a Free Estimate <ArrowRight size={18} aria-hidden />
          </button>
          <PhoneLink
            className="flex items-center justify-center gap-2 rounded-full min-h-[54px] px-6 font-bold border-2 transition-[transform,background-color] duration-150 active:scale-[0.97] hover:bg-white/10"
            style={{ color: CREAM, borderColor: CLAY, fontVariantNumeric: 'lining-nums tabular-nums' }}
          >
            <Phone size={16} fill="currentColor" aria-hidden /> <PhoneNumber />
          </PhoneLink>
        </div>
      </div>
    </div>
  )
}
