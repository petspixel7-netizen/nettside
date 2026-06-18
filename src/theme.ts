import { pickTextColor } from './utils/color';

export const theme = {
  bg: '#0D0D0D',
  gold: '#D4AF37',
  goldLight: '#F0D060',
  white: '#FFFFFF',
  gray: '#888888',
  font: 'sans-serif',
};

// Picks the most readable text color against a given background, checked
// with APCA (perceptual contrast) — use for text overlaid on photos/video
// where exact luminance isn't known ahead of time.
export const readableTextColor = (bgHex: string) =>
  pickTextColor(bgHex, [theme.white, theme.gold, theme.bg]);
