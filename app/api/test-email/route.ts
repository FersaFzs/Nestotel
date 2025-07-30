import { NextResponse } from 'next/server';
import { sendReservationConfirmationEmail } from '../../../lib/services/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    // Datos de prueba para el email
    const testEmailData = {
      reservationId: 'DEMO-123456',
      guestName: 'Usuario Demo',
      guestEmail: email,
      roomName: 'Suite Premium',
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días después
      guests: 2,
      totalPrice: 240,
      hotelName: 'Granada Inn',
      hotelAddress: 'Calle Granada 123, 18001 Granada, España',
      hotelPhone: '+34 958 123 456',
      hotelEmail: 'info@granadainn.com',
    };

    const success = await sendReservationConfirmationEmail(testEmailData);
    
    if (success) {
      return NextResponse.json({ 
        message: 'Email de prueba enviado correctamente',
        email: email 
      });
    } else {
      return NextResponse.json({ 
        error: 'Error enviando email' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en test-email:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
} 