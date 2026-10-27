/**
 * gallery-3d-experience.js
 * 3D Scrollytelling Camera Flight & Interactive Miniature Studio
 * Inspired by "nadi." Healthcare Diorama Experience
 * - Smooth scroll-driven camera flight along an architectural miniature studio
 * - Animated walking hero character physically traversing the orange path across rooms
 * - Left editorial text with soft backdrop gradient for crystal-clear readability
 * - Rich, comprehensive explanations for each specialization
 * - 100% Self-contained within the 3D scene (no bottom 2D site needed)
 * - In-3D Full Archive & CV modal for complete 50+ projects & certifications
 */

import { DEFAULT_DATA } from './default-data.js';

(function () {
  'use strict';

  // ─── 1. GLOBAL STATE & THREE.JS REFERENCES ────────────────────
  let scene, camera, renderer;
  let canvas, stickyViewport, scrollyTrack;
  let animFrameId = null;
  let textureLoader = null;

  // Walking Hero Character references
  let walkingHero = null;
  let legPivotL = null;
  let legPivotR = null;
  let armPivotL = null;
  let armPivotR = null;
  let orangeCurve = null;
  let walkStepPhase = 0;
  let lastProgress = 0;

  // Camera flight interpolation vectors
  let currentCamPos = null;
  let currentLookAt = null;
  let tempTargetPos = null;
  let tempTargetLook = null;

  let targetProgress = 0;
  let currentProgress = 0;
  let currentStepIndex = 0;

  // ─── 2. ENRICHED SCROLLYTELLING STEP DEFINITIONS ───────────────
  const SCROLL_STEPS = [
    {
      stepNum: "01",
      stepName: "Profil",
      category: "LANGKAH 01 • PROFIL & KUALIFIKASI PROFESIONAL",
      title: "Kreativitas Bertemu Rekayasa Data & Komunikasi Publik.",
      desc: "Mahasiswa S1 Teknik Informatika Institut Teknologi PLN dengan keahlian multidisipliner yang memadukan perancangan identitas visual korporat, produksi siaran langsung nasional, pengelolaan kanal komunikasi digital resmi, serta riset dan analitik data empiris.\n\nMemiliki dedikasi tinggi dalam mengintegrasikan teknologi informasi modern dengan komunikasi visual berdampak untuk memecahkan tantangan korporat dan publik secara terukur.",
      badgeStatus: "Tersedia untuk Kerja & Magang",
      badgeStatusColor: "green",
      cardTitle: "Profil & Ringkasan Kualifikasi",
      items: [
        { label: "Pendidikan", val: "S1 Teknik Informatika ITPLN (Aktif)" },
        { label: "Spesialisasi 1", val: "Data Analyst & Machine Learning" },
        { label: "Spesialisasi 2", val: "Social Media Specialist & Humas" },
        { label: "Spesialisasi 3", val: "Creative Director & Live Production" },
        { label: "Domisili & Status", val: "Jakarta • Terbuka Kerja Penuh & Magang" }
      ],
      actions: [
        { label: "Unduh CV Data Analyst (PDF)", url: "./CV_Mangara_Pakpahan_Data_Analyst.pdf", primary: true },
        { label: "Unduh CV Sosmed & Humas (PDF)", url: "./CV_Mangara_Pakpahan_Sosmed_Humas.pdf", primary: false }
      ],
      cam: { x: -20, y: 8.6, z: 12.8 },
      look: { x: -20, y: 1.2, z: 0 }
    },
    {
      stepNum: "02",
      stepName: "Siaran Langsung",
      category: "LANGKAH 02 • LIVE PRODUCTION & PENYIARAN NASIONAL",
      title: "Komando Penuh Produksi Siaran Langsung Skala Nasional.",
      desc: "Berpengalaman memimpin tim teknis dan alur penyiaran multi-kamera (multi-camera live streaming) untuk acara protokoler berpenonton ribuan orang, baik luring di auditorium maupun daring via YouTube Live.\n\nBertanggung jawab penuh atas visual switcher, audio mixing balance, sinkronisasi kamera studio SDI/NDI, timing countdown siaran, dan integrasi lower-thirds grafis berstandar penyiaran TV profesional tanpa jeda kendala.",
      badgeStatus: "Produksi Siaran Sukses 100%",
      badgeStatusColor: "orange",
      cardTitle: "Portofolio Penyiaran Utama (2024–2025)",
      items: [
        { label: "Wisuda ke-46 ITPLN", val: "Lead Live Switcher (Auditorium & YouTube)" },
        { label: "Studium Generale Nuklir", val: "Sutradara Penyiaran & Multi-Kamera" },
        { label: "Kontrak Kerja PLN", val: "Transmisi Live Stream & LED Wall" },
        { label: "Seleksi Beasiswa APERTI BUMN", val: "Operator Visual Switcher & Audio Mixer" },
        { label: "Dies Natalis & Wisuda 44", val: "Koordinator Tim Dokumentasi & Siaran" }
      ],
      actions: [
        { label: "Buka Arsip Video & Proyek", action: "openArchive", primary: true },
        { label: "Diskusi Produksi Siaran", url: "https://wa.me/6281318816058?text=Halo%20Mangara,%20kami%20tertarik%20dengan%20keahlian%20Live%20Production%20Anda.", primary: false }
      ],
      cam: { x: -12, y: 8.2, z: 12.0 },
      look: { x: -12, y: 1.4, z: 0 }
    },
    {
      stepNum: "03",
      stepName: "Sosmed & Humas",
      category: "LANGKAH 03 • MEDIA SOSIAL, HUMAS & REDAKSI PUBLIK",
      title: "Strategi Konten Berdampak & Pertumbuhan Engagement 3x Lipat.",
      desc: "Mengelola kanal komunikasi resmi kampus dan organisasi tingkat nasional: @itpln, @vokasiitpln, @itplnmedia, serta @smartgridindonesia (PJCI). Menerapkan strategi visual modern dan editorial copywriting terarah yang sukses meningkatkan engagement rate hingga 300%.\n\nMemimpin redaksi publikasi web berita resmi pjci.or.id, menulis laporan jurnalisme korporat, serta menjadi Koordinator Tim Kreatif Video Company Profile ITPLN Media.",
      badgeStatus: "Engagement Tumbuh 300%",
      badgeStatusColor: "orange",
      cardTitle: "Kanal & Tanggung Jawab Redaksi",
      items: [
        { label: "@itpln (Kampus Energi)", val: "Engagement Melonjak 3x Lipat" },
        { label: "@smartgridindonesia", val: "PJCI Media & Liputan Nasional" },
        { label: "Portal Web pjci.or.id", val: "Redaktur & Penulis Berita Resmi" },
        { label: "ITPLN Media", val: "Koordinator Kreatif Company Profile" },
        { label: "Humas ITPLN (BHMS)", val: "Komunikasi Publik & Protokoler" }
      ],
      actions: [
        { label: "Kunjungi Instagram @itpln", url: "https://instagram.com/itpln", primary: true },
        { label: "Unduh CV Sosmed & Humas", url: "./CV_Mangara_Pakpahan_Sosmed_Humas.pdf", primary: false }
      ],
      cam: { x: -4, y: 8.2, z: 12.2 },
      look: { x: -4, y: 1.3, z: 0 }
    },
    {
      stepNum: "04",
      stepName: "Data & AI",
      category: "LANGKAH 04 • DATA SCIENCE, ANALITIK & MACHINE LEARNING",
      title: "Analitik Data Kuantitatif, Machine Learning & Pemodelan Empiris.",
      desc: "Menguasai analisis data empiris dengan metodologi ilmiah teruji: Structural Equation Modeling (SEM-PLS 120 JP di PT Educativa) untuk path analysis variabel mediasi-moderasi, serta sertifikasi resmi Microsoft Azure Databricks Machine Learning (8 modul) untuk AutoML, Hyperparameter Tuning, dan Apache Spark di cloud.\n\nBerkompeten dalam Python, SQL, automasi spreadsheet pemodelan bisnis MOS Excel 2019, serta aktif sebagai Student Ambassador DQLab.",
      badgeStatus: "Tersertifikasi Resmi Internasional",
      badgeStatusColor: "green",
      cardTitle: "Sertifikasi & Lisensi Resmi",
      items: [
        { label: "Microsoft Azure Databricks", val: "Machine Learning (8 Modul Resmi)" },
        { label: "SEM-PLS Riset Kuantitatif", val: "PT Educativa Cipta (120 JP)" },
        { label: "MOS Excel 2019", val: "Microsoft Office Specialist Resmi" },
        { label: "DQLab Ambassador", val: "Data Science, Python & SQL Track" },
        { label: "IBM Artificial Intelligence", val: "Building AI Agents & Solutions" }
      ],
      actions: [
        { label: "Unduh CV Data Analyst (ATS)", url: "./CV_Mangara_Pakpahan_Data_Analyst.pdf", primary: true },
        { label: "Lihat Sertifikat Lengkap", action: "openArchive", primary: false }
      ],
      cam: { x: 4, y: 8.2, z: 12.0 },
      look: { x: 4, y: 1.3, z: 0 }
    },
    {
      stepNum: "05",
      stepName: "Inovasi IoT",
      category: "LANGKAH 05 • REKAYASA IOT, RISET & PRESTASI NASIONAL",
      title: "Inovasi IoT LPG-SafeSense, Juara 1 MKI & Hibah PKM DIKTI.",
      desc: "Merancang dan merekayasa inovasi perangkat keras pintar IoT LPG-SafeSense: integrasi mikrokontroler sensor gas MQ-6, sensor beban load-cell berat sisa gas, serta modul cloud WiFi Firebase yang tersinkronisasi ke aplikasi mobile secara real-time.\n\nMeraih Juara 1 Lomba Inovasi Nasional MKI & ITPLN, penerima pendanaan hibah riset Kemendikbudristek PKM DIKTI Level 1, Juara 1 Desain Poster Nasional IPB University, dan memimpin National CAD Competition (NCC 2025) sebagai Ketua Pelaksana.",
      badgeStatus: "Juara 1 Inovasi Nasional",
      badgeStatusColor: "orange",
      cardTitle: "Pencapaian Riset & Penghargaan",
      items: [
        { label: "IoT LPG-SafeSense", val: "Juara 1 Inovasi MKI & ITPLN" },
        { label: "Hibah Riset PKM Level 1", val: "Kemendikbudristek / DIKTI" },
        { label: "Desain Poster Nasional", val: "Juara 1 IPB Ocean Day 2024" },
        { label: "National CAD Competition", val: "Ketua Pelaksana Nasional (NCC 2025)" },
        { label: "Student Ambassador", val: "Badan Pengelola Akademik (BPA)" }
      ],
      actions: [
        { label: "Buka Dokumen Inovasi & Riset", action: "openArchive", primary: true },
        { label: "Diskusi Kolaborasi Riset", url: "https://wa.me/6281318816058?text=Halo%20Mangara,%20kami%20tertarik%20dengan%20riset%20IoT%20SafeSense%20Anda.", primary: false }
      ],
      cam: { x: 12, y: 8.2, z: 12.0 },
      look: { x: 12, y: 1.3, z: 0 }
    },
    {
      stepNum: "06",
      stepName: "Rekrutmen",
      category: "LANGKAH 06 • PUSAT REKRUTMEN & KONSULTASI RESMI",
      title: "Siap Berkolaborasi & Mengakselerasi Proyek Korporat Anda.",
      desc: "Terbuka untuk posisi Data Analyst, Social Media Specialist & Corporate Communications, Creative Director, serta pimpinan teknis Live Production skala profesional di Jakarta maupun penugasan hybrid/remote.\n\nSeluruh berkas CV format ATS resmi, portofolio proyek, sertifikasi internasional, dan kontak langsung telah dipusatkan di sini untuk mempermudah penilaian rekruter dan HRD.",
      badgeStatus: "Respons Cepat & Siap Onboarding",
      badgeStatusColor: "green",
      cardTitle: "Akses Komunikasi & Dokumen",
      items: [
        { label: "WhatsApp Resmi", val: "0813-1881-6058 (Respons Cepat)" },
        { label: "Email Korporat", val: "mangarapakpahan51@gmail.com" },
        { label: "LinkedIn Profil", val: "in/mangara-ferdianto-pakpahan" },
        { label: "GitHub Portofolio", val: "github.com/mangarapakpahan-cmd" },
        { label: "Kesiapan Kerja", val: "Penuh Waktu / Magang / Kontrak" }
      ],
      actions: [
        { label: "Chat WhatsApp Sekarang", url: "https://wa.me/6281318816058?text=Halo%20Mangara,%20kami%20tertarik%20mengundang%20Anda%20untuk%20peluang%20rekrutmen.", primary: true },
        { label: "Buka Seluruh 50 Arsip Proyek", action: "openArchive", primary: false }
      ],
      cam: { x: 20, y: 8.6, z: 12.8 },
      look: { x: 20, y: 1.2, z: 0 }
    }
  ];

  // ─── 3. CUTAWAY ARCHITECTURAL DIORAMA BUILDER ─────────────────
  function buildMiniatureDioramaScene() {
    // Ambient & Sun Lighting
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

    // Materials
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

    // Floor Slab
    const floorGeo = new THREE.BoxGeometry(60, 0.5, 20);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.25, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Outer Back Wall with Orange Top Cap
    const backWallGeo = new THREE.BoxGeometry(60, 2.8, 0.4);
    const backWall = new THREE.Mesh(backWallGeo, wallBodyMat);
    backWall.position.set(0, 1.4, -9.8);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    scene.add(backWall);

    const backCapGeo = new THREE.BoxGeometry(60, 0.12, 0.5);
    const backCap = new THREE.Mesh(backCapGeo, orangeTrimMat);
    backCap.position.set(0, 2.86, -9.8);
    scene.add(backCap);

    // Front low perimeter rail
    const frontRailGeo = new THREE.BoxGeometry(60, 0.4, 0.3);
    const frontRail = new THREE.Mesh(frontRailGeo, wallBodyMat);
    frontRail.position.set(0, 0.2, 9.8);
    scene.add(frontRail);

    // Signature Orange Guide Path across all rooms
    createOrangeGuideTrack();

    // Partition walls & furniture
    buildRoomPartitions(wallBodyMat, orangeTrimMat);
    buildRoom1Foyer(wallBodyMat, orangeTrimMat, chairOrangeMat);
    buildRoom2MCR(screenGlowMat, orangeTrimMat, darkWoodMat);
    buildRoom3Newsroom(orangeTrimMat, darkWoodMat, chairOrangeMat);
    buildRoom4DataLab(orangeTrimMat, darkWoodMat);
    buildRoom5IoTWorkshop(orangeTrimMat, darkWoodMat);
    buildRoom6Lounge(orangeTrimMat, darkWoodMat, chairOrangeMat);

    // ANIMATED WALKING HERO CHARACTER (USER FEEDBACK #1)
    createWalkingHero();
  }

  // Create Orange Floor Curve
  function createOrangeGuideTrack() {
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0xff6b2b,
      roughness: 0.35,
      metalness: 0.1
    });

    const points = [
      new THREE.Vector3(-24, 0.015, 3),
      new THREE.Vector3(-20, 0.015, 1),
      new THREE.Vector3(-16, 0.015, -1),
      new THREE.Vector3(-12, 0.015, 0),
      new THREE.Vector3(-8, 0.015, 2),
      new THREE.Vector3(-4, 0.015, -0.5),
      new THREE.Vector3(0, 0.015, 1.5),
      new THREE.Vector3(4, 0.015, -1),
      new THREE.Vector3(8, 0.015, 1.5),
      new THREE.Vector3(12, 0.015, -0.5),
      new THREE.Vector3(16, 0.015, 1.5),
      new THREE.Vector3(20, 0.015, 0),
      new THREE.Vector3(24, 0.015, 2)
    ];

    const CurveClass = THREE.CatmullRomCurve3;
    let curvePoints = points;

    if (CurveClass) {
      try {
        orangeCurve = new CurveClass(points);
        curvePoints = orangeCurve.getPoints(120);
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

      seg.position.set((p1.x + p2.x) / 2, 0.015, (p1.z + p2.z) / 2);
      const angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
      seg.rotation.y = -angle;
      scene.add(seg);
    }
  }

  // ─── 4. ANIMATED WALKING HERO (ORANG BERJALAN MENYUSURI BILIK) ──
  function createWalkingHero() {
    walkingHero = new THREE.Group();

    // Head with skin tone and dark hair cap
    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8b896, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.45;
    walkingHero.add(head);

    const hairGeo = new THREE.SphereGeometry(0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.48;
    walkingHero.add(hair);

    // Torso (Signature Orange Polo Shirt)
    const torsoGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.65, 12);
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xff6b2b, roughness: 0.6 });
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 0.95;
    walkingHero.add(torso);

    // Blue Portfolio Tablet in Hand (like Nadi diorama character)
    const tabletGeo = new THREE.BoxGeometry(0.08, 0.32, 0.24);
    const tabletMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3 });
    const tablet = new THREE.Mesh(tabletGeo, tabletMat);
    tablet.position.set(0.28, 0.85, 0.12);
    walkingHero.add(tablet);

    // Left Arm with Pivot
    const armGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.55, 8);
    armPivotL = new THREE.Group();
    armPivotL.position.set(-0.28, 1.2, 0);
    const armL = new THREE.Mesh(armGeo, shirtMat);
    armL.position.y = -0.25;
    armPivotL.add(armL);
    walkingHero.add(armPivotL);

    // Right Arm with Pivot
    armPivotR = new THREE.Group();
    armPivotR.position.set(0.28, 1.2, 0);
    const armR = new THREE.Mesh(armGeo, shirtMat);
    armR.position.y = -0.25;
    armPivotR.add(armR);
    walkingHero.add(armPivotR);

    // Left Leg with Pivot (Navy Trousers)
    const legGeo = new THREE.CylinderGeometry(0.085, 0.08, 0.65, 8);
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    legPivotL = new THREE.Group();
    legPivotL.position.set(-0.11, 0.65, 0);
    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.y = -0.32;
    legPivotL.add(legL);
    walkingHero.add(legPivotL);

    // Right Leg with Pivot
    legPivotR = new THREE.Group();
    legPivotR.position.set(0.11, 0.65, 0);
    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.y = -0.32;
    legPivotR.add(legR);
    walkingHero.add(legPivotR);

    // Initial position at Room 1 start
    walkingHero.position.set(-20, 0, 1);
    scene.add(walkingHero);
  }

  // Room Partition Walls
  function buildRoomPartitions(wallMat, trimMat) {
    const dividerX = [-16, -8, 0, 8, 16];

    for (const x of dividerX) {
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

  // Static Background Characters
  function createStaticCharacter(x, z, shirtColor = 0x3b82f6, pantsColor = 0x1e293b, ry = 0) {
    const charGroup = new THREE.Group();
    charGroup.position.set(x, 0, z);
    charGroup.rotation.y = ry;

    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8b896, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.45;
    charGroup.add(head);

    const torsoGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.65, 12);
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.7 });
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 0.95;
    charGroup.add(torso);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8);
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.8 });

    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.set(-0.11, 0.35, 0);
    charGroup.add(legL);

    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.set(0.11, 0.35, 0);
    charGroup.add(legR);

    scene.add(charGroup);
    return charGroup;
  }

  // Room 1: Foyer & Identity Hub
  function buildRoom1Foyer(wallMat, trimMat, chairMat) {
    const deskGeo = new THREE.BoxGeometry(3.6, 1.05, 1.2);
    const desk = new THREE.Mesh(deskGeo, wallMat);
    desk.position.set(-20, 0.52, -4);
    desk.castShadow = true;
    scene.add(desk);

    const topGeo = new THREE.BoxGeometry(3.7, 0.08, 1.3);
    const top = new THREE.Mesh(topGeo, trimMat);
    top.position.set(-20, 1.09, -4);
    scene.add(top);

    const lapGeo = new THREE.BoxGeometry(0.5, 0.04, 0.35);
    const lap = new THREE.Mesh(lapGeo, new THREE.MeshStandardMaterial({ color: 0x334155 }));
    lap.position.set(-20, 1.15, -4);
    scene.add(lap);

    createStaticCharacter(-20, -5.2, 0xff7a38, 0x1e293b, 0);

    for (let i = 0; i < 3; i++) {
      const chairGeo = new THREE.BoxGeometry(0.65, 0.12, 0.6);
      const chair = new THREE.Mesh(chairGeo, chairMat);
      chair.position.set(-22 + i * 0.9, 0.45, 4.5);
      scene.add(chair);

      const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45);
      const leg = new THREE.Mesh(legGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
      leg.position.set(-22 + i * 0.9, 0.22, 4.5);
      scene.add(leg);
    }
  }

  // Room 2: Master Control Room (MCR) & Live Production Studio
  function buildRoom2MCR(screenMat, trimMat, darkMat) {
    const deskGeo = new THREE.BoxGeometry(4.2, 1.05, 1.4);
    const desk = new THREE.Mesh(deskGeo, darkMat);
    desk.position.set(-12, 0.52, -4.5);
    scene.add(desk);

    const gridCols = 3;
    const gridRows = 2;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const scrGeo = new THREE.PlaneGeometry(1.2, 0.75);
        const scr = new THREE.Mesh(scrGeo, screenMat);
        scr.position.set(-13.4 + c * 1.4, 1.8 + r * 0.9, -9.5);
        scene.add(scr);
      }
    }

    const tripGeo = new THREE.CylinderGeometry(0.04, 0.25, 1.4, 4);
    const trip = new THREE.Mesh(tripGeo, new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    trip.position.set(-12, 0.7, 2.5);
    scene.add(trip);

    const camBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.9), darkMat);
    camBox.position.set(-12, 1.5, 2.5);
    scene.add(camBox);

    const tallyLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.08),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    tallyLight.position.set(-12, 1.75, 2.85);
    scene.add(tallyLight);

    createStaticCharacter(-12, -5.5, 0x0284c7, 0x1e293b, 0);
  }

  // Room 3: Digital Newsroom & Social Media Strategy Hub
  function buildRoom3Newsroom(trimMat, darkMat, chairMat) {
    const deskGeo = new THREE.BoxGeometry(4.5, 0.95, 1.5);
    const desk = new THREE.Mesh(deskGeo, new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
    desk.position.set(-4, 0.48, -4.2);
    scene.add(desk);

    for (let i = 0; i < 2; i++) {
      const scr = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.7, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      scr.position.set(-4.8 + i * 1.6, 1.35, -4.2);
      scene.add(scr);
    }

    createStaticCharacter(-4, -5.2, 0xa855f7, 0x1e293b, 0);

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.5, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    board.position.set(-6.5, 1.5, 2);
    board.rotation.y = Math.PI / 6;
    scene.add(board);
  }

  // Room 4: Data Science & AI Engineering Lab
  function buildRoom4DataLab(trimMat, darkMat) {
    const rackGeo = new THREE.BoxGeometry(1.4, 2.4, 1.0);
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 });
    const rack = new THREE.Mesh(rackGeo, rackMat);
    rack.position.set(6.5, 1.2, -8.5);
    scene.add(rack);

    for (let i = 0; i < 5; i++) {
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.04),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0x22c55e })
      );
      led.position.set(6.2 + (i % 2) * 0.4, 0.6 + i * 0.35, -7.95);
      scene.add(led);
    }

    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.95, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    desk.position.set(4, 0.48, -4);
    scene.add(desk);

    createStaticCharacter(4, -5.1, 0x3b82f6, 0x0f172a, 0);
  }

  // Room 5: IoT & Hardware Innovation Workshop
  function buildRoom5IoTWorkshop(trimMat, darkMat) {
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 1.0, 1.4),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 })
    );
    bench.position.set(12, 0.5, -4.5);
    scene.add(bench);

    const gasTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.7, 16),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 })
    );
    gasTank.position.set(11.2, 1.35, -4.5);
    scene.add(gasTank);

    const trophy = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
    );
    trophy.position.set(13.2, 1.4, -4.5);
    scene.add(trophy);

    createStaticCharacter(12, -5.5, 0xf97316, 0x1e293b, 0);
  }

  // Room 6: Partnership Lounge & Fast-Track Recruiter Desk
  function buildRoom6Lounge(trimMat, darkMat, chairMat) {
    const sofaGeo = new THREE.BoxGeometry(3.6, 0.8, 1.4);
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const sofa = new THREE.Mesh(sofaGeo, sofaMat);
    sofa.position.set(20, 0.4, -4.5);
    scene.add(sofa);

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.45, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
    );
    table.position.set(20, 0.25, -2);
    scene.add(table);

    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.25, 0.7, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    pot.position.set(23, 0.35, -8.5);
    scene.add(pot);

    const foliage = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.65),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
    );
    foliage.position.set(23, 1.2, -8.5);
    scene.add(foliage);

    createStaticCharacter(19, -0.8, 0x059669, 0x1e293b, -Math.PI / 4);
    createStaticCharacter(21, -0.8, 0xff6b2b, 0x1e293b, Math.PI / 4);
  }

  // ─── 5. DOM MOUNTING & UI SETUP ───────────────────────────────
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

          <!-- STORY BACKDROP GRADIENT (USER FEEDBACK #3) -->
          <div class="nadi-story-backdrop-gradient"></div>

          <!-- 1. TOP NAVBAR -->
          <header class="nadi-top-navbar">
            <a href="#" class="nadi-brand-pill">
              <span class="nadi-brand-logo">mangara</span>
              <span class="nadi-brand-dot"></span>
            </a>

            <nav class="nadi-nav-center-menu">
              <a href="#" class="nadi-nav-step-link" data-step="0">Profil</a>
              <a href="#" class="nadi-nav-step-link" data-step="1">Live Broadcast</a>
              <a href="#" class="nadi-nav-step-link" data-step="2">Sosmed & Humas</a>
              <a href="#" class="nadi-nav-step-link" data-step="3">Data Science</a>
              <a href="#" class="nadi-nav-step-link" data-step="4">Inovasi IoT</a>
              <a href="#" class="nadi-nav-step-link" data-step="5">Rekrutmen</a>
            </nav>

            <div class="nadi-nav-actions">
              <a href="./CV_Mangara_Pakpahan_Data_Analyst.pdf" target="_blank" rel="noopener" class="nadi-btn-secondary" title="Unduh CV ATS Data Analyst (PDF)">
                <ion-icon name="document-text-outline"></ion-icon>
                <span>CV Data Analyst</span>
              </a>
              <a href="./CV_Mangara_Pakpahan_Sosmed_Humas.pdf" target="_blank" rel="noopener" class="nadi-btn-secondary" title="Unduh CV ATS Sosmed & Humas (PDF)">
                <ion-icon name="document-text-outline"></ion-icon>
                <span>CV Sosmed & Humas</span>
              </a>
              <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20melihat%20portofolio%203D%20Anda." target="_blank" rel="noopener" class="nadi-btn-primary" title="Hubungi via WhatsApp">
                <span>WhatsApp &rarr;</span>
              </a>
            </div>
          </header>

          <!-- 2. LEFT FLOATING STORY CONTENT & CARD (USER FEEDBACK #4: ENLARGED) -->
          <div class="nadi-story-layer" id="nadi-story-layer">
            <div class="nadi-step-label" id="nadi-step-label">
              <span>LANGKAH 01</span> &bull; PROFIL & KUALIFIKASI PROFESIONAL
            </div>

            <h1 class="nadi-story-headline" id="nadi-story-headline">
              Kreativitas Bertemu Rekayasa Data.
            </h1>

            <p class="nadi-story-desc" id="nadi-story-desc">
              Mahasiswa S1 Teknik Informatika Institut Teknologi PLN dengan keahlian multidisipliner yang memadukan perancangan identitas visual korporat, produksi siaran langsung nasional, pengelolaan kanal komunikasi digital resmi, serta riset dan analitik data empiris.
            </p>

            <!-- FLOATING DATA CARD -->
            <div class="nadi-floating-card" id="nadi-floating-card">
              <div class="nadi-card-top-row">
                <div class="nadi-card-badge-left" id="nadi-card-title">
                  <ion-icon name="reader-outline" style="color: var(--nadi-orange);"></ion-icon>
                  <strong>Ringkasan Kualifikasi</strong>
                </div>
                <div class="nadi-card-badge-status" id="nadi-card-status">
                  Tersedia untuk Kerja & Magang
                </div>
              </div>

              <div class="nadi-card-list" id="nadi-card-list">
                <!-- Dynamically updated -->
              </div>

              <div class="nadi-card-actions" id="nadi-card-actions">
                <!-- Action buttons -->
              </div>
            </div>
          </div>

          <!-- MOUSE SCROLL CUE -->
          <div class="nadi-scroll-cue">
            <div class="nadi-scroll-pill-icon">
              <div class="nadi-scroll-pill-dot"></div>
            </div>
            <span>GULIR KE BAWAH / TEKAN TOMBOL PANAH UNTUK MENJALANKAN KARAKTER &bull; SCROLL TO EXPLORE</span>
          </div>

          <!-- 3. BOTTOM SCROLLYTELLING PROGRESS BAR WITH ARROWS -->
          <footer class="nadi-bottom-timeline">
            <div class="nadi-timeline-left-wrap">
              <div class="nadi-nav-arrows">
                <button class="nadi-arrow-btn" id="nadi-btn-prev" title="Bilik Sebelumnya (&larr;)">
                  <ion-icon name="arrow-back-outline"></ion-icon>
                </button>
                <button class="nadi-arrow-btn" id="nadi-btn-next" title="Bilik Selanjutnya (&rarr;)">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </button>
              </div>

              <div class="nadi-steps-bar" id="nadi-steps-bar">
                ${SCROLL_STEPS.map((s, idx) => `
                  <div class="nadi-step-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                    <span class="nadi-step-num">${s.stepNum}</span>
                    <span class="nadi-step-name">${s.stepName}</span>
                    <div class="nadi-step-track">
                      <div class="nadi-step-fill" id="nadi-fill-${idx}"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <button class="nadi-skip-btn" id="nadi-btn-open-archive" title="Lihat 50+ Seluruh Arsip Proyek & Dokumen">
              <ion-icon name="grid-outline"></ion-icon>
              <span>Buka Arsip & CV Lengkap</span>
            </button>
          </footer>

          <!-- 4. IN-3D FULL ARCHIVE & CV MODAL (USER FEEDBACK #2: SEMUA DI DALAM 3D) -->
          <div class="nadi-archive-modal" id="nadi-archive-modal">
            <div class="nadi-archive-card">
              <div class="nadi-archive-header">
                <h3 class="nadi-archive-title">
                  <ion-icon name="albums-outline" style="color: var(--nadi-orange); margin-right: 8px;"></ion-icon>
                  Arsip Portofolio & Dokumen Lengkap Mangara Pakpahan
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
                  <h4>2. Ringkasan 50+ Proyek Terkurasi Lengkap</h4>
                  <div class="nadi-archive-grid">
                    <div class="nadi-archive-item">
                      <strong>Siaran Langsung Wisuda ke-46 ITPLN</strong>
                      <span>Lead Switcher & Multi-Kamera Penyiaran Nasional</span>
                    </div>
                    <div class="nadi-archive-item">
                      <strong>Pengelolaan Akun Resmi @itpln</strong>
                      <span>Engagement Rate Meningkat 300% & Desain Visual</span>
                    </div>
                    <div class="nadi-archive-item">
                      <strong>IoT LPG-SafeSense (Juara 1 Inovasi MKI)</strong>
                      <span>Deteksi Dini Kebocoran Gas & Mobile Cloud App</span>
                    </div>
                    <div class="nadi-archive-item">
                      <strong>Media PJCI (@smartgridindonesia & pjci.or.id)</strong>
                      <span>Koordinator Tim Liputan & Web Berita Nasional</span>
                    </div>
                    <div class="nadi-archive-item">
                      <strong>Sertifikasi Azure Databricks Machine Learning</strong>
                      <span>8 Modul Resmi Microsoft AutoML & Apache Spark</span>
                    </div>
                    <div class="nadi-archive-item">
                      <strong>Riset Kuantitatif SEM-PLS (120 JP)</strong>
                      <span>Structural Equation Modeling PT Educativa</span>
                    </div>
                  </div>
                </div>

                <div class="nadi-archive-section">
                  <h4>3. Kontak & Kanal Profesional</h4>
                  <div class="nadi-card-actions" style="margin-top: 0;">
                    <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20tertarik%20dengan%20portofolio%20Anda." target="_blank" rel="noopener" class="nadi-card-btn">
                      <ion-icon name="logo-whatsapp"></ion-icon>
                      <span>WhatsApp (0813-1881-6058)</span>
                    </a>
                    <a href="mailto:mangarapakpahan51@gmail.com" class="nadi-card-btn">
                      <ion-icon name="mail-outline"></ion-icon>
                      <span>Kirim Email Resmi</span>
                    </a>
                    <a href="https://linkedin.com/in/mangara-ferdianto-pakpahan" target="_blank" rel="noopener" class="nadi-card-btn">
                      <ion-icon name="logo-linkedin"></ion-icon>
                      <span>LinkedIn Profile</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- LOADING OVERLAY -->
          <div class="nadi-loading-screen" id="nadi-loading-screen">
            <div class="nadi-spinner"></div>
            <div class="nadi-loading-title">MEMUAT STUDI 3D SCROLLYTELLING...</div>
            <div class="nadi-loading-sub">Mangara Ferdianto Pakpahan &bull; Creative & Data Portfolio</div>
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

  function renderStoryStep(index) {
    const step = SCROLL_STEPS[index];
    if (!step) return;

    const lbl = document.getElementById('nadi-step-label');
    const h1 = document.getElementById('nadi-story-headline');
    const desc = document.getElementById('nadi-story-desc');
    const cardTitle = document.getElementById('nadi-card-title');
    const cardStatus = document.getElementById('nadi-card-status');
    const cardList = document.getElementById('nadi-card-list');
    const cardActions = document.getElementById('nadi-card-actions');

    if (lbl) lbl.innerHTML = `<span>${step.category.split('•')[0]}</span> &bull; ${step.category.split('•')[1] || ''}`;
    if (h1) h1.innerHTML = step.title;
    if (desc) desc.textContent = step.desc;

    if (cardTitle) {
      cardTitle.innerHTML = `<ion-icon name="reader-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>${step.cardTitle}</strong>`;
    }

    if (cardStatus) {
      cardStatus.textContent = step.badgeStatus;
      cardStatus.className = `nadi-card-badge-status ${step.badgeStatusColor || 'green'}`;
    }

    if (cardList) {
      cardList.innerHTML = step.items.map(item => `
        <div class="nadi-card-list-item">
          <span class="nadi-card-item-name">
            <ion-icon name="checkmark-circle" class="nadi-check-icon"></ion-icon>
            ${item.label}
          </span>
          <span class="nadi-card-item-val">${item.val}</span>
        </div>
      `).join('');
    }

    if (cardActions) {
      cardActions.innerHTML = step.actions.map(act => {
        if (act.action === 'openArchive') {
          return `
            <button class="nadi-card-btn ${act.primary ? 'primary' : ''}" onclick="window.__nadiOpenArchive && window.__nadiOpenArchive()">
              <span>${act.label}</span> &rarr;
            </button>
          `;
        }
        return `
          <a href="${act.url}" ${act.url.startsWith('http') || act.url.endsWith('.pdf') ? 'target="_blank" rel="noopener"' : ''} class="nadi-card-btn ${act.primary ? 'primary' : ''}">
            <span>${act.label}</span> &rarr;
          </a>
        `;
      }).join('');
    }
  }

  // ─── 6. SCROLL & INTERACTION CONTROLLER ───────────────────────
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

    updateTimelineUI(progress);
  }

  function updateTimelineUI(progress) {
    const numSteps = SCROLL_STEPS.length;
    const stepRange = 1 / (numSteps - 1);

    const stepItems = document.querySelectorAll('.nadi-step-item');
    stepItems.forEach((item, idx) => {
      const fill = document.getElementById(`nadi-fill-${idx}`);
      const stepStart = idx * stepRange;

      if (progress >= stepStart) {
        item.classList.add('active');
        if (fill) {
          const stepProg = Math.min(1, (progress - stepStart) / stepRange);
          fill.style.width = `${stepProg * 100}%`;
        }
      } else {
        item.classList.remove('active');
        if (fill) fill.style.width = '0%';
      }

      if (progress >= (idx + 1) * stepRange) {
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
    });
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

  // ─── 7. INITIALIZE THREE.JS & ANIMATION LOOP ──────────────────
  function initThreeDiorama() {
    canvas = document.getElementById('nadi-webgl-canvas');
    stickyViewport = document.getElementById('nadi-sticky-viewport');
    scrollyTrack = document.getElementById('nadi-scrolly-track');

    if (!canvas || !stickyViewport || !scrollyTrack) return;

    const width = stickyViewport.clientWidth || window.innerWidth;
    const height = stickyViewport.clientHeight || window.innerHeight;

    currentCamPos = new THREE.Vector3(SCROLL_STEPS[0].cam.x, SCROLL_STEPS[0].cam.y, SCROLL_STEPS[0].cam.z);
    currentLookAt = new THREE.Vector3(SCROLL_STEPS[0].look.x, SCROLL_STEPS[0].look.y, SCROLL_STEPS[0].look.z);
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

    textureLoader = new THREE.TextureLoader();

    // Build the architectural diorama & walking hero
    buildMiniatureDioramaScene();

    // Event Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onWindowResize);

    stickyViewport.addEventListener('wheel', (e) => {
      window.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }, { passive: true });

    // Clickable Navigation Step Pills
    document.querySelectorAll('.nadi-step-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        jumpToStep(idx);
      });
    });

    document.querySelectorAll('.nadi-nav-step-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(link.dataset.step, 10);
        jumpToStep(idx);
      });
    });

    // Prev & Next Room Buttons
    document.getElementById('nadi-btn-prev')?.addEventListener('click', () => {
      jumpToStep(currentStepIndex - 1);
    });

    document.getElementById('nadi-btn-next')?.addEventListener('click', () => {
      jumpToStep(currentStepIndex + 1);
    });

    // Keyboard Arrow Controls
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowDown' || e.code === 'ArrowRight' || e.code === 'PageDown') {
        const nextIdx = Math.min(SCROLL_STEPS.length - 1, currentStepIndex + 1);
        jumpToStep(nextIdx);
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft' || e.code === 'PageUp') {
        const prevIdx = Math.max(0, currentStepIndex - 1);
        jumpToStep(prevIdx);
      } else if (e.code === 'Escape') {
        closeArchiveModal();
      }
    });

    // Drag-to-Scrub Controls
    let isDragging = false;
    let startY = 0;

    stickyViewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a, input, .nadi-archive-modal')) return;
      isDragging = true;
      startY = e.clientY;
    });

    window.addEventListener('mouseup', () => (isDragging = false));

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const delta = startY - e.clientY;
        startY = e.clientY;
        window.scrollBy({ top: delta * 3, behavior: 'auto' });
      }
    });

    // Touch Swipe Controls
    let touchStartY = 0;
    stickyViewport.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    stickyViewport.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const delta = touchStartY - touchY;
      touchStartY = touchY;
      window.scrollBy({ top: delta * 2, behavior: 'auto' });
    }, { passive: true });

    // Full In-3D Archive Modal Handlers
    function openArchiveModal() {
      const modal = document.getElementById('nadi-archive-modal');
      if (modal) modal.classList.add('active');
    }

    function closeArchiveModal() {
      const modal = document.getElementById('nadi-archive-modal');
      if (modal) modal.classList.remove('active');
    }

    window.__nadiOpenArchive = openArchiveModal;

    document.getElementById('nadi-btn-open-archive')?.addEventListener('click', openArchiveModal);
    document.getElementById('nadi-archive-close')?.addEventListener('click', closeArchiveModal);
    document.getElementById('nadi-archive-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'nadi-archive-modal') closeArchiveModal();
    });

    // Hide loading screen
    setTimeout(() => {
      const loader = document.getElementById('nadi-loading-screen');
      if (loader) loader.classList.add('hidden');
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

  function getCameraPoseAtProgress(t) {
    const numIntervals = SCROLL_STEPS.length - 1;
    const scaled = t * numIntervals;
    const i = Math.min(numIntervals - 1, Math.floor(scaled));
    const frac = scaled - i;

    const stepA = SCROLL_STEPS[i];
    const stepB = SCROLL_STEPS[i + 1] || SCROLL_STEPS[i];

    const ease = frac * frac * (3 - 2 * frac);

    const pos = {
      x: stepA.cam.x + (stepB.cam.x - stepA.cam.x) * ease,
      y: stepA.cam.y + (stepB.cam.y - stepA.cam.y) * ease,
      z: stepA.cam.z + (stepB.cam.z - stepA.cam.z) * ease
    };

    const look = {
      x: stepA.look.x + (stepB.look.x - stepA.look.x) * ease,
      y: stepA.look.y + (stepB.look.y - stepA.look.y) * ease,
      z: stepA.look.z + (stepB.look.z - stepA.look.z) * ease
    };

    return { pos, look };
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    const prevProg = currentProgress;
    currentProgress += (targetProgress - currentProgress) * 0.08;
    const deltaProg = currentProgress - prevProg;

    // 1. ANIMATE WALKING HERO ALONG ORANGE FLOOR PATH (USER FEEDBACK #1)
    if (walkingHero && orangeCurve) {
      const curveT = Math.min(0.999, Math.max(0.001, currentProgress));
      const heroPt = orangeCurve.getPointAt(curveT);
      const heroTangent = orangeCurve.getTangentAt(curveT);

      walkingHero.position.set(heroPt.x, 0, heroPt.z);
      walkingHero.rotation.y = Math.atan2(heroTangent.x, heroTangent.z);

      // Walking cycle animation when moving
      if (Math.abs(deltaProg) > 0.0001) {
        walkStepPhase += Math.abs(deltaProg) * 85;
        if (legPivotL) legPivotL.rotation.x = Math.sin(walkStepPhase) * 0.65;
        if (legPivotR) legPivotR.rotation.x = -Math.sin(walkStepPhase) * 0.65;
        if (armPivotL) armPivotL.rotation.x = -Math.sin(walkStepPhase) * 0.5;
        if (armPivotR) armPivotR.rotation.x = Math.sin(walkStepPhase) * 0.5;
        walkingHero.position.y = Math.abs(Math.sin(walkStepPhase * 2)) * 0.06;
      } else {
        // Return to natural standing pose when idle
        if (legPivotL) legPivotL.rotation.x *= 0.85;
        if (legPivotR) legPivotR.rotation.x *= 0.85;
        if (armPivotL) armPivotL.rotation.x *= 0.85;
        if (armPivotR) armPivotR.rotation.x *= 0.85;
        walkingHero.position.y *= 0.85;
      }
    }

    // 2. SMOOTH CAMERA FLIGHT
    const { pos, look } = getCameraPoseAtProgress(currentProgress);

    if (currentCamPos && currentLookAt && tempTargetPos && tempTargetLook) {
      tempTargetPos.set(pos.x, pos.y, pos.z);
      tempTargetLook.set(look.x, look.y, look.z);

      currentCamPos.lerp(tempTargetPos, 0.1);
      currentLookAt.lerp(tempTargetLook, 0.1);

      camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);
      camera.lookAt(currentLookAt);
    }

    renderer.render(scene, camera);
  }

  // ─── 8. ENTRY POINT ───────────────────────────────────────────
  function init() {
    buildScrollytellingDOM();

    if (typeof THREE !== 'undefined') {
      initThreeDiorama();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        initThreeDiorama();
      };
      document.head.appendChild(script);
    }

    console.log('✨ 3D Scrollytelling Diorama Experience (with walking hero) initialized successfully!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
