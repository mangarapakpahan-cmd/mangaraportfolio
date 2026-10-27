/**
 * gallery-3d-experience.js
 * Immersive Contemporary Architectural Gallery Experience for Mangara Ferdianto Pakpahan
 * Inspired by Museum MACAN, ROH Projects, & Curated Exhibition Spaces in Jakarta
 * - First-Person Walkable 3D Gallery (Three.js WebGL, 60FPS)
 * - Photorealistic Gallery Architecture: Polished concrete, plaster walls, tracklights, framed artworks
 * - Dynamic Data Integration from default-data.js & Firestore
 * - Complete Collision Detection (Cannot clip through walls or display plinths)
 * - Proximity Detection & Exhibition Lightbox Inspector
 * - Recruiter Fast-Track Hub with 1-Click ATS CV Downloads & WhatsApp
 * - Desktop (Pointer Lock / WASD) & Mobile (Touch Joystick & Drag)
 */

import { DEFAULT_DATA } from './default-data.js';

(function () {
  'use strict';

  // ─── 1. GLOBAL STATE & THREE.JS REFERENCES ────────────────────
  let scene, camera, renderer;
  let canvasContainer, canvas;
  let isPointerLocked = false;
  let isModalOpen = false;

  const player = {
    x: 0,
    y: 1.7, // Human eye height (1.7 meters)
    z: -3,
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

  // ─── 2. TEXTURE FACTORY (PROCEDURAL ARCHITECTURAL MATERIALS) ──
  function createConcreteFloorTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Base concrete tone
    ctx.fillStyle = '#dfdeda';
    ctx.fillRect(0, 0, 512, 512);

    // Fine mineral speckles
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(180 + Math.random() * 60);
      ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.25)`;
      ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }

    // Architectural expansion joints (large slab grid lines)
    ctx.strokeStyle = 'rgba(120, 118, 112, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 16);
    return tex;
  }

  function createPlasterWallTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#f7f7f6';
    ctx.fillRect(0, 0, 256, 256);

    // Micro-texture for matte plaster
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const val = Math.floor(235 + Math.random() * 20);
      ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
      ctx.fillRect(x, y, 1, 1);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  }

  function createPlaqueTexture(title, subtitle, meta) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d');

    // Museum white card with crisp gray border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 508, 252);

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(title.substring(0, 32), 24, 55);

    // Subtitle / Category
    ctx.fillStyle = '#c5a059';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText((subtitle || '').substring(0, 38).toUpperCase(), 24, 90);

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
      ctx.fillText(line1, 24, 130);
      ctx.fillText(line2, 24, 155);
    }

    // Interaction cue
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('[ E ] Tekan untuk membuka karya', 24, 210);

    return new THREE.CanvasTexture(c);
  }

  // ─── 3. GALLERY ARCHITECTURE BUILDER ──────────────────────────
  function buildGalleryScene(data) {
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f4,
      roughness: 0.92,
      metalness: 0.02,
      map: createPlasterWallTexture()
    });

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xe5e4df,
      roughness: 0.28,
      metalness: 0.08,
      map: createConcreteFloorTexture()
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.9
    });

    const darkOakMat = new THREE.MeshStandardMaterial({
      color: 0x221a15,
      roughness: 0.45,
      metalness: 0.1
    });

    const bronzeMetalMat = new THREE.MeshStandardMaterial({
      color: 0x8a7247,
      roughness: 0.35,
      metalness: 0.8
    });

    // Helper: Add solid wall box with collision
    function addWall(x, z, w, d, h = 4.4, mat = wallMat) {
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

    // Helper: Add Floor & Ceiling slab
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
      ceiling.position.set(x, 4.4, z);
      scene.add(ceiling);

      // Recessed linear tracklight beam
      const beamGeo = new THREE.BoxGeometry(w * 0.85, 0.1, 0.25);
      const beam = new THREE.Mesh(beamGeo, darkOakMat);
      beam.position.set(x, 4.35, z);
      scene.add(beam);
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
    const deskGeo = new THREE.BoxGeometry(4.2, 1.1, 1.4);
    const desk = new THREE.Mesh(deskGeo, darkOakMat);
    desk.position.set(0, 0.55, -5.5);
    desk.castShadow = true;
    scene.add(desk);
    collisionBoxes.push({ minX: -2.3, maxX: 2.3, minZ: -6.4, maxZ: -4.6 });

    // Feature Sign on South Wall
    createArchitecturalSign(
      0, 2.8, -11.6, 8, 1.5,
      "MANGARA FERDIANTO PAKPAHAN",
      "CONTEMPORARY PORTFOLIO & ARCHITECTURAL EXHIBITION",
      "S1 Teknik Informatika Institut Teknologi PLN • Data Analyst • Social Media & Humas • Creative Director"
    );

    // Reception Curatorial CV Plinths
    addExhibitionPlinth(
      -2.4, -2.5, 0.8, 1.0, 0.8,
      "Curriculum Vitae: Data Analyst",
      "Berkas Resmi Teruji ATS • PDF",
      "Spesialisasi analitik data, SQL database, SEM-PLS 120 JP, Azure Databricks Machine Learning, dan MOS Excel 2019.",
      "./CV_Mangara_Pakpahan_Data_Analyst.pdf",
      "./assets/images/portfolio/card-8.jpg",
      "📥 Unduh CV Data Analyst (PDF)"
    );

    addExhibitionPlinth(
      2.4, -2.5, 0.8, 1.0, 0.8,
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
    addWall(-4, 8, 0.6, 6);
    addWall(-4, 18, 0.6, 6);
    addWall(4, 8, 0.6, 6);
    addWall(4, 18, 0.6, 6);

    // Center Circulation Directional Totem
    createWayfindingTotem(0, 13);

    // ─── C. WEST WING: PORTFOLIO EXHIBITION HALL (X: -24 to -4, Z: 4 to 32) ───
    addRoomSlab(-14, 18, 20, 28);
    addWall(-24, 18, 0.6, 28); // Outer West Wall
    addWall(-14, 32, 20, 0.6); // North Wall
    addWall(-14, 4, 20, 0.6); // South Wall

    // Partition walls inside portfolio room
    addWall(-14, 14, 10, 0.4);
    addWall(-14, 24, 10, 0.4);

    // Mount Curated Portfolio Projects on Walls
    const projects = data.projects || [];

    // Group 1: Live Production & Broadcasting (North & West Walls)
    if (projects[12]) addFramedArtwork(-23.6, 2.2, 8, 3.2, 1.9, 0, Math.PI / 2, projects[12]); // Wisuda ke-46
    if (projects[13]) addFramedArtwork(-23.6, 2.2, 13, 3.0, 1.8, 0, Math.PI / 2, projects[13]); // Studium Generale Nuklir
    if (projects[14]) addFramedArtwork(-23.6, 2.2, 18, 3.0, 1.8, 0, Math.PI / 2, projects[14]); // Kontrak Kerja PLN
    if (projects[15]) addFramedArtwork(-23.6, 2.2, 23, 2.8, 1.7, 0, Math.PI / 2, projects[15]); // APERTI BUMN

    // Group 2: IoT Engineering & Innovation (Center Partition Walls)
    if (projects[7]) addFramedArtwork(-14, 2.2, 13.7, 2.8, 1.8, 0, 0, {
      title: "IoT LPG-SafeSense (Juara 1 Inovasi MKI)",
      category: "IoT & Hardware Engineering",
      imageUrl: "./assets/images/portfolio/card-8.jpg",
      description: "Riset dan rekayasa perangkat pendeteksi kebocoran gas LPG dan pemantau sisa berat tabung berbasis mikrokontroler sensor MQ-6 dan load cell cloud mobile apps.",
      projectUrl: "https://itpln.ac.id"
    });

    if (projects[29]) addFramedArtwork(-14, 2.2, 14.3, 2.8, 1.8, 0, Math.PI, projects[29]); // Juara 1 IPB Ocean Experience
    if (projects[30]) addFramedArtwork(-14, 2.2, 23.7, 2.8, 1.8, 0, 0, projects[30]); // Badminton Dies Natalis
    if (projects[35]) addFramedArtwork(-14, 2.2, 24.3, 3.0, 1.8, 0, Math.PI, projects[35]); // Company Profile ITPLN Media

    // Group 3: Social Media & Web Redaksi (North Wall of West Wing)
    if (projects[0]) addFramedArtwork(-18, 2.2, 31.6, 2.8, 1.8, 0, Math.PI, projects[0]); // @itpln
    if (projects[3]) addFramedArtwork(-10, 2.2, 31.6, 2.8, 1.8, 0, Math.PI, projects[3]); // @smartgridindonesia
    if (projects[6]) addFramedArtwork(-18, 2.2, 4.4, 2.8, 1.8, 0, 0, projects[6]); // pjci.or.id
    if (projects[7]) addFramedArtwork(-10, 2.2, 4.4, 2.8, 1.8, 0, 0, projects[7]); // itpln.ac.id

    // ─── D. EAST WING: CAREER & LEADERSHIP TIMELINE (X: 4 to 24, Z: 4 to 32) ──
    addRoomSlab(14, 18, 20, 28);
    addWall(24, 18, 0.6, 28); // Outer East Wall
    addWall(14, 32, 20, 0.6); // North Wall
    addWall(14, 4, 20, 0.6); // South Wall

    // Mount Career Timeline Panels
    const exp = data.experience || [];
    if (exp[0]) addTimelineExhibitPanel(23.6, 2.2, 8, Math.PI / 2, exp[0]); // PJCI Magang
    if (exp[1]) addTimelineExhibitPanel(23.6, 2.2, 14, Math.PI / 2, exp[1]); // PJCI Redaksi
    if (exp[2]) addTimelineExhibitPanel(23.6, 2.2, 20, Math.PI / 2, exp[2]); // Humas ITPLN BHMS
    if (exp[4]) addTimelineExhibitPanel(23.6, 2.2, 26, Math.PI / 2, exp[4]); // Ketua Pelaksana NCC 2025

    if (exp[5]) addTimelineExhibitPanel(18, 2.2, 31.6, Math.PI, exp[5]); // ITPLN Media Deputy Manager
    if (exp[6]) addTimelineExhibitPanel(10, 2.2, 31.6, Math.PI, exp[6]); // Student Ambassador BPA
    if (exp[7]) addTimelineExhibitPanel(18, 2.2, 4.4, 0, exp[7]); // Student Ambassador DQLab

    // ─── E. NORTH PAVILION: HONORS, RESEARCH & RECOGNITION (X: -10 to 10, Z: 22 to 38) ───
    addRoomSlab(0, 30, 20, 16);
    addWall(0, 38, 20, 0.6); // North back wall
    addWall(-10, 30, 0.6, 16); // West Wall
    addWall(10, 30, 0.6, 16); // East Wall

    // North Pavilion Center Glass Vitrine for Diplomas & Medals
    addHonorDisplayVitrine(
      0, 31, 2.4, 1.2, 1.2,
      "Sertifikasi Microsoft Azure Databricks Machine Learning",
      "Sertifikasi Resmi Microsoft 8 Modul",
      "Machine Learning in Production, AutoML, Hyperparameter Tuning, MLflow Lifecycle, dan Apache Spark di Azure Databricks.",
      "https://learn.microsoft.com"
    );

    // Wall Plaques for Certifications & Awards
    addFramedCertificate(-6, 2.4, 37.6, 2.2, 1.5, Math.PI, {
      title: "PT Educativa Cipta Nawasena",
      subtitle: "Sertifikasi Riset Kuantitatif SEM-PLS (120 JP)",
      meta: "Structural Equation Modeling, path analysis mediasi & moderasi, uji validitas & reliabilitas data empiris."
    });

    addFramedCertificate(0, 2.4, 37.6, 2.2, 1.5, Math.PI, {
      title: "Microsoft Corporation",
      subtitle: "Microsoft Office Specialist (MOS) Excel 2019",
      meta: "Spreadsheet tingkat mahir internasional: pemodelan data finansial, formula logika kompleks, dan dasbor bisnis."
    });

    addFramedCertificate(6, 2.4, 37.6, 2.2, 1.5, Math.PI, {
      title: "Kemendikbudristek / DIKTI",
      subtitle: "Penerima Hibah Pendanaan PKM Level 1",
      meta: "Program Kreativitas Mahasiswa bidang riset implementasi prototipe teknologi IoT energi terbarukan."
    });

    // ─── F. LIGHTING SCHEME (WARM MUSEUM AMBIENCE) ─────────────────
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xfffcf5, 0.75);
    scene.add(ambientLight);

    // Directional skylights
    const skyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    skyLight.position.set(5, 12, 10);
    skyLight.castShadow = true;
    skyLight.shadow.mapSize.width = 2048;
    skyLight.shadow.mapSize.height = 2048;
    skyLight.shadow.camera.near = 0.5;
    skyLight.shadow.camera.far = 40;
    skyLight.shadow.bias = -0.0005;
    scene.add(skyLight);

    // Spotlights over key artworks
    addSpotlight(-23.6, 8, 8, -23.6, 2, 8);
    addSpotlight(0, 4.2, -5.5, 0, 1, -5.5);
    addSpotlight(0, 4.2, 31, 0, 1.5, 31);
    addSpotlight(-14, 4.2, 14, -14, 2, 14);
  }

  function addSpotlight(lx, ly, lz, tx, ty, tz) {
    const spot = new THREE.SpotLight(0xfff4e0, 1.6);
    spot.position.set(lx, ly, lz);
    spot.angle = Math.PI / 4.5;
    spot.penumbra = 0.6;
    spot.decay = 1.6;
    spot.distance = 18;
    spot.target.position.set(tx, ty, tz);
    scene.add(spot);
    scene.add(spot.target);
  }

  // ─── 4. EXHIBIT FACTORY (CANVASES, FRAMES & LABELS) ───────────
  let textureLoader = null;

  function addFramedArtwork(x, y, z, w, h, rx, ry, project) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.set(rx, ry, 0);

    // Anodized Aluminum Outer Frame (Charcoal Black)
    const frameGeo = new THREE.BoxGeometry(w + 0.12, h + 0.12, 0.08);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.35, metalness: 0.8 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    // Museum Passe-Partout White Matting
    const matGeo = new THREE.BoxGeometry(w + 0.02, h + 0.02, 0.09);
    const matMat = new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.95 });
    const mat = new THREE.Mesh(matGeo, matMat);
    group.add(mat);

    // Canvas Artwork Plane with Authentic Image
    const canvasGeo = new THREE.PlaneGeometry(w - 0.14, h - 0.14);
    const canvasMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4
    });

    if (project.imageUrl) {
      textureLoader.load(
        project.imageUrl,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          canvasMat.map = tex;
          canvasMat.needsUpdate = true;
        },
        undefined,
        () => {
          // Graceful fallback to neutral artwork
          canvasMat.color.setHex(0x2a303c);
        }
      );
    }

    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.z = 0.05;
    group.add(canvasMesh);

    // Curatorial Label Plaque (Cartellino) below frame
    const plaqueGeo = new THREE.PlaneGeometry(0.75, 0.38);
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: createPlaqueTexture(project.title, project.category, project.description),
      roughness: 0.5
    });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.set(0, -(h / 2 + 0.32), 0.05);
    group.add(plaque);

    scene.add(group);

    // Register as interactive exhibit
    interactiveExhibits.push({
      position: new THREE.Vector3(x, y, z),
      title: project.title,
      category: project.category || "Exhibition Piece",
      description: project.description || "Detailed project presentation.",
      imageUrl: project.imageUrl,
      projectUrl: project.projectUrl
    });
  }

  function addTimelineExhibitPanel(x, y, z, ry, expItem) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.set(0, ry, 0);

    // Architectural Wall Panel
    const panelGeo = new THREE.BoxGeometry(2.4, 2.0, 0.06);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a2130, roughness: 0.6 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    group.add(panel);

    // Graphic Header Plaque
    const plaqueGeo = new THREE.PlaneGeometry(2.2, 1.8);
    const plaqueTex = createPlaqueTexture(
      expItem.position || "Professional Role",
      expItem.company || "Organization",
      `${expItem.period || ''} — ${expItem.description || ''}`
    );
    const plaqueMat = new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.4 });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.z = 0.04;
    group.add(plaque);

    scene.add(group);

    interactiveExhibits.push({
      position: new THREE.Vector3(x, y, z),
      title: `${expItem.position} — ${expItem.company}`,
      category: expItem.period || "Experience",
      description: expItem.description || "",
      imageUrl: "./assets/images/portfolio/card-1.jpg",
      projectUrl: "https://linkedin.com/in/mangara-ferdianto-pakpahan"
    });
  }

  function addFramedCertificate(x, y, z, w, h, ry, certData) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.set(0, ry, 0);

    const frameGeo = new THREE.BoxGeometry(w, h, 0.06);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x221a12, roughness: 0.4, metalness: 0.3 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    const docGeo = new THREE.PlaneGeometry(w - 0.16, h - 0.16);
    const docTex = createPlaqueTexture(certData.title, certData.subtitle, certData.meta);
    const docMat = new THREE.MeshStandardMaterial({ map: docTex, roughness: 0.5 });
    const doc = new THREE.Mesh(docGeo, docMat);
    doc.position.z = 0.04;
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

    // Stone Plinth
    const plinthGeo = new THREE.BoxGeometry(w, h, d);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.5, metalness: 0.2 });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = h / 2;
    plinth.castShadow = true;
    group.add(plinth);

    // Top Illuminated Plaque
    const topPlaqueGeo = new THREE.BoxGeometry(w * 0.85, 0.04, d * 0.85);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createPlaqueTexture(title, subtitle, desc),
      roughness: 0.3
    });
    const topPlaque = new THREE.Mesh(topPlaqueGeo, topMat);
    topPlaque.position.y = h + 0.02;
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

    // Dark wood base
    const baseGeo = new THREE.BoxGeometry(w, 0.9, d);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.6 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.45;
    group.add(base);

    // Glass case on top
    const glassGeo = new THREE.BoxGeometry(w - 0.1, 0.8, d - 0.1);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = 1.3;
    group.add(glass);

    // Central Floating Plaque inside glass
    const honorPlaqueGeo = new THREE.BoxGeometry(0.8, 0.5, 0.04);
    const honorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createPlaqueTexture(title, subtitle, desc),
      metalness: 0.3,
      roughness: 0.4
    });
    const honor = new THREE.Mesh(honorPlaqueGeo, honorMat);
    honor.position.set(0, 1.3, 0);
    honor.rotation.y = Math.PI / 4;
    group.add(honor);

    scene.add(group);

    collisionBoxes.push({
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2
    });

    interactiveExhibits.push({
      position: new THREE.Vector3(x, 1.3, z),
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
    c.height = 256;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#11151c';
    ctx.fillRect(0, 0, 1024, 256);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Cinzel", serif';
    ctx.fillText(line1, 40, 75);

    ctx.fillStyle = '#c5a059';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(line2, 40, 125);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(line3, 40, 180);

    const tex = new THREE.CanvasTexture(c);
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
  }

  function createWayfindingTotem(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const totemGeo = new THREE.BoxGeometry(0.8, 2.2, 0.4);
    const totemMat = new THREE.MeshStandardMaterial({ color: 0x161c26, roughness: 0.4, metalness: 0.2 });
    const totem = new THREE.Mesh(totemGeo, totemMat);
    totem.position.y = 1.1;
    group.add(totem);

    // Directional typography on both sides
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#161c26';
    ctx.fillRect(0, 0, 256, 512);

    ctx.fillStyle = '#c5a059';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('GALLERY DIRECTORY', 20, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.fillText('◀ WEST: 50+ Projects', 20, 130);
    ctx.fillText('▶ EAST: Career Timeline', 20, 200);
    ctx.fillText('▲ NORTH: Honors & Certs', 20, 270);
    ctx.fillText('▼ SOUTH: Reception & CV', 20, 340);

    const tex = new THREE.CanvasTexture(c);
    const signGeo = new THREE.PlaneGeometry(0.7, 1.4);
    const signMat = new THREE.MeshBasicMaterial({ map: tex });
    const signFront = new THREE.Mesh(signGeo, signMat);
    signFront.position.set(0, 1.2, 0.21);
    group.add(signFront);

    const signBack = signFront.clone();
    signBack.position.set(0, 1.2, -0.21);
    signBack.rotation.y = Math.PI;
    group.add(signBack);

    scene.add(group);

    collisionBoxes.push({ minX: x - 0.5, maxX: x + 0.5, minZ: z - 0.3, maxZ: z + 0.3 });
  }

  // ─── 5. FIRST-PERSON CAMERA & COLLISION CONTROLLER ─────────────
  function updateCameraAndCollision() {
    if (isModalOpen) return;

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
        prompt.textContent = `[ E / KLIK ] INSPEKSI: ${closest.title.substring(0, 28)}`;
      }

      if (keys.interact) {
        openExhibitionLightbox(closest);
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
      badge.textContent = "Grand Reception Atrium (Welcome)";
    } else if (player.x < -4 && player.z >= 4) {
      badge.textContent = "West Wing: Portfolio Projects (50+ Exhibits)";
    } else if (player.x > 4 && player.z >= 4) {
      badge.textContent = "East Wing: Career Timeline & Practice";
    } else if (player.z > 22 && Math.abs(player.x) <= 10) {
      badge.textContent = "North Pavilion: Honors, Research & Awards";
    } else {
      badge.textContent = "Central Circulation Corridor";
    }
  }

  // ─── 6. LIGHTBOX / EXHIBITION DETAIL MODAL ─────────────────────
  function openExhibitionLightbox(exhibit) {
    isModalOpen = true;
    const modal = document.getElementById('gallery-lightbox-modal');
    if (!modal) return;

    document.getElementById('lightbox-category').textContent = exhibit.category || "Exhibition Record";
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
        linkBtn.textContent = exhibit.actionText || 'Buka Tautan / Dokumen';
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

  // ─── 7. FAST TELEPORT NAVIGATION ──────────────────────────────
  function teleportToLocation(roomKey) {
    if (roomKey === 'reception') {
      player.x = 0;
      player.z = -3;
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

  // ─── 8. DOM MOUNTING & UI SETUP ───────────────────────────────
  function buildGalleryDOM() {
    const main = document.querySelector('main');
    if (!main) return;

    const wrapper = document.createElement('section');
    wrapper.id = 'contemporary-gallery-experience';
    wrapper.style.width = '100%';

    wrapper.innerHTML = `
      <!-- 1. RECRUITER FAST-TRACK HUB (PUSAT PEREKRUT) -->
      <div class="recruiter-fast-track-card">
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

          <a href="https://wa.me/6281318816058?text=Halo%20Mangara,%20saya%20melihat%20galeri%20portofolio%20Anda%20dan%20tertarik%20untuk%20peluang%20rekrutmen." target="_blank" rel="noopener" class="btn-recruiter-contact wa" title="Chat WhatsApp">
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

      <!-- 2. CONTEMPORARY 3D GALLERY VIEWPORT -->
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
            <button id="btn-gallery-directory" class="gallery-pill-btn" title="Buka Direktori Ruangan">
              <ion-icon name="map-outline"></ion-icon> <span>Direktori Ruang</span>
            </button>
            <a href="#main-portfolio-content" class="gallery-pill-btn primary" title="Gulir ke Dokumen Portofolio Lengkap">
              <ion-icon name="list-outline"></ion-icon> <span>Katalog Lengkap</span>
            </a>
          </div>
        </div>

        <!-- Center Reticle -->
        <div class="gallery-reticle" id="gallery-reticle"></div>

        <!-- Interaction Prompt -->
        <div class="gallery-interaction-prompt" id="gallery-interaction-prompt">
          [ E / KLIK ] INSPEKSI KARYA
        </div>

        <!-- Bottom Controls & Room Location -->
        <div class="gallery-bottom-hud">
          <div class="gallery-controls-hint">
            <span>NAVIGASI:</span>
            <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Berjalan &bull; 
            <span>Klik & Gerakkan Kursor untuk Melihat Sekeliling</span> &bull; 
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
          <div class="gallery-loading-text">Memuat Galeri 3D Kontemporer...</div>
          <div class="gallery-loading-subtext">Kurasi Arsip Portofolio Mangara Ferdianto Pakpahan</div>
        </div>
      </div>

      <!-- 3. EXHIBITION LIGHTBOX MODAL -->
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
              <ion-icon name="open-outline"></ion-icon> <span>Buka Tautan Proyek / Dokumen</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 4. GALLERY DIRECTORY & FLOOR PLAN MODAL -->
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
              <span>Lobi Masuk, Pernyataan Kurator, & Unduh Berkas CV ATS</span>
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
              <span>Azure Machine Learning, SEM-PLS 120 JP, MOS Excel, & PKM DIKTI</span>
            </button>
          </div>

          <div style="text-align: right;">
            <a href="#main-portfolio-content" class="gallery-link-btn" id="directory-goto-catalog">
              <span>Buka Dokumen Portofolio Lengkap</span> &darr;
            </a>
          </div>
        </div>
      </div>
    `;

    main.prepend(wrapper);

    // Setup Event Listeners
    setupGalleryControls();
  }

  function setupGalleryControls() {
    canvasContainer = document.getElementById('gallery-viewport-container');
    canvas = document.getElementById('gallery-webgl-canvas');

    // Pointer Lock on Canvas Click (Desktop)
    canvas.addEventListener('click', () => {
      if (!isModalOpen && canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      isPointerLocked = document.pointerLockElement === canvas;
    });

    // Mouse Movement Look
    document.addEventListener('mousemove', (e) => {
      if (isPointerLocked && !isModalOpen) {
        player.rotY -= e.movementX * 0.0024;
        player.rotX -= e.movementY * 0.0024;
        // Clamp pitch to prevent flipping
        player.rotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, player.rotX));
      }
    });

    // Drag-to-look fallback if pointer lock not enabled
    let isMouseDown = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', (e) => {
      if (!isPointerLocked) {
        isMouseDown = true;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    window.addEventListener('mouseup', () => (isMouseDown = false));

    window.addEventListener('mousemove', (e) => {
      if (isMouseDown && !isPointerLocked && !isModalOpen) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        player.rotY -= dx * 0.004;
        player.rotX -= dy * 0.004;
        player.rotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, player.rotX));
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

    // Modal Close Buttons
    document.getElementById('lightbox-close-btn')?.addEventListener('click', closeExhibitionLightbox);
    document.getElementById('gallery-lightbox-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'gallery-lightbox-modal') closeExhibitionLightbox();
    });

    // Directory Modal
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

    document.getElementById('directory-goto-catalog')?.addEventListener('click', () => {
      closeDirectoryModal();
    });

    // Touch Controls (Mobile)
    setupMobileTouch();
  }

  function setupMobileTouch() {
    const joyZone = document.getElementById('touch-joystick-zone');
    const joyKnob = document.getElementById('touch-joystick-knob');
    const actionBtn = document.getElementById('touch-action-btn');

    actionBtn?.addEventListener('click', () => {
      if (nearestExhibit) openExhibitionLightbox(nearestExhibit);
    });

    if (!joyZone || !joyKnob) return;

    let touchId = null;
    let centerX = 0;
    let centerY = 0;

    joyZone.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        const t = e.changedTouches[0];
        touchId = t.identifier;
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
            const dist = Math.hypot(dx, dy);
            const maxR = 40;
            const angle = Math.atan2(dy, dx);
            const r = Math.min(dist, maxR);

            joyKnob.style.transform = `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`;

            keys.fwd = dy < -12;
            keys.bwd = dy > 12;
            keys.left = dx < -12;
            keys.right = dx > 12;
          }
        }
      },
      { passive: false }
    );

    const resetJoy = () => {
      touchId = null;
      joyKnob.style.transform = 'translate(0px, 0px)';
      keys.fwd = false;
      keys.bwd = false;
      keys.left = false;
      keys.right = false;
    };

    joyZone.addEventListener('touchend', resetJoy);
    joyZone.addEventListener('touchcancel', resetJoy);

    // Touch swipe camera rotation on the canvas
    let lastTouchX = 0;
    let lastTouchY = 0;

    canvas?.addEventListener(
      'touchstart',
      (e) => {
        if (e.target !== joyZone && !e.target.closest('#touch-joystick-zone')) {
          const t = e.touches[0];
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;
        }
      },
      { passive: true }
    );

    canvas?.addEventListener(
      'touchmove',
      (e) => {
        if (!isModalOpen && e.target !== joyZone && !e.target.closest('#touch-joystick-zone')) {
          const t = e.touches[0];
          const dx = t.clientX - lastTouchX;
          const dy = t.clientY - lastTouchY;
          player.rotY -= dx * 0.005;
          player.rotX -= dy * 0.005;
          player.rotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, player.rotX));
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;
        }
      },
      { passive: true }
    );
  }

  // ─── 9. THREE.JS INITIALIZATION & RENDER LOOP ──────────────────
  function initThreeGallery() {
    canvasContainer = document.getElementById('gallery-viewport-container');
    canvas = document.getElementById('gallery-webgl-canvas');

    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1116);
    scene.fog = new THREE.FogExp2(0x0e1116, 0.018);

    // Camera
    camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 120);
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
    renderer.toneMappingExposure = 1.08;

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
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);
    updateCameraAndCollision();
    renderer.render(scene, camera);
  }

  // ─── 10. ENTRY POINT ──────────────────────────────────────────
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

    console.log('🏛️ Contemporary Architectural Gallery Experience successfully loaded!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
