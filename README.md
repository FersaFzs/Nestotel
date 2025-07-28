# 🏨 Granada Inn - Hotel Management System

Sistema de gestión hotelera moderno construido con Next.js 14, TypeScript y MongoDB. Incluye reservas, facturación electrónica española, panel de administración y autenticación Firebase.

## ✨ Características

### 🎨 Frontend
- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para diseño responsive
- **GSAP** para animaciones cinematográficas
- **Firebase Auth** para autenticación

### 🔧 Backend
- **API Routes** de Next.js
- **MongoDB** con Mongoose
- **Zod** para validación de datos
- **Docker** para desarrollo y producción

### 📊 Funcionalidades
- ✅ Sistema de reservas completo
- ✅ Facturación electrónica española (AEAT)
- ✅ Panel de administración
- ✅ Autenticación con Google/Firebase
- ✅ Gestión de habitaciones
- ✅ Reportes y estadísticas
- ✅ Testing con Jest y Cypress

## 🚀 Instalación

### Prerrequisitos
- Node.js 20+
- pnpm 8+
- Docker y Docker Compose
- MongoDB

### Configuración rápida

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/hotel-next.git
cd hotel-next

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Iniciar servicios
docker-compose up -d mongo
pnpm dev
```

## 🔧 Configuración

### Variables de entorno

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Firebase Admin (para facturación)
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=tu_proyecto_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com

# MongoDB
MONGODB_URI=mongodb://localhost:27017/hotel-next

# Facturación electrónica (opcional)
VERIFACTI_API_KEY=tu_api_key_verifacti
FACTURAE_API_KEY=tu_api_key_facturae
AEAT_API_KEY=tu_api_key_aeat
```

### Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication (Email/Password, Google)
3. Obtener configuración web
4. Configurar Firebase Admin SDK para facturación

### Configuración de facturación

Ver [E_INVOICE_SETUP.md](./E_INVOICE_SETUP.md) para configuración detallada.

## 📁 Estructura del proyecto

```
hotel-next/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── admin/             # Panel de administración
│   ├── api/               # Endpoints API
│   ├── reserva/           # Formulario de reserva
│   └── reservas/          # Lista de reservas
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuración
│   ├── db/               # Modelos MongoDB
│   ├── firebase/         # Configuración Firebase
│   ├── hooks/            # Custom hooks
│   └── validators/       # Esquemas Zod
├── public/               # Archivos estáticos
├── styles/               # Estilos globales
├── tests/                # Tests unitarios y E2E
└── docker/               # Configuración Docker
```

## 🧪 Testing

```bash
# Tests unitarios
pnpm test

# Tests E2E
pnpm test:e2e

# Linting
pnpm lint

# Formateo
pnpm format
```

## 🐳 Docker

```bash
# Desarrollo
docker-compose up -d

# Producción
docker build -t hotel-next .
docker run -p 3000:3000 hotel-next
```

## 📊 Funcionalidades principales

### 🏠 Landing Page
- Animaciones GSAP cinematográficas
- Secciones: Habitaciones, Eventos, Jardín
- Formulario de reserva lateral
- Diseño responsive elegante

### 🔐 Autenticación
- Login/Registro con email/password
- Login con Google
- Protección de rutas
- Context global de autenticación

### 📅 Sistema de Reservas
- Formulario multi-paso
- Validación en tiempo real
- Integración con habitaciones
- Confirmación por email

### 🧾 Facturación Electrónica
- Cumplimiento normativa española
- Integración con AEAT
- Generación de PDF/XML/QR
- APIs: Verifacti, Facturae, AEAT directo

### 👨‍💼 Panel de Administración
- Dashboard con estadísticas
- Gestión de reservas
- Gestión de usuarios
- Gestión de facturas
- Control de acceso por roles

## 🔒 Seguridad

- ✅ Validación de datos con Zod
- ✅ Autenticación Firebase
- ✅ Protección de rutas
- ✅ Sanitización de inputs
- ✅ Rate limiting en APIs
- ✅ CORS configurado
- ✅ Headers de seguridad

## 📈 Performance

- ✅ Server-side rendering
- ✅ Code splitting automático
- ✅ Optimización de imágenes
- ✅ Caching estratégico
- ✅ Bundle analysis
- ✅ Lighthouse score >90

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- 📧 Email: soporte@granadainn.com
- 📞 Teléfono: +34 958 123 456
- 🌐 Web: https://granadainn.com

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [GSAP](https://greensock.com/gsap/) - Animaciones
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [MongoDB](https://www.mongodb.com/) - Base de datos
- [Zod](https://zod.dev/) - Validación de esquemas

---

**Desarrollado con ❤️ para Granada Inn**
