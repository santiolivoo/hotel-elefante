@echo off
echo 🐘 Hotel Elefante - Reparando Base de Datos
echo ==========================================

echo 🛑 Deteniendo contenedores...
docker-compose down

echo 🧹 Limpiando volúmenes...
docker volume rm hotelelefante_sqlserver_data 2>nul

echo 🚀 Iniciando SQL Server...
docker-compose up -d

echo ⏳ Esperando 45 segundos para que SQL Server esté listo...
timeout /t 45 /nobreak

echo 🔧 Creando base de datos...
npx prisma db push --accept-data-loss

if %ERRORLEVEL% EQU 0 (
    echo ✅ Base de datos creada exitosamente!
    echo 🔧 Generando cliente Prisma...
    npx prisma generate
    echo 🎉 ¡Todo listo!
    echo.
    echo 🚀 Para iniciar la aplicación ejecuta: npm run dev
) else (
    echo ❌ Error al crear la base de datos
    echo Verifica que Docker esté corriendo
)

pause
