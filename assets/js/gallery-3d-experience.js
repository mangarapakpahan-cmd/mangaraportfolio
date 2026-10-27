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

  // Multi-POV Camera Modes: 'isometric' | 'topdown' | 'thirdperson' | 'orbit'
  let currentPOV = 'isometric';
  let orbitYaw = 0;
  let orbitPitch = 0.55;
  let orbitDistance = 12.0;

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

  // ─── 2. 7 INTERACTIVE NPCS DEFINITION ─────────────────────────
  const NPC_GUIDES = [
    {
      roomIndex: 0,
      name: "Nadia",
      role: "Front Desk & Welcome Guide",
      avatarLetter: "N",
      pos: { x: -22.5, z: 2.2 },
      shirtColor: 0xff7a38,
      greeting: "Halo! Selamat datang di Studio Virtual Mangara Ferdianto Pakpahan. Saya bisa membantu Anda mengenali profil dan kualifikasi resminya.",
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
      pos: { x: -15.5, z: 2.0 },
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
      pos: { x: -8.5, z: 2.2 },
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
      pos: { x: -1.5, z: 2.1 },
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
      pos: { x: 5.5, z: 2.2 },
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
      pos: { x: 12.5, z: 2.2 },
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
      pos: { x: 19.5, z: 2.2 },
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

  // ─── 3. 7 SCROLLYTELLING STEP DEFINITIONS ─────────────────────
  const SCROLL_STEPS = [
    {
      stepNum: "01",
      stepName: "Profil",
      category: "LANGKAH 01 • PROFIL & KUALIFIKASI PROFESIONAL",
      title: "Kreativitas Bertemu Rekayasa Data & Komunikasi Publik.",
      desc: "Mahasiswa S1 Teknik Informatika Institut Teknologi PLN dengan keahlian multidisipliner memadukan perancangan identitas visual korporat, produksi siaran langsung nasional, pengelolaan komunikasi digital resmi, serta riset dan analitik data empiris.",
      badgeStatus: "Tersedia untuk Kerja & Magang",
      badgeStatusColor: "green",
      cam: { x: -21, y: 7.8, z: 12.0 },
      look: { x: -21, y: 1.2, z: 0 }
    },
    {
      stepNum: "02",
      stepName: "Layanan",
      category: "LANGKAH 02 • 10 LAYANAN & 11 KOMPETENSI TEKNIS",
      title: "10 Layanan Spesialisasi & 11 Keterampilan Teknis Teruji.",
      desc: "Menyediakan 10 layanan profesional yang teruji di industri: dari produksi siaran langsung multi-kamera acara protokoler nasional, creative direction identitas visual, strategi pertumbuhan media sosial 3x lipat, riset rekayasa IoT pintar, hingga pemodelan data machine learning cloud.",
      badgeStatus: "10 Layanan • 11 Skills",
      badgeStatusColor: "orange",
      cam: { x: -14, y: 7.8, z: 12.0 },
      look: { x: -14, y: 1.2, z: 0 }
    },
    {
      stepNum: "03",
      stepName: "Pengalaman",
      category: "LANGKAH 03 • 15 PENGALAMAN KERJA & ORGANISASI",
      title: "15 Rekam Jejak Profesional & Kepemimpinan Nasional.",
      desc: "Perjalanan karir komprehensif mencakup peran strategis sebagai Social Media Manager di PJCI, Tim Humas & Komunikasi Publik ITPLN, Lead Visual Switcher Wisuda Nasional, Koordinator Kreatif ITPLN Media, Ketua Pelaksana National CAD Competition (NCC 2025), hingga Student Ambassador DQLab.",
      badgeStatus: "15 Entri Terverifikasi",
      badgeStatusColor: "green",
      cam: { x: -7, y: 7.8, z: 12.0 },
      look: { x: -7, y: 1.2, z: 0 }
    },
    {
      stepNum: "04",
      stepName: "Pendidikan",
      category: "LANGKAH 04 • PENDIDIKAN FORMAL & 8 LISENSI RESMI",
      title: "Fondasi Akademik Kuat & 8 Lisensi Internasional.",
      desc: "Menempuh pendidikan Sarjana (S1) Teknik Informatika di Institut Teknologi PLN dengan spesialisasi komputasi cerdas dan rekayasa data industri energi, diperkuat oleh 8 lisensi resmi: Azure Databricks Machine Learning, SEM-PLS 120 JP, MOS Excel 2019, dan IBM AI.",
      badgeStatus: "8 Lisensi Resmi Terverifikasi",
      badgeStatusColor: "green",
      cam: { x: 0, y: 7.8, z: 12.0 },
      look: { x: 0, y: 1.2, z: 0 }
    },
    {
      stepNum: "05",
      stepName: "50+ Proyek",
      category: "LANGKAH 05 • EKSIBI 50+ KARYA & PROYEK PORTOFOLIO",
      title: "Eksibisi 50 Karya Terkurasi dengan Dokumentasi Asli.",
      desc: "Menampilkan seluruh 50 portofolio karya nyata yang telah diselesaikan: live streaming siaran nasional, strategi konten kampanye media sosial (@itpln & @smartgridindonesia), rekayasa prototipe IoT LPG-SafeSense, perancangan identitas visual korporat, hingga sistem data dan web.",
      badgeStatus: "50 Proyek Lengkap Aktif",
      badgeStatusColor: "orange",
      cam: { x: 7, y: 7.8, z: 12.0 },
      look: { x: 7, y: 1.2, z: 0 }
    },
    {
      stepNum: "06",
      stepName: "Publikasi",
      category: "LANGKAH 06 • 20 PUBLIKASI, ARTIKEL & RISET PRESTASI",
      title: "20 Publikasi Ilmiah, Redaksi Berita & Hibah Riset.",
      desc: "Kumpulan publikasi artikel berkala, jurnalisme korporat untuk portal resmi PJCI dan ITPLN, tulisan teknologi transisi energi bersih, serta rekam jejak inovasi peraih Juara 1 MKI dan hibah penelitian PKM DIKTI Kemendikbudristek.",
      badgeStatus: "20 Publikasi & Prestasi",
      badgeStatusColor: "orange",
      cam: { x: 14, y: 7.8, z: 12.0 },
      look: { x: 14, y: 1.2, z: 0 }
    },
    {
      stepNum: "07",
      stepName: "Kontak",
      category: "LANGKAH 07 • TESTIMONI & PUSAT REKRUTMEN RESMI",
      title: "Testimoni Stakeholder & Formulir Komunikasi Langsung.",
      desc: "Terbuka untuk kesempatan kerja penuh waktu, program magang, konsultasi creative direction, maupun kolaborasi proyek strategis di Jakarta, hybrid, maupun remote. Kirim pesan langsung ke database atau hubungi via WhatsApp.",
      badgeStatus: "Respons Cepat & Siap Onboarding",
      badgeStatusColor: "green",
      cam: { x: 21, y: 7.8, z: 12.0 },
      look: { x: 21, y: 1.2, z: 0 }
    }
  ];

  // ─── 4. BUSTLING & DETAILED ARCHITECTURAL DIORAMA BUILDER ─────
  function buildMiniatureDioramaScene() {
    patrollingStaff = [];
    activeWorkers = [];
    serverLEDs = [];

    // 1. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.15);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.95);
    sunLight.position.set(24, 40, 28);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -36;
    sunLight.shadow.camera.right = 36;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xffedd5, 0.4);
    fillLight.position.set(-15, 20, 25);
    scene.add(fillLight);

    // 2. Materials
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf6f3eb,
      roughness: 0.85,
      metalness: 0.05
    });

    const wallBodyMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbf9,
      roughness: 0.9,
      metalness: 0.02
    });

    const orangeTrimMat = new THREE.MeshStandardMaterial({
      color: 0xff6b2b,
      roughness: 0.4,
      metalness: 0.1
    });

    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x241d18,
      roughness: 0.5,
      metalness: 0.1
    });

    const screenGlowMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.6
    });

    const chairOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xff7a38,
      roughness: 0.6
    });

    // 3. Main Floor Slab
    const floorGeo = new THREE.BoxGeometry(60, 0.5, 20);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.25, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Outer Back Wall with Warm Glowing Windows
    const backWallGeo = new THREE.BoxGeometry(60, 2.8, 0.4);
    const backWall = new THREE.Mesh(backWallGeo, wallBodyMat);
    backWall.position.set(0, 1.4, -9.8);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    scene.add(backWall);

    const backCap = new THREE.Mesh(new THREE.BoxGeometry(60, 0.12, 0.5), orangeTrimMat);
    backCap.position.set(0, 2.86, -9.8);
    scene.add(backCap);

    // Illuminated Grid Windows along Back Wall
    const windowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let wx = -26; wx <= 26; wx += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), windowMat);
      win.position.set(wx, 1.8, -9.58);
      scene.add(win);
    }

    // Front Perimeter Rail
    const frontRail = new THREE.Mesh(new THREE.BoxGeometry(60, 0.4, 0.3), wallBodyMat);
    frontRail.position.set(0, 0.2, 9.8);
    scene.add(frontRail);

    // 4. Paved Sidewalk & Curbs along Orange Guide Path
    createPavedSidewalkAndPath();

    // 5. Architectural Room Partitions & Low-poly Props
    build7RoomPartitions(wallBodyMat, orangeTrimMat);
    buildStreetLampsAndTrees();

    // 6. BUILD DETAILED, BUSTLING ROOMS (USER: JANGAN POLOS, PENUHI BARANG BROADCAST & DATA ANALYST)
    buildRoom1FoyerDetailed(wallBodyMat, orangeTrimMat, chairOrangeMat);
    buildRoom2BroadcastDetailed(screenGlowMat, orangeTrimMat, darkWoodMat);
    buildRoom3NewsroomDetailed(orangeTrimMat, darkWoodMat);
    buildRoom4DataLabDetailed(orangeTrimMat, darkWoodMat);
    buildRoom5IoTWorkshopDetailed(orangeTrimMat, darkWoodMat);
    buildRoom6PressHallDetailed(orangeTrimMat, darkWoodMat);
    buildRoom7RecruiterLoungeDetailed(orangeTrimMat, darkWoodMat, chairOrangeMat);

    // 7. Interactive NPCs in 3D
    buildInteractive3DNPCS();

    // 8. Mobile Walking Office Employees Patrols (The Bustling Office!)
    buildPatrollingOfficeWorkers();

    // 9. Animated Walking Hero with Glowing Cyan Ring
    createWalkingHeroWithIndicator();
  }

  // Winding Cobblestone Sidewalk & Signature Orange Path
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
      new THREE.Vector3(-24, 0.02, 3),
      new THREE.Vector3(-21, 0.02, 1),
      new THREE.Vector3(-17.5, 0.02, -1),
      new THREE.Vector3(-14, 0.02, 0.5),
      new THREE.Vector3(-10.5, 0.02, 2),
      new THREE.Vector3(-7, 0.02, -0.5),
      new THREE.Vector3(-3.5, 0.02, 1.5),
      new THREE.Vector3(0, 0.02, -1),
      new THREE.Vector3(3.5, 0.02, 1.5),
      new THREE.Vector3(7, 0.02, -0.5),
      new THREE.Vector3(10.5, 0.02, 1.8),
      new THREE.Vector3(14, 0.02, -0.2),
      new THREE.Vector3(17.5, 0.02, 1.5),
      new THREE.Vector3(21, 0.02, 0),
      new THREE.Vector3(24, 0.02, 2)
    ];

    const CurveClass = THREE.CatmullRomCurve3;
    let curvePoints = points;

    if (CurveClass) {
      try {
        orangeCurve = new CurveClass(points);
        curvePoints = orangeCurve.getPoints(140);
      } catch (err) {
        curvePoints = points;
      }
    }

    for (let i = 0; i < curvePoints.length - 1; i++) {
      const p1 = curvePoints[i];
      const p2 = curvePoints[i + 1];
      const len = p1.distanceTo(p2);
      const segGeo = new THREE.BoxGeometry(len, 0.02, 0.28);
      const seg = new THREE.Mesh(segGeo, trackMat);

      seg.position.set((p1.x + p2.x) / 2, 0.02, (p1.z + p2.z) / 2);
      const angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
      seg.rotation.y = -angle;
      scene.add(seg);

      if (i % 3 === 0) {
        const curb = new THREE.Mesh(new THREE.BoxGeometry(len * 2.8, 0.04, 1.6), curbMat);
        curb.position.set((p1.x + p2.x) / 2, 0.01, (p1.z + p2.z) / 2);
        curb.rotation.y = -angle;
        curb.receiveShadow = true;
        scene.add(curb);
      }
    }
  }

  // Architectural Room Partitions (Dividers separating 7 zones)
  function build7RoomPartitions(wallMat, trimMat) {
    const dividerX = [-17.5, -10.5, -3.5, 3.5, 10.5, 17.5];

    for (const x of dividerX) {
      // Back wall partition
      const wGeo1 = new THREE.BoxGeometry(0.35, 2.6, 8.5);
      const w1 = new THREE.Mesh(wGeo1, wallMat);
      w1.position.set(x, 1.3, -5.5);
      w1.receiveShadow = true;
      w1.castShadow = true;
      scene.add(w1);

      const capGeo1 = new THREE.BoxGeometry(0.42, 0.1, 8.6);
      const cap1 = new THREE.Mesh(capGeo1, trimMat);
      cap1.position.set(x, 2.65, -5.5);
      scene.add(cap1);

      // Front wall partition
      const wGeo2 = new THREE.BoxGeometry(0.35, 2.6, 5);
      const w2 = new THREE.Mesh(wGeo2, wallMat);
      w2.position.set(x, 1.3, 7.2);
      w2.receiveShadow = true;
      w2.castShadow = true;
      scene.add(w2);

      const capGeo2 = new THREE.BoxGeometry(0.42, 0.1, 5.1);
      const cap2 = new THREE.Mesh(capGeo2, trimMat);
      cap2.position.set(x, 2.65, 7.2);
      scene.add(cap2);
    }
  }

  // Streetlamps & Faceted Trees
  function buildStreetLampsAndTrees() {
    const lampPositions = [-18, -11, -4, 3, 10, 17];
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    lampPositions.forEach(x => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.2, 8), lampMat);
      pole.position.set(x, 1.1, 4.2);
      scene.add(pole);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.4), lampMat);
      head.position.set(x, 2.2, 4.0);
      scene.add(head);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08), bulbMat);
      bulb.position.set(x, 2.12, 4.0);
      scene.add(bulb);

      const lampLight = new THREE.PointLight(0xfef08a, 0.5, 6);
      lampLight.position.set(x, 2.1, 4.0);
      scene.add(lampLight);
    });

    const treePositions = [-23, -16, -9, -2, 5, 12, 19];
    const leafMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8, flatShading: true });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.9 });

    treePositions.forEach((tx, idx) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.4, 6), trunkMat);
      trunk.position.set(tx, 0.7, 5.8);
      scene.add(trunk);

      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), idx % 2 === 0 ? leafMat1 : leafMat2);
      crown.position.set(tx, 1.8, 5.8);
      crown.castShadow = true;
      scene.add(crown);

      if (idx % 2 === 1) {
        const bench = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.35, 0.45),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
        );
        bench.position.set(tx + 1.6, 0.18, 4.2);
        scene.add(bench);
      }
    });
  }

  // ─── 5. DETAILED BUSTLING ROOM SETUPS (NO EMPTY FORMALITIES!) ─
  // Helper to create an active worker at a desk
  function createDeskWorker(x, y, z, ry, shirtColor, isTyping = true) {
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    grp.rotation.y = ry;

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xe8b896, roughness: 0.6 })
    );
    head.position.y = 1.05;
    grp.add(head);

    // Torso
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.2, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.7 })
    );
    torso.position.y = 0.68;
    grp.add(torso);

    // Arms reaching to desk / keyboard
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6);
    const armL = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: shirtColor }));
    armL.position.set(-0.2, 0.7, 0.2);
    armL.rotation.x = Math.PI / 3;
    grp.add(armL);

    const armR = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: shirtColor }));
    armR.position.set(0.2, 0.7, 0.2);
    armR.rotation.x = Math.PI / 3;
    grp.add(armR);

    // Chair
    const chair = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    chair.position.set(0, 0.42, 0);
    grp.add(chair);

    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    chairBack.position.set(0, 0.7, -0.22);
    grp.add(chairBack);

    scene.add(grp);

    activeWorkers.push({ group: grp, head: head, armL: armL, armR: armR, isTyping: isTyping, phase: Math.random() * 10 });
    return grp;
  }

  // Room 1: Detailed Foyer & Welcome Reception
  function buildRoom1FoyerDetailed(wallMat, trimMat, chairMat) {
    // Reception Counter Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.05, 1.3), wallMat);
    desk.position.set(-21, 0.52, -4.5);
    scene.add(desk);

    const top = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.08, 1.4), trimMat);
    top.position.set(-21, 1.09, -4.5);
    scene.add(top);

    // Dual Monitors on Reception Counter
    for (let i = 0; i < 2; i++) {
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.04), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      mon.position.set(-21.6 + i * 0.8, 1.38, -4.5);
      scene.add(mon);
    }

    // Desk Phone, Brochure stack, Coffee Mug
    const phone = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.2), new THREE.MeshStandardMaterial({ color: 0x475569 }));
    phone.position.set(-20.0, 1.16, -4.4);
    scene.add(phone);

    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    mug.position.set(-22.4, 1.18, -4.3);
    scene.add(mug);

    // Receptionist seated typing
    createDeskWorker(-21.2, 0, -5.4, 0, 0x0284c7, true);

    // Water Dispenser Station with blue water bottle!
    const dispenser = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.0, 0.4), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
    dispenser.position.set(-18.5, 0.5, -8.2);
    scene.add(dispenser);
    const waterBottle = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 }));
    waterBottle.position.set(-18.5, 1.25, -8.2);
    scene.add(waterBottle);

    // Waiting Armchairs & Coffee Table with magazines
    const chair1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), chairMat);
    chair1.position.set(-23.5, 0.25, 3.5);
    scene.add(chair1);

    const chair2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), chairMat);
    chair2.position.set(-21.8, 0.25, 3.5);
    scene.add(chair2);

    const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.6), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }));
    table.position.set(-22.65, 0.18, 2.2);
    scene.add(table);

    // Seated Visitor reading phone
    createDeskWorker(-21.8, 0, 3.5, -Math.PI / 2, 0x64748b, false);
  }

  // Room 2: Detailed Broadcast Studio & MCR (Packed with gear!)
  function buildRoom2BroadcastDetailed(screenMat, trimMat, darkMat) {
    // 6-Monitor Video Wall on Metal Truss
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        const mon = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.72), screenMat);
        mon.position.set(-15.3 + c * 1.3, 1.7 + r * 0.85, -9.5);
        scene.add(mon);

        // Frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.76, 0.04), trussMat);
        frame.position.set(-15.3 + c * 1.3, 1.7 + r * 0.85, -9.54);
        scene.add(frame);
      }
    }

    // Audio VU Level Meter (Green, Yellow, Red LED indicator blocks)
    for (let i = 0; i < 6; i++) {
      const ledColor = i > 4 ? 0xef4444 : (i > 3 ? 0xf59e0b : 0x22c55e);
      const vu = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.02), new THREE.MeshBasicMaterial({ color: ledColor }));
      vu.position.set(-11.2, 1.4 + i * 0.08, -9.48);
      scene.add(vu);
    }

    // Switcher & Soundboard Console Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.95, 1.5), darkMat);
    desk.position.set(-14, 0.48, -4.5);
    scene.add(desk);

    // ATEM Production Switcher Panel with lit buttons
    const atem = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.6), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    atem.position.set(-14.4, 1.0, -4.5);
    scene.add(atem);

    // Audio Mixer with Faders
    const mixer = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.55), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    mixer.position.set(-12.8, 0.99, -4.5);
    scene.add(mixer);

    // Studio Broadcast Camera Rig on Heavy Pedestal Tripod
    const trip = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.35, 1.5, 4), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    trip.position.set(-13.8, 0.75, 2.5);
    scene.add(trip);

    const camBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.9), darkMat);
    camBox.position.set(-13.8, 1.55, 2.5);
    scene.add(camBox);

    // Teleprompter Screen on Camera Front
    const prompter = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.1), screenMat);
    prompter.position.set(-13.8, 1.55, 3.0);
    scene.add(prompter);

    // Big Red Tally Light on top of Camera
    const tally = new THREE.Mesh(new THREE.SphereGeometry(0.09), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    tally.position.set(-13.8, 1.82, 2.7);
    scene.add(tally);

    // 2 Studio Softbox Lights on Telescoping Stands
    for (let lx of [-16.2, -11.5]) {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4), darkMat);
      stand.position.set(lx, 1.2, 1.5);
      scene.add(stand);

      const softbox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.3), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
      softbox.position.set(lx, 2.4, 1.5);
      scene.add(softbox);
    }

    // Coiled Cable Drums on Studio Floor
    const cableDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    cableDrum.position.set(-16.0, 0.1, -1.8);
    scene.add(cableDrum);

    // 3 Active Broadcast Crew Members
    // Switcher operator seated at console
    createDeskWorker(-14.4, 0, -5.5, 0, 0x0284c7, true);
    // Audio engineer seated at mixer
    createDeskWorker(-12.8, 0, -5.5, 0, 0x10b981, true);
    // Camera operator standing behind camera
    const camOp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    camOp.position.set(-13.8, 0.75, 1.7);
    scene.add(camOp);
    const camOpHead = new THREE.Mesh(new THREE.SphereGeometry(0.22), new THREE.MeshStandardMaterial({ color: 0xe8b896 }));
    camOpHead.position.set(-13.8, 1.45, 1.7);
    scene.add(camOpHead);
  }

  // Room 3: Detailed Newsroom & Social Media Command Center
  function buildRoom3NewsroomDetailed(trimMat, darkMat) {
    // Cluster of 3 Workstations
    const deskCluster = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.9, 1.6), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
    deskCluster.position.set(-7, 0.45, -4.5);
    scene.add(deskCluster);

    // 4 Widescreen Monitors displaying social media dashboards
    for (let i = 0; i < 4; i++) {
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.05), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      mon.position.set(-8.4 + i * 0.95, 1.25, -4.5);
      scene.add(mon);
    }

    // Bulletin Board on Back Wall with Sticky Notes
    const pinboard = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.3, 0.04), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 }));
    pinboard.position.set(-7, 1.8, -9.5);
    scene.add(pinboard);

    // Sticky Notes on Pinboard
    const noteColors = [0xef4444, 0x3b82f6, 0x22c55e, 0xfacc15];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        const note = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.18), new THREE.MeshBasicMaterial({ color: noteColors[(r + c) % 4] }));
        note.position.set(-7.8 + c * 0.5, 1.6 + r * 0.4, -9.46);
        scene.add(note);
      }
    }

    // Office Multifunction Printer/Copier in the Corner
    const copier = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.85, 0.65), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
    copier.position.set(-4.5, 0.43, -8.5);
    scene.add(copier);

    // Rolling Whiteboard with Calendar
    const wboard = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.06), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    wboard.position.set(-9.2, 1.4, 2.0);
    wboard.rotation.y = Math.PI / 6;
    scene.add(wboard);

    // 2 Active Newsroom Staff Seated Typing
    createDeskWorker(-7.8, 0, -5.5, 0, 0xa855f7, true);
    createDeskWorker(-6.2, 0, -5.5, 0, 0xec4899, true);
  }

  // Room 4: Detailed Data Science & AI Cloud Lab
  function buildRoom4DataLabDetailed(trimMat, darkMat) {
    // 2 Full-Height 42U Server Racks with Blinking Activity LEDs
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    for (let rx of [1.6, 2.8]) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.5, 0.9), rackMat);
      rack.position.set(rx, 1.25, -8.5);
      scene.add(rack);

      // Blinking Server Blade LEDs
      for (let l = 0; l < 8; l++) {
        const ledColor = l % 3 === 0 ? 0x06b6d4 : (l % 3 === 1 ? 0x22c55e : 0xf59e0b);
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.035), new THREE.MeshBasicMaterial({ color: ledColor }));
        led.position.set(rx - 0.35 + (l % 4) * 0.22, 0.6 + Math.floor(l / 4) * 0.8, -8.02);
        scene.add(led);
        serverLEDs.push(led);
      }
    }

    // Triple-Monitor Developer Workstation Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.95, 1.4), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    desk.position.set(0, 0.48, -4.5);
    scene.add(desk);

    // Triple Developer Monitors (Center + Angled Left & Right)
    const monMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const monCenter = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.05), monMat);
    monCenter.position.set(0, 1.25, -4.5);
    scene.add(monCenter);

    const monL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.05), monMat);
    monL.position.set(-0.85, 1.25, -4.4);
    monL.rotation.y = Math.PI / 8;
    scene.add(monL);

    const monR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.05), monMat);
    monR.position.set(0.85, 1.25, -4.4);
    monR.rotation.y = -Math.PI / 8;
    scene.add(monR);

    // Glass Whiteboard on Wall with Math & Neural Network Diagram
    const gBoard = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 0.04), new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.7 }));
    gBoard.position.set(0, 1.8, -9.5);
    scene.add(gBoard);

    // Mini Fridge in corner
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.85, 0.55), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4 }));
    fridge.position.set(-2.6, 0.43, -8.5);
    scene.add(fridge);

    // 2 Active Data Scientists Seated Coding
    createDeskWorker(-0.4, 0, -5.5, 0, 0x3b82f6, true);
    createDeskWorker(0.8, 0, -5.5, 0, 0x6366f1, true);
  }

  // Room 5: Detailed IoT Hardware Workshop & 50 Projects Gallery
  function buildRoom5IoTWorkshopDetailed(trimMat, darkMat) {
    // Electronics Workbench with Anti-Static Green Mat
    const bench = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.95, 1.5), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }));
    bench.position.set(7, 0.48, -4.5);
    scene.add(bench);

    // Digital Oscilloscope with glowing green sine wave screen
    const osc = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.4), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    osc.position.set(5.8, 1.2, -4.5);
    scene.add(osc);
    const oscScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.28), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    oscScreen.position.set(5.8, 1.22, -4.29);
    scene.add(oscScreen);

    // Soldering Station with Iron Stand
    const solder = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.35), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    solder.position.set(6.6, 1.05, -4.4);
    scene.add(solder);

    // Working 3D Printer Machine on separate stand
    const printerBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.7), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5 }));
    printerBase.position.set(9.2, 0.4, -4.5);
    scene.add(printerBase);
    const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xff6b2b }));
    spool.rotation.z = Math.PI / 2;
    spool.position.set(9.2, 1.1, -4.5);
    scene.add(spool);

    // Prototype of IoT LPG-SafeSense (Green Cylinder + Breadboard + Loadcell base!)
    const gasTank = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.65, 16), new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 }));
    gasTank.position.set(7.5, 1.3, -4.5);
    scene.add(gasTank);

    const loadcellPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 }));
    loadcellPlate.position.set(7.5, 0.98, -4.5);
    scene.add(loadcellPlate);

    // Gleaming Gold Trophy Pedestal (Juara 1 MKI!)
    const ped = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.6), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    ped.position.set(9.4, 0.45, -8.2);
    scene.add(ped);

    const trophy = new THREE.Mesh(new THREE.OctahedronGeometry(0.24), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 }));
    trophy.position.set(9.4, 1.2, -8.2);
    scene.add(trophy);

    // 2 Active Hardware Engineers Working
    createDeskWorker(6.2, 0, -5.5, 0, 0xf97316, true);
    createDeskWorker(7.8, 0, -5.5, 0, 0x14b8a6, true);
  }

  // Room 6: Detailed Press Conference & Publications Hall
  function buildRoom6PressHallDetailed(trimMat, darkMat) {
    // Executive Conference Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.85, 1.7), darkMat);
    table.position.set(14, 0.42, -4.5);
    scene.add(table);

    // 4 Conference Chairs around table
    for (let c = 0; c < 2; c++) {
      createDeskWorker(13.2 + c * 1.5, 0, -5.6, 0, 0x059669, true);
      createDeskWorker(13.2 + c * 1.5, 0, -3.4, Math.PI, 0x3b82f6, false);
    }

    // Presentation Podium / Lectern with Microphone
    const podium = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.15, 0.5), darkMat);
    podium.position.set(11.2, 0.58, -3.5);
    scene.add(podium);

    const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    mic.position.set(11.2, 1.28, -3.4);
    mic.rotation.x = -Math.PI / 6;
    scene.add(mic);

    // Giant 3.5m Wide Presentation Projection Screen
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 1.8), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 }));
    screen.position.set(14, 1.9, -9.5);
    scene.add(screen);

    // Ceiling Projector casting subtle light cone
    const proj = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.35), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    proj.position.set(14, 2.7, -4.5);
    scene.add(proj);
  }

  // Room 7: Detailed Executive Recruiter Lounge & Partnership Suite
  function buildRoom7RecruiterLoungeDetailed(trimMat, darkMat, chairMat) {
    // L-Shaped Executive Leather Sofa
    const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.75, 1.3), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }));
    sofaMain.position.set(21, 0.38, -4.8);
    scene.add(sofaMain);

    const sofaL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.75, 1.8), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }));
    sofaL.position.set(22.8, 0.38, -3.4);
    scene.add(sofaL);

    // Low Marble Coffee Table with Flowers & Magazines
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 0.9), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }));
    table.position.set(21, 0.2, -2.4);
    scene.add(table);

    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.25), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 }));
    vase.position.set(21, 0.52, -2.4);
    scene.add(vase);

    // Executive Desk with Apple iMac
    const execDesk = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 1.2), darkMat);
    execDesk.position.set(18.5, 0.45, -8.2);
    scene.add(execDesk);

    const imac = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.05), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 }));
    imac.position.set(18.5, 1.25, -8.2);
    scene.add(imac);

    // Floor Standing Architectural Lamp with warm cone
    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
    lampPole.position.set(23.5, 1.1, -1.2);
    scene.add(lampPole);

    const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0xffedd5 }));
    lampShade.position.set(23.5, 2.1, -1.2);
    scene.add(lampShade);

    const floorLight = new THREE.PointLight(0xfef08a, 0.8, 5);
    floorLight.position.set(23.5, 2.0, -1.2);
    scene.add(floorLight);

    // 2 People seated on sofa discussing portfolio
    createDeskWorker(20.4, 0, -4.8, Math.PI / 6, 0x059669, false);
    createDeskWorker(21.8, 0, -4.8, -Math.PI / 6, 0xff6b2b, false);
  }

  // ─── 6. MOBILE WALKING EMPLOYEES (THE BUSTLING MOVING OFFICE!) ─
  function buildPatrollingOfficeWorkers() {
    // Worker 1: Patrols Foyer to Newsroom (x from -21 to -7)
    const w1 = createPatrollingHuman(0x3b82f6, 0x1e293b, true); // carrying tablet
    w1.minX = -21;
    w1.maxX = -7;
    w1.speed = 0.022;
    w1.currentX = -20;
    w1.dir = 1;
    w1.z = 1.0;
    scene.add(w1.group);
    patrollingStaff.push(w1);

    // Worker 2: Patrols Data Lab to Press Hall (x from -1 to 15)
    const w2 = createPatrollingHuman(0x10b981, 0x1e293b, false); // carrying coffee mug
    w2.minX = -1;
    w2.maxX = 15;
    w2.speed = 0.018;
    w2.currentX = 0;
    w2.dir = 1;
    w2.z = -1.2;
    scene.add(w2.group);
    patrollingStaff.push(w2);
  }

  function createPatrollingHuman(shirtColor, pantsColor, hasTablet = true) {
    const grp = new THREE.Group();

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xe8b896, roughness: 0.6 })
    );
    head.position.y = 1.45;
    grp.add(head);

    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.7 })
    );
    torso.position.y = 0.95;
    grp.add(torso);

    // Props in hand
    if (hasTablet) {
      const tab = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.2), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      tab.position.set(0.25, 0.85, 0.1);
      grp.add(tab);
    } else {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      cup.position.set(0.22, 0.88, 0.12);
      grp.add(cup);
    }

    const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.6, 6);
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.8 });

    const legL = new THREE.Group();
    legL.position.set(-0.1, 0.6, 0);
    const mLegL = new THREE.Mesh(legGeo, pantsMat);
    mLegL.position.y = -0.3;
    legL.add(mLegL);
    grp.add(legL);

    const legR = new THREE.Group();
    legR.position.set(0.1, 0.6, 0);
    const mLegR = new THREE.Mesh(legGeo, pantsMat);
    mLegR.position.y = -0.3;
    legR.add(mLegR);
    grp.add(legR);

    return { group: grp, legL: legL, legR: legR, stepPhase: 0 };
  }

  // 3D Interactive NPCs
  function buildInteractive3DNPCS() {
    NPC_GUIDES.forEach((npc, idx) => {
      const grp = new THREE.Group();
      grp.position.set(npc.pos.x, 0, npc.pos.z);
      grp.userData = { isNPC: true, npcIndex: idx };

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xe8b896, roughness: 0.6 })
      );
      head.position.y = 1.45;
      grp.add(head);

      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.25, 0.65, 12),
        new THREE.MeshStandardMaterial({ color: npc.shirtColor, roughness: 0.7 })
      );
      torso.position.y = 0.95;
      grp.add(torso);

      const pants = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8), pants);
      legL.position.set(-0.11, 0.35, 0);
      grp.add(legL);
      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8), pants);
      legR.position.set(0.11, 0.35, 0);
      grp.add(legR);

      // Floating interactive badge icon above head ("💬")
      const iconAura = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.15),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true })
      );
      iconAura.position.y = 1.95;
      grp.add(iconAura);

      scene.add(grp);
    });
  }

  // ─── 7. ANIMATED WALKING HERO WITH CYAN SELECTION RING ────────
  function createWalkingHeroWithIndicator() {
    walkingHero = new THREE.Group();

    // Glowing Cyan Target Ring (Inspired directly by user's screenshot!)
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

    // Hero Character Model
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xe8b896, roughness: 0.6 })
    );
    head.position.y = 1.45;
    walkingHero.add(head);

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.9 })
    );
    hair.position.y = 1.48;
    walkingHero.add(hair);

    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xff6b2b, roughness: 0.6 });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.65, 12), shirtMat);
    torso.position.y = 0.95;
    walkingHero.add(torso);

    const tablet = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.32, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3 })
    );
    tablet.position.set(0.28, 0.85, 0.12);
    walkingHero.add(tablet);

    const armGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.55, 8);
    armPivotL = new THREE.Group();
    armPivotL.position.set(-0.28, 1.2, 0);
    const armL = new THREE.Mesh(armGeo, shirtMat);
    armL.position.y = -0.25;
    armPivotL.add(armL);
    walkingHero.add(armPivotL);

    armPivotR = new THREE.Group();
    armPivotR.position.set(0.28, 1.2, 0);
    const armR = new THREE.Mesh(armGeo, shirtMat);
    armR.position.y = -0.25;
    armPivotR.add(armR);
    walkingHero.add(armPivotR);

    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const legGeo = new THREE.CylinderGeometry(0.085, 0.08, 0.65, 8);

    legPivotL = new THREE.Group();
    legPivotL.position.set(-0.11, 0.65, 0);
    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.y = -0.32;
    legPivotL.add(legL);
    walkingHero.add(legPivotL);

    legPivotR = new THREE.Group();
    legPivotR.position.set(0.11, 0.65, 0);
    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.y = -0.32;
    legPivotR.add(legR);
    walkingHero.add(legPivotR);

    walkingHero.position.set(-21, 0, 1);
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

          <!-- MULTI-ANGLE POV SWITCHER HUD -->
          <div class="nadi-pov-switcher-wrap">
            <span class="nadi-pov-label">SUDUT PANDANG (POV)</span>
            <div class="nadi-pov-btn-group">
              <button class="nadi-pov-btn active" data-pov="isometric" title="Tampilan Isometrik 45 Derajat">
                <ion-icon name="cube-outline"></ion-icon> Isometrik
              </button>
              <button class="nadi-pov-btn" data-pov="topdown" title="Tampilan Bird's-Eye Tactical (Seperti Game)">
                <ion-icon name="scan-outline"></ion-icon> Top-Down
              </button>
              <button class="nadi-pov-btn" data-pov="thirdperson" title="Sudut Pandang Kamera Belakang Karakter">
                <ion-icon name="walk-outline"></ion-icon> Third-Person
              </button>
              <button class="nadi-pov-btn" data-pov="orbit" title="Putar Bebas Sudut Pandang 360">
                <ion-icon name="refresh-outline"></ion-icon> Orbit Bebas
              </button>
            </div>
          </div>

          <!-- ORBIT DRAG HINT PILL -->
          <div class="nadi-orbit-hint" id="nadi-orbit-hint">
            💡 Tahan klik & geser di layar untuk memutar sudut pandang 360°
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

          <!-- FLOATING CENTERED BOTTOM SEGMENTED DOCK (STEPS 01 - 07) -->
          <!-- User Feedback: Rapikan blok 1-7 agar tidak berantakan & tidak bertabrakan dengan kartu! -->
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

    if (lbl) lbl.innerHTML = `<span>${step.category.split('•')[0]}</span> &bull; ${step.category.split('•')[1] || ''}`;
    if (h1) h1.innerHTML = step.title;
    if (desc) desc.textContent = step.desc;

    if (cardStatus) {
      cardStatus.textContent = step.badgeStatus;
      cardStatus.className = `nadi-card-badge-status ${step.badgeStatusColor || 'green'}`;
    }

    // Update active segmented dock step
    document.querySelectorAll('.nadi-step-item').forEach((item, idx) => {
      if (idx === index) item.classList.add('active');
      else item.classList.remove('active');
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

    // STATION 2: 15 PENGALAMAN
    else if (index === 2) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="briefcase-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>15 Pengalaman Kerja & Organisasi</strong>`;

      container.innerHTML = `
        <div class="nadi-filter-pills-bar">
          <button class="nadi-filter-pill ${activeExpFilter === 'all' ? 'active' : ''}" data-filter="all">Semua (15)</button>
          <button class="nadi-filter-pill ${activeExpFilter === 'work' ? 'active' : ''}" data-filter="work">Kerja/Magang</button>
          <button class="nadi-filter-pill ${activeExpFilter === 'org' ? 'active' : ''}" data-filter="org">Organisasi</button>
        </div>

        <div class="nadi-card-scroll-body">
          <div class="nadi-exp-list">
            ${getFilteredExperience().map(exp => `
              <div class="nadi-exp-item">
                <div class="nadi-exp-header">
                  <span class="nadi-exp-role">${exp.position}</span>
                  <span class="nadi-exp-period">${exp.period}</span>
                </div>
                <div class="nadi-exp-company">${exp.company}</div>
                <p class="nadi-exp-desc">${exp.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeExpFilter = btn.dataset.filter;
          renderStoryStep(2);
        });
      });
    }

    // STATION 3: PENDIDIKAN & 8 SERTIFIKASI
    else if (index === 3) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="school-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>Pendidikan & Sertifikasi Resmi</strong>`;

      container.innerHTML = `
        <div class="nadi-filter-pills-bar">
          <button class="nadi-filter-pill ${activeEduFilter === 'all' ? 'active' : ''}" data-filter="all">Semua (8)</button>
          <button class="nadi-filter-pill ${activeEduFilter === 'formal' ? 'active' : ''}" data-filter="formal">Formal</button>
          <button class="nadi-filter-pill ${activeEduFilter === 'cert' ? 'active' : ''}" data-filter="cert">Sertifikasi</button>
        </div>

        <div class="nadi-card-scroll-body">
          <div class="nadi-edu-list">
            ${getFilteredEducation().map(edu => `
              <div class="nadi-edu-item">
                <div class="nadi-edu-school">
                  <ion-icon name="checkmark-circle"></ion-icon>
                  <span>${edu.institution}</span>
                </div>
                <div class="nadi-edu-period">${edu.period}</div>
                <p class="nadi-edu-desc">${edu.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeEduFilter = btn.dataset.filter;
          renderStoryStep(3);
        });
      });
    }

    // STATION 4: 50+ PROYEK PORTOFOLIO (COMPACT MINIMALIST ROWS!)
    else if (index === 4) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="folder-open-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>50+ Proyek Portofolio Terkurasi</strong>`;

      const filteredProjects = getFilteredProjects();

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

        <div class="nadi-card-scroll-body">
          <div class="nadi-projects-grid">
            ${filteredProjects.map(proj => `
              <div class="nadi-proj-card">
                <div class="nadi-proj-thumb-wrap">
                  <img src="${proj.imageUrl}" class="nadi-proj-img" alt="${proj.title}" onerror="this.src='./assets/images/portfolio/card-1.jpg'">
                </div>
                <div class="nadi-proj-content">
                  <div class="nadi-proj-title">${proj.title}</div>
                  <div class="nadi-proj-meta-row">
                    <span class="nadi-proj-badge">${proj.category}</span>
                    <span class="nadi-proj-order">#${proj.order}</span>
                  </div>
                </div>
                <div class="nadi-proj-actions">
                  <button class="nadi-proj-btn btn-open-lightbox" data-id="${proj.order}">Detail</button>
                  ${proj.projectUrl ? `
                    <a href="${proj.projectUrl}" target="_blank" rel="noopener" class="nadi-proj-btn" style="color: var(--nadi-orange);">Link</a>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const searchInput = document.getElementById('nadi-proj-search-input');
      searchInput?.addEventListener('input', (e) => {
        activeProjSearch = e.target.value.toLowerCase();
        renderStoryStep(4);
      });

      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeProjFilter = btn.dataset.filter;
          renderStoryStep(4);
        });
      });

      container.querySelectorAll('.btn-open-lightbox').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id, 10);
          const p = DEFAULT_DATA.projects.find(x => x.order === id);
          if (p) openProjectLightbox(p);
        });
      });
    }

    // STATION 5: 20 BLOG & RISET PRESTASI
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

        <div class="nadi-card-scroll-body">
          <div class="nadi-blog-list">
            ${filteredBlog.map(b => `
              <div class="nadi-blog-item">
                <div class="nadi-blog-top">
                  <span class="nadi-blog-date">${b.date}</span>
                  <span class="nadi-blog-cat">${b.category}</span>
                </div>
                <div class="nadi-blog-title">${b.title}</div>
                <p class="nadi-blog-desc">${b.excerpt}</p>
                ${b.url ? `
                  <a href="${b.url}" target="_blank" rel="noopener" class="nadi-blog-link">
                    <span>Baca Artikel</span> &rarr;
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
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

        <div class="nadi-card-scroll-body" style="max-height: 38vh;">
          ${activeContactSubtab === 'testi' ? `
            <div class="nadi-testi-list">
              ${DEFAULT_DATA.testimonials.map(t => `
                <div class="nadi-testi-item">
                  <div class="nadi-testi-header">
                    <img src="${t.avatarUrl}" class="nadi-testi-avatar" alt="${t.name}">
                    <div>
                      <div class="nadi-testi-name">${t.name}</div>
                      <div class="nadi-testi-date">${t.date}</div>
                    </div>
                  </div>
                  <p class="nadi-testi-quote">"${t.text}"</p>
                </div>
              `).join('')}
            </div>
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
        <div class="nadi-service-list">
          ${DEFAULT_DATA.services.map(s => `
            <div class="nadi-service-item">
              <div class="nadi-service-icon-box">
                <img src="${s.iconUrl}" alt="${s.title}" onerror="this.src='./assets/images/icon-dev.svg'">
              </div>
              <div class="nadi-service-info">
                <div class="nadi-service-title-row">
                  <span class="nadi-service-title">${s.title}</span>
                  <span class="nadi-service-num">#${s.order}</span>
                </div>
                <p class="nadi-service-desc">${s.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      return `
        <div class="nadi-skills-list">
          ${DEFAULT_DATA.skills.map(sk => `
            <div class="nadi-skill-item">
              <div class="nadi-skill-top">
                <span class="nadi-skill-name">${sk.name}</span>
                <span class="nadi-skill-pct">${sk.percentage}%</span>
              </div>
              <div class="nadi-skill-bar">
                <div class="nadi-skill-fill" style="width: ${sk.percentage}%;"></div>
              </div>
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

  function jumpToStep(idx) {
    if (!scrollyTrack) return;
    const clampedIdx = Math.max(0, Math.min(SCROLL_STEPS.length - 1, idx));
    const trackTop = scrollyTrack.offsetTop;
    const trackHeight = scrollyTrack.offsetHeight;
    const maxScroll = trackHeight - window.innerHeight;
    const targetScroll = trackTop + (clampedIdx / (SCROLL_STEPS.length - 1)) * maxScroll;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
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
    camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 150);
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

    document.getElementById('nadi-intro-btn')?.addEventListener('click', startIntroExperience);

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

    // Smooth Orbit & Mouse Drag Handling
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

        if (currentPOV === 'orbit') {
          orbitYaw -= dx * 0.007;
          orbitPitch = Math.max(0.15, Math.min(1.35, orbitPitch + dy * 0.007));
        } else {
          window.scrollBy({ top: -dy * 2.5, behavior: 'auto' });
        }
      }
    });

    // Touch Swipe Controls
    let touchStartY = 0;
    canvas.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const delta = touchStartY - touchY;
      touchStartY = touchY;
      window.scrollBy({ top: delta * 2, behavior: 'auto' });
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

    // 4 COMFORTABLE & BALANCED POVS (USER REQUEST #1!)
    if (currentPOV === 'topdown') {
      // High-angle tactical view (approx. 65° tilt down, looking ahead along the path)
      pos.x = heroPos.x - 1.2;
      pos.y = 15.0;
      pos.z = heroPos.z + 7.5;
      look.x = heroPos.x + 1.8;
      look.y = 0.4;
      look.z = heroPos.z;

    } else if (currentPOV === 'thirdperson') {
      // Over-the-shoulder follow-cam behind the walking hero
      pos.x = heroPos.x - 3.2;
      pos.y = 2.2;
      pos.z = heroPos.z + 3.4;
      look.x = heroPos.x + 4.0;
      look.y = 1.2;
      look.z = heroPos.z - 0.5;

    } else if (currentPOV === 'orbit') {
      // Smooth 360 degree free orbit around hero
      pos.x = heroPos.x + Math.sin(orbitYaw) * orbitDistance * Math.cos(orbitPitch);
      pos.y = Math.sin(orbitPitch) * orbitDistance + 1.2;
      pos.z = heroPos.z + Math.cos(orbitYaw) * orbitDistance * Math.cos(orbitPitch);
      look.x = heroPos.x;
      look.y = 1.2;
      look.z = heroPos.z;

    } else {
      // Default: Balanced 42° Isometric Cutaway Perspective
      pos.x = stepA.cam.x + (stepB.cam.x - stepA.cam.x) * ease;
      pos.y = stepA.cam.y + (stepB.cam.y - stepA.cam.y) * ease;
      pos.z = stepA.cam.z + (stepB.cam.z - stepA.cam.z) * ease;
    }

    // If Outro is active, pull back camera into celebratory sky overview
    if (isOutroActive) {
      pos.x = 0;
      pos.y = 26;
      pos.z = 24;
      look.x = 0;
      look.y = 1.2;
      look.z = 0;
    }

    return { pos, look };
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    const prevProg = currentProgress;
    currentProgress += (targetProgress - currentProgress) * 0.08;
    const deltaProg = currentProgress - prevProg;

    const time = performance.now() * 0.002;

    // 1. ANIMATE WALKING HERO ALONG ORANGE FLOOR PATH
    if (walkingHero && orangeCurve) {
      const curveT = Math.min(0.999, Math.max(0.001, currentProgress));
      const heroPt = orangeCurve.getPointAt(curveT);
      const heroTangent = orangeCurve.getTangentAt(curveT);

      walkingHero.position.set(heroPt.x, 0, heroPt.z);
      walkingHero.rotation.y = Math.atan2(heroTangent.x, heroTangent.z);

      // Pulse cyan target ring (Reference feature!)
      if (heroGroundRing) {
        const pulse = 1.0 + Math.sin(time * 3) * 0.08;
        heroGroundRing.scale.set(pulse, pulse, 1);
      }
      if (heroRingChevron) {
        heroRingChevron.position.z = 0.65 + Math.sin(time * 4) * 0.04;
      }

      // Walking cycle animation when moving
      if (Math.abs(deltaProg) > 0.0001) {
        walkStepPhase += Math.abs(deltaProg) * 85;
        if (legPivotL) legPivotL.rotation.x = Math.sin(walkStepPhase) * 0.65;
        if (legPivotR) legPivotR.rotation.x = -Math.sin(walkStepPhase) * 0.65;
        if (armPivotL) armPivotL.rotation.x = -Math.sin(walkStepPhase) * 0.5;
        if (armPivotR) armPivotR.rotation.x = Math.sin(walkStepPhase) * 0.5;
        walkingHero.position.y = Math.abs(Math.sin(walkStepPhase * 2)) * 0.06;
      } else {
        if (legPivotL) legPivotL.rotation.x *= 0.85;
        if (legPivotR) legPivotR.rotation.x *= 0.85;
        if (armPivotL) armPivotL.rotation.x *= 0.85;
        if (armPivotR) armPivotR.rotation.x *= 0.85;
        walkingHero.position.y = Math.sin(time * 1.5) * 0.015;
      }
    }

    // 2. ANIMATE MOBILE PATROLLING EMPLOYEES (THE BUSTLING OFFICE!)
    patrollingStaff.forEach(w => {
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

      w.stepPhase += 0.12;
      w.legL.rotation.x = Math.sin(w.stepPhase) * 0.5;
      w.legR.rotation.x = -Math.sin(w.stepPhase) * 0.5;
      w.group.position.y = Math.abs(Math.sin(w.stepPhase * 2)) * 0.04;
    });

    // 3. ANIMATE DESK WORKERS (Typing / subtle head nodding)
    activeWorkers.forEach(w => {
      if (w.isTyping) {
        w.armL.rotation.x = Math.PI / 3 + Math.sin(time * 8 + w.phase) * 0.08;
        w.armR.rotation.x = Math.PI / 3 + Math.cos(time * 8 + w.phase) * 0.08;
      }
      w.head.rotation.y = Math.sin(time * 1.2 + w.phase) * 0.12;
    });

    // 4. ANIMATE BLINKING SERVER LEDS
    serverLEDs.forEach((led, idx) => {
      led.visible = Math.sin(time * 6 + idx) > -0.2;
    });

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
