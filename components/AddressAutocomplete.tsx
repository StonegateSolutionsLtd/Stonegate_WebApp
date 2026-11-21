'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ComponentType, type InputHTMLAttributes, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { MapPin } from 'lucide-react'

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
const VANCOUVER = '-123.1207,49.2827'
const MIN_CHARS = 3
const MAX_RESULTS = 5

interface Suggestion {
  id: string
  /** Street or place, shown bold */
  name: string
  /** City, province, postal code */
  context: string
  /** What goes into the field when picked */
  value: string
}

interface MapboxFeature {
  id: string
  properties: { name?: string; place_formatted?: string; full_address?: string }
}

const withoutCountry = (s: string) => s.replace(/,\s*Canada$/, '')

/** Mapbox Geocoding v6 in autocomplete mode: Canadian addresses, streets, postal codes and cities, nearest Vancouver first */
async function fetchSuggestions(query: string, signal: AbortSignal): Promise<Suggestion[]> {
  const params = new URLSearchParams({
    q: query,
    autocomplete: 'true',
    country: 'ca',
    proximity: VANCOUVER,
    types: 'address,street,postcode,place,locality,neighborhood',
    language: 'en',
    limit: String(MAX_RESULTS),
    access_token: TOKEN!,
  })
  const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params}`, { signal })
  if (!res.ok) return []
  const data: { features?: MapboxFeature[] } = await res.json()
  return (data.features ?? []).map(f => {
    const name = f.properties.name ?? ''
    const context = withoutCountry(f.properties.place_formatted ?? '')
    return { id: f.id, name, context, value: withoutCountry(f.properties.full_address ?? [name, context].filter(Boolean).join(', ')) }
  }).filter(s => s.value)
}

type InputProps = InputHTMLAttributes<HTMLInputElement>

/**
 * A text field that suggests real addresses as you type (Mapbox), like the search box on a map.
 * Anything typed is still accepted: picking a suggestion only fills the field. Without a Mapbox token it is a plain field.
 * The list is portalled to <body> so heroes with overflow: hidden never cut it off.
 */
export default function AddressAutocomplete({ value, onValueChange, input: Input = 'input', onKeyDown, onBlur, onFocus, ...inputProps }: Omit<InputProps, 'value' | 'onChange'> & {
  value: string
  onValueChange: (value: string) => void
  /** The field to render, e.g. a styled input component; defaults to a plain <input> */
  input?: ComponentType<InputProps> | 'input'
}) {
  const listId = useId()
  const anchorRef = useRef<HTMLDivElement>(null)
  // Results are kept with the query they answer, so a stale or too-short query simply shows nothing
  const [results, setResults] = useState<{ q: string; list: Suggestion[] }>({ q: '', list: [] })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [rect, setRect] = useState<{ left: number; top: number; width: number } | null>(null)
  // Only search after the person types, not when the field is prefilled or a suggestion was just picked
  const [query, setQuery] = useState<string | null>(null)
  const q = query?.trim() ?? ''
  const searching = !!TOKEN && query !== null && q.length >= MIN_CHARS
  const suggestions = searching && results.q === q ? results.list : []

  useEffect(() => {
    if (!searching) return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchSuggestions(q, controller.signal)
        .then(list => { setResults({ q, list }); setActive(-1); setOpen(true) })
        .catch(() => {})
    }, 250)
    return () => { clearTimeout(timer); controller.abort() }
  }, [searching, q])

  const place = useCallback(() => {
    const r = anchorRef.current?.getBoundingClientRect()
    if (r) setRect({ left: r.left, top: r.bottom + 6, width: r.width })
  }, [])

  const showing = open && suggestions.length > 0
  useLayoutEffect(() => {
    if (!showing) return
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => { window.removeEventListener('scroll', place, true); window.removeEventListener('resize', place) }
  }, [showing, place])

  function pick(s: Suggestion) {
    onValueChange(s.value)
    setQuery(null)
    setOpen(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (showing) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => (i + 1) % suggestions.length); return }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => (i <= 0 ? suggestions.length : i) - 1); return }
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return }
      // Enter on a highlighted suggestion picks it instead of submitting the form or moving to the next step
      if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(suggestions[active]); return }
    }
    onKeyDown?.(e)
  }

  return (
    <div ref={anchorRef} className="relative w-full min-w-0">
      <Input
        {...inputProps}
        value={value}
        onChange={e => { onValueChange(e.target.value); setQuery(e.target.value); setOpen(true) }}
        onKeyDown={handleKeyDown}
        onFocus={e => { if (suggestions.length) setOpen(true); onFocus?.(e) }}
        onBlur={e => { setOpen(false); onBlur?.(e) }}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showing}
        aria-controls={listId}
        aria-activedescendant={showing && active >= 0 ? `${listId}-${active}` : undefined}
      />
      {showing && rect && createPortal(
        <div
          className="fixed z-[100] overflow-hidden rounded-2xl bg-white text-left animate-in fade-in slide-in-from-top-1 duration-150"
          style={{ left: rect.left, top: rect.top, width: Math.max(rect.width, 280), border: '1px solid #E6DFF0', boxShadow: '0 16px 40px rgba(30,21,48,0.18)' }}
        >
          <ul id={listId} role="listbox" className="py-1.5">
            {suggestions.map((s, i) => (
              <li
                key={s.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                // mousedown, not click, so the pick lands before the field's blur closes the list
                onMouseDown={e => { e.preventDefault(); pick(s) }}
                onMouseEnter={() => setActive(i)}
                className="flex items-start gap-3 px-4 py-2.5 cursor-pointer"
                style={{ backgroundColor: i === active ? '#EEE7FA' : undefined }}
              >
                <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: '#4B1D8F' }} aria-hidden />
                <span className="min-w-0 leading-snug">
                  <span className="block text-[15px] font-semibold truncate" style={{ color: '#1E1530' }}>{s.name}</span>
                  {s.context && <span className="block text-[13px] truncate" style={{ color: '#5F5870' }}>{s.context}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="px-4 py-1.5 text-[11px] text-right" style={{ color: '#8A82A0', borderTop: '1px solid #EEE9F5' }}>Search by Mapbox</p>
        </div>,
        document.body,
      )}
    </div>
  )
}
