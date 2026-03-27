// ============================================================
// TOKI · Pure Utility Functions
// ============================================================
import { GOLD, PERFECT_T, SHORT_OK, SHORT_FAIL, MODULE_MSG, CHEER_ALL } from './constants.js'

export function isSober(){return document.body.classList.contains('theme-sober')}
export function lev(a,b){const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}
export function digToText(s){const m={'0':'cero','1':'uno','2':'dos','3':'tres','4':'cuatro','5':'cinco','6':'seis','7':'siete','8':'ocho','9':'nueve','10':'diez','11':'once','12':'doce','13':'trece','14':'catorce','15':'quince','16':'dieciséis','17':'diecisiete','18':'dieciocho','19':'diecinueve','20':'veinte','30':'treinta','40':'cuarenta','50':'cincuenta','60':'sesenta','70':'setenta','80':'ochenta','90':'noventa','100':'cien'};return s.replace(/\d+/g,n=>{if(m[n])return m[n];const num=parseInt(n);if(num>20&&num<30)return'veinti'+['uno','dós','trés','cuatro','cinco','séis','siete','ocho','nueve'][num-21];const d=['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];const t=Math.floor(num/10),r=num%10;if(r===0)return d[t]||n;const u=['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];return(d[t]||'')+' y '+(u[r]||'')})}
export function score(said,tgt){if(!said||!said.trim())return 0;const c=s=>digToText(s.toLowerCase()).replace(/[^a-záéíóúñü\s]/g,'').trim();const a=c(said),b=c(tgt);if(!a)return 0;if(a===b)return 4;const sw=a.split(/\s+/),tw=b.split(/\s+/);let exact=0,close=0;tw.forEach(t=>{if(sw.some(s=>s===t))exact++;else{const maxLev=t.length<=3?0:t.length<=5?1:2;if(sw.some(s=>lev(s,t)<=maxLev))close++}});const exactR=exact/Math.max(tw.length,1);if(exactR>=1)return 4;if(exactR>=.8)return 3;const totalR=(exact+close*.7)/Math.max(tw.length,1);if(totalR>=.5||exact>=1)return 2;return 1}
export function getExigencia(){try{const v=localStorage.getItem('toki_exigencia');return v?parseInt(v):65}catch(e){return 65}}
export function adjScore(raw){const ex=getExigencia();if(ex>=100)return raw;return Math.min(4,Math.max(0,Math.round(raw*(ex/100))))}
export function cap(s){return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}
export function saveData(key,val){try{const seen=new WeakSet();localStorage.setItem('toki_'+key,JSON.stringify(val,(k,v)=>{if(v instanceof HTMLElement||v instanceof Node)return undefined;if(typeof v==='object'&&v!==null&&v.$$typeof)return undefined;if(typeof v==='object'&&v!==null){if(seen.has(v))return undefined;seen.add(v)}return v}))}catch(e){console.warn('[Toki] saveData error:',key,e)}}
export function loadData(key,def){try{const v=localStorage.getItem('toki_'+key);return v?JSON.parse(v):def}catch(e){return def}}
export function textKey(text){return 'ph_'+text.toLowerCase().replace(/[^a-záéíóúñü0-9\s]/g,'').trim().replace(/\s+/g,'_').slice(0,40)}
export function personalize(text,u){if(!text||!u)return text||'';const h=(u.hermanos||'').split(',').map(s=>s.trim()).filter(Boolean);return text.replace(/\{nombre\}/g,u.name||'Nico').replace(/\{apellidos\}/g,u.apellidos||'').replace(/\{padre\}/g,u.padre||'Paco').replace(/\{madre\}/g,u.madre||'Ana').replace(/\{hermano1\}/g,h[0]||'Miguel').replace(/\{hermana1\}/g,h[0]||'Sofía').replace(/\{tel_padre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{tel_madre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{direccion\}/g,u.direccion||'mi casa').replace(/\{colegio\}/g,u.colegio||'el cole')}
export function srsUp(id,ok,u){const d={...u};if(!d.srs)d.srs={};if(!d.srs[id])d.srs[id]={lv:0,t:0};d.srs[id].t=Date.now();d.srs[id].lv=ok?Math.min(d.srs[id].lv+1,5):Math.max(d.srs[id].lv-1,0);return d}
export function needsRev(id,u){const s=u.srs&&u.srs[id];if(!s)return true;const g=[0,30000,120000,600000,3600000,86400000];return(Date.now()-s.t)>=g[Math.min(s.lv,5)]}
export const avStr=v=>typeof v==='string'?v:'🧑‍🚀';
export const tdy=()=>new Date().toLocaleDateString('es-ES');
export const rnd=a=>a[Math.floor(Math.random()*a.length)];
let _lastMsg='';
export function pickMsg(positive,name,section){const pool=[];if(positive){if(Math.random()<0.2&&name){const t=rnd(PERFECT_T).replace(/\{N\}/g,name);if(t!==_lastMsg){_lastMsg=t;return t}}pool.push(...SHORT_OK);if(MODULE_MSG[section])pool.push(...MODULE_MSG[section])}else{pool.push(...SHORT_FAIL);if(MODULE_MSG[section])pool.push(...MODULE_MSG[section])}const filtered=pool.filter(m=>m!==_lastMsg);const msg=rnd(filtered.length?filtered:pool);_lastMsg=msg;return msg}
export function mkPerfect(name){if(Math.random()<0.2&&name){const msg=rnd(PERFECT_T).replace(/\{N\}/g,name);_lastMsg=msg;return msg}const short=rnd(SHORT_OK.filter(m=>m!==_lastMsg));_lastMsg=short;return short}
export function cheerIdx(text){const clean=text.replace(/\{N\}/g,'').trim().toLowerCase();for(let i=0;i<CHEER_ALL.length;i++){if(CHEER_ALL[i].replace(/\{N\}/g,'').trim().toLowerCase()===clean)return i}return -1}
export function getModuleLv(modKey){const v=loadData('mod_lv_'+modKey,null);if(Array.isArray(v))return v;if(v!==null)return[v];return null}
export function getModuleLvOrDef(modKey,defLv){const v=getModuleLv(modKey);if(v!==null){if(v.length>0)return v;return[]}return Array.isArray(defLv)?defLv:[defLv]}
export function setModuleLv(modKey,lv){saveData('mod_lv_'+modKey,Array.isArray(lv)?lv:lv!==null?[lv]:null)}
export function beep(f,d){try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;g.gain.value=0.03;o.start();o.stop(c.currentTime+d/1000);setTimeout(()=>c.close(),d+100)}catch(e){}}
export function countdownBeep(n){try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=n===0?880:440;g.gain.value=n===0?0.06:0.04;o.start();o.stop(c.currentTime+(n===0?0.25:0.08));setTimeout(()=>c.close(),400)}catch(e){}}
export function getTimeOfDay(){const h=new Date().getHours();if(h>=6&&h<14)return'morning';if(h>=14&&h<20)return'afternoon';return'night'}
export function getSkyClass(){const t=getTimeOfDay();return t==='morning'?'sky-morning':t==='afternoon'?'sky-afternoon':'sky-night'}
export function getGreeting(name){const t=getTimeOfDay();const n=name||'';if(t==='morning')return'¡Buenos días'+(n?', '+n:'')+'!';if(t==='afternoon')return'¡Buenas tardes'+(n?', '+n:'')+'!';return'¡Buenas noches'+(n?', '+n:'')+'!'}
export function getStreak(){const dates=loadData('streak_dates',[]);const today=new Date().toISOString().slice(0,10);if(!dates.includes(today)){dates.push(today);saveData('streak_dates',dates)}const sorted=[...new Set(dates)].sort().reverse();let streak=1;for(let i=0;i<sorted.length-1;i++){const d1=new Date(sorted[i]),d2=new Date(sorted[i+1]);const diff=(d1-d2)/(86400000);if(diff===1)streak++;else break}return streak}
export function getTotalStars(){const ps=loadData('profiles',[]);let total=0;ps.forEach(p=>{if(p.hist)p.hist.forEach(h=>{total+=h.ok||0})});return total}
export function getGroupProgress(userId,groupId){const key='gp_'+userId+'_'+groupId;return loadData(key,0)}
export function addGroupProgress(userId,groupId){const key='gp_'+userId+'_'+groupId;const cur=loadData(key,0);saveData(key,cur+1);return cur+1}
export function getGroupStatus(userId,groupId){const n=getGroupProgress(userId,groupId);if(n===0)return'new';if(n>=50)return'mastered';return'progress'}
export function splitSyllables(text){
  const w=text.toLowerCase().replace(/[¿?¡!,\.;:]/g,'').trim();
  const words=w.split(/\s+/);const result=[];
  const V='aeiouáéíóúü';const isV=c=>V.includes(c);
  // Weak vowels (can form diphthongs), strong vowels break syllables
  const WEAK='iuüíú';const isWeak=c=>WEAK.includes(c);
  // Inseparable consonant pairs (onset clusters)
  const ONSET2=new Set(['bl','br','cl','cr','dr','fl','fr','gl','gr','pl','pr','tr','ch','ll','rr','qu','gu']);
  words.forEach(word=>{
    const syls=[];let cur='';
    for(let i=0;i<word.length;i++){
      const c=word[i];cur+=c;
      if(!isV(c))continue; // consonants just accumulate
      // We're on a vowel — look ahead to decide where to cut
      const n1=word[i+1],n2=word[i+2],n3=word[i+3];
      // Check for diphthong/triphthong: vowel followed by weak vowel
      if(n1&&isV(n1)){
        // Two vowels together: diphthong if at least one is weak (and no accent on weak breaking it)
        const accStrong='áéíóú';
        if(isWeak(c)&&!accStrong.includes(c)&&!isWeak(n1)){continue}// ia,ie,io,ua,ue,uo — weak+strong diphthong, keep going
        if(!isWeak(c)&&isWeak(n1)&&!accStrong.includes(n1)){continue}// ai,ei,oi,au,eu — strong+weak diphthong
        if(isWeak(c)&&isWeak(n1)){continue}// ui,iu — two weak = diphthong
        // Two strong vowels (ae,ao,ea,eo,oa,oe) → hiatus → cut here
        syls.push(cur);cur='';continue;
      }
      if(!n1){syls.push(cur);cur='';continue}// end of word
      // Vowel followed by consonant(s)
      if(!isV(n1)){
        if(!n2){continue}// consonant at end of word, let it accumulate
        if(isV(n2)){
          // V-C-V: consonant goes with next syllable (cut before consonant)
          // BUT handle QU and GU specially
          if((n1==='q'||n1==='g')&&n2==='u'&&n3&&isV(n3)){continue}// que,qui,gue,gui — don't cut
          syls.push(cur);cur='';continue;
        }
        // V-C-C: check if CC is an onset cluster
        if(!isV(n2)){
          const pair=n1+n2;
          if(n3!==undefined&&ONSET2.has(pair)){
            // CC is inseparable → both go to next syllable
            syls.push(cur);cur='';continue;
          }
          // CC not a cluster → first C stays, second goes to next
          cur+=n1;i++;syls.push(cur);cur='';continue;
        }
      }
    }
    if(cur)syls.push(cur);
    result.push(syls)});
  return result}
