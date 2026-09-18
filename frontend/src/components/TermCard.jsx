import React, { useState, forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Maximize2 } from 'lucide-react';
import { CATEGORY_MAP } from '../constants/categories';
import { resolveAssetUrl } from '../utils/assetHelper';
const AGE_TAGS = [
  { id: 'infanzia', label: 'Infanzia', icon: '🧸' },
  { id: 'primaria', label: 'Primaria', icon: '📚' },
  { id: 'secondaria', label: 'Secondaria', icon: '🎓' },
];
const TermCard = forwardRef(function TermCard({ item, colorKey, onOpenImageFullscreen }, ref) {
  const category = CATEGORY_MAP[colorKey], reduced = useReducedMotion();
  const [failed, setFailed] = useState(false), [ripple, setRipple] = useState(0);
  const imageSrc = item.image ? resolveAssetUrl(item.image) : '';
  const linkHref = item.link ? resolveAssetUrl(item.link) : '';
  return <motion.article ref={ref} layout={!reduced} whileHover={reduced ? {} : { y: -5 }} variants={{ hidden: { opacity: 0, y: reduced ? 0 : 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 20 } } }} exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }} transition={{ duration: 0.25 }} className="term-card group" style={{ '--accent': category.colorHex }}>
    <div className="term-image"><span className="term-category">{category.shortTitle}</span>{imageSrc && !failed ? <button onClick={() => onOpenImageFullscreen(imageSrc, item.title)} aria-label={'Ingrandisci immagine: ' + item.title} className="term-image-button"><img loading="lazy" decoding="async" src={imageSrc} alt={item.title} onError={() => setFailed(true)} /><span className="image-ray" /><span className="image-expand"><Maximize2 size={16} /></span></button> : <div className="image-placeholder"><BookOpen size={38} /><span>Idee da mettere in pratica</span></div>}</div>
    <div className="term-body"><h3>{item.title}</h3><p>{item.description || 'Attività del curricolo in fase di aggiornamento.'}</p></div>
    <div className="term-footer">{linkHref ? <motion.a className="learn-button" href={linkHref} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.97 }} onClick={() => setRipple(v => v + 1)}><span>Per approfondire</span><ArrowUpRight size={18} />{ripple > 0 && <motion.i key={ripple} className="click-ripple" initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 6, opacity: 0 }} transition={{ duration: 0.55 }} />}</motion.a> : <div className="internal-label"><BookOpen size={14} /> Da sperimentare in laboratorio</div>}
    <div className="age-tags">{AGE_TAGS.map(tag => { const assigned = item.ageTags?.includes(tag.id); return <span key={tag.id} className={'age-tag ' + (assigned ? 'assigned' : '')} title={assigned ? 'Attività adatta alla scuola ' + tag.label.toLowerCase() : 'Grado scolastico non indicato'}>{assigned && <span className="tag-icon" aria-hidden="true">{tag.icon}</span>}{tag.label}</span>; })}</div></div>
  </motion.article>;
});
export default TermCard;
