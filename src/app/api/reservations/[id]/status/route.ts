import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const statusSchema = z.object({
  status: z.enum(['PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT']),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['OPERATOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = statusSchema.parse(body)

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: { status },
      include: {
        room: {
          include: {
            roomType: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Si el estado cambia a CHECKED_OUT, cambiar habitación a CLEANING
    if (status === 'CHECKED_OUT') {
      await prisma.room.update({
        where: { id: reservation.roomId },
        data: { status: 'CLEANING' },
      })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error al actualizar estado de reserva:', error)
    return NextResponse.json({ error: 'Error al actualizar estado de reserva' }, { status: 500 })
  }
}
