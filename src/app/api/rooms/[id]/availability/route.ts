import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Se requieren los parámetros from y to' },
        { status: 400 }
      )
    }

    const checkIn = new Date(from)
    const checkOut = new Date(to)

    // Verificar si la habitación tiene mantenimientos activos en el rango
    const maintenances = await prisma.maintenance.findMany({
      where: {
        roomId: parseInt(params.id),
        active: true,
        OR: [
          {
            AND: [{ from: { lte: checkIn } }, { to: { gte: checkIn } }],
          },
          {
            AND: [{ from: { lte: checkOut } }, { to: { gte: checkOut } }],
          },
          {
            AND: [{ from: { gte: checkIn } }, { to: { lte: checkOut } }],
          },
        ],
      },
    })

    // Verificar si la habitación tiene reservas confirmadas en el rango
    const reservations = await prisma.reservation.findMany({
      where: {
        roomId: parseInt(params.id),
        status: {
          in: ['CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          {
            AND: [{ checkIn: { lte: checkIn } }, { checkOut: { gte: checkIn } }],
          },
          {
            AND: [{ checkIn: { lte: checkOut } }, { checkOut: { gte: checkOut } }],
          },
          {
            AND: [{ checkIn: { gte: checkIn } }, { checkOut: { lte: checkOut } }],
          },
        ],
      },
    })

    // Obtener estado actual de la habitación
    const room = await prisma.room.findUnique({
      where: { id: parseInt(params.id) },
      select: { status: true },
    })

    const isAvailable =
      room?.status !== 'CLOSED' && maintenances.length === 0 && reservations.length === 0

    return NextResponse.json({
      available: isAvailable,
      maintenances,
      reservations,
      roomStatus: room?.status,
    })
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error)
    return NextResponse.json({ error: 'Error al verificar disponibilidad' }, { status: 500 })
  }
}
