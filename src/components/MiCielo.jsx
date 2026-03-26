import { GOLD, TXT, DIM } from '../constants.js'

export function MiCielo({user, onClose}) {
      const s3p=user?.totalStars3plus||0;const constellations=Math.floor(s3p/10);
      const CONST_NAMES=['El Cohete','La Corona','El Oso','La Estrella','El Planeta','La Luna'];
      // Deterministic star positions seeded by index
      function starPos(i){const a=i*2654435761;const x=((a>>>0)%1000)/10;const y=(((a*31)>>>0)%1000)/10;return{x,y}}
      const totalStarDots=Math.max(s3p,60);
      return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:200,background:'radial-gradient(ellipse at 50% 30%,#0a1628 0%,#000810 100%)',overflow:'auto'}}>
        {/* Back button */}
        <button onClick={onClose} style={{position:'absolute',top:16,left:16,zIndex:210,background:'rgba(255,255,255,.1)',border:'2px solid rgba(255,255,255,.2)',borderRadius:12,padding:'8px 16px',color:TXT,fontSize:16,fontFamily:"'Fredoka'",cursor:'pointer',fontWeight:600}}>← Volver</button>
        {/* Title and counter */}
        <div style={{position:'absolute',top:16,right:16,zIndex:210,textAlign:'right'}}>
          <p style={{fontSize:16,color:GOLD,fontWeight:700,margin:0}}>Tienes {s3p} estrellas y {constellations} constelaciones</p>
        </div>
        {/* Star field */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute',top:0,left:0}}>
          {Array.from({length:totalStarDots},(_,i)=>{const p=starPos(i);const lit=i<s3p;
            return <circle key={i} cx={p.x} cy={p.y} r={lit?0.6:0.3} fill={lit?GOLD:'#555'} opacity={lit?0.9:0.3}>
              {lit&&<animate attributeName="opacity" values=".6;1;.6" dur={`${2+((i*7)%3)}s`} repeatCount="indefinite"/>}
            </circle>})}
          {/* Constellation lines: connect groups of 10 lit stars */}
          {Array.from({length:constellations},(_,ci)=>{
            const starIdxs=Array.from({length:10},(__,si)=>ci*10+si);
            const pts=starIdxs.map(si=>starPos(si));
            // Sort pts by angle from centroid for a nice polygon shape
            const cx2=pts.reduce((s,p2)=>s+p2.x,0)/10;const cy2=pts.reduce((s,p2)=>s+p2.y,0)/10;
            const sorted=[...pts].sort((a2,b2)=>Math.atan2(a2.y-cy2,a2.x-cx2)-Math.atan2(b2.y-cy2,b2.x-cx2));
            const pathD=sorted.map((p2,pi)=>`${pi===0?'M':'L'}${p2.x},${p2.y}`).join(' ')+'Z';
            return <g key={'c'+ci}>
              <path d={pathD} fill="none" stroke={GOLD+'66'} strokeWidth="0.15"/>
              <text x={cx2} y={cy2} fill={GOLD} fontSize="1.8" textAnchor="middle" dominantBaseline="central" fontFamily="'Fredoka'" fontWeight="600">{CONST_NAMES[ci%CONST_NAMES.length]}</text>
            </g>})}
        </svg>
        {/* Center label */}
        <div style={{position:'absolute',bottom:40,left:0,right:0,textAlign:'center',zIndex:210}}>
          <p style={{fontSize:28,fontWeight:900,color:GOLD,margin:0,textShadow:'0 0 20px '+GOLD+'88'}}>Mi Cielo</p>
          <p style={{fontSize:14,color:DIM,margin:'4px 0 0'}}>Cada ejercicio perfecto enciende una estrella</p>
        </div>
      </div>
}
