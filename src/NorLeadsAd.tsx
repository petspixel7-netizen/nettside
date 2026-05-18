import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { theme } from './theme';
import { DynamicBackground } from './components/DynamicBackground';
import {
  easeOutExpo, easeOutBack, easeInOutCubic,
  clamp, prog, presence,
} from './utils/easing';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Glowing horizontal line that draws itself
const DrawLine: React.FC<{ p: number; width?: number }> = ({ p, width = 500 }) => {
  const shimmer = 0.6 + 0.4 * Math.sin(Date.now() * 0.001); // static since frame-based
  return (
    <div style={{
      width: p * width, height: 2, position: 'relative', overflow: 'visible',
      background: `linear-gradient(90deg, transparent, ${theme.gold} 20%, ${theme.goldLight} 50%, ${theme.gold} 80%, transparent)`,
      borderRadius: 2,
      boxShadow: `0 0 12px ${theme.gold}aa, 0 0 30px ${theme.gold}55`,
    }} />
  );
};

// Individual letter with entry animation
const AnimLetter: React.FC<{
  ch: string;
  frame: number;
  delay: number;
  color?: string;
  fontSize?: number;
}> = ({ ch, frame, delay, color = theme.white, fontSize = 110 }) => {
  const t = easeOutBack(clamp(prog(frame, delay, delay + 18)));
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize,
      fontWeight: 900,
      color,
      opacity: t,
      transform: `translateY(${lerp(60, 0, t)}px) scale(${lerp(0.6, 1, t)})`,
      textShadow: color === theme.gold
        ? `0 0 40px ${theme.gold}99, 0 0 80px ${theme.gold}44`
        : '0 4px 24px rgba(0,0,0,0.5)',
      letterSpacing: '-1px',
    }}>
      {ch}
    </span>
  );
};

// Word with entry + exit
const AnimWord: React.FC<{
  text: string;
  frame: number;
  inA: number; inB: number; outC: number; outD: number;
  fontSize?: number;
  color?: string;
  goldWord?: string;
  translateFrom?: 'bottom' | 'right' | 'left';
  style?: React.CSSProperties;
}> = ({ text, frame, inA, inB, outC, outD, fontSize = 36, color = theme.white, goldWord, translateFrom = 'bottom', style = {} }) => {
  const p = presence(frame, inA, inB, outC, outD);
  const words = text.split(' ');
  const dx = translateFrom === 'right' ? lerp(80, 0, p) : translateFrom === 'left' ? lerp(-80, 0, p) : 0;
  const dy = translateFrom === 'bottom' ? lerp(40, 0, p) : 0;

  return (
    <div style={{
      opacity: p,
      transform: `translate(${dx}px, ${dy}px)`,
      filter: `blur(${lerp(6, 0, easeOutExpo(p))}px)`,
      display: 'flex', flexWrap: 'wrap', gap: '0 12px',
      ...style,
    }}>
      {words.map((w, i) => (
        <span key={i} style={{
          fontFamily: 'Georgia, serif',
          fontSize,
          fontWeight: 700,
          color: goldWord && w.toLowerCase().includes(goldWord.toLowerCase()) ? theme.gold : color,
          textShadow: goldWord && w.toLowerCase().includes(goldWord.toLowerCase())
            ? `0 0 30px ${theme.gold}66` : 'none',
        }}>
          {w}
        </span>
      ))}
    </div>
  );
};

// ─── Main component — ONE continuous animation ───────────────────────────────

/*
  TIMELINE (30fps):
  0   – 30   Background builds
  8   – 75   "NorLeads" letters drop in
  65  – 90   Divider line draws
  72  – 100  Tagline blurs in
  100 – 130  Intro elements scale + float up (logo goes small to top-left)
  100 – 200  Services heading + 4 items slide in from right, staggered
  190 – 220  Services slide out
  215 – 300  Stats (3 circles) count up
  290 – 320  Stats blur away
  310 – 480  CTA — logo returns, tagline, button pulses
  460 – 500  Slow fade to black
*/

export const NorLeadsAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Logo intro ───────────────────────────────────────────────────────────
  const logoLetters = [
    { ch: 'N', color: theme.white },
    { ch: 'o', color: theme.white },
    { ch: 'r', color: theme.white },
    { ch: 'L', color: theme.gold },
    { ch: 'e', color: theme.gold },
    { ch: 'a', color: theme.gold },
    { ch: 'd', color: theme.gold },
    { ch: 's', color: theme.gold },
  ];

  // Intro logo: big center → shrinks to top-left corner
  const logoCenterP  = presence(frame, 0, 20, 100, 125);
  const logoCornerP  = presence(frame, 110, 135, 300, 325);
  const logoCtaP     = presence(frame, 315, 345, 470, 495);

  // Scale of center logo: big when intro, then re-appears in CTA
  const logoCenterScale = logoCenterP;
  const logoCtaScale    = easeOutBack(clamp(prog(frame, 315, 345)));

  const lineP    = easeOutExpo(clamp(prog(frame, 65, 90)));
  const taglineP = presence(frame, 72, 95, 100, 120);

  // ── Services section ─────────────────────────────────────────────────────
  const services = [
    { icon: '🎬', title: 'Reklamevideo', sub: 'Sosiale medier & TV' },
    { icon: '✨', title: 'Produktanimasjon', sub: 'Vis frem det du selger' },
    { icon: '🚀', title: 'Firmaintro', sub: 'Profesjonell merkevare' },
    { icon: '📈', title: 'Kampanjevideoer', sub: 'Tilbud som konverterer' },
  ];
  const svcHeadingP = presence(frame, 108, 130, 188, 212);

  // ── Stats section ────────────────────────────────────────────────────────
  const stats = [
    { value: 3,  suffix: 'x',  label: 'Mer engasjement', sub: 'video vs. bilde' },
    { value: 80, suffix: '%',  label: 'Husker budskapet', sub: 'etter video' },
    { value: 10, suffix: 'x',  label: 'Mer rekkevidde', sub: 'på sosiale medier' },
  ];

  // ── CTA section ──────────────────────────────────────────────────────────
  const ctaTextP  = presence(frame, 348, 370, 465, 488);
  const ctaBtnP   = presence(frame, 368, 395, 465, 488);
  const ctaUrlP   = presence(frame, 395, 415, 465, 488);

  // Button shimmer
  const shimmerX = ((frame * 2.5) % 130) - 30;

  // CTA pulsing rings
  const ringPulse = 1 + 0.035 * Math.sin(frame * 0.09);

  // Final fade
  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 468, 498)));

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>

      {/* ── Layer 0: always-moving background ─────────────────────────── */}
      <DynamicBackground />

      {/* ── Layer 1: Big center logo (intro) ──────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 20,
        opacity: logoCenterP,
        transform: `scale(${lerp(0.8, 1, logoCenterP)})`,
        pointerEvents: 'none',
      }}>
        {/* Glow burst behind logo */}
        <div style={{
          position: 'absolute',
          width: 700, height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.gold}20 0%, transparent 65%)`,
          opacity: logoCenterP,
          transform: `scale(${0.8 + logoCenterP * 0.4})`,
        }} />

        {/* Letter-by-letter reveal */}
        <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
          {logoLetters.map((l, i) => (
            <AnimLetter key={i} ch={l.ch} frame={frame} delay={i * 4} color={l.color} fontSize={114} />
          ))}
        </div>

        {/* Divider line */}
        <div style={{ opacity: lineP * logoCenterP }}>
          <DrawLine p={lineP} width={520} />
        </div>

        {/* Tagline */}
        <div style={{
          opacity: taglineP * logoCenterP,
          transform: `translateY(${lerp(16, 0, taglineP)}px)`,
          filter: `blur(${lerp(8, 0, easeOutExpo(taglineP))}px)`,
          fontFamily: 'sans-serif', fontSize: 20,
          letterSpacing: 8, color: '#999',
          textTransform: 'uppercase',
        }}>
          Animasjonsvideoer som selger
        </div>
      </AbsoluteFill>

      {/* ── Layer 2: Small corner logo (between sections) ─────────────── */}
      <div style={{
        position: 'absolute', top: 48, left: 60,
        opacity: logoCornerP,
        transform: `scale(${lerp(0, 1, easeOutExpo(clamp(prog(frame, 110, 135))))}) translateY(${lerp(-20, 0, logoCornerP)}px)`,
        zIndex: 10,
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 900, color: theme.white }}>
          Nor<span style={{ color: theme.gold }}>Leads</span>
        </span>
      </div>

      {/* ── Layer 3: Services section ──────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 120px', gap: 44,
        pointerEvents: 'none',
      }}>
        {/* Heading */}
        <div style={{ opacity: svcHeadingP }}>
          <AnimWord
            text="Vi lager videoer"
            frame={frame} inA={108} inB={128} outC={188} outD={210}
            fontSize={62} translateFrom="right"
          />
          <AnimWord
            text="som gir resultater"
            frame={frame} inA={116} inB={136} outC={188} outD={210}
            fontSize={62} goldWord="resultater" translateFrom="right"
          />
          <div style={{ marginTop: 16, opacity: svcHeadingP }}>
            <DrawLine p={svcHeadingP} width={540} />
          </div>
        </div>

        {/* Service cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {services.map((s, i) => {
            const p = presence(frame, 132 + i * 10, 155 + i * 10, 190, 214);
            const shimmer = 0.5 + 0.5 * Math.sin(frame * 0.07 + i * 1.5);
            if (p <= 0) return null;
            return (
              <div key={i} style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(212,175,55,${0.03 + shimmer * 0.04}))`,
                border: `1px solid rgba(212,175,55,${0.12 + shimmer * 0.12})`,
                borderRadius: 14,
                padding: '24px 28px',
                display: 'flex', alignItems: 'center', gap: 18,
                opacity: p,
                transform: `translateX(${lerp(60, 0, p)}px)`,
                boxShadow: `0 0 ${16 + shimmer * 12}px rgba(212,175,55,0.06)`,
              }}>
                <span style={{ fontSize: 40 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: 'sans-serif', fontSize: 22, fontWeight: 700, color: theme.white }}>
                    {s.title}
                  </div>
                  <div style={{ fontFamily: 'sans-serif', fontSize: 15, color: '#888', marginTop: 3 }}>
                    {s.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ── Layer 4: Stats section ─────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 60,
        pointerEvents: 'none',
      }}>
        <AnimWord
          text="Hvorfor video virker"
          frame={frame} inA={215} inB={238} outC={290} outD={315}
          fontSize={50} goldWord="video" translateFrom="bottom"
          style={{ textAlign: 'center', justifyContent: 'center' }}
        />

        <div style={{ display: 'flex', gap: 90 }}>
          {stats.map((stat, i) => {
            const p = presence(frame, 228 + i * 14, 252 + i * 14, 292, 318);
            const countT = easeOutExpo(clamp(prog(frame, 232 + i * 14, 270 + i * 14)));
            const val = Math.round(countT * stat.value);
            const shimmer = 0.65 + 0.35 * Math.sin(frame * 0.07 + i * 2.1);
            const circleLen = 2 * Math.PI * 96;
            if (p <= 0) return null;

            return (
              <div key={i} style={{
                textAlign: 'center',
                opacity: p,
                transform: `translateY(${lerp(50, 0, p)}px) scale(${lerp(0.75, 1, p)})`,
              }}>
                <div style={{ position: 'relative', width: 210, height: 210, margin: '0 auto 18px' }}>
                  <svg width="210" height="210" style={{ position: 'absolute', top: 0, left: 0 }}>
                    {/* Track */}
                    <circle cx="105" cy="105" r="96" fill="none"
                      stroke={`${theme.gold}22`} strokeWidth="2" />
                    {/* Progress arc */}
                    <circle cx="105" cy="105" r="96" fill="none"
                      stroke={theme.gold} strokeWidth="3"
                      strokeDasharray={`${circleLen * countT} ${circleLen}`}
                      strokeLinecap="round"
                      transform="rotate(-90 105 105)"
                      style={{ filter: `drop-shadow(0 0 8px ${theme.gold}bb)` }}
                    />
                    {/* Inner glow ring */}
                    <circle cx="105" cy="105" r="80" fill="none"
                      stroke={`${theme.gold}${Math.round(shimmer * 30).toString(16).padStart(2, '0')}`}
                      strokeWidth="1" />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center',
                  }}>
                    <div style={{
                      fontFamily: 'Georgia, serif', fontSize: 62, fontWeight: 900,
                      color: theme.gold, lineHeight: 1,
                      textShadow: `0 0 ${20 + shimmer * 24}px ${theme.gold}99`,
                    }}>
                      {val}{stat.suffix}
                    </div>
                  </div>
                </div>
                <div style={{ fontFamily: 'sans-serif', fontSize: 20, color: theme.white, fontWeight: 600 }}>{stat.label}</div>
                <div style={{ fontFamily: 'sans-serif', fontSize: 15, color: '#777', marginTop: 5 }}>{stat.sub}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ── Layer 5: CTA — logo returns big, button ────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 28,
        pointerEvents: 'none',
      }}>
        {/* Pulsing rings behind CTA logo */}
        {logoCtaP > 0 && [560, 680, 800].map((sz, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: sz, height: sz,
            top: '50%', left: '50%',
            transform: `translate(-50%, -50%) scale(${ringPulse + i * 0.015})`,
            borderRadius: '50%',
            border: `1px solid ${theme.gold}${['44', '2a', '16'][i]}`,
            opacity: logoCtaP,
          }} />
        ))}

        {/* CTA Logo */}
        {logoCtaP > 0 && (
          <div style={{
            opacity: logoCtaP,
            transform: `scale(${lerp(0.7, 1, logoCtaScale)})`,
            display: 'flex',
          }}>
            {logoLetters.map((l, i) => (
              <span key={i} style={{
                display: 'inline-block',
                fontFamily: 'Georgia, serif',
                fontSize: 100,
                fontWeight: 900,
                color: l.color,
                textShadow: l.color === theme.gold
                  ? `0 0 40px ${theme.gold}99, 0 0 90px ${theme.gold}44`
                  : '0 4px 24px rgba(0,0,0,0.5)',
                letterSpacing: '-1px',
              }}>
                {l.ch}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        {logoCtaP > 0 && (
          <div style={{ opacity: logoCtaP }}>
            <DrawLine p={logoCtaP} width={480} />
          </div>
        )}

        {/* CTA tagline */}
        <div style={{
          opacity: ctaTextP,
          transform: `translateY(${lerp(24, 0, ctaTextP)}px)`,
          filter: `blur(${lerp(8, 0, easeOutExpo(ctaTextP))}px)`,
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'sans-serif', fontSize: 28, color: '#ccc', fontWeight: 300, letterSpacing: 2 }}>
            Klar for en video som
          </div>
          <div style={{
            fontFamily: 'Georgia, serif', fontSize: 48, color: theme.gold, fontWeight: 700,
            textShadow: `0 0 30px ${theme.gold}66`,
          }}>
            faktisk selger?
          </div>
        </div>

        {/* CTA Button */}
        {ctaBtnP > 0 && (
          <div style={{
            opacity: ctaBtnP,
            transform: `scale(${easeOutBack(clamp(prog(frame, 368, 392)))})`,
            position: 'relative', borderRadius: 60, overflow: 'hidden',
          }}>
            <div style={{
              background: `linear-gradient(135deg, #C9A227, ${theme.goldLight}, #C9A227)`,
              color: theme.bg,
              fontFamily: 'sans-serif', fontSize: 26, fontWeight: 800,
              padding: '20px 64px', borderRadius: 60,
              boxShadow: `0 0 40px ${theme.gold}77, 0 0 80px ${theme.gold}33`,
              letterSpacing: 1,
            }}>
              Ta kontakt i dag
            </div>
            {/* Shimmer */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: shimmerX, width: 60,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
              transform: 'skewX(-20deg)',
            }} />
          </div>
        )}

        {/* URL */}
        <div style={{
          opacity: ctaUrlP,
          transform: `translateY(${lerp(12, 0, ctaUrlP)}px)`,
          fontFamily: 'sans-serif', fontSize: 18,
          color: `${theme.gold}88`, letterSpacing: 4, textTransform: 'uppercase',
        }}>
          norleads.no
        </div>
      </AbsoluteFill>

      {/* ── Final fade to black ────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: '#000',
        opacity: 1 - finalFade,
        pointerEvents: 'none',
      }} />

    </AbsoluteFill>
  );
};
