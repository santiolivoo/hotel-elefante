import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// Configuración de Resend (más confiable)
const resend = new Resend(process.env.RESEND_API_KEY)

// Configuración de nodemailer como fallback
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Tipos
interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
}

// Función principal para enviar emails
export async function sendEmail(data: EmailData) {
  const fromAddress = data.from || process.env.SMTP_FROM || `"Hotel Elefante" <${process.env.EMAIL_USER}>`

  // Intentar primero con Resend si está configurado correctamente
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_xxxxxxxxx') {
    try {
      const result = await resend.emails.send({
        from: fromAddress,
        to: data.to,
        subject: data.subject,
        html: data.html,
      })
      console.log(`✅ Email enviado con Resend a ${data.to}`)
      return { success: true, provider: 'resend', result }
    } catch (error) {
      console.error('❌ Error con Resend, intentando con nodemailer:', error)
    }
  }

  // Fallback a nodemailer
  try {
    const result = await transporter.sendMail({
      from: fromAddress,
      to: data.to,
      subject: data.subject,
      html: data.html,
    })
    console.log(`✅ Email enviado con nodemailer a ${data.to}`)
    return { success: true, provider: 'nodemailer', result }
  } catch (error) {
    console.error('❌ Error al enviar email:', error)
    return { success: false, error }
  }
}

// Templates de email
const getEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hotel Elefante</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🐘 Hotel Elefante</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">San Lorenzo, Salta - Argentina</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
                <strong>Hotel Elefante</strong><br>
                San Lorenzo, Salta - Argentina<br>
                Teléfono: +54 387 123-4567<br>
                Email: info@hotelelefante.com
              </p>
              <p style="margin: 15px 0 0 0; color: #adb5bd; font-size: 12px;">
                © ${new Date().getFullYear()} Hotel Elefante. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

// Funciones específicas para diferentes tipos de email
export async function sendReservationConfirmationEmail(data: {
  userName: string
  userEmail: string
  reservationId: string
  roomType: string
  roomNumber: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalAmount: number
  nights: number
}) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount)
  }

  const content = `
    <h2 style="color: #212529; margin: 0 0 20px 0;">¡Reserva Confirmada! 🎉</h2>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      Estimado/a <strong>${data.userName}</strong>,
    </p>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
      ¡Gracias por elegir Hotel Elefante! Su reserva ha sido confirmada exitosamente.
    </p>
    
    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
      <h3 style="color: #212529; margin: 0 0 15px 0;">Detalles de la Reserva</h3>
      <p><strong>Código:</strong> ${data.reservationId}</p>
      <p><strong>Habitación:</strong> ${data.roomType} - ${data.roomNumber}</p>
      <p><strong>Check-in:</strong> ${formatDate(data.checkIn)}</p>
      <p><strong>Check-out:</strong> ${formatDate(data.checkOut)}</p>
      <p><strong>Noches:</strong> ${data.nights}</p>
      <p><strong>Huéspedes:</strong> ${data.guests}</p>
      <p><strong>Total:</strong> ${formatCurrency(data.totalAmount)}</p>
    </div>

    <p style="color: #495057; font-size: 16px;">
      ¡Esperamos darle la bienvenida pronto!<br>
      <strong>El equipo de Hotel Elefante</strong>
    </p>
  `

  return await sendEmail({
    to: data.userEmail,
    subject: `✅ Reserva Confirmada - Hotel Elefante (${data.reservationId})`,
    html: getEmailTemplate(content),
  })
}

export async function sendReservationStatusChangeEmail(data: {
  userName: string
  userEmail: string
  reservationId: string
  roomType: string
  roomNumber: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalAmount: number
  nights: number
  oldStatus: string
  newStatus: string
}) {
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    CONFIRMED: {
      title: '✅ Reserva Confirmada',
      message: 'Su reserva ha sido confirmada exitosamente. ¡Esperamos verle pronto!',
      color: '#28a745',
    },
    CANCELLED: {
      title: '❌ Reserva Cancelada',
      message: 'Su reserva ha sido cancelada. Si tiene alguna pregunta, no dude en contactarnos.',
      color: '#dc3545',
    },
    CHECKED_IN: {
      title: '🏨 Check-in Realizado',
      message: '¡Bienvenido a Hotel Elefante! Su check-in ha sido completado.',
      color: '#17a2b8',
    },
    CHECKED_OUT: {
      title: '👋 Check-out Completado',
      message: 'Gracias por hospedarse con nosotros. ¡Esperamos verle nuevamente!',
      color: '#6c757d',
    },
  }

  const statusInfo = statusMessages[data.newStatus] || {
    title: '📝 Estado Actualizado',
    message: 'El estado de su reserva ha sido actualizado.',
    color: '#667eea',
  }

  const content = `
    <h2 style="color: ${statusInfo.color};">${statusInfo.title}</h2>
    <p>Estimado/a <strong>${data.userName}</strong>,</p>
    <p>${statusInfo.message}</p>
    
    <div style="background-color: #f8f9fa; border-left: 4px solid ${statusInfo.color}; padding: 20px; margin: 20px 0;">
      <h3>Detalles de la Reserva</h3>
      <p><strong>Código:</strong> ${data.reservationId}</p>
      <p><strong>Habitación:</strong> ${data.roomType} - ${data.roomNumber}</p>
    </div>

    <p>Saludos cordiales,<br><strong>El equipo de Hotel Elefante</strong></p>
  `

  return await sendEmail({
    to: data.userEmail,
    subject: `${statusInfo.title} - Hotel Elefante (${data.reservationId})`,
    html: getEmailTemplate(content),
  })
}

export async function sendPromotionEmail(
  recipients: string[],
  promotionData: {
    subject: string
    content: string
    imageUrl?: string
    ctaText?: string
    ctaUrl?: string
  }
) {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as any[],
  }

  for (const email of recipients) {
    const content = `
      <h2 style="color: #667eea;">🎁 ${promotionData.subject}</h2>
      
      ${promotionData.imageUrl ? `
        <div style="text-align: center; margin: 20px 0;">
          <img src="${promotionData.imageUrl}" alt="Promoción" style="max-width: 100%; border-radius: 8px;" />
        </div>
      ` : ''}
      
      <div style="font-size: 16px; line-height: 1.8; margin: 20px 0;">
        ${promotionData.content.replace(/\n/g, '<br>')}
      </div>

      ${promotionData.ctaText && promotionData.ctaUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${promotionData.ctaUrl}" style="display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold;">
            ${promotionData.ctaText}
          </a>
        </div>
      ` : ''}
    `

    try {
      const result = await sendEmail({
        to: email,
        subject: `🎁 ${promotionData.subject} - Hotel Elefante`,
        html: getEmailTemplate(content),
      })
      
      if (result.success) {
        results.sent++
      } else {
        results.failed++
        results.errors.push({ email, error: result.error })
      }
    } catch (error) {
      results.failed++
      results.errors.push({ email, error })
    }

    // Pausa pequeña entre emails
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return results
}

// Función de prueba
export async function testEmailConfiguration() {
  const testEmail = process.env.EMAIL_USER || 'test@example.com'
  
  const content = `
    <h2>🧪 Prueba de Configuración de Email</h2>
    <p>Este es un email de prueba para verificar que la configuración funciona correctamente.</p>
    <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
    <p>Si recibes este email, ¡la configuración está funcionando! 🎉</p>
  `

  return await sendEmail({
    to: testEmail,
    subject: '🧪 Prueba de Email - Hotel Elefante',
    html: getEmailTemplate(content),
  })
}
