'use client'

import { useEffect, useState } from 'react'
import type { Municipality, MunicipalitySlug } from '@/lib/patrol/types'
import type { MunicipalityPatrolSummary } from '@/lib/patrol/data'
import PatrolMap from './PatrolMap'
import MapContextPanel from './MapContextPanel'
import MapBottomSheet from './MapBottomSheet'

interface PatrolExperienceProps {
  municipalities: Municipality[]
  summaries: MunicipalityPatrolSummary[]
}

const DESKTOP_QUERY = '(min-width: 1024px)'
const MOBILE_MAP_HEIGHT = 620

/**
 * Renders exactly one Mapbox instance at a time, switching layouts based on
 * actual viewport rather than CSS show/hide — mounting a desktop AND a mobile
 * PatrolMap simultaneously would double tile/token usage and risks the same
 * shared-worker-pool instability Mapbox GL JS hits under duplicate instances.
 * `layout` starts null (unknown during SSR/first paint) and resolves on the
 * client via matchMedia, trading a one-frame blank state for never mounting
 * two maps.
 */
function useResponsiveLayout(): 'desktop' | 'mobile' | null {
  const [layout, setLayout] = useState<'desktop' | 'mobile' | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY)
    const update = () => setLayout(mediaQuery.matches ? 'desktop' : 'mobile')
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return layout
}

export default function PatrolExperience({ municipalities, summaries }: PatrolExperienceProps) {
  const layout = useResponsiveLayout()
  const [selectedSlug, setSelectedSlug] = useState<MunicipalitySlug | null>(null)
  const [hoveredSlug, setHoveredSlug] = useState<MunicipalitySlug | null>(null)

  function handleSelect(slug: MunicipalitySlug) {
    setSelectedSlug(current => (current === slug ? current : slug))
  }

  return (
    <section className="w-full bg-background">
      {layout === 'desktop' && (
        <div className="relative h-[85vh] min-h-[700px] w-full">
          <PatrolMap
            municipalities={municipalities}
            selectedSlug={selectedSlug}
            hoveredSlug={hoveredSlug}
            onSelect={handleSelect}
            onHoverChange={setHoveredSlug}
          />

          {/* Floats over the full-bleed map rather than splitting the layout
              into a permanent side column — the map stays the whole page. */}
          <aside className="absolute top-6 left-6 max-h-[calc(100%-3rem)] w-[380px] overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-2xl">
            <MapContextPanel
              municipalities={municipalities}
              summaries={summaries}
              selectedSlug={selectedSlug}
              onSelect={handleSelect}
              onHoverChange={setHoveredSlug}
            />
          </aside>
        </div>
      )}

      {layout === 'mobile' && (
        <div className="relative w-full overflow-hidden" style={{ height: MOBILE_MAP_HEIGHT }}>
          <PatrolMap
            municipalities={municipalities}
            selectedSlug={selectedSlug}
            hoveredSlug={hoveredSlug}
            onSelect={handleSelect}
            onHoverChange={setHoveredSlug}
          />
          <MapBottomSheet
            municipalities={municipalities}
            summaries={summaries}
            selectedSlug={selectedSlug}
            onSelect={handleSelect}
            containerHeight={MOBILE_MAP_HEIGHT}
          />
        </div>
      )}
    </section>
  )
}
