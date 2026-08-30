/**
 * auth.js
 * Handles semua logika autentikasi:
 *  - loginWithEmail()  : Sign-in dengan email & password
 *  - logout()          : Sign-out user saat ini
 *  - authGuard()       : Cegah akses halaman admin jika belum login → redirect login
 *  - loginGuard()      : Jika sudah login dan buka halaman login → redirect admin
 */

import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ─── Guard: Admin Page ─────────────────────────────────────────────────────────
/**
 * Panggil di admin.html.
 * Jika user BELUM login setelah state terbaca → redirect ke login.html
 * Resolve dengan user object jika sudah login.
 */
export function authGuard() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.replace("./login.html");
      } else {
        resolve(user);
      }
    });
  });
}

// ─── Guard: Login Page ─────────────────────────────────────────────────────────
/**
 * Panggil di login.html.
 * Jika user SUDAH login → redirect ke admin.html (hindari akses login page ulang).
 */
export function loginGuard() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.replace("./admin.html");
    }
  });
}

// ─── Login ─────────────────────────────────────────────────────────────────────
/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// ─── Logout ────────────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
  window.location.replace("./login.html");
}

// ─── Get Current User ──────────────────────────────────────────────────────────
export function getCurrentUser() {
  return auth.currentUser;
}
