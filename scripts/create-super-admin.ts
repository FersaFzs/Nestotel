import { auth } from 'firebase-admin';
import { initAdmin } from '../lib/firebase/admin';
import dbConnect from '../lib/db/mongoose';
import User from '../lib/db/models/User';

async function createSuperAdmin() {
  try {
    // Inicializar Firebase Admin
    initAdmin();

    // Conectar a la base de datos
    await dbConnect();

    // Datos del super administrador
    const superAdminData = {
      firebaseUid: process.env.SUPER_ADMIN_UID,
      email: process.env.SUPER_ADMIN_EMAIL,
      firstName: process.env.SUPER_ADMIN_FIRST_NAME || 'Super',
      lastName: process.env.SUPER_ADMIN_LAST_NAME || 'Admin',
      role: 'super_admin' as const,
      permissions: [
        'manage_reservations',
        'manage_rooms',
        'manage_users',
        'manage_admins',
        'view_reports',
        'manage_finances',
        'system_settings'
      ],
      isActive: true,
    };

    // Verificar que tenemos los datos necesarios
    if (!superAdminData.firebaseUid || !superAdminData.email) {
      console.error('Error: SUPER_ADMIN_UID y SUPER_ADMIN_EMAIL deben estar definidos en las variables de entorno');
      process.exit(1);
    }

    // Verificar que el usuario existe en Firebase
    try {
      await auth().getUser(superAdminData.firebaseUid);
    } catch (error) {
      console.error('Error: El usuario no existe en Firebase. Primero debes crear el usuario en Firebase Console');
      process.exit(1);
    }

    // Verificar si el super admin ya existe
    const existingUser = await User.findOne({ 
      $or: [{ firebaseUid: superAdminData.firebaseUid }, { email: superAdminData.email }] 
    });

    if (existingUser) {
      console.log('El super administrador ya existe en la base de datos');
      console.log('Datos del usuario:', {
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        isActive: existingUser.isActive,
      });
      return;
    }

    // Crear el super administrador
    const superAdmin = new User(superAdminData);
    await superAdmin.save();

    console.log('✅ Super administrador creado exitosamente');
    console.log('Datos del usuario:', {
      _id: superAdmin._id,
      firebaseUid: superAdmin.firebaseUid,
      email: superAdmin.email,
      firstName: superAdmin.firstName,
      lastName: superAdmin.lastName,
      role: superAdmin.role,
      permissions: superAdmin.permissions,
      isActive: superAdmin.isActive,
    });

    console.log('\n📋 Instrucciones para acceder al panel de administración:');
    console.log('1. Asegúrate de que el usuario existe en Firebase Console');
    console.log('2. Inicia sesión con el email:', superAdminData.email);
    console.log('3. Ve a http://localhost:3000/admin');
    console.log('4. El sistema verificará automáticamente tus permisos');

  } catch (error) {
    console.error('Error creando super administrador:', error);
    process.exit(1);
  }
}

// Ejecutar el script
createSuperAdmin()
  .then(() => {
    console.log('Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en el script:', error);
    process.exit(1);
  }); 