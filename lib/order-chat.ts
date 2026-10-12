import type { OrderFormData } from '@/lib/types'

// Form fields a customer can answer with "Not sure"; the order chat resolves them.
export type UnsureField =
  | 'pickupFloor'
  | 'pickupHasElevator'
  | 'dropoffFloor'
  | 'dropoffHasElevator'
  | 'apartmentSize'

export interface OrderChatReply {
  sessionId: string
  done: boolean
  question: string | null
  variables: OrderFormData
}

export type OrderChatRequest =
  | { action: 'start'; form: OrderFormData; unsure: UnsureField[] }
  | { action: 'answer'; sessionId: string; answer: string }

export async function postOrderChat(body: OrderChatRequest): Promise<OrderChatReply> {
  const res = await fetch('/api/order-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
  return data as OrderChatReply
}
