// Explainer-video rebuild: icon-driven storytelling + a simulated product
// dashboard (not just text cards), camera pans across UI panels, and a
// synced caption bar — the structure real SaaS explainer videos use.
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
const PANEL = 'rgba(255,255,255,0.05)';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── Line-icon set (24x24 viewBox) ─────────────────────────────────────────
const ICON_PATHS: Record<string, string> = {
  office: 'M5 3h14v18H5z M9 8h6 M9 12h6 M9 16h4',
  payday: 'M3 7h18v10H3z M3 12h18 M7 16h2',
  time: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3.5 3.5',
  tasks: 'M4 6h6v6H4z M14 6h6v3h-6z M14 13h6v3h-6z M4 16h6v3H4z',
};

const Icon: React.FC<{ name: keyof typeof ICON_PATHS; size?: number; color?: string; draw?: number }> = ({
  name, size = 28, color = WHITE, draw = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: 'visible' }}>
    <path
      d={ICON_PATHS[name]}
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }}
    />
  </svg>
);

const FEATURES: { key: keyof typeof ICON_PATHS; name: string; desc: string }[] = [
  { key: 'office', name: 'Finago Office', desc: 'Regnskap med automatisk bilagsbehandling' },
  { key: 'payday', name: 'Finago Payday', desc: 'Lønn med alltid oppdaterte satser' },
  { key: 'time', name: 'Timeregistrering', desc: 'Integrert rett mot lønn og regnskap' },
  { key: 'tasks', name: 'Oppdragsstyring', desc: 'Bygget for regnskapsbyråer' },
];

// Three different brand colors for the three "old" systems — they all
// converge to Finago blue once they merge into one product.
const SYS_COLORS: Record<string, string> = { office: '#3B82F6', payday: '#34D399', time: '#A78BFA' };
const SYS_LABELS: Record<string, string> = { office: 'Regnskapssystem', payday: 'Lønnssystem', time: 'Timeregistrering' };

// ── A literal floating app window — title bar + skeleton content — used to
// sell "three separate systems" before they collide into one product ──────
const AppWindow: React.FC<{
  x: number; y: number; rotate: number; scale?: number; opacity?: number;
  sys: 'office' | 'payday' | 'time'; colorMix?: number; // colorMix 0 = own color, 1 = Finago blue
}> = ({ x, y, rotate, scale = 1, opacity = 1, sys, colorMix = 0 }) => {
  const own = SYS_COLORS[sys];
  const mix = (a: string, b: string, t: number) => {
    const pa = a.match(/\w\w/g)!.map(h => parseInt(h, 16));
    const pb = b.match(/\w\w/g)!.map(h => parseInt(h, 16));
    return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], t))).join(',')})`;
  };
  const accent = mix(own.replace('#', '#'), BLUE, colorMix);

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${scale})`,
      opacity, width: 320, height: 210, borderRadius: 14, overflow: 'hidden',
      background: '#101115', border: `1px solid ${accent}55`,
      boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${accent}33`,
    }}>
      <div style={{ height: 30, display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
          <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.8 }} />
        ))}
        <div style={{ marginLeft: 8, fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 11, color: GRAY }}>
          {SYS_LABELS[sys]}
        </div>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={sys} size={18} color={accent} draw={1} />
        </div>
        {[0.9, 0.65, 0.8].map((w, i) => (
          <div key={i} style={{ height: 8, width: `${w * 100}%`, borderRadius: 4, background: 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
    </div>
  );
};

// ── Shared background ──────────────────────────────────────────────────
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

const LightsOut: React.FC<{ atFrame: number; holdFrames?: number }> = ({ atFrame, holdFrames = 6 }) => {
  const frame = useCurrentFrame();
  const into = 1 - clamp((frame - (atFrame - 6)) / 6);
  const out = 1 - easeOutExpo(clamp((frame - (atFrame + holdFrames)) / 14));
  const alpha = frame < atFrame ? into : out;
  return <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp(alpha), zIndex: 50, pointerEvents: 'none' }} />;
};

// ── Bottom caption bar, explainer-narration style ─────────────────────────
const CaptionBar: React.FC<{ text: string; visible: number }> = ({ text, visible }) => (
  <div style={{
    position: 'absolute', bottom: 64, left: '50%',
    transform: `translateX(-50%) translateY(${lerp(16, 0, visible)}px)`,
    opacity: visible,
    padding: '14px 28px', borderRadius: 12,
    background: 'rgba(10,10,12,0.7)', border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(6px)',
    fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 28, fontWeight: 600, color: WHITE,
    whiteSpace: 'nowrap', zIndex: 20,
  }}>
    {text}
  </div>
);

// ── Simulated product dashboard — a real-looking app window instead of
// abstract skeleton bars ───────────────────────────────────────────────
const DashboardMockup: React.FC<{
  scale?: number; opacity?: number; activeIndex: number; content: number; // content 0-1 reveal of the panel's data
}> = ({ scale = 1, opacity = 1, activeIndex, content }) => {
  const W = 900, H = 560;
  return (
    <div style={{
      width: W, height: H, transform: `scale(${scale})`, opacity,
      borderRadius: 16, overflow: 'hidden',
      background: '#0E0F13',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 30px 90px rgba(0,0,0,0.55), 0 0 60px rgba(45,127,249,0.15)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Title bar */}
      <div style={{ height: 38, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
        ))}
        <div style={{ flex: 1, textAlign: 'center', fontFamily: 'monospace', fontSize: 13, color: GRAY }}>app.finago.no</div>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        {/* Sidebar */}
        <div style={{ width: 84, borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, paddingTop: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={f.key} style={{
              width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i === activeIndex ? 'rgba(45,127,249,0.22)' : 'transparent',
              border: i === activeIndex ? `1px solid ${BLUE}88` : '1px solid transparent',
              transition: 'none',
            }}>
              <Icon name={f.key} size={22} color={i === activeIndex ? BLUE_LIGHT : GRAY} draw={1} />
            </div>
          ))}
        </div>

        {/* Main panel content, switches per active feature */}
        <div style={{ flex: 1, padding: 28, position: 'relative' }}>
          {activeIndex === 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: '100%' }}>
              {[0.4, 0.7, 0.5, 0.85, 0.6, 0.95].map((h, i) => (
                <div key={i} style={{
                  width: 48, borderRadius: '6px 6px 0 0',
                  height: `${h * 100 * clamp((content - i * 0.08) / 0.5)}%`,
                  background: `linear-gradient(180deg, ${BLUE_LIGHT}, ${BLUE})`,
                }} />
              ))}
            </div>
          )}
          {activeIndex === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1, 2, 3, 4].map(i => {
                const rowT = clamp((content - i * 0.18) / 0.4);
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, opacity: rowT, transform: `translateX(${lerp(-20, 0, rowT)}px)`, alignItems: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ height: 10, width: 220, borderRadius: 5, background: 'rgba(255,255,255,0.12)' }} />
                    <div style={{ marginLeft: 'auto', height: 10, width: 70, borderRadius: 5, background: `${BLUE}55` }} />
                  </div>
                );
              })}
            </div>
          )}
          {activeIndex === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, height: '100%' }}>
              {Array.from({ length: 28 }, (_, i) => {
                const t = clamp((content - (i % 7) * 0.1) / 0.5);
                const filled = (i * 13) % 4 !== 0;
                return (
                  <div key={i} style={{
                    borderRadius: 6, opacity: t,
                    background: filled ? `rgba(45,127,249,${0.15 + ((i * 7) % 5) * 0.1})` : 'rgba(255,255,255,0.04)',
                  }} />
                );
              })}
            </div>
          )}
          {activeIndex === 3 && (
            <div style={{ display: 'flex', gap: 16, height: '100%' }}>
              {[['Ny', 2], ['Pågår', 3], ['Levert', 2]].map(([label, count], colI) => (
                <div key={label as string} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 13, color: GRAY, fontFamily: '"Helvetica Neue", Arial, sans-serif', marginBottom: 4 }}>{label as string}</div>
                  {Array.from({ length: count as number }).map((_, i) => {
                    const idx = colI * 3 + i;
                    const t = clamp((content - idx * 0.1) / 0.4);
                    return (
                      <div key={i} style={{
                        opacity: t, transform: `translateY(${lerp(10, 0, t)}px)`,
                        height: 50, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      }} />
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Scene 1 (0-90, 3s): hook — three real app windows scattered and
// jittering chaotically, each its own color, selling "three separate
// systems" before a word-collision snaps the title onscreen ──────────────
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word1 = springValue(frame, fps, { ...springPresets.bouncy, delayFrames: 30 });
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 72, 89)));
  const winShow = easeOutExpo(clamp(prog(frame, 0, 18)));

  const windows = [
    { sys: 'office' as const, baseX: 540, baseY: 360, baseR: -12 },
    { sys: 'payday' as const, baseX: 1420, baseY: 340, baseR: 8 },
    { sys: 'time' as const, baseX: 660, baseY: 800, baseR: 14 },
  ];

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <FinagoBackground pulse={word1} />
      <LightsOut atFrame={0} holdFrames={2} />

      {windows.map((w, i) => {
        const jitterX = Math.sin(frame * 0.18 + i * 2) * 6;
        const jitterY = Math.cos(frame * 0.14 + i * 3) * 6;
        const jitterR = Math.sin(frame * 0.1 + i) * 2;
        return (
          <AppWindow
            key={w.sys}
            sys={w.sys}
            x={w.baseX + jitterX}
            y={w.baseY + jitterY}
            rotate={w.baseR + jitterR}
            scale={winShow}
            opacity={winShow}
          />
        );
      })}

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          opacity: clamp(word1), transform: `scale(${0.7 + Math.min(word1, 1.15) * 0.3})`,
          fontFamily: '"Helvetica Neue", Arial, sans-serif', textAlign: 'center',
          fontSize: 92, fontWeight: 800, color: WHITE, letterSpacing: '-3px', lineHeight: 1.05,
          textShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}>
          3 systemer.<br /><span style={{ color: BLUE_LIGHT, textShadow: `0 0 40px ${BLUE}99` }}>0 oversikt.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2 (0-220, ~7.3s): the three windows fly together, collide,
// shed their separate colors, and resolve into the one real Finago
// dashboard — the literal "scattered systems become one" beat ───────────
const MergeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revealFrame = 130;
  const converge = springValue(frame, fps, { ...springPresets.gentle, delayFrames: 10 });
  const colorMix = easeInOutCubic(clamp(prog(frame, 60, 110)));
  const camPush = lerp(1, 1.05, easeOutExpo(clamp(prog(frame, 110, 135))));
  const dashIn = springValue(frame, fps, { ...springPresets.gentle, delayFrames: revealFrame });
  const captionT = easeOutExpo(clamp(prog(frame, revealFrame + 18, revealFrame + 44)));
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 190, 218)));

  const starts = [
    { sys: 'office' as const, x: 540, y: 360, r0: -12 },
    { sys: 'payday' as const, x: 1420, y: 340, r0: 8 },
    { sys: 'time' as const, x: 660, y: 800, r0: 14 },
  ];
  const centerX = 960, centerY = 540;
  const heroVisible = frame >= revealFrame;
  const shrink = clamp(prog(frame, 95, 128));

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <FinagoBackground pulse={dashIn} camPush={camPush} />
      <LightsOut atFrame={revealFrame} holdFrames={4} />

      {!heroVisible && starts.map((s) => (
        <AppWindow
          key={s.sys}
          sys={s.sys}
          x={lerp(s.x, centerX, clamp(converge))}
          y={lerp(s.y, centerY, clamp(converge))}
          rotate={lerp(s.r0, 0, clamp(converge))}
          scale={1 - shrink * 0.55}
          opacity={1 - shrink * 0.4}
          colorMix={colorMix}
        />
      ))}

      {heroVisible && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ transform: `translateY(${lerp(20, 0, clamp(dashIn))}px)` }}>
            <DashboardMockup scale={0.55 + clamp(dashIn) * 0.15} opacity={clamp(dashIn)} activeIndex={0} content={clamp(dashIn) * 1.4} />
          </div>
        </AbsoluteFill>
      )}

      <CaptionBar text="Ett system. Alt på ett sted." visible={captionT} />
    </AbsoluteFill>
  );
};

// ── Scene 4 (0-320, ~10.7s): camera "tour" across the dashboard, switching
// active panel per feature with a synced caption ─────────────────────────
const FeatureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const perFeature = 100;

  return (
    <AbsoluteFill>
      <FinagoBackground />
      {FEATURES.map((f, i) => {
        const start = i * perFeature;
        const local = frame - start;
        if (local < -10 || local > perFeature + 10) return null;
        const inT = easeOutExpo(clamp(local / 16));
        const outT = 1 - easeInOutCubic(clamp((local - (perFeature - 16)) / 16));
        const a = inT * outT;
        const content = clamp(local / 50);
        const camPush = lerp(1.06, 1, inT);
        // alternate pan direction per feature so the "camera" feels like
        // it's touring across the dashboard rather than sitting still
        const panDir = i % 2 === 0 ? 1 : -1;
        const panX = lerp(panDir * 34, 0, inT);
        return (
          <AbsoluteFill key={f.key} style={{ transform: `scale(${camPush}) translateX(${panX}px)`, opacity: a }}>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
              <DashboardMockup scale={0.78} opacity={1} activeIndex={i} content={content} />
              <div style={{
                position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)',
                display: 'inline-block', padding: '6px 18px', borderRadius: 999,
                background: 'rgba(45,127,249,0.16)', border: `1px solid ${BLUE}66`,
                color: BLUE_LIGHT, fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontSize: 16, fontWeight: 700, letterSpacing: 2,
              }}>
                {String(i + 1).padStart(2, '0')} / 04 — {f.name.toUpperCase()}
              </div>
            </AbsoluteFill>
            <CaptionBar text={f.desc} visible={easeOutExpo(clamp((local - 10) / 16))} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Scene 5 (0-180, 6s): testimonial ──────────────────────────────────────
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
        background: PANEL, border: '1px solid rgba(255,255,255,0.1)',
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
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Helvetica Neue", Arial, sans-serif', fontWeight: 800, fontSize: 16, color: '#06121F',
          }}>
            MC
          </div>
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

// ── Scene 6 (0-150, 5s): value props with checkmark beats ─────────────────
const VALUES = ['Tilpasset deg.', 'Ved din side.', 'Gode priser.'];

const ValuesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const perValue = 46;
  const fade = 1 - easeInOutCubic(clamp(prog(frame, 130, 148)));

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <FinagoBackground />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 18 }}>
        {VALUES.map((v, i) => {
          const start = i * perValue;
          const local = frame - start;
          const t = easeOutExpo(clamp(local / 18));
          return (
            <div key={v} style={{
              opacity: t,
              transform: `translateX(${lerp(-40, 0, t)}px)`,
              display: 'flex', alignItems: 'center', gap: 18,
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              fontSize: 64, fontWeight: 800,
              color: i === 1 ? BLUE_LIGHT : WHITE,
              letterSpacing: '-1.5px',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke={BLUE_LIGHT} strokeWidth="2" />
                <path d="M7 12.5l3 3 7-7" fill="none" stroke={BLUE_LIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - t }} />
              </svg>
              {v}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 7 (0-180, 6s): CTA ───────────────────────────────────────────────
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
      <Sequence from={90} durationInFrames={220}><MergeScene /></Sequence>
      <Sequence from={310} durationInFrames={410}><FeatureScene /></Sequence>
      <Sequence from={720} durationInFrames={150}><TestimonialScene /></Sequence>
      <Sequence from={870} durationInFrames={140}><ValuesScene /></Sequence>
      <Sequence from={1010} durationInFrames={190}><CTAScene /></Sequence>
    </AbsoluteFill>
  );
};
