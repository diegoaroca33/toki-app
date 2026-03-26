# MAESTRO v23 — Toki App

## ESTRATEGIA: FRACCIONAR PRIMERO, LUEGO ARREGLAR

El archivo App.jsx tiene 3504 líneas. Cada vez que un agente edita una parte, rompe otra.
**PASO 1 obligatorio**: fraccionar App.jsx en archivos independientes.
**PASO 2**: arreglar bugs módulo por módulo.

## ESTRUCTURA PROPUESTA DE FRACCIONAMIENTO

```
src/
├── App.jsx              (~500 líneas: estado global, router, pantallas principales)
├── firebase.js           (ya existe, 309 líneas)
├── exercises.js          (ya existe, 1314 líneas)
├── utils.js              (funciones puras: lev, score, cap, splitSyl, say, etc.)
├── components/
│   ├── SpeakPanel.jsx    (grabación voz, micrófono)
│   ├── RocketTransition.jsx
│   ├── CelebrationOverlay.jsx
│   ├── EmergencyButton.jsx
│   ├── PhotoCropOverlay.jsx
│   ├── MonthlyReport.jsx
│   ├── DoneScreen.jsx
│   └── Settings.jsx      (panel supervisor completo)
├── modules/
│   ├── ExDilo.jsx        (SpeakPanel + ExFlu + ExFrases)
│   ├── ExCount.jsx       (Cuenta conmigo)
│   ├── ExMath.jsx        (Sumas y restas)
│   ├── ExMulti.jsx       (Multiplicaciones)
│   ├── ExFraction.jsx    (Fracciones)
│   ├── ExMoney.jsx       (Monedas y billetes)
│   ├── ExClock.jsx       (La Hora)
│   ├── ExCalendar.jsx    (Calendario)
│   ├── ExDistribute.jsx  (Reparte y cuenta)
│   ├── ExWriting.jsx     (Escritura)
│   ├── ExRazona.jsx      (¿Dónde está? + patrones + emociones)
│   ├── ExLee.jsx         (Lectura)
│   └── ExQuienSoy.jsx    (Estudio + Presentación)
└── generators/
    ├── genMath.js
    ├── genClock.js
    ├── genCalendar.js
    ├── genDistribute.js
    ├── genWriting.js
    ├── genRazona.js
    ├── genLee.js
    ├── genMoney.js
    ├── genMulti.js
    ├── genFractions.js
    └── genPatterns.js
```

## BUGS CRÍTICOS ACTUALES (PRIORIDAD 1)

### BUG 1: Niveles del supervisor NO se respetan
**Síntoma**: El padre selecciona "Sumas fácil" pero al niño le salen restas. Selecciona "N1" en Dilo pero salen frases de N5. Selecciona "Reconocer" en Monedas pero sale "Cambio".
**Causa**: `buildQ()` no filtra correctamente por los niveles guardados en `mod_lv_*`. La función `getModuleLvOrDef` puede devolver defaults cuando hay arrays vacíos. Además, algunos generadores (genMath, genMoney, genClock, etc.) no respetan el nivel que reciben.
**Dónde**: `buildQ()` (~línea 2750), `startGame()`, cada `gen*()` function.
**Fix necesario**:
- Verificar que `startGame()` lea SIEMPRE los niveles de localStorage
- Verificar que `buildQ()` pase el nivel correcto a cada generador
- Verificar que cada generador SOLO genere ejercicios del nivel pedido
- Si el nivel es un array [1,3], solo generar niveles 1 y 3, NUNCA 2,4,5

### BUG 2: Estudio de Quién Soy no aparece
**Síntoma**: Aunque en Settings se seleccionan Estudio Y Presentación, el planeta solo muestra "Mi presentación".
**Causa**: El overlay de elección (`qsChoice`) no se muestra. Posible que `startGame()` no detecte que ambos niveles están activos, o que el overlay no se renderice.
**Dónde**: `startGame()` (~línea 2750), overlay `qsChoice` (~línea 2780), render en game screen.

### BUG 3: Módulos mezclados
**Síntoma**: Ejercicios de "intruso" aparecen en Razona, ejercicios de emociones mezclados con ¿Dónde está?
**Causa**: `buildQ()` para `razona` mezcla todos los tipos sin filtrar por subnivel. Si el nivel guardado incluye todos (ej: [1,2,3,4,5,6]), se generan TODOS los tipos de razona mezclados.
**Dónde**: `genRazona()` (~línea 1773), `buildQ()` section razona.

### BUG 4: Sílabas mal divididas
**Síntoma**: "QUIERO" → "QU-I-E-RO" cuando debería ser "QUIE-RO"
**Causa**: `splitSyl()` (~línea 85) usa una lógica básica que no respeta las reglas de silabeo español. Las combinaciones como QUI, QUE, GUE, GUI deben mantener la U muda con la consonante.
**Fix necesario**: Reescribir `splitSyl()` con reglas correctas del español:
- Diptongos: ia, ie, io, iu, ua, ue, ui, uo, ai, ei, oi, au, eu, ou
- QU + vocal = una sílaba (que, qui, quie)
- GU + e/i = una sílaba (gue, gui)
- Consonante + L/R = onset compuesto (tr, br, cl, fl, gr, pr, etc.)
- Nunca separar diptongos

### BUG 5: setFPadre is not defined
**Síntoma**: Error de JavaScript que crashea la app
**Causa**: Se eliminó la variable de estado `fPadre` pero quedó una referencia en un onClick handler (probablemente en el formulario de nuevo jugador)
**Dónde**: Buscar `setFPadre`, `setFMadre`, `setFHerm`, `setFAmigos` en App.jsx

### BUG 6: JSON circular structure (pantalla en blanco)
**Síntoma**: App se queda en blanco con error "Converting circular structure to JSON"
**Causa**: Algo mete un elemento HTML/React en `saveData()` que intenta `JSON.stringify`. El serializer ya tiene un fallback pero algo pasa el elemento antes del stringify.
**Dónde**: `saveData()` (~línea 123), buscar qué datos se guardan que puedan contener elementos DOM.

### BUG 7: Game exit va a login en vez de a planetas
**Síntoma**: Al terminar ejercicio o salir, te echa a la pantalla de registro/login
**Causa**: Algún `setScr('login')` o `setUser(null)` se ejecuta donde no debe
**Dónde**: DoneScreen onExit, PIN overlay "Salir" button

## BUGS SECUNDARIOS (PRIORIDAD 2)

### BUG 8: Presentación fuerza scroll
- Quitar puntos de progreso de arriba
- Ajustar para 16:9

### BUG 9: Cuenta conmigo layout salta
- Diseño en una línea (título izquierda, número derecha)
- Sin cambios de layout al contar

### BUG 10: Sumas visual no descuenta
- Para restas: contar hasta el primer número, luego tachar/descontar el segundo
- Visual + auditivo sincronizado

### BUG 11: Forma la frase TTS se atropella
- Llamar `stopVoice()` antes de cada `say()`

### BUG 12: La Hora pista incompleta
- Dar pista de AMBAS agujas (grande Y pequeña)

### BUG 13: Calendario necesita explicaciones
- "Ayer = el día de antes" como primera pista
- Respuesta al segundo fallo

### BUG 14: Reparte comparar layout pobre
- Separar visualmente los dos grupos
- Cada grupo con su panel de color

### BUG 15: SOS "tengo síndrome de Down" innecesario
- Quitar esa frase
- Mostrar teléfonos con botón "Llamar"
- Permitir cerrar sin PIN (botón "Volver")

### BUG 16: Botón "Todo" no se puede desactivar
- Si "Todo" está activo y pulsas un nivel individual, no funciona bien
- Permitir deseleccionar "Todo" y que quite todos los niveles

## CONCEPTOS CLAVE DE LA APP

### Jerarquía
```
GRUPO (planeta) → MÓDULOS → NIVELES
   Ejemplo:
   CUENTA (planeta naranja)
     ├── Sumas y Restas (módulo)
     │     ├── Sumas fácil (nivel 1)
     │     ├── Sumas+ (nivel 2)
     │     ├── Restas (nivel 3)
     │     └── Mezcla (nivel 4)
     ├── Multiplicaciones (módulo)
     └── Fracciones (módulo)
```

### Control del supervisor
1. **Planetas activos**: ON/OFF por módulo completo → `activeMods[lvKey]`
2. **Nivel por módulo**: Qué subniveles puede hacer → `mod_lv_[lvKey]` (array de números)
3. **Regla**: Si todos los niveles de un módulo están desactivados → el módulo no debe aparecer al niño
4. **Regla**: Si activas un nivel en "Nivel por módulo", el módulo se activa automáticamente en "Planetas activos"
5. **Regla**: buildQ SOLO debe generar ejercicios de los niveles seleccionados, NUNCA de otros

### Variables clave de estado
- `sec`: módulo actual ('decir', 'math', 'clock', etc.)
- `secLv`: nivel actual (número o array de números)
- `activeMods`: objeto {lvKey: true/false} — qué módulos están activos
- `mod_lv_*`: en localStorage — qué niveles dentro de cada módulo
- `user`: objeto del perfil del niño (name, age, sex, apellidos, etc.)
- `supPin`: PIN del supervisor
- `scr`: pantalla actual ('setup', 'goals', 'game', 'login')
- `ov`: overlay actual ('parent', 'parentGate', 'pin', 'done', null)
- `openGroup`: grupo de planetas abierto (null = vista planetas, 'cuenta' = submódulos)

### Flujo de navegación correcto
```
Login/Invitado → Setup (PIN + micro) → Perfil (crear/seleccionar)
  → Goals (planetas) → [toca planeta] → Submódulos → [toca cohete] → Game
  → [termina] → DoneScreen → "Repetir" o "Salir" → Goals
  → [⚙️] → PIN → Settings → [A jugar!] → Goals (reset openGroup)
  → [← Cambiar perfil] → PIN → Perfiles
```

## DATOS DE FIREBASE
```
apiKey: "AIzaSyCyhnUMPzjImUa34rFKagE-eg6BGVfXty4"
authDomain: "toki-app-58635.firebaseapp.com"
projectId: "toki-app-58635"
storageBucket: "toki-app-58635.firebasestorage.app"
messagingSenderId: "543708976332"
appId: "1:543708976332:web:1387bdfc6d318a1301e69"
```

## REGLAS PARA EL PRÓXIMO CHAT

1. **NUNCA usar agentes paralelos para editar App.jsx** — uno solo a la vez
2. **Leer el archivo COMPLETO antes de editar** — entender todas las dependencias
3. **UN cambio → build → test → verificar → siguiente cambio**
4. **No inventar datos** — si no sabes cómo funciona algo, leer el código primero
5. **El supervisor manda** — si dice nivel 1, SOLO nivel 1. Sin excepciones.
6. **16:9 es la prioridad** — tablet Samsung A9+ 11". Sin scroll para el niño.
7. **Probar cada módulo después de cada cambio** — no asumir que funciona
8. **Commits pequeños** — un fix por commit, fácil de revertir

## DISPOSITIVO PRINCIPAL
- Tablet Samsung Galaxy Tab A9+ (11 pulgadas)
- Resolución: 1920x1200 (16:10, prácticamente 16:9)
- Chrome / PWA
- Touch-first, sin teclado

## STACK
- React 18 + Vite 5
- PWA (sin service worker actualmente)
- Vercel deploy
- Firebase Auth + Firestore + Storage
- localStorage como fallback / cache
