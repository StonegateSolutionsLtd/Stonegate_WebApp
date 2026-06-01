import { Resend } from 'resend'
import { APARTMENT_SIZE_LABELS, type ApartmentSize, type OrderFormData } from './types'
990495
interface OrderEmailPayload {
  orderId: string
  order: OrderFormData
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatTime(timeStr: string) {
  return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

export async function sendVerificationCode(email: string, name: string, code: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
        Verify your email
      </h2>
      <p style="color: #374151; margin-top: 16px;">Hi ${name},</p>
      <p style="color: #374151;">Enter the code below to confirm your email and complete your move booking.</p>
      <div style="margin: 32px 0; text-align: center;">
        <span style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #111827;">${code}</span>
      </div>
      <p style="color: #6b7280; font-size: 13px;">This code expires in 10 minutes. If you did not request this, you can safely ignore this email.</p>
    </div>
  `

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `${code} is your Stonegate verification code`,
    html,
  })
}

export async function sendOwnerOrderNotification({ orderId, order }: OrderEmailPayload) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const sizeLabel = APARTMENT_SIZE_LABELS[order.apartmentSize as ApartmentSize] ?? order.apartmentSize
  const movingDate = formatDate(order.movingDate)
  const movingTime = formatTime(order.movingTime)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
        New Move Order Received
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td colspan="2" style="background: #f9fafb; padding: 8px 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #6b7280;">Customer</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151; width: 40%;">Name</td><td style="padding: 8px 12px;">${order.customerName}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Email</td><td style="padding: 8px 12px;">${order.customerEmail}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Phone</td><td style="padding: 8px 12px;">${order.phone}</td></tr>

        <tr><td colspan="2" style="background: #f9fafb; padding: 8px 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #6b7280; padding-top: 20px;">Move Details</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Moving Date</td><td style="padding: 8px 12px; font-weight: 600;">${movingDate}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Arrival Time</td><td style="padding: 8px 12px; font-weight: 600;">${movingTime}</td></tr>
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
    to: process.env.ORDERS_EMAIL!,
    subject: `New Move Order. ${movingDate}. ${order.customerName}`,
    html,
  })
}

export async function sendCustomerOrderConfirmation({ orderId, order }: OrderEmailPayload) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const sizeLabel = APARTMENT_SIZE_LABELS[order.apartmentSize as ApartmentSize] ?? order.apartmentSize
  const movingDate = formatDate(order.movingDate)
  const movingTime = formatTime(order.movingTime)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
        Your Move is Booked, ${order.customerName}!
      </h2>
      <p style="color: #374151; margin-top: 16px;">
        Thanks for choosing Stonegate Moving Solutions. We've received your request and will reach out within 24 hours to confirm your time slot.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
        <tr><td colspan="2" style="background: #f9fafb; padding: 8px 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #6b7280;">Your Move Summary</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151; width: 40%;">Moving Date</td><td style="padding: 8px 12px; font-weight: 600;">${movingDate}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Arrival Time</td><td style="padding: 8px 12px; font-weight: 600;">${movingTime}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Apartment Size</td><td style="padding: 8px 12px;">${sizeLabel}</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Pickup</td><td style="padding: 8px 12px;">${order.pickupAddress} (floor ${order.pickupFloor})</td></tr>
        <tr><td style="padding: 8px 12px; color: #374151;">Drop-off</td><td style="padding: 8px 12px;">${order.dropoffAddress} (floor ${order.dropoffFloor})</td></tr>
        ${order.specialNotes ? `<tr><td style="padding: 8px 12px; color: #374151;">Notes</td><td style="padding: 8px 12px;">${order.specialNotes}</td></tr>` : ''}
      </table>

      <p style="margin-top: 24px; padding: 12px 16px; background: #f3f4f6; border-radius: 6px; font-size: 13px; color: #6b7280;">
        Order reference: <strong>${orderId}</strong>
      </p>

      <p style="color: #6b7280; font-size: 13px; margin-top: 16px;">
        Questions? Reach out to orders@stonegatemoving.com or call us directly.
      </p>
    </div>
  `

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: order.customerEmail,
    subject: `Move confirmed for ${movingDate}. Stonegate Moving Solutions`,
    html,
  })
}
