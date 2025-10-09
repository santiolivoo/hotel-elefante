import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Probando email simple de reserva...')
    
    // Email súper simple, similar al de prueba que funcionó
    const result = await sendEmail({
      to: 'santiagoolivomarino@gmail.com',
      subject: '✅ Confirmación de Reserva - Hotel Elefante',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">🏨 Reserva Confirmada</h2>
          <p>Hola Santiago,</p>
          <p>Tu reserva ha sido confirmada exitosamente.</p>
          <p><strong>Habitación:</strong> 101</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR')}</p>
          <p>¡Gracias por elegir Hotel Elefante!</p>
        </div>
      `
    })
    
    console.log('✅ Email simple enviado:', result)

    return NextResponse.json({
      success: true,
      message: 'Email simple de reserva enviado',
      result: result
    })

  } catch (error) {
    console.error('❌ Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
