// ============================================================
// TOKI · Constants & Static Data
// ============================================================

export const BG='#0B1D3A',BG2='#122548',BG3='#1A3060',GOLD='#F0C850',GREEN='#2ECC71',RED='#E74C3C',BLUE='#3498DB',PURPLE='#9B59B6',TXT='#ECF0F1',DIM='#A0AEC0',CARD='#152D55',BORDER='#1E3A6A';
export const VER='v25.13';
export const ADMIN_EMAIL='diego@toki-app.es';
export const SUPPORT_EMAIL='Tokidilo@gmail.com';

export const CSS=`
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;font-family:'Fredoka',sans-serif;color:${TXT};min-height:100vh;min-height:100dvh;transition:background 2s;overflow-x:hidden}
:root{--safe-top:env(safe-area-inset-top,0px);--safe-right:env(safe-area-inset-right,0px);--safe-bottom:env(safe-area-inset-bottom,0px);--safe-left:env(safe-area-inset-left,0px);--dock-h:104px;--game-topbar-h:112px;--game-feedback-h:84px;--root-pad-x:clamp(12px,3vw,28px);--root-pad-y:clamp(10px,2.4vw,22px);--planet-size:82px;--tap-target:48px}
body.sky-morning{background:linear-gradient(180deg,#1a3a6a 0%,#2e6bb5 40%,#5ba3d9 100%)}
body.sky-afternoon{background:linear-gradient(180deg,#1a2744 0%,#c0392b 30%,#e67e22 60%,#f39c12 100%)}
/* Contraste WCAG sobre fondo naranja del atardecer (Doc §3.5):
   añadimos sombra fina oscura a los textos directos del body para que
   el contraste suba a 7:1+ aunque sean amarillos/dorados (antes ~2:1).
   No afecta morning (azul) ni night (oscuro), donde ya hay contraste. */
body.sky-afternoon h1,body.sky-afternoon h2,body.sky-afternoon h3,body.sky-afternoon h4,body.sky-afternoon p,body.sky-afternoon span{text-shadow:0 1px 3px rgba(0,0,0,.55)}
body.sky-night{background:${BG}}
body.sky-night::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:0;background:radial-gradient(1px 1px at 10% 20%,#fff8 0,transparent 100%),radial-gradient(1px 1px at 30% 50%,#fff6 0,transparent 100%),radial-gradient(1.5px 1.5px at 50% 10%,#fff9 0,transparent 100%),radial-gradient(1px 1px at 70% 40%,#fff5 0,transparent 100%),radial-gradient(1px 1px at 90% 70%,#fff7 0,transparent 100%),radial-gradient(1.5px 1.5px at 15% 80%,#fff8 0,transparent 100%),radial-gradient(1px 1px at 45% 65%,#fff6 0,transparent 100%),radial-gradient(1px 1px at 80% 15%,#fff7 0,transparent 100%),radial-gradient(1.5px 1.5px at 60% 85%,#fff5 0,transparent 100%),radial-gradient(1px 1px at 25% 35%,#fff6 0,transparent 100%),radial-gradient(1px 1px at 85% 55%,#fff4 0,transparent 100%),radial-gradient(1.5px 1.5px at 5% 60%,#fff7 0,transparent 100%),radial-gradient(1px 1px at 95% 25%,#fff5 0,transparent 100%),radial-gradient(1px 1px at 40% 90%,#fff6 0,transparent 100%);animation:twinkle 8s ease-in-out infinite alternate}
@keyframes twinkle{0%{opacity:.7}100%{opacity:1}}
button{font-family:'Fredoka',sans-serif;touch-action:manipulation;cursor:pointer}
input{font-family:'Fredoka',sans-serif}
input::placeholder{color:${DIM}}
#root{width:min(100%,1440px);max-width:none;margin:0 auto;padding:calc(var(--root-pad-y) + var(--safe-top)) calc(var(--root-pad-x) + var(--safe-right)) calc(var(--root-pad-y) + var(--safe-bottom)) calc(var(--root-pad-x) + var(--safe-left));position:relative;z-index:1}
.btn{display:block;width:100%;border:3px solid;border-radius:14px;padding:22px 28px;font-weight:600;font-size:22px;transition:transform .1s;color:#fff;text-align:center;min-height:48px}
.btn:active{transform:scale(.93)!important}
.btn:disabled{opacity:.35;cursor:not-allowed}
.btn-g{background:${GREEN};border-color:#27ae60;box-shadow:4px 4px 0 #1e8449}
.btn-b{background:${BLUE};border-color:#2980b9;box-shadow:4px 4px 0 #1a5276}
.btn-p{background:${PURPLE};border-color:#7d3c98;box-shadow:4px 4px 0 #6c3483}
.btn-o{background:#E67E22;border-color:#d35400;box-shadow:4px 4px 0 #a04000}
.btn-gold{background:${GOLD};border-color:#d4ac0d;box-shadow:4px 4px 0 #b7950b;color:#1a1a2e}
.btn-ghost{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);box-shadow:none;color:${DIM};font-size:16px}
/* Botón Saltar — flotante junto al de Pausa, abajo izquierda. Antes era
   un botón ancho de lado a lado con icono diminuto que descolocaba el
   layout. Ahora siempre en el mismo sitio, redondo y reconocible.
   Doc §3 (feedback Diego 26/04).

   Selector .btn.skip-btn (mismo elemento, no descendiente): solo aplica
   a los botones de módulo que tienen ambas clases. Los .skip-btn sueltos
   del dock oral de SpeakPanel (al lado del micro) NO se reposicionan,
   conservan su layout en la fila del micro. */
.btn.skip-btn{
  position:fixed!important;
  left:calc(var(--safe-left) + 84px)!important;
  bottom:calc(var(--safe-bottom) + 14px)!important;
  width:60px!important;
  height:60px!important;
  min-height:60px!important;
  max-width:60px!important;
  padding:0!important;
  margin:0!important;
  border-radius:50%!important;
  font-size:24px!important;
  font-weight:700!important;
  background:rgba(0,0,0,.55)!important;
  border:2px solid rgba(255,255,255,.25)!important;
  color:#fff!important;
  z-index:20!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  /* Texto "Saltar" se trunca, solo se ve el icono ⏭️ — el botón ya es
     reconocible por posición y forma redonda. */
  white-space:nowrap;overflow:hidden;
}
.btn.skip-btn:active{transform:scale(.92)}
/* Stack flotante centrado para acciones secundarias (Pista, Empezar de nuevo,
   Borrar) — sigue al centro, debajo de la zona principal del ejercicio,
   donde después aparecen las estrellas y el micro. Cuando aparece el
   OralPrompt el módulo retira la clase para que no se solapen. Doc §3.6. */
.fab-center-stack{
  position:fixed!important;
  left:50%!important;
  bottom:calc(var(--safe-bottom) + 18px)!important;
  transform:translateX(-50%)!important;
  z-index:15!important;
  display:flex!important;
  gap:12px!important;
  pointer-events:auto!important;
  /* Fondo translúcido para no perder los botones encima del módulo */
  background:rgba(0,0,0,.30)!important;
  border-radius:16px!important;
  padding:6px 8px!important;
  backdrop-filter:blur(6px)!important;
}
.btn-half{display:inline-block;width:48%;font-size:18px;padding:12px 0}
.btn-word{display:inline-block;width:auto;padding:12px 18px;font-size:20px}
.card{background:${CARD};border:2px solid ${BORDER};border-radius:18px;padding:20px}
.inp{width:100%;padding:16px;background:${BG3};border:2px solid ${BORDER};border-radius:12px;color:${TXT};font-size:20px;outline:none}
.ws{min-width:52px;height:50px;display:flex;align-items:center;justify-content:center;padding:0 14px;border-radius:12px;font-size:20px;font-weight:600;transition:all .2s}
.ws-e{background:rgba(255,255,255,.04);border:2.5px dashed rgba(255,255,255,.18);color:rgba(255,255,255,.18)}
.ws-f{background:${GREEN};border:2.5px solid #27ae60;color:#0B1D3A;box-shadow:2px 2px 0 #1e8449}
.pbar{height:7px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden}
.pfill{height:100%;background:linear-gradient(90deg,${GREEN},${BLUE});border-radius:4px;transition:width .5s}
.ov{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;background:rgba(0,0,0,.92)}
.ovp{background:${BG2};border:2px solid ${GOLD}55;border-radius:20px;padding:32px 24px;max-width:400px;width:100%;text-align:center}
.profcard{display:flex;align-items:center;gap:16px;padding:18px 22px;width:100%;text-align:left;background:${CARD};border:2px solid ${BORDER};border-radius:16px;color:${TXT}}
.avbtn{font-size:30px;width:52px;height:52px;border-radius:14px;border:2px solid ${BORDER};background:${BG3}}
.avbtn.on{border-color:${GOLD};background:${GOLD}22}
.tabs{display:flex;gap:4px;background:${BG3};border-radius:12px;padding:4px}
.tab{flex:1;padding:12px;border-radius:10px;border:none;font-weight:600;font-size:17px;background:transparent;color:${DIM}}
.tab.on{background:${GOLD};color:#1a1a2e}
.sbox{background:${CARD};border:2px solid ${BORDER};border-radius:12px;padding:16px;text-align:center}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounceIn{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
@keyframes confDrop{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes qsbar{0%{height:100%}100%{height:0%}}
@keyframes glow{0%,100%{filter:drop-shadow(0 0 8px ${GOLD}66)}50%{filter:drop-shadow(0 0 20px ${GOLD}aa)}}
@keyframes planetPulse{0%,100%{transform:scale(.92);filter:drop-shadow(0 0 6px rgba(255,255,255,.2))}50%{transform:scale(.97);filter:drop-shadow(0 0 14px rgba(255,255,255,.4))}}
@keyframes planetRing{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes orbitStar{0%{transform:rotate(0deg) translateX(52px) rotate(0deg)}100%{transform:rotate(360deg) translateX(52px) rotate(-360deg)}}
@keyframes rocketFly{0%{transform:translateY(100vh) scale(1);opacity:1}60%{transform:translateY(-20vh) scale(1.1);opacity:1}100%{transform:translateY(-120vh) scale(.6);opacity:0}}
@keyframes rocketUp{0%{transform:translate(0,0) rotate(0deg);opacity:1}15%{transform:translate(5px,15px) rotate(10deg);opacity:1}40%{transform:translate(-20px,-80px) rotate(-15deg);opacity:1}65%{transform:translate(25px,-180px) rotate(10deg);opacity:0.9}100%{transform:translate(-10px,-350px) rotate(-5deg);opacity:0}}
@keyframes starPop{0%{transform:scale(0) rotate(-30deg);opacity:0}30%{transform:scale(2) rotate(15deg);opacity:1;filter:drop-shadow(0 0 20px #FFD700)}60%{transform:scale(0.8) rotate(-5deg)}80%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:0.9}100%{transform:translateY(120px) rotate(360deg);opacity:0}}
@keyframes starBurstRing{0%{transform:scale(0.1);opacity:0.9}100%{transform:scale(1.8);opacity:0}}
@keyframes starPass{0%{transform:translateY(-20px);opacity:0}20%{opacity:1}100%{transform:translateY(110vh);opacity:0}}
@keyframes sparkleFlicker{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.35);opacity:.65}}
@keyframes countNum{0%{transform:scale(.3);opacity:0}50%{transform:scale(1.3)}100%{transform:scale(1);opacity:1}}
@keyframes mascotBounce{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-8px) rotate(-5deg)}75%{transform:translateY(-4px) rotate(5deg)}}
@keyframes mascotShy{0%,100%{transform:rotate(0)}50%{transform:rotate(15deg)}}
@keyframes mascotDance{0%{transform:translateY(0) rotate(0) scale(1)}25%{transform:translateY(-6px) rotate(-10deg) scale(1.1)}50%{transform:translateY(0) rotate(0) scale(1)}75%{transform:translateY(-6px) rotate(10deg) scale(1.1)}}
@keyframes planetFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes orbitAll{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes counterSpin{0%{transform:rotate(0deg)}100%{transform:rotate(-360deg)}}
@keyframes sosPulse{0%,100%{transform:scale(1);box-shadow:0 4px 16px rgba(231,76,60,.4)}50%{transform:scale(1.08);box-shadow:0 4px 24px rgba(231,76,60,.7)}}
.skip-btn{display:none}body.sup-mode .skip-btn{display:inline-block}
.af{animation:fadeIn .4s ease-out}.ab{animation:bounceIn .45s}.ap{animation:pulse 1.4s infinite}.as{animation:shake .4s}
body.theme-sober{background:linear-gradient(180deg,#1a1a2e 0%,#2d2d44 100%)!important}
body.theme-sober::before{display:none!important}
body.theme-sober .sky-morning,body.theme-sober .sky-afternoon,body.theme-sober .sky-night{background:none!important}
body.theme-sober .sober-hide{display:none!important}
@media (max-width:480px){
  :root{--dock-h:96px;--game-topbar-h:104px;--game-feedback-h:76px;--planet-size:64px;--root-pad-x:12px;--root-pad-y:10px}
  #root{width:100%}
  .btn{padding:14px 16px;font-size:18px;border-radius:12px;min-height:48px}
  .btn-word{padding:10px 14px;font-size:17px}
  .btn-half{font-size:16px;padding:12px 0;min-height:48px}
  .card{padding:14px;border-radius:14px}
  .inp{padding:12px;font-size:17px}
  .ovp{padding:20px 16px;border-radius:16px;max-width:340px}
  .ws{min-width:44px;height:44px;font-size:17px;padding:0 10px}
}
@media (min-width:768px) and (max-width:1023px){
  :root{--dock-h:112px;--game-topbar-h:118px;--game-feedback-h:90px;--planet-size:80px;--tap-target:56px;--root-pad-x:20px;--root-pad-y:14px}
}
@media (min-width:1024px) and (max-width:1365px){
  :root{--dock-h:124px;--game-topbar-h:124px;--game-feedback-h:94px;--planet-size:92px;--tap-target:60px;--root-pad-x:24px;--root-pad-y:16px}
}
@media (min-width:1366px){
  :root{--dock-h:128px;--game-topbar-h:128px;--game-feedback-h:96px;--planet-size:96px;--tap-target:62px;--root-pad-x:28px;--root-pad-y:18px}
}
@media (max-width:360px){
  :root{--dock-h:90px;--game-topbar-h:98px;--planet-size:58px;--root-pad-x:10px;--root-pad-y:8px}
  #root{width:100%}
  .btn{padding:12px 12px;font-size:16px;border-width:2px;border-radius:10px;min-height:44px}
  .card{padding:10px;border-radius:12px}
  .ovp{padding:16px 12px;max-width:300px}
}
@media (hover:none){
  *{-webkit-user-select:none;user-select:none}
  input,textarea{-webkit-user-select:text;user-select:text}
}
.btn:focus-visible,button:focus-visible{outline:3px solid #FFD700;outline-offset:2px}
input:focus-visible{outline:3px solid #FFD700;outline-offset:2px}
`;

export const AVS=['🧑‍🚀','👨‍🚀','👩‍🚀','🦸','🦸‍♂️','🦸‍♀️','🧙','🧙‍♂️','🧙‍♀️','🧑‍🎤','👨‍🎤','👩‍🎤','🧑‍🎨','🧑‍🏫','👨‍🍳','👩‍🔬','🧑‍✈️','👮','🥷','🧛','🧜‍♀️','🧜‍♂️','🧚','🧞','🦊','🐸','🐉','🦁','🐼','🐨','🦄','🐯','🐺','🦖','🐙','🦈','🦅','🦋','🤖','👾','🎮','⚡','🌟','🔥','💎','🎯','🏆','🎸','🛹','🏄','⚽','🎪','🚀','🌈'];
export const CLS=[GREEN,BLUE,GOLD,PURPLE,RED,'#E67E22',GREEN];
// SMINS removed - replaced by SESSION_TIMES/SESSION_GOALS dual system
export const SESSION_TIMES = [30, 60, 90]
export const SESSION_TIME_LABELS = ['30 min', '1 hora', '1h 30 min']
export const SESSION_GOALS = [100, 200, 300]
export const GOAL_LABELS = ['Sesión ligera', 'Sesión completa', 'Sesión intensiva']
export const GOAL_ESTIMATES = ['~25 min', '~50 min', '~75 min']
export const GOAL_EMOJIS = ['🏃', '🏋️', '🚀']
export const PERSONA_RELATIONS=['Padre','Madre','Hermano','Hermana','Abuelo','Abuela','Tío','Tía','Primo','Prima','Amigo','Amiga','Compañero/a','Profe'];

export const BUILD_OK=['¡Sí señor!','¡Eso es!','¡Bien hecho!','¡Perfecto!','¡Así se hace!','¡Genial!','¡Correcto!','¡Exacto!'];
export const PERFECT_T=['¡Muy bien {N}!','¡Eres un crack {N}!','¡Genial {N}, sigue así!','¡{N}, qué crack!','¡Bravo {N}!','¡Espectacular {N}!','¡Fantástico {N}!','¡Lo has clavado {N}!','¡Qué bien {N}!','¡Eso es {N}!'];
export const GOOD_MSG=['¡Bien!','¡Genial!','¡Muy bien!','¡Fenomenal!','¡Estupendo!','¡Olé!'];
export const RETRY_MSG=['Otra vez','Venga, otra','Una más','Casi casi'];
export const FAIL_MSG=['Poco a poco','No pasa nada','Seguimos','Ánimo'];
// "Sigue" eliminado de las listas de cheers porque cuando aparece justo antes
// del micrófono para repetir frase ("Sigue" → frase + 🎤) confunde: el niño
// piensa "continúa al siguiente" cuando en realidad se le pide repetir.
// Doc §3.6.
export const SHORT_OK=['¡Bravo!','¡Venga!','¡Va!','¡Eso es!','¡Dale!','¡Fenómeno!','¡Vamos!','¡Bien!','¡Eso!','¡Olé!','¡Genial!','¡Muy bien!'];
export const SHORT_FAIL=['¡Casi!','¡Venga!','¡Va!','¡Otra vez!','¡Dale!','¡Ánimo!','¡Vamos!','¡Tú puedes!'];
export const MODULE_MSG={decir:['¡Dilo!','¡Dilo tú!','¡Dilo otra vez!','¡Venga, dilo!'],frase:['¡Dilo!','¡Dilo tú!','¡Venga, dilo!'],math:['¡Cuenta!','¡Cuenta conmigo!','¡Cuenta otra vez!'],multi:['¡Cuenta!','¡Cuenta conmigo!'],frac:['¡Cuenta!','¡Cuenta otra vez!'],contar:['¡Cuenta!','¡Cuenta conmigo!'],writing:['¡Escríbelo!','¡Escribe otra vez!'],calendar:['¡Piensa!','¡Tú puedes!','¡Razona!'],distribute:['¡Piensa!','¡Tú puedes!'],clock:['¡Piensa!','¡Razona!'],money:['¡Piensa!','¡Tú puedes!'],quiensoy:['¡Dilo!','¡Dilo tú!'],razona:['¡Piensa!','¡Tú puedes!','¡Razona!','¡Piensa bien!'],lee:['¡Léelo!','¡Lee otra vez!','¡Tú sabes leer!','¡Venga, lee!']};
export const CHEER_ALL=[...PERFECT_T,...GOOD_MSG,...RETRY_MSG,...FAIL_MSG,...BUILD_OK,...SHORT_OK];

export const NUMS_1_100=Array.from({length:100},(_,i)=>{const n=i+1;if(n===100)return'Cien';const u=['','Uno','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Once','Doce','Trece','Catorce','Quince','Dieciséis','Diecisiete','Dieciocho','Diecinueve','Veinte'];if(n<=20)return u[n];if(n<30)return'Veinti'+['uno','dós','trés','cuatro','cinco','séis','siete','ocho','nueve'][n-21];const d=['','','','Treinta','Cuarenta','Cincuenta','Sesenta','Setenta','Ochenta','Noventa'];const t=Math.floor(n/10),r=n%10;return r===0?d[t]:d[t]+' y '+u[r].toLowerCase()});

export const QUIEN_SOY=[
  {id:'qs01',text:'Hola, soy Guillermo',img:'/quiensoy/01.jpg'},
  {id:'qs02',text:'Este mes tiene un día importante',img:'/quiensoy/02.jpg'},
  {id:'qs03',text:'El veintiuno es el día del síndrome de Down',img:'/quiensoy/03.jpg'},
  {id:'qs04',text:'Igual que vosotros',img:'/quiensoy/04.jpg'},
  {id:'qs05',text:'Por la tarde hago muchas actividades',img:'/quiensoy/05.jpg'},
  {id:'qs06',text:'Toco el piano',img:'/quiensoy/06.jpg'},
  {id:'qs07',text:'Juego al bádminton',img:'/quiensoy/07.jpg'},
  {id:'qs08',text:'Voy a natación',img:'/quiensoy/08.jpg'},
  {id:'qs09',text:'Soy modelo de ropa',img:'/quiensoy/09.jpg'},
  {id:'qs10',text:'Voy a ASSIDO',img:'/quiensoy/10.jpg'},
  {id:'qs11',text:'Hacemos teatro y baile',img:'/quiensoy/11.jpg'},
  {id:'qs12',text:'Yo hago mis tareas',img:'/quiensoy/12.jpg'},
  {id:'qs13',text:'Igual que vosotros',img:'/quiensoy/13.jpg'},
  {id:'qs14',text:'Me gusta hacer muchas cosas',img:'/quiensoy/14.jpg'},
  {id:'qs15',text:'Me gusta cocinar',img:'/quiensoy/15.jpg'},
  {id:'qs16',text:'Me gusta pintar',img:'/quiensoy/16.jpg'},
  {id:'qs17',text:'Me gusta hacer muchos deportes',img:'/quiensoy/17.jpg'},
  {id:'qs18',text:'A veces molesto sin querer',img:'/quiensoy/18.jpg'},
  {id:'qs19',text:'Pero puede que esté nervioso',img:'/quiensoy/19.jpg'},
  {id:'qs20',text:'Estoy aprendiendo a hacerlo mejor',img:'/quiensoy/20.jpg'},
  {id:'qs21',text:'Yo solo quiero jugar',img:'/quiensoy/21.jpg'},
  {id:'qs22',text:'Porque todos somos iguales',img:'/quiensoy/22.jpg'},
  {id:'qs23',text:'Juntos es mejor',img:'/quiensoy/23.jpg'},
  {id:'qs24',text:'Muchas gracias por como me tratáis',img:'/quiensoy/24.jpg'},
  {id:'qs25',text:'Os amo',img:'/quiensoy/25.jpg'},
];

export const LV_OPTS={
  quiensoy:[{n:1,l:'Estudio'},{n:2,l:'Presentación'}],
  razona_spatial:[{n:1,l:'Elige'},{n:2,l:'Arrastra'}],
  razona_series:[{n:6,l:'Colores'},{n:7,l:'Formas'},{n:8,l:'Combinado'}],
  razona_piensa:[{n:4,l:'Básico'},{n:16,l:'Avanzado'},{n:17,l:'Master'}],
  razona_clasifica:[{n:3,l:'Clasifica'}],
  razona_emociones:[{n:5,l:'Básico'},{n:18,l:'Avanzado'},{n:19,l:'Master'}],
  razona_numeros:[{n:9,l:'Series numéricas'}],
  razona_compara:[{n:10,l:'Comparar cantidades'}],
  razona_secuencias:[{n:11,l:'Básico'},{n:14,l:'Avanzado'},{n:15,l:'Master'}],
  razona_anterior_posterior:[{n:12,l:'Anterior y posterior'}],
  razona_temperatura:[{n:13,l:'Termómetro'}],
  decir:[{n:1,l:'N1'},{n:2,l:'N2'},{n:3,l:'N3'},{n:4,l:'N4'},{n:5,l:'N5'}],
  frase:[{n:1,l:'3 pal'},{n:2,l:'4 pal'},{n:3,l:'5 pal'}],
  contar:[{n:1,l:'1-20'},{n:2,l:'20-50'},{n:3,l:'50-100'},{n:4,l:'1-100'}],
  math:[{n:5,l:'🐥 Contar objetos'},{n:6,l:'🍎 Sumas visual'},{n:7,l:'📖 Problemas'},{n:1,l:'Sumas fácil'},{n:2,l:'Sumas+'},{n:3,l:'Restas'},{n:4,l:'Mezcla'}],
  multi:[{n:1,l:'x2/x3'},{n:2,l:'x5/x10'},{n:3,l:'Mezcla'}],
  frac:[{n:1,l:'Reconocer'},{n:2,l:'Notación'},{n:3,l:'Equivalencias'},{n:4,l:'Sumar'},{n:5,l:'Sumar/Restar'}],
  // Monedas reestructurado en 3 niveles pedagógicos (Doc §4.10).
  // Básico: ¿Cuánto vale? + ¿Cuánto cuesta? + ¿Cuál vale más?
  // Avanzado: ¿Cuál vale más? mezclado + Pagar exacto + ¿Te llega?
  // Master: Equivalencia €/cts + ¿Cuánto devuelven? + Pagar combinando.
  money:[{n:1,l:'Básico'},{n:2,l:'Avanzado'},{n:3,l:'Master'},{n:4,l:'Cambio (legacy)'}],
  clock:[{n:1,l:'En punto'},{n:2,l:'Media'},{n:3,l:'Cuarto'}],
  // Calendario rediseñado en 3 niveles (Doc §4.11.2). Antes/después
  // (Básico), 3 huecos consecutivos (Avanzado), ordenar completo (Master).
  calendar:[{n:1,l:'Básico'},{n:2,l:'Avanzado'},{n:3,l:'Master'}],
  distribute:[{n:1,l:'Poner'},{n:2,l:'Repartir'},{n:3,l:'Comparar'}],
  // Letras — Básico mayús con guía, Avanzado minús con guía, Master sin guía.
  // En GROUPS_V2 estas tres columnas viven todas bajo writing_1 como sub-niveles.
  writing_1:[{n:1,l:'Básico (MAYÚS con guía)'},{n:3,l:'Avanzado (minús con guía)'},{n:2,l:'Master sin guía MAYÚS'},{n:4,l:'Master sin guía minús'}],
  writing_3:[{n:3,l:'Con guía minús'},{n:4,l:'Libre minús'}],
  // Palabras — Básico mayús cortas guía, Avanzado minús con guía, Master sin guía.
  writing_5:[{n:5,l:'Básico (MAYÚS con guía)'},{n:52,l:'Avanzado (minús con guía)'},{n:51,l:'Master sin guía MAYÚS'},{n:53,l:'Master sin guía minús'}],
  writing_52:[{n:52,l:'Con guía minús'},{n:53,l:'Libre minús'}],
  // Frases — Avanzado mayús cortas guía, Master mayús/minús sin guía hasta 8 palabras
  writing_6:[{n:6,l:'Avanzado (MAYÚS cortas con guía)'},{n:61,l:'Master sin guía'},{n:62,l:'Master minús con guía'},{n:63,l:'Master minús sin guía'}],
  writing_62:[{n:62,l:'Con guía minús'},{n:63,l:'Libre minús'}],
  // Mis frases — perfil del niño + extras del supervisor. Solo Master.
  writing_misfrases:[{n:7,l:'MAYÚS con guía'},{n:71,l:'MAYÚS sin guía'},{n:72,l:'minús con guía'},{n:73,l:'minús sin guía'}],
  // Niveles legacy 1-8 (Intruso simple, Palabra+Imagen, Completa palabra, etc.)
  lee_intruso:[{n:1,l:'Básico (legacy)'},{n:21,l:'Básico'},{n:22,l:'Avanzado'},{n:23,l:'Master'}],
  lee_word_img:[{n:2,l:'Palabra+Imagen'}],
  lee_complete:[{n:3,l:'Letra que falta (legacy)'}],
  lee_syllables:[{n:4,l:'Ordena sílabas'}],
  lee_read_do:[{n:5,l:'Lee y haz'}],
  lee_prep1:[{n:6,l:'1 preposición'}],
  lee_prep2:[{n:7,l:'2 preposiciones'}],
  lee_prep3:[{n:8,l:'3 preposiciones'}],
  // Nuevos lvKeys del Bloque 5 — Lee y entiende + COMPLETA con conectores
  // (corpus en src/data/leeYEntiende.js y completa.js, doc §4.12.1/§4.12.3).
  lee_completa:[{n:24,l:'Básico'},{n:25,l:'Avanzado'},{n:26,l:'Master'}],
  lee_y_entiende:[{n:27,l:'Master'}],
  // Tiempo y medidas (GROUPS_V2): contenedor virtual que agrupa los lvs
  // de clock/calendar/termometro. Cuando el supervisor activa este lvKey,
  // App.jsx lo expande a los lvs reales {clock:[1..3], calendar:[1..3],
  // razona_temperatura:[13]} en la sesión.
  tiempo_medidas:[{n:1,l:'Hora'},{n:2,l:'Calendario'},{n:3,l:'Termómetro'}],
  // Ciencias Naturales Básico — piloto (Doc 27/04). 9 láminas con 4 modos
  // (estudio/presentación/rellena1/rellena2). Solo accesible si flag
  // toki_ciencias_piloto está activo en localStorage.
  ciencias_nat_basico:[{n:1,l:'Mini 1 — Cuerpo humano'},{n:2,l:'Mini 2 — Animales'},{n:3,l:'Mini 3 — Plantas y comida'},{n:4,l:'Mini 4 — Sentidos y entorno'}],
};

export const GROUPS=[
  {id:'aprende',name:'APRENDE',emoji:'📚',color:'#E91E63',desc:'Presentaciones y estudio',dynamic:true,modules:[
    {k:'quiensoy',l:'Quién Soy',defLv:[1,2],lvKey:'pres_0',presIdx:0}]},
  {id:'dilo',name:'DILO',emoji:'🎤',color:GREEN,desc:'Todo lo de hablar',modules:[
    {k:'decir',l:'Aprende a decirlo',defLv:1,lvKey:'decir'},
    {k:'misfrases_dilo',l:'Mis frases',defLv:1,lvKey:'misfrases_dilo'},
    {k:'frase',l:'Forma la frase',defLv:1,lvKey:'frase'},
    {k:'contar',l:'Cuenta conmigo',defLv:1,lvKey:'contar'}]},
  {id:'cuenta',name:'CUENTA',emoji:'🧮',color:'#E67E22',desc:'Todo lo de números',modules:[
    {k:'math',l:'Sumas y Restas',defLv:5,lvKey:'math'},
    {k:'multi',l:'Multiplicaciones',defLv:1,lvKey:'multi'},
    {k:'frac',l:'Fracciones',defLv:1,lvKey:'frac'},
    {k:'razona',l:'Series numéricas',defLv:9,lvKey:'razona_numeros'},
    {k:'razona',l:'Compara cantidades',defLv:10,lvKey:'razona_compara'},
    {k:'razona',l:'Anterior y posterior',defLv:12,lvKey:'razona_anterior_posterior'},
    {k:'razona',l:'Termómetro',defLv:13,lvKey:'razona_temperatura'},
    {k:'money',l:'Monedas y Billetes',defLv:1,lvKey:'money'},
    {k:'clock',l:'La Hora',defLv:1,lvKey:'clock'},
    {k:'calendar',l:'Calendario',defLv:1,lvKey:'calendar'},
    {k:'distribute',l:'Reparte y Cuenta',defLv:1,lvKey:'distribute'}]},
  {id:'razona',name:'RAZONA',emoji:'🧠',color:BLUE,desc:'Lógica y razonamiento',modules:[
    {k:'razona',l:'¿Dónde está?',defLv:1,lvKey:'razona_spatial'},
    {k:'razona',l:'Series',defLv:6,lvKey:'razona_series'},
    {k:'razona',l:'Piensa',defLv:4,lvKey:'razona_piensa'},
    {k:'razona',l:'Clasifica',defLv:3,lvKey:'razona_clasifica'},
    {k:'razona',l:'Emociones',defLv:5,lvKey:'razona_emociones'},
    {k:'razona',l:'Ordena rutinas',defLv:11,lvKey:'razona_secuencias'}]},
  {id:'escribe',name:'ESCRIBE',emoji:'✏️',color:PURPLE,desc:'Caligrafía y escritura',modules:[
    {k:'writing',l:'Escritura',defLv:1,lvKey:'writing_1'}]},
  {id:'lee',name:'LEE',emoji:'📖',color:'#E91E63',desc:'Lectura y comprensión',modules:[
    {k:'lee',l:'Intruso',defLv:1,lvKey:'lee_intruso'},
    {k:'lee',l:'Palabra+Imagen',defLv:2,lvKey:'lee_word_img'},
    {k:'lee',l:'Completa',defLv:3,lvKey:'lee_complete'},
    {k:'lee',l:'Ordena sílabas',defLv:4,lvKey:'lee_syllables'},
    {k:'lee',l:'Lee y haz',defLv:5,lvKey:'lee_read_do'},
    {k:'lee',l:'Preposiciones 1',defLv:6,lvKey:'lee_prep1'},
    {k:'lee',l:'Preposiciones 2',defLv:7,lvKey:'lee_prep2'},
    {k:'lee',l:'Preposiciones 3',defLv:8,lvKey:'lee_prep3'}]},
];

// === GROUPS_V2 — capa 2 alineada con TOKI-planetas-completo.xlsx (27/04) ==
// Activable con feature flag toki_layout_v2 = true en localStorage.
// Si está activo, App.jsx usa GROUPS_V2 en lugar de GROUPS.
//
// Estructura definitiva del xlsx (fuente de verdad):
//   DILO (4): Aprende a decirlo · Forma la frase · Cuenta conmigo · Mis frases
//   APRENDE (6): Presentaciones · Ciencias Naturales · Ciencias Sociales ·
//                Hora · Calendario · Termómetro
//   CUENTA (7): Números y series · Sumas y restas · Comparar ·
//               Multiplicaciones · Fracciones · Poner y repartir · Monedas
//   RAZONA (6): ¿Dónde está? · Series lógicas · Piensa · Emociones ·
//               Clasifica · Ordena rutinas
//   LEE (3): LEE · INTRUSO · COMPLETA
//   ESCRIBE (4): Letras · Palabras · Frases · Mis frases
//
// Cada celda del xlsx (Básico / Avanzado / Master) corresponde a un nivel
// interno (lv) en LV_OPTS. El supervisor activa los toggles que quiera.
// Capa 1 (preset global) = atajo que activa columna entera.
// Capa 2 (toggles individuales) = grano fino combinable.
export const GROUPS_V2 = [
  {id:'aprende',name:'APRENDE',emoji:'📚',color:'#E91E63',desc:'Presentaciones, ciencias y tiempo',dynamic:true,modules:[
    {k:'quiensoy',l:'Presentaciones',defLv:[1,2],lvKey:'pres_0',presIdx:0},
    // Ciencias Naturales: piloto Básico (9 láminas) si toki_ciencias_piloto
    // activo. Pendiente: 8 minis adicionales (Avanzado + Master) cuando
    // estén las imágenes (44 láminas restantes).
    {k:'ciencias_nat',l:'Ciencias Naturales',defLv:1,lvKey:'ciencias_nat_basico',pilot:'ciencias'},
    // Ciencias Sociales: pendiente todas las imágenes (12 minis × 2-3 láminas)
    {k:'ciencias_soc',l:'Ciencias Sociales',defLv:1,lvKey:'ciencias_soc',disabled:true},
    // Hora / Calendario / Termómetro: entradas separadas según xlsx,
    // no agrupadas en "Tiempo y medidas". Cada una con sus 3 niveles.
    {k:'clock',l:'Hora',defLv:1,lvKey:'clock'},
    {k:'calendar',l:'Calendario',defLv:1,lvKey:'calendar'},
    {k:'razona',l:'Termómetro',defLv:13,lvKey:'razona_temperatura'},
  ]},
  {id:'dilo',name:'DILO',emoji:'🎤',color:GREEN,desc:'Todo lo de hablar',modules:[
    {k:'decir',l:'Aprende a decirlo',defLv:1,lvKey:'decir'},
    {k:'frase',l:'Forma la frase',defLv:1,lvKey:'frase'},
    {k:'contar',l:'Cuenta conmigo',defLv:1,lvKey:'contar'},
    {k:'misfrases_dilo',l:'Mis frases',defLv:1,lvKey:'misfrases_dilo'},
  ]},
  {id:'cuenta',name:'CUENTA',emoji:'🧮',color:'#E67E22',desc:'Todo lo de números',modules:[
    // Números y series — fusiona series numéricas y anterior/posterior
    // (4 niveles xlsx: Posterior 10/20, Anterior+Posterior 20, Series N1-N4)
    {k:'razona',l:'Números y series',defLv:9,lvKey:'razona_numeros'},
    // Sumas y restas — math contiene los 7 modos del xlsx
    {k:'math',l:'Sumas y restas',defLv:5,lvKey:'math'},
    // Comparar — entrada propia (xlsx la separa de Sumas)
    {k:'razona',l:'Comparar',defLv:10,lvKey:'razona_compara'},
    {k:'multi',l:'Multiplicaciones',defLv:1,lvKey:'multi'},
    {k:'frac',l:'Fracciones',defLv:1,lvKey:'frac'},
    // Poner y repartir — fusiona Poner + Repartir según xlsx
    {k:'distribute',l:'Poner y repartir',defLv:1,lvKey:'distribute'},
    {k:'money',l:'Monedas',defLv:1,lvKey:'money'},
  ]},
  {id:'razona',name:'RAZONA',emoji:'🧠',color:BLUE,desc:'Lógica y razonamiento',modules:[
    {k:'razona',l:'¿Dónde está?',defLv:1,lvKey:'razona_spatial'},
    {k:'razona',l:'Series lógicas',defLv:6,lvKey:'razona_series'},
    {k:'razona',l:'Piensa',defLv:4,lvKey:'razona_piensa'},
    {k:'razona',l:'Emociones',defLv:5,lvKey:'razona_emociones'},
    {k:'razona',l:'Clasifica',defLv:3,lvKey:'razona_clasifica'},
    {k:'razona',l:'Ordena rutinas',defLv:11,lvKey:'razona_secuencias'},
  ]},
  // ESCRIBE — 4 entradas según xlsx: Letras, Palabras, Frases, Mis frases.
  // Cada una con 3 columnas (B/A/M) en LV_OPTS. Los lvKeys writing_*
  // existentes ya cubren bien la matriz; se mantienen.
  {id:'escribe',name:'ESCRIBE',emoji:'✏️',color:PURPLE,desc:'Caligrafía y escritura',modules:[
    {k:'writing',l:'Letras',defLv:1,lvKey:'writing_1'},
    {k:'writing',l:'Palabras',defLv:5,lvKey:'writing_5'},
    {k:'writing',l:'Frases',defLv:6,lvKey:'writing_6'},
    {k:'writing',l:'Mis frases',defLv:7,lvKey:'writing_misfrases'},
  ]},
  // LEE — 3 entradas según xlsx. Cada una con sus niveles B/A/M en LV_OPTS.
  {id:'lee',name:'LEE',emoji:'📖',color:'#E91E63',desc:'Lectura y comprensión',modules:[
    {k:'lee',l:'LEE',defLv:2,lvKey:'lee_word_img'},
    {k:'lee',l:'INTRUSO',defLv:21,lvKey:'lee_intruso'},
    {k:'lee',l:'COMPLETA',defLv:24,lvKey:'lee_completa'},
  ]},
];

// 🌱🌿🌳 Competency level presets — configure all modules at once
export const LEVEL_PRESETS = {
  basica: {
    label: '🌱 Básica', desc: 'Presentarse, pedir necesidades, contar hasta 20, monedas básicas',
    active: {
      pres_0:true,decir:true,misfrases_dilo:true,frase:false,contar:true,
      math:true,multi:false,frac:false,
      razona_spatial:true,razona_series:false,razona_piensa:true,razona_clasifica:true,razona_emociones:true,razona_numeros:false,razona_compara:false,razona_secuencias:true,razona_anterior_posterior:true,razona_temperatura:false,
      money:true,clock:true,calendar:true,distribute:false,
      writing_1:true,
      lee_intruso:true,lee_word_img:true,lee_complete:false,lee_syllables:false,lee_read_do:false,lee_prep1:false,lee_prep2:false,lee_prep3:false,
    },
    levels: {decir:[1,2],contar:[1],math:[5,6],money:[1],clock:[1],calendar:[1],razona_spatial:[1],razona_piensa:[4],razona_clasifica:[3],razona_emociones:[5],razona_secuencias:[11],razona_anterior_posterior:[12],writing_1:[1],lee_intruso:[1],lee_word_img:[2]},
  },
  avanzada: {
    label: '🌿 Avanzada', desc: 'Comprar, transporte, médico, sumas, reloj completo',
    active: {
      pres_0:true,decir:true,misfrases_dilo:true,frase:true,contar:true,
      math:true,multi:false,frac:false,
      razona_spatial:true,razona_series:true,razona_piensa:true,razona_clasifica:true,razona_emociones:true,razona_numeros:true,razona_compara:true,razona_secuencias:true,razona_anterior_posterior:true,razona_temperatura:true,
      money:true,clock:true,calendar:true,distribute:true,
      writing_1:true,
      lee_intruso:true,lee_word_img:true,lee_complete:true,lee_syllables:true,lee_read_do:true,lee_prep1:true,lee_prep2:true,lee_prep3:false,
    },
    levels: {decir:[2,3],contar:[1,2,3],math:[5,6,7,1,2],money:[1,2,3],clock:[1,2,3],calendar:[1,2,3,4],razona_spatial:[1,2],razona_series:[6,7],razona_piensa:[4],razona_clasifica:[3],razona_emociones:[5],razona_numeros:[9],razona_compara:[10],razona_secuencias:[11],razona_anterior_posterior:[12],razona_temperatura:[13],frase:[1,2],distribute:[1,2],writing_1:[1,3,5],lee_intruso:[1],lee_word_img:[2],lee_complete:[3],lee_syllables:[4],lee_read_do:[5],lee_prep1:[6],lee_prep2:[7]},
  },
  master: {
    label: '🌳 Master', desc: 'Frases largas, multiplicar, fracciones, autonomía total',
    active: {
      pres_0:true,decir:true,misfrases_dilo:true,frase:true,contar:true,
      math:true,multi:true,frac:true,
      razona_spatial:true,razona_series:true,razona_piensa:true,razona_clasifica:true,razona_emociones:true,razona_numeros:true,razona_compara:true,razona_secuencias:true,razona_anterior_posterior:true,razona_temperatura:true,
      money:true,clock:true,calendar:true,distribute:true,
      writing_1:true,
      lee_intruso:true,lee_word_img:true,lee_complete:true,lee_syllables:true,lee_read_do:true,lee_prep1:true,lee_prep2:true,lee_prep3:true,
    },
    levels: {decir:[3,4,5],contar:[1,2,3,4],math:[1,2,3,4,7],multi:[1,2,3],frac:[1,2,3],money:[1,2,3,4],clock:[1,2,3],calendar:[1,2,3,4],razona_spatial:[1,2],razona_series:[6,7,8],razona_piensa:[4],razona_clasifica:[3],razona_emociones:[5],razona_numeros:[9],razona_compara:[10],razona_secuencias:[11],razona_anterior_posterior:[12],razona_temperatura:[13],frase:[1,2,3],distribute:[1,2,3],writing_1:[1,2,3,4,5,6],lee_intruso:[1],lee_word_img:[2],lee_complete:[3],lee_syllables:[4],lee_read_do:[5],lee_prep1:[6],lee_prep2:[7],lee_prep3:[8]},
  },
};
