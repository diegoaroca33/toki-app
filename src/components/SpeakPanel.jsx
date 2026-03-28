import { useState, useEffect, useRef, useMemo } from 'react'
import { GOLD, GREEN, RED, BLUE, PURPLE, TXT, BUILD_OK, GOOD_MSG } from '../constants.js'
import { say, sayFB, stopVoice, playRec, useSR, starBeep, cheerOrSay } from '../voice.js'
import { score, adjScore, splitSyllables, textKey, rnd, pickMsg, mkPerfect, beep, getExigencia, updateRepCount, getPhraseSpeed, updatePhraseSpeed } from '../utils.js'
import { RecBtn, useIdle } from './UIKit.jsx'
import { CelebrationOverlay, Stars } from './CelebrationOverlay.jsx'

export function SpeakPanel({text,exId,onOk,onSkip,sex,name,uid,vids,burstMode,burstSpeed}){
  const[sf,sSf]=useState(null);const[stars,setStars]=useState(0);const[att,sAtt]=useState(0);const[msg,sMsg]=useState('');const[mic,setMic]=useState(false);
  const[sylShow,setSylShow]=useState(false);const[sylIdx,setSylIdx]=useState(-1);
  const[burstFade,setBurstFade]=useState(false);
  const alive=useRef(true);const gen=useRef(0);const ttsPlaying=useRef(false);const{idleMsg,poke}=useIdle(name,!sf&&!mic);
  const dur=useMemo(()=>Math.max(6,Math.ceil(text.split(/\s+/).length*0.9)+4),[text]);
  const syllables=useMemo(()=>splitSyllables(text),[text]);
  const flatSyls=useMemo(()=>syllables.flat(),[syllables]);
  const key=text+'|'+exId;
  // M5: Get adaptive speed for this phrase
  const phraseKey=useMemo(()=>textKey(text),[text]);
  function getAdaptiveRate(){
    if(burstMode&&typeof burstSpeed==='number')return burstSpeed;
    if(uid)return getPhraseSpeed(uid,phraseKey);
    return undefined; // use default
  }
  async function doSyllablePlay(){if(!alive.current)return;setSylShow(true);setSylIdx(-1);stopVoice();ttsPlaying.current=true;
    for(let i=0;i<flatSyls.length;i++){if(!alive.current)return;setSylIdx(i);
      await new Promise(r=>{const u=new SpeechSynthesisUtterance(flatSyls[i]);u.lang='es-ES';u.rate=0.45;u.pitch=1.0;u.volume=1.0;let done=false;const fin=()=>{if(!done){done=true;r()}};u.onend=fin;u.onerror=fin;window.speechSynthesis.speak(u);setTimeout(fin,1500)});
      await new Promise(r=>setTimeout(r,300))}
    ttsPlaying.current=false;setSylIdx(-1);await new Promise(r=>setTimeout(r,300));
    if(!alive.current)return;sr.go();setMic(true)}
  async function doSlowPlay(){if(!alive.current)return;setSylShow(true);setSylIdx(-1);stopVoice();ttsPlaying.current=true;
    const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=0.35;u.pitch=1.0;u.volume=1.0;
    await new Promise(r=>{let done=false;const fin=()=>{if(!done){done=true;r()}};u.onend=fin;u.onerror=fin;window.speechSynthesis.speak(u);setTimeout(fin,Math.max(4000,text.length*400))});
    ttsPlaying.current=false;if(!alive.current)return;setSylShow(false);
    const pm='¡Seguimos!';sMsg(pm);sSf('pass');sayFB(pm);setTimeout(()=>{if(alive.current)onOk(1,3)},800)}
  function handleSR(said){if(!alive.current)return;if(ttsPlaying.current){sr.go();return}poke();setMic(false);sr.stop();stopVoice();
    const rawB=Math.max(...said.split('|').map(a=>score(a,text)));const b=adjScore(rawB);
    setStars(b);starBeep(b);
    // M1: Update repetition counter
    if(uid&&exId)updateRepCount(uid,exId,b);
    // M5: Update adaptive speed
    if(uid)updatePhraseSpeed(uid,phraseKey,b>=3);

    // === BURST MODE: instant visual feedback, no audio, immediate next ===
    if(burstMode){
      setBurstFade(true);
      setTimeout(()=>{if(alive.current){setBurstFade(false);onOk(b,1)}},300);
      return;
    }

    // M3: Smart repetition — 60% of exigencia threshold, max 3 attempts
    const exPct=getExigencia()/100;// e.g. 0.65
    const passThreshold=exPct*0.6*4;// 60% of exigencia applied to 4-star scale
    const na=att+1;sAtt(na);
    if(b>=4){const m=mkPerfect(name);sMsg(m);sSf('perfect');cheerOrSay(m,uid,vids,'perfect').then(()=>{if(alive.current)onOk(b,na)})}
    else if(b>=passThreshold){
      // Pass with earned stars
      if(b>=3){const gm=pickMsg(true,name,'decir');sMsg(gm);sSf('ok');cheerOrSay(rnd(GOOD_MSG),uid,vids,'good').then(()=>{if(alive.current)onOk(b,na)})}
      else{const gm=pickMsg(true,name,'decir');sMsg(gm);sSf('ok');sayFB(gm);setTimeout(()=>{if(alive.current)onOk(b,na)},800)}
    }
    else if(na>=3){
      // M3: Auto-pass after 3 attempts with 1 star and encouraging message
      const autoMsg=rnd(['¡Buen esfuerzo!','¡Seguimos practicando!','¡Lo harás mejor!']);sMsg(autoMsg);sSf('pass');setStars(1);sayFB(autoMsg);
      setTimeout(()=>{if(alive.current)onOk(1,na)},800)
    }
    else{
      // Retry with encouragement
      const retryMsg=rnd(['¡Otra vez!','¡Tú puedes!','¡Inténtalo de nuevo!']);sMsg(retryMsg);sSf('try');sayFB(retryMsg);
      setTimeout(()=>{if(alive.current){sSf(null);doPlay()}},900)
    }}
  const sr=useSR(handleSR);
  async function doPlay(){if(!alive.current)return;stopVoice();sr.stop();sMsg('');setMic(false);setStars(0);setBurstFade(false);
    try{const ms=await navigator.mediaDevices.getUserMedia({audio:true});ms.getTracks().forEach(t=>t.stop())}catch(e){}
    // Play TTS first, mark as playing so SR ignores Toki's voice
    ttsPlaying.current=true;
    const rate=getAdaptiveRate();
    const played=await playRec(uid,vids,textKey(text));if(!played)await say(text,rate);
    ttsPlaying.current=false;
    if(!alive.current)return;
    sr.go();setMic(true);
  }
  useEffect(()=>{alive.current=true;gen.current++;sSf(null);sAtt(0);sMsg('');setMic(false);setStars(0);setSylShow(false);setSylIdx(-1);setBurstFade(false);stopVoice();sr.stop();
    // Proactively reactivate mic permission on exercise entry
    if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop())}).catch(()=>{});
    const t=setTimeout(()=>{if(alive.current){stopVoice();doPlay()}},burstMode?300:900);return()=>{alive.current=false;clearTimeout(t);stopVoice();sr.stop()}},[key]);
  function onTimeUp(){if(!alive.current)return;setMic(false);sr.stop();stopVoice();
    const na=att+1;sAtt(na);
    // M1: Count timeout as 0-star attempt
    if(uid&&exId)updateRepCount(uid,exId,0);
    // M5: Update adaptive speed on timeout
    if(uid)updatePhraseSpeed(uid,phraseKey,false);
    if(burstMode){onOk(0,1);return}
    if(na>=3){
      // M3: Auto-pass after 3 attempts
      const autoMsg=rnd(['¡Buen esfuerzo!','¡Seguimos!']);sMsg(autoMsg);sSf('pass');setStars(1);sayFB(autoMsg);
      setTimeout(()=>{if(alive.current)onOk(1,na)},800)
    }
    else{const pm=pickMsg(false,null,'decir');sMsg(pm);sSf('wait');sayFB(pm);setTimeout(()=>{if(alive.current){sSf(null);doPlay()}},900)}}
  function hearAgain(){poke();stopVoice();sr.stop();sSf(null);setMic(false);doPlay()}
  function skip(){stopVoice();sr.stop();alive.current=false;onSkip()}
  const fc=stars>=4?GOLD:stars>=3?GREEN:stars>=2?BLUE:'#E67E22';
  let sylFlatIdx=0;
  return <div style={{textAlign:'center'}} onClick={poke}>
    {/* Phrase bubble */}
    <div style={{padding:'18px 24px',marginBottom:16,borderRadius:24,background:'rgba(255,255,255,.06)',border:'2px solid rgba(255,255,255,.1)'}}>
      {!sylShow&&<p style={{fontSize:26,fontWeight:700,margin:0,lineHeight:1.3,color:TXT}}>"{text}"</p>}
      {sylShow&&<div style={{display:'flex',flexWrap:'wrap',gap:'clamp(4px, 1.5vw, 10px)',justifyContent:'center',alignItems:'center'}}>{syllables.map((wordSyls,wi)=>{
        const items=[];if(wi>0)items.push(<span key={'sp'+wi} style={{width:16}}/>);
        wordSyls.forEach((s,si)=>{const fi=sylFlatIdx++;const active=fi===sylIdx;const past=sylIdx===-1||fi<sylIdx;
          items.push(<span key={wi+'_'+si} style={{fontSize:'clamp(20px, 4.5vw, 28px)',fontWeight:700,padding:'8px 12px',borderRadius:14,transition:'all .3s',background:active?GOLD+'44':past&&sylIdx!==-1?GREEN+'22':'rgba(255,255,255,.08)',color:active?GOLD:past&&sylIdx!==-1?GREEN:TXT,transform:active?'scale(1.15)':'scale(1)',textTransform:'uppercase'}}>{s}</span>)});
        return items})}</div>}
    </div>
    {/* Stars */}
    {stars>=4&&!burstMode&&<CelebrationOverlay show={true} duration={1500}/>}
    <div style={{minHeight:burstMode?40:70,marginBottom:burstMode?4:12}}>
    {stars>0&&<div className="ab" style={burstMode?{transition:'opacity .3s',opacity:burstFade?0:1}:{}}><Stars n={stars} sz={burstMode?28:40}/></div>}
    {!burstMode&&msg&&<div className={sf==='perfect'||sf==='ok'?'ab':'af'} style={{borderRadius:18,padding:14,marginTop:8}}><p style={{fontSize:22,fontWeight:700,margin:0,color:fc}}>{msg}</p></div>}
    {!burstMode&&idleMsg&&!sf&&!msg&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    </div>
    {/* Fixed bottom bar: 🔊 left — 🎤 mic center — ⏭️ right */}
    <div style={{position:'fixed',bottom:180,left:0,right:0,display:'flex',alignItems:'center',justifyContent:'center',gap:20,zIndex:10}}>
      <button onClick={hearAgain} style={{
        width:66,height:66,borderRadius:'50%',border:'none',cursor:'pointer',
        background:`radial-gradient(circle at 30% 25%,#90CAF9,${BLUE} 60%,#1565C0)`,
        boxShadow:`0 3px 12px ${BLUE}44, inset 0 -3px 8px #1565C066`,
        display:'flex',alignItems:'center',justifyContent:'center',
        fontFamily:"'Fredoka'",transition:'transform .15s',flexShrink:0,
      }} title="Escuchar otra vez">
        <span style={{fontSize:30}}>🔊</span>
      </button>
      <div style={{width:80,height:80,flexShrink:0}}>
        <RecBtn dur={dur} onEnd={onTimeUp} on={mic}/>
      </div>
      <button className="skip-btn" onClick={skip} style={{
        width:56,height:56,borderRadius:'50%',border:'none',cursor:'pointer',
        background:`radial-gradient(circle at 30% 25%,#999,#666 60%,#444)`,
        boxShadow:'0 2px 8px rgba(0,0,0,.3)',
        display:'flex',alignItems:'center',justifyContent:'center',
        fontFamily:"'Fredoka'",transition:'transform .15s',flexShrink:0,
      }} title="Saltar">
        <span style={{fontSize:24}}>⏭️</span>
      </button>
    </div>
    {/* Spacer so content doesn't go behind fixed bar */}
    <div style={{height:100}}/>
  </div>}

export function ExFlu({ex,onOk,onSkip,sex,name,uid,vids,burstMode,burstSpeed}){return <div style={{textAlign:'center',padding:12}}>
  <div style={{fontSize:100,marginBottom:12,lineHeight:1,filter:'drop-shadow(0 4px 12px rgba(0,0,0,.3))'}}>{ex.em}</div>
  <SpeakPanel text={ex.ph} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids} burstMode={burstMode} burstSpeed={burstSpeed}/></div>}

export function ExFrases({ex,onOk,onSkip,sex,name,uid,vids}){
  const[ph,sPh]=useState('build');const[pl,sPl]=useState([]);const[av,sAv]=useState([]);const[bf,sBf]=useState(null);
  const words=useMemo(()=>ex.fu.replace(/[¿?¡!,\.]/g,'').split(/\s+/),[ex.fu]);const{idleMsg,poke}=useIdle(name,ph==='build'&&!bf);
  useEffect(()=>{sPh('build');sBf(null);let sh=[...words];if(sh.length>1){let tries=0;do{for(let i=sh.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[sh[i],sh[j]]=[sh[j],sh[i]]}tries++}while(tries<50&&sh.every((w,i)=>w===words[i]));if(sh.every((w,i)=>w===words[i])){const a=0,b=sh.length-1;[sh[a],sh[b]]=[sh[b],sh[a]]}}sAv(sh.map((w,i)=>({w,oi:i,i,u:false})));sPl(Array(words.length).fill(null))},[ex]);
  function place(item){poke();const s=pl.findIndex(p=>p===null);if(s===-1)return;const np=[...pl];np[s]=item;sPl(np);sAv(a=>a.map(x=>x.i===item.i?{...x,u:true}:x));if(np.every(p=>p!==null)){const built=np.map(p=>p.w.toLowerCase()).join(' ');const target=words.map(w=>w.toLowerCase()).join(' ');if(built===target){sBf('ok');(async()=>{stopVoice();await cheerOrSay(rnd(BUILD_OK),uid,vids,'build');await new Promise(r=>setTimeout(r,400));stopVoice();const phr=await playRec(uid,vids,textKey(ex.fu));if(!phr){stopVoice();await say(ex.fu)}await new Promise(r=>setTimeout(r,600));stopVoice();sPh('speak')})()}else{sBf('no');setTimeout(()=>{sPl(Array(words.length).fill(null));sAv(a=>a.map(x=>({...x,u:false})));sBf(null)},1000)}}}
  function undo(){poke();let li=-1;pl.forEach((p,i)=>{if(p)li=i});if(li===-1)return;const it=pl[li];const np=[...pl];np[li]=null;sPl(np);sAv(a=>a.map(x=>x.i===it.i?{...x,u:false}:x))}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}><div style={{fontSize:72,marginBottom:16,animation:'glow 3s infinite'}}>{ex.em}</div>
    {ph==='build'&&<div className="af"><div className="card" style={{marginBottom:16,background:BLUE+'0C',borderColor:BLUE+'33'}}><p style={{fontSize:22,fontWeight:600,margin:0,lineHeight:1.4,color:BLUE}}>{ex.q}</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:16,minHeight:56}}>{pl.map((p,i)=><div key={i} className={'ws '+(p?'ws-f':'ws-e')}>{p?p.w:'___'}</div>)}</div>
      <div style={{minHeight:60,marginBottom:14}}>
      {bf==='ok'&&<><CelebrationOverlay show={true} duration={1500}/><div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18}}><Stars n={4} sz={36}/><p style={{fontSize:18,fontWeight:600,color:GREEN,margin:'8px 0 0'}}>¡Frase perfecta!</p></div></>}
      {bf==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
      {idleMsg&&!bf&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
      </div>
      {!bf&&<div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',marginBottom:14}}>{av.filter(x=>!x.u).map(x=><button key={x.i} className="btn btn-b btn-word" onClick={()=>place(x)}>{x.w}</button>)}</div>}
      <div style={{display:'flex',gap:10,justifyContent:'center',alignItems:'center'}}>{!bf&&pl.some(p=>p)&&<button className="btn btn-o btn-half" onClick={undo}>↩️ Borrar</button>}{bf!=='ok'&&!pl.every(p=>p!==null)&&<button onClick={()=>{poke();stopVoice();say(ex.fu)}} style={{width:60,height:60,borderRadius:'50%',border:'none',cursor:'pointer',background:`radial-gradient(circle at 30% 25%,#CE93D8,${PURPLE} 60%,#6A1B9A)`,boxShadow:`0 3px 12px ${PURPLE}44`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1,flexShrink:0,fontFamily:"'Fredoka'"}}><span style={{fontSize:22,lineHeight:1}}>🔊</span><span style={{fontSize:10,color:'#fff',fontWeight:600,lineHeight:1}}>Pista</span></button>}</div>
      <div style={{marginTop:14}}><button className="btn btn-ghost skip-btn" onClick={()=>{poke();stopVoice();onSkip()}}>⏭️ Saltar</button></div></div>}
    {ph==='speak'&&<SpeakPanel text={ex.fu} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/>}
  </div>}

export function ExFrasesBlank({ex,onOk,onSkip,sex,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[ph,sPh]=useState('fill');const{idleMsg,poke}=useIdle(name,ph==='fill'&&!fb);
  useEffect(()=>{setAns('');setFb(null);sPh('fill');stopVoice();setTimeout(()=>{stopVoice();say('Completa la frase')},400);return()=>stopVoice()},[ex]);
  function check(){poke();if(ans.trim().toLowerCase()===ex.blank.toLowerCase()){setFb('ok');starBeep(4);stopVoice();cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{sPh('speak')})}
    else{setFb('no');beep(200,200);stopVoice();sayFB('La palabra es: '+ex.blank);setTimeout(()=>{setFb(null);setAns('')},2000)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div style={{fontSize:72,marginBottom:16,animation:'glow 3s infinite'}}>{ex.em||'📝'}</div>
    {ph==='fill'&&<div className="af">
      <div className="card" style={{padding:20,marginBottom:14,background:BLUE+'0C',borderColor:BLUE+'33'}}>
        <p style={{fontSize:22,fontWeight:700,margin:0,lineHeight:1.4}}>{ex.words.map((w,i)=>w==='___'?<span key={i} style={{color:GOLD,borderBottom:'3px solid '+GOLD,padding:'0 8px'}}>____</span>:<span key={i}>{(i>0?' ':'')+w}</span>)}</p>
      </div>
      <input className="inp" value={ans} onChange={e=>setAns(e.target.value)} placeholder="Escribe la palabra" style={{textAlign:'center',fontSize:22,marginBottom:12}}/>
      <div style={{display:'flex',gap:10,justifyContent:'center'}}><button className="btn btn-g" disabled={!ans.trim()} onClick={check} style={{maxWidth:200}}>✓</button><button className="btn btn-ghost btn-half skip-btn" style={{maxWidth:100}} onClick={()=>{stopVoice();onSkip()}}>⏭️</button></div>
      {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div>}
      {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
      {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    </div>}
    {ph==='speak'&&<SpeakPanel text={ex.fu} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/>}
  </div>}

export function ExSit({ex,onOk,onSkip,sex,name,uid,vids}){const[ph,sPh]=useState('choose');const[cf,sCf]=useState(null);const shuf=useMemo(()=>[...ex.op].sort(()=>Math.random()-.5),[ex]);const{idleMsg,poke}=useIdle(name,ph==='choose'&&!cf);useEffect(()=>{sPh('choose');sCf(null)},[ex]);function pick(o){poke();if(o===ex.op[0]){(async()=>{stopVoice();await cheerOrSay(rnd(BUILD_OK),uid,vids,'build');await new Promise(r=>setTimeout(r,400));stopVoice();const phr=await playRec(uid,vids,textKey(ex.su));if(!phr){stopVoice();await say(ex.su)}await new Promise(r=>setTimeout(r,400));stopVoice();sPh('speak')})()}else{sCf('no');setTimeout(()=>sCf(null),1000)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}><div style={{fontSize:72,marginBottom:16}}>{ex.em}</div><div className="card" style={{marginBottom:16,background:BLUE+'0C',borderColor:BLUE+'33'}}><p style={{fontSize:20,fontWeight:600,margin:0,lineHeight:1.4}}>{ex.si}</p></div>
    {ph==='choose'&&<div className="af"><p style={{fontSize:20,color:GOLD,fontWeight:700,margin:'0 0 14px'}}>¿Qué dirías?</p>{cf==='no'&&<div className="as" style={{background:GOLD+'22',borderRadius:12,padding:12,marginBottom:12}}><p style={{fontSize:17,color:GOLD,margin:0}}>¡Casi! Prueba otra 💪</p></div>}{idleMsg&&!cf&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}<div style={{display:'flex',flexDirection:'column',gap:12}}>{shuf.map((o,i)=><button key={i} className="btn btn-b" onClick={()=>pick(o)} style={{textAlign:'left',fontSize:18}}>{o}</button>)}</div><div style={{marginTop:14}}><button className="btn btn-ghost skip-btn" onClick={()=>{poke();onSkip()}}>⏭️ Saltar</button></div></div>}
    {ph==='speak'&&<SpeakPanel text={ex.su} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/>}
  </div>}
