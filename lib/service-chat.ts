import type { TruckFractionLabel } from '@/lib/quote-pricing'

// What the junk removal form (/book-service) collects.
export interface ServiceFormData {
  address: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  phone: string
  notes: string
  loadSize: TruckFractionLabel | ''
  floor: number
  hasElevator: boolean
}

export const EMPTY_SERVICE_FORM: ServiceFormData = {
  address: '',
  date: '',
  time: '',
  customerName: '',
  customerEmail: '',
  phone: '',
  notes: '',
  loadSize: '',
  floor: 1,
  hasElevator: false,
}

// Form fields a customer can answer with "Not sure"; the service chat resolves them.
export type UnsureField = 'loadSize' | 'floor' | 'hasElevator'

export interface ServiceChatReply {
  sessionId: string
  done: boolean
  question: string | null
  // The chat is asking for new or more photos of the junk.
  awaitingPhotos: boolean
  // 1-based numbers of the photos judged good enough to keep with the booking,
  // counting the form's photos first, then the chat's, in upload order.
  keptPhotos: number[]
  variables: ServiceFormData
}

// `photos` are data URLs; the chat checks they're good enough to estimate the volume.
export type ServiceChatRequest =
  | { action: 'start'; form: ServiceFormData; unsure: UnsureField[]; photos: string[] }
  | { action: 'answer'; sessionId: string; answer: string }
  | { action: 'photos'; sessionId: string; photos: string[] }

export async function postServiceChat(body: ServiceChatRequest): Promise<ServiceChatReply> {
  const res = await fetch('/api/service-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
  return data as ServiceChatReply
}
