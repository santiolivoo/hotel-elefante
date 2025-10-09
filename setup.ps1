# Script de Setup para Hotel Elefante
Write-Host "🏨 Hotel Elefante - Setup Automático" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar dependencias
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..." -ForegroundColor Green
    npm install
}

# 2. Copiar .env si no existe
Write-Host ""
Write-Host "⚙️ Configurando variables de entorno..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "Copiando .env.example a .env..." -ForegroundColor Green
    Copy-Item .env.example .env
    Write-Host "⚠️ IMPORTANTE: Edita el archivo .env con tus configuraciones" -ForegroundColor Red
    Write-Host "   - DATABASE_URL (conexión a SQL Server)" -ForegroundColor Red
    Write-Host "   - NEXTAUTH_SECRET (genera uno con: openssl rand -base64 32)" -ForegroundColor Red
    Write-Host ""
    $continue = Read-Host "¿Deseas continuar? El script intentará conectar a SQL Server (S/N)"
    if ($continue -ne "S" -and $continue -ne "s") {
        Write-Host "Setup cancelado. Configura .env y ejecuta nuevamente." -ForegroundColor Yellow
        exit
    }
} else {
    Write-Host ".env ya existe, usando configuración actual" -ForegroundColor Green
}

# 3. Generar cliente Prisma
Write-Host ""
Write-Host "🔧 Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

# 4. Verificar SQL Server
Write-Host ""
Write-Host "🗄️ Verificando conexión a SQL Server..." -ForegroundColor Yellow
Write-Host "Si falla, asegúrate de tener SQL Server corriendo en localhost:1433" -ForegroundColor Cyan
Write-Host "O ejecuta: docker run -e ACCEPT_EULA=Y -e SA_PASSWORD=YourStrong@Passw0rd -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest" -ForegroundColor Cyan
Write-Host ""

# 5. Ejecutar migraciones
Write-Host "📊 Ejecutando migraciones..." -ForegroundColor Yellow
try {
    npx prisma migrate dev --name init
    Write-Host "✅ Migraciones aplicadas correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al ejecutar migraciones" -ForegroundColor Red
    Write-Host "Verifica tu conexión a SQL Server y el DATABASE_URL en .env" -ForegroundColor Yellow
    exit 1
}

# 6. Poblar base de datos
Write-Host ""
Write-Host "🌱 Poblando base de datos con datos de ejemplo..." -ForegroundColor Yellow
try {
    npx prisma db seed
    Write-Host "✅ Base de datos poblada correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al poblar base de datos" -ForegroundColor Red
    exit 1
}

# 7. Listo
Write-Host ""
Write-Host "✨ ¡Setup completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "👥 Usuarios de prueba:" -ForegroundColor Cyan
Write-Host "   Admin:    admin@hotelelefante.com / admin123" -ForegroundColor White
Write-Host "   Operador: operador1@hotelelefante.com / operator123" -ForegroundColor White
Write-Host "   Cliente:  cliente1@example.com / user123" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para iniciar el servidor ejecuta:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📖 Luego abre en tu navegador:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
