/* =========================================================
   EcosiSTEM - Frontend JS (cards + popup con dataset fisso)
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
const REPO_BASE  = location.hostname.endsWith("github.io") && location.pathname.split("/").filter(Boolean).length > 0
                  ? `/${location.pathname.split("/").filter(Boolean)[0]}/` : "/";
const PUBLIC_BASE = `${REPO_BASE}public/`;
const ASSETS_BASE = `${PUBLIC_BASE}assets/`;
const DATA_BASE   = `${ASSETS_BASE}data/`;
/* URL assoluto del glossario (indipendente da pagina) */
const GLOSSARIO_URL = new URL("glossario.json", new URL(DATA_BASE, location.origin)).toString();

/* ---------- Stato ---------- */
let popupData = {}; // dataset per colore (preso da glossario.json)
let autoSaveTimeout = null;
let imageLoaded = false;

/* ---------- Utils ---------- */
function escapeHtml(s) {
  return (s || "").replace(/[&<>"']/g, (m) =>
    m === "&" ? "&amp;" :
    m === "<" ? "&lt;" :
    m === ">" ? "&gt;" :
    m === '"' ? "&quot;" : "&#39;"
  );
}

async function fetchJSON(url) {
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (e) {
    console.warn("fetchJSON error:", url, e);
    return null;
  }
}

/** Risolve un path di asset (image/link) proveniente dal JSON
 *  - URL http/https -> restituito com’è
 *  - "/assets/..."  -> prefissato con PUBLIC_BASE  (/…/public/assets/…)
 *  - altri relativi  -> risolti rispetto alla cartella del JSON (/…/public/assets/data/)
 */
function assetUrl(p) {
  if (!p) return "";
  const raw = String(p).trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  // normalizza eventuale "./"
  let s = raw.replace(/^\.\//, "");

  // --- scorciatoie esplicite per cartelle comuni del JSON ---
  // img -> /public/assets/img/...
  if (/^(\.\.\/)*img\//i.test(s) || s.startsWith("/img/")) {
    const rest = s
      .replace(/^(\.\.\/)*/i, "")     // rimuovi ../ multipli
      .replace(/^\/?img\//i, "img/"); // normalizza prefisso
    return `${ASSETS_BASE}${rest}`;   // ASSETS_BASE = "<repo>/public/assets/"
  }

  // pdf -> /public/assets/pdf/...
  if (/^(\.\.\/)*pdf\//i.test(s) || s.startsWith("/pdf/")) {
    const rest = s
      .replace(/^(\.\.\/)*/i, "")
      .replace(/^\/?pdf\//i, "pdf/");
    return `${ASSETS_BASE}${rest}`;
  }

  // già scritto come "/assets/..."
  if (s.startsWith("/assets/")) {
    return `${PUBLIC_BASE}${s.replace(/^\/+/, "")}`; // -> "<repo>/public/assets/..."
  }

  // fallback: risolvi rispetto alla cartella del JSON (/public/assets/data/)
  const base = new URL(DATA_BASE, location.origin);  // DATA_BASE = "<repo>/public/assets/data/"
  const u = new URL(s, base);
  return u.pathname + u.search + u.hash;
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
    clean[c] = arr.map((it, idx) => {
      const item = { ...it };
      item.title = typeof item.title === "string" ? item.title : "";
      item.description = typeof item.description === "string" ? item.description : "";
      item.link = typeof item.link === "string" ? item.link : "";
      item.image = typeof item.image === "string" ? item.image : "";
      item.ageTags = Array.isArray(item.ageTags) ? item.ageTags : [];
      item.id = item.id || `${c}_${idx}`;
      return item;
    });
  });
  return clean;
}

async function loadFixedDataset() {
  // carica sempre dal percorso assoluto costruito in base all’host
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
  console.warn("Dataset vuoto: verifica", GLOSSARIO_URL);
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

  const imgSrc = assetUrl(p.image);
  const linkHref = assetUrl(p.link);

  const imgHtml = imgSrc
    ? `<img src="${imgSrc}" alt="Immagine popup"
         onerror="console.warn('Immagine non trovata:', this.src); this.onerror=null; this.style.display='none';">`
    : "";

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
        p.link
          ? `<a href="${linkHref}" target="_blank" rel="noopener" class="cta-button active ${color}">
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

  // opzionale: pulsante per aggiungere una card “vuota”
  /*
  const addButton = document.createElement("div");
  addButton.className = "add-popup-btn";
  addButton.innerHTML = "+";
  addButton.title = "Aggiungi nuovo popup";
  addButton.addEventListener("click", () => addNewPopup(color));
  container.appendChild(addButton);*/

  container.classList.add("active");
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Interazioni base (facoltative) ---------- */
/*
function addNewPopup(color) {
  const list = popupData[color] || (popupData[color] = []);
  const base =
    color === "red" ? "Concetto AI" :
    color === "purple" ? "Robot" :
    color === "blue" ? "Codice" :
    color === "green" ? "Formula" :
    color === "orange" ? "Progetto" : "Esperimento";
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
  */

/* ---------- Controller ---------- */
async function showPopups(color) {
  const list = popupData[color] || [];
  renderPopups(list, color);
}

/* =========================================================
   BOOT
   ========================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  // fullscreen immagine principale
  const mainImage = document.getElementById("mainImage");
  if (mainImage) {
    if (mainImage.getAttribute("src")) imageLoaded = true;
    mainImage.addEventListener("click", openFullscreen);
  }
  const overlay = document.getElementById("fullscreenOverlay");
  if (overlay) overlay.addEventListener("click", closeFullscreen);

  await loadFixedDataset(); // carica glossario.json in popupData
  renderTermsGrid();        // crea le card
  loadLocal();              // applica eventuali preferenze locali

  // Ricerca: match ESATTO (case-insensitive) del titolo card
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

      // nascondo le card
      document.querySelectorAll(".term-card").forEach((card) => {
        card.style.display = "none";
      });

      // cerca nei popupData per titolo ESATTO (case-insensitive)
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
});
