import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';
import User from '../../../lib/db/models/User';
import { userSchema } from '../../../lib/validators/user';

// Listar usuarios (GET)
export async function GET() {
  await dbConnect();
  const users = await User.find().select('-__v');
  return NextResponse.json(users);
}

// Crear usuario (POST)
export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const parse = userSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }
  try {
    const user = await User.create(parse.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
