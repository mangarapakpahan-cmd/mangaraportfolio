/**
 * pixel-fps-walkthrough.js
 * Pusat Rekruter Eksekutif & First-Person 3D Walkthrough Engine
 * Dibangun khusus untuk Mangara Ferdianto Pakpahan
 * - Recruiter Fast-Track Hub (1-Click ATS CV Download, WhatsApp, Email)
 * - 5 Ruang Pameran 3D Interaktif (Raycasting Engine 60FPS)
 * - Minimap Radar Real-time & Crosshair Interaktif
 * - Mouse Drag / Touch Swipe / Keyboard (WASD & Arrows)
 * - Modal Dialog Informasi Portofolio Terverifikasi
 */

(function () {
  'use strict';

  // ─── 1. AUDIO SYNTHESIZER ─────────────────────────────────────
  let audioCtx = null;
  let sfxOn = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, dur = 0.08, type = 'square', vol = 0.08) {
    if (!sfxOn || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }

  function playLevelClearSound() {
    if (!sfxOn || !audioCtx) return;
    [392, 523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.16, 'square', 0.08), i * 110);
    });
  }

  function playInteractSound() {
    playTone(587, 0.09, 'sine', 0.1);
  }

  // ─── 2. 5 GUIDED RECRUITMENT ROOMS (3D MAPS & EXHIBITS) ───────
  const FPS_ROOMS = [
    {
      id: 1,
      name: "RUANG 1: PROFIL & NILAI UNGGUL",
      situation: "Atrium Utama Pengenalan Kompetensi & Latar Belakang",
      ceilingColor: "#0f172a",
      floorColor: "#1e293b",
      wallColorLight: "#3b82f6",
      wallColorDark: "#1d4ed8",
      spawn: { x: 2.5, y: 2.5, angle: 0 },
      map: [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
      ],
      sprites: [
        {
          x: 4.5, y: 2.5,
          type: "npc",
          title: "Mentor ITPLN: Ringkasan Kandidat",
          text: "MANGARA FERDIANTO PAKPAHAN\n\n• Mahasiswa aktif S1 Teknik Informatika Institut Teknologi PLN (2023 - Sekarang).\n• Memadukan keunggulan kreatif multimedia dengan pemrosesan data analitik kuantitatif.\n• Berpengalaman memimpin siaran langsung berskala nasional, kampanye media sosial institusi, serta riset pemodelan data machine learning."
        },
        {
          x: 7.5, y: 3.5,
          type: "terminal",
          title: "Peran Target Utama",
          text: "1. Data Analyst (Python, SQL, Azure Databricks, SEM-PLS, MOS Excel)\n2. Social Media Specialist / Humas (Strategi Konten, Engagement 3x Lipat, Copywriting)\n3. Creative Director & Live Production Specialist (OBS/vMix, Multicam, Identitas Visual)"
        },
        {
          x: 7.5, y: 6.5,
          type: "terminal",
          title: "Keunggulan Kompetitif",
          text: "• Terbiasa bekerja dengan tenggat waktu ketat & produksi berskala institusi BUMN.\n• Rekam jejak kepemimpinan: Deputy Manager ITPLN Media & Ketua Pelaksana NCC 2025.\n• Memiliki sertifikasi resmi internasional dari Microsoft dan Educativa."
        },
        {
          x: 8.5, y: 5.0,
          type: "portal",
          title: "PORTAL KE RUANG 2",
          isPortal: true
        }
      ]
    },
    {
      id: 2,
      name: "RUANG 2: REKAM JEJAK & PENGALAMAN KERJA",
      situation: "Galeri Pengalaman Profesional & Kepemimpinan Organisasi",
      ceilingColor: "#172554",
      floorColor: "#1e3a8a",
      wallColorLight: "#8b5cf6",
      wallColorDark: "#6d28d9",
      spawn: { x: 1.5, y: 2.5, angle: 0 },
      map: [
        [2,2,2,2,2,2,2,2,2,2,2,2],
        [2,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,2],
        [2,2,2,2,2,2,2,2,2,2,2,2]
      ],
      sprites: [
        {
          x: 3.5, y: 1.5,
          type: "terminal",
          title: "Magang PJCI (Smart Grid Indonesia)",
          text: "Social Media Manager & Redaksi Berita Web (Apr 2026 - Jul 2026)\n• SK Resmi No. 026/PJCI-Magang/SMM/2026.\n• Mengelola akun @smartgridindonesia dan portal berita pjci.or.id.\n• Diseminasi agenda transisi energi bersih dan edukasi modernisasi jaringan cerdas nasional."
        },
        {
          x: 5.5, y: 3.5,
          type: "terminal",
          title: "Humas & Stakeholder ITPLN (BHMS)",
          text: "Social Media & Website Specialist (Okt 2025 - Sekarang)\n• Penulisan rilis pers kehumasan resmi pada portal itpln.ac.id.\n• Pengelolaan media sosial @itpln dan @vokasiitpln dengan lonjakan engagement hingga 3 kali lipat."
        },
        {
          x: 7.5, y: 1.5,
          type: "terminal",
          title: "PT Educativa - Riset Kuantitatif 120 JP",
          text: "Trainee Riset Kuantitatif & Structural Equation Modeling (2026)\n• Menyelesaikan 120 JP analisis statistik inferensial, uji instrumen data, dan pemodelan SEM-PLS.\n• Menganalisis pengaruh mediasi dan moderasi pada dataset empiris."
        },
        {
          x: 9.5, y: 3.5,
          type: "terminal",
          title: "ITPLN Media: Creative Director & NCC 2025",
          text: "Deputy Manager & Direktur Kreatif (2024 - Sekarang)\n• Koordinator Tim Video Company Profile (SK No. 001/SK/ITPLN MEDIA/APRIL/2025).\n• Ketua Pelaksana National Creative Competition (NCC) 2025 bertema Data Science Energi Nuklir."
        },
        {
          x: 10.8, y: 2.5,
          type: "portal",
          title: "PORTAL KE RUANG 3",
          isPortal: true
        }
      ]
    },
    {
      id: 3,
      name: "RUANG 3: SHOWCASE 50+ PROYEK & KARYA",
      situation: "Laboratorium Hologram Portofolio Unggulan",
      ceilingColor: "#022c22",
      floorColor: "#064e3b",
      wallColorLight: "#06b6d4",
      wallColorDark: "#0891b2",
      spawn: { x: 2.5, y: 2.5, angle: 0 },
      map: [
        [3,3,3,3,3,3,3,3,3,3],
        [3,0,0,0,0,0,0,0,0,3],
        [3,0,0,3,0,0,3,0,0,3],
        [3,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,3],
        [3,0,0,3,0,0,3,0,0,3],
        [3,0,0,0,0,0,0,0,0,3],
        [3,3,3,3,3,3,3,3,3,3]
      ],
      sprites: [
        {
          x: 4.5, y: 1.5,
          type: "holo",
          title: "Live Production: Wisuda ITPLN ke-46",
          text: "Produksi siaran langsung multi-kamera 3.5+ jam berstandar broadcast untuk ribuan audiens daring.\n• Pengaturan video switcher, lower-thirds animasi, dan routing audio."
        },
        {
          x: 6.5, y: 1.5,
          type: "holo",
          title: "IoT LPG-SafeSense (Juara 1 MKI)",
          text: "Riset dan rekayasa perangkat Internet of Things pendeteksi kebocoran gas LPG dan monitoring berat sisa gas berbasis sensor MQ-6 dan loadcell terintegrasi mobile apps."
        },
        {
          x: 4.5, y: 5.5,
          type: "holo",
          title: "Juara 1 Desain Poster IPB University 2025",
          text: "Karya pemenang Juara 1 Nasional Lomba Desain Poster Ocean Experience di IPB University dengan visualisasi konservasi terumbu karang ekosistem laut."
        },
        {
          x: 6.5, y: 5.5,
          type: "holo",
          title: "Redaksi Portal Web pjci.or.id & itpln.ac.id",
          text: "Penulisan dan kurasi artikel warta energi terbarukan, seminar ketenagalistrikan, liputan rektorat, dan dokumentasi kemitraan industri."
        },
        {
          x: 8.5, y: 3.5,
          type: "portal",
          title: "PORTAL KE RUANG 4",
          isPortal: true
        }
      ]
    },
    {
      id: 4,
      name: "RUANG 4: SERTIFIKASI & ANALITIK DATA",
      situation: "Sanctum Kredensial Terverifikasi & Kompetensi Kuantitatif",
      ceilingColor: "#311029",
      floorColor: "#4a044e",
      wallColorLight: "#f59e0b",
      wallColorDark: "#d97706",
      spawn: { x: 2.0, y: 2.5, angle: 0 },
      map: [
        [4,4,4,4,4,4,4,4,4,4,4],
        [4,0,0,0,0,0,0,0,0,0,4],
        [4,0,4,0,4,0,4,0,4,0,4],
        [4,0,0,0,0,0,0,0,0,0,4],
        [4,4,4,4,4,4,4,4,4,4,4]
      ],
      sprites: [
        {
          x: 3.0, y: 1.5,
          type: "scroll",
          title: "Microsoft Azure Databricks Machine Learning",
          text: "Menyelesaikan 8 modul spesialisasi resmi Microsoft:\n• Machine Learning in Production\n• AutoML & Hyperparameter Tuning\n• MLflow Lifecycle & Apache Spark di Azure Databricks."
        },
        {
          x: 5.0, y: 1.5,
          type: "scroll",
          title: "Sertifikasi Riset Kuantitatif SEM-PLS (Educativa)",
          text: "Kelulusan pelatihan 120 JP analisis statistik inferensial tingkat lanjut, pemodelan Structural Equation Modeling (SEM-PLS), path analysis, dan validitas data riset."
        },
        {
          x: 7.0, y: 1.5,
          type: "scroll",
          title: "Microsoft Office Specialist (MOS) Excel 2019",
          text: "Sertifikasi resmi internasional dari Microsoft dalam penguasaan spreadsheet Excel tingkat mahir: pemodelan data finansial, formula logika kompleks, dan dashboard analisis bisnis."
        },
        {
          x: 9.8, y: 2.5,
          type: "portal",
          title: "PORTAL KE RUANG 5",
          isPortal: true
        }
      ]
    },
    {
      id: 5,
      name: "RUANG 5: KEPUTUSAN PEREKRUTAN & UNDUH CV",
      situation: "Pusat Rekrutmen: Unduh CV ATS Resmi & Hubungi Langsung",
      ceilingColor: "#020617",
      floorColor: "#0f172a",
      wallColorLight: "#10b981",
      wallColorDark: "#047857",
      spawn: { x: 2.0, y: 3.0, angle: 0 },
      map: [
        [5,5,5,5,5,5,5,5,5],
        [5,0,0,0,0,0,0,0,5],
        [5,0,0,0,0,0,0,0,5],
        [5,0,0,0,0,0,0,0,5],
        [5,0,0,0,0,0,0,0,5],
        [5,5,5,5,5,5,5,5,5]
      ],
      sprites: [
        {
          x: 4.5, y: 1.8,
          type: "chest",
          title: "Peti Berkas 1: CV ATS Data Analyst",
          text: "Curriculum Vitae resmi berstandar ATS khusus posisi Data Analyst (Format PDF Bahasa Indonesia, 2 Halaman Ringkas & Terverifikasi).\n\nKlik tombol di bawah untuk mengunduh:",
          actionLink: "./CV_Mangara_Pakpahan_Data_Analyst.pdf",
          actionText: "📥 Unduh CV Data Analyst (PDF)"
        },
        {
          x: 6.5, y: 1.8,
          type: "chest",
          title: "Peti Berkas 2: CV ATS Sosmed Specialist / Humas",
          text: "Curriculum Vitae resmi berstandar ATS khusus posisi Social Media Specialist / Public Relations (Humas).\n\nKlik tombol di bawah untuk mengunduh:",
          actionLink: "./CV_Mangara_Pakpahan_Sosmed_Humas.pdf",
          actionText: "📥 Unduh CV Sosmed & Humas (PDF)"
        },
        {
          x: 4.5, y: 3.8,
          type: "teleport",
          title: "Koneksi WhatsApp Langsung",
          text: "Hubungi Mangara secara langsung melalui WhatsApp untuk mendiskusikan peluang kerja, magang, atau sesi wawancara.",
          actionLink: "https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20berdiskusi%20mengenai%20peluang%20rekrutmen.",
          actionText: "💬 Hubungi via WhatsApp (0813-1881-6058)"
        },
        {
          x: 6.5, y: 3.8,
          type: "teleport",
          title: "Surat Elektronik Resmi",
          text: "Kirim email resmi langsung ke inbox Mangara: mangarapakpahan51@gmail.com",
          actionLink: "mailto:mangarapakpahan51@gmail.com",
          actionText: "✉️ Kirim Email Resmi"
        },
        {
          x: 7.5, y: 2.8,
          type: "portal",
          title: "KEMBALI KE RUANG 1",
          isPortal: true
        }
      ]
    }
  ];

  // ─── 3. ENGINE STATE ──────────────────────────────────────────
  let canvas = null;
  let ctx = null;
  let minimapCanvas = null;
  let minimapCtx = null;

  let currentRoomIdx = 0;
  let activeModal = null;

  const player = {
    x: 2.5,
    y: 2.5,
    angle: 0,
    speed: 0.05,
    rotSpeed: 0.04,
    fov: Math.PI / 3, // 60 degrees
    bob: 0
  };

  const keys = {
    fwd: false,
    bwd: false,
    turnLeft: false,
    turnRight: false,
    strafeLeft: false,
    strafeRight: false,
    interact: false
  };

  const RAYS_COUNT = 320;
  const zBuffer = new Float32Array(RAYS_COUNT);

  // ─── 4. RAYCASTING ENGINE (DDA) ───────────────────────────────
  function castRay(rayAngle, room) {
    const map = room.map;
    const mapH = map.length;
    const mapW = map[0].length;

    const cos = Math.cos(rayAngle);
    const sin = Math.sin(rayAngle);

    let mapX = Math.floor(player.x);
    let mapY = Math.floor(player.y);

    const deltaDistX = Math.abs(1 / cos);
    const deltaDistY = Math.abs(1 / sin);

    let stepX, stepY;
    let sideDistX, sideDistY;

    if (cos < 0) {
      stepX = -1;
      sideDistX = (player.x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1.0 - player.x) * deltaDistX;
    }

    if (sin < 0) {
      stepY = -1;
      sideDistY = (player.y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1.0 - player.y) * deltaDistY;
    }

    let hit = 0;
    let side = 0;

    while (hit === 0) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }

      if (mapY < 0 || mapY >= mapH || mapX < 0 || mapX >= mapW) {
        hit = 1;
        break;
      }

      if (map[mapY][mapX] > 0) {
        hit = 1;
      }
    }

    let perpWallDist;
    if (side === 0) {
      perpWallDist = (mapX - player.x + (1 - stepX) / 2) / cos;
    } else {
      perpWallDist = (mapY - player.y + (1 - stepY) / 2) / sin;
    }

    return {
      dist: perpWallDist,
      side: side
    };
  }

  // ─── 5. DRAW BILLBOARDS IN 3D SPACE ───────────────────────────
  function drawSprites(room, screenW, screenH) {
    const sprList = room.sprites.map(s => {
      const dx = s.x - player.x;
      const dy = s.y - player.y;
      return {
        ...s,
        dist: Math.hypot(dx, dy),
        dx: dx,
        dy: dy
      };
    });

    sprList.sort((a, b) => b.dist - a.dist);

    for (const spr of sprList) {
      const cos = Math.cos(player.angle);
      const sin = Math.sin(player.angle);

      const transX = spr.dx * sin - spr.dy * cos;
      const transY = spr.dx * cos + spr.dy * sin;

      if (transY <= 0.25) continue;

      const screenX = Math.floor((screenW / 2) * (1 - transX / (transY * Math.tan(player.fov / 2))));
      const sprSize = Math.abs(Math.floor(screenH / transY));
      const sprY = Math.floor(screenH / 2 - sprSize / 2 + player.bob);

      const rayCol = Math.floor((screenX / screenW) * RAYS_COUNT);
      if (rayCol >= 0 && rayCol < RAYS_COUNT && zBuffer[rayCol] > transY) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        if (spr.isPortal) {
          const time = Date.now() * 0.005;
          ctx.fillStyle = '#ffe853';
          ctx.fillRect(screenX - sprSize * 0.35, sprY, sprSize * 0.7, sprSize);
          ctx.fillStyle = '#9333ea';
          ctx.fillRect(screenX - sprSize * 0.25, sprY + sprSize * 0.1, sprSize * 0.5, sprSize * 0.8);
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(screenX - sprSize * 0.15 + Math.sin(time) * 4, sprY + sprSize * 0.2, sprSize * 0.3, sprSize * 0.6);
        } else if (spr.type === 'chest') {
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(screenX - sprSize * 0.3, sprY + sprSize * 0.4, sprSize * 0.6, sprSize * 0.5);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(screenX - sprSize * 0.3, sprY + sprSize * 0.55, sprSize * 0.6, sprSize * 0.1);
        } else if (spr.type === 'npc') {
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(screenX - sprSize * 0.25, sprY + sprSize * 0.3, sprSize * 0.5, sprSize * 0.6);
          ctx.fillStyle = '#ffcc80';
          ctx.fillRect(screenX - sprSize * 0.18, sprY, sprSize * 0.36, sprSize * 0.3);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(screenX - sprSize * 0.2, sprY - sprSize * 0.05, sprSize * 0.4, sprSize * 0.12);
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(screenX - sprSize * 0.25, sprY + sprSize * 0.1, sprSize * 0.5, sprSize * 0.8);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(screenX - sprSize * 0.2, sprY + sprSize * 0.15, sprSize * 0.4, sprSize * 0.4);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(screenX - sprSize * 0.15, sprY + sprSize * 0.6, sprSize * 0.3, sprSize * 0.25);
        }

        // Title Tag
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(screenX - 55, sprY - 22, 110, 16);
        ctx.fillStyle = '#ffe853';
        ctx.font = 'bold 8.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(spr.title.substring(0, 16), screenX, sprY - 11);

        ctx.restore();
      }
    }
  }

  // ─── 6. MINIMAP RADAR ─────────────────────────────────────────
  function drawMinimap(room) {
    if (!minimapCanvas || !minimapCtx) return;
    const map = room.map;
    const mapH = map.length;
    const mapW = map[0].length;

    minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);

    const cellW = minimapCanvas.width / mapW;
    const cellH = minimapCanvas.height / mapH;

    for (let r = 0; r < mapH; r++) {
      for (let c = 0; c < mapW; c++) {
        if (map[r][c] > 0) {
          minimapCtx.fillStyle = '#334155';
          minimapCtx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
        } else {
          minimapCtx.fillStyle = '#090d1e';
          minimapCtx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
        }
      }
    }

    for (const spr of room.sprites) {
      minimapCtx.fillStyle = spr.isPortal ? '#d946ef' : '#f59e0b';
      minimapCtx.fillRect(spr.x * cellW - 2.5, spr.y * cellH - 2.5, 5, 5);
    }

    const px = player.x * cellW;
    const py = player.y * cellH;

    minimapCtx.fillStyle = '#22c55e';
    minimapCtx.beginPath();
    minimapCtx.arc(px, py, 3.5, 0, Math.PI * 2);
    minimapCtx.fill();

    minimapCtx.strokeStyle = '#22c55e';
    minimapCtx.lineWidth = 1.8;
    minimapCtx.beginPath();
    minimapCtx.moveTo(px, py);
    minimapCtx.lineTo(px + Math.cos(player.angle) * 12, py + Math.sin(player.angle) * 12);
    minimapCtx.stroke();
  }

  // ─── 7. UPDATE & COLLISION ────────────────────────────────────
  function updatePlayer(room) {
    if (activeModal) return;

    if (keys.turnLeft) player.angle -= player.rotSpeed;
    if (keys.turnRight) player.angle += player.rotSpeed;

    while (player.angle < 0) player.angle += Math.PI * 2;
    while (player.angle >= Math.PI * 2) player.angle -= Math.PI * 2;

    let moveStep = 0;
    if (keys.fwd) moveStep = player.speed;
    if (keys.bwd) moveStep = -player.speed;

    let strafeStep = 0;
    if (keys.strafeLeft) strafeStep = -player.speed * 0.8;
    if (keys.strafeRight) strafeStep = player.speed * 0.8;

    const isMoving = moveStep !== 0 || strafeStep !== 0;

    if (isMoving) {
      player.bob = Math.sin(Date.now() * 0.009) * 4;

      const cos = Math.cos(player.angle);
      const sin = Math.sin(player.angle);

      const dx = cos * moveStep + Math.cos(player.angle + Math.PI / 2) * strafeStep;
      const dy = sin * moveStep + Math.sin(player.angle + Math.PI / 2) * strafeStep;

      const nextX = player.x + dx;
      const nextY = player.y + dy;
      const map = room.map;
      const pad = 0.25;

      if (map[Math.floor(player.y)][Math.floor(nextX + (dx > 0 ? pad : -pad))] === 0) {
        player.x = nextX;
      }
      if (map[Math.floor(nextY + (dy > 0 ? pad : -pad))][Math.floor(player.x)] === 0) {
        player.y = nextY;
      }
    } else {
      player.bob = 0;
    }

    // Nearest interactive sprite
    let nearestSprite = null;
    let nearestDist = 999;

    for (const spr of room.sprites) {
      const d = Math.hypot(spr.x - player.x, spr.y - player.y);
      if (d < 1.9 && d < nearestDist) {
        nearestDist = d;
        nearestSprite = spr;
      }
    }

    const cue = document.getElementById('fps-interaction-cue');
    if (cue) {
      if (nearestSprite) {
        cue.style.display = 'block';
        if (nearestSprite.isPortal) {
          cue.textContent = `[PORTAL] TEKAN E ATAU KLIK UNTUK PINDAH KE RUANG BERIKUTNYA ▶`;
        } else {
          cue.textContent = `[TEKAN E ATAU KLIK] BUKA: ${nearestSprite.title}`;
        }

        if (keys.interact) {
          if (nearestSprite.isPortal) {
            advanceRoom();
          } else {
            openRecruiterModal(nearestSprite);
          }
          keys.interact = false;
        }
      } else {
        cue.style.display = 'none';
      }
    }
  }

  function advanceRoom() {
    playLevelClearSound();
    currentRoomIdx = (currentRoomIdx + 1) % FPS_ROOMS.length;
    resetPlayerForRoom();
  }

  function resetPlayerForRoom() {
    const r = FPS_ROOMS[currentRoomIdx];
    player.x = r.spawn.x;
    player.y = r.spawn.y;
    player.angle = r.spawn.angle;

    const title = document.getElementById('fps-level-title');
    const sit = document.getElementById('fps-situation-text');
    if (title) title.textContent = r.name;
    if (sit) sit.textContent = r.situation;

    const btns = document.querySelectorAll('.fps-lvl-btn');
    btns.forEach((b, i) => b.classList.toggle('active', i === currentRoomIdx));
  }

  function openRecruiterModal(spr) {
    playInteractSound();
    activeModal = spr;
    const modal = document.getElementById('pixel-dialogue-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    const title = document.getElementById('dialogue-title');
    const text = document.getElementById('dialogue-text');
    const actions = document.getElementById('dialogue-actions');

    if (title) title.textContent = spr.title;
    if (text) text.textContent = spr.text;

    if (actions) {
      if (spr.actionLink) {
        actions.innerHTML = `
          <a href="${spr.actionLink}" target="_blank" rel="noopener" class="pixel-btn-action">
            ${spr.actionText || "Buka Dokumen"}
          </a>
          <button id="fps-modal-close" class="pixel-btn-close">Tutup [Esc]</button>
        `;
      } else {
        actions.innerHTML = `<button id="fps-modal-close" class="pixel-btn-close">Tutup [Esc / Spasi]</button>`;
      }
      document.getElementById('fps-modal-close')?.addEventListener('click', closeRecruiterModal);
    }
  }

  function closeRecruiterModal() {
    activeModal = null;
    const modal = document.getElementById('pixel-dialogue-modal');
    if (modal) modal.style.display = 'none';
  }

  // ─── 8. 3D RENDER LOOP ────────────────────────────────────────
  function render3D() {
    if (!canvas || !ctx) return;
    const room = FPS_ROOMS[currentRoomIdx];
    const screenW = canvas.width;
    const screenH = canvas.height;

    // Ceiling
    ctx.fillStyle = room.ceilingColor;
    ctx.fillRect(0, 0, screenW, screenH / 2);

    // Floor
    ctx.fillStyle = room.floorColor;
    ctx.fillRect(0, screenH / 2, screenW, screenH / 2);

    // Raycast walls
    const colW = screenW / RAYS_COUNT;

    for (let i = 0; i < RAYS_COUNT; i++) {
      const rayAngle = player.angle - player.fov / 2 + (i / RAYS_COUNT) * player.fov;
      const hit = castRay(rayAngle, room);

      const correctedDist = hit.dist * Math.cos(rayAngle - player.angle);
      zBuffer[i] = correctedDist;

      const wallHeight = Math.min(screenH * 1.5, Math.floor(screenH / correctedDist));
      const wallTop = Math.floor(screenH / 2 - wallHeight / 2 + player.bob);
      const shade = Math.max(0.25, Math.min(1.0, 1.4 / (1 + correctedDist * 0.4)));

      ctx.fillStyle = hit.side === 0 ? room.wallColorLight : room.wallColorDark;
      ctx.fillRect(i * colW, wallTop, colW + 0.5, wallHeight);

      // Depth Shadow
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - shade})`;
      ctx.fillRect(i * colW, wallTop, colW + 0.5, wallHeight);
    }

    drawSprites(room, screenW, screenH);
    drawMinimap(room);
  }

  function fpsLoop() {
    updatePlayer(FPS_ROOMS[currentRoomIdx]);
    render3D();
    requestAnimationFrame(fpsLoop);
  }

  // ─── 9. BUILD WORKFLOW UI & MOUNT ─────────────────────────────
  function buildRecruiterExperience() {
    const mainMount = document.querySelector('main');
    if (!mainMount) return;

    // Container for both Recruiter Hub and First-Person Walkthrough
    const hubWrapper = document.createElement('div');
    hubWrapper.id = 'recruiter-walkthrough-hub';

    hubWrapper.innerHTML = `
      <!-- 1. PUSAT REKRUTER CEPAT (FAST-TRACK HERO) -->
      <section class="recruiter-fast-track-card">
        <div class="recruiter-badge-row">
          <span class="recruiter-status-tag">✨ TERSEDIA UNTUK KERJA & MAGANG (OPEN TO WORK)</span>
          <span class="recruiter-location-tag">📍 Jakarta, Indonesia</span>
        </div>

        <div class="recruiter-hero-content">
          <div class="recruiter-avatar-wrapper">
            <img src="./assets/images/my-avatar.png" alt="Mangara Ferdianto Pakpahan">
          </div>
          <div class="recruiter-text-group">
            <h1 class="recruiter-candidate-name">Mangara Ferdianto Pakpahan</h1>
            <p class="recruiter-candidate-title">
              Mahasiswa S1 Teknik Informatika ITPLN &bull; Data Analyst &bull; Social Media Specialist & Humas &bull; Creative Director
            </p>
            <div class="recruiter-role-pills">
              <span class="role-pill">📊 Data Analyst (Python, SQL, Azure Databricks, SEM-PLS)</span>
              <span class="role-pill">📱 Social Media & Humas (@itpln, @smartgridindonesia)</span>
              <span class="role-pill">🎬 Live Production Specialist & Visual Designer</span>
            </div>
          </div>
        </div>

        <!-- TOMBOL AKSI CEPAT REKRUTER (UNDUH CV ATS & KONTAK) -->
        <div class="recruiter-cta-grid">
          <a href="./CV_Mangara_Pakpahan_Data_Analyst.pdf" target="_blank" rel="noopener" class="btn-recruiter-cv da" title="Buka / Unduh CV ATS Data Analyst">
            <ion-icon name="document-text-outline"></ion-icon>
            <div>
              <strong>Unduh CV Data Analyst</strong>
              <small>Format ATS Terverifikasi &bull; PDF</small>
            </div>
          </a>

          <a href="./CV_Mangara_Pakpahan_Sosmed_Humas.pdf" target="_blank" rel="noopener" class="btn-recruiter-cv sh" title="Buka / Unduh CV ATS Sosmed & Humas">
            <ion-icon name="document-text-outline"></ion-icon>
            <div>
              <strong>Unduh CV Sosmed & Humas</strong>
              <small>Format ATS Terverifikasi &bull; PDF</small>
            </div>
          </a>

          <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20peluang%20rekrutmen." target="_blank" rel="noopener" class="btn-recruiter-contact wa" title="Hubungi Mangara via WhatsApp">
            <ion-icon name="logo-whatsapp"></ion-icon>
            <div>
              <strong>WhatsApp Langsung</strong>
              <small>0813-1881-6058 (Respons Cepat)</small>
            </div>
          </a>

          <a href="mailto:mangarapakpahan51@gmail.com" class="btn-recruiter-contact mail" title="Kirim Email Resmi">
            <ion-icon name="mail-outline"></ion-icon>
            <div>
              <strong>Kirim Email Resmi</strong>
              <small>mangarapakpahan51@gmail.com</small>
            </div>
          </a>
        </div>

        <!-- WORKFLOW MODE TOGGLE -->
        <div class="workflow-toggle-bar">
          <div class="workflow-tabs">
            <button id="toggle-fps-view-btn" class="workflow-tab-btn active" title="Tampilkan Jelajah 3D First-Person">
              <span class="tab-icon">👁️</span> Mode 1: Jelajah 3D First-Person Walkthrough
            </button>
            <button id="toggle-doc-view-btn" class="workflow-tab-btn" title="Langsung gulir ke daftar dokumen portofolio">
              <span class="tab-icon">📋</span> Mode 2: Ringkasan Eksekutif & Dokumen Portofolio
            </button>
          </div>
        </div>
      </section>

      <!-- 2. FIRST-PERSON 3D WALKTHROUGH VIEWPORT -->
      <section id="fps-walkthrough-viewport-section" class="pixel-fps-container">
        <div class="fps-header-bar">
          <div class="fps-title-group">
            <span class="fps-mode-badge">👁️ FIRST-PERSON 3D INTERACTIVE WALKTHROUGH</span>
            <h2 id="fps-level-title" class="fps-level-title">${FPS_ROOMS[0].name}</h2>
            <span id="fps-situation-text" class="fps-situation-text">${FPS_ROOMS[0].situation}</span>
          </div>

          <div class="fps-hud-stats">
            <button id="fps-sfx-btn" class="pixel-hud-btn">🔊 SFX ON</button>
            <a href="#main-portfolio-content" class="pixel-hud-btn" style="text-decoration:none; background:#16a34a; color:#fff;">⬇️ LIHAT PORTOFOLIO</a>
          </div>
        </div>

        <!-- Room Selector Buttons -->
        <div class="fps-level-nav">
          <span class="fps-level-label">PILIH RUANG PAMERAN:</span>
          <div class="fps-level-btns">
            <button class="fps-lvl-btn active" data-lvl="0">1. Profil & Nilai</button>
            <button class="fps-lvl-btn" data-lvl="1">2. Pengalaman Kerja</button>
            <button class="fps-lvl-btn" data-lvl="2">3. Showcase 50+ Proyek</button>
            <button class="fps-lvl-btn" data-lvl="3">4. Sertifikasi & Riset</button>
            <button class="fps-lvl-btn" data-lvl="4">5. Perekrutan & Unduh CV</button>
          </div>
        </div>

        <!-- 3D Viewport Frame -->
        <div class="fps-viewport-wrapper" id="fps-viewport-wrapper">
          <canvas id="pixel-fps-canvas" width="640" height="360"></canvas>
          <div class="fps-crosshair"></div>
          <div class="fps-hand-overlay"></div>
          <div id="fps-interaction-cue" class="fps-interaction-cue">[TEKAN E / KLIK] BUKA INFORMASI</div>

          <!-- Minimap Radar -->
          <div class="fps-minimap-card">
            <canvas id="fps-minimap-canvas" width="110" height="110"></canvas>
          </div>
        </div>

        <!-- Instruction bar -->
        <div class="fps-controls-bar">
          <div class="fps-instruction-text">
            <span>KONTROL WALKTHROUGH:</span> 
            <kbd>W</kbd> <kbd>S</kbd> Jalan &bull; 
            <kbd>A</kbd> <kbd>D</kbd> / Tarik Mouse Putar Pandangan &bull; 
            <kbd>E</kbd> Interaksi / Masuk Portal
          </div>
        </div>

        <!-- Mobile Touch D-Pad -->
        <div class="fps-mobile-controls">
          <div class="fps-dpad-grid">
            <button class="fps-ctrl-btn fwd" id="fps-btn-fwd">▲</button>
            <button class="fps-ctrl-btn turn-left" id="fps-btn-left">◄</button>
            <button class="fps-ctrl-btn bwd" id="fps-btn-bwd">▼</button>
            <button class="fps-ctrl-btn turn-right" id="fps-btn-right">►</button>
          </div>
          <div class="fps-action-group">
            <button class="fps-ctrl-btn interact-btn" id="fps-btn-action">E (Aksi)</button>
          </div>
        </div>
      </section>

      <!-- MODAL DIALOGUE POPUP -->
      <div id="pixel-dialogue-modal" class="pixel-dialogue-overlay" style="display: none;">
        <div class="pixel-dialogue-box">
          <div class="dialogue-header">
            <span class="dialogue-icon">📜</span>
            <h3 id="dialogue-title" class="dialogue-title-text">Detail Informasi</h3>
          </div>
          <div id="dialogue-text" class="dialogue-body-text">
            Keterangan...
          </div>
          <div id="dialogue-actions" class="dialogue-actions-bar">
            <button id="fps-modal-close" class="pixel-btn-close">Tutup [Esc]</button>
          </div>
        </div>
      </div>
    `;

    mainMount.prepend(hubWrapper);

    canvas = document.getElementById('pixel-fps-canvas');
    if (canvas) ctx = canvas.getContext('2d');

    minimapCanvas = document.getElementById('fps-minimap-canvas');
    if (minimapCanvas) minimapCtx = minimapCanvas.getContext('2d');

    // Room Switcher Buttons
    const lvlBtns = hubWrapper.querySelectorAll('.fps-lvl-btn');
    lvlBtns.forEach(b => {
      b.addEventListener('click', () => {
        initAudio();
        currentRoomIdx = parseInt(b.dataset.lvl, 10) || 0;
        resetPlayerForRoom();
      });
    });

    // SFX Toggle
    const sfxBtn = document.getElementById('fps-sfx-btn');
    sfxBtn?.addEventListener('click', () => {
      initAudio();
      sfxOn = !sfxOn;
      sfxBtn.textContent = sfxOn ? '🔊 SFX ON' : '🔇 SFX OFF';
    });

    // Workflow Mode Toggle Buttons
    const fpsTabBtn = document.getElementById('toggle-fps-view-btn');
    const docTabBtn = document.getElementById('toggle-doc-view-btn');
    const fpsSection = document.getElementById('fps-walkthrough-viewport-section');

    fpsTabBtn?.addEventListener('click', () => {
      fpsTabBtn.classList.add('active');
      docTabBtn.classList.remove('active');
      if (fpsSection) {
        fpsSection.style.display = 'block';
        fpsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    docTabBtn?.addEventListener('click', () => {
      docTabBtn.classList.add('active');
      fpsTabBtn.classList.remove('active');
      const docTarget = document.getElementById('main-portfolio-content');
      if (docTarget) {
        docTarget.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Mouse Drag Look on Canvas
    setupMouseLook();

    // Keyboard & Touch
    setupKeyboard();
    setupTouch();
  }

  function setupMouseLook() {
    const wrapper = document.getElementById('fps-viewport-wrapper');
    if (!wrapper) return;

    let isDragging = false;
    let lastX = 0;

    wrapper.addEventListener('mousedown', (e) => {
      initAudio();
      isDragging = true;
      lastX = e.clientX;
    });

    window.addEventListener('mouseup', () => (isDragging = false));

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || activeModal) return;
      const dx = e.clientX - lastX;
      player.angle += dx * 0.006;
      lastX = e.clientX;
    });

    // Click canvas to interact if prompt is visible
    canvas?.addEventListener('click', () => {
      initAudio();
      keys.interact = true;
      setTimeout(() => (keys.interact = false), 100);
    });
  }

  function setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      initAudio();
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.fwd = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.bwd = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.turnLeft = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.turnRight = true;
      if (e.code === 'KeyQ') keys.strafeLeft = true;
      if (e.code === 'KeyE' || e.code === 'Space') keys.interact = true;
      if (e.code === 'Escape' && activeModal) closeRecruiterModal();
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.fwd = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.bwd = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.turnLeft = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.turnRight = false;
      if (e.code === 'KeyQ') keys.strafeLeft = false;
      if (e.code === 'KeyE' || e.code === 'Space') keys.interact = false;
    });
  }

  function setupTouch() {
    const bind = (id, onD, onU) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        initAudio();
        onD();
      }, { passive: false });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        onU();
      }, { passive: false });
      el.addEventListener('mousedown', () => {
        initAudio();
        onD();
      });
      el.addEventListener('mouseup', () => onU());
      el.addEventListener('mouseleave', () => onU());
    };

    bind('fps-btn-fwd', () => (keys.fwd = true), () => (keys.fwd = false));
    bind('fps-btn-bwd', () => (keys.bwd = true), () => (keys.bwd = false));
    bind('fps-btn-left', () => (keys.turnLeft = true), () => (keys.turnLeft = false));
    bind('fps-btn-right', () => (keys.turnRight = true), () => (keys.turnRight = false));
    bind('fps-btn-action', () => (keys.interact = true), () => (keys.interact = false));
  }

  // ─── 10. INITIALIZE ───────────────────────────────────────────
  function init() {
    buildRecruiterExperience();
    requestAnimationFrame(fpsLoop);
    console.log('👁️ Recruiter Fast-Track Hub & First-Person Walkthrough Engine live!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
