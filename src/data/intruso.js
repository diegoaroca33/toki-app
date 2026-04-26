// PRIMERA VERSIÓN — generada siguiendo el doc consolidado §4.12.2.
// REVISAR antes de prod.
//
// INTRUSO: el niño descarta el elemento que NO pertenece a la categoría
// (o el que SÍ encaja en una pregunta inversa). Tres niveles:
//
//   BÁSICO: 1 palabra/categoría → 4 imágenes. Mecánica de descarte
//           visual ("¿cuál NO es una FRUTA?").
//   AVANZADO: 1 pregunta → 4 palabras. Mezcla NO/SÍ, categorías un poco
//             más sutiles (animal/mueble/profesión/ropa/comida).
//   MASTER: igual que avanzado pero con palabras más complejas, frases
//           y vocabulario adulto-funcional (trámites, profesiones
//           sanitarias, electrodomésticos, lugares oficiales).
//
// Cada ítem: { q, opts: [{l, isAns}], cat }
//   q: pregunta visible
//   opts: 4 opciones, una con isAns:true (la respuesta correcta)
//   cat: categoría de fondo (para hint pedagógico)

export const INTRUSO_BASICO = [
  {q:'¿Cuál NO es una FRUTA?',cat:'fruta',opts:[
    {l:'🍎',isAns:false},{l:'📚',isAns:true},{l:'🍐',isAns:false},{l:'🍌',isAns:false}
  ]},
  {q:'¿Cuál NO es un ANIMAL?',cat:'animal',opts:[
    {l:'🐶',isAns:false},{l:'🐱',isAns:false},{l:'🚗',isAns:true},{l:'🐦',isAns:false}
  ]},
  {q:'¿Cuál NO es ROPA?',cat:'ropa',opts:[
    {l:'👕',isAns:false},{l:'👖',isAns:false},{l:'🧦',isAns:false},{l:'🍞',isAns:true}
  ]},
  {q:'¿Cuál NO es COMIDA?',cat:'comida',opts:[
    {l:'🍕',isAns:false},{l:'🥖',isAns:false},{l:'🚲',isAns:true},{l:'🥕',isAns:false}
  ]},
  {q:'¿Cuál NO es un VEHÍCULO?',cat:'vehículo',opts:[
    {l:'🚗',isAns:false},{l:'🚌',isAns:false},{l:'🌳',isAns:true},{l:'🚲',isAns:false}
  ]},
  {q:'¿Cuál NO es un MUEBLE?',cat:'mueble',opts:[
    {l:'🛋️',isAns:false},{l:'🪑',isAns:false},{l:'🛏️',isAns:false},{l:'🐟',isAns:true}
  ]},
  {q:'¿Cuál NO es un JUGUETE?',cat:'juguete',opts:[
    {l:'🧸',isAns:false},{l:'⚽',isAns:false},{l:'🥖',isAns:true},{l:'🪀',isAns:false}
  ]},
  {q:'¿Cuál NO es una HERRAMIENTA?',cat:'herramienta',opts:[
    {l:'🔨',isAns:false},{l:'🔧',isAns:false},{l:'🍦',isAns:true},{l:'⛏️',isAns:false}
  ]},
  {q:'¿Cuál NO es una PARTE DEL CUERPO?',cat:'parte del cuerpo',opts:[
    {l:'👁️',isAns:false},{l:'👂',isAns:false},{l:'📱',isAns:true},{l:'🦷',isAns:false}
  ]},
  {q:'¿Cuál NO es un INSTRUMENTO MUSICAL?',cat:'instrumento',opts:[
    {l:'🎸',isAns:false},{l:'🎹',isAns:false},{l:'📚',isAns:true},{l:'🥁',isAns:false}
  ]},
];

export const INTRUSO_AVANZADO = [
  {q:'¿Cuál NO es un animal?',cat:'animal',opts:[
    {l:'PERRO',isAns:false},{l:'GATO',isAns:false},{l:'VACA',isAns:false},{l:'MANZANA',isAns:true}
  ]},
  {q:'¿Cuál SÍ es un mueble?',cat:'mueble',opts:[
    {l:'ZAPATO',isAns:false},{l:'SILLA',isAns:true},{l:'PERRO',isAns:false},{l:'PAN',isAns:false}
  ]},
  {q:'¿Cuál NO es una profesión?',cat:'profesión',opts:[
    {l:'MÉDICO',isAns:false},{l:'CARPINTERO',isAns:false},{l:'TENEDOR',isAns:true},{l:'PROFESORA',isAns:false}
  ]},
  {q:'¿Cuál SÍ es una fruta?',cat:'fruta',opts:[
    {l:'PEZ',isAns:false},{l:'COCHE',isAns:false},{l:'PERA',isAns:true},{l:'SILLA',isAns:false}
  ]},
  {q:'¿Cuál NO es una verdura?',cat:'verdura',opts:[
    {l:'LECHUGA',isAns:false},{l:'ZANAHORIA',isAns:false},{l:'MANZANA',isAns:true},{l:'TOMATE',isAns:false}
  ]},
  {q:'¿Cuál SÍ es un medio de transporte?',cat:'transporte',opts:[
    {l:'NEVERA',isAns:false},{l:'PIANO',isAns:false},{l:'AUTOBÚS',isAns:true},{l:'CAMA',isAns:false}
  ]},
  {q:'¿Cuál NO es un lugar de la casa?',cat:'casa',opts:[
    {l:'COCINA',isAns:false},{l:'BAÑO',isAns:false},{l:'DORMITORIO',isAns:false},{l:'ESTACIÓN',isAns:true}
  ]},
  {q:'¿Cuál SÍ es ropa de invierno?',cat:'ropa de invierno',opts:[
    {l:'BAÑADOR',isAns:false},{l:'CHANCLAS',isAns:false},{l:'ABRIGO',isAns:true},{l:'SOMBRILLA',isAns:false}
  ]},
  {q:'¿Cuál NO es un día de la semana?',cat:'día semana',opts:[
    {l:'LUNES',isAns:false},{l:'MARZO',isAns:true},{l:'MARTES',isAns:false},{l:'VIERNES',isAns:false}
  ]},
  {q:'¿Cuál NO es un color?',cat:'color',opts:[
    {l:'AZUL',isAns:false},{l:'ROJO',isAns:false},{l:'TIGRE',isAns:true},{l:'VERDE',isAns:false}
  ]},
  {q:'¿Cuál SÍ es un deporte?',cat:'deporte',opts:[
    {l:'TENEDOR',isAns:false},{l:'FÚTBOL',isAns:true},{l:'NEVERA',isAns:false},{l:'LIBRO',isAns:false}
  ]},
  {q:'¿Cuál NO es un electrodoméstico?',cat:'electrodoméstico',opts:[
    {l:'NEVERA',isAns:false},{l:'LAVADORA',isAns:false},{l:'PERRO',isAns:true},{l:'MICROONDAS',isAns:false}
  ]},
];

export const INTRUSO_MASTER = [
  {q:'¿Cuál NO es una profesión sanitaria?',cat:'profesión sanitaria',opts:[
    {l:'MÉDICO',isAns:false},{l:'ENFERMERO',isAns:false},{l:'PROFESOR',isAns:true},{l:'DENTISTA',isAns:false}
  ]},
  {q:'¿Cuál NO es un trámite oficial?',cat:'trámite',opts:[
    {l:'FACTURA',isAns:false},{l:'CONTRATO',isAns:false},{l:'PELOTA',isAns:true},{l:'RECIBO',isAns:false}
  ]},
  {q:'¿Cuál SÍ es un mueble del salón?',cat:'mueble del salón',opts:[
    {l:'NEVERA',isAns:false},{l:'LAVADORA',isAns:false},{l:'BAÑERA',isAns:false},{l:'SOFÁ',isAns:true}
  ]},
  {q:'¿Cuál NO es un lugar oficial?',cat:'lugar oficial',opts:[
    {l:'AYUNTAMIENTO',isAns:false},{l:'JUZGADO',isAns:false},{l:'DISCOTECA',isAns:true},{l:'CENTRO DE SALUD',isAns:false}
  ]},
  {q:'¿Cuál SÍ es un electrodoméstico de la cocina?',cat:'electrodoméstico cocina',opts:[
    {l:'CAMA',isAns:false},{l:'SOFÁ',isAns:false},{l:'NEVERA',isAns:true},{l:'ARMARIO',isAns:false}
  ]},
  {q:'¿Cuál NO es un medio de comunicación?',cat:'medio comunicación',opts:[
    {l:'PERIÓDICO',isAns:false},{l:'TELEVISIÓN',isAns:false},{l:'BICICLETA',isAns:true},{l:'RADIO',isAns:false}
  ]},
  {q:'¿Cuál NO es un documento de identidad?',cat:'documento',opts:[
    {l:'DNI',isAns:false},{l:'PASAPORTE',isAns:false},{l:'CÓMIC',isAns:true},{l:'CARNET DE CONDUCIR',isAns:false}
  ]},
  {q:'¿Cuál SÍ es algo que se firma?',cat:'firma',opts:[
    {l:'GALLETA',isAns:false},{l:'CONTRATO',isAns:true},{l:'TELÉFONO',isAns:false},{l:'TENEDOR',isAns:false}
  ]},
  {q:'¿Cuál NO es un servicio público?',cat:'servicio público',opts:[
    {l:'BIBLIOTECA',isAns:false},{l:'HOSPITAL',isAns:false},{l:'POLIDEPORTIVO',isAns:false},{l:'PASTELERÍA',isAns:true}
  ]},
  {q:'¿Cuál NO es una herramienta de oficina?',cat:'oficina',opts:[
    {l:'BOLÍGRAFO',isAns:false},{l:'GRAPADORA',isAns:false},{l:'MARTILLO',isAns:true},{l:'ORDENADOR',isAns:false}
  ]},
];

export const INTRUSO_ALL = [...INTRUSO_BASICO, ...INTRUSO_AVANZADO, ...INTRUSO_MASTER];
