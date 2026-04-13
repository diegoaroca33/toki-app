import React, { useEffect, useRef, useState, useCallback } from "react";
import { sayFB } from '../voice.js';

// Bark sound — simple square wave "woof woof", loud and clear on all devices
function playBark(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    function woof(delay,freq,dur,vol){
      const t=ctx.currentTime+delay;
      const o=ctx.createOscillator();const g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.type='square';
      o.frequency.setValueAtTime(freq,t);
      o.frequency.exponentialRampToValueAtTime(freq*0.5,t+dur);
      g.gain.setValueAtTime(vol,t);
      g.gain.setValueAtTime(vol,t+dur*0.3);
      g.gain.exponentialRampToValueAtTime(0.01,t+dur);
      o.start(t);o.stop(t+dur);
    }
    woof(0,280,0.15,0.6);
    woof(0.22,250,0.12,0.5);
    setTimeout(()=>ctx.close(),500);
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

// Voice command definitions: {patterns, action, response}
const VOICE_COMMANDS=[
  // Movimiento
  {id:'dance',patterns:['baila','dance','bailar','mueve','bailando','baile'],response:'¡Mira cómo bailo!'},
  {id:'jump',patterns:['salta','saltar','salto','jump','arriba','bota','brinco','brinca'],response:'¡Yuhuuu!'},
  {id:'spin',patterns:['gira','girar','vuelta','spin','la cola','persigue','dar vuelta','da vuelta','giro'],response:'¡Voy a pillarla!'},
  {id:'roll',patterns:['rueda','rolar','roll','voltea','voltereta','ruedas'],response:'¡Allá voy!'},
  {id:'floss',patterns:['floss','fortnite','baile viral','moda'],response:'¡Floss!'},
  // Trucos
  {id:'sit',patterns:['sienta','sentado','sit','quieto','para','sientate','siéntate'],response:'¡Sentado!'},
  {id:'paw',patterns:['pata','dame la pata','choca','shake','mano','dame','patita','cinco'],response:'¡Choca esos cinco!'},
  {id:'down',patterns:['tumba','suelo','echate','tumbado','down','abajo','al suelo','tumbate','túmbate'],response:'¡Estoy cómodo!'},
  {id:'sleep',patterns:['duerme','dormir','nana','sleep','a dormir','descansa','duermete','duérmete'],response:'Zzzzz...'},
  // Sonidos
  {id:'bark',patterns:['ladra','ladrar','guau','woof','habla','di algo','ladrido','bark','voz'],response:null},
  // Afecto
  {id:'love',patterns:['te quiero','love','cariño','guapo','bonito','bueno','precioso','lindo','mono','te amo'],response:'¡Y yo a ti!'},
  {id:'hello',patterns:['hola','hello','hey','toki','buenos','saludar','buenas'],response:'¡Guau guau!'},
  {id:'howru',patterns:['cómo estás','como estas','qué tal','que tal','estás bien','estas bien'],response:'¡Estoy genial!'},
  // Comida
  {id:'hungry',patterns:['hambre','comer','come','comida','galleta','premio','treat','ñam','croqueta'],response:'¡Ñam ñam!'},
  // Diversión
  {id:'brave',patterns:['valiente','fuerte','héroe','heroe','super','campeón','campeon','crack','fuerza'],response:'¡Soy Super Toki!'},
  {id:'happy',patterns:['contento','feliz','alegre','happy','bien','genial'],response:'¡Estoy feliz!'},
  {id:'fetch',patterns:['busca','trae','pelota','ball','fetch','coge','atrapa'],response:'¡La tengo!'},
  {id:'kiss',patterns:['beso','besito','kiss','muack','mua','muac'],response:'¡Muuuack!'},
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

export default function TokiPlayground({
  size = 380,
  feedMode = false,
  countdown = null,
  onContinue,
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
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (barkTimer.current) clearTimeout(barkTimer.current);
      if (actionTimer.current) clearTimeout(actionTimer.current);
      if (continueTimer.current) clearTimeout(continueTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
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

    // Show speech bubble AND say it out loud
    if (cmd.response) {
      setSpeechBubble(cmd.response);
      sayFB(cmd.response);
      setTimeout(() => setSpeechBubble(null), 2500);
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
        setState('happy'); setEyesClosed(true); setTailFast(true); setPurrSpark(true);
        playWhine();
        actionTimer.current = setTimeout(() => {
          setState('idle'); setEyesClosed(false); setTailFast(false); setPurrSpark(false);
        }, 2500);
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

  // Start voice listening on mount
  useEffect(() => {
    const timer = setTimeout(() => startListening(), 1200);
    return () => { clearTimeout(timer); stopListening(); };
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
      {showContinue&&(<button onClick={()=>{stopListening();onContinue&&onContinue()}} style={{position:"absolute",right:18,bottom:typeof countdown==="number"&&countdown>0?34:18,border:"none",borderRadius:999,padding:"10px 14px",background:"rgba(255,255,255,.12)",color:"#ECF0F1",backdropFilter:"blur(4px)",fontFamily:"'Fredoka'",fontWeight:700,fontSize:14,cursor:"pointer"}}>¡Seguimos!</button>)}
    </div>
  );
}
