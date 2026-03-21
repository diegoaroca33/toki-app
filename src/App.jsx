// ============================================================
// TOKI · Aprende a decirlo
// © 2026 Diego Aroca. Todos los derechos reservados.
// ============================================================
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AREAS, EX } from './exercises.js'

const BG='#0B1D3A',BG2='#122548',BG3='#1A3060',GOLD='#F0C850',GREEN='#2ECC71',RED='#E74C3C',BLUE='#3498DB',PURPLE='#9B59B6',TXT='#ECF0F1',DIM='#7F8FA6',CARD='#152D55',BORDER='#1E3A6A';
const VER='v21';
const CSS=`
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;font-family:'Fredoka',sans-serif;color:${TXT};min-height:100vh;min-height:100dvh;transition:background 2s}
body.sky-morning{background:linear-gradient(180deg,#1a3a6a 0%,#2e6bb5 40%,#5ba3d9 100%)}
body.sky-afternoon{background:linear-gradient(180deg,#1a2744 0%,#c0392b 30%,#e67e22 60%,#f39c12 100%)}
body.sky-night{background:${BG}}
body.sky-night::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:0;background:radial-gradient(1px 1px at 10% 20%,#fff8 0,transparent 100%),radial-gradient(1px 1px at 30% 50%,#fff6 0,transparent 100%),radial-gradient(1.5px 1.5px at 50% 10%,#fff9 0,transparent 100%),radial-gradient(1px 1px at 70% 40%,#fff5 0,transparent 100%),radial-gradient(1px 1px at 90% 70%,#fff7 0,transparent 100%),radial-gradient(1.5px 1.5px at 15% 80%,#fff8 0,transparent 100%),radial-gradient(1px 1px at 45% 65%,#fff6 0,transparent 100%),radial-gradient(1px 1px at 80% 15%,#fff7 0,transparent 100%),radial-gradient(1.5px 1.5px at 60% 85%,#fff5 0,transparent 100%),radial-gradient(1px 1px at 25% 35%,#fff6 0,transparent 100%),radial-gradient(1px 1px at 85% 55%,#fff4 0,transparent 100%),radial-gradient(1.5px 1.5px at 5% 60%,#fff7 0,transparent 100%),radial-gradient(1px 1px at 95% 25%,#fff5 0,transparent 100%),radial-gradient(1px 1px at 40% 90%,#fff6 0,transparent 100%);animation:twinkle 8s ease-in-out infinite alternate}
@keyframes twinkle{0%{opacity:.7}100%{opacity:1}}
button{font-family:'Fredoka',sans-serif;touch-action:manipulation;cursor:pointer}
input{font-family:'Fredoka',sans-serif}
input::placeholder{color:${DIM}}
#root{max-width:1100px;margin:0 auto;padding:16px 20px;position:relative;z-index:1}
.btn{display:block;width:100%;border:3px solid;border-radius:14px;padding:22px 28px;font-weight:600;font-size:22px;transition:transform .1s;color:#fff;text-align:center;min-height:48px}
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
.ws{min-width:52px;height:50px;display:flex;align-items:center;justify-content:center;padding:0 14px;border-radius:12px;font-size:20px;font-weight:600;transition:all .2s}
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
.tab{flex:1;padding:12px;border-radius:10px;border:none;font-weight:600;font-size:15px;background:transparent;color:${DIM}}
.tab.on{background:${GOLD};color:#1a1a2e}
.sbox{background:${CARD};border:2px solid ${BORDER};border-radius:12px;padding:16px;text-align:center}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounceIn{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
@keyframes confDrop{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes qsbar{0%{height:100%}100%{height:0%}}
@keyframes glow{0%,100%{filter:drop-shadow(0 0 8px ${GOLD}66)}50%{filter:drop-shadow(0 0 20px ${GOLD}aa)}}
@keyframes planetPulse{0%,100%{transform:scale(.92);filter:drop-shadow(0 0 6px rgba(255,255,255,.2))}50%{transform:scale(.97);filter:drop-shadow(0 0 14px rgba(255,255,255,.4))}}
@keyframes planetRing{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes orbitStar{0%{transform:rotate(0deg) translateX(52px) rotate(0deg)}100%{transform:rotate(360deg) translateX(52px) rotate(-360deg)}}
@keyframes rocketFly{0%{transform:translateY(100vh) scale(1);opacity:1}60%{transform:translateY(-20vh) scale(1.1);opacity:1}100%{transform:translateY(-120vh) scale(.6);opacity:0}}
@keyframes rocketUp{0%{transform:translate(0,0) rotate(0deg);opacity:1}15%{transform:translate(5px,15px) rotate(10deg);opacity:1}40%{transform:translate(-20px,-80px) rotate(-15deg);opacity:1}65%{transform:translate(25px,-180px) rotate(10deg);opacity:0.9}100%{transform:translate(-10px,-350px) rotate(-5deg);opacity:0}}
@keyframes starPop{0%{transform:scale(0) rotate(-30deg);opacity:0}30%{transform:scale(2) rotate(15deg);opacity:1;filter:drop-shadow(0 0 20px #FFD700)}60%{transform:scale(0.8) rotate(-5deg)}80%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
@keyframes starBurstRing{0%{transform:scale(0.1);opacity:0.9}100%{transform:scale(1.8);opacity:0}}
@keyframes starPass{0%{transform:translateY(-20px);opacity:0}20%{opacity:1}100%{transform:translateY(110vh);opacity:0}}
@keyframes countNum{0%{transform:scale(.3);opacity:0}50%{transform:scale(1.3)}100%{transform:scale(1);opacity:1}}
@keyframes mascotBounce{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-8px) rotate(-5deg)}75%{transform:translateY(-4px) rotate(5deg)}}
@keyframes mascotShy{0%,100%{transform:rotate(0)}50%{transform:rotate(15deg)}}
@keyframes mascotDance{0%{transform:translateY(0) rotate(0) scale(1)}25%{transform:translateY(-6px) rotate(-10deg) scale(1.1)}50%{transform:translateY(0) rotate(0) scale(1)}75%{transform:translateY(-6px) rotate(10deg) scale(1.1)}}
@keyframes planetFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes orbitAll{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes counterSpin{0%{transform:rotate(0deg)}100%{transform:rotate(-360deg)}}
.skip-btn{display:none}body.sup-mode .skip-btn{display:inline-block}
.af{animation:fadeIn .4s ease-out}.ab{animation:bounceIn .45s}.ap{animation:pulse 1.4s infinite}.as{animation:shake .4s}
`;
function lev(a,b){const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}
function digToText(s){const m={'0':'cero','1':'uno','2':'dos','3':'tres','4':'cuatro','5':'cinco','6':'seis','7':'siete','8':'ocho','9':'nueve','10':'diez','11':'once','12':'doce','13':'trece','14':'catorce','15':'quince','16':'dieciséis','17':'diecisiete','18':'dieciocho','19':'diecinueve','20':'veinte','30':'treinta','40':'cuarenta','50':'cincuenta','60':'sesenta','70':'setenta','80':'ochenta','90':'noventa','100':'cien'};return s.replace(/\d+/g,n=>{if(m[n])return m[n];const num=parseInt(n);if(num>20&&num<30)return'veinti'+['uno','dós','trés','cuatro','cinco','séis','siete','ocho','nueve'][num-21];const d=['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];const t=Math.floor(num/10),r=num%10;if(r===0)return d[t]||n;const u=['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];return(d[t]||'')+' y '+(u[r]||'')})}
function score(said,tgt){if(!said||!said.trim())return 0;const c=s=>digToText(s.toLowerCase()).replace(/[^a-záéíóúñü\s]/g,'').trim();const a=c(said),b=c(tgt);if(!a)return 0;if(a===b)return 4;const sw=a.split(/\s+/),tw=b.split(/\s+/);let exact=0,close=0;tw.forEach(t=>{if(sw.some(s=>s===t))exact++;else{const maxLev=t.length<=3?0:t.length<=5?1:2;if(sw.some(s=>lev(s,t)<=maxLev))close++}});const exactR=exact/Math.max(tw.length,1);if(exactR>=1)return 4;if(exactR>=.8)return 3;const totalR=(exact+close*.7)/Math.max(tw.length,1);if(totalR>=.5||exact>=1)return 2;return 1}
function getExigencia(){try{const v=localStorage.getItem('toki_exigencia');return v?parseInt(v):65}catch(e){return 65}}
function adjScore(raw){const ex=getExigencia();if(ex>=100)return raw;return Math.min(4,Math.round(raw*(100/ex)))}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}
let voiceProfile={age:12,sex:'m'},cachedVoice=null;
function setVoiceProfile(a,s){voiceProfile={age:a||12,sex:s||'m'};cachedVoice=null;pickVoice()}
function getVP(){const a=voiceProfile.age,s=voiceProfile.sex;if(a<=9)return{rate:.6,pitch:s==='f'?1.35:1.2};if(a<=13)return{rate:.65,pitch:s==='f'?1.15:.92};if(a<=17)return{rate:.7,pitch:s==='f'?1.05:.82};return{rate:.75,pitch:s==='f'?1.0:.78}}
function pickVoice(){const v=window.speechSynthesis?window.speechSynthesis.getVoices():[];const es=v.filter(x=>x.lang&&x.lang.startsWith('es'));if(!es.length)return;const esES=es.filter(x=>x.lang==='es-ES');const esOther=es.filter(x=>x.lang!=='es-ES');const pool=esES.length?esES:esOther.length?esOther:es;const f=/elena|conchita|lucia|miren|monica|paulina|female|femenin|mujer|helena/i,m=/jorge|enrique|pablo|andres|diego|male|masculin|hombre/i;cachedVoice=voiceProfile.sex==='f'?pool.find(x=>f.test(x.name))||pool[0]:pool.find(x=>m.test(x.name))||pool[0]}
if(window.speechSynthesis){window.speechSynthesis.onvoiceschanged=pickVoice;setTimeout(pickVoice,100);setTimeout(pickVoice,500);setTimeout(pickVoice,1500)}
function say(text){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const p=getVP(),u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=p.rate;u.pitch=p.pitch;u.volume=1.0;if(cachedVoice)u.voice=cachedVoice;let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u);setTimeout(finish,Math.max(3000,text.length*250))})}
function sayFB(text){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const p=getVP();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=Math.min(1.0,p.rate+0.15);u.pitch=voiceProfile.sex==='m'?Math.min(1.5,p.pitch+0.4):Math.max(0.6,p.pitch-0.3);u.volume=1.0;const voices=window.speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.startsWith('es'));u.voice=voices.find(v=>v!==cachedVoice)||cachedVoice;let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u);setTimeout(finish,Math.max(2500,text.length*200))})}
function stopVoice(){if(window.speechSynthesis)window.speechSynthesis.cancel()}
function playRec(userId,voiceIds,key){return new Promise(res=>{if(!voiceIds||!voiceIds.length){res(false);return}for(const vid of voiceIds){try{const raw=localStorage.getItem('toki_voice_'+userId+'_'+vid);if(!raw){continue}const d=JSON.parse(raw);if(d&&d[key]){const a=new Audio(d[key]);a.onended=()=>res(true);a.onerror=()=>{console.warn('playRec audio error for',key);res(false)};a.play().then(()=>{}).catch(e=>{console.warn('playRec play failed',key,e);res(false)});return}}catch(e){console.warn('playRec error',vid,e)}}res(false)})}
const SR_AVAILABLE=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
function useSR(onResult){const recRef=useRef(null);const cbRef=useRef(onResult);cbRef.current=onResult;
  const go=useCallback(()=>{if(!SR_AVAILABLE)return;try{if(recRef.current){try{recRef.current.abort()}catch(e){}}
    const S=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new S();r.lang='es-ES';r.continuous=false;r.interimResults=false;r.maxAlternatives=5;
    r.onresult=e=>{const a=[];for(let i=0;i<e.results[0].length;i++)a.push(e.results[0][i].transcript.toLowerCase().trim());if(cbRef.current)cbRef.current(a.join('|'))};
    r.onerror=()=>{};r.onend=()=>{};recRef.current=r;r.start()}catch(e){console.warn('SR start fail',e)}},[]);
  const stop=useCallback(()=>{if(recRef.current){try{recRef.current.abort()}catch(e){}}recRef.current=null},[]);
  useEffect(()=>()=>stop(),[]);
  return{ok:SR_AVAILABLE,go,stop}}
function saveData(key,val){try{localStorage.setItem('toki_'+key,JSON.stringify(val))}catch(e){}}
function loadData(key,def){try{const v=localStorage.getItem('toki_'+key);return v?JSON.parse(v):def}catch(e){return def}}
function textKey(text){return 'ph_'+text.toLowerCase().replace(/[^a-záéíóúñü0-9\s]/g,'').trim().replace(/\s+/g,'_').slice(0,40)}
function personalize(text,u){if(!text||!u)return text||'';const h=(u.hermanos||'').split(',').map(s=>s.trim()).filter(Boolean);return text.replace(/\{nombre\}/g,u.name||'Nico').replace(/\{padre\}/g,u.padre||'Paco').replace(/\{madre\}/g,u.madre||'Ana').replace(/\{hermano1\}/g,h[0]||'Miguel').replace(/\{hermana1\}/g,h[0]||'Sofía').replace(/\{tel_padre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{tel_madre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{direccion\}/g,u.direccion||'mi casa')}
function srsUp(id,ok,u){const d={...u};if(!d.srs)d.srs={};if(!d.srs[id])d.srs[id]={lv:0,t:0};d.srs[id].t=Date.now();d.srs[id].lv=ok?Math.min(d.srs[id].lv+1,5):Math.max(d.srs[id].lv-1,0);return d}
function needsRev(id,u){const s=u.srs&&u.srs[id];if(!s)return true;const g=[0,30000,120000,600000,3600000,86400000];return(Date.now()-s.t)>=g[Math.min(s.lv,5)]}
const AVS=['🧑‍🚀','👨‍🚀','👩‍🚀','🦸','🦸‍♂️','🦸‍♀️','🧙','🧙‍♂️','🧙‍♀️','🧑‍🎤','👨‍🎤','👩‍🎤','🧑‍🎨','🧑‍🏫','👨‍🍳','👩‍🔬','🧑‍✈️','👮','🥷','🧛','🧜‍♀️','🧜‍♂️','🧚','🧞','🦊','🐸','🐉','🦁','🐼','🐨','🦄','🐯','🐺','🦖','🐙','🦈','🦅','🦋','🤖','👾','🎮','⚡','🌟','🔥','💎','🎯','🏆','🎸','🛹','🏄','⚽','🎪','🚀','🌈'];
const avStr=v=>typeof v==='string'?v:'🧑‍🚀';
const CLS=[GREEN,BLUE,GOLD,PURPLE,RED,'#E67E22',GREEN];const tdy=()=>new Date().toLocaleDateString('es-ES');const rnd=a=>a[Math.floor(Math.random()*a.length)];
const BUILD_OK=['¡Sí señor!','¡Eso es!','¡Bien hecho!','¡Perfecto!','¡Así se hace!','¡Genial!','¡Correcto!','¡Exacto!'];
const PERFECT_T=['¡Muy bien {N}!','¡Eres un crack {N}!','¡Genial {N}, sigue así!','¡{N}, qué crack!','¡Bravo {N}!','¡Espectacular {N}!','¡Fantástico {N}!','¡Lo has clavado {N}!','¡Qué bien {N}!','¡Eso es {N}!'];
const GOOD_MSG=['¡Bien!','¡Genial!','¡Muy bien!','¡Fenomenal!','¡Estupendo!','¡Olé!'];
const RETRY_MSG=['Otra vez','Venga, otra','Una más','Casi casi'];
const FAIL_MSG=['Poco a poco','No pasa nada','Seguimos','Ánimo'];
const SHORT_OK=['¡Casi!','¡Venga!','¡Va!','¡Sigue!','¡Dale!','¡Ánimo!','¡Adelante!','¡Arriba!','¡Vamos!','¡Bien!','¡Eso!','¡Olé!'];
const SHORT_FAIL=['¡Casi!','¡Venga!','¡Va!','¡Sigue!','¡Dale!','¡Ánimo!','¡Adelante!','¡Arriba!','¡Vamos!'];
const MODULE_MSG={decir:['¡Dilo!','¡Dilo tú!','¡Dilo otra vez!','¡Venga, dilo!'],frase:['¡Dilo!','¡Dilo tú!','¡Venga, dilo!'],math:['¡Cuenta!','¡Cuenta conmigo!','¡Cuenta otra vez!'],multi:['¡Cuenta!','¡Cuenta conmigo!'],frac:['¡Cuenta!','¡Cuenta otra vez!'],contar:['¡Cuenta!','¡Cuenta conmigo!'],writing:['¡Escríbelo!','¡Escribe otra vez!'],calendar:['¡Piensa!','¡Tú puedes!','¡Razona!'],distribute:['¡Piensa!','¡Tú puedes!'],clock:['¡Piensa!','¡Razona!'],money:['¡Piensa!','¡Tú puedes!'],quiensoy:['¡Dilo!','¡Dilo tú!'],razona:['¡Piensa!','¡Tú puedes!','¡Razona!','¡Piensa bien!'],lee:['¡Léelo!','¡Lee otra vez!','¡Tú sabes leer!','¡Venga, lee!']};
let _lastMsg='';
function pickMsg(positive,name,section){const pool=[];if(positive){if(Math.random()<0.2&&name){const t=rnd(PERFECT_T).replace(/\{N\}/g,name);if(t!==_lastMsg){_lastMsg=t;return t}}pool.push(...SHORT_OK);if(MODULE_MSG[section])pool.push(...MODULE_MSG[section])}else{pool.push(...SHORT_FAIL);if(MODULE_MSG[section])pool.push(...MODULE_MSG[section])}const filtered=pool.filter(m=>m!==_lastMsg);const msg=rnd(filtered.length?filtered:pool);_lastMsg=msg;return msg}
function mkPerfect(name){if(Math.random()<0.2&&name){const msg=rnd(PERFECT_T).replace(/\{N\}/g,name);_lastMsg=msg;return msg}const short=rnd(SHORT_OK.filter(m=>m!==_lastMsg));_lastMsg=short;return short}
const CHEER_ALL=[...PERFECT_T,...GOOD_MSG,...RETRY_MSG,...FAIL_MSG,...BUILD_OK,...SHORT_OK];
function cheerIdx(text){const clean=text.replace(/\{N\}/g,'').trim().toLowerCase();for(let i=0;i<CHEER_ALL.length;i++){if(CHEER_ALL[i].replace(/\{N\}/g,'').trim().toLowerCase()===clean)return i}return -1}
async function cheerOrSay(text,uid,vids,_cat){const idx=cheerIdx(text);if(idx>=0){const played=await playRec(uid,vids,'cheer_'+idx);if(played)return}await sayFB(text)}
const NUMS_1_100=Array.from({length:100},(_,i)=>{const n=i+1;if(n===100)return'Cien';const u=['','Uno','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Once','Doce','Trece','Catorce','Quince','Dieciséis','Diecisiete','Dieciocho','Diecinueve','Veinte'];if(n<=20)return u[n];if(n<30)return'Veinti'+['uno','dós','trés','cuatro','cinco','séis','siete','ocho','nueve'][n-21];const d=['','','','Treinta','Cuarenta','Cincuenta','Sesenta','Setenta','Ochenta','Noventa'];const t=Math.floor(n/10),r=n%10;return r===0?d[t]:d[t]+' y '+u[r].toLowerCase()});
const SMINS=[15,25,44,0];
const QUIEN_SOY=[
  {id:'qs01',text:'Hola, soy Guillermo',img:'/quiensoy/01.jpg',picto:'/quiensoy/pictos/01.png'},
  {id:'qs02',text:'Este mes tiene un día importante',img:'/quiensoy/02.jpg',picto:'/quiensoy/pictos/02.png'},
  {id:'qs03',text:'El veintiuno es el día del síndrome de Down',img:'/quiensoy/03.jpg',picto:'/quiensoy/pictos/03.png'},
  {id:'qs04',text:'Igual que vosotros',img:'/quiensoy/04.jpg',picto:'/quiensoy/pictos/04.png'},
  {id:'qs05',text:'Por la tarde hago muchas actividades',img:'/quiensoy/05.jpg',picto:'/quiensoy/pictos/05.png'},
  {id:'qs06',text:'Toco el piano',img:'/quiensoy/06.jpg',picto:'/quiensoy/pictos/06.png'},
  {id:'qs07',text:'Juego al bádminton',img:'/quiensoy/07.jpg',picto:'/quiensoy/pictos/07.png'},
  {id:'qs08',text:'Voy a natación',img:'/quiensoy/08.jpg',picto:'/quiensoy/pictos/08.png'},
  {id:'qs09',text:'Soy modelo de ropa',img:'/quiensoy/09.jpg',picto:'/quiensoy/pictos/09.png'},
  {id:'qs10',text:'Voy a ASSIDO',img:'/quiensoy/10.jpg',picto:'/quiensoy/pictos/10.png'},
  {id:'qs11',text:'Hacemos teatro y baile',img:'/quiensoy/11.jpg',picto:'/quiensoy/pictos/11.png'},
  {id:'qs12',text:'Yo hago mis tareas',img:'/quiensoy/12.jpg',picto:'/quiensoy/pictos/12.png'},
  {id:'qs13',text:'Igual que vosotros',img:'/quiensoy/13.jpg',picto:'/quiensoy/pictos/13.png'},
  {id:'qs14',text:'Me gusta hacer muchas cosas',img:'/quiensoy/14.jpg',picto:'/quiensoy/pictos/14.png'},
  {id:'qs15',text:'Me gusta cocinar',img:'/quiensoy/15.jpg',picto:'/quiensoy/pictos/15.png'},
  {id:'qs16',text:'Me gusta pintar',img:'/quiensoy/16.jpg',picto:'/quiensoy/pictos/16.png'},
  {id:'qs17',text:'Me gusta hacer muchos deportes',img:'/quiensoy/17.jpg',picto:'/quiensoy/pictos/17.png'},
  {id:'qs18',text:'A veces molesto sin querer',img:'/quiensoy/18.jpg',picto:'/quiensoy/pictos/18.png'},
  {id:'qs19',text:'Pero puede que esté nervioso',img:'/quiensoy/19.jpg',picto:'/quiensoy/pictos/19.png'},
  {id:'qs20',text:'Estoy aprendiendo a hacerlo mejor',img:'/quiensoy/20.jpg',picto:'/quiensoy/pictos/20.png'},
  {id:'qs21',text:'Yo solo quiero jugar',img:'/quiensoy/21.jpg',picto:'/quiensoy/pictos/21.png'},
  {id:'qs22',text:'Porque todos somos iguales',img:'/quiensoy/22.jpg',picto:'/quiensoy/pictos/22.png'},
  {id:'qs23',text:'Juntos es mejor',img:'/quiensoy/23.jpg',picto:'/quiensoy/pictos/23.png'},
  {id:'qs24',text:'Muchas gracias por como me tratáis',img:'/quiensoy/24.jpg',picto:'/quiensoy/pictos/24.png'},
  {id:'qs25',text:'Os amo',img:'/quiensoy/25.jpg',picto:'/quiensoy/pictos/25.png'},
];
// Level options for parent config (not shown to child)
const LV_OPTS={
  quiensoy:[{n:1,l:'Estudio'},{n:2,l:'Presentación'}],
  decir:[{n:1,l:'N1'},{n:2,l:'N2'},{n:3,l:'N3'},{n:4,l:'N4'},{n:5,l:'N5'}],
  frase:[{n:1,l:'3 pal'},{n:2,l:'4 pal'},{n:3,l:'5 pal'}],
  contar:[{n:1,l:'1-20'},{n:2,l:'20-50'},{n:3,l:'50-100'},{n:4,l:'1-100'}],
  math:[{n:1,l:'Sumas fácil'},{n:2,l:'Sumas+'},{n:3,l:'Restas'},{n:4,l:'Mezcla'}],
  multi:[{n:1,l:'x2/x3'},{n:2,l:'x5/x10'},{n:3,l:'Mezcla'}],
  frac:[{n:1,l:'Reconocer'},{n:2,l:'Notación'},{n:3,l:'Equivalencias'},{n:4,l:'Sumar'},{n:5,l:'Sumar/Restar'}],
  money:[{n:1,l:'Reconocer'},{n:2,l:'Sumar'},{n:3,l:'Pagar'},{n:4,l:'Cambio'}],
  clock:[{n:1,l:'En punto'},{n:2,l:'Media'},{n:3,l:'Cuarto'}],
  calendar:[{n:1,l:'Días'},{n:2,l:'Meses'},{n:3,l:'Antes/Desp.'},{n:4,l:'Ayer/Mañ.'}],
  distribute:[{n:1,l:'Poner'},{n:2,l:'Repartir'},{n:3,l:'Comparar'}],
  writing_1:[{n:1,l:'Con guía'},{n:2,l:'Libre'}],
  writing_3:[{n:3,l:'Con guía'},{n:4,l:'Libre'}],
  writing_5:[{n:5,l:'Con guía'},{n:51,l:'Libre'}],
  writing_52:[{n:52,l:'Con guía'},{n:53,l:'Libre'}],
  writing_6:[{n:6,l:'Con guía'},{n:61,l:'Libre'}],
  writing_62:[{n:62,l:'Con guía'},{n:63,l:'Libre'}],
  razona:[{n:1,l:'Posición'},{n:2,l:'Intruso'},{n:3,l:'Clasificar'},{n:4,l:'Causa-efecto'},{n:5,l:'Emociones'}],
  lee_intruso:[{n:1,l:'Intruso'}],
  lee_word_img:[{n:2,l:'Palabra+Imagen'}],
  lee_complete:[{n:3,l:'Completa'}],
  lee_syllables:[{n:4,l:'Ordena sílabas'}],
  lee_read_do:[{n:5,l:'Lee y haz'}],
};
function getModuleLv(modKey){return loadData('mod_lv_'+modKey,null)}
function setModuleLv(modKey,lv){saveData('mod_lv_'+modKey,lv)}
const GROUPS=[
  {id:'quiensoy',name:'QUIÉN SOY',emoji:'👤',color:'#E91E63',desc:'Mi presentación',modules:[
    {k:'quiensoy',l:'Mi presentación',defLv:1,lvKey:'quiensoy'}]},
  {id:'dilo',name:'DILO',emoji:'🎤',color:GREEN,desc:'Todo lo de hablar',modules:[
    {k:'decir',l:'Aprende a decirlo',defLv:1,lvKey:'decir'},
    {k:'frase',l:'Forma la frase',defLv:1,lvKey:'frase'},
    {k:'contar',l:'Cuenta conmigo',defLv:1,lvKey:'contar'}]},
  {id:'cuenta',name:'CUENTA',emoji:'🧮',color:'#E67E22',desc:'Todo lo de números',modules:[
    {k:'math',l:'Sumas y Restas',defLv:1,lvKey:'math'},
    {k:'multi',l:'Multiplicaciones',defLv:1,lvKey:'multi'},
    {k:'frac',l:'Fracciones',defLv:1,lvKey:'frac'}]},
  {id:'razona',name:'RAZONA',emoji:'🧠',color:BLUE,desc:'Lógica y razonamiento',modules:[
    {k:'money',l:'Monedas y Billetes',defLv:1,lvKey:'money'},
    {k:'clock',l:'La Hora',defLv:1,lvKey:'clock'},
    {k:'calendar',l:'Calendario',defLv:1,lvKey:'calendar'},
    {k:'distribute',l:'Reparte y Cuenta',defLv:1,lvKey:'distribute'},
    {k:'razona',l:'Razona',defLv:1,lvKey:'razona'}]},
  {id:'escribe',name:'ESCRIBE',emoji:'✏️',color:PURPLE,desc:'Caligrafía y escritura',modules:[
    {k:'writing',l:'Letras MAYÚSCULAS',defLv:1,lvKey:'writing_1'},
    {k:'writing',l:'Letras minúsculas',defLv:3,lvKey:'writing_3'},
    {k:'writing',l:'Palabras MAYÚSCULAS',defLv:5,lvKey:'writing_5'},
    {k:'writing',l:'Palabras minúsculas',defLv:52,lvKey:'writing_52'},
    {k:'writing',l:'Frases MAYÚSCULAS',defLv:6,lvKey:'writing_6'},
    {k:'writing',l:'Frases minúsculas',defLv:62,lvKey:'writing_62'}]},
  {id:'lee',name:'LEE',emoji:'📖',color:'#E91E63',desc:'Lectura y comprensión',modules:[
    {k:'lee',l:'Intruso',defLv:1,lvKey:'lee_intruso'},
    {k:'lee',l:'Palabra+Imagen',defLv:2,lvKey:'lee_word_img'},
    {k:'lee',l:'Completa',defLv:3,lvKey:'lee_complete'},
    {k:'lee',l:'Ordena sílabas',defLv:4,lvKey:'lee_syllables'},
    {k:'lee',l:'Lee y haz',defLv:5,lvKey:'lee_read_do'}]}
];
function beep(f,d){try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;g.gain.value=0.03;o.start();o.stop(c.currentTime+d/1000);setTimeout(()=>c.close(),d+100)}catch(e){}}
// Time-of-day helpers
function getTimeOfDay(){const h=new Date().getHours();if(h>=6&&h<14)return'morning';if(h>=14&&h<20)return'afternoon';return'night'}
function getSkyClass(){const t=getTimeOfDay();return t==='morning'?'sky-morning':t==='afternoon'?'sky-afternoon':'sky-night'}
function getGreeting(name){const t=getTimeOfDay();const n=name||'';if(t==='morning')return'¡Buenos días'+(n?', '+n:'')+'!';if(t==='afternoon')return'¡Buenas tardes'+(n?', '+n:'')+'!';return'¡Buenas noches'+(n?', '+n:'')+'!'}
// Streak helpers
function getStreak(){const dates=loadData('streak_dates',[]);const today=new Date().toISOString().slice(0,10);if(!dates.includes(today)){dates.push(today);saveData('streak_dates',dates)}const sorted=[...new Set(dates)].sort().reverse();let streak=1;for(let i=0;i<sorted.length-1;i++){const d1=new Date(sorted[i]),d2=new Date(sorted[i+1]);const diff=(d1-d2)/(86400000);if(diff===1)streak++;else break}return streak}
function getTotalStars(){const ps=loadData('profiles',[]);let total=0;ps.forEach(p=>{if(p.hist)p.hist.forEach(h=>{total+=h.ok||0})});return total}
// Group progress helpers
function getGroupProgress(userId,groupId){const key='gp_'+userId+'_'+groupId;return loadData(key,0)}
function addGroupProgress(userId,groupId){const key='gp_'+userId+'_'+groupId;const cur=loadData(key,0);saveData(key,cur+1);return cur+1}
function getGroupStatus(userId,groupId){const n=getGroupProgress(userId,groupId);if(n===0)return'new';if(n>=50)return'mastered';return'progress'}
// Spanish syllable splitter
function splitSyllables(text){const w=text.toLowerCase().replace(/[¿?¡!,\.;:]/g,'').trim();const words=w.split(/\s+/);const result=[];const vowels='aeiouáéíóúü';words.forEach(word=>{const syls=[];let cur='';for(let i=0;i<word.length;i++){const c=word[i];const isV=vowels.includes(c);cur+=c;if(isV){const next=word[i+1],next2=word[i+2];if(i===word.length-1){syls.push(cur);cur=''}else if(next&&!vowels.includes(next)){if(next2&&!vowels.includes(next2)){if('lrLR'.includes(next2)){syls.push(cur);cur=''}else{cur+=next;syls.push(cur);cur='';i++}}else{if(next2&&vowels.includes(next2)){syls.push(cur);cur=''}else if(!next2){/* let it continue */}else{syls.push(cur);cur=''}}}else if(next&&vowels.includes(next)){syls.push(cur);cur=''}}}if(cur)syls.push(cur);result.push(syls)});return result}
// Countdown beep
function countdownBeep(n){try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=n===0?880:440;g.gain.value=n===0?0.06:0.04;o.start();o.stop(c.currentTime+(n===0?0.25:0.08));setTimeout(()=>c.close(),400)}catch(e){}}
// Mascot SVG component
function SpaceMascot({mood='idle',size=48}){const anim=mood==='happy'?'mascotBounce .6s ease-in-out 3':mood==='sad'?'mascotShy .5s ease-in-out 2':mood==='dance'?'mascotDance .8s ease-in-out infinite':'mascotBounce 3s ease-in-out infinite';
  return <svg width={size} height={size} viewBox="0 0 48 48" style={{animation:anim,display:'block'}}>
    <defs><filter id="starGlow"><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="M24,3 C25.5,12 27,14 28,16 C33,15.5 39,15 42,16 C37,19 33,21 31,23 C33,28 35,34 34,38 C30,34 27,31 24,29 C21,31 18,34 14,38 C13,34 15,28 17,23 C15,21 11,19 6,16 C9,15 15,15.5 20,16 C21,14 22.5,12 24,3Z" fill={GOLD} stroke="#d4ac0d" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" filter="url(#starGlow)"/>
    <circle cx={19} cy={19} r={2.8} fill="#1a1a2e"/><circle cx={29} cy={19} r={2.8} fill="#1a1a2e"/>
    <circle cx={20} cy={18} r={1} fill="#fff"/><circle cx={30} cy={18} r={1} fill="#fff"/>
    {mood==='happy'&&<path d="M19,24 Q24,30 29,24" fill="none" stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round"/>}
    {mood==='sad'&&<path d="M19,26 Q24,23 29,26" fill="none" stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round"/>}
    {mood==='idle'&&<path d="M20,24 Q24,27 28,24" fill="none" stroke="#1a1a2e" strokeWidth={1.8} strokeLinecap="round"/>}
    {mood==='dance'&&<path d="M18,24 Q24,31 30,24" fill="none" stroke="#1a1a2e" strokeWidth={2} strokeLinecap="round"/>}
  </svg>}
// Rocket transition overlay
function RocketTransition({show,onDone,avatar,planetEmoji,planetColor}){
  const[phase,setPhase]=useState('idle');const[num,setNum]=useState(5);
  const pc=planetColor||'#42A5F5';
  useEffect(()=>{if(!show)return;setPhase('ignite');setNum(5);
    // Phase 1: ignite (fire appears) 0-800ms
    const t0=setTimeout(()=>{setPhase('pickup');countdownBeep(5)},800);
    // Phase 2: pickup (rocket goes to avatar, face appears) 800-2000ms
    const t1=setTimeout(()=>{setPhase('fly');setNum(5);countdownBeep(5)},2000);
    // Phase 3: fly (countdown 5,4,3,2,1) 2000-7000ms
    const t2=setTimeout(()=>{setNum(4);countdownBeep(4)},3000);
    const t3=setTimeout(()=>{setNum(3);countdownBeep(3)},4000);
    const t4=setTimeout(()=>{setNum(2);countdownBeep(2)},5000);
    const t5=setTimeout(()=>{setNum(1);countdownBeep(1)},6000);
    const t6=setTimeout(()=>{setPhase('arrive');countdownBeep(0)},7000);
    // Phase 4: arrive at planet 7000-8200ms
    const t7=setTimeout(()=>{if(onDone)onDone()},8200);
    return()=>{[t0,t1,t2,t3,t4,t5,t6,t7].forEach(clearTimeout)}},[show]);
  if(!show)return null;
  const RocketSVG=({size=120,showFire=false,showFace=false})=>(
    <svg width={size} height={size*1.5} viewBox="0 0 100 150">
      {/* Rocket body */}
      <ellipse cx="50" cy="60" rx="22" ry="48" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="2"/>
      {/* Nose cone */}
      <ellipse cx="50" cy="18" rx="12" ry="20" fill={RED}/>
      {/* Left fin */}
      <path d="M28,85 L15,110 L28,100 Z" fill={BLUE} stroke="#1565C0" strokeWidth="1"/>
      {/* Right fin */}
      <path d="M72,85 L85,110 L72,100 Z" fill={BLUE} stroke="#1565C0" strokeWidth="1"/>
      {/* Window/porthole */}
      <circle cx="50" cy="50" r="12" fill="#1A237E" stroke="#90CAF9" strokeWidth="2"/>
      <circle cx="50" cy="50" r="10" fill="#0D47A1"/>
      {/* Face in window */}
      {showFace&&<text x="50" y="55" textAnchor="middle" fontSize="16" dominantBaseline="central">{avatar||'🧑‍🚀'}</text>}
      {!showFace&&<><circle cx="46" cy="47" r="1.5" fill="#90CAF9" opacity=".5"/><circle cx="54" cy="47" r="1" fill="#90CAF9" opacity=".3"/></>}
      {/* Fire/propulsion */}
      {showFire&&<>
        <ellipse cx="50" cy="115" rx="14" ry="25" fill={GOLD} opacity=".85">
          <animate attributeName="ry" values="20;28;20" dur=".3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".7;1;.7" dur=".2s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="50" cy="118" rx="9" ry="18" fill="#E67E22" opacity=".9">
          <animate attributeName="ry" values="14;20;14" dur=".25s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="50" cy="120" rx="5" ry="12" fill="#F44336" opacity=".8">
          <animate attributeName="ry" values="10;15;10" dur=".2s" repeatCount="indefinite"/>
        </ellipse>
      </>}
    </svg>);
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:200,background:'radial-gradient(ellipse,#0B1D3A 0%,#000 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',overflow:'hidden'}}>
    {/* Stars background */}
    {Array.from({length:30},(_,i)=><div key={'s'+i} style={{position:'absolute',left:Math.random()*100+'%',top:Math.random()*100+'%',width:Math.random()>0.5?2:1,height:Math.random()>0.5?2:1,background:'#fff',borderRadius:'50%',opacity:0.3+Math.random()*0.5,animation:`twinkle ${2+Math.random()*3}s ease-in-out infinite`}}/>)}

    {/* Phase 1: IGNITE — rocket shakes, fire starts */}
    {phase==='ignite'&&<div style={{animation:'shake .15s linear infinite'}}>
      <RocketSVG size={140} showFire={true} showFace={false}/>
    </div>}

    {/* Phase 2: PICKUP — rocket moves to get Guillermo, face appears */}
    {phase==='pickup'&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
      <div style={{fontSize:56,animation:'bounceIn .6s ease-out'}}>{avatar||'🧑‍🚀'}</div>
      <div style={{animation:'bounceIn .6s ease-out .3s both'}}>
        <RocketSVG size={130} showFire={true} showFace={true}/>
      </div>
    </div>}

    {/* Phase 3: FLY — countdown with streaking stars */}
    {phase==='fly'&&<>
      {Array.from({length:25},(_,i)=><div key={'st'+i} style={{position:'absolute',left:Math.random()*100+'%',top:'-5%',width:2,height:Math.random()*40+15,background:'#fff',borderRadius:2,opacity:0.6,animation:`starPass ${0.4+Math.random()*0.6}s linear ${i*0.15}s infinite`}}/>)}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
        <div key={num} style={{fontSize:100,fontWeight:900,color:GOLD,animation:'countNum .8s ease-out',textShadow:`0 0 40px ${GOLD}`}}>{num}</div>
        <RocketSVG size={100} showFire={true} showFace={true}/>
      </div>
    </>}

    {/* Phase 4: ARRIVE — rocket reaches planet */}
    {phase==='arrive'&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,animation:'bounceIn .6s ease-out'}}>
      <div style={{width:140,height:140,borderRadius:'50%',
        background:`radial-gradient(circle at 30% 25%,${pc}88,${pc} 60%,${pc}cc)`,
        display:'flex',alignItems:'center',justifyContent:'center',
        boxShadow:`0 0 40px ${pc}66`,
      }}>
        <span style={{fontSize:60}}>{planetEmoji||'🪐'}</span>
      </div>
      <div style={{fontSize:36,fontWeight:900,color:GOLD,textShadow:`0 0 20px ${GOLD}`}}>¡DESPEGUE!</div>
    </div>}
  </div>}
// Personas helpers
const PERSONA_RELATIONS=['Padre','Madre','Hermano','Hermana','Abuelo','Abuela','Tío','Tía','Primo','Prima','Amigo','Amiga','Compañero/a','Profe'];
function Confetti({show}){const[pts,sP]=useState([]);useEffect(()=>{if(show){sP(Array.from({length:24},(_,i)=>({i,x:Math.random()*100,c:CLS[i%7],s:6+Math.random()*10,d:Math.random()*.5,du:.8+Math.random()*.8})));setTimeout(()=>sP([]),2800)}},[show]);if(!pts.length)return null;return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:999}}>{pts.map(p=><div key={p.i} style={{position:'absolute',left:p.x+'%',top:'-5%',width:p.s,height:p.s,background:p.c,borderRadius:3,animation:`confDrop ${p.du}s ease-in ${p.d}s forwards`}}/>)}</div>}
function Ring({p,sz=80,sw=6,c=GREEN}){const r=(sz-sw)/2,ci=2*Math.PI*r;return <svg width={sz} height={sz} style={{transform:'rotate(-90deg)'}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={BG3} strokeWidth={sw}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={ci-(p||0)*ci} strokeLinecap="round" style={{transition:'stroke-dashoffset .6s'}}/></svg>}
function Tower({placed,total}){const cells=21,filled=Math.min(Math.floor((placed/Math.max(total,1))*cells),cells);return <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,maxWidth:220,margin:'0 auto'}}>{Array.from({length:cells},(_,i)=>{const row=Math.floor(i/7),inv=(2-row)*7+(i%7),on=inv<filled;return <div key={i} style={{aspectRatio:'1',borderRadius:4,transition:'all .3s cubic-bezier(.34,1.56,.64,1)',background:on?CLS[inv%7]:BG3+'44',border:on?'2px solid rgba(0,0,0,.2)':'2px solid '+BG3,transform:on?'scale(1)':'scale(.75)',opacity:on?1:.3}}/>})}</div>}
function RecBtn({dur,onEnd,on}){const[pct,sP]=useState(100);const t=useRef(null);const s=useRef(0);useEffect(()=>{if(!on){sP(100);return}s.current=Date.now();const ms=dur*1000;t.current=setInterval(()=>{const e=Date.now()-s.current;const r=Math.max(0,100-e/ms*100);sP(r);if(r<=25&&r>20)beep(1200,40);if(r<=15&&r>10)beep(1400,40);if(r<=0){clearInterval(t.current);beep(1600,60);setTimeout(onEnd,400)}},50);return()=>clearInterval(t.current)},[on,dur]);if(!on)return null;return <div style={{position:'relative',width:80,height:80,margin:'0 auto'}}><div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',borderRadius:'50%',background:RED+'33',overflow:'hidden'}}><div style={{position:'absolute',bottom:0,left:0,width:'100%',background:RED,transition:'height .05s linear',height:pct+'%'}}/></div><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:36}}>🎤</div></div>}
function useIdle(name,active){const[msg,sMsg]=useState('');const step=useRef(0);const timer=useRef(null);useEffect(()=>{step.current=0;sMsg('');clearInterval(timer.current);if(!active)return;timer.current=setInterval(()=>{const s=step.current;if(s===0){/* 15s: nothing, just wait */}else if(s===1)sMsg('¿Seguimos? 🚀');else if(s===2){const n=name||'';sMsg((n?n+', ':'')+'¿estás ahí? 👀')}else if(s===3)sMsg('Cuando quieras, seguimos 🌟');else if(s>=4)sMsg('Toki te espera... 💫');step.current=Math.min(s+1,5)},15000);return()=>clearInterval(timer.current)},[active,name]);function poke(){step.current=0;sMsg('');if(timer.current){clearInterval(timer.current);timer.current=null}}return{idleMsg:msg,poke}}

function starBeep(n){try{const c=new(window.AudioContext||window.webkitAudioContext)();const melodies=[[523,659,784,1047],[440,554,659,880],[587,740,880,1175],[494,622,740,988]];const mel=melodies[Math.floor(Math.random()*melodies.length)];const cnt=Math.min(n,4);for(let i=0;i<cnt;i++){const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=mel[i];g.gain.value=0.08;g.gain.setValueAtTime(0.08,c.currentTime+i*0.15);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+i*0.15+0.12);o.start(c.currentTime+i*0.15);o.stop(c.currentTime+i*0.15+0.12)}if(n>=4){const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=mel[3]*1.25;g.gain.value=0.1;g.gain.setValueAtTime(0.1,c.currentTime+0.7);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+1.0);o.start(c.currentTime+0.7);o.stop(c.currentTime+1.0)}setTimeout(()=>c.close(),1500)}catch(e){}}
function Stars({n,sz=32,burst=false}){
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

// ===== SPEAK PANEL — 4-star SingStar system =====
function SpeakPanel({text,exId,onOk,onSkip,sex,name,uid,vids}){
  const[sf,sSf]=useState(null);const[stars,setStars]=useState(0);const[att,sAtt]=useState(0);const[msg,sMsg]=useState('');const[mic,setMic]=useState(false);
  const[sylShow,setSylShow]=useState(false);const[sylIdx,setSylIdx]=useState(-1);
  const alive=useRef(true);const gen=useRef(0);const{idleMsg,poke}=useIdle(name,!sf&&!mic);
  const dur=useMemo(()=>Math.max(6,Math.ceil(text.split(/\s+/).length*0.9)+4),[text]);
  const syllables=useMemo(()=>splitSyllables(text),[text]);
  const flatSyls=useMemo(()=>syllables.flat(),[syllables]);
  const key=text+'|'+exId;
  async function doSyllablePlay(){if(!alive.current)return;setSylShow(true);setSylIdx(-1);stopVoice();
    for(let i=0;i<flatSyls.length;i++){if(!alive.current)return;setSylIdx(i);
      await new Promise(r=>{const u=new SpeechSynthesisUtterance(flatSyls[i]);u.lang='es-ES';u.rate=0.45;u.pitch=1.0;u.volume=1.0;let done=false;const fin=()=>{if(!done){done=true;r()}};u.onend=fin;u.onerror=fin;window.speechSynthesis.speak(u);setTimeout(fin,1500)});
      await new Promise(r=>setTimeout(r,300))}
    setSylIdx(-1);await new Promise(r=>setTimeout(r,300));
    if(!alive.current)return;setSylShow(false);sr.go();setMic(true)}
  async function doSlowPlay(){if(!alive.current)return;setSylShow(true);setSylIdx(-1);stopVoice();
    const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=0.35;u.pitch=1.0;u.volume=1.0;
    await new Promise(r=>{let done=false;const fin=()=>{if(!done){done=true;r()}};u.onend=fin;u.onerror=fin;window.speechSynthesis.speak(u);setTimeout(fin,Math.max(4000,text.length*400))});
    if(!alive.current)return;setSylShow(false);
    const pm='¡Seguimos!';sMsg(pm);sSf('pass');sayFB(pm);setTimeout(()=>{if(alive.current)onOk()},800)}
  function handleSR(said){if(!alive.current)return;poke();setMic(false);sr.stop();stopVoice();
    const rawB=Math.max(...said.split('|').map(a=>score(a,text)));const b=adjScore(rawB);
    setStars(b);starBeep(b);
    if(b>=4){const m=mkPerfect(name);sMsg(m);sSf('perfect');cheerOrSay(m,uid,vids,'perfect').then(()=>{if(alive.current)onOk()})}
    else if(b>=3){const gm=pickMsg(true,name,'decir');sMsg(gm);sSf('ok');cheerOrSay(rnd(GOOD_MSG),uid,vids,'good').then(()=>{if(alive.current)onOk()})}
    else if(b>=2){const na=att+1;sAtt(na);const rm=pickMsg(false,null,'decir');sMsg(rm);sSf('try');sayFB(rm);
      if(na>=2){setTimeout(()=>{if(alive.current){sMsg('Vamos por sílabas...');sSf('syl');doSyllablePlay()}},800)}
      else{setTimeout(()=>{if(alive.current){sSf(null);doPlay()}},900)}}
    else{const na=att+1;sAtt(na);const rm=pickMsg(false,null,'decir');sMsg(rm);sSf('try');sayFB(rm);
      if(na>=3){setTimeout(()=>{if(alive.current){sMsg('Vamos juntos, despacio...');sSf('syl');doSlowPlay()}},800)}
      else if(na>=2){setTimeout(()=>{if(alive.current){sMsg('Vamos por sílabas...');sSf('syl');doSyllablePlay()}},800)}
      else{setTimeout(()=>{if(alive.current){sSf(null);doPlay()}},900)}}}
  const sr=useSR(handleSR);
  async function doPlay(){if(!alive.current)return;stopVoice();sr.stop();sMsg('');setMic(false);setStars(0);setSylShow(false);
    try{const ms=await navigator.mediaDevices.getUserMedia({audio:true});ms.getTracks().forEach(t=>t.stop())}catch(e){}
    // Start mic BEFORE playing so it listens while Toki speaks — zero wait
    sr.go();setMic(true);
    const played=await playRec(uid,vids,textKey(text));if(!played)await say(text);
    if(!alive.current)return;
    // Mic is already listening — no need to start again
  }
  useEffect(()=>{alive.current=true;gen.current++;sSf(null);sAtt(0);sMsg('');setMic(false);setStars(0);setSylShow(false);setSylIdx(-1);stopVoice();sr.stop();
    // Proactively reactivate mic permission on exercise entry
    if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop())}).catch(()=>{});
    const t=setTimeout(()=>{if(alive.current){stopVoice();doPlay()}},900);return()=>{alive.current=false;clearTimeout(t);stopVoice();sr.stop()}},[key]);
  function onTimeUp(){if(!alive.current)return;setMic(false);sr.stop();stopVoice();
    const na=att+1;sAtt(na);
    if(na>=3){const pm='Despacio...';sMsg(pm);sSf('syl');sayFB(pm);setTimeout(()=>{if(alive.current)doSlowPlay()},800)}
    else if(na>=2){const pm='Por sílabas...';sMsg(pm);sSf('syl');sayFB(pm);setTimeout(()=>{if(alive.current)doSyllablePlay()},800)}
    else{const pm=pickMsg(false,null,'decir');sMsg(pm);sSf('wait');sayFB(pm);setTimeout(()=>{if(alive.current){sSf(null);doPlay()}},900)}}
  function hearAgain(){poke();stopVoice();sr.stop();sSf(null);setMic(false);setSylShow(false);doPlay()}
  function skip(){stopVoice();sr.stop();alive.current=false;onSkip()}
  const fc=stars>=4?GOLD:stars>=3?GREEN:stars>=2?BLUE:'#E67E22';
  let sylFlatIdx=0;
  return <div style={{textAlign:'center'}} onClick={poke}>
    {/* Phrase bubble */}
    <div style={{padding:'18px 24px',marginBottom:16,borderRadius:24,background:'rgba(255,255,255,.06)',border:'2px solid rgba(255,255,255,.1)'}}>
      <p style={{fontSize:26,fontWeight:700,margin:0,lineHeight:1.3,color:TXT}}>"{text}"</p>
    </div>
    {/* Syllable display */}
    {sylShow&&<div className="af" style={{background:PURPLE+'12',borderRadius:18,padding:14,marginBottom:14}}>
      <div style={{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center'}}>{syllables.map((wordSyls,wi)=>{
        const items=[];if(wi>0)items.push(<span key={'sp'+wi} style={{width:12}}/>);
        wordSyls.forEach((s,si)=>{const fi=sylFlatIdx++;const active=fi===sylIdx;const past=fi<sylIdx;
          items.push(<span key={wi+'_'+si} style={{fontSize:26,fontWeight:700,padding:'6px 10px',borderRadius:12,transition:'all .3s',background:active?GOLD+'44':past?GREEN+'22':'transparent',color:active?GOLD:past?GREEN:DIM,transform:active?'scale(1.15)':'scale(1)',textTransform:'uppercase'}}>{s}</span>)});
        return items})}</div>
    </div>}
    {/* Stars */}
    {stars>0&&<div className="ab" style={{marginBottom:12}}><Stars n={stars} sz={40}/></div>}
    {/* Feedback message */}
    {msg&&<div className={sf==='perfect'||sf==='ok'?'ab':'af'} style={{borderRadius:18,padding:14,marginBottom:12}}><p style={{fontSize:22,fontWeight:700,margin:0,color:fc}}>{msg}</p></div>}
    {idleMsg&&!sf&&!msg&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
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

function ExFlu({ex,onOk,onSkip,sex,name,uid,vids}){return <div style={{textAlign:'center',padding:12}}>
  <div style={{fontSize:100,marginBottom:12,lineHeight:1,filter:'drop-shadow(0 4px 12px rgba(0,0,0,.3))'}}>{ex.em}</div>
  <SpeakPanel text={ex.ph} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/></div>}

function ExFrases({ex,onOk,onSkip,sex,name,uid,vids}){
  const[ph,sPh]=useState('build');const[pl,sPl]=useState([]);const[av,sAv]=useState([]);const[bf,sBf]=useState(null);
  const words=useMemo(()=>ex.fu.replace(/[¿?¡!,\.]/g,'').split(/\s+/),[ex.fu]);const{idleMsg,poke}=useIdle(name,ph==='build'&&!bf);
  useEffect(()=>{sPh('build');sBf(null);sAv([...words].sort(()=>Math.random()-.5).map((w,i)=>({w,i,u:false})));sPl(Array(words.length).fill(null))},[ex]);
  function place(item){poke();const s=pl.findIndex(p=>p===null);if(s===-1)return;const np=[...pl];np[s]=item;sPl(np);sAv(a=>a.map(x=>x.i===item.i?{...x,u:true}:x));if(np.every(p=>p!==null)){const built=np.map(p=>p.w.toLowerCase()).join(' ');const target=words.map(w=>w.toLowerCase()).join(' ');if(built===target){sBf('ok');(async()=>{await cheerOrSay(rnd(BUILD_OK),uid,vids,'build');await new Promise(r=>setTimeout(r,400));const phr=await playRec(uid,vids,textKey(ex.fu));if(!phr)await say(ex.fu);await new Promise(r=>setTimeout(r,600));stopVoice();sPh('speak')})()}else{sBf('no');setTimeout(()=>{sPl(Array(words.length).fill(null));sAv(a=>a.map(x=>({...x,u:false})));sBf(null)},1000)}}}
  function undo(){poke();let li=-1;pl.forEach((p,i)=>{if(p)li=i});if(li===-1)return;const it=pl[li];const np=[...pl];np[li]=null;sPl(np);sAv(a=>a.map(x=>x.i===it.i?{...x,u:false}:x))}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}><div style={{fontSize:72,marginBottom:16,animation:'glow 3s infinite'}}>{ex.em}</div>
    {ph==='build'&&<div className="af"><div className="card" style={{marginBottom:16,background:BLUE+'0C',borderColor:BLUE+'33'}}><p style={{fontSize:22,fontWeight:600,margin:0,lineHeight:1.4,color:BLUE}}>{ex.q}</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:16,minHeight:56}}>{pl.map((p,i)=><div key={i} className={'ws '+(p?'ws-f':'ws-e')}>{p?p.w:'___'}</div>)}</div>
      {bf==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginBottom:14}}><Stars n={4} sz={36}/><p style={{fontSize:18,fontWeight:600,color:GREEN,margin:'8px 0 0'}}>¡Frase perfecta!</p></div>}
      {bf==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
      {idleMsg&&!bf&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
      {!bf&&<div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',marginBottom:14}}>{av.filter(x=>!x.u).map(x=><button key={x.i} className="btn btn-b btn-word" onClick={()=>place(x)}>{x.w}</button>)}</div>}
      <div style={{display:'flex',gap:10}}>{!bf&&pl.some(p=>p)&&<button className="btn btn-o btn-half" onClick={undo}>↩️ Borrar</button>}<button className="btn btn-p btn-half" onClick={()=>{poke();say(ex.fu)}}>🔊 Pista</button></div>
      <div style={{marginTop:14}}><button className="btn btn-ghost skip-btn" onClick={()=>{poke();stopVoice();onSkip()}}>⏭️ Saltar</button></div></div>}
    {ph==='speak'&&<SpeakPanel text={ex.fu} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/>}
  </div>}

function ExFrasesBlank({ex,onOk,onSkip,sex,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[ph,sPh]=useState('fill');const{idleMsg,poke}=useIdle(name,ph==='fill'&&!fb);
  useEffect(()=>{setAns('');setFb(null);sPh('fill');stopVoice();setTimeout(()=>say('Completa la frase'),400);return()=>stopVoice()},[ex]);
  function check(){poke();if(ans.trim().toLowerCase()===ex.blank.toLowerCase()){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{sPh('speak')})}
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

function ExSit({ex,onOk,onSkip,sex,name,uid,vids}){const[ph,sPh]=useState('choose');const[cf,sCf]=useState(null);const shuf=useMemo(()=>[...ex.op].sort(()=>Math.random()-.5),[ex]);const{idleMsg,poke}=useIdle(name,ph==='choose'&&!cf);useEffect(()=>{sPh('choose');sCf(null)},[ex]);function pick(o){poke();if(o===ex.op[0]){(async()=>{await cheerOrSay(rnd(BUILD_OK),uid,vids,'build');await new Promise(r=>setTimeout(r,400));const phr=await playRec(uid,vids,textKey(ex.su));if(!phr)await say(ex.su);await new Promise(r=>setTimeout(r,400));sPh('speak')})()}else{sCf('no');setTimeout(()=>sCf(null),1000)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}><div style={{fontSize:72,marginBottom:16}}>{ex.em}</div><div className="card" style={{marginBottom:16,background:BLUE+'0C',borderColor:BLUE+'33'}}><p style={{fontSize:20,fontWeight:600,margin:0,lineHeight:1.4}}>{ex.si}</p></div>
    {ph==='choose'&&<div className="af"><p style={{fontSize:20,color:GOLD,fontWeight:700,margin:'0 0 14px'}}>¿Qué dirías?</p>{cf==='no'&&<div className="as" style={{background:GOLD+'22',borderRadius:12,padding:12,marginBottom:12}}><p style={{fontSize:17,color:GOLD,margin:0}}>¡Casi! Prueba otra 💪</p></div>}{idleMsg&&!cf&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}<div style={{display:'flex',flexDirection:'column',gap:12}}>{shuf.map((o,i)=><button key={i} className="btn btn-b" onClick={()=>pick(o)} style={{textAlign:'left',fontSize:18}}>{o}</button>)}</div><div style={{marginTop:14}}><button className="btn btn-ghost skip-btn" onClick={()=>{poke();onSkip()}}>⏭️ Saltar</button></div></div>}
    {ph==='speak'&&<SpeakPanel text={ex.su} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/>}
  </div>}

function ExCount({num,onOk,onSkip,sex,name,uid,vids}){
  const text=NUMS_1_100[num-1]||String(num);
  useEffect(()=>{stopVoice();return()=>stopVoice()},[num]);
  return <div style={{textAlign:'center',padding:18}}><div style={{fontSize:100,fontWeight:700,color:GOLD,marginBottom:12,lineHeight:1}}>{num}</div><SpeakPanel text={text} exId={'cnt_'+num} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/></div>}

function genMath(lv){const ops=[];const rng=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  if(lv===1){for(let i=0;i<30;i++){const a=rng(1,10),b=rng(1,2);ops.push({q:`${a} + ${b}`,ans:a+b})}}
  else if(lv===2){for(let i=0;i<30;i++){const a=rng(5,20),b=Math.random()>.5?5:10;ops.push({q:`${a} + ${b}`,ans:a+b})}}
  else if(lv===3){for(let i=0;i<30;i++){const a=rng(3,15),b=rng(1,2);ops.push({q:`${a} - ${b}`,ans:a-b})}}
  else{for(let i=0;i<30;i++){if(Math.random()>.5){const a=rng(5,20),b=Math.random()>.5?5:10;ops.push({q:`${a} + ${b}`,ans:a+b})}else{const a=rng(5,20),b=Math.random()>.5?5:10;if(a>=b)ops.push({q:`${a} - ${b}`,ans:a-b});else ops.push({q:`${a} + ${b}`,ans:a+b})}}}
  return ops.sort(()=>Math.random()-.5)}

function Fingers({n,color=GOLD,color2=null}){const c2=color2||(color===GOLD?BLUE:color===BLUE?GREEN:BLUE);const groups=[];let rem=n;while(rem>0){groups.push(Math.min(rem,5));rem-=5}
  const intensities=[1,.92,.85,.95,.88];
  return <div style={{display:'flex',gap:8,justifyContent:'center',margin:'8px 0',flexWrap:'wrap'}}>{groups.map((g,gi)=>{const baseC=gi%2===0?color:c2;return <div key={gi} style={{display:'flex',gap:2,position:'relative'}}>{g===5&&<svg width={n>15?54:74} height={48} style={{position:'absolute',top:-2,left:-2,pointerEvents:'none'}}><path d={`M2,6 Q${n>15?27:37},0 ${n>15?52:72},6`} fill="none" stroke="#8B4513" strokeWidth={2} strokeLinecap="round"/><path d={`M${n>15?27:37},0 L${n>15?27:37},4`} fill="none" stroke="#8B4513" strokeWidth={2}/></svg>}{Array.from({length:g},(_,i)=>{const idx=gi*5+i;const int=intensities[i%5];return <div key={i} style={{width:n>15?10:14,height:40,borderRadius:n>15?5:7,background:baseC,border:'2px solid rgba(0,0,0,.2)',opacity:int,transition:'all .5s '+(idx*.12)+'s'}}/>})}</div>})}</div>}

function AnimCount({from,to,color=GREEN,speak=false}){const[cur,setCur]=useState(0);
  useEffect(()=>{setCur(0);let i=0;const t=setInterval(()=>{i++;setCur(i);if(speak&&i>from){stopVoice();say(NUMS_1_100[i-1]||String(i))}if(i>=to){clearInterval(t);if(speak)beep(880,150)}},speak?1200:800);return()=>{clearInterval(t);if(speak)stopVoice()}},[to,from,speak]);
  const sw=to>20?8:to>10?10:14;
  return <div style={{textAlign:'center'}}>
    <div style={{display:'flex',gap:to>20?2:4,justifyContent:'center',flexWrap:'wrap',margin:'8px 0',minHeight:50}}>{Array.from({length:to},(_,i)=><div key={i} style={{width:sw,height:46,borderRadius:Math.round(sw/2),background:i<cur?i<from?GOLD:color:BG3+'44',border:'2px solid '+(i<cur?'rgba(0,0,0,.2)':BORDER),transform:i<cur?'scaleY(1)':'scaleY(0.3)',transition:'all .6s',transformOrigin:'bottom',marginRight:(i+1)%5===0&&i<to-1?6:0}}/>)}</div>
    <div style={{fontSize:56,fontWeight:700,color:cur>=to?GREEN:GOLD,transition:'all .3s',minHeight:68}}>{cur>0?cur:''}</div>
  </div>}

function ExMath({ex,onOk,onSkip,sex,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[showHelp,setShowHelp]=useState(false);const{idleMsg,poke}=useIdle(name,!fb);
  const parts=ex.q.match(/(\d+)\s*([+\-])\s*(\d+)/);const a=parts?parseInt(parts[1]):0,op=parts?parts[2]:'+',b=parts?parseInt(parts[3]):0;
  useEffect(()=>{setAns('');setFb(null);setShowHelp(false);const t=setTimeout(()=>{stopVoice();const opW=ex.q.replace('+',' más ').replace('-',' menos ')+' es igual a...';say(opW)},500);return()=>{clearTimeout(t);stopVoice()}},[ex]);
  function check(){poke();const n=parseInt(ans);if(n===ex.ans){setFb('ok');starBeep(4);stopVoice();const opW=a+(op==='+'?' más ':' menos ')+b+' es igual a '+ex.ans;say(opW).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(onOk,250))}else{setFb('no');setShowHelp(true);stopVoice();sayFB('¡Vamos a contarlo juntos!')}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}><p style={{fontSize:36,fontWeight:700,margin:0,fontFamily:'monospace'}}>{ex.q} = ?</p></div>
    {!showHelp&&!fb&&<div>
      <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:12}}>
        <div style={{textAlign:'center'}}><Fingers n={a} color={'#E67E22'} color2={'#E67E22'}/><p style={{fontSize:16,color:'#E67E22',margin:0,fontWeight:700}}>{a}</p></div>
        <div style={{fontSize:32,color:op==='+'?GREEN:RED,fontWeight:700,alignSelf:'center'}}>{op}</div>
        <div style={{textAlign:'center'}}><Fingers n={b} color={BLUE} color2={BLUE}/><p style={{fontSize:16,color:BLUE,margin:0,fontWeight:700}}>{b}</p></div>
      </div>
      <NumPad value={ans} onChange={setAns} onSubmit={check} maxLen={3}/>
      <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:6}}><button className="btn btn-ghost btn-half skip-btn" style={{maxWidth:100}} onClick={()=>{stopVoice();onSkip()}}>⏭️</button></div>
    </div>}
    {fb==='ok'&&<div className="ab" style={{background:GREEN+'15',borderRadius:14,padding:20,marginBottom:14}}>
      <Stars n={4} sz={32}/>
      <AnimCount from={a} to={ex.ans} color={GREEN}/>
      <p style={{fontSize:24,color:GREEN,fontWeight:700,margin:'4px 0 0'}}>{a} {op} {b} = {ex.ans}</p>
    </div>}
    {showHelp&&fb==='no'&&<div className="af" style={{background:GOLD+'0C',borderRadius:14,padding:20,marginBottom:14}}>
      <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>¡Vamos a contarlo juntos!</p>
      <AnimCount from={op==='+'?a:0} to={op==='+'?ex.ans:a} color={op==='+'?GREEN:GOLD} speak={true}/>
      {op==='-'&&<div style={{margin:'8px 0'}}><p style={{fontSize:16,color:RED,fontWeight:700}}>Quitamos {b}</p><AnimCount from={0} to={ex.ans} color={GREEN}/></div>}
      <Fingers n={ex.ans} color={GREEN}/>
      <p style={{fontSize:24,color:GREEN,fontWeight:700,margin:'8px 0 0'}}>{a} {op} {b} = {ex.ans}</p>
      <button className="btn btn-g" onClick={()=>{setAns('');setFb(null);setShowHelp(false)}} style={{marginTop:12,fontSize:18}}>🔄 Intentar otra vez</button>
      <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:8,fontSize:16}}>⏭️ Siguiente</button>
    </div>}
    {idleMsg&&!fb&&!showHelp&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
  </div>}

function PieChart({num,den,size=120,color=GOLD,highlight=-1}){const slices=[];for(let i=0;i<den;i++){const a1=(i/den)*360-90,a2=((i+1)/den)*360-90;const r=size/2-4;const cx=size/2,cy=size/2;const x1=cx+r*Math.cos(a1*Math.PI/180),y1=cy+r*Math.sin(a1*Math.PI/180);const x2=cx+r*Math.cos(a2*Math.PI/180),y2=cy+r*Math.sin(a2*Math.PI/180);const large=360/den>180?1:0;const filled=i<num;const hl=i===highlight;slices.push(<path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={filled?color:BG3} stroke={hl?'#fff':BORDER} strokeWidth={hl?3:1.5} opacity={filled?1:0.4} style={{transition:'all .3s'}}/>)}
  return <svg width={size} height={size}>{slices}<circle cx={size/2} cy={size/2} r={size/2-4} fill="none" stroke={BORDER} strokeWidth={2}/></svg>}

function RectChart({num,den,width=160,height=100,color=GOLD,highlight=-1}){const gap=2;const pw=(width-gap*(den-1))/den;
  return <svg width={width} height={height}>{Array.from({length:den},(_,i)=>{const filled=i<num;const hl=i===highlight;return <rect key={i} x={i*(pw+gap)} y={4} width={pw} height={height-8} rx={4} fill={filled?color:BG3} stroke={hl?'#fff':BORDER} strokeWidth={hl?3:1.5} opacity={filled?1:0.4} style={{transition:'all .3s'}}/>})}</svg>}

function genFractions(lv){const fracs=[];
  if(!lv||lv===1){const pool=[[1,2],[1,3],[2,3],[1,4],[2,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,6],[2,6],[3,6],[4,6],[5,6]];
    pool.forEach(([n,d],i)=>{fracs.push({num:n,den:d,id:'frac_'+n+'_'+d,shape:Math.random()<.5?'circle':'rect',mode:'recognize'})});return[...fracs].sort(()=>Math.random()-.5)}
  if(lv===2){[[1,2],[1,3],[2,3],[1,4],[2,4],[3,4]].forEach(([n,d],i)=>{fracs.push({num:n,den:d,id:'frac2_'+n+'_'+d,shape:Math.random()<.5?'circle':'rect',mode:'notation'})});return[...fracs].sort(()=>Math.random()-.5)}
  if(lv===3){[[1,2,2,4],[1,3,2,6],[2,4,1,2],[2,6,1,3]].forEach(([n1,d1,n2,d2],i)=>{fracs.push({num:n1,den:d1,num2:n2,den2:d2,id:'frac3_'+i,shape:Math.random()<.5?'circle':'rect',mode:'equivalence'})});return[...fracs].sort(()=>Math.random()-.5)}
  if(lv===4){[[1,2,1,2],[1,3,1,3],[1,4,1,4],[1,3,2,3],[2,4,1,4]].forEach(([n1,d1,n2,d2],i)=>{fracs.push({num:n1,den:d1,num2:n2,den2:d2,ans_n:n1+n2,ans_d:d1,id:'frac4_'+i,shape:Math.random()<.5?'circle':'rect',mode:'add'})});return[...fracs].sort(()=>Math.random()-.5)}
  [[2,3,1,3],[1,2,1,2],[3,4,1,4],[2,3,2,3]].forEach(([n1,d1,n2,d2],i)=>{fracs.push({num:n1,den:d1,num2:n2,den2:d2,ans_n:n1-n2,ans_d:d1,id:'frac5_'+i,shape:Math.random()<.5?'circle':'rect',mode:'subtract'})});
  return[...fracs].sort(()=>Math.random()-.5)}

function ExFraction({ex,onOk,onSkip,name}){
  const[placed,setPlaced]=useState(0);const[fb,setFb]=useState(null);const[ans,setAns]=useState('');const{idleMsg,poke}=useIdle(name,!fb);
  const colors=[GOLD,BLUE,GREEN,PURPLE,'#E67E22',RED];const color=colors[ex.den%colors.length];
  const mode=ex.mode||'recognize';
  useEffect(()=>{setPlaced(0);setFb(null);setAns('');
    if(mode==='recognize')say(ex.num+' de '+ex.den);
    else if(mode==='notation')say(ex.num+' de '+ex.den+' se escribe así');
    else if(mode==='equivalence')say('¿Son iguales?');
    else if(mode==='add')say('Suma las fracciones');
    else say('Resta las fracciones')},[ex]);
  function addSlice(){poke();if(placed>=ex.den)return;const np=placed+1;setPlaced(np);beep(400+np*80,80)}
  function removeSlice(){poke();if(placed>0)setPlaced(placed-1)}
  function validate(){poke();if(placed===ex.num){setFb('ok');starBeep(4);sayFB('¡'+ex.num+' de '+ex.den+'!');setTimeout(onOk,800)}
    else{setFb('no');beep(200,200);sayFB('¡Casi! Necesitas '+ex.num+' porciones');setTimeout(()=>{setPlaced(0);setFb(null)},2000)}}
  function checkMathAns(){poke();const n=parseInt(ans);const target=mode==='add'?ex.ans_n:ex.ans_n;
    if(n===target){setFb('ok');starBeep(4);sayFB('¡Perfecto!');setTimeout(onOk,400)}
    else{setFb('no');beep(200,200);sayFB('La respuesta es '+target);setTimeout(()=>{setFb(null);setAns('')},2500)}}
  const isRect=ex.shape==='rect';
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {mode==='recognize'&&<div>
      <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}>
        <p style={{fontSize:28,fontWeight:700,margin:0}}>Pon <span style={{color:GOLD,fontSize:36}}>{ex.num}</span> de <span style={{color:BLUE,fontSize:36}}>{ex.den}</span></p>
        <p style={{fontSize:48,fontWeight:700,color:GOLD,margin:'4px 0 0',fontFamily:'monospace'}}><sup style={{fontSize:32}}>{ex.num}</sup>⁄<sub style={{fontSize:32}}>{ex.den}</sub></p>
        <p style={{fontSize:13,color:DIM,margin:'4px 0 0'}}>{isRect?'🍰 Tarta':'🍕 Pizza'}</p>
      </div>
      <div style={{display:'flex',justifyContent:'center',gap:24,marginBottom:16,alignItems:'center'}}>
        {isRect?<RectChart num={ex.num} den={ex.den} width={100} height={70} color={color+'88'}/>:<PieChart num={ex.num} den={ex.den} size={100} color={color+'88'}/>}
        <div style={{fontSize:28,color:DIM}}>→</div>
        {isRect?<RectChart num={placed} den={ex.den} width={160} height={100} color={color} highlight={placed<ex.den?placed:-1}/>:<PieChart num={placed} den={ex.den} size={140} color={color} highlight={placed<ex.den?placed:-1}/>}
      </div>
      {!fb&&<div>
        <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:14}}>
          <button className="btn btn-g" onClick={addSlice} style={{fontSize:22,maxWidth:160,padding:'16px 20px'}}>➕ Añadir</button>
          <button className="btn btn-o" onClick={removeSlice} disabled={placed===0} style={{fontSize:22,maxWidth:160,padding:'16px 20px'}}>➖ Quitar</button>
        </div>
        <p style={{fontSize:16,color:DIM,margin:'0 0 10px'}}>Llevas {placed} de {ex.den}</p>
        <button className="btn btn-g" onClick={validate} style={{fontSize:26,width:120,height:120,borderRadius:'50%',margin:'10px auto 12px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 18px '+GREEN+'55',padding:0,lineHeight:1.1,flexDirection:'column'}}><span style={{fontSize:32}}>✅</span><span style={{fontSize:18}}>¡Listo!</span></button>
      </div>}
    </div>}
    {mode==='notation'&&<div>
      <div className="card" style={{padding:24,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}>
        <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>Esta fracción se escribe:</p>
        <div style={{display:'flex',justifyContent:'center',gap:24,alignItems:'center',marginBottom:12}}>
          {isRect?<RectChart num={ex.num} den={ex.den} width={140} height={90} color={color}/>:<PieChart num={ex.num} den={ex.den} size={120} color={color}/>}
          <div style={{fontSize:64,fontWeight:700,color:GOLD,fontFamily:'monospace'}}><sup style={{fontSize:42}}>{ex.num}</sup>⁄<sub style={{fontSize:42}}>{ex.den}</sub></div>
        </div>
        <p style={{fontSize:22,color:TXT,margin:0}}>{ex.num} {ex.num===1?'trozo':'trozos'} de {ex.den} = <span style={{color:GOLD,fontWeight:700}}>{ex.num}/{ex.den}</span></p>
      </div>
      <button className="btn btn-g" onClick={()=>{setFb('ok');starBeep(3);setTimeout(onOk,400)}} style={{fontSize:22,maxWidth:220,margin:'0 auto'}}>✅ ¡Entendido!</button>
    </div>}
    {mode==='equivalence'&&<div>
      <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}>
        <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>¡Son iguales!</p>
        <div style={{display:'flex',justifyContent:'center',gap:16,alignItems:'center'}}>
          <div style={{textAlign:'center'}}>
            {isRect?<RectChart num={ex.num} den={ex.den} width={120} height={80} color={BLUE}/>:<PieChart num={ex.num} den={ex.den} size={100} color={BLUE}/>}
            <p style={{fontSize:24,fontWeight:700,color:BLUE,margin:'4px 0 0'}}>{ex.num}/{ex.den}</p>
          </div>
          <div style={{fontSize:32,color:GREEN,fontWeight:700}}>=</div>
          <div style={{textAlign:'center'}}>
            {isRect?<RectChart num={ex.num2} den={ex.den2} width={120} height={80} color={GREEN}/>:<PieChart num={ex.num2} den={ex.den2} size={100} color={GREEN}/>}
            <p style={{fontSize:24,fontWeight:700,color:GREEN,margin:'4px 0 0'}}>{ex.num2}/{ex.den2}</p>
          </div>
        </div>
        <p style={{fontSize:18,color:TXT,margin:'12px 0 0'}}>La mitad es lo mismo, ¡mira!</p>
      </div>
      <button className="btn btn-g" onClick={()=>{setFb('ok');starBeep(3);setTimeout(onOk,400)}} style={{fontSize:22,maxWidth:220,margin:'0 auto'}}>✅ ¡Entendido!</button>
    </div>}
    {(mode==='add'||mode==='subtract')&&<div>
      <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}>
        <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>{mode==='add'?'Suma':'Resta'} las fracciones</p>
        <div style={{display:'flex',justifyContent:'center',gap:12,alignItems:'center',marginBottom:12}}>
          <div style={{textAlign:'center'}}>
            {isRect?<RectChart num={ex.num} den={ex.den} width={100} height={70} color={BLUE}/>:<PieChart num={ex.num} den={ex.den} size={90} color={BLUE}/>}
            <p style={{fontSize:20,fontWeight:700,color:BLUE,margin:'4px 0 0'}}>{ex.num}/{ex.den}</p>
          </div>
          <div style={{fontSize:28,color:mode==='add'?GREEN:RED,fontWeight:700}}>{mode==='add'?'+':'-'}</div>
          <div style={{textAlign:'center'}}>
            {isRect?<RectChart num={ex.num2} den={ex.den2} width={100} height={70} color={'#E67E22'}/>:<PieChart num={ex.num2} den={ex.den2} size={90} color={'#E67E22'}/>}
            <p style={{fontSize:20,fontWeight:700,color:'#E67E22',margin:'4px 0 0'}}>{ex.num2}/{ex.den2}</p>
          </div>
          <div style={{fontSize:28,color:DIM}}>=</div>
          <div style={{fontSize:28,fontWeight:700,color:GOLD}}>?/{ex.den}</div>
        </div>
      </div>
      <NumPad value={ans} onChange={setAns} onSubmit={checkMathAns} maxLen={2}/>
    </div>}
    {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginBottom:14}}><Stars n={4} sz={36}/><p style={{fontSize:20,fontWeight:600,color:GREEN,margin:'8px 0 0'}}>¡Perfecto!</p></div>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{fontSize:16,marginTop:8}}>⏭️ Saltar</button>
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
  </div>}

// ===== MULTIPLICACIONES =====
function genMulti(lv){const ops=[];const rng=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  if(lv===1){for(let i=0;i<20;i++){const f=Math.random()>.5?2:3;const n=rng(1,10);ops.push({a:n,b:f,ans:n*f})}}
  else if(lv===2){for(let i=0;i<20;i++){const f=Math.random()>.5?5:10;const n=rng(1,10);ops.push({a:n,b:f,ans:n*f})}}
  else{for(let i=0;i<20;i++){const f=[2,3,5,10][rng(0,3)];const n=rng(1,10);ops.push({a:n,b:f,ans:n*f})}}
  return ops.sort(()=>Math.random()-.5)}

function ExMulti({ex,onOk,onSkip,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[showHelp,setShowHelp]=useState(false);const{idleMsg,poke}=useIdle(name,!fb);
  const groups=Array.from({length:ex.b},(_,i)=>i);const emojis=['🍎','🌟','🔵','🟢','🟡','🟣','🔴','🍊','🍋','💎'];const em=emojis[ex.a%emojis.length];
  useEffect(()=>{setAns('');setFb(null);setShowHelp(false);stopVoice();setTimeout(()=>say(ex.a+' por '+ex.b),400);return()=>stopVoice()},[ex]);
  function check(){poke();const n=parseInt(ans);if(n===ex.ans){setFb('ok');starBeep(4);stopVoice();say(ex.a+' por '+ex.b+' es igual a '+ex.ans).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(onOk,250))}
  else{setFb('no');setShowHelp(true);stopVoice();const sumText=Array(ex.b).fill(ex.a).join(' más ')+' es igual a '+ex.ans;sayFB('Mira: '+ex.a+' por '+ex.b+' es '+sumText)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}><p style={{fontSize:36,fontWeight:700,margin:0,fontFamily:'monospace'}}>{ex.a} x {ex.b} = ?</p></div>
    <div style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center',marginBottom:16}}>{groups.map(g=><div key={g} style={{display:'flex',gap:2,background:CARD,border:'2px solid '+BORDER,borderRadius:10,padding:'6px 10px'}}>{Array.from({length:ex.a},(_,j)=><span key={j} style={{fontSize:20}}>{em}</span>)}</div>)}</div>
    {!showHelp&&!fb&&<div>
      <NumPad value={ans} onChange={setAns} onSubmit={check} maxLen={3}/>
      <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:6}}><button className="btn btn-ghost btn-half skip-btn" style={{maxWidth:100}} onClick={()=>{stopVoice();onSkip()}}>⏭️</button></div>
    </div>}
    {fb==='ok'&&<div className="ab" style={{background:GREEN+'15',borderRadius:14,padding:20,marginBottom:14}}>
      <Stars n={4} sz={32}/><p style={{fontSize:24,color:GREEN,fontWeight:700,margin:'8px 0 0'}}>{ex.a} x {ex.b} = {ex.ans}</p>
    </div>}
    {showHelp&&fb==='no'&&<div className="af" style={{background:GOLD+'0C',borderRadius:14,padding:20,marginBottom:14}}>
      <p style={{fontSize:18,fontWeight:600,margin:'0 0 12px',color:GOLD}}>¡Vamos a sumarlos!</p>
      <p style={{fontSize:20,color:TXT,margin:'0 0 8px'}}>{Array(ex.b).fill(ex.a).join(' + ')} = <span style={{color:GREEN,fontWeight:700}}>{ex.ans}</span></p>
      <button className="btn btn-g" onClick={()=>{setAns('');setFb(null);setShowHelp(false)}} style={{marginTop:12,fontSize:18}}>🔄 Intentar</button>
      <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:8,fontSize:16}}>⏭️ Siguiente</button>
    </div>}
    {idleMsg&&!fb&&!showHelp&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
  </div>}

// ===== MONEDAS Y BILLETES =====
const COINS=[{v:0.01,l:'1c',c:'#B87333',c2:'#8B5E3C',sz:36},{v:0.02,l:'2c',c:'#B87333',c2:'#8B5E3C',sz:38},{v:0.05,l:'5c',c:'#B87333',c2:'#8B5E3C',sz:40},{v:0.10,l:'10c',c:'#DAA520',c2:'#B8860B',sz:38},{v:0.20,l:'20c',c:'#DAA520',c2:'#B8860B',sz:40},{v:0.50,l:'50c',c:'#DAA520',c2:'#B8860B',sz:44},{v:1,l:'1€',c:'#C0C0C0',c2:'#DAA520',sz:48,bi:true},{v:2,l:'2€',c:'#DAA520',c2:'#C0C0C0',sz:50,bi:true}];
const BILLS=[{v:5,l:'5€',c:'#7B7B7B',c2:'#9E9E9E'},{v:10,l:'10€',c:'#C0392B',c2:'#E74C3C'},{v:20,l:'20€',c:'#2471A3',c2:'#3498DB'},{v:50,l:'50€',c:'#D35400',c2:'#E67E22'}];

function genMoney(lv){const items=[];
  if(lv===1){COINS.concat(BILLS.slice(0,2)).forEach(c=>{items.push({ty:'money',mode:'recognize',coin:c,id:'mon_'+c.l})});return items.sort(()=>Math.random()-.5).slice(0,15)}
  if(lv===2){for(let i=0;i<15;i++){const n=2+Math.floor(Math.random()*3);const pool=COINS.filter(c=>c.v>=0.10).concat(BILLS.slice(0,2));const sel=Array.from({length:n},()=>pool[Math.floor(Math.random()*pool.length)]);const total=sel.reduce((s,c)=>s+c.v,0);items.push({ty:'money',mode:'sum',coins:sel,total:Math.round(total*100)/100,id:'mon_sum_'+i})}return items}
  if(lv===3){for(let i=0;i<12;i++){const price=Math.round((Math.random()*9+1)*100)/100;const available=COINS.filter(c=>c.v>=0.10).concat(BILLS.slice(0,3));items.push({ty:'money',mode:'pay',price,available,id:'mon_pay_'+i})}return items}
  for(let i=0;i<12;i++){const price=Math.round((Math.random()*15+2)*100)/100;const paid=Math.ceil(price/5)*5;items.push({ty:'money',mode:'change',price,paid,change:Math.round((paid-price)*100)/100,id:'mon_chg_'+i})}return items}

function ExMoney({ex,onOk,onSkip,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[sel,setSel]=useState([]);const{idleMsg,poke}=useIdle(name,!fb);
  useEffect(()=>{setAns('');setFb(null);setSel([]);stopVoice();
    if(ex.mode==='recognize')setTimeout(()=>say('¿Cuánto vale esta moneda?'),400);
    else if(ex.mode==='sum')setTimeout(()=>say('¿Cuánto hay en total?'),400);
    else if(ex.mode==='pay')setTimeout(()=>say('Paga '+ex.price.toFixed(2).replace('.',',')+' euros'),400);
    else setTimeout(()=>say('¿Cuánto cambio te dan?'),400);
    return()=>stopVoice()},[ex]);
  function checkAns(){poke();const n=parseFloat(ans.replace(',','.'));const target=ex.mode==='recognize'?ex.coin.v:ex.mode==='sum'?ex.total:ex.mode==='change'?ex.change:ex.price;
    if(Math.abs(n-target)<0.005){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
    else{setFb('no');stopVoice();sayFB('La respuesta es '+target.toFixed(2).replace('.',',')+' euros');setTimeout(()=>{setFb(null);setAns('')},2500)}}
  function addCoin(c){poke();const ns=[...sel,c];setSel(ns);const total=ns.reduce((s,x)=>s+x.v,0);beep(400+total*50,80);if(Math.abs(total-ex.price)<0.005){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}}
  const CoinSVG=({c,sz})=>{const copper=c.v<=0.05;const gold=c.v>=0.10&&c.v<=0.50;const bi=c.bi;
    const outerC=bi?'#C0C0C0':copper?'#B87333':gold?'#FFD700':'#C0C0C0';
    const borderC=copper?'#7A4E2D':gold?'#B8860B':bi?'#909090':'#888';
    const outerDark=bi?'#A8A8A8':copper?'#9A6233':gold?'#DAA520':'#A8A8A8';
    const innerLight=bi?'#D8D8D8':copper?'#CD8544':gold?'#FFE44D':'#D0D0D0';
    const txtC=copper?'#4A2800':gold?'#5C3D00':bi?'#3A2800':'#333';
    const gid='cg'+String(c.v).replace('.','_')+'_'+sz;
    return <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
      <defs>
        <radialGradient id={gid+'bg'} cx="45%" cy="38%"><stop offset="0%" stopColor={innerLight}/><stop offset="70%" stopColor={outerC}/><stop offset="100%" stopColor={outerDark}/></radialGradient>
        <radialGradient id={gid+'sh'} cx="38%" cy="30%"><stop offset="0%" stopColor="rgba(255,255,255,.55)"/><stop offset="50%" stopColor="rgba(255,255,255,.08)"/><stop offset="100%" stopColor="rgba(0,0,0,.18)"/></radialGradient>
        {bi&&<radialGradient id={gid+'in'} cx="45%" cy="38%"><stop offset="0%" stopColor="#FFE44D"/><stop offset="70%" stopColor="#FFD700"/><stop offset="100%" stopColor="#DAA520"/></radialGradient>}
      </defs>
      <circle cx={sz/2} cy={sz/2} r={sz/2-1} fill={borderC}/>
      <circle cx={sz/2} cy={sz/2} r={sz/2-3} fill={`url(#${gid}bg)`}/>
      {bi&&<><circle cx={sz/2} cy={sz/2} r={sz/2-12} fill={borderC}/><circle cx={sz/2} cy={sz/2} r={sz/2-14} fill={`url(#${gid}in)`}/></>}
      <circle cx={sz/2} cy={sz/2} r={sz/2-3} fill={`url(#${gid}sh)`}/>
      <text x={sz/2} y={sz/2+1} textAnchor="middle" dominantBaseline="central" fill={txtC} fontSize={sz>=80?24:sz>=60?20:sz>=50?17:14} fontWeight="800" fontFamily="Fredoka" style={{textShadow:'0 1px 0 rgba(255,255,255,.4)'}}>{c.l}</text>
    </svg>};
  const Coin=({c,onClick,size})=>{const sz=size||Math.min(100,Math.max(70,c.sz?Math.round(c.sz*2):70));const[imgOk,setImgOk]=useState(true);const imgSrc='/img/money/coin_'+c.l.replace('€','e').replace('c','')+'.png';
    return <button onClick={onClick} style={{width:sz,height:sz,borderRadius:'50%',border:'none',background:'none',padding:0,cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',filter:'drop-shadow(2px 3px 5px rgba(0,0,0,.45))',transition:'transform .1s',WebkitTapHighlightColor:'transparent'}} onPointerDown={e=>e.currentTarget.style.transform='scale(.93)'} onPointerUp={e=>e.currentTarget.style.transform='scale(1)'} onPointerLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      {imgOk?<img src={imgSrc} alt={c.l} style={{width:sz,height:sz,borderRadius:'50%',objectFit:'cover'}} onError={()=>setImgOk(false)}/>:<CoinSVG c={c} sz={sz}/>}
    </button>};
  const BillSVG=({b,w,h})=>{const bgC=b.v===5?'#A0A0A0':b.v===10?'#E74C3C':b.v===20?'#3498DB':'#E67E22';
    const bgLight=b.v===5?'#BFBFBF':b.v===10?'#F1948A':b.v===20?'#7FB3D8':'#F0B27A';
    const bgDark=b.v===5?'#808080':b.v===10?'#C0392B':b.v===20?'#2471A3':'#D35400';
    const gid='bl'+b.v;
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={gid+'bg'} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={bgLight}/><stop offset="50%" stopColor={bgC}/><stop offset="100%" stopColor={bgDark}/></linearGradient>
        <pattern id={gid+'pt'} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,.12)"/><line x1="0" y1="0" x2="20" y2="20" stroke="rgba(255,255,255,.06)" strokeWidth=".5"/></pattern>
      </defs>
      <rect x="1" y="1" width={w-2} height={h-2} rx="8" ry="8" fill={`url(#${gid}bg)`} stroke={bgDark} strokeWidth="2"/>
      <rect x="1" y="1" width={w-2} height={h-2} rx="8" ry="8" fill={`url(#${gid}pt)`}/>
      <rect x="6" y="6" width={w-12} height={h-12} rx="5" ry="5" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1" strokeDasharray="4 3"/>
      <path d={`M${w/2-18} ${h-20} Q${w/2-10} ${h-38} ${w/2} ${h-38} Q${w/2+10} ${h-38} ${w/2+18} ${h-20}`} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
      <line x1={w/2-20} y1={h-18} x2={w/2-14} y2={h-18} stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
      <line x1={w/2+14} y1={h-18} x2={w/2+20} y2={h-18} stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
      <text x={w/2} y={h/2-2} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="28" fontWeight="800" fontFamily="Fredoka" style={{textShadow:'0 2px 3px rgba(0,0,0,.35)'}}>{b.l}</text>
      <text x={12} y={16} textAnchor="start" dominantBaseline="central" fill="rgba(255,255,255,.5)" fontSize="11" fontWeight="700" fontFamily="Fredoka">{b.l}</text>
      <text x={w-12} y={h-14} textAnchor="end" dominantBaseline="central" fill="rgba(255,255,255,.5)" fontSize="11" fontWeight="700" fontFamily="Fredoka">{b.l}</text>
    </svg>};
  const Bill=({b,onClick})=>{const[imgOk,setImgOk]=useState(true);const imgSrc='/img/money/bill_'+b.v+'.png';const bw=200;const bh=105;
    return <button onClick={onClick} style={{width:bw,height:bh,borderRadius:10,border:'none',padding:0,cursor:'pointer',overflow:'hidden',boxShadow:'3px 3px 8px rgba(0,0,0,.5)',position:'relative',transition:'transform .1s',WebkitTapHighlightColor:'transparent'}} onPointerDown={e=>e.currentTarget.style.transform='scale(.95)'} onPointerUp={e=>e.currentTarget.style.transform='scale(1)'} onPointerLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      {imgOk?<img src={imgSrc} alt={b.l} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:10}} onError={()=>setImgOk(false)}/>:<BillSVG b={b} w={bw} h={bh}/>}
    </button>};
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {ex.mode==='recognize'&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,maxWidth:700,margin:'0 auto'}}>
      <div className="card" style={{padding:24,flex:'1 1 0',display:'flex',flexDirection:'column',alignItems:'center',minHeight:180}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 16px',color:GOLD}}>¿Cuánto vale?</p>
        {ex.coin.v>=5?<Bill b={ex.coin}/>:<Coin c={ex.coin} size={140}/>}</div>
      <div style={{flex:'0 0 auto'}}><NumPad value={ans} onChange={setAns} onSubmit={checkAns} maxLen={5} decimal={true}/></div>
    </div>}
    {ex.mode==='sum'&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,maxWidth:700,margin:'0 auto'}}>
      <div className="card" style={{padding:20,flex:'1 1 0'}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>¿Cuánto hay?</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>{ex.coins.map((c,i)=>c.v>=5?<Bill key={i} b={c}/>:<Coin key={i} c={c}/>)}</div></div>
      <div style={{flex:'0 0 auto'}}><NumPad value={ans} onChange={setAns} onSubmit={checkAns} maxLen={5} decimal={true}/></div>
    </div>}
    {ex.mode==='pay'&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:22,fontWeight:700,margin:'0 0 8px',color:GOLD}}>Paga: {ex.price.toFixed(2).replace('.',',')} €</p>
        <p style={{fontSize:14,color:DIM,margin:0}}>Toca las monedas para pagar</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:12}}>
        {sel.map((c,i)=><Coin key={i} c={c}/>)}{sel.length===0&&<p style={{color:DIM,fontSize:14}}>Arrastra aquí</p>}</div>
      <p style={{fontSize:18,color:sel.reduce((s,c)=>s+c.v,0)>=ex.price?GREEN:BLUE,fontWeight:700}}>{sel.reduce((s,c)=>s+c.v,0).toFixed(2).replace('.',',')} €</p>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:12,padding:10,background:BG3,borderRadius:12}}>
        {COINS.filter(c=>c.v>=0.10).map((c,i)=><Coin key={i} c={c} onClick={()=>addCoin(c)}/>)}
        {BILLS.slice(0,3).map((b,i)=><Bill key={i} b={b} onClick={()=>addCoin(b)}/>)}</div>
      <button className="btn btn-ghost" onClick={()=>{setSel([])}} style={{fontSize:14,marginBottom:8}}>↩️ Borrar</button>
      <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{fontSize:14}}>⏭️ Saltar</button>
    </div>}
    {ex.mode==='change'&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,maxWidth:700,margin:'0 auto'}}>
      <div className="card" style={{padding:24,flex:'1 1 0',minHeight:120}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 10px',color:GOLD}}>Cuesta {ex.price.toFixed(2).replace('.',',')} €</p>
        <p style={{fontSize:18,color:TXT,margin:0}}>Pagas con {ex.paid} €. ¿Cuánto cambio?</p></div>
      <div style={{flex:'0 0 auto'}}><NumPad value={ans} onChange={setAns} onSubmit={checkAns} maxLen={5} decimal={true}/></div>
    </div>}
    {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! Prueba otra vez 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
  </div>}

// ===== LA HORA =====
function clockText(h,m){return m===0?(h===1?'la una en punto':'las '+h+' en punto'):m===30?(h===1?'la una':'las '+h)+' y media':m===15?(h===1?'la una':'las '+h)+' y cuarto':(h===1?'la una':'las '+h)+' menos cuarto'}

function genClock(lv){const items=[];
  if(lv===1){for(let h=1;h<=12;h++)items.push({ty:'clock',h,m:0,text:clockText(h,0),id:'clk_'+h+'_0'})}
  else if(lv===2){for(let h=1;h<=12;h++){items.push({ty:'clock',h,m:30,text:clockText(h,30),id:'clk_'+h+'_30'})}}
  else{for(let h=1;h<=12;h++){items.push({ty:'clock',h,m:15,text:clockText(h,15),id:'clk_'+h+'_15'});items.push({ty:'clock',h,m:45,text:clockText(h,45),id:'clk_'+h+'_45'})}}
  return items.sort(()=>Math.random()-.5)}

function ClockFace({h,m,size=160}){
  const cx=size/2,cy=size/2,r=size/2-8;
  const mAngle=(m/60)*360-90,hAngle=((h%12)/12)*360+(m/60)*30-90;
  const mr=r*0.7,hr=r*0.5;
  return <svg width={size} height={size}>
    <circle cx={cx} cy={cy} r={r} fill={BG3} stroke={GOLD} strokeWidth={3}/>
    {Array.from({length:12},(_,i)=>{const a=((i+1)/12)*360-90;const x=cx+(r-16)*Math.cos(a*Math.PI/180);const y=cy+(r-16)*Math.sin(a*Math.PI/180);return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={TXT} fontSize={size>120?16:12} fontWeight={700} fontFamily="Fredoka">{i+1}</text>})}
    <line x1={cx} y1={cy} x2={cx+hr*Math.cos(hAngle*Math.PI/180)} y2={cy+hr*Math.sin(hAngle*Math.PI/180)} stroke={GOLD} strokeWidth={4} strokeLinecap="round"/>
    <line x1={cx} y1={cy} x2={cx+mr*Math.cos(mAngle*Math.PI/180)} y2={cy+mr*Math.sin(mAngle*Math.PI/180)} stroke={BLUE} strokeWidth={3} strokeLinecap="round"/>
    <circle cx={cx} cy={cy} r={4} fill={GOLD}/>
  </svg>}

function ExClock({ex,onOk,onSkip,name,uid,vids}){
  const opts=useMemo(()=>{const correct=ex.text;const pool=[];for(let h=1;h<=12;h++){for(const m of [0,15,30,45]){const t=clockText(h,m);if(t!==correct)pool.push(t)}}const wrong=[];const shuffled=[...pool].sort(()=>Math.random()-.5);for(const t of shuffled){if(wrong.length>=3)break;if(t!==correct&&!wrong.includes(t))wrong.push(t)}const result=[...wrong,correct];const unique=[...new Set(result)];if(!unique.includes(correct)){unique.pop();unique.push(correct)}return unique.sort(()=>Math.random()-.5)},[ex]);
  const[fb,setFb]=useState(null);const{idleMsg,poke}=useIdle(name,!fb);
  useEffect(()=>{setFb(null);stopVoice();setTimeout(()=>say('¿Qué hora es?'),400);return()=>stopVoice()},[ex]);
  function pick(t){poke();if(t===ex.text){setFb('ok');starBeep(4);stopVoice();say('Son '+ex.text).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(onOk,250))}
    else{setFb('no');beep(200,200);setTimeout(()=>setFb(null),1200)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 14px',color:GOLD}}>¿Qué hora es?</p>
      <div style={{display:'flex',justifyContent:'center'}}><ClockFace h={ex.h} m={ex.m}/></div></div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>{opts.map((o,i)=><button key={i} className={'btn '+(fb==='ok'&&o===ex.text?'btn-g':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:18,textAlign:'left'}}>{o.charAt(0).toUpperCase()+o.slice(1)}</button>)}</div>
    {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! Prueba otra 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}

// DEV: verify ExClock options always contain the correct answer
if(import.meta.env.DEV){(()=>{let fails=0;for(const lv of [1,2,3]){const exs=genClock(lv);for(let i=0;i<20;i++){const ex=exs[i%exs.length];const correct=ex.text;const pool=[];for(let h=1;h<=12;h++){for(const m of [0,15,30,45]){const t=clockText(h,m);if(t!==correct)pool.push(t)}}const wrong=[];const shuffled=[...pool].sort(()=>Math.random()-.5);for(const t of shuffled){if(wrong.length>=3)break;if(t!==correct&&!wrong.includes(t))wrong.push(t)}const result=[...wrong,correct];const unique=[...new Set(result)];if(!unique.includes(correct)){fails++;console.error('ExClock BUG: correct answer missing!',{correct,unique,lv,ex})}if(unique.length!==4){fails++;console.error('ExClock BUG: expected 4 options, got '+unique.length,{correct,unique,lv})}}}console.log('[ExClock test] '+(fails===0?'PASS: all 60 tests OK':'FAIL: '+fails+' failures'))})()}

// ===== CALENDARIO / TEMPORALIDAD =====
const DIAS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function genCalendar(lv){const items=[];
  if(lv===1){DIAS.forEach((d,i)=>{items.push({ty:'calendar',mode:'order_days',correct:DIAS,id:'cal_days_'+i})});return[items[0]]}
  if(lv===2){MESES.forEach((m,i)=>{items.push({ty:'calendar',mode:'order_months',correct:MESES,id:'cal_months_'+i})});return[items[0]]}
  if(lv===3){for(let i=0;i<10;i++){const di=Math.floor(Math.random()*7);items.push({ty:'calendar',mode:'before_after_day',day:DIAS[di],dayIdx:di,id:'cal_ba_d_'+i})}return items}
  for(let i=0;i<10;i++){const r=Math.random();if(r<0.33){items.push({ty:'calendar',mode:'yesterday_tomorrow',id:'cal_yt_'+i})}
    else if(r<0.66){const di=Math.floor(Math.random()*7);items.push({ty:'calendar',mode:'before_after_day',day:DIAS[di],dayIdx:di,id:'cal_ba2_'+i})}
    else{const mi=Math.floor(Math.random()*12);items.push({ty:'calendar',mode:'before_after_month',month:MESES[mi],monthIdx:mi,id:'cal_bam_'+i})}}
  return items.sort(()=>Math.random()-.5)}

function ExCalendar({ex,onOk,onSkip,name,uid,vids}){
  const[placed,setPlaced]=useState([]);const[avail,setAvail]=useState([]);const[fb,setFb]=useState(null);const[ans,setAns]=useState('');const{idleMsg,poke}=useIdle(name,!fb);
  const[baAns,setBaAns]=useState({before:null,after:null});const[baOpts,setBaOpts]=useState([]);
  const[ytAns,setYtAns]=useState({ayer:null,manana:null});
  useEffect(()=>{setFb(null);setAns('');setBaAns({before:null,after:null});setYtAns({ayer:null,manana:null});stopVoice();
    if(ex.mode==='order_days'){const s=[...DIAS].sort(()=>Math.random()-.5);setAvail(s);setPlaced([]);setTimeout(()=>say('Ordena los días de la semana'),400)}
    else if(ex.mode==='order_months'){const s=[...MESES].sort(()=>Math.random()-.5);setAvail(s);setPlaced([]);setTimeout(()=>say('Ordena los meses del año'),400)}
    else if(ex.mode==='before_after_day'){const target=DIAS;const idx=ex.dayIdx;const max=target.length;const before=target[(idx-1+max)%max];const after=target[(idx+1)%max];const distractors=target.filter(d=>d!==before&&d!==after&&d!==ex.day);const picks=[before,after,...[...distractors].sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);setBaOpts(picks);setTimeout(()=>say('¿Qué día va antes y después de '+ex.day+'?'),400)}
    else if(ex.mode==='before_after_month'){const target=MESES;const idx=ex.monthIdx;const max=target.length;const before=target[(idx-1+max)%max];const after=target[(idx+1)%max];const distractors=target.filter(d=>d!==before&&d!==after&&d!==ex.month);const picks=[before,after,...[...distractors].sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);setBaOpts(picks);setTimeout(()=>say('¿Qué mes va antes y después de '+ex.month+'?'),400)}
    else{const hoy=DIAS[new Date().getDay()===0?6:new Date().getDay()-1];setTimeout(()=>say('Hoy es '+hoy+'. ¿Qué día fue ayer y cuál será mañana?'),400)}
    return()=>stopVoice()},[ex]);
  function place(item){poke();const np=[...placed,item];setPlaced(np);setAvail(a=>a.filter(x=>x!==item));const target=ex.mode==='order_days'?DIAS:MESES;
    if(np.length===target.length){if(np.every((d,i)=>d===target[i])){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
    else{setFb('no');beep(200,200);setTimeout(()=>{setPlaced([]);setAvail([...target].sort(()=>Math.random()-.5));setFb(null)},1500)}}}
  function pickBA(slot,val){poke();const newAns={...baAns,[slot]:val};setBaAns(newAns);
    if(newAns.before&&newAns.after){const target=ex.mode==='before_after_day'?DIAS:MESES;const idx=ex.mode==='before_after_day'?ex.dayIdx:ex.monthIdx;const max=target.length;
      const correctBefore=target[(idx-1+max)%max];const correctAfter=target[(idx+1)%max];
      if(newAns.before===correctBefore&&newAns.after===correctAfter){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
      else{setFb('no');beep(200,200);stopVoice();sayFB('Antes: '+correctBefore+'. Después: '+correctAfter);setTimeout(()=>{setFb(null);setBaAns({before:null,after:null})},3000)}}}
  function pickYT(slot,val){poke();const newAns={...ytAns,[slot]:val};setYtAns(newAns);
    if(newAns.ayer&&newAns.manana){const di=new Date().getDay()===0?6:new Date().getDay()-1;const correctAyer=DIAS[(di-1+7)%7];const correctMan=DIAS[(di+1)%7];
      if(newAns.ayer===correctAyer&&newAns.manana===correctMan){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
      else{setFb('no');beep(200,200);stopVoice();sayFB('Ayer fue '+correctAyer+' y mañana será '+correctMan);setTimeout(()=>{setFb(null);setYtAns({ayer:null,manana:null})},3000)}}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {(ex.mode==='order_days'||ex.mode==='order_months')&&<div>
      <div className="card" style={{padding:16,marginBottom:14}}><p style={{fontSize:20,fontWeight:700,margin:0,color:GOLD}}>{ex.mode==='order_days'?'Ordena los días':'Ordena los meses'}</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:12,minHeight:44}}>{placed.map((d,i)=><span key={i} style={{background:GREEN+'33',borderRadius:8,padding:'8px 12px',fontSize:15,fontWeight:600,color:GREEN}}>{d}</span>)}</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:12}}>{avail.map(d=><button key={d} className="btn btn-b btn-word" onClick={()=>place(d)} style={{fontSize:15,padding:'10px 14px'}}>{d}</button>)}</div>
      {placed.length>0&&!fb&&<button className="btn btn-o" onClick={()=>{setPlaced([]);setAvail([...(ex.mode==='order_days'?DIAS:MESES)].sort(()=>Math.random()-.5))}} style={{fontSize:14,maxWidth:150,margin:'0 auto'}}>↩️ Borrar</button>}
    </div>}
    {(ex.mode==='before_after_day'||ex.mode==='before_after_month')&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px',color:GOLD}}>{ex.mode==='before_after_day'?'¿Qué va antes y después?':'¿Qué mes va antes y después?'}</p><p style={{fontSize:32,fontWeight:700,color:BLUE,margin:0}}>{ex.mode==='before_after_day'?ex.day:ex.month}</p></div>
      <div style={{display:'flex',gap:16,justifyContent:'center',marginBottom:14}}>
        <div style={{flex:1,maxWidth:180}}>
          <p style={{fontSize:16,color:BLUE,margin:'0 0 6px',fontWeight:700}}>← ANTES</p>
          <div style={{minHeight:60,background:baAns.before?BLUE+'22':CARD,border:'3px solid '+(baAns.before?BLUE:BORDER),borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',padding:10}}>
            <span style={{fontSize:22,fontWeight:700,color:baAns.before?BLUE:DIM}}>{baAns.before||'___'}</span>
          </div>
        </div>
        <div style={{flex:1,maxWidth:180}}>
          <p style={{fontSize:16,color:'#E67E22',margin:'0 0 6px',fontWeight:700}}>DESPUÉS →</p>
          <div style={{minHeight:60,background:baAns.after?'#E67E22'+'22':CARD,border:'3px solid '+(baAns.after?'#E67E22':BORDER),borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',padding:10}}>
            <span style={{fontSize:22,fontWeight:700,color:baAns.after?'#E67E22':DIM}}>{baAns.after||'___'}</span>
          </div>
        </div>
      </div>
      {!fb&&<div style={{display:'flex',gap:16,marginBottom:12}}>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
          {baOpts.filter(o=>o!==baAns.before&&o!==baAns.after).map(o=><button key={o+'b'} className="btn btn-b btn-word" onClick={()=>pickBA('before',o)} style={{fontSize:18,padding:'14px 16px',width:'100%',background:BLUE,borderColor:'#2980b9',minHeight:52}} disabled={!!baAns.before}>← {o}</button>)}
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
          {baOpts.filter(o=>o!==baAns.before&&o!==baAns.after).map(o=><button key={o+'a'} className="btn btn-o btn-word" onClick={()=>pickBA('after',o)} style={{fontSize:18,padding:'14px 16px',width:'100%',minHeight:52}} disabled={!!baAns.after}>{o} →</button>)}
        </div>
      </div>}
      {!fb&&(baAns.before||baAns.after)&&<button className="btn btn-o" onClick={()=>setBaAns({before:null,after:null})} style={{fontSize:16,maxWidth:160,margin:'0 auto 8px'}}>↩️ Borrar</button>}
    </div>}
    {ex.mode==='yesterday_tomorrow'&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 8px',color:GOLD}}>Hoy es {DIAS[new Date().getDay()===0?6:new Date().getDay()-1]}</p><p style={{fontSize:16,color:DIM,margin:0}}>¿Qué día fue ayer y cuál será mañana?</p></div>
      <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:14}}>
        <div style={{flex:1,maxWidth:160}}>
          <p style={{fontSize:14,color:DIM,margin:'0 0 6px',fontWeight:700}}>AYER</p>
          <div style={{minHeight:48,background:ytAns.ayer?GREEN+'22':CARD,border:'2px solid '+(ytAns.ayer?GREEN:BORDER),borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:8}}>
            <span style={{fontSize:18,fontWeight:600,color:ytAns.ayer?GREEN:DIM}}>{ytAns.ayer||'___'}</span>
          </div>
        </div>
        <div style={{flex:1,maxWidth:160}}>
          <p style={{fontSize:14,color:DIM,margin:'0 0 6px',fontWeight:700}}>MAÑANA</p>
          <div style={{minHeight:48,background:ytAns.manana?GREEN+'22':CARD,border:'2px solid '+(ytAns.manana?GREEN:BORDER),borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:8}}>
            <span style={{fontSize:18,fontWeight:600,color:ytAns.manana?GREEN:DIM}}>{ytAns.manana||'___'}</span>
          </div>
        </div>
      </div>
      {!fb&&<div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:12}}>
        {DIAS.filter(d=>d!==ytAns.ayer&&d!==ytAns.manana).map(d=><div key={d} style={{display:'flex',flexDirection:'column',gap:3}}>
          <button className="btn btn-b btn-word" onClick={()=>pickYT('ayer',d)} style={{fontSize:13,padding:'6px 10px'}} disabled={!!ytAns.ayer}>{d}</button>
          <button className="btn btn-p btn-word" onClick={()=>pickYT('manana',d)} style={{fontSize:13,padding:'6px 10px'}} disabled={!!ytAns.manana}>{d}</button>
        </div>)}</div>}
      {!fb&&(ytAns.ayer||ytAns.manana)&&<button className="btn btn-o" onClick={()=>setYtAns({ayer:null,manana:null})} style={{fontSize:14,maxWidth:150,margin:'0 auto 8px'}}>↩️ Borrar</button>}
    </div>}
    {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}

// ===== REPARTE Y CUENTA =====
function genDistribute(lv,user){const items=[];const pNames=(loadData('personas',[])||[]).filter(p=>p.name).map(p=>p.name);const friends=pNames.length>=2?pNames:((user?.amigos||'Yasser,Lola,Vega,Amir,Carlos').split(',').map(s=>s.trim()).filter(Boolean));
  if(lv===1){for(let i=0;i<12;i++){const n=2+Math.floor(Math.random()*8);const f=friends[i%friends.length]||'Amigo';items.push({ty:'distribute',mode:'put',count:n,friend:f,id:'dist_put_'+i})}}
  else if(lv===2){for(let i=0;i<12;i++){const bags=2+Math.floor(Math.random()*3);const each=2+Math.floor(Math.random()*4);const total=bags*each;const names=friends.slice(0,bags);items.push({ty:'distribute',mode:'equal',total,bags,each,names,id:'dist_eq_'+i})}}
  else{for(let i=0;i<10;i++){const a=2+Math.floor(Math.random()*6);const b=2+Math.floor(Math.random()*6);const na=friends[0]||'Ana',nb=friends[1]||'Carlos';items.push({ty:'distribute',mode:'compare',a,b,nameA:na,nameB:nb,id:'dist_cmp_'+i})}}
  return items}

function BagSVG({name:bagName,size=80}){return <svg width={size} height={size*1.3} viewBox="0 0 80 104">
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

function ExDistribute({ex,onOk,onSkip,name,uid,vids}){
  const[count,setCount]=useState(0);const[fb,setFb]=useState(null);const[ans,setAns]=useState('');const[att,setAtt]=useState(0);const[showCount,setShowCount]=useState(false);const{idleMsg,poke}=useIdle(name,!fb);
  const objType=useMemo(()=>['candy','card','domino'][Math.floor(Math.random()*3)],[ex]);
  const objEmoji=objType==='candy'?'🍬':objType==='card'?'🃏':'🁣';
  const objName=objType==='candy'?'caramelos':objType==='card'?'cartas':'fichas';
  const ObjSVG=objType==='card'?CardSVG:objType==='domino'?DominoSVG:null;
  useEffect(()=>{setCount(0);setFb(null);setAns('');setAtt(0);setShowCount(false);stopVoice();
    if(ex.mode==='put')setTimeout(()=>say('Pon '+ex.count+' '+objName),400);
    else if(ex.mode==='equal')setTimeout(()=>say('Reparte '+ex.total+' '+objName+' en '+ex.bags+' bolsas iguales'),400);
    else setTimeout(()=>say('¿Quién tiene más?'),400);
    return()=>stopVoice()},[ex]);
  function addCandy(){poke();if(count>=20)return;const nc=count+1;setCount(nc);beep(300+nc*40,60)}
  function removeCandy(){poke();if(count>0)setCount(count-1)}
  function validatePut(){poke();if(count===ex.count){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
    else{const na=att+1;setAtt(na);
      if(na>=2){/* 2nd fail: Toki counts WITH the child */
        setFb('counting');setShowCount(true);beep(200,200);
        let i=0;const target=ex.count;
        function countNext(){if(i>=target){
          setTimeout(()=>{if(count>target){sayFB('¡Sobran '+(count-target)+'!')}else if(count<target){sayFB('¡Faltan '+(target-count)+'!')}
            setTimeout(()=>{setFb(null);setCount(0);setShowCount(false)},2000)},600);return}
          i++;say(''+i,0.9);setTimeout(countNext,900)}
        setTimeout(countNext,500)}
      else{setFb('wrong');beep(200,200);sayFB(rnd(['¡Casi!','¡Inténtalo otra vez!','¡Cuenta bien!']));
        setTimeout(()=>{setFb(null);setCount(0)},2000)}}}
  function checkEqual(){poke();const n=parseInt(ans);if(n===ex.each){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
    else{setFb('no');stopVoice();sayFB(ex.total+' entre '+ex.bags+' son '+ex.each+' cada uno');setTimeout(()=>{setFb(null);setAns('')},2500)}}
  function checkCompare(who){poke();const correct=ex.a>ex.b?'a':ex.a<ex.b?'b':'equal';
    if(who===correct){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
    else{setFb('no');beep(200,200);setTimeout(()=>setFb(null),1200)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {ex.mode==='put'&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:8}}><BagSVG name={ex.friend} size={100}/></div>
        <p style={{fontSize:22,fontWeight:700,color:GOLD,margin:0}}>Pon {ex.count} {objName}</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:12,minHeight:64,background:CARD,border:'2px solid '+BORDER,borderRadius:12,padding:14}}>
        {Array.from({length:count},(_,i)=><span key={i} style={{fontSize:44,animation:'bounceIn .3s '+(i*0.05)+'s both',display:'inline-flex',alignItems:'center'}}>
          {ObjSVG?<ObjSVG size={50}/>:objEmoji}
        </span>)}</div>
      {fb==='wrong'&&<div className="as" style={{background:RED+'18',borderRadius:14,padding:14,marginBottom:12}}>
        <p style={{fontSize:20,color:GOLD,fontWeight:700,margin:0}}>¡Casi! Cuenta bien 💪</p>
      </div>}
      {fb==='counting'&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:12}}>
        <p style={{fontSize:20,color:GOLD,fontWeight:700,margin:0}}>¡Vamos a contar juntos!</p>
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
      <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 12px',color:GOLD}}>¿Quién tiene más?</p>
        <div style={{display:'flex',gap:16,justifyContent:'center'}}>
          <div><p style={{fontWeight:600,fontSize:16,margin:'0 0 4px'}}>{ex.nameA}</p><div style={{display:'flex',gap:2,justifyContent:'center'}}>{Array.from({length:ex.a},(_,i)=><span key={i} style={{fontSize:20}}>🍬</span>)}</div></div>
          <div><p style={{fontWeight:600,fontSize:16,margin:'0 0 4px'}}>{ex.nameB}</p><div style={{display:'flex',gap:2,justifyContent:'center'}}>{Array.from({length:ex.b},(_,i)=><span key={i} style={{fontSize:20}}>🍬</span>)}</div></div>
        </div></div>
      <div style={{display:'flex',gap:10,justifyContent:'center'}}><button className="btn btn-b" onClick={()=>checkCompare('a')} style={{flex:1,maxWidth:140}}>{ex.nameA}</button>
        {ex.a===ex.b&&<button className="btn btn-p" onClick={()=>checkCompare('equal')} style={{flex:1,maxWidth:140}}>Igual</button>}
        <button className="btn btn-b" onClick={()=>checkCompare('b')} style={{flex:1,maxWidth:140}}>{ex.nameB}</button></div>
    </div>}
    {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}

// ===== ESCRITURA / CALIGRAFÍA =====
const LETTERS_UPPER='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
const LETTERS_LOWER='abcdefghijklmnñopqrstuvwxyz'.split('');
const STROKE_GUIDES={A:[{d:'↗',n:1,x:.3,y:.8,ex:.5,ey:.1},{d:'↘',n:2,x:.5,y:.1,ex:.7,ey:.8},{d:'→',n:3,x:.35,y:.55,ex:.65,ey:.55}],B:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'↷',n:2,x:.35,y:.1,ex:.35,ey:.5},{d:'↷',n:3,x:.35,y:.5,ex:.35,ey:.9}],C:[{d:'↶',n:1,x:.7,y:.15,ex:.7,ey:.85}],D:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'↷',n:2,x:.35,y:.1,ex:.35,ey:.9}],E:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'→',n:2,x:.35,y:.1,ex:.7,ey:.1},{d:'→',n:3,x:.35,y:.5,ex:.65,ey:.5},{d:'→',n:4,x:.35,y:.9,ex:.7,ey:.9}],F:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'→',n:2,x:.35,y:.1,ex:.7,ey:.1},{d:'→',n:3,x:.35,y:.5,ex:.65,ey:.5}],G:[{d:'↶',n:1,x:.7,y:.15,ex:.7,ey:.85},{d:'←',n:2,x:.7,y:.5,ex:.5,ey:.5}],H:[{d:'↓',n:1,x:.3,y:.1,ex:.3,ey:.9},{d:'↓',n:2,x:.7,y:.1,ex:.7,ey:.9},{d:'→',n:3,x:.3,y:.5,ex:.7,ey:.5}],I:[{d:'↓',n:1,x:.5,y:.1,ex:.5,ey:.9}],J:[{d:'↓',n:1,x:.6,y:.1,ex:.6,ey:.75},{d:'↶',n:2,x:.6,y:.75,ex:.35,ey:.9}],K:[{d:'↓',n:1,x:.3,y:.1,ex:.3,ey:.9},{d:'↙',n:2,x:.7,y:.1,ex:.3,ey:.5},{d:'↘',n:3,x:.3,y:.5,ex:.7,ey:.9}],L:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'→',n:2,x:.35,y:.9,ex:.7,ey:.9}],M:[{d:'↓',n:1,x:.2,y:.9,ex:.2,ey:.1},{d:'↘',n:2,x:.2,y:.1,ex:.5,ey:.5},{d:'↗',n:3,x:.5,y:.5,ex:.8,ey:.1},{d:'↓',n:4,x:.8,y:.1,ex:.8,ey:.9}],N:[{d:'↓',n:1,x:.3,y:.9,ex:.3,ey:.1},{d:'↘',n:2,x:.3,y:.1,ex:.7,ey:.9},{d:'↑',n:3,x:.7,y:.9,ex:.7,ey:.1}],O:[{d:'↶',n:1,x:.5,y:.1,ex:.5,ey:.1}],P:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'↷',n:2,x:.35,y:.1,ex:.35,ey:.5}],Q:[{d:'↶',n:1,x:.5,y:.1,ex:.5,ey:.1},{d:'↘',n:2,x:.55,y:.7,ex:.75,ey:.95}],R:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'↷',n:2,x:.35,y:.1,ex:.35,ey:.5},{d:'↘',n:3,x:.5,y:.5,ex:.7,ey:.9}],S:[{d:'↶↷',n:1,x:.65,y:.15,ex:.35,ey:.85}],T:[{d:'→',n:1,x:.25,y:.1,ex:.75,ey:.1},{d:'↓',n:2,x:.5,y:.1,ex:.5,ey:.9}],U:[{d:'↓↷',n:1,x:.3,y:.1,ex:.7,ey:.1}],V:[{d:'↘',n:1,x:.25,y:.1,ex:.5,ey:.9},{d:'↗',n:2,x:.5,y:.9,ex:.75,ey:.1}],W:[{d:'↘',n:1,x:.15,y:.1,ex:.35,ey:.9},{d:'↗',n:2,x:.35,y:.9,ex:.5,ey:.4},{d:'↘',n:3,x:.5,y:.4,ex:.65,ey:.9},{d:'↗',n:4,x:.65,y:.9,ex:.85,ey:.1}],X:[{d:'↘',n:1,x:.25,y:.1,ex:.75,ey:.9},{d:'↗',n:2,x:.25,y:.9,ex:.75,ey:.1}],Y:[{d:'↘',n:1,x:.25,y:.1,ex:.5,ey:.5},{d:'↙',n:2,x:.75,y:.1,ex:.5,ey:.5},{d:'↓',n:3,x:.5,y:.5,ex:.5,ey:.9}],Z:[{d:'→',n:1,x:.25,y:.1,ex:.75,ey:.1},{d:'↙',n:2,x:.75,y:.1,ex:.25,ey:.9},{d:'→',n:3,x:.25,y:.9,ex:.75,ey:.9}]};
STROKE_GUIDES['Ñ']=STROKE_GUIDES.N;
const WRITE_WORDS=['CASA','MESA','SOL','PAN','LUZ','OJO','UNO','DOS','MAR','PIE','OSO','AVE','RIO','DIA','REY','MIS','TUS','SUS','HOY'];
const WRITE_PHRASES=['ME LLAMO GUILLERMO','HOY ES LUNES','QUIERO AGUA','TENGO HAMBRE','MI CASA ES','SOL Y LUNA','PAN CON QUESO'];
const DESCENDERS='gjpqy'.split('');const ASCENDERS='bdfhklt'.split('');

const WRITE_WORDS_LOWER=['casa','mesa','sol','pan','luz','ojo','uno','dos','mar','pie','oso','ave','rio','dia','rey','mis','tus','sus','hoy'];
const WRITE_PHRASES_LOWER=['me llamo guillermo','hoy es lunes','quiero agua','tengo hambre','mi casa es','sol y luna','pan con queso'];
function genWriting(lv){const items=[];
  if(lv<=2){const letters=LETTERS_UPPER;const guide=lv===1;letters.forEach(l=>{items.push({ty:'writing',letter:l,guide,isUpper:true,mode:'letter',id:'wr_'+lv+'_'+l})});return items.sort(()=>Math.random()-.5).slice(0,20)}
  if(lv===3||lv===4){const letters=LETTERS_LOWER;const guide=lv===3;letters.forEach(l=>{items.push({ty:'writing',letter:l,guide,isUpper:false,mode:'letter',id:'wr_'+lv+'_'+l})});return items.sort(()=>Math.random()-.5).slice(0,20)}
  if(lv===5){return[...WRITE_WORDS].sort(()=>Math.random()-.5).slice(0,12).map(w=>({ty:'writing',letter:w,guide:true,isUpper:true,mode:'word',id:'wr_w_'+w}))}
  if(lv===51){return[...WRITE_WORDS].sort(()=>Math.random()-.5).slice(0,12).map(w=>({ty:'writing',letter:w,guide:false,isUpper:true,mode:'word',id:'wr_wf_'+w}))}
  if(lv===52){return[...WRITE_WORDS_LOWER].sort(()=>Math.random()-.5).slice(0,12).map(w=>({ty:'writing',letter:w,guide:true,isUpper:false,mode:'word',id:'wr_wl_'+w}))}
  if(lv===53){return[...WRITE_WORDS_LOWER].sort(()=>Math.random()-.5).slice(0,12).map(w=>({ty:'writing',letter:w,guide:false,isUpper:false,mode:'word',id:'wr_wlf_'+w}))}
  if(lv===6){return[...WRITE_PHRASES].sort(()=>Math.random()-.5).slice(0,8).map(p=>({ty:'writing',letter:p,guide:true,isUpper:true,mode:'phrase',id:'wr_p_'+p.replace(/\s/g,'_')}))}
  if(lv===61){return[...WRITE_PHRASES].sort(()=>Math.random()-.5).slice(0,8).map(p=>({ty:'writing',letter:p,guide:false,isUpper:true,mode:'phrase',id:'wr_pf_'+p.replace(/\s/g,'_')}))}
  if(lv===62){return[...WRITE_PHRASES_LOWER].sort(()=>Math.random()-.5).slice(0,8).map(p=>({ty:'writing',letter:p,guide:true,isUpper:false,mode:'phrase',id:'wr_pl_'+p.replace(/\s/g,'_')}))}
  return[...WRITE_PHRASES_LOWER].sort(()=>Math.random()-.5).slice(0,8).map(p=>({ty:'writing',letter:p,guide:false,isUpper:false,mode:'phrase',id:'wr_plf_'+p.replace(/\s/g,'_')}))}

function ExWriting({ex,onOk,onSkip,name}){
  const canvasRef=useRef(null);const modelRef=useRef(null);const drawing=useRef(false);const strokePts=useRef([]);const[done,setDone]=useState(false);const[stars,setStars]=useState(0);const[showModel,setShowModel]=useState(false);const{idleMsg,poke}=useIdle(name,!done);
  const isWide=ex.mode==='word'||ex.mode==='phrase';
  // Auto-size based on mode: letters=big pauta, words=medium, phrases=small
  const cW=ex.mode==='phrase'?800:isWide?700:400;
  const cH=ex.mode==='letter'?400:ex.mode==='word'?300:240;
  const baseY=ex.mode==='letter'?300:ex.mode==='word'?210:170;
  const upperY=ex.mode==='letter'?60:ex.mode==='word'?50:40;
  const ascY=ex.mode==='letter'?30:ex.mode==='word'?25:20;
  const descY=ex.mode==='letter'?360:ex.mode==='word'?260:210;
  const midY=ex.mode==='letter'?175:ex.mode==='word'?130:105;
  // 6.7 Lowercase: school-style Caveat font; Uppercase: bold Fredoka
  function getModelFont(fSz){
    if(ex.isUpper) return `bold ${fSz}px Fredoka`;
    return `${Math.floor(fSz*1.1)}px 'Caveat','Segoe Script','Comic Sans MS',cursive`;
  }
  // 6.1 FRENCH CALLIGRAPHY GUIDELINES (Pauta francesa)
  function drawPauta(ctx,w,h){
    ctx.fillStyle='#FAFAF5';ctx.fillRect(0,0,w,h);
    // Pauta francesa (French calligraphy lines)
    // Base line: thick blue 3px — where letters sit
    ctx.strokeStyle='#2E75B6';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,baseY);ctx.lineTo(w,baseY);ctx.stroke();
    // Top line (mayusculas): thin blue
    ctx.strokeStyle='#2E75B6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,upperY);ctx.lineTo(w,upperY);ctx.stroke();
    // Mid line: thin blue — top of regular lowercase
    ctx.strokeStyle='#2E75B6';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,midY);ctx.lineTo(w,midY);ctx.stroke();
    // Ascender line: thin dashed — for b,d,f,h,k,l,t
    ctx.setLineDash([5,5]);ctx.strokeStyle='#2E75B6';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(0,ascY);ctx.lineTo(w,ascY);ctx.stroke();ctx.setLineDash([]);
    // Descender line: thin dashed — for g,j,p,q,y
    ctx.setLineDash([4,4]);ctx.strokeStyle='#2E75B6';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(0,descY);ctx.lineTo(w,descY);ctx.stroke();ctx.setLineDash([]);
    // Light fill between baseline and upper for capital zone
    ctx.fillStyle='rgba(46,117,182,0.04)';ctx.fillRect(0,upperY,w,baseY-upperY);
    // Light fill between midY and baseY for lowercase zone
    ctx.fillStyle='rgba(46,117,182,0.03)';ctx.fillRect(0,midY,w,baseY-midY);
  }
  // 6.2 STROKE GUIDE with numbered circles + directional arrows
  function drawGuide(ctx,w,h){
    if(!ex.guide)return;const letter=ex.letter;
    if(ex.mode==='letter'){
      const zoneH=ex.isUpper?(baseY-upperY):(baseY-midY);
      const fSz=Math.floor(zoneH/0.72);
      ctx.font=getModelFont(fSz);
      ctx.fillStyle='#D0D0D0';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(letter,w/2,baseY);
      if(ex.isUpper){
        const sg=STROKE_GUIDES[letter.toUpperCase()];
        if(sg){
          const zone={x:w/2-fSz*.45,y:upperY,w:fSz*.9,h:baseY-upperY};
          sg.forEach(s=>{
            const sx=zone.x+s.x*zone.w,sy=zone.y+s.y*zone.h;
            const endX=zone.x+(s.ex||s.x)*zone.w,endY=zone.y+(s.ey||s.y)*zone.h;
            ctx.fillStyle='#E74C3C';ctx.beginPath();ctx.arc(sx,sy,11,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#fff';ctx.font='bold 13px Fredoka';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(s.n),sx,sy);
            const dx=endX-sx,dy=endY-sy;const len=Math.sqrt(dx*dx+dy*dy);
            if(len>20){
              const ux=dx/len,uy=dy/len;const arrowLen=Math.min(25,len*0.4);
              const ax=sx+ux*14,ay=sy+uy*14;const bx=ax+ux*arrowLen,by=ay+uy*arrowLen;
              ctx.strokeStyle='#E74C3C';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
              const headLen=8;const angle=Math.atan2(by-ay,bx-ax);
              ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx-headLen*Math.cos(angle-0.5),by-headLen*Math.sin(angle-0.5));ctx.moveTo(bx,by);ctx.lineTo(bx-headLen*Math.cos(angle+0.5),by-headLen*Math.sin(angle+0.5));ctx.stroke();
            }
          });
        }
      }
    }else{
      // Words/phrases: size to fill pauta zone
      const zoneH=baseY-upperY;
      const fSz=ex.mode==='phrase'?Math.floor(zoneH*0.6/0.72):Math.floor(zoneH*0.75/0.72);
      ctx.font=getModelFont(fSz);ctx.fillStyle='#D0D0D0';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(letter,w/2,baseY);
    }
  }
  // 6.4 Model mask for pixel-based stroke evaluation
  function getModelMask(){
    const offC=document.createElement('canvas');offC.width=cW;offC.height=cH;
    const octx=offC.getContext('2d');
    if(ex.mode==='letter'){
      const zoneH=ex.isUpper?(baseY-upperY):(baseY-midY);const fSz=Math.floor(zoneH/0.72);
      octx.font=getModelFont(fSz);octx.fillStyle='#000';octx.textAlign='center';octx.textBaseline='alphabetic';octx.fillText(ex.letter,cW/2,baseY);
    }else{
      const zoneH=baseY-upperY;const fSz=ex.mode==='phrase'?Math.floor(zoneH*0.6/0.72):Math.floor(zoneH*0.75/0.72);
      octx.font=getModelFont(fSz);octx.fillStyle='#000';octx.textAlign='center';octx.textBaseline='alphabetic';octx.fillText(ex.letter,cW/2,baseY);
    }
    const imgData=octx.getImageData(0,0,cW,cH);
    const mask=new Uint8Array(cW*cH);
    for(let i=0;i<imgData.data.length;i+=4){if(imgData.data[i+3]>30)mask[i/4]=1;}
    const dilated=new Uint8Array(cW*cH);const rad=6;
    for(let y=0;y<cH;y++)for(let x=0;x<cW;x++){
      let found=false;
      for(let dy=-rad;dy<=rad&&!found;dy++)for(let dx=-rad;dx<=rad&&!found;dx++){
        const nx=x+dx,ny=y+dy;
        if(nx>=0&&nx<cW&&ny>=0&&ny<cH&&mask[ny*cW+nx])found=true;
      }
      if(found)dilated[y*cW+x]=1;
    }
    modelRef.current=dilated;return dilated;
  }
  useEffect(()=>{setDone(false);setStars(0);setShowModel(false);strokePts.current=[];modelRef.current=null;const c=canvasRef.current;if(!c)return;const ctx=c.getContext('2d');drawPauta(ctx,cW,cH);drawGuide(ctx,cW,cH);
    stopVoice();const msg=ex.mode==='letter'?'Escribe la letra '+ex.letter:ex.mode==='word'?'Escribe '+ex.letter:'Escribe: '+ex.letter;setTimeout(()=>say(msg),400);return()=>stopVoice()},[ex]);
  function getPos(e){const c=canvasRef.current;const r=c.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left)*(c.width/r.width),y:(t.clientY-r.top)*(c.height/r.height)}}
  function start(e){e.preventDefault();poke();drawing.current=true;const p=getPos(e);strokePts.current.push(p);const ctx=canvasRef.current.getContext('2d');ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.strokeStyle='#2E75B6';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round'}
  function move(e){e.preventDefault();if(!drawing.current)return;const p=getPos(e);strokePts.current.push(p);const ctx=canvasRef.current.getContext('2d');ctx.strokeStyle='#2E75B6';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(p.x,p.y);ctx.stroke()}
  function end(e){e.preventDefault();drawing.current=false}
  function clear(){strokePts.current=[];const c=canvasRef.current;const ctx=c.getContext('2d');drawPauta(ctx,cW,cH);drawGuide(ctx,cW,cH)}
  function evaluate(){const pts=strokePts.current;if(pts.length<5){setStars(1);return 1;}
    const mask=getModelMask();let insideCount=0;
    for(let i=0;i<pts.length;i++){const px=Math.round(pts[i].x),py=Math.round(pts[i].y);if(px>=0&&px<cW&&py>=0&&py<cH&&mask[py*cW+px])insideCount++;}
    const insideRatio=insideCount/pts.length;
    const minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));
    const goodSize=(maxX-minX)>20&&(maxY-minY)>20;
    let s=4;if(insideRatio<=0.4)s=1;else if(insideRatio<=0.6)s=2;else if(insideRatio<=0.8)s=3;
    if(!goodSize&&s>2)s=2;if(pts.length<10&&s>2)s=2;
    setStars(s);return s;}
  function accept(){const s=evaluate();setDone(true);setShowModel(true);starBeep(s);
    // Overlay model in green
    const c=canvasRef.current;if(c){const ctx=c.getContext('2d');const mask=modelRef.current||getModelMask();
      ctx.save();ctx.globalAlpha=0.3;ctx.fillStyle='rgba(0,180,0,1)';
      if(ex.mode==='letter'){const zoneH=ex.isUpper?(baseY-upperY):(baseY-midY);const fSz=Math.floor(zoneH/0.72);ctx.font=getModelFont(fSz);ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(ex.letter,cW/2,baseY)}
      else{const zoneH=baseY-upperY;const fSz=ex.mode==='phrase'?Math.floor(zoneH*0.6/0.72):Math.floor(zoneH*0.75/0.72);ctx.font=getModelFont(fSz);ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(ex.letter,cW/2,baseY)}
      ctx.restore();
      const pts=strokePts.current;if(pts.length>0){ctx.save();ctx.globalAlpha=0.2;ctx.fillStyle='rgba(255,0,0,1)';for(let i=0;i<pts.length;i++){const px=Math.round(pts[i].x),py=Math.round(pts[i].y);if(px>=0&&px<cW&&py>=0&&py<cH&&!mask[py*cW+px]){ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill()}}ctx.restore()}}
    const msgs=['¡Buen intento! Sigue el modelo','¡Intenta no salirte!','¡Muy bien!','¡Perfecto!'];
    cheerOrSay(s>=3?mkPerfect(name):msgs[s-1],null,[],'perfect').then(()=>setTimeout(onOk,400))}
  const needsLandscape=isWide;
  return <div style={{textAlign:'center',padding:isWide?10:18}} onClick={poke}>
    {needsLandscape&&<style>{`@media (orientation:portrait) and (max-width:700px){.wr-landscape-warn{display:flex!important}.wr-canvas-wrap{display:none!important}}@media (orientation:landscape),(min-width:701px){.wr-landscape-warn{display:none!important}.wr-canvas-wrap{display:block!important}}`}</style>}
    {needsLandscape&&<div className="wr-landscape-warn" style={{display:'none',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:200,gap:16,animation:'pulse 2s infinite'}}><span style={{fontSize:64}}>📱</span><p style={{fontSize:22,fontWeight:700,color:GOLD}}>Gira la tablet →</p><p style={{fontSize:16,color:DIM}}>Para escribir palabras necesitas modo horizontal</p></div>}
    <div className={needsLandscape?'wr-canvas-wrap':''}>
      {ex.mode!=='letter'&&<div style={{background:GOLD+'15',borderRadius:10,padding:'8px 16px',marginBottom:10}}><p style={{fontSize:22,fontWeight:700,color:GOLD,margin:0}}>{ex.letter}</p></div>}
      <div className="card" style={{padding:12,marginBottom:10,background:'#FAFAF5',borderColor:'#D4D4D4'}}>
        {ex.mode==='letter'&&<p style={{fontSize:18,fontWeight:600,margin:'0 0 8px',color:'#1A1A2E'}}>Escribe: <span style={{fontSize:32,color:'#2E75B6',fontFamily:ex.isUpper?'Fredoka':"'Caveat',cursive"}}>{ex.letter}</span></p>}
        <canvas ref={canvasRef} width={cW} height={cH} style={{width:'100%',maxWidth:cW,height:'auto',aspectRatio:cW+'/'+cH,borderRadius:8,border:'2px solid #D4D4D4',touchAction:'none',cursor:'crosshair'}}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end}
          onMouseDown={start} onMouseMove={move} onMouseUp={end}/>
      </div>
      {!done&&<div style={{display:'flex',gap:10,justifyContent:'center'}}>
        <button className="btn btn-o" onClick={clear} style={{maxWidth:120}}>🗑️ Borrar</button>
        <button className="btn btn-g" onClick={accept} style={{maxWidth:180}}>✅ Listo</button>
        <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{maxWidth:100,fontSize:14}}>⏭️</button>
      </div>}
      {done&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:10}}><Stars n={stars} sz={36}/>
        <p style={{fontSize:16,color:stars>=3?GREEN:GOLD,fontWeight:700,margin:'8px 0 0'}}>{stars>=4?'¡Perfecto!':stars===3?'¡Muy bien!':stars===2?'¡Intenta no salirte!':'¡Buen intento! Sigue el modelo'}</p></div>}
      {idleMsg&&!done&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:10}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    </div>
  </div>}

// ===== QUIÉN SOY — Barra lateral de tiempo (reemplaza el círculo del micrófono) =====
function QSTimeBar({dur,on,onEnd}){
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
function ExQuienSoyEstudio({ex,onOk,onSkip,sex,name,uid,vids}){
  const[sf,sSf]=useState(null);const[att,sAtt]=useState(0);const[mic,setMic]=useState(false);
  const alive=useRef(true);
  const dur=useMemo(()=>Math.max(6,Math.ceil(ex.text.split(/\s+/).length*0.9)+4),[ex.text]);
  const key=ex.text+'|'+ex.id;
  function handleSR(said){if(!alive.current)return;setMic(false);sr.stop();stopVoice();
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
    // Start mic BEFORE playing so it listens while Toki speaks
    sr.go();setMic(true);
    const played=await playRec(uid,vids,textKey(ex.text));if(!played)await say(ex.text);
    if(!alive.current)return;
    // Mic is already listening
  }
  useEffect(()=>{alive.current=true;sSf(null);sAtt(0);setMic(false);stopVoice();sr.stop();
    // Proactively reactivate mic permission on exercise entry
    if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop())}).catch(()=>{});
    const t=setTimeout(()=>{if(alive.current){stopVoice();doPlay()}},900);
    return()=>{alive.current=false;clearTimeout(t);stopVoice();sr.stop()}},[key]);
  function onTimeUp(){if(!alive.current)return;setMic(false);sr.stop();stopVoice();
    const na=att+1;sAtt(na);if(na>=2){sSf('pass');setTimeout(()=>sayFB('¡Ánimo! Seguimos'),300);setTimeout(()=>{if(alive.current)onOk()},1800)}
    else{sSf('wait');setTimeout(()=>sayFB('¿Lo intentamos?'),300);setTimeout(()=>{if(alive.current){sSf(null);doPlay()}},2500)}}
  return <div style={{textAlign:'center'}}>
    <div style={{position:'relative',width:'100%',borderRadius:18,overflow:'hidden',marginBottom:6,boxShadow:'0 4px 24px rgba(0,0,0,.5)'}}>
      <img src={ex.img} alt="" style={{width:'100%',maxHeight:'75vh',objectFit:'cover',display:'block'}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,.85))',padding:'36px 16px 14px'}}>
        <p style={{fontSize:24,fontWeight:700,margin:0,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,.8)',lineHeight:1.3}}>{ex.text}</p>
      </div>
      <QSTimeBar dur={dur} on={mic} onEnd={onTimeUp}/>
    </div>
    {ex.picto&&<div style={{margin:'4px auto 8px',maxWidth:'95%'}}><img src={ex.picto} alt="" style={{height:70,objectFit:'contain',display:'block',margin:'0 auto',background:'#fff',borderRadius:10,padding:'6px 12px',maxWidth:'100%'}}/></div>}
    <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:6}}>
      <button className="btn btn-b btn-half" onClick={()=>{stopVoice();sr.stop();sSf(null);setMic(false);doPlay()}}>🔊 Otra vez</button>
      <button className="btn btn-ghost btn-half skip-btn" onClick={()=>{stopVoice();sr.stop();alive.current=false;onSkip()}}>⏭️ Saltar</button>
    </div>
  </div>}

// ===== QUIÉN SOY — Presentación (mode 2, teleprompter limpio con barra lateral) =====
function ExQuienSoyPres({onOk,onSkip,sex,name,uid,vids}){
  const[qi,setQi]=useState(0);const[finished,setFinished]=useState(false);const[barOn,setBarOn]=useState(false);
  const alive=useRef(true);const timers=useRef([]);
  const cur=QUIEN_SOY[qi];
  const waitSec=useMemo(()=>Math.max(Math.ceil(cur.text.length*0.12),2)+3,[cur]);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;stopVoice();timers.current.forEach(clearTimeout)}},[]);
  useEffect(()=>{if(finished)return;stopVoice();setBarOn(false);timers.current.forEach(clearTimeout);timers.current=[];
    const t1=setTimeout(()=>{if(!alive.current)return;
      say(cur.text).then(()=>{if(!alive.current)return;
        setBarOn(true);
        const t2=setTimeout(()=>{if(!alive.current)return;setBarOn(false);
          if(qi+1>=QUIEN_SOY.length){setFinished(true);victoryBeeps()}
          else setQi(qi+1)},waitSec*1000);
        timers.current.push(t2)})},600);
    timers.current.push(t1);
    return()=>{timers.current.forEach(clearTimeout);timers.current=[];stopVoice()}
  },[qi,finished]);
  if(finished)return <div className="ab" style={{textAlign:'center',padding:'40px 18px'}}>
    <div style={{fontSize:100,marginBottom:16}}>🏆</div>
    <h2 style={{fontSize:28,color:GOLD,margin:'0 0 12px'}}>¡Presentación completada!</h2>
    <p style={{fontSize:20,color:GREEN,fontWeight:700,margin:'0 0 8px'}}>¡Genial, {name}!</p>
    <p style={{fontSize:16,color:DIM,margin:'0 0 24px'}}>Has dicho las {QUIEN_SOY.length} frases</p>
    <button className="btn btn-gold" onClick={onOk} style={{fontSize:22,maxWidth:300,margin:'0 auto'}}>🎉 ¡Terminado!</button>
  </div>;
  return <div style={{textAlign:'center',position:'relative'}}>
    <p style={{fontSize:14,color:DIM,margin:'0 0 6px',fontWeight:600}}>{qi+1} / {QUIEN_SOY.length}</p>
    <div style={{position:'relative',width:'100%',borderRadius:18,overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,.5)'}}>
      <img src={cur.img} alt="" style={{width:'100%',maxHeight:'80vh',objectFit:'cover',display:'block'}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,.85))',padding:'48px 16px 18px'}}>
        <p style={{fontSize:28,fontWeight:700,margin:0,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,.8)',lineHeight:1.3}}>{cur.text}</p>
      </div>
      {barOn&&<div style={{position:'absolute',top:0,right:0,width:10,height:'100%',background:'rgba(0,0,0,.3)',borderRadius:'0 18px 18px 0',overflow:'hidden',zIndex:5}}>
        <div style={{position:'absolute',top:0,left:0,width:'100%',background:RED,animation:`qsbar ${waitSec}s linear forwards`}}/>
      </div>}
    </div>
    {cur.picto&&<div style={{margin:'6px auto',maxWidth:'95%'}}><img src={cur.picto} alt="" style={{height:70,objectFit:'contain',display:'block',margin:'0 auto',background:'#fff',borderRadius:10,padding:'6px 12px',maxWidth:'100%'}}/></div>}
  </div>}

function VoiceRec({user,onBack,onSave}){const[mode,setMode]=useState('menu');const[recLv,setRecLv]=useState(1);const[selV,setSelV]=useState(null);const[vn,setVn]=useState('');const[va,setVa]=useState('👨');const[vs,setVs]=useState('m');const[ri,setRi]=useState(0);const[rec,setRec]=useState(false);const[mr,setMr]=useState(null);const[saved,setSaved]=useState(0);const[pp,setPp]=useState(-1);const ch=useRef([]);const vid=useRef(null);const voices=user.voices||[];
  function init(ex){if(ex){setSelV(ex);vid.current=ex.id;setVn(ex.name);setVa(ex.avatar);setVs(ex.sex);setSaved(ex.saved||0)}else{const existing=voices.find(v=>v.name.toLowerCase()===vn.trim().toLowerCase());if(existing){setSelV(existing);vid.current=existing.id;setVa(existing.avatar);setVs(existing.sex);setSaved(existing.saved||0)}else{setSelV(null);vid.current=Date.now()+'';setSaved(0)}}}
  const cheerItems=useMemo(()=>[...PERFECT_T.map(t=>t.replace(/\{N\}/g,user.name||'Nico')),...GOOD_MSG,...RETRY_MSG,...FAIL_MSG,...BUILD_OK],[user.name]);
  const phraseItems=useMemo(()=>EX.filter(e=>e.lv===recLv).map(e=>({text:e.ph||e.fu||e.su,id:e.id})).filter(x=>x.text),[recLv]);
  const cheerItems2=useMemo(()=>[...PERFECT_T.map(t=>t.replace(/\{N\}/g,user.name||'Nico')),...GOOD_MSG,...RETRY_MSG,...FAIL_MSG,...BUILD_OK].map((t,i)=>({text:t,id:'cheer_'+i})),[user.name]);
  const countItems=useMemo(()=>NUMS_1_100.map((t,i)=>({text:t,id:'num_'+(i+1)})),[]);
  const personalItems=useMemo(()=>{const items=[];const u=user;if(u.nombre||u.name)items.push({text:'Me llamo '+(u.name||'Nico'),id:'pers_nombre'});if(u.padre)items.push({text:'Mi papá se llama '+u.padre,id:'pers_padre'});if(u.madre)items.push({text:'Mi mamá se llama '+u.madre,id:'pers_madre'});const h=(u.hermanos||'').split(',').map(s=>s.trim()).filter(Boolean);h.forEach((n,i)=>{const fem=/a$/i.test(n)&&!/ma$/i.test(n);items.push({text:(fem?'Mi hermana':'Mi hermano')+' se llama '+n,id:'pers_herm_'+i})});if(u.telefono)items.push({text:'El teléfono de mi papá es '+u.telefono,id:'pers_tel'});if(u.direccion)items.push({text:'Vivo en '+u.direccion,id:'pers_dir'});const a=(u.amigos||'').split(',').map(s=>s.trim()).filter(Boolean);a.forEach((n,i)=>{const fem=/a$/i.test(n)&&!/ma$/i.test(n);items.push({text:(fem?'Mi amiga':'Mi amigo')+' se llama '+n,id:'pers_amigo_'+i})});return items},[user]);
  const quiensoyItems=useMemo(()=>QUIEN_SOY.map(q=>({text:q.text,id:q.id})),[]);
  const items=mode==='cheers'?cheerItems2:mode==='counting'?countItems:mode==='personal'?personalItems:mode==='quiensoy'?quiensoyItems:phraseItems;const cur=items[ri]?.text||'';
  async function startR(){try{const s=await navigator.mediaDevices.getUserMedia({audio:{sampleRate:16000,channelCount:1,echoCancellation:true}});const m=new MediaRecorder(s,{mimeType:MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':'audio/webm',audioBitsPerSecond:32000});ch.current=[];m.ondataavailable=e=>{if(e.data.size>0)ch.current.push(e.data)};m.onstop=()=>{const b=new Blob(ch.current,{type:'audio/webm'});const r=new FileReader();r.onload=()=>{const item=items[ri];const k=mode==='cheers'?item.id:textKey(item.text);const sk='voice_'+user.id+'_'+vid.current;const d=loadData(sk,{});d[k]=r.result;d.name=vn;d.avatar=va;d.sex=vs;saveData(sk,d);setSaved(sv=>sv+1);
        // Upload to GitHub in background
        const voiceName=vn.toLowerCase().replace(/[^a-z0-9]/g,'_');
        const fname=k.replace(/[^a-z0-9_]/g,'')+'.webm';
        const ghPath='public/audio/voices/'+voiceName+'/'+fname;
        const raw=r.result.split(',')[1];// strip data:audio/webm;base64,
        fetch('/api/upload-voice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:ghPath,content:raw,message:'Voz '+vn+': '+fname})}).catch(()=>{});
      };r.readAsDataURL(b);s.getTracks().forEach(t=>t.stop())};m.start();setMr(m);setRec(true)}catch(e){alert('No se puede acceder al micrófono')}}
  function stopR(){if(mr){mr.stop();setMr(null);setRec(false)}}
  function preview(i){const item=items[i];const k=mode==='cheers'?item.id:textKey(item.text);try{const d=loadData('voice_'+user.id+'_'+vid.current,{});if(d[k]){setPp(i);const a=new Audio(d[k]);a.onended=()=>setPp(-1);a.play().catch(()=>setPp(-1))}}catch(e){}}
  function fin(){const v=vid.current;const ei=voices.findIndex(x=>x.id===v);let nv;if(ei>=0){nv=[...voices];nv[ei]={...voices[ei],saved}}else{nv=[...voices,{id:v,name:vn,avatar:va,sex:vs,saved}]}onSave({...user,voices:nv})}
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:BG,overflowY:'auto',zIndex:100,padding:16}}><div style={{maxWidth:600,margin:'0 auto'}}>
    {mode==='menu'&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><p style={{fontSize:22,color:GOLD,fontWeight:700,margin:0}}>🎙️ Voces</p><button className="btn btn-ghost btn-half" style={{width:'auto',padding:'8px 16px'}} onClick={onBack}>✕</button></div>
      {voices.length>0&&<div style={{marginBottom:20}}><p style={{fontSize:16,color:DIM,margin:'0 0 10px'}}>Toca para añadir grabaciones:</p>{voices.map((v,i)=><div key={i} style={{display:'flex',gap:6,marginBottom:8,alignItems:'center'}}><button className="card" style={{flex:1,display:'flex',alignItems:'center',gap:12,cursor:'pointer',border:`2px solid ${selV?.id===v.id?GOLD:BORDER}`}} onClick={()=>init(v)}><span style={{fontSize:30}}>{v.avatar}</span><div style={{flex:1,textAlign:'left'}}><div style={{fontWeight:700}}>{v.name}</div><div style={{fontSize:13,color:DIM}}>{v.saved} grabaciones</div></div><span style={{color:GOLD,fontSize:14}}>{selV?.id===v.id?'✓':'→'}</span></button><button style={{background:RED+'22',border:'2px solid '+RED+'44',borderRadius:12,padding:'8px 10px',color:RED,fontSize:16,cursor:'pointer',fontFamily:"'Fredoka'"}} onClick={()=>{try{localStorage.removeItem('toki_voice_'+user.id+'_'+v.id)}catch(e){}const nv=voices.filter(x=>x.id!==v.id);onSave({...user,voices:nv})}}>🗑️</button></div>)}</div>}
      {!selV&&<div><p style={{fontSize:16,color:DIM,margin:'0 0 12px'}}>Nueva voz:</p><input className="inp" value={vn} onChange={e=>setVn(e.target.value)} placeholder="Nombre: Papá, Jaime..." style={{marginBottom:12}}/><div style={{display:'flex',gap:10,marginBottom:12}}>{[['m','👦 Chico'],['f','👧 Chica']].map(([v,l])=><button key={v} onClick={()=>setVs(v)} style={{flex:1,padding:'12px 0',borderRadius:12,border:`3px solid ${vs===v?GOLD:BORDER}`,background:vs===v?GOLD+'22':BG3,color:vs===v?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer'}}>{l}</button>)}</div><div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',margin:'0 0 16px'}}>{AVS.slice(0,20).map(a=><button key={a} className={'avbtn'+(va===a?' on':'')} onClick={()=>setVa(a)}>{a}</button>)}</div></div>}
      <div style={{display:'flex',flexDirection:'column',gap:10}}><button className="btn btn-gold" disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRi(0);setMode('cheers')}}>🎤 Ánimos</button><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{[1,2,3,4,5].map(n=><button key={n} className="btn btn-b btn-half" style={{flex:1,fontSize:16,minWidth:50}} disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRecLv(n);setRi(0);setMode('phrases')}}>N{n}</button>)}</div><button className="btn btn-p" disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRi(0);setMode('counting')}} style={{fontSize:18}}>🔢 Cuento hasta 100</button>{user.telefono&&<button className="btn btn-o" disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRi(0);setMode('personal')}} style={{fontSize:18}}>👤 Datos personales</button>}
        <button className="btn btn-p" disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRi(0);setMode('quiensoy')}} style={{fontSize:18,background:'#E91E63',borderColor:'#C2185B',boxShadow:'4px 4px 0 #880E4F'}}>👤 Quién Soy</button>
      </div></div>}
    {(mode==='cheers'||mode==='phrases'||mode==='counting'||mode==='personal'||mode==='quiensoy')&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>{mode==='cheers'?'🎤 Ánimos':mode==='counting'?'🔢 Números':mode==='personal'?'👤 Datos':mode==='quiensoy'?'👤 Quién Soy':`🎤 N${recLv}`} — {vn}</p><span style={{fontSize:14,color:DIM}}>{ri+1}/{items.length}</span></div>
      <div className="pbar" style={{marginBottom:16}}><div className="pfill" style={{width:((ri+1)/items.length*100)+'%'}}/></div>
      <div className="card" style={{padding:24,marginBottom:16,textAlign:'center'}}><p style={{fontSize:13,color:DIM,margin:'0 0 8px'}}>Lee en voz alta:</p><p style={{fontSize:24,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>"{cur}"</p></div>
      <div style={{display:'flex',justifyContent:'center',gap:10,marginBottom:16}}><button className="btn btn-ghost btn-half" style={{width:'auto',padding:'8px 14px'}} onClick={()=>preview(ri)} disabled={pp>=0}>🔊 Escuchar</button><span style={{color:GREEN,fontWeight:700,alignSelf:'center'}}>{saved}</span></div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>{!rec?<button className="btn btn-g" onClick={startR} style={{fontSize:22}}>🔴 Grabar</button>:<button className="btn btn-o" onClick={stopR} style={{fontSize:22,animation:'pulse 1s infinite'}}>⬛ Parar</button>}
        <div style={{display:'flex',gap:10}}><button className="btn btn-ghost btn-half" disabled={ri===0} onClick={()=>{setRi(ri-1);setRec(false)}}>←</button><button className="btn btn-b btn-half" disabled={ri>=items.length-1} onClick={()=>{setRi(ri+1);setRec(false)}}>→</button></div>
        <div style={{display:'flex',gap:10,marginTop:10}}><button className="btn btn-ghost btn-half" onClick={()=>setMode('menu')}>← Menú</button><button className="btn btn-gold btn-half" onClick={fin}>✅ Guardar</button></div></div></div>}
  </div></div>}

// ===== NUMPAD — Custom numeric keypad =====
function NumPad({value,onChange,onSubmit,maxLen=5,decimal=false}){
  const press=d=>{if(String(value).length<maxLen)onChange(String(value)+d)};
  const addDot=()=>{const v=String(value);if(!v.includes(',')&&v.length>0&&v.length<maxLen)onChange(v+',')};
  const bksp=()=>onChange(String(value).slice(0,-1));
  const btnSt={width:52,height:46,borderRadius:12,border:`2px solid ${BORDER}`,background:BG3,color:TXT,fontSize:22,fontWeight:700,fontFamily:"'Fredoka'",cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'transform .1s'};
  // Layout: 3 columns of digits + comma integrated as a number character
  // Row 1: 1 2 3     Row 2: 4 5 6     Row 3: 7 8 9     Row 4: , 0 ⌫
  return <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'center',padding:2}}>
    <div style={{fontSize:26,fontWeight:700,color:GOLD,minHeight:30,letterSpacing:3,marginBottom:2,textAlign:'center'}}>{value?(value+(decimal?' €':'')):'?'}</div>
    <div style={{display:'flex',gap:6,alignItems:'stretch'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4}}>
        {[1,2,3].map(d=><button key={d} style={btnSt} onClick={()=>press(d)}>{d}</button>)}
        {[4,5,6].map(d=><button key={d} style={btnSt} onClick={()=>press(d)}>{d}</button>)}
        {[7,8,9].map(d=><button key={d} style={btnSt} onClick={()=>press(d)}>{d}</button>)}
        {decimal
          ?<button style={{...btnSt,fontSize:28,color:GOLD,fontWeight:800}} onClick={addDot}>,</button>
          :<div/>}
        <button style={btnSt} onClick={()=>press(0)}>0</button>
        <button style={{...btnSt,background:RED+'22',color:RED,border:`2px solid ${RED}33`,fontSize:18}} onClick={bksp}>⌫</button>
      </div>
      <button style={{width:58,borderRadius:14,border:`3px solid ${GREEN}`,background:GREEN+'33',color:'#fff',fontSize:14,fontWeight:600,fontFamily:"'Fredoka'",cursor:!value?'default':'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,opacity:!value?0.35:1,transition:'all .15s'}} onClick={onSubmit} disabled={!value}>
        <span style={{fontSize:28}}>🚀</span>
        <span style={{fontSize:11,lineHeight:1}}>¡Listo!</span>
      </button>
    </div>
  </div>}

// ===== ABACUS HELP — Visual counting aid =====
function AbacusHelp({a,b,op='+',result}){
  const[step,setStep]=useState(0);const total=op==='+'?a+b:a;const showN=op==='+'?result:a;
  useEffect(()=>{setStep(0);let i=0;const t=setInterval(()=>{i++;setStep(i);if(i<=showN){stopVoice();say(NUMS_1_100[i-1]||String(i))}if(i>=showN+2)clearInterval(t)},900);return()=>{clearInterval(t);stopVoice()}},[a,b,op]);
  const beadSz=total>15?16:total>10?20:28;
  return <div style={{textAlign:'center',padding:12}}>
    <p style={{fontSize:18,fontWeight:600,color:GOLD,margin:'0 0 12px'}}>¡Vamos a contarlo!</p>
    <div style={{display:'flex',gap:3,justifyContent:'center',flexWrap:'wrap',marginBottom:12,minHeight:50}}>
      {Array.from({length:total},(_,i)=>{const isA=op==='+'?i<a:i<result;const isB=op==='+'?i>=a&&i<a+b:false;const removed=op==='-'&&i>=result;const visible=i<step;
        return <div key={i} style={{width:beadSz,height:beadSz+8,borderRadius:beadSz/2,background:removed?RED+'44':isA?'#E67E22':isB?BLUE:GREEN,border:'2px solid '+(removed?RED+'66':'rgba(0,0,0,.2)'),opacity:visible?1:0.2,transform:visible?'scale(1)':'scale(0.4)',transition:'all .5s',textDecoration:removed?'line-through':'none'}}/>})}
    </div>
    {step>showN&&<p style={{fontSize:28,fontWeight:700,color:GREEN}}>{a} {op} {b} = {result}</p>}
  </div>}

// ===== RAZONA MODULE =====
// Shared scene positions for SceneSVG and SpatialDrag
const SCENE_POS={
  mesa:{encima:{x:180,y:65},debajo:{x:180,y:195},'al lado':{x:310,y:100},dentro:{x:180,y:140},fuera:{x:310,y:100}},
  silla:{encima:{x:170,y:92},debajo:{x:170,y:190},'al lado':{x:280,y:120},dentro:{x:170,y:120},fuera:{x:280,y:120}},
  estantería:{encima:{x:180,y:35},debajo:{x:180,y:200},'al lado':{x:310,y:120},dentro:{x:180,y:82},fuera:{x:310,y:120}},
  caja:{encima:{x:180,y:40},debajo:{x:180,y:200},'al lado':{x:295,y:120},dentro:{x:175,y:120},fuera:{x:295,y:120}},
  mochila:{encima:{x:175,y:35},debajo:{x:175,y:195},'al lado':{x:285,y:110},dentro:{x:175,y:120},fuera:{x:285,y:110}},
  puerta:{encima:{x:170,y:34},debajo:{x:170,y:215},'al lado':{x:280,y:130},dentro:{x:170,y:130},fuera:{x:280,y:130}},
  armario:{encima:{x:175,y:34},debajo:{x:175,y:215},'al lado':{x:295,y:130},dentro:{x:125,y:170},fuera:{x:295,y:130}}
};
const RAZONA_SPATIAL=[
  {scene:'estantería',obj:'libro',pos:'encima',q:'¿Dónde está el libro?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Encima'},
  {scene:'mesa',obj:'mochila',pos:'debajo',q:'¿Dónde está la mochila?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Debajo'},
  {scene:'caja',obj:'móvil',pos:'dentro',q:'¿Dónde está el móvil?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Dentro'},
  {scene:'silla',obj:'gafas',pos:'encima',q:'¿Dónde están las gafas?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Encima'},
  {scene:'armario',obj:'zapatillas',pos:'dentro',q:'¿Dónde están las zapatillas?',opts:['Encima','Debajo','Dentro','Fuera'],ans:'Dentro'},
  {scene:'puerta',obj:'llaves',pos:'al lado',q:'¿Dónde están las llaves?',opts:['Encima','Debajo','Al lado','Dentro'],ans:'Al lado'},
  {scene:'mochila',obj:'estuche',pos:'dentro',q:'¿Dónde está el estuche?',opts:['Encima','Debajo','Dentro','Fuera'],ans:'Dentro'},
  {scene:'estantería',obj:'balón',pos:'debajo',q:'¿Dónde está el balón?',opts:['Encima','Debajo','Dentro','Al lado'],ans:'Debajo'},
];
const RAZONA_DRAG=[
  {scene:'armario',obj:'zapatillas',pos:'dentro',q:'¡Guarda las zapatillas dentro del armario!'},
  {scene:'mesa',obj:'libro',pos:'encima',q:'¡Pon el libro encima de la mesa!'},
  {scene:'silla',obj:'mochila',pos:'debajo',q:'¡Pon la mochila debajo de la silla!'},
  {scene:'estantería',obj:'balón',pos:'encima',q:'¡Pon el balón encima de la estantería!'},
  {scene:'caja',obj:'móvil',pos:'dentro',q:'¡Mete el móvil dentro de la caja!'},
  {scene:'puerta',obj:'llaves',pos:'al lado',q:'¡Deja las llaves al lado de la puerta!'},
  {scene:'mesa',obj:'gafas',pos:'encima',q:'¡Pon las gafas encima de la mesa!'},
  {scene:'armario',obj:'estuche',pos:'dentro',q:'¡Guarda el estuche dentro del armario!'},
];
const RAZONA_INTRUSO=[
  {cat:'animal',words:['PERRO','GATO','PEZ','MESA'],ans:'MESA',q:'¿Cuál NO es un animal?'},
  {cat:'fruta',words:['MANZANA','PERA','PLÁTANO','SILLA'],ans:'SILLA',q:'¿Cuál NO es una fruta?'},
  {cat:'ropa',words:['CAMISA','PANTALÓN','ZAPATO','COCHE'],ans:'COCHE',q:'¿Cuál NO es ropa?'},
  {cat:'mueble',words:['MESA','SILLA','ARMARIO','GATO'],ans:'GATO',q:'¿Cuál NO es un mueble?'},
  {cat:'color',words:['ROJO','AZUL','VERDE','LIBRO'],ans:'LIBRO',q:'¿Cuál NO es un color?'},
  {cat:'transporte',words:['COCHE','AVIÓN','TREN','MANZANA'],ans:'MANZANA',q:'¿Cuál NO es un transporte?'},
  {cat:'cuerpo',words:['MANO','PIE','OJO','LÁPIZ'],ans:'LÁPIZ',q:'¿Cuál NO es del cuerpo?'},
  {cat:'deporte',words:['FÚTBOL','TENIS','NATACIÓN','SOPA'],ans:'SOPA',q:'¿Cuál NO es un deporte?'},
];
const RAZONA_CLASSIFY=[
  {groups:['Frutas','Animales'],items:[{w:'Manzana',g:0},{w:'Perro',g:1},{w:'Pera',g:0},{w:'Gato',g:1},{w:'Plátano',g:0},{w:'Pez',g:1}]},
  {groups:['Ropa','Comida'],items:[{w:'Camisa',g:0},{w:'Pan',g:1},{w:'Zapato',g:0},{w:'Queso',g:1},{w:'Gorro',g:0},{w:'Leche',g:1}]},
  {groups:['Animales','Muebles'],items:[{w:'León',g:0},{w:'Mesa',g:1},{w:'Oso',g:0},{w:'Silla',g:1},{w:'Pájaro',g:0},{w:'Cama',g:1}]},
];
const RAZONA_CAUSE=[
  {q:'Si llueve... ¿qué cojo?',opts:['Paraguas','Gafas de sol'],ans:'Paraguas'},
  {q:'Si tengo hambre... ¿qué hago?',opts:['Como','Duermo'],ans:'Como'},
  {q:'Si hace frío... ¿qué me pongo?',opts:['Abrigo','Bañador'],ans:'Abrigo'},
  {q:'Si está oscuro... ¿qué enciendo?',opts:['La luz','El grifo'],ans:'La luz'},
  {q:'Si me duele la cabeza... ¿qué tomo?',opts:['Medicina','Refresco'],ans:'Medicina'},
  {q:'Si quiero cruzar la calle... ¿qué miro?',opts:['El semáforo','El reloj'],ans:'El semáforo'},
];
const RAZONA_EMOTIONS=[
  {emoji:'😊',emotion:'Contento',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {emoji:'😢',emotion:'Triste',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {emoji:'😠',emotion:'Enfadado',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Asustado']},
  {emoji:'😨',emotion:'Asustado',q:'¿Cómo se siente?',opts:['Contento','Triste','Enfadado','Sorprendido']},
  {emoji:'😲',emotion:'Sorprendido',q:'¿Cómo se siente?',opts:['Contento','Sorprendido','Enfadado','Triste']},
  {emoji:'😴',emotion:'Cansado',q:'¿Cómo se siente?',opts:['Contento','Cansado','Enfadado','Asustado']},
];

function genRazona(lv){const items=[];const sh=a=>[...a].sort(()=>Math.random()-.5);
  if(lv===1){RAZONA_SPATIAL.forEach((s,i)=>items.push({ty:'razona',mode:'spatial',data:s,id:'rz_sp_'+i}));RAZONA_DRAG.forEach((s,i)=>items.push({ty:'razona',mode:'spatial_drag',data:s,id:'rz_drg_'+i}));return sh(items)}
  if(lv===2){RAZONA_INTRUSO.forEach((s,i)=>items.push({ty:'razona',mode:'intruso',data:s,id:'rz_int_'+i}));return sh(items)}
  if(lv===3){RAZONA_CLASSIFY.forEach((s,i)=>items.push({ty:'razona',mode:'classify',data:s,id:'rz_cls_'+i}));return sh(items)}
  if(lv===4){RAZONA_CAUSE.forEach((s,i)=>items.push({ty:'razona',mode:'cause',data:s,id:'rz_cau_'+i}));return sh(items)}
  RAZONA_EMOTIONS.forEach((s,i)=>items.push({ty:'razona',mode:'emotion',data:s,id:'rz_emo_'+i}));return sh(items)}

function SceneSVG({scene,obj,pos,showObj=true,dropZones=null,highlightZone=null}){const w=360,h=280;
  const objEmojis={libro:'📕',mochila:'🎒',móvil:'📱',gafas:'👓',zapatillas:'👟',llaves:'🔑',estuche:'✏️',balón:'⚽'};
  const objEm=objEmojis[obj]||'📦';
  const posMap={encima:{ox:0,oy:-50},debajo:{ox:0,oy:75},dentro:{ox:0,oy:5},'al lado':{ox:110,oy:10},al_lado:{ox:110,oy:10},fuera:{ox:110,oy:10}};
  const off=posMap[pos]||{ox:0,oy:0};
  // Furniture renderers — centered in 360x280 viewBox, recognizable shapes
  function TableSVG(){return <g transform="translate(55,40)">
    {/* Simple clear table — front view with slight 3D */}
    {/* Table top — thick plank */}
    <rect x={10} y={60} width={240} height={16} rx={4} fill="#B5651D" stroke="#6D4C2E" strokeWidth={2.5}/>
    {/* Top surface highlight */}
    <rect x={12} y={56} width={236} height={8} rx={3} fill="#C8894C" stroke="#6D4C2E" strokeWidth={1.5}/>
    {/* 4 legs — clearly visible, with space between them for "debajo" */}
    <rect x={20} y={76} width={14} height={130} rx={3} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1.5}/>
    <rect x={226} y={76} width={14} height={130} rx={3} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1.5}/>
    {/* Back legs slightly visible behind */}
    <rect x={28} y={76} width={10} height={126} rx={3} fill="#6D3612" stroke="#5A2E10" strokeWidth={1} opacity={0.6}/>
    <rect x={222} y={76} width={10} height={126} rx={3} fill="#6D3612" stroke="#5A2E10" strokeWidth={1} opacity={0.6}/>
    {/* Stretcher bar between front legs */}
    <rect x={34} y={160} width={192} height={8} rx={3} fill="#7A4420" stroke="#5A3218" strokeWidth={1}/>
  </g>}
  function ChairSVG(){return <g transform="translate(90,15)">
    {/* Side view chair — clear profile showing seat, legs, backrest */}
    {/* Back leg (goes up to become backrest, slightly angled) */}
    <path d="M30,0 L42,0 L50,230 L38,230 Z" fill="#8B4513" stroke="#6D4C2E" strokeWidth={2}/>
    {/* Front leg (straight vertical) */}
    <path d="M140,115 L152,115 L152,230 L140,230 Z" fill="#A0522D" stroke="#6D4C2E" strokeWidth={2}/>
    {/* Backrest top curve — rounded */}
    <path d="M28,0 L44,0 L46,4 L30,4 Z" fill="#B5651D" stroke="#6D4C2E" strokeWidth={1.5}/>
    <ellipse cx={37} cy={2} rx={10} ry={6} fill="#B5651D" stroke="#6D4C2E" strokeWidth={2}/>
    {/* Backrest slats (horizontal) */}
    <rect x={32} y={30} width={16} height={70} rx={6} fill="#C49A6C" stroke="#8B5E3C" strokeWidth={2}/>
    <line x1={32} y1={50} x2={48} y2={50} stroke="#8B5E3C" strokeWidth={1.5}/>
    <line x1={32} y1={70} x2={48} y2={70} stroke="#8B5E3C" strokeWidth={1.5}/>
    {/* SEAT — thick horizontal plank, clearly flat surface */}
    <rect x={20} y={108} width={150} height={18} rx={5} fill="#B5651D" stroke="#6D4C2E" strokeWidth={2.5}/>
    {/* Seat edge shadow for depth */}
    <rect x={22} y={126} width={146} height={5} rx={2} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1}/>
    {/* Stretcher bar between legs */}
    <rect x={44} y={185} width={96} height={8} rx={3} fill="#7A4420" stroke="#5A3218" strokeWidth={1.5}/>
    {/* Second back leg hint (behind, for depth) */}
    <path d="M22,5 L28,5 L36,230 L30,230 Z" fill="#6D3612" stroke="#5A2E10" strokeWidth={1}/>
    {/* Second front leg hint */}
    <rect x={148} y={118} width={8} height={112} rx={3} fill="#7A4420" stroke="#5A3218" strokeWidth={1}/>
  </g>}
  function ShelfSVG(){return <g transform="translate(60,50)">
    {/* 3 shelves — positioned to leave room for encima (above) and debajo (below) */}
    <rect x={0} y={0} width={240} height={10} rx={3} fill="#A0522D" stroke="#6D4C2E" strokeWidth={2.5}/>
    <rect x={0} y={50} width={240} height={10} rx={3} fill="#A0522D" stroke="#6D4C2E" strokeWidth={2.5}/>
    <rect x={0} y={100} width={240} height={10} rx={3} fill="#A0522D" stroke="#6D4C2E" strokeWidth={2.5}/>
    {/* Side panels */}
    <rect x={0} y={0} width={10} height={110} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1.5}/>
    <rect x={230} y={0} width={10} height={110} fill="#8B4513" stroke="#6D4C2E" strokeWidth={1.5}/>
    {/* Some items on shelves for context */}
    <rect x={20} y={60} width={30} height={38} rx={2} fill="#5B8C5A" opacity={0.4}/>{/* book */}
    <rect x={55} y={66} width={25} height={32} rx={2} fill="#4A7AB5" opacity={0.4}/>{/* book */}
    <circle cx={200} cy={82} r={13} fill="#D4A76A" opacity={0.3}/>{/* vase */}
  </g>}
  function BoxSVG(){return <g transform="translate(90,55)">
    {/* Open box — 3D with visible interior */}
    {/* Interior (dark) */}
    <rect x={8} y={35} width={148} height={100} rx={3} fill="#8B6F47"/>
    {/* Front face */}
    <rect x={0} y={35} width={160} height={105} rx={4} fill="#C49A6C" stroke="#8B7355" strokeWidth={2.5}/>
    {/* Right side */}
    <path d="M160,35 L180,15 L180,120 L160,140" fill="#A0522D" stroke="#8B7355" strokeWidth={1.5}/>
    {/* Back wall inside (visible because box is open) */}
    <path d="M8,35 L28,15 L180,15 L160,35 Z" fill="#B8956A" stroke="#8B7355" strokeWidth={1.5}/>
    {/* Interior shadow */}
    <rect x={10} y={38} width={146} height={20} rx={2} fill="#7A5F3A" opacity={0.4}/>
    {/* Open flaps */}
    <path d="M0,35 L-12,10 L60,5 L80,30 Z" fill="#D2B48C" stroke="#8B7355" strokeWidth={1.5}/>{/* left flap */}
    <path d="M80,30 L80,5 L180,0 L160,35 Z" fill="#CDAA73" stroke="#8B7355" strokeWidth={1.5}/>{/* right flap */}
  </g>}
  function BackpackSVG(){return <g transform="translate(110,45)">
    <rect x={14} y={28} width={110} height={130} rx={22} fill="#2980B9" stroke="#1F6DA0" strokeWidth={2.5}/>
    <rect x={30} y={48} width={76} height={44} rx={10} fill="#F39C12" stroke="#E67E22" strokeWidth={2}/>
    <path d="M38,28 Q70,4 100,28" fill="none" stroke="#333" strokeWidth={6} strokeLinecap="round"/>
    <rect x={48} y={108} width={38} height={14} rx={4} fill="#1F6DA0" stroke="#155980" strokeWidth={1.5}/>
    {/* Zipper detail */}
    <line x1={52} y1={115} x2={82} y2={115} stroke="#999" strokeWidth={1.5} strokeDasharray="3 2"/>
  </g>}
  function DoorSVG(){return <g transform="translate(115,30)">
    {/* Door frame */}
    <rect x={-10} y={-6} width={130} height={210} rx={4} fill="#6D4C2E" stroke="#5A3C1E" strokeWidth={2}/>
    {/* Door */}
    <rect x={0} y={0} width={110} height={198} rx={4} fill="#8B4513" stroke="#6D4C2E" strokeWidth={2.5}/>
    <rect x={10} y={10} width={90} height={84} rx={3} fill="#A0522D"/>
    <rect x={10} y={104} width={90} height={84} rx={3} fill="#A0522D"/>
    <circle cx={92} cy={115} r={8} fill="#DAA520" stroke="#B8860B" strokeWidth={1.5}/>
  </g>}
  function WardrobeSVG(){return <g transform="translate(70,35)">
    {/* Wardrobe body */}
    <rect x={0} y={0} width={210} height={190} rx={6} fill="#8B5E3C" stroke="#6D4C2E" strokeWidth={2.5}/>
    {/* Interior visible — left door OPEN */}
    <rect x={4} y={4} width={100} height={182} rx={3} fill="#5A3218"/>
    {/* Shelves inside */}
    <rect x={6} y={60} width={96} height={4} rx={1} fill="#7A4420"/>
    <rect x={6} y={120} width={96} height={4} rx={1} fill="#7A4420"/>
    {/* Hanging rod */}
    <line x1={12} y1={18} x2={96} y2={18} stroke="#999" strokeWidth={3} strokeLinecap="round"/>
    {/* Clothes on hangers */}
    <path d="M25,18 L20,20 L15,45 L35,45 L30,20 Z" fill="#E74C3C" opacity={0.8}/>{/* red shirt */}
    <path d="M45,18 L40,20 L35,45 L55,45 L50,20 Z" fill="#3498DB" opacity={0.8}/>{/* blue shirt */}
    <path d="M65,18 L60,20 L55,45 L75,45 L70,20 Z" fill="#F39C12" opacity={0.8}/>{/* yellow shirt */}
    <path d="M85,18 L80,20 L75,45 L95,45 L90,20 Z" fill="#2ECC71" opacity={0.8}/>{/* green shirt */}
    {/* Folded items on shelves */}
    <rect x={15} y={66} width={30} height={12} rx={2} fill="#E74C3C" opacity={0.5}/>
    <rect x={55} y={68} width={35} height={10} rx={2} fill="#3498DB" opacity={0.5}/>
    <rect x={20} y={126} width={28} height={10} rx={2} fill="#9B59B6" opacity={0.5}/>
    <rect x={60} y={126} width={30} height={10} rx={2} fill="#F39C12" opacity={0.5}/>
    {/* Right door — closed */}
    <rect x={106} y={4} width={100} height={182} rx={3} fill="#A0704C" stroke="#6D4C2E" strokeWidth={1.5}/>
    <circle cx={112} cy={95} r={5} fill="#DAA520" stroke="#B8860B" strokeWidth={1.5}/>
    {/* Left door — open, angled out */}
    <path d="M4,4 L-30,20 L-30,170 L4,186 Z" fill="#A0704C" stroke="#6D4C2E" strokeWidth={1.5}/>
    <circle cx={-22} cy={95} r={4} fill="#DAA520" stroke="#B8860B" strokeWidth={1}/>
    {/* Top molding */}
    <rect x={-4} y={-6} width={218} height={12} rx={3} fill="#6D4C2E"/>
    {/* Bottom base */}
    <rect x={-2} y={186} width={214} height={10} rx={3} fill="#6D4C2E"/>
    {/* Small feet */}
    <rect x={8} y={196} width={16} height={8} rx={2} fill="#5A3218"/>
    <rect x={186} y={196} width={16} height={8} rx={2} fill="#5A3218"/>
  </g>}
  const sceneMap={mesa:TableSVG,silla:ChairSVG,estantería:ShelfSVG,caja:BoxSVG,mochila:BackpackSVG,puerta:DoorSVG,armario:WardrobeSVG};
  const FurnitureCmp=sceneMap[scene]||TableSVG;
  // Surface reference point per furniture (where "encima" sits)
  // Per-scene reference: {x,y} = center of the main surface
  // encima = just above surface, debajo = below, dentro = inside body, al lado = to the right
  const sp=SCENE_POS[scene]||SCENE_POS.mesa;
  const normPos=pos==='al_lado'?'al lado':pos;
  const p=sp[normPos]||sp['al lado']||{x:180,y:120};
  const cx=p.x,cy=p.y;
  // Drop zones for drag mode — only show positions that make sense per furniture
  const validZones={
    mesa:['encima','debajo','al lado'],
    silla:['encima','debajo','al lado'],
    estantería:['encima','debajo','dentro','al lado'],
    caja:['encima','debajo','dentro','al lado'],
    mochila:['encima','debajo','dentro'],
    puerta:['encima','debajo','al lado'],
    armario:['encima','debajo','dentro','al lado']
  };
  const allPositions=validZones[scene]||['encima','debajo','dentro','al lado'];
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{maxWidth:'100%'}}>
    <rect x={0} y={0} width={w} height={h} rx={14} fill={BG3} stroke={BORDER} strokeWidth={2}/>
    <rect x={10} y={h-20} width={w-20} height={12} rx={4} fill="#3a3a4a" opacity={.3}/>
    <FurnitureCmp/>
    {dropZones&&allPositions.map(zp=>{const zpos=sp[zp];if(!zpos)return null;const isHl=highlightZone===zp;const isCorrect=zp===normPos;
      return <g key={zp}>
        <circle cx={zpos.x} cy={zpos.y} r={32} fill={isHl?(isCorrect?GREEN+'55':RED+'33'):'rgba(255,255,255,0.08)'} stroke={isHl?(isCorrect?GREEN:RED+'88'):'rgba(255,255,255,0.25)'} strokeWidth={isHl?3:2} strokeDasharray={isHl?'':'5 3'}/>
        <text x={zpos.x} y={zpos.y+5} textAnchor="middle" fontSize={13} fill="rgba(255,255,255,0.5)" fontWeight={700} fontFamily="'Fredoka'">{zp}</text>
      </g>})}
    {showObj&&<>
      <circle cx={cx} cy={cy} r={32} fill={GOLD+'33'} stroke={GOLD} strokeWidth={2.5} strokeDasharray="5 3"/>
      {obj==='mochila'?<g transform={`translate(${cx-16},${cy-20})`}>
        <rect x={2} y={5} width={28} height={34} rx={7} fill="#2980B9" stroke="#1F6DA0" strokeWidth={1.8}/>
        <rect x={7} y={11} width={18} height={10} rx={3} fill="#F39C12" stroke="#E67E22" strokeWidth={1.2}/>
        <path d="M9,5 Q16,-3 23,5" fill="none" stroke="#333" strokeWidth={2.5} strokeLinecap="round"/>
        <rect x={11} y={26} width={9} height={4} rx={2} fill="#1F6DA0"/>
      </g>:<text x={cx} y={cy+8} textAnchor="middle" fontSize={38}>{objEm}</text>}
    </>}
    <text x={w/2} y={h-4} textAnchor="middle" fill={'#E8E8F0'} fontSize={22} fontWeight={700} fontFamily="'Fredoka'">{scene}</text>
  </svg>}

function SpatialDrag({ex,fb,onCorrect,onWrong,poke}){
  const objEmojis={libro:'📕',mochila:'🎒',móvil:'📱',gafas:'👓',zapatillas:'👟',llaves:'🔑',estuche:'✏️',balón:'⚽'};
  const objEm=objEmojis[ex.data.obj]||'📦';
  const containerRef=useRef(null);
  const[dragPos,setDragPos]=useState(null);
  const[placed,setPlaced]=useState(false);
  const[nearZone,setNearZone]=useState(null);
  const dragging=useRef(false);
  function getTouch(e){const t=e.touches?e.touches[0]:e;return{x:t.clientX,y:t.clientY}}
  function checkZone(t){
    if(!containerRef.current)return null;
    const rect=containerRef.current.querySelector('svg')?.getBoundingClientRect();
    if(!rect)return null;
    const sp=SCENE_POS[ex.data.scene]||SCENE_POS.mesa;
    const svgX=(t.x-rect.left)/rect.width*360;const svgY=(t.y-rect.top)/rect.height*280;
    let closest=null;let minD=Infinity;
    for(const[zn,zp] of Object.entries(sp)){const d=Math.hypot(svgX-zp.x,svgY-zp.y);if(d<minD){minD=d;closest=zn}}
    return minD<55?closest:null}
  // Global move/end handlers
  useEffect(()=>{
    function handleMove(e){if(!dragging.current||placed||fb)return;
      e.preventDefault();const t=getTouch(e);setDragPos(t);setNearZone(checkZone(t))}
    function handleEnd(e){if(!dragging.current||placed||fb)return;poke();
      const correctPos=ex.data.pos==='al_lado'?'al lado':ex.data.pos;
      const zone=nearZone;
      dragging.current=false;
      if(zone===correctPos){setPlaced(true);setDragPos(null);onCorrect()}
      else if(zone){onWrong(correctPos);setDragPos(null);setNearZone(null)}
      else{setDragPos(null);setNearZone(null)}}
    window.addEventListener('touchmove',handleMove,{passive:false});
    window.addEventListener('touchend',handleEnd);
    window.addEventListener('mousemove',handleMove);
    window.addEventListener('mouseup',handleEnd);
    return()=>{window.removeEventListener('touchmove',handleMove);window.removeEventListener('touchend',handleEnd);
      window.removeEventListener('mousemove',handleMove);window.removeEventListener('mouseup',handleEnd)}
  });
  function onStart(e){e.preventDefault();poke();dragging.current=true;const t=getTouch(e);setDragPos(t)}
  useEffect(()=>{setPlaced(false);setDragPos(null);setNearZone(null);dragging.current=false},[ex]);
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,maxWidth:800,margin:'0 auto'}}>
    {/* Left — draggable object */}
    <div style={{flex:'0 0 140px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:220}}>
      {!placed&&!fb&&<div
        onTouchStart={onStart}
        onMouseDown={onStart}
        style={{cursor:'grab',userSelect:'none',touchAction:'none',
          padding:'14px 20px',borderRadius:20,background:GOLD+'22',border:`3px dashed ${GOLD}`,
          animation:'pulse 1.5s infinite',display:'flex',flexDirection:'column',alignItems:'center',gap:2,overflow:'hidden'}}>
        <span style={{fontSize:48,lineHeight:1}}>{objEm}</span>
        <span style={{fontSize:13,fontWeight:600,color:GOLD}}>{ex.data.obj}</span>
      </div>}
      {placed&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <div style={{animation:'rocketUp 1.8s 0.15s ease-in-out forwards',fontSize:52}}>🚀</div>
        <span style={{fontSize:36,opacity:0,animation:'starPop 0.6s 0.3s both',filter:'drop-shadow(0 0 12px #FFD700)'}}>⭐</span>
        <span style={{fontSize:28,opacity:0,animation:'starPop 0.6s 0.6s both',filter:'drop-shadow(0 0 12px #FFD700)'}}>⭐</span>
        <p style={{fontSize:18,fontWeight:600,color:GREEN,margin:0,opacity:0,animation:'fadeIn 0.4s 0.5s both'}}>¡Genial!</p>
      </div>}
      {fb==='no'&&<p style={{fontSize:16,fontWeight:600,color:RED,margin:0,textAlign:'center'}}>¡Inténtalo otra vez!</p>}
    </div>
    {/* Center — scene with drop zones */}
    <div ref={containerRef} style={{flex:'1 1 0',display:'flex',flexDirection:'column',alignItems:'center',gap:6,minWidth:0}}>
      <p style={{fontSize:22,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>{ex.data.q}</p>
      <SceneSVG scene={ex.data.scene} obj={ex.data.obj} pos={ex.data.pos} showObj={placed} dropZones={!placed} highlightZone={nearZone}/>
    </div>
    {/* Right — empty for symmetry */}
    <div style={{flex:'0 0 140px'}}/>
    {/* Floating dragged object */}
    {dragPos&&<div style={{position:'fixed',left:dragPos.x-28,top:dragPos.y-28,fontSize:56,pointerEvents:'none',zIndex:9999,filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',transform:'scale(1.2)',transition:'transform 0.1s'}}>{objEm}</div>}
  </div>}

function ExRazona({ex,onOk,onSkip,name,uid,vids}){
  const[fb,setFb]=useState(null);const[att,setAtt]=useState(0);const[placed,setPlaced]=useState({});const{idleMsg,poke}=useIdle(name,!fb);
  useEffect(()=>{setFb(null);setAtt(0);setPlaced({});stopVoice();setTimeout(()=>say(ex.data.q||''),400);return()=>stopVoice()},[ex]);
  function pick(ans){poke();const correct=ex.data.ans||ex.data.emotion;
    const celebTime=ex.mode==='spatial'?1800:300;
    if(ans===correct){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,celebTime))}
    else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){stopVoice();sayFB('La respuesta es: '+correct);setTimeout(()=>{setFb(null);setTimeout(onOk,250)},2500)}
      else{setTimeout(()=>setFb(null),1200)}}}
  function classifyPick(item,groupIdx){poke();const np={...placed,[item.w]:groupIdx};setPlaced(np);
    const allPlaced=ex.data.items.every(it=>np[it.w]!==undefined);
    if(allPlaced){const allCorrect=ex.data.items.every(it=>np[it.w]===it.g);
      if(allCorrect){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,300))}
      else{setFb('no');beep(200,200);sayFB('¡Casi! Algunos no están bien');setTimeout(()=>{setFb(null);setPlaced({})},2000)}}}
  return <div style={{textAlign:'center',padding:'10px 18px'}} onClick={poke}>
    {ex.mode==='spatial'&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,maxWidth:800,margin:'0 auto'}}>
      {/* Left side — celebration zone (symmetry with buttons) */}
      <div style={{flex:'0 0 140px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:220,position:'relative'}}>
        {fb==='ok'&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none',overflow:'hidden'}}>
          <div style={{position:'relative',width:140,height:220}}>
            {/* Cohete — órbita curva subiendo */}
            <div style={{position:'absolute',left:'50%',bottom:10,transform:'translateX(-50%)',animation:'rocketUp 1.8s 0.15s ease-in-out forwards',fontSize:52}}>🚀</div>
            {/* Estrellas — MUY dispersas, tamaños variados, orgánicas */}
            <span style={{position:'absolute',left:-5,top:5,fontSize:36,opacity:0,animation:'starPop 0.6s 0.3s both',filter:'drop-shadow(0 0 12px #FFD700)'}}>⭐</span>
            <span style={{position:'absolute',left:95,top:-8,fontSize:28,opacity:0,animation:'starPop 0.6s 0.55s both',filter:'drop-shadow(0 0 12px #FFD700)'}}>⭐</span>
            <span style={{position:'absolute',left:25,top:65,fontSize:32,opacity:0,animation:'starPop 0.6s 0.8s both',filter:'drop-shadow(0 0 12px #FFD700)'}}>⭐</span>
            <span style={{position:'absolute',left:110,top:50,fontSize:24,opacity:0,animation:'starPop 0.6s 1.05s both',filter:'drop-shadow(0 0 12px #FFD700)'}}>⭐</span>
            {/* Destellos extras */}
            <span style={{position:'absolute',left:50,top:-5,fontSize:18,opacity:0,animation:'starPop 0.4s 0.4s both'}}>✨</span>
            <span style={{position:'absolute',left:120,top:25,fontSize:14,opacity:0,animation:'starPop 0.4s 0.65s both'}}>✨</span>
            <span style={{position:'absolute',left:-10,top:45,fontSize:16,opacity:0,animation:'starPop 0.4s 0.9s both'}}>💫</span>
            <span style={{position:'absolute',left:80,top:85,fontSize:13,opacity:0,animation:'starPop 0.4s 1.1s both'}}>✨</span>
            <span style={{position:'absolute',left:5,top:90,fontSize:20,opacity:0,animation:'starPop 0.4s 1.2s both'}}>🌟</span>
            {/* Texto */}
            <p style={{position:'absolute',bottom:-5,left:-15,right:-15,fontSize:20,fontWeight:600,color:GREEN,margin:0,textAlign:'center',opacity:0,animation:'fadeIn 0.4s 0.5s both',whiteSpace:'nowrap',textShadow:'0 2px 6px rgba(0,0,0,0.4)'}}>¡Bien, vamos!</p>
          </div>
        </div>}
      </div>
      {/* Center — scene */}
      <div style={{flex:'1 1 0',display:'flex',flexDirection:'column',alignItems:'center',gap:6,minWidth:0}}>
        <p style={{fontSize:22,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>{ex.data.q}</p>
        <SceneSVG scene={ex.data.scene} obj={ex.data.obj} pos={ex.data.pos}/>
      </div>
      {/* Right side — answer buttons */}
      <div style={{flex:'0 0 140px',display:'flex',flexDirection:'column',gap:8}}>
        {ex.data.opts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.ans?'btn-g':fb==='no'&&o===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:19,padding:14,minHeight:52,fontWeight:600,letterSpacing:0.5,opacity:fb==='ok'&&o!==ex.data.ans?0.35:1,transition:'opacity 0.3s'}}>{o}</button>)}
      </div>
    </div>}
    {ex.mode==='spatial_drag'&&<SpatialDrag ex={ex} fb={fb} onCorrect={()=>{setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,1800))}} onWrong={(correctPos)=>{const na=att+1;setAtt(na);beep(200,200);setFb('no');sayFB('¡No! Ponlo '+correctPos);setTimeout(()=>setFb(null),1500)}} poke={poke}/>}
    {ex.mode==='intruso'&&<div>
      <div className="card" style={{padding:16,marginBottom:12,background:BLUE+'0C',borderColor:BLUE+'33'}}>
        <p style={{fontSize:22,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>{ex.data.q}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[...ex.data.words].sort(()=>Math.random()-.5).map(w=><button key={w} className={'btn '+(fb==='ok'&&w===ex.data.ans?'btn-g':fb==='no'&&w===ex.data.ans?'btn-gold':'btn-b')} onClick={()=>!fb&&pick(w)} style={{fontSize:24,padding:20,minHeight:72,fontWeight:700}}>{w}</button>)}
      </div>
    </div>}
    {ex.mode==='classify'&&<div>
      <p style={{fontSize:20,fontWeight:700,margin:'0 0 10px',color:GOLD}}>{ex.data.q}</p>
      <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:12}}>
        {ex.data.groups.map((g,gi)=><div key={gi} style={{flex:1,background:gi===0?BLUE+'22':GREEN+'22',border:`2px solid ${gi===0?BLUE:GREEN}`,borderRadius:12,padding:10,minHeight:80}}>
          <p style={{fontSize:16,fontWeight:600,color:gi===0?BLUE:GREEN,margin:'0 0 8px'}}>{g}</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center'}}>
            {ex.data.items.filter(it=>placed[it.w]===gi).map(it=><span key={it.w} style={{background:gi===0?BLUE+'44':GREEN+'44',borderRadius:6,padding:'4px 8px',fontSize:14,fontWeight:600}}>{it.w}</span>)}
          </div>
        </div>)}
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
        {ex.data.items.filter(it=>placed[it.w]===undefined).map(it=><div key={it.w} style={{display:'flex',flexDirection:'column',gap:4}}>
          {ex.data.groups.map((g,gi)=><button key={gi} className="btn btn-b btn-word" onClick={()=>classifyPick(it,gi)} style={{fontSize:14,padding:'6px 12px'}}>{it.w}→{g}</button>)}
        </div>)}
      </div>
    </div>}
    {ex.mode==='cause'&&<div>
      <p style={{fontSize:20,fontWeight:700,margin:'0 0 10px',color:GOLD}}>{ex.data.q}</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {ex.data.opts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.ans?'btn-g':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:20,padding:16,minHeight:60}}>{o}</button>)}
      </div>
    </div>}
    {ex.mode==='emotion'&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:24}}>
      <div style={{flex:'0 0 auto',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <p style={{fontSize:20,fontWeight:700,margin:0,color:GOLD}}>{ex.data.q}</p>
        <div style={{fontSize:90}}>{ex.data.emoji}</div>
      </div>
      <div style={{flex:'0 0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,width:280}}>
        {ex.data.opts.map(o=><button key={o} className={'btn '+(fb==='ok'&&o===ex.data.emotion?'btn-g':'btn-b')} onClick={()=>!fb&&pick(o)} style={{fontSize:20,padding:16,minHeight:60}}>{o}</button>)}
      </div>
    </div>}
    {fb==='ok'&&ex.mode!=='spatial'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}

// ===== LEE MODULE =====
const LEE_INTRUSO=[
  {cat:'animales',words:['PERRO','GATO','PEZ','SILLA'],ans:'SILLA',q:'¿Cuál NO es un animal?'},
  {cat:'frutas',words:['MANZANA','PERA','PLÁTANO','MESA'],ans:'MESA',q:'¿Cuál NO es una fruta?'},
  {cat:'colores',words:['ROJO','AZUL','VERDE','COCHE'],ans:'COCHE',q:'¿Cuál NO es un color?'},
  {cat:'ropa',words:['CAMISA','ZAPATO','GORRO','PERRO'],ans:'PERRO',q:'¿Cuál NO es ropa?'},
  {cat:'muebles',words:['MESA','SILLA','CAMA','GATO'],ans:'GATO',q:'¿Cuál NO es un mueble?'},
  {cat:'transportes',words:['COCHE','AVIÓN','BARCO','PAN'],ans:'PAN',q:'¿Cuál NO es un transporte?'},
  {cat:'cuerpo',words:['MANO','OJO','PIE','LIBRO'],ans:'LIBRO',q:'¿Cuál NO es del cuerpo?'},
  {cat:'comida',words:['PAN','LECHE','QUESO','LÁPIZ'],ans:'LÁPIZ',q:'¿Cuál NO es comida?'},
];
const LEE_WORD_IMG=[
  {word:'PERRO',imgs:['🐶','🐱','🐟','🐴'],ans:0},{word:'GATO',imgs:['🐶','🐱','🐟','🐴'],ans:1},
  {word:'SOL',imgs:['☀️','🌙','⭐','🌈'],ans:0},{word:'LUNA',imgs:['☀️','🌙','⭐','🌈'],ans:1},
  {word:'CASA',imgs:['🏠','🏫','🏪','🏥'],ans:0},{word:'ÁRBOL',imgs:['🌳','🌸','🌵','🌻'],ans:0},
  {word:'MANZANA',imgs:['🍎','🍐','🍌','🍊'],ans:0},{word:'COCHE',imgs:['🚗','🚂','✈️','🚢'],ans:0},
];
const LEE_COMPLETE=[
  {word:'PERRO',display:'P_RRO',missing:'E',opts:['E','A','U','O']},
  {word:'GATO',display:'G_TO',missing:'A',opts:['A','E','I','O']},
  {word:'MESA',display:'M_SA',missing:'E',opts:['A','E','I','U']},
  {word:'CASA',display:'C_SA',missing:'A',opts:['A','E','O','U']},
  {word:'LUNA',display:'L_NA',missing:'U',opts:['A','E','I','U']},
  {word:'LIBRO',display:'L_BRO',missing:'I',opts:['A','E','I','O']},
  {word:'AGUA',display:'AG_A',missing:'U',opts:['A','E','I','U']},
  {word:'PELO',display:'P_LO',missing:'E',opts:['A','E','I','O']},
];
const LEE_SYLLABLES=[
  {word:'GATO',syllables:['GA','TO']},{word:'MESA',syllables:['ME','SA']},
  {word:'LUNA',syllables:['LU','NA']},{word:'PERRO',syllables:['PE','RRO']},
  {word:'CASA',syllables:['CA','SA']},{word:'PELO',syllables:['PE','LO']},
  {word:'PATO',syllables:['PA','TO']},{word:'RANA',syllables:['RA','NA']},
  {word:'MONO',syllables:['MO','NO']},{word:'VASO',syllables:['VA','SO']},
];
const LEE_READ_DO=[
  {instruction:'TOCA EL ROJO',opts:[{l:'🔴',c:'red',correct:true},{l:'🔵',c:'blue'},{l:'🟢',c:'green'},{l:'🟡',c:'yellow'}]},
  {instruction:'TOCA EL AZUL',opts:[{l:'🔴',c:'red'},{l:'🔵',c:'blue',correct:true},{l:'🟢',c:'green'},{l:'🟡',c:'yellow'}]},
  {instruction:'TOCA EL VERDE',opts:[{l:'🔴',c:'red'},{l:'🔵',c:'blue'},{l:'🟢',c:'green',correct:true},{l:'🟡',c:'yellow'}]},
  {instruction:'TOCA EL GRANDE',opts:[{l:'⭐',sz:80,correct:true},{l:'⭐',sz:30},{l:'⭐',sz:40},{l:'⭐',sz:20}]},
  {instruction:'TOCA EL ANIMAL',opts:[{l:'🐶',correct:true},{l:'🏠'},{l:'🚗'},{l:'📚'}]},
  {instruction:'TOCA LA FRUTA',opts:[{l:'🍎',correct:true},{l:'🐱'},{l:'🏠'},{l:'✏️'}]},
];

function genLee(lv){const sh=a=>[...a].sort(()=>Math.random()-.5);
  if(lv===1)return sh(LEE_INTRUSO).map((d,i)=>({ty:'lee',mode:'intruso',data:d,id:'lee_int_'+i}));
  if(lv===2)return sh(LEE_WORD_IMG).map((d,i)=>({ty:'lee',mode:'word_img',data:d,id:'lee_wi_'+i}));
  if(lv===3)return sh(LEE_COMPLETE).map((d,i)=>({ty:'lee',mode:'complete',data:d,id:'lee_cmp_'+i}));
  if(lv===4)return sh(LEE_SYLLABLES).map((d,i)=>({ty:'lee',mode:'syllables',data:d,id:'lee_syl_'+i}));
  return sh(LEE_READ_DO).map((d,i)=>({ty:'lee',mode:'read_do',data:d,id:'lee_rd_'+i}))}

function ExLee({ex,onOk,onSkip,name,uid,vids}){
  const[fb,setFb]=useState(null);const[att,setAtt]=useState(0);const[placed,setPlaced]=useState([]);const[avail,setAvail]=useState([]);const[filledLetter,setFilledLetter]=useState(null);const{idleMsg,poke}=useIdle(name,!fb);
  const shuffledWords=useMemo(()=>ex.mode==='intruso'?[...ex.data.words].sort(()=>Math.random()-.5):null,[ex]);
  useEffect(()=>{setFb(null);setAtt(0);setPlaced([]);setFilledLetter(null);
    if(ex.mode==='syllables'){setAvail([...ex.data.syllables].sort(()=>Math.random()-.5))}
    stopVoice();return()=>stopVoice()},[ex]);
  function pick(ans){poke();
    if(ex.mode==='intruso'){if(ans===ex.data.ans){setFb('ok');starBeep(4);say('¡Bien! '+ans+' no es '+ex.data.cat.replace(/s$/,'')).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(onOk,300))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){say('La respuesta es '+ex.data.ans);setTimeout(()=>{setFb(null);setTimeout(onOk,400)},2500)}else{say(ex.data.q);setTimeout(()=>setFb(null),1500)}}}
    if(ex.mode==='word_img'){if(ans===ex.data.ans){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,250))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){setTimeout(()=>{setFb(null);setTimeout(onOk,400)},2000)}else{setTimeout(()=>setFb(null),1200)}}}
    if(ex.mode==='complete'){if(ans===ex.data.missing){setFb('ok');setFilledLetter(ans);starBeep(4);say(ex.data.word).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(onOk,300))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){setFilledLetter(ex.data.missing);setFb('show');say('Era '+ex.data.missing);setTimeout(()=>{setTimeout(onOk,400)},2000)}else{sayFB('¡Casi!');setTimeout(()=>setFb(null),1200)}}}
    if(ex.mode==='read_do'){const isCorrect=ex.data.opts[ans]?.correct;
      if(isCorrect){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(onOk,250))}
      else{const na=att+1;setAtt(na);setFb('no');beep(200,200);if(na>=2){say(ex.data.instruction);setTimeout(()=>{setFb(null);setTimeout(onOk,400)},2500)}else{setTimeout(()=>setFb(null),1200)}}}}
  function placeSyl(s){poke();const np=[...placed,s];setPlaced(np);setAvail(a=>a.filter(x=>x!==s));
    if(np.length===ex.data.syllables.length){if(np.join('')===ex.data.syllables.join('')){setFb('ok');starBeep(4);say(ex.data.word).then(()=>cheerOrSay(mkPerfect(name),uid,vids,'perfect')).then(()=>setTimeout(onOk,250))}
      else{setFb('no');beep(200,200);setTimeout(()=>{setPlaced([]);setAvail([...ex.data.syllables].sort(()=>Math.random()-.5));setFb(null)},1500)}}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {ex.mode==='intruso'&&<div>
      <div className="card" style={{padding:16,marginBottom:14,background:'#E91E63'+'0C',borderColor:'#E91E63'+'33'}}><p style={{fontSize:22,fontWeight:700,margin:0,color:GOLD}}>{ex.data.q}</p></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {shuffledWords.map(w=><button key={w} className={'btn '+(fb==='ok'&&w===ex.data.ans?'btn-g':'btn-b')} onClick={()=>!fb&&pick(w)} style={{fontSize:26,padding:22,fontWeight:700,minHeight:80,boxShadow:fb==='ok'&&w===ex.data.ans?'0 0 20px '+GREEN+'88':'',transition:'all .3s'}} disabled={!!fb}>{w}</button>)}
      </div>
      {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:14,marginTop:12}}><p style={{fontSize:18,fontWeight:600,color:GREEN,margin:0}}>{'¡Bien! '+ex.data.ans+' no es un '+ex.data.cat.replace(/s$/,'')+'!'}</p></div>}
    </div>}
    {ex.mode==='word_img'&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:36,fontWeight:700,margin:0,color:GOLD,letterSpacing:4}}>{ex.data.word}</p></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {ex.data.imgs.map((img,i)=><button key={i} className={'btn '+(fb==='ok'&&i===ex.data.ans?'btn-g':'btn-b')} onClick={()=>!fb&&pick(i)} style={{fontSize:56,padding:16,minHeight:90}}>{img}</button>)}
      </div>
    </div>}
    {ex.mode==='complete'&&<div>
      <div className="card" style={{padding:24,marginBottom:14}}><p style={{fontSize:42,fontWeight:700,margin:0,color:GOLD,letterSpacing:6,fontFamily:'monospace'}}>{filledLetter?ex.data.display.split('').map((c,i)=>c==='_'?<span key={i} style={{color:fb==='ok'?GREEN:fb==='show'?GREEN:GOLD,textDecoration:fb==='ok'?'none':'none',transition:'all .3s'}}>{filledLetter}</span>:c):ex.data.display}</p></div>
      {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:24,fontWeight:700,color:GREEN,margin:0}}>{ex.data.word}</p></div>}
      {fb==='show'&&<div className="af" style={{background:GOLD+'22',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:18,fontWeight:600,color:GOLD,margin:0}}>Era {ex.data.missing}!</p></div>}
      {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! Prueba otra</p></div>}
      {!fb&&<div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
        {ex.data.opts.map(o=><button key={o} className="btn btn-b" onClick={()=>pick(o)} style={{fontSize:32,padding:18,fontWeight:700,minHeight:70}}>{o}</button>)}
      </div>}
    </div>}
    {ex.mode==='syllables'&&<div>
      <div className="card" style={{padding:16,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>Ordena las sílabas</p></div>
      <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:14,minHeight:60}}>
        {ex.data.syllables.map((_,i)=><div key={i} style={{minWidth:70,height:56,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:12,border:`3px solid ${placed[i]?GREEN:BORDER}`,background:placed[i]?GREEN+'22':BG3,fontSize:28,fontWeight:700,color:placed[i]?GREEN:DIM}}>{placed[i]||'__'}</div>)}
      </div>
      <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
        {avail.map((s,i)=><button key={s+i} className="btn btn-b btn-word" onClick={()=>!fb&&placeSyl(s)} style={{fontSize:28,padding:'14px 24px',fontWeight:700}}>{s}</button>)}
      </div>
      {placed.length>0&&!fb&&<button className="btn btn-o" onClick={()=>{setPlaced([]);setAvail([...ex.data.syllables].sort(()=>Math.random()-.5))}} style={{marginTop:12,fontSize:14,maxWidth:150,margin:'12px auto 0'}}>↩️ Borrar</button>}
    </div>}
    {ex.mode==='read_do'&&<div>
      <div className="card" style={{padding:24,marginBottom:14,background:GOLD+'0C',borderColor:GOLD+'33'}}><p style={{fontSize:32,fontWeight:700,margin:0,color:GOLD,letterSpacing:2}}>{ex.data.instruction}</p></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {ex.data.opts.map((o,i)=><button key={i} className={'btn '+(fb==='ok'&&o.correct?'btn-g':'btn-b')} onClick={()=>!fb&&pick(i)} style={{fontSize:o.sz||56,padding:20,minHeight:90}}>{o.l}</button>)}
      </div>
    </div>}
    {fb==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{marginTop:12}}>⏭️ Saltar</button>
  </div>}

// ===== CARD and DOMINO SVGs for Distribute =====
function CardSVG({size=48}){return <svg width={size} height={size*1.4} viewBox="0 0 48 67">
  <rect x={1} y={1} width={46} height={65} rx={6} fill="#fff" stroke="#333" strokeWidth={1.5}/>
  <text x={8} y={18} fill="#C0392B" fontSize={14} fontWeight={700}>A</text>
  <text x={24} y={42} fill="#C0392B" fontSize={24} textAnchor="middle">♥</text>
</svg>}
function DominoSVG({size=48}){return <svg width={size*1.6} height={size} viewBox="0 0 77 48">
  <rect x={1} y={1} width={75} height={46} rx={6} fill="#F5F0E1" stroke="#333" strokeWidth={1.5}/>
  <line x1={38} y1={4} x2={38} y2={44} stroke="#333" strokeWidth={1.5}/>
  <circle cx={19} cy={16} r={4} fill="#333"/><circle cx={19} cy={32} r={4} fill="#333"/>
  <circle cx={57} cy={14} r={4} fill="#333"/><circle cx={57} cy={24} r={4} fill="#333"/><circle cx={57} cy={34} r={4} fill="#333"/>
</svg>}

function victoryBeeps(){try{const c=new(window.AudioContext||window.webkitAudioContext)();const notes=[392,494,587,784,659,784,988,1175,988,1175];const durations=[0.25,0.2,0.2,0.3,0.2,0.2,0.25,0.3,0.2,0.6];let t=0;notes.forEach((f,i)=>{const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;const vol=i>=7?0.09:0.07;g.gain.value=vol;g.gain.setValueAtTime(vol,c.currentTime+t);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+t+durations[i]);o.start(c.currentTime+t);o.stop(c.currentTime+t+durations[i]);t+=durations[i]*0.65});setTimeout(()=>c.close(),4000)}catch(e){}}

function DoneScreen({st,elapsed,user,supPin,onExit}){
  const[xConf,sXConf]=useState(false);
  const tot=st.ok+st.sk,pct=tot>0?Math.round(st.ok/tot*100):0;
  const uname=user?.name||'crack';
  useEffect(()=>{victoryBeeps();sXConf(true);const t1=setTimeout(()=>sXConf(false),3000);const t2=setTimeout(()=>{sXConf(true);setTimeout(()=>sXConf(false),3000)},4000);sayFB('¡Lo has hecho genial, '+uname+'! ¿Quieres seguir?');return()=>{clearTimeout(t1);clearTimeout(t2)}},[]);
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
          <p style={{fontSize:22,fontWeight:700,margin:0,color:GREEN}}>¡Lo has hecho genial!</p>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:24,animation:'fadeIn .5s 1.1s both'}}>
          <button onClick={()=>onExit('repeat')} style={{width:110,height:110,borderRadius:'50%',border:'3px solid #27ae60',background:GREEN,color:'#fff',fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer',boxShadow:'4px 4px 0 #1e8449',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,transition:'transform .1s'}}><span style={{fontSize:28}}>🔄</span><span>¡Otra ronda!</span></button>
          <button onClick={()=>onExit('menu')} style={{width:110,height:110,borderRadius:'50%',border:'3px solid #2980b9',background:BLUE,color:'#fff',fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer',boxShadow:'4px 4px 0 #1a5276',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,transition:'transform .1s'}}><span style={{fontSize:28}}>🪐</span><span>Menú</span></button>
        </div>
      </div>}
    </div>
  </div>}

export default function App(){
  const[profs,setProfs]=useState(()=>loadData('profiles',[]));const[user,setUser]=useState(null);const[scr,setScr]=useState(()=>loadData('sup_pin',null)?'login':'setup');const[ov,setOv]=useState(null);
  const[supPin,setSupPin]=useState(()=>loadData('sup_pin',null));const[supInp,setSupInp]=useState('');
  const[queue,setQ]=useState([]);const[idx,setIdx]=useState(0);const[st,setSt]=useState({ok:0,sk:0});const[conf,setConf]=useState(false);
  const[creating,setCreating]=useState(false);const[fn,setFn]=useState('');const[fa,setFa]=useState('');const[fav,setFav]=useState(AVS[0]);const[flv,setFlv]=useState(1);const[fsex,setFsex]=useState('m');
  const[fPadre,setFPadre]=useState('');const[fMadre,setFMadre]=useState('');const[fHerm,setFHerm]=useState('');const[fAmigos,setFAmigos]=useState('');const[fTel,setFTel]=useState('');const[fDir,setFDir]=useState('');
  const[ptab,setPtab]=useState('config');const[pp,setPp]=useState('');const[pi,setPi]=useState('');const[pe,setPe]=useState(false);const[pOpenPlanet,setPOpenPlanet]=useState(null);
  const[consec,setConsec]=useState(0);const[showLvAdj,setShowLvAdj]=useState(false);const[showRec,setShowRec]=useState(false);
  const[parentPin,setParentPin]=useState('');const[parentPinOk,setParentPinOk]=useState(false);const[delConf,setDelConf]=useState(false);
  const[micOk,setMicOk]=useState(false);const[supervisorMode,setSupervisorMode]=useState(false);const supervisorTimer=useRef(null);
  const[exigencia,setExigenciaState]=useState(()=>getExigencia());
  function setExigencia(v){setExigenciaState(v);try{localStorage.setItem('toki_exigencia',String(v))}catch(e){}}
  useEffect(()=>{window.__tokiSupervisor=supervisorMode;document.body.classList.toggle('sup-mode',supervisorMode)},[supervisorMode]);
  // Sky theme based on time of day
  useEffect(()=>{function applySky(){document.body.classList.remove('sky-morning','sky-afternoon','sky-night');document.body.classList.add(getSkyClass())}applySky();const iv=setInterval(applySky,60000);return()=>clearInterval(iv)},[]);
  const[mascotMood,setMascotMood]=useState('idle');
  const[showRocket,setShowRocket]=useState(false);
  const streak=useMemo(()=>getStreak(),[scr]);
  const totalStars=useMemo(()=>getTotalStars(),[scr,st]);
  const[showMiCielo,setShowMiCielo]=useState(false);
  const[personas,setPersonas]=useState(()=>{const p=loadData('personas',null);if(p)return p;const def=[{name:'',relation:'Padre',avatar:'👨'},{name:'',relation:'Madre',avatar:'👩'},{name:'',relation:'Hermano',avatar:'👦'},{name:'',relation:'Amigo',avatar:'🧑‍🚀'}];saveData('personas',def);return def});
  function savePersonas(ps){setPersonas(ps);saveData('personas',ps)}
  const[sec,setSec]=useState('decir');const[secLv,setSecLv]=useState(1);const[openGroup,setOpenGroup]=useState(null);
  const[activeMods,setActiveMods]=useState(()=>loadData('active_mods',{}));const[sessionMode,setSessionMode]=useState(()=>loadData('session_mode','free'));const[guidedTasks,setGuidedTasks]=useState(()=>loadData('guided_tasks',[]));const[maxDaily,setMaxDaily]=useState(()=>loadData('max_daily',0));
  const[freeChoice,setFreeChoice]=useState(true);
  const[ss,setSs]=useState(null);const[sm,setSm]=useState(25);const[audioOk,setAudioOk]=useState(false);
  const activeMs=useRef(0);const lastAct=useRef(0);const actTimer=useRef(null);const IDLE_THRESH=10000;
  const[elapsedSt,setElapsedSt]=useState(0);const[trophy8,setTrophy8]=useState(false);const trophy8shown=useRef(false);
  const wakeLockRef=useRef(null);
  useEffect(()=>{async function acquireWakeLock(){try{if('wakeLock' in navigator&&scr==='game'){wakeLockRef.current=await navigator.wakeLock.request('screen')}else if(wakeLockRef.current){wakeLockRef.current.release();wakeLockRef.current=null}}catch(e){}}acquireWakeLock();return()=>{if(wakeLockRef.current){try{wakeLockRef.current.release()}catch(e){}}wakeLockRef.current=null}},[scr]);
  function pokeActive(){lastAct.current=Date.now()}
  useEffect(()=>{if(!ss){if(actTimer.current)clearInterval(actTimer.current);return}
    activeMs.current=0;lastAct.current=Date.now();setElapsedSt(0);
    actTimer.current=setInterval(()=>{const now=Date.now();if(now-lastAct.current<IDLE_THRESH)activeMs.current+=1000;setElapsedSt(Math.floor(activeMs.current/60000))},1000);
    return()=>clearInterval(actTimer.current)},[ss]);
  function tU(){pokeActive();if(audioOk)return;setAudioOk(true);if(window.speechSynthesis){const u=new SpeechSynthesisUtterance(' ');u.volume=0.01;u.lang='es-ES';window.speechSynthesis.speak(u)}
    // Request mic permission on any touch
    navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop())}).catch(()=>{})}
  useEffect(()=>{if(profs.length>0)saveData('profiles',profs)},[profs]);
  // Auto-request mic permission on first touch
  useEffect(()=>{const requestMic=()=>{navigator.mediaDevices&&navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop())}).catch(()=>{});document.removeEventListener('click',requestMic);document.removeEventListener('touchstart',requestMic)};document.addEventListener('click',requestMic);document.addEventListener('touchstart',requestMic);return()=>{document.removeEventListener('click',requestMic);document.removeEventListener('touchstart',requestMic)}},[]);
  function timeUp(){return ss&&sm>0&&activeMs.current>=(sm*60000)}
  function buildQ(u,section,slv){const sh=a=>[...a].sort(()=>Math.random()-.5);
    if(section==='decir'){const wLen=e=>{const t=e.ph||e.su||'';return t.replace(/[¿?¡!,\.]/g,'').split(/\s+/).filter(Boolean).length};
      const wRange=slv===1?[1,2]:slv===2?[2,3]:slv===3?[3,4]:slv===4?[4,5]:[5,99];
      const pool=EX.filter(e=>(e.ty==='flu'||e.ty==='sit')&&wLen(e)>=wRange[0]&&wLen(e)<=wRange[1]);
      const rev=pool.filter(e=>needsRev(e.id,u)),fresh=pool.filter(e=>!(u.srs&&u.srs[e.id])),rest=pool.filter(e=>!rev.includes(e)&&!fresh.includes(e));let sel=[...sh(rev).slice(0,24),...sh(fresh).slice(0,12),...sh(rest).slice(0,4)];while(sel.length<40){const r=pool.filter(e=>!sel.includes(e));if(!r.length)break;sel.push(r[Math.floor(Math.random()*r.length)])}return sel.slice(0,40).sort(()=>Math.random()-.5).map(e=>{const p={...e};if(p.ph)p.ph=personalize(p.ph,u);if(p.fu)p.fu=personalize(p.fu,u);if(p.su)p.su=personalize(p.su,u);if(p.q)p.q=personalize(p.q,u);if(p.si)p.si=personalize(p.si,u);if(p.op)p.op=p.op.map(o=>personalize(o,u));return p})}
    if(section==='frase'){const wc=slv===1?3:slv===2?4:slv===3?5:[6,7];
      const pool=EX.filter(e=>e.ty==='flu'&&e.ph).filter(e=>{const w=e.ph.replace(/[¿?¡!,\.]/g,'').split(/\s+/).length;return Array.isArray(wc)?w>=wc[0]&&w<=wc[1]:w===wc});
      let sel=sh(pool).slice(0,40);return sel.map(e=>{const ph=personalize(e.ph,u);const q=ph.split(/\s+/).length<=3?'¿Cómo dices esto?':'¿Cómo se dice?';
        if(slv===4&&Math.random()>0.5){const words=ph.split(/\s+/);const bi=1+Math.floor(Math.random()*(words.length-2));const blank=words[bi];words[bi]='___';return{...e,ty:'frases_blank',q:'Completa la frase',fu:ph,blank,words,ph:personalize(e.ph,u)}}
        return{...e,ty:'frases',q,fu:ph,ph:personalize(e.ph,u)}})}
    if(section==='contar'){let nums=[];if(slv===1)nums=Array.from({length:20},(_,i)=>i+1);else if(slv===2)nums=Array.from({length:31},(_,i)=>i+20);else if(slv===3)nums=Array.from({length:51},(_,i)=>i+50);else nums=Array.from({length:100},(_,i)=>i+1);return nums.map(n=>({ty:'count',num:n,id:'num_'+n}))}
    if(section==='math'){return genMath(slv).slice(0,30).map((m,i)=>({ty:'math',q:m.q,ans:m.ans,id:'math_'+i}))}
    if(section==='frac'){return genFractions(slv).slice(0,20).map(f=>({ty:'frac',...f}))}
    if(section==='multi'){return genMulti(slv).slice(0,20).map((m,i)=>({ty:'multi',...m,id:'multi_'+i}))}
    if(section==='money'){return genMoney(slv)}
    if(section==='clock'){return genClock(slv)}
    if(section==='calendar'){return genCalendar(slv)}
    if(section==='distribute'){return genDistribute(slv,u)}
    if(section==='writing'){return genWriting(slv)}
    if(section==='razona'){return genRazona(slv)}
    if(section==='lee'){return genLee(slv)}
    if(section==='quiensoy'){return slv===2?[{ty:'quiensoy',id:'qs_pres',text:'Presentación',img:QUIEN_SOY[0].img}]:QUIEN_SOY.map(q=>({ty:'quiensoy',id:q.id,text:q.text,img:q.img,picto:q.picto}))}
    return[]}
  function startGame(){setQ(buildQ(user,sec,secLv));setIdx(0);setSt({ok:0,sk:0});setConsec(0);trophy8shown.current=false;setTrophy8(false);timeUpShown.current=false;setShowRocket(true)}
  function onRocketDone(){setShowRocket(false);setSs(Date.now());setScr('game');sayFB('¡Vamos allá '+(user?.name||'crack')+'!')}
  // No longer auto-finish on timeUp - let kid continue freely after guided time
  const timeUpShown=useRef(false);
  useEffect(()=>{if(scr!=='game'||!ss)return;const ch=setInterval(()=>{if(timeUp()&&!timeUpShown.current){timeUpShown.current=true;setTrophy8(true);victoryBeeps();sayFB('¡Lo has hecho genial! ¿Quieres seguir?')}},2000);return()=>clearInterval(ch)},[scr,ss,elapsedSt]);
  useEffect(()=>{if(scr==='game'&&ss&&elapsedSt>=8&&!trophy8shown.current){trophy8shown.current=true;setTrophy8(true);victoryBeeps()}},[elapsedSt,scr,ss]);
  function saveP(u){const uLv=u.maxLv||u.level||1;const cur=EX.filter(e=>e.lv===uLv);const mas=cur.filter(e=>u.srs&&u.srs[e.id]&&u.srs[e.id].lv>=3).length;if(cur.length>0&&mas/cur.length>=.8&&uLv<5)u.maxLv=uLv+1;u.level=u.maxLv||u.level||1;setProfs(p=>p.map(x=>x.id===u.id?u:x))}
  function onOk(){pokeActive();setConf(true);setConsec(0);setMascotMood('happy');setTimeout(()=>{setConf(false);setMascotMood('idle')},2400);const e=queue[idx];const up=srsUp(e.id,true,user);setUser(up);saveP(up);setSt(s=>({ok:s.ok+1,sk:s.sk}));if(user&&sec){addGroupProgress(user.id,GROUPS.find(g=>g.modules.some(m=>m.k===sec))?.id||sec)}setTimeout(()=>{if(idx+1>=queue.length)fin({ok:st.ok+1,sk:st.sk});else setIdx(idx+1)},200)}
  function onSk(){stopVoice();pokeActive();setMascotMood('sad');setTimeout(()=>setMascotMood('idle'),1500);const e=queue[idx];const up=srsUp(e.id,false,user);setUser(up);saveP(up);const nf=consec+1;setConsec(nf);setSt(s=>({ok:s.ok,sk:s.sk+1}));if(nf>=3&&(user.maxLv||user.level||1)>1)setShowLvAdj(true);else{if(idx+1>=queue.length)fin({ok:st.ok,sk:st.sk+1});else setIdx(idx+1)}}
  function doLvDn(){const up={...user,maxLv:Math.max(1,(user.maxLv||user.level||1)-1),level:Math.max(1,(user.maxLv||user.level||1)-1)};setUser(up);saveP(up);setShowLvAdj(false);setConsec(0);if(idx+1>=queue.length)fin(st);else setIdx(idx+1)}
  function fin(s){const f=s||st;const amin=Math.floor(activeMs.current/60000);const rec={ok:f.ok,sk:f.sk,dt:tdy(),min:amin};const up={...user,hist:[...(user.hist||[]),rec]};setUser(up);saveP(up);setSs(null);setOv('done')}
  function tryExit(){stopVoice();if(freeChoice){setScr('goals')}else{setOv('pin');setPi('')}}
  function chgLv(n){const up={...user,maxLv:n,level:n};setUser(up);saveP(up)}
  const cur=queue[idx];const vids=useMemo(()=>(user?.voices||[]).map(v=>v.id),[user?.voices]);const elapsed=elapsedSt;

  return <div onClick={tU} onTouchStart={tU}><style>{CSS}</style><Confetti show={conf}/><RocketTransition show={showRocket} onDone={onRocketDone} avatar={user?avStr(user.av):null} planetEmoji={GROUPS.find(g=>g.modules.some(m=>m.k===sec))?.emoji} planetColor={(()=>{const PCOL={quiensoy:'#E91E63',dilo:'#4CAF50',cuenta:'#FF9800',razona:'#42A5F5',escribe:'#AB47BC',lee:'#EF5350'};const gid=GROUPS.find(g=>g.modules.some(m=>m.k===sec))?.id;return PCOL[gid]||'#42A5F5'})()}/>
    {showRec&&user&&<VoiceRec user={user} onBack={()=>setShowRec(false)} onSave={up=>{setUser(up);saveP(up);setShowRec(false)}}/>}
    {trophy8&&<div className="ov" onClick={()=>setTrophy8(false)}><div className="ovp ab"><div style={{fontSize:80,marginBottom:12}}>🏆</div><h2 style={{fontSize:24,color:GOLD,margin:'0 0 8px'}}>¡Lo has hecho genial!</h2><p style={{fontSize:18,color:GREEN,fontWeight:700,margin:'0 0 6px'}}>Ejercicios: {st.ok} correctos</p><p style={{fontSize:16,color:DIM,margin:'0 0 16px'}}>de {st.ok+st.sk} intentados</p><Confetti show={true}/><button className="btn btn-gold" onClick={()=>setTrophy8(false)} style={{fontSize:20}}>¡Sigo!</button></div></div>}
    {showLvAdj&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>🤔</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 10px'}}>¿Bajamos el nivel?</p><div style={{display:'flex',gap:10}}><button className="btn btn-g" style={{flex:1}} onClick={doLvDn}>Sí</button><button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setShowLvAdj(false);setConsec(0);if(idx+1>=queue.length)fin(st);else setIdx(idx+1)}}>No</button></div></div></div>}
    {ov==='pin'&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>🔒</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px'}}>PIN del supervisor</p><input className="inp" value={pi} onChange={e=>setPi(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="· · · ·" style={{textAlign:'center',fontSize:30,letterSpacing:16,borderColor:pe?RED:BORDER}}/><div style={{display:'flex',gap:10,marginTop:16}}><button className="btn btn-ghost" style={{flex:1}} onClick={()=>setOv(null)}>Volver</button><button className="btn btn-g" style={{flex:1}} disabled={pi.length<4} onClick={()=>{if(pi===supPin){setOv(null);setUser(null);setScr('login')}else{setPe(true);setPi('');setTimeout(()=>setPe(false),1500)}}}>Salir</button></div></div></div>}
    {ov==='done'&&<DoneScreen st={st} elapsed={elapsed} user={user} supPin={supPin} onExit={(action)=>{setOv(null);setMascotMood('idle');if(action==='repeat'){startGame()}else{setScr('goals')}}}/>}
    {ov==='parentGate'&&user&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>👨‍👩‍👦</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px'}}>Panel de Supervisor</p><p style={{fontSize:14,color:DIM,margin:'0 0 14px'}}>Introduce el PIN</p><input className="inp" value={parentPin} onChange={e=>setParentPin(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="· · · ·" style={{textAlign:'center',fontSize:30,letterSpacing:16,borderColor:pe?RED:BORDER}}/><div style={{display:'flex',gap:10,marginTop:16}}><button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setOv(null);setParentPin('')}}>Cancelar</button><button className="btn btn-g" style={{flex:1}} disabled={!!supPin&&parentPin.length<4} onClick={()=>{if(!supPin||parentPin===supPin){setParentPin('');setSupervisorMode(true);clearTimeout(supervisorTimer.current);supervisorTimer.current=setTimeout(()=>setSupervisorMode(false),600000);setOv('parent')}else{setPe(true);setParentPin('');setTimeout(()=>setPe(false),1500)}}}>Entrar</button></div></div></div>}
    {ov==='parent'&&user&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:BG,overflowY:'auto',zIndex:100,padding:16}}><div style={{maxWidth:600,margin:'0 auto'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}><p style={{fontSize:22,color:GOLD,fontWeight:700,margin:0}}>👨‍👩‍👦 Panel</p><button className="btn btn-gold" style={{width:'auto',padding:'12px 20px',fontSize:18,minHeight:52}} onClick={()=>setOv(null)}>🎮 ¡A jugar!</button></div>
      <div className="tabs" style={{marginBottom:18}}>{['config','familia','stats','srs'].map(t=><button key={t} className={'tab'+(ptab===t?' on':'')} onClick={()=>setPtab(t)} style={{fontSize:16,padding:14}}>{t==='config'?'⚙️':t==='familia'?'👨‍👩‍👦':t==='stats'?'📊':'🧠'}</button>)}</div>
      {ptab==='config'&&<div style={{display:'flex',flexDirection:'column',gap:18}}>
        <div className="card" style={{padding:20}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 12px'}}>🔒 PIN del supervisor</p><input className="inp" value={pp} onChange={e=>setPp(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="1234" style={{textAlign:'center',fontSize:24,letterSpacing:12,padding:14}}/></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 12px'}}>⏱️ Sesión: <span style={{color:GREEN}}>{sm===0?'∞':sm+' min'}</span></p><div style={{display:'flex',gap:8}}>{SMINS.map(m=><button key={m} onClick={()=>setSm(m)} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${sm===m?GOLD:BORDER}`,background:sm===m?GOLD+'22':BG3,color:sm===m?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer',minHeight:52}}>{m===0?'∞':m+"'"}</button>)}</div></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 12px'}}>⏰ Tiempo máximo diario</p><div style={{display:'flex',gap:8}}>{[30,60,120,0].map(m=><button key={m} onClick={()=>{setMaxDaily(m);saveData('max_daily',m)}} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${maxDaily===m?GOLD:BORDER}`,background:maxDaily===m?GOLD+'22':BG3,color:maxDaily===m?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer',minHeight:52}}>{m===0?'Sin límite':m+"'"}</button>)}</div></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 4px'}}>🎤 Exigencia del micro: <span style={{color:GOLD}}>{exigencia}%</span></p><p style={{fontSize:14,color:DIM,margin:'0 0 12px'}}>Cuanto más bajo, más fácil acepta la pronunciación</p><input type="range" min={50} max={100} step={5} value={exigencia} onChange={e=>setExigencia(parseInt(e.target.value))} style={{width:'100%',accentColor:GOLD,height:8,cursor:'pointer'}}/><div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:DIM,marginTop:4}}><span>50% Fácil</span><span>65% Normal</span><span>100% Estricto</span></div></div>
        <div className="card" style={{padding:20}}>{(()=>{
          const PLANET_COLORS_P={quiensoy:['#F8BBD0','#E91E63','#AD1457'],dilo:['#A5D6A7','#4CAF50','#2E7D32'],cuenta:['#FFCC80','#FF9800','#E65100'],razona:['#90CAF9','#42A5F5','#1565C0'],escribe:['#CE93D8','#AB47BC','#6A1B9A'],lee:['#EF9A9A','#EF5350','#B71C1C']};
          const totalActive=GROUPS.reduce((n,g)=>n+g.modules.filter(m=>activeMods[m.lvKey]!==false).length,0);
          const MAX_ACTIVE=4;
          const parentOpenPlanet=pOpenPlanet;const setParentOpenPlanet=setPOpenPlanet;
          return <>
            <p style={{fontSize:20,fontWeight:700,margin:'0 0 4px'}}>🪐 Planetas activos</p>
            <p style={{fontSize:14,color:DIM,margin:'0 0 4px'}}>Toca un planeta para ver sus módulos. Toca cada módulo para activarlo/desactivarlo.</p>
            <p style={{fontSize:15,fontWeight:600,margin:'0 0 12px',color:totalActive>MAX_ACTIVE?RED:totalActive<=MAX_ACTIVE?GREEN:'#E67E22'}}>
              {totalActive} activos {totalActive>MAX_ACTIVE&&'⚠️ Máximo recomendado: '+MAX_ACTIVE}
            </p>
            {/* Planets as circles */}
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,marginBottom:12}}>
              {GROUPS.map(g=>{
                const pc=PLANET_COLORS_P[g.id]||[g.color+'88',g.color,g.color];
                const anyOn=g.modules.some(m=>activeMods[m.lvKey]!==false);
                const isOpenP=parentOpenPlanet===g.id;
                return <button key={g.id} onClick={()=>setParentOpenPlanet(isOpenP?null:g.id)} style={{
                  width:70,height:90,padding:0,border:'none',background:'none',cursor:'pointer',fontFamily:"'Fredoka'",color:TXT,
                  display:'flex',flexDirection:'column',alignItems:'center',gap:3,
                  opacity:anyOn?1:0.4,filter:anyOn?'none':'grayscale(0.8)',transition:'all .3s',
                  transform:isOpenP?'scale(1.1)':'scale(1)',
                }}>
                  <div style={{
                    width:60,height:60,borderRadius:'50%',
                    background:`radial-gradient(circle at 30% 25%,${pc[0]},${pc[1]} 60%,${pc[2]})`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    boxShadow:isOpenP?`0 0 16px ${pc[1]}88`:`0 2px 8px rgba(0,0,0,.3)`,
                    border:isOpenP?`3px solid ${pc[0]}`:'3px solid transparent',
                  }}>
                    <span style={{fontSize:26}}>{g.emoji}</span>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,lineHeight:1.1,textAlign:'center'}}>{g.name}</div>
                </button>})}
            </div>
            {/* Satellites for open planet */}
            {parentOpenPlanet&&GROUPS.filter(g=>g.id===parentOpenPlanet).map(g=>{
              const pc=PLANET_COLORS_P[g.id]||[g.color+'88',g.color,g.color];
              return <div key={g.id} className="af" style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,padding:'12px 0',borderTop:`2px solid ${g.color}33`}}>
                {g.modules.map((m,mi)=>{
                  const isOn=activeMods[m.lvKey]!==false;
                  const wouldExceed=!isOn&&totalActive>=MAX_ACTIVE;
                  return <button key={mi} onClick={()=>{if(wouldExceed)return;const na={...activeMods,[m.lvKey]:!isOn};setActiveMods(na);saveData('active_mods',na)}} style={{
                    width:90,display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                    padding:6,border:'none',background:'none',cursor:wouldExceed?'not-allowed':'pointer',fontFamily:"'Fredoka'",
                    opacity:wouldExceed&&!isOn?0.3:1,transition:'all .25s',
                  }}>
                    <div style={{
                      width:56,height:56,borderRadius:'50%',
                      background:isOn
                        ?`radial-gradient(circle at 30% 25%,${pc[0]},${pc[1]} 70%,${pc[2]})`
                        :`radial-gradient(circle at 30% 25%,#666,#444 70%,#333)`,
                      border:isOn?`3px solid ${GREEN}`:`3px solid #555`,
                      boxShadow:isOn?`0 0 12px ${GREEN}44`:'none',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      transition:'all .25s',
                    }}>
                      <span style={{fontSize:isOn?22:18,filter:isOn?'':'brightness(0.5)',transition:'all .25s'}}>
                        {isOn?'✅':'⬤'}
                      </span>
                    </div>
                    <div style={{fontSize:11,fontWeight:600,color:isOn?TXT:DIM,textAlign:'center',lineHeight:1.15}}>{m.l}</div>
                  </button>})}
              </div>})}
          </>})()}
        </div>
        <div className="card" style={{padding:20}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 12px'}}>📋 Nivel por módulo</p><p style={{fontSize:16,color:DIM,margin:'0 0 10px'}}>Configura el nivel que verá el niño en cada módulo</p>
          {GROUPS.map(g=><div key={g.id} style={{marginBottom:10,border:`1px solid ${g.color+'33'}`,borderRadius:10,padding:12,background:g.color+'06'}}>
            <p style={{fontSize:18,fontWeight:600,margin:'0 0 6px',color:g.color}}>{g.emoji} {g.name}</p>
            {g.modules.map((m,mi)=>{const opts=LV_OPTS[m.lvKey]||[];const curLv=getModuleLv(m.lvKey)||m.defLv;
              return <div key={mi} style={{marginBottom:8}}>
              <p style={{fontSize:16,color:DIM,margin:'0 0 4px',fontWeight:600}}>{m.l}</p>
              {opts.length>1?<div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{opts.map(lv=>
                <button key={lv.n} onClick={()=>{setModuleLv(m.lvKey,lv.n);setActiveMods(a=>({...a}))}} style={{padding:'8px 12px',borderRadius:8,border:`2px solid ${curLv===lv.n?g.color:BORDER}`,background:curLv===lv.n?g.color+'22':BG3+'44',color:curLv===lv.n?g.color:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:14,cursor:'pointer',minHeight:40}}>{curLv===lv.n?'● ':''}{lv.l}</button>
              )}</div>:<p style={{fontSize:14,color:DIM+'88',margin:0}}>Nivel fijo</p>}
            </div>})}
          </div>)}
        </div>
        <div className="card" style={{padding:20}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 12px'}}>📝 Sesión de hoy</p>
          <div style={{display:'flex',gap:8,marginBottom:12}}>{['free','guided'].map(m=><button key={m} onClick={()=>{setSessionMode(m);saveData('session_mode',m)}} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${sessionMode===m?GOLD:BORDER}`,background:sessionMode===m?GOLD+'22':BG3,color:sessionMode===m?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer',minHeight:52}}>{m==='free'?'🆓 Libre':'📋 Guiada'}</button>)}</div>
          {sessionMode==='guided'&&<div>
            <p style={{fontSize:16,color:DIM,margin:'0 0 6px'}}>Elige hasta 4 tareas:</p>
            <p style={{fontSize:14,color:GOLD,fontWeight:700,margin:'0 0 10px'}}>Máximo 4 tareas</p>
            {[0,1,2,3].map(i=>{const t=guidedTasks[i];const filledCount=guidedTasks.filter(Boolean).length;const isDisabled=!t&&filledCount>=4;return <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'center'}}>
              <span style={{fontSize:18,color:DIM,fontWeight:700,width:24}}>{i+1}.</span>
              <select disabled={isDisabled} style={{flex:1,padding:12,borderRadius:10,border:`2px solid ${BORDER}`,background:isDisabled?BG3+'44':BG3,color:isDisabled?DIM:TXT,fontFamily:"'Fredoka'",fontSize:18,minHeight:48,opacity:isDisabled?.5:1}} value={t?t.k+'_'+t.lv:''} onChange={e=>{const v=e.target.value;if(!v){const nt=[...guidedTasks];nt.splice(i,1);setGuidedTasks(nt);saveData('guided_tasks',nt);return}
                const[k,lv]=v.split('_');const nt=[...guidedTasks];nt[i]={k,lv:parseInt(lv),count:10};setGuidedTasks(nt);saveData('guided_tasks',nt)}}>
                <option value="">— vacío —</option>
                {GROUPS.flatMap(g=>g.modules.map(m=>{const mLv=getModuleLv(m.lvKey)||m.defLv;return <option key={m.k+'_'+mLv} value={m.k+'_'+mLv}>{g.emoji} {m.l}</option>}))}
              </select>
            </div>})}
            {guidedTasks.filter(Boolean).length>=4&&<p style={{fontSize:14,color:RED,fontWeight:700,margin:'4px 0 0'}}>Has alcanzado el máximo de 4 tareas</p>}
          </div>}
        </div>
        <div className="card" style={{padding:20}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 12px'}}>🎯 Módulo de hoy</p>
          <button onClick={()=>{setFreeChoice(!freeChoice)}} style={{width:'100%',padding:'14px 20px',borderRadius:10,border:`3px solid ${freeChoice?GREEN:BORDER}`,background:freeChoice?GREEN+'22':BG3,color:freeChoice?GREEN:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer',marginBottom:12,minHeight:52}}>{freeChoice?'✅ Elección libre (el niño elige)':'❌ Elección libre'}</button>
          {!freeChoice&&<div style={{display:'flex',flexDirection:'column',gap:12}}>
            {GROUPS.map(g=><div key={g.id} style={{border:`2px solid ${g.color+'44'}`,borderRadius:12,padding:12,background:g.color+'08'}}>
              <p style={{fontSize:18,fontWeight:600,margin:'0 0 8px',color:g.color}}>{g.emoji} {g.name}</p>
              {g.modules.map((m,mi)=>{const mLv=getModuleLv(m.lvKey)||m.defLv;return <button key={mi} onClick={()=>{setSec(m.k);setSecLv(mLv)}} style={{display:'block',width:'100%',marginBottom:8,padding:'14px 16px',borderRadius:10,border:`2px solid ${sec===m.k&&secLv===mLv?g.color:BORDER}`,background:sec===m.k&&secLv===mLv?g.color+'33':BG3,color:sec===m.k&&secLv===mLv?g.color:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer',textAlign:'left',minHeight:52}}>{m.l}</button>})}
            </div>)}
          </div>}
        </div>
        <button className="btn btn-gold" onClick={()=>{if(pp.length===4){setSupPin(pp);saveData('sup_pin',pp)}const up={...user,sessionMin:sm,freeChoice,sec,secLv};setUser(up);saveP(up);setOv(null)}} style={{fontSize:20,padding:'16px 20px',minHeight:52}}>💾 Guardar</button>
        <button className="btn btn-g" onClick={()=>{if(pp.length===4){setSupPin(pp);saveData('sup_pin',pp)}const up={...user,sessionMin:sm,freeChoice,sec,secLv};setUser(up);saveP(up);setOv(null)}} style={{marginTop:8,fontSize:24,padding:'20px 24px',minHeight:64}}>🎮 ¡A jugar!</button>
        <button className="btn btn-p" onClick={()=>{setOv(null);setShowRec(true)}} style={{marginTop:8,fontSize:18,padding:'14px 20px',minHeight:52}}>🎙️ Grabar voces</button>
        <div style={{marginTop:20,borderTop:'1px solid '+BORDER,paddingTop:20}}>{!delConf?<button className="btn btn-ghost" style={{color:RED,borderColor:RED+'44',fontSize:18,padding:'14px 20px',minHeight:52}} onClick={()=>setDelConf(true)}>🗑️ Borrar perfil de {user.name}</button>:<div className="card" style={{borderColor:RED+'66',background:RED+'0C',padding:20}}><p style={{fontSize:18,fontWeight:600,color:RED,margin:'0 0 10px'}}>¿Seguro? Se perderá todo el progreso</p><div style={{display:'flex',gap:10}}><button className="btn btn-ghost" style={{flex:1,fontSize:18,minHeight:52}} onClick={()=>setDelConf(false)}>Cancelar</button><button className="btn btn-g" style={{flex:1,background:RED,borderColor:'#c0392b',boxShadow:'4px 4px 0 #922b21',fontSize:18,minHeight:52}} onClick={()=>{setProfs(p=>p.filter(x=>x.id!==user.id));setUser(null);setOv(null);setDelConf(false);setScr('login')}}>Sí, borrar</button></div></div>}
        <button className="btn btn-ghost" style={{color:RED,borderColor:RED+'22',marginTop:12,fontSize:16,padding:'14px 20px',minHeight:52}} onClick={()=>{if(confirm('¿Borrar todos los perfiles y progreso? Las voces grabadas se conservan.')){const keep={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('toki_voice_'))keep[k]=localStorage.getItem(k)}localStorage.clear();Object.entries(keep).forEach(([k,v])=>localStorage.setItem(k,v));setProfs([]);setUser(null);setOv(null);setScr('setup')}}}>🔄 Resetear app (conserva voces)</button></div>
      </div>}
      {ptab==='familia'&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>👨 Nombre del padre</p><input className="inp" value={user.padre||''} onChange={e=>{const up={...user,padre:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Paco" style={{fontSize:18,padding:14}}/></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>👩 Nombre de la madre</p><input className="inp" value={user.madre||''} onChange={e=>{const up={...user,madre:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Ana" style={{fontSize:18,padding:14}}/></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>👦 Hermanos (separados por coma)</p><input className="inp" value={user.hermanos||''} onChange={e=>{const up={...user,hermanos:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Sofía, Miguel" style={{fontSize:18,padding:14}}/></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>🤝 Mejores amigos (separados por coma)</p><input className="inp" value={user.amigos||''} onChange={e=>{const up={...user,amigos:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Vega, Amir, Carlos" style={{fontSize:18,padding:14}}/></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>📱 Teléfono de emergencia</p><input className="inp" value={user.telefono||''} onChange={e=>{const up={...user,telefono:e.target.value};setUser(up);saveP(up)}} type="tel" placeholder="Ej: 6.1.2.3.4.5.6.7.8" style={{fontSize:18,padding:14}}/><p style={{fontSize:14,color:DIM,margin:'8px 0 0'}}>Con puntos para pronunciar: 6.1.2.3.4.5</p></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>🏠 Dirección de casa</p><input className="inp" value={user.direccion||''} onChange={e=>{const up={...user,direccion:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Calle Mayor 10, Madrid" style={{fontSize:18,padding:14}}/></div>
        <p style={{fontSize:16,color:DIM,margin:0}}>Estos datos se usan en frases personalizadas para que practique con su información real.</p>
        <div className="card" style={{marginTop:16,borderColor:PURPLE+'44',padding:20}}>
          <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:PURPLE}}>👥 Mis Personas</p>
          <p style={{fontSize:16,color:DIM,margin:'0 0 12px'}}>Se usan como nombres en ejercicios de Reparte y Cuenta</p>
          {personas.map((p,i)=><div key={i} style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
            <button onClick={()=>{const avIdx=AVS.indexOf(p.avatar||AVS[0]);const next=AVS[(avIdx+1)%AVS.length];const np=[...personas];np[i]={...np[i],avatar:next};savePersonas(np)}} style={{fontSize:28,background:'none',border:'none',cursor:'pointer',width:44,height:44}}>{p.avatar||AVS[0]}</button>
            <input className="inp" value={p.name||''} onChange={e=>{const np=[...personas];np[i]={...np[i],name:e.target.value};savePersonas(np)}} placeholder="Nombre" style={{fontSize:18,padding:12,flex:1}}/>
            <select value={p.relation||''} onChange={e=>{const np=[...personas];np[i]={...np[i],relation:e.target.value};savePersonas(np)}} style={{padding:12,borderRadius:10,border:'2px solid '+BORDER,background:BG3,color:TXT,fontFamily:"'Fredoka'",fontSize:16,maxWidth:130,minHeight:48}}>
              <option value="">Relación</option>{PERSONA_RELATIONS.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
            <button onClick={()=>{const np=personas.filter((_,j)=>j!==i);savePersonas(np)}} style={{background:RED+'22',border:'1px solid '+RED+'44',borderRadius:10,padding:'8px 12px',color:RED,fontSize:18,cursor:'pointer',fontFamily:"'Fredoka'",minHeight:48}}>✕</button>
          </div>)}
          {personas.length<10&&<button className="btn btn-ghost" onClick={()=>savePersonas([...personas,{name:'',relation:'',avatar:AVS[Math.floor(Math.random()*AVS.length)]}])} style={{fontSize:18,marginTop:8,padding:'14px 20px',minHeight:52}}>➕ Añadir persona</button>}
        </div>
      </div>}
      {ptab==='stats'&&(()=>{const h=user.hist||[],tc=h.reduce((s,x)=>s+x.ok,0),ta=h.reduce((s,x)=>s+x.ok+x.sk,0),pct=ta>0?Math.round(tc/ta*100):0,tm=h.reduce((s,x)=>s+(x.min||0),0);return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{[{l:'Sesiones',v:h.length,c:GREEN},{l:'Aciertos',v:tc,c:BLUE},{l:'%',v:pct+'%',c:GOLD},{l:'Minutos',v:tm,c:PURPLE}].map((s,i)=><div key={i} className="sbox"><div style={{fontSize:28,color:s.c,fontWeight:700}}>{s.v}</div><div style={{fontSize:13,color:DIM,marginTop:4}}>{s.l}</div></div>)}</div>})()}
      {ptab==='srs'&&(()=>{const mas=Object.values(user.srs||{}).filter(s=>s.lv>=4).length,lrn=Object.values(user.srs||{}).filter(s=>s.lv>0&&s.lv<4).length,nw=EX.length-mas-lrn;return <div style={{textAlign:'center',padding:'20px 0'}}><div style={{display:'flex',justifyContent:'center',gap:20}}>{[{l:'Dominadas',v:mas,c:GREEN},{l:'Aprendiendo',v:lrn,c:GOLD},{l:'Nuevas',v:nw,c:PURPLE}].map((s,i)=><div key={i}><div style={{position:'relative',display:'inline-block'}}><Ring p={s.v/EX.length} sz={80} c={s.c}/><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:20,color:s.c,fontWeight:700}}>{s.v}</div></div><div style={{fontSize:13,color:DIM,marginTop:6}}>{s.l}</div></div>)}</div></div>})()}
    </div></div>}

    {scr==='setup'&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:80,marginBottom:8,animation:'glow 3s infinite'}}>🗣️</div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p>
      <div className="card" style={{padding:24,textAlign:'left',marginBottom:16}}>
        <p style={{fontSize:20,color:GOLD,fontWeight:700,textAlign:'center',margin:'0 0 16px'}}>Configuración inicial</p>
        <p style={{fontSize:15,color:DIM,margin:'0 0 14px'}}>Este PIN lo usará el supervisor (padre, madre o tutor) para gestionar la app. El niño no podrá salir sin él.</p>
        <label style={{fontSize:16,fontWeight:600,color:TXT}}>🔒 PIN del supervisor (4 dígitos)</label>
        <input className="inp" value={supInp} onChange={e=>setSupInp(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="· · · ·" style={{marginTop:8,marginBottom:20,textAlign:'center',fontSize:30,letterSpacing:16}}/>
        <div style={{background:BLUE+'15',border:'2px solid '+BLUE+'33',borderRadius:14,padding:16,marginBottom:16}}>
          <p style={{fontSize:16,fontWeight:600,margin:'0 0 8px'}}>🎤 Permiso del micrófono</p>
          <p style={{fontSize:14,color:DIM,margin:'0 0 12px'}}>Toki necesita el micrófono para escuchar al niño. Sin él, la app no funciona.</p>
          {!micOk?<button className="btn btn-b" onClick={()=>{navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop());setMicOk(true)}).catch(()=>alert('No se ha podido activar el micrófono. Revisa los permisos del navegador.'))}} style={{fontSize:18}}>🎤 Activar micrófono</button>
          :<p style={{fontSize:18,color:GREEN,fontWeight:700,margin:0}}>✅ Micrófono activado</p>}
        </div>
        <button className="btn btn-gold" disabled={supInp.length<4||!micOk} onClick={()=>{setSupPin(supInp);saveData('sup_pin',supInp);setSupInp('');setScr('login')}} style={{fontSize:22}}>Empezar 🚀</button>
        {supInp.length<4&&<p style={{fontSize:13,color:DIM,textAlign:'center',margin:'10px 0 0'}}>Escribe 4 dígitos para el PIN</p>}
        {supInp.length===4&&!micOk&&<p style={{fontSize:13,color:GOLD,textAlign:'center',margin:'10px 0 0'}}>Activa el micrófono para continuar</p>}
      </div>
      <p style={{color:DIM+'99',fontSize:13,position:'fixed',bottom:10,left:0,right:0,textAlign:'center'}}><b>Toki &middot; Aprende a decirlo</b> by Diego Aroca &copy; 2026 &mdash; {VER}</p>
    </div>}

    {scr==='login'&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:80,marginBottom:8,animation:'glow 3s infinite'}}>🗣️</div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p><p style={{color:DIM+'99',fontSize:13,position:'fixed',bottom:10,left:0,right:0,textAlign:'center'}}><b>Toki &middot; Aprende a decirlo</b> by Diego Aroca &copy; 2026 &mdash; {VER}</p>
      {profs.length>0&&!creating&&<div style={{display:'flex',justifyContent:'center',gap:28,marginBottom:28,flexWrap:'wrap'}}>{profs.map(p=>{
        const myPersonas=personas.filter(pp=>pp.name&&pp.name.trim());
        const pN=myPersonas.length;
        const pOrbitR=140;const pSize=52;
        return <button key={p.id} onClick={()=>{setUser(p);setSm(p.sessionMin||25);setSec(p.sec||'decir');setSecLv(p.secLv||1);setFreeChoice(true);setVoiceProfile(p.age,p.sex);setScr('goals')}} style={{
        background:'none',border:'none',cursor:'pointer',fontFamily:"'Fredoka'",color:TXT,
        display:'flex',flexDirection:'column',alignItems:'center',gap:8,padding:0,transition:'transform .2s',position:'relative',
      }}>
        {/* Personas orbitando alrededor del avatar */}
        {pN>0&&<div style={{position:'absolute',top:'50%',left:'50%',width:0,height:0,zIndex:0,marginTop:-10}}>
          {/* Orbit ring */}
          <svg style={{position:'absolute',left:-pOrbitR,top:-pOrbitR*0.5,width:pOrbitR*2,height:pOrbitR,pointerEvents:'none',overflow:'visible'}}>
            <ellipse cx={pOrbitR} cy={pOrbitR*0.5} rx={pOrbitR} ry={pOrbitR*0.45} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" strokeDasharray="4 3"/>
          </svg>
          {myPersonas.map((pp,i)=>{
            const angle=(360/pN)*i - 45;
            const rad=angle*Math.PI/180;
            const px=pOrbitR*Math.cos(rad);
            const py=pOrbitR*0.45*Math.sin(rad);
            const relColors={'Padre':'#42A5F5','Madre':'#E91E63','Hermano':'#4CAF50','Hermana':'#AB47BC','Abuelo':'#FF9800','Abuela':'#FF7043','Amigo':'#26C6DA','Amiga':'#EC407A','Mejor amigo/a':'#FFCA28','Profe':'#7E57C2'};
            const rc=relColors[pp.relation]||'#78909C';
            return <div key={i} style={{position:'absolute',left:px-pSize/2,top:py-pSize/2,
              width:pSize,height:pSize,borderRadius:'50%',
              background:`radial-gradient(circle at 30% 25%,${rc}88,${rc} 70%,${rc}CC)`,
              display:'flex',alignItems:'center',justifyContent:'center',
              boxShadow:`0 2px 8px ${rc}44`,
              animation:`planetFloat ${3+i*0.5}s ease-in-out ${i*0.3}s infinite`,
              flexDirection:'column',pointerEvents:'none',
            }}>
              <span style={{fontSize:22}}>{pp.avatar||'👤'}</span>
              <span style={{position:'absolute',bottom:-20,fontSize:14,color:'#E8E8F0',fontWeight:500,whiteSpace:'nowrap',textShadow:'0 1px 3px rgba(0,0,0,.5)',letterSpacing:0.3}}>{pp.name}</span>
            </div>})}
        </div>}
        <div style={{
          width:130,height:130,borderRadius:'50%',
          background:'radial-gradient(circle at 30% 25%,#90CAF9,#42A5F5 60%,#1565C0)',
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 4px 24px #42A5F544, inset 0 -4px 12px #1565C066, inset 0 4px 8px #90CAF988',
          animation:'planetFloat 4s ease-in-out infinite',
          position:'relative',zIndex:1,
        }}>
          <span style={{fontSize:56,filter:'drop-shadow(0 2px 6px rgba(0,0,0,.3))'}}>{avStr(p.av)}</span>
        </div>
        <div style={{fontSize:20,fontWeight:600,position:'relative',zIndex:1}}>{p.name}</div>
        <div style={{fontSize:14,color:DIM,position:'relative',zIndex:1}}>{p.age} años</div>
      </button>})}</div>}
      {profs.length<4&&!creating&&<button onClick={()=>setCreating(true)} style={{
        background:'none',border:'none',cursor:'pointer',fontFamily:"'Fredoka'",color:TXT,
        display:'flex',flexDirection:'column',alignItems:'center',gap:6,margin:'0 auto',padding:0,
      }}>
        <div style={{
          width:80,height:80,borderRadius:'50%',
          background:'radial-gradient(circle at 30% 25%,#CE93D8,#AB47BC 60%,#6A1B9A)',
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 4px 16px #AB47BC44, inset 0 -3px 10px #6A1B9A66',
          animation:'planetFloat 4s ease-in-out 1s infinite',
        }}>
          <span style={{fontSize:36}}>➕</span>
        </div>
        <div style={{fontSize:16,fontWeight:600,color:DIM}}>Nuevo Jugador</div>
      </button>}
      {creating&&<div className="card af" style={{padding:24,textAlign:'left'}}><p style={{fontSize:22,color:GOLD,textAlign:'center',margin:'0 0 18px',fontWeight:700}}>Nuevo Jugador</p>
        <label style={{fontSize:15,color:DIM}}>Nombre</label><input className="inp" value={fn} onChange={e=>setFn(e.target.value)} placeholder="Ej: Nico" style={{marginBottom:14,marginTop:6}}/>
        <label style={{fontSize:15,color:DIM}}>Fecha de nacimiento</label><input className="inp" value={fa} onChange={e=>setFa(e.target.value)} type="date" style={{marginBottom:14,marginTop:6}}/>
        <label style={{fontSize:15,color:DIM}}>Sexo</label><div style={{display:'flex',gap:10,margin:'8px 0 14px'}}>{[['m','👦 Chico'],['f','👧 Chica']].map(([v,l])=><button key={v} onClick={()=>setFsex(v)} style={{flex:1,padding:'14px 0',borderRadius:12,border:`3px solid ${fsex===v?GOLD:BORDER}`,background:fsex===v?GOLD+'22':BG3,color:fsex===v?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer'}}>{l}</button>)}</div>
        <div style={{borderTop:'1px solid '+BORDER,paddingTop:14,marginBottom:14}}><p style={{fontSize:16,color:GOLD,fontWeight:700,margin:'0 0 12px'}}>👨‍👩‍👦 Familia (opcional, para frases personalizadas)</p>
        <label style={{fontSize:14,color:DIM}}>Nombre del padre</label><input className="inp" value={fPadre} onChange={e=>setFPadre(e.target.value)} placeholder="Ej: Paco" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:14,color:DIM}}>Nombre de la madre</label><input className="inp" value={fMadre} onChange={e=>setFMadre(e.target.value)} placeholder="Ej: Ana" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:14,color:DIM}}>Hermanos (separados por coma)</label><input className="inp" value={fHerm} onChange={e=>setFHerm(e.target.value)} placeholder="Ej: Sofía, Miguel" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:14,color:DIM}}>Mejores amigos (separados por coma)</label><input className="inp" value={fAmigos} onChange={e=>setFAmigos(e.target.value)} placeholder="Ej: Vega, Amir, Carlos" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:14,color:DIM}}>Teléfono de emergencia</label><input className="inp" value={fTel} onChange={e=>setFTel(e.target.value)} type="tel" placeholder="Ej: 6.1.2.3.4.5.6.7.8" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:14,color:DIM}}>Dirección de casa</label><input className="inp" value={fDir} onChange={e=>setFDir(e.target.value)} placeholder="Ej: Calle Mayor 10, Madrid" style={{marginBottom:14,marginTop:4,fontSize:17}}/></div>
        <label style={{fontSize:15,color:DIM}}>Avatar</label><div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',margin:'10px 0 18px'}}>{AVS.map(a=><button key={a} className={'avbtn'+(fav===a?' on':'')} onClick={()=>setFav(a)}>{a}</button>)}</div>
        <div style={{display:'flex',gap:10}}><button className="btn btn-ghost" style={{flex:1}} onClick={()=>setCreating(false)}>Cancelar</button><button className="btn btn-g" style={{flex:2}} disabled={!fn.trim()||!fa} onClick={()=>{const bd=new Date(fa),now=new Date(),age=Math.floor((now-bd)/31557600000);const p={id:Date.now()+'',name:cap(fn.trim()),birthdate:fa,age:Math.max(1,age),sex:fsex,av:fav,hist:[],srs:{},level:1,maxLv:1,sessionMin:25,voices:[],padre:fPadre.trim(),madre:fMadre.trim(),hermanos:fHerm.trim(),amigos:fAmigos.trim(),telefono:fTel.trim(),direccion:fDir.trim()};setProfs(prev=>[...prev,p]);setUser(p);setCreating(false);setFn('');setFa('');setFPadre('');setFMadre('');setFHerm('');setFAmigos('');setFTel('');setFDir('');setVoiceProfile(Math.max(1,age),fsex);setScr('goals')}}>Crear ✓</button></div></div>}
    </div>}

    {showMiCielo&&<div className="ov" onClick={()=>setShowMiCielo(false)}><div className="ovp ab" onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:72,marginBottom:8}}>🌌</div>
      <h2 style={{fontSize:24,color:GOLD,margin:'0 0 12px'}}>Mi Cielo</h2>
      <div style={{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center',marginBottom:16,minHeight:60}}>
        {Array.from({length:Math.min(totalStars,100)},(_,i)=><span key={i} style={{fontSize:totalStars>50?14:20,animation:`twinkle ${1+Math.random()*2}s ease-in-out ${Math.random()*2}s infinite alternate`}}>⭐</span>)}
        {totalStars>100&&<span style={{fontSize:16,color:GOLD,fontWeight:700}}>+{totalStars-100} mas</span>}
      </div>
      <p style={{fontSize:36,fontWeight:900,color:GOLD}}>{totalStars}</p>
      <p style={{fontSize:16,color:DIM}}>estrellas conseguidas</p>
      <button className="btn btn-ghost" onClick={()=>setShowMiCielo(false)} style={{marginTop:16}}>Cerrar</button>
    </div></div>}
    {scr==='goals'&&user&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><button style={{background:'none',border:'none',color:DIM,fontSize:16}} onClick={()=>{setOv('pin');setPi('')}}>← Cambiar</button><div style={{display:'flex',gap:12}}><button style={{background:'none',border:'none',color:DIM,fontSize:32,width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',borderRadius:14,padding:0}} onClick={()=>{setParentPinOk(false);setParentPin('');setPp(supPin||'');setSm(user.sessionMin||25);setSec(user.sec||sec);setSecLv(user.secLv||secLv);setFreeChoice(user.freeChoice||false);setPtab('config');setDelConf(false);setOv('parentGate')}}>⚙️</button></div></div>
      <div style={{textAlign:'center',padding:'4px 0 2px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:2}}>
          <div style={{fontSize:36}}>{avStr(user.av)}</div>
          <SpaceMascot mood={mascotMood} size={36}/>
          <div><h2 style={{fontSize:18,margin:0,color:GOLD,textAlign:'left'}}>{getGreeting(user.name)}</h2><p style={{fontSize:12,color:DIM,margin:0,textAlign:'left'}}>⏱️ Sesión {sm===0?'∞':'de '+sm+' min'}</p></div>
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:4}}>
          <button onClick={()=>setShowMiCielo(true)} style={{background:CARD,border:'2px solid '+BORDER,borderRadius:12,padding:'4px 12px',cursor:'pointer',fontFamily:"'Fredoka'",display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:16}}>🌌</span><span style={{fontSize:13,color:GOLD,fontWeight:700}}>{totalStars} ⭐</span></button>
          {streak>1&&<div style={{background:CARD,border:'2px solid '+BORDER,borderRadius:12,padding:'6px 14px',display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:18}}>🔥</span><span style={{fontSize:14,color:'#E67E22',fontWeight:700}}>{streak} días</span></div>}
        </div>
      </div>
      {freeChoice?(()=>{
        const visibleGroups=GROUPS.filter(g=>g.modules.some(m=>activeMods[m.lvKey]!==false));
        const PLANET_COLORS={
          quiensoy:['#F8BBD0','#E91E63','#AD1457'],
          dilo:['#A5D6A7','#4CAF50','#2E7D32'],
          cuenta:['#FFCC80','#FF9800','#E65100'],
          razona:['#90CAF9','#42A5F5','#1565C0'],
          escribe:['#CE93D8','#AB47BC','#6A1B9A'],
          lee:['#EF9A9A','#EF5350','#B71C1C']
        };
        const openG=openGroup?visibleGroups.find(g=>g.id===openGroup):null;
        const otherGroups=openGroup?visibleGroups.filter(g=>g.id!==openGroup):[];
        return <div style={{position:'relative',minHeight:320}}>
        {/* When NO group is open: orbiting planets around center */}
        {!openGroup&&(()=>{
          const allGroups=GROUPS;
          const n=allGroups.length;
          const orbitR=160;const scX=1.8;const scY=0.7;const tilt=-8;
          const planetSize=82;
          const cW=orbitR*2*scX+planetSize+50;const cH=orbitR*2*scY+planetSize+70;
          const orbitDuration=60;
          return <div style={{position:'relative',width:cW,height:cH,margin:'0 auto'}}>
            {/* Center: rocket (clickable start) */}
            <button onClick={startGame} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:2,
              background:'none',border:'none',cursor:'pointer',padding:0,
              display:'flex',flexDirection:'column',alignItems:'center',gap:0,fontFamily:"'Fredoka'",
            }}>
              <span style={{fontSize:72,filter:'drop-shadow(0 4px 12px rgba(0,0,0,.5))',animation:'planetFloat 3s ease-in-out infinite',display:'block'}}>🚀</span>
            </button>
            {/* Orbiting ring (visual — elliptical tilted via SVG) */}
            <svg style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',overflow:'visible'}}>
              <ellipse cx={cW/2} cy={cH/2} rx={orbitR*scX} ry={orbitR*scY} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="1" strokeDasharray="6 4" transform={`rotate(${tilt},${cW/2},${cH/2})`}/>
            </svg>
            {/* Ellipse deformation wrapper (static — no animation here) */}
            <div style={{position:'absolute',top:'50%',left:'50%',
              width:orbitR*2,height:orbitR*2,
              marginLeft:-orbitR,marginTop:-orbitR,
              transform:`rotate(${tilt}deg) scaleX(${scX}) scaleY(${scY})`}}>
              {/* Rotation wrapper (animated — simple spin) */}
              <div style={{width:'100%',height:'100%',animation:`orbitAll ${orbitDuration}s linear infinite`}}>
                {allGroups.map((g,i)=>{
                  const pc=PLANET_COLORS[g.id]||[g.color+'88',g.color,g.color];
                  const hasActive=g.modules.some(m=>activeMods[m.lvKey]!==false);
                  const angle=(360/n)*i - 90;
                  const rad=angle*Math.PI/180;
                  const cx=orbitR+orbitR*Math.cos(rad)-planetSize/2;
                  const cy=orbitR+orbitR*Math.sin(rad)-planetSize/2;
                  return <button key={g.id} disabled={!hasActive} onClick={()=>{if(!hasActive)return;setOpenGroup(g.id);const firstMod=g.modules.find(m=>activeMods[m.lvKey]!==false);if(firstMod){setSec(firstMod.k);setSecLv(getModuleLv(firstMod.lvKey)||firstMod.defLv)}}} style={{
                    position:'absolute',left:cx,top:cy,width:planetSize,height:planetSize+22,
                    padding:0,border:'none',background:'none',cursor:hasActive?'pointer':'default',fontFamily:"'Fredoka'",color:TXT,
                    display:'flex',flexDirection:'column',alignItems:'center',gap:2,
                    animation:`counterSpin ${orbitDuration}s linear infinite`,
                    opacity:hasActive?1:0.35,filter:hasActive?'none':'grayscale(1) brightness(0.6)',
                  }}>
                    {/* Counter-deformation wrapper (static — undoes parent scale+tilt) */}
                    <div style={{transform:`scaleX(${(1/scX).toFixed(4)}) scaleY(${(1/scY).toFixed(4)}) rotate(${-tilt}deg)`,
                      display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                      <div style={{
                        width:planetSize,height:planetSize,borderRadius:'50%',
                        background:hasActive
                          ?`radial-gradient(circle at 30% 25%,${pc[0]},${pc[1]} 60%,${pc[2]})`
                          :`radial-gradient(circle at 30% 25%,#888,#555 60%,#333)`,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        boxShadow:hasActive?`0 4px 20px ${pc[1]}44, inset 0 -4px 12px ${pc[2]}66, inset 0 4px 8px ${pc[0]}88`:'0 2px 8px rgba(0,0,0,.3)',
                      }}>
                        <span style={{fontSize:42,filter:'drop-shadow(0 2px 4px rgba(0,0,0,.3))'}}>{g.emoji}</span>
                      </div>
                      <div style={{fontSize:13,fontWeight:600,textShadow:'0 1px 4px rgba(0,0,0,.5)',lineHeight:1.1,textAlign:'center',whiteSpace:'nowrap'}}>{g.name}</div>
                    </div>
                  </button>})}
              </div>
            </div>
          </div>})()}
        {/* When a group IS open: expanded view with central planet + orbiting sub-planets */}
        {openG&&<div className="af" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>
          {/* Mini planets row (the other groups) */}
          <div style={{display:'flex',justifyContent:'center',gap:10,marginBottom:16,flexWrap:'wrap'}}>
            {otherGroups.map(g=>{
              const pc=PLANET_COLORS[g.id]||[g.color+'88',g.color,g.color];
              return <button key={g.id} onClick={()=>{setOpenGroup(g.id);const firstMod=g.modules.find(m=>activeMods[m.lvKey]!==false);if(firstMod){setSec(firstMod.k);setSecLv(getModuleLv(firstMod.lvKey)||firstMod.defLv)}}} style={{
                width:48,height:48,borderRadius:'50%',border:'none',cursor:'pointer',
                background:`radial-gradient(circle at 30% 25%,${pc[0]},${pc[1]} 60%,${pc[2]})`,
                boxShadow:`0 2px 8px ${pc[1]}44`,
                display:'flex',alignItems:'center',justifyContent:'center',
                transition:'all .3s',fontFamily:"'Fredoka'",
              }} title={g.name}>
                <span style={{fontSize:22}}>{g.emoji}</span>
              </button>})}
          </div>
          {/* Central planet (the open group) */}
          {(()=>{
            const pc=PLANET_COLORS[openG.id]||[openG.color+'88',openG.color,openG.color];
            const enabledMods=openG.modules.filter(m=>activeMods[m.lvKey]!==false);
            const modCount=enabledMods.length;
            return <div style={{position:'relative',width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
              {/* Back button */}
              <button onClick={()=>setOpenGroup(null)} style={{
                position:'absolute',top:0,left:0,background:'none',border:'none',color:DIM,
                fontSize:18,cursor:'pointer',fontFamily:"'Fredoka'",zIndex:2,padding:'4px 8px',
              }}>← Volver</button>
              {/* Central planet */}
              <div style={{
                width:120,height:120,borderRadius:'50%',
                background:`radial-gradient(circle at 30% 25%,${pc[0]},${pc[1]} 60%,${pc[2]})`,
                display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                boxShadow:`0 0 30px ${pc[1]}55, inset 0 -6px 16px ${pc[2]}88, inset 0 6px 12px ${pc[0]}99`,
                margin:'8px 0 6px',
                animation:'planetFloat 4s ease-in-out infinite',
              }}>
                <span style={{fontSize:48,filter:'drop-shadow(0 2px 4px rgba(0,0,0,.3))'}}>{openG.emoji}</span>
              </div>
              <div style={{fontSize:20,fontWeight:700,color:pc[1],margin:'4px 0 16px',textShadow:`0 0 12px ${pc[1]}44`}}>{openG.name}</div>
              {/* Sub-planets (modules) arranged in a row/grid */}
              <div style={{
                display:'flex',flexWrap:'wrap',justifyContent:'center',gap:14,
                width:'100%',maxWidth:500,
              }}>
                {enabledMods.map((m,mi)=>{
                  const mLv=getModuleLv(m.lvKey)||m.defLv;
                  const isActive=sec===m.k&&secLv===mLv;
                  const subSize=modCount<=3?100:modCount<=5?88:76;
                  return <button key={mi} onClick={()=>{setSec(m.k);setSecLv(mLv)}} style={{
                    width:subSize,display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                    padding:8,border:'none',background:'none',cursor:'pointer',fontFamily:"'Fredoka'",
                    transition:'all .25s',transform:isActive?'scale(1.08)':'scale(1)',
                  }}>
                    <div style={{
                      width:subSize-16,height:subSize-16,borderRadius:'50%',
                      background:isActive
                        ?`radial-gradient(circle at 30% 25%,${pc[0]},${pc[1]} 70%,${pc[2]})`
                        :`radial-gradient(circle at 30% 25%,${pc[0]}66,${pc[1]}44 70%,${pc[2]}33)`,
                      border:isActive?`3px solid ${pc[0]}`:`2px solid ${pc[1]}33`,
                      boxShadow:isActive?`0 0 16px ${pc[1]}66, inset 0 -3px 8px ${pc[2]}55`:`0 2px 6px rgba(0,0,0,.2)`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      transition:'all .25s',
                    }}>
                      <span style={{fontSize:isActive?30:26,filter:isActive?'':'brightness(0.7) saturate(0.5)',transition:'all .25s'}}>
                        {m.k==='decir'?'🎤':m.k==='frase'?'🧱':m.k==='contar'?'🔢':m.k==='math'?'➕':m.k==='multi'?'✖️':m.k==='frac'?'🍕':m.k==='money'?'💶':m.k==='clock'?'🕐':m.k==='calendar'?'📅':m.k==='distribute'?'🍬':m.k==='writing'?'✏️':m.k==='razona'?'🧩':m.k==='lee'?'📖':m.k==='quiensoy'?'👤':'⭐'}
                      </span>
                    </div>
                    <div style={{fontSize:12,fontWeight:600,color:isActive?TXT:DIM,textAlign:'center',lineHeight:1.15,transition:'color .25s'}}>{m.l}</div>
                  </button>})}
              </div>
            </div>})()}
        </div>}
      </div>})()
      :<div className="card" style={{padding:24,textAlign:'center',borderColor:GOLD+'55',background:GOLD+'0C'}}>
        <div style={{fontSize:56,marginBottom:8}}>{{quiensoy:'👤',decir:'🎤',frase:'🧱',contar:'🔢',math:'🧮',multi:'✖️',frac:'🍕',money:'💶',clock:'🕐',calendar:'📅',distribute:'🍬',writing:'✏️',razona:'🧠',lee:'📖'}[sec]||'🎤'}</div>
        <h3 style={{fontSize:22,fontWeight:700,margin:'0 0 8px',color:GOLD}}>{{quiensoy:'Quién Soy',decir:'Aprende a decirlo',frase:'Forma la frase',contar:'Cuenta conmigo',math:'Sumas y Restas',multi:'Multiplicaciones',frac:'Fracciones',money:'Monedas y Billetes',clock:'La Hora',calendar:'Calendario',distribute:'Reparte y Cuenta',writing:'Escritura',razona:'Razona',lee:'Lectura'}[sec]||sec}</h3>
      </div>}
      {/* Rocket button only when a group is open and module selected */}
      {openGroup&&<div style={{display:'flex',justifyContent:'center',marginTop:10}}>
        <button onClick={startGame} style={{
          width:80,height:80,borderRadius:'50%',border:'none',cursor:'pointer',
          background:'none',padding:0,fontFamily:"'Fredoka'",
          animation:'planetFloat 3s ease-in-out infinite',transition:'transform .15s',
        }}>
          <span style={{fontSize:52,display:'block',filter:'drop-shadow(0 3px 8px rgba(0,0,0,.4))'}}>🚀</span>
        </button>
      </div>}
    </div>}

    {scr==='game'&&cur&&<div className="af" onClick={pokeActive} onTouchStart={pokeActive}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><button style={{background:'none',border:'none',color:DIM,fontSize:16}} onClick={tryExit}>✕ Salir</button><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{position:'relative',width:36,height:36}}><SpaceMascot mood={mascotMood} size={36}/></div><span style={{fontSize:14,color:DIM,fontWeight:600}}>⏱️ {elapsed}' / {sm===0?'∞':sm+"'"}</span></div></div>
      <div className="pbar" style={{marginBottom:10}}><div className="pfill" style={{width:sm===0?'0%':Math.min(100,elapsed/sm*100)+'%'}}/></div>
      <Tower placed={st.ok} total={st.ok+st.sk+Math.max(1,queue.length-idx)}/>
      <div style={{marginTop:10}}>
        {cur.ty==='frases'&&<ExFrases ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='frases_blank'&&<ExFrasesBlank ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='sit'&&<ExSit ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='flu'&&<ExFlu ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='count'&&<ExCount num={cur.num} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='math'&&<ExMath ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='multi'&&<ExMulti ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='frac'&&<ExFraction ex={cur} onOk={onOk} onSkip={onSk} name={user.name}/>}
        {cur.ty==='money'&&<ExMoney ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='clock'&&<ExClock ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='calendar'&&<ExCalendar ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='distribute'&&<ExDistribute ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='writing'&&<ExWriting ex={cur} onOk={onOk} onSkip={onSk} name={user.name}/>}
        {cur.ty==='razona'&&<ExRazona ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='lee'&&<ExLee ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='quiensoy'&&secLv===1&&<ExQuienSoyEstudio ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='quiensoy'&&secLv===2&&<ExQuienSoyPres onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
      </div></div>}
  </div>}
