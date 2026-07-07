'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const mediaStyle = {
  height: '100%',
  width: '100%',
  objectFit: 'cover' as const,
  transform: 'translateY(-8%)',
}

const LOOP_DELAY_MS = 10000

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [videoBlocked, setVideoBlocked] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const playPromise = video.play()
    if (playPromise) {
      playPromise.catch(() => setVideoBlocked(true))
    }

    // Some laptops (e.g. low-power / battery-saver mode) silently keep the
    // video paused without ever rejecting the play() promise. If playback
    // hasn't actually started shortly after, fall back to a static image.
    const checkTimer = setTimeout(() => {
      if (video.paused) setVideoBlocked(true)
    }, 1500)

    let restartTimer: ReturnType<typeof setTimeout>
    const handleEnded = () => {
      restartTimer = setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => setVideoBlocked(true))
      }, LOOP_DELAY_MS)
    }
    video.addEventListener('ended', handleEnded)

    return () => {
      clearTimeout(checkTimer)
      clearTimeout(restartTimer)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  if (videoBlocked) {
    return (
      <Image
        src="/hero-new.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        style={{ transform: 'translateY(-8%)' }}
      />
    )
  }

  return (
    <>
      <video
        ref={ref}
        autoPlay
        muted
        playsInline
        style={mediaStyle}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      {/* Between-loop pauses are intentional; suppress Chromium's manual play affordance */}
      <style jsx>{`
        video::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
        }
      `}</style>
    </>
  )
}
