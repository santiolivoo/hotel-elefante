Write-Host "🐘 Hotel Elefante - Reinicio Completo del Sistema" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Detener todos los procesos de Node.js
Write-Host "🛑 Deteniendo procesos de Node.js..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Detener contenedores
Write-Host "🛑 Deteniendo contenedores Docker..." -ForegroundColor Yellow
docker-compose down -v

# Limpiar archivos de Prisma
Write-Host "🧹 Limpiando archivos de Prisma..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "node_modules\.prisma" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "prisma\migrations" -ErrorAction SilentlyContinue

# Reinstalar dependencias
Write-Host "📦 Reinstalando dependencias..." -ForegroundColor Yellow
npm install

# Iniciar SQL Server
Write-Host "🚀 Iniciando SQL Server..." -ForegroundColor Yellow
docker-compose up -d

# Esperar a que SQL Server esté listo
Write-Host "⏳ Esperando a que SQL Server esté listo (60 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

# Crear base de datos
Write-Host "🗄️ Creando base de datos..." -ForegroundColor Yellow
npx prisma db push --accept-data-loss

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Base de datos creada exitosamente!" -ForegroundColor Green
    
    # Generar cliente Prisma
    Write-Host "🔧 Generando cliente Prisma..." -ForegroundColor Yellow
    npx prisma generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cliente Prisma generado exitosamente!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🎉 ¡Sistema restaurado completamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Para iniciar la aplicación:" -ForegroundColor Cyan
        Write-Host "   npm run dev" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 Para ver la base de datos:" -ForegroundColor Cyan
        Write-Host "   npx prisma studio" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ Error al generar cliente Prisma" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Error al crear la base de datos" -ForegroundColor Red
    Write-Host "Verifica que Docker esté corriendo y que la configuración sea correcta" -ForegroundColor Yellow
}
