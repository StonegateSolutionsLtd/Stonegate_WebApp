'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import GoogleLogo from '@/components/GoogleLogo'
import { GOOGLE_MOVING_REVIEWS, REVIEW_TOPICS, type ReviewTopic } from '@/lib/reviews'

const GREEN = '#014421'
const INK = '#1A1714'
const MUTED = '#6B5E54'
const LINE = '#E8E0D5'

const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')

/** Three theme tabs (wrapping so every tab is visible on phones) over a masonry wall of that theme's review cards */
export default function ReviewsGrid() {
  const [topic, setTopic] = useState<ReviewTopic>(REVIEW_TOPICS[0].id)
  const shown = GOOGLE_MOVING_REVIEWS.filter(r => r.topic === topic)
  const chips = REVIEW_TOPICS

  return (
    <>
      <div role="group" aria-label="Review themes" className="flex flex-wrap gap-2 mb-8">
        {chips.map(c => {
          const active = topic === c.id
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => setTopic(c.id)}
              className="shrink-0 inline-flex items-center gap-2 rounded-full px-4 min-h-[42px] text-sm font-bold whitespace-nowrap transition-colors cursor-pointer"
              style={active ? { backgroundColor: GREEN, color: '#FAF7F2', border: `1px solid ${GREEN}` } : { backgroundColor: '#FFFFFF', color: INK, border: `1px solid ${LINE}` }}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      <ul className="columns-1 md:columns-2 lg:columns-3 gap-5">
        {shown.map(r => (
          <li key={r.name} className="break-inside-avoid mb-5 rounded-3xl p-6 bg-white" style={{ border: `1px solid ${LINE}` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, j) => <Star key={j} size={16} fill="#FBBC04" style={{ color: '#FBBC04' }} aria-hidden />)}
              </span>
              <GoogleLogo size={16} />
            </div>
            <p className="text-[16px] leading-relaxed mb-5" style={{ color: INK }}>{r.text}</p>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold" style={{ backgroundColor: '#E8F0E6', color: GREEN }}>
                {initials(r.name)}
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-bold" style={{ color: INK }}>{r.name}</span>
                <span className="block text-[13px]" style={{ color: MUTED }}>Google review</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
