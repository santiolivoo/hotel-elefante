import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// @ts-ignore
import mercadopago from 'mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Configurar Mercado Pago
    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN || '',
    })

    // Obtener información del pago
    if (body.type === 'payment') {
      const paymentId = body.data.id

      const payment = await mercadopago.payment.get(paymentId)
      const paymentData = payment.body

      const reservationId = paymentData.external_reference

      // Buscar si ya existe el pago
      const existingPayment = await prisma.payment.findUnique({
        where: { reservationId },
      })

      if (existingPayment) {
        // Actualizar pago existente
        await prisma.payment.update({
          where: { reservationId },
          data: {
            status: paymentData.status,
            externalId: paymentId.toString(),
          },
        })
      } else {
        // Crear nuevo pago
        await prisma.payment.create({
          data: {
            reservationId,
            provider: 'MERCADO_PAGO',
            status: paymentData.status,
            amount: paymentData.transaction_amount,
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
            paidAmount: paymentData.transaction_amount,
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
