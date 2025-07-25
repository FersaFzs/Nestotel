# 🔥 Configuración de Firebase

## Pasos para configurar Firebase Authentication

### 1. Crear proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crear nuevo proyecto → Nombre: `granada-inn`
3. Desactivar Google Analytics (opcional)

### 2. Configurar Authentication
1. Ve a **Authentication** → **Get started**
2. En **Sign-in method**, habilita:
   - ✅ Email/Password
   - ✅ Google (opcional)

### 3. Obtener configuración web
1. Ve a **Project settings** (⚙️)
2. Scroll down → **Your apps** → **Add app** → **Web** (</>)
3. Nickname: `granada-inn-web`
4. Copia la configuración

### 4. Crear archivo .env.local
Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hotel-next

# Next.js Configuration
NEXTAUTH_SECRET=tu_secret_aqui
NEXTAUTH_URL=http://localhost:3000
```

### 5. Verificar funcionamiento
```bash
npm run dev
```
Navega a `/login` y `/register` para probar.

## ⚠️ Importante
- **Nunca** subas `.env.local` a git
- Las variables `NEXT_PUBLIC_*` son visibles en el cliente
- Guarda las credenciales de forma segura 