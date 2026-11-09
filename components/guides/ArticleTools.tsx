'use client'

import { useEffect, useState } from 'react'
import { Link2, Check } from 'lucide-react'

/** Thin bar under the navbar that fills as the reader scrolls through the article */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const { top, height } = el.getBoundingClientRect()
      const total = height - window.innerHeight
      setProgress(total > 0 ? Math.min(1, Math.max(0, -top / total)) : 1)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [targetId])

  return (
    <div aria-hidden className="fixed top-0 inset-x-0 z-[60] h-[3px] pointer-events-none">
      <div className="h-full origin-left" style={{ transform: `scaleX(${progress})`, backgroundColor: '#014421', transition: 'transform 80ms linear' }} />
    </div>
  )
}

/** Copies the article URL; falls back silently where the clipboard is unavailable */
export function CopyLink() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href.split('#')[0])
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:bg-[#EEE8E0]"
      style={{ border: '1px solid #E3DCD2', color: '#1C1A17' }}
    >
      {copied ? <Check size={14} aria-hidden /> : <Link2 size={14} aria-hidden />}
      {copied ? 'Link copied' : 'Copy link'}
    </button>
  )
}
