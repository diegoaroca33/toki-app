import { useState, useEffect } from 'react'
import { GOLD, GREEN, PURPLE, CARD, BORDER, TXT, DIM } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { mkPerfect } from '../utils.js'
import { NumPad, useIdle } from '../components/UIKit.jsx'
import { CelebrationOverlay, Stars } from '../components/CelebrationOverlay.jsx'

// ===== MULTIPLICACIONES =====
export function genMulti(lv){const ops=[];const rng=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  if(lv===1){for(let i=0;i<20;i++){const f=Math.random()>.5?2:3;const n=rng(1,10);ops.push({a:n,b:f,ans:n*f})}}
  else if(lv===2){for(let i=0;i<20;i++){const f=Math.random()>.5?5:10;const n=rng(1,10);ops.push({a:n,b:f,ans:n*f})}}
  else{for(let i=0;i<20;i++){const f=[2,3,5,10][rng(0,3)];const n=rng(1,10);ops.push({a:n,b:f,ans:n*f})}}
  return ops.sort(()=>Math.random()-.5)}

export function ExMulti({ex,onOk,onSkip,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[showHelp,setShowHelp]=useState(false);const{idleMsg,poke}=useIdle(name,!fb);
  const groups=Array.from({length:ex.b},(_,i)=>i);const emojis=['🍎','🌟','🔵','🟢','🟡','🟣','🔴','🍊','🍋','💎'];const em=emojis[ex.a%emojis.length];
  useEffect(()=>{setAns('');setFb(null);setShowHelp(false);stopVoice();setTimeout(()=>say(ex.a+' por '+ex.b),400);return()=>stopVoice()},[ex]);
  function check(){poke();const n=parseInt(ans);if(n===ex.ans){setFb('ok');starBeep(4);stopVoice();say(ex.a+' por '+ex.b+' es igual a '+ex.ans).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(onOk,250))}
  else{setFb('no');setShowHelp(true);stopVoice();const sumText=Array(ex.b).fill(ex.a).join(' más ')+' es igual a '+ex.ans;sayFB('Mira: '+ex.a+' por '+ex.b+' es '+sumText)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}><p style={{fontSize:36,fontWeight:700,margin:0,fontFamily:'monospace'}}>{ex.a} x {ex.b} = ?</p></div>
    <div style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center',marginBottom:16}}>{groups.map(g=><div key={g} style={{display:'flex',gap:2,background:CARD,border:'2px solid '+BORDER,borderRadius:10,padding:'6px 10px'}}>{Array.from({length:ex.a},(_,j)=><span key={j} style={{fontSize:20}}>{em}</span>)}</div>)}</div>
    {!showHelp&&!fb&&<div>
      <NumPad value={ans} onChange={setAns} onSubmit={check} maxLen={3}/>
      <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:6}}><button className="btn btn-ghost btn-half skip-btn" style={{maxWidth:100}} onClick={()=>{stopVoice();onSkip()}}>⏭️</button></div>
    </div>}
    {fb==='ok'&&<><CelebrationOverlay show={true} duration={1500}/><div className="ab" style={{background:GREEN+'15',borderRadius:14,padding:20,marginBottom:14}}>
      <Stars n={4} sz={32}/><p style={{fontSize:24,color:GREEN,fontWeight:700,margin:'8px 0 0'}}>{ex.a} x {ex.b} = {ex.ans}</p>
    </div></>}
    {showHelp&&fb==='no'&&<div className="af" style={{background:GOLD+'0C',borderRadius:14,padding:20,marginBottom:14}}>
      <p style={{fontSize:18,fontWeight:600,margin:'0 0 12px',color:GOLD}}>¡Vamos a sumarlos!</p>
      <p style={{fontSize:20,color:TXT,margin:'0 0 8px'}}>{Array(ex.b).fill(ex.a).join(' + ')} = <span style={{color:GREEN,fontWeight:700}}>{ex.ans}</span></p>
      <button className="btn btn-g" onClick={()=>{setAns('');setFb(null);setShowHelp(false)}} style={{marginTop:12,fontSize:18}}>🔄 Intentar</button>
      <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:8,fontSize:16}}>⏭️ Siguiente</button>
    </div>}
    {idleMsg&&!fb&&!showHelp&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
  </div>}
