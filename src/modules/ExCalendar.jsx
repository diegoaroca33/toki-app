import { useState, useEffect, useMemo } from 'react'
import { GOLD, GREEN, RED, BLUE, DIM, CARD, BORDER } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { beep, mkPerfect } from '../utils.js'
import { useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

// ===== CALENDARIO / TEMPORALIDAD — Rediseño completo (Doc §4.11.2) =====
const DIAS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// Banco de frases pedagógicas variadas (Doc §4.11.2). Toki rota al acertar
// para que la frase final no sea siempre "Los días de la semana".
const PEDAGOGIC_DAYS = [
  'Estos son los días de la semana',
  'Una semana tiene siete días',
  'El lunes empezamos la semana',
  'El miércoles es la mitad de la semana',
  'El sábado es fin de semana',
  'El domingo es día de descanso',
];
const PEDAGOGIC_MONTHS = [
  'Diciembre es invierno',
  'En enero hace frío',
  'En marzo empieza la primavera',
  'En junio empieza el verano',
  'Septiembre es vuelta al cole',
  'En octubre empieza el otoño',
  'Enero es el primer mes del año',
  'Diciembre es el último mes',
  'Junio es la mitad del año',
  'Un año tiene doce meses',
];
const pickPhrase = arr => arr[Math.floor(Math.random()*arr.length)];

export function genCalendar(rawLv){
  const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;
  const items=[];
  const sh=a=>[...a].sort(()=>Math.random()-.5);

  // BÁSICO (lv=1): antes/después de un día/mes random. Mezcla días reales
  // y ficticios (50/50): no nos quedamos atascados en el día actual del
  // dispositivo. 6 ejercicios mixtos día/mes.
  if(lv===1){
    for(let i=0;i<6;i++){
      if(i%2===0){
        const di=Math.floor(Math.random()*7);
        items.push({ty:'calendar',mode:'before_after_day',day:DIAS[di],dayIdx:di,id:'cal_b_d_'+i});
      } else {
        const mi=Math.floor(Math.random()*12);
        items.push({ty:'calendar',mode:'before_after_month',month:MESES[mi],monthIdx:mi,id:'cal_b_m_'+i});
      }
    }
    return sh(items);
  }

  // AVANZADO (lv=2): 3 huecos consecutivos en una semana o un año.
  // Pool de 3 etiquetas desordenadas, 4 slots ya rellenos. 6 ejercicios.
  if(lv===2){
    for(let i=0;i<6;i++){
      const useDays = i%2===0;
      const arr = useDays ? DIAS : MESES;
      // gapStart: índice inicial del hueco de 3 consecutivos
      const gapStart = Math.floor(Math.random()*(arr.length-2));
      const correct = [arr[gapStart], arr[gapStart+1], arr[gapStart+2]];
      items.push({
        ty:'calendar', mode:'fill_gaps',
        unit: useDays ? 'days' : 'months',
        full: arr,
        gapStart,
        correct,
        id: 'cal_fg_'+i,
      });
    }
    return sh(items);
  }

  // MASTER (lv=3): ordenar la semana o el año completo. 4 ejercicios
  // alternando días/meses (2 + 2).
  if(lv===3){
    items.push({ty:'calendar',mode:'order_days',correct:DIAS,id:'cal_od_0'});
    items.push({ty:'calendar',mode:'order_months',correct:MESES,id:'cal_om_0'});
    items.push({ty:'calendar',mode:'order_days',correct:DIAS,id:'cal_od_1'});
    items.push({ty:'calendar',mode:'order_months',correct:MESES,id:'cal_om_1'});
    return sh(items);
  }

  // Mezcla por defecto (todos los niveles)
  for(let i=0;i<10;i++){
    const r=Math.random();
    if(r<0.4){const di=Math.floor(Math.random()*7);items.push({ty:'calendar',mode:'before_after_day',day:DIAS[di],dayIdx:di,id:'cal_mix_d_'+i});}
    else if(r<0.8){const mi=Math.floor(Math.random()*12);items.push({ty:'calendar',mode:'before_after_month',month:MESES[mi],monthIdx:mi,id:'cal_mix_m_'+i});}
    else{const useDays=Math.random()<0.5;const arr=useDays?DIAS:MESES;const gapStart=Math.floor(Math.random()*(arr.length-2));const correct=[arr[gapStart],arr[gapStart+1],arr[gapStart+2]];items.push({ty:'calendar',mode:'fill_gaps',unit:useDays?'days':'months',full:arr,gapStart,correct,id:'cal_mix_fg_'+i});}
  }
  return items.sort(()=>Math.random()-.5);
}

export function ExCalendar({ex,onOk,onSkip,name,uid,vids}){
  const[placed,setPlaced]=useState([]);
  const[avail,setAvail]=useState([]);
  const[fb,setFb]=useState(null);
  const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  const[baAns,setBaAns]=useState({before:null,after:null});
  const[baOpts,setBaOpts]=useState([]);
  const[att,setAtt]=useState(0);
  const[showAns,setShowAns]=useState(null);
  // fill_gaps: array de 3 elementos placed; null si vacío
  const[gapPlaced,setGapPlaced]=useState([null,null,null]);

  // Frase pedagógica única por ejercicio (no cambia en cada render).
  const pedagogicPhrase = useMemo(()=>{
    if(ex.mode==='order_days'||ex.mode==='before_after_day'||(ex.mode==='fill_gaps'&&ex.unit==='days'))
      return pickPhrase(PEDAGOGIC_DAYS);
    return pickPhrase(PEDAGOGIC_MONTHS);
  },[ex]);

  useEffect(()=>{
    setFb(null);setBaAns({before:null,after:null});setAtt(0);setShowAns(null);
    setGapPlaced([null,null,null]);resetOral();stopVoice();
    if(ex.mode==='order_days'){const s=[...DIAS].sort(()=>Math.random()-.5);setAvail(s);setPlaced([]);setTimeout(()=>say('Ordena los días de la semana'),1500)}
    else if(ex.mode==='order_months'){const s=[...MESES].sort(()=>Math.random()-.5);setAvail(s);setPlaced([]);setTimeout(()=>say('Ordena los meses del año'),1500)}
    else if(ex.mode==='before_after_day'){
      const idx=ex.dayIdx;const max=DIAS.length;
      const before=DIAS[(idx-1+max)%max];const after=DIAS[(idx+1)%max];
      const distractors=DIAS.filter(d=>d!==before&&d!==after&&d!==ex.day);
      const picks=[before,after,...[...distractors].sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);
      setBaOpts(picks);
      setTimeout(()=>say('¿Qué día va antes y después de '+ex.day+'?'),1500);
    }
    else if(ex.mode==='before_after_month'){
      const idx=ex.monthIdx;const max=MESES.length;
      const before=MESES[(idx-1+max)%max];const after=MESES[(idx+1)%max];
      const distractors=MESES.filter(d=>d!==before&&d!==after&&d!==ex.month);
      const picks=[before,after,...[...distractors].sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);
      setBaOpts(picks);
      setTimeout(()=>say('¿Qué mes va antes y después de '+ex.month+'?'),1500);
    }
    else if(ex.mode==='fill_gaps'){
      // Pool: las 3 etiquetas correctas desordenadas
      setAvail([...ex.correct].sort(()=>Math.random()-.5));
      const u=ex.unit==='days'?'días de la semana':'meses del año';
      setTimeout(()=>say('Completa los huecos en orden con los '+u),1500);
    }
    return()=>stopVoice();
  },[ex]);

  // Validación al colocar el último elemento de los huecos
  function placeGap(item){
    poke();
    const slot = gapPlaced.indexOf(null);
    if(slot===-1) return;
    const np = [...gapPlaced]; np[slot] = item;
    setGapPlaced(np);
    setAvail(a=>a.filter(x=>x!==item));
    if(np.every(d=>d!==null)){
      // Comparar con ex.correct
      if(np.every((d,i)=>d===ex.correct[i])){
        setFb('ok');starBeep(4);
        cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{
          setTimeout(()=>triggerOral(pedagogicPhrase,4,1),300);
        });
      } else {
        const na=att+1;setAtt(na);setFb('no');beep(200,200);
        sayFB('Algunos no están en su sitio');
        setTimeout(()=>{
          // Mantener los correctos; devolver los incorrectos al pool
          const kept=np.map((d,i)=>d===ex.correct[i]?d:null);
          const wrong=np.filter((d,i)=>d!==ex.correct[i]);
          setGapPlaced(kept);setAvail(a=>[...a,...wrong].sort(()=>Math.random()-.5));
          setFb(null);
        },2500);
      }
    }
  }

  function place(item){
    poke();const np=[...placed];const slot=np.indexOf(null);
    if(slot!==-1)np[slot]=item;else np.push(item);
    setPlaced(np);setAvail(a=>a.filter(x=>x!==item));
    const target=ex.mode==='order_days'?DIAS:MESES;
    if(np.length===target.length&&np.every(d=>d!==null)){
      if(np.every((d,i)=>d===target[i])){
        setFb('ok');starBeep(4);
        cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{
          setTimeout(()=>triggerOral(pedagogicPhrase,4,1),300);
        });
      }
      else{
        setFb('no');beep(200,200);
        const wrongNames=np.filter((d,i)=>d!==target[i]);
        sayFB(wrongNames.length===1?wrongNames[0]+' no va ahí':'Algunos no están en su sitio');
        setTimeout(()=>{
          const kept=np.map((d,i)=>d===target[i]?d:null);
          const wrong=np.filter((d,i)=>d!==target[i]);
          setPlaced(kept);setAvail([...wrong].sort(()=>Math.random()-.5));setFb(null);
        },2500);
      }
    }
  }

  function pickBA(slot,val){
    poke();const newAns={...baAns,[slot]:val};setBaAns(newAns);
    if(newAns.before&&newAns.after){
      const target=ex.mode==='before_after_day'?DIAS:MESES;
      const idx=ex.mode==='before_after_day'?ex.dayIdx:ex.monthIdx;const max=target.length;
      const correctBefore=target[(idx-1+max)%max];const correctAfter=target[(idx+1)%max];
      if(newAns.before===correctBefore&&newAns.after===correctAfter){
        setFb('ok');starBeep(4);
        cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{
          // Frase contextualizada: "Después del lunes va el martes"
          const ref=ex.mode==='before_after_day'?ex.day:ex.month;
          const phrase = 'Antes de '+ref+' va '+correctBefore+', después '+correctAfter;
          setTimeout(()=>triggerOral(phrase,4,1),300);
        });
      }
      else{
        const na=att+1;setAtt(na);setFb('no');beep(200,200);stopVoice();
        sayFB('Antes: '+correctBefore+'. Después: '+correctAfter);
        if(na>=2){setShowAns({before:correctBefore,after:correctAfter});
          setTimeout(()=>{setFb(null);setBaAns({before:null,after:null})},4000);
        } else {
          setTimeout(()=>{setFb(null);setBaAns({before:null,after:null})},3000);
        }
      }
    }
  }

  return <div style={{textAlign:'center',padding:'10px 14px'}} onClick={poke}>
    {/* === ORDER DAYS / MONTHS (Master) === */}
    {(ex.mode==='order_days'||ex.mode==='order_months')&&<div>
      <div className="card" style={{padding:14,marginBottom:10}}>
        <p style={{fontSize:22,fontWeight:700,margin:0,color:GOLD}}>{ex.mode==='order_days'?'Ordena los días':'Ordena los meses'}</p>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:10,minHeight:44}}>
        {placed.map((d,i)=><span key={i} style={{background:GREEN+'33',borderRadius:8,padding:'8px 12px',fontSize:16,fontWeight:700,color:GREEN}}>{d}</span>)}
      </div>
      {!fb&&<div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:10}}>
        {avail.map(d=><button key={d} className="btn btn-b btn-word" onClick={()=>place(d)} style={{fontSize:16,padding:'10px 14px'}}>{d}</button>)}
      </div>}
      {placed.length>0&&!fb&&<button className="btn btn-o" onClick={()=>{setPlaced([]);setAvail([...(ex.mode==='order_days'?DIAS:MESES)].sort(()=>Math.random()-.5))}} style={{fontSize:14,maxWidth:160,margin:'0 auto'}}>↩️ Borrar</button>}
    </div>}

    {/* === BEFORE / AFTER day or month (Básico) === */}
    {(ex.mode==='before_after_day'||ex.mode==='before_after_month')&&<div>
      <div className="card" style={{padding:14,marginBottom:10}}>
        <p style={{fontSize:18,fontWeight:700,margin:'0 0 4px',color:GOLD}}>{ex.mode==='before_after_day'?'¿Qué va antes y después?':'¿Qué mes va antes y después?'}</p>
        <p style={{fontSize:30,fontWeight:800,color:BLUE,margin:'4px 0'}}>{ex.mode==='before_after_day'?ex.day:ex.month}</p>
      </div>
      <div style={{display:'flex',gap:14,justifyContent:'center',marginBottom:10}}>
        <div style={{flex:1,maxWidth:200}}>
          <p style={{fontSize:16,color:BLUE,margin:'0 0 6px',fontWeight:700}}>← ANTES</p>
          <div style={{minHeight:64,background:baAns.before?BLUE+'22':CARD,border:'3px solid '+(baAns.before?BLUE:BORDER),borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',padding:10}}>
            <span style={{fontSize:22,fontWeight:700,color:baAns.before?BLUE:DIM}}>{baAns.before||'___'}</span>
          </div>
        </div>
        <div style={{flex:1,maxWidth:200}}>
          <p style={{fontSize:16,color:'#E67E22',margin:'0 0 6px',fontWeight:700}}>DESPUÉS →</p>
          <div style={{minHeight:64,background:baAns.after?'#E67E22'+'22':CARD,border:'3px solid '+(baAns.after?'#E67E22':BORDER),borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',padding:10}}>
            <span style={{fontSize:22,fontWeight:700,color:baAns.after?'#E67E22':DIM}}>{baAns.after||'___'}</span>
          </div>
        </div>
      </div>
      {/* Una SOLA paleta de opciones (antes había duplicación). El supervisor
          tap+arrastra a antes/después con dos botones por opción. */}
      {!fb&&<div style={{display:'flex',gap:14,marginBottom:10}}>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
          {baOpts.filter(o=>o!==baAns.before&&o!==baAns.after).map(o=><button key={o+'b'} className="btn btn-b btn-word" onClick={()=>pickBA('before',o)} style={{fontSize:18,padding:'14px 16px',width:'100%',background:BLUE,borderColor:'#2980b9',minHeight:54}} disabled={!!baAns.before}>← {o}</button>)}
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
          {baOpts.filter(o=>o!==baAns.before&&o!==baAns.after).map(o=><button key={o+'a'} className="btn btn-o btn-word" onClick={()=>pickBA('after',o)} style={{fontSize:18,padding:'14px 16px',width:'100%',minHeight:54}} disabled={!!baAns.after}>{o} →</button>)}
        </div>
      </div>}
      {!fb&&(baAns.before||baAns.after)&&<button className="btn btn-o" onClick={()=>setBaAns({before:null,after:null})} style={{fontSize:16,maxWidth:160,margin:'0 auto 8px'}}>↩️ Borrar</button>}
    </div>}

    {/* === FILL GAPS (Avanzado) — 4 ya rellenos, 3 huecos consecutivos === */}
    {ex.mode==='fill_gaps'&&<div>
      <div className="card" style={{padding:14,marginBottom:10}}>
        <p style={{fontSize:18,fontWeight:700,margin:0,color:GOLD}}>Completa los huecos: {ex.unit==='days'?'días de la semana':'meses del año'}</p>
      </div>
      {/* La fila completa de la semana o el año, con 3 huecos consecutivos */}
      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:14}}>
        {ex.full.map((label,i)=>{
          const inGap = i>=ex.gapStart && i<ex.gapStart+3;
          const gapIdx = inGap ? i-ex.gapStart : -1;
          if(!inGap){
            return <span key={i} style={{background:CARD,borderRadius:8,padding:'10px 12px',fontSize:14,fontWeight:600,border:'2px solid '+BORDER}}>{label}</span>;
          }
          const placedVal = gapPlaced[gapIdx];
          return <span key={i} style={{
            background: placedVal?GREEN+'22':GOLD+'15',
            borderRadius:8,
            padding:'10px 12px',
            fontSize:14,
            fontWeight:700,
            border:'2px dashed '+(placedVal?GREEN:GOLD),
            color: placedVal?GREEN:GOLD,
            minWidth:60,
            textAlign:'center',
          }}>{placedVal||'___'}</span>;
        })}
      </div>
      {!fb&&<div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:10}}>
        {avail.map(d=><button key={d} className="btn btn-b btn-word" onClick={()=>placeGap(d)} style={{fontSize:18,padding:'12px 18px',fontWeight:700}}>{d}</button>)}
      </div>}
      {gapPlaced.some(d=>d!==null)&&!fb&&<button className="btn btn-o" onClick={()=>{setGapPlaced([null,null,null]);setAvail([...ex.correct].sort(()=>Math.random()-.5))}} style={{fontSize:14,maxWidth:160,margin:'0 auto'}}>↩️ Borrar</button>}
    </div>}

    {fb==='ok'&&!oralPhrase&&<><div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div></>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p>{showAns&&<p style={{fontSize:16,color:'#fff',fontWeight:600,margin:'8px 0 0'}}>{showAns.before?'Antes = '+showAns.before+', Después = '+showAns.after:''}</p>}</div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>
}
