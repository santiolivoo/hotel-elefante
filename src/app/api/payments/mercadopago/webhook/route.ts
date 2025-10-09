import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// @ts-ignore
import { MercadoPagoConfig, Payment } from 'mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verificar si MP está configurado
    if (!process.env.MP_ACCESS_TOKEN) {
      console.warn('Mercado Pago no configurado - Webhook ignorado')
      return NextResponse.json({ received: true })
    }

    // Configurar Mercado Pago con nueva API
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    })

    const payment = new Payment(client)

    // Obtener información del pago
    if (body.type === 'payment') {
      const paymentId = body.data.id

      const paymentResponse = await payment.get({ id: paymentId })
      const paymentData = paymentResponse

      const reservationId = paymentData.external_reference

      if (!reservationId) {
        return NextResponse.json({ error: 'No external_reference' }, { status: 400 })
      }

      // Buscar si ya existe el pago
      const existingPayment = await prisma.payment.findUnique({
        where: { reservationId },
      })

      if (existingPayment) {
        // Actualizar pago existente
        await prisma.payment.update({
          where: { reservationId },
          data: {
            status: paymentData.status || 'pending',
            externalId: paymentId.toString(),
          },
        })
      } else {
        // Crear nuevo pago
        await prisma.payment.create({
          data: {
            reservationId,
            provider: 'MERCADO_PAGO',
            status: paymentData.status || 'pending',
            amount: paymentData.transaction_amount || 0,
            externalId: paymentId.toString(),
          },
        })
      }

      // Si el pago fue aprobado, actualizar la reserva
      if (paymentData.status === 'approved') {
        await prisma.reservation.update({
          where: { id: reservationId },
          data: {
            status: 'CONFIRMED',
            paidAmount: paymentData.transaction_amount || 0,
          },
        })

        // Actualizar estado de la habitación
        const reservation = await prisma.reservation.findUnique({
          where: { id: reservationId },
        })

        if (reservation) {
          await prisma.room.update({
            where: { id: reservation.roomId },
            data: { status: 'OCCUPIED' },
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error en webhook de Mercado Pago:', error)
    return NextResponse.json({ error: 'Error al procesar webhook' }, { status: 500 })
  }
}
