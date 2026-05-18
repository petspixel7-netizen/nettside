import React from 'react';
import { useCurrentFrame } from 'remotion';
import { theme } from '../theme';
import { easeOutExpo, clamp } from '../utils/easing';

export const GlowLine: React.FC<{ startFrame?: number; width?: number }> = ({
  startFrame = 0,
  width = 500,
}) => {
  const frame = useCurrentFrame();
  const t = easeOutExpo(clamp((frame - startFrame) / 25));
  const shimmer = (Math.sin(frame * 0.1) + 1) / 2;

  return (
    <div style={{ position: 'relative', height: 3, width: t * width, overflow: 'visible' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(90deg, transparent, ${theme.gold}, ${theme.goldLight}, ${theme.gold}, transparent)`,
        borderRadius: 3,
        boxShadow: `0 0 ${8 + shimmer * 8}px ${theme.gold}, 0 0 ${20 + shimmer * 10}px ${theme.gold}66`,
      }} />
    </div>
  );
};
