import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';
import Invoice from '../../../lib/db/models/Invoice';
import Reservation from '../../../lib/db/models/Reservation';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const invoices = await Invoice.find({})
      .populate('reservation', 'checkIn checkOut totalPrice')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      invoices: invoices.map((invoice) => ({
        ...invoice,
        _id: invoice._id.toString(),
        reservation: {
          ...invoice.reservation,
          _id: invoice.reservation._id.toString(),
          checkIn: invoice.reservation.checkIn.toISOString(),
          checkOut: invoice.reservation.checkOut.toISOString(),
        },
        createdAt: invoice.createdAt.toISOString(),
        updatedAt: invoice.updatedAt.toISOString(),
        date: invoice.date.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener facturas' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { reservationId, clientName, clientNIF, clientAddress } = body;

    // Obtener la reserva
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return NextResponse.json(
        { success: false, message: 'Reserva no encontrada' },
        { status: 404 },
      );
    }

    // Generar número de factura
    const lastInvoice = await Invoice.findOne().sort({ number: -1 });
    const nextNumber = lastInvoice ? parseInt(lastInvoice.number) + 1 : 1;
    const invoiceNumber = nextNumber.toString().padStart(6, '0');

    // Crear items de la factura
    const items = [
      {
        description: `Estancia en habitación - ${reservation.guestInfo.firstName} ${reservation.guestInfo.lastName}`,
        quantity: Math.ceil(
          (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
        unitPrice:
          reservation.totalPrice /
          Math.ceil(
            (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        vat: 10, // IVA reducido para hoteles en España
      },
    ];

    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const vatTotal = total * 0.1; // 10% IVA
    const grandTotal = total + vatTotal;

    const invoice = new Invoice({
      number: invoiceNumber,
      date: new Date(),
      clientName,
      clientNIF,
      clientAddress,
      reservation: reservationId,
      items,
      total,
      vatTotal,
      grandTotal,
      aeatStatus: 'pending',
    });

    await invoice.save();

    return NextResponse.json({
      success: true,
      invoice: {
        ...invoice.toObject(),
        _id: invoice._id.toString(),
        createdAt: invoice.createdAt.toISOString(),
        updatedAt: invoice.updatedAt.toISOString(),
        date: invoice.date.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear factura' },
      { status: 500 },
    );
  }
}
