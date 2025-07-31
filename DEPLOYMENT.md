# 🚀 Guía de Despliegue - Granada Inn

## 📋 Resumen de Despliegue

Esta guía cubre el proceso completo para desplegar **Granada Inn** en **Vercel**, la plataforma recomendada para aplicaciones Next.js, con configuración de base de datos MongoDB Atlas.

## 🎯 Arquitectura de Despliegue

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │  MongoDB Atlas  │    │  Firebase Auth  │
│   (Frontend +   │◄──►│  (Database)     │    │  (Authentication│
│    API Routes)  │    │                 │    │   & Storage)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Prerrequisitos

### Cuentas Necesarias
- ✅ [Vercel Account](https://vercel.com) (gratuito)
- ✅ [MongoDB Atlas](https://cloud.mongodb.com) (gratuito)
- ✅ [Firebase Console](https://console.firebase.google.com) (gratuito)
- ✅ [GitHub Account](https://github.com) (para CI/CD)

### Herramientas Locales
- ✅ **Node.js** 20+
- ✅ **pnpm** 8+
- ✅ **Git** configurado
- ✅ **Vercel CLI** (opcional)

## 📱 Paso 1: Configurar MongoDB Atlas

### 1.1 Crear Cluster
```bash
# 1. Ve a https://cloud.mongodb.com
# 2. Crea una cuenta gratuita
# 3. Crea un nuevo cluster (M0 Sandbox - GRATIS)
# 4. Selecciona región más cercana (Europe)
```

### 1.2 Configurar Seguridad
```bash
# Database Access:
# - Username: hotel-admin
# - Password: [generar password seguro]
# - Role: Atlas Admin

# Network Access:
# - Add IP: 0.0.0.0/0 (permitir todas las IPs para Vercel)
```

### 1.3 Obtener Connection String
```env
MONGODB_URI=mongodb+srv://hotel-admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/hotel-granada?retryWrites=true&w=majority
```

## 🔥 Paso 2: Configurar Firebase

### 2.1 Crear Proyecto Firebase
```bash
# 1. Ve a https://console.firebase.google.com
# 2. Crea nuevo proyecto: "granada-inn-production"
# 3. Activa Google Analytics (opcional)
```

### 2.2 Configurar Authentication
```bash
# Authentication > Sign-in method:
# ✅ Email/Password: Activar
# ✅ Google: Activar (configurar OAuth consent)

# Authorized domains:
# - localhost (ya incluido)
# - tu-dominio.vercel.app
```

### 2.3 Obtener Configuración Web
```javascript
// Configuración Firebase para Frontend
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "granada-inn-prod.firebaseapp.com",
  projectId: "granada-inn-prod",
  storageBucket: "granada-inn-prod.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 2.4 Configurar Service Account (Admin)
```bash
# 1. Project Settings > Service accounts
# 2. Generate new private key
# 3. Descargar JSON file
# 4. Extraer campos necesarios para .env
```

## 🚀 Paso 3: Desplegar en Vercel

### 3.1 Conectar Repositorio
```bash
# Opción A: Desde GitHub
# 1. Push tu código a GitHub
# 2. Ve a https://vercel.com/new
# 3. Import from GitHub
# 4. Selecciona el repositorio

# Opción B: Vercel CLI
npm i -g vercel
vercel login
vercel --prod
```

### 3.2 Configurar Variables de Entorno
```env
# En Vercel Dashboard > Settings > Environment Variables

# 🔥 Firebase Frontend
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=granada-inn-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=granada-inn-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=granada-inn-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# 🔐 Firebase Admin
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=granada-inn-prod
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC..."
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@granada-inn-prod.iam.gserviceaccount.com

# 🗄️ MongoDB
MONGODB_URI=mongodb+srv://hotel-admin:PASSWORD@cluster0.xxxxx.mongodb.net/hotel-granada?retryWrites=true&w=majority

# 📧 Email (Opcional - para emails de confirmación)
EMAIL_USER=tu.email@gmail.com
EMAIL_PASS=tu_app_password_gmail

# 🧾 Facturación (Opcional - para testing)
VERIFACTI_API_KEY=demo_key
FACTURAE_API_KEY=demo_key
AEAT_API_KEY=demo_key

# 🔧 Otros
NODE_ENV=production
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=tu_secret_super_seguro_aqui
```

### 3.3 Configurar Dominio (Opcional)
```bash
# Vercel Dashboard > Settings > Domains
# 1. Añadir dominio personalizado
# 2. Configurar DNS según instrucciones
# 3. Verificar SSL automático
```

## 🗄️ Paso 4: Poblar Base de Datos

### 4.1 Crear Datos Iniciales
```bash
# Ejecutar seed script para datos demo
# Esto se puede hacer desde Vercel Functions

# O crear manualmente datos en MongoDB Atlas:
# 1. Ve a Collections
# 2. Crea collections: users, rooms, reservations, invoices
# 3. Inserta datos de ejemplo
```

### 4.2 Crear Usuario Administrador
```bash
# Opción A: Usar script desde local
MONGODB_URI="tu_connection_string" node scripts/create-super-admin.js

# Opción B: Crear manualmente en Firebase Auth
# 1. Firebase Console > Authentication > Users
# 2. Add user manualmente
# 3. Añadir custom claims para role: "admin"
```

## ✅ Paso 5: Verificación Post-Despliegue

### 5.1 Checklist de Funcionalidad
- [ ] **Landing page** carga correctamente
- [ ] **Registro/Login** funciona con Firebase
- [ ] **Reservas** se pueden crear y guardar en MongoDB
- [ ] **Admin panel** accesible con usuario admin
- [ ] **APIs** responden correctamente
- [ ] **Emails** se envían (si configurado)

### 5.2 Performance Check
```bash
# Lighthouse CI
npm run lighthouse

# Core Web Vitals
# - FCP < 1.8s
# - LCP < 2.5s  
# - CLS < 0.1
# - FID < 100ms
```

### 5.3 SEO Verification
```bash
# Verificar:
# ✅ Sitemap: https://tu-app.vercel.app/sitemap.xml
# ✅ Robots: https://tu-app.vercel.app/robots.txt
# ✅ Meta tags presentes
# ✅ Open Graph funcionando
```

## 🔧 Paso 6: Configuración Avanzada

### 6.1 Analytics (Opcional)
```javascript
// Google Analytics
// 1. Crear propiedad GA4
// 2. Añadir NEXT_PUBLIC_GA_ID a Vercel
// 3. Implementar tracking
```

### 6.2 Monitoring (Opcional)
```javascript
// Sentry para error tracking
// 1. Crear proyecto Sentry
// 2. Configurar DSN en Vercel
// 3. Implementar error boundaries
```

### 6.3 Custom Domain
```bash
# Si tienes dominio propio:
# 1. Vercel > Settings > Domains
# 2. Add domain
# 3. Configure DNS records
# 4. Wait for SSL provision
```

## 🛠️ Comandos de Utilidad

### Desarrollo Local con Prod Data
```bash
# .env.local con datos de producción
cp .env.example .env.local
# Editar .env.local con valores de Vercel

pnpm dev
```

### Deploy desde CLI
```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# Ver logs
vercel logs [deployment-url]
```

### Base de Datos
```bash
# Backup MongoDB Atlas
mongodump --uri="mongodb+srv://..."

# Restore MongoDB Atlas  
mongorestore --uri="mongodb+srv://..."
```

## 🔍 Troubleshooting

### Errores Comunes

#### Error 1: "Module not found"
```bash
# Solución: Verificar imports relativos
# Cambiar de:
import Component from '../components/Component'
# A:
import Component from '@/components/Component'
```

#### Error 2: Firebase Auth no funciona
```bash
# Verificar authorized domains en Firebase Console
# Authentication > Settings > Authorized domains
# Añadir: tu-app.vercel.app
```

#### Error 3: MongoDB connection failed
```bash
# Verificar Network Access en MongoDB Atlas
# Whitelist: 0.0.0.0/0 para Vercel
# Verificar connection string en variables de entorno
```

#### Error 4: Environment variables undefined
```bash
# En Vercel Dashboard:
# Settings > Environment Variables
# Verificar que estén todas las variables
# Redeploy después de cambios
```

## 📊 Monitoring Post-Despliegue

### Métricas a Monitorear
- ✅ **Uptime**: >99.9%
- ✅ **Response time**: <500ms
- ✅ **Error rate**: <0.1%
- ✅ **Core Web Vitals**: Todos en verde

### Herramientas Recomendadas
- **Vercel Analytics**: Incluido gratis
- **Google PageSpeed Insights**: Gratis
- **GTmetrix**: Performance monitoring
- **Pingdom**: Uptime monitoring

## 🎯 Próximos Pasos

### Después del Despliegue
1. ✅ **Documentar URLs** de acceso
2. ✅ **Crear credenciales demo** para presentación
3. ✅ **Configurar monitoreo** básico
4. ✅ **Actualizar README** con enlaces live
5. ✅ **Crear portfolio entry** con screenshots

### Para Portfolio/LinkedIn
1. ✅ **Screenshots** profesionales
2. ✅ **Video demo** de funcionalidades
3. ✅ **Caso de estudio** técnico
4. ✅ **Metrics dashboard** de performance
5. ✅ **Testimonial** simulado de "cliente"

---

## 📞 Soporte

Para problemas específicos del despliegue:

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Firebase Hosting**: https://firebase.google.com/docs/hosting

---

**🚀 ¡Éxito en el despliegue! Tu proyecto estará live en minutos.**