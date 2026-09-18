import React, { useRef, useEffect } from 'react';
import TermCard from './TermCard';
import { CATEGORY_MAP } from '../constants/categories';
import { Layers } from 'lucide-react';

export default function TermGrid({ items, selectedCategory, onClearFilter, searchQuery }) {
  const containerRef = useRef(null);

  // Scorri dolcemente alla lista quando l'utente clicca una categoria
  useEffect(() => {
    if (selectedCategory && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory]);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-50/60 rounded-3xl border border-dashed border-slate-200 max-w-4xl mx-auto my-6">
        <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="text-lg font-semibold text-slate-700">Nessuna attività trovata</h4>
        <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
          Non sono presenti schede che corrispondono ai filtri attuali.
        </p>
        {(selectedCategory || searchQuery) && (
          <button
            onClick={onClearFilter}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all"
          >
            Azzera filtri di ricerca
          </button>
        )}
      </div>
    );
  }

  const activeCategoryInfo = selectedCategory ? CATEGORY_MAP[selectedCategory] : null;

  return (
    <section ref={containerRef} className="px-4 sm:px-8 max-w-6xl mx-auto mb-16">
      {/* Banner di contesto categoria se selezionata */}
      {activeCategoryInfo && (
        <div
          className="mb-6 p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-2"
          style={{
            backgroundColor: `${activeCategoryInfo.colorHex}10`,
            borderColor: `${activeCategoryInfo.colorHex}40`,
          }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Area selezionata
            </span>
            <h3
              className="text-xl font-extrabold"
              style={{ color: activeCategoryInfo.id === 'yellow' ? '#854d0e' : activeCategoryInfo.colorHex }}
            >
              {activeCategoryInfo.title}
            </h3>
          </div>
          <button
            onClick={onClearFilter}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            ✕ Mostra tutte
          </button>
        </div>
      )}

      {/* Griglia delle schede didattiche */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(({ item, colorKey }) => (
          <TermCard
            key={item.id || `${colorKey}-${item.title}`}
            item={item}
            colorKey={colorKey}
          />
        ))}
      </div>
    </section>
  );
}

