# TOKI v25.12 — Documento Maestro

> Generado: 2026-03-28 | Verificado contra codigo fuente real
> (c) 2026 Diego Aroca. Todos los derechos reservados.

---

## 1. ESTADO ACTUAL v25.12

### Stack tecnologico
- **React 18.2** + **Vite 5.1** (SPA, PWA)
- **Firebase 12.11** (Auth, Firestore, Storage)
- **Hosting:** Vercel
- **Fuente:** Fredoka (UI), Caveat (caligrafia minusculas)
- **TTS:** Web Speech API (SpeechSynthesis + SpeechRecognition)
- **Node.js** local: `C:\Program Files\nodejs\`
- **Puerto dev:** 5173

### Estructura de archivos (src/)
```
src/
  App.jsx                 (959 lineas) — App principal, routing, buildQ, game loop
  exercises.js            (1391 lineas) — 1366 ejercicios estaticos
  constants.js            (210 lineas) — Colores, CSS, GROUPS, LV_OPTS, QUIEN_SOY
  utils.js                (207 lineas) — Score, SRS, mascota, velocidad adaptativa, Dynamic DILO
  voice.js                (48 lineas) — TTS, SR, cheerOrSay, playRec
  firebase.js             (309 lineas) — Auth, Firestore, Storage, voces, fotos
  cloud.js                (85 lineas) — processImage, cloudSave/Load, autoPresentation
  main.jsx                — Entry point
  components/
    UIKit.jsx             — SpaceMascot, Confetti, Ring, Tower, RecBtn, NumPad, AstronautAvatar,
                            OralPrompt, useOralPhase, AbacusHelp, useIdle
    Settings.jsx          — Panel 4 pestanas (config, familia, progreso, metodo)
    DoneScreen.jsx        — Pantalla fin sesion con podio, mascota, rachas
    CelebrationOverlay.jsx — Stars overlay, confetti global
    EmergencyButton.jsx   — Boton SOS, consejos seguridad vial, Google Maps
    PhotoCropOverlay.jsx  — Recorte fotos perfil
    RocketTransition.jsx  — Animacion cohete entre pantallas
    MonthlyReport.jsx     — Informe mensual SVG
    VoiceRec.jsx          — Grabacion voces referencia
    SpeakPanel.jsx        — ExFlu, ExFrases, ExFrasesBlank, ExSit
    MiCielo.jsx           — Vista estrellas acumuladas
  modules/
    ExCount.jsx           — Conteo 1-100 por bloques
    ExMath.jsx            — Sumas, restas, mezcla
    ExMulti.jsx           — Multiplicaciones
    ExFraction.jsx        — Fracciones (reconocer, notacion, equivalencias, sumar/restar)
    ExMoney.jsx           — Monedas y billetes
    ExClock.jsx           — Reloj (en punto, media, cuarto)
    ExCalendar.jsx        — Calendario (dias, meses, antes/despues, ayer/manana)
    ExDistribute.jsx      — Repartir y contar (poner, repartir, comparar)
    ExWriting.jsx         — Caligrafia (letras, palabras, frases; may/min; con/sin guia)
    ExRazona.jsx          — Razonamiento (espacial, drag, series, causa, clasificar, emociones)
    ExLee.jsx             — Lectura (intruso, palabra+imagen, completa, silabas, lee y haz)
    ExQuienSoy.jsx        — Presentaciones (estudio + presentacion con switch inline)
  __tests__/
    core.test.js          — Tests unitarios
```

### Version en constants.js
`VER = 'v24.0'` (constante de display, no refleja iteracion real de desarrollo)

### Totales globales

| Categoria | Cantidad |
|-----------|----------|
| Ejercicios en exercises.js (EX) | **1366** |
| - Frases DILO (ty:flu) | 1224 |
| - Forma la frase (ty:frases) | 102 |
| - Situaciones (ty:sit) | 40 |
| Ejercicios LEE (hardcoded en ExLee.jsx) | **99** |
| - Intruso | 25 |
| - Palabra+Imagen | 18 |
| - Completa letra | 20 |
| - Ordena silabas | 21 |
| - Lee y haz | 15 |
| Ejercicios ESCRIBE (generados en ExWriting.jsx) | **~180** |
| - Letras mayusculas (27) + minusculas (27) | 54 |
| - Palabras mayusculas (43) + minusculas (43) | 86 |
| - Frases mayusculas (20) + minusculas (20) | 40 |
| Ejercicios RAZONA (hardcoded en ExRazona.jsx) | **~67** |
| - Espacial elige | 8 |
| - Espacial arrastra | 8 |
| - Clasificar | 3 sets |
| - Causa-efecto | 6 |
| - Emociones | 6 |
| - Series (colores/formas/combinado) | ~36 generados |
| Ejercicios generados dinamicamente | ilimitados |
| - Matematicas (genMath) | ~30/sesion |
| - Multiplicaciones (genMulti) | ~20/sesion |
| - Fracciones (genFractions) | ~20/sesion |
| - Monedas (genMoney) | variable |
| - Reloj (genClock) | variable |
| - Calendario (genCalendar) | variable |
| - Repartir (genDistribute) | variable |
| Areas tematicas DILO | **12** |
| Niveles DILO | **5** (N1-N5, por longitud de frase) |
| Modulos activos | **17** (en 6 planetas) |
| Planetas | **6** (Aprende, Dilo, Cuenta, Razona, Escribe, Lee) |
| Presentaciones (Quien Soy) | **25 slides** predefinidas + auto-generadas |

---

## 2. FUNCIONALIDADES IMPLEMENTADAS

### Estructura de navegacion

- **6 planetas** orbitando un cohete central con animacion CSS (orbitAll)
  - APRENDE (rosa) — Presentaciones, Quien Soy
  - DILO (verde) — Aprende a decirlo, Forma la frase, Cuenta conmigo
  - CUENTA (naranja) — Sumas y Restas, Multiplicaciones, Fracciones
  - RAZONA (azul) — Donde esta, Series, Piensa, Clasifica, Emociones, Monedas, Reloj, Calendario, Reparte
  - ESCRIBE (morado) — Escritura (letras/palabras/frases, may/min, con/sin guia)
  - LEE (rojo) — Intruso, Palabra+Imagen, Completa, Ordena silabas, Lee y haz
- **Seleccion visual de modulos** (`selModKey`): cada modulo es un sub-planeta dentro de su grupo, seleccionable con tap
- **Switch Estudio/Presentacion inline** en ExQuienSoyUnified: `ModeSwitch` component con botones "Estudio" y "Presentacion"
- **Modo Presentacion**: Toki como apuntador silencioso — el usuario lee/habla, barra de tiempo lateral (QSTimeBar), sin TTS modelo, solo escucha SR

### Mejoras Cientificas M1-M10

**M1: Contador de repeticiones**
- `getRepCount()` / `updateRepCount()` en utils.js
- Almacena por userId+phraseKey: count, avgStars, firstDate, lastDate
- Se actualiza en `handleSR()` de ExQuienSoyEstudio tras cada respuesta oral

**M2: Informe grafica SVG**
- `MonthlyReport.jsx` — componente dedicado
- Grafico SVG de progreso mensual
- Accesible desde Settings > Progreso

**M3: Repeticion inteligente max 3**
- En ExQuienSoyEstudio: umbral `passThreshold = exigencia * 0.6 * 4`
- Si stars < passThreshold y att < 3: repite frase
- Tras 3 intentos: auto-pass con stars minimas
- SRS refleja calidad: 4 estrellas 1er intento -> lv5 (7 dias), 3 estrellas -> lv4 (3 dias), reintentos -> lv3 (1 dia), auto-pass -> lv0

**M4: Modo rafaga**
- Toggle "Rafaga ON" visible en DILO y QUIEN SOY
- Estado: `burstMode`, `burstSpeed` (0.7-1.2), `burstReps` (1-5)
- Sliders para velocidad y repeticiones
- Cada rep ligeramente mas rapida: `burstSpeed + repIdx * 0.05`
- Persistido en localStorage: `burst_mode`, `burst_speed`, `burst_reps`

**M5: Velocidad adaptativa TTS**
- `getPhraseSpeed()` / `updatePhraseSpeed()` en utils.js
- Velocidades: [0.7, 0.85, 1.0, 1.1]
- 3 aciertos consecutivos -> sube velocidad
- 2 fallos consecutivos -> baja velocidad
- Streak almacenado por userId+phraseKey en localStorage

**M6: Grabacion referencia (frase fija)**
- `VoiceRec.jsx` — panel de grabacion de frases
- Almacenamiento en localStorage como base64 o Firebase Storage
- `playRec()` / `playRecLocal()` en voice.js: busca primero en Firebase publico, luego localStorage
- `trimSilence()` y `validateVoiceDuration()` en firebase.js
- Accesible desde Settings > Grabaciones

**M7a: Modo dinamico DILO**
- Toggle en Settings (per-user): `getDynamicDilo()` / `setDynamicDilo()`
- Nivel automatico 1-5: `getDynamicDiloLevel()` / `setDynamicDiloLevel()`
- Historial ultimos 8 ejercicios: `pushDynamicDiloResult()`
- **Subida**: 75%+ aciertos en ultimos 8 ejercicios AND 2+ sesiones
- **Bajada**: 3+ fallos en ultimos 4 -> bajada inmediata
- Celebracion visual nivel-up: overlay con "Nivel X!" + starBeep(4)
- Bajada silenciosa (sin overlay)
- Badge en pantalla de juego: "N{nivel}" junto al modulo
- Session tracking: `diloExCount.current`, se cuenta sesion al 3er ejercicio

**M7b: Modo random / sesion variada**
- Boton "Sesion variada" en centro de la galaxia
- Overlay de configuracion: seleccionar modulos (min 2), tiempo (10-60 min), ejercicios por ronda (3-5)
- Construye super-queue round-robin de todos los modulos seleccionados
- Timer countdown visible en pantalla de juego
- Transicion visual entre modulos (overlay 1.2s con emoji y nombre)
- Barra de iconos de modulos activos en parte superior
- Stats por modulo al finalizar (ok/total por modulo)
- Auto-finish cuando timer llega a 0
- Estado: `randomMods`, `randomTime`, `randomPerRound`, `randomActive`, `randomStats`, `randomModIdx`, `randomExInRound`, `randomTransition`, `randomTimer`

**M8: Produccion oral en todos los planetas**
- `useOralPhase()` hook en UIKit.jsx: tras respuesta correcta, pide al nino repetir la frase
- `OralPrompt` component: TTS dice la frase, beep 880Hz, SR escucha 3.5s
- Integrado en: ExLee, ExQuienSoy (Estudio y Presentacion)
- Toggle en Settings: "Produccion oral ON/OFF" (`toki_oral_all_planets` en localStorage)
- Scoring pasa por useOralPhase antes de llamar onOk (incluye stars y attempts)

**M9: Fraccionado backward chaining**
- `splitSyllables()` en utils.js: algoritmo de silabificacion espanola
- Maneja diptongos, hiatos, consonantes inseparables (bl, br, cl, cr, dr, fl, fr, gl, gr, pl, pr, tr, ch, ll, rr, qu, gu)
- Usado en ExLee mode 'syllables' para ordenar silabas
- Ejercicios LEE_SYLLABLES: 21 palabras de 2-5 silabas

**M10: Oral tras escribir**
- En ExWriting.jsx: `speakPhase` state
- Tras completar el trazo y evaluar estrellas, entra en fase oral
- Usa `useSR()` para reconocimiento de voz
- `oralEnabled()` respeta el toggle global `toki_oral_all_planets`

### Gamificacion

- **Mascota evolutiva 6 tiers** (SpaceMascot en UIKit.jsx):
  - Tier 0: Estrellita (0+ estrellas)
  - Tier 1: Bronce (50+) — anillo dorado
  - Tier 2: Plata (150+) — destellos
  - Tier 3: Oro (300+) — corona
  - Tier 4: Superestrella (500+) — capa roja
  - Tier 5: Legendaria (1000+) — capa morada, halo, gradiente arcoiris
  - Moods: idle, happy, sad, dance (con animaciones CSS distintas)
- **Rachas** (`correctStreak`): badge visual "x{N}" con emojis fuego cuando >= 2
  - 2-4: icono rayo
  - 3-4: 1 fuego
  - 5+: 2 fuegos
- **Hitos sesion** (milestones): overlays a 5, 10, 20 respuestas correctas
  - 5: "Vas genial!" con estrella
  - 10: "Imparable!" con fuego
  - 20: "Superestrella!" con trofeo
- **Podio personal en DoneScreen**: compara hoy vs mejores 2 historicas, medallas oro/plata/bronce
- **Siluetas mascotas bloqueadas**: visible en DoneScreen con barra de progreso hacia siguiente tier
- **Elogio graduado**:
  - `pickMsg()`: 20% probabilidad de elogio personalizado con nombre
  - Pool de SHORT_OK (12), PERFECT_T (10), GOOD_MSG (6), MODULE_MSG por seccion
  - Evita repeticion consecutiva (`_lastMsg`)
  - DoneScreen: praise graduado por %: >=80% "Genial!", >=40% "Buen trabajo!", resto "Has practicado mucho!"

### Settings (Panel de Supervisor)

- **4 pestanas**: config (engranaje), familia (personas), progreso (grafica), metodo (cerebro)
- **Tab Config**:
  - Cambiar PIN (3 pasos: actual -> nuevo -> confirmar)
  - Sesion: 15/25/44/ilimitado minutos
  - Tema visual: Espacial / Sobrio (sin animaciones)
  - Casco astronauta ON/OFF
  - Produccion oral ON/OFF
  - Color del cohete: rojo/azul/verde/dorado/morado
  - Limites: tiempo maximo diario (30/60/120/ilimitado)
  - Tolerancia (exigencia) 50-100% slider
  - Planetas activos: UI de planetas con modulos activables/desactivables
- **Tab Familia**: gestion de personas (nombre, relacion, avatar, foto)
- **Tab Progreso**: MonthlyReport, historial
- **Tab Metodo**: configuracion pedagogica, Dynamic DILO toggle
- **PIN obligatorio** en entrada: setup con doble confirmacion, persistido en localStorage
- **Auto-guardado**: `saveData()` usa localStorage con serialization segura (evita circular refs, HTMLElements)
- **Toggle produccion oral**: `toki_oral_all_planets`
- **Grabaciones referencia**: acceso a VoiceRec desde Settings

### Contenido

| Tipo | Cantidad |
|------|----------|
| Frases DILO (ty:flu) | **1224** |
| - Nivel 1 (1-2 palabras) | ~210 |
| - Nivel 2 (2-3 palabras) | ~480 |
| - Nivel 3 (3-4 palabras) | ~350 |
| - Nivel 4 (4-5 palabras) | ~120 |
| - Nivel 5 (5+ palabras) | ~64 |
| - Incluye prep (preposiciones) | 40 |
| - Incluye conv (conversacion) | 35 |
| Forma la frase (ty:frases) | **102** |
| Situaciones (ty:sit) | **40** |
| Ejercicios LEE | **99** |
| Ejercicios ESCRIBE | **~180** |
| 12 areas tematicas | seguridad, salud, necesidades, compras, transporte, restaurante, relaciones, sentimientos, colegio, ocio, tecnologia, casa |
| Regla no repeticion por sesion | `sessionUsedPhrases.current` (Set) — filtra frases ya usadas via `_noRepeat()` |

### Seguridad / UX

- **SOS con cancelacion audio global**:
  - `EmergencyButton.jsx`: boton flotante abajo-derecha, siempre visible en game
  - Abre pantalla roja fullscreen con nombre, apellidos, direccion en grande
  - TTS loop cada 10s: "ME LLAMO... MI DIRECCION ES... NECESITO AYUDA"
  - `window.dispatchEvent(new Event('toki-sos'))` — mata timers/mic de ejercicios
  - `stopAllAudio()`: cancela speechSynthesis + stopVoice()
  - Botones: llamar padre, llamar madre, 112 emergencias
  - "Ir a casa con mapa": consejos seguridad vial (SAFETY_TIPS), luego Google Maps walking directions con geolocalizacion
  - Verifica `navigator.onLine` antes de ofrecer mapa
- **Touch targets >= 44px**: todos los `.btn` tienen `min-height:48px` (general) y `min-height:44px` en mobile; NumPad botones 52x46
- **Fotos 16:9 presentaciones**: `PhotoCropOverlay.jsx` con shape configurable (circle/rectangle)
- **Responsive**: media queries a 480px, 360px, y landscape 768px+
- **Wake Lock**: `navigator.wakeLock.request('screen')` durante game, release al salir
- **Idle detection**: `useIdle()` hook — mensajes progresivos cada 15s ("Seguimos?", "Estas ahi?", "Toki te espera...")
- **Permiso microfono**: auto-request al primer touch/click

### Scoring y SRS

- **Celebracion unica**: Confetti global desde `<Confetti show={conf}/>` en App.jsx, controlado por `setConf(true)` en `onOk()` con timeout 2400ms
- **SRS con stars/attempts** (`srsUp()` en utils.js):
  - 4 estrellas, 1er intento -> lv5 (7 dias)
  - 3 estrellas, 1er intento -> lv4 (3 dias)
  - 2-3 estrellas con reintentos -> lv3 (1 dia)
  - Auto-pass (3+ intentos) -> lv0 (proxima sesion)
  - Fallo -> baja 1 nivel (min 0)
  - Intervalos: [0, 30s, 2min, 1dia, 3dias, 7dias]
  - `needsRev()`: compara tiempo actual vs ultimo + intervalo del nivel
- **totalStars3plus**: solo se incrementa si `stars >= 3` en `onOk()`
- **IDs ejercicios unicos**: cada ejercicio tiene id unico (se0001, sa0001, prep0001, conv0001, fse000, si0000, etc.)
- **Score de reconocimiento oral** (`score()` en utils.js):
  - Normaliza: digitos a texto, lowercase, quita puntuacion
  - Match exacto -> 4
  - 80%+ palabras exactas -> 3
  - 50%+ con tolerance Levenshtein -> 2
  - Cualquier match -> 1
  - Vacio -> 0
  - `adjScore()`: ajusta segun exigencia (50-100%)
  - Levenshtein tolerance: <=3 chars -> 0, <=5 chars -> 1, else -> 2

---

## 3. BUGS CONOCIDOS POR CORREGIR

1. **Fotos descuadradas en crop circular** — `PhotoCropOverlay.jsx` puede producir fotos que no encajan bien en el contenedor circular del avatar; el recorte no preserva aspect ratio correctamente en todos los casos.

2. **M7b sandwich DILO pendiente en random** — En sesion variada, cuando el modulo DILO (decir) entra en rotacion, no aplica el "sandwich" de SRS (mezcla priorizada rev+fresh+rest) de forma optima: puede repetir frases entre rondas ya que `_noRepeat` se limita a la sesion pero el cursor del modulo hace wrap-around.

3. **VER constante desactualizada** — `constants.js` muestra `VER = 'v24.0'` cuando deberia ser v25.12 segun el desarrollo.

4. **Duplicacion de IDs en colegio** — Las frases cl0129-cl0136 son duplicados de cl0012-cl0020 (Lapiz, Goma, Tijeras, Pegamento, Pintura, Pizarra, Mochila, Estuche) con mismos textos. No causa crash pero infla el conteo.

5. **ExWriting: personalizacion parcial** — `WRITE_PHRASES` incluye `{padre}` pero `genWriting()` no llama `personalize()`. Las frases aparecen literalmente con `{padre}`.

6. **Falta area en preposiciones/conversacion** — Los ejercicios `prep0001-prep0040` y `conv0001-conv0035` no tienen campo `a:` (area). Esto puede afectar filtrado por area si se implementa.

---

## 4. PENDIENTE DE IMPLEMENTAR

- **Mascota perro Toki** (TOP PRIORITY — En diseño, próxima implementación) — Ver seccion 7 para diseño completo. Perro beagle/spaniel cartoon con 3 evoluciones, sistema tamagotchi educativo, moods, estaciones
- **Siluetas mascotas visibles desde inicio** — Las siluetas de tiers superiores solo se ven en DoneScreen; deberian verse en la pantalla principal como motivacion
- **ARASAAC pictogramas** — Integrar pictogramas ARASAAC para apoyo visual en frases DILO
- **Login email Firebase Auth** — Ya implementado parcialmente (email+password + Google Sign-In); falta polish y recovery
- **Mas ejercicios** — QA recomendo 200+ por modulo; LEE tiene 99, RAZONA ~67
- **LEE_PHONICS pre-lectura** — Modulo fonetico para antes de lectura formal
- **Modulos avanzados 12+** — Extension para edades >12 (autonomia, empleo, transporte independiente)
- **Fuente OpenDyslexic** — Opcion de fuente accesible para dislexia
- **Graduacion elogio por nivel/edad** — Actualmente elogios son iguales para todas las edades
- **Ejercicios "Que dirias" mover a Razona>Piensa** — Las situaciones (ty:sit) estan en SpeakPanel pero pedagogicamente encajan mejor en Razona

---

## 5. DECISIONES DE DISENO

### Filosofia general
- **Touch-first**: toda la interaccion esta disenada para dedos en tablet/movil
- **Save immediately**: `saveData()` en localStorage tras cada cambio; cloud sync con debounce 2s
- **Feedback proporcional**: 4 niveles de estrellas, elogio graduado, mascota reactiva
- **Sin castigo**: los fallos bajan SRS pero no penalizan visualmente al nino
- **Progresion por longitud**: DILO usa N1(1-2 pal) a N5(5+ pal) en vez de dificultad abstracta

### Decisiones arquitecturicas
- **Single-file components**: cada modulo es autocontenido con datos + generador + componente
- **No router**: toda la navegacion via `scr` state ('setup'|'login'|'goals'|'game')
- **CSS-in-JS inline**: sin archivos CSS externos, todo via `style={{}}` y constante `CSS` inyectada como `<style>`
- **localStorage como source of truth local**: perfiles, SRS, configuracion, voces grabadas
- **Cloud como backup**: Firebase sincroniza con debounce, cloud-first si disponible
- **Overlay pattern**: todos los modals/dialogs via `ov` state ('done'|'pin'|'parent'|'random'|'admin'|'parentGate')

### Decisiones pedagogicas
- **Metodo Troncoso**: base para lectura global y produccion oral
- **Backward chaining (M9)**: silabas se presentan desordenadas para reconstruir
- **Spaced repetition adaptativa (M3)**: intervalos basados en calidad, no solo acierto/fallo
- **Dynamic leveling (M7a)**: sube/baja automaticamente basandose en ultimos 8 ejercicios
- **Oral production universal (M8)**: tras cada acierto, el nino repite la respuesta oralmente
- **No-repeat per session**: `sessionUsedPhrases` evita ver la misma frase dos veces en una sesion
- **Tolerancia configurable**: slider 50-100% que ajusta la exigencia del reconocimiento oral
- **3 attempts max (M3)**: despues de 3 fallos, auto-pass para evitar frustracion

### Decisiones de UX
- **Tema espacial vs sobrio**: dos modos visuales para diferentes contextos (casa vs terapia)
- **Cielo dinamico**: sky-morning/sky-afternoon/sky-night basado en hora real
- **Casco astronauta**: overlay SVG opcional sobre avatares
- **Mascota con mood**: reacciona a aciertos (happy bounce), fallos (sad shy), victoria (dance)
- **Supervisor timer**: 10 minutos de modo supervisor, luego auto-lock
- **Free choice mode**: el nino elige planeta y modulo libremente

---

## 6. ARQUITECTURA TECNICA

### buildQ flow
```
startGame(overrideLv)
  -> Lee nivel de localStorage via getModuleLvOrDef(mod.lvKey, mod.defLv)
  -> Llama buildQ(user, section, level)
     -> Para DILO (decir):
        1. Si Dynamic DILO activo: usa getDynamicDiloLevel() como nivel
        2. Filtra EX por ty:'flu' y longitud de palabra segun nivel
        3. Prioriza: rev (needsRev) -> fresh (sin SRS) -> rest
        4. Mezcla: 24 rev + 12 fresh + 4 rest, hasta 40
        5. Personaliza con personalize(ph, user)
        6. Aplica _noRepeat() con sessionUsedPhrases
     -> Para ESCRIBE (writing):
        1. Lee preferencias: escribeCase, escribeTypes, escribeGuide
        2. Mapea combinaciones a niveles (1-63)
        3. Llama genWriting(lv) para cada nivel
        4. Mezcla si multiples niveles
     -> Para LEE: genLee(lv) -> filtra por modo (intruso/word_img/complete/syllables/read_do)
     -> Para QUIENSOY: busca presentacion por presIdx, genera slides
     -> Para modulos numericos: llama gen* correspondiente
  -> setQ(queue), setIdx(0), setSt({ok:0, sk:0})
  -> setShowRocket(true) -> onRocketDone() -> setSs(Date.now()) -> setScr('game')
```

### getModuleLvOrDef(modKey, defLv)
```
1. Lee de localStorage: loadData('mod_lv_' + modKey)
2. Si existe y tiene elementos: retorna array de niveles
3. Si no existe: retorna Array.isArray(defLv) ? defLv : [defLv]
4. Soporta multi-nivel (ej: quiensoy [1,2] = estudio+presentacion)
```

### dynGroups
```
dynGroups = useMemo(() => getGroupsForUser(user, GROUPS), [user, user?.presentations])

getGroupsForUser(user, GROUPS):
  - Para grupo 'aprende': genera modulos dinamicos desde user.presentations
  - Cada presentacion -> modulo con k:'quiensoy', lvKey:'pres_{idx}', presIdx:{idx}
  - Si no hay presentaciones: modulo default 'Mi presentacion'
  - Otros grupos: se devuelven sin cambios
```

### curPresLvKeyRef + selModKey
```
curPresLvKeyRef = useRef('pres_0')  -- referencia mutable para saber que modulo/presentacion esta activo
selModKey = useState('pres_0')      -- estado para UI de seleccion visual

Cuando el usuario selecciona un modulo:
  1. setSec(mod.k)           -- seccion activa (decir, lee, writing, quiensoy...)
  2. setSecLv(mLv)           -- nivel(es) activo(s)
  3. curPresLvKeyRef.current = mod.lvKey  -- clave de modulo para buildQ
  4. setSelModKey(mod.lvKey)  -- para highlight visual del sub-planeta

buildQ usa curPresLvKeyRef.current para:
  - Saber que presentacion usar en quiensoy
  - Distinguir entre sub-modulos de razona/lee (mismo k, distinto lvKey)
```

### SRS intervals
```
Niveles: 0-5
Intervalos (ms): [0, 30000, 120000, 86400000, 259200000, 604800000]
                  0  30s    2min    1 dia      3 dias      7 dias

srsUp(id, ok, user, stars, attempts):
  Fallo:         lv = max(lv-1, 0)
  Auto-pass:     attempts >= 3 -> lv = 0
  Retry win:     attempts > 1 -> lv = 3
  3 stars 1st:   lv = 4
  4 stars 1st:   lv = 5
  Default ok:    lv = min(lv+1, 5)

needsRev(id, user):
  return (Date.now() - srs[id].t) >= intervals[min(srs[id].lv, 5)]
```

### Firebase structure
```
Auth: Firebase Auth (email/password + Google Sign-In)
Firestore:
  users/{uid}:
    profiles: [{id, name, age, sex, av, photo, hist, srs, voices, presentations, ...}]
    personas: [{name, relation, avatar, photo, phone}]
    email: string
    revoked: boolean

Storage:
  voices/{phraseKey}/{sex}_{ageGroup}_{timestamp}.webm  -- voces publicas
  photos/{uid}/{filename}                                -- fotos perfil

Cloud sync:
  - Debounce 2s en useEffect sobre [profs, personas]
  - cloudSaveProfile(uid, {profiles, personas, email})
  - On auth state change: cloudLoadProfile -> merge con local
  - Cloud como source of truth si local esta vacio
```

### useOralPhase with scoring
```
useOralPhase(onOk):
  States: oralPhrase, pendingScore

  triggerOral(phrase, stars, attempts):
    1. Si oral desactivado: llama onOk(stars, attempts) directo
    2. Si activado: guarda pendingScore, setOralPhrase(phrase)
    3. OralPrompt se renderiza:
       a. stopVoice()
       b. say(phrase)  -- TTS dice la frase
       c. beep(880, 150)  -- beep de "tu turno"
       d. sr.go()  -- inicia SpeechRecognition
       e. setTimeout 3.5s -> oralDone()
    4. oralDone(): setOralPhrase(null), onOk(pendingScore)

  Resultado: el scoring del ejercicio original se preserva;
  la fase oral es bonus no-evaluado (solo practica)
```

### Session no-repeat rule
```
sessionUsedPhrases = useRef(new Set())

En startGame(): sessionUsedPhrases.current = new Set()  -- reset por sesion

_noRepeat(exercises):
  Para cada ejercicio:
    1. Extrae key = (ph || text || word || letter).toLowerCase().trim()
    2. Si key ya en Set -> filtra
    3. Si no -> anade al Set y mantiene

  Aplica a: DILO, QUIENSOY, LEE, y cualquier buildQ que lo llame
  No aplica a: modulos generados dinamicamente (math, clock, etc.)

  Efecto: en una sesion variada (M7b), si "Quiero agua" aparece en DILO,
  no volvera a aparecer en otro modulo durante la misma sesion
```

---

---

## 7. TOKI — MASCOTA PERRO (Próxima implementación)

### 7.1 Concepto
Toki es un perro beagle/spaniel cartoon que convive con la estrella evolutiva. Es un homenaje al perro "Tobi" que tuvo Guillermo. El nombre Toki coincide con la app, haciendo que el perro SEA la mascota oficial.

### 7.2 Diseño Visual (SVG)
- **Estilo**: Cartoon 2D tipo Rastreator pero más tierno, expresivo
- **Colores**: Cuerpo marrón/canela, pecho blanco, orejas caídas marrón oscuro, nariz negra, ojos grandes negros brillantes
- **Borde sutil** para visibilidad en cualquier fondo (espacial oscuro, gradiente naranja, etc.)
- **Tamaño**: Similar a SpaceMascot actual (~36-56px según contexto)

### 7.3 Tres Evoluciones (por constancia + alimentación)

| Fase | Visual | Criterio |
|------|--------|----------|
| 🐕 **Cachorro** | Orejas enormes, ojos grandes, torpe, tierno | Estado inicial (0-20 días alimentado) |
| 🐕 **Joven** | Más atlético, pañuelo al cuello, seguro | 21-60 días alimentado (~3 semanas-2 meses) |
| 🦸 **Héroe** | Capa, antifaz, pose heroica, superpoderes | 61+ días alimentado (~2 meses+) |

### 7.4 Sistema de Alimentación (Tamagotchi educativo)

- **Cuenco aparece** al completar sesión de ≥15 minutos
- Se muestra: 🥣 cuenco comida + 💧 cuenco agua
- Toki ladra y mira el cuenco (animación expectante)
- El niño toca el cuenco → Toki come/bebe (animación feliz)
- **1 vez al día máximo** — si ya comió, no aparece cuenco
- **Si no juega en 2 días** → Toki aparece triste con cuenco vacío (motivación)
- Cada día que come = +1 punto de crecimiento → vinculado a evolución

### 7.5 Almacenamiento

```
localStorage:
  toki_dog_growth_{userId}: número (días alimentado, 0-999)
  toki_dog_lastFed_{userId}: fecha ISO (última alimentación)
  toki_dog_phase_{userId}: 0=cachorro, 1=joven, 2=héroe
  toki_dog_evolAnnounced_{userId}: fecha del primer anuncio
```

### 7.6 Anuncio Previo de Evolución (3 días antes)

Cuando `growthPoints` está a 3 días de la siguiente fase:
- **Día -3**: Toki empieza a brillar/parpadear sutilmente. Mensaje: "Toki se siente raro... algo está pasando 🌟"
- **Día -2**: Toki tiene partículas de energía. Mensaje: "Toki tiene mucha energía hoy... ¿qué le pasará?"
- **Día -1**: Toki brilla intensamente. Mensaje: "¡Algo increíble va a pasar mañana!"
- **Día 0**: "¡TOKI HA EVOLUCIONADO!" con celebración especial (confetti + melodía + overlay fullscreen)

### 7.7 Cambios Estacionales (automáticos por fecha del sistema)

| Estación | Meses | Accesorio SVG | Valor pedagógico |
|----------|-------|---------------|-----------------|
| 🧣 Invierno | dic-feb | Suéter rojo, bufanda | Estaciones, ropa de abrigo |
| 🌸 Primavera | mar-may | Collar de flores | Naturaleza, colores |
| 😎 Verano | jun-ago | Gafas de sol, gorra | Protección solar |
| 🍂 Otoño | sep-nov | Pañuelo naranja, hojas cayendo | Colores otoñales |

Implementación: `getSeason()` retorna 0-3 basado en `new Date().getMonth()`. El SVG añade/quita elementos según estación.

### 7.8 Interacciones Táctiles

| Gesto | Evento | Reacción de Toki |
|-------|--------|-----------------|
| **Tap** | onClick | Saca la lengua, mueve cola rápido |
| **Doble tap** | onDoubleClick | Ladra contento (beep 880Hz corto) |
| **Mantener pulsado** | onTouchStart+timeout 1s | Se duerme, cierra ojos, "zzz" |

### 7.9 Moods Durante Ejercicios

| Mood | Cuándo | Visual |
|------|--------|--------|
| **idle** | Esperando | Sentado, cabeza ladeada, cola suave |
| **happy** | Acierto | Cola rápida, lengua fuera, salta |
| **sad** | Error | Orejas más caídas, ojos tristes |
| **dance** | Celebración/DoneScreen | Salta, da vueltas, ladra |
| **hungry** | Cuenco visible | Mira cuenco, ladra, se lame |
| **sleeping** | Mantener pulsado | Ojos cerrados, "zzz", respiración |
| **eating** | Tocó cuenco | Come animado, cola feliz |

### 7.10 Convivencia con Estrella

- **Estrella** = progreso por logros (tiers por estrellas acumuladas, predecible)
- **Toki perro** = compañero vivo (crece por constancia, sorpresa)
- En la pantalla de juego: Toki a la izquierda, Estrella a la derecha (o Toki abajo)
- En DoneScreen: ambos celebran juntos
- En pantalla inicio: Toki saluda al niño, la estrella muestra nivel

### 7.11 Implementación Técnica

**Nuevo componente**: `DogMascot` en `src/components/UIKit.jsx`
- Props: `mood`, `size`, `phase` (0-2), `season` (0-3), `interactive` (boolean)
- SVG inline con paths para cada fase y accesorio estacional
- CSS keyframes para cola, lengua, ojos, salto, sueño
- Touch handlers para tap/doble/mantener

**Modificar App.jsx**:
- Estado: `dogGrowth`, `dogLastFed`, `dogPhase`
- Lógica alimentación en `fin()` (al terminar sesión ≥15 min)
- Anuncio previo en `useEffect` al cargar perfil
- Renderizar `DogMascot` junto a `SpaceMascot` en pantalla juego + goals + DoneScreen

**Modificar DoneScreen.jsx**:
- Mostrar cuenco si sesión ≥15 min y no ha comido hoy
- Animación de alimentación
- Ambas mascotas celebran

---

*Fin del documento maestro TOKI v25.12*
