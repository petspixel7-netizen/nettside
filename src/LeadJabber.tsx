import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { theme } from './theme';
import { DynamicBackground } from './components/DynamicBackground';
import {
  easeOutExpo, easeOutBack, easeInOutCubic,
  clamp, prog, presence,
} from './utils/easing';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const DrawLine: React.FC<{ p: number; width?: number }> = ({ p, width = 500 }) => (
  <div style={{
    width: p * width, height: 2, position: 'relative', overflow: 'visible',
    background: `linear-gradient(90deg, transparent, ${theme.gold} 20%, ${theme.goldLight} 50%, ${theme.gold} 80%, transparent)`,
    borderRadius: 2,
    boxShadow: `0 0 12px ${theme.gold}aa, 0 0 30px ${theme.gold}55`,
  }} />
);

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
  const opacity = presence(frame, inA, inB, outC, outD);
  const posT = easeOutExpo(clamp(prog(frame, inA, inB + 14)));
  const posOut = easeInOutCubic(clamp(prog(frame, outC, outD)));
  const pos = posT * (1 - posOut);

  const dx = translateFrom === 'right' ? lerp(28, 0, pos) : translateFrom === 'left' ? lerp(-28, 0, pos) : 0;
  const dy = translateFrom === 'bottom' ? lerp(18, 0, pos) : 0;

  const words = text.split(' ');
  return (
    <div style={{
      opacity,
      transform: `translate(${dx}px, ${dy}px)`,
      filter: `blur(${lerp(4, 0, easeOutExpo(clamp(prog(frame, inA, inA + 14))))}px)`,
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

/*
  TIMELINE (30fps):
  0   – 30   Background builds
  8   – 75   "LeadJabber" letters drop in
  65  – 90   Divider line draws
  72  – 100  Tagline blurs in
  100 – 130  Intro elements scale + float up (logo shrinks to top-left)
  100 – 200  Services heading + 4 cards slide in from right, staggered
  190 – 220  Services slide out
  215 – 300  Statement: "Slutt å ringe kaldt"
  290 – 320  Statement blurs away
  310 – 480  CTA — logo returns, tagline, button pulses
  460 – 500  Slow fade to black
*/

export const LeadJabber: React.FC = () => {
  const frame = useCurrentFrame();

  const logoLetters = [
    { ch: 'L', color: theme.white },
    { ch: 'e', color: theme.white },
    { ch: 'a', color: theme.white },
    { ch: 'd', color: theme.white },
    { ch: 'J', color: theme.gold },
    { ch: 'a', color: theme.gold },
    { ch: 'b', color: theme.gold },
    { ch: 'b', color: theme.gold },
    { ch: 'e', color: theme.gold },
    { ch: 'r', color: theme.gold },
  ];

  const logoCenterP = presence(frame, 0, 20, 100, 125);
  const logoCornerP = presence(frame, 110, 135, 300, 325);
  const logoCtaP = presence(frame, 315, 345, 470, 495);

  const logoCenterScale = logoCenterP;
  const logoCtaScale = easeOutBack(clamp(prog(frame, 315, 345)));

  const lineP = easeOutExpo(clamp(prog(frame, 65, 90)));
  const taglineP = presence(frame, 72, 95, 100, 120);

  const services = [
    { title: 'LeadJabber Software', sub: 'Generer leads og møter selv' },
    { title: 'Møtebooking', sub: 'Kvalitetsmøter rett i kalenderen' },
    { title: 'Outreach', sub: 'Leadgenerering levert månedlig' },
    { title: 'Leadgenerering', sub: 'Salgstrakter bygget for konvertering' },
  ];
  const svcHeadingP = presence(frame, 108, 130, 188, 212);

  const ctaTextP = presence(frame, 348, 370, 465, 488);
  const ctaBtnP = presence(frame, 368, 395, 465, 488);
  const ctaUrlP = presence(frame, 395, 415, 465, 488);

  const shimmerX = ((frame * 2.5) % 130) - 30;
  const ringPulse = 1 + 0.035 * Math.sin(frame * 0.09);

  const statementP = presence(frame, 215, 245, 290, 318);

  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 468, 498)));

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <DynamicBackground />

      {/* Layer 1: Big center logo (intro) */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 20,
        opacity: logoCenterP,
        transform: `scale(${lerp(0.8, 1, logoCenterScale)})`,
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          width: 700, height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.gold}20 0%, transparent 65%)`,
          opacity: logoCenterP,
          transform: `scale(${0.8 + logoCenterP * 0.4})`,
        }} />

        <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
          {logoLetters.map((l, i) => (
            <AnimLetter key={i} ch={l.ch} frame={frame} delay={i * 4} color={l.color} fontSize={92} />
          ))}
        </div>

        <div style={{ opacity: lineP * logoCenterP }}>
          <DrawLine p={lineP} width={560} />
        </div>

        <div style={{
          opacity: taglineP * logoCenterP,
          transform: `translateY(${lerp(16, 0, taglineP)}px)`,
          filter: `blur(${lerp(8, 0, easeOutExpo(taglineP))}px)`,
          fontFamily: 'sans-serif', fontSize: 22,
          letterSpacing: 2, color: '#ccc',
          textAlign: 'center', maxWidth: 900,
        }}>
          Slutt å ringe kaldt — ha en-til-en-samtaler i stor skala
        </div>
      </AbsoluteFill>

      {/* Layer 2: Small corner logo */}
      <div style={{
        position: 'absolute', top: 48, left: 60,
        opacity: logoCornerP,
        transform: `scale(${lerp(0, 1, easeOutExpo(clamp(prog(frame, 110, 135))))}) translateY(${lerp(-20, 0, logoCornerP)}px)`,
        zIndex: 10,
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 900, color: theme.white }}>
          Lead<span style={{ color: theme.gold }}>Jabber</span>
        </span>
      </div>

      {/* Layer 3: Services section */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 120px', gap: 44,
        pointerEvents: 'none',
      }}>
        <div style={{ opacity: svcHeadingP }}>
          <AnimWord
            text="Alt salgsteamet ditt"
            frame={frame} inA={108} inB={128} outC={188} outD={210}
            fontSize={58} translateFrom="right"
          />
          <AnimWord
            text="trenger for å vokse"
            frame={frame} inA={116} inB={136} outC={188} outD={210}
            fontSize={58} goldWord="vokse" translateFrom="right"
          />
          <div style={{ marginTop: 16, opacity: svcHeadingP }}>
            <DrawLine p={svcHeadingP} width={540} />
          </div>
        </div>

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
                padding: '26px 36px',
                opacity: p,
                transform: `translateX(${lerp(28, 0, easeOutExpo(p))}px)`,
                boxShadow: `0 0 ${16 + shimmer * 12}px rgba(212,175,55,0.06)`,
              }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 23, fontWeight: 700, color: theme.white }}>
                  {s.title}
                </div>
                <div style={{ fontFamily: 'sans-serif', fontSize: 15, color: '#888', marginTop: 5 }}>
                  {s.sub}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Layer 4: Statement section */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        pointerEvents: 'none',
      }}>
        {[260, 420, 580].map((sz, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: sz, height: sz,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: `1px solid rgba(212,175,55,${0.18 - i * 0.04})`,
            opacity: statementP,
          }} />
        ))}
        <div style={{ textAlign: 'center', maxWidth: 1300, opacity: statementP }}>
          <div style={{
            fontFamily: 'Georgia, serif', fontSize: 70, fontWeight: 800, color: theme.white,
            transform: `translateY(${lerp(30, 0, statementP)}px)`,
          }}>
            Bygg mer <span style={{ color: theme.gold, textShadow: `0 0 30px ${theme.gold}66` }}>pipeline</span>
          </div>
          <div style={{
            fontFamily: 'sans-serif', fontSize: 28, color: '#ccc', marginTop: 24,
            transform: `translateY(${lerp(30, 0, statementP)}px)`,
          }}>
            Vær mer produktiv, dag for dag
          </div>
        </div>
      </AbsoluteFill>

      {/* Layer 5: CTA */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 28,
        pointerEvents: 'none',
      }}>
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
                fontSize: 76,
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

        {logoCtaP > 0 && (
          <div style={{ opacity: logoCtaP }}>
            <DrawLine p={logoCtaP} width={480} />
          </div>
        )}

        <div style={{
          opacity: ctaTextP,
          transform: `translateY(${lerp(24, 0, ctaTextP)}px)`,
          filter: `blur(${lerp(8, 0, easeOutExpo(ctaTextP))}px)`,
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'sans-serif', fontSize: 28, color: '#ccc', fontWeight: 300, letterSpacing: 2 }}>
            Klar for å bygge mer pipeline?
          </div>
          <div style={{
            fontFamily: 'Georgia, serif', fontSize: 48, color: theme.gold, fontWeight: 700,
            textShadow: `0 0 30px ${theme.gold}66`,
          }}>
            Be om en demo i dag
          </div>
        </div>

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
              Be om demo
            </div>
            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: shimmerX, width: 60,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
              transform: 'skewX(-20deg)',
            }} />
          </div>
        )}

        <div style={{
          opacity: ctaUrlP,
          transform: `translateY(${lerp(12, 0, ctaUrlP)}px)`,
          fontFamily: 'sans-serif', fontSize: 18,
          color: `${theme.gold}88`, letterSpacing: 4, textTransform: 'uppercase',
        }}>
          leadjabber.no
        </div>
      </AbsoluteFill>

      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: '#000',
        opacity: 1 - finalFade,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
