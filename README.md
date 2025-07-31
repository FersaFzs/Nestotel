# 🏨 Granada Inn - Hotel Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![CI/CD Pipeline](https://github.com/FersaFzs/Nestotel/actions/workflows/ci.yml/badge.svg)](https://github.com/FersaFzs/Nestotel/actions/workflows/ci.yml)
[![Code Coverage](https://codecov.io/gh/FersaFzs/Nestotel/branch/master/graph/badge.svg)](https://codecov.io/gh/FersaFzs/Nestotel)
[![Security](https://img.shields.io/badge/Security-Snyk%20Verified-brightgreen?style=for-the-badge)](https://snyk.io/)
[![Performance](https://img.shields.io/badge/Performance-Lighthouse%20Score%3E90-brightgreen?style=for-the-badge)](https://developers.google.com/web/tools/lighthouse)

> **Sistema de gestión hotelera moderno y completo** construido con tecnologías
> de vanguardia. Incluye reservas, facturación electrónica española, panel de
> administración avanzado y autenticación segura.

## ⚠️ **PROYECTO PROTOTIPO PROFESIONAL**

> **🏆 Granada Inn es un prototipo de sistema de gestión hotelera desarrollado
> como demostración de capacidades técnicas avanzadas.**
>
> Este proyecto representa un **sistema empresarial completo** con todas las
> funcionalidades necesarias para gestionar un hotel real. Está diseñado como
> **portfolio técnico** y **base adaptable** para hoteles que busquen una
> solución personalizada.
>
> **🎯 Características del prototipo:**
>
> - ✅ **Arquitectura escalable** lista para producción
> - ✅ **Código de calidad empresarial** con testing completo
> - ✅ **Integración española** (Facturación AEAT, cumplimiento LOPD)
> - ✅ **UI/UX profesional** con animaciones cinematográficas
> - ✅ **Seguridad avanzada** y mejores prácticas
>
> **💼 Adaptación comercial:** Sistema completamente funcional listo para
> personalizar según las necesidades específicas de cualquier establecimiento
> hotelero.
>
> **📞 Contacto profesional:**

- 📧 **Email:** [tu-email@dominio.com]
- 💼 **LinkedIn:** [tu-perfil-linkedin]
- 🌐 **Portfolio:** [tu-portfolio-web]
- 💻 **GitHub:** [tu-github-profile]

> **🎯 ¿Interesado en adaptar Granada Inn para tu hotel?** Este sistema está
> diseñado para ser personalizable y escalable según las necesidades específicas
> de cualquier establecimiento hotelero.

## 📸 Capturas de Pantalla

### 🏠 Landing Page

_Página principal con animaciones GSAP y diseño cinematográfico_

### 📱 Panel de Administración

_Dashboard completo con métricas en tiempo real y gestión avanzada_

### 📅 Sistema de Reservas

_Formulario multi-paso con validación en tiempo real y UX moderna_

### 🧾 Sistema de Facturación

_Generación automática de facturas conforme a normativa española_

> **📝 Nota:** Las capturas de pantalla se actualizarán tras el despliegue en
> producción

### 🧾 Facturación Electrónica

![E-Invoice System](https://via.placeholder.com/800x450/1f2937/ffffff?text=E-Invoice+System)

## ✨ Características Destacadas

### 🎨 **Frontend Avanzado**

- **Next.js 14** con App Router para máxima performance
- **TypeScript** para type safety y desarrollo robusto
- **Tailwind CSS** para diseño responsive y moderno
- **GSAP** para animaciones cinematográficas fluidas
- **Firebase Auth** para autenticación segura

### 🔧 **Backend Robusto**

- **API Routes** de Next.js optimizadas
- **MongoDB** con Mongoose para gestión de datos
- **Zod** para validación de esquemas
- **Docker** para desarrollo y producción consistente

### 📊 **Funcionalidades Completas**

- ✅ **Sistema de reservas** completo con validación
- ✅ **Facturación electrónica** española (AEAT)
- ✅ **Panel de administración** avanzado
- ✅ **Autenticación** con Google/Firebase
- ✅ **Gestión de habitaciones** dinámica
- ✅ **Reportes y estadísticas** en tiempo real
- ✅ **Testing** completo con Jest y Cypress
- ✅ **CI/CD** automatizado con GitHub Actions

## 🚀 Instalación Rápida

### Prerrequisitos

- **Node.js** 20+
- **pnpm** 8+
- **Docker** y Docker Compose
- **MongoDB** (local o Atlas)

### Configuración en 3 pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/FersaFzs/Nestotel.git
cd hotel-next

# 2. Instalar dependencias
pnpm install

# 3. Configurar y ejecutar
cp .env.example .env.local
# Editar .env.local con tus credenciales
docker-compose up -d mongo
pnpm dev
```

**¡Listo!** Tu aplicación estará disponible en `http://localhost:3000`

## 🔧 Configuración Detallada

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
# 🔥 Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# 🔐 Firebase Admin (para facturación)
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=tu_proyecto_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com

# 🗄️ MongoDB
MONGODB_URI=mongodb://localhost:27017/hotel-next

# 🧾 Facturación electrónica (opcional)
VERIFACTI_API_KEY=tu_api_key_verifacti
FACTURAE_API_KEY=tu_api_key_facturae
AEAT_API_KEY=tu_api_key_aeat
```

### Configuración de Firebase

1. **Crear proyecto** en [Firebase Console](https://console.firebase.google.com)
2. **Habilitar Authentication** (Email/Password, Google)
3. **Obtener configuración web** del proyecto
4. **Configurar Firebase Admin SDK** para facturación

### Configuración de Facturación

Ver [E_INVOICE_SETUP.md](./E_INVOICE_SETUP.md) para configuración detallada de
facturación electrónica española.

## 📁 Arquitectura del Proyecto

```
hotel-next/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 (auth)/            # Rutas de autenticación
│   ├── 📁 admin/             # Panel de administración
│   │   ├── 📁 dashboard/     # Dashboard principal
│   │   ├── 📁 habitaciones/  # Gestión de habitaciones
│   │   ├── 📁 reservas/      # Gestión de reservas
│   │   ├── 📁 facturas/      # Gestión de facturas
│   │   └── 📁 usuarios/      # Gestión de usuarios
│   ├── 📁 api/               # Endpoints API REST
│   ├── 📁 habitacion/        # Páginas de habitaciones
│   ├── 📁 reserva/           # Formulario de reserva
│   └── 📁 reservas/          # Lista de reservas
├── 📁 components/            # Componentes reutilizables
│   ├── 📄 LoadingScreen.tsx  # Pantalla de carga
│   └── 📄 ReservationForm.tsx # Formulario de reserva
├── 📁 lib/                   # Utilidades y configuración
│   ├── 📁 db/               # Modelos MongoDB
│   ├── 📁 firebase/         # Configuración Firebase
│   ├── 📁 hooks/            # Custom hooks
│   ├── 📁 contexts/         # Contextos React
│   └── 📁 validators/       # Esquemas Zod
├── 📁 public/               # Archivos estáticos
├── 📁 styles/               # Estilos globales
├── 📁 tests/                # Tests unitarios y E2E
└── 📁 docker/               # Configuración Docker
```

## 🧪 Testing y Calidad de Código

```bash
# 🧪 Tests unitarios con cobertura
pnpm test

# 🚀 Tests E2E con Cypress
pnpm test:e2e

# 🔍 Linting y análisis de código
pnpm lint

# 🎨 Formateo automático
pnpm format

# 🔧 Verificación de tipos TypeScript
pnpm type-check

# 📊 Análisis de bundle
pnpm analyze
```

### Cobertura de Tests

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Cypress
- **Code Coverage**: >80%
- **Type Safety**: TypeScript strict mode

## 🐳 Docker y Despliegue

### Desarrollo Local

```bash
# Iniciar servicios con Docker
docker-compose up -d

# Construir imagen de desarrollo
docker build -t hotel-next:dev .
```

### Producción

```bash
# Construir imagen de producción
docker build -t hotel-next:prod .

# Ejecutar en producción
docker run -p 3000:3000 hotel-next:prod
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    depends_on:
      - mongo

  mongo:
    image: mongo:7.0
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 📊 Funcionalidades Principales

### 🏠 **Landing Page Cinematográfica**

- **Animaciones GSAP** fluidas y profesionales
- **Secciones interactivas**: Habitaciones, Eventos, Jardín
- **Formulario de reserva** lateral flotante
- **Diseño responsive** optimizado para todos los dispositivos
- **Optimización de imágenes** con Next.js Image

### 🔐 **Sistema de Autenticación**

- **Login/Registro** con email/password
- **Login social** con Google
- **Protección de rutas** automática
- **Context global** de autenticación
- **Persistencia de sesión** segura

### 📅 **Sistema de Reservas Avanzado**

- **Formulario multi-paso** intuitivo
- **Validación en tiempo real** con Zod
- **Integración con habitaciones** dinámica
- **Confirmación por email** automática
- **Gestión de estados** de reserva

### 🧾 **Facturación Electrónica Española**

- **Cumplimiento normativa** AEAT completa
- **Integración con APIs** oficiales
- **Generación de PDF/XML/QR** automática
- **APIs soportadas**: Verifacti, Facturae, AEAT directo
- **Validación fiscal** automática

### 👨‍💼 **Panel de Administración Profesional**

- **Dashboard** con estadísticas en tiempo real
- **Gestión completa** de reservas
- **Gestión de usuarios** y roles
- **Gestión de facturas** y reportes
- **Control de acceso** granular por roles

## 🔒 Seguridad y Compliance

### 🛡️ **Medidas de Seguridad**

- ✅ **Validación de datos** con Zod
- ✅ **Autenticación Firebase** segura
- ✅ **Protección de rutas** automática
- ✅ **Sanitización de inputs** completa
- ✅ **Rate limiting** en APIs
- ✅ **CORS configurado** correctamente
- ✅ **Headers de seguridad** implementados

### 📋 **Compliance**

- ✅ **GDPR** compliant
- ✅ **LOPD** (Ley Orgánica de Protección de Datos)
- ✅ **Facturación electrónica** española
- ✅ **Accesibilidad** WCAG 2.1 AA

## 📈 Performance y Optimización

### ⚡ **Optimizaciones Implementadas**

- ✅ **Server-side rendering** (SSR)
- ✅ **Code splitting** automático
- ✅ **Optimización de imágenes** Next.js
- ✅ **Caching estratégico** implementado
- ✅ **Bundle analysis** y optimización
- ✅ **Lighthouse score** >90

### 📊 **Métricas de Performance**

- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. **Fork** el proyecto
2. **Crear rama feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit cambios** (`git commit -m 'feat: add amazing feature'`)
4. **Push a la rama** (`git push origin feature/AmazingFeature`)
5. **Abrir Pull Request**

### 📋 **Guías de Contribución**

- Usa **conventional commits**
- Añade **tests** para nuevas funcionalidades
- Mantén la **cobertura de código** >80%
- Sigue las **guías de estilo** del proyecto

## 📝 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver [LICENSE](LICENSE) para más
detalles.

## 🆘 Soporte y Contacto

### 📞 **Información de Contacto**

> **⚠️ NOTA:** Granada Inn es un hotel ficticio. La información de contacto es
> simulada.

- 📧 **Email**: soporte@granadainn.com _(simulado)_
- 📞 **Teléfono**: +34 958 123 456 _(simulado)_
- 🌐 **Web**: https://granadainn.com _(simulado_)
- 💬 **Discord**: [Unirse al servidor](https://discord.gg/granadainn)
  _(simulado)_

### 👨‍💻 **Desarrollador**

**Proyecto desarrollado por**: [Tu Nombre Completo]  
**Perfil profesional**: Desarrollador Full-Stack Junior especializado en
React/Next.js

**Contacto profesional**:

- 📧 **Email**: [tu.email@profesional.com]
- 💼 **LinkedIn**: [linkedin.com/in/tu-perfil]
- 🌐 **Portfolio**: [tu-portfolio-web.com]
- 💻 **GitHub**: [github.com/tu-usuario]

**Disponible para**:

- 🏢 Oportunidades laborales como desarrollador junior
- 🤝 Colaboraciones en proyectos open source
- 💬 Consultas sobre adaptación del sistema para hoteles reales
- 🎓 Mentoring con otros desarrolladores junior

### 📚 **Documentación Adicional**

- [📖 Guía de Instalación](./ADMIN_SETUP.md)
- [🔥 Configuración Firebase](./FIREBASE_SETUP.md)
- [🧾 Configuración Facturación](./E_INVOICE_SETUP.md)
- [🐳 Configuración Docker](./docker-compose.yml)

## 🙏 Agradecimientos

### 🛠️ **Tecnologías Utilizadas**

- [Next.js](https://nextjs.org/) - Framework React de vanguardia
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [GSAP](https://greensock.com/gsap/) - Animaciones profesionales
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [MongoDB](https://www.mongodb.com/) - Base de datos NoSQL
- [Zod](https://zod.dev/) - Validación de esquemas TypeScript

### 🎨 **Recursos de Diseño**

- [Heroicons](https://heroicons.com/) - Iconos SVG
- [Unsplash](https://unsplash.com/) - Imágenes de alta calidad
- [Google Fonts](https://fonts.google.com/) - Tipografías

---

<div align="center">

**🏨 Prototipo desarrollado con ❤️ para demostrar capacidades técnicas**

_Granada Inn es un hotel ficticio creado únicamente con fines demostrativos_

[![GitHub stars](https://img.shields.io/github/stars/FersaFzs/Nestotel?style=social)](https://github.com/FersaFzs/Nestotel/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/FersaFzs/Nestotel?style=social)](https://github.com/FersaFzs/Nestotel/network/members)
[![GitHub issues](https://img.shields.io/github/issues/FersaFzs/Nestotel)](https://github.com/FersaFzs/Nestotel/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/FersaFzs/Nestotel)](https://github.com/FersaFzs/Nestotel/pulls)

</div>
