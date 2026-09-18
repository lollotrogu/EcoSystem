/**
 * Normalizza e risolve i percorsi di asset (immagini, pdf, ecc.)
 * sia in ambiente di sviluppo (Vite dev) che in produzione servita da PHP.
 */
export function resolveAssetUrl(path) {
  const assetBase = (() => {
    if (import.meta.env?.VITE_STATIC_SITE) return import.meta.env.VITE_ASSET_BASE || '/assets/';
    if (typeof window !== 'undefined' && window.location.pathname.includes('/public/dist')) return '../../assets/';
    return '/assets/';
  })();
  if (!path) return '';
  const raw = String(path).trim();
  if (!raw) return '';

  // Se è già un URL completo (es. https://...)
  if (/^https?:\/\//i.test(raw)) {
    // Se punta alla vecchia repository github.io/EcoSystem/public/assets/pdf/...,
    // normalizziamo per usare gli asset locali
    if (raw.includes('/public/assets/pdf/')) {
      const filename = raw.split('/public/assets/pdf/')[1];
      return `${assetBase}pdf/${filename}`;
    }
    return raw;
  }

  // Se è un percorso relativo con ../img/ o /img/
  if (/^(\.\.\/)*img\//i.test(raw) || raw.startsWith('/img/')) {
    const filename = raw.replace(/^(\.\.\/)*img\//i, '').replace(/^\/img\//i, '');
    return `${assetBase}img/${filename}`;
  }

  // Se è un percorso relativo con ../pdf/ o /pdf/
  if (/^(\.\.\/)*pdf\//i.test(raw) || raw.startsWith('/pdf/')) {
    const filename = raw.replace(/^(\.\.\/)*pdf\//i, '').replace(/^\/pdf\//i, '');
    return `${assetBase}pdf/${filename}`;
  }

  // Se comincia già con assets/ o /assets/
  if (raw.startsWith('/assets/')) {
    return `${assetBase}${raw.slice('/assets/'.length)}`;
  }
  if (raw.startsWith('assets/')) {
    return `${assetBase}${raw.slice('assets/'.length)}`;
  }

  return raw.startsWith('/') ? raw : `/${raw}`;
}
