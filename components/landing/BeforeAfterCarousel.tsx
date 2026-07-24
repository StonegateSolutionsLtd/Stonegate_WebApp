'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Pair {
  label: string
  before: string
  after: string
  afterObjectPosition?: string
}

export default function BeforeAfterCarousel({ pairs, height = 440 }: { pairs: Pair[]; height?: number }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  function go(next: number) {
    setIndex((next + pairs.length) % pairs.length)
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) {
      go(delta < 0 ? index + 1 : index - 1)
    }
    touchStartX.current = null
  }

  return (
    <div>
      <div
        className="relative rounded-2xl overflow-hidden select-none"
        style={{ border: '1px solid #E8E0D5' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-350 ease-out"
          style={{ width: `${pairs.length * 100}%`, transform: `translateX(-${(index * 100) / pairs.length}%)` }}
        >
          {pairs.map(pair => (
            <div key={pair.label} className="grid grid-cols-2" style={{ width: `${100 / pairs.length}%`, flexShrink: 0 }}>
              <div className="relative" style={{ height: `${height}px` }}>
                <Image src={pair.before} alt={`Before junk removal - ${pair.label}`} fill className="object-cover" />
                <span
                  className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1"
                  style={{ backgroundColor: 'rgba(26,23,20,0.6)', color: '#FFFFFF' }}
                >
                  Before
                </span>
              </div>
              <div className="relative" style={{ height: `${height}px` }}>
                <Image src={pair.after} alt={`After junk removal - ${pair.label}`} fill className="object-cover" style={{ objectPosition: pair.afterObjectPosition }} />
                <span
                  className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1"
                  style={{ backgroundColor: '#014421', color: '#FFFFFF' }}
                >
                  After
                </span>
              </div>
            </div>
          ))}
        </div>

        {pairs.length > 1 && (
          <>
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full cursor-pointer transition-opacity hover:opacity-90"
              style={{ width: '40px', height: '40px', backgroundColor: 'rgba(26,23,20,0.55)', border: 'none' }}
            >
              <ChevronLeft size={20} color="#FFFFFF" />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full cursor-pointer transition-opacity hover:opacity-90"
              style={{ width: '40px', height: '40px', backgroundColor: 'rgba(26,23,20,0.55)', border: 'none' }}
            >
              <ChevronRight size={20} color="#FFFFFF" />
            </button>
          </>
        )}
      </div>

      {pairs.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {pairs.map((pair, i) => (
            <button
              key={pair.label}
              onClick={() => setIndex(i)}
              aria-label={`Show ${pair.label}`}
              className="cursor-pointer transition-all"
              style={{
                width: i === index ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === index ? '#014421' : '#E8E0D5',
                border: 'none',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
