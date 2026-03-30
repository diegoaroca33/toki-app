import { useState, useEffect, useMemo } from 'react'
import { GOLD, GREEN } from '../constants.js'
import { isSober } from '../utils.js'

export function Stars({n,sz=32,burst=false}){
  // Generate random offsets once per render via useMemo
  const sparkles=useMemo(()=>[1,2,3,4].map(i=>({
    dx:(Math.random()-.5)*40,        // random x offset ±20px
    dy:(Math.random()-.5)*24,        // random y offset ±12px
    scale:.7+Math.random()*.6,       // size variation 70%-130%
    rot:(Math.random()-.5)*40,       // rotation ±20deg
    delay:Math.random()*.3,          // stagger 0-0.3s
  })),[]);
  if(burst){
    // Pirotecnia — estrellas como chispas dispersas
    return <div style={{position:'relative',width:120,height:110,margin:'0 auto'}}>
      {[1,2,3,4].map(i=>{const s=sparkles[i-1];const cx=15+(i-1)*28+s.dx;const cy=40+s.dy;return <div key={i} style={{position:'absolute',left:cx,top:cy}}>
        <span style={{fontSize:sz*s.scale,display:'block',opacity:0,
          transform:`rotate(${s.rot}deg)`,
          animation:i<=n?`starPop 0.5s ${s.delay+i*0.2}s both, sparkleFlicker 0.8s ${s.delay+i*0.2+0.3}s 2`:'none',
          filter:i<=n?'drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 4px #FF6B00)':'grayscale(1)'}}>{i<=n?'⭐':'☆'}</span>
        {i<=n&&<div style={{position:'absolute',left:'50%',top:'50%',width:sz*s.scale*2,height:sz*s.scale*2,marginLeft:-sz*s.scale,marginTop:-sz*s.scale,borderRadius:'50%',border:'2px solid #FFD700',animation:`starBurstRing 0.6s ${s.delay+i*0.2}s both`}}/>}
      </div>})}
    </div>
  }
  // Standard sparkle stars — scattered with varied sizes
  return <div style={{display:'flex',gap:6,justifyContent:'center',position:'relative',minHeight:sz*1.5}}>
    {[1,2,3,4].map(i=>{const s=sparkles[i-1];return <span key={i} style={{
      fontSize:sz*s.scale,
      opacity:i<=n?1:0.15,
      transform:`translateX(${s.dx*.3}px) translateY(${s.dy*.4}px) rotate(${s.rot}deg)`,
      animation:i<=n?`starPop 0.5s ${s.delay+i*0.15}s both, sparkleFlicker 0.8s ${s.delay+i*0.15+0.4}s 2`:'none',
      filter:i<=n?'drop-shadow(0 0 8px #FFD700)':'grayscale(1)',
      transition:'transform .3s'
    }}>{i<=n?'⭐':'☆'}</span>})}
  </div>
}

// ===== CELEBRATION OVERLAY — reusable fireworks across screen =====
export function CelebrationOverlay({show,duration=2000}){
  const[visible,setVisible]=useState(false);
  const sober=isSober();
  const particles=useMemo(()=>{
    const p=[];
    // Burst from center — stars fly outward
    for(let i=0;i<18;i++){const angle=Math.random()*360;const dist=30+Math.random()*45;const rad=angle*Math.PI/180;
      p.push({i,x:50+dist*Math.cos(rad),y:45+dist*Math.sin(rad)*0.6,sz:20+Math.random()*24,delay:Math.random()*0.4,em:['⭐','✨','🌟','💫','⭐','✨'][i%6],type:'burst'})}
    // Scattered sparkles across full screen
    for(let i=0;i<14;i++)p.push({i:18+i,x:5+Math.random()*90,y:5+Math.random()*85,sz:12+Math.random()*18,delay:0.3+Math.random()*0.6,em:['✨','💫','🌟'][i%3],type:'sparkle'});
    // Confetti-like colored circles
    for(let i=0;i<10;i++)p.push({i:32+i,x:10+Math.random()*80,y:10+Math.random()*70,sz:8+Math.random()*14,delay:Math.random()*0.5,color:['#FF6B6B','#4ECDC4','#FFE66D','#95E1D3','#F38181','#AA96DA'][i%6],type:'confetti'});
    return p},[]);
  useEffect(()=>{if(show){setVisible(true);const t=setTimeout(()=>setVisible(false),duration);return()=>clearTimeout(t)}else{setVisible(false)}},[show,duration]);
  if(!visible)return null;
  if(sober)return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:998,display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{fontSize:80,color:'#4CAF50',animation:'bounceIn .45s',filter:'drop-shadow(0 0 12px rgba(76,175,80,.5))'}}>✓</div>
  </div>;
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:998,overflow:'hidden'}}>
    {particles.filter(s=>s.type==='burst'||s.type==='sparkle').map(s=><span key={s.i} style={{position:'absolute',left:s.x+'%',top:s.y+'%',fontSize:s.sz,opacity:0,animation:`starPop 0.7s ${s.delay}s both`,filter:'drop-shadow(0 0 10px #FFD700)'}}>{s.em}</span>)}
    {particles.filter(s=>s.type==='confetti').map(s=><div key={s.i} style={{position:'absolute',left:s.x+'%',top:s.y+'%',width:s.sz,height:s.sz,borderRadius:'50%',background:s.color,opacity:0,animation:`starPop 0.5s ${s.delay}s both, confettiFall 1.5s ${s.delay+0.3}s forwards`}}/>)}
    {/* Rocket flying up orbit */}
    <div style={{position:'absolute',left:'35%',bottom:'5%',fontSize:44,animation:'rocketUp 1.6s 0.15s ease-in-out forwards'}}>🚀</div>
  </div>}
