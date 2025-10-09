import { NextRequest, NextResponse } from 'next/server'
import { sendReservationConfirmationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Probando email directo desde API...')
    
    // Datos de prueba
    const testData = {
      userName: 'Santiago Olivo',
      userEmail: 'santiagoolivomarino@gmail.com',
      reservationId: 'TEST-123',
      roomType: 'Standard',
      roomNumber: '101',
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
      guests: 2,
      totalAmount: 12000,
      nights: 1,
    }

    console.log('📧 Enviando email de prueba a:', testData.userEmail)
    
    const result = await sendReservationConfirmationEmail(testData)
    
    console.log('✅ Resultado del email:', result)

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado',
      result: result
    })

  } catch (error) {
    console.error('❌ Error en prueba de email:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: error
    }, { status: 500 })
  }
}
