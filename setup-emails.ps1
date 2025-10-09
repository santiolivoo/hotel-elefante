Write-Host "Hotel Elefante - Configuracion de Emails" -ForegroundColor Cyan

# Verificar si existe .env
if (-not (Test-Path ".env")) {
    Write-Host "Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Archivo .env creado" -ForegroundColor Green
}

Write-Host ""
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "Configuracion completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host "1. Edita el archivo .env con tus credenciales de email"
Write-Host "2. Ejecuta: npm run dev"
Write-Host "3. Ve a: http://localhost:3000/admin/configuracion"
Write-Host "4. Prueba el sistema de emails"
Write-Host ""
