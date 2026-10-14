// Customer photos of the junk, attached to a junk removal request.

export const MAX_PHOTOS = 6
// Vercel rejects request bodies over ~4.5MB, so photos are shrunk in the
// browser before upload and the server refuses more than this in total.
export const MAX_PHOTOS_TOTAL_BYTES = 4 * 1024 * 1024
const MAX_DIMENSION = 1600

export const PHOTO_BUCKET = 'service-order-photos'

// Downscale to at most MAX_DIMENSION px and re-encode as JPEG. Falls back to
// the original file if the browser can't decode it (e.g. HEIC on Chrome).
export async function shrinkPhoto(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8))
    if (!blob) return file
    return new File([blob], file.name.replace(/\.[^.]*$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
}

export function photoExtension(type: string): string | null {
  return EXTENSIONS[type] ?? null
}
