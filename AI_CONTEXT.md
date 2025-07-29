# CONTEXTO DEL PROYECTO HOTEL-NEXT

## Stack y Versiones

- **Frontend:** Next.js 14 (App Router), Tailwind CSS 3.4, GSAP 3.12, React 18,
  Shadcn/ui (opcional)
- **Backend:** Next.js API Routes + Zod (validación), Mongoose 8, MongoDB 7
  (Docker)
- **Auth:** Firebase/Google
- **Testing:** Jest 29 + React Testing Library, Cypress 13 (E2E)
- **Herramientas:** pnpm 8, ESLint, Prettier, Husky, Docker 24+
- **Node:** 20 LTS

## Estructura de Carpetas

```
hotel-next/
├── .github/workflows/       # CI/CD (test + deploy)
│   └── deploy.yml
├── app/                     # Next.js App Router
│   ├── (auth)/              # Autenticación
│   ├── (admin)/             # Panel admin (ruta protegida)
│   ├── api/                 # Endpoints API
│   ├── layout.tsx           # Layout raíz obligatorio
│   └── page.tsx             # Home
├── components/              # Componentes UI
├── lib/
│   ├── db/                  # Conexión MongoDB (Mongoose)
│   └── utils/               # Helpers
├── styles/
│   └── animations/          # GSAP (ej: fade-in.ts)
├── public/                  # Archivos estáticos
├── tests/
│   ├── unit/                # Jest + RTL
│   └── e2e/                 # Cypress
├── docker/                  # Configs Docker
│   └── mongo/               # Volúmenes para DB
├── .env.local               # Variables de entorno
├── Dockerfile               # Next.js + Node
├── docker-compose.yml       # Servicios (Next + MongoDB)
├── .dockerignore
├── package.json             # Scripts + dependencias
├── pnpm-lock.yaml
├── tailwind.config.js
├── postcss.config.js
├── jest.config.js
├── cypress.config.js
├── .eslintrc.js
├── .prettierrc
├── next.config.js
└── README.md
```

## Convenciones y Consejos

- **Server Actions** para mutaciones, React Server Components.
- **Tailwind:** content correcto en config, animaciones extendidas.
- **GSAP:** usar `@gsap/react` y `useGSAP` para SSR-friendly.
- **Docker:** multi-stage build, pnpm, caché de dependencias, compose con
  MongoDB y volúmenes.
- **Testing:** Jest para unitarios, Cypress para E2E.
- **Variables de entorno:** `NEXT_PUBLIC_` para frontend, resto en `.env.local`
  (no versionar).
- **Scripts package.json:** dev, build, start, test, test:e2e, lint, format,
  prepare (husky).
- **CI/CD:** workflows en `.github/workflows/`.

## Estado Actual del Proyecto

### ✅ **Completado:**

- **Landing Page:** Diseño espectacular con animaciones GSAP complejas
  - Hero-Hall transition cinematográfica
  - Secciones animadas: Habitaciones, Eventos, Jardín con fotos polaroid
  - Header inteligente con hide/show
  - Footer completo y elegante
  - Componente de reservas lateral deslizable
- **Backend API:** Endpoints para users, rooms, reservations, invoices
- **Base de datos:** Modelos MongoDB con Mongoose para User, Room, Reservation,
  Invoice
- **Validación:** Esquemas Zod para todas las entidades
- **Docker:** Configuración completa con MongoDB
- **Testing:** Configuración Jest y Cypress

### 🔄 **En progreso:**

- Navegación del header a secciones
- Decisión de próximos pasos de desarrollo

### 📋 **Backend funcionalidades disponibles:**

- **Users:** CRUD completo, autenticación
- **Rooms:** Gestión de habitaciones y disponibilidad
- **Reservations:** Sistema completo de reservas
- **Invoices:** Facturación electrónica con normativas
- **Payments:** Pasarela de pagos integrada

### 🎨 **Diseño y UX:**

- **Tema:** Hotel elegante con paleta negro/dorado
- **Animaciones:** GSAP ScrollTrigger para experiencias cinematográticas
- **Responsivo:** Tailwind CSS con breakpoints móvil-first
- **Tipografía:** Font serif para elegancia, sans-serif para legibilidad

### 📱 **Páginas planificadas:**

- **Auth:** Login/Register con Firebase/Google
- **Reservas:** Flujo completo de booking
- **Habitaciones:** Detalle y galería de rooms
- **Perfil:** Dashboard de usuario
- **Admin:** Panel de administración
- **Información:** Páginas institucionales

## Próximos Pasos Sugeridos

### **Opción A: Auth + Reservas (Funcionalidad Core)**

- Implementar login/register
- Crear página de reservas funcional
- Conectar con backend de pagos
- **Ventaja:** Funcionalidad principal operativa

### **Opción B: Páginas Informativas (Frontend)**

- Detalle de habitaciones con galerías
- Página "Sobre nosotros"
- Información de servicios
- **Ventaja:** Contenido completo sin complejidad backend

### **Opción C: Híbrido**

- Páginas de habitaciones (frontend)
- Sistema auth básico
- **Ventaja:** Balance contenido/funcionalidad

## Objetivo

Desarrollar una app de hotel robusta, profesional, dockerizada, con
autenticación, reservas, panel admin, animaciones y tests, lista para producción
y CI/CD.

---

**Este archivo sirve como referencia para la IA y para cualquier desarrollador
que se incorpore al proyecto.**
