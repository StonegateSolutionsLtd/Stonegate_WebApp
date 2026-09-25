import type { Municipality, MunicipalitySlug } from '@/lib/patrol/types'
import type { MunicipalityPatrolSummary } from '@/lib/patrol/data'
import PatrolStatusCard from './PatrolStatusCard'

interface MapContextPanelProps {
  municipalities: Municipality[]
  summaries: MunicipalityPatrolSummary[]
  selectedSlug: MunicipalitySlug | null
  onSelect: (slug: MunicipalitySlug) => void
  onHoverChange: (slug: MunicipalitySlug | null) => void
  className?: string
}

export default function MapContextPanel({
  municipalities,
  summaries,
  selectedSlug,
  onSelect,
  onHoverChange,
  className,
}: MapContextPanelProps) {
  const summaryBySlug = new Map(summaries.map(s => [s.municipality, s]))

  return (
    <div className={className}>
      <p className="px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Patrol routes
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {municipalities.map(municipality => {
          const summary = summaryBySlug.get(municipality.slug)
          const isSelected = selectedSlug === municipality.slug
          return (
            <PatrolStatusCard
              key={municipality.slug}
              municipality={municipality}
              next={summary?.next}
              following={summary?.following}
              variant={isSelected ? 'expanded' : 'compact'}
              isSelected={isSelected}
              onSelect={() => onSelect(municipality.slug)}
              onHoverChange={hovered => onHoverChange(hovered ? municipality.slug : null)}
            />
          )
        })}
      </div>
    </div>
  )
}
