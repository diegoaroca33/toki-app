import { useState, useEffect, useMemo } from 'react'
import { GOLD, GREEN, RED, BLUE, DIM, CARD, BORDER, BG3 } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { rnd, beep, mkPerfect } from '../utils.js'
import { useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

// ===== LEE MODULE =====
const LEE_INTRUSO=[
  {cat:'animal',words:['PERRO','GATO','PEZ','SILLA'],ans:'SILLA',q:'¿Cuál NO es un animal?'},
  {cat:'fruta',words:['MANZANA','PERA','PLÁTANO','MESA'],ans:'MESA',q:'¿Cuál NO es una fruta?'},
  {cat:'color',words:['ROJO','AZUL','VERDE','COCHE'],ans:'COCHE',q:'¿Cuál NO es un color?'},
  {cat:'ropa',words:['CAMISA','ZAPATO','GORRO','PERRO'],ans:'PERRO',q:'¿Cuál NO es ropa?'},
  {cat:'mueble',words:['MESA','SILLA','CAMA','GATO'],ans:'GATO',q:'¿Cuál NO es un mueble?'},
  {cat:'transporte',words:['COCHE','AVIÓN','BARCO','PAN'],ans:'PAN',q:'¿Cuál NO es un transporte?'},
  {cat:'cuerpo',words:['MANO','OJO','PIE','LIBRO'],ans:'LIBRO',q:'¿Cuál NO es del cuerpo?'},
  {cat:'comida',words:['PAN','LECHE','QUESO','LÁPIZ'],ans:'LÁPIZ',q:'¿Cuál NO es comida?'},
  {cat:'profesión',words:['MÉDICO','PROFESOR','BOMBERO','SILLA'],ans:'SILLA',q:'¿Cuál NO es una profesión?'},
  {cat:'profesión',words:['POLICÍA','COCINERO','DENTISTA','PELOTA'],ans:'PELOTA',q:'¿Cuál NO es una profesión?'},
  {cat:'deporte',words:['FÚTBOL','NATACIÓN','BALONCESTO','LIBRO'],ans:'LIBRO',q:'¿Cuál NO es un deporte?'},
  {cat:'deporte',words:['TENIS','BÁDMINTON','ATLETISMO','GATO'],ans:'GATO',q:'¿Cuál NO es un deporte?'},
  {cat:'lugar',words:['COLEGIO','HOSPITAL','PARQUE','PERRO'],ans:'PERRO',q:'¿Cuál NO es un lugar?'},
  {cat:'lugar',words:['TIENDA','PISCINA','BIBLIOTECA','PAN'],ans:'PAN',q:'¿Cuál NO es un lugar?'},
  {cat:'instrumento',words:['PIANO','GUITARRA','FLAUTA','MESA'],ans:'MESA',q:'¿Cuál NO es un instrumento?'},
  {cat:'instrumento',words:['BATERÍA','TROMPETA','VIOLÍN','COCHE'],ans:'COCHE',q:'¿Cuál NO es un instrumento?'},
  {cat:'verdura',words:['TOMATE','LECHUGA','ZANAHORIA','ZAPATO'],ans:'ZAPATO',q:'¿Cuál NO es una verdura?'},
  {cat:'verdura',words:['PATATA','CEBOLLA','PIMIENTO','AVIÓN'],ans:'AVIÓN',q:'¿Cuál NO es una verdura?'},
  {cat:'baño',words:['JABÓN','TOALLA','ESPEJO','LEÓN'],ans:'LEÓN',q:'¿Cuál NO es del baño?'},
  {cat:'cocina',words:['SARTÉN','NEVERA','HORNO','GORRO'],ans:'GORRO',q:'¿Cuál NO es de la cocina?'},
  {cat:'cuerpo',words:['CABEZA','BRAZO','RODILLA','COCHE'],ans:'COCHE',q:'¿Cuál NO es del cuerpo?'},
  {cat:'cuerpo',words:['DEDO','NARIZ','OREJA','MANZANA'],ans:'MANZANA',q:'¿Cuál NO es del cuerpo?'},
  {cat:'tiempo',words:['LLUVIA','NIEVE','SOL','PERRO'],ans:'PERRO',q:'¿Cuál NO es del tiempo?'},
  {cat:'material escolar',words:['LÁPIZ','GOMA','TIJERAS','PLÁTANO'],ans:'PLÁTANO',q:'¿Cuál NO es material escolar?'},
  {cat:'juguete',words:['PELOTA','MUÑECO','PUZZLE','TENEDOR'],ans:'TENEDOR',q:'¿Cuál NO es un juguete?'},
];
const LEE_WORD_IMG=[
  {word:'PERRO',imgs:['🐶','🐱','🐟','🐴'],ans:0},{word:'GATO',imgs:['🐶','🐱','🐟','🐴'],ans:1},
  {word:'SOL',imgs:['☀️','🌙','⭐','🌈'],ans:0},{word:'LUNA',imgs:['☀️','🌙','⭐','🌈'],ans:1},
  {word:'CASA',imgs:['🏠','🏫','🏪','🏥'],ans:0},{word:'ÁRBOL',imgs:['🌳','🌸','🌵','🌻'],ans:0},
  {word:'MANZANA',imgs:['🍎','🍐','🍌','🍊'],ans:0},{word:'COCHE',imgs:['🚗','🚂','✈️','🚢'],ans:0},
  {word:'LECHE',imgs:['🥛','🧃','☕','🍺'],ans:0},
  {word:'PAN',imgs:['🍞','🥐','🍰','🍕'],ans:0},
  {word:'ZAPATO',imgs:['👟','👕','🧢','👓'],ans:0},
  {word:'PELOTA',imgs:['⚽','🏀','🎾','🏐'],ans:0},
  {word:'LLAVE',imgs:['🔑','🔒','🚪','🏠'],ans:0},
  {word:'ESTRELLA',imgs:['⭐','🌙','☀️','🌈'],ans:0},
  {word:'AVIÓN',imgs:['✈️','🚗','🚂','🚢'],ans:0},
  {word:'RELOJ',imgs:['⏰','📱','💡','🔔'],ans:0},
  {word:'FLOR',imgs:['🌸','🌳','🍎','🐝'],ans:0},
  {word:'PARAGUAS',imgs:['☂️','🧢','🧤','🧣'],ans:0},
  {word:'SILLA',imgs:['🪑','🛏️','🚪','🪟'],ans:0},
  {word:'MOCHILA',imgs:['🎒','👜','🧳','📦'],ans:0},
];
const LEE_COMPLETE=[
  {word:'PERRO',display:'P_RRO',missing:'E',opts:['E','A','U','O']},
  {word:'GATO',display:'G_TO',missing:'A',opts:['A','E','I','O']},
  {word:'MESA',display:'M_SA',missing:'E',opts:['A','E','I','U']},
  {word:'CASA',display:'C_SA',missing:'A',opts:['A','E','O','U']},
  {word:'LUNA',display:'L_NA',missing:'U',opts:['A','E','I','U']},
  {word:'LIBRO',display:'L_BRO',missing:'I',opts:['A','E','I','O']},
  {word:'AGUA',display:'AG_A',missing:'U',opts:['A','E','I','U']},
  {word:'PELO',display:'P_LO',missing:'E',opts:['A','E','I','O']},
  {word:'MANZANA',display:'MA_ZANA',missing:'N',opts:['N','L','R','S']},
  {word:'COHETE',display:'CO_ETE',missing:'H',opts:['H','G','T','P']},
  {word:'TORTUGA',display:'TO_TUGA',missing:'R',opts:['R','L','N','S']},
  {word:'ZAPATO',display:'ZA_ATO',missing:'P',opts:['P','B','T','D']},
  {word:'PANTALÓN',display:'PAN_ALÓN',missing:'T',opts:['T','D','N','L']},
  {word:'PELOTA',display:'PE_OTA',missing:'L',opts:['L','R','N','T']},
  {word:'ESCUELA',display:'ES_UELA',missing:'C',opts:['C','G','T','Q']},
  {word:'MOCHILA',display:'MO_HILA',missing:'C',opts:['C','G','T','Q']},
  {word:'PARAGUAS',display:'PA_AGUAS',missing:'R',opts:['R','L','N','D']},
  {word:'BICICLETA',display:'BI_ICLETA',missing:'C',opts:['C','S','T','G']},
  {word:'CHOCOLATE',display:'CHO_OLATE',missing:'C',opts:['C','G','T','S']},
  {word:'HOSPITAL',display:'HOS_ITAL',missing:'P',opts:['P','B','T','D']},
];
const LEE_SYLLABLES=[
  {word:'GATO',syllables:['GA','TO']},{word:'MESA',syllables:['ME','SA']},
  {word:'LUNA',syllables:['LU','NA']},{word:'PERRO',syllables:['PE','RRO']},
  {word:'CASA',syllables:['CA','SA']},{word:'PELO',syllables:['PE','LO']},
  {word:'PATO',syllables:['PA','TO']},{word:'RANA',syllables:['RA','NA']},
  {word:'MONO',syllables:['MO','NO']},{word:'VASO',syllables:['VA','SO']},
  {word:'PELOTA',syllables:['PE','LO','TA']},
  {word:'COCINA',syllables:['CO','CI','NA']},
  {word:'ZAPATO',syllables:['ZA','PA','TO']},
  {word:'CAMISA',syllables:['CA','MI','SA']},
  {word:'CABEZA',syllables:['CA','BE','ZA']},
  {word:'TOMATE',syllables:['TO','MA','TE']},
  {word:'ESTRELLA',syllables:['ES','TRE','LLA']},
  {word:'MOCHILA',syllables:['MO','CHI','LA']},
  {word:'PARAGUAS',syllables:['PA','RA','GUAS']},
  {word:'CAMISETA',syllables:['CA','MI','SE','TA']},
  {word:'CHOCOLATE',syllables:['CHO','CO','LA','TE']},
  {word:'BICICLETA',syllables:['BI','CI','CLE','TA']},
  {word:'MARIPOSA',syllables:['MA','RI','PO','SA']},
  {word:'ZANAHORIA',syllables:['ZA','NA','HO','RIA']},
  {word:'DINOSAURIO',syllables:['DI','NO','SAU','RIO']},
];
const LEE_READ_DO=[
  {instruction:'TOCA EL ROJO',opts:[{l:'🔴',c:'red',correct:true},{l:'🔵',c:'blue'},{l:'🟢',c:'green'},{l:'🟡',c:'yellow'}]},
  {instruction:'TOCA EL AZUL',opts:[{l:'🔴',c:'red'},{l:'🔵',c:'blue',correct:true},{l:'🟢',c:'green'},{l:'🟡',c:'yellow'}]},
  {instruction:'TOCA EL VERDE',opts:[{l:'🔴',c:'red'},{l:'🔵',c:'blue'},{l:'🟢',c:'green',correct:true},{l:'🟡',c:'yellow'}]},
  {instruction:'TOCA EL GRANDE',opts:[{l:'⭐',sz:80,correct:true},{l:'⭐',sz:30},{l:'⭐',sz:40},{l:'⭐',sz:20}]},
  {instruction:'TOCA EL ANIMAL',opts:[{l:'🐶',correct:true},{l:'🏠'},{l:'🚗'},{l:'📚'}]},
  {instruction:'TOCA LA FRUTA',opts:[{l:'🍎',correct:true},{l:'🐱'},{l:'🏠'},{l:'✏️'}]},
  {instruction:'TOCA EL QUE VUELA',opts:[{l:'✈️',correct:true},{l:'🚗'},{l:'🚂'},{l:'🐟'}]},
  {instruction:'TOCA EL QUE NADA',opts:[{l:'🐟',correct:true},{l:'🐶'},{l:'🐱'},{l:'🐴'}]},
  {instruction:'TOCA LA COMIDA',opts:[{l:'🍎',correct:true},{l:'🚗'},{l:'📚'},{l:'⚽'}]},
  {instruction:'TOCA EL MÁS PEQUEÑO',opts:[{l:'⭐',sz:20,correct:true},{l:'⭐',sz:80},{l:'⭐',sz:60},{l:'⭐',sz:40}]},
  {instruction:'TOCA LA ROPA',opts:[{l:'👕',correct:true},{l:'🍎'},{l:'🚗'},{l:'🐶'}]},
  {instruction:'TOCA EL NÚMERO',opts:[{l:'7️⃣',correct:true},{l:'🔴'},{l:'⭐'},{l:'🐶'}]},
  {instruction:'TOCA LA LETRA A',opts:[{l:'🅰️',correct:true},{l:'🅱️'},{l:'Ⓜ️'},{l:'🅾️'}]},
  {instruction:'TOCA EL QUE TIENE RUEDAS',opts:[{l:'🚗',correct:true},{l:'🐶'},{l:'🏠'},{l:'🌳'}]},
  {instruction:'TOCA DOS ANIMALES',opts:[{l:'🐶',correct:true},{l:'🐱',correct:true},{l:'🏠'},{l:'📚'}]},
];

export function genLee(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const sh=a=>[...a].sort(()=>Math.random()-.5);
  if(lv===1)return sh(LEE_INTRUSO).map((d,i)=>({ty:'lee',mode:'intruso',data:d,id:'lee_int_'+i}));
  if(lv===2)return sh(LEE_WORD_IMG).map((d,i)=>({ty:'lee',mode:'word_img',data:d,id:'lee_wi_'+i}));
  if(lv===3)return sh(LEE_COMPLETE).map((d,i)=>({ty:'lee',mode:'complete',data:d,id:'lee_cmp_'+i}));
  if(lv===4)return sh(LEE_SYLLABLES).map((d,i)=>({ty:'lee',mode:'syllables',data:d,id:'lee_syl_'+i}));
  return sh(LEE_READ_DO).map((d,i)=>({ty:'lee',mode:'read_do',data:d,id:'lee_rd_'+i}))}

export function ExLee({ex,onOk,onSkip,name,uid,vids}){
  const[fb,setFb]=useState(null);const[att,setAtt]=useState(0);const[placed,setPlaced]=useState([]);const[avail,setAvail]=useState([]);const[filledLetter,setFilledLetter]=useState(null);const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  const shuffledWords=useMemo(()=>ex.mode==='intruso'?[...ex.data.words].sort(()=>Math.random()-.5):null,[ex]);
  useEffect(()=>{setFb(null);setAtt(0);setPlaced([]);setFilledLetter(null);resetOral();
    if(ex.mode==='syllables'){setAvail([...ex.data.syllables].sort(()=>Math.random()-.5))}
    stopVoice();return()=>stopVoice()},[ex]);
  function getOralPhrase(){
    if(ex.mode==='intruso')return ex.data.ans;
    if(ex.mode==='word_img')return ex.data.word;
    if(ex.mode==='complete')return ex.data.word;
    if(ex.mode==='syllables')return ex.data.word;
    if(ex.mode==='read_do')return ex.data.instruction;
    return '';
  }
  function pick(ans){poke();
    if(ex.mode==='intruso'){if(ans===ex.data.ans){const a=att+1;setFb('ok');starBeep(4);say('¡Bien! '+ans+' no es '+(ex.data.cat==='fruta'||ex.data.cat==='ropa'||ex.data.cat==='comida'?'una ':'un ')+ex.data.cat).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(()=>triggerOral(getOralPhrase(),a===1?4:a===2?2:1,a),300))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){say('La respuesta es '+ex.data.ans);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(2,na),400)},2500)}else{say(ex.data.q);setTimeout(()=>setFb(null),1500)}}}
    if(ex.mode==='word_img'){if(ans===ex.data.ans){const a=att+1;setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral(getOralPhrase(),a===1?4:a===2?2:1,a),250))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){say(ex.data.word);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(2,na),400)},2500)}else{sayFB('Fíjate, empieza por '+ex.data.word.charAt(0));setTimeout(()=>setFb(null),1500)}}}
    if(ex.mode==='complete'){if(ans===ex.data.missing){const a=att+1;setFb('ok');setFilledLetter(ans);starBeep(4);say(ex.data.word).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(()=>triggerOral(getOralPhrase(),a===1?4:a===2?2:1,a),300))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){setFilledLetter(ex.data.missing);setFb('show');say(ex.data.word);setTimeout(()=>{setTimeout(()=>onOk(2,na),400)},2500)}else{const letterHints={A:'Avión',B:'Balón',C:'Casa',D:'Dado',E:'Elefante',F:'Foca',G:'Gato',H:'Huevo',I:'Iguana',J:'Jirafa',K:'Koala',L:'León',M:'Manzana',N:'Nube',O:'Oso',P:'Perro',Q:'Queso',R:'Rana',S:'Sol',T:'Tigre',U:'Uva',V:'Vaca',W:'Wafle',X:'Xilófono',Y:'Yate',Z:'Zapato'};const ltr=ex.data.missing.toUpperCase();const hintWord=letterHints[ltr]||ltr;sayFB('Es la primera letra de '+hintWord);setTimeout(()=>setFb(null),2000)}}}
    if(ex.mode==='read_do'){const isCorrect=ex.data.opts[ans]?.correct;
      if(isCorrect){const a=att+1;setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral(getOralPhrase(),a===1?4:a===2?2:1,a),250))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){say(ex.data.instruction);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(2,na),400)},2500)}else{setTimeout(()=>setFb(null),1200)}}}}
  function placeSyl(s){poke();const np=[...placed,s];setPlaced(np);setAvail(a=>a.filter(x=>x!==s));
    if(np.length===ex.data.syllables.length){if(np.join('')===ex.data.syllables.join('')){const a=att+1;setFb('ok');starBeep(4);say(ex.data.word).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(()=>triggerOral(getOralPhrase(),a===1?4:a===2?2:1,a),250))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);
        if(na>=2){say(ex.data.word);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(2,na),400)},2500)}
        else{sayFB('La primera sílaba es '+ex.data.syllables[0]);setTimeout(()=>{setPlaced([]);setAvail([...ex.data.syllables].sort(()=>Math.random()-.5));setFb(null)},2000)}}}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {ex.mode==='intruso'&&<div>
      <div className="card" style={{padding:16,marginBottom:14,background:'#E91E63'+'0C',borderColor:'#E91E63'+'33'}}><p style={{fontSize:22,fontWeight:700,margin:0,color:GOLD}}>{ex.data.q}</p></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {shuffledWords.map(w=><button key={w} className={'btn '+(fb==='ok'&&w===ex.data.ans?'btn-g':'btn-b')} onClick={()=>!fb&&pick(w)} style={{fontSize:26,padding:22,fontWeight:700,minHeight:80,boxShadow:fb==='ok'&&w===ex.data.ans?'0 0 20px '+GREEN+'88':'',transition:'all .3s'}} disabled={!!fb}>{w}</button>)}
      </div>
      {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:14,marginTop:12}}><p style={{fontSize:18,fontWeight:600,color:GREEN,margin:0}}>{'¡Bien! '+ex.data.ans+' no es '+(ex.data.cat==='fruta'||ex.data.cat==='ropa'||ex.data.cat==='comida'?'una ':'un ')+ex.data.cat+'!'}</p></div>}
    </div>}
    {ex.mode==='word_img'&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:36,fontWeight:700,margin:0,color:GOLD,letterSpacing:4}}>{ex.data.word}</p></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {ex.data.imgs.map((img,i)=><button key={i} className={'btn '+(fb==='ok'&&i===ex.data.ans?'btn-g':'btn-b')} onClick={()=>!fb&&pick(i)} style={{fontSize:56,padding:16,minHeight:90}}>{img}</button>)}
      </div>
    </div>}
    {ex.mode==='complete'&&<div>
      <div className="card" style={{padding:24,marginBottom:14}}><p style={{fontSize:42,fontWeight:700,margin:0,color:GOLD,letterSpacing:6,fontFamily:'monospace'}}>{filledLetter?ex.data.display.split('').map((c,i)=>c==='_'?<span key={i} style={{color:fb==='ok'?GREEN:fb==='show'?GREEN:GOLD,textDecoration:fb==='ok'?'none':'none',transition:'all .3s'}}>{filledLetter}</span>:c):ex.data.display}</p></div>
      {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:24,fontWeight:700,color:GREEN,margin:0}}>{ex.data.word}</p></div>}
      {fb==='show'&&<div className="af" style={{background:GOLD+'22',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:18,fontWeight:600,color:GOLD,margin:0}}>Era {ex.data.missing}!</p></div>}
      {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! Prueba otra</p></div>}
      {!fb&&<div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
        {ex.data.opts.map(o=><button key={o} className="btn btn-b" onClick={()=>pick(o)} style={{fontSize:32,padding:18,fontWeight:700,minHeight:70}}>{o}</button>)}
      </div>}
    </div>}
    {ex.mode==='syllables'&&<div>
      <div className="card" style={{padding:16,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>Ordena las sílabas</p></div>
      <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:14,minHeight:60}}>
        {ex.data.syllables.map((_,i)=><div key={i} style={{minWidth:70,height:56,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:12,border:`3px solid ${placed[i]?GREEN:BORDER}`,background:placed[i]?GREEN+'22':BG3,fontSize:28,fontWeight:700,color:placed[i]?GREEN:DIM}}>{placed[i]||'__'}</div>)}
      </div>
      <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
        {avail.map((s,i)=><button key={s+i} className="btn btn-b btn-word" onClick={()=>!fb&&placeSyl(s)} style={{fontSize:28,padding:'14px 24px',fontWeight:700}}>{s}</button>)}
      </div>
      {placed.length>0&&!fb&&<button className="btn btn-o" onClick={()=>{setPlaced([]);setAvail([...ex.data.syllables].sort(()=>Math.random()-.5))}} style={{marginTop:12,fontSize:14,maxWidth:150,margin:'12px auto 0'}}>↩️ Borrar</button>}
    </div>}
    {ex.mode==='read_do'&&<div>
      <div className="card" style={{padding:24,marginBottom:14,background:GOLD+'0C',borderColor:GOLD+'33'}}><p style={{fontSize:32,fontWeight:700,margin:0,color:GOLD,letterSpacing:2}}>{ex.data.instruction}</p></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {ex.data.opts.map((o,i)=><button key={i} className={'btn '+(fb==='ok'&&o.correct?'btn-g':'btn-b')} onClick={()=>!fb&&pick(i)} style={{fontSize:o.sz||56,padding:20,minHeight:90}}>{o.l}</button>)}
      </div>
    </div>}
    {fb==='ok'&&!oralPhrase&&<><div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div></>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}
