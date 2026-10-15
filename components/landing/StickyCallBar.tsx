'use client'

import { useEffect, useState } from 'react'
import { Phone, ArrowRight } from 'lucide-react'
import { PhoneLink } from '@/components/PhoneNumber'

/** Mobile/tablet bottom bar that appears once the element with `watchId` scrolls out of view. */
export default function StickyCallBar({ watchId, quoteHref }: { watchId: string; quoteHref: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = document.getElementById(watchId)
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [watchId])

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1.4fr_1fr] gap-2.5 px-3 pt-2.5 transition-transform duration-300"
      style={{
        transform: show ? 'translateY(0)' : 'translateY(110%)',
        backgroundColor: 'rgba(250,247,242,0.97)',
        borderTop: '1px solid #E8E0D5',
        boxShadow: '0 -6px 20px rgba(26,23,20,0.08)',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
      }}
      aria-hidden={!show}
    >
      <a href={quoteHref} tabIndex={show ? 0 : -1} className="flex items-center justify-center gap-1.5 rounded-full min-h-[52px] text-base font-extrabold" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
        Free Estimate <ArrowRight size={16} aria-hidden />
      </a>
      <PhoneLink tabIndex={show ? 0 : -1} className="flex items-center justify-center gap-2 rounded-full min-h-[52px] text-base font-extrabold" style={{ color: '#014421', border: '2px solid #014421', backgroundColor: '#FFFFFF' }}>
        <Phone size={17} fill="currentColor" aria-hidden /> Call
      </PhoneLink>
    </div>
  )
}
