import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const closeSchema = z.object({
  reason: z.string().min(1, 'Se requiere una razón'),
  from: z.string(),
  to: z.string(),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['OPERATOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { reason, from, to } = closeSchema.parse(body)

    const roomId = parseInt(params.id)

    // Crear mantenimiento
    const maintenance = await prisma.maintenance.create({
      data: {
        roomId,
        reason,
        from: new Date(from),
        to: new Date(to),
        active: true,
      },
    })

    // Cambiar estado de la habitación a CLOSED
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { status: 'CLOSED' },
      include: {
        roomType: true,
      },
    })

    return NextResponse.json({
      message: 'Habitación cerrada exitosamente',
      room,
      maintenance,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error al cerrar habitación:', error)
    return NextResponse.json({ error: 'Error al cerrar habitación' }, { status: 500 })
  }
}
