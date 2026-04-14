// ============================================================
// TOKI · Firebase Configuration
// © 2026 Diego Aroca. Todos los derechos reservados.
// ============================================================
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc, query, where, orderBy } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics'

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

// Analytics — initialized async (not all browsers support it)
let analytics = null
isSupported().then(ok => { if(ok) analytics = getAnalytics(app) }).catch(() => {})

/**
 * Central tracking function. Sends event to Firebase Analytics.
 * Safe to call even if analytics is not available (guest mode, unsupported browser).
 * @param {string} event - Event name (snake_case, max 40 chars)
 * @param {Object} params - Event parameters (values must be string/number/boolean)
 */
export function track(event, params = {}) {
  try {
    if(analytics) logEvent(analytics, event, { ...params, app_version: 'v25.13' })
  } catch(e) { /* silent — analytics should never break the app */ }
}

/**
 * Save daily metrics summary to Firestore.
 * Merges with existing data for the same day (multiple sessions).
 */
export async function saveDailyMetrics(uid, metrics) {
  if(!hasConfig || !db || !uid) return
  try {
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const docRef = doc(db, 'daily_metrics', uid + '_' + today)
    const existing = await getDoc(docRef)
    if(existing.exists()) {
      const prev = existing.data()
      await setDoc(docRef, {
        uid,
        date: today,
        sessions: (prev.sessions || 0) + 1,
        ok: (prev.ok || 0) + (metrics.ok || 0),
        sk: (prev.sk || 0) + (metrics.sk || 0),
        totalMin: (prev.totalMin || 0) + (metrics.min || 0),
        stars: (prev.stars || 0) + (metrics.stars || 0),
        topModule: metrics.module || prev.topModule || '',
        streak: metrics.streak || prev.streak || 0,
        updatedAt: new Date().toISOString()
      })
    } else {
      await setDoc(docRef, {
        uid,
        date: today,
        sessions: 1,
        ok: metrics.ok || 0,
        sk: metrics.sk || 0,
        totalMin: metrics.min || 0,
        stars: metrics.stars || 0,
        topModule: metrics.module || '',
        streak: metrics.streak || 0,
        updatedAt: new Date().toISOString()
      })
    }
  } catch(e) { console.warn('[Toki] saveDailyMetrics error:', e) }
}

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
  try {
    // Try popup first (works on desktop)
    return await signInWithPopup(auth, googleProvider)
  } catch (e) {
    // If popup blocked/failed, fall back to redirect (mobile, PWA, embedded browsers)
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
      return signInWithRedirect(auth, googleProvider)
    }
    throw e
  }
}

// Handle redirect result on page load (needed for signInWithRedirect flow)
getRedirectResult(auth).catch(() => {})

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

// ---- Shared profiles ----
// 6-char code: 3 letters from name + 3 digits (no separator, easier to type for DI users)
function generateShareCode(name) {
  const clean = (name || 'TOK').toUpperCase().replace(/[^A-Z]/g, '')
  const prefix = (clean + 'TOK').substring(0, 3)
  const num = Math.floor(100 + Math.random() * 900)
  return `${prefix}${num}`
}

export async function fbCreateShareCode(ownerUid, profileId, profileName) {
  const code = generateShareCode(profileName)
  await setDoc(doc(db, 'shared_profiles', code), {
    ownerUid,
    profileId,
    profileName,
    createdAt: new Date().toISOString(),
    linkedUsers: []
  })
  return code
}

export async function fbGetSharedProfile(code) {
  const snap = await getDoc(doc(db, 'shared_profiles', code.toUpperCase()))
  return snap.exists() ? { code: snap.id, ...snap.data() } : null
}

export async function fbLinkToSharedProfile(code, userUid, userEmail) {
  const ref = doc(db, 'shared_profiles', code.toUpperCase())
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data()
  const linked = data.linkedUsers || []
  if (!linked.find(u => u.uid === userUid)) {
    linked.push({ uid: userUid, email: userEmail, linkedAt: new Date().toISOString() })
    await updateDoc(ref, { linkedUsers: linked })
  }
  // Return owner's profile data
  const ownerData = await fbGetProfile(data.ownerUid)
  return { ...data, ownerData }
}

export async function fbRevokeShareLink(code, userUid) {
  const ref = doc(db, 'shared_profiles', code.toUpperCase())
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data()
  const linked = (data.linkedUsers || []).filter(u => u.uid !== userUid)
  await updateDoc(ref, { linkedUsers: linked })
}

// ---- Public voices ----
// Collection: public_voices/{phraseKey}
// Document fields: { phrase, audioURL, speakerName, speakerAge, speakerSex, duration, uploadedBy, uploadedAt, moduleKey }

export async function fbUploadPublicVoice(uid, phraseKey, blob, metadata) {
  const sRef = storageRef(storage, `public_voices/${phraseKey}/${uid}.webm`)
  await uploadBytes(sRef, blob)
  const audioURL = await getDownloadURL(sRef)
  const docId = `${phraseKey}_${uid}`
  await setDoc(doc(db, 'public_voices', docId), {
    phraseKey,
    phrase: metadata.phrase || '',
    audioURL,
    speakerName: metadata.speakerName || '',
    speakerAge: metadata.speakerAge || 0,
    speakerSex: metadata.speakerSex || 'm',
    duration: metadata.duration || 0,
    uploadedBy: uid,
    uploadedAt: new Date().toISOString(),
    moduleKey: metadata.moduleKey || ''
  })
  return audioURL
}

export async function fbGetPublicVoices(phraseKey) {
  const q2 = query(collection(db, 'public_voices'), where('phraseKey', '==', phraseKey))
  const snap = await getDocs(q2)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function fbGetBestVoice(phraseKey, userSex, userAge) {
  const voices = await fbGetPublicVoices(phraseKey)
  if (!voices.length) return null
  // Same gender first, then closest age
  const sameSex = voices.filter(v => v.speakerSex === userSex)
  const pool = sameSex.length ? sameSex : voices
  pool.sort((a, b) => Math.abs((a.speakerAge || 12) - (userAge || 12)) - Math.abs((b.speakerAge || 12) - (userAge || 12)))
  return pool[0]?.audioURL || null
}

// Get count of public voices uploaded by a user
export async function fbGetMyPublicVoiceCount(uid) {
  if (!db || !uid) return 0
  try {
    const q2 = query(collection(db, 'public_voices'), where('uploadedBy', '==', uid))
    const snap = await getDocs(q2)
    return snap.size
  } catch (e) { return 0 }
}

// Delete ALL public voices uploaded by a user (revoke consent)
export async function fbDeleteMyPublicVoices(uid) {
  if (!db || !storage || !uid) return 0
  try {
    const q2 = query(collection(db, 'public_voices'), where('uploadedBy', '==', uid))
    const snap = await getDocs(q2)
    let deleted = 0
    for (const d2 of snap.docs) {
      const data = d2.data()
      // Delete from Storage
      try {
        const sRef = storageRef(storage, `public_voices/${data.phraseKey}/${uid}.webm`)
        await deleteObject(sRef)
      } catch (e) {}
      // Delete Firestore doc
      await deleteDoc(d2.ref)
      deleted++
    }
    return deleted
  } catch (e) { console.warn('[Toki] Delete public voices error:', e); return 0 }
}

export async function fbUploadUserVoice(uid, phraseKey, blob) {
  const sRef = storageRef(storage, `users/${uid}/voices/${phraseKey}.webm`)
  await uploadBytes(sRef, blob)
  return getDownloadURL(sRef)
}

// ---- Voice validation helpers ----

export function trimSilence(audioBlob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const buffer = await ctx.decodeAudioData(reader.result)
        const data = buffer.getChannelData(0)
        const threshold = 0.01
        let start = 0, end = data.length - 1
        // Find first sample above threshold
        while (start < data.length && Math.abs(data[start]) < threshold) start++
        // Find last sample above threshold
        while (end > start && Math.abs(data[end]) < threshold) end--
        // Add small padding (50ms)
        const pad = Math.floor(buffer.sampleRate * 0.05)
        start = Math.max(0, start - pad)
        end = Math.min(data.length - 1, end + pad)
        const trimmedLength = end - start + 1
        const trimmedBuffer = ctx.createBuffer(1, trimmedLength, buffer.sampleRate)
        trimmedBuffer.getChannelData(0).set(data.subarray(start, end + 1))
        // Encode back to blob via MediaRecorder offline rendering
        const dest = ctx.createMediaStreamDestination()
        const src = ctx.createBufferSource()
        src.buffer = trimmedBuffer
        src.connect(dest)
        const mr = new MediaRecorder(dest.stream, {
          mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm'
        })
        const chunks = []
        mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
        mr.onstop = () => {
          const trimmedBlob = new Blob(chunks, { type: 'audio/webm' })
          ctx.close()
          resolve(trimmedBlob)
        }
        mr.start()
        src.start()
        src.onended = () => { setTimeout(() => mr.stop(), 100) }
      } catch (e) {
        console.warn('[Toki] trimSilence fallback:', e)
        resolve(audioBlob)
      }
    }
    reader.onerror = () => resolve(audioBlob)
    reader.readAsArrayBuffer(audioBlob)
  })
}

export function validateVoiceDuration(blob, _expectedPhrase) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.onloadedmetadata = () => {
      const dur = audio.duration
      URL.revokeObjectURL(url)
      if (dur < 0.5) resolve({ ok: false, reason: 'too_short', duration: dur })
      else if (dur > 10) resolve({ ok: false, reason: 'too_long', duration: dur })
      else resolve({ ok: true, duration: dur })
    }
    audio.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ ok: false, reason: 'error', duration: 0 })
    }
  })
}

// Export Firestore functions for direct use
export const fbFns = { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc, query, where, orderBy }
