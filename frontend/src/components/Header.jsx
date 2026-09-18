import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, School, Orbit, Bot } from 'lucide-react';
import { celebrate } from './MotionKit';
import { StarBurst, PlayfulHint } from './PlayfulEffects';

export default function Header() {
  const [burst, setBurst] = useState(0);
  const [hello, setHello] = useState(0);
  const reduced = useReducedMotion();
  const messages = ['Ciao! Scegli un’area qui sotto.', 'Ti piacciono i robot? Prova Robotica!', 'Vuoi creare un gioco? Prova Coding!', 'Cerca uno strumento che conosci!'];
  return (
    <header className="portal-header">
      <div>
        <div className="portal-title">
          <Orbit size={40} aria-hidden="true" />
          <h1>EcosiStem</h1>
          <motion.button
            aria-label="Fai brillare le stelle"
            className="spark-button"
            whileHover={{ rotate: 15, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={event => { setBurst(value => value + 1); celebrate(event, '#8c52ff'); }}
          >
            <Sparkles size={30} /><StarBurst burst={burst} />
          </motion.button>
        </div>
        <p>Attività e strumenti per imparare le STEM</p>
      </div>
      <div className="header-tools">
        <div className="robot-helper"><motion.button className="robot-button" aria-label="Chiedi un suggerimento al robot" onClick={() => setHello(value => value + 1)} whileHover={reduced ? {} : { rotate: [0, -12, 12, 0], y: -3 }} whileTap={{ scale: 0.85 }}><Bot size={32} /><span className="robot-wave" aria-hidden="true">✦</span></motion.button><PlayfulHint message={hello ? messages[(hello - 1) % messages.length] : null} /></div>
      <div className="school-badge">
        <School size={21} aria-hidden="true" />
        <span>I.C. “U. Amaldi” · Cadeo (PC)</span>
      </div>
      </div>
    </header>
  );
}

