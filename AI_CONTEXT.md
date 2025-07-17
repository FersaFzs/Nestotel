# CONTEXTO DEL PROYECTO HOTEL-NEXT

## Stack y Versiones
- **Frontend:** Next.js 14 (App Router), Tailwind CSS 3.4, GSAP 3.12, React 18, Shadcn/ui (opcional)
- **Backend:** Next.js API Routes + Zod (validación), Mongoose 8, MongoDB 7 (Docker)
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
- **Docker:** multi-stage build, pnpm, caché de dependencias, compose con MongoDB y volúmenes.
- **Testing:** Jest para unitarios, Cypress para E2E.
- **Variables de entorno:** `NEXT_PUBLIC_` para frontend, resto en `.env.local` (no versionar).
- **Scripts package.json:** dev, build, start, test, test:e2e, lint, format, prepare (husky).
- **CI/CD:** workflows en `.github/workflows/`.

## Objetivo
Desarrollar una app de hotel robusta, profesional, dockerizada, con autenticación, reservas, panel admin, animaciones y tests, lista para producción y CI/CD.

---

**Este archivo sirve como referencia para la IA y para cualquier desarrollador que se incorpore al proyecto.** 