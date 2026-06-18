// Motion-design reference: modern SaaS launch-teaser conventions (Raycast/Framer/
// Linear-style kinetic type colliding with UI, Stripe-style skeleton loading,
// "lights-out" hero reveals, CTA framed as a premium product feature).
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { easeOutExpo, easeInOutCubic, clamp, prog } from './utils/easing';
import { springValue, springPresets } from './utils/spring';
import { pickTextColor } from './utils/color';

const BG = '#0A0A0C';
const BLUE = '#2D7FF9';
const BLUE_LIGHT = '#6FA8FF';
const WHITE = '#FFFFFF';
const GRAY = '#8A8F98';
const SKELETON = 'rgba(255,255,255,0.09)';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── Shared background: clean drifting grid + soft blue glow ──────────────
const FinagoBackground: React.FC<{ pulse?: number; camPush?: number }> = ({ pulse = 0, camPush = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden', transform: `scale(${camPush})` }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(45,127,249,${0.08 + pulse * 0.08}) 0%, transparent 65%)`,
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

// ── Lights-out flash: background snaps to black right before a hero reveal,
// then lifts — dilates attention the way Linear/Framer hero cuts do ────────
const LightsOut: React.FC<{ atFrame: number; holdFrames?: number }> = ({ atFrame, holdFrames = 6 }) => {
  const frame = useCurrentFrame();
  const into = 1 - clamp((frame - (atFrame - 6)) / 6);
  const out = 1 - easeOutExpo(clamp((frame - (atFrame + holdFrames)) / 14));
  const alpha = frame < atFrame ? into : out;
  return <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp(alpha), zIndex: 50, pointerEvents: 'none' }} />;
};

// ── Skeleton-loading card that "resolves" into real labeled content ──────
const SkeletonCard: React.FC<{
  x: number; y: number; rotate?: number; opacity: number; scale: number;
  label: string; resolved: number; // 0 = pure skeleton bars, 1 = fully resolved label
}> = ({ x, y, rotate = 0, opacity, scale, label, resolved }) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
    opacity,
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid rgba(255,255,255,${0.14 + resolved * 0.1})`,
    borderRadius: 14,
    padding: '16px 22px',
    width: 220,
  }}>
    <div style={{ position: 'relative', height: 26 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 6, background: SKELETON,
        opacity: 1 - resolved,
      }} />
      <span style={{
        position: 'absolute', inset: 0,
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        fontSize: 22, fontWeight: 700, color: WHITE, letterSpacing: '-0.4px',
        opacity: resolved, whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
    <div style={{ marginTop: 10, height: 8, width: '70%', borderRadius: 4, background: SKELETON, opacity: 1 - resolved * 0.6 }} />
  </div>
);

// ── Scene 1 (0-90, 3s): abstract kinetic-type hook in a void, collision
// reveal of the first UI fragment — no software screen until impact ──────
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word1 = springValue(frame, fps, { ...springPresets.bouncy, delayFrames: 2 });
  const word2 = springValue(frame, fps, { ...springPresets.bouncy, delayFrames: 14 });
  // word2's impact "pushes" a UI fragment into frame on collision
  const impactFrame = 14 + 10;
  const panelPush = easeOutExpo(clamp((frame - impactFrame) / 16));
  const shake = frame > impactFrame && frame < impactFrame + 8
    ? Math.sin((frame - impactFrame) * 3) * (1 - (frame - impactFrame) / 8) * 6
    : 0;
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 72, 89)));

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <FinagoBackground pulse={Math.max(word1, word2)} />
      <LightsOut atFrame={0} holdFrames={2} />

      {/* Collision-pushed UI fragment, shoved in from the right on word2 impact */}
      <SkeletonCard
        x={lerp(2100, 1480, clamp(panelPush)) + shake}
        y={560}
        rotate={lerp(8, -3, clamp(panelPush))}
        opacity={panelPush}
        scale={lerp(0.85, 1, clamp(panelPush))}
        label="Lønn"
        resolved={0.15}
      />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', transform: `translateX(${shake}px)` }}>
          <div style={{
            opacity: clamp(word1), transform: `scale(${0.7 + Math.min(word1, 1.15) * 0.3})`,
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: 104, fontWeight: 800, color: WHITE, letterSpacing: '-3px', lineHeight: 1.0,
          }}>
            Tre systemer.
          </div>
          <div style={{
            opacity: clamp(word2), transform: `scale(${0.7 + Math.min(word2, 1.15) * 0.3})`,
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

// ── Scene 2 (0-180 local, 6s): skeleton-loading chaos — disconnected,
// unresolved systems drifting, none of them fully "loaded" ───────────────
const ChaosScene: React.FC = () => {
  const frame = useCurrentFrame();
  const camPush = lerp(1.08, 1, easeOutExpo(clamp(frame / 20))); // zoom-through settle
  const intro = easeOutExpo(clamp(prog(frame, 0, 20)));
  const drift = frame * 0.01;
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 150, 178)));

  const chips = [
    { label: 'Regnskap', bx: 480, by: 300, amp: 14, blur: 0 },
    { label: 'Lønn', bx: 1400, by: 260, amp: 18, blur: 3 },
    { label: 'Timeregistrering', bx: 1450, by: 760, amp: 12, blur: 4 },
    { label: 'Oppdragsstyring', bx: 470, by: 800, amp: 16, blur: 3 },
  ];

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <FinagoBackground camPush={camPush} />
      {chips.map((c, i) => (
        <div key={c.label} style={{ filter: `blur(${c.blur}px)` }}>
          <SkeletonCard
            x={c.bx + Math.sin(drift + i * 1.7) * c.amp}
            y={c.by + Math.cos(drift * 1.3 + i * 2.1) * c.amp}
            rotate={Math.sin(drift + i) * 4}
            opacity={intro}
            scale={intro}
            label={c.label}
            resolved={0.35}
          />
        </div>
      ))}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
        <div style={{
          opacity: easeOutExpo(clamp(prog(frame, 50, 75))),
          fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 52, fontWeight: 700, color: WHITE, textAlign: 'center',
        }}>
          Alt spredt. Ingenting snakker sammen.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 3 (0-180 local, 6s): zoom-through merge — panels resolve from
// skeleton to real content as they collide into one hero card; lights-out
// flash right before the fully-loaded reveal ──────────────────────────────
const MergeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const merge = springValue(frame, fps, { ...springPresets.gentle, delayFrames: 0 });
  const revealFrame = 78;
  const cardGlow = easeOutExpo(clamp(prog(frame, revealFrame, revealFrame + 30)));
  const textIn = easeOutExpo(clamp(prog(frame, revealFrame + 14, revealFrame + 38)));
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 150, 178)));
  const camPush = lerp(1, 1.04, easeOutExpo(clamp(prog(frame, 60, 85))));

  const targets = [
    { label: 'Regnskap', fromX: 480, fromY: 300 },
    { label: 'Lønn', fromX: 1400, fromY: 260 },
    { label: 'Timeregistrering', fromX: 1450, fromY: 760 },
    { label: 'Oppdragsstyring', fromX: 470, fromY: 800 },
  ];
  const centerX = 960, centerY = 480;
  const heroVisible = clamp((frame - revealFrame) / 1) > 0;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <FinagoBackground pulse={cardGlow} camPush={camPush} />
      <LightsOut atFrame={revealFrame} holdFrames={4} />

      {targets.map((t, i) => (
        <SkeletonCard
          key={t.label}
          x={lerp(t.fromX, centerX, clamp(merge))}
          y={lerp(t.fromY, centerY, clamp(merge))}
          rotate={lerp(Math.sin(i) * 4, 0, clamp(merge))}
          opacity={(1 - clamp(merge) * 0.85) * (heroVisible ? 0 : 1)}
          scale={lerp(1, 0.3, clamp(merge))}
          label={t.label}
          resolved={0.3}
        />
      ))}

      {/* Fully-resolved hero card — only appears after the lights-out flash */}
      {heroVisible && (
        <div style={{
          position: 'absolute', left: centerX, top: centerY,
          transform: `translate(-50%, -50%) scale(${0.85 + cardGlow * 0.15})`,
          opacity: cardGlow,
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
      )}

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

// ── Scene 4 (0-240 local, 8s): feature highlights — each feature's name
// collides in and physically pushes its own mini UI panel onto screen,
// zoom-through cut between each one (no menu navigation ever shown) ───────
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
        const camPush = lerp(1.05, 1, easeOutExpo(clamp(local / 16))); // zoom-through entrance
        const inT = easeOutExpo(clamp(local / 18));
        const outT = 1 - easeInOutCubic(clamp((local - (perFeature - 16)) / 16));
        const a = inT * outT;
        const panelPush = easeOutExpo(clamp((local - 6) / 16));
        return (
          <AbsoluteFill key={f.name} style={{ transform: `scale(${camPush})` }}>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
              {/* Mini UI panel, physically pushed onscreen by the headline below */}
              <div style={{
                position: 'absolute', top: 270,
                opacity: panelPush * a,
                transform: `translateY(${lerp(40, 0, clamp(panelPush))}px)`,
              }}>
                <SkeletonCard x={0} y={0} opacity={1} scale={1} label={f.name} resolved={0.6} />
              </div>

              <div style={{ opacity: a, transform: `translateY(${lerp(24, 0, inT) + 90}px) scale(${lerp(0.92, 1, inT)})`, textAlign: 'center' }}>
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
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Scene 5 (0-180 local, 6s): testimonial, secondary background blurred
// to keep focus on the quote (Linear-style depth-of-field) ───────────────
const TestimonialScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = springValue(frame, fps, { ...springPresets.gentle, delayFrames: 0 });
  const quoteIn = easeOutExpo(clamp(prog(frame, 25, 55)));
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 150, 178)));
  const camPush = lerp(1.06, 1, easeOutExpo(clamp(frame / 22)));

  return (
    <AbsoluteFill style={{ opacity: fade, justifyContent: 'center', alignItems: 'center' }}>
      <FinagoBackground camPush={camPush} />
      <div style={{
        width: 1240, padding: '56px 64px', borderRadius: 24,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        opacity: clamp(cardIn), transform: `translateY(${lerp(30, 0, clamp(cardIn))}px)`,
      }}>
        <div style={{ fontSize: 64, color: BLUE_LIGHT, fontFamily: 'Georgia, serif', lineHeight: 0.5 }}>"</div>
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

// ── Scene 6 (0-150 local, 5s): value props — pure kinetic type in the void,
// words push each other into position on entry (collision feel) ──────────
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
          // each new line nudges the previous ones up slightly on its impact, like a stack being pushed
          const pushFromBelow = i < VALUES.length - 1 ? easeOutExpo(clamp((frame - (start + perValue)) / 14)) * 4 : 0;
          return (
            <div key={v} style={{
              opacity: t,
              transform: `translateX(${lerp(-40, 0, t)}px) translateY(${-pushFromBelow}px)`,
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

// ── Scene 7 (0-180 local, 6s): CTA framed as a premium terminal command,
// not an afterthought button ──────────────────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const markT = springValue(frame, fps, { ...springPresets.snappy, delayFrames: 0 });
  const termT = easeOutExpo(clamp(prog(frame, 28, 50)));
  const tagT = easeOutExpo(clamp(prog(frame, 45, 68)));
  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, 150, 178)));
  const cursorBlink = Math.floor(frame / 12) % 2 === 0;

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

      {/* Terminal-style CTA — the URL presented as a product feature, not a button */}
      <div style={{
        opacity: termT, marginTop: 36,
        transform: `translateY(${lerp(16, 0, termT)}px)`,
        padding: '16px 30px', borderRadius: 12,
        background: chipBg, border: `1px solid ${BLUE}88`,
        boxShadow: `0 0 ${30 + clamp(markT) * 20}px rgba(45,127,249,0.25)`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: BLUE_LIGHT, boxShadow: `0 0 8px ${BLUE_LIGHT}` }} />
        <span style={{
          fontFamily: '"SF Mono", "Courier New", monospace', fontSize: 26, fontWeight: 700,
          color: labelColor, letterSpacing: 0.5,
        }}>
          finago.no{cursorBlink ? '▌' : ' '}
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
