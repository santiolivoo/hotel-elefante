# 🚀 Guía de Deploy - Hotel Elefante

## Paso 1: Subir a GitHub

### 1.1 Inicializar Git
```bash
git init
git add .
git commit -m "Initial commit: Hotel Elefante"
```

### 1.2 Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Crea un repositorio nuevo: `hotel-elefante` 
3. NO inicialices con README

### 1.3 Conectar y subir
```bash
git remote add origin https://github.com/TU-USUARIO/hotel-elefante.git
git branch -M main
git push -u origin main
```

## Paso 2: Deploy en Vercel

### 2.1 Importar proyecto
1. Ve a https://vercel.com
2. Sign up with GitHub
3. Click "Add New... → Project"
4. Selecciona `hotel-elefante` 

### 2.2 Configurar Variables de Entorno

**Obligatorias:**
- `DATABASE_URL` : Connection string de SQL Server en producción
- `NEXTAUTH_URL` : `https://tu-proyecto.vercel.app` 
- `NEXTAUTH_SECRET` : Genera con `openssl rand -base64 32` 

**Opcionales:**
- `MERCADOPAGO_ACCESS_TOKEN` 
- `MERCADOPAGO_PUBLIC_KEY` 
- `EMAIL_HOST` , `EMAIL_PORT` , `EMAIL_USER` , `EMAIL_PASS` 

### 2.3 Deploy
Click en "Deploy" y espera 2-3 minutos.

## Paso 3: Base de Datos en Producción

### Opción: Azure SQL Database
1. Crea cuenta en https://portal.azure.com
2. Crea SQL Database → Basic tier
3. Obtén connection string
4. Actualiza `DATABASE_URL`  en Vercel
5. Ejecuta migraciones:
   ```bash
   DATABASE_URL="tu-azure-url" npx prisma migrate deploy
   DATABASE_URL="tu-azure-url" npx prisma db seed
   ```

## Verificar Deploy
- Home: `https://tu-proyecto.vercel.app` 
- Login: `https://tu-proyecto.vercel.app/login` 
- Admin: `https://tu-proyecto.vercel.app/admin` 

## Actualizaciones
```bash
git add .
git commit -m "Update"
git push
```
Vercel redeploy automáticamente.
