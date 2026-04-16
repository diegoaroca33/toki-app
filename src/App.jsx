// ============================================================
// TOKI · Aprende a decirlo
// © 2026 Diego Aroca. Todos los derechos reservados.
// ============================================================
import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react'
import { AREAS, EX } from './exercises.js'
import { auth, db, storage, hasConfig, fbSignIn, fbSignUp, fbSignOut, fbSignInWithGoogle, fbOnAuth, fbGetProfile, fbSaveProfile, fbUpdateProfile, fbListUsers, fbRevokeUser, fbUnrevokeUser, fbUploadPhoto, fbUploadVoice, fbDeleteFile, compressImage, STORAGE_LIMIT, fbCreateShareCode, fbGetSharedProfile, fbLinkToSharedProfile, fbRevokeShareLink, fbUploadPublicVoice, fbGetBestVoice, fbUploadUserVoice, trimSilence, validateVoiceDuration, track, saveDailyMetrics } from './firebase.js'
import { BG, BG2, BG3, GOLD, GREEN, RED, BLUE, PURPLE, TXT, DIM, CARD, BORDER, VER, ADMIN_EMAIL, SUPPORT_EMAIL, CSS, AVS, CLS, SESSION_TIMES, SESSION_GOALS, PERSONA_RELATIONS, BUILD_OK, PERFECT_T, GOOD_MSG, RETRY_MSG, FAIL_MSG, SHORT_OK, SHORT_FAIL, MODULE_MSG, CHEER_ALL, NUMS_1_100, QUIEN_SOY, LV_OPTS, GROUPS } from './constants.js'
import { isSober, lev, digToText, score, getExigencia, adjScore, cap, saveData, loadData, textKey, personalize, srsUp, needsRev, getModuleLv, getModuleLvOrDef, setModuleLv, beep, countdownBeep, getTimeOfDay, getSkyClass, getGreeting, getStreak, getTotalStars, getGroupProgress, addGroupProgress, getGroupStatus, splitSyllables, rnd, tdy, avStr, pickMsg, mkPerfect, cheerIdx, getGroupsForUser, getMascotTier, getMascotCycle, CYCLE_COLORS, CYCLE_NAMES, getDynamicDilo, getDynamicDiloLevel, pushDynamicDiloResult, checkDynamicDiloLevel, getDynamicDiloSessions, setDynamicDiloSessions, getDogGrowth, getDogPhase, canFeedDog, feedDog, getDogLastFed, getRecentExerciseKeys, markExerciseUsed, getDailyCount, addDailyCount, getDailyPhase, gatherSettings, applySettings } from './utils.js'
import { voiceProfile, cachedVoice, setVoiceProfile, getVP, pickVoice, say, sayFB, sayFast, stopVoice, warmUpTTS, startTTSKeepAlive, stopTTSKeepAlive, _publicVoiceCache, playRec, playRecLocal, SR_AVAILABLE, useSR, listenQuick, starBeep, victoryJingle, cheerOrSay } from './voice.js'
import { processImage, cloudSaveProfile, cloudLoadProfile, cloudListUsers, cloudRevokeUser, cloudUnrevokeUser, generateAutoPresentation } from './cloud.js'
import { SpaceMascot, Confetti, Ring, Tower, RecBtn, useIdle, NumPad, AbacusHelp, AstronautAvatar, DogMascot, getSeason, AstronautDaily, AstronautOverlay } from './components/UIKit.jsx'
import { RocketTransition } from './components/RocketTransition.jsx'
import { CelebrationOverlay, Stars } from './components/CelebrationOverlay.jsx'
import { PhotoCropOverlay } from './components/PhotoCropOverlay.jsx'
import { EmergencyButton } from './components/EmergencyButton.jsx'
import { SpeakPanel, ExFlu, ExFrases, ExFrasesBlank, ExSit } from './components/SpeakPanel.jsx'
import { ExCount, NUM_BLOCK_COLORS } from './modules/ExCount.jsx'
import { genMath, Fingers, AnimCount } from './modules/ExMath.jsx'
import { genMulti } from './modules/ExMulti.jsx'
import { PieChart, RectChart, genFractions } from './modules/ExFraction.jsx'
import { COINS, BILLS, genMoney } from './modules/ExMoney.jsx'
import { clockText, genClock, ClockFace } from './modules/ExClock.jsx'
import { genCalendar } from './modules/ExCalendar.jsx'
import { genDistribute, BagSVG, CardSVG, dominoDots, DominoSVG } from './modules/ExDistribute.jsx'
import { genWriting, LETTER_STROKE_PATHS, getCustomPhrases } from './modules/ExWriting.jsx'
import { genPatterns, genRazona, SceneSVG, SpatialDrag } from './modules/ExRazona.jsx'
import { genLee } from './modules/ExLee.jsx'
import { QSTimeBar, ExQuienSoyEstudio, ExQuienSoyPres } from './modules/ExQuienSoy.jsx'

const Settings=React.lazy(()=>import('./components/Settings.jsx'))
const DoneScreen=React.lazy(()=>import('./components/DoneScreen.jsx').then(m=>({default:m.default||m.DoneScreen})))
const VoiceRec=React.lazy(()=>import('./components/VoiceRec.jsx').then(m=>({default:m.default||m.VoiceRec})))
const MiCielo=React.lazy(()=>import('./components/MiCielo.jsx').then(m=>({default:m.default||m.MiCielo})))
const TokiPlayground=React.lazy(()=>import('./components/TokiPlayground.jsx'))
const MonthlyReport=React.lazy(()=>import('./components/MonthlyReport.jsx').then(m=>({default:m.default||m.MonthlyReport})))
const ExMath=React.lazy(()=>import('./modules/ExMath.jsx').then(m=>({default:m.ExMath})))
const ExMulti=React.lazy(()=>import('./modules/ExMulti.jsx').then(m=>({default:m.ExMulti})))
const ExFraction=React.lazy(()=>import('./modules/ExFraction.jsx').then(m=>({default:m.ExFraction})))
const ExMoney=React.lazy(()=>import('./modules/ExMoney.jsx').then(m=>({default:m.ExMoney})))
const ExClock=React.lazy(()=>import('./modules/ExClock.jsx').then(m=>({default:m.ExClock})))
const ExCalendar=React.lazy(()=>import('./modules/ExCalendar.jsx').then(m=>({default:m.ExCalendar})))
const ExDistribute=React.lazy(()=>import('./modules/ExDistribute.jsx').then(m=>({default:m.ExDistribute})))
const ExWriting=React.lazy(()=>import('./modules/ExWriting.jsx').then(m=>({default:m.ExWriting})))
const ExRazona=React.lazy(()=>import('./modules/ExRazona.jsx').then(m=>({default:m.ExRazona})))
const ExLee=React.lazy(()=>import('./modules/ExLee.jsx').then(m=>({default:m.ExLee})))
const ExQuienSoyUnified=React.lazy(()=>import('./modules/ExQuienSoy.jsx').then(m=>({default:m.ExQuienSoyUnified})))

function LazyFallback(){return<div style={{minHeight:'40vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:10,background:'#080C18',color:'#fff',fontFamily:"'Fredoka'",borderRadius:24}}><div style={{fontSize:42}}>🐾</div><div style={{fontSize:20,fontWeight:700}}>Cargando...</div></div>}
import { isCheckpointPending } from './components/ControlCheckpoint.jsx'
import TokiWelcome from './components/TokiWelcome.jsx'
import TokiLogoPro from './components/TokiLogoPro.jsx'
// Personas helpers






// ===== NUMPAD — Custom numeric keypad =====

export default function App(){
  const[showWelcome,setShowWelcome]=useState(true);
  const[viewport,setViewport]=useState(()=>({w:typeof window!=='undefined'?window.innerWidth:1280,h:typeof window!=='undefined'?window.innerHeight:800}));
  const[profs,setProfs]=useState(()=>loadData('profiles',[]));const[user,setUser]=useState(null);const[scr,setScr]=useState(()=>loadData('sup_pin',null)?'login':hasConfig?'login':'setup');const[ov,setOv]=useState(null);
  const[supPin,setSupPin]=useState(()=>loadData('sup_pin',null));const[supInp,setSupInp]=useState('');
  const[pinStep,setPinStep]=useState('enter'); // 'enter' | 'confirm'
  const[pinFirst,setPinFirst]=useState(''); // first PIN entry for confirmation
  const[pinErr,setPinErr]=useState(''); // error message for PIN mismatch
  const[queue,setQ]=useState([]);const[idx,setIdx]=useState(0);const[st,setSt]=useState({ok:0,sk:0});const[conf,setConf]=useState(false);
  const[creating,setCreating]=useState(false);const[fn,setFn]=useState('');const[fa,setFa]=useState('');const[fav,setFav]=useState(AVS[0]);const[fsex,setFsex]=useState('m');const[hoveredProf,setHoveredProf]=useState(null);
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
  const[authNick,setAuthNick]=useState('');
  const[acceptTerms,setAcceptTerms]=useState(false);
  const[acceptMarketing,setAcceptMarketing]=useState(false);
  const[showTerms,setShowTerms]=useState(false);
  const[showPrivacy,setShowPrivacy]=useState(false);
  const[cloudNick,setCloudNick]=useState(()=>{try{return localStorage.getItem('toki_cloud_nick')||''}catch(e){return''}});
  const[logoutAsk,setLogoutAsk]=useState(false);
  const[cloudUsers,setCloudUsers]=useState([]);
  const[cloudSyncing,setCloudSyncing]=useState(false);
  const[revoked,setRevoked]=useState(false);
  // Init Firebase lazily if config exists
  const[personas,setPersonas]=useState(()=>{const p=loadData('personas',null);if(p)return p;const def=[{name:'',relation:'Padre',avatar:'👨'},{name:'',relation:'Madre',avatar:'👩'},{name:'',relation:'Hermano',avatar:'👦'},{name:'',relation:'Amigo',avatar:'🧑‍🚀'}];saveData('personas',def);return def});
  function savePersonas(ps){setPersonas(ps);saveData('personas',ps)}
  // Auto-generate presentations and migrate Síndrome de Down (persisted, runs once)
  useEffect(()=>{if(!profs.length)return;let changed=false;const updated=profs.map(p=>{
    const pp={...p};
    // Generate or refresh auto "Quién Soy" presentation when profile data changes
    const gen=generateAutoPresentation(pp,personas);
    if(gen.lines.length>0){
      if(!pp.presentations||!pp.presentations.length){
        pp.presentations=[{name:'Quién Soy',date:new Date().toISOString().slice(0,10),lines:gen.lines,slides:gen.slides,auto:true}];changed=true
      } else {
        // Refresh existing auto presentation with current profile data
        const autoIdx=(pp.presentations||[]).findIndex(pr=>pr.auto);
        if(autoIdx>=0){const old=pp.presentations[autoIdx];const newLines=gen.lines.join('|');const oldLines=(old.lines||[]).join('|');
          if(newLines!==oldLines){pp.presentations[autoIdx]={...old,lines:gen.lines,slides:gen.slides,date:new Date().toISOString().slice(0,10)};changed=true}}
      }
    }
    // Migrate: ensure first 3 presentations have active field
    if(pp.presentations&&pp.presentations.length>0&&pp.presentations.some(pr=>pr.active===undefined)){
      let actCount=0;pp.presentations.forEach((pr,pi)=>{if(pr.active===undefined){pr.active=actCount<3;actCount++}else if(pr.active)actCount++});changed=true}
    // Inject Down syndrome presentation for Guillermo
    if(pp.presentations&&!pp.presentations.some(pr=>pr.specific)&&fbUser&&fbUser.email==='diegoarocavillalba@hotmail.com'&&pp.name&&pp.name.toLowerCase().includes('guillermo')){
      const sdownPres={name:'El Síndrome de Down',date:'2024-01-01',lines:QUIEN_SOY.map(q=>q.text),slides:QUIEN_SOY.map(q=>({text:q.text,img:q.img})),specific:true};
      pp.presentations.forEach(pr=>{if(pr.auto&&pr.name==='Mi presentación')pr.name='Quién Soy'});
      pp.presentations.unshift(sdownPres);changed=true}
    return pp});
    if(changed){setProfs(updated);saveData('profiles',updated)}},[profs.length,fbUser?.email,personas]);
  // Dynamic GROUPS: Aprende modules generated from user.presentations
  const dynGroups=useMemo(()=>getGroupsForUser(user,GROUPS),[user,user?.presentations])
  useEffect(()=>{const onResize=()=>setViewport({w:window.innerWidth,h:window.innerHeight});window.addEventListener('resize',onResize,{passive:true});window.addEventListener('orientationchange',onResize,{passive:true});return()=>{window.removeEventListener('resize',onResize);window.removeEventListener('orientationchange',onResize)}},[])
  const isPhone=viewport.w<=480;const isTabletPortrait=viewport.w>=768&&viewport.w<=1023&&viewport.h>=viewport.w;const isTabletLandscape=viewport.w>=1024&&viewport.w<=1365&&viewport.w>viewport.h;const isDesktop=viewport.w>=1366;
  const gameShellStyle=useMemo(()=>({position:'relative',minHeight:'calc(100dvh - var(--safe-top) - var(--safe-bottom) - 8px)',display:'grid',gridTemplateRows:'auto auto auto minmax(0,1fr)',gap:isPhone?8:12,paddingBottom:'calc(var(--dock-h) + var(--safe-bottom) + 16px)'}),[isPhone]);
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
        // Load nick
        const nick=data?.nick||u.displayName||u.email?.split('@')[0]||'';
        setCloudNick(nick);try{localStorage.setItem('toki_cloud_nick',nick)}catch(e){}
        // Load cloud data and merge with local
        if(data&&data.profiles){
          const localProfs=loadData('profiles',[]);
          const cloudTime=data.lastSaved||0;
          const localTime=loadData('last_saved_time',0);
          // Use cloud if local is empty OR cloud is newer
          if(!localProfs.length||cloudTime>localTime){
            saveData('profiles',data.profiles);setProfs(data.profiles);
            if(data.personas){saveData('personas',data.personas);setPersonas(data.personas)}
            saveData('last_saved_time',cloudTime);
          }
        }
        // Sync settings from cloud
        if(data&&data.settings){
          const localTs=loadData('settings_ts',0);
          if((data.settings._ts||0)>localTs){
            applySettings(data.settings);saveData('settings_ts',data.settings._ts);
            // Reload key states from updated localStorage
            setActiveMods(loadData('active_mods',{}));setSessionMode(loadData('session_mode','free'));
            setBurstMode(loadData('burst_mode',true));setBurstReps(loadData('burst_reps',2));
            setFraccionado(loadData('fraccionado',false));setFocalModule(loadData('focal_module','decir'));
            setFocalWeight(loadData('focal_weight',3));setGuidedTasks(loadData('guided_tasks',[]));
            setTheme(loadData('theme','space'));setExigencia(loadData('exigencia',65));
            const cloudPin=loadData('sup_pin',null);if(cloudPin)setSupPin(cloudPin);
          }
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
    if(!authNick.trim()){setAuthErr('Escribe un nick');setAuthBusy(false);return}
    if(authPass.length<6){setAuthErr('La contraseña debe tener al menos 6 caracteres');setAuthBusy(false);return}
    if(!acceptTerms){setAuthErr('Debes aceptar los términos y la política de privacidad');setAuthBusy(false);return}
    try{const cred=await fbSignUp(authEmail.trim(),authPass);
      // Save nick + consent to Firestore
      if(cred?.user)await fbSaveProfile(cred.user.uid,{
        nick:authNick.trim(),
        consent:{termsAccepted:true,termsDate:new Date().toISOString(),marketingOptIn:acceptMarketing,marketingDate:acceptMarketing?new Date().toISOString():null}
      });
      setCloudNick(authNick.trim());try{localStorage.setItem('toki_cloud_nick',authNick.trim())}catch(e){}
      setAuthScreen('choice');setAuthEmail('');setAuthPass('');setAuthNick('');setAcceptTerms(false);setAcceptMarketing(false);
    }catch(e){
      const msgs={'auth/email-already-in-use':'Ya existe una cuenta con ese email','auth/invalid-email':'Email no válido','auth/weak-password':'Contraseña demasiado débil'};
      setAuthErr(msgs[e.code]||'Error: '+e.message);
    }finally{setAuthBusy(false)}}
  async function handleLogout(){
    if(!auth)return;try{await fbSignOut()}catch(e){}setFbMode('guest');setFbUser(null);setCloudNick('');setLogoutAsk(false);try{localStorage.removeItem('toki_cloud_nick')}catch(e){}}
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
  const[showFeedDog,setShowFeedDog]=useState(false);
  const[dogFedToday,setDogFedToday]=useState(false);
  const[dogEvolMsg,setDogEvolMsg]=useState(null);
  // Dual session system: time vs goal
  const[sessionType,setSessionType]=useState(()=>loadData('session_type')||'time');
  const[sessionTime,setSessionTime]=useState(()=>loadData('session_time')||30);
  const[sessionGoal,setSessionGoal]=useState(()=>loadData('session_goal')||100);
  const[goalCount,setGoalCount]=useState(0);
  const[sessionStartTime,setSessionStartTime]=useState(null);
  const[showTokiBreak,setShowTokiBreak]=useState(false);
  const[showCompanion,setShowCompanion]=useState(false);
  const[dailyCount,setDailyCount]=useState(()=>user?.id?getDailyCount(user.id):0);
  const[showAstroOverlay,setShowAstroOverlay]=useState(false);
  // Auto cloud sync — moved after all state declarations (see below line ~305)
  // Data migration: old sessionMin -> new session_time
  useEffect(() => {
    const oldMins = loadData('sessionMin') || loadData('session_mins')
    if (oldMins !== null && oldMins !== undefined) {
      if (oldMins <= 25) saveData('session_time', 30)
      else if (oldMins <= 44) saveData('session_time', 60)
      else saveData('session_time', 90)
      saveData('session_type', 'time')
      saveData('session_goal', 100)
    }
  }, [])
  // Sync daily count when user changes
  useEffect(()=>{if(user?.id)setDailyCount(getDailyCount(user.id))},[user?.id]);
  // Dog evolution announcement
  useEffect(() => {
    if (!user) return;
    const growth = getDogGrowth(user.id);
    const phase = getDogPhase(growth);
    const nextPhase = phase < 2 ? phase + 1 : null;
    if (!nextPhase) return;
    const threshold = nextPhase === 1 ? 21 : 61;
    const daysUntil = threshold - growth;
    if (daysUntil <= 3 && daysUntil > 0) {
      const msgs = [
        'Toki se siente raro... algo est\u00e1 pasando \uD83C\uDF1F',
        'Toki tiene mucha energ\u00eda hoy... \u00bfqu\u00e9 le pasar\u00e1?',
        '\u00a1Algo incre\u00edble va a pasar pronto!'
      ];
      setDogEvolMsg(msgs[3 - daysUntil]);
    }
    if (daysUntil === 0) {
      setDogEvolMsg('\u00a1TOKI HA EVOLUCIONADO!');
    }
  }, [user]);
  const[sec,setSec]=useState('decir');const[secLv,setSecLv]=useState(1);const[openGroup,setOpenGroup]=useState(null);
  const[activeMods,setActiveMods]=useState(()=>loadData('active_mods',{}));const[sessionMode,setSessionMode]=useState(()=>loadData('session_mode','free'));const[guidedTasks,setGuidedTasks]=useState(()=>loadData('guided_tasks',[]));const[maxDaily,setMaxDaily]=useState(()=>loadData('max_daily',0));
  const[escribeCase,setEscribeCase]=useState(()=>loadData('escribe_case','upper'));
  const[escribeTypes,setEscribeTypes]=useState(()=>loadData('escribe_types',['letras']));
  const[escribeGuide,setEscribeGuide]=useState(()=>loadData('escribe_guide',{letras:true,palabras:true,frases:true}));
  const[escribePauta,setEscribePauta]=useState(()=>loadData('escribe_pauta_size',0));
  const[freeChoice,setFreeChoice]=useState(true);
  // M4: Burst mode state
  const[burstMode,setBurstMode]=useState(()=>loadData('burst_mode',true));
  const[burstSpeed,setBurstSpeed]=useState(()=>loadData('burst_speed',1.0));
  const[burstReps,setBurstReps]=useState(()=>loadData('burst_reps',2));
  function toggleBurst(){const nv=!burstMode;setBurstMode(nv);saveData('burst_mode',nv)}
  function setBurstSpeedVal(v){setBurstSpeed(v);saveData('burst_speed',v)}
  function setBurstRepsVal(v){setBurstReps(v);saveData('burst_reps',v)}
  // M9: Backward chaining (encadenamiento inverso)
  const[fraccionado,setFraccionado]=useState(()=>loadData('fraccionado',false));
  const[focalModule,setFocalModule]=useState(()=>loadData('focal_module','decir'));
  const[focalWeight,setFocalWeight]=useState(()=>loadData('focal_weight',3));
  function setFocalModuleVal(v){setFocalModule(v);saveData('focal_module',v)}
  function setFocalWeightVal(v){setFocalWeight(v);saveData('focal_weight',v)}
  function toggleFraccionado(){const nv=!fraccionado;setFraccionado(nv);saveData('fraccionado',nv)}
  // Auto cloud sync when profiles or settings change (debounced)
  const cloudSyncTimer=useRef(null);
  useEffect(()=>{if(fbMode!=='cloud'||!fbUser)return;
    clearTimeout(cloudSyncTimer.current);
    cloudSyncTimer.current=setTimeout(()=>{
      const now=Date.now();
      const settings=gatherSettings();saveData('settings_ts',settings._ts);
      cloudSaveProfile(fbUser.uid,{profiles:profs,personas,email:fbUser.email,lastSaved:now,settings});
      saveData('last_saved_time',now);
    },2000);
    return()=>clearTimeout(cloudSyncTimer.current)
  },[profs,personas,fbMode,fbUser,activeMods,sessionMode,burstMode,burstReps,fraccionado,focalModule,focalWeight,guidedTasks]);
  // First-time initialization: all modules OFF except DILO N1 (decir), burst ON with 2 reps
  useEffect(()=>{
    if(loadData('first_init_done',false))return;
    const allLvKeys=['decir','misfrases_dilo','frase','contar','math','multi','frac','razona_spatial','razona_series','razona_piensa','razona_clasifica','razona_emociones','money','clock','calendar','distribute','writing_1','lee_intruso','lee_word_img','lee_complete','lee_syllables','lee_read_do'];
    const initMods={};
    allLvKeys.forEach(k=>{initMods[k]=(k==='decir'||k==='misfrases_dilo')});
    setActiveMods(initMods);saveData('active_mods',initMods);
    setBurstMode(true);saveData('burst_mode',true);
    setBurstReps(2);saveData('burst_reps',2);
    saveData('first_init_done',true);
  },[]);
  const[ss,setSs]=useState(null);const[sm,setSm]=useState(25);const[audioOk,setAudioOk]=useState(false);
  const activeMs=useRef(0);const lastAct=useRef(0);const actTimer=useRef(null);const IDLE_THRESH=120000; // 2 min idle before pausing timer
  // === PAUSE system ===
  const[paused,setPaused]=useState(false);const pauseTimerRef=useRef(null);const snoozeTimerRef=useRef(null);const[showSnooze,setShowSnooze]=useState(false);const pausedRef=useRef(false);
  useEffect(()=>{pausedRef.current=paused},[paused]);
  function playBark(){try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sawtooth';o.frequency.setValueAtTime(350,c.currentTime);o.frequency.exponentialRampToValueAtTime(150,c.currentTime+0.2);g.gain.setValueAtTime(0.7,c.currentTime);g.gain.exponentialRampToValueAtTime(0.01,c.currentTime+0.25);o.start();o.stop(c.currentTime+0.25);setTimeout(()=>c.close(),400)}catch(e){}}
  // Pausa = hibernacion total. Sin ladridos, sin snooze. Silencio completo.
  function pauseSession(){stopVoice();window.dispatchEvent(new Event('toki-pause'));setPaused(true)}
  const[resumeKey,setResumeKey]=useState(0);
  function resumeSession(){stopVoice();setPaused(false);setShowSnooze(false);setResumeKey(k=>k+1);if(pauseTimerRef.current)clearTimeout(pauseTimerRef.current);if(snoozeTimerRef.current)clearTimeout(snoozeTimerRef.current)}
  function snoozeSession(){setShowSnooze(false);if(snoozeTimerRef.current)clearTimeout(snoozeTimerRef.current);snoozeTimerRef.current=setTimeout(()=>{playBark();setShowSnooze(true)},240000)}
  const[elapsedSt,setElapsedSt]=useState(0);const[trophy8,setTrophy8]=useState(false);const trophy8shown=useRef(false);
  const[correctStreak,setCorrectStreak]=useState(0);
  const[maxStreak,setMaxStreak]=useState(0);
  const[sessionStars,setSessionStars]=useState(0);
  const[milestone,setMilestone]=useState(null);
  const[rocketHint,setRocketHint]=useState(false);
  const milestoneShown=useRef(new Set());
  // M7a: Dynamic DILO level-up celebration
  const[dynamicLvUp,setDynamicLvUp]=useState(null);
  const diloExCount=useRef(0);
  // M7b: Random/mixed session mode
  const[randomMods,setRandomMods]=useState([]); // selected module lvKeys
  const[randomTime,setRandomTime]=useState(30); // minutes
  const[randomPerRound,setRandomPerRound]=useState(4); // exercises per module round
  const[randomActive,setRandomActive]=useState(false); // is a random session running?
  const[randomStats,setRandomStats]=useState({}); // {lvKey:{ok,total,name,emoji}}
  const[randomModIdx,setRandomModIdx]=useState(0); // current module index in rotation
  const[randomExInRound,setRandomExInRound]=useState(0); // exercises done in current round
  const[randomTransition,setRandomTransition]=useState(null); // {emoji,name} for transition overlay
  const[randomTimer,setRandomTimer]=useState(0); // countdown seconds
  const randomTimerRef=useRef(null);
  const randomModOrder=useRef([]); // ordered list of module info for rotation
  const sessionUsedPhrases=useRef(new Set()); // session no-repeat: track used phrases across modules
  const wakeLockRef=useRef(null);
  useEffect(()=>{async function acquireWakeLock(){try{if('wakeLock' in navigator&&scr==='game'){wakeLockRef.current=await navigator.wakeLock.request('screen')}else if(wakeLockRef.current){wakeLockRef.current.release();wakeLockRef.current=null}}catch(e){}}acquireWakeLock();return()=>{if(wakeLockRef.current){try{wakeLockRef.current.release()}catch(e){}}wakeLockRef.current=null}},[scr]);
  function pokeActive(){lastAct.current=Date.now()}
  useEffect(()=>{if(!ss){if(actTimer.current)clearInterval(actTimer.current);return}
    activeMs.current=0;lastAct.current=Date.now();setElapsedSt(0);
    actTimer.current=setInterval(()=>{if(pausedRef.current)return;const now=Date.now();if(now-lastAct.current<IDLE_THRESH)activeMs.current+=1000;setElapsedSt(Math.floor(activeMs.current/1000))},1000);
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
  useEffect(()=>{saveData('session_mode',sessionMode)},[sessionMode]);
  // Auto-request mic permission on first touch
  useEffect(()=>{const requestMic=()=>{navigator.mediaDevices&&navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{s.getTracks().forEach(t=>t.stop())}).catch(()=>{});document.removeEventListener('click',requestMic);document.removeEventListener('touchstart',requestMic)};document.addEventListener('click',requestMic);document.addEventListener('touchstart',requestMic);return()=>{document.removeEventListener('click',requestMic);document.removeEventListener('touchstart',requestMic)}},[]);
  function timeUp(){if(sessionType==='goal')return false;const mins=sessionTime||sm||30;return ss&&mins>0&&activeMs.current>=(mins*60000)}
  const curPresLvKeyRef=useRef('pres_0');
  const[selModKey,setSelModKey]=useState('pres_0');
  const recentExKeysRef=useRef(new Set());
  function buildQ(u,section,slv){const sh=a=>[...a].sort(()=>Math.random()-.5);const curPresLvKey=curPresLvKeyRef.current;
    // Session + 3-day no-repeat filter: removes exercises used this session OR in last 3 days
    // If filtering would remove ALL exercises, skip history filter (pool exhausted = allow repeats)
    function _noRepeat(exercises){
      if(!recentExKeysRef.current.size&&u?.id)recentExKeysRef.current=getRecentExerciseKeys(u.id);
      const histKeys=recentExKeysRef.current;
      const filtered=exercises.filter(ex=>{const key=(ex.ph||ex.text||ex.word||ex.letter||'').toString().toLowerCase().trim();if(!key||key.length<=1)return true;if(sessionUsedPhrases.current.has(key))return false;if(histKeys.has(key))return false;sessionUsedPhrases.current.add(key);return true});
      // If history filter removed everything, fall back to session-only filter (pool exhausted)
      if(filtered.length===0&&exercises.length>0){return exercises.filter(ex=>{const key=(ex.ph||ex.text||ex.word||ex.letter||'').toString().toLowerCase().trim();if(!key||key.length<=1)return true;if(sessionUsedPhrases.current.has(key))return false;sessionUsedPhrases.current.add(key);return true})}
      return filtered
    }
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
        const slides=thisPres.slides||(thisPres.lines||[]).map(t=>({text:t,img:null}));
        // Always generate estudio-style items (one per slide) with presentation attached for switch
        const presData={...thisPres,slides};
        const canToggle=hasEstudio&&hasPres;
        const defaultMode=hasPres&&!hasEstudio?'presentacion':'estudio';
        if(slides.length>0){
          items.push(...slides.filter(s=>(typeof s==='string'?s:s.text||'').trim()).map((s,si)=>({ty:'quiensoy',id:`pres${pi}_e${si}`,text:personalize(typeof s==='string'?s:s.text||'',u),img:s.img||u.photo||null,presentation:presData,canToggle,defaultMode})));
        }
      }
      // Ultimate fallback: if nothing found, create from user data
      if(!items.length){
        const fallback='Hola, me llamo '+(u.name||'');
        items.push({ty:'quiensoy',id:'pres_fb_0',text:fallback,img:u.photo||null});
      }
      return _noRepeat(items)}
    // Multi-level support: if slv is an array, merge exercises from all levels
    // NOTE: recursive buildQ calls already apply _noRepeat internally, so we only
    // shuffle and dedupe (without re-adding to sessionUsedPhrases which would empty the list)
    if(Array.isArray(slv)&&slv.length>1){const merged=[];slv.forEach(lv=>{merged.push(...buildQ(u,section,lv))});
      // Dedupe by id (in case same exercise appears in overlapping level pools)
      const seen=new Set();const unique=merged.filter(ex=>{if(seen.has(ex.id))return false;seen.add(ex.id);return true});
      return sh(unique)}
    if(Array.isArray(slv))slv=parseInt(slv[0])||1;
    if(section==='decir'){const wLen=e=>{const t=e.ph||e.su||'';return t.replace(/[¿?¡!,\.]/g,'').split(/\s+/).filter(Boolean).length};
      // M7a: Use dynamic level if enabled (but NOT when explicit level passed from multi-level merge)
      const explicitLv=typeof slv==='number'?slv:null;
      const dynDiloOn=!explicitLv&&u&&getDynamicDilo(u.id);
      const lv=dynDiloOn?getDynamicDiloLevel(u.id):(parseInt(Array.isArray(slv)?slv[0]:slv)||1);
      const wRange=lv===1?[1,2]:lv===2?[2,3]:lv===3?[3,4]:lv===4?[4,5]:[5,99];
      const pool=EX.filter(e=>e.ty==='flu'&&wLen(e)>=wRange[0]&&wLen(e)<=wRange[1]);
      const rev=pool.filter(e=>needsRev(e.id,u)),fresh=pool.filter(e=>!(u.srs&&u.srs[e.id])),rest=pool.filter(e=>!rev.includes(e)&&!fresh.includes(e));let sel=[...sh(rev).slice(0,24),...sh(fresh).slice(0,12),...sh(rest).slice(0,4)];while(sel.length<40){const r=pool.filter(e=>!sel.includes(e));if(!r.length)break;sel.push(r[Math.floor(Math.random()*r.length)])}return _noRepeat(sel.slice(0,40).sort(()=>Math.random()-.5).map(e=>{const p={...e};if(p.ph)p.ph=personalize(p.ph,u);if(p.fu)p.fu=personalize(p.fu,u);if(p.su)p.su=personalize(p.su,u);if(p.q)p.q=personalize(p.q,u);if(p.si)p.si=personalize(p.si,u);if(p.op)p.op=p.op.map(o=>personalize(o,u));return p}))}
    if(section==='misfrases_dilo'){const phrases=getCustomPhrases(u);if(!phrases.length)return[];return _noRepeat(sh(phrases.map((ph,i)=>({ty:'flu',id:'mf_dilo_'+i,ph:ph.toLowerCase(),su:ph.toLowerCase(),q:'¿Cómo dices esto?'}))).slice(0,20))}
    if(section==='frase'){const flv=parseInt(Array.isArray(slv)?slv[0]:slv)||1;const wc=flv===1?3:flv===2?4:flv===3?5:[6,7];
      const pool=EX.filter(e=>e.ty==='flu'&&e.ph).filter(e=>{const w=e.ph.replace(/[¿?¡!,\.]/g,'').split(/\s+/).length;return Array.isArray(wc)?w>=wc[0]&&w<=wc[1]:w===wc});
      let sel=sh(pool).slice(0,40);return _noRepeat(sel.map(e=>{const ph=personalize(e.ph,u);const q=ph.split(/\s+/).length<=3?'¿Cómo dices esto?':'¿Cómo se dice?';
        if(slv===4&&Math.random()>0.5){const words=ph.split(/\s+/);const bi=1+Math.floor(Math.random()*(words.length-2));const blank=words[bi];words[bi]='___';return{...e,ty:'frases_blank',q:'Completa la frase',fu:ph,blank,words,ph:personalize(e.ph,u)}}
        return{...e,ty:'frases',q,fu:ph,ph:personalize(e.ph,u)}}))}
    if(section==='contar'){const clv=parseInt(Array.isArray(slv)?slv[0]:slv)||1;let start=1,end=20;if(clv===2){start=21;end=50}else if(clv===3){start=51;end=100}else if(clv>=4){start=1;end=100}
      const firstD=Math.floor((start-1)/10),lastD=Math.floor((end-1)/10);const batches=[];
      for(let d=firstD;d<=lastD;d++){const b=[];for(let c=0;c<10;c++){const n=d*10+c+1;if(n>=start&&n<=end&&n<=100)b.push(n)}if(b.length>0)batches.push(b)}
      // Merge small batches (<5) with next/prev
      for(let i=0;i<batches.length-1;i++){if(batches[i].length<5){batches[i+1]=[...batches[i],...batches[i+1]];batches.splice(i,1);i--}}
      if(batches.length>1&&batches[batches.length-1].length<5){batches[batches.length-2]=[...batches[batches.length-2],...batches[batches.length-1]];batches.pop()}
      return batches.map((b,i)=>({ty:'count',nums:b,id:'cnt_batch_'+i}))}
    if(section==='math'){return genMath(slv).slice(0,30).map((m,i)=>({ty:'math',...m,id:'math_'+i}))}
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
      const eGuide=loadData('escribe_guide',{letras:true,palabras:true,frases:true,misfrases:true});
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
        }else if(t==='misfrases'){
          if(eCase==='upper')lvs.push(guide?7:71);
          else lvs.push(guide?72:73);
        }
      });
      if(lvs.length===0)lvs.push(1);
      if(lvs.length===1)return _noRepeat(genWriting(lvs[0],u));
      const merged=[];lvs.forEach(lv=>{merged.push(...genWriting(lv,u))});
      return _noRepeat(merged.sort(()=>Math.random()-.5))
    }
    if(section==='razona'){return genRazona(slv)}
    if(section==='lee'){return _noRepeat(genLee(slv))}
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
    let gameSec=sec;
    if(isQS){
      if(!overrideLv)freshLv=[1,2];
      gameSec='quiensoy';
      setSec('quiensoy');
    }
    // M7a: Reset DILO exercise counter for session tracking
    diloExCount.current=0;
    sessionUsedPhrases.current=new Set();recentExKeysRef.current=user?.id?getRecentExerciseKeys(user.id):new Set();
    if(sessionMode!=='free')setGoalCount(0);setSessionStartTime(Date.now());
    // Auto-enable burst for long sessions
    if((sessionType==='time'&&sessionTime>=60)||(sessionType==='goal'&&sessionGoal>=200)){
      if(!loadData('burst_mode',false)){setBurstMode(true);saveData('burst_mode',true);if(burstReps<2){setBurstReps(2);saveData('burst_reps',2)}}
    }
    setSecLv(freshLv);    setQ(buildQ(user,gameSec,freshLv));setIdx(0);setSt({ok:0,sk:0});setConsec(0);trophy8shown.current=false;setTrophy8(false);timeUpShown.current=false;setCorrectStreak(0);setMaxStreak(0);setSessionStars(0);milestoneShown.current=new Set();goalReachedRef.current=false;setShowRocket(true);
    track('session_started',{mode:sessionMode,module:gameSec,level:String(freshLv),session_type:sessionType})}
  // Start random session directly from active modules (DILO sandwich: 8 DILO, 8 others, repeat)
  function startRandomFromActiveModules(guidedModKeys){
    if(!user)return;
    let allMods=dynGroups.flatMap(g=>g.modules.map(m=>({...m,groupEmoji:g.emoji,groupName:g.name,groupId:g.id}))).filter(m=>activeMods[m.lvKey]!==false);
    // Guided mode: filter to only selected modules
    if(guidedModKeys&&guidedModKeys.length>0){allMods=allMods.filter(m=>guidedModKeys.includes(m.lvKey)||guidedModKeys.includes(m.k))}
    if(allMods.length<1)return startGame();
    if(allMods.length<2){setSec(allMods[0].k);if(allMods[0].lvKey)curPresLvKeyRef.current=allMods[0].lvKey;return startGame()}
    const perMod=8;
    const modQueues=allMods.map(m=>{
      const lv=getModuleLvOrDef(m.lvKey,m.defLv);
      if(m.lvKey)curPresLvKeyRef.current=m.lvKey;
      const exs=buildQ(user,m.k,lv).map(e=>({...e,_randomModule:m.lvKey,_randomPlanet:m.k==='decir'?'🎤':m.k==='misfrases_dilo'?'✏️':m.k==='frase'?'🧱':m.k==='contar'?'🔢':m.k==='math'?'➕':m.k==='multi'?'✖️':m.k==='frac'?'🍕':m.k==='money'?'💶':m.k==='clock'?'🕐':m.k==='calendar'?'📅':m.k==='distribute'?'🍬':m.k==='writing'?'✏️':m.k==='razona'?'🧩':m.k==='lee'?'📖':m.k==='quiensoy'?'👤':'⭐',_randomName:m.l,_randomGroupEmoji:m.groupEmoji}));
      return{mod:m,exs,cursor:0};
    });
    const superQ=[];
    const modOrder=allMods.map(m=>({lvKey:m.lvKey,emoji:m.k==='decir'?'🎤':m.k==='misfrases_dilo'?'✏️':m.k==='frase'?'🧱':m.k==='contar'?'🔢':m.k==='math'?'➕':m.k==='multi'?'✖️':m.k==='frac'?'🍕':m.k==='money'?'💶':m.k==='clock'?'🕐':m.k==='calendar'?'📅':m.k==='distribute'?'🍬':m.k==='writing'?'✏️':m.k==='razona'?'🧩':m.k==='lee'?'📖':m.k==='quiensoy'?'👤':'⭐',name:m.l,groupEmoji:m.groupEmoji}));
    const effMins=sessionType==='time'?(sessionTime||30):(sm||30);
    const totalNeeded=sessionType==='goal'?Math.max(sessionGoal,200):Math.ceil(effMins*2);
    // Focal module rhythm: focalWeight exercises of focal → (6 - focalWeight) from others → repeat
    const focalKey=focalModule||'decir';
    const fw=Math.max(1,Math.min(5,focalWeight||3));
    const otherPer=Math.max(1,6-fw);
    const focalQueues=modQueues.filter(mq=>mq.mod.k===focalKey||mq.mod.lvKey===focalKey);
    const otherQueues=modQueues.filter(mq=>mq.mod.k!==focalKey&&mq.mod.lvKey!==focalKey);
    if(focalQueues.length>0&&otherQueues.length>0){
      const focalPool=[];focalQueues.forEach(mq=>{focalPool.push(...mq.exs)});
      let focalIdx=0;
      const grabFocal=(n)=>{const chunk=[];for(let i=0;i<n;i++){if(focalIdx>=focalPool.length)focalIdx=0;chunk.push(focalPool[focalIdx]);focalIdx++}return chunk};
      let round=0,otherIdx=0;
      while(superQ.length<totalNeeded){
        // Focal block
        superQ.push(...grabFocal(fw));
        // Other block: 1 exercise from each of otherPer different modules
        for(let j=0;j<otherPer&&superQ.length<totalNeeded*2;j++){
          const mq=otherQueues[otherIdx%otherQueues.length];
          if(mq.cursor>=mq.exs.length)mq.cursor=0;
          superQ.push(mq.exs[mq.cursor]);mq.cursor++;
          otherIdx++;
        }
        round++;if(round>100)break;
      }
    }else{
      let round=0;
      while(superQ.length<totalNeeded){
        for(let mi=0;mi<modQueues.length;mi++){const mq=modQueues[mi];for(let j=0;j<6&&superQ.length<totalNeeded*2;j++){if(mq.cursor>=mq.exs.length)mq.cursor=0;superQ.push(mq.exs[mq.cursor]);mq.cursor++}}
        round++;if(round>50)break;
      }
    }
    const initStats={};
    allMods.forEach(m=>{initStats[m.lvKey]={ok:0,total:0,name:m.l,emoji:m.k==='decir'?'🎤':m.k==='frase'?'🧱':m.k==='contar'?'🔢':m.k==='math'?'➕':m.k==='multi'?'✖️':m.k==='frac'?'🍕':m.k==='money'?'💶':m.k==='clock'?'🕐':m.k==='calendar'?'📅':m.k==='distribute'?'🍬':m.k==='writing'?'✏️':m.k==='razona'?'🧩':m.k==='lee'?'📖':m.k==='quiensoy'?'👤':'⭐',groupEmoji:m.groupEmoji}});
    randomModOrder.current=modOrder;setRandomStats(initStats);setRandomActive(true);setRandomModIdx(0);setRandomExInRound(0);setRandomTimer(sessionType==='goal'?0:effMins*60);setRandomTime(effMins);setRandomPerRound(perMod);
    diloExCount.current=0;sessionUsedPhrases.current=new Set();recentExKeysRef.current=user?.id?getRecentExerciseKeys(user.id):new Set();
    setGoalCount(0);setSessionStartTime(Date.now());
    setQ(superQ);setIdx(0);setSt({ok:0,sk:0});setConsec(0);trophy8shown.current=false;setTrophy8(false);timeUpShown.current=false;setCorrectStreak(0);setMaxStreak(0);setSessionStars(0);milestoneShown.current=new Set();goalReachedRef.current=false;
    const firstMod=allMods[0];setSec(firstMod.k);if(firstMod.lvKey)curPresLvKeyRef.current=firstMod.lvKey;
    setOv(null);setShowRocket(true);
    track('session_started',{mode:'random',module:'mixed',modules_count:allMods.length,session_type:sessionType})
  }
  function onRocketDone(){warmUpTTS();startTTSKeepAlive();setShowRocket(false);setSs(Date.now());setScr('game');sayFB('¡Vamos allá '+(user?.name||'crack')+'!');
    // M7b: Start random timer if random session (only for time mode)
    if(randomActive&&sessionType==='time'){
      if(randomTimerRef.current)clearInterval(randomTimerRef.current);
      randomTimerRef.current=setInterval(()=>{
        setRandomTimer(t=>{if(t<=1){clearInterval(randomTimerRef.current);return 0}return t-1});
      },1000);
    }
  }
  // M7b: Advance to next exercise in random session, handling module transitions
  function randomAdvance(nextIdx,nextSt){
    if(randomActive&&sessionType==='time'&&randomTimer<=0){fin(nextSt);return}
    // Check if next exercise is from a different module
    const nextEx=queue[nextIdx];
    const curEx=queue[idx];
    if(nextEx&&curEx&&nextEx._randomModule!==curEx._randomModule){
      // Smooth transition: just update section and advance, no black overlay
      const allMods=dynGroups.flatMap(g=>g.modules);
      const nextMod=allMods.find(m=>m.lvKey===nextEx._randomModule);
      if(nextMod){setSec(nextMod.k);if(nextMod.lvKey)curPresLvKeyRef.current=nextMod.lvKey}
      setIdx(nextIdx);
    } else {
      setIdx(nextIdx);
    }
  }
  // M7b: Auto-finish random session when timer hits 0 (only for time mode)
  const goalReachedRef=useRef(false);
  const randomTimeUpRef=useRef(false);
  useEffect(()=>{if(!randomActive||scr!=='game'||!ss||sessionType==='goal')return;
    if(randomTimer<=0&&!randomTimeUpRef.current){randomTimeUpRef.current=true;
      setTimeout(()=>{fin(st)},500);
    }
  },[randomTimer,randomActive,scr,ss,sessionType]);
  useEffect(()=>{if(randomActive&&scr==='game'){randomTimeUpRef.current=false}},[randomActive,scr]);
  // No longer auto-finish on timeUp - let kid continue freely after guided time
  const timeUpShown=useRef(false);
  useEffect(()=>{if(scr!=='game'||!ss)return;const ch=setInterval(()=>{if(timeUp()&&!timeUpShown.current){timeUpShown.current=true;setTrophy8(true);victoryJingle();sayFB('¡Lo has hecho genial! ¿Quieres seguir?')}},2000);return()=>clearInterval(ch)},[scr,ss,elapsedSt]);
  useEffect(()=>{if(scr==='game'&&ss&&elapsedSt>=480&&!trophy8shown.current){trophy8shown.current=true;setTrophy8(true);victoryJingle()}},[elapsedSt,scr,ss]);
  // Auto-save partial session every 2 min (prevents data loss if app closes)
  useEffect(()=>{if(scr!=='game'||!ss)return;const autoSave=setInterval(()=>{
    if(st.ok+st.sk>0){const amin=Math.floor(activeMs.current/60000);const partial={ok:st.ok,sk:st.sk,dt:tdy(),min:amin,partial:true};saveData('partial_session',{userId:user?.id,data:partial,ts:Date.now()})}
  },120000);return()=>clearInterval(autoSave)},[scr,ss,st]);
  // Recover partial session on mount
  useEffect(()=>{try{const ps=loadData('partial_session',null);if(ps&&ps.userId&&ps.data&&ps.data.ok+ps.data.sk>0){
    const profs2=loadData('profiles',[]);const u=profs2.find(p=>p.id===ps.userId);
    if(u){const already=(u.hist||[]).some(h=>h.dt===ps.data.dt&&h.ok===ps.data.ok&&h.min===ps.data.min);
    if(!already){u.hist=[...(u.hist||[]),{ok:ps.data.ok,sk:ps.data.sk,dt:ps.data.dt,min:ps.data.min}];saveData('profiles',profs2.map(p=>p.id===u.id?u:p))}}
    saveData('partial_session',null)}}catch(e){}},[]);
  // TokiBreak every 15 min for time mode
  const lastBreakMin=useRef(0);
  useEffect(()=>{if(scr!=='game'||!ss||sessionType!=='time')return;
    const mins=Math.floor(elapsedSt/60);
    if(mins>0&&mins%15===0&&mins!==lastBreakMin.current){lastBreakMin.current=mins;stopVoice();window.dispatchEvent(new Event('toki-pause'));setShowTokiBreak(true)}
  },[elapsedSt,scr,ss,sessionType]);
  function saveP(u){const c={...u};const uLv=c.maxLv||c.level||1;const cur=EX.filter(e=>e.lv===uLv);const mas=cur.filter(e=>c.srs&&c.srs[e.id]&&c.srs[e.id].lv>=3).length;if(cur.length>0&&mas/cur.length>=.8&&uLv<5)c.maxLv=uLv+1;c.level=c.maxLv||c.level||1;setProfs(p=>p.map(x=>x.id===c.id?c:x))}
  function onOk(stars,attempts){pokeActive();setConf(true);setConsec(0);setMascotMood('happy');setTimeout(()=>{setConf(false);setMascotMood('idle')},2400);const e=queue[idx];const up=srsUp(e.id,true,user,stars,attempts);const s=typeof stars==='number'?stars:4;const repsCount=(burstMode&&burstReps>1)?burstReps:1;if(s>=3)up.totalStars3plus=(up.totalStars3plus||0)+repsCount;setUser(up);saveP(up);const nextSt={ok:st.ok+repsCount,sk:st.sk};setSt(nextSt);if(user&&sec){addGroupProgress(user.id,dynGroups.find(g=>g.modules.some(m=>m.k===sec))?.id||sec)}
    track('exercise_completed',{module:sec,stars:s,attempts,burst:burstMode,reps:repsCount})
    // Mark exercise in 3-day history
    const exKey=(e.ph||e.text||e.word||e.letter||'').toString().toLowerCase().trim();if(user?.id&&exKey)markExerciseUsed(user.id,exKey);
    // Daily global counter
    if(user?.id){const newDaily=addDailyCount(user.id,repsCount);setDailyCount(newDaily);}
    // Streak & milestone tracking
    const newStreak=correctStreak+1;setCorrectStreak(newStreak);if(newStreak>maxStreak)setMaxStreak(newStreak);setSessionStars(s=>s+repsCount);
    // Milestones ONLY at 100, 200, 300 (daily goals, not session noise)
    const totalOk=nextSt.ok;const MS=[{n:100,emoji:'🏆',text:'¡Cien ejercicios!',sub:'¡Primer objetivo cumplido!'},{n:200,emoji:'👑',text:'¡Doscientos!',sub:'¡Eres un campeón!'},{n:300,emoji:'🌈',text:'¡Trescientos!',sub:'¡Récord absoluto!'}];
    const hit=MS.find(m=>totalOk===m.n&&!milestoneShown.current.has(m.n));
    if(hit){milestoneShown.current.add(hit.n);stopVoice();window.dispatchEvent(new Event('toki-pause'));const isHuge=hit.n>=100;setTimeout(()=>{setMilestone({emoji:hit.emoji,text:hit.text,sub:hit.sub,huge:isHuge});setTimeout(()=>{setMilestone(null);setResumeKey(k=>k+1)},isHuge?4000:2500)},300)}
    // M7a: Dynamic DILO tracking on success
    if(sec==='decir'&&user&&getDynamicDilo(user.id)){
      diloExCount.current++;
      pushDynamicDiloResult(user.id,true);
      // Count session if 3+ exercises done
      if(diloExCount.current===3){setDynamicDiloSessions(user.id,getDynamicDiloSessions(user.id)+1)}
      const res=checkDynamicDiloLevel(user.id);
      if(res.change==='up'){starBeep(4);setDynamicLvUp(res.newLv);setTimeout(()=>setDynamicLvUp(null),2500)}
    }
    // M7b: Track random stats
    if(randomActive&&e._randomModule){setRandomStats(prev=>{const s={...prev};const k=e._randomModule;if(s[k]){s[k]={...s[k],ok:s[k].ok+1,total:s[k].total+1}}return s})}
    // Goal mode: increment goalCount (only on correct answers, not skips)
    if(sessionType==='goal'){
      setGoalCount(prev=>{
        const next=prev+repsCount;
        if(next>0&&next%50===0&&next<sessionGoal){stopVoice();window.dispatchEvent(new Event('toki-pause'));setShowTokiBreak(true)}
        if(next>=sessionGoal){goalReachedRef.current=true;setTimeout(()=>fin(nextSt),300);return next}
        return next
      })
    }
    setTimeout(()=>{if(sessionType==='goal'&&goalReachedRef.current)return;if(idx+1>=queue.length)fin(nextSt);else if(randomActive){randomAdvance(idx+1,nextSt)}else{setIdx(idx+1)}},200)}
  function onSk(){stopVoice();pokeActive();setMascotMood('sad');setTimeout(()=>setMascotMood('idle'),1500);const e=queue[idx];const up=srsUp(e.id,false,user);setUser(up);saveP(up);setCorrectStreak(0);const nf=consec+1;setConsec(nf);const nextSt={ok:st.ok,sk:st.sk+1};setSt(nextSt);
    track('exercise_skipped',{module:sec,consecutive_skips:nf});
    // Mark exercise in 3-day history
    const exKey=(e.ph||e.text||e.word||e.letter||'').toString().toLowerCase().trim();if(user?.id&&exKey)markExerciseUsed(user.id,exKey);
    // M7a: Dynamic DILO tracking on fail (silent level-down)
    if(sec==='decir'&&user&&getDynamicDilo(user.id)){
      diloExCount.current++;
      pushDynamicDiloResult(user.id,false);
      if(diloExCount.current===3){setDynamicDiloSessions(user.id,getDynamicDiloSessions(user.id)+1)}
      checkDynamicDiloLevel(user.id); // silent — no visual on level-down
    }
    // M7b: Track random stats on skip
    if(randomActive&&e._randomModule){setRandomStats(prev=>{const s={...prev};const k=e._randomModule;if(s[k]){s[k]={...s[k],total:s[k].total+1}}return s})}
    if(nf>=3&&(user.maxLv||user.level||1)>1)setShowLvAdj(true);else{if(idx+1>=queue.length)fin(nextSt);else if(randomActive){randomAdvance(idx+1,nextSt)}else{setIdx(idx+1)}}}
  function doLvDn(){const up={...user,maxLv:Math.max(1,(user.maxLv||user.level||1)-1),level:Math.max(1,(user.maxLv||user.level||1)-1)};setUser(up);saveP(up);setShowLvAdj(false);setConsec(0);if(idx+1>=queue.length)fin(st);else if(randomActive){randomAdvance(idx+1,st)}else{setIdx(idx+1)}}
  function fin(s){const f=s||st;if(f.ok+f.sk===0)return;stopTTSKeepAlive();saveData('partial_session',null);const amin=Math.floor(activeMs.current/60000);const rec={ok:f.ok,sk:f.sk,dt:tdy(),min:amin};const up={...user,hist:[...(user.hist||[]),rec]};setUser(up);saveP(up);setSs(null);if(randomTimerRef.current)clearInterval(randomTimerRef.current);setPaused(false);setShowSnooze(false);if(pauseTimerRef.current)clearTimeout(pauseTimerRef.current);if(snoozeTimerRef.current)clearTimeout(snoozeTimerRef.current);
    track('session_completed',{ok:f.ok,sk:f.sk,min:amin,module:sec,mode:sessionMode,stars:sessionStars,session_type:sessionType,random:randomActive});
    if(fbUser)saveDailyMetrics(fbUser.uid,{ok:f.ok,sk:f.sk,min:amin,module:sec,stars:sessionStars,streak:getStreak()});
    setOv('done')
    // Check if dog can be fed (session >= 15 min)
    if(user&&amin>=15&&canFeedDog(user.id)){stopVoice();setShowFeedDog(true)}}
  function tryExit(){stopVoice();stopTTSKeepAlive();setPaused(false);setShowSnooze(false);if(pauseTimerRef.current)clearTimeout(pauseTimerRef.current);if(snoozeTimerRef.current)clearTimeout(snoozeTimerRef.current);
    track('session_abandoned',{ok:st.ok,sk:st.sk,min:Math.floor(activeMs.current/60000),module:sec,mode:sessionMode});
    if(freeChoice){setScr('goals')}else{setOv('pin');setPi('')}}
  function chgLv(n){const up={...user,maxLv:n,level:n};setUser(up);saveP(up)}
  const cur=queue[idx];const vids=useMemo(()=>(user?.voices||[]).map(v=>v.id),[user?.voices]);const elapsed=elapsedSt;

  return <div onClick={tU} onTouchStart={tU}><style>{CSS}</style>{showWelcome&&<TokiWelcome onDone={()=>setShowWelcome(false)}/>}{photoCrop&&<PhotoCropOverlay imageSrc={photoCrop.src} onSave={photoCrop.onSave} onCancel={photoCrop.onCancel||(() =>setPhotoCrop(null))} shape={photoCrop.shape||'circle'}/>}{scr==='game'&&user&&<EmergencyButton user={user} personas={personas} supPin={supPin}/>}<Confetti show={conf}/><RocketTransition show={showRocket} onDone={onRocketDone} avatar={user?.photo||avStr(user?.av)} planetEmoji={dynGroups.find(g=>g.modules.some(m=>m.k===sec))?.emoji} planetColor={(()=>{const PCOL={aprende:'#E91E63',dilo:'#4CAF50',cuenta:'#FF9800',razona:'#42A5F5',escribe:'#AB47BC',lee:'#EF5350'};const gid=dynGroups.find(g=>g.modules.some(m=>m.k===sec))?.id;return PCOL[gid]||'#42A5F5'})()}/>
    {showRec&&user&&<Suspense fallback={<LazyFallback/>}><VoiceRec user={user} fbUser={fbUser} onBack={()=>setShowRec(false)} onSave={up=>{setUser(up);saveP(up);setShowRec(false)}}/></Suspense>}
    {trophy8&&<div className="ov" onClick={()=>setTrophy8(false)}><div className="ovp ab"><div style={{fontSize:80,marginBottom:12}}>🏆</div><h2 style={{fontSize:24,color:GOLD,margin:'0 0 8px'}}>¡Lo has hecho genial!</h2><p style={{fontSize:18,color:GREEN,fontWeight:700,margin:'0 0 6px'}}>Ejercicios: {st.ok} correctos</p><p style={{fontSize:16,color:DIM,margin:'0 0 16px'}}>de {st.ok+st.sk} intentados</p><Confetti show={true}/><button className="btn btn-gold" onClick={()=>setTrophy8(false)} style={{fontSize:20}}>¡Sigo!</button></div></div>}
    {showLvAdj&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>🤔</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 10px'}}>¿Bajamos el nivel?</p><div style={{display:'flex',gap:10}}><button className="btn btn-g" style={{flex:1}} onClick={doLvDn}>Sí</button><button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setShowLvAdj(false);setConsec(0);if(idx+1>=queue.length)fin(st);else setIdx(idx+1)}}>No</button></div></div></div>}
    {ov==='admin'&&fbUser&&fbUser.email===ADMIN_EMAIL&&<div className="ov" onClick={()=>setOv(null)}><div className="ovp" onClick={e=>e.stopPropagation()} style={{maxWidth:500,maxHeight:'80vh',overflowY:'auto'}}>
      <div style={{fontSize:48,marginBottom:8}}>⚙️</div>
      <h2 style={{fontSize:22,color:PURPLE,margin:'0 0 16px'}}>Panel de Administración</h2>
      <p style={{fontSize:14,color:DIM,margin:'0 0 12px'}}>Usuarios registrados: {cloudUsers.length}</p>
      {cloudUsers.map(u=><div key={u.uid} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:12,border:'2px solid '+BORDER,marginBottom:8,background:u.revoked?RED+'11':CARD}}>
        <div style={{flex:1}}><p style={{fontSize:16,fontWeight:600,margin:0,color:u.revoked?RED:TXT}}>{u.email||'Sin email'}</p>
          <p style={{fontSize:12,color:DIM,margin:'2px 0 0'}}>{u.profiles?.length||0} perfiles{u.revoked?' — REVOCADO':''}{u.consent?.marketingOptIn?' · 📧 Marketing':''}</p></div>
        {u.email!==ADMIN_EMAIL&&(u.revoked
          ?<button onClick={async()=>{await cloudUnrevokeUser(u.uid);setCloudUsers(await cloudListUsers())}} style={{background:GREEN+'22',border:'2px solid '+GREEN+'44',borderRadius:10,padding:'8px 14px',color:GREEN,fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'",fontWeight:600}}>Activar</button>
          :<button onClick={async()=>{await cloudRevokeUser(u.uid);setCloudUsers(await cloudListUsers())}} style={{background:RED+'22',border:'2px solid '+RED+'44',borderRadius:10,padding:'8px 14px',color:RED,fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'",fontWeight:600}}>Revocar</button>
        )}
      </div>)}
      <button className="btn btn-ghost" onClick={()=>setOv(null)} style={{marginTop:12}}>Cerrar</button>
    </div></div>}
    {ov==='pin'&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>🔒</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px'}}>PIN del supervisor</p><NumPad value={pi} onChange={setPi} onSubmit={()=>{if(pi===supPin){setOv(null);setScr('goals')}else{setPe(true);setPi('');setTimeout(()=>setPe(false),1500)}}} maxLen={4}/>{pe&&<p style={{fontSize:16,color:RED,fontWeight:600,margin:'8px 0 0'}}>PIN incorrecto</p>}<button className="btn btn-ghost" style={{marginTop:12}} onClick={()=>setOv(null)}>Volver</button></div></div>}
    {milestone&&<div className="ov" style={{zIndex:150}} onClick={()=>{setMilestone(null);setResumeKey(k=>k+1)}}>
      {milestone.huge&&<style>{`@keyframes confetti-fall{0%{transform:translateY(-10vh) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}@keyframes milestone-pop{0%{transform:scale(0.3);opacity:0}50%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}`}</style>}
      {milestone.huge&&Array.from({length:40}).map((_,i)=><div key={i} style={{position:'fixed',left:Math.random()*100+'%',top:-20,width:8+Math.random()*8,height:8+Math.random()*8,borderRadius:Math.random()>0.5?'50%':'2px',background:['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#96E6A1','#DDA0DD','#FF9800','#E91E63'][i%8],animation:`confetti-fall ${2+Math.random()*2}s linear ${Math.random()*1.5}s forwards`,zIndex:151}}/>)}
      <div className="ovp ab" style={{maxWidth:milestone.huge?420:340,animation:milestone.huge?'milestone-pop 0.5s ease-out':'none'}}>
        <div style={{fontSize:milestone.huge?120:80,marginBottom:8}}>{milestone.emoji}</div>
        <h2 style={{fontSize:milestone.huge?34:26,color:GOLD}}>{milestone.text}</h2>
        <p style={{fontSize:milestone.huge?22:18,color:GREEN}}>{milestone.sub}</p>
        {milestone.huge&&<p style={{fontSize:14,color:'rgba(255,255,255,.5)',marginTop:8}}>Toca para continuar</p>}
      </div>
    </div>}
    {/* M7a: Dynamic DILO level-up celebration */}
    {dynamicLvUp&&<div className="ov" style={{zIndex:155,pointerEvents:'none'}}><div className="ovp ab" style={{maxWidth:280,background:'transparent',boxShadow:'none'}}><h2 style={{fontSize:36,color:GOLD,fontWeight:800,textShadow:'0 2px 12px rgba(255,215,0,.6)',animation:'bounceIn .4s'}}>🎯 ¡Nivel {dynamicLvUp}!</h2></div></div>}
    {/* Dog evolution announcement */}
    {dogEvolMsg&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:200,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setDogEvolMsg(null)}><div style={{textAlign:'center',padding:30}}><div style={{fontSize:24,color:GOLD,fontWeight:700,fontFamily:"'Fredoka'"}}>{dogEvolMsg}</div></div></div>}
    {ov==='done'&&<Suspense fallback={<LazyFallback/>}><DoneScreen st={st} elapsed={elapsed} user={user} supPin={supPin} sessionStars={sessionStars} maxStreak={maxStreak} totalLifetimeStars={user?.totalStars3plus||0} randomStats={randomActive?randomStats:null} showFeedDog={showFeedDog} onFeedDog={()=>{if(user){feedDog(user.id);setDogFedToday(true);setShowFeedDog(false)}}} onExit={(action)=>{setOv(null);setMascotMood('idle');setShowFeedDog(false);if(action==='repeat'){setSt({ok:0,sk:0});setSessionStars(0);setGoalCount(0);setCorrectStreak(0);setMaxStreak(0);milestoneShown.current=new Set();setIdx(0);if(randomActive||sessionMode==='random'){startRandomFromActiveModules()}else{startGame()}}else{setRandomActive(false);if(randomTimerRef.current)clearInterval(randomTimerRef.current);setScr('goals')}}}/></Suspense>}
    {ov==='parentGate'&&user&&<div className="ov"><div className="ovp"><div style={{fontSize:48,marginBottom:12}}>👨‍👩‍👦</div><p style={{fontSize:20,fontWeight:700,margin:'0 0 8px'}}>Panel de Supervisor</p><p style={{fontSize:14,color:DIM,margin:'0 0 14px'}}>Introduce el PIN</p><NumPad value={parentPin} onChange={setParentPin} onSubmit={()=>{if(String(parentPin)===String(supPin)){setParentPin('');setSupervisorMode(true);clearTimeout(supervisorTimer.current);supervisorTimer.current=setTimeout(()=>setSupervisorMode(false),600000);setOv('parent')}else{setPe(true);setParentPin('');setTimeout(()=>setPe(false),1500)}}} maxLen={4}/>{pe&&<p style={{fontSize:16,color:RED,fontWeight:600,margin:'8px 0 0'}}>PIN incorrecto</p>}<button className="btn btn-ghost" style={{marginTop:12}} onClick={()=>{setOv(null);setParentPin('')}}>Cancelar</button></div></div>}
    {ov==='parent'&&user&&<Suspense fallback={<LazyFallback/>}><Settings user={user} setUser={setUser} saveP={saveP} supPin={supPin} setSupPin={setSupPin} pp={pp} setPp={setPp} sm={sm} setSm={setSm} sec={sec} setSec={setSec} secLv={secLv} setSecLv={setSecLv} freeChoice={freeChoice} setFreeChoice={setFreeChoice} activeMods={activeMods} setActiveMods={setActiveMods} openSection={openSection} setOpenSection={setOpenSection} ptab={ptab} setPtab={setPtab} theme={theme} setTheme={setTheme} rocketColor={rocketColor} setRocketColor={setRocketColor} exigencia={exigencia} setExigencia={setExigencia} maxDaily={maxDaily} setMaxDaily={setMaxDaily} sessionMode={sessionMode} setSessionMode={setSessionMode} guidedTasks={guidedTasks} setGuidedTasks={setGuidedTasks} escribeCase={escribeCase} setEscribeCase={setEscribeCase} escribeTypes={escribeTypes} setEscribeTypes={setEscribeTypes} escribeGuide={escribeGuide} setEscribeGuide={setEscribeGuide} escribePauta={escribePauta} setEscribePauta={setEscribePauta} personas={personas} savePersonas={savePersonas} setOv={setOv} setOpenGroup={setOpenGroup} setPhotoCrop={setPhotoCrop} setShowRec={setShowRec} delConf={delConf} setDelConf={setDelConf} delPersonaIdx={delPersonaIdx} setDelPersonaIdx={setDelPersonaIdx} presEdit={presEdit} setPresEdit={setPresEdit} presNewMode={presNewMode} setPresNewMode={setPresNewMode} presDelIdx={presDelIdx} setPresDelIdx={setPresDelIdx} shareCode={shareCode} setShareCode={setShareCode} shareMsg={shareMsg} setShareMsg={setShareMsg} fbUser={fbUser} hasConfig={hasConfig} pOpenPlanet={pOpenPlanet} setPOpenPlanet={setPOpenPlanet} setProfs={setProfs} setScr={setScr} helmetMode={helmetMode} setHelmetMode={setHelmetMode} showHelmet={showHelmet} dynGroups={dynGroups} sessionType={sessionType} setSessionType={setSessionType} sessionTime={sessionTime} setSessionTime={setSessionTime} sessionGoal={sessionGoal} setSessionGoal={setSessionGoal} burstMode={burstMode} setBurstMode={setBurstMode} burstReps={burstReps} setBurstReps={setBurstRepsVal} fraccionado={fraccionado} setFraccionado={setFraccionado} focalModule={focalModule} setFocalModule={setFocalModuleVal} focalWeight={focalWeight} setFocalWeight={setFocalWeightVal}/></Suspense>}

    {scr==='setup'&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{marginBottom:-6}}><TokiLogoPro size={130}/></div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p>
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
      <p style={{color:DIM+'99',fontSize:11,position:'fixed',bottom:2,left:0,right:0,textAlign:'center',zIndex:0,margin:0}}><b>Toki</b> &copy; 2026 &mdash; {VER} &middot; <a href={'mailto:'+SUPPORT_EMAIL+'?subject=Soporte%20Toki'} style={{color:GOLD+'99',textDecoration:'none'}}>Soporte</a></p>
    </div>}

    {/* Firebase Auth Gate — shown when hasConfig && not yet authenticated */}
    {scr==='login'&&hasConfig&&fbMode==='auth'&&!fbUser&&!fbLoading&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{marginBottom:-6}}><TokiLogoPro size={130}/></div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p>
      {authScreen==='choice'&&<div style={{display:'flex',flexDirection:'column',gap:14,maxWidth:340,margin:'0 auto'}}>
        <button className="btn btn-gold" onClick={enterGuest} style={{fontSize:22,padding:'18px 24px'}}>👤 Invitado</button>
        <p style={{fontSize:14,color:DIM,margin:0}}>Sin cuenta — datos solo en este dispositivo</p>
        <div style={{borderTop:'1px solid '+BORDER,margin:'8px 0'}}/>
        <button onClick={async()=>{setAuthBusy(true);setAuthErr('');try{const cred=await fbSignInWithGoogle();if(cred?.user){const d=await cloudLoadProfile(cred.user.uid);if(!d?.nick){/* New user via Google — need consent */setAuthScreen('google-consent');setAuthBusy(false);return}setCloudNick(d.nick||'');try{localStorage.setItem('toki_cloud_nick',d.nick||'')}catch(e){}}setAuthScreen('choice')}catch(e){setAuthErr(e.message)}finally{setAuthBusy(false)}}} style={{fontSize:20,padding:'16px 24px',background:'#fff',color:'#333',border:'2px solid #ddd',borderRadius:16,cursor:'pointer',fontFamily:"'Fredoka'",fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:10}} disabled={authBusy}>
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
      {authScreen==='register'&&<div style={{maxWidth:400,margin:'0 auto'}} className="af">
        <h2 style={{fontSize:24,color:GOLD,margin:'0 0 16px'}}>Crear cuenta</h2>
        <input className="inp" value={authNick} onChange={e=>setAuthNick(e.target.value)} placeholder="Nick (nombre público)" style={{marginBottom:12,fontSize:18,padding:14}}/>
        <input className="inp" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} type="email" placeholder="Email" style={{marginBottom:12,fontSize:18,padding:14}}/>
        <input className="inp" value={authPass} onChange={e=>setAuthPass(e.target.value)} type="password" placeholder="Contraseña (mín. 6 caracteres)" style={{marginBottom:12,fontSize:18,padding:14}} onKeyDown={e=>{if(e.key==='Enter')handleRegister()}}/>
        {/* Consent checkboxes */}
        <div style={{margin:'8px 0 14px',display:'grid',gap:10}}>
          <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer',fontSize:13,color:DIM,lineHeight:1.4}}>
            <input type="checkbox" checked={acceptTerms} onChange={e=>setAcceptTerms(e.target.checked)} style={{marginTop:2,accentColor:GOLD,width:18,height:18,flexShrink:0}}/>
            <span>Acepto los <button onClick={(e)=>{e.preventDefault();setShowTerms(true)}} style={{background:'none',border:'none',color:GOLD,cursor:'pointer',textDecoration:'underline',padding:0,font:'inherit',fontWeight:600}}>Términos de uso</button> y la <button onClick={(e)=>{e.preventDefault();setShowPrivacy(true)}} style={{background:'none',border:'none',color:GOLD,cursor:'pointer',textDecoration:'underline',padding:0,font:'inherit',fontWeight:600}}>Política de privacidad</button> <span style={{color:RED}}>*</span></span>
          </label>
          <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer',fontSize:13,color:DIM,lineHeight:1.4}}>
            <input type="checkbox" checked={acceptMarketing} onChange={e=>setAcceptMarketing(e.target.checked)} style={{marginTop:2,accentColor:GOLD,width:18,height:18,flexShrink:0}}/>
            <span>Deseo recibir información sobre novedades, actualizaciones y ofertas de Toki por email</span>
          </label>
        </div>
        {authErr&&<p style={{color:RED,fontSize:15,fontWeight:600,margin:'0 0 10px'}}>{authErr}</p>}
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-ghost" style={{flex:1}} onClick={()=>{setAuthScreen('choice');setAuthErr('');setAcceptTerms(false);setAcceptMarketing(false)}}>← Volver</button>
          <button className="btn btn-g" style={{flex:2}} disabled={authBusy||!authEmail.trim()||!authPass||!authNick.trim()||!acceptTerms} onClick={handleRegister}>{authBusy?'...':'Crear cuenta'}</button>
        </div>
        <p style={{fontSize:11,color:DIM+'88',margin:'10px 0 0',textAlign:'center'}}>Toki es gratuito durante la fase beta. Tu cuenta se activa al instante.</p>
      </div>}
      {/* Google consent gate — new Google user needs to accept terms */}
      {authScreen==='google-consent'&&fbUser&&<div style={{maxWidth:400,margin:'0 auto'}} className="af">
        <h2 style={{fontSize:24,color:GOLD,margin:'0 0 6px'}}>Bienvenido a Toki</h2>
        <p style={{color:DIM,fontSize:14,margin:'0 0 18px'}}>Para completar tu registro necesitamos tu consentimiento:</p>
        <div style={{margin:'0 0 18px',display:'grid',gap:10}}>
          <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer',fontSize:13,color:DIM,lineHeight:1.4}}>
            <input type="checkbox" checked={acceptTerms} onChange={e=>setAcceptTerms(e.target.checked)} style={{marginTop:2,accentColor:GOLD,width:18,height:18,flexShrink:0}}/>
            <span>Acepto los <button onClick={(e)=>{e.preventDefault();setShowTerms(true)}} style={{background:'none',border:'none',color:GOLD,cursor:'pointer',textDecoration:'underline',padding:0,font:'inherit',fontWeight:600}}>Términos de uso</button> y la <button onClick={(e)=>{e.preventDefault();setShowPrivacy(true)}} style={{background:'none',border:'none',color:GOLD,cursor:'pointer',textDecoration:'underline',padding:0,font:'inherit',fontWeight:600}}>Política de privacidad</button> <span style={{color:RED}}>*</span></span>
          </label>
          <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer',fontSize:13,color:DIM,lineHeight:1.4}}>
            <input type="checkbox" checked={acceptMarketing} onChange={e=>setAcceptMarketing(e.target.checked)} style={{marginTop:2,accentColor:GOLD,width:18,height:18,flexShrink:0}}/>
            <span>Deseo recibir información sobre novedades, actualizaciones y ofertas de Toki por email</span>
          </label>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-ghost" style={{flex:1}} onClick={async()=>{try{await handleLogout()}catch(e){};setAuthScreen('choice');setAcceptTerms(false);setAcceptMarketing(false)}}>Cancelar</button>
          <button className="btn btn-g" style={{flex:2}} disabled={!acceptTerms} onClick={async()=>{
            setAuthBusy(true);
            const autoNick=fbUser.displayName||(fbUser.email||'').split('@')[0].slice(0,4);
            await fbSaveProfile(fbUser.uid,{
              nick:autoNick,
              consent:{termsAccepted:true,termsDate:new Date().toISOString(),marketingOptIn:acceptMarketing,marketingDate:acceptMarketing?new Date().toISOString():null}
            });
            setCloudNick(autoNick);try{localStorage.setItem('toki_cloud_nick',autoNick)}catch(e){}
            setAuthScreen('choice');setAcceptTerms(false);setAcceptMarketing(false);setAuthBusy(false);
          }}>Aceptar y continuar</button>
        </div>
      </div>}
      {/* Terms of Service modal */}
      {showTerms&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={()=>setShowTerms(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:BG2,borderRadius:20,maxWidth:520,width:'100%',maxHeight:'80vh',overflowY:'auto',padding:28,color:TXT}}>
          <h2 style={{fontSize:22,color:GOLD,margin:'0 0 16px'}}>Términos de uso</h2>
          <div style={{fontSize:13,lineHeight:1.7,color:DIM}}>
            <p><b>1. Objeto.</b> Toki es una aplicación educativa diseñada para apoyar el aprendizaje del habla y la lectoescritura en personas con necesidades especiales, en particular con Síndrome de Down. El servicio es proporcionado por el titular de Toki.</p>
            <p><b>2. Acceso gratuito.</b> Actualmente Toki se ofrece de forma gratuita durante su fase beta. El titular se reserva el derecho de establecer planes de pago en el futuro, notificando previamente a los usuarios registrados.</p>
            <p><b>3. Uso adecuado.</b> El usuario se compromete a utilizar la aplicación con fines educativos y a no emplearla de forma que pueda perjudicar su funcionamiento o el de otros usuarios.</p>
            <p><b>4. Cuenta de usuario.</b> Al crear una cuenta, el usuario es responsable de la veracidad de los datos proporcionados y de mantener la confidencialidad de sus credenciales de acceso.</p>
            <p><b>5. Contenido del usuario.</b> Los datos de perfiles, grabaciones de voz y registros de progreso son propiedad del usuario. El titular no accederá a estos datos salvo para el funcionamiento técnico del servicio o por requerimiento legal.</p>
            <p><b>6. Propiedad intelectual.</b> Toki, su diseño, código, contenidos y marca son propiedad de su titular. Queda prohibida su reproducción, distribución o modificación sin autorización expresa.</p>
            <p><b>7. Limitación de responsabilidad.</b> Toki es una herramienta de apoyo educativo y no sustituye la intervención de profesionales (logopedas, pedagogos, médicos). El titular no se hace responsable de los resultados educativos ni de interrupciones del servicio.</p>
            <p><b>8. Soporte e incidencias.</b> Para reportar errores, problemas técnicos o cualquier incidencia con el servicio, el usuario puede contactar a través del <a href={'mailto:'+SUPPORT_EMAIL+'?subject=Soporte%20Toki'} style={{color:GOLD,textDecoration:'underline'}}>canal de soporte de Toki</a>.</p>
            <p><b>9. Modificaciones.</b> Estos términos pueden ser actualizados. Se notificará a los usuarios registrados cualquier cambio sustancial.</p>
            <p style={{color:DIM+'88',fontSize:11}}>Última actualización: marzo 2026</p>
          </div>
          <button className="btn btn-gold" onClick={()=>setShowTerms(false)} style={{marginTop:12,width:'100%'}}>Cerrar</button>
        </div>
      </div>}
      {/* Privacy Policy modal */}
      {showPrivacy&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={()=>setShowPrivacy(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:BG2,borderRadius:20,maxWidth:520,width:'100%',maxHeight:'80vh',overflowY:'auto',padding:28,color:TXT}}>
          <h2 style={{fontSize:22,color:GOLD,margin:'0 0 16px'}}>Política de privacidad</h2>
          <div style={{fontSize:13,lineHeight:1.7,color:DIM}}>
            <p><b>Responsable.</b> El titular de Toki. Contacto: <a href={'mailto:'+SUPPORT_EMAIL+'?subject=Privacidad%20Toki'} style={{color:GOLD,textDecoration:'underline'}}>soporte de Toki</a></p>
            <p><b>Datos recogidos.</b> Al registrarse se recogen: email, nick (nombre público) y preferencias de consentimiento. Durante el uso de la app se generan datos de perfiles de alumnos (nombre, datos familiares, dirección, colegio), grabaciones de voz, registros de ejercicios y progresión.</p>
            <p><b>Finalidad.</b> Los datos se utilizan exclusivamente para: (1) el funcionamiento del servicio, (2) la sincronización entre dispositivos, (3) si el usuario lo consiente, el envío de comunicaciones sobre novedades y actualizaciones de Toki.</p>
            <p><b>Base legal.</b> Consentimiento del usuario (art. 6.1.a RGPD). El usuario puede retirar su consentimiento en cualquier momento.</p>
            <p><b>Almacenamiento.</b> Los datos se almacenan en Firebase (Google Cloud Platform) con servidores en la UE. Las grabaciones de voz y datos de perfiles se cifran en tránsito.</p>
            <p><b>Menores.</b> Toki está diseñada para ser utilizada bajo la supervisión de un adulto (padre, madre o tutor). Los datos de los menores son responsabilidad del supervisor que crea la cuenta.</p>
            <p><b>Conservación.</b> Los datos se conservan mientras la cuenta esté activa. El usuario puede solicitar la eliminación completa de sus datos contactando al responsable.</p>
            <p><b>Derechos.</b> El usuario tiene derecho a acceder, rectificar, suprimir, limitar y portar sus datos, así como a oponerse a su tratamiento. Para ejercer estos derechos, contactar con el <a href={'mailto:'+SUPPORT_EMAIL+'?subject=Derechos%20datos%20Toki'} style={{color:GOLD,textDecoration:'underline'}}>soporte de Toki</a>.</p>
            <p><b>Grabaciones de voz.</b> La app permite grabar voz con fines educativos. Las grabaciones se almacenan en el dispositivo y, opcionalmente, en Firebase. Si el tutor legal autoriza expresamente la cesión de voz pública, las grabaciones se utilizarán únicamente como modelo de pronunciación para otros alumnos. Solo se almacenan con el nombre, edad y sexo del hablante (sin otros datos identificativos). El consentimiento de cesión puede revocarse en cualquier momento desde Ajustes, eliminando todas las grabaciones públicas.</p>
            <p><b>Comunicaciones comerciales.</b> Solo se enviarán comunicaciones comerciales o informativas a los usuarios que hayan marcado expresamente la casilla de aceptación. El usuario puede darse de baja en cualquier momento.</p>
            <p style={{color:DIM+'88',fontSize:11}}>Última actualización: marzo 2026</p>
          </div>
          <button className="btn btn-gold" onClick={()=>setShowPrivacy(false)} style={{marginTop:12,width:'100%'}}>Cerrar</button>
        </div>
      </div>}
      <p style={{color:DIM+'99',fontSize:11,position:'fixed',bottom:2,left:0,right:0,textAlign:'center',zIndex:0,margin:0}}><b>Toki</b> &copy; 2026 &mdash; {VER} &middot; <a href={'mailto:'+SUPPORT_EMAIL+'?subject=Soporte%20Toki'} style={{color:GOLD+'99',textDecoration:'none'}}>Soporte</a></p>
    </div>}
    {/* Revoked user screen */}
    {scr==='login'&&hasConfig&&revoked&&fbUser&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{fontSize:80,marginBottom:16}}>🚫</div>
      <h2 style={{fontSize:24,color:RED,margin:'0 0 12px'}}>Cuenta suspendida</h2>
      <p style={{fontSize:16,color:DIM,margin:'0 0 20px'}}>El administrador ha revocado el acceso de esta cuenta.</p>
      <button className="btn btn-ghost" onClick={handleLogout} style={{fontSize:18}}>Cerrar sesión</button>
    </div>}
    {/* Firebase loading state */}
    {scr==='login'&&hasConfig&&fbLoading&&<div className="af" style={{textAlign:'center',padding:'40px 0'}}><div style={{animation:'pulse 1.5s infinite'}}><TokiLogoPro size={48}/></div><p style={{color:DIM,fontSize:16,margin:'16px 0 0'}}>Cargando...</p></div>}
    {/* Normal login screen — shown when guest mode, no Firebase, or already authenticated */}
    {scr==='login'&&(!hasConfig||fbMode==='guest'||fbMode==='cloud')&&!revoked&&!fbLoading&&<div className="af" style={{textAlign:'center',padding:'24px 0'}}><div style={{marginBottom:-6}}><TokiLogoPro size={130}/></div><h1 style={{fontSize:44,color:GOLD,margin:'0 0 4px',letterSpacing:-1}}>Toki</h1><p style={{color:DIM,fontSize:16,margin:'0 0 32px',fontStyle:'italic'}}>Aprende a decirlo</p>
      {/* Cloud status badge */}
      {fbUser&&fbMode==='cloud'&&<div style={{position:'fixed',bottom:18,left:0,right:0,textAlign:'center',zIndex:10}}>
        {logoutAsk==='edit'?<div style={{display:'inline-flex',gap:6,alignItems:'center'}}>
          <input className="inp" value={authNick} onChange={e=>setAuthNick(e.target.value)} placeholder="Nick" style={{fontSize:13,padding:'4px 10px',width:120,textAlign:'center'}} autoFocus onKeyDown={e=>{if(e.key==='Enter'&&authNick.trim()){const n=authNick.trim();setCloudNick(n);try{localStorage.setItem('toki_cloud_nick',n)}catch(e){}if(fbUser)fbSaveProfile(fbUser.uid,{nick:n});setLogoutAsk(false);setAuthNick('')}}}/>
          <button onClick={()=>{const n=authNick.trim();if(n){setCloudNick(n);try{localStorage.setItem('toki_cloud_nick',n)}catch(e){}if(fbUser)fbSaveProfile(fbUser.uid,{nick:n})}setLogoutAsk(false);setAuthNick('')}} style={{background:'none',border:'none',color:GREEN,fontSize:13,cursor:'pointer',fontFamily:"'Fredoka'",fontWeight:700}}>✓</button>
        </div>:logoutAsk==='confirm'?<div style={{display:'inline-flex',gap:8,alignItems:'center'}}>
          <button onClick={handleLogout} style={{background:'none',border:'none',color:RED,fontSize:12,cursor:'pointer',fontFamily:"'Fredoka'",fontWeight:700}}>Sí, salir</button>
          <button onClick={()=>setLogoutAsk(false)} style={{background:'none',border:'none',color:DIM,fontSize:12,cursor:'pointer',fontFamily:"'Fredoka'"}}>Cancelar</button>
        </div>:logoutAsk==='menu'?<div style={{display:'inline-flex',gap:10,alignItems:'center'}}>
          <button onClick={()=>{setAuthNick(cloudNick);setLogoutAsk('edit')}} style={{background:'none',border:'none',color:BLUE,fontSize:12,cursor:'pointer',fontFamily:"'Fredoka'"}}>✏️ Cambiar nick</button>
          <button onClick={()=>setLogoutAsk('confirm')} style={{background:'none',border:'none',color:RED+'cc',fontSize:12,cursor:'pointer',fontFamily:"'Fredoka'"}}>Cerrar sesión</button>
          <button onClick={()=>setLogoutAsk(false)} style={{background:'none',border:'none',color:DIM,fontSize:11,cursor:'pointer',fontFamily:"'Fredoka'"}}>✕</button>
        </div>:<button onClick={()=>setLogoutAsk('menu')} style={{background:'none',border:'none',cursor:'pointer',fontFamily:"'Fredoka'",padding:'4px 12px'}}>
          <span style={{fontSize:12,color:DIM+'88'}}>☁️ {cloudNick||'Conectado'}</span>
        </button>}
        {fbUser.email===ADMIN_EMAIL&&<button onClick={async()=>{setCloudUsers(await cloudListUsers());setAuthScreen('admin');setOv('admin')}} style={{background:PURPLE+'22',border:'2px solid '+PURPLE+'44',borderRadius:20,padding:'6px 12px',color:PURPLE,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Fredoka'"}} title="Panel admin">⚙️ Admin</button>}
      </div>}
      {!fbUser&&hasConfig&&<button onClick={()=>{setFbMode('auth');setAuthScreen('choice')}} style={{background:'none',border:'none',color:BLUE,fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'",textDecoration:'underline',marginBottom:16,display:'block',margin:'0 auto 16px'}}>🔑 Iniciar sesión / Crear cuenta</button>}
      <p style={{color:DIM+'99',fontSize:11,position:'fixed',bottom:2,left:0,right:0,textAlign:'center',zIndex:0,margin:0}}><b>Toki</b> &copy; 2026 &mdash; {VER} &middot; <a href={'mailto:'+SUPPORT_EMAIL+'?subject=Soporte%20Toki'} style={{color:GOLD+'99',textDecoration:'none'}}>Soporte</a></p>
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
            onClick={()=>{stopVoice();setSs(null);setPaused(false);if(randomTimerRef.current)clearInterval(randomTimerRef.current);setRandomActive(false);setUser(p);setSm(p.sessionMin||25);setSec(p.sec||'decir');setSecLv(p.secLv||1);setFreeChoice(true);setVoiceProfile(p.age,p.sex);setScr('goals')}} style={{
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

    {showMiCielo&&<Suspense fallback={<LazyFallback/>}><MiCielo user={user} onClose={()=>setShowMiCielo(false)}/></Suspense>}
    {showAstroOverlay&&<AstronautOverlay phase={getDailyPhase(dailyCount)} dailyCount={dailyCount} photo={user?.photo} onClose={()=>setShowAstroOverlay(false)} />}
    {scr==='goals'&&user&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><button style={{background:'none',border:'none',color:DIM,fontSize:16,padding:'10px 8px',minHeight:44,cursor:'pointer',fontFamily:"'Fredoka'"}} onClick={()=>{if(openGroup){setOpenGroup(null)}else{setScr('login');setUser(null);setOpenGroup(null)}}}>{openGroup?'← Volver':'← Cambiar perfil'}</button><div style={{display:'flex',gap:12}}><button style={{background:'none',border:'none',color:DIM,fontSize:32,width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',borderRadius:14,padding:0,position:'relative'}} onClick={()=>{setParentPinOk(false);setParentPin('');setPp('');setPtab('config');setDelConf(false);setOv(supPin?'parentGate':'parent')}}>⚙️{isCheckpointPending(user)&&<span style={{position:'absolute',top:4,right:4,width:10,height:10,borderRadius:'50%',background:RED,border:'2px solid '+BG}} title="Grabación control pendiente"/>}</button></div></div>
      <div style={{padding:'4px 4px 2px'}}>
        {/* Row 1: Dog | Avatar | Greeting | Stars counter + streak */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
          <div style={{flexShrink:0,cursor:'pointer'}} onClick={()=>{stopVoice();setShowCompanion(true)}} title="Compañía">
            {(()=>{const daysSinceLastFed=(()=>{const last=getDogLastFed(user.id);if(!last)return 999;return Math.floor((Date.now()-new Date(last).getTime())/86400000)})();const dogMood=daysSinceLastFed>=2?'hungry':mascotMood;return <DogMascot mood={dogMood} phase={getDogPhase(getDogGrowth(user.id))} interactive={true} size={48}/>})()}
          </div>
          <div style={{flexShrink:0,position:'relative'}}>
            <SpaceMascot mood={mascotMood} size={52} tier={getMascotTier(user?.totalStars3plus||0)} cycle={getMascotCycle(user?.totalStars3plus||0)}/>
          </div>
          <div style={{flexShrink:0}}>
            <AstronautAvatar photo={user.photo} emoji={avStr(user.av)} size={48} helmet={showHelmet}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <h2 style={{fontSize:20,margin:0,color:'#FFF',textShadow:'0 1px 6px rgba(0,0,0,.6)',lineHeight:1.2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{getGreeting(user.name)}</h2>
            <div style={{display:'flex',alignItems:'center',gap:4,marginTop:2}}>
              {(()=>{const s3=user?.totalStars3plus||0;const current=getMascotTier(s3);const cycle=getMascotCycle(s3);const cc=CYCLE_COLORS[cycle%CYCLE_COLORS.length];return [0,1,2,3,4,5].map(i=>{const active=i<=current;return <span key={i} style={{fontSize:14,opacity:active?1:0.18,filter:active?'none':'grayscale(1)',transition:'all .3s',color:active?cc:undefined}}>{i===0?'⭐':i===1?'🌟':i===2?'💫':i===3?'✨':i===4?'🏅':'🏆'}</span>})})()}{getMascotCycle(user?.totalStars3plus||0)>0&&<span style={{fontSize:10,color:CYCLE_COLORS[getMascotCycle(user?.totalStars3plus||0)%CYCLE_COLORS.length],fontWeight:700}}>×{getMascotCycle(user?.totalStars3plus||0)+1}</span>}
              <span style={{fontSize:11,color:'rgba(255,255,255,.5)',marginLeft:4}}>⏱️{sm===0?'∞':sm+'m'}</span>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:4,cursor:'pointer'}} onClick={()=>setShowAstroOverlay(true)}>
              <AstronautDaily phase={getDailyPhase(dailyCount)} size={44} />
              <span style={{fontSize:13,color:'rgba(255,255,255,.7)',fontWeight:600}}>Hoy: {dailyCount}</span>
            </div>
            <button onClick={()=>setShowMiCielo(true)} style={{background:CARD,border:'2px solid '+BORDER,borderRadius:10,padding:'5px 10px',minHeight:36,cursor:'pointer',fontFamily:"'Fredoka'",display:'flex',alignItems:'center',gap:3}}><span style={{fontSize:15,color:GOLD,fontWeight:700}}>{totalStars} ⭐</span></button>
            {streak>1&&<div style={{background:CARD,border:'2px solid '+BORDER,borderRadius:8,padding:'3px 8px'}}><span style={{fontSize:12,color:'#E67E22',fontWeight:700}}>🔥{streak}d</span></div>}
          </div>
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
        return <div style={{position:'relative',minHeight:isPhone?280:'min(66vh,620px)'}}>
        {/* When NO group is open: orbiting planets around center */}
        {!openGroup&&(()=>{
          const allGroups=dynGroups;
          const n=allGroups.length;
          const viewportW=Math.max(320,viewport.w-(isPhone?24:isTabletPortrait?40:isTabletLandscape?64:96));
          const viewportH=Math.max(420,viewport.h-(isPhone?240:isTabletLandscape?220:260));
          const planetSize=Math.round(Math.max(isPhone?58:isTabletPortrait?74:isTabletLandscape?88:94,Math.min(isPhone?70:isTabletPortrait?82:isTabletLandscape?98:104,viewportW*(isPhone?0.16:isTabletPortrait?0.1:0.075))));
          const cW=Math.round(Math.min(isPhone?viewportW:viewportW*0.92,isPhone?viewportW:1220));
          const cH=Math.round(Math.min(isPhone?Math.max(320,viewportH*0.52):Math.max(460,viewportH*0.65),isTabletLandscape?680:720));
          const orbitR=Math.max(90,Math.min((cW-planetSize-42)/(isPhone?2.15:isTabletPortrait?2.8:3.4),(cH-planetSize-70)/(isPhone?1.9:1.55)));
          const scX=isPhone?1.08:isTabletPortrait?1.28:isTabletLandscape?1.55:1.72;
          const scY=isPhone?0.98:isTabletPortrait?0.88:isTabletLandscape?0.74:0.7;
          const tilt=isPhone?-2:isTabletPortrait?-5:-8;
          const orbitDuration=60;
          return <div style={{position:'relative',width:'100%',maxWidth:cW,height:cH,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {/* Center: rocket — functional in random/guiada, decorative in libre */}
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:2,
              padding:0,
              display:'flex',flexDirection:'column',alignItems:'center',gap:0,fontFamily:"'Fredoka'",
            }}>
              <button onClick={()=>{warmUpTTS();
                if(sessionMode==='random'){startRandomFromActiveModules()}
                else if(sessionMode==='guided'){startRandomFromActiveModules(guidedTasks)}
                else{/* libre: show hint */setRocketHint(true);setTimeout(()=>setRocketHint(false),2500)}
              }} style={{background:'none',border:'none',cursor:'pointer',padding:0}}>
                <span style={{fontSize:isPhone?56:isTabletPortrait?66:isTabletLandscape?78:84,filter:'drop-shadow(0 4px 12px rgba(0,0,0,.5))',animation:'planetFloat 3s ease-in-out infinite',display:'block'}}>🚀</span>
              </button>
              {rocketHint&&<div style={{position:'absolute',bottom:-50,left:'50%',transform:'translateX(-50%)',background:'rgba(26,26,46,.9)',border:'2px solid #F0C850',borderRadius:14,padding:'10px 18px',whiteSpace:'nowrap',fontSize:15,color:'#F0C850',fontWeight:600,fontFamily:"'Fredoka'",boxShadow:'0 4px 16px rgba(0,0,0,.4)',zIndex:10,animation:'fadeIn .3s'}}>🪐 ¡Elige un planeta!</div>}
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
                  const canTapPlanet=sessionMode==='free'&&hasActive;
                  return <button key={g.id} disabled={!canTapPlanet} onClick={()=>{if(!canTapPlanet)return;setOpenGroup(g.id);const firstMod=g.modules.find(m=>activeMods[m.lvKey]!==false);if(firstMod){setSec(firstMod.k);setSecLv(getModuleLvOrDef(firstMod.lvKey,firstMod.defLv));if(firstMod.lvKey){curPresLvKeyRef.current=firstMod.lvKey;setSelModKey(firstMod.lvKey)}}}} style={{
                    position:'absolute',left:cx,top:cy,width:planetSize,height:planetSize+22,
                    padding:0,border:'none',background:'none',cursor:canTapPlanet?'pointer':'default',fontFamily:"'Fredoka'",color:TXT,
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
              return <button key={g.id} onClick={()=>{setOpenGroup(g.id);const firstMod=g.modules.find(m=>activeMods[m.lvKey]!==false);if(firstMod){setSec(firstMod.k);setSecLv(getModuleLvOrDef(firstMod.lvKey,firstMod.defLv));if(firstMod.lvKey){curPresLvKeyRef.current=firstMod.lvKey;setSelModKey(firstMod.lvKey)}}}} style={{
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
                  const isActive=m.lvKey?(selModKey===m.lvKey):(sec===m.k&&String(secLv)===String(mLv));
                  const subSize=modCount<=3?100:modCount<=5?88:76;
                  return <button key={mi} onClick={()=>{setSec(m.k);setSecLv(mLv);if(m.lvKey){curPresLvKeyRef.current=m.lvKey;setSelModKey(m.lvKey)}}} style={{
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
        <button onClick={()=>{warmUpTTS();startGame()}} style={{
          width:80,height:80,borderRadius:'50%',border:'none',cursor:'pointer',
          background:'none',padding:0,fontFamily:"'Fredoka'",
          animation:'planetFloat 3s ease-in-out infinite',transition:'transform .15s',
        }}>
          <span style={{fontSize:52,display:'block',filter:'drop-shadow(0 3px 8px rgba(0,0,0,.4))'}}>🚀</span>
        </button>
      </div>}
    </div>}

    {/* M7b: Module transition overlay */}
    {randomTransition&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,animation:'fadeIn .2s'}}><div style={{textAlign:'center',animation:'bounceIn .4s'}}>
      <div style={{fontSize:80,marginBottom:8}}>{randomTransition.emoji}</div>
      <h2 style={{fontSize:28,color:GOLD,fontWeight:800,margin:0}}>{randomTransition.name}</h2>
    </div></div>}
    {/* Goal mode: fixed top progress bar */}
    {scr==='game'&&sessionType==='goal'&&<div>
      <div style={{position:'fixed',top:0,left:0,right:0,height:6,background:'#333',zIndex:1000}}>
        <div style={{width:`${Math.min((goalCount/sessionGoal)*100,100)}%`,height:'100%',background:'#2ECC71',transition:'width 0.3s ease'}}/>
      </div>
      <div style={{position:'fixed',top:8,right:12,fontSize:13,color:'#FFD700',fontWeight:600,zIndex:1001,fontFamily:"'Fredoka'"}}>{goalCount} / {sessionGoal}</div>
    </div>}
    {/* TokiBreak overlay */}
    {showTokiBreak&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:9999}}>
      <Suspense fallback={<LazyFallback/>}><TokiPlayground countdown={60} feedMode={user&&canFeedDog(user.id)} onContinue={()=>{setShowTokiBreak(false);setResumeKey(k=>k+1);if(user&&canFeedDog(user.id)){feedDog(user.id);setDogFedToday(true)}}}/></Suspense>
    </div>}
    {/* Companion screen - accessible from goals */}
    {showCompanion&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:9999}}>
      <Suspense fallback={<LazyFallback/>}><TokiPlayground countdown={60} feedMode={user&&canFeedDog(user.id)} onContinue={()=>{setShowCompanion(false);setResumeKey(k=>k+1);if(user&&canFeedDog(user.id)){feedDog(user.id);setDogFedToday(true)}}}/></Suspense>
    </div>}
    {scr==='game'&&cur&&<div className="af" onClick={pokeActive} onTouchStart={pokeActive} style={gameShellStyle}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:isPhone?8:12,marginBottom:isPhone?6:8,flexWrap:'wrap'}}><div style={{display:'flex',alignItems:'center',gap:4}}><button style={{background:'none',border:'none',color:DIM,fontSize:isPhone?15:16,padding:'10px 8px',minHeight:48,cursor:'pointer',fontFamily:"'Fredoka'"}} onClick={()=>{if(randomActive){if(randomTimerRef.current)clearInterval(randomTimerRef.current);setRandomActive(false)}tryExit()}}>✕ Salir</button>{sec==='decir'&&user&&getDynamicDilo(user.id)&&!randomActive&&<span style={{fontSize:14,color:GOLD,fontWeight:700}} title={'Modo dinámico N'+getDynamicDiloLevel(user.id)}>🎯 N{getDynamicDiloLevel(user.id)}</span>}</div><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{position:'relative',width:36,height:36}}><SpaceMascot mood={mascotMood} size={52} tier={getMascotTier(user?.totalStars3plus||0)} cycle={getMascotCycle(user?.totalStars3plus||0)}/></div>{user&&<DogMascot mood={mascotMood} phase={getDogPhase(getDogGrowth(user.id))} interactive={false} size={isPhone?34:isTabletLandscape?42:36}/>}{/* Avatar del niño con badge de evolución diaria */}
        <div style={{position:'relative',cursor:'pointer'}} onClick={()=>setShowAstroOverlay(true)}>
          {user?.photo?<img src={user.photo} alt="" style={{width:isPhone?36:42,height:isPhone?36:42,borderRadius:'50%',border:`2px solid ${getDailyPhase(dailyCount)>=2?GOLD:'rgba(255,255,255,.3)'}`,objectFit:'cover'}}/>
          :<div style={{width:isPhone?36:42,height:isPhone?36:42,borderRadius:'50%',border:`2px solid ${getDailyPhase(dailyCount)>=2?GOLD:'rgba(255,255,255,.3)'}`,background:'rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:isPhone?18:22}}>{user?.name?user.name[0].toUpperCase():'👤'}</div>}
          {getDailyPhase(dailyCount)>=2&&<div style={{position:'absolute',top:-4,right:-4,fontSize:getDailyPhase(dailyCount)>=4?16:getDailyPhase(dailyCount)>=3?14:12,filter:'drop-shadow(0 1px 3px rgba(0,0,0,.5))',animation:getDailyPhase(dailyCount)>=3?'astro-glow 2s ease-in-out infinite':'none'}}>{getDailyPhase(dailyCount)>=4?'👑':getDailyPhase(dailyCount)>=3?'🦸':'⭐'}</div>}
        </div>
        <span style={{fontSize:15,color:GOLD,fontWeight:700,fontFamily:"'Fredoka'"}}>{dailyCount}</span>
        {/* Session timer — small, only when time-based */}
        {sessionType==='time'&&<span style={{fontSize:12,color:'rgba(255,255,255,.35)',fontWeight:600}}>{randomActive?`${Math.floor(randomTimer/60)}:${String(randomTimer%60).padStart(2,'0')}`:`${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`}</span>}
</div></div>
      {/* M7b: Module icon bar for random sessions */}
      {randomActive&&randomModOrder.current.length>0&&<div style={{display:'flex',justifyContent:'center',gap:6,marginBottom:8}}>
        {randomModOrder.current.map((m,i)=>{
          const isCur=cur._randomModule===m.lvKey;
          return <div key={m.lvKey} style={{
            width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
            background:isCur?GOLD+'33':'rgba(255,255,255,.08)',
            border:isCur?'2px solid '+GOLD:'2px solid transparent',
            transition:'all .2s',fontSize:16,
            opacity:isCur?1:0.5,
          }} title={m.name}>{m.emoji}</div>})}
      </div>}
      {correctStreak>=2&&<div style={{position:'absolute',top:randomActive?86:48,right:16,background:'rgba(255,100,0,.9)',borderRadius:20,padding:'4px 12px',fontSize:14,fontWeight:700,color:'#fff',fontFamily:"'Fredoka'",zIndex:10,animation:'bounceIn .3s'}}>{correctStreak>=5?'🔥🔥':correctStreak>=3?'🔥':'⚡'} x{correctStreak}</div>}
      <div className="pbar" style={{marginBottom:isPhone?8:10}}><div className="pfill" style={{width:sessionType==='goal'?Math.min(100,(goalCount/sessionGoal)*100)+'%':randomActive?Math.min(100,(1-randomTimer/(randomTime*60))*100)+'%':(sessionTime||sm)===0?'0%':Math.min(100,(elapsed/60)/(sessionTime||sm)*100)+'%'}}/></div>
      {/* Session counter - compact 2-line display */}
      <div style={{display:'flex',justifyContent:'center',gap:isPhone?10:14,alignItems:'center',margin:'4px 0',fontSize:isPhone?14:isTabletLandscape?17:15,fontWeight:700,fontFamily:"'Fredoka'",flexWrap:'wrap'}}>
        <span style={{color:GOLD}}>⭐ {st.ok}{sessionType==='goal'?'/'+sessionGoal:''}</span>
        <span style={{color:'rgba(255,255,255,.3)'}}>│</span>
        <span style={{color:'#E67E22'}}>🔥 {Math.floor(((Date.now()-(ss||Date.now()))/60000))}min</span>
        {sessionType==='goal'&&<><span style={{color:'rgba(255,255,255,.3)'}}>│</span><span style={{color:GREEN}}>{Math.round((st.ok/Math.max(1,sessionGoal))*100)}%</span></>}
      </div>
      <div key={'ex_'+idx+'_'+resumeKey} style={{marginTop:isPhone?6:10,minHeight:'min(58dvh,620px)',display:'flex',flexDirection:'column',justifyContent:'flex-start'}}>
        {cur.ty==='frases'&&<ExFrases ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/>}
        {cur.ty==='frases_blank'&&<ExFrasesBlank ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/>}
        {cur.ty==='sit'&&<ExSit ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/>}
        {cur.ty==='flu'&&<ExFlu ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids} burstMode={burstMode} burstSpeed={burstSpeed} burstReps={burstReps} exerciseNum={st.ok+st.sk} fraccionado={fraccionado} onPause={pauseSession}/>}
        {cur.ty==='count'&&<ExCount ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/>}
        {cur.ty==='math'&&<Suspense fallback={<LazyFallback/>}><ExMath ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/></Suspense>}
        {cur.ty==='multi'&&<Suspense fallback={<LazyFallback/>}><ExMulti ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/></Suspense>}
        {cur.ty==='frac'&&<Suspense fallback={<LazyFallback/>}><ExFraction ex={cur} onOk={onOk} onSkip={onSk} name={user.name} onPause={pauseSession}/></Suspense>}
        {cur.ty==='money'&&<Suspense fallback={<LazyFallback/>}><ExMoney ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/></Suspense>}
        {cur.ty==='clock'&&<Suspense fallback={<LazyFallback/>}><ExClock ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/></Suspense>}
        {cur.ty==='calendar'&&<Suspense fallback={<LazyFallback/>}><ExCalendar ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/></Suspense>}
        {cur.ty==='distribute'&&<Suspense fallback={<LazyFallback/>}><ExDistribute ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/></Suspense>}
        {cur.ty==='writing'&&<Suspense fallback={<LazyFallback/>}><ExWriting ex={cur} onOk={onOk} onSkip={onSk} name={user.name} onPause={pauseSession}/></Suspense>}
        {cur.ty==='razona'&&<Suspense fallback={<LazyFallback/>}><ExRazona ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/></Suspense>}
        {cur.ty==='lee'&&<Suspense fallback={<LazyFallback/>}><ExLee ex={cur} onOk={onOk} onSkip={onSk} name={user.name} uid={user.id} vids={vids} onPause={pauseSession}/></Suspense>}
        {cur.ty==='quiensoy'&&<Suspense fallback={<LazyFallback/>}><ExQuienSoyUnified ex={cur} onOk={onOk} onSkip={onSk} sex={user.sex} name={user.name} uid={user.id} vids={vids} presentation={cur.presentation||null} canToggle={cur.canToggle!==undefined?cur.canToggle:true} defaultMode={cur.defaultMode||'estudio'} burstMode={burstMode} burstSpeed={burstSpeed} burstReps={burstReps}/></Suspense>}
      </div>
      {/* Global pause button — visible para TODOS los ejercicios no-orales.
          Los orales (SpeakPanel) ya tienen su propio dock con pausa integrada. */}
      {cur&&!['flu','frases','frases_blank','sit','quiensoy'].includes(cur.ty)&&!paused&&
        <button onClick={pauseSession} title="Pausar" style={{position:'fixed',left:'calc(var(--safe-left) + 14px)',bottom:'calc(var(--safe-bottom) + 14px)',width:60,height:60,borderRadius:'50%',border:'none',cursor:'pointer',background:'radial-gradient(circle at 30% 25%,#FFB74D,#FF9800 60%,#E65100)',boxShadow:'0 3px 12px #FF980066, inset 0 -3px 8px #E6510066',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Fredoka'",zIndex:20,fontSize:26}}>⏸️</button>}
      </div>}
    {/* === PAUSE OVERLAY === */}
    {paused&&ss&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:300,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20}}>
      <div style={{fontSize:60}}>⏸️</div>
      <div style={{fontSize:28,fontWeight:800,color:'#fff',fontFamily:"'Fredoka'"}}>En pausa</div>
      {showSnooze&&<div style={{fontSize:16,color:'#FFD54F',marginBottom:8,fontFamily:"'Fredoka'"}}>🐕 ¡Toki te está esperando!</div>}
      <button onClick={resumeSession} style={{background:'#4CAF50',color:'#fff',border:'none',borderRadius:20,padding:'14px 40px',fontSize:20,fontWeight:700,cursor:'pointer',fontFamily:"'Fredoka'"}}>
        ▶️ Continuar
      </button>
      {showSnooze&&<button onClick={snoozeSession} style={{background:'none',border:'1px solid rgba(255,255,255,.3)',color:'rgba(255,255,255,.6)',borderRadius:16,padding:'8px 24px',fontSize:14,cursor:'pointer',marginTop:8,fontFamily:"'Fredoka'"}}>
        😴 Posponer 4 min
      </button>}
    </div>}
  </div>}
