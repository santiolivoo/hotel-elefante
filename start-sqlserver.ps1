# Script para iniciar SQL Server con Docker
Write-Host "🗄️ Iniciando SQL Server en Docker..." -ForegroundColor Cyan
Write-Host ""

# Verificar si Docker está instalado
try {
    docker --version | Out-Null
    Write-Host "✅ Docker detectado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor instala Docker Desktop desde:" -ForegroundColor Yellow
    Write-Host "https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    exit 1
}

# Verificar si el contenedor ya existe
$containerExists = docker ps -a --filter "name=hotel-elefante-sql" --format "{{.Names}}"

if ($containerExists) {
    Write-Host "Contenedor existente encontrado. Iniciando..." -ForegroundColor Yellow
    docker start hotel-elefante-sql
    Write-Host "✅ SQL Server iniciado" -ForegroundColor Green
} else {
    Write-Host "Creando nuevo contenedor SQL Server..." -ForegroundColor Yellow
    docker run `
        --name hotel-elefante-sql `
        -e "ACCEPT_EULA=Y" `
        -e "SA_PASSWORD=YourStrong@Passw0rd" `
        -e "MSSQL_PID=Developer" `
        -p 1433:1433 `
        -d `
        mcr.microsoft.com/mssql/server:2022-latest
    
    Write-Host "✅ SQL Server creado e iniciado" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Información de conexión:" -ForegroundColor Cyan
Write-Host "   Host:     localhost" -ForegroundColor White
Write-Host "   Port:     1433" -ForegroundColor White
Write-Host "   User:     sa" -ForegroundColor White
Write-Host "   Password: YourStrong@Passw0rd" -ForegroundColor White
Write-Host ""
Write-Host "🔗 String de conexión:" -ForegroundColor Cyan
Write-Host 'sqlserver://localhost:1433;database=hotel_elefante;user=sa;password=YourStrong@Passw0rd;trustServerCertificate=true;encrypt=true' -ForegroundColor White
Write-Host ""
Write-Host "⏳ Esperando 10 segundos para que SQL Server inicie completamente..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "✅ SQL Server listo para usar" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes ejecutar: .\setup.ps1" -ForegroundColor Cyan
