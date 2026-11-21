'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The mascot under the quote card: when the scene comes into view he pushes the couch in from just outside the left edge
 * and stops. Plays once (about 1.3s); with reduced motion it simply shows the finished scene.
 */
/** `className` replaces the default layout of the scene box (size, alignment), e.g. to place it over the desktop photo */
export default function MascotCouch({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const trainRef = useRef<HTMLDivElement>(null)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const el = ref.current
    const train = trainRef.current
    if (!el || !train) return
    // Start just outside the section's left edge: shift left by his distance from that edge plus his own width
    const placeStart = () => {
      // offsetLeft is the layout position inside the section, unaffected by the transform
      train.style.setProperty('--couch-start', `${-(train.offsetLeft + train.offsetWidth + 8)}px`)
    }
    placeStart()
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setPlay(true); io.disconnect() }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`flex items-end overflow-hidden ${className ?? 'relative justify-center h-[100px] sm:h-[114px] lg:h-[126px]'}`}>
      <div ref={trainRef} className={`couch-train relative ${play ? 'is-playing' : ''}`}>
        {/* A 12-frame walk cycle: a wide strip of frames inside a one-frame window, stepped through while he moves */}
        <div className="couch-walker relative w-[150px] sm:w-[170px] lg:w-[190px] aspect-[346/216] overflow-hidden" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element -- a sprite strip, positioned frame by frame */}
          <img src="/moving/mascot-walk.webp" alt="" width={4152} height={216} decoding="async" className="couch-frames absolute top-0 left-0 h-full w-[1200%] max-w-none" />
        </div>
      </div>
    </div>
  )
}
