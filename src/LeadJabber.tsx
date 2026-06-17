import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from './fonts/loadPoppins';
import {
  easeOutExpo, easeOutBack, easeInOutCubic,
  clamp, prog, presence,
} from './utils/easing';

const fontFamily = loadFont();

// ─── Brand (from leadjabber.no) ────────────────────────────────────────────
const brand = {
  bg: '#FFFFFF',
  navy: '#292B3C',      // headings color from site CSS vars
  body: '#374151',      // body text color from site CSS vars
  teal: '#1994B5',      // brand illustration / accent color
  tealLight: '#559BB7', // logo mark color
  blue: '#3B82F6',      // bde-brand-primary-color
  gray: '#787E8B',
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const DrawLine: React.FC<{ p: number; width?: number }> = ({ p, width = 500 }) => (
  <div style={{
    width: p * width, height: 3, position: 'relative', overflow: 'visible',
    background: `linear-gradient(90deg, transparent, ${brand.teal} 20%, ${brand.blue} 50%, ${brand.teal} 80%, transparent)`,
    borderRadius: 2,
    boxShadow: `0 0 12px ${brand.teal}66`,
  }} />
);

const AnimWord: React.FC<{
  text: string;
  frame: number;
  inA: number; inB: number; outC: number; outD: number;
  fontSize?: number;
  color?: string;
  accentWord?: string;
  translateFrom?: 'bottom' | 'right' | 'left';
  style?: React.CSSProperties;
}> = ({ text, frame, inA, inB, outC, outD, fontSize = 36, color = brand.navy, accentWord, translateFrom = 'bottom', style = {} }) => {
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
          fontFamily, fontSize, fontWeight: 700,
          color: accentWord && w.toLowerCase().includes(accentWord.toLowerCase()) ? brand.teal : color,
        }}>
          {w}
        </span>
      ))}
    </div>
  );
};

/*
  TIMELINE (30fps):
  0   – 100  Logo + symbol intro, tagline
  100 – 130  Logo shrinks to top-left
  100 – 215  Headline "Få bedre produktivitet og bygg mer pipeline" + sub
  205 – 235  Headline slides out
  225 – 335  Solutions: Outreach / Møtebooking / Leadgenerering / LeadJabber cards
  325 – 355  Solutions slide out
  345 – 440  Testimonial — Oddvar Meyer, Sales Manager
  430 – 460  Testimonial fades
  450 – 495  CTA "Klar til å stupe inn?" / Be om demo
  470 – 500  Fade to white
*/

export const LeadJabber: React.FC = () => {
  const frame = useCurrentFrame();

  const introP = presence(frame, 0, 25, 100, 125);
  const cornerP = presence(frame, 110, 135, 470, 495);
  const taglineP = presence(frame, 55, 80, 100, 120);

  const headlineP = presence(frame, 110, 140, 205, 230);
  const subP = presence(frame, 140, 165, 205, 230);
  const ctaBtnsP = presence(frame, 165, 190, 205, 230);

  const solutions = [
    { title: 'Outreach', sub: 'Bygg pipeline med nye prospekter hver eneste måned.' },
    { title: 'Møtebooking', sub: 'Vi booker kvalitetsmøter direkte i kalenderen din.' },
    { title: 'Leadgenerering', sub: 'Strategiske salgstrakter som konverterer.' },
    { title: 'LeadJabber', sub: 'Programvaren som lar teamet ditt generere leads selv.' },
  ];
  const solHeadingP = presence(frame, 228, 250, 322, 348);

  const testimonialP = presence(frame, 348, 375, 428, 455);

  const ctaP = presence(frame, 452, 478, 600, 600);
  const ctaBtnP = presence(frame, 472, 495, 600, 600);

  const shimmerX = ((frame * 2.5) % 130) - 30;

  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 480, 500)));

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg, fontFamily }}>

      {/* Soft brand-color backdrop wash */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${brand.teal}0f 0%, transparent 70%)`,
      }} />

      {/* Layer 1: Big center logo intro */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 28,
        opacity: introP,
        transform: `scale(${lerp(0.85, 1, introP)})`,
        pointerEvents: 'none',
      }}>
        <Img
          src={staticFile('leadjabber/symbol.png')}
          style={{ width: 130, height: 130, transform: `translateY(${lerp(20, 0, introP)}px)` }}
        />
        <div style={{ display: 'flex', alignItems: 'baseline', letterSpacing: 2 }}>
          <span style={{ fontFamily, fontSize: 88, fontWeight: 300, color: brand.tealLight }}>Lead</span>
          <span style={{ fontFamily, fontSize: 88, fontWeight: 700, color: brand.navy }}>Jabber</span>
        </div>
        <div style={{ opacity: taglineP * introP }}>
          <DrawLine p={taglineP} width={460} />
        </div>
        <div style={{
          opacity: taglineP * introP,
          transform: `translateY(${lerp(16, 0, taglineP)}px)`,
          fontFamily, fontSize: 24, color: brand.body, textAlign: 'center', maxWidth: 760,
        }}>
          LeadJabber hjelper selgere med å bygge mer pipeline og være mer produktive
        </div>
      </AbsoluteFill>

      {/* Layer 2: small corner logo */}
      <div style={{
        position: 'absolute', top: 50, left: 64,
        opacity: cornerP,
        display: 'flex', alignItems: 'center', gap: 12,
        transform: `translateY(${lerp(-20, 0, easeOutExpo(clamp(prog(frame, 110, 135))))}px)`,
        zIndex: 10,
      }}>
        <Img src={staticFile('leadjabber/symbol.png')} style={{ width: 42, height: 42 }} />
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontFamily, fontSize: 26, fontWeight: 300, color: brand.tealLight }}>Lead</span>
          <span style={{ fontFamily, fontSize: 26, fontWeight: 700, color: brand.navy }}>Jabber</span>
        </div>
      </div>

      {/* Layer 3: Headline */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 30,
        padding: '0 160px', textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ opacity: headlineP }}>
          <AnimWord
            text="Få bedre produktivitet og"
            frame={frame} inA={110} inB={132} outC={205} outD={228}
            fontSize={64} translateFrom="bottom"
            style={{ justifyContent: 'center' }}
          />
          <AnimWord
            text="bygg mer pipeline"
            frame={frame} inA={120} inB={142} outC={205} outD={228}
            fontSize={64} accentWord="pipeline" translateFrom="bottom"
            style={{ justifyContent: 'center', marginTop: 6 }}
          />
        </div>
        <div style={{
          opacity: subP,
          transform: `translateY(${lerp(16, 0, subP)}px)`,
          fontFamily, fontSize: 26, color: brand.body, maxWidth: 880, lineHeight: 1.5,
        }}>
          LeadJabber gjør hele salgsteamet ditt mer effektivt. Slutt å ringe kaldt og ha en-til-en-samtaler i stor skala.
        </div>
        <div style={{ display: 'flex', gap: 20, opacity: ctaBtnsP, transform: `translateY(${lerp(16, 0, ctaBtnsP)}px)` }}>
          <div style={{
            fontFamily, fontWeight: 700, fontSize: 22, color: brand.navy,
            padding: '18px 38px', borderRadius: 50, border: `2px solid ${brand.navy}33`,
          }}>Finn ut mer</div>
          <div style={{
            fontFamily, fontWeight: 700, fontSize: 22, color: '#fff',
            padding: '18px 38px', borderRadius: 50, background: brand.teal,
            boxShadow: `0 10px 30px ${brand.teal}55`,
          }}>Be om demo</div>
        </div>
      </AbsoluteFill>

      {/* Layer 4: Solutions */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 130px', gap: 40,
        pointerEvents: 'none',
      }}>
        <div style={{ opacity: solHeadingP }}>
          <AnimWord
            text="Våre løsninger"
            frame={frame} inA={228} inB={250} outC={322} outD={346}
            fontSize={56} accentWord="løsninger" translateFrom="right"
          />
          <div style={{ marginTop: 16, opacity: solHeadingP }}>
            <DrawLine p={solHeadingP} width={500} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          {solutions.map((s, i) => {
            const p = presence(frame, 252 + i * 12, 276 + i * 12, 324, 348);
            if (p <= 0) return null;
            return (
              <div key={i} style={{
                background: '#fff',
                border: `1px solid ${brand.teal}33`,
                borderRadius: 16,
                padding: '26px 32px',
                opacity: p,
                transform: `translateX(${lerp(28, 0, easeOutExpo(p))}px)`,
                boxShadow: `0 10px 30px rgba(25,148,181,0.08)`,
              }}>
                <div style={{ fontFamily, fontSize: 24, fontWeight: 700, color: brand.navy }}>
                  {s.title}
                </div>
                <div style={{ fontFamily, fontSize: 16, color: brand.gray, marginTop: 6 }}>
                  {s.sub}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Layer 5: Testimonial */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 220px', textAlign: 'center',
        opacity: testimonialP,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily, fontSize: 110, color: brand.teal, lineHeight: 0.5, marginBottom: 10,
        }}>“</div>
        <div style={{
          fontFamily, fontSize: 32, fontWeight: 500, color: brand.navy, lineHeight: 1.5,
          transform: `translateY(${lerp(20, 0, testimonialP)}px)`,
        }}>
          Jeg har brukt LeadJabber i flere år, og det har blitt helt avgjørende for min salgsprosess.
          Systemet har forvandlet måten jeg jobber på.
        </div>
        <div style={{ marginTop: 30, fontFamily, fontSize: 22, fontWeight: 700, color: brand.teal }}>
          Oddvar Meyer
        </div>
        <div style={{ fontFamily, fontSize: 17, color: brand.gray }}>
          Sales Manager
        </div>
      </AbsoluteFill>

      {/* Layer 6: CTA */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 26,
        background: `linear-gradient(135deg, ${brand.navy}, #1A2540)`,
        opacity: ctaP,
        pointerEvents: 'none',
      }}>
        <Img
          src={staticFile('leadjabber/logo-white.png')}
          style={{ width: 380, opacity: ctaP, transform: `scale(${lerp(0.85, 1, easeOutBack(clamp(prog(frame, 452, 478))))})` }}
        />
        <div style={{
          opacity: ctaP,
          textAlign: 'center', marginTop: 10,
        }}>
          <div style={{ fontFamily, fontSize: 30, fontWeight: 700, color: '#fff' }}>
            Klar til å stupe inn?
          </div>
        </div>
        {ctaBtnP > 0 && (
          <div style={{
            opacity: ctaBtnP,
            transform: `scale(${easeOutBack(clamp(prog(frame, 472, 494)))})`,
            position: 'relative', borderRadius: 50, overflow: 'hidden',
          }}>
            <div style={{
              background: brand.teal,
              color: '#fff',
              fontFamily, fontSize: 24, fontWeight: 700,
              padding: '18px 56px', borderRadius: 50,
              boxShadow: `0 10px 40px ${brand.teal}66`,
            }}>
              Be om demo
            </div>
            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: shimmerX, width: 60,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
              transform: 'skewX(-20deg)',
            }} />
          </div>
        )}
        <div style={{ opacity: ctaBtnP, fontFamily, fontSize: 16, color: `${brand.tealLight}cc`, letterSpacing: 3, textTransform: 'uppercase' }}>
          leadjabber.no
        </div>
      </AbsoluteFill>

      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: '#fff',
        opacity: 1 - finalFade,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
