import { useState, useEffect, useRef } from 'react'
import { GOLD, GREEN, PURPLE, CARD, BORDER, TXT, DIM } from '../constants.js'
import { say, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { mkPerfect } from '../utils.js'
import { NumPad, useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

// ===== MULTIPLICACIONES =====
export function genMulti(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const ops=[];const rng=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  if(lv===1){for(let i=0;i<20;i++){const f=Math.random()>.5?2:3;const n=rng(1,5);ops.push({a:n,b:f,ans:n*f})}}
  else if(lv===2){for(let i=0;i<20;i++){const f=Math.random()>.5?5:10;const n=rng(1,10);ops.push({a:n,b:f,ans:n*f})}}
  else{for(let i=0;i<20;i++){const f=[2,3,5,10][rng(0,3)];const n=rng(1,10);ops.push({a:n,b:f,ans:n*f})}}
  return ops.sort(()=>Math.random()-.5)}

export function ExMulti({ex,onOk,onSkip,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[showHelp,setShowHelp]=useState(false);const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  const[countIdx,setCountIdx]=useState(-1); // counting animation: index of currently highlighted item (0-based, across all groups)
  const countTimer=useRef(null);
  const totalItems=ex.a*ex.b;
  const groups=Array.from({length:ex.b},(_,i)=>i);const emojis=['🍎','🌟','🔵','🟢','🟡','🟣','🔴','🍊','🍋','💎'];const em=emojis[ex.a%emojis.length];
  useEffect(()=>{setAns('');setFb(null);setShowHelp(false);setCountIdx(-1);if(countTimer.current)clearInterval(countTimer.current);resetOral();stopVoice();setTimeout(()=>say(ex.a+' por '+ex.b),400);return()=>{stopVoice();if(countTimer.current)clearInterval(countTimer.current)}},[ex]);
  // Start counting animation when help is shown
  useEffect(()=>{if(showHelp&&fb==='no'){setCountIdx(0);let c=0;countTimer.current=setInterval(()=>{c++;if(c>=totalItems){clearInterval(countTimer.current);countTimer.current=null;setCountIdx(totalItems-1)}else{setCountIdx(c)}},400)}return()=>{if(countTimer.current){clearInterval(countTimer.current);countTimer.current=null}}},[showHelp,fb]);
  function check(){poke();const n=parseInt(ans);if(n===ex.ans){setFb('ok');starBeep(4);stopVoice();say(ex.a+' por '+ex.b+' es igual a '+ex.ans).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>{const phrase=ex.a+' por '+ex.b+' son '+ex.ans;setTimeout(()=>triggerOral(phrase,4,1),250)})}
  else{setFb('no');setShowHelp(true);stopVoice();const sumText=Array(ex.b).fill(ex.a).join(' más ')+' es igual a '+ex.ans;say('Mira: '+ex.a+' por '+ex.b+' es '+sumText,0.75)}}
  // Render items with counting highlight
  const renderGroups=(highlighted)=>{let globalIdx=0;return groups.map(g=><div key={g} style={{display:'flex',gap:2,background:CARD,border:'2px solid '+(highlighted&&countIdx>=g*ex.a&&countIdx<(g+1)*ex.a?GOLD:BORDER),borderRadius:10,padding:'6px 10px',transition:'border-color .2s'}}>{Array.from({length:ex.a},(_,j)=>{const myIdx=globalIdx++;const isHighlighted=highlighted&&myIdx<=countIdx;const isCurrent=highlighted&&myIdx===countIdx;return <span key={j} style={{fontSize:isHighlighted?24:20,transition:'font-size .15s, opacity .15s',opacity:isHighlighted?1:highlighted?0.4:1,filter:isCurrent?'drop-shadow(0 0 6px '+GOLD+')':'none'}}>{em}</span>})}</div>)};
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}><p style={{fontSize:36,fontWeight:700,margin:0,fontFamily:'monospace'}}>{ex.a} x {ex.b} = {showHelp&&fb==='no'&&countIdx>=0?<span style={{color:GREEN,fontWeight:700}}>{countIdx+1}</span>:'?'}</p></div>
    <div style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center',marginBottom:16}}>{renderGroups(showHelp&&fb==='no')}</div>
    {!showHelp&&!fb&&<div>
      <NumPad value={ans} onChange={setAns} onSubmit={check} maxLen={3}/>
      <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:6}}><button className="btn btn-ghost btn-half skip-btn" style={{maxWidth:100}} onClick={()=>{stopVoice();onSkip()}}>⏭️</button></div>
    </div>}
    {fb==='ok'&&!oralPhrase&&<><div className="ab" style={{background:GREEN+'15',borderRadius:14,padding:20,marginBottom:14}}>
      <Stars n={4} sz={32}/><p style={{fontSize:24,color:GREEN,fontWeight:700,margin:'8px 0 0'}}>{ex.a} x {ex.b} = {ex.ans}</p>
    </div></>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {showHelp&&fb==='no'&&<div className="af" style={{background:GOLD+'0C',borderRadius:14,padding:20,marginBottom:14}}>
      <p style={{fontSize:18,fontWeight:600,margin:'0 0 12px',color:GOLD}}>¡Vamos a contarlos!</p>
      <p style={{fontSize:20,color:TXT,margin:'0 0 8px'}}>{Array(ex.b).fill(ex.a).join(' + ')} = <span style={{color:GREEN,fontWeight:700}}>{ex.ans}</span></p>
      <button className="btn" onClick={()=>{setAns('');setFb(null);setShowHelp(false);setCountIdx(-1);if(countTimer.current){clearInterval(countTimer.current);countTimer.current=null}}} style={{marginTop:12,fontSize:16,padding:'10px 28px',borderRadius:14,background:GREEN,color:'#FFF',fontWeight:600}}>🔄 Intentar</button>
      <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:8,fontSize:16}}>⏭️ Siguiente</button>
    </div>}
    {idleMsg&&!fb&&!showHelp&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
  </div>}
