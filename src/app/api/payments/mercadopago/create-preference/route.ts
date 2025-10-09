import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
// @ts-ignore
import mercadopago from 'mercadopago'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { reservationId } = await request.json()

    // Obtener reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        room: {
          include: {
            roomType: true,
          },
        },
        user: true,
      },
    })

    if (!reservation) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    // Verificar que la reserva pertenece al usuario
    if (reservation.userId !== session.user.id && session.user.role === 'USER') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Configurar Mercado Pago
    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN || '',
    })

    // Crear preferencia de pago
    const preference = {
      items: [
        {
          title: `Hotel Elefante - ${reservation.room.roomType.name} - Hab. ${reservation.room.number}`,
          description: `Check-in: ${reservation.checkIn.toLocaleDateString('es-AR')} - Check-out: ${reservation.checkOut.toLocaleDateString('es-AR')}`,
          unit_price: Number(reservation.totalAmount),
          quantity: 1,
          currency_id: 'ARS',
        },
      ],
      payer: {
        name: reservation.user.name,
        email: reservation.user.email,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/reservas/${reservationId}/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/reservas/${reservationId}/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/reservas/${reservationId}/pending`,
      },
      auto_return: 'approved' as const,
      external_reference: reservationId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/mercadopago/webhook`,
    }

    const response = await mercadopago.preferences.create(preference)

    return NextResponse.json({
      preferenceId: response.body.id,
      initPoint: response.body.init_point,
      sandboxInitPoint: response.body.sandbox_init_point,
    })
  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error)
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    )
  }
}
