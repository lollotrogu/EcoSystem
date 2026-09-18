import React from 'react';
import { ExternalLink, BookOpen, Sparkles } from 'lucide-react';
import { CATEGORY_MAP } from '../constants/categories';
import { resolveAssetUrl } from '../utils/assetHelper';

const AGE_TAGS = [
  { id: 'infanzia', label: '🧸 Infanzia', activeClass: 'bg-pink-100 text-pink-700 border-pink-300' },
  { id: 'primaria', label: '📚 Primaria', activeClass: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: 'secondaria', label: '🎓 Secondaria', activeClass: 'bg-purple-100 text-purple-700 border-purple-300' },
];

export default function TermCard({ item, colorKey, onOpenImageFullscreen }) {
  const category = CATEGORY_MAP[colorKey] || {
    title: 'STEM',
    colorHex: '#6366f1',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  };

  const imageSrc = item.image ? resolveAssetUrl(item.image) : '';
  const linkHref = item.link ? resolveAssetUrl(item.link) : '';

  const handleCardClick = (e) => {
    // Se l'utente clicca direttamente su un pulsante o link, lascia fare al pulsante
    if (e.target.closest('button') || e.target.closest('a')) return;
    if (linkHref) {
      window.open(linkHref, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden ${
        linkHref ? 'cursor-pointer' : ''
      }`}
      style={{ borderColor: `${category.colorHex}40` }}
    >
      <div>
        {/* Intestazione card con titolo e colore categoria */}
        <div
          className="p-4 sm:p-5 text-white flex items-center justify-between"
          style={{ backgroundColor: category.colorHex }}
        >
          <h4
            className="text-base sm:text-lg font-bold leading-tight line-clamp-1"
            style={{ color: colorKey === 'yellow' ? '#1e293b' : '#ffffff' }}
          >
            {item.title}
          </h4>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold bg-white/25 backdrop-blur-xs"
            style={{ color: colorKey === 'yellow' ? '#1e293b' : '#ffffff' }}
          >
            {category.shortTitle || 'STEM'}
          </span>
        </div>

        {/* Box Immagine */}
        <div className="p-4 bg-slate-50/50">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white border border-dashed border-slate-200 flex items-center justify-center p-2 group-hover:border-slate-300 transition-colors">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={item.title}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300 p-4 text-center">
                <BookOpen className="w-10 h-10 mb-1" />
                <span className="text-xs">Nessuna immagine</span>
              </div>
            )}
          </div>
        </div>

        {/* Descrizione */}
        <div className="p-4 sm:p-5 pt-2">
          {item.description ? (
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
              {item.description}
            </p>
          ) : (
            <p className="text-slate-400 italic text-xs">
              Attività del curricolo in fase di aggiornamento.
            </p>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0 space-y-4">
        {/* Pulsante di approfondimento (link o pdf) */}
        {linkHref ? (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow-md ${category.buttonClass}`}
          >
            <span>Per approfondire</span>
            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        ) : (
          <div className="w-full py-2.5 px-4 rounded-xl text-center text-slate-400 bg-slate-100 border border-slate-200 text-xs font-medium">
            Scheda interna al laboratorio
          </div>
        )}

        {/* Tag età / Grado scolastico */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {AGE_TAGS.map((tag) => {
            const isAssigned = Array.isArray(item.ageTags) && item.ageTags.includes(tag.id);
            return (
              <span
                key={tag.id}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  isAssigned
                    ? `${tag.activeClass} font-semibold shadow-xs`
                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                }`}
              >
                {tag.label}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}

