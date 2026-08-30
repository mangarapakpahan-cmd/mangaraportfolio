# Setup Guide — Portfolio CMS dengan Firebase

Panduan lengkap untuk mengubah portfolio statis ini menjadi aplikasi web dinamis dengan Firebase backend.

---

## Prasyarat

- Akun Google (untuk Firebase Console)
- Akun Vercel (untuk deployment, gratis di [vercel.com](https://vercel.com))
- Git (opsional, untuk version control)

---

## Langkah 1: Buat Firebase Project

1. Buka **[Firebase Console](https://console.firebase.google.com)**
2. Klik **"Add project"** → Masukkan nama project (contoh: `my-portfolio`)
3. Nonaktifkan Google Analytics (opsional) → klik **"Create project"**
4. Tunggu hingga project selesai dibuat

---

## Langkah 2: Aktifkan Authentication

1. Di Firebase Console, pilih project Anda
2. Di sidebar kiri → klik **"Authentication"** → **"Get started"**
3. Tab **"Sign-in method"** → klik **"Email/Password"**
4. Toggle **"Enable"** → klik **"Save"**

### Buat Akun Admin Pertama

1. Masih di Authentication → tab **"Users"**
2. Klik **"Add user"**
3. Masukkan email dan password admin Anda
4. Klik **"Add user"**

> ⚠️ **Penting**: Simpan email dan password ini dengan aman. Ini adalah kredensial untuk login ke `/admin`.

---

## Langkah 3: Aktifkan Firestore Database

1. Di sidebar kiri → klik **"Firestore Database"** → **"Create database"**
2. Pilih **"Start in production mode"** → klik **"Next"**
3. Pilih lokasi server yang terdekat (contoh: `asia-southeast1` untuk Asia Tenggara)
4. Klik **"Enable"**

### Set Firestore Security Rules

Setelah database dibuat, pergi ke tab **"Rules"** dan ganti dengan:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Data portfolio publik — siapa saja bisa baca
    match /profile/{doc}    { allow read: if true; allow write: if request.auth != null; }
    match /services/{doc}   { allow read: if true; allow write: if request.auth != null; }
    match /skills/{doc}     { allow read: if true; allow write: if request.auth != null; }
    match /education/{doc}  { allow read: if true; allow write: if request.auth != null; }
    match /experience/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /projects/{doc}   { allow read: if true; allow write: if request.auth != null; }
    match /blog/{doc}       { allow read: if true; allow write: if request.auth != null; }
    match /testimonials/{doc} { allow read: if true; allow write: if request.auth != null; }

    // Pesan kontak — siapa saja bisa kirim, hanya admin yang bisa baca
    match /messages/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

Klik **"Publish"**.

---

## Langkah 4: Dapatkan Firebase Config

1. Di Firebase Console → klik ikon **gear** (⚙️) → **"Project settings"**
2. Scroll ke bawah ke bagian **"Your apps"**
3. Klik ikon **`</>`** (Web) → Daftarkan app (nama bebas, contoh: `portfolio-web`)
4. **Jangan** centang Firebase Hosting
5. Klik **"Register app"**
6. Salin nilai dari objek `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

---

## Langkah 5: Isi Firebase Config di Kode

Buka file [`assets/js/firebase-config.js`](./assets/js/firebase-config.js) dan isi nilai konfigurasi:

```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY_HERE",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
```

> ⚠️ Untuk development lokal, isi langsung di file ini. Untuk production, gunakan Vercel Environment Variables (Langkah 7).

---

## Langkah 6: Isi Data Awal (Seed Data) di Firestore

Sebelum portfolio Anda tampil, Anda perlu mengisi data di Firestore melalui Admin Dashboard.

1. Buka `admin.html` di browser (atau deploy dulu)
2. Login dengan akun admin yang Anda buat di Langkah 2
3. Isi semua section: **Profil, Skills, Proyek, dll.**

### Alternatif: Isi Manual di Firestore Console

Buka Firebase Console → Firestore Database → klik **"Start collection"**:

**Collection: `profile`** → Document ID: `main`
```
name: "Nama Anda"
title: "Web Developer"
bio: "Deskripsi tentang Anda..."
email: "your@email.com"
phone: "+62 ..."
birthday: "1999-01-01"
location: "Jakarta, Indonesia"
avatarUrl: "https://link-foto-anda.com/avatar.jpg"
social_facebook: "https://facebook.com/username"
social_twitter: "https://twitter.com/username"
social_instagram: "https://instagram.com/username"
```

---

## Langkah 7: Deploy ke Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Di folder project
vercel

# Ikuti instruksi di terminal
```

### Option B: Via Vercel Dashboard (Lebih Mudah)

1. Push kode Anda ke GitHub
2. Buka [vercel.com](https://vercel.com) → Login → **"New Project"**
3. Import repositori GitHub Anda
4. Di bagian **"Environment Variables"**, tambahkan semua variabel dari `.env.example`:
   - `FIREBASE_API_KEY` = nilai dari firebaseConfig
   - `FIREBASE_AUTH_DOMAIN` = ...
   - dst.
5. Klik **"Deploy"**

### Set Environment Variables di Vercel

Setelah deploy, Anda perlu menginject env variables ke halaman HTML. Buka `assets/js/firebase-config.js` dan ganti bagian `window.__ENV__` — atau gunakan pendekatan yang lebih sederhana: **isi langsung nilai config di firebase-config.js**, karena Firebase API Key untuk web app bersifat publik dan aman diekspos di frontend (keamanan dijaga oleh Firestore Rules).

> ℹ️ **Catatan Keamanan**: Firebase API Key untuk web tidak seperti API key backend — ini bukan rahasia. Yang menjaga keamanan adalah **Firestore Security Rules** yang Anda set di Langkah 3. Lihat [dokumentasi Firebase](https://firebase.google.com/docs/projects/api-keys) untuk detail.

---

## Struktur File

```
vcard-personal-portfolio-master/
├── index.html              ← Portfolio publik
├── admin.html              ← Dashboard CMS (protected)
├── login.html              ← Halaman login admin
├── vercel.json             ← Routing config untuk Vercel
├── .env.example            ← Template environment variables
├── SETUP.md                ← File ini
└── assets/
    ├── css/
    │   ├── style.css       ← CSS portfolio asli
    │   ├── admin.css       ← CSS admin dashboard
    │   └── login.css       ← CSS halaman login
    └── js/
        ├── firebase-config.js  ← Inisialisasi Firebase
        ├── auth.js             ← Auth guard & login/logout
        ├── portfolio-data.js   ← Fetch & render Firestore data ke portfolio
        └── admin.js            ← CRUD operations admin dashboard
```

---

## Alur Autentikasi

```
Akses /admin.html
      ↓
  [Belum login?] ──────→ Redirect ke /login.html
      ↓                        ↓
  [Sudah login]          Input email + password
      ↓                        ↓
  Dashboard             Firebase Auth
  menampilkan           signInWithEmailAndPassword()
  data Firestore               ↓
                         [Sukses] → Redirect ke /admin.html
                         [Gagal]  → Tampilkan error toast
```

---

## Troubleshooting

### Portfolio tidak menampilkan data
- Pastikan Firestore sudah berisi data (lewat Admin atau manual)
- Cek browser console untuk error Firebase
- Pastikan Firestore Rules sudah benar (allow read: if true)

### Tidak bisa login ke admin
- Pastikan user sudah dibuat di Firebase Authentication → Users
- Cek apakah email/password sudah benar
- Cek browser console untuk error code Firebase

### Error "Firebase App not initialized"
- Pastikan `firebase-config.js` sudah diisi dengan nilai config yang benar
- Pastikan semua file JS di-load sebagai `type="module"`

### CORS error saat development lokal
- Buka HTML via HTTP server, bukan langsung dari file system
- Gunakan: `npx serve .` atau VS Code Live Server extension

---

## Kontak & Kontribusi

Jika ada pertanyaan atau masalah, silakan buka issue di repositori GitHub Anda.
