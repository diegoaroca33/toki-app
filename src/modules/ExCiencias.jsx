// === CIENCIAS — Piloto Naturales Básico (Doc INSTRUCCIONES-CODE.md 2026-04-27)
//
// Módulo behind feature flag `toki_ciencias_piloto`. Implementa 4 modos
// pedagógicos por lámina (estudio / presentacion / rellena_pasada_1 /
// rellena_pasada_2) y 3 layouts (panel-right / panel-top / split-screen).
//
// Coordenadas en JSON son porcentajes 0-1 sobre la imagen. Anchors se
// renderizan por software encima de la imagen base. Las imágenes son
// 1672×941 (ratio 16:9) sin texto ni anclas quemadas.
//
// PRIMERA VERSIÓN — REVISAR antes de prod. Diego validará.

import { useState, useEffect, useMemo, useRef } from 'react';
import { GOLD, GREEN, RED, BLUE, DIM, CARD, BORDER } from '../constants.js';
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js';
import { beep, mkPerfect } from '../utils.js';
import { useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx';
import { Stars } from '../components/CelebrationOverlay.jsx';
import naturalesBasico from '../data/ciencias-naturales-basico.json';

// === Generador de queue para Ciencias ================================
// Para cada lámina activa genera 4 ejercicios (uno por modo). Si Diego
// activa solo algunos modos en Settings, solo se generan esos.
//
// rawLv puede ser una sub-lista (qué Mini activar) — placeholder por ahora,
// el piloto activa todas las 9 láminas siempre.
export function genCiencias(_rawLv) {
  const items = [];
  const modes = ['estudio', 'rellena_pasada_1', 'rellena_pasada_2', 'presentacion'];
  naturalesBasico.laminas.forEach((lam, i) => {
    modes.forEach(mode => {
      items.push({
        ty: 'ciencias',
        mode,
        data: lam,
        id: `cn_${lam.id}_${mode}`,
      });
    });
  });
  return items.sort(() => Math.random() - 0.5);
}

// === LaminaRenderer ====================================================
// Renderiza imagen base + anchor dots + líneas + etiquetas (panel o
// callouts) según layout. Coordenadas en porcentajes.
function LaminaRenderer({ lamina, modo, hidden = [], onHit, completedHits = [] }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 450 });

  // Calcular tamaño real para posicionar absolutos en píxeles si hace falta
  useEffect(() => {
    function update() {
      const c = containerRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [lamina]);

  const layout = lamina.layout || 'panel-right';
  const anchors = lamina.anchors || {};
  const orden = lamina.etiquetas_visibles_orden || Object.keys(anchors);

  // Etiquetas que deben mostrarse como hueco (en modos rellena con esa etiqueta oculta)
  const isHidden = name => hidden.includes(name);
  const isCompleted = name => completedHits.includes(name);

  return (
    <div
      ref={containerRef}
      className="ciencias-lamina"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 1200,
        aspectRatio: '16 / 9',
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,.25)',
      }}
    >
      {/* Imagen base */}
      <img
        src={lamina.imagen}
        alt={lamina.titulo}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
        }}
      />

      {/* SVG overlay para líneas anchor → etiqueta */}
      <svg
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }}
      >
        {orden.map(name => {
          const a = anchors[name];
          if (!a) return null;
          const x1 = a.x * size.w;
          const y1 = a.y * size.h;
          const x2 = (a.panel_pos?.x || a.x + 0.05) * size.w;
          const y2 = (a.panel_pos?.y || a.y) * size.h;
          return <line key={'line_' + name} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#BBB" strokeWidth={1.2} />;
        })}
      </svg>

      {/* Anchor dots (encima de las líneas) */}
      {orden.map(name => {
        const a = anchors[name];
        if (!a) return null;
        const completed = isCompleted(name);
        const dotColor = completed ? '#5FB85F' : '#999';
        return (
          <div
            key={'dot_' + name}
            style={{
              position: 'absolute',
              left: `calc(${a.x * 100}% - 6px)`,
              top: `calc(${a.y * 100}% - 6px)`,
              width: 12, height: 12,
              borderRadius: '50%',
              background: dotColor,
              boxShadow: '0 0 0 2px #fff',
              pointerEvents: 'none',
              transition: 'background .25s',
            }}
          />
        );
      })}

      {/* Etiquetas posicionadas según panel_pos */}
      {orden.map(name => {
        const a = anchors[name];
        if (!a) return null;
        const px = (a.panel_pos?.x || a.x + 0.05) * 100;
        const py = (a.panel_pos?.y || a.y) * 100;
        const oculta = isHidden(name);
        const completada = isCompleted(name);
        const isInteractive = oculta && !completada && typeof onHit === 'function';

        const baseStyle = {
          position: 'absolute',
          left: `${px}%`,
          top: `${py}%`,
          transform: 'translate(-50%, -50%)',
          padding: '6px 14px',
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "'Fredoka', sans-serif",
          whiteSpace: 'nowrap',
        };

        if (oculta && !completada) {
          // Hueco vacío para rellenar
          return (
            <div
              key={'lbl_' + name}
              style={{
                ...baseStyle,
                background: 'rgba(255,255,255,.85)',
                border: '2px dashed #5BA7E8',
                color: '#5BA7E8',
                cursor: 'default',
              }}
            >____</div>
          );
        }

        return (
          <button
            key={'lbl_' + name}
            onClick={isInteractive ? () => onHit(name) : undefined}
            style={{
              ...baseStyle,
              background: completada ? '#5FB85F' : 'rgba(255,255,255,.95)',
              color: completada ? '#fff' : '#222',
              border: '1px solid ' + (completada ? '#3FA03F' : '#E0E0E0'),
              boxShadow: '0 1px 3px rgba(0,0,0,.15)',
              cursor: oculta ? 'default' : 'default',
            }}
            disabled={!oculta}
          >{name}</button>
        );
      })}
    </div>
  );
}

// === Pool de etiquetas (para modos rellena) ============================
function PoolEtiquetas({ items, onPick }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      justifyContent: 'center',
      padding: '12px 14px',
      marginTop: 14,
      background: 'rgba(0,0,0,.35)',
      borderRadius: 14,
      backdropFilter: 'blur(6px)',
    }}>
      {items.map(name => (
        <button
          key={'pool_' + name}
          onClick={() => onPick(name)}
          style={{
            padding: '10px 18px',
            borderRadius: 999,
            background: '#fff',
            color: '#222',
            border: '2px solid #5BA7E8',
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "'Fredoka', sans-serif",
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,.2)',
          }}
        >{name}</button>
      ))}
    </div>
  );
}

// === FrasesPanel ======================================================
function FrasesPanel({ frases, currentIdx = -1, onTapNext }) {
  if (!frases || frases.length === 0) return null;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 700,
      margin: '14px auto 0',
    }}>
      {frases.map((f, i) => {
        const isActive = currentIdx === -1 || i <= currentIdx;
        return (
          <div
            key={i}
            onClick={onTapNext}
            style={{
              padding: '14px 20px',
              background: isActive ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.4)',
              color: '#222',
              borderRadius: 14,
              fontSize: 22,
              fontWeight: 600,
              fontFamily: "'Fredoka', sans-serif",
              opacity: isActive ? 1 : 0.4,
              transition: 'opacity .3s',
              cursor: onTapNext ? 'pointer' : 'default',
            }}
          >• {f}</div>
        );
      })}
    </div>
  );
}

// === Componente principal del ejercicio ================================
export function ExCiencias({ ex, onOk, onSkip, name, uid, vids }) {
  const lamina = ex.data;
  const modo = ex.mode;
  const { idleMsg, poke } = useIdle(name, true);
  const { oralPhrase, triggerOral, oralDone, resetOral } = useOralPhase(onOk);

  // Estado para modo presentación: índice de la frase actual
  const [presIdx, setPresIdx] = useState(0);
  // Estado para modos rellena: huecos rellenados con éxito
  const [completedHits, setCompletedHits] = useState([]);
  // Pool de etiquetas disponibles (huecos de la pasada activa)
  const huecos = useMemo(() => {
    if (modo === 'rellena_pasada_1') return lamina.rellena?.pasada_1?.huecos || [];
    if (modo === 'rellena_pasada_2') return lamina.rellena?.pasada_2?.huecos || [];
    return [];
  }, [modo, lamina]);

  // Etiquetas en pool (no completadas todavía), barajadas
  const [poolItems, setPoolItems] = useState([]);
  useEffect(() => {
    if (modo.startsWith('rellena')) {
      setPoolItems([...huecos].sort(() => Math.random() - 0.5));
    } else {
      setPoolItems([]);
    }
    setCompletedHits([]);
    setPresIdx(0);
    resetOral();
    stopVoice();

    // Voz de inicio según modo (delay 1500ms para no chocar con cohete previo)
    const intro = (() => {
      if (modo === 'estudio') return lamina.titulo;
      if (modo === 'presentacion') return lamina.titulo;
      if (modo === 'rellena_pasada_1') return 'Coloca cada palabra en su sitio.';
      if (modo === 'rellena_pasada_2') return 'Vamos a por la siguiente ronda.';
      return lamina.titulo;
    })();
    const t = setTimeout(() => say(intro), 1500);
    return () => { clearTimeout(t); stopVoice(); };
  }, [ex]);

  // === Modo Presentación: avanzar frases con tap ======================
  function presNext() {
    poke();
    if (presIdx < (lamina.frases_base?.length || 0) - 1) {
      const next = presIdx + 1;
      setPresIdx(next);
      stopVoice();
      setTimeout(() => say(lamina.frases_base[next]), 200);
    } else {
      // Fin de la presentación
      setFb('ok');
      starBeep(4);
      cheerOrSay(mkPerfect(name), uid, vids, 'perfect').then(() => {
        setTimeout(() => triggerOral(lamina.titulo, 4, 1), 300);
      });
    }
  }

  // Lectura inicial de la primera frase en modo Presentación
  useEffect(() => {
    if (modo === 'presentacion' && lamina.frases_base?.[0]) {
      const t = setTimeout(() => say(lamina.frases_base[0]), 1700);
      return () => clearTimeout(t);
    }
  }, [ex, modo]);

  // === Modos Rellena: el niño pulsa la etiqueta del pool y la coloca =
  // En esta primera versión simplificada, se selecciona del pool y la
  // primera "casilla hueca disponible" se llena con la elegida. Si
  // coincide con el orden esperado, OK. Si no, error.
  const [fb, setFb] = useState(null);

  function onPoolPick(name) {
    poke();
    if (!modo.startsWith('rellena')) return;
    // ¿Es válida en este momento? El usuario puede elegir cualquiera de
    // los huecos en cualquier orden — solo verificamos que name está en
    // los huecos esperados y aún no completados. Como la asociación es
    // libre (clic etiqueta → se asume que va al hueco con el nombre),
    // simplemente comprobamos que está en huecos.
    if (huecos.includes(name) && !completedHits.includes(name)) {
      const newHits = [...completedHits, name];
      setCompletedHits(newHits);
      setPoolItems(p => p.filter(x => x !== name));
      starBeep(2);
      // ¿Hemos terminado todos los huecos?
      if (newHits.length >= huecos.length) {
        setFb('ok');
        // Frase emergente
        const fraseEmerg = (modo === 'rellena_pasada_1'
          ? lamina.rellena?.pasada_1?.frase_emergente
          : lamina.rellena?.pasada_2?.frase_emergente) || lamina.titulo;
        setTimeout(() => {
          starBeep(4);
          cheerOrSay(mkPerfect(name), uid, vids, 'perfect').then(() => {
            setTimeout(() => triggerOral(fraseEmerg, 4, 1), 300);
          });
        }, 600);
      }
    } else {
      // Caso de error muy improbable (clic en algo que no es hueco activo)
      beep(200, 200);
    }
  }

  return (
    <div style={{ padding: '14px 18px', textAlign: 'center' }} onClick={poke}>
      {/* Cabecera con título de la lámina */}
      <div style={{
        marginBottom: 10,
        padding: '10px 16px',
        background: 'rgba(255,255,255,.08)',
        borderRadius: 12,
        display: 'inline-block',
      }}>
        <p style={{ margin: 0, fontSize: 13, color: DIM, letterSpacing: 1 }}>{lamina.mini}</p>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: GOLD }}>{lamina.titulo}</h2>
      </div>

      {/* Lámina principal */}
      <LaminaRenderer
        lamina={lamina}
        modo={modo}
        hidden={modo.startsWith('rellena') ? huecos : []}
        completedHits={completedHits}
      />

      {/* Modo Estudio: muestra todas las frases base debajo */}
      {modo === 'estudio' && (
        <FrasesPanel frases={lamina.frases_base} />
      )}

      {/* Modo Presentación: una frase a la vez con tap-to-advance */}
      {modo === 'presentacion' && !fb && (
        <>
          <FrasesPanel frases={lamina.frases_base} currentIdx={presIdx} onTapNext={presNext} />
          <div style={{ marginTop: 10, fontSize: 13, color: DIM }}>Toca para continuar</div>
        </>
      )}

      {/* Modos Rellena: pool de etiquetas para colocar */}
      {modo.startsWith('rellena') && !fb && (
        <PoolEtiquetas items={poolItems} onPick={onPoolPick} />
      )}

      {/* Estado fin del ejercicio */}
      {fb === 'ok' && !oralPhrase && (
        <div className="ab" style={{ background: GREEN + '22', borderRadius: 14, padding: 18, marginTop: 14 }}>
          <Stars n={4} sz={36} />
        </div>
      )}
      {oralPhrase && <OralPrompt phrase={oralPhrase} onDone={oralDone} />}
      {idleMsg && !fb && (
        <div className="af" style={{ background: GOLD + '15', borderRadius: 14, padding: 12, marginTop: 10 }}>
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0, color: GOLD }}>{idleMsg}</p>
        </div>
      )}
      <button className="btn btn-ghost skip-btn" onClick={() => { stopVoice(); onSkip(); }} style={{ marginTop: 12 }}>⏭️ Saltar</button>
    </div>
  );
}
