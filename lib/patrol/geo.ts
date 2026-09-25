import type { Feature, FeatureCollection, Polygon } from 'geojson'
import type { MunicipalitySlug } from './types'
import municipalitiesRaw from './municipalities.geo.json'

export interface MunicipalityFeatureProps {
  slug: MunicipalitySlug
  name: string
}

/**
 * Official Metro Vancouver Regional District administrative boundaries
 * (Open Government Licence), simplified for web rendering.
 * Source: Metro Vancouver Open Data Portal — Administrative Boundaries.
 */
export const MUNICIPALITIES_GEOJSON =
  municipalitiesRaw as FeatureCollection<Polygon, MunicipalityFeatureProps>

export type MunicipalityFeature = Feature<Polygon, MunicipalityFeatureProps>

export function getMunicipalityFeature(slug: MunicipalitySlug): MunicipalityFeature | undefined {
  return MUNICIPALITIES_GEOJSON.features.find(f => f.properties.slug === slug)
}

export type LngLatBounds = [[number, number], [number, number]]

export function getMunicipalityBounds(slug: MunicipalitySlug): LngLatBounds | undefined {
  const feature = getMunicipalityFeature(slug)
  if (!feature) return undefined

  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity

  for (const ring of feature.geometry.coordinates) {
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ]
}

export function getMunicipalityCentroid(slug: MunicipalitySlug): [number, number] | undefined {
  const bounds = getMunicipalityBounds(slug)
  if (!bounds) return undefined
  const [[minLng, minLat], [maxLng, maxLat]] = bounds
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2]
}

/** Loose bounding box around all four supported municipalities, for the initial map view. */
export function getMetroVancouverBounds(): LngLatBounds {
  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity

  for (const feature of MUNICIPALITIES_GEOJSON.features) {
    for (const ring of feature.geometry.coordinates) {
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      }
    }
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ]
}
