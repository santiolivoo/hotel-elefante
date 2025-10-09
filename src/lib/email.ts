import nodemailer from 'nodemailer'

// Configuración del transporter
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
interface ReservationEmailData {
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
}

interface StatusChangeEmailData extends ReservationEmailData {
  oldStatus: string
  newStatus: string
}

interface PromotionEmailData {
  subject: string
  content: string
  imageUrl?: string
  ctaText?: string
  ctaUrl?: string
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

// Email de confirmación de reserva
export async function sendReservationConfirmationEmail(data: ReservationEmailData) {
  const content = `
    <h2 style="color: #212529; margin: 0 0 20px 0;">¡Reserva Confirmada! 🎉</h2>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      Estimado/a <strong>${data.userName}</strong>,
    </p>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
      ¡Gracias por elegir Hotel Elefante! Su reserva ha sido confirmada exitosamente. A continuación encontrará los detalles:
    </p>
    
    <!-- Detalles de la reserva -->
    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
      <h3 style="color: #212529; margin: 0 0 15px 0; font-size: 18px;">Detalles de la Reserva</h3>
      <table width="100%" cellpadding="8" cellspacing="0">
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Código de Reserva:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${data.reservationId}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Tipo de Habitación:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${data.roomType}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Número de Habitación:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${data.roomNumber}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Check-in:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${formatDate(data.checkIn)}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Check-out:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${formatDate(data.checkOut)}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Noches:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${data.nights}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Huéspedes:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${data.guests}</td>
        </tr>
        <tr style="border-top: 2px solid #dee2e6;">
          <td style="color: #212529; font-size: 16px; padding: 12px 0;"><strong>Total:</strong></td>
          <td style="color: #667eea; font-size: 18px; font-weight: bold; padding: 12px 0; text-align: right;">${formatCurrency(data.totalAmount)}</td>
        </tr>
      </table>
    </div>

    <!-- Información importante -->
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
      <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">ℹ️ Información Importante</h3>
      <ul style="color: #856404; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>El check-in es a partir de las 14:00 hs</li>
        <li>El check-out es hasta las 10:00 hs</li>
        <li>Por favor, presente este email o su código de reserva al momento del check-in</li>
        <li>Para cualquier modificación, contáctenos con anticipación</li>
      </ul>
    </div>

    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      ¡Esperamos darle la bienvenida pronto!
    </p>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0;">
      Saludos cordiales,<br>
      <strong>El equipo de Hotel Elefante</strong>
    </p>
  `

  try {
    await transporter.sendMail({
      from: `"Hotel Elefante" <${process.env.EMAIL_USER}>`,
      to: data.userEmail,
      subject: `✅ Reserva Confirmada - Hotel Elefante (${data.reservationId})`,
      html: getEmailTemplate(content),
    })
    console.log(`Email de confirmación enviado a ${data.userEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Error al enviar email de confirmación:', error)
    return { success: false, error }
  }
}

// Email de cambio de estado de reserva
export async function sendReservationStatusChangeEmail(data: StatusChangeEmailData) {
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
      message: '¡Bienvenido a Hotel Elefante! Su check-in ha sido completado. Disfrute su estadía.',
      color: '#17a2b8',
    },
    CHECKED_OUT: {
      title: '👋 Check-out Completado',
      message: 'Gracias por hospedarse con nosotros. ¡Esperamos verle nuevamente pronto!',
      color: '#6c757d',
    },
  }

  const statusInfo = statusMessages[data.newStatus] || {
    title: '📝 Estado de Reserva Actualizado',
    message: 'El estado de su reserva ha sido actualizado.',
    color: '#667eea',
  }

  const content = `
    <h2 style="color: ${statusInfo.color}; margin: 0 0 20px 0;">${statusInfo.title}</h2>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      Estimado/a <strong>${data.userName}</strong>,
    </p>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
      ${statusInfo.message}
    </p>
    
    <!-- Detalles de la reserva -->
    <div style="background-color: #f8f9fa; border-left: 4px solid ${statusInfo.color}; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
      <h3 style="color: #212529; margin: 0 0 15px 0; font-size: 18px;">Detalles de la Reserva</h3>
      <table width="100%" cellpadding="8" cellspacing="0">
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Código de Reserva:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${data.reservationId}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Habitación:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${data.roomType} - ${data.roomNumber}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Check-in:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${formatDate(data.checkIn)}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Check-out:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${formatDate(data.checkOut)}</td>
        </tr>
      </table>
    </div>

    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.
    </p>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0;">
      Saludos cordiales,<br>
      <strong>El equipo de Hotel Elefante</strong>
    </p>
  `

  try {
    await transporter.sendMail({
      from: `"Hotel Elefante" <${process.env.EMAIL_USER}>`,
      to: data.userEmail,
      subject: `${statusInfo.title} - Hotel Elefante (${data.reservationId})`,
      html: getEmailTemplate(content),
    })
    console.log(`Email de cambio de estado enviado a ${data.userEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Error al enviar email de cambio de estado:', error)
    return { success: false, error }
  }
}

// Email de promoción
export async function sendPromotionEmail(
  recipients: string[],
  promotionData: PromotionEmailData
) {
  const content = `
    <h2 style="color: #667eea; margin: 0 0 20px 0;">🎁 ${promotionData.subject}</h2>
    
    ${
      promotionData.imageUrl
        ? `
    <div style="margin: 0 0 30px 0; text-align: center;">
      <img src="${promotionData.imageUrl}" alt="Promoción" style="max-width: 100%; height: auto; border-radius: 8px;" />
    </div>
    `
        : ''
    }
    
    <div style="color: #495057; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
      ${promotionData.content.replace(/\n/g, '<br>')}
    </div>

    ${
      promotionData.ctaText && promotionData.ctaUrl
        ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${promotionData.ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
        ${promotionData.ctaText}
      </a>
    </div>
    `
        : ''
    }

    <p style="color: #6c757d; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e9ecef;">
      <em>Este email fue enviado porque usted es cliente de Hotel Elefante. Si no desea recibir más promociones, puede darse de baja respondiendo a este email.</em>
    </p>
  `

  const results = {
    sent: 0,
    failed: 0,
    errors: [] as any[],
  }

  for (const email of recipients) {
    try {
      await transporter.sendMail({
        from: `"Hotel Elefante - Promociones" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `🎁 ${promotionData.subject} - Hotel Elefante`,
        html: getEmailTemplate(content),
      })
      results.sent++
      console.log(`Email promocional enviado a ${email}`)
    } catch (error) {
      results.failed++
      results.errors.push({ email, error })
      console.error(`Error al enviar email promocional a ${email}:`, error)
    }
  }

  return results
}

// Email de recordatorio de check-in (próximamente)
export async function sendCheckInReminderEmail(data: ReservationEmailData) {
  const content = `
    <h2 style="color: #667eea; margin: 0 0 20px 0;">🔔 Recordatorio de Check-in</h2>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      Estimado/a <strong>${data.userName}</strong>,
    </p>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
      Le recordamos que su check-in en Hotel Elefante está programado para mañana. ¡Estamos ansiosos por recibirle!
    </p>
    
    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
      <h3 style="color: #212529; margin: 0 0 15px 0; font-size: 18px;">Detalles de su Reserva</h3>
      <table width="100%" cellpadding="8" cellspacing="0">
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Código de Reserva:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${data.reservationId}</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Check-in:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${formatDate(data.checkIn)} - 14:00 hs</td>
        </tr>
        <tr>
          <td style="color: #6c757d; font-size: 14px; padding: 8px 0;"><strong>Habitación:</strong></td>
          <td style="color: #212529; font-size: 14px; padding: 8px 0; text-align: right;">${data.roomType} - ${data.roomNumber}</td>
        </tr>
      </table>
    </div>

    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      ¡Nos vemos pronto!
    </p>
    <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0;">
      Saludos cordiales,<br>
      <strong>El equipo de Hotel Elefante</strong>
    </p>
  `

  try {
    await transporter.sendMail({
      from: `"Hotel Elefante" <${process.env.EMAIL_USER}>`,
      to: data.userEmail,
      subject: `🔔 Recordatorio: Check-in mañana - Hotel Elefante`,
      html: getEmailTemplate(content),
    })
    console.log(`Email de recordatorio enviado a ${data.userEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Error al enviar email de recordatorio:', error)
    return { success: false, error }
  }
}
