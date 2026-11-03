'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import GoogleLogo from '@/components/GoogleLogo'

/** One review at a time with arrows and dots; it turns over by itself until someone uses the controls */
export default function ReviewCarousel({ reviews }: { reviews: { name: string; text: string }[] }) {
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex(i => (i + 1) % reviews.length), 8000)
    return () => clearInterval(id)
  }, [auto, reviews.length])

  function go(to: number) {
    setAuto(false)
    setIndex((to + reviews.length) % reviews.length)
  }

  const review = reviews[index]

  return (
    <figure className="relative rounded-2xl p-6 sm:p-7" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
      <div className="flex items-center gap-1 mb-3" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }, (_, i) => <Star key={i} size={17} fill="#E8A317" style={{ color: '#E8A317' }} aria-hidden />)}
      </div>
      <blockquote key={index} className="text-[15px] sm:text-base leading-relaxed min-h-[7.5rem] animate-in fade-in duration-500" style={{ color: '#1A1714' }}>
        {review.text}
      </blockquote>
      <figcaption className="flex items-center gap-3 mt-5">
        <span className="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
          {review.name[0]}
          <span className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center"><GoogleLogo size={11} /></span>
        </span>
        <span className="text-sm font-bold" style={{ color: '#1A1714' }}>{review.name}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous review"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[#E8F0E6]" style={{ border: '1px solid #E8E0D5', color: '#014421' }}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next review"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[#E8F0E6]" style={{ border: '1px solid #E8E0D5', color: '#014421' }}>
            <ChevronRight size={18} />
          </button>
        </span>
      </figcaption>
      <div className="flex justify-center gap-1.5 mt-4">
        {reviews.map((r, i) => (
          <button key={r.name} type="button" onClick={() => go(i)} aria-label={`Review ${i + 1} of ${reviews.length}`} aria-current={i === index}
            className="h-1.5 rounded-full transition-[width,background-color] duration-300"
            style={{ width: i === index ? 20 : 6, backgroundColor: i === index ? '#014421' : '#D3C9BF' }} />
        ))}
      </div>
    </figure>
  )
}
