import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import FullscreenModal from './FullscreenModal';
import { resolveAssetUrl } from '../utils/assetHelper';
import { useTilt, useMagnet } from './MotionKit';

export default function InteractiveHero() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);
  const close = useCallback(() => setIsFullscreen(false), []);
  const tilt = useTilt(3);
  const magnet = useMagnet();
  const homeImage = resolveAssetUrl('/assets/img/immagine_home.png');

  return (
    <section className="map-section page-section" aria-label="Mappa STEM">
      <motion.div className="map-frame" style={tilt.style}
        onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
        <div className="orbit-border" aria-hidden="true" />
        <div className="map-surface">
          <div className="map-toolbar">
            <h2>La mappa STEM</h2>
            <motion.button {...magnet} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(true)} aria-label="Ingrandisci la mappa">
              <Maximize2 size={22} /><span>Ingrandisci</span>
            </motion.button>
          </div>
          <button className="map-image-button" onClick={() => setIsFullscreen(true)}
            aria-label="Esplora la mappa STEM a schermo intero">
            {failed ? <span>Mappa non disponibile. Scegli un’area qui sotto.</span> :
              <img src={homeImage} alt="Mappa concettuale EcosiStem" onError={() => setFailed(true)} />}
          </button>
        </div>
      </motion.div>
      <FullscreenModal isOpen={isFullscreen} onClose={close} imageSrc={homeImage}
        alt="Mappa concettuale EcosiStem a schermo intero" />
    </section>
  );
}

