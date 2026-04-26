import { useState, useEffect, useMemo } from 'react'
import { GOLD, BLUE, GREEN, RED, BG3, DIM, TXT, BORDER } from '../constants.js'
import { say, sayFB, stopVoice, starBeep, cheerOrSay } from '../voice.js'
import { beep, mkPerfect } from '../utils.js'
import { NumPad, useIdle, OralPrompt, useOralPhase } from '../components/UIKit.jsx'
import { Stars } from '../components/CelebrationOverlay.jsx'

// ===== MONEDAS Y BILLETES =====
export const COINS=[{v:0.01,l:'1c',c:'#B87333',c2:'#8B5E3C',sz:36},{v:0.02,l:'2c',c:'#B87333',c2:'#8B5E3C',sz:38},{v:0.05,l:'5c',c:'#B87333',c2:'#8B5E3C',sz:40},{v:0.10,l:'10c',c:'#DAA520',c2:'#B8860B',sz:38},{v:0.20,l:'20c',c:'#DAA520',c2:'#B8860B',sz:40},{v:0.50,l:'50c',c:'#DAA520',c2:'#B8860B',sz:44},{v:1,l:'1€',c:'#C0C0C0',c2:'#DAA520',sz:48,bi:true},{v:2,l:'2€',c:'#DAA520',c2:'#C0C0C0',sz:50,bi:true}];
export const BILLS=[{v:5,l:'5€',c:'#7B7B7B',c2:'#9E9E9E'},{v:10,l:'10€',c:'#C0392B',c2:'#E74C3C'},{v:20,l:'20€',c:'#2471A3',c2:'#3498DB'},{v:50,l:'50€',c:'#D35400',c2:'#E67E22'}];

// Devuelve el valor en español hablado/escrito con plural correcto.
// Visual:  0.01 → "1 céntimo", 0.05 → "5 céntimos", 1 → "1 euro", 2 → "2 euros".
// Hablado: 0.01 → "un céntimo", 1 → "un euro" (en español decimos "un",
//          no "uno", delante de masculino: "un céntimo", "un euro").
// El TTS lee mejor el formato hablado; el visual usa el número.
export function moneyLabel(v, spoken=false){
  if(v>=1){
    const n=Math.round(v);
    if(n===1) return spoken?'un euro':'1 euro';
    return n+' euros';
  }
  const c=Math.round(v*100);
  if(c===1) return spoken?'un céntimo':'1 céntimo';
  return c+' céntimos';
}

// Productos cotidianos con precio indudable (Doc §4.10 — corpus mínimo).
// El módulo no es matemática: es reconocer y comprender el dinero.
const PRODUCTS_CENT=[
  {l:'Chicle',e:'🍬',cents:5},
  {l:'Pegatina',e:'⭐',cents:10},
  {l:'Chupachups',e:'🍭',cents:20},
  {l:'Caramelo',e:'🍬',cents:20},
  {l:'Cromo',e:'🃏',cents:50},
  {l:'Pan pequeño',e:'🥖',cents:50},
];
const PRODUCTS_EUR=[
  {l:'Helado',e:'🍦',euros:1},
  {l:'Periódico',e:'📰',euros:1},
  {l:'Bocadillo',e:'🥪',euros:2},
  {l:'Cuaderno',e:'📓',euros:2},
  {l:'Libro pequeño',e:'📖',euros:5},
  {l:'Camiseta',e:'👕',euros:10},
  {l:'Mochila',e:'🎒',euros:20},
  {l:'Bicicleta',e:'🚲',euros:50},
];

export function genMoney(rawLv){
  const lv=parseInt(Array.isArray(rawLv)?rawLv[0]:rawLv)||1;
  const items=[];
  const sh=a=>[...a].sort(()=>Math.random()-.5);
  const pickN=(arr,n)=>sh([...arr]).slice(0,n);

  // BÁSICO (lv=1) — 3 tipos rotando: ¿Cuánto vale?, ¿Cuánto cuesta?, ¿Cuál vale más?
  if(lv===1){
    // recognize: 5 monedas/billetes sueltos
    const items1=COINS.concat(BILLS.slice(0,2)).map(c=>({ty:'money',mode:'recognize',coin:c,id:'mon_b_r_'+c.l}));
    // cost: 5 productos con 3 precios (uno realista, otros absurdos)
    const items2=[];
    for(let i=0;i<5;i++){
      const useCent=Math.random()<0.5;
      const p=pickN(useCent?PRODUCTS_CENT:PRODUCTS_EUR,1)[0];
      // Distractor absurdo: si es céntimos, pongo un valor en €; si es €, pongo cents grandes
      const correctLabel=useCent?p.cents+' céntimos':p.euros+' euro'+(p.euros===1?'':'s');
      const absurd1=useCent?'50 euros':'1 céntimo';
      const absurd2=useCent?'100 euros':'500 céntimos';
      const opts=sh([correctLabel,absurd1,absurd2]);
      items2.push({ty:'money',mode:'cost',product:p,price:correctLabel,opts,id:'mon_b_c_'+i});
    }
    // compare_money: comparar dos del mismo tipo
    const items3=[];
    const coinPairsCent=[[0.10,0.20],[0.20,0.50],[0.05,0.10],[0.10,0.50]];
    const coinPairsEuro=[[1,2],[5,10],[10,20],[20,50]];
    for(let i=0;i<5;i++){
      const useCent=i%2===0;
      const pair=useCent?coinPairsCent[i%coinPairsCent.length]:coinPairsEuro[i%coinPairsEuro.length];
      const a=pair[0],b=pair[1];
      const aLabel=useCent?Math.round(a*100)+' céntimos':a+' euro'+(a===1?'':'s');
      const bLabel=useCent?Math.round(b*100)+' céntimos':b+' euro'+(b===1?'':'s');
      // ans: el que vale más (siempre b, pero mostramos el orden mezclado)
      const order=Math.random()<0.5?[a,b]:[b,a];
      items3.push({ty:'money',mode:'compare_money',values:order,labels:[useCent?Math.round(order[0]*100)+' céntimos':order[0]+' euro'+(order[0]===1?'':'s'),useCent?Math.round(order[1]*100)+' céntimos':order[1]+' euro'+(order[1]===1?'':'s')],ans:b,id:'mon_b_cmp_'+i});
    }
    return sh([...items1.slice(0,5),...items2,...items3]);
  }

  // AVANZADO (lv=2) — Comparar mezcla, pagar exacto con UNA moneda, ¿Te llega?
  if(lv===2){
    const items1=[];
    // compare_money mezcla cent vs euro
    for(let i=0;i<5;i++){
      const a=Math.random()<0.5?0.50:0.20;const b=[1,2][i%2];
      const aLabel=Math.round(a*100)+' céntimos';const bLabel=b+' euro'+(b===1?'':'s');
      const order=Math.random()<0.5?[a,b]:[b,a];
      items1.push({ty:'money',mode:'compare_money',values:order,labels:order.map(v=>v<1?Math.round(v*100)+' céntimos':v+' euro'+(v===1?'':'s')),ans:b,id:'mon_a_cmp_'+i});
    }
    // pay_exact: producto con precio en céntimos, 4 monedas, una sirve
    const items2=[];
    PRODUCTS_CENT.slice(0,5).forEach((p,i)=>{
      const correctCoin=COINS.find(c=>Math.round(c.v*100)===p.cents);
      if(!correctCoin)return;
      const wrongCoins=COINS.filter(c=>c.v!==correctCoin.v).sort(()=>Math.random()-.5).slice(0,3);
      const opts=sh([correctCoin,...wrongCoins]);
      items2.push({ty:'money',mode:'pay_exact',product:p,coin:correctCoin,opts,id:'mon_a_pe_'+i});
    });
    // enough: tienes X céntimos en monedero, ¿te llega para Y?
    const items3=[];
    for(let i=0;i<5;i++){
      const wallet=[20,50,100,200][i%4]; // céntimos en monedero
      const useCent=wallet<100;
      const productPool=useCent?PRODUCTS_CENT:PRODUCTS_EUR;
      const p=productPool[Math.floor(Math.random()*productPool.length)];
      const productCents=p.cents||(p.euros*100);
      const enough=wallet>=productCents;
      items3.push({ty:'money',mode:'enough',wallet,product:p,enough,id:'mon_a_en_'+i});
    }
    return sh([...items1,...items2,...items3]);
  }

  // MASTER (lv=3) — Equivalencia €/cts, ¿devuelven?, ¿cuánto?, pagar combinando billetes
  if(lv===3){
    // equiv: ¿Cuántos céntimos hay en un euro?
    const equivQs=[
      {q:'¿Cuántos céntimos hay en 1 euro?',ans:'100 céntimos',opts:['100 céntimos','10 céntimos','1000 céntimos','50 céntimos']},
      {q:'50 céntimos y 50 céntimos, ¿cuánto es?',ans:'1 euro',opts:['1 euro','50 céntimos','100 euros','2 euros']},
      {q:'¿Cuántos céntimos hay en medio euro?',ans:'50 céntimos',opts:['50 céntimos','100 céntimos','5 céntimos','500 céntimos']},
      {q:'¿Cuánto vale más, 1 euro o 50 céntimos?',ans:'1 euro',opts:['1 euro','50 céntimos','Lo mismo','Ninguno']},
    ];
    const items1=equivQs.map((e,i)=>({ty:'money',mode:'equiv',data:e,id:'mon_m_eq_'+i}));
    // change_round: pago con 1€/2€ y producto céntimos. ¿cuánto me devuelven?
    const items2=[];
    PRODUCTS_CENT.slice(0,4).forEach((p,i)=>{
      const paidEur=p.cents<100?1:2;
      const changeCents=paidEur*100-p.cents;
      const changeLabel=changeCents>=100?Math.floor(changeCents/100)+' euro'+(changeCents===100?'':'s'):changeCents+' céntimos';
      const distractors=[
        (changeCents+10)+' céntimos',
        (changeCents-5)+' céntimos',
        '0 céntimos',
      ].filter(x=>x!==changeLabel);
      items2.push({ty:'money',mode:'change_round',product:p,paid:paidEur,change:changeLabel,opts:sh([changeLabel,...distractors.slice(0,3)]),id:'mon_m_ch_'+i});
    });
    // pay_combine: producto en €, combinar 2 billetes (5+10 = 15, etc.)
    const items3=[];
    const combos=[
      {price:15,bills:[5,10],label:'15 euros'},
      {price:30,bills:[10,20],label:'30 euros'},
      {price:25,bills:[5,20],label:'25 euros'},
      {price:60,bills:[10,50],label:'60 euros'},
    ];
    combos.forEach((c,i)=>{
      // 4 opciones: la combinación correcta y 3 distractores
      const opts=[
        c.bills.join('€ + ')+'€',
        (c.bills[0]+1)+'€ + '+(c.bills[1])+'€',
        (c.bills[0])+'€ + '+(c.bills[1]+5)+'€',
        '50€ + 50€',
      ];
      items3.push({ty:'money',mode:'pay_combine',price:c.price,priceLabel:c.label,bills:c.bills,opts:sh(opts),ans:c.bills.join('€ + ')+'€',id:'mon_m_co_'+i});
    });
    return sh([...items1,...items2,...items3]);
  }

  // lv>=4: legacy (mantenemos los modos antiguos por compatibilidad)
  for(let i=0;i<12;i++){const price=Math.round((Math.random()*15+2)*100)/100;const paid=Math.ceil(price/5)*5;items.push({ty:'money',mode:'change',price,paid,change:Math.round((paid-price)*100)/100,id:'mon_chg_'+i})}
  return items;
}

export function ExMoney({ex,onOk,onSkip,name,uid,vids}){
  const[ans,setAns]=useState('');const[fb,setFb]=useState(null);const[sel,setSel]=useState([]);const{idleMsg,poke}=useIdle(name,!fb);
  const{oralPhrase,triggerOral,oralDone,resetOral}=useOralPhase(onOk);
  useEffect(()=>{setAns('');setFb(null);setSel([]);resetOral();stopVoice();
    // Delay 1500ms (antes 400) para no solapar con TTS/cohete previo cuando
    // la sesión arranca tras una transición de cohete (que dura ~1.2-1.5s).
    if(ex.mode==='recognize')setTimeout(()=>say('¿Cuánto vale?'),1500); // genérico — vale para moneda y billete
    else if(ex.mode==='sum')setTimeout(()=>say('¿Cuánto hay en total?'),1500);
    else if(ex.mode==='pay')setTimeout(()=>say('Paga '+ex.price.toFixed(2).replace('.',',')+' euros'),1500);
    else setTimeout(()=>say('¿Cuánto cambio te dan?'),1500);
    return()=>stopVoice()},[ex]);
  // Opciones para reconocer/sumar — useMemo con [ex] para recalcular en cada
  // ejercicio nuevo. Deduplicamos por label (no solo por valor) para evitar
  // que aparezcan dos botones con el mismo texto cuando dos valores wrong
  // distintos producen el mismo label tras Math.round (ej: target=10,
  // wrong=9.5, ambos muestran "10 euros" porque round(9.5)=10).
  const opts=useMemo(()=>{
    if(ex.mode==='recognize'||ex.mode==='sum'){
      const target=ex.mode==='recognize'?ex.coin.v:ex.total;
      const targetLabel=moneyLabel(target);
      const wrongs=new Set();
      // Distractores plausibles (x2, x10, /2, ±0.5, ±1, x5, valores cercanos)
      [target*2,target*10,target/2,target+0.5,target-0.5,target+1,target+2,target*5,0.01,0.02,0.05,0.10,0.20,0.50,1,2,5,10,20].forEach(w=>{
        if(w>0&&w!==target&&Math.abs(w-target)>0.001)wrongs.add(Math.round(w*100)/100)});
      // Filtrar wrongs cuyo label coincide con la respuesta correcta
      const wrongClean=[...wrongs].filter(w=>moneyLabel(w)!==targetLabel);
      // De-duplicar por label entre los wrongs
      const seenLbl=new Set([targetLabel]);
      const wrongArr=[];
      for(const w of wrongClean.sort(()=>Math.random()-.5)){
        const lbl=moneyLabel(w);
        if(seenLbl.has(lbl)) continue;
        seenLbl.add(lbl);
        wrongArr.push(w);
        if(wrongArr.length>=3) break;
      }
      const all=[target,...wrongArr].sort(()=>Math.random()-.5);
      return all.map(v=>({v,label:moneyLabel(v)}));
    }
    return null;
  },[ex]);
  const[att2,setAtt2]=useState(0);
  function pickOpt(v){poke();
    const target=ex.mode==='recognize'?ex.coin.v:ex.total;
    if(Math.abs(v-target)<0.005){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{
      // Frase a repetir hablada con concordancia "un/una" correcta:
      // recognize → "un céntimo" / "un euro" / "5 céntimos" / "10 euros".
      // sum → "son X céntimos" o "son X euros".
      const phrase=ex.mode==='recognize'?moneyLabel(target,true):'son '+moneyLabel(target,true);
      setTimeout(()=>triggerOral(phrase,4,1),300);
    })}
    else{const na=att2+1;setAtt2(na);setFb('no');beep(200,200);
      if(na>=2){sayFB('Vale '+moneyLabel(target,true));setTimeout(()=>{setFb(null);setTimeout(()=>onOk(1,na),400)},2500)}
      // "Fíjate bien" sin "en la moneda" porque puede ser un billete; queda genérico
      else{sayFB('Fíjate bien');setTimeout(()=>setFb(null),1500)}}}
  function checkAns(){poke();const n=parseFloat(ans.replace(',','.'));const target=ex.mode==='change'?ex.change:ex.price;
    if(Math.abs(n-target)<0.005){setFb('ok');starBeep(4);cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>{const phrase='son '+target.toFixed(2).replace('.',',')+' euros';setTimeout(()=>triggerOral(phrase,4,1),300)})}
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
  // Coin: SVG siempre. Antes intentaba cargar <img src="/img/money/coin_*.png">
  // y caía al SVG con onError, lo que producía un parpadeo visible mientras
  // resolvía el 404 (los PNGs no están en el bundle).
  const Coin=({c,onClick,size})=>{const sz=size||Math.min(100,Math.max(70,c.sz?Math.round(c.sz*2):70));
    return <button onClick={onClick} style={{width:sz,height:sz,borderRadius:'50%',border:'none',background:'none',padding:0,cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',filter:'drop-shadow(2px 3px 5px rgba(0,0,0,.45))',transition:'transform .1s',WebkitTapHighlightColor:'transparent'}} onPointerDown={e=>e.currentTarget.style.transform='scale(.93)'} onPointerUp={e=>e.currentTarget.style.transform='scale(1)'} onPointerLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      <CoinSVG c={c} sz={sz}/>
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
  // Bill: SVG siempre, sin <img> (ver comentario en Coin para razón).
  const Bill=({b,onClick})=>{const bw=200;const bh=105;
    return <button onClick={onClick} style={{width:bw,height:bh,borderRadius:10,border:'none',padding:0,cursor:'pointer',overflow:'hidden',boxShadow:'3px 3px 8px rgba(0,0,0,.5)',position:'relative',transition:'transform .1s',WebkitTapHighlightColor:'transparent'}} onPointerDown={e=>e.currentTarget.style.transform='scale(.95)'} onPointerUp={e=>e.currentTarget.style.transform='scale(1)'} onPointerLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      <BillSVG b={b} w={bw} h={bh}/>
    </button>};
  return <div style={{textAlign:'center',padding:18}} onClick={poke}>
    {ex.mode==='recognize'&&<div style={{maxWidth:500,margin:'0 auto'}}>
      <div className="card" style={{padding:24,display:'flex',flexDirection:'column',alignItems:'center',marginBottom:16}}>
        <p style={{fontSize:24,fontWeight:700,margin:'0 0 16px',color:GOLD}}>¿Cuánto vale?</p>
        {ex.coin.v>=5?<Bill b={ex.coin}/>:<Coin c={ex.coin} size={140}/>}
      </div>
      {/* Multiple choice — NO numpad */}
      {opts&&!fb&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {opts.map(o=><button key={o.v} className="btn btn-b" onClick={()=>pickOpt(o.v)}
          style={{fontSize:22,padding:18,fontWeight:700,minHeight:64}}>{o.label}</button>)}
      </div>}
    </div>}
    {/* COST — ¿Cuánto cuesta el producto? (Básico) */}
    {ex.mode==='cost'&&<div style={{maxWidth:500,margin:'0 auto'}}>
      <div className="card" style={{padding:20,marginBottom:16}}>
        <p style={{fontSize:22,fontWeight:700,margin:'0 0 8px',color:GOLD}}>¿Cuánto cuesta?</p>
        <div style={{fontSize:80,marginBottom:8}}>{ex.product.e}</div>
        <p style={{fontSize:22,fontWeight:600,color:'#fff',margin:0}}>{ex.product.l}</p>
      </div>
      {!fb&&<div style={{display:'grid',gridTemplateColumns:'1fr',gap:10}}>
        {ex.opts.map(o=><button key={o} className="btn btn-b" onClick={()=>{
          poke();
          if(o===ex.price){setFb('ok');starBeep(4);
            cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral('Cuesta '+ex.price,4,1),300));
          } else {
            const na=att2+1;setAtt2(na);setFb('no');beep(200,200);
            if(na>=2){sayFB('Cuesta '+ex.price);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(1,na),400)},2500)}
            else{sayFB('Piensa: ¿es algo barato o caro?');setTimeout(()=>setFb(null),1800)}
          }
        }} style={{fontSize:22,padding:18,fontWeight:700,minHeight:64}}>{o}</button>)}
      </div>}
    </div>}
    {/* COMPARE_MONEY — ¿Cuál vale más? (Básico/Avanzado) */}
    {ex.mode==='compare_money'&&<div style={{maxWidth:600,margin:'0 auto'}}>
      <div className="card" style={{padding:18,marginBottom:14}}>
        <p style={{fontSize:22,fontWeight:700,margin:0,color:GOLD}}>¿Cuál vale más?</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {ex.values.map((v,i)=>{
          const isBill=v>=5;const coin=COINS.find(c=>c.v===v)||{v,l:isBill?v+'€':Math.round(v*100)+'c'};
          const bill=BILLS.find(b=>b.v===v);
          return <button key={i} className={'btn '+(fb==='ok'&&v===ex.ans?'btn-g':fb==='no'&&v===ex.ans?'btn-gold':'btn-b')} onClick={()=>{
            if(fb)return;poke();
            if(v===ex.ans){setFb('ok');starBeep(4);
              cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral(ex.labels[i]+' vale más',4,1),300));
            } else {
              const na=att2+1;setAtt2(na);setFb('no');beep(200,200);
              if(na>=2){sayFB(ex.labels[ex.values.indexOf(ex.ans)]+' vale más');setTimeout(()=>{setFb(null);setTimeout(()=>onOk(1,na),400)},2500)}
              else{sayFB('Mira los dos con calma');setTimeout(()=>setFb(null),1800)}
            }
          }} style={{padding:20,minHeight:160,display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
            {bill?<BillSVG b={bill} w={150} h={80}/>:<CoinSVG c={coin} sz={80}/>}
            <span style={{fontSize:18,fontWeight:700}}>{ex.labels[i]}</span>
          </button>;
        })}
      </div>
    </div>}
    {/* PAY_EXACT — Pagar con UNA moneda exacta (Avanzado) */}
    {ex.mode==='pay_exact'&&<div style={{maxWidth:600,margin:'0 auto'}}>
      <div className="card" style={{padding:18,marginBottom:14}}>
        <p style={{fontSize:20,fontWeight:700,margin:'0 0 6px',color:GOLD}}>Paga con UNA sola moneda</p>
        <div style={{fontSize:60,marginBottom:6}}>{ex.product.e}</div>
        <p style={{fontSize:20,fontWeight:600,color:'#fff',margin:0}}>{ex.product.l}: {ex.product.cents} céntimos</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {ex.opts.map((c,i)=><button key={i} className={'btn '+(fb==='ok'&&c.v===ex.coin.v?'btn-g':fb==='no'&&c.v===ex.coin.v?'btn-gold':'btn-b')} onClick={()=>{
          if(fb)return;poke();
          if(c.v===ex.coin.v){setFb('ok');starBeep(4);
            cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral('Pago con '+moneyLabel(c.v,true),4,1),300));
          } else {
            const na=att2+1;setAtt2(na);setFb('no');beep(200,200);
            if(na>=2){sayFB('La moneda es '+moneyLabel(ex.coin.v,true));setTimeout(()=>{setFb(null);setTimeout(()=>onOk(1,na),400)},2500)}
            else{sayFB('Mira el precio y busca esa moneda');setTimeout(()=>setFb(null),2000)}
          }
        }} style={{padding:18,minHeight:120,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <CoinSVG c={c} sz={70}/>
          <span style={{fontSize:14,fontWeight:600}}>{moneyLabel(c.v)}</span>
        </button>)}
      </div>
    </div>}
    {/* ENOUGH — ¿Te llega? (Avanzado, sí/no) */}
    {ex.mode==='enough'&&(()=>{
      const productCents=ex.product.cents||(ex.product.euros*100);
      const walletLabel=ex.wallet>=100?(ex.wallet/100)+' euro'+(ex.wallet===100?'':'s'):ex.wallet+' céntimos';
      const productLabel=ex.product.cents?ex.product.cents+' céntimos':ex.product.euros+' euro'+(ex.product.euros===1?'':'s');
      return <div style={{maxWidth:500,margin:'0 auto'}}>
        <div className="card" style={{padding:18,marginBottom:14}}>
          <p style={{fontSize:20,fontWeight:700,margin:'0 0 8px',color:GOLD}}>Tienes {walletLabel} en el monedero</p>
          <div style={{fontSize:60,marginBottom:8}}>{ex.product.e}</div>
          <p style={{fontSize:20,margin:0}}>{ex.product.l}: <strong style={{color:GOLD}}>{productLabel}</strong></p>
          <p style={{fontSize:22,fontWeight:700,marginTop:12,color:'#fff'}}>¿Te llega para comprarlo?</p>
        </div>
        {!fb&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {[true,false].map(v=><button key={String(v)} className={'btn '+(fb==='ok'&&v===ex.enough?'btn-g':'btn-b')} onClick={()=>{
            poke();
            if(v===ex.enough){setFb('ok');starBeep(4);
              cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral(ex.enough?'Sí me llega':'No me llega',4,1),300));
            } else {
              const na=att2+1;setAtt2(na);setFb('no');beep(200,200);
              if(na>=2){sayFB(ex.enough?'Sí te llega':'No te llega');setTimeout(()=>{setFb(null);setTimeout(()=>onOk(1,na),400)},2500)}
              else{sayFB('Compara las dos cantidades con calma');setTimeout(()=>setFb(null),2000)}
            }
          }} style={{fontSize:26,padding:24,fontWeight:700,minHeight:80}}>{v?'✅ Sí':'❌ No'}</button>)}
        </div>}
      </div>;
    })()}
    {/* EQUIV — Equivalencia €/cts (Master) */}
    {ex.mode==='equiv'&&<div style={{maxWidth:600,margin:'0 auto'}}>
      <div className="card" style={{padding:20,marginBottom:14}}>
        <p style={{fontSize:24,fontWeight:700,margin:0,color:GOLD,lineHeight:1.3}}>{ex.data.q}</p>
      </div>
      {!fb&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {ex.data.opts.map(o=><button key={o} className="btn btn-b" onClick={()=>{
          poke();
          if(o===ex.data.ans){setFb('ok');starBeep(4);
            cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral(ex.data.ans,4,1),300));
          } else {
            const na=att2+1;setAtt2(na);setFb('no');beep(200,200);
            if(na>=2){sayFB('La respuesta es: '+ex.data.ans);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(1,na),400)},2500)}
            else{sayFB('Recuerda: un euro son cien céntimos');setTimeout(()=>setFb(null),2000)}
          }
        }} style={{fontSize:22,padding:18,fontWeight:700,minHeight:68}}>{o}</button>)}
      </div>}
    </div>}
    {/* CHANGE_ROUND — ¿Cuánto me devuelven? (Master, cantidades redondas) */}
    {ex.mode==='change_round'&&<div style={{maxWidth:600,margin:'0 auto'}}>
      <div className="card" style={{padding:18,marginBottom:14}}>
        <div style={{fontSize:60,marginBottom:6}}>{ex.product.e}</div>
        <p style={{fontSize:18,margin:'0 0 6px'}}>{ex.product.l} cuesta <strong style={{color:GOLD}}>{ex.product.cents} céntimos</strong></p>
        <p style={{fontSize:18,margin:'0 0 8px'}}>Pagas con <strong style={{color:GOLD}}>{ex.paid} euro{ex.paid===1?'':'s'}</strong></p>
        <p style={{fontSize:22,fontWeight:700,color:'#fff',margin:0}}>¿Cuánto te devuelven?</p>
      </div>
      {!fb&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {ex.opts.map(o=><button key={o} className="btn btn-b" onClick={()=>{
          poke();
          if(o===ex.change){setFb('ok');starBeep(4);
            cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral('Me devuelven '+ex.change,4,1),300));
          } else {
            const na=att2+1;setAtt2(na);setFb('no');beep(200,200);
            if(na>=2){sayFB('Te devuelven '+ex.change);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(1,na),400)},2500)}
            else{sayFB('Piensa: pagas más de lo que cuesta, te devuelven la diferencia');setTimeout(()=>setFb(null),2500)}
          }
        }} style={{fontSize:20,padding:16,fontWeight:700,minHeight:64}}>{o}</button>)}
      </div>}
    </div>}
    {/* PAY_COMBINE — Combinar 2 billetes para pagar (Master) */}
    {ex.mode==='pay_combine'&&<div style={{maxWidth:600,margin:'0 auto'}}>
      <div className="card" style={{padding:18,marginBottom:14}}>
        <p style={{fontSize:22,fontWeight:700,margin:'0 0 8px',color:GOLD}}>¿Cómo pagas?</p>
        <p style={{fontSize:24,fontWeight:600,color:'#fff',margin:0}}>{ex.priceLabel}</p>
      </div>
      {!fb&&<div style={{display:'grid',gridTemplateColumns:'1fr',gap:10}}>
        {ex.opts.map(o=><button key={o} className="btn btn-b" onClick={()=>{
          poke();
          if(o===ex.ans){setFb('ok');starBeep(4);
            cheerOrSay(mkPerfect(name),uid,vids,'perfect').then(()=>setTimeout(()=>triggerOral('Pago con '+ex.ans.replace(/€/g,' euros').replace(/\+/g,' y '),4,1),300));
          } else {
            const na=att2+1;setAtt2(na);setFb('no');beep(200,200);
            if(na>=2){sayFB('Se paga con '+ex.ans);setTimeout(()=>{setFb(null);setTimeout(()=>onOk(1,na),400)},2500)}
            else{sayFB('Suma los dos billetes y mira si dan el precio');setTimeout(()=>setFb(null),2500)}
          }
        }} style={{fontSize:22,padding:18,fontWeight:700,minHeight:64}}>{o}</button>)}
      </div>}
    </div>}
    {ex.mode==='sum'&&<div style={{maxWidth:500,margin:'0 auto'}}>
      <div className="card" style={{padding:20,marginBottom:16}}>
        <p style={{fontSize:24,fontWeight:700,margin:'0 0 12px',color:GOLD}}>¿Cuánto hay en total?</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center'}}>
          {ex.coins.map((c,i)=>c.v>=5?<Bill key={i} b={c}/>:<Coin key={i} c={c}/>)}
        </div>
      </div>
      {/* Multiple choice — NO numpad */}
      {opts&&!fb&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {opts.map(o=><button key={o.v} className="btn btn-b" onClick={()=>pickOpt(o.v)}
          style={{fontSize:22,padding:18,fontWeight:700,minHeight:64}}>{o.label}</button>)}
      </div>}
    </div>}
    {ex.mode==='pay'&&<div>
      <div className="card" style={{padding:20,marginBottom:14}}><p style={{fontSize:22,fontWeight:700,margin:'0 0 8px',color:GOLD}}>Paga: {ex.price.toFixed(2).replace('.',',')} €</p>
        <p style={{fontSize:14,color:DIM,margin:0}}>Toca las monedas para pagar</p></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:12}}>
        {/* Distinguir billete vs moneda — antes los billetes salian como circulo dorado */}
        {sel.map((c,i)=>c.v>=5?<Bill key={i} b={c}/>:<Coin key={i} c={c}/>)}{sel.length===0&&<p style={{color:DIM,fontSize:14}}>Arrastra aquí</p>}</div>
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
