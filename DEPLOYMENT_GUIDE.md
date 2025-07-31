# 🚀 Guía de Despliegue - Granada Inn

## 📋 Preparación Pre-Despliegue

### ✅ **Checklist de Verificación**

- [x] ✅ Proyecto construye sin errores (`pnpm build`)
- [x] ✅ Tests unitarios pasan (`pnpm test`)
- [x] ✅ Tests E2E funcionan (`pnpm test:e2e`)
- [x] ✅ Linting limpio (`pnpm lint`)
- [x] ✅ Código formateado (`pnpm format`)
- [x] ✅ Variables de entorno configuradas
- [x] ✅ Base de datos MongoDB lista
- [x] ✅ Firebase configurado
- [x] ✅ Documentación completa

## 🎯 **Despliegue en Vercel** (Recomendado)

### 1. **Preparación Local**

```bash
# Verificar que todo funciona
pnpm build
pnpm start

# Limpiar el proyecto
pnpm lint --fix
pnpm format
```

### 2. **Configurar Variables de Entorno en Vercel**

En el dashboard de Vercel > Settings > Environment Variables:

#### 🔥 **Firebase (CRÍTICO)**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=tu_proyecto_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@proyecto.iam.gserviceaccount.com
```

#### 🗄️ **Base de Datos (CRÍTICO)**
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hotel-next?retryWrites=true&w=majority
```

#### 🔐 **Autenticación**
```env
NEXTAUTH_SECRET=tu_secret_super_seguro_aqui
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

#### 📧 **Email (OPCIONAL)**
```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

#### 🧮 **Facturación AEAT (OPCIONAL)**
```env
VERIFACTI_API_URL=https://api.verifacti.com/v1
VERIFACTI_API_KEY=tu_api_key
```

### 3. **Desplegar en Vercel**

#### **Opción A: Desde GitHub (Recomendado)**

1. **Push tu código a GitHub:**
```bash
git add .
git commit -m "feat: ready for production deployment"
git push origin main
```

2. **Conectar en Vercel:**
   - Ve a [vercel.com](https://vercel.com/)
   - Click "Import Project"
   - Selecciona tu repositorio GitHub
   - Configura variables de entorno
   - Deploy automático

#### **Opción B: CLI de Vercel**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel --prod
```

### 4. **Configurar Dominio Personalizado** (Opcional)

En Vercel Dashboard > Domains:
- Agregar dominio personalizado
- Configurar DNS según instrucciones
- Habilitar HTTPS automático

## 🌐 **Alternativas de Despliegue**

### 📦 **Railway**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login y deploy
railway login
railway init
railway up
```

### 🚢 **Render**

1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Build Command: `pnpm build`
4. Start Command: `pnpm start`

### ☁️ **AWS/DigitalOcean** (Avanzado)

Para despliegues corporativos con Docker:

```bash
# Build imagen Docker
docker build -t granada-inn .

# Deploy en tu servidor
docker run -p 3000:3000 granada-inn
```

## 🔍 **Verificación Post-Despliegue**

### ✅ **Tests de Funcionalidad**

1. **Página Principal:** ✅ Carga correctamente
2. **Autenticación:** ✅ Login/Register funciona
3. **Reservas:** ✅ Formulario envía datos
4. **Admin Panel:** ✅ Dashboard accesible
5. **API Routes:** ✅ Responden correctamente
6. **Base de Datos:** ✅ Conexión estable

### 📊 **Métricas de Performance**

```bash
# Lighthouse audit
npx lighthouse https://tu-dominio.vercel.app --output html

# Core Web Vitals
# - LCP < 2.5s ✅
# - FID < 100ms ✅  
# - CLS < 0.1 ✅
```

## 🛠️ **Monitoreo y Mantenimiento**

### 📈 **Analytics (Opcional)**

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel Analytics automático
```

### 🚨 **Error Tracking**

```bash
# Sentry (opcional)
npm install @sentry/nextjs
```

### 🔄 **CI/CD Automático**

El proyecto incluye GitHub Actions que:
- ✅ Ejecuta tests en cada PR
- ✅ Verifica calidad de código
- ✅ Despliega automáticamente en merge

## 📞 **Soporte Post-Despliegue**

### 🆘 **Problemas Comunes**

1. **Build Failed:** Verificar variables de entorno
2. **500 Error:** Revisar logs de Vercel
3. **DB Connection:** Verificar IP whitelist en MongoDB
4. **Firebase Error:** Validar configuración de claves

### 📧 **Contacto**

- **Email:** [tu-email@dominio.com]
- **LinkedIn:** [tu-linkedin]
- **GitHub:** [tu-github]

---

## 🎉 **¡Felicitaciones!**

Tu proyecto **Granada Inn** está ahora en producción, mostrando:

- ⚡ **Performance empresarial**
- 🔒 **Seguridad robusta**  
- 📱 **Experiencia mobile-first**
- 🎨 **Diseño profesional**
- 🚀 **Arquitectura escalable**

**Perfect para tu portfolio profesional! 🏆**