# Playwright Framework - SDET Portfolio

[![Playwright Tests](https://github.com/Targoos/playwright-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/Targoos/playwright-framework/actions/workflows/playwright.yml)

Framework de testing E2E construido con Playwright + TypeScript, diseñado con foco en arquitectura, mantenibilidad y buenas prácticas de SDET (Software Development Engineer in Test).

## Stack

- **Playwright** `^1.63.0` — Framework de testing E2E y API
- **TypeScript** `^5.6.2` — Tipado estricto
- **Zod** `^4.6.5` — Validación de schemas para contract testing
- **Node.js** `20+` — Runtime
- **dotenv** `^16.4.5` — Manejo de variables de entorno
- **GitHub Actions** — CI/CD

## Estructura del proyecto

```text
playwright-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD: corre tests en cada push/PR
├── src/
│   ├── api/                        # Cliente HTTP y endpoints
│   │   ├── ApiClient.ts
│   │   └── endpoints.ts
│   ├── fixtures/                   # Fixtures custom de Playwright
│   │   ├── base.fixture.ts
│   │   └── api.fixture.ts
│   ├── models/                     # Tipos, schemas y datos de dominio
│   │   ├── api.schemas.ts
│   │   ├── api.types.ts
│   │   ├── user.types.ts
│   │   └── users.data.ts
│   ├── pages/                      # Page Objects
│   │   ├── BasePage.ts
│   │   └── LoginPage.ts
│   └── utils/                      # Utilidades compartidas (pendiente)
├── tests/
│   ├── api/
│   │   └── users.spec.ts           # Tests de API
│   └── e2e/
│       └── login.spec.ts           # Tests E2E de login
├── .env.example                    # Plantilla de variables de entorno
├── playwright.config.ts            # Configuración de Playwright
└── tsconfig.json                   # Configuración de TypeScript
```

### Por qué esta estructura

- **`src/` separado de `tests/`**: el código del framework (Page Objects, fixtures, helpers) no es test. Mezclarlos genera acoplamiento y dificulta el mantenimiento.
- **`pages/`**: Page Object Model. Cada página de la app tiene su clase. Si la UI cambia, se modifica un archivo, no 50 tests.
- **`fixtures/`**: setup/teardown reutilizable inyectado en los tests. Elimina repetición de `new PageObject(page)` en cada test.
- **`models/`**: tipos de dominio y datasets centralizados. Sin strings sueltos en los tests.
- **`tests/e2e/` y `tests/api/`**: separación por tipo de test, alineado con la pirámide de testing.

## Decisiones de diseño

### 1. Page Objects sin asserts de negocio

Los Page Objects solo exponen acciones y locators. Los asserts de negocio viven en los tests.

**Por qué**: si un Page Object verifica "el login redirige a /inventory", queda acoplado al resultado esperado del negocio. Si mañana cambia el flujo, hay que tocar el Page Object en vez del test. El test debe ser explícito sobre qué valida.

**Trade-off aceptado**: los métodos helper como `expectUrl()` en `BasePage` encapsulan asserts de sincronización (esperar que la URL cambie después de una acción). Es un compromiso entre pureza arquitectónica y legibilidad del test.

### 2. Fixtures custom en lugar de `beforeEach` global

Cada test que necesita `LoginPage` lo recibe inyectado como fixture. Cero `new LoginPage(page)` repetido.

**Por qué**: los fixtures son componibles, tipados y solo se ejecutan si el test los pide. Los `beforeEach` globales se ejecutan siempre, incluso si no son necesarios.

### 3. Cross-browser por defecto

El framework corre los mismos tests en Chromium, Firefox y WebKit.

**Por qué**: detecta diferencias de comportamiento entre motores de renderizado que un solo navegador no ve. En producción, los usuarios usan distintos navegadores.

### 4. TypeScript estricto con alias de paths

`tsconfig.json` con `strict: true` y alias `@pages/*`, `@fixtures/*`, `@models/*`.

**Por qué**: el tipado estricto previene bugs. Los alias evitan imports relativos frágiles como `../../../src/pages/LoginPage`.

### 5. CI/CD con GitHub Actions

Workflow que corre en cada push y PR a `main`: typecheck → tests → publica reporte.

**Por qué**: un framework sin CI no es un framework de producción. El pipeline garantiza que cada cambio no rompe nada, y publica el reporte HTML como artefacto descargable.

### 6. Playwright Test como runner, no Playwright library

Usamos `@playwright/test` (el runner) en lugar de la librería suelta `playwright`.

**Por qué**: el runner incluye test fixtures, assertions con auto-wait, paralelización, reporters y trace viewer. La librería suelta requiere construir todo eso a mano.

### 7. Separación de proyectos E2E y API

Los tests E2E corren en 3 navegadores (Chromium, Firefox, WebKit). Los tests de API corren una sola vez en un proyecto `api` sin navegador.

**Por qué**: los tests de API usan `APIRequestContext`, que es independiente del navegador. Correrlos por navegador duplica ejecuciones sin aportar valor. Los proyectos de navegador usan `testIgnore` para excluir `tests/api/`, y el proyecto `api` usa `testMatch` para incluir solo esos tests.

### 8. Contract testing con Zod

Los schemas de validación de respuestas de API están definidos con Zod en `src/models/api.schemas.ts`.

**Por qué**: Zod valida tipos, formatos (email, URL) y estructura en runtime. Un solo schema se reutiliza en múltiples tests. Si la API cambia su contrato, el schema falla con un error detallado que indica el campo exacto que no cumplió. Es contract testing real, no solo validación de status codes.

### 9. Nomenclatura de archivos con sufijos

Los archivos siguen una convención basada en sufijos: `.types.ts` para tipos, `.data.ts` para datasets, `.spec.ts` para tests, `.fixture.ts` para fixtures, `.schemas.ts` para schemas de validación.

**Por qué**: el nombre del archivo refleja su contenido. Es fácil de entender para cualquiera que entre al repo, y escala bien a medida que el proyecto crece.

## Cómo correr el proyecto

### Requisitos

- Node.js 20+
- npm 10+

### Setup

```bash
# Clonar el repo
git clone https://github.com/Targoos/playwright-framework.git
cd playwright-framework

# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install

# Copiar variables de entorno
cp .env.example .env
```

## Comandos disponibles

| Comando               | Descripción                           |
| :-------------------- | :------------------------------------ |
| `npm test`            | Corre todos los tests (E2E + API)     |
| `npm run test:headed` | Corre los tests con navegador visible |
| `npm run test:ui`     | Abre el modo UI de Playwright         |
| `npm run test:debug`  | Corre los tests en modo debug         |
| `npm run typecheck`   | Verifica tipos sin compilar           |
| `npm run report`      | Abre el último reporte HTML           |

### Ejecutar solo un tipo de test

```bash
# Solo tests E2E
npx playwright test tests/e2e/

# Solo tests de API
npx playwright test --project=api

# Solo un test específico
npx playwright test -g "login exitoso"
```

## Estado del proyecto

- ✅ 9 tests E2E cross-browser (3 escenarios × 3 navegadores)
- ✅ 4 tests de API con validación de schemas (Zod)
- ✅ CI/CD funcional con GitHub Actions
- ✅ TypeScript estricto sin errores
- ⏳ Más flujos E2E: inventario, carrito, checkout (próximo)
- ⏳ Reportes de cobertura (próximo)

## Roadmap

- [x] Setup inicial con POM + fixtures
- [x] Cross-browser (Chromium, Firefox, WebKit)
- [x] CI/CD con GitHub Actions
- [x] Tests de API con `request` fixture
- [x] Contract testing con Zod
- [ ] Flujos E2E: inventario, carrito, checkout
- [ ] Manejo de flakiness con retries selectivos
- [ ] Reporte de cobertura de código
- [ ] Tests de accesibilidad

## Autor

**Tulio Abraham Ramirez**

- GitHub: [@Targoos](https://github.com/Targoos)
- Email: [tulioramirez0119@gmail.com](mailto:tulioramirez0119@gmail.com)
