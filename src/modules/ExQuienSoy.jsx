import { useState, useEffect, useRef, useMemo } from 'react'
import { GOLD, GREEN, RED, DIM, GOOD_MSG, QUIEN_SOY } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay, playRec, useSR } from '../voice.js'
import { score, adjScore, rnd, beep, mkPerfect, textKey } from '../utils.js'
import { victoryBeeps } from '../components/DoneScreen.jsx'

// ===== QUIÉN SOY — Barra lateral de tiempo (reemplaza el círculo del micrófono) =====
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

// ===== QUIÉN SOY — Estudio (mode 1, foto grande + barra lateral roja + solo ánimo hablado) =====
export function ExQuienSoyEstudio({ex,onOk,onSkip,sex,name,uid,vids}){
  const[sf,sSf]=useState(null);const[att,sAtt]=useState(0);const[mic,setMic]=useState(false);
  const alive=useRef(true);const ttsPlaying=useRef(false);
  const dur=useMemo(()=>Math.max(6,Math.ceil(ex.text.split(/\s+/).length*0.9)+4),[ex.text]);
  const key=ex.text+'|'+ex.id;
  function handleSR(said){if(!alive.current)return;if(ttsPlaying.current){sr.go();return}setMic(false);sr.stop();stopVoice();
    const rawB=Math.max(...said.split('|').map(a=>score(a,ex.text)));const b=adjScore(rawB);
    starBeep(b);
    if(b>=3){sSf('ok');cheerOrSay(b>=4?mkPerfect(name):rnd(GOOD_MSG),uid,vids,b>=4?'perfect':'good').then(()=>{if(alive.current)onOk()})}
    else{const na=att+1;sAtt(na);sSf('try');sayFB(rnd(['¡Vas bien!','¡Casi!','¡Sigue así!']));
      if(na>=2){setTimeout(()=>{if(alive.current){sSf('pass');sayFB('¡Seguimos!');setTimeout(onOk,300)}},600)}
      else{setTimeout(()=>{if(alive.current){sSf(null);doPlay()}},2000)}}}
  const sr=useSR(handleSR);
  async function doPlay(){if(!alive.current)return;stopVoice();sr.stop();setMic(false);
    // Reactivate mic permissions proactively
    try{const ms=await navigator.mediaDevices.getUserMedia({audio:true});ms.getTracks().forEach(t=>t.stop())}catch(e){}
    // Play TTS first, mark as playing so SR ignores Toki's voice
    ttsPlaying.current=true;
    const played=await playRec(uid,vids,textKey(ex.text));if(!played)await say(ex.text);
    ttsPlaying.current=false;
    if(!alive.current)return;
    sr.go();setMic(true);
  }
  const imgLoaded=useRef(false);
  useEffect(()=>{alive.current=true;imgLoaded.current=false;sSf(null);sAtt(0);setMic(false);stopVoice();sr.stop();
    // Proactively reactivate mic permission on exercise entry
    if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop())}).catch(()=>{});
    // Wait for image to load before playing voice
    const imgStart=Date.now();
    function tryPlay(){if(!alive.current)return;if(imgLoaded.current||!ex.img||Date.now()-imgStart>5000){stopVoice();doPlay()}else{setTimeout(tryPlay,200)}}
    const t=setTimeout(tryPlay,600);
    return()=>{alive.current=false;clearTimeout(t);stopVoice();sr.stop()}},[key]);
  function onTimeUp(){if(!alive.current)return;setMic(false);sr.stop();stopVoice();
    const na=att+1;sAtt(na);if(na>=2){sSf('pass');setTimeout(()=>sayFB('¡Ánimo! Seguimos'),300);setTimeout(()=>{if(alive.current)onOk()},1800)}
    else{sSf('wait');setTimeout(()=>sayFB('¿Lo intentamos?'),300);setTimeout(()=>{if(alive.current){sSf(null);doPlay()}},2500)}}
  return <div style={{textAlign:'center'}}>
    <div style={{position:'relative',width:'100%',borderRadius:18,overflow:'hidden',marginBottom:6,boxShadow:'0 4px 24px rgba(0,0,0,.5)'}}>
      {ex.img?<img src={ex.img} alt={ex.text} onLoad={()=>{imgLoaded.current=true}} onError={()=>{imgLoaded.current=true}} style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',display:'block'}}/>
      :<div style={{width:'100%',aspectRatio:'16/9',background:'linear-gradient(135deg,#1a237e,#4a148c)',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:80}}>📚</span></div>}
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,.85))',padding:'36px 16px 14px'}}>
        <p style={{fontSize:24,fontWeight:700,margin:0,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,.8)',lineHeight:1.3}}>{ex.text}</p>
      </div>
      <QSTimeBar dur={dur} on={mic} onEnd={onTimeUp}/>
    </div>
    {ex.picto&&<div style={{margin:'4px auto 8px',maxWidth:'95%'}}><div style={{display:'inline-block',background:'#fff',border:'2px solid #333',borderRadius:8,padding:4,margin:'0 auto'}}><img src={ex.picto} alt={'Pictograma: '+ex.text} style={{height:70,objectFit:'contain',display:'block',maxWidth:'100%'}}/></div></div>}
    <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:6}}>
      <button className="btn btn-b btn-half" onClick={()=>{stopVoice();sr.stop();sSf(null);setMic(false);doPlay()}}>🔊 Otra vez</button>
      <button className="btn btn-ghost btn-half skip-btn" onClick={()=>{stopVoice();sr.stop();alive.current=false;onSkip()}}>⏭️ Saltar</button>
    </div>
  </div>}

// ===== QUIÉN SOY — Presentación (mode 2, teleprompter limpio con barra lateral) =====
export function ExQuienSoyPres({onOk,onSkip,sex,name,uid,vids,presentation}){
  const slides=useMemo(()=>{
    if(!presentation)return QUIEN_SOY.map(q=>({text:q.text,id:q.id,img:q.img,picto:q.picto}));
    // Use slides with photos if available, otherwise lines as text-only
    if(presentation.slides&&presentation.slides.length>0)
      return presentation.slides.map((s,i)=>({text:s.text,id:'pres_'+i,img:s.img||null,picto:s.picto||null}));
    if(presentation.lines&&presentation.lines.length>0)
      return presentation.lines.map((text,i)=>({text,id:'pres_'+i,img:null,picto:null}));
    return QUIEN_SOY.map(q=>({text:q.text,id:q.id,img:q.img,picto:q.picto}));
  },[presentation]);
  const[qi,setQi]=useState(0);const[finished,setFinished]=useState(false);const[barOn,setBarOn]=useState(false);
  const alive=useRef(true);const timers=useRef([]);
  const cur=slides[qi];
  const waitSec=useMemo(()=>Math.max(Math.ceil(cur.text.length*0.12),2)+3,[cur]);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;stopVoice();timers.current.forEach(clearTimeout)}},[]);
  const presImgLoaded=useRef(false);
  useEffect(()=>{if(finished)return;stopVoice();setBarOn(false);presImgLoaded.current=false;timers.current.forEach(clearTimeout);timers.current=[];
    // Wait for image before speaking
    const imgStart=Date.now();
    function trySpeak(){if(!alive.current)return;if(!cur.img||presImgLoaded.current||Date.now()-imgStart>5000){doSpeak()}else{const t=setTimeout(trySpeak,200);timers.current.push(t)}}
    function doSpeak(){
      say(cur.text).then(()=>{if(!alive.current)return;
        setBarOn(true);
        const t2=setTimeout(()=>{if(!alive.current)return;setBarOn(false);
          if(qi+1>=slides.length){setFinished(true);victoryBeeps()}
          else setQi(qi+1)},waitSec*1000);
        timers.current.push(t2)})}
    const t1=setTimeout(trySpeak,400);timers.current.push(t1);
    return()=>{timers.current.forEach(clearTimeout);timers.current=[];stopVoice()}
  },[qi,finished]);
  if(finished)return <div className="ab" style={{textAlign:'center',padding:'40px 18px'}}>
    <div style={{fontSize:100,marginBottom:16}}>🏆</div>
    <h2 style={{fontSize:28,color:GOLD,margin:'0 0 12px'}}>¡Presentación completada!</h2>
    <p style={{fontSize:20,color:GREEN,fontWeight:700,margin:'0 0 8px'}}>¡Genial, {name}!</p>
    <p style={{fontSize:16,color:DIM,margin:'0 0 24px'}}>Has dicho las {slides.length} frases</p>
    <button className="btn btn-gold" onClick={onOk} style={{fontSize:22,maxWidth:300,margin:'0 auto'}}>🎉 ¡Terminado!</button>
  </div>;
  return <div style={{textAlign:'center',position:'relative',maxHeight:'100dvh',overflow:'hidden'}}>
    <div style={{position:'relative',width:'100%',borderRadius:18,overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,.5)'}}>
      {cur.img?<img src={cur.img} alt={cur.text} onLoad={()=>{presImgLoaded.current=true}} onError={()=>{presImgLoaded.current=true}} style={{width:'100%',aspectRatio:'16/9',objectFit:'cover',display:'block'}}/>
        :<div style={{width:'100%',aspectRatio:'16/9',background:'linear-gradient(135deg,#1A237E 0%,#283593 50%,#3949AB 100%)',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:80}}>🎤</span></div>}
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,.85))',padding:'48px 16px 18px'}}>
        <p style={{fontSize:28,fontWeight:700,margin:0,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,.8)',lineHeight:1.3}}>{cur.text}</p>
        <p style={{fontSize:11,color:'rgba(255,255,255,.35)',margin:'4px 0 0',fontWeight:600}}>{qi+1}/{slides.length}</p>
      </div>
      {cur.picto&&<div style={{position:'absolute',bottom:80,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,.9)',border:'2px solid #333',borderRadius:8,padding:4}}><img src={cur.picto} alt={'Pictograma: '+cur.text} style={{height:60,objectFit:'contain',display:'block'}}/></div>}
      {barOn&&<div style={{position:'absolute',top:0,right:0,width:10,height:'100%',background:'rgba(0,0,0,.3)',borderRadius:0,overflow:'hidden',zIndex:5}}>
        <div style={{position:'absolute',top:0,left:0,width:'100%',background:RED,animation:`qsbar ${waitSec}s linear forwards`}}/>
      </div>}
    </div>
  </div>}
