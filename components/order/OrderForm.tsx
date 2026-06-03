'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EMPTY_ORDER_FORM, type ApartmentSize, type OrderFormData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DatePicker from './DatePicker'

const STEPS = ['Pickup location', 'Drop-off & move details', 'Contact information']

const TIME_SLOTS = Array.from({ length: 31 }, (_, i) => {
  const totalMinutes = 6 * 60 + i * 30
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  const label = `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
  return { value, label }
})

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
            style={i <= current
              ? { backgroundColor: '#4D6B47', color: '#FAF7F2' }
              : { backgroundColor: '#E8E0D5', color: '#9A8E83' }
            }
          >
            {i < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className="h-0.5 w-12 transition-colors"
              style={{ backgroundColor: i < current ? '#4D6B47' : '#E8E0D5' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function ElevatorToggle({
  value,
  onChange,
  id,
}: {
  value: boolean
  onChange: (v: boolean) => void
  id: string
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        id={id}
        onClick={() => onChange(!value)}
        className="relative w-11 h-6 rounded-full transition-colors focus:outline-none"
        style={{ backgroundColor: value ? '#4D6B47' : '#D9CFC4' }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
            ${value ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      <span className="text-sm" style={{ color: '#6B5E54' }}>{value ? 'Yes, there is an elevator' : 'No elevator'}</span>
    </div>
  )
}

export default function OrderForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<OrderFormData>(EMPTY_ORDER_FORM)
  const [sending, setSending] = useState(false)

  function set<K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function canAdvanceStep() {
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
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
      return
    }
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

  return (
    <div className="w-full max-w-lg">
      <StepIndicator current={step} total={STEPS.length} />

      <Card style={{ backgroundColor: '#F0EBE3', borderColor: '#E8E0D5' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1A1714' }}>{STEPS[step]}</CardTitle>
          <CardDescription style={{ color: '#9A8E83' }}>
            {step === 0 && 'Where are we picking up from?'}
            {step === 1 && 'Where are we delivering to, and when?'}
            {step === 2 && 'How can we reach you?'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 [&_label]:text-[#6B5E54] [&_input]:bg-[#FAF7F2] [&_input]:border-[#D9CFC4] [&_input]:text-[#1A1714] [&_input]:placeholder:text-[#C4B8AC] [&_textarea]:bg-[#FAF7F2] [&_textarea]:border-[#D9CFC4] [&_textarea]:text-[#1A1714] [&_textarea]:placeholder:text-[#C4B8AC]">
          {/* ── Step 1: Pickup ── */}
          {step === 0 && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pickupAddress">Pickup address</Label>
                <Input
                  id="pickupAddress"
                  placeholder="123 Main St, City"
                  value={form.pickupAddress}
                  onChange={e => set('pickupAddress', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pickupFloor">Floor number</Label>
                <Input
                  id="pickupFloor"
                  type="number"
                  min={1}
                  max={50}
                  value={form.pickupFloor}
                  onChange={e => set('pickupFloor', Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pickupElevator">Elevator available?</Label>
                <ElevatorToggle
                  id="pickupElevator"
                  value={form.pickupHasElevator}
                  onChange={v => set('pickupHasElevator', v)}
                />
              </div>
            </>
          )}

          {/* ── Step 2: Dropoff & details ── */}
          {step === 1 && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dropoffAddress">Drop-off address</Label>
                <Input
                  id="dropoffAddress"
                  placeholder="456 New St, City"
                  value={form.dropoffAddress}
                  onChange={e => set('dropoffAddress', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dropoffFloor">Floor number</Label>
                <Input
                  id="dropoffFloor"
                  type="number"
                  min={1}
                  max={50}
                  value={form.dropoffFloor}
                  onChange={e => set('dropoffFloor', Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dropoffElevator">Elevator available?</Label>
                <ElevatorToggle
                  id="dropoffElevator"
                  value={form.dropoffHasElevator}
                  onChange={v => set('dropoffHasElevator', v)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="apartmentSize">Apartment size</Label>
                <Select
                  value={form.apartmentSize}
                  onValueChange={v => set('apartmentSize', v as ApartmentSize)}
                >
                  <SelectTrigger id="apartmentSize" className="bg-[#FAF7F2] border-[#D9CFC4] text-[#1A1714]">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1br">1 Bedroom</SelectItem>
                    <SelectItem value="2br">2 Bedrooms</SelectItem>
                    <SelectItem value="3br">3 Bedrooms</SelectItem>
                    <SelectItem value="4br+">4+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="movingDate">Moving date</Label>
                <DatePicker
                  id="movingDate"
                  value={form.movingDate}
                  onChange={v => set('movingDate', v)}
                  min={today}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="movingTime">Preferred arrival time</Label>
                <Select
                  value={form.movingTime}
                  onValueChange={v => set('movingTime', v)}
                >
                  <SelectTrigger id="movingTime" className="bg-[#FAF7F2] border-[#D9CFC4] text-[#1A1714]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* ── Step 3: Contact ── */}
          {step === 2 && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customerName">Full name</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Jane Smith"
                  value={form.customerName}
                  onChange={e => set('customerName', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={form.customerEmail}
                  onChange={e => set('customerEmail', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialNotes">Special notes <span className="text-zinc-400">(optional)</span></Label>
                <Textarea
                  id="specialNotes"
                  placeholder="Heavy items, fragile furniture, access codes…"
                  rows={3}
                  value={form.specialNotes}
                  onChange={e => set('specialNotes', e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2">
            {step > 0 ? (
              <Button variant="ghost" style={{ color: '#9A8E83' }} onClick={() => setStep(s => s - 1)}>Back</Button>
            ) : (
              <div />
            )}
            <Button
              onClick={handleNext}
              disabled={!canAdvanceStep() || sending}
              className="border-0 font-bold"
              style={{ backgroundColor: '#4D6B47', color: '#FAF7F2' }}
            >
              {sending ? 'Sending code...' : step < STEPS.length - 1 ? 'Next' : 'Review Order'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
