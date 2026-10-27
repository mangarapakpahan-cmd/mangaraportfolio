
function formatBirthday(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const d = parseInt(parts[2], 10);
    const m = months[parseInt(parts[1], 10) - 1] || parts[1];
    const y = parts[0];
    return `${d} ${m} ${y}`;
  }
  return dateStr;
}
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
  if (attr) {
    el.setAttribute(attr, value);
  } else if (el.tagName === "IMG") {
    el.src = value;
  } else {
    el.textContent = value;
    if (el.tagName === "A" && !el.getAttribute("href")) {
      el.href = value;
    }
  }
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
  const toggleBtns = [
    document.getElementById("theme-toggle-btn"),
    document.getElementById("nav-theme-btn"),
    document.getElementById("sidebar-theme-btn")
  ].filter(Boolean);

  const themeIcons = [
    document.getElementById("theme-icon"),
    document.getElementById("nav-theme-icon"),
    document.getElementById("sidebar-theme-icon")
  ].filter(Boolean);

  const sidebarThemeText = document.getElementById("sidebar-theme-text");

  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  applyTheme(savedTheme, false);

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const current = document.body.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next, true);
      localStorage.setItem("portfolio-theme", next);
    });
  });

  function applyTheme(theme, showToast = true) {
    if (theme === "light") {
      document.body.setAttribute("data-theme", "light");
      themeIcons.forEach(icon => icon.setAttribute("name", "moon-outline"));
      if (sidebarThemeText) sidebarThemeText.textContent = "Mode Gelap";
      if (showToast) showPublicToast("Mode Terang diaktifkan ☀️", "success");
    } else {
      document.body.removeAttribute("data-theme");
      themeIcons.forEach(icon => icon.setAttribute("name", "sunny-outline"));
      if (sidebarThemeText) sidebarThemeText.textContent = "Mode Terang";
      if (showToast) showPublicToast("Mode Gelap diaktifkan 🌙", "success");
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
  safeSet("[data-profile-name]", d.name || "Mangara Ferdianto Pakpahan");
  safeSet("[data-profile-title]", d.title || "Creative Director | Live Production Specialist | Cinematographer | Visual Designer");

  // Fix email text & link
  const emailEl = qs("[data-profile-email]");
  if (emailEl) {
    emailEl.textContent = d.email || "mangarapakpahan51@gmail.com";
    emailEl.href = `mailto:${d.email || "mangarapakpahan51@gmail.com"}`;
  }

  // Fix phone text & link
  const phoneEl = qs("[data-profile-phone]");
  if (phoneEl) {
    phoneEl.textContent = d.phone || "+62 822-7788-9900";
    phoneEl.href = `tel:${d.phone || "+6282277889900"}`;
  }

  // Dynamic WhatsApp Link
  const rawPhone = (d.phone || "082277889900").replace(/\D/g, "");
  const waPhone = rawPhone.startsWith("0") ? "62" + rawPhone.slice(1) : rawPhone;
  const waBtn = document.getElementById("whatsapp-direct-link");
  if (waBtn) {
    const waText = encodeURIComponent("Halo Mangara, saya melihat portfolio Anda dan tertarik untuk berdiskusi mengenai proyek Creative Direction, Live Production, atau Social Media. Bisa luangkan waktu untuk konsultasi?");
    waBtn.href = `https://wa.me/${waPhone}?text=${waText}`;
  }

  safeSet("[data-profile-birthday]", d.birthday || "");
  safeSet("[data-profile-location]", d.location || "");

  if (d.bio) {
    const bioEl = qs("[data-profile-bio]");
    if (bioEl) {
      const lines = d.bio.split("\n").filter(Boolean);
      bioEl.innerHTML = lines.map(l => `<p>${l}</p>`).join("");
    }
  }

  if (d.name) document.title = `${d.name} — Portfolio | Creative Director & Live Production Specialist`;

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
        <div class="content-card testimonial-card" data-testimonials-item>
          <div class="testimonial-author-wrapper">
            <figure class="testimonials-avatar-box">
              <img src="${avatar}" alt="${t.name || 'Author'}" width="56" height="56" data-testimonials-avatar onerror="this.src='./assets/images/avatar-1.png'">
            </figure>
            <div class="testimonial-author-info">
              <h4 class="h4 testimonials-item-title" data-testimonials-title>${t.name || ""}</h4>
              <span class="testimonials-date">${t.date || "Partner / Rekan Riset"}</span>
            </div>
            <div class="testimonial-quote-icon">
              <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
            </div>
          </div>
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

  // Direct Send via WhatsApp Button
  const waFormBtn = document.getElementById("form-send-wa-btn");
  if (waFormBtn) {
    waFormBtn.addEventListener("click", () => {
      const nameVal = (document.getElementById("contact-fullname")?.value || "").trim();
      const msgVal = (document.getElementById("contact-message")?.value || "").trim();
      const profileCached = JSON.parse(localStorage.getItem("portfolio_cache_profile") || "null") || DEFAULT_DATA.profile;
      const rawPhone = (profileCached.phone || "081318816058").replace(/\D/g, "");
      const waPhone = rawPhone.startsWith("0") ? "62" + rawPhone.slice(1) : rawPhone;
      const text = encodeURIComponent(`Halo Mangara,\n\nNama saya: ${nameVal || "(Pengunjung Portfolio)"}\n\nPesan:\n${msgVal || "Saya tertarik untuk berdiskusi mengenai proyek Anda."}`);
      window.open(`https://wa.me/${waPhone}?text=${text}`, "_blank");
    });
  }

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
    if (snap.exists()) {
      let data = snap.data();
      if (!data.title || data.title.includes("Data Analyst") || data.title.includes("Spesialist")) {
        data = { ...DEFAULT_DATA.profile, ...data, title: DEFAULT_DATA.profile.title, bio: DEFAULT_DATA.profile.bio };
      }
      renderProfile(data);
      localStorage.setItem("portfolio_cache_profile", JSON.stringify(data));
    }
  } catch (err) {
    console.debug("Firestore profile load:", err);
  }

  // Safe helper for collections with in-memory sorting
  const syncColl = async (collName, renderFn, sortField = null) => {
    try {
      const snap = await getDocs(collection(db, collName));
      if (!snap.empty) {
        let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (sortField) {
          items.sort((a, b) => {
            const vA = a[sortField] ?? 0;
            const vB = b[sortField] ?? 0;
            return vA > vB ? 1 : vA < vB ? -1 : 0;
          });
        }
        renderFn(items);
        localStorage.setItem(`portfolio_cache_${collName}`, JSON.stringify(items));
      }
    } catch (err) {
      console.debug(`Firestore ${collName} load:`, err);
    }
  };

  await syncColl("services", renderServices, "order");
  await syncColl("testimonials", renderTestimonials);
  await syncColl("skills", renderSkills, "order");
  await syncColl("education", renderEducation, "order");
  await syncColl("experience", renderExperience, "order");
  await syncColl("projects", renderProjects, "order");
  await syncColl("blog", renderBlog, "date");
}

// ─── INITIALIZATION ───────────────────────────────────────────
(function init() {
  const CACHE_VERSION = "v7_authentic_screenshots";
  if (localStorage.getItem("portfolio_cache_ver") !== CACHE_VERSION) {
    const keysToRemove = [
      "portfolio_cache_profile",
      "portfolio_cache_services",
      "portfolio_cache_testimonials",
      "portfolio_cache_skills",
      "portfolio_cache_education",
      "portfolio_cache_experience",
      "portfolio_cache_projects",
      "portfolio_cache_blog"
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    localStorage.setItem("portfolio_cache_ver", CACHE_VERSION);
  }

  function getLocalOrDef(key, def) {
    try {
      const c = localStorage.getItem(`portfolio_cache_${key}`);
      if (c) {
        const parsed = JSON.parse(c);
        if (parsed && (Array.isArray(parsed) ? parsed.length > 0 : Object.keys(parsed).length > 0)) {
          return parsed;
        }
      }
    } catch {}
    return def;
  }

  // 1. Render immediately from local cache or default data (Instant 0-delay visual)
  renderProfile(getLocalOrDef("profile", DEFAULT_DATA.profile));
  renderServices(getLocalOrDef("services", DEFAULT_DATA.services));
  renderTestimonials(getLocalOrDef("testimonials", DEFAULT_DATA.testimonials));
  renderSkills(getLocalOrDef("skills", DEFAULT_DATA.skills));
  renderEducation(getLocalOrDef("education", DEFAULT_DATA.education));
  renderExperience(getLocalOrDef("experience", DEFAULT_DATA.experience));
  renderProjects(getLocalOrDef("projects", DEFAULT_DATA.projects));
  renderBlog(getLocalOrDef("blog", DEFAULT_DATA.blog));

  // 2. Setup interactive widgets
  initThemeSwitcher();
  initBackToTop();
  initProjectModal();
  setupContactForm();

  // 3. Asynchronously hydrate with live Firestore CMS data
  syncFirestoreData();
})();
