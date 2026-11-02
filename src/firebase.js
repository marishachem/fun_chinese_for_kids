import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBL4-Pvw94BmMeskSl-fU8LPeZSAQ12ibU",
  authDomain: "fun-chinese-for-kids.firebaseapp.com",
  projectId: "fun-chinese-for-kids",
  storageBucket: "fun-chinese-for-kids.firebasestorage.app",
  messagingSenderId: "624450502906",
  appId: "1:624450502906:web:5b10e266058e3100ae0943"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
