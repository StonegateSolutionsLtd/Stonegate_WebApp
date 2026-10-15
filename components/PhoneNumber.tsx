'use client'

import { createContext, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes } from 'react'
import { PHONE_CONVERSION_NUMBER } from '@/lib/googleAds'

type Phone = { display: string; tel: string }

const telFor = (display: string) => `tel:+${display.replace(/\D/g, '')}`
const DEFAULT_PHONE: Phone = { display: PHONE_CONVERSION_NUMBER, tel: telFor(PHONE_CONVERSION_NUMBER) }

const PhoneContext = createContext<Phone>(DEFAULT_PHONE)

export const usePhoneNumber = () => useContext(PhoneContext)

/**
 * Google Ads phone call tracking (the phone_conversion_number config in the root layout) swaps the
 * number by rewriting matching text in the DOM, but only once per full page load, and it leaves the
 * displayed "+" in front of its own "+". So Google only gets to rewrite this hidden probe, which lives
 * in the root layout and survives client-side navigation. Everything else renders the number through
 * <PhoneNumber>, split into two text nodes so Google's matcher skips it.
 */
export function PhoneNumberProvider({ children }: { children: React.ReactNode }) {
  const [phone, setPhone] = useState(DEFAULT_PHONE)
  const probeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const probe = probeRef.current
    if (!probe) return
    const read = () => {
      const display = (probe.textContent ?? '').trim().replace(/^\++/, '+')
      if (display.replace(/\D/g, '').length < 10) return
      setPhone(prev => (prev.display === display ? prev : { display, tel: telFor(display) }))
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(probe, { subtree: true, childList: true, characterData: true })
    return () => observer.disconnect()
  }, [])

  return (
    <PhoneContext.Provider value={phone}>
      {children}
      <span ref={probeRef} className="sr-only" aria-hidden="true">{PHONE_CONVERSION_NUMBER}</span>
    </PhoneContext.Provider>
  )
}

/** The current number (Google forwarding number for Ads visitors), as two text nodes. */
export function PhoneNumber() {
  const { display } = usePhoneNumber()
  const split = display.indexOf(' ') + 1
  return <>{display.slice(0, split)}{display.slice(split)}</>
}

/** A tel: link to the current number. Renders the number itself when no children are given. */
export function PhoneLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { tel } = usePhoneNumber()
  return <a {...props} href={tel}>{children ?? <PhoneNumber />}</a>
}
