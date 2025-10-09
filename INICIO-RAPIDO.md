# 🚀 Inicio Rápido - Hotel Elefante

## Opción 1: Setup Automático (Recomendado)

### Con Docker (SQL Server en contenedor)

```powershell
# 1. Iniciar SQL Server
.\start-sqlserver.ps1

# 2. Configurar proyecto
.\setup.ps1

# 3. Iniciar servidor
npm run dev
```

**Listo!** Abre: http://localhost:3000

---

## Opción 2: Setup Manual

### Paso 1: SQL Server

**Con Docker:**
```powershell
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

**O instala SQL Server Express localmente**

### Paso 2: Configurar .env

```powershell
Copy-Item .env.example .env
```

Edita `.env`:
```env
DATABASE_URL="sqlserver://localhost:1433;database=hotel_elefante;user=sa;password=YourStrong@Passw0rd;trustServerCertificate=true;encrypt=true"
NEXTAUTH_SECRET="genera-un-secreto-aleatorio-aqui"
```

### Paso 3: Instalar y Configurar

```powershell
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Poblar base de datos
npx prisma db seed
```

### Paso 4: Iniciar

```powershell
npm run dev
```

Abre: **http://localhost:3000**

---

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | admin@hotelelefante.com | admin123 |
| **Operador** | operador1@hotelelefante.com | operator123 |
| **Cliente** | cliente1@example.com | user123 |

---

## 🎯 ¿Qué Probar?

### Como Usuario Público
1. Explorar habitaciones
2. Ver servicios
3. Enviar mensaje de contacto
4. Registrarse
5. Hacer una reserva

### Como Operador (operador1@hotelelefante.com)
1. **Mapa de habitaciones**: Ver grid con estados
2. **Abrir/Cerrar habitaciones**: Mantenimiento
3. **Gestionar reservas**: Cambiar estados
4. **Responder mensajes**: Enviar emails

### Como Admin (admin@hotelelefante.com)
1. **CRUD Habitaciones**: Crear, editar, eliminar
2. **CRUD Operadores**: Gestionar personal
3. **Analíticas**: Ver KPIs y gráficos
4. Todo lo del operador

---

## 🛠 Comandos Útiles

```powershell
# Ver base de datos con GUI
npx prisma studio

# Reiniciar BD (borra todos los datos)
npx prisma migrate reset

# Ver logs de SQL Server (Docker)
docker logs hotel-elefante-sql

# Detener SQL Server
docker stop hotel-elefante-sql

# Build para producción
npm run build
```

---

## ❓ Problemas Comunes

### Error: Can't reach database server
- Verifica que SQL Server esté corriendo
- Verifica el `DATABASE_URL` en `.env`
- Con Docker: `docker ps` para ver si el contenedor está activo

### Error: Port 3000 already in use
```powershell
# Ver qué usa el puerto
netstat -ano | findstr :3000
# Matar proceso
taskkill /PID <PID> /F
```

### Error de ejecución de scripts PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📚 Más Información

- **README.md**: Documentación completa
- **INSTRUCCIONES.md**: Guía detallada paso a paso
- **package.json**: Scripts disponibles

---

✨ **¡Disfruta explorando Hotel Elefante!**
