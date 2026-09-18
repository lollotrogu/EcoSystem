import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
export function useMagnet() {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  return { style: { x, y }, onPointerMove(e) {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.15);
    y.set((e.clientY - r.top - r.height / 2) * 0.15);
  }, onPointerLeave() { x.set(0); y.set(0); } };
}
export function useTilt(strength = 5) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const lightX = useMotionValue(0), lightY = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 24 });
  return {
    style: { rotateX, rotateY, transformPerspective: 1000 },
    light: { x: lightX, y: lightY },
    onPointerMove(e) {
      if (reduced || e.pointerType !== 'mouse') return;
      const r = e.currentTarget.getBoundingClientRect();
      x.set(-(e.clientY - r.top - r.height / 2) / r.height * strength);
      y.set((e.clientX - r.left - r.width / 2) / r.width * strength);
      lightX.set(e.clientX - r.left - 100); lightY.set(e.clientY - r.top - 100);
    },
    onPointerLeave() { x.set(0); y.set(0); },
  };
}
export function celebrate(event, color) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = event.currentTarget.getBoundingClientRect();
  confetti({ particleCount: 26, spread: 65, startVelocity: 18, gravity: 0.8,
    ticks: 95, scalar: 0.65, disableForReducedMotion: true, colors: [color, '#ffffff', '#a5f3fc'],
    origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight } });
}
