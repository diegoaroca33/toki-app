import { useState, useEffect, useRef, useMemo } from 'react'
import { GOLD, GREEN, RED, DIM, GOOD_MSG, QUIEN_SOY } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay, playRec, useSR } from '../voice.js'
import { score, adjScore, rnd, beep, mkPerfect, textKey, getExigencia, updateRepCount, getPhraseSpeed, updatePhraseSpeed } from '../utils.js'
import { victoryBeeps } from '../components/DoneScreen.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

// ===== QUIÉN SOY — Barra lateral de tiempo =====
export function QSTimeBar({dur,on,onEnd}){
  const[pct,sP]=useState(100);const t=useRef(null);const s=useRef(0);
  useEffect(()=>{if(!on){sP(100);return}s.current=Date.now();const ms=dur*1000;
    t.current=setInterval(()=>{const e=Date.now()-s.current;const r=Math.max(0,100-e/ms*100);sP(r);
      if(r<=25&&r>20)beep(800,80);if(r<=15&&r>10)beep(800,80);
      if(r<=0){clearInterval(t.current);beep(1200,300);setTimeout(onEnd,1200)}},50);
    return()=>clearInterval(t.current)},[on,dur]);
  if(!on)return null;
  return <div style={{position:'absolute',top:0,right:0,width:12,height:'100%',background:'rgba(0,0,0,.3)',borderRadius:'0 18px 18px 0',overflow:'hidden',zIndex:5}}>
    <div style={{position:'absolute',top:0,left:0,width:'100%',background:pct>25?RED:'#FF1744',transition:'height .05s linear',height:pct+'%',borderRadius:'0 18px 0 0'}}/>
    <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%) rotate(-90deg)',fontSize:10,color:'#fff',fontWeight:700,whiteSpace:'nowrap'}}>🎤</div>
  </div>}

// ===== MODE SWITCH: Estudio ↔ Presentación =====
function ModeSwitch({mode,onToggle,canToggle}){
  if(!canToggle)return null;
  return <div style={{display:'flex',justifyContent:'center',marginBottom:10}}>
    <div style={{display:'inline-flex',background:'rgba(255,255,255,.08)',borderRadius:24,padding:3,gap:2}}>
      <button onClick={()=>onToggle('estudio')} style={{
        padding:'8px 18px',borderRadius:20,border:'none',fontSize:15,fontWeight:700,cursor:'pointer',
        fontFamily:"'Fredoka'",transition:'all .2s',minHeight:40,
        background:mode==='estudio'?'#2196F3':'transparent',
        color:mode==='estudio'?'#fff':DIM,
        boxShadow:mode==='estudio'?'0 2px 8px rgba(33,150,243,.4)':'none'
      }}>📖 Estudio</button>
      <button onClick={()=>onToggle('presentacion')} style={{
        padding:'8px 18px',borderRadius:20,border:'none',fontSize:15,fontWeight:700,cursor:'pointer',
        fontFamily:"'Fredoka'",transition:'all .2s',minHeight:40,
        background:mode==='presentacion'?'#E91E63':'transparent',
        color:mode==='presentacion'?'#fff':DIM,
        boxShadow:mode==='presentacion'?'0 2px 8px rgba(233,30,99,.4)':'none'
      }}>🎤 Presentación</button>
    </div>
  </div>}

// ===== QUIÉN SOY UNIFICADO — con switch Estudio/Presentación =====
export function ExQuienSoyUnified({ex,onOk,onSkip,sex,name,uid,vids,presentation,canToggle,burstMode,burstSpeed,burstReps}){
  const[mode,setMode]=useState('estudio');
  // When mode changes mid-exercise, reset
  const modeRef=useRef(mode);
  useEffect(()=>{modeRef.current=mode},[mode]);

  return <div>
    <ModeSwitch mode={mode} onToggle={setMode} canToggle={canToggle}/>
    {mode==='estudio'
      ?<ExQuienSoyEstudio key={'est_'+ex.id+'_'+mode} ex={ex} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids} burstMode={burstMode} burstSpeed={burstSpeed} burstReps={burstReps}/>
      :<ExQuienSoyPres key={'pres_'+mode} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids} presentation={presentation} burstMode={burstMode} burstSpeed={burstSpeed} burstReps={burstReps}/>
    }
  </div>}

// ===== QUIÉN SOY — Estudio (repetición + ánimos) =====
export function ExQuienSoyEstudio({ex,onOk,onSkip,sex,name,uid,vids,burstMode,burstSpeed,burstReps}){
  const[sf,sSf]=useState(null);const[att,sAtt]=useState(0);const[mic,setMic]=useState(false);
  const[burstStars,setBurstStars]=useState(0);const[burstFade,setBurstFade]=useState(false);
  const[burstRepsDone,setBurstRepsDone]=useState(0);
  const alive=useRef(true);const ttsPlaying=useRef(false);
  const dur=useMemo(()=>Math.max(6,Math.ceil(ex.text.split(/\s+/).length*0.9)+4),[ex.text]);
  const key=ex.text+'|'+ex.id;
  const phraseKey=useMemo(()=>textKey(ex.text),[ex.text]);
  const repsTarget=burstReps||1;
  function getAdaptiveRate(repIdx){
    if(burstMode&&typeof burstSpeed==='number'){
      // Each rep slightly faster when repsTarget>1
      return repsTarget>1?burstSpeed+repIdx*0.05:burstSpeed;
    }
    if(uid)return getPhraseSpeed(uid,phraseKey);
    return undefined;
  }
  function handleSR(said){if(!alive.current)return;if(ttsPlaying.current){sr.go();return}setMic(false);sr.stop();stopVoice();
    const rawB=Math.max(...said.split('|').map(a=>score(a,ex.text)));const b=adjScore(rawB);
    starBeep(b);
    // M1: Update repetition counter
    if(uid&&ex.id)updateRepCount(uid,ex.id,b);
    // M5: Update adaptive speed
    if(uid)updatePhraseSpeed(uid,phraseKey,b>=3);

    // === BURST MODE ===
    if(burstMode){
      setBurstStars(b);setBurstFade(true);
      const nextRep=burstRepsDone+1;
      setBurstRepsDone(nextRep);
      setTimeout(()=>{if(!alive.current)return;setBurstFade(false);
        if(nextRep<repsTarget){sSf(null);doPlay(nextRep)}
        else{onOk(b,1)}
      },300);
      return;
    }

    // M3: Smart repetition — 60% of exigencia threshold, max 3 attempts
    const exPct=getExigencia()/100;
    const passThreshold=exPct*0.6*4;
    const na=att+1;sAtt(na);
    if(b>=passThreshold){sSf('ok');cheerOrSay(b>=4?mkPerfect(name):rnd(GOOD_MSG),uid,vids,b>=4?'perfect':'good').then(()=>{if(alive.current)onOk(b,na)})}
    else if(na>=3){
      // M3: Auto-pass after 3 attempts
      sSf('pass');sayFB(rnd(['¡Buen esfuerzo!','¡Seguimos!']));setTimeout(()=>{if(alive.current)onOk(1,na)},800)
    }
    else{sSf('try');sayFB(rnd(['¡Otra vez!','¡Tú puedes!','¡Inténtalo!']));
      setTimeout(()=>{if(alive.current){sSf(null);doPlay()}},2000)}}
  const sr=useSR(handleSR);
  async function doPlay(repIdx){if(!alive.current)return;stopVoice();sr.stop();setMic(false);
    try{const ms=await navigator.mediaDevices.getUserMedia({audio:true});ms.getTracks().forEach(t=>t.stop())}catch(e){}
    ttsPlaying.current=true;
    const rate=getAdaptiveRate(repIdx||0);
    const played=await playRec(uid,vids,textKey(ex.text));if(!played)await say(ex.text,rate);
    ttsPlaying.current=false;
    if(!alive.current)return;
    sr.go();setMic(true);
  }
  const imgLoaded=useRef(false);
  useEffect(()=>{alive.current=true;imgLoaded.current=false;sSf(null);sAtt(0);setMic(false);setBurstStars(0);setBurstFade(false);setBurstRepsDone(0);stopVoice();sr.stop();
    if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop())}).catch(()=>{});
    const imgStart=Date.now();
    function tryPlay(){if(!alive.current)return;if(imgLoaded.current||!ex.img||Date.now()-imgStart>5000){stopVoice();doPlay(0)}else{setTimeout(tryPlay,200)}}
    const t=setTimeout(tryPlay,burstMode?300:600);
    const sosKill=()=>{alive.current=false;clearTimeout(t);stopVoice();sr.stop()};
    window.addEventListener('toki-sos',sosKill);
    return()=>{alive.current=false;clearTimeout(t);stopVoice();sr.stop();window.removeEventListener('toki-sos',sosKill)}},[key]);
  function onTimeUp(){if(!alive.current)return;setMic(false);sr.stop();stopVoice();
    const na=att+1;sAtt(na);
    // M1: Count timeout as 0-star attempt
    if(uid&&ex.id)updateRepCount(uid,ex.id,0);
    // M5: Update adaptive speed on timeout
    if(uid)updatePhraseSpeed(uid,phraseKey,false);
    if(burstMode){onOk(0,1);return}
    if(na>=3){sSf('pass');setTimeout(()=>sayFB('¡Buen esfuerzo! Seguimos'),300);setTimeout(()=>{if(alive.current)onOk(1,na)},1800)}
    else{sSf('wait');setTimeout(()=>sayFB('¿Lo intentamos?'),300);setTimeout(()=>{if(alive.current){sSf(null);doPlay(0)}},2500)}}
  return <div style={{textAlign:'center'}}>
    <div style={{position:'relative',width:'100%',borderRadius:18,overflow:'hidden',marginBottom:6,boxShadow:'0 4px 24px rgba(0,0,0,.5)'}}>
      {ex.img?<img src={ex.img} alt={ex.text} onLoad={()=>{imgLoaded.current=true}} onError={()=>{imgLoaded.current=true}} style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',display:'block',maxHeight:'50dvh'}}/>
      :<div style={{width:'100%',aspectRatio:'16/9',background:'linear-gradient(135deg,#1a237e,#4a148c)',display:'flex',alignItems:'center',justifyContent:'center',maxHeight:'50dvh'}}><span style={{fontSize:80}}>📚</span></div>}
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,.85))',padding:'36px 16px 14px'}}>
        <p style={{fontSize:24,fontWeight:700,margin:0,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,.8)',lineHeight:1.3}}>{ex.text}</p>
      </div>
      <QSTimeBar dur={dur} on={mic} onEnd={onTimeUp}/>
    </div>
    {ex.picto&&<div style={{margin:'4px auto 8px',maxWidth:'95%'}}><div style={{display:'inline-block',background:'#fff',border:'2px solid #333',borderRadius:8,padding:4,margin:'0 auto'}}><img src={ex.picto} alt={'Pictograma: '+ex.text} style={{height:70,objectFit:'contain',display:'block',maxWidth:'100%'}}/></div></div>}
    {burstMode&&burstStars>0&&<div style={{transition:'opacity .3s',opacity:burstFade?0:1,textAlign:'center',margin:'4px 0'}}><Stars n={burstStars} sz={28}/>{repsTarget>1&&<p style={{fontSize:12,color:DIM,margin:'2px 0 0'}}>{burstRepsDone}/{repsTarget}</p>}</div>}
    <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:6}}>
      <button className="btn btn-b btn-half" onClick={()=>{stopVoice();sr.stop();sSf(null);setMic(false);setBurstRepsDone(0);doPlay(0)}}>🔊 Otra vez</button>
      <button className="btn btn-ghost btn-half skip-btn" onClick={()=>{stopVoice();sr.stop();alive.current=false;onSkip()}}>⏭️ Saltar</button>
    </div>
  </div>}

// ===== QUIÉN SOY — Presentación (Toki lee modelo, niño repite al público, sin feedback entre slides) =====
export function ExQuienSoyPres({onOk,onSkip,sex,name,uid,vids,presentation,burstMode,burstSpeed,burstReps}){
  const slides=useMemo(()=>{
    if(!presentation)return QUIEN_SOY.map(q=>({text:q.text,id:q.id,img:q.img,picto:q.picto}));
    if(presentation.slides&&presentation.slides.length>0)
      return presentation.slides.map((s,i)=>({text:s.text,id:'pres_'+i,img:s.img||null,picto:s.picto||null}));
    if(presentation.lines&&presentation.lines.length>0)
      return presentation.lines.map((text,i)=>({text,id:'pres_'+i,img:null,picto:null}));
    return QUIEN_SOY.map(q=>({text:q.text,id:q.id,img:q.img,picto:q.picto}));
  },[presentation]);
  const[qi,setQi]=useState(0);const[finished,setFinished]=useState(false);const[barOn,setBarOn]=useState(false);
  const alive=useRef(true);const timers=useRef([]);
  // Track if child spoke on ANY slide (mic detection, no feedback)
  const spokeAny=useRef(false);const spokeSlide=useRef(false);
  const cur=slides[qi];
  const waitSec=useMemo(()=>Math.max(Math.ceil(cur.text.split(/\s+/).length*0.9),2)+3,[cur]);

  // Silent mic listener — only marks that speech was detected, NO feedback/evaluation
  function handleSR(said){if(!alive.current)return;spokeSlide.current=true;spokeAny.current=true;}
  const sr=useSR(handleSR);

  useEffect(()=>{alive.current=true;
    const sosKill=()=>{alive.current=false;stopVoice();sr.stop();timers.current.forEach(clearTimeout)};
    window.addEventListener('toki-sos',sosKill);
    return()=>{alive.current=false;stopVoice();sr.stop();timers.current.forEach(clearTimeout);window.removeEventListener('toki-sos',sosKill)}},[]);
  const presImgLoaded=useRef(false);

  function advanceOrFinish(){
    if(!alive.current)return;setBarOn(false);sr.stop();
    if(qi+1>=slides.length){setFinished(true);victoryBeeps()}
    else setQi(qi+1);
  }

  useEffect(()=>{if(finished)return;stopVoice();sr.stop();setBarOn(false);spokeSlide.current=false;presImgLoaded.current=false;timers.current.forEach(clearTimeout);timers.current=[];
    const imgStart=Date.now();
    function trySpeak(){if(!alive.current)return;if(!cur.img||presImgLoaded.current||Date.now()-imgStart>5000){doSpeak()}else{const t=setTimeout(trySpeak,200);timers.current.push(t)}}
    function doSpeak(){
      // Toki reads phrase aloud as model — this is the ONLY TTS call per slide
      const rate=burstMode&&typeof burstSpeed==='number'?burstSpeed:(uid?getPhraseSpeed(uid,textKey(cur.text)):undefined);
      say(cur.text,rate).then(()=>{if(!alive.current)return;
        // Start silent mic listening + countdown bar
        setBarOn(true);sr.go();
        const t2=setTimeout(()=>{if(!alive.current)return;sr.stop();advanceOrFinish()},waitSec*1000);
        timers.current.push(t2)})}
    const t1=setTimeout(trySpeak,400);timers.current.push(t1);
    return()=>{timers.current.forEach(clearTimeout);timers.current=[];stopVoice();sr.stop()}
  },[qi,finished]);

  // === Completion screen (visual only, Toki does NOT speak) ===
  if(finished){
    const spoke=spokeAny.current;
    return <div className="ab" style={{textAlign:'center',padding:'40px 18px'}}>
      <div style={{fontSize:100,marginBottom:16}}>{spoke?'🏆':'📚'}</div>
      <h2 style={{fontSize:28,color:spoke?GOLD:'#90CAF9',margin:'0 0 12px'}}>{spoke?'¡Presentación completada!':'¡Presentación lista!'}</h2>
      {spoke&&<p style={{fontSize:16,color:DIM,margin:'0 0 24px'}}>{slides.length} frases presentadas</p>}
      {!spoke&&<p style={{fontSize:16,color:DIM,margin:'0 0 24px'}}>{slides.length} frases revisadas</p>}
      <button className="btn btn-gold" onClick={onOk} style={{fontSize:22,maxWidth:300,margin:'0 auto'}}>Terminado</button>
    </div>}

  return <div style={{textAlign:'center',position:'relative',overflow:'hidden'}}>
    <div style={{position:'relative',width:'100%',borderRadius:18,overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,.5)'}}>
      {cur.img?<img src={cur.img} alt={cur.text} onLoad={()=>{presImgLoaded.current=true}} onError={()=>{presImgLoaded.current=true}} style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',display:'block',maxHeight:'50dvh'}}/>
        :<div style={{width:'100%',aspectRatio:'16/9',background:'linear-gradient(135deg,#1A237E 0%,#283593 50%,#3949AB 100%)',display:'flex',alignItems:'center',justifyContent:'center',maxHeight:'50dvh'}}><span style={{fontSize:80}}>🎤</span></div>}
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,.85))',padding:'48px 16px 18px'}}>
        <p style={{fontSize:28,fontWeight:700,margin:0,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,.8)',lineHeight:1.3}}>{cur.text}</p>
        <p style={{fontSize:13,color:'rgba(255,255,255,.4)',margin:'4px 0 0',fontWeight:600}}>{qi+1}/{slides.length}</p>
      </div>
      {cur.picto&&<div style={{position:'absolute',bottom:80,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,.9)',border:'2px solid #333',borderRadius:8,padding:4}}><img src={cur.picto} alt={'Pictograma: '+cur.text} style={{height:60,objectFit:'contain',display:'block'}}/></div>}
      {barOn&&<div style={{position:'absolute',top:0,right:0,width:10,height:'100%',background:'rgba(0,0,0,.3)',borderRadius:0,overflow:'hidden',zIndex:5}}>
        <div style={{position:'absolute',top:0,left:0,width:'100%',background:RED,animation:`qsbar ${waitSec}s linear forwards`}}/>
      </div>}
    </div>
    <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:8}}>
      <button className="btn btn-b btn-half" onClick={()=>{stopVoice();sr.stop();timers.current.forEach(clearTimeout);timers.current=[];advanceOrFinish()}}>⏭️ Siguiente</button>
      <button className="btn btn-ghost btn-half skip-btn" onClick={()=>{stopVoice();sr.stop();alive.current=false;onSkip()}}>⏭️ Saltar</button>
    </div>
  </div>}
