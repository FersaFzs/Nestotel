import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongoose';
import Room from '../../../../lib/db/models/Room';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const room = await Room.findById(params.id);

    if (!room) {
      return NextResponse.json(
        { message: 'Habitación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(room);
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // Error fetching room - handled silently in production
    }
    
    return NextResponse.json(
      {
        message: 'Error al obtener la habitación',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Error desconocido' : 'Internal server error',
      },
      { status: 500 },
    );
  }
} 