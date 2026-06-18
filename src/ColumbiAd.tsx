import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import {
  easeOutExpo, easeOutBack, easeInOutCubic,
  clamp, prog, presence,
} from './utils/easing';

const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';

// ─── Real Columbi brand palette (sampled from columbi.no) ─────────────────
const NAVY      = '#08214B'; // brand primary
const NAVY_DEEP = '#04112A'; // background base, darker for depth
const BLUE      = '#2EA3F2'; // brand accent
const BLUEL     = '#7CC8FB'; // light accent / highlight
const WHITE     = '#FFFFFF';
const MUTED     = 'rgba(255,255,255,0.55)';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ─── Backdrop — quiet brand-navy field with drifting blue motes ───────────
const DOTS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 89.3) % 100,
  r: 0.6 + (i % 5) * 0.4,
  vy: -(0.004 + (i % 6) * 0.003),
  vx: Math.sin(i * 2.4) * 0.0015,
  op: 0.08 + (i % 5) * 0.05,
  ph: (i * 41) % (Math.PI * 2),
}));

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: NAVY_DEEP, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        left: `${50 + Math.sin(frame * 0.0025) * 7}%`,
        top: `${44 + Math.cos(frame * 0.002) * 5}%`,
        width: 1500, height: 1500,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${NAVY}cc 0%, transparent 62%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(46,163,242,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(46,163,242,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '96px 96px',
      }} />
      {DOTS.map((d, i) => {
        const px = ((d.x + frame * d.vx * 100) % 100 + 100) % 100;
        const py = ((d.y + frame * d.vy * 100) % 100 + 100) % 100;
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.05 + d.ph);
        return (
          <div key={i} style={{
            position: 'absolute', left: `${px}%`, top: `${py}%`,
            width: d.r, height: d.r, borderRadius: '50%',
            backgroundColor: BLUEL, opacity: d.op * pulse,
          }} />
        );
      })}
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
    background: `linear-gradient(90deg, transparent, ${BLUE}, ${BLUEL}, ${BLUE}, transparent)`,
    boxShadow: `0 0 10px ${BLUE}88`,
  }} />
);

// ─── Columbi-egg icon — real brand mark, with a sweeping sheen ────────────
const EggIcon: React.FC<{ frame: number; size?: number; baseAt: number; spin?: boolean }> = ({
  frame, size = 160, baseAt, spin = true,
}) => {
  const p = easeOutBack(clamp(prog(frame, baseAt, baseAt + 34)));
  const rot = spin ? Math.sin((frame - baseAt) * 0.012) * 6 : 0;
  const sheenX = -60 + (((frame - baseAt) * 1.6) % 160);
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.04);

  return (
    <div style={{
      width: size, height: size * (52.26 / 50.56),
      opacity: p,
      transform: `scale(${lerp(0.5, 1, p)}) rotate(${rot}deg)`,
      filter: `drop-shadow(0 0 ${20 + glow * 14}px ${BLUE}77)`,
    }}>
      <svg viewBox="0 0 50.56 52.26" width="100%" height="100%">
        <defs>
          <linearGradient id="eggFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BLUEL} />
            <stop offset="55%" stopColor={BLUE} />
            <stop offset="100%" stopColor={NAVY} />
          </linearGradient>
          <clipPath id="eggClip">
            <path d="M4.64,1.66C-3.35,7.73-.55,34.17,9.45,47.34c6.58,8.66,21.07,4.51,29.46-1.86,9.8-7.44,15.38-18.5,8.78-27.18C38.67,6.42,12.36-4.2,4.64,1.66ZM33.53,39.69c-6.51,4.95-15.8,3.67-20.74-2.84s-3.68-15.8,2.84-20.74,15.8-3.68,20.75,2.84,3.68,15.8-2.84,20.75Z" />
            <ellipse cx="24.12" cy="27.3" rx="16.67" ry="17.03" transform="translate(-11.6 20.15) rotate(-37.22)" />
          </clipPath>
        </defs>
        <path fill="url(#eggFill)" d="M4.64,1.66C-3.35,7.73-.55,34.17,9.45,47.34c6.58,8.66,21.07,4.51,29.46-1.86,9.8-7.44,15.38-18.5,8.78-27.18C38.67,6.42,12.36-4.2,4.64,1.66ZM33.53,39.69c-6.51,4.95-15.8,3.67-20.74-2.84s-3.68-15.8,2.84-20.74,15.8-3.68,20.75,2.84,3.68,15.8-2.84,20.75Z" />
        <ellipse fill="url(#eggFill)" cx="24.12" cy="27.3" rx="16.67" ry="17.03" transform="translate(-11.6 20.15) rotate(-37.22)" />
        <rect x={sheenX} y="-10" width="26" height="72" fill="rgba(255,255,255,0.55)"
          clipPath="url(#eggClip)" style={{ mixBlendMode: 'screen' }} transform="skewX(-18)" />
      </svg>
    </div>
  );
};

/*
  TIMELINE (30fps, 620 frames ≈ 20.7s):
  0   – 36   Backdrop settles
  10  – 130  Egg icon assembles + spins in, real logo wordmark fades in, tagline wipes in
  118 – 148  Intro shrinks, corner logo (real svg) fades in
  126 – 256  Tjenester — "Vi har kompetansen som gir full effekt av dine kjernesystemer" + 4 pillars
  246 – 270  Out
  263 – 388  Prosess — 3 steps
  378 – 403  Out
  396 – 478  Columbi-egg sitat (real quote) + egg icon beside
  468 – 493  Out
  486 – 590  CTA — egg + logo return, tagline, button, contact
  580 – 620  Fade to black
*/

export const ColumbiAd: React.FC = () => {
  const frame = useCurrentFrame();

  const introP  = presence(frame, 0, 32, 118, 144);
  const cornerP = presence(frame, 128, 154, 568, 593);

  const lineP    = easeOutExpo(clamp(prog(frame, 86, 112)));
  const taglineP = presence(frame, 92, 116, 118, 138);

  // Services
  const svcHeadP = presence(frame, 126, 150, 246, 270);
  const pillars = [
    { n: '01', title: 'ERP', sub: 'Business NXT & Visma Net' },
    { n: '02', title: 'HRM & Lønn', sub: '4Human HRM, Dottie HR, Sticos' },
    { n: '03', title: 'Regnskap', sub: 'Faglig oppfølging og rådgivning' },
    { n: '04', title: 'IT & Support', sub: 'Drift, sikkerhet og brukerstøtte' },
  ];

  // Process
  const procHeadP = presence(frame, 263, 288, 378, 403);
  const steps = [
    { num: '1', title: 'Vi kartlegger', sub: 'Dagens systemer og behov gjennomgås i detalj.' },
    { num: '2', title: 'Vi implementerer', sub: 'Riktig løsning settes opp og driftes sikkert.' },
    { num: '3', title: 'Vi følger opp', sub: 'Løpende rådgivning og support, alltid tilgjengelig.' },
  ];

  // Quote
  const quoteP = presence(frame, 396, 422, 468, 493);

  // CTA
  const ctaIconP = presence(frame, 486, 514, 568, 593);
  const ctaTextP = presence(frame, 512, 534, 568, 593);
  const ctaBtnP  = presence(frame, 532, 555, 568, 593);
  const ctaUrlP  = presence(frame, 553, 571, 568, 593);
  const ctaTelP  = presence(frame, 566, 582, 568, 593);
  const shimmerX = ((frame * 2.2) % 130) - 30;

  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 588, 618)));

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY_DEEP, fontFamily }}>
      <Backdrop />

      {/* ── Corner mark — real logo svg ─────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 46, left: 64, display: 'flex', alignItems: 'center', gap: 14,
        opacity: cornerP,
        transform: `translateY(${lerp(-16, 0, cornerP)}px)`,
        zIndex: 10,
      }}>
        <EggIcon frame={frame} size={34} baseAt={128} spin={false} />
        <Img src={staticFile('columbi/logo_white.svg')} style={{ height: 22 }} />
      </div>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 26,
        opacity: introP, pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily, fontWeight: 400, fontSize: 13,
          letterSpacing: 7, textTransform: 'uppercase', color: BLUE,
          opacity: easeOutExpo(clamp(prog(frame, 10, 32))),
        }}>
          Moss · Etablert rådgiverhus
        </span>

        <EggIcon frame={frame} size={170} baseAt={20} />

        <Img src={staticFile('columbi/logo_white.svg')} style={{
          height: 56, marginTop: 6,
          opacity: presence(frame, 58, 82, 118, 138),
          transform: `translateY(${lerp(16, 0, presence(frame, 58, 82, 118, 138))}px)`,
        }} />

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
          <div style={{ fontFamily, fontWeight: 300, fontSize: 42, color: WHITE, letterSpacing: '0.5px', lineHeight: 1.25 }}>
            Vi har kompetansen som gir<br />
            <span style={{ color: BLUE }}>full effekt</span> av dine kjernesystemer
          </div>
          <div style={{ marginTop: 18 }}>
            <Hairline p={svcHeadP} width={340} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
          {pillars.map((s, i) => {
            const p = presence(frame, 158 + i * 12, 184 + i * 12, 246, 268);
            if (p <= 0) return null;
            return (
              <div key={i} style={{
                opacity: p,
                transform: `translateY(${lerp(22, 0, easeOutExpo(p))}px)`,
                borderTop: `1px solid ${BLUE}66`,
                paddingTop: 18,
              }}>
                <div style={{ fontFamily, fontWeight: 300, fontSize: 14, color: BLUE, letterSpacing: 2 }}>
                  {s.n}
                </div>
                <div style={{ fontFamily, fontWeight: 500, fontSize: 22, color: WHITE, marginTop: 10 }}>
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
          <div style={{ fontFamily, fontWeight: 300, fontSize: 46, color: WHITE }}>
            Slik <span style={{ color: BLUE }}>jobber</span> vi
          </div>
        </div>

        <div style={{ display: 'flex', gap: 90, padding: '0 100px' }}>
          {steps.map((s, i) => {
            const p = presence(frame, 290 + i * 18, 318 + i * 18, 380, 402);
            if (p <= 0) return null;
            return (
              <div key={i} style={{
                opacity: p,
                transform: `translateY(${lerp(26, 0, easeOutExpo(p))}px)`,
                textAlign: 'center', maxWidth: 280,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  border: `1px solid ${BLUE}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 22px',
                  fontFamily, fontWeight: 300, fontSize: 22, color: BLUE,
                  boxShadow: `0 0 24px ${BLUE}33`,
                }}>
                  {s.num}
                </div>
                <div style={{ fontFamily, fontWeight: 500, fontSize: 24, color: WHITE, marginBottom: 10 }}>
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

      {/* ── Columbi-egg sitat (ekte tekst fra siden) ───────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 30,
        padding: '0 240px', textAlign: 'center',
        opacity: quoteP,
        transform: `translateY(${lerp(18, 0, quoteP)}px)`,
        filter: `blur(${lerp(6, 0, quoteP)}px)`,
        pointerEvents: 'none',
      }}>
        <EggIcon frame={frame} size={84} baseAt={396} />
        <span style={{
          fontFamily, fontWeight: 400, fontSize: 13, letterSpacing: 6,
          textTransform: 'uppercase', color: BLUE,
        }}>
          Columbi-egget
        </span>
        <span style={{
          fontFamily, fontWeight: 300, fontStyle: 'italic',
          fontSize: 32, lineHeight: 1.5, color: WHITE,
        }}>
          Uttrykket <span style={{ color: BLUE }}>"Columbi egg"</span> illustrerer
          å løse krevende utfordringer på en smart måte.
          Det er hva vi gjør!
        </span>
      </AbsoluteFill>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 26,
        pointerEvents: 'none',
      }}>
        <div style={{ opacity: ctaIconP }}>
          <EggIcon frame={frame} size={110} baseAt={486} />
        </div>

        <Img src={staticFile('columbi/logo_white.svg')} style={{
          height: 50,
          opacity: ctaIconP,
          transform: `scale(${lerp(0.92, 1, ctaIconP)})`,
        }} />

        <div style={{ opacity: ctaIconP }}>
          <Hairline p={ctaIconP} width={420} />
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
          <div style={{ fontFamily, fontWeight: 500, fontSize: 42, color: BLUE, textShadow: `0 0 30px ${BLUE}55` }}>
            faktisk jobber for deg?
          </div>
        </div>

        {ctaBtnP > 0 && (
          <div style={{
            opacity: ctaBtnP,
            transform: `scale(${easeOutBack(clamp(prog(frame, 532, 555)))})`,
            position: 'relative', overflow: 'hidden',
            background: BLUE, borderRadius: 8,
          }}>
            <div style={{
              fontFamily, fontWeight: 600, fontSize: 19,
              color: NAVY_DEEP, padding: '17px 52px', letterSpacing: 1,
            }}>
              Ta kontakt i dag
            </div>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: shimmerX, width: 50,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
              transform: 'skewX(-20deg)',
            }} />
          </div>
        )}

        <div style={{
          opacity: ctaUrlP,
          transform: `translateY(${lerp(10, 0, ctaUrlP)}px)`,
          fontFamily, fontWeight: 400, fontSize: 17,
          color: BLUEL, letterSpacing: 3,
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
