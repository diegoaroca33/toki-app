# TOKI v25.13 — Documento Maestro

## Estado actual
- **Version**: v25.13 (commit 91958a6)
- **Deploy**: Vercel (auto-deploy desde main)
- **Build**: 57 tests pass, build limpio
- **Bundle**: 1,171 kB principal + 7 chunks lazy (Settings 55kB, TokiPlayground 24kB, DoneScreen 16kB, VoiceRec 14kB, ExQuienSoy 11kB, MonthlyReport 8kB, MiCielo 2kB)

---

## Lo que se hizo en esta sesion (v25.13)

### Bugs criticos arreglados (7)
1. **adjScore invertido** — Ya no penaliza la nota al bajar exigencia. Devuelve nota cruda. El slider solo afecta el umbral de paso (passThreshold en SpeakPanel)
2. **saveP mutaba estado React in-place** — Ahora clona con `{...u}` antes de modificar. Arregla estrellas stuck y persistencia de totalStars3plus
3. **Modo guiado ejecutaba random** — Ahora llama `startGame()` correctamente
4. **position duplicado en style** — Eliminado `position:'relative'` que sobreescribia `position:'absolute'` en el cohete
5. **"Otra ronda" mostraba 0 ejercicios** — Reset completo de estado (st, sessionStars, goalCount, streaks, milestones, idx) antes de reiniciar
6. **Stale closure goalCount** — Nuevo `goalReachedRef` en vez de leer `goalCount` del closure
7. **Pausa no paraba ejercicios** — Evento `toki-pause` mata alive+SR+TTS. `resumeKey` fuerza re-mount al reanudar

### Mejoras de rendimiento (3)
8. **Mic 6s a 3s minimo** — Formula: `max(3, ceil(words*0.7)+2)`
9. **Burst reps 2+: 65% de duracion** del micro
10. **FraccionadoMode mic reducido** — `max(3, ceil(words*0.6)+2)`

### VoiceRec / Control module (3)
11. **Desync frase/audio** — `riAtStart` ref captura indice al grabar
12. **Retry no funcionaba** — Cleanup MediaRecorder previo en cada `startR()`
13. **Nav durante grabacion** — Botones deshabilitados con `disabled={rec}`

### Visual / UX (5)
14. **Zoom permitido** — Quitado `maximum-scale=1, user-scalable=no`
15. **SpaceMascot 36 a 52px, AstronautDaily 32 a 44px**
16. **Bark del perro** — Noise+bandpass natural en vez de sawtooth
17. **Spin del perro** — Orbita con translateX en vez de girar en sitio
18. **Comandos de voz +20 patrones** + fuzzy matching Levenshtein para ninos

### Responsive (10)
19. **viewport-fit=cover** para iOS safe-area
20. **CSS variables** — safe-area, dock-h, planet-size, tap-target, root-pad
21. **Breakpoints reales** — phone (<=480), tablet portrait (768-1023), tablet landscape (1024-1365), desktop (>=1366)
22. **#root responsive** — `width:min(100%,1440px)` con safe-area padding
23. **Orbita planetas responsive** — Calculo fino por viewport con isPhone/isTabletPortrait/isTabletLandscape/isDesktop
24. **GameShell grid** — Contenedor comun con grid-template-rows para todos los ejercicios
25. **Dock inferior con safe-area** — Adios `bottom:180`. Dock centrado con `env(safe-area-inset-bottom)`
26. **Botones/micro escalados por viewport** — micSize, sideBtn adaptativos
27. **Frase con clamp()** — `clamp(24px, 5vw, 38px)` para texto responsive
28. **Emoji ejercicio con clamp()** — `clamp(84px, 18vw, 132px)`

### Cloud sync y datos (3)
29. **Cloud no sobreescribe datos locales** — Compara timestamps local vs cloud
30. **Cloud timer con cleanup** en useEffect
31. **tdy() formato fijo** `d/M/yyyy` — No depende de locale del navegador

### Feature nueva: Encadenamiento inverso (5)
32. **Estado `fraccionado`** con persistencia localStorage
33. **Toggle en Settings** junto a rafaga
34. **Funciona desde 2 palabras** — "agua" a "quiero agua"
35. **Repite cadena completa N veces** — Evaluacion en ultimo paso de ultima ronda
36. **Compatible con rafaga** — Tope 3 rondas, slider 2-5

### Firebase Analytics (4)
37. **Firebase Analytics inicializado** — `isSupported()` async, `track()` centralizado
38. **9 eventos**: session_started, session_completed, session_abandoned, exercise_completed, exercise_skipped, mic_failed, sr_no_match, app_error, settings_changed
39. **Daily metrics en Firestore** — Coleccion `daily_metrics/{uid}_{date}` con merge por dia
40. **getWeeklyProgress()** — Compara esta semana vs anterior

### Housekeeping (7)
41. **Error Boundary** — Pantalla amigable con boton "Reiniciar Toki"
42. **Lazy loading** — Settings, DoneScreen, VoiceRec, TokiPlayground, MiCielo, MonthlyReport, todos los ejercicios
43. **Eliminados** pdfjs-dist, pdf-poppler, canvas, sharp (no usados, vulnerables)
44. **package-lock.json regenerado** — `npm ci` funciona
45. **Scripts test/check** en package.json
46. **manifest.json** — purpose separado (any + maskable)
47. **57 tests** cubriendo adjScore, saveP, score, tdy, backward chaining, Levenshtein, matchCommand

---

## Checklist PRE-DEPLOY (OBLIGATORIO siempre antes de commit/push)

### Paso 1: Smoke test por codigo (10 min)
Lanzar agente que trace los 10 flujos criticos:
1. Flujo principal: planeta → 3 ejercicios → DoneScreen → "Otra ronda" → no 0 ejercicios
2. Modos: libre=rocketHint, random=startRandomFromActiveModules, guiada=startGame
3. Voz: adjScore=raw, mic dur=max(3,...), burst=65%, toki-pause mata alive
4. Encadenamiento: 2+ palabras, cadena completa x N, evaluacion ultima ronda, burst max 3
5. Pausa: toki-pause event, resumeKey re-mount, timers cleared
6. Cloud: timestamps local vs cloud, lastSaved, cleanup useEffect
7. VoiceRec: riAtStart, capturedRi, nav disabled durante rec
8. Analytics: track() existe, 9 eventos en los sitios correctos
9. Responsive: CSS vars, breakpoints, gameShellStyle, dock safe-area
10. Edge cases: perfil switch cleanup, localStorage try/catch, double-tap

### Paso 2: Build limpio (5 min)
```bash
rm -rf node_modules dist
npm ci
npm run test    # 57+ tests deben pasar
npm run build   # Sin errores
```

### Paso 3: Solo desplegar si TODO pasa
- Sin crashes
- Sin estados corruptos
- Voz estable
- Modos correctos

---

## Pendiente para proximas sesiones

### Prioridad alta (afecta uso diario)
- **Probar con Guillermo en dispositivo real** — Chrome movil, iPad Safari, desktop
- **Verificar estrellas avanzan** — El fix de saveP deberia resolver "33 para plata"
- **Verificar reconocimiento mejorado** — adjScore ya no aplasta notas
- **Informe mensual** — Auditado y correcto, pero Diego reporto discrepancias. Vigilar con datos nuevos

### Prioridad media (mejoras de producto)
- **Bundle size** — El main chunk sigue en 1.17MB. Para bajar a ~500KB habria que mover los gen* helpers (genMath, genMulti, etc.) a archivos separados de los componentes visuales. Refactor de ~2h
- **Tests de integracion** — Faltan tests de flujos completos (libre no lanza random, guided no lanza random, rocket button, DoneScreen otra ronda)
- **Refactor de sesion** — Extraer logica a sessionFlow.js, randomFlow.js. Reducir App.jsx de 1200+ lineas
- **guidedTasks** — El estado existe pero Settings no tiene UI para configurar tareas guiadas. Feature placeholder sin implementar
- **onvoiceschanged global** — Asignacion sin cleanup en voice.js linea 12. Funciona pero es fragil en hot-reload

### Prioridad baja (nice to have)
- **Sentry/logging externo** — Firebase Analytics cubre errores basicos pero Sentry daria stack traces
- **AudioContext compartido** — Cada beep/bark crea un nuevo AudioContext. Deberia ser uno compartido
- **Service Worker/offline** — No hay SW. La PWA no funciona offline. Añadir vite-plugin-pwa
- **Supervisor PIN hasheado** — Ahora en plaintext en localStorage
- **Seguridad headers Vercel** — CSP, X-Frame-Options, X-Content-Type-Options en vercel.json
- **Firestore Security Rules** — No estan en el repo. Verificar que cada user solo lee/escribe su propio documento
- **Lazy loading fase 2** — Separar gen* helpers de componentes visuales para chunks mas pequenos
- **Writing como excepcion landscape** — Ya existe pero revisar que funcione bien
- **Toggle debug oculto** — Para ver estado interno sin DevTools
- **Backup manual de localStorage** — Boton en Settings para exportar/importar datos

---

## Arquitectura actual

### Stack
- React 18 + Vite 5
- Firebase Auth + Firestore + Storage + Analytics
- PWA (manifest.json, sin Service Worker)
- Vercel (auto-deploy desde main)

### Archivos principales
- `src/App.jsx` (~1200 lineas) — Estado global, routing, logica de sesion
- `src/exercises.js` (~1400 lineas) — Datos estaticos de ejercicios
- `src/components/SpeakPanel.jsx` — DILO, FraccionadoMode, ExFlu, ExFrases
- `src/voice.js` — TTS, Speech Recognition, useSR hook
- `src/utils.js` — score(), adjScore(), SRS, tracking local, getWeeklyProgress
- `src/firebase.js` — Firebase config, track(), saveDailyMetrics()
- `src/constants.js` — CSS global, breakpoints, colores

### Eventos Analytics (Firebase)
| Evento | Donde | Datos clave |
|--------|-------|-------------|
| session_started | startGame, startRandom | mode, module, level |
| session_completed | fin() | ok, sk, min, stars |
| session_abandoned | tryExit() | ok, sk, min, module |
| exercise_completed | onOk() | module, stars, attempts |
| exercise_skipped | onSk() | module, consecutive_skips |
| mic_failed | SpeakPanel getUserMedia catch | reason |
| sr_no_match | handleSR rawB===0 | phrase_words, text_length |
| app_error | Error Boundary | message, component |
| settings_changed | SettingsConfigTab | field, value |

### Daily Metrics (Firestore)
- Coleccion: `daily_metrics/{uid}_{YYYY-MM-DD}`
- Campos: sessions, ok, sk, totalMin, stars, topModule, streak
- Se guarda en fin() para usuarios autenticados
- Merge con datos existentes del mismo dia

---

## Notas importantes para futuros asistentes

1. **NO usar `setOv('random')`** — No existe como overlay. Random se lanza con `startRandomFromActiveModules()` directamente
2. **NO crear `startGuidedSession()`** — `startGame()` ya hace lo correcto para modo guiado
3. **guidedTasks esta vacio** — Settings no tiene UI para configurarlo. No construir features sobre el
4. **adjScore es pass-through** — No modificar. El slider de exigencia solo afecta passThreshold
5. **saveP DEBE clonar** — Nunca mutar el objeto de usuario directamente
6. **voice.js ya tiene guards** — Todas las funciones TTS tienen el flag `done` anti doble-finish
7. **Siempre ejecutar el checklist pre-deploy** antes de commit/push
