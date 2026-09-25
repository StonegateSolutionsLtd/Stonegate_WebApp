'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, animate as animateValue, type PanInfo } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import type { Municipality, MunicipalitySlug } from '@/lib/patrol/types'
import type { MunicipalityPatrolSummary } from '@/lib/patrol/data'
import { formatPatrolDate, pickFeaturedPatrol, slotsRemaining } from '@/lib/patrol/selectors'
import PatrolStatusCard from './PatrolStatusCard'
import { cn } from '@/lib/utils'

const PEEK_HEIGHT = 138
const SHEET_HEIGHT_RATIO = 0.78

interface MapBottomSheetProps {
  municipalities: Municipality[]
  summaries: MunicipalityPatrolSummary[]
  selectedSlug: MunicipalitySlug | null
  onSelect: (slug: MunicipalitySlug) => void
  /** Height (px) of the map container this sheet is anchored to — the sheet
   * is sized relative to it, not the viewport, since it no longer overlays
   * a full-screen map. */
  containerHeight: number
}

function MunicipalityChip({
  municipality,
  summary,
  isSelected,
  onClick,
}: {
  municipality: Municipality
  summary: MunicipalityPatrolSummary | undefined
  isSelected: boolean
  onClick: () => void
}) {
  const { featured } = pickFeaturedPatrol(summary?.next, summary?.following)
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        'flex shrink-0 flex-col items-start gap-1 rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer',
        isSelected ? 'border-foreground/30 bg-muted/60' : 'border-border bg-background'
      )}
    >
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: municipality.color }} />
        <span className="text-xs font-semibold text-foreground">{municipality.name}</span>
      </span>
      <span className="text-[11px] text-muted-foreground">
        {featured ? `${formatPatrolDate(featured.date)} · ${slotsRemaining(featured)} left` : 'No patrol yet'}
      </span>
    </button>
  )
}

export default function MapBottomSheet({
  municipalities,
  summaries,
  selectedSlug,
  onSelect,
  containerHeight,
}: MapBottomSheetProps) {
  const [expanded, setExpanded] = useState(false)
  const y = useMotionValue(0)

  const sheetHeight = Math.round(containerHeight * SHEET_HEIGHT_RATIO)
  const collapsedTranslate = Math.max(0, sheetHeight - PEEK_HEIGHT)

  useEffect(() => {
    const controls = animateValue(y, expanded ? 0 : collapsedTranslate, {
      type: 'spring',
      stiffness: 420,
      damping: 42,
    })
    return () => controls.stop()
  }, [expanded, collapsedTranslate, y])

  function handleDragEnd(_: unknown, info: PanInfo) {
    const decisiveFlick = Math.abs(info.velocity.y) > 500
    if (decisiveFlick) {
      setExpanded(info.velocity.y < 0)
      return
    }
    setExpanded(y.get() < collapsedTranslate / 2)
  }

  const summaryBySlug = new Map(summaries.map(s => [s.municipality, s]))
  const selectedMunicipality = municipalities.find(m => m.slug === selectedSlug)
  const selectedSummary = selectedSlug ? summaryBySlug.get(selectedSlug) : undefined

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-3xl border-t border-border bg-background shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
      style={{ height: sheetHeight, y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: collapsedTranslate }}
      dragElastic={0.04}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
    >
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="flex w-full flex-col items-center gap-2 pt-2.5 pb-1 cursor-pointer"
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse patrol routes' : 'Expand patrol routes'}
      >
        <span className="h-1.5 w-10 rounded-full bg-border" aria-hidden />
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          {expanded ? 'All patrol routes' : 'Patrol routes near you'}
          <ChevronUp size={14} className={cn('transition-transform', expanded && 'rotate-180')} aria-hidden />
        </span>
      </button>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: 'none' }}>
        {municipalities.map(m => (
          <MunicipalityChip
            key={m.slug}
            municipality={m}
            summary={summaryBySlug.get(m.slug)}
            isSelected={selectedSlug === m.slug}
            onClick={() => {
              onSelect(m.slug)
              setExpanded(true)
            }}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {selectedMunicipality ? (
          <PatrolStatusCard
            municipality={selectedMunicipality}
            next={selectedSummary?.next}
            following={selectedSummary?.following}
            variant="expanded"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {municipalities.map(m => {
              const s = summaryBySlug.get(m.slug)
              return (
                <PatrolStatusCard
                  key={m.slug}
                  municipality={m}
                  next={s?.next}
                  following={s?.following}
                  variant="compact"
                  onSelect={() => {
                    onSelect(m.slug)
                    setExpanded(true)
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}
