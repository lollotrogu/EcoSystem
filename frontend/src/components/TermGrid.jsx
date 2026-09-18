import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import TermCard from './TermCard';
import FullscreenModal from './FullscreenModal';
import { CATEGORY_MAP } from '../constants/categories';
import { Telescope } from 'lucide-react';
export default function TermGrid({ items, selectedCategory, onClearFilter, searchQuery }) {
  const [image, setImage] = useState(null), reduced = useReducedMotion();
  const close = useCallback(() => setImage(null), []);
  const active = CATEGORY_MAP[selectedCategory];
  return <section className="page-section term-section" aria-labelledby="activities-title">
    <div className="section-heading"><div><h2 id="activities-title">{active?.title || 'Tutte le attività'}<span className="total-pill">{items.length}</span></h2></div>{(selectedCategory || searchQuery) && <button className="text-button" onClick={onClearFilter}>Azzera filtri ×</button>}</div>
    <motion.div layout={!reduced} className="term-grid" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.05 } } }}>
      <AnimatePresence mode="popLayout">{items.map(({ item, colorKey }) => <TermCard key={colorKey + '-' + (item.id || item.title)} item={item} colorKey={colorKey} onOpenImageFullscreen={(src, alt) => setImage({ src, alt })} />)}</AnimatePresence>
    </motion.div>
    {items.length === 0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state"><Telescope size={45} /><h3>Nessuna attività trovata</h3><p>Prova un’altra parola o esplora tutte le aree.</p><button className="explore-button" onClick={onClearFilter}>Mostra tutte le attività</button></motion.div>}
    <FullscreenModal isOpen={Boolean(image)} onClose={close} imageSrc={image?.src} alt={image?.alt} />
  </section>;
}
