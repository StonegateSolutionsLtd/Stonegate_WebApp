'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Review {
  name: string
  text: string
}

export default function ReviewsRow({ reviews }: { reviews: Review[] }) {
  const rowRef = useRef<HTMLDivElement>(null)

  function scroll(direction: 'left' | 'right') {
    rowRef.current?.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  const arrowStyle: React.CSSProperties = {
    width: '40px', height: '40px', borderRadius: '50%',
    backgroundColor: '#FAF7F2', border: '1px solid #E8E0D5',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, color: '#014421',
  }

  return (
    <div className="flex items-center gap-3 mb-10">
      <style>{`
        .reviews-row::-webkit-scrollbar { display: none; }
      `}</style>
      <button onClick={() => scroll('left')} aria-label="Scroll reviews left" className="hidden sm:flex" style={arrowStyle}>
        <ChevronLeft size={20} />
      </button>

      <div
        ref={rowRef}
        className="reviews-row flex gap-6 overflow-x-auto"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map(review => (
          <div
            key={review.name}
            className="flex flex-col shrink-0 p-6 rounded-2xl w-[85vw] sm:w-[300px]"
            style={{ border: '1px solid #E8E0D5', backgroundColor: '#F5F0EB', maxWidth: '300px', scrollSnapAlign: 'start' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ width: '40px', height: '40px', backgroundColor: '#E8F0E6', color: '#014421' }}
              >
                {review.name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')}
              </span>
              <p className="font-bold text-sm" style={{ color: '#1A1714' }}>{review.name}</p>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }, (_, j) => (
                <Star key={j} size={14} fill="#D4A017" style={{ color: '#D4A017' }} />
              ))}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{review.text}</p>
          </div>
        ))}
      </div>

      <button onClick={() => scroll('right')} aria-label="Scroll reviews right" className="hidden sm:flex" style={arrowStyle}>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
