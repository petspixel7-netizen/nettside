import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { easeOutExpo, easeInOutCubic, easeOutBack, clamp, prog } from './utils/easing';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const BG      = '#060912';
const BLUE    = '#2BA8FF';
const BLUE_DIM = '#1A7FCC';
const CARD_W  = 210;
const CARD_H  = 260;

// Center of 1080×1920 canvas
const CX = (1080 - CARD_W) / 2;  // 435
const CY = (1920 - CARD_H) / 2 - 120; // 700

// Background card stream
const BG_CARDS = [
  { id: 0, x:  55,  startY: 1520, speed: 5.8, rot: -2.0 },
  { id: 1, x: 290,  startY: 1780, speed: 6.3, rot:  1.5 },
  { id: 2, x: 560,  startY: 1340, speed: 5.2, rot: -1.0 },
  { id: 3, x: 790,  startY: 1620, speed: 6.0, rot:  2.2 },
  { id: 4, x: 150,  startY: 1920, speed: 6.8, rot: -0.8 },
  { id: 5, x: 680,  startY: 1980, speed: 5.5, rot:  1.2 },
  { id: 6, x: 430,  startY: 2150, speed: 6.4, rot: -1.8 },
  { id: 7, x: 870,  startY: 1430, speed: 5.9, rot:  0.6 },
  { id: 8, x: 200,  startY: 2280, speed: 7.0, rot: -2.4 },
  { id: 9, x: 720,  startY: 1100, speed: 5.3, rot:  1.8 },
];

// Featured card starts inside the stream
const FEAT_X       = 380;
const FEAT_START_Y = 1680;
const FEAT_SPEED   = 5.8;

// Mini particles
const DOTS = Array.from({ length: 55 }, (_, i) => ({
  x:  (i * 137.5) % 100,
  y:  (i * 89.3)  % 100,
  r:  0.6 + (i % 4) * 0.45,
  vy: -(0.007 + (i % 5) * 0.004),
  vx: Math.sin(i * 2.4) * 0.0025,
  op: 0.08 + (i % 4) * 0.07,
  ph: (i * 41) % (Math.PI * 2),
  blue: i % 5 === 0,
}));

// ── Ad card shape ──────────────────────────────────────────────────────────
const Card: React.FC<{ w?: number; h?: number; glow?: number }> = ({
  w = CARD_W, h = CARD_H, glow = 0,
}) => (
  <div style={{
    width: w, height: h,
    borderRadius: 14,
    backgroundColor: lerp(0x0C, 0x0A, glow) === 0 ? '#0C1220' : `rgb(${lerp(12, 8, glow)},${lerp(18, 22, glow)},${lerp(32, 38, glow)})`,
    border: `1px solid rgba(${glow > 0.5 ? '43,168,255' : '26,37,53'},${lerp(0.18, 0.55, glow)})`,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: glow > 0.2
      ? `0 0 ${glow * 40}px rgba(43,168,255,${glow * 0.25}), inset 0 0 ${glow * 20}px rgba(43,168,255,0.04)`
      : 'none',
  }}>
    {/* Image block */}
    <div style={{
      height: '57%',
      background: glow > 0.3
        ? `linear-gradient(140deg, #0D2040 0%, #0A1A38 100%)`
        : 'linear-gradient(140deg, #0F1B2D 0%, #0A1220 100%)',
      borderBottom: `1px solid rgba(${glow > 0.3 ? '43,168,255' : '26,37,53'},${lerp(0.1, 0.3, glow)})`,
    }}>
      <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ height: 5, width: '68%', borderRadius: 3, backgroundColor: glow > 0.3 ? '#1A3A5E' : '#18273C' }} />
        <div style={{ height: 5, width: '42%', borderRadius: 3, backgroundColor: glow > 0.3 ? '#122F4A' : '#121E30' }} />
      </div>
    </div>
    {/* Text block */}
    <div style={{ padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ height: 6, width: '82%', borderRadius: 3, backgroundColor: glow > 0.3 ? '#1C3A5E' : '#1A2B3E' }} />
      <div style={{ height: 6, width: '58%', borderRadius: 3, backgroundColor: glow > 0.3 ? '#152E4A' : '#141E30' }} />
      <div style={{ height: 6, width: '38%', borderRadius: 3, backgroundColor: glow > 0.3 ? '#102440' : '#10182A' }} />
    </div>
    {/* AD badge */}
    <div style={{
      position: 'absolute', top: 9, right: 9,
      background: glow > 0.3 ? `rgba(43,168,255,0.15)` : 'rgba(255,255,255,0.05)',
      border: `1px solid ${glow > 0.3 ? 'rgba(43,168,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 4, padding: '2px 6px',
      fontFamily: 'sans-serif', fontSize: 9,
      color: glow > 0.3 ? BLUE : 'rgba(255,255,255,0.25)',
      letterSpacing: 1.5, fontWeight: 600,
    }}>
      AD
    </div>
  </div>
);

// ── Main scene ─────────────────────────────────────────────────────────────
export const IgnoredAds: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera push-in (whole scene slowly zooms in 3%)
  const cam = 1 + 0.03 * easeInOutCubic(clamp(prog(frame, 0, 120)));

  // ── Featured card ──────────────────────────────────────────────────────
  const streamY   = FEAT_START_Y - frame * FEAT_SPEED;
  const toCenter  = easeOutExpo(clamp(prog(frame, 22, 52)));
  const glow      = easeOutExpo(clamp(prog(frame, 28, 50)));

  // X: blend from stream x → center x
  const fcX       = lerp(FEAT_X, CX, toCenter);
  // Y: blend from stream y → center y
  const fcY       = lerp(streamY, CY, toCenter);
  // Scale: grow slightly when centered
  const fcScale   = lerp(1.0, 1.14, toCenter);

  // Hold pulse (55–70)
  const holdPulse = (frame >= 55 && frame < 70)
    ? 1 + 0.012 * Math.sin((frame - 55) * 0.35)
    : 1;

  // Swipe left (70–90)
  const swipeT    = easeInOutCubic(clamp(prog(frame, 70, 90)));
  const swipeX    = swipeT * -1300;
  const swipeBlur = swipeT * 22;
  const swipeStrX = 1 + swipeT * 0.35; // horizontal stretch

  // Final featured card transforms
  const finalX    = frame < 70 ? fcX   : fcX + swipeX;
  const finalY    = frame < 70 ? fcY   : fcY;
  const finalS    = fcScale * holdPulse * cam;
  const fcOpacity = frame >= 88 ? 1 - clamp(prog(frame, 88, 94)) : 1;
  const showFeat  = frame < 95;

  // Background cards fade as featured moves to center
  const bgOpacity = frame < 22  ? 1.0
    : frame < 50  ? lerp(1.0, 0.18, easeOutExpo(clamp(prog(frame, 22, 46))))
    : frame < 88  ? 0.18
    :               lerp(0.18, 0.04, clamp(prog(frame, 88, 108)));

  // ── Headline ──────────────────────────────────────────────────────────
  const L1 = easeOutExpo(clamp(prog(frame, 83,  101)));
  const L2 = easeOutExpo(clamp(prog(frame, 93,  113)));
  const glowV = frame > 112 ? 0.7 + 0.3 * Math.sin((frame - 112) * 0.14) : L2;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>

      {/* ── Background blue radial glow ─────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 65% 45% at 50% 55%, ${BLUE}14 0%, transparent 70%)`,
        transform: `scale(${cam})`,
      }} />

      {/* ── Moving grid ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(43,168,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(43,168,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '70px 70px',
        backgroundPosition: `${(frame * 0.25) % 70}px ${(frame * 0.18) % 70}px`,
        transform: `scale(${cam})`,
      }} />

      {/* ── Particles ───────────────────────────────────────────────── */}
      {DOTS.map((d, i) => {
        const px = ((d.x + frame * d.vx * 100) % 100 + 100) % 100;
        const py = ((d.y + frame * d.vy * 100) % 100 + 100) % 100;
        const p  = 0.45 + 0.55 * Math.sin(frame * 0.07 + d.ph);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${px}%`, top: `${py}%`,
            width: d.r, height: d.r,
            borderRadius: '50%',
            backgroundColor: d.blue ? BLUE : 'rgba(255,255,255,0.6)',
            opacity: d.op * p,
            boxShadow: d.r > 0.8 && d.blue ? `0 0 ${d.r * 4}px ${BLUE}77` : 'none',
          }} />
        );
      })}

      {/* ── Background floating ad cards ────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: bgOpacity,
        transform: `scale(${cam})`,
        transformOrigin: 'center center',
      }}>
        {BG_CARDS.map(c => {
          const y = c.startY - frame * c.speed;
          if (y > 2000 || y < -CARD_H - 20) return null;
          return (
            <div key={c.id} style={{
              position: 'absolute',
              left: c.x, top: y,
              transform: `rotate(${c.rot}deg)`,
            }}>
              <Card />
            </div>
          );
        })}
      </div>

      {/* ── Featured card ───────────────────────────────────────────── */}
      {showFeat && (
        <div style={{
          position: 'absolute',
          left: finalX,
          top: finalY,
          transformOrigin: 'center center',
          transform: `scale(${finalS * swipeStrX}, ${finalS})`,
          filter: swipeBlur > 0.5 ? `blur(${swipeBlur}px)` : 'none',
          opacity: fcOpacity,
          zIndex: 5,
        }}>
          <Card glow={glow} />
        </div>
      )}

      {/* ── Headline ────────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        gap: 8, pointerEvents: 'none',
        paddingTop: 40,
      }}>
        {/* "Vanlige annonser" */}
        <div style={{
          opacity: L1,
          transform: `translateY(${lerp(22, 0, L1)}px)`,
          filter: `blur(${lerp(5, 0, easeOutExpo(L1))}px)`,
        }}>
          <span style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: 96,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-3px',
            lineHeight: 1.05,
            textShadow: '0 4px 40px rgba(0,0,0,0.9)',
            display: 'block',
            textAlign: 'center',
          }}>
            Vanlige annonser
          </span>
        </div>

        {/* "blir ignorert." */}
        <div style={{
          opacity: L2,
          transform: `translateY(${lerp(22, 0, L2)}px)`,
          filter: `blur(${lerp(7, 0, easeOutExpo(L2))}px)`,
        }}>
          <span style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: '-3px',
            lineHeight: 1.05,
            display: 'block',
            textAlign: 'center',
          }}>
            <span style={{ color: '#FFFFFF', textShadow: '0 4px 40px rgba(0,0,0,0.9)' }}>
              blir{' '}
            </span>
            <span style={{
              color: BLUE,
              textShadow: [
                `0 0 ${20 + glowV * 35}px ${BLUE}`,
                `0 0 ${50 + glowV * 60}px rgba(43,168,255,0.5)`,
                `0 0 ${90 + glowV * 80}px rgba(43,168,255,0.2)`,
              ].join(', '),
            }}>
              ignorert.
            </span>
          </span>
        </div>
      </AbsoluteFill>

      {/* ── Vignette ────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />

    </AbsoluteFill>
  );
};
