import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';
import User from '../../../lib/db/models/User';
import { userSchema } from '../../../lib/validators/user';

export async function GET(_request: NextRequest) {
  try {
    await dbConnect();

    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
        lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      })),
    });
  } catch (error) {
    // Error fetching users - handled silently in production
    return NextResponse.json(
      { success: false, message: 'Error al obtener usuarios' },
      { status: 500 },
    );
  }
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
