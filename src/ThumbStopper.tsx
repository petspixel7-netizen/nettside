import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { easeOutExpo, easeInOutCubic, easeOutBack, clamp, prog } from './utils/easing';

const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const BG    = '#060912';
const BLUE  = '#2BA8FF';
const GOLD  = '#D4AF37';
const GOLDF = '#F0D060';

// Particles — same as scene 1 for visual continuity
const DOTS = Array.from({ length: 55 }, (_, i) => ({
  x:  (i * 137.5) % 100,
  y:  (i * 89.3)  % 100,
  r:  0.6 + (i % 4) * 0.45,
  vy: -(0.006 + (i % 5) * 0.003),
  vx: Math.sin(i * 2.4) * 0.002,
  op: 0.07 + (i % 4) * 0.06,
  ph: (i * 41) % (Math.PI * 2),
  blue: i % 5 === 0,
}));

// ── Premium card ─────────────────────────────────────────────────────────
const PremiumCard: React.FC<{ glow?: number; w?: number; h?: number }> = ({
  glow = 1, w = 560, h = 680,
}) => {
  const g = glow;
  return (
    <div style={{
      width: w, height: h,
      borderRadius: 22,
      background: `linear-gradient(145deg, #0A1628 0%, #0D1E3A 60%, #0A1428 100%)`,
      border: `1.5px solid rgba(212,175,55,${0.15 + g * 0.5})`,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: [
        `0 0 ${40 + g * 60}px rgba(212,175,55,${g * 0.2})`,
        `0 0 ${80 + g * 100}px rgba(43,168,255,${g * 0.08})`,
        `inset 0 0 ${g * 30}px rgba(212,175,55,0.04)`,
      ].join(', '),
    }}>
      {/* "Video thumbnail" area */}
      <div style={{
        height: '58%',
        background: `linear-gradient(145deg, #0C1F40 0%, #081530 100%)`,
        borderBottom: `1px solid rgba(212,175,55,${0.1 + g * 0.25})`,
        position: 'relative',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        {/* Play button */}
        <div style={{
          width: 72, height: 72,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(212,175,55,${g * 0.9}) 0%, rgba(212,175,55,${g * 0.5}) 60%, transparent 100%)`,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: `0 0 ${20 + g * 30}px rgba(212,175,55,${g * 0.6})`,
        }}>
          <div style={{
            width: 0, height: 0,
            borderTop: '14px solid transparent',
            borderBottom: '14px solid transparent',
            borderLeft: `22px solid rgba(255,255,255,${0.5 + g * 0.5})`,
            marginLeft: 5,
          }} />
        </div>

        {/* Corner label */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: `rgba(212,175,55,${g * 0.85})`,
          color: '#05080F',
          fontFamily: 'sans-serif', fontSize: 11,
          fontWeight: 800, letterSpacing: 1.5,
          padding: '4px 10px', borderRadius: 6,
          opacity: g,
        }}>
          NorLeads
        </div>

        {/* Top-right AD badge */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 4, padding: '3px 8px',
          fontFamily: 'sans-serif', fontSize: 10,
          color: 'rgba(255,255,255,0.4)', letterSpacing: 1.2,
        }}>
          AD
        </div>
      </div>

      {/* Text area */}
      <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          height: 10, width: '88%', borderRadius: 5,
          background: `linear-gradient(90deg, rgba(212,175,55,${0.2 + g * 0.4}), rgba(212,175,55,${0.05 + g * 0.15}))`,
        }} />
        <div style={{
          height: 10, width: '65%', borderRadius: 5,
          background: `rgba(212,175,55,${0.1 + g * 0.2})`,
        }} />
        <div style={{ marginTop: 4, display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            height: 30, flex: 1, borderRadius: 8,
            background: `linear-gradient(90deg, rgba(212,175,55,${0.6 + g * 0.4}), rgba(240,208,96,${0.4 + g * 0.3}))`,
            boxShadow: `0 0 ${g * 12}px rgba(212,175,55,0.4)`,
          }} />
          <div style={{
            height: 30, width: 80, borderRadius: 8,
            background: `rgba(255,255,255,${0.05 + g * 0.06})`,
            border: `1px solid rgba(255,255,255,0.08)`,
          }} />
        </div>
      </div>

      {/* Gold shimmer sweep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(105deg, transparent 30%, rgba(212,175,55,${g * 0.06}) 50%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
};

// ── Scene 2: Vi stopper scrollingen ──────────────────────────────────────
export const ThumbStopper: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera: very subtle push-in
  const cam = 1 + 0.025 * easeInOutCubic(clamp(prog(frame, 0, 150)));

  // ── Spotlight cone from top ──────────────────────────────────────────
  const spotT    = easeOutExpo(clamp(prog(frame, 8, 40)));
  const spotAlpha = spotT * 0.55;

  // ── Card drops in from above ─────────────────────────────────────────
  // Starts off-screen top (y = -750), falls to center (y = 620)
  const cardCY   = 620; // top of card when centered (1080x1920, card is 560x680)
  const dropT    = easeOutExpo(clamp(prog(frame, 28, 62)));
  const cardY    = lerp(-720, cardCY, dropT);
  const cardGlow = easeOutExpo(clamp(prog(frame, 50, 80)));

  // Impact squish on landing (frame 62: card arrives)
  const impact   = Math.max(0, 1 - (frame - 62) / 12);
  const squishY  = 1 - impact * 0.06;  // squash slightly
  const squishX  = 1 + impact * 0.04;

  // Floating breathe after landing
  const breathe  = frame > 70 ? Math.sin((frame - 70) * 0.06) * 4 : 0;

  // ── Text ────────────────────────────────────────────────────────────
  const L1 = easeOutExpo(clamp(prog(frame, 90,  108)));
  const L2 = easeOutExpo(clamp(prog(frame, 102, 122)));
  const glowV = frame > 122 ? 0.7 + 0.3 * Math.sin((frame - 122) * 0.13) : L2;

  // ── NorLeads wordmark bottom ─────────────────────────────────────────
  const markT = easeOutExpo(clamp(prog(frame, 118, 138)));

  // ── Particles ───────────────────────────────────────────────────────
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>

      {/* Background radial — shifts from blue (scene 1) toward gold */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 50% 48%,
            rgba(212,175,55,${cardGlow * 0.1}) 0%,
            rgba(43,168,255,0.06) 40%,
            transparent 70%)
        `,
        transform: `scale(${cam})`,
      }} />

      {/* Grid — same as scene 1 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(43,168,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(43,168,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '70px 70px',
        backgroundPosition: `${(frame * 0.25) % 70}px ${(frame * 0.18) % 70}px`,
        transform: `scale(${cam})`,
      }} />

      {/* Particles */}
      {DOTS.map((d, i) => {
        const px = ((d.x + frame * d.vx * 100) % 100 + 100) % 100;
        const py = ((d.y + frame * d.vy * 100) % 100 + 100) % 100;
        const p  = 0.45 + 0.55 * Math.sin(frame * 0.07 + d.ph);
        const isGold = cardGlow > 0.3 && i % 7 === 0;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${px}%`, top: `${py}%`,
            width: d.r, height: d.r,
            borderRadius: '50%',
            backgroundColor: isGold ? GOLD : d.blue ? BLUE : 'rgba(255,255,255,0.5)',
            opacity: d.op * p,
            boxShadow: (d.r > 0.8 && (d.blue || isGold))
              ? `0 0 ${d.r * 4}px ${isGold ? GOLD : BLUE}77` : 'none',
          }} />
        );
      })}

      {/* Spotlight cone */}
      {spotT > 0 && (
        <div style={{
          position: 'absolute',
          top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '340px solid transparent',
          borderRight: '340px solid transparent',
          borderTop: `1100px solid rgba(212,175,55,${spotAlpha * 0.18})`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
          opacity: spotT,
        }} />
      )}

      {/* Spotlight edge lines */}
      {spotT > 0.4 && (
        <>
          {[-1, 1].map(side => (
            <div key={side} style={{
              position: 'absolute',
              top: 0, left: '50%',
              width: 1.5, height: 1100,
              background: `linear-gradient(180deg, rgba(212,175,55,${spotT * 0.5}), transparent)`,
              transform: `rotate(${side * 17}deg)`,
              transformOrigin: 'top center',
              opacity: spotT,
            }} />
          ))}
        </>
      )}

      {/* Premium card */}
      {dropT > 0 && (
        <div style={{
          position: 'absolute',
          left: (1080 - 560) / 2,
          top: cardY + breathe,
          transform: `scale(${squishX * cam}, ${squishY * cam})`,
          transformOrigin: 'center bottom',
          zIndex: 5,
        }}>
          <PremiumCard glow={cardGlow} />

          {/* Gold ring burst on landing */}
          {impact > 0.05 && (
            <div style={{
              position: 'absolute',
              bottom: -10, left: '50%',
              transform: `translateX(-50%) scale(${1 + (1 - impact) * 0.8})`,
              width: 560, height: 60,
              borderRadius: '50%',
              border: `2px solid rgba(212,175,55,${impact * 0.7})`,
              filter: `blur(${(1 - impact) * 6}px)`,
              opacity: impact,
            }} />
          )}
        </div>
      )}

      {/* Headline */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', alignItems: 'center',
        paddingBottom: 220, gap: 6,
        pointerEvents: 'none',
      }}>
        {/* Line 1 */}
        <div style={{
          opacity: L1,
          transform: `translateY(${lerp(20, 0, L1)}px)`,
          filter: `blur(${lerp(5, 0, easeOutExpo(L1))}px)`,
        }}>
          <span style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: 88,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-3px',
            lineHeight: 1.05,
            textShadow: '0 4px 40px rgba(0,0,0,0.95)',
          }}>
            Vi stopper
          </span>
        </div>

        {/* Line 2 — gold glow */}
        <div style={{
          opacity: L2,
          transform: `translateY(${lerp(20, 0, L2)}px)`,
          filter: `blur(${lerp(6, 0, easeOutExpo(L2))}px)`,
        }}>
          <span style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: '-3px',
            lineHeight: 1.05,
            color: GOLD,
            textShadow: [
              `0 0 ${18 + glowV * 30}px ${GOLD}`,
              `0 0 ${45 + glowV * 55}px rgba(212,175,55,0.5)`,
              `0 0 ${80 + glowV * 70}px rgba(212,175,55,0.2)`,
            ].join(', '),
          }}>
            scrollingen.
          </span>
        </div>
      </AbsoluteFill>

      {/* NorLeads wordmark */}
      <div style={{
        position: 'absolute',
        bottom: 90, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: markT,
        transform: `translateY(${lerp(12, 0, markT)}px)`,
      }}>
        <span style={{
          fontFamily: 'Georgia, serif',
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: '-0.5px',
          color: 'rgba(255,255,255,0.7)',
        }}>
          Nor<span style={{
            color: GOLD,
            textShadow: `0 0 20px rgba(212,175,55,0.6)`,
          }}>Leads</span>
        </span>
      </div>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

    </AbsoluteFill>
  );
};
