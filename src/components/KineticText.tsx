import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { easeOutExpo, easeOutBack, clamp } from '../utils/easing';
import { springValue, springPresets, type SpringConfig } from '../utils/spring';

interface Props {
  text: string;
  style?: React.CSSProperties;
  startFrame?: number;
  stagger?: number;
  mode?: 'rise' | 'drop' | 'scale' | 'blur' | 'spring';
  color?: string;
  goldWord?: string;
  goldColor?: string;
  springPreset?: keyof typeof springPresets;
}

export const KineticText: React.FC<Props> = ({
  text,
  style = {},
  startFrame = 0,
  stagger = 2,
  mode = 'rise',
  color = '#FFFFFF',
  goldWord,
  goldColor = '#D4AF37',
  springPreset = 'bouncy',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px', ...style }}>
      {words.map((word, i) => {
        const delay = startFrame + i * stagger;
        const t = mode === 'spring'
          ? springValue(frame, fps, { ...springPresets[springPreset] as SpringConfig & { durationInSeconds?: number; bounce?: number }, delayFrames: delay })
          : clamp((frame - delay) / 18);
        const eased = mode === 'scale' || mode === 'spring' ? easeOutBack(clamp(t)) : easeOutExpo(t);

        const isGold = goldWord && word.toLowerCase().includes(goldWord.toLowerCase());

        const transform =
          mode === 'rise' ? `translateY(${(1 - eased) * 40}px)` :
          mode === 'drop' ? `translateY(${(1 - eased) * -40}px)` :
          mode === 'scale' ? `scale(${0.5 + eased * 0.5})` :
          mode === 'spring' ? `translateY(${(1 - t) * 40}px) scale(${0.7 + Math.min(t, 1.15) * 0.3})` :
          `translateY(${(1 - eased) * 30}px)`;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: clamp(t, 0, 1),
              transform,
              filter: mode === 'blur' ? `blur(${(1 - eased) * 12}px)` : 'none',
              color: isGold ? goldColor : color,
              transition: 'none',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
