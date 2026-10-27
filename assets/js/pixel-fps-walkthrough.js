/**
 * pixel-fps-walkthrough.js
 * Retro First-Person 3D Raycasting Walkthrough Engine
 * Authentic 90s Wolfenstein/Roblox-style 3D Experience for Mangara Ferdianto Pakpahan
 * Features:
 * - 5 Full 3D Levels with Unique Atmosphere, Walls, and Floor/Ceiling Themes
 * - Real-time Raycasting Engine (DDA algorithm, Depth Shading, 60FPS)
 * - 3D Billboard Sprites (NPCs, Information Terminals, Chests, Glowing Portals)
 * - Real-time Minimap Radar with Player Direction Cone
 * - Keyboard (WASD / Arrows / Q/E), Mouse Drag, and Mobile Touch D-Pad Controls
 * - Head Bobbing & Animated Tablet / Compass in Hand
 * - Seamless Integration with Portfolio Data & ATS CV Downloads
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
      setTimeout(() => playTone(f, 0.16, 'square', 0.09), i * 110);
    });
  }

  function playInteractSound() {
    playTone(587, 0.09, 'sine', 0.1);
  }

  // ─── 2. 5 COMPLETE 3D LEVELS (GRID MAPS & OBJECTS) ────────────
  // Map legend: 1=Stone Wall, 2=Blue Tech Wall, 3=Wood Wall, 4=Cyber Brick, 5=Castle Wall, 0=Empty Floor
  const FPS_LEVELS = [
    {
      id: 1,
      name: "LEVEL 1: ATRIUM AWAL (SPAWN GALLERY)",
      situation: "Lobi Megah Kampus ITPLN & Pengenalan Mangara",
      ceilingColor: "#101633",
      floorColor: "#1b2854",
      wallColorLight: "#3f51b5",
      wallColorDark: "#283593",
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
          title: "Mentor ITPLN",
          text: "Selamat datang di Walkthrough First-Person Mangara Ferdianto Pakpahan! Gunakan tombol W/A/S/D atau D-Pad untuk menjelajahi ruangan dan tekan E saat mendekati stasiun informasi."
        },
        {
          x: 7.5, y: 3.5,
          type: "terminal",
          title: "Papan Biodata & Pendidikan",
          text: "MANGARA FERDIANTO PAKPAHAN\nMahasiswa S1 Teknik Informatika Institut Teknologi PLN (2023 - Sekarang).\nSpesialisasi: Creative Director, Live Production, Sinematografi, Visual Designer, & Data Analyst."
        },
        {
          x: 7.5, y: 6.5,
          type: "terminal",
          title: "Visi Karier",
          text: "Memadukan estetika visual multimedia berstandar industri dengan ketajaman analisis data kuantitatif untuk mendorong inovasi institusi dan industri energi."
        },
        {
          x: 8.5, y: 5.0,
          type: "portal",
          title: "PORTAL KE LEVEL 2",
          isPortal: true
        }
      ]
    },
    {
      id: 2,
      name: "LEVEL 2: KORIDOR KARIER & PENGALAMAN",
      situation: "Lorong Galeri Prestasi & Rekam Jejak Kerja",
      ceilingColor: "#1d1029",
      floorColor: "#2a1b3d",
      wallColorLight: "#7b1fa2",
      wallColorDark: "#4a148c",
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
          text: "Social Media Manager & Pengelola Redaksi Website (Apr 2026 - Jul 2026).\nSK No. 026/PJCI-Magang/SMM/2026. Mengelola kanal @smartgridindonesia dan portal warta pjci.or.id."
        },
        {
          x: 5.5, y: 3.5,
          type: "terminal",
          title: "Bagian Humas & Stakeholder ITPLN (BHMS)",
          text: "Social Media & Website Specialist (Okt 2025 - Sekarang).\nMemproduksi konten publikasi digital, artikel web itpln.ac.id, dan strategi media sosial @itpln dengan lonjakan engagement hingga 3x lipat!"
        },
        {
          x: 7.5, y: 1.5,
          type: "terminal",
          title: "Educativa Cipta Nawasena - Riset 120 JP",
          text: "Bootcamp Riset Kuantitatif 120 JP & Structural Equation Modeling (SEM-PLS). Analisis mediasi, moderasi, dan validitas data empiris riset."
        },
        {
          x: 9.5, y: 3.5,
          type: "terminal",
          title: "ITPLN Media & NCC 2025",
          text: "Deputy Manager & Direktur Kreatif ITPLN Media. Koordinator Video Company Profile dan Ketua Pelaksana National Creative Competition (NCC) 2025."
        },
        {
          x: 10.8, y: 2.5,
          type: "portal",
          title: "PORTAL KE LEVEL 3",
          isPortal: true
        }
      ]
    },
    {
      id: 3,
      name: "LEVEL 3: CYBER SHOWCASE 50+ PROYEK",
      situation: "Laboratorium Hologram Siber 16-Bit",
      ceilingColor: "#050814",
      floorColor: "#0b1638",
      wallColorLight: "#00b0ff",
      wallColorDark: "#0069c0",
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
          title: "Holo-Display: Live Production Wisuda ke-46",
          text: "Siaran langsung multi-kamera berdurasi lebih dari 3.5 jam dengan ribuan penonton online. Visual switcher, audio master, dan lower-thirds dinamis."
        },
        {
          x: 6.5, y: 1.5,
          type: "holo",
          title: "Holo-Display: IoT LPG-SafeSense (Juara 1 MKI)",
          text: "Inovasi deteksi kebocoran gas LPG cerdas berbasis mikrokontroler sensor MQ-6 dan beban load cell terintegrasi aplikasi seluler cloud (Juara 1 Tingkat Nasional)."
        },
        {
          x: 4.5, y: 5.5,
          type: "holo",
          title: "Holo-Display: Juara 1 Desain Poster IPB University",
          text: "Karya desain grafis poster Ocean Experience IPB University 2025 dengan visualisasi artistik konservasi terumbu karang laut Indonesia."
        },
        {
          x: 6.5, y: 5.5,
          type: "holo",
          title: "Holo-Display: Portal Berita pjci.or.id & itpln.ac.id",
          text: "Pengelolaan artikel redaksi, rilis pers, liputan transisi energi dekarbonisasi, serta arsip digital institusional secara berkala."
        },
        {
          x: 8.5, y: 3.5,
          type: "portal",
          title: "PORTAL KE LEVEL 4",
          isPortal: true
        }
      ]
    },
    {
      id: 4,
      name: "LEVEL 4: WISDOM SANCTUM (ARSIP RISET)",
      situation: "Perpustakaan Kuno Megah Berkilau Data Kuantitatif",
      ceilingColor: "#1b140e",
      floorColor: "#2c1d12",
      wallColorLight: "#ff8f00",
      wallColorDark: "#b26500",
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
          title: "Gulungan Microsoft Azure Databricks Machine Learning",
          text: "Menyelesaikan 8 modul spesialisasi resmi Microsoft: AutoML, Hyperparameter Tuning, MLflow, dan Apache Spark di Azure Databricks."
        },
        {
          x: 5.0, y: 1.5,
          type: "scroll",
          title: "Gulungan Riset Kuantitatif SEM-PLS (Educativa)",
          text: "Pemodelan persamaan struktural tingkat lanjut, analisis faktor konfirmatori, evaluasi outer/inner model, dan pengujian hipotesis riset."
        },
        {
          x: 7.0, y: 1.5,
          type: "scroll",
          title: "Gulungan Microsoft Office Specialist (MOS) Excel 2019",
          text: "Sertifikasi internasional Microsoft Corporation untuk spreadsheet mahir: pemodelan data finansial multivariat dan dasbor interaktif bisnis."
        },
        {
          x: 9.8, y: 2.5,
          type: "portal",
          title: "PORTAL KE LEVEL 5",
          isPortal: true
        }
      ]
    },
    {
      id: 5,
      name: "LEVEL 5: MENARA OBSERVASI PUNCAK (NIGHT SUMMIT)",
      situation: "Langit Malam Bintang, Bulan Tersenyum & Peti Harta Karun CV",
      ceilingColor: "#050818",
      floorColor: "#143a1e",
      wallColorLight: "#ffd54f",
      wallColorDark: "#c79a00",
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
          title: "Peti Harta Karun 1: CV ATS Data Analyst",
          text: "Dokumen Curriculum Vitae resmi teroptimasi sistem ATS untuk posisi Data Analyst (Bahasa Indonesia & Inggris, format PDF).\n\n[Klik tombol di bawah untuk membuka file PDF]",
          actionLink: "./CV_Mangara_Pakpahan_Data_Analyst.pdf",
          actionText: "Unduh CV Data Analyst (PDF)"
        },
        {
          x: 6.5, y: 1.8,
          type: "chest",
          title: "Peti Harta Karun 2: CV ATS Sosmed Specialist / Humas",
          text: "Dokumen Curriculum Vitae resmi teroptimasi sistem ATS untuk posisi Social Media Specialist / Public Relations (Humas).\n\n[Klik tombol di bawah untuk membuka file PDF]",
          actionLink: "./CV_Mangara_Pakpahan_Sosmed_Humas.pdf",
          actionText: "Unduh CV Sosmed / Humas (PDF)"
        },
        {
          x: 4.5, y: 3.8,
          type: "teleport",
          title: "Cermin Komunikasi: WhatsApp Langsung",
          text: "Hubungi Mangara secara langsung melalui WhatsApp untuk mendiskusikan peluang kerja sama profesional.",
          actionLink: "https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20tertarik%20berkolaborasi!",
          actionText: "Kirim Pesan WhatsApp (0813-1881-6058)"
        },
        {
          x: 6.5, y: 3.8,
          type: "teleport",
          title: "Kotak Surat: Email Resmi",
          text: "Kirim surat elektronik ke alamat resmi: mangarapakpahan51@gmail.com",
          actionLink: "mailto:mangarapakpahan51@gmail.com",
          actionText: "Kirim Email Resmi"
        },
        {
          x: 7.5, y: 2.8,
          type: "portal",
          title: "KEMBALI KE LEVEL 1 / RESTART",
          isPortal: true
        }
      ]
    }
  ];

  // ─── 3. FIRST-PERSON ENGINE STATE ─────────────────────────────
  let canvas = null;
  let ctx = null;
  let minimapCanvas = null;
  let minimapCtx = null;

  let currentLvlIdx = 0;
  let activeModal = null;

  const player = {
    x: 2.5,
    y: 2.5,
    angle: 0,
    speed: 0.045,
    rotSpeed: 0.038,
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

  // ─── 4. RAYCASTING ENGINE (DDA ALGORITHM) ──────────────────────
  function castRay(rayAngle, lvl) {
    const map = lvl.map;
    const mapH = map.length;
    const mapW = map[0].length;

    const cos = Math.cos(rayAngle);
    const sin = Math.sin(rayAngle);

    // Initial grid position
    let mapX = Math.floor(player.x);
    let mapY = Math.floor(player.y);

    // Distance ray travels from one x or y-side to next
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
    let side = 0; // 0 for vertical, 1 for horizontal

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
      side: side,
      mapX: mapX,
      mapY: mapY
    };
  }

  // ─── 5. BILLBOARDS / SPRITE RENDERING ─────────────────────────
  function drawSprites(lvl, screenW, screenH) {
    const sprites = lvl.sprites;
    // Calculate distance of each sprite to player
    const sprList = sprites.map((s, idx) => {
      const dx = s.x - player.x;
      const dy = s.y - player.y;
      return {
        ...s,
        dist: Math.hypot(dx, dy),
        dx: dx,
        dy: dy
      };
    });

    // Sort far to near (Painter's algorithm)
    sprList.sort((a, b) => b.dist - a.dist);

    for (const spr of sprList) {
      // Transform sprite with inverse camera matrix
      const cos = Math.cos(player.angle);
      const sin = Math.sin(player.angle);

      // Rotate relative to player view
      const transX = spr.dx * sin - spr.dy * cos;
      const transY = spr.dx * cos + spr.dy * sin; // depth

      if (transY <= 0.2) continue; // Behind player

      const screenX = Math.floor((screenW / 2) * (1 - transX / (transY * Math.tan(player.fov / 2))));
      const sprSize = Math.abs(Math.floor(screenH / transY));

      const sprY = Math.floor(screenH / 2 - sprSize / 2 + player.bob);

      // Check if visible and in front of walls
      const rayCol = Math.floor((screenX / screenW) * RAYS_COUNT);
      if (rayCol >= 0 && rayCol < RAYS_COUNT && zBuffer[rayCol] > transY) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // Draw pixel billboard based on type
        if (spr.isPortal) {
          // Glowing portal ring
          const time = Date.now() * 0.005;
          ctx.fillStyle = '#ffe853';
          ctx.fillRect(screenX - sprSize * 0.35, sprY, sprSize * 0.7, sprSize);
          ctx.fillStyle = '#9c27b0';
          ctx.fillRect(screenX - sprSize * 0.25, sprY + sprSize * 0.1, sprSize * 0.5, sprSize * 0.8);
          ctx.fillStyle = '#00e5ff';
          ctx.fillRect(screenX - sprSize * 0.15 + Math.sin(time) * 4, sprY + sprSize * 0.2, sprSize * 0.3, sprSize * 0.6);
        } else if (spr.type === 'chest') {
          // Treasure chest
          ctx.fillStyle = '#b71c1c';
          ctx.fillRect(screenX - sprSize * 0.3, sprY + sprSize * 0.4, sprSize * 0.6, sprSize * 0.5);
          ctx.fillStyle = '#ffe853';
          ctx.fillRect(screenX - sprSize * 0.3, sprY + sprSize * 0.55, sprSize * 0.6, sprSize * 0.1);
        } else if (spr.type === 'npc') {
          // NPC Character
          ctx.fillStyle = '#4a148c';
          ctx.fillRect(screenX - sprSize * 0.25, sprY + sprSize * 0.3, sprSize * 0.5, sprSize * 0.6);
          ctx.fillStyle = '#ffcc80';
          ctx.fillRect(screenX - sprSize * 0.18, sprY, sprSize * 0.36, sprSize * 0.3);
          ctx.fillStyle = '#ffe853';
          ctx.fillRect(screenX - sprSize * 0.2, sprY - sprSize * 0.05, sprSize * 0.4, sprSize * 0.12);
        } else {
          // Holo / Terminal / Scroll
          ctx.fillStyle = '#1a237e';
          ctx.fillRect(screenX - sprSize * 0.25, sprY + sprSize * 0.1, sprSize * 0.5, sprSize * 0.8);
          ctx.fillStyle = '#00e5ff';
          ctx.fillRect(screenX - sprSize * 0.2, sprY + sprSize * 0.15, sprSize * 0.4, sprSize * 0.4);
          ctx.fillStyle = '#ffe853';
          ctx.fillRect(screenX - sprSize * 0.15, sprY + sprSize * 0.6, sprSize * 0.3, sprSize * 0.25);
        }

        // Title banner over sprite
        ctx.fillStyle = '#000000';
        ctx.fillRect(screenX - 50, sprY - 20, 100, 14);
        ctx.fillStyle = '#ffe853';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(spr.title.substring(0, 14), screenX, sprY - 10);

        ctx.restore();
      }
    }
  }

  // ─── 6. MINIMAP RADAR ─────────────────────────────────────────
  function drawMinimap(lvl) {
    if (!minimapCanvas || !minimapCtx) return;
    const map = lvl.map;
    const mapH = map.length;
    const mapW = map[0].length;

    minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);

    const cellW = minimapCanvas.width / mapW;
    const cellH = minimapCanvas.height / mapH;

    // Draw walls
    for (let r = 0; r < mapH; r++) {
      for (let c = 0; c < mapW; c++) {
        if (map[r][c] > 0) {
          minimapCtx.fillStyle = '#3f51b5';
          minimapCtx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
        } else {
          minimapCtx.fillStyle = '#060a1d';
          minimapCtx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
        }
      }
    }

    // Draw sprites on minimap
    for (const spr of lvl.sprites) {
      minimapCtx.fillStyle = spr.isPortal ? '#ff00ff' : '#ffe853';
      minimapCtx.fillRect(spr.x * cellW - 2, spr.y * cellH - 2, 4, 4);
    }

    // Draw Player dot & view line
    const px = player.x * cellW;
    const py = player.y * cellH;

    minimapCtx.fillStyle = '#39ff14';
    minimapCtx.beginPath();
    minimapCtx.arc(px, py, 3, 0, Math.PI * 2);
    minimapCtx.fill();

    // Direction line
    minimapCtx.strokeStyle = '#39ff14';
    minimapCtx.lineWidth = 1.5;
    minimapCtx.beginPath();
    minimapCtx.moveTo(px, py);
    minimapCtx.lineTo(px + Math.cos(player.angle) * 10, py + Math.sin(player.angle) * 10);
    minimapCtx.stroke();
  }

  // ─── 7. UPDATE PLAYER & INTERACTION ───────────────────────────
  function updatePlayer(lvl) {
    if (activeModal) return;

    // Turn
    if (keys.turnLeft) player.angle -= player.rotSpeed;
    if (keys.turnRight) player.angle += player.rotSpeed;

    // Normalize angle
    while (player.angle < 0) player.angle += Math.PI * 2;
    while (player.angle >= Math.PI * 2) player.angle -= Math.PI * 2;

    // Move vectors
    let moveStep = 0;
    if (keys.fwd) moveStep = player.speed;
    if (keys.bwd) moveStep = -player.speed;

    let strafeStep = 0;
    if (keys.strafeLeft) strafeStep = -player.speed * 0.8;
    if (keys.strafeRight) strafeStep = player.speed * 0.8;

    let isMoving = moveStep !== 0 || strafeStep !== 0;

    if (isMoving) {
      player.bob = Math.sin(Date.now() * 0.009) * 4;

      const cos = Math.cos(player.angle);
      const sin = Math.sin(player.angle);

      const dx = cos * moveStep + Math.cos(player.angle + Math.PI / 2) * strafeStep;
      const dy = sin * moveStep + Math.sin(player.angle + Math.PI / 2) * strafeStep;

      // Collision checks with padding
      const nextX = player.x + dx;
      const nextY = player.y + dy;

      const map = lvl.map;
      const pad = 0.25;

      if (
        map[Math.floor(player.y)][Math.floor(nextX + (dx > 0 ? pad : -pad))] === 0
      ) {
        player.x = nextX;
      }

      if (
        map[Math.floor(nextY + (dy > 0 ? pad : -pad))][Math.floor(player.x)] === 0
      ) {
        player.y = nextY;
      }
    } else {
      player.bob = 0;
    }

    // Check interaction with nearest sprite
    let nearestSprite = null;
    let nearestDist = 999;

    for (const spr of lvl.sprites) {
      const d = Math.hypot(spr.x - player.x, spr.y - player.y);
      if (d < 1.8 && d < nearestDist) {
        nearestDist = d;
        nearestSprite = spr;
      }
    }

    const cue = document.getElementById('fps-interaction-cue');
    if (cue) {
      if (nearestSprite) {
        if (nearestSprite.isPortal) {
          cue.style.display = 'block';
          cue.textContent = `[PORTAL] TEKAN E UNTUK MASUK KE LEVEL SELANJUTNYA ▶`;
        } else {
          cue.style.display = 'block';
          cue.textContent = `[TEKAN E] BUKA: ${nearestSprite.title}`;
        }

        if (keys.interact) {
          if (nearestSprite.isPortal) {
            advanceLevel();
          } else {
            openFPSModal(nearestSprite);
          }
          keys.interact = false;
        }
      } else {
        cue.style.display = 'none';
      }
    }
  }

  function advanceLevel() {
    playLevelClearSound();
    currentLvlIdx = (currentLvlIdx + 1) % FPS_LEVELS.length;
    resetPlayerForFPSLevel();
  }

  function resetPlayerForFPSLevel() {
    const lvl = FPS_LEVELS[currentLvlIdx];
    player.x = lvl.spawn.x;
    player.y = lvl.spawn.y;
    player.angle = lvl.spawn.angle;

    const title = document.getElementById('fps-level-title');
    const sit = document.getElementById('fps-situation-text');
    if (title) title.textContent = lvl.name;
    if (sit) sit.textContent = lvl.situation;

    const btns = document.querySelectorAll('.fps-lvl-btn');
    btns.forEach((b, i) => b.classList.toggle('active', i === currentLvlIdx));
  }

  function openFPSModal(spr) {
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
        actions.innerHTML = `<button id="fps-modal-close" class="pixel-btn-close">Tutup [Esc]</button>`;
      }
      document.getElementById('fps-modal-close')?.addEventListener('click', closeFPSModal);
    }
  }

  function closeFPSModal() {
    activeModal = null;
    const modal = document.getElementById('pixel-dialogue-modal');
    if (modal) modal.style.display = 'none';
  }

  // ─── 8. RENDER 3D FRAME ───────────────────────────────────────
  function render3D() {
    if (!canvas || !ctx) return;
    const lvl = FPS_LEVELS[currentLvlIdx];

    const screenW = canvas.width;
    const screenH = canvas.height;

    // 1. Ceiling (Sky with Stars)
    ctx.fillStyle = lvl.ceilingColor;
    ctx.fillRect(0, 0, screenW, screenH / 2);

    // Star twinkle dots in ceiling
    ctx.fillStyle = '#ffe853';
    for (let i = 0; i < 20; i++) {
      const sx = ((i * 47) + (player.angle * 100)) % screenW;
      const sy = (i * 9) % (screenH / 2);
      ctx.fillRect(sx, sy, 2, 2);
    }

    // 2. Floor
    ctx.fillStyle = lvl.floorColor;
    ctx.fillRect(0, screenH / 2, screenW, screenH / 2);

    // 3. Wall Raycasting
    const colW = screenW / RAYS_COUNT;

    for (let i = 0; i < RAYS_COUNT; i++) {
      const rayAngle = player.angle - player.fov / 2 + (i / RAYS_COUNT) * player.fov;
      const hit = castRay(rayAngle, lvl);

      // Fish-eye correction
      const correctedDist = hit.dist * Math.cos(rayAngle - player.angle);
      zBuffer[i] = correctedDist;

      const wallHeight = Math.min(screenH * 1.5, Math.floor(screenH / correctedDist));
      const wallTop = Math.floor(screenH / 2 - wallHeight / 2 + player.bob);

      // Depth Shading: Darker when further
      const shade = Math.max(0.2, Math.min(1.0, 1.4 / (1 + correctedDist * 0.4)));

      if (hit.side === 0) {
        ctx.fillStyle = lvl.wallColorLight;
      } else {
        ctx.fillStyle = lvl.wallColorDark;
      }

      ctx.fillRect(i * colW, wallTop, colW + 0.5, wallHeight);

      // Dark shadow overlay for depth
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - shade})`;
      ctx.fillRect(i * colW, wallTop, colW + 0.5, wallHeight);
    }

    // 4. Draw 3D Billboard Sprites
    drawSprites(lvl, screenW, screenH);

    // 5. Draw Minimap
    drawMinimap(lvl);
  }

  function fpsLoop() {
    updatePlayer(FPS_LEVELS[currentLvlIdx]);
    render3D();
    requestAnimationFrame(fpsLoop);
  }

  // ─── 9. DOM MOUNTING & CONTROLS ───────────────────────────────
  function buildFPSViewport() {
    const mainSection = document.getElementById('pixel-game-adventure-section');
    if (!mainSection) return;

    // Create First-Person View Container
    const fpsDiv = document.createElement('div');
    fpsDiv.id = 'pixel-fps-walkthrough-section';
    fpsDiv.className = 'pixel-fps-container';

    fpsDiv.innerHTML = `
      <div class="fps-header-bar">
        <div class="fps-title-group">
          <span class="fps-mode-badge">👁️ FIRST-PERSON 3D WALKTHROUGH MODE</span>
          <h2 id="fps-level-title" class="fps-level-title">${FPS_LEVELS[0].name}</h2>
          <span id="fps-situation-text" class="fps-situation-text">${FPS_LEVELS[0].situation}</span>
        </div>

        <div class="fps-hud-stats">
          <div class="fps-stat-pill">★ FPS: 60</div>
          <button id="fps-sfx-btn" class="pixel-hud-btn">🔊 SFX</button>
          <a href="#main-portfolio-content" class="pixel-hud-btn" style="text-decoration:none; background:#2bb44a;">📄 CV / DOKUMEN</a>
        </div>
      </div>

      <!-- Level Selector -->
      <div class="fps-level-nav">
        <span class="fps-level-label">PILIH RUANGAN 3D:</span>
        <div class="fps-level-btns">
          <button class="fps-lvl-btn active" data-lvl="0">1. Atrium Awal</button>
          <button class="fps-lvl-btn" data-lvl="1">2. Koridor Karier</button>
          <button class="fps-lvl-btn" data-lvl="2">3. Cyber 50+ Proyek</button>
          <button class="fps-lvl-btn" data-lvl="3">4. Arsip Riset</button>
          <button class="fps-lvl-btn" data-lvl="4">5. Menara Puncak</button>
        </div>
      </div>

      <!-- 3D Viewport -->
      <div class="fps-viewport-wrapper" id="fps-viewport-wrapper">
        <canvas id="pixel-fps-canvas" width="640" height="360"></canvas>
        <div class="fps-crosshair"></div>
        <div class="fps-hand-overlay"></div>
        <div id="fps-interaction-cue" class="fps-interaction-cue">[TEKAN E] INTERAKSI</div>

        <!-- Minimap -->
        <div class="fps-minimap-card">
          <canvas id="fps-minimap-canvas" width="100" height="100"></canvas>
        </div>
      </div>

      <!-- Mobile Touch Controls -->
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
    `;

    // Insert right before the 2D section
    mainSection.parentNode.insertBefore(fpsDiv, mainSection);

    canvas = document.getElementById('pixel-fps-canvas');
    if (canvas) ctx = canvas.getContext('2d');

    minimapCanvas = document.getElementById('fps-minimap-canvas');
    if (minimapCanvas) minimapCtx = minimapCanvas.getContext('2d');

    // Level buttons
    const btns = fpsDiv.querySelectorAll('.fps-lvl-btn');
    btns.forEach(b => {
      b.addEventListener('click', () => {
        initAudio();
        currentLvlIdx = parseInt(b.dataset.lvl, 10) || 0;
        resetPlayerForFPSLevel();
      });
    });

    // SFX button
    const sfxBtn = document.getElementById('fps-sfx-btn');
    sfxBtn?.addEventListener('click', () => {
      initAudio();
      sfxOn = !sfxOn;
      sfxBtn.textContent = sfxOn ? '🔊 SFX' : '🔇 SFX';
    });

    setupKeyboard();
    setupTouch();
  }

  function setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      initAudio();
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.fwd = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.bwd = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.turnLeft = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.turnRight = true;
      if (e.code === 'KeyQ') keys.strafeLeft = true;
      if (e.code === 'KeyE') keys.interact = true;
      if (e.code === 'Escape' && activeModal) closeFPSModal();
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.fwd = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.bwd = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.turnLeft = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.turnRight = false;
      if (e.code === 'KeyQ') keys.strafeLeft = false;
      if (e.code === 'KeyE') keys.interact = false;
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

  // ─── 10. INIT ─────────────────────────────────────────────────
  function init() {
    buildFPSViewport();
    requestAnimationFrame(fpsLoop);
    console.log('👁️ First-Person 3D Raycasting Walkthrough Engine activated successfully!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
