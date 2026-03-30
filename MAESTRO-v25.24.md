# TOKI v25.24 — Documento Maestro

> Generado: 2026-03-30 | Verificado contra codigo fuente real
> (c) 2026 Diego Aroca. Todos los derechos reservados.

---

## 1. ESTADO ACTUAL v25.24

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
  App.jsx                 (~900 lineas) — App principal, routing, buildQ, game loop, auth
  exercises.js            (1391 lineas) — 1366 ejercicios estaticos
  constants.js            (215 lineas) — Colores, CSS, GROUPS, LV_OPTS, QUIEN_SOY, SUPPORT_EMAIL
  utils.js                (210 lineas) — Score, SRS, mascota, velocidad adaptativa, Dynamic DILO
  voice.js                (65 lineas) — TTS, SR, cheerOrSay, playRec, prioridad de voces
  firebase.js             (345 lineas) — Auth, Firestore, Storage, voces, fotos, trimSilence
  cloud.js                (85 lineas) — processImage, cloudSave/Load, autoPresentation
  main.jsx                — Entry point
  components/
    UIKit.jsx             — SpaceMascot, Confetti, Ring, Tower, RecBtn, NumPad, AstronautAvatar,
                            OralPrompt, useOralPhase, AbacusHelp, useIdle, DogMascot, TokiCachorro
    Settings.jsx          — Panel 4 pestanas (config, familia, progreso, metodo)
    DoneScreen.jsx        — Pantalla fin sesion (responsive portrait/landscape)
    CelebrationOverlay.jsx — Stars overlay, confetti global
    EmergencyButton.jsx   — Boton SOS, consejos seguridad vial, Google Maps
    PhotoCropOverlay.jsx  — Recorte fotos perfil
    RocketTransition.jsx  — Animacion cohete entre pantallas
    MonthlyReport.jsx     — Informe mensual SVG
    VoiceRec.jsx          — Grabacion voces referencia + consentimiento RGPD cesion voz
    SpeakPanel.jsx        — ExFlu, ExFrases, ExFrasesBlank, ExSit
    MiCielo.jsx           — Vista estrellas acumuladas
    ControlCheckpoint.jsx — Control de progresion cada ~30 sesiones (25 frases grabadas)
    TokiPlayground.jsx    — Mascota interactiva con 18 comandos de voz
    TokiWelcome.jsx       — Pantalla de bienvenida animada
    TokiLogoPro.jsx       — Logo SVG profesional
  settings/
    SettingsConfigTab.jsx — Config: PIN, sesion, tema, voces, modulos, soporte
    SettingsFamilyTab.jsx — Familia: personas, presentaciones, "Mis frases"
    SettingsProgressTab.jsx — Progreso: stats, controles, historial, informe
    SettingsMethodTab.jsx — Metodo pedagogico
    SessionModeControl.jsx — Control modo sesion (libre/random/personalizada)
  modules/
    ExCount.jsx           — Conteo 1-100 por bloques
    ExMath.jsx            — Sumas, restas, mezcla
    ExMulti.jsx           — Multiplicaciones
    ExFraction.jsx        — Fracciones (reconocer, notacion, equivalencias, sumar/restar)
    ExMoney.jsx           — Monedas y billetes
    ExClock.jsx           — Reloj (en punto, media, cuarto)
    ExCalendar.jsx        — Calendario (dias, meses, antes/despues, ayer/manana)
    ExDistribute.jsx      — Repartir y contar (poner, repartir, comparar)
    ExWriting.jsx         — Caligrafia + "Mis frases" (auto desde perfil + extras editables)
    ExRazona.jsx          — Razonamiento (espacial, drag, series, causa, clasificar, emociones)
    ExLee.jsx             — Lectura (intruso, palabra+imagen, completa, silabas, lee y haz)
    ExQuienSoy.jsx        — Presentaciones (estudio + presentacion con switch inline)
  __tests__/
    core.test.js          — Tests unitarios
```

### Totales globales

| Categoria | Cantidad |
|-----------|----------|
| Ejercicios en exercises.js (EX) | **1366** |
| Ejercicios LEE (hardcoded en ExLee.jsx) | **99** |
| Ejercicios ESCRIBE (generados en ExWriting.jsx) | **~180** |
| Ejercicios RAZONA (hardcoded en ExRazona.jsx) | **~67** |
| Ejercicios generados dinamicamente | ilimitados |
| Areas tematicas DILO | **12** |
| Niveles DILO | **5** (N1-N5, por longitud de frase) |
| Modulos activos | **17** (en 6 planetas) |
| Planetas | **6** (Aprende, Dilo, Cuenta, Razona, Escribe, Lee) |
| Presentaciones (Quien Soy) | **25 slides** predefinidas + auto-generadas |
| Frases control checkpoint | **25** (fijas, generadas del perfil) |
| Comandos voz TokiPlayground | **18** |

---

## 2. FUNCIONALIDADES IMPLEMENTADAS

### Navegacion y estructura
- **6 planetas** orbitando cohete central con animacion CSS
- **Seleccion visual de modulos** — sub-planetas dentro de cada grupo
- **Switch Estudio/Presentacion inline** en ExQuienSoy
- **Modo Presentacion**: Toki como apuntador silencioso
- **3 presentaciones max activas** con toggle ON/OFF en settings

### Mejoras Cientificas M1-M10
- **M1**: Contador repeticiones por frase (count, avgStars, dates)
- **M2**: Informe grafica SVG mensual (MonthlyReport)
- **M3**: Repeticion inteligente max 3 intentos + auto-pass
- **M4**: Modo rafaga con repeticiones configurables (2-10)
- **M5**: Velocidad adaptativa TTS [0.7, 0.85, 1.0, 1.1]
- **M6**: Grabacion voces referencia con trimSilence + validacion duracion
- **M7a**: Modo dinamico DILO (nivel auto 1-5 segun aciertos)
- **M7b**: Sesion variada / random (round-robin multiples modulos)
- **M8**: Produccion oral en todos los planetas (toggle ON/OFF)
- **M9**: Fraccionado backward chaining (silabificacion espanola)
- **M10**: Oral tras escribir

### Sistema de voces (COMPLETO)
- **Grabacion**: MediaRecorder 16kHz opus 32kbps
- **Recorte silencios**: `trimSilence()` automatico (umbral 0.01, padding 50ms)
- **Validacion duracion**: 0.5s - 10s
- **Validacion SR**: reconocimiento de voz verifica que lo dicho coincide
- **Almacenamiento**: localStorage (local) + Firebase Storage (nube)
- **Voces publicas**: cesion voluntaria con consentimiento RGPD explícito
- **Matching voces**: mismo genero primero, luego edad mas cercana
- **Prioridad configurable** (Settings > Config):
  - 🏠 **Personales primero** (DEFAULT): local → publicas → TTS
  - 🌐 **Publicas primero**: Firebase → local → TTS
  - 🤖 **Solo Toki**: solo TTS sintetico
  - 🎯 **Forzar voz**: seleccionar voz especifica de las grabadas
- **Revocar voces publicas**: elimina todo de Firebase desde Settings
- **Modos de grabacion**: animos, N1-N5, numeros 1-100, datos personales, Quien Soy

### "Mis frases" (escritura personalizada)
- **Auto frases desde perfil**: nombre, direccion, telefono, padres, colegio
- **Extras editables**: el supervisor anade frases adicionales
- **Deduplica**: auto + extras sin repeticiones
- **4 niveles**: mayusc/minusc x con/sin guia (7/71/72/73)
- **MAX_PHRASE_LEN**: 40 caracteres

### TokiPlayground (mascota interactiva)
- **18 comandos de voz**: baila, salta, gira, ladra, sientate, dame la pata,
  al suelo, duerme, floss, te quiero, hola, como estas, come, valiente,
  feliz, busca, beso, gira (spin)
- **Reconocimiento continuo**: SR loop con auto-restart
- **Burbujas de dialogo**: Toki responde visualmente
- **Animaciones CSS**: tp-jump, tp-spin, tp-floss, tp-sit, tp-paw, tp-roll, tp-bubble
- **Indicador mic**: pulso verde "Hablale a Toki"

### Control de progresion (checkpoints cada ~30 sesiones)
- **25 frases fijas** generadas del perfil (identidad, familia, necesidades, social, articulacion)
- **Grabacion audio + SR**: MediaRecorder + SpeechRecognition simultaneo
- **Puntuacion por frase**: 0-4 estrellas con matching normalizado
- **Alerta discreta**: punto rojo en ⚙️ cuando pendiente (desde sesion 28)
- **Banner rojo en Settings > Progreso**: "Grabacion de control pendiente"
- **Se inicia desde Settings**, no interrumpe al nino
- **Visor de controles**: expandible, comparacion entre controles (📈/📉), audio reproducible
- **Datos almacenados**: fecha, numero, resultados, stats de sesiones intermedias

### Gamificacion
- **Mascota espacial** 6 tiers (SpaceMascot): Estrellita → Legendaria
- **Perro Toki** (DogMascot): 3 fases SVG, sistema alimentacion, kawaii con gradientes
- **Rachas**: badge fuego cuando >= 2 consecutivas
- **Hitos sesion**: overlays a 5, 10, 20 correctas
- **Podio personal DoneScreen**: vs mejores 2 historicas
- **Victoria jingle**: melodia tipo Mario con Web Audio API
- **DoneScreen responsive**: portrait (scroll) + landscape (3 columnas)

### Seguridad / UX
- **SOS con cancelacion audio global**: nombre, apellidos, direccion, botones llamada
- **Touch targets >= 44px** en toda la app
- **PIN supervisor**: doble confirmacion, auto-lock 10 min
- **Tema espacial / sobrio**: dos modos visuales
- **Cielo dinamico**: morning/afternoon/night basado en hora real
- **Casco astronauta**: overlay SVG opcional (toggle en settings)
- **Color cohete**: rojo/azul/verde/dorado/morado
- **Wake Lock** durante game
- **Idle detection**: mensajes progresivos cada 15s

### Consentimiento y proteccion de datos
- **Formulario registro**: checkbox obligatorio Terminos + Privacidad
- **Marketing opt-in**: checkbox opcional "recibir novedades de Toki"
- **Google consent gate**: usuarios nuevos via Google pasan por pantalla de consentimiento
- **Consentimiento en Firestore**: fecha + opcion guardados por usuario
- **Cesion voz RGPD**: texto legal completo como tutor legal (art. 6.1.a)
- **Revocar voces publicas**: elimina Storage + Firestore desde Settings
- **Textos legales**: Terminos de uso (9 clausulas) + Politica de Privacidad (RGPD compliant)
- **Soporte oculto**: boton "Soporte Toki" (mailto sin mostrar email)
- **Panel admin**: muestra quien acepto marketing (📧)

### Auth y Cloud
- **Firebase Auth**: email/password + Google Sign-In
- **Firestore sync**: profiles, personas, consent, con debounce 2s
- **Admin panel**: gestion usuarios (revocar/activar)
- **Modo invitado**: sin cuenta, datos solo locales

---

## 3. ARQUITECTURA TECNICA

### buildQ flow
```
startGame(overrideLv)
  -> Lee nivel de localStorage via getModuleLvOrDef(mod.lvKey, mod.defLv)
  -> Llama buildQ(user, section, level)
     -> DILO: Dynamic DILO level, filtra EX, prioriza rev→fresh→rest, personaliza
     -> ESCRIBE: genWriting con preferences (case, types, guide, pauta)
     -> MISFRASES: getCustomPhrases(user) con auto + extras
     -> LEE: genLee(lv) por modo
     -> QUIENSOY: presentacion por presIdx, genera slides
     -> Numericos: gen* correspondiente
  -> setQ, setIdx(0), setSt, setShowRocket(true) -> game
```

### Sistema de voces — flujo playRec
```
playRec(userId, voiceIds, key)
  ├─ Lee prioridad: getVoicePriority()
  ├─ 'tts' → return false (solo TTS)
  ├─ 'forced' → playRecSingle(userId, forcedVoiceId, key)
  ├─ 'personal' (DEFAULT):
  │   ├─ playRecLocal(userId, voiceIds, key)
  │   └─ Si false → playRecPublic(key) [Firebase best match]
  ├─ 'public':
  │   ├─ playRecPublic(key) [Firebase best match]
  │   └─ Si false → playRecLocal(userId, voiceIds, key)
  └─ return false → caller usa say(text) o sayFB(text)
```

### Firebase structure
```
Auth: Firebase Auth (email/password + Google Sign-In)
Firestore:
  users/{uid}:
    profiles: [{id, name, age, sex, av, photo, hist, srs, voices, presentations, ...}]
    personas: [{name, relation, avatar, photo, phone}]
    email: string
    nick: string
    revoked: boolean
    consent: {termsAccepted, termsDate, marketingOptIn, marketingDate}

  public_voices/{phraseKey}_{uid}:
    phraseKey, phrase, audioURL, speakerName, speakerAge, speakerSex,
    duration, uploadedBy, uploadedAt, moduleKey

Storage:
  public_voices/{phraseKey}/{uid}.webm   -- voces publicas
  users/{uid}/voices/{phraseKey}.webm    -- voces privadas
  photos/{uid}/{filename}                -- fotos perfil

localStorage:
  toki_voice_priority: 'personal'|'public'|'tts'|'forced'
  toki_forced_voice: voiceId
  toki_checkpoints: {[userId]: [{date, number, results, sessionStats, avgScore}]}
  toki_custom_phrases_extra: string[]
  toki_voice_{userId}_{voiceId}: {[key]: base64dataURL, name, avatar, sex}
```

### SRS intervals
```
Niveles: 0-5
Intervalos: [0, 30s, 2min, 1dia, 3dias, 7dias]
srsUp: 4★ 1st → lv5, 3★ 1st → lv4, retry win → lv3, auto-pass → lv0, fail → lv-1
```

---

## 4. COMMITS RECIENTES (esta sesion)

| Commit | Descripcion |
|--------|-------------|
| `105b14c` | Control checkpoints: grabacion cada ~30 sesiones con alerta discreta |
| `ab1f78f` | Formulario de consentimiento + marketing opt-in en registro |
| `5fc6b5a` | Email de soporte/incidencias en toda la app |
| `f8b0661` | Voces publicas: consentimiento legal RGPD + revocar + soporte oculto |
| `c231d5c` | Sistema de prioridad de voces con selector en Settings |

---

## 5. BUGS CONOCIDOS

1. **Duplicado `position` en CSS** — App.jsx ~816: `position:'relative'` duplicado en un estilo inline. Solo warning, no afecta funcionalidad.
2. **VER constante desactualizada** — constants.js muestra version antigua.
3. **Duplicacion IDs colegio** — cl0129-cl0136 duplicados de cl0012-cl0020.
4. **Falta area en preposiciones/conversacion** — prep0001-prep0040 y conv0001-conv0035 sin campo `a:`.

---

## 6. PENDIENTE DE IMPLEMENTAR

### Prioridad alta
- **TokiInteractive avanzado** — 2 patas, mas trucos, mini-juegos, saltar girando, perseguir cola, Floss dance mejorado
- **Collar del perro evolutivo** — visual que cambia con el nivel del perro

### Prioridad media
- **Canje de estrellas** (star shop) — gastar estrellas en recompensas/personalizacion
- **Limpiar constante QUIEN_SOY** — tras confirmar que no se usa directamente
- **Mas ejercicios LEE y RAZONA** — ampliar a 200+ por modulo
- **LEE_PHONICS pre-lectura** — modulo fonetico

### Prioridad baja / futuro
- **ARASAAC pictogramas** — apoyo visual en frases
- **Modulos avanzados 12+** — autonomia, empleo, transporte
- **Fuente OpenDyslexic** — opcion accesible
- **Graduacion elogio por nivel/edad**

---

## 7. DECISIONES DE DISENO

### Filosofia
- **Touch-first**: toda la interaccion para tablet/movil
- **Save immediately**: localStorage tras cada cambio, cloud sync debounce 2s
- **Feedback proporcional**: 4 niveles estrellas, elogio graduado, mascota reactiva
- **Sin castigo**: fallos bajan SRS pero no penalizan al nino
- **No interrumpir**: controles de progresion como alerta, no popup

### Arquitectura
- **Single-file components**: cada modulo autocontenido
- **No router**: navegacion via `scr` state
- **CSS-in-JS inline**: sin archivos CSS externos
- **localStorage source of truth local** + **Firebase backup/sync**
- **Overlay pattern**: todos modals via `ov` state

### Pedagogicas
- **Metodo Troncoso**: lectura global y produccion oral
- **Backward chaining**: silabas desordenadas para reconstruir
- **SRS adaptativa**: intervalos basados en calidad
- **Dynamic leveling**: sube/baja segun ultimos 8 ejercicios
- **Voces reales sobre TTS**: prioridad a grabaciones personales
- **Tolerancia configurable**: slider 50-100% exigencia SR

### Proteccion de datos
- **RGPD compliant**: consentimiento explicito para registro, marketing y cesion voz
- **Datos menores**: responsabilidad del tutor legal
- **Revocable**: voces publicas eliminables desde Settings
- **Email oculto**: soporte via boton sin mostrar direccion
