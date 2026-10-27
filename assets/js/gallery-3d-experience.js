/**
 * gallery-3d-experience.js
 * 3D Scrollytelling Camera Flight & Interactive Miniature Studio
 * Inspired by "nadi." Healthcare Diorama Experience
 * - Smooth scroll-driven camera flight along an architectural miniature studio
 * - Cutaway diorama architecture with signature orange guide path & wall trims
 * - 6 Curated Stations: Profil -> Live Broadcast -> Sosmed & Humas -> Data & AI -> IoT Inovasi -> Rekrutmen
 * - Synchronized Floating Data Cards with real portfolio metrics
 * - Bottom step timeline with jump-to-step navigation & Skip button
 * - Preserves all existing portfolio data, Firebase, and full document view
 */

import { DEFAULT_DATA } from './default-data.js';

(function () {
  'use strict';

  // ─── 1. GLOBAL STATE & THREE.JS REFERENCES ────────────────────
  let scene, camera, renderer;
  let canvas, stickyViewport, scrollyTrack;
  let animFrameId = null;
  let textureLoader = null;

  // Camera flight interpolation targets
  let targetProgress = 0;
  let currentProgress = 0;
  let currentStepIndex = 0;

  const currentCamPos = new THREE.Vector3(-20, 8.5, 12.5);
  const currentLookAt = new THREE.Vector3(-20, 1.2, 0);

  // ─── 2. SCROLLYTELLING STEP DEFINITIONS ─────────────────────────
  const SCROLL_STEPS = [
    {
      stepNum: "01",
      stepName: "Profil",
      category: "LANGKAH 01 • PROFIL & KUALIFIKASI",
      title: "Kreativitas Bertemu Rekayasa Data.",
      desc: "Mahasiswa S1 Teknik Informatika Institut Teknologi PLN dengan rekam jejak teruji sebagai Creative Director siaran nasional, Social Media Specialist resmi, dan Data Analyst bersertifikasi.",
      badgeStatus: "Tersedia untuk Kerja",
      badgeStatusColor: "green",
      cardTitle: "Ringkasan Kualifikasi Utama",
      items: [
        { label: "Pendidikan Formal", val: "S1 Teknik Informatika ITPLN" },
        { label: "Fokus Keahlian", val: "Data Science & Media Director" },
        { label: "Domisili & Kesiapan", val: "Jakarta • Siap Kerja / Magang" },
        { label: "Portofolio Terkurasi", val: "50+ Proyek & Karya Nyata" }
      ],
      actions: [
        { label: "Unduh CV Data Analyst", url: "./CV_Mangara_Pakpahan_Data_Analyst.pdf", primary: true },
        { label: "Unduh CV Sosmed & Humas", url: "./CV_Mangara_Pakpahan_Sosmed_Humas.pdf", primary: false }
      ],
      cam: { x: -20, y: 8.5, z: 12.5 },
      look: { x: -20, y: 1.2, z: 0 }
    },
    {
      stepNum: "02",
      stepName: "Siaran Langsung",
      category: "LANGKAH 02 • LIVE PRODUCTION",
      title: "Kendali Penuh Siaran Skala Nasional.",
      desc: "Memimpin produksi siaran langsung berskala nasional ribuan penonton. Mengatur multi-kamera, video switcher, audio mixing, timing siaran, hingga live graphics berstandar broadcast TV profesional.",
      badgeStatus: "Produksi Siaran Sukses",
      badgeStatusColor: "orange",
      cardTitle: "Riwayat Produksi Siaran Utama",
      items: [
        { label: "Wisuda ke-46 ITPLN", val: "Lead Live Switcher (Auditorium)" },
        { label: "Studium Generale Nuklir", val: "Director & Multi-Camera Setup" },
        { label: "Kontrak Kerja PT PLN (Persero)", val: "Live Stream YouTube & LED Wall" },
        { label: "Seleksi APERTI BUMN 2024", val: "Operator Visual & Audio Mixer" }
      ],
      actions: [
        { label: "Lihat Showcase Video", url: "#main-portfolio-content", primary: true },
        { label: "Hubungi untuk Produksi", url: "https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20tertarik%20dengan%20keahlian%20Live%20Production%20Anda.", primary: false }
      ],
      cam: { x: -12, y: 8.2, z: 12.0 },
      look: { x: -12, y: 1.4, z: 0 }
    },
    {
      stepNum: "03",
      stepName: "Sosmed & Humas",
      category: "LANGKAH 03 • MEDIA SOSIAL & HUMAS",
      title: "Strategi Konten & Pertumbuhan 3x Lipat.",
      desc: "Mengelola kanal media sosial resmi serta portal web redaksi berita. Menerapkan strategi visual interaktif yang berhasil melipatgandakan engagement rate hingga 300% dan mengelola humas korporat.",
      badgeStatus: "3x Lipat Pertumbuhan",
      badgeStatusColor: "orange",
      cardTitle: "Kanal Resmi yang Dikelola",
      items: [
        { label: "@itpln (Kampus Energi)", val: "Engagement Naik 300%" },
        { label: "@smartgridindonesia (PJCI)", val: "Koordinator Tim Liputan" },
        { label: "Portal Redaksi pjci.or.id", val: "Penulis & Editor Berita Web" },
        { label: "Company Profile ITPLN Media", val: "Koordinator Tim Kreatif" }
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
      category: "LANGKAH 04 • DATA SCIENCE & AI",
      title: "Analitik Data & Machine Learning.",
      desc: "Menguasai analisis data empiris kuantitatif, permodelan SEM-PLS (120 JP), sertifikasi resmi Microsoft Azure Databricks Machine Learning (8 modul), automasi Excel tingkat lanjut, dan AI Agents.",
      badgeStatus: "Tersertifikasi Resmi",
      badgeStatusColor: "green",
      cardTitle: "Sertifikasi & Lisensi Resmi",
      items: [
        { label: "Azure Databricks ML", val: "Microsoft (8 Modul Resmi)" },
        { label: "SEM-PLS Riset Kuantitatif", val: "PT Educativa (120 JP)" },
        { label: "MOS Excel 2019", val: "Microsoft Office Specialist" },
        { label: "Student Ambassador", val: "DQLab (Python & SQL)" }
      ],
      actions: [
        { label: "Unduh CV Data Analyst (ATS)", url: "./CV_Mangara_Pakpahan_Data_Analyst.pdf", primary: true },
        { label: "Lihat Sertifikat Lengkap", url: "#main-portfolio-content", primary: false }
      ],
      cam: { x: 4, y: 8.2, z: 12.0 },
      look: { x: 4, y: 1.3, z: 0 }
    },
    {
      stepNum: "05",
      stepName: "Inovasi IoT",
      category: "LANGKAH 05 • REKAYASA IOT & RISET",
      title: "Inovasi IoT LPG-SafeSense & Hibah DIKTI.",
      desc: "Merancang perangkat cerdas pendeteksi kebocoran gas LPG dan pemantau volume tabung terintegrasi cloud & mobile apps. Meraih Juara 1 Nasional MKI & ITPLN serta pendanaan riset Kemendikbudristek PKM Level 1.",
      badgeStatus: "Juara 1 Nasional",
      badgeStatusColor: "orange",
      cardTitle: "Pencapaian Inovasi & Prestasi",
      items: [
        { label: "IoT LPG-SafeSense", val: "Juara 1 Inovasi MKI & ITPLN" },
        { label: "Hibah Riset PKM Level 1", val: "Kemendikbudristek DIKTI" },
        { label: "Desain Poster Nasional", val: "Juara 1 IPB Ocean Day" },
        { label: "National CAD Competition 2025", val: "Ketua Pelaksana Nasional" }
      ],
      actions: [
        { label: "Buka Dokumen Riset & Proyek", url: "#main-portfolio-content", primary: true },
        { label: "Chat Diskusi Proyek", url: "https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20tertarik%20dengan%20proyek%20IoT%20SafeSense%20Anda.", primary: false }
      ],
      cam: { x: 12, y: 8.2, z: 12.0 },
      look: { x: 12, y: 1.3, z: 0 }
    },
    {
      stepNum: "06",
      stepName: "Rekrutmen",
      category: "LANGKAH 06 • KONSULTASI & REKRUTMEN",
      title: "Siap Kolaborasi & Membangun Dampak.",
      desc: "Terbuka untuk kesempatan kerja penuh waktu, magang korporat, konsultan media, maupun proyek profesional. Akses kontak langsung dan berkas resmi untuk mempercepat proses rekrutmen Anda.",
      badgeStatus: "Respons Cepat 24 Jam",
      badgeStatusColor: "green",
      cardTitle: "Hubungi & Rekrut Mangara",
      items: [
        { label: "WhatsApp Resmi", val: "0813-1881-6058 (Aktif)" },
        { label: "Email Bisnis", val: "mangarapakpahan51@gmail.com" },
        { label: "LinkedIn Terhubung", val: "in/mangara-ferdianto-pakpahan" },
        { label: "GitHub Portofolio", val: "github.com/mangarapakpahan-cmd" }
      ],
      actions: [
        { label: "Chat WhatsApp Sekarang", url: "https://wa.me/6281318816058?text=Halo%20Mangara,%20kami%20tertarik%20mengundang%20Anda%20untuk%20peluang%20rekrutmen.", primary: true },
        { label: "Buka Dokumen Lengkap", url: "#main-portfolio-content", primary: false }
      ],
      cam: { x: 20, y: 8.5, z: 12.5 },
      look: { x: 20, y: 1.2, z: 0 }
    }
  ];

  // ─── 3. CUTAWAY ARCHITECTURAL DIORAMA BUILDER ─────────────────
  function buildMiniatureDioramaScene() {
    // A. Clean Bright Ambient & Sun Lighting
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

    // Fill soft light from front
    const fillLight = new THREE.DirectionalLight(0xffedd5, 0.4);
    fillLight.position.set(-15, 20, 25);
    scene.add(fillLight);

    // B. Base Materials
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

    // C. Continuous Floor Slab (Covering all 6 rooms)
    const floorGeo = new THREE.BoxGeometry(60, 0.5, 20);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.25, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Outer Back Wall (South boundary) with Orange Top Cap
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

    // D. SIGNATURE CONTINUOUS ORANGE GUIDE LINE (Persis seperti gambar Nadi!)
    createOrangeGuideTrack();

    // E. ROOM PARTITION WALLS & ROOM-BY-ROOM MINIATURES
    buildRoomPartitions(wallBodyMat, orangeTrimMat);
    buildRoom1Foyer(wallBodyMat, orangeTrimMat, chairOrangeMat);
    buildRoom2MCR(screenGlowMat, orangeTrimMat, darkWoodMat);
    buildRoom3Newsroom(orangeTrimMat, darkWoodMat, chairOrangeMat);
    buildRoom4DataLab(orangeTrimMat, darkWoodMat);
    buildRoom5IoTWorkshop(orangeTrimMat, darkWoodMat);
    buildRoom6Lounge(orangeTrimMat, darkWoodMat, chairOrangeMat);
  }

  // Signature Orange Guide Path across all rooms
  function createOrangeGuideTrack() {
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0xff6b2b,
      roughness: 0.35,
      metalness: 0.1
    });

    // Curved sequence of track segments
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

    const curve = new THREE.CatmullRomCurve3D(points);
    const curvePoints = curve.getPoints(120);

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

  // Room Partition Walls with signature Orange Trim Tops
  function buildRoomPartitions(wallMat, trimMat) {
    const dividerX = [-16, -8, 0, 8, 16];

    for (const x of dividerX) {
      // Back section of partition wall
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

      // Front section leaving a 3.5m open doorway in middle
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

  // Helper: Stylized Miniature Low-Poly Character
  function createMiniCharacter(x, z, shirtColor = 0xff6b2b, pantsColor = 0x1e293b, ry = 0) {
    const charGroup = new THREE.Group();
    charGroup.position.set(x, 0, z);
    charGroup.rotation.y = ry;

    // Head
    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8b896, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.45;
    charGroup.add(head);

    // Torso / Shirt
    const torsoGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.65, 12);
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.7 });
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 0.95;
    charGroup.add(torso);

    // Legs / Pants
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
    // Reception Counter Desk (warm white with orange counter top)
    const deskGeo = new THREE.BoxGeometry(3.6, 1.05, 1.2);
    const desk = new THREE.Mesh(deskGeo, wallMat);
    desk.position.set(-20, 0.52, -4);
    desk.castShadow = true;
    scene.add(desk);

    const topGeo = new THREE.BoxGeometry(3.7, 0.08, 1.3);
    const top = new THREE.Mesh(topGeo, trimMat);
    top.position.set(-20, 1.09, -4);
    scene.add(top);

    // Laptop on desk
    const lapGeo = new THREE.BoxGeometry(0.5, 0.04, 0.35);
    const lap = new THREE.Mesh(lapGeo, new THREE.MeshStandardMaterial({ color: 0x334155 }));
    lap.position.set(-20, 1.15, -4);
    scene.add(lap);

    // Receptionist Character
    createMiniCharacter(-20, -5.2, 0xff7a38, 0x1e293b, 0);

    // Waiting Bench (Orange Chairs like Nadi)
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

    // Walking visitor along guide line
    createMiniCharacter(-18.5, 1.8, 0x10b981, 0x334155, Math.PI / 4);
  }

  // Room 2: Master Control Room (MCR) & Live Production Studio
  function buildRoom2MCR(screenMat, trimMat, darkMat) {
    // Broadcast Switcher Console Desk
    const deskGeo = new THREE.BoxGeometry(4.2, 1.05, 1.4);
    const desk = new THREE.Mesh(deskGeo, darkMat);
    desk.position.set(-12, 0.52, -4.5);
    scene.add(desk);

    // Multiview Video Wall (Mounted on back wall)
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

    // Studio Camera on Tripod with Red Tally Light
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

    // Director Avatar behind desk
    createMiniCharacter(-12, -5.5, 0x0284c7, 0x1e293b, 0);
  }

  // Room 3: Digital Newsroom & Social Media Strategy Hub
  function buildRoom3Newsroom(trimMat, darkMat, chairMat) {
    // Curved Newsroom Team Workstation
    const deskGeo = new THREE.BoxGeometry(4.5, 0.95, 1.5);
    const desk = new THREE.Mesh(deskGeo, new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
    desk.position.set(-4, 0.48, -4.2);
    scene.add(desk);

    // Dual iMac Displays
    for (let i = 0; i < 2; i++) {
      const scr = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.7, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      scr.position.set(-4.8 + i * 1.6, 1.35, -4.2);
      scene.add(scr);
    }

    // Social Media Specialist Avatar
    createMiniCharacter(-4, -5.2, 0xa855f7, 0x1e293b, 0);

    // Whiteboard stand on side with diagram lines
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
    // Server Rack Cabinet with pulsing LED status lights
    const rackGeo = new THREE.BoxGeometry(1.4, 2.4, 1.0);
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 });
    const rack = new THREE.Mesh(rackGeo, rackMat);
    rack.position.set(6.5, 1.2, -8.5);
    scene.add(rack);

    // Server LED light dots
    for (let i = 0; i < 5; i++) {
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.04),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0x22c55e })
      );
      led.position.set(6.2 + (i % 2) * 0.4, 0.6 + i * 0.35, -7.95);
      scene.add(led);
    }

    // Data Analyst Workstation
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.95, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    desk.position.set(4, 0.48, -4);
    scene.add(desk);

    // Data Scientist Avatar
    createMiniCharacter(4, -5.1, 0x3b82f6, 0x0f172a, 0);
  }

  // Room 5: IoT & Hardware Innovation Workshop
  function buildRoom5IoTWorkshop(trimMat, darkMat) {
    // Electronics Workbench
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 1.0, 1.4),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 })
    );
    bench.position.set(12, 0.5, -4.5);
    scene.add(bench);

    // Miniature IoT LPG-SafeSense Device Prototype
    const gasTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.7, 16),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 })
    );
    gasTank.position.set(11.2, 1.35, -4.5);
    scene.add(gasTank);

    // Miniature 3D Golden Innovation Trophy (Juara 1 MKI)
    const trophy = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
    );
    trophy.position.set(13.2, 1.4, -4.5);
    scene.add(trophy);

    // Hardware Engineer Avatar
    createMiniCharacter(12, -5.5, 0xf97316, 0x1e293b, 0);
  }

  // Room 6: Partnership Lounge & Fast-Track Recruiter Desk
  function buildRoom6Lounge(trimMat, darkMat, chairMat) {
    // Executive Sofa
    const sofaGeo = new THREE.BoxGeometry(3.6, 0.8, 1.4);
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const sofa = new THREE.Mesh(sofaGeo, sofaMat);
    sofa.position.set(20, 0.4, -4.5);
    scene.add(sofa);

    // Coffee Table with Warm Wood
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.45, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
    );
    table.position.set(20, 0.25, -2);
    scene.add(table);

    // Indoor Plant (Potted Fiddle Leaf Fig)
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

    // Recruiter & Candidate Meeting Avatars
    createMiniCharacter(19, -0.8, 0x059669, 0x1e293b, -Math.PI / 4);
    createMiniCharacter(21, -0.8, 0xff6b2b, 0x1e293b, Math.PI / 4);
  }

  // ─── 4. DOM MOUNTING & UI SETUP ───────────────────────────────
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

          <!-- 1. TOP NAVBAR (NADI. STYLE) -->
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
              <a href="./CV_Mangara_Pakpahan_Data_Analyst.pdf" target="_blank" rel="noopener" class="nadi-btn-secondary" title="Unduh CV ATS Resmi">
                <ion-icon name="document-text-outline"></ion-icon>
                <span>Unduh CV ATS</span>
              </a>
              <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20melihat%20portofolio%203D%20Anda." target="_blank" rel="noopener" class="nadi-btn-primary" title="Hubungi via WhatsApp">
                <span>Hubungi Langsung &rarr;</span>
              </a>
            </div>
          </header>

          <!-- 2. LEFT FLOATING STORY CONTENT & CARD -->
          <div class="nadi-story-layer" id="nadi-story-layer">
            <div class="nadi-step-label" id="nadi-step-label">
              <span>LANGKAH 01</span> &bull; PROFIL & KUALIFIKASI
            </div>

            <h1 class="nadi-story-headline" id="nadi-story-headline">
              Kreativitas Bertemu Rekayasa Data.
            </h1>

            <p class="nadi-story-desc" id="nadi-story-desc">
              Mahasiswa S1 Teknik Informatika Institut Teknologi PLN dengan rekam jejak teruji sebagai Creative Director siaran nasional, Social Media Specialist resmi, dan Data Analyst bersertifikasi.
            </p>

            <!-- FLOATING DATA CARD -->
            <div class="nadi-floating-card" id="nadi-floating-card">
              <div class="nadi-card-top-row">
                <div class="nadi-card-badge-left" id="nadi-card-title">
                  <ion-icon name="reader-outline" style="color: var(--nadi-orange);"></ion-icon>
                  <strong>Ringkasan Kualifikasi</strong>
                </div>
                <div class="nadi-card-badge-status" id="nadi-card-status">
                  Tersedia untuk Kerja
                </div>
              </div>

              <div class="nadi-card-list" id="nadi-card-list">
                <!-- Injected dynamically -->
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
            <span>GULIR KE BAWAH UNTUK TERBANG &bull; SCROLL TO EXPLORE</span>
          </div>

          <!-- 3. BOTTOM SCROLLYTELLING PROGRESS BAR -->
          <footer class="nadi-bottom-timeline">
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

            <a href="#main-portfolio-content" class="nadi-skip-btn" id="nadi-skip-btn" title="Lewati atau buka katalog dokumen lengkap">
              <span>Buka Dokumen Lengkap &darr;</span>
            </a>
          </footer>

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

    // Initial Story Content Render
    renderStoryStep(0);
  }

  // Render left floating content for specific step index
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
      cardActions.innerHTML = step.actions.map(act => `
        <a href="${act.url}" ${act.url.startsWith('http') || act.url.endsWith('.pdf') ? 'target="_blank" rel="noopener"' : ''} class="nadi-card-btn ${act.primary ? 'primary' : ''}">
          <span>${act.label}</span> &rarr;
        </a>
      `).join('');
    }
  }

  // ─── 5. SCROLL CALCULATION & TIMELINE UPDATES ─────────────────
  function handleScroll() {
    if (!scrollyTrack) return;

    const rect = scrollyTrack.getBoundingClientRect();
    const trackHeight = scrollyTrack.offsetHeight;
    const windowHeight = window.innerHeight;

    // Calculate normalized scroll position from 0.0 to 1.0
    const scrollDist = -rect.top;
    const maxScroll = trackHeight - windowHeight;

    let progress = scrollDist / maxScroll;
    progress = Math.max(0, Math.min(1, progress));
    targetProgress = progress;

    // Determine current step index (0 to 5)
    const stepRange = 1 / (SCROLL_STEPS.length - 1);
    const newStepIndex = Math.min(
      SCROLL_STEPS.length - 1,
      Math.floor(progress / stepRange + 0.5)
    );

    if (newStepIndex !== currentStepIndex) {
      currentStepIndex = newStepIndex;
      renderStoryStep(currentStepIndex);
    }

    // Update bottom step indicators and fill lines
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

  // Smooth jump to specific step
  function jumpToStep(idx) {
    if (!scrollyTrack) return;
    const trackTop = scrollyTrack.offsetTop;
    const trackHeight = scrollyTrack.offsetHeight;
    const maxScroll = trackHeight - window.innerHeight;
    const targetScroll = trackTop + (idx / (SCROLL_STEPS.length - 1)) * maxScroll;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }

  // ─── 6. INITIALIZE THREE.JS & CAMERA FLIGHT ────────────────────
  function initThreeDiorama() {
    canvas = document.getElementById('nadi-webgl-canvas');
    stickyViewport = document.getElementById('nadi-sticky-viewport');
    scrollyTrack = document.getElementById('nadi-scrolly-track');

    const width = stickyViewport.clientWidth || window.innerWidth;
    const height = stickyViewport.clientHeight || window.innerHeight;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfbf7);
    scene.fog = new THREE.FogExp2(0xfcfbf7, 0.012);

    // Camera with realistic isometric angle (52 FOV)
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

    // Build the architectural diorama
    buildMiniatureDioramaScene();

    // Event Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onWindowResize);

    // Setup Clickable Navigation Steps
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

    // Hide loading screen
    setTimeout(() => {
      const loader = document.getElementById('nadi-loading-screen');
      if (loader) loader.classList.add('hidden');
    }, 400);

    // Start 60 FPS Camera Flight loop
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

  // Smooth Camera Interpolation along Spline
  function getCameraPoseAtProgress(t) {
    const numIntervals = SCROLL_STEPS.length - 1;
    const scaled = t * numIntervals;
    const i = Math.min(numIntervals - 1, Math.floor(scaled));
    const frac = scaled - i;

    const stepA = SCROLL_STEPS[i];
    const stepB = SCROLL_STEPS[i + 1] || SCROLL_STEPS[i];

    // Smoothstep easing for camera transition between rooms
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

    // Smooth Lerp progress
    currentProgress += (targetProgress - currentProgress) * 0.08;

    const { pos, look } = getCameraPoseAtProgress(currentProgress);

    currentCamPos.lerp(new THREE.Vector3(pos.x, pos.y, pos.z), 0.1);
    currentLookAt.lerp(new THREE.Vector3(look.x, look.y, look.z), 0.1);

    camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);
    camera.lookAt(currentLookAt);

    renderer.render(scene, camera);
  }

  // ─── 7. ENTRY POINT ───────────────────────────────────────────
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

    console.log('✨ 3D Scrollytelling Diorama Experience (nadi style) successfully initialized!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
