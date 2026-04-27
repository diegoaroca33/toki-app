// Badge "TEST" siempre visible en el entorno de pruebas.
// Solo se renderiza si VITE_IS_TEST=true en el build (proyecto Vercel
// "Toki Test"). En el build de producción no se monta nada.
//
// Posición fija arriba a la derecha por encima de TODO el contenido para
// que Diego nunca confunda Toki Test con producción.

import { isTestEnv } from '../utils.js';

export default function TestBadge() {
  if (!isTestEnv()) return null;
  return (
    <div
      role="status"
      aria-label="Entorno de pruebas Toki Test"
      style={{
        position: 'fixed',
        top: 'calc(var(--safe-top, 0px) + 8px)',
        right: 'calc(var(--safe-right, 0px) + 8px)',
        zIndex: 9999,
        background: '#FF6B00',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: 1.5,
        fontFamily: "'Fredoka', sans-serif",
        boxShadow: '0 2px 8px rgba(255,107,0,.55), 0 0 0 2px rgba(255,255,255,.85)',
        pointerEvents: 'none',
        userSelect: 'none',
        textShadow: '0 1px 2px rgba(0,0,0,.35)',
      }}
    >
      TEST
    </div>
  );
}
