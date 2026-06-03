'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EMPTY_ORDER_FORM, type ApartmentSize, type OrderFormData } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import DatePicker from './DatePicker'
import {
  MapPin, Building2, User, Mail, Phone, ArrowRight, Check,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { short: 'Pickup',   title: 'Pickup location',        desc: 'Where are we picking up from?' },
  { short: 'Drop-off', title: 'Drop-off & move details', desc: 'Where are we delivering to, and when?' },
  { short: 'You',      title: 'Your information',        desc: 'How can we reach you?' },
]

const APARTMENT_SIZES = [
  { value: 'studio', label: 'Studio' },
  { value: '1br',    label: '1 BR'   },
  { value: '2br',    label: '2 BR'   },
  { value: '3br',    label: '3 BR'   },
  { value: '4br+',   label: '4+ BR'  },
]

const TIME_SLOTS = Array.from({ length: 31 }, (_, i) => {
  const total = 6 * 60 + i * 30
  const h = Math.floor(total / 60)
  const m = total % 60
  return {
    value: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    label:  `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`,
  }
})

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300"
              style={
                i < current
                  ? { backgroundColor: '#4D6B47', color: '#FAF7F2' }
                  : i === current
                    ? { backgroundColor: '#4D6B47', color: '#FAF7F2', boxShadow: '0 0 0 5px rgba(77,107,71,0.18)' }
                    : { backgroundColor: '#E8E0D5', color: '#B0A49A' }
              }
            >
              {i < current ? <Check size={14} strokeWidth={3} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 rounded-full transition-all duration-500"
                style={{ backgroundColor: i < current ? '#4D6B47' : '#E0D8D0' }} />
            )}
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 last:flex-none">
            <span className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: i <= current ? '#4D6B47' : '#C4B8AC' }}>
              {s.short}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FieldIcon({ icon: Icon, label, id, children }: {
  icon: React.ElementType; label: string; id?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold" style={{ color: '#4A3F38' }}>{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ color: '#A89F96' }} />
        {children}
      </div>
    </div>
  )
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm transition-all outline-none
        focus:border-[#4D6B47] focus:ring-2 focus:ring-[#4D6B47]/15 placeholder:text-[#C4B8AC] ${props.className ?? ''}`}
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E0D8D0', color: '#1A1714', ...props.style }}
    />
  )
}

function SizeCard({ value, label, selected, onClick }: {
  value: string; label: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 rounded-xl border text-sm font-semibold transition-all duration-150 hover:border-[#4D6B47]"
      style={{
        backgroundColor: selected ? '#4D6B47' : '#FFFFFF',
        borderColor:     selected ? '#4D6B47' : '#E0D8D0',
        color:           selected ? '#FAF7F2' : '#6B5E54',
        boxShadow:       selected ? '0 2px 8px rgba(77,107,71,0.25)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

function ElevatorPicker({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'No elevator',  val: false },
        { label: 'Has elevator', val: true  },
      ].map(opt => (
        <button
          key={String(opt.val)}
          type="button"
          onClick={() => onChange(opt.val)}
          className="h-11 rounded-xl border text-sm font-semibold transition-all duration-150 hover:border-[#4D6B47]"
          style={{
            backgroundColor: value === opt.val ? '#4D6B47' : '#FFFFFF',
            borderColor:     value === opt.val ? '#4D6B47' : '#E0D8D0',
            color:           value === opt.val ? '#FAF7F2' : '#6B5E54',
            boxShadow:       value === opt.val ? '0 2px 8px rgba(77,107,71,0.25)' : 'none',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function OrderForm() {
  const router = useRouter()
  const [step, setStep]     = useState(0)
  const [form, setForm]     = useState<OrderFormData>(EMPTY_ORDER_FORM)
  const [sending, setSending] = useState(false)

  function set<K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function canAdvance() {
    if (step === 0) return form.pickupAddress.trim().length > 0
    if (step === 1) return (
      form.dropoffAddress.trim().length > 0 &&
      form.apartmentSize !== '' &&
      form.movingDate !== '' &&
      form.movingTime !== ''
    )
    return (
      form.customerName.trim().length > 0 &&
      form.customerEmail.trim().length > 0 &&
      form.phone.trim().length > 0
    )
  }

  async function handleNext() {
    if (step < STEPS.length - 1) { setStep(s => s + 1); return }
    setSending(true)
    sessionStorage.setItem('pendingOrder', JSON.stringify(form))
    await fetch('/api/verify/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.customerEmail, name: form.customerName }),
    })
    setSending(false)
    router.push('/order/verify')
  }

  const today = new Date().toISOString().split('T')[0]
  const ready  = canAdvance() && !sending

  return (
    <div className="w-full">
      <StepIndicator current={step} />

      {/* ── Card ── */}
      <div className="rounded-2xl p-8 lg:p-10"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 32px rgba(0,0,0,0.08)', border: '1px solid #EDE6DE' }}>

        {/* Header */}
        <div className="mb-7 pb-6" style={{ borderBottom: '1px solid #F0EBE3' }}>
          <h2 className="text-xl font-bold" style={{ color: '#1A1714' }}>{STEPS[step].title}</h2>
          <p className="text-sm mt-1" style={{ color: '#9A8E83' }}>{STEPS[step].desc}</p>
        </div>

        <div className="flex flex-col gap-5">

          {/* ── Step 1: Pickup ── */}
          {step === 0 && (
            <>
              <FieldIcon icon={MapPin} label="Pickup address" id="pickupAddress">
                <StyledInput
                  id="pickupAddress"
                  placeholder="123 Main St, City"
                  value={form.pickupAddress}
                  onChange={e => set('pickupAddress', e.target.value)}
                />
              </FieldIcon>

              <FieldIcon icon={Building2} label="Floor number" id="pickupFloor">
                <StyledInput
                  id="pickupFloor"
                  type="number"
                  min={1} max={50}
                  value={form.pickupFloor}
                  onChange={e => set('pickupFloor', Number(e.target.value))}
                />
              </FieldIcon>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Elevator available?</span>
                <ElevatorPicker value={form.pickupHasElevator} onChange={v => set('pickupHasElevator', v)} />
              </div>
            </>
          )}

          {/* ── Step 2: Drop-off ── */}
          {step === 1 && (
            <>
              <FieldIcon icon={MapPin} label="Drop-off address" id="dropoffAddress">
                <StyledInput
                  id="dropoffAddress"
                  placeholder="456 New St, City"
                  value={form.dropoffAddress}
                  onChange={e => set('dropoffAddress', e.target.value)}
                />
              </FieldIcon>

              <FieldIcon icon={Building2} label="Floor number" id="dropoffFloor">
                <StyledInput
                  id="dropoffFloor"
                  type="number"
                  min={1} max={50}
                  value={form.dropoffFloor}
                  onChange={e => set('dropoffFloor', Number(e.target.value))}
                />
              </FieldIcon>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Elevator available?</span>
                <ElevatorPicker value={form.dropoffHasElevator} onChange={v => set('dropoffHasElevator', v)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Apartment size</span>
                <div className="grid grid-cols-5 gap-2">
                  {APARTMENT_SIZES.map(s => (
                    <SizeCard
                      key={s.value}
                      value={s.value}
                      label={s.label}
                      selected={form.apartmentSize === s.value}
                      onClick={() => set('apartmentSize', s.value as ApartmentSize)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Moving date</span>
                  <DatePicker id="movingDate" value={form.movingDate} onChange={v => set('movingDate', v)} min={today} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Arrival time</span>
                  <Select value={form.movingTime} onValueChange={v => set('movingTime', v)}>
                    <SelectTrigger className="h-9 bg-white border-[#E0D8D0] text-[#1A1714] rounded-xl">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* ── Step 3: Contact ── */}
          {step === 2 && (
            <>
              <FieldIcon icon={User} label="Full name" id="customerName">
                <StyledInput
                  id="customerName"
                  placeholder="Jane Smith"
                  value={form.customerName}
                  onChange={e => set('customerName', e.target.value)}
                />
              </FieldIcon>

              <FieldIcon icon={Mail} label="Email address" id="customerEmail">
                <StyledInput
                  id="customerEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={form.customerEmail}
                  onChange={e => set('customerEmail', e.target.value)}
                />
              </FieldIcon>

              <FieldIcon icon={Phone} label="Phone number" id="phone">
                <StyledInput
                  id="phone"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                />
              </FieldIcon>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="specialNotes" className="text-sm font-semibold" style={{ color: '#4A3F38' }}>
                  Special notes{' '}
                  <span className="font-normal text-[#B0A49A]">(optional)</span>
                </label>
                <Textarea
                  id="specialNotes"
                  placeholder="Heavy items, fragile furniture, access codes…"
                  rows={3}
                  value={form.specialNotes}
                  onChange={e => set('specialNotes', e.target.value)}
                  className="rounded-xl border resize-none text-sm placeholder:text-[#C4B8AC] focus:border-[#4D6B47] focus:ring-2 focus:ring-[#4D6B47]/15"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E0D8D0', color: '#1A1714' }}
                />
              </div>
            </>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between pt-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors hover:bg-[#F0EBE3]"
                style={{ color: '#9A8E83' }}
              >
                ← Back
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={!ready}
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#4D6B47',
                color: '#FAF7F2',
                boxShadow: ready ? '0 4px 14px rgba(77,107,71,0.35)' : 'none',
              }}
            >
              {sending ? 'Sending code…' : step < STEPS.length - 1 ? 'Continue' : 'Review Order'}
              {!sending && <ArrowRight size={14} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
