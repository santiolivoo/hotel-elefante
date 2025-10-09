const nodemailer = require('nodemailer')
require('dotenv').config()

async function testEmailCompleto() {
  console.log('🔍 Diagnóstico Completo del Sistema de Emails')
  console.log('=============================================')

  // 1. Verificar variables de entorno
  console.log('\n📋 Variables de entorno:')
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Configurado' : '❌ No configurado'}`)
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Configurado' : '❌ No configurado'}`)
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST || process.env.EMAIL_HOST}`)
  console.log(`SMTP_PORT: ${process.env.SMTP_PORT || process.env.EMAIL_PORT}`)

  // 2. Crear transporter
  console.log('\n🔧 Creando transporter...')
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // Habilitar logs detallados
    logger: true
  })

  // 3. Verificar conexión
  console.log('\n🔌 Verificando conexión SMTP...')
  try {
    await transporter.verify()
    console.log('✅ Conexión SMTP exitosa')
  } catch (error) {
    console.log('❌ Error de conexión SMTP:', error.message)
    return
  }

  // 4. Enviar email de prueba
  console.log('\n📧 Enviando email de prueba...')
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Hotel Elefante" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Enviamos a nosotros mismos
      subject: '🧪 Prueba de Email - Hotel Elefante',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">🧪 Prueba de Email Exitosa</h2>
          <p>¡Felicidades! El sistema de emails está funcionando correctamente.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
          <p><strong>Configuración:</strong> Gmail SMTP</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Este es un email de prueba del sistema Hotel Elefante
          </p>
        </div>
      `
    })

    console.log('✅ Email enviado exitosamente!')
    console.log(`📬 Message ID: ${info.messageId}`)
    console.log(`📧 Enviado a: ${process.env.EMAIL_USER}`)
    console.log('\n🎉 ¡Revisa tu bandeja de entrada (y spam)!')

  } catch (error) {
    console.log('❌ Error al enviar email:', error.message)
    console.log('Detalles del error:', error)
  }
}

testEmailCompleto()
