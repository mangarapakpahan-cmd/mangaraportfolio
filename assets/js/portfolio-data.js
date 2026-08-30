/**
 * portfolio-data.js
 * Fetch semua data dari Firestore dan render ke halaman portfolio publik (index.html).
 * Berjalan setelah DOM loaded dan menggantikan placeholder dengan data dinamis.
 * Mempertahankan semua interaksi asli dari script.js.
 */

import { db } from "./firebase-config.js";
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

// ─── Utility ───────────────────────────────────────────────────
function qs(sel, ctx = document)  { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return ctx.querySelectorAll(sel); }

function safeSet(selector, value, attr = null) {
  const el = qs(selector);
  if (!el || value === undefined || value === null) return;
  if (attr)       el.setAttribute(attr, value);
  else if (el.tagName === "IMG") el.src = value;
  else if (el.tagName === "A")   el.href = value;
  else el.textContent = value;
}

function safeHtml(selector, html) {
  const el = qs(selector);
  if (el) el.innerHTML = html;
}

// ─── PROFILE ───────────────────────────────────────────────────
async function loadProfile() {
  try {
    const snap = await getDoc(doc(db, "profile", "main"));
    if (!snap.exists()) return;
    const d = snap.data();

    // Sidebar
    if (d.avatarUrl) {
      safeSet("[data-profile-avatar]", d.avatarUrl, "src");
      safeSet("[data-profile-avatar]", d.name || "", "alt");
    }
    safeSet("[data-profile-name]",     d.name || "");
    safeSet("[data-profile-title]",    d.title || "");
    safeSet("[data-profile-email]",    d.email || "");
    safeSet("[data-profile-email-href]", d.email ? `mailto:${d.email}` : "#", "href");
    safeSet("[data-profile-phone]",    d.phone || "");
    safeSet("[data-profile-phone-href]", d.phone ? `tel:${d.phone}` : "#", "href");
    safeSet("[data-profile-birthday]", d.birthday || "");
    safeSet("[data-profile-location]", d.location || "");

    // Bio
    if (d.bio) {
      const bioEl = qs("[data-profile-bio]");
      if (bioEl) {
        const lines = d.bio.split("\n").filter(Boolean);
        bioEl.innerHTML = lines.map(l => `<p>${l}</p>`).join("");
      }
    }

    // Title meta tag
    if (d.name) document.title = `${d.name} — Portfolio`;

    // Social links
    if (d.social_facebook)  safeSet("[data-social-facebook]",  d.social_facebook,  "href");
    if (d.social_twitter)   safeSet("[data-social-twitter]",   d.social_twitter,   "href");
    if (d.social_instagram) safeSet("[data-social-instagram]", d.social_instagram, "href");

  } catch (err) {
    console.warn("Profile load error:", err);
  }
}

// ─── SERVICES ──────────────────────────────────────────────────
async function loadServices() {
  try {
    const snap = await getDocs(query(collection(db, "services"), orderBy("order")));
    if (snap.empty) return;
    const container = qs("[data-services-list]");
    if (!container) return;

    container.innerHTML = snap.docs.map(d => {
      const s = d.data();
      return `
        <li class="service-item">
          <div class="service-icon-box">
            ${s.iconUrl
              ? `<img src="${s.iconUrl}" alt="${s.title} icon" width="40">`
              : `<ion-icon name="construct-outline" style="font-size:40px;color:var(--orange-yellow-crayola)"></ion-icon>`
            }
          </div>
          <div class="service-content-box">
            <h4 class="h4 service-item-title">${s.title || ""}</h4>
            <p class="service-item-text">${s.description || ""}</p>
          </div>
        </li>`;
    }).join("");
  } catch (err) {
    console.warn("Services load error:", err);
  }
}

// ─── TESTIMONIALS ───────────────────────────────────────────────
async function loadTestimonials() {
  try {
    const snap = await getDocs(collection(db, "testimonials"));
    if (snap.empty) return;
    const list = qs("[data-testimonials-list]");
    if (!list) return;

    list.innerHTML = snap.docs.map(d => {
      const t = d.data();
      const avatar = t.avatarUrl || "./assets/images/avatar-1.png";
      return `
        <li class="testimonials-item">
          <div class="content-card" data-testimonials-item>
            <figure class="testimonials-avatar-box">
              <img src="${avatar}" alt="${t.name}" width="60" data-testimonials-avatar>
            </figure>
            <h4 class="h4 testimonials-item-title" data-testimonials-title>${t.name || ""}</h4>
            <div class="testimonials-text" data-testimonials-text>
              <p>${t.text || ""}</p>
            </div>
          </div>
        </li>`;
    }).join("");

    // Re-bind testimonial click events (from original script.js logic)
    bindTestimonialEvents();
  } catch (err) {
    console.warn("Testimonials load error:", err);
  }
}

function bindTestimonialEvents() {
  const items     = qsa("[data-testimonials-item]");
  const modal     = qs("[data-modal-container]");
  const overlay   = qs("[data-overlay]");
  const modalImg  = qs("[data-modal-img]");
  const modalTitle= qs("[data-modal-title]");
  const modalText = qs("[data-modal-text]");

  if (!modal) return;

  const toggleModal = () => {
    modal.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  items.forEach(item => {
    item.addEventListener("click", () => {
      const avatar = item.querySelector("[data-testimonials-avatar]");
      const title  = item.querySelector("[data-testimonials-title]");
      const text   = item.querySelector("[data-testimonials-text]");
      if (avatar)     { modalImg.src = avatar.src; modalImg.alt = avatar.alt; }
      if (title)        modalTitle.innerHTML = title.innerHTML;
      if (text)         modalText.innerHTML  = text.innerHTML;
      toggleModal();
    });
  });

  qs("[data-modal-close-btn]")?.addEventListener("click", toggleModal);
  overlay?.addEventListener("click", toggleModal);
}

// ─── SKILLS ─────────────────────────────────────────────────────
async function loadSkills() {
  try {
    const snap = await getDocs(query(collection(db, "skills"), orderBy("order")));
    if (snap.empty) return;
    const container = qs("[data-skills-list]");
    if (!container) return;

    container.innerHTML = snap.docs.map(d => {
      const s = d.data();
      const pct = s.percentage || 0;
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
  } catch (err) {
    console.warn("Skills load error:", err);
  }
}

// ─── EDUCATION ──────────────────────────────────────────────────
async function loadEducation() {
  try {
    const snap = await getDocs(query(collection(db, "education"), orderBy("order")));
    if (snap.empty) return;
    const container = qs("[data-education-list]");
    if (!container) return;

    container.innerHTML = snap.docs.map(d => {
      const e = d.data();
      return `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${e.institution || ""}</h4>
          <span>${e.period || ""}</span>
          <p class="timeline-text">${e.description || ""}</p>
        </li>`;
    }).join("");
  } catch (err) {
    console.warn("Education load error:", err);
  }
}

// ─── EXPERIENCE ─────────────────────────────────────────────────
async function loadExperience() {
  try {
    const snap = await getDocs(query(collection(db, "experience"), orderBy("order")));
    if (snap.empty) return;
    const container = qs("[data-experience-list]");
    if (!container) return;

    container.innerHTML = snap.docs.map(d => {
      const e = d.data();
      const label = e.company ? `${e.position} — ${e.company}` : e.position;
      return `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${label || ""}</h4>
          <span>${e.period || ""}</span>
          <p class="timeline-text">${e.description || ""}</p>
        </li>`;
    }).join("");
  } catch (err) {
    console.warn("Experience load error:", err);
  }
}

// ─── PROJECTS ────────────────────────────────────────────────────
async function loadProjects() {
  try {
    const snap = await getDocs(query(collection(db, "projects"), orderBy("order")));
    if (snap.empty) return;
    const container    = qs("[data-projects-list]");
    const filterList   = qs("[data-filter-list]");
    const selectList   = qs("[data-select-list]");
    if (!container) return;

    const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Build unique categories
    const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];

    // Render filter buttons if elements exist
    if (filterList) {
      filterList.innerHTML = `<li class="filter-item"><button class="active" data-filter-btn>All</button></li>` +
        categories.map(c => `<li class="filter-item"><button data-filter-btn>${capitalize(c)}</button></li>`).join("");
    }

    if (selectList) {
      selectList.innerHTML = `<li class="select-item"><button data-select-item>All</button></li>` +
        categories.map(c => `<li class="select-item"><button data-select-item>${capitalize(c)}</button></li>`).join("");
    }

    // Render project cards
    container.innerHTML = projects.map(p => `
      <li class="project-item active" data-filter-item data-category="${(p.category || "").toLowerCase()}">
        <a href="${p.projectUrl || "#"}" ${p.projectUrl ? 'target="_blank" rel="noopener"' : ""}>
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
            <img src="${p.imageUrl || "./assets/images/project-1.jpg"}" alt="${p.title}" loading="lazy"
              onerror="this.src='./assets/images/project-1.jpg'">
          </figure>
          <h3 class="project-title">${p.title || ""}</h3>
          <p class="project-category">${capitalize(p.category || "")}</p>
        </a>
      </li>`).join("");

    // Re-bind filter logic
    bindFilterEvents();
  } catch (err) {
    console.warn("Projects load error:", err);
  }
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function bindFilterEvents() {
  const select      = qs("[data-select]");
  const selectItems = qsa("[data-select-item]");
  const selectValue = qs("[data-selecct-value]");
  const filterBtn   = qsa("[data-filter-btn]");
  const filterItems = qsa("[data-filter-item]");

  const filterFunc = (val) => {
    filterItems.forEach(item => {
      if (val === "all" || val === item.dataset.category) item.classList.add("active");
      else item.classList.remove("active");
    });
  };

  if (select) {
    select.addEventListener("click", () => select.classList.toggle("active"));
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

// ─── BLOG ────────────────────────────────────────────────────────
async function loadBlog() {
  try {
    const snap = await getDocs(query(collection(db, "blog"), orderBy("date")));
    if (snap.empty) return;
    const container = qs("[data-blog-list]");
    if (!container) return;

    container.innerHTML = snap.docs.map(d => {
      const b = d.data();
      const dateStr = b.date ? new Date(b.date).toLocaleDateString("id-ID", { year:"numeric", month:"long", day:"numeric" }) : "";
      return `
        <li class="blog-post-item">
          <a href="${b.url || "#"}" ${b.url ? 'target="_blank" rel="noopener"' : ""}>
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
  } catch (err) {
    console.warn("Blog load error:", err);
  }
}

// ─── CONTACT FORM → Simpan ke Firestore ────────────────────────
async function setupContactForm() {
  const form    = qs("[data-form]");
  const inputs  = qsa("[data-form-input]");
  const formBtn = qs("[data-form-btn]");

  if (!form) return;

  // Enable/disable button
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      formBtn.disabled = !form.checkValidity();
    });
  });

  // On submit → save to Firestore
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formBtn.disabled = true;

    const nameEl    = qs("[name='fullname']");
    const emailEl   = qs("[name='email']");
    const messageEl = qs("[name='message']");

    try {
      await addDoc(collection(db, "messages"), {
        fullname:  nameEl?.value  || "",
        email:     emailEl?.value || "",
        message:   messageEl?.value || "",
        createdAt: serverTimestamp(),
        read:      false,
      });

      // Success feedback
      formBtn.innerHTML = `<ion-icon name="checkmark-outline"></ion-icon><span>Terkirim!</span>`;
      formBtn.style.background = "hsl(145, 60%, 45%)";
      form.reset();

      setTimeout(() => {
        formBtn.innerHTML = `<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>`;
        formBtn.style.background = "";
        formBtn.disabled = true;
      }, 3000);

    } catch (err) {
      console.error("Form submit error:", err);
      formBtn.disabled = false;
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    }
  });
}

// ─── INIT: Load All ─────────────────────────────────────────────
(async function init() {
  try {
    await Promise.all([
      loadProfile(),
      loadServices(),
      loadTestimonials(),
      loadSkills(),
      loadEducation(),
      loadExperience(),
      loadBlog(),
    ]);

    // Projects loaded separately (needs filter re-bind)
    await loadProjects();

    // Contact form
    setupContactForm();

  } catch (err) {
    console.error("Portfolio data init error:", err);
  }
})();
