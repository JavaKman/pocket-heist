import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2M9AzkdLAZpTHZOKQ0vnfmpxgG0X6MA0",
  authDomain: "pocket-heist-website-61218.firebaseapp.com",
  projectId: "pocket-heist-website-61218",
  storageBucket: "pocket-heist-website-61218.firebasestorage.app",
  messagingSenderId: "1043334145614",
  appId: "1:1043334145614:web:e888d9efb3695d76cec51f",
  measurementId: "G-87L2FGVJW7"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
