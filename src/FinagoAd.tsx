import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeOutExpo, easeInOutCubic, clamp, prog } from './utils/easing';
import { springValue, springPresets } from './utils/spring';
import { KineticText } from './components/KineticText';
import { pickTextColor } from './utils/color';

const BG = '#0A0A0C';
const BLUE = '#2D7FF9';
const BLUE_LIGHT = '#6FA8FF';
const WHITE = '#FFFFFF';
const GRAY = '#8A8F98';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── Shared background: clean drifting grid + soft blue glow, no gold/particles ──
const FinagoBackground: React.FC<{ pulse?: number }> = ({ pulse = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(45,127,249,${0.08 + pulse * 0.06}) 0%, transparent 65%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        backgroundPosition: `${(frame * 0.15) % 64}px ${(frame * 0.1) % 64}px`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)',
      }} />
    </AbsoluteFill>
  );
};

// ── A small floating "system" card used in the chaos + merge scenes ──────
const SystemChip: React.FC<{ label: string; x: number; y: number; rotate: number; opacity: number; scale: number }> = ({
  label, x, y, rotate, opacity, scale,
}) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
    opacity,
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid rgba(255,255,255,0.14)`,
    borderRadius: 14,
    padding: '14px 22px',
    backdropFilter: 'blur(4px)',
  }}>
    <span style={{
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      fontSize: 26, fontWeight: 700, color: WHITE, letterSpacing: '-0.5px',
    }}>
      {label}
    </span>
  </div>
);

// ── Scene 1 (0-90, 3s): the hook ──────────────────────────────────────────
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = springValue(frame, fps, { ...springPresets.bouncy, delayFrames: 4 });
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 70, 88)));

  return (
    <AbsoluteFill>
      <FinagoBackground pulse={punch} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: fade }}>
        <div style={{
          transform: `scale(${0.7 + Math.min(punch, 1.15) * 0.3})`,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: 104, fontWeight: 800, color: WHITE, letterSpacing: '-3px', lineHeight: 1.0,
          }}>
            Tre systemer.
          </div>
          <div style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: 104, fontWeight: 800, color: BLUE_LIGHT, letterSpacing: '-3px', lineHeight: 1.0,
            textShadow: `0 0 40px ${BLUE}99`,
          }}>
            Ett kaos.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2 (0-180 local, 6s): chaos — disconnected systems ──────────────
const ChaosScene: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = easeOutExpo(clamp(prog(frame, 0, 20)));
  const drift = frame * 0.01;
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 150, 178)));

  const chips = [
    { label: 'Regnskap', bx: 480, by: 300, amp: 14 },
    { label: 'Lønn', bx: 1400, by: 260, amp: 18 },
    { label: 'Timeregistrering', bx: 1450, by: 760, amp: 12 },
    { label: 'Oppdragsstyring', bx: 470, by: 800, amp: 16 },
  ];

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <FinagoBackground />
      {chips.map((c, i) => (
        <SystemChip
          key={c.label}
          label={c.label}
          x={c.bx + Math.sin(drift + i * 1.7) * c.amp}
          y={c.by + Math.cos(drift * 1.3 + i * 2.1) * c.amp}
          rotate={Math.sin(drift + i) * 4}
          opacity={intro}
          scale={intro}
        />
      ))}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
        <KineticText
          text="Alt spredt. Ingenting snakker sammen."
          startFrame={40}
          stagger={2}
          mode="rise"
          color={WHITE}
          style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 52, fontWeight: 700, justifyContent: 'center', textAlign: 'center' }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 3 (0-180 local, 6s): merge into one system ──────────────────────
const MergeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const merge = springValue(frame, fps, { ...springPresets.gentle, delayFrames: 0 });
  const cardGlow = easeOutExpo(clamp(prog(frame, 30, 70)));
  const textIn = easeOutExpo(clamp(prog(frame, 70, 95)));
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 150, 178)));

  const targets = [
    { label: 'Regnskap', fromX: 480, fromY: 300 },
    { label: 'Lønn', fromX: 1400, fromY: 260 },
    { label: 'Timeregistrering', fromX: 1450, fromY: 760 },
    { label: 'Oppdragsstyring', fromX: 470, fromY: 800 },
  ];
  const centerX = 960, centerY = 480;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <FinagoBackground pulse={cardGlow} />

      {targets.map((t, i) => (
        <SystemChip
          key={t.label}
          label={t.label}
          x={lerp(t.fromX, centerX, clamp(merge))}
          y={lerp(t.fromY, centerY, clamp(merge))}
          rotate={lerp(Math.sin(i) * 4, 0, clamp(merge))}
          opacity={1 - clamp(merge) * 0.85}
          scale={lerp(1, 0.3, clamp(merge))}
        />
      ))}

      {/* Unified card forming */}
      <div style={{
        position: 'absolute', left: centerX, top: centerY,
        transform: `translate(-50%, -50%) scale(${0.3 + clamp(merge) * 0.85})`,
        opacity: clamp(merge),
        width: 460, padding: '32px 40px', borderRadius: 22,
        background: `linear-gradient(150deg, rgba(45,127,249,${0.18 + cardGlow * 0.12}), rgba(255,255,255,0.04))`,
        border: `1.5px solid rgba(111,168,255,${0.3 + cardGlow * 0.4})`,
        boxShadow: `0 0 ${40 + cardGlow * 60}px rgba(45,127,249,${cardGlow * 0.35})`,
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 900, color: WHITE, letterSpacing: '-0.5px' }}>
          Fin<span style={{ color: BLUE_LIGHT }}>ago</span>
        </div>
      </div>

      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 160 }}>
        <div style={{
          opacity: textIn,
          transform: `translateY(${lerp(20, 0, textIn)}px)`,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontSize: 56, fontWeight: 800, color: WHITE, textAlign: 'center', letterSpacing: '-1px',
        }}>
          Ett system for alle behov.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 4 (0-240 local, 8s): feature highlights, quick cuts ────────────
const FEATURES = [
  { name: 'Finago Office', desc: 'Regnskap med automatisk bilagsbehandling' },
  { name: 'Finago Payday', desc: 'Lønn med alltid oppdaterte satser' },
  { name: 'Timeregistrering', desc: 'Integrert rett mot lønn og regnskap' },
  { name: 'Oppdragsstyring', desc: 'Bygget for regnskapsbyråer' },
];

const FeatureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const perFeature = 60;

  return (
    <AbsoluteFill>
      <FinagoBackground />
      {FEATURES.map((f, i) => {
        const start = i * perFeature;
        const local = frame - start;
        if (local < -10 || local > perFeature + 10) return null;
        const inT = easeOutExpo(clamp(local / 18));
        const outT = 1 - easeInOutCubic(clamp((local - (perFeature - 16)) / 16));
        const a = inT * outT;
        return (
          <AbsoluteFill key={f.name} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ opacity: a, transform: `translateY(${lerp(24, 0, inT)}px) scale(${lerp(0.92, 1, inT)})`, textAlign: 'center' }}>
              <div style={{
                display: 'inline-block', padding: '6px 18px', borderRadius: 999,
                background: 'rgba(45,127,249,0.16)', border: `1px solid ${BLUE}66`,
                color: BLUE_LIGHT, fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontSize: 18, fontWeight: 700, letterSpacing: 2, marginBottom: 18,
              }}>
                {String(i + 1).padStart(2, '0')} / 04
              </div>
              <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 72, fontWeight: 800, color: WHITE, letterSpacing: '-2px' }}>
                {f.name}
              </div>
              <div style={{ marginTop: 14, fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 30, fontWeight: 400, color: GRAY }}>
                {f.desc}
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Scene 5 (0-180 local, 6s): testimonial ─────────────────────────────────
const TestimonialScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = springValue(frame, fps, { ...springPresets.gentle, delayFrames: 0 });
  const quoteIn = easeOutExpo(clamp(prog(frame, 25, 55)));
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 150, 178)));

  return (
    <AbsoluteFill style={{ opacity: fade, justifyContent: 'center', alignItems: 'center' }}>
      <FinagoBackground />
      <div style={{
        width: 1240, padding: '56px 64px', borderRadius: 24,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        opacity: clamp(cardIn), transform: `translateY(${lerp(30, 0, clamp(cardIn))}px)`,
      }}>
        <div style={{ fontSize: 64, color: BLUE_LIGHT, fontFamily: 'Georgia, serif', lineHeight: 0.5 }}>“</div>
        <div style={{
          opacity: quoteIn,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontSize: 38, fontWeight: 500, color: WHITE, lineHeight: 1.35,
        }}>
          Jeg kunne ikke kjøpt et hotell til hvis jeg ikke hadde hatt et system som deres,
          noe jeg faktisk kan stole på.
        </div>
        <div style={{ marginTop: 28, opacity: quoteIn, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})` }} />
          <div>
            <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 20, fontWeight: 700, color: WHITE }}>
              Morten Christensen
            </div>
            <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 16, color: GRAY }}>
              CEO, Unike Hoteller
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6 (0-150 local, 5s): value props ─────────────────────────────────
const VALUES = ['Tilpasset deg.', 'Ved din side.', 'Gode priser.'];

const ValuesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const perValue = 46;
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 130, 148)));

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <FinagoBackground />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 4 }}>
        {VALUES.map((v, i) => {
          const start = i * perValue;
          const local = frame - start;
          const t = easeOutExpo(clamp(local / 18));
          return (
            <div key={v} style={{
              opacity: t,
              transform: `translateX(${lerp(-40, 0, t)}px)`,
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              fontSize: 68, fontWeight: 800,
              color: i === 1 ? BLUE_LIGHT : WHITE,
              letterSpacing: '-1.5px',
            }}>
              {v}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 7 (0-180 local, 6s): CTA / wordmark ──────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markT = springValue(frame, fps, { ...springPresets.snappy, delayFrames: 0 });
  const urlT = easeOutExpo(clamp(prog(frame, 28, 50)));
  const tagT = easeOutExpo(clamp(prog(frame, 45, 68)));
  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 150, 178)));

  // contrast sanity-check: pick best label color against deep-blue chip background
  const chipBg = '#0F2C5C';
  const labelColor = pickTextColor(chipBg, [WHITE, BLUE_LIGHT]);

  return (
    <AbsoluteFill style={{ opacity: finalFade, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <FinagoBackground pulse={markT} />
      <div style={{
        opacity: clamp(markT),
        transform: `scale(${0.7 + Math.min(markT, 1.15) * 0.3})`,
        fontFamily: 'Georgia, serif', fontSize: 110, fontWeight: 900, color: WHITE, letterSpacing: '-1px',
      }}>
        Fin<span style={{ color: BLUE_LIGHT, textShadow: `0 0 40px ${BLUE}aa` }}>ago</span>
      </div>
      <div style={{
        opacity: tagT, marginTop: 18,
        fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 30, fontWeight: 500, color: GRAY,
      }}>
        Ett system for alle behov.
      </div>
      <div style={{
        opacity: urlT, marginTop: 34,
        padding: '12px 28px', borderRadius: 999,
        background: chipBg, border: `1px solid ${BLUE}88`,
      }}>
        <span style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 26, fontWeight: 700, color: labelColor, letterSpacing: 1 }}>
          finago.no
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Root: 40s @ 30fps = 1200 frames, 1920x1080 ─────────────────────────────
export const FinagoAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Sequence durationInFrames={90}><HookScene /></Sequence>
      <Sequence from={90} durationInFrames={180}><ChaosScene /></Sequence>
      <Sequence from={270} durationInFrames={180}><MergeScene /></Sequence>
      <Sequence from={450} durationInFrames={240}><FeatureScene /></Sequence>
      <Sequence from={690} durationInFrames={180}><TestimonialScene /></Sequence>
      <Sequence from={870} durationInFrames={150}><ValuesScene /></Sequence>
      <Sequence from={1020} durationInFrames={180}><CTAScene /></Sequence>
    </AbsoluteFill>
  );
};
