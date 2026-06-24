import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { theme } from './theme';
import { DynamicBackground } from './components/DynamicBackground';
import {
  easeOutExpo, easeOutBack, easeInOutCubic,
  clamp, prog, presence,
} from './utils/easing';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const DrawLine: React.FC<{ p: number; width?: number; color?: string }> = ({ p, width = 500, color = theme.gold }) => (
  <div style={{
    width: p * width, height: 2,
    background: `linear-gradient(90deg, transparent, ${color} 20%, ${theme.goldLight} 50%, ${color} 80%, transparent)`,
    borderRadius: 2,
    boxShadow: `0 0 12px ${color}aa, 0 0 30px ${color}55`,
  }} />
);

const AnimLetter: React.FC<{ ch: string; frame: number; delay: number; color?: string; fontSize?: number }> =
  ({ ch, frame, delay, color = theme.white, fontSize = 100 }) => {
    const t = easeOutBack(clamp(prog(frame, delay, delay + 18)));
    return (
      <span style={{
        display: 'inline-block',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize, fontWeight: 900, color,
        opacity: t,
        transform: `translateY(${lerp(60, 0, t)}px) scale(${lerp(0.6, 1, t)})`,
        textShadow: color === theme.gold
          ? `0 0 40px ${theme.gold}99, 0 0 80px ${theme.gold}44`
          : '0 4px 24px rgba(0,0,0,0.5)',
        letterSpacing: '-1px',
      }}>{ch}</span>
    );
  };

const Line: React.FC<{
  text: string; frame: number;
  inA: number; inB: number; outC: number; outD: number;
  fontSize?: number; color?: string; goldWord?: string;
  align?: 'left' | 'center';
}> = ({ text, frame, inA, inB, outC, outD, fontSize = 44, color = theme.white, goldWord, align = 'center' }) => {
  const p = presence(frame, inA, inB, outC, outD);
  const posT = easeOutExpo(clamp(prog(frame, inA, inB + 10)));
  const words = text.split(' ');
  return (
    <div style={{
      opacity: p,
      transform: `translateY(${lerp(18, 0, posT)}px)`,
      filter: `blur(${lerp(6, 0, easeOutExpo(clamp(prog(frame, inA, inA + 14))))}px)`,
      display: 'flex', flexWrap: 'wrap', gap: '0 12px',
      justifyContent: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
    }}>
      {words.map((w, i) => (
        <span key={i} style={{
          fontFamily: 'Georgia, serif', fontSize, fontWeight: 700,
          color: goldWord && w.toLowerCase().includes(goldWord.toLowerCase()) ? theme.gold : color,
          textShadow: goldWord && w.toLowerCase().includes(goldWord.toLowerCase())
            ? `0 0 30px ${theme.gold}66` : 'none',
        }}>{w}</span>
      ))}
    </div>
  );
};

/*
  30s explainer (900f @30fps) — structured after the "designer psychology" template:
  Hook -> The Human Edge -> Why Before What -> Predictive Empathy -> Memory Encoding -> CTA

  0    – 90   HOOK            "AI lager perfekte design." / "Vi lager design som selger."
  90   – 280  HUMAN EDGE      split screen: rigid AI-grid vs. tuned human layout
  280  – 410  WHY BEFORE WHAT three "hvorfor?" decision tags
  410  – 540  PREDICTIVE EMP. loud banner calms into a reassuring one
  540  – 660  MEMORY ENCODING two shapes resolve into one mark — a held metaphor
  660  – 900  CTA             logo, tagline, button, url, fade to black
*/

// ── Scene 2: Human Edge — split comparison ────────────────────────────────
const AI_BOXES = [
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
  { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
];

const HumanEdgeScene: React.FC<{ frame: number; p: number }> = ({ frame, p }) => {
  const revealAI = easeOutExpo(clamp(prog(frame, 100, 140)));
  const revealHuman = easeOutExpo(clamp(prog(frame, 150, 200)));
  const tilt = Math.sin(frame * 0.05) * 1.2;

  return (
    <AbsoluteFill style={{ opacity: p, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
      <Line text="To layout. Samme innhold." frame={frame} inA={90} inB={112} outC={258} outD={278} fontSize={42} />
      <div style={{ display: 'flex', gap: 70 }}>
        {/* AI grid — rigid, perfectly even */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: revealAI }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 56px)', gridTemplateRows: 'repeat(2, 56px)',
            gap: 10, padding: 22,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
          }}>
            {AI_BOXES.map((_, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 4 }} />
            ))}
          </div>
          <div style={{ fontFamily: 'sans-serif', fontSize: 14, letterSpacing: 3, color: '#777', textTransform: 'uppercase' }}>AI-mal</div>
        </div>

        {/* Human layout — intentional offset, broken grid */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: revealHuman }}>
          <div style={{
            position: 'relative', width: 200, height: 134, padding: 22,
            background: `linear-gradient(135deg, rgba(212,175,55,0.06), rgba(255,255,255,0.03))`,
            border: `1px solid ${theme.gold}33`, borderRadius: 12,
            transform: `rotate(${tilt}deg)`,
          }}>
            <div style={{ position: 'absolute', top: 14, left: 18, width: 78, height: 36, background: `${theme.gold}55`, borderRadius: 4, boxShadow: `0 0 14px ${theme.gold}55` }} />
            <div style={{ position: 'absolute', top: 38, left: 70, width: 96, height: 50, background: 'rgba(255,255,255,0.14)', borderRadius: 4, transform: 'rotate(-3deg)' }} />
            <div style={{ position: 'absolute', bottom: 12, right: 16, width: 56, height: 18, background: `${theme.goldLight}66`, borderRadius: 9 }} />
          </div>
          <div style={{ fontFamily: 'sans-serif', fontSize: 14, letterSpacing: 3, color: theme.gold, textTransform: 'uppercase' }}>NorLeads</div>
        </div>
      </div>
      <Line text="Perfekt blir glemt. Med vilje blir husket." frame={frame} inA={196} inB={220} outC={258} outD={278} fontSize={32} goldWord="husket" />
    </AbsoluteFill>
  );
};

// ── Scene 3: Why before what — decision tags ──────────────────────────────
const WhyScene: React.FC<{ frame: number; p: number }> = ({ frame, p }) => {
  const tags = [
    { q: 'Hvorfor denne farge?', a: 'For å skape tillit' },
    { q: 'Hvorfor denne plassering?', a: 'For å lede blikket' },
    { q: 'Hvorfor denne pause?', a: 'For å gi rom til budskapet' },
  ];
  return (
    <AbsoluteFill style={{ opacity: p, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 42 }}>
      <Line text="Vi spør hvorfor" frame={frame} inA={280} inB={302} outC={392} outD={410} fontSize={54} goldWord="hvorfor" />
      <Line text="før vi designer hva" frame={frame} inA={292} inB={314} outC={392} outD={410} fontSize={54} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
        {tags.map((t, i) => {
          const a = 330 + i * 20;
          const b = a + 22;
          const tp = presence(frame, a, b, 384, 406);
          if (tp <= 0) return null;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 18,
              opacity: tp, transform: `translateX(${lerp(-24, 0, tp)}px)`,
            }}>
              <div style={{ fontFamily: 'sans-serif', fontSize: 19, color: '#999', minWidth: 280 }}>{t.q}</div>
              <div style={{ width: 28, height: 1, background: theme.gold }} />
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 21, fontWeight: 700, color: theme.gold }}>{t.a}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Predictive empathy — loud banner calms down ──────────────────
const EmpathyScene: React.FC<{ frame: number; p: number }> = ({ frame, p }) => {
  const calm = easeInOutCubic(clamp(prog(frame, 450, 500)));
  const shake = (1 - calm) * Math.sin(frame * 1.4) * 3;
  const bg = `rgb(${lerp(180, 20, calm)}, ${lerp(40, 18, calm)}, ${lerp(30, 14, calm)})`;
  const border = `rgba(${lerp(255, 212, calm)}, ${lerp(90, 175, calm)}, ${lerp(60, 55, calm)}, ${lerp(0.6, 0.4, calm)})`;

  return (
    <AbsoluteFill style={{ opacity: p, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 38 }}>
      <div style={{
        width: 620, padding: '34px 40px', borderRadius: 16,
        background: bg, border: `2px solid ${border}`,
        transform: `translateX(${shake}px) scale(${lerp(1.04, 1, calm)})`,
        textAlign: 'center',
        boxShadow: `0 0 ${lerp(50, 20, calm)}px rgba(0,0,0,0.4)`,
      }}>
        <div style={{
          fontFamily: 'Georgia, serif', fontWeight: 900,
          fontSize: lerp(34, 26, calm), color: '#fff',
          letterSpacing: lerp(0, 1, calm),
        }}>
          {calm < 0.5 ? 'KJØP NÅ!! IKKE GÅ GLIPP AV DETTE!!' : 'Vi har noe du vil like.'}
        </div>
        <div style={{ opacity: calm, marginTop: 10, fontFamily: 'sans-serif', fontSize: 16, color: theme.goldLight }}>
          Rolig. Tydelig. Til å stole på.
        </div>
      </div>
      <Line text="Vi designer for hvordan du føler deg etterpå" frame={frame} inA={460} inB={484} outC={522} outD={538} fontSize={32} goldWord="etterpå" />
    </AbsoluteFill>
  );
};

// ── Scene 5: Memory encoding — two shapes resolve into one mark ───────────
const MemoryScene: React.FC<{ frame: number; p: number }> = ({ frame, p }) => {
  const merge = easeInOutCubic(clamp(prog(frame, 560, 605)));
  const hold = presence(frame, 605, 615, 645, 660);
  return (
    <AbsoluteFill style={{ opacity: p, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <div style={{ position: 'relative', width: 220, height: 140 }}>
        {/* Play triangle drifting in */}
        <div style={{
          position: 'absolute',
          left: lerp(20, 78, merge), top: lerp(20, 36, merge),
          width: 0, height: 0,
          borderTop: '34px solid transparent',
          borderBottom: '34px solid transparent',
          borderLeft: `54px solid ${theme.gold}`,
          opacity: 0.9,
          filter: `drop-shadow(0 0 ${10 + hold * 14}px ${theme.gold}aa)`,
          transform: `rotate(${lerp(-25, 0, merge)}deg)`,
        }} />
        {/* "N" mark drifting in from the other side, overlapping to form a mark */}
        <div style={{
          position: 'absolute',
          right: lerp(20, 60, merge), top: lerp(70, 18, merge),
          fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 64,
          color: theme.white, opacity: lerp(0.3, 1, merge),
          transform: `rotate(${lerp(20, 0, merge)}deg)`,
          textShadow: `0 0 ${hold * 20}px ${theme.gold}66`,
        }}>N</div>
      </div>
      <Line text="Det som er uforglemmelig, blir valgt" frame={frame} inA={612} inB={636} outC={645} outD={660} fontSize={36} goldWord="uforglemmelig" />
    </AbsoluteFill>
  );
};

export const NorLeadsExplainer: React.FC = () => {
  const frame = useCurrentFrame();

  const hookP = presence(frame, 0, 1, 76, 90);
  const edgeP = presence(frame, 90, 91, 264, 280);
  const whyP = presence(frame, 280, 281, 396, 410);
  const empathyP = presence(frame, 410, 411, 526, 540);
  const memoryP = presence(frame, 540, 541, 650, 660);

  const logoLetters = [
    { ch: 'N', color: theme.white }, { ch: 'o', color: theme.white }, { ch: 'r', color: theme.white },
    { ch: 'L', color: theme.gold }, { ch: 'e', color: theme.gold }, { ch: 'a', color: theme.gold },
    { ch: 'd', color: theme.gold }, { ch: 's', color: theme.gold },
  ];

  const ctaLogoP = presence(frame, 660, 685, 875, 900);
  const ctaTextP = presence(frame, 690, 712, 875, 900);
  const ctaBtnP = presence(frame, 712, 734, 875, 900);
  const ctaUrlP = presence(frame, 734, 754, 875, 900);
  const shimmerX = ((frame * 2.5) % 130) - 30;
  const ringPulse = 1 + 0.035 * Math.sin(frame * 0.09);
  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 880, 900)));

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <DynamicBackground />

      {/* Scene 1: Hook */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18,
        opacity: hookP, pointerEvents: 'none',
      }}>
        <Line text="AI lager perfekte design." frame={frame} inA={8} inB={34} outC={42} outD={64} fontSize={48} />
        <Line text="Vi lager design som selger." frame={frame} inA={42} inB={66} outC={76} outD={90} fontSize={56} goldWord="selger" />
      </AbsoluteFill>

      {/* Scene 2: Human Edge */}
      <HumanEdgeScene frame={frame} p={edgeP} />

      {/* Scene 3: Why before what */}
      <WhyScene frame={frame} p={whyP} />

      {/* Scene 4: Predictive empathy */}
      <EmpathyScene frame={frame} p={empathyP} />

      {/* Scene 5: Memory encoding */}
      <MemoryScene frame={frame} p={memoryP} />

      {/* Scene 6: CTA */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 26,
        pointerEvents: 'none',
      }}>
        {ctaLogoP > 0 && [560, 680, 800].map((sz, i) => (
          <div key={i} style={{
            position: 'absolute', width: sz, height: sz, top: '50%', left: '50%',
            transform: `translate(-50%, -50%) scale(${ringPulse + i * 0.015})`,
            borderRadius: '50%', border: `1px solid ${theme.gold}${['44', '2a', '16'][i]}`, opacity: ctaLogoP,
          }} />
        ))}
        {ctaLogoP > 0 && (
          <div style={{ opacity: ctaLogoP, transform: `scale(${lerp(0.7, 1, easeOutBack(clamp(prog(frame, 660, 685))))})`, display: 'flex' }}>
            {logoLetters.map((l, i) => (
              <AnimLetter key={i} ch={l.ch} frame={frame} delay={660 + i * 4} color={l.color} fontSize={96} />
            ))}
          </div>
        )}
        {ctaLogoP > 0 && <DrawLine p={ctaLogoP} width={460} />}
        <div style={{
          opacity: ctaTextP,
          transform: `translateY(${lerp(24, 0, ctaTextP)}px)`,
          filter: `blur(${lerp(8, 0, easeOutExpo(ctaTextP))}px)`,
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'sans-serif', fontSize: 26, color: '#ccc', fontWeight: 300, letterSpacing: 2 }}>
            Klar for en video som
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 46, color: theme.gold, fontWeight: 700, textShadow: `0 0 30px ${theme.gold}66` }}>
            faktisk selger?
          </div>
        </div>
        {ctaBtnP > 0 && (
          <div style={{
            opacity: ctaBtnP,
            transform: `scale(${easeOutBack(clamp(prog(frame, 712, 734)))})`,
            position: 'relative', borderRadius: 60, overflow: 'hidden',
          }}>
            <div style={{
              background: `linear-gradient(135deg, #C9A227, ${theme.goldLight}, #C9A227)`,
              color: theme.bg, fontFamily: 'sans-serif', fontSize: 24, fontWeight: 800,
              padding: '18px 58px', borderRadius: 60,
              boxShadow: `0 0 40px ${theme.gold}77, 0 0 80px ${theme.gold}33`, letterSpacing: 1,
            }}>
              Ta kontakt i dag
            </div>
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
          fontFamily: 'sans-serif', fontSize: 18, color: `${theme.gold}88`, letterSpacing: 4, textTransform: 'uppercase',
        }}>
          norleads.no
        </div>
      </AbsoluteFill>

      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', opacity: 1 - finalFade, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
