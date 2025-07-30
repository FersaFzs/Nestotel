# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Granada Inn! Este documento te ayudará a
comenzar.

## 📋 Tabla de Contenidos

- [🚀 Cómo Contribuir](#-cómo-contribuir)
- [🐛 Reportar Bugs](#-reportar-bugs)
- [💡 Solicitar Features](#-solicitar-features)
- [🔧 Configuración del Entorno](#-configuración-del-entorno)
- [📝 Guías de Código](#-guías-de-código)
- [🧪 Testing](#-testing)
- [📦 Pull Requests](#-pull-requests)
- [📄 Conventional Commits](#-conventional-commits)

## 🚀 Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/Nestotel.git
cd hotel-next

# Añade el repositorio original como upstream
git remote add upstream https://github.com/FersaFzs/Nestotel.git
```

### 2. Configuración del Entorno

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Iniciar servicios
docker-compose up -d mongo
pnpm dev
```

### 3. Crear Rama Feature

```bash
# Actualizar tu fork
git fetch upstream
git checkout master
git merge upstream/master

# Crear rama para tu feature
git checkout -b feature/tu-feature-nombre
```

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Buscar issues existentes** - Evita duplicados
2. **Probar en la última versión** - Asegúrate de que el bug persiste
3. **Recrear el bug** - Proporciona pasos claros

### Template de Bug Report

```markdown
## 🐛 Descripción del Bug

Descripción clara y concisa del bug.

## 🔄 Pasos para Reproducir

1. Ve a '...'
2. Haz clic en '...'
3. Desplázate hacia abajo hasta '...'
4. Ver error

## ✅ Comportamiento Esperado

Descripción de lo que debería pasar.

## 📸 Capturas de Pantalla

Si aplica, añade capturas de pantalla.

## 💻 Información del Sistema

- OS: [ej. macOS 14.0]
- Browser: [ej. Chrome 120.0]
- Node.js: [ej. 20.10.0]
- pnpm: [ej. 8.15.0]

## 📝 Información Adicional

Cualquier contexto adicional sobre el problema.
```

## 💡 Solicitar Features

### Template de Feature Request

```markdown
## 💡 Descripción de la Feature

Descripción clara de la funcionalidad que te gustaría ver.

## 🎯 Caso de Uso

¿Quién se beneficiaría de esta feature? ¿En qué situaciones sería útil?

## 💭 Solución Propuesta

Si tienes ideas sobre la implementación, compártelas.

## 🔄 Alternativas Consideradas

Otras soluciones que has considerado.

## 📝 Información Adicional

Cualquier contexto adicional.
```

## 🔧 Configuración del Entorno

### Prerrequisitos

- **Node.js** 20+
- **pnpm** 8+
- **Docker** y Docker Compose
- **MongoDB** (local o Atlas)
- **Firebase** project

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo
pnpm build            # Construir para producción
pnpm start            # Iniciar servidor de producción

# Testing
pnpm test             # Tests unitarios
pnpm test:watch       # Tests en modo watch
pnpm test:e2e         # Tests E2E con Cypress
pnpm test:coverage    # Tests con cobertura

# Calidad de Código
pnpm lint             # ESLint
pnpm lint:fix         # ESLint con auto-fix
pnpm format           # Prettier
pnpm type-check       # Verificación TypeScript

# Utilidades
pnpm analyze          # Análisis de bundle
pnpm seed             # Poblar base de datos
pnpm create-admin     # Crear usuario admin
```

## 📝 Guías de Código

### Estructura de Archivos

```
app/
├── (auth)/           # Rutas de autenticación
├── admin/            # Panel de administración
├── api/              # Endpoints API
├── habitacion/       # Páginas de habitaciones
├── reserva/          # Formulario de reserva
└── reservas/         # Lista de reservas

components/           # Componentes reutilizables
lib/
├── db/              # Modelos MongoDB
├── firebase/        # Configuración Firebase
├── hooks/           # Custom hooks
├── contexts/        # Contextos React
└── validators/      # Esquemas Zod
```

### Convenciones de Nomenclatura

- **Archivos**: `kebab-case` (ej. `reservation-form.tsx`)
- **Componentes**: `PascalCase` (ej. `ReservationForm`)
- **Variables**: `camelCase` (ej. `userData`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej. `API_BASE_URL`)
- **Tipos/Interfaces**: `PascalCase` (ej. `UserData`)

### Estilo de Código

- **Indentación**: 2 espacios
- **Comillas**: Comillas simples para strings
- **Punto y coma**: Obligatorio
- **Trailing comma**: En objetos y arrays
- **Imports**: Ordenados y agrupados

```typescript
// ✅ Correcto
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { User } from '@/lib/types';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Props {
  user: User;
  onSave: (data: User) => void;
}

export default function UserForm({ user, onSave }: Props) {
  const [data, setData] = useState(user);
  const router = useRouter();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    // Lógica aquí
  }, [data]);

  return (
    <form onSubmit={handleSubmit}>
      {/* JSX aquí */}
    </form>
  );
}
```

## 🧪 Testing

### Tests Unitarios

```typescript
// tests/unit/components.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservationForm from '@/components/ReservationForm';

describe('ReservationForm', () => {
  it('should submit form with valid data', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockOnSubmit = jest.fn();

    render(<ReservationForm user={mockUser} onSubmit={mockOnSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /reservar/i }));

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
```

### Tests E2E

```typescript
// tests/e2e/reservation.cy.js
describe('Reservation Flow', () => {
  it('should complete reservation process', () => {
    cy.visit('/reserva');
    cy.get('[data-testid="check-in"]').type('2024-01-15');
    cy.get('[data-testid="check-out"]').type('2024-01-17');
    cy.get('[data-testid="guests"]').type('2');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/reservas');
  });
});
```

### Cobertura Mínima

- **Unit Tests**: >80%
- **E2E Tests**: Cobertura de flujos críticos
- **Type Safety**: 100% TypeScript strict

## 📦 Pull Requests

### Checklist Antes de Enviar

- [ ] **Tests pasando** - `pnpm test` y `pnpm test:e2e`
- [ ] **Linting limpio** - `pnpm lint`
- [ ] **Tipos correctos** - `pnpm type-check`
- [ ] **Documentación actualizada** - README, comentarios
- [ ] **Commits convencionales** - Ver sección siguiente
- [ ] **Descripción clara** - Qué hace el PR y por qué

### Template de Pull Request

```markdown
## 📝 Descripción

Descripción clara de los cambios realizados.

## 🔗 Issue Relacionado

Closes #123

## ✅ Checklist

- [ ] Tests añadidos/actualizados
- [ ] Documentación actualizada
- [ ] Linting sin errores
- [ ] Tipos TypeScript correctos
- [ ] Commits convencionales

## 📸 Capturas de Pantalla

Si aplica, añade capturas de pantalla de los cambios.

## 🧪 Testing

Describe cómo has probado los cambios.

## 📝 Notas Adicionales

Cualquier información adicional relevante.
```

## 📄 Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para
mantener un historial de commits limpio.

### Tipos de Commits

```bash
feat:     nueva funcionalidad
fix:      corrección de bug
docs:     cambios en documentación
style:    cambios de formato (no afectan funcionalidad)
refactor: refactorización de código
test:     añadir o corregir tests
chore:    cambios en build, config, etc.
```

### Ejemplos

```bash
feat: add user authentication with Firebase
fix: resolve hover issue on room cards
docs: update README with installation guide
style: format code with Prettier
refactor: extract reservation logic to custom hook
test: add unit tests for ReservationForm
chore: update dependencies to latest versions
```

### Estructura Completa

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Ejemplo:

```bash
feat(auth): add Google OAuth integration

- Implement Google OAuth provider
- Add user profile management
- Update authentication context

Closes #123
```

## 🎯 Áreas de Contribución

### 🐛 Bugs Fáciles para Principiantes

- [ ] Correcciones de typos en documentación
- [ ] Mejoras en accesibilidad
- [ ] Optimizaciones de performance menores
- [ ] Tests faltantes

### 🚀 Features Intermedias

- [ ] Nuevas funcionalidades en el panel admin
- [ ] Mejoras en el sistema de reservas
- [ ] Integraciones con APIs externas
- [ ] Optimizaciones de UX

### 🔧 Mejoras Avanzadas

- [ ] Refactorización de arquitectura
- [ ] Optimizaciones de performance
- [ ] Nuevas integraciones complejas
- [ ] Mejoras en seguridad

## 📞 Contacto

- **Discord**: [Unirse al servidor](https://discord.gg/granadainn)
- **Email**: desarrollo@granadainn.com
- **Issues**: [GitHub Issues](https://github.com/FersaFzs/Nestotel/issues)

---

**¡Gracias por contribuir a Granada Inn! 🏨✨**
