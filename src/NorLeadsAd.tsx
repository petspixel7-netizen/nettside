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

const GoldLine: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = spring({ fps, frame: frame - delay, config: { damping: 20, stiffness: 80 }, durationInFrames: 40 });
  return (
    <div
      style={{
        height: 3,
        width: `${interpolate(width, [0, 1], [0, 100])}%`,
        background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight})`,
        borderRadius: 2,
      }}
    />
  );
};

// Scene 1: NorLeads logo intro
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ fps, frame, config: { damping: 14, stiffness: 120 }, durationInFrames: 35 });
  const lineOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = spring({ fps, frame: frame - 40, config: { damping: 18, stiffness: 100 }, durationInFrames: 30 });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 16 }}>
      {/* Glow bakgrunn */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.gold}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ transform: `scale(${logoScale})`, textAlign: 'center' }}>
        <span style={{
          fontFamily: theme.font,
          fontSize: 96,
          fontWeight: 900,
          letterSpacing: '-2px',
          color: theme.white,
        }}>
          Nor<span style={{ color: theme.gold }}>Leads</span>
        </span>
      </div>

      <div style={{ opacity: lineOpacity, width: 400 }}>
        <GoldLine />
      </div>

      <div style={{
        transform: `translateY(${interpolate(taglineY, [0, 1], [20, 0])}px)`,
        opacity: taglineY,
        fontFamily: theme.font,
        fontSize: 22,
        letterSpacing: 6,
        color: theme.gray,
        textTransform: 'uppercase',
      }}>
        Animasjonsvideoer som selger
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: "Vi lager videoer for deg"
const SceneWhatWeDo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { icon: '🎬', text: 'Reklamevideo for sosiale medier' },
    { icon: '✨', text: 'Animerte produktpresentasjoner' },
    { icon: '🚀', text: 'Firmaintro og merkevarebygging' },
    { icon: '📈', text: 'Tilbud og kampanjevideoer' },
  ];

  const headingY = spring({ fps, frame, config: { damping: 18, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', padding: '0 140px' }}>
      <div style={{
        transform: `translateY(${interpolate(headingY, [0, 1], [30, 0])}px)`,
        opacity: headingY,
        marginBottom: 50,
      }}>
        <div style={{ marginBottom: 16 }}>
          <GoldLine />
        </div>
        <h2 style={{
          fontFamily: theme.font,
          fontSize: 58,
          fontWeight: 800,
          color: theme.white,
          margin: 0,
          lineHeight: 1.1,
        }}>
          Vi lager videoer<br />
          <span style={{ color: theme.gold }}>som gir resultater</span>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {items.map((item, i) => {
          const itemSpring = spring({
            fps,
            frame: frame - (i * 8 + 15),
            config: { damping: 18, stiffness: 100 },
            durationInFrames: 25,
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                opacity: itemSpring,
                transform: `translateX(${interpolate(itemSpring, [0, 1], [-40, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 36 }}>{item.icon}</span>
              <span style={{
                fontFamily: theme.font,
                fontSize: 28,
                color: theme.white,
                fontWeight: 500,
              }}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Sosiale medier stats
const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { number: '3x', label: 'Mer engasjement med video' },
    { number: '80%', label: 'Husker budskapet etter video' },
    { number: '10x', label: 'Mer rekkevidde på sosiale medier' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 60 }}>
      <div style={{ textAlign: 'center' }}>
        {(() => {
          const h = spring({ fps, frame, config: { damping: 18, stiffness: 100 } });
          return (
            <h2 style={{
              fontFamily: theme.font,
              fontSize: 42,
              color: theme.white,
              margin: 0,
              opacity: h,
              transform: `translateY(${interpolate(h, [0, 1], [20, 0])}px)`,
            }}>
              Hvorfor video <span style={{ color: theme.gold }}>virker</span>
            </h2>
          );
        })()}
      </div>

      <div style={{ display: 'flex', gap: 80 }}>
        {stats.map((stat, i) => {
          const s = spring({
            fps,
            frame: frame - (i * 12 + 20),
            config: { damping: 14, stiffness: 120 },
            durationInFrames: 30,
          });
          return (
            <div key={i} style={{
              textAlign: 'center',
              opacity: s,
              transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
            }}>
              <div style={{
                fontFamily: theme.font,
                fontSize: 80,
                fontWeight: 900,
                color: theme.gold,
                lineHeight: 1,
              }}>
                {stat.number}
              </div>
              <div style={{
                fontFamily: theme.font,
                fontSize: 20,
                color: theme.gray,
                marginTop: 12,
                maxWidth: 180,
                lineHeight: 1.4,
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Call to action
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin(frame * 0.08) * 0.04 + 1;
  const logoIn = spring({ fps, frame, config: { damping: 14, stiffness: 100 } });
  const ctaIn = spring({ fps, frame: frame - 25, config: { damping: 18, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40 }}>
      <div style={{
        position: 'absolute',
        width: 800,
        height: 800,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.gold}12 0%, transparent 65%)`,
        transform: `scale(${pulse})`,
      }} />

      <div style={{
        opacity: logoIn,
        transform: `scale(${interpolate(logoIn, [0, 1], [0.8, 1])})`,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: theme.font,
          fontSize: 80,
          fontWeight: 900,
          color: theme.white,
          letterSpacing: '-2px',
        }}>
          Nor<span style={{ color: theme.gold }}>Leads</span>
        </div>
      </div>

      <div style={{ width: 500, opacity: logoIn }}>
        <GoldLine />
      </div>

      <div style={{
        opacity: ctaIn,
        transform: `translateY(${interpolate(ctaIn, [0, 1], [20, 0])}px)`,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: theme.font,
          fontSize: 32,
          color: theme.white,
          marginBottom: 20,
        }}>
          Klar for en video som faktisk selger?
        </div>
        <div style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight})`,
          color: theme.bg,
          fontFamily: theme.font,
          fontSize: 26,
          fontWeight: 800,
          padding: '16px 48px',
          borderRadius: 50,
          letterSpacing: 1,
        }}>
          Ta kontakt i dag
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Hoved-komponent med alle scener
export const NorLeadsAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <Sequence from={0} durationInFrames={90}>
        <SceneIntro />
      </Sequence>
      <Sequence from={90} durationInFrames={100}>
        <SceneWhatWeDo />
      </Sequence>
      <Sequence from={190} durationInFrames={90}>
        <SceneStats />
      </Sequence>
      <Sequence from={280} durationInFrames={100}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
