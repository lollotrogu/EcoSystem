/**
 * Normalizza e risolve i percorsi di asset (immagini, pdf, json, ecc.)
 * in modo completamente portabile tra sviluppo (Vite dev), produzione PHP,
 * e GitHub Pages (sia da root repository che da public/dist).
 */
export function resolveAssetUrl(path) {
  if (!path) return '';
  const raw = String(path).trim();
  if (!raw) return '';

  // Se è già un URL completo esterno (es. http/https)
  if (/^https?:\/\//i.test(raw)) {
    // Se punta al vecchio URL hardcodato di GitHub con /public/assets/pdf/,
    // normalizziamo per usare gli asset locali
    if (raw.includes('/public/assets/pdf/')) {
      const filename = raw.split('/public/assets/pdf/')[1];
      return `./assets/pdf/${filename}`;
    }
    return raw;
  }

  // Estrai il percorso pulito relativo ad "assets/"
  let clean = raw;
  if (/^(\.\.\/)*img\//i.test(clean) || clean.startsWith('/img/')) {
    clean = 'img/' + clean.replace(/^(\.\.\/)*img\//i, '').replace(/^\/img\//i, '');
  } else if (/^(\.\.\/)*pdf\//i.test(clean) || clean.startsWith('/pdf/')) {
    clean = 'pdf/' + clean.replace(/^(\.\.\/)*pdf\//i, '').replace(/^\/pdf\//i, '');
  } else if (/^(\.\.\/)*data\//i.test(clean) || clean.startsWith('/data/')) {
    clean = 'data/' + clean.replace(/^(\.\.\/)*data\//i, '').replace(/^\/data/i, '');
  } else if (clean.startsWith('/assets/')) {
    clean = clean.slice('/assets/'.length);
  } else if (clean.startsWith('assets/')) {
    clean = clean.slice('assets/'.length);
  } else if (clean.startsWith('/')) {
    clean = clean.slice(1);
  }

  return `./assets/${clean}`;
}
