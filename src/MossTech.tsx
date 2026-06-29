import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  easeOutExpo, easeInOutCubic, easeOutBack,
  clamp, prog, presence,
} from './utils/easing';

/*
  ─────────────────────────────────────────────────────────────────────────────
  MossTech — "Norges Teknologiby"  ·  forklaringsvideo  ·  ~45s @ 30fps (1350f)
  1920×1080. Selvstendig fil, all kode inlinet (jf. animasjonskilder.md).

  Kilder / lisenser (alle kommersielt frie):
    · Bevegelse:  GSAP-stil tidslinjer + easing (easings.net, public domain)
    · Tokens:     IBM Carbon / Material motion  (Apache-2.0)
    · Ikoner:     Lucide-inspirerte stroke-paths (ISC)
    · Bakgrunn:   Haikei-stil mesh/aurora + Hero Patterns grid (CC0/MIT)
    · Effekter:   border-beam / blur-in / animated-number / marquee  (Magic UI, MIT)
  Farger: NorLeads-paletten → tech-utvalg (cyan / lime / violet) på MossTech mørk.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG     = '#05070C';
const BG2    = '#0A0F18';
const INK    = '#EAF2FB';
const MUTED  = '#8696AC';
const CYAN   = '#22D3EE';
const LIME   = '#A3E635';
const VIOLET = '#A78BFA';
const GREEN  = '#34D399';

const SANS = '"Inter", "Helvetica Neue", "Segoe UI", Arial, sans-serif';
const MONO = '"SF Mono", "SFMono-Regular", "Roboto Mono", Menlo, Consolas, monospace';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex  = (c: string, a: number) =>
  c + Math.round(clamp(a) * 255).toString(16).padStart(2, '0');

// ─── Timeline ─────────────────────────────────────────────────────────────────
const TOTAL = 1350; // 45s
const SS = {
  INTRO:     0,
  VISION:    150,
  PILLARS:   340,
  VERTICALS: 575,
  STATS:     835,
  ROADMAP:   1050,
  CTA:       1200,
};

// ─── Background field data ────────────────────────────────────────────────────
// Network nodes (constellation) — deterministic layout
const NODES = Array.from({ length: 26 }, (_, i) => ({
  x:  (i * 71.3)  % 100,
  y:  (i * 47.9)  % 100,
  r:  1.4 + (i % 4) * 0.7,
  vx: Math.sin(i * 1.7) * 0.0015,
  vy: -(0.0016 + (i % 5) * 0.0009),
  ph: (i * 33) % (Math.PI * 2),
  c:  [CYAN, LIME, VIOLET, CYAN][i % 4],
}));

const DUST = Array.from({ length: 60 }, (_, i) => ({
  x:  (i * 137.5) % 100,
  y:  (i * 91.7)  % 100,
  r:  0.4 + (i % 5) * 0.35,
  vy: -(0.004 + (i % 6) * 0.0028),
  vx: Math.sin(i * 2.1) * 0.0012,
  op: 0.05 + (i % 5) * 0.04,
  ph: (i * 29) % (Math.PI * 2),
}));

const AURORA = [
  { x: 26, y: 32, rx: 16, ry: 11, sx: 0.006, sy: 0.008, px: 0.0, py: 1.1, size: 880, c: CYAN,   op: 0.16 },
  { x: 74, y: 60, rx: 13, ry: 18, sx: 0.008, sy: 0.005, px: 2.0, py: 0.5, size: 1000, c: VIOLET, op: 0.10 },
  { x: 52, y: 22, rx: 19, ry: 9,  sx: 0.005, sy: 0.010, px: 1.1, py: 2.8, size: 720, c: LIME,   op: 0.09 },
  { x: 18, y: 78, rx: 11, ry: 15, sx: 0.010, sy: 0.006, px: 4.0, py: 0.7, size: 620, c: CYAN,   op: 0.10 },
];

// ─── Tech background (aurora + perspective grid + node network + dust) ────────
const TechBackground: React.FC<{ cam: number }> = ({ cam }) => {
  const frame = useCurrentFrame();
  const t = frame;

  // Compute node screen positions once for edge drawing
  const pos = NODES.map((n) => ({
    x: ((n.x + t * n.vx * 100) % 100 + 100) % 100,
    y: ((n.y + t * n.vy * 100) % 100 + 100) % 100,
    r: n.r, c: n.c, ph: n.ph,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: BG, overflow: 'hidden' }}>
      {/* Base vertical gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(160deg, ${BG2} 0%, ${BG} 55%, #03040A 100%)`,
      }} />

      {/* Aurora / mesh orbs */}
      {AURORA.map((o, i) => {
        const x = o.x + Math.sin(t * o.sx + o.px) * o.rx;
        const y = o.y + Math.cos(t * o.sy + o.py) * o.ry;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: o.size, height: o.size,
            transform: 'translate(-50%,-50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${o.c} 0%, transparent 70%)`,
            opacity: o.op, filter: 'blur(8px)',
          }} />
        );
      })}

      {/* Perspective grid floor */}
      <div style={{
        position: 'absolute', left: '-25%', right: '-25%', bottom: '-10%', height: '62%',
        perspective: 620, perspectiveOrigin: '50% 0%',
        opacity: 0.55, pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          transform: 'rotateX(70deg)',
          transformOrigin: '50% 0%',
          backgroundImage: `
            linear-gradient(${hex(CYAN, 0.18)} 1px, transparent 1px),
            linear-gradient(90deg, ${hex(CYAN, 0.12)} 1px, transparent 1px)`,
          backgroundSize: '70px 70px',
          backgroundPosition: `0px ${(t * 0.9) % 70}px`,
          maskImage: 'linear-gradient(to bottom, transparent, #000 35%, #000 75%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 35%, #000 75%, transparent)',
        }} />
      </div>

      {/* Node network */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${cam})`, transformOrigin: 'center center',
        pointerEvents: 'none',
      }}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080"
          style={{ position: 'absolute', inset: 0 }}>
          {/* Edges between near nodes */}
          {pos.map((a, i) =>
            pos.slice(i + 1).map((b, j) => {
              const dx = (a.x - b.x) * 19.2;
              const dy = (a.y - b.y) * 10.8;
              const d = Math.hypot(dx, dy);
              if (d > 300) return null;
              const op = (1 - d / 300) * 0.22;
              return (
                <line key={`${i}-${j}`}
                  x1={a.x * 19.2} y1={a.y * 10.8}
                  x2={b.x * 19.2} y2={b.y * 10.8}
                  stroke={CYAN} strokeWidth={1} opacity={op} />
              );
            })
          )}
          {/* Nodes */}
          {pos.map((n, i) => {
            const pulse = 0.55 + 0.45 * Math.sin(t * 0.07 + n.ph);
            return (
              <circle key={i} cx={n.x * 19.2} cy={n.y * 10.8}
                r={n.r * (0.8 + pulse * 0.5)}
                fill={n.c} opacity={0.35 + pulse * 0.3} />
            );
          })}
        </svg>
      </div>

      {/* Drifting dust */}
      {DUST.map((d, i) => {
        const x = ((d.x + t * d.vx * 100) % 100 + 100) % 100;
        const y = ((d.y + t * d.vy * 100) % 100 + 100) % 100;
        const pulse = 0.4 + 0.6 * Math.sin(t * 0.06 + d.ph);
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: d.r, height: d.r, borderRadius: '50%',
            backgroundColor: hex(INK, 0.6), opacity: d.op * pulse,
          }} />
        );
      })}

      {/* Scanning sweep */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        left: `${((t * 0.05) % 1.6 - 0.3) * 100}%`,
        width: 260,
        background: `linear-gradient(90deg, transparent, ${hex(CYAN, 0.05)}, transparent)`,
        transform: 'skewX(-12deg)', pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 78% 78% at 50% 46%, transparent 38%, rgba(0,0,0,0.62) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

// ─── Drawing line with glow ───────────────────────────────────────────────────
const Rule: React.FC<{ p: number; width?: number; color?: string }> = ({
  p, width = 64, color = CYAN,
}) => (
  <div style={{
    width: p * width, height: 2,
    background: `linear-gradient(90deg, transparent, ${color} 30%, ${hex(color, 0.9)} 70%, transparent)`,
    boxShadow: `0 0 10px ${hex(color, 0.7)}`,
    borderRadius: 2,
  }} />
);

// ─── Mono eyebrow / kicker ────────────────────────────────────────────────────
const Kicker: React.FC<{ p: number; text: string; color?: string; align?: string }> = ({
  p, text, color = CYAN, align = 'left',
}) => (
  <div style={{
    opacity: p,
    transform: `translateY(${lerp(12, 0, easeOutExpo(p))}px)`,
    display: 'flex', alignItems: 'center', gap: 10,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
  }}>
    <span style={{
      width: 7, height: 7, borderRadius: 2, background: color,
      boxShadow: `0 0 12px ${color}`, transform: 'rotate(45deg)',
    }} />
    <span style={{
      fontFamily: MONO, fontSize: 14, letterSpacing: 4,
      textTransform: 'uppercase', color, fontWeight: 500,
    }}>
      {text}
    </span>
  </div>
);

// ─── Heading + body block (blur-in) ───────────────────────────────────────────
interface BlockProps {
  frame: number; baseAt: number; outAt: number;
  kicker?: string; heading: string; body?: string;
  accent?: string; accentColor?: string;
  headSize?: number; align?: 'left' | 'center'; color?: string;
}
const Block: React.FC<BlockProps> = ({
  frame, baseAt, outAt, kicker, heading, body,
  accent, accentColor = CYAN, headSize = 64, align = 'left', color = CYAN,
}) => {
  const kP = presence(frame, baseAt, baseAt + 22, outAt, outAt + 16);
  const rP = easeOutExpo(clamp(prog(frame, baseAt + 8, baseAt + 36)));
  const hP = presence(frame, baseAt + 16, baseAt + 42, outAt, outAt + 16);
  const bP = presence(frame, baseAt + 32, baseAt + 56, outAt, outAt + 16);

  const slide = (p: number) => ({
    opacity: p,
    transform: `translateY(${lerp(18, 0, easeOutExpo(p))}px)`,
    filter: `blur(${lerp(6, 0, easeOutExpo(p))}px)`,
  });

  const parts = accent ? heading.split(new RegExp(`(${accent})`, 'i')) : [heading];
  const aStyle: React.CSSProperties = align === 'center'
    ? { textAlign: 'center', alignItems: 'center' }
    : { textAlign: 'left', alignItems: 'flex-start' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...aStyle, gap: 0 }}>
      {kicker && <div style={{ marginBottom: 16 }}><Kicker p={kP} text={kicker} color={color} align={align} /></div>}
      {rP > 0.04 && <div style={{ marginBottom: 18 }}><Rule p={rP} width={align === 'center' ? 90 : 64} color={color} /></div>}
      <div style={{ ...slide(hP), marginBottom: body ? 20 : 0 }}>
        <h2 style={{
          fontFamily: SANS, fontSize: headSize, fontWeight: 800,
          lineHeight: 1.08, margin: 0, color: INK,
          letterSpacing: '-1.5px', maxWidth: 1100,
          textShadow: '0 4px 40px rgba(0,0,0,0.7)',
        }}>
          {parts.map((part, i) =>
            accent && part.toLowerCase() === accent.toLowerCase()
              ? <span key={i} style={{ color: accentColor, textShadow: `0 0 36px ${hex(accentColor, 0.5)}` }}>{part}</span>
              : <span key={i}>{part}</span>
          )}
        </h2>
      </div>
      {body && (
        <div style={slide(bP)}>
          <p style={{
            fontFamily: SANS, fontSize: 25, lineHeight: 1.6, margin: 0,
            color: hex(INK, 0.66), maxWidth: 760, fontWeight: 400,
          }}>
            {body}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Border-beam card (rotating gradient edge) ────────────────────────────────
const BeamCard: React.FC<{
  frame: number; showAt: number; outAt: number;
  color: string; children: React.ReactNode; spin: number;
}> = ({ frame, showAt, outAt, color, children, spin }) => {
  const p = presence(frame, showAt, showAt + 24, outAt, outAt + 16);
  const angle = (frame * 2.2 + spin) % 360;
  if (p <= 0) return null;
  return (
    <div style={{
      position: 'relative', borderRadius: 18, padding: 1.5,
      opacity: p,
      transform: `translateY(${lerp(26, 0, easeOutExpo(p))}px) scale(${lerp(0.94, 1, easeOutExpo(p))})`,
      background: `conic-gradient(from ${angle}deg, transparent 0deg, ${color} 50deg, transparent 120deg, transparent 360deg)`,
    }}>
      <div style={{
        borderRadius: 17, height: '100%',
        background: `linear-gradient(150deg, ${hex(BG2, 0.94)}, ${hex(BG, 0.96)})`,
        border: `1px solid ${hex(color, 0.16)}`,
        boxShadow: `0 0 30px ${hex(color, 0.08)}, inset 0 0 28px rgba(0,0,0,0.4)`,
      }}>
        {children}
      </div>
    </div>
  );
};

// ─── Lucide-inspired vertical icons (ISC) ─────────────────────────────────────
const Icon: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const c = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<string, React.ReactNode> = {
    ai: <><circle cx="12" cy="12" r="3" {...c} /><circle cx="5" cy="6" r="1.6" {...c} /><circle cx="19" cy="6" r="1.6" {...c} /><circle cx="5" cy="18" r="1.6" {...c} /><circle cx="19" cy="18" r="1.6" {...c} /><path d="M9.6 10.4 6.2 7M14.4 10.4 17.8 7M9.6 13.6 6.2 17M14.4 13.6 17.8 17" {...c} /></>,
    robot: <><rect x="5" y="8" width="14" height="11" rx="2.5" {...c} /><path d="M12 5v3M9 19v2M15 19v2" {...c} /><circle cx="9.5" cy="13" r="1.2" fill={color} stroke="none" /><circle cx="14.5" cy="13" r="1.2" fill={color} stroke="none" /><circle cx="12" cy="4" r="1.4" {...c} /></>,
    gear: <><circle cx="12" cy="12" r="3.2" {...c} /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" {...c} /></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" {...c} />,
    box: <><path d="M12 3 4 7v10l8 4 8-4V7z" {...c} /><path d="M4 7l8 4 8-4M12 11v10" {...c} /></>,
    wave: <><path d="M3 9c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" {...c} /><path d="M3 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" {...c} /></>,
    mobility: <><path d="M5 16l1.5-5h11L19 16" {...c} /><path d="M3.5 16h17" {...c} /><circle cx="7.5" cy="18.5" r="1.8" {...c} /><circle cx="16.5" cy="18.5" r="1.8" {...c} /></>,
    health: <path d="M3 12h4l2-5 3 10 2-5h7" {...c} />,
  };
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" style={{ display: 'block' }}>
      {paths[name]}
    </svg>
  );
};

// ─── Animated counter ─────────────────────────────────────────────────────────
const Counter: React.FC<{
  frame: number; showAt: number; outAt: number;
  value: number; suffix: string; label: string; sub: string; color: string; idx: number;
}> = ({ frame, showAt, outAt, value, suffix, label, sub, color, idx }) => {
  const p = presence(frame, showAt, showAt + 24, outAt, outAt + 16);
  const t = easeInOutCubic(clamp(prog(frame, showAt + 6, showAt + 6 + 70)));
  const val = Math.round(t * value);
  const glow = 0.6 + 0.4 * Math.sin(frame * 0.07 + idx * 1.6);
  if (p <= 0) return null;
  return (
    <div style={{
      textAlign: 'center', opacity: p,
      transform: `translateY(${lerp(34, 0, easeOutExpo(p))}px) scale(${lerp(0.9, 1, easeOutExpo(p))})`,
    }}>
      <div style={{
        fontFamily: SANS, fontSize: 96, fontWeight: 800, lineHeight: 1,
        color, letterSpacing: '-3px',
        textShadow: `0 0 ${24 + glow * 30}px ${hex(color, 0.55)}`,
      }}>
        {val}<span style={{ fontSize: 52, fontWeight: 700 }}>{suffix}</span>
      </div>
      <div style={{
        width: 46, height: 2, margin: '16px auto 14px',
        background: hex(color, 0.7), boxShadow: `0 0 8px ${color}`,
      }} />
      <div style={{ fontFamily: SANS, fontSize: 21, fontWeight: 600, color: INK }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 14, color: MUTED, marginTop: 6, letterSpacing: 1 }}>{sub}</div>
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const PILLARS = [
  { n: '01', t: 'Fellesskap',        d: 'Events, meetups & hackathons',        c: CYAN },
  { n: '02', t: 'Vertikaler',        d: '8 sektorer med industriledere',       c: LIME },
  { n: '03', t: 'Utdanning & talent', d: 'NTNU · Kristiania · HiØ',            c: VIOLET },
  { n: '04', t: 'Kapital',           d: 'DNB · Nordea · SpareBank 1',          c: GREEN },
  { n: '05', t: 'Fysiske rom',       d: 'WORKS, labs & co-working',            c: CYAN },
];

const VERTICALS = [
  { icon: 'ai',       t: 'AI',         d: 'Industriell intelligens', c: CYAN },
  { icon: 'robot',    t: 'Robotikk',   d: 'Autonome systemer',       c: LIME },
  { icon: 'gear',     t: 'Automasjon', d: 'Smart produksjon',        c: VIOLET },
  { icon: 'bolt',     t: 'Energi',     d: 'Fornybar & grønn',        c: GREEN },
  { icon: 'box',      t: 'Logistikk',  d: 'Smarte forsyningskjeder', c: CYAN },
  { icon: 'wave',     t: 'Maritim',    d: 'Autonome fartøy',         c: LIME },
  { icon: 'mobility', t: 'Mobilitet',  d: 'Elektrisk transport',     c: VIOLET },
  { icon: 'health',   t: 'Helse',      d: 'Medisinsk innovasjon',    c: GREEN },
];

const STATS = [
  { value: 100, suffix: '+', label: 'Charter-medlemmer', sub: 'grunnleggere', color: CYAN },
  { value: 95,  suffix: '+', label: 'Partnerbedrifter',  sub: 'i økosystemet', color: LIME },
  { value: 50,  suffix: '+', label: 'Startups i Moss',   sub: 'år 5–10',       color: VIOLET },
  { value: 10,  suffix: ' år', label: 'Veikart',         sub: 'til nordisk hub', color: GREEN },
];

const ROADMAP = [
  { p: 'År 1–2', t: 'Fundament',  d: '3 første vertikaler etableres',      c: CYAN },
  { p: 'År 3–5', t: 'Aktivering', d: 'Alle 8 vertikaler + universiteter',  c: LIME },
  { p: 'År 5–10', t: 'Skalering', d: 'Moss som nordisk teknologi-hub',     c: VIOLET },
];

const PARTNERS = ['1X Robotics', 'Kongsberg Gruppen', 'Multiconsult', 'NTNU', 'Høyskolen Kristiania', 'HiØ', 'DNB', 'Nordea', 'SpareBank 1', 'Microsoft', 'Google', 'OpenAI'];

// ─── Wordmark ─────────────────────────────────────────────────────────────────
const Wordmark: React.FC<{ size: number; p: number }> = ({ size, p }) => (
  <span style={{
    fontFamily: SANS, fontSize: size, fontWeight: 800, letterSpacing: '-2px',
    opacity: p,
  }}>
    <span style={{ color: INK }}>Moss</span>
    <span style={{
      background: `linear-gradient(120deg, ${CYAN}, ${LIME})`,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      filter: `drop-shadow(0 0 24px ${hex(CYAN, 0.45)})`,
    }}>Tech</span>
  </span>
);

// ─── Section shell ────────────────────────────────────────────────────────────
const Section: React.FC<{
  frame: number; start: number; align?: string; pad?: string; children: React.ReactNode;
}> = ({ frame, start, align = 'flex-end', pad = '0 130px 120px', children }) => {
  const whoosh = lerp(7, 0, easeOutExpo(clamp(prog(frame, start, start + 28))));
  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column', justifyContent: align as React.CSSProperties['justifyContent'],
      padding: pad, filter: `blur(${whoosh}px)`, pointerEvents: 'none',
    }}>
      {children}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
export const MossTech: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = 1 + 0.04 * easeInOutCubic(clamp(prog(frame, 0, TOTAL)));
  const finalFade = 1 - easeInOutCubic(clamp(prog(frame, TOTAL - 22, TOTAL)));

  const inWin  = (s: number) => easeOutExpo(clamp(prog(frame, s, s + 22)));
  const outWin = (e: number) => 1 - easeInOutCubic(clamp(prog(frame, e - 26, e)));

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: 'hidden' }}>
      <TechBackground cam={cam} />

      {/* ═══ INTRO (0–150) ════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        opacity: Math.min(inWin(8), outWin(SS.VISION)),
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', width: 820, height: 460, borderRadius: '50%',
          background: `radial-gradient(ellipse, ${hex(CYAN, 0.10)} 0%, transparent 68%)`,
        }} />
        <div style={{ marginBottom: 22 }}>
          <Kicker p={inWin(12)} text="Moss · Norge · Oslofjorden" color={CYAN} align="center" />
        </div>
        <div style={{
          transform: `scale(${lerp(0.9, 1, easeOutBack(clamp(prog(frame, 22, 56))))})`,
          marginBottom: 24,
        }}>
          <Wordmark size={138} p={easeOutExpo(clamp(prog(frame, 22, 50)))} />
        </div>
        <div style={{ marginBottom: 26, opacity: easeOutExpo(clamp(prog(frame, 52, 78))) }}>
          <Rule p={easeOutExpo(clamp(prog(frame, 52, 78)))} width={150} color={CYAN} />
        </div>
        <div style={{
          opacity: presence(frame, 64, 90, 126, 148),
          transform: `translateY(${lerp(14, 0, easeOutExpo(clamp(prog(frame, 64, 90))))}px)`,
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: SANS, fontSize: 40, fontWeight: 700, color: INK, letterSpacing: '-1px',
          }}>
            Norges <span style={{ color: LIME }}>teknologiby</span>
          </span>
        </div>
      </AbsoluteFill>

      {/* ═══ VISION (150–340) ═════════════════════════════════════════════ */}
      <Section frame={frame} start={SS.VISION} align="center" pad="0 140px">
        <Block
          frame={frame} baseAt={SS.VISION + 18} outAt={SS.PILLARS - 28}
          kicker="Visjonen" color={CYAN} align="center" headSize={66}
          heading="Moss skal bli Norges mest spennende teknologiby"
          accent="teknologiby" accentColor={CYAN}
          body="Et økosystem der innovasjon skjer gjennom å bygge, teste og skalere ekte teknologi — ikke teori. Industriarven møter ny teknologi, 50 minutter fra Oslo."
        />
      </Section>

      {/* ═══ PILLARS (340–575) ════════════════════════════════════════════ */}
      <Section frame={frame} start={SS.PILLARS} align="center" pad="0 120px">
        <div style={{
          opacity: Math.min(inWin(SS.PILLARS + 6), outWin(SS.VERTICALS)),
          marginBottom: 44, textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <Kicker p={presence(frame, SS.PILLARS + 6, SS.PILLARS + 28, SS.VERTICALS - 26, SS.VERTICALS)} text="Hvordan vi bygger" color={LIME} align="center" />
          <h2 style={{
            fontFamily: SANS, fontSize: 54, fontWeight: 800, color: INK,
            margin: '16px 0 0', letterSpacing: '-1.5px',
          }}>
            Fem søyler holder byen oppe
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 22, justifyContent: 'center' }}>
          {PILLARS.map((p, i) => (
            <BeamCard key={i} frame={frame}
              showAt={SS.PILLARS + 40 + i * 12}
              outAt={SS.VERTICALS - 26}
              color={p.c} spin={i * 60}>
              <div style={{ width: 232, height: 230, padding: '30px 26px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: MONO, fontSize: 15, color: p.c, letterSpacing: 2, fontWeight: 600 }}>{p.n}</span>
                <div style={{ flex: 1 }} />
                <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 700, color: INK, marginBottom: 10, letterSpacing: '-0.5px' }}>{p.t}</div>
                <div style={{ fontFamily: SANS, fontSize: 16, color: hex(INK, 0.6), lineHeight: 1.45 }}>{p.d}</div>
              </div>
            </BeamCard>
          ))}
        </div>
      </Section>

      {/* ═══ VERTICALS (575–835) ══════════════════════════════════════════ */}
      <Section frame={frame} start={SS.VERTICALS} align="center" pad="0 120px">
        <div style={{
          opacity: Math.min(inWin(SS.VERTICALS + 6), outWin(SS.STATS)),
          marginBottom: 40, textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <Kicker p={presence(frame, SS.VERTICALS + 6, SS.VERTICALS + 28, SS.STATS - 26, SS.STATS)} text="8 teknologi-vertikaler" color={VIOLET} align="center" />
          <h2 style={{
            fontFamily: SANS, fontSize: 54, fontWeight: 800, color: INK,
            margin: '16px 0 0', letterSpacing: '-1.5px',
          }}>
            Der framtiden bygges
          </h2>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          maxWidth: 1480, margin: '0 auto', width: '100%',
        }}>
          {VERTICALS.map((v, i) => {
            const p = presence(frame, SS.VERTICALS + 44 + i * 9, SS.VERTICALS + 70 + i * 9, SS.STATS - 26, SS.STATS);
            const glow = 0.5 + 0.5 * Math.sin(frame * 0.06 + i);
            if (p <= 0) return null;
            return (
              <div key={i} style={{
                opacity: p,
                transform: `translateY(${lerp(28, 0, easeOutExpo(p))}px) scale(${lerp(0.93, 1, easeOutExpo(p))})`,
                background: `linear-gradient(150deg, ${hex(BG2, 0.9)}, ${hex(BG, 0.95)})`,
                border: `1px solid ${hex(v.c, 0.2 + glow * 0.12)}`,
                borderRadius: 16, padding: '26px 24px',
                display: 'flex', flexDirection: 'column', gap: 14,
                boxShadow: `0 0 ${18 + glow * 14}px ${hex(v.c, 0.07)}`,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 13,
                  background: hex(v.c, 0.12), border: `1px solid ${hex(v.c, 0.3)}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={v.icon} color={v.c} />
                </div>
                <div style={{ fontFamily: SANS, fontSize: 25, fontWeight: 700, color: INK, letterSpacing: '-0.5px' }}>{v.t}</div>
                <div style={{ fontFamily: SANS, fontSize: 15, color: hex(INK, 0.58) }}>{v.d}</div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ STATS (835–1050) ═════════════════════════════════════════════ */}
      <Section frame={frame} start={SS.STATS} align="center" pad="0 120px">
        <div style={{
          opacity: Math.min(inWin(SS.STATS + 6), outWin(SS.ROADMAP)),
          marginBottom: 56, textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <Kicker p={presence(frame, SS.STATS + 6, SS.STATS + 28, SS.ROADMAP - 26, SS.ROADMAP)} text="Ambisjonen i tall" color={CYAN} align="center" />
          <h2 style={{
            fontFamily: SANS, fontSize: 54, fontWeight: 800, color: INK,
            margin: '16px 0 0', letterSpacing: '-1.5px',
          }}>
            Et tiår, én by, store mål
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 96, justifyContent: 'center' }}>
          {STATS.map((s, i) => (
            <Counter key={i} frame={frame}
              showAt={SS.STATS + 46 + i * 14}
              outAt={SS.ROADMAP - 26}
              value={s.value} suffix={s.suffix} label={s.label} sub={s.sub}
              color={s.color} idx={i} />
          ))}
        </div>
      </Section>

      {/* ═══ ROADMAP (1050–1200) ══════════════════════════════════════════ */}
      <Section frame={frame} start={SS.ROADMAP} align="center" pad="0 130px">
        <div style={{
          opacity: Math.min(inWin(SS.ROADMAP + 6), outWin(SS.CTA)),
          marginBottom: 48, textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <Kicker p={presence(frame, SS.ROADMAP + 6, SS.ROADMAP + 28, SS.CTA - 26, SS.CTA)} text="10-års veikart" color={LIME} align="center" />
        </div>
        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', alignItems: 'stretch', position: 'relative' }}>
          {ROADMAP.map((r, i) => {
            const p = presence(frame, SS.ROADMAP + 42 + i * 18, SS.ROADMAP + 70 + i * 18, SS.CTA - 26, SS.CTA);
            const lineP = easeOutExpo(clamp(prog(frame, SS.ROADMAP + 54 + i * 18, SS.ROADMAP + 90 + i * 18)));
            if (p <= 0) return null;
            return (
              <React.Fragment key={i}>
                <div style={{
                  width: 360, opacity: p,
                  transform: `translateY(${lerp(24, 0, easeOutExpo(p))}px)`,
                  textAlign: 'center', padding: '0 26px',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', margin: '0 auto 22px',
                    background: r.c, boxShadow: `0 0 18px ${r.c}`,
                    border: `3px solid ${hex(r.c, 0.25)}`,
                  }} />
                  <div style={{ fontFamily: MONO, fontSize: 17, color: r.c, letterSpacing: 2, marginBottom: 12, fontWeight: 600 }}>{r.p}</div>
                  <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 700, color: INK, marginBottom: 12, letterSpacing: '-0.5px' }}>{r.t}</div>
                  <div style={{ fontFamily: SANS, fontSize: 18, color: hex(INK, 0.62), lineHeight: 1.5 }}>{r.d}</div>
                </div>
                {i < ROADMAP.length - 1 && (
                  <div style={{
                    alignSelf: 'flex-start', marginTop: 8,
                    width: lineP * 70, height: 2,
                    background: `linear-gradient(90deg, ${r.c}, ${ROADMAP[i + 1].c})`,
                    boxShadow: `0 0 8px ${hex(r.c, 0.6)}`,
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Section>

      {/* ═══ CTA (1200–1350) ══════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        opacity: inWin(SS.CTA + 4),
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', width: 900, height: 500, borderRadius: '50%',
          background: `radial-gradient(ellipse, ${hex(CYAN, 0.10)} 0%, transparent 65%)`,
        }} />

        {/* Partner marquee strip */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 40,
          transform: 'translateY(-260px)', overflow: 'hidden',
          opacity: presence(frame, SS.CTA + 10, SS.CTA + 36, TOTAL - 22, TOTAL),
          maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        }}>
          <div style={{
            display: 'flex', gap: 40, whiteSpace: 'nowrap',
            transform: `translateX(${-((frame - SS.CTA) * 1.4 % 1600)}px)`,
          }}>
            {[...PARTNERS, ...PARTNERS].map((name, i) => (
              <span key={i} style={{ fontFamily: MONO, fontSize: 16, color: hex(INK, 0.42), letterSpacing: 1 }}>
                {name}<span style={{ color: hex(CYAN, 0.5), marginLeft: 40 }}>·</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{
          opacity: easeOutExpo(clamp(prog(frame, SS.CTA + 12, SS.CTA + 36))),
          transform: `translateY(${lerp(16, 0, easeOutExpo(clamp(prog(frame, SS.CTA + 12, SS.CTA + 36))))}px)`,
          textAlign: 'center', marginBottom: 18,
        }}>
          <span style={{ fontFamily: SANS, fontSize: 30, fontWeight: 500, color: hex(INK, 0.75), letterSpacing: '-0.5px' }}>
            Bli med å bygge
          </span>
        </div>
        <div style={{
          transform: `scale(${lerp(0.92, 1, easeOutBack(clamp(prog(frame, SS.CTA + 24, SS.CTA + 54))))})`,
          marginBottom: 30,
        }}>
          <Wordmark size={116} p={easeOutExpo(clamp(prog(frame, SS.CTA + 24, SS.CTA + 50)))} />
        </div>

        {/* Signer Charter button */}
        {presence(frame, SS.CTA + 50, SS.CTA + 78, TOTAL - 22, TOTAL) > 0 && (
          <div style={{
            opacity: presence(frame, SS.CTA + 50, SS.CTA + 78, TOTAL - 22, TOTAL),
            transform: `scale(${easeOutBack(clamp(prog(frame, SS.CTA + 50, SS.CTA + 76)))})`,
            position: 'relative', borderRadius: 50, overflow: 'hidden', marginBottom: 30,
          }}>
            <div style={{
              background: `linear-gradient(120deg, ${CYAN}, ${LIME})`,
              color: '#04110F', fontFamily: SANS, fontSize: 26, fontWeight: 800,
              padding: '20px 64px', borderRadius: 50, letterSpacing: '-0.3px',
              boxShadow: `0 0 44px ${hex(CYAN, 0.5)}, 0 0 90px ${hex(CYAN, 0.2)}`,
            }}>
              Signer Charter
            </div>
            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: ((frame * 2.6) % 150) - 40, width: 70,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
              transform: 'skewX(-20deg)',
            }} />
          </div>
        )}

        <div style={{
          opacity: presence(frame, SS.CTA + 76, SS.CTA + 100, TOTAL - 22, TOTAL),
          transform: `translateY(${lerp(12, 0, easeOutExpo(clamp(prog(frame, SS.CTA + 76, SS.CTA + 100))))}px)`,
          marginBottom: 12,
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: CYAN,
            textShadow: `0 0 20px ${hex(CYAN, 0.5)}`,
          }}>
            mosstech.city
          </span>
        </div>
        <div style={{
          opacity: presence(frame, SS.CTA + 96, SS.CTA + 118, TOTAL - 22, TOTAL),
        }}>
          <span style={{ fontFamily: SANS, fontSize: 16, color: MUTED, letterSpacing: 1 }}>
            Fra 10 000 kr · 100+ grunnleggere · 10-års veikart
          </span>
        </div>
      </AbsoluteFill>

      {/* Final fade */}
      <div style={{
        position: 'absolute', inset: 0, backgroundColor: '#000',
        opacity: 1 - finalFade, pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
