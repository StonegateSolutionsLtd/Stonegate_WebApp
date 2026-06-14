'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DatePicker from '@/components/order/DatePicker'
import { MapPin, User, Mail, Phone, FileText } from 'lucide-react'

const today = new Date().toISOString().split('T')[0]

const TIME_SLOTS = Array.from({ length: 31 }, (_, i) => {
  const total = 6 * 60 + i * 30
  const h = Math.floor(total / 60)
  const m = total % 60
  const label = `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
  const value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  return { value, label }
})

const SERVICE_LABELS: Record<string, string> = {
  'bin-cleaning': 'Bin Cleaning',
  'junk-removal': 'Junk Removal',
}

export default function ServiceForm() {
  const params = useSearchParams()
  const router = useRouter()
  const serviceType = params.get('type') ?? 'bin-cleaning'
  const serviceLabel = SERVICE_LABELS[serviceType] ?? 'Service'

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
    if (!form.date) e.date = 'Date is required'
    if (!form.time) e.time = 'Time is required'
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
      if (!res.ok) throw new Error()
      router.push('/book-service/success')
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
            â† Back
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
            Fill in the details below and we&apos;ll get back to you the same day with a quote.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-9">

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

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1714' }}>
                  Date <span style={{ color: '#254220' }}>*</span>
                </label>
                <DatePicker
                  value={form.date}
                  onChange={v => set('date', v)}
                  min={today}
                />
                {errors.date && <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1714' }}>
                  Time <span style={{ color: '#254220' }}>*</span>
                </label>
                <Select value={form.time} onValueChange={v => set('time', v ?? '')}>
                  <SelectTrigger className="h-9 bg-white border-[#E0D8D0] text-[#1A1714] rounded-xl" style={{ borderColor: errors.time ? '#ef4444' : '#E0D8D0' }}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.time}</p>}
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
                Additional Notes{' '}
                <span className="font-normal" style={{ color: '#B5A99E' }}>(optional)</span>
              </label>
              <div className="relative">
                <FileText size={16} className="absolute left-3.5 top-3.5 pointer-events-none" style={{ color: '#B5C9B0' }} />
                <Textarea
                  placeholder="Anything else we should know"¦"
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
              {submitting ? 'Sending"¦' : 'Submit Request'}
            </Button>
          </form>
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



