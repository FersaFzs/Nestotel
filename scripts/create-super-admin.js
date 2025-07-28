#!/usr/bin/env node

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function createSuperAdmin() {
  try {
    console.log('🔐 Creando Super Administrador...\n');

    // Verificar variables de entorno
    const requiredEnvVars = [
      'SUPER_ADMIN_UID',
      'SUPER_ADMIN_EMAIL',
      'FIREBASE_ADMIN_PROJECT_ID',
      'FIREBASE_ADMIN_PRIVATE_KEY',
      'FIREBASE_ADMIN_CLIENT_EMAIL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error('❌ Variables de entorno faltantes:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      console.log('\n📋 Asegúrate de configurar todas las variables en .env.local');
      process.exit(1);
    }

    // Inicializar Firebase Admin
    if (getApps().length === 0) {
      const serviceAccount = {
        type: process.env.FIREBASE_ADMIN_TYPE,
        project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
        private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
        auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
        token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
      };

      initializeApp({
        credential: cert(serviceAccount),
      });
    }

    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-next';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Definir el modelo de usuario
    const UserSchema = new mongoose.Schema({
      firebaseUid: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      firstName: { type: String },
      lastName: { type: String },
      role: {
        type: String,
        enum: ['user', 'admin', 'super_admin'],
        default: 'user',
      },
      permissions: [{ type: String }],
      isActive: { type: Boolean, default: true },
      lastLogin: { type: Date },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Datos del super administrador
    const superAdminData = {
      firebaseUid: process.env.SUPER_ADMIN_UID,
      email: process.env.SUPER_ADMIN_EMAIL,
      firstName: process.env.SUPER_ADMIN_FIRST_NAME || 'Super',
      lastName: process.env.SUPER_ADMIN_LAST_NAME || 'Admin',
      role: 'super_admin',
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

    console.log('📋 Datos del super administrador:');
    console.log(`   Email: ${superAdminData.email}`);
    console.log(`   UID: ${superAdminData.firebaseUid}`);
    console.log(`   Nombre: ${superAdminData.firstName} ${superAdminData.lastName}`);
    console.log(`   Rol: ${superAdminData.role}\n`);

    // Verificar que el usuario existe en Firebase
    try {
      const firebaseUser = await getAuth().getUser(superAdminData.firebaseUid);
      console.log('✅ Usuario encontrado en Firebase');
      console.log(`   Firebase UID: ${firebaseUser.uid}`);
      console.log(`   Firebase Email: ${firebaseUser.email}\n`);
    } catch (error) {
      console.error('❌ Error: El usuario no existe en Firebase');
      console.error('   Asegúrate de crear el usuario en Firebase Console primero');
      console.error('   Firebase Console → Authentication → Users → Add User');
      process.exit(1);
    }

    // Verificar si el super admin ya existe
    const existingUser = await User.findOne({ 
      $or: [{ firebaseUid: superAdminData.firebaseUid }, { email: superAdminData.email }] 
    });

    if (existingUser) {
      console.log('ℹ️  El super administrador ya existe en la base de datos');
      console.log('📊 Datos del usuario existente:');
      console.log(`   ID: ${existingUser._id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Rol: ${existingUser.role}`);
      console.log(`   Activo: ${existingUser.isActive}`);
      console.log(`   Creado: ${existingUser.createdAt}`);
      return;
    }

    // Crear el super administrador
    const superAdmin = new User(superAdminData);
    await superAdmin.save();

    console.log('✅ Super administrador creado exitosamente');
    console.log('\n📊 Datos del usuario creado:');
    console.log(`   ID: ${superAdmin._id}`);
    console.log(`   Firebase UID: ${superAdmin.firebaseUid}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Nombre: ${superAdmin.firstName} ${superAdmin.lastName}`);
    console.log(`   Rol: ${superAdmin.role}`);
    console.log(`   Permisos: ${superAdmin.permissions.join(', ')}`);
    console.log(`   Activo: ${superAdmin.isActive}`);
    console.log(`   Creado: ${superAdmin.createdAt}`);

    console.log('\n🎉 ¡Configuración completada!');
    console.log('\n📋 Instrucciones para acceder al panel de administración:');
    console.log('1. ✅ Usuario creado en Firebase Console');
    console.log('2. ✅ Super administrador creado en la base de datos');
    console.log('3. 🌐 Ve a http://localhost:3000/login');
    console.log('4. 🔑 Inicia sesión con:', superAdminData.email);
    console.log('5. 🏢 Ve a http://localhost:3000/admin');
    console.log('6. ✅ El sistema verificará automáticamente tus permisos');

  } catch (error) {
    console.error('❌ Error creando super administrador:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.error('\n💡 Solución:');
      console.error('1. Ve a Firebase Console → Authentication → Users');
      console.error('2. Haz clic en "Add User"');
      console.error('3. Introduce el email y contraseña');
      console.error('4. Copia el UID del usuario creado');
      console.error('5. Actualiza SUPER_ADMIN_UID en .env.local');
      console.error('6. Ejecuta este script nuevamente');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar el script
createSuperAdmin()
  .then(() => {
    console.log('\n✅ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en el script:', error.message);
    process.exit(1);
  }); 