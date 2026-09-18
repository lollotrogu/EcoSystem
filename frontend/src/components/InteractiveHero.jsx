import React, { useState } from 'react';
import { Maximize2, Sparkles } from 'lucide-react';
import FullscreenModal from './FullscreenModal';
import { resolveAssetUrl } from '../utils/assetHelper';

export default function InteractiveHero() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const homeImage = resolveAssetUrl('/assets/img/immagine_home.png');

  return (
    <section className="my-8 px-4 sm:px-8">
      {/* Container mappa grafica */}
      <div className="relative group max-w-5xl mx-auto bg-white rounded-2xl p-3 sm:p-5 shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
          <img
            src={homeImage}
            alt="Mappa interattiva EcosiSTEM"
            className="w-full h-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-[1.01]"
            onClick={() => setIsFullscreen(true)}
            onError={(e) => {
              // Se per qualche motivo immagine_home non viene caricata
              e.target.style.display = 'none';
            }}
          />

          {/* Overlay pulsante ingrandimento */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 shadow-md backdrop-blur-md font-medium text-xs sm:text-sm transition-all duration-200 hover:scale-105 border border-slate-200/80"
              title="Visualizza a schermo intero"
            >
              <Maximize2 className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Schermo Intero</span>
            </button>
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-900/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Clicca sull'immagine per esplorare in dettaglio</span>
          </div>
        </div>
      </div>

      {/* Titolo di sezione */}
      <div className="text-center mt-10 mb-6 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Esplora le Aree del Glossario STEM
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Raccolta di attività, tecnologie e strumenti per lo sviluppo delle competenze digitali e scientifiche.
        </p>
      </div>

      {/* Modale a schermo intero */}
      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        imageSrc={homeImage}
        alt="Mappa concettuale EcosiSTEM a schermo intero"
      />
    </section>
  );
}

