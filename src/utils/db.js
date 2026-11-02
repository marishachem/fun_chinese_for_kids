import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PROG_KEY    = 'fun_chinese_v1';
const STICKER_KEY = 'fun_chinese_stickers_v1';

// Load user's saved data from Firestore and populate localStorage
export async function loadFromCloud(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return;
    const data = snap.data();
    if (data.progress)  localStorage.setItem(PROG_KEY,    JSON.stringify(data.progress));
    if (data.stickers)  localStorage.setItem(STICKER_KEY, JSON.stringify(data.stickers));
  } catch (e) {
    console.warn('Cloud load failed, using local data', e);
  }
}

// Save current localStorage state to Firestore
export async function saveToCloud(uid) {
  try {
    const progress = JSON.parse(localStorage.getItem(PROG_KEY)    || '{}');
    const stickers = JSON.parse(localStorage.getItem(STICKER_KEY) || '{}');
    await setDoc(doc(db, 'users', uid), { progress, stickers }, { merge: true });
  } catch (e) {
    console.warn('Cloud save failed', e);
  }
}
