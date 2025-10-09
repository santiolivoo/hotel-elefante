import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const operatorSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const operators = await prisma.user.findMany({
      where: {
        role: 'OPERATOR',
      },
      include: {
        operatorInfo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(operators)
  } catch (error) {
    console.error('Error al obtener operadores:', error)
    return NextResponse.json({ error: 'Error al obtener operadores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, name, phone } = operatorSchema.parse(body)

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }

    // Crear usuario operador
    const passwordHash = await hash(password, 10)

    const operator = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'OPERATOR',
        operatorInfo: {
          create: {
            phone: phone || null,
            active: true,
          },
        },
      },
      include: {
        operatorInfo: true,
      },
    })

    // No devolver el hash de contraseña
    const { passwordHash: _, ...operatorData } = operator

    return NextResponse.json(operatorData, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error al crear operador:', error)
    return NextResponse.json({ error: 'Error al crear operador' }, { status: 500 })
  }
}
