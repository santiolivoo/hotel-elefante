import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { sendPromotionEmail } from '@/lib/email-service'

const promotionSchema = z.object({
  subject: z.string().min(3, 'El asunto debe tener al menos 3 caracteres'),
  content: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
  imageUrl: z.string().url().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().url().optional(),
  targetAudience: z.enum(['ALL', 'ACTIVE_CUSTOMERS', 'VIP_CUSTOMERS']).default('ALL'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['OPERATOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const promotionData = promotionSchema.parse(body)

    // Obtener emails según la audiencia objetivo
    let recipients: string[] = []

    switch (promotionData.targetAudience) {
      case 'ALL':
        // Todos los usuarios registrados
        const allUsers = await prisma.user.findMany({
          where: {
            role: 'USER',
            email: {
              not: '',
            },
          },
          select: {
            email: true,
          },
        })
        recipients = allUsers.map((user) => user.email).filter(Boolean)
        break

      case 'ACTIVE_CUSTOMERS':
        // Usuarios que han hecho al menos una reserva
        const activeUsers = await prisma.user.findMany({
          where: {
            role: 'USER',
            email: {
              not: '',
            },
            reservations: {
              some: {},
            },
          },
          select: {
            email: true,
          },
        })
        recipients = activeUsers.map((user) => user.email).filter(Boolean)
        break

      case 'VIP_CUSTOMERS':
        // Usuarios con más de 3 reservas o que han gastado más de $50,000
        const vipUsers = await prisma.user.findMany({
          where: {
            role: 'USER',
            email: {
              not: '',
            },
          },
          select: {
            email: true,
            _count: {
              select: {
                reservations: true,
              },
            },
            reservations: {
              select: {
                totalAmount: true,
              },
            },
          },
        })
        
        // Filtrar usuarios VIP en JavaScript
        const filteredVipUsers = vipUsers.filter(
          (user) =>
            user._count.reservations >= 3 ||
            user.reservations.some((reservation) => Number(reservation.totalAmount) >= 50000)
        )
        recipients = filteredVipUsers.map((user) => user.email).filter(Boolean)
        break
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron destinatarios para esta promoción' },
        { status: 400 }
      )
    }

    // Guardar la promoción en la base de datos
    const promotion = await prisma.promotion.create({
      data: {
        subject: promotionData.subject,
        content: promotionData.content,
        imageUrl: promotionData.imageUrl,
        ctaText: promotionData.ctaText,
        ctaUrl: promotionData.ctaUrl,
        targetAudience: promotionData.targetAudience,
        sentBy: session.user.id,
        recipientCount: recipients.length,
        status: 'SENDING',
      },
    })

    // Enviar emails en lotes para no sobrecargar el servidor
    const batchSize = 10
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as any[],
    }

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      
      try {
        const batchResults = await sendPromotionEmail(batch, {
          subject: promotionData.subject,
          content: promotionData.content,
          imageUrl: promotionData.imageUrl,
          ctaText: promotionData.ctaText,
          ctaUrl: promotionData.ctaUrl,
        })
        
        results.sent += batchResults.sent
        results.failed += batchResults.failed
        results.errors.push(...batchResults.errors)
      } catch (error) {
        console.error(`Error en lote ${i / batchSize + 1}:`, error)
        results.failed += batch.length
        results.errors.push({ batch: i / batchSize + 1, error })
      }

      // Pausa pequeña entre lotes para no sobrecargar el servidor SMTP
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Actualizar el estado de la promoción
    await prisma.promotion.update({
      where: { id: promotion.id },
      data: {
        status: results.failed === 0 ? 'SENT' : 'PARTIALLY_SENT',
        sentCount: results.sent,
        failedCount: results.failed,
        sentAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Promoción enviada',
      promotionId: promotion.id,
      results: {
        totalRecipients: recipients.length,
        sent: results.sent,
        failed: results.failed,
        successRate: Math.round((results.sent / recipients.length) * 100),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error al enviar promoción:', error)
    return NextResponse.json({ error: 'Error al enviar promoción' }, { status: 500 })
  }
}

// Obtener historial de promociones
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['OPERATOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const promotions = await prisma.promotion.findMany({
      include: {
        sentByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Error al obtener promociones:', error)
    return NextResponse.json({ error: 'Error al obtener promociones' }, { status: 500 })
  }
}
