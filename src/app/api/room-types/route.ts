import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const roomTypes = await prisma.roomType.findMany({
      include: {
        rooms: {
          select: {
            id: true,
            number: true,
            status: true,
          },
        },
      },
      orderBy: {
        basePrice: 'asc',
      },
    })

    return NextResponse.json(roomTypes)
  } catch (error) {
    console.error('Error al obtener tipos de habitación:', error)
    return NextResponse.json(
      { error: 'Error al obtener tipos de habitación' },
      { status: 500 }
    )
  }
}
