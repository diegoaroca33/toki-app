// PRIMERA VERSIÓN — generada siguiendo el doc consolidado §4.12.1.
// REVISAR antes de prod.
//
// LEE Y ENTIENDE (Master del planeta LEE): preguntas variadas con frases
// hasta 10 palabras. 7 tipos de pregunta:
//
//   ¿Qué dice...? → respuesta literal de un personaje en una situación.
//   ¿Qué hace...? → acción característica de una profesión/persona.
//   ¿Dónde...? → lugar donde se hace algo.
//   ¿Quién...? → persona que hace algo.
//   ¿Cuándo...? → momento del día / día / momento.
//   ¿Por qué...? → causa funcional ("para que...").
//   ¿Qué pasa si...? → consecuencia inmediata.
//
// Distractores: claramente incompatibles con la pregunta, no semejantes.
// Filtro léxico Anexo B: NO usar palabras Master ("factura", "contrato",
// "trámite", "recibo", "alquiler", "hipoteca") en distractores de
// Avanzado. Las usamos solo en Master cuando el contexto lo soporta.
//
// Cada ítem: { q, opts: [string], ans: string, kind: '¿Qué dice?' | ... }

export const LEE_ENTIENDE = [
  // === ¿Qué dice...? ============================================
  {kind:'¿Qué dice?',q:'¿Qué dice el médico cuando estás resfriado?',ans:'Estás resfriado, descansa',opts:[
    'Estás resfriado, descansa','Mañana hay rebajas','Coge ese autobús','Hoy no hay clase'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice mamá por la mañana?',ans:'¡Buenos días, despierta!',opts:[
    '¡Buenos días, despierta!','El tren ya llegó','He apagado el horno','La película es mala'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice un niño jugando?',ans:'¡Mira qué alto salto!',opts:[
    '¡Mira qué alto salto!','Hay reunión en la oficina','El periódico llegó esta tarde','Voy a regar las plantas'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice un cocinero en su cocina?',ans:'¡La sopa está lista!',opts:[
    '¡La sopa está lista!','Han subido las acciones','Coge la mochila','Es hora de dormir'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice el profesor en clase?',ans:'Abrid el libro por la página diez',opts:[
    'Abrid el libro por la página diez','Voy a tirar la basura','Hace mucho calor en agosto','Mi perro tiene hambre'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice un policía dirigiendo el tráfico?',ans:'Pase usted con cuidado',opts:[
    'Pase usted con cuidado','Hoy he comido pizza','Mañana voy al cine','Quiero un helado'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice mamá cuando es hora de dormir?',ans:'Buenas noches, a la cama',opts:[
    'Buenas noches, a la cama','El bus está parado','La piscina está fría','El coche es nuevo'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice un amigo en el parque?',ans:'¿Jugamos al fútbol?',opts:[
    '¿Jugamos al fútbol?','Mañana tengo cita en el médico','El tren sale a las ocho','Tienes fiebre'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice la abuela cuando llegas de visita?',ans:'¡Qué alegría verte!',opts:[
    '¡Qué alegría verte!','Sube el tono de voz','Mira el partido en la tele','Devuelve el libro a la biblioteca'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice un veterinario cuando llevas tu perro?',ans:'Vamos a ver qué le pasa',opts:[
    'Vamos a ver qué le pasa','Tengo mucho calor','Llamaré al fontanero','Compraré pan mañana'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice el cartero al entregar una carta?',ans:'Aquí tiene su carta',opts:[
    'Aquí tiene su carta','Toca leer un cuento','Voy a por un café','Estoy haciendo gimnasia'
  ]},
  {kind:'¿Qué dice?',q:'¿Qué dice papá cuando llega del trabajo?',ans:'Hola, ya estoy en casa',opts:[
    'Hola, ya estoy en casa','Cierra el grifo del agua','El gato no tiene hambre','Hoy llueve mucho fuera'
  ]},

  // === ¿Qué hace...? ============================================
  {kind:'¿Qué hace?',q:'¿Qué hace el bombero?',ans:'Apaga incendios',opts:['Apaga incendios','Cura a los enfermos','Hace pan','Vende ropa']},
  {kind:'¿Qué hace?',q:'¿Qué hace el médico?',ans:'Cura a los enfermos',opts:['Cura a los enfermos','Apaga incendios','Conduce el bus','Hace pan']},
  {kind:'¿Qué hace?',q:'¿Qué hace el panadero?',ans:'Hace pan',opts:['Hace pan','Cura a los enfermos','Apaga incendios','Conduce el bus']},
  {kind:'¿Qué hace?',q:'¿Qué hace el conductor?',ans:'Conduce el autobús',opts:['Conduce el autobús','Hace pan','Cura a los enfermos','Apaga incendios']},
  {kind:'¿Qué hace?',q:'¿Qué hace la profesora?',ans:'Enseña en el colegio',opts:['Enseña en el colegio','Conduce el autobús','Hace pan','Apaga incendios']},
  {kind:'¿Qué hace?',q:'¿Qué hace el cartero?',ans:'Reparte cartas',opts:['Reparte cartas','Apaga incendios','Vende fruta','Cura a los enfermos']},
  {kind:'¿Qué hace?',q:'¿Qué hace el cocinero?',ans:'Prepara la comida',opts:['Prepara la comida','Conduce el bus','Reparte cartas','Apaga incendios']},
  {kind:'¿Qué hace?',q:'¿Qué hace el frutero?',ans:'Vende fruta',opts:['Vende fruta','Apaga incendios','Hace pan','Conduce el bus']},
  {kind:'¿Qué hace?',q:'¿Qué hace el peluquero?',ans:'Corta el pelo',opts:['Corta el pelo','Vende fruta','Apaga incendios','Conduce el bus']},
  {kind:'¿Qué hace?',q:'¿Qué hace el dentista?',ans:'Cuida los dientes',opts:['Cuida los dientes','Vende fruta','Apaga incendios','Conduce el bus']},
  {kind:'¿Qué hace?',q:'¿Qué hace el veterinario?',ans:'Cura a los animales',opts:['Cura a los animales','Vende fruta','Hace pan','Reparte cartas']},
  {kind:'¿Qué hace?',q:'¿Qué hace el policía?',ans:'Cuida del orden',opts:['Cuida del orden','Vende fruta','Hace pan','Reparte cartas']},

  // === ¿Dónde...? ===============================================
  {kind:'¿Dónde?',q:'¿Dónde compras pan?',ans:'En la panadería',opts:['En la panadería','En la farmacia','En la biblioteca','En la piscina']},
  {kind:'¿Dónde?',q:'¿Dónde compras medicinas?',ans:'En la farmacia',opts:['En la farmacia','En la panadería','En la zapatería','En el cine']},
  {kind:'¿Dónde?',q:'¿Dónde compras un libro?',ans:'En la librería',opts:['En la librería','En la panadería','En la farmacia','En la frutería']},
  {kind:'¿Dónde?',q:'¿Dónde te cortas el pelo?',ans:'En la peluquería',opts:['En la peluquería','En la farmacia','En la panadería','En el polideportivo']},
  {kind:'¿Dónde?',q:'¿Dónde vas si estás muy enfermo?',ans:'Al hospital',opts:['Al hospital','Al cine','A la pizzería','A la peluquería']},
  {kind:'¿Dónde?',q:'¿Dónde vas para coger un avión?',ans:'Al aeropuerto',opts:['Al aeropuerto','A la estación','Al puerto','A la parada del bus']},
  {kind:'¿Dónde?',q:'¿Dónde vas para coger un tren?',ans:'A la estación',opts:['A la estación','Al aeropuerto','Al puerto','A la pizzería']},
  {kind:'¿Dónde?',q:'¿Dónde vas para coger un barco?',ans:'Al puerto',opts:['Al puerto','A la estación','Al aeropuerto','A la peluquería']},
  {kind:'¿Dónde?',q:'¿Dónde duermen los animales del zoo?',ans:'En el zoo',opts:['En el zoo','En la calle','En la cocina','En la piscina']},
  {kind:'¿Dónde?',q:'¿Dónde se ve una película?',ans:'En el cine',opts:['En el cine','En la farmacia','En la frutería','En la estación']},
  {kind:'¿Dónde?',q:'¿Dónde se nada?',ans:'En la piscina',opts:['En la piscina','En la frutería','En el cine','En la farmacia']},
  {kind:'¿Dónde?',q:'¿Dónde se compra fruta?',ans:'En la frutería',opts:['En la frutería','En la peluquería','En la panadería','En el cine']},

  // === ¿Quién...? ===============================================
  {kind:'¿Quién?',q:'¿Quién apaga incendios?',ans:'El bombero',opts:['El bombero','El médico','El panadero','El profesor']},
  {kind:'¿Quién?',q:'¿Quién cura a los enfermos?',ans:'El médico',opts:['El médico','El bombero','El cartero','El cocinero']},
  {kind:'¿Quién?',q:'¿Quién hace el pan?',ans:'El panadero',opts:['El panadero','El médico','El bombero','El profesor']},
  {kind:'¿Quién?',q:'¿Quién reparte las cartas?',ans:'El cartero',opts:['El cartero','El médico','El cocinero','El frutero']},
  {kind:'¿Quién?',q:'¿Quién enseña en clase?',ans:'La profesora',opts:['La profesora','La panadera','La médica','La cartera']},
  {kind:'¿Quién?',q:'¿Quién vende fruta?',ans:'El frutero',opts:['El frutero','El bombero','El médico','El cartero']},
  {kind:'¿Quién?',q:'¿Quién corta el pelo?',ans:'El peluquero',opts:['El peluquero','El médico','El bombero','El frutero']},
  {kind:'¿Quién?',q:'¿Quién cuida a los animales enfermos?',ans:'El veterinario',opts:['El veterinario','El médico','El profesor','El bombero']},
  {kind:'¿Quién?',q:'¿Quién conduce el autobús?',ans:'El conductor',opts:['El conductor','El bombero','El profesor','El cartero']},
  {kind:'¿Quién?',q:'¿Quién prepara la comida en un restaurante?',ans:'El cocinero',opts:['El cocinero','El médico','El bombero','El cartero']},

  // === ¿Cuándo...? ==============================================
  {kind:'¿Cuándo?',q:'¿Cuándo abren las tiendas?',ans:'Por la mañana',opts:['Por la mañana','A medianoche','En la luna','En sueños']},
  {kind:'¿Cuándo?',q:'¿Cuándo es de noche?',ans:'Cuando se pone el sol',opts:['Cuando se pone el sol','A las doce del mediodía','Por la mañana temprano','En la merienda']},
  {kind:'¿Cuándo?',q:'¿Cuándo desayunamos?',ans:'Por la mañana',opts:['Por la mañana','Por la noche','A medianoche','En la cena']},
  {kind:'¿Cuándo?',q:'¿Cuándo cenamos?',ans:'Por la noche',opts:['Por la noche','En el desayuno','A media mañana','En la merienda']},
  {kind:'¿Cuándo?',q:'¿Cuándo vas al cole?',ans:'Por la mañana entre semana',opts:['Por la mañana entre semana','Los sábados por la noche','Los domingos','En verano siempre']},
  {kind:'¿Cuándo?',q:'¿Cuándo se duerme?',ans:'Por la noche',opts:['Por la noche','En la merienda','Al desayunar','En el recreo']},
  {kind:'¿Cuándo?',q:'¿Cuándo es Navidad?',ans:'En diciembre',opts:['En diciembre','En agosto','En la primavera','En septiembre']},
  {kind:'¿Cuándo?',q:'¿Cuándo hace más calor?',ans:'En verano',opts:['En verano','En invierno','En la nevera','En la nieve']},
  {kind:'¿Cuándo?',q:'¿Cuándo nieva en España?',ans:'En invierno',opts:['En invierno','En verano','En agosto','En la playa']},
  {kind:'¿Cuándo?',q:'¿Cuándo se ducha la gente?',ans:'Por la mañana o por la noche',opts:['Por la mañana o por la noche','A las cinco de la madrugada','Solo los domingos','Una vez al año']},

  // === ¿Por qué...? (causas funcionales tipo "para que") ========
  {kind:'¿Por qué?',q:'¿Por qué nos cepillamos los dientes?',ans:'Para no tener caries',opts:['Para no tener caries','Para hacer ruido','Para gastar pasta','Para perder tiempo']},
  {kind:'¿Por qué?',q:'¿Por qué nos lavamos las manos antes de comer?',ans:'Para no comer microbios',opts:['Para no comer microbios','Para mojarnos','Para gastar agua','Por aburrimiento']},
  {kind:'¿Por qué?',q:'¿Por qué nos ponemos abrigo en invierno?',ans:'Para no pasar frío',opts:['Para no pasar frío','Para sudar','Para parecer mayores','Para ir a la playa']},
  {kind:'¿Por qué?',q:'¿Por qué cerramos la puerta al salir?',ans:'Para que la casa esté segura',opts:['Para que la casa esté segura','Para hacer ruido','Para gastar la cerradura','Por aburrimiento']},
  {kind:'¿Por qué?',q:'¿Por qué cruzamos por el paso de cebra?',ans:'Para cruzar seguros',opts:['Para cruzar seguros','Para correr más','Para ver el suelo','Para gastar zapatos']},
  {kind:'¿Por qué?',q:'¿Por qué vamos al colegio?',ans:'Para aprender cosas',opts:['Para aprender cosas','Para no hacer nada','Para dormir','Para comer caramelos']},
  {kind:'¿Por qué?',q:'¿Por qué bebemos agua?',ans:'Para no tener sed',opts:['Para no tener sed','Para mojarnos por dentro','Por aburrimiento','Para gastar el grifo']},
  {kind:'¿Por qué?',q:'¿Por qué descansamos cuando estamos cansados?',ans:'Para recuperar fuerzas',opts:['Para recuperar fuerzas','Para perder tiempo','Para aburrirnos','Para enfadarnos']},
  {kind:'¿Por qué?',q:'¿Por qué guardamos la comida en la nevera?',ans:'Para que no se estropee',opts:['Para que no se estropee','Para que esté caliente','Para gastar electricidad','Por adornar la nevera']},
  {kind:'¿Por qué?',q:'¿Por qué nos peinamos al levantarnos?',ans:'Para tener el pelo arreglado',opts:['Para tener el pelo arreglado','Para hacerlo más largo','Para ensuciarlo','Por gastar el peine']},

  // === ¿Qué pasa si...? =========================================
  {kind:'¿Qué pasa?',q:'¿Qué pasa si llueve y no llevas paraguas?',ans:'Te mojas',opts:['Te mojas','Te quemas','Tienes hambre','Vuelas']},
  {kind:'¿Qué pasa?',q:'¿Qué pasa si no comes en todo el día?',ans:'Tienes hambre',opts:['Tienes hambre','Te mojas','Te peinas','Te quemas']},
  {kind:'¿Qué pasa?',q:'¿Qué pasa si te quedas sin batería en el móvil?',ans:'Se apaga',opts:['Se apaga','Habla solo','Cocina','Vuela']},
  {kind:'¿Qué pasa?',q:'¿Qué pasa si pones un cubito al sol?',ans:'Se derrite',opts:['Se derrite','Se duerme','Se enfada','Aplaude']},
  {kind:'¿Qué pasa?',q:'¿Qué pasa si llegas tarde al cole?',ans:'Te pierdes parte de la clase',opts:['Te pierdes parte de la clase','Te dan un caramelo','Aprendes más rápido','Se acaba el día']},
  {kind:'¿Qué pasa?',q:'¿Qué pasa si no duermes nada?',ans:'Estás muy cansado al día siguiente',opts:['Estás muy cansado al día siguiente','Estás más alto','Aprendes a volar','Tienes el pelo más largo']},
  {kind:'¿Qué pasa?',q:'¿Qué pasa si tocas algo muy caliente?',ans:'Te quemas',opts:['Te quemas','Te ríes','Te mojas','Te peinas']},
  {kind:'¿Qué pasa?',q:'¿Qué pasa si no riegas una planta?',ans:'Se seca',opts:['Se seca','Crece más','Da fruta','Se pone roja']},
  {kind:'¿Qué pasa?',q:'¿Qué pasa si cruzas en rojo el semáforo?',ans:'Es peligroso, puede pasar un coche',opts:['Es peligroso, puede pasar un coche','Es divertido y seguro','Te dan un premio','Cantas una canción']},
  {kind:'¿Qué pasa?',q:'¿Qué pasa si pierdes las llaves?',ans:'No puedes entrar en casa',opts:['No puedes entrar en casa','Te conviertes en pájaro','Te dan un coche','La casa desaparece']},
];
