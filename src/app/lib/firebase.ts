import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// (Optional) Hanya dipakai kalau pakai Analytics di browser
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAhCmDh5NGaOxGtpHCsXwTcimLmOQCokX0",
  authDomain: "dashboard-employee-29f7a.firebaseapp.com",
  projectId: "dashboard-employee-29f7a",
  storageBucket: "dashboard-employee-29f7a.appspot.com", // ← typo kamu sebelumnya `.app` → harus `.appspot.com`
  messagingSenderId: "445751384255",
  appId: "1:445751384255:web:c6a00f663abc1b63b34e0a",
  measurementId: "G-K0EZT5CJBZ"
};

// ✅ Init App
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase modules
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app); // optional, hanya di browser
