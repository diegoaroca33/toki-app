// PRIMERA VERSIÓN — generada siguiendo el doc consolidado §4.3.
// REVISAR antes de prod. Tres niveles:
//
//   BÁSICO: cara → emoción primaria (Contento/Triste/Enfadado/Asustado/
//           Cansado/Sorprendido). El existente de 6 ítems se mantiene.
//   AVANZADO: situación sencilla → emoción primaria. ~30 ejercicios.
//   MASTER: situación sutil → emoción secundaria (avergonzado, nervioso,
//           orgulloso, aburrido, celoso, decepcionado, preocupado,
//           agradecido). ~30 ejercicios.
//
// Cada ítem básico: { emoji, emotion, q, opts: [string] }.
// Cada ítem avanzado/master: { situation, emotion, q, opts: [string] }.

// === BÁSICO === Cara → emoción primaria ====================================
export const EMOCIONES_BASICO = [
  {emoji:'😊',emotion:'Contento',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {emoji:'😢',emotion:'Triste',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {emoji:'😠',emotion:'Enfadado',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {emoji:'😨',emotion:'Asustado',q:'¿Cómo se siente?',opts:['Contento','Asustado','Enfadado','Sorprendido']},
  {emoji:'😲',emotion:'Sorprendido',q:'¿Cómo se siente?',opts:['Contento','Sorprendido','Enfadado','Triste']},
  {emoji:'😴',emotion:'Cansado',q:'¿Cómo se siente?',opts:['Contento','Cansado','Enfadado','Asustado']},
];

// === AVANZADO === Situación sencilla → emoción primaria ====================
export const EMOCIONES_AVANZADO = [
  // Contento (regalos, logros, fiesta)
  {situation:'Hoy es su cumpleaños y le hacen una fiesta sorpresa.',emotion:'Contento',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {situation:'Le regalan justo el juguete que quería.',emotion:'Contento',q:'¿Cómo se siente?',opts:['Contento','Triste','Asustado','Enfadado']},
  {situation:'Va a ir mañana al parque acuático.',emotion:'Contento',q:'¿Cómo se siente?',opts:['Contento','Cansado','Enfadado','Triste']},
  {situation:'Su mejor amigo viene a dormir a casa.',emotion:'Contento',q:'¿Cómo se siente?',opts:['Contento','Asustado','Triste','Enfadado']},
  {situation:'Ha terminado un puzzle muy difícil sin ayuda.',emotion:'Contento',q:'¿Cómo se siente?',opts:['Contento','Cansado','Triste','Enfadado']},

  // Triste
  {situation:'Se le ha roto su juguete favorito.',emotion:'Triste',q:'¿Cómo se siente?',opts:['Triste','Contento','Asustado','Enfadado']},
  {situation:'Su mejor amigo se ha mudado a otra ciudad.',emotion:'Triste',q:'¿Cómo se siente?',opts:['Triste','Contento','Sorprendido','Cansado']},
  {situation:'Su mascota está enferma.',emotion:'Triste',q:'¿Cómo se siente?',opts:['Triste','Contento','Enfadado','Asustado']},
  {situation:'No le han dejado ir a la fiesta de un amigo.',emotion:'Triste',q:'¿Cómo se siente?',opts:['Triste','Contento','Asustado','Sorprendido']},
  {situation:'Ha perdido su gorra favorita en el parque.',emotion:'Triste',q:'¿Cómo se siente?',opts:['Triste','Contento','Sorprendido','Cansado']},

  // Enfadado
  {situation:'Su hermano le ha cogido su coche sin pedirlo.',emotion:'Enfadado',q:'¿Cómo se siente?',opts:['Enfadado','Contento','Cansado','Sorprendido']},
  {situation:'Le han empujado en la cola sin querer y no le han pedido perdón.',emotion:'Enfadado',q:'¿Cómo se siente?',opts:['Enfadado','Contento','Triste','Cansado']},
  {situation:'Le han echado la culpa de algo que no ha hecho.',emotion:'Enfadado',q:'¿Cómo se siente?',opts:['Enfadado','Contento','Cansado','Asustado']},
  {situation:'Le han prometido helado y no se lo dan.',emotion:'Enfadado',q:'¿Cómo se siente?',opts:['Enfadado','Contento','Sorprendido','Asustado']},
  {situation:'Llevan un rato sin dejarle hablar.',emotion:'Enfadado',q:'¿Cómo se siente?',opts:['Enfadado','Contento','Cansado','Sorprendido']},

  // Asustado
  {situation:'Ha oído un trueno muy fuerte por la noche.',emotion:'Asustado',q:'¿Cómo se siente?',opts:['Asustado','Contento','Enfadado','Cansado']},
  {situation:'Está solo en una habitación oscura.',emotion:'Asustado',q:'¿Cómo se siente?',opts:['Asustado','Contento','Cansado','Sorprendido']},
  {situation:'Ve que alguien está intentando entrar en casa.',emotion:'Asustado',q:'¿Cómo se siente?',opts:['Asustado','Contento','Sorprendido','Enfadado']},
  {situation:'Se ha perdido un momento de su madre en el supermercado.',emotion:'Asustado',q:'¿Cómo se siente?',opts:['Asustado','Contento','Cansado','Enfadado']},
  {situation:'Hay un perro grande ladrándole muy cerca.',emotion:'Asustado',q:'¿Cómo se siente?',opts:['Asustado','Contento','Cansado','Sorprendido']},

  // Cansado
  {situation:'Ha corrido toda la tarde en el parque.',emotion:'Cansado',q:'¿Cómo se siente?',opts:['Cansado','Contento','Enfadado','Asustado']},
  {situation:'Ha ayudado a recoger toda la casa.',emotion:'Cansado',q:'¿Cómo se siente?',opts:['Cansado','Contento','Enfadado','Sorprendido']},
  {situation:'Se ha levantado muy temprano para coger un avión.',emotion:'Cansado',q:'¿Cómo se siente?',opts:['Cansado','Contento','Asustado','Enfadado']},
  {situation:'Lleva toda la mañana de excursión por el monte.',emotion:'Cansado',q:'¿Cómo se siente?',opts:['Cansado','Contento','Enfadado','Asustado']},

  // Sorprendido
  {situation:'Abre un regalo que no esperaba.',emotion:'Sorprendido',q:'¿Cómo se siente?',opts:['Sorprendido','Triste','Cansado','Enfadado']},
  {situation:'Su tío que vive lejos aparece de repente en su casa.',emotion:'Sorprendido',q:'¿Cómo se siente?',opts:['Sorprendido','Cansado','Triste','Enfadado']},
  {situation:'Ve por primera vez una jirafa de verdad en el zoo.',emotion:'Sorprendido',q:'¿Cómo se siente?',opts:['Sorprendido','Cansado','Enfadado','Triste']},
  {situation:'Le anuncian que han ganado un viaje en un sorteo.',emotion:'Sorprendido',q:'¿Cómo se siente?',opts:['Sorprendido','Cansado','Triste','Enfadado']},
  {situation:'Encuentra dinero que había olvidado en un bolsillo.',emotion:'Sorprendido',q:'¿Cómo se siente?',opts:['Sorprendido','Cansado','Enfadado','Triste']},
];

// === MASTER === Situación sutil → emoción secundaria =======================
// Las opciones incluyen distractores plausibles del mismo registro emocional
// para que el niño tenga que distinguir entre matices.
export const EMOCIONES_MASTER = [
  // Avergonzado
  {situation:'Se ha caído delante de toda su clase y todos miran.',emotion:'Avergonzado',q:'¿Cómo se siente?',opts:['Avergonzado','Contento','Sorprendido','Aburrido']},
  {situation:'Le han salido manchas en la camiseta justo en una fiesta.',emotion:'Avergonzado',q:'¿Cómo se siente?',opts:['Avergonzado','Contento','Asustado','Aburrido']},
  {situation:'Le han llamado por su mote delante de todos.',emotion:'Avergonzado',q:'¿Cómo se siente?',opts:['Avergonzado','Sorprendido','Cansado','Contento']},
  {situation:'Ha confundido el nombre de un amigo delante de él.',emotion:'Avergonzado',q:'¿Cómo se siente?',opts:['Avergonzado','Cansado','Sorprendido','Contento']},

  // Nervioso
  {situation:'Mañana tiene su primera consulta del dentista.',emotion:'Nervioso',q:'¿Cómo se siente?',opts:['Nervioso','Aburrido','Contento','Cansado']},
  {situation:'Tiene que hablar en público en un acto del cole.',emotion:'Nervioso',q:'¿Cómo se siente?',opts:['Nervioso','Aburrido','Contento','Decepcionado']},
  {situation:'Espera los resultados de un examen importante.',emotion:'Nervioso',q:'¿Cómo se siente?',opts:['Nervioso','Aburrido','Contento','Cansado']},
  {situation:'Va por primera vez solo en autobús a un sitio nuevo.',emotion:'Nervioso',q:'¿Cómo se siente?',opts:['Nervioso','Contento','Aburrido','Decepcionado']},

  // Orgulloso
  {situation:'Ha terminado solo un puzzle de mil piezas.',emotion:'Orgulloso',q:'¿Cómo se siente?',opts:['Orgulloso','Aburrido','Cansado','Asustado']},
  {situation:'Ha aprendido a montar en bici sin ruedines.',emotion:'Orgulloso',q:'¿Cómo se siente?',opts:['Orgulloso','Aburrido','Cansado','Decepcionado']},
  {situation:'Ha cuidado de su hermano pequeño toda la tarde.',emotion:'Orgulloso',q:'¿Cómo se siente?',opts:['Orgulloso','Cansado','Aburrido','Avergonzado']},
  {situation:'Le han dado un diploma por ayudar en clase.',emotion:'Orgulloso',q:'¿Cómo se siente?',opts:['Orgulloso','Avergonzado','Cansado','Aburrido']},

  // Aburrido
  {situation:'Lleva toda la tarde esperando a que pare de llover.',emotion:'Aburrido',q:'¿Cómo se siente?',opts:['Aburrido','Contento','Asustado','Orgulloso']},
  {situation:'Está en una sala de espera sin nada que hacer.',emotion:'Aburrido',q:'¿Cómo se siente?',opts:['Aburrido','Contento','Sorprendido','Asustado']},
  {situation:'Tiene que ver una película que no le gusta nada.',emotion:'Aburrido',q:'¿Cómo se siente?',opts:['Aburrido','Contento','Asustado','Orgulloso']},
  {situation:'Lleva muchísimo rato sin tener nada con quien jugar.',emotion:'Aburrido',q:'¿Cómo se siente?',opts:['Aburrido','Contento','Avergonzado','Asustado']},

  // Celoso
  {situation:'Su hermano está abriendo regalos de cumpleaños y él no.',emotion:'Celoso',q:'¿Cómo se siente?',opts:['Celoso','Contento','Aburrido','Cansado']},
  {situation:'Su mejor amigo está jugando con otro niño y le ignora.',emotion:'Celoso',q:'¿Cómo se siente?',opts:['Celoso','Contento','Avergonzado','Cansado']},
  {situation:'Su madre abraza a otro niño delante de él.',emotion:'Celoso',q:'¿Cómo se siente?',opts:['Celoso','Contento','Sorprendido','Aburrido']},

  // Decepcionado
  {situation:'Esperaba ir al parque y ha llovido todo el día.',emotion:'Decepcionado',q:'¿Cómo se siente?',opts:['Decepcionado','Contento','Avergonzado','Sorprendido']},
  {situation:'Le habían prometido un postre y al final no lo hay.',emotion:'Decepcionado',q:'¿Cómo se siente?',opts:['Decepcionado','Contento','Aburrido','Asustado']},
  {situation:'La película que tantas ganas tenía resultó muy mala.',emotion:'Decepcionado',q:'¿Cómo se siente?',opts:['Decepcionado','Contento','Avergonzado','Cansado']},
  {situation:'Su equipo ha perdido el partido en el último minuto.',emotion:'Decepcionado',q:'¿Cómo se siente?',opts:['Decepcionado','Contento','Aburrido','Orgulloso']},

  // Preocupado
  {situation:'Su mejor amigo no contesta al teléfono desde ayer.',emotion:'Preocupado',q:'¿Cómo se siente?',opts:['Preocupado','Contento','Aburrido','Orgulloso']},
  {situation:'Su madre lleva varios días con tos y fiebre.',emotion:'Preocupado',q:'¿Cómo se siente?',opts:['Preocupado','Contento','Aburrido','Orgulloso']},
  {situation:'No encuentra las llaves y tiene que salir ya.',emotion:'Preocupado',q:'¿Cómo se siente?',opts:['Preocupado','Contento','Orgulloso','Aburrido']},
  {situation:'Su perro lleva un rato sin querer comer.',emotion:'Preocupado',q:'¿Cómo se siente?',opts:['Preocupado','Contento','Aburrido','Orgulloso']},

  // Agradecido
  {situation:'Un compañero le ha dejado sus pinturas cuando las suyas se rompieron.',emotion:'Agradecido',q:'¿Cómo se siente?',opts:['Agradecido','Aburrido','Avergonzado','Decepcionado']},
  {situation:'Su vecino le ha ayudado a subir bolsas pesadas a casa.',emotion:'Agradecido',q:'¿Cómo se siente?',opts:['Agradecido','Aburrido','Decepcionado','Avergonzado']},
  {situation:'Su profesora le ha esperado para explicarle un ejercicio.',emotion:'Agradecido',q:'¿Cómo se siente?',opts:['Agradecido','Aburrido','Decepcionado','Avergonzado']},
];

// Lista plana mantenida por compatibilidad. genEmotions del módulo
// puede consumir esta o las versiones por nivel directamente.
export const EMOCIONES_ALL = [
  ...EMOCIONES_BASICO,
  ...EMOCIONES_AVANZADO,
  ...EMOCIONES_MASTER,
];
