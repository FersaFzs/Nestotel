#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Configuración de Firebase Admin SDK\n');

// Verificar si existe el archivo JSON
const jsonFiles = fs
  .readdirSync('.')
  .filter((file) => file.endsWith('.json') && file.includes('firebase-adminsdk'));

if (jsonFiles.length === 0) {
  console.log('❌ No se encontró ningún archivo JSON de Firebase Admin SDK');
  console.log('\n📋 Pasos para obtener el archivo:');
  console.log('1. Ve a Firebase Console → Project Settings → Service accounts');
  console.log('2. Haz clic en "Generate new private key"');
  console.log('3. Descarga el archivo JSON');
  console.log('4. Coloca el archivo en la raíz del proyecto');
  console.log('5. Ejecuta este script nuevamente\n');
  process.exit(1);
}

const jsonFile = jsonFiles[0];
console.log(`📄 Archivo encontrado: ${jsonFile}\n`);

try {
  // Leer el archivo JSON
  const jsonContent = fs.readFileSync(jsonFile, 'utf8');
  const firebaseConfig = JSON.parse(jsonContent);

  // Crear las variables de entorno
  const envVars = [
    '# Firebase Admin SDK',
    `FIREBASE_ADMIN_TYPE=${firebaseConfig.type}`,
    `FIREBASE_ADMIN_PROJECT_ID=${firebaseConfig.project_id}`,
    `FIREBASE_ADMIN_PRIVATE_KEY_ID=${firebaseConfig.private_key_id}`,
    `FIREBASE_ADMIN_PRIVATE_KEY="${firebaseConfig.private_key}"`,
    `FIREBASE_ADMIN_CLIENT_EMAIL=${firebaseConfig.client_email}`,
    `FIREBASE_ADMIN_CLIENT_ID=${firebaseConfig.client_id}`,
    `FIREBASE_ADMIN_AUTH_URI=${firebaseConfig.auth_uri}`,
    `FIREBASE_ADMIN_TOKEN_URI=${firebaseConfig.token_uri}`,
    `FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=${firebaseConfig.auth_provider_x509_cert_url}`,
    `FIREBASE_ADMIN_CLIENT_X509_CERT_URL=${firebaseConfig.client_x509_cert_url}`,
    '',
    '# Super Administrador (configurar después)',
    'SUPER_ADMIN_UID=tu_uid_del_usuario_firebase',
    'SUPER_ADMIN_EMAIL=admin@tuhotel.com',
    'SUPER_ADMIN_FIRST_NAME=Super',
    'SUPER_ADMIN_LAST_NAME=Admin',
  ].join('\n');

  // Verificar si existe .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  let existingEnv = '';

  if (fs.existsSync(envPath)) {
    existingEnv = fs.readFileSync(envPath, 'utf8');
    console.log('📝 Archivo .env.local encontrado, añadiendo variables de Firebase Admin...\n');
  } else {
    console.log('📝 Creando archivo .env.local...\n');
  }

  // Añadir las nuevas variables al final
  const newEnvContent = `${existingEnv}\n${envVars}`;

  // Escribir el archivo
  fs.writeFileSync(envPath, newEnvContent);

  console.log('✅ Variables de Firebase Admin SDK añadidas a .env.local');
  console.log('\n📋 Variables añadidas:');
  console.log('- FIREBASE_ADMIN_TYPE');
  console.log('- FIREBASE_ADMIN_PROJECT_ID');
  console.log('- FIREBASE_ADMIN_PRIVATE_KEY_ID');
  console.log('- FIREBASE_ADMIN_PRIVATE_KEY');
  console.log('- FIREBASE_ADMIN_CLIENT_EMAIL');
  console.log('- FIREBASE_ADMIN_CLIENT_ID');
  console.log('- FIREBASE_ADMIN_AUTH_URI');
  console.log('- FIREBASE_ADMIN_TOKEN_URI');
  console.log('- FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL');
  console.log('- FIREBASE_ADMIN_CLIENT_X509_CERT_URL');
  console.log('\n🔧 Próximos pasos:');
  console.log('1. Crear usuario en Firebase Console (Authentication → Users)');
  console.log('2. Copiar el UID del usuario creado');
  console.log('3. Actualizar SUPER_ADMIN_UID en .env.local');
  console.log('4. Ejecutar: pnpm create-admin');
  console.log('\n🗑️  Puedes eliminar el archivo JSON por seguridad:');
  console.log(`   rm ${jsonFile}`);
} catch (error) {
  console.error('❌ Error procesando el archivo JSON:', error.message);
  process.exit(1);
}
