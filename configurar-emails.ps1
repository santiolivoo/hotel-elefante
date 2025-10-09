# Script de configuración rápida para emails - Hotel Elefante
Write-Host "🐘 Hotel Elefante - Configuración de Emails" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Verificar si existe .env
if (-not (Test-Path ".env")) {
    Write-Host "📄 Creando archivo .env desde .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "📄 Archivo .env ya existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "📧 Configuración de Email" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

# Preguntar por el método de email
Write-Host ""
Write-Host "Selecciona el método de envío de emails:" -ForegroundColor White
Write-Host "1. Gmail SMTP (Gratis, para desarrollo)" -ForegroundColor Cyan
Write-Host "2. Resend (Recomendado para producción)" -ForegroundColor Cyan
Write-Host "3. Configurar manualmente después" -ForegroundColor Gray

$opcion = Read-Host "Ingresa tu opción (1-3)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "📧 Configurando Gmail SMTP..." -ForegroundColor Yellow
        
        $email = Read-Host "Ingresa tu email de Gmail"
        $password = Read-Host "Ingresa tu contraseña de aplicación de Gmail" -AsSecureString
        $passwordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        
        # Actualizar .env
        (Get-Content ".env") | ForEach-Object {
            $_ -replace 'EMAIL_USER="tu-email@gmail.com"', "EMAIL_USER=`"$email`"" `
               -replace 'EMAIL_PASS="tu-password-de-aplicacion"', "EMAIL_PASS=`"$passwordText`"" `
               -replace 'SMTP_USER="tu-email@gmail.com"', "SMTP_USER=`"$email`"" `
               -replace 'SMTP_PASS="tu-password-de-aplicacion"', "SMTP_PASS=`"$passwordText`"" `
               -replace 'SMTP_FROM="Hotel Elefante <tu-email@gmail.com>"', "SMTP_FROM=`"Hotel Elefante <$email>`""
        } | Set-Content ".env"
        
        Write-Host "✅ Gmail SMTP configurado" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANTE: Asegúrate de:" -ForegroundColor Red
        Write-Host "   1. Tener autenticación de 2 factores habilitada" -ForegroundColor White
        Write-Host "   2. Usar una contraseña de aplicación, no tu contraseña normal" -ForegroundColor White
        Write-Host "   3. Generar la contraseña en: https://myaccount.google.com/apppasswords" -ForegroundColor White
    }
    
    "2" {
        Write-Host ""
        Write-Host "📧 Configurando Resend..." -ForegroundColor Yellow
        
        $apiKey = Read-Host "Ingresa tu API Key de Resend (re_xxxxxxxxx)"
        $fromEmail = Read-Host "Ingresa el email desde el cual enviar (debe estar verificado en Resend)"
        
        # Actualizar .env
        (Get-Content ".env") | ForEach-Object {
            $_ -replace 'RESEND_API_KEY="re_xxxxxxxxx"', "RESEND_API_KEY=`"$apiKey`"" `
               -replace 'SMTP_FROM="Hotel Elefante <tu-email@gmail.com>"', "SMTP_FROM=`"Hotel Elefante <$fromEmail>`""
        } | Set-Content ".env"
        
        Write-Host "✅ Resend configurado" -ForegroundColor Green
        Write-Host ""
        Write-Host "ℹ️  Para obtener tu API Key:" -ForegroundColor Cyan
        Write-Host "   1. Ve a https://resend.com" -ForegroundColor White
        Write-Host "   2. Regístrate y verifica tu dominio" -ForegroundColor White
        Write-Host "   3. Genera una API Key en el dashboard" -ForegroundColor White
    }
    
    "3" {
        Write-Host "⏭️  Configuración manual seleccionada" -ForegroundColor Yellow
        Write-Host "   Edita el archivo .env manualmente con tus credenciales" -ForegroundColor White
    }
    
    default {
        Write-Host "❌ Opción inválida" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🔧 Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🗄️  Configurando base de datos..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Ejecuta: npm run dev" -ForegroundColor White
Write-Host "   2. Ve a: http://localhost:3000/admin/configuracion" -ForegroundColor White
Write-Host "   3. Haz clic en 'Probar Email' para verificar" -ForegroundColor White
Write-Host ""
Write-Host "📧 El sistema enviará emails automáticamente cuando:" -ForegroundColor Yellow
Write-Host "   • Se cree una nueva reserva" -ForegroundColor White
Write-Host "   • Cambie el estado de una reserva" -ForegroundColor White
Write-Host "   • Se envíen promociones desde /admin/promociones" -ForegroundColor White
Write-Host ""
Write-Host "🎉 ¡Disfruta tu sistema de emails automatizado!" -ForegroundColor Green
