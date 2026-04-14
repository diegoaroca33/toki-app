import { useState, useEffect, useRef, useMemo } from 'react'
import { BG, BG3, GOLD, GREEN, RED, TXT, DIM, BORDER, AVS, PERFECT_T, GOOD_MSG, RETRY_MSG, FAIL_MSG, BUILD_OK, NUMS_1_100, QUIEN_SOY } from '../constants.js'
import { EX } from '../exercises.js'
import { score, saveData, loadData, textKey } from '../utils.js'
import { SR_AVAILABLE } from '../voice.js'
import { fbUploadPublicVoice, fbUploadUserVoice, trimSilence, validateVoiceDuration } from '../firebase.js'

export function VoiceRec({user,onBack,onSave,fbUser}){const voices=user.voices||[];const[mode,setMode]=useState('menu');const[recLv,setRecLv]=useState(1);const[selV,setSelV]=useState(()=>voices.length===1?voices[0]:null);const[vn,setVn]=useState(()=>voices.length===1?voices[0].name:'');const[va,setVa]=useState(()=>voices.length===1?(voices[0].avatar||'👨'):'👨');const[vs,setVs]=useState(()=>voices.length===1?(voices[0].sex||'m'):'m');const[vAge,setVAge]=useState(()=>voices.length===1?String(voices[0].age||''):'');const[ri,setRi]=useState(0);const[rec,setRec]=useState(false);const[mr,setMr]=useState(null);const[saved,setSaved]=useState(()=>voices.length===1?(voices[0].saved||0):0);const[pp,setPp]=useState(-1);const[showRules,setShowRules]=useState(false);const[recMsg,setRecMsg]=useState('');const[recBlobs,setRecBlobs]=useState({});const[showDone,setShowDone]=useState(false);const[cedeVoz,setCedeVoz]=useState(false);const[uploading,setUploading]=useState(false);const ch=useRef([]);const vid=useRef(voices.length===1?voices[0].id:null);const riAtStart=useRef(0);
  function init(ex){if(ex){setSelV(ex);vid.current=ex.id;setVn(ex.name);setVa(ex.avatar);setVs(ex.sex||'m');setVAge(String(ex.age||''));setSaved(ex.saved||0)}else{const existing=voices.find(v=>v.name.toLowerCase()===vn.trim().toLowerCase());if(existing){setSelV(existing);vid.current=existing.id;setVa(existing.avatar);setVs(existing.sex||'m');setVAge(String(existing.age||''));setSaved(existing.saved||0)}else{setSelV(null);vid.current=Date.now()+'';setSaved(0)}}}
  const cheerItems=useMemo(()=>[...PERFECT_T.map(t=>t.replace(/\{N\}/g,user.name||'Nico')),...GOOD_MSG,...RETRY_MSG,...FAIL_MSG,...BUILD_OK],[user.name]);
  const phraseItems=useMemo(()=>EX.filter(e=>e.lv===recLv).map(e=>({text:e.ph||e.fu||e.su,id:e.id})).filter(x=>x.text),[recLv]);
  const cheerItems2=useMemo(()=>[...PERFECT_T.map(t=>t.replace(/\{N\}/g,user.name||'Nico')),...GOOD_MSG,...RETRY_MSG,...FAIL_MSG,...BUILD_OK].map((t,i)=>({text:t,id:'cheer_'+i})),[user.name]);
  const countItems=useMemo(()=>NUMS_1_100.map((t,i)=>({text:t,id:'num_'+(i+1)})),[]);
  const personalItems=useMemo(()=>{const items=[];const u=user;if(u.nombre||u.name)items.push({text:'Me llamo '+(u.name||'Nico'),id:'pers_nombre'});if(u.padre)items.push({text:'Mi papá se llama '+u.padre,id:'pers_padre'});if(u.madre)items.push({text:'Mi mamá se llama '+u.madre,id:'pers_madre'});const h=(u.hermanos||'').split(',').map(s=>s.trim()).filter(Boolean);h.forEach((n,i)=>{const fem=/a$/i.test(n)&&!/ma$/i.test(n);items.push({text:(fem?'Mi hermana':'Mi hermano')+' se llama '+n,id:'pers_herm_'+i})});if(u.telefono)items.push({text:'El teléfono de mi papá es '+u.telefono,id:'pers_tel'});if(u.direccion)items.push({text:'Vivo en '+u.direccion,id:'pers_dir'});const a=(u.amigos||'').split(',').map(s=>s.trim()).filter(Boolean);a.forEach((n,i)=>{const fem=/a$/i.test(n)&&!/ma$/i.test(n);items.push({text:(fem?'Mi amiga':'Mi amigo')+' se llama '+n,id:'pers_amigo_'+i})});return items},[user]);
  const quiensoyItems=useMemo(()=>QUIEN_SOY.map(q=>({text:q.text,id:q.id})),[]);
  const items=mode==='cheers'?cheerItems2:mode==='counting'?countItems:mode==='personal'?personalItems:mode==='quiensoy'?quiensoyItems:phraseItems;const cur=items[ri]?.text||'';
  function startMode(m){setShowRules(true);setMode(m)}
  function confirmRules(){setShowRules(false)}
  async function startR(){setRecMsg('');if(mr){try{mr.stop()}catch(e){}}setMr(null);riAtStart.current=ri;const curAtStart=items[ri]?.text||'';try{const s=await navigator.mediaDevices.getUserMedia({audio:{sampleRate:16000,channelCount:1,echoCancellation:true}});const m=new MediaRecorder(s,{mimeType:MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':'audio/webm',audioBitsPerSecond:32000});ch.current=[];m.ondataavailable=e=>{if(e.data.size>0)ch.current.push(e.data)};m.onstop=async()=>{setRec(false);setMr(null);const rawBlob=new Blob(ch.current,{type:'audio/webm'});s.getTracks().forEach(t=>t.stop());
      // Validate duration
      const val=await validateVoiceDuration(rawBlob,curAtStart);
      if(!val.ok){setRecMsg(val.reason==='too_short'?'Grabaci\u00f3n muy corta, repite':'Grabaci\u00f3n muy larga (m\u00e1x 10s), repite');return}
      // Trim silence
      let blob=rawBlob;try{blob=await trimSilence(rawBlob)}catch(e){}
      // Skip SR validation — it listens to live mic (ambient noise), not the recorded blob
      // Duration validation above is sufficient to ensure a real recording was made
      // Save to localStorage
      const reader2=new FileReader();const capturedRi=riAtStart.current;reader2.onload=()=>{const item=items[capturedRi];if(!item)return;const k=mode==='cheers'?item.id:textKey(item.text);const sk='voice_'+user.id+'_'+vid.current;const d=loadData(sk,{});d[k]=reader2.result;d.name=vn;d.avatar=va;d.sex=vs;saveData(sk,d);setSaved(sv=>sv+1);
        // Store blob for potential Firebase upload
        setRecBlobs(prev=>({...prev,[k]:blob}));
        // Upload to Firebase for logged-in users
        if(fbUser){fbUploadUserVoice(fbUser.uid,k,blob).catch(()=>{})}
        setRecMsg('');
        // Auto-advance to next phrase
        if(capturedRi<items.length-1){setTimeout(()=>setRi(capturedRi+1),400)}
        else{setShowDone(true)}
      };reader2.readAsDataURL(blob)
    };m.start();setMr(m);setRec(true)}catch(e){setRec(false);setMr(null);alert('No se puede acceder al micrófono')}}
  function stopR(){if(mr){mr.stop();setMr(null);setRec(false)}}
  function preview(i){const item=items[i];const k=mode==='cheers'?item.id:textKey(item.text);try{const d=loadData('voice_'+user.id+'_'+vid.current,{});if(d[k]){setPp(i);const a=new Audio(d[k]);a.onended=()=>setPp(-1);a.play().catch(()=>setPp(-1))}}catch(e){}}
  async function fin(){
    const v=vid.current;const ageNum=parseInt(vAge)||0;
    const ei=voices.findIndex(x=>x.id===v);let nv;
    if(ei>=0){nv=[...voices];nv[ei]={...voices[ei],saved,age:ageNum}}
    else{nv=[...voices,{id:v,name:vn,avatar:va,sex:vs,age:ageNum,saved}]}
    onSave({...user,voices:nv})
  }
  async function handlePublicUpload(){
    if(!fbUser||!cedeVoz){fin();return}
    setUploading(true);
    const ageNum=parseInt(vAge)||0;
    try{
      const entries=Object.entries(recBlobs);
      for(const[k,blob]of entries){
        await fbUploadPublicVoice(fbUser.uid,k,blob,{
          phrase:items.find(it=>(mode==='cheers'?it.id:textKey(it.text))===k)?.text||'',
          speakerName:vn,speakerAge:ageNum,speakerSex:vs,
          duration:0,moduleKey:mode==='phrases'?'N'+recLv:mode
        })
      }
    }catch(e){console.warn('[Toki] Public upload error:',e)}
    setUploading(false);fin()
  }
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:BG,overflowY:'auto',zIndex:100,padding:16}}><div style={{maxWidth:600,margin:'0 auto'}}>
    {showRules&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><p style={{fontSize:22,color:GOLD,fontWeight:700,margin:0}}>Consejos de grabaci&oacute;n</p><button className="btn btn-ghost btn-half" style={{width:'auto',padding:'8px 16px'}} onClick={()=>{setShowRules(false);setMode('menu')}}>✕</button></div>
      <div className="card" style={{padding:24,marginBottom:20}}>
        {[['📏','Mant\u00e9n el micro a 20-30cm'],['🔇','Sin ruido de fondo'],['\u23F1','Empieza enseguida, sin pausas'],['🗣️','Articula bien, ritmo natural'],['🎯','Sirves de modelo para otros ni\u00f1os']].map(([em,txt],i)=>
          <div key={i} style={{display:'flex',gap:12,alignItems:'center',marginBottom:i<4?16:0}}><span style={{fontSize:28}}>{em}</span><p style={{fontSize:17,margin:0,color:TXT}}>{txt}</p></div>)}
      </div>
      <button className="btn btn-gold" onClick={confirmRules}>Entendido, empezar</button>
    </div>}
    {showDone&&<div className="af"><div className="card" style={{padding:28,textAlign:'center',marginBottom:20,borderColor:GREEN+'66'}}>
      <p style={{fontSize:24,fontWeight:700,color:GREEN,margin:'0 0 12px'}}>¡Gracias por tu aportaci\u00f3n!</p>
      <p style={{fontSize:18,color:TXT,margin:'0 0 20px'}}>Eso ayudar\u00e1 a {user.name||'tu peque'}</p>
      {fbUser&&<div style={{borderTop:'1px solid '+BORDER,paddingTop:16}}>
        <p style={{fontSize:17,color:GOLD,fontWeight:600,margin:'0 0 10px'}}>¿Quieres hacer tu voz p\u00fablica y ayudar a otros usuarios?</p>
        <p style={{fontSize:12,color:DIM,margin:'0 0 10px',lineHeight:1.5}}>Las grabaciones se usar\u00e1n exclusivamente como modelo de voz en ejercicios de Toki para otros alumnos. Se almacenan de forma an\u00f3nima (solo nombre, edad y sexo del hablante). Puedes retirar tus voces p\u00fablicas en cualquier momento desde Ajustes &gt; Config.</p>
        <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer',padding:12,background:cedeVoz?GREEN+'22':BG3,borderRadius:12,border:'2px solid '+(cedeVoz?GREEN:BORDER)}} onClick={()=>setCedeVoz(!cedeVoz)}>
          <span style={{fontSize:24,flexShrink:0,marginTop:2}}>{cedeVoz?'✅':'⬜'}</span>
          <span style={{fontSize:14,color:cedeVoz?GREEN:DIM,lineHeight:1.4}}>Como padre/madre/tutor legal, autorizo la cesi\u00f3n de estas grabaciones de voz con fines educativos en la plataforma Toki, conforme al RGPD (art. 6.1.a). Entiendo que puedo revocar este consentimiento en cualquier momento.</span>
        </label>
      </div>}
      <div style={{display:'flex',gap:10,marginTop:16}}>
        <button className="btn btn-ghost btn-half" onClick={()=>{setShowDone(false);setRi(0)}}>Seguir grabando</button>
        <button className="btn btn-gold btn-half" disabled={uploading} onClick={fbUser&&cedeVoz?handlePublicUpload:fin}>{uploading?'Subiendo...':'Guardar'}</button>
      </div>
    </div></div>}
    {!showRules&&!showDone&&mode==='menu'&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><p style={{fontSize:22,color:GOLD,fontWeight:700,margin:0}}>🎙️ Voces</p><button className="btn btn-ghost btn-half" style={{width:'auto',padding:'8px 16px'}} onClick={onBack}>✕</button></div>
      {voices.length>0&&<div style={{marginBottom:20}}><p style={{fontSize:16,color:DIM,margin:'0 0 10px'}}>Toca para a\u00f1adir grabaciones:</p>{voices.map((v,i)=><div key={i} style={{display:'flex',gap:6,marginBottom:8,alignItems:'center'}}><button className="card" style={{flex:1,display:'flex',alignItems:'center',gap:12,cursor:'pointer',border:`2px solid ${selV?.id===v.id?GOLD:BORDER}`}} onClick={()=>init(v)}><span style={{fontSize:30}}>{v.avatar}</span><div style={{flex:1,textAlign:'left'}}><div style={{fontWeight:700}}>{v.name}</div><div style={{fontSize:13,color:DIM}}>{v.saved} grabaciones</div></div><span style={{color:GOLD,fontSize:14}}>{selV?.id===v.id?'✓':'→'}</span></button><button style={{background:RED+'22',border:'2px solid '+RED+'44',borderRadius:12,padding:'8px 10px',color:RED,fontSize:16,cursor:'pointer',fontFamily:"'Fredoka'"}} onClick={()=>{try{localStorage.removeItem('toki_voice_'+user.id+'_'+v.id)}catch(e){}const nv=voices.filter(x=>x.id!==v.id);onSave({...user,voices:nv})}}>🗑️</button></div>)}</div>}
      {!selV&&<div><p style={{fontSize:16,color:DIM,margin:'0 0 12px'}}>Nueva voz:</p><input className="inp" value={vn} onChange={e=>setVn(e.target.value)} placeholder="Nombre: Pap\u00e1, Jaime..." style={{marginBottom:12}}/>
        <div style={{display:'flex',gap:10,marginBottom:12}}>
          <input className="inp" type="number" value={vAge} onChange={e=>setVAge(e.target.value)} placeholder="Edad" style={{width:90,textAlign:'center',fontSize:18}}/>
          {[['m','👦 Chico'],['f','👧 Chica']].map(([v,l])=><button key={v} onClick={()=>setVs(v)} style={{flex:1,padding:'12px 0',borderRadius:12,border:`3px solid ${vs===v?GOLD:BORDER}`,background:vs===v?GOLD+'22':BG3,color:vs===v?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer'}}>{l}</button>)}
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',margin:'0 0 16px'}}>{AVS.slice(0,20).map(a=><button key={a} className={'avbtn'+(va===a?' on':'')} onClick={()=>setVa(a)}>{a}</button>)}</div></div>}
      <div style={{display:'flex',flexDirection:'column',gap:10}}><button className="btn btn-gold" disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRi(0);startMode('cheers')}}>🎤 \u00c1nimos</button><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{[1,2,3,4,5].map(n=><button key={n} className="btn btn-b btn-half" style={{flex:1,fontSize:16,minWidth:50}} disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRecLv(n);setRi(0);startMode('phrases')}}>N{n}</button>)}</div><button className="btn btn-p" disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRi(0);startMode('counting')}} style={{fontSize:18}}>🔢 Cuento hasta 100</button>{user.telefono&&<button className="btn btn-o" disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRi(0);startMode('personal')}} style={{fontSize:18}}>👤 Datos personales</button>}
        <button className="btn btn-p" disabled={!vn.trim()&&!selV} onClick={()=>{if(!selV)init(null);setRi(0);startMode('quiensoy')}} style={{fontSize:18,background:'#E91E63',borderColor:'#C2185B',boxShadow:'4px 4px 0 #880E4F'}}>👤 Qui\u00e9n Soy</button>
      </div></div>}
    {!showRules&&!showDone&&(mode==='cheers'||mode==='phrases'||mode==='counting'||mode==='personal'||mode==='quiensoy')&&<div className="af"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>{mode==='cheers'?'🎤 \u00c1nimos':mode==='counting'?'🔢 N\u00fameros':mode==='personal'?'👤 Datos':mode==='quiensoy'?'👤 Qui\u00e9n Soy':`🎤 N${recLv}`} — {vn}</p><span style={{fontSize:14,color:DIM}}>{ri+1}/{items.length}</span></div>
      <div className="pbar" style={{marginBottom:16}}><div className="pfill" style={{width:((ri+1)/items.length*100)+'%'}}/></div>
      <div className="card" style={{padding:24,marginBottom:16,textAlign:'center'}}><p style={{fontSize:13,color:DIM,margin:'0 0 8px'}}>Lee en voz alta:</p><p style={{fontSize:24,fontWeight:700,margin:0,lineHeight:1.3,color:GOLD}}>"{cur}"</p></div>
      {recMsg&&<div className="as" style={{background:RED+'22',borderRadius:12,padding:14,marginBottom:12,textAlign:'center'}}><p style={{fontSize:16,color:GOLD,fontWeight:600,margin:0}}>{recMsg}</p></div>}
      <div style={{display:'flex',justifyContent:'center',gap:10,marginBottom:16}}><button className="btn btn-ghost btn-half" style={{width:'auto',padding:'8px 14px'}} onClick={()=>preview(ri)} disabled={pp>=0}>🔊 Escuchar</button><span style={{color:GREEN,fontWeight:700,alignSelf:'center'}}>{saved}</span></div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>{!rec?<button className="btn btn-g" onClick={startR} style={{fontSize:22}}>🔴 Grabar</button>:<button className="btn btn-o" onClick={stopR} style={{fontSize:22,animation:'pulse 1s infinite'}}>⬛ Parar</button>}
        <div style={{display:'flex',gap:10}}><button className="btn btn-ghost btn-half" disabled={ri===0||rec} onClick={()=>{setRi(ri-1);setRec(false);setRecMsg('')}}>←</button><button className="btn btn-b btn-half" disabled={ri>=items.length-1||rec} onClick={()=>{setRi(ri+1);setRec(false);setRecMsg('')}}>→</button></div>
        <div style={{display:'flex',gap:10,marginTop:10}}><button className="btn btn-ghost btn-half" onClick={()=>{setMode('menu');setRecMsg('')}}>← Men\u00fa</button><button className="btn btn-gold btn-half" onClick={fin}>✅ Guardar</button></div></div></div>}
  </div></div>}
