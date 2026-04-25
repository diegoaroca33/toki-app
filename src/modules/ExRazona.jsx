import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { GOLD, GREEN, RED, BLUE, PURPLE, DIM, CARD, BORDER, BG3, TXT } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { rnd, beep, mkPerfect } from '../utils.js'
import { useIdle, NumPad, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

// ===== RAZONA MODULE =====
// Shared scene positions for SceneSVG and SpatialDrag
const SCENE_POS={
  mesa:{encima:{x:180,y:65},debajo:{x:180,y:195},'al lado':{x:310,y:100},dentro:{x:180,y:140},fuera:{x:310,y:100}},
  silla:{encima:{x:170,y:92},debajo:{x:170,y:190},'al lado':{x:280,y:120},dentro:{x:170,y:120},fuera:{x:280,y:120}},
  estantería:{encima:{x:180,y:35},debajo:{x:180,y:200},'al lado':{x:310,y:120},dentro:{x:180,y:82},fuera:{x:310,y:120}},
  caja:{encima:{x:180,y:40},debajo:{x:180,y:200},'al lado':{x:295,y:120},dentro:{x:175,y:120},fuera:{x:295,y:120}},
  mochila:{encima:{x:175,y:35},debajo:{x:175,y:195},'al lado':{x:285,y:110},dentro:{x:175,y:120},fuera:{x:285,y:110}},
  puerta:{encima:{x:170,y:34},debajo:{x:170,y:215},'al lado':{x:280,y:130},dentro:{x:170,y:130},fuera:{x:280,y:130}},
  armario:{encima:{x:175,y:34},debajo:{x:175,y:215},'al lado':{x:295,y:130},dentro:{x:125,y:170},fuera:{x:295,y:130}}
};
const RAZONA_SPATIAL=[
  {scene:'estantería',obj:'libro',pos:'encima',q:'¿Dónde está el libro?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Encima'},
  {scene:'mesa',obj:'mochila',pos:'debajo',q:'¿Dónde está la mochila?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Debajo'},
  {scene:'caja',obj:'móvil',pos:'dentro',q:'¿Dónde está el móvil?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Dentro'},
  {scene:'silla',obj:'gafas',pos:'encima',q:'¿Dónde están las gafas?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Encima'},
  {scene:'armario',obj:'zapatillas',pos:'dentro',q:'¿Dónde están las zapatillas?',opts:['Encima','Debajo','Dentro','Fuera'],ans:'Dentro'},
  {scene:'puerta',obj:'llaves',pos:'al lado',q:'¿Dónde están las llaves?',opts:['Encima','Debajo','Al lado','Dentro'],ans:'Al lado'},
  {scene:'mochila',obj:'estuche',pos:'dentro',q:'¿Dónde está el estuche?',opts:['Encima','Debajo','Dentro','Fuera'],ans:'Dentro'},
  {scene:'estantería',obj:'balón',pos:'debajo',q:'¿Dónde está el balón?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Debajo'},
];
const RAZONA_DRAG=[
  {scene:'armario',obj:'zapatillas',pos:'dentro',q:'¡Guarda las zapatillas dentro del armario!'},
  {scene:'mesa',obj:'libro',pos:'encima',q:'¡Pon el libro encima de la mesa!'},
  {scene:'silla',obj:'mochila',pos:'debajo',q:'¡Pon la mochila debajo de la silla!'},
  {scene:'estantería',obj:'balón',pos:'encima',q:'¡Pon el balón encima de la estantería!'},
  {scene:'caja',obj:'móvil',pos:'dentro',q:'¡Mete el móvil dentro de la caja!'},
  {scene:'puerta',obj:'llaves',pos:'al lado',q:'¡Deja las llaves al lado de la puerta!'},
  {scene:'mesa',obj:'gafas',pos:'encima',q:'¡Pon las gafas encima de la mesa!'},
  {scene:'armario',obj:'estuche',pos:'dentro',q:'¡Guarda el estuche dentro del armario!'},
];
const RAZONA_INTRUSO=[
  {cat:'animal',words:['PERRO','GATO','PEZ','MESA'],ans:'MESA',q:'¿Cuál NO es un animal?'},
  {cat:'fruta',words:['MANZANA','PERA','PLÁTANO','SILLA'],ans:'SILLA',q:'¿Cuál NO es una fruta?'},
  {cat:'ropa',words:['CAMISA','PANTALÓN','ZAPATO','COCHE'],ans:'COCHE',q:'¿Cuál NO es ropa?'},
  {cat:'mueble',words:['MESA','SILLA','ARMARIO','GATO'],ans:'GATO',q:'¿Cuál NO es un mueble?'},
  {cat:'color',words:['ROJO','AZUL','VERDE','LIBRO'],ans:'LIBRO',q:'¿Cuál NO es un color?'},
  {cat:'transporte',words:['COCHE','AVIÓN','TREN','MANZANA'],ans:'MANZANA',q:'¿Cuál NO es un transporte?'},
  {cat:'cuerpo',words:['MANO','PIE','OJO','LÁPIZ'],ans:'LÁPIZ',q:'¿Cuál NO es del cuerpo?'},
  {cat:'deporte',words:['FÚTBOL','TENIS','NATACIÓN','SOPA'],ans:'SOPA',q:'¿Cuál NO es un deporte?'},
];
const RAZONA_CLASSIFY=[
  {groups:['Frutas','Animales'],items:[{w:'🍎 Manzana',g:0},{w:'🐕 Perro',g:1},{w:'🍐 Pera',g:0},{w:'🐱 Gato',g:1},{w:'🍌 Plátano',g:0},{w:'🐟 Pez',g:1}]},
  {groups:['Ropa','Comida'],items:[{w:'👕 Camisa',g:0},{w:'🍞 Pan',g:1},{w:'👟 Zapato',g:0},{w:'🧀 Queso',g:1},{w:'🧢 Gorro',g:0},{w:'🥛 Leche',g:1}]},
  {groups:['Animales','Muebles'],items:[{w:'🦁 León',g:0},{w:'🪑 Mesa',g:1},{w:'🐻 Oso',g:0},{w:'💺 Silla',g:1},{w:'🐦 Pájaro',g:0},{w:'🛏️ Cama',g:1}]},
  // Naturales/Sociales — contenido curricular primaria
  {groups:['🌾 Natural','🏭 Elaborado'],items:[{w:'🌾 Trigo',g:0},{w:'🍞 Pan',g:1},{w:'🥛 Leche',g:0},{w:'🧀 Queso',g:1},{w:'🌳 Madera',g:0},{w:'🪑 Mesa',g:1}]},
  {groups:['🌾 Natural','🏭 Elaborado'],items:[{w:'🫒 Aceituna',g:0},{w:'🫒 Aceite',g:1},{w:'🐑 Lana',g:0},{w:'🧣 Bufanda',g:1},{w:'🍇 Uva',g:0},{w:'🍷 Zumo',g:1}]},
  {groups:['🌾 Natural','🏭 Elaborado'],items:[{w:'🥚 Huevo',g:0},{w:'🍰 Pastel',g:1},{w:'🌻 Girasol',g:0},{w:'🛢️ Aceite',g:1},{w:'🐄 Vaca',g:0},{w:'👞 Zapatos',g:1}]},
  {groups:['❄️ Invierno','☀️ Verano'],items:[{w:'🧥 Abrigo',g:0},{w:'👙 Bañador',g:1},{w:'🧣 Bufanda',g:0},{w:'🩴 Chanclas',g:1},{w:'🧤 Guantes',g:0},{w:'🕶️ Gafas sol',g:1}]},
  {groups:['❄️ Invierno','☀️ Verano'],items:[{w:'🧶 Jersey',g:0},{w:'👕 Camiseta',g:1},{w:'🥾 Botas',g:0},{w:'🩱 Bermudas',g:1},{w:'☂️ Paraguas',g:0},{w:'🧴 Crema sol',g:1}]},
  {groups:['🏡 Pueblo','🏙️ Ciudad'],items:[{w:'🌾 Campos',g:0},{w:'🏢 Edificios',g:1},{w:'🐄 Vacas',g:0},{w:'🚌 Autobuses',g:1},{w:'🌳 Bosque',g:0},{w:'🏥 Hospital',g:1}]},
  {groups:['🏠 Dentro casa','🌳 Fuera casa'],items:[{w:'🛋️ Sofá',g:0},{w:'🌳 Árbol',g:1},{w:'🍳 Cocina',g:0},{w:'🏊 Piscina',g:1},{w:'🛁 Bañera',g:0},{w:'⛱️ Playa',g:1}]},
  {groups:['🔊 Hace ruido','🤫 Silencioso'],items:[{w:'🥁 Tambor',g:0},{w:'📚 Libro',g:1},{w:'📱 Teléfono',g:0},{w:'🧸 Peluche',g:1},{w:'🐕 Perro',g:0},{w:'🐟 Pez',g:1}]},
  {groups:['💧 Agua','🔥 Fuego'],items:[{w:'🏊 Nadar',g:0},{w:'🏕️ Hoguera',g:1},{w:'🚿 Ducha',g:0},{w:'🕯️ Vela',g:1},{w:'🌧️ Lluvia',g:0},{w:'☀️ Sol',g:1}]},
  // Origen de los alimentos
  {groups:['🐄 Animal','🌱 Vegetal'],items:[{w:'🥛 Leche',g:0},{w:'🍎 Manzana',g:1},{w:'🥚 Huevo',g:0},{w:'🥕 Zanahoria',g:1},{w:'🧀 Queso',g:0},{w:'🍌 Plátano',g:1}]},
  {groups:['🐄 Animal','🌱 Vegetal'],items:[{w:'🍗 Pollo',g:0},{w:'🍅 Tomate',g:1},{w:'🐟 Pescado',g:0},{w:'🥦 Brócoli',g:1},{w:'🍖 Carne',g:0},{w:'🍇 Uvas',g:1}]},
  // Usos del agua
  {groups:['💧 Necesita agua','❌ No necesita agua'],items:[{w:'🧼 Lavarse',g:0},{w:'📺 Ver la tele',g:1},{w:'🍲 Cocinar',g:0},{w:'📖 Leer',g:1},{w:'🌱 Regar plantas',g:0},{w:'🎮 Jugar consola',g:1}]},
  // Profesiones que ayudan
  {groups:['👨‍⚕️ Salud','🛡️ Seguridad'],items:[{w:'👨‍⚕️ Médico',g:0},{w:'👮 Policía',g:1},{w:'🏥 Enfermera',g:0},{w:'🚒 Bombero',g:1},{w:'🦷 Dentista',g:0},{w:'🛡️ Guardia',g:1}]},
  // Sentidos y órganos
  {groups:['👀 Veo con...','👂 Oigo con...'],items:[{w:'👀 Ojos',g:0},{w:'👂 Oídos',g:1},{w:'📺 Televisión',g:0},{w:'🎵 Música',g:1},{w:'📖 Libro',g:0},{w:'📱 Teléfono',g:1}]},
];
const RAZONA_CAUSE=[
  {q:'Si llueve... ¿qué cojo?',opts:['☂️ Paraguas','🕶️ Gafas de sol'],ans:'☂️ Paraguas'},
  {q:'Si tengo hambre... ¿qué hago?',opts:['🍽️ Como','😴 Duermo'],ans:'🍽️ Como'},
  {q:'Si hace frío... ¿qué me pongo?',opts:['🧥 Abrigo','👙 Bañador'],ans:'🧥 Abrigo'},
  {q:'Si está oscuro... ¿qué enciendo?',opts:['💡 La luz','🚰 El grifo'],ans:'💡 La luz'},
  {q:'Si me duele la cabeza... ¿qué tomo?',opts:['💊 Medicina','🥤 Refresco'],ans:'💊 Medicina'},
  {q:'Si quiero cruzar la calle... ¿qué miro?',opts:['🚦 El semáforo','🕐 El reloj'],ans:'🚦 El semáforo'},
  // Entorno cotidiano — causa/efecto
  {q:'Si tengo sed... ¿qué cojo?',opts:['💧 Un vaso de agua','🧥 Un abrigo'],ans:'💧 Un vaso de agua'},
  {q:'Si es de noche... ¿qué hago?',opts:['💡 Enciendo la luz','🕶️ Me pongo gafas'],ans:'💡 Enciendo la luz'},
  {q:'Si tengo sueño... ¿qué hago?',opts:['🛏️ Me voy a dormir','⚽ Juego al fútbol'],ans:'🛏️ Me voy a dormir'},
  {q:'Si tengo calor... ¿qué hago?',opts:['🪟 Abro la ventana','🧥 Me pongo abrigo'],ans:'🪟 Abro la ventana'},
  {q:'Si me he manchado... ¿qué hago?',opts:['🧼 Me lavo','📺 Veo la tele'],ans:'🧼 Me lavo'},
  {q:'Si suena el timbre... ¿qué hago?',opts:['🚪 Voy a abrir','😴 Sigo durmiendo'],ans:'🚪 Voy a abrir'},
  {q:'Si es mi cumpleaños... ¿qué digo?',opts:['🎂 ¡Gracias por venir!','😤 No quiero nada'],ans:'🎂 ¡Gracias por venir!'},
  {q:'Si un amigo está triste... ¿qué hago?',opts:['🤗 Le doy un abrazo','🏃 Me voy corriendo'],ans:'🤗 Le doy un abrazo'},
  {q:'Si hace sol... ¿qué me pongo?',opts:['🕶️ Gafas de sol','🧣 Bufanda'],ans:'🕶️ Gafas de sol'},
  {q:'Si quiero comprar pan... ¿dónde voy?',opts:['🥖 A la panadería','🏥 Al hospital'],ans:'🥖 A la panadería'},
  {q:'Si estoy enfermo... ¿dónde voy?',opts:['🏥 Al médico','🎬 Al cine'],ans:'🏥 Al médico'},
  {q:'Si necesito un libro... ¿dónde voy?',opts:['📚 A la biblioteca','🍕 A la pizzería'],ans:'📚 A la biblioteca'},
  {q:'Si quiero nadar... ¿dónde voy?',opts:['🏊 A la piscina','📚 A la biblioteca'],ans:'🏊 A la piscina'},
  {q:'Si hay fuego... ¿a quién llamo?',opts:['🚒 A los bomberos','🍕 A la pizzería'],ans:'🚒 A los bomberos'},
  {q:'Si estoy perdido... ¿qué hago?',opts:['👮 Busco un policía','🏃 Corro sin parar'],ans:'👮 Busco un policía'},
  {q:'Si quiero cruzar... ¿por dónde paso?',opts:['🚶 Por el paso de cebra','🏃 Por donde sea'],ans:'🚶 Por el paso de cebra'},
  {q:'Si me duele la muela... ¿dónde voy?',opts:['🦷 Al dentista','🎮 A jugar'],ans:'🦷 Al dentista'},
  {q:'Si llueve y no tengo paraguas...',opts:['🏠 Espero bajo un techo','🏃 Corro bajo la lluvia'],ans:'🏠 Espero bajo un techo'},
  {q:'Si alguien me da un regalo...',opts:['🙏 Doy las gracias','😤 No digo nada'],ans:'🙏 Doy las gracias'},
  {q:'Si veo basura en el suelo...',opts:['🗑️ La tiro a la papelera','👟 La piso'],ans:'🗑️ La tiro a la papelera'},
  // Servicios municipales
  {q:'Si hay un incendio... ¿a quién llamo?',opts:['🚒 A los bomberos','🌳 Al jardinero'],ans:'🚒 A los bomberos'},
  {q:'Si veo un ladrón... ¿a quién llamo?',opts:['👮 A la policía','📬 Al cartero'],ans:'👮 A la policía'},
  {q:'Si alguien se desmaya... ¿a quién llamo?',opts:['🚑 A la ambulancia','🧹 Al barrendero'],ans:'🚑 A la ambulancia'},
  {q:'Si la calle está sucia... ¿quién la limpia?',opts:['🧹 El barrendero','🚒 El bombero'],ans:'🧹 El barrendero'},
  {q:'Si se rompe una tubería... ¿a quién aviso?',opts:['🏛️ Al ayuntamiento','🚒 Al bombero'],ans:'🏛️ Al ayuntamiento'},
  // Medios de comunicación
  {q:'Si quiero hablar con mamá ahora...',opts:['📱 La llamo por teléfono','✉️ Le mando una carta'],ans:'📱 La llamo por teléfono'},
  {q:'Si quiero ver dibujos...',opts:['📺 Enciendo la tele','📱 Llamo por teléfono'],ans:'📺 Enciendo la tele'},
  {q:'Si quiero mandar un mensaje a mi amigo...',opts:['📱 Le mando un mensaje','📻 Pongo la radio'],ans:'📱 Le mando un mensaje'},
  {q:'Si quiero escuchar música en el coche...',opts:['📻 Pongo la radio','✉️ Mando una carta'],ans:'📻 Pongo la radio'},
  // Dónde voy para viajar
  {q:'Si voy en tren... ¿dónde voy?',opts:['🚉 A la estación','✈️ Al aeropuerto'],ans:'🚉 A la estación'},
  {q:'Si voy en avión... ¿dónde voy?',opts:['✈️ Al aeropuerto','⚓ Al puerto'],ans:'✈️ Al aeropuerto'},
  {q:'Si voy en barco... ¿dónde voy?',opts:['⚓ Al puerto','🚉 A la estación'],ans:'⚓ Al puerto'},
  {q:'Si cojo un autobús... ¿dónde espero?',opts:['🚏 En la parada','✈️ En el aeropuerto'],ans:'🚏 En la parada'},
  // Estaciones del año
  {q:'Si las hojas se caen... ¿qué estación es?',opts:['🍂 Otoño','☀️ Verano'],ans:'🍂 Otoño'},
  {q:'Si hace mucho calor y vamos a la piscina...',opts:['☀️ Es verano','❄️ Es invierno'],ans:'☀️ Es verano'},
  {q:'Si nieva... ¿qué me pongo?',opts:['🧥 Abrigo y botas','👙 Bañador'],ans:'🧥 Abrigo y botas'},
  {q:'Si salen flores y los pájaros cantan...',opts:['🌸 Es primavera','🍂 Es otoño'],ans:'🌸 Es primavera'},
  // Peso funcional
  {q:'¿Qué pesa más?',opts:['🚗 Un coche','🍎 Una manzana'],ans:'🚗 Un coche'},
  {q:'¿Qué pesa más?',opts:['📚 Mochila llena','🪶 Una pluma'],ans:'📚 Mochila llena'},
  {q:'Un kilo de manzanas... ¿cuántas son más o menos?',opts:['🍎 Unas 5 o 6','🍎 Unas 100'],ans:'🍎 Unas 5 o 6'},
  {q:'¿Cuánto pesa más o menos una sandía?',opts:['🍉 Unos 4 kilos','🍉 Unos 100 gramos'],ans:'🍉 Unos 4 kilos'},
];
const RAZONA_EMOTIONS=[
  {emoji:'😊',emotion:'Contento',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {emoji:'😢',emotion:'Triste',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {emoji:'😠',emotion:'Enfadado',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {emoji:'😨',emotion:'Asustado',q:'¿Cómo se siente?',opts:['Contento','Asustado','Enfadado','Sorprendido']},
  {emoji:'😲',emotion:'Sorprendido',q:'¿Cómo se siente?',opts:['Contento','Sorprendido','Enfadado','Triste']},
  {emoji:'😴',emotion:'Cansado',q:'¿Cómo se siente?',opts:['Contento','Cansado','Enfadado','Asustado']},
];

export function genPatterns(difficulty){const sh=a=>[...a].sort(()=>Math.random()-.5);const items=[];
  const COLORS=[{em:'🔴',n:'rojo'},{em:'🔵',n:'azul'},{em:'🟢',n:'verde'},{em:'🟡',n:'amarillo'},{em:'🟣',n:'morado'},{em:'🟠',n:'naranja'}];
  const SHAPES=[{em:'⬜',n:'cuadrado'},{em:'⭕',n:'círculo'},{em:'🔺',n:'triángulo'},{em:'💠',n:'rombo'},{em:'⬟',n:'pentágono'}];
  function mkPattern(pool,patType){const a=pool[0],b=pool[1],c=pool[2]||pool[0];
    let seq;if(patType==='AB')seq=[a,b,a,b,a,b];else if(patType==='AAB')seq=[a,a,b,a,a,b];else if(patType==='ABC')seq=[a,b,c,a,b,c];else seq=[a,a,b,b,a,a,b,b];
    const shown=seq.slice(0,4);const answer=seq[4];
    const optsPool=sh([...pool]).filter(x=>x.em!==answer.em).slice(0,3);optsPool.push(answer);
    return{q:'¿Qué sigue?',seq:shown.map(x=>x.em),ans:answer.em,ansText:answer.n,opts:sh(optsPool).map(x=>x.em)}}
  const pats=['AB','AAB','ABC','AABB'];
  if(difficulty==='easy'){for(let i=0;i<12;i++){const pool=sh([...COLORS]).slice(0,3);items.push({ty:'razona',mode:'pattern',data:mkPattern(pool,pats[i%4]),id:'rz_pat_e'+i})}}
  else if(difficulty==='medium'){for(let i=0;i<12;i++){const pool=sh([...SHAPES]).slice(0,3);items.push({ty:'razona',mode:'pattern',data:mkPattern(pool,pats[i%4]),id:'rz_pat_m'+i})}}
  else{for(let i=0;i<12;i++){const cs=sh([...COLORS]).slice(0,3);const ss2=sh([...SHAPES]).slice(0,3);const combined=cs.map((c,j)=>({em:c.em+ss2[j%ss2.length].em,n:c.n+' '+ss2[j%ss2.length].n}));items.push({ty:'razona',mode:'pattern',data:mkPattern(combined,pats[i%4]),id:'rz_pat_h'+i})}}
  return sh(items)}
// Generate number series exercises
function genNumberSeries(){const sh=a=>[...a].sort(()=>Math.random()-.5);const items=[];
  const steps=[1,2,5,10];
  for(let s=0;s<steps.length;s++){const step=steps[s];
    for(let r=0;r<3;r++){const start=step===1?Math.floor(Math.random()*10)+1:step===2?Math.floor(Math.random()*5)*2:step===5?Math.floor(Math.random()*4)*5:Math.floor(Math.random()*5)*10;
      const seq=[];for(let i=0;i<6;i++)seq.push(start+step*i);
      const hideIdx=2+Math.floor(Math.random()*3); // hide position 2,3, or 4
      const ans=seq[hideIdx];const shown=seq.slice(0,5).map((n,i)=>i===hideIdx?'?':String(n));
      const wrongSet=new Set([ans+step,ans-step,ans+1,ans+2,ans-2,ans+step*2].filter(w=>w!==ans&&w>=0));const wrong=[...wrongSet];
      const opts=sh([ans,...wrong.slice(0,3)]);
      items.push({ty:'razona',mode:'number_series',data:{q:'¿Qué número falta?',seq:shown,ans:String(ans),step,opts:opts.map(String)},id:'rz_ns_'+s+'_'+r})}}
  return sh(items)}
// Generate compare quantities exercises
function genCompare(){const sh=a=>[...a].sort(()=>Math.random()-.5);const items=[];
  const emojis=['🍎','🐥','🚗','⭐','🌸','🐟','🦋','🎈'];
  for(let i=0;i<15;i++){const em=emojis[Math.floor(Math.random()*emojis.length)];
    const a=1+Math.floor(Math.random()*9),b=1+Math.floor(Math.random()*9);
    const ans=a>b?'>':a<b?'<':'=';
    items.push({ty:'razona',mode:'compare',data:{a,b,emoji:em,ans,q:`¿${a} ${em} o ${b} ${em}?`},id:'rz_cmp_'+i})}
  return sh(items)}
// Rutinas en 3 niveles. Formato narrativo "Ayuda a tu amigo a…": el niño no
// necesariamente hace estas cosas, pero aprende la secuencia lógica leyendo
// frases completas. Ese es el doble objetivo: lógica + lectura fluida.
const ROUTINES_BASICO = [
  {title:'Ayuda a tu amigo a ducharse',steps:['🚿 Métete en la ducha y abre el grifo del agua','🧴 Échate gel en las manos y frótate el cuerpo','💦 Aclárate con agua hasta que no quede jabón','🧻 Sécate bien con la toalla'],oral:'Para ducharse, tu amigo se mete en la ducha, se enjabona, se aclara y se seca'},
  {title:'Ayuda a tu amigo a lavarse las manos',steps:['🚰 Abre el grifo y moja tus manos','🧼 Echa jabón en las manos mojadas','🤲 Frota las manos por delante y por detrás','🧻 Aclara con agua y sécate con la toalla'],oral:'Tu amigo abre el grifo, se enjabona, se aclara y se seca las manos'},
  {title:'Ayuda a tu amigo a cepillarse los dientes',steps:['🪥 Coge el cepillo de dientes','🧴 Échale un poquito de pasta encima','😁 Cepilla los dientes arriba y abajo','💧 Enjuaga la boca con un vaso de agua'],oral:'Tu amigo coge el cepillo, le echa pasta, cepilla y se enjuaga'},
  {title:'Ayuda a tu amigo a vestirse',steps:['👕 Primero ponte la camiseta por la cabeza','👖 Después ponte los pantalones','🧦 Ponte los calcetines','👟 Por último, ponte las zapatillas'],oral:'Tu amigo se pone la camiseta, el pantalón, los calcetines y las zapatillas'},
  {title:'Ayuda a tu amigo a desayunar',steps:['🥣 Coge un bol grande de la cocina','🥛 Echa leche dentro del bol','🥣 Añade los cereales y mezcla con la cuchara','🥄 Cómete el desayuno sin prisa'],oral:'Tu amigo coge el bol, echa leche, añade cereales y desayuna'},
  {title:'Ayuda a tu amigo a comer en la mesa',steps:['🪑 Siéntate en la silla bien recto','🍴 Coge el tenedor y el cuchillo','🍽️ Come despacio y tranquilo','🧻 Límpiate la boca con la servilleta'],oral:'Tu amigo se sienta, coge los cubiertos, come despacio y se limpia la boca'},
  {title:'Ayuda a tu amigo a irse a dormir',steps:['🪥 Lávate bien los dientes','👕 Ponte el pijama','🛏️ Métete en la cama y tápate','😴 Cierra los ojos y duérmete'],oral:'Tu amigo se lava los dientes, se pone el pijama, se acuesta y se duerme'},
  {title:'Ayuda a tu amigo a salir al colegio',steps:['👕 Vístete con la ropa del cole','🥣 Desayuna bien antes de salir','🎒 Coge la mochila con todas tus cosas','🚌 Sal de casa para llegar puntual'],oral:'Tu amigo se viste, desayuna, coge la mochila y va al cole'},
  {title:'Ayuda a tu amigo al volver del colegio',steps:['🚌 Bájate del autobús con cuidado','🏠 Entra en casa y saluda','🍎 Merienda algo rico','📚 Haz los deberes que te han mandado'],oral:'Tu amigo baja del bus, saluda en casa, merienda y hace los deberes'},
  {title:'Ayuda a tu amigo a usar el baño',steps:['🚽 Entra en el baño y cierra la puerta','👖 Bájate el pantalón y siéntate','🧻 Cuando termines, límpiate con papel','🚰 Sal y lávate las manos con jabón'],oral:'Tu amigo entra al baño, se limpia con papel y se lava las manos'},
  {title:'Ayuda a tu amigo a beber un vaso de agua',steps:['🥛 Coge un vaso limpio del armario','🚰 Lléna el vaso con agua del grifo','😋 Bébete el agua poco a poco','🧽 Lava el vaso cuando termines'],oral:'Tu amigo coge un vaso, lo llena, bebe y lo lava'},
  {title:'Ayuda a tu amigo a ponerse el abrigo',steps:['🧥 Coge el abrigo del perchero','💪 Mete un brazo por la primera manga','💪 Mete el otro brazo por la otra manga','🔘 Abrocha los botones para no pasar frío'],oral:'Tu amigo coge el abrigo, mete los brazos y abrocha los botones'},
  {title:'Ayuda a tu amigo a recoger los juguetes',steps:['🧸 Recoge los juguetes del suelo','📦 Mételos todos dentro de la caja','🚪 Cierra la tapa de la caja','✅ La habitación queda ordenada'],oral:'Tu amigo recoge, guarda en la caja y todo queda ordenado'},
  {title:'Ayuda a tu amigo a hacer la cama',steps:['🛏️ Estira bien la sábana','🛌 Pon la manta por encima','🪶 Coloca la almohada en su sitio','✨ La cama queda preparada'],oral:'Tu amigo estira la sábana, pone la manta y la almohada'},
  {title:'Ayuda a tu amigo a cruzar la calle',steps:['🚦 Mira el semáforo de los peatones','🔴 Si está en rojo, espera quieto','🟢 Cuando se ponga en verde, cruza','🚶 Llega al otro lado sin correr'],oral:'Tu amigo mira el semáforo, espera al verde y cruza sin correr'},
  {title:'Ayuda a tu amigo a encender la luz',steps:['🚪 Entra en la habitación','👀 Busca el interruptor junto a la puerta','👆 Pulsa el interruptor hacia arriba','💡 La luz se enciende'],oral:'Tu amigo entra, busca el interruptor, lo pulsa y se hace la luz'},
  {title:'Ayuda a tu amigo a usar el móvil',steps:['📱 Coge el móvil de la mesa','🔓 Desbloquéalo con tu clave','🏠 Busca la aplicación que quieres abrir','👆 Toca el icono para entrar'],oral:'Tu amigo coge el móvil, pone la clave, busca la app y la abre'},
  {title:'Ayuda a tu amigo a lavarse la cara',steps:['🚰 Abre el grifo del agua','💧 Mójate las manos y la cara','🫧 Frótate la cara suavemente con agua','🧻 Sécate con una toalla limpia'],oral:'Tu amigo se moja la cara, se la frota y se seca con la toalla'},
  {title:'Ayuda a tu amigo a preparar la mochila',steps:['📚 Mete los libros del cole','✏️ Guarda el estuche con los lápices','🍎 Añade la merienda para el recreo','🎒 Cierra bien la mochila'],oral:'Tu amigo mete los libros, el estuche, la merienda y cierra la mochila'},
  {title:'Ayuda a tu amigo al llegar a un sitio',steps:['🚪 Abre la puerta y entra despacio','🙋 Saluda a las personas que haya','🪑 Busca un sitio y siéntate','👂 Escucha lo que te digan'],oral:'Tu amigo entra, saluda, se sienta y escucha con atención'},
];
const ROUTINES_AVANZADO = [
  {title:'Ayuda a tu amigo con la rutina de la mañana',steps:['⏰ Al sonar el despertador, sal de la cama','🚿 Dúchate y aséate bien','👕 Vístete con la ropa del día','🥣 Desayuna sentado en la mesa','🎒 Coge la mochila y sal para el cole'],oral:'Tu amigo se despierta, se ducha, se viste, desayuna y va al cole'},
  {title:'Ayuda a tu amigo con la rutina de antes de dormir',steps:['🍽️ Cena con tranquilidad','🪥 Lávate bien los dientes','👕 Ponte el pijama limpio','📖 Lee un cuento un rato','🛏️ Métete en la cama y apaga la luz'],oral:'Tu amigo cena, se lava los dientes, se pone el pijama, lee y se acuesta'},
  {title:'Ayuda a tu amigo a preparar un bocadillo',steps:['🍞 Coge una barra de pan de la panera','🔪 Córtala por la mitad con un cuchillo','🧀 Pon queso dentro del pan','🥬 Añade lechuga si te gusta','🍴 Cierra el bocadillo y cómelo'],oral:'Tu amigo coge pan, lo corta, pone queso y lechuga y se lo come'},
  {title:'Ayuda a tu amigo a poner la mesa para cenar',steps:['🧻 Pon el mantel sobre la mesa','🍽️ Coloca un plato en cada sitio','🍴 Pon un tenedor y un cuchillo al lado de cada plato','🥛 Coloca los vasos para el agua','🪑 Avisa a todos para cenar'],oral:'Tu amigo pone el mantel, los platos, los cubiertos, los vasos y avisa'},
  {title:'Ayuda a tu amigo a ir al parque',steps:['👟 Ponte las zapatillas cómodas','🧴 Échate crema del sol','🚶 Ve al parque andando con cuidado','⚽ Juega con tus amigos un rato','🏠 Vuelve a casa antes de que oscurezca'],oral:'Tu amigo se calza, se pone crema, va al parque, juega y vuelve a casa'},
  {title:'Ayuda a tu amigo a coger el autobús',steps:['🚏 Ve a la parada del autobús','⏳ Espera en la cola tranquilo','🚌 Cuando llegue, súbete al autobús','💳 Paga con tu tarjeta o con dinero','💺 Siéntate en un asiento libre'],oral:'Tu amigo va a la parada, espera, sube, paga y se sienta'},
  {title:'Ayuda a tu amigo a comprar el pan',steps:['💰 Coge dinero suficiente de casa','🚶 Ve andando hasta la panadería','🙋 Pide amablemente una barra de pan','💶 Paga lo que cueste','🏠 Vuelve a casa con el pan'],oral:'Tu amigo coge dinero, va a la panadería, pide el pan, paga y vuelve'},
  {title:'Ayuda a tu amigo a hacer los deberes',steps:['📚 Saca los libros y cuadernos','✏️ Prepara el estuche con los lápices','🪑 Siéntate en un sitio tranquilo','✍️ Haz los ejercicios con calma','✅ Al terminar, guarda todo en la mochila'],oral:'Tu amigo saca los libros, se sienta, hace los ejercicios y guarda todo'},
  {title:'Ayuda a tu amigo a preparar unos huevos fritos',steps:['🥚 Saca los huevos de la nevera','🍳 Pon aceite en la sartén','🔥 Enciende el fuego a media potencia','🥚 Echa el huevo con cuidado en la sartén','🍽️ Sírvelo en un plato cuando esté hecho'],oral:'Tu amigo pone aceite, enciende el fuego, echa el huevo y lo sirve'},
  {title:'Ayuda a tu amigo a lavar los platos',steps:['💧 Abre el grifo con agua caliente','🧴 Echa lavavajillas en la esponja','🧽 Frota bien cada plato','💦 Aclara con agua para quitar el jabón','🧻 Deja los platos en el escurridor'],oral:'Tu amigo enjabona, frota, aclara y deja secar los platos'},
  {title:'Ayuda a tu amigo a ordenar su habitación',steps:['🛏️ Primero haz la cama','🧸 Recoge los juguetes del suelo','👕 Guarda la ropa en el armario','🗑️ Tira la basura a la papelera','✨ La habitación queda limpia y ordenada'],oral:'Tu amigo hace la cama, recoge juguetes, guarda ropa y tira basura'},
  {title:'Ayuda a tu amigo a poner una lavadora',steps:['🧺 Mete la ropa sucia en el tambor','🧴 Echa detergente en su compartimento','🔘 Elige el programa adecuado','▶️ Pulsa el botón de empezar','⏳ Espera hasta que la lavadora termine'],oral:'Tu amigo mete ropa, echa jabón, elige programa y pulsa empezar'},
  {title:'Ayuda a tu amigo a regar las plantas',steps:['🪣 Coge la regadera','🚰 Llénala de agua en el grifo','🌿 Llévala hasta las plantas','💧 Echa agua en la tierra sin mojar las hojas','✅ Deja la regadera en su sitio'],oral:'Tu amigo coge la regadera, la llena, riega la tierra y la guarda'},
  {title:'Ayuda a tu amigo a sacar al perro de paseo',steps:['🦮 Coge la correa del colgador','🐕 Pon la correa en el collar del perro','🚪 Sal de casa con cuidado','🚶 Pasea por la acera un rato','🏠 Vuelve a casa cuando el perro haya hecho sus cosas'],oral:'Tu amigo coge la correa, la pone al perro, sale, pasea y vuelve'},
  {title:'Ayuda a tu amigo a curarse un corte pequeño',steps:['👀 Mira la herida con calma','🚰 Lávala con agua del grifo','🧴 Pon desinfectante con un algodón','🩹 Cubre la herida con una tirita','✅ Avisa a un adulto por si acaso'],oral:'Tu amigo mira, lava, desinfecta, pone tirita y avisa a un adulto'},
  {title:'Ayuda a tu amigo a reciclar la basura',steps:['🗑️ Junta toda la basura de casa','🟨 Separa los envases de plástico','🟦 Separa el papel y el cartón','🟩 Separa los botes de vidrio','🚮 Tira cada cosa al contenedor correcto'],oral:'Tu amigo separa plástico, papel y vidrio, y los tira a cada contenedor'},
  {title:'Ayuda a tu amigo a montar en bici',steps:['🪖 Ponte el casco y ajústalo bien','🚲 Saca la bici del trastero','🚴 Súbete con cuidado','🛣️ Pedalea mirando hacia delante','🅿️ Aparca la bici al llegar'],oral:'Tu amigo se pone el casco, coge la bici, pedalea y la aparca'},
  {title:'Ayuda a tu amigo a atender en clase',steps:['🪑 Siéntate en tu sitio','🤫 Guarda silencio cuando el profesor habla','👂 Escucha con atención','✋ Levanta la mano si quieres preguntar','✍️ Copia lo que diga el profesor en tu cuaderno'],oral:'Tu amigo se sienta, escucha, levanta la mano y copia en el cuaderno'},
  {title:'Ayuda a tu amigo a comer en un restaurante',steps:['🚶 Entra y saluda al camarero','🪑 Siéntate en la mesa que te indiquen','📋 Lee la carta con calma','🍽️ Elige tu plato y pídelo','💰 Al terminar, pide la cuenta y paga'],oral:'Tu amigo entra, se sienta, lee la carta, pide y paga la cuenta'},
  {title:'Ayuda a tu amigo a ir al cumpleaños de un amigo',steps:['🎁 Prepara un regalo envuelto','🎂 Llega puntual a la fiesta','🎈 Felicita al cumpleañero con un abrazo','🎵 Canta el cumpleaños feliz con todos','🍰 Come tarta y disfruta de la fiesta'],oral:'Tu amigo lleva regalo, felicita, canta cumpleaños feliz y come tarta'},
];
const ROUTINES_MASTER = [
  {title:'Ayuda a tu amigo a ir al médico',steps:['📞 Llama para pedir cita','🚗 El día de la cita, ve al centro de salud','🪑 Espera tu turno en la sala','👨‍⚕️ Cuando te llamen, entra a la consulta','💊 Escucha lo que te dice el médico','🏠 Recoge la receta y vuelve a casa'],oral:'Tu amigo pide cita, espera, entra al médico, recoge la receta y vuelve'},
  {title:'Ayuda a tu amigo a ir al supermercado',steps:['📝 Haz una lista con lo que necesitas','🚶 Ve hasta el supermercado','🛒 Coge un carro en la entrada','🛍️ Busca cada producto de la lista','💰 Pasa por caja y paga','🏠 Lleva la compra a casa'],oral:'Tu amigo hace la lista, busca los productos, paga y lleva la compra a casa'},
  {title:'Ayuda a tu amigo a ir al cine',steps:['🎟️ Compra la entrada en taquilla o por internet','🍿 Si quieres, compra palomitas','🪑 Busca tu número de asiento','🎬 Disfruta de la película en silencio','🧹 Tira la basura al salir','🏠 Vuelve a casa'],oral:'Tu amigo compra entrada, busca asiento, ve la película y vuelve a casa'},
  {title:'Ayuda a tu amigo a coger un tren',steps:['🎫 Compra el billete en la estación','🚉 Mira en qué andén sale tu tren','⏳ Espera en el andén sin pasar la línea amarilla','🚆 Cuando llegue, sube por una puerta','💺 Busca tu asiento por el número','🛬 Bájate en la parada que te toca'],oral:'Tu amigo compra billete, espera en el andén, sube al tren y se baja'},
  {title:'Ayuda a tu amigo a ir a la biblioteca',steps:['🎒 Coge una bolsa o mochila','📚 Busca el libro que quieras en las estanterías','🪪 Llévalo al mostrador con tu carnet','📖 Léelo en casa con calma','📚 Devuélvelo antes de la fecha','🏠 Puedes coger otro en la próxima visita'],oral:'Tu amigo busca libro, lo pide con carnet, lo lee y lo devuelve'},
  {title:'Ayuda a tu amigo si se pierde en la calle',steps:['😌 Si te pierdes, no te pongas nervioso','👀 Busca a alguien de confianza cerca','🙋 Acércate con educación','🗣️ Explica qué te pasa y quién es tu familia','👂 Escucha lo que te digan','🙏 Da las gracias cuando te ayuden'],oral:'Tu amigo se calma, busca ayuda, explica qué pasa y da las gracias'},
  {title:'Ayuda a tu amigo a organizar una quedada',steps:['📱 Coge el móvil y abre el grupo de amigos','💬 Propón un plan divertido','📅 Poneros de acuerdo en el día y la hora','✅ Confirma con todos antes','⏰ Llega puntual al sitio','🤗 Disfruta del rato juntos'],oral:'Tu amigo propone plan, queda con amigos, llega puntual y disfruta'},
  {title:'Ayuda a tu amigo a viajar en avión',steps:['🧳 Prepara la maleta con lo necesario','🛂 Ve al aeropuerto con tiempo','🎫 Enseña el billete y el DNI en el mostrador','🎒 Pasa el control de seguridad','✈️ Embarca cuando te llamen','🛬 Al llegar, recoge la maleta'],oral:'Tu amigo hace la maleta, va al aeropuerto, embarca y recoge la maleta'},
  {title:'Ayuda a tu amigo a pagar con tarjeta',steps:['🛒 Coge lo que quieres comprar','💳 Saca tu tarjeta al llegar a caja','📟 Acércala al datáfono','🔢 Marca el pin si te lo pide','✅ Espera a que salga pago aceptado','🧾 Guarda el recibo por si acaso'],oral:'Tu amigo saca la tarjeta, la acerca al datáfono, pone el pin y coge el recibo'},
  {title:'Ayuda a tu amigo a hacer un trámite en el banco',steps:['🏦 Entra en el banco','🎫 Coge número en la máquina','🪑 Espera a que te llamen','🙋 Explica al empleado lo que necesitas','✍️ Firma los papeles con calma','👋 Despídete y sal'],oral:'Tu amigo entra al banco, coge número, explica, firma y se despide'},
  {title:'Ayuda a tu amigo a buscar trabajo',steps:['📝 Prepara bien tu currículum','🔍 Busca ofertas en internet','📧 Envía tu currículum a cada oferta','📞 Si te llaman, apunta la hora de la entrevista','🤝 Ve a la entrevista bien arreglado','⏳ Espera unos días a tener respuesta'],oral:'Tu amigo prepara currículum, busca ofertas, lo envía y va a la entrevista'},
  {title:'Ayuda a tu amigo a organizar una fiesta',steps:['📅 Elige el día y la hora','📋 Haz la lista de invitados','📱 Manda las invitaciones por móvil','🛒 Compra comida y bebida','🎈 Decora la casa','🤗 Recibe a los invitados con una sonrisa'],oral:'Tu amigo elige día, invita, compra comida, decora y recibe a los invitados'},
  {title:'Ayuda a tu amigo a ir a un concierto',steps:['🎫 Compra la entrada con tiempo','🚆 Llega al recinto una hora antes','🔒 Deja la mochila en la taquilla si hace falta','🎤 Disfruta de la música','👏 Aplaude al final de cada canción','🚆 Vuelve a casa con cuidado'],oral:'Tu amigo compra entrada, llega con tiempo, escucha y aplaude'},
  {title:'Ayuda a tu amigo a mudarse de casa',steps:['📦 Guarda tus cosas en cajas etiquetadas','🚛 Espera a que llegue la mudanza','🚚 Ayuda a cargar las cajas en el camión','🏠 Ve a la casa nueva','📦 Baja las cajas con cuidado','🛋️ Coloca cada cosa en su sitio'],oral:'Tu amigo prepara cajas, carga, llega a la casa nueva y coloca todo'},
  {title:'Ayuda a tu amigo a ir al gimnasio',steps:['🎒 Prepara la bolsa con ropa de deporte','🚶 Ve caminando o en autobús al gimnasio','🪪 Enseña la tarjeta de socio en recepción','💪 Haz los ejercicios que toquen','🚿 Dúchate al terminar','🏠 Vuelve a casa a descansar'],oral:'Tu amigo prepara bolsa, hace ejercicio, se ducha y vuelve a casa'},
  {title:'Ayuda a tu amigo a cocinar una comida',steps:['📋 Elige una receta que te guste','🛒 Compra los ingredientes que necesites','🧺 Prepara cada cosa en la encimera','🔥 Cocina siguiendo los pasos de la receta','🍽️ Sirve la comida en un plato','🧽 Friega los cacharros al terminar'],oral:'Tu amigo elige receta, compra, cocina, sirve y friega al final'},
  {title:'Ayuda a tu amigo a votar en unas elecciones',steps:['💌 Espera la carta del censo en tu buzón','🪪 El día de las elecciones, coge tu DNI','🚶 Ve al colegio electoral que te toca','📄 Elige la papeleta del partido que prefieras','📮 Métela en el sobre y ciérralo','🗳️ Entrega el sobre en la urna'],oral:'Tu amigo va con su DNI, elige papeleta, la mete en el sobre y la entrega'},
  {title:'Ayuda a tu amigo a cuidar a alguien enfermo',steps:['🌡️ Tómale la temperatura','💊 Dale la medicación que le haya dicho el médico','🥣 Prepárale algo ligero de comer','💧 Ofrécele agua a menudo','🛏️ Ayúdale a descansar tranquilo','📞 Llama al médico si ves que empeora'],oral:'Tu amigo le toma temperatura, le da medicación y agua, le ayuda a descansar'},
  {title:'Ayuda a tu amigo a ir de vacaciones',steps:['📅 Elige las fechas con antelación','🏨 Reserva el hotel o apartamento','🧳 Haz la maleta unos días antes','🚗 Viaja con tranquilidad al destino','🏖️ Disfruta cada día de las vacaciones','🏠 Vuelve a casa descansado'],oral:'Tu amigo elige fechas, reserva, hace la maleta, disfruta y vuelve descansado'},
  {title:'Ayuda a tu amigo a ir a una entrevista de trabajo',steps:['🧥 Ponte ropa adecuada','📄 Lleva una copia de tu currículum','🚶 Llega al sitio diez minutos antes','🤝 Saluda con educación al entrevistador','🗣️ Responde a las preguntas con calma','👋 Despídete dando las gracias'],oral:'Tu amigo se viste bien, llega puntual, saluda, responde y se despide'},
];
function genSequences(tier){
  const sh=a=>[...a].sort(()=>Math.random()-.5);
  const pool = tier==='master' ? ROUTINES_MASTER : tier==='avanzado' ? ROUTINES_AVANZADO : ROUTINES_BASICO;
  return sh(pool.map((seq,si)=>({
    ty:'razona', mode:'sequence',
    data:{title:seq.title, steps:[...seq.steps], oral:seq.oral},
    id:'rz_seq_'+tier+'_'+si,
  })));
}
// Generate anterior/posterior exercises
function genAnteriorPosterior(){const sh=a=>[...a].sort(()=>Math.random()-.5);const items=[];
  for(let i=0;i<15;i++){const n=2+Math.floor(Math.random()*18); // 2-19
    const mode=Math.random()>.5?'anterior':'posterior';
    const ans=mode==='anterior'?n-1:n+1;
    const wrong=[ans+1,ans-1,ans+2,n].filter(w=>w!==ans&&w>=0);
    const opts=sh([ans,...new Set(wrong)].slice(0,4));
    items.push({ty:'razona',mode:'anterior_posterior',data:{n,questionMode:mode,ans:String(ans),q:mode==='anterior'?`¿Qué número va ANTES del ${n}?`:`¿Qué número va DESPUÉS del ${n}?`,opts:opts.map(String)},id:'rz_ap_'+i})}
  return sh(items)}
// Generate temperature/thermometer exercises
function genTemperature(){const sh=a=>[...a].sort(()=>Math.random()-.5);const items=[];
  const temps=[
    {t:-5,desc:'Hace mucho frío, bajo cero',emoji:'🥶',cat:'frío'},
    {t:-2,desc:'Bajo cero, hielo',emoji:'❄️',cat:'frío'},
    {t:0,desc:'Cero grados, puede helar',emoji:'❄️',cat:'frío'},
    {t:3,desc:'Hace frío',emoji:'🧥',cat:'frío'},
    {t:8,desc:'Hace fresquito',emoji:'🧣',cat:'fresco'},
    {t:15,desc:'Está templado',emoji:'👕',cat:'templado'},
    {t:20,desc:'Hace buen tiempo',emoji:'😊',cat:'templado'},
    {t:25,desc:'Hace calor',emoji:'☀️',cat:'calor'},
    {t:30,desc:'Hace mucho calor',emoji:'🥵',cat:'calor'},
    {t:35,desc:'Hace muchísimo calor',emoji:'🔥',cat:'calor'},
    {t:40,desc:'Ola de calor',emoji:'🌡️',cat:'calor'},
  ];
  temps.forEach((tmp,i)=>{
    // "¿Qué ropa me pongo?" or "¿Hace frío o calor?"
    const isCold=tmp.t<=5;const isHot=tmp.t>=25;
    const q=`El termómetro marca ${tmp.t}°. ¿Cómo está el tiempo?`;
    const correct=tmp.desc;
    const wrongPool=temps.filter(t=>t.cat!==tmp.cat).map(t=>t.desc);
    const wrong=sh(wrongPool).slice(0,3);
    const opts=sh([correct,...wrong]).slice(0,4);
    // Short oral phrase for child to repeat (functional, not long description)
    const shortOral=tmp.t<0?'Hace mucho frío':tmp.t<=5?'Hace frío':tmp.t<=15?'Está fresquito':tmp.t<=25?'Hace buen tiempo':'Hace calor';
    items.push({ty:'razona',mode:'temperature',data:{temp:tmp.t,desc:tmp.desc,emoji:tmp.emoji,q,ans:correct,opts,oral:shortOral},id:'rz_temp_'+i});
  });
  return sh(items)}
export function genRazona(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const items=[];const sh=a=>[...a].sort(()=>Math.random()-.5);
  if(lv===1){RAZONA_SPATIAL.forEach((s,i)=>items.push({ty:'razona',mode:'spatial',data:s,id:'rz_sp_'+i}));return sh(items)}
  if(lv===2){RAZONA_DRAG.forEach((s,i)=>items.push({ty:'razona',mode:'spatial_drag',data:s,id:'rz_drg_'+i}));return sh(items)}
  if(lv===3){RAZONA_CLASSIFY.forEach((s,i)=>items.push({ty:'razona',mode:'classify',data:s,id:'rz_cls_'+i}));return sh(items)}
  if(lv===4){RAZONA_CAUSE.forEach((s,i)=>items.push({ty:'razona',mode:'cause',data:s,id:'rz_cau_'+i}));return sh(items)}
  if(lv===5){RAZONA_EMOTIONS.forEach((s,i)=>items.push({ty:'razona',mode:'emotion',data:s,id:'rz_emo_'+i}));return sh(items)}
  if(lv===6){return genPatterns('easy')}
  if(lv===7){return genPatterns('medium')}
  if(lv===8){return genPatterns('hard')}
  if(lv===9){return genNumberSeries()}
  if(lv===10){return genCompare()}
  if(lv===11){return genSequences('basico')}
  if(lv===14){return genSequences('avanzado')}
  if(lv===15){return genSequences('master')}
  if(lv===12){return genAnteriorPosterior()}
  if(lv===13){return genTemperature()}
  RAZONA_EMOTIONS.forEach((s,i)=>items.push({ty:'razona',mode:'emotion',data:s,id:'rz_emo_'+i}));return sh(items)}

export function SceneSVG({scene,obj,pos,showObj=true,dropZones=null,highlightZone=null}){const w=360,h=280;
  const objEmojis={libro:'📕',mochila:'🎒',móvil:'📱',gafas:'👓',zapatillas:'👟',llaves:'🔑',estuche:'✏️',balón:'⚽'};
  const objEm=objEmojis[obj]||'📦';
  const posMap={encima:{ox:0,oy:-50},debajo:{ox:0,oy:75},dentro:{ox:0,oy:5},'al lado':{ox:110,oy:10},al_lado:{ox:110,oy:10},fuera:{ox:110,oy:10}};
  const off=posMap[pos]||{ox:0,oy:0};
  // Furniture renderers — centered in 360x280 viewBox, recognizable shapes
  function TableSVG(){return <g transform="translate(55,40)">
    {/* Simple clear table — front view with slight 3D */}
    {/* Table top — thick plank */}
    <rect x={10} y={60} width={240} height={16} rx={4} fill="#B5651D" stroke="#6D4C2E" strokeWidth={2.5}/>
    {/* Top surface highlight */}
    <rect x={12} y={56} width={236} height={8} rx={3} fill="#C8894C" stroke="#6D4C2E" strokeWidth={1.5}/>
    {/* 4 legs — clearly visible, with space between them for "debajo" */}
    <rect x={20} y={76} width={14} height={130} rx={3} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1.5}/>
    <rect x={226} y={76} width={14} height={130} rx={3} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1.5}/>
    {/* Back legs slightly visible behind */}
    <rect x={28} y={76} width={10} height={126} rx={3} fill="#6D3612" stroke="#5A2E10" strokeWidth={1} opacity={0.6}/>
    <rect x={222} y={76} width={10} height={126} rx={3} fill="#6D3612" stroke="#5A2E10" strokeWidth={1} opacity={0.6}/>
    {/* Stretcher bar between front legs */}
    <rect x={34} y={160} width={192} height={8} rx={3} fill="#7A4420" stroke="#5A3218" strokeWidth={1}/>
  </g>}
  function ChairSVG(){return <g transform="translate(90,15)">
    {/* Side view chair — clear profile showing seat, legs, backrest */}
    {/* Back leg (goes up to become backrest, slightly angled) */}
    <path d="M30,0 L42,0 L50,230 L38,230 Z" fill="#8B4513" stroke="#6D4C2E" strokeWidth={2}/>
    {/* Front leg (straight vertical) */}
    <path d="M140,115 L152,115 L152,230 L140,230 Z" fill="#A0522D" stroke="#6D4C2E" strokeWidth={2}/>
    {/* Backrest top curve — rounded */}
    <path d="M28,0 L44,0 L46,4 L30,4 Z" fill="#B5651D" stroke="#6D4C2E" strokeWidth={1.5}/>
    <ellipse cx={37} cy={2} rx={10} ry={6} fill="#B5651D" stroke="#6D4C2E" strokeWidth={2}/>
    {/* Backrest slats (horizontal) */}
    <rect x={32} y={30} width={16} height={70} rx={6} fill="#C49A6C" stroke="#8B5E3C" strokeWidth={2}/>
    <line x1={32} y1={50} x2={48} y2={50} stroke="#8B5E3C" strokeWidth={1.5}/>
    <line x1={32} y1={70} x2={48} y2={70} stroke="#8B5E3C" strokeWidth={1.5}/>
    {/* SEAT — thick horizontal plank, clearly flat surface */}
    <rect x={20} y={108} width={150} height={18} rx={5} fill="#B5651D" stroke="#6D4C2E" strokeWidth={2.5}/>
    {/* Seat edge shadow for depth */}
    <rect x={22} y={126} width={146} height={5} rx={2} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1}/>
    {/* Stretcher bar between legs */}
    <rect x={44} y={185} width={96} height={8} rx={3} fill="#7A4420" stroke="#5A3218" strokeWidth={1.5}/>
    {/* Second back leg hint (behind, for depth) */}
    <path d="M22,5 L28,5 L36,230 L30,230 Z" fill="#6D3612" stroke="#5A2E10" strokeWidth={1}/>
    {/* Second front leg hint */}
    <rect x={148} y={118} width={8} height={112} rx={3} fill="#7A4420" stroke="#5A3218" strokeWidth={1}/>
  </g>}
  function ShelfSVG(){return <g transform="translate(60,50)">
    {/* 3 shelves — positioned to leave room for encima (above) and debajo (below) */}
    <rect x={0} y={0} width={240} height={10} rx={3} fill="#A0522D" stroke="#6D4C2E" strokeWidth={2.5}/>
    <rect x={0} y={50} width={240} height={10} rx={3} fill="#A0522D" stroke="#6D4C2E" strokeWidth={2.5}/>
    <rect x={0} y={100} width={240} height={10} rx={3} fill="#A0522D" stroke="#6D4C2E" strokeWidth={2.5}/>
    {/* Side panels */}
    <rect x={0} y={0} width={10} height={110} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1.5}/>
    <rect x={230} y={0} width={10} height={110} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1.5}/>
    {/* Some items on shelves for context */}
    <rect x={20} y={60} width={30} height={38} rx={2} fill="#5B8C5A" opacity={0.4}/>{/* book */}
    <rect x={55} y={66} width={25} height={32} rx={2} fill="#4A7AB5" opacity={0.4}/>{/* book */}
    <circle cx={200} cy={82} r={13} fill="#D4A76A" opacity={0.3}/>{/* vase */}
  </g>}
  function BoxSVG(){return <g transform="translate(90,55)">
    {/* Open box — 3D with visible interior */}
    {/* Interior (dark) */}
    <rect x={8} y={35} width={148} height={100} rx={3} fill="#8B6F47"/>
    {/* Front face */}
    <rect x={0} y={35} width={160} height={105} rx={4} fill="#C49A6C" stroke="#8B7355" strokeWidth={2.5}/>
    {/* Right side */}
    <path d="M160,35 L180,15 L180,120 L160,140" fill="#A0522D" stroke="#8B7355" strokeWidth={1.5}/>
    {/* Back wall inside (visible because box is open) */}
    <path d="M8,35 L28,15 L180,15 L160,35 Z" fill="#B8956A" stroke="#8B7355" strokeWidth={1.5}/>
    {/* Interior shadow */}
    <rect x={10} y={38} width={146} height={20} rx={2} fill="#7A5F3A" opacity={0.4}/>
    {/* Open flaps */}
    <path d="M0,35 L-12,10 L60,5 L80,30 Z" fill="#D2B48C" stroke="#8B7355" strokeWidth={1.5}/>{/* left flap */}
    <path d="M80,30 L80,5 L180,0 L160,35 Z" fill="#CDAA73" stroke="#8B7355" strokeWidth={1.5}/>{/* right flap */}
  </g>}
  function BackpackSVG(){return <g transform="translate(110,45)">
    <rect x={14} y={28} width={110} height={130} rx={22} fill="#2980B9" stroke="#1F6DA0" strokeWidth={2.5}/>
    <rect x={30} y={48} width={76} height={44} rx={10} fill="#F39C12" stroke="#E67E22" strokeWidth={2}/>
    <path d="M38,28 Q70,4 100,28" fill="none" stroke="#333" strokeWidth={6} strokeLinecap="round"/>
    <rect x={48} y={108} width={38} height={14} rx={4} fill="#1F6DA0" stroke="#155980" strokeWidth={1.5}/>
    {/* Zipper detail */}
    <line x1={52} y1={115} x2={82} y2={115} stroke="#999" strokeWidth={1.5} strokeDasharray="3 2"/>
  </g>}
  function DoorSVG(){return <g transform="translate(115,30)">
    {/* Door frame */}
    <rect x={-10} y={-6} width={130} height={210} rx={4} fill="#6D4C2E" stroke="#5A3C1E" strokeWidth={2}/>
    {/* Door */}
    <rect x={0} y={0} width={110} height={198} rx={4} fill="#8B4513" stroke="#6D4C2E" strokeWidth={2.5}/>
    <rect x={10} y={10} width={90} height={84} rx={3} fill="#A0522D"/>
    <rect x={10} y={104} width={90} height={84} rx={3} fill="#A0522D"/>
    <circle cx={92} cy={115} r={8} fill="#DAA520" stroke="#B8860B" strokeWidth={1.5}/>
  </g>}
  function WardrobeSVG(){return <g transform="translate(70,35)">
    {/* Wardrobe body */}
    <rect x={0} y={0} width={210} height={190} rx={6} fill="#8B5E3C" stroke="#6D4C2E" strokeWidth={2.5}/>
    {/* Interior visible — left door OPEN */}
    <rect x={4} y={4} width={100} height={182} rx={3} fill="#5A3218"/>
    {/* Shelves inside */}
    <rect x={6} y={60} width={96} height={4} rx={1} fill="#7A4420"/>
    <rect x={6} y={120} width={96} height={4} rx={1} fill="#7A4420"/>
    {/* Hanging rod */}
    <line x1={12} y1={18} x2={96} y2={18} stroke="#999" strokeWidth={3} strokeLinecap="round"/>
    {/* Clothes on hangers */}
    <path d="M25,18 L20,20 L15,45 L35,45 L30,20 Z" fill="#E74C3C" opacity={0.8}/>{/* red shirt */}
    <path d="M45,18 L40,20 L35,45 L55,45 L50,20 Z" fill="#3498DB" opacity={0.8}/>{/* blue shirt */}
    <path d="M65,18 L60,20 L55,45 L75,45 L70,20 Z" fill="#F39C12" opacity={0.8}/>{/* yellow shirt */}
    <path d="M85,18 L80,20 L75,45 L95,45 L90,20 Z" fill="#2ECC71" opacity={0.8}/>{/* green shirt */}
    {/* Folded items on shelves */}
    <rect x={15} y={66} width={30} height={12} rx={2} fill="#E74C3C" opacity={0.5}/>
    <rect x={55} y={68} width={35} height={10} rx={2} fill="#3498DB" opacity={0.5}/>
    <rect x={20} y={126} width={28} height={10} rx={2} fill="#9B59B6" opacity={0.5}/>
    <rect x={60} y={126} width={30} height={10} rx={2} fill="#F39C12" opacity={0.5}/>
    {/* Right door — closed */}
    <rect x={106} y={4} width={100} height={182} rx={3} fill="#A0704C" stroke="#6D4C2E" strokeWidth={1.5}/>
    <circle cx={112} cy={95} r={5} fill="#DAA520" stroke="#B8860B" strokeWidth={1.5}/>
    {/* Left door — open, angled out */}
    <path d="M4,4 L-30,20 L-30,170 L4,186 Z" fill="#A0704C" stroke="#6D4C2E" strokeWidth={1.5}/>
    <circle cx={-22} cy={95} r={4} fill="#DAA520" stroke="#B8860B" strokeWidth={1}/>
    {/* Top molding */}
    <rect x={-4} y={-6} width={218} height={12} rx={3} fill="#6D4C2E"/>
    {/* Bottom base */}
    <rect x={-2} y={186} width={214} height={10} rx={3} fill="#6D4C2E"/>
    {/* Small feet */}
    <rect x={8} y={196} width={16} height={8} rx={2} fill="#5A3218"/>
    <rect x={186} y={196} width={16} height={8} rx={2} fill="#5A3218"/>
  </g>}
  const sceneMap={mesa:TableSVG,silla:ChairSVG,estantería:ShelfSVG,caja:BoxSVG,mochila:BackpackSVG,puerta:DoorSVG,armario:WardrobeSVG};
  const FurnitureCmp=sceneMap[scene]||TableSVG;
  // Surface reference point per furniture (where "encima" sits)
  // Per-scene reference: {x,y} = center of the main surface
  // encima = just above surface, debajo = below, dentro = inside body, al lado = to the right
  const sp=SCENE_POS[scene]||SCENE_POS.mesa;
  const normPos=pos==='al_lado'?'al lado':pos;
  const p=sp[normPos]||sp['al lado']||{x:180,y:120};
  const cx=p.x,cy=p.y;
  // Drop zones for drag mode — only show positions that make sense per furniture
  const validZones={
    mesa:['encima','debajo','al lado'],
    silla:['encima','debajo','al lado'],
    estantería:['encima','debajo','dentro','al lado'],
    caja:['encima','debajo','dentro','al lado'],
    mochila:['encima','debajo','dentro'],
    puerta:['encima','debajo','al lado'],
    armario:['encima','debajo','dentro','al lado']
  };
  const allPositions=validZones[scene]||['encima','debajo','dentro','al lado'];
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{maxWidth:'100%'}} role="img" aria-label={`Escena: ${obj} ${pos} de ${scene}`}>
    <rect x={0} y={0} width={w} height={h} rx={14} fill={BG3} stroke={BORDER} strokeWidth={2}/>
    <rect x={10} y={h-20} width={w-20} height={12} rx={4} fill="#3a3a4a" opacity={.3}/>
    <FurnitureCmp/>
    {dropZones&&allPositions.map(zp=>{const zpos=sp[zp];if(!zpos)return null;const isHl=highlightZone===zp;const isCorrect=zp===normPos;
      return <g key={zp}>
        <circle cx={zpos.x} cy={zpos.y} r={32} fill={isHl?(isCorrect?GREEN+'55':RED+'33'):'rgba(255,255,255,0.08)'} stroke={isHl?(isCorrect?GREEN:RED+'88'):'rgba(255,255,255,0.25)'} strokeWidth={isHl?3:2} strokeDasharray={isHl?'':'5 3'}/>
        <text x={zpos.x} y={zpos.y+5} textAnchor="middle" fontSize={13} fill="rgba(255,255,255,0.5)" fontWeight={700} fontFamily="'Fredoka'">{zp}</text>
      </g>})}
    {showObj&&<>
      <circle cx={cx} cy={cy} r={32} fill={GOLD+'33'} stroke={GOLD} strokeWidth={2.5} strokeDasharray="5 3"/>
      {obj==='mochila'?<g transform={`translate(${cx-16},${cy-20})`}>
        <rect x={2} y={5} width={28} height={34} rx={7} fill="#2980B9" stroke="#1F6DA0" strokeWidth={1.8}/>
        <rect x={7} y={11} width={18} height={10} rx={3} fill="#F39C12" stroke="#E67E22" strokeWidth={1.2}/>
        <path d="M9,5 Q16,-3 23,5" fill="none" stroke="#333" strokeWidth={2.5} strokeLinecap="round"/>
        <rect x={11} y={26} width={9} height={4} rx={2} fill="#1F6DA0"/>
      </g>:<text x={cx} y={cy+8} textAnchor="middle" fontSize={38}>{objEm}</text>}
    </>}
    <text x={w/2} y={h-4} textAnchor="middle" fill={'#E8E8F0'} fontSize={22} fontWeight={700} fontFamily="'Fredoka'">{scene}</text>
  </svg>}

export function SpatialDrag({ex,fb,onCorrect,onWrong,poke}){
  const objEmojis={libro:'📕',mochila:'🎒',móvil:'📱',gafas:'👓',zapatillas:'👟',llaves:'🔑',estuche:'✏️',balón:'⚽'};
  const objEm=objEmojis[ex.data.obj]||'📦';
  const containerRef=useRef(null);
  const[dragPos,setDragPos]=useState(null);
  const[placed,setPlaced]=useState(false);
  const[nearZone,setNearZone]=useState(null);
  const[snapAnim,setSnapAnim]=useState(null);
  const dragging=useRef(false);
  function getTouch(e){const t=e.touches?e.touches[0]:e;return{x:t.clientX,y:t.clientY}}
  function checkZone(t){
    if(!containerRef.current)return null;
    const rect=containerRef.current.querySelector('svg')?.getBoundingClientRect();
    if(!rect)return null;
    const sp=SCENE_POS[ex.data.scene]||SCENE_POS.mesa;
    const svgX=(t.x-rect.left)/rect.width*360;const svgY=(t.y-rect.top)/rect.height*280;
    let closest=null;let minD=Infinity;
    for(const[zn,zp] of Object.entries(sp)){const d=Math.hypot(svgX-zp.x,svgY-zp.y);if(d<minD){minD=d;closest=zn}}
    return minD<84?closest:null}
  // Global move/end handlers
  useEffect(()=>{
    function handleMove(e){if(!dragging.current||placed||fb)return;
      e.preventDefault();const t=getTouch(e);setDragPos(t);setNearZone(checkZone(t))}
    function handleEnd(e){if(!dragging.current||placed||fb)return;poke();
      const correctPos=ex.data.pos==='al_lado'?'al lado':ex.data.pos;
      const zone=nearZone;
      dragging.current=false;
      if(zone){
        // Snap animation: move to target zone center then resolve
        const rect=containerRef.current?.querySelector('svg')?.getBoundingClientRect();
        const sp=SCENE_POS[ex.data.scene]||SCENE_POS.mesa;
        const zp=sp[zone];
        if(rect&&zp){const tx=rect.left+(zp.x/360)*rect.width;const ty=rect.top+(zp.y/280)*rect.height;setSnapAnim({x:tx,y:ty});setDragPos(null);
          setTimeout(()=>{setSnapAnim(null);if(zone===correctPos){setPlaced(true);onCorrect()}else{onWrong(correctPos);setNearZone(null)}},220);return}
        if(zone===correctPos){setPlaced(true);setDragPos(null);onCorrect()}
        else{onWrong(correctPos);setDragPos(null);setNearZone(null)}}
      else{setDragPos(null);setNearZone(null)}}
    window.addEventListener('touchmove',handleMove,{passive:false});
    window.addEventListener('touchend',handleEnd);
    window.addEventListener('mousemove',handleMove);
    window.addEventListener('mouseup',handleEnd);
    return()=>{window.removeEventListener('touchmove',handleMove);window.removeEventListener('touchend',handleEnd);
      window.removeEventListener('mousemove',handleMove);window.removeEventListener('mouseup',handleEnd)}
  });
  function onStart(e){e.preventDefault();poke();dragging.current=true;const t=getTouch(e);setDragPos(t)}
  useEffect(()=>{setPlaced(false);setDragPos(null);setNearZone(null);setSnapAnim(null);dragging.current=false},[ex]);
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,maxWidth:800,margin:'0 auto'}}>
    {/* Left — draggable object */}
    <div style={{flex:'0 0 140px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:220}}>
      {!placed&&!fb&&<div
        onTouchStart={onStart}
        onMouseDown={onStart}
        style={{cursor:'grab',userSelect:'none',touchAction:'none',
          padding:'14px 20px',borderRadius:20,background:GOLD+'22',border:`3px dashed ${GOLD}`,
          animation:'pulse 1.5s infinite',display:'flex',flexDirection:'column',alignItems:'center',gap:2,overflow:'hidden'}}>
        <span style={{fontSize:48,lineHeight:1}}>{objEm}</span>
        <span style={{fontSize:13,fontWeight:600,color:GOLD}}>{ex.data.obj}</span>
      </div>}
      {placed&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <div style={{animation:'rocketUp 1.8s 0.15s ease-in-out forwards',fontSize:52}}>🚀</div>
        <span style={{fontSize:36,opacity:0,animation:'starPop 0.6s 0.3s both',filter:'drop-shadow(0 0 12px #FFD700)'}}>⭐</span>
        <span style={{fontSize:28,opacity:0,animation:'starPop 0.6s 0.6s both',filter:'drop-shadow(0 0 12px #FFD700)'}}>⭐</span>
        <p style={{fontSize:18,fontWeight:600,color:GREEN,margin:0,opacity:0,animation:'fadeIn 0.4s 0.5s both'}}>¡Genial!</p>
      </div>}
      {fb==='no'&&<p style={{fontSize:16,fontWeight:600,color:RED,margin:0,textAlign:'center'}}>¡Inténtalo otra vez!</p>}
    </div>
    {/* Center — scene with drop zones */}
    <div ref={containerRef} style={{flex:'1 1 0',display:'flex',flexDirection:'column',alignItems:'center',gap:6,minWidth:0}}>
      <p style={{fontSize:22,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>{ex.data.q}</p>
      <SceneSVG scene={ex.data.scene} obj={ex.data.obj} pos={ex.data.pos} showObj={placed} dropZones={!placed} highlightZone={nearZone}/>
    </div>
    {/* Right — empty for symmetry */}
    <div style={{flex:'0 0 140px'}}/>
    {/* Floating dragged object */}
    {dragPos&&<div style={{position:'fixed',left:dragPos.x-28,top:dragPos.y-28,fontSize:56,pointerEvents:'none',zIndex:9999,filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',transform:'scale(1.2)',transition:'transform 0.1s'}}>{objEm}</div>}
    {/* Snap animation */}
    {snapAnim&&<div style={{position:'fixed',left:snapAnim.x-28,top:snapAnim.y-28,fontSize:56,pointerEvents:'none',zIndex:9999,filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',transform:'scale(1)',transition:'all 200ms ease-out'}}>{objEm}</div>}
  </div>}

// Strip emojis from text before TTS (Web Speech API reads emojis as words: 💧="gota", 🧥="abrigo")
function stripEmoji(t){return t?t.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27FF}]|[\u{FE00}-\u{FEFF}]|[\u200D\uFE0F]/gu,'').trim():''}

// ── Clasificar: construcción de la frase final ────────────────
// En vez de "bien clasificado" aburrido, generamos una frase con los ÚLTIMOS
// items colocados en cada grupo (los que más dudaba el niño). Ej:
// "la pera es una fruta y el gato es un animal".
// Grupos que admiten "X es un {sg} / X son unos {pl}" (sustantivos concretos).
const CLASSIFY_SINGULAR = {
  animales: { sg:'animal',   pl:'animales'   },
  muebles:  { sg:'mueble',   pl:'muebles'    },
  frutas:   { sg:'fruta',    pl:'frutas'     },
  verduras: { sg:'verdura',  pl:'verduras'   },
  comida:   { sg:'comida',   pl:'comidas'    },
  ropa:     { sg:'prenda de ropa', pl:'prendas de ropa' },
  colores:  { sg:'color',    pl:'colores'    },
};
// Plantillas verbales por grupo (en minúsculas normalizadas, sin emojis).
// es = predicado en singular · son = predicado en plural.
// Diego pidió frases como "el dentista se ocupa de la salud" y "los guantes
// se usan en invierno" en vez de "va en salud" o "van en invierno".
const GROUP_VERB = {
  'salud':        { es:'se ocupa de la salud',      son:'se ocupan de la salud' },
  'seguridad':    { es:'se ocupa de la seguridad',  son:'se ocupan de la seguridad' },
  'invierno':     { es:'se usa en invierno',        son:'se usan en invierno' },
  'verano':       { es:'se usa en verano',          son:'se usan en verano' },
  'pueblo':       { es:'está en el pueblo',         son:'están en el pueblo' },
  'ciudad':       { es:'está en la ciudad',         son:'están en la ciudad' },
  'dentro casa':  { es:'está dentro de casa',       son:'están dentro de casa' },
  'fuera casa':   { es:'está fuera de casa',        son:'están fuera de casa' },
  'hace ruido':   { es:'hace ruido',                son:'hacen ruido' },
  'silencioso':   { es:'es silencioso',             son:'son silenciosos' },
  'agua':         { es:'es cosa de agua',           son:'son cosas de agua' },
  'fuego':        { es:'es cosa de fuego',          son:'son cosas de fuego' },
  'natural':      { es:'es natural',                son:'son naturales' },
  'elaborado':    { es:'es elaborado',              son:'son elaborados' },
  'animal':       { es:'viene del animal',          son:'vienen del animal' },
  'vegetal':      { es:'es vegetal',                son:'son vegetales' },
  'necesita agua':     { es:'necesita agua',        son:'necesitan agua' },
  'no necesita agua':  { es:'no necesita agua',     son:'no necesitan agua' },
  'veo con':      { es:'se ve con los ojos',        son:'se ven con los ojos' },
  'oigo con':     { es:'se oye con los oídos',      son:'se oyen con los oídos' },
};
// Masculinos que acaban en 'a' (excepciones). Incluye profesiones ambiguas.
const MASC_EXC_A = new Set([
  'dia','día','mapa','drama','problema','sistema','tema','idioma','programa','poema',
  'clima','fantasma','planeta','pijama','sofa','sofá','papa','papá',
  'guardia','policía','policia','dentista','periodista','artista','atleta','tenista',
]);
// Femeninos irregulares (no acaban en 'a')
const FEM_IRREG = new Set([
  'leche','carne','sangre','gente','nieve','llave','tarde','fiebre','noche','mente',
  'muerte','clase','foto','moto','mano','radio','cruz','luz','flor','sal','miel',
  'piel','nariz','pared','red','sed','vez','voz','edad','ciudad','verdad','salud',
  'seguridad','mujer',
]);
// Singulares terminados en 's' (no son plurales)
const SING_S = new Set([
  'lunes','martes','miércoles','miercoles','jueves','viernes','crisis','tesis',
  'análisis','analisis','virus','atlas','autobús','autobus','mes','país','pais',
  'arroz','gas','mas','tres','dos','seis',
]);
function classifyCleanName(s){ return stripEmoji(s||'').trim(); }
function classifyIsPlural(w){
  const first = classifyCleanName(w).split(/\s+/)[0].toLowerCase();
  if(SING_S.has(first)) return false;
  return /s$/.test(first) && first.length > 2;
}
// Devuelve 'la'/'el' — ignora plurales (se manejan arriba)
function classifyArtDef(w){
  const first = classifyCleanName(w).split(/\s+/)[0].toLowerCase();
  // Si es plural quita la 's' para detectar género de la raíz
  const base = classifyIsPlural(w) ? first.replace(/s$/, '').replace(/es$/, '') : first;
  if(FEM_IRREG.has(base)) return 'la';
  if(MASC_EXC_A.has(base)) return 'el';
  if(/a$/.test(base)) return 'la';
  return 'el';
}
function classifyArtIndef(w){
  return classifyArtDef(w) === 'la' ? 'una' : 'un';
}
function buildClassifyPhrase(order, groups){
  if(!order || !order.length || !groups) return 'bien clasificado';
  const picks = groups.map((g, gi) => {
    const last = [...order].reverse().find(x => x.g === gi);
    return last ? { item: last.w, group: g } : null;
  }).filter(Boolean);
  if (!picks.length) return 'bien clasificado';
  const parts = picks.map(p => {
    const item = classifyCleanName(p.item).toLowerCase();
    const gClean = classifyCleanName(p.group).toLowerCase();
    const plural = classifyIsPlural(item);
    const defArt = classifyArtDef(item);
    const art = plural ? (defArt === 'la' ? 'las' : 'los') : defArt;
    // 1) Grupo concreto → "X es/son un/unos {singular|plural}"
    const sing = CLASSIFY_SINGULAR[gClean];
    if (sing) {
      if (plural) {
        // "los pájaros son animales" / "las peras son frutas"
        return `${art} ${item} son ${sing.pl}`;
      }
      const artIndef = classifyArtIndef(sing.sg);
      return `${art} ${item} es ${artIndef} ${sing.sg}`;
    }
    // 2) Plantilla verbal específica → "X se ocupa de la salud" / "X se usa en invierno"
    const verb = GROUP_VERB[gClean];
    if (verb) {
      return `${art} ${item} ${plural ? verb.son : verb.es}`;
    }
    // 3) Fallback → "está en el grupo {g}"
    return `${art} ${item} ${plural ? 'están' : 'está'} en ${gClean}`;
  });
  return parts.join(' y ');
}
export function ExRazona({ex,onOk,onSkip,name,uid,vids}){
  const shuffledWords=useMemo(()=>ex.mode==='intruso'?[...ex.data.words].sort(()=>Math.random()-.5):null,[ex]);
  const shuffledOpts=useMemo(()=>(ex.mode==='emotion'||ex.mode==='cause')?[...ex.data.opts].sort(()=>Math.random()-.5):null,[ex]);
  // Ordena rutinas: shuffle ESTABLE. Antes se mezclaba en cada render y las
  // opciones se movían sin parar — imposible leer/elegir.
  const shuffledSteps=useMemo(()=>ex.mode==='sequence'?[...ex.data.steps].sort(()=>Math.random()-.5):null,[ex]);
  const[fb,setFb]=useState(null);const[att,setAtt]=useState(0);const[placed,setPlaced]=useState({});const{idleMsg,poke}=useIdle(name,!fb);
  // Clasificar: orden de colocación (para frase final contextual) + item seleccionado por tap
  const[classifyOrder,setClassifyOrder]=useState([]);
  const[selectedItem,setSelectedItem]=useState(null);
  // Ordena rutinas: pista (resalta el siguiente paso correcto 1.5s)
  const[hintStep,setHintStep]=useState(null);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  useEffect(()=>{setFb(null);setAtt(0);setPlaced({});setClassifyOrder([]);setSelectedItem(null);setHintStep(null);resetOral();stopVoice();
    // Voice instruction — fallback for modes without ex.data.q
    const intro=ex.data.q||(ex.mode==='classify'?'Clasifica cada cosa en su grupo':ex.mode==='sequence'?'Ordena los pasos de '+(ex.data.title||'la rutina'):ex.mode==='anterior_posterior'?ex.data.q:'');
    setTimeout(()=>say(stripEmoji(intro)),400);
    return()=>stopVoice()},[ex]);
  function getOralPhrase(ans){
    if(ex.mode==='emotion')return ex.data.emotion;
    if(ex.mode==='spatial'||ex.mode==='spatial_drag')return ex.data.ans||ex.data.pos;
    if(ex.mode==='cause')return stripEmoji(ex.data.ans);
    if(ex.mode==='intruso')return ex.data.ans+' no es un '+ex.data.cat;
    if(ex.mode==='classify')return 'bien clasificado';
    if(ex.mode==='pattern')return ex.data.ansText||ex.data.ans;
    if(ex.mode==='number_series')return ex.data.ans;
    if(ex.mode==='compare')return ex.data.a>ex.data.b?ex.data.a+' es mayor':ex.data.a<ex.data.b?ex.data.b+' es mayor':'son iguales';
    if(ex.mode==='anterior_posterior')return(ex.data.questionMode==='anterior'?'antes del '+ex.data.n+' va el ':'después del '+ex.data.n+' va el ')+ex.data.ans;
    if(ex.mode==='temperature')return ex.data.oral;
    return String(ans);
  }
  // Mode-specific hints for first failure (not just "Casi!")
  function getFirstHint(){
    if(ex.mode==='spatial')return'Fíjate bien en dónde está el objeto';
    if(ex.mode==='intruso'){const cat=ex.data.cat||'';return'Piensa: todos los demás son del mismo grupo'+(cat?' ('+cat+')':'')}
    if(ex.mode==='cause')return'Piensa: ¿qué harías tú en esa situación?';
    if(ex.mode==='emotion')return'Mira bien la cara: ¿está contenta, triste o enfadada?';
    if(ex.mode==='pattern')return'Fíjate en el patrón que se repite';
    if(ex.mode==='anterior_posterior')return'Cuenta: ...'+Math.max(0,(ex.data.n||5)-2)+', '+(Math.max(0,(ex.data.n||5)-1))+', '+(ex.data.n||5)+', '+((ex.data.n||5)+1)+', '+((ex.data.n||5)+2)+'...';
    if(ex.mode==='temperature'){const t=ex.data.temp;return t<0?'Bajo cero: ¡hace mucho frío!':t<=10?'Pocos grados: hace frío':t<=20?'Temperatura agradable':t<=30?'Bastante calor':'¡Mucho calor!'}
    if(ex.mode==='compare')return'Cuenta los de cada lado y compara';
    if(ex.mode==='number_series')return'Cuenta de '+((ex.data&&ex.data.step)||1)+' en '+((ex.data&&ex.data.step)||1);
    return'¡Fíjate bien!'}
  function pick(ans){poke();const correct=ex.data.ans||ex.data.emotion;
    const celebTime=ex.mode==='spatial'?1800:300;
    if(ans===correct){const a=att+1;setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{const phrase=getOralPhrase(ans);setTimeout(()=>triggerOral(phrase,a===1?4:a===2?2:1,a),celebTime)})}
    else{const na=att+1;setAtt(na);setFb('no');beep(200,200);
      if(na>=2){stopVoice();sayFB('La respuesta es: '+stripEmoji(correct));setTimeout(()=>{setFb(null);setTimeout(()=>onOk(2,na),250)},2500)}
      else{const hint=getFirstHint();stopVoice();sayFB(stripEmoji(hint));setTimeout(()=>setFb(null),2000)}}}
  const[classifyAtt,setClassifyAtt]=useState(0);
  function classifyPick(item,groupIdx){
    poke();
    setSelectedItem(null);
    const np={...placed,[item.w]:groupIdx};setPlaced(np);
    // Registrar orden de colocación para la frase final contextual
    const newOrder=[...classifyOrder.filter(x=>x.w!==item.w),{w:item.w,g:groupIdx}];
    setClassifyOrder(newOrder);
    const allPlaced=ex.data.items.every(it=>np[it.w]!==undefined);
    if(allPlaced){const allCorrect=ex.data.items.every(it=>np[it.w]===it.g);
      if(allCorrect){
        setFb('ok');starBeep(4);
        const phrase=buildClassifyPhrase(newOrder,ex.data.groups);
        cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral(phrase,4,1),300));
      }
      else{const ca=classifyAtt+1;setClassifyAtt(ca);setFb('no');beep(200,200);
        if(ca>=2){
          // 2nd fail: show correct classification
          const correctPlacement={};ex.data.items.forEach(it=>{correctPlacement[it.w]=it.g});
          setPlaced(correctPlacement);
          sayFB('Mira cómo va: '+ex.data.items.map(it=>stripEmoji(it.w)+' va en '+stripEmoji(ex.data.groups[it.g])).join(', '));
          setTimeout(()=>{setFb(null);setTimeout(()=>onOk(1,ca),300)},3500)
        }else{
          sayFB('Casi, fíjate bien en cada uno');
          setTimeout(()=>{setFb(null);setPlaced({});setClassifyOrder([]);setSelectedItem(null)},2000)}}}}
  return <div style={{textAlign:'center',padding:'10px 18px'}} onClick={poke}>
    {ex.mode==='spatial'&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,maxWidth:800,margin:'0 auto'}}>
      {/* Left side — celebration zone (symmetry with buttons) */}
      <div style={{flex:'0 0 140px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:220,position:'relative'}}>
        {fb==='ok'&&<div className="ab"><Stars n={4} sz={36}/></div>}
      </div>
      {/* Center — scene */}
      <div style={{flex:'1 1 0',display:'flex',flexDirection:'column',alignItems:'center',gap:6,minWidth:0}}>
        <p style={{fontSize:22,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>{ex.data.q}</p>
        <SceneSVG scene={ex.data.scene} obj={ex.data.obj} pos={ex.data.pos}/>
      </div>
      {/* Right side — answer buttons */}
      <div style={{flex:'0 0 140px',display:'flex',flexDirection:'column',gap:8}}>
        {ex.data.opts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.ans?'btn-g':fb==='no'&&o===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:19,padding:14,minHeight:52,fontWeight:600,letterSpacing:0.5,opacity:fb==='ok'&&o!==ex.data.ans?0.35:1,transition:'opacity 0.3s'}}>{o}</button>)}
      </div>
    </div>}
    {ex.mode==='spatial_drag'&&<SpatialDrag ex={ex} fb={fb} onCorrect={()=>{setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{const phrase=ex.data.pos;setTimeout(()=>triggerOral(phrase,4,1),1800)})}} onWrong={(correctPos)=>{const na=att+1;setAtt(na);beep(200,200);setFb('no');
      if(na>=2){stopVoice();sayFB('La respuesta es: ponlo '+correctPos);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(2,na),250)},2500)}
      else{sayFB('¡No! Ponlo '+correctPos);setTimeout(()=>setFb(null),1500)}}} poke={poke}/>}
    {ex.mode==='intruso'&&<div>
      <div className="card" style={{padding:16,marginBottom:12,background:BLUE+'0C',borderColor:BLUE+'33'}}>
        <p style={{fontSize:22,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>{ex.data.q}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {shuffledWords.map(w=><button key={w} className={'btn '+(fb==='ok'&&w===ex.data.ans?'btn-g':fb==='no'&&w===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(w)} style={{fontSize:24,padding:20,minHeight:72,fontWeight:700}}>{w}</button>)}
      </div>
    </div>}
    {ex.mode==='classify'&&(()=>{
      // UX: tap-tap. Tocas una etiqueta → se marca (borde dorado). Tocas un grupo → se coloca.
      // Esto elimina el menú contextual del navegador que aparecía con long-press de drag HTML5,
      // y mantiene las etiquetas en su sitio durante todo el ejercicio.
      const noSelect={userSelect:'none',WebkitUserSelect:'none',WebkitTouchCallout:'none',WebkitUserDrag:'none',msUserSelect:'none'};
      const onGroupTap=(gi)=>{
        if(fb==='ok')return;
        if(!selectedItem){poke();sayFB('Primero toca una etiqueta');return}
        const item=ex.data.items.find(it=>it.w===selectedItem);
        if(item&&placed[item.w]===undefined)classifyPick(item,gi);
      };
      return <div>
        <p style={{fontSize:28,fontWeight:700,margin:'0 0 16px',color:GOLD,lineHeight:1.3}}>
          {selectedItem?'Ahora toca el grupo':'Toca una etiqueta y llévala a su grupo'}
        </p>
        {/* Grupos apilados verticalmente para máxima separación y claridad */}
        <div style={{display:'flex',flexDirection:'column',gap:20,marginBottom:24,maxWidth:720,margin:'0 auto 24px'}}>
          {ex.data.groups.map((g,gi)=>{
            const color=gi===0?BLUE:GREEN;
            return <div key={gi}
              onClick={()=>onGroupTap(gi)}
              onContextMenu={e=>e.preventDefault()}
              style={{
                background:color+'1a',
                border:`4px dashed ${color}${selectedItem?'cc':'55'}`,
                borderRadius:20,padding:'18px 20px',minHeight:140,
                textAlign:'center',transition:'all .2s',
                cursor:selectedItem?'pointer':'default',
                boxShadow:selectedItem?`0 0 0 2px ${color}33, 0 4px 16px ${color}44`:'none',
                ...noSelect,
              }}>
              <p style={{fontSize:26,fontWeight:800,color,margin:'0 0 12px',letterSpacing:.5}}>{g}</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',minHeight:44}}>
                {ex.data.items.filter(it=>placed[it.w]===gi).map(it=>
                  <span key={it.w} style={{
                    background:color+'33',border:`2px solid ${color}77`,
                    borderRadius:12,padding:'10px 16px',fontSize:22,fontWeight:700,color:'#fff',
                    animation:'bounceIn .3s',
                  }}>{it.w}</span>)}
              </div>
            </div>;
          })}
        </div>
        {/* Etiquetas: grid 3 columnas con SLOTS FIJOS. Una etiqueta colocada
            se oculta pero su hueco queda, así el resto no se reorganiza. */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:14,maxWidth:720,margin:'0 auto'}}>
          {ex.data.items.map(it=>{
            const used=placed[it.w]!==undefined;
            const isSelected=selectedItem===it.w&&!used;
            if(used){
              // Hueco invisible con mismo tamaño: mantiene la posición de los vecinos
              return <div key={it.w} aria-hidden="true" style={{visibility:'hidden',minHeight:64}}/>;
            }
            return <button key={it.w}
              onClick={()=>{
                if(fb==='ok')return;
                poke();
                setSelectedItem(isSelected?null:it.w);
              }}
              onContextMenu={e=>e.preventDefault()}
              style={{
                fontSize:24,padding:'16px 14px',fontWeight:700,borderRadius:16,
                border:isSelected?`3px solid ${GOLD}`:`2px solid rgba(255,255,255,.25)`,
                background:isSelected?GOLD+'22':'rgba(255,255,255,.10)',
                color:'#fff',
                cursor:'pointer',
                transition:'all .15s',
                boxShadow:isSelected?`0 0 0 3px ${GOLD}55, 0 4px 14px ${GOLD}44`:'none',
                transform:isSelected?'scale(1.03)':'scale(1)',
                fontFamily:"'Fredoka'",
                minHeight:64,
                touchAction:'manipulation',
                ...noSelect,
              }}>
              {it.w}
            </button>;
          })}
        </div>
      </div>;
    })()}
    {ex.mode==='cause'&&<div>
      <p style={{fontSize:20,fontWeight:700,margin:'0 0 10px',color:GOLD}}>{ex.data.q}</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {shuffledOpts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.ans?'btn-g':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:20,padding:16,minHeight:60}}>{o}</button>)}
      </div>
    </div>}
    {ex.mode==='pattern'&&<div>
      <div className="card" style={{padding:16,marginBottom:12,background:BLUE+'0C',borderColor:BLUE+'33'}}>
        <p style={{fontSize:22,fontWeight:700,margin:'0 0 12px',color:GOLD}}>{ex.data.q}</p>
        <div style={{display:'flex',gap:8,justifyContent:'center',alignItems:'center',flexWrap:'wrap'}}>
          {ex.data.seq.map((s,i)=><span key={i} style={{fontSize:36,background:'rgba(255,255,255,.08)',borderRadius:10,padding:'6px 10px',minWidth:48,textAlign:'center'}}>{s}</span>)}
          <span style={{fontSize:36,background:GOLD+'22',borderRadius:10,padding:'6px 10px',minWidth:48,textAlign:'center',border:`2px dashed ${GOLD}`,color:GOLD}}>❓</span>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {ex.data.opts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.ans?'btn-g':fb==='no'&&o===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:32,padding:16,minHeight:68}}>{o}</button>)}
      </div>
      {fb==='no'&&att<2&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:10}}><p style={{fontSize:16,fontWeight:600,margin:0,color:GOLD}}>Fíjate en el patrón que se repite 🔁</p></div>}
    </div>}
    {ex.mode==='emotion'&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:24}}>
      <div style={{flex:'0 0 auto',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <p style={{fontSize:20,fontWeight:700,margin:0,color:GOLD}}>{ex.data.q}</p>
        <div style={{fontSize:90}}>{ex.data.emoji}</div>
      </div>
      <div style={{flex:'0 0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,width:280}}>
        {shuffledOpts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.emotion?'btn-g':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:20,padding:16,minHeight:60}}>{o}</button>)}
      </div>
    </div>}
    {/* Ordena rutinas — 2 columnas: pool izquierda, orden derecha numerado */}
    {ex.mode==='sequence'&&(()=>{
      const totalSteps = ex.data.steps.length;
      const placedKeys = Object.keys(placed).map(Number).sort((a,b)=>a-b);
      const nextIdx = placedKeys.length;
      const usedSet = new Set(placedKeys.map(k=>placed[k]));
      const poolList = shuffledSteps ? shuffledSteps.filter(s=>!usedSet.has(s)) : [];
      // Quitar un paso ya colocado (en posición idx) y compactar numeración
      function removeStep(idx){
        poke();
        const newPlaced = {};
        let ni = 0;
        placedKeys.forEach(k => { if (k !== idx) newPlaced[ni++] = placed[k]; });
        setPlaced(newPlaced);
      }
      function pickStep(step){
        poke();
        const ni = Object.keys(placed).length;
        const np = {...placed, [ni]: step};
        setPlaced(np);
        if (Object.keys(np).length === totalSteps) {
          const correct = ex.data.steps.every((s,i) => np[i] === s);
          if (correct) {
            setFb('ok'); starBeep(4);
            say('¡Perfecto! ' + ex.data.title)
              .then(()=>cheerOrSay(mkPerfect(name), uid, vids, 'perfect'))
              .then(()=>setTimeout(()=>triggerOral(ex.data.oral, 4, 1), 300));
          } else {
            const na = att + 1; setAtt(na); setFb('no'); beep(200, 200);
            if (na >= 2) {
              sayFB('El orden correcto es...');
              setTimeout(()=>{ setFb(null); const cp={}; ex.data.steps.forEach((s,i)=>{cp[i]=s}); setPlaced(cp); setTimeout(()=>onOk(1,na), 2500)}, 1500);
            } else {
              sayFB('¡Casi! Fíjate en el orden');
              setTimeout(()=>{ setFb(null); setPlaced({}) }, 1500);
            }
          }
        }
      }
      function showHint(){
        if (fb || nextIdx >= totalSteps) return;
        poke();
        const correctNext = ex.data.steps[nextIdx];
        setHintStep(correctNext);
        sayFB('Este va ahora');
        setTimeout(()=>setHintStep(null), 2000);
      }
      // Escala unificada Razona: título 30, instrucción 28, etiquetas 24,
      // colocados 22, labels de grupo/número 26 (igual que classify).
      return <div>
        <p style={{fontSize:30,fontWeight:700,color:GOLD,margin:'0 0 6px',letterSpacing:.3}}>{ex.data.title}</p>
        <p style={{fontSize:20,color:DIM,margin:'0 0 18px'}}>Toca cada paso en el orden correcto</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,maxWidth:840,margin:'0 auto'}}>
          {/* Columna izquierda: pool de pasos sin colocar */}
          <div style={{display:'flex',flexDirection:'column',gap:12,minHeight:300}}>
            {poolList.length === 0 && !fb && <p style={{fontSize:20,color:DIM,textAlign:'center',fontStyle:'italic',margin:'40px 0'}}>Ya has usado todos</p>}
            {poolList.map(step => {
              const isHinted = hintStep === step;
              return <button key={step}
                onClick={()=>!fb&&pickStep(step)}
                onContextMenu={e=>e.preventDefault()}
                style={{
                  fontSize:24,padding:'16px 14px',fontWeight:700,borderRadius:16,
                  border: isHinted ? `3px solid ${GOLD}` : '2px solid rgba(255,255,255,.20)',
                  background: isHinted ? GOLD+'33' : 'rgba(255,255,255,.10)',
                  color:'#fff', cursor:'pointer', textAlign:'left',
                  transition:'all .15s',
                  boxShadow: isHinted ? `0 0 0 3px ${GOLD}55, 0 4px 16px ${GOLD}66` : 'none',
                  transform: isHinted ? 'scale(1.03)' : 'scale(1)',
                  fontFamily:"'Fredoka'",
                  minHeight:64,
                  userSelect:'none', WebkitUserSelect:'none',
                  WebkitTouchCallout:'none', WebkitUserDrag:'none',
                  touchAction:'manipulation',
                }}>{step}</button>;
            })}
          </div>
          {/* Columna derecha: orden construido, con numeración y botón ✕ */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {Array.from({length: totalSteps}).map((_, i) => {
              const step = placed[i];
              const isNextSlot = i === nextIdx && !step;
              return <div key={i} style={{
                display:'flex',alignItems:'center',gap:12,
                padding:'14px 14px',minHeight:64,
                borderRadius:16,
                background: step ? GREEN+'15' : isNextSlot ? GOLD+'10' : 'rgba(255,255,255,.04)',
                border: step ? `2px solid ${GREEN}44` : isNextSlot ? `2px dashed ${GOLD}88` : '2px dashed rgba(255,255,255,.12)',
                transition:'all .2s',
              }}>
                <span style={{fontSize:26,fontWeight:800,color: step ? GREEN : isNextSlot ? GOLD : 'rgba(255,255,255,.35)',minWidth:32,textAlign:'center'}}>{i+1}</span>
                <span style={{fontSize:22,fontWeight:600,color:step?'#fff':'rgba(255,255,255,.3)',flex:1}}>
                  {step || (isNextSlot ? '...' : '')}
                </span>
                {step && !fb && <button
                  onClick={()=>removeStep(i)}
                  onContextMenu={e=>e.preventDefault()}
                  style={{background:'rgba(255,255,255,.1)',border:'none',borderRadius:10,width:40,height:40,color:'#fff',fontSize:20,cursor:'pointer',fontFamily:"'Fredoka'",display:'flex',alignItems:'center',justifyContent:'center'}}
                  title="Quitar"
                >✕</button>}
              </div>;
            })}
          </div>
        </div>
        {!fb && <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:18}}>
          {nextIdx < totalSteps && <button className="btn btn-gold" onClick={showHint} style={{fontSize:18,padding:'10px 20px',maxWidth:180}}>💡 Pista</button>}
          {placedKeys.length > 0 && <button className="btn btn-ghost" onClick={()=>{setPlaced({});setHintStep(null)}} style={{fontSize:18,padding:'10px 20px',maxWidth:200}}>↩️ Empezar de nuevo</button>}
        </div>}
      </div>;
    })()}
    {/* Number series — visual number bubbles with gap */}
    {ex.mode==='number_series'&&<div>
      <div className="card" style={{padding:16,marginBottom:12,background:BLUE+'0C',borderColor:BLUE+'33'}}>
        <p style={{fontSize:22,fontWeight:700,margin:'0 0 12px',color:GOLD}}>{ex.data.q}</p>
        <div style={{display:'flex',gap:8,justifyContent:'center',alignItems:'center',flexWrap:'wrap'}}>
          {ex.data.seq.map((s,i)=><div key={i} style={{width:56,height:56,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,background:s==='?'?GOLD+'22':'rgba(255,255,255,.1)',border:s==='?'?`3px dashed ${GOLD}`:'2px solid rgba(255,255,255,.15)',color:s==='?'?GOLD:'#fff',animation:s==='?'?'pulse 1.5s infinite':'none'}}>{s}</div>)}
        </div>
        <p style={{fontSize:13,color:'rgba(255,255,255,.35)',margin:'8px 0 0'}}>De {ex.data.step} en {ex.data.step}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {ex.data.opts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.ans?'btn-g':fb==='no'&&o===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:28,padding:16,minHeight:68,fontWeight:800}}>{o}</button>)}
      </div>
      {fb==='no'&&att<2&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:10}}><p style={{fontSize:16,fontWeight:600,margin:0,color:GOLD}}>Cuenta de {ex.data.step} en {ex.data.step} 🔢</p></div>}
    </div>}
    {/* Compare quantities — visual emoji groups */}
    {ex.mode==='compare'&&<div>
      <p style={{fontSize:22,fontWeight:700,margin:'0 0 14px',color:GOLD}}>¿Cual es mayor?</p>
      <div style={{display:'flex',gap:16,justifyContent:'center',alignItems:'stretch',marginBottom:14}}>
        {[{n:ex.data.a,side:'left'},{n:ex.data.b,side:'right'}].map((s,si)=><div key={si} style={{flex:1,background:si===0?BLUE+'15':GREEN+'15',border:`2px solid ${si===0?BLUE:GREEN}`,borderRadius:16,padding:12,textAlign:'center',maxWidth:180}}>
          <div style={{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center',marginBottom:8,minHeight:40}}>
            {Array.from({length:s.n}).map((_,i)=><span key={i} style={{fontSize:24}}>{ex.data.emoji}</span>)}
          </div>
          <div style={{fontSize:36,fontWeight:800,color:si===0?BLUE:GREEN}}>{s.n}</div>
        </div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
        {['>','<','='].map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.ans?'btn-g':fb==='no'&&o===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:36,padding:14,fontWeight:800,minHeight:60}}>{o}</button>)}
      </div>
      {fb==='no'&&att<2&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:10}}><p style={{fontSize:16,fontWeight:600,margin:0,color:GOLD}}>Cuenta los {ex.data.emoji} de cada lado 👆</p></div>}
    </div>}
    {/* Temperature / Thermometer */}
    {ex.mode==='temperature'&&<div>
      <p style={{fontSize:22,fontWeight:700,color:GOLD,margin:'0 0 12px'}}>{ex.data.q}</p>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:20,marginBottom:16}}>
        {/* SVG Thermometer */}
        <svg width={60} height={200} viewBox="0 0 60 200">
          <rect x={20} y={10} width={20} height={150} rx={10} fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth={2}/>
          {/* Mercury fill — height based on temperature (-10 to 45 range) */}
          <rect x={22} y={10+150-Math.max(5,Math.min(148,((ex.data.temp+10)/55)*148))} width={16} rx={8}
            height={Math.max(5,Math.min(148,((ex.data.temp+10)/55)*148))}
            fill={ex.data.temp<=0?'#42A5F5':ex.data.temp<=15?'#66BB6A':ex.data.temp<=25?'#FFA726':'#EF5350'}/>
          {/* Bulb */}
          <circle cx={30} cy={175} r={18} fill={ex.data.temp<=0?'#42A5F5':ex.data.temp<=15?'#66BB6A':ex.data.temp<=25?'#FFA726':'#EF5350'} stroke="rgba(255,255,255,.3)" strokeWidth={2}/>
          {/* Scale marks */}
          {[-10,0,10,20,30,40].map(t=>{const y=10+150-((t+10)/55)*148;return <g key={t}><line x1={42} y1={y} x2={50} y2={y} stroke="rgba(255,255,255,.4)" strokeWidth={1}/><text x={54} y={y+4} fill="rgba(255,255,255,.5)" fontSize={9}>{t}°</text></g>})}
        </svg>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:8}}>{ex.data.emoji}</div>
          <div style={{fontSize:36,fontWeight:800,color:ex.data.temp<=0?'#42A5F5':ex.data.temp<=15?'#66BB6A':ex.data.temp<=25?'#FFA726':'#EF5350'}}>{ex.data.temp}°</div>
          {ex.data.temp<0&&<div style={{fontSize:14,color:'#42A5F5',fontWeight:600,marginTop:4}}>¡Bajo cero!</div>}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {ex.data.opts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.ans?'btn-g':fb==='no'&&o===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:20,padding:16,fontWeight:700}}>{o}</button>)}
      </div>
    </div>}
    {/* Anterior/Posterior */}
    {ex.mode==='anterior_posterior'&&<div>
      <div className="card" style={{padding:16,marginBottom:12,background:BLUE+'0C',borderColor:BLUE+'33'}}>
        <p style={{fontSize:22,fontWeight:700,margin:'0 0 12px',color:GOLD}}>{ex.data.q}</p>
        <div style={{display:'flex',gap:8,justifyContent:'center',alignItems:'center'}}>
          {/* Slot anterior: ? si se pregunta, n-1 como contexto si no */}
          <div style={{width:56,height:56,borderRadius:'50%',background:ex.data.questionMode==='anterior'?GOLD+'22':'rgba(255,255,255,.15)',border:ex.data.questionMode==='anterior'?`3px dashed ${GOLD}`:'2px solid rgba(255,255,255,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:ex.data.questionMode==='anterior'?GOLD:'#fff'}}>{ex.data.questionMode==='anterior'?'?':ex.data.n-1}</div>
          <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(255,255,255,.15)',border:'2px solid rgba(255,255,255,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:800,color:'#fff'}}>{ex.data.n}</div>
          {/* Slot posterior: ? si se pregunta, n+1 como contexto si no */}
          <div style={{width:56,height:56,borderRadius:'50%',background:ex.data.questionMode==='posterior'?GOLD+'22':'rgba(255,255,255,.15)',border:ex.data.questionMode==='posterior'?`3px dashed ${GOLD}`:'2px solid rgba(255,255,255,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:ex.data.questionMode==='posterior'?GOLD:'#fff'}}>{ex.data.questionMode==='posterior'?'?':ex.data.n+1}</div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {ex.data.opts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.ans?'btn-g':fb==='no'&&o===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:28,padding:16,minHeight:68,fontWeight:800}}>{o}</button>)}
      </div>
    </div>}
    {fb==='ok'&&ex.mode!=='spatial'&&!oralPhrase&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}
