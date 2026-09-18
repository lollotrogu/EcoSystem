import React from 'react';
import { Sparkles, School } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white py-10 px-6 sm:px-10 text-center shadow-lg">
      {/* Elementi grafici di sfondo */}
      <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-12 translate-y-12 w-56 h-56 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-emerald-50 text-xs sm:text-sm font-medium tracking-wide">
          <School className="w-4 h-4" />
          <span>Istituto Comprensivo “U. Amaldi” - Cadeo (PC)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm flex items-center justify-center gap-3">
          <span>EcosiStem</span>
          <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
        </h1>

        <p className="text-base sm:text-xl text-emerald-100 font-light max-w-2xl mx-auto">
          Esplora il nostro curricolo digitale e le attività STEM
        </p>
      </div>
    </header>
  );
}

