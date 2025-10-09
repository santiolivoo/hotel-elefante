import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        roomType: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        reservations: {
          where: {
            status: {
              in: ['CONFIRMED', 'CHECKED_IN'],
            },
          },
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
            status: true,
          },
        },
        maintenances: {
          where: {
            active: true,
          },
          select: {
            id: true,
            from: true,
            to: true,
            reason: true,
          },
        },
      },
    })

    if (!room) {
      return NextResponse.json({ error: 'Habitación no encontrada' }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error('Error al obtener habitación:', error)
    return NextResponse.json({ error: 'Error al obtener habitación' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { number, floor, roomTypeId, description, images, amenityIds, status } = body

    const updateData: any = {}
    if (number !== undefined) updateData.number = number
    if (floor !== undefined) updateData.floor = floor
    if (roomTypeId !== undefined) updateData.roomTypeId = roomTypeId
    if (description !== undefined) updateData.description = description
    if (images !== undefined) updateData.images = JSON.stringify(images)
    if (status !== undefined) updateData.status = status

    const room = await prisma.room.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    })

    // Actualizar amenidades si se proporcionan
    if (amenityIds && Array.isArray(amenityIds)) {
      // Eliminar amenidades existentes
      await prisma.roomAmenity.deleteMany({
        where: { roomId: room.id },
      })

      // Agregar nuevas amenidades
      for (const amenityId of amenityIds) {
        await prisma.roomAmenity.create({
          data: {
            roomId: room.id,
            amenityId,
          },
        })
      }
    }

    const updatedRoom = await prisma.room.findUnique({
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

    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error('Error al actualizar habitación:', error)
    return NextResponse.json({ error: 'Error al actualizar habitación' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    await prisma.room.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ message: 'Habitación eliminada exitosamente' })
  } catch (error) {
    console.error('Error al eliminar habitación:', error)
    return NextResponse.json({ error: 'Error al eliminar habitación' }, { status: 500 })
  }
}
