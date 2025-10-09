import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const period = searchParams.get('period') || '30' // días por defecto

    const fromDate = from ? new Date(from) : new Date(new Date().setDate(new Date().getDate() - parseInt(period)))
    const toDate = to ? new Date(to) : new Date()

    // ===== MÉTRICAS BÁSICAS =====
    const totalReservations = await prisma.reservation.count({
      where: { createdAt: { gte: fromDate, lte: toDate } }
    })

    const confirmedReservations = await prisma.reservation.count({
      where: { createdAt: { gte: fromDate, lte: toDate }, status: 'CONFIRMED' }
    })

    const cancelledReservations = await prisma.reservation.count({
      where: { createdAt: { gte: fromDate, lte: toDate }, status: 'CANCELLED' }
    })

    const revenue = await prisma.reservation.aggregate({
      where: {
        createdAt: { gte: fromDate, lte: toDate },
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] }
      },
      _sum: { paidAmount: true }
    })

    // ===== CÁLCULOS ADR Y REVPAR =====
    const reservationsWithAmount = await prisma.reservation.findMany({
      where: {
        createdAt: { gte: fromDate, lte: toDate },
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] }
      },
      select: { totalAmount: true, checkIn: true, checkOut: true, roomId: true }
    })

    let totalNights = 0
    let totalAmount = 0
    reservationsWithAmount.forEach((res) => {
      const nights = Math.ceil((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000 * 60 * 60 * 24))
      totalNights += nights
      totalAmount += Number(res.totalAmount)
    })

    const adr = totalNights > 0 ? totalAmount / totalNights : 0
    
    // Total de habitaciones disponibles (asumiendo que hay habitaciones en la BD)
    const totalRooms = await prisma.room.count()
    const daysInPeriod = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
    const availableRoomNights = totalRooms * daysInPeriod
    const revpar = availableRoomNights > 0 ? Number(revenue._sum.paidAmount || 0) / availableRoomNights : 0

    // ===== INGRESOS POR MES (últimos 12 meses) - Simplificado =====
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const revenueData = await prisma.reservation.findMany({
      where: {
        createdAt: { gte: twelveMonthsAgo },
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] }
      },
      select: { createdAt: true, paidAmount: true }
    })

    const revenueByMonth = revenueData.reduce((acc: any[], res) => {
      const month = res.createdAt.toISOString().slice(0, 7) // YYYY-MM
      const existing = acc.find(item => item.month === month)
      if (existing) {
        existing.reservations++
        existing.revenue += Number(res.paidAmount)
      } else {
        acc.push({
          month,
          reservations: 1,
          revenue: Number(res.paidAmount)
        })
      }
      return acc
    }, []).sort((a, b) => a.month.localeCompare(b.month))

    // ===== RESERVAS POR TIPO DE HABITACIÓN =====
    const reservationsByRoomType = await prisma.reservation.groupBy({
      by: ['roomId'],
      where: {
        createdAt: { gte: fromDate, lte: toDate },
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] }
      },
      _count: true,
      _sum: { paidAmount: true }
    })

    // Obtener información de las habitaciones con sus tipos
    const roomsInfo = await prisma.room.findMany({
      select: { 
        id: true, 
        number: true, 
        roomType: {
          select: { name: true }
        }
      }
    })

    const roomTypeData = reservationsByRoomType.map(item => {
      const room = roomsInfo.find(r => r.id === item.roomId)
      return {
        roomName: room?.number || `Habitación ${item.roomId}`,
        roomType: room?.roomType?.name || 'Desconocido',
        reservations: item._count,
        revenue: Number(item._sum.paidAmount || 0)
      }
    })

    // ===== OCUPACIÓN DIARIA (últimos 30 días) - Simplificado =====
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyOccupancyData = await prisma.reservation.findMany({
      where: {
        checkIn: { gte: thirtyDaysAgo, lte: toDate },
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] }
      },
      select: { checkIn: true }
    })

    const dailyOccupancy = dailyOccupancyData.reduce((acc: any[], res) => {
      const date = res.checkIn.toISOString().split('T')[0] // YYYY-MM-DD
      const existing = acc.find(item => item.date === date)
      if (existing) {
        existing.occupied_rooms++
      } else {
        acc.push({
          date,
          occupied_rooms: 1
        })
      }
      return acc
    }, []).sort((a, b) => a.date.localeCompare(b.date))

    // ===== LEAD TIME Y DURACIÓN DE ESTADÍAS =====
    const reservationsDetails = await prisma.reservation.findMany({
      where: {
        createdAt: { gte: fromDate, lte: toDate },
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] }
      },
      select: { 
        createdAt: true, 
        checkIn: true, 
        checkOut: true, 
        userId: true,
        user: {
          select: { email: true }
        }
      }
    })

    let totalLeadTime = 0
    let totalStayDuration = 0
    const leadTimeData: any[] = []

    reservationsDetails.forEach((res) => {
      const leadTime = Math.ceil((new Date(res.checkIn).getTime() - new Date(res.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      const stayDuration = Math.ceil((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000 * 60 * 60 * 24))
      
      totalLeadTime += leadTime
      totalStayDuration += stayDuration
      leadTimeData.push({ leadTime, stayDuration, date: res.createdAt })
    })

    const avgLeadTime = reservationsDetails.length > 0 ? totalLeadTime / reservationsDetails.length : 0
    const avgStayDuration = reservationsDetails.length > 0 ? totalStayDuration / reservationsDetails.length : 0

    // ===== CLIENTES RECURRENTES =====
    const guestEmails = reservationsDetails.map(r => r.user.email).filter(Boolean)
    const uniqueGuests = new Set(guestEmails).size
    const totalGuestReservations = guestEmails.length
    const returningGuestRate = uniqueGuests > 0 ? ((totalGuestReservations - uniqueGuests) / totalGuestReservations) * 100 : 0

    // ===== TOP 5 HABITACIONES MÁS RENTABLES =====
    const topRooms = roomTypeData
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // ===== OCUPACIÓN SEMANAL (HEATMAP) - Simplificado =====
    const weeklyOccupancyData = await prisma.reservation.findMany({
      where: {
        checkIn: { gte: thirtyDaysAgo, lte: toDate },
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] }
      },
      select: { checkIn: true }
    })

    const weeklyOccupancy = weeklyOccupancyData.map(res => {
      const date = new Date(res.checkIn)
      return {
        dayOfWeek: date.getDay() + 1, // 1-7 (Sunday = 1)
        weekNumber: Math.ceil(date.getDate() / 7),
        reservations: 1
      }
    }).reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.dayOfWeek === curr.dayOfWeek && item.weekNumber === curr.weekNumber)
      if (existing) {
        existing.reservations++
      } else {
        acc.push(curr)
      }
      return acc
    }, [])

    // ===== TASA DE OCUPACIÓN POR MES - Simplificado =====
    const monthlyOccupancyData = await prisma.reservation.findMany({
      where: {
        checkIn: { gte: twelveMonthsAgo },
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] }
      },
      select: { checkIn: true }
    })

    const monthlyOccupancyRate = monthlyOccupancyData.reduce((acc: any[], res) => {
      const month = res.checkIn.toISOString().slice(0, 7) // YYYY-MM
      const existing = acc.find(item => item.month === month)
      if (existing) {
        existing.occupied_nights++
      } else {
        acc.push({
          month,
          occupied_nights: 1,
          available_nights: totalRooms * 30 // Aproximación
        })
      }
      return acc
    }, [])

    return NextResponse.json({
      summary: {
        totalReservations: totalReservations || 0,
        confirmedReservations: confirmedReservations || 0,
        cancelledReservations: cancelledReservations || 0,
        revenue: Number(revenue._sum.paidAmount || 0),
        adr: Math.round(adr) || 0,
        revpar: Math.round(revpar) || 0,
        conversionRate: totalReservations > 0 ? Math.round(((confirmedReservations / totalReservations) * 100) * 10) / 10 : 0,
        cancellationRate: totalReservations > 0 ? Math.round(((cancelledReservations / totalReservations) * 100) * 10) / 10 : 0,
        avgLeadTime: Math.round(avgLeadTime) || 0,
        avgStayDuration: Math.round(avgStayDuration * 10) / 10 || 0,
        occupancyRate: totalRooms > 0 && availableRoomNights > 0 ? Math.round(((totalNights / availableRoomNights) * 100) * 10) / 10 : 0,
        returningGuestRate: Math.round(returningGuestRate * 10) / 10 || 0,
        totalRooms: totalRooms || 0,
        uniqueGuests: uniqueGuests || 0
      },
      charts: {
        revenueByMonth: revenueByMonth || [],
        reservationsByRoomType: roomTypeData || [],
        dailyOccupancy: dailyOccupancy || [],
        leadTimeData: (leadTimeData || []).slice(0, 50), // Limitar para performance
        topRooms: topRooms || [],
        weeklyOccupancy: weeklyOccupancy || [],
        monthlyOccupancyRate: monthlyOccupancyRate || [],
        cancellationVsConfirmed: [
          { name: 'Confirmadas', value: confirmedReservations || 0, color: '#10b981' },
          { name: 'Canceladas', value: cancelledReservations || 0, color: '#ef4444' }
        ]
      }
    })
  } catch (error) {
    console.error('Error al obtener analíticas:', error)
    return NextResponse.json({ error: 'Error al obtener analíticas' }, { status: 500 })
  }
}
