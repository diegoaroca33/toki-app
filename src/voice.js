// ============================================================
// TOKI · Voice / TTS / Speech Recognition
// ============================================================
import { useState, useRef, useCallback, useEffect } from 'react'
import { fbGetBestVoice } from './firebase.js'
import { cheerIdx } from './utils.js'

let voiceProfile={age:12,sex:'m'},cachedVoice=null;
// Track active Audio objects so pause can stop them
const _activeAudios=new Set();
function _trackAudio(a){_activeAudios.add(a);const cleanup=()=>_activeAudios.delete(a);a.addEventListener('ended',cleanup);a.addEventListener('error',cleanup);a.addEventListener('pause',cleanup);return a}
function stopAllAudio(){_activeAudios.forEach(a=>{try{a.pause();a.currentTime=0}catch(e){}});_activeAudios.clear()}
function setVoiceProfile(a,s){voiceProfile={age:a||12,sex:s||'m'};cachedVoice=null;pickVoice()}
// Speech rates: slower than normal (1.0) for DI users. These are the MODEL rates.
// The child listens at this speed, so it must be clear and natural — not rushed.
function getVP(){const a=voiceProfile.age,s=voiceProfile.sex;if(a<=9)return{rate:.55,pitch:s==='f'?1.3:1.15};if(a<=13)return{rate:.6,pitch:s==='f'?1.1:.9};if(a<=17)return{rate:.65,pitch:s==='f'?1.0:.82};return{rate:.7,pitch:s==='f'?1.0:.78}}
function pickVoice(){const v=window.speechSynthesis?window.speechSynthesis.getVoices():[];const es=v.filter(x=>x.lang&&x.lang.startsWith('es'));if(!es.length)return;
  // STRONGLY prefer es-ES (Spain). Only fall back to Latin if no es-ES at all.
  const esES=es.filter(x=>x.lang==='es-ES');
  // Also accept es-ES variants like "es-ES-*" or voices with "spain" in name
  const esSpain=es.filter(x=>x.lang==='es-ES'||/spain|espa[ñn]/i.test(x.name));
  const pool=esSpain.length?esSpain:esES.length?esES:es;
  const f=/elena|conchita|lucia|miren|monica|paulina|female|femenin|mujer|helena|ines/i;
  const m=/jorge|enrique|pablo|andres|diego|male|masculin|hombre|alvaro/i;
  cachedVoice=voiceProfile.sex==='f'?pool.find(x=>f.test(x.name))||pool[0]:pool.find(x=>m.test(x.name))||pool[0];
  if(import.meta.env.DEV)console.log('[Toki Voice] Selected:',cachedVoice?.name,cachedVoice?.lang,'from',pool.length,'Spanish voices')}
if(window.speechSynthesis){window.speechSynthesis.onvoiceschanged=pickVoice;setTimeout(pickVoice,100);setTimeout(pickVoice,500);setTimeout(pickVoice,1500)}
// iOS Safari fix: cancel + resume before every speak to prevent frozen queue
// Added delay between cancel and speak to prevent first word being cut off
// Delay between cancel and speak prevents first word being cut off.
// 80ms needed for Samsung tablets (50ms was too fast for some Android TTS engines)
function _iosSpeak(u){const ss=window.speechSynthesis;ss.cancel();if(typeof ss.resume==='function')ss.resume();setTimeout(()=>{ss.speak(u);setTimeout(()=>{if(ss.paused&&typeof ss.resume==='function')ss.resume()},120)},80)}
// iOS Safari: unlock + keep-alive for speechSynthesis
// Call warmUpTTS from user gesture to unlock, then startTTSKeepAlive during game
function warmUpTTS(){try{if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance('.');u.volume=0.01;u.rate=10;u.lang='es-ES';window.speechSynthesis.speak(u)}catch(e){}}
let _ttsKeepAlive=null;
function startTTSKeepAlive(){stopTTSKeepAlive();_ttsKeepAlive=setInterval(()=>{try{if(window.speechSynthesis){if(typeof window.speechSynthesis.resume==='function')window.speechSynthesis.resume();if(window.speechSynthesis.paused)window.speechSynthesis.resume()}}catch(e){}},2000)}
function stopTTSKeepAlive(){if(_ttsKeepAlive){clearInterval(_ttsKeepAlive);_ttsKeepAlive=null}}
function say(text,rateOverride){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const p=getVP(),u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=typeof rateOverride==='number'?rateOverride:p.rate;u.pitch=p.pitch;u.volume=1.0;if(cachedVoice)u.voice=cachedVoice;let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;_iosSpeak(u);setTimeout(finish,Math.max(3000,text.length*250)+100)})}
function sayFB(text){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const p=getVP();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=Math.min(1.0,p.rate+0.15);u.pitch=voiceProfile.sex==='m'?Math.min(1.5,p.pitch+0.4):Math.max(0.6,p.pitch-0.3);u.volume=1.0;
  // Use a DIFFERENT es-ES voice for feedback (so it sounds distinct from model)
  // But ONLY from es-ES pool — never fall back to Latin American voice
  const esESVoices=window.speechSynthesis.getVoices().filter(v=>v.lang==='es-ES');
  u.voice=esESVoices.find(v=>v!==cachedVoice)||cachedVoice;
  let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;_iosSpeak(u);setTimeout(finish,Math.max(2500,text.length*200)+100)})}
// Quick TTS at faster rate for counting
function sayFast(text){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=1.1;u.pitch=1.0;u.volume=1.0;if(cachedVoice)u.voice=cachedVoice;let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;_iosSpeak(u);setTimeout(finish,Math.max(1200,text.length*120))})}
function stopVoice(){if(window.speechSynthesis)window.speechSynthesis.cancel();stopAllAudio()}
const _publicVoiceCache={};

// ── Voice priority system ───────────────────────────────────
// Priority: 'personal' (local first), 'public' (Firebase first), 'tts' (TTS only), 'forced' (specific voice)
function getVoicePriority(){try{return localStorage.getItem('toki_voice_priority')||'personal'}catch(e){return'personal'}}
function setVoicePriority(v){try{localStorage.setItem('toki_voice_priority',v)}catch(e){}}
function getForcedVoice(){try{return localStorage.getItem('toki_forced_voice')||''}catch(e){return''}}
function setForcedVoice(v){try{localStorage.setItem('toki_forced_voice',v||'')}catch(e){}}

// Play a specific local voice by ID
function playRecSingle(userId,voiceId,key){return new Promise(res=>{
  try{const raw=localStorage.getItem('toki_voice_'+userId+'_'+voiceId);if(!raw){res(false);return}
    const d=JSON.parse(raw);if(d&&d[key]){const a=_trackAudio(new Audio(d[key]));a.onended=()=>res(true);a.onerror=()=>res(false);a.play().then(()=>{}).catch(()=>res(false));return}
  }catch(e){}res(false)})}

// Try public voice from Firebase
function playRecPublic(key){return new Promise(async(res)=>{
  try{
    if(_publicVoiceCache[key]===undefined){
      try{const url=await fbGetBestVoice(key,voiceProfile.sex,voiceProfile.age);_publicVoiceCache[key]=url||null}catch(e){_publicVoiceCache[key]=null}}
    if(_publicVoiceCache[key]){
      const a=_trackAudio(new Audio(_publicVoiceCache[key]));a.onended=()=>res(true);a.onerror=()=>{_publicVoiceCache[key]=null;res(false)};a.play().then(()=>{}).catch(()=>res(false));return}
  }catch(e){}res(false)})}

function playRec(userId,voiceIds,key){return new Promise(async(res)=>{
  const prio=getVoicePriority();

  // TTS only — skip all recordings
  if(prio==='tts'){res(false);return}

  // Forced voice — try only that specific voice
  if(prio==='forced'){
    const fv=getForcedVoice();
    if(fv){const ok=await playRecSingle(userId,fv,key);if(ok){res(true);return}}
    res(false);return}

  // Personal first (default): local → public → fail
  if(prio==='personal'){
    const local=await playRecLocal(userId,voiceIds,key);
    if(local){res(true);return}
    const pub=await playRecPublic(key);
    res(pub);return}

  // Public first: public → local → fail
  if(prio==='public'){
    const pub=await playRecPublic(key);
    if(pub){res(true);return}
    const local=await playRecLocal(userId,voiceIds,key);
    res(local);return}

  // Fallback
  res(false)
})}

function playRecLocal(userId,voiceIds,key){return new Promise(res=>{if(!voiceIds||!voiceIds.length){res(false);return}for(const vid of voiceIds){try{const raw=localStorage.getItem('toki_voice_'+userId+'_'+vid);if(!raw){continue}const d=JSON.parse(raw);if(d&&d[key]){const a=_trackAudio(new Audio(d[key]));a.onended=()=>res(true);a.onerror=()=>{console.warn('playRec audio error for',key);res(false)};a.play().then(()=>{}).catch(e=>{console.warn('playRec play failed',key,e);res(false)});return}}catch(e){console.warn('playRec error',vid,e)}}res(false)})}
const SR_AVAILABLE=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
function useSR(onResult){const recRef=useRef(null);const cbRef=useRef(onResult);cbRef.current=onResult;
  const go=useCallback(()=>{if(!SR_AVAILABLE)return;try{if(recRef.current){try{recRef.current.abort()}catch(e){}}
    const S=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new S();r.lang='es-ES';r.continuous=false;r.interimResults=false;r.maxAlternatives=5;
    r.onresult=e=>{const a=[];for(let i=0;i<e.results[0].length;i++)a.push(e.results[0][i].transcript.toLowerCase().trim());if(cbRef.current)cbRef.current(a.join('|'))};
    r.onerror=()=>{};r.onend=()=>{};recRef.current=r;r.start()}catch(e){console.warn('SR start fail',e)}},[]);
  const stop=useCallback(()=>{if(recRef.current){try{recRef.current.abort()}catch(e){}}recRef.current=null},[]);
  useEffect(()=>()=>stop(),[]);
  return{ok:SR_AVAILABLE,go,stop}}
// Quick one-shot speech recognition for counting
function listenQuick(ms){return new Promise(res=>{if(!SR_AVAILABLE){res(null);return}try{const S=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new S();r.lang='es-ES';r.continuous=false;r.interimResults=false;r.maxAlternatives=3;let done=false;const fin=v=>{if(!done){done=true;try{r.abort()}catch(e){}res(v)}};r.onresult=e=>{const a=[];for(let i=0;i<e.results[0].length;i++)a.push(e.results[0][i].transcript.toLowerCase().trim());fin(a.join('|'))};r.onerror=()=>fin(null);r.onend=()=>fin(null);r.start();setTimeout(()=>fin(null),ms||2500)}catch(e){res(null)}})}
function starBeep(n){try{const c=new(window.AudioContext||window.webkitAudioContext)();const melodies=[[523,659,784,1047],[440,554,659,880],[587,740,880,1175],[494,622,740,988]];const mel=melodies[Math.floor(Math.random()*melodies.length)];const cnt=Math.min(n,4);for(let i=0;i<cnt;i++){const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=mel[i];g.gain.value=0.25;g.gain.setValueAtTime(0.25,c.currentTime+i*0.15);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+i*0.15+0.12);o.start(c.currentTime+i*0.15);o.stop(c.currentTime+i*0.15+0.12)}if(n>=4){const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=mel[3]*1.25;g.gain.value=0.3;g.gain.setValueAtTime(0.3,c.currentTime+0.7);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+1.0);o.start(c.currentTime+0.7);o.stop(c.currentTime+1.0)}setTimeout(()=>c.close(),1500)}catch(e){}}
async function cheerOrSay(text,uid,vids,_cat){const idx=cheerIdx(text);if(idx>=0){const played=await playRec(uid,vids,'cheer_'+idx);if(played)return}await sayFB(text)}
function victoryJingle(){try{const c=new(window.AudioContext||window.webkitAudioContext)();const t=c.currentTime;const melody=[{f:392,t:0,d:.12},{f:523,t:.12,d:.12},{f:659,t:.24,d:.12},{f:784,t:.36,d:.12},{f:1047,t:.50,d:.12},{f:1319,t:.64,d:.12},{f:1568,t:.80,d:.45}];const harmony=[{f:261,t:0,d:.24},{f:330,t:.24,d:.24},{f:523,t:.50,d:.24},{f:659,t:.80,d:.45}];melody.forEach(n=>{const o=c.createOscillator();const g=c.createGain();o.type='sine';o.frequency.value=n.f;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(0.001,t+n.t);g.gain.linearRampToValueAtTime(0.30,t+n.t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+n.t+n.d);o.start(t+n.t);o.stop(t+n.t+n.d+0.01)});harmony.forEach(n=>{const o=c.createOscillator();const g=c.createGain();o.type='triangle';o.frequency.value=n.f;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(0.001,t+n.t);g.gain.linearRampToValueAtTime(0.18,t+n.t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+n.t+n.d);o.start(t+n.t);o.stop(t+n.t+n.d+0.01)});const fin=c.createOscillator();const fg=c.createGain();fin.type='sine';fin.frequency.value=1568;fin.connect(fg);fg.connect(c.destination);fg.gain.setValueAtTime(0.001,t+1.3);fg.gain.linearRampToValueAtTime(0.35,t+1.35);fg.gain.exponentialRampToValueAtTime(0.001,t+2.2);fin.start(t+1.3);fin.stop(t+2.3);setTimeout(()=>c.close(),3000)}catch(e){}}

export { voiceProfile, cachedVoice, setVoiceProfile, getVP, pickVoice, say, sayFB, sayFast, stopVoice, stopAllAudio, warmUpTTS, startTTSKeepAlive, stopTTSKeepAlive, _publicVoiceCache, playRec, playRecLocal, SR_AVAILABLE, useSR, listenQuick, starBeep, victoryJingle, cheerOrSay, getVoicePriority, setVoicePriority, getForcedVoice, setForcedVoice }
