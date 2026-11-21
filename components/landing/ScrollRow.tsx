'use client'

import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

/**
 * One horizontal row of cards that scrolls sideways (swipe on phones, arrow buttons on larger screens),
 * so a long set of cards takes one row of height instead of a tall grid.
 */
export default function ScrollRow({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null)
  const step = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 260), behavior: 'smooth' })
  }
  const btn = 'hidden sm:flex w-11 h-11 rounded-full items-center justify-center transition-colors hover:bg-[#4B1D8F] hover:text-white'
  return (
    <div>
      <div className="hidden sm:flex justify-end gap-2 mb-4">
        <button type="button" onClick={() => step(-1)} aria-label={`Previous ${label.toLowerCase()}`} className={btn} style={{ backgroundColor: '#EEE7FA', color: '#4B1D8F' }}><ArrowLeft size={18} aria-hidden /></button>
        <button type="button" onClick={() => step(1)} aria-label={`More ${label.toLowerCase()}`} className={btn} style={{ backgroundColor: '#EEE7FA', color: '#4B1D8F' }}><ArrowRight size={18} aria-hidden /></button>
      </div>
      <ul
        ref={ref}
        aria-label={label}
        className="-mx-5 px-5 sm:mx-0 sm:px-0 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-5 sm:scroll-px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </div>
  )
}
