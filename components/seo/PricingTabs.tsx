'use client'

import { useState, type ReactNode } from 'react'
import { Boxes, Sofa } from 'lucide-react'

const GREEN = '#254220'
const MUTED = '#6B5E54'

const TABS = [
  { id: 'multiple', label: 'Multiple items', Icon: Boxes },
  { id: 'single', label: 'Single item', Icon: Sofa },
] as const

/** Two-tab switcher for the junk pricing page - the panels are rendered on the server and passed in */
export default function PricingTabs({ multiple, single }: { multiple: ReactNode; single: ReactNode }) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('multiple')
  return (
    <div>
      <div role="tablist" aria-label="Pricing type" className="grid grid-cols-2" style={{ borderBottom: '1px solid #D8D0C5' }}>
        {TABS.map(({ id, label, Icon }) => {
          const on = tab === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={on}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className="flex flex-col items-center gap-1.5 pt-2 pb-3 -mb-px text-[15px] sm:text-base font-extrabold transition-colors"
              style={{ color: on ? GREEN : MUTED, borderBottom: `3px solid ${on ? GREEN : 'transparent'}` }}
            >
              <Icon size={26} strokeWidth={1.6} aria-hidden />
              {label}
            </button>
          )
        })}
      </div>
      <div role="tabpanel" id="panel-multiple" aria-labelledby="tab-multiple" hidden={tab !== 'multiple'}>{multiple}</div>
      <div role="tabpanel" id="panel-single" aria-labelledby="tab-single" hidden={tab !== 'single'}>{single}</div>
    </div>
  )
}
