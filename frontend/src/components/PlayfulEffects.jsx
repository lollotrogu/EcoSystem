import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';

// A small, fixed number of particles; no timers or pointer-driven React updates.
export function StarBurst({ burst, color = '#8c52ff' }) {
  const reduced = useReducedMotion();
  if (reduced || !burst) return null;
  return <span className="star-burst" aria-hidden="true">
    {Array.from({ length: 8 }, (_, i) => {
      const angle = i * Math.PI / 4;
      return <motion.span key={`${burst}-${i}`} initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
        animate={{ x: Math.cos(angle) * 65, y: Math.sin(angle) * 55, scale: [0, 1.1, 0.4], opacity: [1, 1, 0], rotate: i * 45 }}
        transition={{ duration: 0.65, ease: 'easeOut' }} style={{ color }}><Star size={15} fill="currentColor" /></motion.span>;
    })}
  </span>;
}

export function PlayfulHint({ message, onClose }) {
  React.useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 7000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          className="playful-hint"
          role="status"
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 24 }}
        >
          <span className="hint-text">{message}</span>
          {onClose && (
            <button
              type="button"
              className="hint-close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Chiudi suggerimento"
            >
              ×
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
