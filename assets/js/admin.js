/**
 * admin.js
 * Logika utama Admin Dashboard CMS.
 * Handles: CRUD ke Firestore, render tabel, open/close modal, toast, dll.
 */

import { db } from "./firebase-config.js";
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

// ─── Toast Notification System ─────────────────────────────────
const toastContainer = document.getElementById("toast-container");

export function showToast(message, type = "success") {
  const icons = { success: "checkmark-circle-outline", error: "alert-circle-outline", info: "information-circle-outline" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<ion-icon name="${icons[type]}"></ion-icon><span>${message}</span>`;
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

document.getElementById("modal-close-btn").addEventListener("click", closeModal);

// ─── Confirm Delete Modal ───────────────────────────────────────
export function confirmDelete(message) {
  return new Promise((resolve) => {
    openModal(
      "Konfirmasi Hapus",
      `<p style="color:var(--text-secondary);font-size:14px;">${message}</p>`,
      `<button class="btn-ghost" id="cancel-delete">Batal</button>
       <button class="btn-danger" id="confirm-delete-btn"><ion-icon name="trash-outline"></ion-icon>Hapus</button>`
    );
    setTimeout(() => {
      document.getElementById("cancel-delete").onclick      = () => { closeModal(); resolve(false); };
      document.getElementById("confirm-delete-btn").onclick = () => { closeModal(); resolve(true); };
    }, 50);
  });
}

// ─── Generic Firestore Helpers ──────────────────────────────────
export async function fetchCollection(collName, orderField = null) {
  const ref = orderField
    ? query(collection(db, collName), orderBy(orderField))
    : collection(db, collName);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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

// For singleton docs like "profile"
export async function getDocumentById(collName, id) {
  const snap = await getDoc(doc(db, collName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function setDocument(collName, id, data) {
  return setDoc(doc(db, collName, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Loading skeleton helper ────────────────────────────────────
export function renderSkeleton(containerId, rows = 4, cols = 3) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array.from({ length: rows }).map(() =>
    `<tr>${Array.from({ length: cols }).map(() =>
      `<td><div class="skeleton" style="height:18px;width:80%;border-radius:4px;"></div></td>`
    ).join("")}</tr>`
  ).join("");
}

// ─── Stats on dashboard ─────────────────────────────────────────
export async function loadDashboardStats() {
  const collections = ["projects", "skills", "blog", "messages"];
  const ids         = ["stat-projects", "stat-skills", "stat-blog", "stat-messages"];
  await Promise.all(collections.map(async (c, i) => {
    try {
      const snap = await getDocs(collection(db, c));
      const el = document.getElementById(ids[i]);
      if (el) el.textContent = snap.size;
    } catch {}
  }));
}

// ════════════════════════════════════════════════════════════════
// ──  SECTION RENDERERS  ─────────────────────────────────────────
// ════════════════════════════════════════════════════════════════

// ─── PROFILE (singleton doc: profile/main) ──────────────────────
export async function loadProfile() {
  const data = await getDocumentById("profile", "main");
  if (!data) return;
  const fields = ["name","title","bio","email","phone","birthday","location","avatarUrl","social_facebook","social_twitter","social_instagram"];
  fields.forEach(f => {
    const el = document.getElementById(`profile-${f}`);
    if (el && data[f] !== undefined) el.value = data[f] || "";
  });
}

export async function saveProfile() {
  const fields = ["name","title","bio","email","phone","birthday","location","avatarUrl","social_facebook","social_twitter","social_instagram"];
  const data = {};
  fields.forEach(f => {
    const el = document.getElementById(`profile-${f}`);
    if (el) data[f] = el.value;
  });
  await setDocument("profile", "main", data);
  showToast("Profil berhasil disimpan!");
}

// ─── SERVICES ───────────────────────────────────────────────────
export async function loadServices() {
  renderSkeleton("services-tbody", 3, 4);
  const items = await fetchCollection("services", "order");
  const tbody = document.getElementById("services-tbody");
  if (!items.length) { tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="construct-outline"></ion-icon><p>Belum ada layanan. Tambahkan yang pertama!</p></div></td></tr>`; return; }
  tbody.innerHTML = items.map(s => `
    <tr>
      <td class="cell-bold">${s.title || "—"}</td>
      <td>${s.description ? s.description.substring(0,60)+"..." : "—"}</td>
      <td><span class="pill pill-accent">${s.order ?? "—"}</span></td>
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
  await deleteDocument("services", id);
  showToast("Layanan dihapus.");
  loadServices();
};

window.adminSaveService = async (id) => {
  const data = getServiceFormData();
  if (id) { await updateDocument("services", id, data); showToast("Layanan diperbarui!"); }
  else     { await addDocument("services", data);       showToast("Layanan ditambahkan!"); }
  closeModal(); loadServices();
};

function serviceForm(s = {}) {
  return `
    <div class="form-grid">
      <div class="form-group full"><label class="form-label">Judul <span class="required">*</span></label>
        <input id="svc-title" class="form-control" value="${s.title||""}" placeholder="Web Design"></div>
      <div class="form-group full"><label class="form-label">Deskripsi</label>
        <textarea id="svc-desc" class="form-control">${s.description||""}</textarea></div>
      <div class="form-group"><label class="form-label">URL Icon (SVG/IMG)</label>
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
  const tbody = document.getElementById("skills-tbody");
  if (!items.length) { tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="bar-chart-outline"></ion-icon><p>Belum ada skill.</p></div></td></tr>`; return; }
  tbody.innerHTML = items.map(s => `
    <tr>
      <td class="cell-bold">${s.name||"—"}</td>
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

window.adminEditSkill = async (id) => {
  const items = await fetchCollection("skills");
  const s = items.find(x => x.id === id);
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
  await deleteDocument("skills", id);
  showToast("Skill dihapus."); loadSkills();
};

window.adminSaveSkill = async (id) => {
  const data = getSkillFormData();
  if (id) { await updateDocument("skills", id, data); showToast("Skill diperbarui!"); }
  else     { await addDocument("skills", data);       showToast("Skill ditambahkan!"); }
  closeModal(); loadSkills();
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
      <td class="cell-bold">${e.institution||"—"}</td>
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
  await deleteDocument("education", id); showToast("Dihapus."); loadEducation();
};

window.adminSaveEdu = async (id) => {
  const data = getTimelineFormData("edu");
  if (id) { await updateDocument("education", id, data); showToast("Pendidikan diperbarui!"); }
  else     { await addDocument("education", data);       showToast("Pendidikan ditambahkan!"); }
  closeModal(); loadEducation();
};

// ─── EXPERIENCE ─────────────────────────────────────────────────
export async function loadExperience() {
  renderSkeleton("exp-tbody", 3, 4);
  const items = await fetchCollection("experience", "order");
  const tbody = document.getElementById("exp-tbody");
  if (!items.length) { tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="briefcase-outline"></ion-icon><p>Belum ada pengalaman kerja.</p></div></td></tr>`; return; }
  tbody.innerHTML = items.map(e => `
    <tr>
      <td class="cell-bold">${e.position||"—"}</td>
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
  await deleteDocument("experience", id); showToast("Dihapus."); loadExperience();
};

window.adminSaveExp = async (id) => {
  const data = {
    position:    document.getElementById("exp-position")?.value || "",
    company:     document.getElementById("exp-company")?.value  || "",
    period:      document.getElementById("exp-period")?.value   || "",
    description: document.getElementById("exp-desc")?.value     || "",
    order:       parseInt(document.getElementById("exp-order")?.value) || 0,
  };
  if (id) { await updateDocument("experience", id, data); showToast("Pengalaman diperbarui!"); }
  else     { await addDocument("experience", data);       showToast("Pengalaman ditambahkan!"); }
  closeModal(); loadExperience();
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
        <textarea id="exp-desc" class="form-control">${e.description||""}</textarea></div>
    </div>`;
}

// ─── PROJECTS ────────────────────────────────────────────────────
export async function loadProjects() {
  renderSkeleton("projects-tbody", 5, 5);
  const items = await fetchCollection("projects", "order");
  const tbody = document.getElementById("projects-tbody");
  if (!items.length) { tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><ion-icon name="folder-open-outline"></ion-icon><p>Belum ada proyek.</p></div></td></tr>`; return; }
  tbody.innerHTML = items.map(p => `
    <tr>
      <td>${p.imageUrl ? `<img class="table-img" src="${p.imageUrl}" alt="${p.title}">` : `<div class="table-img" style="background:var(--bg-card-2);display:grid;place-items:center;"><ion-icon name="image-outline" style="color:var(--text-muted)"></ion-icon></div>`}</td>
      <td class="cell-bold">${p.title||"—"}</td>
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

window.adminEditProject = async (id) => {
  const items = await fetchCollection("projects");
  const p = items.find(x => x.id === id) || {};
  openModal("Edit Proyek", projectForm(p), `
    <button class="btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn-primary" onclick="adminSaveProject('${id}')"><ion-icon name="save-outline"></ion-icon>Simpan</button>
  `);
};

window.adminDeleteProject = async (id, title) => {
  const ok = await confirmDelete(`Hapus proyek "<strong>${title}</strong>"?`);
  if (!ok) return;
  await deleteDocument("projects", id); showToast("Proyek dihapus."); loadProjects();
};

window.adminSaveProject = async (id) => {
  const data = {
    title:      document.getElementById("prj-title")?.value    || "",
    category:   document.getElementById("prj-category")?.value || "",
    imageUrl:   document.getElementById("prj-img")?.value      || "",
    projectUrl: document.getElementById("prj-url")?.value      || "",
    order:      parseInt(document.getElementById("prj-order")?.value) || 0,
  };
  if (id) { await updateDocument("projects", id, data); showToast("Proyek diperbarui!"); }
  else     { await addDocument("projects", data);       showToast("Proyek ditambahkan!"); }
  closeModal(); loadProjects();
};

function projectForm(p = {}) {
  const cats = ["Web Design","Web Development","Applications","Other"];
  return `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Judul <span class="required">*</span></label>
        <input id="prj-title" class="form-control" value="${p.title||""}" placeholder="My Project"></div>
      <div class="form-group"><label class="form-label">Kategori</label>
        <select id="prj-category" class="form-control">
          ${cats.map(c => `<option value="${c.toLowerCase()}"${(p.category||"").toLowerCase()===c.toLowerCase()?" selected":""}>${c}</option>`).join("")}
        </select>
      </div>
      <div class="form-group full"><label class="form-label">URL Gambar</label>
        <input id="prj-img" class="form-control" value="${p.imageUrl||""}" placeholder="https://...">
        <p class="form-hint">Gunakan URL gambar publik (Imgur, Cloudinary, dll.)</p></div>
      <div class="form-group"><label class="form-label">URL Proyek</label>
        <input id="prj-url" class="form-control" value="${p.projectUrl||""}" placeholder="https://github.com/..."></div>
      <div class="form-group"><label class="form-label">Urutan</label>
        <input id="prj-order" class="form-control" type="number" value="${p.order||0}"></div>
    </div>`;
}

// ─── BLOG ────────────────────────────────────────────────────────
export async function loadBlog() {
  renderSkeleton("blog-tbody", 4, 5);
  const items = await fetchCollection("blog", "date");
  const tbody = document.getElementById("blog-tbody");
  if (!items.length) { tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><ion-icon name="newspaper-outline"></ion-icon><p>Belum ada artikel blog.</p></div></td></tr>`; return; }
  tbody.innerHTML = items.map(b => `
    <tr>
      <td class="cell-bold">${b.title||"—"}</td>
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

window.adminEditBlog = async (id) => {
  const items = await fetchCollection("blog");
  const b = items.find(x => x.id === id) || {};
  openModal("Edit Artikel Blog", blogForm(b), `
    <button class="btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn-primary" onclick="adminSaveBlog('${id}')"><ion-icon name="save-outline"></ion-icon>Simpan</button>
  `);
};

window.adminDeleteBlog = async (id, title) => {
  const ok = await confirmDelete(`Hapus artikel "<strong>${title}</strong>"?`);
  if (!ok) return;
  await deleteDocument("blog", id); showToast("Artikel dihapus."); loadBlog();
};

window.adminSaveBlog = async (id) => {
  const data = {
    title:    document.getElementById("blg-title")?.value    || "",
    category: document.getElementById("blg-category")?.value || "",
    date:     document.getElementById("blg-date")?.value     || "",
    excerpt:  document.getElementById("blg-excerpt")?.value  || "",
    imageUrl: document.getElementById("blg-img")?.value      || "",
    url:      document.getElementById("blg-url")?.value      || "",
  };
  if (id) { await updateDocument("blog", id, data); showToast("Artikel diperbarui!"); }
  else     { await addDocument("blog", data);       showToast("Artikel ditambahkan!"); }
  closeModal(); loadBlog();
};

function blogForm(b = {}) {
  return `
    <div class="form-grid">
      <div class="form-group full"><label class="form-label">Judul <span class="required">*</span></label>
        <input id="blg-title" class="form-control" value="${b.title||""}" placeholder="Design Tips 2025"></div>
      <div class="form-group"><label class="form-label">Kategori</label>
        <input id="blg-category" class="form-control" value="${b.category||""}" placeholder="Design"></div>
      <div class="form-group"><label class="form-label">Tanggal</label>
        <input id="blg-date" class="form-control" type="date" value="${b.date||""}"></div>
      <div class="form-group full"><label class="form-label">URL Gambar Cover</label>
        <input id="blg-img" class="form-control" value="${b.imageUrl||""}" placeholder="https://..."></div>
      <div class="form-group full"><label class="form-label">Kutipan (Excerpt)</label>
        <textarea id="blg-excerpt" class="form-control">${b.excerpt||""}</textarea></div>
      <div class="form-group full"><label class="form-label">URL Artikel</label>
        <input id="blg-url" class="form-control" value="${b.url||""}" placeholder="https://medium.com/..."></div>
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
      <td class="cell-bold">${t.name||"—"}</td>
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
  await deleteDocument("testimonials", id); showToast("Testimoni dihapus."); loadTestimonials();
};

window.adminSaveTest = async (id) => {
  const data = {
    name:      document.getElementById("tst-name")?.value   || "",
    date:      document.getElementById("tst-date")?.value   || "",
    avatarUrl: document.getElementById("tst-avatar")?.value || "",
    text:      document.getElementById("tst-text")?.value   || "",
  };
  if (id) { await updateDocument("testimonials", id, data); showToast("Testimoni diperbarui!"); }
  else     { await addDocument("testimonials", data);       showToast("Testimoni ditambahkan!"); }
  closeModal(); loadTestimonials();
};

function testForm(t = {}) {
  return `
    <div class="form-grid">
      <div class="form-group"><label class="form-label">Nama <span class="required">*</span></label>
        <input id="tst-name" class="form-control" value="${t.name||""}" placeholder="John Doe"></div>
      <div class="form-group"><label class="form-label">Tanggal</label>
        <input id="tst-date" class="form-control" type="date" value="${t.date||""}"></div>
      <div class="form-group full"><label class="form-label">URL Foto</label>
        <input id="tst-avatar" class="form-control" value="${t.avatarUrl||""}" placeholder="https://..."></div>
      <div class="form-group full"><label class="form-label">Teks Testimoni</label>
        <textarea id="tst-text" class="form-control" rows="4">${t.text||""}</textarea></div>
    </div>`;
}

// ─── MESSAGES (read-only, soft delete) ──────────────────────────
export async function loadMessages() {
  renderSkeleton("msg-tbody", 4, 4);
  const items = await fetchCollection("messages");
  const tbody = document.getElementById("msg-tbody");
  if (!items.length) { tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><ion-icon name="mail-outline"></ion-icon><p>Belum ada pesan masuk.</p></div></td></tr>`; return; }
  tbody.innerHTML = items.map(m => `
    <tr>
      <td class="cell-bold">${m.fullname||"—"}</td>
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

window.adminViewMsg = async (id) => {
  const items = await fetchCollection("messages");
  const m = items.find(x => x.id === id);
  if (!m) return;
  openModal("Pesan dari " + m.fullname, `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div><p class="form-label">Dari</p><p style="color:var(--text-primary);margin-top:4px;">${m.fullname} — <a href="mailto:${m.email}" style="color:var(--accent)">${m.email}</a></p></div>
      <div><p class="form-label">Pesan</p><p style="color:var(--text-secondary);margin-top:4px;line-height:1.7;">${m.message}</p></div>
    </div>
  `, `<button class="btn-primary" onclick="closeModal()">Tutup</button>`);
};

window.adminDeleteMsg = async (id, name) => {
  const ok = await confirmDelete(`Hapus pesan dari "<strong>${name}</strong>"?`);
  if (!ok) return;
  await deleteDocument("messages", id); showToast("Pesan dihapus."); loadMessages();
};

// ─── Shared timeline form (Education) ──────────────────────────
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
        <textarea id="${prefix}-desc" class="form-control">${e.description||""}</textarea></div>
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

// ─── Add button dispatchers (global) ────────────────────────────
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

// Export closeModal globally too
window.closeModal = closeModal;
