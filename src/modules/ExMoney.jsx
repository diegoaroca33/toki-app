import { useState, useEffect } from 'react'
import { GOLD, BLUE, GREEN, RED, BG3, DIM, TXT, BORDER } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { beep, mkPerfect } from '../utils.js'
import { NumPad, useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

// ===== MONEDAS Y BILLETES =====
export const COINS=[{v:0.01,l:'1c',c:'#B87333',c2:'#8B5E3C',sz:36},{v:0.02,l:'2c',c:'#B87333',c2:'#8B5E3C',sz:38},{v:0.05,l:'5c',c:'#B87333',c2:'#8B5E3C',sz:40},{v:0.10,l:'10c',c:'#DAA520',c2:'#B8860B',sz:38},{v:0.20,l:'20c',c:'#DAA520',c2:'#B8860B',sz:40},{v:0.50,l:'50c',c:'#DAA520',c2:'#B8860B',sz:44},{v:1,l:'1€',c:'#C0C0C0',c2:'#DAA520',sz:48,bi:true},{v:2,l:'2€',c:'#DAA520',c2:'#C0C0C0',sz:50,bi:true}];
export const BILLS=[{v:5,l:'5€',c:'#7B7B7B',c2:'#9E9E9E'},{v:10,l:'10€',c:'#C0392B',c2:'#E74C3C'},{v:20,l:'20€',c:'#2471A3',c2:'#3498DB'},{v:50,l:'50€',c:'#D35400',c2:'#E67E22'}];

export function genMoney(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const items=[];
  if(lv===1){COINS.concat(BILLS.slice(0,2)).forEach(c=>{items.push({ty:'money',mode:'recognize',coin:c,id:'mon_'+c.l})});return items.sort(()=>Math.random()-.5).slice(0,15)}
  if(lv===2){for(let i=0;i<15;i++){const n=2+Math.floor(Math.random()*3);const pool=COINS.filter(c=>c.v>=0.10).concat(BILLS.slice(0,2));const sel=Array.from({length:n},()=>pool[Math.floor(Math.random()*pool.length)]);const total=sel.reduce((s,c)=>s+c.v,0);items.push({ty:'money',mode:'sum',coins:sel,total:Math.round(total*100)/100,id:'mon_sum_'+i})}return items}
  if(lv===3){for(let i=0;i<12;i++){const price=Math.round((Math.random()*9+1)*100)/100;const available=COINS.filter(c=>c.v>=0.10).concat(BILLS.slice(0,3));items.push({ty:'money',mode:'pay',price,available,id:'mon_pay_'+i})}return items}
  for(let i=0;i<12;i++){const price=Math.round((Math.random()*15+2)*100)/100;const paid=Math.ceil(price/5)*5;items.push({ty:'money',mode:'change',price,paid,change:Math.round((paid-price)*100)/100,id:'mon_chg_'+i})}return items}

export function ExMoney({ex,onOk,onSkip,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[sel,setSel]=useState([]);const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  useEffect(()=>{setAns('');setFb(null);setSel([]);resetOral();stopVoice();
    if(ex.mode==='recognize')setTimeout(()=>say('¿Cuánto vale esta moneda?'),400);
    else if(ex.mode==='sum')setTimeout(()=>say('¿Cuánto hay en total?'),400);
    else if(ex.mode==='pay')setTimeout(()=>say('Paga '+ex.price.toFixed(2).replace('.',',')+' euros'),400);
    else setTimeout(()=>say('¿Cuánto cambio te dan?'),400);
    return()=>stopVoice()},[ex]);
  function checkAns(){poke();const n=parseFloat(ans.replace(',','.'));const target=ex.mode==='recognize'?ex.coin.v:ex.mode==='sum'?ex.total:ex.mode==='change'?ex.change:ex.price;
    if(Math.abs(n-target)<0.005){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{const phrase=ex.mode==='recognize'?ex.coin.l:'son '+target.toFixed(2).replace('.',',')+' euros';setTimeout(()=>triggerOral(phrase,4,1),300)})}
    else{setFb('no');stopVoice();sayFB('La respuesta es '+target.toFixed(2).replace('.',',')+' euros');setTimeout(()=>{setFb(null);setAns('')},2500)}}
  function addCoin(c){poke();const ns=[...sel,c];setSel(ns);const total=ns.reduce((s,x)=>s+x.v,0);beep(400+total*50,80);if(Math.abs(total-ex.price)<0.005){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{const phrase='son '+ex.price.toFixed(2).replace('.',',')+' euros';setTimeout(()=>triggerOral(phrase,4,1),300)})}}
  const CoinSVG=({c,sz})=>{const copper=c.v<=0.05;const gold=c.v>=0.10&&c.v<=0.50;const bi=c.bi;
    const outerC=bi?'#C0C0C0':copper?'#B87333':gold?'#FFD700':'#C0C0C0';
    const borderC=copper?'#7A4E2D':gold?'#B8860B':bi?'#909090':'#888';
    const outerDark=bi?'#A8A8A8':copper?'#9A6233':gold?'#DAA520':'#A8A8A8';
    const innerLight=bi?'#D8D8D8':copper?'#CD8544':gold?'#FFE44D':'#D0D0D0';
    const txtC=copper?'#4A2800':gold?'#5C3D00':bi?'#3A2800':'#333';
    const gid='cg'+String(c.v).replace('.','_')+'_'+sz;
    return <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
      <defs>
        <radialGradient id={gid+'bg'} cx="45%" cy="38%"><stop offset="0%" stopColor={innerLight}/><stop offset="70%" stopColor={outerC}/><stop offset="100%" stopColor={outerDark}/></radialGradient>
        <radialGradient id={gid+'sh'} cx="38%" cy="30%"><stop offset="0%" stopColor="rgba(255,255,255,.55)"/><stop offset="50%" stopColor="rgba(255,255,255,.08)"/><stop offset="100%" stopColor="rgba(0,0,0,.18)"/></radialGradient>
        {bi&&<radialGradient id={gid+'in'} cx="45%" cy="38%"><stop offset="0%" stopColor="#FFE44D"/><stop offset="70%" stopColor="#FFD700"/><stop offset="100%" stopColor="#DAA520"/></radialGradient>}
      </defs>
      <circle cx={sz/2} cy={sz/2} r={sz/2-1} fill={borderC}/>
      <circle cx={sz/2} cy={sz/2} r={sz/2-3} fill={`url(#${gid}bg)`}/>
      {bi&&<><circle cx={sz/2} cy={sz/2} r={sz/2-12} fill={borderC}/><circle cx={sz/2} cy={sz/2} r={sz/2-14} fill={`url(#${gid}in)`}/></>}
      <circle cx={sz/2} cy={sz/2} r={sz/2-3} fill={`url(#${gid}sh)`}/>
      <text x={sz/2} y={sz/2+1} textAnchor="middle" dominantBaseline="central" fill={txtC} fontSize={sz>=80?24:sz>=60?20:sz>=50?17:14} fontWeight="800" fontFamily="Fredoka" style={{textShadow:'0 1px 0 rgba(255,255,255,.4)'}}>{c.l}</text>
    </svg>};
  const Coin=({c,onClick,size})=>{const sz=size||Math.min(100,Math.max(70,c.sz?Math.round(c.sz*2):70));const[imgOk,setImgOk]=useState(true);const imgSrc='/img/money/coin_'+c.l.replace('€','e').replace('c','')+'.png';
    return <button onClick={onClick} style={{width:sz,height:sz,borderRadius:'50%',border:'none',background:'none',padding:0,cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',filter:'drop-shadow(2px 3px 5px rgba(0,0,0,.45))',transition:'transform .1s',WebkitTapHighlightColor:'transparent'}} onPointerDown={e=>e.currentTarget.style.transform='scale(.93)'} onPointerUp={e=>e.currentTarget.style.transform='scale(1)'} onPointerLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      {imgOk?<img src={imgSrc} alt={c.l} style={{width:sz,height:sz,borderRadius:'50%',objectFit:'cover'}} onError={()=>setImgOk(false)}/>:<CoinSVG c={c} sz={sz}/>}
    </button>};
  const BillSVG=({b,w,h})=>{const bgC=b.v===5?'#A0A0A0':b.v===10?'#E74C3C':b.v===20?'#3498DB':'#E67E22';
    const bgLight=b.v===5?'#BFBFBF':b.v===10?'#F1948A':b.v===20?'#7FB3D8':'#F0B27A';
    const bgDark=b.v===5?'#808080':b.v===10?'#C0392B':b.v===20?'#2471A3':'#D35400';
    const gid='bl'+b.v;
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={gid+'bg'} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={bgLight}/><stop offset="50%" stopColor={bgC}/><stop offset="100%" stopColor={bgDark}/></linearGradient>
        <pattern id={gid+'pt'} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,.12)"/><line x1="0" y1="0" x2="20" y2="20" stroke="rgba(255,255,255,.06)" strokeWidth=".5"/></pattern>
      </defs>
      <rect x="1" y="1" width={w-2} height={h-2} rx="8" ry="8" fill={`url(#${gid}bg)`} stroke={bgDark} strokeWidth="2"/>
      <rect x="1" y="1" width={w-2} height={h-2} rx="8" ry="8" fill={`url(#${gid}pt)`}/>
      <rect x="6" y="6" width={w-12} height={h-12} rx="5" ry="5" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1" strokeDasharray="4 3"/>
      <path d={`M${w/2-18} ${h-20} Q${w/2-10} ${h-38} ${w/2} ${h-38} Q${w/2+10} ${h-38} ${w/2+18} ${h-20}`} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
      <line x1={w/2-20} y1={h-18} x2={w/2-14} y2={h-18} stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
      <line x1={w/2+14} y1={h-18} x2={w/2+20} y2={h-18} stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
      <text x={w/2} y={h/2-2} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="28" fontWeight="800" fontFamily="Fredoka" style={{textShadow:'0 2px 3px rgba(0,0,0,.35)'}}>{b.l}</text>
      <text x={12} y={16} textAnchor="start" dominantBaseline="central" fill="rgba(255,255,255,.5)" fontSize="11" fontWeight="700" fontFamily="Fredoka">{b.l}</text>
      <text x={w-12} y={h-14} textAnchor="end" dominantBaseline="central" fill="rgba(255,255,255,.5)" fontSize="11" fontWeight="700" fontFamily="Fredoka">{b.l}</text>
    </svg>};
  const Bill=({b,onClick})=>{const[imgOk,setImgOk]=useState(true);const imgSrc='/img/money/bill_'+b.v+'.png';const bw=200;const bh=105;
    return <button onClick={onClick} style={{width:bw,height:bh,borderRadius:10,border:'none',padding:0,cursor:'pointer',overflow:'hidden',boxShadow:'3px 3px 8px rgba(0,0,0,.5)',position:'relative',transition:'transform .1s',WebkitTapHighlightColor:'transparent'}} onPointerDown={e=>e.currentTarget.style.transform='scale(.95)'} onPointerUp={e=>e.currentTarget.style.transform='scale(1)'} onPointerLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      {imgOk?<img src={imgSrc} alt={b.l} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:10}} onError={()=>setImgOk(false)}/>:<BillSVG b={b} w={bw} h={bh}/>}
    </button>};
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {ex.mode==='recognize'&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,maxWidth:700,margin:'0 auto'}}>
      <div className="card" style={{padding:24,flex:'1 1 0',display:'flex',flexDirection:'column',alignItems:'center',minHeight:180}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 16px',color:GOLD}}>¿Cuánto vale?</p>
        {ex.coin.v>=5?<Bill b={ex.coin}/>:<Coin c={ex.coin} size={140}/>}</div>
      <div style={{flex:'0 0 auto'}}><NumPad value={ans} onChange={setAns} onSubmit={checkAns} maxLen={5} decimal={true}/></div>
    </div>}
    {ex.mode==='sum'&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,maxWidth:700,margin:'0 auto'}}>
      <div className="card" style={{padding:20,flex:'1 1 0'}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>¿Cuánto hay?</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>{ex.coins.map((c,i)=>c.v>=5?<Bill key={i} b={c}/>:<Coin key={i} c={c}/>)}</div></div>
      <div style={{flex:'0 0 auto'}}><NumPad value={ans} onChange={setAns} onSubmit={checkAns} maxLen={5} decimal={true}/></div>
    </div>}
    {ex.mode==='pay'&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:22,fontWeight:700,margin:'0 0 8px',color:GOLD}}>Paga: {ex.price.toFixed(2).replace('.',',')} €</p>
        <p style={{fontSize:14,color:DIM,margin:0}}>Toca las monedas para pagar</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:12}}>
        {sel.map((c,i)=><Coin key={i} c={c}/>)}{sel.length===0&&<p style={{color:DIM,fontSize:14}}>Arrastra aquí</p>}</div>
      <p style={{fontSize:18,color:sel.reduce((s,c)=>s+c.v,0)>=ex.price?GREEN:BLUE,fontWeight:700}}>{sel.reduce((s,c)=>s+c.v,0).toFixed(2).replace('.',',')} €</p>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:12,padding:10,background:BG3,borderRadius:12}}>
        {COINS.filter(c=>c.v>=0.10).map((c,i)=><Coin key={i} c={c} onClick={()=>addCoin(c)}/>)}
        {BILLS.slice(0,3).map((b,i)=><Bill key={i} b={b} onClick={()=>addCoin(b)}/>)}</div>
      <button className="btn btn-ghost" onClick={()=>{setSel([])}} style={{fontSize:14,marginBottom:8}}>↩️ Borrar</button>
      <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{fontSize:14}}>⏭️ Saltar</button>
    </div>}
    {ex.mode==='change'&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,maxWidth:700,margin:'0 auto'}}>
      <div className="card" style={{padding:24,flex:'1 1 0',minHeight:120}}><p style={{fontSize:20,fontWeight:700,margin:'0 0 10px',color:GOLD}}>Cuesta {ex.price.toFixed(2).replace('.',',')} €</p>
        <p style={{fontSize:18,color:TXT,margin:0}}>Pagas con {ex.paid} €. ¿Cuánto cambio?</p></div>
      <div style={{flex:'0 0 auto'}}><NumPad value={ans} onChange={setAns} onSubmit={checkAns} maxLen={5} decimal={true}/></div>
    </div>}
    {fb==='ok'&&!oralPhrase&&<><div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginTop:14}}><Stars n={4} sz={36}/></div></>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! Prueba otra vez 💪</p></div>}
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginTop:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
  </div>}
