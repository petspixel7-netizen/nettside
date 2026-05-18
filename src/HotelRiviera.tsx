import React from 'react';
import { AbsoluteFill, useCurrentFrame, Img, staticFile } from 'remotion';
import {
  easeOutExpo, easeInOutCubic, easeOutBack,
  clamp, prog, presence,
} from './utils/easing';

// ─── Constants ───────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const GOLD   = '#C9A85C';
const GOLDF  = '#E8C97A';
const CREAM  = '#F5EDD8';
const BG     = '#07080C';
const MUTED  = '#94A3B8';
const TOTAL  = 1650; // 55s @ 30fps

// Section start frames
const SS = {
  INTRO:    0,
  LOCATION: 158,
  ROOMS:    335,
  SPA:      615,
  DINING:   825,
  PACKAGES: 1040,
  EVENTS:   1265,
  CTA:      1450,
};

// ─── Particles ────────────────────────────────────────────────────────────────
const DOTS = Array.from({ length: 50 }, (_, i) => ({
  x:  (i * 137.5) % 100,
  y:  (i * 89.3)  % 100,
  r:  0.5 + (i % 5) * 0.35,
  vy: -(0.005 + (i % 6) * 0.003),
  vx: Math.sin(i * 2.4) * 0.0018,
  op: 0.06 + (i % 5) * 0.045,
  ph: (i * 41)    % (Math.PI * 2),
  blue: i % 6 < 2,
}));

// ─── Section photo (Ken Burns + crossfade) ───────────────────────────────────
const Photo: React.FC<{
  src: string; start: number; end: number;
  zoomFrom?: number; zoomTo?: number;
  panX?: [number, number]; panY?: [number, number];
  tint?: string; tintStrength?: number;
}> = ({
  src, start, end,
  zoomFrom = 1.08, zoomTo = 1.18,
  panX = [0, 0], panY = [0, 0],
  tint = BG, tintStrength = 0.55,
}) => {
  const frame = useCurrentFrame();
  const t     = easeInOutCubic(clamp(prog(frame, start, end)));
  const fadeI = easeOutExpo(clamp(prog(frame, start, start + 25)));
  const fadeO = 1 - easeInOutCubic(clamp(prog(frame, end - 25, end)));
  const alpha = Math.min(fadeI, fadeO);
  const zoom  = lerp(zoomFrom, zoomTo, t);
  const tx    = lerp(panX[0], panX[1], t);
  const ty    = lerp(panY[0], panY[1], t);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: alpha, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: '-15%',
        transform: `scale(${zoom}) translate(${tx}%, ${ty}%)`,
      }}>
        <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* Gradient overlay — heavy bottom, lighter top */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(
          to bottom,
          rgba(7,8,12,0.35) 0%,
          rgba(7,8,12,0.42) 35%,
          rgba(7,8,12,0.72) 70%,
          rgba(7,8,12,0.90) 100%
        )`,
      }} />
      {/* Subtle colour tint */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: tint, opacity: tintStrength * 0.18 }} />
    </div>
  );
};

// ─── Gold rule that draws itself ──────────────────────────────────────────────
const GoldRule: React.FC<{ p: number; width?: number }> = ({ p, width = 60 }) => (
  <div style={{
    width: p * width, height: 1.5,
    background: `linear-gradient(90deg, ${GOLD}, ${GOLDF} 50%, ${GOLD})`,
    boxShadow: `0 0 8px ${GOLD}88`,
    borderRadius: 2,
    marginBottom: 14,
  }} />
);

// ─── Text block: category label + heading + body ──────────────────────────────
interface BlockProps {
  frame: number;
  baseAt: number;       // first element appears at this absolute frame
  label?: string;
  heading: string;
  body?: string;
  price?: string;
  accentWord?: string;  // word in heading to colour gold
  align?: 'left' | 'center';
  outAt?: number;
}

const Block: React.FC<BlockProps> = ({
  frame, baseAt, label, heading, body, price, accentWord,
  align = 'left', outAt = baseAt + 200,
}) => {
  const labelP   = presence(frame, baseAt,      baseAt + 22,  outAt,       outAt + 18);
  const ruleP    = easeOutExpo(clamp(prog(frame, baseAt + 10, baseAt + 40)));
  const headP    = presence(frame, baseAt + 18, baseAt + 42,  outAt,       outAt + 18);
  const bodyP    = presence(frame, baseAt + 32, baseAt + 54,  outAt,       outAt + 18);
  const priceP   = presence(frame, baseAt + 46, baseAt + 68,  outAt,       outAt + 18);

  const slideIn  = (p: number, dir: 'y' | 'x' = 'y') => ({
    opacity: p,
    transform: dir === 'y'
      ? `translateY(${lerp(18, 0, easeOutExpo(p))}px)`
      : `translateX(${lerp(24, 0, easeOutExpo(p))}px)`,
    filter: `blur(${lerp(5, 0, easeOutExpo(p))}px)`,
  });

  const alignStyle: React.CSSProperties = align === 'center'
    ? { textAlign: 'center', alignItems: 'center' }
    : { textAlign: 'left', alignItems: 'flex-start' };

  // Split heading on accentWord
  const headParts = accentWord
    ? heading.split(new RegExp(`(${accentWord})`, 'i'))
    : [heading];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...alignStyle, gap: 0 }}>
      {label && (
        <div style={{ ...slideIn(labelP), marginBottom: 10 }}>
          <span style={{
            fontFamily: 'sans-serif', fontSize: 13,
            letterSpacing: 5, textTransform: 'uppercase',
            color: GOLD, fontWeight: 600,
          }}>
            {label}
          </span>
        </div>
      )}

      {ruleP > 0.05 && (
        <div style={{ marginBottom: 14 }}>
          <GoldRule p={ruleP} width={align === 'center' ? 80 : 60} />
        </div>
      )}

      <div style={{ ...slideIn(headP), marginBottom: body || price ? 18 : 0 }}>
        <h2 style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 72, fontWeight: 700, lineHeight: 1.1,
          margin: 0, color: CREAM,
          letterSpacing: '-1px',
          textShadow: '0 3px 30px rgba(0,0,0,0.8)',
        }}>
          {headParts.map((part, i) =>
            accentWord && part.toLowerCase() === accentWord.toLowerCase()
              ? <span key={i} style={{ color: GOLD, textShadow: `0 0 30px ${GOLD}66` }}>{part}</span>
              : <span key={i}>{part}</span>
          )}
        </h2>
      </div>

      {body && (
        <div style={{ ...slideIn(bodyP), marginBottom: price ? 14 : 0 }}>
          <p style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: 24, lineHeight: 1.6, margin: 0,
            color: 'rgba(245,237,216,0.72)',
            maxWidth: 620,
          }}>
            {body}
          </p>
        </div>
      )}

      {price && (
        <div style={slideIn(priceP)}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: 28, fontWeight: 700,
            color: GOLD,
            textShadow: `0 0 20px ${GOLD}66`,
            letterSpacing: '-0.5px',
          }}>
            {price}
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Small info pill ──────────────────────────────────────────────────────────
const Pill: React.FC<{ frame: number; showAt: number; outAt: number; text: string }> = ({
  frame, showAt, outAt, text,
}) => {
  const p = presence(frame, showAt, showAt + 20, outAt, outAt + 15);
  return (
    <div style={{
      opacity: p,
      transform: `translateY(${lerp(12, 0, easeOutExpo(p))}px)`,
      display: 'inline-block',
      background: `rgba(201,168,92,0.12)`,
      border: `1px solid rgba(201,168,92,0.35)`,
      borderRadius: 40,
      padding: '8px 22px',
      fontFamily: 'sans-serif', fontSize: 16, fontWeight: 500,
      color: GOLDF, letterSpacing: 1,
    }}>
      {text}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const HotelRiviera: React.FC = () => {
  const frame = useCurrentFrame();

  // Global camera push-in (scale 1.00 → 1.05 over full video)
  const cam        = 1 + 0.05 * easeInOutCubic(clamp(prog(frame, 0, TOTAL)));
  // Particles move at half the camera speed (parallax)
  const particleCam = 1 + 0.025 * easeInOutCubic(clamp(prog(frame, 0, TOTAL)));

  // Whoosh blur on new-section text entry (brief radial blur each transition)
  const whoosh = (sectionStart: number) =>
    lerp(0, 1, easeOutExpo(clamp(prog(frame, sectionStart, sectionStart + 30))));

  // Final fade to black
  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 1630, 1650)));

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>

      {/* ── Layer 0: Section photos (Ken Burns + crossfade) ─────────────── */}
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: 'center center' }}>

        {/* LOCATION — ocean/fjord */}
        <Photo src="riviera/ocean.jpg"
          start={SS.LOCATION} end={SS.ROOMS}
          zoomFrom={1.08} zoomTo={1.16} panX={[0, 1.5]} panY={[0, -0.8]}
        />

        {/* ROOMS — exterior */}
        <Photo src="riviera/exterior.jpg"
          start={SS.ROOMS} end={SS.SPA}
          zoomFrom={1.10} zoomTo={1.20} panX={[-1, 1]} panY={[0, -1]}
        />

        {/* SPA — pool */}
        <Photo src="riviera/pool.jpg"
          start={SS.SPA} end={SS.DINING}
          zoomFrom={1.08} zoomTo={1.18} panX={[0, -1.5]} panY={[0, 1]}
          tint="#0A1F3A"
        />

        {/* DINING — restaurant */}
        <Photo src="riviera/restaurant.png"
          start={SS.DINING} end={SS.PACKAGES}
          zoomFrom={1.10} zoomTo={1.20} panX={[1, -1]} panY={[0, 0.5]}
          tint="#1A0A08"
        />

        {/* PACKAGES — suite */}
        <Photo src="riviera/suite.png"
          start={SS.PACKAGES} end={SS.EVENTS}
          zoomFrom={1.08} zoomTo={1.18} panX={[-0.5, 0.5]} panY={[1, 0]}
        />

        {/* EVENTS — lobby */}
        <Photo src="riviera/lobby.jpg"
          start={SS.EVENTS} end={SS.CTA}
          zoomFrom={1.10} zoomTo={1.18} panX={[0, 1]} panY={[0.5, 0]}
        />

        {/* CTA — exterior again, darker */}
        <Photo src="riviera/exterior.jpg"
          start={SS.CTA} end={TOTAL}
          zoomFrom={1.12} zoomTo={1.08} panX={[0, 0]} panY={[0, 0]}
          tintStrength={1.2}
        />
      </div>

      {/* ── Layer 1: Particles (parallax — slower than cam) ─────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${particleCam})`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
      }}>
        {DOTS.map((d, i) => {
          const px  = ((d.x + frame * d.vx * 100) % 100 + 100) % 100;
          const py  = ((d.y + frame * d.vy * 100) % 100 + 100) % 100;
          const pls = 0.4 + 0.6 * Math.sin(frame * 0.06 + d.ph);
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${px}%`, top: `${py}%`,
              width: d.r, height: d.r,
              borderRadius: '50%',
              backgroundColor: d.blue ? '#3B8AC4' : 'rgba(255,255,255,0.5)',
              opacity: d.op * pls,
              boxShadow: d.r > 0.7 && d.blue ? `0 0 ${d.r * 4}px #3B8AC466` : 'none',
            }} />
          );
        })}
      </div>

      {/* ── Layer 2: Content — all sections on one canvas ───────────────── */}

      {/* ═══ S1: INTRO (0–158) ══════════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        opacity: Math.min(
          easeOutExpo(clamp(prog(frame, 0, 20))),
          1 - easeInOutCubic(clamp(prog(frame, 132, 158)))
        ),
        pointerEvents: 'none',
      }}>
        {/* Glow behind logo */}
        <div style={{
          position: 'absolute',
          width: 700, height: 400,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${GOLD}14 0%, transparent 70%)`,
        }} />

        {/* Category label */}
        <div style={{
          opacity: easeOutExpo(clamp(prog(frame, 10, 30))),
          transform: `translateY(${lerp(14, 0, easeOutExpo(clamp(prog(frame, 10, 30))))}px)`,
          marginBottom: 16,
        }}>
          <span style={{
            fontFamily: 'sans-serif', fontSize: 13,
            letterSpacing: 7, textTransform: 'uppercase',
            color: GOLD, fontWeight: 500,
          }}>
            Moss · Norge · Oslofjorden
          </span>
        </div>

        {/* HOTEL */}
        <div style={{
          opacity: easeOutExpo(clamp(prog(frame, 18, 40))),
          transform: `translateY(${lerp(20, 0, easeOutExpo(clamp(prog(frame, 18, 40))))}px)`,
          filter: `blur(${lerp(5, 0, easeOutExpo(clamp(prog(frame, 18, 40))))}px)`,
        }}>
          <span style={{
            fontFamily: 'sans-serif', fontSize: 22,
            letterSpacing: 14, textTransform: 'uppercase',
            color: 'rgba(245,237,216,0.65)', fontWeight: 400,
          }}>
            Hotel
          </span>
        </div>

        {/* RIVIERA — large serif */}
        <div style={{
          opacity: easeOutBack(clamp(prog(frame, 28, 58))),
          transform: `scale(${lerp(0.88, 1, easeOutBack(clamp(prog(frame, 28, 58))))})`,
          marginBottom: 4,
        }}>
          <span style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 130, fontWeight: 700, lineHeight: 0.9,
            letterSpacing: '-3px',
            background: `linear-gradient(135deg, ${CREAM} 0%, ${GOLDF} 40%, ${CREAM} 70%, ${GOLD} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 24px rgba(201,168,92,0.3))',
          }}>
            Riviera
          </span>
        </div>

        {/* Gold rule */}
        <div style={{ margin: '20px 0 24px', opacity: easeOutExpo(clamp(prog(frame, 52, 76))) }}>
          <GoldRule p={easeOutExpo(clamp(prog(frame, 52, 76)))} width={120} />
        </div>

        {/* Tagline */}
        <div style={{
          opacity: presence(frame, 68, 90, 128, 150),
          transform: `translateY(${lerp(14, 0, easeOutExpo(clamp(prog(frame, 68, 90))))}px)`,
          filter: `blur(${lerp(5, 0, easeOutExpo(clamp(prog(frame, 68, 90))))}px)`,
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: 26, fontWeight: 400, fontStyle: 'italic',
            color: 'rgba(245,237,216,0.70)',
            letterSpacing: '0.5px',
          }}>
            "It's not just a place – it's a feeling"
          </span>
        </div>
      </AbsoluteFill>

      {/* ═══ S2: LOCATION (158–335) ════════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 120px 110px',
        filter: `blur(${lerp(6, 0, whoosh(SS.LOCATION))}px)`,
        pointerEvents: 'none',
      }}>
        <Block
          frame={frame}
          baseAt={SS.LOCATION + 20}
          outAt={SS.ROOMS - 30}
          label="Lokasjon"
          heading="Moss, Norge"
          body="50 minutter fra Oslo, rett ved Oslofjorden. Et lite paradis langs kysten — med utsikt, frisk sjøluft og en Riviera-følelse du ikke glemmer."
          accentWord="Moss"
        />
        <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
          {['50 min fra Oslo', 'Oslofjorden', 'Strandpromenaden'].map((t, i) => (
            <Pill key={i} frame={frame}
              showAt={SS.LOCATION + 58 + i * 16}
              outAt={SS.ROOMS - 28}
              text={t}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* ═══ S3: ROOMS (335–615) ══════════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 120px 110px',
        filter: `blur(${lerp(6, 0, whoosh(SS.ROOMS))}px)`,
        pointerEvents: 'none',
      }}>
        <Block
          frame={frame}
          baseAt={SS.ROOMS + 20}
          outAt={SS.SPA - 30}
          label="Rom & Suiter"
          heading="Utsikt du ikke glemmer"
          body="Fransk balkong med soloppgang, havluft og panoramautsikt over Oslofjorden. Velg mellom Classic City View, Superior Ocean View og Ocean Front Suite."
          accentWord="glemmer"
        />
        <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
          {['Fra 1 145 kr / natt', 'Ocean Front Suite', 'Balkong & fjordutsikt'].map((t, i) => (
            <Pill key={i} frame={frame}
              showAt={SS.ROOMS + 60 + i * 18}
              outAt={SS.SPA - 28}
              text={t}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* ═══ S4: SPA (615–825) ════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 120px 110px',
        filter: `blur(${lerp(6, 0, whoosh(SS.SPA))}px)`,
        pointerEvents: 'none',
      }}>
        <Block
          frame={frame}
          baseAt={SS.SPA + 20}
          outAt={SS.DINING - 30}
          label="Pool & Velvære"
          heading="Ro i toppetasjen"
          body="Svømmebasseng og spa med utsikt over fjorden. Spabehandlinger, sauna og lounge — alt du trenger for å lade opp. Tilgjengelig for alle hotellets gjester."
          accentWord="toppetasjen"
        />
        <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
          {['Rooftop pool', 'Spabehandlinger', 'Dagspa tilgjengelig'].map((t, i) => (
            <Pill key={i} frame={frame}
              showAt={SS.SPA + 60 + i * 18}
              outAt={SS.DINING - 28}
              text={t}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* ═══ S5: DINING (825–1040) ════════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 120px 110px',
        filter: `blur(${lerp(6, 0, whoosh(SS.DINING))}px)`,
        pointerEvents: 'none',
      }}>
        <Block
          frame={frame}
          baseAt={SS.DINING + 20}
          outAt={SS.PACKAGES - 30}
          label="Mat & Drikke"
          heading="Brasserie Bon Vivant"
          body="Vår signaturrestaurant med lunsj og middag inspirert av det franske kjøkken — servert med norske råvarer. Avslutt kvelden i Riviera Bar."
          accentWord="Bon Vivant"
          price="Riviera Bar · Lunsj · Middag"
        />
      </AbsoluteFill>

      {/* ═══ S6: PACKAGES (1040–1265) ═════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 120px 110px',
        filter: `blur(${lerp(6, 0, whoosh(SS.PACKAGES))}px)`,
        pointerEvents: 'none',
      }}>
        <Block
          frame={frame}
          baseAt={SS.PACKAGES + 20}
          outAt={SS.EVENTS - 30}
          label="Pakker & Tilbud"
          heading="Riviera Escape"
          body="Overnatting, tilgang til pool & spa, og en 3-retters middag på Brasserie Bon Vivant. Alt inkludert for et komplett Riviera-opphold."
          accentWord="Escape"
          price="Riviera Sundays fra 1 795 kr for 2"
        />
        <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
          {['30% Early Bird rabatt', 'Stay Longer Save More', 'Bubbles & Staycation'].map((t, i) => (
            <Pill key={i} frame={frame}
              showAt={SS.PACKAGES + 70 + i * 18}
              outAt={SS.EVENTS - 28}
              text={t}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* ═══ S7: EVENTS (1265–1450) ═══════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 120px 110px',
        filter: `blur(${lerp(6, 0, whoosh(SS.EVENTS))}px)`,
        pointerEvents: 'none',
      }}>
        <Block
          frame={frame}
          baseAt={SS.EVENTS + 20}
          outAt={SS.CTA - 30}
          label="Møter & Arrangementer"
          heading="Riviera Social Club"
          body="7 møterom med kapasitet opp til 180 gjester. Perfekt for kick-off, bedriftsfester, jubileer og team-events — med alt fra catering til AV-utstyr."
          accentWord="Social Club"
          price="Opptil 180 gjester · 7 møterom"
        />
      </AbsoluteFill>

      {/* ═══ S8: CTA (1450–1650) ══════════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        opacity: Math.min(
          easeOutExpo(clamp(prog(frame, SS.CTA, SS.CTA + 25))),
          1 - easeInOutCubic(clamp(prog(frame, 1630, 1650)))
        ),
        pointerEvents: 'none',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          width: 800, height: 450,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${GOLD}10 0%, transparent 65%)`,
        }} />

        {/* HOTEL label */}
        <div style={{
          opacity: easeOutExpo(clamp(prog(frame, SS.CTA + 10, SS.CTA + 32))),
          transform: `translateY(${lerp(14, 0, easeOutExpo(clamp(prog(frame, SS.CTA + 10, SS.CTA + 32))))}px)`,
          marginBottom: 10,
        }}>
          <span style={{
            fontFamily: 'sans-serif', fontSize: 14,
            letterSpacing: 10, textTransform: 'uppercase',
            color: 'rgba(245,237,216,0.55)', fontWeight: 400,
          }}>
            Hotel
          </span>
        </div>

        {/* RIVIERA */}
        <div style={{
          opacity: easeOutBack(clamp(prog(frame, SS.CTA + 20, SS.CTA + 48))),
          transform: `scale(${lerp(0.9, 1, easeOutBack(clamp(prog(frame, SS.CTA + 20, SS.CTA + 48))))})`,
          marginBottom: 28,
        }}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: 120, fontWeight: 700, lineHeight: 0.9,
            letterSpacing: '-3px',
            background: `linear-gradient(135deg, ${CREAM} 0%, ${GOLDF} 45%, ${CREAM} 70%, ${GOLD} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 24px rgba(201,168,92,0.35))',
          }}>
            Riviera
          </span>
        </div>

        {/* Gold rule */}
        <div style={{ marginBottom: 28, opacity: easeOutExpo(clamp(prog(frame, SS.CTA + 48, SS.CTA + 70))) }}>
          <GoldRule p={easeOutExpo(clamp(prog(frame, SS.CTA + 48, SS.CTA + 70)))} width={140} />
        </div>

        {/* Tagline */}
        <div style={{
          opacity: presence(frame, SS.CTA + 62, SS.CTA + 84, 1620, 1640),
          transform: `translateY(${lerp(12, 0, easeOutExpo(clamp(prog(frame, SS.CTA + 62, SS.CTA + 84))))}px)`,
          filter: `blur(${lerp(5, 0, easeOutExpo(clamp(prog(frame, SS.CTA + 62, SS.CTA + 84))))}px)`,
          marginBottom: 36,
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: 26, color: 'rgba(245,237,216,0.65)',
          }}>
            Feel vibrant. Be vibrant. Stay vibrant.
          </span>
        </div>

        {/* URL */}
        <div style={{
          opacity: presence(frame, SS.CTA + 88, SS.CTA + 108, 1620, 1640),
          transform: `translateY(${lerp(12, 0, easeOutExpo(clamp(prog(frame, SS.CTA + 88, SS.CTA + 108))))}px)`,
          marginBottom: 12,
        }}>
          <span style={{
            fontFamily: 'sans-serif', fontSize: 22,
            letterSpacing: 3, color: GOLDF,
            textShadow: `0 0 20px ${GOLD}66`,
          }}>
            hotelriviera.no
          </span>
        </div>

        {/* Phone */}
        <div style={{
          opacity: presence(frame, SS.CTA + 106, SS.CTA + 124, 1620, 1640),
          transform: `translateY(${lerp(10, 0, easeOutExpo(clamp(prog(frame, SS.CTA + 106, SS.CTA + 124))))}px)`,
        }}>
          <span style={{
            fontFamily: 'sans-serif', fontSize: 17,
            color: 'rgba(245,237,216,0.45)', letterSpacing: 1.5,
          }}>
            +47 69 70 17 00 · Bernt Ankers gate 2, Moss
          </span>
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
