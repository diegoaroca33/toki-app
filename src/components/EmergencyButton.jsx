import { useState, useEffect, useRef } from 'react'
import { RED } from '../constants.js'
import { stopVoice } from '../voice.js'

export function EmergencyButton({user,personas,supPin}){
  const[show,setShow]=useState(false);const[pinInput,setPinInput]=useState('');const[pinErr,setPinErr]=useState(false);
  const speakTimer=useRef(null);
  const padre=(personas||[]).find(p=>p.relation==='Padre');
  const madre=(personas||[]).find(p=>p.relation==='Madre');
  const telPadre=padre?.phone||user?.telefono||'';
  const telMadre=madre?.phone||user?.telefono||'';
  const nombre=user?.name||'';const apellidos=user?.apellidos||'';
  const direccion=user?.direccion||'';
  const lines=[];
  lines.push('HOLA, ME LLAMO '+nombre.toUpperCase()+(apellidos?' '+apellidos.toUpperCase():''));
  if(telPadre)lines.push('TELÉFONO: '+telPadre);
  if(telMadre&&telMadre!==telPadre)lines.push('TELÉFONO 2: '+telMadre);
  if(direccion)lines.push('MI DIRECCIÓN ES '+direccion.toUpperCase());
  function speakAll(){
    stopVoice();
    const fullText=lines.join('. ');
    const u=new SpeechSynthesisUtterance(fullText);u.lang='es-ES';u.rate=0.7;u.volume=1.0;
    u.onend=()=>{speakTimer.current=setTimeout(speakAll,10000)};
    u.onerror=()=>{speakTimer.current=setTimeout(speakAll,10000)};
    window.speechSynthesis.speak(u)}
  function openSOS(){setShow(true);setPinInput('');setPinErr(false);setTimeout(speakAll,500)}
  function closeSOS(){stopVoice();clearTimeout(speakTimer.current);setShow(false);setPinInput('');setPinErr(false)}
  function tryClose(){if(!supPin){closeSOS();return}
    if(pinInput===supPin){closeSOS()}else{setPinErr(true);setPinInput('');setTimeout(()=>setPinErr(false),1500)}}
  useEffect(()=>()=>{stopVoice();clearTimeout(speakTimer.current)},[]);
  if(!nombre)return null;
  return <>
    <button onClick={openSOS} style={{position:'fixed',bottom:20,right:20,width:56,height:56,borderRadius:'50%',border:'none',background:RED,color:'#fff',fontSize:28,cursor:'pointer',zIndex:90,display:'flex',alignItems:'center',justifyContent:'center',animation:'sosPulse 2s infinite',boxShadow:'0 4px 16px rgba(231,76,60,.4)'}}>🆘</button>
    {show&&<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:500,background:RED,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,overflow:'auto'}}>
      <div style={{maxWidth:600,width:'100%',textAlign:'center'}}>
        {lines.map((l,i)=>{
          const isPhone=l.startsWith('TELÉFONO');
          const phoneNum=isPhone?l.replace(/^TELÉFONO[^:]*:\s*/,'').trim():'';
          return <div key={i} style={{margin:'12px 0'}}>
            <p style={{fontSize:i===0?36:isPhone?34:28,fontWeight:900,color:'#fff',margin:0,lineHeight:1.3,textShadow:'0 2px 8px rgba(0,0,0,.3)'}}>{l}</p>
            {isPhone&&phoneNum&&<a href={'tel:'+phoneNum.replace(/\./g,'')} style={{display:'inline-block',marginTop:8,padding:'10px 24px',borderRadius:14,background:'rgba(255,255,255,.2)',border:'2px solid rgba(255,255,255,.5)',color:'#fff',fontSize:22,fontWeight:700,textDecoration:'none',fontFamily:"'Fredoka'"}}>📞 Llamar {phoneNum}</a>}
          </div>})}
      </div>
      <div style={{position:'absolute',bottom:30,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <button onClick={closeSOS} style={{background:'rgba(0,0,0,.3)',border:'2px solid rgba(255,255,255,.4)',borderRadius:12,padding:'12px 28px',color:'#fff',fontSize:20,fontWeight:600,fontFamily:"'Fredoka'",cursor:'pointer'}}>← Volver</button>
      </div>
    </div>}
  </>}
