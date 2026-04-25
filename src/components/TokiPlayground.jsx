import React, { useEffect, useRef, useState, useCallback } from "react";
import { sayFB, stopVoice } from '../voice.js';

// Bark sound — ladrido más orgánico: dos ladridos con cuerpo sonoro.
// Cada ladrido combina un oscilador sawtooth (ataque) + un oscilador triangle
// (armonico bajo) para dar "boca" al sonido, con filtro paso-banda y envolvente
// rápida de volumen. Más parecido a un perro real que el cuadrado plano anterior.
function playBark(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    function woof(delay,f0,f1,dur,vol){
      const t=ctx.currentTime+delay;
      // Filtro que modela la cavidad bucal del perro
      const bp=ctx.createBiquadFilter();
      bp.type='bandpass';
      bp.frequency.setValueAtTime(600,t);
      bp.frequency.exponentialRampToValueAtTime(300,t+dur);
      bp.Q.value=2.2;
      // Tono principal (saw — voz rasposa)
      const o1=ctx.createOscillator();const g1=ctx.createGain();
      o1.type='sawtooth';
      o1.frequency.setValueAtTime(f0,t);
      o1.frequency.exponentialRampToValueAtTime(f1,t+dur);
      // Tono armónico (triangle — cuerpo grave)
      const o2=ctx.createOscillator();const g2=ctx.createGain();
      o2.type='triangle';
      o2.frequency.setValueAtTime(f0*0.5,t);
      o2.frequency.exponentialRampToValueAtTime(f1*0.5,t+dur);
      // Envolvente: ataque rápido, decaimiento exponencial
      g1.gain.setValueAtTime(0.001,t);
      g1.gain.exponentialRampToValueAtTime(vol,t+0.015);
      g1.gain.exponentialRampToValueAtTime(0.001,t+dur);
      g2.gain.setValueAtTime(0.001,t);
      g2.gain.exponentialRampToValueAtTime(vol*0.6,t+0.02);
      g2.gain.exponentialRampToValueAtTime(0.001,t+dur);
      // Conexiones
      o1.connect(g1);g1.connect(bp);
      o2.connect(g2);g2.connect(bp);
      bp.connect(ctx.destination);
      o1.start(t);o1.stop(t+dur+0.02);
      o2.start(t);o2.stop(t+dur+0.02);
    }
    // Dos ladridos con pitch ligeramente distinto, como perro real
    woof(0,   340, 180, 0.18, 0.55);
    woof(0.28,320, 170, 0.16, 0.50);
    setTimeout(()=>ctx.close(),700);
  }catch(e){}
}

// Whine / happy sound — LOUD
function playWhine(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator();const g=ctx.createGain();
    osc.connect(g);g.connect(ctx.destination);osc.type='sine';
    osc.frequency.setValueAtTime(600,ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(900,ctx.currentTime+0.3);
    osc.frequency.linearRampToValueAtTime(700,ctx.currentTime+0.5);
    g.gain.setValueAtTime(0.35,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.55);
    osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.55);
    setTimeout(()=>ctx.close(),700);
  }catch(e){}
}

// ============================================================
// COMANDOS DE VOZ — Lista editable (ver scripts/extract-toki-commands.mjs
// para exportar a JSON revisable por Diego y re-importar con apply-toki-commands.mjs)
// ============================================================
// Estructura: {id, patterns: [palabras/frases detonantes], response: texto que dice Toki}
// Nota: response NO debe contener letras repetidas tipo "Zzzzz" o "mmmm" porque el TTS
// las lee literalmente. Usa frases cortas naturales.
const VOICE_COMMANDS=[
  // ── Identidad / Saludos ──────────────────────────────────
  {id:'hello',patterns:['hola','hello','hey','toki','buenos dias','buenas tardes','buenas noches','buenas','saludar','saludo'],response:'¡Hola {nombre}! ¡Guau guau!'},
  {id:'name',patterns:['cómo te llamas','como te llamas','tu nombre','cual es tu nombre','cuál es tu nombre','quién eres','quien eres','te llamas'],response:'Me llamo Toki. Me gusta que me hables, {nombre}.'},
  {id:'age',patterns:['cuántos años','cuantos años','cuantos anos','que edad','qué edad','eres viejo','eres pequeño'],response:'Soy un cachorrito, siempre quiero aprender contigo.'},
  {id:'howru',patterns:['cómo estás','como estas','qué tal','que tal','estás bien','estas bien','estás feliz','como te encuentras'],response:'¡Estoy genial porque estás contigo, {nombre}!'},
  {id:'whatdoing',patterns:['qué haces','que haces','en qué piensas','que piensas','estás jugando'],response:'Te estoy esperando a ti, {nombre}.'},
  {id:'who_friend',patterns:['eres mi amigo','somos amigos','mejor amigo','mi amiguito'],response:'¡Sí! Eres mi mejor amigo, {nombre}.'},
  {id:'me_quieres',patterns:['me quieres','tú me quieres','tu me quieres','te gusto','me amas'],response:'¡Claro que te quiero, {nombre}! Muchísimo.'},
  {id:'tired',patterns:['tienes sueño','estas cansado','estás cansado','tienes sueno','te aburres','estas aburrido'],response:'Un poquito. Pero contigo nunca me aburro, {nombre}.'},

  // ── Afecto ───────────────────────────────────────────────
  {id:'love',patterns:['te quiero','love','cariño','guapo','bonito','bueno','precioso','lindo','mono','te amo','eres bueno','eres el mejor'],response:'¡Y yo también te quiero, {nombre}!'},
  {id:'kiss',patterns:['beso','besito','kiss','muack','mua','muac','dame un beso','besos'],response:'¡Muuuak! Un beso para ti.'},
  {id:'hug',patterns:['abrazo','dame un abrazo','abracito','abrazame','abrázame','achuchon'],response:'¡Un abrazo muy fuerte, {nombre}!'},

  // ── Movimiento / Trucos ──────────────────────────────────
  {id:'dance',patterns:['baila','dance','bailar','bailando','baile','a bailar'],response:'¡Mira cómo bailo!'},
  {id:'jump',patterns:['salta','saltar','salto','jump','arriba','bota','brinco','brinca','dale un salto'],response:'¡Allá voy!'},
  {id:'spin',patterns:['gira','girar','vuelta','spin','la cola','persigue','dar vuelta','da vuelta','giro','date una vuelta'],response:'¡Voy a pillarla!'},
  {id:'roll',patterns:['rueda','rolar','roll','voltea','voltereta','ruedas','hazme una voltereta'],response:'¡Mira qué bien ruedo!'},
  {id:'floss',patterns:['floss','fortnite','baile viral','baile moderno'],response:'¡Floss! ¡Como en Fortnite!'},
  {id:'sit',patterns:['sienta','sentado','siéntate','sientate','quieto','para','sit'],response:'¡Ya estoy sentado!'},
  {id:'paw',patterns:['pata','dame la pata','choca','shake','mano','dame','patita','cinco','choca esos cinco'],response:'¡Choca esos cinco!'},
  {id:'down',patterns:['túmbate','tumbate','tumba','tumbado','suelo','échate','echate','abajo','al suelo','down'],response:'¡Ya estoy tumbado!'},
  {id:'sleep',patterns:['duerme','dormir','nana','sleep','a dormir','descansa','duérmete','duermete','buenas noches'],response:'Voy a dormir un ratito.'},
  {id:'wake',patterns:['despierta','arriba','levanta','levántate','ya es de día','buenos dias'],response:'¡Guau! ¡Ya estoy despierto!'},

  // ── Sonidos ──────────────────────────────────────────────
  {id:'bark',patterns:['ladra','ladrar','guau','woof','habla','di algo','ladrido','bark','voz','haz ruido'],response:null},
  {id:'quiet',patterns:['calla','silencio','callate','cállate','shhh','no ladres','no hables'],response:'Vale. Me callo.'},

  // ── Comida ───────────────────────────────────────────────
  {id:'hungry',patterns:['tienes hambre','hambre','comer','come','comida','galleta','premio','treat','ñam','croqueta','te doy de comer','a comer'],response:'¡Ñam ñam! ¡Gracias!'},

  // ── Juegos ───────────────────────────────────────────────
  {id:'fetch',patterns:['busca','trae','pelota','ball','fetch','coge','atrapa'],response:'¡Sí! ¡Vamos a jugar!'},
  {id:'play_with_me',patterns:['quieres jugar conmigo','juguemos','vamos a jugar','quieres jugar','jugamos'],response:'¡Sí! ¡Me encanta jugar contigo, {nombre}!'},
  {id:'play_hide',patterns:['escondidas','escondite','jugamos al escondite','juguemos al escondite','juega al escondite'],response:null},

  // ── Motivación / Elogios ─────────────────────────────────
  {id:'brave',patterns:['valiente','fuerte','héroe','heroe','súper','super','campeón','campeon','crack','fuerza','eres un campeón'],response:'¡Soy Súper Toki!'},
  {id:'happy',patterns:['contento','feliz','alegre','happy','bien','genial','de maravilla'],response:'¡Yo también estoy feliz!'},
  {id:'toki_praise',patterns:['eres bonito','eres guapo','qué listo','que listo','eres un genio','bien hecho toki','buen chico','buena chica'],response:'¡Gracias, {nombre}! Eres el mejor amigo.'},

  // ── Cuidados ─────────────────────────────────────────────
  {id:'pet',patterns:['caricias','acariciar','te acaricio','mimos','mímame','mimame','te hago caricias'],response:'¡Ohhh! Qué gusto.'},
  {id:'walk',patterns:['paseo','a pasear','vamos de paseo','al parque','paseito'],response:'¡Al parque! ¡Vamos!'},
  {id:'bath',patterns:['baño','bañarte','ducha','te lavo','a la ducha'],response:'Me gusta el agua.'},

  // ── Despedida ────────────────────────────────────────────
  {id:'bye',patterns:['adios','adiós','chao','hasta luego','me voy','nos vemos','bye','hasta mañana'],response:'¡Hasta luego, {nombre}! ¡Te estaré esperando!'},
];

function simpleLev(a,b){if(a===b)return 0;const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}
function matchCommand(text){
  if(!text)return null;
  const t=text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  // Exact substring match first
  for(const cmd of VOICE_COMMANDS){
    for(const p of cmd.patterns){
      const pn=p.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(t.includes(pn))return cmd;
    }
  }
  // Fuzzy match: allow 1-2 char distance for kid pronunciation
  const words=t.split(/\s+/);
  for(const cmd of VOICE_COMMANDS){
    for(const p of cmd.patterns){
      const pn=p.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(pn.includes(' '))continue; // skip multi-word patterns for fuzzy
      const maxDist=pn.length<=3?1:2;
      if(words.some(w=>simpleLev(w,pn)<=maxDist))return cmd;
    }
  }
  return null;
}

// Reemplaza {nombre} en el response con el nombre del niño. Se ejecuta antes
// de mostrar el bocadillo y antes del TTS, así ambos dicen lo mismo.
function personalizeResponse(resp, name) {
  if (!resp) return resp;
  if (!name) return resp.replace(/,?\s*\{nombre\}/g, '');
  return resp.replace(/\{nombre\}/g, name);
}

export default function TokiPlayground({
  size = 380,
  feedMode = false,
  countdown = null,
  onContinue,
  milestone = 0, // 0/100/200/300 — mayor logro alcanzado HOY
  name = '',     // nombre del niño (para personalización)
  userId = '',   // para persistir estado del escondite
}) {
  const [state, setState] = useState("idle");
  const [isLying, setIsLying] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [tailFast, setTailFast] = useState(false);
  const [showTongue, setShowTongue] = useState(false);
  const [showWoof, setShowWoof] = useState(false);
  const [purrSpark, setPurrSpark] = useState(false);
  const [draggingBack, setDraggingBack] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [voiceHint, setVoiceHint] = useState('🎤 Háblale a Toki');
  const [voiceActive, setVoiceActive] = useState(false);
  const [trickAnim, setTrickAnim] = useState(null); // 'jump','spin','floss','sit','paw','roll'
  const [speechBubble, setSpeechBubble] = useState(null);
  const srRef = useRef(null);
  const voiceTimeout = useRef(null);

  const [bowlPos, setBowlPos] = useState({ x: 150, y: 270 });
  const [draggingBowl, setDraggingBowl] = useState(false);
  const [bowlFed, setBowlFed] = useState(false);

  const [progress, setProgress] = useState(0);

  // ── Escondite ──
  // hsPhase: null | 'toki_count' | 'toki_seek' | 'child_count' | 'toki_hide'
  const [hsPhase, setHsPhase] = useState(null);
  const [hsHideSide, setHsHideSide] = useState(null); // 'top'|'bottom'|'left'|'right'
  const hsTimers = useRef([]);
  const hsSR = useRef(null);
  const startHideSeekRef = useRef(null);

  const idleTimer = useRef(null);
  const barkTimer = useRef(null);
  const actionTimer = useRef(null);
  const continueTimer = useRef(null);
  const countdownInterval = useRef(null);

  const svgRef = useRef(null);
  const bowlPointerId = useRef(null);
  const mountedRef = useRef(true);

  const tokiTarget = { x: 150, y: 206 };

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (state === "eating") return;
    idleTimer.current = setTimeout(() => {
      if (!mountedRef.current) return;
      // First yawn, then bark if still idle
      setState("yawn");
      setIsLying(false);
      setEyesClosed(true);
      setShowTongue(false);
      setTailFast(false);
      setMouthOpen(false);
      actionTimer.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setState("idle");
        setEyesClosed(false);
        // Bark after yawn if still idle
        barkTimer.current = setTimeout(() => {
          if (!mountedRef.current) return;
          if (state !== "eating") bark();
        }, 3000);
      }, 1500);
    }, 4000);
  };

  useEffect(() => {
    resetIdleTimer();
    continueTimer.current = setTimeout(() => setShowContinue(true), 5000);

    // Saludo de bienvenida según logro del día. Si aún no hay hit, Toki saluda normal.
    // Se dispara una vez al entrar, con retraso para no pisar otras TTS.
    const greetTimer = setTimeout(() => {
      let greet = null;
      if (milestone >= 300) greet = '¡Hoy has hecho trescientos ejercicios! Ahora te mereces un descanso bien merecido.';
      else if (milestone >= 200) greet = '¡Doscientos ejercicios hoy! Estás que te sale todo.';
      else if (milestone >= 100) greet = '¡Qué bien trabajas hoy! Llevas cien ejercicios.';
      else if (feedMode) greet = '¡Guau! Tengo hambre. ¿Me das de comer?';
      else greet = '¡Hola! Qué bien verte.';
      if (greet) {
        setSpeechBubble(greet);
        sayFB(greet);
        setTimeout(() => setSpeechBubble(null), 4500);
      }
    }, 800);

    if (typeof countdown === "number" && countdown > 0) {
      setProgress(0);
      const startedAt = Date.now();
      countdownInterval.current = setInterval(() => {
        const elapsed = (Date.now() - startedAt) / 1000;
        const pct = Math.max(0, Math.min(100, (elapsed / countdown) * 100));
        setProgress(pct);
        if (pct >= 100) clearInterval(countdownInterval.current);
      }, 100);
    }

    return () => {
      mountedRef.current = false;
      clearTimeout(greetTimer);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (barkTimer.current) clearTimeout(barkTimer.current);
      if (actionTimer.current) clearTimeout(actionTimer.current);
      if (continueTimer.current) clearTimeout(continueTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      // Escondite
      hsTimers.current.forEach(t => clearTimeout(t));
      hsTimers.current = [];
      if (hsSR.current) { try { hsSR.current.abort(); } catch(e){} hsSR.current = null; }
      // Stop any TTS/audio that Toki might be producing
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch(e) {}
    };
  }, []);

  useEffect(() => {
    if (!feedMode) {
      setBowlPos({ x: 150, y: 270 });
      setDraggingBowl(false);
      setBowlFed(false);
    }
  }, [feedMode]);

  const svgPoint = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 150, y: 270 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 300,
      y: ((clientY - rect.top) / rect.height) * 300,
    };
  };

  const setEatingState = () => {
    if (actionTimer.current) clearTimeout(actionTimer.current);
    setState("eating");
    setIsLying(false);
    setEyesClosed(true);
    setTailFast(true);
    setShowTongue(false);
    setMouthOpen(false);
    setShowWoof(false);
    setPurrSpark(false);
    setDraggingBack(false);
    setBowlFed(true);
    setBowlPos({ x: 178, y: 228 });

    actionTimer.current = setTimeout(() => {
      setState("idle");
      setEyesClosed(false);
      setTailFast(false);
    }, 2200);
  };

  const pokeHead = () => {
    resetIdleTimer();
    if (state === "eating") return;
    if (actionTimer.current) clearTimeout(actionTimer.current);
    setState("happy");
    setIsLying(false);
    setEyesClosed(true);
    setTailFast(true);
    setShowTongue(false);
    setMouthOpen(false);
    actionTimer.current = setTimeout(() => {
      setState("idle");
      setEyesClosed(false);
      setTailFast(false);
    }, 1400);
  };

  const pokeBelly = () => {
    resetIdleTimer();
    if (state === "eating") return;
    if (actionTimer.current) clearTimeout(actionTimer.current);
    setState("belly");
    setIsLying(true);
    setShowTongue(true);
    setEyesClosed(false);
    setTailFast(false);
    setMouthOpen(false);
    actionTimer.current = setTimeout(() => {
      setState("idle");
      setIsLying(false);
      setShowTongue(false);
    }, 1800);
  };

  const bark = () => {
    resetIdleTimer();
    if (state === "eating") return;
    if (barkTimer.current) clearTimeout(barkTimer.current);
    if (actionTimer.current) clearTimeout(actionTimer.current);
    setState("bark");
    setIsLying(false);
    setMouthOpen(true);
    setShowWoof(true);
    setTailFast(true);
    setEyesClosed(false);
    playBark();
    barkTimer.current = setTimeout(() => {
      setState("idle");
      setMouthOpen(false);
      setShowWoof(false);
      setTailFast(false);
    }, 900);
  };

  const startBackDrag = () => {
    resetIdleTimer();
    if (state === "eating") return;
    if (actionTimer.current) clearTimeout(actionTimer.current);
    setDraggingBack(true);
    setState("purr");
    setPurrSpark(true);
    setTailFast(true);
    setEyesClosed(true);
  };

  const endBackDrag = () => {
    if (state === "eating") return;
    setDraggingBack(false);
    setState("idle");
    setPurrSpark(false);
    setTailFast(false);
    setEyesClosed(false);
    resetIdleTimer();
  };

  const startBowlDrag = (e) => {
    if (!feedMode || bowlFed) return;
    resetIdleTimer();
    bowlPointerId.current = e.pointerId;
    setDraggingBowl(true);
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const moveBowlDrag = (e) => {
    if (!draggingBowl || !feedMode || bowlFed) return;
    const p = svgPoint(e.clientX, e.clientY);
    setBowlPos({
      x: Math.max(48, Math.min(252, p.x)),
      y: Math.max(60, Math.min(278, p.y)),
    });
  };

  const endBowlDrag = () => {
    if (!draggingBowl) return;
    setDraggingBowl(false);

    const dx = bowlPos.x - tokiTarget.x;
    const dy = bowlPos.y - tokiTarget.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 52 && !bowlFed) {
      setEatingState();
    } else if (!bowlFed) {
      setBowlPos({ x: 150, y: 270 });
    }
  };

  // ── Voice command execution ───────────────────────────────
  const execCommand = (cmd) => {
    resetIdleTimer();
    if (actionTimer.current) clearTimeout(actionTimer.current);

    // Show speech bubble AND say it out loud (con nombre del niño si corresponde)
    if (cmd.response) {
      const resp = personalizeResponse(cmd.response, name);
      setSpeechBubble(resp);
      sayFB(resp);
      setTimeout(() => setSpeechBubble(null), 2800);
    }

    switch (cmd.id) {
      case 'dance':
      case 'floss':
        setTrickAnim(cmd.id);
        setState('happy'); setTailFast(true); setEyesClosed(true);
        playWhine();
        actionTimer.current = setTimeout(() => {
          setTrickAnim(null); setState('idle'); setTailFast(false); setEyesClosed(false);
        }, 3000);
        break;
      case 'jump':
        setTrickAnim('jump');
        setState('happy'); setTailFast(true);
        playBark();
        actionTimer.current = setTimeout(() => {
          setTrickAnim(null); setState('idle'); setTailFast(false);
        }, 2000);
        break;
      case 'spin':
        setTrickAnim('spin');
        setState('happy'); setTailFast(true);
        playWhine();
        actionTimer.current = setTimeout(() => {
          setTrickAnim(null); setState('idle'); setTailFast(false);
        }, 2500);
        break;
      case 'bark':
        bark();
        break;
      case 'love':
        setState('happy'); setEyesClosed(true); setTailFast(true);
        setPurrSpark(true); playWhine();
        actionTimer.current = setTimeout(() => {
          setState('idle'); setEyesClosed(false); setTailFast(false); setPurrSpark(false);
        }, 2500);
        break;
      case 'hello':
        setState('happy'); setTailFast(true); setMouthOpen(true); setShowWoof(true);
        playBark();
        actionTimer.current = setTimeout(() => {
          setState('idle'); setTailFast(false); setMouthOpen(false); setShowWoof(false);
        }, 1500);
        break;
      case 'howru':
        setState('happy'); setTailFast(true); setShowTongue(true);
        playWhine();
        actionTimer.current = setTimeout(() => {
          setState('idle'); setTailFast(false); setShowTongue(false);
        }, 2000);
        break;
      case 'sit':
        setTrickAnim('sit');
        setState('idle'); setEyesClosed(false); setTailFast(false);
        actionTimer.current = setTimeout(() => { setTrickAnim(null); }, 3000);
        break;
      case 'paw':
        setTrickAnim('paw');
        setState('happy'); setEyesClosed(true); setTailFast(true);
        playWhine();
        actionTimer.current = setTimeout(() => {
          setTrickAnim(null); setState('idle'); setEyesClosed(false); setTailFast(false);
        }, 2500);
        break;
      case 'roll':
        setTrickAnim('roll');
        setState('happy'); setTailFast(true);
        actionTimer.current = setTimeout(() => {
          setTrickAnim(null); setState('idle'); setTailFast(false);
        }, 2500);
        break;
      case 'down':
        setTrickAnim('sit'); // reuse sit animation for lying down
        setState('belly'); setIsLying(true); setShowTongue(true); setTailFast(true);
        actionTimer.current = setTimeout(() => {
          setTrickAnim(null); setState('idle'); setIsLying(false); setShowTongue(false); setTailFast(false);
        }, 3500);
        break;
      case 'sleep':
        setState('yawn'); setEyesClosed(true); setShowTongue(false); setTailFast(false);
        setTrickAnim(null);
        actionTimer.current = setTimeout(() => {
          setState('idle'); setEyesClosed(false);
        }, 4000);
        break;
      case 'hungry':
        setEatingState();
        break;
      case 'brave':
        setTrickAnim('jump');
        setState('happy'); setTailFast(true); setPurrSpark(true);
        playBark(); setTimeout(()=>playBark(),400);
        actionTimer.current = setTimeout(() => {
          setTrickAnim(null); setState('idle'); setTailFast(false); setPurrSpark(false);
        }, 2500);
        break;
      case 'happy':
        setState('happy'); setTailFast(true); setEyesClosed(true); setShowTongue(true);
        playWhine();
        actionTimer.current = setTimeout(() => {
          setState('idle'); setTailFast(false); setEyesClosed(false); setShowTongue(false);
        }, 2500);
        break;
      case 'fetch':
        setTrickAnim('jump');
        setState('happy'); setTailFast(true);
        playBark();
        actionTimer.current = setTimeout(() => {
          setTrickAnim('spin');
          setTimeout(() => {
            setTrickAnim(null); setState('idle'); setTailFast(false);
          }, 1500);
        }, 1000);
        break;
      case 'kiss':
      case 'hug':
        setState('happy'); setEyesClosed(true); setTailFast(true); setPurrSpark(true);
        playWhine();
        actionTimer.current = setTimeout(() => {
          setState('idle'); setEyesClosed(false); setTailFast(false); setPurrSpark(false);
        }, 2500);
        break;
      case 'name':
      case 'age':
      case 'whatdoing':
      case 'who_friend':
      case 'me_quieres':
      case 'tired':
      case 'toki_praise':
        // Diálogo: cara feliz, cola moviendo, sin ladrar para que el niño oiga bien la respuesta.
        setState('happy'); setTailFast(true); setShowTongue(true); setPurrSpark(true);
        actionTimer.current = setTimeout(() => {
          setState('idle'); setTailFast(false); setShowTongue(false); setPurrSpark(false);
        }, 3000);
        break;
      case 'pet':
        setState('purr'); setEyesClosed(true); setPurrSpark(true); setTailFast(true);
        playWhine();
        actionTimer.current = setTimeout(() => {
          setState('idle'); setEyesClosed(false); setPurrSpark(false); setTailFast(false);
        }, 2500);
        break;
      case 'walk':
      case 'play_with_me':
        setTrickAnim('jump');
        setState('happy'); setTailFast(true); setMouthOpen(true); setShowWoof(true);
        playBark();
        actionTimer.current = setTimeout(() => {
          setTrickAnim(null); setState('idle'); setTailFast(false); setMouthOpen(false); setShowWoof(false);
        }, 2500);
        break;
      case 'play_hide':
        // Arranca el mini-juego del escondite (state machine a parte)
        if (startHideSeekRef.current) startHideSeekRef.current();
        break;
      case 'bath':
        setState('happy'); setTailFast(true); setShowTongue(true);
        actionTimer.current = setTimeout(() => {
          setState('idle'); setTailFast(false); setShowTongue(false);
        }, 2000);
        break;
      case 'wake':
        setState('bark'); setMouthOpen(true); setShowWoof(true); setTailFast(true);
        playBark();
        actionTimer.current = setTimeout(() => {
          setState('idle'); setMouthOpen(false); setShowWoof(false); setTailFast(false);
        }, 1500);
        break;
      case 'quiet':
        setState('idle'); setTailFast(false); setEyesClosed(false); setMouthOpen(false);
        setShowWoof(false); setShowTongue(false);
        break;
      case 'bye':
        setState('happy'); setTailFast(true); setMouthOpen(true);
        actionTimer.current = setTimeout(() => {
          setState('idle'); setTailFast(false); setMouthOpen(false);
        }, 2000);
        break;
      default:
        bark();
    }
  };

  // ── Continuous voice listening (robust restart) ────────────
  const execCommandRef = useRef(execCommand);
  execCommandRef.current = execCommand;
  const startListeningRef = useRef(null);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceHint('🎤 Voz no disponible'); return; }
    try {
      if (srRef.current) { try { srRef.current.abort(); } catch(e){} srRef.current = null; }
      if (voiceTimeout.current) { clearTimeout(voiceTimeout.current); voiceTimeout.current = null; }
      const r = new SR();
      r.lang = 'es-ES'; r.continuous = false; r.interimResults = false; r.maxAlternatives = 5;
      let handled = false;
      r.onresult = (e) => {
        handled = true;
        const alts = [];
        for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript.toLowerCase().trim());
        const text = alts.join(' ');
        const cmd = matchCommand(text);
        if (cmd) {
          setVoiceHint('🎤 ¡' + (cmd.response || 'Entendido') + '!');
          execCommandRef.current(cmd);
        } else {
          setVoiceHint('🤔 Dile: salta, baila, dame la pata...');
          setState('idle'); setTailFast(false);
          bark(); // Confused bark
        }
        // Restart listening after trick finishes
        if (voiceTimeout.current) clearTimeout(voiceTimeout.current);
        voiceTimeout.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setVoiceHint('🎤 Háblale a Toki');
          if (startListeningRef.current) startListeningRef.current();
        }, 2000);
      };
      r.onerror = () => {
        if (!handled) {
          if (voiceTimeout.current) clearTimeout(voiceTimeout.current);
          voiceTimeout.current = setTimeout(() => { if (mountedRef.current && startListeningRef.current) startListeningRef.current(); }, 1000);
        }
      };
      r.onend = () => {
        // Always restart if no result was handled
        if (!handled && !voiceTimeout.current) {
          voiceTimeout.current = setTimeout(() => { if (mountedRef.current && startListeningRef.current) startListeningRef.current(); }, 500);
        }
      };
      srRef.current = r;
      r.start();
      setVoiceActive(true);
    } catch(e) {
      console.warn('SR error', e);
      if (voiceTimeout.current) clearTimeout(voiceTimeout.current);
      voiceTimeout.current = setTimeout(() => { if (mountedRef.current && startListeningRef.current) startListeningRef.current(); }, 2000);
    }
  }, []);
  startListeningRef.current = startListening;

  const stopListening = useCallback(() => {
    if (srRef.current) { try { srRef.current.abort(); } catch(e){} srRef.current = null; }
    if (voiceTimeout.current) { clearTimeout(voiceTimeout.current); voiceTimeout.current = null; }
    setVoiceActive(false);
  }, []);

  // ── Juego del escondite ─────────────────────────────────────
  // Arranca con el comando 'play_hide'. Turnos alternos persistentes por niño.
  // Turno 'toki_counts' → Toki cuenta 1..10 y busca al niño.
  // Turno 'child_counts' → Toki pide al niño que cuente y luego se esconde.
  const hsWait = (ms) => new Promise(r => {
    const t = setTimeout(() => { hsTimers.current = hsTimers.current.filter(x => x !== t); r(); }, ms);
    hsTimers.current.push(t);
  });
  const hsSay = (text) => new Promise((resolve) => {
    setSpeechBubble(text);
    // Usamos sayFB y resolvemos al terminar (sayFB ya devuelve promesa)
    Promise.resolve(sayFB(text)).then(() => resolve());
  });
  const hsClearAll = () => {
    hsTimers.current.forEach(t => clearTimeout(t));
    hsTimers.current = [];
    if (hsSR.current) { try { hsSR.current.abort(); } catch(e){} hsSR.current = null; }
  };
  const hsEnd = () => {
    hsClearAll();
    setHsPhase(null);
    setHsHideSide(null);
    setSpeechBubble(null);
    // Reanudar escucha normal
    setTimeout(() => { if (mountedRef.current && startListeningRef.current) startListeningRef.current(); }, 600);
  };
  const hsGetTurn = () => {
    try { return localStorage.getItem('toki_hide_turn_' + (userId||'_')) || 'toki_counts'; } catch(e) { return 'toki_counts'; }
  };
  const hsFlipTurn = () => {
    try {
      const cur = hsGetTurn();
      localStorage.setItem('toki_hide_turn_' + (userId||'_'), cur === 'toki_counts' ? 'child_counts' : 'toki_counts');
    } catch(e) {}
  };

  const hsTokiCountsAndSeeks = async () => {
    setHsPhase('toki_count');
    setState('idle'); setEyesClosed(true); setTailFast(false);
    await hsSay('¡Vale! Cuento yo. Puedes contar conmigo.');
    if (!mountedRef.current) return;
    for (let i = 1; i <= 10; i++) {
      if (!mountedRef.current) return;
      await hsSay(String(i));
      await hsWait(250);
    }
    if (!mountedRef.current) return;
    await hsSay('¡El que no se haya escondido, tiempo ha tenido!');
    if (!mountedRef.current) return;
    // Toki busca
    setHsPhase('toki_seek');
    setState('idle'); setEyesClosed(false); setTailFast(false);
    await hsWait(500);
    await hsSay('No te veo. ¿Dónde estás?');
    if (!mountedRef.current) return;
    await hsWait(1500);
    await hsSay('Oye, ¿estás ahí?');
    if (!mountedRef.current) return;
    hsListenChildReply();
  };

  const hsListenChildReply = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { hsTimers.current.push(setTimeout(() => hsTokiWins(), 4000)); return; }
    try {
      const r = new SR();
      r.lang = 'es-ES'; r.continuous = false; r.interimResults = false; r.maxAlternatives = 3;
      let handled = false;
      r.onresult = (e) => {
        handled = true;
        const alts = [];
        for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript.toLowerCase());
        const text = alts.join(' ');
        // ¿El niño reclama que ha ganado?
        if (/he\s+ganado\s+yo|yo\s+he\s+ganado|gano\s+yo|no\s+he\s+perdido|no\s+me\s+ha/i.test(text)) {
          hsTokiConcedes();
        } else {
          hsTokiWins();
        }
      };
      r.onerror = () => { if (!handled) hsTokiWins(); };
      r.onend = () => {};
      hsSR.current = r;
      r.start();
      // Fallback: si no contesta, Toki igualmente "encuentra"
      hsTimers.current.push(setTimeout(() => {
        if (!handled) { try { r.abort(); } catch(e){} hsTokiWins(); }
      }, 7000));
    } catch(e) { hsTokiWins(); }
  };

  const hsTokiWins = async () => {
    if (!mountedRef.current) return;
    setState('bark'); setMouthOpen(true); setShowWoof(true); setTailFast(true);
    playBark();
    await hsSay('¡Ya te veo! ¡Pillado! ¡He ganado!');
    setState('idle'); setMouthOpen(false); setShowWoof(false); setTailFast(false);
    hsFlipTurn();
    await hsWait(700);
    hsEnd();
  };

  const hsTokiConcedes = async () => {
    if (!mountedRef.current) return;
    setState('idle'); setTailFast(false);
    await hsSay('Vale, has ganado tú. Pero no hagas trampa, que solo es un juego.');
    hsFlipTurn();
    await hsWait(600);
    hsEnd();
  };

  const hsChildCountsAndTokiHides = async () => {
    setHsPhase('child_count');
    setState('happy'); setTailFast(true);
    await hsSay('Te toca contar. Di: uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez.');
    if (!mountedRef.current) return;
    await hsWait(9000); // tiempo para que el niño cuente en voz alta
    if (!mountedRef.current) return;
    await hsSay('Y ahora di: el que no se haya escondido, tiempo ha tenido.');
    if (!mountedRef.current) return;
    await hsWait(2500);
    if (!mountedRef.current) return;
    // Toki se esconde
    setHsPhase('toki_hide');
    const sides = ['top','bottom','left','right'];
    const pick = sides[Math.floor(Math.random() * sides.length)];
    setHsHideSide(pick);
    setState('idle'); setTailFast(false); setEyesClosed(false);
    // Si no le encuentran en 30s, Toki gana
    hsTimers.current.push(setTimeout(() => {
      if (!mountedRef.current) return;
      (async () => {
        setHsHideSide(null);
        await hsSay('¡No me has encontrado! He ganado yo.');
        hsFlipTurn();
        await hsWait(600);
        hsEnd();
      })();
    }, 30000));
  };

  const hsOnChildFindsToki = async () => {
    if (hsPhase !== 'toki_hide') return;
    hsClearAll();
    setHsHideSide(null);
    setState('happy'); setTailFast(true); setEyesClosed(true);
    playWhine();
    await hsSay('¡Me has encontrado! ¡Has ganado!');
    hsFlipTurn();
    await hsWait(700);
    hsEnd();
  };

  const startHideSeek = () => {
    if (hsPhase) return; // ya está en marcha
    stopListening(); // pausa escucha normal mientras dure el juego
    const turn = hsGetTurn();
    setSpeechBubble(null);
    if (turn === 'toki_counts') hsTokiCountsAndSeeks();
    else hsChildCountsAndTokiHides();
  };
  startHideSeekRef.current = startHideSeek;

  // Start voice listening on mount.
  // Si venimos desde una sesión de ejercicios, otros SpeechRecognition pueden
  // estar vivos y secuestrar el micro. Abortamos TTS + pedimos permiso micro
  // explícitamente antes de iniciar el SR de Toki para que siempre arranque.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try { stopVoice(); } catch(e) {}
      try { window.dispatchEvent(new Event('toki-sos')); } catch(e) {}
      // Re-ask mic permission: esto fuerza a cerrar cualquier SR previo retenido
      // por otro componente que se haya desmontado sin limpiar.
      try {
        if (navigator.mediaDevices) {
          const s = await navigator.mediaDevices.getUserMedia({ audio: true });
          s.getTracks().forEach(t => t.stop());
        }
      } catch(e) { /* usuario denegó o no hay permiso */ }
      if (cancelled) return;
      // Pequeño delay para asegurar que la limpieza previa terminó
      setTimeout(() => { if (!cancelled) startListening(); }, 400);
    })();
    return () => { cancelled = true; stopListening(); };
  }, []);

  const renderEyes = () => {
    if (eyesClosed || state === "happy" || state === "yawn" || state === "eating") {
      return (
        <>
          <path d="M110 132 Q124 144 138 132" fill="none" stroke="#221B18" strokeWidth="5" strokeLinecap="round" />
          <path d="M162 132 Q176 144 190 132" fill="none" stroke="#221B18" strokeWidth="5" strokeLinecap="round" />
        </>
      );
    }
    if (state === "purr") {
      return (
        <>
          <path d="M108 131 Q124 145 140 131" fill="none" stroke="#221B18" strokeWidth="5" strokeLinecap="round" />
          <path d="M160 131 Q176 145 192 131" fill="none" stroke="#221B18" strokeWidth="5" strokeLinecap="round" />
        </>
      );
    }
    return (
      <>
        <ellipse cx="124" cy="132" rx="13" ry="17" fill="#171717" />
        <ellipse cx="176" cy="132" rx="13" ry="17" fill="#171717" />
        <circle cx="119" cy="126" r="4.2" fill="#fff" />
        <circle cx="171" cy="126" r="4.2" fill="#fff" />
        <circle cx="127.5" cy="134.5" r="2" fill="#fff" />
        <circle cx="179.5" cy="134.5" r="2" fill="#fff" />
      </>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(180deg,#0B1D3A 0%, #122548 45%, #1A3060 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
        position: "relative",
      }}
      onPointerUp={() => { endBackDrag(); endBowlDrag(); }}
      onPointerCancel={() => { endBackDrag(); endBowlDrag(); }}
      onPointerLeave={() => { if (draggingBack) endBackDrag(); if (draggingBowl) endBowlDrag(); }}
      onPointerMove={(e) => { if (draggingBack) resetIdleTimer(); if (draggingBowl) moveBowlDrag(e); }}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Toki playground"
      >
        <style>{`
          .tp-bob{animation:tpBob 2.2s ease-in-out infinite;transform-origin:150px 180px}
          .tp-lying{animation:tpLie 1.8s ease-in-out infinite;transform-origin:150px 190px}
          .tp-tail{transform-origin:77px 192px;animation:tpTailSlow 1.6s ease-in-out infinite}
          .tp-tail-fast{animation:tpTailFast .28s ease-in-out infinite}
          .tp-mouth-bark{animation:tpBark .22s ease-in-out 3;transform-origin:150px 175px}
          .tp-tongue{animation:tpTongue .8s ease-in-out infinite;transform-origin:150px 178px}
          .tp-yawn-mouth{animation:tpYawn 1.2s ease-in-out infinite;transform-origin:150px 175px}
          .tp-eating-mouth{animation:tpChew .28s ease-in-out infinite;transform-origin:150px 177px}
          .tp-purr{animation:tpPurr .18s linear infinite}
          .tp-woof{animation:tpWoof .9s ease-out forwards}
          .tp-spark1{animation:tpSpark 1s ease-out infinite}
          .tp-spark2{animation:tpSpark 1s ease-out .25s infinite}
          .tp-spark3{animation:tpSpark 1s ease-out .5s infinite}
          .tp-cheek{animation:tpCheek .9s ease-in-out infinite}
          .tp-breathe{animation:tpBreathe 2.4s ease-in-out infinite;transform-origin:150px 180px}
          .tp-bowl{transition:transform .12s ease}
          .tp-bowl-fed{animation:tpBowlSettle .35s ease-out}
          @keyframes tpBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
          @keyframes tpLie{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(1px) rotate(-1deg)}}
          @keyframes tpTailSlow{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(14deg)}}
          @keyframes tpTailFast{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}
          @keyframes tpBark{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.28)}}
          @keyframes tpTongue{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(2px) scaleY(1.08)}}
          @keyframes tpYawn{0%,100%{transform:scale(1)}50%{transform:scale(1.28,1.5)}}
          @keyframes tpChew{0%,100%{transform:scaleX(1) scaleY(1)}50%{transform:scaleX(1.06) scaleY(1.2)}}
          @keyframes tpPurr{0%,100%{transform:translateX(0)}25%{transform:translateX(-1.2px)}75%{transform:translateX(1.2px)}}
          @keyframes tpWoof{0%{opacity:0;transform:translateY(0) scale(.7)}15%{opacity:1}100%{opacity:0;transform:translateY(-30px) scale(1.2)}}
          @keyframes tpSpark{0%{opacity:0;transform:translateY(0) scale(.6)}30%{opacity:.9}100%{opacity:0;transform:translateY(-22px) scale(1.2)}}
          @keyframes tpCheek{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
          @keyframes tpBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.012,.992)}}
          @keyframes tpBowlSettle{0%{transform:scale(.92)}100%{transform:scale(1)}}
          .tp-jump{animation:tpJump .5s ease-in-out 3;transform-origin:150px 240px}
          .tp-spin{animation:tpSpin 1.2s ease-in-out 2;transform-origin:150px 180px}
          .tp-floss{animation:tpFloss .35s ease-in-out 7;transform-origin:150px 200px}
          .tp-sit{animation:tpSit .6s ease-out forwards;transform-origin:150px 240px}
          .tp-paw{animation:tpPaw .8s ease-in-out 2;transform-origin:150px 200px}
          .tp-roll{animation:tpRoll .6s ease-in-out 3;transform-origin:150px 180px}
          .tp-bubble{animation:tpBubble 2s ease-out forwards}
          .tp-mic-pulse{animation:tpMicPulse 1.5s ease-in-out infinite}
          @keyframes tpJump{0%,100%{transform:translateY(0) scaleY(1)}15%{transform:translateY(4px) scaleY(.92)}50%{transform:translateY(-40px) scaleY(1.05)}85%{transform:translateY(2px) scaleY(.96)}}
          @keyframes tpSpin{0%{transform:translateX(0) rotate(0) scale(1)}25%{transform:translateX(40px) rotate(90deg) scale(.95)}50%{transform:translateX(0) rotate(180deg) scale(.9)}75%{transform:translateX(-40px) rotate(270deg) scale(.95)}100%{transform:translateX(0) rotate(360deg) scale(1)}}
          @keyframes tpFloss{0%,100%{transform:translateX(0) skewX(0)}25%{transform:translateX(-8px) skewX(-6deg)}75%{transform:translateX(8px) skewX(6deg)}}
          @keyframes tpSit{0%{transform:translateY(0) scaleY(1)}100%{transform:translateY(12px) scaleY(.85)}}
          @keyframes tpPaw{0%,100%{transform:rotate(0)}30%{transform:rotate(-8deg) translateY(-3px)}60%{transform:rotate(4deg)}}
          @keyframes tpRoll{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
          @keyframes tpBubble{0%{opacity:0;transform:translateY(6px) scale(.8)}10%{opacity:1;transform:translateY(0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}
          @keyframes tpMicPulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}
        `}</style>
        <ellipse cx="150" cy="258" rx="88" ry="20" fill="rgba(255,255,255,.08)"/>
        <ellipse cx="150" cy="258" rx="58" ry="12" fill="rgba(240,200,80,.12)"/>
        {showWoof&&(<g className="tp-woof"><rect x="188" y="64" rx="16" ry="16" width="70" height="34" fill="#F0C850" stroke="#d4ac0d" strokeWidth="3"/><path d="M203 95 L194 106 L194 94 Z" fill="#F0C850" stroke="#d4ac0d" strokeWidth="3" strokeLinejoin="round"/><text x="223" y="87" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1a1a2e" style={{fontFamily:"'Fredoka'"}}>woof!</text></g>)}
        {purrSpark&&(<g><circle className="tp-spark1" cx="220" cy="130" r="7" fill="rgba(240,200,80,.8)"/><circle className="tp-spark2" cx="232" cy="160" r="5" fill="rgba(255,255,255,.7)"/><circle className="tp-spark3" cx="210" cy="178" r="6" fill="rgba(46,204,113,.7)"/></g>)}
        <g className={trickAnim==='jump'?'tp-jump':trickAnim==='spin'?'tp-spin':trickAnim==='floss'?'tp-floss':trickAnim==='sit'?'tp-sit':trickAnim==='paw'?'tp-paw':trickAnim==='roll'?'tp-roll':isLying?"tp-lying":draggingBack?"tp-bob tp-purr":"tp-bob"}>
          <g className="tp-breathe">
            <g className={`tp-tail ${tailFast?"tp-tail-fast":""}`}><path d="M78 194 C52 178,48 148,70 138 C84 132,96 141,94 151 C92 159,86 164,86 172 C86 181,95 188,104 192" fill="none" stroke="#8B5A3C" strokeWidth="12" strokeLinecap="round"/></g>
            <ellipse cx="150" cy={isLying?192:186} rx={isLying?86:78} ry={isLying?48:56} fill="#C98A57"/>
            <ellipse cx="150" cy={isLying?200:196} rx={isLying?48:42} ry={isLying?28:31} fill="#FFF5EA"/>
            <ellipse cx="196" cy="174" rx="24" ry="18" fill="#A86A43" opacity="0.9"/>
            {!isLying?(<><ellipse cx="112" cy="242" rx="20" ry="12" fill="#8B5A3C"/><ellipse cx="188" cy="242" rx="20" ry="12" fill="#8B5A3C"/><ellipse cx="112" cy="238" rx="13" ry="7" fill="#E6B58A"/><ellipse cx="188" cy="238" rx="13" ry="7" fill="#E6B58A"/></>):(<><ellipse cx="92" cy="220" rx="19" ry="11" fill="#8B5A3C"/><ellipse cx="212" cy="216" rx="18" ry="10" fill="#8B5A3C"/><ellipse cx="90" cy="216" rx="12" ry="6" fill="#E6B58A"/><ellipse cx="212" cy="212" rx="11" ry="6" fill="#E6B58A"/></>)}
            <ellipse cx="150" cy="128" rx="72" ry="60" fill="#E9B886"/>
            <ellipse cx="85" cy="135" rx="20" ry="46" fill="#8B5A3C" transform={state==="happy"?"rotate(6 85 135)":"rotate(1 85 135)"}/>
            <ellipse cx="215" cy="135" rx="20" ry="46" fill="#8B5A3C" transform={state==="happy"?"rotate(-6 215 135)":"rotate(-1 215 135)"}/>
            <ellipse cx="90" cy="147" rx="11" ry="26" fill="#A66B45" opacity="0.45"/>
            <ellipse cx="210" cy="147" rx="11" ry="26" fill="#A66B45" opacity="0.45"/>
            <path d="M130 74 C139 90,139 106,130 122 C143 130,157 130,170 122 C161 106,161 90,170 74 C160 66,140 66,130 74 Z" fill="#FFFFFF" opacity="0.95"/>
            <ellipse cx="150" cy="165" rx="34" ry="24" fill="#FFF6EF"/>
            <ellipse cx="150" cy="178" rx="20" ry="11" fill="#FFF6EF"/>
            {renderEyes()}
            {state==="happy"&&(<><path d="M104 112 Q124 104 142 112" fill="none" stroke="#7A4B30" strokeWidth="3" strokeLinecap="round"/><path d="M158 112 Q176 104 196 112" fill="none" stroke="#7A4B30" strokeWidth="3" strokeLinecap="round"/></>)}
            {(state==="happy"||state==="belly"||state==="purr"||state==="eating")&&(<><ellipse className="tp-cheek" cx="108" cy="168" rx="8" ry="5" fill="#F3B2AE" opacity="0.68"/><ellipse className="tp-cheek" cx="192" cy="168" rx="8" ry="5" fill="#F3B2AE" opacity="0.68"/></>)}
            <ellipse cx="150" cy="155" rx="10" ry="7" fill="#1B1716"/>
            {state==="bark"?(<g className="tp-mouth-bark"><ellipse cx="150" cy="176" rx="14" ry="11" fill="#8F433C"/><path d="M141 173 Q150 184 159 173" fill="#F6A1B6"/></g>):state==="yawn"?(<g className="tp-yawn-mouth"><ellipse cx="150" cy="178" rx="13" ry="14" fill="#8F433C"/><ellipse cx="150" cy="181" rx="7" ry="6" fill="#F3A2B5"/></g>):state==="eating"?(<g className="tp-eating-mouth"><path d="M134 174 Q150 186 166 174" fill="none" stroke="#7A3E34" strokeWidth="4.6" strokeLinecap="round"/><ellipse cx="140" cy="176.5" rx="4.5" ry="3.2" fill="#F3C2B5" opacity="0.9"/><ellipse cx="160" cy="176.5" rx="4.5" ry="3.2" fill="#F3C2B5" opacity="0.9"/></g>):(<path d="M133 174 Q150 190 167 174" fill="none" stroke="#7A3E34" strokeWidth="4" strokeLinecap="round"/>)}
            {showTongue&&(<path className="tp-tongue" d="M142 177 Q150 198 158 177 Z" fill="#F58CA8"/>)}
            {state==="yawn"&&(<g fill="#7E74D8" fontFamily="Arial" fontWeight="700"><text x="214" y="86" fontSize="16">z</text><text x="226" y="74" fontSize="20">z</text></g>)}
          </g>
        </g>
        <circle fill="transparent" cx="150" cy="108" r="52" onPointerDown={pokeHead} style={{cursor:'pointer'}}/>
        <ellipse fill="transparent" cx="150" cy="196" rx="56" ry="42" onPointerDown={pokeBelly} style={{cursor:'pointer'}}/>
        <ellipse fill="transparent" cx="170" cy="168" rx="80" ry="42" onPointerDown={startBackDrag} style={{cursor:'grab'}}/>
        <rect x="76" y="76" width="148" height="150" fill="transparent" onClick={bark}/>
        {feedMode&&(<g className={`tp-bowl ${bowlFed?"tp-bowl-fed":""}`} transform={`translate(${bowlPos.x-26} ${bowlPos.y-16})`} onPointerDown={startBowlDrag}><ellipse cx="26" cy="25" rx="28" ry="10" fill="rgba(0,0,0,.18)"/><path d="M4 10 Q26 0 48 10 L42 26 Q26 34 10 26 Z" fill="#D58B43" stroke="#A45E20" strokeWidth="3"/><ellipse cx="26" cy="10" rx="22" ry="6.5" fill="#A45E20"/><ellipse cx="26" cy="8.5" rx="18" ry="5" fill="#8FD16A"/><circle cx="19" cy="7.8" r="2.2" fill="#6B4A2D"/><circle cx="25" cy="9.2" r="2.2" fill="#6B4A2D"/><circle cx="31" cy="7.8" r="2.2" fill="#6B4A2D"/><circle cx="36" cy="9" r="2.2" fill="#6B4A2D"/><ellipse fill="transparent" cx="26" cy="14" rx="30" ry="22" style={{cursor:'grab'}}/></g>)}
        {feedMode&&!bowlFed&&(<g opacity="0.22"><circle cx={tokiTarget.x} cy={tokiTarget.y} r="36" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 8"/></g>)}
        <g opacity="0.18"><circle cx="150" cy="108" r="50" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 8"/><ellipse cx="150" cy="196" rx="54" ry="40" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 8"/></g>
      </svg>
      {typeof countdown==="number"&&countdown>0&&(<div style={{position:"absolute",left:20,right:20,bottom:14,height:8,borderRadius:999,background:"rgba(255,255,255,.12)",overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#2ECC71,#3498DB)",borderRadius:999,transition:"width .08s linear"}}/></div>)}
      {/* Speech bubble from Toki */}
      {speechBubble&&(<div key={speechBubble} className="tp-bubble" style={{position:'absolute',top:'12%',left:'50%',transform:'translateX(-50%)',background:'#F0C850',color:'#1a1a2e',fontFamily:"'Fredoka'",fontWeight:700,fontSize:18,padding:'10px 20px',borderRadius:20,boxShadow:'0 4px 12px rgba(0,0,0,.3)',whiteSpace:'nowrap',zIndex:5,pointerEvents:'none'}}>{speechBubble}</div>)}
      {/* Voice hint */}
      <div className={voiceActive?'tp-mic-pulse':''} style={{position:'absolute',bottom:typeof countdown==='number'&&countdown>0?44:24,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,.1)',backdropFilter:'blur(6px)',color:'#ECF0F1',fontFamily:"'Fredoka'",fontWeight:600,fontSize:15,padding:'8px 18px',borderRadius:999,border:voiceActive?'2px solid rgba(46,204,113,.5)':'2px solid rgba(255,255,255,.15)',cursor:'pointer',userSelect:'none'}} onClick={()=>{if(!voiceActive)startListening();else{stopListening();setVoiceHint('🎤 Háblale a Toki')}}}>{voiceHint}</div>
      {/* Escondite: hocico de Toki asomando por uno de los lados */}
      {hsPhase==='toki_hide'&&hsHideSide&&(()=>{
        // Posicionamiento según lado: hocico asomando ~40px desde el borde.
        const base={position:'absolute',zIndex:20,cursor:'pointer',filter:'drop-shadow(0 4px 8px rgba(0,0,0,.4))'};
        const wiggle={animation:'hsSnoutWiggle 1.2s ease-in-out infinite'};
        const styleBy={
          top:   {...base,top:0,left:'50%',transform:'translateX(-50%)',...wiggle},
          bottom:{...base,bottom:0,left:'50%',transform:'translateX(-50%)',...wiggle},
          left:  {...base,left:0,top:'50%',transform:'translateY(-50%)',...wiggle},
          right: {...base,right:0,top:'50%',transform:'translateY(-50%)',...wiggle},
        }[hsHideSide];
        return <div style={styleBy} onClick={hsOnChildFindsToki} onTouchStart={hsOnChildFindsToki}>
          <style>{`@keyframes hsSnoutWiggle{0%,100%{transform:${styleBy.transform||''} translate(0,0)}50%{transform:${styleBy.transform||''} translate(${hsHideSide==='left'?'4px':hsHideSide==='right'?'-4px':'0'},${hsHideSide==='top'?'4px':hsHideSide==='bottom'?'-4px':'0'})}}`}</style>
          <svg width="88" height="70" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
            {/* Hocico + nariz */}
            <ellipse cx="60" cy="55" rx="40" ry="26" fill="#C98A57"/>
            <ellipse cx="60" cy="60" rx="26" ry="14" fill="#FFF6EF"/>
            <ellipse cx="60" cy="45" rx="10" ry="7" fill="#1B1716"/>
            <path d="M50 58 Q60 72 70 58" fill="none" stroke="#7A3E34" strokeWidth="4" strokeLinecap="round"/>
            {/* Un ojo visible, asomando */}
            <ellipse cx="42" cy="30" rx="5" ry="7" fill="#171717"/>
            <circle cx="40" cy="28" r="1.8" fill="#fff"/>
          </svg>
        </div>;
      })()}
      {showContinue&&!hsPhase&&(<button onClick={()=>{stopListening();hsClearAll();onContinue&&onContinue()}} style={{position:"absolute",right:18,bottom:typeof countdown==="number"&&countdown>0?34:18,border:"none",borderRadius:999,padding:"10px 14px",background:"rgba(255,255,255,.12)",color:"#ECF0F1",backdropFilter:"blur(4px)",fontFamily:"'Fredoka'",fontWeight:700,fontSize:14,cursor:"pointer"}}>¡Seguimos!</button>)}
    </div>
  );
}
