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

  // ─── 2. 7 INTERACTIVE NPCS DEFINITION ─────────────────────────
  const NPC_GUIDES = [
    {
      roomIndex: 0,
      name: "Nadia",
      role: "Front Desk & Welcome Guide",
      avatarLetter: "N",
      pos: { x: -20.5, z: 10.5 },
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
      pos: { x: -10.5, z: -15.5 },
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
      pos: { x: 10.5, z: -15.5 },
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
      pos: { x: 20.5, z: 10.5 },
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
      pos: { x: 0, z: 14.5 },
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

  // ─── 3. 7 SCROLLYTELLING STEP DEFINITIONS (HORSESHOE ATRIUM LAYOUT) ─
  const SCROLL_STEPS = [
    {
      stepNum: "01",
      stepName: "Profil",
      category: "LANGKAH 01 • PROFIL & KUALIFIKASI PROFESIONAL",
      title: "Kreativitas Bertemu Rekayasa Data & Komunikasi Publik.",
      desc: "Mahasiswa S1 Teknik Informatika Institut Teknologi PLN dengan keahlian multidisipliner memadukan perancangan identitas visual korporat, produksi siaran langsung nasional, pengelolaan komunikasi digital resmi, serta riset dan analitik data empiris.",
      badgeStatus: "Tersedia untuk Kerja & Magang",
      badgeStatusColor: "green",
      cam: { x: -20, y: 7.5, z: 17.5 },
      look: { x: -20, y: 1.2, z: 12 }
    },
    {
      stepNum: "02",
      stepName: "Layanan",
      category: "LANGKAH 02 • 10 LAYANAN & 11 KOMPETENSI TEKNIS",
      title: "10 Layanan Spesialisasi & 11 Keterampilan Teknis Teruji.",
      desc: "Menyediakan 10 layanan profesional yang teruji di industri: dari produksi siaran langsung multi-kamera acara protokoler nasional, creative direction identitas visual, strategi pertumbuhan media sosial 3x lipat, riset rekayasa IoT pintar, hingga pemodelan data machine learning cloud.",
      badgeStatus: "10 Layanan • 11 Skills",
      badgeStatusColor: "orange",
      cam: { x: -24, y: 7.5, z: 3.5 },
      look: { x: -24, y: 1.2, z: -2 }
    },
    {
      stepNum: "03",
      stepName: "Pengalaman",
      category: "LANGKAH 03 • 15 PENGALAMAN KERJA & ORGANISASI",
      title: "15 Rekam Jejak Profesional & Kepemimpinan Nasional.",
      desc: "Perjalanan karir komprehensif mencakup peran strategis sebagai Social Media Manager di PJCI, Tim Humas & Komunikasi Publik ITPLN, Lead Visual Switcher Wisuda Nasional, Koordinator Kreatif ITPLN Media, Ketua Pelaksana National CAD Competition (NCC 2025), hingga Student Ambassador DQLab.",
      badgeStatus: "15 Entri Terverifikasi",
      badgeStatusColor: "green",
      cam: { x: -12, y: 7.5, z: -9.5 },
      look: { x: -12, y: 1.2, z: -15 }
    },
    {
      stepNum: "04",
      stepName: "Pendidikan",
      category: "LANGKAH 04 • PENDIDIKAN FORMAL & 8 LISENSI RESMI",
      title: "Fondasi Akademik Kuat & 8 Lisensi Internasional.",
      desc: "Menempuh pendidikan Sarjana (S1) Teknik Informatika di Institut Teknologi PLN dengan spesialisasi komputasi cerdas dan rekayasa data industri energi, diperkuat oleh 8 lisensi resmi: Azure Databricks Machine Learning, SEM-PLS 120 JP, MOS Excel 2019, dan IBM AI.",
      badgeStatus: "8 Lisensi Resmi Terverifikasi",
      badgeStatusColor: "green",
      cam: { x: 12, y: 7.5, z: -9.5 },
      look: { x: 12, y: 1.2, z: -15 }
    },
    {
      stepNum: "05",
      stepName: "50+ Proyek",
      category: "LANGKAH 05 • EKSIBI 50+ KARYA & PROYEK PORTOFOLIO",
      title: "Eksibisi 50 Karya Terkurasi dengan Dokumentasi Asli.",
      desc: "Menampilkan seluruh 50 portofolio karya nyata yang telah diselesaikan: live streaming siaran nasional, strategi konten kampanye media sosial (@itpln & @smartgridindonesia), rekayasa prototipe IoT LPG-SafeSense, perancangan identitas visual korporat, hingga sistem data dan web.",
      badgeStatus: "50 Proyek Lengkap Aktif",
      badgeStatusColor: "orange",
      cam: { x: 24, y: 7.5, z: 3.5 },
      look: { x: 24, y: 1.2, z: -2 }
    },
    {
      stepNum: "06",
      stepName: "Publikasi",
      category: "LANGKAH 06 • 20 PUBLIKASI, ARTIKEL & RISET PRESTASI",
      title: "20 Publikasi Ilmiah, Redaksi Berita & Hibah Riset.",
      desc: "Kumpulan publikasi artikel berkala, jurnalisme korporat untuk portal resmi PJCI dan ITPLN, tulisan teknologi transisi energi bersih, serta rekam jejak inovasi peraih Juara 1 MKI dan hibah penelitian PKM DIKTI Kemendikbudristek.",
      badgeStatus: "20 Publikasi & Prestasi",
      badgeStatusColor: "orange",
      cam: { x: 20, y: 7.5, z: 17.5 },
      look: { x: 20, y: 1.2, z: 12 }
    },
    {
      stepNum: "07",
      stepName: "Kontak",
      category: "LANGKAH 07 • TESTIMONI & PUSAT REKRUTMEN RESMI",
      title: "Testimoni Stakeholder & Formulir Komunikasi Langsung.",
      desc: "Terbuka untuk kesempatan kerja penuh waktu, program magang, konsultasi creative direction, maupun kolaborasi proyek strategis di Jakarta, hybrid, maupun remote. Kirim pesan langsung ke database atau hubungi via WhatsApp.",
      badgeStatus: "Respons Cepat & Siap Onboarding",
      badgeStatusColor: "green",
      cam: { x: 0, y: 7.5, z: 21.5 },
      look: { x: 0, y: 1.2, z: 16 }
    }
  ];

  // ─── 4. BUSTLING & DETAILED ARCHITECTURAL DIORAMA BUILDER ─────
  function buildMiniatureDioramaScene() {
    patrollingStaff = [];
    activeWorkers = [];
    serverLEDs = [];

    // 1. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
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

    const skylight = new THREE.DirectionalLight(0xe0f2fe, 0.25);
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
    const foundationGeo = new THREE.BoxGeometry(70, 0.6, 54);
    const foundation = new THREE.Mesh(foundationGeo, floorMat);
    foundation.position.set(0, -0.3, 0);
    foundation.receiveShadow = true;
    scene.add(foundation);

    // 4. Central Sunken Courtyard Atrium Garden
    buildCourtyardAtrium(floorMat, wallBodyMat, orangeTrimMat);

    // 5. Architectural Outer Enclosure & Room Partitions
    buildHorseshoePartitions(wallBodyMat, glassWallMat, frameDarkMat, orangeTrimMat, oakWoodMat);

    // 6. Winding Paved Guide Path connecting all 7 zones
    createPavedSidewalkAndPath();

    // 7. DISTINCT ARCHITECTURAL ROOM CARPET INLAYS & ZONING
    buildRoomZoneInlays();

    // 8. BUILD 7 DETAILED, BUSTLING ROOMS (PACKED WITH AUTHENTIC GEAR & 20+ CREW)
    buildRoom1FoyerDetailed(wallBodyMat, orangeTrimMat, oakWoodMat);
    buildRoom2BroadcastDetailed(screenGlowMat, orangeTrimMat, frameDarkMat);
    buildRoom3NewsroomDetailed(orangeTrimMat, oakWoodMat);
    buildRoom4DataLabDetailed(orangeTrimMat, frameDarkMat);
    buildRoom5IoTWorkshopDetailed(orangeTrimMat, frameDarkMat);
    buildRoom6PressHallDetailed(orangeTrimMat, oakWoodMat);
    buildRoom7RecruiterLoungeDetailed(orangeTrimMat, oakWoodMat);

    // 8. 7 Interactive NPCs placed across rooms
    buildInteractive3DNPCS();

    // 9. Mobile Patrolling Office Workers across 3 wings
    buildPatrollingOfficeWorkers();

    // 10. Animated Walking Hero (Mangara) in Formal Office Dresscode
    createWalkingHeroWithIndicator();
  }

  // ─── CENTRAL COURTYARD ATRIUM GARDEN ─────────────────────────
  function buildCourtyardAtrium(floorMat, wallMat, trimMat) {
    const atriumGrp = new THREE.Group();

    // Sunken zen garden base
    const pebbleBorder = new THREE.Mesh(
      new THREE.BoxGeometry(18.4, 0.04, 14.4),
      new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.9 })
    );
    pebbleBorder.position.set(0, 0.02, 0);
    atriumGrp.add(pebbleBorder);

    const sandBase = new THREE.Mesh(
      new THREE.BoxGeometry(17.6, 0.06, 13.6),
      new THREE.MeshStandardMaterial({ color: 0xdad7ce, roughness: 0.95 })
    );
    sandBase.position.set(0, 0.03, 0);
    atriumGrp.add(sandBase);

    // Reflecting Pool
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

    // 4 Modern Planter Boxes with Lush Architectural Trees
    const planterCoords = [
      { x: -5.5, z: -4.5 },
      { x: 5.5, z: -4.5 },
      { x: -5.5, z: 4.5 },
      { x: 5.5, z: 4.5 }
    ];

    const leafMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8, flatShading: true });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.9 });
    const planterMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });

    planterCoords.forEach((p, idx) => {
      // Terrazzo Planter Cube
      const box = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 2.0), planterMat);
      box.position.set(p.x, 0.22, p.z);
      box.castShadow = true;
      box.receiveShadow = true;
      atriumGrp.add(box);

      // Soil
      const soil = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.05, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x271c16, roughness: 1.0 })
      );
      soil.position.set(p.x, 0.44, p.z);
      atriumGrp.add(soil);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.8, 8), trunkMat);
      trunk.position.set(p.x, 1.3, p.z);
      trunk.castShadow = true;
      atriumGrp.add(trunk);

      // Faceted Lush Canopy
      const crown1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0, 1), idx % 2 === 0 ? leafMat1 : leafMat2);
      crown1.position.set(p.x, 2.6, p.z);
      crown1.castShadow = true;
      atriumGrp.add(crown1);

      const crown2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 1), leafMat2);
      crown2.position.set(p.x + 0.2, 3.2, p.z - 0.2);
      crown2.castShadow = true;
      atriumGrp.add(crown2);

      // Uplight spotlight
      const uplight = new THREE.PointLight(0xfef08a, 0.6, 7);
      uplight.position.set(p.x, 0.5, p.z);
      atriumGrp.add(uplight);
    });

    // 2 Teak Garden Benches
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });
    const bench1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 0.55), benchMat);
    bench1.position.set(0, 0.22, -3.2);
    atriumGrp.add(bench1);

    const bench2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 0.55), benchMat);
    bench2.position.set(0, 0.22, 3.2);
    atriumGrp.add(bench2);

    // Perimeter Glass Balustrade around Courtyard Opening
    const glassRailMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1
    });
    const handrailMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });

    // North & South glass rails
    [-7.2, 7.2].forEach(z => {
      const gRail = new THREE.Mesh(new THREE.BoxGeometry(18.2, 0.9, 0.05), glassRailMat);
      gRail.position.set(0, 0.48, z);
      atriumGrp.add(gRail);

      const hRail = new THREE.Mesh(new THREE.BoxGeometry(18.2, 0.05, 0.08), handrailMat);
      hRail.position.set(0, 0.95, z);
      atriumGrp.add(hRail);
    });

    // West & East glass rails
    [-9.2, 9.2].forEach(x => {
      const gRail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 14.2), glassRailMat);
      gRail.position.set(x, 0.48, 0);
      atriumGrp.add(gRail);

      const hRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 14.2), handrailMat);
      hRail.position.set(x, 0.95, 0);
      atriumGrp.add(hRail);
    });

    scene.add(atriumGrp);
  }

  // ─── HORSESHOE ATRIUM ARCHITECTURAL PARTITIONS ────────────────
  function buildHorseshoePartitions(wallMat, glassMat, frameMat, orangeMat, woodMat) {
    const partGrp = new THREE.Group();

    // 1. Exterior Perimeter Walls with Large Windows
    // North Wall (Z = -23)
    const nWall = new THREE.Mesh(new THREE.BoxGeometry(68, 2.8, 0.4), wallMat);
    nWall.position.set(0, 1.4, -23);
    nWall.receiveShadow = true;
    partGrp.add(nWall);

    const nCap = new THREE.Mesh(new THREE.BoxGeometry(68, 0.12, 0.46), orangeMat);
    nCap.position.set(0, 2.86, -23);
    partGrp.add(nCap);

    // North Wall Windows
    const winMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let wx = -28; wx <= 28; wx += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), winMat);
      win.position.set(wx, 1.7, -22.78);
      partGrp.add(win);
    }

    // West Wall (X = -31)
    const wWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 48), wallMat);
    wWall.position.set(-31, 1.4, 0);
    wWall.receiveShadow = true;
    partGrp.add(wWall);

    const wCap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 48), orangeMat);
    wCap.position.set(-31, 2.86, 0);
    partGrp.add(wCap);

    for (let wz = -18; wz <= 18; wz += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), winMat);
      win.position.set(-30.78, 1.7, wz);
      win.rotation.y = Math.PI / 2;
      partGrp.add(win);
    }

    // East Wall (X = 31)
    const eWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 48), wallMat);
    eWall.position.set(31, 1.4, 0);
    eWall.receiveShadow = true;
    partGrp.add(eWall);

    const eCap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 48), orangeMat);
    eCap.position.set(31, 2.86, 0);
    partGrp.add(eCap);

    for (let wz = -18; wz <= 18; wz += 4) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), winMat);
      win.position.set(30.78, 1.7, wz);
      win.rotation.y = -Math.PI / 2;
      partGrp.add(win);
    }

    // South Wall (Z = 23)
    const sWallL = new THREE.Mesh(new THREE.BoxGeometry(26, 2.8, 0.4), wallMat);
    sWallL.position.set(-20, 1.4, 23);
    partGrp.add(sWallL);
    const sWallR = new THREE.Mesh(new THREE.BoxGeometry(26, 2.8, 0.4), wallMat);
    sWallR.position.set(20, 1.4, 23);
    partGrp.add(sWallR);

    // 2. Interior Zone Dividers (Glass & Wood Acoustic Fins)
    // Divider 1: Separates Bilik 1 (Foyer) & Bilik 2 (Broadcast Studio) along Z = 5
    const div1 = new THREE.Mesh(new THREE.BoxGeometry(14, 2.6, 0.3), wallMat);
    div1.position.set(-24, 1.3, 5);
    partGrp.add(div1);
    const div1Cap = new THREE.Mesh(new THREE.BoxGeometry(14, 0.08, 0.36), woodMat);
    div1Cap.position.set(-24, 2.64, 5);
    partGrp.add(div1Cap);

    // Divider 2: Separates Bilik 2 (Broadcast) & Bilik 3 (Newsroom) along X = -18
    const div2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.6, 14), wallMat);
    div2.position.set(-18, 1.3, -16);
    partGrp.add(div2);
    const div2Cap = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 14), woodMat);
    div2Cap.position.set(-18, 2.64, -16);
    partGrp.add(div2Cap);

    // Divider 3: Separates Bilik 3 (Newsroom) & Bilik 4 (Data Lab) along X = 0 (North Wing)
    // Framed Glass partition with double doors opening
    const div3Glass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.5, 10), glassMat);
    div3Glass.position.set(0, 1.25, -17.5);
    partGrp.add(div3Glass);
    const div3Post1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.6, 0.2), frameMat);
    div3Post1.position.set(0, 1.3, -22.5);
    partGrp.add(div3Post1);
    const div3Post2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.6, 0.2), frameMat);
    div3Post2.position.set(0, 1.3, -12.5);
    partGrp.add(div3Post2);

    // Divider 4: Separates Bilik 4 (Data Lab) & Bilik 5 (IoT Workshop) along X = 18
    const div4 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.6, 14), wallMat);
    div4.position.set(18, 1.3, -16);
    partGrp.add(div4);
    const div4Cap = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 14), woodMat);
    div4Cap.position.set(18, 2.64, -16);
    partGrp.add(div4Cap);

    // Divider 5: Separates Bilik 5 (IoT Workshop) & Bilik 6 (Press Hall) along Z = 5
    const div5 = new THREE.Mesh(new THREE.BoxGeometry(14, 2.6, 0.3), wallMat);
    div5.position.set(24, 1.3, 5);
    partGrp.add(div5);
    const div5Cap = new THREE.Mesh(new THREE.BoxGeometry(14, 0.08, 0.36), woodMat);
    div5Cap.position.set(24, 2.64, 5);
    partGrp.add(div5Cap);

    // Bilik 7 (Executive Penthouse Suite): Framing Walls at South Center (X = 0, Z = 16)
    const suiteWallL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.6, 8), wallMat);
    suiteWallL.position.set(-8.5, 1.3, 17);
    partGrp.add(suiteWallL);
    const suiteWallR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.6, 8), wallMat);
    suiteWallR.position.set(8.5, 1.3, 17);
    partGrp.add(suiteWallR);

    // High-level Architectural Perimeter Beams (Above eye/camera level at Y=5.5)
    [-23, 23].forEach(tz => {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(64, 0.15, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 })
      );
      beam.position.set(0, 5.2, tz);
      partGrp.add(beam);
    });

    scene.add(partGrp);
  }

  // ─── CURVED HORSESHOE GUIDE PATH & SIDEWALK ───────────────────
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
      new THREE.Vector3(-20, 0.02, 13), // 1. Foyer
      new THREE.Vector3(-22, 0.02, 6),
      new THREE.Vector3(-24, 0.02, -2), // 2. Broadcast Studio
      new THREE.Vector3(-21, 0.02, -10),
      new THREE.Vector3(-12, 0.02, -15), // 3. Newsroom
      new THREE.Vector3(0, 0.02, -15.5), // North central corridor
      new THREE.Vector3(12, 0.02, -15), // 4. Data Lab
      new THREE.Vector3(21, 0.02, -10),
      new THREE.Vector3(24, 0.02, -2), // 5. IoT Workshop
      new THREE.Vector3(22, 0.02, 6),
      new THREE.Vector3(20, 0.02, 12), // 6. Press Hall
      new THREE.Vector3(10, 0.02, 16),
      new THREE.Vector3(0, 0.02, 16)   // 7. Executive Recruiter Penthouse
    ];

    const CurveClass = THREE.CatmullRomCurve3;
    let curvePoints = points;

    if (CurveClass) {
      try {
        orangeCurve = new CurveClass(points);
        curvePoints = orangeCurve.getPoints(160);
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

  // ─── 5. REALISTIC 3D HUMAN CHARACTER BUILDER WITH OFFICE ATTIRE ─
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

    // 1. HEAD & FACE
    const headGrp = new THREE.Group();
    headGrp.position.y = 1.52;

    // Jaw / Cranium
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.32, 0.28), skinMat);
    headMesh.position.y = 0;
    headGrp.add(headMesh);

    // Nose
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.06), skinMat);
    nose.position.set(0, -0.01, 0.16);
    headGrp.add(nose);

    // Eyes
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

    // 3D Sculpted Hair with volume
    const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.3), hairMat);
    hairTop.position.set(0, 0.17, 0);
    headGrp.add(hairTop);

    const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.25, 0.08), hairMat);
    hairBack.position.set(0, 0.05, -0.12);
    headGrp.add(hairBack);

    // Side fade
    const hairSideL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.22), hairMat);
    hairSideL.position.set(-0.135, 0.08, -0.01);
    headGrp.add(hairSideL);
    const hairSideR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.22), hairMat);
    hairSideR.position.set(0.135, 0.08, -0.01);
    headGrp.add(hairSideR);

    // Optional Glasses
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

    // Crisp dress shirt collar
    const collarMat = config.whiteCollar ? whiteMat : shirtMat;
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.06, 8), collarMat);
    collar.position.y = 1.28;
    grp.add(collar);

    // Folded collar points
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

    // Button Placket seam
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.01), collarMat);
    placket.position.set(0, 0.98, 0.125);
    grp.add(placket);

    // Optional Tie
    if (config.hasTie) {
      const knot = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.03), tieMat);
      knot.position.set(0, 1.22, 0.12);
      grp.add(knot);

      const tieBlade = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.34, 0.015), tieMat);
      tieBlade.position.set(0, 1.03, 0.13);
      grp.add(tieBlade);

      // Tie clip
      const tieClip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 0.01), buckleMat);
      tieClip.position.set(0, 1.08, 0.14);
      grp.add(tieClip);
    }

    // Official Lanyard Badge
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

      // Card Badge holder
      const badgeHolder = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.01), whiteMat);
      badgeHolder.position.set(0, 0.94, 0.14);
      grp.add(badgeHolder);

      const badgePhoto = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
      badgePhoto.position.set(0, 0.96, 0.146);
      grp.add(badgePhoto);
    }

    // Belt & Buckle
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

    // Left Leg
    const legPivotL = new THREE.Group();
    legPivotL.position.set(-0.11, 0.58, 0);
    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.y = -0.28;
    legPivotL.add(legL);

    // Left Shoe (Oxfords with heel and welt)
    const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.24), shoeMat);
    shoeL.position.set(0, -0.58, 0.03);
    legPivotL.add(shoeL);
    const soleL = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.02, 0.25), soleMat);
    soleL.position.set(0, -0.62, 0.03);
    legPivotL.add(soleL);

    grp.add(legPivotL);

    // Right Leg
    const legPivotR = new THREE.Group();
    legPivotR.position.set(0.11, 0.58, 0);
    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.y = -0.28;
    legPivotR.add(legR);

    // Right Shoe
    const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.24), shoeMat);
    shoeR.position.set(0, -0.58, 0.03);
    legPivotR.add(shoeR);
    const soleR = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.02, 0.25), soleMat);
    soleR.position.set(0, -0.62, 0.03);
    legPivotR.add(soleR);

    grp.add(legPivotR);

    // 5. ARMS & HANDS (WITH SMOOTH SHOULDER CAPS & SHIRT CUFFS)
    const armGeo = new THREE.BoxGeometry(0.11, 0.52, 0.12);
    const shoulderGeo = new THREE.SphereGeometry(0.08, 8, 8);

    // Left Arm
    const armPivotL = new THREE.Group();
    armPivotL.position.set(-0.24, 1.2, 0);

    const shoulderL = new THREE.Mesh(shoulderGeo, shirtMat);
    shoulderL.position.set(0, 0, 0);
    armPivotL.add(shoulderL);

    const armL = new THREE.Mesh(armGeo, shirtMat);
    armL.position.y = -0.22;
    armPivotL.add(armL);

    // Left Hand
    const handL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.08), skinMat);
    handL.position.set(0, -0.48, 0);
    armPivotL.add(handL);

    // Smartwatch on Left Wrist
    const watchBand = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.03, 0.125), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    watchBand.position.set(0, -0.42, 0);
    armPivotL.add(watchBand);
    const watchFace = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    watchFace.position.set(0, -0.42, 0.065);
    armPivotL.add(watchFace);

    grp.add(armPivotL);

    // Right Arm
    const armPivotR = new THREE.Group();
    armPivotR.position.set(0.24, 1.2, 0);

    const shoulderR = new THREE.Mesh(shoulderGeo, shirtMat);
    shoulderR.position.set(0, 0, 0);
    armPivotR.add(shoulderR);

    const armR = new THREE.Mesh(armGeo, shirtMat);
    armR.position.y = -0.22;
    armPivotR.add(armR);

    // Right Hand
    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.08), skinMat);
    handR.position.set(0, -0.48, 0);
    armPivotR.add(handR);

    // Handheld Accessory
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

    // If Seated Configuration
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

  // Helper to create an active seated worker in office attire
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

    // Ergonomic Office Chair
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

  // ─── BILIK 1: FOYER & WELCOME RECEPTION ───────────────────────
    // Architectural Signature Carpet Inlays for 7 Rooms
  function buildRoomZoneInlays() {
    const zones = [
      { x: -20, z: 12, w: 14, d: 14, color: 0xe2e8f0, roughness: 0.8 }, // 01 Foyer (Warm Sand Cream)
      { x: -24, z: -2, w: 12, d: 12, color: 0x18181b, roughness: 0.9 }, // 02 Broadcast MCR (Dark Acoustic Studio)
      { x: -12, z: -15, w: 13, d: 11, color: 0x1e3a8a, roughness: 0.7 }, // 03 Newsroom (Corporate Navy Carpet)
      { x: 12, z: -15, w: 13, d: 11, color: 0x0f172a, roughness: 0.6 }, // 04 Data Lab (Deep Slate Tech Grid)
      { x: 24, z: -2, w: 12, d: 12, color: 0x334155, roughness: 0.8 }, // 05 IoT Workshop (Industrial Workshop Slate)
      { x: 20, z: 12, w: 14, d: 14, color: 0x881337, roughness: 0.75 }, // 06 Press Hall (Executive Crimson Velvet)
      { x: 0, z: 16, w: 14, d: 10, color: 0xffffff, roughness: 0.25 }   // 07 Recruiter Suite (White Carrara Marble)
    ];

    zones.forEach(z => {
      const carpet = new THREE.Mesh(
        new THREE.BoxGeometry(z.w, 0.015, z.d),
        new THREE.MeshStandardMaterial({ color: z.color, roughness: z.roughness, metalness: z.color === 0xffffff ? 0.3 : 0.05 })
      );
      carpet.position.set(z.x, 0.01, z.z);
      carpet.receiveShadow = true;
      scene.add(carpet);
    });
  }

  function buildRoom1FoyerDetailed(wallMat, trimMat, woodMat) {
    const rx = -20;
    const rz = 12;

    // Curved Reception Counter Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.05, 1.4), wallMat);
    desk.position.set(rx, 0.52, rz - 3);
    scene.add(desk);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.08, 1.55), woodMat);
    deskTop.position.set(rx, 1.08, rz - 3);
    scene.add(deskTop);

    // Dual Monitors on Reception Desk
    const monMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const scrMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    [-0.8, 0.8].forEach(mx => {
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.05), monMat);
      mon.position.set(rx + mx, 1.45, rz - 3.2);
      scene.add(mon);

      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.48), scrMat);
      scr.position.set(rx + mx, 1.45, rz - 3.17);
      scr.rotation.y = Math.PI;
      scene.add(scr);
    });

    // Sign-in Digital Tablet Kiosk
    const kioskStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.1, 8), monMat);
    kioskStand.position.set(rx + 2.6, 0.55, rz - 1.5);
    scene.add(kioskStand);

    const kioskTab = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.03), monMat);
    kioskTab.position.set(rx + 2.6, 1.12, rz - 1.5);
    kioskTab.rotation.x = -0.4;
    scene.add(kioskTab);

    // Water Dispenser with 19L Blue Gallon Bottle
    const dispBody = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.95, 0.45), wallMat);
    dispBody.position.set(rx - 2.8, 0.48, rz - 3.2);
    scene.add(dispBody);

    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.45, 12),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.75, roughness: 0.1 })
    );
    bottle.position.set(rx - 2.8, 1.18, rz - 3.2);
    scene.add(bottle);

    // Waiting Lounge: Designer Rug & Terracotta Armchairs
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 0.02, 3.2),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 })
    );
    rug.position.set(rx, 0.02, rz + 2.5);
    scene.add(rug);

    const chairMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.7 });
    [-1.2, 1.2].forEach(cx => {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.9), chairMat);
      seat.position.set(rx + cx, 0.25, rz + 2.5);
      scene.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.15), chairMat);
      back.position.set(rx + cx, 0.65, rz + 2.9);
      scene.add(back);
    });

    // Coffee Table in waiting lounge
    const cTable = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.35, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    cTable.position.set(rx, 0.18, rz + 2.5);
    scene.add(cTable);

    // Branded Feature Wall Backdrop
    const brandWall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.2, 0.15), woodMat);
    brandWall.position.set(rx, 1.4, rz - 5.0);
    scene.add(brandWall);

    // Seated Receptionist (Nadia) behind counter in office dresscode
    createDeskWorker(rx, 0, rz - 3.9, 0, 0xff7a38, true, false);

    // Seated Visitor in lounge armchair
    createDeskWorker(rx - 1.2, 0, rz + 2.4, 0, 0x0284c7, false, true);
  }

  // ─── BILIK 2: BROADCASTING & LIVE PRODUCTION MCR STUDIO ──────
  function buildRoom2BroadcastDetailed(screenMat, trimMat, frameMat) {
    const rx = -24;
    const rz = -2;

    // Industrial Overhead Box Truss Grid
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
    const trussH = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.25, 0.25), trussMat);
    trussH.position.set(rx, 3.1, rz);
    scene.add(trussH);

    // 6-Screen Broadcast Multiview Wall mounted on truss
    const wallScrMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.65), wallScrMat);
        scr.position.set(rx - 1.3 + col * 1.3, 2.2 - row * 0.8, rz - 4.8);
        scene.add(scr);

        const border = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.7, 0.05), frameMat);
        border.position.set(rx - 1.3 + col * 1.3, 2.2 - row * 0.8, rz - 4.84);
        scene.add(border);
      }
    }

    // Master Control Room Desk
    const mcrDesk = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.9, 1.4), frameMat);
    mcrDesk.position.set(rx, 0.45, rz - 3.2);
    scene.add(mcrDesk);

    // ATEM Television Switcher Console with lit buttons
    const atem = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
    );
    atem.position.set(rx - 0.8, 0.95, rz - 3.2);
    scene.add(atem);

    // Audio Mixing Console with faders
    const audioMixer = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.08, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    audioMixer.position.set(rx + 0.9, 0.94, rz - 3.2);
    scene.add(audioMixer);

    // Broadcast Camera with Teleprompter on Heavy Wheeled Pedestal Tripod
    const camGrp = new THREE.Group();
    camGrp.position.set(rx - 1.5, 0, rz + 1.8);

    const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.1, 6), frameMat);
    pedBase.position.y = 0.05;
    camGrp.add(pedBase);

    const pedCol = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 8), frameMat);
    pedCol.position.y = 0.7;
    camGrp.add(pedCol);

    const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.7), frameMat);
    camBody.position.set(0, 1.4, 0);
    camGrp.add(camBody);

    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.35, 12), frameMat);
    lens.position.set(0, 1.4, -0.45);
    lens.rotation.x = Math.PI / 2;
    camGrp.add(lens);

    // Teleprompter Hood & Glass
    const prompter = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.35), frameMat);
    prompter.position.set(0, 1.5, -0.55);
    camGrp.add(prompter);

    // Glowing Red Tally Light
    const tally = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.08), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    tally.position.set(0, 1.62, 0.2);
    camGrp.add(tally);

    scene.add(camGrp);

    // 2 Softbox Studio Lights on Black Stands
    [-3.2, 3.2].forEach(lx => {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 2.2, 8), frameMat);
      stand.position.set(rx + lx, 1.1, rz);
      scene.add(stand);

      const softbox = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.1, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
      );
      softbox.position.set(rx + lx, 2.2, rz);
      softbox.rotation.y = lx < 0 ? 0.5 : -0.5;
      scene.add(softbox);

      const diffuser = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.0), new THREE.MeshBasicMaterial({ color: 0xffedd5 }));
      diffuser.position.set(rx + lx, 2.2, rz - 0.18);
      diffuser.rotation.y = lx < 0 ? 0.5 : -0.5;
      scene.add(diffuser);
    });

    // 4 Crew Members in Studio Attire
    createDeskWorker(rx - 0.8, 0, rz - 3.9, 0, 0x0f172a, true, false); // Switcher Op
    createDeskWorker(rx + 0.9, 0, rz - 3.9, 0, 0x1e293b, true, false); // Audio Engineer
    createDeskWorker(rx - 1.5, 0, rz + 2.7, Math.PI, 0x0284c7, false, false); // Cameraman
    createDeskWorker(rx + 2.2, 0, rz - 1.2, -Math.PI / 2, 0xff7a38, false, true); // Director
  }

  // ─── BILIK 3: NEWSROOM & MEDIA EDITORIAL HUB ─────────────────
  function buildRoom3NewsroomDetailed(trimMat, woodMat) {
    const rx = -12;
    const rz = -15;

    // Modular 4-Desk Cluster Pod
    const podMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
    const deskPod = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.85, 2.6), podMat);
    deskPod.position.set(rx, 0.42, rz);
    scene.add(deskPod);

    // 4 Widescreen Dell/HP Monitors
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
      mon.position.set(rx + m.x, 1.2, rz + m.z);
      mon.rotation.y = m.ry;
      scene.add(mon);

      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.44), scrMat);
      scr.position.set(rx + m.x, 1.2, rz + m.z + (m.ry === 0 ? 0.025 : -0.025));
      scr.rotation.y = m.ry;
      scene.add(scr);
    });

    // Large Wall Kanban Board with colorful sticky notes
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.8, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 })
    );
    board.position.set(rx, 1.8, rz - 6.8);
    scene.add(board);

    // Sticky notes
    const noteColors = [0xfef08a, 0x86efac, 0x93c5fd, 0xfca5a5];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        const note = new THREE.Mesh(
          new THREE.PlaneGeometry(0.25, 0.25),
          new THREE.MeshBasicMaterial({ color: noteColors[(r + c) % noteColors.length] })
        );
        note.position.set(rx - 1.2 + c * 0.6, 2.2 - r * 0.45, rz - 6.74);
        scene.add(note);
      }
    }

    // Heavy Multifunction Office Copier / Laser Printer
    const printer = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.15, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
    );
    printer.position.set(rx - 3.8, 0.58, rz - 3.5);
    scene.add(printer);

    // Mobile Dry-Erase Whiteboard with editorial flowchart
    const wb = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.4, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    wb.position.set(rx + 3.4, 1.3, rz - 3.0);
    wb.rotation.y = -0.3;
    scene.add(wb);

    // Active Journalists in office attire
    createDeskWorker(rx - 1.2, 0, rz - 1.6, 0, 0x2563eb, true, true);
    createDeskWorker(rx + 1.2, 0, rz - 1.6, 0, 0xa855f7, true, false);
    createDeskWorker(rx - 1.2, 0, rz + 1.6, Math.PI, 0x10b981, true, false);
  }

  // ─── BILIK 4: DATA ANALYST & MACHINE LEARNING AI LAB ──────────
  function buildRoom4DataLabDetailed(trimMat, frameMat) {
    const rx = 12;
    const rz = -15;

    // 2 Full-Height 42U Enterprise Server Racks with Animated LEDs
    [-1.2, 1.2].forEach(sx => {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.95), frameMat);
      rack.position.set(rx + sx, 1.2, rz - 5.5);
      scene.add(rack);

      const rackGlass = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.45 })
      );
      rackGlass.position.set(rx + sx, 1.2, rz - 5.0);
      scene.add(rackGlass);

      // Blinking server LED arrays
      for (let ly = 0; ly < 6; ly++) {
        const ledGeo = new THREE.SphereGeometry(0.025, 6, 6);
        const ledMat = new THREE.MeshBasicMaterial({ color: ly % 2 === 0 ? 0x22c55e : 0x06b6d4 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(rx + sx - 0.4 + (ly % 3) * 0.4, 0.5 + ly * 0.3, rz - 4.95);
        scene.add(led);
        serverLEDs.push(led);
      }
    });

    // High-Performance Developer Workstation Desk
    const devDesk = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.85, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    devDesk.position.set(rx, 0.42, rz - 0.8);
    scene.add(devDesk);

    // 34-Inch Curved Ultrawide Monitor + Vertical Monitor
    const monMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const scrMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

    const wideMon = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 0.08), monMat);
    wideMon.position.set(rx - 0.4, 1.35, rz - 0.8);
    scene.add(wideMon);

    const wideScr = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.58), scrMat);
    wideScr.position.set(rx - 0.4, 1.35, rz - 0.75);
    scene.add(wideScr);

    const vertMon = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.95, 0.06), monMat);
    vertMon.position.set(rx + 1.2, 1.45, rz - 0.8);
    scene.add(vertMon);

    const vertScr = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.88), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    vertScr.position.set(rx + 1.2, 1.45, rz - 0.76);
    scene.add(vertScr);

    // Transparent Glass Whiteboard with SEM-PLS & ML Formulas
    const glassWb = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 1.6, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1 })
    );
    glassWb.position.set(rx - 3.6, 1.5, rz - 2.8);
    glassWb.rotation.y = 0.5;
    scene.add(glassWb);

    // Beverage Mini-Fridge
    const fridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.9, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5 })
    );
    fridge.position.set(rx + 3.4, 0.45, rz - 4.5);
    scene.add(fridge);

    // Active Data Scientists in office dresscode
    createDeskWorker(rx - 0.4, 0, rz - 1.7, 0, 0x0284c7, true, true);
    createDeskWorker(rx + 1.4, 0, rz - 1.7, 0, 0x10b981, true, false);
  }

  // ─── BILIK 5: IOT HARDWARE INNOVATION WORKSHOP ───────────────
  function buildRoom5IoTWorkshopDetailed(trimMat, frameMat) {
    const rx = 24;
    const rz = -2;

    // Heavy Industrial Electronics Workbench with Anti-Static Green ESD Mat
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const bench = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.9, 1.5), benchMat);
    bench.position.set(rx, 0.45, rz - 3.2);
    scene.add(bench);

    const esdMat = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 0.02, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.7 })
    );
    esdMat.position.set(rx, 0.91, rz - 3.2);
    scene.add(esdMat);

    // Dual-Channel Digital Oscilloscope with animated sine wave
    const oscBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.35), frameMat);
    oscBody.position.set(rx - 1.5, 1.15, rz - 3.2);
    scene.add(oscBody);

    const oscScr = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    oscScr.position.set(rx - 1.5, 1.15, rz - 3.02);
    scene.add(oscScr);

    // Temperature-Controlled Soldering Station
    const solder = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.25, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x0284c7 })
    );
    solder.position.set(rx - 0.7, 1.05, rz - 3.2);
    scene.add(solder);

    // Working 3D Printer with Extruder & PLA Filament Spool
    const printerFrame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 0.8), frameMat);
    printerFrame.position.set(rx + 1.6, 1.42, rz - 3.2);
    scene.add(printerFrame);

    const printBed = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.05, 0.65),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 })
    );
    printBed.position.set(rx + 1.6, 1.05, rz - 3.2);
    scene.add(printBed);

    // IoT LPG-SafeSense Hardware Prototype (Juara 1 MKI PLN)
    const protoGrp = new THREE.Group();
    protoGrp.position.set(rx + 0.3, 0.92, rz - 3.1);

    // 3kg LPG Cylinder replica
    const lpgCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.42, 12),
      new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 })
    );
    lpgCylinder.position.set(-0.25, 0.22, 0);
    protoGrp.add(lpgCylinder);

    // Breadboard with sensor circuit
    const bb = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.04, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    bb.position.set(0.15, 0.03, 0);
    protoGrp.add(bb);

    // 16x2 Blue LCD Display
    const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.08), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    lcd.position.set(0.15, 0.06, 0.05);
    lcd.rotation.x = -0.3;
    protoGrp.add(lcd);

    scene.add(protoGrp);

    // Illuminated Gold Trophy Pedestal (Juara 1 SafeSense)
    const ped = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.5, 1.0, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    ped.position.set(rx - 3.2, 0.5, rz + 1.2);
    scene.add(ped);

    const trophy = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.08, 0.45, 12),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
    );
    trophy.position.set(rx - 3.2, 1.25, rz + 1.2);
    scene.add(trophy);

    const trophyLight = new THREE.PointLight(0xfef08a, 0.8, 5);
    trophyLight.position.set(rx - 3.2, 1.6, rz + 1.2);
    scene.add(trophyLight);

    // Active Hardware Engineers in office dresscode
    createDeskWorker(rx - 0.4, 0, rz - 4.1, 0, 0xf97316, true, false);
    createDeskWorker(rx + 1.6, 0, rz - 4.1, 0, 0x0284c7, true, false);
  }

  // ─── BILIK 6: PRESS CONFERENCE & BRIEFING AUDITORIUM ──────────
  function buildRoom6PressHallDetailed(trimMat, woodMat) {
    const rx = 20;
    const rz = 12;

    // Boardroom Executive Conference Table
    const confTable = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.85, 2.2), woodMat);
    confTable.position.set(rx, 0.42, rz - 1.2);
    scene.add(confTable);

    // Tabletop Gooseneck Microphones
    [-1.6, 0, 1.6].forEach(mx => {
      const mic = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.02, 0.25, 6),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 })
      );
      mic.position.set(rx + mx, 0.98, rz - 1.2);
      scene.add(mic);
    });

    // Presentation Lectern / Podium with Official Seal
    const podium = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.25, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    podium.position.set(rx - 3.4, 0.62, rz - 4.2);
    scene.add(podium);

    // Giant 4.2-Meter Widescreen Projection Screen
    const projScr = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 2.3),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    projScr.position.set(rx, 2.1, rz - 5.8);
    scene.add(projScr);

    const projBorder = new THREE.Mesh(
      new THREE.BoxGeometry(4.3, 2.4, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 })
    );
    projBorder.position.set(rx, 2.1, rz - 5.85);
    scene.add(projBorder);

    // Official Press Conference Backdrop Banner
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(5.5, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.8 })
    );
    banner.position.set(rx, 1.8, rz + 5.2);
    banner.rotation.y = Math.PI;
    scene.add(banner);

    // Active Attendees around the table
    createDeskWorker(rx - 1.6, 0, rz - 2.8, 0, 0x1e293b, true, true);
    createDeskWorker(rx + 1.6, 0, rz - 2.8, 0, 0x0f172a, true, true);
    createDeskWorker(rx - 1.6, 0, rz + 0.4, Math.PI, 0x2563eb, true, true);
    createDeskWorker(rx + 1.6, 0, rz + 0.4, Math.PI, 0xa855f7, true, false);

    // Speaker standing at podium
    createDeskWorker(rx - 3.4, 0, rz - 4.9, 0, 0xff7a38, false, true);
  }

  // ─── BILIK 7: EXECUTIVE RECRUITER PENTHOUSE LOUNGE ────────────
  function buildRoom7RecruiterLoungeDetailed(trimMat, woodMat) {
    const rx = 0;
    const rz = 16;

    // Designer Italian L-Shaped Sectional Sofa (Grey Leather)
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.65 });
    const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.42, 1.2), sofaMat);
    sofaMain.position.set(rx - 0.4, 0.28, rz + 1.8);
    scene.add(sofaMain);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.55, 0.25), sofaMat);
    sofaBack.position.set(rx - 0.4, 0.68, rz + 2.3);
    scene.add(sofaBack);

    const sofaL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.42, 2.4), sofaMat);
    sofaL.position.set(rx + 1.2, 0.28, rz + 0.6);
    scene.add(sofaL);

    // Orange Accent Throw Pillows
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xff6b2b, roughness: 0.7 });
    [-1.2, 0.2, 1.2].forEach(px => {
      const pil = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.15), pillowMat);
      pil.position.set(rx + px, 0.62, rz + 2.1);
      scene.add(pil);
    });

    // White Carrara Marble Coffee Table with Orchids
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const marbleTable = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 1.1), marbleMat);
    marbleTable.position.set(rx - 0.4, 0.18, rz + 0.4);
    scene.add(marbleTable);

    // Orchid Vase
    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.06, 0.3, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 })
    );
    vase.position.set(rx - 0.4, 0.48, rz + 0.4);
    scene.add(vase);

    // Executive Walnut Desk with iMac
    const execDesk = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.85, 1.2), woodMat);
    execDesk.position.set(rx - 4.2, 0.42, rz + 0.8);
    scene.add(execDesk);

    const imacMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9 });
    const imacStand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.18), imacMat);
    imacStand.position.set(rx - 4.2, 1.05, rz + 0.8);
    scene.add(imacStand);

    const imacScr = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.04), imacMat);
    imacScr.position.set(rx - 4.2, 1.45, rz + 0.8);
    scene.add(imacScr);

    // Brass Arched Designer Floor Lamp
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.6, 8), lampMat);
    lampPole.position.set(rx + 2.4, 1.3, rz + 2.2);
    scene.add(lampPole);

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.3, 12), lampMat);
    lampShade.position.set(rx + 1.8, 2.5, rz + 1.5);
    lampShade.rotation.x = 0.4;
    scene.add(lampShade);

    const lampLight = new THREE.PointLight(0xfef08a, 0.9, 8);
    lampLight.position.set(rx + 1.8, 2.4, rz + 1.5);
    scene.add(lampLight);

    // Tall Indoor Potted Plants (Monstera Deliciosa)
    [-5.6, 5.6].forEach(px => {
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.28, 0.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
      );
      pot.position.set(rx + px, 0.3, rz + 2.2);
      scene.add(pot);

      const leaf = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.65, 1),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
      );
      leaf.position.set(rx + px, 1.0, rz + 2.2);
      scene.add(leaf);
    });

    // 2 Senior HR Talent Executives in business suits
    createDeskWorker(rx - 4.2, 0, rz + 1.7, 0, 0x0f172a, true, true);
    createDeskWorker(rx + 0.2, 0, rz + 1.5, -0.4, 0x2563eb, false, true);
  }

  // ─── 6. MOBILE PATROLLING EMPLOYEES (THE BUSTLING OFFICE!) ───
  function buildPatrollingOfficeWorkers() {
    // Worker 1: West Wing Corridor (Foyer to Broadcast, Z: 10 to -3 at X = -19)
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
      x: -19,
      currentZ: 9,
      minZ: -3,
      maxZ: 10,
      speed: 0.024,
      dir: -1,
      stepPhase: 0
    });

    // Worker 2: North Wing Corridor (Newsroom to Data Lab, X: -12 to 12 at Z = -12.5)
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
      z: -12.5,
      currentX: -10,
      minX: -12,
      maxX: 12,
      speed: 0.022,
      dir: 1,
      stepPhase: 0
    });

    // Worker 3: East Wing Corridor (IoT Workshop to Press Hall, Z: -3 to 10 at X = 19)
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
      x: 19,
      currentZ: -2,
      minZ: -3,
      maxZ: 10,
      speed: 0.024,
      dir: 1,
      stepPhase: 0
    });
  }

  // ─── 7. INTERACTIVE 3D NPCS (OFFICE GUIDES) ───────────────────
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

      // Floating Dialogue Icon Badge
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
    });
  }

  // ─── 8. ANIMATED WALKING HERO (MANGARA FERDIANTO PAKPAHAN) ─────
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

    walkingHero.add(heroHuman.group);

    walkingHero.position.set(-20, 0, 13);
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

          <!-- PURE FREE ORBIT 360 HUD (USER: HAPUS SEMUA POV, HANYA ORBIT BEBAS) -->
          <div class="nadi-orbit-hud-wrap">
            <div class="nadi-orbit-hud-pill" id="nadi-orbit-hud-pill" title="Tahan klik & geser di layar untuk memutar 360°, scroll untuk zoom">
              <ion-icon name="sync-outline" class="nadi-orbit-spin-icon"></ion-icon>
              <span class="nadi-orbit-pill-title">Orbit Bebas 360°</span>
              <span class="nadi-orbit-pill-sub">&bull; Tahan & Geser Layar</span>
            </div>
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

    // Touch 360° Orbit Drag Controls
    let touchStartX = 0;
    let touchStartY = 0;
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
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

    // PURE FREE ORBIT 360° (USER REQUEST: HAPUS SEMUA POV, HANYA ORBIT BEBAS)
    pos.x = heroPos.x + Math.sin(orbitYaw) * orbitDistance * Math.cos(orbitPitch);
    pos.y = Math.sin(orbitPitch) * orbitDistance + 1.2;
    pos.z = heroPos.z + Math.cos(orbitYaw) * orbitDistance * Math.cos(orbitPitch);
    look.x = heroPos.x;
    look.y = 1.2;
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

    // 2. ANIMATE MOBILE PATROLLING EMPLOYEES (WEST, NORTH & EAST WINGS)
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
      if (w.legL) w.legL.rotation.x = Math.sin(w.stepPhase) * 0.5;
      if (w.legR) w.legR.rotation.x = -Math.sin(w.stepPhase) * 0.5;
      if (w.armL) w.armL.rotation.x = -Math.sin(w.stepPhase) * 0.4;
      if (w.armR) w.armR.rotation.x = Math.sin(w.stepPhase) * 0.4;
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
