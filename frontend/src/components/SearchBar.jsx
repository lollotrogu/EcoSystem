import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ searchQuery, onSearchChange, totalResults, isSearching }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0 mb-8">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cerca uno strumento o attività STEM (es. Arduino, Scratch, Robotica)..."
          className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-slate-200 rounded-2xl shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm sm:text-base font-medium"
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Cancella ricerca"
            aria-label="Cancella ricerca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isSearching && (
        <div className="mt-2 text-center text-xs sm:text-sm text-slate-500 font-medium">
          {totalResults === 0 ? (
            <span>Nessun risultato trovato per "{searchQuery}". Prova con un altro termine!</span>
          ) : (
            <span>Trovati <strong className="text-indigo-600">{totalResults}</strong> risultati per "{searchQuery}"</span>
          )}
        </div>
      )}
    </div>
  );
}

