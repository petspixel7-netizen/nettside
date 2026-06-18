// Damped harmonic oscillator: x(t) goes 0 -> 1 over time, governed by
// mass (m), stiffness (k), damping (c). zeta < 1 underdamped (bounces),
// zeta = 1 critically damped (fastest settle, no overshoot), zeta > 1 overdamped (sluggish).
export interface SpringConfig {
  mass?: number;
  stiffness?: number;
  damping?: number;
}

export const physicalSpring = (t: number, { mass = 1, stiffness = 100, damping = 10 }: SpringConfig): number => {
  if (t <= 0) return 0;
  const omega0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  if (zeta < 1) {
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega0 * t) *
      (Math.cos(omegaD * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(omegaD * t));
  }
  if (zeta === 1) {
    return 1 - Math.exp(-omega0 * t) * (1 + omega0 * t);
  }
  const omega1 = omega0 * Math.sqrt(zeta * zeta - 1);
  const r1 = -omega0 * zeta + omega1;
  const r2 = -omega0 * zeta - omega1;
  const B = r1 / (r1 - r2);
  const A = -r2 / (r1 - r2);
  return 1 - A * Math.exp(r1 * t) - B * Math.exp(r2 * t);
};

// Intuitive duration + bounce parametrization (bounce: 0 = no overshoot, ~0.3-0.6 = lively, close to 1 = very bouncy)
export const springFromDuration = (durationInSeconds: number, bounce = 0.2, mass = 1): SpringConfig => {
  const omega0 = (2 * Math.PI) / durationInSeconds;
  const stiffness = omega0 * omega0 * mass;
  const zeta = Math.max(0.05, 1 - bounce);
  const damping = 2 * zeta * Math.sqrt(stiffness * mass);
  return { mass, stiffness, damping };
};

export const springValue = (
  frame: number,
  fps: number,
  opts: { durationInSeconds?: number; bounce?: number; mass?: number; delayFrames?: number } = {}
): number => {
  const { durationInSeconds = 0.6, bounce = 0.2, mass = 1, delayFrames = 0 } = opts;
  const t = (frame - delayFrames) / fps;
  if (t <= 0) return 0;
  return physicalSpring(t, springFromDuration(durationInSeconds, bounce, mass));
};

export const springPresets = {
  gentle: { durationInSeconds: 0.7, bounce: 0 },
  snappy: { durationInSeconds: 0.35, bounce: 0.1 },
  bouncy: { durationInSeconds: 0.6, bounce: 0.55 },
  stiff: { durationInSeconds: 0.25, bounce: 0 },
} as const;
