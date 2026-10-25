'use client'

import { useEffect } from 'react'

/**
 * Section entrances: elements marked `data-reveal` rise in as they scroll into view (stagger with `--reveal-delay`).
 * Only elements still below the fold when this runs are hidden, so nothing flashes on load and nothing stays hidden without JS.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pending = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
      .filter(el => el.getBoundingClientRect().top > window.innerHeight)
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.removeAttribute('data-pending')
        io.unobserve(e.target)
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    for (const el of pending) {
      el.setAttribute('data-pending', '')
      io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  return null
}
