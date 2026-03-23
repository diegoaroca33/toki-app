// ============================================================
// TOKI · Firebase Configuration
// © 2026 Diego Aroca. Todos los derechos reservados.
// ============================================================
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCyhnUMPzjImUa34rFKagE-eg6BGVfXty4",
  authDomain: "toki-app-58635.firebaseapp.com",
  projectId: "toki-app-58635",
  storageBucket: "toki-app-58635.firebasestorage.app",
  messagingSenderId: "543708976332",
  appId: "1:543708976332:web:1387bdffc6d318a1301e69",
  measurementId: "G-P7XLVZ13MQ"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const hasConfig = true

// ---- Auth helpers ----
export async function fbSignIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function fbSignUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function fbSignOut() {
  return signOut(auth)
}

const googleProvider = new GoogleAuthProvider()
export async function fbSignInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export function fbOnAuth(cb) {
  return onAuthStateChanged(auth, cb)
}

// ---- Firestore helpers ----
export async function fbGetProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export async function fbSaveProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), { ...data, updatedAt: new Date().toISOString() }, { merge: true })
}

export async function fbUpdateProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: new Date().toISOString() })
}

export async function fbListUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }))
}

export async function fbRevokeUser(uid) {
  await updateDoc(doc(db, 'users', uid), { revoked: true, revokedAt: new Date().toISOString() })
}

export async function fbUnrevokeUser(uid) {
  await updateDoc(doc(db, 'users', uid), { revoked: false })
}

// ---- Storage helpers ----
const MAX_PHOTO_SIZE = 200 // px - resize photos to 200x200 max
const JPEG_QUALITY = 0.6

// Compress image before upload
export function compressImage(file, maxSize = MAX_PHOTO_SIZE, quality = JPEG_QUALITY) {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width, h = img.height
        if (w > h) { if (w > maxSize) { h = h * maxSize / w; w = maxSize } }
        else { if (h > maxSize) { w = w * maxSize / h; h = maxSize } }
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob(resolve, 'image/jpeg', quality)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export async function fbUploadPhoto(uid, path, file) {
  // Compress if it's an image
  let blob = file
  if (file.type && file.type.startsWith('image/')) {
    blob = await compressImage(file)
  }
  const sRef = storageRef(storage, `users/${uid}/${path}`)
  await uploadBytes(sRef, blob)
  return getDownloadURL(sRef)
}

export async function fbUploadVoice(uid, path, blob) {
  const sRef = storageRef(storage, `users/${uid}/voices/${path}`)
  await uploadBytes(sRef, blob)
  return getDownloadURL(sRef)
}

export async function fbDeleteFile(uid, path) {
  try {
    const sRef = storageRef(storage, `users/${uid}/${path}`)
    await deleteObject(sRef)
  } catch (e) { console.warn('[Toki] Delete file error:', e) }
}

export async function fbGetFileURL(uid, path) {
  try {
    const sRef = storageRef(storage, `users/${uid}/${path}`)
    return await getDownloadURL(sRef)
  } catch { return null }
}

// Calculate storage usage for a user
export async function fbGetStorageUsage(uid) {
  try {
    const sRef = storageRef(storage, `users/${uid}`)
    const list = await listAll(sRef)
    // Note: listAll doesn't give sizes, we'd need metadata calls
    return { fileCount: list.items.length + list.prefixes.length }
  } catch { return { fileCount: 0 } }
}

// Storage limit per user in bytes (3MB)
export const STORAGE_LIMIT = 3 * 1024 * 1024

// Export Firestore functions for direct use
export const fbFns = { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc, query, where }
