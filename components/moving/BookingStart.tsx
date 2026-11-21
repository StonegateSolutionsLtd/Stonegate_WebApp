'use client'

import { useState, useSyncExternalStore, type FormEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { ORDER_START_KEY, type OrderStart } from '@/lib/types'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import { formLocationFor, trackEvent } from '@/lib/analytics'
import AddressAutocomplete from '@/components/AddressAutocomplete'

const inputClass =
  'w-full min-w-0 bg-transparent min-h-[48px] sm:min-h-[54px] text-[16px] sm:text-[17px] font-semibold border-0 outline-none placeholder:font-medium placeholder:text-[#8A82A0]'

/**
 * One pickup field (city or postal code) plus Next, in a white card on the hero photo. The answers carry over into
 * /order through session storage rather than the URL, so home addresses stay out of links and logs.
 * Phones get one field and no call button here: the header already has Call.
 */
/** `center` for a centred card (the homepage); `titleClassName` sets the headline's typeface */
/** `hideTitle` keeps the heading for screen readers only (where the form explains itself, e.g. the homepage card) */
// Desktop has room for the full placeholder; narrow fields use the short one so it isn't cut off
const wideQuery = '(min-width: 1024px)'
const subscribeWide = (cb: () => void) => { const m = window.matchMedia(wideQuery); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) }
const useWide = () => useSyncExternalStore(subscribeWide, () => window.matchMedia(wideQuery).matches, () => false)

export default function BookingStart({ id, center = false, titleClassName = '', hideTitle = false, phoneClassName = '' }: { id?: string; center?: boolean; titleClassName?: string; hideTitle?: boolean; phoneClassName?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [pickup, setPickup] = useState('')
  const wide = useWide()

  function start(e: FormEvent) {
    e.preventDefault()
    const answers: OrderStart = { pickupAddress: pickup.trim() || undefined }
    try { sessionStorage.setItem(ORDER_START_KEY, JSON.stringify(answers)) } catch {}
    trackEvent('quote_start', { form_location: formLocationFor(pathname) })
    router.push('/order')
  }

  return (
    <div id={id} className={`w-full max-w-[560px] ${center ? 'mx-auto text-center' : ''}`}>
      <form onSubmit={start} aria-label="Get your free estimate">
        <p className={hideTitle ? 'sr-only' : `mb-3.5 text-[17px] sm:text-[19px] leading-tight font-bold [text-shadow:0_1px_3px_rgba(0,0,0,0.3)] ${titleClassName}`} style={{ color: '#FFFFFF' }}>
          Get Your Free Moving Quote
        </p>
        {/* One white pill, like a search bar: type the pickup, the orange Next sits inside it */}
        <div className="flex items-center gap-2 rounded-[22px] bg-white pl-5 sm:pl-6 pr-1.5 py-1.5 text-left transition-shadow shadow-[0_14px_34px_-14px_rgba(20,8,40,0.6)] lg:shadow-none focus-within:shadow-[0_0_0_3px_#F26B21]">
          <label className="flex-1 min-w-0">
            <span className="sr-only">Pickup city or postal code</span>
            <AddressAutocomplete value={pickup} onValueChange={setPickup} placeholder={wide ? 'Pickup city or postal code' : 'City or postal code'} autoComplete="postal-code" className={inputClass} style={{ color: '#1E1530' }} />
          </label>
          <button
            type="submit"
            className="shrink-0 flex items-center justify-center gap-1.5 sg-btn min-h-[44px] sm:min-h-[50px] px-4 sm:px-6 text-[16px] font-extrabold whitespace-nowrap hover:bg-[#DD5A12]"
            style={{ backgroundColor: '#F26B21', color: '#FFFFFF' }}
          >
            Next <ArrowRight size={17} aria-hidden />
          </button>
        </div>
      </form>
      <p className={`mt-4 text-[15px] font-semibold [text-shadow:0_1px_3px_rgba(0,0,0,0.35)] ${phoneClassName}`} style={{ color: 'rgba(255,255,255,0.82)' }}>
        or call{' '}
        <PhoneLink className="font-extrabold underline underline-offset-4 decoration-2 decoration-[#F26B21] hover:decoration-white" style={{ color: '#FFFFFF', fontVariantNumeric: 'lining-nums tabular-nums' }}>
          <PhoneNumber />
        </PhoneLink>
      </p>
    </div>
  )
}
