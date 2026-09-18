import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import InteractiveHero from './components/InteractiveHero';
import SearchBar from './components/SearchBar';
import CategoryGrid from './components/CategoryGrid';
import TermGrid from './components/TermGrid';
import { CATEGORIES } from './constants/categories';
import { Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Caricamento dati da backend API (con fallback su file statico JSON)
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Prova prima l'endpoint API backend protetto
      let response = await fetch('/api/glossario', {
        headers: { Accept: 'application/json' },
      }).catch(() => null);

      // 2. Se fallisce (es. server PHP non avviato durante vite dev), usa il percorso statico locale
      if (!response || !response.ok) {
        response = await fetch('/assets/data/glossario.json', {
          headers: { Accept: 'application/json' },
        });
      }

      if (!response.ok) {
        throw new Error(`Impossibile recuperare i dati (HTTP ${response.status})`);
      }

      const json = await response.json();
      setDataset(json);
    } catch (err) {
      console.error('Errore caricamento glossario:', err);
      setError('Si è verificato un errore nel caricamento delle schede didattiche.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Conteggio schede per ciascuna categoria
  const countsByCategory = useMemo(() => {
    if (!dataset) return {};
    const counts = {};
    CATEGORIES.forEach((c) => {
      counts[c.id] = Array.isArray(dataset[c.id]) ? dataset[c.id].length : 0;
    });
    return counts;
  }, [dataset]);

  // Appiattimento e filtraggio degli elementi
  const filteredItems = useMemo(() => {
    if (!dataset) return [];

    const items = [];
    const query = searchQuery.toLowerCase().trim();

    CATEGORIES.forEach((cat) => {
      // Se una categoria è selezionata e non corrisponde, salta
      if (selectedCategory && selectedCategory !== cat.id) {
        return;
      }

      const list = Array.isArray(dataset[cat.id]) ? dataset[cat.id] : [];
      list.forEach((item) => {
        // Se c'è una query di ricerca, verifica corrispondenza su titolo o descrizione
        if (query) {
          const matchTitle = (item.title || '').toLowerCase().includes(query);
          const matchDesc = (item.description || '').toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) {
            return;
          }
        }

        items.push({
          item,
          colorKey: cat.id,
        });
      });
    });

    return items;
  }, [dataset, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen py-6 sm:py-10 px-2 sm:px-6 flex justify-center">
      <main className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Banner Istituzionale e Titolo */}
        <Header />

        {/* Mappa Concettuale Interattiva */}
        <InteractiveHero />

        {/* Barra di Ricerca in tempo reale */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalResults={filteredItems.length}
          isSearching={Boolean(searchQuery.trim())}
        />

        {/* Stato di caricamento o errore */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
            <p className="text-sm font-medium">Caricamento delle attività STEM...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <p className="text-red-500 font-semibold mb-3">{error}</p>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Riprova</span>
            </button>
          </div>
        ) : (
          <>
            {/* Griglia delle 6 Categorie STEM */}
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              countsByCategory={countsByCategory}
            />

            {/* Griglia delle Schede Didattiche */}
            <TermGrid
              items={filteredItems}
              selectedCategory={selectedCategory}
              onClearFilter={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              searchQuery={searchQuery}
            />
          </>
        )}

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-100 py-6 px-6 text-center text-xs text-slate-500 bg-slate-50">
          <p className="font-medium">
            EcosiStem — Istituto Comprensivo “U. Amaldi” di Cadeo (PC)
          </p>
          <p className="mt-1 text-slate-400">
            Portale didattico per il curricolo digitale e le materie STEM nella scuola secondaria di primo grado.
          </p>
        </footer>
      </main>
    </div>
  );
}

