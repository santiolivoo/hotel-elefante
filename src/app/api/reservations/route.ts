import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const reservationSchema = z.object({
  roomId: z.number(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().min(1),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = {}

    // Si es un usuario normal, solo ver sus propias reservas
    if (session.user.role === 'USER') {
      where.userId = session.user.id
    }

    if (status) {
      where.status = status
    }

    const reservations = await prisma.reservation.findMany({
      where,
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
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Error al obtener reservas:', error)
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { roomId, checkIn, checkOut, guests } = reservationSchema.parse(body)

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    // Validar fechas
    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: 'La fecha de salida debe ser posterior a la fecha de entrada' },
        { status: 400 }
      )
    }

    // Verificar disponibilidad
    const conflicts = await prisma.reservation.findMany({
      where: {
        roomId,
        status: {
          in: ['CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          {
            AND: [{ checkIn: { lte: checkInDate } }, { checkOut: { gte: checkInDate } }],
          },
          {
            AND: [{ checkIn: { lte: checkOutDate } }, { checkOut: { gte: checkOutDate } }],
          },
          {
            AND: [{ checkIn: { gte: checkInDate } }, { checkOut: { lte: checkOutDate } }],
          },
        ],
      },
    })

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'La habitación no está disponible en las fechas seleccionadas' },
        { status: 400 }
      )
    }

    // Verificar mantenimiento
    const maintenances = await prisma.maintenance.findMany({
      where: {
        roomId,
        active: true,
        OR: [
          {
            AND: [{ from: { lte: checkInDate } }, { to: { gte: checkInDate } }],
          },
          {
            AND: [{ from: { lte: checkOutDate } }, { to: { gte: checkOutDate } }],
          },
          {
            AND: [{ from: { gte: checkInDate } }, { to: { lte: checkOutDate } }],
          },
        ],
      },
    })

    if (maintenances.length > 0) {
      return NextResponse.json(
        { error: 'La habitación está en mantenimiento en las fechas seleccionadas' },
        { status: 400 }
      )
    }

    // Obtener precio de la habitación
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { roomType: true },
    })

    if (!room) {
      return NextResponse.json({ error: 'Habitación no encontrada' }, { status: 404 })
    }

    // Calcular número de noches y total
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const totalAmount = Number(room.roomType.basePrice) * nights

    // Crear reserva
    const reservation = await prisma.reservation.create({
      data: {
        roomId,
        userId: session.user.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalAmount,
        status: 'PENDING_PAYMENT',
      },
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

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error al crear reserva:', error)
    return NextResponse.json({ error: 'Error al crear reserva' }, { status: 500 })
  }
}
