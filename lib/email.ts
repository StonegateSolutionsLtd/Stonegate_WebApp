import { Resend } from 'resend'
import { moveDateLabel, moveSizeLabel, moveTypeLabel, type OrderFormData } from './types'


const EMAIL_FOOTER = `
  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
    <p style="color: #1a1a1a; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">Stonegate Moving Solutions</p>
  </div>`
interface OrderEmailPayload {
  orderId: string
  order: OrderFormData
}

/** Customer-typed text goes into the HTML as text, never as markup */
function esc(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

const SECTION = 'background: #f9fafb; padding: 8px 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #6b7280;'

function section(title: string, first = false) {
  return `<tr><td colspan="2" style="${SECTION}${first ? '' : ' padding-top: 20px;'}">${title}</td></tr>`
}

function row(label: string, value: string, strong = false) {
  return `<tr><td style="padding: 8px 12px; color: #374151; width: 40%;">${label}</td><td style="padding: 8px 12px;${strong ? ' font-weight: 600;' : ''}">${value}</td></tr>`
}

function moveLabels(order: OrderFormData) {
  return {
    type: moveTypeLabel(order.moveType),
    size: moveSizeLabel(order.moveType, order.moveSize, order.apartmentSize),
    date: moveDateLabel(order.dateFlex, order.movingDate, order.movingTime),
  }
}

export async function sendVerificationCode(email: string, name: string, code: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
        Verify your email
      </h2>
      <p style="color: #374151; margin-top: 16px;">Hi ${esc(name)},</p>
      <p style="color: #374151;">Enter the code below to confirm your email and complete your move booking.</p>
      <div style="margin: 32px 0; text-align: center;">
        <span style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #111827;">${code}</span>
      </div>
      <p style="color: #6b7280; font-size: 13px;">This code expires in 10 minutes. If you did not request this, you can safely ignore this email.</p>
      ${EMAIL_FOOTER}
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
  const move = moveLabels(order)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
        New Free Estimate Request
      </h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        ${section('Customer', true)}
        ${row('Name', esc(order.customerName))}
        ${row('Email', esc(order.customerEmail))}
        ${row('Phone', esc(order.phone))}

        ${section('Move Details')}
        ${row('Type', move.type, true)}
        ${row('Size', move.size, true)}
        ${row('Moving Date', move.date, true)}

        ${section('Addresses')}
        ${row('Pickup', esc(order.pickupAddress))}
        ${row('Drop-off', esc(order.dropoffAddress))}

        ${order.specialNotes ? `
        ${section('Notes')}
        <tr><td colspan="2" style="padding: 8px 12px;">${esc(order.specialNotes)}</td></tr>
        ` : ''}
      </table>

      <p style="margin-top: 24px; padding: 12px 16px; background: #f3f4f6; border-radius: 6px; font-size: 13px; color: #6b7280;">
        Order ID: <strong>${orderId}</strong><br>
        Submitted: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Vancouver' })}
      </p>
      ${EMAIL_FOOTER}
    </div>
  `

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.ORDERS_EMAIL!,
    subject: `New Estimate Request. ${move.type}, ${move.date}. ${order.customerName}`,
    html,

  })
}

export async function sendCustomerOrderConfirmation({ orderId, order }: OrderEmailPayload) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const move = moveLabels(order)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
        We received your estimate request, ${esc(order.customerName)}!
      </h2>
      <p style="color: #374151; margin-top: 16px;">
        Thanks for choosing Stonegate Moving Solutions. We will contact you within 24 hours with your free estimate and to confirm your moving date.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
        ${section('Your Move Summary', true)}
        ${row('Type', move.type, true)}
        ${row('Size', move.size)}
        ${row('Moving Date', move.date, true)}
        ${row('Pickup', esc(order.pickupAddress))}
        ${row('Drop-off', esc(order.dropoffAddress))}
        ${order.specialNotes ? row('Notes', esc(order.specialNotes)) : ''}
      </table>

      <p style="margin-top: 24px; padding: 12px 16px; background: #f3f4f6; border-radius: 6px; font-size: 13px; color: #6b7280;">
        Request reference: <strong>${orderId}</strong>
      </p>

      <p style="color: #6b7280; font-size: 13px; margin-top: 16px;">
        Questions? Reach out to orders@stonegatemoving.com or call us directly.
      </p>
      ${EMAIL_FOOTER}
    </div>
  `

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: order.customerEmail,
    subject: 'Free estimate request received - Stonegate Moving Solutions',
    html,

  })
}
