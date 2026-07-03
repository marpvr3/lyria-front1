# CLAUDE.md

Guía de referencia para Claude Code al trabajar en este repositorio.

---

## Contexto del proyecto

- **Nombre:** lyria-web
- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 (SPA, renderizado solo en cliente)
- **Punto de entrada:** `index.html` → `src/main.tsx` → monta `<App />` en `#root`
- **Estado actual:** Proyecto en etapa inicial. No hay routing, estado global, cliente API, autenticación ni test runner configurados.

---

## Comandos del proyecto

```bash
npm run dev       # Servidor de desarrollo Vite con HMR
npm run build     # Type-check (tsc) + build de producción
npm run lint      # Revisión con ESLint
npm run preview   # Vista previa del build de producción
```

No hay test runner configurado. Validar con `npm run build` y `npm run lint`.

---

## Arquitectura

La arquitectura elegida es **Feature-Based Architecture**, basada en el patrón descrito en:
- [Artículo de referencia](https://dev.to/naserrasouli/scalable-react-projects-with-feature-based-architecture-117c)
- [Repositorio de referencia](https://github.com/naserrasoulii/feature-based-react)

### Estructura del proyecto

```
src/
  core/       # Configuración global: estilos, assets, config, providers, tipos compartidos
  layouts/    # Layouts globales de la aplicación (header, footer, sidebar)
  features/   # Módulos funcionales independientes por dominio
  main.tsx    # Entry point de Vite
```

### Estructura interna de cada feature

Cuando se cree una feature, debe seguir esta convención:

```
features/NombreFeature/
  components/   # Componentes UI específicos de la feature
  hooks/        # Custom hooks de la feature
  types/        # Tipos TypeScript de la feature
  views/        # Vistas/páginas de la feature
  routes.ts     # Configuración de rutas de la feature (cuando exista routing)
```

### Estado actual

- `core/` existe con estilos globales y el componente raíz `App.tsx`.
- `layouts/` y `features/` se crearán cuando haya necesidad real.

---

## Reglas de Feature-Based Architecture

- `core/` → configuración global de la aplicación (estilos, config, providers, tipos compartidos). No lógica de negocio.
- `layouts/` → layouts reutilizables a nivel de aplicación. No lógica de negocio.
- `features/` → cada feature es autónoma; no debe importar de otras features directamente.
- Si algo es compartido por varias features, evaluar si pertenece a `core/`.
- No debe existir una carpeta global `components/`, `hooks/`, `types/` o `pages/` en `src/` para lógica de negocio.
- No crear carpetas vacías ni anticipar features sin necesidad real.
- No mover archivos masivamente sin explicar el motivo.
- Mantener la estructura simple mientras el proyecto esté en etapa inicial.

---

## Tailwind CSS

- Integrado con Vite mediante `@tailwindcss/vite`.
- La directiva `@import "tailwindcss"` está en `src/core/styles/global.css`.
- Usar clases utilitarias de Tailwind de forma clara y directa.
- Evitar CSS global innecesario; preferir clases utilitarias.
- No crear un design system completo hasta que exista necesidad real.
- Estilos compartidos globales van en `core/styles/` solo si son verdaderamente globales.

---

## Reglas de desarrollo

- TypeScript en modo estricto: `noUnusedLocals`, `noUnusedParameters` activados.
- Target ES2023, resolución de módulos en modo `bundler`.
- No agregar dependencias sin justificar su necesidad explícitamente.
- No instalar librerías de routing, estado global, cliente API ni autenticación sin instrucción explícita.
- Preferir editar archivos existentes antes de crear nuevos.
- No crear archivos de documentación (`.md`) adicionales salvo que se pida.

---

## Reglas para Claude Code

- Revisar la estructura existente antes de modificar o crear archivos.
- No cambiar el stack tecnológico sin autorización.
- No eliminar archivos existentes sin explicar el motivo.
- No crear routing, estado global, cliente API ni autenticación sin instrucción explícita.
- No hacer commit, push, pull request ni cambios de rama sin instrucción explícita.
- Si un comando falla, reportar el error claramente sin ocultarlo ni corregir problemas ajenos al cambio solicitado.

---

## Formato de respuesta esperado

Al finalizar cualquier tarea, reportar:

1. **Resumen** — qué se hizo y por qué.
2. **Archivos modificados** — lista de archivos creados, editados o eliminados.
3. **Comandos ejecutados** — comandos corridos durante la tarea.
4. **Resultado de validaciones** — salida de `npm run build` y `npm run lint`.
5. **Pendientes o riesgos** — decisiones diferidas, deudas técnicas o riesgos detectados.
