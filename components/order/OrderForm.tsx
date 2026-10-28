'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { EMPTY_ORDER_FORM, ORDER_START_KEY, type ApartmentSize, type OrderFormData, type OrderStart } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'
import TimeSlotPicker from './TimeSlotPicker'
import { cn } from '@/lib/utils'
import {
  MapPin, Building2, User, Mail, Phone, ArrowRight, Check, CheckCircle2,
} from 'lucide-react'


const STEPS = [
  { short: 'Schedule', title: 'When works best for you?', desc: 'Pick a day and an open start time.' },
  { short: 'Pickup',   title: 'Pickup location',          desc: 'Where are we picking up from?' },
  { short: 'Drop-off', title: 'Drop-off & move details',  desc: 'Where are we delivering to?' },
  { short: 'You',      title: 'Your information',         desc: 'How can we reach you?' },
]

const APARTMENT_SIZES = [
  { value: 'studio', label: 'Studio' },
  { value: '1br',    label: '1 BR'   },
  { value: '2br',    label: '2 BR'   },
  { value: '3br',    label: '3 BR'   },
  { value: '4br+',   label: '4+ BR'  },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={i} className="relative flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            {/* Circle */}
            <div className="relative flex-shrink-0">
              {i === current && (
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: 'rgba(37,66,32,0.35)', animationDuration: '2.2s' }}
                />
              )}
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-[background-color,color,box-shadow] duration-300"
                style={
                  i < current
                    ? { backgroundColor: '#254220', color: '#FAF7F2' }
                    : i === current
                      ? { backgroundColor: '#254220', color: '#FAF7F2', boxShadow: '0 0 0 5px rgba(77,107,71,0.18)' }
                      : { backgroundColor: '#E8E0D5', color: '#B0A49A' }
                }
              >
                {i < current ? (
                  <span key="done" className="animate-in zoom-in-50 fade-in duration-300">
                    <Check size={14} strokeWidth={3} />
                  </span>
                ) : i + 1}
              </div>
            </div>

            {/* Label centered under circle */}
            <div className="absolute top-full mt-1.5 w-9 flex justify-center">
              <span className="text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap transition-colors duration-300"
                style={{ color: i <= current ? '#254220' : '#C4B8AC' }}>
                {s.short}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 rounded-full transition-colors duration-500"
                style={{ backgroundColor: i < current ? '#254220' : '#E0D8D0' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FieldIcon({ icon: Icon, label, id, children, valid }: {
  icon: React.ElementType; label: string; id?: string; children: React.ReactNode; valid?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="text-sm font-semibold" style={{ color: '#4A3F38' }}>{label}</label>
        {valid && (
          <CheckCircle2
            key="valid"
            size={14}
            strokeWidth={2.5}
            className="animate-in zoom-in-50 fade-in duration-200"
            style={{ color: '#3FA34D' }}
          />
        )}
      </div>
      <div className="relative">
        <span
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center pointer-events-none z-10 transition-colors duration-300"
          style={{ backgroundColor: valid ? '#D6E8D3' : '#F0EBE3' }}
        >
          <Icon size={14} style={{ color: valid ? '#254220' : '#9A8E83' }} />
        </span>
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
        focus:border-[#254220] focus:ring-2 focus:ring-[#254220]/15 placeholder:text-[#C4B8AC] ${props.className ?? ''}`}
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E0D8D0', color: '#1A1714', ...props.style }}
    />
  )
}

function SizeCard({ label, selected, onClick }: {
  label: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-12 rounded-xl border text-sm font-semibold transition-[background-color,border-color,box-shadow,color,transform] duration-150 hover:border-[#254220] hover:scale-[1.05] active:scale-95',
        selected && 'scale-[1.03]'
      )}
      style={{
        backgroundColor: selected ? '#254220' : '#FFFFFF',
        borderColor:     selected ? '#254220' : '#E0D8D0',
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
          className={cn(
            'h-11 rounded-xl border text-sm font-semibold transition-[background-color,border-color,box-shadow,color,transform] duration-150 hover:border-[#254220] hover:scale-[1.03] active:scale-95',
            value === opt.val && 'scale-[1.02]'
          )}
          style={{
            backgroundColor: value === opt.val ? '#254220' : '#FFFFFF',
            borderColor:     value === opt.val ? '#254220' : '#E0D8D0',
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


function readOrderStart(): OrderStart {
  if (typeof window === 'undefined') return {}
  try {
    const { pickupAddress, dropoffAddress, apartmentSize }: OrderStart = JSON.parse(sessionStorage.getItem(ORDER_START_KEY) ?? '{}')
    return {
      ...(pickupAddress && { pickupAddress }),
      ...(dropoffAddress && { dropoffAddress }),
      ...(apartmentSize && { apartmentSize }),
    }
  } catch {
    return {}
  }
}

export default function OrderForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  // Prefilled from the booking-start form on the moving service pages. Safe to differ from the
  // server render: those fields only show from step 1, after hydration.
  const [form, setForm] = useState<OrderFormData>(() => ({ ...EMPTY_ORDER_FORM, ...readOrderStart() }))
  const stepRef = useRef(0)
  useEffect(() => { stepRef.current = step }, [step])

  // Seed the current history entry with step:0 so back button works correctly
  useEffect(() => {
    window.history.replaceState({ step: 0 }, '')
  }, [])

  // The prefill is used once
  useEffect(() => {
    try { sessionStorage.removeItem(ORDER_START_KEY) } catch {}
  }, [])

  // Browser back button → go to previous step instead of leaving the page
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const target = e.state?.step
      if (typeof target === 'number') {
        setDirection(target < stepRef.current ? 'back' : 'forward')
        setStep(target)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function set<K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function canAdvance() {
    if (step === 0) return form.movingDate !== '' && form.movingTime !== ''
    if (step === 1) return form.pickupAddress.trim().length > 0
    if (step === 2) return (
      form.dropoffAddress.trim().length > 0 &&
      form.apartmentSize !== ''
    )
    return (
      form.customerName.trim().length > 0 &&
      form.customerEmail.trim().length > 0 &&
      form.phone.trim().length > 0
    )
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      const next = step + 1
      setDirection('forward')
      window.history.pushState({ step: next }, '')
      setStep(next)
      return
    }
    sessionStorage.setItem('pendingOrder', JSON.stringify(form))
    router.push('/order/confirm')
  }

  const ready = canAdvance()

  return (
    <div className="w-full">
      <StepIndicator current={step} />

      {/* â"€â"€ Card â"€â"€ */}
      <div className="rounded-2xl p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 32px rgba(0,0,0,0.08)', border: '1px solid #EDE6DE' }}>

        <div
          key={step}
          className={cn(
            'animate-in fade-in duration-300',
            direction === 'forward' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'
          )}
        >
          {/* Header */}
          <div className="mb-7 pb-6" style={{ borderBottom: '1px solid #F0EBE3' }}>
            <h2 className="text-xl font-bold" style={{ color: '#1A1714' }}>{STEPS[step].title}</h2>
            <p className="text-sm mt-1" style={{ color: '#9A8E83' }}>{STEPS[step].desc}</p>
          </div>

          <div className="flex flex-col gap-5">

          {/* â"€â"€ Step 1: Schedule â"€â"€ */}
          {step === 0 && (
            <TimeSlotPicker
              jobType="moving"
              date={form.movingDate}
              time={form.movingTime}
              onChange={(date, time) => setForm(prev => ({ ...prev, movingDate: date, movingTime: time }))}
            />
          )}

          {/* â"€â"€ Step 2: Pickup â"€â"€ */}
          {step === 1 && (
            <>
              <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '0ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <FieldIcon icon={MapPin} label="Pickup address" id="pickupAddress" valid={form.pickupAddress.trim().length > 0}>
                  <StyledInput
                    id="pickupAddress"
                    placeholder="123 Main St, City"
                    value={form.pickupAddress}
                    onChange={e => set('pickupAddress', e.target.value)}
                  />
                </FieldIcon>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '60ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <FieldIcon icon={Building2} label="Floor number" id="pickupFloor">
                  <StyledInput
                    id="pickupFloor"
                    type="number"
                    min={1} max={50}
                    value={form.pickupFloor}
                    onChange={e => set('pickupFloor', Number(e.target.value))}
                  />
                </FieldIcon>
              </div>

              <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '120ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Elevator available?</span>
                <ElevatorPicker value={form.pickupHasElevator} onChange={v => set('pickupHasElevator', v)} />
              </div>
            </>
          )}

          {/* â"€â"€ Step 3: Drop-off â"€â"€ */}
          {step === 2 && (
            <>
              <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '0ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <FieldIcon icon={MapPin} label="Drop-off address" id="dropoffAddress" valid={form.dropoffAddress.trim().length > 0}>
                  <StyledInput
                    id="dropoffAddress"
                    placeholder="456 New St, City"
                    value={form.dropoffAddress}
                    onChange={e => set('dropoffAddress', e.target.value)}
                  />
                </FieldIcon>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '60ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <FieldIcon icon={Building2} label="Floor number" id="dropoffFloor">
                  <StyledInput
                    id="dropoffFloor"
                    type="number"
                    min={1} max={50}
                    value={form.dropoffFloor}
                    onChange={e => set('dropoffFloor', Number(e.target.value))}
                  />
                </FieldIcon>
              </div>

              <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '120ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Elevator available?</span>
                <ElevatorPicker value={form.dropoffHasElevator} onChange={v => set('dropoffHasElevator', v)} />
              </div>

              <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '180ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Apartment size</span>
                <div className="grid grid-cols-5 gap-2">
                  {APARTMENT_SIZES.map(s => (
                    <SizeCard
                      key={s.value}
                      label={s.label}
                      selected={form.apartmentSize === s.value}
                      onClick={() => set('apartmentSize', s.value as ApartmentSize)}
                    />
                  ))}
                </div>
              </div>

            </>
          )}

          {/* â"€â"€ Step 4: Contact â"€â"€ */}
          {step === 3 && (
            <>
              <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '0ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <FieldIcon icon={User} label="Full name" id="customerName" valid={form.customerName.trim().length > 0}>
                  <StyledInput
                    id="customerName"
                    placeholder="Jane Smith"
                    value={form.customerName}
                    onChange={e => set('customerName', e.target.value)}
                  />
                </FieldIcon>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '60ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <FieldIcon icon={Mail} label="Email address" id="customerEmail" valid={/\S+@\S+\.\S+/.test(form.customerEmail)}>
                  <StyledInput
                    id="customerEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={form.customerEmail}
                    onChange={e => set('customerEmail', e.target.value)}
                  />
                </FieldIcon>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '120ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
                <FieldIcon icon={Phone} label="Phone number" id="phone" valid={form.phone.trim().length > 0}>
                  <StyledInput
                    id="phone"
                    type="tel"
                    placeholder="+1 555 000 0000"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </FieldIcon>
              </div>

              <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '180ms', animationDuration: '300ms', animationFillMode: 'backwards' }}>
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
                  className="rounded-xl border resize-none text-sm placeholder:text-[#C4B8AC] focus:border-[#254220] focus:ring-2 focus:ring-[#254220]/15"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E0D8D0', color: '#1A1714' }}
                />
              </div>
            </>
          )}
          </div>
        </div>

        {/* â"€â"€ Navigation â"€â"€ */}
        <div className="flex items-center justify-between pt-5">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 hover:bg-[#F0EBE3] hover:-translate-x-0.5"
              style={{ color: '#9A8E83' }}
            >
              ← Back
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            disabled={!ready}
            className={cn(
              'group flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed',
              ready && 'hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.97]'
            )}
            style={{
              backgroundColor: '#254220',
              color: '#FAF7F2',
              boxShadow: ready ? '0 4px 14px rgba(77,107,71,0.35)' : 'none',
            }}
          >
            {step < STEPS.length - 1 ? 'Continue' : 'Review Quote'}
            <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}



