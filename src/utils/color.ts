export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

// WCAG 2.x relative luminance + contrast ratio (1-21)
const srgbChannelToLin = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

export const relativeLuminance = ([r, g, b]: [number, number, number]) =>
  0.2126 * srgbChannelToLin(r) + 0.7152 * srgbChannelToLin(g) + 0.0722 * srgbChannelToLin(b);

export const wcagContrast = (hexA: string, hexB: string): number => {
  const lA = relativeLuminance(hexToRgb(hexA));
  const lB = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
};

// APCA (Advanced Perceptual Contrast Algorithm), simplified per APCA-W3 spec.
// Returns signed Lc in roughly [-108, 108]; magnitude >= 60 is the practical
// minimum for body text, >= 75 preferred for text that's also moving/animated.
const APCA = {
  normBG: 0.56, normTXT: 0.57, revBG: 0.65, revTXT: 0.62,
  blkThresh: 0.022, blkClamp: 1.414, scale: 1.14, loClip: 0.1, deltaYmin: 0.0005,
};

const apcaChannelToLin = (c: number) => Math.pow(c / 255, 2.4);

const apcaY = ([r, g, b]: [number, number, number]) => {
  const y = 0.2126729 * apcaChannelToLin(r) + 0.7151522 * apcaChannelToLin(g) + 0.0721750 * apcaChannelToLin(b);
  return y > APCA.blkThresh ? y : y + Math.pow(APCA.blkThresh - y, APCA.blkClamp);
};

export const apcaContrast = (textHex: string, bgHex: string): number => {
  const Ytxt = apcaY(hexToRgb(textHex));
  const Ybg = apcaY(hexToRgb(bgHex));
  if (Math.abs(Ybg - Ytxt) < APCA.deltaYmin) return 0;

  let Lc: number;
  if (Ybg > Ytxt) {
    // dark text on light bg
    Lc = (Math.pow(Ybg, APCA.normBG) - Math.pow(Ytxt, APCA.normTXT)) * APCA.scale;
  } else {
    // light text on dark bg
    Lc = (Math.pow(Ybg, APCA.revBG) - Math.pow(Ytxt, APCA.revTXT)) * APCA.scale;
  }
  return Math.abs(Lc) < APCA.loClip ? 0 : Lc * 100;
};

// Pick the most readable candidate text color against a background,
// preferring options that clear 75 Lc (safe for animated/moving text).
export const pickTextColor = (bgHex: string, candidates: string[]): string => {
  let best = candidates[0];
  let bestScore = -Infinity;
  for (const c of candidates) {
    const score = Math.abs(apcaContrast(c, bgHex));
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
};
