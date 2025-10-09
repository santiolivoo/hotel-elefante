Write-Host "🐘 Hotel Elefante - Restaurando Base de Datos" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Detener contenedores existentes
Write-Host "🛑 Deteniendo contenedores..." -ForegroundColor Yellow
docker-compose down

# Limpiar volúmenes
Write-Host "🧹 Limpiando volúmenes..." -ForegroundColor Yellow
docker volume prune -f

# Iniciar SQL Server
Write-Host "🚀 Iniciando SQL Server..." -ForegroundColor Yellow
docker-compose up -d

# Esperar a que SQL Server esté listo
Write-Host "⏳ Esperando a que SQL Server esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar conexión
Write-Host "🔍 Verificando conexión..." -ForegroundColor Yellow
$maxRetries = 5
$retryCount = 0

do {
    $retryCount++
    Write-Host "Intento $retryCount de $maxRetries..." -ForegroundColor Gray
    
    try {
        npx prisma db push --accept-data-loss
        $success = $LASTEXITCODE -eq 0
        if ($success) {
            Write-Host "✅ Base de datos creada exitosamente!" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "❌ Error en intento $retryCount" -ForegroundColor Red
    }
    
    if ($retryCount -lt $maxRetries) {
        Write-Host "⏳ Esperando 10 segundos antes del siguiente intento..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
} while ($retryCount -lt $maxRetries -and -not $success)

if (-not $success) {
    Write-Host "❌ No se pudo conectar a la base de datos después de $maxRetries intentos" -ForegroundColor Red
    Write-Host "Verifica que Docker esté corriendo y que SQL Server haya iniciado correctamente" -ForegroundColor Yellow
    exit 1
}

# Generar cliente Prisma
Write-Host "🔧 Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

# Ejecutar seed
Write-Host "🌱 Poblando base de datos con datos de ejemplo..." -ForegroundColor Yellow
try {
    npx prisma db seed
    Write-Host "✅ Datos de ejemplo agregados!" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  No se pudieron agregar datos de ejemplo (esto es opcional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 ¡Base de datos restaurada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Puedes verificar la conexión ejecutando:" -ForegroundColor Cyan
Write-Host "   npx prisma studio" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para iniciar la aplicación:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
