# 🚀 Instrucciones de Ejecución - Hotel Elefante

## ✅ Estado Actual
- ✅ Dependencias instaladas
- ✅ Cliente Prisma generado
- ✅ Esquema de BD adaptado para SQL Server
- ⚠️ Base de datos SQL Server por configurar

## 📝 Pasos para Ejecutar

### 1. Configurar SQL Server

**Opción A: Con Docker (Recomendado)**
```powershell
# Instalar Docker Desktop para Windows primero
# Luego ejecutar:
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

**Opción B: SQL Server Local**
- Instalar SQL Server Express
- Crear base de datos `hotel_elefante`
- Configurar usuario y contraseña

### 2. Configurar Variables de Entorno

Copiar `.env.example` a `.env` (sin el .example):
```powershell
Copy-Item .env.example .env
```

Editar `.env` y configurar:
```env
DATABASE_URL="sqlserver://localhost:1433;database=hotel_elefante;user=sa;password=YourStrong@Passw0rd;trustServerCertificate=true;encrypt=true"
NEXTAUTH_SECRET="tu-secreto-aleatorio-aqui"
```

### 3. Ejecutar Migraciones

```powershell
powershell -ExecutionPolicy Bypass -Command "npx prisma migrate dev --name init"
```

### 4. Poblar Base de Datos

```powershell
powershell -ExecutionPolicy Bypass -Command "npx prisma db seed"
```

### 5. Iniciar Servidor de Desarrollo

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### 6. Abrir en Navegador

Ir a: **http://localhost:3000**

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | admin@hotelelefante.com | admin123 |
| **Operador** | operador1@hotelelefante.com | operator123 |
| **Cliente** | cliente1@example.com | user123 |

## 🎯 Funcionalidades a Probar

### Usuario Público
- ✅ Ver home con imágenes del hotel
- ✅ Explorar habitaciones
- ✅ Ver servicios
- ✅ Enviar consulta por contacto
- ✅ Registrarse y login

### Operador
- ✅ **Mapa de habitaciones**: Ver grid con estados
- ✅ **Abrir/Cerrar habitaciones**: Marcar en mantenimiento
- ✅ **Gestionar reservas**: Ver, cambiar estados, liberar
- ✅ **Responder mensajes**: Enviar respuestas por email

### Administrador
- ✅ **CRUD Habitaciones**: Crear, editar, eliminar
- ✅ **CRUD Operadores**: Gestionar usuarios operadores
- ✅ **Analíticas**: Ver KPIs (ingresos, ocupación, ADR, conversión)
- ✅ Todo lo del operador

## 🔧 Comandos Útiles

```powershell
# Ver base de datos
powershell -ExecutionPolicy Bypass -Command "npx prisma studio"

# Limpiar y rebuilddear
powershell -ExecutionPolicy Bypass -Command "npm run build"

# Revisar migraciones
powershell -ExecutionPolicy Bypass -Command "npx prisma migrate status"
```

## 📦 APIs Implementadas

### Públicas
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login (NextAuth)
- `GET /api/room-types` - Tipos de habitación
- `GET /api/rooms` - Listar habitaciones
- `GET /api/rooms/[id]` - Detalle habitación
- `GET /api/rooms/[id]/availability` - Verificar disponibilidad
- `POST /api/contact` - Enviar mensaje contacto

### Protegidas (Usuario)
- `GET /api/reservations` - Mis reservas
- `POST /api/reservations` - Crear reserva
- `POST /api/payments/mercadopago/create-preference` - Iniciar pago

### Operador
- `POST /api/rooms/[id]/open` - Abrir habitación
- `POST /api/rooms/[id]/close` - Cerrar habitación
- `PATCH /api/reservations/[id]/status` - Cambiar estado reserva
- `GET /api/contact` - Ver mensajes
- `POST /api/messages/[id]/reply` - Responder mensaje

### Admin
- `POST /api/rooms` - Crear habitación
- `PATCH /api/rooms/[id]` - Editar habitación
- `DELETE /api/rooms/[id]` - Eliminar habitación
- `GET /api/admin/operators` - Listar operadores
- `POST /api/admin/operators` - Crear operador
- `PATCH /api/admin/operators/[id]` - Editar operador
- `DELETE /api/admin/operators/[id]` - Eliminar operador
- `GET /api/admin/analytics` - Obtener KPIs y gráficos

## ⚠️ Notas Importantes

1. **SQL Server**: Asegurarse de que esté corriendo antes de ejecutar migraciones
2. **Imágenes**: Todas las imágenes están en `/public/Imagenes del hotel/`
3. **Email**: Configurar SMTP en `.env` para que funcionen los correos (opcional para desarrollo)
4. **Mercado Pago**: Configurar tokens de sandbox para pagos (opcional)
5. **Puerto**: El servidor corre en puerto 3000 por defecto

## 🐛 Solución de Problemas

### Error de conexión a BD
```
Error: Can't reach database server
```
**Solución**: Verificar que SQL Server esté corriendo en puerto 1433

### Error de migraciones
```
Error: P3009
```
**Solución**: Eliminar carpeta `prisma/migrations` y volver a ejecutar migrate

### Puerto 3000 ocupado
```
Error: Port 3000 is already in use
```
**Solución**: 
```powershell
# Ver qué usa el puerto
netstat -ano | findstr :3000
# Matar proceso
taskkill /PID <PID> /F
```

## 📚 Tecnologías Usadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: SQL Server
- **Autenticación**: NextAuth.js
- **Pagos**: Mercado Pago
- **Email**: Nodemailer
- **Validación**: Zod + React Hook Form
- **Gráficos**: Recharts

---

✨ **Proyecto completado y listo para ejecutar**
