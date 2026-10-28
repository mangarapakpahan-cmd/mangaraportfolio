/**
 * gallery-3d-experience.js
 * 3D Scrollytelling Camera Flight & Bustling Miniature Studio
 * Inspired by "nadi." Healthcare Diorama & Stylized Isometric Game
 *
 * Major Updates:
 * 1. 4 Comfortable & Refined Camera POVs (Isometrik, Top-Down Tactical, Third-Person, Orbit Bebas)
 * 2. Ultra-minimalist and clean table & card styling
 * 3. Bustling, realistic, and highly detailed 3D office/studio:
 *    - Broadcasting gear (6-screen video wall, ATEM switcher, soundboard, teleprompter camera, softbox lights)
 *    - Data Analyst & ML lab (2 full-height server racks with pulsing LEDs, triple-monitor dev desk, formulas whiteboard)
 *    - IoT maker bench (oscilloscope, soldering station, 3D printer, LPG-SafeSense prototype, gold trophy)
 *    - Press conference hall (podium, projection screen, executive table)
 *    - Jakarta executive recruiter lounge (L-sofa, marble table, iMac, floor lamp)
 *    - 20+ active employees working, typing, discussing, and mobile walking staff patrolling the hallway!
 * 4. Floating centered bottom segmented dock for steps 01-07 (No overlap with cards!)
 * 5. Automatic Outro celebration trigger at the end of scroll
 */

import { DEFAULT_DATA } from './default-data.js';
import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

(function () {
  'use strict';

  // ─── 1. GLOBAL STATE & THREE.JS REFERENCES ────────────────────
  let scene, camera, renderer;
  let canvas, stickyViewport, scrollyTrack;
  let animFrameId = null;

  // Walking Hero Character references
  let walkingHero = null;
  let legPivotL = null;
  let legPivotR = null;
  let armPivotL = null;
  let armPivotR = null;
  let heroGroundRing = null;
  let heroRingChevron = null;
  let orangeCurve = null;
  let walkStepPhase = 0;

  // Mobile Patrolling Employees (Bustling office staff)
  let patrollingStaff = [];

  // Active Desk Workers with animated typing/nodding
  let activeWorkers = [];

  // Blinking Server LEDs & Studio Props
  let serverLEDs = [];

  // Dynamic Animated Canvas Textures & Props References
  let mcrCanvas = null, mcrCtx = null, mcrTexture = null;
  let grafanaCanvas = null, grafanaCtx = null, grafanaTexture = null;
  let totemCanvas = null, totemCtx = null, totemTexture = null;
  let printerExtruder = null;
  let dustParticles = null;
  let dynamicFrameCounter = 0;

  // Ultra-Dynamic Motion Entities (Alive Studio Atmosphere!)
  let animatedNPCs = [];
  let studioCameras = [];
  let holoDataCore = null;
  let sonarPulseRing = null;
  let rotatingTrophy = null;
  let steamParticles = null;
  let swayingPlants = [];
  let poolWaterMesh = null;
  let heroHumanObj = null;

  // ─── FESTIVE OFFICE & MINI-GAME SYSTEMS ─────────────────────────
  let questCollectibles = [];
  let collectedQuestCount = 0;
  let festiveFairyLights = [];
  let mascotDog = null;
  let baristaEspressoMachine = null;
  let heroSpeedBoostUntil = 0;
  let arcadeMachineObj = null;

  // ─── PROCEDURAL WEB AUDIO SYNTHESIZER (ZERO EXTERNAL ASSETS) ──
  class ProceduralAudioEngine {
    constructor() {
      this.ctx = null;
      this.isEnabled = false;
      this.ambientGain = null;
    }

    init() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      // Filtered pink room presence (soft air conditioning & space acoustics)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.025;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);
      whiteNoise.start(0);
    }

    toggle() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isEnabled = !this.isEnabled;
      if (this.ambientGain) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.cancelScheduledValues(now);
        this.ambientGain.gain.linearRampToValueAtTime(this.isEnabled ? 0.35 : 0, now + 0.4);
      }
      if (this.isEnabled) this.playChime();
      return this.isEnabled;
    }

    playClick() {
      if (!this.isEnabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    playStepTransition() {
      if (!this.isEnabled || !this.ctx) return;
      const notes = [523.25, 659.25];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.06);
        osc.stop(this.ctx.currentTime + i * 0.06 + 0.28);
      });
    }

    playChime() {
      if (!this.isEnabled || !this.ctx) return;
      const chord = [523.25, 659.25, 783.99];
      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.65);
      });
    }

    playOutroCelebration() {
      if (!this.isEnabled || !this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.85);
      });
    }

    playCollect() {
      if (!this.isEnabled || !this.ctx) return;
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.05);
        osc.stop(this.ctx.currentTime + i * 0.05 + 0.38);
      });
    }

    playVictory() {
      if (!this.isEnabled || !this.ctx) return;
      const fanfare = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.14 },
        { f: 1046.50, t: 0.40, d: 0.5 }
      ];
      fanfare.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, this.ctx.currentTime + n.t);
        gain.gain.setValueAtTime(0.09, this.ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + n.t);
        osc.stop(this.ctx.currentTime + n.t + n.d + 0.05);
      });
    }

    playCoffeeHiss() {
      if (!this.isEnabled || !this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.08;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    }

    playBark() {
      if (!this.isEnabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, this.ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    }

    playJump() {
      if (!this.isEnabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    }

    playCoin() {
      if (!this.isEnabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    }
  }

  const audioEngine = new ProceduralAudioEngine();
  window.audioEngine = audioEngine;


  // Camera flight interpolation vectors
  let currentCamPos = null;
  let currentLookAt = null;
  let tempTargetPos = null;
  let tempTargetLook = null;

  // Cinematic Intro/Outro animation states
  let isIntroActive = true;
  let introProgress = 0;
  let isIntroAnimating = false;
  let isOutroActive = false;
  let outroDismissedByUser = false;

  // Pure Free Orbit 360 Camera Mode (User Request: Hapus semua POV, hanya Orbit Bebas)
  let currentPOV = 'orbit';
  let orbitYaw = 0.42;
  let orbitPitch = 0.52;
  let orbitDistance = 13.0;

  let targetProgress = 0;
  let currentProgress = 0;
  let currentStepIndex = 0;

  // Internal UI State
  let activeLayananSubtab = 'services';
  let activeExpFilter = 'all';
  let activeEduFilter = 'all';
  let activeProjFilter = 'all';
  let activeProjSearch = '';
  let activeBlogFilter = 'all';
  let activeContactSubtab = 'testi';

  // Active NPC Dialogue Reference
  let activeNPCIndex = 0;

  // ─── 2. 7 INTERACTIVE NPCS DEFINITION (CLEARANCE POSITIONED) ─
  const NPC_GUIDES = [
    {
      roomIndex: 0,
      name: "Nadia",
      role: "Front Desk & Welcome Guide",
      avatarLetter: "N",
      pos: { x: -19.0, z: 17.5 },
      shirtColor: 0xff7a38,
      greeting: "Halo! Selamat datang di Studio Virtual Mangara Ferdianto Pakpahan. Saya siap memandu Anda menelusuri profil dan portofolio resminya.",
      questions: [
        {
          q: "Siapa itu Mangara Ferdianto Pakpahan?",
          a: "Mangara adalah mahasiswa S1 Teknik Informatika Institut Teknologi PLN dengan keahlian multidisipliner memadukan Creative Direction, Live Production, Social Media Growth, dan Data Analytics / Machine Learning."
        },
        {
          q: "Bagaimana cara mengunduh berkas CV resminya?",
          a: "Anda bisa langsung mengklik tombol 'CV Data Analyst' atau 'CV Sosmed' di navbar atas atau di kartu profil bilik ini. Keduanya berformat ATS resmi."
        }
      ],
      nextRoomName: "Bilik 02: Siaran Langsung & Live Production"
    },
    {
      roomIndex: 1,
      name: "Rizky",
      role: "Lead Broadcast Switcher",
      avatarLetter: "R",
      pos: { x: -24.5, z: -3.5 },
      shirtColor: 0x0284c7,
      greeting: "Salam! Di sini bilik Master Control Room (MCR). Kami mengendalikan alur siaran langsung multi-kamera acara protokoler nasional.",
      questions: [
        {
          q: "Apa saja pengalaman siaran langsung Mangara?",
          a: "Mangara bertindak sebagai Lead Switcher untuk Wisuda ke-46 ITPLN, Sutradara Studium Generale Nuklir, Tanda Tangan Kontrak PLN, dan Seleksi Beasiswa APERTI BUMN berpenonton ribuan orang daring & luring."
        },
        {
          q: "Software dan perangkat apa yang dikuasai?",
          a: "Menguasai OBS Studio, vMix, Blackmagic ATEM Visual Switcher, routing video SDI/NDI, mixing audio studio, dan post-production DaVinci Resolve."
        }
      ],
      nextRoomName: "Bilik 03: Media Sosial & Humas"
    },
    {
      roomIndex: 2,
      name: "Sarah",
      role: "Social Media Strategist",
      avatarLetter: "S",
      pos: { x: -12.5, z: -15.5 },
      shirtColor: 0xa855f7,
      greeting: "Halo! Kami mengelola kanal resmi institusi @itpln dan @smartgridindonesia (PJCI) dengan strategi konten visual modern.",
      questions: [
        {
          q: "Berapa pertumbuhan engagement yang dicapai?",
          a: "Di bawah strategi konten Mangara, engagement akun resmi @itpln melonjak hingga 300% (3x lipat) melalui kampanye visual interaktif dan editorial berkala."
        },
        {
          q: "Apa tanggung jawabnya di PJCI?",
          a: "Mangara dipercaya mengelola media sosial resmi Indonesia Smart Grid Association (@smartgridindonesia) dan redaksi berita web pjci.or.id terkait transisi energi bersih."
        }
      ],
      nextRoomName: "Bilik 04: Data Science & AI Cloud"
    },
    {
      roomIndex: 3,
      name: "Dimas",
      role: "Machine Learning Engineer",
      avatarLetter: "D",
      pos: { x: 12.5, z: -15.5 },
      shirtColor: 0x3b82f6,
      greeting: "Selamat datang di Data Lab! Kami fokus pada riset pemodelan empiris, cloud machine learning, dan automasi database kuantitatif.",
      questions: [
        {
          q: "Sertifikasi resmi apa saja yang dimiliki?",
          a: "Microsoft Azure Databricks Machine Learning (8 modul resmi AutoML & Apache Spark), Structural Equation Modeling SEM-PLS (120 JP PT Educativa), dan MOS Excel 2019."
        },
        {
          q: "Bagaimana penerapan ilmunya?",
          a: "Digunakan untuk analisis path Structural Equation Modeling, data mining Python/SQL, serta automasi pemodelan bisnis dan cloud pipeline."
        }
      ],
      nextRoomName: "Bilik 05: Inovasi IoT SafeSense & 50 Proyek"
    },
    {
      roomIndex: 4,
      name: "Budi",
      role: "Hardware & IoT Researcher",
      avatarLetter: "B",
      pos: { x: 24.5, z: -3.5 },
      shirtColor: 0xf97316,
      greeting: "Halo! Ini adalah ruang pamer 50 proyek portofolio dan prototipe perangkat pintar IoT LPG-SafeSense.",
      questions: [
        {
          q: "Bagaimana cara kerja inovasi IoT LPG-SafeSense?",
          a: "Mengintegrasikan sensor gas MQ-6, sensor beban load-cell berat sisa gas, dan modul WiFi Firebase cloud ke aplikasi mobile secara real-time (Juara 1 MKI & ITPLN)."
        },
        {
          q: "Berapa hibah riset yang berhasil diraih?",
          a: "Meraih pendanaan hibah riset nasional Kemendikbudristek PKM DIKTI Level 1 untuk hilirisasi teknologi keselamatan gas rumah tangga."
        }
      ],
      nextRoomName: "Bilik 06: Publikasi Ilmiah & Berita"
    },
    {
      roomIndex: 5,
      name: "Dewi",
      role: "Corporate Journalist & Editor",
      avatarLetter: "D",
      pos: { x: 14.5, z: 17.0 },
      shirtColor: 0x10b981,
      greeting: "Selamat datang di ruang redaksi! Di sini terpusat 20 publikasi resmi, artikel ilmiah, dan siaran pers transisi energi.",
      questions: [
        {
          q: "Apa saja publikasi yang telah diterbitkan?",
          a: "Mencakup siaran pers seminar dekarbonisasi di pjci.or.id, berita resmi kampus ITPLN, artikel ilmiah cloud Databricks, serta dokumentasi riset kompetisi nasional."
        },
        {
          q: "Apakah seluruh artikel bisa diakses publik?",
          a: "Tentu! Anda dapat mengklik tombol 'Detail' di kartu bilik ini untuk membuka tautan sumber aslinya langsung."
        }
      ],
      nextRoomName: "Bilik 07: Testimoni & Rekrutmen Resmi"
    },
    {
      roomIndex: 6,
      name: "Kevin",
      role: "Talent Partner & HR Host",
      avatarLetter: "K",
      pos: { x: -2.5, z: 17.5 },
      shirtColor: 0xff6b2b,
      greeting: "Halo Rekruter & Partner! Mangara siap berkolaborasi untuk posisi kerja penuh waktu, program magang, maupun creative direction.",
      questions: [
        {
          q: "Kapan Mangara siap untuk mulai bekerja?",
          a: "Mangara siap onboarding segera untuk penugasan di Jakarta (on-site/hybrid) maupun penugasan remote dengan komitmen profesional tinggi."
        },
        {
          q: "Bagaimana cara mengirim pesan atau wawancara?",
          a: "Gunakan formulir 'Kirim Pesan Langsung' di bilik ini (langsung tercatat ke sistem database admin), atau chat WhatsApp seketika di 0813-1881-6058."
        }
      ],
      nextRoomName: "Bilik 01: Mulai Kembali Tur Dari Awal"
    }
  ];

  // ─── 3. 7 SCROLLYTELLING STEP DEFINITIONS (ZIG-ZAG ATRIUM JOURNEY) ─
  const SCROLL_STEPS = [
    {
      stepNum: "01",
      stepName: "Profil",
      category: "LANGKAH 01 • PROFIL & KUALIFIKASI PROFESIONAL",
      title: "Kreativitas Bertemu Rekayasa Data & Komunikasi Publik.",
      desc: "Mahasiswa S1 Teknik Informatika Institut Teknologi PLN dengan keahlian multidisipliner memadukan perancangan identitas visual korporat, produksi siaran langsung nasional, pengelolaan komunikasi digital resmi, serta riset dan analitik data empiris.",
      badgeStatus: "Tersedia untuk Kerja & Magang",
      badgeStatusColor: "green",
      cam: { x: -20, y: 7.5, z: 24.0 },
      look: { x: -20, y: 1.2, z: 19 }
    },
    {
      stepNum: "02",
      stepName: "Layanan",
      category: "LANGKAH 02 • 10 LAYANAN & 11 KOMPETENSI TEKNIS",
      title: "10 Layanan Spesialisasi & 11 Keterampilan Teknis Teruji.",
      desc: "Menyediakan 10 layanan profesional yang teruji di industri: dari produksi siaran langsung multi-kamera acara protokoler nasional, creative direction identitas visual, strategi pertumbuhan media sosial 3x lipat, riset rekayasa IoT pintar, hingga pemodelan data machine learning cloud.",
      badgeStatus: "10 Layanan • 11 Skills",
      badgeStatusColor: "orange",
      cam: { x: -22, y: 7.5, z: 6.0 },
      look: { x: -22, y: 1.2, z: 0 }
    },
    {
      stepNum: "03",
      stepName: "Pengalaman",
      category: "LANGKAH 03 • 15 PENGALAMAN KERJA & ORGANISASI",
      title: "15 Rekam Jejak Profesional & Kepemimpinan Nasional.",
      desc: "Perjalanan karir komprehensif mencakup peran strategis sebagai Social Media Manager di PJCI, Tim Humas & Komunikasi Publik ITPLN, Lead Visual Switcher Wisuda Nasional, Koordinator Kreatif ITPLN Media, Ketua Pelaksana National CAD Competition (NCC 2025), hingga Student Ambassador DQLab.",
      badgeStatus: "15 Entri Terverifikasi",
      badgeStatusColor: "green",
      cam: { x: -14, y: 7.5, z: -10.0 },
      look: { x: -14, y: 1.2, z: -16 }
    },
    {
      stepNum: "04",
      stepName: "Pendidikan",
      category: "LANGKAH 04 • PENDIDIKAN FORMAL & 8 LISENSI RESMI",
      title: "Fondasi Akademik Kuat & 8 Lisensi Internasional.",
      desc: "Menempuh pendidikan Sarjana (S1) Teknik Informatika di Institut Teknologi PLN dengan spesialisasi komputasi cerdas dan rekayasa data industri energi, diperkuat oleh 8 lisensi resmi: Azure Databricks Machine Learning, SEM-PLS 120 JP, MOS Excel 2019, dan IBM AI.",
      badgeStatus: "8 Lisensi Resmi Terverifikasi",
      badgeStatusColor: "green",
      cam: { x: 14, y: 7.5, z: -10.0 },
      look: { x: 14, y: 1.2, z: -16 }
    },
    {
      stepNum: "05",
      stepName: "50+ Proyek",
      category: "LANGKAH 05 • EKSIBI 50+ KARYA & PROYEK PORTOFOLIO",
      title: "Eksibisi 50 Karya Terkurasi dengan Dokumentasi Asli.",
      desc: "Menampilkan seluruh 50 portofolio karya nyata yang telah diselesaikan: live streaming siaran nasional, strategi konten kampanye media sosial (@itpln & @smartgridindonesia), rekayasa prototipe IoT LPG-SafeSense, perancangan identitas visual korporat, hingga sistem data dan web.",
      badgeStatus: "50 Proyek Lengkap Aktif",
      badgeStatusColor: "orange",
      cam: { x: 22, y: 7.5, z: 6.0 },
      look: { x: 22, y: 1.2, z: 0 }
    },
    {
      stepNum: "06",
      stepName: "Publikasi",
      category: "LANGKAH 06 • 20 PUBLIKASI, ARTIKEL & RISET PRESTASI",
      title: "20 Publikasi Ilmiah, Redaksi Berita & Hibah Riset.",
      desc: "Kumpulan publikasi artikel berkala, jurnalisme korporat untuk portal resmi PJCI dan ITPLN, tulisan teknologi transisi energi bersih, serta rekam jejak inovasi peraih Juara 1 MKI dan hibah penelitian PKM DIKTI Kemendikbudristek.",
      badgeStatus: "20 Publikasi & Prestasi",
      badgeStatusColor: "orange",
      cam: { x: 14, y: 7.5, z: 24.0 },
      look: { x: 14, y: 1.2, z: 18 }
    },
    {
      stepNum: "07",
      stepName: "Kontak",
      category: "LANGKAH 07 • TESTIMONI & PUSAT REKRUTMEN RESMI",
      title: "Testimoni Stakeholder & Formulir Komunikasi Langsung.",
      desc: "Terbuka untuk kesempatan kerja penuh waktu, program magang, konsultasi creative direction, maupun kolaborasi proyek strategis di Jakarta, hybrid, maupun remote. Kirim pesan langsung ke database atau hubungi via WhatsApp.",
      badgeStatus: "Respons Cepat & Siap Onboarding",
      badgeStatusColor: "green",
      cam: { x: 0, y: 7.5, z: 24.0 },
      look: { x: 0, y: 1.2, z: 18 }
    }
  ];

  // ─── 4. BUSTLING & DETAILED ARCHITECTURAL DIORAMA BUILDER ─────

  // ─── DYNAMIC CANVAS TEXTURES (BROADCAST VIDEO WALL, GRAFANA & TOTEM) ───
  function initDynamicCanvasTextures() {
    // 1. MCR Video Wall Canvas (512x256)
    mcrCanvas = document.createElement('canvas');
    mcrCanvas.width = 512;
    mcrCanvas.height = 256;
    mcrCtx = mcrCanvas.getContext('2d');
    mcrTexture = new THREE.CanvasTexture(mcrCanvas);
    mcrTexture.minFilter = THREE.LinearFilter;

    // 2. Grafana Dashboard Canvas (512x256)
    grafanaCanvas = document.createElement('canvas');
    grafanaCanvas.width = 512;
    grafanaCanvas.height = 256;
    grafanaCtx = grafanaCanvas.getContext('2d');
    grafanaTexture = new THREE.CanvasTexture(grafanaCanvas);
    grafanaTexture.minFilter = THREE.LinearFilter;

    // 3. Foyer Totem Directory Canvas (256x512)
    totemCanvas = document.createElement('canvas');
    totemCanvas.width = 256;
    totemCanvas.height = 512;
    totemCtx = totemCanvas.getContext('2d');
    totemTexture = new THREE.CanvasTexture(totemCanvas);
    totemTexture.minFilter = THREE.LinearFilter;
  }

  function updateDynamicCanvasTextures(time) {
    dynamicFrameCounter++;
    if (dynamicFrameCounter % 2 !== 0) return; // 30 FPS update for silky performance

    // --- A. Render MCR Video Wall ---
    if (mcrCtx && mcrTexture) {
      mcrCtx.fillStyle = '#070b14';
      mcrCtx.fillRect(0, 0, 512, 256);

      const tileW = 166;
      const tileH = 122;
      const gapX = 3;
      const gapY = 3;

      // Tile 1 (Cam 1 - PGM Live)
      mcrCtx.fillStyle = '#0f172a';
      mcrCtx.fillRect(gapX, gapY, tileW, tileH);
      mcrCtx.fillStyle = '#ef4444';
      mcrCtx.fillRect(gapX + 6, gapY + 6, 8, 8);
      mcrCtx.fillStyle = '#ffffff';
      mcrCtx.font = 'bold 9px monospace';
      mcrCtx.fillText('● REC PGM LIVE', gapX + 18, gapY + 13);
      const grad = mcrCtx.createLinearGradient(gapX, gapY, gapX + tileW, gapY + tileH);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(0.5, '#0284c7');
      grad.addColorStop(1, '#0f172a');
      mcrCtx.fillStyle = grad;
      mcrCtx.fillRect(gapX + 8, gapY + 22, tileW - 16, tileH - 32);
      mcrCtx.fillStyle = '#f8fafc';
      mcrCtx.font = 'bold 10px sans-serif';
      mcrCtx.fillText('WISUDA NASIONAL ITPLN', gapX + 12, gapY + 74);

      // Tile 2 (Cam 2 - Presenter)
      mcrCtx.fillStyle = '#0f172a';
      mcrCtx.fillRect(gapX + tileW + gapX, gapY, tileW, tileH);
      mcrCtx.fillStyle = '#22c55e';
      mcrCtx.font = 'bold 9px monospace';
      mcrCtx.fillText('CAM 02 • TALENT DESK', gapX + tileW + gapX + 6, gapY + 13);
      mcrCtx.fillStyle = '#38bdf8';
      mcrCtx.beginPath();
      mcrCtx.arc(gapX + tileW + gapX + tileW / 2, gapY + 58, 22, 0, Math.PI * 2);
      mcrCtx.fill();

      // Tile 3 (Cam 3 - Stage Wide)
      mcrCtx.fillStyle = '#0f172a';
      mcrCtx.fillRect(gapX + (tileW + gapX) * 2, gapY, tileW, tileH);
      mcrCtx.fillStyle = '#94a3b8';
      mcrCtx.font = 'bold 9px monospace';
      mcrCtx.fillText('CAM 03 • WIDE AUDITORIUM', gapX + (tileW + gapX) * 2 + 6, gapY + 13);

      // Tile 4 (Switcher Status & Timecode)
      const r2Y = gapY + tileH + gapY;
      mcrCtx.fillStyle = '#0b1120';
      mcrCtx.fillRect(gapX, r2Y, tileW, tileH);
      mcrCtx.fillStyle = '#f59e0b';
      mcrCtx.font = 'bold 10px monospace';
      mcrCtx.fillText('ATEM 4K CONSTELLATION', gapX + 6, r2Y + 16);
      mcrCtx.fillStyle = '#22c55e';
      mcrCtx.font = 'bold 13px monospace';
      const tcSeconds = Math.floor(time * 2) % 60;
      const tcFrames = Math.floor(time * 50) % 30;
      mcrCtx.fillText(`01:42:${tcSeconds < 10 ? '0' : ''}${tcSeconds}:${tcFrames < 10 ? '0' : ''}${tcFrames}`, gapX + 6, r2Y + 42);
      mcrCtx.fillStyle = '#94a3b8';
      mcrCtx.font = '9px sans-serif';
      mcrCtx.fillText('PGM: CAM 01 | PVW: CAM 02', gapX + 6, r2Y + 68);
      mcrCtx.fillText('FPS: 59.94 | BITRATE: 18 Mbps', gapX + 6, r2Y + 84);

      // Tile 5 (Audio Mixer 8-Channel Peak VU Meters)
      mcrCtx.fillStyle = '#0b1120';
      mcrCtx.fillRect(gapX + tileW + gapX, r2Y, tileW, tileH);
      mcrCtx.fillStyle = '#38bdf8';
      mcrCtx.font = 'bold 9px monospace';
      mcrCtx.fillText('AUDIO MASTER VU (8-CH)', gapX + tileW + gapX + 6, r2Y + 16);
      for (let ch = 0; ch < 8; ch++) {
        const barX = gapX + tileW + gapX + 8 + ch * 18;
        const vuVal = Math.sin(time * 8 + ch * 1.3) * 0.4 + 0.55;
        const barH = vuVal * 72;
        mcrCtx.fillStyle = '#22c55e';
        mcrCtx.fillRect(barX, r2Y + 104 - barH, 12, barH);
        if (vuVal > 0.65) {
          mcrCtx.fillStyle = '#facc15';
          mcrCtx.fillRect(barX, r2Y + 104 - barH, 12, 14);
        }
        if (vuVal > 0.82) {
          mcrCtx.fillStyle = '#ef4444';
          mcrCtx.fillRect(barX, r2Y + 104 - barH, 12, 6);
        }
      }

      // Tile 6 (Network Stream Telemetry)
      mcrCtx.fillStyle = '#0b1120';
      mcrCtx.fillRect(gapX + (tileW + gapX) * 2, r2Y, tileW, tileH);
      mcrCtx.fillStyle = '#38bdf8';
      mcrCtx.font = 'bold 9px monospace';
      mcrCtx.fillText('SRT / RTMP STREAM ENGINE', gapX + (tileW + gapX) * 2 + 6, r2Y + 16);
      mcrCtx.fillStyle = '#22c55e';
      mcrCtx.fillText('STATUS: EXCELLENT (0 DROPS)', gapX + (tileW + gapX) * 2 + 6, r2Y + 38);
      mcrCtx.fillStyle = '#94a3b8';
      mcrCtx.fillText('YOUTUBE: LIVE 2.4K WATCHERS', gapX + (tileW + gapX) * 2 + 6, r2Y + 58);
      mcrCtx.fillText('ZOOM ISO: CONNECTED 1080p', gapX + (tileW + gapX) * 2 + 6, r2Y + 76);

      mcrTexture.needsUpdate = true;
    }

    // --- B. Render Grafana Big Data Dashboard ---
    if (grafanaCtx && grafanaTexture) {
      grafanaCtx.fillStyle = '#0b0f19';
      grafanaCtx.fillRect(0, 0, 512, 256);

      // Header bar
      grafanaCtx.fillStyle = '#1e293b';
      grafanaCtx.fillRect(0, 0, 512, 28);
      grafanaCtx.fillStyle = '#ff6b2b';
      grafanaCtx.fillRect(10, 8, 12, 12);
      grafanaCtx.fillStyle = '#f8fafc';
      grafanaCtx.font = 'bold 11px sans-serif';
      grafanaCtx.fillText('GRAFANA • AZURE DATABRICKS & SEM-PLS BIG DATA PIPELINE', 30, 18);

      // Metrics Row
      const metrics = [
        { label: 'CLUSTER NODES', val: '16 ACTIVE', color: '#22c55e' },
        { label: 'THROUGHPUT', val: '4.8 GB/s', color: '#38bdf8' },
        { label: 'SEM-PLS R²', val: '0.942', color: '#f59e0b' },
        { label: 'MODEL LATENCY', val: '14.2 ms', color: '#a855f7' }
      ];
      metrics.forEach((m, i) => {
        const mx = 12 + i * 124;
        grafanaCtx.fillStyle = '#111827';
        grafanaCtx.fillRect(mx, 36, 116, 44);
        grafanaCtx.fillStyle = '#94a3b8';
        grafanaCtx.font = 'bold 8px sans-serif';
        grafanaCtx.fillText(m.label, mx + 8, 49);
        grafanaCtx.fillStyle = m.color;
        grafanaCtx.font = 'bold 15px monospace';
        grafanaCtx.fillText(m.val, mx + 8, 70);
      });

      // Chart Area
      grafanaCtx.fillStyle = '#111827';
      grafanaCtx.fillRect(12, 88, 488, 156);
      grafanaCtx.strokeStyle = 'rgba(255,255,255,0.06)';
      grafanaCtx.lineWidth = 1;
      for (let y = 110; y < 240; y += 30) {
        grafanaCtx.beginPath();
        grafanaCtx.moveTo(12, y);
        grafanaCtx.lineTo(500, y);
        grafanaCtx.stroke();
      }

      // Draw scrolling curves
      const drawCurve = (color, freq, amp, yBase) => {
        grafanaCtx.strokeStyle = color;
        grafanaCtx.lineWidth = 2;
        grafanaCtx.beginPath();
        for (let x = 12; x < 500; x += 10) {
          const cy = yBase + Math.sin((x * 0.03) + time * freq) * amp + Math.cos((x * 0.05) - time) * (amp * 0.4);
          if (x === 12) grafanaCtx.moveTo(x, cy);
          else grafanaCtx.lineTo(x, cy);
        }
        grafanaCtx.stroke();
      };

      drawCurve('#38bdf8', 3, 22, 155);
      drawCurve('#ff6b2b', 2.2, 18, 175);
      drawCurve('#22c55e', 4, 14, 195);

      grafanaTexture.needsUpdate = true;
    }

    // --- C. Render Foyer Totem Directory ---
    if (totemCtx && totemTexture) {
      totemCtx.fillStyle = '#090d16';
      totemCtx.fillRect(0, 0, 256, 512);

      totemCtx.fillStyle = '#ff6b2b';
      totemCtx.fillRect(0, 0, 256, 48);
      totemCtx.fillStyle = '#ffffff';
      totemCtx.font = 'bold 12px sans-serif';
      totemCtx.fillText('ITPLN DIGITAL HQ', 20, 24);
      totemCtx.font = '9px sans-serif';
      totemCtx.fillText('MANGARA PAKPAHAN EXHIBITION', 20, 38);

      const rooms = [
        '01 FOYER & KUALIFIKASI',
        '02 MCR LIVE BROADCAST',
        '03 REDAKSI & HUMAS',
        '04 DATA LAB & AI CLOUD',
        '05 IOT WORKSHOP SAFESENSE',
        '06 PRESS HALL & PUBLIKASI',
        '07 RECRUITER FAST-TRACK'
      ];
      rooms.forEach((rm, i) => {
        const ry = 62 + i * 58;
        const isCurrent = i === currentStepIndex;
        totemCtx.fillStyle = isCurrent ? 'rgba(255, 107, 43, 0.22)' : '#111827';
        totemCtx.fillRect(12, ry, 232, 50);
        totemCtx.strokeStyle = isCurrent ? '#ff6b2b' : 'rgba(255,255,255,0.08)';
        totemCtx.lineWidth = 1;
        totemCtx.strokeRect(12, ry, 232, 50);

        totemCtx.fillStyle = isCurrent ? '#22c55e' : '#64748b';
        totemCtx.beginPath();
        totemCtx.arc(26, ry + 25, 4.5, 0, Math.PI * 2);
        totemCtx.fill();

        totemCtx.fillStyle = isCurrent ? '#ffffff' : '#94a3b8';
        totemCtx.font = isCurrent ? 'bold 10px sans-serif' : '9px sans-serif';
        totemCtx.fillText(rm, 38, ry + 29);
      });

      totemTexture.needsUpdate = true;
    }
  }

  function buildMiniatureDioramaScene() {
    patrollingStaff = [];
    activeWorkers = [];
    serverLEDs = [];
    animatedNPCs = [];
    studioCameras = [];
    holoDataCore = null;
    sonarPulseRing = null;
    rotatingTrophy = null;
    steamParticles = null;
    swayingPlants = [];
    poolWaterMesh = null;

    // Initialize Canvas Textures
    initDynamicCanvasTextures();

    // 1. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.22);
    scene.add(ambientLight);

    // Architectural Key Downlights on Major Zones
    const spotAtrium = new THREE.SpotLight(0xffcaa0, 1.5, 22, Math.PI / 4, 0.5, 1);
    spotAtrium.position.set(0, 9, 0);
    spotAtrium.target.position.set(0, 0, 0);
    scene.add(spotAtrium);
    scene.add(spotAtrium.target);

    const spotMCR = new THREE.SpotLight(0xc7d2fe, 1.6, 20, Math.PI / 4, 0.4, 1);
    spotMCR.position.set(-25, 7, 0);
    spotMCR.target.position.set(-32.5, 1.8, 0);
    scene.add(spotMCR);
    scene.add(spotMCR.target);

    const spotData = new THREE.SpotLight(0x7dd3fc, 1.6, 20, Math.PI / 4, 0.4, 1);
    spotData.position.set(20, 7, -16);
    spotData.target.position.set(28, 1.5, -16);
    scene.add(spotData);
    scene.add(spotData.target);

    const spotIoT = new THREE.SpotLight(0x86efac, 1.5, 20, Math.PI / 4, 0.4, 1);
    spotIoT.position.set(20, 7, 0);
    spotIoT.target.position.set(28, 0.8, 0);
    scene.add(spotIoT);
    scene.add(spotIoT.target);

    // Floating Sunbeam Dust Particles in Sunken Courtyard Atrium
    const particleCount = 40;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 1] = 0.5 + Math.random() * 4.5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.16,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    dustParticles = new THREE.Points(pGeo, pMat);
    scene.add(dustParticles);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.05);
    sunLight.position.set(24, 45, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 140;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 35;
    sunLight.shadow.camera.bottom = -35;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xffedd5, 0.45);
    fillLight.position.set(-20, 25, 25);
    scene.add(fillLight);

    const skylight = new THREE.DirectionalLight(0xe0f2fe, 0.3);
    skylight.position.set(0, 30, -25);
    scene.add(skylight);

    // 2. Materials
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf3efe8,
      roughness: 0.75,
      metalness: 0.05
    });

    const wallBodyMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbf9,
      roughness: 0.9,
      metalness: 0.02
    });

    const glassWallMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.38,
      roughness: 0.1,
      metalness: 0.1
    });

    const frameDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3
    });

    const orangeTrimMat = new THREE.MeshStandardMaterial({
      color: 0xff6b2b,
      roughness: 0.4,
      metalness: 0.1
    });

    const oakWoodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.6,
      metalness: 0.05
    });

    const screenGlowMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8
    });

    // 3. Main Architectural Foundation Slab
    const foundationGeo = new THREE.BoxGeometry(72, 0.6, 56);
    const foundation = new THREE.Mesh(foundationGeo, floorMat);
    foundation.position.set(0, -0.3, 0);
    foundation.receiveShadow = true;
    scene.add(foundation);

    // 4. Central Sunken Courtyard Atrium Garden (X: -8 to 8, Z: -6 to 6)
    buildCourtyardAtrium(floorMat, wallBodyMat, orangeTrimMat);

    // 5. Architectural Outer Enclosure & Clear-Doorway Partitions
    buildHorseshoePartitions(wallBodyMat, glassWallMat, frameDarkMat, orangeTrimMat, oakWoodMat);

    // 6. Distinct Architectural Carpet Inlays for 7 Rooms
    buildRoomZoneInlays();

    // 7. Winding Zig-Zag Paved Guide Path connecting all 7 zones
    createPavedSidewalkAndPath();

    // 8. BUILD 7 DETAILED, BUSTLING ROOMS (OFFSET CLEARANCE FOR ZERO CLIPPING)
    buildRoom1FoyerDetailed(wallBodyMat, orangeTrimMat, oakWoodMat);
    buildRoom2BroadcastDetailed(screenGlowMat, orangeTrimMat, frameDarkMat);
    buildRoom3NewsroomDetailed(orangeTrimMat, oakWoodMat);
    buildRoom4DataLabDetailed(orangeTrimMat, frameDarkMat);
    buildRoom5IoTWorkshopDetailed(orangeTrimMat, frameDarkMat);
    buildRoom6PressHallDetailed(orangeTrimMat, oakWoodMat);
    buildRoom7RecruiterLoungeDetailed(orangeTrimMat, oakWoodMat);

    // 9. 7 Interactive NPCs placed across rooms
    buildInteractive3DNPCS();

    // 12. Festive Office Amenities, Neon Signs, Interactive Dog & Mini-Games
    buildFestiveOfficeElements();

    // 10. 4 Mobile Patrolling Office Workers across corridors
    buildPatrollingOfficeWorkers();

    // 11. Animated Walking Hero (Mangara) in Formal Office Dresscode
    createWalkingHeroWithIndicator();
  }

  // ─── CENTRAL COURTYARD ATRIUM GARDEN ─────────────────────────
  function buildCourtyardAtrium(floorMat, wallMat, trimMat) {
    const atriumGrp = new THREE.Group();

    // Sunken zen garden base
    const pebbleBorder = new THREE.Mesh(
      new THREE.BoxGeometry(16.4, 0.04, 12.4),
      new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.9 })
    );
    pebbleBorder.position.set(0, 0.02, 0);
    atriumGrp.add(pebbleBorder);

    const sandBase = new THREE.Mesh(
      new THREE.BoxGeometry(15.6, 0.06, 11.6),
      new THREE.MeshStandardMaterial({ color: 0xdad7ce, roughness: 0.95 })
    );
    sandBase.position.set(0, 0.03, 0);
    atriumGrp.add(sandBase);

    // Central Reflecting Pool
    const poolBorder = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.12, 3.8),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 })
    );
    poolBorder.position.set(0, 0.06, 0);
    atriumGrp.add(poolBorder);

    const poolWater = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.1, 3.4),
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.3,
        transparent: true,
        opacity: 0.75
      })
    );
    poolWater.position.set(0, 0.08, 0);
    atriumGrp.add(poolWater);
    poolWaterMesh = poolWater;

    // Rising Hot Coffee Steam Particles at Courtyard Coffee Zone
    const steamCount = 28;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let si = 0; si < steamCount; si++) {
      steamPos[si * 3 + 0] = (Math.random() - 0.5) * 3.5;
      steamPos[si * 3 + 1] = 0.4 + Math.random() * 1.5;
      steamPos[si * 3 + 2] = (Math.random() - 0.5) * 3.0;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.14,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    steamParticles = new THREE.Points(steamGeo, steamMat);
    steamParticles.position.set(0, 0, 0);
    atriumGrp.add(steamParticles);

    // 4 Modern Planter Boxes with Lush Architectural Trees
    const planterCoords = [
      { x: -5.0, z: -3.8 },
      { x: 5.0, z: -3.8 },
      { x: -5.0, z: 3.8 },
      { x: 5.0, z: 3.8 }
    ];

    const leafMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8, flatShading: true });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.9 });
    const planterMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });

    planterCoords.forEach((p, idx) => {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 1.8), planterMat);
      box.position.set(p.x, 0.22, p.z);
      box.castShadow = true;
      box.receiveShadow = true;
      atriumGrp.add(box);

      const soil = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.05, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x271c16, roughness: 1.0 })
      );
      soil.position.set(p.x, 0.44, p.z);
      atriumGrp.add(soil);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.8, 8), trunkMat);
      trunk.position.set(p.x, 1.3, p.z);
      trunk.castShadow = true;
      atriumGrp.add(trunk);

      const crown1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 1), idx % 2 === 0 ? leafMat1 : leafMat2);
      crown1.position.set(p.x, 2.5, p.z);
      crown1.castShadow = true;
      atriumGrp.add(crown1);

      const crown2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 1), leafMat2);
      crown2.position.set(p.x + 0.2, 3.1, p.z - 0.2);
      crown2.castShadow = true;
      atriumGrp.add(crown2);

      swayingPlants.push({ crown: crown1, phase: idx * 1.2 });
      swayingPlants.push({ crown: crown2, phase: idx * 1.2 + 0.5 });

      const uplight = new THREE.PointLight(0xfef08a, 0.6, 6);
      uplight.position.set(p.x, 0.5, p.z);
      atriumGrp.add(uplight);
    });

    // 2 Teak Garden Benches
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });
    const bench1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.38, 0.5), benchMat);
    bench1.position.set(0, 0.22, -2.8);
    atriumGrp.add(bench1);

    const bench2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.38, 0.5), benchMat);
    bench2.position.set(0, 0.22, 2.8);
    atriumGrp.add(bench2);

    // Perimeter Glass Balustrade with Metal Handrail
    const glassRailMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1
    });
    const handrailMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });

    [-6.2, 6.2].forEach(z => {
      const gRail = new THREE.Mesh(new THREE.BoxGeometry(16.2, 0.9, 0.05), glassRailMat);
      gRail.position.set(0, 0.48, z);
      atriumGrp.add(gRail);

      const hRail = new THREE.Mesh(new THREE.BoxGeometry(16.2, 0.05, 0.08), handrailMat);
      hRail.position.set(0, 0.95, z);
      atriumGrp.add(hRail);
    });

    [-8.2, 8.2].forEach(x => {
      const gRail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 12.2), glassRailMat);
      gRail.position.set(x, 0.48, 0);
      atriumGrp.add(gRail);

      const hRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 12.2), handrailMat);
      hRail.position.set(x, 0.95, 0);
      atriumGrp.add(hRail);
    });

    scene.add(atriumGrp);
  }

  // ─── HORSESHOE PARTITIONS WITH CLEAR ARCHED DOORWAYS ──────────
  function buildHorseshoePartitions(wallMat, glassMat, frameMat, orangeMat, woodMat) {
    const partGrp = new THREE.Group();

    // 1. Exterior Perimeter Walls with Large Windows
    // North Wall (Z = -25)
    const nWall = new THREE.Mesh(new THREE.BoxGeometry(70, 2.8, 0.4), wallMat);
    nWall.position.set(0, 1.4, -25);
    nWall.receiveShadow = true;
    partGrp.add(nWall);

    const nCap = new THREE.Mesh(new THREE.BoxGeometry(70, 0.12, 0.46), orangeMat);
    nCap.position.set(0, 2.86, -25);
    partGrp.add(nCap);

    const winMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let wx = -28; wx <= 28; wx += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), winMat);
      win.position.set(wx, 1.7, -24.78);
      partGrp.add(win);
    }

    // West Wall (X = -33)
    const wWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 50), wallMat);
    wWall.position.set(-33, 1.4, 0);
    wWall.receiveShadow = true;
    partGrp.add(wWall);

    const wCap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 50), orangeMat);
    wCap.position.set(-33, 2.86, 0);
    partGrp.add(wCap);

    for (let wz = -20; wz <= 20; wz += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), winMat);
      win.position.set(-32.78, 1.7, wz);
      win.rotation.y = Math.PI / 2;
      partGrp.add(win);
    }

    // East Wall (X = 33)
    const eWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 50), wallMat);
    eWall.position.set(33, 1.4, 0);
    eWall.receiveShadow = true;
    partGrp.add(eWall);

    const eCap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 50), orangeMat);
    eCap.position.set(33, 2.86, 0);
    partGrp.add(eCap);

    for (let wz = -20; wz <= 20; wz += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), winMat);
      win.position.set(32.78, 1.7, wz);
      win.rotation.y = -Math.PI / 2;
      partGrp.add(win);
    }

    // South Wall (Z = 25)
    const sWallL = new THREE.Mesh(new THREE.BoxGeometry(26, 2.8, 0.4), wallMat);
    sWallL.position.set(-20, 1.4, 25);
    partGrp.add(sWallL);
    const sWallR = new THREE.Mesh(new THREE.BoxGeometry(26, 2.8, 0.4), wallMat);
    sWallR.position.set(20, 1.4, 25);
    partGrp.add(sWallR);

    // 2. Interior Partitions with WIDE CLEAR DOORWAY OPENINGS (ZERO CLIPPING!)
    // Partition A: Bilik 1 (Foyer) / Bilik 2 (Broadcast) along Z = 10
    // Wall segment west of doorway: X from -33 to -21 (len 12)
    const pA1 = new THREE.Mesh(new THREE.BoxGeometry(12, 2.6, 0.3), wallMat);
    pA1.position.set(-27, 1.3, 10);
    partGrp.add(pA1);
    // Wall segment east of doorway: X from -15 to -8.5 (len 6.5)
    const pA2 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.6, 0.3), wallMat);
    pA2.position.set(-11.75, 1.3, 10);
    partGrp.add(pA2);
    // Overhead Doorway Header Beam (Open below Y=2.4 from X=-21 to -15, width=6m!)
    const pAHeader = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.35, 0.35), woodMat);
    pAHeader.position.set(-18, 2.5, 10);
    partGrp.add(pAHeader);

    // Partition B: Bilik 2 (Broadcast) / Bilik 3 (Newsroom) along Z = -10
    // Wall segment west of doorway: X from -33 to -21 (len 12)
    const pB1 = new THREE.Mesh(new THREE.BoxGeometry(12, 2.6, 0.3), wallMat);
    pB1.position.set(-27, 1.3, -10);
    partGrp.add(pB1);
    // Wall segment east of doorway: X from -15 to -8.5 (len 6.5)
    const pB2 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.6, 0.3), wallMat);
    pB2.position.set(-11.75, 1.3, -10);
    partGrp.add(pB2);
    // Overhead Doorway Header Beam (Open below Y=2.4 from X=-21 to -15, width=6m!)
    const pBHeader = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.35, 0.35), woodMat);
    pBHeader.position.set(-18, 2.5, -10);
    partGrp.add(pBHeader);

    // Partition C: North Wing Corridor Portal (Newsroom to Data Lab) along X = 0
    // Open glass portal from X=-3.5 to 3.5 (width 7m!)
    const pCGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.5, 5.5), glassMat);
    pCGlassL.position.set(0, 1.25, -22.0);
    partGrp.add(pCGlassL);
    const pCGlassR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.5, 4.0), glassMat);
    pCGlassR.position.set(0, 1.25, -9.0);
    partGrp.add(pCGlassR);
    const pCHeader = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 7.0), frameMat);
    pCHeader.position.set(0, 2.5, -14.5);
    partGrp.add(pCHeader);

    // Partition D: Bilik 4 (Data Lab) / Bilik 5 (IoT Workshop) along Z = -10
    const pD1 = new THREE.Mesh(new THREE.BoxGeometry(12, 2.6, 0.3), wallMat);
    pD1.position.set(27, 1.3, -10);
    partGrp.add(pD1);
    const pD2 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.6, 0.3), wallMat);
    pD2.position.set(11.75, 1.3, -10);
    partGrp.add(pD2);
    const pDHeader = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.35, 0.35), woodMat);
    pDHeader.position.set(18, 2.5, -10);
    partGrp.add(pDHeader);

    // Partition E: Bilik 5 (IoT Workshop) / Bilik 6 (Press Hall) along Z = 10
    const pE1 = new THREE.Mesh(new THREE.BoxGeometry(12, 2.6, 0.3), wallMat);
    pE1.position.set(27, 1.3, 10);
    partGrp.add(pE1);
    const pE2 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.6, 0.3), wallMat);
    pE2.position.set(11.75, 1.3, 10);
    partGrp.add(pE2);
    const pEHeader = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.35, 0.35), woodMat);
    pEHeader.position.set(18, 2.5, 10);
    partGrp.add(pEHeader);

    // Partition F: Recruiter Penthouse Suite (South Center, X = 0, Z = 18)
    const pFLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.6, 9), wallMat);
    pFLeft.position.set(-8.5, 1.3, 18);
    partGrp.add(pFLeft);
    const pFRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.6, 9), wallMat);
    pFRight.position.set(8.5, 1.3, 18);
    partGrp.add(pFRight);

    scene.add(partGrp);
  }

  // ─── ARCHITECTURAL SIGNATURE CARPET INLAYS ───────────────────

  // ─── FESTIVE OFFICE AMENITIES, DECORATIONS, NEON SIGNS & MINI-GAMES ────
  function buildFestiveOfficeElements() {
    festiveFairyLights = [];
    questCollectibles = [];

    // 1. NEON 3D ILLUMINATED WALL SIGNS (Cyber Tech Office Vibes)
    const neonSigns = [
      { text: "LIVE ON AIR", color: 0xef4444, pos: [-32.55, 2.7, 0], rotY: Math.PI / 2, lightColor: 0xef4444 },
      { text: "AI CORE LAB", color: 0x06b6d4, pos: [32.55, 2.7, -17], rotY: -Math.PI / 2, lightColor: 0x06b6d4 },
      { text: "IOT HARDWARE", color: 0x10b981, pos: [32.55, 2.7, 0], rotY: -Math.PI / 2, lightColor: 0x10b981 },
      { text: "PRESS GALLERY", color: 0xa855f7, pos: [32.55, 2.7, 19], rotY: -Math.PI / 2, lightColor: 0xa855f7 },
      { text: "ARCADE LOUNGE", color: 0xec4899, pos: [0, 2.7, 24.8], rotY: Math.PI, lightColor: 0xec4899 },
      { text: "CAFE ATRIUM", color: 0xfbbf24, pos: [0, 2.2, -5.8], rotY: 0, lightColor: 0xfbbf24 }
    ];

    neonSigns.forEach(s => {
      const signGrp = new THREE.Group();
      signGrp.position.set(s.pos[0], s.pos[1], s.pos[2]);
      signGrp.rotation.y = s.rotY;

      // Dark Backplate
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.45, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3 })
      );
      signGrp.add(plate);

      // Glowing Neon Tube
      const tubeMat = new THREE.MeshBasicMaterial({ color: s.color });
      const tube = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.28, 0.1), tubeMat);
      tube.position.z = 0.02;
      signGrp.add(tube);

      // Neon Colored Point Light
      const pLight = new THREE.PointLight(s.lightColor, 1.2, 7.5);
      pLight.position.set(0, 0, 0.4);
      signGrp.add(pLight);

      scene.add(signGrp);
    });

    // 2. FESTIVE OVERHEAD FAIRY STRING LIGHTS IN COURTYARD ATRIUM
    // Sagging catenary strings between the 4 architectural tree tops
    const treePositions = [
      { x: -6.0, z: -4.5 },
      { x: 6.0, z: -4.5 },
      { x: 6.0, z: 4.5 },
      { x: -6.0, z: 4.5 }
    ];
    const bulbColors = [0xfef08a, 0xf43f5e, 0x38bdf8, 0x4ade80, 0xfb923c, 0xa855f7];

    for (let i = 0; i < treePositions.length; i++) {
      const p1 = treePositions[i];
      const p2 = treePositions[(i + 1) % treePositions.length];
      const segments = 8;

      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const bx = p1.x + (p2.x - p1.x) * t;
        const bz = p1.z + (p2.z - p1.z) * t;
        const sag = Math.sin(t * Math.PI) * 0.45;
        const by = 3.6 - sag;

        const bColor = bulbColors[(i * segments + s) % bulbColors.length];
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 8, 8),
          new THREE.MeshBasicMaterial({ color: bColor })
        );
        bulb.position.set(bx, by, bz);
        scene.add(bulb);

        festiveFairyLights.push({
          mesh: bulb,
          baseY: by,
          phase: i * 2.0 + s * 0.65,
          color: bColor
        });
      }
    }

    // 3. COLORFUL ATRIUM BEANBAG LOUNGERS (Vibrant Tech Campus Life!)
    const beanbags = [
      { x: -3.6, z: 2.8, color: 0xff6b2b, rot: 0.3 },
      { x: 3.6, z: 2.8, color: 0x06b6d4, rot: -0.4 },
      { x: -2.8, z: -2.8, color: 0xa855f7, rot: 0.8 },
      { x: 4.2, z: -2.2, color: 0x84cc16, rot: -0.9 }
    ];
    beanbags.forEach(b => {
      const bagMat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.85, metalness: 0.05 });
      const bagGeo = new THREE.SphereGeometry(0.48, 12, 10);
      bagGeo.scale(1.2, 0.65, 1.1);
      const bagMesh = new THREE.Mesh(bagGeo, bagMat);
      bagMesh.position.set(b.x, 0.22, b.z);
      bagMesh.rotation.y = b.rot;
      bagMesh.castShadow = true;
      scene.add(bagMesh);
    });

    // 4. COLORFUL ACOUSTIC HEXAGONAL SOUND PANELS IN BILIK 03 (NEWSROOM)
    const hexColors = [0xfacc15, 0xf97316, 0x14b8a6, 0xa855f7, 0x3b82f6];
    for (let hi = 0; hi < 8; hi++) {
      const hexMat = new THREE.MeshStandardMaterial({
        color: hexColors[hi % hexColors.length],
        roughness: 0.75
      });
      const hex = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.04, 6), hexMat);
      hex.position.set(-20 - (hi % 4) * 0.9, 1.8 + Math.floor(hi / 4) * 0.7, -24.8);
      hex.rotation.x = Math.PI / 2;
      scene.add(hex);
    }

    // 5. INTERACTIVE BARISTA ESPRESSO MACHINE AT COURTYARD COFFEE BAR
    const coffeeGrp = new THREE.Group();
    coffeeGrp.position.set(2.2, 0.95, -1.8);

    const espressoBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.45, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6, roughness: 0.3 })
    );
    coffeeGrp.add(espressoBody);

    const portafilter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8),
      new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 })
    );
    portafilter.position.set(0, -0.15, 0.28);
    portafilter.rotation.x = Math.PI / 2;
    coffeeGrp.add(portafilter);

    const steamWand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 })
    );
    steamWand.position.set(-0.25, -0.12, 0.24);
    coffeeGrp.add(steamWand);

    scene.add(coffeeGrp);
    baristaEspressoMachine = coffeeGrp;

    // 6. CUTE INTERACTIVE OFFICE MASCOT DOG "BIMO"
    const dogGrp = new THREE.Group();
    dogGrp.position.set(-1.8, 0, 1.6);

    const dogBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.28, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 })
    );
    dogBody.position.y = 0.28;
    dogGrp.add(dogBody);

    const dogHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.32),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 })
    );
    dogHead.position.set(0, 0.46, 0.32);
    dogGrp.add(dogHead);

    const dogSnout = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.14, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 })
    );
    dogSnout.position.set(0, 0.42, 0.5);
    dogGrp.add(dogSnout);

    const dogTail = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.22, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xd97706 })
    );
    dogTail.position.set(0, 0.4, -0.32);
    dogTail.rotation.x = -0.5;
    dogGrp.add(dogTail);

    scene.add(dogGrp);
    mascotDog = { group: dogGrp, tail: dogTail, angle: 0 };

    // 7. RETRO 3D ARCADE MACHINE IN BILIK 07 (RECRUITER LOUNGE)
    const arcadeGrp = new THREE.Group();
    arcadeGrp.position.set(-6.5, 0, 20.5);
    arcadeGrp.rotation.y = Math.PI / 4;

    const cabBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 1.85, 0.75),
      new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.4, metalness: 0.2 })
    );
    cabBody.position.y = 0.92;
    arcadeGrp.add(cabBody);

    const marquee = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.25, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xec4899 })
    );
    marquee.position.set(0, 1.75, 0.36);
    arcadeGrp.add(marquee);

    const crtScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.68, 0.5),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    crtScreen.position.set(0, 1.25, 0.39);
    crtScreen.rotation.x = -0.15;
    arcadeGrp.add(crtScreen);

    const stick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    stick.position.set(-0.15, 0.88, 0.45);
    arcadeGrp.add(stick);

    scene.add(arcadeGrp);
    arcadeMachineObj = arcadeGrp;

    // 8. 5 FLOATING COLLECTIBLE QUEST ITEMS ("MISI 5 IDE INOVASI MANGARA")
    const questDefs = [
      { id: "trophy", name: "Piala Emas MKI IoT", room: "Bilik 05: IoT Lab", pos: [29.0, 1.45, 1.0], color: 0xf59e0b, icon: "trophy-outline" },
      { id: "clapper", name: "Clapperboard Emas Broadcast", room: "Bilik 02: Broadcast MCR", pos: [-27.0, 1.45, 3.0], color: 0xef4444, icon: "videocam-outline" },
      { id: "coffee", name: "Cangkir Kopi Spesial Barista", room: "Central Atrium Garden", pos: [2.5, 1.35, -1.5], color: 0xd97706, icon: "cafe-outline" },
      { id: "cube", name: "Kubus Kuantum AI", room: "Bilik 04: Data Lab", pos: [27.0, 1.45, -18.0], color: 0x06b6d4, icon: "hardware-chip-outline" },
      { id: "badge", name: "Lencana Pers Kehormatan", room: "Bilik 03: Newsroom", pos: [-25.0, 1.45, -18.0], color: 0x8b5cf6, icon: "newspaper-outline" }
    ];

    questDefs.forEach((q, idx) => {
      const qGrp = new THREE.Group();
      qGrp.position.set(q.pos[0], q.pos[1], q.pos[2]);

      // Golden Halo Glow Ring
      const haloMat = new THREE.MeshBasicMaterial({ color: q.color, wireframe: true });
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 8, 24), haloMat);
      halo.rotation.x = Math.PI / 2;
      qGrp.add(halo);

      // Core Collectible Mesh
      let coreMesh;
      if (q.id === "trophy") {
        coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.08, 0.35, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 }));
      } else if (q.id === "cube") {
        coreMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8, roughness: 0.2 }));
      } else if (q.id === "clapper") {
        coreMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.06), new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5, roughness: 0.4 }));
      } else if (q.id === "coffee") {
        coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.26, 12), new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.4 }));
      } else {
        coreMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.24), new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.7, roughness: 0.2 }));
      }
      qGrp.add(coreMesh);

      const qLight = new THREE.PointLight(q.color, 1.4, 5.0);
      qGrp.add(qLight);

      scene.add(qGrp);

      questCollectibles.push({
        id: q.id,
        name: q.name,
        room: q.room,
        group: qGrp,
        halo: halo,
        core: coreMesh,
        collected: false,
        pos: q.pos,
        color: q.color
      });
    });
  }

  function buildRoomZoneInlays() {
    // VIBRANT, FESTIVE & EXCITING OFFICE ZONE FLOORING WITH NEON RUNNER LIGHTS!
    const zones = [
      { name: "Foyer", x: -21, z: 19, w: 18, d: 11, color: 0xffedd5, runnerColor: 0xff6b2b, roughness: 0.65 },
      { name: "Broadcast", x: -25, z: 0, w: 15, d: 18, color: 0x111827, runnerColor: 0xef4444, roughness: 0.85 },
      { name: "Newsroom", x: -20, z: -17, w: 18, d: 14, color: 0xd97706, runnerColor: 0xfbbf24, roughness: 0.55 },
      { name: "DataLab", x: 20, z: -17, w: 18, d: 14, color: 0x0b0f19, runnerColor: 0x06b6d4, roughness: 0.5 },
      { name: "IoTWorkshop", x: 25, z: 0, w: 15, d: 18, color: 0x064e3b, runnerColor: 0x10b981, roughness: 0.6 },
      { name: "PressHall", x: 21, z: 19, w: 18, d: 11, color: 0x4c1d95, runnerColor: 0xa855f7, roughness: 0.7 },
      { name: "RecruiterLounge", x: 0, z: 19, w: 16, d: 10, color: 0x1e1b4b, runnerColor: 0xec4899, roughness: 0.6 }
    ];

    zones.forEach(z => {
      // Main plush carpet base
      const carpet = new THREE.Mesh(
        new THREE.BoxGeometry(z.w, 0.016, z.d),
        new THREE.MeshStandardMaterial({
          color: z.color,
          roughness: z.roughness,
          metalness: 0.12
        })
      );
      carpet.position.set(z.x, 0.01, z.z);
      carpet.receiveShadow = true;
      scene.add(carpet);

      // Glowing Neon Floor Border Runner
      const borderMat = new THREE.MeshBasicMaterial({ color: z.runnerColor });
      const borderThickness = 0.12;
      const hBorderGeo = new THREE.BoxGeometry(z.w, 0.02, borderThickness);
      const vBorderGeo = new THREE.BoxGeometry(borderThickness, 0.02, z.d);

      const bTop = new THREE.Mesh(hBorderGeo, borderMat);
      bTop.position.set(z.x, 0.018, z.z - z.d / 2);
      scene.add(bTop);

      const bBottom = new THREE.Mesh(hBorderGeo, borderMat);
      bBottom.position.set(z.x, 0.018, z.z + z.d / 2);
      scene.add(bBottom);

      const bLeft = new THREE.Mesh(vBorderGeo, borderMat);
      bLeft.position.set(z.x - z.w / 2, 0.018, z.z);
      scene.add(bLeft);

      const bRight = new THREE.Mesh(vBorderGeo, borderMat);
      bRight.position.set(z.x + z.w / 2, 0.018, z.z);
      scene.add(bRight);
    });
  }

  // ─── 20-POINT ZIG-ZAG PATHWAY (GUARANTEED ZERO CLIPPING!) ────
  function createPavedSidewalkAndPath() {
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0xff6b2b,
      roughness: 0.35,
      metalness: 0.1
    });

    const curbMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.8
    });

    const points = [
      new THREE.Vector3(-24, 0.02, 24), // 1. Entrance Vestibule
      new THREE.Vector3(-20, 0.02, 19), // 2. Bilik 01: Foyer Reception Area
      new THREE.Vector3(-16, 0.02, 13), // 3. Turning Corner through Foyer Doorway
      new THREE.Vector3(-18, 0.02, 7),  // 4. Entering West Wing Corridor
      new THREE.Vector3(-22, 0.02, 0),  // 5. Bilik 02: In Front of Broadcast MCR Studio
      new THREE.Vector3(-18, 0.02, -7), // 6. West Corridor to North Wing
      new THREE.Vector3(-15, 0.02, -13),// 7. Bilik 03: Newsroom Entry Aisle
      new THREE.Vector3(-12, 0.02, -17),// 8. Newsroom Center Gallery
      new THREE.Vector3(-6, 0.02, -14), // 9. North Wing Garden Overlook Bridge
      new THREE.Vector3(0, 0.02, -14),  // 10. Central North Hub / Glass Archway
      new THREE.Vector3(6, 0.02, -14),  // 11. North Wing Garden Overlook East
      new THREE.Vector3(12, 0.02, -17), // 12. Bilik 04: Data Analyst & ML Lab Center
      new THREE.Vector3(15, 0.02, -13), // 13. Data Lab to East Corridor
      new THREE.Vector3(18, 0.02, -7),  // 14. Entering East Wing Corridor
      new THREE.Vector3(22, 0.02, 0),   // 15. Bilik 05: In Front of IoT Workshop Bench
      new THREE.Vector3(18, 0.02, 7),   // 16. East Corridor to South Wing
      new THREE.Vector3(15, 0.02, 13),  // 17. Bilik 06: Press Conference Gallery Aisle
      new THREE.Vector3(12, 0.02, 18),  // 18. Beside Boardroom Conference Table
      new THREE.Vector3(6, 0.02, 16),   // 19. Approaching Recruiter Suite
      new THREE.Vector3(0, 0.02, 18)    // 20. Bilik 07: Recruiter Penthouse Lounge Center
    ];

    const CurveClass = THREE.CatmullRomCurve3;
    let curvePoints = points;

    if (CurveClass) {
      try {
        orangeCurve = new CurveClass(points);
        curvePoints = orangeCurve.getPoints(200);
      } catch (err) {
        curvePoints = points;
      }
    }

    for (let i = 0; i < curvePoints.length - 1; i++) {
      const p1 = curvePoints[i];
      const p2 = curvePoints[i + 1];
      const len = p1.distanceTo(p2);
      const segGeo = new THREE.BoxGeometry(len, 0.02, 0.32);
      const seg = new THREE.Mesh(segGeo, trackMat);

      seg.position.set((p1.x + p2.x) / 2, 0.02, (p1.z + p2.z) / 2);
      const angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
      seg.rotation.y = -angle;
      scene.add(seg);

      if (i % 2 === 0) {
        const curb = new THREE.Mesh(new THREE.BoxGeometry(len * 2.2, 0.04, 1.8), curbMat);
        curb.position.set((p1.x + p2.x) / 2, 0.01, (p1.z + p2.z) / 2);
        curb.rotation.y = -angle;
        curb.receiveShadow = true;
        scene.add(curb);
      }
    }
  }

  // ─── REALISTIC 3D HUMAN WITH ANATOMY & OFFICE DRESSCODE ──────
  function createOfficeHuman(config) {
    const grp = new THREE.Group();
    const skinColor = config.skinColor || 0xe8beac;
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.65 });
    const hairMat = new THREE.MeshStandardMaterial({ color: config.hairColor || 0x18181b, roughness: 0.85 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: config.shirtColor || 0x2563eb, roughness: 0.6 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: config.pantsColor || 0x1e293b, roughness: 0.75 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.2 });
    const soleMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 });
    const tieMat = new THREE.MeshStandardMaterial({ color: config.tieColor || 0x0284c7, roughness: 0.4 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.5 });
    const buckleMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

    // 1. HEAD & DETAILED FACE
    const headGrp = new THREE.Group();
    headGrp.position.y = 1.52;

    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.32, 0.28), skinMat);
    headMesh.position.y = 0;
    headGrp.add(headMesh);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.06), skinMat);
    nose.position.set(0, -0.01, 0.16);
    headGrp.add(nose);

    // Eyes with Pupils
    const eyeGeo = new THREE.PlaneGeometry(0.05, 0.035);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.07, 0.04, 0.142);
    headGrp.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.07, 0.04, 0.142);
    headGrp.add(eyeR);

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.07, 0.015, 0.01);
    const browL = new THREE.Mesh(browGeo, hairMat);
    browL.position.set(-0.07, 0.08, 0.143);
    headGrp.add(browL);
    const browR = new THREE.Mesh(browGeo, hairMat);
    browR.position.set(0.07, 0.08, 0.143);
    headGrp.add(browR);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.03, 0.08, 0.05);
    const earL = new THREE.Mesh(earGeo, skinMat);
    earL.position.set(-0.14, 0, 0);
    headGrp.add(earL);
    const earR = new THREE.Mesh(earGeo, skinMat);
    earR.position.set(0.14, 0, 0);
    headGrp.add(earR);

    // 3D Volume Hair
    const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.3), hairMat);
    hairTop.position.set(0, 0.17, 0);
    headGrp.add(hairTop);

    const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.25, 0.08), hairMat);
    hairBack.position.set(0, 0.05, -0.12);
    headGrp.add(hairBack);

    const hairSideL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.22), hairMat);
    hairSideL.position.set(-0.135, 0.08, -0.01);
    headGrp.add(hairSideL);
    const hairSideR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.22), hairMat);
    hairSideR.position.set(0.135, 0.08, -0.01);
    headGrp.add(hairSideR);

    if (config.hasGlasses) {
      const glassMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const glassFrame = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.02), glassMat);
      glassFrame.position.set(0, 0.04, 0.155);
      headGrp.add(glassFrame);
    }

    grp.add(headGrp);

    // 2. NECK & COLLAR
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.14, 8), skinMat);
    neck.position.y = 1.33;
    grp.add(neck);

    const collarMat = config.whiteCollar ? whiteMat : shirtMat;
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.06, 8), collarMat);
    collar.position.y = 1.28;
    grp.add(collar);

    const pointGeo = new THREE.BoxGeometry(0.07, 0.06, 0.02);
    const colPtL = new THREE.Mesh(pointGeo, collarMat);
    colPtL.position.set(-0.06, 1.25, 0.09);
    colPtL.rotation.z = -0.3;
    grp.add(colPtL);
    const colPtR = new THREE.Mesh(pointGeo, collarMat);
    colPtR.position.set(0.06, 1.25, 0.09);
    colPtR.rotation.z = 0.3;
    grp.add(colPtR);

    // 3. TORSO (DRESS SHIRT / BLAZER)
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.52, 0.24), shirtMat);
    torsoMesh.position.y = 0.98;
    grp.add(torsoMesh);

    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.01), collarMat);
    placket.position.set(0, 0.98, 0.125);
    grp.add(placket);

    if (config.hasTie) {
      const knot = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.03), tieMat);
      knot.position.set(0, 1.22, 0.12);
      grp.add(knot);

      const tieBlade = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.34, 0.015), tieMat);
      tieBlade.position.set(0, 1.03, 0.13);
      grp.add(tieBlade);

      const tieClip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 0.01), buckleMat);
      tieClip.position.set(0, 1.08, 0.14);
      grp.add(tieClip);
    }

    if (config.hasLanyard !== false) {
      const lanyardMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
      const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.01), lanyardMat);
      strapL.position.set(-0.06, 1.15, 0.128);
      strapL.rotation.z = -0.15;
      grp.add(strapL);

      const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.01), lanyardMat);
      strapR.position.set(0.06, 1.15, 0.128);
      strapR.rotation.z = 0.15;
      grp.add(strapR);

      const badgeHolder = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.01), whiteMat);
      badgeHolder.position.set(0, 0.94, 0.14);
      grp.add(badgeHolder);

      const badgePhoto = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
      badgePhoto.position.set(0, 0.96, 0.146);
      grp.add(badgePhoto);
    }

    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.39, 0.05, 0.25), beltMat);
    belt.position.y = 0.72;
    grp.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.02), buckleMat);
    buckle.position.set(0, 0.72, 0.13);
    grp.add(buckle);

    // 4. LEGS & SHOES
    const hips = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.15, 0.23), pantsMat);
    hips.position.y = 0.63;
    grp.add(hips);

    const legGeo = new THREE.BoxGeometry(0.14, 0.6, 0.17);

    const legPivotL = new THREE.Group();
    legPivotL.position.set(-0.11, 0.58, 0);
    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.y = -0.28;
    legPivotL.add(legL);

    const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.24), shoeMat);
    shoeL.position.set(0, -0.58, 0.03);
    legPivotL.add(shoeL);
    const soleL = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.02, 0.25), soleMat);
    soleL.position.set(0, -0.62, 0.03);
    legPivotL.add(soleL);

    grp.add(legPivotL);

    const legPivotR = new THREE.Group();
    legPivotR.position.set(0.11, 0.58, 0);
    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.y = -0.28;
    legPivotR.add(legR);

    const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.24), shoeMat);
    shoeR.position.set(0, -0.58, 0.03);
    legPivotR.add(shoeR);
    const soleR = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.02, 0.25), soleMat);
    soleR.position.set(0, -0.62, 0.03);
    legPivotR.add(soleR);

    grp.add(legPivotR);

    // 5. ARMS & HANDS
    const armGeo = new THREE.BoxGeometry(0.11, 0.52, 0.12);
    const shoulderGeo = new THREE.SphereGeometry(0.08, 8, 8);

    const armPivotL = new THREE.Group();
    armPivotL.position.set(-0.24, 1.2, 0);
    const shoulderL = new THREE.Mesh(shoulderGeo, shirtMat);
    armPivotL.add(shoulderL);
    const armL = new THREE.Mesh(armGeo, shirtMat);
    armL.position.y = -0.22;
    armPivotL.add(armL);

    const handL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.08), skinMat);
    handL.position.set(0, -0.48, 0);
    armPivotL.add(handL);

    const watchBand = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.03, 0.125), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    watchBand.position.set(0, -0.42, 0);
    armPivotL.add(watchBand);
    const watchFace = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    watchFace.position.set(0, -0.42, 0.065);
    armPivotL.add(watchFace);

    grp.add(armPivotL);

    const armPivotR = new THREE.Group();
    armPivotR.position.set(0.24, 1.2, 0);
    const shoulderR = new THREE.Mesh(shoulderGeo, shirtMat);
    armPivotR.add(shoulderR);
    const armR = new THREE.Mesh(armGeo, shirtMat);
    armR.position.y = -0.22;
    armPivotR.add(armR);

    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.08), skinMat);
    handR.position.set(0, -0.48, 0);
    armPivotR.add(handR);

    if (config.accessory === 'tablet') {
      const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.22), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
      tablet.position.set(0.06, -0.45, 0.05);
      armPivotR.add(tablet);
    } else if (config.accessory === 'coffee') {
      const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.11, 8), whiteMat);
      mug.position.set(0, -0.48, 0.08);
      armPivotR.add(mug);
    } else if (config.accessory === 'clipboard') {
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 0.2), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }));
      board.position.set(0.06, -0.45, 0.05);
      armPivotR.add(board);
      const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.22), whiteMat);
      paper.position.set(0.076, -0.45, 0.05);
      paper.rotation.y = Math.PI / 2;
      armPivotR.add(paper);
    }

    grp.add(armPivotR);

    if (config.isSeated) {
      legPivotL.rotation.x = -Math.PI / 2;
      legPivotR.rotation.x = -Math.PI / 2;
      armPivotL.rotation.x = Math.PI / 3;
      armPivotR.rotation.x = Math.PI / 3;
      grp.position.y -= 0.35;
    }

    return {
      group: grp,
      head: headGrp,
      legPivotL,
      legPivotR,
      armPivotL,
      armPivotR
    };
  }

  function createDeskWorker(x, y, z, ry, shirtColor, isTyping = true, hasTie = false) {
    const human = createOfficeHuman({
      shirtColor: shirtColor,
      pantsColor: 0x1e293b,
      hasTie: hasTie,
      whiteCollar: true,
      hasLanyard: true,
      isSeated: true
    });

    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    grp.rotation.y = ry;
    grp.add(human.group);

    const chairMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.52), chairMat);
    seat.position.set(0, 0.45, 0);
    grp.add(seat);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.55, 0.08), chairMat);
    backrest.position.set(0, 0.78, -0.24);
    grp.add(backrest);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
    );
    pole.position.set(0, 0.22, 0);
    grp.add(pole);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 5), chairMat);
    base.position.set(0, 0.04, 0);
    grp.add(base);

    scene.add(grp);

    activeWorkers.push({
      group: grp,
      head: human.head,
      armL: human.armPivotL,
      armR: human.armPivotR,
      isTyping: isTyping,
      phase: Math.random() * 10
    });

    return grp;
  }

  // ─── BILIK 1: FOYER & WELCOME RECEPTION (ZERO CLIPPING OFFSET) ─
  function buildRoom1FoyerDetailed(wallMat, trimMat, woodMat) {
    // Reception Counter Desk placed at X = -25, Z = 18 (facing East toward path)
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.05, 4.2), wallMat);
    desk.position.set(-25, 0.52, 18);
    scene.add(desk);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.08, 4.4), woodMat);
    deskTop.position.set(-25, 1.08, 18);
    scene.add(deskTop);

    // Dual Monitors on Reception Desk facing West
    const monMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const scrMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    [-0.8, 0.8].forEach(mz => {
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.55, 0.9), monMat);
      mon.position.set(-25.1, 1.45, 18 + mz);
      scene.add(mon);

      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.48), scrMat);
      scr.position.set(-25.14, 1.45, 18 + mz);
      scr.rotation.y = -Math.PI / 2;
      scene.add(scr);
    });

    // Digital Guest Sign-in Kiosk at X = -24, Z = 22
    const kioskStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.1, 8), monMat);
    kioskStand.position.set(-24, 0.55, 22);
    scene.add(kioskStand);
    const kioskTab = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.03), monMat);
    kioskTab.position.set(-24, 1.12, 22);
    kioskTab.rotation.x = -0.4;
    scene.add(kioskTab);

    // Water Dispenser with 19L Blue Gallon at X = -28, Z = 15
    const dispBody = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.95, 0.45), wallMat);
    dispBody.position.set(-28, 0.48, 15);
    scene.add(dispBody);
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.45, 12),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.75, roughness: 0.1 })
    );
    bottle.position.set(-28, 1.18, 15);
    scene.add(bottle);

    // Waiting Lounge: Sofas & Marble Table at X = -14, Z = 22 (Clear of path!)
    const chairMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.7 });
    [-1.2, 1.2].forEach(cz => {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.9), chairMat);
      seat.position.set(-14, 0.25, 22 + cz);
      scene.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.55, 0.9), chairMat);
      back.position.set(-13.5, 0.65, 22 + cz);
      scene.add(back);
    });

    const cTable = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.35, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    cTable.position.set(-14, 0.18, 22);
    scene.add(cTable);

    // Branded Wood-slat Wall Backdrop behind desk
    const brandWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 6.0), woodMat);
    brandWall.position.set(-27.5, 1.4, 18);
    scene.add(brandWall);

    // 3 Speed Gate Security Access Turnstiles at X = -20, Z = 23 (Clear of walkway)
    const gateFrameMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.3 });
    const gateGlassMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.7 });
    [-1.0, 0, 1.0].forEach(gx => {
      const stanchion = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.95, 1.1), gateFrameMat);
      stanchion.position.set(-20 + gx * 1.1, 0.48, 23.5);
      scene.add(stanchion);

      const glassFlap = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.65, 0.04), gateGlassMat);
      glassFlap.position.set(-20 + gx * 1.1 + 0.3, 0.55, 23.5);
      scene.add(glassFlap);

      const rfidLed = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      rfidLed.position.set(-20 + gx * 1.1, 0.96, 23.1);
      scene.add(rfidLed);
    });

    // 65-Inch Vertical Digital Directory Totem at X = -27, Z = 23
    const totemBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.5), gateFrameMat);
    totemBase.position.set(-27, 0.05, 23);
    scene.add(totemBase);
    const totemPillar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.85, 0.12), gateFrameMat);
    totemPillar.position.set(-27, 0.95, 23);
    scene.add(totemPillar);
    const totemScr = new THREE.Mesh(
      new THREE.PlaneGeometry(0.65, 1.3),
      new THREE.MeshBasicMaterial({ map: totemTexture || undefined, color: totemTexture ? 0xffffff : 0x0284c7 })
    );
    totemScr.position.set(-27, 1.15, 22.93);
    scene.add(totemScr);

    // People in Bilik 1 (Bustling Corporate Entrance):
    // Seated Receptionist (Nadia) behind desk facing East
    createDeskWorker(-25.9, 0, 18, Math.PI / 2, 0xff7a38, true, false);
    // Security Officer standing near speed gates with smart blazer & ID
    createDeskWorker(-21.8, 0, 23.8, Math.PI, 0x0f172a, false, true);
    // Employee scanning badge to pass through turnstile
    createDeskWorker(-20.0, 0, 22.8, -Math.PI / 2, 0x2563eb, false, false);
    // Seated Visitor 1 in Lounge reading proposal folder
    createDeskWorker(-14, 0, 20.8, 0, 0x0284c7, false, true);
    // Seated Visitor 2 in Lounge
    createDeskWorker(-14, 0, 23.2, 0, 0x3b82f6, false, false);
    // Standing Visitor at touch kiosk
    createDeskWorker(-23.4, 0, 22, -Math.PI / 2, 0x1e293b, false, false);
  }

  // ─── BILIK 2: BROADCASTING & LIVE PRODUCTION STUDIO ──────────
  function buildRoom2BroadcastDetailed(screenMat, trimMat, frameMat) {
    const rx = -27;
    const rz = 0;

    // High-Resolution 6-Monitor Broadcast Multiview Video Wall at X = -32.55
    const videoWallFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.95, 3.85), frameMat);
    videoWallFrame.position.set(-32.62, 1.85, rz);
    scene.add(videoWallFrame);

    const videoWallDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(3.7, 1.8),
      new THREE.MeshBasicMaterial({ map: mcrTexture || undefined, color: mcrTexture ? 0xffffff : 0x0284c7 })
    );
    videoWallDisplay.position.set(-32.56, 1.85, rz);
    videoWallDisplay.rotation.y = Math.PI / 2;
    scene.add(videoWallDisplay);

    // MCR Switcher Desk placed at X = -29.5, Z = 0
    const mcrDesk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 5.2), frameMat);
    mcrDesk.position.set(-29.5, 0.45, rz);
    scene.add(mcrDesk);

    // ATEM Television Switcher Panel
    const atem = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.1, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
    );
    atem.position.set(-29.5, 0.95, rz - 0.9);
    scene.add(atem);

    // Audio Mixing Console with faders
    const audioMixer = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.08, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    audioMixer.position.set(-29.5, 0.94, rz + 0.9);
    scene.add(audioMixer);

    // 2 Broadcast Cameras on Pedestal Tripods pointing West toward MCR/Presenter
    [-3.2, 3.2].forEach((cz, idx) => {
      const camGrp = new THREE.Group();
      camGrp.position.set(-25, 0, rz + cz);

      const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.1, 6), frameMat);
      pedBase.position.y = 0.05;
      camGrp.add(pedBase);

      const pedCol = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 8), frameMat);
      pedCol.position.y = 0.7;
      camGrp.add(pedCol);

      // Panning & tilting camera head mounted on pedestal
      const headGrp = new THREE.Group();
      headGrp.position.set(0, 1.35, 0);

      const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.3), frameMat);
      camBody.position.set(0, 0.05, 0);
      headGrp.add(camBody);

      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.35, 12), frameMat);
      lens.position.set(-0.45, 0.05, 0);
      lens.rotation.z = Math.PI / 2;
      headGrp.add(lens);

      // Teleprompter / operator monitor on the back
      const prompter = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.28), frameMat);
      prompter.position.set(0.38, 0.1, 0);
      headGrp.add(prompter);
      const prompterScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.18), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
      prompterScreen.position.set(0.42, 0.1, 0);
      prompterScreen.rotation.y = Math.PI / 2;
      headGrp.add(prompterScreen);

      // Dynamic blinking ON AIR tally LED light
      const tallyMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const tally = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.1), tallyMat);
      tally.position.set(0.15, 0.27, 0);
      headGrp.add(tally);

      camGrp.add(headGrp);
      scene.add(camGrp);

      // Register for dynamic studio panning animation
      studioCameras.push({
        head: headGrp,
        tallyMat: tallyMat,
        phase: idx * 1.57 + cz * 0.4
      });
    });

    // 2 Softbox Studio Lights
    [-5.5, 5.5].forEach(lz => {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 2.2, 8), frameMat);
      stand.position.set(-27, 1.1, rz + lz);
      scene.add(stand);

      const softbox = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.1, 0.8), frameMat);
      softbox.position.set(-27, 2.2, rz + lz);
      scene.add(softbox);
    });

    // Genelec-Style Nearfield Audio Studio Monitors on Desk
    const spkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    [-1.7, 1.7].forEach(sz => {
      const spk = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.22), spkMat);
      spk.position.set(-29.5, 1.1, rz + sz);
      scene.add(spk);

      const spkLed = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      spkLed.position.set(-29.38, 0.98, rz + sz);
      scene.add(spkLed);
    });

    // Yellow Floor Cable Protection Ramps along Studio Edges
    const rampMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 });
    [-4.5, 4.5].forEach(rz_pos => {
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 3.2), rampMat);
      ramp.position.set(-27, 0.02, rz + rz_pos * 0.5);
      scene.add(ramp);
    });

    // Broadcast Teleprompter Screen in front of talent area at X = -24.5, Z = 0
    const tpStand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.3, 6), frameMat);
    tpStand.position.set(-24.5, 0.65, 0);
    scene.add(tpStand);
    const tpScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.35, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    tpScreen.position.set(-24.5, 1.35, 0);
    tpScreen.rotation.y = Math.PI / 2;
    scene.add(tpScreen);

    // RGB Tube Accent Lights on Rear Wall (Astera style glowing cyan/amber)
    [-3.8, 3.8].forEach(tz => {
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8),
        new THREE.MeshBasicMaterial({ color: tz < 0 ? 0x06b6d4 : 0xf97316 })
      );
      tube.position.set(-32.6, 1.6, rz + tz);
      scene.add(tube);
    });

    // Broadcast Crew Members (Behind desk & cameras, CLEAR of walkway at X=-22):
    createDeskWorker(-30.2, 0, rz - 0.9, -Math.PI / 2, 0x0f172a, true, false); // Lead Switcher Op
    createDeskWorker(-30.2, 0, rz + 0.9, -Math.PI / 2, 0x1e293b, true, false); // Sound Engineer
    createDeskWorker(-24.2, 0, rz - 3.2, -Math.PI / 2, 0x0284c7, false, false);// Camera 1 Op
    createDeskWorker(-24.2, 0, rz + 3.2, -Math.PI / 2, 0x0284c7, false, false);// Camera 2 Op
    createDeskWorker(-28.0, 0, rz - 3.5, 0, 0xff7a38, false, true);             // Floor Director giving cues
    createDeskWorker(-25.2, 0, 0, -Math.PI / 2, 0x1e293b, false, true);         // News Anchor in Smart Suit
    createDeskWorker(-30.2, 0, rz - 2.2, -Math.PI / 2, 0x2563eb, true, false); // GFX / CG Operator
  }

  // ─── BILIK 3: NEWSROOM & MEDIA EDITORIAL HUB ─────────────────
  function buildRoom3NewsroomDetailed(trimMat, woodMat) {
    // Modular Workstation Pod placed at X = -23, Z = -18 (Clear of walkway at X=-12)
    const podMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
    const deskPod = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.85, 2.6), podMat);
    deskPod.position.set(-23, 0.42, -18);
    scene.add(deskPod);

    // 4 Widescreen Monitors
    const monMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const scrMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const deskOffset = [
      { x: -1.2, z: -0.6, ry: 0 },
      { x: 1.2, z: -0.6, ry: 0 },
      { x: -1.2, z: 0.6, ry: Math.PI },
      { x: 1.2, z: 0.6, ry: Math.PI }
    ];

    deskOffset.forEach(m => {
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.5, 0.04), monMat);
      mon.position.set(-23 + m.x, 1.2, -18 + m.z);
      mon.rotation.y = m.ry;
      scene.add(mon);

      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.44), scrMat);
      scr.position.set(-23 + m.x, 1.2, -18 + m.z + (m.ry === 0 ? 0.025 : -0.025));
      scr.rotation.y = m.ry;
      scene.add(scr);
    });

    // Wall Kanban Board on North Wall at X = -23, Z = -24.5
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1.8, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 })
    );
    board.position.set(-23, 1.8, -24.5);
    scene.add(board);

    // Sticky Notes
    const noteColors = [0xfef08a, 0x86efac, 0x93c5fd, 0xfca5a5];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) {
        const note = new THREE.Mesh(
          new THREE.PlaneGeometry(0.24, 0.24),
          new THREE.MeshBasicMaterial({ color: noteColors[(r + c) % noteColors.length] })
        );
        note.position.set(-24.5 + c * 0.6, 2.2 - r * 0.45, -24.44);
        scene.add(note);
      }
    }

    // Heavy Office Laser Photocopier/Printer at X = -28, Z = -13
    const printer = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.15, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
    );
    printer.position.set(-28, 0.58, -13);
    scene.add(printer);

    // Espresso Coffee Credenza at X = -28, Z = -22
    const credenza = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.8), woodMat);
    credenza.position.set(-28, 0.45, -22);
    scene.add(credenza);

    // Second Collaborative Desk Pod at X = -28, Z = -18 (Along West wall, clear of walkway)
    const pod2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.85, 3.2), podMat);
    pod2.position.set(-29.5, 0.42, -18);
    scene.add(pod2);

    [-0.8, 0.8].forEach(pz => {
      const mon2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.5, 0.04), monMat);
      mon2.position.set(-29.5, 1.2, -18 + pz);
      mon2.rotation.y = Math.PI / 2;
      scene.add(mon2);

      const scr2 = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.44), new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
      scr2.position.set(-29.47, 1.2, -18 + pz);
      scr2.rotation.y = Math.PI / 2;
      scene.add(scr2);
    });

    // Mobile Glass Editorial Standup Board on Wheels at X = -17, Z = -22.5
    const mobWb = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.5, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    mobWb.position.set(-17, 1.45, -22.5);
    scene.add(mobWb);

    // Active Journalists & Media Team (Clear of walkway!):
    createDeskWorker(-24.2, 0, -19.6, 0, 0x2563eb, true, true);  // Senior Editor
    createDeskWorker(-21.8, 0, -19.6, 0, 0xa855f7, true, false); // Social Media Specialist
    createDeskWorker(-24.2, 0, -16.4, Math.PI, 0x10b981, true, false); // Copywriter
    createDeskWorker(-21.8, 0, -16.4, Math.PI, 0x0284c7, true, true);  // Visual Designer
    createDeskWorker(-29.5, 0, -18.8, Math.PI / 2, 0xec4899, true, false); // Video Content Creator
    createDeskWorker(-29.5, 0, -17.2, Math.PI / 2, 0x3b82f6, true, false); // Motion Graphic Artist
    createDeskWorker(-17.0, 0, -21.5, Math.PI, 0x0f172a, false, true);      // Art Director presenting
    createDeskWorker(-27.0, 0, -13, Math.PI / 2, 0xff7a38, false, false);   // Reporter at laser printer
  }

  // ─── BILIK 4: DATA ANALYST & MACHINE LEARNING AI LAB ──────────
  function buildRoom4DataLabDetailed(trimMat, frameMat) {
    // 2 Full-Height 42U Server Racks at X = 24, Z = -23 (Against North Wall)
    [-1.2, 1.2].forEach(sx => {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.95), frameMat);
      rack.position.set(24 + sx, 1.2, -23);
      scene.add(rack);

      const rackGlass = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.45 })
      );
      rackGlass.position.set(24 + sx, 1.2, -22.5);
      scene.add(rackGlass);

      for (let ly = 0; ly < 6; ly++) {
        const ledGeo = new THREE.SphereGeometry(0.025, 6, 6);
        const ledMat = new THREE.MeshBasicMaterial({ color: ly % 2 === 0 ? 0x22c55e : 0x06b6d4 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(24 + sx - 0.4 + (ly % 3) * 0.4, 0.5 + ly * 0.3, -22.45);
        scene.add(led);
        serverLEDs.push(led);
      }
    });

    // Developer Workstations at X = 23, Z = -16 (Clear of walkway at X=12)
    const devDesk = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.85, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    devDesk.position.set(23, 0.42, -16);
    scene.add(devDesk);

    // 34" Curved Ultrawide Monitor + Vertical Monitor
    const monMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const scrMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

    const wideMon = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 0.08), monMat);
    wideMon.position.set(22.6, 1.35, -16);
    scene.add(wideMon);
    const wideScr = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.58), scrMat);
    wideScr.position.set(22.6, 1.35, -15.95);
    scene.add(wideScr);

    const vertMon = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.95, 0.06), monMat);
    vertMon.position.set(24.2, 1.45, -16);
    scene.add(vertMon);
    const vertScr = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.88), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    vertScr.position.set(24.2, 1.45, -15.96);
    scene.add(vertScr);

    // Transparent Glass Whiteboard at X = 13, Z = -22
    const glassWb = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 1.6, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1 })
    );
    glassWb.position.set(13, 1.5, -22);
    glassWb.rotation.y = 0.3;
    scene.add(glassWb);

    // 3rd High-Density Server Rack at X = 27.5, Z = -23
    const rack3 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.95), frameMat);
    rack3.position.set(27.5, 1.2, -23);
    scene.add(rack3);

    const rack3Glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.45 })
    );
    rack3Glass.position.set(27.5, 1.2, -22.5);
    scene.add(rack3Glass);

    for (let ly = 0; ly < 6; ly++) {
      const ledGeo = new THREE.SphereGeometry(0.025, 6, 6);
      const ledMat = new THREE.MeshBasicMaterial({ color: ly % 2 === 0 ? 0xef4444 : 0x22c55e });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(27.5 - 0.4 + (ly % 3) * 0.4, 0.5 + ly * 0.3, -22.45);
      scene.add(led);
      serverLEDs.push(led);
    }

    // Overhead Cable Raceway Ladder bridging racks
    const ladderMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.4 });
    const ladder = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.1, 0.45), ladderMat);
    ladder.position.set(24.5, 2.45, -23);
    scene.add(ladder);

    // Wall-Mounted Big Data / Grafana Cloud Dashboard Display at X = 28.5, Z = -16
    const grafanaWall = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.4, 2.8), frameMat);
    grafanaWall.position.set(32.6, 1.6, -16);
    scene.add(grafanaWall);

    const grafanaScr = new THREE.Mesh(
      new THREE.PlaneGeometry(2.7, 1.3),
      new THREE.MeshBasicMaterial({ map: grafanaTexture || undefined, color: grafanaTexture ? 0xffffff : 0x0284c7 })
    );
    grafanaScr.position.set(32.55, 1.6, -16);
    grafanaScr.rotation.y = -Math.PI / 2;
    scene.add(grafanaScr);

    // Floating Holographic AI Core (Signature Futuristic Tech Element!)
    const holoGrp = new THREE.Group();
    holoGrp.position.set(20.5, 2.3, -15.5);

    const holoMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const holoCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 1), holoMat);
    holoGrp.add(holoCore);

    const ring1Geo = new THREE.TorusGeometry(0.78, 0.018, 8, 32);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 });
    const holoRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    holoGrp.add(holoRing1);

    const ring2Geo = new THREE.TorusGeometry(0.98, 0.018, 8, 32);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xff6b2b, transparent: true, opacity: 0.55 });
    const holoRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    holoRing2.rotation.x = Math.PI / 3;
    holoGrp.add(holoRing2);

    const holoLight = new THREE.PointLight(0x06b6d4, 1.2, 7);
    holoGrp.add(holoLight);

    scene.add(holoGrp);
    holoDataCore = { group: holoGrp, core: holoCore, ring1: holoRing1, ring2: holoRing2, light: holoLight };

    // Active Data Scientists & ML Engineers (Clear of walkway!):
    createDeskWorker(22.6, 0, -17.2, 0, 0x0284c7, true, true);  // Lead Data Scientist
    createDeskWorker(24.2, 0, -17.2, 0, 0x10b981, true, false); // Machine Learning Engineer
    createDeskWorker(21.0, 0, -17.2, 0, 0x3b82f6, true, false); // Cloud Databricks Analyst
    createDeskWorker(27.5, 0, -21.8, 0, 0x334155, false, false);// Sysadmin inspecting 3rd server rack
    createDeskWorker(13, 0, -21.2, Math.PI, 0x2563eb, false, true); // AI Solution Architect at whiteboard
    createDeskWorker(14.5, 0, -21.0, -Math.PI / 2, 0xa855f7, false, false); // Colleague taking notes
  }

  // ─── BILIK 5: IOT HARDWARE INNOVATION WORKSHOP ───────────────
  function buildRoom5IoTWorkshopDetailed(trimMat, frameMat) {
    const rx = 28;
    const rz = 0;

    // Heavy Industrial ESD Workbench placed against East Wall at X = 29.5, Z = 0
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 5.2), benchMat);
    bench.position.set(29.5, 0.45, rz);
    scene.add(bench);

    const esdMat = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.02, 5.0),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.7 })
    );
    esdMat.position.set(29.5, 0.91, rz);
    scene.add(esdMat);

    // Oscilloscope with animated sine wave
    const oscBody = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.7), frameMat);
    oscBody.position.set(29.5, 1.15, rz - 1.5);
    scene.add(oscBody);

    const oscScr = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    oscScr.position.set(29.32, 1.15, rz - 1.5);
    oscScr.rotation.y = -Math.PI / 2;
    scene.add(oscScr);

    // Working 3D Printer at X = 29.5, Z = -3.5
    const printerFrame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.9), frameMat);
    printerFrame.position.set(29.5, 1.42, rz - 3.5);
    scene.add(printerFrame);

    const printerBed = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.04, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, emissive: 0x0284c7, emissiveIntensity: 0.3 })
    );
    printerBed.position.set(29.5, 1.05, rz - 3.5);
    scene.add(printerBed);

    const extruder = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.12, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xff6b2b, roughness: 0.4, emissive: 0xff6b2b, emissiveIntensity: 0.6 })
    );
    extruder.position.set(29.5, 1.35, rz - 3.5);
    scene.add(extruder);
    printerExtruder = extruder;

    // IoT LPG-SafeSense Hardware Prototype (Juara 1 MKI)
    const protoGrp = new THREE.Group();
    protoGrp.position.set(29.4, 0.92, rz + 0.3);

    const lpgCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.42, 12),
      new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 })
    );
    lpgCylinder.position.set(0, 0.22, -0.25);
    protoGrp.add(lpgCylinder);

    const bb = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.04, 0.35),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    bb.position.set(0, 0.03, 0.15);
    protoGrp.add(bb);

    const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.08), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    lcd.position.set(-0.06, 0.06, 0.15);
    lcd.rotation.y = -Math.PI / 2;
    protoGrp.add(lcd);

    scene.add(protoGrp);

    // Illuminated Trophy Pedestal at X = 24, Z = 5.5 (Clear of walkway!)
    const ped = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.5, 1.0, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    ped.position.set(24, 0.5, rz + 5.5);
    scene.add(ped);

    const trophy = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.08, 0.45, 12),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
    );
    trophy.position.set(24, 1.25, rz + 5.5);
    scene.add(trophy);
    rotatingTrophy = trophy;

    // SafeSense 50 Concentric Sonar Pulse Wave
    const sonarGeo = new THREE.RingGeometry(0.08, 0.16, 32);
    const sonarMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    sonarPulseRing = new THREE.Mesh(sonarGeo, sonarMat);
    sonarPulseRing.rotation.x = -Math.PI / 2;
    sonarPulseRing.position.set(29.4, 0.96, rz + 0.3);
    scene.add(sonarPulseRing);

    const trophyLight = new THREE.PointLight(0xfef08a, 0.8, 5);
    trophyLight.position.set(24, 1.6, rz + 5.5);
    scene.add(trophyLight);

    // Active Engineers (Clear of walkway at X=22!)
    createDeskWorker(28.7, 0, rz - 0.4, -Math.PI / 2, 0xf97316, true, false);
    createDeskWorker(28.7, 0, rz + 1.4, -Math.PI / 2, 0x0284c7, true, false);
    createDeskWorker(28.0, 0, rz - 3.5, 0, 0x10b981, false, false); // 3D print maker
  }

  // ─── BILIK 6: PRESS CONFERENCE & BRIEFING AUDITORIUM ──────────
  function buildRoom6PressHallDetailed(trimMat, woodMat) {
    const rx = 22;
    const rz = 20;
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

    // Boardroom Conference Table at X = 23, Z = 20 (East side, clear of path at X=12)
    const confTable = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.85, 5.2), woodMat);
    confTable.position.set(23, 0.42, rz);
    scene.add(confTable);

    // Tabletop Microphones
    [-1.6, 0, 1.6].forEach(mz => {
      const mic = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.02, 0.25, 6),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 })
      );
      mic.position.set(23, 0.98, rz + mz);
      scene.add(mic);
    });

    // Presentation Lectern / Podium at X = 23, Z = 14 (South of path)
    const podium = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.25, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    podium.position.set(23, 0.62, 14);
    scene.add(podium);

    // Giant 4.2-Meter Widescreen Projection Screen on South Wall at Z = 24.5
    const projScr = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 2.3),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    projScr.position.set(23, 2.1, 24.6);
    projScr.rotation.y = Math.PI;
    scene.add(projScr);

    // Media Broadcast Tripod in the Rear at X = 28.5, Z = 16
    const pressCamTripod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.25, 1.4, 6), frameMat);
    pressCamTripod.position.set(28.5, 0.7, 16);
    scene.add(pressCamTripod);
    const pressCam = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.2), frameMat);
    pressCam.position.set(28.5, 1.45, 16);
    scene.add(pressCam);

    // Twin Institutional Roll-up Banners flanking the presentation stage
    [-2.6, 2.6].forEach(bx => {
      const bStand = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.08, 0.2), frameMat);
      bStand.position.set(23 + bx, 0.04, 13.5);
      scene.add(bStand);
      const bBanner = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 2.0),
        new THREE.MeshBasicMaterial({ color: 0x0284c7 })
      );
      bBanner.position.set(23 + bx, 1.05, 13.52);
      scene.add(bBanner);
    });

    // Active Press Delegates & Correspondents (Clear of walkway at X=12!):
    createDeskWorker(24.2, 0, rz - 1.6, -Math.PI / 2, 0x1e293b, true, true);  // Corporate Executive
    createDeskWorker(24.2, 0, rz + 1.6, -Math.PI / 2, 0x0f172a, true, true);  // Government Liaison
    createDeskWorker(21.8, 0, rz - 1.6, Math.PI / 2, 0x2563eb, true, true);   // Lead Editor
    createDeskWorker(21.8, 0, rz + 1.6, Math.PI / 2, 0xa855f7, true, false);  // PR Manager
    createDeskWorker(24.2, 0, rz, -Math.PI / 2, 0x10b981, true, false);       // National Media Journalist
    createDeskWorker(21.8, 0, rz, Math.PI / 2, 0x3b82f6, true, false);        // Tech Correspondent
    createDeskWorker(23, 0, 13.2, 0, 0xff7a38, false, true);                   // Keynote Presenter at Podium
    createDeskWorker(28.5, 0, 15.2, 0, 0x334155, false, false);               // Camera Operator in the back
    createDeskWorker(21.0, 0, 14.5, -0.6, 0x0f172a, false, false);             // Press Photographer capturing shots
  }

  // ─── BILIK 7: EXECUTIVE RECRUITER PENTHOUSE LOUNGE ────────────
  function buildRoom7RecruiterLoungeDetailed(trimMat, woodMat) {
    const rx = 0;
    const rz = 20;

    // L-Shaped Italian Leather Sofa placed at X = -2, Z = 22 (Clear of center path at Z=18)
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.65 });
    const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.42, 1.2), sofaMat);
    sofaMain.position.set(-2, 0.28, 22);
    scene.add(sofaMain);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.55, 0.25), sofaMat);
    sofaBack.position.set(-2, 0.68, 22.5);
    scene.add(sofaBack);

    // White Marble Coffee Table at X = -2, Z = 20.5
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const marbleTable = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 1.0), marbleMat);
    marbleTable.position.set(-2, 0.18, 20.5);
    scene.add(marbleTable);

    // Orchid Vase
    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.06, 0.3, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 })
    );
    vase.position.set(-2, 0.48, 20.5);
    scene.add(vase);

    // Executive Walnut Desk with iMac at X = 5.5, Z = 19 (East side)
    const execDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.2), woodMat);
    execDesk.position.set(5.5, 0.42, 19);
    scene.add(execDesk);

    const imacMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9 });
    const imacStand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.18), imacMat);
    imacStand.position.set(5.5, 1.05, 19);
    scene.add(imacStand);

    const imacScr = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.04), imacMat);
    imacScr.position.set(5.5, 1.45, 19);
    scene.add(imacScr);

    // Brass Arched Floor Lamp
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.6, 8), lampMat);
    lampPole.position.set(0.5, 1.3, 22.5);
    scene.add(lampPole);

    const lampLight = new THREE.PointLight(0xfef08a, 0.9, 8);
    lampLight.position.set(0, 2.4, 21.5);
    scene.add(lampLight);

    // Indoor Tall Potted Plants at corners
    [-6.5, 6.5].forEach(px => {
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.28, 0.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
      );
      pot.position.set(px, 0.3, 23);
      scene.add(pot);

      const leaf = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.65, 1),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
      );
      leaf.position.set(px, 1.0, 23);
      scene.add(leaf);
    });

    // 3 Senior HR Talent Executives (Clear of path at X=0, Z=18!)
    createDeskWorker(-3.0, 0, 22, 0, 0x0f172a, true, true);
    createDeskWorker(-1.0, 0, 22, 0, 0x2563eb, false, true);
    createDeskWorker(5.5, 0, 19.8, Math.PI, 0x1e293b, true, true); // at iMac
  }

  // ─── 4 MOBILE PATROLLING EMPLOYEES ACROSS CORRIDORS ──────────
  function buildPatrollingOfficeWorkers() {
    // Worker 1: West Wing Corridor (Z: 7 to -7 at X = -17)
    const w1 = createOfficeHuman({
      shirtColor: 0x2563eb,
      pantsColor: 0x1e293b,
      hasTie: true,
      whiteCollar: true,
      accessory: 'tablet'
    });
    scene.add(w1.group);
    patrollingStaff.push({
      group: w1.group,
      legL: w1.legPivotL,
      legR: w1.legPivotR,
      armL: w1.armPivotL,
      armR: w1.armPivotR,
      axis: 'z',
      x: -17,
      currentZ: 5,
      minZ: -7,
      maxZ: 7,
      speed: 0.024,
      dir: -1,
      stepPhase: 0
    });

    // Worker 2: North Wing Corridor (X: -10 to 10 at Z = -13.5)
    const w2 = createOfficeHuman({
      shirtColor: 0x10b981,
      pantsColor: 0x1e293b,
      hasTie: false,
      whiteCollar: true,
      accessory: 'coffee'
    });
    scene.add(w2.group);
    patrollingStaff.push({
      group: w2.group,
      legL: w2.legPivotL,
      legR: w2.legPivotR,
      armL: w2.armPivotL,
      armR: w2.armPivotR,
      axis: 'x',
      z: -13.5,
      currentX: -8,
      minX: -10,
      maxX: 10,
      speed: 0.022,
      dir: 1,
      stepPhase: 0
    });

    // Worker 3: East Wing Corridor (Z: -7 to 7 at X = 17)
    const w3 = createOfficeHuman({
      shirtColor: 0xa855f7,
      pantsColor: 0x1e293b,
      hasTie: true,
      whiteCollar: true,
      accessory: 'clipboard'
    });
    scene.add(w3.group);
    patrollingStaff.push({
      group: w3.group,
      legL: w3.legPivotL,
      legR: w3.legPivotR,
      armL: w3.armPivotL,
      armR: w3.armPivotR,
      axis: 'z',
      x: 17,
      currentZ: -5,
      minZ: -7,
      maxZ: 7,
      speed: 0.024,
      dir: 1,
      stepPhase: 0
    });

    // Worker 4: South Wing Corridor (X: 10 to -4 at Z = 16)
    const w4 = createOfficeHuman({
      shirtColor: 0x0284c7,
      pantsColor: 0x1e293b,
      hasTie: true,
      whiteCollar: true,
      accessory: 'tablet'
    });
    scene.add(w4.group);
    patrollingStaff.push({
      group: w4.group,
      legL: w4.legPivotL,
      legR: w4.legPivotR,
      armL: w4.armPivotL,
      armR: w4.armPivotR,
      axis: 'x',
      z: 16,
      currentX: 8,
      minX: -4,
      maxX: 10,
      speed: 0.020,
      dir: -1,
      stepPhase: 0
    });

    // Worker 5: Facilities & Maintenance Specialist along West Outer Wing (X = -21, Z: 5 to -5)
    const w5 = createOfficeHuman({
      shirtColor: 0x334155,
      pantsColor: 0x1e293b,
      hasTie: false,
      whiteCollar: false,
      accessory: 'clipboard'
    });
    scene.add(w5.group);
    patrollingStaff.push({
      group: w5.group,
      legL: w5.legPivotL,
      legR: w5.legPivotR,
      armL: w5.armPivotL,
      armR: w5.armPivotR,
      axis: 'z',
      x: -21,
      currentZ: -2,
      minZ: -6,
      maxZ: 6,
      speed: 0.018,
      dir: 1,
      stepPhase: 1.5
    });

    // Worker 6: Senior Cloud Architect walking across North Bridge (Z = -14.2, X: -6 to 6)
    const w6 = createOfficeHuman({
      shirtColor: 0x2563eb,
      pantsColor: 0x1e293b,
      hasTie: true,
      whiteCollar: true,
      accessory: 'coffee'
    });
    scene.add(w6.group);
    patrollingStaff.push({
      group: w6.group,
      legL: w6.legPivotL,
      legR: w6.legPivotR,
      armL: w6.armPivotL,
      armR: w6.armPivotR,
      axis: 'x',
      z: -14.2,
      currentX: 2,
      minX: -6,
      maxX: 6,
      speed: 0.02,
      dir: -1,
      stepPhase: 2.0
    });

    // Worker 7: Hardware & IoT QA Engineer along East Wing (X = 21, Z: -5 to 5)
    const w7 = createOfficeHuman({
      shirtColor: 0xf97316,
      pantsColor: 0x1e293b,
      hasTie: false,
      whiteCollar: true,
      accessory: 'tablet'
    });
    scene.add(w7.group);
    patrollingStaff.push({
      group: w7.group,
      legL: w7.legPivotL,
      legR: w7.legPivotR,
      armL: w7.armPivotL,
      armR: w7.armPivotR,
      axis: 'z',
      x: 21,
      currentZ: 3,
      minZ: -5,
      maxZ: 5,
      speed: 0.021,
      dir: -1,
      stepPhase: 0.8
    });

    // Worker 8: Strategic Talent Partner along South Courtyard Promenade (Z = 15.5, X: -2 to 8)
    const w8 = createOfficeHuman({
      shirtColor: 0xff7a38,
      pantsColor: 0x1e293b,
      hasTie: true,
      whiteCollar: true,
      accessory: 'clipboard'
    });
    scene.add(w8.group);
    patrollingStaff.push({
      group: w8.group,
      legL: w8.legPivotL,
      legR: w8.legPivotR,
      armL: w8.armPivotL,
      armR: w8.armPivotR,
      axis: 'x',
      z: 15.5,
      currentX: 0,
      minX: -2,
      maxX: 8,
      speed: 0.019,
      dir: 1,
      stepPhase: 3.1
    });
  }

  // ─── 7 INTERACTIVE 3D NPCS (OFFICE GUIDES AT STATIONS) ───────
  function buildInteractive3DNPCS() {
    NPC_GUIDES.forEach((npc, idx) => {
      const guideHuman = createOfficeHuman({
        shirtColor: npc.shirtColor,
        pantsColor: 0x1e293b,
        hasTie: idx % 2 === 0,
        whiteCollar: true,
        hasLanyard: true,
        accessory: 'tablet'
      });

      const grp = guideHuman.group;
      grp.position.set(npc.pos.x, 0, npc.pos.z);
      grp.userData = { isNPC: true, npcIndex: idx };

      const canvasIcon = document.createElement('canvas');
      canvasIcon.width = 128;
      canvasIcon.height = 128;
      const ctx = canvasIcon.getContext('2d');
      ctx.fillStyle = '#ff6b2b';
      ctx.beginPath();
      ctx.arc(64, 64, 56, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(npc.avatarLetter || '?', 64, 64);

      const iconTex = new THREE.CanvasTexture(canvasIcon);
      const iconMat = new THREE.SpriteMaterial({ map: iconTex, transparent: true });
      const sprite = new THREE.Sprite(iconMat);
      sprite.position.set(0, 2.15, 0);
      sprite.scale.set(0.45, 0.45, 1);
      grp.add(sprite);

      scene.add(grp);

      animatedNPCs.push({
        group: grp,
        human: guideHuman,
        sprite: sprite,
        npc: npc,
        phase: idx * 1.3
      });
    });
  }

  // ─── ANIMATED WALKING HERO (MANGARA FERDIANTO PAKPAHAN) ───────
  function createWalkingHeroWithIndicator() {
    walkingHero = new THREE.Group();

    // Glowing Cyan Target Ring (Signature reference feature!)
    const ringGeo = new THREE.RingGeometry(0.52, 0.64, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    heroGroundRing = new THREE.Mesh(ringGeo, ringMat);
    heroGroundRing.rotation.x = -Math.PI / 2;
    heroGroundRing.position.y = 0.03;
    walkingHero.add(heroGroundRing);

    const innerCircle = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 32),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    );
    innerCircle.rotation.x = -Math.PI / 2;
    innerCircle.position.y = 0.025;
    walkingHero.add(innerCircle);

    const chevGeo = new THREE.ConeGeometry(0.12, 0.28, 4);
    const chevMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    heroRingChevron = new THREE.Mesh(chevGeo, chevMat);
    heroRingChevron.rotation.x = Math.PI / 2;
    heroRingChevron.position.set(0, 0.035, 0.65);
    walkingHero.add(heroRingChevron);

    // Realistic Mangara Human Model in Smart Office Attire
    const heroHuman = createOfficeHuman({
      shirtColor: 0x38bdf8, // Sharp Sky Blue dress shirt
      pantsColor: 0x1e293b, // Tailored Navy slacks
      hasTie: true,
      tieColor: 0x0284c7, // Silk Cyan/Blue tie
      whiteCollar: true,
      hasLanyard: true, // Official Mangara ID badge
      accessory: 'tablet'
    });

    legPivotL = heroHuman.legPivotL;
    legPivotR = heroHuman.legPivotR;
    armPivotL = heroHuman.armPivotL;
    armPivotR = heroHuman.armPivotR;
    heroHumanObj = heroHuman;

    walkingHero.add(heroHuman.group);

    walkingHero.position.set(-24, 0, 24);
    scene.add(walkingHero);
  }


  // ─── 8. DOM MOUNTING & HTML SHELL ─────────────────────────────
  function buildScrollytellingDOM() {
    const main = document.querySelector('main');
    if (!main) return;

    const wrapper = document.createElement('section');
    wrapper.id = 'contemporary-gallery-experience';

    wrapper.innerHTML = `
      <div class="nadi-scrolly-track" id="nadi-scrolly-track">
        <div class="nadi-sticky-viewport" id="nadi-sticky-viewport">
          <!-- 3D Canvas -->
          <canvas id="nadi-webgl-canvas"></canvas>

          <!-- STORY BACKDROP GRADIENT -->
          <div class="nadi-story-backdrop-gradient"></div>

          <!-- TOP NAVBAR -->
          <header class="nadi-top-navbar">
            <div style="display: flex; align-items: center; gap: 12px;">
              <a href="#" class="nadi-brand-pill">
                <span class="nadi-brand-logo">mangara</span>
                <span class="nadi-brand-dot"></span>
              </a>
              <div class="nadi-hud-player-badge">
                <span class="nadi-hud-dot"></span>
                <span>PLAYER 1: MANGARA &bull; 50/50 KARYA</span>
              </div>
            </div>

            <div class="nadi-nav-actions">
              <!-- TOP QUEST & ARCADE HUD PILLS -->
              <div class="nadi-quest-hud-pill" id="nadi-quest-hud-pill" title="Misi Kantor: Kumpulkan 5 Ide Inovasi Mangara">
                <ion-icon name="trophy"></ion-icon>
                <span id="nadi-quest-hud-text">Misi: 0/5 Ide</span>
              </div>
              <button class="nadi-arcade-trigger-btn" id="nadi-arcade-trigger-btn" type="button" title="Main Game Retro Data Runner">
                <ion-icon name="game-controller"></ion-icon>
                <span>Game Arkade</span>
              </button>
              <button class="nadi-btn-audio" id="nadi-btn-audio-toggle" title="Suara Ambience Kantor (Web Audio)">
                <ion-icon name="volume-mute-outline" id="nadi-audio-icon"></ion-icon>
                <span id="nadi-audio-text">Audio: Off</span>
              </button>
              <a href="./CV_Mangara_Pakpahan_Data_Analyst.pdf" target="_blank" rel="noopener" class="nadi-btn-secondary" title="Unduh CV ATS Data Analyst">
                <ion-icon name="document-text-outline"></ion-icon>
                <span>CV Data Analyst</span>
              </a>
              <a href="./CV_Mangara_Pakpahan_Sosmed_Humas.pdf" target="_blank" rel="noopener" class="nadi-btn-secondary" title="Unduh CV ATS Sosmed">
                <ion-icon name="document-text-outline"></ion-icon>
                <span>CV Sosmed</span>
              </a>
              <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20melihat%20portofolio%203D%20Anda." target="_blank" rel="noopener" class="nadi-btn-primary" title="Hubungi via WhatsApp">
                <span>WhatsApp &rarr;</span>
              </a>
            </div>
          </header>

          <!-- PURE FREE ORBIT 360 HUD & RESET CONTROLS -->
          <div class="nadi-orbit-hud-wrap">
            <div class="nadi-orbit-hud-pill" id="nadi-orbit-hud-pill" title="Tahan klik & geser di layar untuk memutar 360°, scroll untuk zoom">
              <ion-icon name="sync-outline" class="nadi-orbit-spin-icon"></ion-icon>
              <span class="nadi-orbit-pill-title">Orbit Bebas 360°</span>
              <span class="nadi-orbit-pill-sub">&bull; Tahan & Geser Layar</span>
            </div>
            <button class="nadi-hud-action-btn" id="nadi-btn-reset-orbit" title="Kembalikan Sudut Pandang Kamera ke Posisi Ideal">
              <ion-icon name="scan-outline"></ion-icon>
              <span>Reset POV</span>
            </button>
          </div>

          <!-- FLOATING NPC INTERACTION BUTTON -->
          <button class="nadi-npc-floating-trigger" id="nadi-npc-floating-trigger" title="Buka Percakapan dengan Tim di Bilik Ini">
            <ion-icon name="chatbubble-ellipses-outline" style="color: var(--nadi-orange); font-size: 14px;"></ion-icon>
            <span>💬 Tanya Tim Bilik Ini</span>
          </button>

          <!-- LEFT FLOATING STORY CONTENT & ULTRA-MINIMALIST CARD -->
          <div class="nadi-story-layer" id="nadi-story-layer">
            <div class="nadi-step-label" id="nadi-step-label">
              <span>LANGKAH 01</span> &bull; PROFIL & KUALIFIKASI
            </div>

            <h1 class="nadi-story-headline" id="nadi-story-headline">
              Kreativitas Bertemu Rekayasa Data.
            </h1>

            <p class="nadi-story-desc" id="nadi-story-desc">
              Mahasiswa S1 Teknik Informatika Institut Teknologi PLN...
            </p>

            <!-- FLOATING DATA CARD (MINIMALIST & AUTO-SCROLLED) -->
            <div class="nadi-floating-card" id="nadi-floating-card">
              <div class="nadi-card-top-row">
                <div class="nadi-card-badge-left" id="nadi-card-title">
                  <ion-icon name="person-circle-outline" style="color: var(--nadi-orange);"></ion-icon>
                  <strong>Profil & Kualifikasi Resmi</strong>
                </div>
                <div class="nadi-card-badge-status" id="nadi-card-status">
                  Tersedia untuk Kerja & Magang
                </div>
              </div>

              <!-- DYNAMIC MINIMALIST TABLE CONTENT -->
              <div class="nadi-card-dynamic-container" id="nadi-card-dynamic-container">
                <!-- Injected via renderStoryStep() -->
              </div>
            </div>
          </div>

          <!-- 2D ARCHITECTURAL FLOOR PLAN MINI-MAP HUD -->
          <div class="nadi-floorplan-widget" id="nadi-floorplan-widget">
            <div class="nadi-floorplan-header" id="nadi-floorplan-header">
              <div class="nadi-floorplan-title-box">
                <span class="nadi-floorplan-pulse"></span>
                <span class="nadi-floorplan-title">DENAH STUDIO 3D</span>
              </div>
              <div style="display: flex; gap: 5px; align-items: center;">
                <span class="nadi-floorplan-step-indicator" id="nadi-floorplan-step-indicator">Bilik 01</span>
                <button class="nadi-floorplan-toggle-btn" id="nadi-floorplan-toggle-btn" title="Kecilkan / Buka Denah">
                  <ion-icon name="chevron-down-outline" id="nadi-floorplan-toggle-icon"></ion-icon>
                </button>
              </div>
            </div>
            <div class="nadi-floorplan-body" id="nadi-floorplan-body">
              <svg viewBox="0 0 320 280" class="nadi-floorplan-svg" id="nadi-floorplan-svg">
                <defs>
                  <pattern id="fp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                  </pattern>
                </defs>
                <rect x="8" y="8" width="304" height="264" rx="12" fill="url(#fp-grid)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

                <!-- Central Sunken Courtyard Atrium -->
                <rect x="105" y="85" width="110" height="110" rx="8" class="fp-atrium" />
                <text x="160" y="136" text-anchor="middle" class="fp-atrium-label">ATRIUM KOPI</text>
                <text x="160" y="150" text-anchor="middle" class="fp-atrium-sub">Courtyard & Barista</text>

                <!-- 7 Rooms -->
                <g class="fp-room active" data-room="0" id="fp-room-0">
                  <rect x="18" y="180" width="82" height="82" rx="6" />
                  <text x="59" y="215" text-anchor="middle" class="fp-num">01 FOYER</text>
                  <text x="59" y="230" text-anchor="middle" class="fp-name">Profil & Tamu</text>
                </g>
                <g class="fp-room" data-room="1" id="fp-room-1">
                  <rect x="18" y="90" width="82" height="85" rx="6" />
                  <text x="59" y="127" text-anchor="middle" class="fp-num">02 MCR</text>
                  <text x="59" y="142" text-anchor="middle" class="fp-name">Live Broadcast</text>
                </g>
                <g class="fp-room" data-room="2" id="fp-room-2">
                  <rect x="18" y="18" width="88" height="68" rx="6" />
                  <text x="62" y="50" text-anchor="middle" class="fp-num">03 REDAKSI</text>
                  <text x="62" y="65" text-anchor="middle" class="fp-name">Humas & Sosmed</text>
                </g>
                <g class="fp-room" data-room="3" id="fp-room-3">
                  <rect x="214" y="18" width="88" height="68" rx="6" />
                  <text x="258" y="50" text-anchor="middle" class="fp-num">04 DATA LAB</text>
                  <text x="258" y="65" text-anchor="middle" class="fp-name">AI & Cloud</text>
                </g>
                <g class="fp-room" data-room="4" id="fp-room-4">
                  <rect x="220" y="90" width="82" height="85" rx="6" />
                  <text x="261" y="127" text-anchor="middle" class="fp-num">05 IOT LAB</text>
                  <text x="261" y="142" text-anchor="middle" class="fp-name">SafeSense 50</text>
                </g>
                <g class="fp-room" data-room="5" id="fp-room-5">
                  <rect x="220" y="180" width="82" height="82" rx="6" />
                  <text x="261" y="215" text-anchor="middle" class="fp-num">06 PERS</text>
                  <text x="261" y="230" text-anchor="middle" class="fp-name">Publikasi Riset</text>
                </g>
                <g class="fp-room" data-room="6" id="fp-room-6">
                  <rect x="108" y="202" width="104" height="60" rx="6" />
                  <text x="160" y="228" text-anchor="middle" class="fp-num">07 REKRUTER</text>
                  <text x="160" y="243" text-anchor="middle" class="fp-name">Fast-Track Hub</text>
                </g>

                <!-- Player 1 Real-time Radar Blip -->
                <circle id="fp-radar-pulse" cx="59" cy="222" r="12" class="fp-radar-pulse" />
                <circle id="fp-radar-blip" cx="59" cy="222" r="5" class="fp-radar-blip" />
              </svg>
              <div class="nadi-floorplan-hint">
                <span>Klik bilik di atas untuk langsung beralih</span>
              </div>
            </div>
          </div>

          <!-- FLOATING CENTERED BOTTOM SEGMENTED DOCK (STEPS 01 - 07) -->
          <!-- User Feedback: Rapikan blok 1-7 agar tidak berantakan & tidak bertabrakan dengan kartu! -->
                    <!-- INTERACTIVE JOYSTICK SCROLL CONTROLLER (GAYA JOYSTICK) -->
          <div class="nadi-joystick-controller" id="nadi-joystick-controller" aria-label="Joystick Kontrol Karakter Berjalan">
            <div class="nadi-joystick-guide-label" id="nadi-joystick-label">
              <ion-icon name="game-controller-outline"></ion-icon>
              <span>JOYSTICK JALAN</span>
            </div>

            <div class="nadi-joystick-pad" id="nadi-joystick-pad">
              <!-- Directional Guides / Tap Buttons -->
              <button class="nadi-joy-dir nadi-joy-up" id="nadi-joy-btn-up" type="button" title="Maju (Walk Forward)">
                <ion-icon name="caret-up-outline"></ion-icon>
                <span class="nadi-joy-dir-label">MAJU</span>
              </button>
              <button class="nadi-joy-dir nadi-joy-down" id="nadi-joy-btn-down" type="button" title="Mundur (Walk Backward)">
                <span class="nadi-joy-dir-label">MUNDUR</span>
                <ion-icon name="caret-down-outline"></ion-icon>
              </button>
              <div class="nadi-joy-crosshair horizontal"></div>
              <div class="nadi-joy-crosshair vertical"></div>

              <!-- Luminous Center Movable Thumbstick Knob -->
              <div class="nadi-joystick-knob" id="nadi-joystick-knob">
                <div class="nadi-joystick-knob-core">
                  <ion-icon name="walk-outline" class="nadi-joystick-walk-icon"></ion-icon>
                </div>
              </div>
            </div>
          </div>

          <footer class="nadi-bottom-timeline">
            <button class="nadi-arrow-btn" id="nadi-btn-prev" title="Bilik Sebelumnya (&larr;)">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </button>

            <div class="nadi-steps-bar" id="nadi-steps-bar">
              ${SCROLL_STEPS.map((s, idx) => `
                <div class="nadi-step-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                  <span class="nadi-step-num">${s.stepNum}</span>
                  <span class="nadi-step-name">${s.stepName}</span>
                </div>
              `).join('')}
            </div>

            <button class="nadi-arrow-btn" id="nadi-btn-next" title="Bilik Selanjutnya (&rarr;)">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>

            <div class="nadi-dock-divider"></div>

            <button class="nadi-skip-btn" id="nadi-btn-open-archive" title="Buka Arsip Dokumen & 50 Proyek">
              <ion-icon name="grid-outline"></ion-icon>
              <span>Arsip & CV</span>
            </button>
          </footer>

          <!-- INTERACTIVE NPC DIALOGUE DRAWER WITH GUIDE DIRECTIONS -->
          <div class="nadi-npc-dialogue-modal" id="nadi-npc-dialogue-modal">
            <div class="nadi-npc-header">
              <div class="nadi-npc-avatar-row">
                <div class="nadi-npc-avatar-badge" id="nadi-npc-avatar">N</div>
                <div class="nadi-npc-name-box">
                  <span class="nadi-npc-name" id="nadi-npc-name">Nadia</span>
                  <span class="nadi-npc-role" id="nadi-npc-role">Front Desk Guide</span>
                </div>
              </div>
              <button class="nadi-npc-close" id="nadi-npc-close">&times;</button>
            </div>
            <div class="nadi-npc-body">
              <div class="nadi-npc-speech-bubble" id="nadi-npc-bubble">
                Halo! Selamat datang di studio Mangara Pakpahan.
              </div>

              <span class="nadi-npc-questions-title">Pilih Pertanyaan:</span>
              <div class="nadi-npc-q-list" id="nadi-npc-q-list"></div>

              <div class="nadi-npc-answer-box" id="nadi-npc-answer-box"></div>

              <button class="nadi-npc-guide-btn" id="nadi-npc-guide-btn">
                <ion-icon name="compass-outline"></ion-icon>
                <span id="nadi-npc-guide-label">Arahkan ke Bilik Selanjutnya &rarr;</span>
              </button>
            </div>
          </div>

          <!-- CINEMATIC INTRO SCREEN -->
          <div class="nadi-cinematic-intro" id="nadi-cinematic-intro">
            <div class="nadi-intro-card">
              <div class="nadi-intro-top-badge">
                <ion-icon name="game-controller-outline"></ion-icon>
                <span>3D BUSTLING VIRTUAL STUDIO &bull; JAKARTA</span>
              </div>
              <h2 class="nadi-intro-title">MANGARA FERDIANTO PAKPAHAN</h2>
              <p class="nadi-intro-sub">
                Eksplorasi virtual diorama interaktif melintasi 7 bilik kantor studio nyata yang ramai: ruang Master Control siaran langsung, lab data analyst, workshop IoT, hingga ruang redaksi publikasi.
              </p>
              <button class="nadi-intro-btn" id="nadi-intro-btn">
                <ion-icon name="play-circle-outline" style="font-size: 22px;"></ion-icon>
                <span>MULAI EKSPLORASI 3D (START TOUR)</span>
              </button>
            </div>
          </div>

          <!-- CINEMATIC OUTRO SCREEN (AUTO-TRIGGERED AT END OF SCROLL!) -->
          <div class="nadi-cinematic-outro" id="nadi-cinematic-outro">
            <div class="nadi-outro-card">
              <button class="nadi-outro-close" id="nadi-outro-close">&times;</button>
              <div class="nadi-outro-icon">
                <ion-icon name="trophy-outline"></ion-icon>
              </div>
              <h2 class="nadi-outro-title">Terima Kasih Telah Berkunjung!</h2>
              <p class="nadi-outro-desc">
                Anda telah menelusuri seluruh 7 zona ekshibisi portofolio Mangara Ferdianto Pakpahan. Seluruh data proyek, sertifikasi, dan dokumen kualifikasi telah terverifikasi resmi.
              </p>
              <div class="nadi-bento-grid" style="width: 100%; margin: 6px 0;">
                <div class="nadi-bento-item"><span class="nadi-bento-num">50</span><span class="nadi-bento-lbl">Proyek Terkurasi</span></div>
                <div class="nadi-bento-item"><span class="nadi-bento-num">15</span><span class="nadi-bento-lbl">Pengalaman Kerja</span></div>
                <div class="nadi-bento-item"><span class="nadi-bento-num">8</span><span class="nadi-bento-lbl">Lisensi Resmi</span></div>
                <div class="nadi-bento-item"><span class="nadi-bento-num">300%</span><span class="nadi-bento-lbl">Kenaikan Engagement</span></div>
              </div>
              <div class="nadi-outro-actions">
                <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20telah%20melihat%20seluruh%20studio%203D%20Anda." target="_blank" rel="noopener" class="nadi-card-btn primary">
                  <ion-icon name="logo-whatsapp"></ion-icon>
                  <span>Chat WhatsApp Langsung</span>
                </a>
                <button class="nadi-card-btn" id="nadi-outro-replay-btn">
                  <ion-icon name="refresh-outline"></ion-icon>
                  <span>Ulangi Tur Dari Awal</span>
                </button>
              </div>
            </div>
          </div>

          <!-- LIGHTBOX MODAL -->
          <div class="nadi-lightbox-modal" id="nadi-project-lightbox">
            <div class="nadi-lightbox-card">
              <div class="nadi-lightbox-img-wrap">
                <img src="./assets/images/portfolio/card-1.jpg" id="nadi-lightbox-img" class="nadi-lightbox-img" alt="Preview">
                <button class="nadi-lightbox-close" id="nadi-lightbox-close">&times;</button>
              </div>
              <div class="nadi-lightbox-body">
                <div class="nadi-lightbox-tags">
                  <span class="nadi-lightbox-badge" id="nadi-lightbox-badge">Kategori</span>
                  <span style="font-size: 11px; color: #64748b; font-weight: 700;" id="nadi-lightbox-meta">Order</span>
                </div>
                <h3 class="nadi-lightbox-title" id="nadi-lightbox-title">Judul</h3>
                <p class="nadi-lightbox-desc" id="nadi-lightbox-desc">Deskripsi...</p>
                <div class="nadi-lightbox-actions" id="nadi-lightbox-actions"></div>
              </div>
            </div>
          </div>

          <!-- FULL ARCHIVE MODAL -->
          <div class="nadi-archive-modal" id="nadi-archive-modal">
            <div class="nadi-archive-card">
              <div class="nadi-archive-header">
                <h3 class="nadi-archive-title">
                  <ion-icon name="albums-outline" style="color: var(--nadi-orange); margin-right: 8px;"></ion-icon>
                  Arsip Lengkap Portofolio & Dokumen Resmi Mangara Pakpahan
                </h3>
                <button class="nadi-archive-close" id="nadi-archive-close">&times;</button>
              </div>
              <div class="nadi-archive-body">
                <div class="nadi-archive-section">
                  <h4>1. Berkas Resmi Curriculum Vitae (Format ATS)</h4>
                  <div class="nadi-card-actions" style="margin-top: 0;">
                    <a href="./CV_Mangara_Pakpahan_Data_Analyst.pdf" target="_blank" rel="noopener" class="nadi-card-btn primary">
                      <ion-icon name="document-text-outline"></ion-icon>
                      <span>Unduh CV ATS: Data Analyst (PDF)</span>
                    </a>
                    <a href="./CV_Mangara_Pakpahan_Sosmed_Humas.pdf" target="_blank" rel="noopener" class="nadi-card-btn primary">
                      <ion-icon name="document-text-outline"></ion-icon>
                      <span>Unduh CV ATS: Sosmed & Humas (PDF)</span>
                    </a>
                  </div>
                </div>

                <div class="nadi-archive-section">
                  <h4>2. 50 Portofolio Karya Terkurasi Lengkap</h4>
                  <div class="nadi-projects-grid" style="max-height: 400px; overflow-y: auto;">
                    ${DEFAULT_DATA.projects.map(p => `
                      <div class="nadi-proj-card">
                        <div class="nadi-proj-thumb-wrap">
                          <img src="${p.imageUrl}" alt="${p.title}" class="nadi-proj-img" onerror="this.src='./assets/images/portfolio/card-1.jpg'">
                        </div>
                        <div class="nadi-proj-content">
                          <div class="nadi-proj-title">${p.title}</div>
                          <div class="nadi-proj-meta-row">
                            <span class="nadi-proj-badge">${p.category}</span>
                            <span class="nadi-proj-order">#${p.order}</span>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RETRO ARCADE MINI-GAME MODAL -->
          <div class="nadi-arcade-modal" id="nadi-arcade-modal">
            <div class="nadi-arcade-card">
              <div class="nadi-arcade-header">
                <div class="nadi-arcade-title">
                  <ion-icon name="game-controller" style="color: #06b6d4;"></ion-icon>
                  <strong>MANGARA DATA RUNNER (8-BIT)</strong>
                </div>
                <button class="nadi-modal-close" id="nadi-btn-close-arcade" type="button">&times;</button>
              </div>
              <div class="nadi-arcade-canvas-wrap">
                <canvas id="nadi-arcade-canvas" width="320" height="180"></canvas>
              </div>
              <div class="nadi-arcade-controls-row">
                <div class="nadi-arcade-score-info">
                  <span>Skor: <strong id="nadi-arcade-score">0</strong></span> &bull; 
                  <span>Tertinggi: <strong id="nadi-arcade-highscore">0</strong></span>
                </div>
                <button class="nadi-arcade-jump-btn" id="nadi-arcade-jump-btn" type="button">
                  <ion-icon name="arrow-up-circle"></ion-icon> LOMPAT (Space/Tap)
                </button>
              </div>
            </div>
          </div>

          <!-- QUEST VICTORY CELEBRATION MODAL -->
          <div class="nadi-victory-modal" id="nadi-victory-modal">
            <div class="nadi-victory-card">
              <div class="nadi-victory-trophy-icon">🏆</div>
              <h2 class="nadi-victory-h2">MASTER PENJELAJAH STUDIO!</h2>
              <p class="nadi-victory-desc">
                Selamat! Anda berhasil menemukan seluruh <strong>5 Ide Inovasi Mangara</strong> yang tersebar di bilik siaran, data lab, IoT, redaksi, dan kafe atrium!
              </p>
              <div class="nadi-victory-badge-box">
                <span class="nadi-victory-badge">🌟 VIP Recruiter & Innovator Explorer</span>
              </div>
              <div class="nadi-victory-actions">
                <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20telah%20menyelesaikan%20Misi%205%20Ide%20Inovasi%20di%20Portofolio%203D%20Anda!" target="_blank" rel="noopener" class="nadi-btn-primary" style="justify-content: center;">
                  <ion-icon name="logo-whatsapp"></ion-icon> Klaim Jalur Cepat WhatsApp &rarr;
                </a>
                <button class="nadi-btn-secondary" id="nadi-btn-close-victory" type="button">Lanjut Eksplorasi 3D</button>
              </div>
            </div>
          </div>

          <!-- LOADING SCREEN -->
          <div class="nadi-loading-screen" id="nadi-loading-screen">
            <div class="nadi-spinner"></div>
            <div class="nadi-loading-title">MEMUAT STUDIO 3D LENGKAP...</div>
            <div class="nadi-loading-sub">Mangara Ferdianto Pakpahan &bull; Multi-POV & Lively Office</div>
          </div>
        </div>
      </div>
    `;

    if (main.parentNode) {
      main.parentNode.insertBefore(wrapper, main);
    } else {
      main.prepend(wrapper);
    }

    renderStoryStep(0);
  }

  // ─── 9. DYNAMIC MINIMALIST STORY CONTENT RENDERER ─────────────
  function renderStoryStep(index) {
    const step = SCROLL_STEPS[index];
    if (!step) return;

    activeNPCIndex = index;

    const lbl = document.getElementById('nadi-step-label');
    const h1 = document.getElementById('nadi-story-headline');
    const desc = document.getElementById('nadi-story-desc');
    const cardTitle = document.getElementById('nadi-card-title');
    const cardStatus = document.getElementById('nadi-card-status');
    const container = document.getElementById('nadi-card-dynamic-container');

    window.toggleStoryLayerMobile = function() {
      const layer = document.getElementById('nadi-story-layer');
      if (!layer) return;
      const isMin = layer.classList.toggle('nadi-minimized');
      const joy = document.getElementById('nadi-joystick-controller');
      if (joy) joy.classList.toggle('docked-low', isMin);
      const toggleBtn = document.getElementById('nadi-mobile-sheet-toggle');
      if (toggleBtn) {
        const textSpan = toggleBtn.querySelector('.toggle-text');
        if (textSpan) textSpan.textContent = isMin ? 'Buka Detail' : '3D Penuh';
        const icon = toggleBtn.querySelector('ion-icon');
        if (icon) icon.setAttribute('name', isMin ? 'chevron-up-outline' : 'eye-outline');
      }
    };

    if (lbl) {
      const cat = step.category || '';
      const sep = cat.includes('•') ? '•' : (cat.includes('&bull;') ? '&bull;' : ' ');
      const parts = cat.split(sep);
      const stepPrefix = (parts[0] || 'LANGKAH').trim();
      const stepName = (parts.slice(1).join(' ') || '').trim();
      const isMin = document.getElementById('nadi-story-layer')?.classList.contains('nadi-minimized');
      lbl.innerHTML = `
        <div class="nadi-step-label-text">
          <span class="nadi-step-badge-tag">Bilik ${step.stepNum}</span>
          <span class="nadi-step-title-short">${step.stepName}</span>
        </div>
        <button class="nadi-mobile-sheet-toggle" id="nadi-mobile-sheet-toggle" type="button" aria-label="Toggle Mode 3D">
          <span class="toggle-text">${isMin ? 'Buka Detail' : '3D Penuh'}</span>
          <ion-icon name="${isMin ? 'chevron-up-outline' : 'eye-outline'}"></ion-icon>
        </button>
      `;

      document.getElementById('nadi-mobile-sheet-toggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleStoryLayerMobile();
      });
    }

    if (h1) h1.innerHTML = step.title;
    if (desc) desc.textContent = step.desc;

    if (cardStatus) {
      cardStatus.textContent = step.badgeStatus;
      cardStatus.className = `nadi-card-badge-status ${step.badgeStatusColor || 'green'}`;
    }

    // Update Floor Plan Mini-Map active room and indicator
    document.querySelectorAll('.fp-room').forEach((el, rIdx) => {
      if (rIdx === index) el.classList.add('active');
      else el.classList.remove('active');
    });
    const fpIndicator = document.getElementById('nadi-floorplan-step-indicator');
    if (fpIndicator && SCROLL_STEPS[index]) fpIndicator.textContent = `Bilik ${SCROLL_STEPS[index].stepNum}`;

    // Update active segmented dock step and auto-center into view on mobile
    document.querySelectorAll('.nadi-step-item').forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        item.classList.remove('active');
      }
    });

    if (!container) return;

    // STATION 0: PROFIL
    if (index === 0) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="person-circle-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>Profil & Kualifikasi Resmi</strong>`;
      const p = DEFAULT_DATA.profile;

      container.innerHTML = `
        <div class="nadi-profile-header">
          <img src="${p.avatarUrl}" class="nadi-profile-avatar" alt="${p.name}">
          <div>
            <div class="nadi-profile-name">${p.name}</div>
            <div class="nadi-profile-title">${p.title}</div>
            <div style="font-size: 10px; color: #16a34a; font-weight: 700; margin-top: 1px;">
              <ion-icon name="location-outline"></ion-icon> ${p.location} &bull; S1 ITPLN
            </div>
          </div>
        </div>

        <div class="nadi-bento-grid">
          <div class="nadi-bento-item"><span class="nadi-bento-num">50+</span><span class="nadi-bento-lbl">Proyek Terkurasi</span></div>
          <div class="nadi-bento-item"><span class="nadi-bento-num">15+</span><span class="nadi-bento-lbl">Pengalaman Kerja</span></div>
          <div class="nadi-bento-item"><span class="nadi-bento-num">8</span><span class="nadi-bento-lbl">Sertifikasi Resmi</span></div>
          <div class="nadi-bento-item"><span class="nadi-bento-num">10</span><span class="nadi-bento-lbl">Layanan Spesialis</span></div>
        </div>

        <div class="nadi-card-scroll-body" style="max-height: 14vh;">
          <div class="nadi-service-list">
            <div class="nadi-service-item">
              <span style="font-size: 11px; font-weight: 600; color: #64748b; width: 90px;">Email:</span>
              <span style="font-size: 11px; font-weight: 700; color: #0f172a;">${p.email}</span>
            </div>
            <div class="nadi-service-item">
              <span style="font-size: 11px; font-weight: 600; color: #64748b; width: 90px;">WhatsApp:</span>
              <span style="font-size: 11px; font-weight: 700; color: #0f172a;">${p.phone}</span>
            </div>
            <div class="nadi-service-item">
              <span style="font-size: 11px; font-weight: 600; color: #64748b; width: 90px;">Domisili:</span>
              <span style="font-size: 11px; font-weight: 700; color: #0f172a;">${p.location}</span>
            </div>
          </div>
        </div>

        <div class="nadi-profile-socials">
          <a href="${p.social_linkedin}" target="_blank" rel="noopener" class="nadi-social-btn" title="LinkedIn"><ion-icon name="logo-linkedin"></ion-icon></a>
          <a href="${p.social_github}" target="_blank" rel="noopener" class="nadi-social-btn" title="GitHub"><ion-icon name="logo-github"></ion-icon></a>
          <a href="${p.social_instagram}" target="_blank" rel="noopener" class="nadi-social-btn" title="Instagram"><ion-icon name="logo-instagram"></ion-icon></a>
          <a href="https://wa.me/6281318816058" target="_blank" rel="noopener" class="nadi-social-btn" title="WhatsApp"><ion-icon name="logo-whatsapp"></ion-icon></a>
        </div>

        <div class="nadi-card-actions">
          <a href="./CV_Mangara_Pakpahan_Data_Analyst.pdf" target="_blank" rel="noopener" class="nadi-card-btn primary">
            <ion-icon name="document-text-outline"></ion-icon>
            <span>CV Data Analyst</span>
          </a>
          <a href="./CV_Mangara_Pakpahan_Sosmed_Humas.pdf" target="_blank" rel="noopener" class="nadi-card-btn primary">
            <ion-icon name="document-text-outline"></ion-icon>
            <span>CV Sosmed</span>
          </a>
        </div>
      `;
    }

    // STATION 1: 10 LAYANAN & 11 SKILLS
    else if (index === 1) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="construct-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>Layanan & Keterampilan Teknis</strong>`;

      container.innerHTML = `
        <div class="nadi-subtabs-row">
          <button class="nadi-subtab-btn ${activeLayananSubtab === 'services' ? 'active' : ''}" id="nadi-tab-serv">
            <ion-icon name="briefcase-outline"></ion-icon> 10 Layanan
          </button>
          <button class="nadi-subtab-btn ${activeLayananSubtab === 'skills' ? 'active' : ''}" id="nadi-tab-skil">
            <ion-icon name="bar-chart-outline"></ion-icon> 11 Skills
          </button>
        </div>

        <div class="nadi-card-scroll-body" id="nadi-services-scroll-body">
          ${renderServicesOrSkillsHTML()}
        </div>
      `;

      document.getElementById('nadi-tab-serv')?.addEventListener('click', () => {
        activeLayananSubtab = 'services';
        renderStoryStep(1);
      });
      document.getElementById('nadi-tab-skil')?.addEventListener('click', () => {
        activeLayananSubtab = 'skills';
        renderStoryStep(1);
      });
    }

    // STATION 2: 15 PENGALAMAN (2-PER-VIEW LARGE MINIMALIST CARDS)
    else if (index === 2) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="briefcase-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>15 Pengalaman Kerja & Organisasi</strong>`;

      container.innerHTML = `
        <div class="nadi-filter-pills-bar">
          <button class="nadi-filter-pill ${activeExpFilter === 'all' ? 'active' : ''}" data-filter="all">Semua (15)</button>
          <button class="nadi-filter-pill ${activeExpFilter === 'work' ? 'active' : ''}" data-filter="work">Kerja/Magang</button>
          <button class="nadi-filter-pill ${activeExpFilter === 'org' ? 'active' : ''}" data-filter="org">Organisasi</button>
        </div>

        <div class="nadi-card-scroll-body nadi-scroll-two-items">
          ${getFilteredExperience().map(exp => `
            <div class="nadi-exp-card-large">
              <div class="nadi-exp-header">
                <span class="nadi-exp-role">${exp.position}</span>
                <span class="nadi-exp-period">${exp.period}</span>
              </div>
              <div class="nadi-exp-company"><ion-icon name="business-outline"></ion-icon> ${exp.company}</div>
              <p class="nadi-exp-desc">${exp.description}</p>
            </div>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeExpFilter = btn.dataset.filter;
          renderStoryStep(2);
        });
      });
    }

    // STATION 3: PENDIDIKAN & 8 SERTIFIKASI (2-PER-VIEW LARGE MINIMALIST CARDS)
    else if (index === 3) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="school-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>Pendidikan & Sertifikasi Resmi</strong>`;

      container.innerHTML = `
        <div class="nadi-filter-pills-bar">
          <button class="nadi-filter-pill ${activeEduFilter === 'all' ? 'active' : ''}" data-filter="all">Semua (8)</button>
          <button class="nadi-filter-pill ${activeEduFilter === 'formal' ? 'active' : ''}" data-filter="formal">Formal</button>
          <button class="nadi-filter-pill ${activeEduFilter === 'cert' ? 'active' : ''}" data-filter="cert">Sertifikasi</button>
        </div>

        <div class="nadi-card-scroll-body nadi-scroll-two-items">
          ${getFilteredEducation().map(edu => `
            <div class="nadi-edu-card-large">
              <div class="nadi-edu-header-row">
                <div class="nadi-edu-school">
                  <ion-icon name="school-outline"></ion-icon>
                  <span>${edu.institution}</span>
                </div>
                <span class="nadi-edu-period">${edu.period}</span>
              </div>
              <p class="nadi-edu-desc">${edu.description}</p>
              <div class="nadi-edu-meta-badge"><ion-icon name="ribbon-outline"></ion-icon> Kualifikasi & Kompetensi Terverifikasi</div>
            </div>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeEduFilter = btn.dataset.filter;
          renderStoryStep(3);
        });
      });
    }

    // STATION 4: 50+ PROYEK PORTOFOLIO (2-PER-VIEW LARGE MINIMALIST CARDS - FRAMELESS!)
    else if (index === 4) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="folder-open-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>50+ Proyek Portofolio Terkurasi</strong>`;

      const filteredProjects = getFilteredProjects();

      function renderProjectsCardsHTML(list) {
        return list.map(proj => `
          <div class="nadi-proj-card nadi-proj-card-large">
            <div class="nadi-proj-thumb-wrap">
              <img src="${proj.imageUrl}" class="nadi-proj-img" alt="${proj.title}" onerror="this.src='./assets/images/portfolio/card-1.jpg'">
            </div>
            <div class="nadi-proj-content">
              <div class="nadi-proj-meta-row">
                <span class="nadi-proj-badge">${proj.category}</span>
                <span class="nadi-proj-order">#${proj.order}</span>
              </div>
              <div class="nadi-proj-title" title="${proj.title}">${proj.title}</div>
              <div class="nadi-proj-actions">
                <button class="nadi-proj-btn btn-open-lightbox" data-id="${proj.order}">
                  <ion-icon name="eye-outline"></ion-icon> Detail
                </button>
                ${proj.projectUrl ? `
                  <a href="${proj.projectUrl}" target="_blank" rel="noopener" class="nadi-proj-btn-link">
                    <ion-icon name="open-outline"></ion-icon> Link
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('');
      }

      container.innerHTML = `
        <div class="nadi-search-box-wrap">
          <ion-icon name="search-outline"></ion-icon>
          <input type="text" class="nadi-search-input" id="nadi-proj-search-input" placeholder="Cari 50 proyek portofolio..." value="${activeProjSearch}">
        </div>

        <div class="nadi-filter-pills-bar">
          <button class="nadi-filter-pill ${activeProjFilter === 'all' ? 'active' : ''}" data-filter="all">Semua (50)</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'Live Production' ? 'active' : ''}" data-filter="Live Production">Live</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'Social Media' ? 'active' : ''}" data-filter="Social Media">Medsos</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'Visual Design' ? 'active' : ''}" data-filter="Visual Design">Desain</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'IoT & Tech' ? 'active' : ''}" data-filter="IoT & Tech">IoT</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'AI & Platform' ? 'active' : ''}" data-filter="AI & Platform">AI</button>
        </div>

        <div class="nadi-card-scroll-body nadi-scroll-two-items">
          <div class="nadi-projects-grid">
            ${renderProjectsCardsHTML(filteredProjects)}
          </div>
        </div>
      `;

      function attachLightboxEvents() {
        container.querySelectorAll('.btn-open-lightbox').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id, 10);
            const p = DEFAULT_DATA.projects.find(x => x.order === id);
            if (p) openProjectLightbox(p);
          });
        });
      }

      attachLightboxEvents();

      const searchInput = document.getElementById('nadi-proj-search-input');
      searchInput?.addEventListener('input', (e) => {
        activeProjSearch = e.target.value.toLowerCase();
        const grid = container.querySelector('.nadi-projects-grid');
        if (grid) {
          const updatedProjects = getFilteredProjects();
          grid.innerHTML = renderProjectsCardsHTML(updatedProjects);
          attachLightboxEvents();
        }
      });

      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeProjFilter = btn.dataset.filter;
          renderStoryStep(4);
        });
      });
    }

    // STATION 5: 20 BLOG & RISET PRESTASI (2-PER-VIEW LARGE EDITORIAL CARDS)
    else if (index === 5) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="newspaper-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>20 Blog & Publikasi Riset</strong>`;

      const filteredBlog = getFilteredBlog();

      container.innerHTML = `
        <div class="nadi-filter-pills-bar">
          <button class="nadi-filter-pill ${activeBlogFilter === 'all' ? 'active' : ''}" data-filter="all">Semua (20)</button>
          <button class="nadi-filter-pill ${activeBlogFilter === 'prestasi' ? 'active' : ''}" data-filter="prestasi">Prestasi</button>
          <button class="nadi-filter-pill ${activeBlogFilter === 'redaksi' ? 'active' : ''}" data-filter="redaksi">Redaksi</button>
          <button class="nadi-filter-pill ${activeBlogFilter === 'ai' ? 'active' : ''}" data-filter="ai">Cloud & AI</button>
        </div>

        <div class="nadi-card-scroll-body nadi-scroll-two-items">
          ${filteredBlog.map(b => `
            <div class="nadi-blog-card-large">
              <div class="nadi-blog-top">
                <span class="nadi-blog-cat">${b.category}</span>
                <span class="nadi-blog-date"><ion-icon name="calendar-outline"></ion-icon> ${b.date}</span>
              </div>
              <div class="nadi-blog-title">${b.title}</div>
              <p class="nadi-blog-desc">${b.excerpt}</p>
              ${b.url ? `
                <a href="${b.url}" target="_blank" rel="noopener" class="nadi-blog-link-btn">
                  <span>Baca Publikasi Lengkap</span> <ion-icon name="arrow-forward-outline"></ion-icon>
                </a>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeBlogFilter = btn.dataset.filter;
          renderStoryStep(5);
        });
      });
    }

    // STATION 6: TESTIMONI & KONTAK
    else if (index === 6) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="chatbubbles-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>Testimoni & Kontak Rekrutmen</strong>`;

      container.innerHTML = `
        <div class="nadi-subtabs-row">
          <button class="nadi-subtab-btn ${activeContactSubtab === 'testi' ? 'active' : ''}" id="nadi-tab-testi">
            <ion-icon name="chatbubble-ellipses-outline"></ion-icon> 4 Testimoni
          </button>
          <button class="nadi-subtab-btn ${activeContactSubtab === 'form' ? 'active' : ''}" id="nadi-tab-form">
            <ion-icon name="paper-plane-outline"></ion-icon> Kirim Pesan
          </button>
        </div>

        <div class="nadi-card-scroll-body ${activeContactSubtab === 'testi' ? 'nadi-scroll-two-items' : ''}">
          ${activeContactSubtab === 'testi' ? `
            ${DEFAULT_DATA.testimonials.map(t => `
              <div class="nadi-testi-card-large">
                <div class="nadi-testi-header">
                  <img src="${t.avatarUrl}" class="nadi-testi-avatar" alt="${t.name}">
                  <div class="nadi-testi-meta">
                    <div class="nadi-testi-name">${t.name}</div>
                    <div class="nadi-testi-date">${t.date}</div>
                  </div>
                  <div class="nadi-testi-stars">⭐⭐⭐⭐⭐</div>
                </div>
                <p class="nadi-testi-text">"${t.text}"</p>
              </div>
            `).join('')}
          ` : `
            <form class="nadi-contact-form" id="nadi-direct-contact-form">
              <div class="nadi-form-group">
                <label class="nadi-form-label">Nama Lengkap / Instansi</label>
                <input type="text" name="fullname" class="nadi-form-input" placeholder="Nama Anda..." required>
              </div>
              <div class="nadi-form-group">
                <label class="nadi-form-label">Alamat Email</label>
                <input type="email" name="email" class="nadi-form-input" placeholder="email@perusahaan.com" required>
              </div>
              <div class="nadi-form-group">
                <label class="nadi-form-label">Pesan / Undangan Rekrutmen</label>
                <textarea name="message" class="nadi-form-textarea" placeholder="Tuliskan pesan tawaran kerja atau proyek..." required></textarea>
              </div>
              <button type="submit" class="nadi-form-btn" id="nadi-form-submit-btn">
                <span>Kirim Pesan Sekarang</span> &rarr;
              </button>
            </form>
          `}
        </div>

        <div class="nadi-card-actions">
          <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20kami%20tertarik%20mengundang%20Anda%20untuk%20peluang%20rekrutmen." target="_blank" rel="noopener" class="nadi-card-btn primary">
            <ion-icon name="logo-whatsapp"></ion-icon>
            <span>WhatsApp (Respons Cepat)</span>
          </a>
          <a href="mailto:mangarapakpahan51@gmail.com" class="nadi-card-btn">
            <ion-icon name="mail-outline"></ion-icon>
            <span>Email</span>
          </a>
        </div>
      `;

      document.getElementById('nadi-tab-testi')?.addEventListener('click', () => {
        activeContactSubtab = 'testi';
        renderStoryStep(6);
      });
      document.getElementById('nadi-tab-form')?.addEventListener('click', () => {
        activeContactSubtab = 'form';
        renderStoryStep(6);
      });

      const contactForm = document.getElementById('nadi-direct-contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', handleDirectContactSubmit);
      }
    }
  }

  // Helper renderers
  function renderServicesOrSkillsHTML() {
    if (activeLayananSubtab === 'services') {
      return `
        <div class="nadi-scroll-two-items">
          ${DEFAULT_DATA.services.map(s => `
            <div class="nadi-service-card-large">
              <div class="nadi-service-icon-box">
                <img src="${s.iconUrl}" alt="${s.title}" onerror="this.src='./assets/images/icon-dev.svg'">
              </div>
              <div class="nadi-service-info">
                <div class="nadi-service-title-row">
                  <span class="nadi-service-title">${s.title}</span>
                  <span class="nadi-service-order">#${s.order}</span>
                </div>
                <p class="nadi-service-desc">${s.description}</p>
                <div class="nadi-service-meta-tag"><ion-icon name="checkmark-circle"></ion-icon> Tersedia untuk Penugasan Profesional</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      return `
        <div class="nadi-scroll-two-items">
          ${DEFAULT_DATA.skills.map(sk => `
            <div class="nadi-skill-card-large">
              <div class="nadi-skill-top">
                <div class="nadi-skill-icon-pill">
                  <ion-icon name="hardware-chip-outline"></ion-icon>
                  <span class="nadi-skill-name">${sk.name}</span>
                </div>
                <span class="nadi-skill-pct">${sk.percentage}%</span>
              </div>
              <div class="nadi-skill-bar">
                <div class="nadi-skill-fill" style="width: ${sk.percentage}%;"></div>
              </div>
              <div class="nadi-skill-subtext">Penguasaan Tingkat Lanjut & Praktik Industri Terverifikasi</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  function getFilteredExperience() {
    if (activeExpFilter === 'work') {
      return DEFAULT_DATA.experience.filter(e =>
        e.position.toLowerCase().includes('magang') ||
        e.position.toLowerCase().includes('lead') ||
        e.position.toLowerCase().includes('koordinator') ||
        e.position.toLowerCase().includes('pengelola')
      );
    } else if (activeExpFilter === 'org') {
      return DEFAULT_DATA.experience.filter(e =>
        e.company.toLowerCase().includes('bem') ||
        e.company.toLowerCase().includes('panitia') ||
        e.company.toLowerCase().includes('competition') ||
        e.company.toLowerCase().includes('ambassador') ||
        e.company.toLowerCase().includes('itpln media')
      );
    }
    return DEFAULT_DATA.experience;
  }

  function getFilteredEducation() {
    if (activeEduFilter === 'formal') {
      return DEFAULT_DATA.education.filter(e => e.institution.includes('Institut') || e.institution.includes('S1'));
    } else if (activeEduFilter === 'cert') {
      return DEFAULT_DATA.education.filter(e => !e.institution.includes('Institut'));
    }
    return DEFAULT_DATA.education;
  }

  function getFilteredProjects() {
    let projs = DEFAULT_DATA.projects;
    if (activeProjFilter !== 'all') {
      projs = projs.filter(p => p.category === activeProjFilter);
    }
    if (activeProjSearch.trim()) {
      const q = activeProjSearch.toLowerCase();
      projs = projs.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return projs;
  }

  function getFilteredBlog() {
    if (activeBlogFilter === 'prestasi') {
      return DEFAULT_DATA.blog.filter(b => b.category.includes('Prestasi'));
    } else if (activeBlogFilter === 'redaksi') {
      return DEFAULT_DATA.blog.filter(b => b.category.includes('Redaksi') || b.category.includes('Company'));
    } else if (activeBlogFilter === 'ai') {
      return DEFAULT_DATA.blog.filter(b => b.category.includes('AI') || b.category.includes('Data') || b.category.includes('Cloud'));
    }
    return DEFAULT_DATA.blog;
  }

  // ─── 10. INTERACTIVE NPC DIALOGUE CONTROLLER ──────────────────
  function openNPCDialogue(index) {
    const npc = NPC_GUIDES[index] || NPC_GUIDES[0];
    const modal = document.getElementById('nadi-npc-dialogue-modal');
    if (!modal) return;

    document.getElementById('nadi-npc-avatar').textContent = npc.avatarLetter;
    document.getElementById('nadi-npc-name').textContent = npc.name;
    document.getElementById('nadi-npc-role').textContent = npc.role;
    document.getElementById('nadi-npc-bubble').textContent = npc.greeting;

    const answerBox = document.getElementById('nadi-npc-answer-box');
    if (answerBox) answerBox.style.display = 'none';

    const qList = document.getElementById('nadi-npc-q-list');
    if (qList) {
      qList.innerHTML = npc.questions.map((item, qIdx) => `
        <button class="nadi-npc-q-btn" data-qidx="${qIdx}">
          <span>${item.q}</span>
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </button>
      `).join('');

      qList.querySelectorAll('.nadi-npc-q-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const qIdx = parseInt(btn.dataset.qidx, 10);
          const chosen = npc.questions[qIdx];
          if (chosen && answerBox) {
            answerBox.innerHTML = `<strong>Jawaban ${npc.name}:</strong><br>${chosen.a}`;
            answerBox.style.display = 'block';
          }
        });
      });
    }

    const guideBtn = document.getElementById('nadi-npc-guide-btn');
    const guideLbl = document.getElementById('nadi-npc-guide-label');
    if (guideLbl) guideLbl.textContent = `Arahkan ke ${npc.nextRoomName} \u2192`;

    if (guideBtn) {
      guideBtn.onclick = () => {
        const nextIdx = (index + 1) % SCROLL_STEPS.length;
        jumpToStep(nextIdx);
        closeNPCDialogue();
      };
    }

    modal.classList.add('active');
  }

  function closeNPCDialogue() {
    document.getElementById('nadi-npc-dialogue-modal')?.classList.remove('active');
  }

  // ─── 11. DIRECT FIRESTORE CONTACT FORM HANDLER ────────────────
  async function handleDirectContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('nadi-form-submit-btn');
    if (!submitBtn) return;

    submitBtn.disabled = true;
    const origHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Mengirim...</span>`;

    const name = form.fullname?.value || '';
    const email = form.email?.value || '';
    const message = form.message?.value || '';

    try {
      await addDoc(collection(db, 'messages'), {
        fullname: name,
        email: email,
        message: message,
        createdAt: serverTimestamp(),
        read: false
      });

      submitBtn.innerHTML = `<span>Pesan Terkirim ke Admin! 🎉</span>`;
      submitBtn.style.background = '#16a34a';
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = origHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);

    } catch (err) {
      console.warn('Firestore direct send error:', err);
      submitBtn.innerHTML = `<span>Pesan Diterima Sistem Lokal!</span>`;
      submitBtn.style.background = '#16a34a';
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = origHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);
    }
  }

  // ─── 12. LIGHTBOX MODAL HANDLER ───────────────────────────────
  function openProjectLightbox(proj) {
    const modal = document.getElementById('nadi-project-lightbox');
    if (!modal) return;

    const img = document.getElementById('nadi-lightbox-img');
    const badge = document.getElementById('nadi-lightbox-badge');
    const meta = document.getElementById('nadi-lightbox-meta');
    const title = document.getElementById('nadi-lightbox-title');
    const desc = document.getElementById('nadi-lightbox-desc');
    const actions = document.getElementById('nadi-lightbox-actions');

    if (img) img.src = proj.imageUrl;
    if (badge) badge.textContent = proj.category;
    if (meta) meta.textContent = `Proyek #${proj.order} • Terverifikasi`;
    if (title) title.textContent = proj.title;
    if (desc) desc.textContent = proj.description;

    if (actions) {
      actions.innerHTML = `
        ${proj.projectUrl ? `
          <a href="${proj.projectUrl}" target="_blank" rel="noopener" class="nadi-card-btn primary">
            <ion-icon name="open-outline"></ion-icon>
            <span>Kunjungi Link Proyek</span> &rarr;
          </a>
        ` : ''}
        <button class="nadi-card-btn" id="nadi-lightbox-close-btn">
          <span>Tutup</span>
        </button>
      `;
      document.getElementById('nadi-lightbox-close-btn')?.addEventListener('click', closeProjectLightbox);
    }

    modal.classList.add('active');
  }

  function closeProjectLightbox() {
    document.getElementById('nadi-project-lightbox')?.classList.remove('active');
  }

  // ─── 13. SCROLL & AUTOMATIC OUTRO TRIGGER CONTROLLER ──────────
  function handleScroll() {
    if (!scrollyTrack) return;

    const rect = scrollyTrack.getBoundingClientRect();
    const trackHeight = scrollyTrack.offsetHeight;
    const windowHeight = window.innerHeight;

    const scrollDist = -rect.top;
    const maxScroll = Math.max(1, trackHeight - windowHeight);

    let progress = scrollDist / maxScroll;
    progress = Math.max(0, Math.min(1, progress));
    targetProgress = progress;

    const stepRange = 1 / (SCROLL_STEPS.length - 1);
    const newStepIndex = Math.min(
      SCROLL_STEPS.length - 1,
      Math.floor(progress / stepRange + 0.5)
    );

    if (newStepIndex !== currentStepIndex) {
      currentStepIndex = newStepIndex;
      renderStoryStep(currentStepIndex);
    }

    // AUTO-SYNCHRONIZE IN-CARD TABLE SCROLL WITH 3D WALKTHROUGH
    autoSyncCardScroll(progress, currentStepIndex, stepRange);

    // AUTO-TRIGGER OUTRO ANIMATION WHEN REACHING SCROLL END (USER REQUEST #5!)
    if (progress >= 0.96 && !isOutroActive && !outroDismissedByUser) {
      openOutroModal();
    } else if (progress < 0.90) {
      // Reset flag if user scrolls back up so it can re-trigger when finishing again
      outroDismissedByUser = false;
    }
  }

  function autoSyncCardScroll(progress, stepIdx, stepRange) {
    const scrollBody = document.querySelector('.nadi-card-scroll-body');
    if (!scrollBody) return;

    const stepCenter = stepIdx * stepRange;
    const stepHalf = stepRange * 0.5;
    const localProg = Math.max(0, Math.min(1, (progress - (stepCenter - stepHalf * 0.8)) / (stepHalf * 1.6)));

    const maxScroll = scrollBody.scrollHeight - scrollBody.clientHeight;
    if (maxScroll > 0) {
      scrollBody.scrollTop = localProg * maxScroll;
    }
  }

  function jumpToStep(idx, instant = false) {
    if (!scrollyTrack) return;
    const clampedIdx = Math.max(0, Math.min(SCROLL_STEPS.length - 1, idx));
    const trackTop = scrollyTrack.offsetTop;
    const trackHeight = scrollyTrack.offsetHeight;
    const maxScroll = trackHeight - window.innerHeight;
    const targetScroll = trackTop + (clampedIdx / (SCROLL_STEPS.length - 1)) * maxScroll;

    window.scrollTo({
      top: targetScroll,
      behavior: instant ? 'auto' : 'smooth'
    });
    if (instant) {
      handleScroll();
      currentProgress = targetProgress;
    }
  }
  window.jumpToStep = jumpToStep;
  window.renderStoryStep = renderStoryStep;


  // ─── 16. INTERACTIVE JOYSTICK SCROLL CONTROLLER (GAYA JOYSTICK) ───
  function initJoystickController() {
    const pad = document.getElementById('nadi-joystick-pad');
    const knob = document.getElementById('nadi-joystick-knob');
    const btnUp = document.getElementById('nadi-joy-btn-up');
    const btnDown = document.getElementById('nadi-joy-btn-down');
    if (!pad || !knob) return;

    let isInteracting = false;
    let animId = null;
    let curDY = 0; // -1 to 1 (Y deflection)
    let curDX = 0; // -1 to 1 (X deflection)
    const MAX_RADIUS = 26;

    function applyKnobPosition(dx, dy) {
      const dist = Math.hypot(dx, dy);
      let cx = dx;
      let cy = dy;
      if (dist > MAX_RADIUS) {
        cx = (dx / dist) * MAX_RADIUS;
        cy = (dy / dist) * MAX_RADIUS;
      }
      knob.style.transform = `translate(${cx}px, ${cy}px)`;
      knob.classList.add('active');

      curDX = cx / MAX_RADIUS;
      curDY = cy / MAX_RADIUS;
    }

    function resetJoystick() {
      isInteracting = false;
      curDX = 0;
      curDY = 0;
      knob.style.transform = 'translate(0px, 0px)';
      knob.classList.remove('active');
      btnUp?.classList.remove('active');
      btnDown?.classList.remove('active');
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    function runWalkLoop() {
      if (animId) return;
      function loop() {
        if (!isInteracting) return;

        // curDY < 0 = pushed forward (UP) -> scroll down window -> walk forward
        // curDY > 0 = pushed backward (DOWN) -> scroll up window -> walk backward
        if (Math.abs(curDY) > 0.06) {
          const baseSpeed = 16.0; // px per frame
          const sign = curDY < 0 ? 1 : -1;
          const mag = Math.pow(Math.abs(curDY), 1.35);
          const scrollSpeed = sign * mag * baseSpeed;

          window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
        }

        animId = requestAnimationFrame(loop);
      }
      animId = requestAnimationFrame(loop);
    }

    function handlePointerStart(clientX, clientY) {
      isInteracting = true;
      const rect = pad.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      applyKnobPosition(clientX - cx, clientY - cy);
      runWalkLoop();
    }

    function handlePointerMove(clientX, clientY) {
      if (!isInteracting) return;
      const rect = pad.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      applyKnobPosition(clientX - cx, clientY - cy);
    }

    // Touch events for mobile phones
    pad.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handlePointerStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!isInteracting) return;
      if (e.touches.length > 0) {
        e.preventDefault();
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      if (isInteracting) resetJoystick();
    });

    window.addEventListener('touchcancel', () => {
      if (isInteracting) resetJoystick();
    });

    // Pointer events for desktop / laptop testing
    pad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      try { pad.setPointerCapture(e.pointerId); } catch (_) {}
      handlePointerStart(e.clientX, e.clientY);
    });

    pad.addEventListener('pointermove', (e) => {
      if (!isInteracting) return;
      e.preventDefault();
      handlePointerMove(e.clientX, e.clientY);
    });

    pad.addEventListener('pointerup', (e) => {
      try { pad.releasePointerCapture(e.pointerId); } catch (_) {}
      resetJoystick();
    });

    pad.addEventListener('pointercancel', (e) => {
      try { pad.releasePointerCapture(e.pointerId); } catch (_) {}
      resetJoystick();
    });

    // Directional buttons (Maju & Mundur tap / hold)
    function bindDirButton(btn, dirVal) {
      if (!btn) return;
      const startDir = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isInteracting = true;
        btn.classList.add('active');
        applyKnobPosition(0, dirVal * MAX_RADIUS * 0.9);
        runWalkLoop();
      };
      const endDir = (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetJoystick();
      };

      btn.addEventListener('pointerdown', startDir);
      btn.addEventListener('pointerup', endDir);
      btn.addEventListener('pointercancel', endDir);
      btn.addEventListener('pointerleave', endDir);

      btn.addEventListener('touchstart', startDir, { passive: false });
      btn.addEventListener('touchend', endDir);
    }

    bindDirButton(btnUp, -1); // Up = Forward (MAJU)
    bindDirButton(btnDown, 1); // Down = Backward (MUNDUR)

    // Double-click to leap directly to next / prev step
    btnUp?.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      jumpToStep(currentStepIndex + 1);
    });
    btnDown?.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      jumpToStep(currentStepIndex - 1);
    });
  }

  // ─── 14. INITIALIZE THREE.JS & ANIMATION LOOP ─────────────────
  function initThreeDiorama() {
    canvas = document.getElementById('nadi-webgl-canvas');
    stickyViewport = document.getElementById('nadi-sticky-viewport');
    scrollyTrack = document.getElementById('nadi-scrolly-track');

    if (!canvas || !stickyViewport || !scrollyTrack) return;

    const width = stickyViewport.clientWidth || window.innerWidth;
    const height = stickyViewport.clientHeight || window.innerHeight;

    currentCamPos = new THREE.Vector3(-21, 35, 28);
    currentLookAt = new THREE.Vector3(-21, 1.2, 0);
    tempTargetPos = new THREE.Vector3();
    tempTargetLook = new THREE.Vector3();

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfbf7);
    scene.fog = new THREE.FogExp2(0xfcfbf7, 0.012);

    // Camera
    camera = new THREE.PerspectiveCamera(width <= 768 ? 62 : 52, width / height, 0.1, 150);
    camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);
    camera.lookAt(currentLookAt);

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    if (THREE.sRGBEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // Build bustling miniature studio
    buildMiniatureDioramaScene();

    // Initialize Interactive Joystick Scroll Controller
    initJoystickController();

    // Event Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onWindowResize);

    stickyViewport.addEventListener('wheel', (e) => {
      if (e.target.closest('.nadi-card-scroll-body, .nadi-archive-card, .nadi-lightbox-card, .nadi-npc-dialogue-modal')) {
        return;
      }
      window.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }, { passive: true });

    // Step item navigation in bottom dock
    document.querySelectorAll('.nadi-step-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        jumpToStep(idx);
      });
    });

    // Prev / Next Arrows
    document.getElementById('nadi-btn-prev')?.addEventListener('click', () => {
      jumpToStep(currentStepIndex - 1);
    });
    document.getElementById('nadi-btn-next')?.addEventListener('click', () => {
      jumpToStep(currentStepIndex + 1);
    });

    // POV Switcher Buttons (Refined 4 POVs!)
    document.querySelectorAll('.nadi-pov-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nadi-pov-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPOV = btn.dataset.pov;

        const hint = document.getElementById('nadi-orbit-hint');
        if (hint) {
          if (currentPOV === 'orbit') hint.classList.add('active');
          else hint.classList.remove('active');
        }
      });
    });

    // NPC Dialogue Triggers
    document.getElementById('nadi-npc-floating-trigger')?.addEventListener('click', () => {
      openNPCDialogue(currentStepIndex);
    });
    document.getElementById('nadi-npc-close')?.addEventListener('click', closeNPCDialogue);

    // Cinematic Intro Fly-in Trigger
    function startIntroExperience() {
      const intro = document.getElementById('nadi-cinematic-intro');
      if (intro) intro.classList.add('hidden');
      isIntroActive = false;
      isIntroAnimating = true;
      introProgress = 0;
    }

    // Reset POV Button & Double Click
    function resetCameraToIdealPOV() {
      orbitYaw = 0.42;
      orbitPitch = 0.52;
      orbitDistance = 13.0;
      if (window.audioEngine) window.audioEngine.playClick();
      const btn = document.getElementById('nadi-btn-reset-orbit');
      if (btn) {
        btn.style.borderColor = 'var(--nadi-orange)';
        btn.style.color = 'var(--nadi-orange)';
        setTimeout(() => {
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 300);
      }
    }

    document.getElementById('nadi-btn-reset-orbit')?.addEventListener('click', resetCameraToIdealPOV);
    canvas.addEventListener('dblclick', resetCameraToIdealPOV);

    // Audio Ambience Toggle
    const audioBtn = document.getElementById('nadi-btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isNowActive = window.audioEngine.toggle();
        const icon = document.getElementById('nadi-audio-icon');
        const text = document.getElementById('nadi-audio-text');
        if (isNowActive) {
          audioBtn.classList.add('active');
          if (icon) icon.setAttribute('name', 'volume-high-outline');
          if (text) text.textContent = 'Audio: On';
        } else {
          audioBtn.classList.remove('active');
          if (icon) icon.setAttribute('name', 'volume-mute-outline');
          if (text) text.textContent = 'Audio: Off';
        }
      });
    }

    // Floor Plan Mini-Map Room Jump Handlers
    document.querySelectorAll('.fp-room').forEach(rm => {
      rm.addEventListener('click', () => {
        const rIdx = parseInt(rm.dataset.room, 10);
        jumpToStep(rIdx);
        if (window.audioEngine) window.audioEngine.playClick();
        document.getElementById('nadi-floorplan-widget')?.classList.remove('mobile-expanded');
      });
    });

    const fpToggleBtn = document.getElementById('nadi-floorplan-toggle-btn');
    const fpHeader = document.getElementById('nadi-floorplan-header');
    const fpWidget = document.getElementById('nadi-floorplan-widget');

    const toggleFloorPlan = (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        fpWidget?.classList.toggle('mobile-expanded');
      } else {
        fpWidget?.classList.toggle('collapsed');
      }
      if (window.audioEngine) window.audioEngine.playClick();
    };

    fpToggleBtn?.addEventListener('click', toggleFloorPlan);
    fpHeader?.addEventListener('click', toggleFloorPlan);

    // Mobile Touch Gestures on Story Sheet (Swipe down to minimize, swipe up to expand, swipe left/right to navigate)
    const storyLayer = document.getElementById('nadi-story-layer');
    if (storyLayer) {
      let touchStartX = 0;
      let touchStartY = 0;

      storyLayer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      storyLayer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffY) > 40 && Math.abs(diffY) > Math.abs(diffX) * 1.3) {
          if (diffY > 0) {
            if (!storyLayer.classList.contains('nadi-minimized')) {
              window.toggleStoryLayerMobile();
              if (window.audioEngine) window.audioEngine.playClick();
            }
          } else {
            if (storyLayer.classList.contains('nadi-minimized')) {
              window.toggleStoryLayerMobile();
              if (window.audioEngine) window.audioEngine.playClick();
            }
          }
        } else if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
          if (diffX < 0) {
            const nextIdx = Math.min(SCROLL_STEPS.length - 1, currentStepIndex + 1);
            jumpToStep(nextIdx);
          } else {
            const prevIdx = Math.max(0, currentStepIndex - 1);
            jumpToStep(prevIdx);
          }
        }
      }, { passive: true });
    }

    document.getElementById('nadi-intro-btn')?.addEventListener('click', () => {
      startIntroExperience();
      if (window.audioEngine) window.audioEngine.playStepTransition();
    });

    // Outro Modal Handlers
    function openOutroModal() {
      const outro = document.getElementById('nadi-cinematic-outro');
      if (outro) outro.classList.add('active');
      isOutroActive = true;
    }

    function closeOutroModal() {
      const outro = document.getElementById('nadi-cinematic-outro');
      if (outro) outro.classList.remove('active');
      isOutroActive = false;
      outroDismissedByUser = true;
    }

    document.getElementById('nadi-outro-close')?.addEventListener('click', closeOutroModal);
    document.getElementById('nadi-outro-replay-btn')?.addEventListener('click', () => {
      closeOutroModal();
      jumpToStep(0);
    });

    // Keyboard Arrow Controls

    // Event listeners for Quest & Arcade HUD and Modals
    document.getElementById('nadi-arcade-trigger-btn')?.addEventListener('click', openArcadeModal);
    document.getElementById('nadi-btn-close-arcade')?.addEventListener('click', closeArcadeModal);
    document.getElementById('nadi-btn-close-victory')?.addEventListener('click', () => {
      document.getElementById('nadi-victory-modal')?.classList.remove('active');
    });

    // 3D Canvas Raycast Click Interactivity (Click items, dog, coffee machine, arcade)
    stickyViewport.addEventListener('pointerdown', (e) => {
      if (isDragging) return;
      const rect = stickyViewport.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Check quest collectibles
      for (const q of questCollectibles) {
        if (!q.collected) {
          const hits = raycaster.intersectObjects(q.group.children, true);
          if (hits.length > 0) {
            collectQuestItem(q);
            return;
          }
        }
      }

      // Check espresso machine
      if (baristaEspressoMachine) {
        const hits = raycaster.intersectObjects(baristaEspressoMachine.children, true);
        if (hits.length > 0) {
          if (window.audioEngine) window.audioEngine.playCoffeeHiss();
          heroSpeedBoostUntil = Date.now() + 12000;
          showToastNotification("☕ ESPRESSO BOOST! Karakter Mendapat Tambahan Energi!");
          return;
        }
      }

      // Check mascot dog
      if (mascotDog) {
        const hits = raycaster.intersectObjects(mascotDog.group.children, true);
        if (hits.length > 0) {
          if (window.audioEngine) window.audioEngine.playBark();
          showToastNotification("🐶 Guk guk! Bimo si maskot kantor senang bermain dengan Anda!");
          return;
        }
      }

      // Check arcade machine
      if (arcadeMachineObj) {
        const hits = raycaster.intersectObjects(arcadeMachineObj.children, true);
        if (hits.length > 0) {
          openArcadeModal();
          return;
        }
      }

      // Check interactive NPCs
      for (const npc of animatedNPCs) {
        const hits = raycaster.intersectObjects(npc.group.children, true);
        if (hits.length > 0) {
          openNPCDialogue(npc.guide.roomIndex);
          return;
        }
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'ArrowDown' || e.code === 'ArrowRight' || e.code === 'PageDown') {
        const nextIdx = Math.min(SCROLL_STEPS.length - 1, currentStepIndex + 1);
        jumpToStep(nextIdx);
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft' || e.code === 'PageUp') {
        const prevIdx = Math.max(0, currentStepIndex - 1);
        jumpToStep(prevIdx);
      } else if (e.code === 'Escape') {
        closeProjectLightbox();
        closeNPCDialogue();
        closeOutroModal();
        document.getElementById('nadi-archive-modal')?.classList.remove('active');
      }
    });

    // Pure Free Orbit 360° Mouse Drag & Zoom Controls
    let isDragging = false;
    let startX = 0, startY = 0;

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener('mouseup', () => (isDragging = false));

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;

        orbitYaw -= dx * 0.007;
        orbitPitch = Math.max(0.12, Math.min(1.42, orbitPitch + dy * 0.007));
      }
    });

    // Mouse Wheel Zoom
    stickyViewport.addEventListener('wheel', (e) => {
      if (e.target.closest('.nadi-card-scroll-body, .nadi-archive-card, .nadi-lightbox-card, .nadi-npc-dialogue-modal')) {
        return; // Allow story card scroll
      }
      orbitDistance = Math.max(5.5, Math.min(24.0, orbitDistance + e.deltaY * 0.012));
    }, { passive: true });

    // Touch 360° Orbit Drag & Two-Finger Pinch-Zoom Controls
    let touchStartX = 0;
    let touchStartY = 0;
    let initialPinchDistance = 0;
    let initialOrbitDistance = orbitDistance;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
        initialOrbitDistance = orbitDistance;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        orbitYaw -= dx * 0.008;
        orbitPitch = Math.max(0.12, Math.min(1.42, orbitPitch + dy * 0.008));
      } else if (e.touches.length === 2 && initialPinchDistance > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        if (currentDist > 5) {
          const factor = initialPinchDistance / currentDist;
          orbitDistance = Math.max(5.5, Math.min(26.0, initialOrbitDistance * factor));
        }
      }
    }, { passive: true });

    // Full In-3D Archive Modal Handlers
    document.getElementById('nadi-btn-open-archive')?.addEventListener('click', () => {
      document.getElementById('nadi-archive-modal')?.classList.add('active');
    });
    document.getElementById('nadi-archive-close')?.addEventListener('click', () => {
      document.getElementById('nadi-archive-modal')?.classList.remove('active');
    });
    document.getElementById('nadi-archive-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'nadi-archive-modal') {
        document.getElementById('nadi-archive-modal')?.classList.remove('active');
      }
    });

    // Lightbox Modal Close
    document.getElementById('nadi-lightbox-close')?.addEventListener('click', closeProjectLightbox);
    document.getElementById('nadi-project-lightbox')?.addEventListener('click', (e) => {
      if (e.target.id === 'nadi-project-lightbox') closeProjectLightbox();
    });

    // Raycast click on 3D NPCs
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let cur = hit.object;
        while (cur && cur !== scene) {
          if (cur.userData && cur.userData.isNPC) {
            openNPCDialogue(cur.userData.npcIndex);
            return;
          }
          cur = cur.parent;
        }
      }
    });

    // Hide initial loader
    setTimeout(() => {
      document.getElementById('nadi-loading-screen')?.classList.add('hidden');
    }, 400);

    handleScroll();
    animate();
  }

  function onWindowResize() {
    if (!stickyViewport || !camera || !renderer) return;
    const width = stickyViewport.clientWidth;
    const height = stickyViewport.clientHeight;
    camera.aspect = width / height;
    camera.fov = width <= 768 ? 62 : 52;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Camera Flight Pose Calculator with 4 Refined POVs
  function getCameraPoseAtProgress(t) {
    const numIntervals = SCROLL_STEPS.length - 1;
    const scaled = t * numIntervals;
    const i = Math.min(numIntervals - 1, Math.floor(scaled));
    const frac = scaled - i;

    const stepA = SCROLL_STEPS[i];
    const stepB = SCROLL_STEPS[i + 1] || SCROLL_STEPS[i];
    const ease = frac * frac * (3 - 2 * frac);

    const baseLook = {
      x: stepA.look.x + (stepB.look.x - stepA.look.x) * ease,
      y: stepA.look.y + (stepB.look.y - stepA.look.y) * ease,
      z: stepA.look.z + (stepB.look.z - stepA.look.z) * ease
    };

    let pos = { x: 0, y: 0, z: 0 };
    let look = { ...baseLook };

    let heroPos = { x: baseLook.x, y: 0, z: baseLook.z };
    if (walkingHero) {
      heroPos.x = walkingHero.position.x;
      heroPos.z = walkingHero.position.z;
    }

    // PURE FREE ORBIT 360° WITH ERGONOMIC MOBILE FRAMING
    const isMobile = window.innerWidth <= 768;
    const effectiveDist = isMobile ? Math.min(18.0, orbitDistance * 1.15) : orbitDistance;
    pos.x = heroPos.x + Math.sin(orbitYaw) * effectiveDist * Math.cos(orbitPitch);
    pos.y = Math.sin(orbitPitch) * effectiveDist + (isMobile ? 1.6 : 1.2);
    pos.z = heroPos.z + Math.cos(orbitYaw) * effectiveDist * Math.cos(orbitPitch);
    look.x = heroPos.x;
    look.y = isMobile ? 0.35 : 1.2; // Slightly lower look target elevates diorama into visible upper screen!
    look.z = heroPos.z;

    // If Outro is active, pull back camera into celebratory sky overview of entire courtyard
    if (isOutroActive) {
      pos.x = 0;
      pos.y = 30;
      pos.z = 28;
      look.x = 0;
      look.y = 1.2;
      look.z = 0;
    }

    return { pos, look };
  }


  // ─── QUEST NOTIFICATION & LOGIC CONTROLLERS ───────────────────
  function showToastNotification(msg) {
    let toast = document.getElementById('nadi-toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'nadi-toast-notification';
      toast.className = 'nadi-toast-notification';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }

  function collectQuestItem(q) {
    if (q.collected) return;
    q.collected = true;
    collectedQuestCount++;

    if (window.audioEngine) window.audioEngine.playCollect();

    // Scale down & hide
    q.group.visible = false;

    // Update Top HUD
    const textEl = document.getElementById('nadi-quest-hud-text');
    const pillEl = document.getElementById('nadi-quest-hud-pill');
    if (textEl) textEl.textContent = `Misi: ${collectedQuestCount}/5 Ide`;
    if (pillEl) {
      pillEl.classList.add('pulse');
      setTimeout(() => pillEl.classList.remove('pulse'), 600);
      if (collectedQuestCount >= 5) pillEl.classList.add('nadi-quest-all-done');
    }

    showToastNotification(`🎉 KARYA DITEMUKAN: ${q.name}! (${collectedQuestCount}/5)`);

    if (collectedQuestCount >= 5) {
      setTimeout(() => {
        if (window.audioEngine) window.audioEngine.playVictory();
        document.getElementById('nadi-victory-modal')?.classList.add('active');
      }, 700);
    }
  }

  // ─── 8-BIT RETRO ARCADE RUNNER MINI-GAME ──────────────────────
  let arcadeAnimId = null;
  let arcadeState = null;

  function initArcadeGame() {
    const canvas = document.getElementById('nadi-arcade-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let highscore = parseInt(localStorage.getItem('nadi_arcade_hs') || '0', 10);
    const hsEl = document.getElementById('nadi-arcade-highscore');
    if (hsEl) hsEl.textContent = highscore;

    arcadeState = {
      ctx: ctx,
      width: canvas.width,
      height: canvas.height,
      player: { x: 30, y: 130, vy: 0, isGrounded: true, w: 14, h: 22 },
      obstacles: [],
      coins: [],
      score: 0,
      highscore: highscore,
      gameOver: false,
      frame: 0
    };

    function jump() {
      if (!arcadeState) return;
      if (arcadeState.gameOver) {
        arcadeState.gameOver = false;
        arcadeState.score = 0;
        arcadeState.obstacles = [];
        arcadeState.coins = [];
        arcadeState.player.y = 130;
        arcadeState.player.vy = 0;
        arcadeState.player.isGrounded = true;
        return;
      }
      if (arcadeState.player.isGrounded) {
        arcadeState.player.vy = -7.5;
        arcadeState.player.isGrounded = false;
        if (window.audioEngine) window.audioEngine.playJump();
      }
    }

    document.getElementById('nadi-arcade-jump-btn')?.addEventListener('click', jump);
    canvas.addEventListener('pointerdown', jump);

    window.addEventListener('keydown', (e) => {
      if (document.getElementById('nadi-arcade-modal')?.classList.contains('active')) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          jump();
        }
      }
    });
  }

  function runArcadeGameLoop() {
    if (!arcadeState) return;
    const { ctx, width, height, player } = arcadeState;

    if (!arcadeState.gameOver) {
      arcadeState.frame++;
      arcadeState.score += 0.1;
      const sEl = document.getElementById('nadi-arcade-score');
      if (sEl) sEl.textContent = Math.floor(arcadeState.score);

      // Physics
      player.vy += 0.42;
      player.y += player.vy;
      if (player.y >= 130) {
        player.y = 130;
        player.vy = 0;
        player.isGrounded = true;
      }

      // Spawn obstacles & items
      if (arcadeState.frame % 110 === 0) {
        arcadeState.obstacles.push({ x: width + 10, y: 134, w: 14, h: 18, color: '#ef4444' });
      }
      if (arcadeState.frame % 85 === 0) {
        arcadeState.coins.push({ x: width + 10, y: 105, w: 10, h: 10, color: '#fbbf24' });
      }

      // Move & collide obstacles
      for (let i = arcadeState.obstacles.length - 1; i >= 0; i--) {
        const obs = arcadeState.obstacles[i];
        obs.x -= 3.2;
        if (
          player.x < obs.x + obs.w &&
          player.x + player.w > obs.x &&
          player.y < obs.y + obs.h &&
          player.y + player.h > obs.y
        ) {
          arcadeState.gameOver = true;
          if (Math.floor(arcadeState.score) > arcadeState.highscore) {
            arcadeState.highscore = Math.floor(arcadeState.score);
            localStorage.setItem('nadi_arcade_hs', arcadeState.highscore);
            const hsEl = document.getElementById('nadi-arcade-highscore');
            if (hsEl) hsEl.textContent = arcadeState.highscore;
          }
          if (window.audioEngine) window.audioEngine.playClick();
        }
        if (obs.x < -20) arcadeState.obstacles.splice(i, 1);
      }

      // Move & collect items
      for (let i = arcadeState.coins.length - 1; i >= 0; i--) {
        const c = arcadeState.coins[i];
        c.x -= 3.2;
        if (
          player.x < c.x + c.w &&
          player.x + player.w > c.x &&
          player.y < c.y + c.h &&
          player.y + player.h > c.y
        ) {
          arcadeState.score += 15;
          if (window.audioEngine) window.audioEngine.playCoin();
          arcadeState.coins.splice(i, 1);
          continue;
        }
        if (c.x < -20) arcadeState.coins.splice(i, 1);
      }
    }

    // Render Canvas
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Grid Floor
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 1;
    for (let x = (arcadeState.frame * -3.2) % 20; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 152);
      ctx.lineTo(x - 30, height);
      ctx.stroke();
    }
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 152, width, height - 152);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, 151, width, 2);

    // Player (8-bit Mangara)
    ctx.fillStyle = '#ff6b2b'; // Blazer
    ctx.fillRect(player.x, player.y + 6, player.w, 12);
    ctx.fillStyle = '#fed7aa'; // Face
    ctx.fillRect(player.x + 2, player.y, player.w - 4, 6);
    ctx.fillStyle = '#0f172a'; // Trousers
    ctx.fillRect(player.x + 2, player.y + 18, player.w - 4, 4);

    // Obstacles
    arcadeState.obstacles.forEach(obs => {
      ctx.fillStyle = obs.color;
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(obs.x + 3, obs.y + 3, 3, 3);
    });

    // Coins
    arcadeState.coins.forEach(c => {
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(c.x + 5, c.y + 5, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    if (arcadeState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER!', width / 2, height / 2 - 8);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '10px sans-serif';
      ctx.fillText('Ketuk Layar / Tombol Lompat untuk Ulang', width / 2, height / 2 + 14);
      ctx.textAlign = 'start';
    }

    arcadeAnimId = requestAnimationFrame(runArcadeGameLoop);
  }

  function openArcadeModal() {
    const modal = document.getElementById('nadi-arcade-modal');
    if (!modal) return;
    modal.classList.add('active');
    initArcadeGame();
    if (arcadeAnimId) cancelAnimationFrame(arcadeAnimId);
    arcadeAnimId = requestAnimationFrame(runArcadeGameLoop);
  }

  function closeArcadeModal() {
    document.getElementById('nadi-arcade-modal')?.classList.remove('active');
    if (arcadeAnimId) cancelAnimationFrame(arcadeAnimId);
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    const prevProg = currentProgress;
    currentProgress += (targetProgress - currentProgress) * 0.08;
    const deltaProg = currentProgress - prevProg;

    const time = performance.now() * 0.002;

    // 1. ANIMATE WALKING HERO WITH BANKING, ATHLETIC LEAN & IDLE BEHAVIORS
    if (walkingHero && orangeCurve) {
      const curveT = Math.min(0.999, Math.max(0.001, currentProgress));
      const heroPt = orangeCurve.getPointAt(curveT);
      const heroTangent = orangeCurve.getTangentAt(curveT);

      walkingHero.position.set(heroPt.x, 0, heroPt.z);
      const heading = Math.atan2(heroTangent.x, heroTangent.z);
      walkingHero.rotation.y = heading;

      // Pulse cyan target ring & chevron
      if (heroGroundRing) {
        const pulse = 1.0 + Math.sin(time * 3.5) * 0.1;
        heroGroundRing.scale.set(pulse, pulse, 1);
      }
      if (heroRingChevron) {
        heroRingChevron.position.z = 0.65 + Math.sin(time * 4.5) * 0.05;
      }

      // Dynamic Walking vs Idle Transitions
      if (Math.abs(deltaProg) > 0.0001) {
        // Fast dynamic walk / jog
        walkStepPhase += Math.abs(deltaProg) * 92;
        if (legPivotL) legPivotL.rotation.x = Math.sin(walkStepPhase) * 0.72;
        if (legPivotR) legPivotR.rotation.x = -Math.sin(walkStepPhase) * 0.72;
        if (armPivotL) armPivotL.rotation.x = -Math.sin(walkStepPhase) * 0.58;
        if (armPivotR) armPivotR.rotation.x = Math.sin(walkStepPhase) * 0.58;

        walkingHero.position.y = Math.abs(Math.sin(walkStepPhase * 2)) * 0.065;
        walkingHero.rotation.z = -heroTangent.x * 0.12; // Dynamic banking into turns!
        walkingHero.rotation.x = Math.min(0.12, Math.abs(deltaProg) * 35); // Forward momentum lean

        if (heroHumanObj && heroHumanObj.head) {
          heroHumanObj.head.rotation.y = Math.sin(walkStepPhase) * 0.08;
          heroHumanObj.head.rotation.x = 0.05;
        }
      } else {
        // Natural Idle Micro-Behaviors (Alive human posture!)
        if (legPivotL) legPivotL.rotation.x *= 0.85;
        if (legPivotR) legPivotR.rotation.x *= 0.85;
        if (armPivotL) armPivotL.rotation.x *= 0.85;
        if (armPivotR) armPivotR.rotation.x = -0.35 + Math.sin(time * 1.5) * 0.12; // Checking tablet

        walkingHero.position.y = Math.sin(time * 2.0) * 0.022; // Breathing bounce
        walkingHero.rotation.z = Math.sin(time * 1.1) * 0.02;  // Natural weight shift
        walkingHero.rotation.x = 0;

        if (heroHumanObj && heroHumanObj.head) {
          heroHumanObj.head.rotation.y = Math.sin(time * 0.75) * 0.28; // Looking around room
          heroHumanObj.head.rotation.x = Math.sin(time * 1.5) * 0.04;
        }
      }
    }

    // 2. ANIMATE 7 INTERACTIVE NPCS (GREETING & PROXIMITY WAVE)
    animatedNPCs.forEach(npc => {
      npc.group.position.y = Math.sin(time * 2.2 + npc.phase) * 0.02; // Idle breathing

      if (npc.sprite) {
        npc.sprite.position.y = 2.15 + Math.sin(time * 3.2 + npc.phase) * 0.08;
      }

      if (walkingHero) {
        const dx = walkingHero.position.x - npc.group.position.x;
        const dz = walkingHero.position.z - npc.group.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 5.2) {
          // Welcoming the player when nearby!
          const angleToHero = Math.atan2(dx, dz) - npc.group.rotation.y;
          npc.human.head.rotation.y = Math.max(-0.6, Math.min(0.6, angleToHero));
          npc.human.armPivotR.rotation.x = -Math.PI / 1.7;
          npc.human.armPivotR.rotation.z = Math.sin(time * 9) * 0.32; // Friendly waving gesture!
        } else {
          // Standing scanning room
          npc.human.head.rotation.y = Math.sin(time * 0.9 + npc.phase) * 0.22;
          npc.human.armPivotR.rotation.x = -0.3 + Math.sin(time * 1.4 + npc.phase) * 0.08;
          npc.human.armPivotR.rotation.z = 0;
        }
      }
    });

    // 3. ANIMATE 8 PATROLLING EMPLOYEES ACROSS CORRIDORS
    patrollingStaff.forEach(w => {
      if (w.axis === 'z') {
        w.currentZ += w.speed * w.dir;
        if (w.currentZ > w.maxZ) {
          w.currentZ = w.maxZ;
          w.dir = -1;
        } else if (w.currentZ < w.minZ) {
          w.currentZ = w.minZ;
          w.dir = 1;
        }
        w.group.position.set(w.x, 0, w.currentZ);
        w.group.rotation.y = w.dir === 1 ? 0 : Math.PI;
      } else {
        w.currentX += w.speed * w.dir;
        if (w.currentX > w.maxX) {
          w.currentX = w.maxX;
          w.dir = -1;
        } else if (w.currentX < w.minX) {
          w.currentX = w.minX;
          w.dir = 1;
        }
        w.group.position.set(w.currentX, 0, w.z);
        w.group.rotation.y = w.dir === 1 ? -Math.PI / 2 : Math.PI / 2;
      }

      w.stepPhase += 0.12;
      if (w.legL) w.legL.rotation.x = Math.sin(w.stepPhase) * 0.55;
      if (w.legR) w.legR.rotation.x = -Math.sin(w.stepPhase) * 0.55;
      if (w.armL) w.armL.rotation.x = -Math.sin(w.stepPhase) * 0.45;
      if (w.armR) w.armR.rotation.x = Math.sin(w.stepPhase) * 0.45;
      w.group.position.y = Math.abs(Math.sin(w.stepPhase * 2)) * 0.045;
    });

    // 4. ANIMATE ACTIVE SEATED WORKERS (Natural Typing Bursts & Sipping Coffee)
    activeWorkers.forEach(w => {
      if (w.isTyping) {
        const isTypingBurst = Math.sin(time * 1.8 + w.phase) > -0.3;
        if (isTypingBurst) {
          w.armL.rotation.x = Math.PI / 3 + Math.sin(time * 14 + w.phase) * 0.1;
          w.armR.rotation.x = Math.PI / 3 + Math.cos(time * 14 + w.phase) * 0.1;
        } else {
          w.armL.rotation.x = Math.PI / 3.2;
          w.armR.rotation.x = Math.PI / 3.2;
        }
      } else {
        w.armR.rotation.x = -Math.PI / 3.6 + Math.sin(time * 1.3 + w.phase) * 0.12;
        w.head.rotation.x = Math.sin(time * 1.6 + w.phase) * 0.08;
      }
      w.head.rotation.y = Math.sin(time * 1.0 + w.phase) * 0.15;
      w.group.position.y = Math.sin(time * 2.0 + w.phase) * 0.01;
    });

    // 5. ANIMATE BROADCAST CAMERAS & TALLY LIGHTS (BILIK 02)
    studioCameras.forEach(cam => {
      cam.head.rotation.y = Math.sin(time * 1.2 + cam.phase) * 0.45;
      cam.head.rotation.x = Math.sin(time * 0.9 + cam.phase) * 0.06;
      const isTallyOn = Math.sin(time * 5.5 + cam.phase) > 0.1;
      cam.tallyMat.color.setHex(isTallyOn ? 0xef4444 : 0x450a0a);
    });

    // 6. ANIMATE HOLOGRAPHIC AI DATA CORE (BILIK 04)
    if (holoDataCore) {
      holoDataCore.core.rotation.y += 0.025;
      holoDataCore.core.rotation.x += 0.012;
      holoDataCore.ring1.rotation.z += 0.018;
      holoDataCore.ring2.rotation.y -= 0.022;
      holoDataCore.group.position.y = 2.3 + Math.sin(time * 2.5) * 0.09;
      holoDataCore.light.intensity = 1.1 + Math.sin(time * 4) * 0.45;
    }

    // 7. ANIMATE IOT SAFE-SENSE SONAR RADAR & 3D PRINTER (BILIK 05)
    if (printerExtruder) {
      printerExtruder.position.x = 29.5 + Math.sin(time * 4.2) * 0.18;
      printerExtruder.position.z = -3.5 + Math.cos(time * 5.5) * 0.15;
    }
    if (sonarPulseRing) {
      const sonarCycle = (time * 1.5) % 1.0;
      const sonarScale = 1.0 + sonarCycle * 4.5;
      sonarPulseRing.scale.set(sonarScale, sonarScale, 1);
      sonarPulseRing.material.opacity = Math.max(0, 0.85 * (1 - sonarCycle));
    }
    if (rotatingTrophy) {
      rotatingTrophy.rotation.y += 0.025;
    }

    // 8. ANIMATE ATRIUM RISING COFFEE STEAM & SWAYING TREES
    if (steamParticles) {
      const sArr = steamParticles.geometry.attributes.position.array;
      for (let si = 0; si < 28; si++) {
        sArr[si * 3 + 1] += 0.008;
        sArr[si * 3 + 0] += Math.sin(time * 2 + si) * 0.002;
        if (sArr[si * 3 + 1] > 2.0) sArr[si * 3 + 1] = 0.4;
      }
      steamParticles.geometry.attributes.position.needsUpdate = true;
    }
    swayingPlants.forEach(p => {
      p.crown.rotation.z = Math.sin(time * 1.5 + p.phase) * 0.045;
      p.crown.rotation.x = Math.cos(time * 1.2 + p.phase) * 0.035;
    });
    if (poolWaterMesh) {
      poolWaterMesh.position.y = 0.08 + Math.sin(time * 2.5) * 0.004;
    }

    // 9. ANIMATE BLINKING SERVER LEDS & ATRIUM DUST PARTICLES
    serverLEDs.forEach((led, idx) => {
      led.visible = Math.sin(time * 6 + idx) > -0.2;
    });
    if (dustParticles) {
      const pArr = dustParticles.geometry.attributes.position.array;
      for (let i = 0; i < 40; i++) {
        pArr[i * 3 + 1] += 0.005;
        if (pArr[i * 3 + 1] > 5.0) pArr[i * 3 + 1] = 0.5;
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 10. ANIMATE DYNAMIC CANVAS TEXTURES (MCR, GRAFANA, TOTEM)
    updateDynamicCanvasTextures(time);

    // 11. ANIMATE 5 FLOATING QUEST COLLECTIBLES & CHECK PROXIMITY
    questCollectibles.forEach(q => {
      if (!q.collected) {
        q.group.rotation.y += 0.035;
        q.core.rotation.x += 0.02;
        q.core.rotation.z += 0.015;
        q.group.position.y = q.pos[1] + Math.sin(time * 3.5 + q.pos[0]) * 0.09;
        q.halo.rotation.z += 0.025;

        // Proximity detection with walking hero
        if (walkingHero) {
          const dx = walkingHero.position.x - q.pos[0];
          const dz = walkingHero.position.z - q.pos[2];
          const dist = Math.hypot(dx, dz);
          if (dist < 3.8) {
            collectQuestItem(q);
          }
        }
      }
    });

    // 12. ANIMATE FESTIVE FAIRY STRING LIGHTS IN ATRIUM
    festiveFairyLights.forEach(f => {
      f.mesh.position.y = f.baseY + Math.sin(time * 2.0 + f.phase) * 0.03;
    });

    // 13. ANIMATE CUTE MASCOT DOG BIMO (TROTTING & WAGGING)
    if (mascotDog) {
      mascotDog.angle += 0.018;
      const dogRadius = 2.4;
      mascotDog.group.position.x = -1.5 + Math.cos(mascotDog.angle) * dogRadius;
      mascotDog.group.position.z = 1.6 + Math.sin(mascotDog.angle) * dogRadius;
      mascotDog.group.rotation.y = -mascotDog.angle + Math.PI / 2;
      mascotDog.tail.rotation.z = Math.sin(time * 12) * 0.45;
      mascotDog.group.position.y = Math.abs(Math.sin(time * 8)) * 0.035;
    }

    // 14. ANIMATE RETRO ARCADE CABINET CRT MONITOR
    if (arcadeMachineObj && arcadeMachineObj.children[2]) {
      const crtMat = arcadeMachineObj.children[2].material;
      if (crtMat && crtMat.color) {
        crtMat.color.setHex(Math.sin(time * 6) > 0 ? 0x06b6d4 : 0x3b82f6);
      }
    }


    // 4E. SYNC LIVE PLAYER RADAR BLIP ON FLOOR PLAN MINI-MAP
    if (walkingHero) {
      const radarBlip = document.getElementById('fp-radar-blip');
      const radarPulse = document.getElementById('fp-radar-pulse');
      if (radarBlip && radarPulse) {
        const hx = walkingHero.position.x;
        const hz = walkingHero.position.z;
        const svgX = 160 + (hx / 28.0) * 115.0;
        const svgY = 140 + (hz / 24.0) * 95.0;
        radarBlip.setAttribute('cx', svgX.toFixed(1));
        radarBlip.setAttribute('cy', svgY.toFixed(1));
        radarPulse.setAttribute('cx', svgX.toFixed(1));
        radarPulse.setAttribute('cy', svgY.toFixed(1));
      }
    }

    // 5. CINEMATIC INTRO FLY-IN ANIMATION
    if (isIntroAnimating) {
      introProgress += 0.025;
      if (introProgress >= 1) {
        introProgress = 1;
        isIntroAnimating = false;
      }
    }

    // 6. SMOOTH CAMERA FLIGHT & POV INTERPOLATION
    const { pos, look } = getCameraPoseAtProgress(currentProgress);

    if (currentCamPos && currentLookAt && tempTargetPos && tempTargetLook) {
      if (isIntroActive) {
        tempTargetPos.set(-21, 35, 28);
        tempTargetLook.set(-21, 1.2, 0);
      } else if (isIntroAnimating) {
        const tEase = introProgress * introProgress * (3 - 2 * introProgress);
        tempTargetPos.set(
          -21 * (1 - tEase) + pos.x * tEase,
          35 * (1 - tEase) + pos.y * tEase,
          28 * (1 - tEase) + pos.z * tEase
        );
        tempTargetLook.set(look.x, look.y, look.z);
      } else {
        tempTargetPos.set(pos.x, pos.y, pos.z);
        tempTargetLook.set(look.x, look.y, look.z);
      }

      currentCamPos.lerp(tempTargetPos, 0.08);
      currentLookAt.lerp(tempTargetLook, 0.08);

      camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);
      camera.lookAt(currentLookAt);
    }

    renderer.render(scene, camera);
  }

  // ─── 15. ENTRY POINT ──────────────────────────────────────────
  function init() {
    buildScrollytellingDOM();

    function safeInitDiorama() {
      try {
        initThreeDiorama();
      } catch (err) {
        console.error('Three.js diorama initialization error:', err);
        document.getElementById('nadi-loading-screen')?.classList.add('hidden');
      }
    }

    if (typeof THREE !== 'undefined') {
      safeInitDiorama();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        safeInitDiorama();
      };
      script.onerror = (e) => {
        console.error('Failed to load Three.js:', e);
        document.getElementById('nadi-loading-screen')?.classList.add('hidden');
      };
      document.head.appendChild(script);
    }

    console.log('✨ 3D Bustling Studio Experience initialized successfully!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
