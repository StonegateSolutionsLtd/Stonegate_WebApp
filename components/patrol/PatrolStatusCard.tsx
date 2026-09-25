'use client'

import Link from 'next/link'
import { ChevronRight, PackageX } from 'lucide-react'
import type { Municipality, Patrol } from '@/lib/patrol/types'
import {
  capacityRemainingRatio,
  capacityUsedRatio,
  formatPatrolDate,
  formatPatrolWindow,
  pickFeaturedPatrol,
  slotsRemaining,
} from '@/lib/patrol/selectors'
import CapacityGauge from './CapacityGauge'
import { cn } from '@/lib/utils'

interface PatrolStatusCardProps {
  municipality: Municipality
  next: Patrol | undefined
  following: Patrol | undefined
  variant: 'compact' | 'expanded'
  isSelected?: boolean
  onSelect?: () => void
  onHoverChange?: (hovered: boolean) => void
  className?: string
}

export default function PatrolStatusCard({
  municipality,
  next,
  following,
  variant,
  isSelected = false,
  onSelect,
  onHoverChange,
  className,
}: PatrolStatusCardProps) {
  const { featured, skippedFull } = pickFeaturedPatrol(next, following)

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        aria-pressed={isSelected}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors cursor-pointer',
          isSelected ? 'border-foreground/20 bg-muted/60' : 'border-border hover:bg-muted/40',
          className
        )}
      >
        <span
          aria-hidden
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: municipality.color }}
        />
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold text-foreground">{municipality.name}</span>
          {featured ? (
            <span className="block text-xs text-muted-foreground truncate">
              {formatPatrolDate(featured.date)} · {slotsRemaining(featured)} slot{slotsRemaining(featured) === 1 ? '' : 's'} left
            </span>
          ) : (
            <span className="block text-xs text-muted-foreground">No upcoming patrol scheduled</span>
          )}
        </span>
        <ChevronRight size={16} className="shrink-0 text-muted-foreground" aria-hidden />
      </button>
    )
  }

  return (
    <div
      className={cn('rounded-2xl border border-border bg-card p-5', className)}
      style={{ borderTopColor: municipality.color, borderTopWidth: '3px' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {municipality.name}
      </p>

      {!featured ? (
        <div className="mt-3 flex items-start gap-2.5 text-sm text-muted-foreground">
          <PackageX size={16} className="mt-0.5 shrink-0" aria-hidden />
          <span>No upcoming patrol scheduled for this area yet.</span>
        </div>
      ) : (
        <>
          {skippedFull && (
            <p className="mt-2 text-xs text-muted-foreground">
              {formatPatrolDate(skippedFull.date)} is fully booked — showing the next available route.
            </p>
          )}

          <p className="mt-3 text-sm font-medium text-muted-foreground">Next Patrol</p>
          <p className="mt-0.5 text-lg font-bold tracking-tight text-foreground">
            {formatPatrolDate(featured.date)}
          </p>
          <p className="font-mono text-sm text-muted-foreground tabular-nums">
            {formatPatrolWindow(featured)}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <CapacityGauge
              usedRatio={capacityUsedRatio(featured)}
              color={municipality.color}
              className="h-14 w-auto shrink-0 text-foreground"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                {slotsRemaining(featured)} pickup slot{slotsRemaining(featured) === 1 ? '' : 's'} remaining
              </span>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {Math.round(capacityRemainingRatio(featured) * 100)}% truck capacity available
              </span>
            </div>
          </div>

          <Link
            href={`/quote?area=${municipality.slug}&patrol=${featured.id}`}
            className="mt-5 flex w-full items-center justify-center rounded-full py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            style={{ backgroundColor: municipality.color }}
          >
            Get AI Quote
          </Link>

          {following && following.id !== featured.id && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Also running {formatPatrolDate(following.date)}
            </p>
          )}
        </>
      )}
    </div>
  )
}
