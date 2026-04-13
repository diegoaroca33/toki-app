# TOKI — Checklist de Bugs y Mejoras (6 sesiones)
**Fecha: 13 abril 2026** | Imprimir y marcar con boligrafo

---

## PRIORIDAD CRITICA (afecta al uso diario)

- [ ] 1. TTS se come la primera palabra en DILO (arreglado sesion 6 — verificar)
- [ ] 2. No repite el modelo auditivo antes del 2o y 3er intento (arreglado sesion 6 — verificar)
- [ ] 3. Ayuda por silabas no aparece al 2o intento fallido (arreglado sesion 6 — verificar)
- [ ] 4. Multi-nivel DILO no funciona (activar 2+ niveles) (arreglado sesion 6 — verificar)
- [ ] 5. Pausa no detiene audio/musica de fondo (arreglado sesion 6 — verificar)
- [ ] 6. PIN de ajustes no se pide (pendiente fix sesion 6)
- [ ] 7. Celebraciones no pausan el ejercicio — sigue corriendo debajo (pendiente)
- [ ] 8. TokiBreak overlay no para TTS ni ejercicio (arreglado sesion 6 — verificar)
- [ ] 9. Toki sigue ladrando tras pantalla comida/recreo (arreglado sesion 6 — verificar)
- [ ] 10. "Tengo {edad} anos" no se personaliza con la edad real (arreglado sesion 6 — verificar)
- [ ] 11. ControlCheckpoint: frase 2 reproduce audio de frase 1 (arreglado sesion 6 — verificar)
- [ ] 12. ControlCheckpoint: no se puede escuchar la grabacion (arreglado sesion 6 — verificar)
- [ ] 13. Evaluacion inicial (baseline checkpoint): verificar que funciona completa

## PRIORIDAD ALTA (UX importante)

- [ ] 14. Emojis de colores no coinciden con frase (moto amarilla con emoji rojo) (arreglado sesion 6 con SVGs — verificar)
- [ ] 15. TokiPlayground: comandos de voz no funcionan (salta, gira...) (arreglado sesion 6 — verificar)
- [ ] 16. Contador: mostrar solo diario (quitar el de sesion del HUD)
- [ ] 17. Dock micro/pausa/skip: posicion inconsistente entre ejercicios
- [ ] 18. Informe (MonthlyReport): verificar que muestra datos correctos (ejercicios+tiempo, NO accuracy)
- [ ] 19. Grabacion de voz: no va directo, obliga a darle a "jugar" despues
- [ ] 20. Modo guiado: no muestra desplegables (solo placeholder, no funciona)
- [ ] 21. Settings sync cloud: config no se comparte entre dispositivos (solo localStorage)
- [ ] 22. Ritmo random: 8 ejercicios por modulo es demasiado, necesita ser configurable

## PRIORIDAD MEDIA (mejoras de contenido y UX)

- [ ] 23. Situaciones: ampliar de 90 a 320 (8 rondas sin repetir)
- [ ] 24. Preposiciones: nuevo ejercicio drag-and-drop en Lee
- [ ] 25. Escritura: canvas pequeno en tablet + mejorar soporte Active Stylus
- [ ] 26. Evolucion diaria: badge/insignia sobre avatar del nino (estrella/corona/capa)
- [ ] 27. Overlay astronauta/podio: hacerlo mas grande (mucho espacio negro)
- [ ] 28. Celebraciones 100/200/300: mas espectaculares, distintas por nivel
- [ ] 29. Layout Settings: modulos arriba, tipo sesion abajo (cerca del boton jugar)

## SESION 1-2 (bugs originales)

- [ ] 30. Micro en Cuenta Conmigo: SR devuelve digitos no texto (arreglado sesion 1)
- [ ] 31. Estrellas en Forma la Frase: emoji simple vs componente Stars (arreglado sesion 1)
- [ ] 32. Math sticks demasiado rapido (arreglado sesion 1)
- [ ] 33. Scoring "pato"/"pata" demasiado permisivo (arreglado sesion 2)
- [ ] 34. Feedback no habla (texto sin TTS) (arreglado sesion 2)
- [ ] 35. Niveles DILO todos iguales (arreglado sesion 2 — N1-N5 por palabras)

## SESION 3 (42 puntos)

- [ ] 36. Micro recoge voz de Toki (arreglado — ttsPlaying flag)
- [ ] 37. Silabas solapan en tablet 11" (parcial — verificar con Samsung)
- [ ] 38. Escribe: rediseno completo (May/Min toggle, guide, tamano pauta) (pendiente)
- [ ] 39. Perfil compartido con codigo 6 chars (pendiente)
- [ ] 40. Perfiles: solapamiento entre orbitas con +5 perfiles (pendiente)
- [ ] 41. Presentaciones multiples (pendiente grande)
- [ ] 42. Cuenta Conmigo: puntos dados = numero real (pendiente)
- [ ] 43. Celebraciones: expandir por pantalla tipo pirotecnia (pendiente)
- [ ] 44. Foto zoom/recorte circular tipo WhatsApp (parcial)

## SESION 4 (20 puntos)

- [ ] 45. Defaults primera vez: solo DILO N1 + Mis frases activos (arreglado sesion 5)
- [ ] 46. Persistencia de config entre reinicios (arreglado — localStorage)
- [ ] 47. Modulo ESCRIBE: permitir desactivar (arreglado sesion 5)
- [ ] 48. DILO dinamico: desactivado por defecto (arreglado sesion 5)
- [ ] 49. Mis frases en DILO (arreglado sesion 5)
- [ ] 50. Planeta APRENDE en random (arreglado sesion 5)
- [ ] 51. Presentacion en random: auto-avance sin bloqueo (arreglado sesion 5 — verificar)
- [ ] 52. Bug conteo numeros: duplicidad decenas (verificado OK — no hay duplicidad)
- [ ] 53. Voz y ejercicio no se detienen con overlays (parcial — celebraciones pendientes)
- [ ] 54. Rafaga: cada rep cuenta como ejercicio (arreglado sesion 5 — repsCount)
- [ ] 55. Default rafaga: 2 reps (arreglado sesion 5)
- [ ] 56. Boton PAUSA reemplaza altavoz (arreglado sesion 5)
- [ ] 57. Toki ladra si pausa larga + snooze (arreglado sesion 5)
- [ ] 58. Contador diario global + astronauta evolutivo (arreglado sesion 5)
- [ ] 59. Eliminar slider velocidad (arreglado sesion 5)
- [ ] 60. Redisenar informe → intensidad (arreglado sesion 5 — verificar datos)
- [ ] 61. Checkpoints: control inicial + frecuencia flexible (arreglado sesion 5 — verificar)
- [ ] 62. Anti-repeticion 3 dias (arreglado sesion 4 — verificado OK)
- [ ] 63. Responsive: planetas mas grandes, menos espacio muerto (arreglado sesion 5)
- [ ] 64. Audio no se oye en iPhone (arreglado sesiones 5-6 — iOS TTS keep-alive + delay)

## SESION 5 (QA intensiva)

- [ ] 65. adjScore invertido (arreglado sesion 5)
- [ ] 66. saveP mutaba estado React (arreglado sesion 5)
- [ ] 67. Modo guiado ejecutaba random (arreglado sesion 5)
- [ ] 68. "Otra ronda" con 0 ejercicios (arreglado sesion 5)
- [ ] 69. Pausa no paraba ejercicios (arreglado sesion 5)
- [ ] 70. Encadenamiento inverso (backward chaining) (arreglado sesion 5)

---

**Total: 70 items** | Arreglados: ~50 | Por verificar: ~20 | Pendientes nuevos: ~15
