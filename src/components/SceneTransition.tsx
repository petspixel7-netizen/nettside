import React from 'react';
import { useCurrentFrame } from 'remotion';
import { theme } from '../theme';
import { clamp, easeInOutCubic } from '../utils/easing';

export const FadeIn: React.FC<{ children: React.ReactNode; duration?: number }> = ({
  children,
  duration = 20,
}) => {
  const frame = useCurrentFrame();
  const t = easeInOutCubic(clamp(frame / duration));
  return <div style={{ opacity: t, width: '100%', height: '100%' }}>{children}</div>;
};

export const FadeOut: React.FC<{
  children: React.ReactNode;
  totalFrames: number;
  fadeStart: number;
}> = ({ children, totalFrames, fadeStart }) => {
  const frame = useCurrentFrame();
  const t = 1 - easeInOutCubic(clamp((frame - fadeStart) / (totalFrames - fadeStart)));
  return <div style={{ opacity: t, width: '100%', height: '100%' }}>{children}</div>;
};

export const SlashWipe: React.FC<{ startFrame?: number }> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const t = easeInOutCubic(clamp((frame - startFrame) / 20));
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: theme.gold,
      clipPath: `polygon(${(t - 0.1) * 120}% 0, ${t * 120}% 0, ${(t - 0.5) * 120}% 100%, ${(t - 0.6) * 120}% 100%)`,
      zIndex: 100,
      pointerEvents: 'none',
    }} />
  );
};
