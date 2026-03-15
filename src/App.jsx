// ============================================================
// TOKI · Aprende a decirlo  
// © 2026 Diego Aroca. Todos los derechos reservados.
// ============================================================
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AREAS, EX } from './exercises.js'

const BG='#0B1D3A',BG2='#122548',BG3='#1A3060',GOLD='#F0C850',GREEN='#2ECC71',RED='#E74C3C',BLUE='#3498DB',PURPLE='#9B59B6',TXT='#ECF0F1',DIM='#7F8FA6',CARD='#152D55',BORDER='#1E3A6A';
const CSS=`
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;font-family:'Fredoka',sans-serif;background:${BG};color:${TXT};min-height:100vh;min-height:100dvh}
button{font-family:'Fredoka',sans-serif;touch-action:manipulation;cursor:pointer}
input{font-family:'Fredoka',sans-serif}
input::placeholder{color:${DIM}}
#root{max-width:600px;margin:0 auto;padding:16px 20px}
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
function lev(a,b){const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}
function score(said,tgt){const c=s=>s.toLowerCase().replace(/[^a-záéíóúñü\s]/g,'').trim();const a=c(said),b=c(tgt);if(a===b)return 3;const sw=a.split(/\s+/),tw=b.split(/\s+/);let mt=0;tw.forEach(t=>{if(sw.some(s=>s===t||lev(s,t)<=1))mt++});const r=mt/tw.length;return r>=.8?3:r>=.55?2:r>=.3?1:0}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}
let voiceProfile={age:12,sex:'m'},cachedVoice=null;
function setVoiceProfile(a,s){voiceProfile={age:a||12,sex:s||'m'};cachedVoice=null;pickVoice()}
function getVP(){const a=voiceProfile.age,s=voiceProfile.sex;if(a<=9)return{rate:.6,pitch:s==='f'?1.35:1.2};if(a<=13)return{rate:.65,pitch:s==='f'?1.15:.92};if(a<=17)return{rate:.7,pitch:s==='f'?1.05:.82};return{rate:.75,pitch:s==='f'?1.0:.78}}
function pickVoice(){const v=window.speechSynthesis?window.speechSynthesis.getVoices():[];const es=v.filter(x=>x.lang&&x.lang.startsWith('es'));if(!es.length)return;const f=/elena|conchita|lucia|miren|monica|paulina|female|femenin|mujer|helena/i,m=/jorge|enrique|pablo|andres|diego|male|masculin|hombre/i;cachedVoice=voiceProfile.sex==='f'?es.find(x=>f.test(x.name))||es[0]:es.find(x=>m.test(x.name))||es[0]}
if(window.speechSynthesis){window.speechSynthesis.onvoiceschanged=pickVoice;setTimeout(pickVoice,100);setTimeout(pickVoice,500);setTimeout(pickVoice,1500)}
function say(text){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const p=getVP(),u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=p.rate;u.pitch=p.pitch;if(cachedVoice)u.voice=cachedVoice;let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u);setTimeout(finish,Math.max(3000,text.length*250))})}
function sayFB(text){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const p=getVP();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=Math.min(1.0,p.rate+0.15);u.pitch=voiceProfile.sex==='m'?Math.min(1.5,p.pitch+0.4):Math.max(0.6,p.pitch-0.3);const voices=window.speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.startsWith('es'));u.voice=voices.find(v=>v!==cachedVoice)||cachedVoice;let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u);setTimeout(finish,Math.max(2500,text.length*200))})}
function stopVoice(){if(window.speechSynthesis)window.speechSynthesis.cancel()}
function playRec(userId,voiceIds,key){return new Promise(res=>{if(!voiceIds||!voiceIds.length){res(false);return}for(const vid of voiceIds){try{const d=JSON.parse(localStorage.getItem('toki_voice_'+userId+'_'+vid));if(d&&d[key]){const a=new Audio(d[key]);a.onended=()=>res(true);a.onerror=()=>res(false);a.play().catch(()=>res(false));return}}catch(e){}}res(false)})}
let gRec=null,gRecOk=false;(function(){const S=window.SpeechRecognition||window.webkitSpeechRecognition;if(!S)return;gRec=new S();gRec.lang='es-ES';gRec.continuous=false;gRec.interimResults=false;gRec.maxAlternatives=5;gRecOk=true})();
function useSR(){const[on,sOn]=useState(false);const[res,sRes]=useState('');useEffect(()=>{if(!gRec)return;gRec.onresult=e=>{const a=[];for(let i=0;i<e.results[0].length;i++)a.push(e.results[0][i].transcript.toLowerCase().trim());sRes(a.join('|'));sOn(false)};gRec.onerror=()=>sOn(false);gRec.onend=()=>sOn(false)});const go=useCallback(()=>{if(!gRec)return;sRes('');sOn(true);try{gRec.stop()}catch(e){}setTimeout(()=>{try{gRec.start()}catch(e){sOn(false)}},150)},[]);return{on,res,ok:gRecOk,go}}
function saveData(key,val){try{localStorage.setItem('toki_'+key,JSON.stringify(val))}catch(e){}}
function loadData(key,def){try{const v=localStorage.getItem('toki_'+key);return v?JSON.parse(v):def}catch(e){return def}}
function srsUp(id,ok,u){const d={...u};if(!d.srs)d.srs={};if(!d.srs[id])d.srs[id]={lv:0,t:0};d.srs[id].t=Date.now();d.srs[id].lv=ok?Math.min(d.srs[id].lv+1,5):Math.max(d.srs[id].lv-1,0);return d}
function needsRev(id,u){const s=u.srs&&u.srs[id];if(!s)return true;const g=[0,30000,120000,600000,3600000,86400000];return(Date.now()-s.t)>=g[Math.min(s.lv,5)]}
const SKINS=['#FDDBB4','#F5C99E','#D4A574','#C28B5E','#8D5524','#6B3E26'];
const HAIRS=['#2C1B0E','#5A3214','#8B6914','#D4A017','#C0392B','#E67E22','#8E44AD','#2980B9','#1ABC9C','#ECF0F1'];
const HAIR_STYLES=['none','short','spiky','long','curly','mohawk','ponytail','bob'];
const ACCS=['none','gafas','gafas_sol','gorro','corona','vikingo','cinta','auriculares','lazo','estrella'];
const ACC_LABELS=['Nada','Gafas','Gafas sol','Gorro','Corona','Vikingo','Cinta','Auriculares','Lazo','Estrella'];
const DEF_AV={skin:0,hair:0,hairStyle:1,acc:0};
function Avatar({av,sz=56}){const d=typeof av==='object'&&av?av:DEF_AV;const sk=SKINS[d.skin]||SKINS[0];const hc=HAIRS[d.hair]||HAIRS[0];const hs=HAIR_STYLES[d.hairStyle]||'short';const ac=ACCS[d.acc]||'none';const r=sz/2,cx=sz/2,cy=sz/2;
  return <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{display:'block'}}>
    <circle cx={cx} cy={cy} r={r-1} fill={sk} stroke={BG3} strokeWidth={2}/>
    {hs==='short'&&<path d={`M${cx-r*.6},${cy-r*.15} Q${cx},${cy-r*.95} ${cx+r*.6},${cy-r*.15}`} fill={hc}/>}
    {hs==='spiky'&&<>{[-.5,-.25,0,.25,.5].map((o,i)=><polygon key={i} points={`${cx+o*r*.8},${cy-r*.9} ${cx+o*r*.8-r*.12},${cy-r*.15} ${cx+o*r*.8+r*.12},${cy-r*.15}`} fill={hc}/>)}</>}
    {hs==='long'&&<><path d={`M${cx-r*.7},${cy-r*.1} Q${cx},${cy-r} ${cx+r*.7},${cy-r*.1}`} fill={hc}/><rect x={cx-r*.7} y={cy-r*.1} width={r*.25} height={r*.7} rx={4} fill={hc}/><rect x={cx+r*.45} y={cy-r*.1} width={r*.25} height={r*.7} rx={4} fill={hc}/></>}
    {hs==='curly'&&<>{[-0.4,-0.15,0.1,0.35].map((o,i)=><circle key={i} cx={cx+o*r} cy={cy-r*.45} r={r*.22} fill={hc}/>)}</>}
    {hs==='mohawk'&&<rect x={cx-r*.1} y={cy-r*.95} width={r*.2} height={r*.55} rx={3} fill={hc}/>}
    {hs==='ponytail'&&<><path d={`M${cx-r*.6},${cy-r*.15} Q${cx},${cy-r*.95} ${cx+r*.6},${cy-r*.15}`} fill={hc}/><rect x={cx+r*.35} y={cy-r*.1} width={r*.15} height={r*.55} rx={3} fill={hc}/></>}
    {hs==='bob'&&<><path d={`M${cx-r*.65},${cy+r*.1} Q${cx},${cy-r} ${cx+r*.65},${cy+r*.1}`} fill={hc}/></>}
    <circle cx={cx-r*.25} cy={cy+r*.05} r={r*.09} fill="#2C1B0E"/><circle cx={cx+r*.25} cy={cy+r*.05} r={r*.09} fill="#2C1B0E"/>
    <ellipse cx={cx} cy={cy+r*.32} rx={r*.15} ry={r*.06} fill="#D35400" opacity={.6}/>
    <path d={`M${cx-r*.15},${cy+r*.5} Q${cx},${cy+r*.62} ${cx+r*.15},${cy+r*.5}`} fill="none" stroke="#2C1B0E" strokeWidth={1.5} strokeLinecap="round"/>
    {ac==='gafas'&&<><circle cx={cx-r*.25} cy={cy+r*.05} r={r*.16} fill="none" stroke="#2C3E50" strokeWidth={2}/><circle cx={cx+r*.25} cy={cy+r*.05} r={r*.16} fill="none" stroke="#2C3E50" strokeWidth={2}/><line x1={cx-r*.09} y1={cy+r*.05} x2={cx+r*.09} y2={cy+r*.05} stroke="#2C3E50" strokeWidth={2}/></>}
    {ac==='gafas_sol'&&<><rect x={cx-r*.42} y={cy-r*.08} width={r*.32} height={r*.22} rx={3} fill="#2C3E50"/><rect x={cx+r*.1} y={cy-r*.08} width={r*.32} height={r*.22} rx={3} fill="#2C3E50"/><line x1={cx-r*.1} y1={cy+r*.03} x2={cx+r*.1} y2={cy+r*.03} stroke="#2C3E50" strokeWidth={2}/></>}
    {ac==='gorro'&&<><path d={`M${cx-r*.6},${cy-r*.2} Q${cx},${cy-r*1.1} ${cx+r*.6},${cy-r*.2}`} fill={BLUE}/><rect x={cx-r*.7} y={cy-r*.25} width={r*1.4} height={r*.12} rx={3} fill={BLUE} stroke="#1a5276" strokeWidth={1}/><circle cx={cx} cy={cy-r*.95} r={r*.08} fill="white"/></>}
    {ac==='corona'&&<polygon points={`${cx-r*.35},${cy-r*.35} ${cx-r*.2},${cy-r*.7} ${cx},${cy-r*.45} ${cx+r*.2},${cy-r*.7} ${cx+r*.35},${cy-r*.35}`} fill={GOLD} stroke="#d4ac0d" strokeWidth={1}/>}
    {ac==='vikingo'&&<><path d={`M${cx-r*.55},${cy-r*.15} Q${cx-r*.7},${cy-r*.7} ${cx-r*.3},${cy-r*.55}`} fill="none" stroke="#7f8c8d" strokeWidth={3} strokeLinecap="round"/><path d={`M${cx+r*.55},${cy-r*.15} Q${cx+r*.7},${cy-r*.7} ${cx+r*.3},${cy-r*.55}`} fill="none" stroke="#7f8c8d" strokeWidth={3} strokeLinecap="round"/></>}
    {ac==='cinta'&&<rect x={cx-r*.55} y={cy-r*.3} width={r*1.1} height={r*.12} rx={2} fill={RED}/>}
    {ac==='auriculares'&&<><path d={`M${cx-r*.55},${cy+r*.1} Q${cx-r*.6},${cy-r*.6} ${cx},${cy-r*.55} Q${cx+r*.6},${cy-r*.6} ${cx+r*.55},${cy+r*.1}`} fill="none" stroke="#2C3E50" strokeWidth={2.5}/><rect x={cx-r*.65} y={cy-r*.05} width={r*.18} height={r*.25} rx={4} fill="#2C3E50"/><rect x={cx+r*.47} y={cy-r*.05} width={r*.18} height={r*.25} rx={4} fill="#2C3E50"/></>}
    {ac==='lazo'&&<><polygon points={`${cx+r*.15},${cy-r*.45} ${cx+r*.45},${cy-r*.6} ${cx+r*.15},${cy-r*.3}`} fill="#E91E63"/><polygon points={`${cx+r*.15},${cy-r*.45} ${cx+r*.45},${cy-r*.3} ${cx+r*.15},${cy-r*.6}`} fill="#C2185B"/><circle cx={cx+r*.15} cy={cy-r*.45} r={r*.06} fill="#AD1457"/></>}
    {ac==='estrella'&&<polygon points={`${cx+r*.3},${cy-r*.75} ${cx+r*.36},${cy-r*.55} ${cx+r*.55},${cy-r*.55} ${cx+r*.4},${cy-r*.4} ${cx+r*.47},${cy-r*.2} ${cx+r*.3},${cy-r*.35} ${cx+r*.13},${cy-r*.2} ${cx+r*.2},${cy-r*.4} ${cx+r*.05},${cy-r*.55} ${cx+r*.24},${cy-r*.55}`} fill={GOLD}/>}
  </svg>}
function AvatarEditor({value,onChange,sz=80}){const d=typeof value==='object'&&value?value:{...DEF_AV};
  const set=(k,v)=>onChange({...d,[k]:v});
  return <div style={{display:'flex',flexDirection:'column',gap:12,alignItems:'center'}}>
    <Avatar av={d} sz={sz}/>
    <div><p style={{fontSize:13,color:DIM,margin:'0 0 4px'}}>Piel</p><div style={{display:'flex',gap:6,justifyContent:'center'}}>{SKINS.map((c,i)=><button key={i} onClick={()=>set('skin',i)} style={{width:30,height:30,borderRadius:'50%',background:c,border:`3px solid ${d.skin===i?GOLD:'transparent'}`,cursor:'pointer'}}/>)}</div></div>
    <div><p style={{fontSize:13,color:DIM,margin:'0 0 4px'}}>Pelo</p><div style={{display:'flex',gap:4,flexWrap:'wrap',justifyContent:'center'}}>{HAIR_STYLES.map((h,i)=><button key={i} onClick={()=>set('hairStyle',i)} style={{padding:'6px 10px',borderRadius:8,border:`2px solid ${d.hairStyle===i?GOLD:BORDER}`,background:d.hairStyle===i?GOLD+'22':BG3,color:d.hairStyle===i?GOLD:DIM,fontSize:12,fontFamily:"'Fredoka'",cursor:'pointer'}}>{h==='none'?'Sin pelo':h==='short'?'Corto':h==='spiky'?'Puntas':h==='long'?'Largo':h==='curly'?'Rizado':h==='mohawk'?'Cresta':h==='ponytail'?'Coleta':'Melena'}</button>)}</div></div>
    <div><p style={{fontSize:13,color:DIM,margin:'0 0 4px'}}>Color pelo</p><div style={{display:'flex',gap:6,justifyContent:'center',flexWrap:'wrap'}}>{HAIRS.map((c,i)=><button key={i} onClick={()=>set('hair',i)} style={{width:26,height:26,borderRadius:'50%',background:c,border:`3px solid ${d.hair===i?GOLD:'transparent'}`,cursor:'pointer'}}/>)}</div></div>
    <div><p style={{fontSize:13,color:DIM,margin:'0 0 4px'}}>Accesorio</p><div style={{display:'flex',gap:4,flexWrap:'wrap',justifyContent:'center'}}>{ACCS.map((a,i)=><button key={i} onClick={()=>set('acc',i)} style={{padding:'6px 10px',borderRadius:8,border:`2px solid ${d.acc===i?GOLD:BORDER}`,background:d.acc===i?GOLD+'22':BG3,color:d.acc===i?GOLD:DIM,fontSize:12,fontFamily:"'Fredoka'",cursor:'pointer'}}>{ACC_LABELS[i]}</button>)}</div></div>
  </div>}
const CLS=[GREEN,BLUE,GOLD,PURPLE,RED,'#E67E22',GREEN];const tdy=()=>new Date().toLocaleDateString('es-ES');const rnd=a=>a[Math.floor(Math.random()*a.length)];
const BUILD_OK=['¡Sí señor!','¡Eso es!','¡Bien hecho!','¡Perfecto!','¡Así se hace!','¡Genial!','¡Correcto!','¡Exacto!'];
const PERFECT_M=['¡Muy bien campeón!','¡Espectacular campeón!','¡Increíble campeón!','¡Bravo campeón!','¡Genial campeón!','¡Fantástico campeón!'];
const PERFECT_F=['¡Muy bien campeona!','¡Espectacular campeona!','¡Increíble campeona!','¡Bravo campeona!','¡Genial campeona!','¡Fantástica campeona!'];
const GOOD_MSG=['¡Bien hecho!','¡Genial!','¡Muy bien!','¡Así se habla!','¡Fenomenal!','¡Estupendo!','¡Sigue así!','¡Vas muy bien!'];
const RETRY_MSG=['Inténtalo otra vez','Escucha bien y repite','Otra vez, tú puedes','Venga, una más','Casi casi'];
const FAIL_MSG=['Poco a poco lo conseguirás','No te rindas, otro día te saldrá','Ánimo, vas mejorando','Tranquilo, la próxima vez seguro','No pasa nada, seguimos'];
const SMINS=[15,25,44];
function beep(f,d){try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;g.gain.value=0.15;o.start();o.stop(c.currentTime+d/1000);setTimeout(()=>c.close(),d+100)}catch(e){}}
function Confetti({show}){const[pts,sP]=useState([]);useEffect(()=>{if(show){sP(Array.from({length:24},(_,i)=>({i,x:Math.random()*100,c:CLS[i%7],s:6+Math.random()*10,d:Math.random()*.5,du:.8+Math.random()*.8})));setTimeout(()=>sP([]),2800)}},[show]);if(!pts.length)return null;return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:999}}>{pts.map(p=><div key={p.i} style={{position:'absolute',left:p.x+'%',top:'-5%',width:p.s,height:p.s,background:p.c,borderRadius:3,animation:`confDrop ${p.du}s ease-in ${p.d}s forwards`}}/>)}</div>}
function Ring({p,sz=80,sw=6,c=GREEN}){const r=(sz-sw)/2,ci=2*Math.PI*r;return <svg width={sz} height={sz} style={{transform:'rotate(-90deg)'}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={BG3} strokeWidth={sw}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={ci-(p||0)*ci} strokeLinecap="round" style={{transition:'stroke-dashoffset .6s'}}/></svg>}
function Tower({placed,total}){const cells=21,filled=Math.min(Math.floor((placed/Math.max(total,1))*cells),cells);return <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,maxWidth:220,margin:'0 auto'}}>{Array.from({length:cells},(_,i)=>{const row=Math.floor(i/7),inv=(2-row)*7+(i%7),on=inv<filled;return <div key={i} style={{aspectRatio:'1',borderRadius:4,transition:'all .3s cubic-bezier(.34,1.56,.64,1)',background:on?CLS[inv%7]:BG3+'44',border:on?'2px solid rgba(0,0,0,.2)':'2px solid '+BG3,transform:on?'scale(1)':'scale(.75)',opacity:on?1:.3}}/>})}</div>}
function RecBtn({dur,onEnd,on}){const[pct,sP]=useState(100);const t=useRef(null);const s=useRef(0);useEffect(()=>{if(!on){sP(100);return}s.current=Date.now();const ms=dur*1000;t.current=setInterval(()=>{const e=Date.now()-s.current;const r=Math.max(0,100-e/ms*100);sP(r);if(r<=25&&r>20)beep(800,80);if(r<=15&&r>10)beep(800,80);if(r<=0){clearInterval(t.current);beep(1200,300);setTimeout(onEnd,1200)}},50);return()=>clearInterval(t.current)},[on,dur]);if(!on)return null;return <div style={{position:'relative',width:80,height:80,margin:'16px auto'}}><div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',borderRadius:'50%',background:RED+'33',overflow:'hidden'}}><div style={{position:'absolute',bottom:0,left:0,width:'100%',background:RED,transition:'height .05s linear',height:pct+'%'}}/></div><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:36}}>🎤</div></div>}
function useIdle(name,active){const[msg,sMsg]=useState('');const step=useRef(0);const timer=useRef(null);useEffect(()=>{step.current=0;sMsg('');clearInterval(timer.current);if(!active)return;timer.current=setInterval(()=>{const s=step.current;if(s===0)sMsg('¿Estás ahí? 👀');else if(s===1){const n=name||'Hola';sMsg(n+'?? 👋');say(n+'?')}else if(s===2)sMsg('¿Hola? ¿Hay alguien? 🤔');else if(s>=3){sMsg('Me aburro... 😢 ¡Juega conmigo!');say('juega conmigo')}step.current=s+1},6000);return()=>clearInterval(timer.current)},[active,name]);function poke(){step.current=0;sMsg('');if(timer.current){clearInterval(timer.current);timer.current=null}}return{idleMsg:msg,poke}}

// ===== SPEAK PANEL — phrase only, red button countdown =====
function SpeakPanel({text,exId,onOk,onSkip,sex,name,uid,vids}){
  const[sf,sSf]=useState(null);const[att,sAtt]=useState(0);const[msg,sMsg]=useState('');const[mic,setMic]=useState(false);
  const sr=useSR();const alive=useRef(true);const{idleMsg,poke}=useIdle(name,!sf&&!mic);
  const dur=useMemo(()=>Math.max(4,Math.ceil(text.split(/\s+/).length*0.7)+3),[text]);
  async function doPlay(){if(!alive.current)return;stopVoice();sMsg('');setMic(false);
    const played=await playRec(uid,vids,'phrase_'+exId);if(!played)await say(text);
    if(!alive.current)return;await new Promise(r=>setTimeout(r,150));if(!alive.current)return;setMic(true);setTimeout(()=>{if(alive.current)sr.go()},50)}
  useEffect(()=>{alive.current=true;sSf(null);sAtt(0);sMsg('');setMic(false);const t=setTimeout(doPlay,800);return()=>{alive.current=false;clearTimeout(t);stopVoice()}},[text,exId]);
  function onTimeUp(){if(!alive.current)return;setMic(false);if(!sr.res){const na=att+1;sAtt(na);if(na>=2){const m=rnd(FAIL_MSG);sMsg(m+' 💪');sSf('fail');sayFB(m).then(()=>{if(alive.current)setTimeout(onSkip,600)})}else{const m=rnd(RETRY_MSG);sMsg(m);sSf('retry');sayFB(m).then(()=>{if(!alive.current)return;setTimeout(()=>{sSf(null);doPlay()},500)})}}}
  useEffect(()=>{if(!sr.res)return;poke();setMic(false);const b=Math.max(...sr.res.split('|').map(a=>score(a,text)));
    if(b>=3){const m=rnd(sex==='f'?PERFECT_F:PERFECT_M);sMsg(m+' 🌟');sSf('perfect');sayFB(m).then(()=>{if(alive.current)setTimeout(onOk,400)})}
    else if(b>=2){const m=rnd(GOOD_MSG);sMsg(m+' ⭐');sSf('ok');sayFB(m).then(()=>{if(alive.current)setTimeout(onOk,400)})}
    else{const na=att+1;sAtt(na);if(na>=2){const m=rnd(FAIL_MSG);sMsg(m+' 💪');sSf('fail');sayFB(m).then(()=>{if(alive.current)setTimeout(onSkip,600)})}
    else{const m=rnd(RETRY_MSG);sMsg(m);sSf('retry');sayFB(m).then(()=>{if(!alive.current)return;setTimeout(()=>{sSf(null);doPlay()},500)})}}},[sr.res]);
  function hearAgain(){poke();stopVoice();sSf(null);setMic(false);doPlay()}
  const fc=sf==='perfect'?GOLD:sf==='ok'?GREEN:sf==='fail'?'#E67E22':RED;
  return <div style={{textAlign:'center'}} onClick={poke}>
    <div className="card" style={{padding:24,marginBottom:18,background:GREEN+'0C',borderColor:GREEN+'33'}}><p style={{fontSize:28,fontWeight:700,margin:0,lineHeight:1.3}}>"{text}"</p></div>
    {msg&&<div className={sf==='perfect'||sf==='ok'?'ab':sf==='retry'?'as':'af'} style={{background:fc+'22',borderRadius:14,padding:18,marginBottom:14}}><p style={{fontSize:22,fontWeight:700,margin:0,color:fc}}>{msg}</p></div>}
    {idleMsg&&!sf&&!msg&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:16,marginBottom:14}}><p style={{fontSize:20,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
    <RecBtn dur={dur} onEnd={onTimeUp} on={mic}/>
    <div style={{display:'flex',gap:10,marginTop:14}}><button className="btn btn-b btn-half" onClick={hearAgain}>🔊 Otra vez</button><button className="btn btn-ghost btn-half" onClick={()=>{poke();stopVoice();onSkip()}}>⏭️ Saltar</button></div>
  </div>}

function ExFlu({ex,onOk,onSkip,sex,name,uid,vids}){return <div style={{textAlign:'center',padding:18}}><div style={{fontSize:72,marginBottom:16,animation:'glow 3s infinite'}}>{ex.em}</div><SpeakPanel text={ex.ph} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/></div>}

function ExFrases({ex,onOk,onSkip,sex,name,uid,vids}){
  const[ph,sPh]=useState('build');const[pl,sPl]=useState([]);const[av,sAv]=useState([]);const[bf,sBf]=useState(null);
  const words=useMemo(()=>ex.fu.replace(/[¿?¡!,\.]/g,'').split(/\s+/),[ex.fu]);const{idleMsg,poke}=useIdle(name,ph==='build'&&!bf);
  useEffect(()=>{sPh('build');sBf(null);const d=['el','un','muy','y','más','eso'].filter(w=>!words.map(x=>x.toLowerCase()).includes(w));sAv([...words,...d.slice(0,2)].sort(()=>Math.random()-.5).map((w,i)=>({w,i,u:false})));sPl(Array(words.length).fill(null))},[ex]);
  function place(item){poke();const s=pl.findIndex(p=>p===null);if(s===-1)return;const np=[...pl];np[s]=item;sPl(np);sAv(a=>a.map(x=>x.i===item.i?{...x,u:true}:x));if(np.every(p=>p!==null)){const built=np.map(p=>p.w.toLowerCase()).join(' ');const target=words.map(w=>w.toLowerCase()).join(' ');if(built===target){sBf('ok');(async()=>{await sayFB(rnd(BUILD_OK));await new Promise(r=>setTimeout(r,400));await say(ex.fu);await new Promise(r=>setTimeout(r,400));sPh('speak')})()}else{sBf('no');setTimeout(()=>{sPl(Array(words.length).fill(null));sAv(a=>a.map(x=>({...x,u:false})));sBf(null)},1000)}}}
  function undo(){poke();let li=-1;pl.forEach((p,i)=>{if(p)li=i});if(li===-1)return;const it=pl[li];const np=[...pl];np[li]=null;sPl(np);sAv(a=>a.map(x=>x.i===it.i?{...x,u:false}:x))}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}><div style={{fontSize:72,marginBottom:16,animation:'glow 3s infinite'}}>{ex.em}</div>
    {ph==='build'&&<div className="af"><div className="card" style={{marginBottom:16,background:BLUE+'0C',borderColor:BLUE+'33'}}><p style={{fontSize:22,fontWeight:600,margin:0,lineHeight:1.4,color:BLUE}}>{ex.q}</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:16,minHeight:56}}>{pl.map((p,i)=><div key={i} className={'ws '+(p?'ws-f':'ws-e')}>{p?p.w:'___'}</div>)}</div>
      {bf==='ok'&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginBottom:14}}><span style={{fontSize:36}}>⭐</span></div>}
      {bf==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,color:GOLD,fontWeight:700,margin:0}}>¡Casi! 💪</p></div>}
      {idleMsg&&!bf&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
      {!bf&&<div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',marginBottom:14}}>{av.filter(x=>!x.u).map(x=><button key={x.i} className="btn btn-b btn-word" onClick={()=>place(x)}>{x.w}</button>)}</div>}
      <div style={{display:'flex',gap:10}}>{!bf&&pl.some(p=>p)&&<button className="btn btn-o btn-half" onClick={undo}>↩️ Borrar</button>}<button className="btn btn-p btn-half" onClick={()=>{poke();say(ex.fu)}}>🔊 Pista</button></div>
      <div style={{marginTop:14}}><button className="btn btn-ghost" onClick={()=>{poke();stopVoice();onSkip()}}>⏭️ Saltar</button></div></div>}
    {ph==='speak'&&<SpeakPanel text={ex.fu} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/>}
  </div>}

function ExSit({ex,onOk,onSkip,sex,name,uid,vids}){const[ph,sPh]=useState('choose');const[cf,sCf]=useState(null);const shuf=useMemo(()=>[...ex.op].sort(()=>Math.random()-.5),[ex]);const{idleMsg,poke}=useIdle(name,ph==='choose'&&!cf);useEffect(()=>{sPh('choose');sCf(null)},[ex]);function pick(o){poke();if(o===ex.op[0]){(async()=>{await sayFB(rnd(BUILD_OK));await new Promise(r=>setTimeout(r,400));await say(ex.su);await new Promise(r=>setTimeout(r,400));sPh('speak')})()}else{sCf('no');setTimeout(()=>sCf(null),1000)}}
  return <div style={{textAlign:'center',padding:18}} onClick={poke}><div style={{fontSize:72,marginBottom:16}}>{ex.em}</div><div className="card" style={{marginBottom:16,background:BLUE+'0C',borderColor:BLUE+'33'}}><p style={{fontSize:20,fontWeight:600,margin:0,lineHeight:1.4}}>{ex.si}</p></div>
    {ph==='choose'&&<div className="af"><p style={{fontSize:20,color:GOLD,fontWeight:700,margin:'0 0 14px'}}>¿Qué dirías?</p>{cf==='no'&&<div className="as" style={{background:RED+'22',borderRadius:12,padding:12,marginBottom:12}}><p style={{fontSize:17,color:GOLD,margin:0}}>Piensa... 🤔</p></div>}{idleMsg&&!cf&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:12}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}<div style={{display:'flex',flexDirection:'column',gap:12}}>{shuf.map((o,i)=><button key={i} className="btn btn-b" onClick={()=>pick(o)} style={{textAlign:'left',fontSize:18}}>{o}</button>)}</div><div style={{marginTop:14}}><button className="btn btn-ghost" onClick={()=>{poke();onSkip()}}>⏭️ Saltar</button></div></div>}
    {ph==='speak'&&<SpeakPanel text={ex.su} exId={ex.id} onOk={onOk} onSkip={onSkip} sex={sex} name={name} uid={uid} vids={vids}/>}
  </div>}

function VoiceRec({user,onBack,onSave}){const[mode,setMode]=useState('menu');const[recLv,setRecLv]=useState(1);const[selV,setSelV]=useState(null);const[vn,setVn]=useState('');const[va,setVa]=useState({...DEF_AV});const[vs,setVs]=useState('m');const[ri,setRi]=useState(0);const[rec,setRec]=useState(false);const[mr,setMr]=useState(null);const[saved,setSaved]=useState(0);const[pp,setPp]=useState(-1);const ch=useRef([]);const vid=useRef(null);const voices=user.voices||[];
  function init(ex){if(ex){setSelV(ex);vid.current=ex.id;setVn(ex.name);setVa(ex.avatar);setVs(ex.sex);setSaved(ex.saved||0)}else{const existing=voices.find(v=>v.name.toLowerCase()===vn.trim().toLowerCase());if(existing){setSelV(existing);vid.current=existing.id;setVa(existing.avatar);setVs(existing.sex);setSaved(existing.saved||0)}else{setSelV(null);vid.current=Date.now()+'';setSaved(0)}}}
  const cheerItems=useMemo(()=>[...(user.sex==='f'?PERFECT_F:PERFECT_M),...GOOD_MSG,...RETRY_MSG,...FAIL_MSG,...BUILD_OK],[user.sex]);
  const phraseItems=useMemo(()=>EX.filter(e=>e.lv===recLv).map(e=>({text:e.ph||e.fu||e.su,id:e.id})).filter(x=>x.text),[recLv]);
  const cheerItems2=useMemo(()=>[...(user.sex==='f'?PERFECT_F:PERFECT_M),...GOOD_MSG,...RETRY_MSG,...FAIL_MSG,...BUILD_OK].map((t,i)=>({text:t,id:'cheer_'+i})),[user.sex]);
  const items=mode==='cheers'?cheerItems2:phraseItems;const cur=items[ri]?.text||'';
  async function startR(){try{const s=await navigator.mediaDevices.getUserMedia({audio:{sampleRate:16000,channelCount:1,echoCancellation:true}});const m=new MediaRecorder(s,{mimeType:MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':'audio/webm',audioBitsPerSecond:32000});ch.current=[];m.ondataavailable=e=>{if(e.data.size>0)ch.current.push(e.data)};m.onstop=()=>{const b=new Blob(ch.current,{type:'audio/webm'});const r=new FileReader();r.onload=()=>{const item=items[ri];const k=mode==='cheers'?item.id:'phrase_'+item.id;const sk='voice_'+user.id+'_'+vid.current;const d=loadData(sk,{});d[k]=r.result;d.name=vn;d.avatar=va;d.sex=vs;saveData(sk,d);setSaved(sv=>sv+1);
        // Upload to GitHub in background
        const voiceName=vn.toLowerCase().replace(/[^a-z0-9]/g,'_');
        const fname=k+'.webm';
        const ghPath='public/audio/voices/'+voiceName+'/'+fname;
        const raw=r.result.split(',')[1];// strip data:audio/webm;base64,
        fetch('/api/upload-voice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:ghPath,content:raw,message:'Voz '+vn+': '+fname})}).catch(()=>{});
      };r.readAsDataURL(b);s.getTracks().forEach(t=>t.stop())};m.start();setMr(m);setRec(true)}catch(e){alert('No se puede acceder al micrófono')}}
  function stopR(){if(mr){mr.stop();setMr(null);setRec(false)}}
  function preview(i){const item=items[i];const k=mode==='cheers'?item.id:'phrase_'+item.id;try{const d=loadData('voice_'+user.id+'_'+vid.current,{});if(d[k]){setPp(i);const a=new Audio(d[k]);a.onended=()=>setPp(-1);a.play().catch(()=>setPp(-1))}}catch(e){}}
  function fin(){const v=vid.current;const ei=voices.findIndex(x=>x.id===v);let nv;if(ei>=0){nv=[...voices];nv[ei]={...voices[ei],saved}}else{nv=[...voices,{id:v,name:vn,avatar:va,sex:vs,saved}]}onSave({...user,voices:nv})}
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:BG,overflowY:'auto',zIndex:100,padding:16}}><div style={{maxWidth:600,margin:'0 auto'}}>
    {mode==='menu'&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><p style={{fontSize:22,color:GOLD,fontWeight:700,margin:0}}>🎙️ Voces</p><button className="btn btn-ghost btn-half" style={{width:'auto',padding:'8px 16px'}} onClick={onBack}>✕</button></div>
      {voices.length>0&&<div style={{marginBottom:20}}><p style={{fontSize:16,color:DIM,margin:'0 0 10px'}}>Toca para añadir grabaciones:</p>{voices.map((v,i)=><div key={i} style={{display:'flex',gap:6,marginBottom:8,alignItems:'center'}}><button className="card" style={{flex:1,display:'flex',alignItems:'center',gap:12,cursor:'pointer',border:`2px solid ${selV?.id===v.id?GOLD:BORDER}`}} onClick={()=>init(v)}><Avatar av={v.avatar} sz={36}/><div style={{flex:1,textAlign:'left'}}><div style={{fontWeight:700}}>{v.name}</div><div style={{fontSize:13,color:DIM}}>{v.saved} grabaciones</div></div><span style={{color:GOLD,fontSize:14}}>{selV?.id===v.id?'✓':'→'}</span></button><button style={{background:RED+'22',border:'2px solid '+RED+'44',borderRadius:12,padding:'8px 10px',color:RED,fontSize:16,cursor:'pointer',fontFamily:"'Fredoka'"}} onClick={()=>{try{localStorage.removeItem('toki_voice_'+user.id+'_'+v.id)}catch(e){}const nv=voices.filter(x=>x.id!==v.id);onSave({...user,voices:nv})}}>🗑️</button></div>)}</div>}
      {!selV&&<div><p style={{fontSize:16,color:DIM,margin:'0 0 12px'}}>Nueva voz:</p><input className="inp" value={vn} onChange={e=>setVn(e.target.value)} placeholder="Nombre: Papá, Jaime..." style={{marginBottom:12}}/><div style={{display:'flex',gap:10,marginBottom:12}}>{[['m','👦 Chico'],['f','👧 Chica']].map(([v,l])=><button key={v} onClick={()=>setVs(v)} style={{flex:1,padding:'12px 0',borderRadius:12,border:`3px solid ${vs===v?GOLD:BORDER}`,background:vs===v?GOLD+'22':BG3,color:vs===v?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:700,fontSize:16,cursor:'pointer'}}>{l}</button>)}</div><AvatarEditor value={va} onChange={setVa} sz={64}/></div>}
      <div style={{display:'flex',flexDirection:'column',gap:10}}><button className="btn btn-gold" disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRi(0);setMode('cheers')}}>🎤 Ánimos</button><div style={{display:'flex',gap:8}}>{[1,2,3,4,5].map(n=><button key={n} className="btn btn-b btn-half" style={{flex:1,fontSize:16}} disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRecLv(n);setRi(0);setMode('phrases')}}>N{n}</button>)}</div></div></div>}
    {(mode==='cheers'||mode==='phrases')&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><p style={{fontSize:18,color:GOLD,fontWeight:700,margin:0}}>{mode==='cheers'?'🎤 Ánimos':`🎤 N${recLv}`} — {vn}</p><span style={{fontSize:14,color:DIM}}>{ri+1}/{items.length}</span></div>
      <div className="pbar" style={{marginBottom:16}}><div className="pfill" style={{width:((ri+1)/items.length*100)+'%'}}/></div>
      <div className="card" style={{padding:24,marginBottom:16,textAlign:'center'}}><p style={{fontSize:13,color:DIM,margin:'0 0 8px'}}>Lee en voz alta:</p><p style={{fontSize:24,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>"{cur}"</p></div>
      <div style={{display:'flex',justifyContent:'center',gap:10,marginBottom:16}}><button className="btn btn-ghost btn-half" style={{width:'auto',padding:'8px 14px'}} onClick={()=>preview(ri)} disabled={pp>=0}>🔊 Escuchar</button><span style={{color:GREEN,fontWeight:700,alignSelf:'center'}}>{saved}</span></div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>{!rec?<button className="btn btn-g" onClick={startR} style={{fontSize:22}}>🔴 Grabar</button>:<button className="btn btn-o" onClick={stopR} style={{fontSize:22,animation:'pulse 1s infinite'}}>⬛ Parar</button>}
        <div style={{display:'flex',gap:10}}><button className="btn btn-ghost btn-half" disabled={ri===0} onClick={()=>{setRi(ri-1);setRec(false)}}>←</button><button className="btn btn-b btn-half" disabled={ri>=items.length-1} onClick={()=>{setRi(ri+1);setRec(false)}}>→</button></div>
        <div style={{display:'flex',gap:10,marginTop:10}}><button className="btn btn-ghost btn-half" onClick={()=>setMode('menu')}>← Menú</button><button className="btn btn-gold btn-half" onClick={fin}>✅ Guardar</button></div></div></div>}
  </div></div>}

function victoryBeeps(){try{const c=new(window.AudioContext||window.webkitAudioContext)();const notes=[523,659,784,1047];notes.forEach((f,i)=>{const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;g.gain.value=0.12;o.start(c.currentTime+i*0.15);o.stop(c.currentTime+i*0.15+0.2)});setTimeout(()=>c.close(),1500)}catch(e){}}

function DoneScreen({st,elapsed,user,supPin,onExit}){
  const[ph,sPh]=useState('party');const[pi2,sPi2]=useState('');const[pe2,sPe2]=useState(false);const[xConf,sXConf]=useState(false);
  const tot=st.ok+st.sk,pct=tot>0?Math.round(st.ok/tot*100):0;
  const isFem=user?.sex==='f';const champ=isFem?'campeona':'campeón';
  useEffect(()=>{victoryBeeps();sXConf(true);const t1=setTimeout(()=>sXConf(false),3000);const t2=setTimeout(()=>{sXConf(true);setTimeout(()=>sXConf(false),3000)},4000);sayFB('¡Felicidades '+champ+'! ¡Has hecho un trabajo enorme!');return()=>{clearTimeout(t1);clearTimeout(t2)}},[]);
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'radial-gradient(ellipse at center,'+BG2+' 0%,'+BG+' 100%)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:20,overflow:'hidden'}}>
    <Confetti show={xConf}/>
    <div style={{maxWidth:420,width:'100%',textAlign:'center'}}>
      {ph==='party'&&<div className="ab">
        <div style={{fontSize:100,marginBottom:4,animation:'pulse 1s infinite'}}>🏆</div>
        <div style={{display:'flex',justifyContent:'center',gap:6,fontSize:36,marginBottom:12,animation:'bounceIn .6s .2s both'}}>{'🎉🌟⭐🎊🥳'.split('').map((e,i)=><span key={i} style={{animation:`bounceIn .4s ${.3+i*.12}s both`}}>{e}</span>)}</div>
        <h1 style={{fontSize:28,color:GOLD,margin:'0 0 4px',animation:'fadeIn .5s .5s both'}}>¡FELICIDADES {champ.toUpperCase()}!</h1>
        <p style={{fontSize:22,color:GREEN,fontWeight:700,margin:'0 0 20px',animation:'fadeIn .5s .7s both'}}>¡Has hecho un trabajo ENORME!</p>
        <div style={{display:'flex',justifyContent:'center',gap:16,marginBottom:24,animation:'fadeIn .5s .9s both'}}>
          {[{l:'Bien',v:st.ok,c:GREEN,e:'✅'},{l:'Acierto',v:pct+'%',c:BLUE,e:'🎯'},{l:'Minutos',v:elapsed,c:GOLD,e:'⏱️'}].map((s,i)=>
            <div key={i} style={{background:CARD,border:'2px solid '+s.c+'44',borderRadius:16,padding:'14px 18px',minWidth:80}}>
              <div style={{fontSize:24}}>{s.e}</div>
              <div style={{fontSize:28,color:s.c,fontWeight:700}}>{s.v}</div>
              <div style={{fontSize:12,color:DIM}}>{s.l}</div>
            </div>)}
        </div>
        <div style={{background:GREEN+'15',border:'2px solid '+GREEN+'33',borderRadius:16,padding:18,marginBottom:20,animation:'fadeIn .5s 1.1s both'}}>
          <p style={{fontSize:20,fontWeight:700,margin:0,color:GREEN}}>🎮 ¡Misión cumplida!</p>
          <p style={{fontSize:16,color:DIM,margin:'6px 0 0'}}>Dale la tablet a papá o mamá</p>
        </div>
        <button className="btn btn-gold" onClick={()=>sPh('pin')} style={{fontSize:20,animation:'fadeIn .5s 1.3s both'}}>🔒 Salir (Padres)</button>
      </div>}
      {ph==='pin'&&<div className="af">
        <div style={{fontSize:56,marginBottom:12}}>🔒</div>
        <p style={{fontSize:20,fontWeight:700,margin:'0 0 4px',color:GOLD}}>PIN de padres</p>
        <p style={{fontSize:15,color:DIM,margin:'0 0 16px'}}>Introduce el PIN para salir</p>
        <input className="inp" value={pi2} onChange={e=>sPi2(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="· · · ·" style={{textAlign:'center',fontSize:30,letterSpacing:16,borderColor:pe2?RED:BORDER,marginBottom:16}}/>
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-ghost" style={{flex:1}} onClick={()=>{sPh('party');sPi2('')}}>Volver</button>
          <button className="btn btn-g" style={{flex:1}} disabled={pi2.length<4} onClick={()=>{if(pi2===supPin){onExit()}else{sPe2(true);sPi2('');setTimeout(()=>sPe2(false),1500)}}}>Salir ✓</button>
        </div>
      </div>}
    </div>
  </div>}

export default function App(){
  const[profs,setProfs]=useState(()=>loadData('profiles',[]));const[user,setUser]=useState(null);const[scr,setScr]=useState(()=>loadData('sup_pin',null)?'login':'setup');const[ov,setOv]=useState(null);
  const[supPin,setSupPin]=useState(()=>loadData('sup_pin',null));const[supInp,setSupInp]=useState('');
  const[queue,setQ]=useState([]);const[idx,setIdx]=useState(0);const[st,setSt]=useState({ok:0,sk:0});const[conf,setConf]=useState(false);
  const[creating,setCreating]=useState(false);const[fn,setFn]=useState('');const[fa,setFa]=useState('');const[fav,setFav]=useState({...DEF_AV});const[flv,setFlv]=useState(1);const[fsex,setFsex]=useState('m');
  const[fPadre,setFPadre]=useState('');const[fMadre,setFMadre]=useState('');const[fHerm,setFHerm]=useState('');const[fTel,setFTel]=useState('');const[fDir,setFDir]=useState('');
  const[ptab,setPtab]=useState('config');const[pp,setPp]=useState('');const[pi,setPi]=useState('');const[pe,setPe]=useState(false);
  const[consec,setConsec]=useState(0);const[showLvAdj,setShowLvAdj]=useState(false);const[showRec,setShowRec]=useState(false);
  const[parentPin,setParentPin]=useState('');const[parentPinOk,setParentPinOk]=useState(false);const[delConf,setDelConf]=useState(false);
  const[micOk,setMicOk]=useState(false);
  const[ss,setSs]=useState(null);const[sm,setSm]=useState(25);const[audioOk,setAudioOk]=useState(false);
  const activeMs=useRef(0);const lastAct=useRef(0);const actTimer=useRef(null);const IDLE_THRESH=10000;
  const[elapsedSt,setElapsedSt]=useState(0);
  function pokeActive(){lastAct.current=Date.now()}
  useEffect(()=>{if(!ss){if(actTimer.current)clearInterval(actTimer.current);return}
    activeMs.current=0;lastAct.current=Date.now();setElapsedSt(0);
    actTimer.current=setInterval(()=>{const now=Date.now();if(now-lastAct.current<IDLE_THRESH)activeMs.current+=1000;setElapsedSt(Math.floor(activeMs.current/60000))},1000);
    return()=>clearInterval(actTimer.current)},[ss]);
  function tU(){pokeActive();if(audioOk)return;setAudioOk(true);if(window.speechSynthesis){const u=new SpeechSynthesisUtterance(' ');u.volume=0.01;u.lang='es-ES';window.speechSynthesis.speak(u)}}
  useEffect(()=>{if(profs.length>0)saveData('profiles',profs)},[profs]);
  function timeUp(){return ss&&activeMs.current>=(sm*60000)}
  function buildQ(u){const need=40;const uLv=u.maxLv||u.level||1;let pool=EX.filter(e=>e.lv<=uLv);const rev=pool.filter(e=>needsRev(e.id,u)),fresh=pool.filter(e=>!(u.srs&&u.srs[e.id])),rest=pool.filter(e=>!rev.includes(e)&&!fresh.includes(e));const sh=a=>[...a].sort(()=>Math.random()-.5);let sel=[...sh(rev).slice(0,24),...sh(fresh).slice(0,12),...sh(rest).slice(0,4)];while(sel.length<need){const r=pool.filter(e=>!sel.includes(e));if(!r.length)break;sel.push(r[Math.floor(Math.random()*r.length)])}return sel.slice(0,need).sort(()=>Math.random()-.5)}
  function startGame(){setQ(buildQ(user));setIdx(0);setSt({ok:0,sk:0});setConsec(0);setSs(Date.now());setScr('game')}
  useEffect(()=>{if(scr!=='game'||!ss)return;const ch=setInterval(()=>{if(timeUp())fin(st)},2000);return()=>clearInterval(ch)},[scr,ss,elapsedSt]);
  function saveP(u){const uLv=u.maxLv||u.level||1;const cur=EX.filter(e=>e.lv===uLv);const mas=cur.filter(e=>u.srs&&u.srs[e.id]&&u.srs[e.id].lv>=3).length;if(cur.length>0&&mas/cur.length>=.8&&uLv<5)u.maxLv=uLv+1;u.level=u.maxLv||u.level||1;setProfs(p=>p.map(x=>x.id===u.id?u:x))}
  function onOk(){pokeActive();setConf(true);setConsec(0);setTimeout(()=>setConf(false),2400);const e=queue[idx];const up=srsUp(e.id,true,user);setUser(up);saveP(up);setSt(s=>({ok:s.ok+1,sk:s.sk}));setTimeout(()=>{if(timeUp()||idx+1>=queue.length)fin({ok:st.ok+1,sk:st.sk});else setIdx(idx+1)},200)}
  function onSk(){pokeActive();const e=queue[idx];const up=srsUp(e.id,false,user);setUser(up);saveP(up);const nf=consec+1;setConsec(nf);setSt(s=>({ok:s.ok,sk:s.sk+1}));if(nf>=3&&(user.maxLv||user.level||1)>1)setShowLvAdj(true);else{if(timeUp()||idx+1>=queue.length)fin({ok:st.ok,sk:st.sk+1});else setIdx(idx+1)}}
  function doLvDn(){const up={...user,maxLv:Math.max(1,(user.maxLv||user.level||1)-1),level:Math.max(1,(user.maxLv||user.level||1)-1)};setUser(up);saveP(up);setShowLvAdj(false);setConsec(0);if(timeUp()||idx+1>=queue.length)fin(st);else setIdx(idx+1)}
  function fin(s){const f=s||st;const amin=Math.floor(activeMs.current/60000);const rec={ok:f.ok,sk:f.sk,dt:tdy(),min:amin};const up={...user,hist:[...(user.hist||[]),rec]};setUser(up);saveP(up);setSs(null);setOv('done')}
  function tryExit(){stopVoice();setOv('pin');setPi('')}
  function chgLv(n){const up={...user,maxLv:n,level:n};setUser(up);saveP(up)}
  const cur=queue[idx];const vids=useMemo(()=>(user?.voices||[]).map(v=>v.id),[user?.voices]);const elapsed=elapsedSt;

  return <div onClick={tU} onTouchStart={tU}><style>{CSS}</style><Confetti show={conf}/>
    {showRec&&user&&<VoiceRec user={user} onBack={()=>setShowRec(false)} onSave={up=>{setUser(up);saveP(up);setShowRec(false)}}/>}
    {showLvAdj&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>🤔</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 10px'}}>¿Bajamos el nivel?</p><div style={{display:'flex',gap:10}}><button className="btn btn-g" style={{flex:1}} onClick={doLvDn}>Sí</button><button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setShowLvAdj(false);setConsec(0);if(timeUp()||idx+1>=queue.length)fin(st);else setIdx(idx+1)}}>No</button></div></div></div>}
    {ov==='pin'&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>🔒</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px'}}>PIN del supervisor</p><input className="inp" value={pi} onChange={e=>setPi(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="· · · ·" style={{textAlign:'center',fontSize:30,letterSpacing:16,borderColor:pe?RED:BORDER}}/><div style={{display:'flex',gap:10,marginTop:16}}><button className="btn btn-ghost" style={{flex:1}} onClick={()=>setOv(null)}>Volver</button><button className="btn btn-g" style={{flex:1}} disabled={pi.length<4} onClick={()=>{if(pi===supPin){setOv(null);setScr('goals')}else{setPe(true);setPi('');setTimeout(()=>setPe(false),1500)}}}>Salir</button></div></div></div>}
    {ov==='done'&&<DoneScreen st={st} elapsed={elapsed} user={user} supPin={supPin} onExit={()=>{setOv(null);setScr('goals')}}/>}
    {ov==='parentGate'&&user&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>👨‍👩‍👦</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px'}}>Panel de Supervisor</p><p style={{fontSize:14,color:DIM,margin:'0 0 14px'}}>Introduce el PIN</p><input className="inp" value={parentPin} onChange={e=>setParentPin(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="· · · ·" style={{textAlign:'center',fontSize:30,letterSpacing:16,borderColor:pe?RED:BORDER}}/><div style={{display:'flex',gap:10,marginTop:16}}><button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setOv(null);setParentPin('')}}>Cancelar</button><button className="btn btn-g" style={{flex:1}} disabled={parentPin.length<4} onClick={()=>{if(parentPin===supPin){setParentPin('');setOv('parent')}else{setPe(true);setParentPin('');setTimeout(()=>setPe(false),1500)}}}>Entrar</button></div></div></div>}
    {ov==='parent'&&user&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:BG,overflowY:'auto',zIndex:100,padding:16}}><div style={{maxWidth:600,margin:'0 auto'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}><p style={{fontSize:20,color:GOLD,fontWeight:700,margin:0}}>👨‍👩‍👦 Panel</p><button className="btn btn-ghost btn-half" style={{width:'auto',padding:'8px 16px'}} onClick={()=>setOv(null)}>✕</button></div>
      <div className="tabs" style={{marginBottom:18}}>{['config','familia','stats','srs'].map(t=><button key={t} className={'tab'+(ptab===t?' on':'')} onClick={()=>setPtab(t)}>{t==='config'?'⚙️':t==='familia'?'👨‍👩‍👦':t==='stats'?'📊':'🧠'}</button>)}</div>
      {ptab==='config'&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div className="card"><p style={{fontSize:16,fontWeight:700,margin:'0 0 10px'}}>🔒 PIN del supervisor</p><input className="inp" value={pp} onChange={e=>setPp(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="1234" style={{textAlign:'center',fontSize:24,letterSpacing:12}}/></div>
        <div className="card"><p style={{fontSize:16,fontWeight:700,margin:'0 0 10px'}}>⏱️ Sesión: <span style={{color:GREEN}}>{sm} min</span></p><div style={{display:'flex',gap:8}}>{SMINS.map(m=><button key={m} onClick={()=>setSm(m)} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${sm===m?GOLD:BORDER}`,background:sm===m?GOLD+'22':BG3,color:sm===m?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:700,fontSize:18,cursor:'pointer'}}>{m}'</button>)}</div></div>
        <div className="card"><p style={{fontSize:16,fontWeight:700,margin:'0 0 10px'}}>📊 Nivel: <span style={{color:GREEN}}>{user.maxLv||user.level||1}</span></p><div style={{display:'flex',gap:8}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>chgLv(n)} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${(user.maxLv||user.level||1)===n?GOLD:BORDER}`,background:(user.maxLv||user.level||1)===n?GOLD+'22':BG3,color:(user.maxLv||user.level||1)===n?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:700,fontSize:18,cursor:'pointer'}}>{n}</button>)}</div></div>
        <button className="btn btn-gold" onClick={()=>{if(pp.length===4){setSupPin(pp);saveData('sup_pin',pp)}const up={...user,sessionMin:sm};setUser(up);saveP(up);setOv(null)}}>💾 Guardar</button>
        <div style={{marginTop:16,borderTop:'1px solid '+BORDER,paddingTop:16}}>{!delConf?<button className="btn btn-ghost" style={{color:RED,borderColor:RED+'44'}} onClick={()=>setDelConf(true)}>🗑️ Borrar perfil de {user.name}</button>:<div className="card" style={{borderColor:RED+'66',background:RED+'0C'}}><p style={{fontSize:16,fontWeight:700,color:RED,margin:'0 0 8px'}}>¿Seguro? Se perderá todo el progreso</p><div style={{display:'flex',gap:10}}><button className="btn btn-ghost" style={{flex:1}} onClick={()=>setDelConf(false)}>Cancelar</button><button className="btn btn-g" style={{flex:1,background:RED,borderColor:'#c0392b',boxShadow:'4px 4px 0 #922b21'}} onClick={()=>{setProfs(p=>p.filter(x=>x.id!==user.id));setUser(null);setOv(null);setDelConf(false);setScr('login')}}>Sí, borrar</button></div></div>}</div>
      </div>}
      {ptab==='familia'&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
        <div className="card"><p style={{fontSize:15,fontWeight:700,margin:'0 0 8px',color:GOLD}}>👨 Nombre del padre</p><input className="inp" value={user.padre||''} onChange={e=>{const up={...user,padre:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Diego"/></div>
        <div className="card"><p style={{fontSize:15,fontWeight:700,margin:'0 0 8px',color:GOLD}}>👩 Nombre de la madre</p><input className="inp" value={user.madre||''} onChange={e=>{const up={...user,madre:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Sole"/></div>
        <div className="card"><p style={{fontSize:15,fontWeight:700,margin:'0 0 8px',color:GOLD}}>👦 Hermanos (separados por coma)</p><input className="inp" value={user.hermanos||''} onChange={e=>{const up={...user,hermanos:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Jaime, Alejandro"/></div>
        <div className="card"><p style={{fontSize:15,fontWeight:700,margin:'0 0 8px',color:GOLD}}>📱 Teléfono de emergencia</p><input className="inp" value={user.telefono||''} onChange={e=>{const up={...user,telefono:e.target.value};setUser(up);saveP(up)}} type="tel" placeholder="Ej: 6.2.6.8.4.8.4.4.8"/><p style={{fontSize:12,color:DIM,margin:'6px 0 0'}}>Con puntos para pronunciar: 6.2.6.8.4.8</p></div>
        <div className="card"><p style={{fontSize:15,fontWeight:700,margin:'0 0 8px',color:GOLD}}>🏠 Dirección de casa</p><input className="inp" value={user.direccion||''} onChange={e=>{const up={...user,direccion:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Paseo Ramón Gaya 4, Murcia"/></div>
        <p style={{fontSize:13,color:DIM,margin:0}}>Estos datos se usan en frases personalizadas para que practique con su información real.</p>
      </div>}
      {ptab==='stats'&&(()=>{const h=user.hist||[],tc=h.reduce((s,x)=>s+x.ok,0),ta=h.reduce((s,x)=>s+x.ok+x.sk,0),pct=ta>0?Math.round(tc/ta*100):0,tm=h.reduce((s,x)=>s+(x.min||0),0);return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{[{l:'Sesiones',v:h.length,c:GREEN},{l:'Aciertos',v:tc,c:BLUE},{l:'%',v:pct+'%',c:GOLD},{l:'Minutos',v:tm,c:PURPLE}].map((s,i)=><div key={i} className="sbox"><div style={{fontSize:28,color:s.c,fontWeight:700}}>{s.v}</div><div style={{fontSize:13,color:DIM,marginTop:4}}>{s.l}</div></div>)}</div>})()}
      {ptab==='srs'&&(()=>{const mas=Object.values(user.srs||{}).filter(s=>s.lv>=4).length,lrn=Object.values(user.srs||{}).filter(s=>s.lv>0&&s.lv<4).length,nw=EX.length-mas-lrn;return <div style={{textAlign:'center',padding:'20px 0'}}><div style={{display:'flex',justifyContent:'center',gap:20}}>{[{l:'Dominadas',v:mas,c:GREEN},{l:'Aprendiendo',v:lrn,c:GOLD},{l:'Nuevas',v:nw,c:PURPLE}].map((s,i)=><div key={i}><div style={{position:'relative',display:'inline-block'}}><Ring p={s.v/EX.length} sz={80} c={s.c}/><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:20,color:s.c,fontWeight:700}}>{s.v}</div></div><div style={{fontSize:13,color:DIM,marginTop:6}}>{s.l}</div></div>)}</div></div>})()}
    </div></div>}

    {scr==='setup'&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:80,marginBottom:8,animation:'glow 3s infinite'}}>🗣️</div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p>
      <div className="card" style={{padding:24,textAlign:'left',marginBottom:16}}>
        <p style={{fontSize:20,color:GOLD,fontWeight:700,textAlign:'center',margin:'0 0 16px'}}>Configuración inicial</p>
        <p style={{fontSize:15,color:DIM,margin:'0 0 14px'}}>Este PIN lo usará el supervisor (padre, madre o tutor) para gestionar la app. El niño no podrá salir sin él.</p>
        <label style={{fontSize:16,fontWeight:700,color:TXT}}>🔒 PIN del supervisor (4 dígitos)</label>
        <input className="inp" value={supInp} onChange={e=>setSupInp(e.target.value.replace(/\D/g,'').slice(0,4))} type="tel" placeholder="· · · ·" style={{marginTop:8,marginBottom:20,textAlign:'center',fontSize:30,letterSpacing:16}}/>
        <div style={{background:BLUE+'15',border:'2px solid '+BLUE+'33',borderRadius:14,padding:16,marginBottom:16}}>
          <p style={{fontSize:16,fontWeight:700,margin:'0 0 8px'}}>🎤 Permiso del micrófono</p>
          <p style={{fontSize:14,color:DIM,margin:'0 0 12px'}}>Toki necesita el micrófono para escuchar al niño. Sin él, la app no funciona.</p>
          {!micOk?<button className="btn btn-b" onClick={()=>{navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop());setMicOk(true)}).catch(()=>alert('No se ha podido activar el micrófono. Revisa los permisos del navegador.'))}} style={{fontSize:18}}>🎤 Activar micrófono</button>
          :<p style={{fontSize:18,color:GREEN,fontWeight:700,margin:0}}>✅ Micrófono activado</p>}
        </div>
        <button className="btn btn-gold" disabled={supInp.length<4||!micOk} onClick={()=>{setSupPin(supInp);saveData('sup_pin',supInp);setSupInp('');setScr('login')}} style={{fontSize:22}}>Empezar 🚀</button>
        {supInp.length<4&&<p style={{fontSize:13,color:DIM,textAlign:'center',margin:'10px 0 0'}}>Escribe 4 dígitos para el PIN</p>}
        {supInp.length===4&&!micOk&&<p style={{fontSize:13,color:GOLD,textAlign:'center',margin:'10px 0 0'}}>Activa el micrófono para continuar</p>}
      </div>
      <p style={{color:DIM+'66',fontSize:10,position:'fixed',bottom:10,left:0,right:0,textAlign:'center'}}>© 2026 Toki — Diego Aroca</p>
    </div>}

    {scr==='login'&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:80,marginBottom:8,animation:'glow 3s infinite'}}>🗣️</div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p><p style={{color:DIM+'66',fontSize:10,position:'fixed',bottom:10,left:0,right:0,textAlign:'center'}}>© 2026 Toki — Diego Aroca</p>
      {profs.length>0&&!creating&&<div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:24}}>{profs.map(p=><button key={p.id} className="profcard" onClick={()=>{setUser(p);setSm(p.sessionMin||25);setVoiceProfile(p.age,p.sex);setScr('goals')}}><Avatar av={p.av} sz={44}/><div style={{flex:1}}><div style={{fontSize:22,fontWeight:700}}>{p.name}</div><div style={{fontSize:14,color:DIM}}>{p.age} años · Nivel {p.maxLv||p.level||1}</div></div></button>)}</div>}
      {profs.length<4&&!creating&&<button className="btn btn-p" onClick={()=>setCreating(true)} style={{fontSize:22}}>➕ Nuevo Jugador</button>}
      {creating&&<div className="card af" style={{padding:24,textAlign:'left'}}><p style={{fontSize:22,color:GOLD,textAlign:'center',margin:'0 0 18px',fontWeight:700}}>Nuevo Jugador</p>
        <label style={{fontSize:15,color:DIM}}>Nombre</label><input className="inp" value={fn} onChange={e=>setFn(e.target.value)} placeholder="Ej: Guillermo" style={{marginBottom:14,marginTop:6}}/>
        <label style={{fontSize:15,color:DIM}}>Fecha de nacimiento</label><input className="inp" value={fa} onChange={e=>setFa(e.target.value)} type="date" style={{marginBottom:14,marginTop:6}}/>
        <label style={{fontSize:15,color:DIM}}>Sexo</label><div style={{display:'flex',gap:10,margin:'8px 0 14px'}}>{[['m','👦 Chico'],['f','👧 Chica']].map(([v,l])=><button key={v} onClick={()=>setFsex(v)} style={{flex:1,padding:'14px 0',borderRadius:12,border:`3px solid ${fsex===v?GOLD:BORDER}`,background:fsex===v?GOLD+'22':BG3,color:fsex===v?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:700,fontSize:18,cursor:'pointer'}}>{l}</button>)}</div>
        <label style={{fontSize:15,color:DIM}}>Nivel</label><div style={{display:'flex',gap:8,margin:'8px 0 14px'}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setFlv(n)} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${flv===n?GOLD:BORDER}`,background:flv===n?GOLD+'22':BG3,color:flv===n?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:700,fontSize:18,cursor:'pointer'}}>{n}</button>)}</div>
        <div style={{borderTop:'1px solid '+BORDER,paddingTop:14,marginBottom:14}}><p style={{fontSize:16,color:GOLD,fontWeight:700,margin:'0 0 12px'}}>👨‍👩‍👦 Familia (opcional, para frases personalizadas)</p>
        <label style={{fontSize:14,color:DIM}}>Nombre del padre</label><input className="inp" value={fPadre} onChange={e=>setFPadre(e.target.value)} placeholder="Ej: Diego" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:14,color:DIM}}>Nombre de la madre</label><input className="inp" value={fMadre} onChange={e=>setFMadre(e.target.value)} placeholder="Ej: Sole" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:14,color:DIM}}>Hermanos (separados por coma)</label><input className="inp" value={fHerm} onChange={e=>setFHerm(e.target.value)} placeholder="Ej: Jaime, Alejandro" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:14,color:DIM}}>Teléfono de emergencia</label><input className="inp" value={fTel} onChange={e=>setFTel(e.target.value)} type="tel" placeholder="Ej: 6.2.6.8.4.8.4.4.8" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:14,color:DIM}}>Dirección de casa</label><input className="inp" value={fDir} onChange={e=>setFDir(e.target.value)} placeholder="Ej: Paseo Ramón Gaya 4, Murcia" style={{marginBottom:14,marginTop:4,fontSize:17}}/></div>
        <label style={{fontSize:15,color:DIM}}>Avatar</label><div style={{margin:'10px 0 18px'}}><AvatarEditor value={fav} onChange={setFav}/></div>
        <div style={{display:'flex',gap:10}}><button className="btn btn-ghost" style={{flex:1}} onClick={()=>setCreating(false)}>Cancelar</button><button className="btn btn-g" style={{flex:2}} disabled={!fn.trim()||!fa} onClick={()=>{const bd=new Date(fa),now=new Date(),age=Math.floor((now-bd)/31557600000);const p={id:Date.now()+'',name:cap(fn.trim()),birthdate:fa,age:Math.max(1,age),sex:fsex,av:fav,hist:[],srs:{},level:flv,maxLv:flv,sessionMin:25,voices:[],padre:fPadre.trim(),madre:fMadre.trim(),hermanos:fHerm.trim(),telefono:fTel.trim(),direccion:fDir.trim()};setProfs(prev=>[...prev,p]);setUser(p);setCreating(false);setFn('');setFa('');setFPadre('');setFMadre('');setFHerm('');setFTel('');setFDir('');setVoiceProfile(Math.max(1,age),fsex);setScr('goals')}}>Crear ✓</button></div></div>}
    </div>}

    {scr==='goals'&&user&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><button style={{background:'none',border:'none',color:DIM,fontSize:16}} onClick={()=>{setUser(null);setScr('login')}}>← Cambiar</button><div style={{display:'flex',gap:12}}><button style={{background:'none',border:'none',color:GOLD,fontSize:16}} onClick={()=>setShowRec(true)}>🎙️</button><button style={{background:'none',border:'none',color:DIM,fontSize:16}} onClick={()=>{setParentPinOk(false);setParentPin('');setPp(supPin||'');setSm(user.sessionMin||25);setPtab('config');setDelConf(false);setOv('parentGate')}}>⚙️</button></div></div>
      <div style={{textAlign:'center',padding:'20px 0'}}><div style={{display:'flex',justifyContent:'center',marginBottom:8}}><Avatar av={user.av} sz={72}/></div><h2 style={{fontSize:28,margin:'0 0 4px'}}>¡Hola {user.name}!</h2><p style={{fontSize:15,color:DIM,margin:'0 0 20px'}}>Nivel {user.maxLv||user.level||1} de 5</p>
        <div style={{background:GREEN+'0C',border:`2px solid ${GREEN}22`,borderRadius:18,padding:24,margin:'0 0 20px'}}><div style={{fontSize:48,marginBottom:8}}>⏱️</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 4px'}}>Sesión de <span style={{color:GREEN}}>{sm} minutos</span></p><p style={{fontSize:16,color:DIM,margin:0}}>¡Termina y la tablet es tuya! 🎮</p></div>
        <button className="btn btn-g" onClick={startGame} style={{fontSize:24}}>🚀 ¡A por ello!</button></div></div>}

    {scr==='game'&&cur&&<div className="af" onClick={pokeActive} onTouchStart={pokeActive}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><button style={{background:'none',border:'none',color:DIM,fontSize:16}} onClick={tryExit}>✕ Salir</button><span style={{fontSize:14,color:DIM,fontWeight:600}}>⏱️ {elapsed}' / {sm}'</span></div>
      <div className="pbar" style={{marginBottom:10}}><div className="pfill" style={{width:Math.min(100,elapsed/sm*100)+'%'}}/></div>
      <Tower placed={st.ok} total={st.ok+st.sk+Math.max(1,queue.length-idx)}/>
      <div style={{marginTop:10}}>
        {cur.ty==='frases'&&<ExFrases ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='sit'&&<ExSit ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='flu'&&<ExFlu ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
      </div></div>}
  </div>}
