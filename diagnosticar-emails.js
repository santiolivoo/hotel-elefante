const fs = require('fs')
const path = require('path')

console.log('🔍 Diagnóstico del Sistema de Emails')
console.log('===================================')

// Verificar archivo .env
const envPath = path.join(__dirname, '.env')
if (fs.existsSync(envPath)) {
    console.log('✅ Archivo .env encontrado')
    
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    // Verificar variables de email (sin mostrar valores)
    const emailVars = [
        'EMAIL_USER',
        'EMAIL_PASS', 
        'SMTP_USER',
        'SMTP_PASS',
        'SMTP_FROM',
        'RESEND_API_KEY'
    ]
    
    console.log('\n📧 Variables de Email:')
    emailVars.forEach(varName => {
        if (envContent.includes(`${varName}=`)) {
            const line = envContent.split('\n').find(line => line.startsWith(`${varName}=`))
            if (line && line.split('=')[1] && line.split('=')[1].trim() !== '""' && line.split('=')[1].trim() !== '') {
                console.log(`✅ ${varName}: Configurado`)
            } else {
                console.log(`❌ ${varName}: No configurado o vacío`)
            }
        } else {
            console.log(`❌ ${varName}: No encontrado`)
        }
    })
} else {
    console.log('❌ Archivo .env no encontrado')
}

// Verificar servicio de email
console.log('\n🔧 Verificando servicio de email...')
try {
    const emailService = require('./src/lib/email-service.ts')
    console.log('✅ Servicio de email cargado correctamente')
} catch (error) {
    console.log('❌ Error al cargar servicio de email:', error.message)
}

console.log('\n🎯 Próximos pasos:')
console.log('1. Configura las variables de email en el archivo .env')
console.log('2. Ve a http://localhost:3000/admin/configuracion')
console.log('3. Haz clic en "Probar Email"')
console.log('4. Si funciona, intenta hacer otra reserva')
