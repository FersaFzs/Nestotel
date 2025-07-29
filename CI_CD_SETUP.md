# 🚀 CI/CD Setup - Hotel Next

## 📋 Resumen del Pipeline

Este proyecto tiene un pipeline de CI/CD completo configurado con GitHub Actions
que incluye:

### 🔄 **Workflows Principales**

1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)

   - Tests unitarios y de integración
   - Linting y análisis de código
   - Build de la aplicación
   - Tests E2E con Cypress
   - Análisis de seguridad
   - Deployment automático

2. **Deploy** (`.github/workflows/deploy.yml`)

   - Deployment separado para staging y producción
   - Soporte para Docker como alternativa

3. **Code Quality** (`.github/workflows/code-quality.yml`)
   - Análisis con SonarQube
   - Análisis de bundle size
   - Análisis de performance con Lighthouse
   - Review de dependencias

### 🔧 **Configuraciones Adicionales**

- **Dependabot** (`.github/dependabot.yml`) - Actualización automática de
  dependencias
- **Codecov** (`codecov.yml`) - Análisis de cobertura de código
- **Snyk** (`.snyk`) - Análisis de seguridad

## 🛠️ Secrets Requeridos

Para que el pipeline funcione correctamente, necesitas configurar estos secrets
en GitHub:

### 🔐 **Firebase Secrets**

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### 🗄️ **Database Secrets**

```
MONGODB_URI
MONGODB_URI_STAGING
```

### 🚀 **Deployment Secrets**

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### 🔒 **Security Secrets**

```
SNYK_TOKEN
SONAR_TOKEN
LHCI_GITHUB_APP_TOKEN
```

### 🐳 **Docker Secrets** (Opcional)

```
DOCKER_USERNAME
DOCKER_PASSWORD
```

## 📊 **Jobs del Pipeline**

### 1. **Lint & Test**

- ✅ TypeScript type checking
- ✅ ESLint linting
- ✅ Jest tests con cobertura
- ✅ Upload de cobertura a Codecov

### 2. **Build**

- ✅ Build de la aplicación
- ✅ Upload de artifacts para E2E

### 3. **E2E Tests**

- ✅ Tests con Cypress
- ✅ Upload de screenshots y videos en caso de fallo

### 4. **Security Scan**

- ✅ npm audit
- ✅ Snyk security scan

### 5. **Deploy Staging**

- ✅ Trigger en branch `develop`
- ✅ Deploy a Vercel staging

### 6. **Deploy Production**

- ✅ Trigger en branches `main`/`master`
- ✅ Deploy a Vercel production

## 🎯 **Triggers**

### **Push/Pull Request**

- Branches: `main`, `master`, `develop`
- Ejecuta: Lint, Test, Build, E2E, Security

### **Workflow Run**

- Ejecuta deployment después de CI exitoso
- Staging: branch `develop`
- Production: branches `main`/`master`

### **Schedule**

- Code Quality: Lunes 2 AM
- Dependabot: Lunes 9 AM

## 📈 **Métricas y Cobertura**

### **Cobertura de Tests**

- **Objetivo:** 80%
- **Actual:** Configurado en Jest
- **Reporte:** Codecov

### **Calidad de Código**

- **SonarQube:** Análisis completo
- **Bundle Size:** Análisis automático
- **Performance:** Lighthouse CI

### **Security**

- **Snyk:** Vulnerabilidades
- **npm audit:** Dependencias
- **Dependency Review:** Pull requests

## 🚀 **Deployment**

### **Vercel (Recomendado)**

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

### **Docker (Alternativa)**

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: |
      ${{ secrets.DOCKER_USERNAME }}/hotel-next:latest
      ${{ secrets.DOCKER_USERNAME }}/hotel-next:${{ github.sha }}
```

## 🔧 **Configuración Local**

### **Pre-commit Hooks**

```bash
npm run prepare  # Instala Husky
```

### **Tests Locales**

```bash
npm test         # Tests unitarios
npm run test:e2e # Tests E2E
npm run lint     # Linting
```

### **Build Local**

```bash
npm run build    # Build de producción
```

## 📊 **Monitoreo**

### **GitHub Actions**

- Dashboard: https://github.com/[user]/hotel-next/actions
- Status badges en README

### **Codecov**

- Cobertura: https://codecov.io/gh/[user]/hotel-next
- Badge: `![Codecov](https://img.shields.io/codecov/c/github/[user]/hotel-next)`

### **SonarQube**

- Calidad: [URL de tu instancia SonarQube]
- Badge: `![SonarQube](https://img.shields.io/sonar/quality_gate/[project-key])`

## 🎉 **Estado Actual**

✅ **Pipeline completo funcionando** ✅ **Tests automáticos** ✅ **Linting
automático** ✅ **Security scanning** ✅ **Deployment automático** ✅
**Cobertura de código** ✅ **Análisis de calidad**

**Nivel de madurez:** **PRODUCCIÓN EMPRESARIAL** 🚀
