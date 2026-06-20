import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';

const BRAND = '#A03E1B';
const BG = '#FFFFFF';
const FONT_STACK =
  'Helvetica Neue, Helvetica, Arial, "Segoe UI", sans-serif';

const Mark: React.FC<{ height: number }> = ({ height }) => {
  // Wider than tall, like the favicon
  const h = height;
  const w = h * 1.7;
  const stroke = h * 0.09;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {/* Outer frame */}
      <rect
        x={stroke / 2}
        y={stroke / 2}
        width={w - stroke}
        height={h - stroke}
        rx={h * 0.04}
        ry={h * 0.04}
        fill="none"
        stroke={BRAND}
        strokeWidth={stroke}
      />
      {/* Letters inside the frame */}
      <text
        x={w / 2}
        y={h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_STACK}
        fontWeight={700}
        fontSize={h * 0.56}
        fill={BRAND}
        letterSpacing={h * 0.02}
      >
        SN
      </text>
    </svg>
  );
};

export const SkapnettLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Phase 1: SN mark pops in (0–25)
  const markScale = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 160, mass: 0.8 },
  });

  // Phase 2: wordmark reveals to the right of the mark (45–95)
  const reveal = interpolate(frame, [45, 95], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const wordOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Sizing: mark height drives everything
  const markH = Math.min(width, height) * 0.26;
  const wordSize = markH * 0.95;
  const gap = markH * 0.3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap,
        }}
      >
        <div
          style={{
            transform: `scale(${markScale})`,
            transformOrigin: 'center',
          }}
        >
          <Mark height={markH} />
        </div>

        <div
          style={{
            opacity: wordOpacity,
            clipPath: `inset(0 ${100 - reveal}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - reveal}% 0 0)`,
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 400,
              fontSize: wordSize,
              color: BRAND,
              letterSpacing: -wordSize * 0.02,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            skapnett
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
