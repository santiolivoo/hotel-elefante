// Prueba simple de email sin TypeScript
const nodemailer = require('nodemailer')

console.log('🔍 Prueba Simple de Email')
console.log('=========================')

// Configuración manual (copiando del .env)
const config = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'santiagoolivomarino@gmail.com',
    pass: 'gbik suma oyli zcud'
  }
}

console.log('📧 Configuración:')
console.log(`Host: ${config.host}`)
console.log(`Port: ${config.port}`)
console.log(`User: ${config.auth.user}`)
console.log(`Pass: ${config.auth.pass ? 'Configurado' : 'No configurado'}`)

async function testEmail() {
  try {
    console.log('\n🔧 Creando transporter...')
    const transporter = nodemailer.createTransport(config)

    console.log('🔌 Verificando conexión...')
    await transporter.verify()
    console.log('✅ Conexión SMTP exitosa')

    console.log('📧 Enviando email de prueba...')
    const result = await transporter.sendMail({
      from: '"Hotel Elefante" <santiagoolivomarino@gmail.com>',
      to: 'santiagoolivomarino@gmail.com',
      subject: '🧪 Prueba de Email - Hotel Elefante',
      html: `
        <h2>🧪 Prueba de Email</h2>
        <p>¡El sistema de emails está funcionando!</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
      `
    })

    console.log('✅ Email enviado exitosamente!')
    console.log(`Message ID: ${result.messageId}`)
    console.log('\n🎉 ¡Revisa tu Gmail!')

  } catch (error) {
    console.log('❌ Error:', error.message)
    
    // Diagnóstico específico de errores comunes
    if (error.message.includes('Invalid login')) {
      console.log('\n🔧 Posibles soluciones:')
      console.log('1. Verifica que tengas autenticación de 2 factores habilitada')
      console.log('2. Usa una contraseña de aplicación, no tu contraseña normal')
      console.log('3. Ve a: https://myaccount.google.com/apppasswords')
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Problema de conexión:')
      console.log('1. Verifica tu conexión a internet')
      console.log('2. Puede ser un firewall bloqueando el puerto 587')
    }
  }
}

testEmail()
