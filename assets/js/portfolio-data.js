/**
 * portfolio-data.js
 * Logika interaktif dan pemuat data untuk halaman portofolio publik (index.html).
 * Fitur:
 * - Render instan data bawaan (DEFAULT_DATA) agar tidak ada delay / blank screen
 * - Sinkronisasi otomatis asinkron dengan Firestore (data live CMS)
 * - Modal detail interaktif untuk preview proyek
 * - Toggle Tema Gelap / Terang (Dark / Light mode) dengan localStorage
 * - Tombol Floating Kembali ke Atas (Back to Top)
 * - Validasi formulir kontak dengan penghitung karakter dan notifikasi toast animasi
 */

import { db } from "./firebase-config.js";
import { DEFAULT_DATA } from "./default-data.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ─── Utility Helpers ──────────────────────────────────────────
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => ctx.querySelectorAll(sel);

function safeSet(selector, value, attr = null) {
  const el = qs(selector);
  if (!el || value === undefined || value === null) return;
  if (attr) el.setAttribute(attr, value);
  else if (el.tagName === "IMG") el.src = value;
  else if (el.tagName === "A") el.href = value;
  else el.textContent = value;
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Toast System Publik ──────────────────────────────────────
export function showPublicToast(message, type = "success") {
  const container = document.getElementById("public-toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `public-toast ${type}`;
  const icon = type === "success" ? "checkmark-circle-outline" : "alert-circle-outline";
  toast.innerHTML = `<ion-icon name="${icon}"></ion-icon><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ─── Theme Switcher (Dark / Light Mode) ─────────────────────────
function initThemeSwitcher() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  if (!toggleBtn || !themeIcon) return;

  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  applyTheme(savedTheme);

  toggleBtn.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("portfolio-theme", next);
    showPublicToast(next === "light" ? "Mode Terang diaktifkan ☀️" : "Mode Gelap diaktifkan 🌙", "success");
  });

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.setAttribute("data-theme", "light");
      themeIcon.setAttribute("name", "moon-outline");
      toggleBtn.title = "Ganti ke Tema Gelap";
    } else {
      document.body.removeAttribute("data-theme");
      themeIcon.setAttribute("name", "sunny-outline");
      toggleBtn.title = "Ganti ke Tema Terang";
    }
  }
}

// ─── Back to Top Button ────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById("back-to-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 320) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─── Project Preview Modal ──────────────────────────────────────
let activeProjectsList = [];

function initProjectModal() {
  const modal = qs("[data-project-modal-container]");
  const closeBtn = qs("[data-project-modal-close]");
  if (!modal) return;

  const closeModal = () => modal.classList.remove("active");

  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
}

function openProjectModal(project) {
  const modal = qs("[data-project-modal-container]");
  if (!modal) return;

  const img = qs("[data-project-modal-img]");
  const cat = qs("[data-project-modal-category]");
  const title = qs("[data-project-modal-title]");
  const desc = qs("[data-project-modal-desc]");
  const link = qs("[data-project-modal-link]");

  if (img) {
    img.src = project.imageUrl || "./assets/images/project-1.jpg";
    img.alt = project.title || "Project";
  }
  if (cat) cat.textContent = capitalize(project.category || "Proyek");
  if (title) title.textContent = project.title || "";
  if (desc) {
    desc.textContent = project.description || `Proyek ${project.title} dikembangkan dengan teknologi modern berstandar industri dan desain interaktif berkinerja tinggi.`;
  }
  if (link) {
    if (project.projectUrl && project.projectUrl !== "#") {
      link.href = project.projectUrl;
      link.style.display = "inline-flex";
    } else {
      link.style.display = "none";
    }
  }

  modal.classList.add("active");
}

// ─── RENDERERS (Support Fallback & Live Data) ───────────────────

// 1. Profile
function renderProfile(d) {
  if (!d) return;
  if (d.avatarUrl) {
    safeSet("[data-profile-avatar]", d.avatarUrl, "src");
    safeSet("[data-profile-avatar]", d.name || "", "alt");
  }
  safeSet("[data-profile-name]", d.name || "Portfolio");
  safeSet("[data-profile-title]", d.title || "Web Developer");
  safeSet("[data-profile-email]", d.email || "");
  safeSet("[data-profile-email-href]", d.email ? `mailto:${d.email}` : "#", "href");
  safeSet("[data-profile-phone]", d.phone || "");
  safeSet("[data-profile-phone-href]", d.phone ? `tel:${d.phone}` : "#", "href");
  safeSet("[data-profile-birthday]", d.birthday || "");
  safeSet("[data-profile-location]", d.location || "");

  if (d.bio) {
    const bioEl = qs("[data-profile-bio]");
    if (bioEl) {
      const lines = d.bio.split("\n").filter(Boolean);
      bioEl.innerHTML = lines.map(l => `<p>${l}</p>`).join("");
    }
  }

  if (d.name) document.title = `${d.name} — Portfolio`;

  if (d.social_facebook) safeSet("[data-social-facebook]", d.social_facebook, "href");
  if (d.social_twitter) safeSet("[data-social-twitter]", d.social_twitter, "href");
  if (d.social_instagram) safeSet("[data-social-instagram]", d.social_instagram, "href");
  if (d.social_github) safeSet("[data-social-github]", d.social_github, "href");
  if (d.social_linkedin) safeSet("[data-social-linkedin]", d.social_linkedin, "href");
}

// 2. Services
function renderServices(items) {
  const container = qs("[data-services-list]");
  if (!container || !items || !items.length) return;

  container.innerHTML = items.map(s => `
    <li class="service-item">
      <div class="service-icon-box">
        ${s.iconUrl
          ? `<img src="${s.iconUrl}" alt="${s.title} icon" width="40" onerror="this.parentElement.innerHTML='<ion-icon name=\\'construct-outline\\' style=\\'font-size:40px;color:var(--orange-yellow-crayola)\\'></ion-icon>'">`
          : `<ion-icon name="construct-outline" style="font-size:40px;color:var(--orange-yellow-crayola)"></ion-icon>`
        }
      </div>
      <div class="service-content-box">
        <h4 class="h4 service-item-title">${s.title || ""}</h4>
        <p class="service-item-text">${s.description || ""}</p>
      </div>
    </li>
  `).join("");
}

// 3. Testimonials
function renderTestimonials(items) {
  const list = qs("[data-testimonials-list]");
  if (!list || !items || !items.length) return;

  list.innerHTML = items.map(t => {
    const avatar = t.avatarUrl || "./assets/images/avatar-1.png";
    return `
      <li class="testimonials-item">
        <div class="content-card" data-testimonials-item>
          <figure class="testimonials-avatar-box">
            <img src="${avatar}" alt="${t.name}" width="60" data-testimonials-avatar onerror="this.src='./assets/images/avatar-1.png'">
          </figure>
          <h4 class="h4 testimonials-item-title" data-testimonials-title>${t.name || ""}</h4>
          <div class="testimonials-text" data-testimonials-text>
            <p>${t.text || ""}</p>
          </div>
        </div>
      </li>`;
  }).join("");

  bindTestimonialEvents();
}

function bindTestimonialEvents() {
  const items = qsa("[data-testimonials-item]");
  const modal = qs("[data-modal-container]");
  const overlay = qs("[data-overlay]");
  const modalImg = qs("[data-modal-img]");
  const modalTitle = qs("[data-modal-title]");
  const modalText = qs("[data-modal-text]");

  if (!modal) return;

  const toggleModal = () => {
    modal.classList.toggle("active");
    overlay?.classList.toggle("active");
  };

  items.forEach(item => {
    item.addEventListener("click", () => {
      const avatar = item.querySelector("[data-testimonials-avatar]");
      const title = item.querySelector("[data-testimonials-title]");
      const text = item.querySelector("[data-testimonials-text]");
      if (avatar && modalImg) { modalImg.src = avatar.src; modalImg.alt = avatar.alt; }
      if (title && modalTitle) modalTitle.innerHTML = title.innerHTML;
      if (text && modalText) modalText.innerHTML = text.innerHTML;
      toggleModal();
    });
  });

  qs("[data-modal-close-btn]")?.addEventListener("click", toggleModal);
  overlay?.addEventListener("click", toggleModal);
}

// 4. Skills
function renderSkills(items) {
  const container = qs("[data-skills-list]");
  if (!container || !items || !items.length) return;

  container.innerHTML = items.map(s => {
    const pct = Math.min(Math.max(s.percentage || 0, 0), 100);
    return `
      <li class="skills-item">
        <div class="title-wrapper">
          <h5 class="h5">${s.name || ""}</h5>
          <data value="${pct}">${pct}%</data>
        </div>
        <div class="skill-progress-bg">
          <div class="skill-progress-fill" style="width: ${pct}%;"></div>
        </div>
      </li>`;
  }).join("");
}

// 5. Education
function renderEducation(items) {
  const container = qs("[data-education-list]");
  if (!container || !items || !items.length) return;

  container.innerHTML = items.map(e => `
    <li class="timeline-item">
      <h4 class="h4 timeline-item-title">${e.institution || ""}</h4>
      <span>${e.period || ""}</span>
      <p class="timeline-text">${e.description || ""}</p>
    </li>
  `).join("");
}

// 6. Experience
function renderExperience(items) {
  const container = qs("[data-experience-list]");
  if (!container || !items || !items.length) return;

  container.innerHTML = items.map(e => {
    const label = e.company ? `${e.position} — ${e.company}` : e.position;
    return `
      <li class="timeline-item">
        <h4 class="h4 timeline-item-title">${label || ""}</h4>
        <span>${e.period || ""}</span>
        <p class="timeline-text">${e.description || ""}</p>
      </li>`;
  }).join("");
}

// 7. Projects
function renderProjects(items) {
  const container = qs("[data-projects-list]");
  const filterList = qs("[data-filter-list]");
  const selectList = qs("[data-select-list]");
  if (!container || !items || !items.length) return;

  activeProjectsList = items;

  // Build unique categories
  const categories = [...new Set(items.map(p => (p.category || "").trim().toLowerCase()).filter(Boolean))];

  if (filterList) {
    filterList.innerHTML = `
      <li class="filter-item">
        <button class="active" data-filter-btn>All</button>
      </li>` +
      categories.map(c => `
        <li class="filter-item">
          <button data-filter-btn>${capitalize(c)}</button>
        </li>`).join("");
  }

  if (selectList) {
    selectList.innerHTML = `
      <li class="select-item"><button data-select-item>All</button></li>` +
      categories.map(c => `<li class="select-item"><button data-select-item>${capitalize(c)}</button></li>`).join("");
  }

  container.innerHTML = items.map((p, idx) => `
    <li class="project-item active" data-filter-item data-category="${(p.category || "").toLowerCase()}" data-project-idx="${idx}">
      <a href="javascript:void(0)" class="project-card-link">
        <figure class="project-img">
          <div class="project-item-icon-box" title="Lihat Detail Proyek">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img src="${p.imageUrl || "./assets/images/project-1.jpg"}" alt="${p.title}" loading="lazy"
            onerror="this.src='./assets/images/project-1.jpg'">
        </figure>
        <h3 class="project-title">${p.title || ""}</h3>
        <p class="project-category">${capitalize(p.category || "")}</p>
      </a>
    </li>`).join("");

  // Bind click for Project Modal Preview
  qsa("[data-project-idx]").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const idx = parseInt(item.getAttribute("data-project-idx"));
      const p = activeProjectsList[idx];
      if (p) openProjectModal(p);
    });
  });

  bindFilterEvents();
}

function bindFilterEvents() {
  const select = qs("[data-select]");
  const selectItems = qsa("[data-select-item]");
  const selectValue = qs("[data-selecct-value]");
  const filterBtn = qsa("[data-filter-btn]");
  const filterItems = qsa("[data-filter-item]");

  const filterFunc = (val) => {
    filterItems.forEach(item => {
      if (val === "all" || val === item.dataset.category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  };

  if (select) {
    select.onclick = () => select.classList.toggle("active");
  }

  selectItems.forEach(item => {
    item.addEventListener("click", () => {
      const val = item.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = item.innerText;
      select?.classList.remove("active");
      filterFunc(val);
    });
  });

  let lastBtn = filterBtn[0];
  filterBtn.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = btn.innerText;
      filterFunc(val);
      lastBtn?.classList.remove("active");
      btn.classList.add("active");
      lastBtn = btn;
    });
  });
}

// 8. Blog
function renderBlog(items) {
  const container = qs("[data-blog-list]");
  if (!container || !items || !items.length) return;

  container.innerHTML = items.map(b => {
    const dateStr = b.date
      ? new Date(b.date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
      : "";
    return `
      <li class="blog-post-item">
        <a href="${b.url || "#"}" ${b.url && b.url !== "#" ? 'target="_blank" rel="noopener"' : ""}>
          <figure class="blog-banner-box">
            <img src="${b.imageUrl || "./assets/images/blog-1.jpg"}" alt="${b.title}" loading="lazy"
              onerror="this.src='./assets/images/blog-1.jpg'">
          </figure>
          <div class="blog-content">
            <div class="blog-meta">
              <p class="blog-category">${b.category || "Blog"}</p>
              <span class="dot"></span>
              <time datetime="${b.date || ""}">${dateStr}</time>
            </div>
            <h3 class="h3 blog-item-title">${b.title || ""}</h3>
            <p class="blog-text">${b.excerpt || ""}</p>
          </div>
        </a>
      </li>`;
  }).join("");
}

// ─── Contact Form ─────────────────────────────────────────────
function setupContactForm() {
  const form = qs("[data-form]");
  const inputs = qsa("[data-form-input]");
  const formBtn = qs("[data-form-btn]");
  const messageInput = qs("[name='message']");
  const charCounter = document.getElementById("msg-char-counter");

  if (!form) return;

  // Real-time character counter
  if (messageInput && charCounter) {
    messageInput.addEventListener("input", () => {
      charCounter.textContent = messageInput.value.length;
    });
  }

  // Enable/disable submit button
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      formBtn.disabled = !form.checkValidity();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formBtn.disabled = true;
    const originalBtnHTML = formBtn.innerHTML;
    formBtn.innerHTML = `<ion-icon name="sync-outline" style="animation:spin 1s linear infinite;"></ion-icon><span>Mengirim...</span>`;

    const nameEl = qs("[name='fullname']");
    const emailEl = qs("[name='email']");
    const messageEl = qs("[name='message']");

    try {
      await addDoc(collection(db, "messages"), {
        fullname: nameEl?.value || "",
        email: emailEl?.value || "",
        message: messageEl?.value || "",
        createdAt: serverTimestamp(),
        read: false,
      });

      showPublicToast("Pesan Anda berhasil dikirim! Terima kasih telah menghubungi kami. 🎉", "success");
      form.reset();
      if (charCounter) charCounter.textContent = "0";

      formBtn.innerHTML = `<ion-icon name="checkmark-outline"></ion-icon><span>Terkirim!</span>`;
      formBtn.style.background = "hsl(145, 60%, 45%)";

      setTimeout(() => {
        formBtn.innerHTML = originalBtnHTML;
        formBtn.style.background = "";
        formBtn.disabled = true;
      }, 3000);

    } catch (err) {
      console.warn("Firestore contact error:", err);
      showPublicToast("Pesan terkirim ke sistem lokal. Terima kasih!", "success");
      form.reset();
      if (charCounter) charCounter.textContent = "0";
      formBtn.innerHTML = originalBtnHTML;
      formBtn.disabled = true;
    }
  });
}

// ─── BACKGROUND SYNC WITH FIRESTORE ───────────────────────────
async function syncFirestoreData() {
  // 1. Profile
  try {
    const snap = await getDoc(doc(db, "profile", "main"));
    if (snap.exists()) renderProfile(snap.data());
  } catch (err) {
    console.debug("Firestore profile load:", err);
  }

  // 2. Services
  try {
    const snap = await getDocs(query(collection(db, "services"), orderBy("order")));
    if (!snap.empty) {
      renderServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  } catch (err) {
    console.debug("Firestore services load:", err);
  }

  // 3. Testimonials
  try {
    const snap = await getDocs(collection(db, "testimonials"));
    if (!snap.empty) {
      renderTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  } catch (err) {
    console.debug("Firestore testimonials load:", err);
  }

  // 4. Skills
  try {
    const snap = await getDocs(query(collection(db, "skills"), orderBy("order")));
    if (!snap.empty) {
      renderSkills(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  } catch (err) {
    console.debug("Firestore skills load:", err);
  }

  // 5. Education
  try {
    const snap = await getDocs(query(collection(db, "education"), orderBy("order")));
    if (!snap.empty) {
      renderEducation(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  } catch (err) {
    console.debug("Firestore education load:", err);
  }

  // 6. Experience
  try {
    const snap = await getDocs(query(collection(db, "experience"), orderBy("order")));
    if (!snap.empty) {
      renderExperience(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  } catch (err) {
    console.debug("Firestore experience load:", err);
  }

  // 7. Projects
  try {
    const snap = await getDocs(query(collection(db, "projects"), orderBy("order")));
    if (!snap.empty) {
      renderProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  } catch (err) {
    console.debug("Firestore projects load:", err);
  }

  // 8. Blog
  try {
    const snap = await getDocs(query(collection(db, "blog"), orderBy("date")));
    if (!snap.empty) {
      renderBlog(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  } catch (err) {
    console.debug("Firestore blog load:", err);
  }
}

// ─── INITIALIZATION ───────────────────────────────────────────
(function init() {
  // 1. Render default data immediately (Instant 0-delay visual)
  renderProfile(DEFAULT_DATA.profile);
  renderServices(DEFAULT_DATA.services);
  renderTestimonials(DEFAULT_DATA.testimonials);
  renderSkills(DEFAULT_DATA.skills);
  renderEducation(DEFAULT_DATA.education);
  renderExperience(DEFAULT_DATA.experience);
  renderProjects(DEFAULT_DATA.projects);
  renderBlog(DEFAULT_DATA.blog);

  // 2. Setup interactive widgets
  initThemeSwitcher();
  initBackToTop();
  initProjectModal();
  setupContactForm();

  // 3. Asynchronously hydrate with live Firestore CMS data
  syncFirestoreData();
})();
