/**
 * pixel-rpg-game.js
 * Comprehensive 2D Pixel Adventure RPG & Platformer for Mangara Ferdianto Pakpahan
 * Features:
 * - 5 Full Playable Levels & Situations with Portals & Level Transitioning
 * - Player Controller: Walk, Jump, Gravity, Collisions, Interact ([E] / Space / Touch)
 * - Dialogue Box System with Typing Effect for NPCs, Signs, and Showcases
 * - Collectible Talents, Gems, Microchips, Scrolls, and Trophies
 * - Mobile Touch Controls (Virtual D-Pad, Jump, Action Button)
 * - Level Select Map & Checkpoint System
 * - Built-in 8-bit Audio Synthesizer (Zero External Dependencies)
 * - Real Project Inspection Modals linked to Portfolio Data & CV Downloads
 */

(function () {
  'use strict';

  // ─── 1. AUDIO SYNTHESIZER (8-BIT SOUND FX) ────────────────────
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.08, type = 'square', gainVal = 0.08) {
    if (!sfxEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function sfxJump() {
    if (!sfxEnabled || !audioCtx) return;
    try {
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.14);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    } catch (e) {}
  }

  function sfxCoin() {
    if (!sfxEnabled || !audioCtx) return;
    try {
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, t);
      osc.frequency.setValueAtTime(1318.51, t + 0.08);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    } catch (e) {}
  }

  function sfxLevelClear() {
    if (!sfxEnabled || !audioCtx) return;
    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.18, 'square', 0.1), i * 110);
    });
  }

  function sfxInteract() {
    playTone(587, 0.09, 'sine', 0.1);
  }

  // ─── 2. GAME DATA: 5 COMPLETE LEVELS & SITUATIONS ─────────────
  const GAME_LEVELS = [
    {
      id: 1,
      name: "LEVEL 1: DESA AWAL (SPAWN VILLAGE)",
      situation: "Suasana Pagi Cerah di Kampus ITPLN & Pedesaan Kreatif",
      bgColor: "#1a2c56",
      skyGradient: ["#142045", "#203a72", "#4169b0"],
      groundColor: "#2e7d32",
      stoneColor: "#1b5e20",
      description: "Pelajari jati diri Mangara Ferdianto Pakpahan. Temukan NPC dan baca papan informasi sebelum menuju portal Level 2!",
      targetX: 1850,
      platforms: [
        { x: 0, y: 440, w: 2000, h: 60 },
        { x: 260, y: 350, w: 120, h: 20 },
        { x: 450, y: 280, w: 140, h: 20 },
        { x: 700, y: 340, w: 130, h: 20 },
        { x: 920, y: 260, w: 160, h: 20 },
        { x: 1200, y: 330, w: 140, h: 20 },
        { x: 1450, y: 270, w: 160, h: 20 }
      ],
      decorations: [
        { type: "tree", x: 80, y: 440 },
        { type: "house", x: 380, y: 440 },
        { type: "tree", x: 620, y: 440 },
        { type: "tree", x: 1100, y: 440 },
        { type: "flag", x: 1850, y: 440 }
      ],
      interactables: [
        {
          x: 180,
          y: 440,
          type: "sign",
          title: "Papan Identitas Mangara",
          text: "MANGARA FERDIANTO PAKPAHAN\nMahasiswa S1 Teknik Informatika Institut Teknologi PLN (2023 - Sekarang).\nSpesialisasi: Creative Director, Live Production, Sinematografi, Visual Designer, dan Data Analyst."
        },
        {
          x: 520,
          y: 280,
          type: "npc",
          name: "Dosen Mentor ITPLN",
          title: "Biro Humas & Komunikasi",
          text: "Halo Adventurer! Mangara adalah Student Ambassador resmi ITPLN dan DQLab. Di kampus, ia memimpin siaran langsung multi-kamera acara universitas dan mengelola media sosial resmi."
        },
        {
          x: 980,
          y: 260,
          type: "sign",
          title: "Visi & Keahlian Utama",
          text: "Menggabungkan seni visual multimedia dengan logika komputasi cerdas data analitik. Menguasai OBS/vMix multicam, Adobe Suite, SQL database, Python, SEM-PLS, dan Azure Cloud Machine Learning."
        },
        {
          x: 1500,
          y: 270,
          type: "npc",
          name: "Penjaga Gerbang Vokasi",
          title: "Penjaga Portal",
          text: "Hebat! Kamu telah mengumpulkan cukup pengetahuan dasar. Lanjutkan ke portal di sebelah kanan untuk memasuki Hutan Karier & Pengalaman (Level 2)!"
        }
      ],
      collectibles: [
        { x: 290, y: 310, collected: false, name: "Bintang Identitas" },
        { x: 480, y: 240, collected: false, name: "Bintang ITPLN" },
        { x: 740, y: 300, collected: false, name: "Bintang Ambassador" },
        { x: 1000, y: 220, collected: false, name: "Bintang Desain" },
        { x: 1250, y: 290, collected: false, name: "Bintang Komputasi" }
      ],
      portal: { x: 1850, y: 440, label: "PORTAL KE LEVEL 2: HUTAN KARIER" }
    },
    {
      id: 2,
      name: "LEVEL 2: HUTAN PENGALAMAN & AKADEMI",
      situation: "Suasana Senja Berbatu & Tantangan Obby Loncat Tebing",
      bgColor: "#2d1b4e",
      skyGradient: ["#2d1b4e", "#512b58", "#8b4367"],
      groundColor: "#4a3b32",
      stoneColor: "#332520",
      description: "Jelajahi rekam jejak pengalaman kerja nyata: Magang PJCI, Humas ITPLN, Educativa Riset 120 JP, dan DQLab. Hindari jurang dengan melompat di atas tebing!",
      targetX: 2100,
      platforms: [
        { x: 0, y: 440, w: 320, h: 60 },
        { x: 380, y: 390, w: 100, h: 20 },
        { x: 540, y: 330, w: 120, h: 20 },
        { x: 720, y: 270, w: 110, h: 20 },
        { x: 900, y: 220, w: 140, h: 20 },
        { x: 1100, y: 280, w: 120, h: 20 },
        { x: 1280, y: 340, w: 140, h: 20 },
        { x: 1480, y: 280, w: 130, h: 20 },
        { x: 1680, y: 230, w: 140, h: 20 },
        { x: 1880, y: 440, w: 350, h: 60 }
      ],
      decorations: [
        { type: "pinetree", x: 80, y: 440 },
        { type: "pinetree", x: 220, y: 440 },
        { type: "ruins", x: 920, y: 220 },
        { type: "flag", x: 2050, y: 440 }
      ],
      interactables: [
        {
          x: 160,
          y: 440,
          type: "sign",
          title: "Magang PJCI (Smart Grid Indonesia)",
          text: "Social Media Manager & Pengelola Redaksi Website (Apr 2026 - Jul 2026).\nSK No. 026/PJCI-Magang/SMM/2026. Mengelola akun @smartgridindonesia dan portal berita pjci.or.id seputar transisi energi bersih."
        },
        {
          x: 580,
          y: 330,
          type: "sign",
          title: "Humas & Stakeholder ITPLN (BHMS)",
          text: "Social Media & Website Specialist (Okt 2025 - Sekarang).\nMemproduksi konten publikasi digital, artikel web, dan mengelola akun resmi @itpln, @vokasiitpln dengan lonjakan engagement hingga 3x lipat!"
        },
        {
          x: 950,
          y: 220,
          type: "npc",
          name: "Peneliti PT Educativa",
          title: "Instruktur Riset Kuantitatif",
          text: "Mangara telah menyelesaikan 120 JP Bootcamp Riset Kuantitatif & Structural Equation Modeling (SEM-PLS), menguasai analisis mediasi-moderasi dan validitas instrumen statistik!"
        },
        {
          x: 1330,
          y: 340,
          type: "sign",
          title: "ITPLN Media - Deputy Manager & Creative Director",
          text: "Memimpin divisi desain grafis, fotografi, dan video. Koordinator Video Profil Kampus (SK No. 001/SK/ITPLN MEDIA/APRIL/2025) dan Ketua Pelaksana Kompetisi Nasional NCC 2025."
        },
        {
          x: 1730,
          y: 230,
          type: "sign",
          title: "DQLab & Kampanye PMB",
          text: "Student Ambassador DQLab Data Science (2024 - Sekarang) & Social Media Manager PMB ITPLN (lonjakan interaksi 300%)."
        }
      ],
      collectibles: [
        { x: 420, y: 350, collected: false, name: "Kristal PJCI" },
        { x: 760, y: 230, collected: false, name: "Kristal SEM-PLS" },
        { x: 1140, y: 240, collected: false, name: "Kristal DQLab" },
        { x: 1520, y: 240, collected: false, name: "Kristal NCC 2025" },
        { x: 1950, y: 400, collected: false, name: "Kristal Humas" }
      ],
      portal: { x: 2050, y: 440, label: "PORTAL KE LEVEL 3: CYBER SHOWCASE" }
    },
    {
      id: 3,
      name: "LEVEL 3: CYBER SHOWCASE & 50+ INOVASI",
      situation: "Laboratorium Cyberpunk 16-Bit & Ruang Eksibisi Multiverse",
      bgColor: "#091026",
      skyGradient: ["#050817", "#091438", "#112260"],
      groundColor: "#1a2456",
      stoneColor: "#0b102b",
      description: "Tempat 50+ karya terbaik Mangara dipamerkan! Periksa konsol interaktif untuk melihat preview proyek siaran langsung, IoT, desain grafis, dan analitik.",
      targetX: 2200,
      platforms: [
        { x: 0, y: 440, w: 2300, h: 60 },
        { x: 280, y: 340, w: 140, h: 20 },
        { x: 500, y: 260, w: 160, h: 20 },
        { x: 760, y: 330, w: 150, h: 20 },
        { x: 1000, y: 250, w: 160, h: 20 },
        { x: 1260, y: 320, w: 150, h: 20 },
        { x: 1520, y: 240, w: 160, h: 20 },
        { x: 1780, y: 330, w: 150, h: 20 }
      ],
      decorations: [
        { type: "server", x: 120, y: 440 },
        { type: "server", x: 680, y: 440 },
        { type: "server", x: 1420, y: 440 },
        { type: "arcade", x: 1920, y: 440 },
        { type: "flag", x: 2150, y: 440 }
      ],
      interactables: [
        {
          x: 320,
          y: 340,
          type: "console",
          title: "Konsol Live Production: Wisuda ITPLN ke-46",
          text: "Siaran langsung multi-kamera berdurasi lebih dari 3.5 jam untuk ribuan audiens online. Mengoperasikan video switcher, lower-thirds grafis dinamis, dan penataan audio tanpa hambatan."
        },
        {
          x: 550,
          y: 260,
          type: "console",
          title: "Konsol IoT LPG-SafeSense (Juara 1 MKI & ITPLN)",
          text: "Alat deteksi kebocoran gas LPG dan pemantau sisa berat gas berbasis sensor MQ-6 dan load cell dengan mikrokontroler & aplikasi seluler cloud terintegrasi!"
        },
        {
          x: 820,
          y: 330,
          type: "console",
          title: "Konsol Desain: Juara 1 Ocean Experience IPB University",
          text: "Karya poster infografis bertema konservasi terumbu karang dan ekosistem bahari nasional. Meraih Juara 1 Nasional di IPB University tahun 2025."
        },
        {
          x: 1060,
          y: 250,
          type: "console",
          title: "Konsol Studium Generale Nuklir GINEST",
          text: "Penyiaran langsung seminar energi nuklir nasional dengan pemaparan para pakar industri energi masa depan secara real-time ke kanal publik."
        },
        {
          x: 1320,
          y: 320,
          type: "console",
          title: "Konsol Redaksi Berita Web: pjci.or.id & itpln.ac.id",
          text: "Pengelolaan artikel berita berkala, siaran pers resmi kerja sama institusi, dan liputan modernisasi smart grid transmisi tenaga listrik Indonesia."
        },
        {
          x: 1580,
          y: 240,
          type: "console",
          title: "Konsol AI & Micro-SaaS (REPUTA-AI & BisaKerja)",
          text: "Konsep platform AI generatif untuk reputasi UMKM serta arsitektur aplikasi inklusi kerja sosial berbasis Ability Matching."
        }
      ],
      collectibles: [
        { x: 340, y: 300, collected: false, name: "Microchip Live Broadcaster" },
        { x: 570, y: 220, collected: false, name: "Microchip IoT SafeSense" },
        { x: 830, y: 290, collected: false, name: "Microchip Desain IPB" },
        { x: 1070, y: 210, collected: false, name: "Microchip Nuklir GINEST" },
        { x: 1330, y: 280, collected: false, name: "Microchip Portal PJCI" },
        { x: 1590, y: 200, collected: false, name: "Microchip Micro-SaaS AI" }
      ],
      portal: { x: 2150, y: 440, label: "PORTAL KE LEVEL 4: RUANG ARSIP RISET" }
    },
    {
      id: 4,
      name: "LEVEL 4: WISDOM ARCHIVES & RISET DATA",
      situation: "Perpustakaan Kuno Megah Berkilau Kristal Ilmu Pengetahuan",
      bgColor: "#161b33",
      skyGradient: ["#0f1325", "#192244", "#263566"],
      groundColor: "#3e2723",
      stoneColor: "#1f120e",
      description: "Jelajahi karya riset analitik, data science, dan sertifikasi resmi Mangara. Baca rak buku ajaib untuk mengungkap rahasia keahlian kuantitatif!",
      targetX: 2000,
      platforms: [
        { x: 0, y: 440, w: 2100, h: 60 },
        { x: 250, y: 350, w: 150, h: 20 },
        { x: 480, y: 270, w: 160, h: 20 },
        { x: 740, y: 340, w: 150, h: 20 },
        { x: 980, y: 260, w: 170, h: 20 },
        { x: 1250, y: 330, w: 160, h: 20 },
        { x: 1500, y: 250, w: 170, h: 20 }
      ],
      decorations: [
        { type: "bookshelf", x: 100, y: 440 },
        { type: "bookshelf", x: 640, y: 440 },
        { type: "bookshelf", x: 1150, y: 440 },
        { type: "bookshelf", x: 1700, y: 440 },
        { type: "flag", x: 1950, y: 440 }
      ],
      interactables: [
        {
          x: 300,
          y: 350,
          type: "book",
          title: "Kitab Microsoft Azure Databricks Machine Learning",
          text: "Sertifikasi resmi Microsoft 8 modul: Machine Learning in Production, AutoML, Hyperparameter Tuning, MLflow Lifecycle, dan Apache Spark di Azure Databricks."
        },
        {
          x: 530,
          y: 270,
          type: "book",
          title: "Kitab Riset Kuantitatif SEM-PLS (Educativa 120 JP)",
          text: "Penguasaan Structural Equation Modeling (SEM-PLS): uji outer model, inner model, path analysis mediasi-moderasi, serta uji validitas-reliabilitas data empiris."
        },
        {
          x: 1030,
          y: 260,
          type: "book",
          title: "Kitab Microsoft Office Specialist (MOS) Excel 2019",
          text: "Sertifikasi internasional Microsoft Corporation dalam penguasaan spreadsheet tingkat mahir: pemodelan keuangan multivariat, pivot table, dan dasbor bisnis."
        },
        {
          x: 1550,
          y: 250,
          type: "book",
          title: "Kitab Hibah Riset PKM DIKTI Kemendikbudristek",
          text: "Penerima Pendanaan Resmi DIKTI Level 1 untuk riset implementasi prototipe teknologi energi terbarukan berbasis Internet of Things (IoT)."
        }
      ],
      collectibles: [
        { x: 320, y: 310, collected: false, name: "Gulungan Azure ML" },
        { x: 550, y: 230, collected: false, name: "Gulungan SEM-PLS" },
        { x: 1050, y: 220, collected: false, name: "Gulungan MOS Excel" },
        { x: 1570, y: 210, collected: false, name: "Gulungan PKM DIKTI" }
      ],
      portal: { x: 1950, y: 440, label: "PORTAL KE LEVEL 5: GUILD HALL PUNCAK" }
    },
    {
      id: 5,
      name: "LEVEL 5: GUILD HALL PUNCAK (RUANG KOLABORASI)",
      situation: "Langit Malam Bintang, Bulan Tersenyum & Peti Harta Karun CV",
      bgColor: "#080b20",
      skyGradient: ["#070a1a", "#0d1230", "#182352"],
      groundColor: "#2bb44a",
      stoneColor: "#145924",
      description: "Level Puncak! Suasana malam berbintang sesuai cover petualangan. Buka Peti Harta Karun untuk mengunduh CV ATS resmi dan menghubungi Mangara!",
      targetX: 1800,
      platforms: [
        { x: 0, y: 440, w: 2000, h: 60 },
        { x: 260, y: 340, w: 180, h: 20 },
        { x: 520, y: 260, w: 180, h: 20 },
        { x: 800, y: 340, w: 180, h: 20 },
        { x: 1080, y: 260, w: 200, h: 20 },
        { x: 1380, y: 340, w: 220, h: 20 }
      ],
      decorations: [
        { type: "pinetree", x: 80, y: 440 },
        { type: "pinetree", x: 740, y: 440 },
        { type: "pinetree", x: 1650, y: 440 },
        { type: "throne", x: 1800, y: 440 }
      ],
      interactables: [
        {
          x: 320,
          y: 340,
          type: "chest",
          title: "Peti Harta Karun 1: CV ATS Data Analyst",
          text: "Berisi Curriculum Vitae resmi teroptimasi ATS untuk posisi Data Analyst (Bahasa Indonesia & Inggris, format PDF).\n\n[Klik tombol di bawah untuk membuka/mengunduh file]",
          actionLink: "./CV_Mangara_Pakpahan_Data_Analyst.pdf",
          actionText: "Unduh CV Data Analyst (PDF)"
        },
        {
          x: 580,
          y: 260,
          type: "chest",
          title: "Peti Harta Karun 2: CV ATS Sosmed Specialist / Humas",
          text: "Berisi Curriculum Vitae resmi teroptimasi ATS untuk posisi Social Media Specialist / Public Relations (Humas).\n\n[Klik tombol di bawah untuk membuka/mengunduh file]",
          actionLink: "./CV_Mangara_Pakpahan_Sosmed_Humas.pdf",
          actionText: "Unduh CV Sosmed / Humas (PDF)"
        },
        {
          x: 860,
          y: 340,
          type: "teleport",
          title: "Cermin Komunikasi: WhatsApp Langsung",
          text: "Hubungi Mangara secara langsung melalui WhatsApp untuk mendiskusikan peluang proyek, magang, atau kerja sama profesional.",
          actionLink: "https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20tertarik%20berkolaborasi!",
          actionText: "Chat WhatsApp: 0813-1881-6058"
        },
        {
          x: 1140,
          y: 260,
          type: "teleport",
          title: "Kotak Surat: Email Resmi",
          text: "Kirim pesan surat elektronik ke alamat email resmi:\nmangarapakpahan51@gmail.com",
          actionLink: "mailto:mangarapakpahan51@gmail.com",
          actionText: "Kirim Email ke Mangara"
        },
        {
          x: 1450,
          y: 340,
          type: "npc",
          name: "Raja Petualang Mangara",
          title: "Pemilik Portofolio",
          text: "Selamat! Kamu telah berhasil menaklukkan seluruh 5 Level perjalanan portofolio ini dengan gemilang! Mari terhubung di Instagram (@mangarapakpahan_) dan LinkedIn!"
        }
      ],
      collectibles: [
        { x: 350, y: 300, collected: false, name: "Piala Data Analyst" },
        { x: 610, y: 220, collected: false, name: "Piala Sosmed Specialist" },
        { x: 890, y: 300, collected: false, name: "Piala Komunikasi" },
        { x: 1180, y: 220, collected: false, name: "Piala Prestasi ITPLN" },
        { x: 1480, y: 300, collected: false, name: "Mahkota Juara" }
      ],
      portal: { x: 1800, y: 440, label: "KEMBALI KE LEVEL 1 / RESTART QUEST" }
    }
  ];

  // ─── 3. GAME STATE & ENGINE ───────────────────────────────────
  let canvas = null;
  let ctx = null;
  let currentLevelIdx = 0;
  let score = 0;
  let totalCoins = 0;
  let activeDialogue = null;
  let isGameActive = true;

  const player = {
    x: 80,
    y: 380,
    w: 28,
    h: 38,
    vx: 0,
    vy: 0,
    speed: 4.8,
    jumpForce: -11.5,
    isGrounded: false,
    facing: 'right',
    animFrame: 0,
    animTimer: 0
  };

  const keys = {
    left: false,
    right: false,
    up: false,
    interact: false
  };

  const camera = {
    x: 0,
    y: 0,
    viewportW: 960,
    viewportH: 520
  };

  // ─── 4. RENDER PROCEDURAL PIXEL ART GRAPHICS ──────────────────
  function drawPixelPlayer(p, screenX, screenY) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Flip if facing left
    if (p.facing === 'left') {
      ctx.translate(screenX + p.w, screenY);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(screenX, screenY);
    }

    const legOffset = p.vx !== 0 ? Math.sin(p.animFrame * 0.4) * 4 : 0;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(2, p.h - 2, p.w - 4, 3);

    // Hair (Dark Brown / Black)
    ctx.fillStyle = '#1e140a';
    ctx.fillRect(4, 0, 20, 8);
    ctx.fillRect(2, 4, 24, 6);

    // Face / Skin
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(6, 6, 16, 12);

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(16, 10, 3, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(17, 10, 1, 1);

    // Jacket / Hoodie (Orange & Gold Roblox Style)
    ctx.fillStyle = '#ff6b2b';
    ctx.fillRect(4, 18, 20, 12);
    ctx.fillStyle = '#ffe853';
    ctx.fillRect(10, 18, 8, 12);

    // Belt
    ctx.fillStyle = '#212121';
    ctx.fillRect(4, 30, 20, 2);

    // Pants (Dark Blue Denim)
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(5, 32, 8, 5 - legOffset);
    ctx.fillRect(15, 32, 8, 5 + legOffset);

    // Shoes (White/Red Sneakers)
    ctx.fillStyle = '#e53935';
    ctx.fillRect(4, 37 - legOffset, 9, 3);
    ctx.fillRect(15, 37 + legOffset, 9, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 39 - legOffset, 9, 1);
    ctx.fillRect(15, 39 + legOffset, 9, 1);

    ctx.restore();
  }

  function drawPixelSign(x, y) {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x + 10, y - 26, 6, 26);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(x, y - 44, 26, 18);
    ctx.fillStyle = '#ffe082';
    ctx.fillRect(x + 2, y - 42, 22, 14);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x + 5, y - 38, 16, 2);
    ctx.fillRect(x + 5, y - 34, 12, 2);
    ctx.fillRect(x + 5, y - 30, 14, 2);
  }

  function drawPixelChest(x, y) {
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(x, y - 26, 32, 26);
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(x + 2, y - 24, 28, 22);
    ctx.fillStyle = '#ffe853';
    ctx.fillRect(x, y - 16, 32, 4);
    ctx.fillRect(x + 13, y - 18, 6, 8);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 15, y - 15, 2, 3);
  }

  function drawPixelConsole(x, y) {
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(x, y - 36, 32, 36);
    ctx.fillStyle = '#283593';
    ctx.fillRect(x + 2, y - 34, 28, 32);
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(x + 4, y - 30, 24, 16);
    ctx.fillStyle = '#39ff14';
    ctx.fillRect(x + 6, y - 26, 8, 2);
    ctx.fillRect(x + 6, y - 22, 14, 2);
    ctx.fillRect(x + 6, y - 18, 10, 2);
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(x + 6, y - 10, 4, 4);
    ctx.fillStyle = '#ffe853';
    ctx.fillRect(x + 14, y - 10, 4, 4);
    ctx.fillStyle = '#00e676';
    ctx.fillRect(x + 22, y - 10, 4, 4);
  }

  function drawPixelNPC(x, y, name) {
    ctx.fillStyle = '#4a148c';
    ctx.fillRect(x + 4, y - 24, 18, 14);
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(x + 6, y - 36, 14, 12);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 9, y - 30, 2, 2);
    ctx.fillRect(x + 15, y - 30, 2, 2);
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(x + 4, y - 38, 18, 5);
    ctx.fillStyle = '#212121';
    ctx.fillRect(x + 6, y - 10, 6, 10);
    ctx.fillRect(x + 14, y - 10, 6, 10);

    // Floating speech bubble cue
    ctx.fillStyle = '#ffe853';
    ctx.fillRect(x + 7, y - 50, 12, 10);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('!', x + 11, y - 42);
  }

  function drawPixelPortal(portal, screenX, screenY) {
    const time = Date.now() * 0.005;
    ctx.save();
    // Glowing aura
    ctx.fillStyle = '#ffe853';
    ctx.fillRect(screenX - 4, screenY - 58, 44, 58);
    ctx.fillStyle = '#ff6b2b';
    ctx.fillRect(screenX, screenY - 54, 36, 54);
    ctx.fillStyle = '#9c27b0';
    ctx.fillRect(screenX + 4, screenY - 50, 28, 50);

    // Swirling portal vortex
    for (let i = 0; i < 4; i++) {
      const offset = (Math.sin(time + i) * 4);
      ctx.fillStyle = i % 2 === 0 ? '#00e5ff' : '#ffe853';
      ctx.fillRect(screenX + 8 + offset, screenY - 44 + (i * 9), 18, 6);
    }

    // Portal Banner
    ctx.fillStyle = '#000000';
    ctx.fillRect(screenX - 25, screenY - 74, 86, 14);
    ctx.fillStyle = '#ffe853';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('▶ NEXT LEVEL', screenX + 18, screenY - 64);

    ctx.restore();
  }

  // ─── 5. GAME LOOP & PHYSICS ───────────────────────────────────
  function updatePlayer(currentLevel) {
    if (activeDialogue) {
      player.vx = 0;
      return;
    }

    // Horizontal Movement
    if (keys.left) {
      player.vx = -player.speed;
      player.facing = 'left';
    } else if (keys.right) {
      player.vx = player.speed;
      player.facing = 'right';
    } else {
      player.vx = 0;
    }

    // Animation timer
    if (player.vx !== 0) {
      player.animTimer++;
      if (player.animTimer > 6) {
        player.animFrame++;
        player.animTimer = 0;
      }
    } else {
      player.animFrame = 0;
    }

    // Jump
    if (keys.up && player.isGrounded) {
      player.vy = player.jumpForce;
      player.isGrounded = false;
      sfxJump();
    }

    // Gravity
    player.vy += 0.58;
    if (player.vy > 12) player.vy = 12;

    // Proposed new positions
    let newX = player.x + player.vx;
    let newY = player.y + player.vy;

    // Platform Collisions (AABB)
    player.isGrounded = false;
    for (const plat of currentLevel.platforms) {
      // Check landing on platform from above
      if (
        player.x + player.w > plat.x &&
        player.x < plat.x + plat.w &&
        player.y + player.h <= plat.y &&
        newY + player.h >= plat.y
      ) {
        newY = plat.y - player.h;
        player.vy = 0;
        player.isGrounded = true;
      }
    }

    // Boundaries
    if (newX < 0) newX = 0;
    if (newX > currentLevel.targetX + 200) newX = currentLevel.targetX + 200;

    // Fall in pit respawn safety
    if (newY > 700) {
      newX = 80;
      newY = 380;
      player.vy = 0;
    }

    player.x = newX;
    player.y = newY;

    // Collectibles Detection
    for (const item of currentLevel.collectibles) {
      if (!item.collected) {
        const dx = (player.x + player.w / 2) - item.x;
        const dy = (player.y + player.h / 2) - item.y;
        if (Math.abs(dx) < 26 && Math.abs(dy) < 26) {
          item.collected = true;
          score += 100;
          totalCoins += 10;
          sfxCoin();
          updateHUDStats();
          triggerGamePopup(item.x, item.y, `+100 XP (${item.name})!`);
        }
      }
    }

    // Check Portal Collision
    const portal = currentLevel.portal;
    if (portal) {
      const pdx = (player.x + player.w / 2) - portal.x;
      const pdy = (player.y + player.h / 2) - (portal.y - 25);
      if (Math.abs(pdx) < 35 && Math.abs(pdy) < 40) {
        advanceToNextLevel();
      }
    }

    // Check Interactables Cue
    let nearbyInteractable = null;
    for (const obj of currentLevel.interactables) {
      const odx = (player.x + player.w / 2) - obj.x;
      const ody = (player.y + player.h / 2) - (obj.y - 20);
      if (Math.abs(odx) < 45 && Math.abs(ody) < 40) {
        nearbyInteractable = obj;
        break;
      }
    }

    const cue = document.getElementById('pixel-interact-cue');
    if (cue) {
      if (nearbyInteractable && !activeDialogue) {
        cue.style.display = 'block';
        cue.textContent = `[TEKAN E] ${nearbyInteractable.title || nearbyInteractable.name}`;
        if (keys.interact) {
          openDialogue(nearbyInteractable);
          keys.interact = false;
        }
      } else {
        cue.style.display = 'none';
      }
    }

    // Update Camera (Smooth tracking)
    const targetCamX = player.x - camera.viewportW * 0.4;
    camera.x += (targetCamX - camera.x) * 0.12;
    if (camera.x < 0) camera.x = 0;
  }

  function advanceToNextLevel() {
    sfxLevelClear();
    score += 500;
    totalCoins += 50;
    updateHUDStats();

    const banner = document.getElementById('pixel-level-clear-banner');
    if (banner) {
      banner.style.display = 'flex';
      banner.innerHTML = `
        <div class="level-clear-box">
          <h2>★ LEVEL COMPLETED! ★</h2>
          <p>${GAME_LEVELS[currentLevelIdx].name}</p>
          <div class="stars">★★★</div>
          <button id="next-level-btn" class="pixel-btn-gold">LANJUT KE LEVEL BERIKUTNYA ▶</button>
        </div>
      `;

      document.getElementById('next-level-btn')?.addEventListener('click', () => {
        banner.style.display = 'none';
        currentLevelIdx = (currentLevelIdx + 1) % GAME_LEVELS.length;
        resetPlayerForLevel();
      });
    } else {
      currentLevelIdx = (currentLevelIdx + 1) % GAME_LEVELS.length;
      resetPlayerForLevel();
    }
  }

  function resetPlayerForLevel() {
    player.x = 80;
    player.y = 380;
    player.vx = 0;
    player.vy = 0;
    camera.x = 0;

    // Reset collectibles for this level
    GAME_LEVELS[currentLevelIdx].collectibles.forEach(c => (c.collected = false));

    const titleEl = document.getElementById('game-level-indicator');
    if (titleEl) {
      titleEl.textContent = GAME_LEVELS[currentLevelIdx].name;
    }
    const sitEl = document.getElementById('game-situation-indicator');
    if (sitEl) {
      sitEl.textContent = GAME_LEVELS[currentLevelIdx].situation;
    }

    updateLevelSelectorButtons();
  }

  // ─── 6. DIALOGUE & INTERACTION SYSTEM ─────────────────────────
  function openDialogue(obj) {
    sfxInteract();
    activeDialogue = obj;
    const box = document.getElementById('pixel-dialogue-modal');
    if (!box) return;

    box.style.display = 'flex';
    const title = document.getElementById('dialogue-title');
    const content = document.getElementById('dialogue-text');
    const actions = document.getElementById('dialogue-actions');

    if (title) title.textContent = obj.title || obj.name || "Pesan";
    if (content) content.textContent = obj.text || "";

    if (actions) {
      if (obj.actionLink) {
        actions.innerHTML = `
          <a href="${obj.actionLink}" target="_blank" rel="noopener" class="pixel-btn-action">
            ${obj.actionText || "Buka Tautan"}
          </a>
          <button id="dialogue-close-btn" class="pixel-btn-close">Tutup [Esc]</button>
        `;
      } else {
        actions.innerHTML = `<button id="dialogue-close-btn" class="pixel-btn-close">Tutup [Esc / Spasi]</button>`;
      }
      document.getElementById('dialogue-close-btn')?.addEventListener('click', closeDialogue);
    }
  }

  function closeDialogue() {
    activeDialogue = null;
    const box = document.getElementById('pixel-dialogue-modal');
    if (box) box.style.display = 'none';
  }

  // ─── 7. DRAW FRAME ───────────────────────────────────────────
  function renderGame() {
    if (!canvas || !ctx) return;
    const lvl = GAME_LEVELS[currentLevelIdx];

    // Clear & Sky Background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, lvl.skyGradient[0]);
    skyGrad.addColorStop(0.5, lvl.skyGradient[1]);
    skyGrad.addColorStop(1, lvl.skyGradient[2]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-Math.floor(camera.x), 0);

    // Parallax Pixel Clouds & Mountains
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let i = 0; i < 8; i++) {
      const cx = (i * 350) + (camera.x * 0.4);
      ctx.fillRect(cx, 60 + (i % 3) * 30, 90, 25);
      ctx.fillRect(cx + 15, 45 + (i % 3) * 30, 60, 15);
    }

    // Platforms
    for (const plat of lvl.platforms) {
      // Grass top
      ctx.fillStyle = lvl.groundColor;
      ctx.fillRect(plat.x, plat.y, plat.w, 8);
      // Stone base
      ctx.fillStyle = lvl.stoneColor;
      ctx.fillRect(plat.x, plat.y + 8, plat.w, plat.h - 8);
      // Brick pattern accents
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      for (let bx = plat.x; bx < plat.x + plat.w; bx += 24) {
        ctx.fillRect(bx, plat.y + 12, 1, plat.h - 12);
        ctx.fillRect(bx + 12, plat.y + 24, 1, plat.h - 24);
      }
    }

    // Interactables
    for (const obj of lvl.interactables) {
      if (obj.type === 'sign') {
        drawPixelSign(obj.x, obj.y);
      } else if (obj.type === 'chest') {
        drawPixelChest(obj.x, obj.y);
      } else if (obj.type === 'console') {
        drawPixelConsole(obj.x, obj.y);
      } else {
        drawPixelNPC(obj.x, obj.y, obj.name);
      }
    }

    // Collectibles (Gems/Coins)
    const time = Date.now() * 0.006;
    for (const col of lvl.collectibles) {
      if (!col.collected) {
        const floatY = col.y + Math.sin(time + col.x) * 4;
        ctx.fillStyle = '#ffe853';
        ctx.fillRect(col.x - 7, floatY - 7, 14, 14);
        ctx.fillStyle = '#ff6b2b';
        ctx.fillRect(col.x - 4, floatY - 4, 8, 8);
        ctx.fillStyle = '#fff';
        ctx.fillRect(col.x - 2, floatY - 2, 4, 4);
      }
    }

    // Level Portal / Exit
    if (lvl.portal) {
      drawPixelPortal(lvl.portal, lvl.portal.x, lvl.portal.y);
    }

    // Player
    drawPixelPlayer(player, player.x, player.y);

    ctx.restore();
  }

  function gameLoop() {
    if (isGameActive) {
      updatePlayer(GAME_LEVELS[currentLevelIdx]);
      renderGame();
    }
    requestAnimationFrame(gameLoop);
  }

  // ─── 8. UI BUILDER & MOUNTING ─────────────────────────────────
  function triggerGamePopup(x, y, text) {
    const pop = document.createElement('div');
    pop.className = 'pixel-game-pop';
    pop.textContent = text;
    pop.style.left = `${x - camera.x}px`;
    pop.style.top = `${y}px`;
    document.getElementById('pixel-canvas-wrapper')?.appendChild(pop);
    setTimeout(() => pop.remove(), 1200);
  }

  function updateHUDStats() {
    const sEl = document.getElementById('game-score-display');
    const cEl = document.getElementById('game-coins-display');
    if (sEl) sEl.textContent = score;
    if (cEl) cEl.textContent = totalCoins;
  }

  function updateLevelSelectorButtons() {
    const btns = document.querySelectorAll('.level-select-btn');
    btns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentLevelIdx);
    });
  }

  function buildGameContainer() {
    const targetMount = document.querySelector('main');
    if (!targetMount) return;

    const gameSection = document.createElement('section');
    gameSection.id = 'pixel-game-adventure-section';
    gameSection.className = 'pixel-adventure-container';

    gameSection.innerHTML = `
      <!-- Game Header Control Bar -->
      <div class="pixel-game-header-bar">
        <div class="game-meta-group">
          <span class="game-badge">🎮 ROBLOX-STYLE PIXEL RPG</span>
          <h2 id="game-level-indicator" class="game-level-title">${GAME_LEVELS[0].name}</h2>
          <span id="game-situation-indicator" class="game-situation-desc">${GAME_LEVELS[0].situation}</span>
        </div>

        <div class="game-hud-status">
          <div class="hud-item"><span class="hud-icon">⭐</span> XP: <span id="game-score-display">0</span></div>
          <div class="hud-item"><span class="hud-icon">🪙</span> KOIN: <span id="game-coins-display">0</span></div>
          <button id="game-sfx-toggle" class="pixel-hud-btn" title="Nyalakan / Matikan Suara">🔊 SFX</button>
          <a href="#main-portfolio-content" class="pixel-hud-btn" style="text-decoration: none; background: #2bb44a;" title="Gulir ke daftar portofolio lengkap & CV">📄 DOKUMEN / CV</a>
        </div>
      </div>

      <!-- Level Selector Bar -->
      <div class="pixel-level-nav-bar">
        <span class="level-nav-label">PILIH SITUASI / LEVEL:</span>
        <div class="level-buttons-group">
          <button class="level-select-btn active" data-level="0">1. Desa Awal</button>
          <button class="level-select-btn" data-level="1">2. Hutan Karier</button>
          <button class="level-select-btn" data-level="2">3. Cyber 50+ Proyek</button>
          <button class="level-select-btn" data-level="3">4. Arsip Riset</button>
          <button class="level-select-btn" data-level="4">5. Ruang Kolaborasi</button>
        </div>
      </div>

      <!-- Main Canvas Viewport -->
      <div class="pixel-canvas-wrapper" id="pixel-canvas-wrapper">
        <canvas id="pixel-rpg-canvas" width="960" height="520"></canvas>
        <div id="pixel-interact-cue" class="pixel-interact-cue">[TEKAN E / SENTUH] BUKA INFORMASI</div>
      </div>

      <!-- Instructions & Mobile Controls -->
      <div class="pixel-controls-dashboard">
        <div class="desktop-instruction">
          <span>KONTROL KEYBOARD:</span>
          <kbd>A</kbd> <kbd>D</kbd> / <kbd>◄</kbd> <kbd>►</kbd> Jalan &nbsp;|&nbsp; 
          <kbd>W</kbd> / <kbd>▲</kbd> / <kbd>Spasi</kbd> Lompat &nbsp;|&nbsp; 
          <kbd>E</kbd> Interaksi Papan / NPC / Proyek
        </div>

        <!-- Mobile Touch Controls -->
        <div class="pixel-mobile-dpad">
          <div class="dpad-btn-group">
            <button class="touch-ctrl-btn" id="touch-left">◄</button>
            <button class="touch-ctrl-btn" id="touch-right">►</button>
          </div>
          <div class="action-btn-group">
            <button class="touch-ctrl-btn action-interact" id="touch-action">E (Aksi)</button>
            <button class="touch-ctrl-btn action-jump" id="touch-jump">▲ LOMPAT</button>
          </div>
        </div>
      </div>

      <!-- Dialogue Modal Overlay -->
      <div id="pixel-dialogue-modal" class="pixel-dialogue-overlay" style="display: none;">
        <div class="pixel-dialogue-box">
          <div class="dialogue-header">
            <span class="dialogue-icon">📜</span>
            <h3 id="dialogue-title" class="dialogue-title-text">Papan Informasi</h3>
          </div>
          <div id="dialogue-text" class="dialogue-body-text">
            Isi teks informasi...
          </div>
          <div id="dialogue-actions" class="dialogue-actions-bar">
            <button id="dialogue-close-btn" class="pixel-btn-close">Tutup [Esc]</button>
          </div>
        </div>
      </div>

      <!-- Level Clear Overlay Banner -->
      <div id="pixel-level-clear-banner" class="pixel-level-clear-overlay" style="display: none;"></div>
    `;

    // Mount right at the top of <main>
    targetMount.prepend(gameSection);

    canvas = document.getElementById('pixel-rpg-canvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
    }

    // Attach level switch buttons
    const levelBtns = document.querySelectorAll('.level-select-btn');
    levelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        initAudio();
        currentLevelIdx = parseInt(btn.dataset.level, 10) || 0;
        resetPlayerForLevel();
      });
    });

    // SFX toggle button
    const sfxBtn = document.getElementById('game-sfx-toggle');
    sfxBtn?.addEventListener('click', () => {
      initAudio();
      sfxEnabled = !sfxEnabled;
      sfxBtn.textContent = sfxEnabled ? '🔊 SFX' : '🔇 SFX';
      sfxBtn.classList.toggle('muted', !sfxEnabled);
    });

    // Setup Mobile Touch Listeners
    setupTouchControls();

    // Setup Keyboard Listeners
    setupKeyboardListeners();

    console.log('🎮 Roblox-Style Pixel RPG Game Engine ready & loaded smoothly!');
  }

  function setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      initAudio();
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keys.up = true;
      if (e.code === 'KeyE') keys.interact = true;
      if (e.code === 'Escape' && activeDialogue) closeDialogue();
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keys.up = false;
      if (e.code === 'KeyE') keys.interact = false;
    });
  }

  function setupTouchControls() {
    const bindTouch = (elId, onDown, onUp) => {
      const el = document.getElementById(elId);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        initAudio();
        onDown();
      }, { passive: false });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        onUp();
      }, { passive: false });
      el.addEventListener('mousedown', (e) => {
        initAudio();
        onDown();
      });
      el.addEventListener('mouseup', () => onUp());
      el.addEventListener('mouseleave', () => onUp());
    };

    bindTouch('touch-left', () => (keys.left = true), () => (keys.left = false));
    bindTouch('touch-right', () => (keys.right = true), () => (keys.right = false));
    bindTouch('touch-jump', () => (keys.up = true), () => (keys.up = false));
    bindTouch('touch-action', () => (keys.interact = true), () => (keys.interact = false));
  }

  // ─── 9. INIT ENGINE ───────────────────────────────────────────
  function init() {
    buildGameContainer();
    requestAnimationFrame(gameLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
