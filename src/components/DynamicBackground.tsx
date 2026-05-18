import React from 'react';
import { useCurrentFrame } from 'remotion';
import { theme } from '../theme';

// Floating orb definition
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
  { cx: 30, cy: 40, rx: 18, ry: 12, speedX: 0.007, speedY: 0.009, phaseX: 0,    phaseY: 1.2, size: 700, color: theme.gold,    opacity: 0.12 },
  { cx: 70, cy: 60, rx: 14, ry: 20, speedX: 0.009, speedY: 0.006, phaseX: 2.1,  phaseY: 0.4, size: 900, color: '#3B82F6',      opacity: 0.07 },
  { cx: 50, cy: 20, rx: 20, ry: 10, speedX: 0.005, speedY: 0.011, phaseX: 1.0,  phaseY: 3.0, size: 600, color: theme.goldLight, opacity: 0.09 },
  { cx: 20, cy: 80, rx: 12, ry: 16, speedX: 0.011, speedY: 0.007, phaseX: 4.2,  phaseY: 0.8, size: 500, color: theme.gold,    opacity: 0.08 },
  { cx: 80, cy: 25, rx: 16, ry: 14, speedX: 0.008, speedY: 0.010, phaseX: 2.8,  phaseY: 2.2, size: 650, color: '#8B5CF6',      opacity: 0.05 },
];

// Particles
const N = 80;
const PARTS = Array.from({ length: N }, (_, i) => ({
  x: (i * 137.508) % 100,
  y: (i * 89.33) % 100,
  size: 0.8 + (i % 5) * 0.5,
  vx: (Math.sin(i * 2.4) * 0.012),
  vy: -(0.010 + (i % 4) * 0.006),
  op: 0.1 + (i % 4) * 0.08,
  phase: (i * 41) % (Math.PI * 2),
}));

// Sweeping light beams
const BEAMS = [
  { angle: -30, speed: 0.004, width: 80,  opacity: 0.04 },
  { angle:  20, speed: 0.003, width: 140, opacity: 0.025 },
  { angle: -50, speed: 0.006, width: 60,  opacity: 0.03 },
];

export const DynamicBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame;

  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: theme.bg, overflow: 'hidden' }}>

      {/* Animated gradient orbs */}
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

      {/* Thin grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        backgroundPosition: `${(t * 0.3) % 80}px ${(t * 0.2) % 80}px`,
      }} />

      {/* Sweeping light beams */}
      {BEAMS.map((beam, i) => {
        const pos = ((t * beam.speed + i * 0.33) % 1) * 220 - 60;
        return (
          <div key={i} style={{
            position: 'absolute',
            top: '-20%', bottom: '-20%',
            left: `${pos}%`,
            width: beam.width,
            background: `linear-gradient(90deg, transparent, ${theme.gold}, transparent)`,
            transform: `rotate(${beam.angle}deg)`,
            opacity: beam.opacity,
            pointerEvents: 'none',
          }} />
        );
      })}

      {/* Particles */}
      {PARTS.map((p, i) => {
        const x = ((p.x + t * p.vx * 100 + Math.sin(t * 0.02 + p.phase) * 2) % 100 + 100) % 100;
        const y = ((p.y + t * p.vy * 100) % 100 + 100) % 100;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.08 + p.phase);
        const isGold = i % 6 < 4;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: p.size + pulse * 0.5,
            height: p.size + pulse * 0.5,
            borderRadius: '50%',
            background: isGold ? theme.gold : theme.goldLight,
            opacity: p.op * pulse,
            boxShadow: p.size > 1.8 ? `0 0 ${p.size * 4}px ${theme.gold}66` : 'none',
            pointerEvents: 'none',
          }} />
        );
      })}

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};
