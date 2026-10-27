/**
 * gallery-3d-experience.js
 * Immersive Contemporary Architectural Gallery & Dual Experience Hub
 * S1 Teknik Informatika ITPLN • Mangara Ferdianto Pakpahan
 * Inspired by Museum MACAN, ROH Projects, & Curated Art Pavilions in Jakarta
 * - First-Person Walkable 3D Gallery (Three.js WebGL, 60FPS)
 * - Ultra-Luxury Architectural Atmosphere: Polished Italian Marble Floor, Venetian Plaster,
 *   Walnut Feature Walls, Zen Glass Courtyard Atrium, Rotating Golden Trophy, Deep-Box Frames
 * - Dual Experience System: Instant Choice between 3D Virtual Gallery vs Direct Portfolio Documents
 * - Complete Collision Physics (Cannot clip through walls, glass vitrines, or plinths)
 * - Proximity Detection & Exhibition Lightbox Inspector
 * - Recruiter Fast-Track Hub with 1-Click ATS CV Downloads & WhatsApp
 * - Desktop (Pointer Lock / WASD / Click) & Mobile (Touch Joystick & Drag)
 * - Synthesized Curatorial Sound System (Web Audio API)
 */

import { DEFAULT_DATA } from './default-data.js';

(function () {
  'use strict';

  // ─── 1. GLOBAL STATE & THREE.JS REFERENCES ────────────────────
  let scene, camera, renderer;
  let canvasContainer, canvas;
  let isPointerLocked = false;
  let isModalOpen = false;
  let is3DActive = true;
  let animFrameId = null;
  let rotatingTrophy = null;
  let textureLoader = null;

  // Audio System (Web Audio API - Zero External Dependencies)
  let audioCtx = null;
  let isAmbiencePlaying = false;
  let ambienceOsc = null;
  let ambienceGain = null;

  const player = {
    x: 0,
    y: 1.7, // Human eye height (1.7 meters)
    z: -3.5,
    vx: 0,
    vz: 0,
    rotX: 0,
    rotY: 0,
    radius: 0.45,
    speed: 0.08,
    damping: 0.82
  };

  const keys = {
    fwd: false,
    bwd: false,
    left: false,
    right: false,
    interact: false
  };

  // Spatial structures for collisions & raycasting
  const collisionBoxes = [];
  const interactiveExhibits = [];
  let nearestExhibit = null;

  // ─── 2. SOUND SYNTHESIZER (WEB AUDIO API) ─────────────────────
  function initAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCuratorialChime() {
    try {
      initAudioContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now); // Solfeggio 528Hz (Harmonic crystal tone)
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1056, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } catch (e) {
      // Audio optional
    }
  }

  function toggleAmbienceSound() {
    initAudioContext();
    if (!audioCtx) return false;

    const btn = document.getElementById('btn-gallery-audio');

    if (isAmbiencePlaying) {
      if (ambienceGain) {
        ambienceGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          try { ambienceOsc?.stop(); } catch (e) {}
          ambienceOsc = null;
          ambienceGain = null;
        }, 500);
      }
      isAmbiencePlaying = false;
      if (btn) btn.innerHTML = `<ion-icon name="volume-mute-outline"></ion-icon> <span>Audio Ambience</span>`;
      return false;
    } else {
      const now = audioCtx.currentTime;
      ambienceOsc = audioCtx.createOscillator();
      ambienceGain = audioCtx.createGain();

      ambienceOsc.type = 'sine';
      ambienceOsc.frequency.setValueAtTime(136.1, now); // 136.1 Hz (Soothing museum acoustic resonance)

      ambienceGain.gain.setValueAtTime(0.001, now);
      ambienceGain.gain.linearRampToValueAtTime(0.02, now + 1.5);

      ambienceOsc.connect(ambienceGain);
      ambienceGain.connect(audioCtx.destination);

      ambienceOsc.start(now);
      isAmbiencePlaying = true;
      if (btn) btn.innerHTML = `<ion-icon name="volume-high-outline"></ion-icon> <span>Ambience: Aktif</span>`;
      return true;
    }
  }

  // ─── 3. TEXTURE FACTORY (PROCEDURAL LUXURY MATERIALS) ─────────

  // High-Gloss Nero Marquina Marble with Polished Gold Brass Inlays
  function createLuxuryMarbleFloorTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d');

    // Base rich charcoal-noir marble
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, '#101318');
    grad.addColorStop(0.5, '#171b22');
    grad.addColorStop(1, '#0c0f13');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle mineral stone mottling
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const gray = Math.floor(22 + Math.random() * 26);
      ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray + 4}, 0.35)`;
      ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
    }

    // Organic marble veins (fine ivory and gold mineral traces)
    ctx.lineWidth = 1.5;
    for (let v = 0; v < 16; v++) {
      ctx.strokeStyle = (v % 4 === 0) ? 'rgba(212, 175, 55, 0.22)' : 'rgba(240, 242, 248, 0.14)';
      ctx.beginPath();
      let curX = Math.random() * 1024;
      let curY = Math.random() * 1024;
      ctx.moveTo(curX, curY);
      for (let step = 0; step < 8; step++) {
        curX += (Math.random() - 0.5) * 200;
        curY += (Math.random() - 0.5) * 200;
        ctx.lineTo(curX, curY);
      }
      ctx.stroke();
    }

    // Architectural Gold Brass Grid Inlays (border slabs)
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 1016, 1016);
    ctx.beginPath();
    ctx.moveTo(512, 0); ctx.lineTo(512, 1024);
    ctx.moveTo(0, 512); ctx.lineTo(1024, 512);
    ctx.stroke();

    // Polished brass corner studs
    ctx.fillStyle = '#dfb96c';
    const corners = [
      [16, 16], [512, 16], [1008, 16],
      [16, 512], [512, 512], [1008, 512],
      [16, 1008], [512, 1008], [1008, 1008]
    ];
    for (const [cx, cy] of corners) {
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 12);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  // Venetian Ivory Plaster Wall Texture
  function createVenetianPlasterWallTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#f6f5ef';
    ctx.fillRect(0, 0, 512, 512);

    // Micro-texture for velvety venetian plaster
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const val = Math.floor(238 + Math.random() * 17);
      ctx.fillStyle = `rgb(${val}, ${val - 1}, ${val - 4})`;
      ctx.fillRect(x, y, 2, 2);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  // Architectural Dark Walnut Wood Texture
  function createWalnutWoodTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#1e1814';
    ctx.fillRect(0, 0, 512, 512);

    // Wood grain lines
    for (let y = 0; y < 512; y += 4) {
      const shade = Math.floor(24 + Math.random() * 18);
      ctx.fillStyle = `rgb(${shade + 8}, ${shade}, ${shade - 4})`;
      ctx.fillRect(0, y, 512, 3);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  // Museum Plaque / Cartellino Texture
  function createPlaqueTexture(title, subtitle, meta) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d');

    // Luxurious warm white card with brushed gold border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 4;
    ctx.strokeRect(3, 3, 506, 250);

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px "Cinzel", "Plus Jakarta Sans", serif';
    ctx.fillText((title || '').substring(0, 32), 24, 55);

    // Subtitle / Category
    ctx.fillStyle = '#b38e2b';
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText((subtitle || '').substring(0, 40).toUpperCase(), 24, 88);

    // Decorative gold separator line
    ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(24, 102);
    ctx.lineTo(488, 102);
    ctx.stroke();

    // Metadata lines
    ctx.fillStyle = '#475569';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    if (meta) {
      const words = meta.split(' ');
      let line1 = '';
      let line2 = '';
      for (const w of words) {
        if ((line1 + w).length < 42) line1 += w + ' ';
        else if ((line2 + w).length < 42) line2 += w + ' ';
      }
      ctx.fillText(line1, 24, 134);
      ctx.fillText(line2, 24, 158);
    }

    // Interaction cue
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✦ [ E / Klik ] Buka Rincian Karya Kuratorial', 24, 214);

    const tex = new THREE.CanvasTexture(c);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  // ─── 4. GALLERY ARCHITECTURE BUILDER ──────────────────────────
  function buildGalleryScene(data) {
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf5f4ee,
      roughness: 0.88,
      metalness: 0.02,
      map: createVenetianPlasterWallTexture()
    });

    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x221a15,
      roughness: 0.45,
      metalness: 0.08,
      map: createWalnutWoodTexture()
    });

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x181b22,
      roughness: 0.22,
      metalness: 0.35,
      map: createLuxuryMarbleFloorTexture()
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x0f1217,
      roughness: 0.95
    });

    const brushedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.88
    });

    const leatherBenchMat = new THREE.MeshStandardMaterial({
      color: 0x825534, // Caramel leather
      roughness: 0.55,
      metalness: 0.05
    });

    // Helper: Add solid wall box with collision
    function addWall(x, z, w, d, h = 4.6, mat = wallMat) {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, h / 2, z);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);

      // Register collision box (minX, maxX, minZ, maxZ)
      collisionBoxes.push({
        minX: x - w / 2,
        maxX: x + w / 2,
        minZ: z - d / 2,
        maxZ: z + d / 2
      });
      return mesh;
    }

    // Helper: Add Floor & Ceiling slab with coffered cove beam
    function addRoomSlab(x, z, w, d) {
      // Floor
      const fGeo = new THREE.PlaneGeometry(w, d);
      const floor = new THREE.Mesh(fGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(x, 0, z);
      floor.receiveShadow = true;
      scene.add(floor);

      // Ceiling
      const cGeo = new THREE.PlaneGeometry(w, d);
      const ceiling = new THREE.Mesh(cGeo, ceilingMat);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.set(x, 4.6, z);
      scene.add(ceiling);

      // Recessed cove beam
      const beamGeo = new THREE.BoxGeometry(w * 0.85, 0.12, 0.3);
      const beam = new THREE.Mesh(beamGeo, walnutMat);
      beam.position.set(x, 4.54, z);
      scene.add(beam);

      // Brass track light rail beneath beam
      const railGeo = new THREE.BoxGeometry(w * 0.82, 0.04, 0.06);
      const rail = new THREE.Mesh(railGeo, brushedGoldMat);
      rail.position.set(x, 4.46, z);
      scene.add(rail);
    }

    // Helper: Add Luxury Museum Bench
    function addGalleryBench(x, z, ry = 0) {
      const benchGroup = new THREE.Group();
      benchGroup.position.set(x, 0, z);
      benchGroup.rotation.y = ry;

      // Leather Cushion
      const seatGeo = new THREE.BoxGeometry(2.6, 0.22, 0.9);
      const seat = new THREE.Mesh(seatGeo, leatherBenchMat);
      seat.position.y = 0.48;
      seat.castShadow = true;
      benchGroup.add(seat);

      // Black Steel Base
      const legGeo = new THREE.BoxGeometry(2.4, 0.36, 0.7);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.3, metalness: 0.8 });
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.y = 0.18;
      leg.castShadow = true;
      benchGroup.add(leg);

      scene.add(benchGroup);

      collisionBoxes.push({
        minX: x - 1.4,
        maxX: x + 1.4,
        minZ: z - 0.55,
        maxZ: z + 0.55
      });
    }

    // Helper: Architectural Zen Glass Atrium Courtyard (Lobby Centerpiece)
    function addZenGlassAtrium(x, z) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // White river pebble base slab
      const pebbleGeo = new THREE.BoxGeometry(3.6, 0.14, 3.6);
      const pebbleMat = new THREE.MeshStandardMaterial({ color: 0xeae8e1, roughness: 0.9 });
      const pebble = new THREE.Mesh(pebbleGeo, pebbleMat);
      pebble.position.y = 0.07;
      group.add(pebble);

      // Dark bronze rim around pebble bed
      const rimGeo = new THREE.BoxGeometry(3.8, 0.18, 3.8);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0x221a15, roughness: 0.4, metalness: 0.5 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.y = 0.06;
      group.add(rim);

      // Glass Enclosure walls
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.28,
        roughness: 0.04,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.52
      });

      const glassH = 3.8;
      const gWall1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, glassH, 0.08), glassMat);
      gWall1.position.set(0, glassH / 2, 1.8);
      group.add(gWall1);

      const gWall2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, glassH, 0.08), glassMat);
      gWall2.position.set(0, glassH / 2, -1.8);
      group.add(gWall2);

      const gWall3 = new THREE.Mesh(new THREE.BoxGeometry(0.08, glassH, 3.6), glassMat);
      gWall3.position.set(1.8, glassH / 2, 0);
      group.add(gWall3);

      const gWall4 = new THREE.Mesh(new THREE.BoxGeometry(0.08, glassH, 3.6), glassMat);
      gWall4.position.set(-1.8, glassH / 2, 0);
      group.add(gWall4);

      // Sculptural Bonsai Tree (Geometric contemporary aesthetic)
      const trunkGeo = new THREE.CylinderGeometry(0.08, 0.16, 2.2, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.8 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(0, 1.1, 0);
      trunk.rotation.z = -0.15;
      group.add(trunk);

      // Stylized foliage clusters (Emerald green)
      const folMat = new THREE.MeshStandardMaterial({ color: 0x1f5935, roughness: 0.65 });
      const fol1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55), folMat);
      fol1.position.set(-0.25, 2.1, 0.1);
      group.add(fol1);

      const fol2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42), folMat);
      fol2.position.set(0.3, 1.8, -0.15);
      group.add(fol2);

      const fol3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38), folMat);
      fol3.position.set(0.1, 2.4, 0);
      group.add(fol3);

      // Uplight inside courtyard
      const uplight = new THREE.PointLight(0xfff3db, 1.8, 8);
      uplight.position.set(0, 0.4, 0);
      group.add(uplight);

      scene.add(group);

      collisionBoxes.push({
        minX: x - 1.95,
        maxX: x + 1.95,
        minZ: z - 1.95,
        maxZ: z + 1.95
      });
    }

    // ─── A. ROOM 1: GRAND RECEPTION ATRIUM (X: -10 to 10, Z: -12 to 4) ───
    addRoomSlab(0, -4, 20, 16);

    // Perimeter walls
    addWall(0, -12, 20, 0.6); // South back wall
    addWall(-10, -4, 0.6, 16); // West wall
    addWall(10, -4, 0.6, 16); // East wall

    // North wall with grand 5m portal opening to Central Hall
    addWall(-6.5, 4, 7, 0.6);
    addWall(6.5, 4, 7, 0.6);

    // Reception Monolith Desk
    const deskGeo = new THREE.BoxGeometry(4.4, 1.1, 1.4);
    const desk = new THREE.Mesh(deskGeo, walnutMat);
    desk.position.set(0, 0.55, -6.5);
    desk.castShadow = true;
    scene.add(desk);
    collisionBoxes.push({ minX: -2.3, maxX: 2.3, minZ: -7.3, maxZ: -5.7 });

    // Architectural Sign on South Wall
    createArchitecturalSign(
      0, 2.9, -11.6, 8.5, 1.6,
      "MANGARA FERDIANTO PAKPAHAN",
      "CONTEMPORARY RETROSPECTIVE & ARCHITECTURAL EXHIBITION",
      "S1 Teknik Informatika ITPLN • Data Analyst • Social Media & Humas • Creative Director"
    );

    // Central Zen Glass Courtyard between Reception and Central Corridor
    addZenGlassAtrium(0, -0.5);

    // Reception Curatorial CV Plinths
    addExhibitionPlinth(
      -3.4, -3.5, 0.9, 1.05, 0.9,
      "Curriculum Vitae: Data Analyst",
      "Berkas Resmi Teruji ATS • PDF",
      "Spesialisasi analitik data, SQL database, SEM-PLS 120 JP, Azure Databricks Machine Learning, dan MOS Excel 2019.",
      "./CV_Mangara_Pakpahan_Data_Analyst.pdf",
      "./assets/images/portfolio/card-8.jpg",
      "📥 Unduh CV Data Analyst (PDF)"
    );

    addExhibitionPlinth(
      3.4, -3.5, 0.9, 1.05, 0.9,
      "Curriculum Vitae: Social Media & Humas",
      "Berkas Resmi Teruji ATS • PDF",
      "Spesialisasi komunikasi korporat, Humas ITPLN, Magang PJCI, dan peningkatan engagement audiens hingga 3x lipat.",
      "./CV_Mangara_Pakpahan_Sosmed_Humas.pdf",
      "./assets/images/portfolio/card-4.jpg",
      "📥 Unduh CV Sosmed & Humas (PDF)"
    );

    // ─── B. CENTRAL CIRCULATION CORRIDOR (X: -4 to 4, Z: 4 to 22) ────────
    addRoomSlab(0, 13, 8, 18);
    // East and West partition walls with doorways
    addWall(-4, 8, 0.6, 6, 4.6, walnutMat);
    addWall(-4, 18, 0.6, 6, 4.6, walnutMat);
    addWall(4, 8, 0.6, 6, 4.6, walnutMat);
    addWall(4, 18, 0.6, 6, 4.6, walnutMat);

    // Center Circulation Directional Totem
    createWayfindingTotem(0, 13);

    // Museum Bench in Corridor
    addGalleryBench(0, 17.5, 0);

    // ─── C. WEST WING: PORTFOLIO EXHIBITION HALL (X: -24 to -4, Z: 4 to 32) ───
    addRoomSlab(-14, 18, 20, 28);
    addWall(-24, 18, 0.6, 28); // Outer West Wall
    addWall(-14, 32, 20, 0.6); // North Wall
    addWall(-14, 4, 20, 0.6); // South Wall

    // Partition walls inside portfolio room
    addWall(-14, 14, 10, 0.4, 4.6, walnutMat);
    addWall(-14, 24, 10, 0.4, 4.6, walnutMat);

    // Museum Bench in Portfolio Room
    addGalleryBench(-14, 19, Math.PI / 2);

    // Mount Curated Portfolio Projects on Walls
    const projects = data.projects || [];

    // Group 1: Live Production & Broadcasting (North & West Walls)
    if (projects[12]) addFramedArtwork(-23.6, 2.3, 8, 3.2, 1.9, 0, Math.PI / 2, projects[12]); // Wisuda ke-46
    if (projects[13]) addFramedArtwork(-23.6, 2.3, 13, 3.0, 1.8, 0, Math.PI / 2, projects[13]); // Studium Generale Nuklir
    if (projects[14]) addFramedArtwork(-23.6, 2.3, 18, 3.0, 1.8, 0, Math.PI / 2, projects[14]); // Kontrak Kerja PLN
    if (projects[15]) addFramedArtwork(-23.6, 2.3, 23, 2.8, 1.7, 0, Math.PI / 2, projects[15]); // APERTI BUMN

    // Group 2: IoT Engineering & Innovation (Center Partition Walls)
    if (projects[7]) addFramedArtwork(-14, 2.3, 13.7, 2.8, 1.8, 0, 0, {
      title: "IoT LPG-SafeSense (Juara 1 Inovasi MKI)",
      category: "IoT & Hardware Engineering",
      imageUrl: "./assets/images/portfolio/card-8.jpg",
      description: "Riset dan rekayasa perangkat pendeteksi kebocoran gas LPG dan pemantau sisa berat tabung berbasis mikrokontroler sensor MQ-6 dan load cell cloud mobile apps.",
      projectUrl: "https://itpln.ac.id"
    });

    if (projects[29]) addFramedArtwork(-14, 2.3, 14.3, 2.8, 1.8, 0, Math.PI, projects[29]); // Juara 1 IPB Ocean Experience
    if (projects[30]) addFramedArtwork(-14, 2.3, 23.7, 2.8, 1.8, 0, 0, projects[30]); // Badminton Dies Natalis
    if (projects[35]) addFramedArtwork(-14, 2.3, 24.3, 3.0, 1.8, 0, Math.PI, projects[35]); // Company Profile ITPLN Media

    // Group 3: Social Media & Web Redaksi (North & South Walls)
    if (projects[0]) addFramedArtwork(-18, 2.3, 31.6, 2.8, 1.8, 0, Math.PI, projects[0]); // @itpln
    if (projects[3]) addFramedArtwork(-10, 2.3, 31.6, 2.8, 1.8, 0, Math.PI, projects[3]); // @smartgridindonesia
    if (projects[6]) addFramedArtwork(-18, 2.3, 4.4, 2.8, 1.8, 0, 0, projects[6]); // pjci.or.id
    if (projects[7]) addFramedArtwork(-10, 2.3, 4.4, 2.8, 1.8, 0, 0, projects[7]); // itpln.ac.id

    // ─── D. EAST WING: CAREER & LEADERSHIP TIMELINE (X: 4 to 24, Z: 4 to 32) ──
    addRoomSlab(14, 18, 20, 28);
    addWall(24, 18, 0.6, 28); // Outer East Wall
    addWall(14, 32, 20, 0.6); // North Wall
    addWall(14, 4, 20, 0.6); // South Wall

    // Mount Career Timeline Panels
    const exp = data.experience || [];
    if (exp[0]) addTimelineExhibitPanel(23.6, 2.3, 8, Math.PI / 2, exp[0]); // PJCI Magang
    if (exp[1]) addTimelineExhibitPanel(23.6, 2.3, 14, Math.PI / 2, exp[1]); // PJCI Redaksi
    if (exp[2]) addTimelineExhibitPanel(23.6, 2.3, 20, Math.PI / 2, exp[2]); // Humas ITPLN BHMS
    if (exp[4]) addTimelineExhibitPanel(23.6, 2.3, 26, Math.PI / 2, exp[4]); // Ketua Pelaksana NCC 2025

    if (exp[5]) addTimelineExhibitPanel(18, 2.3, 31.6, Math.PI, exp[5]); // ITPLN Media Deputy Manager
    if (exp[6]) addTimelineExhibitPanel(10, 2.3, 31.6, Math.PI, exp[6]); // Student Ambassador BPA
    if (exp[7]) addTimelineExhibitPanel(18, 2.3, 4.4, 0, exp[7]); // Student Ambassador DQLab

    // ─── E. NORTH PAVILION: HONORS, RESEARCH & RECOGNITION (X: -10 to 10, Z: 22 to 38) ───
    addRoomSlab(0, 30, 20, 16);
    addWall(0, 38, 20, 0.6); // North back wall
    addWall(-10, 30, 0.6, 16); // West Wall
    addWall(10, 30, 0.6, 16); // East Wall

    // North Pavilion Center Glass Vitrine with Rotating Golden Innovation Trophy
    addHonorDisplayVitrine(
      0, 30.5, 2.6, 1.25, 1.25,
      "Juara 1 Inovasi IoT LPG-SafeSense (MKI & ITPLN)",
      "Piala Emas & Riset Inovasi Nasional",
      "Perangkat IoT cerdas terintegrasi cloud & mobile application untuk deteksi kebocoran gas LPG dan pemantau sisa volume tabung gas.",
      "https://itpln.ac.id"
    );

    // Wall Plaques for Certifications & Awards
    addFramedCertificate(-6.2, 2.5, 37.6, 2.3, 1.6, Math.PI, {
      title: "Microsoft Azure Databricks",
      subtitle: "Machine Learning Associate (8 Modul)",
      meta: "Automated ML, Hyperparameter Tuning, MLflow Lifecycle Management, and Apache Spark on Databricks."
    });

    addFramedCertificate(0, 2.5, 37.6, 2.3, 1.6, Math.PI, {
      title: "Microsoft Corporation",
      subtitle: "Microsoft Office Specialist: Excel 2019",
      meta: "Pemodelan data bisnis, analisis statistik, formula logika tingkat lanjut, dan visualisasi dasbor korporat."
    });

    addFramedCertificate(6.2, 2.5, 37.6, 2.3, 1.6, Math.PI, {
      title: "PT Educativa Cipta Nawasena",
      subtitle: "Sertifikasi Riset Kuantitatif SEM-PLS (120 JP)",
      meta: "Structural Equation Modeling, path analysis mediasi & moderasi, uji validitas & reliabilitas data empiris."
    });

    // ─── F. LIGHTING SCHEME (WARM LUXURY MUSEUM AMBIENCE) ─────────
    // Ambient soft fill light
    const ambientLight = new THREE.AmbientLight(0xfff9ed, 0.82);
    scene.add(ambientLight);

    // Warm Directional Skylight
    const skyLight = new THREE.DirectionalLight(0xfffdf7, 0.95);
    skyLight.position.set(6, 14, 12);
    skyLight.castShadow = true;
    skyLight.shadow.mapSize.width = 2048;
    skyLight.shadow.mapSize.height = 2048;
    skyLight.shadow.camera.near = 0.5;
    skyLight.shadow.camera.far = 45;
    skyLight.shadow.bias = -0.0004;
    scene.add(skyLight);

    // Focused Warm Museum Spotlights
    addSpotlight(-23.6, 8, 8, -23.6, 2.2, 8);
    addSpotlight(0, 4.4, -6.5, 0, 1.2, -6.5);
    addSpotlight(0, 4.4, 30.5, 0, 1.6, 30.5);
    addSpotlight(-14, 4.4, 14, -14, 2.2, 14);
    addSpotlight(23.6, 8, 14, 23.6, 2.2, 14);
  }

  function addSpotlight(lx, ly, lz, tx, ty, tz) {
    const spot = new THREE.SpotLight(0xfff0d6, 1.8);
    spot.position.set(lx, ly, lz);
    spot.angle = Math.PI / 4.2;
    spot.penumbra = 0.65;
    spot.decay = 1.5;
    spot.distance = 20;
    spot.target.position.set(tx, ty, tz);
    scene.add(spot);
    scene.add(spot.target);
  }

  // ─── 5. EXHIBIT FACTORY (CANVASES, FRAMES & LABELS) ───────────
  function addFramedArtwork(x, y, z, w, h, rx, ry, project) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.set(rx, ry, 0);

    // Deep-Box Frame: Outer obsidian border
    const frameGeo = new THREE.BoxGeometry(w + 0.16, h + 0.16, 0.1);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.35, metalness: 0.8 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    // Inner Brushed Brass Trim Bevel
    const goldRimGeo = new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.11);
    const goldRimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.9 });
    const goldRim = new THREE.Mesh(goldRimGeo, goldRimMat);
    group.add(goldRim);

    // Museum Passe-Partout White Matting
    const matGeo = new THREE.BoxGeometry(w + 0.02, h + 0.02, 0.115);
    const matMat = new THREE.MeshStandardMaterial({ color: 0xfbfbfb, roughness: 0.95 });
    const mat = new THREE.Mesh(matGeo, matMat);
    group.add(mat);

    // Canvas Artwork Plane with Authentic Image
    const canvasGeo = new THREE.PlaneGeometry(w - 0.14, h - 0.14);
    const canvasMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.38
    });

    if (project.imageUrl) {
      textureLoader.load(
        project.imageUrl,
        (tex) => {
          if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
          canvasMat.map = tex;
          canvasMat.needsUpdate = true;
        },
        undefined,
        () => {
          canvasMat.color.setHex(0x242a35);
        }
      );
    }

    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.z = 0.06;
    group.add(canvasMesh);

    // Curatorial Label Plaque (Cartellino) below frame
    const plaqueGeo = new THREE.PlaneGeometry(0.85, 0.42);
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: createPlaqueTexture(project.title, project.category, project.description),
      roughness: 0.45
    });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.set(0, -(h / 2 + 0.35), 0.06);
    group.add(plaque);

    scene.add(group);

    // Register as interactive exhibit
    interactiveExhibits.push({
      position: new THREE.Vector3(x, y, z),
      title: project.title,
      category: project.category || "Karya Portofolio",
      description: project.description || "Dokumentasi dan studi kasus pameran proyek.",
      imageUrl: project.imageUrl,
      projectUrl: project.projectUrl
    });
  }

  function addTimelineExhibitPanel(x, y, z, ry, expItem) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.set(0, ry, 0);

    // Architectural Wall Panel with Gold Rim
    const panelGeo = new THREE.BoxGeometry(2.5, 2.1, 0.08);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.5, metalness: 0.3 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    group.add(panel);

    const rimGeo = new THREE.BoxGeometry(2.54, 2.14, 0.06);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.85 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    group.add(rim);

    // Graphic Header Plaque
    const plaqueGeo = new THREE.PlaneGeometry(2.3, 1.9);
    const plaqueTex = createPlaqueTexture(
      expItem.position || "Riwayat Peran",
      expItem.company || "Lembaga / Organisasi",
      `${expItem.period || ''} — ${expItem.description || ''}`
    );
    const plaqueMat = new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.4 });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.z = 0.05;
    group.add(plaque);

    scene.add(group);

    interactiveExhibits.push({
      position: new THREE.Vector3(x, y, z),
      title: `${expItem.position} — ${expItem.company}`,
      category: expItem.period || "Pengalaman Profesional",
      description: expItem.description || "",
      imageUrl: "./assets/images/portfolio/card-1.jpg",
      projectUrl: "https://linkedin.com/in/mangara-ferdianto-pakpahan"
    });
  }

  function addFramedCertificate(x, y, z, w, h, ry, certData) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.set(0, ry, 0);

    const frameGeo = new THREE.BoxGeometry(w, h, 0.07);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f1914, roughness: 0.4, metalness: 0.4 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    const rimGeo = new THREE.BoxGeometry(w + 0.04, h + 0.04, 0.05);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.9 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    group.add(rim);

    const docGeo = new THREE.PlaneGeometry(w - 0.16, h - 0.16);
    const docTex = createPlaqueTexture(certData.title, certData.subtitle, certData.meta);
    const docMat = new THREE.MeshStandardMaterial({ map: docTex, roughness: 0.45 });
    const doc = new THREE.Mesh(docGeo, docMat);
    doc.position.z = 0.045;
    group.add(doc);

    scene.add(group);

    interactiveExhibits.push({
      position: new THREE.Vector3(x, y, z),
      title: certData.subtitle || certData.title,
      category: certData.title,
      description: certData.meta,
      imageUrl: "./assets/images/portfolio/card-30.jpg",
      projectUrl: "./CV_Mangara_Pakpahan_Data_Analyst.pdf"
    });
  }

  function addExhibitionPlinth(x, z, w, h, d, title, subtitle, desc, docUrl, previewImg, actionText) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Black Stone Plinth with LED base ring
    const plinthGeo = new THREE.BoxGeometry(w, h, d);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x151820, roughness: 0.4, metalness: 0.3 });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = h / 2;
    plinth.castShadow = true;
    group.add(plinth);

    // Gold Brass Collar
    const collarGeo = new THREE.BoxGeometry(w + 0.04, 0.04, d + 0.04);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.9 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.y = h;
    group.add(collar);

    // Top Illuminated Plaque
    const topPlaqueGeo = new THREE.BoxGeometry(w * 0.88, 0.04, d * 0.88);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createPlaqueTexture(title, subtitle, desc),
      roughness: 0.3
    });
    const topPlaque = new THREE.Mesh(topPlaqueGeo, topMat);
    topPlaque.position.y = h + 0.03;
    group.add(topPlaque);

    scene.add(group);

    collisionBoxes.push({
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2
    });

    interactiveExhibits.push({
      position: new THREE.Vector3(x, h, z),
      title: title,
      category: subtitle,
      description: desc,
      imageUrl: previewImg,
      projectUrl: docUrl,
      actionText: actionText
    });
  }

  function addHonorDisplayVitrine(x, z, w, h, d, title, subtitle, desc, url) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Dark walnut and marble pedestal
    const baseGeo = new THREE.BoxGeometry(w, 0.9, d);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x12151c, roughness: 0.4, metalness: 0.3 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.45;
    group.add(base);

    // Gold ring around base top
    const rimGeo = new THREE.BoxGeometry(w + 0.04, 0.04, d + 0.04);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.9 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = 0.91;
    group.add(rim);

    // Crystal clear glass case on top
    const glassGeo = new THREE.BoxGeometry(w - 0.12, 0.95, d - 0.12);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      roughness: 0.03,
      metalness: 0.05,
      transmission: 0.92,
      ior: 1.54
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = 1.4;
    group.add(glass);

    // ROTATING 3D GOLDEN INNOVATION TROPHY (Sculptural Centerpiece)
    const trophyGroup = new THREE.Group();
    trophyGroup.position.set(0, 1.4, 0);

    const trophyMat = new THREE.MeshStandardMaterial({
      color: 0xdfb96c,
      roughness: 0.15,
      metalness: 0.95
    });

    const octGeo = new THREE.OctahedronGeometry(0.32, 0);
    const trophyCore = new THREE.Mesh(octGeo, trophyMat);
    trophyGroup.add(trophyCore);

    const ringGeo = new THREE.TorusGeometry(0.42, 0.03, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, trophyMat);
    ringMesh.rotation.x = Math.PI / 3;
    trophyGroup.add(ringMesh);

    group.add(trophyGroup);
    rotatingTrophy = trophyGroup;

    // Vitrine Interior Pointlight
    const vitrineLight = new THREE.PointLight(0xfff0db, 1.6, 4);
    vitrineLight.position.set(0, 1.7, 0);
    group.add(vitrineLight);

    // Plaque at base of vitrine
    const plaqueGeo = new THREE.PlaneGeometry(1.4, 0.5);
    const plaqueTex = createPlaqueTexture(title, subtitle, desc);
    const plaqueMat = new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.4 });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.set(0, 0.45, d / 2 + 0.02);
    group.add(plaque);

    scene.add(group);

    collisionBoxes.push({
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2
    });

    interactiveExhibits.push({
      position: new THREE.Vector3(x, 1.4, z),
      title: title,
      category: subtitle,
      description: desc,
      imageUrl: "./assets/images/portfolio/card-8.jpg",
      projectUrl: url
    });
  }

  function createArchitecturalSign(x, y, z, w, h, line1, line2, line3) {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 340;
    const ctx = c.getContext('2d');

    // Dark titanium metallic background
    ctx.fillStyle = '#0f1217';
    ctx.fillRect(0, 0, 1024, 340);

    // Gold brass header stripe
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(40, 40, 140, 4);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 36px "Cinzel", "Plus Jakarta Sans", serif';
    ctx.fillText(line1, 40, 110);

    ctx.fillStyle = '#dfb96c';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(line2.toUpperCase(), 40, 160);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(line3, 40, 220);

    const tex = new THREE.CanvasTexture(c);
    if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;

    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4, metalness: 0.5 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
  }

  function createWayfindingTotem(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Dark stone monolith totem
    const totemGeo = new THREE.BoxGeometry(0.7, 2.7, 0.7);
    const totemMat = new THREE.MeshStandardMaterial({ color: 0x14171f, roughness: 0.35, metalness: 0.6 });
    const totem = new THREE.Mesh(totemGeo, totemMat);
    totem.position.y = 1.35;
    group.add(totem);

    // Gold brass vertical accent strips
    const stripGeo = new THREE.BoxGeometry(0.72, 2.7, 0.04);
    const stripMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.9 });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.y = 1.35;
    group.add(strip);

    scene.add(group);

    collisionBoxes.push({
      minX: x - 0.45,
      maxX: x + 0.45,
      minZ: z - 0.45,
      maxZ: z + 0.45
    });

    interactiveExhibits.push({
      position: new THREE.Vector3(x, 1.5, z),
      title: "Denah Galeri & Direktori Ruangan",
      category: "Wayfinding Totem",
      description: "Pusat panduan tata ruang pameran. Akses cepat ke Sayap Barat (50+ Proyek), Sayap Timur (Linimasa Karier), dan Paviliun Utara (Sertifikasi & Riset).",
      imageUrl: "./assets/images/my-avatar.png",
      actionText: "Buka Direktori Ruangan",
      projectUrl: "#directory"
    });
  }

  // ─── 6. FIRST-PERSON CAMERA & COLLISION CONTROLLER ─────────────
  function updateCameraAndCollision() {
    if (isModalOpen || !is3DActive) return;

    // Damp velocity
    player.vx *= player.damping;
    player.vz *= player.damping;

    // Direction vectors
    const forwardX = -Math.sin(player.rotY);
    const forwardZ = -Math.cos(player.rotY);
    const rightX = Math.cos(player.rotY);
    const rightZ = -Math.sin(player.rotY);

    if (keys.fwd) {
      player.vx += forwardX * player.speed;
      player.vz += forwardZ * player.speed;
    }
    if (keys.bwd) {
      player.vx -= forwardX * player.speed;
      player.vz -= forwardZ * player.speed;
    }
    if (keys.left) {
      player.vx -= rightX * player.speed;
      player.vz -= rightZ * player.speed;
    }
    if (keys.right) {
      player.vx += rightX * player.speed;
      player.vz += rightZ * player.speed;
    }

    // Proposed new positions
    let targetX = player.x + player.vx;
    let targetZ = player.z + player.vz;

    // Collision against all boxes with player radius
    for (const b of collisionBoxes) {
      if (
        targetX + player.radius > b.minX &&
        targetX - player.radius < b.maxX &&
        player.z + player.radius > b.minZ &&
        player.z - player.radius < b.maxZ
      ) {
        targetX = player.x; // Block X movement
      }

      if (
        player.x + player.radius > b.minX &&
        player.x - player.radius < b.maxX &&
        targetZ + player.radius > b.minZ &&
        targetZ - player.radius < b.maxZ
      ) {
        targetZ = player.z; // Block Z movement
      }
    }

    player.x = targetX;
    player.z = targetZ;

    // Update Three.js Camera
    camera.position.set(player.x, player.y, player.z);

    // Camera Euler rotation (Pitch & Yaw)
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = player.rotX;
    euler.y = player.rotY;
    camera.quaternion.setFromEuler(euler);

    // Check Nearest Exhibit
    checkProximityInteraction();
  }

  function checkProximityInteraction() {
    let closest = null;
    let minDistance = 999;

    for (const ex of interactiveExhibits) {
      const d = camera.position.distanceTo(ex.position);
      if (d < 3.2 && d < minDistance) {
        minDistance = d;
        closest = ex;
      }
    }

    nearestExhibit = closest;

    const reticle = document.getElementById('gallery-reticle');
    const prompt = document.getElementById('gallery-interaction-prompt');

    if (closest) {
      if (reticle) reticle.classList.add('active');
      if (prompt) {
        prompt.style.display = 'block';
        prompt.textContent = `✦ [ E / KLIK ] INSPEKSI: ${closest.title.substring(0, 26)}`;
      }

      if (keys.interact) {
        if (closest.projectUrl === '#directory') {
          openDirectoryModal();
        } else {
          openExhibitionLightbox(closest);
        }
        keys.interact = false;
      }
    } else {
      if (reticle) reticle.classList.remove('active');
      if (prompt) prompt.style.display = 'none';
    }

    // Update Room Indicator Badge based on Z and X coordinates
    updateRoomLocationBadge();
  }

  function updateRoomLocationBadge() {
    const badge = document.getElementById('gallery-room-name');
    if (!badge) return;

    if (player.z < 4 && Math.abs(player.x) < 10) {
      badge.textContent = "Grand Reception Atrium";
    } else if (player.x < -4 && player.z >= 4) {
      badge.textContent = "Sayap Barat: Galeri 50+ Proyek";
    } else if (player.x > 4 && player.z >= 4) {
      badge.textContent = "Sayap Timur: Linimasa Karier";
    } else if (player.z > 22 && Math.abs(player.x) <= 10) {
      badge.textContent = "Paviliun Utara: Sertifikasi & Riset";
    } else {
      badge.textContent = "Koridor Sirkulasi Tengah";
    }
  }

  // ─── 7. LIGHTBOX / EXHIBITION DETAIL MODAL ─────────────────────
  function openExhibitionLightbox(exhibit) {
    isModalOpen = true;
    playCuratorialChime();

    const modal = document.getElementById('gallery-lightbox-modal');
    if (!modal) return;

    document.getElementById('lightbox-category').textContent = exhibit.category || "Arsip Kuratorial";
    document.getElementById('lightbox-title').textContent = exhibit.title || "";
    document.getElementById('lightbox-description').textContent = exhibit.description || "";

    const img = document.getElementById('lightbox-image');
    if (img) {
      if (exhibit.imageUrl) {
        img.src = exhibit.imageUrl;
        img.style.display = 'block';
      } else {
        img.style.display = 'none';
      }
    }

    const linkBtn = document.getElementById('lightbox-link-btn');
    if (linkBtn) {
      if (exhibit.projectUrl && exhibit.projectUrl !== '#') {
        linkBtn.href = exhibit.projectUrl;
        linkBtn.style.display = 'inline-flex';
        linkBtn.textContent = exhibit.actionText || 'Buka Dokumen / Tautan Resmi';
      } else {
        linkBtn.style.display = 'none';
      }
    }

    modal.classList.add('active');

    // Release pointer lock when opening modal
    if (document.exitPointerLock) document.exitPointerLock();
  }

  function closeExhibitionLightbox() {
    isModalOpen = false;
    const modal = document.getElementById('gallery-lightbox-modal');
    if (modal) modal.classList.remove('active');
  }

  // ─── 8. FAST TELEPORT NAVIGATION ──────────────────────────────
  function teleportToLocation(roomKey) {
    if (roomKey === 'reception') {
      player.x = 0;
      player.z = -3.5;
      player.rotY = 0;
    } else if (roomKey === 'portfolio') {
      player.x = -14;
      player.z = 10;
      player.rotY = -Math.PI / 2;
    } else if (roomKey === 'career') {
      player.x = 14;
      player.z = 10;
      player.rotY = Math.PI / 2;
    } else if (roomKey === 'honors') {
      player.x = 0;
      player.z = 26;
      player.rotY = 0;
    }
    player.vx = 0;
    player.vz = 0;
    closeDirectoryModal();
  }

  function openDirectoryModal() {
    const modal = document.getElementById('gallery-directory-modal');
    if (modal) modal.classList.add('active');
    if (document.exitPointerLock) document.exitPointerLock();
  }

  function closeDirectoryModal() {
    const modal = document.getElementById('gallery-directory-modal');
    if (modal) modal.classList.remove('active');
  }

  // ─── 9. DUAL-EXPERIENCE CONTROLLER ────────────────────────────
  function setExperienceMode(mode, shouldScroll = true) {
    const container3D = document.getElementById('gallery-viewport-container');
    const collapsedBar = document.getElementById('gallery-collapsed-bar');
    const card3D = document.getElementById('mode-card-3d');
    const cardDirect = document.getElementById('mode-card-direct');
    const floatingPill = document.getElementById('floating-mode-pill');

    if (mode === 'direct') {
      is3DActive = false;
      if (container3D) container3D.style.display = 'none';
      if (collapsedBar) collapsedBar.style.display = 'flex';
      if (card3D) card3D.classList.remove('active');
      if (cardDirect) cardDirect.classList.add('active');

      if (floatingPill) {
        floatingPill.innerHTML = `<ion-icon name="game-controller-outline"></ion-icon> <span>Masuk ke Mode Galeri 3D</span>`;
        floatingPill.classList.add('accent');
      }

      if (shouldScroll) {
        const target = document.getElementById('main-portfolio-content');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      is3DActive = true;
      if (container3D) container3D.style.display = 'block';
      if (collapsedBar) collapsedBar.style.display = 'none';
      if (card3D) card3D.classList.add('active');
      if (cardDirect) cardDirect.classList.remove('active');

      if (floatingPill) {
        floatingPill.innerHTML = `<ion-icon name="document-text-outline"></ion-icon> <span>Mode Dokumen Langsung</span>`;
        floatingPill.classList.remove('accent');
      }

      onWindowResize();

      if (shouldScroll && container3D) {
        container3D.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  // ─── 10. DOM MOUNTING & UI SETUP ──────────────────────────────
  function buildGalleryDOM() {
    const main = document.querySelector('main');
    if (!main) return;

    const wrapper = document.createElement('section');
    wrapper.id = 'contemporary-gallery-experience';
    wrapper.style.width = '100%';

    wrapper.innerHTML = `
      <!-- A. LUXURY DUAL EXPERIENCE SELECTOR (PILIKAN MODE EKSPLORASI) -->
      <div class="luxury-experience-selector" id="luxury-experience-selector">
        <div class="selector-header">
          <div class="selector-curatorial-pill">
            <span>✦</span> PILIH PENGALAMAN EKSPLORASI
          </div>
          <h2 class="selector-headline">Pilih Cara Anda Menjelajahi Portofolio</h2>
          <p class="selector-subheadline">
            Nikmati kemewahan pameran virtual dalam galeri arsitektur 3D first-person, atau langsung telusuri berkas resmi, resume, dan CV ATS tanpa 3D.
          </p>
        </div>

        <div class="experience-modes-grid">
          <!-- OPSI 1: GAME GALERI 3D -->
          <div class="mode-card active" id="mode-card-3d">
            <div class="mode-card-badge">
              <ion-icon name="game-controller-outline"></ion-icon> EKSPLORASI 3D INTERAKTIF
            </div>
            <div class="mode-card-content">
              <h3 class="mode-card-title">Galeri Arsitektur 3D Kontemporer</h3>
              <p class="mode-card-desc">
                Masuki paviliun pameran modern kelas dunia berkecepatan 60 FPS. Berjalan menyusuri 4 sayap kuratorial, dekati 50+ karya asli, piala inovasi berputar, dan nikmati atmosfer galeri seni Jakarta.
              </p>
              <ul class="mode-highlights">
                <li><ion-icon name="checkmark-circle"></ion-icon> First-Person Walkthrough (WASD & Sentuh)</li>
                <li><ion-icon name="checkmark-circle"></ion-icon> 50+ Proyek Terbingkai & Proximity Inspector</li>
                <li><ion-icon name="checkmark-circle"></ion-icon> Vitrin Piala Emas Juara 1 IoT SafeSense</li>
              </ul>
            </div>
            <button class="btn-mode-select btn-select-3d" id="btn-select-3d">
              <ion-icon name="play-circle-outline"></ion-icon>
              <span>Jelajahi Galeri 3D Sekarang</span>
            </button>
          </div>

          <!-- OPSI 2: DOKUMEN CV LANGSUNG -->
          <div class="mode-card" id="mode-card-direct">
            <div class="mode-card-badge direct">
              <ion-icon name="flash-outline"></ion-icon> AKSES CEPAT REKRUTER & HRD
            </div>
            <div class="mode-card-content">
              <h3 class="mode-card-title">Lihat Dokumen & Portofolio Langsung</h3>
              <p class="mode-card-desc">
                Dirancang khusus untuk HRD & Perekrut yang memerlukan akses cepat tanpa 3D. Langsung unduh CV ATS, pelajari riwayat kepemimpinan, sertifikasi, kontak WhatsApp, dan katalog proyek.
              </p>
              <ul class="mode-highlights">
                <li><ion-icon name="checkmark-circle"></ion-icon> 1-Click Unduh CV ATS (Data Analyst & Sosmed)</li>
                <li><ion-icon name="checkmark-circle"></ion-icon> Hubungi Cepat via WhatsApp & Email</li>
                <li><ion-icon name="checkmark-circle"></ion-icon> Tab Dokumen Lengkap (About, Resume, Projects)</li>
              </ul>
            </div>
            <button class="btn-mode-select btn-select-direct" id="btn-select-direct">
              <ion-icon name="document-text-outline"></ion-icon>
              <span>Buka Mode Dokumen Langsung</span>
            </button>
          </div>
        </div>
      </div>

      <!-- B. RECRUITER FAST-TRACK HUB (PUSAT PEREKRUT) -->
      <div class="recruiter-fast-track-card" id="recruiter-fast-track-hub">
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

        <!-- RECRUITER DIRECT ACTIONS (ATS CVS & CONTACT) -->
        <div class="recruiter-cta-grid">
          <a href="./CV_Mangara_Pakpahan_Data_Analyst.pdf" target="_blank" rel="noopener" class="btn-recruiter-cv da" title="Unduh CV ATS Data Analyst (PDF)">
            <ion-icon name="document-text-outline"></ion-icon>
            <div>
              <strong>Unduh CV Data Analyst</strong>
              <small>Format ATS Teruji &bull; PDF Resmi</small>
            </div>
          </a>

          <a href="./CV_Mangara_Pakpahan_Sosmed_Humas.pdf" target="_blank" rel="noopener" class="btn-recruiter-cv sh" title="Unduh CV ATS Sosmed & Humas (PDF)">
            <ion-icon name="document-text-outline"></ion-icon>
            <div>
              <strong>Unduh CV Sosmed & Humas</strong>
              <small>Format ATS Teruji &bull; PDF Resmi</small>
            </div>
          </a>

          <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20peluang%20rekrutmen." target="_blank" rel="noopener" class="btn-recruiter-contact wa" title="Chat WhatsApp">
            <ion-icon name="logo-whatsapp"></ion-icon>
            <div>
              <strong>WhatsApp Langsung</strong>
              <small>0813-1881-6058 (Respons Cepat)</small>
            </div>
          </a>

          <a href="mailto:mangarapakpahan51@gmail.com" class="btn-recruiter-contact mail" title="Kirim Email">
            <ion-icon name="mail-outline"></ion-icon>
            <div>
              <strong>Kirim Email Resmi</strong>
              <small>mangarapakpahan51@gmail.com</small>
            </div>
          </a>
        </div>
      </div>

      <!-- C. COLLAPSED BAR (KETIKA MODE DOKUMEN AKTIF) -->
      <div class="gallery-collapsed-bar" id="gallery-collapsed-bar">
        <div class="collapsed-bar-info">
          <span class="collapsed-bar-dot"></span>
          <div>
            <div class="collapsed-bar-title">Galeri Virtual 3D Sedang Dijeda</div>
            <div class="collapsed-bar-sub">Anda sedang dalam Mode Dokumen Langsung (Menghemat Baterai & GPU).</div>
          </div>
        </div>
        <button class="btn-reopen-3d" id="btn-reopen-3d">
          <ion-icon name="play-outline"></ion-icon>
          <span>Masuk ke Galeri 3D</span>
        </button>
      </div>

      <!-- D. CONTEMPORARY 3D GALLERY VIEWPORT -->
      <div class="gallery-viewport-container" id="gallery-viewport-container">
        <!-- Canvas -->
        <canvas id="gallery-webgl-canvas"></canvas>

        <!-- Top Header Overlay -->
        <div class="gallery-header-overlay">
          <div class="gallery-brand-mark">
            <span class="gallery-brand-dot"></span>
            <span class="gallery-brand-text">MANGARA ARCHITECTURAL GALLERY</span>
          </div>

          <div class="gallery-header-actions">
            <button id="btn-gallery-audio" class="gallery-pill-btn" title="Nyalakan / Matikan Audio Ambience">
              <ion-icon name="volume-mute-outline"></ion-icon> <span>Audio Ambience</span>
            </button>
            <button id="btn-gallery-directory" class="gallery-pill-btn" title="Buka Direktori Ruangan">
              <ion-icon name="map-outline"></ion-icon> <span>Direktori Ruang</span>
            </button>
            <button id="btn-gallery-to-docs" class="gallery-pill-btn gold" title="Beralih ke Mode Dokumen Langsung">
              <ion-icon name="document-text-outline"></ion-icon> <span>Dokumen Langsung</span>
            </button>
          </div>
        </div>

        <!-- Center Reticle -->
        <div class="gallery-reticle" id="gallery-reticle"></div>

        <!-- Interaction Prompt -->
        <div class="gallery-interaction-prompt" id="gallery-interaction-prompt">
          ✦ [ E / KLIK ] INSPEKSI KARYA
        </div>

        <!-- Bottom Controls & Room Location -->
        <div class="gallery-bottom-hud">
          <div class="gallery-controls-hint">
            <span>NAVIGASI:</span>
            <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Bergerak &bull; 
            <span>Gerakkan Kursor untuk Melihat Sekeliling</span> &bull; 
            <kbd>E</kbd> / Klik Inspeksi
          </div>

          <div class="gallery-room-indicator">
            <span id="gallery-room-name">Grand Reception Atrium</span>
          </div>
        </div>

        <!-- Touch Controls (Mobile) -->
        <div class="gallery-touch-overlay" id="gallery-touch-overlay">
          <div class="gallery-touch-joystick-zone" id="touch-joystick-zone">
            <div class="gallery-joystick-knob" id="touch-joystick-knob"></div>
          </div>
          <button class="gallery-touch-action-btn" id="touch-action-btn">
            INSPEKSI
          </button>
        </div>

        <!-- Loading Screen -->
        <div class="gallery-loading-overlay" id="gallery-loading-overlay">
          <div class="gallery-loader-spinner"></div>
          <div class="gallery-loading-text">MEMUAT GALERI ARSITEKTUR 3D...</div>
          <div class="gallery-loading-subtext">Kurasi Arsip Portofolio Mangara Ferdianto Pakpahan</div>
        </div>
      </div>

      <!-- E. EXHIBITION LIGHTBOX MODAL -->
      <div class="gallery-lightbox-modal" id="gallery-lightbox-modal">
        <div class="gallery-lightbox-panel">
          <div class="gallery-lightbox-header">
            <div class="gallery-lightbox-meta">
              <span class="gallery-curatorial-tag" id="lightbox-category">Kategori</span>
              <h3 class="gallery-lightbox-title" id="lightbox-title">Judul Karya</h3>
            </div>
            <button class="gallery-lightbox-close" id="lightbox-close-btn">&times;</button>
          </div>

          <div class="gallery-lightbox-body">
            <div class="gallery-lightbox-image-box">
              <img src="" alt="" id="lightbox-image">
            </div>
            <div class="gallery-lightbox-description" id="lightbox-description">
              Keterangan kuratorial karya...
            </div>
          </div>

          <div class="gallery-lightbox-footer">
            <a href="#" target="_blank" rel="noopener" class="gallery-link-btn" id="lightbox-link-btn">
              <ion-icon name="open-outline"></ion-icon> <span>Buka Tautan Dokumen / Proyek</span>
            </a>
          </div>
        </div>
      </div>

      <!-- F. GALLERY DIRECTORY & FLOOR PLAN MODAL -->
      <div class="gallery-directory-modal" id="gallery-directory-modal">
        <div class="gallery-directory-card">
          <div class="gallery-directory-header">
            <h3 class="gallery-directory-title">
              <ion-icon name="map-outline" style="color: #c5a059;"></ion-icon>
              Direktori Pameran & Denah Galeri
            </h3>
            <button class="gallery-lightbox-close" id="directory-close-btn">&times;</button>
          </div>

          <div class="gallery-room-nav-list">
            <button class="gallery-room-nav-item" data-room="reception">
              <strong>1. Grand Reception Atrium</strong>
              <span>Lobi Masuk, Taman Zen Kaca, & Unduh Berkas CV ATS</span>
            </button>
            <button class="gallery-room-nav-item" data-room="portfolio">
              <strong>2. Sayap Barat: Galeri 50+ Proyek</strong>
              <span>Live Production, Inovasi IoT, Desain Visual, & Web Redaksi</span>
            </button>
            <button class="gallery-room-nav-item" data-room="career">
              <strong>3. Sayap Timur: Linimasa Karier</strong>
              <span>Magang PJCI, Humas ITPLN, Educativa Riset, & ITPLN Media</span>
            </button>
            <button class="gallery-room-nav-item" data-room="honors">
              <strong>4. Paviliun Utara: Sertifikasi & Riset</strong>
              <span>Piala Emas Juara 1 IoT SafeSense, Azure ML, & SEM-PLS 120 JP</span>
            </button>
          </div>

          <div style="text-align: right;">
            <button class="gallery-link-btn" id="directory-goto-docs">
              <ion-icon name="document-text-outline"></ion-icon>
              <span>Buka Dokumen Portofolio Lengkap</span> &darr;
            </button>
          </div>
        </div>
      </div>

      <!-- G. FLOATING QUICK-MODE SWITCHER PILL -->
      <div class="floating-mode-pill" id="floating-mode-pill" title="Klik untuk beralih mode kapan saja">
        <ion-icon name="document-text-outline"></ion-icon>
        <span>Mode Dokumen Langsung</span>
      </div>
    `;

    main.prepend(wrapper);

    // Setup Event Listeners
    setupGalleryControls();
  }

  function setupGalleryControls() {
    canvasContainer = document.getElementById('gallery-viewport-container');
    canvas = document.getElementById('gallery-webgl-canvas');

    // Experience Mode Card Buttons
    document.getElementById('btn-select-3d')?.addEventListener('click', () => {
      setExperienceMode('3d', true);
    });

    document.getElementById('mode-card-3d')?.addEventListener('click', (e) => {
      if (e.target.id !== 'btn-select-3d') setExperienceMode('3d', true);
    });

    document.getElementById('btn-select-direct')?.addEventListener('click', () => {
      setExperienceMode('direct', true);
    });

    document.getElementById('mode-card-direct')?.addEventListener('click', (e) => {
      if (e.target.id !== 'btn-select-direct') setExperienceMode('direct', true);
    });

    document.getElementById('btn-reopen-3d')?.addEventListener('click', () => {
      setExperienceMode('3d', true);
    });

    document.getElementById('btn-gallery-to-docs')?.addEventListener('click', () => {
      setExperienceMode('direct', true);
    });

    document.getElementById('floating-mode-pill')?.addEventListener('click', () => {
      if (is3DActive) {
        setExperienceMode('direct', true);
      } else {
        setExperienceMode('3d', true);
      }
    });

    // Audio Ambience Button
    document.getElementById('btn-gallery-audio')?.addEventListener('click', () => {
      toggleAmbienceSound();
    });

    // Pointer Lock & Canvas Interaction
    let isHoveringCanvas = false;
    canvasContainer?.addEventListener('mouseenter', () => (isHoveringCanvas = true));
    canvasContainer?.addEventListener('mouseleave', () => (isHoveringCanvas = false));

    canvas.addEventListener('click', () => {
      // If standing in front of an exhibit, click directly opens the exhibit lightbox!
      if (nearestExhibit) {
        if (nearestExhibit.projectUrl === '#directory') {
          openDirectoryModal();
        } else {
          openExhibitionLightbox(nearestExhibit);
        }
        return;
      }

      if (!isModalOpen && canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    });

    document.getElementById('gallery-interaction-prompt')?.addEventListener('click', () => {
      if (nearestExhibit) {
        if (nearestExhibit.projectUrl === '#directory') {
          openDirectoryModal();
        } else {
          openExhibitionLightbox(nearestExhibit);
        }
      }
    });

    document.addEventListener('pointerlockchange', () => {
      isPointerLocked = document.pointerLockElement === canvas;
    });

    // Mouse Movement Look
    document.addEventListener('mousemove', (e) => {
      if (isPointerLocked && !isModalOpen && is3DActive) {
        player.rotY -= e.movementX * 0.0024;
        player.rotX -= e.movementY * 0.0024;
        player.rotX = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, player.rotX));
      }
    });

    // Drag-to-look fallback if pointer lock is not active
    let isMouseDown = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', (e) => {
      if (!isPointerLocked && is3DActive) {
        isMouseDown = true;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    window.addEventListener('mouseup', () => (isMouseDown = false));

    window.addEventListener('mousemove', (e) => {
      if (isMouseDown && !isPointerLocked && !isModalOpen && is3DActive) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        player.rotY -= dx * 0.004;
        player.rotX -= dy * 0.004;
        player.rotX = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, player.rotX));
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    // Keyboard Listeners
    window.addEventListener('keydown', (e) => {
      if (isModalOpen) {
        if (e.code === 'Escape') {
          closeExhibitionLightbox();
          closeDirectoryModal();
        }
        return;
      }

      // Prevent window scroll jumping when in 3D Mode
      if (isPointerLocked || (isHoveringCanvas && is3DActive)) {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault();
        }
      }

      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.fwd = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.bwd = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
      if (e.code === 'KeyE' || e.code === 'Space') keys.interact = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.fwd = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.bwd = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
      if (e.code === 'KeyE' || e.code === 'Space') keys.interact = false;
    });

    // Modal Close Handlers
    document.getElementById('lightbox-close-btn')?.addEventListener('click', closeExhibitionLightbox);
    document.getElementById('gallery-lightbox-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'gallery-lightbox-modal') closeExhibitionLightbox();
    });

    // Directory Modal Handlers
    document.getElementById('btn-gallery-directory')?.addEventListener('click', openDirectoryModal);
    document.getElementById('directory-close-btn')?.addEventListener('click', closeDirectoryModal);
    document.getElementById('gallery-directory-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'gallery-directory-modal') closeDirectoryModal();
    });

    const roomNavItems = document.querySelectorAll('.gallery-room-nav-item');
    roomNavItems.forEach((btn) => {
      btn.addEventListener('click', () => {
        teleportToLocation(btn.dataset.room);
      });
    });

    document.getElementById('directory-goto-docs')?.addEventListener('click', () => {
      closeDirectoryModal();
      setExperienceMode('direct', true);
    });

    // Touch Controls (Mobile)
    setupMobileTouch();
  }

  function setupMobileTouch() {
    const joyZone = document.getElementById('touch-joystick-zone');
    const joyKnob = document.getElementById('touch-joystick-knob');
    const actionBtn = document.getElementById('touch-action-btn');

    actionBtn?.addEventListener('click', () => {
      if (nearestExhibit) {
        if (nearestExhibit.projectUrl === '#directory') {
          openDirectoryModal();
        } else {
          openExhibitionLightbox(nearestExhibit);
        }
      }
    });

    if (!joyZone || !joyKnob) return;

    let touchId = null;
    let centerX = 0;
    let centerY = 0;

    joyZone.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        touchId = touch.identifier;
        const rect = joyZone.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      },
      { passive: false }
    );

    joyZone.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === touchId) {
            const dx = t.clientX - centerX;
            const dy = t.clientY - centerY;
            const dist = Math.min(42, Math.hypot(dx, dy));
            const angle = Math.atan2(dy, dx);

            joyKnob.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;

            keys.fwd = dy < -12;
            keys.bwd = dy > 12;
            keys.left = dx < -12;
            keys.right = dx > 12;
          }
        }
      },
      { passive: false }
    );

    const endTouch = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touchId = null;
          joyKnob.style.transform = `translate(0px, 0px)`;
          keys.fwd = false;
          keys.bwd = false;
          keys.left = false;
          keys.right = false;
        }
      }
    };

    joyZone.addEventListener('touchend', endTouch);
    joyZone.addEventListener('touchcancel', endTouch);

    // Touch Drag for camera look on right half of canvas
    let lookTouchId = null;
    let lastLookX = 0;
    let lastLookY = 0;

    canvas?.addEventListener(
      'touchstart',
      (e) => {
        if (isModalOpen || !is3DActive) return;
        const t = e.changedTouches[0];
        if (t.clientX > window.innerWidth / 2.5) {
          lookTouchId = t.identifier;
          lastLookX = t.clientX;
          lastLookY = t.clientY;
        }
      },
      { passive: true }
    );

    canvas?.addEventListener(
      'touchmove',
      (e) => {
        if (isModalOpen || !is3DActive) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === lookTouchId) {
            const dx = t.clientX - lastLookX;
            const dy = t.clientY - lastLookY;
            player.rotY -= dx * 0.005;
            player.rotX -= dy * 0.005;
            player.rotX = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, player.rotX));
            lastLookX = t.clientX;
            lastLookY = t.clientY;
          }
        }
      },
      { passive: true }
    );

    canvas?.addEventListener(
      'touchend',
      (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === lookTouchId) {
            lookTouchId = null;
          }
        }
      },
      { passive: true }
    );
  }

  // ─── 11. INITIALIZE THREE.JS ENGINE ────────────────────────────
  function initThreeGallery() {
    canvasContainer = document.getElementById('gallery-viewport-container');
    canvas = document.getElementById('gallery-webgl-canvas');

    const width = canvasContainer.clientWidth || 1024;
    const height = canvasContainer.clientHeight || 640;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0d11);
    scene.fog = new THREE.FogExp2(0x0b0d11, 0.016);

    // Camera
    camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 130);
    camera.position.set(player.x, player.y, player.z);

    // WebGL Renderer
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
    renderer.toneMappingExposure = 1.1;

    // Set correct color space for Three.js
    if (THREE.sRGBEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // Build Architectural Geometry & Exhibits
    textureLoader = new THREE.TextureLoader();
    buildGalleryScene(DEFAULT_DATA);

    // Resize Handler
    window.addEventListener('resize', onWindowResize);

    // Hide loader
    setTimeout(() => {
      const loader = document.getElementById('gallery-loading-overlay');
      if (loader) loader.classList.add('hidden');
    }, 400);

    // Start 60FPS loop
    animate();
  }

  function onWindowResize() {
    if (!canvasContainer || !camera || !renderer) return;
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    if (!is3DActive) return; // Pause rendering loop when in direct document mode (0% GPU/CPU)

    updateCameraAndCollision();

    // Slowly spin the 3D golden innovation trophy
    if (rotatingTrophy) {
      rotatingTrophy.rotation.y += 0.018;
    }

    renderer.render(scene, camera);
  }

  // ─── 12. ENTRY POINT ──────────────────────────────────────────
  function init() {
    buildGalleryDOM();

    // Check if THREE is loaded globally
    if (typeof THREE !== 'undefined') {
      initThreeGallery();
    } else {
      // Dynamically load Three.js r128 from CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        initThreeGallery();
      };
      document.head.appendChild(script);
    }

    console.log('🏛️ Contemporary Architectural Gallery & Dual Experience Hub successfully loaded!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
