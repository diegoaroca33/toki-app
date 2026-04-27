# Setup del proyecto Toki Test en Vercel

Pasos manuales que **solo Diego puede hacer** (Code no tiene acceso a tu
cuenta de Vercel). Tiempo estimado: 5 minutos.

## Pre-requisito

Estos cambios deben estar ya commiteados en la rama de desarrollo activa
(actualmente `block-1-critical-bugs`). Code los ha pusheado.

Archivos clave que componen la infraestructura del entorno Test:
- `src/utils.js` — `isTestEnv()` + `flagWithEnvDefault()` que activan flags
  experimentales por defecto cuando `VITE_IS_TEST=true`.
- `src/components/TestBadge.jsx` — badge naranja "TEST" en esquina superior
  derecha.
- `src/main.jsx` — al arrancar, si `VITE_IS_TEST=true`, sustituye el título
  de pestaña, theme-color y manifest PWA.
- `public/manifest-test.json` — manifest PWA para Toki Test (name "Toki Test",
  theme-color naranja).
- `README.md` — documentación del flujo.

## Paso 1 — Crear segundo proyecto en Vercel

1. Entrar en https://vercel.com/dashboard.
2. Pulsar **Add New** → **Project**.
3. **Import Git Repository**: seleccionar `diegoaroca33/toki-app` (la repo que
   ya está conectada con el proyecto de producción).
4. **Project Name**: poner `toki-app-test`.
   - Si Vercel rechaza el nombre por colisión, alternativas:
     - `toki-test`
     - `toki-app-staging`
     - `toki-app-pruebas`
   - El subdominio resultante será `<project-name>.vercel.app`.
5. **Framework Preset**: Vite (debería autodetectar).
6. **Root Directory**: `.` (raíz del repo, no cambiar).
7. **Build Command**: `npm run build` (default, no cambiar).
8. **Output Directory**: `dist` (default, no cambiar).

⚠️ **No pulses Deploy todavía**. Antes hay que añadir las variables de
entorno y configurar la branch.

## Paso 2 — Variables de entorno

Antes del primer deploy, en la misma pantalla del wizard (o luego en
**Settings → Environment Variables** del proyecto):

| Nombre | Valor | Aplicar a |
|---|---|---|
| `VITE_IS_TEST` | `true` | Production, Preview, Development |

Pulsar **Add** y guardar.

## Paso 3 — Configurar la Production Branch

1. Una vez creado el proyecto, ir a **Settings → Git**.
2. **Production Branch**: cambiar de `main` a `block-1-critical-bugs` (o la
   rama de desarrollo activa que toque en cada momento).
3. Guardar.

## Paso 4 — Deploy

1. Volver a la pestaña principal del proyecto.
2. Pulsar **Deploy** o **Redeploy** del último commit de la rama.
3. Esperar 1-2 minutos a que termine el build.

## Paso 5 — Verificar

1. Abrir la URL `toki-app-test.vercel.app` (o la que asigne Vercel).
2. Deberías ver:
   - Pestaña del navegador con título "Toki Test — Pruebas".
   - Badge naranja "TEST" arriba a la derecha desde la primera pantalla.
   - Theme-color naranja al añadir a pantalla de inicio.
3. Comprobar que la URL de producción `toki-app.vercel.app` (la habitual)
   sigue funcionando intacta y sin badge TEST.

## Paso 6 — Instalar como PWA en la tablet

1. Abrir Toki Test en Chrome/Safari de la tablet.
2. Menú navegador → "Añadir a pantalla de inicio" o "Instalar app".
3. Aparecerá con nombre **"Toki Test"** y, en navegadores que lo soporten,
   theme color naranja.
4. Repetir el proceso con la URL de producción para tener **"Toki"** instalada
   por separado.
5. Las dos PWAs viven en paralelo con datos independientes (localStorage
   propio de cada una).

## Paso 7 — Mantenimiento del flujo

Cada vez que se mergea una rama de desarrollo a `main`:

1. La rama actual queda en `main` y se empieza una nueva (`bloque-2`,
   `feature-X`, etc.).
2. **Volver a Settings → Git → Production Branch** del proyecto Toki Test
   y cambiarla a la nueva rama.
3. El siguiente push a esa rama disparará un deploy automático en Toki Test.

(Alternativa: en el futuro podemos automatizar esto con un GitHub Action
que renombre la branch en Vercel, pero por ahora 1 click cada N días es
asumible.)

## Diferencias entre Toki y Toki Test después del setup

| Aspecto | Toki (producción) | Toki Test |
|---|---|---|
| URL | `toki-app.vercel.app` | `toki-app-test.vercel.app` |
| Branch | `main` | rama de desarrollo activa |
| `VITE_IS_TEST` | sin definir | `true` |
| `toki_layout_v2` default | OFF | ON |
| `toki_ciencias_piloto` default | OFF | ON |
| `toki_random_v2` default | OFF | ON |
| Título pestaña | "Toki — Aprende a decirlo" | "Toki Test — Pruebas" |
| theme-color PWA | `#080C18` (azul oscuro) | `#FF6B00` (naranja) |
| Badge "TEST" en pantalla | NO | SÍ (siempre visible) |
| Nombre PWA al instalar | "Toki" | "Toki Test" |

## Troubleshooting

**El badge TEST no aparece tras el deploy**:
1. Verifica en **Settings → Environment Variables** que `VITE_IS_TEST=true`
   está aplicada al ambiente Production.
2. Pulsa **Redeploy** sin caché (en el dropdown del último deployment,
   marcar "Use existing build cache" → desactivar).

**La URL del Test aún muestra el contenido de producción**:
1. Verifica en **Settings → Git** que la Production Branch del proyecto
   Toki Test es la rama de desarrollo, no `main`.
2. Mira el último commit que aparece en la pestaña Deployments — debe ser
   uno de la rama de desarrollo, no de main.

**No me deja instalar Toki Test como PWA aparte porque dice que ya hay una
"Toki" instalada**:
1. El navegador identifica las PWAs por el `start_url` y el dominio. Como
   los dominios son distintos (`toki-app` vs `toki-app-test`), debería
   permitir las dos. Si no, comprueba que has cerrado la sesión anterior
   y vuelve a intentar.
2. En iOS Safari, a veces hay que abrir la URL en Safari (no Chrome) para
   que aparezca la opción "Añadir a pantalla de inicio".

**Quiero un icono distinto para Toki Test (no el mismo logo)**:
- En `public/manifest-test.json` cambiar las rutas de los iconos a
  `/icon-test-192.png` y `/icon-test-512.png`.
- Subir esos archivos a `public/`.
- Code puede ayudarte a generar versiones del icono con un overlay
  "TEST" si lo pides explícitamente.

## Resumen

| Tarea | ¿Quién? | Tiempo |
|---|---|---|
| Pasos 1-5 (crear proyecto + config + verificar) | Diego en Vercel | 5 min |
| Paso 6 (instalar PWA en tablet) | Diego en tablet | 2 min |
| Mantenimiento (cambiar Production branch al pasar a otra rama) | Diego en Vercel | 30 seg |

Code no necesita hacer nada más en código para que esto funcione. Cuando
crees el proyecto Toki Test, todo lo demás se activa automáticamente al
detectar `VITE_IS_TEST=true` en el build.
