// ============================================================
// TOKI · Aprende a decirlo
// © 2026 Diego Aroca. Todos los derechos reservados.
// Entrenador de comunicación funcional
// ============================================================
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AREAS, EX } from './exercises.js'

// ============ STYLES ============
const CSS = `
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;font-family:'Fredoka',sans-serif;background:linear-gradient(165deg,#080C18,#12082a 45%,#0E1428);color:#EDF0F7;min-height:100vh}
button{font-family:'Fredoka',sans-serif;touch-action:manipulation;cursor:pointer}
input{font-family:'Fredoka',sans-serif}
input::placeholder{color:rgba(255,255,255,.2)}
#root{max-width:420px;margin:0 auto;padding:12px 16px}
.btn{border:2.5px solid;border-radius:10px;padding:12px 20px;font-weight:600;font-size:16px;transition:transform .12s;color:#fff;letter-spacing:.3px}
.btn:active{transform:scale(.95)!important}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn-big{padding:18px 30px;font-size:19px}
.btn-full{width:100%}
.btn-g{background:#22D693;border-color:#17A673;box-shadow:3px 3px 0 #17A673}
.btn-b{background:#42A5F5;border-color:#1976D2;box-shadow:3px 3px 0 #1976D2}
.btn-p{background:#AB47BC;border-color:#7B1FA2;box-shadow:3px 3px 0 #7B1FA2}
.btn-o{background:#FF7043;border-color:#D84315;box-shadow:3px 3px 0 #D84315}
.btn-pk{background:#FF4D6A;border-color:#C62828;box-shadow:3px 3px 0 #C62828}
.btn-gh{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1);box-shadow:none;color:rgba(255,255,255,.4)}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:700}
.card{background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.09);border-radius:14px;padding:14px}
.inp{width:100%;padding:12px 14px;background:rgba(255,255,255,.05);border:2px solid rgba(255,255,255,.09);border-radius:8px;color:#EDF0F7;font-size:18px;outline:none}
.ws{min-width:48px;height:42px;display:flex;align-items:center;justify-content:center;padding:0 12px;border-radius:8px;font-size:17px;font-weight:700;transition:all .3s}
.ws-e{background:rgba(255,255,255,.03);border:2px dashed rgba(255,255,255,.15);color:rgba(255,255,255,.15)}
.ws-f{background:#22D693;border:2px solid #17A673;color:#0E1428;box-shadow:2px 2px 0 #17A673}
.pbar{height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden}
.pfill{height:100%;background:linear-gradient(90deg,#22D693,#42A5F5);border-radius:3px;transition:width .5s}
.ov{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;background:rgba(0,0,0,.9)}
.ovp{background:#0E1428;border:2px solid rgba(255,215,79,.3);border-radius:16px;padding:28px 22px;max-width:340px;width:100%;text-align:center}
.profcard{display:flex;align-items:center;gap:14px;padding:14px 18px;width:100%;text-align:left;background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.09);border-radius:14px;color:#EDF0F7}
.avbtn{font-size:26px;width:46px;height:46px;border-radius:12px;border:2px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03)}
.avbtn.on{border-color:#22D693;background:rgba(34,214,147,.15)}
.tabs{display:flex;gap:3px;background:rgba(255,255,255,.03);border-radius:10px;padding:3px}
.tab{flex:1;padding:10px;border-radius:8px;border:none;font-weight:600;font-size:14px;background:transparent;color:rgba(255,255,255,.38)}
.tab.on{background:#22D693;color:#0E1428}
.sbox{background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.09);border-radius:10px;padding:14px;text-align:center}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounceIn{0%{transform:scale(.5);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes confDrop{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
.af{animation:fadeIn .4s ease-out}.ab{animation:bounceIn .4s}.ap{animation:pulse 1.5s infinite}.as{animation:shake .45s}
`;

// ============ UTILS ============
function lev(a,b){const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}
function score(said,tgt){const c=s=>s.toLowerCase().replace(/[^a-záéíóúñü\s]/g,'').trim();const a=c(said),b=c(tgt);if(a===b)return 3;const sw=a.split(/\s+/),tw=b.split(/\s+/);let mt=0;tw.forEach(t=>{if(sw.some(s=>s===t||lev(s,t)<=1))mt++});const r=mt/tw.length;return r>=.8?3:r>=.55?2:r>=.3?1:0}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}

// ============ VOICE SYSTEM ============
// Tries MP3 first (public/audio/{sex}/{id}.mp3), falls back to browser TTS
let voiceProfile={age:12,sex:'m'};
let cachedVoice=null;
function setVoiceProfile(age,sex){voiceProfile={age:age||12,sex:sex||'m'};cachedVoice=null;pickVoice()}
function getVoiceParams(){
  const a=voiceProfile.age,s=voiceProfile.sex;
  if(a<=9)return{rate:.62,pitch:s==='f'?1.35:1.2};
  if(a<=13)return{rate:.68,pitch:s==='f'?1.15:.95};
  if(a<=17)return{rate:.72,pitch:s==='f'?1.05:.85};
  return{rate:.75,pitch:s==='f'?1.0:.8};
}
function pickVoice(){
  const voices=window.speechSynthesis?window.speechSynthesis.getVoices():[];
  const es=voices.filter(v=>v.lang&&v.lang.startsWith('es'));
  if(!es.length){cachedVoice=null;return}
  const fem=/elena|conchita|lucia|miren|monica|paulina|female|femenin|mujer|helena/i;
  const mal=/jorge|enrique|pablo|andres|diego|male|masculin|hombre/i;
  if(voiceProfile.sex==='f')cachedVoice=es.find(v=>fem.test(v.name))||es[0];
  else cachedVoice=es.find(v=>mal.test(v.name))||es[0];
}
if(window.speechSynthesis){window.speechSynthesis.onvoiceschanged=pickVoice;setTimeout(pickVoice,200);setTimeout(pickVoice,600)}

// Try to play MP3, return promise. If no MP3, use browser TTS
function speak(text, exId){
  return new Promise((resolve)=>{
    // Try MP3 first
    if(exId){
      const audio=new Audio(`/audio/${voiceProfile.sex}/${exId}.mp3`);
      audio.onended=()=>resolve();
      audio.onerror=()=>{speakTTS(text).then(resolve)};
      audio.play().catch(()=>{speakTTS(text).then(resolve)});
      return;
    }
    speakTTS(text).then(resolve);
  });
}
function speakTTS(text){
  return new Promise((resolve)=>{
    if(!('speechSynthesis' in window)){resolve();return}
    window.speechSynthesis.cancel();
    if(!cachedVoice)pickVoice();
    const vp=getVoiceParams();
    const u=new SpeechSynthesisUtterance(text);
    u.lang='es-ES';u.rate=vp.rate;u.pitch=vp.pitch;
    if(cachedVoice)u.voice=cachedVoice;
    u.onend=()=>resolve();
    u.onerror=()=>resolve();
    window.speechSynthesis.speak(u);
    // Safety timeout
    setTimeout(resolve,8000);
  });
}

// ============ MICROPHONE (singleton) ============
let globalRec=null,globalRecReady=false;
(function(){const S=window.SpeechRecognition||window.webkitSpeechRecognition;if(!S)return;globalRec=new S();globalRec.lang='es-ES';globalRec.continuous=false;globalRec.interimResults=false;globalRec.maxAlternatives=5;globalRecReady=true})();

function useSR(){
  const[on,sOn]=useState(false);const[res,sRes]=useState('');
  useEffect(()=>{if(!globalRec)return;
    globalRec.onresult=e=>{const a=[];for(let i=0;i<e.results[0].length;i++)a.push(e.results[0][i].transcript.toLowerCase().trim());sRes(a.join('|'));sOn(false)};
    globalRec.onerror=()=>sOn(false);globalRec.onend=()=>sOn(false)});
  const go=useCallback(()=>{if(!globalRec)return;sRes('');sOn(true);try{globalRec.stop()}catch(e){}setTimeout(()=>{try{globalRec.start()}catch(e){sOn(false)}},120)},[]);
  return{on,res,ok:globalRecReady,go}
}

// ============ SRS ============
function srsUp(id,ok,u){const d={...u};if(!d.srs)d.srs={};if(!d.srs[id])d.srs[id]={lv:0,t:0};d.srs[id].t=Date.now();d.srs[id].lv=ok?Math.min(d.srs[id].lv+1,5):Math.max(d.srs[id].lv-1,0);return d}
function needsRev(id,u){const s=u.srs&&u.srs[id];if(!s)return true;const g=[0,30000,120000,600000,3600000,86400000];return(Date.now()-s.t)>=g[Math.min(s.lv,5)]}

// ============ DATA ============
const AVS=['🧑‍🚀','🦸','🧙','🐉','🤖','🦊','🎮','⚡','🌟','🐸'];
const CLS=['#22D693','#42A5F5','#FFD54F','#AB47BC','#FF4D6A','#FF8A65','#22D693'];
const tdy=()=>new Date().toLocaleDateString('es-ES');
const CHEERS=['¡Muy bien! 🌟','¡Genial! ⭐','¡Qué crack! 💪','¡Perfecto! 🎉','¡Así se habla! 🔥','¡Increíble! ✨'];
const ALMOSTS=['¡Casi! Otra vez 💪','Escucha bien y repite 👂','¡Tú puedes! Venga 🎯'];
const GOODS=['¡Buen intento! Seguimos 👏','¡Bien hecho! A por otra 🚀','¡Vas genial! Continuamos ⭐'];
const rnd=a=>a[Math.floor(Math.random()*a.length)];

// ============ SMALL COMPONENTS ============
function Tag({c,ch}){const cl=c||'#22D693';return <span className="tag" style={{background:cl+'22',color:cl,border:'1.5px solid '+cl+'44'}}>{ch}</span>}
function Ring({p,sz=80,sw=5,c='#22D693'}){const r=(sz-sw)/2,ci=2*Math.PI*r;return <svg width={sz} height={sz} style={{transform:'rotate(-90deg)'}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={sw}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={ci-(p||0)*ci} strokeLinecap="round" style={{transition:'stroke-dashoffset .6s'}}/></svg>}
function Confetti({show}){const[pts,sP]=useState([]);useEffect(()=>{if(show){sP(Array.from({length:20},(_,i)=>({i,x:Math.random()*100,c:CLS[i%7],s:5+Math.random()*8,d:Math.random()*.4,du:.7+Math.random()*.7})));setTimeout(()=>sP([]),2500)}},[show]);if(!pts.length)return null;return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:999}}>{pts.map(p=><div key={p.i} style={{position:'absolute',left:p.x+'%',top:'-5%',width:p.s,height:p.s,background:p.c,borderRadius:2,animation:`confDrop ${p.du}s ease-in ${p.d}s forwards`}}/>)}</div>}
function Tower({placed,total}){const cells=21,filled=Math.min(Math.floor((placed/Math.max(total,1))*cells),cells);return <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,maxWidth:200,margin:'0 auto'}}>{Array.from({length:cells},(_,i)=>{const row=Math.floor(i/7),inv=(2-row)*7+(i%7),on=inv<filled;return <div key={i} style={{aspectRatio:'1',borderRadius:3,transition:'all .35s cubic-bezier(.34,1.56,.64,1)',background:on?CLS[inv%7]:'rgba(255,255,255,.02)',border:on?'2px solid rgba(0,0,0,.2)':'2px solid rgba(255,255,255,.04)',boxShadow:on?'inset -1px -1px 0 rgba(0,0,0,.15),inset 1px 1px 0 rgba(255,255,255,.2)':'none',transform:on?'scale(1)':'scale(.8)',opacity:on?1:.35}}/>})}</div>}

// ============ EXERCISE: HAZ LA FRASE ============
function ExFrases({ex,onOk,onSkip}){
  const[ph,sPh]=useState('build');const[pl,sPl]=useState([]);const[av,sAv]=useState([]);
  const[bf,sBf]=useState(null);const[sf,sSf]=useState(null);const[att,sAtt]=useState(0);const[msg,sMsg]=useState('');
  const sr=useSR();
  const words=useMemo(()=>ex.fu.replace(/[¿?¡!,\.]/g,'').split(/\s+/),[ex.fu]);
  useEffect(()=>{sPh('build');sBf(null);sSf(null);sAtt(0);sMsg('');
    const d=['el','un','muy','y','más','eso'].filter(w=>!words.map(x=>x.toLowerCase()).includes(w));
    sAv([...words,...d.slice(0,2)].sort(()=>Math.random()-.5).map((w,i)=>({w,i,u:false})));sPl(Array(words.length).fill(null))},[ex]);
  useEffect(()=>{if(!sr.res||ph!=='speak')return;const b=Math.max(...sr.res.split('|').map(a=>score(a,ex.fu)));
    if(b>=2){sMsg(rnd(CHEERS));sSf('ok');setTimeout(onOk,1800)}
    else{const na=att+1;sAtt(na);if(na>=2){sMsg(rnd(GOODS));sSf('pass');setTimeout(onOk,1800)}else{sMsg(rnd(ALMOSTS));sSf('re');setTimeout(()=>{sSf(null);sMsg('')},1800)}}},[sr.res]);
  function place(item){const s=pl.findIndex(p=>p===null);if(s===-1)return;const np=[...pl];np[s]=item;sPl(np);sAv(a=>a.map(x=>x.i===item.i?{...x,u:true}:x));
    if(np.every(p=>p!==null)){const built=np.map(p=>p.w.toLowerCase()).join(' ');const target=words.map(w=>w.toLowerCase()).join(' ');
      if(built===target){sBf('ok');speak(ex.fu,ex.id).then(()=>sPh('speak'))}else{sBf('no');setTimeout(()=>{sPl(Array(words.length).fill(null));sAv(a=>a.map(x=>({...x,u:false})));sBf(null)},1200)}}}
  function undo(){let li=-1;pl.forEach((p,i)=>{if(p)li=i});if(li===-1)return;const it=pl[li];const np=[...pl];np[li]=null;sPl(np);sAv(a=>a.map(x=>x.i===it.i?{...x,u:false}:x))}
  function goSpeak(){speak(ex.fu,ex.id).then(()=>{sMsg('¡Ahora tú! 🎤');setTimeout(()=>sr.go(),400)})}
  return <div style={{textAlign:'center',padding:16}}>
    <div style={{fontSize:56,marginBottom:10,filter:'drop-shadow(0 3px 10px rgba(0,0,0,.4))'}}>{ex.em}</div>
    {ph==='build'&&<div className="af">
      <div className="card" style={{marginBottom:14,background:'rgba(66,165,245,.06)',borderColor:'rgba(66,165,245,.2)'}}><p style={{fontSize:19,fontWeight:600,margin:0,lineHeight:1.4,color:'#42A5F5'}}>{ex.q}</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:14,minHeight:46}}>{pl.map((p,i)=><div key={i} className={'ws '+(p?'ws-f':'ws-e')}>{p?p.w:'___'}</div>)}</div>
      {bf==='ok'&&<div className="ab" style={{background:'rgba(34,214,147,.15)',borderRadius:12,padding:14,marginBottom:10}}><span style={{fontSize:28}}>⭐</span><p style={{fontSize:15,color:'#22D693',fontWeight:700,margin:'4px 0 0'}}>¡Bien!</p></div>}
      {bf==='no'&&<div className="as" style={{background:'rgba(255,112,67,.15)',borderRadius:12,padding:10,marginBottom:10}}><p style={{fontSize:14,color:'#FF7043',fontWeight:600,margin:0}}>¡Casi! Prueba otra vez 💪</p></div>}
      {!bf&&<div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:12}}>{av.filter(x=>!x.u).map(x=><button key={x.i} className="btn btn-b" style={{padding:'10px 14px',fontSize:17}} onClick={()=>place(x)}>{x.w}</button>)}</div>}
      <div style={{display:'flex',gap:8,justifyContent:'center'}}>{!bf&&pl.some(p=>p)&&<button className="btn btn-o" style={{padding:'8px 14px'}} onClick={undo}>↩️</button>}<button className="btn btn-p" style={{padding:'8px 14px'}} onClick={()=>speak(ex.fu,ex.id)}>🔊 Pista</button></div>
    </div>}
    {ph==='speak'&&<div className="af">
      <div className="card" style={{padding:18,marginBottom:14,background:'rgba(34,214,147,.06)',borderColor:'rgba(34,214,147,.2)'}}><p style={{fontSize:21,fontWeight:700,margin:0}}>"{ex.fu}"</p></div>
      {msg&&<div className={sf==='ok'||sf==='pass'?'ab':'as'} style={{background:sf==='ok'?'rgba(34,214,147,.15)':sf==='pass'?'rgba(66,165,245,.15)':'rgba(255,112,67,.15)',borderRadius:12,padding:14,marginBottom:12}}><p style={{fontSize:16,fontWeight:700,margin:0,color:sf==='ok'?'#22D693':sf==='pass'?'#42A5F5':'#FF7043'}}>{msg}</p></div>}
      {!sf&&<div>{sr.on?<div style={{fontSize:16,color:'#FF4D6A',fontWeight:600,marginBottom:10}}><span className="ap" style={{display:'inline-block'}}>🎤</span> Te escucho...</div>:<button className="btn btn-g btn-big btn-full" onClick={goSpeak} style={{fontSize:20}}>🚀 ¡Vamos!</button>}</div>}
    </div>}
    {ph!=='speak'&&<div style={{marginTop:12}}><button className="btn btn-gh" onClick={onSkip}>⏭️ Saltar</button></div>}
  </div>
}

// ============ EXERCISE: SITUACIONES ============
function ExSit({ex,onOk,onSkip}){
  const[ph,sPh]=useState('choose');const[cf,sCf]=useState(null);const[sf,sSf]=useState(null);const[att,sAtt]=useState(0);const[msg,sMsg]=useState('');
  const sr=useSR();const shuf=useMemo(()=>[...ex.op].sort(()=>Math.random()-.5),[ex]);
  useEffect(()=>{sPh('choose');sCf(null);sSf(null);sAtt(0);sMsg('')},[ex]);
  useEffect(()=>{if(!sr.res||ph!=='speak')return;const b=Math.max(...sr.res.split('|').map(a=>score(a,ex.su)));
    if(b>=1){sMsg(rnd(CHEERS));sSf('ok');setTimeout(onOk,1800)}
    else{const na=att+1;sAtt(na);if(na>=2){sMsg(rnd(GOODS));sSf('pass');setTimeout(onOk,1800)}else{sMsg(rnd(ALMOSTS));sSf('re');setTimeout(()=>{sSf(null);sMsg('')},1800)}}},[sr.res]);
  function goSpeak(){speak(ex.su,ex.id).then(()=>{sMsg('¡Repítelo! 🎤');setTimeout(()=>sr.go(),400)})}
  return <div style={{textAlign:'center',padding:16}}>
    <div style={{fontSize:56,marginBottom:10}}>{ex.em}</div>
    <div className="card" style={{marginBottom:14,background:'rgba(66,165,245,.06)',borderColor:'rgba(66,165,245,.2)'}}><Tag c="#42A5F5" ch="SITUACIÓN"/><p style={{fontSize:17,fontWeight:600,margin:'8px 0 0',lineHeight:1.4}}>{ex.si}</p></div>
    {ph==='choose'&&<div className="af"><p style={{fontSize:15,color:'#FFD54F',fontWeight:600,margin:'0 0 10px'}}>¿Qué dirías?</p>
      {cf==='no'&&<div className="as" style={{background:'rgba(255,112,67,.15)',borderRadius:10,padding:8,marginBottom:8}}><p style={{fontSize:14,color:'#FF7043',margin:0}}>Piensa... 🤔</p></div>}
      <div style={{display:'flex',flexDirection:'column',gap:10}}>{shuf.map((o,i)=><button key={i} className="btn btn-b" style={{textAlign:'left',fontSize:16,padding:'14px 16px'}} onClick={()=>{if(o===ex.op[0]){speak(ex.su,ex.id);setTimeout(()=>sPh('speak'),1400)}else{sCf('no');setTimeout(()=>sCf(null),1100)}}}>{o}</button>)}</div>
    </div>}
    {ph==='speak'&&<div className="af">
      <div className="card" style={{padding:18,marginBottom:14,background:'rgba(34,214,147,.06)',borderColor:'rgba(34,214,147,.2)'}}><p style={{fontSize:21,fontWeight:700,margin:0}}>"{ex.su}"</p></div>
      {msg&&<div className={sf==='ok'||sf==='pass'?'ab':'as'} style={{background:sf==='ok'?'rgba(34,214,147,.15)':sf==='pass'?'rgba(66,165,245,.15)':'rgba(255,112,67,.15)',borderRadius:12,padding:14,marginBottom:12}}><p style={{fontSize:16,fontWeight:700,margin:0,color:sf==='ok'?'#22D693':sf==='pass'?'#42A5F5':'#FF7043'}}>{msg}</p></div>}
      {!sf&&<div>{sr.on?<div style={{fontSize:16,color:'#FF4D6A',fontWeight:600,marginBottom:10}}><span className="ap" style={{display:'inline-block'}}>🎤</span> Te escucho...</div>:<button className="btn btn-g btn-big btn-full" onClick={goSpeak} style={{fontSize:20}}>🚀 ¡Vamos!</button>}</div>}
    </div>}
    <div style={{marginTop:12}}><button className="btn btn-gh" onClick={onSkip}>⏭️ Saltar</button></div>
  </div>
}

// ============ EXERCISE: FLUIDEZ ============
function ExFlu({ex,onOk,onSkip}){
  const[sf,sSf]=useState(null);const[att,sAtt]=useState(0);const[msg,sMsg]=useState('');const sr=useSR();
  useEffect(()=>{sSf(null);sAtt(0);sMsg('')},[ex]);
  useEffect(()=>{if(!sr.res)return;const b=Math.max(...sr.res.split('|').map(a=>score(a,ex.ph)));
    if(b>=2){sMsg(rnd(CHEERS));sSf('ok');setTimeout(onOk,1800)}
    else{const na=att+1;sAtt(na);if(na>=2){sMsg(rnd(GOODS));sSf('pass');setTimeout(onOk,1800)}else{sMsg(rnd(ALMOSTS));sSf('re');setTimeout(()=>{sSf(null);sMsg('')},1800)}}},[sr.res]);
  function goSpeak(){speak(ex.ph,ex.id).then(()=>{sMsg('¡Ahora tú! 🎤');setTimeout(()=>sr.go(),400)})}
  return <div style={{textAlign:'center',padding:16}}>
    <div style={{fontSize:56,marginBottom:12}}>{ex.em}</div>
    <div className="card" style={{padding:18,marginBottom:16,background:'rgba(171,71,188,.06)',borderColor:'rgba(171,71,188,.2)'}}><p style={{fontSize:21,fontWeight:700,margin:0,lineHeight:1.4}}>"{ex.ph}"</p></div>
    {msg&&<div className={sf==='ok'||sf==='pass'?'ab':'as'} style={{background:sf==='ok'?'rgba(34,214,147,.15)':sf==='pass'?'rgba(66,165,245,.15)':'rgba(255,112,67,.15)',borderRadius:12,padding:14,marginBottom:12}}><p style={{fontSize:16,fontWeight:700,margin:0,color:sf==='ok'?'#22D693':sf==='pass'?'#42A5F5':'#FF7043'}}>{msg}</p></div>}
    {!sf&&<div>{sr.on?<div style={{fontSize:16,color:'#FF4D6A',fontWeight:600,marginBottom:10}}><span className="ap" style={{display:'inline-block'}}>🎤</span> Te escucho...</div>:<button className="btn btn-g btn-big btn-full" onClick={goSpeak} style={{fontSize:20}}>🚀 ¡Vamos!</button>}</div>}
    <div style={{marginTop:12}}><button className="btn btn-gh" onClick={onSkip}>⏭️ Saltar</button></div>
  </div>
}

// ============ MAIN APP ============
export default function App(){
  const[profs,setProfs]=useState([]);const[user,setUser]=useState(null);const[scr,setScr]=useState('login');const[ov,setOv]=useState(null);
  const[queue,setQ]=useState([]);const[idx,setIdx]=useState(0);const[st,setSt]=useState({ok:0,sk:0});const[conf,setConf]=useState(false);
  const[creating,setCreating]=useState(false);const[fn,setFn]=useState('');const[fa,setFa]=useState('');const[fav,setFav]=useState(AVS[0]);const[flv,setFlv]=useState(1);const[fsex,setFsex]=useState('m');
  const[ptab,setPtab]=useState('config');const[pp,setPp]=useState('');const[pg,setPg]=useState(8);const[pm,setPm]=useState(30);
  const[pi,setPi]=useState('');const[pe,setPe]=useState(false);

  function getRem(){if(!user)return 0;const g=user.goal||8;const d=(user.hist||[]).filter(h=>h.dt===tdy()).reduce((s,h)=>s+h.ok,0);return Math.max(0,g-d)}

  function buildQ(u){
    const goal=u.goal||8,done=(u.hist||[]).filter(h=>h.dt===tdy()).reduce((s,h)=>s+h.ok,0),need=Math.max(goal-done,4);
    const uLv=u.maxLv||u.level||1,seen=u.seen||[];
    let pool=EX.filter(e=>e.lv<=uLv&&!seen.includes(e.id));
    if(pool.length<need){u.seen=[];pool=EX.filter(e=>e.lv<=uLv)}
    const rev=pool.filter(e=>needsRev(e.id,u)),fresh=pool.filter(e=>!(u.srs&&u.srs[e.id])),rest=pool.filter(e=>!rev.includes(e)&&!fresh.includes(e));
    const sh=a=>[...a].sort(()=>Math.random()-.5);
    let sel=[...sh(rev).slice(0,Math.ceil(need*.6)),...sh(fresh).slice(0,Math.ceil(need*.3)),...sh(rest).slice(0,Math.ceil(need*.1))];
    while(sel.length<need){const r=pool.filter(e=>!sel.includes(e));if(!r.length)break;sel.push(r[Math.floor(Math.random()*r.length)])}
    return sel.slice(0,need).sort(()=>Math.random()-.5);
  }
  function startGame(){const q=buildQ(user);setQ(q);setIdx(0);setSt({ok:0,sk:0});setScr('game')}
  function saveP(u){const uLv=u.maxLv||u.level||1;const curLvExs=EX.filter(e=>e.lv===uLv);const mas=curLvExs.filter(e=>u.srs&&u.srs[e.id]&&u.srs[e.id].lv>=3).length;if(curLvExs.length>0&&mas/curLvExs.length>=.8&&uLv<5)u.maxLv=uLv+1;u.level=u.maxLv||u.level||1;setProfs(p=>p.map(x=>x.id===u.id?u:x))}
  function onCorrect(){setConf(true);setTimeout(()=>setConf(false),2400);const e=queue[idx];const up=srsUp(e.id,true,user);if(!up.seen)up.seen=[];if(!up.seen.includes(e.id))up.seen.push(e.id);setUser(up);saveP(up);const ns={ok:st.ok+1,sk:st.sk};setSt(ns);setTimeout(()=>goNext(ns),300)}
  function onSkip(){const e=queue[idx];const up=srsUp(e.id,false,user);if(!up.seen)up.seen=[];if(!up.seen.includes(e.id))up.seen.push(e.id);setUser(up);saveP(up);const ns={ok:st.ok,sk:st.sk+1};setSt(ns);goNext(ns)}
  function goNext(s){if(idx+1>=queue.length)finish(s);else setIdx(idx+1)}
  function finish(s){const f=s||st;const rec={ok:f.ok,sk:f.sk,dt:tdy()};const up={...user,hist:[...(user.hist||[]),rec]};setUser(up);saveP(up);setOv('done')}
  function tryExit(){if(getRem()>0&&user.pin){setOv('pin');setPi('')}else setScr('goals')}
  const cur=queue[idx],area=cur?AREAS.find(a=>a.id===cur.a):null;

  return <div>
    <style>{CSS}</style>
    <Confetti show={conf}/>

    {ov==='pin'&&<div className="ov"><div className="ovp">
      <div style={{fontSize:36,marginBottom:10}}>🔒</div><p style={{fontSize:17,fontWeight:600,margin:'0 0 6px'}}>¡Todavía no!</p><p style={{fontSize:14,color:'rgba(255,255,255,.38)',margin:'0 0 16px'}}>Termina los ejercicios o pide el PIN</p>
      <input className="inp" value={pi} onChange={e=>setPi(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="· · · ·" style={{textAlign:'center',fontSize:26,letterSpacing:14,borderColor:pe?'#FF4D6A':'rgba(255,255,255,.09)',animation:pe?'shake .45s':'none'}}/>
      <div style={{display:'flex',gap:8,marginTop:14}}><button className="btn btn-gh" style={{flex:1}} onClick={()=>setOv(null)}>Volver</button><button className="btn btn-g" style={{flex:1}} disabled={pi.length<4} onClick={()=>{if(pi===user.pin){setOv(null);setScr('goals')}else{setPe(true);setPi('');setTimeout(()=>setPe(false),1500)}}}>Salir</button></div>
    </div></div>}

    {ov==='done'&&<div className="ov"><div className="ovp ab">{(()=>{const rem=getRem()-st.ok,tot=st.ok+st.sk,pct=tot>0?Math.round(st.ok/tot*100):0;return <div>
      <div style={{fontSize:48,marginBottom:6}}>{rem<=0?'🏆':'⭐'}</div><p style={{fontSize:19,color:'#FFD54F',fontWeight:700,margin:'0 0 14px'}}>{rem<=0?'¡MISIÓN CUMPLIDA!':'¡Buen trabajo!'}</p>
      <div style={{display:'flex',justifyContent:'space-around',marginBottom:18}}><div><div style={{fontSize:26,color:'#22D693',fontWeight:700}}>{st.ok}</div><div style={{fontSize:12,color:'rgba(255,255,255,.38)'}}>Bien</div></div><div><div style={{fontSize:26,color:'#42A5F5',fontWeight:700}}>{pct}%</div><div style={{fontSize:12,color:'rgba(255,255,255,.38)'}}>Acierto</div></div></div>
      {rem<=0&&<p style={{fontSize:15,color:'#22D693',fontWeight:600,margin:'0 0 14px'}}>🎮 ¡Ya puedes usar la tablet!</p>}
      <button className={'btn btn-big btn-full '+(rem<=0?'btn-g':'btn-b')} onClick={()=>{setOv(null);setScr('goals')}}>{rem<=0?'¡Salir! 🎉':'Seguir →'}</button>
    </div>})()}</div></div>}

    {ov==='parent'&&user&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'linear-gradient(165deg,#080C18,#0E1428)',overflowY:'auto',zIndex:100,padding:16}}>
      <div style={{maxWidth:420,margin:'0 auto'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><p style={{fontSize:18,color:'#FFD54F',fontWeight:700,margin:0}}>👨‍👩‍👦 Panel de Padres</p><button className="btn btn-gh" style={{padding:'7px 12px',fontSize:12}} onClick={()=>setOv(null)}>✕</button></div>
      <div className="tabs" style={{marginBottom:16}}>{['config','stats','srs'].map(t=><button key={t} className={'tab'+(ptab===t?' on':'')} onClick={()=>setPtab(t)}>{t==='config'?'⚙️':t==='stats'?'📊':'🧠'}</button>)}</div>
      {ptab==='config'&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
        <div className="card"><p style={{fontSize:14,fontWeight:600,margin:'0 0 8px'}}>🔒 PIN de salida</p><input className="inp" value={pp} onChange={e=>setPp(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="1234" style={{textAlign:'center',fontSize:22,letterSpacing:10}}/></div>
        <div className="card"><p style={{fontSize:14,fontWeight:600,margin:'0 0 8px'}}>🎯 Ejercicios/sesión: <span style={{color:'#22D693'}}>{pg}</span></p><input type="range" min="4" max="20" value={pg} onChange={e=>setPg(+e.target.value)} style={{width:'100%',accentColor:'#22D693'}}/></div>
        <div className="card"><p style={{fontSize:14,fontWeight:600,margin:'0 0 8px'}}>⏱️ Tiempo máximo: <span style={{color:'#42A5F5'}}>{pm} min</span></p><input type="range" min="10" max="45" step="5" value={pm} onChange={e=>setPm(+e.target.value)} style={{width:'100%',accentColor:'#42A5F5'}}/></div>
        <button className="btn btn-g btn-big btn-full" onClick={()=>{const up={...user,pin:pp,goal:pg,maxMin:pm};setUser(up);saveP(up);setOv(null)}}>💾 Guardar</button>
      </div>}
      {ptab==='stats'&&(()=>{const ss=user.hist||[],tc=ss.reduce((s,h)=>s+h.ok,0),ta=ss.reduce((s,h)=>s+h.ok+h.sk,0),pct=ta>0?Math.round(tc/ta*100):0;return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[{l:'Sesiones',v:ss.length,c:'#22D693'},{l:'Aciertos',v:tc,c:'#42A5F5'},{l:'% Acierto',v:pct+'%',c:'#FFD54F'},{l:'Total',v:ta,c:'#AB47BC'}].map((s,i)=><div key={i} className="sbox"><div style={{fontSize:22,color:s.c,fontWeight:700}}>{s.v}</div><div style={{fontSize:12,color:'rgba(255,255,255,.38)',marginTop:3}}>{s.l}</div></div>)}
      </div>})()}
      {ptab==='srs'&&(()=>{const mas=Object.values(user.srs||{}).filter(s=>s.lv>=4).length,lrn=Object.values(user.srs||{}).filter(s=>s.lv>0&&s.lv<4).length,nw=EX.length-mas-lrn;return <div style={{textAlign:'center',padding:'16px 0'}}>
        <div style={{display:'flex',justifyContent:'center',gap:18}}>{[{l:'Dominadas',v:mas,c:'#22D693'},{l:'Aprendiendo',v:lrn,c:'#FFD54F'},{l:'Nuevas',v:nw,c:'#AB47BC'}].map((s,i)=><div key={i}><div style={{position:'relative',display:'inline-block'}}><Ring p={s.v/EX.length} sz={75} c={s.c}/><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:18,color:s.c,fontWeight:700}}>{s.v}</div></div><div style={{fontSize:12,color:'rgba(255,255,255,.38)',marginTop:4}}>{s.l}</div></div>)}</div>
        <p style={{fontSize:13,color:'rgba(255,255,255,.38)',marginTop:16}}>Lo que domina desaparece. Lo que falla se repite.</p>
      </div>})()}
    </div></div>}

    {scr==='login'&&<div className="af" style={{textAlign:'center',padding:'20px 0'}}>
      <div style={{fontSize:44,marginBottom:4,filter:'drop-shadow(0 4px 16px rgba(34,214,147,.4))'}}>🗣️</div>
      <h1 style={{fontSize:32,color:'#22D693',margin:'0 0 2px',letterSpacing:-1}}>Toki</h1>
      <p style={{color:'rgba(255,255,255,.38)',fontSize:14,margin:'0 0 28px',fontStyle:'italic'}}>Aprende a decirlo</p>
      <p style={{color:'rgba(255,255,255,.15)',fontSize:10,position:'fixed',bottom:8,left:0,right:0,textAlign:'center',margin:0}}>© 2026 Toki · Aprende a decirlo — Diego Aroca</p>
      {profs.length>0&&!creating&&<div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>{profs.map(p=><button key={p.id} className="profcard" onClick={()=>{setUser(p);setPp(p.pin||'');setPg(p.goal||8);setPm(p.maxMin||30);setVoiceProfile(p.age,p.sex);setScr('goals')}}>
        <div style={{fontSize:32}}>{p.av}</div><div style={{flex:1}}><div style={{fontSize:18,fontWeight:600}}>{p.name}</div><div style={{fontSize:13,color:'rgba(255,255,255,.38)'}}>{p.age} años · Nivel {p.maxLv||p.level||1}</div></div>
      </button>)}</div>}
      {!creating?<button className="btn btn-p btn-big btn-full" onClick={()=>setCreating(true)}>➕ Nuevo Jugador</button>:
      <div className="card af" style={{padding:20,textAlign:'left'}}>
        <p style={{fontSize:16,color:'#FFD54F',textAlign:'center',margin:'0 0 14px'}}>Nuevo Jugador</p>
        <label style={{fontSize:13,color:'rgba(255,255,255,.38)'}}>Nombre</label>
        <input className="inp" value={fn} onChange={e=>setFn(e.target.value)} placeholder="Ej: Guillermo" style={{marginBottom:12,marginTop:5}}/>
        <label style={{fontSize:13,color:'rgba(255,255,255,.38)'}}>Edad</label>
        <input className="inp" value={fa} onChange={e=>setFa(e.target.value.replace(/\D/g,''))} type="tel" placeholder="12" style={{marginBottom:12,marginTop:5}}/>
        <label style={{fontSize:13,color:'rgba(255,255,255,.38)'}}>Sexo (para adaptar la voz)</label>
        <div style={{display:'flex',gap:8,margin:'8px 0 12px'}}>{[['m','👦 Chico'],['f','👧 Chica']].map(([v,l])=><button key={v} onClick={()=>setFsex(v)} style={{flex:1,padding:'12px 0',borderRadius:10,border:'2px solid '+(fsex===v?'#22D693':'rgba(255,255,255,.09)'),background:fsex===v?'rgba(34,214,147,.15)':'rgba(255,255,255,.03)',color:fsex===v?'#22D693':'rgba(255,255,255,.38)',fontFamily:"'Fredoka'",fontWeight:600,fontSize:15,cursor:'pointer'}}>{l}</button>)}</div>
        <label style={{fontSize:13,color:'rgba(255,255,255,.38)'}}>Nivel de dificultad</label>
        <div style={{display:'flex',gap:6,margin:'8px 0 12px'}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setFlv(n)} style={{flex:1,padding:'12px 0',borderRadius:8,border:'2px solid '+(flv===n?'#22D693':'rgba(255,255,255,.09)'),background:flv===n?'rgba(34,214,147,.15)':'rgba(255,255,255,.03)',color:flv===n?'#22D693':'rgba(255,255,255,.38)',fontFamily:"'Fredoka'",fontWeight:600,fontSize:15,cursor:'pointer'}}>{n}</button>)}</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,.25)',marginBottom:12,textAlign:'center'}}>{flv===1?'Palabras y frases cortas':flv===2?'Frases del día a día':flv===3?'Relaciones y situaciones':flv===4?'Autonomía completa':'Expresión personal rica'}</div>
        <label style={{fontSize:13,color:'rgba(255,255,255,.38)'}}>🔒 PIN de salida (opcional)</label>
        <p style={{fontSize:11,color:'rgba(255,255,255,.2)',margin:'2px 0 6px'}}>Si lo pones, no podrá salir sin completar</p>
        <input className="inp" value={pp} onChange={e=>setPp(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="Vacío si no quieres PIN" style={{marginBottom:12,textAlign:'center',fontSize:20,letterSpacing:10}}/>
        <label style={{fontSize:13,color:'rgba(255,255,255,.38)'}}>Avatar</label>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',justifyContent:'center',margin:'8px 0 16px'}}>{AVS.map(a=><button key={a} className={'avbtn'+(fav===a?' on':'')} onClick={()=>setFav(a)}>{a}</button>)}</div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-gh" style={{flex:1}} onClick={()=>setCreating(false)}>Cancelar</button>
          <button className="btn btn-g" style={{flex:2}} disabled={!fn.trim()||!fa} onClick={()=>{
            const p={id:Date.now()+'',name:cap(fn.trim()),age:+fa,sex:fsex,av:fav,hist:[],srs:{},level:flv,maxLv:flv,pin:pp,goal:8,maxMin:30,seen:[]};
            setProfs(prev=>[...prev,p]);setUser(p);setCreating(false);setFn('');setFa('');setPp('');setVoiceProfile(+fa,fsex);setScr('goals');
          }}>Crear ✓</button>
        </div>
      </div>}
    </div>}

    {scr==='goals'&&user&&<div className="af">
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <button style={{background:'none',border:'none',color:'rgba(255,255,255,.38)',fontSize:14}} onClick={()=>{setUser(null);setScr('login')}}>← Cambiar</button>
        <button style={{background:'none',border:'none',color:'rgba(255,255,255,.38)',fontSize:14}} onClick={()=>{setPp(user.pin||'');setPg(user.goal||8);setPm(user.maxMin||30);setPtab('config');setOv('parent')}}>⚙️ Padres</button>
      </div>
      <div style={{textAlign:'center',padding:'16px 0'}}>
        <div style={{fontSize:44,marginBottom:6}}>{user.av}</div>
        <h2 style={{fontSize:22,margin:'0 0 2px'}}>¡Hola {user.name}!</h2>
        <p style={{fontSize:13,color:'rgba(255,255,255,.38)',margin:'0 0 4px'}}>Nivel {user.maxLv||user.level||1} de 5</p>
        {(()=>{const rem=getRem(),goal=user.goal||8,done=goal-rem;
          if(rem>0)return <div><div style={{background:'rgba(34,214,147,.05)',border:'2px solid rgba(34,214,147,.15)',borderRadius:16,padding:22,margin:'18px 0'}}>
            <div style={{position:'relative',display:'inline-block',marginBottom:10}}><Ring p={done/goal} sz={90} sw={7}/><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:26,color:'#22D693',fontWeight:700}}>{rem}</div></div>
            <p style={{fontSize:16,fontWeight:600,margin:'0 0 3px'}}>Te faltan <span style={{color:'#22D693'}}>{rem} ejercicios</span></p>
            <p style={{fontSize:14,color:'rgba(255,255,255,.38)',margin:0}}>¡Termínalos y la tablet es tuya! 🎮</p></div>
            <button className="btn btn-g btn-big btn-full" style={{fontSize:18}} onClick={startGame}>🚀 ¡A por ello!</button></div>;
          return <div><div style={{background:'rgba(255,213,79,.05)',border:'2px solid rgba(255,213,79,.15)',borderRadius:16,padding:22,margin:'18px 0'}}>
            <div style={{fontSize:48,marginBottom:6}}>🏆</div><p style={{fontSize:18,color:'#FFD54F',fontWeight:700,margin:'0 0 6px'}}>¡SESIÓN COMPLETADA!</p><p style={{fontSize:14,color:'rgba(255,255,255,.38)',margin:0}}>¡Crack!</p></div>
            <button className="btn btn-b btn-full" onClick={startGame}>Practicar más</button></div>
        })()}
      </div>
    </div>}

    {scr==='game'&&cur&&<div className="af">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <button style={{background:'none',border:'none',color:'rgba(255,255,255,.38)',fontSize:14}} onClick={tryExit}>✕ Salir</button>
        <Tag c="#22D693" ch={`${idx+1}/${queue.length}`}/>
      </div>
      <div className="pbar" style={{marginBottom:10}}><div className="pfill" style={{width:(idx/queue.length*100)+'%'}}/></div>
      <Tower placed={st.ok} total={queue.length}/>
      <div style={{textAlign:'center',margin:'8px 0 4px'}}>
        <Tag c={cur.ty==='frases'?'#22D693':cur.ty==='sit'?'#42A5F5':'#AB47BC'} ch={cur.ty==='frases'?'🧱 Haz la Frase':cur.ty==='sit'?'💬 ¿Qué Dices?':'🎤 Dilo Seguido'}/>{' '}
        {area&&<Tag c="rgba(255,255,255,.38)" ch={area.ic+' '+area.n}/>}
      </div>
      <div className="card" style={{marginTop:6}}>
        {cur.ty==='frases'&&<ExFrases ex={cur} onOk={onCorrect} onSkip={onSkip}/>}
        {cur.ty==='sit'&&<ExSit ex={cur} onOk={onCorrect} onSkip={onSkip}/>}
        {cur.ty==='flu'&&<ExFlu ex={cur} onOk={onCorrect} onSkip={onSkip}/>}
      </div>
    </div>}
  </div>
}
