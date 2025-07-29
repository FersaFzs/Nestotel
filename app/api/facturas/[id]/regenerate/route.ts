import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db/mongoose';
import Invoice from '../../../../../lib/db/models/Invoice';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const invoice = await Invoice.findById(params.id);
    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Factura no encontrada' },
        { status: 404 },
      );
    }

    // Resetear estado de la factura para reintentar
    invoice.aeatStatus = 'pending';
    invoice.aeatResponse = 'Regenerada para reintento';
    invoice.pdfUrl = undefined;
    invoice.xmlUrl = undefined;
    invoice.qrUrl = undefined;

    await invoice.save();

    return NextResponse.json({
      success: true,
      message: 'Factura regenerada correctamente',
      status: 'pending',
    });
  } catch (error) {
    // Error regenerating invoice - handled silently in production
    return NextResponse.json(
      { success: false, message: 'Error al regenerar factura' },
      { status: 500 },
    );
  }
}
