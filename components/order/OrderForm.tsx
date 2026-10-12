'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EMPTY_ORDER_FORM, type ApartmentSize, type OrderFormData } from '@/lib/types'
import { postOrderChat, type UnsureField } from '@/lib/order-chat'
import { Textarea } from '@/components/ui/textarea'
import TimeSlotPicker from './TimeSlotPicker'
import OrderChat from './OrderChat'
import {
  MapPin, Building2, User, Mail, Phone, ArrowRight, Check,
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
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-[background-color,color,box-shadow] duration-150"
              style={
                i < current
                  ? { backgroundColor: '#254220', color: '#FAF7F2' }
                  : i === current
                    ? { backgroundColor: '#254220', color: '#FAF7F2', boxShadow: '0 0 0 5px rgba(77,107,71,0.18)' }
                    : { backgroundColor: '#E8E0D5', color: '#B0A49A' }
              }
            >
              {i < current ? <Check size={14} strokeWidth={3} /> : i + 1}
            </div>

            {/* Label centered under circle */}
            <div className="absolute top-full mt-1.5 w-9 flex justify-center">
              <span className="text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap"
                style={{ color: i <= current ? '#254220' : '#C4B8AC' }}>
                {s.short}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 rounded-full transition-colors duration-300"
                style={{ backgroundColor: i < current ? '#254220' : '#E0D8D0' }} />
            )}
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
      className="h-12 rounded-xl border text-sm font-semibold transition-[background-color,border-color,box-shadow,color] duration-150 hover:border-[#254220]"
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

// `null` = "Not sure"; the order chat works out the real answer.
function ElevatorPicker({ value, onChange }: { value: boolean | null; onChange: (v: boolean | null) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'No elevator',  val: false },
        { label: 'Has elevator', val: true  },
        { label: 'Not sure',     val: null  },
      ].map(opt => (
        <button
          key={String(opt.val)}
          type="button"
          onClick={() => onChange(opt.val)}
          className="h-11 rounded-xl border text-sm font-semibold transition-[background-color,border-color,box-shadow,color] duration-150 hover:border-[#254220]"
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

function NotSureToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="self-start flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors duration-150 hover:border-[#254220]"
      style={{
        backgroundColor: active ? '#254220' : '#FFFFFF',
        borderColor:     active ? '#254220' : '#E0D8D0',
        color:           active ? '#FAF7F2' : '#6B5E54',
      }}
    >
      {active && <Check size={12} strokeWidth={3} />}
      Not sure
    </button>
  )
}


export default function OrderForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<OrderFormData>(EMPTY_ORDER_FORM)
  // Fields answered "Not sure" — resolved by the order chat before confirm.
  const [unsure, setUnsure] = useState<Set<UnsureField>>(new Set())
  const [chat, setChat] = useState<{ sessionId: string; question: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Seed the current history entry with step:0 so back button works correctly
  useEffect(() => {
    window.history.replaceState({ step: 0 }, '')
  }, [])

  // Browser back button → go to previous step instead of leaving the page
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const target = e.state?.step
      if (typeof target === 'number') {
        setChat(null)
        setStep(target)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function set<K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (unsure.has(key as UnsureField)) markUnsure(key as UnsureField, false)
  }

  function markUnsure(field: UnsureField, on: boolean) {
    setUnsure(prev => {
      const next = new Set(prev)
      if (on) next.add(field)
      else next.delete(field)
      return next
    })
  }

  function setElevator(field: 'pickupHasElevator' | 'dropoffHasElevator', value: boolean | null) {
    if (value === null) markUnsure(field, true)
    else set(field, value)
  }

  function canAdvance() {
    if (step === 0) return form.movingDate !== '' && form.movingTime !== ''
    if (step === 1) return form.pickupAddress.trim().length > 0
    if (step === 2) return (
      form.dropoffAddress.trim().length > 0 &&
      (form.apartmentSize !== '' || unsure.has('apartmentSize'))
    )
    return (
      form.customerName.trim().length > 0 &&
      form.customerEmail.trim().length > 0 &&
      form.phone.trim().length > 0
    )
  }

  async function handleNext() {
    if (step < STEPS.length - 1) {
      const next = step + 1
      window.history.pushState({ step: next }, '')
      setStep(next)
      return
    }

    const unsureFields = [...unsure]
    setSubmitting(true)
    setSubmitError('')
    try {
      const reply = await postOrderChat({ action: 'start', form, unsure: unsureFields })
      if (reply.done) finish(reply.variables)
      else setChat({ sessionId: reply.sessionId, question: reply.question ?? '' })
    } catch (err) {
      // The assistant is only essential when something was marked "Not sure".
      if (unsureFields.length === 0) finish(form)
      else setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  // Take the chat's answers for the "Not sure" fields; everything else stays as typed.
  function finish(variables: OrderFormData) {
    const resolved = { ...form }
    for (const field of unsure) Object.assign(resolved, { [field]: variables[field] })
    sessionStorage.setItem('pendingOrder', JSON.stringify(resolved))
    router.push('/order/confirm')
  }

  const ready = canAdvance() && !submitting

  return (
    <div className="w-full">
      <StepIndicator current={step} />

      {/* â"€â"€ Card â"€â"€ */}
      <div className="rounded-2xl p-8 lg:p-10"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 32px rgba(0,0,0,0.08)', border: '1px solid #EDE6DE' }}>

        {/* Header */}
        <div className="mb-7 pb-6" style={{ borderBottom: '1px solid #F0EBE3' }}>
          <h2 className="text-xl font-bold" style={{ color: '#1A1714' }}>
            {chat ? 'A few quick questions' : STEPS[step].title}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#9A8E83' }}>
            {chat ? 'Help us fill in the details you weren\'t sure about.' : STEPS[step].desc}
          </p>
        </div>

        {chat ? (
          <OrderChat
            sessionId={chat.sessionId}
            firstQuestion={chat.question}
            onComplete={finish}
            onBack={() => setChat(null)}
          />
        ) : (
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
              <FieldIcon icon={MapPin} label="Pickup address" id="pickupAddress">
                <StyledInput
                  id="pickupAddress"
                  placeholder="123 Main St, City"
                  value={form.pickupAddress}
                  onChange={e => set('pickupAddress', e.target.value)}
                />
              </FieldIcon>

              <div className="flex flex-col gap-2">
                <FieldIcon icon={Building2} label="Floor number" id="pickupFloor">
                  <StyledInput
                    id="pickupFloor"
                    type="number"
                    min={1} max={50}
                    disabled={unsure.has('pickupFloor')}
                    value={unsure.has('pickupFloor') ? '' : form.pickupFloor}
                    onChange={e => set('pickupFloor', Number(e.target.value))}
                    className="disabled:opacity-50"
                  />
                </FieldIcon>
                <NotSureToggle
                  active={unsure.has('pickupFloor')}
                  onClick={() => markUnsure('pickupFloor', !unsure.has('pickupFloor'))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Elevator available?</span>
                <ElevatorPicker
                  value={unsure.has('pickupHasElevator') ? null : form.pickupHasElevator}
                  onChange={v => setElevator('pickupHasElevator', v)}
                />
              </div>
            </>
          )}

          {/* â"€â"€ Step 3: Drop-off â"€â"€ */}
          {step === 2 && (
            <>
              <FieldIcon icon={MapPin} label="Drop-off address" id="dropoffAddress">
                <StyledInput
                  id="dropoffAddress"
                  placeholder="456 New St, City"
                  value={form.dropoffAddress}
                  onChange={e => set('dropoffAddress', e.target.value)}
                />
              </FieldIcon>

              <div className="flex flex-col gap-2">
                <FieldIcon icon={Building2} label="Floor number" id="dropoffFloor">
                  <StyledInput
                    id="dropoffFloor"
                    type="number"
                    min={1} max={50}
                    disabled={unsure.has('dropoffFloor')}
                    value={unsure.has('dropoffFloor') ? '' : form.dropoffFloor}
                    onChange={e => set('dropoffFloor', Number(e.target.value))}
                    className="disabled:opacity-50"
                  />
                </FieldIcon>
                <NotSureToggle
                  active={unsure.has('dropoffFloor')}
                  onClick={() => markUnsure('dropoffFloor', !unsure.has('dropoffFloor'))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Elevator available?</span>
                <ElevatorPicker
                  value={unsure.has('dropoffHasElevator') ? null : form.dropoffHasElevator}
                  onChange={v => setElevator('dropoffHasElevator', v)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold" style={{ color: '#4A3F38' }}>Apartment size</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {APARTMENT_SIZES.map(s => (
                    <SizeCard
                      key={s.value}
                      label={s.label}
                      selected={!unsure.has('apartmentSize') && form.apartmentSize === s.value}
                      onClick={() => set('apartmentSize', s.value as ApartmentSize)}
                    />
                  ))}
                  <SizeCard
                    label="Not sure"
                    selected={unsure.has('apartmentSize')}
                    onClick={() => markUnsure('apartmentSize', true)}
                  />
                </div>
              </div>

            </>
          )}

          {/* â"€â"€ Step 4: Contact â"€â"€ */}
          {step === 3 && (
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
                  className="rounded-xl border resize-none text-sm placeholder:text-[#C4B8AC] focus:border-[#254220] focus:ring-2 focus:ring-[#254220]/15"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E0D8D0', color: '#1A1714' }}
                />
              </div>
            </>
          )}

          {/* â"€â"€ Navigation â"€â"€ */}
          <div className="flex items-center justify-between pt-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => window.history.back()}
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
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-[box-shadow,opacity] duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#254220',
                color: '#FAF7F2',
                boxShadow: ready ? '0 4px 14px rgba(77,107,71,0.35)' : 'none',
              }}
            >
              {step < STEPS.length - 1 ? 'Continue' : submitting ? 'Checking…' : 'Review Quote'}
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

          {submitError && (
            <p className="text-sm text-right" style={{ color: '#B42318' }}>{submitError}</p>
          )}
        </div>
        )}
      </div>
    </div>
  )
}



