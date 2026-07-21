'use client'
import { TRUCK_FRACTIONS, truckFractionPrice, KM_RATE, WEIGHT_RATE_PER_KG, STAIRS_FEE_RATE_PER_FLOOR, type TruckFractionLabel } from '@/lib/quote-pricing'

export interface DetailedQuoteFormProps {
  distanceKm: string; setDistanceKm: (v: string) => void
  loadMode: 'fraction' | 'weight'; setLoadMode: (v: 'fraction' | 'weight') => void
  loadFractionLabel: TruckFractionLabel | null; setLoadFractionLabel: (v: TruckFractionLabel | null) => void
  loadWeightKg: string; setLoadWeightKg: (v: string) => void
  toughJobFee: string; setToughJobFee: (v: string) => void
  laborWorkers: string; setLaborWorkers: (v: string) => void
  laborRate: string; setLaborRate: (v: string) => void
  laborHours: string; setLaborHours: (v: string) => void
  stairsFloors: string; setStairsFloors: (v: string) => void
  rushJob: boolean; setRushJob: (v: boolean) => void
  gst: boolean; setGst: (v: boolean) => void
  /** Show the "By Weight (kg)" load option alongside truck-fraction pricing. Default true. */
  showWeightOption?: boolean
  /** Show the per-floor no-elevator surcharge field. Default false. */
  showStairsFee?: boolean
}

export function DetailedQuoteForm(props: DetailedQuoteFormProps) {
  const {
    distanceKm, setDistanceKm, loadMode, setLoadMode, loadFractionLabel, setLoadFractionLabel,
    loadWeightKg, setLoadWeightKg, toughJobFee, setToughJobFee,
    laborWorkers, setLaborWorkers, laborRate, setLaborRate, laborHours, setLaborHours,
    stairsFloors, setStairsFloors,
    rushJob, setRushJob, gst, setGst,
    showWeightOption = true, showStairsFee = false,
  } = props

  return (
    <div style={{ marginBottom: '16px' }}>
      <FieldLabel>Distance to Job, one-way (km)</FieldLabel>
      <input
        type="number" min="0" step="1" value={distanceKm} onChange={e => setDistanceKm(e.target.value)} placeholder="0"
        style={inputStyle}
      />
      <div style={{ fontSize: '11px', color: '#9A8E83', margin: '4px 0 16px' }}>
        Charged both ways at ${KM_RATE}/km for gas.
      </div>

      <FieldLabel>Load Size</FieldLabel>
      {showWeightOption && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {(['fraction', 'weight'] as const).map(m => (
            <button key={m} type="button" onClick={() => setLoadMode(m)}
              style={{
                flex: 1, padding: '7px 8px', borderRadius: '8px',
                border: `1.5px solid ${loadMode === m ? '#254220' : '#E8E0D5'}`,
                background: loadMode === m ? '#F0F5EF' : 'white',
                color: loadMode === m ? '#254220' : '#6B5E54',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {m === 'fraction' ? 'By Truck Size' : 'By Weight (kg)'}
            </button>
          ))}
        </div>
      )}

      {(!showWeightOption || loadMode === 'fraction') ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          {TRUCK_FRACTIONS.map(f => {
            const active = loadFractionLabel === f.label
            const price = truckFractionPrice(f.label)
            return (
              <button key={f.label} type="button" onClick={() => setLoadFractionLabel(f.label)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 12px', borderRadius: '8px',
                  border: `1.5px solid ${active ? '#254220' : '#E8E0D5'}`,
                  background: active ? '#F0F5EF' : 'white',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: active ? '#254220' : '#1A1714' }}>{f.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: active ? '#254220' : '#6B5E54' }}>${price.toFixed(2)}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          <input
            type="number" min="0" step="1" value={loadWeightKg} onChange={e => setLoadWeightKg(e.target.value)} placeholder="0"
            style={inputStyle}
          />
          <div style={{ fontSize: '11px', color: '#9A8E83', marginTop: '4px' }}>
            ${(WEIGHT_RATE_PER_KG * 100).toFixed(0)} per 100kg (${WEIGHT_RATE_PER_KG.toFixed(2)}/kg).
          </div>
        </div>
      )}

      <FieldLabel>Tough Job Fee (CAD)</FieldLabel>
      <input type="number" min="0" step="1" value={toughJobFee} onChange={e => setToughJobFee(e.target.value)} placeholder="0"
        style={{ ...inputStyle, marginBottom: '16px' }} />

      <FieldLabel>Team Labour</FieldLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '4px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#9A8E83', marginBottom: '4px' }}>Workers</div>
          <input type="number" min="0" step="1" value={laborWorkers} onChange={e => setLaborWorkers(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#9A8E83', marginBottom: '4px' }}>$/hr each</div>
          <input type="number" min="0" step="1" value={laborRate} onChange={e => setLaborRate(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#9A8E83', marginBottom: '4px' }}>Hours</div>
          <input type="number" min="0" step="0.5" value={laborHours} onChange={e => setLaborHours(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
      </div>

      {showStairsFee && (
        <div style={{ marginTop: '16px' }}>
          <FieldLabel>Floors with No Elevator</FieldLabel>
          <input type="number" min="0" step="1" value={stairsFloors} onChange={e => setStairsFloors(e.target.value)} placeholder="0"
            style={inputStyle} />
          <div style={{ fontSize: '11px', color: '#9A8E83', marginTop: '4px' }}>
            +{(STAIRS_FEE_RATE_PER_FLOOR * 100).toFixed(0)}% of the base quote per floor.
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0' }}>
        <CheckboxRow label="Rush job (+25%)" checked={rushJob} onChange={setRushJob} />
        <CheckboxRow label="GST (5%)" checked={gst} onChange={setGst} />
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>
      {children}
    </label>
  )
}

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1A1714', cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#254220' }} />
      {label}
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #E8E0D5', borderRadius: '8px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}
