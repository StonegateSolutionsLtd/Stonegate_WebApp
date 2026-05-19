import { Resend } from 'resend'
import { APARTMENT_SIZE_LABELS, type ApartmentSize, type OrderFormData } from './types'

interface OrderEmailPayload {
  orderId: string
  customer: { name: string; email: string }
  order: OrderFormData
}

export async function 

sendOwnerOrderNotification({ orderId, customer, order }: OrderEmailPayload) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const sizeLabel = APARTMENT_SIZE_LABELS[order.apartmentSize as ApartmentSize] ?? order.apartmentSize
  const movingDate = new Date(order.movingDate).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
        New Move Order Confirmed
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td colspan="2" style="background: #f9fafb; padding: 8px 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #6b7280;">Customer</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151; width: 40%;">Name</td><td style="padding: 8px 12px;">${customer.name}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Email</td><td style="padding: 8px 12px;">${customer.email}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Phone</td><td style="padding: 8px 12px;">${order.phone}</td></tr>

        <tr><td colspan="2" style="background: #f9fafb; padding: 8px 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #6b7280; padding-top: 20px;">Move Details</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Moving Date</td><td style="padding: 8px 12px; font-weight: 600;">${movingDate}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Apartment Size</td><td style="padding: 8px 12px;">${sizeLabel}</td></tr>

        <tr><td colspan="2" style="background: #f9fafb; padding: 8px 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #6b7280; padding-top: 20px;">Pickup</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Address</td><td style="padding: 8px 12px;">${order.pickupAddress}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Floor</td><td style="padding: 8px 12px;">${order.pickupFloor}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Elevator</td><td style="padding: 8px 12px;">${order.pickupHasElevator ? 'Yes' : 'No'}</td></tr>

        <tr><td colspan="2" style="background: #f9fafb; padding: 8px 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #6b7280; padding-top: 20px;">Drop-off</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Address</td><td style="padding: 8px 12px;">${order.dropoffAddress}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Floor</td><td style="padding: 8px 12px;">${order.dropoffFloor}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Elevator</td><td style="padding: 8px 12px;">${order.dropoffHasElevator ? 'Yes' : 'No'}</td></tr>

        ${order.specialNotes ? `
        <tr><td colspan="2" style="background: #f9fafb; padding: 8px 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #6b7280; padding-top: 20px;">Notes</td></tr>
        <tr><td colspan="2" style="padding: 8px 12px;">${order.specialNotes}</td></tr>
        ` : ''}
      </table>

      <p style="margin-top: 24px; padding: 12px 16px; background: #f3f4f6; border-radius: 6px; font-size: 13px; color: #6b7280;">
        Order ID: <strong>${orderId}</strong><br>
        Submitted: ${new Date().toLocaleString('en-GB')}
      </p>
    </div>
  `

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.OWNER_EMAIL!,
    subject: `New Move Order — ${movingDate} — ${sizeLabel}`,
    html,
  })
}
