import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const data = updateSchema.parse(body)

    // Actualizar usuario
    const updateData: any = {}
    if (data.name) updateData.name = data.name

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: params.id },
        data: updateData,
      })
    }

    // Actualizar información de operador
    if (data.phone !== undefined || data.active !== undefined) {
      const operatorData: any = {}
      if (data.phone !== undefined) operatorData.phone = data.phone
      if (data.active !== undefined) operatorData.active = data.active

      await prisma.operator.update({
        where: { userId: params.id },
        data: operatorData,
      })
    }

    const operator = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        operatorInfo: true,
      },
    })

    return NextResponse.json(operator)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error al actualizar operador:', error)
    return NextResponse.json({ error: 'Error al actualizar operador' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Operador eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar operador:', error)
    return NextResponse.json({ error: 'Error al eliminar operador' }, { status: 500 })
  }
}
