import { useState, useEffect } from 'react'
import { BG, BG2, GOLD, GREEN, BLUE, DIM, CARD } from '../constants.js'
import { sayFB } from '../voice.js'
import { SpaceMascot, Confetti } from './UIKit.jsx'

export function victoryBeeps(){try{const c=new(window.AudioContext||window.webkitAudioContext)();const notes=[392,494,587,784,659,784,988,1175,988,1175];const durations=[0.25,0.2,0.2,0.3,0.2,0.2,0.25,0.3,0.2,0.6];let t=0;notes.forEach((f,i)=>{const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;const vol=i>=7?0.09:0.07;g.gain.value=vol;g.gain.setValueAtTime(vol,c.currentTime+t);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+t+durations[i]);o.start(c.currentTime+t);o.stop(c.currentTime+t+durations[i]);t+=durations[i]*0.65});setTimeout(()=>c.close(),4000)}catch(e){}}

export function DoneScreen({st,elapsed,user,supPin,onExit}){
  const[xConf,sXConf]=useState(false);
  const tot=st.ok+st.sk,pct=tot>0?Math.round(st.ok/tot*100):0;
  const uname=user?.name||'crack';
  // Graduated praise based on performance
  const praise=pct>=80?'¡Lo has hecho genial!':pct>=40?'¡Buen trabajo!':'¡Has practicado mucho!';
  const praiseVoice=pct>=80?'¡Lo has hecho genial, '+uname+'!':pct>=40?'¡Buen trabajo, '+uname+'!':'¡Has practicado mucho, '+uname+'!';
  useEffect(()=>{victoryBeeps();sXConf(true);const t1=setTimeout(()=>sXConf(false),3000);const t2=setTimeout(()=>{sXConf(true);setTimeout(()=>sXConf(false),3000)},4000);sayFB(praiseVoice+' ¿Quieres seguir?');return()=>{clearTimeout(t1);clearTimeout(t2)}},[]);
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'radial-gradient(ellipse at center,'+BG2+' 0%,'+BG+' 100%)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:20,overflow:'hidden'}}>
    <Confetti show={xConf}/>
    <div style={{maxWidth:420,width:'100%',textAlign:'center'}}>
      {<div className="ab">
        <div style={{display:'flex',justifyContent:'center',alignItems:'flex-end',gap:12,marginBottom:4}}>
          <div style={{fontSize:100,animation:'pulse 1s infinite'}}>🏆</div>
          <div style={{marginBottom:16}}><SpaceMascot mood="dance" size={56}/></div>
        </div>
        <h1 style={{fontSize:28,color:GOLD,margin:'0 0 8px',animation:'fadeIn .5s .3s both'}}>¡FELICIDADES {uname.toUpperCase()}!</h1>
        <div style={{display:'flex',justifyContent:'center',gap:16,marginBottom:24,animation:'fadeIn .5s .9s both'}}>
          {[{l:'Bien',v:st.ok,c:GREEN},{l:'Acierto',v:pct+'%',c:BLUE},{l:'Minutos',v:elapsed,c:GOLD}].map((s,i)=>
            <div key={i} style={{background:CARD,border:'2px solid '+s.c+'44',borderRadius:16,padding:'14px 18px',minWidth:80}}>
              <div style={{fontSize:28,color:s.c,fontWeight:700}}>{s.v}</div>
              <div style={{fontSize:12,color:DIM}}>{s.l}</div>
            </div>)}
        </div>
        <div style={{background:GREEN+'15',border:'2px solid '+GREEN+'33',borderRadius:16,padding:18,marginBottom:20,animation:'fadeIn .5s 1.1s both'}}>
          <p style={{fontSize:22,fontWeight:700,margin:0,color:pct>=80?GREEN:pct>=40?BLUE:GOLD}}>{praise}</p>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:24,animation:'fadeIn .5s 1.1s both'}}>
          <button onClick={()=>onExit('repeat')} style={{width:110,height:110,borderRadius:'50%',border:'3px solid #27ae60',background:GREEN,color:'#fff',fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer',boxShadow:'4px 4px 0 #1e8449',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,transition:'transform .1s'}}><span style={{fontSize:28}}>🔄</span><span>¡Otra ronda!</span></button>
          <button onClick={()=>onExit('menu')} style={{width:110,height:110,borderRadius:'50%',border:'3px solid #2980b9',background:BLUE,color:'#fff',fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer',boxShadow:'4px 4px 0 #1a5276',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,transition:'transform .1s'}}><span style={{fontSize:28}}>🪐</span><span>Menú</span></button>
        </div>
      </div>}
    </div>
  </div>}
