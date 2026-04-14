import { useState, useEffect } from 'react'
import { GOLD, BLUE, GREEN, RED, PURPLE, BG3, BORDER, DIM, NUMS_1_100 } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { beep, mkPerfect } from '../utils.js'
import { NumPad, useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

const COUNT_EMOJIS=['🐥','🍎','🚗','🌸','🐟','🦋','🎈','🐕','🐱','🍊','⭐','🌻','🐸','🍓','🐧'];
// Generate "count objects" exercises (visual, pre-abstract)
export function genCountObjects(){const sh=a=>[...a].sort(()=>Math.random()-.5);const ops=[];
  for(let i=0;i<20;i++){const n=2+Math.floor(Math.random()*8); // 2-9 objects
    const em=COUNT_EMOJIS[Math.floor(Math.random()*COUNT_EMOJIS.length)];
    ops.push({q:'¿Cuántos hay?',ans:n,emoji:em,mode:'count_objects'})}
  return sh(ops)}
// Generate "add with objects" exercises (visual addition)
export function genAddObjects(){const sh=a=>[...a].sort(()=>Math.random()-.5);const ops=[];
  for(let i=0;i<20;i++){const a=1+Math.floor(Math.random()*5),b=1+Math.floor(Math.random()*4);
    const em=COUNT_EMOJIS[Math.floor(Math.random()*COUNT_EMOJIS.length)];
    ops.push({q:`${a} + ${b}`,ans:a+b,a,b,emoji:em,mode:'add_objects'})}
  return sh(ops)}

// Generate word problems with context (Pictociencia-inspired)
const WORD_PROB_TEMPLATES=[
  {t:'{N} tiene {a} {E} y le dan {b} más. ¿Cuántas tiene?',op:'+',oral:'{N} tiene {ans} {E} en total'},
  {t:'{N} tiene {a} {E} y pierde {b}. ¿Cuántas le quedan?',op:'-',oral:'Le quedan {ans} {E}'},
  {t:'Hay {a} {E} en una caja y {b} en otra. ¿Cuántas hay en total?',op:'+',oral:'Hay {ans} {E} en total'},
  {t:'{N} compra {a} {E} y {N2} compra {b}. ¿Cuántas tienen entre los dos?',op:'+',oral:'Tienen {ans} {E} entre los dos'},
  {t:'En el parque hay {a} {E}. Se van {b}. ¿Cuántas quedan?',op:'-',oral:'Quedan {ans} {E}'},
  {t:'{N} tiene {a} {E}. Regala {b} a su amigo. ¿Cuántas le quedan?',op:'-',oral:'Le quedan {ans} {E}'},
];
const WP_NAMES=['Guillermo','María','Pablo','Sara','Lucas','Elena','Hugo','Alba'];
const WP_OBJECTS=[{e:'🍎',n:'manzanas'},{e:'🍬',n:'chuches'},{e:'⭐',n:'estrellas'},{e:'📚',n:'libros'},{e:'🖍️',n:'pinturas'},{e:'🧸',n:'peluches'},{e:'🍪',n:'galletas'},{e:'⚽',n:'pelotas'},{e:'🎈',n:'globos'},{e:'🌸',n:'flores'}];
export function genWordProblems(){const sh=a=>[...a].sort(()=>Math.random()-.5);const ops=[];const rng=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  for(let i=0;i<20;i++){
    const tpl=WORD_PROB_TEMPLATES[Math.floor(Math.random()*WORD_PROB_TEMPLATES.length)];
    const obj=WP_OBJECTS[Math.floor(Math.random()*WP_OBJECTS.length)];
    const n1=WP_NAMES[Math.floor(Math.random()*WP_NAMES.length)];
    let n2=WP_NAMES[Math.floor(Math.random()*WP_NAMES.length)];while(n2===n1)n2=WP_NAMES[Math.floor(Math.random()*WP_NAMES.length)];
    let a,b,ans;
    if(tpl.op==='+'){a=rng(2,10);b=rng(1,8);ans=a+b}else{a=rng(5,15);b=rng(1,a-1);ans=a-b}
    const text=tpl.t.replace(/\{N\}/g,n1).replace(/\{N2\}/g,n2).replace(/\{a\}/g,a).replace(/\{b\}/g,b).replace(/\{E\}/g,obj.n);
    const oral=tpl.oral.replace(/\{ans\}/g,ans).replace(/\{E\}/g,obj.n).replace(/\{N\}/g,n1);
    ops.push({q:text,ans,emoji:obj.e,a,b,oral,mode:'word_problem'})}
  return sh(ops)}

export function genMath(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const ops=[];const rng=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  if(lv===5){return genCountObjects()} // Nivel visual: contar objetos
  if(lv===6){return genAddObjects()} // Nivel visual: sumas con objetos
  if(lv===7){return genWordProblems()} // Nivel verbal: problemas con contexto
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

// Visual mode: Count objects
function ExCountObjects({ex,onOk,onSkip,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  useEffect(()=>{setAns('');setFb(null);resetOral();stopVoice();setTimeout(()=>say('¿Cuántos '+ex.emoji+' hay?'),400);return()=>stopVoice()},[ex]);
  function check(){poke();const n=parseInt(ans);if(n===ex.ans){setFb('ok');starBeep(4);stopVoice();
    say('Hay '+ex.ans).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>{const nw=(NUMS_1_100[ex.ans-1]||''+ex.ans).toLowerCase();triggerOral('hay '+nw,4,1)})}
    else{setFb('no');stopVoice();sayFB('Cuenta bien, hay '+ex.ans);setTimeout(()=>setFb(null),2000)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <p style={{fontSize:22,fontWeight:700,color:GOLD,margin:'0 0 12px'}}>¿Cuántos hay?</p>
    <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',padding:16,background:'rgba(255,255,255,.06)',borderRadius:20,border:'2px solid rgba(255,255,255,.1)',marginBottom:16,minHeight:80}}>
      {Array.from({length:ex.ans}).map((_,i)=><span key={i} style={{fontSize:40,animation:`bounceIn ${0.2+i*0.08}s ease-out`}}>{ex.emoji}</span>)}
    </div>
    {!fb&&<NumPad value={ans} onChange={setAns} onSubmit={check} maxLen={2}/>}
    {fb==='ok'&&!oralPhrase&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18}}><Stars n={4} sz={36}/><p style={{fontSize:28,color:GREEN,fontWeight:800,margin:'8px 0 0'}}>{ex.ans} {ex.emoji}</p></div>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&<div className="as" style={{background:GOLD+'22',borderRadius:14,padding:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>Cuenta otra vez 👆</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:10}}><p style={{fontSize:16,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}

// Visual mode: Add with objects
function ExAddObjects({ex,onOk,onSkip,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  useEffect(()=>{setAns('');setFb(null);resetOral();stopVoice();setTimeout(()=>say(ex.a+' más '+ex.b+' es igual a...'),400);return()=>stopVoice()},[ex]);
  function check(){poke();const n=parseInt(ans);if(n===ex.ans){setFb('ok');starBeep(4);stopVoice();
    say(ex.a+' más '+ex.b+' son '+ex.ans).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>{const nw=w=>(NUMS_1_100[w-1]||''+w).toLowerCase();triggerOral(nw(ex.a)+' más '+nw(ex.b)+' son '+nw(ex.ans),4,1)})}
    else{setFb('no');stopVoice();sayFB('Cuenta todos: son '+ex.ans);setTimeout(()=>setFb(null),2000)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <p style={{fontSize:22,fontWeight:700,color:GOLD,margin:'0 0 12px'}}>¿Cuántos hay en total?</p>
    <div style={{display:'flex',gap:16,justifyContent:'center',alignItems:'center',marginBottom:16}}>
      <div style={{background:'rgba(230,126,34,.12)',border:'2px solid rgba(230,126,34,.3)',borderRadius:16,padding:12,minWidth:80}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center'}}>{Array.from({length:ex.a}).map((_,i)=><span key={i} style={{fontSize:32}}>{ex.emoji}</span>)}</div>
        <p style={{fontSize:18,fontWeight:700,color:'#E67E22',margin:'6px 0 0'}}>{ex.a}</p>
      </div>
      <span style={{fontSize:36,fontWeight:800,color:GREEN}}>+</span>
      <div style={{background:'rgba(52,152,219,.12)',border:'2px solid rgba(52,152,219,.3)',borderRadius:16,padding:12,minWidth:80}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center'}}>{Array.from({length:ex.b}).map((_,i)=><span key={i} style={{fontSize:32}}>{ex.emoji}</span>)}</div>
        <p style={{fontSize:18,fontWeight:700,color:BLUE,margin:'6px 0 0'}}>{ex.b}</p>
      </div>
      <span style={{fontSize:28,fontWeight:800,color:DIM}}>=</span>
      <span style={{fontSize:36,fontWeight:800,color:GOLD}}>?</span>
    </div>
    {!fb&&<NumPad value={ans} onChange={setAns} onSubmit={check} maxLen={2}/>}
    {fb==='ok'&&!oralPhrase&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18}}><Stars n={4} sz={36}/><p style={{fontSize:28,color:GREEN,fontWeight:800,margin:'8px 0 0'}}>{ex.a} + {ex.b} = {ex.ans}</p></div>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&<div className="as" style={{background:GOLD+'22',borderRadius:14,padding:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>Cuenta todos los {ex.emoji} juntos 👆</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:10}}><p style={{fontSize:16,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}

// Visual mode: Word problems with context
function ExWordProblem({ex,onOk,onSkip,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  useEffect(()=>{setAns('');setFb(null);resetOral();stopVoice();setTimeout(()=>say(ex.q),500);return()=>stopVoice()},[ex]);
  function check(){poke();const n=parseInt(ans);if(n===ex.ans){setFb('ok');starBeep(4);stopVoice();
    say(ex.oral).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>triggerOral(ex.oral,4,1))}
    else{setFb('no');stopVoice();sayFB('Piensa bien... la respuesta es '+ex.ans);setTimeout(()=>setFb(null),2500)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div className="card" style={{padding:20,marginBottom:14,background:'rgba(255,255,255,.06)',borderColor:'rgba(255,255,255,.15)'}}>
      <div style={{fontSize:48,marginBottom:12}}>{ex.emoji}</div>
      <p style={{fontSize:20,fontWeight:700,margin:0,lineHeight:1.5,color:'#fff'}}>{ex.q}</p>
    </div>
    {!fb&&<NumPad value={ans} onChange={setAns} onSubmit={check} maxLen={3}/>}
    {fb==='ok'&&!oralPhrase&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18}}><Stars n={4} sz={36}/><p style={{fontSize:20,color:GREEN,fontWeight:700,margin:'8px 0 0'}}>{ex.oral}</p></div>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&<div className="as" style={{background:GOLD+'22',borderRadius:14,padding:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>Piensa: ¿sumar o restar? 🤔</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:10}}><p style={{fontSize:16,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}

export function ExMath({ex,onOk,onSkip,sex,name,uid,vids}){
  // Route to visual modes
  if(ex.mode==='count_objects')return <ExCountObjects ex={ex} onOk={onOk} onSkip={onSkip} name={name} uid={uid} vids={vids}/>
  if(ex.mode==='add_objects')return <ExAddObjects ex={ex} onOk={onOk} onSkip={onSkip} name={name} uid={uid} vids={vids}/>
  if(ex.mode==='word_problem')return <ExWordProblem ex={ex} onOk={onOk} onSkip={onSkip} name={name} uid={uid} vids={vids}/>
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
