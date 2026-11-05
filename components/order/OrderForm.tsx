'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import {
  EMPTY_ORDER_FORM, HOME_SIZES, MOVE_TYPES, ORDER_START_KEY, sizesFor,
  type DateFlex, type MoveType, type OrderFormData, type OrderStart,
} from '@/lib/types'
import { addDays, nowInBusinessZone } from '@/lib/scheduling'
import { Textarea } from '@/components/ui/textarea'
import MonthCalendar from './MonthCalendar'
import { cn } from '@/lib/utils'
import {
  MapPin, User, Mail, Phone, ArrowRight, Check, CheckCircle2,
  Home, Building2, Briefcase, Warehouse, Package, Zap, CalendarRange, CalendarDays,
} from 'lucide-react'

type StepKey = 'type' | 'size' | 'date' | 'pickup' | 'dropoff' | 'contact'

const STEP_INFO: Record<StepKey, { short: string; title: string; desc: string }> = {
  type:    { short: 'Move', title: 'What are you moving?',               desc: 'Choose the type of move.' },
  size:    { short: 'Size', title: 'How big is the move?',               desc: 'Pick the closest size.' },
  date:    { short: 'Date', title: 'When do you want to move?',          desc: 'Pick a day, or any day this week. We confirm the arrival time with you.' },
  pickup:  { short: 'From', title: 'Where are we picking up?',           desc: 'The address we are moving you from.' },
  dropoff: { short: 'To',   title: 'Where are you moving to?',           desc: 'A full address, a city or a postal code is fine.' },
  contact: { short: 'You',  title: 'Where should we send your estimate?', desc: 'We reply within 24 hours.' },
}

const SIZE_TITLES: Partial<Record<MoveType, string>> = {
  house: 'How many bedrooms?',
  apartment: 'How many bedrooms?',
  commercial: 'How big is the office?',
  storage: 'What size is the storage unit?',
}

const TYPE_ICONS: Record<MoveType, React.ElementType> = {
  house: Home,
  apartment: Building2,
  commercial: Briefcase,
  storage: Warehouse,
  small: Package,
}

const DATE_OPTIONS: { value: DateFlex; label: string; Icon: React.ElementType }[] = [
  { value: 'today', label: 'Today', Icon: Zap },
  { value: 'this_week', label: 'This week', Icon: CalendarRange },
  { value: 'date', label: 'Choose a date', Icon: CalendarDays },
]

/** A small move needs no size */
function stepsFor(type: OrderFormData['moveType']): StepKey[] {
  return type === 'small'
    ? ['type', 'date', 'pickup', 'dropoff', 'contact']
    : ['type', 'size', 'date', 'pickup', 'dropoff', 'contact']
}

function StepIndicator({ steps, current }: { steps: StepKey[]; current: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center">
        {steps.map((key, i) => (
          <div key={key} className="relative flex items-center" style={{ flex: i < steps.length - 1 ? 1 : 'none' }}>
            {/* Circle */}
            <div className="relative flex-shrink-0">
              {i === current && (
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: 'rgba(37,66,32,0.35)', animationDuration: '2.2s' }}
                />
              )}
              <div
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold transition-[background-color,color,box-shadow] duration-300"
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
            <div className="absolute top-full mt-1.5 w-8 sm:w-9 flex justify-center">
              <span className="text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap transition-colors duration-300"
                style={{ color: i <= current ? '#254220' : '#C4B8AC' }}>
                {STEP_INFO[key].short}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-1.5 sm:mx-2 rounded-full transition-colors duration-500"
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
      className={`w-full h-12 pl-10 pr-4 rounded-xl border text-base sm:text-sm transition-all outline-none
        focus:border-[#254220] focus:ring-2 focus:ring-[#254220]/15 placeholder:text-[#C4B8AC] ${props.className ?? ''}`}
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E0D8D0', color: '#1A1714', ...props.style }}
    />
  )
}

const GREEN = '#014421'
const CREAM = '#FAF7F2'

/** A big tappable choice on a soft green tint; the selected one fills solid green */
function ChoiceCard({ selected, onClick, className, children }: {
  selected: boolean; onClick: () => void; className?: string; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'rounded-xl border text-center transition-[background-color,border-color,box-shadow,transform] duration-150 active:scale-[0.98]',
        !selected && 'hover:border-[#014421] hover:bg-[#EAF2E7]',
        className,
      )}
      style={{
        backgroundColor: selected ? GREEN : '#F3F8F1',
        borderColor: selected ? GREEN : '#D6E4D2',
        boxShadow: selected ? '0 8px 20px -10px rgba(1,68,33,0.6)' : 'none',
      }}
    >
      {children}
    </button>
  )
}

/** The icon in a solid green circle; it turns cream on the selected card */
function IconBadge({ icon: Icon, selected }: { icon: React.ElementType; selected: boolean }) {
  return (
    <span className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-150"
      style={{ backgroundColor: selected ? CREAM : GREEN }}>
      <Icon size={22} strokeWidth={2} style={{ color: selected ? GREEN : CREAM }} aria-hidden />
    </span>
  )
}

const choiceText = (selected: boolean) => ({ color: selected ? CREAM : '#1A1714' })

function readOrderStart(): Partial<OrderFormData> {
  if (typeof window === 'undefined') return {}
  try {
    const { pickupAddress, dropoffAddress, apartmentSize }: OrderStart = JSON.parse(sessionStorage.getItem(ORDER_START_KEY) ?? '{}')
    return {
      ...(pickupAddress && { pickupAddress }),
      ...(dropoffAddress && { dropoffAddress }),
      // The price estimator's home size waits on the size step once house or apartment is picked
      ...(apartmentSize && HOME_SIZES.some(s => s.value === apartmentSize) && { moveSize: apartmentSize }),
    }
  } catch {
    return {}
  }
}

const fadeUp = (delay: number) => ({ animationDelay: `${delay}ms`, animationDuration: '300ms', animationFillMode: 'backwards' as const })

export default function OrderForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  // Prefilled from the hero form and the price estimator. Safe to differ from the server render:
  // those fields only show from the size step on, after hydration.
  const [form, setForm] = useState<OrderFormData>(() => ({ ...EMPTY_ORDER_FORM, ...readOrderStart() }))
  const stepRef = useRef(0)
  useEffect(() => { stepRef.current = step }, [step])
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Which date card is open; a day picked under "This week" is saved as an exact date
  const [dateMode, setDateMode] = useState<DateFlex | ''>('')

  const steps = stepsFor(form.moveType)
  const key = steps[step] ?? 'type'
  const today = nowInBusinessZone().date
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i + 1))

  // Seed the current history entry with step:0 so back button works correctly. The step is added to
  // Next's own history state rather than replacing it: an entry without Next's state makes Back reload the page.
  useEffect(() => {
    window.history.replaceState({ ...window.history.state, step: 0 }, '')
  }, [])

  // The prefill is used once
  useEffect(() => {
    try { sessionStorage.removeItem(ORDER_START_KEY) } catch {}
  }, [])

  // Funnel: quote_step_N_view once each time a step comes on screen (not on rerenders)
  const lastViewed = useRef(-1)
  useEffect(() => {
    if (lastViewed.current === step) return
    lastViewed.current = step
    trackEvent(`quote_step_${step + 1}_view`, { step_name: key, move_type: form.moveType || undefined })
  }, [step, key, form.moveType])

  // Browser back button → go to previous step instead of leaving the page
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      // The first entry may have lost its step to Next's own state; it is the first step
      const target = e.state?.step ?? 0
      if (typeof target === 'number') {
        if (advanceTimer.current) clearTimeout(advanceTimer.current)
        setDirection(target < stepRef.current ? 'back' : 'forward')
        setStep(target)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current) }, [])

  function set<K extends keyof OrderFormData>(field: K, value: OrderFormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function canAdvance() {
    const f = form
    switch (key) {
      case 'type':    return !!f.moveType
      case 'size':    return sizesFor(f.moveType).some(s => s.value === f.moveSize)
      case 'date':    return !!f.dateFlex && !!f.movingDate
      case 'pickup':  return f.pickupAddress.trim().length > 0
      case 'dropoff': return f.dropoffAddress.trim().length > 0
      case 'contact': return (
        f.customerName.trim().length > 0 &&
        /\S+@\S+\.\S+/.test(f.customerEmail) &&
        f.phone.replace(/\D/g, '').length >= 10
      )
    }
  }

  function goNext() {
    if (step < steps.length - 1) {
      const next = step + 1
      setDirection('forward')
      window.history.pushState({ ...window.history.state, step: next }, '')
      setStep(next)
      return
    }
    sessionStorage.setItem('pendingOrder', JSON.stringify(form))
    router.push('/order/confirm')
  }

  /** Choosing a card moves on by itself, after a beat so the choice is seen */
  function chooseAndAdvance(patch: Partial<OrderFormData>) {
    setForm(prev => ({ ...prev, ...patch }))
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(goNext, 220)
  }

  function chooseType(type: MoveType) {
    // A size only carries over between house and apartment, which share the bedroom sizes
    const keepSize = sizesFor(type).some(s => s.value === form.moveSize)
    chooseAndAdvance({ moveType: type, moveSize: keepSize ? form.moveSize : '' })
  }

  function chooseDate(mode: DateFlex) {
    if (mode === 'today') {
      setDateMode('today')
      chooseAndAdvance({ dateFlex: 'today', movingDate: today })
      return
    }
    // "This week" opens the next 7 days and "Choose a date" the calendar; picking a day there moves on
    if (mode !== dateMode) setForm(prev => ({ ...prev, dateFlex: '', movingDate: '' }))
    setDateMode(mode)
  }

  const ready = canAdvance()
  const sizes = sizesFor(form.moveType)
  const title = key === 'size' ? SIZE_TITLES[form.moveType as MoveType] ?? STEP_INFO.size.title : STEP_INFO[key].title

  return (
    <div className="w-full">
      <StepIndicator steps={steps} current={step} />

      {/* Card */}
      <div className="rounded-2xl p-5 sm:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 32px rgba(0,0,0,0.08)', border: '1px solid #EDE6DE' }}>

        <div
          key={key}
          className={cn(
            'animate-in fade-in duration-300',
            direction === 'forward' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'
          )}
        >
          {/* Header */}
          <div className="mb-6 pb-5" style={{ borderBottom: '1px solid #F0EBE3' }}>
            <h2 className="text-xl font-bold" style={{ color: '#1A1714' }}>{title}</h2>
            <p className="text-sm mt-1" style={{ color: '#9A8E83' }}>{STEP_INFO[key].desc}</p>
          </div>

          <div className="flex flex-col gap-5">

          {/* Step: move type */}
          {key === 'type' && (
            // Phones: 2 + 2 + 1 wide; wider: 3 on top, 2 centred below
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {MOVE_TYPES.map((t, i) => {
                const Icon = TYPE_ICONS[t.value]
                const selected = form.moveType === t.value
                return (
                  <ChoiceCard
                    key={t.value}
                    selected={selected}
                    onClick={() => chooseType(t.value)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 px-3 py-5 sm:col-span-2 animate-in fade-in slide-in-from-bottom-2',
                      i === 3 && 'sm:col-start-2',
                      i === MOVE_TYPES.length - 1 && 'col-span-2',
                    )}
                  >
                    <IconBadge icon={Icon} selected={selected} />
                    <span className="text-[15px] font-bold leading-tight" style={choiceText(selected)}>{t.label}</span>
                  </ChoiceCard>
                )
              })}
            </div>
          )}

          {/* Step: size - bedrooms, office size or storage unit size */}
          {key === 'size' && (
            <div className="grid grid-cols-2 gap-3">
              {sizes.map(s => {
                const selected = form.moveSize === s.value
                return (
                  <ChoiceCard
                    key={s.value}
                    selected={selected}
                    onClick={() => chooseAndAdvance({ moveSize: s.value })}
                    className="flex flex-col items-center justify-center px-2 py-4 sm:py-5 min-h-[104px] animate-in fade-in slide-in-from-bottom-2"
                  >
                    <span className="text-[34px] font-black leading-none" style={{ color: selected ? CREAM : GREEN }}>{s.short}</span>
                    {form.moveType === 'storage' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: selected ? '#B9D3B3' : '#A9743F' }}>sqft</span>
                    )}
                    <span className="text-[13px] sm:text-sm font-semibold mt-1.5 leading-snug" style={{ color: selected ? '#D9E8D5' : '#4A3F38' }}>
                      {form.moveType === 'house' || form.moveType === 'apartment' ? (s.short === '1' ? 'Bedroom' : 'Bedrooms') : s.label}
                    </span>
                  </ChoiceCard>
                )
              })}
            </div>
          )}

          {/* Step: date - today, this week or a day on the calendar */}
          {key === 'date' && (
            <>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {DATE_OPTIONS.map(({ value, label, Icon }) => {
                  const selected = dateMode === value
                  return (
                    <ChoiceCard
                      key={value}
                      selected={selected}
                      onClick={() => chooseDate(value)}
                      className="flex flex-col items-center justify-center gap-2 px-1.5 py-4 sm:py-5"
                    >
                      <IconBadge icon={Icon} selected={selected} />
                      <span className="text-[14px] sm:text-[15px] font-bold leading-tight" style={choiceText(selected)}>{label}</span>
                    </ChoiceCard>
                  )
                })}
              </div>
              {dateMode === 'this_week' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-sm font-semibold mb-2.5" style={{ color: '#4A3F38' }}>Which day works?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[null, ...weekDays].map(day => {
                      const selected = day ? form.dateFlex === 'date' && form.movingDate === day : form.dateFlex === 'this_week'
                      const d = day ? new Date(`${day}T12:00:00`) : null
                      return (
                        <ChoiceCard
                          key={day ?? 'any'}
                          selected={selected}
                          onClick={() => chooseAndAdvance(day ? { dateFlex: 'date', movingDate: day } : { dateFlex: 'this_week', movingDate: today })}
                          className="flex flex-col items-center justify-center h-16"
                        >
                          {d ? (
                            <>
                              <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: selected ? '#B9D3B3' : '#A9743F' }}>
                                {d.toLocaleDateString('en-CA', { weekday: 'short' })}
                              </span>
                              <span className="text-lg font-black leading-tight" style={{ color: selected ? CREAM : GREEN }}>{d.getDate()}</span>
                            </>
                          ) : (
                            <span className="text-[13px] font-bold leading-tight px-1" style={{ color: selected ? CREAM : GREEN }}>Any day</span>
                          )}
                        </ChoiceCard>
                      )
                    })}
                  </div>
                </div>
              )}
              {dateMode === 'date' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <MonthCalendar
                    value={form.movingDate}
                    min={today}
                    onChange={date => chooseAndAdvance({ dateFlex: 'date', movingDate: date })}
                  />
                </div>
              )}
            </>
          )}

          {/* Step: pickup */}
          {key === 'pickup' && (
            <div className="animate-in fade-in slide-in-from-bottom-2" style={fadeUp(0)}>
              <FieldIcon icon={MapPin} label="Pickup address" id="pickupAddress" valid={form.pickupAddress.trim().length > 0}>
                <StyledInput
                  id="pickupAddress"
                  placeholder="123 Main St, Vancouver"
                  autoComplete="street-address"
                  autoFocus
                  value={form.pickupAddress}
                  onChange={e => set('pickupAddress', e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && ready) goNext() }}
                />
              </FieldIcon>
            </div>
          )}

          {/* Step: drop-off */}
          {key === 'dropoff' && (
            <div className="animate-in fade-in slide-in-from-bottom-2" style={fadeUp(0)}>
              <FieldIcon icon={MapPin} label="Drop-off address, city or postal code" id="dropoffAddress" valid={form.dropoffAddress.trim().length > 0}>
                <StyledInput
                  id="dropoffAddress"
                  placeholder="Burnaby, or V5C 0N7"
                  autoFocus
                  value={form.dropoffAddress}
                  onChange={e => set('dropoffAddress', e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && ready) goNext() }}
                />
              </FieldIcon>
            </div>
          )}

          {/* Step: contact */}
          {key === 'contact' && (
            <>
              <div className="animate-in fade-in slide-in-from-bottom-2" style={fadeUp(0)}>
                <FieldIcon icon={User} label="Full name" id="customerName" valid={form.customerName.trim().length > 0}>
                  <StyledInput
                    id="customerName"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    value={form.customerName}
                    onChange={e => set('customerName', e.target.value)}
                  />
                </FieldIcon>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2" style={fadeUp(60)}>
                <FieldIcon icon={Mail} label="Email address" id="customerEmail" valid={/\S+@\S+\.\S+/.test(form.customerEmail)}>
                  <StyledInput
                    id="customerEmail"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={form.customerEmail}
                    onChange={e => set('customerEmail', e.target.value)}
                  />
                </FieldIcon>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2" style={fadeUp(120)}>
                <FieldIcon icon={Phone} label="Phone number" id="phone" valid={form.phone.replace(/\D/g, '').length >= 10}>
                  <StyledInput
                    id="phone"
                    type="tel"
                    placeholder="604 555 0123"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </FieldIcon>
              </div>

              <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2" style={fadeUp(180)}>
                <label htmlFor="specialNotes" className="text-sm font-semibold" style={{ color: '#4A3F38' }}>
                  {form.moveType === 'small' ? 'What are you moving?' : 'Anything we should know?'}{' '}
                  <span className="font-normal text-[#B0A49A]">(optional)</span>
                </label>
                <Textarea
                  id="specialNotes"
                  placeholder={form.moveType === 'small'
                    ? 'A couch, a bed and a few boxes…'
                    : 'Stairs or elevator, heavy items, a piano, parking…'}
                  rows={3}
                  value={form.specialNotes}
                  onChange={e => set('specialNotes', e.target.value)}
                  className="rounded-xl border resize-none text-base sm:text-sm placeholder:text-[#C4B8AC] focus:border-[#254220] focus:ring-2 focus:ring-[#254220]/15"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E0D8D0', color: '#1A1714' }}
                />
              </div>
            </>
          )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6">
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
            onClick={goNext}
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
            {step < steps.length - 1 ? 'Continue' : 'Review Request'}
            <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}
