/* =========================================================
   EcosiSTEM - Frontend JS (cards + popup con dataset fisso)
   Compatibile con GitHub Pages (project site) e locale
   ========================================================= */

/* ---------- Config ---------- */
const COLORS = ["red", "purple", "blue", "green", "orange", "yellow"];
const COLOR_HEX = {
  red: "#ff0000",
  purple: "#8c52ff",
  blue: "#38b6ff",
  green: "#7ed957",
  orange: "#ff914d",
  yellow: "#ffff00",
};
const CARD_TITLES = {
  red: "Tinkering - elettronica educativa",
  purple: "Coding",
  blue: "Robotica",
  green: "Immersività",
  orange: "Modellazione 3D",
  yellow: "Cittadinanza Digitale",
};

/* ---------- Rilevamento base path (GitHub Pages vs locale) ---------- */
const isGitHubPages = location.hostname.endsWith("github.io");
const pathParts = location.pathname.split("/").filter(Boolean);
const REPO_BASE = isGitHubPages && pathParts.length > 0 ? `/${pathParts[0]}/` : "/";

/* Punti base del progetto pubblicato */
const PUBLIC_BASE   = `${REPO_BASE}public/`;
const ASSETS_BASE   = `${PUBLIC_BASE}assets/`;
const DATA_BASE     = `${ASSETS_BASE}data/`;

/* URL assoluto del glossario (indipendente da pagina) */
const GLOSSARIO_URL = new URL("glossario.json", new URL(DATA_BASE, location.origin)).toString();

/* ---------- Utils: risoluzione URL asset dal JSON ---------- */
function assetUrl(p) {
  if (!p) return "";
  const s = String(p).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s; // URL esterno, tienilo così com'è

  // Caso 1: il JSON usa percorsi assoluti da /assets/...
  if (s.startsWith("/assets/")) {
    // su GitHub Pages serve il prefisso /<repo>/public/
    return `${PUBLIC_BASE}${s.replace(/^\/+/, "")}`; // -> /<repo>/public/assets/...
  }

  // Caso 2: qualunque altro relativo (es. "../img/xxx.jpg" oppure "img/xxx.jpg")
  // Risolvo *relativamente* alla cartella del JSON: /public/assets/data/
  const base = new URL(DATA_BASE, location.origin);
  const resolved = new URL(s, base);
  // Ritorno path relativo all'host (va bene sia in locale che su Pages)
  return resolved.pathname + resolved.search + resolved.hash;
}


/* ---------- Persistenza minima locale (titoli pagina e card) ---------- */
function autoSave() {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    const termTitles = {};
    document.querySelectorAll(".term-card").forEach((card) => {
      const color = COLORS.find((c) => card.classList.contains(c));
      const titleEl = card.querySelector(".term-title");
      if (color && titleEl) termTitles[color] = titleEl.textContent;
    });
    const data = {
      title: document.querySelector(".title")?.textContent || "",
      subtitle: document.querySelector(".subtitle")?.textContent || "",
      termTitles,
      ts: Date.now(),
    };
    try {
      localStorage.setItem("ecosistem_glossary_local", JSON.stringify(data));
      const s = document.getElementById("autoSaveStatus");
      if (s) {
        const o = s.innerHTML;
        s.innerHTML = "✅ Salvato automaticamente";
        s.style.color = "#28a745";
        setTimeout(() => {
          s.innerHTML = o;
          s.style.color = "#666";
        }, 1200);
      }
    } catch (_) {}
  }, 500);
}

function loadLocal() {
  const saved = localStorage.getItem("ecosistem_glossary_local");
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    if (data.title) document.querySelector(".title").textContent = data.title;
    if (data.subtitle) document.querySelector(".subtitle").textContent = data.subtitle;
    if (data.termTitles) {
      Object.entries(data.termTitles).forEach(([color, t]) => {
        const el = document.querySelector(`.term-card.${color} .term-title`);
        if (el) el.textContent = t;
      });
    }
  } catch (_) {}
}

/* ---------- Caricamento dataset fisso (SOLO dal JSON) ---------- */
function sanitizeDataset(ds) {
  const clean = {};
  COLORS.forEach((c) => {
    const arr = Array.isArray(ds?.[c]) ? ds[c] : [];
    clean[c] = arr.map((it, idx) => ({
      id: it.id || `${c}_${idx}`,
      title: typeof it.title === "string" ? it.title : "",
      description: typeof it.description === "string" ? it.description : "",
      link: typeof it.link === "string" ? it.link : "",
      image: typeof it.image === "string" ? it.image : "",
      active: it.active !== false,
      ageTags: Array.isArray(it.ageTags) ? it.ageTags : [],
    }));
  });
  return clean;
}

async function loadFixedDataset() {
  // carica dal percorso corretto per locale + GitHub Pages
  const json = await fetchJSON(GLOSSARIO_URL);
  if (json) {
    popupData = sanitizeDataset(json);
    try {
      localStorage.setItem("ecosistem_glossario_fixed", JSON.stringify(popupData));
    } catch (_) {}
    return;
  }
  // fallback da cache
  const cached = localStorage.getItem("ecosistem_glossario_fixed");
  if (cached) {
    popupData = sanitizeDataset(JSON.parse(cached));
    return;
  }
  // fallback estremo
  popupData = Object.fromEntries(COLORS.map((c) => [c, []]));
  console.warn("Dataset vuoto: verifica il file glossario.json in public/assets/data/");
}

/* ---------- Fullscreen immagine principale ---------- */
function openFullscreen() {
  const img = document.getElementById("mainImage");
  if (!img || !img.getAttribute("src")) return;
  const overlay = document.getElementById("fullscreenOverlay");
  const full = document.getElementById("fullscreenImage");
  if (!overlay || !full) return;
  full.src = img.src;
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeFullscreen() {
  const overlay = document.getElementById("fullscreenOverlay");
  if (!overlay) return;
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeFullscreen();
});

/* ---------- Cards (macro categorie) ---------- */
function createTermCard(color, title) {
  const div = document.createElement("div");
  div.className = `term-card ${color}`;
  div.innerHTML = `<h3 class="term-title">${escapeHtml(title)}</h3>`;
  div.addEventListener("click", () => showPopups(color));
  return div;
}
function renderTermsGrid() {
  const grid = document.getElementById("termsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  COLORS.forEach((c) => grid.appendChild(createTermCard(c, CARD_TITLES[c] || c)));
  grid.querySelectorAll(".term-title").forEach((el) => {
    el.addEventListener("input", autoSave);
    el.addEventListener("blur", autoSave);
  });
}

/* ---------- Popup (contenuto fisso dal JSON) ---------- */
function createPopupElement(p, color, index) {
  const div = document.createElement("div");
  div.className = "popup";
  div.dataset.popup = `${color}-${index}`;
  div.style.borderColor = COLOR_HEX[color];

  // risolvi path immagine (relativo → assoluto) e onerror
  const imgSrc = assetUrl(p.image);
  const imgHtml = imgSrc
    ? `<img src="${imgSrc}" alt="Immagine popup"
         onerror="console.warn('Immagine non trovata:', this.src); this.onerror=null; this.style.display='none';">`
    : "";

  // se i link nel JSON sono in assets (pdf ecc.), risolvi anche quelli
  const href = p.link ? assetUrl(p.link) : "";

  div.innerHTML = `
    <div class="popup-header" style="background:${COLOR_HEX[color]};
         margin:-20px -20px 15px -20px; padding:14px 18px; border-radius:10px 10px 0 0;">
      <h3 class="popup-title" style="margin:0; color:${color === "yellow" ? "#333" : "#fff"}; font-weight:600; font-size:1.05rem;">
        ${escapeHtml(p.title || "")}
      </h3>
    </div>

    <div class="popup-image">
      ${imgHtml}
    </div>

    <div class="popup-description">
      <p>${escapeHtml(p.description || "")}</p>
    </div>

    <div class="popup-link">
      ${
        href
          ? `<a href="${href}" target="_blank" class="cta-button active ${color}">
              <span class="cta-text">Per approfondire</span>
              <span class="cta-arrow">→</span>
            </a>`
          : `<div class="cta-button inactive">
              <span class="cta-text">Nessun link</span>
            </div>`
      }
    </div>

    <div class="age-tags">
      ${["infanzia", "primaria", "secondaria"]
        .map(
          (tag) => `
        <div class="age-tag ${tag} ${Array.isArray(p.ageTags) && p.ageTags.includes(tag) ? "selected" : ""}">
          ${tag === "infanzia" ? "🧸 Infanzia" : tag === "primaria" ? "📚 Primaria" : "🎓 Secondaria"}
        </div>`
        )
        .join("")}
    </div>
  `;

  if (!p.image) {
    console.warn(`[popup senza image] colore=${color} titolo="${p.title}"`);
  }

  return div;
}

function renderPopups(list, color) {
  const container = document.getElementById("popupContainer");
  if (!container) return;
  container.innerHTML = "";
  list.forEach((p, i) => container.appendChild(createPopupElement(p, color, i)));

  // opzionale: pulsante per aggiungere una card “vuota” lato client (non persiste)
  const addButton = document.createElement("div");
  addButton.className = "add-popup-btn";
  addButton.innerHTML = "+";
  addButton.title = "Aggiungi nuovo popup";
  addButton.addEventListener("click", () => addNewPopup(color));
  container.appendChild(addButton);

  container.classList.add("active");
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Interazioni base ---------- */
function addNewPopup(color) {
  const list = popupData[color] || (popupData[color] = []);
  const base =
    color === "red"
      ? "Concetto AI"
      : color === "purple"
      ? "Robot"
      : color === "blue"
      ? "Codice"
      : color === "green"
      ? "Formula"
      : color === "orange"
      ? "Progetto"
      : "Esperimento";
  const i = list.length + 1;
  list.push({
    id: `${color}_${Date.now()}`,
    title: `${base} ${i}`,
    description: "",
    link: "",
    image: "",
    active: true,
    ageTags: [],
  });
  renderPopups(list, color);
  autoSave();
}

/* ---------- Controller ---------- */
async function showPopups(color) {
  const list = popupData[color] || [];
  renderPopups(list, color);
}

/* ---------- Ricerca (match esatto sul titolo, case-insensitive) ---------- */
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const q = String(e.target.value).toLowerCase().trim();
    const popupContainer = document.getElementById("popupContainer");

    if (!q) {
      popupContainer.classList.remove("active");
      popupContainer.innerHTML = "";
      document.querySelectorAll(".term-card").forEach((card) => {
        card.style.display = "block";
      });
      return;
    }

    // nascondo le card macro
    document.querySelectorAll(".term-card").forEach((card) => {
      card.style.display = "none";
    });

    // cerca nei popupData (titolo ESATTO, case-insensitive)
    popupContainer.innerHTML = "";
    let found = false;

    Object.entries(popupData).forEach(([color, list]) => {
      list.forEach((popup, index) => {
        const t = String(popup.title || "").toLowerCase().trim();
        if (t === q) {
          popupContainer.appendChild(createPopupElement(popup, color, index));
          found = true;
        }
      });
    });

    if (found) popupContainer.classList.add("active");
    else popupContainer.classList.remove("active");
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  // fullscreen immagine principale
  const mainImage = document.getElementById("mainImage");
  if (mainImage) {
    if (mainImage.getAttribute("src")) imageLoaded = true;
    mainImage.addEventListener("click", openFullscreen);
  }

  await loadFixedDataset(); // carica glossario.json in popupData
  renderTermsGrid();        // crea le card macro
  loadLocal();              // applica eventuali preferenze locali

  // chiudi overlay a click
  const overlay = document.getElementById("fullscreenOverlay");
  if (overlay) overlay.addEventListener("click", closeFullscreen);
});
