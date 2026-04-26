// PRIMERA VERSIÓN — generada siguiendo el doc consolidado §4.12.3.
// REVISAR antes de prod.
//
// COMPLETA: el niño elige la palabra/conector que falta. La regla más
// importante: el contexto de la frase debe fijar UNA SOLA respuesta
// correcta. Si admite dos, la frase está mal construida.
//
//   BÁSICO: preposiciones simples + posesivos personales + artículos.
//           Frases muy cortas (5 palabras máximo). 4 opciones.
//   AVANZADO: posesivos compuestos, demostrativos con pista textual de
//             distancia, indefinidos con contexto. Frases hasta 8 palabras.
//   MASTER: conectores M1 (pero/porque/aunque), M2 (sin embargo / por eso /
//           además / mientras), M3 (a pesar de / por culpa de / en cambio).
//           Frases hasta 10 palabras.
//
// Cada ítem: { q, opts: [string], ans: string, hint?: string }.
//   q: frase con __ donde va el hueco.
//   opts: 4 alternativas (deduplicadas).
//   ans: la respuesta correcta (string, debe coincidir con uno de opts).
//   hint: pista pedagógica para el primer fallo (opcional).

export const COMPLETA_BASICO = [
  // Preposiciones simples (a/de/con/en/por)
  {q:'Voy __ casa',ans:'a',opts:['a','de','con','por'],hint:'Vas a un sitio: usa "a"'},
  {q:'Vengo __ colegio',ans:'del',opts:['del','con','a','por'],hint:'Vienes desde un sitio: "del"'},
  {q:'Como __ tenedor',ans:'con',opts:['con','de','a','por'],hint:'Usas algo: "con"'},
  {q:'Estoy __ el parque',ans:'en',opts:['en','de','con','a'],hint:'Lugar: "en"'},
  {q:'Hablo __ teléfono',ans:'por',opts:['por','de','con','a'],hint:'Medio: "por"'},
  {q:'Salgo __ casa',ans:'de',opts:['de','con','a','en'],hint:'Salir desde un sitio: "de"'},

  // Posesivos personales (mío / mía)
  {q:'Este libro es __',ans:'mío',opts:['mío','mía','tuyo','suyo'],hint:'Libro es masculino: "mío"'},
  {q:'Esta mochila es __',ans:'mía',opts:['mía','mío','tuya','suya'],hint:'Mochila es femenina: "mía"'},
  {q:'El balón es __',ans:'tuyo',opts:['tuyo','tuya','mío','suyo'],hint:'Es de ti, masculino: "tuyo"'},
  {q:'La pelota es __',ans:'tuya',opts:['tuya','tuyo','mía','suya'],hint:'Es de ti, femenina: "tuya"'},

  // Artículos (el/la/los/las)
  {q:'__ niña juega',ans:'La',opts:['La','El','Los','Las'],hint:'Niña es femenina singular: "La"'},
  {q:'__ niño come',ans:'El',opts:['El','La','Los','Las'],hint:'Niño es masculino singular: "El"'},
  {q:'__ amigos llegan',ans:'Los',opts:['Los','Las','El','La'],hint:'Amigos es masculino plural: "Los"'},
  {q:'__ flores son bonitas',ans:'Las',opts:['Las','Los','La','El'],hint:'Flores es femenino plural: "Las"'},

  // Pronombres simples
  {q:'__ tengo hambre',ans:'Yo',opts:['Yo','Tú','Él','Ella'],hint:'Hablas de ti: "Yo"'},
  {q:'__ eres mi amigo',ans:'Tú',opts:['Tú','Yo','Él','Ella'],hint:'Hablas a alguien: "Tú"'},
  {q:'__ se llama Ana',ans:'Ella',opts:['Ella','Él','Yo','Tú'],hint:'Ana es chica: "Ella"'},
  {q:'__ se llama Pedro',ans:'Él',opts:['Él','Ella','Yo','Tú'],hint:'Pedro es chico: "Él"'},

  // Verbos básicos por contexto
  {q:'Yo __ pan',ans:'como',opts:['como','bebo','salto','duermo'],hint:'Pan se come'},
  {q:'Yo __ agua',ans:'bebo',opts:['bebo','como','salto','escribo'],hint:'Agua se bebe'},
  {q:'Yo __ en la cama',ans:'duermo',opts:['duermo','salto','como','bebo'],hint:'En la cama duermes'},
  {q:'Yo __ con mi amigo',ans:'juego',opts:['juego','escribo','como','duermo'],hint:'Con un amigo juegas'},

  // Singular/plural concordancia
  {q:'Tengo __ manzanas',ans:'tres',opts:['tres','un','una','el'],hint:'Manzanas es plural: número'},
  {q:'Tengo __ libro',ans:'un',opts:['un','tres','dos','cinco'],hint:'Libro es singular: "un"'},
  {q:'Quiero __ vaso de agua',ans:'un',opts:['un','tres','dos','cinco']},
  {q:'Hay __ flores en el jarrón',ans:'cinco',opts:['cinco','un','una','el']},

  // Lugares
  {q:'El pan se compra en la __',ans:'panadería',opts:['panadería','farmacia','librería','frutería']},
  {q:'La medicina se compra en la __',ans:'farmacia',opts:['farmacia','panadería','librería','carnicería']},
  {q:'Los libros se compran en la __',ans:'librería',opts:['librería','frutería','farmacia','panadería']},
  {q:'La fruta se compra en la __',ans:'frutería',opts:['frutería','librería','farmacia','panadería']},
];

export const COMPLETA_AVANZADO = [
  // Posesivos compuestos
  {q:'El bocadillo es de Ana, es __',ans:'suyo',opts:['suyo','suya','mío','tuyo'],hint:'De ella, masculino: "suyo"'},
  {q:'La bicicleta es de Pablo, es __',ans:'suya',opts:['suya','suyo','mía','tuya'],hint:'De él, femenino: "suya"'},
  {q:'Estos juguetes son de Ana y Pablo, son __',ans:'suyos',opts:['suyos','suyas','míos','nuestros'],hint:'Plural masculino: "suyos"'},
  {q:'Estas mochilas son nuestras, son __',ans:'nuestras',opts:['nuestras','nuestros','suyas','mías']},
  {q:'Los lápices son de Marta, son __',ans:'suyos',opts:['suyos','suyas','tuyos','míos']},
  {q:'Esta casa es de mis abuelos, es __',ans:'suya',opts:['suya','mía','tuya','nuestra']},

  // Demostrativos con pista de distancia
  {q:'Quiero __ libro que tienes en la mano',ans:'ese',opts:['ese','este','aquel','algún'],hint:'En tu mano, no tan lejos: "ese"'},
  {q:'Mira __ pájaro que vuela en el cielo',ans:'aquel',opts:['aquel','este','ese','ningún'],hint:'Lejos: "aquel"'},
  {q:'Cógeme __ vaso que tengo aquí',ans:'este',opts:['este','ese','aquel','algún'],hint:'Aquí cerca de mí: "este"'},
  {q:'Pásame __ silla que está a tu lado',ans:'esa',opts:['esa','esta','aquella','alguna']},
  {q:'__ montaña del fondo es enorme',ans:'Aquella',opts:['Aquella','Esta','Esa','Alguna']},

  // Indefinidos con contexto
  {q:'Comí los 10 caramelos. Los comí __',ans:'todos',opts:['todos','algunos','pocos','ninguno'],hint:'Si comes los 10, los comes todos'},
  {q:'En la fiesta había 50 personas. Había __',ans:'mucha',opts:['mucha','poca','ninguna','alguna'],hint:'50 es mucho'},
  {q:'No quedó nada en el plato, no quedó __',ans:'nada',opts:['nada','algo','poco','mucho']},
  {q:'En la sala no había __ persona',ans:'ninguna',opts:['ninguna','alguna','mucha','toda']},
  {q:'__ amigos vinieron a la fiesta, vinieron casi todos',ans:'Muchos',opts:['Muchos','Pocos','Ningún','Algún']},

  // Preposiciones más complejas
  {q:'Voy al cine __ mis amigos',ans:'con',opts:['con','de','para','sin']},
  {q:'Compré un regalo __ mi madre',ans:'para',opts:['para','con','de','por']},
  {q:'Salí __ paraguas y me mojé',ans:'sin',opts:['sin','con','para','de']},
  {q:'El libro es __ mi padre',ans:'de',opts:['de','para','con','sin']},
  {q:'Volví __ casa después del cole',ans:'a',opts:['a','de','con','sin']},

  // Concordancia complicada
  {q:'__ niños juegan en el parque',ans:'Los',opts:['Los','Las','El','Un']},
  {q:'__ profesoras explican la clase',ans:'Las',opts:['Las','Los','La','Un']},
  {q:'Tengo __ amigos en el cole',ans:'muchos',opts:['muchos','muchas','mucha','mucho']},
  {q:'En la cocina hay __ ollas',ans:'varias',opts:['varias','varios','mucho','poco']},

  // Tiempo y secuencia
  {q:'Primero desayuno, __ voy al cole',ans:'después',opts:['después','antes','mientras','aunque']},
  {q:'__ de comer me lavo las manos',ans:'Antes',opts:['Antes','Después','Mientras','Sin']},
  {q:'__ ducharme me visto',ans:'Después de',opts:['Después de','Antes de','Sin','Con']},
  {q:'Como __ veo la tele',ans:'mientras',opts:['mientras','antes','después','sin']},
];

export const COMPLETA_MASTER = [
  // M1 — pero / porque / aunque
  {q:'No salgo __ está lloviendo',ans:'porque',opts:['porque','pero','aunque','además']},
  {q:'Me gusta el café __ no puedo tomarlo por la noche',ans:'pero',opts:['pero','porque','aunque','además']},
  {q:'__ está lloviendo, voy a salir',ans:'Aunque',opts:['Aunque','Porque','Pero','Además']},
  {q:'Tengo sueño __ es muy tarde',ans:'porque',opts:['porque','pero','aunque','sin embargo']},
  {q:'Estudia mucho __ no le salen los exámenes',ans:'pero',opts:['pero','porque','aunque','además']},
  {q:'__ vino tarde, le dejaron entrar',ans:'Aunque',opts:['Aunque','Porque','Pero','Por eso']},

  // M2 — sin embargo / por eso / además / mientras
  {q:'Estaba cansado, __ siguió trabajando',ans:'sin embargo',opts:['sin embargo','por eso','además','mientras']},
  {q:'No tenía dinero, __ no pude comprarlo',ans:'por eso',opts:['por eso','sin embargo','además','aunque']},
  {q:'Es muy listo, __ trabaja mucho',ans:'además',opts:['además','sin embargo','por eso','pero']},
  {q:'Yo cocinaba __ él ponía la mesa',ans:'mientras',opts:['mientras','sin embargo','además','por eso']},
  {q:'Llovía mucho, __ cogí el paraguas',ans:'por eso',opts:['por eso','sin embargo','además','aunque']},
  {q:'No le gusta el deporte, __ va al gimnasio cada día',ans:'sin embargo',opts:['sin embargo','por eso','además','mientras']},

  // M3 — a pesar de / por culpa de / en cambio
  {q:'__ estar resfriado, fue al trabajo',ans:'A pesar de',opts:['A pesar de','Por culpa de','Por eso','Además de']},
  {q:'Llegamos tarde __ del tráfico',ans:'por culpa',opts:['por culpa','por eso','a pesar','sin embargo']},
  {q:'Mi hermana es muy ordenada, __ yo soy un desastre',ans:'en cambio',opts:['en cambio','por eso','a pesar de','además']},
  {q:'__ del frío, salimos de paseo',ans:'A pesar',opts:['A pesar','Por culpa','Por eso','Además']},
  {q:'Suspendí el examen __ no estudiar',ans:'por',opts:['por','a pesar de','en cambio','además']},
  {q:'A él le gusta correr, __ a mí me gusta nadar',ans:'en cambio',opts:['en cambio','por eso','a pesar de','sin embargo']},

  // Mezcla — frases más largas
  {q:'Cogí el paraguas __ no quería mojarme',ans:'porque',opts:['porque','aunque','sin embargo','en cambio']},
  {q:'Trabajé todo el sábado, __ tuve poco tiempo libre',ans:'por eso',opts:['por eso','aunque','sin embargo','en cambio']},
  {q:'__ el ruido, conseguí dormir bien',ans:'A pesar de',opts:['A pesar de','Por culpa de','Por eso','Además de']},
  {q:'No me gusta el pescado, __ me lo como por educación',ans:'pero',opts:['pero','porque','sin embargo','aunque']},
  {q:'Está muy enfadado __ le gritaron sin razón',ans:'porque',opts:['porque','aunque','en cambio','además']},
  {q:'Yo prefiero el café, __ él prefiere el té',ans:'en cambio',opts:['en cambio','por eso','a pesar de','aunque']},
];

export const COMPLETA_ALL = [...COMPLETA_BASICO, ...COMPLETA_AVANZADO, ...COMPLETA_MASTER];
