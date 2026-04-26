// === Random ponderado por contenido (Doc §5 + Anexo A) ===================
//
// Activable con feature flag toki_random_v2 = true en localStorage.
//
// Algoritmo (resumen del Anexo A):
//   1. Calcular itemCountActive(submódulo) = items de los niveles activados.
//   2. Garantizar mínimo 5 ejercicios por planeta activo.
//   3. Cap por submódulo: <20 items → max(2, items/4); >=20 → floor(items*0.3).
//   4. Reparto del resto por √(itemCountActive), con multiplicador de Foco
//      sobre el módulo principal si focusSlider > 1.
//   5. Si los caps no permiten alcanzar T → devolver {reachable:false, max}.
//   6. Generar ejercicios reales y ordenar por afinidad de grupo.
//
// Esta versión es funcional pero simplificada respecto al Anexo A para
// minimizar superficie de bugs en la primera iteración. Se pueden añadir
// detalles (orden por afinidad estricto, exclusión de presentaciones, etc.)
// en pasadas siguientes.

import { EX } from './exercises.js';
import { getModuleLv, loadData } from './utils.js';

// === itemCountActive por submódulo ====================================
// Cuenta solo los niveles activados, no el corpus total. Importante para
// el reparto: si Diego solo activó N1 de DILO, no cuentan las 1314 frases
// totales sino las ~240 de N1.
export function itemCountActive(modKey) {
  const lvs = getModuleLv(modKey);
  if (!lvs || lvs.length === 0) return 0;

  // DILO: filtrar EX por longitud según niveles
  if (modKey === 'decir') {
    return EX.filter(e => e.ty === 'flu' && lvs.includes(e.lv)).length;
  }
  if (modKey === 'frase') {
    return EX.filter(e => e.ty === 'frases' && lvs.includes(e.lv)).length;
  }

  // Razona — corpus por nivel
  if (modKey === 'razona_piensa') {
    // 154 ejercicios totales en 3 niveles
    let n = 0;
    if (lvs.includes(4)) n += 50; // PIENSA_BASICO
    if (lvs.includes(16)) n += 50;
    if (lvs.includes(17)) n += 54;
    return n;
  }
  if (modKey === 'razona_emociones') {
    let n = 0;
    if (lvs.includes(5)) n += 6;
    if (lvs.includes(18)) n += 30;
    if (lvs.includes(19)) n += 30;
    return n;
  }
  if (modKey === 'razona_clasifica') return 17;
  if (modKey === 'razona_secuencias') {
    let n = 0;
    if (lvs.includes(11)) n += 15; // Básico ~15
    if (lvs.includes(14)) n += 15;
    if (lvs.includes(15)) n += 9;
    return n;
  }

  // Lee — INTRUSO/COMPLETA/Lee y entiende
  if (modKey === 'lee_intruso') {
    let n = 0;
    if (lvs.includes(1)) n += 10; // legacy
    if (lvs.includes(21)) n += 10;
    if (lvs.includes(22)) n += 12;
    if (lvs.includes(23)) n += 10;
    return n;
  }
  if (modKey === 'lee_completa') {
    let n = 0;
    if (lvs.includes(24)) n += 30;
    if (lvs.includes(25)) n += 30;
    if (lvs.includes(26)) n += 30;
    return n;
  }
  if (modKey === 'lee_y_entiende') {
    return lvs.includes(27) ? 65 : 0;
  }

  // Resto: estimación por defecto (módulos generativos)
  return 30 * lvs.length;
}

// === Cap por submódulo ================================================
function capFor(items) {
  if (items < 20) return Math.max(2, Math.floor(items / 4));
  return Math.floor(items * 0.3);
}

// === Algoritmo principal =============================================
// Input: { T, activeSubmods, planetGroups, focusSlider, focusModule }
//   activeSubmods: array de { modKey, planetId }
//   planetGroups: { [planetId]: [submods...] }
//   focusSlider: 1..5 (1 = equilibrado, 5 = más foco)
//   focusModule: lvKey del módulo focal si slider > 1
//
// Output: { assignments: { [modKey]: count }, reachable, maxAchievable, message }
export function buildRandomQueueV2({ T, activeSubmods, planetGroups, focusSlider = 1, focusModule = null }) {
  if (!activeSubmods || activeSubmods.length === 0) {
    return { reachable: false, maxAchievable: 0, message: 'No hay submódulos activos. Activa al menos uno en Configuración.' };
  }

  // Anotar items y cap
  const submods = activeSubmods.map(s => {
    const items = itemCountActive(s.modKey);
    return { ...s, items, cap: capFor(items), assigned: 0 };
  }).filter(s => s.items > 0);

  if (submods.length === 0) {
    return { reachable: false, maxAchievable: 0, message: 'Los submódulos activos no tienen contenido en los niveles seleccionados.' };
  }

  // === Paso 2: mínimo 5 por planeta activo ============================
  const PLANET_MIN = 5;
  const planets = Object.keys(planetGroups || {}).filter(p => submods.some(s => s.planetId === p));
  const guaranteed = PLANET_MIN * planets.length;

  if (T < guaranteed) {
    // T pequeño: reparto equitativo entre todos
    const each = Math.max(1, Math.floor(T / submods.length));
    submods.forEach(s => { s.assigned = Math.min(each, s.cap); });
  } else {
    // Asignar mínimo 5 por planeta repartido entre sus submods por √items
    planets.forEach(pid => {
      const planetSubs = submods.filter(s => s.planetId === pid);
      const totalSqrt = planetSubs.reduce((sum, s) => sum + Math.sqrt(s.items), 0);
      let remaining = PLANET_MIN;
      planetSubs.forEach((sub, i) => {
        if (i === planetSubs.length - 1) sub.assigned = Math.min(remaining, sub.cap);
        else {
          const share = Math.round((Math.sqrt(sub.items) / Math.max(totalSqrt, 1)) * PLANET_MIN);
          sub.assigned = Math.min(share, sub.cap);
          remaining -= sub.assigned;
        }
      });
    });
  }

  // === Paso 4: reparto del resto por √items con multiplicador de Foco ==
  let remaining = T - submods.reduce((s, x) => s + x.assigned, 0);
  // Calcular pesos
  const FOCUS_MULT = [1.0, 1.3, 1.6, 2.0, 2.5];
  submods.forEach(sub => {
    let w = Math.sqrt(sub.items);
    if (focusSlider > 1 && focusModule && sub.modKey === focusModule) {
      w *= FOCUS_MULT[focusSlider - 1] || 1.0;
    }
    sub.weight = w;
  });

  // Reparto iterativo (greedy)
  let safety = T * 5; // safeguard contra bucles imposibles
  while (remaining > 0 && safety-- > 0) {
    const candidates = submods.filter(s => s.assigned < s.cap);
    if (candidates.length === 0) break;
    // Elegir el de mejor weight/assigned
    candidates.sort((a, b) => (b.weight / Math.max(b.assigned, 1)) - (a.weight / Math.max(a.assigned, 1)));
    candidates[0].assigned++;
    remaining--;
  }

  const totalAssigned = submods.reduce((s, x) => s + x.assigned, 0);
  if (totalAssigned < T) {
    return {
      reachable: false,
      maxAchievable: totalAssigned,
      assignments: Object.fromEntries(submods.map(s => [s.modKey, s.assigned])),
      message: buildUnreachableMessage(T, totalAssigned),
    };
  }

  return {
    reachable: true,
    maxAchievable: totalAssigned,
    assignments: Object.fromEntries(submods.map(s => [s.modKey, s.assigned])),
    debug: submods,
  };
}

function buildUnreachableMessage(T, max) {
  return [
    `Sesión muy ambiciosa para el contenido activo.`,
    `Has pedido ${T} ejercicios pero con lo activado solo se pueden generar ${max} sin que se repitan demasiado.`,
    `Puedes:`,
    `  • Reducir el objetivo a ${max}`,
    `  • Activar más niveles internos en los submódulos`,
    `  • Activar más submódulos`,
  ].join('\n');
}

// === Foco: persistencia ==============================================
export function getFocusSlider() { return Math.max(1, Math.min(5, parseInt(loadData('focus_slider', 1)) || 1)); }
export function getFocusModule() { return loadData('focus_module', null); }
