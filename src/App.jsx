// ============================================================
// TOKI · Aprende a decirlo
// © 2026 Diego Aroca. Todos los derechos reservados.
// ============================================================
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AREAS, EX } from './exercises.js'

const BG='#0B1D3A',BG2='#122548',BG3='#1A3060',GOLD='#F0C850',GREEN='#2ECC71',RED='#E74C3C',BLUE='#3498DB',PURPLE='#9B59B6',TXT='#ECF0F1',DIM='#7F8FA6',CARD='#152D55',BORDER='#1E3A6A';

const CSS=`
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;font-family:'Fredoka',sans-serif;background:${BG};color:${TXT};min-height:100vh}
button{font-family:'Fredoka',sans-serif;touch-action:manipulation;cursor:pointer}
input{font-family:'Fredoka',sans-serif}
input::placeholder{color:${DIM}}
#root{max-width:500px;margin:0 auto;padding:16px 20px}
.btn{display:block;width:100%;border:3px solid;border-radius:14px;padding:18px 24px;font-weight:700;font-size:20px;transition:transform .1s;color:#fff;text-align:center}
.btn:active{transform:scale(.93)!important}
.btn:disabled{opacity:.35;cursor:not-allowed}
.btn-g{background:${GREEN};border-color:#27ae60;box-shadow:4px 4px 0 #1e8449}
.btn-b{background:${BLUE};border-color:#2980b9;box-shadow:4px 4px 0 #1a5276}
.btn-p{background:${PURPLE};border-color:#7d3c98;box-shadow:4px 4px 0 #6c3483}
.btn-o{background:#E67E22;border-color:#d35400;box-shadow:4px 4px 0 #a04000}
.btn-gold{background:${GOLD};border-color:#d4ac0d;box-shadow:4px 4px 0 #b7950b;color:#1a1a2e}
.btn-ghost{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);box-shadow:none;color:${DIM};font-size:16px}
.btn-half{display:inline-block;width:48%;font-size:15px;padding:12px 0}
.btn-word{display:inline-block;width:auto;padding:12px 18px;font-size:20px}
.card{background:${CARD};border:2px solid ${BORDER};border-radius:18px;padding:20px}
.inp{width:100%;padding:16px;background:${BG3};border:2px solid ${BORDER};border-radius:12px;color:${TXT};font-size:20px;outline:none}
.ws{min-width:52px;height:50px;display:flex;align-items:center;justify-content:center;padding:0 14px;border-radius:12px;font-size:20px;font-weight:700;transition:all .2s}
.ws-e{background:rgba(255,255,255,.04);border:2.5px dashed rgba(255,255,255,.18);color:rgba(255,255,255,.18)}
.ws-f{background:${GREEN};border:2.5px solid #27ae60;color:#0B1D3A;box-shadow:2px 2px 0 #1e8449}
.pbar{height:7px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden}
.pfill{height:100%;background:linear-gradient(90deg,${GREEN},${BLUE});border-radius:4px;transition:width .5s}
.ov{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;background:rgba(0,0,0,.92)}
.ovp{background:${BG2};border:2px solid ${GOLD}55;border-radius:20px;padding:32px 24px;max-width:400px;width:100%;text-align:center}
.profcard{display:flex;align-items:center;gap:16px;padding:18px 22px;width:100%;text-align:left;background:${CARD};border:2px solid ${BORDER};border-radius:16px;color:${TXT}}
.avbtn{font-size:30px;width:52px;height:52px;border-radius:14px;border:2px solid ${BORDER};background:${BG3}}
.avbtn.on{border-color:${GOLD};background:${GOLD}22}
.tabs{display:flex;gap:4px;background:${BG3};border-radius:12px;padding:4px}
.tab{flex:1;padding:12px;border-radius:10px;border:none;font-weight:700;font-size:15px;background:transparent;color:${DIM}}
.tab.on{background:${GOLD};color:#1a1a2e}
.sbox{background:${CARD};border:2px solid ${BORDER};border-radius:12px;padding:16px;text-align:center}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounceIn{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
@keyframes confDrop{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes glow{0%,100%{filter:drop-shadow(0 0 8px ${GOLD}66)}50%{filter:drop-shadow(0 0 20px ${GOLD}aa)}}
.af{animation:fadeIn .4s ease-out}.ab{animation:bounceIn .45s}.ap{animation:pulse 1.4s infinite}.as{animation:shake .4s}
`;

// ===== UTILS =====
function lev(a,b){const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}
function score(said,tgt){const c=s=>s.toLowerCase().replace(/[^a-záéíóúñü\s]/g,'').trim();const a=c(said),b=c(tgt);if(a===b)return 3;const sw=a.split(/\s+/),tw=b.split(/\s+/);let mt=0;tw.forEach(t=>{if(sw.some(s=>s===t||lev(s,t)<=1))mt++});const r=mt/tw.length;return r>=.8?3:r>=.55?2:r>=.3?1:0}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}

// ===== VOICE =====
let voiceProfile={age:12,sex:'m'},cachedVoice=null,audioUnlocked=false;
function setVoiceProfile(a,s){voiceProfile={age:a||12,sex:s||'m'};cachedVoice=null;pickVoice()}
function getVP(){const a=voiceProfile.age,s=voiceProfile.sex;if(a<=9)return{rate:.6,pitch:s==='f'?1.35:1.2};if(a<=13)return{rate:.65,pitch:s==='f'?1.15:.92};if(a<=17)return{rate:.7,pitch:s==='f'?1.05:.82};return{rate:.75,pitch:s==='f'?1.0:.78}}
function pickVoice(){const v=window.speechSynthesis?window.speechSynthesis.getVoices():[];const es=v.filter(x=>x.lang&&x.lang.startsWith('es'));if(!es.length)return;const f=/elena|conchita|lucia|miren|monica|paulina|female|femenin|mujer|helena/i,m=/jorge|enrique|pablo|andres|diego|male|masculin|hombre/i;cachedVoice=voiceProfile.sex==='f'?es.find(x=>f.test(x.name))||es[0]:es.find(x=>m.test(x.name))||es[0]}
if(window.speechSynthesis){window.speechSynthesis.onvoiceschanged=pickVoice;setTimeout(pickVoice,200);setTimeout(pickVoice,800)}
function unlockAudio(){if(audioUnlocked)return;audioUnlocked=true;if(window.speechSynthesis){const u=new SpeechSynthesisUtterance('');u.volume=0;window.speechSynthesis.speak(u)}}
function speak(text,exId){return new Promise(res=>{if(exId){const a=new Audio(`/audio/${voiceProfile.sex}/${exId}.mp3`);a.onended=res;a.onerror=()=>tts(text).then(res);a.play().catch(()=>tts(text).then(res));return}tts(text).then(res)})}
function tts(text){return new Promise(res=>{if(!window.speechSynthesis){res();return}window.speechSynthesis.cancel();if(!cachedVoice)pickVoice();const p=getVP(),u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=p.rate;u.pitch=p.pitch;if(cachedVoice)u.voice=cachedVoice;u.onend=res;u.onerror=res;window.speechSynthesis.speak(u);setTimeout(res,6000)})}

// ===== MIC =====
let gRec=null,gRecOk=false;
(function(){const S=window.SpeechRecognition||window.webkitSpeechRecognition;if(!S)return;gRec=new S();gRec.lang='es-ES';gRec.continuous=false;gRec.interimResults=false;gRec.maxAlternatives=5;gRecOk=true})();
function useSR(){
  const[on,sOn]=useState(false);const[res,sRes]=useState('');
  useEffect(()=>{if(!gRec)return;gRec.onresult=e=>{const a=[];for(let i=0;i<e.results[0].length;i++)a.push(e.results[0][i].transcript.toLowerCase().trim());sRes(a.join('|'));sOn(false)};gRec.onerror=()=>sOn(false);gRec.onend=()=>sOn(false)});
  const go=useCallback(()=>{if(!gRec)return;sRes('');sOn(true);try{gRec.stop()}catch(e){}setTimeout(()=>{try{gRec.start()}catch(e){sOn(false)}},150)},[]);
  return{on,res,ok:gRecOk,go}
}

// ===== SRS =====
function srsUp(id,ok,u){const d={...u};if(!d.srs)d.srs={};if(!d.srs[id])d.srs[id]={lv:0,t:0};d.srs[id].t=Date.now();d.srs[id].lv=ok?Math.min(d.srs[id].lv+1,5):Math.max(d.srs[id].lv-1,0);return d}
function needsRev(id,u){const s=u.srs&&u.srs[id];if(!s)return true;const g=[0,30000,120000,600000,3600000,86400000];return(Date.now()-s.t)>=g[Math.min(s.lv,5)]}

// ===== MESSAGES =====
const AVS=['🧑‍🚀','🦸','🧙','🐉','🤖','🦊','🎮','⚡','🌟','🐸'];
const CLS=[GREEN,BLUE,GOLD,PURPLE,RED,'#E67E22',GREEN];
const tdy=()=>new Date().toLocaleDateString('es-ES');
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const PROMPT=['¡Ahora tú!','¡Te toca!','¡Repite!','¡Vamos, dilo tú!','¡Te toca a ti!','¡Venga, dilo!','¡A ver cómo suena!','¡Dale!'];
const BUILD_OK=['¡Sí señor!','¡Eso es!','¡Bien hecho!','¡Perfecto!','¡Así se hace!','¡Genial!'];
const PERFECT_M=['¡Muy bien campeón! 🌟','¡Espectacular campeón! 🏆','¡Increíble campeón! ✨','¡Bravo campeón! 🎉'];
const PERFECT_F=['¡Muy bien campeona! 🌟','¡Espectacular campeona! 🏆','¡Increíble campeona! ✨','¡Bravo campeona! 🎉'];
const GOOD_MSG=['¡Bien hecho! 👏','¡Genial! ⭐','¡Muy bien! 🔥','¡Así se habla! 💪','¡Fenomenal! ✨'];
const RETRY_MSG=['Inténtalo otra vez','Escucha bien y repite','Otra vez, tú puedes','Casi casi, una más'];
const FAIL_MSG=['Poco a poco lo conseguirás 💪','No te rindas, otro día te saldrá 🌟','¡Ánimo, vas mejorando! ⭐','Tranquilo, la próxima vez seguro 👏'];
const IDLE=['¿Estás ahí? 👀','','','Me aburro... 😢 ¡Juega conmigo!'];
function Confetti({show}){const[pts,sP]=useState([]);useEffect(()=>{if(show){sP(Array.from({length:24},(_,i)=>({i,x:Math.random()*100,c:CLS[i%7],s:6+Math.random()*10,d:Math.random()*.5,du:.8+Math.random()*.8})));setTimeout(()=>sP([]),2800)}},[show]);if(!pts.length)return null;return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:999}}>{pts.map(p=><div key={p.i} style={{position:'absolute',left:p.x+'%',top:'-5%',width:p.s,height:p.s,background:p.c,borderRadius:3,animation:`confDrop ${p.du}s ease-in ${p.d}s forwards`}}/>)}</div>}
function Ring({p,sz=80,sw=6,c=GREEN}){const r=(sz-sw)/2,ci=2*Math.PI*r;return <svg width={sz} height={sz} style={{transform:'rotate(-90deg)'}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={BG3} strokeWidth={sw}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={ci-(p||0)*ci} strokeLinecap="round" style={{transition:'stroke-dashoffset .6s'}}/></svg>}
function Tower({placed,total}){const cells=21,filled=Math.min(Math.floor((placed/Math.max(total,1))*cells),cells);return <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,maxWidth:220,margin:'0 auto'}}>{Array.from({length:cells},(_,i)=>{const row=Math.floor(i/7),inv=(2-row)*7+(i%7),on=inv<filled;return <div key={i} style={{aspectRatio:'1',borderRadius:4,transition:'all .3s cubic-bezier(.34,1.56,.64,1)',background:on?CLS[inv%7]:BG3+'44',border:on?'2px solid rgba(0,0,0,.2)':'2px solid '+BG3,transform:on?'scale(1)':'scale(.75)',opacity:on?1:.3}}/>})}</div>}

// ===== IDLE DETECTOR =====
function useIdle(name,active){
  const[msg,sMsg]=useState('');const step=useRef(0);const timer=useRef(null);
  useEffect(()=>{step.current=0;sMsg('');clearInterval(timer.current);
    if(!active)return;
    timer.current=setInterval(()=>{const s=step.current;
      if(s===0)sMsg('¿Estás ahí? 👀');
      else if(s===1){sMsg((name||'¡Hola')+'?? 👋');tts((name||'hola')+'?')}
      else if(s===2)sMsg('¿Hola? ¿Hay alguien? 🤔');
      else if(s>=3){sMsg('Me aburro... 😢 ¡Juega conmigo!');tts('juega conmigo')}
      step.current=s+1;
    },6000);
    return()=>clearInterval(timer.current);
  },[active,name]);
  function poke(){step.current=0;sMsg('');clearInterval(timer.current)}
  return{idleMsg:msg,poke}
}

// ===== SPEAK PANEL — fully automatic =====
function SpeakPanel({text,exId,onOk,onSkip,sex,name}){
  const[sf,sSf]=useState(null);const[att,sAtt]=useState(0);const[msg,sMsg]=useState('');const[started,setStarted]=useState(false);
  const sr=useSR();
  const{idleMsg,poke}=useIdle(name,!sf&&!sr.on&&started);

  useEffect(()=>{sSf(null);sAtt(0);sMsg('');setStarted(false);
    const t=setTimeout(()=>{unlockAudio();playAndListen()},800);
    return()=>clearTimeout(t)
  },[text,exId]);

  function playAndListen(){
    speak(text,exId).then(()=>{
      const p=rnd(PROMPT);sMsg(p);tts(p).then(()=>{setStarted(true);setTimeout(()=>sr.go(),200)})
    })
  }

  useEffect(()=>{if(!sr.res||!started)return;poke();
    const b=Math.max(...sr.res.split('|').map(a=>score(a,text)));
    if(b>=3){const m=rnd(sex==='f'?PERFECT_F:PERFECT_M);sMsg(m);sSf('perfect');tts(m);setTimeout(onOk,2000)}
    else if(b>=2){const m=rnd(GOOD_MSG);sMsg(m);sSf('ok');tts(m);setTimeout(onOk,1500)}
    else{const na=att+1;sAtt(na);
      if(na>=2){const m=rnd(FAIL_MSG);sMsg(m);sSf('fail');tts(m);setTimeout(onSkip,2500)}
      else{const m=rnd(RETRY_MSG);sMsg(m);sSf('retry');tts(m).then(()=>{
        setTimeout(()=>{sSf(null);sMsg('');playAndListen()},800)
      })}
    }
  },[sr.res]);

  function hearAgain(){poke();unlockAudio();playAndListen()}
  const fbColor=sf==='perfect'?GOLD:sf==='ok'?GREEN:sf==='fail'?'#E67E22':RED;

  return <div style={{textAlign:'center'}} onClick={poke}>
    <div className="card" style={{padding:24,marginBottom:18,background:GREEN+'0C',borderColor:GREEN+'33'}}>
      <p style={{fontSize:28,fontWeight:700,margin:0,lineHeight:1.3}}>"{text}"</p>
    </div>
    {msg&&<div className={sf==='perfect'||sf==='ok'?'ab':sf==='retry'?'as':'af'} style={{background:fbColor+'22',borderRadius:14,padding:18,marginBottom:14}}>
      <p style={{fontSize:22,fontWeight:700,margin:0,color:fbColor}}>{msg}</p>
    </div>}
    {idleMsg&&!sf&&!msg&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:16,marginBottom:14}}>
      <p style={{fontSize:20,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p>
    </div>}
    {!sf&&sr.on&&<div style={{padding:20}}><span className="ap" style={{display:'inline-block',fontSize:56}}>🎤</span></div>}
    <div style={{display:'flex',gap:10,marginTop:16}}>
      <button className="btn btn-b btn-half" onClick={hearAgain}>🔊 Otra vez</button>
      <button className="btn btn-ghost btn-half" onClick={()=>{poke();onSkip()}}>⏭️ Saltar</button>
    </div>
  </div>
}

// ===== EXERCISE: FLUIDEZ =====
function ExFlu({ex,onOk,onSkip,sex,name}){
  return <div style={{textAlign:'center',padding:18}}>
    <div style={{fontSize:72,marginBottom:16,animation:'glow 3s infinite'}}>{ex.em}</div>
    <SpeakPanel text={ex.ph} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name}/>
  </div>
}

// ===== EXERCISE: HAZ LA FRASE =====
function ExFrases({ex,onOk,onSkip,sex,name}){
  const[ph,sPh]=useState('build');const[pl,sPl]=useState([]);const[av,sAv]=useState([]);const[bf,sBf]=useState(null);
  const words=useMemo(()=>ex.fu.replace(/[¿?¡!,\.]/g,'').split(/\s+/),[ex.fu]);
  const{idleMsg,poke}=useIdle(name,ph==='build'&&!bf);

  useEffect(()=>{sPh('build');sBf(null);
    const d=['el','un','muy','y','más','eso'].filter(w=>!words.map(x=>x.toLowerCase()).includes(w));
    sAv([...words,...d.slice(0,2)].sort(()=>Math.random()-.5).map((w,i)=>({w,i,u:false})));sPl(Array(words.length).fill(null))},[ex]);

  function place(item){poke();unlockAudio();const s=pl.findIndex(p=>p===null);if(s===-1)return;const np=[...pl];np[s]=item;sPl(np);sAv(a=>a.map(x=>x.i===item.i?{...x,u:true}:x));
    if(np.every(p=>p!==null)){const built=np.map(p=>p.w.toLowerCase()).join(' ');const target=words.map(w=>w.toLowerCase()).join(' ');
      if(built===target){sBf('ok');const m=rnd(BUILD_OK);tts(m).then(()=>speak(ex.fu,ex.id).then(()=>{const p=rnd(PROMPT);tts(p).then(()=>sPh('speak'))}))}
      else{sBf('no');setTimeout(()=>{sPl(Array(words.length).fill(null));sAv(a=>a.map(x=>({...x,u:false})));sBf(null)},1000)}}}
  function undo(){poke();let li=-1;pl.forEach((p,i)=>{if(p)li=i});if(li===-1)return;const it=pl[li];const np=[...pl];np[li]=null;sPl(np);sAv(a=>a.map(x=>x.i===it.i?{...x,u:false}:x))}

  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div style={{fontSize:72,marginBottom:16,animation:'glow 3s infinite'}}>{ex.em}</div>
    {ph==='build'&&<div className="af">
      <div className="card" style={{marginBottom:16,background:BLUE+'0C',borderColor:BLUE+'33'}}><p style={{fontSize:22,fontWeight:600,margin:0,lineHeight:1.4,color:BLUE}}>{ex.q}</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:16,minHeight:56}}>{pl.map((p,i)=><div key={i} className={'ws '+(p?'ws-f':'ws-e')}>{p?p.w:'___'}</div>)}</div>
      {bf==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginBottom:14}}><span style={{fontSize:36}}>⭐</span></div>}
      {bf==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,color:GOLD,fontWeight:700,margin:0}}>¡Casi! 💪</p></div>}
      {idleMsg&&!bf&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
      {!bf&&<div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',marginBottom:14}}>{av.filter(x=>!x.u).map(x=><button key={x.i} className="btn btn-b btn-word" onClick={()=>place(x)}>{x.w}</button>)}</div>}
      <div style={{display:'flex',gap:10}}>
        {!bf&&pl.some(p=>p)&&<button className="btn btn-o btn-half" onClick={undo}>↩️ Borrar</button>}
        <button className="btn btn-p btn-half" onClick={()=>{poke();unlockAudio();speak(ex.fu,ex.id)}}>🔊 Pista</button>
      </div>
      <div style={{marginTop:14}}><button className="btn btn-ghost" onClick={()=>{poke();onSkip()}}>⏭️ Saltar</button></div>
    </div>}
    {ph==='speak'&&<SpeakPanel text={ex.fu} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name}/>}
  </div>
}

// ===== EXERCISE: SITUACIONES =====
function ExSit({ex,onOk,onSkip,sex,name}){
  const[ph,sPh]=useState('choose');const[cf,sCf]=useState(null);
  const shuf=useMemo(()=>[...ex.op].sort(()=>Math.random()-.5),[ex]);
  const{idleMsg,poke}=useIdle(name,ph==='choose'&&!cf);
  useEffect(()=>{sPh('choose');sCf(null)},[ex]);
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div style={{fontSize:72,marginBottom:16}}>{ex.em}</div>
    <div className="card" style={{marginBottom:16,background:BLUE+'0C',borderColor:BLUE+'33'}}><p style={{fontSize:20,fontWeight:600,margin:0,lineHeight:1.4}}>{ex.si}</p></div>
    {ph==='choose'&&<div className="af">
      <p style={{fontSize:20,color:GOLD,fontWeight:700,margin:'0 0 14px'}}>¿Qué dirías?</p>
      {cf==='no'&&<div className="as" style={{background:RED+'22',borderRadius:12,padding:12,marginBottom:12}}><p style={{fontSize:17,color:GOLD,margin:0}}>Piensa... 🤔</p></div>}
      {idleMsg&&!cf&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {shuf.map((o,i)=><button key={i} className="btn btn-b" onClick={()=>{poke();unlockAudio();if(o===ex.op[0]){const m=rnd(BUILD_OK);tts(m).then(()=>speak(ex.su,ex.id).then(()=>{const p=rnd(PROMPT);tts(p).then(()=>sPh('speak'))}))}else{sCf('no');setTimeout(()=>sCf(null),1000)}}} style={{textAlign:'left',fontSize:18}}>{o}</button>)}
      </div>
      <div style={{marginTop:14}}><button className="btn btn-ghost" onClick={()=>{poke();onSkip()}}>⏭️ Saltar</button></div>
    </div>}
    {ph==='speak'&&<SpeakPanel text={ex.su} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name}/>}
  </div>
}

// ===== MAIN APP =====
export default function App(){
  const[profs,setProfs]=useState([]);const[user,setUser]=useState(null);const[scr,setScr]=useState('login');const[ov,setOv]=useState(null);
  const[queue,setQ]=useState([]);const[idx,setIdx]=useState(0);const[st,setSt]=useState({ok:0,sk:0});const[conf,setConf]=useState(false);
  const[creating,setCreating]=useState(false);const[fn,setFn]=useState('');const[fa,setFa]=useState('');const[fav,setFav]=useState(AVS[0]);const[flv,setFlv]=useState(1);const[fsex,setFsex]=useState('m');
  const[ptab,setPtab]=useState('config');const[pp,setPp]=useState('');const[pg,setPg]=useState(8);
  const[pi,setPi]=useState('');const[pe,setPe]=useState(false);
  const[consec,setConsec]=useState(0);const[showLvAdj,setShowLvAdj]=useState(false);

  function getRem(){if(!user)return 0;const g=user.goal||8;const d=(user.hist||[]).filter(h=>h.dt===tdy()).reduce((s,h)=>s+h.ok,0);return Math.max(0,g-d)}
  function buildQ(u){const goal=u.goal||8,done=(u.hist||[]).filter(h=>h.dt===tdy()).reduce((s,h)=>s+h.ok,0),need=Math.max(goal-done,4);const uLv=u.maxLv||u.level||1,seen=u.seen||[];let pool=EX.filter(e=>e.lv<=uLv&&!seen.includes(e.id));if(pool.length<need){u.seen=[];pool=EX.filter(e=>e.lv<=uLv)}const rev=pool.filter(e=>needsRev(e.id,u)),fresh=pool.filter(e=>!(u.srs&&u.srs[e.id])),rest=pool.filter(e=>!rev.includes(e)&&!fresh.includes(e));const sh=a=>[...a].sort(()=>Math.random()-.5);let sel=[...sh(rev).slice(0,Math.ceil(need*.6)),...sh(fresh).slice(0,Math.ceil(need*.3)),...sh(rest).slice(0,Math.ceil(need*.1))];while(sel.length<need){const r=pool.filter(e=>!sel.includes(e));if(!r.length)break;sel.push(r[Math.floor(Math.random()*r.length)])}return sel.slice(0,need).sort(()=>Math.random()-.5)}
  function startGame(){const q=buildQ(user);setQ(q);setIdx(0);setSt({ok:0,sk:0});setConsec(0);setScr('game')}
  function saveP(u){const uLv=u.maxLv||u.level||1;const cur=EX.filter(e=>e.lv===uLv);const mas=cur.filter(e=>u.srs&&u.srs[e.id]&&u.srs[e.id].lv>=3).length;if(cur.length>0&&mas/cur.length>=.8&&uLv<5)u.maxLv=uLv+1;u.level=u.maxLv||u.level||1;setProfs(p=>p.map(x=>x.id===u.id?u:x))}
  function onCorrect(){setConf(true);setConsec(0);setTimeout(()=>setConf(false),2400);const e=queue[idx];const up=srsUp(e.id,true,user);if(!up.seen)up.seen=[];if(!up.seen.includes(e.id))up.seen.push(e.id);setUser(up);saveP(up);setSt(s=>({ok:s.ok+1,sk:s.sk}));setTimeout(()=>{if(idx+1>=queue.length)finish({ok:st.ok+1,sk:st.sk});else setIdx(idx+1)},200)}
  function onSkip(){const e=queue[idx];const up=srsUp(e.id,false,user);if(!up.seen)up.seen=[];if(!up.seen.includes(e.id))up.seen.push(e.id);setUser(up);saveP(up);const nf=consec+1;setConsec(nf);setSt(s=>({ok:s.ok,sk:s.sk+1}));if(nf>=3&&(user.maxLv||user.level||1)>1){setShowLvAdj(true)}else{if(idx+1>=queue.length)finish({ok:st.ok,sk:st.sk+1});else setIdx(idx+1)}}
  function doLevelDown(){const up={...user,maxLv:Math.max(1,(user.maxLv||user.level||1)-1),level:Math.max(1,(user.maxLv||user.level||1)-1)};setUser(up);saveP(up);setShowLvAdj(false);setConsec(0);if(idx+1>=queue.length)finish(st);else setIdx(idx+1)}
  function finish(s){const f=s||st;const rec={ok:f.ok,sk:f.sk,dt:tdy()};const up={...user,hist:[...(user.hist||[]),rec]};setUser(up);saveP(up);setOv('done')}
  function tryExit(){if(getRem()>0&&user.pin){setOv('pin');setPi('')}else setScr('goals')}
  const cur=queue[idx];

  return <div onClick={unlockAudio}>
    <style>{CSS}</style>
    <Confetti show={conf}/>

    {showLvAdj&&<div className="ov"><div className="ovp">
      <div style={{fontSize:48,marginBottom:12}}>🤔</div>
      <p style={{fontSize:20,fontWeight:700,margin:'0 0 10px'}}>¿Quieres que bajemos el nivel?</p>
      <p style={{fontSize:15,color:DIM,margin:'0 0 20px'}}>Así será un poco más fácil</p>
      <div style={{display:'flex',gap:10}}><button className="btn btn-g" style={{flex:1}} onClick={doLevelDown}>Sí, bájalo</button><button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setShowLvAdj(false);setConsec(0);if(idx+1>=queue.length)finish(st);else setIdx(idx+1)}}>No, sigo así</button></div>
    </div></div>}

    {ov==='pin'&&<div className="ov"><div className="ovp">
      <div style={{fontSize:48,marginBottom:12}}>🔒</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px'}}>¡Todavía no!</p><p style={{fontSize:16,color:DIM,margin:'0 0 18px'}}>Termina los ejercicios o pide el PIN</p>
      <input className="inp" value={pi} onChange={e=>setPi(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="· · · ·" style={{textAlign:'center',fontSize:30,letterSpacing:16,borderColor:pe?RED:BORDER,animation:pe?'shake .4s':'none'}}/>
      <div style={{display:'flex',gap:10,marginTop:16}}><button className="btn btn-ghost" style={{flex:1}} onClick={()=>setOv(null)}>Volver</button><button className="btn btn-g" style={{flex:1}} disabled={pi.length<4} onClick={()=>{if(pi===user.pin){setOv(null);setScr('goals')}else{setPe(true);setPi('');setTimeout(()=>setPe(false),1500)}}}>Salir</button></div>
    </div></div>}

    {ov==='done'&&<div className="ov"><div className="ovp ab">{(()=>{const rem=getRem()-st.ok,tot=st.ok+st.sk,pct=tot>0?Math.round(st.ok/tot*100):0;return <div>
      <div style={{fontSize:64,marginBottom:8}}>{rem<=0?'🏆':'⭐'}</div><p style={{fontSize:24,color:GOLD,fontWeight:700,margin:'0 0 16px'}}>{rem<=0?'¡MISIÓN CUMPLIDA!':'¡Buen trabajo!'}</p>
      <div style={{display:'flex',justifyContent:'space-around',marginBottom:20}}><div><div style={{fontSize:32,color:GREEN,fontWeight:700}}>{st.ok}</div><div style={{fontSize:14,color:DIM}}>Bien</div></div><div><div style={{fontSize:32,color:BLUE,fontWeight:700}}>{pct}%</div><div style={{fontSize:14,color:DIM}}>Acierto</div></div></div>
      {rem<=0&&<p style={{fontSize:18,color:GREEN,fontWeight:700,margin:'0 0 16px'}}>🎮 ¡Ya puedes usar la tablet!</p>}
      <button className={'btn '+(rem<=0?'btn-gold':'btn-b')} onClick={()=>{setOv(null);setScr('goals')}} style={{fontSize:22}}>{rem<=0?'¡Salir! 🎉':'Seguir →'}</button>
    </div>})()}</div></div>}

    {ov==='parent'&&user&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:BG,overflowY:'auto',zIndex:100,padding:16}}>
      <div style={{maxWidth:500,margin:'0 auto'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}><p style={{fontSize:20,color:GOLD,fontWeight:700,margin:0}}>👨‍👩‍👦 Panel</p><button className="btn btn-ghost btn-half" style={{width:'auto',padding:'8px 16px'}} onClick={()=>setOv(null)}>✕</button></div>
      <div className="tabs" style={{marginBottom:18}}>{['config','stats','srs'].map(t=><button key={t} className={'tab'+(ptab===t?' on':'')} onClick={()=>setPtab(t)}>{t==='config'?'⚙️':t==='stats'?'📊':'🧠'}</button>)}</div>
      {ptab==='config'&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div className="card"><p style={{fontSize:16,fontWeight:700,margin:'0 0 10px'}}>🔒 PIN</p><input className="inp" value={pp} onChange={e=>setPp(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="1234" style={{textAlign:'center',fontSize:24,letterSpacing:12}}/></div>
        <div className="card"><p style={{fontSize:16,fontWeight:700,margin:'0 0 10px'}}>🎯 Ejercicios: <span style={{color:GREEN}}>{pg}</span></p><input type="range" min="4" max="20" value={pg} onChange={e=>setPg(+e.target.value)} style={{width:'100%',accentColor:GREEN}}/></div>
        <button className="btn btn-gold" onClick={()=>{const up={...user,pin:pp,goal:pg};setUser(up);saveP(up);setOv(null)}}>💾 Guardar</button>
      </div>}
      {ptab==='stats'&&(()=>{const ss=user.hist||[],tc=ss.reduce((s,h)=>s+h.ok,0),ta=ss.reduce((s,h)=>s+h.ok+h.sk,0),pct=ta>0?Math.round(tc/ta*100):0;return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {[{l:'Sesiones',v:ss.length,c:GREEN},{l:'Aciertos',v:tc,c:BLUE},{l:'%',v:pct+'%',c:GOLD},{l:'Total',v:ta,c:PURPLE}].map((s,i)=><div key={i} className="sbox"><div style={{fontSize:28,color:s.c,fontWeight:700}}>{s.v}</div><div style={{fontSize:13,color:DIM,marginTop:4}}>{s.l}</div></div>)}
      </div>})()}
      {ptab==='srs'&&(()=>{const mas=Object.values(user.srs||{}).filter(s=>s.lv>=4).length,lrn=Object.values(user.srs||{}).filter(s=>s.lv>0&&s.lv<4).length,nw=EX.length-mas-lrn;return <div style={{textAlign:'center',padding:'20px 0'}}>
        <div style={{display:'flex',justifyContent:'center',gap:20}}>{[{l:'Dominadas',v:mas,c:GREEN},{l:'Aprendiendo',v:lrn,c:GOLD},{l:'Nuevas',v:nw,c:PURPLE}].map((s,i)=><div key={i}><div style={{position:'relative',display:'inline-block'}}><Ring p={s.v/EX.length} sz={80} c={s.c}/><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:20,color:s.c,fontWeight:700}}>{s.v}</div></div><div style={{fontSize:13,color:DIM,marginTop:6}}>{s.l}</div></div>)}</div>
      </div>})()}
    </div></div>}

    {scr==='login'&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}>
      <div style={{fontSize:80,marginBottom:8,animation:'glow 3s infinite'}}>🗣️</div>
      <h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1>
      <p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p>
      <p style={{color:DIM+'66',fontSize:10,position:'fixed',bottom:10,left:0,right:0,textAlign:'center'}}>© 2026 Toki — Diego Aroca</p>
      {profs.length>0&&!creating&&<div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:24}}>{profs.map(p=><button key={p.id} className="profcard" onClick={()=>{setUser(p);setPp(p.pin||'');setPg(p.goal||8);setVoiceProfile(p.age,p.sex);setScr('goals')}}>
        <div style={{fontSize:40}}>{p.av}</div><div style={{flex:1}}><div style={{fontSize:22,fontWeight:700}}>{p.name}</div><div style={{fontSize:14,color:DIM}}>{p.age} años · Nivel {p.maxLv||p.level||1}</div></div>
      </button>)}</div>}
      {!creating?<button className="btn btn-p" onClick={()=>setCreating(true)} style={{fontSize:22}}>➕ Nuevo Jugador</button>:
      <div className="card af" style={{padding:24,textAlign:'left'}}>
        <p style={{fontSize:22,color:GOLD,textAlign:'center',margin:'0 0 18px',fontWeight:700}}>Nuevo Jugador</p>
        <label style={{fontSize:15,color:DIM}}>Nombre</label>
        <input className="inp" value={fn} onChange={e=>setFn(e.target.value)} placeholder="Ej: Guillermo" style={{marginBottom:14,marginTop:6}}/>
        <label style={{fontSize:15,color:DIM}}>Edad</label>
        <input className="inp" value={fa} onChange={e=>setFa(e.target.value.replace(/\D/g,''))} type="tel" placeholder="12" style={{marginBottom:14,marginTop:6}}/>
        <label style={{fontSize:15,color:DIM}}>Sexo (voz)</label>
        <div style={{display:'flex',gap:10,margin:'8px 0 14px'}}>{[['m','👦 Chico'],['f','👧 Chica']].map(([v,l])=><button key={v} onClick={()=>setFsex(v)} style={{flex:1,padding:'14px 0',borderRadius:12,border:`3px solid ${fsex===v?GOLD:BORDER}`,background:fsex===v?GOLD+'22':BG3,color:fsex===v?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:700,fontSize:18,cursor:'pointer'}}>{l}</button>)}</div>
        <label style={{fontSize:15,color:DIM}}>Nivel</label>
        <div style={{display:'flex',gap:8,margin:'8px 0 14px'}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setFlv(n)} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${flv===n?GOLD:BORDER}`,background:flv===n?GOLD+'22':BG3,color:flv===n?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:700,fontSize:18,cursor:'pointer'}}>{n}</button>)}</div>
        <label style={{fontSize:15,color:DIM}}>🔒 PIN (opcional)</label>
        <input className="inp" value={pp} onChange={e=>setPp(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="Sin PIN" style={{marginBottom:14,marginTop:6,textAlign:'center',letterSpacing:12}}/>
        <label style={{fontSize:15,color:DIM}}>Avatar</label>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',margin:'10px 0 18px'}}>{AVS.map(a=><button key={a} className={'avbtn'+(fav===a?' on':'')} onClick={()=>setFav(a)}>{a}</button>)}</div>
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setCreating(false)}>Cancelar</button>
          <button className="btn btn-g" style={{flex:2}} disabled={!fn.trim()||!fa} onClick={()=>{
            const p={id:Date.now()+'',name:cap(fn.trim()),age:+fa,sex:fsex,av:fav,hist:[],srs:{},level:flv,maxLv:flv,pin:pp,goal:8,seen:[]};
            setProfs(prev=>[...prev,p]);setUser(p);setCreating(false);setFn('');setFa('');setPp('');setVoiceProfile(+fa,fsex);setScr('goals')
          }}>Crear ✓</button>
        </div>
      </div>}
    </div>}

    {scr==='goals'&&user&&<div className="af">
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
        <button style={{background:'none',border:'none',color:DIM,fontSize:16}} onClick={()=>{setUser(null);setScr('login')}}>← Cambiar</button>
        <button style={{background:'none',border:'none',color:DIM,fontSize:16}} onClick={()=>{setPp(user.pin||'');setPg(user.goal||8);setPtab('config');setOv('parent')}}>⚙️ Padres</button>
      </div>
      <div style={{textAlign:'center',padding:'20px 0'}}>
        <div style={{fontSize:56,marginBottom:8}}>{user.av}</div>
        <h2 style={{fontSize:28,margin:'0 0 4px'}}>¡Hola {user.name}!</h2>
        <p style={{fontSize:15,color:DIM,margin:'0 0 6px'}}>Nivel {user.maxLv||user.level||1} de 5</p>
        {(()=>{const rem=getRem(),goal=user.goal||8,done=goal-rem;
          if(rem>0)return <div><div style={{background:GREEN+'0C',border:`2px solid ${GREEN}22`,borderRadius:18,padding:24,margin:'20px 0'}}>
            <div style={{position:'relative',display:'inline-block',marginBottom:12}}><Ring p={done/goal} sz={100} sw={8}/><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:32,color:GREEN,fontWeight:700}}>{rem}</div></div>
            <p style={{fontSize:20,fontWeight:700,margin:'0 0 4px'}}>Te faltan <span style={{color:GREEN}}>{rem} ejercicios</span></p>
            <p style={{fontSize:16,color:DIM,margin:0}}>¡Termínalos y la tablet es tuya! 🎮</p></div>
            <button className="btn btn-g" onClick={startGame} style={{fontSize:24}}>🚀 ¡A por ello!</button></div>;
          return <div><div style={{background:GOLD+'0C',border:`2px solid ${GOLD}22`,borderRadius:18,padding:24,margin:'20px 0'}}>
            <div style={{fontSize:64,marginBottom:8}}>🏆</div><p style={{fontSize:24,color:GOLD,fontWeight:700,margin:'0 0 8px'}}>¡SESIÓN COMPLETADA!</p></div>
            <button className="btn btn-b" onClick={startGame}>Practicar más</button></div>
        })()}
      </div>
    </div>}

    {scr==='game'&&cur&&<div className="af">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <button style={{background:'none',border:'none',color:DIM,fontSize:16}} onClick={tryExit}>✕ Salir</button>
        <span style={{fontSize:14,color:DIM,fontWeight:600}}>{idx+1}/{queue.length}</span>
      </div>
      <div className="pbar" style={{marginBottom:10}}><div className="pfill" style={{width:((idx+1)/queue.length*100)+'%'}}/></div>
      <Tower placed={st.ok} total={queue.length}/>
      <div style={{marginTop:10}}>
        {cur.ty==='frases'&&<ExFrases ex={cur} onOk={onCorrect} onSkip={onSkip} sex={user.sex} name={user.name}/>}
        {cur.ty==='sit'&&<ExSit ex={cur} onOk={onCorrect} onSkip={onSkip} sex={user.sex} name={user.name}/>}
        {cur.ty==='flu'&&<ExFlu ex={cur} onOk={onCorrect} onSkip={onSkip} sex={user.sex} name={user.name}/>}
      </div>
    </div>}
  </div>
}
