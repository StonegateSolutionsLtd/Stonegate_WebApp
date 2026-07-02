'use client'

import { useRef } from 'react'

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  function handleEnded() {
    if (!ref.current) return
    ref.current.currentTime = 0
    ref.current.pause()
  }

  return (
    <video
      ref={ref}
      autoPlay
      muted
      playsInline
      onEnded={handleEnded}
      style={{ height: '100%', width: '100%', objectFit: 'cover', transform: 'translateY(-8%)' }}
    >
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  )
}
