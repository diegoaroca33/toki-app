// Firebase config for Toki App
// Uses Vite env vars (VITE_ prefix). Set them in .env.local or Vercel dashboard.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY || '',
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FB_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FB_MSG_SENDER_ID || '',
  appId: import.meta.env.VITE_FB_APP_ID || '',
};

const hasConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null, auth = null, db = null, storage = null;
let signInWithEmailAndPassword = null, createUserWithEmailAndPassword = null, signOut = null, onAuthStateChanged = null;
let doc = null, getDoc = null, setDoc = null, updateDoc = null;

if (hasConfig) {
  const { initializeApp } = await import('firebase/app');
  const authMod = await import('firebase/auth');
  const fsMod = await import('firebase/firestore');
  const storageMod = await import('firebase/storage');
  app = initializeApp(firebaseConfig);
  auth = authMod.getAuth(app);
  db = fsMod.getFirestore(app);
  storage = storageMod.getStorage(app);
  signInWithEmailAndPassword = authMod.signInWithEmailAndPassword;
  createUserWithEmailAndPassword = authMod.createUserWithEmailAndPassword;
  signOut = authMod.signOut;
  onAuthStateChanged = authMod.onAuthStateChanged;
  doc = fsMod.doc;
  getDoc = fsMod.getDoc;
  setDoc = fsMod.setDoc;
  updateDoc = fsMod.updateDoc;
}

export { app, auth, db, storage, hasConfig, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, doc, getDoc, setDoc, updateDoc };
