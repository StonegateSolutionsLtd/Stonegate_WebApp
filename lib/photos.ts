// Customer photos of the junk, attached to a junk removal request.

export const MAX_PHOTOS = 6
// Vercel rejects request bodies over ~4.5MB, so photos are shrunk in the
// browser before upload and the server refuses more than this in total.
export const MAX_PHOTOS_TOTAL_BYTES = 4 * 1024 * 1024
const MAX_DIMENSION = 1600

export const PHOTO_BUCKET = 'service-order-photos'

// Downscale to at most MAX_DIMENSION px and re-encode as JPEG. Returns null if
// the browser can't decode the file (e.g. HEIC on Chrome): the chat's photo
// check can't read those either, so they are refused.
export async function shrinkPhoto(file: File): Promise<File | null> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8))
    if (!blob) return null
    return new File([blob], file.name.replace(/\.[^.]*$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return null
  }
}

// Shrink a batch; `rejected` = how many couldn't be read.
export async function shrinkPhotos(files: File[]): Promise<{ photos: File[]; rejected: number }> {
  const shrunk = await Promise.all(files.map(shrinkPhoto))
  const photos = shrunk.filter((p): p is File => p !== null)
  return { photos, rejected: shrunk.length - photos.length }
}

export const UNREADABLE_PHOTO_MESSAGE = 'Some photos couldn’t be opened. Please use JPG or PNG photos.'

// For sending photos to the service chat, which checks them with the model.
export function photoDataUrl(photo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(photo)
  })
}

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export function photoExtension(type: string): string | null {
  return EXTENSIONS[type] ?? null
}
