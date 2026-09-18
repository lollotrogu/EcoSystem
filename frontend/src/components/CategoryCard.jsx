import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Wrench, Code2, Bot, Glasses, Box, Globe, ArrowUpRight, Check } from 'lucide-react';
import { useTilt, celebrate } from './MotionKit';
import { StarBurst } from './PlayfulEffects';
const iconMoves = { red: [0, -18, 12, 0], purple: [0, 8, -8, 0], blue: [0, -10, 10, 0], green: [0, 12, -12, 0], orange: [0, 90, 90, 0], yellow: [0, 25, -15, 0] };
const icons = { Wrench, Code2, Bot, Glasses, Box, Globe };
const subtitles = { red: 'Costruzioni e circuiti', purple: 'Programmazione e giochi', blue: 'Robot e movimento', green: 'Realtà virtuale e immagini', orange: 'Disegno e stampa 3D', yellow: 'Internet e strumenti digitali' };
export default function CategoryCard({ category, isSelected, onClick, itemCount }) {
  const Icon = icons[category.icon], tilt = useTilt(8);
  const reduced = useReducedMotion();
  const [burst, setBurst] = useState(0);
  return <motion.button className={'category-card group ' + (isSelected ? 'is-selected' : '')} style={{ ...tilt.style, '--accent': category.colorHex }} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave} animate={{ scale: isSelected ? 1.025 : 1 }} whileHover={reduced ? {} : { y: -6 }} whileFocus={reduced ? {} : { y: -4 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 280, damping: 23 }} aria-pressed={isSelected} onClick={e => { setBurst(value => value + 1); if (!isSelected) celebrate(e, category.colorHex); onClick(); }}>
    <span className="category-art" aria-hidden="true"><Icon /><span className="art-dot" /><span className="art-ring" /></span>
    <motion.span className="cursor-spotlight" style={tilt.light} aria-hidden="true" />
    <div className="relative flex justify-between items-center"><motion.span className="category-icon" animate={reduced ? {} : { rotate: isSelected ? iconMoves[category.id] : 0 }} whileHover={reduced ? {} : { rotate: iconMoves[category.id], scale: 1.12 }} transition={{ duration: 0.55 }}><Icon size={34} /><StarBurst burst={burst} color={category.colorHex} /></motion.span></div>
    <div className="relative"><h3>{category.shortTitle}</h3><p>{subtitles[category.id]}</p></div>
    <div className="relative flex justify-between items-center mt-5"><span className="category-count">{isSelected ? <><Check size={18} /> Area attiva</> : itemCount + ' schede'}</span><ArrowUpRight size={24} /></div>
  </motion.button>;
}
