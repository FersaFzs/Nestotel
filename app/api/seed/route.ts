import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';
import Room from '../../../lib/db/models/Room';

export async function POST() {
  try {
    await dbConnect();

    // Verificar si ya existen habitaciones
    const existingRooms = await Room.countDocuments();
    if (existingRooms > 0) {
      return NextResponse.json({ message: 'Las habitaciones ya existen' });
    }

    // Crear las 2 habitaciones del landing page
    const sampleRooms = [
      {
        name: 'Suite Premium',
        number: '101',
        type: 'Suite Premium',
        description:
          'Nuestra suite más exclusiva con terraza privada y bañera hidromasaje. Perfecta para una experiencia de lujo inolvidable en Granada.',
        price: 120,
        maxGuests: 4,
        amenities: [
          'WiFi gratis',
          'TV 4K',
          'Minibar',
          'Terraza privada',
          'Bañera hidromasaje',
          'Aire acondicionado',
          'Secador de pelo',
          'Servicio de habitaciones',
        ],
        images: ['/images/habitacion.jpeg'],
        status: 'free',
        floor: 1,
        isActive: true,
      },
      {
        name: 'Habitación Deluxe',
        number: '102',
        type: 'Deluxe',
        description:
          'Habitación elegante con desayuno incluido y baño privado. Ideal para parejas que buscan comodidad y un servicio excepcional.',
        price: 80,
        maxGuests: 3,
        amenities: [
          'WiFi gratis',
          'TV Smart',
          'Aire acondicionado',
          'Desayuno incluido',
          'Baño privado',
          'Secador de pelo',
          'Caja fuerte',
        ],
        images: ['/images/habitacion.jpeg'],
        status: 'free',
        floor: 1,
        isActive: true,
      },
    ];

    const createdRooms = await Room.insertMany(sampleRooms);

    return NextResponse.json({
      message: `${createdRooms.length} habitaciones creadas exitosamente`,
      rooms: createdRooms,
    });
  } catch (error) {
    // Error creating sample rooms - silent in production
    return NextResponse.json(
      {
        message: 'Error al crear las habitaciones de ejemplo',
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}
