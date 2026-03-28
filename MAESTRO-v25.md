# TOKI APP - DOCUMENTO MAESTRO v25

**Fecha:** 28 marzo 2026
**Autor:** Diego Aroca
**Version app:** v24.0 (constants.js) / v25.2 (commits)
**Ultimo commit:** `f72364f v25.2: Fix seleccion modulos en Aprende - feedback visual correcto`

---

## 1. ESTADO ACTUAL DE LA APP

### Stack tecnologico
- **Frontend:** React 18.2 + Vite 5.1
- **Lenguaje:** JavaScript (JSX), sin TypeScript
- **Backend/Auth:** Firebase (Auth, Firestore, Storage)
- **Deploy:** Vercel
- **PWA:** Manifest + Service Worker
- **Testing:** Vitest 4.1
- **Dependencias extra:** pdf-lib, pdfjs-dist, sharp, canvas (para procesamiento de imagenes)
- **Fuente:** Fredoka (Google Fonts) + Caveat (escritura minusculas)

### Estructura de archivos

```
src/
  App.jsx                    # Componente principal (~717 lineas). Login, perfiles, navegacion planetas, game loop, overlays
  main.jsx                   # Entry point: ReactDOM.createRoot
  exercises.js               # ~1291 ejercicios de diccion (frases funcionales para la vida)
  constants.js               # Colores, CSS global, avatares, GROUPS (6 planetas), LV_OPTS, mensajes
  utils.js                   # Funciones puras: score(), SRS, localStorage, personalize(), splitSyllables(), getGroupsForUser()
  voice.js                   # TTS (say, sayFB, sayFast), Speech Recognition (useSR, listenQuick), voces publicas
  cloud.js                   # processImage(), cloudSaveProfile/Load, generateAutoPresentation()
  firebase.js                # Config Firebase, Auth (email+Google), Firestore CRUD, Storage (fotos, voces), Share codes

  components/
    Settings.jsx             # Panel supervisor: PIN, sesion, tema, planetas, niveles, familia, personas, presentaciones
    CelebrationOverlay.jsx   # Estrellas pirotecnicas + confeti + cohete
    DoneScreen.jsx           # Pantalla fin de sesion: trofeo, podio personal, mascota evolutiva, botones repetir/menu
    EmergencyButton.jsx      # Boton SOS: datos personales en pantalla roja, llamadas telefono, mapa a casa
    PhotoCropOverlay.jsx     # Crop de fotos: circular (avatar) y 16:9 (presentaciones). Pinch-zoom + drag
    RocketTransition.jsx     # Animacion cohete 3-2-1 al iniciar ejercicios
    MiCielo.jsx              # Visualizacion constelaciones: cada estrella = 1 ejercicio perfecto
    MonthlyReport.jsx        # Informe mensual: dias jugados, estrellas, progreso por modulo
    SpeakPanel.jsx           # Motor de diccion: ExFlu, ExFrases, ExFrasesBlank, ExSit
    UIKit.jsx                # SpaceMascot (SVG evolutiva 6 tiers), Confetti, Ring, Tower, RecBtn, NumPad, AstronautAvatar, useIdle
    VoiceRec.jsx             # Grabacion de voces: grabar frases/animos/numeros, publicar a Firebase

  modules/
    ExQuienSoy.jsx           # Presentaciones: Estudio (repetir frases con foto) + Presentacion (automatica con timer)
    ExCount.jsx              # Cuenta conmigo: grid numeros con bloques de colores, velocidad ajustable
    ExMath.jsx               # Sumas y restas: visual con dedos, barras animadas, numpad
    ExMulti.jsx              # Multiplicaciones: visual con grupos de emojis, numpad
    ExFraction.jsx           # Fracciones: PieChart/RectChart SVG, 5 niveles (reconocer/notacion/equivalencia/sumar/restar)
    ExMoney.jsx              # Monedas y billetes: SVG realistas, reconocer/sumar/pagar/cambio
    ExClock.jsx              # La hora: ClockFace SVG, en punto/media/cuarto
    ExCalendar.jsx           # Calendario: dias semana, meses, antes/despues, ayer/manana
    ExDistribute.jsx         # Reparte y cuenta: BagSVG, DominoSVG, CardSVG, poner/repartir/comparar
    ExWriting.jsx            # Escritura: canvas con pauta francesa, guias de trazos, letras/palabras/frases
    ExRazona.jsx             # Razonamiento: espacial (donde esta), series (colores/formas), piensa, clasifica, emociones
    ExLee.jsx                # Lectura: intruso, palabra+imagen, completa, ordena silabas, lee y haz
```

### 6 Planetas con sus modulos y niveles

Definidos en `constants.js` como `GROUPS[]`:

#### APRENDE (id: aprende, color: #E91E63)
- **Quien Soy** (k: quiensoy) - Dinamico: genera modulos desde `user.presentations[]`
  - Nivel 1: Estudio (repetir frase a frase con feedback)
  - Nivel 2: Presentacion (presentacion automatica con timer)
  - Switch inline dentro del ejercicio (ModeSwitch)

#### DILO (id: dilo, color: #2ECC71)
- **Aprende a decirlo** (k: decir) - 5 niveles por longitud de frase (1-2 pal, 2-3, 3-4, 4-5, 5+)
- **Forma la frase** (k: frase) - 3 niveles (3 pal, 4 pal, 5 pal)
- **Cuenta conmigo** (k: contar) - 4 niveles (1-20, 20-50, 50-100, 1-100)

#### CUENTA (id: cuenta, color: #E67E22)
- **Sumas y Restas** (k: math) - 4 niveles (sumas facil, sumas+, restas, mezcla)
- **Multiplicaciones** (k: multi) - 3 niveles (x2/x3, x5/x10, mezcla)
- **Fracciones** (k: frac) - 5 niveles (reconocer, notacion, equivalencias, sumar, sumar/restar)

#### RAZONA (id: razona, color: #3498DB)
- **Donde esta?** (k: razona, lvKey: razona_spatial) - 2 niveles (elige, arrastra)
- **Series** (k: razona, lvKey: razona_series) - 3 niveles (colores, formas, combinado)
- **Piensa** (k: razona, lvKey: razona_piensa) - Causa-efecto
- **Clasifica** (k: razona, lvKey: razona_clasifica) - Clasificar items
- **Emociones** (k: razona, lvKey: razona_emociones) - Identificar emociones
- **Monedas y Billetes** (k: money) - 4 niveles (reconocer, sumar, pagar, cambio)
- **La Hora** (k: clock) - 3 niveles (en punto, media, cuarto)
- **Calendario** (k: calendar) - 4 niveles (dias, meses, antes/despues, ayer/manana)
- **Reparte y Cuenta** (k: distribute) - 3 niveles (poner, repartir, comparar)

#### ESCRIBE (id: escribe, color: #9B59B6)
- **Escritura** (k: writing) - Multiples combinaciones:
  - Mayusculas/Minusculas (escribeCase)
  - Letras/Palabras/Frases (escribeTypes, max 2)
  - Con guia/Sin guia (escribeGuide por tipo)
  - Tamanio pauta: Principiante/Medio/Avanzado/Experto (escribePauta)
  - Niveles internos: 1(MAY+guia), 2(MAY-guia), 3(min+guia), 4(min-guia), 5/51(pal MAY), 52/53(pal min), 6/61(frase MAY), 62/63(frase min)

#### LEE (id: lee, color: #E91E63)
- **Intruso** (k: lee, lvKey: lee_intruso) - Encontrar la palabra que no pertenece
- **Palabra+Imagen** (k: lee, lvKey: lee_word_img) - Asociar palabra con emoji correcto
- **Completa** (k: lee, lvKey: lee_complete) - Rellenar la letra que falta
- **Ordena silabas** (k: lee, lvKey: lee_syllables) - Ordenar silabas para formar palabra
- **Lee y haz** (k: lee, lvKey: lee_read_do) - Leer instruccion y tocar respuesta

---

## 2. FUNCIONALIDADES IMPLEMENTADAS

### Login y perfiles
- Pantalla de perfiles con planetas orbitantes (cada perfil = planeta con avatar)
- Creacion de perfil: nombre, fecha nacimiento, sexo, avatar emoji, foto (crop circular)
- Hasta 15 perfiles por dispositivo
- Auto-calculo de edad desde fecha de nacimiento
- Personas orbitan alrededor del perfil al hacer hover (en escritorio)
- Campo colegio/centro formacion cambia automaticamente si edad >= 16 anos

### Firebase Auth
- Login con Google (popup)
- Login con email/contrasena
- Registro con email/contrasena (min 6 caracteres)
- Modo invitado (datos solo locales)
- Sincronizacion automatica a la nube con debounce de 2 segundos
- Admin panel para email configurado (ADMIN_EMAIL = diego@toki-app.es)
- Revocar/Activar usuarios desde admin
- Share codes para compartir perfiles entre dispositivos (fbCreateShareCode/fbLinkToSharedProfile)

### Navegacion por planetas
- Vista orbital: 6 planetas girando alrededor de un cohete central con animacion CSS
- Planetas desactivados se muestran en gris con opacidad reducida
- Al tocar un planeta se abre vista expandida con sub-planetas (modulos)
- Sub-planetas con feedback visual: activo = colores vivos + borde, inactivo = atenuado
- Boton cohete pulsante para iniciar juego

### Sistema de ejercicios (buildQ)
- Genera cola de ejercicios segun seccion y nivel seleccionado
- Multi-nivel: si el usuario tiene varios niveles activos, mezcla ejercicios de todos
- SRS (Spaced Repetition): prioriza ejercicios que necesitan repaso (needsRev)
- Personalizacion: reemplaza {nombre}, {padre}, {madre}, {tel_padre}, etc. en frases
- 1291 frases de diccion organizadas en 12 areas funcionales (seguridad, salud, necesidades, compras, transporte, restaurante, relaciones, sentimientos, colegio, ocio, tecnologia, casa)

### Motor de diccion (SpeakPanel)
- TTS adaptativo: velocidad y tono segun edad y sexo del usuario (getVP)
- Speech Recognition con SpeechRecognition API (5 alternativas)
- Score de 0-4 basado en Levenshtein distance + matching por palabras
- Tolerancia ajustable (exigencia 50-100%)
- Feedback progresivo: perfecto -> bueno -> reintento -> por silabas -> despacio
- Voces grabadas: prioridad a voces publicas (Firebase), luego locales (localStorage)
- Voces de feedback (cheerOrSay): animos grabados vs TTS sintetico

### Presentaciones (Aprende)
- Generacion automatica desde datos del perfil y personas (generateAutoPresentation)
- Hasta 5 presentaciones por perfil
- Edicion: nombre, frases, fotos por diapositiva (crop 16:9)
- Modo Estudio: TTS lee la frase, el nino repite, evaluacion SRS
- Modo Presentacion: presentacion automatica con timer y barra lateral
- Switch inline (ModeSwitch) dentro del ejercicio: Estudio / Presentacion
- Migracion especifica: presentacion "Sindrome de Down" para el perfil de Guillermo

### Cuenta conmigo (ExCount)
- Grid visual de numeros con bloques de colores (NUM_BLOCK_COLORS)
- Conteo por lotes de decenas
- Slider de velocidad: Lento (1200ms) / Normal (800ms) / Rapido (400ms), persistido en localStorage
- Reconocimiento de voz rapido (listenQuick) para verificar

### Sumas y Restas (ExMath)
- Visualizacion con dedos (Fingers SVG), conteo animado (AnimCount)
- Resta visual: barras que se tachan progresivamente
- NumPad personalizado para respuesta
- TTS lee la operacion, luego el resultado

### Multiplicaciones (ExMulti)
- Visualizacion con grupos de emojis (ej: 3 grupos de 5 manzanas)
- Boton "Ver ayuda" muestra la suma equivalente
- NumPad + TTS con explicacion de la suma

### Fracciones (ExFraction)
- PieChart SVG (tarta) y RectChart SVG (barras) con animacion
- 5 modos: reconocer, notacion, equivalencia, sumar, restar
- Seleccion tocando porciones o NumPad segun modo

### Monedas y Billetes (ExMoney)
- SVG realistas de monedas (cobre 1/2/5c, oro 10/20/50c, bimetalicas 1/2EUR) y billetes (5/10/20/50 EUR)
- 4 modos: reconocer valor, sumar monedas, pagar un precio seleccionando monedas, calcular cambio
- NumPad con soporte decimal (coma)

### La Hora (ExClock)
- ClockFace SVG con manecillas y numeros
- 3 niveles: en punto, y media, y cuarto

### Calendario (ExCalendar)
- Dias de la semana, meses del ano
- Antes/despues, ayer/manana

### Reparte y Cuenta (ExDistribute)
- Usa nombres de "Mis Personas" del perfil (o nombres default: Yasser, Lola, Vega, Amir, Carlos)
- BagSVG, DominoSVG, CardSVG para visualizacion
- 3 modos: poner N cosas, repartir equitativamente, comparar cantidades

### Escritura (ExWriting)
- Canvas HTML5 con pauta francesa (3 lineas: base, superior, media punteada)
- Guias de trazos con flechas numeradas (STROKE_GUIDES para A-Z y N)
- Animacion "fantasma" que muestra como trazar la letra
- Mayusculas (Fredoka bold) y minusculas (Caveat cursiva)
- Letras sueltas, palabras (CASA, MESA, SOL, PAN, LUZ...), frases (ME LLAMO GUILLERMO, HOY ES LUNES...)
- Deteccion de cobertura de trazos para puntuacion
- 4 tamanios de pauta: Principiante (32px), Medio (26px), Avanzado (20px), Experto (16px)

### Razonamiento (ExRazona)
- **Espacial:** escenas SVG (mesa, silla, estanteria, caja, mochila, puerta, armario) con objetos posicionados
  - Nivel 1: Elige respuesta (encima/debajo/dentro/al lado)
  - Nivel 2: Arrastra objeto a posicion correcta (SpatialDrag con touch events)
- **Series:** patrones de colores, formas y combinados
- **Piensa:** causa-efecto
- **Clasifica:** items en categorias (frutas/animales, ropa/muebles, etc.)
- **Emociones:** identificar emociones en situaciones

### Lectura (ExLee)
- **Intruso:** 8 categorias (animal, fruta, color, ropa, mueble, transporte, cuerpo, comida)
- **Palabra+Imagen:** 8 ejercicios (PERRO, GATO, SOL, LUNA, CASA, ARBOL, MANZANA, COCHE)
- **Completa:** 8 palabras (P_RRO, G_TO, M_SA, C_SA, L_NA, L_BRO, AG_A, P_LO)
- **Ordena silabas:** 10 palabras (GATO, MESA, LUNA, PERRO, CASA, PELO, PATO, RANA, MONO, VASO)
- **Lee y haz:** 6 instrucciones (TOCA EL ROJO, TOCA EL AZUL, TOCA EL GRANDE, TOCA EL ANIMAL, etc.)

### Sistema de celebraciones
- **Estrellas pirotecnicas** (CelebrationOverlay): 18 estrellas explotando desde el centro + 14 sparkles + 10 confeti colores + cohete volando
- **Confetti** (Confetti): 24 particulas de colores cayendo con animacion confDrop
- **Rachas** (correctStreak): badge "x3" con rayo, "x5" con doble fuego, esquina superior derecha
- **Milestones**: 5 ok = "Vas genial!", 10 = "Imparable!", 20 = "Superestrella!"
- **Trofeo a los 8 min** (trophy8): overlay con trofeo 80px + stats + confeti
- **Mascota evolutiva** (SpaceMascot SVG): estrella con 6 tiers:
  - Tier 0 (0 stars): Estrellita - estrella dorada simple con ojos y boca
  - Tier 1 (50+): Bronce - anillo brillante animado
  - Tier 2 (150+): Plata - particulas sparkle parpadeantes
  - Tier 3 (300+): Oro - corona de 3 triangulos dorados
  - Tier 4 (500+): Superestrella - capa roja con animacion
  - Tier 5 (1000+): Legendaria - capa morada + halo eliptico + gradiente arcoiris animado
- **Podio personal** (DoneScreen): compara hoy vs mejores 2 sesiones historicas con medallas oro/plata/bronce
- **Barra de progreso de mascota**: en DoneScreen, muestra progreso hacia siguiente tier
- **Mi Cielo** (MiCielo): campo de estrellas SVG determinista, cada estrella = 1 ejercicio perfecto, constelaciones cada 10 estrellas con nombres (El Cohete, La Corona, El Oso, etc.)

### Settings (Panel supervisor)
- **PIN:** 4 digitos con NumPad custom, doble confirmacion al crear, cambio con verificacion actual
- **Sesion:** 15, 25, 44 minutos o infinito (SMINS)
- **Tema visual:** Espacial (cielo dinamico manana/tarde/noche) o Sobrio (sin animaciones)
- **Casco:** ON/OFF para avatares astronauta (AstronautAvatar)
- **Color cohete:** Rojo, Azul, Verde, Dorado, Morado (ROCKET_COLORS)
- **Limites y tolerancia:** Tiempo maximo diario (30/60/120/sin limite), Tolerancia diccion slider 50-100%
- **Planetas activos:** Activar/desactivar modulos individualmente con UI circular de planetas y satelites
- **Nivel por modulo:** Multi-select de niveles, boton "Todo" para activar/desactivar todos
- **Escribe config:** Case (MAY/min), tipos (letras/palabras/frases max 2), guia ON/OFF por tipo, tamanio pauta slider con preview
- **Sesion de hoy:** Libre vs Guiada (hasta 4 tareas seleccionables por modulo)
- **Modulo de hoy:** Eleccion libre (nino elige) vs forzar modulo especifico
- **Familia (tab):** Foto perfil con crop, apellidos, colegio, telefono emergencia, direccion
- **Mis Personas:** Hasta 10 personas con nombre, relacion (14 opciones), avatar emoji/foto. Se usan en Reparte y Cuenta
- **Presentaciones:** Crear (auto desde datos o manual), editar frases y fotos, borrar. Max 5.
- **Compartir perfil:** Generar codigo 3 letras + 3 numeros (Firebase share codes)
- **Grabar voces:** Modulos: frases por nivel, animos, numeros 1-100, personal, Quien Soy. Validacion duracion + trim silencio + SR check
- **Stats (tab):** Historial de sesiones por dia
- **SRS (tab):** Estado del Spaced Repetition por ejercicio
- **Informe mensual:** MonthlyReport genera texto con estadisticas copiable
- **Borrar perfil / Resetear app** (conserva voces grabadas en localStorage)

### SOS/Emergencia (EmergencyButton)
- Boton fijo en esquina inferior derecha durante juego (pulsante rojo, animacion sosPulse)
- Pantalla roja de emergencia a pantalla completa con:
  - Nombre y apellidos en MAYUSCULAS grandes (36px)
  - Direccion de casa
  - "NECESITO AYUDA"
  - TTS automatico repitiendo datos cada 10 segundos en bucle
  - Boton llamar al padre (tel: link con numero formateado)
  - Boton llamar a la madre (si telefono diferente)
  - Boton emergencias 112
  - Boton "Ir a casa con mapa" (Google Maps walking directions con geolocalizacion actual)
  - 6 consejos de seguridad vial antes de abrir mapa (caminar por acera, paso cebra, semaforo, etc.)
  - Deteccion de conexion a internet (navigator.onLine) para mostrar/ocultar opcion mapa

### Responsive y accesibilidad
- 3 breakpoints CSS: <360px (super compacto), <480px (movil), 768px+ landscape (tablet/desktop)
- #root max-width 1100px, padding adaptativo
- Touch-first: -webkit-tap-highlight-color transparent, touch-action manipulation
- Focus-visible: outline 3px solid #FFD700 para accesibilidad teclado
- user-select none excepto inputs/textareas
- min-height: 44px/48px/52px en todos los botones interactivos
- Modo sobrio: sin animaciones, colores planos, sin mascota (body.theme-sober)

### Cielo dinamico
- 3 franjas horarias: manana (6-14h azul claro), tarde (14-20h atardecer rojo/naranja), noche (20-6h oscuro con estrellas twinkle)
- Gradientes CSS cambian automaticamente cada minuto via setInterval
- Estrellas animadas (14 radial-gradients con twinkle 8s) solo en modo noche

### Otras funcionalidades
- **Wake Lock API**: mantiene pantalla encendida durante juego (scr === 'game')
- **Auto-request mic**: pide permiso microfono al primer click/touch del documento
- **Idle detection**: si 2 min sin actividad (IDLE_THRESH=120000), pausa timer de sesion activa
- **useIdle hook**: mensajes progresivos cada 15s si el nino no interactua
- **Modo supervisor**: se activa con PIN, dura 10 minutos (setTimeout 600000ms), toggle skip-btn visible
- **Beeps musicales**: starBeep (4 melodias aleatorias), countdownBeep (440Hz tick, 880Hz final), victoryBeeps (melodia de 10 notas)
- **Ajuste de nivel automatico**: si 3 fallos consecutivos (consec>=3), overlay pregunta "Bajamos el nivel?"
- **Recovery de voces**: match orphaned toki_voice_* keys con perfiles actuales por nombre de voz
- **Auto-gen presentacion**: al crear perfil, genera presentacion "Quien Soy" automaticamente desde datos personales y personas

---

## 3. BUGS CONOCIDOS POR CORREGIR

### Fotos descuadradas en crop (PhotoCropOverlay)
El PhotoCropOverlay calcula las coordenadas de recorte usando `getBoundingClientRect()` de la imagen renderizada vs el contenedor. Cuando la imagen se mueve/escala con pinch-zoom, las coordenadas `srcX/srcY` pueden quedar desalineadas respecto a lo que se ve en el circulo/rectangulo de recorte. La transformacion CSS `translate + scale` se aplica desde el centro de la imagen, pero el calculo en `doSave()` asume posicion relativa al contenedor. Archivo: `src/components/PhotoCropOverlay.jsx`, funcion `doSave()` lineas 26-53.

### Telefono con puntos dice "punto" en TTS
En `cloud.js` linea 81, el telefono se convierte con `tel.split('.').filter(Boolean).join(', ')` que produce "6, 2, 6, 8, 4, 8". Sin embargo, dependiendo del motor TTS del dispositivo, la voz sintetica podria pronunciar "punto" en lugar de hacer una pausa al encontrar el separador. El formato de salida parece correcto pero el problema puede estar en como el TTS interpreta los numeros individuales o las comas.

### Modo Presentacion: evaluacion entre frases
En ExQuienSoyPres, el modo presentacion deberia avanzar automaticamente entre diapositivas sin pedir al nino que repita cada frase. Actualmente el timer de la barra lateral (QSTimeBar) se activa y evalua la pronunciacion entre diapositivas cuando no deberia. Archivo: `src/modules/ExQuienSoy.jsx`.

### VER desactualizada
En `constants.js` linea 6, `VER='v24.0'` pero los commits muestran v25.2. La constante de version no se actualiza automaticamente con los commits.

### IDs duplicados en exercises.js
Hay IDs duplicados entre areas diferentes. Por ejemplo `re0018`, `re0019`, `re0020` aparecen tanto en "restaurante" como en "relaciones". Esto causa conflictos en el SRS ya que se usa el ID como clave unica en `user.srs[id]`, por lo que el progreso de un ejercicio de restaurante se mezcla con uno de relaciones.

### Guardado en Settings no siempre auto-guarda
En la tab "config", la seccion "Sesion de hoy" todavia tiene un boton "Guardar" manual (Settings.jsx linea ~225), mientras que la filosofia de la app es auto-guardado. La mayoria de los otros controles si guardan automaticamente con `saveData()` inmediato al cambiar valor.

### Dependencias innecesarias en package.json
Las dependencias `canvas`, `sharp`, `pdf-lib`, `pdf-poppler`, `pdfjs-dist` estan en dependencies pero no se importan en ningun archivo del `src/`. Son residuos de iteraciones anteriores. Aumentan el tamano de node_modules sin beneficio.

---

## 4. PENDIENTE DE IMPLEMENTAR

### PIN obligatorio para entrar a Settings + auto-guardado completo
- Actualmente el PIN se pide al acceder al panel pero hay un boton "Guardar" en "Sesion de hoy". Eliminar ese boton y hacer que todo se auto-guarde al cambiar.

### Siluetas de mascotas (mostrar todas, bloqueadas como sombras)
- En DoneScreen ya se muestran todas las mascotas con `filter: brightness(0.15)` para las bloqueadas. Falta implementar esto tambien en la pantalla principal (goals) y en la pantalla de login, para que el nino vea las mascotas que puede desbloquear como siluetas oscuras motivadoras.

### ARASAAC pictogramas
- Integrar pictogramas de ARASAAC para las frases de diccion, mejorando la comprension visual para usuarios que necesitan apoyo pictografico.

### Mas ejercicios (200+ recomendados por QA)
- Actualmente hay 1291 frases de diccion. Se recomienda ampliar a 1500+ con mas areas y niveles.
- LEE tiene solo ~8-10 items por sub-modulo (intruso: 8, word_img: 8, complete: 8, syllables: 10, read_do: 6). Necesita al menos 30+ por modulo.
- Razona espacial tiene solo 8 escenarios + 8 arrastrar. Ampliar a 20+ cada uno.
- Razona intruso: 8 ejercicios. Ampliar a 20+.
- Razona clasifica: pocos sets. Ampliar.

### LEE_PHONICS (pre-lectura)
- Modulo de fonetica: reconocer sonidos de letras, asociar fonema-grafema, conciencia fonologica basica.

### Modulos avanzados 12+
- Contenido para adolescentes y adultos: situaciones laborales, transporte publico avanzado, gestion del dinero (presupuesto, ahorro), relaciones sociales complejas, seguridad digital.

### Fuente OpenDyslexic
- Opcion en Settings para activar fuente OpenDyslexic, disenada para personas con dislexia. Aplicar a todo el texto de ejercicios.

### Login con email: recuperacion de contrasena
- Ya implementado login/registro con email (fbSignIn, fbSignUp). Falta flow de "He olvidado mi contrasena" (sendPasswordResetEmail de Firebase Auth).

### Ejercicios "Que dirias?" mover a Razona > Piensa
- Algunos ejercicios situacionales de tipo 'sit' en exercises.js deberian estar en Razona > Piensa en lugar de Dilo, ya que requieren razonamiento social mas que diccion.

### Slider velocidad numeros
- Ya implementado en ExCount (SPEED_PRESETS: lento 1200ms / normal 800ms / rapido 400ms). Verificar persistencia correcta en localStorage y que la UI slider funciona bien en todos los dispositivos.

### Graduacion de elogio por nivel/edad
- Actualmente los mensajes de animo (PERFECT_T, GOOD_MSG, SHORT_OK, etc.) son iguales para todas las edades. Implementar mensajes diferenciados:
  - 3-8 anos: muy entusiastas, emojis
  - 9-14 anos: moderados
  - 15+ anos: mas maduros, sin condescendencia

### Sistema de progresion visual desde pantalla inicio
- Mostrar indicadores de progreso por planeta en la vista orbital (ej: barra radial alrededor de cada planeta, o estrellas acumuladas por grupo), para que nino/supervisor vean el avance sin entrar a Settings.

---

## 5. DECISIONES DE DISENO

### Max modulos: sin limite (supervisor decide)
- `MAX_SEL=99` en Settings. El supervisor puede activar todos los niveles de un modulo o ninguno. El boton "Todo" activa/desactiva todos los niveles de golpe.

### Celebraciones: centralizadas en App.jsx
- `conf` (Confetti), `milestone`, `trophy8`, `correctStreak` son estado en App.jsx
- `onOk()` y `onSk()` en App.jsx centralizan la logica de feedback, SRS y progresion
- CelebrationOverlay y DoneScreen son componentes presentacionales reutilizables

### Fotos: crop circular para avatar, 16:9 para presentaciones
- PhotoCropOverlay acepta `shape='circle'` (avatar, personas) o `shape='rect'` (diapositivas)
- Avatar: output 480x480 JPEG 88%, recortado en circulo via canvas clip
- Presentacion: output RECT_W x RECT_H (70% pantalla, max 600px) JPEG 88%
- Compresion en Firebase Storage: 200x200 max, JPEG 60% (compressImage)

### Presentacion vs Estudio: switch inline dentro del ejercicio
- En ExQuienSoyUnified, ModeSwitch permite cambiar entre Estudio y Presentacion sin salir del ejercicio
- buildQ siempre genera items con `canToggle=true` si ambos modos estan activos
- En Settings, las presentaciones NO muestran toggles Estudio/Presentacion (switch es intrinseco al ejercicio)
- startGame SIEMPRE forza `freshLv=[1,2]` para quiensoy, ignorando localStorage

### Auto-guardado en Settings (sin boton Guardar)
- La mayoria de controles guardan inmediatamente con `saveData()` al onChange
- Excepcion pendiente: "Sesion de hoy" todavia tiene boton Guardar

### Telefono: puntos como separador de lectura
- El usuario escribe "6.1.2.3.4.5.6.7.8" y el TTS lee "6, 1, 2, 3, 4, 5, 6, 7, 8" (split por punto)
- Grupos con punto: "626.84.84.48" se lee como "626, 84, 84, 48"
- Sin puntos: se lee el numero completo de golpe

### Tema dinamico
- Cielo cambia con la hora del dia: manana (azul claro), tarde (atardecer rojo/naranja), noche (oscuro + estrellas)
- Tema "Sobrio" sobreescribe todo con fondo plano #1a1a2e y sin animaciones (class `.theme-sober`)
- `.sober-hide` oculta elementos decorativos (mascota, etc.) en modo sobrio

### Tolerancia de diccion
- `adjScore(raw)` ajusta el score segun `exigencia` (50-100%)
- 50% = muy flexible (casi todo vale), 100% = estricto (Levenshtein exacto)
- Por defecto 65%, configurable con slider en Settings > Limites y tolerancia

### Datos del perfil que se usan en ejercicios
- `personalize(text, user)` reemplaza: {nombre}, {apellidos}, {padre}, {madre}, {hermano1}, {hermana1}, {tel_padre}, {tel_madre}, {direccion}, {colegio}
- Las personas de "Mis Personas" se usan como nombres en ExDistribute (Reparte y Cuenta)

---

## 6. ARQUITECTURA TECNICA

### buildQ (App.jsx, linea ~201)
Genera la cola de ejercicios para una sesion:

1. **Recibe:** `(user, section, slv)` donde section es el tipo de ejercicio y slv el nivel (o array de niveles)
2. **Multi-nivel:** Si `slv` es array con >1 elemento, llama recursivamente para cada nivel y mezcla (shuffle)
3. **Por seccion:**
   - `quiensoy`: Busca la presentacion correcta via `curPresLvKeyRef.current` -> `presIdx`, genera items de tipo 'quiensoy' con texto personalizado, imagen, picto y datos de presentacion. Fallback si no hay datos: "Hola, me llamo {nombre}"
   - `decir`: Filtra EX por `ty='flu'` y longitud de palabras segun nivel. Aplica SRS: primero los que necesitan repaso (max 24), luego nuevos (max 12), luego rest (max 4). Hasta 40 ejercicios, personalizados
   - `frase`: Filtra EX por longitud exacta de palabras, genera tipo 'frases' o 'frases_blank' (completar palabra faltante al azar)
   - `contar`: Genera batches de decenas, merge batches pequenos (<5 nums)
   - `math`: Llama genMath(lv), max 30 operaciones
   - `frac`: Llama genFractions(lv), max 20
   - `multi`: Llama genMulti(lv), max 20
   - `money`: Llama genMoney(lv)
   - `clock`: Llama genClock(lv)
   - `calendar`: Llama genCalendar(lv)
   - `distribute`: Llama genDistribute(lv, user)
   - `writing`: Lee preferencias de escribe (case, types, guide), mapea a niveles internos (1-63), genera con genWriting
   - `razona`: Llama genRazona(lv)
   - `lee`: Llama genLee(lv)

### getModuleLvOrDef (utils.js)
```
getModuleLvOrDef(modKey, defLv):
  1. Lee localStorage 'toki_mod_lv_{modKey}'
  2. Si existe y tiene valores -> devuelve array de niveles activos
  3. Si existe pero esta vacio -> devuelve [] (modulo desactivado)
  4. Si no existe -> devuelve defLv (valor por defecto del GROUPS)
```
- Los niveles se almacenan siempre como array (ej: [1,2] para Estudio+Presentacion)
- `setModuleLv(modKey, lv)` guarda en localStorage como array
- `getModuleLv(modKey)` lee raw, convierte a array si es escalar

### dynGroups / getGroupsForUser (utils.js)
```
getGroupsForUser(user, GROUPS):
  1. Si no hay user, devuelve GROUPS sin modificar
  2. Obtiene user.presentations[]
  3. Para el grupo 'aprende':
     - Si no hay presentaciones -> modulo default "Mi presentacion" (presIdx:0, lvKey:'pres_0')
     - Si hay N presentaciones -> genera N modulos, cada uno con:
       - k: 'quiensoy'
       - l: nombre de la presentacion
       - defLv: [1,2]
       - lvKey: 'pres_{i}'
       - presIdx: i
  4. Los demas grupos se devuelven sin modificar
```
- Se recalcula con `useMemo` cuando cambia `user` o `user.presentations`
- Permite al usuario tener multiples presentaciones (max 5), cada una como un modulo independiente en Aprende

### curPresLvKeyRef (App.jsx)
- `useRef('pres_0')`: referencia mutable que indica cual modulo/presentacion esta seleccionado
- Se actualiza cuando el usuario toca un sub-planeta en la vista expandida de un grupo
- Se usa en:
  - `buildQ`: para saber cual presentacion generar ejercicios para quiensoy
  - `startGame`: para leer el nivel correcto desde localStorage via getModuleLvOrDef
  - Vista de modulos: para determinar cual sub-planeta esta activo (isActive)
- Tambien se usa para razona y lee que tienen multiples modulos con el mismo `k` pero diferente `lvKey`

### SRS (Spaced Repetition System) (utils.js)
```
srsUp(id, ok, user):
  - Si acierto: srs[id].lv = min(lv+1, 5), actualiza timestamp
  - Si fallo: srs[id].lv = max(lv-1, 0), actualiza timestamp

needsRev(id, user):
  - Intervalos por nivel: [0s, 30s, 2min, 10min, 1h, 24h]
  - Si (ahora - ultimo_intento) >= intervalo[nivel] -> true (necesita repaso)
  - Si no existe en srs -> true (nunca visto)
```
- Se aplica en `buildQ` para 'decir': prioriza ejercicios que necesitan repaso
- Almacenamiento: `user.srs = { [exerciseId]: { lv: 0-5, t: timestamp_ms } }`
- Cada vez que se llama onOk/onSk, se ejecuta srsUp y se guarda el perfil

### Firebase structure
```
Firestore collections:
  users/{uid}:
    profiles: [...]           # Array completo de perfiles
    personas: [...]           # Array de personas (familia/amigos)
    email: string
    updatedAt: ISO string
    revoked: boolean          # Admin puede revocar acceso
    revokedAt: ISO string

  shared_profiles/{code}:     # Codigo tipo "GUI-472"
    ownerUid: string
    profileId: string
    profileName: string
    createdAt: ISO string
    linkedUsers: [{uid, email, linkedAt}]

  public_voices/{phraseKey_uid}:
    phraseKey: string
    phrase: string
    audioURL: string          # URL de Storage
    speakerName, speakerAge, speakerSex
    duration, uploadedBy, uploadedAt, moduleKey

Storage paths:
  users/{uid}/                # Fotos de perfil y personas (JPEG comprimido)
  users/{uid}/voices/         # Voces grabadas del usuario (WebM)
  public_voices/{phraseKey}/  # Voces publicas compartidas (WebM)
  Limite: STORAGE_LIMIT = 3MB por usuario
```

### localStorage keys principales
```
toki_profiles              # Array de perfiles completos
toki_personas              # Array de personas (familia/amigos)
toki_sup_pin               # PIN del supervisor (string 4 digitos)
toki_theme                 # 'espacial' | 'sober'
toki_helmet                # 'true' | 'false'
toki_rocket_color          # 'rojo'|'azul'|'verde'|'dorado'|'morado'
toki_exigencia             # 50-100 (int, tolerancia diccion)
toki_active_mods           # {[lvKey]: boolean} modulos activos/inactivos
toki_session_mode          # 'free' | 'guided'
toki_guided_tasks          # [{k, lv, count}] hasta 4 tareas
toki_max_daily             # 0|30|60|120 (minutos max diario)
toki_mod_lv_{modKey}       # [int] niveles activos por modulo
toki_escribe_case          # 'upper' | 'lower'
toki_escribe_types         # ['letras','palabras','frases']
toki_escribe_guide         # {letras:bool, palabras:bool, frases:bool}
toki_escribe_pauta_size    # 0-3 (indice PAUTA_SIZES [32,26,20,16])
toki_count_speed           # 'slow'|'normal'|'fast'
toki_streak_dates          # [ISO date strings] para racha diaria
toki_gp_{userId}_{groupId} # int progreso acumulado por grupo
toki_voice_{userId}_{vid}  # JSON con grabaciones {name, [phraseKey]:base64}
```

### Flujo de pantallas (scr state)
```
'setup'  -> Configuracion inicial (crear PIN + activar microfono)
                |
                v
'login'  -> Seleccion de perfil / Firebase auth (Google / email / invitado)
                |
                v
'goals'  -> Pantalla principal: saludo, planetas orbitantes, seleccionar modulo
                |
                v
'game'   -> Sesion de ejercicios activa (con timer, tower, mascota, SOS)
                |
                v
          -> Fin sesion: DoneScreen (overlay 'done')
```

### Overlays (ov state en App.jsx)
```
null          -> Sin overlay
'parent'      -> Settings completo (panel supervisor)
'parentGate'  -> Pedir PIN para acceder a Settings
'pin'         -> Pedir PIN para salir de sesion guiada
'done'        -> DoneScreen (fin de sesion con stats y podio)
'admin'       -> Panel administracion Firebase (solo ADMIN_EMAIL)
```

### Score de diccion (utils.js score())
```
score(said, target):
  1. Limpia: digToText(), lowercase, quita puntuacion
  2. Si coincide exactamente -> 4
  3. Cuenta palabras exactas + cercanas (Levenshtein):
     - Palabra <= 3 chars: maxLev = 0 (exacta)
     - Palabra <= 5 chars: maxLev = 1
     - Palabra > 5 chars: maxLev = 2
  4. Calcula ratios:
     - exactR >= 1.0 -> 4
     - exactR >= 0.8 -> 3
     - totalR >= 0.5 o exact >= 1 -> 2
     - Else -> 1
  5. Si vacio -> 0
```
- adjScore(raw) aplica factor de exigencia (50-100%) al resultado
