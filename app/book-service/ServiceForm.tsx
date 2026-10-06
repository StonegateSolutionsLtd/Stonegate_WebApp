'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import TimeSlotPicker from '@/components/order/TimeSlotPicker'
import { DEFAULT_DURATION_MIN, formatSlotRange, timeToMinutes } from '@/lib/scheduling'
import { MapPin, User, Mail, Phone, FileText, ArrowRight } from 'lucide-react'

const SERVICE_LABELS: Record<string, string> = {
  'junk-removal': 'Junk Removal',
}

export default function ServiceForm() {
  const params = useSearchParams()
  const router = useRouter()
  const serviceType = params.get('type') ?? 'junk-removal'
  const serviceLabel = SERVICE_LABELS[serviceType] ?? 'Service'

  const [scheduled, setScheduled] = useState(false)
  const [form, setForm] = useState({ address: '', date: '', time: '', customerName: '', customerEmail: '', phone: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.customerName.trim()) e.customerName = 'Name is required'
    if (!form.customerEmail.trim()) e.customerEmail = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail)) e.customerEmail = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceType, ...form }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 409) {
        setScheduled(false)
        setForm(prev => ({ ...prev, time: '' }))
        setErrors({ form: data.error ?? 'That time was just booked. Please pick another slot.' })
        setSubmitting(false)
        return
      }
      if (!res.ok) throw new Error()
      router.push(`/book-service/success?id=${data.orderId}`)
    } catch {
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
            {scheduled
              ? 'Fill in the details below and we’ll get back to you the same day with a quote.'
              : 'Start by picking an open time — we only show slots our crew can actually make.'}
          </p>

          {!scheduled ? (
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
              <div className="relative">
                <FileText size={16} className="absolute left-3.5 top-3.5 pointer-events-none" style={{ color: '#B5C9B0' }} />
                <Textarea
                  placeholder="Tell us what items and roughly how much (e.g. a couch, mattress, and a few boxes)"
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
              {submitting ? 'Sending…' : 'Submit Request'}
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



