import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { KineticText } from './components/KineticText';
import { clamp } from './utils/easing';

// ─── Palette ───────────────────────────────────────────────────────────────
const C = {
  bg: '#06090F',
  bgCard: '#0D1520',
  green: '#00F5A0',
  cyan: '#00D4FF',
  red: '#FF3B5C',
  white: '#FFFFFF',
  muted: '#5A7090',
  grid: '#0F1E30',
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const fade = (frame: number, start: number, dur = 12) =>
  clamp((frame - start) / dur);

const fadeOut = (frame: number, start: number, dur = 10) =>
  clamp(1 - (frame - start) / dur);

// ─── Grid background ───────────────────────────────────────────────────────
const Grid: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    {Array.from({ length: 16 }).map((_, i) => (
      <div key={`v${i}`} style={{
        position: 'absolute', left: `${(i / 15) * 100}%`,
        top: 0, bottom: 0, width: 1, background: C.grid,
      }} />
    ))}
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={`h${i}`} style={{
        position: 'absolute', top: `${(i / 8) * 100}%`,
        left: 0, right: 0, height: 1, background: C.grid,
      }} />
    ))}
  </div>
);

// ─── Animated chart line ────────────────────────────────────────────────────
const ChartLine: React.FC<{ progress: number }> = ({ progress }) => {
  const points = [
    [0, 75], [8, 70], [15, 78], [22, 60], [30, 65],
    [38, 45], [45, 50], [52, 35], [60, 40], [68, 20],
    [76, 28], [84, 10], [92, 15], [100, 5],
  ];

  const visible = points.filter(([x]) => x <= progress * 100);
  if (visible.length < 2) return null;

  const toSVG = ([x, y]: number[]) => `${(x / 100) * 600},${(y / 100) * 200}`;
  const d = `M ${visible.map(toSVG).join(' L ')}`;

  const glowY = visible[visible.length - 1][1];
  const glowX = visible[visible.length - 1][0];

  return (
    <svg width="600" height="200" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={C.cyan} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.green} stopOpacity="1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* area fill */}
      <path
        d={`${d} L ${(glowX / 100) * 600},200 L 0,200 Z`}
        fill={`url(#lineGrad)`}
        opacity={0.08}
      />
      {/* main line */}
      <path d={d} fill="none" stroke={C.green} strokeWidth="2.5" filter="url(#glow)" />
      {/* dot at tip */}
      <circle
        cx={(glowX / 100) * 600}
        cy={(glowY / 100) * 200}
        r="5"
        fill={C.green}
        filter="url(#glow)"
      />
    </svg>
  );
};

// ─── Counter ────────────────────────────────────────────────────────────────
const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number }> = ({
  value, prefix = '', suffix = '', decimals = 0,
}) => (
  <span>{prefix}{value.toFixed(decimals)}{suffix}</span>
);

// ─── Scan line ──────────────────────────────────────────────────────────────
const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();
  const y = ((frame * 2) % 1100);
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0,
      top: y, height: 2,
      background: `linear-gradient(90deg, transparent, ${C.cyan}33, transparent)`,
      pointerEvents: 'none',
    }} />
  );
};

// ─── Main composition ────────────────────────────────────────────────────────
export const ComposerAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (frames)
  const S = {
    s1Start: 0,    // Hook: "Stop trading manually"
    s1End: 75,
    s2Start: 70,   // Problem → Solution bridge
    s2End: 180,
    s3Start: 175,  // "Meet Composer"
    s3End: 330,
    s4Start: 320,  // Feature: "60 seconds"
    s4End: 480,
    s5Start: 470,  // Numbers
    s5End: 660,
    s6Start: 650,  // CTA
    s6End: 900,
  };

  // Spring helpers
  const sp = (f: number, start: number, stiff = 120, damp = 14) =>
    spring({ frame: f - start, fps, config: { stiffness: stiff, damping: damp }, clamp: true });

  // ── Scene 1: Hook (0-75) ──────────────────────────────────────────────────
  const s1Opacity = frame < 60 ? fade(frame, 0, 8) : fadeOut(frame, 62, 10);

  // ── Scene 2: "AI builds your strategy" (70-180) ───────────────────────────
  const s2Opacity = frame < 165 ? fade(frame, S.s2Start, 10) : fadeOut(frame, 167, 10);
  const typingProgress = clamp((frame - S.s2Start - 10) / 60);
  const fullText = 'Build me a momentum strategy with tech stocks';
  const typedText = fullText.slice(0, Math.floor(typingProgress * fullText.length));
  const showCursor = frame > S.s2Start + 5 && frame < S.s2End;

  // ── Scene 3: "Meet Composer" (175-330) ────────────────────────────────────
  const s3Opacity = frame < 315 ? fade(frame, S.s3Start, 12) : fadeOut(frame, 317, 10);
  const logoScale = sp(frame, S.s3Start + 5, 100, 12);
  const glowPulse = 0.6 + 0.4 * Math.sin(frame * 0.12);

  // ── Scene 4: Feature (320-480) ────────────────────────────────────────────
  const s4Opacity = frame < 462 ? fade(frame, S.s4Start, 12) : fadeOut(frame, 464, 10);
  const chartProgress = clamp((frame - S.s4Start - 15) / 100);

  // ── Scene 5: Numbers (470-660) ────────────────────────────────────────────
  const s5Opacity = frame < 642 ? fade(frame, S.s5Start, 12) : fadeOut(frame, 644, 10);
  const numProgress = clamp((frame - S.s5Start - 10) / 80);
  const volumeVal = numProgress * 200;
  const stratCount = Math.floor(numProgress * 3000);

  // ── Scene 6: CTA (650-900) ────────────────────────────────────────────────
  const s6Opacity = fade(frame, S.s6Start, 15);
  const ctaScale = sp(frame, S.s6Start + 10, 80, 16);
  const urlPulse = 0.85 + 0.15 * Math.sin(frame * 0.15);

  return (
    <div style={{
      width: 1920, height: 1080,
      background: C.bg,
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Grid />
      <ScanLine />

      {/* Ambient glow top-right */}
      <div style={{
        position: 'absolute', top: -200, right: -200,
        width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.cyan}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      {/* Ambient glow bottom-left */}
      <div style={{
        position: 'absolute', bottom: -200, left: -100,
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.green}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* ── SCENE 1: Hook ── */}
      {frame < S.s1End + 5 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: s1Opacity,
        }}>
          <div style={{
            fontSize: 28, letterSpacing: 8, color: C.red,
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 24,
            opacity: fade(frame, 2, 8),
          }}>
            The problem with trading
          </div>
          <KineticText
            text="You're doing it manually."
            mode="rise"
            startFrame={8}
            stagger={3}
            style={{ fontSize: 96, fontWeight: 900, letterSpacing: -2, justifyContent: 'center' }}
            color={C.white}
          />
          <KineticText
            text="That's exhausting."
            mode="rise"
            startFrame={28}
            stagger={3}
            style={{ fontSize: 96, fontWeight: 900, letterSpacing: -2, justifyContent: 'center', marginTop: 8 }}
            color={C.red}
          />
        </div>
      )}

      {/* ── SCENE 2: Typing ── */}
      {frame > S.s2Start - 5 && frame < S.s2End + 5 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: s2Opacity,
        }}>
          <div style={{
            fontSize: 36, color: C.muted, marginBottom: 48, fontWeight: 500,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            What if you just… typed it?
          </div>

          {/* Terminal box */}
          <div style={{
            background: C.bgCard,
            border: `1px solid ${C.cyan}44`,
            borderRadius: 16,
            padding: '36px 56px',
            width: 900,
            boxShadow: `0 0 60px ${C.cyan}22`,
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['#FF5F57','#FFBD2E','#28C840'].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: 28, color: C.green, letterSpacing: 0.5,
            }}>
              <span style={{ color: C.muted }}>composer &gt; </span>
              {typedText}
              {showCursor && (
                <span style={{
                  display: 'inline-block', width: 3, height: 30,
                  background: C.green, marginLeft: 4,
                  opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                  verticalAlign: 'middle',
                }} />
              )}
            </div>
          </div>

          <div style={{
            marginTop: 40, fontSize: 24, color: C.cyan,
            opacity: fade(frame, S.s2Start + 65, 10),
          }}>
            ✓ Strategy built and backtested in 60 seconds
          </div>
        </div>
      )}

      {/* ── SCENE 3: Meet Composer ── */}
      {frame > S.s3Start - 5 && frame < S.s3End + 5 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: s3Opacity,
        }}>
          <div style={{
            fontSize: 22, letterSpacing: 10, color: C.cyan,
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 32,
            opacity: fade(frame, S.s3Start + 5, 10),
          }}>
            Introducing
          </div>

          <div style={{
            fontSize: 160, fontWeight: 900, letterSpacing: -6,
            transform: `scale(${0.5 + logoScale * 0.5})`,
            background: `linear-gradient(135deg, ${C.white} 30%, ${C.green} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: `drop-shadow(0 0 ${40 * glowPulse}px ${C.green}88)`,
          }}>
            Composer
          </div>

          <div style={{
            fontSize: 36, color: C.muted, marginTop: 24, fontWeight: 400,
            opacity: fade(frame, S.s3Start + 25, 12),
            letterSpacing: 1,
          }}>
            Trade with AI. No code. No stress.
          </div>
        </div>
      )}

      {/* ── SCENE 4: Chart feature ── */}
      {frame > S.s4Start - 5 && frame < S.s4End + 5 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          opacity: s4Opacity, gap: 100,
        }}>
          {/* Left text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 500 }}>
            <KineticText
              text="AI builds your strategy."
              mode="rise" startFrame={S.s4Start + 5} stagger={2}
              style={{ fontSize: 62, fontWeight: 800, letterSpacing: -1 }}
              color={C.white}
            />
            <KineticText
              text="In 60 seconds."
              mode="rise" startFrame={S.s4Start + 20} stagger={3}
              style={{ fontSize: 62, fontWeight: 800, letterSpacing: -1 }}
              color={C.green}
            />
            <div style={{
              fontSize: 22, color: C.muted, marginTop: 8, lineHeight: 1.6,
              opacity: fade(frame, S.s4Start + 35, 12),
            }}>
              Type in plain English.<br />
              Composer backtests, optimizes<br />
              and executes — automatically.
            </div>
          </div>

          {/* Chart */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: C.bgCard,
            border: `1px solid ${C.green}33`,
            borderRadius: 20, padding: '32px 40px',
            boxShadow: `0 0 80px ${C.green}18`,
            opacity: fade(frame, S.s4Start + 10, 15),
          }}>
            <div style={{ fontSize: 16, color: C.muted, marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}>
              Portfolio Performance
            </div>
            <div style={{ fontSize: 48, fontWeight: 800, color: C.green, marginBottom: 24 }}>
              +{(chartProgress * 127).toFixed(1)}%
            </div>
            <ChartLine progress={chartProgress} />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 12, fontSize: 14, color: C.muted,
            }}>
              <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Now</span>
            </div>
          </div>
        </div>
      )}

      {/* ── SCENE 5: Numbers ── */}
      {frame > S.s5Start - 5 && frame < S.s5End + 5 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: s5Opacity, gap: 60,
        }}>
          <div style={{ fontSize: 28, color: C.muted, letterSpacing: 4, textTransform: 'uppercase' }}>
            Trusted by traders worldwide
          </div>

          <div style={{ display: 'flex', gap: 100 }}>
            {[
              { val: `$${volumeVal.toFixed(0)}M+`, label: 'Daily Trading Volume' },
              { val: `${stratCount.toLocaleString()}+`, label: 'Ready-Made Strategies' },
              { val: '60s', label: 'Strategy Build Time' },
            ].map(({ val, label }, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                opacity: fade(frame, S.s5Start + 15 + i * 15, 12),
              }}>
                <div style={{
                  fontSize: 88, fontWeight: 900, letterSpacing: -2,
                  background: `linear-gradient(135deg, ${C.white}, ${C.green})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {val}
                </div>
                <div style={{ fontSize: 20, color: C.muted, letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex', gap: 60, marginTop: 20,
            opacity: fade(frame, S.s5Start + 55, 12),
          }}>
            {['Stocks', 'Crypto', 'ETFs', 'Options'].map((tag, i) => (
              <div key={i} style={{
                padding: '10px 28px', borderRadius: 100,
                border: `1px solid ${C.cyan}55`,
                color: C.cyan, fontSize: 18, fontWeight: 600,
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SCENE 6: CTA ── */}
      {frame > S.s6Start - 5 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: s6Opacity,
        }}>
          {/* Big glow behind logo */}
          <div style={{
            position: 'absolute',
            width: 900, height: 900, borderRadius: '50%',
            background: `radial-gradient(circle, ${C.green}18 0%, transparent 65%)`,
            pointerEvents: 'none',
            transform: `scale(${ctaScale})`,
          }} />

          <div style={{
            fontSize: 120, fontWeight: 900, letterSpacing: -4,
            background: `linear-gradient(135deg, ${C.white} 20%, ${C.green} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            transform: `scale(${0.6 + ctaScale * 0.4})`,
            filter: `drop-shadow(0 0 ${30 * glowPulse}px ${C.green}66)`,
          }}>
            Composer
          </div>

          <div style={{
            fontSize: 32, color: C.muted, marginTop: 12, fontWeight: 400,
            opacity: fade(frame, S.s6Start + 20, 12),
          }}>
            Trade with AI. No code required.
          </div>

          <div style={{
            marginTop: 64,
            padding: '20px 60px',
            borderRadius: 100,
            background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`,
            fontSize: 32, fontWeight: 800, color: C.bg,
            transform: `scale(${urlPulse})`,
            opacity: fade(frame, S.s6Start + 30, 15),
            letterSpacing: 1,
          }}>
            Start free at composer.trade
          </div>

          <div style={{
            marginTop: 32, fontSize: 20, color: C.muted,
            opacity: fade(frame, S.s6Start + 45, 12),
          }}>
            No experience needed. 3,000+ strategies ready to go.
          </div>
        </div>
      )}
    </div>
  );
};
