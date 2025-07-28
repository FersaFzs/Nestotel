# 🔐 Configuración del Sistema de Administración

## 📋 Requisitos Previos

1. **Firebase configurado** (ver `FIREBASE_SETUP.md`)
2. **Base de datos MongoDB ejecutándose**
3. **Servidor Next.js ejecutándose**

## 🚀 Configuración del Super Administrador

### Paso 1: Crear usuario en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Users**
4. Haz clic en **Add User**
5. Introduce el email y contraseña del super administrador
6. **Guarda el UID** del usuario creado (lo necesitarás después)

### Paso 2: Configurar variables de entorno

Añade estas variables a tu archivo `.env.local`:

```bash
# Super Administrador
SUPER_ADMIN_UID=tu_uid_del_usuario_firebase
SUPER_ADMIN_EMAIL=admin@tuhotel.com
SUPER_ADMIN_FIRST_NAME=Super
SUPER_ADMIN_LAST_NAME=Admin

# Firebase Admin SDK (Obtener desde Firebase Console)
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=tu_proyecto_id
FIREBASE_ADMIN_PRIVATE_KEY_ID=tu_private_key_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu_private_key_aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=tu_client_id
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu_proyecto.iam.gserviceaccount.com
```

### Paso 3: Obtener credenciales de Firebase Admin

1. En Firebase Console, ve a **Project Settings** (⚙️)
2. Pestaña **Service accounts**
3. Haz clic en **Generate new private key**
4. Descarga el archivo JSON
5. Copia los valores al archivo `.env.local`

### Paso 4: Crear el Super Administrador

Ejecuta el script para crear el super administrador:

```bash
# Compilar el script TypeScript
npx tsc scripts/create-super-admin.ts --outDir dist --target es2020 --module commonjs

# Ejecutar el script
node dist/scripts/create-super-admin.js
```

O ejecuta directamente con ts-node:

```bash
npx ts-node scripts/create-super-admin.ts
```

### Paso 5: Verificar acceso

1. Inicia sesión con el email del super administrador
2. Ve a `http://localhost:3000/admin`
3. Deberías ver el panel de administración

## 🔒 Sistema de Roles y Permisos

### Roles Disponibles

- **`user`**: Usuario normal (reservas, perfil)
- **`admin`**: Administrador (gestión de reservas, habitaciones)
- **`super_admin`**: Super administrador (todo + gestión de usuarios)

### Permisos Disponibles

- `manage_reservations`: Gestionar reservas
- `manage_rooms`: Gestionar habitaciones
- `manage_users`: Gestionar usuarios
- `manage_admins`: Crear/editar administradores
- `view_reports`: Ver reportes y estadísticas
- `manage_finances`: Gestionar facturación
- `system_settings`: Configuración del sistema

## 👥 Crear Administradores Adicionales

### Desde el Panel de Administración

1. Accede como super administrador
2. Ve a **Usuarios** → **Crear Administrador**
3. Introduce los datos del nuevo administrador
4. El sistema creará automáticamente el usuario en Firebase

### Desde la Línea de Comandos

```bash
# Crear un administrador específico
curl -X POST http://localhost:3000/api/admin/create-admin \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid": "uid_del_usuario",
    "email": "admin@tuhotel.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "permissions": ["manage_reservations", "manage_rooms"]
  }'
```

## 🛡️ Seguridad

### Verificaciones Implementadas

1. **Autenticación Firebase**: Verificación de tokens JWT
2. **Roles en Base de Datos**: Verificación de permisos
3. **Protección de Rutas**: Middleware en todas las rutas admin
4. **Validación de Datos**: Zod schemas para todos los inputs
5. **Logs de Acceso**: Registro de intentos de acceso

### Buenas Prácticas

1. **Nunca compartas** las credenciales de Firebase Admin
2. **Usa HTTPS** en producción
3. **Rota las claves** periódicamente
4. **Monitorea los accesos** al panel admin
5. **Usa contraseñas fuertes** para los administradores

## 🔧 Troubleshooting

### Error: "Usuario no encontrado"

1. Verifica que el usuario existe en Firebase Console
2. Asegúrate de que el UID es correcto
3. Ejecuta el script de creación del super admin

### Error: "Token expirado"

1. Cierra sesión y vuelve a iniciar
2. Verifica que el token de Firebase Admin es válido
3. Regenera las credenciales si es necesario

### Error: "Acceso denegado"

1. Verifica que el usuario tiene el rol correcto
2. Comprueba que el usuario está activo
3. Verifica los permisos asignados

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del servidor
2. Verifica la configuración de Firebase
3. Comprueba las variables de entorno
4. Asegúrate de que MongoDB está ejecutándose

---

**⚠️ Importante**: Este sistema es para uso en producción. Asegúrate de configurar correctamente todas las medidas de seguridad antes de desplegar.
