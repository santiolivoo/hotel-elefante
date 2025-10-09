import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const amenities = await prisma.amenity.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(amenities)
  } catch (error) {
    console.error('Error al obtener amenidades:', error)
    return NextResponse.json({ error: 'Error al obtener amenidades' }, { status: 500 })
  }
}
