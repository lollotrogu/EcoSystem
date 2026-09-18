import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function FullscreenModal({ isOpen, onClose, imageSrc, alt = 'Immagine a schermo intero' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all transform hover:scale-110 shadow-lg focus:outline-none"
        title="Chiudi (Esc)"
        aria-label="Chiudi visualizzazione a schermo intero"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative max-w-7xl max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-pop-in"
        />
      </div>
    </div>
  );
}

