/**
 * admin.js
 * Logika utama Admin Dashboard CMS.
 * Handles: CRUD ke Firestore, render tabel, open/close modal, toast,
 * live filter/search, seeding data bawaan, export/import JSON, dan live preview.
 */

import { db } from "./firebase-config.js";
import { DEFAULT_DATA } from "./default-data.js";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ─── Cache untuk Live Search / Filter ─────────────────────────
let cachedProjects = [];
let cachedBlog = [];
let cachedSkills = [];
let cachedMessages = [];
let currentMsgTab = "all";

// Invalidate obsolete local cache to match newly confirmed activities
const CACHE_VERSION = "v5_granularity_50plus";
if (typeof localStorage !== "undefined" && localStorage.getItem("portfolio_cache_ver") !== CACHE_VERSION) {
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

// ─── Toast Notification System ─────────────────────────────────
const toastContainer = document.getElementById("toast-container");

export function showToast(message, type = "success") {
  const icons = {
    success: "checkmark-circle-outline",
    error: "alert-circle-outline",
    info: "information-circle-outline"
  };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<ion-icon name="${icons[type] || icons.info}"></ion-icon><span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// ─── Modal Helpers ──────────────────────────────────────────────
const modalOverlay = document.getElementById("modal-overlay");
const modalBox     = document.getElementById("modal-box");

export function openModal(title, bodyHTML, footerHTML = "") {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").innerHTML   = bodyHTML;
  document.getElementById("modal-footer").innerHTML = footerHTML;
  modalOverlay.classList.add("show");
}

export function closeModal() {
  modalOverlay.classList.remove("show");
}

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.getElementById("modal-close-btn")?.addEventListener("click", closeModal);

// Keyboard shortcut: Escape to close modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
    closeModal();
  }
});

// ─── Confirm Delete Modal ───────────────────────────────────────
export function confirmDelete(message) {
  return new Promise((resolve) => {
    openModal(
      "Konfirmasi Tindakan",
      `<p style="color:var(--text-secondary);font-size:14px;line-height:1.6;">${message}</p>`,
      `<button class="btn-ghost" id="cancel-delete">Batal</button>
       <button class="btn-danger" id="confirm-delete-btn"><ion-icon name="trash-outline"></ion-icon>Lanjutkan</button>`
    );
    setTimeout(() => {
      document.getElementById("cancel-delete").onclick      = () => { closeModal(); resolve(false); };
      document.getElementById("confirm-delete-btn").onclick = () => { closeModal(); resolve(true); };
    }, 50);
  });
}

// ─── Live Image Preview Helper in Modals ─────────────────────────
window.updateModalImgPreview = function(url) {
  const preview = document.getElementById("modal-img-preview");
  if (!preview) return;
  if (url && url.trim()) {
    preview.innerHTML = `
      <img src="${url.trim()}" alt="Preview"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <span class="placeholder-text" style="display:none;"><ion-icon name="alert-circle-outline"></ion-icon> Gambar Gagal Dimuat</span>`;
  } else {
    preview.innerHTML = `<span class="placeholder-text"><ion-icon name="image-outline"></ion-icon> Pratinjau Gambar</span>`;
  }
};

// ─── Theme Accent Picker ────────────────────────────────────────
window.setAdminAccent = function(color) {
  const colors = ["blue", "emerald", "purple", "amber", "rose"];
  if (!colors.includes(color)) color = "blue";

  if (color === "blue") {
    document.body.removeAttribute("data-accent");
  } else {
    document.body.setAttribute("data-accent", color);
  }

  localStorage.setItem("admin-accent", color);

  // Update dots
  document.querySelectorAll(".accent-dot").forEach(dot => {
    dot.classList.toggle("active", dot.id === `dot-${color}`);
  });

  showToast(`Warna tema diubah ke ${color.toUpperCase()}`, "info");
};

// Initialize saved accent
(function initAccent() {
  const saved = localStorage.getItem("admin-accent") || "blue";
  if (saved && saved !== "blue") {
    document.body.setAttribute("data-accent", saved);
  }
  setTimeout(() => {
    document.querySelectorAll(".accent-dot").forEach(dot => {
      dot.classList.toggle("active", dot.id === `dot-${saved}`);
    });
  }, 100);
})();

// ─── Generic Firestore Helpers with Dual Cache & Fallback ──────
export async function fetchCollection(collName, orderField = null) {
  try {
    const snap = await getDocs(collection(db, collName));
    let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (orderField && items.length > 0) {
      items.sort((a, b) => {
        const valA = a[orderField] ?? 0;
        const valB = b[orderField] ?? 0;
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      });
    }
    if (items.length > 0) {
      localStorage.setItem(`portfolio_cache_${collName}`, JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn(`Firestore read failed for ${collName}:`, err);
  }

  // Fallback 1: Local cache
  const cached = localStorage.getItem(`portfolio_cache_${collName}`);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }

  // Fallback 2: DEFAULT_DATA (prefill so admin is never blank)
  if (DEFAULT_DATA[collName] && Array.isArray(DEFAULT_DATA[collName])) {
    return DEFAULT_DATA[collName].map((item, idx) => ({
      ...item,
      id: `default_${idx}`,
      _isDefault: true
    }));
  }

  return [];
}

export function updateLocalCollectionCache(collName, id, data, isDelete = false) {
  try {
    let list = JSON.parse(localStorage.getItem(`portfolio_cache_${collName}`) || "null");
    if (!list || !Array.isArray(list) || !list.length) {
      list = (DEFAULT_DATA[collName] || []).map((x, idx) => ({ ...x, id: `default_${idx}` }));
    }
    if (isDelete) {
      list = list.filter(item => item.id !== id);
    } else if (id && !id.startsWith("default_")) {
      const idx = list.findIndex(item => item.id === id);
      if (idx >= 0) list[idx] = { ...list[idx], ...data, id };
      else list.unshift({ ...data, id });
    } else if (id && id.startsWith("default_")) {
      const idx = list.findIndex(item => item.id === id);
      if (idx >= 0) list[idx] = { ...list[idx], ...data, _isDefault: false };
      else list.unshift({ ...data, _isDefault: false });
    } else {
      list.unshift({ ...data, id: "local_" + Date.now() });
    }
    localStorage.setItem(`portfolio_cache_${collName}`, JSON.stringify(list));
  } catch (e) {
    console.warn("Failed updating local cache:", e);
  }
}

export async function addDocument(collName, data) {
  return addDoc(collection(db, collName), { ...data, createdAt: serverTimestamp() });
}

export async function updateDocument(collName, id, data) {
  return updateDoc(doc(db, collName, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(collName, id) {
  return deleteDoc(doc(db, collName, id));
}

export async function getDocumentById(collName, id) {
  try {
    const snap = await getDoc(doc(db, collName, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch {
    return null;
  }
}

export async function setDocument(collName, id, data) {
  return setDoc(doc(db, collName, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Loading Skeleton Helper ────────────────────────────────────
export function renderSkeleton(containerId, rows = 4, cols = 4) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array.from({ length: rows }).map(() =>
    `<tr>${Array.from({ length: cols }).map(() =>
      `<td><div class="skeleton" style="height:18px;width:80%;border-radius:4px;"></div></td>`
    ).join("")}</tr>`
  ).join("");
}

// ─── Stats on Dashboard ─────────────────────────────────────────
export async function loadDashboardStats() {
  const collections = ["projects", "skills", "blog", "messages"];
  const ids         = ["stat-projects", "stat-skills", "stat-blog", "stat-messages"];
  let totalCloud = 0;
  await Promise.all(collections.map(async (c, i) => {
    try {
      const snap = await getDocs(collection(db, c));
      const el = document.getElementById(ids[i]);
      if (el) {
        if (snap.size > 0 || c === "messages") {
          el.textContent = snap.size;
        } else {
          const defCount = (DEFAULT_DATA[c] || []).length;
          el.textContent = defCount;
        }
      }
      if (c !== "messages") totalCloud += snap.size;
    } catch {
      const el = document.getElementById(ids[i]);
      if (el) el.textContent = (DEFAULT_DATA[c] || []).length;
    }
  }));

  const syncAlert = document.getElementById("firestore-sync-alert");
  if (syncAlert) {
    syncAlert.style.display = totalCloud === 0 ? "flex" : "none";
  }
}

// ════════════════════════════════════════════════════════════════
// ──  SECTION RENDERERS & LOGIC  ─────────────────────────────────
// ════════════════════════════════════════════════════════════════

// ─── PROFILE ───────────────────────────────────────────────────
export async function loadProfile() {
  let data = null;
  try {
    data = await getDocumentById("profile", "main");
  } catch (err) {
    console.warn("Load profile from Firestore error:", err);
  }

  if (!data) {
    const cached = localStorage.getItem("portfolio_cache_profile");
    if (cached) {
      try { data = JSON.parse(cached); } catch {}
    }
  }

  let effective = data || DEFAULT_DATA.profile;
  if (!effective.title || effective.title.includes("Data Analyst") || effective.title.includes("Spesialist")) {
    effective = { ...DEFAULT_DATA.profile, ...effective, title: DEFAULT_DATA.profile.title, bio: DEFAULT_DATA.profile.bio };
  }

  // Clean duplicate URL prefix if exists
  if (effective.social_instagram && effective.social_instagram.includes("https://instagram.comhttps://instagram.com/")) {
    effective.social_instagram = effective.social_instagram.replace("https://instagram.comhttps://instagram.com/", "https://instagram.com/");
  }

  const fields = [
    "name", "title", "bio", "email", "phone", "birthday", "location",
    "avatarUrl", "social_facebook", "social_twitter", "social_instagram",
    "social_github", "social_linkedin"
  ];

  fields.forEach(f => {
    const el = document.getElementById(`profile-${f}`);
    if (el && effective[f] !== undefined) el.value = effective[f] || "";
  });

  if (effective.avatarUrl && window.updateAvatarPreview) {
    window.updateAvatarPreview(effective.avatarUrl);
  }
}

export async function saveProfile() {
  const fields = [
    "name", "title", "bio", "email", "phone", "birthday", "location",
    "avatarUrl", "social_facebook", "social_twitter", "social_instagram",
    "social_github", "social_linkedin"
  ];
  const data = {};
  fields.forEach(f => {
    const el = document.getElementById(`profile-${f}`);
    if (el) data[f] = el.value.trim();
  });

  // Clean duplicate prefix on Instagram if user pasted full URL into input
  if (data.social_instagram && data.social_instagram.includes("https://instagram.comhttps://instagram.com/")) {
    data.social_instagram = data.social_instagram.replace("https://instagram.comhttps://instagram.com/", "https://instagram.com/");
  }

  // 1. Immediately cache locally
  localStorage.setItem("portfolio_cache_profile", JSON.stringify(data));

  // 2. Save to Firestore
  try {
    await setDocument("profile", "main", data);
    showToast("Profil berhasil disimpan ke Cloud & Website! 🚀", "success");
  } catch (err) {
    console.error("Save profile error:", err);
    showToast("Profil tersimpan di browser lokal! (Cloud: " + (err.message || "akses ditolak") + ")", "info");
  }
}

// ─── SERVICES ───────────────────────────────────────────────────
export async function loadServices() {
  renderSkeleton("services-tbody", 3, 4);
  const items = await fetchCollection("services", "order");
  const tbody = document.getElementById("services-tbody");
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="construct-outline"></ion-icon><p>Belum ada layanan. Gunakan tombol 'Tambah Layanan' atau 'Sinkronkan Data Bawaan' di Dashboard.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(s => `
    <tr>
      <td class="cell-bold">${s.title || "—"} ${s._isDefault ? '<span class="pill pill-warning" style="font-size:10px;margin-left:4px;">Bawaan</span>' : ''}</td>
      <td>${s.description ? s.description.substring(0,60)+"..." : "—"}</td>
      <td><span class="pill pill-accent">${s.order ?? 0}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="adminEditService('${s.id}')" title="Edit"><ion-icon name="create-outline"></ion-icon></button>
          <button class="btn-icon delete" onclick="adminDeleteService('${s.id}','${s.title}')" title="Hapus"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
      </td>
    </tr>`).join("");
}

window.adminEditService = async (id) => {
  const items = await fetchCollection("services");
  const s = items.find(x => x.id === id);
  if (!s) return;
  openModal("Edit Layanan", serviceForm(s), `
    <button class="btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn-primary" onclick="adminSaveService('${id}')"><ion-icon name="save-outline"></ion-icon>Simpan</button>
  `);
};

window.adminDeleteService = async (id, title) => {
  const ok = await confirmDelete(`Hapus layanan "<strong>${title}</strong>"? Aksi ini tidak dapat dibatalkan.`);
  if (!ok) return;
  try {
    if (id && !id.startsWith("default_")) {
      await deleteDocument("services", id);
    }
    updateLocalCollectionCache("services", id, null, true);
    showToast("Layanan dihapus.");
    loadServices();
  } catch (err) {
    updateLocalCollectionCache("services", id, null, true);
    showToast("Layanan dihapus dari cache lokal.");
    loadServices();
  }
};

window.adminSaveService = async (id) => {
  const data = getServiceFormData();
  try {
    if (id && !id.startsWith("default_")) {
      await updateDocument("services", id, data);
      showToast("Layanan diperbarui di Cloud & Website!");
    } else {
      await addDocument("services", data);
      showToast("Layanan berhasil ditambahkan ke Cloud & Website!");
    }
    updateLocalCollectionCache("services", id, data);
    closeModal();
    loadServices();
  } catch (err) {
    console.error("Save service error:", err);
    updateLocalCollectionCache("services", id, data);
    showToast("Layanan tersimpan di browser lokal!", "info");
    closeModal();
    loadServices();
  }
};

function serviceForm(s = {}) {
  return `
    <div class="form-grid">
      <div class="form-group full"><label class="form-label">Judul <span class="required">*</span></label>
        <input id="svc-title" class="form-control" value="${s.title||""}" placeholder="Web Design"></div>
      <div class="form-group full"><label class="form-label">Deskripsi</label>
        <textarea id="svc-desc" class="form-control" rows="3">${s.description||""}</textarea></div>
      <div class="form-group"><label class="form-label">URL Icon (SVG/PNG)</label>
        <input id="svc-icon" class="form-control" value="${s.iconUrl||""}" placeholder="./assets/images/icon-design.svg"></div>
      <div class="form-group"><label class="form-label">Urutan</label>
        <input id="svc-order" class="form-control" type="number" value="${s.order||0}"></div>
    </div>`;
}

function getServiceFormData() {
  return {
    title:       document.getElementById("svc-title")?.value || "",
    description: document.getElementById("svc-desc")?.value  || "",
    iconUrl:     document.getElementById("svc-icon")?.value  || "",
    order:       parseInt(document.getElementById("svc-order")?.value) || 0,
  };
}

// ─── SKILLS ─────────────────────────────────────────────────────
export async function loadSkills() {
  renderSkeleton("skills-tbody", 4, 4);
  const items = await fetchCollection("skills", "order");
  cachedSkills = items;
  renderSkillsTable(items);
}

function renderSkillsTable(items) {
  const tbody = document.getElementById("skills-tbody");
  if (!tbody) return;
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="bar-chart-outline"></ion-icon><p>Belum ada skill.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(s => `
    <tr>
      <td class="cell-bold">${s.name||"—"} ${s._isDefault ? '<span class="pill pill-warning" style="font-size:10px;margin-left:4px;">Bawaan</span>' : ''}</td>
      <td>
        <div class="skill-bar-wrap">
          <div class="skill-bar-bg"><div class="skill-bar-fill" style="width:${s.percentage||0}%"></div></div>
          <span class="skill-pct">${s.percentage||0}%</span>
        </div>
      </td>
      <td><span class="pill pill-accent">${s.order??0}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="adminEditSkill('${s.id}')" title="Edit"><ion-icon name="create-outline"></ion-icon></button>
          <button class="btn-icon delete" onclick="adminDeleteSkill('${s.id}','${s.name}')" title="Hapus"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
      </td>
    </tr>`).join("");
}

window.filterSkillsTable = function(query) {
  const q = (query || "").toLowerCase().trim();
  const filtered = cachedSkills.filter(s => (s.name || "").toLowerCase().includes(q));
  renderSkillsTable(filtered);
};

window.adminEditSkill = async (id) => {
  const s = cachedSkills.find(x => x.id === id) || (await fetchCollection("skills")).find(x => x.id === id);
  if (!s) return;
  openModal("Edit Skill", skillForm(s), `
    <button class="btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn-primary" onclick="adminSaveSkill('${id}')"><ion-icon name="save-outline"></ion-icon>Simpan</button>
  `);
  bindRangeInput();
};

window.adminDeleteSkill = async (id, name) => {
  const ok = await confirmDelete(`Hapus skill "<strong>${name}</strong>"?`);
  if (!ok) return;
  try {
    if (id && !id.startsWith("default_")) {
      await deleteDocument("skills", id);
    }
    updateLocalCollectionCache("skills", id, null, true);
    showToast("Skill dihapus.");
    loadSkills();
  } catch (err) {
    updateLocalCollectionCache("skills", id, null, true);
    showToast("Skill dihapus dari cache lokal.");
    loadSkills();
  }
};

window.adminSaveSkill = async (id) => {
  const data = getSkillFormData();
  try {
    if (id && !id.startsWith("default_")) {
      await updateDocument("skills", id, data);
      showToast("Skill diperbarui di Cloud & Website!");
    } else {
      await addDocument("skills", data);
      showToast("Skill berhasil ditambahkan ke Cloud & Website!");
    }
    updateLocalCollectionCache("skills", id, data);
    closeModal();
    loadSkills();
  } catch (err) {
    console.error("Save skill error:", err);
    updateLocalCollectionCache("skills", id, data);
    showToast("Skill tersimpan di browser lokal!", "info");
    closeModal();
    loadSkills();
  }
};

function skillForm(s = {}) {
  const pct = s.percentage || 0;
  return `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Nama Skill <span class="required">*</span></label>
        <input id="skl-name" class="form-control" value="${s.name||""}" placeholder="JavaScript"></div>
      <div class="form-group"><label class="form-label">Urutan</label>
        <input id="skl-order" class="form-control" type="number" value="${s.order||0}"></div>
      <div class="form-group full">
        <label class="form-label">Persentase: <span class="range-value" id="range-display">${pct}%</span></label>
        <input id="skl-pct" class="form-range" type="range" min="0" max="100" value="${pct}">
      </div>
    </div>`;
}

function bindRangeInput() {
  setTimeout(() => {
    const range = document.getElementById("skl-pct");
    const disp  = document.getElementById("range-display");
    if (range && disp) range.addEventListener("input", () => disp.textContent = `${range.value}%`);
  }, 80);
}

function getSkillFormData() {
  return {
    name:       document.getElementById("skl-name")?.value || "",
    percentage: parseInt(document.getElementById("skl-pct")?.value) || 0,
    order:      parseInt(document.getElementById("skl-order")?.value) || 0,
  };
}

// ─── EDUCATION ──────────────────────────────────────────────────
export async function loadEducation() {
  renderSkeleton("edu-tbody", 3, 4);
  const items = await fetchCollection("education", "order");
  const tbody = document.getElementById("edu-tbody");
  if (!items.length) { tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="school-outline"></ion-icon><p>Belum ada riwayat pendidikan.</p></div></td></tr>`; return; }
  tbody.innerHTML = items.map(e => `
    <tr>
      <td class="cell-bold">${e.institution||"—"} ${e._isDefault ? '<span class="pill pill-warning" style="font-size:10px;margin-left:4px;">Bawaan</span>' : ''}</td>
      <td>${e.period||"—"}</td>
      <td>${e.description ? e.description.substring(0,50)+"..." : "—"}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="adminEditEdu('${e.id}')" title="Edit"><ion-icon name="create-outline"></ion-icon></button>
          <button class="btn-icon delete" onclick="adminDeleteEdu('${e.id}','${e.institution}')" title="Hapus"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
      </td>
    </tr>`).join("");
}

window.adminEditEdu = async (id) => {
  const items = await fetchCollection("education");
  const e = items.find(x => x.id === id) || {};
  openModal("Edit Pendidikan", timelineForm(e, "edu"), `
    <button class="btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn-primary" onclick="adminSaveEdu('${id}')"><ion-icon name="save-outline"></ion-icon>Simpan</button>
  `);
};

window.adminDeleteEdu = async (id, name) => {
  const ok = await confirmDelete(`Hapus pendidikan "<strong>${name}</strong>"?`);
  if (!ok) return;
  try {
    if (id && !id.startsWith("default_")) {
      await deleteDocument("education", id);
    }
    updateLocalCollectionCache("education", id, null, true);
    showToast("Pendidikan dihapus.");
    loadEducation();
  } catch (err) {
    updateLocalCollectionCache("education", id, null, true);
    showToast("Pendidikan dihapus dari cache lokal.");
    loadEducation();
  }
};

window.adminSaveEdu = async (id) => {
  const data = getTimelineFormData("edu");
  try {
    if (id && !id.startsWith("default_")) {
      await updateDocument("education", id, data);
      showToast("Pendidikan diperbarui di Cloud & Website!");
    } else {
      await addDocument("education", data);
      showToast("Pendidikan ditambahkan ke Cloud & Website!");
    }
    updateLocalCollectionCache("education", id, data);
    closeModal();
    loadEducation();
  } catch (err) {
    console.error("Save education error:", err);
    updateLocalCollectionCache("education", id, data);
    showToast("Pendidikan tersimpan di browser lokal!", "info");
    closeModal();
    loadEducation();
  }
};

// ─── EXPERIENCE ─────────────────────────────────────────────────
export async function loadExperience() {
  renderSkeleton("exp-tbody", 3, 4);
  const items = await fetchCollection("experience", "order");
  const tbody = document.getElementById("exp-tbody");
  if (!items.length) { tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="briefcase-outline"></ion-icon><p>Belum ada pengalaman kerja.</p></div></td></tr>`; return; }
  tbody.innerHTML = items.map(e => `
    <tr>
      <td class="cell-bold">${e.position||"—"} ${e._isDefault ? '<span class="pill pill-warning" style="font-size:10px;margin-left:4px;">Bawaan</span>' : ''}</td>
      <td>${e.company||"—"}</td>
      <td>${e.period||"—"}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="adminEditExp('${e.id}')" title="Edit"><ion-icon name="create-outline"></ion-icon></button>
          <button class="btn-icon delete" onclick="adminDeleteExp('${e.id}','${e.position}')" title="Hapus"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
      </td>
    </tr>`).join("");
}

window.adminEditExp = async (id) => {
  const items = await fetchCollection("experience");
  const e = items.find(x => x.id === id) || {};
  openModal("Edit Pengalaman", expForm(e), `
    <button class="btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn-primary" onclick="adminSaveExp('${id}')"><ion-icon name="save-outline"></ion-icon>Simpan</button>
  `);
};

window.adminDeleteExp = async (id, name) => {
  const ok = await confirmDelete(`Hapus pengalaman "<strong>${name}</strong>"?`);
  if (!ok) return;
  try {
    if (id && !id.startsWith("default_")) {
      await deleteDocument("experience", id);
    }
    updateLocalCollectionCache("experience", id, null, true);
    showToast("Pengalaman dihapus.");
    loadExperience();
  } catch (err) {
    updateLocalCollectionCache("experience", id, null, true);
    showToast("Pengalaman dihapus dari cache lokal.");
    loadExperience();
  }
};

window.adminSaveExp = async (id) => {
  const data = {
    position:    document.getElementById("exp-position")?.value || "",
    company:     document.getElementById("exp-company")?.value  || "",
    period:      document.getElementById("exp-period")?.value   || "",
    description: document.getElementById("exp-desc")?.value     || "",
    order:       parseInt(document.getElementById("exp-order")?.value) || 0,
  };
  try {
    if (id && !id.startsWith("default_")) {
      await updateDocument("experience", id, data);
      showToast("Pengalaman diperbarui di Cloud & Website!");
    } else {
      await addDocument("experience", data);
      showToast("Pengalaman ditambahkan ke Cloud & Website!");
    }
    updateLocalCollectionCache("experience", id, data);
    closeModal();
    loadExperience();
  } catch (err) {
    console.error("Save experience error:", err);
    updateLocalCollectionCache("experience", id, data);
    showToast("Pengalaman tersimpan di browser lokal!", "info");
    closeModal();
    loadExperience();
  }
};

function expForm(e = {}) {
  return `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Posisi <span class="required">*</span></label>
        <input id="exp-position" class="form-control" value="${e.position||""}" placeholder="Web Developer"></div>
      <div class="form-group"><label class="form-label">Perusahaan</label>
        <input id="exp-company" class="form-control" value="${e.company||""}" placeholder="PT. Example"></div>
      <div class="form-group"><label class="form-label">Periode</label>
        <input id="exp-period" class="form-control" value="${e.period||""}" placeholder="2021 — Present"></div>
      <div class="form-group"><label class="form-label">Urutan</label>
        <input id="exp-order" class="form-control" type="number" value="${e.order||0}"></div>
      <div class="form-group full"><label class="form-label">Deskripsi</label>
        <textarea id="exp-desc" class="form-control" rows="3">${e.description||""}</textarea></div>
    </div>`;
}

// ─── PROJECTS ────────────────────────────────────────────────────
export async function loadProjects() {
  renderSkeleton("projects-tbody", 5, 5);
  const items = await fetchCollection("projects", "order");
  cachedProjects = items;
  renderProjectsTable(items);
}

function renderProjectsTable(items) {
  const tbody = document.getElementById("projects-tbody");
  if (!tbody) return;
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><ion-icon name="folder-open-outline"></ion-icon><p>Belum ada proyek.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(p => `
    <tr>
      <td>${p.imageUrl ? `<img class="table-img" src="${p.imageUrl}" alt="${p.title}" onerror="this.src='./assets/images/project-1.jpg'">` : `<div class="table-img" style="background:var(--bg-card-2);display:grid;place-items:center;"><ion-icon name="image-outline" style="color:var(--text-muted)"></ion-icon></div>`}</td>
      <td class="cell-bold">${p.title||"—"} ${p._isDefault ? '<span class="pill pill-warning" style="font-size:10px;margin-left:4px;">Bawaan</span>' : ''}</td>
      <td><span class="pill pill-info">${p.category||"—"}</span></td>
      <td>${p.projectUrl ? `<a href="${p.projectUrl}" target="_blank" style="color:var(--accent);font-size:12px;">${p.projectUrl.substring(0,30)}...</a>` : "—"}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="adminEditProject('${p.id}')" title="Edit"><ion-icon name="create-outline"></ion-icon></button>
          <button class="btn-icon delete" onclick="adminDeleteProject('${p.id}','${p.title}')" title="Hapus"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
      </td>
    </tr>`).join("");
}

window.filterProjectsTable = function(query) {
  const q = (query || "").toLowerCase().trim();
  const filtered = cachedProjects.filter(p =>
    (p.title || "").toLowerCase().includes(q) ||
    (p.category || "").toLowerCase().includes(q)
  );
  renderProjectsTable(filtered);
};

window.adminEditProject = async (id) => {
  const p = cachedProjects.find(x => x.id === id) || (await fetchCollection("projects")).find(x => x.id === id);
  if (!p) return;
  openModal("Edit Proyek", projectForm(p), `
    <button class="btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn-primary" onclick="adminSaveProject('${id}')"><ion-icon name="save-outline"></ion-icon>Simpan</button>
  `);
};

window.adminDeleteProject = async (id, title) => {
  const ok = await confirmDelete(`Hapus proyek "<strong>${title}</strong>"?`);
  if (!ok) return;
  try {
    if (id && !id.startsWith("default_")) {
      await deleteDocument("projects", id);
    }
    updateLocalCollectionCache("projects", id, null, true);
    showToast("Proyek dihapus.");
    loadProjects();
  } catch (err) {
    updateLocalCollectionCache("projects", id, null, true);
    showToast("Proyek dihapus dari cache lokal.");
    loadProjects();
  }
};

window.adminSaveProject = async (id) => {
  const data = {
    title:       document.getElementById("prj-title")?.value.trim()    || "",
    category:    document.getElementById("prj-category")?.value.trim() || "",
    imageUrl:    document.getElementById("prj-img")?.value.trim()      || "",
    projectUrl:  document.getElementById("prj-url")?.value.trim()      || "",
    description: document.getElementById("prj-desc")?.value.trim()     || "",
    order:       parseInt(document.getElementById("prj-order")?.value) || 0,
  };
  try {
    if (id && !id.startsWith("default_")) {
      await updateDocument("projects", id, data);
      showToast("Proyek diperbarui di Cloud & Website!");
    } else {
      await addDocument("projects", data);
      showToast("Proyek ditambahkan ke Cloud & Website!");
    }
    updateLocalCollectionCache("projects", id, data);
    closeModal();
    loadProjects();
  } catch (err) {
    console.error("Save project error:", err);
    updateLocalCollectionCache("projects", id, data);
    showToast("Proyek tersimpan di browser lokal!", "info");
    closeModal();
    loadProjects();
  }
};

function projectForm(p = {}) {
  const cats = ["Web Design","Web Development","Applications","Other"];
  return `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Judul <span class="required">*</span></label>
        <input id="prj-title" class="form-control" value="${p.title||""}" placeholder="Finance Dashboard"></div>
      <div class="form-group"><label class="form-label">Kategori</label>
        <select id="prj-category" class="form-control">
          ${cats.map(c => `<option value="${c.toLowerCase()}"${(p.category||"").toLowerCase()===c.toLowerCase()?" selected":""}>${c}</option>`).join("")}
        </select>
      </div>
      <div class="form-group full">
        <label class="form-label">Gambar Proyek</label>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap;">
          <input type="file" id="prj-file" accept="image/*" style="display:none;" onchange="handleProjectFileUpload(this)">
          <button type="button" class="btn-secondary" onclick="document.getElementById('prj-file').click()" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;font-size:12px;border-radius:8px;background:var(--bg-card-2);border:1px solid var(--glass-border);color:var(--text-primary);cursor:pointer;font-weight:500;">
            <ion-icon name="cloud-upload-outline" style="font-size:16px;color:var(--accent);"></ion-icon>
            <span>Upload Gambar dari Perangkat</span>
          </button>
          <span id="prj-file-name" style="font-size:12px;color:var(--text-muted);">Pilih file (JPG, PNG, WebP)</span>
        </div>
        <input id="prj-img" class="form-control" value="${p.imageUrl||""}" placeholder="Atau masukkan URL gambar..." oninput="updateModalImgPreview(this.value)">
        <div class="img-preview-box" id="modal-img-preview" style="margin-top:8px;">
          ${p.imageUrl ? `<img src="${p.imageUrl}" alt="Preview" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
          <span class="placeholder-text" ${p.imageUrl ? 'style="display:none;"' : ''}><ion-icon name="image-outline"></ion-icon> Pratinjau Gambar</span>
        </div>
      </div>
      <div class="form-group full"><label class="form-label">Deskripsi Proyek</label>
        <textarea id="prj-desc" class="form-control" rows="2" placeholder="Deskripsi singkat proyek...">${p.description||""}</textarea></div>
      <div class="form-group"><label class="form-label">URL Proyek / GitHub</label>
        <input id="prj-url" class="form-control" value="${p.projectUrl||""}" placeholder="https://github.com/..."></div>
      <div class="form-group"><label class="form-label">Urutan</label>
        <input id="prj-order" class="form-control" type="number" value="${p.order||0}"></div>
    </div>`;
}

// ─── BLOG ────────────────────────────────────────────────────────
export async function loadBlog() {
  renderSkeleton("blog-tbody", 4, 5);
  const items = await fetchCollection("blog", "date");
  cachedBlog = items;
  renderBlogTable(items);
}

function renderBlogTable(items) {
  const tbody = document.getElementById("blog-tbody");
  if (!tbody) return;
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><ion-icon name="newspaper-outline"></ion-icon><p>Belum ada artikel blog.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(b => `
    <tr>
      <td class="cell-bold">${b.title||"—"} ${b._isDefault ? '<span class="pill pill-warning" style="font-size:10px;margin-left:4px;">Bawaan</span>' : ''}</td>
      <td><span class="pill pill-info">${b.category||"—"}</span></td>
      <td class="cell-muted">${b.date||"—"}</td>
      <td>${b.excerpt ? b.excerpt.substring(0,50)+"..." : "—"}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="adminEditBlog('${b.id}')" title="Edit"><ion-icon name="create-outline"></ion-icon></button>
          <button class="btn-icon delete" onclick="adminDeleteBlog('${b.id}','${b.title}')" title="Hapus"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
      </td>
    </tr>`).join("");
}

window.filterBlogTable = function(query) {
  const q = (query || "").toLowerCase().trim();
  const filtered = cachedBlog.filter(b =>
    (b.title || "").toLowerCase().includes(q) ||
    (b.category || "").toLowerCase().includes(q)
  );
  renderBlogTable(filtered);
};

window.adminEditBlog = async (id) => {
  const b = cachedBlog.find(x => x.id === id) || (await fetchCollection("blog")).find(x => x.id === id);
  if (!b) return;
  openModal("Edit Artikel Blog", blogForm(b), `
    <button class="btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn-primary" onclick="adminSaveBlog('${id}')"><ion-icon name="save-outline"></ion-icon>Simpan</button>
  `);
};

window.adminDeleteBlog = async (id, title) => {
  const ok = await confirmDelete(`Hapus artikel "<strong>${title}</strong>"?`);
  if (!ok) return;
  try {
    if (id && !id.startsWith("default_")) {
      await deleteDocument("blog", id);
    }
    updateLocalCollectionCache("blog", id, null, true);
    showToast("Artikel dihapus.");
    loadBlog();
  } catch (err) {
    updateLocalCollectionCache("blog", id, null, true);
    showToast("Artikel dihapus dari cache lokal.");
    loadBlog();
  }
};

window.adminSaveBlog = async (id) => {
  const data = {
    title:    document.getElementById("blg-title")?.value.trim()    || "",
    category: document.getElementById("blg-category")?.value.trim() || "",
    date:     document.getElementById("blg-date")?.value            || "",
    excerpt:  document.getElementById("blg-excerpt")?.value.trim()  || "",
    imageUrl: document.getElementById("blg-img")?.value.trim()      || "",
    url:      document.getElementById("blg-url")?.value.trim()      || "",
  };
  try {
    if (id && !id.startsWith("default_")) {
      await updateDocument("blog", id, data);
      showToast("Artikel diperbarui di Cloud & Website!");
    } else {
      await addDocument("blog", data);
      showToast("Artikel ditambahkan ke Cloud & Website!");
    }
    updateLocalCollectionCache("blog", id, data);
    closeModal();
    loadBlog();
  } catch (err) {
    console.error("Save blog error:", err);
    updateLocalCollectionCache("blog", id, data);
    showToast("Artikel tersimpan di browser lokal!", "info");
    closeModal();
    loadBlog();
  }
};

function blogForm(b = {}) {
  return `
    <div class="form-grid">
      <div class="form-group full"><label class="form-label">Judul <span class="required">*</span></label>
        <input id="blg-title" class="form-control" value="${b.title||""}" placeholder="Design Trends 2025"></div>
      <div class="form-group"><label class="form-label">Kategori</label>
        <input id="blg-category" class="form-control" value="${b.category||""}" placeholder="Design"></div>
      <div class="form-group"><label class="form-label">Tanggal</label>
        <input id="blg-date" class="form-control" type="date" value="${b.date||""}"></div>
      <div class="form-group full">
        <label class="form-label">URL Gambar Cover</label>
        <input id="blg-img" class="form-control" value="${b.imageUrl||""}" placeholder="https://..." oninput="updateModalImgPreview(this.value)">
        <div class="img-preview-box" id="modal-img-preview">
          ${b.imageUrl ? `<img src="${b.imageUrl}" alt="Preview" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
          <span class="placeholder-text" ${b.imageUrl ? 'style="display:none;"' : ''}><ion-icon name="image-outline"></ion-icon> Pratinjau Cover</span>
        </div>
      </div>
      <div class="form-group full"><label class="form-label">Kutipan (Excerpt)</label>
        <textarea id="blg-excerpt" class="form-control" rows="3">${b.excerpt||""}</textarea></div>
      <div class="form-group full"><label class="form-label">URL Artikel / Sumber</label>
        <input id="blg-url" class="form-control" value="${b.url||""}" placeholder="https://..."></div>
    </div>`;
}

// ─── TESTIMONIALS ────────────────────────────────────────────────
export async function loadTestimonials() {
  renderSkeleton("test-tbody", 3, 4);
  const items = await fetchCollection("testimonials");
  const tbody = document.getElementById("test-tbody");
  if (!items.length) { tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="chatbubble-ellipses-outline"></ion-icon><p>Belum ada testimoni.</p></div></td></tr>`; return; }
  tbody.innerHTML = items.map(t => `
    <tr>
      <td class="cell-bold">${t.name||"—"} ${t._isDefault ? '<span class="pill pill-warning" style="font-size:10px;margin-left:4px;">Bawaan</span>' : ''}</td>
      <td class="cell-muted">${t.date||"—"}</td>
      <td>${t.text ? t.text.substring(0,60)+"..." : "—"}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="adminEditTest('${t.id}')" title="Edit"><ion-icon name="create-outline"></ion-icon></button>
          <button class="btn-icon delete" onclick="adminDeleteTest('${t.id}','${t.name}')" title="Hapus"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
      </td>
    </tr>`).join("");
}

window.adminEditTest = async (id) => {
  const items = await fetchCollection("testimonials");
  const t = items.find(x => x.id === id) || {};
  openModal("Edit Testimoni", testForm(t), `
    <button class="btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn-primary" onclick="adminSaveTest('${id}')"><ion-icon name="save-outline"></ion-icon>Simpan</button>
  `);
};

window.adminDeleteTest = async (id, name) => {
  const ok = await confirmDelete(`Hapus testimoni dari "<strong>${name}</strong>"?`);
  if (!ok) return;
  try {
    if (id && !id.startsWith("default_")) {
      await deleteDocument("testimonials", id);
    }
    updateLocalCollectionCache("testimonials", id, null, true);
    showToast("Testimoni dihapus.");
    loadTestimonials();
  } catch (err) {
    updateLocalCollectionCache("testimonials", id, null, true);
    showToast("Testimoni dihapus dari cache lokal.");
    loadTestimonials();
  }
};

window.adminSaveTest = async (id) => {
  const data = {
    name:      document.getElementById("tst-name")?.value.trim()   || "",
    date:      document.getElementById("tst-date")?.value          || "",
    avatarUrl: document.getElementById("tst-avatar")?.value.trim() || "",
    text:      document.getElementById("tst-text")?.value.trim()   || "",
  };
  try {
    if (id && !id.startsWith("default_")) {
      await updateDocument("testimonials", id, data);
      showToast("Testimoni diperbarui di Cloud & Website!");
    } else {
      await addDocument("testimonials", data);
      showToast("Testimoni ditambahkan ke Cloud & Website!");
    }
    updateLocalCollectionCache("testimonials", id, data);
    closeModal();
    loadTestimonials();
  } catch (err) {
    console.error("Save testimonial error:", err);
    updateLocalCollectionCache("testimonials", id, data);
    showToast("Testimoni tersimpan di browser lokal!", "info");
    closeModal();
    loadTestimonials();
  }
};

function testForm(t = {}) {
  return `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Nama <span class="required">*</span></label>
        <input id="tst-name" class="form-control" value="${t.name||""}" placeholder="John Doe"></div>
      <div class="form-group"><label class="form-label">Tanggal</label>
        <input id="tst-date" class="form-control" type="date" value="${t.date||""}"></div>
      <div class="form-group full"><label class="form-label">URL Foto Avatar</label>
        <input id="tst-avatar" class="form-control" value="${t.avatarUrl||""}" placeholder="./assets/images/avatar-1.png"></div>
      <div class="form-group full"><label class="form-label">Teks Testimoni</label>
        <textarea id="tst-text" class="form-control" rows="4">${t.text||""}</textarea></div>
    </div>`;
}

// ─── MESSAGES ──────────────────────────────────────────────────
export async function loadMessages() {
  renderSkeleton("msg-tbody", 4, 4);
  const items = await fetchCollection("messages");
  cachedMessages = items;
  renderMessagesTable();
}

function renderMessagesTable() {
  const tbody = document.getElementById("msg-tbody");
  const query = (document.getElementById("msg-search-input")?.value || "").toLowerCase().trim();
  if (!tbody) return;

  let items = cachedMessages;

  // Filter by tab
  if (currentMsgTab === "unread") {
    items = items.filter(m => !m.read);
  } else if (currentMsgTab === "read") {
    items = items.filter(m => m.read === true);
  }

  // Filter by query
  if (query) {
    items = items.filter(m =>
      (m.fullname || "").toLowerCase().includes(query) ||
      (m.email || "").toLowerCase().includes(query) ||
      (m.message || "").toLowerCase().includes(query)
    );
  }

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="mail-outline"></ion-icon><p>Tidak ada pesan yang cocok.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(m => `
    <tr style="${!m.read ? 'background:hsla(var(--c-blue) 91% 62% / 0.05);font-weight:600;' : ''}">
      <td class="cell-bold">
        ${!m.read ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-right:6px;"></span>' : ''}
        ${m.fullname||"—"}
      </td>
      <td>${m.email||"—"}</td>
      <td>${m.message ? m.message.substring(0,70)+"..." : "—"}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon" onclick="adminViewMsg('${m.id}')" title="Lihat"><ion-icon name="eye-outline"></ion-icon></button>
          <button class="btn-icon delete" onclick="adminDeleteMsg('${m.id}','${m.fullname}')" title="Hapus"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
      </td>
    </tr>`).join("");
}

window.filterMessagesTable = function() {
  renderMessagesTable();
};

window.filterMessagesByTab = function(tab, btn) {
  currentMsgTab = tab;
  document.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
  btn?.classList.add("active");
  renderMessagesTable();
};

window.adminViewMsg = async (id) => {
  const m = cachedMessages.find(x => x.id === id);
  if (!m) return;

  // Mark as read in Firestore
  if (!m.read) {
    try {
      await updateDoc(doc(db, "messages", id), { read: true });
      m.read = true;
      renderMessagesTable();
    } catch {}
  }

  openModal("Pesan dari " + m.fullname, `
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-card-2);padding:12px 16px;border-radius:var(--radius-md);border:1px solid var(--glass-border);">
        <div>
          <div style="font-size:12px;color:var(--text-muted);">Pengirim</div>
          <div style="font-size:14px;font-weight:600;color:var(--text-primary);margin-top:2px;">${m.fullname}</div>
        </div>
        <div>
          <a href="mailto:${m.email}?subject=Balasan Portofolio" class="btn-primary" style="padding:7px 14px;font-size:12px;">
            <ion-icon name="mail-outline"></ion-icon> Balas Email
          </a>
        </div>
      </div>
      <div>
        <p class="form-label">Email Pengirim</p>
        <p style="color:var(--accent);margin-top:4px;font-size:14px;"><a href="mailto:${m.email}">${m.email}</a></p>
      </div>
      <div>
        <p class="form-label">Isi Pesan Lengkap</p>
        <div style="color:var(--text-secondary);margin-top:6px;line-height:1.7;background:var(--bg-card-2);padding:14px;border-radius:var(--radius-md);border:1px solid var(--glass-border);white-space:pre-wrap;font-size:13.5px;">${m.message}</div>
      </div>
    </div>
  `, `<button class="btn-ghost" onclick="closeModal()">Tutup</button>`);
};

window.adminDeleteMsg = async (id, name) => {
  const ok = await confirmDelete(`Hapus pesan dari "<strong>${name}</strong>"?`);
  if (!ok) return;
  await deleteDocument("messages", id);
  showToast("Pesan dihapus.");
  loadMessages();
  loadDashboardStats();
};

// ─── Shared Timeline Form (Education) ──────────────────────────
function timelineForm(e = {}, prefix = "edu") {
  return `
    <div class="form-grid">
      <div class="form-group full"><label class="form-label">Institusi <span class="required">*</span></label>
        <input id="${prefix}-institution" class="form-control" value="${e.institution||""}" placeholder="Universitas Contoh"></div>
      <div class="form-group"><label class="form-label">Periode</label>
        <input id="${prefix}-period" class="form-control" value="${e.period||""}" placeholder="2019 — 2023"></div>
      <div class="form-group"><label class="form-label">Urutan</label>
        <input id="${prefix}-order" class="form-control" type="number" value="${e.order||0}"></div>
      <div class="form-group full"><label class="form-label">Deskripsi</label>
        <textarea id="${prefix}-desc" class="form-control" rows="3">${e.description||""}</textarea></div>
    </div>`;
}

function getTimelineFormData(prefix) {
  return {
    institution: document.getElementById(`${prefix}-institution`)?.value || "",
    period:      document.getElementById(`${prefix}-period`)?.value      || "",
    description: document.getElementById(`${prefix}-desc`)?.value        || "",
    order:       parseInt(document.getElementById(`${prefix}-order`)?.value) || 0,
  };
}

// ─── Add Button Dispatchers (Global) ────────────────────────────
window.adminAddNew = function(section) {
  const fnMap = {
    service:     () => { openModal("Tambah Layanan",  serviceForm(),  `<button class="btn-ghost" onclick="closeModal()">Batal</button><button class="btn-primary" onclick="adminSaveService(null)"><ion-icon name="add-outline"></ion-icon>Tambah</button>`); },
    skill:       () => { openModal("Tambah Skill",    skillForm(),    `<button class="btn-ghost" onclick="closeModal()">Batal</button><button class="btn-primary" onclick="adminSaveSkill(null)"><ion-icon name="add-outline"></ion-icon>Tambah</button>`); bindRangeInput(); },
    education:   () => { openModal("Tambah Pendidikan", timelineForm({}, "edu"), `<button class="btn-ghost" onclick="closeModal()">Batal</button><button class="btn-primary" onclick="adminSaveEdu(null)"><ion-icon name="add-outline"></ion-icon>Tambah</button>`); },
    experience:  () => { openModal("Tambah Pengalaman", expForm(),   `<button class="btn-ghost" onclick="closeModal()">Batal</button><button class="btn-primary" onclick="adminSaveExp(null)"><ion-icon name="add-outline"></ion-icon>Tambah</button>`); },
    project:     () => { openModal("Tambah Proyek",   projectForm(), `<button class="btn-ghost" onclick="closeModal()">Batal</button><button class="btn-primary" onclick="adminSaveProject(null)"><ion-icon name="add-outline"></ion-icon>Tambah</button>`); },
    blog:        () => { openModal("Tambah Artikel",  blogForm(),    `<button class="btn-ghost" onclick="closeModal()">Batal</button><button class="btn-primary" onclick="adminSaveBlog(null)"><ion-icon name="add-outline"></ion-icon>Tambah</button>`); },
    testimonial: () => { openModal("Tambah Testimoni", testForm(),   `<button class="btn-ghost" onclick="closeModal()">Batal</button><button class="btn-primary" onclick="adminSaveTest(null)"><ion-icon name="add-outline"></ion-icon>Tambah</button>`); },
  };
  fnMap[section]?.();
};

// ════════════════════════════════════════════════════════════════
// ──  DATABASE SEED & BACKUP (EXPORT / IMPORT JSON)  ─────────────
// ════════════════════════════════════════════════════════════════

// 1. Seed Demo Data to Firestore
window.adminSeedData = async function() {
  const ok = await confirmDelete(
    "Sinkronkan semua data portofolio bawaan ke Cloud Firestore?<br><br>Ini akan menyimpan profil, layanan, skills, pendidikan, pengalaman, proyek, dan artikel blog ke database cloud Anda agar sinkron sempurna dengan tampilan pengguna."
  );
  if (!ok) return;

  const btn = document.getElementById("seed-data-btn");
  const quickBtn = document.getElementById("quick-sync-btn");
  if (btn) btn.disabled = true;
  if (quickBtn) quickBtn.disabled = true;

  showToast("Sedang menyinkronkan data ke Cloud Firestore...", "info");

  try {
    // 1. Profile
    await setDoc(doc(db, "profile", "main"), { ...DEFAULT_DATA.profile, updatedAt: serverTimestamp() }, { merge: true });
    localStorage.setItem("portfolio_cache_profile", JSON.stringify(DEFAULT_DATA.profile));

    // Helper to seed a collection
    const seedColl = async (collName, items) => {
      const existing = await getDocs(collection(db, collName));
      if (existing.empty) {
        for (const item of items) {
          const { id, _isDefault, ...cleanItem } = item;
          await addDoc(collection(db, collName), { ...cleanItem, createdAt: serverTimestamp() });
        }
      }
      localStorage.setItem(`portfolio_cache_${collName}`, JSON.stringify(items));
    };

    await seedColl("services", DEFAULT_DATA.services);
    await seedColl("testimonials", DEFAULT_DATA.testimonials);
    await seedColl("skills", DEFAULT_DATA.skills);
    await seedColl("education", DEFAULT_DATA.education);
    await seedColl("experience", DEFAULT_DATA.experience);
    await seedColl("projects", DEFAULT_DATA.projects);
    await seedColl("blog", DEFAULT_DATA.blog);

    showToast("Semua data berhasil disinkronkan ke Cloud Firestore & Tampilan Pengguna! 🚀", "success");
    await loadDashboardStats();

    const activeSec = document.querySelector(".nav-link.active")?.getAttribute("data-section") || "dashboard";
    const refreshMap = {
      services: loadServices,
      skills: loadSkills,
      education: loadEducation,
      experience: loadExperience,
      projects: loadProjects,
      blog: loadBlog,
      testimonials: loadTestimonials,
      profile: loadProfile
    };
    refreshMap[activeSec]?.();

  } catch (err) {
    console.error("Seed error:", err);
    showToast("Gagal menyinkronkan: " + err.message, "error");
  } finally {
    if (btn) btn.disabled = false;
    if (quickBtn) quickBtn.disabled = false;
  }
};

// 2. Export All Firestore Data as JSON
window.adminExportData = async function() {
  showToast("Menyiapkan berkas cadangan data...", "info");
  try {
    const colls = ["services", "skills", "education", "experience", "projects", "blog", "testimonials", "messages"];
    const backup = {
      exportDate: new Date().toISOString(),
      profile: await getDocumentById("profile", "main") || DEFAULT_DATA.profile,
    };

    for (const c of colls) {
      backup[c] = await fetchCollection(c);
    }

    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const dlAnchor = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", `portfolio_backup_${dateStr}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    showToast("Berkas cadangan JSON berhasil diunduh!", "success");
  } catch (err) {
    console.error("Export error:", err);
    showToast("Gagal mengekspor data: " + err.message, "error");
  }
};

// 3. Import JSON Backup File
window.adminImportData = function(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data) throw new Error("Format JSON tidak valid");

      const ok = await confirmDelete(
        `Impor data dari berkas <strong>${file.name}</strong>?<br>Data yang ada akan ditambahkan dan profil akan diperbarui.`
      );
      if (!ok) return;

      showToast("Sedang memulihkan data dari berkas cadangan...", "info");

      if (data.profile) {
        await setDoc(doc(db, "profile", "main"), { ...data.profile, updatedAt: serverTimestamp() });
      }

      const colls = ["services", "skills", "education", "experience", "projects", "blog", "testimonials"];
      for (const c of colls) {
        if (Array.isArray(data[c])) {
          for (const item of data[c]) {
            const { id, createdAt, updatedAt, ...cleanItem } = item;
            await addDoc(collection(db, c), { ...cleanItem, createdAt: serverTimestamp() });
          }
        }
      }

      showToast("Data cadangan berhasil dipulihkan! 🎉", "success");
      loadDashboardStats();
    } catch (err) {
      console.error("Import error:", err);
      showToast("Gagal mengimpor berkas: " + err.message, "error");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
};

// Global exports
window.closeModal = closeModal;

window.handleProjectFileUpload = async function(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const status = document.getElementById("prj-file-name");
  if (status) status.textContent = `Memproses: ${file.name}...`;
  try {
    const compressedBase64 = await (window.compressImage ? window.compressImage(file, 900, 0.85) : readFileAsBase64(file));
    const urlInput = document.getElementById("prj-img");
    if (urlInput) {
      urlInput.value = compressedBase64;
      window.updateModalImgPreview(compressedBase64);
    }
    if (status) status.textContent = `✓ Gambar siap: ${file.name}`;
  } catch (err) {
    console.error("Gagal membaca gambar proyek:", err);
    if (status) status.textContent = "Gagal memproses gambar.";
  }
};
