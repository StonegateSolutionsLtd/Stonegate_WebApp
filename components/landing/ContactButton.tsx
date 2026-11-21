'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Phone, Mail } from 'lucide-react'
import { CONTACT_PHONES, CONTACT_EMAIL } from '@/lib/contact'

interface ContactButtonProps {
  label?: string
  className?: string
  style?: React.CSSProperties
}

export default function ContactButton({ label = 'Contact Us', className, style }: ContactButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className} style={style}>
        {label}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26, 23, 20, 0.55)' }} />
          <div
            className="relative rounded-2xl p-8 w-full max-w-sm shadow-xl"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6DFF0' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 cursor-pointer transition-opacity hover:opacity-60"
              style={{ background: 'none', border: 'none', padding: '4px' }}
            >
              <X size={18} style={{ color: '#5F5870' }} />
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#4B1D8F' }}>
              Get in touch
            </p>
            <h2 className="text-2xl font-extrabold mb-8" style={{ color: '#1E1530' }}>
              We&apos;re here to help
            </h2>
            <div className="flex flex-col gap-5">
              {CONTACT_PHONES.map(phone => (
                <a key={phone} href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center gap-3 group">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#EEE7FA' }}
                  >
                    <Phone size={15} style={{ color: '#4B1D8F' }} />
                  </span>
                  <span className="font-semibold transition-opacity group-hover:opacity-60" style={{ color: '#1E1530' }}>
                    {phone}
                  </span>
                </a>
              ))}
              <div style={{ borderTop: '1px solid #E6DFF0', paddingTop: '16px', marginTop: '4px' }}>
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 group">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#EEE7FA' }}
                  >
                    <Mail size={15} style={{ color: '#4B1D8F' }} />
                  </span>
                  <span className="font-semibold transition-opacity group-hover:opacity-60" style={{ color: '#1E1530' }}>
                    {CONTACT_EMAIL}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}



