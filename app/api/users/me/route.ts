import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Versión temporal sin Firebase Admin para pruebas
    return NextResponse.json({
      message: 'Endpoint temporal - Firebase Admin no configurado',
      status: 'temporary',
      user: {
        id: 'temp-user-id',
        email: 'admin@example.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'Temporal'
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { message: 'Error al obtener datos del usuario' },
      { status: 500 }
    );
  }
} 