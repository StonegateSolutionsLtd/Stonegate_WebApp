'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

/**
 * Crossfades the same truck between its empty (load area highlighted) and loaded
 * pictures in one spot, looping empty -> loaded -> empty. Tapping flips it by hand.
 */
export default function TruckSlideshow({ empty, loaded, alt, sizes, className = '' }: {
  empty: string
  loaded: string
  alt: string
  sizes: string
  className?: string
}) {
  const [showLoaded, setShowLoaded] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setShowLoaded(v => !v), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <button
      type="button"
      onClick={() => setShowLoaded(v => !v)}
      aria-label={showLoaded ? `${alt} - loaded. Tap to show it empty` : `${alt} - empty. Tap to show it loaded`}
      className={`relative block w-full aspect-[3/2] overflow-hidden ${className}`}
      style={{ backgroundColor: '#FAF8F4' }}
    >
      <Image src={empty} alt="" fill sizes={sizes} className="object-cover" />
      <Image
        src={loaded}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-opacity duration-700 ease-in-out"
        style={{ opacity: showLoaded ? 1 : 0 }}
      />
      <span className="absolute bottom-2 right-2 flex gap-1.5" aria-hidden>
        {[false, true].map(v => (
          <span key={String(v)} className="w-2 h-2 rounded-full transition-colors" style={{ backgroundColor: showLoaded === v ? '#254220' : 'rgba(37,66,32,0.25)' }} />
        ))}
      </span>
    </button>
  )
}
