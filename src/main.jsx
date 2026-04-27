import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { track } from './firebase.js'

// === Branding del entorno: si build con VITE_IS_TEST=true, mostramos
// "Toki Test" en el título de pestaña, theme-color naranja y manifest
// PWA distinto. La instalación PWA usa el manifest que esté declarado
// en el momento de la instalación: lo cambiamos lo antes posible. ===
;(function applyEnvBranding(){
  try{
    const isTest = import.meta.env.VITE_IS_TEST === 'true';
    if (!isTest) return;
    document.title = 'Toki Test — Pruebas';
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.setAttribute('content', '#FF6B00');
    const apple = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (apple) apple.setAttribute('content', 'Toki Test');
    const m = document.querySelector('link[rel="manifest"]');
    if (m) m.setAttribute('href', '/manifest-test.json');
  }catch(e){console.warn('[applyEnvBranding] error', e)}
})();

class ErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={hasError:false}}
  static getDerivedStateFromError(){return{hasError:true}}
  componentDidCatch(err,info){
    console.error('[Toki] Error boundary caught:',err,info)
    track('app_error',{message:String(err?.message||'unknown').slice(0,100),component:info?.componentStack?.slice(0,100)||''})
  }
  render(){
    if(this.state.hasError)return <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#080C18',color:'#F0C850',fontFamily:"'Fredoka',sans-serif",padding:24,textAlign:'center'}}>
      <div style={{fontSize:64,marginBottom:16}}>🐾</div>
      <h1 style={{fontSize:28,margin:'0 0 12px'}}>Ups, algo ha fallado</h1>
      <p style={{fontSize:16,color:'#aaa',margin:'0 0 24px'}}>Toki necesita reiniciarse</p>
      <button onClick={()=>window.location.reload()} style={{fontSize:20,padding:'14px 32px',borderRadius:16,border:'none',background:'#F0C850',color:'#1a1a2e',fontWeight:700,fontFamily:"'Fredoka'",cursor:'pointer'}}>Reiniciar Toki</button>
    </div>;
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<ErrorBoundary><App /></ErrorBoundary>)
