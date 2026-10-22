'use client'
import { LEAD_SOURCES, type LeadSource } from '@/lib/types'

interface Props {
  value: LeadSource | ''
  onChange: (value: LeadSource | '') => void
}

// Click the selected source again to clear it.
export default function LeadSourcePicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px' }}>
      {LEAD_SOURCES.map(s => {
        const on = value === s.value
        return (
          <button key={s.value} type="button"
            onClick={() => onChange(on ? '' : s.value)}
            style={{ padding: '8px 10px', border: '1.5px solid', borderColor: on ? '#254220' : '#E8E0D5', borderRadius: '8px', background: on ? '#254220' : 'white', color: on ? 'white' : '#6B5E54', fontSize: '12.5px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
          >{s.label}</button>
        )
      })}
    </div>
  )
}
