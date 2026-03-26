import { useState, useEffect, useMemo } from 'react'
import { GOLD, GREEN } from '../constants.js'
import { isSober } from '../utils.js'

export function Stars({n,sz=32,burst=false}){
  if(burst){
    // Pirotecnia — estrellas explotando en distintas posiciones como fuegos artificiales
    const spots=[{x:10,y:10},{x:70,y:0},{x:0,y:70},{x:65,y:65}];
    return <div style={{position:'relative',width:100,height:110}}>
      {[1,2,3,4].map(i=>{const s=spots[i-1];return <div key={i} style={{position:'absolute',left:s.x,top:s.y}}>
        {/* Estrella con pop */}
        <span style={{fontSize:sz,display:'block',opacity:0,animation:i<=n?`starPop 0.5s ${i*0.3}s both`:'none',filter:i<=n?'drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 4px #FF6B00)':'grayscale(1)'}}>{i<=n?'⭐':'☆'}</span>
        {/* Anillo de explosión */}
        {i<=n&&<div style={{position:'absolute',left:'50%',top:'50%',width:sz*2.5,height:sz*2.5,marginLeft:-sz*1.25,marginTop:-sz*1.25,borderRadius:'50%',border:'2px solid #FFD700',animation:`starBurstRing 0.6s ${i*0.3}s both`}}/>}
      </div>})}
    </div>
  }
  // Standard inline stars (for other modules)
  return <div style={{display:'flex',gap:6,justifyContent:'center'}}>{[1,2,3,4].map(i=><span key={i} style={{fontSize:sz,opacity:i<=n?1:0.15,animation:i<=n?`starPop 0.5s ${i*0.25}s both`:'none',filter:i<=n?'drop-shadow(0 0 8px #FFD700)':'grayscale(1)'}}>{i<=n?'⭐':'☆'}</span>)}</div>
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
