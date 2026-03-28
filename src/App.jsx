// ============================================================
// TOKI · Aprende a decirlo
// © 2026 Diego Aroca. Todos los derechos reservados.
// ============================================================
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AREAS, EX } from './exercises.js'
import { auth, db, storage, hasConfig, fbSignIn, fbSignUp, fbSignOut, fbSignInWithGoogle, fbOnAuth, fbGetProfile, fbSaveProfile, fbUpdateProfile, fbListUsers, fbRevokeUser, fbUnrevokeUser, fbUploadPhoto, fbUploadVoice, fbDeleteFile, compressImage, STORAGE_LIMIT, fbCreateShareCode, fbGetSharedProfile, fbLinkToSharedProfile, fbRevokeShareLink, fbUploadPublicVoice, fbGetBestVoice, fbUploadUserVoice, trimSilence, validateVoiceDuration } from './firebase.js'
import { BG, BG2, BG3, GOLD, GREEN, RED, BLUE, PURPLE, TXT, DIM, CARD, BORDER, VER, ADMIN_EMAIL, CSS, AVS, CLS, SMINS, PERSONA_RELATIONS, BUILD_OK, PERFECT_T, GOOD_MSG, RETRY_MSG, FAIL_MSG, SHORT_OK, SHORT_FAIL, MODULE_MSG, CHEER_ALL, NUMS_1_100, QUIEN_SOY, LV_OPTS, GROUPS } from './constants.js'
import { isSober, lev, digToText, score, getExigencia, adjScore, cap, saveData, loadData, textKey, personalize, srsUp, needsRev, getModuleLv, getModuleLvOrDef, setModuleLv, beep, countdownBeep, getTimeOfDay, getSkyClass, getGreeting, getStreak, getTotalStars, getGroupProgress, addGroupProgress, getGroupStatus, splitSyllables, rnd, tdy, avStr, pickMsg, mkPerfect, cheerIdx, getGroupsForUser } from './utils.js'
import { voiceProfile, cachedVoice, setVoiceProfile, getVP, pickVoice, say, sayFB, sayFast, stopVoice, _publicVoiceCache, playRec, playRecLocal, SR_AVAILABLE, useSR, listenQuick, starBeep, cheerOrSay } from './voice.js'
import { processImage, cloudSaveProfile, cloudLoadProfile, cloudListUsers, cloudRevokeUser, cloudUnrevokeUser, generateAutoPresentation } from './cloud.js'
import { SpaceMascot, Confetti, Ring, Tower, RecBtn, useIdle, NumPad, AbacusHelp, AstronautAvatar } from './components/UIKit.jsx'
import { RocketTransition } from './components/RocketTransition.jsx'
import { CelebrationOverlay, Stars } from './components/CelebrationOverlay.jsx'
import { PhotoCropOverlay } from './components/PhotoCropOverlay.jsx'
import { EmergencyButton } from './components/EmergencyButton.jsx'
import { MonthlyReport } from './components/MonthlyReport.jsx'
import { DoneScreen, victoryBeeps } from './components/DoneScreen.jsx'
import { VoiceRec } from './components/VoiceRec.jsx'
import { SpeakPanel, ExFlu, ExFrases, ExFrasesBlank, ExSit } from './components/SpeakPanel.jsx'
import { ExCount, NUM_BLOCK_COLORS } from './modules/ExCount.jsx'
import { genMath, Fingers, AnimCount, ExMath } from './modules/ExMath.jsx'
import { genMulti, ExMulti } from './modules/ExMulti.jsx'
import { PieChart, RectChart, genFractions, ExFraction } from './modules/ExFraction.jsx'
import { COINS, BILLS, genMoney, ExMoney } from './modules/ExMoney.jsx'
import { clockText, genClock, ClockFace, ExClock } from './modules/ExClock.jsx'
import { genCalendar, ExCalendar } from './modules/ExCalendar.jsx'
import { genDistribute, BagSVG, ExDistribute, CardSVG, dominoDots, DominoSVG } from './modules/ExDistribute.jsx'
import { genWriting, ExWriting, LETTER_STROKE_PATHS } from './modules/ExWriting.jsx'
import { genPatterns, genRazona, SceneSVG, SpatialDrag, ExRazona } from './modules/ExRazona.jsx'
import { genLee, ExLee } from './modules/ExLee.jsx'
import { QSTimeBar, ExQuienSoyEstudio, ExQuienSoyPres, ExQuienSoyUnified } from './modules/ExQuienSoy.jsx'
import { MiCielo } from './components/MiCielo.jsx'
import { Settings } from './components/Settings.jsx'
// Personas helpers






// ===== NUMPAD — Custom numeric keypad =====

export default function App(){
  const[profs,setProfs]=useState(()=>loadData('profiles',[]));const[user,setUser]=useState(null);const[scr,setScr]=useState(()=>loadData('sup_pin',null)?'login':hasConfig?'login':'setup');const[ov,setOv]=useState(null);
  const[supPin,setSupPin]=useState(()=>loadData('sup_pin',null));const[supInp,setSupInp]=useState('');
  const[pinStep,setPinStep]=useState('enter'); // 'enter' | 'confirm'
  const[pinFirst,setPinFirst]=useState(''); // first PIN entry for confirmation
  const[pinErr,setPinErr]=useState(''); // error message for PIN mismatch
  const[queue,setQ]=useState([]);const[idx,setIdx]=useState(0);const[st,setSt]=useState({ok:0,sk:0});const[conf,setConf]=useState(false);
  const[creating,setCreating]=useState(false);const[fn,setFn]=useState('');const[fa,setFa]=useState('');const[fav,setFav]=useState(AVS[0]);const[flv,setFlv]=useState(1);const[fsex,setFsex]=useState('m');const[hoveredProf,setHoveredProf]=useState(null);
  const[fTel,setFTel]=useState('');const[fDir,setFDir]=useState('');const[fApellidos,setFApellidos]=useState('');const[fColegio,setFColegio]=useState('');const[fPhoto,setFPhoto]=useState(null);
  const[openSection,setOpenSection]=useState('pin');const[delPersonaIdx,setDelPersonaIdx]=useState(null);
  const[presEdit,setPresEdit]=useState(null);const[presNewMode,setPresNewMode]=useState(null);const[presDelIdx,setPresDelIdx]=useState(null);const[selectedPresIdx,setSelectedPresIdx]=useState(null);const[showPresSelector,setShowPresSelector]=useState(false);
  const[photoCrop,setPhotoCrop]=useState(null); // {src,onSave} for crop overlay
  const[ptab,setPtab]=useState('config');const[pp,setPp]=useState('');const[pi,setPi]=useState('');const[pe,setPe]=useState(false);const[pOpenPlanet,setPOpenPlanet]=useState(null);
  const[consec,setConsec]=useState(0);const[showLvAdj,setShowLvAdj]=useState(false);const[showRec,setShowRec]=useState(false);
  const[parentPin,setParentPin]=useState('');const[parentPinOk,setParentPinOk]=useState(false);const[delConf,setDelConf]=useState(false);const[shareCode,setShareCode]=useState(null);const[shareInput,setShareInput]=useState('');const[shareMsg,setShareMsg]=useState('');
  const[micOk,setMicOk]=useState(false);const[supervisorMode,setSupervisorMode]=useState(false);const supervisorTimer=useRef(null);
  const[exigencia,setExigenciaState]=useState(()=>getExigencia());
  function setExigencia(v){setExigenciaState(v);try{localStorage.setItem('toki_exigencia',String(v))}catch(e){}}
  // ===== Firebase Auth State =====
  const[fbUser,setFbUser]=useState(null); // Firebase user object
  const[fbLoading,setFbLoading]=useState(hasConfig); // loading auth state
  const[fbMode,setFbMode]=useState(hasConfig?'auth':'guest'); // 'auth' | 'guest'
  const[authScreen,setAuthScreen]=useState('choice'); // 'choice' | 'login' | 'register' | 'admin'
  const[authEmail,setAuthEmail]=useState('');
  const[authPass,setAuthPass]=useState('');
  const[authErr,setAuthErr]=useState('');
  const[authBusy,setAuthBusy]=useState(false);
  const[cloudUsers,setCloudUsers]=useState([]);
  const[cloudSyncing,setCloudSyncing]=useState(false);
  const[revoked,setRevoked]=useState(false);
  // Init Firebase lazily if config exists
  const[personas,setPersonas]=useState(()=>{const p=loadData('personas',null);if(p)return p;const def=[{name:'',relation:'Padre',avatar:'👨'},{name:'',relation:'Madre',avatar:'👩'},{name:'',relation:'Hermano',avatar:'👦'},{name:'',relation:'Amigo',avatar:'🧑‍🚀'}];saveData('personas',def);return def});
  function savePersonas(ps){setPersonas(ps);saveData('personas',ps)}
  // Auto-generate presentations and migrate Síndrome de Down (persisted, runs once)
  useEffect(()=>{if(!profs.length)return;let changed=false;const updated=profs.map(p=>{
    const pp={...p};
    if(!pp.presentations||!pp.presentations.length){const gen=generateAutoPresentation(pp,personas);
      if(gen.lines.length>0){pp.presentations=[{name:'Quién Soy',date:new Date().toISOString().slice(0,10),lines:gen.lines,slides:gen.slides,auto:true}];changed=true}}
    if(pp.presentations&&!pp.presentations.some(pr=>pr.specific)&&fbUser&&fbUser.email==='diegoarocavillalba@hotmail.com'&&pp.name&&pp.name.toLowerCase().includes('guillermo')){
      const sdownPres={name:'El Síndrome de Down',date:'2024-01-01',lines:QUIEN_SOY.map(q=>q.text),slides:QUIEN_SOY.map(q=>({text:q.text,img:q.img,picto:q.picto})),specific:true};
      pp.presentations.forEach(pr=>{if(pr.auto&&pr.name==='Mi presentación')pr.name='Quién Soy'});
      pp.presentations.unshift(sdownPres);changed=true}
    return pp});
    if(changed){setProfs(updated);saveData('profiles',updated)}},[profs.length,fbUser?.email]);
  // Dynamic GROUPS: Aprende modules generated from user.presentations
  const dynGroups=useMemo(()=>getGroupsForUser(user,GROUPS),[user,user?.presentations])
  useEffect(()=>{if(hasConfig)setFbLoading(false)},[]);
  // Listen to Firebase auth state changes
  useEffect(()=>{if(!hasConfig||!auth)return;
    const unsub=fbOnAuth(async(u)=>{
      setFbUser(u);setFbLoading(false);
      if(u){
        // Check if user is revoked
        const data=await cloudLoadProfile(u.uid);
        if(data&&data.revoked){setRevoked(true);return}
        setRevoked(false);
        // Load cloud data and merge with local
        if(data&&data.profiles){
          const localProfs=loadData('profiles',[]);
          // Cloud has data — use cloud as source of truth if local is empty or cloud is newer
          if(!localProfs.length||data.profiles.length>0){
            saveData('profiles',data.profiles);setProfs(data.profiles)}
          if(data.personas){saveData('personas',data.personas);setPersonas(data.personas)}
        }
        setFbMode('cloud')}
      else{setFbMode(hasConfig?'auth':'guest');setRevoked(false)}
    });return()=>unsub()},[]);
  // Cloud sync moved below personas declaration
  async function handleLogin(){
    if(!auth)return;setAuthBusy(true);setAuthErr('');
    try{await fbSignIn(authEmail.trim(),authPass);
      setAuthScreen('choice');setAuthEmail('');setAuthPass('');
    }catch(e){
      const msgs={'auth/invalid-credential':'Email o contraseña incorrectos','auth/user-not-found':'No existe esa cuenta','auth/wrong-password':'Contraseña incorrecta','auth/invalid-email':'Email no válido','auth/too-many-requests':'Demasiados intentos, espera un momento'};
      setAuthErr(msgs[e.code]||'Error: '+e.message);
    }finally{setAuthBusy(false)}}
  async function handleRegister(){
    if(!auth)return;setAuthBusy(true);setAuthErr('');
    if(authPass.length<6){setAuthErr('La contraseña debe tener al menos 6 caracteres');setAuthBusy(false);return}
    try{await fbSignUp(authEmail.trim(),authPass);
      setAuthScreen('choice');setAuthEmail('');setAuthPass('');
    }catch(e){
      const msgs={'auth/email-already-in-use':'Ya existe una cuenta con ese email','auth/invalid-email':'Email no válido','auth/weak-password':'Contraseña demasiado débil'};
      setAuthErr(msgs[e.code]||'Error: '+e.message);
    }finally{setAuthBusy(false)}}
  async function handleLogout(){
    if(!auth)return;try{await fbSignOut()}catch(e){}setFbMode('guest');setFbUser(null)}
  function enterGuest(){setFbMode('guest');setFbLoading(false);if(!supPin)setScr('setup')}
  useEffect(()=>{window.__tokiSupervisor=supervisorMode;document.body.classList.toggle('sup-mode',supervisorMode)},[supervisorMode]);
  // Theme: Espacial (default) or Sobrio
  const[theme,setThemeState]=useState(()=>{try{return localStorage.getItem('toki_theme')||'espacial'}catch(e){return'espacial'}});
  function setTheme(v){setThemeState(v);try{localStorage.setItem('toki_theme',v)}catch(e){};document.body.classList.toggle('theme-sober',v==='sober')}
  useEffect(()=>{document.body.classList.toggle('theme-sober',theme==='sober')},[]);
  // Helmet mode
  const[helmetMode,setHelmetModeState]=useState(()=>{try{return localStorage.getItem('toki_helmet')!=='false'}catch(e){return true}});
  function setHelmetMode(v){setHelmetModeState(v);try{localStorage.setItem('toki_helmet',String(v))}catch(e){}}
  const showHelmet=helmetMode&&theme!=='sober';
  // Rocket color customization
  const ROCKET_COLORS={rojo:{nose:RED,body:'#E0E0E0'},azul:{nose:'#2196F3',body:'#BBDEFB'},verde:{nose:'#4CAF50',body:'#C8E6C9'},dorado:{nose:'#FFD700',body:'#FFF8E1'},morado:{nose:'#9C27B0',body:'#E1BEE7'}};
  const[rocketColor,setRocketColorState]=useState(()=>{try{return localStorage.getItem('toki_rocket_color')||'rojo'}catch(e){return'rojo'}});
  function setRocketColor(v){setRocketColorState(v);try{localStorage.setItem('toki_rocket_color',v)}catch(e){}}
  // Sky theme based on time of day
  useEffect(()=>{function applySky(){document.body.classList.remove('sky-morning','sky-afternoon','sky-night');document.body.classList.add(getSkyClass())}applySky();const iv=setInterval(applySky,60000);return()=>clearInterval(iv)},[]);
  const[mascotMood,setMascotMood]=useState('idle');
  const[showRocket,setShowRocket]=useState(false);
  const streak=useMemo(()=>getStreak(),[scr]);
  const totalStars=useMemo(()=>getTotalStars(),[scr,st]);
  const[showMiCielo,setShowMiCielo]=useState(false);
  // Auto cloud sync when profiles change (debounced)
  const cloudSyncTimer=useRef(null);
  useEffect(()=>{if(fbMode!=='cloud'||!fbUser)return;
    clearTimeout(cloudSyncTimer.current);
    cloudSyncTimer.current=setTimeout(()=>{
      cloudSaveProfile(fbUser.uid,{profiles:profs,personas,email:fbUser.email})
    },2000)
  },[profs,personas,fbMode,fbUser]);
  const[sec,setSec]=useState('decir');const[secLv,setSecLv]=useState(1);const[openGroup,setOpenGroup]=useState(null);
  const[activeMods,setActiveMods]=useState(()=>loadData('active_mods',{}));const[sessionMode,setSessionMode]=useState(()=>loadData('session_mode','free'));const[guidedTasks,setGuidedTasks]=useState(()=>loadData('guided_tasks',[]));const[maxDaily,setMaxDaily]=useState(()=>loadData('max_daily',0));
  const[escribeCase,setEscribeCase]=useState(()=>loadData('escribe_case','upper'));
  const[escribeTypes,setEscribeTypes]=useState(()=>loadData('escribe_types',['letras']));
  const[escribeGuide,setEscribeGuide]=useState(()=>loadData('escribe_guide',{letras:true,palabras:true,frases:true}));
  const[escribePauta,setEscribePauta]=useState(()=>loadData('escribe_pauta_size',0));
  const[freeChoice,setFreeChoice]=useState(true);const[qsChoice,setQsChoice]=useState(null);
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
  // Recording recovery: match orphaned toki_voice_* keys to current profiles by voice name
  useEffect(()=>{try{const allKeys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('toki_voice_'))allKeys.push(k)}
    if(!allKeys.length||!profs.length)return;
    profs.forEach(p=>{if(!p.voices||!p.voices.length)return;const knownKeys=p.voices.map(v=>'toki_voice_'+p.id+'_'+v.id);
      const orphans=allKeys.filter(k=>k.startsWith('toki_voice_')&&!knownKeys.includes(k));
      orphans.forEach(ok=>{try{const raw=localStorage.getItem(ok);if(!raw)return;const d=JSON.parse(raw);if(!d||!d.name)return;
        const matchVoice=p.voices.find(v=>v.name&&v.name.toLowerCase()===d.name.toLowerCase());
        if(matchVoice){const targetKey='toki_voice_'+p.id+'_'+matchVoice.id;if(!localStorage.getItem(targetKey)){localStorage.setItem(targetKey,raw)}}
      }catch(e){}})})
  }catch(e){}},[profs]);
  useEffect(()=>{if(profs.length>0)saveData('profiles',profs)},[profs]);
  // Auto-request mic permission on first touch
  useEffect(()=>{const requestMic=()=>{navigator.mediaDevices&&navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop())}).catch(()=>{});document.removeEventListener('click',requestMic);document.removeEventListener('touchstart',requestMic)};document.addEventListener('click',requestMic);document.addEventListener('touchstart',requestMic);return()=>{document.removeEventListener('click',requestMic);document.removeEventListener('touchstart',requestMic)}},[]);
  function timeUp(){return ss&&sm>0&&activeMs.current>=(sm*60000)}
  const curPresLvKeyRef=useRef('pres_0');
  function buildQ(u,section,slv){const sh=a=>[...a].sort(()=>Math.random()-.5);const curPresLvKey=curPresLvKeyRef.current;
    // APRENDE: find the selected presentation and build exercises
    if(section==='quiensoy'){
      const lvArr=Array.isArray(slv)?slv:[slv||1];
      const hasEstudio=lvArr.includes(1),hasPres=lvArr.includes(2);
      // Find presentation by presIdx from the selected module
      const pres=u.presentations||[];
      const allMods=dynGroups.flatMap(g=>g.modules).filter(m=>m.k==='quiensoy');
      const curMod=allMods.find(m=>m.lvKey===curPresLvKey)||allMods[0];
      const pi=curMod?.presIdx??0;
      const thisPres=pres[pi]||pres[0]||null;
      // Build slides from whatever data we have
      const items=[];
      if(thisPres){
        const slides=thisPres.slides||(thisPres.lines||[]).map(t=>({text:t,img:null,picto:null}));
        // Always generate estudio-style items (one per slide) with presentation attached for switch
        const presData={...thisPres,slides};
        const canToggle=hasEstudio&&hasPres;
        if(slides.length>0){
          items.push(...slides.filter(s=>(typeof s==='string'?s:s.text||'').trim()).map((s,si)=>({ty:'quiensoy',id:`pres${pi}_e${si}`,text:personalize(typeof s==='string'?s:s.text||'',u),img:s.img||u.photo||null,picto:s.picto||null,presentation:presData,canToggle})));
        }
      }
      // Ultimate fallback: if nothing found, create from user data
      if(!items.length){
        const fallback='Hola, me llamo '+(u.name||'');
        items.push({ty:'quiensoy',id:'pres_fb_0',text:fallback,img:u.photo||null,picto:null});
      }
      return items}
    // Multi-level support: if slv is an array, merge exercises from all levels
    if(Array.isArray(slv)&&slv.length>1){const merged=[];slv.forEach(lv=>{merged.push(...buildQ(u,section,lv))});return sh(merged)}
    if(Array.isArray(slv))slv=parseInt(slv[0])||1;
    if(section==='decir'){const wLen=e=>{const t=e.ph||e.su||'';return t.replace(/[¿?¡!,\.]/g,'').split(/\s+/).filter(Boolean).length};
      const lv=parseInt(Array.isArray(slv)?slv[0]:slv)||1;
      const wRange=lv===1?[1,2]:lv===2?[2,3]:lv===3?[3,4]:lv===4?[4,5]:[5,99];
      const pool=EX.filter(e=>e.ty==='flu'&&wLen(e)>=wRange[0]&&wLen(e)<=wRange[1]);
      const rev=pool.filter(e=>needsRev(e.id,u)),fresh=pool.filter(e=>!(u.srs&&u.srs[e.id])),rest=pool.filter(e=>!rev.includes(e)&&!fresh.includes(e));let sel=[...sh(rev).slice(0,24),...sh(fresh).slice(0,12),...sh(rest).slice(0,4)];while(sel.length<40){const r=pool.filter(e=>!sel.includes(e));if(!r.length)break;sel.push(r[Math.floor(Math.random()*r.length)])}return sel.slice(0,40).sort(()=>Math.random()-.5).map(e=>{const p={...e};if(p.ph)p.ph=personalize(p.ph,u);if(p.fu)p.fu=personalize(p.fu,u);if(p.su)p.su=personalize(p.su,u);if(p.q)p.q=personalize(p.q,u);if(p.si)p.si=personalize(p.si,u);if(p.op)p.op=p.op.map(o=>personalize(o,u));return p})}
    if(section==='frase'){const flv=parseInt(Array.isArray(slv)?slv[0]:slv)||1;const wc=flv===1?3:flv===2?4:flv===3?5:[6,7];
      const pool=EX.filter(e=>e.ty==='flu'&&e.ph).filter(e=>{const w=e.ph.replace(/[¿?¡!,\.]/g,'').split(/\s+/).length;return Array.isArray(wc)?w>=wc[0]&&w<=wc[1]:w===wc});
      let sel=sh(pool).slice(0,40);return sel.map(e=>{const ph=personalize(e.ph,u);const q=ph.split(/\s+/).length<=3?'¿Cómo dices esto?':'¿Cómo se dice?';
        if(slv===4&&Math.random()>0.5){const words=ph.split(/\s+/);const bi=1+Math.floor(Math.random()*(words.length-2));const blank=words[bi];words[bi]='___';return{...e,ty:'frases_blank',q:'Completa la frase',fu:ph,blank,words,ph:personalize(e.ph,u)}}
        return{...e,ty:'frases',q,fu:ph,ph:personalize(e.ph,u)}})}
    if(section==='contar'){const clv=parseInt(Array.isArray(slv)?slv[0]:slv)||1;let start=1,end=20;if(clv===2){start=20;end=50}else if(clv===3){start=50;end=100}else if(clv>=4){start=1;end=100}
      const firstD=Math.floor((start-1)/10),lastD=Math.floor((end-1)/10);const batches=[];
      for(let d=firstD;d<=lastD;d++){const b=[];for(let c=0;c<10;c++){const n=d*10+c+1;if(n>=start&&n<=end&&n<=100)b.push(n)}if(b.length>0)batches.push(b)}
      // Merge small batches (<5) with next/prev
      for(let i=0;i<batches.length-1;i++){if(batches[i].length<5){batches[i+1]=[...batches[i],...batches[i+1]];batches.splice(i,1);i--}}
      if(batches.length>1&&batches[batches.length-1].length<5){batches[batches.length-2]=[...batches[batches.length-2],...batches[batches.length-1]];batches.pop()}
      return batches.map((b,i)=>({ty:'count',nums:b,id:'cnt_batch_'+i}))}
    if(section==='math'){return genMath(slv).slice(0,30).map((m,i)=>({ty:'math',q:m.q,ans:m.ans,id:'math_'+i}))}
    if(section==='frac'){return genFractions(slv).slice(0,20).map(f=>({ty:'frac',...f}))}
    if(section==='multi'){return genMulti(slv).slice(0,20).map((m,i)=>({ty:'multi',...m,id:'multi_'+i}))}
    if(section==='money'){return genMoney(slv)}
    if(section==='clock'){return genClock(slv)}
    if(section==='calendar'){return genCalendar(slv)}
    if(section==='distribute'){return genDistribute(slv,u)}
    if(section==='writing'){
      // Use escribe preferences to determine levels
      const eCase=loadData('escribe_case','upper');
      const eTypes=loadData('escribe_types',['letras']);
      const eGuide=loadData('escribe_guide',{letras:true,palabras:true,frases:true});
      const lvs=[];
      eTypes.forEach(t=>{
        const guide=eGuide[t]!==false;
        if(t==='letras'){
          if(eCase==='upper')lvs.push(guide?1:2);
          else lvs.push(guide?3:4);
        }else if(t==='palabras'){
          if(eCase==='upper')lvs.push(guide?5:51);
          else lvs.push(guide?52:53);
        }else if(t==='frases'){
          if(eCase==='upper')lvs.push(guide?6:61);
          else lvs.push(guide?62:63);
        }
      });
      if(lvs.length===0)lvs.push(1);
      if(lvs.length===1)return genWriting(lvs[0]);
      const merged=[];lvs.forEach(lv=>{merged.push(...genWriting(lv))});
      return merged.sort(()=>Math.random()-.5)
    }
    if(section==='razona'){return genRazona(slv)}
    if(section==='lee'){return genLee(slv)}
    return[]}
  function startGame(overrideLv){
    // Always re-read level from storage to pick up Settings changes
    // Find the specific module - for Aprende, use curPresLvKeyRef to distinguish between presentations
    const allMods=dynGroups.flatMap(g=>g.modules);
    // Use curPresLvKeyRef for ALL modules (razona/lee have multiple modules with same k)
    const mod=allMods.find(m=>m.lvKey===curPresLvKeyRef.current)||allMods.find(m=>m.k===sec);
    let freshLv=overrideLv||(mod?getModuleLvOrDef(mod.lvKey,mod.defLv):secLv);
    if(import.meta.env.DEV)console.log('[Toki startGame]',{sec,modLvKey:mod?.lvKey,freshLv,overrideLv,secLv});
    // Ensure freshLv is never empty for quiensoy
    if(sec==='quiensoy'&&Array.isArray(freshLv)&&freshLv.length===0)freshLv=[1,2];
    if(sec==='quiensoy'&&!freshLv)freshLv=[1,2];
    // Quiensoy: ALWAYS force both modes [1,2] for inline switch (ignore localStorage)
    const isQS=sec==='quiensoy'||(mod&&mod.lvKey&&mod.lvKey.startsWith('pres_'));
    if(isQS){
      if(!overrideLv)freshLv=[1,2]; // Always both modes - switch is inline
      sec='quiensoy'; // Ensure buildQ gets the right section
      setSec('quiensoy');
    }
    setSecLv(freshLv);setQsChoice(null);
    setQ(buildQ(user,sec,freshLv));setIdx(0);setSt({ok:0,sk:0});setConsec(0);trophy8shown.current=false;setTrophy8(false);timeUpShown.current=false;setShowRocket(true)}
  function onRocketDone(){setShowRocket(false);setSs(Date.now());setScr('game');sayFB('¡Vamos allá '+(user?.name||'crack')+'!')}
  // No longer auto-finish on timeUp - let kid continue freely after guided time
  const timeUpShown=useRef(false);
  useEffect(()=>{if(scr!=='game'||!ss)return;const ch=setInterval(()=>{if(timeUp()&&!timeUpShown.current){timeUpShown.current=true;setTrophy8(true);victoryBeeps();sayFB('¡Lo has hecho genial! ¿Quieres seguir?')}},2000);return()=>clearInterval(ch)},[scr,ss,elapsedSt]);
  useEffect(()=>{if(scr==='game'&&ss&&elapsedSt>=8&&!trophy8shown.current){trophy8shown.current=true;setTrophy8(true);victoryBeeps()}},[elapsedSt,scr,ss]);
  function saveP(u){const uLv=u.maxLv||u.level||1;const cur=EX.filter(e=>e.lv===uLv);const mas=cur.filter(e=>u.srs&&u.srs[e.id]&&u.srs[e.id].lv>=3).length;if(cur.length>0&&mas/cur.length>=.8&&uLv<5)u.maxLv=uLv+1;u.level=u.maxLv||u.level||1;setProfs(p=>p.map(x=>x.id===u.id?u:x))}
  function onOk(){pokeActive();setConf(true);setConsec(0);setMascotMood('happy');setTimeout(()=>{setConf(false);setMascotMood('idle')},2400);const e=queue[idx];const up=srsUp(e.id,true,user);up.totalStars3plus=(up.totalStars3plus||0)+1;setUser(up);saveP(up);const nextSt={ok:st.ok+1,sk:st.sk};setSt(nextSt);if(user&&sec){addGroupProgress(user.id,dynGroups.find(g=>g.modules.some(m=>m.k===sec))?.id||sec)}setTimeout(()=>{if(idx+1>=queue.length)fin(nextSt);else setIdx(idx+1)},200)}
  function onSk(){stopVoice();pokeActive();setMascotMood('sad');setTimeout(()=>setMascotMood('idle'),1500);const e=queue[idx];const up=srsUp(e.id,false,user);setUser(up);saveP(up);const nf=consec+1;setConsec(nf);const nextSt={ok:st.ok,sk:st.sk+1};setSt(nextSt);if(nf>=3&&(user.maxLv||user.level||1)>1)setShowLvAdj(true);else{if(idx+1>=queue.length)fin(nextSt);else setIdx(idx+1)}}
  function doLvDn(){const up={...user,maxLv:Math.max(1,(user.maxLv||user.level||1)-1),level:Math.max(1,(user.maxLv||user.level||1)-1)};setUser(up);saveP(up);setShowLvAdj(false);setConsec(0);if(idx+1>=queue.length)fin(st);else setIdx(idx+1)}
  function fin(s){const f=s||st;const amin=Math.floor(activeMs.current/60000);const rec={ok:f.ok,sk:f.sk,dt:tdy(),min:amin};const up={...user,hist:[...(user.hist||[]),rec]};setUser(up);saveP(up);setSs(null);setOv('done')}
  function tryExit(){stopVoice();if(freeChoice){setScr('goals')}else{setOv('pin');setPi('')}}
  function chgLv(n){const up={...user,maxLv:n,level:n};setUser(up);saveP(up)}
  const cur=queue[idx];const vids=useMemo(()=>(user?.voices||[]).map(v=>v.id),[user?.voices]);const elapsed=elapsedSt;

  return <div onClick={tU} onTouchStart={tU}><style>{CSS}</style>{photoCrop&&<PhotoCropOverlay imageSrc={photoCrop.src} onSave={photoCrop.onSave} onCancel={photoCrop.onCancel||(() =>setPhotoCrop(null))} shape={photoCrop.shape||'circle'}/>}{scr==='game'&&user&&<EmergencyButton user={user} personas={personas} supPin={supPin}/>}<Confetti show={conf}/><RocketTransition show={showRocket} onDone={onRocketDone} avatar={user?.photo||avStr(user?.av)} planetEmoji={dynGroups.find(g=>g.modules.some(m=>m.k===sec))?.emoji} planetColor={(()=>{const PCOL={aprende:'#E91E63',dilo:'#4CAF50',cuenta:'#FF9800',razona:'#42A5F5',escribe:'#AB47BC',lee:'#EF5350'};const gid=dynGroups.find(g=>g.modules.some(m=>m.k===sec))?.id;return PCOL[gid]||'#42A5F5'})()}/>
    {showRec&&user&&<VoiceRec user={user} fbUser={fbUser} onBack={()=>setShowRec(false)} onSave={up=>{setUser(up);saveP(up);setShowRec(false)}}/>}
    {trophy8&&<div className="ov" onClick={()=>setTrophy8(false)}><div className="ovp ab"><div style={{fontSize:80,marginBottom:12}}>🏆</div><h2 style={{fontSize:24,color:GOLD,margin:'0 0 8px'}}>¡Lo has hecho genial!</h2><p style={{fontSize:18,color:GREEN,fontWeight:700,margin:'0 0 6px'}}>Ejercicios: {st.ok} correctos</p><p style={{fontSize:16,color:DIM,margin:'0 0 16px'}}>de {st.ok+st.sk} intentados</p><Confetti show={true}/><button className="btn btn-gold" onClick={()=>setTrophy8(false)} style={{fontSize:20}}>¡Sigo!</button></div></div>}
    {showLvAdj&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>🤔</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 10px'}}>¿Bajamos el nivel?</p><div style={{display:'flex',gap:10}}><button className="btn btn-g" style={{flex:1}} onClick={doLvDn}>Sí</button><button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setShowLvAdj(false);setConsec(0);if(idx+1>=queue.length)fin(st);else setIdx(idx+1)}}>No</button></div></div></div>}
    {/* qsChoice modal eliminated - switch is now inline in ExQuienSoyUnified */}
    {ov==='admin'&&fbUser&&fbUser.email===ADMIN_EMAIL&&<div className="ov" onClick={()=>setOv(null)}><div className="ovp" onClick={e=>e.stopPropagation()} style={{maxWidth:500,maxHeight:'80vh',overflowY:'auto'}}>
      <div style={{fontSize:48,marginBottom:8}}>⚙️</div>
      <h2 style={{fontSize:22,color:PURPLE,margin:'0 0 16px'}}>Panel de Administración</h2>
      <p style={{fontSize:14,color:DIM,margin:'0 0 12px'}}>Usuarios registrados: {cloudUsers.length}</p>
      {cloudUsers.map(u=><div key={u.uid} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:12,border:'2px solid '+BORDER,marginBottom:8,background:u.revoked?RED+'11':CARD}}>
        <div style={{flex:1}}><p style={{fontSize:16,fontWeight:600,margin:0,color:u.revoked?RED:TXT}}>{u.email||'Sin email'}</p>
          <p style={{fontSize:12,color:DIM,margin:'2px 0 0'}}>{u.profiles?.length||0} perfiles {u.revoked?' — REVOCADO':''}</p></div>
        {u.email!==ADMIN_EMAIL&&(u.revoked
          ?<button onClick={async()=>{await cloudUnrevokeUser(u.uid);setCloudUsers(await cloudListUsers())}} style={{background:GREEN+'22',border:'2px solid '+GREEN+'44',borderRadius:10,padding:'8px 14px',color:GREEN,fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'",fontWeight:600}}>Activar</button>
          :<button onClick={async()=>{await cloudRevokeUser(u.uid);setCloudUsers(await cloudListUsers())}} style={{background:RED+'22',border:'2px solid '+RED+'44',borderRadius:10,padding:'8px 14px',color:RED,fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'",fontWeight:600}}>Revocar</button>
        )}
      </div>)}
      <button className="btn btn-ghost" onClick={()=>setOv(null)} style={{marginTop:12}}>Cerrar</button>
    </div></div>}
    {ov==='pin'&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>🔒</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px'}}>PIN del supervisor</p><NumPad value={pi} onChange={setPi} onSubmit={()=>{if(pi===supPin){setOv(null);setScr('goals')}else{setPe(true);setPi('');setTimeout(()=>setPe(false),1500)}}} maxLen={4}/>{pe&&<p style={{fontSize:16,color:RED,fontWeight:600,margin:'8px 0 0'}}>PIN incorrecto</p>}<button className="btn btn-ghost" style={{marginTop:12}} onClick={()=>setOv(null)}>Volver</button></div></div>}
    {ov==='done'&&<DoneScreen st={st} elapsed={elapsed} user={user} supPin={supPin} onExit={(action)=>{setOv(null);setMascotMood('idle');if(action==='repeat'){startGame()}else{setScr('goals')}}}/>}
    {ov==='parentGate'&&user&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>👨‍👩‍👦</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px'}}>Panel de Supervisor</p><p style={{fontSize:14,color:DIM,margin:'0 0 14px'}}>Introduce el PIN</p><NumPad value={parentPin} onChange={setParentPin} onSubmit={()=>{if(!supPin||parentPin===supPin){setParentPin('');setSupervisorMode(true);clearTimeout(supervisorTimer.current);supervisorTimer.current=setTimeout(()=>setSupervisorMode(false),600000);setOv('parent')}else{setPe(true);setParentPin('');setTimeout(()=>setPe(false),1500)}}} maxLen={4}/>{pe&&<p style={{fontSize:16,color:RED,fontWeight:600,margin:'8px 0 0'}}>PIN incorrecto</p>}<button className="btn btn-ghost" style={{marginTop:12}} onClick={()=>{setOv(null);setParentPin('')}}>Cancelar</button></div></div>}
    {ov==='parent'&&user&&<Settings user={user} setUser={setUser} saveP={saveP} supPin={supPin} setSupPin={setSupPin} pp={pp} setPp={setPp} sm={sm} setSm={setSm} sec={sec} setSec={setSec} secLv={secLv} setSecLv={setSecLv} freeChoice={freeChoice} setFreeChoice={setFreeChoice} activeMods={activeMods} setActiveMods={setActiveMods} openSection={openSection} setOpenSection={setOpenSection} ptab={ptab} setPtab={setPtab} theme={theme} setTheme={setTheme} rocketColor={rocketColor} setRocketColor={setRocketColor} exigencia={exigencia} setExigencia={setExigencia} maxDaily={maxDaily} setMaxDaily={setMaxDaily} sessionMode={sessionMode} setSessionMode={setSessionMode} guidedTasks={guidedTasks} setGuidedTasks={setGuidedTasks} escribeCase={escribeCase} setEscribeCase={setEscribeCase} escribeTypes={escribeTypes} setEscribeTypes={setEscribeTypes} escribeGuide={escribeGuide} setEscribeGuide={setEscribeGuide} escribePauta={escribePauta} setEscribePauta={setEscribePauta} personas={personas} savePersonas={savePersonas} setOv={setOv} setOpenGroup={setOpenGroup} setPhotoCrop={setPhotoCrop} setShowRec={setShowRec} delConf={delConf} setDelConf={setDelConf} delPersonaIdx={delPersonaIdx} setDelPersonaIdx={setDelPersonaIdx} presEdit={presEdit} setPresEdit={setPresEdit} presNewMode={presNewMode} setPresNewMode={setPresNewMode} presDelIdx={presDelIdx} setPresDelIdx={setPresDelIdx} shareCode={shareCode} setShareCode={setShareCode} shareMsg={shareMsg} setShareMsg={setShareMsg} fbUser={fbUser} hasConfig={hasConfig} pOpenPlanet={pOpenPlanet} setPOpenPlanet={setPOpenPlanet} setProfs={setProfs} setScr={setScr} helmetMode={helmetMode} setHelmetMode={setHelmetMode} showHelmet={showHelmet} dynGroups={dynGroups}/>}

    {scr==='setup'&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:80,marginBottom:8,animation:'glow 3s infinite'}}>🗣️</div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p>
      <div className="card" style={{padding:24,textAlign:'left',marginBottom:16}}>
        <p style={{fontSize:20,color:GOLD,fontWeight:700,textAlign:'center',margin:'0 0 16px'}}>Configuración inicial</p>
        <p style={{fontSize:15,color:DIM,margin:'0 0 14px'}}>Este PIN lo usará el supervisor (padre, madre o tutor) para gestionar la app. El niño no podrá salir sin él.</p>
        <label style={{fontSize:16,fontWeight:600,color:TXT}}>🔒 {pinStep==='enter'?'Elige un PIN (4 dígitos)':'Confirma el PIN'}</label>
        {pinErr&&<p style={{fontSize:14,color:RED,fontWeight:600,margin:'8px 0 0',textAlign:'center'}}>{pinErr}</p>}
        <div style={{display:'flex',justifyContent:'center',margin:'10px 0 20px'}}><NumPad value={supInp} onChange={v=>{setSupInp(v);setPinErr('')}} onSubmit={()=>{
          if(supInp.length!==4)return;
          if(pinStep==='enter'){setPinFirst(supInp);setSupInp('');setPinStep('confirm')}
          else{
            if(supInp===pinFirst){setSupPin(supInp);saveData('sup_pin',supInp);setSupInp('');setPinStep('enter');setPinFirst('');setScr('login')}
            else{setPinErr('Los PIN no coinciden. Inténtalo de nuevo.');setSupInp('');setPinStep('enter');setPinFirst('')}
          }
        }} maxLen={4}/></div>
        {pinStep==='confirm'&&<p style={{fontSize:14,color:GOLD,fontWeight:600,textAlign:'center',margin:'-10px 0 10px'}}>Escríbelo otra vez para confirmar</p>}
        <div style={{background:BLUE+'15',border:'2px solid '+BLUE+'33',borderRadius:14,padding:16,marginBottom:16}}>
          <p style={{fontSize:16,fontWeight:600,margin:'0 0 8px'}}>🎤 Permiso del micrófono</p>
          <p style={{fontSize:14,color:DIM,margin:'0 0 12px'}}>Toki necesita el micrófono para escuchar al niño. Sin él, la app no funciona.</p>
          {!micOk?<button className="btn btn-b" onClick={()=>{navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop());setMicOk(true)}).catch(()=>alert('No se ha podido activar el micrófono. Revisa los permisos del navegador.'))}} style={{fontSize:18}}>🎤 Activar micrófono</button>
          :<p style={{fontSize:18,color:GREEN,fontWeight:700,margin:0}}>✅ Micrófono activado</p>}
        </div>
        {supInp.length<4&&pinStep==='enter'&&<p style={{fontSize:13,color:DIM,textAlign:'center',margin:'10px 0 0'}}>Escribe 4 dígitos para el PIN</p>}
      </div>
      <p style={{color:DIM+'99',fontSize:13,position:'fixed',bottom:10,left:0,right:0,textAlign:'center'}}><b>Toki &middot; Aprende a decirlo</b> by Diego Aroca &copy; 2026 &mdash; {VER}</p>
    </div>}

    {/* Firebase Auth Gate — shown when hasConfig && not yet authenticated */}
    {scr==='login'&&hasConfig&&fbMode==='auth'&&!fbUser&&!fbLoading&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:80,marginBottom:8,animation:'glow 3s infinite'}}>🗣️</div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p>
      {authScreen==='choice'&&<div style={{display:'flex',flexDirection:'column',gap:14,maxWidth:340,margin:'0 auto'}}>
        <button className="btn btn-gold" onClick={enterGuest} style={{fontSize:22,padding:'18px 24px'}}>👤 Invitado</button>
        <p style={{fontSize:14,color:DIM,margin:0}}>Sin cuenta — datos solo en este dispositivo</p>
        <div style={{borderTop:'1px solid '+BORDER,margin:'8px 0'}}/>
        <button onClick={async()=>{setAuthBusy(true);setAuthErr('');try{await fbSignInWithGoogle();setAuthScreen('choice')}catch(e){setAuthErr(e.message)}finally{setAuthBusy(false)}}} style={{fontSize:20,padding:'16px 24px',background:'#fff',color:'#333',border:'2px solid #ddd',borderRadius:16,cursor:'pointer',fontFamily:"'Fredoka'",fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:10}} disabled={authBusy}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.8 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.7-3.6-11.3-8.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C36.8 39.3 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/></svg>
          Acceder con Google
        </button>
        <div style={{display:'flex',alignItems:'center',gap:10,margin:'4px 0'}}><div style={{flex:1,height:1,background:BORDER}}/><span style={{color:DIM,fontSize:13}}>o con email</span><div style={{flex:1,height:1,background:BORDER}}/></div>
        <button className="btn btn-b" onClick={()=>{setAuthScreen('login');setAuthErr('')}} style={{fontSize:20,padding:'16px 24px'}}>🔑 Iniciar sesión</button>
        <button className="btn btn-p" onClick={()=>{setAuthScreen('register');setAuthErr('')}} style={{fontSize:20,padding:'16px 24px'}}>📝 Crear cuenta</button>
      </div>}
      {authScreen==='login'&&<div style={{maxWidth:360,margin:'0 auto'}} className="af">
        <h2 style={{fontSize:24,color:GOLD,margin:'0 0 16px'}}>Iniciar sesión</h2>
        <input className="inp" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} type="email" placeholder="Email" style={{marginBottom:12,fontSize:18,padding:14}}/>
        <input className="inp" value={authPass} onChange={e=>setAuthPass(e.target.value)} type="password" placeholder="Contraseña" style={{marginBottom:12,fontSize:18,padding:14}} onKeyDown={e=>{if(e.key==='Enter')handleLogin()}}/>
        {authErr&&<p style={{color:RED,fontSize:15,fontWeight:600,margin:'0 0 10px'}}>{authErr}</p>}
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setAuthScreen('choice');setAuthErr('')}}>← Volver</button>
          <button className="btn btn-g" style={{flex:2}} disabled={authBusy||!authEmail.trim()||!authPass} onClick={handleLogin}>{authBusy?'...':'Entrar'}</button>
        </div>
      </div>}
      {authScreen==='register'&&<div style={{maxWidth:360,margin:'0 auto'}} className="af">
        <h2 style={{fontSize:24,color:GOLD,margin:'0 0 16px'}}>Crear cuenta</h2>
        <input className="inp" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} type="email" placeholder="Email" style={{marginBottom:12,fontSize:18,padding:14}}/>
        <input className="inp" value={authPass} onChange={e=>setAuthPass(e.target.value)} type="password" placeholder="Contraseña (mín. 6 caracteres)" style={{marginBottom:12,fontSize:18,padding:14}} onKeyDown={e=>{if(e.key==='Enter')handleRegister()}}/>
        {authErr&&<p style={{color:RED,fontSize:15,fontWeight:600,margin:'0 0 10px'}}>{authErr}</p>}
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setAuthScreen('choice');setAuthErr('')}}>← Volver</button>
          <button className="btn btn-g" style={{flex:2}} disabled={authBusy||!authEmail.trim()||!authPass} onClick={handleRegister}>{authBusy?'...':'Crear'}</button>
        </div>
        <p style={{fontSize:13,color:DIM,margin:'12px 0 0'}}>No necesitas aprobación. Tu cuenta se activa al instante.</p>
      </div>}
      <p style={{color:DIM+'99',fontSize:13,position:'fixed',bottom:10,left:0,right:0,textAlign:'center'}}><b>Toki &middot; Aprende a decirlo</b> by Diego Aroca &copy; 2026 &mdash; {VER}</p>
    </div>}
    {/* Revoked user screen */}
    {scr==='login'&&hasConfig&&revoked&&fbUser&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:80,marginBottom:16}}>🚫</div>
      <h2 style={{fontSize:24,color:RED,margin:'0 0 12px'}}>Cuenta suspendida</h2>
      <p style={{fontSize:16,color:DIM,margin:'0 0 20px'}}>El administrador ha revocado el acceso de esta cuenta.</p>
      <button className="btn btn-ghost" onClick={handleLogout} style={{fontSize:18}}>Cerrar sesión</button>
    </div>}
    {/* Firebase loading state */}
    {scr==='login'&&hasConfig&&fbLoading&&<div className="af" style={{textAlign:'center',padding:'40px 0'}}><div style={{fontSize:48,animation:'pulse 1.5s infinite'}}>🗣️</div><p style={{color:DIM,fontSize:16,margin:'16px 0 0'}}>Cargando...</p></div>}
    {/* Normal login screen — shown when guest mode, no Firebase, or already authenticated */}
    {scr==='login'&&(!hasConfig||fbMode==='guest'||fbMode==='cloud')&&!revoked&&!fbLoading&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:80,marginBottom:8,animation:'glow 3s infinite'}}>🗣️</div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p>
      {/* Cloud status badge */}
      {fbUser&&fbMode==='cloud'&&<div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:16}}>
        <div style={{background:GREEN+'22',border:'2px solid '+GREEN+'44',borderRadius:20,padding:'6px 16px',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:13,color:GREEN,fontWeight:600}}>☁️ {fbUser.email}</span>
          <button onClick={handleLogout} style={{background:'none',border:'none',color:DIM,fontSize:12,cursor:'pointer',fontFamily:"'Fredoka'",textDecoration:'underline'}}>Salir</button>
        </div>
        {fbUser.email===ADMIN_EMAIL&&<button onClick={async()=>{setCloudUsers(await cloudListUsers());setAuthScreen('admin');setOv('admin')}} style={{background:PURPLE+'22',border:'2px solid '+PURPLE+'44',borderRadius:20,padding:'6px 12px',color:PURPLE,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Fredoka'"}} title="Panel admin">⚙️ Admin</button>}
      </div>}
      {!fbUser&&hasConfig&&<button onClick={()=>{setFbMode('auth');setAuthScreen('choice')}} style={{background:'none',border:'none',color:BLUE,fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'",textDecoration:'underline',marginBottom:16,display:'block',margin:'0 auto 16px'}}>🔑 Iniciar sesión / Crear cuenta</button>}
      <p style={{color:DIM+'99',fontSize:13,position:'fixed',bottom:10,left:0,right:0,textAlign:'center'}}><b>Toki &middot; Aprende a decirlo</b> by Diego Aroca &copy; 2026 &mdash; {VER}</p>
      {profs.length>0&&!creating&&(()=>{
        const selProf=hoveredProf;
        const isCompact=profs.length>=5;
        const profSize=isCompact?70:profs.length>=3?100:130;
        const profFontSize=isCompact?28:profs.length>=3?42:56;
        return <div style={{display:isCompact?'grid':'flex',gridTemplateColumns:isCompact?'repeat(auto-fill,minmax(100px,1fr))':'none',justifyContent:isCompact?'center':'center',justifyItems:isCompact?'center':'initial',gap:isCompact?12:profs.length>=3?18:28,marginBottom:28,flexWrap:'wrap',position:'relative',minHeight:isCompact?120:300,maxWidth:isCompact?500:'none',margin:isCompact?'0 auto 28px':'0'}}>
        {profs.map((p,pi)=>{
          const isHovered=selProf===pi;
          const myPersonas=personas.filter(pp=>pp.name&&pp.name.trim());
          const pN=myPersonas.length;
          const pOrbitR=isCompact?70:profs.length>=3?85:120;const pSize=isCompact?30:profs.length>=3?36:48;
          return <button key={p.id}
            onMouseEnter={()=>setHoveredProf(pi)} onMouseLeave={()=>setHoveredProf(null)}
            onTouchStart={()=>setHoveredProf(pi)}
            onClick={()=>{setUser(p);setSm(p.sessionMin||25);setSec(p.sec||'decir');setSecLv(p.secLv||1);setFreeChoice(true);setVoiceProfile(p.age,p.sex);setScr('goals')}} style={{
            background:'none',border:'none',cursor:'pointer',fontFamily:"'Fredoka'",color:TXT,
            display:'flex',flexDirection:'column',alignItems:'center',gap:isCompact?3:6,padding:0,
            transition:'transform .4s cubic-bezier(.34,1.56,.64,1)',position:'relative',
            transform:isHovered&&!isCompact?'scale(1.1)':'scale(1)',zIndex:isHovered?10:1,
          }}>
            {/* Personas orbit — only show for hovered profile, not in compact mode */}
            {pN>0&&isHovered&&!isCompact&&<div style={{position:'absolute',top:'50%',left:'50%',width:0,height:0,zIndex:0,marginTop:-10}}>
              <svg style={{position:'absolute',left:-pOrbitR,top:-pOrbitR*0.5,width:pOrbitR*2,height:pOrbitR,pointerEvents:'none',overflow:'visible'}}>
                <ellipse cx={pOrbitR} cy={pOrbitR*0.5} rx={pOrbitR} ry={pOrbitR*0.45} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" strokeDasharray="4 3"/>
              </svg>
              {myPersonas.map((pp,i)=>{
                const angle=(360/pN)*i - 45;const rad=angle*Math.PI/180;
                const px=pOrbitR*Math.cos(rad);const py=pOrbitR*0.45*Math.sin(rad);
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
                  <AstronautAvatar photo={pp.photo} emoji={pp.avatar||'👤'} size={pSize-4} helmet={showHelmet} style={{margin:2}}/>
                  <span style={{position:'absolute',bottom:-16,fontSize:11,color:'#E8E8F0',fontWeight:500,whiteSpace:'nowrap',textShadow:'0 1px 3px rgba(0,0,0,.5)'}}>{pp.name}</span>
                </div>})}
            </div>}
            <div style={{animation:isCompact?'none':'planetFloat 4s ease-in-out infinite',animationDelay:(pi*0.7)+'s',position:'relative',zIndex:1}}>
              <AstronautAvatar photo={p.photo} emoji={avStr(p.av)} size={profSize} helmet={showHelmet}/>
            </div>
            <div style={{fontSize:isCompact?14:profs.length>=3?16:20,fontWeight:600,position:'relative',zIndex:1}}>{p.name}</div>
            <div style={{fontSize:isCompact?11:profs.length>=3?12:14,color:DIM,position:'relative',zIndex:1}}>{p.age} años</div>
          </button>})}
        </div>})()}
      {profs.length<15&&!creating&&<button onClick={()=>setCreating(true)} style={{
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
        <div style={{borderTop:'1px solid '+BORDER,paddingTop:14,marginBottom:14}}><p style={{fontSize:14,color:DIM,margin:'0 0 8px'}}>La familia y amigos se configuran después en Mis Personas</p>
        <label style={{fontSize:16,color:DIM}}>Teléfono de emergencia</label><input className="inp" value={fTel} onChange={e=>setFTel(e.target.value)} type="tel" placeholder="Ej: 6.1.2.3.4.5.6.7.8" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:16,color:DIM}}>Dirección de casa</label><input className="inp" value={fDir} onChange={e=>setFDir(e.target.value)} placeholder="Ej: Calle Mayor 10, Madrid" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:16,color:DIM}}>Apellidos</label><input className="inp" value={fApellidos} onChange={e=>setFApellidos(e.target.value)} placeholder="Ej: García López" style={{marginBottom:10,marginTop:4,fontSize:17}}/>
        <label style={{fontSize:16,color:DIM}}>{(()=>{const bd=new Date(fa),now=new Date(),age=fa?Math.floor((now-bd)/31557600000):0;return age>=16?'🏢 Centro formación / Trabajo':'🏫 Colegio'})()}</label><input className="inp" value={fColegio} onChange={e=>setFColegio(e.target.value)} placeholder={(()=>{const bd=new Date(fa),now=new Date(),age=fa?Math.floor((now-bd)/31557600000):0;return age>=16?'Ej: Centro ocupacional / Empresa':'Ej: CEIP San José'})()} style={{marginBottom:14,marginTop:4,fontSize:17}}/></div>
        <label style={{fontSize:15,color:DIM}}>Avatar</label>
        <div style={{display:'flex',alignItems:'center',gap:14,margin:'10px 0 8px',justifyContent:'center'}}>
          <AstronautAvatar photo={fPhoto} emoji={fav} size={72} helmet={showHelmet}/>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <button className="btn btn-b" style={{fontSize:14,padding:'8px 14px',width:'auto'}} onClick={()=>{const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.onchange=async e=>{const f=e.target.files[0];if(!f)return;const b64=await processImage(f);if(b64)setPhotoCrop({src:b64,onSave:cropped=>{setFPhoto(cropped);setPhotoCrop(null)},onCancel:()=>setPhotoCrop(null)})};inp.click()}}>📷 Foto</button>
            {fPhoto&&<button className="btn btn-ghost" style={{fontSize:12,padding:'4px 10px',width:'auto'}} onClick={()=>setFPhoto(null)}>✕ Quitar</button>}
          </div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',margin:'6px 0 18px'}}>{AVS.map(a=><button key={a} className={'avbtn'+(fav===a?' on':'')} onClick={()=>setFav(a)}>{a}</button>)}</div>
        <div style={{display:'flex',gap:10}}><button className="btn btn-ghost" style={{flex:1}} onClick={()=>setCreating(false)}>Cancelar</button><button className="btn btn-g" style={{flex:2}} disabled={!fn.trim()||!fa} onClick={()=>{const bd=new Date(fa),now=new Date(),age=Math.floor((now-bd)/31557600000);const p={id:Date.now()+'',name:cap(fn.trim()),birthdate:fa,age:Math.max(1,age),sex:fsex,av:fav,photo:fPhoto||null,hist:[],srs:{},level:1,maxLv:1,sessionMin:25,voices:[],padre:'',madre:'',hermanos:'',amigos:'',telefono:fTel.trim(),direccion:fDir.trim(),apellidos:fApellidos.trim(),colegio:fColegio.trim()};
                // Auto-generate default presentation from user data and personas
                const gen=generateAutoPresentation(p,personas);
                if(gen.lines.length>0)p.presentations=[{name:'Quién Soy',date:new Date().toISOString().slice(0,10),lines:gen.lines,slides:gen.slides,auto:true}];
                setProfs(prev=>[...prev,p]);setUser(p);setCreating(false);setFn('');setFa('');setFTel('');setFDir('');setFApellidos('');setFColegio('');setFPhoto(null);setVoiceProfile(Math.max(1,age),fsex);setScr('goals')}}>Crear ✓</button></div></div>}
    </div>}

    {showMiCielo&&<MiCielo user={user} onClose={()=>setShowMiCielo(false)}/>}
    {scr==='goals'&&user&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><button style={{background:'none',border:'none',color:DIM,fontSize:16,padding:'10px 8px',minHeight:44,cursor:'pointer',fontFamily:"'Fredoka'"}} onClick={()=>{if(openGroup){setOpenGroup(null)}else{setScr('login');setUser(null);setOpenGroup(null)}}}>{openGroup?'← Volver':'← Cambiar perfil'}</button><div style={{display:'flex',gap:12}}><button style={{background:'none',border:'none',color:DIM,fontSize:32,width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',borderRadius:14,padding:0}} onClick={()=>{setParentPinOk(false);setParentPin('');setPp(supPin||'');setSm(user.sessionMin||25);setSec(user.sec||sec);setSecLv(user.secLv||secLv);setFreeChoice(user.freeChoice!==false);setPtab('config');setDelConf(false);setSupervisorMode(true);clearTimeout(supervisorTimer.current);supervisorTimer.current=setTimeout(()=>setSupervisorMode(false),600000);setOv('parent')}}>⚙️</button></div></div>
      <div style={{textAlign:'center',padding:'4px 0 2px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:2}}>
          <AstronautAvatar photo={user.photo} emoji={avStr(user.av)} size={44} helmet={showHelmet}/>
          <SpaceMascot mood={mascotMood} size={36}/>
          <div><h2 style={{fontSize:18,margin:0,color:'#FFF',textShadow:'0 1px 6px rgba(0,0,0,.6)',textAlign:'left'}}>{getGreeting(user.name)}</h2><p style={{fontSize:12,color:'rgba(255,255,255,.8)',textShadow:'0 1px 4px rgba(0,0,0,.5)',margin:0,textAlign:'left'}}>⏱️ Sesión {sm===0?'∞':'de '+sm+' min'}</p></div>
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:4}}>
          <button onClick={()=>setShowMiCielo(true)} style={{background:CARD,border:'2px solid '+BORDER,borderRadius:12,padding:'8px 14px',minHeight:44,cursor:'pointer',fontFamily:"'Fredoka'",display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:16}}>🌌</span><span style={{fontSize:14,color:GOLD,fontWeight:700}}>{totalStars} ⭐</span></button>
          {streak>1&&<div style={{background:CARD,border:'2px solid '+BORDER,borderRadius:12,padding:'6px 14px',display:'flex',alignItems:'center',gap:6}}><span style={{fontSize:18}}>🔥</span><span style={{fontSize:14,color:'#E67E22',fontWeight:700}}>{streak} días</span></div>}
        </div>
      </div>
      {freeChoice?(()=>{
        const visibleGroups=dynGroups.filter(g=>g.modules.some(m=>activeMods[m.lvKey]!==false));
        const PLANET_COLORS={
          aprende:['#F8BBD0','#E91E63','#AD1457'],
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
          const allGroups=dynGroups;
          const n=allGroups.length;
          const orbitR=160;const scX=1.8;const scY=0.7;const tilt=-8;
          const planetSize=82;
          const cW=orbitR*2*scX+planetSize+50;const cH=orbitR*2*scY+planetSize+70;
          const orbitDuration=60;
          return <div style={{position:'relative',width:cW,height:cH,margin:'0 auto'}}>
            {/* Center: rocket (decorative — must open a planet first) */}
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:2,
              padding:0,
              display:'flex',flexDirection:'column',alignItems:'center',gap:0,fontFamily:"'Fredoka'",
            }}>
              <span style={{fontSize:72,filter:'drop-shadow(0 4px 12px rgba(0,0,0,.5))',animation:'planetFloat 3s ease-in-out infinite',display:'block'}}>🚀</span>
            </div>
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
                  return <button key={g.id} disabled={!hasActive} onClick={()=>{if(!hasActive)return;setOpenGroup(g.id);const firstMod=g.modules.find(m=>activeMods[m.lvKey]!==false);if(firstMod){setSec(firstMod.k);setSecLv(getModuleLvOrDef(firstMod.lvKey,firstMod.defLv));if(firstMod.lvKey)curPresLvKeyRef.current=firstMod.lvKey}}} style={{
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
                      <div style={{fontSize:13,fontWeight:700,textShadow:'0 1px 6px rgba(0,0,0,.7), 0 0 10px rgba(0,0,0,.4)',lineHeight:1.1,textAlign:'center',whiteSpace:'nowrap'}}>{g.name}</div>
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
              return <button key={g.id} onClick={()=>{setOpenGroup(g.id);const firstMod=g.modules.find(m=>activeMods[m.lvKey]!==false);if(firstMod){setSec(firstMod.k);setSecLv(getModuleLvOrDef(firstMod.lvKey,firstMod.defLv));if(firstMod.lvKey)curPresLvKeyRef.current=firstMod.lvKey}}} style={{
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
            const enabledMods=openG.modules.filter(m=>{if(activeMods[m.lvKey]===false)return false;const lv=getModuleLv(m.lvKey);if(lv&&lv.length===0)return false;return true});
            const modCount=enabledMods.length;
            return <div style={{position:'relative',width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
              {/* Back button */}
              <button onClick={()=>setOpenGroup(null)} style={{
                position:'absolute',top:0,left:0,background:'none',border:'none',color:DIM,
                fontSize:18,cursor:'pointer',fontFamily:"'Fredoka'",zIndex:2,padding:'10px 12px',minHeight:44,
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
                  const mLv=getModuleLvOrDef(m.lvKey,m.defLv);
                  const isActive=sec===m.k&&String(secLv)===String(mLv);
                  const subSize=modCount<=3?100:modCount<=5?88:76;
                  return <button key={mi} onClick={()=>{setSec(m.k);setSecLv(mLv);if(m.lvKey)curPresLvKeyRef.current=m.lvKey}} style={{
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
                    <div style={{fontSize:12,fontWeight:600,color:isActive?TXT:'rgba(255,255,255,.75)',textShadow:'0 1px 4px rgba(0,0,0,.6)',textAlign:'center',lineHeight:1.15,transition:'color .25s'}}>{m.l}</div>
                  </button>})}
              </div>
            </div>})()}
        </div>}
      </div>})()
      :<div className="card" style={{padding:24,textAlign:'center',borderColor:GOLD+'55',background:GOLD+'0C'}}>
        <div style={{fontSize:56,marginBottom:8}}>{{quiensoy:'👤',decir:'🎤',frase:'🧱',contar:'🔢',math:'🧮',multi:'✖️',frac:'🍕',money:'💶',clock:'🕐',calendar:'📅',distribute:'🍬',writing:'✏️',razona:'🧠',lee:'📖'}[sec]||'🎤'}</div>
        <h3 style={{fontSize:22,fontWeight:700,margin:'0 0 8px',color:GOLD}}>{{quiensoy:'Quién Soy',decir:'Aprende a decirlo',frase:'Forma la frase',contar:'Cuenta conmigo',math:'Sumas y Restas',multi:'Multiplicaciones',frac:'Fracciones',money:'Monedas y Billetes',clock:'La Hora',calendar:'Calendario',distribute:'Reparte y Cuenta',writing:'Escritura',razona:'¿Dónde está?',lee:'Lectura'}[sec]||sec}</h3>
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

    {scr==='game'&&cur&&<div className="af" onClick={pokeActive} onTouchStart={pokeActive}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><button style={{background:'none',border:'none',color:DIM,fontSize:16,padding:'10px 8px',minHeight:44,cursor:'pointer',fontFamily:"'Fredoka'"}} onClick={tryExit}>✕ Salir</button><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{position:'relative',width:36,height:36}}><SpaceMascot mood={mascotMood} size={36}/></div><span style={{fontSize:14,color:DIM,fontWeight:600}}>⏱️ {elapsed}' / {sm===0?'∞':sm+"'"}</span></div></div>
      <div className="pbar" style={{marginBottom:10}}><div className="pfill" style={{width:sm===0?'0%':Math.min(100,elapsed/sm*100)+'%'}}/></div>
      <Tower placed={st.ok} total={st.ok+st.sk+Math.max(1,queue.length-idx)}/>
      <div style={{marginTop:10}}>
        {cur.ty==='frases'&&<ExFrases ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='frases_blank'&&<ExFrasesBlank ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='sit'&&<ExSit ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='flu'&&<ExFlu ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
        {cur.ty==='count'&&<ExCount ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids}/>}
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
        {cur.ty==='quiensoy'&&<ExQuienSoyUnified ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids} presentation={cur.presentation||null} canToggle={cur.canToggle||false}/>}
        {cur.ty==='quiensoy'&&cur.id==='qs_pres_select'&&<div className="af" style={{textAlign:'center',padding:'24px 18px'}}>
          <div style={{fontSize:72,marginBottom:12}}>🎤</div>
          <h2 style={{fontSize:24,color:GOLD,margin:'0 0 16px'}}>¿Qué presentación?</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12,maxWidth:400,margin:'0 auto'}}>
            {(user.presentations||[]).map((pr,pi)=><button key={pi} className="btn btn-b" onClick={()=>{
              // Replace current queue item with the selected presentation
              setQ(q=>{const nq=[...q];nq[idx]={ty:'quiensoy',id:'qs_pres',text:'Presentación',img:QUIEN_SOY[0].img,presentation:pr};return nq});
              setSelectedPresIdx(pi);
            }} style={{fontSize:20,padding:'18px 20px',textAlign:'left'}}>
              <span style={{fontWeight:700}}>{pr.name}</span>
              <span style={{fontSize:14,color:'rgba(255,255,255,.6)',marginLeft:8}}>{(pr.lines||[]).length} frases</span>
            </button>)}
          </div>
        </div>}
      </div></div>}
  </div>}
