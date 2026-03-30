import { useState, useEffect, useRef, useMemo } from 'react'
import { GOLD, DIM, BG3, CARD, BORDER } from '../constants.js'
import { NUMS_1_100 } from '../constants.js'
import { say, sayFast, stopVoice } from '../voice.js'
import { starBeep, cheerOrSay } from '../voice.js'
import { mkPerfect } from '../utils.js'
import { OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

export const NUM_BLOCK_COLORS=['#E74C3C','#3498DB','#F1C40F','#2ECC71','#9B59B6','#E67E22','#1ABC9C','#E91E63','#00BCD4','#FF5722'];
const SPEED_PRESETS=[
  {key:'slow',label:'🐢 Lento',ms:1200},
  {key:'normal',label:'🚶 Normal',ms:800},
  {key:'fast',label:'🐇 Rápido',ms:400},
];
function loadSpeed(){try{return localStorage.getItem('toki_count_speed')||'normal'}catch(e){return'normal'}}
function saveSpeed(k){try{localStorage.setItem('toki_count_speed',k)}catch(e){}}

export function ExCount({ex,onOk,onSkip,sex,name,uid,vids}){
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  const nums=ex.nums||[ex.num];
  const[ci,setCi]=useState(-1);
  const[phase,setPhase]=useState('ready');
  const[revealed,setRevealed]=useState(new Set());
  const[speedKey,setSpeedKey]=useState(loadSpeed);
  const alive=useRef(true);
  const ttsPlaying=useRef(false);
  const speedRef=useRef(SPEED_PRESETS.find(s=>s.key===loadSpeed())||SPEED_PRESETS[1]);
  const batchSet=useMemo(()=>new Set(nums),[nums]);
  // Build grid rows: show decades containing batch nums + context
  const gridRows=useMemo(()=>{
    const minD=Math.floor((Math.min(...nums)-1)/10);
    const maxD=Math.floor((Math.max(...nums)-1)/10);
    const lo=Math.max(0,minD-1),hi=Math.min(9,maxD+1);
    const rows=[];
    for(let d=hi;d>=lo;d--){const r=[];for(let c=0;c<10;c++){const n=d*10+c+1;if(n<=100)r.push(n)}rows.push({nums:r,decade:d,isCurrent:d>=minD&&d<=maxD,isFuture:d>maxD,isPast:d<minD})}
    return rows;
  },[nums]);
  function handleSpeed(k){
    setSpeedKey(k);saveSpeed(k);
    const p=SPEED_PRESETS.find(s=>s.key===k)||SPEED_PRESETS[1];
    speedRef.current=p;
  }
  useEffect(()=>{
    alive.current=true;setCi(-1);setPhase('ready');setRevealed(new Set());resetOral();stopVoice();
    const t=setTimeout(()=>{if(alive.current)runSequence()},500);
    const sosKill=()=>{alive.current=false;clearTimeout(t);stopVoice()};
    window.addEventListener('toki-sos',sosKill);
    return()=>{alive.current=false;clearTimeout(t);stopVoice();window.removeEventListener('toki-sos',sosKill)}},[ex]);
  async function runSequence(){
    for(let i=0;i<nums.length;i++){
      if(!alive.current)return;
      const n=nums[i];setCi(i);
      setRevealed(prev=>{const s=new Set(prev);s.add(n);return s});
      setPhase('toki');stopVoice();
      const text=NUMS_1_100[n-1]||String(n);
      ttsPlaying.current=true;
      await sayFast(text);
      ttsPlaying.current=false;
      if(!alive.current)return;
      // Continuous counting: just a brief pause based on speed, no recording
      const baseDelay=speedRef.current.ms;
      const wordBuffer=text.length*20;
      await new Promise(r=>setTimeout(r,Math.max(150,baseDelay+wordBuffer-500)));
    }
    if(!alive.current)return;setPhase('done');setCi(-1);
    starBeep(4);await cheerOrSay(mkPerfect(name),uid,vids,'perfect');
    if(alive.current){const last=nums[nums.length-1];const phrase=NUMS_1_100[last-1]||String(last);setTimeout(()=>triggerOral(phrase,4,1),300)}
  }
  const curNum=ci>=0?nums[ci]:null;
  return <div style={{textAlign:'center',padding:'10px 4px'}}>
    <div style={{marginBottom:8,display:'flex',alignItems:'center',justifyContent:'space-between',minHeight:72,padding:'0 8px'}}>
      <p style={{fontSize:20,fontWeight:700,color:GOLD,margin:0,flexShrink:0}}>{phase==='done'?'🎉 ¡Genial!':phase==='ready'?'🔢 Cuenta conmigo...':'🔢 ¡Cuenta!'}</p>
      <div style={{display:'flex',alignItems:'baseline',gap:10,minWidth:120,justifyContent:'flex-end',minHeight:68}}>
        {curNum&&phase!=='done'&&<>
          <p style={{fontSize:64,fontWeight:800,color:'#fff',margin:0,animation:phase==='child'?'pulse .6s infinite':'none',textShadow:'0 0 24px '+NUM_BLOCK_COLORS[(curNum-1)%10],lineHeight:1}}>{curNum}</p>
          <p style={{fontSize:18,color:DIM,margin:0,fontStyle:'italic',fontWeight:600}}>{NUMS_1_100[curNum-1]}</p>
        </>}
      </div>
    </div>
    <div style={{padding:8,borderRadius:16,background:CARD,border:'2px solid '+BORDER,marginBottom:8}}>
      {gridRows.map((row,ri)=><div key={ri} style={{display:'grid',gridTemplateColumns:'repeat(10,1fr)',gap:3,marginBottom:ri<gridRows.length-1?3:0,opacity:row.isFuture?0.2:row.isPast?0.65:1,transition:'opacity .4s'}}>
        {row.nums.map(n=>{
          const inBatch=batchSet.has(n);const rev=revealed.has(n)||row.isPast;const cur=n===curNum;
          const bc=NUM_BLOCK_COLORS[(n-1)%10];
          return <div key={n} style={{aspectRatio:'1',borderRadius:7,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',
            background:rev?bc:(inBatch?bc+'22':BG3+'88'),
            border:cur?'2.5px solid #fff':(rev?'1.5px solid '+bc+'55':'1.5px solid '+BORDER),
            transform:cur?'scale(1.15)':'scale(1)',transition:'all .25s cubic-bezier(.34,1.56,.64,1)',
            boxShadow:cur?'0 0 16px '+bc+'aa':'none',
            animation:cur&&phase==='child'?'pulse .5s infinite':(rev&&inBatch?'countNum .35s ease-out':'none'),overflow:'hidden',
          }}>
            <span style={{fontSize:cur?26:20,fontWeight:800,color:rev?'#fff':(inBatch?'#aaa':'#666'),lineHeight:1,zIndex:1}}>{n}</span>
            {rev&&inBatch&&<div style={{display:'flex',gap:2,marginTop:2,flexWrap:'wrap',justifyContent:'center',maxWidth:32,minHeight:7,alignItems:'center'}}>
              {Array.from({length:Math.floor(n/10)},(_,ti)=><div key={'t'+ti} style={{width:12,height:5,borderRadius:2.5,background:'rgba(255,255,255,.85)',flexShrink:0}}/>)}
              {Array.from({length:n%10},(_,di)=><div key={'d'+di} style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,255,255,.9)',flexShrink:0}}/>)}
            </div>}
            {rev&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:'30%',background:'linear-gradient(transparent,rgba(0,0,0,.15))',borderRadius:'0 0 7px 7px'}}/>}
          </div>})}
      </div>)}
    </div>
    {phase==='done'&&!oralPhrase&&<><div className="ab" style={{marginTop:8}}><Stars n={4} sz={36}/></div></>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {phase==='toki'&&curNum&&<p style={{fontSize:14,color:DIM,margin:'8px 0 0',fontWeight:600}}>🔊 ¡Cuenta conmigo!</p>}
    {/* Speed controls removed — will become slider in future */}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();alive.current=false;onSkip()}} style={{marginTop:4}}>⏭️ Saltar</button>
  </div>}
