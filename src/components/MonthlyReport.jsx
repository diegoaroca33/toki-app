import { useState } from 'react'
import { GOLD, GROUPS } from '../constants.js'
import { EX } from '../exercises.js'

export function MonthlyReport({user}){
  const[show,setShow]=useState(false);
  const[copied,setCopied]=useState(false);
  function generateReport(){
    const now=new Date();
    const curMonth=now.getMonth(),curYear=now.getFullYear();
    const prevMonth=curMonth===0?11:curMonth-1,prevYear=curMonth===0?curYear-1:curYear;
    const MESES_N=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const monthName=MESES_N[curMonth]+' '+curYear;
    const hist=user.hist||[];
    // Filter entries for current month (dt format: YYYY-MM-DD or similar)
    const curEntries=hist.filter(h=>{if(!h.dt)return false;const d=new Date(h.dt);return d.getMonth()===curMonth&&d.getFullYear()===curYear});
    const prevEntries=hist.filter(h=>{if(!h.dt)return false;const d=new Date(h.dt);return d.getMonth()===prevMonth&&d.getFullYear()===prevYear});
    // Days played
    const daysPlayed=new Set(curEntries.map(h=>h.dt)).size;
    const daysInMonth=new Date(curYear,curMonth+1,0).getDate();
    // Total time
    const totalMin=curEntries.reduce((s,h)=>s+(h.min||0),0);
    const totalH=Math.floor(totalMin/60),totalM=totalMin%60;
    // Max streak
    const dates=[...new Set(curEntries.map(h=>h.dt))].sort();
    let maxStreak=0,curStreak=1;
    for(let i=1;i<dates.length;i++){const d1=new Date(dates[i-1]),d2=new Date(dates[i]);const diff=(d2-d1)/(86400000);if(diff===1)curStreak++;else{maxStreak=Math.max(maxStreak,curStreak);curStreak=1}}
    maxStreak=Math.max(maxStreak,curStreak);if(!dates.length)maxStreak=0;
    // Per module stats
    const modMap={};
    curEntries.forEach(h=>{const sec=h.section||'general';if(!modMap[sec])modMap[sec]={sessions:0,stars:0,total:0};modMap[sec].sessions++;modMap[sec].stars+=h.ok||0;modMap[sec].total+=(h.ok||0)+(h.sk||0)});
    const MOD_NAMES={decir:'Dilo',frase:'Forma la frase',contar:'Cuenta',math:'Sumas/Restas',multi:'Multiplicaciones',frac:'Fracciones',money:'Monedas',clock:'La Hora',calendar:'Calendario',distribute:'Reparte',writing:'Escribe',razona:'Razona',lee:'Lee',quiensoy:'Aprende',general:'General'};
    let modLines='';
    Object.keys(modMap).forEach(k=>{const m=modMap[k];const avg=m.total>0?(m.stars/m.total*4).toFixed(1):'--';modLines+='  '+(MOD_NAMES[k]||k)+': '+m.sessions+' sesiones, '+avg+' media\n'});
    if(!modLines)modLines='  (Sin datos por módulo)\n';
    // Worst phrases from SRS
    const srs=user.srs||{};
    const phraseStats=Object.entries(srs).map(([k,v])=>({phrase:k,lv:v.lv||0,attempts:(v.ok||0)+(v.fail||0)})).filter(p=>p.attempts>0).sort((a,b)=>a.lv-b.lv);
    let worstLines='';
    phraseStats.slice(0,5).forEach((p,i)=>{
      const exMatch=EX.find(e=>e.id===p.phrase);
      const txt=exMatch?(exMatch.ph||exMatch.fu||exMatch.su||p.phrase):p.phrase;
      worstLines+='  '+(i+1)+'. "'+txt+'" — nivel '+p.lv+' ('+p.attempts+' intentos)\n'});
    if(!worstLines)worstLines='  (Sin datos suficientes)\n';
    // Progress comparison
    const prevOk=prevEntries.reduce((s,h)=>s+(h.ok||0),0);
    const prevTotal=prevEntries.reduce((s,h)=>s+(h.ok||0)+(h.sk||0),0);
    const curOk=curEntries.reduce((s,h)=>s+(h.ok||0),0);
    const curTotal=curEntries.reduce((s,h)=>s+(h.ok||0)+(h.sk||0),0);
    const curPct=curTotal>0?curOk/curTotal:0;
    const prevPct=prevTotal>0?prevOk/prevTotal:0;
    let progress='Sin datos del mes anterior';
    if(prevEntries.length>0){progress=curPct>prevPct+0.05?'Mejor que el mes anterior':curPct<prevPct-0.05?'Peor que el mes anterior':'Similar al mes anterior'}
    const report=
'INFORME MENSUAL — '+(user.name||'Alumno')+'\n'+
'Periodo: '+monthName+'\n\n'+
'Dias jugados: '+daysPlayed+' de '+daysInMonth+'\n'+
'Tiempo total: '+totalH+'h '+totalM+'min\n'+
'Racha maxima: '+maxStreak+' dias consecutivos\n\n'+
'Por modulo:\n'+modLines+'\n'+
'Frases con mas dificultad:\n'+worstLines+'\n'+
'Progreso: '+progress+'\n';
    return report;
  }
  if(!show)return <button onClick={()=>setShow(true)} style={{marginTop:16,width:'100%',padding:'16px 20px',borderRadius:14,border:'2px solid '+GOLD+'55',background:GOLD+'15',color:GOLD,fontSize:20,fontWeight:700,fontFamily:"'Fredoka'",cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>{'📊 Informe mensual'}</button>;
  const report=generateReport();
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:300,background:'#fff',color:'#1a1a2e',overflowY:'auto',padding:24,display:'flex',flexDirection:'column'}}>
    <div style={{maxWidth:700,width:'100%',margin:'0 auto',flex:1}}>
      <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-word',fontFamily:"'Fredoka','Segoe UI',sans-serif",fontSize:16,lineHeight:1.6,margin:0,color:'#1a1a2e'}}>{report}</pre>
    </div>
    <div style={{display:'flex',gap:12,justifyContent:'center',padding:'20px 0',position:'sticky',bottom:0,background:'#fff',borderTop:'1px solid #ddd'}}>
      <button onClick={()=>{navigator.clipboard?.writeText(report).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}).catch(()=>{})}} style={{padding:'14px 28px',borderRadius:14,border:'2px solid #4CAF50',background:'#4CAF50',color:'#fff',fontSize:18,fontWeight:700,fontFamily:"'Fredoka'",cursor:'pointer'}}>{copied?'Copiado!':'Copiar al portapapeles'}</button>
      <button onClick={()=>{setShow(false);setCopied(false)}} style={{padding:'14px 28px',borderRadius:14,border:'2px solid #999',background:'#eee',color:'#333',fontSize:18,fontWeight:700,fontFamily:"'Fredoka'",cursor:'pointer'}}>Cerrar</button>
    </div>
  </div>;
}
