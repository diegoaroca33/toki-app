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
  // Naturales/Sociales — Pictociencia
  {groups:['🌾 Natural','🏭 Elaborado'],items:[{w:'🌾 Trigo',g:0},{w:'🍞 Pan',g:1},{w:'🥛 Leche',g:0},{w:'🧀 Queso',g:1},{w:'🌳 Madera',g:0},{w:'🪑 Mesa',g:1}]},
  {groups:['🌾 Natural','🏭 Elaborado'],items:[{w:'🫒 Aceituna',g:0},{w:'🫒 Aceite',g:1},{w:'🐑 Lana',g:0},{w:'🧣 Bufanda',g:1},{w:'🍇 Uva',g:0},{w:'🍷 Zumo',g:1}]},
  {groups:['🌾 Natural','🏭 Elaborado'],items:[{w:'🥚 Huevo',g:0},{w:'🍰 Pastel',g:1},{w:'🌻 Girasol',g:0},{w:'🛢️ Aceite',g:1},{w:'🐄 Vaca',g:0},{w:'👞 Zapatos',g:1}]},
  {groups:['❄️ Invierno','☀️ Verano'],items:[{w:'🧥 Abrigo',g:0},{w:'👙 Bañador',g:1},{w:'🧣 Bufanda',g:0},{w:'🩴 Chanclas',g:1},{w:'🧤 Guantes',g:0},{w:'🕶️ Gafas sol',g:1}]},
  {groups:['❄️ Invierno','☀️ Verano'],items:[{w:'🧶 Jersey',g:0},{w:'👕 Camiseta',g:1},{w:'🥾 Botas',g:0},{w:'🩱 Bermudas',g:1},{w:'☂️ Paraguas',g:0},{w:'🧴 Crema sol',g:1}]},
  {groups:['🏡 Pueblo','🏙️ Ciudad'],items:[{w:'🌾 Campos',g:0},{w:'🏢 Edificios',g:1},{w:'🐄 Vacas',g:0},{w:'🚌 Autobuses',g:1},{w:'🌳 Bosque',g:0},{w:'🏥 Hospital',g:1}]},
  {groups:['🏠 Dentro casa','🌳 Fuera casa'],items:[{w:'🛋️ Sofá',g:0},{w:'🌳 Árbol',g:1},{w:'🍳 Cocina',g:0},{w:'🏊 Piscina',g:1},{w:'🛁 Bañera',g:0},{w:'⛱️ Playa',g:1}]},
  {groups:['🔊 Hace ruido','🤫 Silencioso'],items:[{w:'🥁 Tambor',g:0},{w:'📚 Libro',g:1},{w:'📱 Teléfono',g:0},{w:'🧸 Peluche',g:1},{w:'🐕 Perro',g:0},{w:'🐟 Pez',g:1}]},
  {groups:['💧 Agua','🔥 Fuego'],items:[{w:'🏊 Nadar',g:0},{w:'🏕️ Hoguera',g:1},{w:'🚿 Ducha',g:0},{w:'🕯️ Vela',g:1},{w:'🌧️ Lluvia',g:0},{w:'☀️ Sol',g:1}]},
];
const RAZONA_CAUSE=[
  {q:'Si llueve... ¿qué cojo?',opts:['☂️ Paraguas','🕶️ Gafas de sol'],ans:'☂️ Paraguas'},
  {q:'Si tengo hambre... ¿qué hago?',opts:['🍽️ Como','😴 Duermo'],ans:'🍽️ Como'},
  {q:'Si hace frío... ¿qué me pongo?',opts:['🧥 Abrigo','👙 Bañador'],ans:'🧥 Abrigo'},
  {q:'Si está oscuro... ¿qué enciendo?',opts:['💡 La luz','🚰 El grifo'],ans:'💡 La luz'},
  {q:'Si me duele la cabeza... ¿qué tomo?',opts:['💊 Medicina','🥤 Refresco'],ans:'💊 Medicina'},
  {q:'Si quiero cruzar la calle... ¿qué miro?',opts:['🚦 El semáforo','🕐 El reloj'],ans:'🚦 El semáforo'},
  // Nuevos — entorno cotidiano (Pictociencia)
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
// Generate sequence ordering exercises (daily routines)
function genSequences(){const sh=a=>[...a].sort(()=>Math.random()-.5);const items=[];
  const SEQUENCES=[
    {title:'Por la mañana',steps:['⏰ Me despierto','🚿 Me ducho','👕 Me visto','🥣 Desayuno','🎒 Cojo la mochila','🚌 Voy al cole'],oral:'Por la mañana me despierto, me ducho, me visto y desayuno'},
    {title:'Antes de dormir',steps:['🍽️ Ceno','📺 Veo un rato la tele','🪥 Me lavo los dientes','📖 Leo un cuento','🛏️ Me acuesto','😴 Me duermo'],oral:'Antes de dormir ceno, me lavo los dientes y me acuesto'},
    {title:'Ir a comprar',steps:['📝 Hago la lista','🧥 Me pongo el abrigo','🚶 Voy a la tienda','🛒 Cojo lo que necesito','💰 Pago en la caja','🏠 Vuelvo a casa'],oral:'Para comprar hago la lista, voy a la tienda, pago y vuelvo'},
    {title:'Ir al médico',steps:['📞 Pido cita','🚗 Voy al centro de salud','🪑 Espero mi turno','👨‍⚕️ Entro a consulta','💊 Me da la receta','🏠 Vuelvo a casa'],oral:'En el médico espero mi turno, entro y me da la receta'},
    {title:'Coger el autobús',steps:['🚏 Voy a la parada','⏳ Espero el autobús','🚌 Subo al autobús','💳 Pago el billete','💺 Me siento','🔔 Pulso para bajar'],oral:'Para ir en bus, espero en la parada, subo y pago'},
    {title:'Preparar un bocadillo',steps:['🍞 Cojo el pan','🔪 Lo corto por la mitad','🧀 Pongo el queso','🥬 Pongo la lechuga','🍞 Cierro el bocadillo','😋 Me lo como'],oral:'Para hacer un bocadillo corto el pan, pongo queso y lo cierro'},
    {title:'Lavarse las manos',steps:['🚰 Abro el grifo','🧼 Echo jabón','🤲 Froto las manos','💦 Las enjuago con agua','🚰 Cierro el grifo','🧻 Me seco con la toalla'],oral:'Me lavo las manos con jabón y agua y me seco'},
    {title:'Poner la mesa',steps:['🍽️ Pongo el mantel','🍽️ Pongo los platos','🍴 Pongo los cubiertos','🥛 Pongo los vasos','🧻 Pongo las servilletas','🪑 Me siento'],oral:'Pongo el mantel, los platos, los cubiertos y los vasos'},
    {title:'Ir al parque',steps:['👟 Me pongo las zapatillas','🧴 Me echo crema','🚶 Voy andando','🌳 Llego al parque','⚽ Juego con amigos','🏠 Vuelvo a casa'],oral:'Voy al parque, juego con amigos y vuelvo a casa'},
    {title:'Ducharse',steps:['🚿 Abro el agua','💧 Mojo el cuerpo','🧴 Echo gel','🤲 Me froto bien','💦 Me aclaro','🧻 Me seco con la toalla'],oral:'Para ducharme abro el agua, me enjabono y me seco'},
  ];
  SEQUENCES.forEach((seq,si)=>{
    // Show 4 steps shuffled, child must order them
    const shown=seq.steps.slice(0,4);
    items.push({ty:'razona',mode:'sequence',data:{title:seq.title,steps:shown,oral:seq.oral},id:'rz_seq_'+si});
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
  if(lv===11){return genSequences()}
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

export function ExRazona({ex,onOk,onSkip,name,uid,vids}){
  const shuffledWords=useMemo(()=>ex.mode==='intruso'?[...ex.data.words].sort(()=>Math.random()-.5):null,[ex]);
  const shuffledOpts=useMemo(()=>(ex.mode==='emotion'||ex.mode==='cause')?[...ex.data.opts].sort(()=>Math.random()-.5):null,[ex]);
  const[fb,setFb]=useState(null);const[att,setAtt]=useState(0);const[placed,setPlaced]=useState({});const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  useEffect(()=>{setFb(null);setAtt(0);setPlaced({});resetOral();stopVoice();setTimeout(()=>say(ex.data.q||''),400);return()=>stopVoice()},[ex]);
  function getOralPhrase(ans){
    if(ex.mode==='emotion')return ex.data.emotion;
    if(ex.mode==='spatial'||ex.mode==='spatial_drag')return ex.data.ans||ex.data.pos;
    if(ex.mode==='cause')return ex.data.ans;
    if(ex.mode==='intruso')return ex.data.ans+' no es un '+ex.data.cat;
    if(ex.mode==='classify')return 'bien clasificado';
    if(ex.mode==='pattern')return ex.data.ansText||ex.data.ans;
    if(ex.mode==='number_series')return ex.data.ans;
    if(ex.mode==='compare')return ex.data.a>ex.data.b?ex.data.a+' es mayor':ex.data.a<ex.data.b?ex.data.b+' es mayor':'son iguales';
    return String(ans);
  }
  function pick(ans){poke();const correct=ex.data.ans||ex.data.emotion;
    const celebTime=ex.mode==='spatial'?1800:300;
    if(ans===correct){const a=att+1;setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{const phrase=getOralPhrase(ans);setTimeout(()=>triggerOral(phrase,a===1?4:a===2?2:1,a),celebTime)})}
    else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){stopVoice();sayFB('La respuesta es: '+correct);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(2,na),250)},2500)}
      else{setTimeout(()=>setFb(null),1200)}}}
  function classifyPick(item,groupIdx){poke();const np={...placed,[item.w]:groupIdx};setPlaced(np);
    const allPlaced=ex.data.items.every(it=>np[it.w]!==undefined);
    if(allPlaced){const allCorrect=ex.data.items.every(it=>np[it.w]===it.g);
      if(allCorrect){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral('bien clasificado',4,1),300))}
      else{setFb('no');beep(200,200);sayFB('¡Casi! Algunos no están bien');setTimeout(()=>{setFb(null);setPlaced({})},2000)}}}
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
    {ex.mode==='spatial_drag'&&<SpatialDrag ex={ex} fb={fb} onCorrect={()=>{setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{const phrase=ex.data.pos;setTimeout(()=>triggerOral(phrase,4,1),1800)})}} onWrong={(correctPos)=>{const na=att+1;setAtt(na);beep(200,200);setFb('no');sayFB('¡No! Ponlo '+correctPos);setTimeout(()=>setFb(null),1500)}} poke={poke}/>}
    {ex.mode==='intruso'&&<div>
      <div className="card" style={{padding:16,marginBottom:12,background:BLUE+'0C',borderColor:BLUE+'33'}}>
        <p style={{fontSize:22,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>{ex.data.q}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {shuffledWords.map(w=><button key={w} className={'btn '+(fb==='ok'&&w===ex.data.ans?'btn-g':fb==='no'&&w===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(w)} style={{fontSize:24,padding:20,minHeight:72,fontWeight:700}}>{w}</button>)}
      </div>
    </div>}
    {ex.mode==='classify'&&<div>
      <p style={{fontSize:20,fontWeight:700,margin:'0 0 10px',color:GOLD}}>{ex.data.q}</p>
      <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:12}}>
        {ex.data.groups.map((g,gi)=><div key={gi} style={{flex:1,background:gi===0?BLUE+'22':GREEN+'22',border:`2px solid ${gi===0?BLUE:GREEN}`,borderRadius:12,padding:10,minHeight:80}}>
          <p style={{fontSize:16,fontWeight:600,color:gi===0?BLUE:GREEN,margin:'0 0 8px'}}>{g}</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center'}}>
            {ex.data.items.filter(it=>placed[it.w]===gi).map(it=><span key={it.w} style={{background:gi===0?BLUE+'44':GREEN+'44',borderRadius:6,padding:'4px 8px',fontSize:14,fontWeight:600}}>{it.w}</span>)}
          </div>
        </div>)}
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
        {ex.data.items.filter(it=>placed[it.w]===undefined).map(it=><div key={it.w} style={{display:'flex',flexDirection:'column',gap:4}}>
          {ex.data.groups.map((g,gi)=><button key={gi} className="btn btn-b btn-word" onClick={()=>classifyPick(it,gi)} style={{fontSize:14,padding:'6px 12px'}}>{it.w}→{g}</button>)}
        </div>)}
      </div>
    </div>}
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
    {/* Sequences — order daily routine steps */}
    {ex.mode==='sequence'&&<div>
      <p style={{fontSize:22,fontWeight:700,color:GOLD,margin:'0 0 12px'}}>{ex.data.title}</p>
      <p style={{fontSize:16,color:DIM,margin:'0 0 10px'}}>Ordena los pasos</p>
      {/* Placed steps */}
      <div style={{display:'grid',gap:6,marginBottom:12,minHeight:60}}>
        {Object.keys(placed).sort((a,b)=>parseInt(a)-parseInt(b)).map(k=>{
          const step=placed[k];
          return <div key={k} style={{display:'flex',gap:8,alignItems:'center',padding:'8px 12px',background:GREEN+'15',borderRadius:10,border:`1px solid ${GREEN}33`}}>
            <span style={{fontSize:16,fontWeight:800,color:GREEN,minWidth:24}}>{parseInt(k)+1}.</span>
            <span style={{fontSize:16}}>{step}</span>
          </div>
        })}
      </div>
      {/* Available steps to pick */}
      {!fb&&<div style={{display:'grid',gap:6}}>
        {ex.data.steps.filter(s=>!Object.values(placed).includes(s)).sort(()=>0.5-Math.random()).map(step=>
          <button key={step} className="btn btn-b" onClick={()=>{
            poke();const nextIdx=Object.keys(placed).length;
            const np={...placed,[nextIdx]:step};setPlaced(np);
            if(Object.keys(np).length===ex.data.steps.length){
              const correct=ex.data.steps.every((s,i)=>np[i]===s);
              if(correct){setFb('ok');starBeep(4);say('¡Perfecto! '+ex.data.title).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(()=>triggerOral(ex.data.oral,4,1),300))}
              else{const na=att+1;setAtt(na);setFb('no');beep(200,200);
                if(na>=2){sayFB('El orden correcto es...');setTimeout(()=>{setFb(null);const cp={};ex.data.steps.forEach((s,i)=>{cp[i]=s});setPlaced(cp);setTimeout(()=>onOk(1,na),2500)},1500)}
                else{sayFB('¡Casi! Fíjate en el orden');setTimeout(()=>{setFb(null);setPlaced({})},1500)}}
            }
          }} style={{fontSize:16,padding:'10px 14px',textAlign:'left'}}>{step}</button>
        )}
      </div>}
      {Object.keys(placed).length>0&&!fb&&<button className="btn btn-ghost" onClick={()=>setPlaced({})} style={{marginTop:8,fontSize:14}}>↩️ Empezar de nuevo</button>}
    </div>}
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
    {fb==='ok'&&ex.mode!=='spatial'&&!oralPhrase&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}
