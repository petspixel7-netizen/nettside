import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  easeOutExpo, easeOutBack, easeInOutCubic,
  clamp, prog, presence,
} from './utils/easing';

const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';

// ─── Premium palette ──────────────────────────────────────────────────────
const NAVY    = '#080B14';
const NAVY2   = '#0E1424';
const GOLD    = '#C9A227';
const GOLDF   = '#E8CB6A';
const CREAM   = '#F4F1E8';
const MUTED   = 'rgba(244,241,232,0.55)';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ─── Quiet, expensive-feeling backdrop ─────────────────────────────────────
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame;
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: NAVY, overflow: 'hidden' }}>
      {/* Soft radial glow, slowly drifting */}
      <div style={{
        position: 'absolute',
        left: `${50 + Math.sin(t * 0.0025) * 8}%`,
        top: `${42 + Math.cos(t * 0.002) * 6}%`,
        width: 1400, height: 1400,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${GOLD}14 0%, transparent 60%)`,
      }} />
      {/* Fine hairline grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(201,162,39,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,162,39,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '96px 96px',
      }} />
      {/* Top-to-bottom vignette for depth */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${NAVY2} 0%, transparent 30%, transparent 70%, ${NAVY} 100%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)',
      }} />
    </div>
  );
};

const Hairline: React.FC<{ p: number; width?: number }> = ({ p, width = 120 }) => (
  <div style={{
    width: p * width, height: 1,
    background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLDF}, ${GOLD}, transparent)`,
    boxShadow: `0 0 10px ${GOLD}88`,
  }} />
);

// Letter-by-letter wordmark reveal — refined, no bounce
const Wordmark: React.FC<{ frame: number; baseAt: number; fontSize?: number }> = ({ frame, baseAt, fontSize = 108 }) => {
  const letters = ['C', 'o', 'l', 'u', 'm', 'b', 'i'];
  return (
    <div style={{ display: 'flex' }}>
      {letters.map((ch, i) => {
        const delay = baseAt + i * 3.5;
        const p = easeOutExpo(clamp(prog(frame, delay, delay + 26)));
        return (
          <span key={i} style={{
            display: 'inline-block',
            fontFamily, fontWeight: 300, fontSize,
            color: i === 0 ? GOLD : CREAM,
            letterSpacing: '1px',
            opacity: p,
            transform: `translateY(${lerp(28, 0, p)}px)`,
            filter: `blur(${lerp(6, 0, p)}px)`,
            textShadow: i === 0 ? `0 0 30px ${GOLD}66` : '0 4px 30px rgba(0,0,0,0.5)',
          }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/*
  TIMELINE (30fps, 600 frames = 20s):
  0   – 35   Backdrop settles
  10  – 95   Wordmark reveals letter by letter, hairline draws, tagline blurs in
  110 – 140  Wordmark shrinks to corner mark
  118 – 248  Tjenester — 4 pillar cards
  238 – 262  Out
  255 – 380  Prosess — 3 steps (Kartlegging → Implementering → Oppfølging)
  370 – 395  Out
  388 – 460  Columbi-egget sitat
  450 – 475  Out
  468 – 575  CTA
  565 – 600  Fade to black
*/

export const ColumbiAd: React.FC = () => {
  const frame = useCurrentFrame();

  const introP   = presence(frame, 0, 30, 110, 138);
  const cornerP  = presence(frame, 122, 148, 555, 580);

  const lineP    = easeOutExpo(clamp(prog(frame, 78, 105)));
  const taglineP = presence(frame, 85, 110, 110, 130);

  // Services
  const svcHeadP = presence(frame, 118, 142, 238, 262);
  const pillars = [
    { n: '01', title: 'ERP', sub: 'Business NXT & Visma Net' },
    { n: '02', title: 'HRM & Lønn', sub: '4Human, Dottie HR, Sticos' },
    { n: '03', title: 'Regnskap', sub: 'Faglig oppfølging og rådgivning' },
    { n: '04', title: 'IT & Support', sub: 'Drift, sikkerhet og brukerstøtte' },
  ];

  // Process
  const procHeadP = presence(frame, 255, 280, 370, 395);
  const steps = [
    { num: '1', title: 'Vi kartlegger', sub: 'Dagens systemer og behov gjennomgås i detalj.' },
    { num: '2', title: 'Vi implementerer', sub: 'Riktig løsning settes opp og driftes sikkert.' },
    { num: '3', title: 'Vi følger opp', sub: 'Løpende rådgivning og support, alltid tilgjengelig.' },
  ];

  // Quote
  const quoteP = presence(frame, 388, 412, 450, 475);

  // CTA
  const ctaWordP = presence(frame, 468, 498, 555, 580);
  const ctaTextP = presence(frame, 495, 517, 555, 580);
  const ctaBtnP  = presence(frame, 515, 538, 555, 580);
  const ctaUrlP  = presence(frame, 535, 553, 555, 580);
  const ctaTelP  = presence(frame, 548, 564, 555, 580);
  const shimmerX = ((frame * 2.2) % 130) - 30;

  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 568, 598)));

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, fontFamily }}>
      <Backdrop />

      {/* ── Corner wordmark ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 50, left: 64,
        opacity: cornerP,
        transform: `translateY(${lerp(-16, 0, cornerP)}px)`,
        zIndex: 10,
      }}>
        <span style={{ fontFamily, fontWeight: 300, fontSize: 26, letterSpacing: '1px', color: CREAM }}>
          <span style={{ color: GOLD }}>C</span>olumbi
        </span>
      </div>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 22,
        opacity: introP, pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily, fontWeight: 400, fontSize: 13,
          letterSpacing: 7, textTransform: 'uppercase', color: GOLD,
          opacity: easeOutExpo(clamp(prog(frame, 10, 32))),
        }}>
          Moss · Etablert rådgiverhus
        </span>

        <Wordmark frame={frame} baseAt={22} />

        <div style={{ opacity: lineP }}>
          <Hairline p={lineP} width={460} />
        </div>

        <div style={{
          opacity: taglineP,
          transform: `translateY(${lerp(14, 0, taglineP)}px)`,
          filter: `blur(${lerp(6, 0, easeOutExpo(taglineP))}px)`,
          fontFamily, fontWeight: 300, fontSize: 21,
          letterSpacing: '0.5px', color: MUTED, textAlign: 'center',
        }}>
          Alt du trenger innen økonomi, HR og IT
        </div>
      </AbsoluteFill>

      {/* ── Tjenester ────────────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 130px', gap: 56,
        pointerEvents: 'none',
      }}>
        <div style={{
          opacity: svcHeadP,
          transform: `translateY(${lerp(16, 0, svcHeadP)}px)`,
        }}>
          <div style={{ fontFamily, fontWeight: 300, fontSize: 46, color: CREAM, letterSpacing: '0.5px' }}>
            Ett sted for <span style={{ color: GOLD }}>alt</span> det viktige
          </div>
          <div style={{ marginTop: 18 }}>
            <Hairline p={svcHeadP} width={340} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
          {pillars.map((s, i) => {
            const p = presence(frame, 150 + i * 12, 176 + i * 12, 238, 260);
            if (p <= 0) return null;
            return (
              <div key={i} style={{
                opacity: p,
                transform: `translateY(${lerp(22, 0, easeOutExpo(p))}px)`,
                borderTop: `1px solid ${GOLD}55`,
                paddingTop: 18,
              }}>
                <div style={{ fontFamily, fontWeight: 300, fontSize: 14, color: GOLD, letterSpacing: 2 }}>
                  {s.n}
                </div>
                <div style={{ fontFamily, fontWeight: 500, fontSize: 22, color: CREAM, marginTop: 10 }}>
                  {s.title}
                </div>
                <div style={{ fontFamily, fontWeight: 300, fontSize: 14, color: MUTED, marginTop: 8, lineHeight: 1.5 }}>
                  {s.sub}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ── Prosess ──────────────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 56,
        pointerEvents: 'none',
      }}>
        <div style={{
          opacity: procHeadP,
          transform: `translateY(${lerp(16, 0, procHeadP)}px)`,
          textAlign: 'center',
        }}>
          <div style={{ fontFamily, fontWeight: 300, fontSize: 46, color: CREAM }}>
            Slik <span style={{ color: GOLD }}>jobber</span> vi
          </div>
        </div>

        <div style={{ display: 'flex', gap: 90, padding: '0 100px' }}>
          {steps.map((s, i) => {
            const p = presence(frame, 282 + i * 18, 310 + i * 18, 372, 394);
            if (p <= 0) return null;
            return (
              <div key={i} style={{
                opacity: p,
                transform: `translateY(${lerp(26, 0, easeOutExpo(p))}px)`,
                textAlign: 'center', maxWidth: 280,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  border: `1px solid ${GOLD}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 22px',
                  fontFamily, fontWeight: 300, fontSize: 22, color: GOLD,
                  boxShadow: `0 0 24px ${GOLD}33`,
                }}>
                  {s.num}
                </div>
                <div style={{ fontFamily, fontWeight: 500, fontSize: 24, color: CREAM, marginBottom: 10 }}>
                  {s.title}
                </div>
                <div style={{ fontFamily, fontWeight: 300, fontSize: 15, color: MUTED, lineHeight: 1.6 }}>
                  {s.sub}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ── Columbi-egget sitat ──────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 30,
        padding: '0 260px', textAlign: 'center',
        opacity: quoteP,
        transform: `translateY(${lerp(18, 0, quoteP)}px)`,
        filter: `blur(${lerp(6, 0, quoteP)}px)`,
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily, fontWeight: 400, fontSize: 13, letterSpacing: 6,
          textTransform: 'uppercase', color: GOLD,
        }}>
          Columbi-egget
        </span>
        <span style={{
          fontFamily, fontWeight: 300, fontStyle: 'italic',
          fontSize: 34, lineHeight: 1.5, color: CREAM,
        }}>
          Vi løser <span style={{ color: GOLD }}>komplekse utfordringer</span> med
          enkle, smarte løsninger — og henter maksimal verdi
          ut av systemene du allerede har.
        </span>
      </AbsoluteFill>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 26,
        pointerEvents: 'none',
      }}>
        <div style={{ opacity: ctaWordP, transform: `scale(${lerp(0.94, 1, ctaWordP)})` }}>
          <Wordmark frame={frame} baseAt={468} fontSize={86} />
        </div>

        <div style={{ opacity: ctaWordP }}>
          <Hairline p={ctaWordP} width={420} />
        </div>

        <div style={{
          opacity: ctaTextP,
          transform: `translateY(${lerp(20, 0, ctaTextP)}px)`,
          filter: `blur(${lerp(6, 0, easeOutExpo(ctaTextP))}px)`,
          textAlign: 'center',
        }}>
          <div style={{ fontFamily, fontWeight: 300, fontSize: 24, color: MUTED, letterSpacing: '0.5px' }}>
            Klar for systemer som
          </div>
          <div style={{ fontFamily, fontWeight: 500, fontSize: 42, color: GOLD, textShadow: `0 0 30px ${GOLD}55` }}>
            faktisk jobber for deg?
          </div>
        </div>

        {ctaBtnP > 0 && (
          <div style={{
            opacity: ctaBtnP,
            transform: `scale(${easeOutBack(clamp(prog(frame, 515, 538)))})`,
            position: 'relative', overflow: 'hidden',
            border: `1px solid ${GOLD}`,
          }}>
            <div style={{
              fontFamily, fontWeight: 500, fontSize: 19,
              color: GOLD, padding: '17px 52px', letterSpacing: 2,
            }}>
              Ta kontakt i dag
            </div>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: shimmerX, width: 50,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
              transform: 'skewX(-20deg)',
            }} />
          </div>
        )}

        <div style={{
          opacity: ctaUrlP,
          transform: `translateY(${lerp(10, 0, ctaUrlP)}px)`,
          fontFamily, fontWeight: 400, fontSize: 17,
          color: GOLD, letterSpacing: 3,
        }}>
          columbi.no
        </div>

        <div style={{
          opacity: ctaTelP,
          transform: `translateY(${lerp(8, 0, ctaTelP)}px)`,
          fontFamily, fontWeight: 300, fontSize: 15,
          color: MUTED, letterSpacing: 1,
        }}>
          +47 69 20 94 00 · Tykkemyr 27, Moss
        </div>
      </AbsoluteFill>

      <div style={{
        position: 'absolute', inset: 0, backgroundColor: '#000',
        opacity: 1 - finalFade, pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
