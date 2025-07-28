import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';
import Room from '../../../lib/db/models/Room';

export async function GET(request: NextRequest) {
  try {
    console.log('Attempting to connect to database...');
    await dbConnect();
    console.log('Connected to database successfully');

    console.log('Fetching rooms...');
    const rooms = await Room.find({ isActive: { $ne: false } }).sort({ price: 1 });
    console.log('Found rooms:', rooms.length);

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      {
        message: 'Error al obtener las habitaciones',
        error: error instanceof Error ? error.message : 'Error desconocido',
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
    console.error('Error creating room:', error);
    return NextResponse.json({ message: 'Error al crear la habitación' }, { status: 500 });
  }
}
