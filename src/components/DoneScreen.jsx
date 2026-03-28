import { useState, useEffect } from 'react'
import { BG, BG2, GOLD, GREEN, BLUE, DIM, CARD } from '../constants.js'
import { sayFB } from '../voice.js'
import { getMascotTier } from '../utils.js'
import { SpaceMascot, Confetti } from './UIKit.jsx'

export function victoryBeeps(){try{const c=new(window.AudioContext||window.webkitAudioContext)();const notes=[392,494,587,784,659,784,988,1175,988,1175];const durations=[0.25,0.2,0.2,0.3,0.2,0.2,0.25,0.3,0.2,0.6];let t=0;notes.forEach((f,i)=>{const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;const vol=i>=7?0.09:0.07;g.gain.value=vol;g.gain.setValueAtTime(vol,c.currentTime+t);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+t+durations[i]);o.start(c.currentTime+t);o.stop(c.currentTime+t+durations[i]);t+=durations[i]*0.65});setTimeout(()=>c.close(),4000)}catch(e){}}

const TIER_NAMES=["Estrellita","Bronce","Plata","Oro","Superestrella","Legendaria"];
const TIER_ICONS=["⭐","🥉","🥈","🥇","💫","👑"];
const TIER_THRESHOLDS=[0,50,150,300,500,1000];

export function DoneScreen({st,elapsed,user,supPin,onExit,sessionStars=0,maxStreak=0,totalLifetimeStars=0,randomStats=null}){
  const[xConf,sXConf]=useState(false);
  const tot=st.ok+st.sk,pct=tot>0?Math.round(st.ok/tot*100):0;
  const uname=user?.name||'crack';
  // Graduated praise based on performance
  const praise=pct>=80?'¡Lo has hecho genial!':pct>=40?'¡Buen trabajo!':'¡Has practicado mucho!';
  const praiseVoice=pct>=80?'¡Lo has hecho genial, '+uname+'!':pct>=40?'¡Buen trabajo, '+uname+'!':'¡Has practicado mucho, '+uname+'!';

  // Mascot tier progress
  const tier=getMascotTier(totalLifetimeStars);
  const tierName=TIER_NAMES[tier];
  const tierIcon=TIER_ICONS[tier];
  const nextTier=tier<5?tier+1:5;
  const nextName=TIER_NAMES[nextTier];
  const nextIcon=TIER_ICONS[nextTier];
  const curThreshold=TIER_THRESHOLDS[tier];
  const nextThreshold=TIER_THRESHOLDS[nextTier];
  const tierProgress=tier>=5?1:Math.min(1,(totalLifetimeStars-curThreshold)/Math.max(1,nextThreshold-curThreshold));

  // Personal podium: compare today vs best 2 historical
  const hist=(user?.hist||[]).slice();
  const bestHist=hist.sort((a,b)=>(b.ok||0)-(a.ok||0)).slice(0,2);
  const podiumEntries=[];
  // Combine today + best 2 historical, sort descending, assign medals
  const allScores=[{ok:st.ok,label:'Hoy',isToday:true}];
  bestHist.forEach((h,i)=>allScores.push({ok:h.ok||0,label:h.dt||`Sesión ${i+1}`,isToday:false}));
  allScores.sort((a,b)=>b.ok-a.ok);
  const medals=['🥇','🥈','🥉'];

  useEffect(()=>{victoryBeeps();sXConf(true);const t1=setTimeout(()=>sXConf(false),3000);const t2=setTimeout(()=>{sXConf(true);setTimeout(()=>sXConf(false),3000)},4000);sayFB(praiseVoice+' ¿Quieres seguir?');return()=>{clearTimeout(t1);clearTimeout(t2)}},[]);

  const cardSt={background:CARD,border:'2px solid '+GOLD+'33',borderRadius:16,padding:'12px 14px',marginBottom:14,animation:'fadeIn .5s 1.2s both'};

  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'radial-gradient(ellipse at center,'+BG2+' 0%,'+BG+' 100%)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:20,overflow:'auto'}}>
    <Confetti show={xConf}/>
    <div style={{maxWidth:420,width:'100%',textAlign:'center'}}>
      <div className="ab">
        {/* Trophy + mascot */}
        <div style={{display:'flex',justifyContent:'center',alignItems:'flex-end',gap:12,marginBottom:4}}>
          <div style={{fontSize:80,animation:'pulse 1s infinite'}}>🏆</div>
          <div style={{marginBottom:12}}><SpaceMascot mood="dance" size={48} tier={getMascotTier(totalLifetimeStars)}/></div>
        </div>
        <h1 style={{fontSize:26,color:GOLD,margin:'0 0 8px',animation:'fadeIn .5s .3s both'}}>¡FELICIDADES {uname.toUpperCase()}!</h1>

        {/* Stats row: Stars, Accuracy, Minutes */}
        <div style={{display:'flex',justifyContent:'center',gap:12,marginBottom:16,animation:'fadeIn .5s .9s both',flexWrap:'wrap'}}>
          {[
            {l:'Estrellas',v:sessionStars||st.ok,c:GOLD,icon:'⭐'},
            {l:'Acierto',v:pct+'%',c:BLUE,icon:''},
            {l:'Minutos',v:elapsed,c:GREEN,icon:''}
          ].map((s,i)=>
            <div key={i} style={{background:CARD,border:'2px solid '+s.c+'44',borderRadius:14,padding:'10px 14px',minWidth:70}}>
              <div style={{fontSize:24,color:s.c,fontWeight:700}}>{s.icon?s.icon+' ':''}{s.v}</div>
              <div style={{fontSize:11,color:DIM}}>{s.l}</div>
            </div>)}
        </div>

        {/* Streak */}
        {maxStreak>1&&<div style={{...cardSt,background:CARD,border:'2px solid #E67E2244'}}>
          <div style={{fontSize:18,fontWeight:600,color:'#E67E22'}}>
            🔥 ¡Racha de {maxStreak} seguidas!
          </div>
        </div>}

        {/* Graduated praise */}
        <div style={{background:GREEN+'15',border:'2px solid '+GREEN+'33',borderRadius:16,padding:14,marginBottom:14,animation:'fadeIn .5s 1.1s both'}}>
          <p style={{fontSize:20,fontWeight:700,margin:0,color:pct>=80?GREEN:pct>=40?BLUE:GOLD}}>{praise}</p>
        </div>

        {/* Podium: today vs best 2 */}
        {bestHist.length>0&&<div style={{...cardSt}}>
          <div style={{fontSize:14,fontWeight:600,color:DIM,marginBottom:8}}>Tu podio personal</div>
          <div style={{display:'flex',justifyContent:'center',gap:8,alignItems:'flex-end'}}>
            {allScores.slice(0,3).map((entry,i)=>{
              const heights=[72,56,44];
              const isMe=entry.isToday;
              return <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <div style={{fontSize:20}}>{medals[i]||''}</div>
                <div style={{
                  width:60,height:heights[i]||40,
                  borderRadius:'10px 10px 4px 4px',
                  background:isMe?GREEN+'33':BLUE+'22',
                  border:isMe?'2px solid '+GREEN:'2px solid '+BLUE+'44',
                  display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                  gap:2
                }}>
                  <div style={{fontSize:18,fontWeight:700,color:isMe?GREEN:BLUE}}>{entry.ok}</div>
                </div>
                <div style={{fontSize:10,color:isMe?GREEN:DIM,fontWeight:isMe?700:400,maxWidth:64,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {entry.label}
                </div>
              </div>
            })}
          </div>
        </div>}

        {/* Mascot evolution - visual tier display */}
        <div style={{...cardSt}}>
          <div style={{display:'flex',justifyContent:'center',alignItems:'flex-end',gap:6,marginBottom:8,flexWrap:'wrap'}}>
            {TIER_NAMES.map((name,i)=>{
              const unlocked=i<=tier;
              const isCurrent=i===tier;
              return <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,transition:'transform .3s',transform:isCurrent?'scale(1.2)':'scale(1)'}}>
                <div style={{position:'relative',width:44,height:44,filter:unlocked?'none':'brightness(0.15)',opacity:unlocked?1:0.5,transition:'filter .5s, opacity .5s'}}>
                  <SpaceMascot mood={isCurrent?"dance":"idle"} size={44} tier={i}/>
                  {isCurrent&&<div style={{position:'absolute',bottom:-6,left:'50%',transform:'translateX(-50%)',width:8,height:8,borderRadius:'50%',background:GOLD,boxShadow:'0 0 8px '+GOLD}}/>}
                </div>
                {isCurrent&&<div style={{fontSize:10,color:GOLD,fontWeight:700,marginTop:2}}>{name}</div>}
              </div>})}
          </div>
          {tier<5&&<div style={{background:BG+'88',borderRadius:8,height:10,overflow:'hidden',margin:'0 auto',maxWidth:260}}>
            <div style={{height:'100%',borderRadius:8,background:'linear-gradient(90deg, '+GOLD+', #F7DC6F)',width:(tierProgress*100)+'%',transition:'width .6s'}}/>
          </div>}
          <div style={{fontSize:11,color:DIM,marginTop:4}}>{totalLifetimeStars} ⭐</div>
        </div>

        {/* M7b: Per-module breakdown for random sessions */}
        {randomStats&&Object.keys(randomStats).length>0&&<div style={{...cardSt}}>
          <div style={{fontSize:14,fontWeight:600,color:DIM,marginBottom:8}}>🔀 Desglose por módulo</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {Object.values(randomStats).filter(s=>s.total>0).map((s,i)=>{
              const mpct=s.total>0?Math.round(s.ok/s.total*100):0;
              return <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 10px',borderRadius:10,background:mpct>=80?GREEN+'15':mpct>=50?BLUE+'15':GOLD+'15',border:'1px solid '+(mpct>=80?GREEN:mpct>=50?BLUE:GOLD)+'33'}}>
                <span style={{fontSize:22}}>{s.emoji}</span>
                <div style={{flex:1,textAlign:'left'}}>
                  <div style={{fontSize:14,fontWeight:600,color:'#fff'}}>{s.name}</div>
                  <div style={{fontSize:11,color:DIM}}>{s.ok}/{s.total} correctas</div>
                </div>
                <div style={{fontSize:16,fontWeight:700,color:mpct>=80?GREEN:mpct>=50?BLUE:GOLD}}>{mpct}%</div>
              </div>})}
          </div>
        </div>}

        {/* Action buttons */}
        <div style={{display:'flex',justifyContent:'center',gap:24,animation:'fadeIn .5s 1.3s both'}}>
          <button onClick={()=>onExit('repeat')} style={{width:110,height:110,borderRadius:'50%',border:'3px solid #27ae60',background:GREEN,color:'#fff',fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer',boxShadow:'4px 4px 0 #1e8449',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,transition:'transform .1s'}}><span style={{fontSize:28}}>🔄</span><span>¡Otra ronda!</span></button>
          <button onClick={()=>onExit('menu')} style={{width:110,height:110,borderRadius:'50%',border:'3px solid #2980b9',background:BLUE,color:'#fff',fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer',boxShadow:'4px 4px 0 #1a5276',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,transition:'transform .1s'}}><span style={{fontSize:28}}>🪐</span><span>Menú</span></button>
        </div>
      </div>
    </div>
  </div>}
