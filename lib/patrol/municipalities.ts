import type { Municipality, MunicipalitySlug } from './types'

// Chosen for hue separation from each other (green / amber / rust / blue span
// the color wheel rather than clustering) — Coquitlam was originally a teal,
// but that sat too close to Vancouver's green once the basemap moved to a
// bright "day" preset, so it moved to blue instead. Each color still passes
// WCAG AA (4.5:1) for white text when used as a solid button background.
export const MUNICIPALITIES: Municipality[] = [
  { slug: 'vancouver', name: 'Vancouver', color: '#157A47' },
  { slug: 'burnaby', name: 'Burnaby', color: '#9C6410' },
  { slug: 'new-westminster', name: 'New Westminster', color: '#A8461F' },
  { slug: 'coquitlam', name: 'Coquitlam', color: '#3D5FA8' },
]

export const MUNICIPALITY_ORDER: MunicipalitySlug[] = MUNICIPALITIES.map(m => m.slug)

export function getMunicipality(slug: MunicipalitySlug): Municipality {
  const found = MUNICIPALITIES.find(m => m.slug === slug)
  if (!found) throw new Error(`Unknown municipality: ${slug}`)
  return found
}
