import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { mobinoTheme } from './mobinoTheme';
import { MobinoBackground } from './components/MobinoBackground';
import { MobinoLogo } from './components/MobinoLogo';
import {
  easeOutExpo, easeOutBack, easeInOutCubic,
  clamp, prog, presence,
} from './utils/easing';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const GRADIENT = `linear-gradient(90deg, ${mobinoTheme.cyan}, ${mobinoTheme.purple}, ${mobinoTheme.blue})`;

// Glowing line that draws itself, in brand gradient
const DrawLine: React.FC<{ p: number; width?: number }> = ({ p, width = 480 }) => (
  <div style={{
    width: p * width, height: 2, position: 'relative', overflow: 'visible',
    background: GRADIENT,
    borderRadius: 2,
    boxShadow: `0 0 14px ${mobinoTheme.cyan}88, 0 0 30px ${mobinoTheme.purple}55`,
  }} />
);

// Word-by-word kinetic reveal, with optional gradient-highlighted word
const AnimWord: React.FC<{
  text: string;
  frame: number;
  inA: number; inB: number; outC: number; outD: number;
  fontSize?: number;
  color?: string;
  highlightWord?: string;
  align?: 'left' | 'center';
}> = ({ text, frame, inA, inB, outC, outD, fontSize = 50, color = mobinoTheme.white, highlightWord, align = 'left' }) => {
  const opacity = presence(frame, inA, inB, outC, outD);
  const posT = easeOutExpo(clamp(prog(frame, inA, inB + 12)));
  const dy = lerp(20, 0, posT);
  const words = text.split(' ');

  return (
    <div style={{
      opacity,
      transform: `translateY(${dy}px)`,
      filter: `blur(${lerp(6, 0, easeOutExpo(clamp(prog(frame, inA, inA + 14))))}px)`,
      display: 'flex', flexWrap: 'wrap', gap: '0 14px',
      justifyContent: align === 'center' ? 'center' : 'flex-start',
    }}>
      {words.map((w, i) => {
        const isHi = highlightWord && w.toLowerCase().includes(highlightWord.toLowerCase());
        return (
          <span key={i} style={{
            fontFamily: mobinoTheme.font,
            fontSize, fontWeight: 800,
            color: isHi ? 'transparent' : color,
            background: isHi ? GRADIENT : 'none',
            WebkitBackgroundClip: isHi ? 'text' : undefined,
            backgroundClip: isHi ? 'text' : undefined,
            textShadow: isHi ? 'none' : '0 4px 24px rgba(0,0,0,0.5)',
          }}>{w}</span>
        );
      })}
    </div>
  );
};

// Feature card for the benefits grid
const FeatureCard: React.FC<{
  frame: number;
  startFrame: number;
  title: string;
  sub: string;
}> = ({ frame, startFrame, title, sub }) => {
  const p = presence(frame, startFrame, startFrame + 22, 520, 555);
  const shimmer = 0.5 + 0.5 * Math.sin(frame * 0.07 + startFrame);
  if (p <= 0) return null;
  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(66,217,255,${0.03 + shimmer * 0.04}))`,
      border: `1px solid rgba(66,217,255,${0.15 + shimmer * 0.15})`,
      borderRadius: 16,
      padding: '28px 34px',
      opacity: p,
      transform: `translateY(${lerp(30, 0, easeOutExpo(p))}px)`,
      boxShadow: `0 0 ${18 + shimmer * 14}px rgba(66,217,255,0.08)`,
    }}>
      <div style={{
        fontFamily: mobinoTheme.font, fontSize: 30, fontWeight: 800,
        background: GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      }}>{title}</div>
      <div style={{ fontFamily: mobinoTheme.font, fontSize: 17, color: mobinoTheme.gray, marginTop: 6 }}>{sub}</div>
    </div>
  );
};

// Counted-up stat ring (used for "500 GB" / "80+ land")
const StatRing: React.FC<{
  frame: number; startFrame: number;
  target: number; suffix: string; label: string;
}> = ({ frame, startFrame, target, suffix, label }) => {
  const p = presence(frame, startFrame, startFrame + 26, 520, 555);
  const countT = easeInOutCubic(clamp(prog(frame, startFrame + 6, startFrame + 86)));
  const val = Math.round(countT * target);
  const shimmer = 0.65 + 0.35 * Math.sin(frame * 0.07 + startFrame);
  const circleLen = 2 * Math.PI * 92;
  if (p <= 0) return null;

  return (
    <div style={{ textAlign: 'center', opacity: p, transform: `translateY(${lerp(40, 0, p)}px) scale(${lerp(0.8, 1, p)})` }}>
      <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 16px' }}>
        <svg width="200" height="200" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <linearGradient id={`ring-${startFrame}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={mobinoTheme.cyan} />
              <stop offset="100%" stopColor={mobinoTheme.purple} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(66,217,255,0.15)" strokeWidth="2" />
          <circle cx="100" cy="100" r="92" fill="none"
            stroke={`url(#ring-${startFrame})`} strokeWidth="4"
            strokeDasharray={`${circleLen * countT} ${circleLen}`}
            strokeLinecap="round" transform="rotate(-90 100 100)"
            style={{ filter: `drop-shadow(0 0 8px ${mobinoTheme.cyan}bb)` }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            fontFamily: mobinoTheme.font, fontSize: 56, fontWeight: 900, lineHeight: 1,
            color: mobinoTheme.white, textShadow: `0 0 ${20 + shimmer * 24}px ${mobinoTheme.cyan}99`,
          }}>{val}{suffix}</div>
        </div>
      </div>
      <div style={{ fontFamily: mobinoTheme.font, fontSize: 19, color: mobinoTheme.white, fontWeight: 700 }}>{label}</div>
    </div>
  );
};

/*
  TIMELINE (30fps, ~36.7s total = 1100 frames):
  0    – 20   Blackout fade-in
  10   – 70   Logo particle-assembly (M mark implodes from scattered dots)
  60   – 130  Logo outline draws itself
  130  – 150  Fill locks in, stroke fades
  150  – 210  Wordmark "mobino" + tagline "Frihet uten grenser"
  235  – 260  Shrink to corner mark, fade tagline
  260  – 560  Benefits grid: 500GB, 80+ land roaming, Fri fart, e-SIM, Prisgaranti
  560  – 820  "Frihet uten grenser" statement + global coverage rings
  820  – 1080 CTA: logo returns big, headline, button, url
  1050 – 1100 Fade to black
*/

export const MobinoAd: React.FC = () => {
  const frame = useCurrentFrame();

  const blackIn = 1 - easeInOutCubic(clamp(prog(frame, 0, 20)));

  const cornerLogoP = presence(frame, 235, 260, 800, 825);
  const taglineP = presence(frame, 175, 210, 235, 255);
  const wordmarkClip = easeOutExpo(clamp(prog(frame, 150, 195)));

  // ── Benefits section ──────────────────────────────────────────────────
  const benefitsHeadingP = presence(frame, 260, 286, 520, 552);

  // ── Statement / coverage section ────────────────────────────────────
  const statementP = presence(frame, 560, 596, 760, 800);
  const ringsP = presence(frame, 600, 640, 770, 810);

  // ── CTA section ──────────────────────────────────────────────────────
  const ctaLogoP = presence(frame, 825, 860, 1040, 1075);
  const ctaHeadlineP = presence(frame, 860, 888, 1040, 1075);
  const ctaBtnP = presence(frame, 888, 912, 1040, 1075);
  const ctaUrlP = presence(frame, 912, 932, 1040, 1075);
  const ringPulse = 1 + 0.035 * Math.sin(frame * 0.09);
  const shimmerX = ((frame * 2.5) % 130) - 30;
  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 1050, 1098)));

  return (
    <AbsoluteFill style={{ backgroundColor: mobinoTheme.bg }}>
      <MobinoBackground />

      {/* ── Intro: centered logo assembly + wordmark + tagline ─────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18,
        opacity: presence(frame, 0, 1, 230, 258),
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: `radial-gradient(circle, ${mobinoTheme.cyan}1a 0%, transparent 65%)`,
        }} />
        <MobinoLogo
          id="intro"
          size={420}
          assembleStart={10} assembleEnd={70}
          drawStart={60} drawEnd={130}
          lockStart={130} lockEnd={150}
        />
        <div style={{
          overflow: 'hidden', clipPath: `inset(0 ${100 - wordmarkClip * 100}% 0 0)`,
          fontFamily: mobinoTheme.font, fontSize: 72, fontWeight: 800, color: mobinoTheme.white, letterSpacing: 1,
        }}>mobino</div>
        <div style={{
          opacity: taglineP,
          transform: `translateY(${lerp(14, 0, taglineP)}px)`,
          fontFamily: mobinoTheme.font, fontSize: 22, letterSpacing: 6, textTransform: 'uppercase',
          background: GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}>Frihet uten grenser</div>
      </AbsoluteFill>

      {/* ── Corner mark, present through the body of the ad ────────────── */}
      <div style={{
        position: 'absolute', top: 50, left: 64, display: 'flex', alignItems: 'center', gap: 14,
        opacity: cornerLogoP,
        transform: `translateY(${lerp(-16, 0, cornerLogoP)}px)`,
        zIndex: 10,
      }}>
        <MobinoLogo id="corner" size={56} assembleStart={235} assembleEnd={236} drawStart={235} drawEnd={236} lockStart={235} lockEnd={250} />
        <span style={{ fontFamily: mobinoTheme.font, fontSize: 28, fontWeight: 800, color: mobinoTheme.white }}>mobino</span>
      </div>

      {/* ── Benefits grid ────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 110px', gap: 50,
        pointerEvents: 'none',
      }}>
        <div style={{ opacity: benefitsHeadingP }}>
          <AnimWord text="Alt bedriften din trenger" frame={frame} inA={260} inB={286} outC={520} outD={552} fontSize={56} highlightWord="trenger" />
          <div style={{ marginTop: 14 }}><DrawLine p={benefitsHeadingP} width={520} /></div>
        </div>

        <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start' }}>
          <StatRing frame={frame} startFrame={296} target={500} suffix=" GB" label="Data i Norge" />
          <StatRing frame={frame} startFrame={314} target={80} suffix="+" label="Land med roaming" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 14 }}>
            <FeatureCard frame={frame} startFrame={332} title="Fri fart" sub="Ubegrenset hastighet, alltid" />
            <FeatureCard frame={frame} startFrame={350} title="e-SIM" sub="Oppe og kjøre på minutter" />
            <FeatureCard frame={frame} startFrame={368} title="Prisgaranti" sub="Samme pris, hele avtalen" />
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Statement + global coverage ─────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 40,
        pointerEvents: 'none',
      }}>
        {[260, 420, 580].map((sz, i) => (
          <div key={i} style={{
            position: 'absolute', width: sz, height: sz, borderRadius: '50%',
            border: `1px solid ${[mobinoTheme.cyan, mobinoTheme.purple, mobinoTheme.blue][i]}44`,
            opacity: ringsP * (1 - i * 0.15),
            transform: `scale(${1 + 0.04 * Math.sin(frame * 0.05 + i * 2)})`,
          }} />
        ))}
        <div style={{ textAlign: 'center', maxWidth: 1300 }}>
          <AnimWord text="Frihet uten grenser" frame={frame} inA={560} inB={596} outC={760} outD={800} fontSize={84} highlightWord="grenser" align="center" />
          <div style={{ marginTop: 24, opacity: statementP }}>
            <AnimWord text="500 GB data, fri fart og roaming i 80+ land" frame={frame} inA={604} inB={632} outC={760} outD={800} fontSize={32} color={mobinoTheme.gray} align="center" />
          </div>
        </div>
      </AbsoluteFill>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30,
        pointerEvents: 'none',
      }}>
        {ctaLogoP > 0 && [560, 680, 800].map((sz, i) => (
          <div key={i} style={{
            position: 'absolute', width: sz, height: sz, top: '46%', left: '50%',
            transform: `translate(-50%, -50%) scale(${ringPulse + i * 0.015})`,
            borderRadius: '50%',
            border: `1px solid ${[mobinoTheme.cyan, mobinoTheme.purple, mobinoTheme.blue][i]}44`,
            opacity: ctaLogoP,
          }} />
        ))}

        {ctaLogoP > 0 && (
          <div style={{ opacity: ctaLogoP, transform: `scale(${lerp(0.7, 1, easeOutBack(clamp(prog(frame, 825, 858))))})` }}>
            <MobinoLogo id="cta" size={220} assembleStart={825} assembleEnd={826} drawStart={825} drawEnd={826} lockStart={825} lockEnd={850} />
          </div>
        )}

        <div style={{
          opacity: ctaHeadlineP,
          transform: `translateY(${lerp(24, 0, ctaHeadlineP)}px)`,
          filter: `blur(${lerp(8, 0, easeOutExpo(ctaHeadlineP))}px)`,
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: mobinoTheme.font, fontSize: 26, color: mobinoTheme.gray, fontWeight: 400, letterSpacing: 1 }}>
            Klar for mobil uten begrensninger?
          </div>
          <div style={{
            fontFamily: mobinoTheme.font, fontSize: 48, fontWeight: 800,
            background: GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>Bytt til Mobino i dag</div>
        </div>

        {ctaBtnP > 0 && (
          <div style={{
            opacity: ctaBtnP,
            transform: `scale(${easeOutBack(clamp(prog(frame, 888, 910)))})`,
            position: 'relative', borderRadius: 60, overflow: 'hidden',
          }}>
            <div style={{
              background: GRADIENT, color: mobinoTheme.bg,
              fontFamily: mobinoTheme.font, fontSize: 26, fontWeight: 800,
              padding: '20px 64px', borderRadius: 60,
              boxShadow: `0 0 40px ${mobinoTheme.cyan}66, 0 0 80px ${mobinoTheme.purple}33`,
              letterSpacing: 1,
            }}>Se priser</div>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: shimmerX, width: 60,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
              transform: 'skewX(-20deg)',
            }} />
          </div>
        )}

        <div style={{
          opacity: ctaUrlP,
          transform: `translateY(${lerp(12, 0, ctaUrlP)}px)`,
          fontFamily: mobinoTheme.font, fontSize: 18, color: `${mobinoTheme.cyan}cc`,
          letterSpacing: 4, textTransform: 'uppercase',
        }}>mobino.no</div>
      </AbsoluteFill>

      {/* ── Fades ───────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', opacity: blackIn, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', opacity: 1 - finalFade, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
