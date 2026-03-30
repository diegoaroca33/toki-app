import { useState, useEffect } from 'react'
import { GOLD, BLUE, GREEN, RED, PURPLE, BG3, BORDER, DIM, NUMS_1_100 } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { beep, mkPerfect } from '../utils.js'
import { NumPad, useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

export function genMath(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const ops=[];const rng=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  if(lv===1){for(let i=0;i<30;i++){const a=rng(1,10),b=rng(1,2);ops.push({q:`${a} + ${b}`,ans:a+b})}}
  else if(lv===2){for(let i=0;i<30;i++){const a=rng(5,20),b=Math.random()>.5?5:10;ops.push({q:`${a} + ${b}`,ans:a+b})}}
  else if(lv===3){for(let i=0;i<30;i++){const a=rng(3,15),b=rng(1,2);ops.push({q:`${a} - ${b}`,ans:a-b})}}
  else{for(let i=0;i<30;i++){if(Math.random()>.5){const a=rng(5,20),b=Math.random()>.5?5:10;ops.push({q:`${a} + ${b}`,ans:a+b})}else{const a=rng(5,20),b=Math.random()>.5?5:10;if(a>=b)ops.push({q:`${a} - ${b}`,ans:a-b});else ops.push({q:`${a} + ${b}`,ans:a+b})}}}
  return ops.sort(()=>Math.random()-.5)}

export function Fingers({n,color=GOLD,color2=null}){const c2=color2||(color===GOLD?BLUE:color===BLUE?GREEN:BLUE);const groups=[];let rem=n;while(rem>0){groups.push(Math.min(rem,5));rem-=5}
  const intensities=[1,.92,.85,.95,.88];
  return <div style={{display:'flex',gap:8,justifyContent:'center',margin:'8px 0',flexWrap:'wrap'}}>{groups.map((g,gi)=>{const baseC=gi%2===0?color:c2;return <div key={gi} style={{display:'flex',gap:2,position:'relative'}}>{g===5&&<svg width={n>15?54:74} height={48} style={{position:'absolute',top:-2,left:-2,pointerEvents:'none'}}><path d={`M2,6 Q${n>15?27:37},0 ${n>15?52:72},6`} fill="none" stroke="#8B4513" strokeWidth={2} strokeLinecap="round"/><path d={`M${n>15?27:37},0 L${n>15?27:37},4`} fill="none" stroke="#8B4513" strokeWidth={2}/></svg>}{Array.from({length:g},(_,i)=>{const idx=gi*5+i;const int=intensities[i%5];return <div key={i} style={{width:n>15?10:14,height:40,borderRadius:n>15?5:7,background:baseC,border:'2px solid rgba(0,0,0,.2)',opacity:int,transition:'all .5s '+(idx*.12)+'s'}}/>})}</div>})}</div>}

export function AnimCount({from,to,color=GREEN,speak=false}){const[cur,setCur]=useState(0);
  useEffect(()=>{setCur(0);let i=0;const interval=speak?1500:800;const t=setInterval(()=>{i++;setCur(i);if(speak&&i>=1){stopVoice();say(NUMS_1_100[i-1]||String(i))}if(i>=to){clearInterval(t);if(speak){stopVoice();setTimeout(()=>say('¡'+NUMS_1_100[to-1]+'!'),300);beep(880,150)}}},interval);return()=>{clearInterval(t);if(speak)stopVoice()}},[to,from,speak]);
  const sw=to>20?8:to>10?10:14;
  return <div style={{textAlign:'center'}}>
    <div style={{display:'flex',gap:to>20?2:4,justifyContent:'center',flexWrap:'wrap',margin:'8px 0',minHeight:50}}>{Array.from({length:to},(_,i)=><div key={i} style={{width:sw,height:46,borderRadius:Math.round(sw/2),background:i<cur?i<from?GOLD:color:BG3+'44',border:'2px solid '+(i<cur?'rgba(0,0,0,.2)':BORDER),transform:i<cur?'scaleY(1)':'scaleY(0.3)',transition:'all .6s',transformOrigin:'bottom',marginRight:(i+1)%5===0&&i<to-1?6:0}}/>)}</div>
    <div style={{fontSize:56,fontWeight:700,color:cur>=to?GREEN:GOLD,transition:'all .3s',minHeight:68}}>{cur>0?cur:''}</div>
  </div>}

function SubtractVisual({a,b,ans}){
  const[phase,setPhase]=useState(0);// 0=show all a, 1=cross out b, 2=done
  useEffect(()=>{setPhase(0);const t1=setTimeout(()=>setPhase(1),1200);const t2=setTimeout(()=>{setPhase(2);beep(880,150)},2400);return()=>{clearTimeout(t1);clearTimeout(t2)}},[a,b]);
  const sw=a>20?8:a>10?10:14;
  return <div style={{textAlign:'center'}}>
    <div style={{display:'flex',gap:a>20?2:4,justifyContent:'center',flexWrap:'wrap',margin:'8px 0',minHeight:50}}>{Array.from({length:a},(_,i)=>{
      const crossed=phase>=1&&i>=ans;
      return <div key={i} style={{width:sw,height:46,borderRadius:Math.round(sw/2),position:'relative',
        background:crossed?RED+'44':GOLD,border:'2px solid '+(crossed?RED+'66':'rgba(0,0,0,.2)'),
        opacity:crossed?(phase>=2?0.25:0.5):1,transform:crossed?'scaleY(0.7)':'scaleY(1)',
        transition:'all .5s',transformOrigin:'bottom',marginRight:(i+1)%5===0&&i<a-1?6:0}}>
        {crossed&&<div style={{position:'absolute',top:'50%',left:-2,right:-2,height:3,background:RED,borderRadius:2,transform:'rotate(-20deg)'}}/>}
      </div>})}</div>
    <p style={{fontSize:16,color:RED,fontWeight:700,margin:'4px 0'}}>{phase>=1?'Quitamos '+b:'Tenemos '+a}</p>
    <div style={{fontSize:56,fontWeight:700,color:phase>=2?GREEN:GOLD,transition:'all .3s',minHeight:68}}>{phase>=2?ans:a}</div>
  </div>}

export function ExMath({ex,onOk,onSkip,sex,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[showHelp,setShowHelp]=useState(false);const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  const parts=ex.q.match(/(\d+)\s*([+\-])\s*(\d+)/);const a=parts?parseInt(parts[1]):0,op=parts?parts[2]:'+',b=parts?parseInt(parts[3]):0;
  useEffect(()=>{setAns('');setFb(null);setShowHelp(false);resetOral();const t=setTimeout(()=>{stopVoice();const opW=ex.q.replace('+',' más ').replace('-',' menos ')+' es igual a...';say(opW)},500);return()=>{clearTimeout(t);stopVoice()}},[ex]);
  function check(){poke();const n=parseInt(ans);if(n===ex.ans){setFb('ok');starBeep(4);stopVoice();const opW=a+(op==='+'?' más ':' menos ')+b+' es igual a '+ex.ans;say(opW).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>{const nw=w=>(NUMS_1_100[w-1]||''+w).toLowerCase();const phrase=nw(a)+(op==='+'?' más ':' menos ')+nw(b)+' son '+nw(ex.ans);setTimeout(()=>triggerOral(phrase,4,1),250)})}else{setFb('no');setShowHelp(true);stopVoice();sayFB('¡Vamos a contarlo juntos!')}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}><p style={{fontSize:36,fontWeight:700,margin:0,fontFamily:'monospace'}}>{ex.q} = ?</p></div>
    {!showHelp&&!fb&&<div>
      <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:12}}>
        <div style={{textAlign:'center'}}><Fingers n={a} color={'#E67E22'} color2={'#E67E22'}/><p style={{fontSize:16,color:'#E67E22',margin:0,fontWeight:700}}>{a}</p></div>
        <div style={{fontSize:32,color:op==='+'?GREEN:RED,fontWeight:700,alignSelf:'center'}}>{op}</div>
        <div style={{textAlign:'center'}}><Fingers n={b} color={BLUE} color2={BLUE}/><p style={{fontSize:16,color:BLUE,margin:0,fontWeight:700}}>{b}</p></div>
      </div>
      <div style={{marginTop:16,paddingTop:8}}>
        <NumPad value={ans} onChange={setAns} onSubmit={check} maxLen={3}/>
      </div>
      <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:6}}><button className="btn btn-ghost btn-half skip-btn" style={{maxWidth:100}} onClick={()=>{stopVoice();onSkip()}}>⏭️</button></div>
    </div>}
    {fb==='ok'&&!oralPhrase&&<><div className="ab" style={{background:GREEN+'15',borderRadius:14,padding:20,marginBottom:14}}>
      <Stars n={4} sz={32}/>
      <AnimCount from={a} to={ex.ans} color={GREEN}/>
      <p style={{fontSize:24,color:GREEN,fontWeight:700,margin:'4px 0 0'}}>{a} {op} {b} = {ex.ans}</p>
    </div></>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {showHelp&&fb==='no'&&<div className="af" style={{background:GOLD+'0C',borderRadius:14,padding:20,marginBottom:14}}>
      <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>¡Vamos a contarlo juntos!</p>
      {op==='+'&&<AnimCount from={a} to={ex.ans} color={GREEN} speak={true}/>}
      {op==='-'&&<SubtractVisual a={a} b={b} ans={ex.ans}/>}
      <Fingers n={ex.ans} color={GREEN}/>
      <p style={{fontSize:24,color:GREEN,fontWeight:700,margin:'8px 0 0'}}>{a} {op} {b} = {ex.ans}</p>
      <button className="btn btn-g" onClick={()=>{setAns('');setFb(null);setShowHelp(false)}} style={{marginTop:12,fontSize:18}}>🔄 Intentar otra vez</button>
      <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:8,fontSize:16}}>⏭️ Siguiente</button>
    </div>}
    {idleMsg&&!fb&&!showHelp&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
  </div>}
