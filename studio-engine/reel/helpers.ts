// Pure string-building helpers used by every direction module.
// All functions return HTML-safe strings.

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Pull the first number-ish token out of a string (for big-num scenes). */
export function extractNumber(title: string): { num: string; rest: string } {
  const m = title.match(/\d[\d.,%×x+\-/ ]*\d|\d[%×x+]?/);
  if (m) {
    const num = m[0].trim();
    const rest = title.replace(m[0], "").trim();
    return { num, rest };
  }
  const first = title.split(/\s+/)[0] ?? title;
  return { num: first, rest: title.replace(first, "").trim() };
}

/** Split a body/title into list items on common separators. */
export function splitItems(s: string, max = 5): string[] {
  const items = (s || "")
    .split(/[\n,•·|/]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, max);
  return items;
}

/** Deterministic FNV-1a hash. */
export function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Map a seed to a deterministic value in [0,1). */
export function hash01(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function cycle<T>(list: readonly T[], i: number): T {
  return list[((i % list.length) + list.length) % list.length];
}

/** Safe CSS color or null. */
export function safeColor(value?: string | null): string | null {
  if (!value) return null;
  const v = value.trim();
  if (/^#[0-9a-f]{3,8}$/i.test(v)) return v;
  if (/^rgba?\([\d.,\s%]+\)$/i.test(v)) return v;
  if (/^hsla?\([\d.,\s%]+\)$/i.test(v)) return v;
  return null;
}

/** Relative luminance 0..1 for a #hex color (used to pick ink on a bg). */
export function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Pick black or white ink for readable contrast on a background hex. */
export function inkOn(bgHex: string): string {
  try {
    return luminance(bgHex) > 0.45 ? "#0b0b0b" : "#ffffff";
  } catch {
    return "#ffffff";
  }
}
