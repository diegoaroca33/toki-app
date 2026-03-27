import { useState, useEffect, useMemo, useRef } from 'react'
import { GOLD, GREEN, RED, BLUE, PURPLE, DIM, CARD, BORDER } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { loadData, rnd, beep, mkPerfect } from '../utils.js'
import { useIdle, NumPad } from '../components/UIKit.jsx'
import { CelebrationOverlay, Stars } from '../components/CelebrationOverlay.jsx'

// ===== CARD and DOMINO SVGs for Distribute =====
export function CardSVG({size=48,rank='A',suit='♥'}){const suitColors={'♥':'#C0392B','♦':'#C0392B','♠':'#1a1a2e','♣':'#1a1a2e'};const col=suitColors[suit]||'#C0392B';return <svg width={size} height={size*1.4} viewBox="0 0 48 67">
  <rect x={1} y={1} width={46} height={65} rx={6} fill="#fff" stroke="#333" strokeWidth={1.5}/>
  <text x={8} y={18} fill={col} fontSize={14} fontWeight={700}>{rank}</text>
  <text x={24} y={42} fill={col} fontSize={24} textAnchor="middle">{suit}</text>
</svg>}
export function dominoDots(cx,cy,n){const r=3.5;const positions={1:[[cx,cy]],2:[[cx,cy-8],[cx,cy+8]],3:[[cx,cy-9],[cx,cy],[cx,cy+9]],4:[[cx-5,cy-7],[cx+5,cy-7],[cx-5,cy+7],[cx+5,cy+7]],5:[[cx-5,cy-7],[cx+5,cy-7],[cx,cy],[cx-5,cy+7],[cx+5,cy+7]],6:[[cx-5,cy-8],[cx+5,cy-8],[cx-5,cy],[cx+5,cy],[cx-5,cy+8],[cx+5,cy+8]]};return(positions[n]||[]).map(([x,y],i)=><circle key={i} cx={x} cy={y} r={r} fill="#333"/>)}
export function DominoSVG({size=48,dots}){const l=dots?dots[0]:2,r2=dots?dots[1]:3;return <svg width={size*1.6} height={size} viewBox="0 0 77 48">
  <rect x={1} y={1} width={75} height={46} rx={6} fill="#F5F0E1" stroke="#333" strokeWidth={1.5}/>
  <line x1={38} y1={4} x2={38} y2={44} stroke="#333" strokeWidth={1.5}/>
  {dominoDots(19,24,l)}{dominoDots(57,24,r2)}
</svg>}

// ===== REPARTE Y CUENTA =====
export function genDistribute(lv,user){const items=[];const pNames=(loadData('personas',[])||[]).filter(p=>p.name).map(p=>p.name);const friends=pNames.length>=2?pNames:((user?.amigos||'Yasser,Lola,Vega,Amir,Carlos').split(',').map(s=>s.trim()).filter(Boolean));
  if(lv===1){for(let i=0;i<12;i++){const n=2+Math.floor(Math.random()*8);const f=friends[i%friends.length]||'Amigo';items.push({ty:'distribute',mode:'put',count:n,friend:f,id:'dist_put_'+i})}}
  else if(lv===2){for(let i=0;i<12;i++){const bags=2+Math.floor(Math.random()*3);const each=2+Math.floor(Math.random()*4);const total=bags*each;const names=friends.slice(0,bags);items.push({ty:'distribute',mode:'equal',total,bags,each,names,id:'dist_eq_'+i})}}
  else{for(let i=0;i<10;i++){const a=2+Math.floor(Math.random()*6);const b=2+Math.floor(Math.random()*6);const na=friends[0]||'Ana',nb=friends[1]||'Carlos';items.push({ty:'distribute',mode:'compare',a,b,nameA:na,nameB:nb,id:'dist_cmp_'+i})}}
  return items}

export function BagSVG({name:bagName,size=80}){return <svg width={size} height={size*1.3} viewBox="0 0 80 104">
  {/* Shadow */}
  <ellipse cx={40} cy={98} rx={28} ry={5} fill="rgba(0,0,0,0.1)"/>
  {/* Bag body - rounded sack shape */}
  <path d="M14,42 C10,52 8,68 10,78 C12,88 20,94 40,96 C60,94 68,88 70,78 C72,68 70,52 66,42 Z" fill="#C49A6C" stroke="#8B5E3C" strokeWidth={2}/>
  {/* Bag body shading - left highlight */}
  <path d="M18,48 C16,58 15,70 16,78 C17,84 22,88 30,90" fill="none" stroke="#D4B896" strokeWidth={3} strokeLinecap="round" opacity={0.5}/>
  {/* Bag body shading - right shadow */}
  <path d="M62,48 C64,58 65,70 64,78 C63,84 58,88 50,90" fill="none" stroke="#8B5E3C" strokeWidth={2} strokeLinecap="round" opacity={0.3}/>
  {/* Bag texture lines */}
  <path d="M25,55 Q40,52 55,55" fill="none" stroke="#B8906E" strokeWidth={0.8} opacity={0.4}/>
  <path d="M22,65 Q40,62 58,65" fill="none" stroke="#B8906E" strokeWidth={0.8} opacity={0.4}/>
  <path d="M20,75 Q40,72 60,75" fill="none" stroke="#B8906E" strokeWidth={0.8} opacity={0.4}/>
  {/* Gathered top of bag */}
  <path d="M14,42 C20,38 28,36 40,36 C52,36 60,38 66,42" fill="#C49A6C" stroke="#8B5E3C" strokeWidth={1.5}/>
  <path d="M22,40 Q26,34 32,33" fill="none" stroke="#8B5E3C" strokeWidth={1} opacity={0.5}/>
  <path d="M58,40 Q54,34 48,33" fill="none" stroke="#8B5E3C" strokeWidth={1} opacity={0.5}/>
  {/* Neck of bag (gathered/cinched area) */}
  <path d="M26,36 C30,30 34,28 40,28 C46,28 50,30 54,36" fill="#C49A6C" stroke="#8B5E3C" strokeWidth={1.5}/>
  {/* Ribbon/tie wrapped around neck */}
  <path d="M24,34 C28,31 34,29 40,29 C46,29 52,31 56,34" fill="none" stroke="#E74C3C" strokeWidth={3} strokeLinecap="round"/>
  <path d="M24,36 C28,33 34,31 40,31 C46,31 52,33 56,36" fill="none" stroke="#C0392B" strokeWidth={2.5} strokeLinecap="round"/>
  {/* Bow - left loop */}
  <path d="M34,28 C28,20 22,18 20,22 C18,26 24,30 32,30" fill="#E74C3C" stroke="#C0392B" strokeWidth={1}/>
  {/* Bow - right loop */}
  <path d="M46,28 C52,20 58,18 60,22 C62,26 56,30 48,30" fill="#E74C3C" stroke="#C0392B" strokeWidth={1}/>
  {/* Bow - center knot */}
  <ellipse cx={40} cy={28} rx={4} ry={3} fill="#C0392B"/>
  {/* Bow - ribbon tails */}
  <path d="M36,30 C34,36 30,40 28,38" fill="none" stroke="#E74C3C" strokeWidth={2} strokeLinecap="round"/>
  <path d="M44,30 C46,36 50,40 52,38" fill="none" stroke="#E74C3C" strokeWidth={2} strokeLinecap="round"/>
  {/* Name label on bag */}
  <text x={40} y={72} textAnchor="middle" fill="#FFF" fontSize={12} fontWeight={700} fontFamily="Fredoka" stroke="#8B5E3C" strokeWidth={0.5}>{bagName}</text>
</svg>}

export function ExDistribute({ex,onOk,onSkip,name,uid,vids}){
  const[count,setCount]=useState(0);const[fb,setFb]=useState(null);const[ans,setAns]=useState('');const[att,setAtt]=useState(0);const[showCount,setShowCount]=useState(false);const{idleMsg,poke}=useIdle(name,!fb);
  const timers=useRef([]);const setT=(fn,ms)=>{const id=setTimeout(fn,ms);timers.current.push(id);return id};const clearTimers=()=>{timers.current.forEach(clearTimeout);timers.current=[]};
  const objType=useMemo(()=>['candy','card','domino'][Math.floor(Math.random()*3)],[ex]);
  const objEmoji=objType==='candy'?'🍬':objType==='card'?'🃏':'🁣';
  const objName=objType==='candy'?'caramelos':objType==='card'?'cartas':'fichas';
  const ObjSVG=objType==='card'?CardSVG:objType==='domino'?DominoSVG:null;
  const uniqueCards=useMemo(()=>{const ranks=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];const suits=['♥','♦','♠','♣'];const all=[];for(const s of suits)for(const r of ranks)all.push({rank:r,suit:s});const sh=[...all].sort(()=>Math.random()-.5);return sh.slice(0,20)},[ex]);
  const uniqueDominos=useMemo(()=>{const all=[];for(let a=0;a<=6;a++)for(let b=a;b<=6;b++)all.push([a,b]);const sh=[...all].sort(()=>Math.random()-.5);return sh.slice(0,20)},[ex]);
  useEffect(()=>{setCount(0);setFb(null);setAns('');setAtt(0);setShowCount(false);clearTimers();stopVoice();
    if(ex.mode==='put')setT(()=>say('Pon '+ex.count+' '+objName),400);
    else if(ex.mode==='equal')setT(()=>say('Reparte '+ex.total+' '+objName+' en '+ex.bags+' bolsas iguales'),400);
    else setT(()=>say('¿Quién tiene más?'),400);
    return()=>{clearTimers();stopVoice()}},[ex]);
  function addCandy(){poke();if(count>=20)return;const nc=count+1;setCount(nc);beep(300+nc*40,60)}
  function removeCandy(){poke();if(count>0)setCount(count-1)}
  function validatePut(){poke();if(count===ex.count){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setT(onOk,300))}
    else{const na=att+1;setAtt(na);
      if(na>=2){/* 2nd fail: Toki counts WITH the child */
        setFb('counting');setShowCount(true);beep(200,200);
        let i=0;const target=ex.count;
        function countNext(){if(i>=target){
          setT(()=>{if(count>target){sayFB('¡Sobran '+(count-target)+'!')}else if(count<target){sayFB('¡Faltan '+(target-count)+'!')}
            setT(()=>{setFb(null);setCount(0);setShowCount(false)},2000)},600);return}
          i++;say(''+i,0.9);setT(countNext,900)}
        setT(countNext,500)}
      else{setFb('wrong');beep(200,200);sayFB(rnd(['¡Casi!','¡Inténtalo otra vez!','¡Cuenta bien!']));
        setT(()=>{setFb(null);setCount(0)},2000)}}}
  function checkEqual(){poke();const n=parseInt(ans);if(n===ex.each){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setT(onOk,300))}
    else{setFb('no');stopVoice();sayFB(ex.total+' entre '+ex.bags+' son '+ex.each+' cada uno');setT(()=>{setFb(null);setAns('')},2500)}}
  function checkCompare(who){poke();const correct=ex.a>ex.b?'a':ex.a<ex.b?'b':'equal';
    if(who===correct){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setT(onOk,300))}
    else{setFb('no');beep(200,200);setT(()=>setFb(null),1200)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {ex.mode==='put'&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:8}}><BagSVG name={ex.friend} size={100}/></div>
        <p style={{fontSize:22,fontWeight:700,color:GOLD,margin:0}}>Pon {ex.count} {objName}</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:12,minHeight:64,background:CARD,border:'2px solid '+BORDER,borderRadius:12,padding:14}}>
        {Array.from({length:count},(_,i)=>{const excess=fb==='counting'&&i>=ex.count;return <span key={i} style={{fontSize:44,animation:'bounceIn .3s '+(i*0.05)+'s both',display:'inline-flex',alignItems:'center',opacity:excess?0.3:1,filter:excess?'grayscale(1)':'none',transition:'all .4s'}}>
          {objType==='card'?<CardSVG size={50} rank={uniqueCards[i%uniqueCards.length].rank} suit={uniqueCards[i%uniqueCards.length].suit}/>:objType==='domino'?<DominoSVG size={50} dots={uniqueDominos[i%uniqueDominos.length]}/>:objEmoji}
        </span>})}{fb==='counting'&&count<ex.count&&Array.from({length:ex.count-count},(_,i)=><span key={'m'+i} style={{fontSize:44,display:'inline-flex',alignItems:'center',opacity:0.3,animation:'pulse 1.4s infinite',border:'2px dashed '+GOLD,borderRadius:8,padding:2}}>{'?'}</span>)}</div>
      {fb==='wrong'&&<div className="as" style={{background:RED+'18',borderRadius:14,padding:14,marginBottom:12}}>
        <p style={{fontSize:20,color:GOLD,fontWeight:700,margin:0}}>¡Casi! Cuenta bien 💪</p>
      </div>}
      {fb==='counting'&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:12}}>
        <p style={{fontSize:20,color:GOLD,fontWeight:700,margin:0}}>¡Vamos a contar juntos!</p>
        {count>ex.count&&<p style={{fontSize:16,color:RED,fontWeight:600,margin:'6px 0 0'}}>Sobran {count-ex.count} - los grises sobran</p>}
        {count<ex.count&&<p style={{fontSize:16,color:BLUE,fontWeight:600,margin:'6px 0 0'}}>Faltan {ex.count-count}</p>}
      </div>}
      {!fb&&<div>
        <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:14}}>
          <button className="btn btn-g" onClick={addCandy} style={{fontSize:24,maxWidth:170,padding:'16px 22px'}}>{ObjSVG?'➕':'🍬'} Añadir</button>
          <button className="btn btn-o" onClick={removeCandy} disabled={count===0} style={{fontSize:24,maxWidth:170,padding:'16px 22px'}}>➖ Quitar</button>
        </div>
        <button onClick={validatePut} disabled={count===0}
          style={{width:80,height:80,borderRadius:'50%',border:'none',background:count===0?'#ccc':GREEN,color:'#FFF',fontSize:28,fontWeight:800,cursor:count===0?'default':'pointer',
            boxShadow:count===0?'none':'0 4px 16px rgba(46,204,113,0.45)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 6px',
            transition:'transform .15s,box-shadow .15s'}}
          onPointerDown={e=>{if(count>0)e.currentTarget.style.transform='scale(0.92)'}}
          onPointerUp={e=>{e.currentTarget.style.transform='scale(1)'}}>✅</button>
        <p style={{fontSize:14,fontWeight:600,color:DIM,margin:'0 0 4px',textAlign:'center'}}>¡Listo!</p>
      </div>}
    </div>}
    {ex.mode==='equal'&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 8px',color:GOLD}}>Reparte {ex.total} 🍬 en {ex.bags} bolsas</p>
        <div style={{display:'flex',gap:8,justifyContent:'center'}}>{(ex.names||[]).map((n,i)=><div key={i} style={{display:'inline-block'}}><BagSVG name={n} size={60}/></div>)}</div>
        <p style={{fontSize:16,color:DIM,margin:'8px 0 0'}}>¿Cuántos le tocan a cada uno?</p></div>
      <NumPad value={ans} onChange={setAns} onSubmit={checkEqual} maxLen={3}/>
    </div>}
    {ex.mode==='compare'&&<div>
      <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD,textAlign:'center'}}>¿Quién tiene más?</p>
      <div style={{display:'flex',gap:10,justifyContent:'center',alignItems:'stretch',marginBottom:14}}>
        <div style={{flex:1,background:'linear-gradient(135deg,'+BLUE+'22,'+BLUE+'08)',border:'3px solid '+BLUE+'55',borderRadius:16,padding:14,textAlign:'center',boxShadow:'0 2px 12px '+BLUE+'22'}}>
          <p style={{fontWeight:800,fontSize:20,margin:'0 0 10px',color:BLUE,textShadow:'0 1px 4px rgba(0,0,0,.15)'}}>{ex.nameA}</p>
          <div style={{display:'flex',gap:4,justifyContent:'center',flexWrap:'wrap',minHeight:40}}>{Array.from({length:ex.a},(_,i)=><span key={i} style={{fontSize:28}}>🍬</span>)}</div>
          <p style={{fontSize:28,color:BLUE,margin:'8px 0 0',fontWeight:800}}>{ex.a}</p>
        </div>
        <div style={{display:'flex',alignItems:'center',flexDirection:'column',justifyContent:'center',gap:4}}>
          <div style={{width:36,height:36,borderRadius:'50%',background:GOLD+'22',border:'2px solid '+GOLD+'44',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:GOLD,fontWeight:800}}>VS</div>
        </div>
        <div style={{flex:1,background:'linear-gradient(135deg,#E67E2222,#E67E2208)',border:'3px solid #E67E2255',borderRadius:16,padding:14,textAlign:'center',boxShadow:'0 2px 12px #E67E2222'}}>
          <p style={{fontWeight:800,fontSize:20,margin:'0 0 10px',color:'#E67E22',textShadow:'0 1px 4px rgba(0,0,0,.15)'}}>{ex.nameB}</p>
          <div style={{display:'flex',gap:4,justifyContent:'center',flexWrap:'wrap',minHeight:40}}>{Array.from({length:ex.b},(_,i)=><span key={i} style={{fontSize:28}}>🍬</span>)}</div>
          <p style={{fontSize:28,color:'#E67E22',margin:'8px 0 0',fontWeight:800}}>{ex.b}</p>
        </div>
      </div>
      <div style={{display:'flex',gap:10,justifyContent:'center'}}><button className="btn btn-b" onClick={()=>checkCompare('a')} style={{flex:1,maxWidth:140}}>{ex.nameA}</button>
        {ex.a===ex.b&&<button className="btn btn-p" onClick={()=>checkCompare('equal')} style={{flex:1,maxWidth:140}}>Igual</button>}
        <button className="btn btn-b" onClick={()=>checkCompare('b')} style={{flex:1,maxWidth:140}}>{ex.nameB}</button></div>
    </div>}
    {fb==='ok'&&<><CelebrationOverlay show={true} duration={1500}/><div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div></>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}
