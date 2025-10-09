# 📧 Configuración del Sistema de Emails - Hotel Elefante

## 🎯 Funcionalidades Implementadas

El sistema de emails automáticos incluye:

### ✅ Emails de Reservas
- **Confirmación de reserva**: Se envía automáticamente cuando se crea una nueva reserva
- **Cambios de estado**: Notifica cuando cambia el estado de la reserva (confirmada, cancelada, check-in, check-out)
- **Templates profesionales**: Emails con diseño responsive y branding del hotel

### ✅ Sistema de Promociones
- **Envío masivo**: Envía promociones a diferentes audiencias
- **Segmentación**: Todos los usuarios, clientes activos, clientes VIP
- **Interfaz de admin**: Panel completo para crear y gestionar promociones
- **Historial**: Seguimiento de todas las promociones enviadas

### ✅ Emails de Contacto
- **Notificación al hotel**: Cuando llega un nuevo mensaje de contacto
- **Respuestas automáticas**: Los operadores pueden responder desde el panel

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
# Configuración de Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASS="tu-password-de-aplicacion"

# Configuración adicional de emails
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-password-de-aplicacion"
SMTP_FROM="Hotel Elefante <tu-email@gmail.com>"
HOTEL_EMAIL="info@hotelelefante.com"
```

### 2. Configuración con Gmail

#### Opción A: Usar Gmail SMTP (Recomendado para desarrollo)

1. **Habilitar autenticación de 2 factores** en tu cuenta de Gmail
2. **Generar contraseña de aplicación**:
   - Ve a [Configuración de Google](https://myaccount.google.com/security)
   - Busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo"
   - Usa esta contraseña en `EMAIL_PASS` y `SMTP_PASS`

#### Opción B: Usar Resend (Recomendado para producción)

```bash
# Instalar Resend
npm install resend

# Variables de entorno
RESEND_API_KEY="re_xxxxxxxxx"
```

### 3. Migración de Base de Datos

Ejecuta la migración para agregar la tabla de promociones:

```bash
npx prisma migrate dev --name add-promotions
npx prisma generate
```

## 🚀 Uso del Sistema

### Para Administradores

1. **Acceder al panel de promociones**:
   - Ve a `/admin/promociones`
   - Crea nuevas promociones con contenido personalizado
   - Selecciona la audiencia objetivo

2. **Tipos de audiencia**:
   - **Todos los usuarios**: Todos los registrados
   - **Clientes activos**: Usuarios con al menos una reserva
   - **Clientes VIP**: Usuarios con 3+ reservas o gastos >$50,000

### Para Operadores

1. **Responder consultas**:
   - Ve a `/operador/mensajes`
   - Responde a los mensajes de contacto
   - Se envía automáticamente un email al cliente

### Automático

- **Reservas**: Los emails se envían automáticamente sin intervención
- **Estados**: Cada cambio de estado notifica al cliente
- **Contacto**: Cada mensaje nuevo notifica al hotel

## 📧 Templates de Email

### Características de los Templates

- **Diseño responsive**: Se ve bien en móviles y desktop
- **Branding consistente**: Logo y colores del hotel
- **Información completa**: Todos los detalles de la reserva
- **Call-to-actions**: Botones para acciones importantes

### Tipos de Email

1. **Confirmación de Reserva**:
   - Detalles completos de la reserva
   - Información de check-in/check-out
   - Código de reserva

2. **Cambio de Estado**:
   - Notificación del nuevo estado
   - Información relevante según el estado
   - Instrucciones si es necesario

3. **Promociones**:
   - Contenido personalizable
   - Imágenes opcionales
   - Botones de call-to-action
   - Segmentación por audiencia

## 🔍 Monitoreo y Logs

### Logs del Sistema

Los emails se registran en la consola con información de:
- Destinatario
- Estado del envío (éxito/error)
- Timestamp

### Base de Datos

Las promociones se guardan con:
- Contenido completo
- Estadísticas de envío
- Errores si los hay
- Historial completo

## 🛠️ Solución de Problemas

### Error: "Authentication failed"

**Causa**: Credenciales incorrectas o autenticación de 2 factores no configurada.

**Solución**:
1. Verifica que las credenciales sean correctas
2. Usa contraseña de aplicación si tienes 2FA
3. Habilita "Acceso de aplicaciones menos seguras" (no recomendado)

### Error: "Connection timeout"

**Causa**: Problemas de conectividad o configuración de puerto.

**Solución**:
1. Verifica la configuración del puerto (587 para STARTTLS)
2. Comprueba la conexión a internet
3. Revisa si hay firewalls bloqueando

### Emails no se envían

**Causa**: Errores en el código o configuración.

**Solución**:
1. Revisa los logs en la consola
2. Verifica las variables de entorno
3. Prueba la conexión SMTP manualmente

## 📈 Métricas y Analíticas

### Promociones

- **Tasa de envío**: Emails enviados vs. total de destinatarios
- **Errores**: Número de emails que fallaron
- **Segmentación**: Distribución por tipo de audiencia

### Reservas

- **Confirmaciones**: Emails de confirmación enviados
- **Actualizaciones**: Notificaciones de cambio de estado
- **Tasa de éxito**: Porcentaje de emails entregados

## 🔐 Seguridad y Privacidad

### Buenas Prácticas

1. **No hardcodear credenciales**: Usa siempre variables de entorno
2. **Contraseñas de aplicación**: Para Gmail, usa contraseñas específicas
3. **Rate limiting**: El sistema incluye pausas entre lotes de envío
4. **Opt-out**: Los emails de promoción incluyen opción de darse de baja

### Cumplimiento

- **GDPR**: Los usuarios pueden solicitar eliminación de datos
- **CAN-SPAM**: Emails incluyen información de contacto y opt-out
- **Datos mínimos**: Solo se almacena información necesaria

## 🚀 Próximas Mejoras

### Funcionalidades Planificadas

1. **Recordatorios automáticos**: Email 24h antes del check-in
2. **Encuestas post-estadía**: Feedback automático después del check-out
3. **Ofertas personalizadas**: Promociones basadas en historial
4. **Templates personalizables**: Editor visual de emails
5. **A/B Testing**: Pruebas de diferentes versiones de emails

### Integraciones Futuras

- **SendGrid**: Para mayor volumen de emails
- **Mailchimp**: Para campañas de marketing avanzadas
- **WhatsApp Business**: Notificaciones por WhatsApp
- **SMS**: Notificaciones por mensaje de texto

---

## 📞 Soporte

Si tienes problemas con la configuración de emails:

1. Revisa este documento
2. Consulta los logs del sistema
3. Verifica las variables de entorno
4. Prueba con una cuenta de email diferente

**¡El sistema de emails está listo para usar!** 🎉
