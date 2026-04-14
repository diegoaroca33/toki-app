import { useState, useEffect, useMemo } from 'react'
import { GOLD, BLUE, GREEN, RED, BG3, TXT, DIM } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { beep, mkPerfect } from '../utils.js'
import { useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

// ===== LA HORA =====
export function clockText(h,m){if(m===0)return h===1?'la una en punto':'las '+h+' en punto';if(m===30)return(h===1?'la una':'las '+h)+' y media';if(m===15)return(h===1?'la una':'las '+h)+' y cuarto';const nh=h===12?1:h+1;return(nh===1?'la una':'las '+nh)+' menos cuarto'}

export function genClock(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const items=[];
  if(lv===1){for(let h=1;h<=12;h++)items.push({ty:'clock',h,m:0,text:clockText(h,0),id:'clk_'+h+'_0'})}
  else if(lv===2){for(let h=1;h<=12;h++){items.push({ty:'clock',h,m:30,text:clockText(h,30),id:'clk_'+h+'_30'})}}
  else{for(let h=1;h<=12;h++){items.push({ty:'clock',h,m:15,text:clockText(h,15),id:'clk_'+h+'_15'});items.push({ty:'clock',h,m:45,text:clockText(h,45),id:'clk_'+h+'_45'})}}
  return items.sort(()=>Math.random()-.5)}

export function ClockFace({h,m,size=160}){
  const cx=size/2,cy=size/2,r=size/2-8;
  const mAngle=(m/60)*360-90,hAngle=((h%12)/12)*360+(m/60)*30-90;
  const mr=r*0.7,hr=r*0.5;
  return <svg width={size} height={size}>
    <circle cx={cx} cy={cy} r={r} fill={BG3} stroke={GOLD} strokeWidth={3}/>
    {Array.from({length:12},(_,i)=>{const a=((i+1)/12)*360-90;const x=cx+(r-16)*Math.cos(a*Math.PI/180);const y=cy+(r-16)*Math.sin(a*Math.PI/180);return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={TXT} fontSize={size>120?16:12} fontWeight={700} fontFamily="Fredoka">{i+1}</text>})}
    <line x1={cx} y1={cy} x2={cx+hr*Math.cos(hAngle*Math.PI/180)} y2={cy+hr*Math.sin(hAngle*Math.PI/180)} stroke={GOLD} strokeWidth={4} strokeLinecap="round"/>
    <line x1={cx} y1={cy} x2={cx+mr*Math.cos(mAngle*Math.PI/180)} y2={cy+mr*Math.sin(mAngle*Math.PI/180)} stroke={BLUE} strokeWidth={3} strokeLinecap="round"/>
    <circle cx={cx} cy={cy} r={4} fill={GOLD}/>
  </svg>}

export function ExClock({ex,onOk,onSkip,name,uid,vids}){
  const opts=useMemo(()=>{const correct=ex.text;const pool=[];for(let h=1;h<=12;h++){for(const m of [0,15,30,45]){const t=clockText(h,m);if(t!==correct)pool.push(t)}}const wrong=[];const shuffled=[...pool].sort(()=>Math.random()-.5);for(const t of shuffled){if(wrong.length>=3)break;if(t!==correct&&!wrong.includes(t))wrong.push(t)}const result=[...wrong,correct];const unique=[...new Set(result)];if(!unique.includes(correct)){unique.pop();unique.push(correct)}while(unique.length<4){const extra=pool[Math.floor(Math.random()*pool.length)];if(!unique.includes(extra))unique.push(extra)}return unique.slice(0,4).sort(()=>Math.random()-.5)},[ex]);
  const[fb,setFb]=useState(null);const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  useEffect(()=>{setFb(null);resetOral();stopVoice();setTimeout(()=>say('¿Qué hora es?'),400);return()=>stopVoice()},[ex]);
  // Build natural explanation like a teacher
  function buildExplanation(){
    const nh=ex.h===12?1:ex.h+1;
    if(ex.m===0)return{short:'Son '+ex.text,voice:'Fíjate en la aguja pequeña: apunta al '+ex.h+'. Y la grande está en el 12, arriba, eso es en punto. Son '+ex.text+'.',hrText:'La pequeña apunta al '+ex.h,minText:'La grande está en el 12 = en punto',minNum:'12'};
    if(ex.m===30)return{short:'Son '+ex.text,voice:'Fíjate en la aguja pequeña: pasa del '+ex.h+'. Y la grande está en el 6, abajo, eso es y media. Son '+ex.text+'.',hrText:'La pequeña pasa del '+ex.h,minText:'La grande está en el 6 = y media',minNum:'6'};
    if(ex.m===15)return{short:'Son '+ex.text,voice:'Fíjate en la aguja pequeña: pasa del '+ex.h+'. Y la grande está en el 3, eso es un cuarto. Son '+ex.text+'.',hrText:'La pequeña pasa del '+ex.h,minText:'La grande está en el 3 = y cuarto',minNum:'3'};
    return{short:'Son '+ex.text,voice:'Fíjate en la aguja pequeña: está llegando al '+nh+'. Y la grande está en el 9, eso es menos cuarto. Son '+ex.text+'.',hrText:'La pequeña llega al '+nh,minText:'La grande está en el 9 = menos cuarto',minNum:'9'};
  }
  function pick(t){poke();
    if(t===ex.text){
      const expl=buildExplanation();
      setFb('ok');starBeep(4);stopVoice();
      // Cuando acierta: explica brevemente Y dice la hora
      say(expl.voice).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>{setTimeout(()=>triggerOral('son '+ex.text,4,1),250)})
    }else{
      const expl=buildExplanation();
      setFb('no');beep(200,200);
      // Cuando falla: explicación completa como un profesor
      // Visual permanece hasta que TTS termine + 1.5s para asimilar
      sayFB(expl.voice).then(()=>setTimeout(()=>setFb(null),1500));
    }}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 14px',color:GOLD}}>¿Qué hora es?</p>
      <div style={{display:'flex',justifyContent:'center'}}><ClockFace h={ex.h} m={ex.m}/></div></div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>{opts.map((o,i)=><button key={i} className={'btn '+(fb==='ok'&&o===ex.text?'btn-g':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:18,textAlign:'left'}}>{o.charAt(0).toUpperCase()+o.slice(1)}</button>)}</div>
    {fb==='ok'&&!oralPhrase&&(()=>{const expl=buildExplanation();return <div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}>
      <Stars n={4} sz={36}/>
      <p style={{fontSize:18,fontWeight:700,color:GREEN,margin:'8px 0 0'}}>{expl.short.charAt(0).toUpperCase()+expl.short.slice(1)}</p>
    </div>})()}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&(()=>{const expl=buildExplanation();return <div className="as" style={{background:'rgba(255,255,255,.06)',borderRadius:16,padding:18,marginTop:14,border:'2px solid rgba(255,255,255,.1)'}}>
      <p style={{fontSize:18,fontWeight:700,color:GOLD,margin:'0 0 12px'}}>Fíjate bien:</p>
      <div style={{display:'flex',alignItems:'center',gap:20,justifyContent:'center',flexWrap:'wrap'}}>
        {/* Mini reloj señalando la respuesta */}
        <div style={{position:'relative'}}>
          <ClockFace h={ex.h} m={ex.m} size={120}/>
          {/* Flecha señalando aguja pequeña */}
          <div style={{position:'absolute',top:4,left:4,fontSize:11,color:GOLD,fontWeight:700,background:'rgba(0,0,0,.6)',borderRadius:6,padding:'2px 6px'}}>← pequeña</div>
          {/* Flecha señalando aguja grande */}
          <div style={{position:'absolute',bottom:4,right:4,fontSize:11,color:BLUE,fontWeight:700,background:'rgba(0,0,0,.6)',borderRadius:6,padding:'2px 6px'}}>← grande</div>
        </div>
        <div style={{textAlign:'left',maxWidth:220}}>
          {/* Paso 1: aguja pequeña */}
          <div style={{marginBottom:8}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:20,height:4,background:GOLD,borderRadius:2,flexShrink:0}}/>
              <span style={{fontSize:14,fontWeight:700,color:GOLD}}>Aguja pequeña:</span>
            </div>
            <p style={{fontSize:15,color:'#fff',margin:'2px 0 0 26px',fontWeight:600}}>{expl.hrText}</p>
          </div>
          {/* Paso 2: aguja grande */}
          <div style={{marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:28,height:3,background:BLUE,borderRadius:2,flexShrink:0}}/>
              <span style={{fontSize:14,fontWeight:700,color:BLUE}}>Aguja grande:</span>
            </div>
            <p style={{fontSize:15,color:'#fff',margin:'2px 0 0 34px',fontWeight:600}}>{expl.minText}</p>
          </div>
          {/* Resultado */}
          <div style={{background:GREEN+'22',borderRadius:10,padding:'8px 12px',textAlign:'center'}}>
            <p style={{fontSize:18,fontWeight:800,color:GREEN,margin:0}}>{expl.short.charAt(0).toUpperCase()+expl.short.slice(1)}</p>
          </div>
        </div>
      </div>
    </div>})()}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}

// DEV: verify ExClock options always contain the correct answer
if(import.meta.env.DEV){(()=>{let fails=0;for(const lv of [1,2,3]){const exs=genClock(lv);for(let i=0;i<20;i++){const ex=exs[i%exs.length];const correct=ex.text;const pool=[];for(let h=1;h<=12;h++){for(const m of [0,15,30,45]){const t=clockText(h,m);if(t!==correct)pool.push(t)}}const wrong=[];const shuffled=[...pool].sort(()=>Math.random()-.5);for(const t of shuffled){if(wrong.length>=3)break;if(t!==correct&&!wrong.includes(t))wrong.push(t)}const result=[...wrong,correct];const unique=[...new Set(result)];if(!unique.includes(correct)){fails++;console.error('ExClock BUG: correct answer missing!',{correct,unique,lv,ex})}if(unique.length!==4){fails++;console.error('ExClock BUG: expected 4 options, got '+unique.length,{correct,unique,lv})}}}console.log('[ExClock test] '+(fails===0?'PASS: all 60 tests OK':'FAIL: '+fails+' failures'))})()}
