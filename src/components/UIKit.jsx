// ============================================================
// TOKI · Reusable UI Components
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { BG3, GOLD, GREEN, RED, BLUE, TXT, BORDER, CLS } from '../constants.js'
import { beep } from '../utils.js'
import { say, stopVoice } from '../voice.js'
import { NUMS_1_100 } from '../constants.js'

// Mascot SVG component
export function SpaceMascot({mood='idle',size=48}){const anim=mood==='happy'?'mascotBounce .6s ease-in-out 3':mood==='sad'?'mascotShy .5s ease-in-out 2':mood==='dance'?'mascotDance .8s ease-in-out infinite':'mascotBounce 3s ease-in-out infinite';
  return <svg className="sober-hide" width={size} height={size} viewBox="0 0 48 48" style={{animation:anim,display:'block'}}>
    <defs><filter id="starGlow"><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="M24,3 C25.5,12 27,14 28,16 C33,15.5 39,15 42,16 C37,19 33,21 31,23 C33,28 35,34 34,38 C30,34 27,31 24,29 C21,31 18,34 14,38 C13,34 15,28 17,23 C15,21 11,19 6,16 C9,15 15,15.5 20,16 C21,14 22.5,12 24,3Z" fill={GOLD} stroke="#d4ac0d" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" filter="url(#starGlow)"/>
    <circle cx={19} cy={19} r={2.8} fill="#1a1a2e"/><circle cx={29} cy={19} r={2.8} fill="#1a1a2e"/>
    <circle cx={20} cy={18} r={1} fill="#fff"/><circle cx={30} cy={18} r={1} fill="#fff"/>
    {mood==='happy'&&<path d="M19,24 Q24,30 29,24" fill="none" stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round"/>}
    {mood==='sad'&&<path d="M19,26 Q24,23 29,26" fill="none" stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round"/>}
    {mood==='idle'&&<path d="M20,24 Q24,27 28,24" fill="none" stroke="#1a1a2e" strokeWidth={1.8} strokeLinecap="round"/>}
    {mood==='dance'&&<path d="M18,24 Q24,31 30,24" fill="none" stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round"/>}
  </svg>}

export function Confetti({show}){const[pts,sP]=useState([]);useEffect(()=>{if(show){sP(Array.from({length:24},(_,i)=>({i,x:Math.random()*100,c:CLS[i%7],s:6+Math.random()*10,d:Math.random()*.5,du:.8+Math.random()*.8})));setTimeout(()=>sP([]),2800)}},[show]);if(!pts.length)return null;return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:999}}>{pts.map(p=><div key={p.i} style={{position:'absolute',left:p.x+'%',top:'-5%',width:p.s,height:p.s,background:p.c,borderRadius:3,animation:`confDrop ${p.du}s ease-in ${p.d}s forwards`}}/>)}</div>}
export function Ring({p,sz=80,sw=6,c=GREEN}){const r=(sz-sw)/2,ci=2*Math.PI*r;return <svg width={sz} height={sz} style={{transform:'rotate(-90deg)'}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={BG3} strokeWidth={sw}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={ci-(p||0)*ci} strokeLinecap="round" style={{transition:'stroke-dashoffset .6s'}}/></svg>}
export function Tower({placed,total}){const cells=21,filled=Math.min(Math.floor((placed/Math.max(total,1))*cells),cells);return <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,maxWidth:220,margin:'0 auto'}}>{Array.from({length:cells},(_,i)=>{const row=Math.floor(i/7),inv=(2-row)*7+(i%7),on=inv<filled;return <div key={i} style={{aspectRatio:'1',borderRadius:4,transition:'all .3s cubic-bezier(.34,1.56,.64,1)',background:on?CLS[inv%7]:BG3+'44',border:on?'2px solid rgba(0,0,0,.2)':'2px solid '+BG3,transform:on?'scale(1)':'scale(.75)',opacity:on?1:.3}}/>})}</div>}
export function RecBtn({dur,onEnd,on}){const[pct,sP]=useState(100);const t=useRef(null);const s=useRef(0);useEffect(()=>{if(!on){sP(100);return}s.current=Date.now();const ms=dur*1000;t.current=setInterval(()=>{const e=Date.now()-s.current;const r=Math.max(0,100-e/ms*100);sP(r);if(r<=25&&r>20)beep(1200,40);if(r<=15&&r>10)beep(1400,40);if(r<=0){clearInterval(t.current);beep(1600,60);setTimeout(onEnd,400)}},50);return()=>clearInterval(t.current)},[on,dur]);if(!on)return null;return <div style={{position:'relative',width:80,height:80,margin:'0 auto'}}><div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',borderRadius:'50%',background:RED+'33',overflow:'hidden'}}><div style={{position:'absolute',bottom:0,left:0,width:'100%',background:RED,transition:'height .05s linear',height:pct+'%'}}/></div><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:36}}>🎤</div></div>}
export function useIdle(name,active){const[msg,sMsg]=useState('');const step=useRef(0);const timer=useRef(null);useEffect(()=>{step.current=0;sMsg('');clearInterval(timer.current);if(!active)return;timer.current=setInterval(()=>{const s=step.current;if(s===0){/* 15s: nothing, just wait */}else if(s===1)sMsg('¿Seguimos? 🚀');else if(s===2){const n=name||'';sMsg((n?n+', ':'')+'¿estás ahí? 👀')}else if(s===3)sMsg('Cuando quieras, seguimos 🌟');else if(s>=4)sMsg('Toki te espera... 💫');step.current=Math.min(s+1,5)},15000);return()=>clearInterval(timer.current)},[active,name]);function poke(){step.current=0;sMsg('');if(timer.current){clearInterval(timer.current);timer.current=null}}return{idleMsg:msg,poke}}

export function NumPad({value,onChange,onSubmit,maxLen=5,decimal=false}){
  const press=d=>{if(String(value).length<maxLen)onChange(String(value)+d)};
  const addDot=()=>{const v=String(value);if(!v.includes(',')&&v.length>0&&v.length<maxLen)onChange(v+',')};
  const bksp=()=>onChange(String(value).slice(0,-1));
  const btnSt={width:52,height:46,borderRadius:12,border:`2px solid ${BORDER}`,background:BG3,color:TXT,fontSize:22,fontWeight:700,fontFamily:"'Fredoka'",cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'transform .1s'};
  // Layout: 3 columns of digits + comma integrated as a number character
  // Row 1: 1 2 3     Row 2: 4 5 6     Row 3: 7 8 9     Row 4: , 0 ⌫
  return <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'center',padding:2}}>
    <div style={{fontSize:26,fontWeight:700,color:GOLD,minHeight:30,letterSpacing:3,marginBottom:2,textAlign:'center'}}>{value?(value+(decimal?' €':'')):'?'}</div>
    <div style={{display:'flex',gap:6,alignItems:'stretch'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4}}>
        {[1,2,3].map(d=><button key={d} style={btnSt} onClick={()=>press(d)}>{d}</button>)}
        {[4,5,6].map(d=><button key={d} style={btnSt} onClick={()=>press(d)}>{d}</button>)}
        {[7,8,9].map(d=><button key={d} style={btnSt} onClick={()=>press(d)}>{d}</button>)}
        {decimal
          ?<button style={{...btnSt,fontSize:28,color:GOLD,fontWeight:800}} onClick={addDot}>,</button>
          :<div/>}
        <button style={btnSt} onClick={()=>press(0)}>0</button>
        <button style={{...btnSt,background:RED+'22',color:RED,border:`2px solid ${RED}33`,fontSize:18}} onClick={bksp}>⌫</button>
      </div>
      <button style={{width:58,borderRadius:14,border:`3px solid ${GREEN}`,background:GREEN+'33',color:'#fff',fontSize:14,fontWeight:600,fontFamily:"'Fredoka'",cursor:!value?'default':'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,opacity:!value?0.35:1,transition:'all .15s'}} onClick={onSubmit} disabled={!value}>
        <span style={{fontSize:28}}>🚀</span>
        <span style={{fontSize:11,lineHeight:1}}>¡Listo!</span>
      </button>
    </div>
  </div>}

// ===== ABACUS HELP — Visual counting aid =====
export function AbacusHelp({a,b,op='+',result}){
  const[step,setStep]=useState(0);const total=op==='+'?a+b:a;const showN=op==='+'?result:a;
  useEffect(()=>{setStep(0);let i=0;const t=setInterval(()=>{i++;setStep(i);if(i<=showN){stopVoice();say(NUMS_1_100[i-1]||String(i))}if(i>=showN+2)clearInterval(t)},900);return()=>{clearInterval(t);stopVoice()}},[a,b,op]);
  const beadSz=total>15?16:total>10?20:28;
  return <div style={{textAlign:'center',padding:12}}>
    <p style={{fontSize:18,fontWeight:600,color:GOLD,margin:'0 0 12px'}}>¡Vamos a contarlo!</p>
    <div style={{display:'flex',gap:3,justifyContent:'center',flexWrap:'wrap',marginBottom:12,minHeight:50}}>
      {Array.from({length:total},(_,i)=>{const isA=op==='+'?i<a:i<result;const isB=op==='+'?i>=a&&i<a+b:false;const removed=op==='-'&&i>=result;const visible=i<step;
        return <div key={i} style={{width:beadSz,height:beadSz+8,borderRadius:beadSz/2,background:removed?RED+'44':isA?'#E67E22':isB?BLUE:GREEN,border:'2px solid '+(removed?RED+'66':'rgba(0,0,0,.2)'),opacity:visible?1:0.2,transform:visible?'scale(1)':'scale(0.4)',transition:'all .5s',textDecoration:removed?'line-through':'none'}}/>})}
    </div>
    {step>showN&&<p style={{fontSize:28,fontWeight:700,color:GREEN}}>{a} {op} {b} = {result}</p>}
  </div>}
