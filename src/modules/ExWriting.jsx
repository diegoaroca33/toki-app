import { useState, useEffect, useRef } from 'react'
import { GOLD, GREEN, DIM } from '../constants.js'
import { say, stopVoice, starBeep, cheerOrSay, useSR } from '../voice.js'
import { beep, mkPerfect } from '../utils.js'
import { useIdle } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

// ===== ESCRITURA / CALIGRAFÍA =====
const LETTERS_UPPER='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
const LETTERS_LOWER='abcdefghijklmnñopqrstuvwxyz'.split('');
const STROKE_GUIDES={A:[{d:'↗',n:1,x:.3,y:.8,ex:.5,ey:.1},{d:'↘',n:2,x:.5,y:.1,ex:.7,ey:.8},{d:'→',n:3,x:.35,y:.55,ex:.65,ey:.55}],B:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'↷',n:2,x:.35,y:.1,ex:.35,ey:.5},{d:'↷',n:3,x:.35,y:.5,ex:.35,ey:.9}],C:[{d:'↶',n:1,x:.7,y:.15,ex:.7,ey:.85}],D:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'↷',n:2,x:.35,y:.1,ex:.35,ey:.9}],E:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'→',n:2,x:.35,y:.1,ex:.7,ey:.1},{d:'→',n:3,x:.35,y:.5,ex:.65,ey:.5},{d:'→',n:4,x:.35,y:.9,ex:.7,ey:.9}],F:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'→',n:2,x:.35,y:.1,ex:.7,ey:.1},{d:'→',n:3,x:.35,y:.5,ex:.65,ey:.5}],G:[{d:'↶',n:1,x:.7,y:.15,ex:.7,ey:.85},{d:'←',n:2,x:.7,y:.5,ex:.5,ey:.5}],H:[{d:'↓',n:1,x:.3,y:.1,ex:.3,ey:.9},{d:'↓',n:2,x:.7,y:.1,ex:.7,ey:.9},{d:'→',n:3,x:.3,y:.5,ex:.7,ey:.5}],I:[{d:'↓',n:1,x:.5,y:.1,ex:.5,ey:.9}],J:[{d:'↓',n:1,x:.6,y:.1,ex:.6,ey:.75},{d:'↶',n:2,x:.6,y:.75,ex:.35,ey:.9}],K:[{d:'↓',n:1,x:.3,y:.1,ex:.3,ey:.9},{d:'↙',n:2,x:.7,y:.1,ex:.3,ey:.5},{d:'↘',n:3,x:.3,y:.5,ex:.7,ey:.9}],L:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'→',n:2,x:.35,y:.9,ex:.7,ey:.9}],M:[{d:'↓',n:1,x:.2,y:.9,ex:.2,ey:.1},{d:'↘',n:2,x:.2,y:.1,ex:.5,ey:.5},{d:'↗',n:3,x:.5,y:.5,ex:.8,ey:.1},{d:'↓',n:4,x:.8,y:.1,ex:.8,ey:.9}],N:[{d:'↓',n:1,x:.3,y:.9,ex:.3,ey:.1},{d:'↘',n:2,x:.3,y:.1,ex:.7,ey:.9},{d:'↑',n:3,x:.7,y:.9,ex:.7,ey:.1}],O:[{d:'↶',n:1,x:.5,y:.1,ex:.5,ey:.1}],P:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'↷',n:2,x:.35,y:.1,ex:.35,ey:.5}],Q:[{d:'↶',n:1,x:.5,y:.1,ex:.5,ey:.1},{d:'↘',n:2,x:.55,y:.7,ex:.75,ey:.95}],R:[{d:'↓',n:1,x:.35,y:.1,ex:.35,ey:.9},{d:'↷',n:2,x:.35,y:.1,ex:.35,ey:.5},{d:'↘',n:3,x:.5,y:.5,ex:.7,ey:.9}],S:[{d:'↶↷',n:1,x:.65,y:.15,ex:.35,ey:.85}],T:[{d:'→',n:1,x:.25,y:.1,ex:.75,ey:.1},{d:'↓',n:2,x:.5,y:.1,ex:.5,ey:.9}],U:[{d:'↓↷',n:1,x:.3,y:.1,ex:.7,ey:.1}],V:[{d:'↘',n:1,x:.25,y:.1,ex:.5,ey:.9},{d:'↗',n:2,x:.5,y:.9,ex:.75,ey:.1}],W:[{d:'↘',n:1,x:.15,y:.1,ex:.35,ey:.9},{d:'↗',n:2,x:.35,y:.9,ex:.5,ey:.4},{d:'↘',n:3,x:.5,y:.4,ex:.65,ey:.9},{d:'↗',n:4,x:.65,y:.9,ex:.85,ey:.1}],X:[{d:'↘',n:1,x:.25,y:.1,ex:.75,ey:.9},{d:'↗',n:2,x:.25,y:.9,ex:.75,ey:.1}],Y:[{d:'↘',n:1,x:.25,y:.1,ex:.5,ey:.5},{d:'↙',n:2,x:.75,y:.1,ex:.5,ey:.5},{d:'↓',n:3,x:.5,y:.5,ex:.5,ey:.9}],Z:[{d:'→',n:1,x:.25,y:.1,ex:.75,ey:.1},{d:'↙',n:2,x:.75,y:.1,ex:.25,ey:.9},{d:'→',n:3,x:.25,y:.9,ex:.75,ey:.9}]};
STROKE_GUIDES['Ñ']=STROKE_GUIDES.N;
const WRITE_WORDS=['CASA','MESA','SOL','PAN','LUZ','OJO','UNO','DOS','MAR','PIE','OSO','AVE','RIO','DIA','REY','MIS','TUS','SUS','HOY','AGUA','LECHE','MAMA','PAPA','COLE','AMIGO','PERRO','GATO','COCHE','PELOTA','PARQUE','CALLE','TIENDA','MOVIL','MUSICA','MESA','SILLA','LIBRO','ZAPATO','COCINA','BAÑO','TOALLA','JABON','RELOJ','LLAVE'];
const WRITE_PHRASES=['ME LLAMO GUILLERMO','HOY ES LUNES','QUIERO AGUA','TENGO HAMBRE','MI CASA ES','SOL Y LUNA','PAN CON QUESO','QUIERO AGUA POR FAVOR','VOY AL PARQUE','ES MI AMIGO','ESTOY CONTENTO','NO ME GUSTA','TENGO MUCHO HAMBRE','HOY HACE MUCHO FRIO','MAÑANA ES SABADO','ME GUSTA LA MUSICA','JUEGO CON MIS AMIGOS','VOY AL COLE EN AUTOBUS','MI PADRE SE LLAMA {padre}','QUIERO IR A LA PISCINA'];
const DESCENDERS='gjpqy'.split('');const ASCENDERS='bdfhklt'.split('');

const WRITE_WORDS_LOWER=['casa','mesa','sol','pan','luz','ojo','uno','dos','mar','pie','oso','ave','rio','dia','rey','mis','tus','sus','hoy','agua','leche','mama','papa','cole','amigo','perro','gato','coche','pelota','parque','calle','tienda','movil','musica','mesa','silla','libro','zapato','cocina','baño','toalla','jabon','reloj','llave'];
const WRITE_PHRASES_LOWER=['me llamo guillermo','hoy es lunes','quiero agua','tengo hambre','mi casa es','sol y luna','pan con queso','quiero agua por favor','voy al parque','es mi amigo','estoy contento','no me gusta','tengo mucho hambre','hoy hace mucho frio','mañana es sabado','me gusta la musica','juego con mis amigos','voy al cole en autobus','mi padre se llama {padre}','quiero ir a la piscina'];
export function genWriting(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const items=[];
  if(lv<=2){const letters=LETTERS_UPPER;const guide=lv===1;letters.forEach(l=>{items.push({ty:'writing',letter:l,guide,isUpper:true,mode:'letter',id:'wr_'+lv+'_'+l})});return items.sort(()=>Math.random()-.5).slice(0,20)}
  if(lv===3||lv===4){const letters=LETTERS_LOWER;const guide=lv===3;letters.forEach(l=>{items.push({ty:'writing',letter:l,guide,isUpper:false,mode:'letter',id:'wr_'+lv+'_'+l})});return items.sort(()=>Math.random()-.5).slice(0,20)}
  if(lv===5){return[...WRITE_WORDS].sort(()=>Math.random()-.5).slice(0,12).map(w=>({ty:'writing',letter:w,guide:true,isUpper:true,mode:'word',id:'wr_w_'+w}))}
  if(lv===51){return[...WRITE_WORDS].sort(()=>Math.random()-.5).slice(0,12).map(w=>({ty:'writing',letter:w,guide:false,isUpper:true,mode:'word',id:'wr_wf_'+w}))}
  if(lv===52){return[...WRITE_WORDS_LOWER].sort(()=>Math.random()-.5).slice(0,12).map(w=>({ty:'writing',letter:w,guide:true,isUpper:false,mode:'word',id:'wr_wl_'+w}))}
  if(lv===53){return[...WRITE_WORDS_LOWER].sort(()=>Math.random()-.5).slice(0,12).map(w=>({ty:'writing',letter:w,guide:false,isUpper:false,mode:'word',id:'wr_wlf_'+w}))}
  if(lv===6){return[...WRITE_PHRASES].sort(()=>Math.random()-.5).slice(0,8).map(p=>({ty:'writing',letter:p,guide:true,isUpper:true,mode:'phrase',id:'wr_p_'+p.replace(/\s/g,'_')}))}
  if(lv===61){return[...WRITE_PHRASES].sort(()=>Math.random()-.5).slice(0,8).map(p=>({ty:'writing',letter:p,guide:false,isUpper:true,mode:'phrase',id:'wr_pf_'+p.replace(/\s/g,'_')}))}
  if(lv===62){return[...WRITE_PHRASES_LOWER].sort(()=>Math.random()-.5).slice(0,8).map(p=>({ty:'writing',letter:p,guide:true,isUpper:false,mode:'phrase',id:'wr_pl_'+p.replace(/\s/g,'_')}))}
  return[...WRITE_PHRASES_LOWER].sort(()=>Math.random()-.5).slice(0,8).map(p=>({ty:'writing',letter:p,guide:false,isUpper:false,mode:'phrase',id:'wr_plf_'+p.replace(/\s/g,'_')}))}

export function ExWriting({ex,onOk,onSkip,name}){
  const canvasRef=useRef(null);const modelRef=useRef(null);const drawing=useRef(false);const strokePts=useRef([]);const[done,setDone]=useState(false);const[stars,setStars]=useState(0);const[showModel,setShowModel]=useState(false);const{idleMsg,poke}=useIdle(name,!done);
  const[speakPhase,setSpeakPhase]=useState(false);const speakDone=useRef(false);
  const sr=useSR(()=>{});
  const oralEnabled=()=>{try{const v=localStorage.getItem('toki_oral_all_planets');if(v===null)return true;return v==='true'}catch(e){return true}};
  const[ghostAnimating,setGhostAnimating]=useState(false);const ghostTimers=useRef([]);
  const isWide=ex.mode==='word'||ex.mode==='phrase';
  // Auto-size based on mode: letters=big pauta, words=medium, phrases=small
  const cW=ex.mode==='phrase'?800:isWide?700:400;
  const cH=ex.mode==='letter'?400:ex.mode==='word'?300:240;
  const baseY=ex.mode==='letter'?300:ex.mode==='word'?210:170;
  const upperY=ex.mode==='letter'?60:ex.mode==='word'?50:40;
  const ascY=ex.mode==='letter'?30:ex.mode==='word'?25:20;
  const descY=ex.mode==='letter'?360:ex.mode==='word'?260:210;
  const midY=ex.mode==='letter'?175:ex.mode==='word'?130:105;
  // 6.7 Lowercase: school-style Caveat font; Uppercase: bold Fredoka
  function getModelFont(fSz){
    if(ex.isUpper) return `bold ${fSz}px Fredoka`;
    return `${Math.floor(fSz*1.1)}px 'Caveat','Segoe Script','Comic Sans MS',cursive`;
  }
  // 6.1 FRENCH CALLIGRAPHY GUIDELINES (Pauta francesa)
  function drawPauta(ctx,w,h){
    ctx.fillStyle='#FAFAF5';ctx.fillRect(0,0,w,h);
    // Pauta francesa (French calligraphy lines)
    // Base line: thick blue 3px — where letters sit
    ctx.strokeStyle='#2E75B6';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,baseY);ctx.lineTo(w,baseY);ctx.stroke();
    // Top line (mayusculas): thin blue
    ctx.strokeStyle='#2E75B6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,upperY);ctx.lineTo(w,upperY);ctx.stroke();
    // Mid line: thin blue — top of regular lowercase
    ctx.strokeStyle='#2E75B6';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,midY);ctx.lineTo(w,midY);ctx.stroke();
    // Ascender line: thin dashed — for b,d,f,h,k,l,t
    ctx.setLineDash([5,5]);ctx.strokeStyle='#2E75B6';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(0,ascY);ctx.lineTo(w,ascY);ctx.stroke();ctx.setLineDash([]);
    // Descender line: thin dashed — for g,j,p,q,y
    ctx.setLineDash([4,4]);ctx.strokeStyle='#2E75B6';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(0,descY);ctx.lineTo(w,descY);ctx.stroke();ctx.setLineDash([]);
    // Light fill between baseline and upper for capital zone
    ctx.fillStyle='rgba(46,117,182,0.04)';ctx.fillRect(0,upperY,w,baseY-upperY);
    // Light fill between midY and baseY for lowercase zone
    ctx.fillStyle='rgba(46,117,182,0.03)';ctx.fillRect(0,midY,w,baseY-midY);
  }
  // 6.2 STROKE GUIDE with numbered circles + directional arrows
  function drawGuide(ctx,w,h){
    if(!ex.guide)return;const letter=ex.letter;
    if(ex.mode==='letter'){
      const zoneH=ex.isUpper?(baseY-upperY):(baseY-midY);
      const fSz=Math.floor(zoneH/0.72);
      ctx.font=getModelFont(fSz);
      ctx.fillStyle='#D0D0D0';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(letter,w/2,baseY);
      if(ex.isUpper){
        const sg=STROKE_GUIDES[letter.toUpperCase()];
        if(sg){
          const zone={x:w/2-fSz*.45,y:upperY,w:fSz*.9,h:baseY-upperY};
          // For curved letters, clamp positions to stay within the letter zone
          const clampX=(v)=>Math.max(zone.x+8,Math.min(zone.x+zone.w-8,v));
          const clampY=(v)=>Math.max(zone.y+8,Math.min(zone.y+zone.h-8,v));
          // Calculate all number positions first, then apply collision avoidance
          const numPositions=sg.map(s=>({x:clampX(zone.x+s.x*zone.w),y:clampY(zone.y+s.y*zone.h)}));
          // Collision detection: if two numbers are < 26px apart, offset them
          // Multiple passes to resolve cascading overlaps
          for(let pass=0;pass<3;pass++){
            for(let i=1;i<numPositions.length;i++){
              for(let j=0;j<i;j++){
                const dx=numPositions[i].x-numPositions[j].x,dy=numPositions[i].y-numPositions[j].y;
                const dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<26&&dist>0){const push=(26-dist)/2+2;const ux=dx/dist,uy=dy/dist;
                  numPositions[i].x=clampX(numPositions[i].x+ux*push);numPositions[i].y=clampY(numPositions[i].y+uy*push);
                  numPositions[j].x=clampX(numPositions[j].x-ux*push);numPositions[j].y=clampY(numPositions[j].y-uy*push)}
                else if(dist===0){numPositions[i].y=clampY(numPositions[i].y+14);numPositions[j].y=clampY(numPositions[j].y-12)}
              }
            }
          }
          sg.forEach((s,si)=>{
            const sx=numPositions[si].x,sy=numPositions[si].y;
            const endX=clampX(zone.x+(s.ex||s.x)*zone.w),endY=clampY(zone.y+(s.ey||s.y)*zone.h);
            ctx.fillStyle='#E74C3C';ctx.beginPath();ctx.arc(sx,sy,11,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#fff';ctx.font='bold 13px Fredoka';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(s.n),sx,sy);
            const ddx=endX-sx,ddy=endY-sy;const len=Math.sqrt(ddx*ddx+ddy*ddy);
            if(len>20){
              const ux=ddx/len,uy=ddy/len;const arrowLen=Math.min(25,len*0.4);
              const ax=sx+ux*14,ay=sy+uy*14;const bx=ax+ux*arrowLen,by=ay+uy*arrowLen;
              ctx.strokeStyle='#E74C3C';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
              const headLen=8;const angle=Math.atan2(by-ay,bx-ax);
              ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx-headLen*Math.cos(angle-0.5),by-headLen*Math.sin(angle-0.5));ctx.moveTo(bx,by);ctx.lineTo(bx-headLen*Math.cos(angle+0.5),by-headLen*Math.sin(angle+0.5));ctx.stroke();
            }
          });
        }
      }
    }else{
      // Words/phrases: size text to fill pauta zone (upperY to baseY)
      const zoneH=baseY-upperY;
      // Use canvas measureText to find a font size that actually fits the pauta height
      let fSz=ex.mode==='phrase'?Math.floor(zoneH*0.7):Math.floor(zoneH*0.85);
      // Iteratively adjust: measure actual height and scale to fit
      ctx.font=getModelFont(fSz);
      const metrics=ctx.measureText(letter);
      const actualH=(metrics.actualBoundingBoxAscent||fSz*0.7)+(metrics.actualBoundingBoxDescent||fSz*0.1);
      if(actualH>0){const ratio=zoneH/actualH;fSz=Math.floor(fSz*Math.min(ratio*0.92,1.5))}
      ctx.font=getModelFont(fSz);ctx.fillStyle='#D0D0D0';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(letter,w/2,baseY);
    }
  }
  // 6.4 Model mask for pixel-based stroke evaluation
  function getModelMask(){
    const offC=document.createElement('canvas');offC.width=cW;offC.height=cH;
    const octx=offC.getContext('2d');
    if(ex.mode==='letter'){
      const zoneH=ex.isUpper?(baseY-upperY):(baseY-midY);const fSz=Math.floor(zoneH/0.72);
      octx.font=getModelFont(fSz);octx.fillStyle='#000';octx.textAlign='center';octx.textBaseline='alphabetic';octx.fillText(ex.letter,cW/2,baseY);
    }else{
      const zoneH=baseY-upperY;
      let fSz=ex.mode==='phrase'?Math.floor(zoneH*0.7):Math.floor(zoneH*0.85);
      octx.font=getModelFont(fSz);
      const metrics=octx.measureText(ex.letter);
      const actualH=(metrics.actualBoundingBoxAscent||fSz*0.7)+(metrics.actualBoundingBoxDescent||fSz*0.1);
      if(actualH>0){const ratio=zoneH/actualH;fSz=Math.floor(fSz*Math.min(ratio*0.92,1.5))}
      octx.font=getModelFont(fSz);octx.fillStyle='#000';octx.textAlign='center';octx.textBaseline='alphabetic';octx.fillText(ex.letter,cW/2,baseY);
    }
    const imgData=octx.getImageData(0,0,cW,cH);
    const mask=new Uint8Array(cW*cH);
    for(let i=0;i<imgData.data.length;i+=4){if(imgData.data[i+3]>30)mask[i/4]=1;}
    const dilated=new Uint8Array(cW*cH);const rad=6;
    for(let y=0;y<cH;y++)for(let x=0;x<cW;x++){
      let found=false;
      for(let dy=-rad;dy<=rad&&!found;dy++)for(let dx=-rad;dx<=rad&&!found;dx++){
        const nx=x+dx,ny=y+dy;
        if(nx>=0&&nx<cW&&ny>=0&&ny<cH&&mask[ny*cW+nx])found=true;
      }
      if(found)dilated[y*cW+x]=1;
    }
    modelRef.current=dilated;return dilated;
  }
  useEffect(()=>{setDone(false);setStars(0);setShowModel(false);setSpeakPhase(false);speakDone.current=false;strokePts.current=[];modelRef.current=null;const c=canvasRef.current;if(!c)return;const ctx=c.getContext('2d');drawPauta(ctx,cW,cH);drawGuide(ctx,cW,cH);
    stopVoice();const msg=ex.mode==='letter'?'Escribe la letra '+ex.letter:ex.mode==='word'?'Escribe '+ex.letter:'Escribe: '+ex.letter;setTimeout(()=>say(msg),400);return()=>{stopVoice();sr.stop()}},[ex]);
  // M10: Oral production phase after writing words/phrases
  useEffect(()=>{
    if(!speakPhase||speakDone.current)return;speakDone.current=true;
    let cancelled=false;
    (async()=>{
      // 1. Show word large for 1s (already rendered via speakPhase state)
      await new Promise(r=>setTimeout(r,1000));
      if(cancelled)return;
      // 2. Toki says the word
      await say(ex.letter);
      if(cancelled)return;
      // 3. Beep + mic - start listening
      beep(880,150);
      sr.go();
      // 4. Listen for 3.5 seconds then move on
      await new Promise(r=>setTimeout(r,3500));
      if(cancelled)return;
      sr.stop();
      setSpeakPhase(false);
      setTimeout(onOk,300);
    })();
    return()=>{cancelled=true;sr.stop()}
  },[speakPhase]);
  const lastDraw=useRef({x:0,y:0});const isStylus=useRef(false);
  function getPos(e){const c=canvasRef.current;const r=c.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left)*(c.width/r.width),y:(t.clientY-r.top)*(c.height/r.height)}}
  function detectStylus(e){if(e.touches&&e.touches[0]){const t=e.touches[0];if(t.touchType==='stylus'||t.radiusX<5)return true}return false}
  function getLineWidth(e){return detectStylus(e)?2:4}
  function start(e){e.preventDefault();if(ghostAnimating)return;poke();drawing.current=true;isStylus.current=detectStylus(e);const p=getPos(e);lastDraw.current={x:p.x,y:p.y};strokePts.current.push(p);const ctx=canvasRef.current.getContext('2d');ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.strokeStyle='#2E75B6';ctx.lineWidth=getLineWidth(e);ctx.lineCap='round';ctx.lineJoin='round'}
  function move(e){e.preventDefault();if(!drawing.current)return;const p=getPos(e);const dx=p.x-lastDraw.current.x,dy=p.y-lastDraw.current.y;if(Math.sqrt(dx*dx+dy*dy)<2)return;lastDraw.current={x:p.x,y:p.y};strokePts.current.push(p);const lw=isStylus.current?2:4;const ctx=canvasRef.current.getContext('2d');ctx.strokeStyle='#2E75B6';ctx.lineWidth=lw;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(p.x,p.y);ctx.stroke()}
  function end(e){e.preventDefault();drawing.current=false}
  function clear(){strokePts.current=[];const c=canvasRef.current;const ctx=c.getContext('2d');drawPauta(ctx,cW,cH);drawGuide(ctx,cW,cH)}
  function playGhostHand(){
    if(ghostAnimating||!canvasRef.current)return;
    const L=(ex.mode==='letter'?ex.letter:'').toUpperCase();
    const strokes=LETTER_STROKE_PATHS[L];
    if(!strokes||!strokes.length)return;
    setGhostAnimating(true);
    strokePts.current=[];
    const c=canvasRef.current;const ctx=c.getContext('2d');
    drawPauta(ctx,cW,cH);drawGuide(ctx,cW,cH);
    // Zone calculation
    const zoneH=ex.isUpper?(baseY-upperY):(baseY-midY);
    const fSz=Math.floor(zoneH/0.72);
    const zoneX=cW/2-fSz*0.45,zoneW=fSz*0.9;
    const zoneYTop=ex.isUpper?upperY:midY;
    const STROKE_COLOR='rgba(76,175,80,0.5)';const STROKE_WIDTH=6;const POINTS_PER_STROKE=40;const MS_PER_POINT=35;
    function interpolatePoints(pts,num){if(pts.length<2)return pts;const result=[];const totalSegs=pts.length-1;
      for(let i=0;i<totalSegs;i++){const segPts=Math.ceil(num/totalSegs);for(let j=0;j<segPts;j++){const t=j/segPts;const p1=pts[i],p2=pts[i+1];result.push({x:p1.x+(p2.x-p1.x)*t,y:p1.y+(p2.y-p1.y)*t})}}
      result.push(pts[pts.length-1]);return result}
    const allStrokes=strokes.map(s=>{const absPoints=s.map(p=>({x:zoneX+p.x*zoneW,y:zoneYTop+p.y*zoneH}));return interpolatePoints(absPoints,POINTS_PER_STROKE)});
    let strokeIdx=0,ptIdx=0;
    // Clear old timers
    ghostTimers.current.forEach(clearTimeout);ghostTimers.current=[];
    function drawFrame(){
      if(strokeIdx>=allStrokes.length){
        let fadeAlpha=0.5;
        const fadeInterval=setInterval(()=>{
          fadeAlpha-=0.05;
          if(fadeAlpha<=0){clearInterval(fadeInterval);drawPauta(ctx,cW,cH);drawGuide(ctx,cW,cH);setGhostAnimating(false);return}
          drawPauta(ctx,cW,cH);drawGuide(ctx,cW,cH);
          ctx.save();ctx.globalAlpha=fadeAlpha;ctx.strokeStyle=STROKE_COLOR;ctx.lineWidth=STROKE_WIDTH;ctx.lineCap='round';ctx.lineJoin='round';
          allStrokes.forEach(pts=>{if(pts.length<2)return;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke()});
          ctx.restore()},50);
        return}
      const pts=allStrokes[strokeIdx];
      if(ptIdx<pts.length&&ptIdx>0){
        ctx.strokeStyle=STROKE_COLOR;ctx.lineWidth=STROKE_WIDTH;ctx.lineCap='round';ctx.lineJoin='round';
        ctx.save();ctx.globalAlpha=0.5;
        ctx.beginPath();ctx.moveTo(pts[ptIdx-1].x,pts[ptIdx-1].y);ctx.lineTo(pts[ptIdx].x,pts[ptIdx].y);ctx.stroke();
        ctx.restore()}
      ptIdx++;
      if(ptIdx>=pts.length){strokeIdx++;ptIdx=0;ghostTimers.current.push(setTimeout(drawFrame,300));return}
      ghostTimers.current.push(setTimeout(drawFrame,MS_PER_POINT))}
    drawFrame()
  }
  useEffect(()=>()=>{ghostTimers.current.forEach(clearTimeout)},[]);
  function evaluate(){const pts=strokePts.current;if(pts.length<5){setStars(1);return 1;}
    const mask=getModelMask();let insideCount=0;
    for(let i=0;i<pts.length;i++){const px=Math.round(pts[i].x),py=Math.round(pts[i].y);if(px>=0&&px<cW&&py>=0&&py<cH&&mask[py*cW+px])insideCount++;}
    const insideRatio=insideCount/pts.length;
    const minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));
    const goodSize=(maxX-minX)>20&&(maxY-minY)>20;
    let s=4;if(insideRatio<=0.4)s=1;else if(insideRatio<=0.6)s=2;else if(insideRatio<=0.8)s=3;
    if(!goodSize&&s>2)s=2;if(pts.length<10&&s>2)s=2;
    setStars(s);return s;}
  function accept(){const s=evaluate();setDone(true);setShowModel(true);starBeep(s);
    // Overlay model in green
    const c=canvasRef.current;if(c){const ctx=c.getContext('2d');const mask=modelRef.current||getModelMask();
      ctx.save();ctx.globalAlpha=0.3;ctx.fillStyle='rgba(0,180,0,1)';
      if(ex.mode==='letter'){const zoneH=ex.isUpper?(baseY-upperY):(baseY-midY);const fSz=Math.floor(zoneH/0.72);ctx.font=getModelFont(fSz);ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(ex.letter,cW/2,baseY)}
      else{const zoneH=baseY-upperY;let fSz=ex.mode==='phrase'?Math.floor(zoneH*0.7):Math.floor(zoneH*0.85);ctx.font=getModelFont(fSz);const mt=ctx.measureText(ex.letter);const ah=(mt.actualBoundingBoxAscent||fSz*0.7)+(mt.actualBoundingBoxDescent||fSz*0.1);if(ah>0){const r=zoneH/ah;fSz=Math.floor(fSz*Math.min(r*0.92,1.5))}ctx.font=getModelFont(fSz);ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(ex.letter,cW/2,baseY)}
      ctx.restore();
      const pts=strokePts.current;if(pts.length>0){ctx.save();ctx.globalAlpha=0.2;ctx.fillStyle='rgba(255,0,0,1)';for(let i=0;i<pts.length;i++){const px=Math.round(pts[i].x),py=Math.round(pts[i].y);if(px>=0&&px<cW&&py>=0&&py<cH&&!mask[py*cW+px]){ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill()}}ctx.restore()}}
    const msgs=['¡Buen intento! Sigue el modelo','¡Intenta no salirte!','¡Muy bien!','¡Perfecto!'];
    const isWordOrPhrase=ex.mode==='word'||ex.mode==='phrase';
    cheerOrSay(s>=3?mkPerfect(name):msgs[s-1],null,[],'perfect').then(()=>{
      if(isWordOrPhrase&&oralEnabled()){speakDone.current=false;setSpeakPhase(true)}
      else setTimeout(onOk,400)})}
  const needsLandscape=isWide;
  return <div style={{textAlign:'center',padding:isWide?10:18}} onClick={poke}>
    {needsLandscape&&<style>{`@media (orientation:portrait) and (max-width:700px){.wr-landscape-warn{display:flex!important}.wr-canvas-wrap{display:none!important}}@media (orientation:landscape),(min-width:701px){.wr-landscape-warn{display:none!important}.wr-canvas-wrap{display:block!important}}`}</style>}
    {needsLandscape&&<div className="wr-landscape-warn" style={{display:'none',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:200,gap:16,animation:'pulse 2s infinite'}}><span style={{fontSize:64}}>📱</span><p style={{fontSize:22,fontWeight:700,color:GOLD}}>Gira la tablet →</p><p style={{fontSize:16,color:DIM}}>Para escribir palabras necesitas modo horizontal</p></div>}
    <div className={needsLandscape?'wr-canvas-wrap':''}>
      {ex.mode!=='letter'&&<div style={{background:GOLD+'15',borderRadius:10,padding:'8px 16px',marginBottom:10}}><p style={{fontSize:22,fontWeight:700,color:GOLD,margin:0}}>{ex.letter}</p></div>}
      <div className="card" style={{padding:12,marginBottom:10,background:'#FAFAF5',borderColor:'#D4D4D4'}}>
        {ex.mode==='letter'&&<p style={{fontSize:18,fontWeight:600,margin:'0 0 8px',color:'#1A1A2E'}}>Escribe: <span style={{fontSize:32,color:'#2E75B6',fontFamily:ex.isUpper?'Fredoka':"'Caveat',cursive"}}>{ex.letter}</span></p>}
        <canvas ref={canvasRef} width={cW} height={cH} style={{width:'100%',maxWidth:cW,height:'auto',aspectRatio:cW+'/'+cH,borderRadius:8,border:'2px solid #D4D4D4',touchAction:'none',cursor:'crosshair'}}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end}
          onMouseDown={start} onMouseMove={move} onMouseUp={end}/>
      </div>
      {!done&&<div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
        {ex.mode==='letter'&&ex.isUpper&&LETTER_STROKE_PATHS[ex.letter.toUpperCase()]&&<button className="btn btn-b" onClick={playGhostHand} disabled={ghostAnimating} style={{maxWidth:140,fontSize:16,padding:'10px 14px',opacity:ghostAnimating?0.5:1}}>{'▶️ Ver cómo'}</button>}
        <button className="btn btn-o" onClick={clear} disabled={ghostAnimating} style={{maxWidth:120}}>🗑️ Borrar</button>
        <button className="btn btn-g" onClick={accept} disabled={ghostAnimating} style={{maxWidth:180}}>✅ Listo</button>
        <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{maxWidth:100,fontSize:14}}>⏭️</button>
      </div>}
      {done&&<div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:10}}><Stars n={stars} sz={36}/>
        <p style={{fontSize:16,color:stars>=3?GREEN:GOLD,fontWeight:700,margin:'8px 0 0'}}>{stars>=4?'¡Perfecto!':stars===3?'¡Muy bien!':stars===2?'¡Intenta no salirte!':'¡Buen intento! Sigue el modelo'}</p></div>}
      {idleMsg&&!done&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:10}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
      {speakPhase&&<div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:9999}}>
        <p style={{fontSize:48,fontWeight:700,color:'#fff',textAlign:'center',margin:'0 0 32px',fontFamily:"'Fredoka',sans-serif"}}>{ex.letter}</p>
        <div style={{width:64,height:64,borderRadius:'50%',background:'#E74C3C',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:32,color:'#fff',lineHeight:1}}>🎤</span>
        </div>
        <p style={{fontSize:18,color:'#fff',marginTop:16,opacity:0.8}}>Di la palabra...</p>
      </div>}
    </div>
  </div>}

export const LETTER_STROKE_PATHS={
  'A':[[{x:.5,y:1},{x:.25,y:0}],[{x:.25,y:0},{x:.5,y:0},{x:.75,y:1}],[{x:.3,y:.55},{x:.7,y:.55}]],
  'B':[[{x:.25,y:0},{x:.25,y:1}],[{x:.25,y:0},{x:.6,y:0},{x:.7,y:.15},{x:.65,y:.45},{x:.25,y:.5}],[{x:.25,y:.5},{x:.65,y:.5},{x:.75,y:.65},{x:.7,y:.9},{x:.25,y:1}]],
  'C':[[{x:.75,y:.15},{x:.5,y:0},{x:.25,y:.15},{x:.15,y:.5},{x:.25,y:.85},{x:.5,y:1},{x:.75,y:.85}]],
  'D':[[{x:.25,y:0},{x:.25,y:1}],[{x:.25,y:0},{x:.55,y:0},{x:.75,y:.2},{x:.8,y:.5},{x:.75,y:.8},{x:.55,y:1},{x:.25,y:1}]],
  'E':[[{x:.25,y:0},{x:.25,y:1}],[{x:.25,y:0},{x:.75,y:0}],[{x:.25,y:.5},{x:.65,y:.5}],[{x:.25,y:1},{x:.75,y:1}]],
  'F':[[{x:.25,y:0},{x:.25,y:1}],[{x:.25,y:0},{x:.75,y:0}],[{x:.25,y:.5},{x:.65,y:.5}]],
  'G':[[{x:.75,y:.15},{x:.5,y:0},{x:.25,y:.15},{x:.15,y:.5},{x:.25,y:.85},{x:.5,y:1},{x:.75,y:.85},{x:.75,y:.5}],[{x:.55,y:.5},{x:.75,y:.5}]],
  'H':[[{x:.2,y:0},{x:.2,y:1}],[{x:.8,y:0},{x:.8,y:1}],[{x:.2,y:.5},{x:.8,y:.5}]],
  'I':[[{x:.5,y:0},{x:.5,y:1}]],
  'J':[[{x:.6,y:0},{x:.6,y:.8},{x:.5,y:.95},{x:.35,y:.95},{x:.25,y:.8}]],
  'K':[[{x:.25,y:0},{x:.25,y:1}],[{x:.75,y:0},{x:.25,y:.5}],[{x:.25,y:.5},{x:.75,y:1}]],
  'L':[[{x:.25,y:0},{x:.25,y:1}],[{x:.25,y:1},{x:.75,y:1}]],
  'M':[[{x:.15,y:1},{x:.15,y:0}],[{x:.15,y:0},{x:.5,y:.55}],[{x:.5,y:.55},{x:.85,y:0}],[{x:.85,y:0},{x:.85,y:1}]],
  'N':[[{x:.2,y:1},{x:.2,y:0}],[{x:.2,y:0},{x:.8,y:1}],[{x:.8,y:1},{x:.8,y:0}]],
  'O':[[{x:.5,y:0},{x:.25,y:.1},{x:.15,y:.5},{x:.25,y:.9},{x:.5,y:1},{x:.75,y:.9},{x:.85,y:.5},{x:.75,y:.1},{x:.5,y:0}]],
  'P':[[{x:.25,y:0},{x:.25,y:1}],[{x:.25,y:0},{x:.6,y:0},{x:.75,y:.12},{x:.75,y:.38},{x:.6,y:.5},{x:.25,y:.5}]],
  'Q':[[{x:.5,y:0},{x:.25,y:.1},{x:.15,y:.5},{x:.25,y:.9},{x:.5,y:1},{x:.75,y:.9},{x:.85,y:.5},{x:.75,y:.1},{x:.5,y:0}],[{x:.6,y:.75},{x:.8,y:1}]],
  'R':[[{x:.25,y:0},{x:.25,y:1}],[{x:.25,y:0},{x:.6,y:0},{x:.75,y:.12},{x:.75,y:.38},{x:.6,y:.5},{x:.25,y:.5}],[{x:.5,y:.5},{x:.75,y:1}]],
  'S':[[{x:.7,y:.1},{x:.5,y:0},{x:.3,y:.1},{x:.25,y:.25},{x:.3,y:.45},{x:.5,y:.5},{x:.7,y:.55},{x:.75,y:.75},{x:.7,y:.9},{x:.5,y:1},{x:.3,y:.9}]],
  'T':[[{x:.2,y:0},{x:.8,y:0}],[{x:.5,y:0},{x:.5,y:1}]],
  'U':[[{x:.2,y:0},{x:.2,y:.75},{x:.35,y:.95},{x:.5,y:1},{x:.65,y:.95},{x:.8,y:.75},{x:.8,y:0}]],
  'V':[[{x:.2,y:0},{x:.5,y:1}],[{x:.5,y:1},{x:.8,y:0}]],
  'W':[[{x:.1,y:0},{x:.3,y:1}],[{x:.3,y:1},{x:.5,y:.4}],[{x:.5,y:.4},{x:.7,y:1}],[{x:.7,y:1},{x:.9,y:0}]],
  'X':[[{x:.2,y:0},{x:.8,y:1}],[{x:.8,y:0},{x:.2,y:1}]],
  'Y':[[{x:.2,y:0},{x:.5,y:.5}],[{x:.8,y:0},{x:.5,y:.5}],[{x:.5,y:.5},{x:.5,y:1}]],
  'Z':[[{x:.2,y:0},{x:.8,y:0}],[{x:.8,y:0},{x:.2,y:1}],[{x:.2,y:1},{x:.8,y:1}]],
};
LETTER_STROKE_PATHS['\u00d1']=LETTER_STROKE_PATHS['N']; // Ñ same as N strokes
