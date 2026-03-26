// ============================================================
// TOKI · Voice / TTS / Speech Recognition
// ============================================================
import { useState, useRef, useCallback, useEffect } from 'react'
import { fbGetBestVoice } from './firebase.js'
import { cheerIdx } from './utils.js'

let voiceProfile={age:12,sex:'m'},cachedVoice=null;
function setVoiceProfile(a,s){voiceProfile={age:a||12,sex:s||'m'};cachedVoice=null;pickVoice()}
function getVP(){const a=voiceProfile.age,s=voiceProfile.sex;if(a<=9)return{rate:.6,pitch:s==='f'?1.35:1.2};if(a<=13)return{rate:.65,pitch:s==='f'?1.15:.92};if(a<=17)return{rate:.7,pitch:s==='f'?1.05:.82};return{rate:.75,pitch:s==='f'?1.0:.78}}
function pickVoice(){const v=window.speechSynthesis?window.speechSynthesis.getVoices():[];const es=v.filter(x=>x.lang&&x.lang.startsWith('es'));if(!es.length)return;const esES=es.filter(x=>x.lang==='es-ES');const esOther=es.filter(x=>x.lang!=='es-ES');const pool=esES.length?esES:esOther.length?esOther:es;const f=/elena|conchita|lucia|miren|monica|paulina|female|femenin|mujer|helena/i,m=/jorge|enrique|pablo|andres|diego|male|masculin|hombre/i;cachedVoice=voiceProfile.sex==='f'?pool.find(x=>f.test(x.name))||pool[0]:pool.find(x=>m.test(x.name))||pool[0]}
if(window.speechSynthesis){window.speechSynthesis.onvoiceschanged=pickVoice;setTimeout(pickVoice,100);setTimeout(pickVoice,500);setTimeout(pickVoice,1500)}
function say(text){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const p=getVP(),u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=p.rate;u.pitch=p.pitch;u.volume=1.0;if(cachedVoice)u.voice=cachedVoice;let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u);setTimeout(finish,Math.max(3000,text.length*250))})}
function sayFB(text){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const p=getVP();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=Math.min(1.0,p.rate+0.15);u.pitch=voiceProfile.sex==='m'?Math.min(1.5,p.pitch+0.4):Math.max(0.6,p.pitch-0.3);u.volume=1.0;const voices=window.speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.startsWith('es'));u.voice=voices.find(v=>v!==cachedVoice)||cachedVoice;let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u);setTimeout(finish,Math.max(2500,text.length*200))})}
// Quick TTS at faster rate for counting
function sayFast(text){return new Promise(res=>{if(!window.speechSynthesis||!text||!text.trim()){res();return}if(!cachedVoice)pickVoice();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=1.1;u.pitch=1.0;u.volume=1.0;if(cachedVoice)u.voice=cachedVoice;let done=false;const finish=()=>{if(!done){done=true;res()}};u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u);setTimeout(finish,Math.max(1200,text.length*120))})}
function stopVoice(){if(window.speechSynthesis)window.speechSynthesis.cancel()}
const _publicVoiceCache={};
function playRec(userId,voiceIds,key){return new Promise(async(res)=>{
  // 1. Check public voice cache/Firebase
  try{
    const phraseKey=key;
    if(_publicVoiceCache[phraseKey]===undefined){
      try{const url=await fbGetBestVoice(phraseKey,voiceProfile.sex,voiceProfile.age);_publicVoiceCache[phraseKey]=url||null}catch(e){_publicVoiceCache[phraseKey]=null}
    }
    if(_publicVoiceCache[phraseKey]){
      const a=new Audio(_publicVoiceCache[phraseKey]);a.onended=()=>res(true);a.onerror=()=>{console.warn('playRec public voice error',key);_publicVoiceCache[phraseKey]=null;playRecLocal(userId,voiceIds,key).then(res)};a.play().then(()=>{}).catch(()=>{playRecLocal(userId,voiceIds,key).then(res)});return
    }
  }catch(e){}
  // 2. Fall through to localStorage
  playRecLocal(userId,voiceIds,key).then(res)
})}
function playRecLocal(userId,voiceIds,key){return new Promise(res=>{if(!voiceIds||!voiceIds.length){res(false);return}for(const vid of voiceIds){try{const raw=localStorage.getItem('toki_voice_'+userId+'_'+vid);if(!raw){continue}const d=JSON.parse(raw);if(d&&d[key]){const a=new Audio(d[key]);a.onended=()=>res(true);a.onerror=()=>{console.warn('playRec audio error for',key);res(false)};a.play().then(()=>{}).catch(e=>{console.warn('playRec play failed',key,e);res(false)});return}}catch(e){console.warn('playRec error',vid,e)}}res(false)})}
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
function starBeep(n){try{const c=new(window.AudioContext||window.webkitAudioContext)();const melodies=[[523,659,784,1047],[440,554,659,880],[587,740,880,1175],[494,622,740,988]];const mel=melodies[Math.floor(Math.random()*melodies.length)];const cnt=Math.min(n,4);for(let i=0;i<cnt;i++){const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=mel[i];g.gain.value=0.08;g.gain.setValueAtTime(0.08,c.currentTime+i*0.15);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+i*0.15+0.12);o.start(c.currentTime+i*0.15);o.stop(c.currentTime+i*0.15+0.12)}if(n>=4){const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=mel[3]*1.25;g.gain.value=0.1;g.gain.setValueAtTime(0.1,c.currentTime+0.7);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+1.0);o.start(c.currentTime+0.7);o.stop(c.currentTime+1.0)}setTimeout(()=>c.close(),1500)}catch(e){}}
async function cheerOrSay(text,uid,vids,_cat){const idx=cheerIdx(text);if(idx>=0){const played=await playRec(uid,vids,'cheer_'+idx);if(played)return}await sayFB(text)}

export { voiceProfile, cachedVoice, setVoiceProfile, getVP, pickVoice, say, sayFB, sayFast, stopVoice, _publicVoiceCache, playRec, playRecLocal, SR_AVAILABLE, useSR, listenQuick, starBeep, cheerOrSay }
