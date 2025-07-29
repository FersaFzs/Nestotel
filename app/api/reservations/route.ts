import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';
import Reservation from '../../../lib/db/models/Reservation';
import { reservationSchema } from '../../../lib/validators/reservation';

// Listar reservas (GET)
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = searchParams.get('limit');

    // Construir filtros
    const filter: any = {};

    if (userId) {
      filter.userId = userId;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { 'guestInfo.firstName': { $regex: search, $options: 'i' } },
        { 'guestInfo.lastName': { $regex: search, $options: 'i' } },
        { 'guestInfo.phone': { $regex: search, $options: 'i' } },
        { 'guestInfo.email': { $regex: search, $options: 'i' } },
        { 'guestInfo.dni': { $regex: search, $options: 'i' } },
      ];
    }

    // Construir ordenamiento
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Construir query
    let query = Reservation.find(filter)
      .populate('roomId', 'name type price')
      .sort(sort)
      .select('-__v');

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const reservations = await query;

    // Transform the response to match frontend expectations
    const transformedReservations = reservations.map(reservation => {
      const reservationObj = reservation.toObject();
      return {
        ...reservationObj,
        room: reservationObj.roomId,
      };
    });

    return NextResponse.json(transformedReservations);
  } catch (error) {
    // Error fetching reservations - handled silently in production
    return NextResponse.json({ message: 'Error al obtener las reservas' }, { status: 500 });
  }
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
