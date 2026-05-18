import React from 'react';
import { useCurrentFrame } from 'remotion';
import { easeOutExpo, easeOutBack, clamp } from '../utils/easing';

interface Props {
  text: string;
  style?: React.CSSProperties;
  startFrame?: number;
  stagger?: number;
  mode?: 'rise' | 'drop' | 'scale' | 'blur';
  color?: string;
  goldWord?: string;
  goldColor?: string;
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
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px', ...style }}>
      {words.map((word, i) => {
        const delay = startFrame + i * stagger;
        const t = clamp((frame - delay) / 18);
        const eased = mode === 'scale' ? easeOutBack(t) : easeOutExpo(t);

        const isGold = goldWord && word.toLowerCase().includes(goldWord.toLowerCase());

        const transform =
          mode === 'rise' ? `translateY(${(1 - eased) * 40}px)` :
          mode === 'drop' ? `translateY(${(1 - eased) * -40}px)` :
          mode === 'scale' ? `scale(${0.5 + eased * 0.5})` :
          `translateY(${(1 - eased) * 30}px)`;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: t,
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
