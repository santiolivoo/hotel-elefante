import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import nodemailer from 'nodemailer'

const replySchema = z.object({
  body: z.string().min(1, 'El mensaje no puede estar vacío'),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['OPERATOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const bodyData = await request.json()
    const { body } = replySchema.parse(bodyData)

    // Obtener mensaje original
    const originalMessage = await prisma.contactMessage.findUnique({
      where: { id: params.id },
    })

    if (!originalMessage) {
      return NextResponse.json({ error: 'Mensaje no encontrado' }, { status: 404 })
    }

    // Crear respuesta
    const reply = await prisma.reply.create({
      data: {
        contactId: params.id,
        operatorId: session.user.id,
        body,
      },
    })

    // Actualizar estado del mensaje
    await prisma.contactMessage.update({
      where: { id: params.id },
      data: { status: 'ANSWERED' },
    })

    // Enviar email al cliente
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: originalMessage.email,
        subject: `Re: ${originalMessage.subject}`,
        html: `
          <h2>Hotel Elefante - Respuesta a su consulta</h2>
          <p>Estimado/a ${originalMessage.name},</p>
          <p>Gracias por contactarnos. A continuación nuestra respuesta:</p>
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #0066cc;">
            ${body.replace(/\n/g, '<br>')}
          </div>
          <p>Si tiene alguna otra consulta, no dude en contactarnos nuevamente.</p>
          <hr />
          <p><strong>Su consulta original:</strong></p>
          <p><em>${originalMessage.message}</em></p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            Hotel Elefante<br />
            San Lorenzo, Salta - Argentina<br />
            Teléfono: +54 387 123-4567<br />
            Email: info@hotelelefante.com
          </p>
        `,
      })
    } catch (emailError) {
      console.error('Error al enviar email de respuesta:', emailError)
    }

    return NextResponse.json({
      message: 'Respuesta enviada exitosamente',
      reply,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error al enviar respuesta:', error)
    return NextResponse.json({ error: 'Error al enviar respuesta' }, { status: 500 })
  }
}
