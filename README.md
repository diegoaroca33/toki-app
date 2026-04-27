# Toki

App PWA para entrenar comunicación funcional, dirigida principalmente a niños y
adolescentes con discapacidad intelectual (ej. síndrome de Down). Stack:
React 18 + Vite 5, deploy en Vercel.

## Entornos

Trabajamos con dos entornos paralelos. **Cualquier feature nueva o bug fix
pasa primero por Toki Test. Cuando Diego valida en tablet con Guillermo, se
mergea a main y llega a producción.**

| Entorno | Branch | Vercel project | Variable | Comportamiento |
|---|---|---|---|---|
| **Toki** (producción) | `main` | `toki-app` | `VITE_IS_TEST=` (vacío) | Sin flags experimentales por defecto. Cambios solo cuando se mergea desde una rama validada. |
| **Toki Test** | rama de desarrollo activa | `toki-app-test` | `VITE_IS_TEST=true` | Todos los flags experimentales activos por defecto (`toki_layout_v2`, `toki_ciencias_piloto`, `toki_random_v2`, etc.). Manifest PWA con nombre "Toki Test", theme color naranja, badge "TEST" siempre visible. |

### Flujo de cambios

```
[crear rama desarrollo]
        ↓
[push commits a la rama]
        ↓
Vercel rebuild Toki Test  ← Diego prueba en tablet con Guillermo
        ↓
[validación OK]
        ↓
[merge PR a main]
        ↓
Vercel rebuild producción ← Guillermo recibe el cambio
        ↓
[setear Production branch del Test a la nueva rama de desarrollo]
```

### Para Diego (uso diario)

- App de Guillermo (validada): instala el icono de la PWA con nombre **"Toki"**.
- App de pruebas: instala el icono **"Toki Test"** (nombre y theme color
  naranja, badge "TEST" arriba a la derecha en todas las pantallas).
- Las dos viven en paralelo en la tablet con datos independientes
  (cada PWA tiene su propio localStorage).

### Override del usuario sobre el default del entorno

Aunque en Toki Test los flags experimentales estén activos por defecto, si
en algún momento Diego decide desactivarlos manualmente (Settings o F12),
se respeta su elección. La lógica es:

- Si `localStorage.toki_<flag>` está en `'true'` → activo, sea cual sea el entorno.
- Si `localStorage.toki_<flag>` está en `'false'` → inactivo, sea cual sea el entorno.
- Si `localStorage.toki_<flag>` NO está → se usa el default del entorno
  (`true` en Test, `false` en producción).

Para volver al default, borra la clave de localStorage:
```js
localStorage.removeItem('toki_layout_v2');
location.reload();
```

## Setup local

```bash
npm ci
npm run dev      # arranca Vite en :5173
npm run test     # vitest 57/57
npm run build    # build de producción
```

Para simular el entorno Test en local:
```bash
VITE_IS_TEST=true npm run dev
```
(Windows PowerShell: `$env:VITE_IS_TEST="true"; npm run dev`)

## Salvaguardas absolutas

- **Presentación "Síndrome de Down" de Guillermo** (constants.js `QUIEN_SOY` +
  `/public/quiensoy/01-25.jpg`): NUNCA se toca. Está triplemente respaldada
  (código fuente + git tracked + snapshot en `scripts/backups/`).
- **GROUPS legacy**: la estructura de planetas original sin `_V2` se mantiene
  intacta. Sólo se modifican `GROUPS_V2` y los lvKeys nuevos behind flag.
- **Migraciones de localStorage**: cuando hay alguna, se hace un backup
  automático en `toki_backup_<tag>_<timestamp>` antes de tocar nada.

## Setup del proyecto Toki Test en Vercel

Pasos manuales (intervención humana en cuenta de Vercel) en
[`docs/SETUP-TOKI-TEST.md`](docs/SETUP-TOKI-TEST.md).

## Stack y archivos clave

- `src/App.jsx` — componente raíz, dispatch de módulos por sesión.
- `src/constants.js` — paletas, `LV_OPTS` (niveles por módulo), `GROUPS`/`GROUPS_V2`.
- `src/utils.js` — helpers transversales, feature flags, migraciones.
- `src/modules/Ex*.jsx` — un módulo por tipo de ejercicio.
- `src/data/*.json` — corpus de contenido (Ciencias, Piensa, Emociones, etc.).
- `src/components/SpeakPanel.jsx` — corazón de DILO oral con micrófono.
- `src/components/TokiPlayground.jsx` — mascota Toki + comandos de voz.
- `public/quiensoy/` — imágenes de la presentación de Síndrome de Down.
- `public/ciencias/` — imágenes del piloto Ciencias.
- `public/fonts/escolar*.ttf` — caligrafía escolar española usada en
  ESCRIBE minúsculas.
