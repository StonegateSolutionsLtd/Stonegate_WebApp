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
    backgroundColor: '#FFFFFF', border: '1px solid #E6DFF0',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, color: '#4B1D8F',
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
            style={{ border: '1px solid #E6DFF0', backgroundColor: '#F6F2FC', maxWidth: '300px', scrollSnapAlign: 'start' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ width: '40px', height: '40px', backgroundColor: '#EEE7FA', color: '#4B1D8F' }}
              >
                {review.name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')}
              </span>
              <p className="font-bold text-sm" style={{ color: '#1E1530' }}>{review.name}</p>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }, (_, j) => (
                <Star key={j} size={14} fill="#D4A017" style={{ color: '#D4A017' }} />
              ))}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#5F5870' }}>{review.text}</p>
          </div>
        ))}
      </div>

      <button onClick={() => scroll('right')} aria-label="Scroll reviews right" className="hidden sm:flex" style={arrowStyle}>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
