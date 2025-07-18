import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';
import Reservation from '../../../lib/db/models/Reservation';
import { reservationSchema } from '../../../lib/validators/reservation';

// Listar reservas (GET)
export async function GET() {
  await dbConnect();
  const reservations = await Reservation.find().populate('room').select('-__v');
  return NextResponse.json(reservations);
}

// Crear reserva (POST)
export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const parse = reservationSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }
  try {
    const reservation = await Reservation.create(parse.data);
    return NextResponse.json(reservation, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
