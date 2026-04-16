# TOKI — Checklist de Bugs y Mejoras (6 sesiones completas)
**Fecha: 16 abril 2026** | Imprimir y marcar con boligrafo

---

## PRIORIDAD CRITICA (afecta al uso diario)

- [x] 1. TTS se come la primera palabra en DILO — delay 50ms en _iosSpeak
- [x] 2. No repite el modelo auditivo antes del 2o y 3er intento — await sayFB + doPlay
- [x] 3. Ayuda por silabas al 2o intento fallido — doSyllablePlay activado
- [x] 4. Multi-nivel DILO (activar 2+ niveles) — FIX CRITICO: outer _noRepeat vaciaba array. Verificado: N1+N2=67, N1+N2+N3=107, todos=163 frases
- [x] 5. Pausa detiene audio/musica — stopAllAudio global + tracking Audio objects
- [x] 6. PIN de ajustes — String(parentPin)===String(supPin), sin bypass
- [x] 7. Celebraciones pausan ejercicio — toki-pause + confetti 100/200/300
- [x] 8. TokiBreak overlay para TTS y ejercicio — stopVoice + toki-pause antes
- [x] 9. Toki no ladra tras pantalla comida — mountedRef en todos los timers
- [x] 10. "Tengo {edad} anos" personalizado — personalize() con edad + cumple + validacion birthdate
- [x] 11. ControlCheckpoint: frase 2 audio correcto — currentIdxRef
- [x] 12. ControlCheckpoint: boton Escuchar + Modelo en resultado
- [x] 13. Evaluacion inicial (baseline checkpoint) funciona

## PRIORIDAD ALTA (UX importante)

- [x] 14. SVG colores coinciden (coche azul, moto amarilla...) — ColoredObjects.jsx
- [x] 15. TokiPlayground: comandos voz funcionan — execCommandRef + mountedRef
- [x] 16. Contador: solo diario visible en HUD
- [x] 17. Dock pausa consistente — boton flotante naranja en TODOS los ejercicios no-orales
- [x] 18. Informe muestra ejercicios+tiempo (NO accuracy)
- [x] 19. Grabacion voz auto-select si 1 sola voz
- [x] 20. Modo guiado: selector 1-4 modulos
- [x] 21. Settings sync cloud via Firebase — gatherSettings/applySettings con timestamp
- [x] 22. Ritmo random: modulo focal configurable + slider peso 1-5

## PRIORIDAD MEDIA (mejoras de contenido y UX)

- [x] 23. Situaciones: 326 ejercicios (8+ rondas sin repetir)
- [x] 24. Preposiciones drag-and-drop real en Lee (3 niveles, 26 frases)
- [x] 25. Escritura: canvas grande tablet + Pointer Events Active Stylus + stroke digitos 0-9
- [x] 26. Badge evolucion diaria sobre avatar (estrella/corona/capa)
- [x] 27. Overlay podio mas grande con confetti y foto
- [x] 28. Celebraciones 100/200/300 con confetti masivo + pausa ejercicio
- [x] 29. Layout Settings reordenado: presets arriba, modulos despues, sesion abajo

## SESION 1-5 (bugs originales — todos arreglados)

- [x] 30-35. Micro digitos, estrellas Frase, math sticks, scoring, feedback TTS, niveles DILO
- [x] 36. Micro no recoge voz de Toki — ttsPlaying flag
- [x] 37. Silabas tablet — clamp() + iOS fix en doSyllablePlay
- [x] 38. Escribe: May/Min toggle + guide + pauta + stroke digitos 0-9
- [x] 39. Share code 6 chars puros (ABC123 sin guion)
- [ ] 40. Perfiles: solapamiento orbitas +5 perfiles — NO VERIFICABLE sin runtime
- [x] 41. Presentaciones multiples — array presentations
- [x] 42-44. Cuenta puntos reales, celebraciones confetti, foto zoom/recorte
- [x] 45-70. Defaults, persistencia, ESCRIBE desactivable, DILO dinamico, mis frases, APRENDE random, auto-avance, conteo OK, overlays paran, rafaga cuenta, pausa, Toki ladra, contador diario, astronauta, slider velocidad eliminado, informe intensidad, checkpoints, anti-repeticion, responsive, iOS audio, adjScore, saveP, guiado, otra ronda, pausa ejercicios, backward chaining

## SESION 6 — Nuevas mejoras

- [x] 71. PIN bypass fix
- [x] 72. Celebraciones pausan + confetti
- [x] 73. Badge evolucion sobre avatar
- [x] 74. Overlay podio grande
- [x] 75. Contador solo diario
- [x] 76. Random focal configurable + slider
- [x] 77. Guiada: 1-4 modulos
- [x] 78. Cloud sync settings
- [x] 79. 326 situaciones
- [x] 80. Canvas tablet + stylus
- [x] 81. Grabacion voz auto-select
- [x] 82. SVG objetos colores
- [x] 83. personalize() edad/cumple

## FIXES ADICIONALES SESION 6 (agentes DUA)

- [x] 84. DILO multi-nivel FIX CRITICO (outer _noRepeat vaciaba cola)
- [x] 85. exerciseNum: shouldCheer ya no es siempre true en ExFrases/ExSit
- [x] 86. spatial_drag: resuelve al 2o fallo (antes fallo infinito)
- [x] 87. classify/sequence: voz instruccion al inicio
- [x] 88. Math defLv 5 (contar objetos) en vez de 1 (abstracto)
- [x] 89. Clock timeout: visual permanece hasta que TTS termine (.then)
- [x] 90. Lee read_do: hint al 1er fallo + TOCA DOS ANIMALES arreglado
- [x] 91. Lee: triggerOral al fallar 2x en TODOS los modos (nino repite respuesta correcta)
- [x] 92. Lee preposicion nivel 3: frase coherente
- [x] 93. Razona: hints especificos por modo (no generico "Casi!")
- [x] 94. Razona pattern: voice hint "Fijate en el patron"
- [x] 95. Razona classify: muestra solucion correcta al 2o fallo
- [x] 96. Distribute compare: dice QUIEN tiene mas y POR QUE al fallar
- [x] 97. LEVEL_PRESETS: razona_anterior_posterior + temperatura + secuencias en todos los presets
- [x] 98. Scoring estricto: pato/pata=1 estrella (antes 2) + prefix match DI ("pa"=1 estrella)
- [x] 99. Presets: modal "Pasar a itinerario por defecto?" con confirmacion
- [x] 100. Manual: modal "Pasar a itinerario manual?" al modificar con preset activo

## CONTENIDO NUEVO SESION 6

- [x] 101. Contar objetos visual (ExMath nivel 5): emojis reales
- [x] 102. Sumas con objetos visual (ExMath nivel 6): dos grupos de emojis
- [x] 103. Problemas verbales con contexto (ExMath nivel 7): "Tiene 5 manzanas..."
- [x] 104. Series numericas (ExRazona nivel 9): +1, +2, +5, +10
- [x] 105. Comparar cantidades (ExRazona nivel 10): >, <, =
- [x] 106. Secuencias/rutinas (ExRazona nivel 11): ordenar pasos
- [x] 107. Anterior/Posterior (ExRazona nivel 12): que numero va antes/despues
- [x] 108. Termometro SVG (ExRazona nivel 13): frio/calor/bajo cero
- [x] 109. Causa-efecto Pictociencia: 17 nuevos (bomberos, policia, transporte, estaciones)
- [x] 110. Clasificar ampliado: natural/elaborado, invierno/verano, origen alimentos, profesiones, sentidos, usos agua
- [x] 111. Situaciones normas barrio: 6 nuevas
- [x] 112. Frases DILO: ordinales (10), habitos saludables (10), profesiones (10)
- [x] 113. Selector nivel global 🌱🌿🌳 en Settings
- [x] 114. Reloj: explicacion didactica visual completa cuando falla/acierta
- [x] 115. Email soporte: Tokidilo@gmail.com
- [x] 116. Sin "by Diego Aroca" en UI visible

## PENDIENTE PARA PROXIMAS SESIONES

- [ ] P5. Toki cruzando pantalla en celebraciones (animacion)
- [ ] P8. Hosting imagenes realistas (sustituir emojis)
- [ ] P43. Celebraciones pirotecnia pantalla completa
- [ ] 40. Solapamiento orbitas +5 perfiles (no verificable sin runtime)

---

**Total: 116 items implementados** | **4 pendientes proximas sesiones**
