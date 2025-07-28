import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';
import Room from '../../../lib/db/models/Room';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const rooms = await Room.find({ isActive: { $ne: false } }).sort({ price: 1 });

    return NextResponse.json(rooms);
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching rooms:', error);
    }
    
    return NextResponse.json(
      {
        message: 'Error al obtener las habitaciones',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Error desconocido' : 'Internal server error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const roomData = await request.json();
    const room = new Room(roomData);
    await room.save();

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating room:', error);
    }
    
    return NextResponse.json(
      { 
        message: 'Error al crear la habitación',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Error desconocido' : 'Internal server error'
      }, 
      { status: 500 }
    );
  }
}
