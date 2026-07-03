# Lyria Web

Aplicación web para **Lyria**, una plataforma orientada a la experiencia de usuario en el sector de alimentos y bebidas. SPA renderizada completamente en el cliente.

---

## Stack tecnológico

| Tecnología       | Versión / Detalle               |
| ---------------- | ------------------------------- |
| React            | 19                              |
| TypeScript       | ~6.0 (modo estricto)            |
| Vite             | 8                               |
| Tailwind CSS     | v4 (`@tailwindcss/vite`)        |
| Lucide React     | Iconos SVG como componentes     |

---

## Arquitectura

El proyecto sigue una **Feature-Based Architecture**: cada dominio funcional vive en su propia carpeta dentro de `src/features/` y es autónomo en componentes, hooks, tipos y vistas.

### Estructura de carpetas

```
src/
  core/             # Configuración global: estilos, assets, App.tsx
    styles/         # Estilos globales (global.css con Tailwind)
  assets/           # Imágenes, fuentes y recursos estáticos
  layouts/          # Layouts globales (AppShell)
  features/         # Módulos funcionales por dominio
    home/           # Feature: pantalla de inicio
      components/   # Componentes UI de la feature
      data/         # Datos mock
      domain/       # Tipos del dominio
      HomeScreen.tsx
      index.ts
  main.tsx          # Entry point
```

### Convención interna de cada feature

```
features/NombreFeature/
  components/   # Componentes UI específicos
  hooks/        # Custom hooks
  types/        # Tipos TypeScript
  views/        # Vistas / páginas
  routes.ts     # Rutas (cuando se configure routing)
  index.ts      # Barrel export
```

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd lyria-web

# Instalar dependencias
npm install
```

---

## Comandos disponibles

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Type-check (tsc) + build de producción
npm run lint      # Revisión de código con ESLint
npm run preview   # Vista previa del build de producción
```

---

## Estado actual

- Pantalla de inicio (`home`) implementada con componentes UI y datos mock.
- Layout global (`AppShell`) creado.
- **No configurados aún:** routing, estado global, cliente API, autenticación, test runner.
- Proyecto en etapa inicial de desarrollo.

---

## Reglas de desarrollo

- TypeScript en modo estricto (`noUnusedLocals`, `noUnusedParameters`).
- Usar clases utilitarias de Tailwind; evitar CSS global innecesario.
- Cada feature es autónoma: no importar directamente entre features.
- Si algo es compartido entre features, evaluar si pertenece a `core/`.
- No agregar dependencias sin justificación.
- No crear carpetas globales `components/`, `hooks/`, `types/` o `pages/` en `src/`.

---

## Validaciones antes de subir cambios

Antes de hacer push, asegurarse de que pasen:

```bash
npm run build     # Debe compilar sin errores
npm run lint      # Debe pasar sin warnings ni errores
```

---

## Variables de entorno

Actualmente no se utilizan variables de entorno. Cuando se necesiten:

- Crear un archivo `.env` en la raíz del proyecto (no se versiona).
- Opcionalmente, mantener un `.env.example` con las variables requeridas (sin valores sensibles).
- En Vite, las variables públicas deben usar el prefijo `VITE_`.

---

## Licencia

Proyecto privado. Todos los derechos reservados.
