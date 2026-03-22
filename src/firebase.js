// Firebase config for Toki App
// Uses Vite env vars (VITE_ prefix). Set them in .env.local or Vercel dashboard.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY || '',
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FB_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FB_MSG_SENDER_ID || '',
  appId: import.meta.env.VITE_FB_APP_ID || '',
};

// Only initialize if config is provided (cloud mode)
let app = null, auth = null, db = null, storage = null;
const hasConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
if (hasConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, hasConfig };
