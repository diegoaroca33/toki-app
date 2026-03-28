import { useState, useEffect, useRef } from 'react'
import { GREEN } from '../constants.js'

export function PhotoCropOverlay({imageSrc,onSave,onCancel,shape='circle'}){
  const canvasRef=useRef(null);const containerRef=useRef(null);
  const[scale,setScale]=useState(1);const[translate,setTranslate]=useState({x:0,y:0});
  const[imgSize,setImgSize]=useState({w:0,h:0});
  const dragging=useRef(false);const lastTouch=useRef(null);const lastDist=useRef(0);
  const imgRef=useRef(null);
  const CIRCLE_R=140;
  const RECT_W=280;const RECT_H=Math.round(RECT_W*9/16); // 16:9
  useEffect(()=>{const img=new Image();img.onload=()=>{setImgSize({w:img.width,h:img.height});imgRef.current=img};img.src=imageSrc},[imageSrc]);
  function onTouchStart(e){e.preventDefault();
    if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);lastDist.current=d}
    else if(e.touches.length===1){dragging.current=true;lastTouch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}}
  function onTouchMove(e){e.preventDefault();
    if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(lastDist.current>0){const r=d/lastDist.current;setScale(s=>Math.max(0.3,Math.min(5,s*r)))}lastDist.current=d}
    else if(e.touches.length===1&&dragging.current&&lastTouch.current){const dx=e.touches[0].clientX-lastTouch.current.x;const dy=e.touches[0].clientY-lastTouch.current.y;setTranslate(t=>({x:t.x+dx,y:t.y+dy}));lastTouch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}}
  function onTouchEnd(e){e.preventDefault();dragging.current=false;lastTouch.current=null;lastDist.current=0}
  function onMouseDown(e){e.preventDefault();dragging.current=true;lastTouch.current={x:e.clientX,y:e.clientY}}
  function onMouseMove(e){if(!dragging.current||!lastTouch.current)return;const dx=e.clientX-lastTouch.current.x;const dy=e.clientY-lastTouch.current.y;setTranslate(t=>({x:t.x+dx,y:t.y+dy}));lastTouch.current={x:e.clientX,y:e.clientY}}
  function onMouseUp(){dragging.current=false;lastTouch.current=null}
  function onWheel(e){e.preventDefault();setScale(s=>Math.max(0.3,Math.min(5,s-(e.deltaY>0?0.1:-0.1))))}
  function doSave(){
    if(!imgRef.current){onCancel();return}
    const img=imgRef.current;const cont=containerRef.current;if(!cont){onCancel();return}
    const rect=cont.getBoundingClientRect();
    const cx=rect.width/2;const cy=rect.height/2;
    const dispW=img.width*scale*(Math.min(rect.width,rect.height)/Math.max(img.width,img.height));
    const dispH=img.height*scale*(Math.min(rect.width,rect.height)/Math.max(img.width,img.height));
    const imgLeft=cx-dispW/2+translate.x;const imgTop=cy-dispH/2+translate.y;
    if(shape==='rect'){
      // 16:9 rectangular crop
      const c=document.createElement('canvas');const dpr=Math.max(window.devicePixelRatio||2,3);c.width=Math.round(RECT_W*dpr);c.height=Math.round(RECT_H*dpr);const ctx=c.getContext('2d');
      const cropLeft=cx-RECT_W/2;const cropTop=cy-RECT_H/2;
      const srcX=(cropLeft-imgLeft)/dispW*img.width;
      const srcY=(cropTop-imgTop)/dispH*img.height;
      const srcW=RECT_W/dispW*img.width;
      const srcH=RECT_H/dispH*img.height;
      ctx.drawImage(img,srcX,srcY,srcW,srcH,0,0,c.width,c.height);
      onSave(c.toDataURL('image/jpeg',0.88));
    } else {
      // Circle crop
      // High-res circle crop: fixed 480px canvas for crisp avatars even on 3x DPI
      const c=document.createElement('canvas');const sz=480;c.width=sz;c.height=sz;const ctx=c.getContext('2d');
      ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2,0,Math.PI*2);ctx.clip();
      const circLeft=cx-CIRCLE_R;const circTop=cy-CIRCLE_R;
      const srcX=(circLeft-imgLeft)/dispW*img.width;
      const srcY=(circTop-imgTop)/dispH*img.height;
      const srcW=(CIRCLE_R*2)/dispW*img.width;
      const srcH=(CIRCLE_R*2)/dispH*img.height;
      ctx.drawImage(img,srcX,srcY,srcW,srcH,0,0,sz,sz);
      onSave(c.toDataURL('image/jpeg',0.88));
    }
  }
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:300,background:'rgba(0,0,0,.95)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',touchAction:'none'}}
    onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
    onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
    onWheel={onWheel} ref={containerRef}>
    {imgRef.current&&<img src={imageSrc} alt="" style={{position:'absolute',maxWidth:'90%',maxHeight:'90%',transform:`translate(${translate.x}px,${translate.y}px) scale(${scale})`,userSelect:'none',pointerEvents:'none',WebkitUserDrag:'none'}} draggable={false}/>}
    {/* Dark overlay with cutout */}
    <svg style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none'}}>
      <defs><mask id="cropMask"><rect width="100%" height="100%" fill="white"/>
        {shape==='rect'
          ?<rect x="50%" y="50%" width={RECT_W} height={RECT_H} fill="black" transform={`translate(${-RECT_W/2},${-RECT_H/2})`}/>
          :<circle cx="50%" cy="50%" r={CIRCLE_R} fill="black"/>}
      </mask></defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#cropMask)"/>
      {shape==='rect'
        ?<rect x="50%" y="50%" width={RECT_W} height={RECT_H} fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 4" transform={`translate(${-RECT_W/2},${-RECT_H/2})`} rx="8"/>
        :<circle cx="50%" cy="50%" r={CIRCLE_R} fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 4"/>}
    </svg>
    <div style={{position:'absolute',bottom:40,display:'flex',gap:24}}>
      <button onClick={onCancel} style={{padding:'14px 28px',borderRadius:16,border:'2px solid #fff',background:'rgba(0,0,0,.5)',color:'#fff',fontSize:20,fontWeight:700,fontFamily:"'Fredoka'",cursor:'pointer'}}>✕ Cancelar</button>
      <button onClick={doSave} style={{padding:'14px 28px',borderRadius:16,border:'2px solid '+GREEN,background:GREEN,color:'#fff',fontSize:20,fontWeight:700,fontFamily:"'Fredoka'",cursor:'pointer'}}>✓ Guardar</button>
    </div>
    <p style={{position:'absolute',top:30,color:'rgba(255,255,255,.6)',fontSize:14,fontWeight:600}}>Pellizca para zoom · Arrastra para mover</p>
  </div>}
