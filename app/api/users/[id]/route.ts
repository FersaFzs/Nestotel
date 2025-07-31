import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongoose';
import User from '../../../../lib/db/models/User';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const user = await User.findById(params.id).select('-password').lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
        lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      },
    });
  } catch (error) {
    // Error fetching user - silent in production
    return NextResponse.json(
      { success: false, message: 'Error al obtener usuario' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const body = await request.json();
    const { firstName, lastName, email, phone, role, isActive } = body;

    // Validar campos requeridos
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, message: 'Nombre, apellido y email son requeridos' },
        { status: 400 },
      );
    }

    // Verificar si el email ya existe en otro usuario
    const existingUser = await User.findOne({
      email,
      _id: { $ne: params.id },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'El email ya está en uso' },
        { status: 400 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      {
        firstName,
        lastName,
        email,
        phone,
        role: role || 'user',
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true, runValidators: true },
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser.toObject(),
        _id: updatedUser._id.toString(),
        createdAt: updatedUser.createdAt.toISOString(),
        lastLogin: updatedUser.lastLogin ? updatedUser.lastLogin.toISOString() : null,
      },
    });
  } catch (error) {
    // Error updating user - silent in production
    return NextResponse.json(
      { success: false, message: 'Error al actualizar usuario' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 },
      );
    }

    // Verificar que no se elimine el último administrador
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return NextResponse.json(
          { success: false, message: 'No se puede eliminar el último administrador' },
          { status: 400 },
        );
      }
    }

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    // Error deleting user - silent in production
    return NextResponse.json(
      { success: false, message: 'Error al eliminar usuario' },
      { status: 500 },
    );
  }
}
