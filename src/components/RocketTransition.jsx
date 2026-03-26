import { useState, useEffect } from 'react'
import { GOLD, RED, BLUE } from '../constants.js'
import { isSober, countdownBeep } from '../utils.js'

export function RocketTransition({show,onDone,avatar,planetEmoji,planetColor}){
  const[phase,setPhase]=useState('idle');const[num,setNum]=useState(3);
  const pc=planetColor||'#42A5F5';
  useEffect(()=>{if(!show)return;if(isSober()){if(onDone)onDone();return}setPhase('ignite');setNum(3);
    // Phase 1: ignite (fire appears) 0-400ms
    const t0=setTimeout(()=>{setPhase('pickup');countdownBeep(3)},400);
    // Phase 2: pickup (rocket+avatar) 400-800ms
    const t1=setTimeout(()=>{setPhase('fly');setNum(3);countdownBeep(3)},800);
    // Phase 3: fly (countdown 3,2,1) 800-2400ms
    const t2=setTimeout(()=>{setNum(2);countdownBeep(2)},1400);
    const t3=setTimeout(()=>{setNum(1);countdownBeep(1)},2000);
    const t4=setTimeout(()=>{setPhase('arrive');countdownBeep(0)},2600);
    // Phase 4: arrive at planet 2600-3200ms
    const t5=setTimeout(()=>{if(onDone)onDone()},3200);
    return()=>{[t0,t1,t2,t3,t4,t5].forEach(clearTimeout)}},[show]);
  if(!show)return null;
  const _rc=(()=>{try{const k=localStorage.getItem('toki_rocket_color')||'rojo';const m={rojo:{nose:RED,body:'#E0E0E0'},azul:{nose:'#2196F3',body:'#BBDEFB'},verde:{nose:'#4CAF50',body:'#C8E6C9'},dorado:{nose:'#FFD700',body:'#FFF8E1'},morado:{nose:'#9C27B0',body:'#E1BEE7'}};return m[k]||m.rojo}catch(e){return{nose:RED,body:'#E0E0E0'}}})();
  const RocketSVG=({size=120,showFire=false,showFace=false})=>(
    <svg width={size} height={size*1.5} viewBox="0 0 100 150">
      {/* Rocket body */}
      <ellipse cx="50" cy="60" rx="22" ry="48" fill={_rc.body} stroke="#BDBDBD" strokeWidth="2"/>
      {/* Nose cone */}
      <ellipse cx="50" cy="18" rx="12" ry="20" fill={_rc.nose}/>
      {/* Left fin */}
      <path d="M28,85 L15,110 L28,100 Z" fill={BLUE} stroke="#1565C0" strokeWidth="1"/>
      {/* Right fin */}
      <path d="M72,85 L85,110 L72,100 Z" fill={BLUE} stroke="#1565C0" strokeWidth="1"/>
      {/* Window/porthole */}
      <circle cx="50" cy="50" r="12" fill="#1A237E" stroke="#90CAF9" strokeWidth="2"/>
      <circle cx="50" cy="50" r="10" fill="#0D47A1"/>
      {/* Face in window */}
      {showFace&&<text x="50" y="55" textAnchor="middle" fontSize="16" dominantBaseline="central">{avatar||'🧑‍🚀'}</text>}
      {!showFace&&<><circle cx="46" cy="47" r="1.5" fill="#90CAF9" opacity=".5"/><circle cx="54" cy="47" r="1" fill="#90CAF9" opacity=".3"/></>}
      {/* Fire/propulsion */}
      {showFire&&<>
        <ellipse cx="50" cy="115" rx="14" ry="25" fill={GOLD} opacity=".85">
          <animate attributeName="ry" values="20;28;20" dur=".3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".7;1;.7" dur=".2s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="50" cy="118" rx="9" ry="18" fill="#E67E22" opacity=".9">
          <animate attributeName="ry" values="14;20;14" dur=".25s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="50" cy="120" rx="5" ry="12" fill="#F44336" opacity=".8">
          <animate attributeName="ry" values="10;15;10" dur=".2s" repeatCount="indefinite"/>
        </ellipse>
      </>}
    </svg>);
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:200,background:'radial-gradient(ellipse,#0B1D3A 0%,#000 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',overflow:'hidden'}}>
    {/* Stars background */}
    {Array.from({length:30},(_,i)=><div key={'s'+i} style={{position:'absolute',left:Math.random()*100+'%',top:Math.random()*100+'%',width:Math.random()>0.5?2:1,height:Math.random()>0.5?2:1,background:'#fff',borderRadius:'50%',opacity:0.3+Math.random()*0.5,animation:`twinkle ${2+Math.random()*3}s ease-in-out infinite`}}/>)}

    {/* Phase 1: IGNITE — rocket shakes, fire starts */}
    {phase==='ignite'&&<div style={{animation:'shake .15s linear infinite'}}>
      <RocketSVG size={140} showFire={true} showFace={false}/>
    </div>}

    {/* Phase 2: PICKUP — rocket moves to get Guillermo, face appears */}
    {phase==='pickup'&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
      <div style={{fontSize:56,animation:'bounceIn .6s ease-out'}}>{avatar||'🧑‍🚀'}</div>
      <div style={{animation:'bounceIn .6s ease-out .3s both'}}>
        <RocketSVG size={130} showFire={true} showFace={true}/>
      </div>
    </div>}

    {/* Phase 3: FLY — countdown with streaking stars */}
    {phase==='fly'&&<>
      {Array.from({length:25},(_,i)=><div key={'st'+i} style={{position:'absolute',left:Math.random()*100+'%',top:'-5%',width:2,height:Math.random()*40+15,background:'#fff',borderRadius:2,opacity:0.6,animation:`starPass ${0.4+Math.random()*0.6}s linear ${i*0.15}s infinite`}}/>)}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
        <div key={num} style={{fontSize:100,fontWeight:900,color:GOLD,animation:'countNum .8s ease-out',textShadow:`0 0 40px ${GOLD}`}}>{num}</div>
        <RocketSVG size={100} showFire={true} showFace={true}/>
      </div>
    </>}

    {/* Phase 4: ARRIVE — rocket reaches planet */}
    {phase==='arrive'&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,animation:'bounceIn .6s ease-out'}}>
      <div style={{width:140,height:140,borderRadius:'50%',
        background:`radial-gradient(circle at 30% 25%,${pc}88,${pc} 60%,${pc}cc)`,
        display:'flex',alignItems:'center',justifyContent:'center',
        boxShadow:`0 0 40px ${pc}66`,
      }}>
        <span style={{fontSize:60}}>{planetEmoji||'🪐'}</span>
      </div>
      <div style={{fontSize:36,fontWeight:900,color:GOLD,textShadow:`0 0 20px ${GOLD}`}}>¡DESPEGUE!</div>
    </div>}
  </div>}
