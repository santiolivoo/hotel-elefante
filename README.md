# Hotel Elefante - Sistema de Gestión Hotelera

Sistema completo de gestión hotelera para Hotel Elefante, San Lorenzo, Salta (Argentina).

## 📋 Requisitos Académicos Cumplidos

### Navegación Usuario (Público)
- ✅ Ver habitaciones y servicios
- ✅ Realizar reserva con selección de fechas y habitación
- ✅ Enviar consultas por mail (contacto)

### Navegación Operador
- ✅ Consultar habitaciones en MAPA (grid con estado)
- ✅ Consultar y liberar reservas
- ✅ Abrir/Cerrar habitación (mantenimiento)
- ✅ Procesar pago de reservas
- ✅ Responder consultas por mail

### Navegación Administrador
- ✅ CRUD de habitaciones con fotos locales
- ✅ CRUD de operadores
- ✅ Consultas parametrizadas y gráficos (ocupación, revenue, conversión)

## 🛠 Tecnologías Utilizadas

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Base de Datos**: SQL Server con Prisma ORM
- **Autenticación**: NextAuth.js con roles (USER, OPERATOR, ADMIN)
- **Pagos**: Mercado Pago Checkout Pro (sandbox)
- **Email**: Nodemailer (SMTP)
- **Calendario**: FullCalendar
- **Gráficos**: Recharts
- **Validación**: Zod + React Hook Form

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- SQL Server (local o Docker)
- npm o yarn

### Pasos

1. **Clonar repositorio**
```bash
git clone <repository-url>
cd "HOTEL ELEFANTE"
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
- `DATABASE_URL`: Cadena de conexión a SQL Server
- `NEXTAUTH_SECRET`: Secreto para JWT
- `MP_ACCESS_TOKEN`: Token de Mercado Pago
- `SMTP_*`: Configuración de email

4. **Configurar SQL Server con Docker (opcional)**
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

5. **Ejecutar migraciones**
```bash
npx prisma migrate dev
```

6. **Poblar base de datos**
```bash
npx prisma db seed
```

7. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@hotelelefante.com | admin123 |
| Operador | operador1@hotelelefante.com | operator123 |
| Cliente | cliente1@example.com | user123 |

## 📁 Estructura del Proyecto

```
HOTEL ELEFANTE/
├── prisma/
│   ├── schema.prisma       # Esquema de base de datos
│   └── seed.ts            # Datos iniciales
├── public/
│   └── Imagenes del hotel/ # Imágenes locales
├── src/
│   ├── app/               # Páginas y API routes
│   │   ├── api/          # Endpoints REST
│   │   ├── admin/        # Panel administrador
│   │   ├── operador/     # Panel operador
│   │   └── ...
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes shadcn/ui
│   │   └── layout/       # Navbar, Footer
│   └── lib/              # Utilidades y configuración
└── package.json
```

## 🚀 Scripts

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm start            # Servidor producción
npm run lint         # Linter
npx prisma studio    # GUI base de datos
```

## 🌐 Deploy

### Vercel
1. Push a GitHub
2. Importar en Vercel
3. Configurar variables de entorno
4. Deploy automático

### Variables requeridas en producción:
- DATABASE_URL
- NEXTAUTH_URL
- NEXTAUTH_SECRET  
- MP_ACCESS_TOKEN
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

## 📊 Funcionalidades Principales

### APIs Implementadas
1. **Autenticación**: Login/Register con NextAuth
2. **Habitaciones**: CRUD completo + disponibilidad
3. **Reservas**: Crear, listar, cambiar estado
4. **Pagos**: Integración Mercado Pago
5. **Contacto**: Formulario + envío email
6. **Operadores**: CRUD (solo admin)
7. **Analíticas**: KPIs y gráficos

### Reglas de Negocio
- No reservar si habitación está CLOSED o en mantenimiento
- No overbooking: validar solapamiento de fechas
- Liberar reserva → estado CLEANING → AVAILABLE
- Pago aprobado → reserva CONFIRMED
- Check-out → habitación a CLEANING

## 📸 Capturas

Ver carpeta `/docs/screenshots` (incluir capturas de):
- Home
- Listado habitaciones
- Mapa operador
- Panel admin
- Gráficos analíticas

## 📝 Notas

- Imágenes exclusivamente de `/public/Imagenes del hotel/`
- Base de datos: SQL Server (no MongoDB)
- Zona horaria: America/Argentina/Salta
- Mercado Pago en modo sandbox por defecto

## 🤝 Créditos

Proyecto académico desarrollado para cátedra de Desarrollo Web.
Hotel Elefante - San Lorenzo, Salta, Argentina.

## 📄 Licencia

MIT
