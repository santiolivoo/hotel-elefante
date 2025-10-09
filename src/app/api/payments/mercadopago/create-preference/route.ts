import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
// @ts-ignore
import { MercadoPagoConfig, Preference } from 'mercadopago'

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

    // Verificar si MP está configurado
    if (!process.env.MP_ACCESS_TOKEN) {
      console.warn('Mercado Pago no configurado - Simulando pago')
      return NextResponse.json({
        preferenceId: 'demo-preference',
        initPoint: '/mis-reservas',
        sandboxInitPoint: '/mis-reservas',
        demo: true,
      })
    }

    // Configurar Mercado Pago con nueva API
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    })

    const preference = new Preference(client)

    // Crear preferencia de pago
    const preferenceData = {
      items: [
        {
          id: reservationId,
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
        success: `${process.env.NEXTAUTH_URL}/mis-reservas`,
        failure: `${process.env.NEXTAUTH_URL}/mis-reservas`,
        pending: `${process.env.NEXTAUTH_URL}/mis-reservas`,
      },
      auto_return: 'approved' as const,
      external_reference: reservationId,
    }

    const response = await preference.create({ body: preferenceData })

    return NextResponse.json({
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    })
  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error)
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    )
  }
}
