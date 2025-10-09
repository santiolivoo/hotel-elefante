import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import nodemailer from 'nodemailer'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'El asunto debe tener al menos 3 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // Guardar mensaje en la base de datos
    const contactMessage = await prisma.contactMessage.create({
      data: {
        ...data,
        status: 'RECEIVED',
      },
    })

    // Enviar email al hotel
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
        to: process.env.HOTEL_EMAIL,
        subject: `Nuevo mensaje de contacto: ${data.subject}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
          <p><strong>Asunto:</strong> ${data.subject}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${data.message}</p>
          <hr />
          <p><small>ID del mensaje: ${contactMessage.id}</small></p>
        `,
      })
    } catch (emailError) {
      console.error('Error al enviar email:', emailError)
      // No fallar si el email no se puede enviar
    }

    return NextResponse.json(
      {
        message: 'Mensaje enviado exitosamente',
        id: contactMessage.id,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error al procesar mensaje de contacto:', error)
    return NextResponse.json({ error: 'Error al procesar mensaje de contacto' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const messages = await prisma.contactMessage.findMany({
      include: {
        replies: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error al obtener mensajes:', error)
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 })
  }
}
