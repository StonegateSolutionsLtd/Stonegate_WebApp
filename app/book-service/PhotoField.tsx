'use client'

import { useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
import { MAX_PHOTOS, shrinkPhoto } from '@/lib/photos'

// One preview URL per photo, freed when the photo is removed (the browser
// frees the rest when the page is left).
const previewUrls = new WeakMap<File, string>()

function previewUrl(photo: File): string {
  let url = previewUrls.get(photo)
  if (!url) {
    url = URL.createObjectURL(photo)
    previewUrls.set(photo, url)
  }
  return url
}

export default function PhotoField({ photos, onChange }: {
  photos: File[]
  onChange: (photos: File[]) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [adding, setAdding] = useState(false)

  function remove(photo: File) {
    const url = previewUrls.get(photo)
    if (url) URL.revokeObjectURL(url)
    previewUrls.delete(photo)
    onChange(photos.filter(p => p !== photo))
  }

  async function add(files: File[]) {
    setAdding(true)
    const shrunk = await Promise.all(files.slice(0, MAX_PHOTOS - photos.length).map(shrinkPhoto))
    onChange([...photos, ...shrunk])
    setAdding(false)
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={e => {
          const files = [...(e.target.files ?? [])]
          e.target.value = ''
          if (files.length) add(files)
        }}
      />
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, i) => (
          <div key={previewUrl(photo)} className="relative aspect-square rounded-xl overflow-hidden" style={{ border: '1px solid #E8E0D5' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
            <img src={previewUrl(photo)} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(photo)}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(26,23,20,0.7)', color: '#FFFFFF' }}
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={adding}
            className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-colors hover:border-[#254220] disabled:opacity-50"
            style={{ borderColor: '#E8E0D5', color: '#6B5E54', backgroundColor: '#FFFFFF' }}
          >
            <Camera size={20} style={{ color: '#B5C9B0' }} />
            {adding ? 'Adding…' : 'Add photos'}
          </button>
        )}
      </div>
    </div>
  )
}
