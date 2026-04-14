// ============================================================
// TOKI · Pure Utility Functions
// ============================================================
import { GOLD, PERFECT_T, SHORT_OK, SHORT_FAIL, MODULE_MSG, CHEER_ALL } from './constants.js'

export function isSober(){return document.body.classList.contains('theme-sober')}
export function lev(a,b){const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}
export function digToText(s){const m={'0':'cero','1':'uno','2':'dos','3':'tres','4':'cuatro','5':'cinco','6':'seis','7':'siete','8':'ocho','9':'nueve','10':'diez','11':'once','12':'doce','13':'trece','14':'catorce','15':'quince','16':'dieciséis','17':'diecisiete','18':'dieciocho','19':'diecinueve','20':'veinte','30':'treinta','40':'cuarenta','50':'cincuenta','60':'sesenta','70':'setenta','80':'ochenta','90':'noventa','100':'cien'};return s.replace(/\d+/g,n=>{if(m[n])return m[n];const num=parseInt(n);if(num>20&&num<30)return'veinti'+['uno','dós','trés','cuatro','cinco','séis','siete','ocho','nueve'][num-21];const d=['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];const t=Math.floor(num/10),r=num%10;if(r===0)return d[t]||n;const u=['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];return(d[t]||'')+' y '+(u[r]||'')})}
export function score(said,tgt){if(!said||!said.trim())return 0;const c=s=>digToText(s.toLowerCase()).replace(/[^a-záéíóúñü\s]/g,'').trim();const a=c(said),b=c(tgt);if(!a)return 0;if(a===b)return 4;const sw=a.split(/\s+/),tw=b.split(/\s+/);let exact=0,close=0,partial=0;
  // Stricter levenshtein: words <=4 chars need EXACT match (pato/pata/casa/cosa are meaningfully different)
  // words 5-6 chars tolerate 1 char diff, longer words tolerate 2
  // PLUS: detect "initial syllable" approximation for DI users (e.g. "pa" for "pato", "mesa" contains "me")
  tw.forEach(t=>{
    if(sw.some(s=>s===t))exact++;
    else{
      const maxLev=t.length<=4?0:t.length<=6?1:2;
      if(sw.some(s=>lev(s,t)<=maxLev))close++;
      // Partial match: spoken word is a prefix of target AND has length >= 2 (e.g. "pa" matches "pato")
      else if(t.length>=3&&sw.some(s=>s.length>=2&&t.startsWith(s)))partial++;
    }
  });
  const exactR=exact/Math.max(tw.length,1);if(exactR>=1)return 4;if(exactR>=.8)return 3;
  // totalR includes partial matches at 0.4 weight (less than close at 0.7)
  const totalR=(exact+close*.7+partial*.4)/Math.max(tw.length,1);
  if(totalR>=.5||exact>=1)return 2;
  if(totalR>=.3||close>=1||partial>=1)return 1; // Reward any effort
  return 1}
export function getExigencia(){try{const v=localStorage.getItem('toki_exigencia');return v?parseInt(v):65}catch(e){return 65}}
export function adjScore(raw){return raw}// exigencia now only affects passThreshold in SpeakPanel, not the raw score
export function cap(s){return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}
export function saveData(key,val){try{const seen=new WeakSet();localStorage.setItem('toki_'+key,JSON.stringify(val,(k,v)=>{if(v instanceof HTMLElement||v instanceof Node)return undefined;if(typeof v==='object'&&v!==null&&v.$$typeof)return undefined;if(typeof v==='object'&&v!==null){if(seen.has(v))return undefined;seen.add(v)}return v}))}catch(e){console.warn('[Toki] saveData error:',key,e)}}
export function loadData(key,def){try{const v=localStorage.getItem('toki_'+key);return v?JSON.parse(v):def}catch(e){return def}}
// Gather all settings into one object for cloud sync
export function gatherSettings(){
  const s={burst_mode:loadData('burst_mode',true),burst_reps:loadData('burst_reps',2),session_time:loadData('session_time',30),session_goal:loadData('session_goal',100),session_type:loadData('session_type','time'),session_mode:loadData('session_mode','free'),active_mods:loadData('active_mods',{}),guided_tasks:loadData('guided_tasks',[]),theme:loadData('theme','space'),exigencia:loadData('exigencia',65),focal_module:loadData('focal_module','decir'),focal_weight:loadData('focal_weight',3),fraccionado:loadData('fraccionado',false),sup_pin:loadData('sup_pin',null),_ts:Date.now()};
  // Collect module levels
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('toki_mod_lv_')){const short=k.replace('toki_','');s[short]=loadData(short,null)}}}catch(e){}
  return s}
// Apply settings from cloud
export function applySettings(s){if(!s||typeof s!=='object')return;
  const keys=['burst_mode','burst_reps','session_time','session_goal','session_type','session_mode','active_mods','guided_tasks','theme','exigencia','focal_module','focal_weight','fraccionado','sup_pin'];
  keys.forEach(k=>{if(s[k]!==undefined)saveData(k,s[k])});
  // Apply module levels
  Object.keys(s).filter(k=>k.startsWith('mod_lv_')).forEach(k=>{if(s[k]!==undefined)saveData(k,s[k])})}
export function textKey(text){return 'ph_'+text.toLowerCase().replace(/[^a-záéíóúñü0-9\s]/g,'').trim().replace(/\s+/g,'_').slice(0,40)}
export function personalize(text,u){if(!text||!u)return text||'';const h=(u.hermanos||'').split(',').map(s=>s.trim()).filter(Boolean);const bdValid=u.birthdate&&!isNaN(new Date(u.birthdate).getTime());const edad=u.age||(bdValid?Math.max(1,Math.floor((Date.now()-new Date(u.birthdate).getTime())/31557600000)):'');const cumple=bdValid?new Date(u.birthdate).toLocaleDateString('es-ES',{day:'numeric',month:'long'}):'';const r=text.replace(/\{nombre\}/g,u.name||'Nico').replace(/\{apellidos\}/g,u.apellidos||'').replace(/\{padre\}/g,u.padre||'Paco').replace(/\{madre\}/g,u.madre||'Ana').replace(/\{hermano1\}/g,h[0]||'Miguel').replace(/\{hermana1\}/g,h[0]||'Sofía').replace(/\{tel_padre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{tel_madre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{direccion\}/g,u.direccion||'mi casa').replace(/\{colegio\}/g,u.colegio||'el cole').replace(/\{edad\}/g,String(edad)).replace(/\{cumple\}/g,cumple);return r.charAt(0).toUpperCase()+r.slice(1)}
export function srsUp(id,ok,u,stars,attempts){const d={...u};if(!d.srs)d.srs={};if(!d.srs[id])d.srs[id]={lv:0,t:0};d.srs[id].t=Date.now();
  if(!ok){d.srs[id].lv=Math.max(d.srs[id].lv-1,0)}
  else if(stars!==undefined&&attempts!==undefined){
    // M3: Smart SRS intervals based on quality
    // 4 stars first attempt → lv 5 (7 days)
    // 3 stars first attempt → lv 4 (3 days)
    // 2-3 stars with retries → lv 3 (1 day)
    // Auto-pass (3 attempts) → lv 0 (next session)
    if(attempts>=3){d.srs[id].lv=0}
    else if(attempts>1){d.srs[id].lv=3}
    else if(stars>=4){d.srs[id].lv=5}
    else if(stars>=3){d.srs[id].lv=4}
    else{d.srs[id].lv=3}
  }else{d.srs[id].lv=Math.min(d.srs[id].lv+1,5)}
  return d}
export function needsRev(id,u){const s=u.srs&&u.srs[id];if(!s)return true;const g=[0,30000,120000,86400000,259200000,604800000];return(Date.now()-s.t)>=g[Math.min(s.lv,5)]}
export const avStr=v=>typeof v==='string'?v:'🧑‍🚀';
export const tdy=()=>{const d=new Date();return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()};
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
// ── Exercise history: 3-day anti-repeat system ─────────────
const HISTORY_KEY='toki_ex_history';
const HISTORY_DAYS=3;
const HISTORY_MAX_ENTRIES=2000; // prevent unbounded growth

export function getRecentExercises(userId){
  try{
    const all=JSON.parse(localStorage.getItem(HISTORY_KEY)||'{}');
    const mine=all[userId]||[];
    const cutoff=Date.now()-(HISTORY_DAYS*86400000);
    return mine.filter(e=>e.t>=cutoff)
  }catch(e){return[]}
}

export function getRecentExerciseKeys(userId){
  return new Set(getRecentExercises(userId).map(e=>e.k))
}

export function markExerciseUsed(userId,key){
  if(!key||key.length<=1)return;
  try{
    const all=JSON.parse(localStorage.getItem(HISTORY_KEY)||'{}');
    if(!all[userId])all[userId]=[];
    all[userId].push({k:key,t:Date.now()});
    // Prune: remove entries older than 3 days + cap size
    const cutoff=Date.now()-(HISTORY_DAYS*86400000);
    all[userId]=all[userId].filter(e=>e.t>=cutoff).slice(-HISTORY_MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY,JSON.stringify(all))
  }catch(e){}
}

export function markExerciseBatch(userId,keys){
  if(!keys||!keys.length)return;
  try{
    const all=JSON.parse(localStorage.getItem(HISTORY_KEY)||'{}');
    if(!all[userId])all[userId]=[];
    const now=Date.now();
    keys.forEach(k=>{if(k&&k.length>1)all[userId].push({k,t:now})});
    const cutoff=now-(HISTORY_DAYS*86400000);
    all[userId]=all[userId].filter(e=>e.t>=cutoff).slice(-HISTORY_MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY,JSON.stringify(all))
  }catch(e){}
}

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
          // QU always stays together (que,qui)
          if(n1==='q'&&n2==='u'&&n3&&isV(n3)){continue}
          // GU stays together only at word start or after consonant (gue,gui = u muda)
          // But in V-GU-V (like si-gue), we DO cut: the g goes to next syllable
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

export function getMascotTier(s){
  const cycle=Math.floor(s/1000); // 0=yellow,1=green,2=blue,3=purple,4=red...
  const inCycle=s-cycle*1000;
  const tier=inCycle>=1000?5:inCycle>=500?4:inCycle>=300?3:inCycle>=150?2:inCycle>=50?1:0;
  return tier; // tier 0-5 within current cycle
}
export function getMascotCycle(s){return Math.floor(s/1000)} // color cycle index
export const CYCLE_COLORS=['#FFD700','#2ECC71','#3498DB','#9B59B6','#E74C3C','#E67E22'];
export const CYCLE_NAMES=['Oro','Esmeralda','Zafiro','Amatista','Rubí','Ámbar'];

// M1: Phrase repetition counter
export function getRepCount(userId, phraseKey) {
  return loadData(`rep_${userId}_${phraseKey}`, {count:0, avgStars:0, firstDate:null, lastDate:null});
}
export function updateRepCount(userId, phraseKey, stars) {
  const d = getRepCount(userId, phraseKey);
  const now = new Date().toISOString().slice(0,10);
  const newCount = d.count + 1;
  const newAvg = d.count === 0 ? stars : ((d.avgStars * d.count) + stars) / newCount;
  saveData(`rep_${userId}_${phraseKey}`, {
    count: newCount,
    avgStars: Math.round(newAvg * 10) / 10,
    firstDate: d.firstDate || now,
    lastDate: now
  });
}

// M5: Adaptive TTS speed per phrase
export function getPhraseSpeed(userId, phraseKey) {
  return loadData(`speed_${userId}_${phraseKey}`, 0.85);
}
export function updatePhraseSpeed(userId, phraseKey, succeeded) {
  const speeds = [0.7, 0.85, 1.0, 1.1];
  const current = getPhraseSpeed(userId, phraseKey);
  const consecutiveKey = `speedstreak_${userId}_${phraseKey}`;
  let streak = loadData(consecutiveKey, {ok:0, fail:0});
  if (succeeded) { streak.ok++; streak.fail=0; }
  else { streak.fail++; streak.ok=0; }
  saveData(consecutiveKey, streak);
  let idx = speeds.indexOf(current);
  if (idx === -1) idx = 1;
  if (streak.ok >= 3) { idx = Math.min(idx + 1, speeds.length - 1); streak.ok = 0; saveData(consecutiveKey, streak); }
  if (streak.fail >= 2) { idx = Math.max(idx - 1, 0); streak.fail = 0; saveData(consecutiveKey, streak); }
  const newSpeed = speeds[idx];
  saveData(`speed_${userId}_${phraseKey}`, newSpeed);
  return newSpeed;
}

// M7a: Dynamic DILO level helpers
export function getDynamicDilo(userId){return loadData(`dynamic_dilo_${userId}`,false)}
export function setDynamicDilo(userId,v){saveData(`dynamic_dilo_${userId}`,v)}
export function getDynamicDiloLevel(userId){return loadData(`dynamic_dilo_level_${userId}`,1)}
export function setDynamicDiloLevel(userId,v){saveData(`dynamic_dilo_level_${userId}`,v)}
export function getDynamicDiloHistory(userId){return loadData(`dynamic_dilo_history_${userId}`,[])}
export function pushDynamicDiloResult(userId,ok){
  const h=getDynamicDiloHistory(userId);
  h.push(ok?1:0);
  if(h.length>8)h.splice(0,h.length-8);
  saveData(`dynamic_dilo_history_${userId}`,h);
  return h;
}
export function getDynamicDiloSessions(userId){return loadData(`dynamic_dilo_sessions_${userId}`,0)}
export function setDynamicDiloSessions(userId,v){saveData(`dynamic_dilo_sessions_${userId}`,v)}
export function checkDynamicDiloLevel(userId){
  const h=getDynamicDiloHistory(userId);
  const lv=getDynamicDiloLevel(userId);
  const sessions=getDynamicDiloSessions(userId);
  // DOWN: 3+ fails in last 4 → immediate drop
  if(h.length>=4){
    const last4=h.slice(-4);
    const fails4=last4.filter(x=>x===0).length;
    if(fails4>=3&&lv>1){
      setDynamicDiloLevel(userId,lv-1);
      setDynamicDiloSessions(userId,0);
      saveData(`dynamic_dilo_history_${userId}`,[]);
      return{change:'down',newLv:lv-1};
    }
  }
  // UP: 75%+ of last 8 (6/8) AND 2+ sessions
  if(h.length>=8&&sessions>=2){
    const ok8=h.slice(-8).filter(x=>x===1).length;
    if(ok8>=6&&lv<5){
      setDynamicDiloLevel(userId,lv+1);
      setDynamicDiloSessions(userId,0);
      saveData(`dynamic_dilo_history_${userId}`,[]);
      return{change:'up',newLv:lv+1};
    }
  }
  return{change:null,newLv:lv};
}

// Dog feeding/growth system
export function getDogGrowth(userId) {
  return loadData(`dog_growth_${userId}`, 0);
}
export function setDogGrowth(userId, v) {
  saveData(`dog_growth_${userId}`, v);
}
export function getDogLastFed(userId) {
  return loadData(`dog_lastfed_${userId}`, null);
}
export function setDogLastFed(userId, date) {
  saveData(`dog_lastfed_${userId}`, date);
}
export function getDogPhase(growth) {
  if (growth >= 61) return 2; // héroe
  if (growth >= 21) return 1; // joven
  return 0; // cachorro
}
export function canFeedDog(userId) {
  const last = getDogLastFed(userId);
  if (!last) return true;
  const today = new Date().toISOString().slice(0, 10);
  return last !== today;
}
export function feedDog(userId) {
  const today = new Date().toISOString().slice(0, 10);
  setDogLastFed(userId, today);
  const g = getDogGrowth(userId) + 1;
  setDogGrowth(userId, g);
  return g;
}
export function getDogEvolAnnounce(userId) {
  return loadData(`dog_evolannounce_${userId}`, null);
}
export function setDogEvolAnnounce(userId, data) {
  saveData(`dog_evolannounce_${userId}`, data);
}

// ── Daily exercise counter ──────────────────────────────────
export function getDailyCount(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const data = loadData('daily_count_' + userId, { date: '', count: 0 });
  if (data.date !== today) return 0;
  return data.count || 0;
}

export function addDailyCount(userId, n) {
  const today = new Date().toISOString().slice(0, 10);
  const data = loadData('daily_count_' + userId, { date: '', count: 0 });
  if (data.date !== today) data.count = 0;
  data.date = today;
  data.count = (data.count || 0) + n;
  saveData('daily_count_' + userId, data);
  return data.count;
}

export function getDailyPhase(count) {
  if (count >= 300) return 4;
  if (count >= 200) return 3;
  if (count >= 100) return 2;
  return 1;
}

// Build GROUPS with dynamic Aprende modules from user.presentations
export function getGroupsForUser(user,GROUPS){
  if(!user)return GROUPS;
  const pres=user.presentations||[];
  return GROUPS.map(g=>{
    if(g.id!=='aprende')return g;
    // Build modules from user presentations
    const mods=[];
    if(pres.length===0){
      // No presentations yet - use default
      mods.push({k:'quiensoy',l:'Mi presentación',defLv:[1,2],lvKey:'pres_0',presIdx:0});
    } else {
      pres.forEach((p,i)=>{
        if(p.active===false)return; // skip inactive presentations
        mods.push({k:'quiensoy',l:p.name||`Presentación ${i+1}`,defLv:[1,2],lvKey:`pres_${i}`,presIdx:i});
      });
      // If all are inactive, keep at least a fallback
      if(mods.length===0)mods.push({k:'quiensoy',l:pres[0].name||'Presentación 1',defLv:[1,2],lvKey:'pres_0',presIdx:0});
    }
    return {...g,modules:mods};
  });
}

// Weekly progress index — compares this week vs last week
export function getWeeklyProgress(hist){
  if(!hist||!hist.length)return{thisWeek:{ok:0,sk:0,min:0,sessions:0,pct:0},lastWeek:{ok:0,sk:0,min:0,sessions:0,pct:0},improvement:0};
  const now=new Date();const dayMs=86400000;
  const weekStart=new Date(now);weekStart.setDate(now.getDate()-now.getDay());weekStart.setHours(0,0,0,0);
  const lastWeekStart=new Date(weekStart.getTime()-7*dayMs);
  function parseDate(dt){if(!dt)return null;const p=dt.split('/');if(p.length===3)return new Date(parseInt(p[2]),parseInt(p[1])-1,parseInt(p[0]));return new Date(dt)}
  function sumWeek(start,end){const entries=hist.filter(h=>{const d=parseDate(h.dt);return d&&d>=start&&d<end});
    const ok=entries.reduce((s,h)=>s+(h.ok||0),0);const sk=entries.reduce((s,h)=>s+(h.sk||0),0);const min=entries.reduce((s,h)=>s+(h.min||0),0);
    const total=ok+sk;const pct=total>0?Math.round(ok/total*100):0;return{ok,sk,min,sessions:entries.length,pct}}
  const thisWeek=sumWeek(weekStart,now);
  const lastWeek=sumWeek(lastWeekStart,weekStart);
  const improvement=thisWeek.pct-lastWeek.pct;
  return{thisWeek,lastWeek,improvement}
}
