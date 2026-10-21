/**
 * firebase-config.js
 * Inisialisasi Firebase App, Authentication, dan Firestore.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ─── Konfigurasi Firebase Resmi ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBTjasyakm63YQOz-MseLm2hi0F-ZymyYQ",
  authDomain: "my-portfolio-mangara.firebaseapp.com",
  projectId: "my-portfolio-mangara",
  storageBucket: "my-portfolio-mangara.firebasestorage.app",
  messagingSenderId: "17194662085",
  appId: "1:17194662085:web:7b3ba3637d35b1aa4658ac",
  measurementId: "G-8RQBEZ6150"
};

// ─── Inisialisasi Firebase ─────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
