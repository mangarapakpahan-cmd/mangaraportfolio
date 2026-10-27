/**
 * pixel-game-theme.js
 * Retro Pixel Game Experience & Interactive Journey for Mangara's Portfolio
 * - 8-Bit Web Audio API Sound Synthesizer (Zero External Dependencies)
 * - Interactive Journey Map Tracker with Animated Hero Sprite
 * - Twinkling Pixel Stars Background Canvas
 * - Game Intro Title Screen Controller (Inspired by Reference Art)
 * - Click Particle Engine (Pixel Coins & XP Bursts)
 * - Retro HUD Stats & Coin/XP Counters
 */

(function () {
  'use strict';

  // ─── 1. WEB AUDIO API SYNTHESIZER (8-BIT SOUND ENGINE) ────────
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.08, type = 'square', gainVal = 0.08) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio error ignored safely
    }
  }

  function playCoinSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    } catch (e) {}
  }

  function playLevelUpSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
      notes.forEach((f, i) => {
        setTimeout(() => playTone(f, 0.12, 'square', 0.07), i * 65);
      });
    } catch (e) {}
  }

  function playStartFanfare() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const notes = [
        { f: 330, d: 0.12 }, { f: 392, d: 0.12 }, { f: 659, d: 0.2 },
        { f: 523, d: 0.12 }, { f: 587, d: 0.12 }, { f: 784, d: 0.35 }
      ];
      let delay = 0;
      notes.forEach(n => {
        setTimeout(() => playTone(n.f, n.d, 'square', 0.1), delay);
        delay += n.d * 1000 + 30;
      });
    } catch (e) {}
  }

  function playClickSound() {
    playTone(520, 0.04, 'square', 0.05);
  }

  // ─── 2. TWINKLING PIXEL STARS CANVAS ──────────────────────────
  function initPixelStars() {
    const canvas = document.createElement('canvas');
    canvas.id = 'pixel-stars-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const stars = [];
    const starColors = ['#ffffff', '#ffe853', '#80d8ff', '#ffd54f'];

    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7, // Upper sky
        size: Math.random() < 0.25 ? 4 : Math.random() < 0.6 ? 3 : 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: Math.random(),
        speed: 0.008 + Math.random() * 0.02
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        s.alpha += s.speed;
        const currentAlpha = 0.25 + Math.abs(Math.sin(s.alpha)) * 0.75;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        // Draw crisp pixel square
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      }
      ctx.globalAlpha = 1.0;
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ─── 3. INTERACTIVE HUD BUILDER ───────────────────────────────
  let playerCoins = 2026;
  let playerXP = 99200;

  function buildHUD() {
    const hud = document.createElement('header');
    hud.className = 'pixel-game-hud';
    hud.innerHTML = `
      <div class="hud-player-info">
        <div class="hud-avatar-frame" title="Player: Mangara">
          <img src="./assets/images/my-avatar.png" alt="Mangara Pixel Avatar">
        </div>
        <div class="hud-player-title">
          <span class="hud-player-name">MANGARA</span>
          <span class="hud-player-level">★ LVL 99 ADVENTURER</span>
        </div>
      </div>

      <div class="hud-bars">
        <div class="hud-bar-group" title="Health: 100/100">
          <span class="hud-bar-label" style="color: #ff5252;">HP</span>
          <div class="hud-bar-container">
            <div class="hud-bar-fill-hp"></div>
          </div>
        </div>
        <div class="hud-bar-group" title="Mana: 100/100">
          <span class="hud-bar-label" style="color: #00e5ff;">MP</span>
          <div class="hud-bar-container">
            <div class="hud-bar-fill-mp"></div>
          </div>
        </div>
      </div>

      <div class="hud-stats">
        <div class="hud-stat-item gold" title="Collected Coins">
          <span>🪙</span>
          <span id="hud-coin-val">${playerCoins}</span>
        </div>
        <div class="hud-stat-item xp" title="Experience Points">
          <span>⭐</span>
          <span id="hud-xp-val">${playerXP} XP</span>
        </div>
      </div>

      <div class="hud-controls">
        <button class="pixel-btn-small" id="hud-sound-toggle" title="Toggle 8-bit Audio">
          <span id="hud-sound-icon">🔊</span> SFX: <span id="hud-sound-status">ON</span>
        </button>
        <button class="pixel-btn-small green" id="hud-title-btn" title="Kembali ke Layar Judul / Intro">
          <span>🎮</span> TITLE
        </button>
      </div>
    `;
    document.body.prepend(hud);

    // Audio toggle
    const soundBtn = document.getElementById('hud-sound-toggle');
    const soundStatus = document.getElementById('hud-sound-status');
    const soundIcon = document.getElementById('hud-sound-icon');

    soundBtn?.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundStatus.textContent = soundEnabled ? 'ON' : 'OFF';
      soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) playCoinSound();
    });

    // Replay Title Screen
    const titleBtn = document.getElementById('hud-title-btn');
    titleBtn?.addEventListener('click', () => {
      initAudio();
      playClickSound();
      const intro = document.getElementById('pixel-game-intro');
      if (intro) intro.classList.remove('hidden');
    });
  }

  // ─── 4. GAME INTRO SCREEN (Matching User's Reference Art) ─────
  function buildIntroScreen() {
    const intro = document.createElement('div');
    intro.id = 'pixel-game-intro';
    intro.className = 'pixel-intro-overlay';

    intro.innerHTML = `
      <div class="pixel-intro-sky">
        <img src="./assets/images/pixel-game-cover.png" alt="Pixel Art Journey Cover" class="pixel-intro-backdrop-img">
      </div>

      <div class="pixel-intro-content">
        <div class="pixel-intro-title">PORTFOLIO</div>
        <div class="pixel-intro-subtitle">MANGARA FERDIANTO PAKPAHAN</div>
        <div class="pixel-intro-meta">CREATIVE DIRECTOR • LIVE PRODUCTION • DATA ANALYTICS • 2026</div>

        <button class="pixel-start-btn" id="pixel-start-btn">
          ▶ START
        </button>

        <button class="pixel-intro-skip" id="pixel-skip-btn">
          [ Lewati ke Portfolio Langsung ]
        </button>
      </div>
    `;
    document.body.appendChild(intro);

    // CRT Scanline Overlay
    const crt = document.createElement('div');
    crt.className = 'pixel-crt-overlay';
    document.body.appendChild(crt);

    // Floating Moon & Star in background
    const moon = document.createElement('div');
    moon.className = 'pixel-floating-moon';
    moon.title = 'Pixel Moon';
    document.body.appendChild(moon);

    const star = document.createElement('div');
    star.className = 'pixel-floating-star';
    star.textContent = '★';
    document.body.appendChild(star);

    // Start Button Interaction
    const startBtn = document.getElementById('pixel-start-btn');
    const skipBtn = document.getElementById('pixel-skip-btn');

    function closeIntro() {
      initAudio();
      playStartFanfare();
      triggerPopText(window.innerWidth / 2, window.innerHeight / 2, '★ LEVEL 1: SPAWN VILLAGE ★');
      intro.classList.add('hidden');
      addCoins(50);
      addXP(500);
    }

    startBtn?.addEventListener('click', closeIntro);
    skipBtn?.addEventListener('click', () => {
      initAudio();
      playClickSound();
      intro.classList.add('hidden');
    });
  }

  // ─── 5. INTERACTIVE JOURNEY MAP TRACKER ────────────────────────
  const QUEST_ZONES = [
    { target: 'about', label: 'W1: SPAWN VILLAGE', icon: '🏡', xp: 100 },
    { target: 'resume', label: 'W2: CAREER FOREST', icon: '🌲', xp: 200 },
    { target: 'portfolio', label: 'W3: TREASURE VAULT', icon: '💎', xp: 500 },
    { target: 'blog', label: 'W4: WISDOM ARCHIVES', icon: '📜', xp: 300 },
    { target: 'contact', label: 'W5: GUILD PORTAL', icon: '🏰', xp: 250 }
  ];

  let currentZoneIndex = 0;

  function buildJourneyTracker() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'pixel-journey-wrapper';
    wrapper.id = 'pixel-journey-tracker';

    let nodesHtml = '';
    QUEST_ZONES.forEach((zone, i) => {
      nodesHtml += `
        <div class="journey-node ${i === 0 ? 'active' : ''}" data-zone-index="${i}" data-zone-target="${zone.target}" title="${zone.label}">
          <span>${zone.icon}</span>
          <div class="journey-node-tooltip">${zone.label}</div>
        </div>
      `;
    });

    wrapper.innerHTML = `
      <div class="pixel-journey-header">
        <div class="journey-quest-title">
          <span>⚔️ ACTIVE QUEST:</span>
          <span id="journey-active-name" style="color: #ffe853;">WORLD 1: SPAWN VILLAGE (ABOUT)</span>
        </div>
        <div class="journey-quest-level">
          <span id="journey-quest-status">QUEST IN PROGRESS ⏳</span>
        </div>
      </div>

      <div class="pixel-map-track" id="pixel-map-track">
        ${nodesHtml}
        <div class="pixel-hero-runner" id="pixel-hero-runner">
          <div class="pixel-hero-sprite"></div>
        </div>
      </div>
    `;

    // Insert at top of main-content
    mainContent.prepend(wrapper);

    // Setup node click listener
    const nodes = wrapper.querySelectorAll('.journey-node');
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const target = node.dataset.zoneTarget;
        const navBtn = document.querySelector(`[data-nav-link][data-target="${target}"]`);
        if (navBtn) {
          navBtn.click();
        }
      });
    });

    // Position hero at initial node
    setTimeout(() => updateHeroPosition(0), 100);
  }

  function updateHeroPosition(index) {
    const track = document.getElementById('pixel-map-track');
    const runner = document.getElementById('pixel-hero-runner');
    const nodes = document.querySelectorAll('.journey-node');
    if (!track || !runner || !nodes[index]) return;

    const targetNode = nodes[index];
    const trackRect = track.getBoundingClientRect();
    const nodeRect = targetNode.getBoundingClientRect();

    // Calculate left offset relative to track
    const targetLeft = nodeRect.left - trackRect.left + (nodeRect.width / 2) - 18;

    runner.classList.add('running');
    runner.style.left = `${targetLeft}px`;

    nodes.forEach((n, i) => {
      n.classList.toggle('active', i === index);
    });

    const activeName = document.getElementById('journey-active-name');
    const activeStatus = document.getElementById('journey-quest-status');
    if (activeName && QUEST_ZONES[index]) {
      activeName.textContent = `${QUEST_ZONES[index].label}`;
    }
    if (activeStatus) {
      activeStatus.textContent = 'CHECKPOINT REACHED! ⭐';
      activeStatus.style.color = '#39ff14';
      setTimeout(() => {
        activeStatus.textContent = 'EXPLORING ZONE 🚶';
        activeStatus.style.color = '#ffe853';
      }, 2000);
    }

    setTimeout(() => {
      runner.classList.remove('running');
    }, 700);
  }

  // ─── 6. PARTICLE & COIN BURST SYSTEM ──────────────────────────
  function triggerPopText(x, y, text) {
    const pop = document.createElement('div');
    pop.className = 'pixel-pop-text';
    pop.textContent = text;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
  }

  function addCoins(amount) {
    playerCoins += amount;
    const el = document.getElementById('hud-coin-val');
    if (el) el.textContent = playerCoins;
    playCoinSound();
  }

  function addXP(amount) {
    playerXP += amount;
    const el = document.getElementById('hud-xp-val');
    if (el) el.textContent = `${playerXP} XP`;
  }

  // Click particles across document
  function initClickParticles() {
    const colors = ['#ffe853', '#ff6b2b', '#39ff14', '#00e5ff', '#ffffff'];

    document.addEventListener('click', (e) => {
      // Don't trigger on intro close button
      if (e.target.closest('#pixel-game-intro')) return;

      initAudio();
      playClickSound();

      // Spawn 5 tiny pixel particles
      for (let i = 0; i < 5; i++) {
        const p = document.createElement('div');
        p.style.position = 'fixed';
        p.style.width = '6px';
        p.style.height = '6px';
        p.style.left = `${e.clientX + (Math.random() * 20 - 10)}px`;
        p.style.top = `${e.clientY + (Math.random() * 20 - 10)}px`;
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.border = '1px solid #000';
        p.style.zIndex = '9999';
        p.style.pointerEvents = 'none';
        p.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
        document.body.appendChild(p);

        const vx = (Math.random() - 0.5) * 60;
        const vy = -(20 + Math.random() * 50);

        requestAnimationFrame(() => {
          p.style.transform = `translate(${vx}px, ${vy}px) scale(0.3)`;
          p.style.opacity = '0';
        });

        setTimeout(() => p.remove(), 450);
      }
    });
  }

  // ─── 7. HOOK INTO EXISTING PAGE NAVIGATION ─────────────────────
  function hookNavigation() {
    const navLinks = document.querySelectorAll('[data-nav-link]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        initAudio();
        const target = (link.dataset.target || link.innerText).trim().toLowerCase();
        const zoneIdx = QUEST_ZONES.findIndex(z => z.target === target);
        if (zoneIdx !== -1 && zoneIdx !== currentZoneIndex) {
          currentZoneIndex = zoneIdx;
          updateHeroPosition(zoneIdx);
          playLevelUpSound();
          addCoins(10);
          addXP(QUEST_ZONES[zoneIdx].xp);

          const rect = link.getBoundingClientRect();
          triggerPopText(rect.left + rect.width / 2, rect.top - 10, `+${QUEST_ZONES[zoneIdx].xp} XP!`);
        }
      });
    });
  }

  // ─── 8. INITIALIZE ON DOM READY ────────────────────────────────
  function init() {
    initPixelStars();
    buildHUD();
    buildIntroScreen();
    buildJourneyTracker();
    initClickParticles();
    hookNavigation();

    // Enable audio on first user gesture
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });

    console.log('🎮 Pixel Game Theme & Journey Engine activated successfully!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
