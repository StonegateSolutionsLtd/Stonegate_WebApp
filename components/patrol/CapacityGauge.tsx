'use client'

import { useId } from 'react'

interface CapacityGaugeProps {
  /** 0–1, share of the truck already booked. */
  usedRatio: number
  color: string
  className?: string
}

/**
 * A side-silhouette of a box truck whose cargo hold fills from the floor up
 * as bookings consume capacity. Deliberately not a progress bar — the shape
 * itself is meant to read as "this truck is already coming, and there's
 * still room for you."
 */
export default function CapacityGauge({ usedRatio, color, className }: CapacityGaugeProps) {
  const clampedUsed = Math.max(0, Math.min(1, usedRatio))
  const clipId = useId()

  // Cargo hold interior, in viewBox units.
  const holdX = 66
  const holdY = 22
  const holdWidth = 118
  const holdHeight = 54

  const fillHeight = holdHeight * clampedUsed
  const fillY = holdY + (holdHeight - fillHeight)

  return (
    <svg
      viewBox="0 0 220 100"
      className={className}
      role="img"
      aria-label={`${Math.round((1 - clampedUsed) * 100)} percent of truck capacity available`}
    >
      <defs>
        <clipPath id={`${clipId}-hold`}>
          <rect x={holdX} y={holdY} width={holdWidth} height={holdHeight} rx={3} />
        </clipPath>
      </defs>

      {/* Cargo hold fill */}
      <g clipPath={`url(#${clipId}-hold)`}>
        <rect x={holdX} y={holdY} width={holdWidth} height={holdHeight} fill="currentColor" className="text-muted/40" />
        <rect x={holdX} y={fillY} width={holdWidth} height={fillHeight} fill={color} opacity={0.85} />
      </g>

      {/* Cargo hold outline */}
      <rect
        x={holdX}
        y={holdY}
        width={holdWidth}
        height={holdHeight}
        rx={3}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        className="text-foreground/70"
      />

      {/* Cab */}
      <path
        d="M18 76 V52 L34 40 H58 V76 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
        className="text-foreground/70"
      />
      <path d="M38 44 V60 H55 V44 Z" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-foreground/50" />

      {/* Chassis line */}
      <path d="M18 76 H184" stroke="currentColor" strokeWidth={1.75} className="text-foreground/70" />

      {/* Wheels */}
      <circle cx="40" cy="80" r="8" fill="var(--color-background)" stroke="currentColor" strokeWidth={1.75} className="text-foreground/70" />
      <circle cx="150" cy="80" r="8" fill="var(--color-background)" stroke="currentColor" strokeWidth={1.75} className="text-foreground/70" />
    </svg>
  )
}
