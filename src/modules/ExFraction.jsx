import { useState, useEffect } from 'react'
import { GOLD, BLUE, GREEN, RED, PURPLE, BG3, BORDER, DIM, TXT } from '../constants.js'
import { say, sayFB, stopVoice, starBeep } from '../voice.js'
import { beep } from '../utils.js'
import { NumPad, useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

export function PieChart({num,den,size=120,color=GOLD,highlight=-1}){const slices=[];for(let i=0;i<den;i++){const a1=(i/den)*360-90,a2=((i+1)/den)*360-90;const r=size/2-4;const cx=size/2,cy=size/2;const x1=cx+r*Math.cos(a1*Math.PI/180),y1=cy+r*Math.sin(a1*Math.PI/180);const x2=cx+r*Math.cos(a2*Math.PI/180),y2=cy+r*Math.sin(a2*Math.PI/180);const large=360/den>180?1:0;const filled=i<num;const hl=i===highlight;slices.push(<path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={filled?color:BG3} stroke={hl?'#fff':BORDER} strokeWidth={hl?3:1.5} opacity={filled?1:0.4} style={{transition:'all .3s'}}/>)}
  return <svg width={size} height={size}>{slices}<circle cx={size/2} cy={size/2} r={size/2-4} fill="none" stroke={BORDER} strokeWidth={2}/></svg>}

export function RectChart({num,den,width=160,height=100,color=GOLD,highlight=-1}){const gap=2;const pw=(width-gap*(den-1))/den;
  return <svg width={width} height={height}>{Array.from({length:den},(_,i)=>{const filled=i<num;const hl=i===highlight;return <rect key={i} x={i*(pw+gap)} y={4} width={pw} height={height-8} rx={4} fill={filled?color:BG3} stroke={hl?'#fff':BORDER} strokeWidth={hl?3:1.5} opacity={filled?1:0.4} style={{transition:'all .3s'}}/>})}</svg>}

export function genFractions(rawLv){const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;const fracs=[];
  if(!lv||lv===1){const pool=[[1,2],[1,3],[2,3],[1,4],[2,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,6],[2,6],[3,6],[4,6],[5,6]];
    pool.forEach(([n,d],i)=>{fracs.push({num:n,den:d,id:'frac_'+n+'_'+d,shape:Math.random()<.5?'circle':'rect',mode:'recognize'})});return[...fracs].sort(()=>Math.random()-.5)}
  if(lv===2){[[1,2],[1,3],[2,3],[1,4],[2,4],[3,4]].forEach(([n,d],i)=>{fracs.push({num:n,den:d,id:'frac2_'+n+'_'+d,shape:Math.random()<.5?'circle':'rect',mode:'notation'})});return[...fracs].sort(()=>Math.random()-.5)}
  if(lv===3){[[1,2,2,4],[1,3,2,6],[2,4,1,2],[2,6,1,3]].forEach(([n1,d1,n2,d2],i)=>{fracs.push({num:n1,den:d1,num2:n2,den2:d2,id:'frac3_'+i,shape:Math.random()<.5?'circle':'rect',mode:'equivalence'})});return[...fracs].sort(()=>Math.random()-.5)}
  if(lv===4){[[1,2,1,2],[1,3,1,3],[1,4,1,4],[1,3,2,3],[2,4,1,4]].forEach(([n1,d1,n2,d2],i)=>{fracs.push({num:n1,den:d1,num2:n2,den2:d2,ans_n:n1+n2,ans_d:d1,id:'frac4_'+i,shape:Math.random()<.5?'circle':'rect',mode:'add'})});return[...fracs].sort(()=>Math.random()-.5)}
  [[2,3,1,3],[1,2,1,2],[3,4,1,4],[2,3,2,3]].forEach(([n1,d1,n2,d2],i)=>{fracs.push({num:n1,den:d1,num2:n2,den2:d2,ans_n:n1-n2,ans_d:d1,id:'frac5_'+i,shape:Math.random()<.5?'circle':'rect',mode:'subtract'})});
  return[...fracs].sort(()=>Math.random()-.5)}

function fracSpoken(num,den){
  const nums=['','un','dos','tres','cuatro','cinco','seis'];
  const dens={2:['medio','medios'],3:['tercio','tercios'],4:['cuarto','cuartos'],5:['quinto','quintos'],6:['sexto','sextos']};
  const d=dens[den];if(!d)return num+'/'+den;
  return (nums[num]||num)+' '+(num===1?d[0]:d[1]);
}

export function ExFraction({ex,onOk,onSkip,name}){
  const[placed,setPlaced]=useState(0);const[fb,setFb]=useState(null);const[ans,setAns]=useState('');const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  const colors=[GOLD,BLUE,GREEN,PURPLE,'#E67E22',RED];const color=colors[ex.den%colors.length];
  const mode=ex.mode||'recognize';
  useEffect(()=>{setPlaced(0);setFb(null);setAns('');resetOral();
    if(mode==='recognize')say(ex.num+' de '+ex.den);
    else if(mode==='notation')say(ex.num+' de '+ex.den+' se escribe así');
    else if(mode==='equivalence')say('¿Son iguales?');
    else if(mode==='add')say('Suma las fracciones');
    else say('Resta las fracciones')},[ex]);
  function addSlice(){poke();if(placed>=ex.den)return;const np=placed+1;setPlaced(np);beep(400+np*80,80)}
  function removeSlice(){poke();if(placed>0)setPlaced(placed-1)}
  function validate(){poke();if(placed===ex.num){setFb('ok');starBeep(4);sayFB('¡'+ex.num+' de '+ex.den+'!');setTimeout(()=>triggerOral(fracSpoken(ex.num,ex.den),4,1),800)}
    else{setFb('no');beep(200,200);sayFB('¡Casi! Necesitas '+ex.num+' porciones');setTimeout(()=>{setPlaced(0);setFb(null)},2000)}}
  function checkMathAns(){poke();const n=parseInt(ans);const target=mode==='add'?ex.ans_n:ex.ans_n;
    if(n===target){setFb('ok');starBeep(4);sayFB('¡Perfecto!');setTimeout(()=>triggerOral(fracSpoken(target,ex.ans_d||ex.den),4,1),400)}
    else{setFb('no');beep(200,200);sayFB('La respuesta es '+target);setTimeout(()=>{setFb(null);setAns('')},2500)}}
  const isRect=ex.shape==='rect';
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {mode==='recognize'&&<div>
      <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}>
        <p style={{fontSize:28,fontWeight:700,margin:0}}>Pon <span style={{color:GOLD,fontSize:36}}>{ex.num}</span> de <span style={{color:BLUE,fontSize:36}}>{ex.den}</span></p>
        <p style={{fontSize:48,fontWeight:700,color:GOLD,margin:'4px 0 0',fontFamily:'monospace'}}><sup style={{fontSize:32}}>{ex.num}</sup>⁄<sub style={{fontSize:32}}>{ex.den}</sub></p>
        <p style={{fontSize:13,color:DIM,margin:'4px 0 0'}}>{isRect?'🍰 Tarta':'🍕 Pizza'}</p>
      </div>
      <div style={{display:'flex',justifyContent:'center',gap:24,marginBottom:16,alignItems:'center'}}>
        {isRect?<RectChart num={ex.num} den={ex.den} width={100} height={70} color={color+'88'}/>:<PieChart num={ex.num} den={ex.den} size={100} color={color+'88'}/>}
        <div style={{fontSize:28,color:DIM}}>→</div>
        {isRect?<RectChart num={placed} den={ex.den} width={160} height={100} color={color} highlight={placed<ex.den?placed:-1}/>:<PieChart num={placed} den={ex.den} size={140} color={color} highlight={placed<ex.den?placed:-1}/>}
      </div>
      {!fb&&<div>
        <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:14}}>
          <button className="btn btn-g" onClick={addSlice} style={{fontSize:22,maxWidth:160,padding:'16px 20px'}}>➕ Añadir</button>
          <button className="btn btn-o" onClick={removeSlice} disabled={placed===0} style={{fontSize:22,maxWidth:160,padding:'16px 20px'}}>➖ Quitar</button>
        </div>
        <p style={{fontSize:16,color:DIM,margin:'0 0 10px'}}>Llevas {placed} de {ex.den}</p>
        <button className="btn btn-g" onClick={validate} style={{fontSize:26,width:120,height:120,borderRadius:'50%',margin:'10px auto 12px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 18px '+GREEN+'55',padding:0,lineHeight:1.1,flexDirection:'column'}}><span style={{fontSize:32}}>✅</span><span style={{fontSize:18}}>¡Listo!</span></button>
      </div>}
    </div>}
    {mode==='notation'&&<div>
      <div className="card" style={{padding:24,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}>
        <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>Esta fracción se escribe:</p>
        <div style={{display:'flex',justifyContent:'center',gap:24,alignItems:'center',marginBottom:12}}>
          {isRect?<RectChart num={ex.num} den={ex.den} width={140} height={90} color={color}/>:<PieChart num={ex.num} den={ex.den} size={120} color={color}/>}
          <div style={{fontSize:64,fontWeight:700,color:GOLD,fontFamily:'monospace'}}><sup style={{fontSize:42}}>{ex.num}</sup>⁄<sub style={{fontSize:42}}>{ex.den}</sub></div>
        </div>
        <p style={{fontSize:22,color:TXT,margin:0}}>{ex.num} {ex.num===1?'trozo':'trozos'} de {ex.den} = <span style={{color:GOLD,fontWeight:700}}>{ex.num}/{ex.den}</span></p>
      </div>
      <button className="btn btn-g" onClick={()=>{setFb('ok');starBeep(3);setTimeout(()=>triggerOral(fracSpoken(ex.num,ex.den),4,1),400)}} style={{fontSize:22,maxWidth:220,margin:'0 auto'}}>✅ ¡Entendido!</button>
    </div>}
    {mode==='equivalence'&&<div>
      <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}>
        <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>¡Son iguales!</p>
        <div style={{display:'flex',justifyContent:'center',gap:16,alignItems:'center'}}>
          <div style={{textAlign:'center'}}>
            {isRect?<RectChart num={ex.num} den={ex.den} width={120} height={80} color={BLUE}/>:<PieChart num={ex.num} den={ex.den} size={100} color={BLUE}/>}
            <p style={{fontSize:24,fontWeight:700,color:BLUE,margin:'4px 0 0'}}>{ex.num}/{ex.den}</p>
          </div>
          <div style={{fontSize:32,color:GREEN,fontWeight:700}}>=</div>
          <div style={{textAlign:'center'}}>
            {isRect?<RectChart num={ex.num2} den={ex.den2} width={120} height={80} color={GREEN}/>:<PieChart num={ex.num2} den={ex.den2} size={100} color={GREEN}/>}
            <p style={{fontSize:24,fontWeight:700,color:GREEN,margin:'4px 0 0'}}>{ex.num2}/{ex.den2}</p>
          </div>
        </div>
        <p style={{fontSize:18,color:TXT,margin:'12px 0 0'}}>La mitad es lo mismo, ¡mira!</p>
      </div>
      <button className="btn btn-g" onClick={()=>{setFb('ok');starBeep(3);setTimeout(()=>triggerOral(fracSpoken(ex.num,ex.den)+' es igual a '+fracSpoken(ex.num2,ex.den2),4,1),400)}} style={{fontSize:22,maxWidth:220,margin:'0 auto'}}>✅ ¡Entendido!</button>
    </div>}
    {(mode==='add'||mode==='subtract')&&<div>
      <div className="card" style={{padding:20,marginBottom:14,background:PURPLE+'0C',borderColor:PURPLE+'33'}}>
        <p style={{fontSize:20,fontWeight:700,margin:'0 0 12px',color:GOLD}}>{mode==='add'?'Suma':'Resta'} las fracciones</p>
        <div style={{display:'flex',justifyContent:'center',gap:12,alignItems:'center',marginBottom:12}}>
          <div style={{textAlign:'center'}}>
            {isRect?<RectChart num={ex.num} den={ex.den} width={100} height={70} color={BLUE}/>:<PieChart num={ex.num} den={ex.den} size={90} color={BLUE}/>}
            <p style={{fontSize:20,fontWeight:700,color:BLUE,margin:'4px 0 0'}}>{ex.num}/{ex.den}</p>
          </div>
          <div style={{fontSize:28,color:mode==='add'?GREEN:RED,fontWeight:700}}>{mode==='add'?'+':'-'}</div>
          <div style={{textAlign:'center'}}>
            {isRect?<RectChart num={ex.num2} den={ex.den2} width={100} height={70} color={'#E67E22'}/>:<PieChart num={ex.num2} den={ex.den2} size={90} color={'#E67E22'}/>}
            <p style={{fontSize:20,fontWeight:700,color:'#E67E22',margin:'4px 0 0'}}>{ex.num2}/{ex.den2}</p>
          </div>
          <div style={{fontSize:28,color:DIM}}>=</div>
          <div style={{fontSize:28,fontWeight:700,color:GOLD}}>?/{ex.den}</div>
        </div>
      </div>
      <NumPad value={ans} onChange={setAns} onSubmit={checkMathAns} maxLen={2}/>
    </div>}
    {fb==='ok'&&!oralPhrase&&<><div className="ab" style={{background:GREEN+'22',borderRadius:14,padding:18,marginBottom:14}}><Stars n={4} sz={36}/><p style={{fontSize:20,fontWeight:600,color:GREEN,margin:'8px 0 0'}}>¡Perfecto!</p></div></>}
    {oralPhrase&&<OralPrompt phrase={oralPhrase} onDone={oralDone}/>}
    {fb==='no'&&<div className="as" style={{background:RED+'22',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,color:GOLD,fontWeight:600,margin:0}}>¡Casi! 💪</p></div>}
    <button className="btn btn-ghost skip-btn" onClick={()=>{stopVoice();onSkip()}} style={{fontSize:16,marginTop:8}}>⏭️ Saltar</button>
    {idleMsg&&!fb&&<div className="af" style={{background:GOLD+'15',borderRadius:14,padding:14,marginBottom:14}}><p style={{fontSize:18,fontWeight:600,margin:0,color:GOLD}}>{idleMsg}</p></div>}
  </div>}
