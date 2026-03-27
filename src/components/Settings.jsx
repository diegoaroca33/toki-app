import React from 'react'
import { EX } from '../exercises.js'
import { BG, BG2, BG3, GOLD, GREEN, RED, BLUE, PURPLE, TXT, DIM, CARD, BORDER, AVS, SMINS, PERSONA_RELATIONS, LV_OPTS, GROUPS } from '../constants.js'
import { saveData, getModuleLv, getModuleLvOrDef, setModuleLv } from '../utils.js'
import { generateAutoPresentation } from '../cloud.js'
import { fbCreateShareCode } from '../firebase.js'
import { Ring, NumPad, AstronautAvatar } from './UIKit.jsx'
import { MonthlyReport } from './MonthlyReport.jsx'

export function Settings({ user, setUser, saveP, supPin, setSupPin, pp, setPp, sm, setSm, sec, setSec, secLv, setSecLv, freeChoice, setFreeChoice, activeMods, setActiveMods, openSection, setOpenSection, ptab, setPtab, theme, setTheme, rocketColor, setRocketColor, exigencia, setExigencia, maxDaily, setMaxDaily, sessionMode, setSessionMode, guidedTasks, setGuidedTasks, escribeCase, setEscribeCase, escribeTypes, setEscribeTypes, escribeGuide, setEscribeGuide, escribePauta, setEscribePauta, personas, savePersonas, setOv, setOpenGroup, setPhotoCrop, setShowRec, delConf, setDelConf, delPersonaIdx, setDelPersonaIdx, presEdit, setPresEdit, presNewMode, setPresNewMode, presDelIdx, setPresDelIdx, shareCode, setShareCode, shareMsg, setShareMsg, fbUser, hasConfig, pOpenPlanet, setPOpenPlanet, setProfs, setScr, helmetMode, setHelmetMode, showHelmet, dynGroups }) {
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:BG,overflowY:'auto',zIndex:100,padding:16}}><div style={{maxWidth:600,margin:'0 auto'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}><p style={{fontSize:22,color:GOLD,fontWeight:700,margin:0}}>👨‍👩‍👦 Panel</p><button className="btn btn-gold" style={{width:'auto',padding:'12px 20px',fontSize:18,minHeight:52}} onClick={()=>{setFreeChoice(true);setOv(null);setOpenGroup(null)}}>🎮 ¡A jugar!</button></div>
      <div className="tabs" style={{marginBottom:18}}>{['config','familia','stats','srs'].map(t=><button key={t} className={'tab'+(ptab===t?' on':'')} onClick={()=>setPtab(t)} style={{fontSize:16,padding:14}}>{t==='config'?'⚙️':t==='familia'?'👨‍👩‍👦':t==='stats'?'📊':'🧠'}</button>)}</div>
      {ptab==='config'&&<div style={{display:'flex',flexDirection:'column',gap:12}}>
        {(()=>{
          const[chgStep,setChgStep]=React.useState('closed'); // 'closed'|'current'|'new'|'confirm'
          const[chgCur,setChgCur]=React.useState('');
          const[chgNew,setChgNew]=React.useState('');
          const[chgErr,setChgErr]=React.useState('');
          return <div className="card" style={{padding:0,overflow:'hidden'}}><button onClick={()=>{if(chgStep==='closed')setChgStep('current');else{setChgStep('closed');setChgCur('');setChgNew('');setChgErr('')}}} style={{width:'100%',padding:'16px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Fredoka'",color:TXT}}><span style={{fontSize:20,fontWeight:700}}>🔒 Cambiar PIN</span><span style={{fontSize:16,color:DIM}}>{chgStep!=='closed'?'▼':'▸'}</span></button>
          {chgStep!=='closed'&&<div style={{padding:'0 20px 20px'}}>
            {chgErr&&<p style={{fontSize:14,color:RED,fontWeight:600,margin:'0 0 8px',textAlign:'center'}}>{chgErr}</p>}
            {chgStep==='current'&&<><p style={{fontSize:15,color:DIM,margin:'0 0 8px',fontWeight:600}}>Introduce el PIN actual</p>
              <div style={{display:'flex',justifyContent:'center'}}><NumPad value={chgCur} onChange={v=>{setChgCur(v);setChgErr('')}} onSubmit={()=>{if(chgCur.length===4){if(chgCur===supPin){setChgStep('new');setChgCur('')}else{setChgErr('PIN incorrecto');setChgCur('')}}}} maxLen={4}/></div></>}
            {chgStep==='new'&&<><p style={{fontSize:15,color:DIM,margin:'0 0 8px',fontWeight:600}}>Nuevo PIN (4 dígitos)</p>
              <div style={{display:'flex',justifyContent:'center'}}><NumPad value={pp} onChange={v=>{setPp(v);setChgErr('')}} onSubmit={()=>{if(pp.length===4){setChgNew(pp);setPp('');setChgStep('confirm')}}} maxLen={4}/></div></>}
            {chgStep==='confirm'&&<><p style={{fontSize:15,color:GOLD,margin:'0 0 8px',fontWeight:600}}>Confirma el nuevo PIN</p>
              <div style={{display:'flex',justifyContent:'center'}}><NumPad value={pp} onChange={v=>{setPp(v);setChgErr('')}} onSubmit={()=>{if(pp.length===4){if(pp===chgNew){setSupPin(pp);saveData('sup_pin',pp);setPp('');setChgStep('closed');setChgNew('');setChgErr('')}else{setChgErr('Los PIN no coinciden');setPp('');setChgStep('new');setChgNew('')}}}} maxLen={4}/></div></>}
          </div>}
        </div>})()}
        <div className="card" style={{padding:0,overflow:'hidden'}}><button onClick={()=>setOpenSection(openSection==='session'?null:'session')} style={{width:'100%',padding:'16px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Fredoka'",color:TXT}}><span style={{fontSize:20,fontWeight:700}}>⏱️ Sesión: <span style={{color:GREEN}}>{sm===0?'∞':sm+' min'}</span></span><span style={{fontSize:16,color:DIM}}>{openSection==='session'?'▼':'▸'}</span></button>{openSection==='session'&&<div style={{padding:'0 20px 20px'}}><div style={{display:'flex',gap:8}}>{SMINS.map(m=><button key={m} onClick={()=>setSm(m)} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${sm===m?GOLD:BORDER}`,background:sm===m?GOLD+'22':BG3,color:sm===m?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer',minHeight:52}}>{m===0?'∞':m+"'"}</button>)}</div></div>}</div>
        <div className="card" style={{padding:0,overflow:'hidden'}}><button onClick={()=>setOpenSection(openSection==='theme'?null:'theme')} style={{width:'100%',padding:'16px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Fredoka'",color:TXT}}><span style={{fontSize:20,fontWeight:700}}>🎨 Tema visual: <span style={{color:GOLD}}>{theme==='sober'?'Sobrio':'Espacial'}</span></span><span style={{fontSize:16,color:DIM}}>{openSection==='theme'?'▼':'▸'}</span></button>{openSection==='theme'&&<div style={{padding:'0 20px 20px'}}><div style={{display:'flex',gap:8}}>{[['espacial','🚀 Espacial'],['sober','📘 Sobrio']].map(([v,l])=><button key={v} onClick={()=>setTheme(v)} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${theme===v?GOLD:BORDER}`,background:theme===v?GOLD+'22':BG3,color:theme===v?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer',minHeight:52}}>{l}</button>)}</div><p style={{fontSize:13,color:DIM,margin:'8px 0 0'}}>{theme==='sober'?'Sin animaciones, colores sobrios, sin mascota':'Tema espacial con estrellas y animaciones'}</p>
          {theme!=='sober'&&<div style={{display:'flex',alignItems:'center',gap:12,marginTop:12,padding:'10px 0',borderTop:'1px solid '+BORDER}}>
            <AstronautAvatar emoji="🧑‍🚀" size={40} helmet={helmetMode}/>
            <button onClick={()=>setHelmetMode(!helmetMode)} style={{flex:1,padding:'10px 14px',borderRadius:10,border:`3px solid ${helmetMode?GOLD:BORDER}`,background:helmetMode?GOLD+'22':BG3,color:helmetMode?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer'}}>🪖 Casco: {helmetMode?'ON':'OFF'}</button>
          </div>}
        </div>}</div>
        <div className="card" style={{padding:0,overflow:'hidden'}}><button onClick={()=>setOpenSection(openSection==='rocket'?null:'rocket')} style={{width:'100%',padding:'16px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Fredoka'",color:TXT}}><span style={{fontSize:20,fontWeight:700}}>🚀 Color del cohete: <span style={{color:GOLD}}>{({rojo:'Rojo',azul:'Azul',verde:'Verde',dorado:'Dorado',morado:'Morado'})[rocketColor]}</span></span><span style={{fontSize:16,color:DIM}}>{openSection==='rocket'?'▼':'▸'}</span></button>{openSection==='rocket'&&<div style={{padding:'0 20px 20px'}}><div style={{display:'flex',gap:12,justifyContent:'center'}}>{[['rojo','🔴','Rojo'],['azul','🔵','Azul'],['verde','🟢','Verde'],['dorado','🟡','Dorado'],['morado','🟣','Morado']].map(([k,em,l])=><button key={k} onClick={()=>setRocketColor(k)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:8,borderRadius:12,border:`3px solid ${rocketColor===k?GOLD:BORDER}`,background:rocketColor===k?GOLD+'22':BG3,cursor:'pointer',fontFamily:"'Fredoka'",minWidth:52}}><span style={{fontSize:28}}>{em}</span><span style={{fontSize:12,color:rocketColor===k?GOLD:DIM,fontWeight:600}}>{l}</span></button>)}</div></div>}</div>
        <div className="card" style={{padding:0,overflow:'hidden'}}><button onClick={()=>setOpenSection(openSection==='daily'?null:'daily')} style={{width:'100%',padding:'16px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Fredoka'",color:TXT}}><span style={{fontSize:20,fontWeight:700}}>⏰ Límites y tolerancia</span><span style={{fontSize:16,color:DIM}}>{openSection==='daily'?'▼':'▸'}</span></button>{openSection==='daily'&&<div style={{padding:'0 20px 20px',display:'flex',flexDirection:'column',gap:16}}>
          <div><p style={{fontSize:18,fontWeight:700,margin:'0 0 8px'}}>Tiempo máximo diario</p><div style={{display:'flex',gap:8}}>{[30,60,120,0].map(m=><button key={m} onClick={()=>{setMaxDaily(m);saveData('max_daily',m)}} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${maxDaily===m?GOLD:BORDER}`,background:maxDaily===m?GOLD+'22':BG3,color:maxDaily===m?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:16,cursor:'pointer',minHeight:52}}>{m===0?'Sin límite':m+"'"}</button>)}</div></div>
          <div><p style={{fontSize:18,fontWeight:700,margin:'0 0 4px'}}>🎤 Tolerancia: <span style={{color:GOLD}}>{exigencia}%</span></p><p style={{fontSize:14,color:DIM,margin:'0 0 12px'}}>Aproximaciones en dicción</p><input type="range" min={50} max={100} step={5} value={exigencia} onChange={e=>setExigencia(parseInt(e.target.value))} style={{width:'100%',accentColor:GOLD,height:8,cursor:'pointer'}}/><div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:DIM,marginTop:4}}><span>Flexible</span><span>Normal</span><span>Estricto</span></div></div>
        </div>}</div>
        <div className="card" style={{padding:0,overflow:'hidden'}}><button onClick={()=>setOpenSection(openSection==='planets'?null:'planets')} style={{width:'100%',padding:'16px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Fredoka'",color:TXT}}><span style={{fontSize:20,fontWeight:700}}>🪐 Planetas activos</span><span style={{fontSize:16,color:DIM}}>{openSection==='planets'?'▼':'▸'}</span></button>{openSection==='planets'&&<div style={{padding:'0 20px 20px'}}>{(()=>{
          const PLANET_COLORS_P={aprende:['#F8BBD0','#E91E63','#AD1457'],dilo:['#A5D6A7','#4CAF50','#2E7D32'],cuenta:['#FFCC80','#FF9800','#E65100'],razona:['#90CAF9','#42A5F5','#1565C0'],escribe:['#CE93D8','#AB47BC','#6A1B9A'],lee:['#EF9A9A','#EF5350','#B71C1C']};
          const totalActive=dynGroups.reduce((n,g)=>n+g.modules.filter(m=>activeMods[m.lvKey]!==false).length,0);
          const parentOpenPlanet=pOpenPlanet;const setParentOpenPlanet=setPOpenPlanet;
          return <>
            <p style={{fontSize:14,color:DIM,margin:'0 0 4px'}}>Toca un planeta para ver sus módulos. Toca cada módulo para activarlo/desactivarlo.</p>
            <p style={{fontSize:15,fontWeight:600,margin:'0 0 12px',color:GREEN}}>
              {totalActive} activos
            </p>
            {/* Planets as circles */}
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,marginBottom:12}}>
              {dynGroups.map(g=>{
                const pc=PLANET_COLORS_P[g.id]||[g.color+'88',g.color,g.color];
                const anyOn=g.modules.some(m=>activeMods[m.lvKey]!==false);
                const isOpenP=parentOpenPlanet===g.id;
                return <button key={g.id} onClick={()=>setParentOpenPlanet(isOpenP?null:g.id)} style={{
                  width:70,height:90,padding:0,border:'none',background:'none',cursor:'pointer',fontFamily:"'Fredoka'",color:TXT,
                  display:'flex',flexDirection:'column',alignItems:'center',gap:3,
                  opacity:anyOn?1:0.4,filter:anyOn?'none':'grayscale(0.8)',transition:'all .3s',
                  transform:isOpenP?'scale(1.1)':'scale(1)',
                }}>
                  <div style={{
                    width:60,height:60,borderRadius:'50%',
                    background:`radial-gradient(circle at 30% 25%,${pc[0]},${pc[1]} 60%,${pc[2]})`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    boxShadow:isOpenP?`0 0 16px ${pc[1]}88`:`0 2px 8px rgba(0,0,0,.3)`,
                    border:isOpenP?`3px solid ${pc[0]}`:'3px solid transparent',
                  }}>
                    <span style={{fontSize:26}}>{g.emoji}</span>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,lineHeight:1.1,textAlign:'center'}}>{g.name}</div>
                </button>})}
            </div>
            {/* Satellites for open planet */}
            {parentOpenPlanet&&dynGroups.filter(g=>g.id===parentOpenPlanet).map(g=>{
              const pc=PLANET_COLORS_P[g.id]||[g.color+'88',g.color,g.color];
              return <div key={g.id} className="af" style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,padding:'12px 0',borderTop:`2px solid ${g.color}33`}}>
                {g.modules.map((m,mi)=>{
                  const isOn=activeMods[m.lvKey]!==false;
                  return <button key={mi} onClick={()=>{
                    if(!isOn){
                      const activeCount=g.modules.filter(mm=>mm.lvKey!==m.lvKey&&activeMods[mm.lvKey]!==false).length;
                      if(activeCount>=5)return;
                    }
                    const na={...activeMods,[m.lvKey]:!isOn};setActiveMods(na);saveData('active_mods',na)
                  }} style={{
                    width:90,display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                    padding:6,border:'none',background:'none',cursor:'pointer',fontFamily:"'Fredoka'",
                    opacity:1,transition:'all .25s',
                  }}>
                    <div style={{
                      width:56,height:56,borderRadius:'50%',
                      background:isOn
                        ?`radial-gradient(circle at 30% 25%,${pc[0]},${pc[1]} 70%,${pc[2]})`
                        :`radial-gradient(circle at 30% 25%,#666,#444 70%,#333)`,
                      border:isOn?`3px solid ${GREEN}`:`3px solid #555`,
                      boxShadow:isOn?`0 0 12px ${GREEN}44`:'none',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      transition:'all .25s',
                    }}>
                      <span style={{fontSize:isOn?22:18,filter:isOn?'':'brightness(0.5)',transition:'all .25s'}}>
                        {isOn?'✅':'⬤'}
                      </span>
                    </div>
                    <div style={{fontSize:11,fontWeight:600,color:isOn?TXT:DIM,textAlign:'center',lineHeight:1.15}}>{m.l}</div>
                  </button>})}
                {(()=>{const activeInPlanet=g.modules.filter(m=>activeMods[m.lvKey]!==false).length;const total=g.modules.length;const atMax=total>5&&activeInPlanet>=5;return <p style={{fontSize:12,color:atMax?RED:DIM,margin:'8px 0 0',fontWeight:600,width:'100%',textAlign:'center'}}>{total>5?`${activeInPlanet}/5 módulos activos`:`${activeInPlanet}/${total} módulos activos`} {atMax?'(máximo)':''}</p>})()}
              </div>})}
          </>})()}</div>}</div>
        <div className="card" style={{padding:0,overflow:'hidden'}}><button onClick={()=>setOpenSection(openSection==='levels'?null:'levels')} style={{width:'100%',padding:'16px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Fredoka'",color:TXT}}><span style={{fontSize:20,fontWeight:700}}>📋 Nivel por módulo</span><span style={{fontSize:16,color:DIM}}>{openSection==='levels'?'▼':'▸'}</span></button>{openSection==='levels'&&<div style={{padding:'0 20px 20px'}}><p style={{fontSize:16,color:DIM,margin:'0 0 10px'}}>Selecciona uno o varios niveles por módulo</p>
          {(()=>{
            // Group LEE modules into a single row
            const LEE_KEYS=['lee_intruso','lee_word_img','lee_complete','lee_syllables','lee_read_do'];
            const LEE_ALL_OPTS=[{n:1,l:'Intruso'},{n:2,l:'Pal+Img'},{n:3,l:'Completa'},{n:4,l:'Sílabas'},{n:5,l:'Lee+haz'}];
            return dynGroups.map(g=>{
              const isLee=g.id==='lee';
              const MAX_SEL=g.id==='razona'?6:4;
              return <div key={g.id} style={{marginBottom:10,border:`1px solid ${g.color+'33'}`,borderRadius:10,padding:12,background:g.color+'06'}}>
                <p style={{fontSize:18,fontWeight:600,margin:'0 0 6px',color:g.color}}>{g.emoji} {g.name}</p>
                {isLee?<div style={{marginBottom:8}}>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap',alignItems:'center'}}>
                    {LEE_ALL_OPTS.map(lv=>{
                      const lvKey=LEE_KEYS[lv.n-1];const curLvs=getModuleLv(lvKey)||[lv.n];const isSel=curLvs.includes(lv.n);
                      return <button key={lv.n} onClick={()=>{
                        if(isSel){setModuleLv(lvKey,[]);setActiveMods(a=>({...a}))}
                        else{setModuleLv(lvKey,[lv.n]);setActiveMods(a=>({...a}))}
                      }} style={{padding:'6px 10px',borderRadius:8,border:`2px solid ${isSel?g.color:BORDER}`,background:isSel?g.color+'22':BG3+'44',color:isSel?g.color:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:13,cursor:'pointer',minHeight:36,position:'relative'}}>
                        {isSel?'✓ ':''}{lv.l}
                      </button>
                    })}
                    <button onClick={()=>{const allOn=LEE_KEYS.every((k,i)=>{const c=getModuleLv(k);return c&&c.includes(i+1)});if(allOn){LEE_KEYS.forEach(k=>setModuleLv(k,[]))}else{LEE_KEYS.forEach((k,i)=>setModuleLv(k,[i+1]))}setActiveMods(a=>({...a}))}} style={{padding:'6px 10px',borderRadius:8,border:`2px solid ${GOLD}`,background:GOLD+'22',color:GOLD,fontFamily:"'Fredoka'",fontWeight:700,fontSize:13,cursor:'pointer',minHeight:36}}>Todo</button>
                  </div>
                </div>
                :g.id==='escribe'?(()=>{
                  const PAUTA_LABELS=['Principiante','Medio','Avanzado','Experto'];
                  const PAUTA_SIZES=[32,26,20,16];
                  const toggleCase=c=>{setEscribeCase(c);saveData('escribe_case',c)};
                  const toggleType=t=>{
                    let nt;
                    if(escribeTypes.includes(t)){nt=escribeTypes.filter(x=>x!==t);if(nt.length===0)nt=[t]}
                    else{if(escribeTypes.length>=2){nt=[...escribeTypes.slice(1),t]}else{nt=[...escribeTypes,t]}}
                    setEscribeTypes(nt);saveData('escribe_types',nt)};
                  const toggleGuide=(t)=>{const ng={...escribeGuide,[t]:!escribeGuide[t]};setEscribeGuide(ng);saveData('escribe_guide',ng)};
                  const setPautaSize=v=>{setEscribePauta(v);saveData('escribe_pauta_size',v)};
                  return <div>
                    {/* Case toggle */}
                    <div style={{display:'flex',gap:6,marginBottom:10}}>
                      {[['upper','MAYÚSCULAS'],['lower','minúsculas']].map(([v,l])=><button key={v} onClick={()=>toggleCase(v)} style={{flex:1,padding:'8px 0',borderRadius:8,border:`2px solid ${escribeCase===v?PURPLE:BORDER}`,background:escribeCase===v?PURPLE+'22':BG3+'44',color:escribeCase===v?PURPLE:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:14,cursor:'pointer',minHeight:36}}>{escribeCase===v?'✓ ':''}{l}</button>)}
                    </div>
                    {/* Type checkboxes with guide toggles */}
                    {[['letras','Letras'],['palabras','Palabras'],['frases','Frases']].map(([k,l])=>{
                      const isOn=escribeTypes.includes(k);
                      return <div key={k} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <button onClick={()=>toggleType(k)} style={{flex:1,padding:'6px 10px',borderRadius:8,border:`2px solid ${isOn?PURPLE:BORDER}`,background:isOn?PURPLE+'22':BG3+'44',color:isOn?PURPLE:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:13,cursor:'pointer',minHeight:36,textAlign:'left'}}>{isOn?'✓ ':''}{l}</button>
                        {isOn&&<button onClick={()=>toggleGuide(k)} style={{padding:'6px 10px',borderRadius:8,border:`2px solid ${escribeGuide[k]?GREEN:BORDER}`,background:escribeGuide[k]?GREEN+'18':BG3+'44',color:escribeGuide[k]?GREEN:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:12,cursor:'pointer',minHeight:36,whiteSpace:'nowrap'}}>Guía: {escribeGuide[k]?'ON':'OFF'}</button>}
                      </div>})}
                    <p style={{fontSize:12,color:DIM,margin:'2px 0 8px'}}>Máx. 2 tipos</p>
                    {/* Pauta size slider */}
                    <div style={{marginTop:4}}>
                      <p style={{fontSize:14,fontWeight:600,margin:'0 0 4px',color:TXT}}>Tamaño pauta: <span style={{color:PURPLE}}>{PAUTA_LABELS[escribePauta]}</span></p>
                      <input type="range" min={0} max={3} step={1} value={escribePauta} onChange={e=>setPautaSize(parseInt(e.target.value))} style={{width:'100%',accentColor:PURPLE,height:6,cursor:'pointer'}}/>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:DIM,marginTop:2}}>{PAUTA_LABELS.map(l=><span key={l}>{l}</span>)}</div>
                      {/* Preview with pauta lines */}
                      <div style={{marginTop:8,padding:'12px 10px',borderRadius:8,background:'#fff',border:`1px solid ${BORDER}`,textAlign:'center',position:'relative',overflow:'hidden'}}>
                        {(()=>{const fs=PAUTA_SIZES[escribePauta];const h=Math.round(fs*1.6);const baseY=Math.round(h*0.78);const upperY=Math.round(h*0.15);const midY=Math.round((upperY+baseY)/2);
                          return <div style={{position:'relative',height:h}}>
                            <div style={{position:'absolute',left:0,right:0,top:baseY,height:2,background:'#2E75B6'}}/>
                            <div style={{position:'absolute',left:0,right:0,top:upperY,height:1,background:'#2E75B6',opacity:0.5}}/>
                            <div style={{position:'absolute',left:0,right:0,top:midY,height:1,background:'#2E75B6',opacity:0.25,borderTop:'1px dashed #2E75B644'}}/>
                            <div style={{position:'absolute',left:0,right:0,top:upperY,height:baseY-upperY,background:'rgba(46,117,182,0.04)'}}/>
                            <span style={{position:'absolute',left:'50%',transform:'translateX(-50%)',bottom:h-baseY,fontSize:fs,fontFamily:"'Fredoka'",color:'#D0D0D0',fontWeight:600,lineHeight:1}}>{escribeCase==='upper'?'HOLA':'hola'}</span>
                          </div>})()}
                      </div>
                    </div>
                  </div>})()
                :g.modules.map((m,mi)=>{const opts=LV_OPTS[m.lvKey]||(m.lvKey.startsWith('pres_')?LV_OPTS.quiensoy:[]);const curLvs=getModuleLvOrDef(m.lvKey,m.defLv);
                  return <div key={mi} style={{marginBottom:8}}>
                  <p style={{fontSize:16,color:DIM,margin:'0 0 4px',fontWeight:600}}>{m.l}</p>
                  {opts.length>1?<div style={{display:'flex',gap:4,flexWrap:'wrap',alignItems:'center'}}>{opts.map(lv=>{
                    const isSel=curLvs.includes(lv.n);
                    return <button key={lv.n} onClick={()=>{
                      let newLvs;
                      if(isSel){newLvs=curLvs.filter(l=>l!==lv.n);if(newLvs.length===0)return}
                      else{if(curLvs.length>=MAX_SEL)return;newLvs=[...curLvs,lv.n]}
                      setModuleLv(m.lvKey,newLvs);setActiveMods(a=>({...a}))
                    }} style={{padding:'6px 10px',borderRadius:8,border:`2px solid ${isSel?g.color:BORDER}`,background:isSel?g.color+'22':BG3+'44',color:isSel?g.color:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:13,cursor:'pointer',minHeight:36}}>{isSel?'✓ ':''}{lv.l}</button>
                  })}
                  <button onClick={()=>{const allOn=opts.every(o=>curLvs.includes(o.n));setModuleLv(m.lvKey,allOn?[opts[0].n]:opts.map(o=>o.n));setActiveMods(a=>({...a}))}} style={{padding:'6px 10px',borderRadius:8,border:`2px solid ${GOLD}`,background:GOLD+'22',color:GOLD,fontFamily:"'Fredoka'",fontWeight:700,fontSize:13,cursor:'pointer',minHeight:36}}>Todo</button>
                  </div>:(()=>{const singleLv=opts[0]||{n:Array.isArray(m.defLv)?m.defLv[0]:m.defLv,l:m.l};const isOn=curLvs.includes(singleLv.n);return <button onClick={()=>{setModuleLv(m.lvKey,isOn?[]:[singleLv.n]);const na={...activeMods,[m.lvKey]:!isOn};setActiveMods(na);saveData('active_mods',na)}} style={{padding:'6px 14px',borderRadius:8,border:`2px solid ${isOn?GREEN:BORDER}`,background:isOn?GREEN+'22':BG3+'44',color:isOn?GREEN:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:13,cursor:'pointer',minHeight:36}}>{isOn?'✓ Activo':'Desactivado'}</button>})()}
                </div>})}
              </div>})})()}</div>}</div>
        <div className="card" style={{padding:0,overflow:'hidden'}}><button onClick={()=>setOpenSection(openSection==='today'?null:'today')} style={{width:'100%',padding:'16px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Fredoka'",color:TXT}}><span style={{fontSize:20,fontWeight:700}}>📝 Sesión de hoy</span><span style={{fontSize:16,color:DIM}}>{openSection==='today'?'▼':'▸'}</span></button>{openSection==='today'&&<div style={{padding:'0 20px 20px'}}>
          <div style={{display:'flex',gap:8,marginBottom:12}}>{['free','guided'].map(m=><button key={m} onClick={()=>{setSessionMode(m);saveData('session_mode',m)}} style={{flex:1,padding:'14px 0',borderRadius:10,border:`3px solid ${sessionMode===m?GOLD:BORDER}`,background:sessionMode===m?GOLD+'22':BG3,color:sessionMode===m?GOLD:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer',minHeight:52}}>{m==='free'?'🆓 Libre':'📋 Guiada'}</button>)}</div>
          {sessionMode==='guided'&&<div>
            <p style={{fontSize:16,color:DIM,margin:'0 0 6px'}}>Elige hasta 4 tareas:</p>
            <p style={{fontSize:14,color:GOLD,fontWeight:700,margin:'0 0 10px'}}>Máximo 4 tareas</p>
            {[0,1,2,3].map(i=>{const t=guidedTasks[i];const filledCount=guidedTasks.filter(Boolean).length;const isDisabled=!t&&filledCount>=4;return <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'center'}}>
              <span style={{fontSize:18,color:DIM,fontWeight:700,width:24}}>{i+1}.</span>
              <select disabled={isDisabled} style={{flex:1,padding:12,borderRadius:10,border:`2px solid ${BORDER}`,background:isDisabled?BG3+'44':BG3,color:isDisabled?DIM:TXT,fontFamily:"'Fredoka'",fontSize:18,minHeight:48,opacity:isDisabled?.5:1}} value={t?t.k+'_'+t.lv:''} onChange={e=>{const v=e.target.value;if(!v){const nt=[...guidedTasks];nt.splice(i,1);setGuidedTasks(nt);saveData('guided_tasks',nt);return}
                const[k,lv]=v.split('_');const nt=[...guidedTasks];nt[i]={k,lv:parseInt(lv),count:10};setGuidedTasks(nt);saveData('guided_tasks',nt)}}>
                <option value="">— vacío —</option>
                {dynGroups.flatMap(g=>g.modules.map(m=>{const mLv=(getModuleLvOrDef(m.lvKey,m.defLv))[0];return <option key={m.k+'_'+mLv} value={m.k+'_'+mLv}>{g.emoji} {m.l}</option>}))}
              </select>
            </div>})}
            {guidedTasks.filter(Boolean).length>=4&&<p style={{fontSize:14,color:RED,fontWeight:700,margin:'4px 0 0'}}>Has alcanzado el máximo de 4 tareas</p>}
          </div>}
        </div>}</div>
        <div className="card" style={{padding:0,overflow:'hidden'}}><button onClick={()=>setOpenSection(openSection==='module'?null:'module')} style={{width:'100%',padding:'16px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Fredoka'",color:TXT}}><span style={{fontSize:20,fontWeight:700}}>🎯 Módulo de hoy</span><span style={{fontSize:16,color:DIM}}>{openSection==='module'?'▼':'▸'}</span></button>{openSection==='module'&&<div style={{padding:'0 20px 20px'}}>
          <button onClick={()=>{setFreeChoice(!freeChoice)}} style={{width:'100%',padding:'14px 20px',borderRadius:10,border:`3px solid ${freeChoice?GREEN:BORDER}`,background:freeChoice?GREEN+'22':BG3,color:freeChoice?GREEN:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer',marginBottom:12,minHeight:52}}>{freeChoice?'✅ Elección libre (el niño elige)':'❌ Elección libre'}</button>
          {!freeChoice&&<div style={{display:'flex',flexDirection:'column',gap:12}}>
            {dynGroups.map(g=><div key={g.id} style={{border:`2px solid ${g.color+'44'}`,borderRadius:12,padding:12,background:g.color+'08'}}>
              <p style={{fontSize:18,fontWeight:600,margin:'0 0 8px',color:g.color}}>{g.emoji} {g.name}</p>
              {g.modules.map((m,mi)=>{const mLv=getModuleLvOrDef(m.lvKey,m.defLv);return <button key={mi} onClick={()=>{setSec(m.k);setSecLv(mLv)}} style={{display:'block',width:'100%',marginBottom:8,padding:'14px 16px',borderRadius:10,border:`2px solid ${sec===m.k&&String(secLv)===String(mLv)?g.color:BORDER}`,background:sec===m.k&&String(secLv)===String(mLv)?g.color+'33':BG3,color:sec===m.k&&String(secLv)===String(mLv)?g.color:DIM,fontFamily:"'Fredoka'",fontWeight:600,fontSize:18,cursor:'pointer',textAlign:'left',minHeight:52}}>{m.l}</button>})}
            </div>)}
          </div>}
        </div>}</div>
        <button className="btn btn-gold" onClick={()=>{if(pp.length===4){setSupPin(pp);saveData('sup_pin',pp)}const up={...user,sessionMin:sm,freeChoice,sec,secLv};setUser(up);saveP(up)}} style={{fontSize:20,padding:'16px 20px',minHeight:52}}>💾 Guardar</button>
        {fbUser&&hasConfig&&<div style={{marginTop:12,display:'flex',gap:8}}>
          <button className="btn btn-b" onClick={async()=>{try{const code=await fbCreateShareCode(fbUser.uid,user.id,user.name);setShareCode(code);setShareMsg('Código generado')}catch(e){setShareMsg('Error: '+e.message)}}} style={{flex:1,fontSize:16,padding:'12px 16px',minHeight:48}}>🔗 Compartir perfil</button>
          {shareCode&&<div style={{flex:2,background:GOLD+'22',border:'2px solid '+GOLD,borderRadius:12,padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <span style={{fontSize:22,fontWeight:800,color:GOLD,letterSpacing:4,fontFamily:'monospace'}}>{shareCode}</span>
            <button onClick={()=>{navigator.clipboard?.writeText(shareCode);setShareMsg('¡Copiado!')}} style={{background:'none',border:'none',fontSize:18,cursor:'pointer'}}>📋</button>
          </div>}
        </div>}
        {shareMsg&&<p style={{fontSize:14,color:GREEN,margin:'6px 0 0',fontWeight:600}}>{shareMsg}</p>}
        <button className="btn btn-p" onClick={()=>setShowRec(true)} style={{marginTop:8,fontSize:18,padding:'14px 20px',minHeight:52}}>🎙️ Grabar voces</button>
        <div style={{marginTop:20,borderTop:'1px solid '+BORDER,paddingTop:20}}>{!delConf?<button className="btn btn-ghost" style={{color:RED,borderColor:RED+'44',fontSize:18,padding:'14px 20px',minHeight:52}} onClick={()=>setDelConf(true)}>🗑️ Borrar perfil de {user.name}</button>:<div className="card" style={{borderColor:RED+'66',background:RED+'0C',padding:20}}><p style={{fontSize:18,fontWeight:600,color:RED,margin:'0 0 10px'}}>¿Seguro? Se perderá todo el progreso</p><div style={{display:'flex',gap:10}}><button className="btn btn-ghost" style={{flex:1,fontSize:18,minHeight:52}} onClick={()=>setDelConf(false)}>Cancelar</button><button className="btn btn-g" style={{flex:1,background:RED,borderColor:'#c0392b',boxShadow:'4px 4px 0 #922b21',fontSize:18,minHeight:52}} onClick={()=>{setProfs(p=>p.filter(x=>x.id!==user.id));setUser(null);setOv(null);setDelConf(false);setScr('login')}}>Sí, borrar</button></div></div>}
        <button className="btn btn-ghost" style={{color:RED,borderColor:RED+'22',marginTop:12,fontSize:16,padding:'14px 20px',minHeight:52}} onClick={()=>{if(confirm('¿Borrar todos los perfiles y progreso? Las voces grabadas se conservan.')){const keep={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('toki_voice_'))keep[k]=localStorage.getItem(k)}localStorage.clear();Object.entries(keep).forEach(([k,v])=>localStorage.setItem(k,v));setProfs([]);setUser(null);setOv(null);setScr('setup')}}}>🔄 Resetear app (conserva voces)</button></div>
      </div>}
      {ptab==='familia'&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>👤 Apellidos</p><input className="inp" value={user.apellidos||''} onChange={e=>{const up={...user,apellidos:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: García López" style={{fontSize:18,padding:14}}/></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>{(user.age||0)>=16?'🏢 Centro formación / Trabajo':'🏫 Colegio'}</p><input className="inp" value={user.colegio||''} onChange={e=>{const up={...user,colegio:e.target.value};setUser(up);saveP(up)}} placeholder={(user.age||0)>=16?'Ej: Centro ocupacional / Empresa':'Ej: CEIP San José'} style={{fontSize:18,padding:14}}/></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>📱 Teléfono de emergencia</p><input className="inp" value={user.telefono||''} onChange={e=>{const up={...user,telefono:e.target.value};setUser(up);saveP(up)}} type="tel" placeholder="Ej: 6.1.2.3.4.5.6.7.8" style={{fontSize:18,padding:14}}/><p style={{fontSize:14,color:DIM,margin:'8px 0 0'}}>Con puntos para pronunciar: 6.1.2.3.4.5</p></div>
        <div className="card" style={{padding:20}}><p style={{fontSize:18,fontWeight:600,margin:'0 0 10px',color:GOLD}}>🏠 Dirección de casa</p><input className="inp" value={user.direccion||''} onChange={e=>{const up={...user,direccion:e.target.value};setUser(up);saveP(up)}} placeholder="Ej: Calle Mayor 10, Madrid" style={{fontSize:18,padding:14}}/></div>
        <p style={{fontSize:16,color:DIM,margin:0}}>Estos datos se usan en frases personalizadas. Padre, madre, hermanos y amigos se gestionan en Mis Personas.</p>
        <div className="card" style={{marginTop:16,borderColor:PURPLE+'44',padding:20}}>
          <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:PURPLE}}>👥 Mis Personas</p>
          <p style={{fontSize:16,color:DIM,margin:'0 0 12px'}}>Se usan como nombres en ejercicios de Reparte y Cuenta</p>
          {personas.map((p,i)=><div key={i} style={{display:'flex',gap:10,alignItems:'center',marginBottom:12,position:'relative'}}>
            <div style={{position:'relative',width:52,height:52,flexShrink:0}}>
              <AstronautAvatar photo={p.photo} emoji={p.avatar||AVS[0]} size={52} helmet={showHelmet} onClick={()=>{const avIdx=AVS.indexOf(p.avatar||AVS[0]);const next=AVS[(avIdx+1)%AVS.length];const np=[...personas];np[i]={...np[i],avatar:next,photo:null};savePersonas(np)}}/>
              <label aria-label="Cambiar foto" style={{position:'absolute',bottom:-4,right:-4,width:44,height:44,borderRadius:'50%',background:BLUE,border:'2px solid '+BG,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:16,boxShadow:'0 2px 6px rgba(0,0,0,.3)'}}>📷
                <input type="file" accept="image/jpeg,image/png" style={{display:'none'}} onChange={async(e)=>{
                  const f=e.target.files?.[0];if(!f)return;
                  try{const reader=new FileReader();reader.onload=()=>{
                    setPhotoCrop({src:reader.result,onSave:(b64)=>{const np=[...personas];np[i]={...np[i],photo:b64};savePersonas(np);setPhotoCrop(null)},onCancel:()=>setPhotoCrop(null)})};reader.readAsDataURL(f)}
                  catch(err){alert('Error: '+err)}
                  e.target.value=''}}/>
              </label>
            </div>
            <input className="inp" value={p.name||''} onChange={e=>{const np=[...personas];np[i]={...np[i],name:e.target.value};savePersonas(np)}} placeholder="Nombre" style={{fontSize:18,padding:12,flex:1}}/>
            <select value={p.relation||''} onChange={e=>{const np=[...personas];np[i]={...np[i],relation:e.target.value};savePersonas(np)}} style={{padding:12,borderRadius:10,border:'2px solid '+BORDER,background:BG3,color:TXT,fontFamily:"'Fredoka'",fontSize:16,maxWidth:130,minHeight:48}}>
              <option value="">Relación</option>{PERSONA_RELATIONS.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
            {delPersonaIdx===i?<div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'center'}}><p style={{fontSize:13,color:RED,margin:0,fontWeight:600,whiteSpace:'nowrap'}}>¿Borrar a {p.name||'esta persona'}?</p><div style={{display:'flex',gap:4}}><button onClick={()=>{const np=personas.filter((_,j)=>j!==i);savePersonas(np);setDelPersonaIdx(null)}} style={{background:RED,border:'1px solid '+RED,borderRadius:8,padding:'6px 12px',color:'#fff',fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'",minHeight:36}}>Sí</button><button onClick={()=>setDelPersonaIdx(null)} style={{background:BG3,border:'1px solid '+BORDER,borderRadius:8,padding:'6px 12px',color:DIM,fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'",minHeight:36}}>No</button></div></div>
            :<button onClick={()=>setDelPersonaIdx(i)} aria-label="Borrar persona" style={{background:RED+'22',border:'1px solid '+RED+'44',borderRadius:10,padding:'4px 8px',color:RED,fontSize:16,cursor:'pointer',fontFamily:"'Fredoka'",minHeight:44,width:44,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>}
          </div>)}
          {personas.length<10&&<button className="btn btn-ghost" onClick={()=>savePersonas([...personas,{name:'',relation:'',avatar:AVS[Math.floor(Math.random()*AVS.length)]}])} style={{fontSize:18,marginTop:8,padding:'14px 20px',minHeight:52}}>➕ Añadir persona</button>}
        </div>
        {/* ===== PRESENTACIONES SECTION ===== */}
        <div className="card" style={{marginTop:16,borderColor:'#E91E63'+'44',padding:20}}>
          <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:'#E91E63'}}>🎤 Presentaciones</p>
          <p style={{fontSize:14,color:DIM,margin:'0 0 12px'}}>Para el planeta APRENDE</p>
          {(user.presentations||[]).map((pr,pi)=><div key={pi} style={{background:BG3,border:'2px solid '+BORDER,borderRadius:12,padding:14,marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <div><p style={{fontSize:17,fontWeight:700,color:TXT,margin:0}}>{pr.name||'Sin nombre'}</p>
                <p style={{fontSize:12,color:DIM,margin:'2px 0 0'}}>{pr.date||''} · {(pr.lines||[]).length} frases{pr.auto?' · Auto':''}</p></div>
              <div style={{display:'flex',gap:6}}>
                <button onClick={()=>setPresEdit({idx:pi,name:pr.name||'',lines:[...(pr.lines||[])],slides:[...(pr.slides||pr.lines||[]).map((s,si)=>typeof s==='string'?{text:s,img:null,picto:null}:{...s})],auto:pr.auto||false,specific:pr.specific||false})} style={{background:BLUE+'22',border:'1px solid '+BLUE+'44',borderRadius:8,padding:'6px 10px',color:BLUE,fontSize:13,cursor:'pointer',fontFamily:"'Fredoka'"}}>✏️</button>
                {presDelIdx===pi?<div style={{display:'flex',gap:4}}><button onClick={()=>{const np=[...(user.presentations||[])];np.splice(pi,1);const up={...user,presentations:np};setUser(up);saveP(up);setPresDelIdx(null)}} style={{background:RED,border:'1px solid '+RED,borderRadius:8,padding:'6px 10px',color:'#fff',fontSize:13,cursor:'pointer',fontFamily:"'Fredoka'"}}>Sí</button><button onClick={()=>setPresDelIdx(null)} style={{background:BG3,border:'1px solid '+BORDER,borderRadius:8,padding:'6px 10px',color:DIM,fontSize:13,cursor:'pointer',fontFamily:"'Fredoka'"}}>No</button></div>
                :<button onClick={()=>setPresDelIdx(pi)} style={{background:RED+'22',border:'1px solid '+RED+'44',borderRadius:8,padding:'6px 10px',color:RED,fontSize:13,cursor:'pointer',fontFamily:"'Fredoka'"}}>🗑️</button>}
              </div>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:4}}>{(pr.lines||[]).slice(0,3).map((l,li)=><span key={li} style={{fontSize:13,color:DIM,background:BG+'66',borderRadius:6,padding:'2px 8px'}}>"{l}"</span>)}{(pr.lines||[]).length>3&&<span style={{fontSize:13,color:DIM}}>...+{(pr.lines||[]).length-3}</span>}</div>
          </div>)}
          {/* New presentation buttons */}
          {!presNewMode&&!presEdit&&(user.presentations||[]).length<5&&<div style={{display:'flex',gap:10,marginTop:8}}>
            <button className="btn btn-ghost" onClick={()=>setPresNewMode('choose')} style={{fontSize:16,padding:'12px 16px',flex:1}}>➕ Nueva presentación</button>
          </div>}
          {presNewMode==='choose'&&<div className="af" style={{background:CARD,borderRadius:12,padding:16,marginTop:8}}>
            <p style={{fontSize:16,fontWeight:600,color:GOLD,margin:'0 0 12px'}}>¿Qué tipo?</p>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-b" onClick={()=>{const lines=generateAutoPresentation(user,personas);const np=[...(user.presentations||[]),{name:'Auto: '+user.name,date:new Date().toISOString().slice(0,10),lines,auto:true}];const up={...user,presentations:np};setUser(up);saveP(up);setPresNewMode(null)}} style={{flex:1,fontSize:16,padding:'14px 10px'}}>🤖 Automática</button>
              <button className="btn btn-p" onClick={()=>{setPresEdit({idx:-1,name:'',lines:[''],slides:[{text:'',img:null,picto:null}],auto:false,specific:false});setPresNewMode(null)}} style={{flex:1,fontSize:16,padding:'14px 10px'}}>✏️ Personalizada</button>
            </div>
            <button className="btn btn-ghost" onClick={()=>setPresNewMode(null)} style={{marginTop:8,fontSize:14}}>Cancelar</button>
          </div>}
          {/* Edit/Create presentation overlay */}
          {presEdit&&<div className="af" style={{background:CARD,border:'2px solid '+GOLD+'44',borderRadius:14,padding:20,marginTop:10}}>
            <p style={{fontSize:18,fontWeight:700,color:GOLD,margin:'0 0 12px'}}>{presEdit.idx===-1?'Nueva presentación':'Editar presentación'}</p>
            <label style={{fontSize:14,color:DIM}}>Nombre</label>
            <input className="inp" value={presEdit.name} onChange={e=>setPresEdit(pe=>({...pe,name:e.target.value}))} placeholder="Ej: Mi presentación del cole" style={{fontSize:16,padding:12,marginBottom:12,marginTop:4}}/>
            <label style={{fontSize:14,color:DIM}}>Frases y fotos</label>
            {(presEdit.slides||presEdit.lines.map(t=>({text:t,img:null,picto:null}))).map((sl,li)=><div key={li} style={{display:'flex',gap:6,marginBottom:8,marginTop:li===0?4:0,alignItems:'center'}}>
              {/* Photo thumbnail + upload */}
              <label style={{width:52,height:52,borderRadius:8,border:`2px dashed ${sl.img?'transparent':BORDER}`,background:sl.img?'none':BG3,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',flexShrink:0,position:'relative'}}>
                {sl.img?<img src={sl.img} alt="" style={{width:52,height:52,objectFit:'cover',borderRadius:6}}/>
                :<span style={{fontSize:20,color:DIM}}>📷</span>}
                <input type="file" accept="image/jpeg,image/png" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(!f)return;
                  const reader=new FileReader();reader.onload=()=>{
                    setPhotoCrop({src:reader.result,onSave:(b64)=>{
                      const ns=[...(presEdit.slides||[])];ns[li]={...ns[li],img:b64};
                      const nl=[...presEdit.lines];nl[li]=ns[li].text;
                      setPresEdit(pe=>({...pe,slides:ns,lines:nl}));setPhotoCrop(null)},
                      onCancel:()=>setPhotoCrop(null)})};reader.readAsDataURL(f)}}/>
              </label>
              <input className="inp" value={sl.text} onChange={e=>{
                const ns=[...(presEdit.slides||[])];ns[li]={...ns[li],text:e.target.value};
                const nl=ns.map(s=>s.text);
                setPresEdit(pe=>({...pe,slides:ns,lines:nl}))
              }} placeholder={'Frase '+(li+1)} style={{fontSize:15,padding:10,flex:1}}/>
              {presEdit.slides.length>1&&<button onClick={()=>{
                const ns=presEdit.slides.filter((_,j)=>j!==li);const nl=ns.map(s=>s.text);
                setPresEdit(pe=>({...pe,slides:ns,lines:nl}))
              }} style={{background:RED+'22',border:'1px solid '+RED+'44',borderRadius:8,padding:'4px 8px',color:RED,fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'"}}>✕</button>}
            </div>)}
            {presEdit.slides.length<30&&<button onClick={()=>setPresEdit(pe=>({...pe,slides:[...pe.slides,{text:'',img:null,picto:null}],lines:[...pe.lines,'']}))} style={{background:'none',border:'1px dashed '+DIM,borderRadius:8,padding:'8px 14px',color:DIM,fontSize:14,cursor:'pointer',fontFamily:"'Fredoka'",width:'100%',marginBottom:12}}>➕ Añadir frase</button>}
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-ghost" onClick={()=>setPresEdit(null)} style={{flex:1,fontSize:16}}>Cancelar</button>
              <button className="btn btn-g" disabled={!presEdit.name.trim()||presEdit.lines.filter(l=>l.trim()).length===0} onClick={()=>{const cleanedSlides=(presEdit.slides||[]).filter(s=>s.text.trim());const cleaned=cleanedSlides.map(s=>s.text);const entry={name:presEdit.name.trim(),date:new Date().toISOString().slice(0,10),lines:cleaned,slides:cleanedSlides,auto:presEdit.auto||false,specific:presEdit.specific||false};const np=[...(user.presentations||[])];if(presEdit.idx===-1)np.push(entry);else np[presEdit.idx]=entry;const up={...user,presentations:np};setUser(up);saveP(up);setPresEdit(null)}} style={{flex:2,fontSize:16}}>💾 Guardar</button>
            </div>
          </div>}
        </div>
      </div>}
      {ptab==='stats'&&(()=>{const h=user.hist||[],tc=h.reduce((s,x)=>s+x.ok,0),ta=h.reduce((s,x)=>s+x.ok+x.sk,0),pct=ta>0?Math.round(tc/ta*100):0,tm=h.reduce((s,x)=>s+(x.min||0),0);return <div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{[{l:'Sesiones',v:h.length,c:GREEN},{l:'Aciertos',v:tc,c:BLUE},{l:'%',v:pct+'%',c:GOLD},{l:'Minutos',v:tm,c:PURPLE}].map((s,i)=><div key={i} className="sbox"><div style={{fontSize:28,color:s.c,fontWeight:700}}>{s.v}</div><div style={{fontSize:13,color:DIM,marginTop:4}}>{s.l}</div></div>)}</div><MonthlyReport user={user}/></div>})()}
      {ptab==='srs'&&(()=>{const mas=Object.values(user.srs||{}).filter(s=>s.lv>=4).length,lrn=Object.values(user.srs||{}).filter(s=>s.lv>0&&s.lv<4).length,nw=EX.length-mas-lrn;return <div style={{textAlign:'center',padding:'20px 0'}}><div style={{display:'flex',justifyContent:'center',gap:20}}>{[{l:'Dominadas',v:mas,c:GREEN},{l:'Aprendiendo',v:lrn,c:GOLD},{l:'Nuevas',v:nw,c:PURPLE}].map((s,i)=><div key={i}><div style={{position:'relative',display:'inline-block'}}><Ring p={s.v/EX.length} sz={80} c={s.c}/><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:20,color:s.c,fontWeight:700}}>{s.v}</div></div><div style={{fontSize:13,color:DIM,marginTop:6}}>{s.l}</div></div>)}</div></div>})()}
    </div></div>
}
