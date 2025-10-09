# 🏗️ Arquitectura del Sistema - Hotel Elefante

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 14)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Páginas    │  │ Componentes  │  │   Layouts    │         │
│  │   Públicas   │  │   UI (15+)   │  │  & Navbar    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Panel     │  │    Panel     │  │   Auth UI    │         │
│  │   Operador   │  │    Admin     │  │ Login/Signup │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Next.js API Routes)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Authentication Middleware                   │   │
│  │  (NextAuth.js - JWT Strategy - Role-Based Access)       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Auth API   │  │   Rooms API  │  │ Reservations │         │
│  │ /api/auth/*  │  │  /api/rooms  │  │     API      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Contact API │  │  Admin APIs  │  │ Analytics API│         │
│  │ /api/contact │  │  /api/admin  │  │ /api/admin/  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Prisma ORM
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS (SQL Server)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   User   │  │   Room   │  │Reservation│ │ Payment  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Operator │  │ RoomType │  │ Amenity  │  │Maintenance│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ Contact  │  │  Reply   │  │RoomAmenity│                     │
│  │ Message  │  │          │  │           │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

                           │
                           │ Integraciones
                           ▼

┌─────────────────────┐        ┌─────────────────────┐
│   Mercado Pago API  │        │   Nodemailer SMTP   │
│  (Pagos & Webhook)  │        │  (Envío de Emails)  │
└─────────────────────┘        └─────────────────────┘
```

## 🔐 Flujo de Autenticación

```
Usuario → Login Form → NextAuth → Prisma → SQL Server
                          │
                          ├→ Genera JWT Token
                          ├→ Session con User + Role
                          └→ Guarda en Cookie

Middleware verifica JWT en rutas protegidas:
  - /operador/* → requiere OPERATOR o ADMIN
  - /admin/*    → requiere ADMIN
  - /reservar   → requiere autenticación
```

## 🏠 Flujo de Reserva

```
1. Usuario selecciona habitación
   └→ GET /api/rooms

2. Elige fechas (check-in, check-out)
   └→ GET /api/rooms/[id]/availability
   └→ Valida conflictos y mantenimientos

3. Crea reserva
   └→ POST /api/reservations
   └→ Estado: PENDING_PAYMENT

4. Procesa pago
   └→ POST /api/payments/mercadopago/create-preference
   └→ Redirige a Mercado Pago

5. Usuario paga en MP
   └→ Webhook: POST /api/payments/mercadopago/webhook
   └→ Actualiza Payment + Reservation
   └→ Estado: CONFIRMED
   └→ Habitación: OCCUPIED
```

## 🗺️ Flujo del Operador - Gestión de Habitaciones

```
MAPA (/operador/mapa)
  │
  ├─ Ver todas las habitaciones
  │  └→ GET /api/rooms
  │
  ├─ Cerrar habitación
  │  └→ POST /api/rooms/[id]/close
  │  └→ Crea Maintenance
  │  └→ Status → CLOSED
  │
  └─ Abrir habitación
     └→ POST /api/rooms/[id]/open
     └→ Desactiva Maintenance
     └→ Status → AVAILABLE
```

## 👨‍💼 Flujo del Administrador

```
HABITACIONES (/admin/habitaciones)
  │
  ├─ Listar → GET /api/rooms
  ├─ Crear → POST /api/rooms
  ├─ Editar → PATCH /api/rooms/[id]
  └─ Eliminar → DELETE /api/rooms/[id]

OPERADORES (/admin/operadores)
  │
  ├─ Listar → GET /api/admin/operators
  ├─ Crear → POST /api/admin/operators
  ├─ Editar → PATCH /api/admin/operators/[id]
  └─ Eliminar → DELETE /api/admin/operators/[id]

ANALÍTICAS (/admin/analiticas)
  │
  └─ Obtener KPIs → GET /api/admin/analytics
     └→ Queries SQL complejas
     └→ Cálculos de métricas
     └→ Retorna JSON con gráficos
```

## 📊 Modelo de Datos Simplificado

```
User (1) ──── (0..1) Operator
  │
  │ (1)
  │
  ▼ (N)
Reservation ──── (1..1) Payment
  │
  │ (N)
  │
  ▼ (1)
Room ──── (N..M) ──── Amenity
  │
  │ (1)
  │
  ▼ (N)
RoomType

Room ──── (0..N) Maintenance

ContactMessage ──── (0..N) Reply
```

## 🛡️ Capas de Seguridad

```
1. AUTENTICACIÓN
   └─ NextAuth con credenciales
   └─ Passwords hasheados (bcrypt)
   └─ JWT tokens

2. AUTORIZACIÓN
   └─ Middleware protege rutas
   └─ Verificación de roles en APIs
   └─ RBAC (Role-Based Access Control)

3. VALIDACIÓN
   └─ Zod schemas en servidor
   └─ React Hook Form en cliente
   └─ Validaciones de negocio

4. BASE DE DATOS
   └─ Prisma ORM (previene SQL injection)
   └─ Relaciones con cascada
   └─ Constraints y validaciones
```

## 🚀 Stack de Tecnologías

```
┌────────────────────────────────┐
│         PRESENTACIÓN           │
│  Next.js 14 + React + TS       │
│  Tailwind CSS + shadcn/ui      │
└────────────────────────────────┘
              │
┌────────────────────────────────┐
│           LÓGICA               │
│  Next.js API Routes            │
│  NextAuth.js                   │
│  Zod Validation                │
└────────────────────────────────┘
              │
┌────────────────────────────────┐
│           DATOS                │
│  Prisma ORM                    │
│  SQL Server                    │
└────────────────────────────────┘
              │
┌────────────────────────────────┐
│        INTEGRACIONES           │
│  Mercado Pago + Nodemailer     │
└────────────────────────────────┘
```

## 📁 Estructura de Carpetas

```
hotel-elefante/
│
├── prisma/
│   ├── schema.prisma          # Esquema de BD
│   └── seed.ts                # Datos iniciales
│
├── public/
│   └── Imagenes del hotel/    # 16 imágenes locales
│
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── (pages)/          # Páginas públicas
│   │   ├── operador/         # Panel operador
│   │   ├── admin/            # Panel admin
│   │   ├── api/              # API Routes
│   │   ├── layout.tsx        # Layout raíz
│   │   └── page.tsx          # Home
│   │
│   ├── components/
│   │   ├── ui/               # Componentes shadcn
│   │   ├── layout/           # Navbar, Footer
│   │   └── providers/        # Providers (Session)
│   │
│   ├── lib/
│   │   ├── prisma.ts         # Cliente Prisma
│   │   ├── auth.ts           # Config NextAuth
│   │   └── utils.ts          # Utilidades
│   │
│   └── types/
│       └── next-auth.d.ts    # Tipos personalizados
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🔄 Ciclo de Vida de una Request

```
1. Request llega a Next.js
   └→ Middleware verifica autenticación

2. Enruta a la página o API
   └→ Server Component o API Route

3. API Route ejecuta lógica
   └→ Valida con Zod
   └→ Verifica permisos
   └→ Consulta Prisma

4. Prisma consulta SQL Server
   └→ Ejecuta query
   └→ Retorna resultados

5. API procesa y responde
   └→ Formatea respuesta
   └→ Status codes HTTP

6. Frontend recibe respuesta
   └→ Actualiza UI
   └→ Muestra feedback
```

## 📈 Escalabilidad

### Actual (MVP)
- **Frontend**: Next.js SSR + CSR
- **Backend**: API Routes en misma app
- **BD**: SQL Server single instance

### Futura (Producción)
```
┌──────────────┐
│   Vercel     │ → Frontend + API
│   (Edge)     │
└──────────────┘
       │
       ▼
┌──────────────┐
│   Azure      │ → SQL Server
│  (Managed)   │
└──────────────┘
```

### Optimizaciones Posibles
- ✅ ISR (Incremental Static Regeneration) para páginas
- ✅ Caché de consultas frecuentes (Redis)
- ✅ CDN para imágenes
- ✅ Database pooling con Prisma
- ✅ Rate limiting en APIs
- ✅ Logging y monitoring (Sentry)

---

## 🎯 Decisiones de Arquitectura

### ¿Por qué Next.js?
- ✅ SSR + CSR híbrido
- ✅ API Routes integradas
- ✅ File-based routing
- ✅ Optimizaciones automáticas
- ✅ Deploy fácil (Vercel)

### ¿Por qué Prisma?
- ✅ Type-safe
- ✅ Migraciones automáticas
- ✅ Previene SQL injection
- ✅ Soporte SQL Server
- ✅ Developer experience

### ¿Por qué SQL Server?
- ✅ Requisito de la cátedra
- ✅ Transacciones ACID
- ✅ Relaciones complejas
- ✅ Queries avanzadas
- ✅ Herramientas robustas

### ¿Por qué NextAuth?
- ✅ Integración perfecta Next.js
- ✅ Múltiples providers
- ✅ JWT + Session
- ✅ Middleware integrado
- ✅ TypeScript support

---

✅ **Arquitectura sólida, escalable y mantenible**
