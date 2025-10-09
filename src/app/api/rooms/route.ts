import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const roomTypeId = searchParams.get('roomTypeId')
    const status = searchParams.get('status')

    const where: any = {}

    if (roomTypeId) {
      where.roomTypeId = parseInt(roomTypeId)
    }

    if (status) {
      where.status = status
    }

    const rooms = await prisma.room.findMany({
      where,
      include: {
        roomType: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
      orderBy: [{ floor: 'asc' }, { number: 'asc' }],
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error al obtener habitaciones:', error)
    return NextResponse.json({ error: 'Error al obtener habitaciones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { number, floor, roomTypeId, description, images, amenityIds } = body

    const room = await prisma.room.create({
      data: {
        number,
        floor,
        roomTypeId,
        description,
        images: JSON.stringify(images || []),
        status: 'AVAILABLE',
      },
    })

    // Asociar amenidades
    if (amenityIds && Array.isArray(amenityIds)) {
      for (const amenityId of amenityIds) {
        await prisma.roomAmenity.create({
          data: {
            roomId: room.id,
            amenityId,
          },
        })
      }
    }

    const roomWithRelations = await prisma.room.findUnique({
      where: { id: room.id },
      include: {
        roomType: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    })

    return NextResponse.json(roomWithRelations, { status: 201 })
  } catch (error) {
    console.error('Error al crear habitación:', error)
    return NextResponse.json({ error: 'Error al crear habitación' }, { status: 500 })
  }
}
