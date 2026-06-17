import React, { useLayoutEffect, useRef, useState } from 'react';
import { useCurrentFrame } from 'remotion';
import { mobinoTheme, MOBINO_SYMBOL_PATH, MOBINO_SYMBOL_VIEWBOX } from '../mobinoTheme';
import { easeInOutCubic, easeOutBack, clamp, prog } from '../utils/easing';

interface Point { x: number; y: number; }

const SAMPLE_STEP = 6; // path units between assembled particles

/**
 * Renders the Mobino "M" mark. Drives three phases off the timeline:
 *  - scatter -> assemble: particles sampled from the real path implode into the outline
 *  - draw: the outline strokes itself on (dash offset)
 *  - lock: solid gradient fill fades in, stroke fades out
 *
 * All phases are optional via the frame windows passed in — pass identical
 * start/end values to skip a phase.
 */
export const MobinoLogo: React.FC<{
  id: string;
  size?: number;
  assembleStart: number;
  assembleEnd: number;
  drawStart: number;
  drawEnd: number;
  lockStart: number;
  lockEnd: number;
  style?: React.CSSProperties;
}> = ({ id, size = 380, assembleStart, assembleEnd, drawStart, drawEnd, lockStart, lockEnd, style = {} }) => {
  const frame = useCurrentFrame();
  const measureRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = useState<Point[] | null>(null);
  const [pathLen, setPathLen] = useState(0);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    setPathLen(len);
    const pts: Point[] = [];
    for (let d = 0; d < len; d += SAMPLE_STEP) {
      const p = el.getPointAtLength(d);
      pts.push({ x: p.x, y: p.y });
    }
    setPoints(pts);
  }, []);

  const gradId = `mobinoGrad-${id}`;

  const assembleP = easeInOutCubic(clamp(prog(frame, assembleStart, assembleEnd)));
  const drawP = clamp(prog(frame, drawStart, drawEnd));
  const lockP = easeOutBack(clamp(prog(frame, lockStart, lockEnd)));
  const strokeOutP = clamp(prog(frame, lockStart, lockEnd));

  const centroid = points
    ? points.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 })
    : { x: 0, y: 0 };
  if (points) { centroid.x /= points.length; centroid.y /= points.length; }

  const SCATTER = 2.6;

  return (
    <div style={{ width: size, height: size * (110.35 / 310.07), position: 'relative', ...style }}>
      <svg viewBox={MOBINO_SYMBOL_VIEWBOX} width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={mobinoTheme.cyan} />
            <stop offset="50%" stopColor={mobinoTheme.purple} />
            <stop offset="100%" stopColor={mobinoTheme.blue} />
          </linearGradient>
        </defs>

        {/* hidden measurement path — provides getTotalLength/getPointAtLength */}
        <path ref={measureRef} d={MOBINO_SYMBOL_PATH} fill="none" opacity={0} />

        {/* assembled particles — implode from scatter to outline */}
        {points && assembleP > 0 && assembleP < 1 && points.map((p, i) => {
          const sx = centroid.x + (p.x - centroid.x) * SCATTER;
          const sy = centroid.y + (p.y - centroid.y) * SCATTER;
          const stagger = clamp((i / points.length) * 0.4);
          const t = clamp((assembleP - stagger) / (1 - stagger));
          const cx = sx + (p.x - sx) * t;
          const cy = sy + (p.y - sy) * t;
          return <circle key={i} cx={cx} cy={cy} r={1.6} fill={`url(#${gradId})`} opacity={0.55 + t * 0.4} />;
        })}

        {/* drawn stroke outline */}
        {pathLen > 0 && drawP > 0 && (
          <path
            d={MOBINO_SYMBOL_PATH}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen * (1 - drawP)}
            opacity={1 - strokeOutP}
          />
        )}

        {/* locked-in solid fill */}
        {lockP > 0 && (
          <path d={MOBINO_SYMBOL_PATH} fill={`url(#${gradId})`} opacity={lockP} />
        )}
      </svg>
    </div>
  );
};
