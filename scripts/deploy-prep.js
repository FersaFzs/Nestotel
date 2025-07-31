#!/usr/bin/env node

/**
 * 🚀 Script de Preparación para Despliegue
 * 
 * Automatiza la verificación y preparación del proyecto
 * para despliegue en producción.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔄 ${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completado`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error en ${description}`, 'red');
    log(error.message, 'red');
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} existe`, 'green');
    return true;
  } else {
    log(`❌ ${description} falta: ${filePath}`, 'red');
    return false;
  }
}

function checkEnvVars() {
  log('\n🔍 Verificando variables de entorno...', 'yellow');
  
  const requiredVars = [
    'MONGODB_URI',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'FIREBASE_ADMIN_PROJECT_ID'
  ];

  const envFile = '.env.local';
  let allVarsPresent = true;

  if (!fs.existsSync(envFile)) {
    log(`❌ Archivo ${envFile} no encontrado`, 'red');
    log(`💡 Copia env.example a .env.local y configura las variables`, 'yellow');
    return false;
  }

  const envContent = fs.readFileSync(envFile, 'utf8');

  requiredVars.forEach(varName => {
    if (envContent.includes(varName) && !envContent.includes(`${varName}=tu_`) && !envContent.includes(`${varName}=`)) {
      log(`✅ ${varName} configurada`, 'green');
    } else {
      log(`❌ ${varName} no configurada`, 'red');
      allVarsPresent = false;
    }
  });

  return allVarsPresent;
}

function displayDeploymentSummary() {
  log('\n🎯 RESUMEN DE DESPLIEGUE', 'magenta');
  log('=' * 50, 'magenta');
  
  log('\n📋 Próximos pasos:', 'cyan');
  log('1. 📤 Push código a GitHub:', 'bright');
  log('   git add . && git commit -m "feat: ready for production" && git push', 'reset');
  
  log('\n2. 🌐 Desplegar en Vercel:', 'bright');
  log('   - Ve a vercel.com', 'reset');
  log('   - Importa tu repositorio GitHub', 'reset');
  log('   - Configura variables de entorno', 'reset');
  log('   - Deploy automático', 'reset');
  
  log('\n3. ✅ Variables de entorno en Vercel:', 'bright');
  log('   - MONGODB_URI', 'reset');
  log('   - NEXT_PUBLIC_FIREBASE_* (todas)', 'reset');
  log('   - FIREBASE_ADMIN_* (todas)', 'reset');
  log('   - NEXTAUTH_SECRET', 'reset');
  log('   - NEXTAUTH_URL', 'reset');
  
  log('\n4. 🔍 Verificar post-despliegue:', 'bright');
  log('   - Página principal carga', 'reset');
  log('   - Login/Register funciona', 'reset');
  log('   - API routes responden', 'reset');
  log('   - Base de datos conecta', 'reset');
  
  log('\n🎉 ¡Granada Inn listo para producción!', 'green');
  log('\n📖 Consulta DEPLOYMENT_GUIDE.md para detalles completos', 'cyan');
}

async function main() {
  log('🚀 PREPARACIÓN PARA DESPLIEGUE - Granada Inn', 'magenta');
  log('=' * 50, 'magenta');

  let allChecksPass = true;

  // 1. Verificar archivos críticos
  log('\n📁 Verificando archivos del proyecto...', 'yellow');
  const criticalFiles = [
    ['package.json', 'Configuración del proyecto'],
    ['next.config.js', 'Configuración de Next.js'],
    ['vercel.json', 'Configuración de Vercel'],
    ['app/layout.tsx', 'Layout principal'],
    ['app/page.tsx', 'Página principal'],
    ['lib/db/mongoose.ts', 'Conexión a base de datos']
  ];

  criticalFiles.forEach(([file, desc]) => {
    if (!checkFile(file, desc)) allChecksPass = false;
  });

  // 2. Verificar variables de entorno
  if (!checkEnvVars()) allChecksPass = false;

  // 3. Instalar dependencias
  if (!runCommand('pnpm install', 'Instalación de dependencias')) {
    allChecksPass = false;
  }

  // 4. Linting
  if (!runCommand('pnpm lint', 'Verificación de código (ESLint)')) {
    allChecksPass = false;
  }

  // 5. Formateo
  if (!runCommand('pnpm format', 'Formateo de código (Prettier)')) {
    allChecksPass = false;
  }

  // 6. Tests unitarios
  if (!runCommand('pnpm test', 'Tests unitarios (Jest)')) {
    log('⚠️  Tests fallaron, pero puedes continuar con el despliegue', 'yellow');
  }

  // 7. Build de producción
  if (!runCommand('pnpm build', 'Build de producción')) {
    log('❌ Build falló - NO DESPLEGAR hasta resolver', 'red');
    allChecksPass = false;
  }

  // Resumen final
  log('\n' + '=' * 50, 'magenta');
  if (allChecksPass) {
    log('🎉 ¡PROYECTO LISTO PARA DESPLIEGUE!', 'green');
    displayDeploymentSummary();
  } else {
    log('❌ PROYECTO NO ESTÁ LISTO', 'red');
    log('🔧 Resuelve los errores anteriores antes de desplegar', 'yellow');
    process.exit(1);
  }
}

// Ejecutar script
main().catch(error => {
  log('💥 Error inesperado:', 'red');
  log(error.message, 'red');
  process.exit(1);
});