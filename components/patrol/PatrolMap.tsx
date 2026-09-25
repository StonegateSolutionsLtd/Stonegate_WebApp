'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import type { ExpressionSpecification } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Municipality, MunicipalitySlug } from '@/lib/patrol/types'
import {
  MUNICIPALITIES_GEOJSON,
  getMetroVancouverBounds,
  getMunicipalityBounds,
  getMunicipalityCentroid,
} from '@/lib/patrol/geo'
import { cn } from '@/lib/utils'

const FILL_LAYER = 'municipalities-fill'
const LINE_CASING_LAYER = 'municipalities-line-casing'
const LINE_LAYER = 'municipalities-line'
const ROUTE_LAYER = 'patrol-route-line'
const STOPS_LAYER = 'patrol-route-stops'
const LABEL_LAYER = 'patrol-route-labels'

// A slight cinematic tilt on open — kept consistent through selection changes
// so the map never snaps flat and feels like one continuous camera move.
const INITIAL_PITCH = 45
const INITIAL_BEARING = -14
// Tighter than a typical "fit everything with room to spare" padding, so the
// overview reads as already-zoomed-in rather than a wide, distant establishing shot.
const OVERVIEW_PADDING = 16

interface PatrolMapProps {
  municipalities: Municipality[]
  selectedSlug: MunicipalitySlug | null
  hoveredSlug: MunicipalitySlug | null
  onSelect: (slug: MunicipalitySlug) => void
  onHoverChange: (slug: MunicipalitySlug | null) => void
  className?: string
}

export default function PatrolMap({
  municipalities,
  selectedSlug,
  hoveredSlug,
  onSelect,
  onHoverChange,
  className,
}: PatrolMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const loadedRef = useRef(false)
  const hoverIdRef = useRef<string | null>(null)
  const selectedIdRef = useRef<string | null>(null)
  const onSelectRef = useRef(onSelect)
  const onHoverChangeRef = useRef(onHoverChange)

  useEffect(() => {
    onSelectRef.current = onSelect
    onHoverChangeRef.current = onHoverChange
  }, [onSelect, onHoverChange])

  // Mount the map once.
  useEffect(() => {
    if (!containerRef.current) return
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error('NEXT_PUBLIC_MAPBOX_TOKEN is not set — the patrol map cannot render.')
      return
    }
    mapboxgl.accessToken = token

    // Start from a fixed center/zoom rather than `bounds` — fitting bounds at
    // construction time races the container's own CSS Grid layout, and if it
    // measures 0×0 on that first synchronous pass the resulting transform is
    // degenerate (no tiles ever get requested). Fit bounds explicitly once
    // the map has loaded and definitely has real dimensions instead.
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-122.97, 49.22],
      zoom: 9.5,
      pitch: INITIAL_PITCH,
      bearing: INITIAL_BEARING,
      attributionControl: false,
      cooperativeGestures: true,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new mapboxgl.AttributionControl({ compact: true }))

    map.on('load', () => {
      map.resize()
      map.fitBounds(getMetroVancouverBounds(), {
        padding: OVERVIEW_PADDING,
        duration: 0,
        pitch: INITIAL_PITCH,
        bearing: INITIAL_BEARING,
      })

      // Standard's real 3D buildings, terrain shading, and dynamic lighting —
      // POI/transit/place labels are suppressed since our own colored zone
      // labels (added below) replace them.
      map.setConfigProperty('basemap', 'lightPreset', 'day')
      map.setConfigProperty('basemap', 'showPointOfInterestLabels', false)
      map.setConfigProperty('basemap', 'showTransitLabels', false)
      map.setConfigProperty('basemap', 'showPlaceLabels', false)

      map.addSource('municipalities', {
        type: 'geojson',
        data: MUNICIPALITIES_GEOJSON,
        promoteId: 'slug',
      })

      const colorMatch: ExpressionSpecification = [
        'match',
        ['get', 'slug'],
        ...municipalities.flatMap(m => [m.slug, m.color]),
        '#9CA3AF',
      ]

      // `slot: 'top'` places these above Standard's own composite layers
      // (roads, buildings, labels) — Standard ignores unslotted custom
      // layers placed via a classic-style `beforeId`, so this is the only
      // reliable way to guarantee they're visible on top of the basemap.
      map.addLayer({
        id: FILL_LAYER,
        type: 'fill',
        source: 'municipalities',
        slot: 'top',
        paint: {
          'fill-color': colorMatch,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            0.8,
            ['boolean', ['feature-state', 'hover'], false],
            0.65,
            0.5,
          ],
        },
      })

      // A dark casing drawn under the colored border acts as an outline, so
      // the boundary reads crisply against a bright basemap — a pale halo
      // (right for a dark map) all but disappears against light ground/roads.
      map.addLayer({
        id: LINE_CASING_LAYER,
        type: 'line',
        source: 'municipalities',
        slot: 'top',
        layout: { 'line-join': 'round' },
        paint: {
          'line-color': '#1A1714',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            6.5,
            ['boolean', ['feature-state', 'hover'], false],
            5.5,
            4,
          ],
          'line-opacity': 0.35,
          'line-blur': 0.3,
        },
      })

      map.addLayer({
        id: LINE_LAYER,
        type: 'line',
        source: 'municipalities',
        slot: 'top',
        layout: { 'line-join': 'round' },
        paint: {
          'line-color': colorMatch,
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            4,
            ['boolean', ['feature-state', 'hover'], false],
            3.25,
            2.25,
          ],
          'line-opacity': 1,
        },
      })

      // Route line connecting centroids, west to east — a subtle stand-in for
      // "here's the shared route," not a real driving path.
      const routeCoords = municipalities
        .map(m => getMunicipalityCentroid(m.slug))
        .filter((c): c is [number, number] => Boolean(c))

      map.addSource('patrol-route', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: routeCoords } },
      })
      map.addLayer({
        id: ROUTE_LAYER,
        type: 'line',
        source: 'patrol-route',
        slot: 'top',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#1A1714',
          'line-width': 1.5,
          'line-dasharray': [0.2, 1.8],
          'line-opacity': 0,
        },
      })

      map.addSource('patrol-stops', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: municipalities
            .map(m => {
              const centroid = getMunicipalityCentroid(m.slug)
              if (!centroid) return null
              return {
                type: 'Feature' as const,
                properties: { slug: m.slug, color: m.color, name: m.name },
                geometry: { type: 'Point' as const, coordinates: centroid },
              }
            })
            .filter((f): f is NonNullable<typeof f> => Boolean(f)),
        },
      })
      map.addLayer({
        id: STOPS_LAYER,
        type: 'circle',
        source: 'patrol-stops',
        paint: {
          'circle-radius': 5,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0,
          'circle-stroke-opacity': 0,
        },
      })

      // Explicit municipality name labels, tied to their zone's own color —
      // don't rely on the basemap's own city labels, which aren't styled or
      // positioned to make "this color = this place" unambiguous.
      map.addLayer({
        id: LABEL_LAYER,
        type: 'symbol',
        source: 'patrol-stops',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 19,
          'text-anchor': 'top',
          'text-offset': [0, 0.7],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#FFFFFF',
          'text-halo-color': ['get', 'color'],
          'text-halo-width': 2.6,
          'text-halo-blur': 0.1,
          'text-opacity': 0,
        },
      })

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const finalRouteOpacity = 0.5
      const finalStopOpacity = 1
      const finalLabelOpacity = 1
      if (reduceMotion) {
        map.setPaintProperty(ROUTE_LAYER, 'line-opacity', finalRouteOpacity)
        map.setPaintProperty(STOPS_LAYER, 'circle-opacity', finalStopOpacity)
        map.setPaintProperty(STOPS_LAYER, 'circle-stroke-opacity', finalStopOpacity)
        map.setPaintProperty(LABEL_LAYER, 'text-opacity', finalLabelOpacity)
      } else {
        const start = performance.now()
        const duration = 1100
        const tick = (now: number) => {
          const t = Math.max(0, Math.min(1, (now - start) / duration))
          map.setPaintProperty(ROUTE_LAYER, 'line-opacity', finalRouteOpacity * t)
          map.setPaintProperty(STOPS_LAYER, 'circle-opacity', finalStopOpacity * t)
          map.setPaintProperty(STOPS_LAYER, 'circle-stroke-opacity', finalStopOpacity * t)
          map.setPaintProperty(LABEL_LAYER, 'text-opacity', finalLabelOpacity * t)
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }

      map.on('mousemove', FILL_LAYER, e => {
        const feature = e.features?.[0]
        if (!feature) return
        const id = feature.properties?.slug as string | undefined
        if (!id || id === hoverIdRef.current) return

        if (hoverIdRef.current) {
          map.setFeatureState({ source: 'municipalities', id: hoverIdRef.current }, { hover: false })
        }
        map.setFeatureState({ source: 'municipalities', id }, { hover: true })
        hoverIdRef.current = id
        map.getCanvas().style.cursor = 'pointer'
        onHoverChangeRef.current(id as MunicipalitySlug)
      })

      map.on('mouseleave', FILL_LAYER, () => {
        if (hoverIdRef.current) {
          map.setFeatureState({ source: 'municipalities', id: hoverIdRef.current }, { hover: false })
          hoverIdRef.current = null
        }
        map.getCanvas().style.cursor = ''
        onHoverChangeRef.current(null)
      })

      map.on('click', FILL_LAYER, e => {
        const slug = e.features?.[0]?.properties?.slug as string | undefined
        if (slug) onSelectRef.current(slug as MunicipalitySlug)
      })

      loadedRef.current = true
    })

    return () => {
      loadedRef.current = false
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reflect externally-driven selection (e.g. clicking a card in the rail).
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loadedRef.current) return

    if (selectedIdRef.current && selectedIdRef.current !== selectedSlug) {
      map.setFeatureState({ source: 'municipalities', id: selectedIdRef.current }, { selected: false })
    }
    if (selectedSlug) {
      map.setFeatureState({ source: 'municipalities', id: selectedSlug }, { selected: true })
      const bounds = getMunicipalityBounds(selectedSlug)
      if (bounds) {
        map.fitBounds(bounds, { padding: 72, duration: 900, pitch: INITIAL_PITCH, bearing: INITIAL_BEARING })
      }
    } else {
      map.fitBounds(getMetroVancouverBounds(), {
        padding: OVERVIEW_PADDING,
        duration: 900,
        pitch: INITIAL_PITCH,
        bearing: INITIAL_BEARING,
      })
    }
    selectedIdRef.current = selectedSlug
  }, [selectedSlug])

  // Reflect externally-driven hover (e.g. hovering a card in the rail) without moving the camera.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loadedRef.current) return
    if (hoveredSlug === hoverIdRef.current) return

    if (hoverIdRef.current) {
      map.setFeatureState({ source: 'municipalities', id: hoverIdRef.current }, { hover: false })
    }
    if (hoveredSlug) {
      map.setFeatureState({ source: 'municipalities', id: hoveredSlug }, { hover: true })
    }
    hoverIdRef.current = hoveredSlug
  }, [hoveredSlug])

  return <div ref={containerRef} className={cn('h-full w-full', className)} />
}
