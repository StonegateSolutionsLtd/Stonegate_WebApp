export type ApartmentSize = 'studio' | '1br' | '2br' | '3br' | '4br+'

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface OrderFormData {
  // Step 1 — Pickup
  pickupAddress: string
  pickupFloor: number
  pickupHasElevator: boolean
  // Step 2 — Dropoff & move details
  dropoffAddress: string
  dropoffFloor: number
  dropoffHasElevator: boolean
  apartmentSize: ApartmentSize | ''
  movingDate: string
  // Step 3 — Contact
  phone: string
  specialNotes: string
}

export const APARTMENT_SIZE_LABELS: Record<ApartmentSize, string> = {
  studio: 'Studio',
  '1br': '1 Bedroom',
  '2br': '2 Bedrooms',
  '3br': '3 Bedrooms',
  '4br+': '4+ Bedrooms',
}

export const EMPTY_ORDER_FORM: OrderFormData = {
  pickupAddress: '',
  pickupFloor: 1,
  pickupHasElevator: false,
  dropoffAddress: '',
  dropoffFloor: 1,
  dropoffHasElevator: false,
  apartmentSize: '',
  movingDate: '',
  phone: '',
  specialNotes: '',
}
