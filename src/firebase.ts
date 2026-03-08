import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrCeFGVFGp7cVAoDEq_uyrwZ51xpKfC7E",
  authDomain: "uniq-2025.firebaseapp.com",
  databaseURL: "https://uniq-2025-default-rtdb.firebaseio.com",
  projectId: "uniq-2025",
  storageBucket: "uniq-2025.firebasestorage.app",
  messagingSenderId: "86806737744",
  appId: "1:86806737744:web:266cb822208ef0f0a67255",
  measurementId: "G-VTV19048GN"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
