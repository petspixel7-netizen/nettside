import React from 'react';
import { useCurrentFrame } from 'remotion';
import { theme } from '../theme';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  phase: number;
}

const PARTICLES: Particle[] = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 73.1) % 100,
  size: 1 + (i % 4) * 0.8,
  speed: 0.008 + (i % 5) * 0.004,
  drift: Math.sin(i * 2.4) * 0.6,
  opacity: 0.15 + (i % 3) * 0.12,
  phase: (i * 47) % (Math.PI * 2),
}));

export const Particles: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {PARTICLES.map((p, i) => {
        const t = frame * p.speed + p.phase;
        const x = (p.x + Math.sin(t * 0.7 + p.phase) * p.drift * 3) % 100;
        const y = ((p.y - frame * p.speed * 8) % 100 + 100) % 100;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + p.phase);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: i % 5 === 0 ? theme.goldLight : theme.gold,
              opacity: p.opacity * pulse * intensity,
              boxShadow: p.size > 2.5 ? `0 0 ${p.size * 3}px ${theme.gold}88` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};
