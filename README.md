# EcosiStem — Portale Didattico STEM
**Istituto Comprensivo “U. Amaldi” - Cadeo (PC)**

Portale interattivo per la didattica digitale e le materie STEM (Tinkering, Coding, Robotica, Immersività, Modellazione 3D e Cittadinanza Digitale) dedicato alla scuola secondaria di primo grado (e ai gradi collegati dell'istituto comprensivo).

---

## Architettura

- **Frontend**: React 18 (JSX), Tailwind CSS, Lucide Icons, Vite.
  - Componenti modulari e accessibili.
  - Ricerca istantanea su tutte le schede e descrizioni del glossario.
  - Mappa concettuale interattiva con visualizzazione a schermo intero (supporto tasto ESC).
  - Palette colori dinamica per le 6 macro-aree STEM.
  - Badge per livello scolastico (Infanzia, Primaria, Secondaria) e schede di approfondimento PDF.
- **Backend**: PHP 8.3 puro (zero dipendenze pesanti).
  - Standard di sicurezza elevati: HTTP Security Headers (`nosniff`, `SAMEORIGIN`, `Content-Security-Policy`, `Referrer-Policy`, etc.).
  - Protezione Directory Traversal per l'accesso ai file e sanitizzazione input.
  - Routing modulare con gestione sicura dei metodi HTTP (`GET`, `POST`, `OPTIONS`, `HEAD`), 405 Method Not Allowed e fallback 404/SPA.
  - API REST protetta (`/api/glossario`) con supporto cache `ETag` (risposta 304 Not Modified) e endpoint diagnostici (`/api/ping`, `/api/health`).

---

## Come Avviare il Progetto

### 1. Avvio Rapido del Server Web (PHP)
Non occorre Docker! Basta avere PHP installato nel sistema:
```powershell
# Dalla cartella principale del progetto
php -S localhost:8000 -t public
```
Apri il browser su: [http://localhost:8000](http://localhost:8000)

L'applicazione React compilata in `public/dist` e le API REST sono subito operative.

---

### 2. Sviluppo del Frontend React (Hot Reload)
Per modificare i componenti React o lo stile Tailwind in tempo reale:
```powershell
cd frontend
npm install   # (solo la prima volta)
npm run dev
```
Il server di sviluppo Vite si avvierà su [http://localhost:5173](http://localhost:5173) con Hot Module Replacement (HMR) e proxy automatico verso il backend PHP su `http://localhost:8000`.

---

### 3. Compilazione del Frontend per Produzione
Per compilare la nuova versione del frontend e aggiornare la cartella `public/dist`:
```powershell
cd frontend
npm run build
```
Vite genererà gli asset ottimizzati in `public/dist/` pronti per essere serviti dal backend PHP o distribuiti su qualsiasi server web.

---

## Endpoint API REST

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/ping` | Verifica dello stato e connettività dell'API |
| `GET` | `/api/health` | Diagnostica dell'accesso ai dati del glossario |
| `GET` | `/api/glossario` | Dati completi del glossario STEM con supporto cache `ETag` |

