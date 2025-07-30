# 📧 Configuración del Sistema de Emails

## 🎯 Descripción

El sistema de emails de Granada Inn envía confirmaciones automáticas cuando se
crean reservas. Los emails incluyen todos los detalles de la reserva y una nota
clara de que es un prototipo demostrativo.

## ⚙️ Configuración

### 1. Variables de Entorno

Añade estas variables a tu archivo `.env.local`:

```bash
# Email (Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail
```

### 2. Configuración de Gmail

Para usar Gmail como servidor SMTP:

1. **Habilita la verificación en dos pasos** en tu cuenta de Google
2. **Genera una contraseña de aplicación**:
   - Ve a
     [Configuración de seguridad de Google](https://myaccount.google.com/security)
   - Busca "Contraseñas de aplicación"
   - Genera una nueva contraseña para "Correo"
   - Usa esta contraseña como `EMAIL_PASS`

### 3. Alternativas de Servicio

Puedes cambiar el servicio en `lib/services/email.ts`:

```typescript
// Para Outlook/Hotmail
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Para otros servicios SMTP
const transporter = nodemailer.createTransporter({
  host: 'smtp.tuservicio.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## 🧪 Prueba del Sistema

### 1. Botón de Prueba

En la página de reservas (`/reservas`), hay un botón azul "Probar Email de
Confirmación" que envía un email de prueba a tu dirección registrada.

### 2. API de Prueba

También puedes probar directamente la API:

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "tu_email@ejemplo.com"}'
```

## 📧 Tipos de Emails

### 1. Confirmación de Reserva

- **Cuándo se envía**: Al crear una nueva reserva
- **Contenido**: Detalles completos de la reserva, información del hotel, nota
  de prototipo
- **Diseño**: HTML profesional con estilos CSS inline

### 2. Cancelación de Reserva

- **Cuándo se envía**: Al cancelar una reserva (funcionalidad futura)
- **Contenido**: Confirmación de cancelación y detalles de la reserva cancelada

## 🎨 Personalización

### 1. Plantillas de Email

Las plantillas están en `lib/services/email.ts`. Puedes modificar:

- **Estilos CSS**: Cambia los colores, fuentes, espaciado
- **Contenido**: Ajusta el texto, información del hotel
- **Estructura**: Modifica las secciones y layout

### 2. Información del Hotel

Cambia los datos del hotel en `app/api/reservations/route.ts`:

```typescript
const emailData = {
  // ... otros campos
  hotelName: 'Tu Hotel',
  hotelAddress: 'Tu Dirección',
  hotelPhone: 'Tu Teléfono',
  hotelEmail: 'tu@email.com',
};
```

## 🔧 Solución de Problemas

### Error: "Invalid login"

- Verifica que `EMAIL_USER` y `EMAIL_PASS` estén correctos
- Asegúrate de usar una contraseña de aplicación, no tu contraseña normal
- Habilita la verificación en dos pasos

### Error: "Connection timeout"

- Verifica tu conexión a internet
- Comprueba que el puerto 587 no esté bloqueado
- Prueba con otro servicio de email

### Emails no llegan

- Revisa la carpeta de spam
- Verifica que la dirección de destino sea correcta
- Comprueba los logs del servidor

## 📝 Notas Importantes

### 1. Prototipo Demostrativo

Todos los emails incluyen una nota clara de que Granada Inn es un hotel ficticio
y que las reservas son demostrativas.

### 2. Envío Asíncrono

Los emails se envían de forma asíncrona para no bloquear la respuesta de la API.
Si falla el envío, no afecta la creación de la reserva.

### 3. Logs

Los errores de envío se registran en la consola del servidor para debugging.

## 🚀 Producción

Para un entorno de producción:

1. **Usa un servicio de email profesional** como SendGrid, Mailgun o Amazon SES
2. **Configura SPF, DKIM y DMARC** para mejorar la entregabilidad
3. **Implementa reintentos** para emails fallidos
4. **Añade monitoreo** para detectar problemas de envío
5. **Considera usar una cola de trabajos** como Bull o Agenda para emails
   masivos

## 📚 Recursos Adicionales

- [Documentación de Nodemailer](https://nodemailer.com/)
- [Configuración de Gmail SMTP](https://support.google.com/mail/answer/7126229)
- [Mejores prácticas de email](https://www.emailjs.com/docs/best-practices/)
