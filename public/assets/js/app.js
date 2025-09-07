// Variabili globali per immagine
let imageLoaded = false;
let autoSaveTimeout = null;
let imageFitMode = "contain"; // 'cover' o 'contain'

// Funzione di salvataggio automatico
function autoSave() {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    const termTitles = {};
    document.querySelectorAll(".term-card").forEach((card) => {
      const color = card.className
        .split(" ")
        .find((c) =>
          ["red", "purple", "blue", "green", "orange", "yellow"].includes(c)
        );
      const title = card.querySelector(".term-title").textContent;
      termTitles[color] = title;
    });

    const glossaryData = {
      title: document.querySelector(".title").textContent,
      subtitle: document.querySelector(".subtitle").textContent,
      termTitles: termTitles,
      popupData: popupData,
      timestamp: new Date().toISOString(),
    };

    // Salva nel localStorage
    try {
      localStorage.setItem("ecosistem_glossary", JSON.stringify(glossaryData));

      // Mostra feedback visivo
      const status = document.getElementById("autoSaveStatus");
      const originalText = status.innerHTML;
      status.innerHTML = "✅ Salvato automaticamente";
      status.style.color = "#28a745";
      setTimeout(() => {
        status.innerHTML = originalText;
        status.style.color = "#666";
      }, 2000);
    } catch (error) {
      console.warn("Errore nel salvataggio:", error);
    }
  }, 1000);
}

// Carica automaticamente i dati salvati all'avvio
function loadAutoSavedData() {
  const savedData = localStorage.getItem("ecosistem_glossary");
  if (savedData) {
    try {
      const glossaryData = JSON.parse(savedData);

      if (glossaryData.title) {
        document.querySelector(".title").textContent = glossaryData.title;
      }
      if (glossaryData.subtitle) {
        document.querySelector(".subtitle").textContent = glossaryData.subtitle;
      }
      if (glossaryData.termTitles) {
        Object.keys(glossaryData.termTitles).forEach((color) => {
          const card = document.querySelector(`.term-card.${color}`);
          if (card) {
            card.querySelector(".term-title").textContent =
              glossaryData.termTitles[color];
          }
        });
      }
      if (glossaryData.popupData) {
        Object.assign(popupData, glossaryData.popupData);
      }
    } catch (error) {
      console.log("Errore nel caricamento dei dati salvati:", error);
    }
  }

  // Carica l'immagine principale salvata
  const savedImage = localStorage.getItem("ecosistem_main_image");
  if (savedImage) {
    try {
      loadImageFromData(savedImage);
    } catch (error) {
      console.log("Errore nel caricamento dell'immagine salvata:", error);
      localStorage.removeItem("ecosistem_main_image");
    }
  }
}

// Funzione per caricare immagine da dati base64
function loadImageFromData(imageData) {
  const img = document.getElementById("mainImage");
  const loadingIndicator = document.getElementById("loadingIndicator");

  loadingIndicator.classList.add("active");

  // Crea una nuova immagine per testare il caricamento
  const testImg = new Image();
  testImg.onload = function () {
    img.src = imageData;
    document.getElementById("imageUpload").style.display = "none";
    document.getElementById("imageViewer").classList.add("active");
    imageLoaded = true;
    loadingIndicator.classList.remove("active");
  };

  testImg.onerror = function () {
    console.error("Errore nel caricamento dell'immagine salvata");
    localStorage.removeItem("ecosistem_main_image");
    loadingIndicator.classList.remove("active");
  };

  testImg.src = imageData;
}

// Gestione caricamento immagine migliorata
document.getElementById("imageInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    // Validazione del file
    if (!file.type.startsWith("image/")) {
      alert(
        "Per favore seleziona un file immagine valido (JPG, PNG, GIF, etc.)."
      );
      return;
    }

    // Limite dimensione file (5MB per compatibilità localStorage)
    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Il file è troppo grande. Massimo 5MB per garantire la compatibilità."
      );
      return;
    }

    const loadingIndicator = document.getElementById("loadingIndicator");
    loadingIndicator.classList.add("active");

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imageData = e.target.result;

        // Crea una nuova immagine per testare il caricamento
        const testImg = new Image();
        testImg.onload = function () {
          // Se l'immagine si carica correttamente, mostrala
          const img = document.getElementById("mainImage");
          img.src = imageData;
          document.getElementById("imageUpload").style.display = "none";
          document.getElementById("imageViewer").classList.add("active");
          imageLoaded = true;
          loadingIndicator.classList.remove("active");

          // Salva l'immagine nel localStorage per persistenza
          try {
            localStorage.setItem("ecosistem_main_image", imageData);
          } catch (storageError) {
            console.warn(
              "Impossibile salvare l'immagine nel localStorage (troppo grande):",
              storageError
            );
            alert(
              "Immagine caricata ma non salvata automaticamente (troppo grande per il browser)."
            );
          }
        };

        testImg.onerror = function () {
          loadingIndicator.classList.remove("active");
          alert(
            "Errore nel caricamento dell'immagine. Il file potrebbe essere corrotto."
          );
        };

        testImg.src = imageData;
      } catch (error) {
        loadingIndicator.classList.remove("active");
        console.error("Errore nel processamento dell'immagine:", error);
        alert(
          "Errore nel caricamento dell'immagine. Prova con un file diverso."
        );
      }
    };

    reader.onerror = function () {
      loadingIndicator.classList.remove("active");
      alert("Errore nella lettura del file.");
    };

    reader.readAsDataURL(file);
  }
});

// Funzione per cambiare modalità di visualizzazione immagine
function toggleImageFit() {
  const img = document.getElementById("mainImage");
  const toggleBtn = document.getElementById("fitToggle");

  if (imageFitMode === "contain") {
    imageFitMode = "cover";
    img.style.objectFit = "cover";
    toggleBtn.textContent = "📐";
    toggleBtn.title = "Modalità: Riempie spazio - Clicca per immagine completa";
  } else {
    imageFitMode = "contain";
    img.style.objectFit = "contain";
    toggleBtn.textContent = "🖼️";
    toggleBtn.title = "Modalità: Immagine completa - Clicca per riempire";
  }
}

// Funzioni per visualizzazione a schermo intero
function openFullscreen() {
  if (!imageLoaded) return;

  const mainImg = document.getElementById("mainImage");
  const fullscreenImg = document.getElementById("fullscreenImage");
  const overlay = document.getElementById("fullscreenOverlay");

  fullscreenImg.src = mainImg.src;
  overlay.classList.add("active");

  // Previeni lo scroll del body
  document.body.style.overflow = "hidden";
}

function closeFullscreen() {
  const overlay = document.getElementById("fullscreenOverlay");
  overlay.classList.remove("active");

  // Ripristina lo scroll del body
  document.body.style.overflow = "auto";
}

// Chiudi con tasto ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeFullscreen();
    // Chiudi anche tutti i menu popup aperti
    document.querySelectorAll(".popup-menu-dropdown.active").forEach((menu) => {
      menu.classList.remove("active");
    });
  }
});

// Chiudi menu quando si clicca fuori
document.addEventListener("click", function (e) {
  if (!e.target.closest(".popup-menu")) {
    document.querySelectorAll(".popup-menu-dropdown.active").forEach((menu) => {
      menu.classList.remove("active");
    });
  }
});

// Aggiungi click sull'immagine principale per aprire fullscreen
document.addEventListener("DOMContentLoaded", function () {
  const mainImage = document.getElementById("mainImage");
  mainImage.addEventListener("click", openFullscreen);

  // Carica i dati salvati automaticamente
  loadAutoSavedData();

  // Aggiungi listener per il salvataggio automatico sui titoli modificabili
  const title = document.querySelector(".title");
  const subtitle = document.querySelector(".subtitle");

  title.addEventListener("input", autoSave);
  title.addEventListener("blur", autoSave);
  subtitle.addEventListener("input", autoSave);
  subtitle.addEventListener("blur", autoSave);

  // Aggiungi listener per i titoli delle card
  document.querySelectorAll(".term-title").forEach((termTitle) => {
    termTitle.addEventListener("input", autoSave);
    termTitle.addEventListener("blur", autoSave);
  });

  // Test API ping
  fetch("/api/ping")
    .then((r) => r.json())
    .then((data) => {
      console.log("PING OK:", data);
      const s = document.getElementById("autoSaveStatus");
      if (s) s.innerHTML = "✅ API ok";
    })
    .catch((err) => {
      console.error("PING ERROR:", err);
      const s = document.getElementById("autoSaveStatus");
      if (s) s.innerHTML = "⚠️ API non raggiungibile";
    });
});

// Gestione popup
const popupData = {
  red: Array(10)
    .fill()
    .map((_, i) => ({
      id: `red_${i}`,
      title: `Concetto AI ${i + 1}`,
      description: "",
      link: "",
      image: null,
      active: true,
      ageTags: [],
    })),
  purple: Array(10)
    .fill()
    .map((_, i) => ({
      id: `purple_${i}`,
      title: `Robot ${i + 1}`,
      description: "",
      link: "",
      image: null,
      active: true,
      ageTags: [],
    })),
  blue: Array(10)
    .fill()
    .map((_, i) => ({
      id: `blue_${i}`,
      title: `Codice ${i + 1}`,
      description: "",
      link: "",
      image: null,
      active: true,
      ageTags: [],
    })),
  green: Array(10)
    .fill()
    .map((_, i) => ({
      id: `green_${i}`,
      title: `Formula ${i + 1}`,
      description: "",
      link: "",
      image: null,
      active: true,
      ageTags: [],
    })),
  orange: Array(10)
    .fill()
    .map((_, i) => ({
      id: `orange_${i}`,
      title: `Progetto ${i + 1}`,
      description: "",
      link: "",
      image: null,
      active: true,
      ageTags: [],
    })),
  yellow: Array(10)
    .fill()
    .map((_, i) => ({
      id: `yellow_${i}`,
      title: `Esperimento ${i + 1}`,
      description: "",
      link: "",
      image: null,
      active: true,
      ageTags: [],
    })),
};

const colorMap = {
  red: "#ff0000",
  purple: "#8c52ff",
  blue: "#38b6ff",
  green: "#7ed957",
  orange: "#ff914d",
  yellow: "#ffff00",
};

function showPopups(color) {
  const container = document.getElementById("popupContainer");
  container.innerHTML = "";

  // Chiudi tutti gli altri popup
  container.classList.remove("active");

  setTimeout(() => {
    popupData[color].forEach((popup, index) => {
      const popupElement = createPopupElement(popup, color, index);
      container.appendChild(popupElement);
    });

    // Aggiungi il pulsante per aggiungere nuovi popup
    const addButton = document.createElement("div");
    addButton.className = "add-popup-btn";
    addButton.innerHTML = "+";
    addButton.title = "Aggiungi nuovo popup";
    addButton.onclick = () => addNewPopup(color);
    container.appendChild(addButton);

    container.classList.add("active");
  }, 100);
}

function addNewPopup(color) {
  const newIndex = popupData[color].length;
  const newPopup = {
    id: `${color}_${newIndex}`,
    title: `Nuovo ${
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
        : "Esperimento"
    } ${newIndex + 1}`,
    description: "",
    link: "",
    image: null,
    active: true,
    ageTags: [],
  };

  popupData[color].push(newPopup);

  // Ricarica i popup per mostrare il nuovo
  showPopups(color);
  autoSave();
}

function createPopupElement(popup, color, index) {
  const div = document.createElement("div");
  div.className = "popup";
  div.setAttribute("data-popup", `${color}-${index}`);
  div.style.borderColor = colorMap[color];

  // Modalità modifica - elementi interattivi
  div.innerHTML = `
                <div class="popup-header" style="background: ${
                  colorMap[color]
                }; margin: -20px -20px 15px -20px; padding: 15px 20px; border-radius: 10px 10px 0 0;">
                    <input type="text" class="popup-title" value="${
                      popup.title
                    }" 
                           onchange="updatePopupData('${color}', ${index}, 'title', this.value)"
                           style="background: transparent; border: none; color: ${
                             color === "yellow" ? "#333" : "white"
                           }; font-weight: 600; font-size: 1.1rem; width: 100%; outline: none;">
                </div>
                
                <div class="popup-image" onclick="this.querySelector('input').click()">
                    ${
                      popup.image
                        ? `<img src="${popup.image}" alt="Popup image">`
                        : "📷 Carica immagine"
                    }
                    <input type="file" accept="image/*" onchange="loadPopupImage('${color}', ${index}, this)">
                </div>
                
                <div class="popup-description">
                    <textarea placeholder="Descrizione (max 500 caratteri)" maxlength="500" 
                              onchange="updatePopupData('${color}', ${index}, 'description', this.value)">${
    popup.description
  }</textarea>
                </div>
                
                <div class="popup-link">
                    <input type="url" placeholder="Inserisci URL per il pulsante approfondimento" value="${
                      popup.link
                    }"
                           onchange="updatePopupData('${color}', ${index}, 'link', this.value)" 
                           style="margin-bottom: 10px; font-size: 0.85rem;">
                    <div class="cta-button ${
                      popup.link ? `active ${color}` : "inactive"
                    }" 
                         onclick="openLink('${color}', ${index})"
                         ${
                           popup.link
                             ? `title="Vai a: ${popup.link}"`
                             : 'title="Inserisci un URL per attivare il pulsante"'
                         }>
                        <span class="cta-text">Per approfondire</span>
                        <span class="cta-arrow">→</span>
                    </div>
                </div>
                
                <div class="age-tags">
                    <div class="age-tag infanzia ${
                      popup.ageTags.includes("infanzia") ? "selected" : ""
                    }" 
                         onclick="toggleAgeTag('${color}', ${index}, 'infanzia', this)">
                        🧸 Infanzia
                    </div>
                    <div class="age-tag primaria ${
                      popup.ageTags.includes("primaria") ? "selected" : ""
                    }" 
                         onclick="toggleAgeTag('${color}', ${index}, 'primaria', this)">
                        📚 Primaria
                    </div>
                    <div class="age-tag secondaria ${
                      popup.ageTags.includes("secondaria") ? "selected" : ""
                    }" 
                         onclick="toggleAgeTag('${color}', ${index}, 'secondaria', this)">
                        🎓 Secondaria
                    </div>
                </div>
                
                <div class="popup-menu">
                    <button class="popup-menu-btn" onclick="togglePopupMenu('${color}', ${index})" title="Opzioni popup">
                        ⋮
                    </button>
                    <div class="popup-menu-dropdown" id="menu-${color}-${index}">
                        <div class="menu-item" onclick="duplicatePopup('${color}', ${index})">
                            📋 Duplica
                        </div>
                        <div class="menu-item delete-item" onclick="confirmDeletePopup('${color}', ${index})">
                            🗑️ Elimina
                        </div>
                    </div>
                </div>
            `;

  return div;
}

function updatePopupData(color, index, field, value) {
  popupData[color][index][field] = value;

  // Aggiorna lo stato del pulsante se è il campo link
  if (field === "link") {
    const popup = document.querySelector(`[data-popup="${color}-${index}"]`);
    if (popup) {
      const btn = popup.querySelector(".cta-button");
      if (value && value.trim()) {
        btn.classList.remove("inactive");
        btn.classList.add("active", color);
        btn.title = `Vai a: ${value}`;
      } else {
        btn.classList.remove(
          "active",
          "red",
          "purple",
          "blue",
          "green",
          "orange",
          "yellow"
        );
        btn.classList.add("inactive");
        btn.title = "Inserisci un URL per attivare il pulsante";
      }
    }
  }

  autoSave();
}

function openLink(color, index) {
  const link = popupData[color][index].link;
  if (link && link.trim()) {
    // Assicurati che il link abbia il protocollo
    let url = link.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    window.open(url, "_blank");
  }
}

function loadPopupImage(color, index, input) {
  const file = input.files[0];
  if (file) {
    // Validazione del file
    if (!file.type.startsWith("image/")) {
      alert("Per favore seleziona un file immagine valido.");
      return;
    }

    // Limite dimensione per popup (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Il file è troppo grande per un popup. Massimo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imageData = e.target.result;
        popupData[color][index].image = imageData;
        const container = input.parentElement;
        container.innerHTML = `<img src="${imageData}" alt="Popup image">
                                              <input type="file" accept="image/*" onchange="loadPopupImage('${color}', ${index}, this)">`;
        autoSave();
      } catch (error) {
        console.error("Errore nel caricamento immagine popup:", error);
        alert("Errore nel caricamento dell'immagine.");
      }
    };

    reader.onerror = function () {
      alert("Errore nella lettura del file.");
    };

    reader.readAsDataURL(file);
  }
}

function togglePopupMenu(color, index) {
  const menu = document.getElementById(`menu-${color}-${index}`);
  const allMenus = document.querySelectorAll(".popup-menu-dropdown");

  // Chiudi tutti gli altri menu
  allMenus.forEach((m) => {
    if (m !== menu) {
      m.classList.remove("active");
    }
  });

  // Toggle del menu corrente
  menu.classList.toggle("active");
}

function duplicatePopup(color, index) {
  const originalPopup = popupData[color][index];
  const newPopup = {
    ...originalPopup,
    id: `${color}_${Date.now()}`,
    title: originalPopup.title + " (Copia)",
  };

  popupData[color].push(newPopup);
  showPopups(color);
  autoSave();
}

function confirmDeletePopup(color, index) {
  const popup = popupData[color][index];

  // Crea un dialog personalizzato più visibile
  const confirmDialog = document.createElement("div");
  confirmDialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.7);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

  confirmDialog.innerHTML = `
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    text-align: center;
                    max-width: 400px;
                    margin: 20px;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #dc3545;">🗑️ Elimina Popup</h3>
                    <p style="margin: 0 0 20px 0; color: #666;">
                        Sei sicuro di voler eliminare<br>
                        <strong>"${popup.title}"</strong>?
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button onclick="this.closest('div').parentElement.remove()" style="
                            padding: 10px 20px;
                            border: 2px solid #6c757d;
                            background: white;
                            color: #6c757d;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Annulla</button>
                        <button onclick="executeDelete('${color}', ${index}); this.closest('div').parentElement.remove();" style="
                            padding: 10px 20px;
                            border: none;
                            background: #dc3545;
                            color: white;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Elimina</button>
                    </div>
                </div>
            `;

  document.body.appendChild(confirmDialog);

  // Chiudi cliccando fuori
  confirmDialog.addEventListener("click", function (e) {
    if (e.target === confirmDialog) {
      confirmDialog.remove();
    }
  });
}

function executeDelete(color, index) {
  // Rimuovi il popup dai dati
  popupData[color].splice(index, 1);

  // Ricarica completamente i popup
  showPopups(color);
  autoSave();
}

function toggleAgeTag(color, index, tag, element) {
  const tags = popupData[color][index].ageTags;
  const tagIndex = tags.indexOf(tag);

  if (tagIndex > -1) {
    // Rimuovi il tag se già selezionato
    tags.splice(tagIndex, 1);
    element.classList.remove("selected");
  } else {
    // Aggiungi il tag se non selezionato
    tags.push(tag);
    element.classList.add("selected");
  }
  autoSave();
}

// Funzione di ricerca
document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".term-card");

  cards.forEach((card) => {
    const title = card.querySelector(".term-title").textContent.toLowerCase();

    if (title.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = searchTerm ? "none" : "block";
    }
  });
});

// Funzioni per gestione immagine
function removeImage() {
  if (confirm("Sei sicuro di voler eliminare l'immagine?")) {
    document.getElementById("imageViewer").classList.remove("active");
    document.getElementById("imageUpload").style.display = "block";
    document.getElementById("mainImage").src = "";
    imageLoaded = false;
    localStorage.removeItem("ecosistem_main_image");
    closeFullscreen();
  }
}

function replaceImage() {
  document.getElementById("replaceImageInput").click();
}

document
  .getElementById("replaceImageInput")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      // Validazione del file
      if (!file.type.startsWith("image/")) {
        alert("Per favore seleziona un file immagine valido.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Il file è troppo grande. Massimo 5MB.");
        return;
      }

      const loadingIndicator = document.getElementById("loadingIndicator");
      loadingIndicator.classList.add("active");

      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const imageData = e.target.result;
          const img = document.getElementById("mainImage");

          const testImg = new Image();
          testImg.onload = function () {
            img.src = imageData;
            imageLoaded = true;
            loadingIndicator.classList.remove("active");

            try {
              localStorage.setItem("ecosistem_main_image", imageData);
            } catch (storageError) {
              console.warn("Impossibile salvare l'immagine:", storageError);
            }
          };

          testImg.onerror = function () {
            loadingIndicator.classList.remove("active");
            alert("Errore nel caricamento dell'immagine.");
          };

          testImg.src = imageData;
        } catch (error) {
          loadingIndicator.classList.remove("active");
          console.error("Errore:", error);
          alert("Errore nel caricamento dell'immagine.");
        }
      };

      reader.onerror = function () {
        loadingIndicator.classList.remove("active");
        alert("Errore nella lettura del file.");
      };

      reader.readAsDataURL(file);
    }
  });
