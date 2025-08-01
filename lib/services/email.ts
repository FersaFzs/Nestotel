import nodemailer from 'nodemailer';

// Configuración del transportador de email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar a otro servicio
  auth: {
    user: process.env['EMAIL_USER'] || 'granadainn.demo@gmail.com',
    pass: process.env['EMAIL_PASS'] || 'tu_app_password',
  },
});

export interface ReservationEmailData {
  reservationId: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  hotelEmail: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Template para email de confirmación de reserva
export function createReservationConfirmationEmail(data: ReservationEmailData): EmailTemplate {
  const {
    reservationId,
    guestName,
    guestEmail,
    roomName,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    hotelName,
    hotelAddress,
    hotelPhone,
    hotelEmail,
  } = data;

  const subject = `✅ Confirmación de Reserva - ${hotelName}`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Reserva</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #C9A86B;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .hotel-name {
          font-size: 28px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #7f8c8d;
          font-size: 16px;
        }
        .confirmation-badge {
          background-color: #27ae60;
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          display: inline-block;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .reservation-details {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
          border-bottom: none;
          font-weight: bold;
          font-size: 18px;
          color: #C9A86B;
        }
        .label {
          font-weight: 600;
          color: #495057;
        }
        .value {
          color: #6c757d;
        }
        .important-note {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
        }
        .contact-info {
          background-color: #e8f4fd;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          color: #6c757d;
          font-size: 14px;
        }
        .demo-notice {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="hotel-name">${hotelName}</div>
          <div class="subtitle">Tu reserva ha sido confirmada</div>
        </div>

        <div style="text-align: center;">
          <div class="confirmation-badge">✅ RESERVA CONFIRMADA</div>
        </div>

        <div class="demo-notice">
          <strong>🏨 NOTA IMPORTANTE:</strong><br>
          Esta es una reserva <strong>DEMO/FICTICIA</strong> en Granada Inn, un hotel ficticio creado únicamente con fines demostrativos. 
          No se realizará ningún cargo ni se procesará realmente esta reserva.
        </div>

        <div class="reservation-details">
          <h3 style="margin-top: 0; color: #2c3e50;">Detalles de tu reserva</h3>
          
          <div class="detail-row">
            <span class="label">Número de reserva:</span>
            <span class="value">#${reservationId}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Nombre:</span>
            <span class="value">${guestName}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">${guestEmail}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Habitación:</span>
            <span class="value">${roomName}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Fecha de llegada:</span>
            <span class="value">${new Date(checkIn).toLocaleDateString('es-ES')}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Fecha de salida:</span>
            <span class="value">${new Date(checkOut).toLocaleDateString('es-ES')}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Huéspedes:</span>
            <span class="value">${guests} ${guests === 1 ? 'persona' : 'personas'}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Precio total:</span>
            <span class="value">${totalPrice}€</span>
          </div>
        </div>

        <div class="contact-info">
          <h4 style="margin-top: 0; color: #2c3e50;">Información del hotel</h4>
          <p><strong>Dirección:</strong> ${hotelAddress}</p>
          <p><strong>Teléfono:</strong> ${hotelPhone}</p>
          <p><strong>Email:</strong> ${hotelEmail}</p>
        </div>

        <div class="important-note">
          <h4 style="margin-top: 0; color: #856404;">Información importante</h4>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Check-in: 15:00h</li>
            <li>Check-out: 11:00h</li>
            <li>WiFi gratuito disponible</li>
            <li>Estacionamiento gratuito</li>
            <li>Desayuno incluido</li>
          </ul>
        </div>

        <div class="footer">
          <p>Gracias por elegir ${hotelName}</p>
          <p>¡Esperamos tu visita!</p>
          <p style="font-size: 12px; color: #999;">
            Este es un prototipo demostrativo. Granada Inn es un hotel ficticio.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
CONFIRMACIÓN DE RESERVA - ${hotelName}

✅ RESERVA CONFIRMADA

🏨 NOTA IMPORTANTE: Esta es una reserva DEMO/FICTICIA en Granada Inn, un hotel ficticio creado únicamente con fines demostrativos. No se realizará ningún cargo ni se procesará realmente esta reserva.

DETALLES DE TU RESERVA:
- Número de reserva: #${reservationId}
- Nombre: ${guestName}
- Email: ${guestEmail}
- Habitación: ${roomName}
- Fecha de llegada: ${new Date(checkIn).toLocaleDateString('es-ES')}
- Fecha de salida: ${new Date(checkOut).toLocaleDateString('es-ES')}
- Huéspedes: ${guests} ${guests === 1 ? 'persona' : 'personas'}
- Precio total: ${totalPrice}€

INFORMACIÓN DEL HOTEL:
- Dirección: ${hotelAddress}
- Teléfono: ${hotelPhone}
- Email: ${hotelEmail}

INFORMACIÓN IMPORTANTE:
- Check-in: 15:00h
- Check-out: 11:00h
- WiFi gratuito disponible
- Estacionamiento gratuito
- Desayuno incluido

Gracias por elegir ${hotelName}
¡Esperamos tu visita!

---
Este es un prototipo demostrativo. Granada Inn es un hotel ficticio.
  `;

  return { subject, html, text };
}

// Función para enviar email de confirmación
export async function sendReservationConfirmationEmail(
  data: ReservationEmailData,
): Promise<boolean> {
  try {
    const emailTemplate = createReservationConfirmationEmail(data);

    const mailOptions = {
      from: `"${data.hotelName}" <${process.env['EMAIL_USER'] || 'granadainn.demo@gmail.com'}>`,
      to: data.guestEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    await transporter.sendMail(mailOptions);
    // Email enviado exitosamente
    return true;
  } catch (error) {
    // Error enviando email - manejado silenciosamente en producción
    return false;
  }
}

// Función para enviar email de cancelación
export async function sendReservationCancellationEmail(
  data: ReservationEmailData,
): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"${data.hotelName}" <${process.env['EMAIL_USER'] || 'granadainn.demo@gmail.com'}>`,
      to: data.guestEmail,
      subject: `❌ Cancelación de Reserva - ${data.hotelName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">❌ Reserva Cancelada</h2>
          <p>Hola ${data.guestName},</p>
          <p>Tu reserva #${data.reservationId} ha sido cancelada exitosamente.</p>
          <p><strong>Detalles de la reserva cancelada:</strong></p>
          <ul>
            <li>Habitación: ${data.roomName}</li>
            <li>Fechas: ${new Date(data.checkIn).toLocaleDateString('es-ES')} - ${new Date(data.checkOut).toLocaleDateString('es-ES')}</li>
            <li>Huéspedes: ${data.guests}</li>
          </ul>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p>Gracias,<br>${data.hotelName}</p>
          <hr>
          <p style="font-size: 12px; color: #999;">Este es un prototipo demostrativo. Granada Inn es un hotel ficticio.</p>
        </div>
      `,
      text: `
CANCELACIÓN DE RESERVA - ${data.hotelName}

❌ Reserva Cancelada

Hola ${data.guestName},

Tu reserva #${data.reservationId} ha sido cancelada exitosamente.

Detalles de la reserva cancelada:
- Habitación: ${data.roomName}
- Fechas: ${new Date(data.checkIn).toLocaleDateString('es-ES')} - ${new Date(data.checkOut).toLocaleDateString('es-ES')}
- Huéspedes: ${data.guests}

Si tienes alguna pregunta, no dudes en contactarnos.

Gracias,
${data.hotelName}

---
Este es un prototipo demostrativo. Granada Inn es un hotel ficticio.
      `,
    };

    await transporter.sendMail(mailOptions);
    // Email de cancelación enviado exitosamente
    return true;
  } catch (error) {
    // Error enviando email de cancelación - manejado silenciosamente en producción
    return false;
  }
}
