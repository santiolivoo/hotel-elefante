import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['OPERATOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const roomId = parseInt(params.id)

    // Desactivar mantenimientos activos
    await prisma.maintenance.updateMany({
      where: {
        roomId,
        active: true,
      },
      data: {
        active: false,
        to: new Date(),
      },
    })

    // Cambiar estado de la habitación a AVAILABLE
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { status: 'AVAILABLE' },
      include: {
        roomType: true,
      },
    })

    return NextResponse.json({
      message: 'Habitación abierta exitosamente',
      room,
    })
  } catch (error) {
    console.error('Error al abrir habitación:', error)
    return NextResponse.json({ error: 'Error al abrir habitación' }, { status: 500 })
  }
}
