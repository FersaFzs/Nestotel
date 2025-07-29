# 🔥 Configuración de Firebase Admin SDK

## 📋 Paso 1: Obtener el archivo JSON de Firebase Admin

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Project Settings** (⚙️) → **Service accounts**
4. Haz clic en **Generate new private key**
5. Descarga el archivo JSON (ejemplo:
   `hotel-next-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`)

## 📄 Estructura del archivo JSON

El archivo descargado tendrá esta estructura:

```json
{
  "type": "service_account",
  "project_id": "tu-proyecto-id",
  "private_key_id": "abcdef1234567890abcdef1234567890abcdef12",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu-proyecto.iam.gserviceaccount.com"
}
```

## 🔧 Paso 2: Convertir JSON a variables de entorno

Copia estos valores del JSON a tu archivo `.env.local`:

```bash
# Firebase Admin SDK - Copiar desde el archivo JSON descargado
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=tu-proyecto-id
FIREBASE_ADMIN_PRIVATE_KEY_ID=abcdef1234567890abcdef1234567890abcdef12
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=123456789012345678901
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu-proyecto.iam.gserviceaccount.com

# Super Administrador - Configurar después
SUPER_ADMIN_UID=tu_uid_del_usuario_firebase
SUPER_ADMIN_EMAIL=admin@tuhotel.com
SUPER_ADMIN_FIRST_NAME=Super
SUPER_ADMIN_LAST_NAME=Admin
```

## ⚠️ Importante: Private Key

La `private_key` es la más complicada porque contiene saltos de línea. Debes:

1. **Copiar exactamente** la private_key del JSON
2. **Mantener los `\n`** que representan los saltos de línea
3. **Encerrar entre comillas dobles** en el `.env.local`

Ejemplo correcto:

```bash
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

## 🔍 Paso 3: Verificar la configuración

Una vez configurado, puedes verificar que todo funciona:

```bash
# Verificar que las variables se cargan correctamente
node -e "console.log(process.env.FIREBASE_ADMIN_PROJECT_ID)"
```

## 🚀 Paso 4: Crear el Super Administrador

Después de configurar las variables:

1. **Crear usuario en Firebase Console** (Authentication → Users)
2. **Copiar el UID** del usuario creado
3. **Actualizar las variables** del super admin en `.env.local`
4. **Ejecutar el script**:

```bash
pnpm create-admin
```

## 🔧 Troubleshooting

### Error: "Invalid private key"

- Verifica que la `FIREBASE_ADMIN_PRIVATE_KEY` esté entre comillas dobles
- Asegúrate de que los `\n` estén presentes
- No añadas espacios extra

### Error: "Project not found"

- Verifica que `FIREBASE_ADMIN_PROJECT_ID` coincida con tu proyecto
- Asegúrate de que el archivo JSON sea del proyecto correcto

### Error: "Service account not found"

- Verifica que `FIREBASE_ADMIN_CLIENT_EMAIL` sea correcto
- Regenera el archivo JSON si es necesario

## 📝 Ejemplo completo de .env.local

```bash
# Firebase Config (ya existente)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin SDK (NUEVO)
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=tu_proyecto
FIREBASE_ADMIN_PRIVATE_KEY_ID=abcdef1234567890abcdef1234567890abcdef12
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=123456789012345678901
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu_proyecto.iam.gserviceaccount.com

# Super Administrador (configurar después)
SUPER_ADMIN_UID=tu_uid_del_usuario_firebase
SUPER_ADMIN_EMAIL=admin@tuhotel.com
SUPER_ADMIN_FIRST_NAME=Super
SUPER_ADMIN_LAST_NAME=Admin

# MongoDB (ya existente)
MONGODB_URI=mongodb://localhost:27017/hotel-next
```

---

**💡 Consejo**: Una vez configurado, puedes eliminar el archivo JSON descargado
por seguridad, ya que toda la información estará en las variables de entorno.
