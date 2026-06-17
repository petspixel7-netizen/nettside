import React from 'react';
import { useCurrentFrame } from 'remotion';
import { mobinoTheme } from '../mobinoTheme';

interface Orb {
  cx: number; cy: number;
  rx: number; ry: number;
  speedX: number; speedY: number;
  phaseX: number; phaseY: number;
  size: number;
  color: string;
  opacity: number;
}

const ORBS: Orb[] = [
  { cx: 26, cy: 38, rx: 18, ry: 12, speedX: 0.007, speedY: 0.009, phaseX: 0,   phaseY: 1.2, size: 750, color: mobinoTheme.cyan,   opacity: 0.10 },
  { cx: 74, cy: 62, rx: 14, ry: 20, speedX: 0.009, speedY: 0.006, phaseX: 2.1, phaseY: 0.4, size: 900, color: mobinoTheme.purple, opacity: 0.09 },
  { cx: 52, cy: 18, rx: 20, ry: 10, speedX: 0.005, speedY: 0.011, phaseX: 1.0, phaseY: 3.0, size: 600, color: mobinoTheme.blue,   opacity: 0.10 },
  { cx: 18, cy: 78, rx: 12, ry: 16, speedX: 0.011, speedY: 0.007, phaseX: 4.2, phaseY: 0.8, size: 520, color: mobinoTheme.cyan,   opacity: 0.07 },
];

const N = 70;
const PARTS = Array.from({ length: N }, (_, i) => ({
  x: (i * 137.508) % 100,
  y: (i * 89.33) % 100,
  size: 0.8 + (i % 5) * 0.5,
  vx: Math.sin(i * 2.4) * 0.012,
  vy: -(0.010 + (i % 4) * 0.006),
  op: 0.12 + (i % 4) * 0.08,
  phase: (i * 41) % (Math.PI * 2),
}));

export const MobinoBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: `linear-gradient(160deg, ${mobinoTheme.bg} 0%, ${mobinoTheme.bg2} 100%)` }}>
      {ORBS.map((orb, i) => {
        const x = orb.cx + Math.sin(t * orb.speedX + orb.phaseX) * orb.rx;
        const y = orb.cy + Math.cos(t * orb.speedY + orb.phaseY) * orb.ry;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: orb.size, height: orb.size,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            opacity: orb.opacity,
            pointerEvents: 'none',
          }} />
        );
      })}

      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(66,217,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(66,217,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '90px 90px',
        backgroundPosition: `${(t * 0.25) % 90}px ${(t * 0.18) % 90}px`,
      }} />

      {PARTS.map((p, i) => {
        const x = ((p.x + t * p.vx * 100 + Math.sin(t * 0.02 + p.phase) * 2) % 100 + 100) % 100;
        const y = ((p.y + t * p.vy * 100) % 100 + 100) % 100;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.08 + p.phase);
        const colors = [mobinoTheme.cyan, mobinoTheme.purple, mobinoTheme.blue];
        const color = colors[i % colors.length];
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: p.size + pulse * 0.5,
            height: p.size + pulse * 0.5,
            borderRadius: '50%',
            background: color,
            opacity: p.op * pulse,
            boxShadow: p.size > 1.8 ? `0 0 ${p.size * 4}px ${color}aa` : 'none',
            pointerEvents: 'none',
          }} />
        );
      })}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 48%, transparent 38%, rgba(0,0,0,0.65) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};
