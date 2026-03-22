// Firebase config for Toki App
// Without env vars = app works 100% offline with localStorage only.

export const hasConfig = !!(
  import.meta.env.VITE_FB_API_KEY &&
  import.meta.env.VITE_FB_PROJECT_ID
);

// All exports are null when no config — App.jsx checks hasConfig before calling anything
export let app = null;
export let auth = null;
export let db = null;
export let storage = null;
export let fbFns = {};

// Call this once on app start if hasConfig is true
export async function initFirebase() {
  if (!hasConfig || app) return;
  try {
    const { initializeApp } = await import('firebase/app');
    const authMod = await import('firebase/auth');
    const fsMod = await import('firebase/firestore');
    const storageMod = await import('firebase/storage');
    const cfg = {
      apiKey: import.meta.env.VITE_FB_API_KEY,
      authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FB_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FB_MSG_SENDER_ID,
      appId: import.meta.env.VITE_FB_APP_ID,
    };
    app = initializeApp(cfg);
    auth = authMod.getAuth(app);
    db = fsMod.getFirestore(app);
    storage = storageMod.getStorage(app);
    fbFns = {
      signInWithEmailAndPassword: authMod.signInWithEmailAndPassword,
      createUserWithEmailAndPassword: authMod.createUserWithEmailAndPassword,
      signOut: authMod.signOut,
      onAuthStateChanged: authMod.onAuthStateChanged,
      doc: fsMod.doc,
      getDoc: fsMod.getDoc,
      setDoc: fsMod.setDoc,
      updateDoc: fsMod.updateDoc,
    };
  } catch (e) {
    console.warn('Firebase init failed:', e);
  }
}
