@echo off
echo 🔧 Actualizando archivo .env con la nueva configuración...

copy .env.example .env

echo ✅ Archivo .env actualizado con la nueva contraseña de base de datos
echo.
echo 📝 Configuración de base de datos:
echo    Usuario: sa
echo    Contraseña: Password123!
echo    Puerto: 1433
echo.
echo 🚀 Ahora puedes probar la conexión ejecutando:
echo    npx prisma db push
echo.
pause
