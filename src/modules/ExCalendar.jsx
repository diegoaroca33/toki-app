import { useState, useEffect } from 'react'
import { GOLD, GREEN, RED, BLUE, DIM, CARD, BORDER } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { beep, mkPerfect } from '../utils.js'
import { useIdle } from '../components/UIKit.jsx'
import { CelebrationOverlay, Stars } from '../components/CelebrationOverlay.jsx'

// ===== CALENDARIO / TEMPORALIDAD =====
const DIAS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export function genCalendar(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const items=[];
  if(lv===1){items.push({ty:'calendar',mode:'order_days',correct:DIAS,id:'cal_days_0'});for(let i=0;i<5;i++){const di=Math.floor(Math.random()*7);items.push({ty:'calendar',mode:'before_after_day',day:DIAS[di],dayIdx:di,id:'cal_ba_d1_'+i})}return items.sort(()=>Math.random()-.5)}
  if(lv===2){items.push({ty:'calendar',mode:'order_months',correct:MESES,id:'cal_months_0'});for(let i=0;i<5;i++){const mi=Math.floor(Math.random()*12);items.push({ty:'calendar',mode:'before_after_month',month:MESES[mi],monthIdx:mi,id:'cal_bam1_'+i})}return items.sort(()=>Math.random()-.5)}
  if(lv===3){for(let i=0;i<10;i++){const di=Math.floor(Math.random()*7);items.push({ty:'calendar',mode:'before_after_day',day:DIAS[di],dayIdx:di,id:'cal_ba_d_'+i})}return items}
  for(let i=0;i<10;i++){const r=Math.random();if(r<0.33){items.push({ty:'calendar',mode:'yesterday_tomorrow',id:'cal_yt_'+i})}
    else if(r<0.66){const di=Math.floor(Math.random()*7);items.push({ty:'calendar',mode:'before_after_day',day:DIAS[di],dayIdx:di,id:'cal_ba2_'+i})}
    else{const mi=Math.floor(Math.random()*12);items.push({ty:'calendar',mode:'before_after_month',month:MESES[mi],monthIdx:mi,id:'cal_bam_'+i})}}
  return items.sort(()=>Math.random()-.5)}

export function ExCalendar({ex,onOk,onSkip,name,uid,vids}){
  const[placed,setPlaced]=useState([]);const[avail,setAvail]=useState([]);const[fb,setFb]=useState(null);const[ans,setAns]=useState('');const{idleMsg,poke}=useIdle(name,!fb);
  const[baAns,setBaAns]=useState({before:null,after:null});const[baOpts,setBaOpts]=useState([]);
  const[ytAns,setYtAns]=useState({ayer:null,manana:null});const[att,setAtt]=useState(0);const[showAns,setShowAns]=useState(null);
  useEffect(()=>{setFb(null);setAns('');setBaAns({before:null,after:null});setYtAns({ayer:null,manana:null});setAtt(0);setShowAns(null);stopVoice();
    if(ex.mode==='order_days'){const s=[...DIAS].sort(()=>Math.random()-.5);setAvail(s);setPlaced([]);setTimeout(()=>say('Ordena los días de la semana'),400)}
    else if(ex.mode==='order_months'){const s=[...MESES].sort(()=>Math.random()-.5);setAvail(s);setPlaced([]);setTimeout(()=>say('Ordena los meses del año'),400)}
    else if(ex.mode==='before_after_day'){const target=DIAS;const idx=ex.dayIdx;const max=target.length;const before=target[(idx-1+max)%max];const after=target[(idx+1)%max];const distractors=target.filter(d=>d!==before&&d!==after&&d!==ex.day);const picks=[before,after,...[...distractors].sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);setBaOpts(picks);setTimeout(()=>say('¿Qué día va antes y después de '+ex.day+'?'),400)}
    else if(ex.mode==='before_after_month'){const target=MESES;const idx=ex.monthIdx;const max=target.length;const before=target[(idx-1+max)%max];const after=target[(idx+1)%max];const distractors=target.filter(d=>d!==before&&d!==after&&d!==ex.month);const picks=[before,after,...[...distractors].sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);setBaOpts(picks);setTimeout(()=>say('¿Qué mes va antes y después de '+ex.month+'?'),400)}
    else{const hoy=DIAS[new Date().getDay()===0?6:new Date().getDay()-1];setTimeout(()=>say('Hoy es '+hoy+'. Ayer es el día de antes. Mañana es el día de después.'),400)}
    return()=>stopVoice()},[ex]);
  function place(item){poke();const np=[...placed];const slot=np.indexOf(null);if(slot!==-1)np[slot]=item;else np.push(item);setPlaced(np);setAvail(a=>a.filter(x=>x!==item));const target=ex.mode==='order_days'?DIAS:MESES;
    if(np.length===target.length&&np.every(d=>d!==null)){if(np.every((d,i)=>d===target[i])){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
    else{setFb('no');beep(200,200);const wrongNames=np.filter((d,i)=>d!==target[i]);sayFB(wrongNames.length===1?wrongNames[0]+' no va ahí':'Algunos no están en su sitio');setTimeout(()=>{const kept=np.map((d,i)=>d===target[i]?d:null);const wrong=np.filter((d,i)=>d!==target[i]);setPlaced(kept);setAvail([...wrong].sort(()=>Math.random()-.5));setFb(null)},2500)}}}
  function pickBA(slot,val){poke();const newAns={...baAns,[slot]:val};setBaAns(newAns);
    if(newAns.before&&newAns.after){const target=ex.mode==='before_after_day'?DIAS:MESES;const idx=ex.mode==='before_after_day'?ex.dayIdx:ex.monthIdx;const max=target.length;
      const correctBefore=target[(idx-1+max)%max];const correctAfter=target[(idx+1)%max];
      if(newAns.before===correctBefore&&newAns.after===correctAfter){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);stopVoice();sayFB('Antes: '+correctBefore+'. Después: '+correctAfter);if(na>=2){setShowAns({before:correctBefore,after:correctAfter});setTimeout(()=>{setFb(null);setBaAns({before:null,after:null})},4000)}else{setTimeout(()=>{setFb(null);setBaAns({before:null,after:null})},3000)}}}}
  function pickYT(slot,val){poke();const newAns={...ytAns,[slot]:val};setYtAns(newAns);
    if(newAns.ayer&&newAns.manana){const di=new Date().getDay()===0?6:new Date().getDay()-1;const correctAyer=DIAS[(di-1+7)%7];const correctMan=DIAS[(di+1)%7];
      if(newAns.ayer===correctAyer&&newAns.manana===correctMan){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);stopVoice();sayFB('Ayer fue '+correctAyer+' y mañana será '+correctMan);if(na>=2){setShowAns({ayer:correctAyer,manana:correctMan});setTimeout(()=>{setFb(null);setYtAns({ayer:null,manana:null})},4000)}else{setTimeout(()=>{setFb(null);setYtAns({ayer:null,manana:null})},3000)}}}}
  return <div style={{textAlign:'center',padding:'10px 14px'}} onClick={poke}>
    {(ex.mode==='order_days'||ex.mode==='order_months')&&<div>
      <div className="card" style={{padding:12,marginBottom:8}}><p style={{fontSize:18,fontWeight:700,margin:0,color:GOLD}}>{ex.mode==='order_days'?'Ordena los días':'Ordena los meses'}</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center',marginBottom:8,minHeight:36}}>{placed.map((d,i)=><span key={i} style={{background:GREEN+'33',borderRadius:6,padding:'5px 8px',fontSize:14,fontWeight:600,color:GREEN}}>{d}</span>)}</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:8}}>{avail.map(d=><button key={d} className="btn btn-b btn-word" onClick={()=>place(d)} style={{fontSize:14,padding:'8px 12px'}}>{d}</button>)}</div>
      {placed.length>0&&!fb&&<button className="btn btn-o" onClick={()=>{setPlaced([]);setAvail([...(ex.mode==='order_days'?DIAS:MESES)].sort(()=>Math.random()-.5))}} style={{fontSize:14,maxWidth:150,margin:'0 auto'}}>↩️ Borrar</button>}
    </div>}
    {(ex.mode==='before_after_day'||ex.mode==='before_after_month')&&<div>
      <div className="card" style={{padding:14,marginBottom:10}}><p style={{fontSize:18,fontWeight:700,margin:'0 0 4px',color:GOLD}}>{ex.mode==='before_after_day'?'¿Qué va antes y después?':'¿Qué mes va antes y después?'}</p><p style={{fontSize:28,fontWeight:700,color:BLUE,margin:0}}>{ex.mode==='before_after_day'?ex.day:ex.month}</p><p style={{fontSize:13,color:DIM,margin:'4px 0 0'}}>Antes = lo que viene justo antes. Después = lo que viene justo después.</p></div>
      <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:10}}>
        <div style={{flex:1,maxWidth:180}}>
          <p style={{fontSize:16,color:BLUE,margin:'0 0 6px',fontWeight:700}}>← ANTES</p>
          <div style={{minHeight:60,background:baAns.before?BLUE+'22':CARD,border:'3px solid '+(baAns.before?BLUE:BORDER),borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',padding:10}}>
            <span style={{fontSize:22,fontWeight:700,color:baAns.before?BLUE:DIM}}>{baAns.before||'___'}</span>
          </div>
        </div>
        <div style={{flex:1,maxWidth:180}}>
          <p style={{fontSize:16,color:'#E67E22',margin:'0 0 6px',fontWeight:700}}>DESPUÉS →</p>
          <div style={{minHeight:60,background:baAns.after?'#E67E22'+'22':CARD,border:'3px solid '+(baAns.after?'#E67E22':BORDER),borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',padding:10}}>
            <span style={{fontSize:22,fontWeight:700,color:baAns.after?'#E67E22':DIM}}>{baAns.after||'___'}</span>
          </div>
        </div>
      </div>
      {!fb&&<div style={{display:'flex',gap:16,marginBottom:12}}>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
          {baOpts.filter(o=>o!==baAns.before&&o!==baAns.after).map(o=><button key={o+'b'} className="btn btn-b btn-word" onClick={()=>pickBA('before',o)} style={{fontSize:18,padding:'14px 16px',width:'100%',background:BLUE,borderColor:'#2980b9',minHeight:52}} disabled={!!baAns.before}>← {o}</button>)}
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
          {baOpts.filter(o=>o!==baAns.before&&o!==baAns.after).map(o=><button key={o+'a'} className="btn btn-o btn-word" onClick={()=>pickBA('after',o)} style={{fontSize:18,padding:'14px 16px',width:'100%',minHeight:52}} disabled={!!baAns.after}>{o} →</button>)}
        </div>
      </div>}
      {!fb&&(baAns.before||baAns.after)&&<button className="btn btn-o" onClick={()=>setBaAns({before:null,after:null})} style={{fontSize:16,maxWidth:160,margin:'0 auto 8px'}}>↩️ Borrar</button>}
    </div>}
    {ex.mode==='yesterday_tomorrow'&&<div>
      <div className="card" style={{padding:14,marginBottom:10}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 4px',color:GOLD}}>Hoy es {DIAS[new Date().getDay()===0?6:new Date().getDay()-1]}</p><p style={{fontSize:14,color:DIM,margin:'0 0 4px'}}>¿Qué día fue ayer y cuál será mañana?</p><p style={{fontSize:13,color:BLUE,margin:0}}>Ayer = el día de antes. Mañana = el día de después.</p></div>
      <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:14}}>
        <div style={{flex:1,maxWidth:160}}>
          <p style={{fontSize:14,color:DIM,margin:'0 0 6px',fontWeight:700}}>AYER</p>
          <div style={{minHeight:48,background:ytAns.ayer?GREEN+'22':CARD,border:'2px solid '+(ytAns.ayer?GREEN:BORDER),borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:8}}>
            <span style={{fontSize:18,fontWeight:600,color:ytAns.ayer?GREEN:DIM}}>{ytAns.ayer||'___'}</span>
          </div>
        </div>
        <div style={{flex:1,maxWidth:160}}>
          <p style={{fontSize:14,color:DIM,margin:'0 0 6px',fontWeight:700}}>MAÑANA</p>
          <div style={{minHeight:48,background:ytAns.manana?GREEN+'22':CARD,border:'2px solid '+(ytAns.manana?GREEN:BORDER),borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:8}}>
            <span style={{fontSize:18,fontWeight:600,color:ytAns.manana?GREEN:DIM}}>{ytAns.manana||'___'}</span>
          </div>
        </div>
      </div>
      {!fb&&<div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:12}}>
        {DIAS.filter(d=>d!==ytAns.ayer&&d!==ytAns.manana).map(d=><div key={d} style={{display:'flex',flexDirection:'column',gap:3}}>
          <button className="btn btn-b btn-word" onClick={()=>pickYT('ayer',d)} style={{fontSize:13,padding:'6px 10px'}} disabled={!!ytAns.ayer}>{d}</button>
          <button className="btn btn-p btn-word" onClick={()=>pickYT('manana',d)} style={{fontSize:13,padding:'6px 10px'}} disabled={!!ytAns.manana}>{d}</button>
        </div>)}</div>}
      {!fb&&(ytAns.ayer||ytAns.manana)&&<button className="btn btn-o" onClick={()=>setYtAns({ayer:null,manana:null})} style={{fontSize:14,maxWidth:150,margin:'0 auto 8px'}}>↩️ Borrar</button>}
    </div>}
    {fb==='ok'&&<><CelebrationOverlay show={true} duration={1500}/><div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div></>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p>{showAns&&<p style={{fontSize:16,color:'#fff',fontWeight:600,margin:'8px 0 0'}}>{showAns.ayer?'Ayer = '+showAns.ayer+', Mañana = '+showAns.manana:showAns.before?'Antes = '+showAns.before+', Después = '+showAns.after:''}</p>}</div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}
