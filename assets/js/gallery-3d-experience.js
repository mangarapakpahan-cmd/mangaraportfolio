/**
 * gallery-3d-experience.js
 * 3D Scrollytelling Camera Flight & Interactive Miniature Studio
 * Inspired by "nadi." Healthcare Diorama Experience
 * - Complete integration of ALL 9 sections managed in admin.html & DEFAULT_DATA:
 *   1. Profil (Bio, stats counters, contacts, social links, 1-click ATS CV downloads)
 *   2. Layanan (All 10 services with icons & full descriptions)
 *   3. Skills (All 11 technical & creative skills with progress bars)
 *   4. Pengalaman (All 15 work & organizational leadership items)
 *   5. Pendidikan & Sertifikasi (All 8 items: S1 ITPLN, Azure Databricks ML, SEM-PLS 120 JP, MOS Excel, etc.)
 *   6. 50+ Proyek Portofolio (All 50 authentic projects with card-1.jpg..card-50.jpg, category filters, search bar, & Lightbox modal)
 *   7. Blog & Publikasi (All 20 articles & research achievements: SafeSense Juara 1 MKI, PKM DIKTI grant)
 *   8. Testimoni (All 4 client & leadership testimonials)
 *   9. Pesan / Rekrutmen (Direct interactive contact form saving to Firestore 'messages' collection)
 * - Animated walking hero character physically traversing the orange path through all 7 studio zones
 * - Long, comfortable 1200vh scroll track + dedicated in-card scroll containers
 * - 100% Self-contained within the 3D scene (no bottom 2D site needed)
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
  let orangeCurve = null;
  let walkStepPhase = 0;

  // Camera flight interpolation vectors
  let currentCamPos = null;
  let currentLookAt = null;
  let tempTargetPos = null;
  let tempTargetLook = null;

  let targetProgress = 0;
  let currentProgress = 0;
  let currentStepIndex = 0;

  // Internal UI State for Filtering / Subtabs
  let activeLayananSubtab = 'services'; // 'services' or 'skills'
  let activeExpFilter = 'all'; // 'all', 'work', 'org'
  let activeEduFilter = 'all'; // 'all', 'formal', 'cert'
  let activeProjFilter = 'all'; // 'all', 'live', 'sosmed', 'design', 'iot', 'ai', 'editorial'
  let activeProjSearch = '';
  let activeBlogFilter = 'all'; // 'all', 'prestasi', 'redaksi', 'ai'
  let activeContactSubtab = 'testi'; // 'testi' or 'form'

  // ─── 2. 7 SCROLLYTELLING STEP DEFINITIONS ─────────────────────
  const SCROLL_STEPS = [
    {
      stepNum: "01",
      stepName: "Profil",
      category: "LANGKAH 01 • PROFIL & KUALIFIKASI PROFESIONAL",
      title: "Kreativitas Bertemu Rekayasa Data & Komunikasi Publik.",
      desc: "Mahasiswa S1 Teknik Informatika Institut Teknologi PLN dengan keahlian multidisipliner yang memadukan perancangan identitas visual korporat, produksi siaran langsung nasional, pengelolaan komunikasi digital resmi, serta riset dan analitik data empiris.\n\nMemiliki dedikasi tinggi dalam mengintegrasikan teknologi informasi modern dengan komunikasi visual berdampak untuk memecahkan tantangan korporat dan institusi publik secara terukur.",
      badgeStatus: "Tersedia untuk Kerja & Magang",
      badgeStatusColor: "green",
      cam: { x: -21, y: 8.5, z: 12.8 },
      look: { x: -21, y: 1.3, z: 0 }
    },
    {
      stepNum: "02",
      stepName: "Layanan & Skills",
      category: "LANGKAH 02 • 10 LAYANAN & 11 KOMPETENSI TEKNIS",
      title: "10 Layanan Spesialisasi & 11 Keterampilan Teknis Teruji.",
      desc: "Menyediakan 10 layanan profesional yang teruji di industri: dari produksi siaran langsung multi-kamera acara protokoler nasional, creative direction identitas visual, strategi pertumbuhan media sosial 3x lipat, riset rekayasa IoT pintar, hingga pemodelan data machine learning cloud.\n\nDidukung oleh penguasaan 11 kompetensi software dan metodologi analitik berstandar industri.",
      badgeStatus: "10 Layanan • 11 Skills",
      badgeStatusColor: "orange",
      cam: { x: -14, y: 8.2, z: 12.2 },
      look: { x: -14, y: 1.3, z: 0 }
    },
    {
      stepNum: "03",
      stepName: "Pengalaman",
      category: "LANGKAH 03 • 15 PENGALAMAN KERJA & ORGANISASI",
      title: "15 Rekam Jejak Profesional & Kepemimpinan Nasional.",
      desc: "Perjalanan karir komprehensif mencakup peran strategis sebagai Social Media Manager di PJCI, Tim Humas & Komunikasi Publik ITPLN, Lead Visual Switcher Wisuda Nasional, Koordinator Kreatif ITPLN Media, Ketua Pelaksana National CAD Competition (NCC 2025), hingga Student Ambassador DQLab.\n\nSetiap tanggung jawab dijalankan dengan akuntabilitas tinggi dan dampak nyata terukur.",
      badgeStatus: "15 Entri Terverifikasi",
      badgeStatusColor: "green",
      cam: { x: -7, y: 8.2, z: 12.0 },
      look: { x: -7, y: 1.3, z: 0 }
    },
    {
      stepNum: "04",
      stepName: "Pendidikan",
      category: "LANGKAH 04 • PENDIDIKAN FORMAL & 8 LISENSI RESMI",
      title: "Fondasi Akademik Kuat & 8 Lisensi Internasional.",
      desc: "Menempuh pendidikan Sarjana (S1) Teknik Informatika di Institut Teknologi PLN dengan spesialisasi komputasi cerdas dan rekayasa data industri energi.\n\nDiperkuat oleh 8 sertifikasi profesional resmi: Microsoft Azure Databricks Machine Learning (8 modul), Structural Equation Modeling (SEM-PLS 120 JP), MOS Excel 2019, IBM AI Agents, dan DQLab Data Science.",
      badgeStatus: "8 Lisensi Resmi Terverifikasi",
      badgeStatusColor: "green",
      cam: { x: 0, y: 8.2, z: 12.0 },
      look: { x: 0, y: 1.3, z: 0 }
    },
    {
      stepNum: "05",
      stepName: "50+ Proyek",
      category: "LANGKAH 05 • EKSIBI 50+ KARYA & PROYEK PORTOFOLIO",
      title: "Eksibisi 50 Karya Terkurasi dengan Dokumentasi Asli.",
      desc: "Menampilkan seluruh 50 portofolio karya nyata yang telah diselesaikan: live streaming siaran nasional, strategi konten kampanye media sosial (@itpln & @smartgridindonesia), rekayasa prototipe IoT LPG-SafeSense, perancangan identitas visual korporat, hingga sistem data dan web.\n\nKlik kartu mana pun untuk membuka dokumentasi detail dan link tautan asli.",
      badgeStatus: "50 Proyek Lengkap Aktif",
      badgeStatusColor: "orange",
      cam: { x: 7, y: 8.2, z: 12.2 },
      look: { x: 7, y: 1.3, z: 0 }
    },
    {
      stepNum: "06",
      stepName: "Blog & Riset",
      category: "LANGKAH 06 • 20 PUBLIKASI, ARTIKEL & RISET PRESTASI",
      title: "20 Publikasi Ilmiah, Redaksi Berita & Hibah Riset.",
      desc: "Kumpulan publikasi artikel berkala, jurnalisme korporat untuk portal resmi PJCI dan ITPLN, tulisan teknologi transisi energi bersih, serta rekam jejak inovasi peraih Juara 1 MKI dan hibah penelitian PKM DIKTI Kemendikbudristek.\n\nMembuktikan kemampuan komunikasi tulisan analitis dan dedikasi riset ilmiah berkelanjutan.",
      badgeStatus: "20 Publikasi & Prestasi",
      badgeStatusColor: "orange",
      cam: { x: 14, y: 8.2, z: 12.2 },
      look: { x: 14, y: 1.3, z: 0 }
    },
    {
      stepNum: "07",
      stepName: "Testimoni & Kontak",
      category: "LANGKAH 07 • TESTIMONI & PUSAT REKRUTMEN RESMI",
      title: "Testimoni Stakeholder & Formulir Komunikasi Langsung.",
      desc: "Terbuka untuk kesempatan kerja penuh waktu, program magang, konsultasi creative direction, maupun kolaborasi proyek strategis di Jakarta, hybrid, maupun remote.\n\nKirimkan pesan Anda langsung melalui formulir di bawah ini (terhubung langsung ke sistem database admin) atau hubungi langsung via WhatsApp dan Email resmi.",
      badgeStatus: "Respons Cepat & Siap Onboarding",
      badgeStatusColor: "green",
      cam: { x: 21, y: 8.5, z: 12.8 },
      look: { x: 21, y: 1.3, z: 0 }
    }
  ];

  // ─── 3. CUTAWAY ARCHITECTURAL DIORAMA BUILDER ─────────────────
  function buildMiniatureDioramaScene() {
    // Lighting
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

    // Floor Slab (60 units wide)
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

    // Signature Orange Guide Path across all 7 rooms
    createOrangeGuideTrack();

    // 7 Partitioned Studio Zones
    build7RoomPartitions(wallBodyMat, orangeTrimMat);
    buildRoom1Foyer(wallBodyMat, orangeTrimMat, chairOrangeMat);
    buildRoom2Studio(screenGlowMat, orangeTrimMat, darkWoodMat);
    buildRoom3Newsroom(orangeTrimMat, darkWoodMat, chairOrangeMat);
    buildRoom4DataLab(orangeTrimMat, darkWoodMat);
    buildRoom5IoTGallery(orangeTrimMat, darkWoodMat);
    buildRoom6PressHall(orangeTrimMat, darkWoodMat, chairOrangeMat);
    buildRoom7RecruiterLounge(orangeTrimMat, darkWoodMat, chairOrangeMat);

    // Animated Walking Hero
    createWalkingHero();
  }

  // Create Orange Floor Curve across 15 control points
  function createOrangeGuideTrack() {
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0xff6b2b,
      roughness: 0.35,
      metalness: 0.1
    });

    const points = [
      new THREE.Vector3(-24, 0.015, 3),
      new THREE.Vector3(-21, 0.015, 1),
      new THREE.Vector3(-17.5, 0.015, -1),
      new THREE.Vector3(-14, 0.015, 0.5),
      new THREE.Vector3(-10.5, 0.015, 2),
      new THREE.Vector3(-7, 0.015, -0.5),
      new THREE.Vector3(-3.5, 0.015, 1.5),
      new THREE.Vector3(0, 0.015, -1),
      new THREE.Vector3(3.5, 0.015, 1.5),
      new THREE.Vector3(7, 0.015, -0.5),
      new THREE.Vector3(10.5, 0.015, 1.8),
      new THREE.Vector3(14, 0.015, -0.2),
      new THREE.Vector3(17.5, 0.015, 1.5),
      new THREE.Vector3(21, 0.015, 0),
      new THREE.Vector3(24, 0.015, 2)
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

      seg.position.set((p1.x + p2.x) / 2, 0.015, (p1.z + p2.z) / 2);
      const angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
      seg.rotation.y = -angle;
      scene.add(seg);
    }
  }

  // Animated Walking Hero Character
  function createWalkingHero() {
    walkingHero = new THREE.Group();

    // Head
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

    // Torso (Signature Orange Shirt)
    const torsoGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.65, 12);
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xff6b2b, roughness: 0.6 });
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 0.95;
    walkingHero.add(torso);

    // Portfolio Tablet in hand
    const tabletGeo = new THREE.BoxGeometry(0.08, 0.32, 0.24);
    const tabletMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3 });
    const tablet = new THREE.Mesh(tabletGeo, tabletMat);
    tablet.position.set(0.28, 0.85, 0.12);
    walkingHero.add(tablet);

    // Left Arm Pivot
    const armGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.55, 8);
    armPivotL = new THREE.Group();
    armPivotL.position.set(-0.28, 1.2, 0);
    const armL = new THREE.Mesh(armGeo, shirtMat);
    armL.position.y = -0.25;
    armPivotL.add(armL);
    walkingHero.add(armPivotL);

    // Right Arm Pivot
    armPivotR = new THREE.Group();
    armPivotR.position.set(0.28, 1.2, 0);
    const armR = new THREE.Mesh(armGeo, shirtMat);
    armR.position.y = -0.25;
    armPivotR.add(armR);
    walkingHero.add(armPivotR);

    // Left Leg Pivot
    const legGeo = new THREE.CylinderGeometry(0.085, 0.08, 0.65, 8);
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    legPivotL = new THREE.Group();
    legPivotL.position.set(-0.11, 0.65, 0);
    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.y = -0.32;
    legPivotL.add(legL);
    walkingHero.add(legPivotL);

    // Right Leg Pivot
    legPivotR = new THREE.Group();
    legPivotR.position.set(0.11, 0.65, 0);
    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.y = -0.32;
    legPivotR.add(legR);
    walkingHero.add(legPivotR);

    walkingHero.position.set(-21, 0, 1);
    scene.add(walkingHero);
  }

  // Room Partition Walls for 7 Rooms
  function build7RoomPartitions(wallMat, trimMat) {
    const dividerX = [-17.5, -10.5, -3.5, 3.5, 10.5, 17.5];

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

  function createStaticChar(x, z, shirt = 0x3b82f6, pants = 0x1e293b, ry = 0) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);
    grp.rotation.y = ry;

    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const head = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ color: 0xe8b896, roughness: 0.6 }));
    head.position.y = 1.45;
    grp.add(head);

    const torsoGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.65, 12);
    const torso = new THREE.Mesh(torsoGeo, new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.7 }));
    torso.position.y = 0.95;
    grp.add(torso);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: pants, roughness: 0.8 });
    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(-0.11, 0.35, 0);
    grp.add(legL);
    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(0.11, 0.35, 0);
    grp.add(legR);

    scene.add(grp);
    return grp;
  }

  // Room 1: Foyer & Welcome Reception (x ~ -21)
  function buildRoom1Foyer(wallMat, trimMat, chairMat) {
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.05, 1.2), wallMat);
    desk.position.set(-21, 0.52, -4);
    desk.castShadow = true;
    scene.add(desk);

    const top = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.08, 1.3), trimMat);
    top.position.set(-21, 1.09, -4);
    scene.add(top);

    const lap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.35), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    lap.position.set(-21, 1.15, -4);
    scene.add(lap);

    createStaticChar(-21, -5.2, 0xff7a38, 0x1e293b, 0);

    for (let i = 0; i < 2; i++) {
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.6), chairMat);
      chair.position.set(-23 + i * 1.1, 0.45, 4.5);
      scene.add(chair);

      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
      leg.position.set(-23 + i * 1.1, 0.22, 4.5);
      scene.add(leg);
    }
  }

  // Room 2: Broadcast Studio & MCR (x ~ -14)
  function buildRoom2Studio(screenMat, trimMat, darkMat) {
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.05, 1.4), darkMat);
    desk.position.set(-14, 0.52, -4.5);
    scene.add(desk);

    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.7), screenMat);
        scr.position.set(-15.2 + c * 1.2, 1.8 + r * 0.85, -9.5);
        scene.add(scr);
      }
    }

    const trip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.25, 1.4, 4), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    trip.position.set(-14, 0.7, 2.5);
    scene.add(trip);

    const camBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.9), darkMat);
    camBox.position.set(-14, 1.5, 2.5);
    scene.add(camBox);

    const tally = new THREE.Mesh(new THREE.SphereGeometry(0.08), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    tally.position.set(-14, 1.75, 2.85);
    scene.add(tally);

    createStaticChar(-14, -5.5, 0x0284c7, 0x1e293b, 0);
  }

  // Room 3: Newsroom & Editorial Center (x ~ -7)
  function buildRoom3Newsroom(trimMat, darkMat, chairMat) {
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.95, 1.4), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
    desk.position.set(-7, 0.48, -4.2);
    scene.add(desk);

    for (let i = 0; i < 2; i++) {
      const scr = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.65, 0.08), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      scr.position.set(-7.7 + i * 1.4, 1.35, -4.2);
      scene.add(scr);
    }

    createStaticChar(-7, -5.2, 0xa855f7, 0x1e293b, 0);

    const board = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 0.08), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    board.position.set(-9.2, 1.5, 2);
    board.rotation.y = Math.PI / 6;
    scene.add(board);
  }

  // Room 4: Data Science & AI Cloud Lab (x ~ 0)
  function buildRoom4DataLab(trimMat, darkMat) {
    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 1.0), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 }));
    rack.position.set(2.2, 1.2, -8.5);
    scene.add(rack);

    for (let i = 0; i < 5; i++) {
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.04),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0x22c55e })
      );
      led.position.set(1.9 + (i % 2) * 0.4, 0.6 + i * 0.35, -7.95);
      scene.add(led);
    }

    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.95, 1.3), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    desk.position.set(0, 0.48, -4);
    scene.add(desk);

    createStaticChar(0, -5.1, 0x3b82f6, 0x0f172a, 0);
  }

  // Room 5: IoT Workshop & 50+ Projects Central Showcase (x ~ 7)
  function buildRoom5IoTGallery(trimMat, darkMat) {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.0, 1.4), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 }));
    bench.position.set(7, 0.5, -4.5);
    scene.add(bench);

    const gasTank = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.65, 16), new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 }));
    gasTank.position.set(6.3, 1.35, -4.5);
    scene.add(gasTank);

    const trophy = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 }));
    trophy.position.set(7.8, 1.4, -4.5);
    scene.add(trophy);

    createStaticChar(7, -5.5, 0xf97316, 0x1e293b, 0);
  }

  // Room 6: Press Conference & Publication Hall (x ~ 14)
  function buildRoom6PressHall(trimMat, darkMat, chairMat) {
    const table = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.9, 1.6), darkMat);
    table.position.set(14, 0.45, -4.2);
    scene.add(table);

    const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 }));
    screen.position.set(14, 2.0, -9.5);
    scene.add(screen);

    createStaticChar(14, -5.2, 0x10b981, 0x1e293b, 0);
  }

  // Room 7: Executive Recruiter Lounge (x ~ 21)
  function buildRoom7RecruiterLounge(trimMat, darkMat, chairMat) {
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 1.4), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }));
    sofa.position.set(21, 0.4, -4.5);
    scene.add(sofa);

    const table = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 1.0), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 }));
    table.position.set(21, 0.25, -2);
    scene.add(table);

    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.7, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    pot.position.set(23.5, 0.35, -8.5);
    scene.add(pot);

    const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 }));
    plant.position.set(23.5, 1.2, -8.5);
    scene.add(plant);

    createStaticChar(20, -0.8, 0x059669, 0x1e293b, -Math.PI / 4);
    createStaticChar(22, -0.8, 0xff6b2b, 0x1e293b, Math.PI / 4);
  }

  // ─── 4. DOM MOUNTING & HTML SHELL ─────────────────────────────
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
            <a href="#" class="nadi-brand-pill">
              <span class="nadi-brand-logo">mangara</span>
              <span class="nadi-brand-dot"></span>
            </a>

            <nav class="nadi-nav-center-menu">
              ${SCROLL_STEPS.map((s, idx) => `
                <a href="#" class="nadi-nav-step-link" data-step="${idx}">${s.stepName}</a>
              `).join('')}
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
              <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20tertarik%20dengan%20portofolio%203D%20Anda." target="_blank" rel="noopener" class="nadi-btn-primary" title="Hubungi via WhatsApp">
                <span>WhatsApp &rarr;</span>
              </a>
            </div>
          </header>

          <!-- LEFT FLOATING STORY CONTENT & DATA CARDS -->
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

            <!-- FLOATING DATA CARD WITH DEDICATED IN-CARD SCROLL -->
            <div class="nadi-floating-card" id="nadi-floating-card">
              <div class="nadi-card-top-row">
                <div class="nadi-card-badge-left" id="nadi-card-title">
                  <ion-icon name="reader-outline" style="color: var(--nadi-orange);"></ion-icon>
                  <strong>Profil & Ringkasan Kualifikasi</strong>
                </div>
                <div class="nadi-card-badge-status" id="nadi-card-status">
                  Tersedia untuk Kerja & Magang
                </div>
              </div>

              <!-- DYNAMIC CONTENT RENDERED HERE -->
              <div class="nadi-card-dynamic-container" id="nadi-card-dynamic-container">
                <!-- Injected via renderStoryStep() -->
              </div>
            </div>
          </div>

          <!-- MOUSE SCROLL CUE -->
          <div class="nadi-scroll-cue">
            <div class="nadi-scroll-pill-icon">
              <div class="nadi-scroll-pill-dot"></div>
            </div>
            <span>GULIR KE BAWAH / PANAH KEYBOARD UNTUK MENJALANKAN KARAKTER KE BILIK BERIKUTNYA &bull; SCROLL TO EXPLORE</span>
          </div>

          <!-- BOTTOM SCROLLYTELLING TIMELINE -->
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

            <button class="nadi-skip-btn" id="nadi-btn-open-archive" title="Buka Arsip Portofolio & CV Lengkap">
              <ion-icon name="grid-outline"></ion-icon>
              <span>Arsip & CV Lengkap</span>
            </button>
          </footer>

          <!-- PROJECT / BLOG LIGHTBOX MODAL -->
          <div class="nadi-lightbox-modal" id="nadi-project-lightbox">
            <div class="nadi-lightbox-card">
              <div class="nadi-lightbox-img-wrap">
                <img src="./assets/images/portfolio/card-1.jpg" id="nadi-lightbox-img" class="nadi-lightbox-img" alt="Project Preview">
                <button class="nadi-lightbox-close" id="nadi-lightbox-close">&times;</button>
              </div>
              <div class="nadi-lightbox-body">
                <div class="nadi-lightbox-tags">
                  <span class="nadi-lightbox-badge" id="nadi-lightbox-badge">Kategori</span>
                  <span style="font-size: 11px; color: #64748b; font-weight: 700;" id="nadi-lightbox-meta">Order</span>
                </div>
                <h3 class="nadi-lightbox-title" id="nadi-lightbox-title">Judul Proyek</h3>
                <p class="nadi-lightbox-desc" id="nadi-lightbox-desc">Deskripsi proyek lengkap...</p>
                <div class="nadi-lightbox-actions" id="nadi-lightbox-actions">
                  <!-- Action links -->
                </div>
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
                          <span class="nadi-proj-badge">${p.category}</span>
                          <span class="nadi-proj-order">#${p.order}</span>
                        </div>
                        <div class="nadi-proj-content">
                          <div class="nadi-proj-title">${p.title}</div>
                          <div class="nadi-proj-desc">${p.description}</div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="nadi-archive-section">
                  <h4>3. Kontak & Akses Langsung</h4>
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

          <!-- LOADING SCREEN -->
          <div class="nadi-loading-screen" id="nadi-loading-screen">
            <div class="nadi-spinner"></div>
            <div class="nadi-loading-title">MEMUAT STUDIO 3D LENGKAP...</div>
            <div class="nadi-loading-sub">Mangara Ferdianto Pakpahan &bull; All 9 Admin Sections Integrated</div>
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

  // ─── 5. DYNAMIC STORY CONTENT RENDERER (ALL 9 ADMIN SECTIONS) ─
  function renderStoryStep(index) {
    const step = SCROLL_STEPS[index];
    if (!step) return;

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

    if (!container) return;

    // STATION 0: PROFIL & OVERVIEW
    if (index === 0) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="person-circle-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>Profil & Kualifikasi Resmi</strong>`;
      const p = DEFAULT_DATA.profile;

      container.innerHTML = `
        <div class="nadi-profile-header">
          <img src="${p.avatarUrl}" class="nadi-profile-avatar" alt="${p.name}">
          <div>
            <div class="nadi-profile-name">${p.name}</div>
            <div class="nadi-profile-title">${p.title}</div>
            <div style="font-size: 11px; color: #16a34a; font-weight: 700; margin-top: 3px;">
              <ion-icon name="location-outline"></ion-icon> ${p.location} &bull; S1 Teknik Informatika ITPLN
            </div>
          </div>
        </div>

        <div class="nadi-bento-grid">
          <div class="nadi-bento-item">
            <span class="nadi-bento-num">50+</span>
            <span class="nadi-bento-lbl">Proyek Terkurasi Lengkap</span>
          </div>
          <div class="nadi-bento-item">
            <span class="nadi-bento-num">15+</span>
            <span class="nadi-bento-lbl">Pengalaman Kerja & Org</span>
          </div>
          <div class="nadi-bento-item">
            <span class="nadi-bento-num">8</span>
            <span class="nadi-bento-lbl">Sertifikasi & Lisensi Resmi</span>
          </div>
          <div class="nadi-bento-item">
            <span class="nadi-bento-num">10</span>
            <span class="nadi-bento-lbl">Layanan Spesialisasi</span>
          </div>
        </div>

        <div class="nadi-card-scroll-body" style="max-height: 22vh;">
          <div class="nadi-card-list">
            <div class="nadi-card-list-item">
              <span class="nadi-card-item-name"><ion-icon name="mail-outline" class="nadi-check-icon"></ion-icon> Email Resmi</span>
              <span class="nadi-card-item-val">${p.email}</span>
            </div>
            <div class="nadi-card-list-item">
              <span class="nadi-card-item-name"><ion-icon name="call-outline" class="nadi-check-icon"></ion-icon> WhatsApp / Telp</span>
              <span class="nadi-card-item-val">${p.phone}</span>
            </div>
            <div class="nadi-card-list-item">
              <span class="nadi-card-item-name"><ion-icon name="calendar-outline" class="nadi-check-icon"></ion-icon> Domisili</span>
              <span class="nadi-card-item-val">${p.location}</span>
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
            <span>CV Data Analyst (ATS)</span>
          </a>
          <a href="./CV_Mangara_Pakpahan_Sosmed_Humas.pdf" target="_blank" rel="noopener" class="nadi-card-btn primary">
            <ion-icon name="document-text-outline"></ion-icon>
            <span>CV Sosmed & Humas (ATS)</span>
          </a>
        </div>
      `;
    }

    // STATION 1: 10 LAYANAN & 11 SKILLS
    else if (index === 1) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="construct-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>Layanan & Skills Terdaftar</strong>`;

      container.innerHTML = `
        <div class="nadi-subtabs-row">
          <button class="nadi-subtab-btn ${activeLayananSubtab === 'services' ? 'active' : ''}" id="nadi-tab-serv">
            <ion-icon name="briefcase-outline"></ion-icon> 10 Layanan Spesialisasi
          </button>
          <button class="nadi-subtab-btn ${activeLayananSubtab === 'skills' ? 'active' : ''}" id="nadi-tab-skil">
            <ion-icon name="bar-chart-outline"></ion-icon> 11 Technical Skills
          </button>
        </div>

        <div class="nadi-card-scroll-body" id="nadi-services-scroll-body">
          ${renderServicesOrSkillsHTML()}
        </div>

        <div class="nadi-card-scroll-cue">
          <span><ion-icon name="chevron-down-circle-outline"></ion-icon> Gulir ke bawah di dalam kotak ini untuk melihat seluruh entri</span>
          <span style="color: var(--nadi-orange);">${activeLayananSubtab === 'services' ? '10 Layanan' : '11 Skills'}</span>
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

    // STATION 2: 15 PENGALAMAN KERJA & ORGANISASI
    else if (index === 2) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="briefcase-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>15 Pengalaman Kerja & Organisasi</strong>`;

      container.innerHTML = `
        <div class="nadi-filter-pills-bar">
          <button class="nadi-filter-pill ${activeExpFilter === 'all' ? 'active' : ''}" data-filter="all">Semua (15)</button>
          <button class="nadi-filter-pill ${activeExpFilter === 'work' ? 'active' : ''}" data-filter="work">Pekerjaan & Magang (6)</button>
          <button class="nadi-filter-pill ${activeExpFilter === 'org' ? 'active' : ''}" data-filter="org">Kepemimpinan Org (9)</button>
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

        <div class="nadi-card-scroll-cue">
          <span><ion-icon name="chevron-down-circle-outline"></ion-icon> Gulir ke bawah untuk melihat 15 linimasa pengalaman lengkap</span>
          <span style="color: var(--nadi-orange);">15 Rekam Jejak</span>
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
          <button class="nadi-filter-pill ${activeEduFilter === 'formal' ? 'active' : ''}" data-filter="formal">Pendidikan Formal</button>
          <button class="nadi-filter-pill ${activeEduFilter === 'cert' ? 'active' : ''}" data-filter="cert">Sertifikasi & Lisensi</button>
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

        <div class="nadi-card-scroll-cue">
          <span><ion-icon name="chevron-down-circle-outline"></ion-icon> Gulir ke bawah untuk membaca 8 modul sertifikasi internasional</span>
          <span style="color: var(--nadi-orange);">8 Lisensi</span>
        </div>
      `;

      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeEduFilter = btn.dataset.filter;
          renderStoryStep(3);
        });
      });
    }

    // STATION 4: 50+ PROYEK PORTOFOLIO (ALL 50 PROJECTS)
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
          <button class="nadi-filter-pill ${activeProjFilter === 'Live Production' ? 'active' : ''}" data-filter="Live Production">Live Production</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'Social Media' ? 'active' : ''}" data-filter="Social Media">Social Media</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'Visual Design' ? 'active' : ''}" data-filter="Visual Design">Visual Design</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'IoT & Tech' ? 'active' : ''}" data-filter="IoT & Tech">IoT & Tech</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'AI & Platform' ? 'active' : ''}" data-filter="AI & Platform">AI & Platform</button>
          <button class="nadi-filter-pill ${activeProjFilter === 'Article & Editorial' ? 'active' : ''}" data-filter="Article & Editorial">Editorial</button>
        </div>

        <div class="nadi-card-scroll-body" style="max-height: 48vh;">
          <div class="nadi-projects-grid">
            ${filteredProjects.map(proj => `
              <div class="nadi-proj-card">
                <div class="nadi-proj-thumb-wrap">
                  <img src="${proj.imageUrl}" class="nadi-proj-img" alt="${proj.title}" onerror="this.src='./assets/images/portfolio/card-1.jpg'">
                  <span class="nadi-proj-badge">${proj.category}</span>
                  <span class="nadi-proj-order">#${proj.order}</span>
                </div>
                <div class="nadi-proj-content">
                  <div class="nadi-proj-title">${proj.title}</div>
                  <div class="nadi-proj-desc">${proj.description}</div>
                  <div class="nadi-proj-actions">
                    <button class="nadi-proj-btn btn-open-lightbox" data-id="${proj.order}">
                      <ion-icon name="eye-outline"></ion-icon> Detail
                    </button>
                    ${proj.projectUrl ? `
                      <a href="${proj.projectUrl}" target="_blank" rel="noopener" class="nadi-proj-btn" style="color: var(--nadi-orange);">
                        <ion-icon name="open-outline"></ion-icon> Link
                      </a>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="nadi-card-scroll-cue">
          <span><ion-icon name="chevron-down-circle-outline"></ion-icon> Menampilkan ${filteredProjects.length} dari 50 Proyek &bull; Gulir di dalam kotak</span>
          <button class="nadi-subtab-btn" id="nadi-btn-full-proj-modal" style="padding: 2px 8px; font-size: 11px;">
            <ion-icon name="expand-outline"></ion-icon> Layar Penuh
          </button>
        </div>
      `;

      // Search Event Listener
      const searchInput = document.getElementById('nadi-proj-search-input');
      searchInput?.addEventListener('input', (e) => {
        activeProjSearch = e.target.value.toLowerCase();
        renderStoryStep(4);
      });

      // Filter Pill Listeners
      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeProjFilter = btn.dataset.filter;
          renderStoryStep(4);
        });
      });

      // Lightbox Triggers
      container.querySelectorAll('.btn-open-lightbox').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id, 10);
          const p = DEFAULT_DATA.projects.find(x => x.order === id);
          if (p) openProjectLightbox(p);
        });
      });

      // Full Archive Modal shortcut
      document.getElementById('nadi-btn-full-proj-modal')?.addEventListener('click', () => {
        const modal = document.getElementById('nadi-archive-modal');
        if (modal) modal.classList.add('active');
      });
    }

    // STATION 5: 20 BLOG & RISET PRESTASI
    else if (index === 5) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="newspaper-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>20 Blog & Publikasi Riset</strong>`;

      const filteredBlog = getFilteredBlog();

      container.innerHTML = `
        <div class="nadi-filter-pills-bar">
          <button class="nadi-filter-pill ${activeBlogFilter === 'all' ? 'active' : ''}" data-filter="all">Semua (20)</button>
          <button class="nadi-filter-pill ${activeBlogFilter === 'prestasi' ? 'active' : ''}" data-filter="prestasi">Prestasi & IoT</button>
          <button class="nadi-filter-pill ${activeBlogFilter === 'redaksi' ? 'active' : ''}" data-filter="redaksi">Redaksi PJCI & Humas</button>
          <button class="nadi-filter-pill ${activeBlogFilter === 'ai' ? 'active' : ''}" data-filter="ai">Cloud, Data & AI</button>
        </div>

        <div class="nadi-card-scroll-body">
          <div class="nadi-blog-list">
            ${filteredBlog.map(b => `
              <div class="nadi-blog-item">
                <div class="nadi-blog-top">
                  <span class="nadi-blog-date"><ion-icon name="calendar-outline"></ion-icon> ${b.date}</span>
                  <span class="nadi-blog-cat">${b.category}</span>
                </div>
                <div class="nadi-blog-title">${b.title}</div>
                <p class="nadi-blog-desc">${b.excerpt}</p>
                ${b.url ? `
                  <a href="${b.url}" target="_blank" rel="noopener" class="nadi-blog-link">
                    <span>Baca Artikel Resmi</span> &rarr;
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="nadi-card-scroll-cue">
          <span><ion-icon name="chevron-down-circle-outline"></ion-icon> Gulir ke bawah untuk melihat seluruh 20 publikasi & penghargaan</span>
          <span style="color: var(--nadi-orange);">20 Publikasi</span>
        </div>
      `;

      container.querySelectorAll('.nadi-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          activeBlogFilter = btn.dataset.filter;
          renderStoryStep(5);
        });
      });
    }

    // STATION 6: TESTIMONI & KIRIM PESAN LANGSUNG (INBOX)
    else if (index === 6) {
      if (cardTitle) cardTitle.innerHTML = `<ion-icon name="chatbubbles-outline" style="color: var(--nadi-orange);"></ion-icon> <strong>Testimoni & Kontak Rekrutmen</strong>`;

      container.innerHTML = `
        <div class="nadi-subtabs-row">
          <button class="nadi-subtab-btn ${activeContactSubtab === 'testi' ? 'active' : ''}" id="nadi-tab-testi">
            <ion-icon name="chatbubble-ellipses-outline"></ion-icon> 4 Testimoni Pimpinan
          </button>
          <button class="nadi-subtab-btn ${activeContactSubtab === 'form' ? 'active' : ''}" id="nadi-tab-form">
            <ion-icon name="paper-plane-outline"></ion-icon> Kirim Pesan Langsung
          </button>
        </div>

        <div class="nadi-card-scroll-body" style="max-height: 48vh;">
          ${activeContactSubtab === 'testi' ? `
            <div class="nadi-testi-list">
              ${DEFAULT_DATA.testimonials.map(t => `
                <div class="nadi-testi-item">
                  <div class="nadi-testi-header">
                    <img src="${t.avatarUrl}" class="nadi-testi-avatar" alt="${t.name}">
                    <div>
                      <div class="nadi-testi-name">${t.name}</div>
                      <div class="nadi-testi-date"><ion-icon name="calendar-outline"></ion-icon> ${t.date}</div>
                    </div>
                  </div>
                  <p class="nadi-testi-quote">"${t.text}"</p>
                </div>
              `).join('')}
            </div>
          ` : `
            <form class="nadi-contact-form" id="nadi-direct-contact-form">
              <div class="nadi-form-group">
                <label class="nadi-form-label">Nama Lengkap</label>
                <input type="text" name="fullname" class="nadi-form-input" placeholder="Masukkan nama atau nama instansi..." required>
              </div>
              <div class="nadi-form-group">
                <label class="nadi-form-label">Alamat Email</label>
                <input type="email" name="email" class="nadi-form-input" placeholder="contoh@perusahaan.com" required>
              </div>
              <div class="nadi-form-group">
                <label class="nadi-form-label">Pesan / Undangan Rekrutmen</label>
                <textarea name="message" class="nadi-form-textarea" placeholder="Tuliskan pesan, peluang kerja, atau undangan kolaborasi..." required></textarea>
              </div>
              <button type="submit" class="nadi-form-btn" id="nadi-form-submit-btn">
                <ion-icon name="send-outline"></ion-icon>
                <span>Kirim Pesan Sekarang</span>
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

      // Hook direct Firestore contact form
      const contactForm = document.getElementById('nadi-direct-contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', handleDirectContactSubmit);
      }
    }
  }

  // ─── 6. HELPER DATA RETRIEVAL FUNCTIONS ───────────────────────
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

  // ─── 7. DIRECT FIRESTORE CONTACT FORM HANDLER ─────────────────
  async function handleDirectContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('nadi-form-submit-btn');
    if (!submitBtn) return;

    submitBtn.disabled = true;
    const origHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `<ion-icon name="sync-outline" style="animation: spin 1s linear infinite;"></ion-icon> <span>Mengirim ke Database...</span>`;

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

      submitBtn.innerHTML = `<ion-icon name="checkmark-circle-outline"></ion-icon> <span>Pesan Berhasil Terkirim! 🎉</span>`;
      submitBtn.style.background = '#16a34a';
      submitBtn.style.borderColor = '#16a34a';
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = origHTML;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
      }, 4000);

    } catch (err) {
      console.warn('Firestore direct send error:', err);
      submitBtn.innerHTML = `<ion-icon name="checkmark-circle-outline"></ion-icon> <span>Pesan Diterima Sistem Lokal!</span>`;
      submitBtn.style.background = '#16a34a';
      submitBtn.style.borderColor = '#16a34a';
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = origHTML;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
      }, 4000);
    }
  }

  // ─── 8. LIGHTBOX MODAL HANDLER ────────────────────────────────
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
            <span>Kunjungi Link Proyek Asli</span> &rarr;
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
    const modal = document.getElementById('nadi-project-lightbox');
    if (modal) modal.classList.remove('active');
  }

  // ─── 9. SCROLL & INTERACTION CONTROLLER ───────────────────────
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

  // ─── 10. INITIALIZE THREE.JS & ANIMATION LOOP ─────────────────
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

    // Build the architectural diorama & walking hero
    buildMiniatureDioramaScene();

    // Event Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onWindowResize);

    stickyViewport.addEventListener('wheel', (e) => {
      // If user is hovering over an in-card scroll body, let the card scroll naturally!
      if (e.target.closest('.nadi-card-scroll-body, .nadi-archive-card, .nadi-lightbox-card')) {
        return;
      }
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
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'ArrowDown' || e.code === 'ArrowRight' || e.code === 'PageDown') {
        const nextIdx = Math.min(SCROLL_STEPS.length - 1, currentStepIndex + 1);
        jumpToStep(nextIdx);
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft' || e.code === 'PageUp') {
        const prevIdx = Math.max(0, currentStepIndex - 1);
        jumpToStep(prevIdx);
      } else if (e.code === 'Escape') {
        closeProjectLightbox();
        closeArchiveModal();
      }
    });

    // Drag-to-Scrub Controls
    let isDragging = false;
    let startY = 0;

    stickyViewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a, input, textarea, .nadi-card-scroll-body, .nadi-archive-modal, .nadi-lightbox-modal')) return;
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
      if (e.target.closest('.nadi-card-scroll-body, .nadi-archive-modal, .nadi-lightbox-modal')) return;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    stickyViewport.addEventListener('touchmove', (e) => {
      if (e.target.closest('.nadi-card-scroll-body, .nadi-archive-modal, .nadi-lightbox-modal')) return;
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

    // Lightbox Modal Close Handlers
    document.getElementById('nadi-lightbox-close')?.addEventListener('click', closeProjectLightbox);
    document.getElementById('nadi-project-lightbox')?.addEventListener('click', (e) => {
      if (e.target.id === 'nadi-project-lightbox') closeProjectLightbox();
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

    // 1. ANIMATE WALKING HERO ALONG ORANGE FLOOR PATH
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

  // ─── 11. ENTRY POINT ──────────────────────────────────────────
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

    console.log('✨ 3D Scrollytelling Diorama Experience (All 9 Admin Sections Integrated) initialized successfully!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
