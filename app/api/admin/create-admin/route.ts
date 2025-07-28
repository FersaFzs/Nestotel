import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initAdmin } from '../../../../lib/firebase/admin';
import dbConnect from '../../../../lib/db/mongoose';
import User from '../../../../lib/db/models/User';
import { userSchema } from '../../../../lib/validators/user';

export async function POST(request: NextRequest) {
  try {
    // Inicializar Firebase Admin
    initAdmin();

    // Obtener el token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token de autorización requerido' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verificar el token con Firebase Admin
    const decodedToken = await auth().verifyIdToken(token);
    const currentUserUid = decodedToken.uid;

    // Conectar a la base de datos
    await dbConnect();

    // Verificar que el usuario actual es super_admin
    const currentUser = await User.findOne({ firebaseUid: currentUserUid });
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json(
        { message: 'Solo los super administradores pueden crear administradores' },
        { status: 403 },
      );
    }

    // Obtener datos del nuevo administrador
    const data = await request.json();
    const parse = userSchema.safeParse(data);

    if (!parse.success) {
      return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
    }

    const { firebaseUid, email, firstName, lastName, role, permissions } = parse.data;

    // Verificar que el usuario no existe ya
    const existingUser = await User.findOne({
      $or: [{ firebaseUid }, { email }],
    });

    if (existingUser) {
      return NextResponse.json({ message: 'El usuario ya existe' }, { status: 409 });
    }

    // Crear el nuevo usuario
    const newUser = new User({
      firebaseUid,
      email,
      firstName,
      lastName,
      role: role || 'admin',
      permissions: permissions || ['manage_reservations', 'manage_rooms', 'view_reports'],
      isActive: true,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: 'Administrador creado exitosamente',
        user: {
          _id: newUser._id,
          firebaseUid: newUser.firebaseUid,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          permissions: newUser.permissions,
          isActive: newUser.isActive,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ message: 'Error al crear el administrador' }, { status: 500 });
  }
}
