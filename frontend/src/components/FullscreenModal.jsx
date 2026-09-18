import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
export default function FullscreenModal({ isOpen, onClose, imageSrc, alt = 'Immagine a schermo intero' }) {
  const closeRef = useRef(null), reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    setFailed(false);
    const previousFocus = document.activeElement, previousOverflow = document.body.style.overflow;
    const root = document.getElementById('root');
    const wasInert = root?.inert;
    if (root) root.inert = true;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const keydown = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus(); }
    };
    window.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = previousOverflow; if (root) root.inert = wasInert; window.removeEventListener('keydown', keydown); previousFocus?.focus(); };
  }, [isOpen, onClose]);
  return createPortal(<AnimatePresence>{isOpen && <motion.div className="fullscreen-backdrop" role="dialog" aria-modal="true" aria-label={alt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Chiudi visualizzazione a schermo intero" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><X size={24} /></motion.button>
    <motion.div className="modal-content" onClick={e => e.stopPropagation()} initial={{ scale: reduced ? 1 : 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: reduced ? 1 : 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 230 }} drag={reduced ? false : 'y'} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.35} onDragEnd={(_, info) => { if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 700) onClose(); }}>
      {failed ? <p className="p-10 bg-white rounded-2xl">Immagine non disponibile.</p> : <img draggable="false" src={imageSrc} alt={alt} onError={() => setFailed(true)} />}
    </motion.div><p className="modal-hint">Esc o clic all’esterno per chiudere · su touch, trascina la mappa</p>
  </motion.div>}</AnimatePresence>, document.body);
}
