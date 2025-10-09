import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const fromDate = from ? new Date(from) : new Date(new Date().setMonth(new Date().getMonth() - 1))
    const toDate = to ? new Date(to) : new Date()

    // Total de reservas
    const totalReservations = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
    })

    // Reservas confirmadas
    const confirmedReservations = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
        status: 'CONFIRMED',
      },
    })

    // Reservas canceladas
    const cancelledReservations = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
        status: 'CANCELLED',
      },
    })

    // Ingresos totales
    const revenue = await prisma.reservation.aggregate({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
        status: {
          in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'],
        },
      },
      _sum: {
        paidAmount: true,
      },
    })

    // ADR (Average Daily Rate) - Precio medio por noche
    const reservationsWithAmount = await prisma.reservation.findMany({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
        status: {
          in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'],
        },
      },
      select: {
        totalAmount: true,
        checkIn: true,
        checkOut: true,
      },
    })

    let totalNights = 0
    let totalAmount = 0

    reservationsWithAmount.forEach((res) => {
      const nights = Math.ceil(
        (new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      )
      totalNights += nights
      totalAmount += Number(res.totalAmount)
    })

    const adr = totalNights > 0 ? totalAmount / totalNights : 0

    // Tasa de conversión
    const conversionRate =
      totalReservations > 0 ? (confirmedReservations / totalReservations) * 100 : 0

    // Porcentaje de cancelaciones
    const cancellationRate =
      totalReservations > 0 ? (cancelledReservations / totalReservations) * 100 : 0

    // Ocupación por tipo de habitación
    const roomTypeOccupancy = await prisma.reservation.groupBy({
      by: ['roomId'],
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
        status: {
          in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'],
        },
      },
      _count: true,
    })

    // Reservas por mes (últimos 6 meses)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const reservationsByMonth = await prisma.$queryRaw`
      SELECT 
        FORMAT(createdAt, 'yyyy-MM') as month,
        COUNT(*) as count,
        SUM(CAST(paidAmount as DECIMAL(18,2))) as revenue
      FROM Reservation
      WHERE createdAt >= ${sixMonthsAgo}
        AND status IN ('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT')
      GROUP BY FORMAT(createdAt, 'yyyy-MM')
      ORDER BY month
    `

    // Lead time promedio (días entre reserva y check-in)
    const reservationsWithLeadTime = await prisma.reservation.findMany({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
        status: {
          in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'],
        },
      },
      select: {
        createdAt: true,
        checkIn: true,
      },
    })

    let totalLeadTime = 0
    reservationsWithLeadTime.forEach((res) => {
      const leadTime = Math.ceil(
        (new Date(res.checkIn).getTime() - new Date(res.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
      totalLeadTime += leadTime
    })

    const avgLeadTime =
      reservationsWithLeadTime.length > 0 ? totalLeadTime / reservationsWithLeadTime.length : 0

    return NextResponse.json({
      summary: {
        totalReservations,
        confirmedReservations,
        cancelledReservations,
        revenue: Number(revenue._sum.paidAmount || 0),
        adr: Math.round(adr),
        conversionRate: Math.round(conversionRate * 10) / 10,
        cancellationRate: Math.round(cancellationRate * 10) / 10,
        avgLeadTime: Math.round(avgLeadTime),
      },
      charts: {
        reservationsByMonth,
        roomTypeOccupancy,
      },
    })
  } catch (error) {
    console.error('Error al obtener analíticas:', error)
    return NextResponse.json({ error: 'Error al obtener analíticas' }, { status: 500 })
  }
}
