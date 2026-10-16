'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface SliderPair {
  label: string
  before: string
  after: string
  /** CSS transforms that line the two shots up when they were taken from slightly different spots */
  beforeAlign?: React.CSSProperties
  afterAlign?: React.CSSProperties
}

/** Drag-to-reveal before/after comparison. The before photo sits on top, clipped to the left of the handle. */
export default function BeforeAfterSlider({ pairs }: { pairs: SliderPair[] }) {
  const [index, setIndex] = useState(0)
  const [split, setSplit] = useState(55)
  const frameRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pair = pairs[index]

  function moveTo(clientX: number) {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    setSplit(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div>
      <div
        ref={frameRef}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl select-none cursor-ew-resize touch-pan-y"
        style={{ backgroundColor: '#E8E0D5' }}
        onPointerDown={e => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); moveTo(e.clientX) }}
        onPointerMove={e => { if (dragging.current) moveTo(e.clientX) }}
        onPointerUp={() => { dragging.current = false }}
        onPointerCancel={() => { dragging.current = false }}
      >
        <Image key={pair.after} src={pair.after} alt={`After junk removal - ${pair.label}`} fill sizes="(max-width: 1024px) 92vw, 520px" className="object-cover pointer-events-none" style={pair.afterAlign} />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <Image key={pair.before} src={pair.before} alt={`Before junk removal - ${pair.label}`} fill sizes="(max-width: 1024px) 92vw, 520px" className="object-cover pointer-events-none" style={pair.beforeAlign} />
        </div>

        <span className="absolute bottom-4 left-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition-opacity" style={{ backgroundColor: 'rgba(26,23,20,0.72)', color: '#FFFFFF', opacity: split > 14 ? 1 : 0 }}>Before</span>
        <span className="absolute bottom-4 right-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition-opacity" style={{ backgroundColor: '#014421', color: '#FFFFFF', opacity: split < 86 ? 1 : 0 }}>After</span>

        <div className="absolute inset-y-0 pointer-events-none" style={{ left: `${split}%`, width: 2, marginLeft: -1, backgroundColor: '#FFFFFF', boxShadow: '0 0 12px rgba(0,0,0,0.35)' }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full" style={{ width: 52, height: 52, backgroundColor: '#FFFFFF', color: '#014421', boxShadow: '0 6px 18px rgba(0,0,0,0.3)' }}>
            <ChevronLeft size={18} aria-hidden /><ChevronRight size={18} aria-hidden />
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(split)}
          onChange={e => setSplit(Number(e.target.value))}
          aria-label={`Before and after comparison - ${pair.label}`}
          className="sr-only"
        />
      </div>

      {pairs.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {pairs.map((p, i) => (
            <button
              key={p.label}
              aria-pressed={i === index}
              onClick={() => { setIndex(i); setSplit(55) }}
              className="cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors"
              style={i === index
                ? { backgroundColor: '#1A1714', color: '#FAF7F2', border: '1px solid #1A1714' }
                : { backgroundColor: 'transparent', color: '#1A1714', border: '1px solid #D9CFC3' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
