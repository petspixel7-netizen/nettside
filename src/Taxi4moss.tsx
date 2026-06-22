import React, { useEffect, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, continueRender, delayRender } from 'remotion';
import { easeOutExpo, easeInOutCubic, easeOutBack, clamp, prog, presence } from './utils/easing';

// ── Brand palette: Neon ──────────────────────────────────────────────────────
const C = {
  bg:       '#070014',
  bgDeep:   '#03000A',
  pink:     '#FF1FA0',
  pinkHot:  '#FF4FC0',
  cyan:     '#00F0FF',
  cyanSoft: '#5FF8FF',
  yellow:   '#F6FF00',
  violet:   '#B026FF',
  white:    '#FFFFFF',
};

const FONT = '"Anton", "Bebas Neue", "Impact", "Arial Black", sans-serif';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Custom "slam" ease — overshoot with quick settle
const slamEase = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  // Fast accel then heavy back-overshoot
  const c1 = 2.1;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Screen shake — decays after impact
const shake = (frame: number, hitFrame: number, magnitude = 18, decay = 16) => {
  const d = frame - hitFrame;
  if (d < 0 || d > decay) return { x: 0, y: 0 };
  const fall = 1 - d / decay;
  const m = magnitude * fall * fall;
  return {
    x: Math.sin(d * 2.3) * m,
    y: Math.cos(d * 1.7) * m * 0.6,
  };
};

// ── Morphing neon blobs ──────────────────────────────────────────────────────
const Blobs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame * 0.018;

  const blobs = [
    { x: 22, y: 30, rx: 14, ry: 9,  ph: 0,    size: 1100, c: C.pink,   op: 0.55 },
    { x: 78, y: 68, rx: 11, ry: 14, ph: 2.1,  size: 1300, c: C.cyan,   op: 0.45 },
    { x: 50, y: 18, rx: 18, ry: 8,  ph: 1.1,  size: 900,  c: C.violet, op: 0.40 },
    { x: 85, y: 22, rx: 9,  ry: 12, ph: 3.6,  size: 800,  c: C.pinkHot,op: 0.35 },
    { x: 18, y: 82, rx: 12, ry: 10, ph: 4.4,  size: 950,  c: C.cyanSoft,op: 0.30 },
    { x: 55, y: 55, rx: 8,  ry: 11, ph: 5.2,  size: 700,  c: C.yellow, op: 0.18 },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at 50% 50%, ${C.bg} 0%, ${C.bgDeep} 100%)`,
      overflow: 'hidden',
      filter: 'blur(60px) saturate(1.35)',
    }}>
      {blobs.map((b, i) => {
        const x = b.x + Math.sin(t + b.ph) * b.rx;
        const y = b.y + Math.cos(t * 0.8 + b.ph) * b.ry;
        const scale = 0.85 + Math.sin(t * 0.6 + b.ph) * 0.25;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: b.size, height: b.size,
            transform: `translate(-50%, -50%) scale(${scale})`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.c} 0%, transparent 65%)`,
            opacity: b.op,
            mixBlendMode: 'screen',
          }} />
        );
      })}
    </div>
  );
};

// Neon text with stacked glow shadows
const neonShadow = (color: string, intensity = 1): string => {
  return [
    `0 0 ${6 * intensity}px ${color}`,
    `0 0 ${18 * intensity}px ${color}`,
    `0 0 ${40 * intensity}px ${color}cc`,
    `0 0 ${90 * intensity}px ${color}88`,
    `0 0 ${160 * intensity}px ${color}44`,
  ].join(', ');
};

// Slam text — drops from above with overshoot + impact shake
const SlamText: React.FC<{
  text: string;
  frame: number;
  hit: number;       // frame at which letter lands
  hold: number;      // until this frame, stays put
  exit?: number;     // start exit
  exitEnd?: number;
  size?: number;
  color?: string;
  glowColor?: string;
  letterSpacing?: number;
  italic?: boolean;
  style?: React.CSSProperties;
}> = ({
  text, frame, hit, hold, exit, exitEnd,
  size = 320, color = C.white, glowColor,
  letterSpacing = -4, italic = false, style = {},
}) => {
  const startAt = hit - 6;
  const t = clamp(prog(frame, startAt, hit));
  const drop = slamEase(t);
  const y = lerp(-380, 0, drop);

  // Snap-squish on landing
  const sinceHit = frame - hit;
  const impact = sinceHit >= 0 && sinceHit < 12 ? 1 - sinceHit / 12 : 0;
  const sx = 1 + impact * 0.16;
  const sy = 1 - impact * 0.20;

  // Exit
  let exitT = 0;
  if (exit !== undefined && exitEnd !== undefined && frame > exit) {
    exitT = easeInOutCubic(clamp(prog(frame, exit, exitEnd)));
  }
  const exitY = -exitT * 280;
  const exitOp = 1 - exitT;

  // Flash on impact
  const flash = sinceHit >= 0 && sinceHit < 8 ? 1 - sinceHit / 8 : 0;

  // Glow pulse during hold
  const pulse = frame > hit && (exit === undefined || frame < exit)
    ? 0.85 + 0.15 * Math.sin((frame - hit) * 0.14)
    : 1;

  const gc = glowColor || color;
  const opacity = (frame < startAt ? 0 : 1) * exitOp;

  return (
    <div style={{
      transform: `translate(0, ${y + exitY}px) scale(${sx}, ${sy})`,
      opacity,
      display: 'inline-block',
      ...style,
    }}>
      <div style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 400,
        color,
        letterSpacing,
        lineHeight: 0.85,
        textTransform: 'uppercase',
        fontStyle: italic ? 'italic' : 'normal',
        textShadow: neonShadow(gc, pulse),
        position: 'relative',
      }}>
        {/* Chromatic split for impact */}
        {impact > 0.05 && (
          <>
            <span style={{
              position: 'absolute', inset: 0,
              color: C.pink, mixBlendMode: 'screen',
              transform: `translate(${impact * 6}px, 0)`,
              opacity: impact * 0.7,
              textShadow: 'none',
            }}>{text}</span>
            <span style={{
              position: 'absolute', inset: 0,
              color: C.cyan, mixBlendMode: 'screen',
              transform: `translate(${-impact * 6}px, 0)`,
              opacity: impact * 0.7,
              textShadow: 'none',
            }}>{text}</span>
          </>
        )}
        {text}
        {/* White flash overlay */}
        {flash > 0 && (
          <span style={{
            position: 'absolute', inset: 0,
            color: C.white, opacity: flash * 0.6,
            textShadow: `0 0 50px ${C.white}`,
          }}>{text}</span>
        )}
      </div>
    </div>
  );
};

// Scanlines / grain overlay
const Scanlines: React.FC = () => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)',
    mixBlendMode: 'overlay',
  }} />
);

// Vignette
const Vignette: React.FC = () => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(0,0,0,0.75) 100%)',
  }} />
);

// Animated taxi badge
const TaxiBadge: React.FC<{ frame: number; p: number }> = ({ frame, p }) => {
  const spin = Math.sin(frame * 0.04) * 4;
  return (
    <div style={{
      display: 'inline-block',
      transform: `rotate(${spin}deg) scale(${p})`,
      padding: '12px 22px',
      borderRadius: 12,
      background: C.yellow,
      color: '#0A0014',
      fontFamily: FONT,
      fontSize: 56,
      fontWeight: 400,
      letterSpacing: 2,
      textTransform: 'uppercase',
      boxShadow: `0 0 40px ${C.yellow}aa, 0 0 90px ${C.yellow}55`,
      border: '4px solid #000',
      opacity: p,
    }}>
      TAXI
    </div>
  );
};

// Price ticker — counts up to a clean number to demonstrate predictability
const PriceTicker: React.FC<{ frame: number; start: number; end: number; from: number; to: number }> = ({
  frame, start, end, from, to,
}) => {
  const t = easeOutExpo(clamp(prog(frame, start, end)));
  const val = Math.round(lerp(from, to, t));
  return (
    <span style={{
      fontFamily: FONT,
      fontSize: 280,
      color: C.cyan,
      letterSpacing: -6,
      textShadow: neonShadow(C.cyan, 1),
      lineHeight: 0.85,
    }}>
      {val}
      <span style={{ fontSize: 120, color: C.cyanSoft, marginLeft: 8 }}>kr</span>
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN — 30 seconds @ 30fps = 900 frames
//
// TIMELINE (900 frames / 30s):
//   0  – 90    Cold open: blobs build, "EN TAXI." pre-hook slams in
//   90 – 110   Pre-hook slams away
//  110 – 320   "FORUTSIGBARHET" — hero word slam + hold (7 sec)
//  320 – 345   Forutsigbarhet exits up
//  345 – 540   Price demonstration "Du vet alltid prisen" + counter (6.5 sec)
//  540 – 720   Brand reveal "TAXI4MOSS AS" with TAXI badge (6 sec)
//  720 – 870   CTA — "BESTILL PÅ" + URL (5 sec)
//  870 – 900   Final hold / fade
// ─────────────────────────────────────────────────────────────────────────────

export const Taxi4moss: React.FC = () => {
  const frame = useCurrentFrame();

  // Load Anton from Google Fonts
  const [handle] = useState(() => delayRender('Load Anton font'));
  useEffect(() => {
    if (typeof document === 'undefined') {
      continueRender(handle);
      return;
    }
    const existing = document.querySelector('link[data-anton]');
    if (existing) {
      continueRender(handle);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Anton&display=swap';
    link.setAttribute('data-anton', 'true');
    link.onload = () => continueRender(handle);
    link.onerror = () => continueRender(handle);
    document.head.appendChild(link);
  }, [handle]);

  // ─── Slam impact frames (for global screen shake) ─────────────────────
  const impacts = [80, 120, 360, 560, 740];
  const totalShake = impacts.reduce((acc, hit) => {
    const s = shake(frame, hit, 14, 14);
    return { x: acc.x + s.x, y: acc.y + s.y };
  }, { x: 0, y: 0 });

  // Section visibility
  const preHookP   = presence(frame, 75, 95, 100, 115);
  const heroP      = presence(frame, 115, 130, 320, 345);
  const priceP     = presence(frame, 350, 380, 530, 555);
  const brandP     = presence(frame, 555, 585, 710, 730);
  const ctaP       = presence(frame, 730, 760, 870, 895);
  const finalFade  = easeInOutCubic(clamp(prog(frame, 880, 900)));

  return (
    <AbsoluteFill style={{ backgroundColor: C.bgDeep, overflow: 'hidden' }}>

      {/* ── Animated neon blobs background ───────────────────────────── */}
      <Blobs />

      {/* Subtle moving grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(${C.cyan}11 1px, transparent 1px),
          linear-gradient(90deg, ${C.cyan}11 1px, transparent 1px)
        `,
        backgroundSize: '120px 120px',
        backgroundPosition: `${(frame * 0.4) % 120}px ${(frame * 0.3) % 120}px`,
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)',
      }} />

      {/* ── Everything inside this layer gets the global screen shake ── */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translate(${totalShake.x}px, ${totalShake.y}px)`,
      }}>

        {/* ── Layer A: Pre-hook "EN TAXI?" ──────────────────────────── */}
        {preHookP > 0 && (
          <AbsoluteFill style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            opacity: preHookP,
          }}>
            <SlamText
              text="EN TAXI?"
              frame={frame}
              hit={80}
              hold={100}
              exit={100}
              exitEnd={115}
              size={240}
              color={C.white}
              glowColor={C.pink}
              letterSpacing={2}
            />
          </AbsoluteFill>
        )}

        {/* ── Layer B: Hero — FORUTSIGBARHET ────────────────────────── */}
        {heroP > 0 && (
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            opacity: heroP,
            gap: 30,
          }}>
            {/* Small accent line above */}
            <div style={{
              fontFamily: 'sans-serif',
              fontSize: 22,
              letterSpacing: 14,
              color: C.cyan,
              textTransform: 'uppercase',
              opacity: easeOutExpo(clamp(prog(frame, 140, 170))),
              textShadow: neonShadow(C.cyan, 0.5),
            }}>
              — Med Taxi4moss får du —
            </div>

            <SlamText
              text="FORUTSIGBARHET"
              frame={frame}
              hit={120}
              hold={320}
              exit={320}
              exitEnd={345}
              size={260}
              color={C.white}
              glowColor={C.pink}
              letterSpacing={-2}
              style={{ textAlign: 'center' }}
            />

            {/* Underline */}
            <div style={{
              width: easeOutExpo(clamp(prog(frame, 145, 200))) * 880,
              height: 6,
              background: `linear-gradient(90deg, transparent, ${C.cyan}, ${C.pink}, transparent)`,
              boxShadow: `0 0 30px ${C.pink}aa, 0 0 60px ${C.cyan}66`,
              opacity: 1 - easeInOutCubic(clamp(prog(frame, 315, 345))),
            }} />
          </AbsoluteFill>
        )}

        {/* ── Layer C: Du vet alltid prisen — with counting price ──── */}
        {priceP > 0 && (
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            opacity: priceP,
            gap: 40,
          }}>
            <SlamText
              text="DU VET ALLTID"
              frame={frame}
              hit={360}
              hold={530}
              exit={530}
              exitEnd={555}
              size={170}
              color={C.white}
              glowColor={C.cyan}
              letterSpacing={2}
            />

            {/* Price counter — counts from 999 down to a clean 249 */}
            <div style={{
              opacity: easeOutExpo(clamp(prog(frame, 395, 430))) *
                       (1 - easeInOutCubic(clamp(prog(frame, 530, 555)))),
              transform: `scale(${lerp(0.7, 1, easeOutBack(clamp(prog(frame, 395, 440))))})`,
              display: 'flex', alignItems: 'flex-end',
              padding: '8px 60px',
              border: `3px solid ${C.cyan}88`,
              borderRadius: 24,
              background: `${C.bg}aa`,
              boxShadow: `0 0 40px ${C.cyan}55, inset 0 0 30px ${C.cyan}22`,
              backdropFilter: 'blur(6px)',
            }}>
              <PriceTicker frame={frame} start={400} end={500} from={849} to={249} />
            </div>

            <SlamText
              text="PRISEN."
              frame={frame}
              hit={460}
              hold={530}
              exit={530}
              exitEnd={555}
              size={170}
              color={C.yellow}
              glowColor={C.yellow}
              letterSpacing={2}
            />
          </AbsoluteFill>
        )}

        {/* ── Layer D: Brand reveal TAXI4MOSS AS ──────────────────── */}
        {brandP > 0 && (
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            opacity: brandP,
            gap: 28,
          }}>
            <div style={{
              opacity: easeOutExpo(clamp(prog(frame, 565, 600))),
              transform: `scale(${easeOutBack(clamp(prog(frame, 565, 605)))})`,
            }}>
              <TaxiBadge frame={frame} p={1} />
            </div>

            <SlamText
              text="TAXI4MOSS"
              frame={frame}
              hit={560}
              hold={710}
              exit={710}
              exitEnd={730}
              size={300}
              color={C.white}
              glowColor={C.pink}
              letterSpacing={-2}
            />

            <div style={{
              fontFamily: FONT,
              fontSize: 76,
              color: C.cyan,
              letterSpacing: 14,
              textShadow: neonShadow(C.cyan, 0.8),
              opacity: easeOutExpo(clamp(prog(frame, 600, 640))) *
                       (1 - easeInOutCubic(clamp(prog(frame, 710, 730)))),
              transform: `translateY(${lerp(20, 0, easeOutExpo(clamp(prog(frame, 600, 640))))}px)`,
            }}>
              AS
            </div>
          </AbsoluteFill>
        )}

        {/* ── Layer E: CTA ────────────────────────────────────────── */}
        {ctaP > 0 && (
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            opacity: ctaP,
            gap: 36,
          }}>
            <div style={{
              fontFamily: FONT,
              fontSize: 100,
              color: C.white,
              letterSpacing: 4,
              textShadow: neonShadow(C.pink, 0.9),
              opacity: easeOutExpo(clamp(prog(frame, 740, 770))),
              transform: `translateY(${lerp(40, 0, easeOutExpo(clamp(prog(frame, 740, 770))))}px)`,
            }}>
              BESTILL DIN TUR PÅ
            </div>

            <SlamText
              text="TAXI4MOSS.NO"
              frame={frame}
              hit={740}
              hold={870}
              exit={870}
              exitEnd={895}
              size={220}
              color={C.yellow}
              glowColor={C.yellow}
              letterSpacing={-2}
            />

            {/* Animated pulse rings */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}>
              {[0, 1, 2].map(i => {
                const t = ((frame - 740 + i * 30) % 90) / 90;
                if (t < 0) return null;
                return (
                  <div key={i} style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: 800 + t * 800,
                    height: 800 + t * 800,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    border: `2px solid ${C.yellow}`,
                    opacity: (1 - t) * 0.35,
                  }} />
                );
              })}
            </div>

            <div style={{
              fontFamily: 'sans-serif',
              fontSize: 28,
              color: '#bbb',
              letterSpacing: 10,
              textTransform: 'uppercase',
              opacity: easeOutExpo(clamp(prog(frame, 795, 830))) *
                       (1 - easeInOutCubic(clamp(prog(frame, 870, 895)))),
              marginTop: 20,
            }}>
              Trygt · Raskt · Forutsigbart
            </div>
          </AbsoluteFill>
        )}

      </div>

      {/* ── Persistent corner brand mark (after first slam) ────────── */}
      <div style={{
        position: 'absolute', top: 48, left: 60,
        opacity: easeOutExpo(clamp(prog(frame, 130, 170))) * (1 - finalFade),
        display: 'flex', alignItems: 'center', gap: 14,
        zIndex: 30,
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: C.yellow,
          boxShadow: `0 0 16px ${C.yellow}, 0 0 36px ${C.yellow}88`,
        }} />
        <span style={{
          fontFamily: FONT,
          fontSize: 34,
          color: C.white,
          letterSpacing: 4,
          textShadow: neonShadow(C.pink, 0.4),
        }}>
          TAXI4MOSS
        </span>
      </div>

      {/* Scanlines & vignette */}
      <Scanlines />
      <Vignette />

      {/* Final fade */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: '#000',
        opacity: finalFade,
        pointerEvents: 'none',
      }} />

    </AbsoluteFill>
  );
};
