import gsap from 'gsap';
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { DynamicBackground } from './components/DynamicBackground';
import { theme } from './theme';
import { useGsapTimeline } from './utils/useGsapTimeline';

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

const Chars: React.FC<{
  text: string;
  className: string;
  style?: React.CSSProperties;
}> = ({ text, className, style }) => (
  <>
    {text.split('').map((c, i) => (
      <span
        key={i}
        className={className}
        style={{ display: 'inline-block', whiteSpace: 'pre', ...style }}
      >
        {c}
      </span>
    ))}
  </>
);

const SceneTag: React.FC<{ label: string }> = ({ label }) => (
  <div
    className="scene-tag"
    style={{
      position: 'absolute',
      top: 60,
      left: 80,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      fontFamily: theme.font,
      fontSize: 26,
      letterSpacing: 6,
      color: theme.gold,
      fontWeight: 600,
    }}
  >
    <div style={{ width: 40, height: 2, background: theme.gold }} />
    {label}
  </div>
);

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: theme.font,
    }}
  >
    {children}
  </AbsoluteFill>
);

const tagIn = (tl: gsap.core.Timeline) =>
  tl.from('.scene-tag', { x: -40, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.1);

// ---------------------------------------------------------------------------
// Scene 1 — intro title (5s)
// ---------------------------------------------------------------------------

const IntroScene: React.FC = () => {
  const scope = useGsapTimeline<HTMLDivElement>(() => {
    const tl = gsap.timeline();
    tl.from('.intro-char', {
      y: 140,
      opacity: 0,
      rotateX: -90,
      stagger: 0.05,
      duration: 1.1,
      ease: 'elastic.out(1, 0.55)',
    })
      .from('.intro-line', { scaleX: 0, duration: 0.8, ease: 'expo.out' }, '-=0.7')
      .from('.intro-sub', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .to('.intro-wrap', { opacity: 0, scale: 1.08, duration: 0.5, ease: 'power2.in' }, 4.4);
    return tl;
  });

  return (
    <AbsoluteFill ref={scope}>
      <Center>
        <div
          className="intro-wrap"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}
        >
          <h1
            style={{
              fontSize: 150,
              fontWeight: 800,
              color: theme.white,
              letterSpacing: 8,
              margin: 0,
              perspective: 600,
            }}
          >
            <Chars text="MOTION" className="intro-char" />
            <span style={{ display: 'inline-block', width: 40 }} />
            <Chars
              text="SHOWCASE"
              className="intro-char"
              style={{ color: theme.gold, textShadow: `0 0 40px ${theme.gold}66` }}
            />
          </h1>
          <div
            className="intro-line"
            style={{
              width: 620,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${theme.gold}, transparent)`,
              boxShadow: `0 0 18px ${theme.gold}`,
            }}
          />
          <div
            className="intro-sub"
            style={{ fontSize: 34, letterSpacing: 14, color: theme.gray, fontWeight: 300 }}
          >
            GSAP &times; REMOTION
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — kinetic typography (7s)
// ---------------------------------------------------------------------------

const WORDS = ['PRESISJON', 'KRAFT', 'FLYT', 'DETALJER'];

const TypographyScene: React.FC = () => {
  const scope = useGsapTimeline<HTMLDivElement>(() => {
    const tl = gsap.timeline();
    tagIn(tl);

    WORDS.forEach((_, i) => {
      const at = 0.5 + i * 1.5;
      const sel = `.word-${i}`;
      if (i === 0) {
        tl.fromTo(
          `${sel} .word-char`,
          { y: 110, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.55, ease: 'back.out(2)' },
          at
        );
      } else if (i === 1) {
        tl.fromTo(
          sel,
          { scale: 4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'power4.out' },
          at
        );
      } else if (i === 2) {
        tl.fromTo(
          sel,
          { x: -500, skewX: 30, opacity: 0 },
          { x: 0, skewX: 0, opacity: 1, duration: 0.55, ease: 'expo.out' },
          at
        );
      } else {
        tl.fromTo(
          sel,
          { filter: 'blur(30px)', scale: 1.3, opacity: 0 },
          { filter: 'blur(0px)', scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
          at
        );
      }
      if (i < WORDS.length - 1) {
        tl.to(sel, { y: -80, opacity: 0, duration: 0.35, ease: 'power2.in' }, at + 1.1);
      }
    });

    tl.to('.typo-wrap', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 6.4);
    return tl;
  });

  return (
    <AbsoluteFill ref={scope}>
      <SceneTag label="01 / TYPOGRAFI" />
      <Center>
        <div className="typo-wrap" style={{ position: 'relative', width: '100%', height: 240 }}>
          {WORDS.map((word, i) => (
            <div
              key={word}
              className={`word-${i}`}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 170,
                fontWeight: 800,
                letterSpacing: 12,
                color: i % 2 === 0 ? theme.white : theme.gold,
                textShadow: i % 2 === 0 ? 'none' : `0 0 50px ${theme.gold}55`,
                opacity: i === 0 ? 1 : 0,
              }}
            >
              {i === 0 ? <Chars text={word} className="word-char" /> : word}
            </div>
          ))}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — easing lab (8s)
// ---------------------------------------------------------------------------

const EASES: { label: string; ease: string }[] = [
  { label: 'power2.inOut', ease: 'power2.inOut' },
  { label: 'expo.out', ease: 'expo.out' },
  { label: 'back.inOut(1.7)', ease: 'back.inOut(1.7)' },
  { label: 'elastic.out(1, 0.4)', ease: 'elastic.out(1, 0.4)' },
  { label: 'bounce.out', ease: 'bounce.out' },
];

const TRACK_W = 1300;
const BALL = 46;

const EasingScene: React.FC = () => {
  const scope = useGsapTimeline<HTMLDivElement>(() => {
    const tl = gsap.timeline();
    tagIn(tl);
    tl.from('.ease-row', { y: 50, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' }, 0.2);

    gsap.utils.toArray<HTMLElement>('.ease-ball').forEach((ball, i) => {
      const { ease } = EASES[i];
      tl.to(ball, { x: TRACK_W - BALL, duration: 2.2, ease }, 1.2);
      tl.to(ball, { x: 0, duration: 2.2, ease }, 4.4);
    });

    tl.to('.ease-wrap', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 7.4);
    return tl;
  });

  return (
    <AbsoluteFill ref={scope}>
      <SceneTag label="02 / EASING" />
      <Center>
        <div className="ease-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
          {EASES.map(({ label }) => (
            <div key={label} className="ease-row" style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <div
                style={{
                  width: 420,
                  textAlign: 'right',
                  fontSize: 30,
                  color: theme.gray,
                  fontFamily: 'monospace',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  position: 'relative',
                  width: TRACK_W,
                  height: BALL,
                  borderRadius: BALL / 2,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,175,55,0.2)',
                }}
              >
                <div
                  className="ease-ball"
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: 3,
                    width: BALL - 6,
                    height: BALL - 6,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 35%, ${theme.goldLight}, ${theme.gold})`,
                    boxShadow: `0 0 24px ${theme.gold}aa`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — geometry & orbits (7s)
// ---------------------------------------------------------------------------

const RINGS = [120, 190, 260];

const GeometryScene: React.FC = () => {
  const scope = useGsapTimeline<HTMLDivElement>(() => {
    const tl = gsap.timeline();
    tagIn(tl);
    tl.to('.geo-ring', { strokeDashoffset: 0, duration: 1.6, ease: 'power3.inOut', stagger: 0.25 }, 0.3)
      .from(
        '.geo-core',
        { scale: 0, rotation: -180, duration: 1, ease: 'back.out(2)', transformOrigin: '50% 50%' },
        1.0
      )
      .to('.geo-core', { rotation: 165, duration: 5, ease: 'sine.inOut' }, 2.0)
      .to('.orbit-a', { rotation: 400, duration: 6.2, ease: 'none' }, 0.8)
      .to('.orbit-b', { rotation: -320, duration: 6.2, ease: 'none' }, 0.8)
      .from('.geo-caption', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' }, 1.6)
      .to('.geo-wrap', { opacity: 0, scale: 1.06, duration: 0.5, ease: 'power2.in' }, 6.4);
    return tl;
  });

  return (
    <AbsoluteFill ref={scope}>
      <SceneTag label="03 / GEOMETRI" />
      <Center>
        <div
          className="geo-wrap"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}
        >
          <div style={{ position: 'relative', width: 640, height: 640 }}>
            <svg width={640} height={640} viewBox="0 0 640 640" style={{ position: 'absolute', inset: 0 }}>
              {RINGS.map((r, i) => {
                const c = 2 * Math.PI * r;
                return (
                  <circle
                    key={r}
                    className="geo-ring"
                    cx={320}
                    cy={320}
                    r={r}
                    fill="none"
                    stroke={i === 1 ? theme.goldLight : theme.gold}
                    strokeWidth={i === 2 ? 1.5 : 2.5}
                    strokeOpacity={0.35 + (2 - i) * 0.25}
                    strokeDasharray={c}
                    strokeDashoffset={c}
                    strokeLinecap="round"
                    transform={`rotate(${-90 + i * 45} 320 320)`}
                  />
                );
              })}
              <rect
                className="geo-core"
                x={280}
                y={280}
                width={80}
                height={80}
                rx={14}
                fill="none"
                stroke={theme.goldLight}
                strokeWidth={3}
                style={{ filter: `drop-shadow(0 0 16px ${theme.gold})` }}
              />
            </svg>
            {/* Orbiting dots (HTML layers rotated by GSAP) */}
            <div className="orbit-a" style={{ position: 'absolute', inset: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 320 - 9,
                  top: 320 - 190 - 9,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: theme.goldLight,
                  boxShadow: `0 0 20px ${theme.gold}`,
                }}
              />
            </div>
            <div className="orbit-b" style={{ position: 'absolute', inset: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 320 - 7,
                  top: 320 + 260 - 7,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: theme.white,
                  boxShadow: `0 0 16px ${theme.white}aa`,
                }}
              />
            </div>
          </div>
          <div
            className="geo-caption"
            style={{ fontSize: 30, letterSpacing: 10, color: theme.gray, fontWeight: 300 }}
          >
            SVG-TEGNING &middot; ORBITER &middot; TRANSFORMASJONER
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5 — animated stats (7s)
// ---------------------------------------------------------------------------

const STATS = [
  { target: 30, suffix: ' FPS', label: 'BILDEFREKVENS' },
  { target: 1170, suffix: '', label: 'FRAMES TOTALT' },
  { target: 100, suffix: ' %', label: 'BYGGET I KODE' },
];

const StatsScene: React.FC = () => {
  const scope = useGsapTimeline<HTMLDivElement>(() => {
    const tl = gsap.timeline();
    tagIn(tl);
    tl.from('.stat-card', { y: 80, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out' }, 0.2);

    gsap.utils.toArray<HTMLElement>('.stat-num').forEach((el, i) => {
      const target = Number(el.dataset.target);
      const suffix = el.dataset.suffix ?? '';
      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(counter.v)}${suffix}`;
          },
        },
        0.7 + i * 0.2
      );
    });

    tl.to('.stat-bar', { scaleX: 1, stagger: 0.15, duration: 1.2, ease: 'expo.out' }, 0.9);
    tl.to('.stats-wrap', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 6.4);
    return tl;
  });

  return (
    <AbsoluteFill ref={scope}>
      <SceneTag label="04 / TALL I BEVEGELSE" />
      <Center>
        <div className="stats-wrap" style={{ display: 'flex', gap: 70 }}>
          {STATS.map((s) => (
            <div
              key={s.label}
              className="stat-card"
              style={{
                width: 420,
                padding: '60px 40px',
                borderRadius: 24,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <div
                className="stat-num"
                data-target={s.target}
                data-suffix={s.suffix}
                style={{
                  fontSize: 96,
                  fontWeight: 800,
                  color: theme.gold,
                  textShadow: `0 0 30px ${theme.gold}55`,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                0{s.suffix}
              </div>
              <div style={{ fontSize: 26, letterSpacing: 6, color: theme.gray }}>{s.label}</div>
              <div
                style={{
                  width: '100%',
                  height: 5,
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="stat-bar"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight})`,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left center',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6 — outro (5s)
// ---------------------------------------------------------------------------

const OutroScene: React.FC = () => {
  const scope = useGsapTimeline<HTMLDivElement>(() => {
    const tl = gsap.timeline();
    tl.from('.outro-char', {
      y: 100,
      opacity: 0,
      rotateX: -80,
      stagger: 0.045,
      duration: 0.9,
      ease: 'back.out(1.8)',
    })
      .from('.outro-line', { scaleX: 0, duration: 0.7, ease: 'expo.out' }, '-=0.5')
      .from('.outro-sub', { y: 26, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .to('.outro-glow', { opacity: 0.9, scale: 1.25, duration: 1.6, ease: 'sine.inOut' }, 2.2)
      .to('.outro-wrap', { opacity: 0, duration: 0.7, ease: 'power2.in' }, 4.2);
    return tl;
  });

  return (
    <AbsoluteFill ref={scope}>
      <Center>
        <div
          className="outro-wrap"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 30,
          }}
        >
          <div
            className="outro-glow"
            style={{
              position: 'absolute',
              width: 900,
              height: 500,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${theme.gold}22 0%, transparent 65%)`,
              opacity: 0.4,
            }}
          />
          <h1
            style={{
              fontSize: 120,
              fontWeight: 800,
              letterSpacing: 6,
              margin: 0,
              color: theme.white,
              perspective: 600,
              position: 'relative',
            }}
          >
            <Chars text="GSAP" className="outro-char" style={{ color: theme.gold }} />
            <Chars text=" × " className="outro-char" style={{ color: theme.gray, fontWeight: 300 }} />
            <Chars text="REMOTION" className="outro-char" />
          </h1>
          <div
            className="outro-line"
            style={{
              width: 520,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${theme.gold}, transparent)`,
              boxShadow: `0 0 16px ${theme.gold}`,
            }}
          />
          <div
            className="outro-sub"
            style={{ fontSize: 30, letterSpacing: 10, color: theme.gray, fontWeight: 300 }}
          >
            BYGGET I KODE &middot; RENDRET SOM VIDEO
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------

export const SHOWCASE_DURATION = 1170;

export const Showcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <DynamicBackground />
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>
      <Sequence from={150} durationInFrames={210}>
        <TypographyScene />
      </Sequence>
      <Sequence from={360} durationInFrames={240}>
        <EasingScene />
      </Sequence>
      <Sequence from={600} durationInFrames={210}>
        <GeometryScene />
      </Sequence>
      <Sequence from={810} durationInFrames={210}>
        <StatsScene />
      </Sequence>
      <Sequence from={1020} durationInFrames={150}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
