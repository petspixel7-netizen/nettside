import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from 'remotion';
import { theme } from './theme';
import { Particles } from './components/Particles';
import { KineticText } from './components/KineticText';
import { GlowLine } from './components/GlowLine';
import { FadeIn, FadeOut, SlashWipe } from './components/SceneTransition';
import { easeOutExpo, easeOutBack, easeInOutCubic, clamp, progress } from './utils/easing';

// ─── Bakgrunn med animert radial glow ───────────────────────────────────────
const AnimatedBg: React.FC<{ color?: string }> = ({ color = theme.gold }) => {
  const frame = useCurrentFrame();
  const pulse1 = 0.6 + 0.4 * Math.sin(frame * 0.04);
  const pulse2 = 0.6 + 0.4 * Math.sin(frame * 0.03 + 1.5);
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: theme.bg, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        width: 900, height: 900,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}22 0%, transparent 65%)`,
        opacity: pulse1,
      }} />
      <div style={{
        position: 'absolute',
        width: 1200, height: 600,
        top: '20%', left: '-10%',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${color}0D 0%, transparent 60%)`,
        opacity: pulse2,
        transform: `rotate(${frame * 0.1}deg)`,
      }} />
    </div>
  );
};

// ─── Scene 1: Logo reveal (0–100) ───────────────────────────────────────────
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bokstav-for-bokstav reveal av "NorLeads"
  const letters = 'NorLeads'.split('');
  const lineIn = easeOutExpo(clamp(progress(frame, 35, 55)));
  const taglineT = easeOutExpo(clamp(progress(frame, 55, 75)));
  const ringScale = spring({ fps, frame, config: { damping: 8, stiffness: 60 }, durationInFrames: 50 });
  const ringOpacity = interpolate(frame, [0, 10, 80, 100], [0, 1, 1, 0]);

  return (
    <AbsoluteFill>
      <AnimatedBg />
      <Particles intensity={0.7} />

      {/* Ytre ring */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{
          width: 500, height: 500, borderRadius: '50%',
          border: `1px solid ${theme.gold}44`,
          transform: `scale(${ringScale * 1.1})`,
          opacity: ringOpacity * 0.5,
        }} />
        <div style={{
          position: 'absolute',
          width: 380, height: 380, borderRadius: '50%',
          border: `1px solid ${theme.gold}33`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity * 0.3,
        }} />
      </div>

      {/* Logo tekst */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 24,
      }}>
        <div style={{ display: 'flex', overflow: 'hidden' }}>
          {letters.map((letter, i) => {
            const isGold = i >= 3;
            const t = easeOutBack(clamp(progress(frame, i * 3, i * 3 + 20)));
            return (
              <span
                key={i}
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 120,
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  color: isGold ? theme.gold : theme.white,
                  transform: `translateY(${(1 - t) * 80}px)`,
                  opacity: t,
                  display: 'inline-block',
                  textShadow: isGold
                    ? `0 0 40px ${theme.gold}88, 0 0 80px ${theme.gold}44`
                    : '0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>

        <div style={{ opacity: lineIn }}>
          <GlowLine startFrame={35} width={480} />
        </div>

        <div style={{
          opacity: taglineT,
          transform: `translateY(${(1 - taglineT) * 20}px)`,
          fontFamily: 'sans-serif',
          fontSize: 20,
          letterSpacing: 8,
          color: theme.gray,
          textTransform: 'uppercase',
          filter: `blur(${(1 - taglineT) * 6}px)`,
        }}>
          Animasjonsvideoer som selger
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Hva vi tilbyr (100–210) ───────────────────────────────────────
const SceneServices: React.FC = () => {
  const frame = useCurrentFrame();
  const services = [
    { icon: '🎬', title: 'Reklamevideoer', sub: 'For sosiale medier og TV' },
    { icon: '✨', title: 'Produktanimasjon', sub: 'Vis frem det du selger' },
    { icon: '🚀', title: 'Firmaintro', sub: 'Profesjonell merkevare' },
    { icon: '📈', title: 'Kampanjevideoer', sub: 'Tilbud som konverterer' },
  ];

  return (
    <AbsoluteFill>
      <AnimatedBg color={theme.gold} />
      <Particles intensity={0.5} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 120px', gap: 50,
      }}>
        {/* Heading */}
        <div style={{ overflow: 'hidden' }}>
          <KineticText
            text="Vi lager videoer"
            style={{ fontSize: 64, fontWeight: 900, fontFamily: 'Georgia, serif' }}
            startFrame={5}
            stagger={4}
            mode="rise"
            color={theme.white}
          />
          <KineticText
            text="som gir resultater"
            style={{ fontSize: 64, fontWeight: 900, fontFamily: 'Georgia, serif', marginTop: 4 }}
            startFrame={15}
            stagger={4}
            mode="rise"
            goldWord="resultater"
            goldColor={theme.gold}
          />
        </div>

        <div style={{ opacity: easeOutExpo(clamp(progress(frame, 10, 25))) }}>
          <GlowLine startFrame={10} width={560} />
        </div>

        {/* Service cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {services.map((s, i) => {
            const t = easeOutExpo(clamp(progress(frame, 25 + i * 10, 50 + i * 10)));
            const shimmer = 0.5 + 0.5 * Math.sin(frame * 0.08 + i * 1.2);
            return (
              <div key={i} style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(212,175,55,${0.04 + shimmer * 0.04}))`,
                border: `1px solid rgba(212,175,55,${0.15 + shimmer * 0.1})`,
                borderRadius: 16,
                padding: '28px 32px',
                display: 'flex', alignItems: 'center', gap: 20,
                opacity: t,
                transform: `translateX(${(1 - t) * (i % 2 === 0 ? -40 : 40)}px)`,
                boxShadow: `0 0 ${20 + shimmer * 10}px rgba(212,175,55,0.05)`,
              }}>
                <span style={{ fontSize: 42 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: 'sans-serif', fontSize: 22, fontWeight: 700, color: theme.white }}>
                    {s.title}
                  </div>
                  <div style={{ fontFamily: 'sans-serif', fontSize: 16, color: theme.gray, marginTop: 4 }}>
                    {s.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Stats counter (210–320) ───────────────────────────────────────
const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: 3, suffix: 'x', label: 'Mer engasjement', sub: 'med video vs. bilde' },
    { value: 80, suffix: '%', label: 'Husker budskapet', sub: 'etter å se video' },
    { value: 10, suffix: 'x', label: 'Mer rekkevidde', sub: 'på sosiale medier' },
  ];

  const titleT = easeOutExpo(clamp(progress(frame, 0, 25)));

  return (
    <AbsoluteFill>
      <AnimatedBg color="#4444FF" />
      <Particles intensity={0.8} />

      {/* Grid bakgrunnslinjer */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${i * 11}%`, top: 0, bottom: 0,
            width: 1, background: theme.gold,
          }} />
        ))}
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 70,
      }}>
        <div style={{
          textAlign: 'center',
          opacity: titleT,
          transform: `translateY(${(1 - titleT) * 30}px)`,
          filter: `blur(${(1 - titleT) * 8}px)`,
        }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 48, fontWeight: 700, color: theme.white }}>
            Hvorfor <span style={{ color: theme.gold }}>video virker</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 100 }}>
          {stats.map((stat, i) => {
            const s = spring({
              fps,
              frame: frame - (i * 15 + 20),
              config: { damping: 12, stiffness: 80 },
              durationInFrames: 35,
            });
            const countT = clamp(progress(frame, i * 15 + 20, i * 15 + 55));
            const displayVal = Math.round(easeOutExpo(countT) * stat.value);
            const shimmer = 0.7 + 0.3 * Math.sin(frame * 0.06 + i * 2);

            return (
              <div key={i} style={{
                textAlign: 'center',
                opacity: s,
                transform: `translateY(${(1 - s) * 60}px) scale(${0.8 + s * 0.2})`,
              }}>
                {/* Bakgrunnssirkel */}
                <div style={{
                  position: 'relative',
                  width: 220, height: 220,
                  margin: '0 auto 20px',
                }}>
                  <svg width="220" height="220" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <circle cx="110" cy="110" r="100" fill="none" stroke={`${theme.gold}22`} strokeWidth="2" />
                    <circle
                      cx="110" cy="110" r="100"
                      fill="none"
                      stroke={theme.gold}
                      strokeWidth="3"
                      strokeDasharray={`${628 * countT} 628`}
                      strokeLinecap="round"
                      transform="rotate(-90 110 110)"
                      style={{ filter: `drop-shadow(0 0 8px ${theme.gold})` }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center',
                  }}>
                    <div style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 64, fontWeight: 900,
                      color: theme.gold,
                      lineHeight: 1,
                      textShadow: `0 0 ${20 + shimmer * 20}px ${theme.gold}88`,
                    }}>
                      {displayVal}{stat.suffix}
                    </div>
                  </div>
                </div>

                <div style={{ fontFamily: 'sans-serif', fontSize: 22, color: theme.white, fontWeight: 600 }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: 'sans-serif', fontSize: 16, color: theme.gray, marginTop: 6 }}>
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: CTA (320–440) ─────────────────────────────────────────────────
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ fps, frame, config: { damping: 10, stiffness: 100 } });
  const lineT = easeOutExpo(clamp(progress(frame, 25, 45)));
  const ctaT = easeOutExpo(clamp(progress(frame, 40, 60)));
  const btnT = easeOutBack(clamp(progress(frame, 60, 80)));

  // Pulserende ring
  const ringPulse = 1 + 0.04 * Math.sin(frame * 0.07);
  // Shimmer på knapp
  const shimmerPos = ((frame * 3) % 120) - 20;

  return (
    <AbsoluteFill>
      <AnimatedBg />
      <Particles intensity={1} />

      {/* Pulserende sirkler */}
      {[600, 750, 900].map((size, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: size, height: size,
          transform: `translate(-50%, -50%) scale(${ringPulse + i * 0.02})`,
          borderRadius: '50%',
          border: `1px solid ${theme.gold}${['33', '22', '11'][i]}`,
          boxShadow: i === 0 ? `0 0 30px ${theme.gold}22` : 'none',
        }} />
      ))}

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 32,
      }}>
        {/* Logo */}
        <div style={{
          transform: `scale(${logoScale})`,
          textAlign: 'center',
        }}>
          {'NorLeads'.split('').map((ch, i) => {
            const isGold = i >= 3;
            return (
              <span key={i} style={{
                fontFamily: 'Georgia, serif',
                fontSize: 100,
                fontWeight: 900,
                color: isGold ? theme.gold : theme.white,
                textShadow: isGold
                  ? `0 0 40px ${theme.gold}99, 0 0 80px ${theme.gold}44`
                  : '0 4px 30px rgba(0,0,0,0.6)',
                letterSpacing: '-2px',
              }}>
                {ch}
              </span>
            );
          })}
        </div>

        {/* Glødende linje */}
        <div style={{ opacity: lineT }}>
          <GlowLine startFrame={25} width={500} />
        </div>

        {/* Tagline */}
        <div style={{
          opacity: ctaT,
          transform: `translateY(${(1 - ctaT) * 20}px)`,
          filter: `blur(${(1 - ctaT) * 6}px)`,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'sans-serif',
            fontSize: 30,
            color: theme.white,
            fontWeight: 300,
            letterSpacing: 2,
            marginBottom: 8,
          }}>
            Klar for en video som
          </div>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: 46,
            color: theme.gold,
            fontWeight: 700,
            textShadow: `0 0 30px ${theme.gold}66`,
          }}>
            faktisk selger?
          </div>
        </div>

        {/* CTA-knapp med shimmer */}
        <div style={{
          opacity: btnT,
          transform: `scale(${0.8 + btnT * 0.2})`,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 60,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight}, ${theme.gold})`,
            color: theme.bg,
            fontFamily: 'sans-serif',
            fontSize: 26,
            fontWeight: 800,
            padding: '20px 60px',
            borderRadius: 60,
            letterSpacing: 1,
            boxShadow: `0 0 40px ${theme.gold}66, 0 0 80px ${theme.gold}33`,
          }}>
            Ta kontakt i dag
          </div>
          {/* Shimmer overlay */}
          <div style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: shimmerPos,
            width: 60,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-20deg)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Nettside */}
        <div style={{
          opacity: Math.max(0, ctaT - 0.3) * (1 / 0.7),
          fontFamily: 'sans-serif',
          fontSize: 18,
          color: `${theme.gold}99`,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}>
          norleads.no
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Hoved-komponent ─────────────────────────────────────────────────────────
const SCENE_INTRO = 0;
const SCENE_SERVICES = 100;
const SCENE_STATS = 220;
const SCENE_CTA = 330;
const TOTAL = 440;

export const NorLeadsAd: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Scene 1 */}
      <Sequence from={SCENE_INTRO} durationInFrames={SCENE_SERVICES - SCENE_INTRO + 15}>
        <FadeOut totalFrames={SCENE_SERVICES - SCENE_INTRO + 15} fadeStart={SCENE_SERVICES - SCENE_INTRO}>
          <SceneIntro />
        </FadeOut>
      </Sequence>

      {/* Scene 2 */}
      <Sequence from={SCENE_SERVICES} durationInFrames={SCENE_STATS - SCENE_SERVICES + 15}>
        <FadeIn duration={15}>
          <FadeOut totalFrames={SCENE_STATS - SCENE_SERVICES + 15} fadeStart={SCENE_STATS - SCENE_SERVICES}>
            <SceneServices />
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* Scene 3 */}
      <Sequence from={SCENE_STATS} durationInFrames={SCENE_CTA - SCENE_STATS + 15}>
        <FadeIn duration={15}>
          <FadeOut totalFrames={SCENE_CTA - SCENE_STATS + 15} fadeStart={SCENE_CTA - SCENE_STATS}>
            <SceneStats />
          </FadeOut>
        </FadeIn>
      </Sequence>

      {/* Scene 4 */}
      <Sequence from={SCENE_CTA} durationInFrames={TOTAL - SCENE_CTA}>
        <FadeIn duration={15}>
          <SceneCTA />
        </FadeIn>
      </Sequence>

      {/* Gold slash wipe mellom scener */}
      <Sequence from={SCENE_SERVICES - 10} durationInFrames={25}>
        <SlashWipe startFrame={0} />
      </Sequence>
      <Sequence from={SCENE_STATS - 10} durationInFrames={25}>
        <SlashWipe startFrame={0} />
      </Sequence>
      <Sequence from={SCENE_CTA - 10} durationInFrames={25}>
        <SlashWipe startFrame={0} />
      </Sequence>
    </AbsoluteFill>
  );
};
