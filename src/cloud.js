// ============================================================
// TOKI · Cloud Sync & Image Processing
// ============================================================
import { hasConfig, db, fbSaveProfile, fbGetProfile, fbListUsers, fbRevokeUser, fbUnrevokeUser } from './firebase.js'

// ===== IMAGE PROCESSING — resize, compress, validate =====
export function processImage(file){return new Promise((resolve,reject)=>{
  if(!file)return reject('No file');
  if(!['image/jpeg','image/png'].includes(file.type))return reject('Solo JPEG o PNG');
  if(file.size>5*1024*1024)return reject('Archivo demasiado grande (máx 5MB)');
  const reader=new FileReader();
  reader.onerror=()=>reject('Error leyendo archivo');
  reader.onload=()=>{
    const img=new Image();
    img.onerror=()=>reject('Error cargando imagen');
    img.onload=()=>{
      const MAX=200;
      let w=img.width,h=img.height;
      if(w>MAX||h>MAX){const r=Math.min(MAX/w,MAX/h);w=Math.round(w*r);h=Math.round(h*r)}
      const c=document.createElement('canvas');c.width=w;c.height=h;
      const ctx=c.getContext('2d');ctx.drawImage(img,0,0,w,h);
      const b64=c.toDataURL('image/jpeg',0.6);
      // Check final size (base64 is ~33% larger than binary)
      const approxBytes=Math.ceil(b64.length*3/4);
      if(approxBytes>500*1024)return reject('Imagen demasiado grande tras comprimir');
      resolve(b64)};
    img.src=reader.result};
  reader.readAsDataURL(file)})}

// ===== CLOUD SYNC — Firestore save/load profile data =====
export async function cloudSaveProfile(uid,profileData){
  if(!hasConfig||!db||!uid)return;
  try{await fbSaveProfile(uid,{profiles:profileData.profiles||[],personas:profileData.personas||[],email:profileData.email||''});
  }catch(e){console.warn('[Toki Cloud] Save error:',e)}}

export async function cloudLoadProfile(uid){
  if(!hasConfig||!db||!uid)return null;
  try{return await fbGetProfile(uid);
  }catch(e){console.warn('[Toki Cloud] Load error:',e);return null}}

export async function cloudListUsers(){
  if(!hasConfig||!db)return[];
  try{return await fbListUsers();
  }catch(e){console.warn('[Toki Cloud] List error:',e);return[]}}

export async function cloudRevokeUser(uid){
  if(!hasConfig||!db||!uid)return;
  try{await fbRevokeUser(uid);
  }catch(e){console.warn('[Toki Cloud] Revoke error:',e)}}

export async function cloudUnrevokeUser(uid){
  if(!hasConfig||!db||!uid)return;
  try{await fbUnrevokeUser(uid);
  }catch(e){console.warn('[Toki Cloud] Unrevoke error:',e)}}

export function generateAutoPresentation(u,personas){
  // Returns {lines, slides} where slides have optional photo from personas
  const lines=[];const slides=[];
  const myP=(personas||[]).filter(pp=>pp.name&&pp.name.trim());
  const padre=myP.find(pp=>pp.relation==='Padre');
  const madre=myP.find(pp=>pp.relation==='Madre');
  const herms=myP.filter(pp=>pp.relation==='Hermano'||pp.relation==='Hermana');
  const amigos=myP.filter(pp=>pp.relation==='Amigo'||pp.relation==='Amiga');
  // Slide helper: text + optional photo from persona
  function add(text,photo){lines.push(text);slides.push({text,img:photo||null,picto:null})}
  add('Hola, me llamo '+(u.name||''),u.photo||null);
  if(u.apellidos)add('Me apellido '+u.apellidos,u.photo||null);
  if(padre)add('Mi padre se llama '+padre.name,padre.photo||null);
  if(madre)add('Mi madre se llama '+madre.name,madre.photo||null);
  if(herms.length===1){const fem=herms[0].relation==='Hermana';add((fem?'Mi hermana':'Mi hermano')+' se llama '+herms[0].name,herms[0].photo||null)}
  else if(herms.length>1)add('Tengo '+herms.length+' hermanos: '+herms.map(h=>h.name).join(', '),herms[0]?.photo||null);
  if(amigos.length===1){const fem=amigos[0].relation==='Amiga';add((fem?'Mi mejor amiga es ':'Mi mejor amigo es ')+amigos[0].name,amigos[0].photo||null)}
  else if(amigos.length>1)add('Tengo '+amigos.length+' amigos',amigos[0]?.photo||null);
  if(u.direccion)add('Vivo en '+u.direccion,null);
  if(u.colegio)add('Voy al cole en '+u.colegio,null);
  if(u.telefono)add('El teléfono de emergencia es '+u.telefono,null);
  return{lines,slides};
}
