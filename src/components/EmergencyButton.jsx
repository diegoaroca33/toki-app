import { useState, useEffect, useRef } from 'react'
import { RED } from '../constants.js'
import { stopVoice } from '../voice.js'

const SAFETY_TIPS=['🚶 Camina por la acera, nunca por la carretera','🦓 Cruza siempre por el paso de cebra','👀 Mira a la izquierda, derecha e izquierda antes de cruzar','🔴 Si el semáforo está rojo, PARA y espera','🙋 Si estás perdido, pide ayuda a un policía o a un adulto con niños','📱 No mires el móvil mientras caminas'];


function hasDataConnection(){
  try{return navigator.onLine}catch(e){return false}
}

export function EmergencyButton({user,personas}){
  const[show,setShow]=useState(false);
  const[gettingLoc,setGettingLoc]=useState(false);
  const[showSafety,setShowSafety]=useState(false);
  const speakTimer=useRef(null);
  const padre=(personas||[]).find(p=>p.relation==='Padre');
  const madre=(personas||[]).find(p=>p.relation==='Madre');
  const telPadre=padre?.phone||user?.telefono||'';
  const telMadre=madre?.phone||user?.telefono||'';
  const nombre=user?.name||'';const apellidos=user?.apellidos||'';
  const direccion=user?.direccion||'';const ciudad=user?.ciudad||'';
  const lines=[];
  lines.push('ME LLAMO '+nombre.toUpperCase()+(apellidos?' '+apellidos.toUpperCase():''));
  if(direccion)lines.push('MI DIRECCIÓN ES '+direccion.toUpperCase()+(ciudad?', '+ciudad.toUpperCase():''));
  lines.push('NECESITO AYUDA');

  function stopAllAudio(){
    // Stop ALL speech synthesis (exercise audio + SOS audio)
    stopVoice();
    try{window.speechSynthesis.cancel()}catch(e){}
    clearTimeout(speakTimer.current);
  }

  function speakAll(){
    stopAllAudio();
    const fullText=lines.join('. ');
    const u=new SpeechSynthesisUtterance(fullText);u.lang='es-ES';u.rate=0.7;u.volume=1.0;
    u.onend=()=>{speakTimer.current=setTimeout(speakAll,10000)};
    u.onerror=()=>{speakTimer.current=setTimeout(speakAll,10000)};
    window.speechSynthesis.speak(u)
  }

  function openSOS(){
    stopAllAudio(); // Cancel any exercise audio FIRST
    window.dispatchEvent(new Event('toki-sos')); // Kill all exercise timers/mic
    setShow(true);
    setTimeout(speakAll,500);
  }

  function closeSOS(){stopAllAudio();setShow(false);setShowSafety(false)}
  useEffect(()=>()=>{stopAllAudio()},[]);

  if(!nombre)return null;

  // Format phone for display
  const fmtPhone=p=>p?p.replace(/(\d{3})(\d{3})(\d{3})/,'$1 $2 $3'):p;

  return <>
    <button onClick={openSOS} aria-label="Emergencia SOS" style={{position:'fixed',bottom:20,right:20,width:72,height:72,borderRadius:'50%',border:'none',background:RED,color:'#fff',fontSize:36,cursor:'pointer',zIndex:90,display:'flex',alignItems:'center',justifyContent:'center',animation:'sosPulse 2s infinite',boxShadow:'0 4px 16px rgba(231,76,60,.4)'}}>🆘</button>
    {show&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:500,background:RED,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,overflow:'auto'}}>
      <div style={{maxWidth:600,width:'100%',textAlign:'center'}}>
        {lines.map((l,i)=><div key={i} style={{margin:'12px 0'}}>
          <p style={{fontSize:i===0?36:28,fontWeight:900,color:'#fff',margin:0,lineHeight:1.3,textShadow:'0 2px 8px rgba(0,0,0,.3)'}}>{l}</p>
        </div>)}
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:12,alignItems:'center'}}>
          {/* Phone buttons: show number always, make it a link only if device can call */}
          {telPadre&&<a href={'tel:'+telPadre.replace(/[\s.]/g,'')} style={{display:'inline-block',padding:'14px 28px',borderRadius:16,background:'rgba(255,255,255,.25)',border:'2px solid rgba(255,255,255,.6)',color:'#fff',fontSize:22,fontWeight:700,textDecoration:'none',fontFamily:"'Fredoka'",minWidth:220,textAlign:'center'}}>
            📞 Llamar{padre?' a '+padre.name:''}<br/><span style={{fontSize:18,fontWeight:600,opacity:.9}}>{fmtPhone(telPadre)}</span>
          </a>}
          {telMadre&&telMadre!==telPadre&&<a href={'tel:'+telMadre.replace(/[\s.]/g,'')} style={{display:'inline-block',padding:'14px 28px',borderRadius:16,background:'rgba(255,255,255,.25)',border:'2px solid rgba(255,255,255,.6)',color:'#fff',fontSize:22,fontWeight:700,textDecoration:'none',fontFamily:"'Fredoka'",minWidth:220,textAlign:'center'}}>
            📞 Llamar{madre?' a '+madre.name:''}<br/><span style={{fontSize:18,fontWeight:600,opacity:.9}}>{fmtPhone(telMadre)}</span>
          </a>}
          <a href="tel:112" style={{display:'inline-block',padding:'14px 28px',borderRadius:16,background:'rgba(255,255,255,.15)',border:'2px solid rgba(255,255,255,.4)',color:'#fff',fontSize:22,fontWeight:700,textDecoration:'none',fontFamily:"'Fredoka'",minWidth:220,textAlign:'center'}}>🚨 Emergencias 112</a>
          {/* Ir a casa: show address always, Google Maps only with data */}
          {direccion&&!showSafety&&<>
            <div style={{margin:'8px 0',padding:'10px 16px',borderRadius:12,background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.3)'}}>
              <p style={{fontSize:16,color:'rgba(255,255,255,.8)',margin:0,fontWeight:600}}>🏠 {direccion}</p>
            </div>
            {hasDataConnection()&&<button onClick={()=>{setShowSafety(true);stopAllAudio();
              const safetyText=SAFETY_TIPS.map(t=>t.replace(/^[^\s]+\s/,'')).join('. ');
              const u2=new SpeechSynthesisUtterance('Antes de caminar, recuerda: '+safetyText);u2.lang='es-ES';u2.rate=0.8;u2.volume=1.0;window.speechSynthesis.speak(u2)
            }} style={{display:'inline-block',padding:'14px 28px',borderRadius:16,background:'rgba(255,255,255,.3)',border:'3px solid rgba(255,255,255,.8)',color:'#fff',fontSize:24,fontWeight:700,fontFamily:"'Fredoka'",minWidth:220,textAlign:'center',cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,.3)'}}>🗺️ Ir a casa con mapa</button>}
            {!hasDataConnection()&&<p style={{fontSize:16,color:'rgba(255,255,255,.7)',margin:0,fontWeight:600}}>📶 Sin conexión a internet para mapa</p>}
          </>}
        </div>
      </div>
      {showSafety&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.85)',zIndex:510,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <div style={{maxWidth:420,width:'100%',background:'#1a237e',borderRadius:20,padding:'24px 20px',border:'3px solid #FFD700',textAlign:'left'}}>
          <p style={{fontSize:24,fontWeight:900,color:'#FFD700',margin:'0 0 16px',textAlign:'center'}}>⚠️ ANTES DE CAMINAR</p>
          {SAFETY_TIPS.map((t,i)=><p key={i} style={{fontSize:18,color:'#fff',margin:'10px 0',fontWeight:600,lineHeight:1.4}}>{t}</p>)}
          <button onClick={()=>{stopAllAudio();setGettingLoc(true);
            function openMap(origin){const dest=encodeURIComponent(direccion);const url=origin?'https://www.google.com/maps/dir/?api=1&origin='+origin+'&destination='+dest+'&travelmode=walking':'https://www.google.com/maps/dir/?api=1&destination='+dest+'&travelmode=walking';window.open(url,'_blank');setGettingLoc(false)}
            if(!navigator.geolocation){openMap(null);return}
            navigator.geolocation.getCurrentPosition(pos=>openMap(pos.coords.latitude+','+pos.coords.longitude),()=>openMap(null),{enableHighAccuracy:true,timeout:8000})
          }} style={{width:'100%',padding:'16px 20px',borderRadius:14,background:'#4CAF50',border:'3px solid #2E7D32',color:'#fff',fontSize:22,fontWeight:700,fontFamily:"'Fredoka'",cursor:'pointer',marginTop:16,boxShadow:'0 4px 12px rgba(0,0,0,.4)',textAlign:'center'}}>{gettingLoc?'📍 Buscando ubicación...':'✅ Entendido, vamos'}</button>
          <button onClick={()=>{setShowSafety(false);stopAllAudio()}} style={{width:'100%',padding:'10px',borderRadius:10,background:'transparent',border:'2px solid rgba(255,255,255,.3)',color:'rgba(255,255,255,.7)',fontSize:16,fontWeight:600,fontFamily:"'Fredoka'",cursor:'pointer',marginTop:8,textAlign:'center'}}>← Volver</button>
        </div>
      </div>}
      <div style={{position:'absolute',bottom:30,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <button onClick={closeSOS} style={{background:'rgba(0,0,0,.3)',border:'2px solid rgba(255,255,255,.4)',borderRadius:12,padding:'12px 28px',color:'#fff',fontSize:20,fontWeight:600,fontFamily:"'Fredoka'",cursor:'pointer'}}>← Volver</button>
      </div>
    </div>}
  </>}
