// ============================================================
// TOKI · Reusable UI Components
// ============================================================
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { BG3, GOLD, GREEN, RED, BLUE, TXT, BORDER, CLS } from '../constants.js'
import { beep, CYCLE_COLORS } from '../utils.js'
import { say, stopVoice, useSR } from '../voice.js'
import { NUMS_1_100 } from '../constants.js'

// Mascot SVG component with evolution tiers (0-5)
const TIER_NAMES=['Estrellita','Bronce','Plata','Oro','Héroe','Leyenda'];
export function SpaceMascot({mood='idle',size=48,tier=0,cycle=0}){
  const t=Math.max(0,Math.min(5,tier));
  const cc=CYCLE_COLORS[cycle%CYCLE_COLORS.length]||GOLD;
  const anim=mood==='happy'?'mascotBounce .6s ease-in-out 3':mood==='sad'?'mascotShy .5s ease-in-out 2':mood==='dance'?'mascotDance .8s ease-in-out infinite':'mascotBounce 3s ease-in-out infinite';
  // Tier-based fill: use cycle color, tier 2=lighter, tier 5=rainbow
  const starFill=t===5?'url(#rainbowGrad)':t===2?(cycle>0?cc+'88':'#D4E0EC'):cc;
  const starStroke=t===5?'#d4ac0d':t===2?(cycle>0?cc:'#A8B8C8'):(cc===GOLD?'#d4ac0d':cc);
  // Unique filter ID per instance to avoid SVG conflicts
  const filtId=useMemo(()=>'sg'+Math.random().toString(36).slice(2,6),[]);
  return <svg className="sober-hide" width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={'Mascota - '+TIER_NAMES[t]} style={{animation:anim,display:'block',overflow:'visible'}}>
    <title>{TIER_NAMES[t]}</title>
    <defs>
      <filter id={filtId}><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      {/* Tier 1: bronze ring glow */}
      {t===1&&<filter id={filtId+'b'}><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      {/* Tier 2: sparkle animation via CSS */}
      {/* Tier 5: rainbow gradient */}
      {t===5&&<linearGradient id="rainbowGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF6B6B"><animate attributeName="stopColor" values="#FF6B6B;#FECA57;#48DBFB;#FF9FF3;#FF6B6B" dur="3s" repeatCount="indefinite"/></stop>
        <stop offset="33%" stopColor="#FECA57"><animate attributeName="stopColor" values="#FECA57;#48DBFB;#FF9FF3;#FF6B6B;#FECA57" dur="3s" repeatCount="indefinite"/></stop>
        <stop offset="66%" stopColor="#48DBFB"><animate attributeName="stopColor" values="#48DBFB;#FF9FF3;#FF6B6B;#FECA57;#48DBFB" dur="3s" repeatCount="indefinite"/></stop>
        <stop offset="100%" stopColor="#FF9FF3"><animate attributeName="stopColor" values="#FF9FF3;#FF6B6B;#FECA57;#48DBFB;#FF9FF3" dur="3s" repeatCount="indefinite"/></stop>
      </linearGradient>}
    </defs>
    {/* Tier 1: Bronze ring glow behind star */}
    {t===1&&<circle cx={24} cy={22} r={18} fill="none" stroke="#CD7F32" strokeWidth={2} opacity={0.7} filter={`url(#${filtId}b)`}>
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
    </circle>}
    {/* Tier 4 & 5: Cape behind the star body */}
    {(t===4||t===5)&&<path d="M18,22 C16,30 14,38 12,44 L24,36 L36,44 C34,38 32,30 30,22Z" fill={t===5?'#9B59B6':'#E74C3C'} opacity={0.85} stroke={t===5?'#7D3C98':'#C0392B'} strokeWidth={0.8}>
      <animate attributeName="d" values="M18,22 C16,30 14,38 12,44 L24,36 L36,44 C34,38 32,30 30,22Z;M18,22 C15,30 13,39 11,45 L24,37 L37,45 C35,39 33,30 30,22Z;M18,22 C16,30 14,38 12,44 L24,36 L36,44 C34,38 32,30 30,22Z" dur="2.5s" repeatCount="indefinite"/>
    </path>}
    {/* Tier 5: Halo ellipse above */}
    {t===5&&<ellipse cx={24} cy={1} rx={10} ry={3} fill="none" stroke="#FECA57" strokeWidth={1.5} opacity={0.85}>
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
    </ellipse>}
    {/* Tier 3: Crown above the star (3 triangles) */}
    {t>=3&&t<=4&&<g transform="translate(24,0)">
      <polygon points="-8,5 -5,-1 -2,5" fill="#FECA57" stroke="#d4ac0d" strokeWidth={0.5}/>
      <polygon points="-3,4 0,-3 3,4" fill="#FECA57" stroke="#d4ac0d" strokeWidth={0.5}/>
      <polygon points="2,5 5,-1 8,5" fill="#FECA57" stroke="#d4ac0d" strokeWidth={0.5}/>
    </g>}
    {/* Star body */}
    <path d="M24,3 C25.5,12 27,14 28,16 C33,15.5 39,15 42,16 C37,19 33,21 31,23 C33,28 35,34 34,38 C30,34 27,31 24,29 C21,31 18,34 14,38 C13,34 15,28 17,23 C15,21 11,19 6,16 C9,15 15,15.5 20,16 C21,14 22.5,12 24,3Z" fill={starFill} stroke={starStroke} strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" filter={`url(#${filtId})`}/>
    {/* Tier 2: sparkle particles */}
    {t===2&&<>
      <circle cx={8} cy={10} r={1.2} fill="#fff" opacity={0.8}><animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite"/><animate attributeName="r" values="0.5;1.5;0.5" dur="1.8s" repeatCount="indefinite"/></circle>
      <circle cx={40} cy={12} r={1} fill="#fff" opacity={0.6}><animate attributeName="opacity" values="0;0.9;0" dur="2.2s" begin="0.6s" repeatCount="indefinite"/><animate attributeName="r" values="0.4;1.3;0.4" dur="2.2s" begin="0.6s" repeatCount="indefinite"/></circle>
      <circle cx={24} cy={42} r={0.9} fill="#fff" opacity={0.5}><animate attributeName="opacity" values="0;0.8;0" dur="2s" begin="1.2s" repeatCount="indefinite"/><animate attributeName="r" values="0.3;1.2;0.3" dur="2s" begin="1.2s" repeatCount="indefinite"/></circle>
    </>}
    {/* Eyes */}
    <circle cx={19} cy={19} r={2.8} fill="#1a1a2e"/><circle cx={29} cy={19} r={2.8} fill="#1a1a2e"/>
    <circle cx={20} cy={18} r={1} fill="#fff"/><circle cx={30} cy={18} r={1} fill="#fff"/>
    {/* Mouth — mood-based (unchanged) */}
    {mood==='happy'&&<path d="M19,24 Q24,30 29,24" fill="none" stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round"/>}
    {mood==='sad'&&<path d="M19,26 Q24,23 29,26" fill="none" stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round"/>}
    {mood==='idle'&&<path d="M20,24 Q24,27 28,24" fill="none" stroke="#1a1a2e" strokeWidth={1.8} strokeLinecap="round"/>}
    {mood==='dance'&&<path d="M18,24 Q24,31 30,24" fill="none" stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round"/>}
  </svg>}

export function Confetti({show}){const[pts,sP]=useState([]);useEffect(()=>{if(show){sP(Array.from({length:24},(_,i)=>({i,x:Math.random()*100,c:CLS[i%7],s:6+Math.random()*10,d:Math.random()*.5,du:.8+Math.random()*.8})));setTimeout(()=>sP([]),2800)}},[show]);if(!pts.length)return null;return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:999}}>{pts.map(p=><div key={p.i} style={{position:'absolute',left:p.x+'%',top:'-5%',width:p.s,height:p.s,background:p.c,borderRadius:3,animation:`confDrop ${p.du}s ease-in ${p.d}s forwards`}}/>)}</div>}
export function Ring({p,sz=80,sw=6,c=GREEN}){const r=(sz-sw)/2,ci=2*Math.PI*r;return <svg width={sz} height={sz} style={{transform:'rotate(-90deg)'}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={BG3} strokeWidth={sw}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={ci-(p||0)*ci} strokeLinecap="round" style={{transition:'stroke-dashoffset .6s'}}/></svg>}
export function Tower({placed,total}){const cells=21,filled=Math.min(Math.floor((placed/Math.max(total,1))*cells),cells);return <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,maxWidth:220,margin:'0 auto'}}>{Array.from({length:cells},(_,i)=>{const row=Math.floor(i/7),inv=(2-row)*7+(i%7),on=inv<filled;return <div key={i} style={{aspectRatio:'1',borderRadius:4,transition:'all .3s cubic-bezier(.34,1.56,.64,1)',background:on?CLS[inv%7]:BG3+'44',border:on?'2px solid rgba(0,0,0,.2)':'2px solid '+BG3,transform:on?'scale(1)':'scale(.75)',opacity:on?1:.3}}/>})}</div>}
export function RecBtn({dur,onEnd,on,size=80}){const[pct,sP]=useState(100);const t=useRef(null);const s=useRef(0);useEffect(()=>{if(!on){sP(100);return}s.current=Date.now();const ms=dur*1000;t.current=setInterval(()=>{const e=Date.now()-s.current;const r=Math.max(0,100-e/ms*100);sP(r);if(r<=25&&r>20)beep(1200,40);if(r<=15&&r>10)beep(1400,40);if(r<=0){clearInterval(t.current);beep(1600,60);setTimeout(onEnd,400)}},50);return()=>clearInterval(t.current)},[on,dur]);if(!on)return null;return <div style={{position:'relative',width:size,height:size,margin:'0 auto'}}><div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',borderRadius:'50%',background:RED+'33',overflow:'hidden'}}><div style={{position:'absolute',bottom:0,left:0,width:'100%',background:RED,transition:'height .05s linear',height:pct+'%'}}/></div><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:Math.round(size*0.45)}}>🎤</div></div>}
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

// ===== ASTRONAUT AVATAR — Photo/emoji with optional space helmet =====
export function AstronautAvatar({photo,emoji,size=80,helmet=true,onClick,style={}}){
  const r=size/2;const sw=size*0.04;
  return <div onClick={onClick} style={{position:'relative',width:size,height:size,cursor:onClick?'pointer':'default',flexShrink:0,...style}}>
    {/* Circular photo or emoji */}
    <div style={{width:size,height:size,borderRadius:'50%',overflow:'hidden',background:photo?'transparent':BG3,border:`${Math.max(2,sw)}px solid ${GOLD}55`,display:'flex',alignItems:'center',justifyContent:'center'}}>
      {photo?<img src={photo} alt="Foto de perfil" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>
        :<span style={{fontSize:size*0.5,lineHeight:1}}>{emoji||'🧑‍🚀'}</span>}
    </div>
    {/* Helmet overlay — only on photos, not emojis */}
    {helmet&&photo&&<svg width={size} height={size} viewBox="0 0 100 100" style={{position:'absolute',top:0,left:0,pointerEvents:'none'}}>
      {/* Helmet dome — arc over the top */}
      <ellipse cx={50} cy={48} rx={48} ry={46} fill="none" stroke="#B0BEC5" strokeWidth={4} strokeDasharray="180 200" strokeDashoffset={-10} opacity={0.85}/>
      {/* Helmet rim — thicker at top */}
      <path d="M8,55 Q8,8 50,5 Q92,8 92,55" fill="none" stroke="#90A4AE" strokeWidth={5} strokeLinecap="round" opacity={0.7}/>
      {/* Visor reflection */}
      <ellipse cx={35} cy={30} rx={12} ry={8} fill="#fff" opacity={0.12} transform="rotate(-20,35,30)"/>
      <ellipse cx={60} cy={25} rx={6} ry={4} fill="#fff" opacity={0.08} transform="rotate(-15,60,25)"/>
      {/* Ear connectors */}
      <circle cx={6} cy={55} r={4} fill="#78909C" stroke="#546E7A" strokeWidth={1.5}/>
      <circle cx={94} cy={55} r={4} fill="#78909C" stroke="#546E7A" strokeWidth={1.5}/>
    </svg>}
  </div>}

// ===== ORAL PROMPT — M8 oral production after correct answers =====
export function OralPrompt({phrase,onDone}){
  const doneRef=useRef(false);
  const timerRef=useRef(null);
  const sr=useSR(useCallback(()=>{},[]));
  useEffect(()=>{
    doneRef.current=false;
    // 1. Say the phrase via TTS
    stopVoice();
    say(phrase).then(()=>{
      if(doneRef.current)return;
      // 3. Beep 880Hz 150ms
      beep(880,150);
      // 4. Listen for 3-4 seconds
      if(sr.ok)sr.go();
      timerRef.current=setTimeout(()=>{
        if(!doneRef.current){doneRef.current=true;sr.stop();onDone()}
      },3500);
    });
    return()=>{doneRef.current=true;sr.stop();stopVoice();if(timerRef.current)clearTimeout(timerRef.current)}
  },[phrase]);
  return <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,padding:20}}>
    <p style={{fontSize:26,fontWeight:700,color:GOLD,margin:0,textAlign:'center'}}>{phrase}</p>
    <div style={{width:80,height:80,borderRadius:'50%',background:'#E74C3C',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 24px #E74C3C55',animation:'pulse 1.2s infinite'}}>
      <span style={{fontSize:38,color:'#fff'}}>🎤</span>
    </div>
  </div>
}

export function useOralPhase(onOk){
  const[oralPhrase,setOralPhrase]=useState(null);
  const pendingScore=useRef({stars:undefined,attempts:undefined});
  const oralEnabled=()=>localStorage.getItem('toki_oral_all_planets')!=='false';
  const oralDone=useCallback(()=>{
    setOralPhrase(null);
    const{stars,attempts}=pendingScore.current;
    onOk(stars,attempts);
    pendingScore.current={stars:undefined,attempts:undefined};
  },[onOk]);
  const triggerOral=useCallback((phrase,stars,attempts)=>{
    if(!oralEnabled()||!phrase){onOk(stars,attempts);return}
    pendingScore.current={stars,attempts};
    setOralPhrase(phrase);
  },[onOk]);
  const resetOral=useCallback(()=>setOralPhrase(null),[]);
  return{oralPhrase,triggerOral,oralDone,resetOral}
}

// ===== DOG MASCOT — Beagle/spaniel cartoon with phases & seasons =====
export const getSeason=()=>{const m=new Date().getMonth();if(m>=11||m<=1)return 0;if(m<=4)return 1;if(m<=7)return 2;return 3};
export const getDogPhase=(gp)=>gp>=61?2:gp>=21?1:0;

// --- TokiCachorro: Beautiful puppy SVG for phase 0 ---
function TokiCachorro({mood='idle',size=48}){
  const isHappy=mood==='happy',isSad=mood==='sad',isHungry=mood==='hungry',isEating=mood==='eating',isSleeping=mood==='sleeping',isDance=mood==='dance';
  const earLeftR=isSad?20:isHungry?10:3;
  const earRightR=isSad?-20:isHungry?-10:-3;
  const bodyY=isDance?-2:0;
  return <svg width={size} height={size} viewBox="0 0 100 110" role="img" aria-label={`Toki cachorro ${mood}`} style={{display:'block',overflow:'visible'}}>
    <defs>
      <radialGradient id="tkFur" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="#F5D6A8"/><stop offset="70%" stopColor="#D4A05A"/><stop offset="100%" stopColor="#B8864A"/></radialGradient>
      <radialGradient id="tkBelly" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#FFF8F0"/><stop offset="100%" stopColor="#F5E6D0"/></radialGradient>
      <radialGradient id="tkHead" cx="48%" cy="38%" r="52%"><stop offset="0%" stopColor="#F7DDB8"/><stop offset="60%" stopColor="#E4B980"/><stop offset="100%" stopColor="#C99A58"/></radialGradient>
      <radialGradient id="tkSnout" cx="50%" cy="45%" r="55%"><stop offset="0%" stopColor="#FFFAF5"/><stop offset="100%" stopColor="#F5E4D2"/></radialGradient>
      <radialGradient id="tkEye" cx="38%" cy="35%" r="50%"><stop offset="0%" stopColor="#3D2B1F"/><stop offset="100%" stopColor="#1A0E08"/></radialGradient>
      <filter id="tkShadow"><feGaussianBlur stdDeviation="1.2" result="b"/><feOffset dy="1.5" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <style>{`
      .tk-tail{transform-box:fill-box;transform-origin:20px 78px;animation:tkTailS 1.6s ease-in-out infinite}
      .tk-tail-f{animation:tkTailF .3s ease-in-out infinite}
      .tk-blink{animation:tkBlink 4.8s infinite;transform-origin:center;transform-box:fill-box}
      .tk-bob{animation:tkBob 2.4s ease-in-out infinite}
      .tk-dance{animation:tkDnc .5s ease-in-out infinite}
      .tk-breath{animation:tkBreath 2.2s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
      .tk-zzz1{animation:tkZzz1 1.8s ease-out infinite}
      .tk-zzz2{animation:tkZzz2 1.8s ease-out .6s infinite}
      .tk-tongue{animation:tkTng .9s ease-in-out infinite;transform-origin:center top;transform-box:fill-box}
      .tk-cheek{animation:tkChew .45s ease-in-out infinite}
      .tk-ear{transition:transform .4s ease}
      .tk-sparkle{animation:tkSparkle 2.5s ease-in-out infinite}
      @keyframes tkBlink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.06)}}
      @keyframes tkTailS{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(15deg)}}
      @keyframes tkTailF{0%,100%{transform:rotate(-25deg)}50%{transform:rotate(25deg)}}
      @keyframes tkBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}
      @keyframes tkDnc{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-4px) rotate(-2deg)}75%{transform:translateY(-4px) rotate(2deg)}}
      @keyframes tkBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.012,.992)}}
      @keyframes tkZzz1{0%{opacity:0;transform:translate(0,0) scale(.6)}20%{opacity:.9}100%{opacity:0;transform:translate(8px,-14px) scale(1.1)}}
      @keyframes tkZzz2{0%{opacity:0;transform:translate(0,0) scale(.6)}20%{opacity:.7}100%{opacity:0;transform:translate(12px,-20px) scale(1.2)}}
      @keyframes tkTng{0%,100%{transform:scaleY(1) translateY(0)}50%{transform:scaleY(1.1) translateY(.8px)}}
      @keyframes tkChew{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
      @keyframes tkSparkle{0%,100%{opacity:.5;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}
    `}</style>
    <g className={isDance?"tk-dance":"tk-bob"} transform={`translate(0 ${bodyY})`}>
      <g className="tk-breath">
        {/* Tail — fluffy curved */}
        <g className={`tk-tail ${isHappy||isHungry||isEating||isDance?"tk-tail-f":""}`}>
          <path d="M20 78 C10 72,6 60,12 52 C16 46,22 48,24 53 C25 56,23 60,22 64 C21 68,24 73,27 76" fill="none" stroke="#C49A60" strokeWidth="6" strokeLinecap="round"/>
          <path d="M20 78 C10 72,6 60,12 52 C16 46,22 48,24 53 C25 56,23 60,22 64 C21 68,24 73,27 76" fill="none" stroke="#E4C088" strokeWidth="3" strokeLinecap="round"/>
        </g>
        {/* Body — rounder with gradient */}
        <ellipse cx="50" cy="78" rx="26" ry="20" fill="url(#tkFur)"/>
        <ellipse cx="50" cy="82" rx="16" ry="12" fill="url(#tkBelly)"/>
        {/* Spot on side */}
        <ellipse cx="66" cy="73" rx="7" ry="5.5" fill="#B8864A" opacity="0.5"/>
        {/* Front paws — rounder, cuter */}
        <ellipse cx="36" cy="96" rx="8.5" ry="6" fill="#C49A60"/>
        <ellipse cx="64" cy="96" rx="8.5" ry="6" fill="#C49A60"/>
        <ellipse cx="35" cy="94.5" rx="5.5" ry="3.5" fill="#F0D8B8"/>
        <ellipse cx="63" cy="94.5" rx="5.5" ry="3.5" fill="#F0D8B8"/>
        {/* Paw pads (tiny detail) */}
        <circle cx="33" cy="95" r="1.2" fill="#D4A878"/><circle cx="37" cy="95" r="1.2" fill="#D4A878"/>
        <circle cx="61" cy="95" r="1.2" fill="#D4A878"/><circle cx="65" cy="95" r="1.2" fill="#D4A878"/>
        {/* Head — larger, rounder for kawaii puppy look */}
        <ellipse cx="50" cy="44" rx="30" ry="26" fill="url(#tkHead)" filter="url(#tkShadow)"/>
        {/* Fur tuft on top */}
        <path d="M43 19 C46 24,46 30,44 36 C47 38,53 38,56 36 C54 30,54 24,57 19 C54 16,46 16,43 19Z" fill="#F5E0B8" opacity="0.85"/>
        <path d="M47 17 C49 13,51 13,53 17" fill="none" stroke="#E4C888" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Ears — floppy, soft, with inner color */}
        <g className="tk-ear" transform={`rotate(${earLeftR} 24 40)`}>
          <ellipse cx="22" cy="42" rx="10" ry="20" fill="#9B6B3C"/>
          <ellipse cx="23" cy="46" rx="6" ry="14" fill="#C09060" opacity="0.5"/>
          <ellipse cx="23" cy="46" rx="3.5" ry="10" fill="#D4A878" opacity="0.3"/>
        </g>
        <g className="tk-ear" transform={`rotate(${earRightR} 76 40)`}>
          <ellipse cx="78" cy="42" rx="10" ry="20" fill="#9B6B3C"/>
          <ellipse cx="77" cy="46" rx="6" ry="14" fill="#C09060" opacity="0.5"/>
          <ellipse cx="77" cy="46" rx="3.5" ry="10" fill="#D4A878" opacity="0.3"/>
        </g>
        {/* Snout area — cream colored, softer shape */}
        <ellipse cx="50" cy="54" rx="14" ry="10" fill="url(#tkSnout)"/>
        <ellipse cx="50" cy="60" rx="9" ry="5.5" fill="url(#tkSnout)"/>
        {/* Eyes — big, expressive puppy eyes */}
        {!isHappy&&!isEating&&!isSleeping?<>
          <g className={mood==='idle'?"tk-blink":""}>
            <ellipse cx="39" cy={isSad?"44":isHungry?"43.5":"42.5"} rx={isHungry?"5.8":"5.5"} ry={isHungry?"6.8":isSad?"6":"6.5"} fill="url(#tkEye)"/>
            <ellipse cx="39" cy={isSad?"44":isHungry?"43.5":"42.5"} rx="4" ry="4.8" fill="#2A1A10"/>
            <circle cx="37" cy="40.5" r="2.2" fill="#fff" opacity="0.95"/>
            <circle cx="41" cy="43.5" r="1" fill="#fff" opacity="0.7"/>
            <ellipse cx="39" cy={isSad?"46.5":"45.5"} rx="2" ry=".8" fill="#4A3020" opacity="0.2"/>
          </g>
          <g className={mood==='idle'?"tk-blink":""}>
            <ellipse cx="61" cy={isSad?"44":isHungry?"43.5":"42.5"} rx={isHungry?"5.8":"5.5"} ry={isHungry?"6.8":isSad?"6":"6.5"} fill="url(#tkEye)"/>
            <ellipse cx="61" cy={isSad?"44":isHungry?"43.5":"42.5"} rx="4" ry="4.8" fill="#2A1A10"/>
            <circle cx="59" cy="40.5" r="2.2" fill="#fff" opacity="0.95"/>
            <circle cx="63" cy="43.5" r="1" fill="#fff" opacity="0.7"/>
            <ellipse cx="61" cy={isSad?"46.5":"45.5"} rx="2" ry=".8" fill="#4A3020" opacity="0.2"/>
          </g>
          {/* Eyebrows */}
          {isSad&&<><path d="M33 36 Q39 33 45 36" fill="none" stroke="#8B6040" strokeWidth="1.8" strokeLinecap="round"/><path d="M55 36 Q61 33 67 36" fill="none" stroke="#8B6040" strokeWidth="1.8" strokeLinecap="round"/></>}
          {isHungry&&<><path d="M33 35 Q39 31 45 34" fill="none" stroke="#8B6040" strokeWidth="1.5" strokeLinecap="round"/><path d="M55 34 Q61 31 67 35" fill="none" stroke="#8B6040" strokeWidth="1.5" strokeLinecap="round"/></>}
        </>:<>
          {/* Happy/eating eyes — cute arcs */}
          <path d="M33 43 Q39 49 45 43" fill="none" stroke="#2B1A10" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M55 43 Q61 49 67 43" fill="none" stroke="#2B1A10" strokeWidth="2.5" strokeLinecap="round"/>
        </>}
        {/* Nose — shiny, heart-shaped */}
        <ellipse cx="50" cy="51.5" rx="4" ry="3" fill="#1E1210"/>
        <ellipse cx="50" cy="51" rx="3.5" ry="2.5" fill="#2A1A12"/>
        <circle cx="48.8" cy="50.2" r="1.1" fill="#fff" opacity="0.5"/>
        {/* Mouth and expressions */}
        {isHappy&&<>
          <path d="M43 57 Q50 63 57 57" fill="none" stroke="#8B5040" strokeWidth="2.2" strokeLinecap="round"/>
          <path className="tk-tongue" d="M46.5 58.5 Q50 65 53.5 58.5 Z" fill="#F58CA8"/>
          <path d="M46.5 58.5 Q50 65 53.5 58.5" fill="none" stroke="#E07090" strokeWidth=".8"/>
        </>}
        {isSad&&<path d="M44 60 Q50 56 56 60" fill="none" stroke="#8B5040" strokeWidth="2" strokeLinecap="round"/>}
        {isHungry&&<><ellipse cx="50" cy="59.5" rx="5" ry="4" fill="#8B4040"/><path d="M47 58 Q50 62 53 58" fill="#F6A1B6"/><ellipse cx="50" cy="59.5" rx="3" ry="1.5" fill="#6B2020" opacity="0.3"/></>}
        {isEating&&<><g className="tk-cheek"><ellipse cx="39" cy="56" rx="3.5" ry="2.8" fill="#F3C2B5"/><ellipse cx="61" cy="56" rx="3.5" ry="2.8" fill="#F3C2B5"/></g><path d="M44 58 Q50 62 56 58" fill="none" stroke="#8B5040" strokeWidth="2" strokeLinecap="round"/></>}
        {isSleeping&&<><path d="M44 58 Q50 60.5 56 58" fill="none" stroke="#8B5040" strokeWidth="1.8" strokeLinecap="round"/><path d="M33 43 Q39 47 45 43" fill="none" stroke="#2B1A10" strokeWidth="2.2" strokeLinecap="round"/><path d="M55 43 Q61 47 67 43" fill="none" stroke="#2B1A10" strokeWidth="2.2" strokeLinecap="round"/></>}
        {!isHappy&&!isSad&&!isHungry&&!isEating&&!isSleeping&&<path d="M45 58 Q50 61 55 58" fill="none" stroke="#8B5040" strokeWidth="1.8" strokeLinecap="round"/>}
        {/* Cheek blush */}
        {(isHappy||isEating||isHungry||isDance)&&<>
          <ellipse cx="33" cy="55" rx="3.5" ry="2" fill="#F3AEA8" opacity="0.55"/>
          <ellipse cx="67" cy="55" rx="3.5" ry="2" fill="#F3AEA8" opacity="0.55"/>
        </>}
        {/* Chest line */}
        <path d="M50 66 Q49 74 50 83" fill="none" stroke="#E8CCA8" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        {/* Fur highlights on head */}
        <circle cx="35" cy="24" r="1.3" fill="#fff" opacity="0.6" className="tk-sparkle"/>
        <circle cx="65" cy="26" r="1" fill="#fff" opacity="0.45" className="tk-sparkle" style={{animationDelay:'.8s'}}/>
        <circle cx="50" cy="20" r="0.8" fill="#fff" opacity="0.35"/>
        {/* Sleeping Zzz */}
        {isSleeping&&<g fill="#7E74D8" fontFamily="Arial,sans-serif" fontWeight="700">
          <text x="72" y="22" fontSize="8" className="tk-zzz1">z</text>
          <text x="80" y="14" fontSize="10" className="tk-zzz2">Z</text>
        </g>}
      </g>
    </g>
  </svg>
}

// --- TokiJoven: Young dog SVG for phase 1 ---
function TokiJoven({mood='idle',size=48}){
  const isHappy=mood==='happy',isSad=mood==='sad',isHungry=mood==='hungry',isEating=mood==='eating',isSleeping=mood==='sleeping',isDance=mood==='dance';
  const earLeft=isSad?"rotate(12 27 38)":isHungry?"rotate(6 27 38)":"rotate(0 27 38)";
  const earRight=isSad?"rotate(-12 73 38)":isHungry?"rotate(-6 73 38)":"rotate(0 73 38)";
  return <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Toki joven ${mood}`} style={{display:'block',overflow:'visible'}}>
    <style>{`
      .tj-tail{transform-box:fill-box;transform-origin:22px 71px;animation:tjTailSlow 1.8s ease-in-out infinite}
      .tj-tail-fast{animation:tjTailFast .32s ease-in-out infinite}
      .tj-blink{animation:tjBlink 4.6s infinite;transform-origin:center;transform-box:fill-box}
      .tj-bob{animation:tjBob 2.4s ease-in-out infinite}
      .tj-dance{animation:tjDance .5s ease-in-out infinite}
      .tj-breath{animation:tjBreath 2.1s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
      .tj-zzz-1{animation:tjZ1 1.8s ease-out infinite}
      .tj-zzz-2{animation:tjZ2 1.8s ease-out .6s infinite}
      .tj-tongue{animation:tjTongue .85s ease-in-out infinite;transform-origin:center top;transform-box:fill-box}
      .tj-cheek{animation:tjChew .45s ease-in-out infinite}
      .tj-bandana{animation:tjBandana 1.7s ease-in-out infinite;transform-origin:50px 61px;transform-box:fill-box}
      @keyframes tjBlink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.08)}}
      @keyframes tjTailSlow{0%,100%{transform:rotate(-9deg)}50%{transform:rotate(11deg)}}
      @keyframes tjTailFast{0%,100%{transform:rotate(-22deg)}50%{transform:rotate(22deg)}}
      @keyframes tjBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.2px)}}
      @keyframes tjDance{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.01)}}
      @keyframes tjBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.012,.992)}}
      @keyframes tjTongue{0%,100%{transform:scaleY(1) translateY(0)}50%{transform:scaleY(1.08) translateY(.5px)}}
      @keyframes tjChew{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
      @keyframes tjBandana{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-2deg)}}
      @keyframes tjZ1{0%{opacity:0;transform:translate(0,0) scale(.7)}20%{opacity:.9}100%{opacity:0;transform:translate(6px,-10px) scale(1.05)}}
      @keyframes tjZ2{0%{opacity:0;transform:translate(0,0) scale(.7)}20%{opacity:.75}100%{opacity:0;transform:translate(10px,-16px) scale(1.15)}}
    `}</style>
    <g className={isDance?"tj-dance":"tj-bob"}>
      <g className="tj-breath">
        <g className={`tj-tail ${isHappy||isHungry||isEating?"tj-tail-fast":""}`}>
          <path d="M22 71 C11 64, 12 53, 20 49 C25 46, 30 49, 29 53 C28 57, 25 59, 25 62 C25 65, 28 67, 31 68" fill="none" stroke="#8A5A3E" strokeWidth="4.5" strokeLinecap="round"/>
        </g>
        <ellipse cx="52" cy="72" rx="22" ry="16" fill="#C88A58"/>
        <ellipse cx="53" cy="74.5" rx="12.5" ry="9.5" fill="#FFF4E9"/>
        <ellipse cx="66" cy="67" rx="7.5" ry="5.5" fill="#A86C46" opacity="0.9"/>
        <rect x="37" y="78" width="6.8" height="11" rx="3.2" fill="#C88A58"/>
        <rect x="58" y="78" width="6.8" height="11" rx="3.2" fill="#C88A58"/>
        <ellipse cx="40.4" cy="90" rx="5.3" ry="3.5" fill="#8A5A3E"/>
        <ellipse cx="61.4" cy="90" rx="5.3" ry="3.5" fill="#8A5A3E"/>
        <g className="tj-bandana">
          <path d="M39 59 Q52 66 65 59 L63 67 Q52 71 41 67 Z" fill="#D92F2F"/>
          <path d="M51 66 L47 73 L53 70 L58 74 L57 67 Z" fill="#C41F1F"/>
          <circle cx="52" cy="64" r="1.2" fill="#FFD9D9" opacity="0.8"/>
        </g>
        <ellipse cx="50" cy="38" rx="24" ry="20" fill="#E7B582"/>
        <g transform={earLeft}><ellipse cx="27" cy="40" rx="7.2" ry="16" fill="#8A5A3E"/><ellipse cx="28" cy="44" rx="4.2" ry="10" fill="#A86C46" opacity="0.45"/></g>
        <g transform={earRight}><ellipse cx="73" cy="40" rx="7.2" ry="16" fill="#8A5A3E"/><ellipse cx="72" cy="44" rx="4.2" ry="10" fill="#A86C46" opacity="0.45"/></g>
        <path d="M44 19 C47 24, 47 30, 44 35 C48 37.5, 52 37.5, 56 35 C53 30, 53 24, 56 19 C52.5 16.5, 47.5 16.5, 44 19 Z" fill="#FFFDFB" opacity="0.92"/>
        <ellipse cx="50" cy="47.5" rx="10.8" ry="8" fill="#FFF7F0"/>
        <ellipse cx="50" cy="52.5" rx="6.6" ry="4" fill="#FFF7F0"/>
        {!isHappy&&!isEating&&!isSleeping?<>
          <g className={mood==='idle'?"tj-blink":""}>
            <ellipse cx="41" cy={isSad?"38.8":isHungry?"38.5":"37.8"} rx={isHungry?"4.9":"4.6"} ry={isHungry?"6.1":isSad?"5.2":"5.6"} fill="#171717"/>
            <circle cx="39.5" cy="35.9" r="1.5" fill="#fff"/><circle cx="42.2" cy="38.3" r="0.75" fill="#fff"/>
          </g>
          <g className={mood==='idle'?"tj-blink":""}>
            <ellipse cx="59" cy={isSad?"38.8":isHungry?"38.5":"37.8"} rx={isHungry?"4.9":"4.6"} ry={isHungry?"6.1":isSad?"5.2":"5.6"} fill="#171717"/>
            <circle cx="57.5" cy="35.9" r="1.5" fill="#fff"/><circle cx="60.2" cy="38.3" r="0.75" fill="#fff"/>
          </g>
          {!isSad&&!isHungry&&<><path d="M36 31 Q40 29 45 30.8" fill="none" stroke="#74482F" strokeWidth="1.5" strokeLinecap="round"/><path d="M55 30.8 Q60 29 64 31" fill="none" stroke="#74482F" strokeWidth="1.5" strokeLinecap="round"/></>}
          {isSad&&<><path d="M36 33 Q40 31 45 33.8" fill="none" stroke="#74482F" strokeWidth="1.5" strokeLinecap="round"/><path d="M55 33.8 Q60 31 64 33" fill="none" stroke="#74482F" strokeWidth="1.5" strokeLinecap="round"/></>}
          {isHungry&&<><path d="M36 31.5 Q40 28.5 45 31.5" fill="none" stroke="#74482F" strokeWidth="1.5" strokeLinecap="round"/><path d="M55 31.5 Q60 28.5 64 31.5" fill="none" stroke="#74482F" strokeWidth="1.5" strokeLinecap="round"/></>}
        </>:<>
          <path d="M36 39 Q41 43.5 46 39" fill="none" stroke="#231C1A" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M54 39 Q59 43.5 64 39" fill="none" stroke="#231C1A" strokeWidth="2.2" strokeLinecap="round"/>
        </>}
        <ellipse cx="50" cy="45.2" rx="3.2" ry="2.4" fill="#171413"/>
        {isHappy&&<><path d="M44.5 51 Q50 57 55.5 51" fill="none" stroke="#7C4038" strokeWidth="2.1" strokeLinecap="round"/><path className="tj-tongue" d="M47.4 52.2 Q50 58 52.6 52.2 Z" fill="#F28EA7"/></>}
        {isSad&&<path d="M45.5 55.2 Q50 51.5 54.5 55.2" fill="none" stroke="#7C4038" strokeWidth="1.8" strokeLinecap="round"/>}
        {isHungry&&<><ellipse cx="50" cy="53.8" rx="4.1" ry="3.3" fill="#9B4A42"/><path d="M47.8 52.8 Q50 56 52.2 52.8" fill="#F5A5B8"/></>}
        {isEating&&<><g className="tj-cheek"><ellipse cx="41.2" cy="49.8" rx="3.1" ry="2.3" fill="#F2C1B3"/><ellipse cx="58.8" cy="49.8" rx="3.1" ry="2.3" fill="#F2C1B3"/></g><path d="M45.5 52.5 Q50 55.2 54.5 52.5" fill="none" stroke="#7C4038" strokeWidth="1.9" strokeLinecap="round"/></>}
        {isSleeping&&<path d="M45.5 52.5 Q50 54.7 54.5 52.5" fill="none" stroke="#7C4038" strokeWidth="1.7" strokeLinecap="round"/>}
        {!isHappy&&!isSad&&!isHungry&&!isEating&&!isSleeping&&<path d="M44 50.8 Q50 54.8 56 50.8" fill="none" stroke="#7C4038" strokeWidth="1.9" strokeLinecap="round"/>}
        {(isHappy||isEating||isHungry)&&<><ellipse cx="36.5" cy="49.5" rx="2.5" ry="1.4" fill="#F3B1AD" opacity="0.6"/><ellipse cx="63.5" cy="49.5" rx="2.5" ry="1.4" fill="#F3B1AD" opacity="0.6"/></>}
        <path d="M52 61 Q51 67 52 77" fill="none" stroke="#E8C5A9" strokeWidth="1.4" strokeLinecap="round"/>
        {isSleeping&&<g fill="#7368D8" fontFamily="Arial, sans-serif" fontWeight="700"><text x="68" y="18" fontSize="7" className="tj-zzz-1">Z</text><text x="76" y="11" fontSize="9" className="tj-zzz-2">Z</text></g>}
        <circle cx="34" cy="21" r="1" fill="#fff" opacity="0.7"/><circle cx="66" cy="21" r="0.8" fill="#fff" opacity="0.55"/>
      </g>
    </g>
  </svg>
}

// --- TokiHeroe: Hero dog SVG for phase 2 ---
function TokiHeroe({mood='idle',size=48}){
  const isHappy=mood==='happy',isSad=mood==='sad',isHungry=mood==='hungry',isEating=mood==='eating',isSleeping=mood==='sleeping',isDance=mood==='dance';
  const earLeft=isSad?"rotate(10 28 37)":isHungry?"rotate(5 28 37)":"rotate(-2 28 37)";
  const earRight=isSad?"rotate(-10 72 37)":isHungry?"rotate(-5 72 37)":"rotate(2 72 37)";
  return <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Toki héroe ${mood}`} style={{display:'block',overflow:'visible'}}>
    <style>{`
      .th-wrap{animation:thBob 2.2s ease-in-out infinite}
      .th-dance{animation:thDance .48s ease-in-out infinite}
      .th-breath{animation:thBreath 2s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
      .th-tail{transform-box:fill-box;transform-origin:22px 72px;animation:thTailSlow 1.7s ease-in-out infinite}
      .th-tail-fast{animation:thTailFast .3s ease-in-out infinite}
      .th-blink{animation:thBlink 4.5s infinite;transform-origin:center;transform-box:fill-box}
      .th-cape{transform-origin:50px 67px;transform-box:fill-box;animation:thCape 1.6s ease-in-out infinite}
      .th-halo{transform-origin:50px 15px;transform-box:fill-box;animation:thHalo 2s ease-in-out infinite}
      .th-glow-1{animation:thSpark 1.6s ease-in-out infinite}
      .th-glow-2{animation:thSpark 1.6s ease-in-out .5s infinite}
      .th-zzz-1{animation:thZ1 1.8s ease-out infinite}
      .th-zzz-2{animation:thZ2 1.8s ease-out .6s infinite}
      .th-tongue{animation:thTongue .85s ease-in-out infinite;transform-origin:center top;transform-box:fill-box}
      .th-cheek{animation:thChew .42s ease-in-out infinite}
      @keyframes thBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.2px)}}
      @keyframes thDance{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.015)}}
      @keyframes thBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.012,.992)}}
      @keyframes thTailSlow{0%,100%{transform:rotate(-9deg)}50%{transform:rotate(12deg)}}
      @keyframes thTailFast{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(24deg)}}
      @keyframes thBlink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.08)}}
      @keyframes thCape{0%,100%{transform:rotate(0deg) translateY(0)}50%{transform:rotate(-2.5deg) translateY(.4px)}}
      @keyframes thHalo{0%,100%{transform:scale(1);opacity:.95}50%{transform:scale(1.05);opacity:1}}
      @keyframes thSpark{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:.85;transform:scale(1.15)}}
      @keyframes thTongue{0%,100%{transform:scaleY(1) translateY(0)}50%{transform:scaleY(1.08) translateY(.5px)}}
      @keyframes thChew{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
      @keyframes thZ1{0%{opacity:0;transform:translate(0,0) scale(.7)}20%{opacity:.9}100%{opacity:0;transform:translate(6px,-10px) scale(1.05)}}
      @keyframes thZ2{0%{opacity:0;transform:translate(0,0) scale(.7)}20%{opacity:.75}100%{opacity:0;transform:translate(10px,-16px) scale(1.15)}}
    `}</style>
    <defs>
      <radialGradient id="thHaloGrad" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#FFF8B8" stopOpacity="0.95"/><stop offset="65%" stopColor="#FFE26A" stopOpacity="0.75"/><stop offset="100%" stopColor="#FFD54A" stopOpacity="0.15"/></radialGradient>
      <radialGradient id="thGlowGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFF4AF" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFF4AF" stopOpacity="0"/></radialGradient>
    </defs>
    <g className={isDance?"th-dance":"th-wrap"}>
      <g className="th-halo"><ellipse cx="50" cy="15" rx="16" ry="5.2" fill="url(#thHaloGrad)"/><ellipse cx="50" cy="15" rx="12.5" ry="3.2" fill="none" stroke="#FFD84E" strokeWidth="2"/></g>
      <circle cx="30" cy="18" r="5" fill="url(#thGlowGrad)" className="th-glow-1"/>
      <circle cx="70" cy="19" r="4.4" fill="url(#thGlowGrad)" className="th-glow-2"/>
      <circle cx="24" cy="30" r="3.4" fill="url(#thGlowGrad)" className="th-glow-2"/>
      <circle cx="76" cy="31" r="3.2" fill="url(#thGlowGrad)" className="th-glow-1"/>
      <g className="th-breath">
        <g className="th-cape">
          <path d="M38 58 Q30 67 29 82 Q39 79 44 85 Q50 79 56 85 Q61 79 71 82 Q70 67 62 58 Z" fill="#D92A2A"/>
          <path d="M42 60 Q35 67 35 79 Q41 77 45 81 Q50 77 55 81 Q59 77 65 79 Q65 67 58 60 Z" fill="#F14444" opacity="0.55"/>
        </g>
        <g className={`th-tail ${isHappy||isHungry||isEating?"th-tail-fast":""}`}>
          <path d="M22 72 C11 65, 12 54, 20 50 C25 47, 30 49, 29 54 C28 58, 25 60, 25 63 C25 66, 28 68, 31 69" fill="none" stroke="#86573C" strokeWidth="4.5" strokeLinecap="round"/>
        </g>
        <ellipse cx="52" cy="72" rx="22" ry="16.5" fill="#C98A58"/>
        <ellipse cx="53" cy="74.5" rx="12.5" ry="9.6" fill="#FFF6EC"/>
        <ellipse cx="66" cy="67" rx="7.4" ry="5.3" fill="#A76B45" opacity="0.9"/>
        <rect x="37" y="78" width="6.8" height="11" rx="3.2" fill="#C98A58"/>
        <rect x="58" y="78" width="6.8" height="11" rx="3.2" fill="#C98A58"/>
        <ellipse cx="40.4" cy="90" rx="5.3" ry="3.5" fill="#86573C"/>
        <ellipse cx="61.4" cy="90" rx="5.3" ry="3.5" fill="#86573C"/>
        <path d="M44 58 Q52 63 60 58 L58 63 Q52 66 46 63 Z" fill="#C61F1F"/>
        <circle cx="52" cy="61" r="2.5" fill="#FFD84E" stroke="#E1B72B" strokeWidth="1"/>
        <ellipse cx="50" cy="38" rx="24" ry="20" fill="#E8B684"/>
        <g transform={earLeft}><ellipse cx="28" cy="39" rx="7.1" ry="15.5" fill="#86573C"/><ellipse cx="28.8" cy="43.5" rx="4.1" ry="9.5" fill="#A76B45" opacity="0.45"/></g>
        <g transform={earRight}><ellipse cx="72" cy="39" rx="7.1" ry="15.5" fill="#86573C"/><ellipse cx="71.2" cy="43.5" rx="4.1" ry="9.5" fill="#A76B45" opacity="0.45"/></g>
        <path d="M44 19 C47 24, 47 30, 44 35 C48 37.6, 52 37.6, 56 35 C53 30, 53 24, 56 19 C52.5 16.4, 47.5 16.4, 44 19 Z" fill="#FFFDFC" opacity="0.95"/>
        <path d="M34 31 Q41 26 50 27 Q59 26 66 31 Q64 39 58 41 Q54 39.5 50 39.5 Q46 39.5 42 41 Q36 39 34 31 Z" fill="#7C4B6B" opacity="0.82"/>
        <ellipse cx="50" cy="47.6" rx="10.8" ry="8" fill="#FFF7F0"/>
        <ellipse cx="50" cy="52.4" rx="6.7" ry="4.1" fill="#FFF7F0"/>
        {!isHappy&&!isEating&&!isSleeping?<>
          <g className={mood==='idle'?"th-blink":""}>
            <ellipse cx="41" cy={isSad?"38.8":isHungry?"38.4":"37.8"} rx={isHungry?"4.9":"4.5"} ry={isHungry?"6.2":isSad?"5.2":"5.5"} fill="#181818"/>
            <circle cx="39.6" cy="35.9" r="1.45" fill="#fff"/><circle cx="42.1" cy="38.2" r="0.72" fill="#fff"/>
          </g>
          <g className={mood==='idle'?"th-blink":""}>
            <ellipse cx="59" cy={isSad?"38.8":isHungry?"38.4":"37.8"} rx={isHungry?"4.9":"4.5"} ry={isHungry?"6.2":isSad?"5.2":"5.5"} fill="#181818"/>
            <circle cx="57.6" cy="35.9" r="1.45" fill="#fff"/><circle cx="60.1" cy="38.2" r="0.72" fill="#fff"/>
          </g>
          {!isSad&&!isHungry&&<><path d="M36 31 Q40.5 28.3 45 30.2" fill="none" stroke="#6E442E" strokeWidth="1.45" strokeLinecap="round"/><path d="M55 30.2 Q59.5 28.3 64 31" fill="none" stroke="#6E442E" strokeWidth="1.45" strokeLinecap="round"/></>}
          {isSad&&<><path d="M36 33.2 Q40 31.2 45 33.6" fill="none" stroke="#6E442E" strokeWidth="1.45" strokeLinecap="round"/><path d="M55 33.6 Q60 31.2 64 33.2" fill="none" stroke="#6E442E" strokeWidth="1.45" strokeLinecap="round"/></>}
          {isHungry&&<><path d="M36 31.5 Q40 28.4 45 31.3" fill="none" stroke="#6E442E" strokeWidth="1.45" strokeLinecap="round"/><path d="M55 31.3 Q60 28.4 64 31.5" fill="none" stroke="#6E442E" strokeWidth="1.45" strokeLinecap="round"/></>}
        </>:<>
          <path d="M36 39 Q41 43.3 46 39" fill="none" stroke="#231B1A" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M54 39 Q59 43.3 64 39" fill="none" stroke="#231B1A" strokeWidth="2.2" strokeLinecap="round"/>
        </>}
        <ellipse cx="50" cy="45.2" rx="3.2" ry="2.4" fill="#171413"/>
        {isHappy&&<><path d="M44.5 51 Q50 57.2 55.5 51" fill="none" stroke="#7B3F38" strokeWidth="2.1" strokeLinecap="round"/><path className="th-tongue" d="M47.4 52.2 Q50 58.2 52.6 52.2 Z" fill="#F28EA7"/></>}
        {isSad&&<path d="M45.5 55.2 Q50 51.5 54.5 55.2" fill="none" stroke="#7B3F38" strokeWidth="1.8" strokeLinecap="round"/>}
        {isHungry&&<><ellipse cx="50" cy="53.8" rx="4.1" ry="3.3" fill="#9C4A43"/><path d="M47.8 52.8 Q50 56 52.2 52.8" fill="#F5A5B8"/></>}
        {isEating&&<><g className="th-cheek"><ellipse cx="41.2" cy="49.9" rx="3.1" ry="2.3" fill="#F2C1B3"/><ellipse cx="58.8" cy="49.9" rx="3.1" ry="2.3" fill="#F2C1B3"/></g><path d="M45.5 52.5 Q50 55.4 54.5 52.5" fill="none" stroke="#7B3F38" strokeWidth="1.9" strokeLinecap="round"/></>}
        {isSleeping&&<path d="M45.5 52.4 Q50 54.7 54.5 52.4" fill="none" stroke="#7B3F38" strokeWidth="1.7" strokeLinecap="round"/>}
        {!isHappy&&!isSad&&!isHungry&&!isEating&&!isSleeping&&<path d="M44 50.6 Q50 55.2 56 50.6" fill="none" stroke="#7B3F38" strokeWidth="1.9" strokeLinecap="round"/>}
        {(isHappy||isEating||isHungry)&&<><ellipse cx="36.6" cy="49.4" rx="2.5" ry="1.35" fill="#F3B1AD" opacity="0.58"/><ellipse cx="63.4" cy="49.4" rx="2.5" ry="1.35" fill="#F3B1AD" opacity="0.58"/></>}
        <path d="M52 61 Q51 67 52 77" fill="none" stroke="#E8C5A9" strokeWidth="1.35" strokeLinecap="round"/>
        <path d="M18 42 L19.5 45 L23 46 L19.5 47 L18 50 L16.5 47 L13 46 L16.5 45 Z" fill="#FFE26A" className="th-glow-1"/>
        <path d="M82 42 L83.3 44.7 L86 46 L83.3 47.3 L82 50 L80.7 47.3 L78 46 L80.7 44.7 Z" fill="#FFE26A" className="th-glow-2"/>
        {isSleeping&&<g fill="#7368D8" fontFamily="Arial, sans-serif" fontWeight="700"><text x="68" y="18" fontSize="7" className="th-zzz-1">Z</text><text x="76" y="11" fontSize="9" className="th-zzz-2">Z</text></g>}
      </g>
    </g>
  </svg>
}

export function DogMascot({mood='idle',size=48,phase=0,season,interactive=false}){
  const [curMood,setCurMood]=useState(mood);
  const prevMood=useRef(mood);
  const holdTimer=useRef(null);
  useEffect(()=>{prevMood.current=mood;setCurMood(mood)},[mood]);
  const m=curMood;
  const p=Math.max(0,Math.min(2,phase));

  // Touch interactions
  const handlers=interactive?{
    onClick:()=>{const prev=prevMood.current;setCurMood('happy');setTimeout(()=>setCurMood(prev),1500)},
    onDoubleClick:(e)=>{e.stopPropagation();beep(880,100);const prev=prevMood.current;setCurMood('dance');setTimeout(()=>setCurMood(prev),2000)},
    onMouseDown:()=>{holdTimer.current=setTimeout(()=>{prevMood.current=curMood;setCurMood('sleeping')},1000)},
    onMouseUp:()=>{if(holdTimer.current){clearTimeout(holdTimer.current);holdTimer.current=null}if(curMood==='sleeping')setCurMood(prevMood.current)},
    onTouchStart:()=>{holdTimer.current=setTimeout(()=>{prevMood.current=curMood;setCurMood('sleeping')},1000)},
    onTouchEnd:()=>{if(holdTimer.current){clearTimeout(holdTimer.current);holdTimer.current=null}if(curMood==='sleeping')setCurMood(prevMood.current)},
  }:{};

  // Phase 0 = TokiCachorro, Phase 1 = TokiJoven
  if(p===0) return <div style={{display:'inline-block',cursor:interactive?'pointer':'default'}} {...handlers}><TokiCachorro mood={m} size={size}/></div>;
  if(p===1) return <div style={{display:'inline-block',cursor:interactive?'pointer':'default'}} {...handlers}><TokiJoven mood={m} size={size}/></div>;

  // Phase 2 = TokiHeroe
  return <div style={{display:'inline-block',cursor:interactive?'pointer':'default'}} {...handlers}><TokiHeroe mood={m} size={size}/></div>;
}

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

// ===== ASTRONAUT DAILY — Evolutionary astronaut based on daily exercise count =====
export function AstronautDaily({ phase = 1, size = 40, onClick }) {
  const colors = {
    1: { suit: '#B0BEC5', visor: '#42A5F5', accent: '#78909C' },
    2: { suit: '#E0E0E0', visor: '#66BB6A', accent: '#FFD54F' },
    3: { suit: '#CE93D8', visor: '#EF5350', accent: '#FF7043' },
    4: { suit: '#FFD54F', visor: '#FF6F00', accent: '#FFF176' },
  };
  const c = colors[phase] || colors[1];
  const glow = phase >= 3;
  return (
    <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', display: 'inline-block', position: 'relative' }}>
      {glow && <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: `radial-gradient(circle, ${c.accent}44 0%, transparent 70%)`, animation: 'astro-glow 2s ease-in-out infinite' }} />}
      <svg width={size} height={size} viewBox="0 0 64 64">
        {/* Helmet */}
        <circle cx="32" cy="24" r="18" fill={c.suit} stroke="#fff" strokeWidth="2" />
        {/* Visor */}
        <ellipse cx="32" cy="24" rx="12" ry="10" fill={c.visor} opacity="0.85" />
        <ellipse cx="28" cy="21" rx="3" ry="2" fill="rgba(255,255,255,.4)" />
        {/* Body */}
        <rect x="22" y="40" width="20" height="16" rx="6" fill={c.suit} stroke="#fff" strokeWidth="1.5" />
        {/* Arms */}
        <rect x="12" y="42" width="12" height="6" rx="3" fill={c.suit} stroke="#fff" strokeWidth="1" />
        <rect x="40" y="42" width="12" height="6" rx="3" fill={c.suit} stroke="#fff" strokeWidth="1" />
        {/* Legs */}
        <rect x="24" y="54" width="6" height="8" rx="3" fill={c.suit} />
        <rect x="34" y="54" width="6" height="8" rx="3" fill={c.suit} />
        {/* Phase 2+: Medal */}
        {phase >= 2 && <circle cx="32" cy="46" r="4" fill="#FFD54F" stroke="#FFA000" strokeWidth="1" />}
        {phase >= 2 && <text x="32" y="48" textAnchor="middle" fontSize="5" fill="#795548" fontWeight="bold">&#9733;</text>}
        {/* Phase 3+: Cape */}
        {phase >= 3 && <path d="M22 42 L16 58 L32 54 L48 58 L42 42" fill={c.accent} opacity="0.7" />}
        {/* Phase 4: Crown */}
        {phase === 4 && <polygon points="24,8 28,2 32,8 36,2 40,8" fill="#FFD54F" stroke="#FFA000" strokeWidth="1" />}
      </svg>
    </div>
  );
}

// ===== ASTRONAUT OVERLAY — Podium display with phases =====
export function AstronautOverlay({ phase, dailyCount, photo, onClose }) {
  const phases = [
    { n: 1, label: '0-99', title: 'Empezando', emoji: '🌱' },
    { n: 2, label: '100-199', title: 'Entrenado', emoji: '🏅' },
    { n: 3, label: '200-299', title: 'Campeón', emoji: '🦸' },
    { n: 4, label: '300+', title: 'Leyenda', emoji: '👑' },
  ];
  const cheers = {
    1: ['¡Sigue, puedes hacerlo!', '¡Vamos a por los 100!', '¡Tú puedes!', '¡Arriba!', '¡Dale caña!', '¡Ánimo!'],
    2: ['¡Bien hecho!', '¡Eres un campeón!', '¡Entrenamiento completado!', '¡Genial!', '¡Impresionante!', '¡Qué crack!'],
    3: ['¡Estás que te sales!', '¡Increíble esfuerzo!', '¡Máquina!', '¡Imparable!', '¡Brutal!', '¡Vas volando!'],
    4: ['¡Leyenda absoluta!', '¡Pero qué has comido hoy!', '¡Eres imparable!', '¡Récord histórico!', '¡Fuera de serie!', '¡De otro planeta!'],
  };
  const cheer = cheers[phase] ? cheers[phase][Math.floor(Math.random() * cheers[phase].length)] : '¡Sigue así!';

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, rgba(15,25,50,.97) 0%, rgba(0,0,0,.98) 100%)', zIndex: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {/* Confetti for phase 2+ */}
      {phase>=2&&Array.from({length:phase*8}).map((_,i)=><div key={i} style={{position:'fixed',left:Math.random()*100+'%',top:-10,width:6+Math.random()*6,height:6+Math.random()*6,borderRadius:Math.random()>.5?'50%':'2px',background:['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#96E6A1','#DDA0DD','#FF9800'][i%7],animation:`confetti-fall ${2.5+Math.random()*2}s linear ${Math.random()*2}s forwards`,zIndex:401}}/>)}
      <style>{`@keyframes confetti-fall{0%{transform:translateY(-10vh) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
      {/* Photo */}
      {photo&&<img src={photo} alt="" style={{width:80,height:80,borderRadius:'50%',border:'4px solid #FFD54F',objectFit:'cover',marginBottom:12,boxShadow:'0 0 20px rgba(255,215,0,.4)'}}/>}
      <div style={{ fontSize: 28, fontWeight: 800, color: '#FFD54F', marginBottom: 20, textAlign:'center' }}>Hoy: {dailyCount} ejercicios</div>
      <div style={{ display: 'flex', gap: 'clamp(12px, 4vw, 28px)', alignItems: 'flex-end', marginBottom: 28 }}>
        {phases.map(p => {
          const achieved = phase >= p.n;
          const active = phase === p.n;
          const sz = 56 + p.n * 16;
          return (
            <div key={p.n} style={{ textAlign: 'center', opacity: achieved ? 1 : 0.25, transition: 'all .3s', transform: active ? 'scale(1.1)' : 'scale(1)' }}>
              <div style={{ fontSize: sz * 0.65, marginBottom: 6, animation: active ? 'astro-dance .5s ease-in-out infinite alternate' : 'none', filter: active ? 'drop-shadow(0 0 12px rgba(255,215,0,.6))' : 'none' }}>
                {p.emoji}
              </div>
              {active && <div style={{ fontSize: 13, color: '#FFD54F', fontWeight: 800, marginBottom: 2 }}>TU</div>}
              <div style={{ fontSize: 14, fontWeight: 700, color: achieved ? '#fff' : '#555' }}>{p.title}</div>
              <div style={{ fontSize: 12, color: achieved ? '#aaa' : '#333' }}>{p.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#FFD54F', textAlign: 'center', animation: 'astro-bounce 1s ease-in-out infinite alternate', maxWidth: 340 }}>
        {cheer}
      </div>
      <div style={{ marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,.35)' }}>Toca para cerrar</div>
      <style>{`
        @keyframes astro-dance{0%{transform:translateY(0) rotate(-5deg)}100%{transform:translateY(-8px) rotate(5deg)}}
        @keyframes astro-bounce{0%{transform:scale(1)}100%{transform:scale(1.05)}}
        @keyframes astro-glow{0%,100%{opacity:.5}50%{opacity:1}}
      `}</style>
    </div>
  );
}

// ===== ActionDock — dock fijo reutilizable para ejercicios no-orales =====
// Proporciona pausa (izq) + contenido central (custom) + skip (der) en la MISMA
// posición que SpeakPanel, manteniendo consistencia visual entre módulos.
export function ActionDock({onPause,onSkip,center=null}){
  const w=typeof window!=='undefined'?window.innerWidth:1280;
  const isPhone=w<=480,isTabletLandscape=w>=1024&&w<=1365,isDesktop=w>=1366;
  const sideBtn=isPhone?62:isTabletLandscape?76:isDesktop?80:72;
  const gap=isPhone?14:isTabletLandscape?24:18;
  const dockBottom='calc(var(--safe-bottom) + 12px)';
  return <div style={{position:'fixed',left:'50%',bottom:dockBottom,transform:'translateX(-50%)',display:'flex',alignItems:'center',justifyContent:'center',gap,zIndex:10,padding:'10px 14px',borderRadius:999,background:'rgba(10,22,40,.22)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,.06)'}}>
    {onPause?<button onClick={onPause} style={{width:sideBtn,height:sideBtn,borderRadius:'50%',border:'none',cursor:'pointer',background:'radial-gradient(circle at 30% 25%,#FFB74D,#FF9800 60%,#E65100)',boxShadow:'0 3px 12px #FF980044, inset 0 -3px 8px #E6510066',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Fredoka'",transition:'transform .15s',flexShrink:0}} title="Pausar"><span style={{fontSize:Math.round(sideBtn*0.45)}}>⏸️</span></button>
    :<div style={{width:sideBtn,height:sideBtn,flexShrink:0}}/>}
    {center}
    {onSkip?<button className="skip-btn" onClick={onSkip} style={{width:sideBtn,height:sideBtn,borderRadius:'50%',border:'none',cursor:'pointer',background:'radial-gradient(circle at 30% 25%,#999,#666 60%,#444)',boxShadow:'0 2px 8px rgba(0,0,0,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Fredoka'",transition:'transform .15s',flexShrink:0}} title="Saltar"><span style={{fontSize:Math.round(sideBtn*0.36)}}>⏭️</span></button>
    :<div style={{width:sideBtn,height:sideBtn,flexShrink:0}}/>}
  </div>;
}
