'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import TimeSlotPicker from '@/components/order/TimeSlotPicker'
import { DEFAULT_DURATION_MIN, formatSlotRange, timeToMinutes } from '@/lib/scheduling'
import { TRUCK_FRACTIONS } from '@/lib/quote-pricing'
import {
  EMPTY_SERVICE_FORM, PROPERTY_TYPES, postServiceChat, type PropertyType, type ServiceFormData, type UnsureField,
} from '@/lib/service-chat'
import ServiceChat from './ServiceChat'
import PhotoField from './PhotoField'
import { MAX_PHOTOS, MAX_PHOTOS_TOTAL_BYTES, photoDataUrl } from '@/lib/photos'
import { MapPin, User, Mail, Phone, FileText, ArrowRight } from 'lucide-react'

const SERVICE_LABELS: Record<string, string> = {
  'junk-removal': 'Junk Removal',
}

// Shared look for the load size / elevator / "Not sure" option buttons.
function OptionButton({ label, sub, selected, onClick }: {
  label: string; sub?: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`${sub ? 'h-14' : 'h-11'} px-3 rounded-xl border text-sm font-semibold transition-colors duration-150 hover:border-[#254220] flex flex-col items-center justify-center`}
      style={{
        backgroundColor: selected ? '#254220' : '#FFFFFF',
        borderColor:     selected ? '#254220' : '#E8E0D5',
        color:           selected ? '#FAF7F2' : '#6B5E54',
      }}
    >
      {label}
      {sub && <span className="text-xs font-normal mt-0.5" style={{ opacity: 0.75 }}>{sub}</span>}
    </button>
  )
}

// The truck in /truck-load-guide.png: 16 × 7.5 × 6.5 ft ≈ 780 ft³.
const TRUCK_CUBIC_FEET = 16 * 7.5 * 6.5

export default function ServiceForm() {
  const params = useSearchParams()
  const router = useRouter()
  const serviceType = params.get('type') ?? 'junk-removal'
  const serviceLabel = SERVICE_LABELS[serviceType] ?? 'Service'

  const [scheduled, setScheduled] = useState(false)
  const [form, setForm] = useState<ServiceFormData>(EMPTY_SERVICE_FORM)
  // Fields answered "Not sure" — resolved by the service chat before submitting.
  const [unsure, setUnsure] = useState<Set<UnsureField>>(new Set())
  const [photos, setPhotos] = useState<File[]>([])
  const [chat, setChat] = useState<{ sessionId: string; question: string; options: string[]; awaitingPhotos: boolean } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  function set<K extends keyof ServiceFormData>(field: K, value: ServiceFormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    if (unsure.has(field as UnsureField)) markUnsure(field as UnsureField, false)
  }

  // The elevator question only applies to apartments.
  function setPropertyType(value: PropertyType) {
    set('propertyType', value)
    if (value !== 'apartment') {
      set('hasElevator', false)
      markUnsure('hasElevator', false)
    }
  }

  function markUnsure(field: UnsureField, on: boolean) {
    setUnsure(prev => {
      const next = new Set(prev)
      if (on) next.add(field)
      else next.delete(field)
      return next
    })
    if (on && errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.loadSize && !unsure.has('loadSize')) e.loadSize = 'Pick a load size, or "Not sure"'
    if (!form.propertyType) e.propertyType = 'Pick a property type'
    if (!form.customerName.trim()) e.customerName = 'Name is required'
    if (!form.customerEmail.trim()) e.customerEmail = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail)) e.customerEmail = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (photos.length === 0) e.photos = 'Add at least one photo of the junk'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const unsureFields = [...unsure]
    setSubmitting(true)
    setErrors({})
    try {
      // The chat also checks the photos are good enough to estimate the volume.
      const reply = await postServiceChat({
        action: 'start', form, unsure: unsureFields, photos: await Promise.all(photos.map(photoDataUrl)),
      })
      if (reply.done) await finish(reply.variables, [], reply.keptPhotos, reply.quoteSummary)
      else {
        setChat({ sessionId: reply.sessionId, question: reply.question ?? '', options: reply.options, awaitingPhotos: reply.awaitingPhotos })
        setSubmitting(false)
      }
    } catch (err) {
      // The assistant opens for every booking, but is only essential when something
      // was marked "Not sure"; if it's down, the booking still goes through, with
      // the photos (at least one is required) unchecked and no quote details.
      if (unsureFields.length === 0) await finish(form, [], null, null)
      else {
        setErrors({ form: err instanceof Error ? err.message : 'Something went wrong' })
        setSubmitting(false)
      }
    }
  }

  // Take the chat's answers for the "Not sure" fields; everything else stays as typed.
  // `chatPhotos` = photos added in the chat, on top of the ones from the form.
  // `keptPhotos` = which of all those the photo check judged good (null = unchecked, keep all).
  // `quoteSummary` = the chat's quote details for staff: sent with the notes but not put
  // back into the form, so after a 409 the customer doesn't see it in their notes.
  async function finish(variables: ServiceFormData, chatPhotos: File[], keptPhotos: number[] | null, quoteSummary: string | null) {
    // loadSize is always re-checked against the photos, even when the customer
    // picked it themselves, so it's taken from the chat regardless of `unsure`.
    const resolved = { ...form, loadSize: variables.loadSize }
    for (const field of unsure) Object.assign(resolved, { [field]: variables[field] })
    const uploaded = [...photos, ...chatPhotos]
    const good = keptPhotos ? uploaded.filter((_, i) => keptPhotos.includes(i + 1)) : uploaded
    const allPhotos = (good.length ? good : uploaded).slice(0, MAX_PHOTOS)
    if (allPhotos.reduce((sum, p) => sum + p.size, 0) > MAX_PHOTOS_TOTAL_BYTES) {
      setForm(resolved)
      setUnsure(new Set())
      setPhotos(allPhotos)
      setChat(null)
      setErrors({ form: 'Your photos are too large to upload together. Please remove one or two and try again.' })
      setSubmitting(false)
      return
    }
    setSubmitting(true)
    try {
      const body = new FormData()
      const notes = quoteSummary
        ? [resolved.notes.trim(), `Quote details from chat:\n${quoteSummary}`].filter(Boolean).join('\n\n')
        : resolved.notes
      body.append('data', JSON.stringify({ serviceType, ...resolved, notes }))
      for (const photo of allPhotos) body.append('photos', photo)
      const res = await fetch('/api/service-requests', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      if (res.status === 409) {
        // The chat's answers and photos are kept so the customer isn't asked again.
        setForm({ ...resolved, time: '' })
        setPhotos(allPhotos)
        setUnsure(new Set())
        setChat(null)
        setScheduled(false)
        setErrors({ form: data.error ?? 'That time was just booked. Please pick another slot.' })
        setSubmitting(false)
        return
      }
      if (!res.ok) throw new Error()
      router.push(`/book-service/success?id=${data.orderId}`)
    } catch {
      setChat(null)
      setErrors({ form: 'Something went wrong. Please try again.' })
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-xl mx-auto px-6 py-16">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-semibold mb-10 transition-opacity hover:opacity-60"
            style={{ color: '#6B5E54' }}
          >
            ← Back
          </Link>

          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-5 border rounded-full px-4 py-1.5"
            style={{ color: '#254220', borderColor: '#B5C9B0' }}
          >
            {serviceLabel}
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: '#1A1714' }}>
            Book {serviceLabel}
          </h1>
          <p className="text-base mb-12" style={{ color: '#6B5E54' }}>
            {chat
              ? 'A few quick questions before we send your request.'
              : scheduled
              ? 'Fill in the details below and we’ll get back to you the same day with a quote.'
              : 'Start by picking an open time — we only show slots our crew can actually make.'}
          </p>

          {chat ? (
            <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
              <ServiceChat
                sessionId={chat.sessionId}
                firstQuestion={chat.question}
                firstOptions={chat.options}
                firstAwaitingPhotos={chat.awaitingPhotos}
                photoSlots={MAX_PHOTOS - photos.length}
                onComplete={finish}
                onBack={() => setChat(null)}
              />
            </div>
          ) : !scheduled ? (
            <div>
              {errors.form && (
                <p className="text-sm mb-4 rounded-xl px-4 py-3" style={{ color: '#9A4B12', backgroundColor: '#FDE4C8' }}>
                  {errors.form}
                </p>
              )}
              <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                <TimeSlotPicker
                  jobType="junk_removal"
                  date={form.date}
                  time={form.time}
                  onChange={(date, time) => setForm(prev => ({ ...prev, date, time }))}
                />
              </div>
              <Button
                type="button"
                onClick={() => setScheduled(true)}
                disabled={!form.date || !form.time}
                className="rounded-full text-sm font-bold py-6 border-0 w-full mt-6 disabled:opacity-40"
                style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
              >
                Continue <ArrowRight size={14} strokeWidth={2.5} className="ml-1.5" />
              </Button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-9">

            {/* Chosen slot */}
            <div
              className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#254220' }}>
                  Your Slot
                </p>
                <p className="text-sm font-semibold" style={{ color: '#1A1714' }}>
                  {new Date(form.date + 'T12:00:00').toLocaleDateString('en-CA', {
                    weekday: 'short', month: 'short', day: 'numeric',
                  })} · {formatSlotRange(timeToMinutes(form.time), DEFAULT_DURATION_MIN.junk_removal)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setScheduled(false)}
                className="text-sm font-semibold underline shrink-0"
                style={{ color: '#254220' }}
              >
                Change
              </button>
            </div>


            {/* Address */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#254220' }}>
                Service Address
              </p>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1714' }}>
                Address <span style={{ color: '#254220' }}>*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B5C9B0' }} />
                <Input
                  placeholder="Street address, city"
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  className="pl-10"
                  style={{ borderColor: errors.address ? '#ef4444' : '#E8E0D5', backgroundColor: '#FFFFFF' }}
                />
              </div>
              {errors.address && <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.address}</p>}
            </div>

            {/* Junk details — "Not sure" answers are worked out by the service chat */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#254220' }}>
                Junk Details
              </p>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1714' }}>
                    Load Size <span style={{ color: '#254220' }}>*</span>
                  </label>
                  <p className="text-xs mb-2.5" style={{ color: '#9A8E83' }}>
                    Roughly how much of our truck will your junk fill?
                  </p>
                  <div className="rounded-xl overflow-hidden mb-2.5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                    <Image
                      src="/truck-load-guide.png"
                      alt="Our truck: 16 ft long, 7.5 ft wide and 6.5 ft high. A couch, mattress, dresser and about a dozen boxes fill half of it."
                      width={1536}
                      height={1024}
                      sizes="(min-width: 640px) 528px, 100vw"
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-xs mb-3" style={{ color: '#9A8E83' }}>
                    Our truck is 16 × 7.5 × 6.5 ft. A half load is about a couch, a mattress,
                    a dresser and a dozen boxes. Your estimate only needs to be approximate;
                    pick the closest size and our team will confirm it before the job.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TRUCK_FRACTIONS.map(f => (
                      <OptionButton
                        key={f.label}
                        label={f.label}
                        sub={`≈ ${Math.round(f.fraction * TRUCK_CUBIC_FEET)} ft³`}
                        selected={!unsure.has('loadSize') && form.loadSize === f.label}
                        onClick={() => set('loadSize', f.label)}
                      />
                    ))}
                    <OptionButton
                      label="Not sure"
                      sub="We'll help you"
                      selected={unsure.has('loadSize')}
                      onClick={() => markUnsure('loadSize', true)}
                    />
                  </div>
                  {errors.loadSize && <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.loadSize}</p>}
                </div>

                <div>
                  <span className="block text-sm font-semibold mb-2.5" style={{ color: '#1A1714' }}>
                    Property Type <span style={{ color: '#254220' }}>*</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PROPERTY_TYPES.map(p => (
                      <OptionButton
                        key={p.value}
                        label={p.label}
                        selected={form.propertyType === p.value}
                        onClick={() => setPropertyType(p.value)}
                      />
                    ))}
                  </div>
                  {errors.propertyType && <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.propertyType}</p>}
                </div>

                {form.propertyType === 'apartment' && (
                  <div>
                    <span className="block text-sm font-semibold mb-2.5" style={{ color: '#1A1714' }}>
                      Elevator Available?
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <OptionButton
                        label="No elevator"
                        selected={!unsure.has('hasElevator') && !form.hasElevator}
                        onClick={() => set('hasElevator', false)}
                      />
                      <OptionButton
                        label="Has elevator"
                        selected={!unsure.has('hasElevator') && form.hasElevator}
                        onClick={() => set('hasElevator', true)}
                      />
                      <OptionButton
                        label="Not sure"
                        selected={unsure.has('hasElevator')}
                        onClick={() => markUnsure('hasElevator', true)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <span className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1714' }}>
                    Photos of the Junk <span style={{ color: '#254220' }}>*</span>
                  </span>
                  <p className="text-xs mb-2.5" style={{ color: '#9A8E83' }}>
                    Add at least one photo showing all of the junk. A few shots from different
                    angles help us estimate the volume and give you an accurate quote.
                  </p>
                  <PhotoField
                    photos={photos}
                    onChange={p => {
                      setPhotos(p)
                      if (errors.photos) setErrors(prev => ({ ...prev, photos: '' }))
                    }}
                  />
                  {errors.photos && <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.photos}</p>}
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#254220' }}>
                Your Information
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1714' }}>
                    Full Name <span style={{ color: '#254220' }}>*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B5C9B0' }} />
                    <Input
                      placeholder="Your full name"
                      value={form.customerName}
                      onChange={e => set('customerName', e.target.value)}
                      className="pl-10"
                      style={{ borderColor: errors.customerName ? '#ef4444' : '#E8E0D5', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  {errors.customerName && <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1714' }}>
                    Email <span style={{ color: '#254220' }}>*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B5C9B0' }} />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.customerEmail}
                      onChange={e => set('customerEmail', e.target.value)}
                      className="pl-10"
                      style={{ borderColor: errors.customerEmail ? '#ef4444' : '#E8E0D5', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  {errors.customerEmail && <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.customerEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1714' }}>
                    Phone <span style={{ color: '#254220' }}>*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#B5C9B0' }} />
                    <Input
                      type="tel"
                      placeholder="+1 (604) 000-0000"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      className="pl-10"
                      style={{ borderColor: errors.phone ? '#ef4444' : '#E8E0D5', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                  {errors.phone && <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1714' }}>
                What Junk Do You Need Removed?{' '}
                <span className="font-normal" style={{ color: '#B5A99E' }}>(optional)</span>
              </label>
              <p className="text-xs mb-2.5" style={{ color: '#9A8E83' }}>
                If a photo shows something you want to keep — a shelf, a fridge, anything
                the junk is on or mixed in with — tell us here so we know not to take it.
              </p>
              <div className="relative">
                <FileText size={16} className="absolute left-3.5 top-3.5 pointer-events-none" style={{ color: '#B5C9B0' }} />
                <Textarea
                  placeholder="Tell us what items and roughly how much, and anything to leave behind (e.g. a couch, mattress, and a few boxes — but not the shelf they're on)"
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  className="pl-10 resize-none"
                  rows={3}
                  style={{ borderColor: '#E8E0D5', backgroundColor: '#FFFFFF' }}
                />
              </div>
            </div>

            {errors.form && <p className="text-sm" style={{ color: '#ef4444' }}>{errors.form}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full text-sm font-bold py-6 border-0"
              style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
            >
              {submitting ? 'Checking…' : 'Submit Request'}
            </Button>
          </form>
          )}
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <span className="text-sm font-medium" style={{ color: '#B5A99E' }}>
            © {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}



