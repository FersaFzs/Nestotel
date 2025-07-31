import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongoose';
import Reservation from '../../../../lib/db/models/Reservation';

// Obtener reserva por ID (GET)
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const reservation = await Reservation.findById(params.id)
      .populate('roomId', 'name type price description amenities maxGuests images')
      .select('-__v');

    if (!reservation) {
      return NextResponse.json({ message: 'Reserva no encontrada' }, { status: 404 });
    }

    // Transform the response to match frontend expectations
    const reservationObj = reservation.toObject();
    const transformedReservation = {
      ...reservationObj,
      room: reservationObj.roomId,
    };

    return NextResponse.json(transformedReservation);
  } catch (error) {
    // Error fetching reservation - handled silently in production
    return NextResponse.json({ message: 'Error al obtener la reserva' }, { status: 500 });
  }
}

// Actualizar reserva (PATCH)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const data = await request.json();

    // Validar que la reserva existe
    const existingReservation = await Reservation.findById(params.id);
    if (!existingReservation) {
      return NextResponse.json({ message: 'Reserva no encontrada' }, { status: 404 });
    }

    // Actualizar solo los campos permitidos
    const allowedFields = ['status', 'paymentStatus', 'adminNotes'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('roomId', 'name type price');

    if (!updatedReservation) {
      return NextResponse.json({ message: 'Error al actualizar la reserva' }, { status: 500 });
    }

    // Transform the response
    const reservationObj = updatedReservation.toObject();
    const transformedReservation = {
      ...reservationObj,
      room: reservationObj.roomId,
    };

    return NextResponse.json(transformedReservation);
  } catch (error) {
    // Error updating reservation - handled silently in production
    return NextResponse.json({ message: 'Error al actualizar la reserva' }, { status: 500 });
  }
}

// Eliminar reserva (DELETE)
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const reservation = await Reservation.findByIdAndDelete(params.id);

    if (!reservation) {
      return NextResponse.json({ message: 'Reserva no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    // Error deleting reservation - handled silently in production
    return NextResponse.json({ message: 'Error al eliminar la reserva' }, { status: 500 });
  }
}
