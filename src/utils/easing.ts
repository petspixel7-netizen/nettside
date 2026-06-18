export const easeOutExpo = (t: number) =>
  t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutBack = (t: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const easeOutElastic = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export const clamp = (v: number, lo = 0, hi = 1) =>
  Math.min(hi, Math.max(lo, v));

export const prog = (frame: number, a: number, b: number) =>
  clamp((frame - a) / (b - a));

// Smooth presence: fade in [a→b], hold, fade out [c→d]
export const presence = (
  frame: number,
  inA: number, inB: number,
  outC: number, outD: number
): number => {
  if (frame < inA) return 0;
  if (frame < inB) return easeOutExpo(prog(frame, inA, inB));
  if (frame < outC) return 1;
  if (frame < outD) return 1 - easeInOutCubic(prog(frame, outC, outD));
  return 0;
};
