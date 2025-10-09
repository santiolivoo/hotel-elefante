import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { testEmailConfiguration } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['OPERATOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    console.log('🧪 Iniciando prueba de email...')
    
    const result = await testEmailConfiguration()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de prueba enviado exitosamente',
        provider: result.provider,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error al enviar email de prueba',
        error: result.error,
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error en prueba de email:', error)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 })
  }
}
