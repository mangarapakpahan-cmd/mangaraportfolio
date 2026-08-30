/**
 * firebase-config.js
 * Inisialisasi Firebase App, Authentication, dan Firestore.
 * Kredensial dibaca dari window.__ENV__ yang di-inject oleh vercel.json / env config,
 * atau dari objek ENV hardcoded untuk pengembangan lokal (GANTI dengan nilai Anda sendiri).
 *
 * JANGAN commit file ini dengan kredensial nyata ke repositori publik.
 * Gunakan .env.example sebagai panduan dan set env variables di Vercel dashboard.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ─── Konfigurasi Firebase ──────────────────────────────────────────────────────
// Untuk development lokal: isi nilai di bawah ini secara langsung.
// Untuk production (Vercel): set Environment Variables di Vercel dashboard,
// lalu aktifkan injection melalui vercel.json (lihat SETUP.md).
const firebaseConfig = {
  apiKey: "AIzaSyBELepuWlzda27QPhYFJHge9MTeAedhsHQ",
  authDomain: "my-portfolio-7eb6d.firebaseapp.com",
  projectId: "my-portfolio-7eb6d",
  storageBucket: "my-portfolio-7eb6d.firebasestorage.app",
  messagingSenderId: "154369393318",
  appId: "1:154369393318:web:26883f34d24720799bea67",
  measurementId: "G-LZBRYPHLE3"
};

// ─── Inisialisasi Firebase ─────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
