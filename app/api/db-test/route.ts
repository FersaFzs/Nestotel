import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ ok: true, message: 'Conexión a MongoDB exitosa' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
