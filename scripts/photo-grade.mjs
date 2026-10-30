// The riso grade, shared by scripts/photos.mjs (bakes AVIF/WebP) and scripts/photo-strength.mjs (compares strengths).
// tokens.css: --bg #0d0d10, --ink #fff, --red #ef4136; light page ground #f6f6f3, light ink #14202c.
const T = { bg: [13, 13, 16], ink: [255, 255, 255], red: [239, 65, 54], lightBg: [246, 246, 243], lightInk: [20, 32, 44] };
const clamp = (v) => Math.max(0, Math.min(1, v));
const mix = (a, b, t) => a + (b - a) * t;

/** Red ink coverage m = k * x^p, x = g (dark, highlights) or 1 - g (light, shadows). */
export const GRADES = {
  // round 1 (shipped on the photos branch): dark 0.92 g^2, light 0.6 (1-g)^1.8
  darkV1: { grade: "dark", k: 0.92, p: 2 },
  lightV1: { grade: "light", k: 0.6, p: 1.8 },
  // round 2: dark red limited to the top highlights; light red only in the darkest areas, two strengths
  dark: { grade: "dark", k: 0.92, p: 3.1 }, // 0.70x the mean red coverage of v1
  lightA: { grade: "light", k: 0.24, p: 3 }, // 0.33x
  lightB: { grade: "light", k: 0.14, p: 4 }, // 0.17x
  color: { grade: "color" },
};

export function gradeBuffer(buf, { grade, k, p }) {
  if (grade === "color") return buf; // the light page: photographs in full colour, no riso grade
  const out = Buffer.alloc(buf.length);
  for (let i = 0; i < buf.length; i += 3) {
    const L = (0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2]) / 255;
    if (grade === "dark") {
      const g = clamp(((L - 0.5) * 1.45 + 0.5) * 1.05);
      const m = k * Math.pow(g, p);
      for (let c = 0; c < 3; c++) out[i + c] = Math.round(mix(T.bg[c], T.ink[c], g) * (1 - m + (m * T.red[c]) / 255)); // multiply
    } else {
      const g = clamp(((L - 0.5) * 1.65 + 0.5) * 0.98);
      const m = k * Math.pow(1 - g, p);
      for (let c = 0; c < 3; c++) {
        const base = mix(T.lightInk[c], T.lightBg[c], g) / 255;
        out[i + c] = Math.round(255 * (1 - (1 - base) * (1 - (m * T.red[c]) / 255))); // screen
      }
    }
  }
  return out;
}

/** Mean red coverage over a raw RGB buffer, for calibrating a grade against another. */
export function meanCoverage(buf, { grade, k, p }) {
  let sum = 0;
  for (let i = 0; i < buf.length; i += 3) {
    const L = (0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2]) / 255;
    const g = grade === "dark" ? clamp(((L - 0.5) * 1.45 + 0.5) * 1.05) : clamp(((L - 0.5) * 1.65 + 0.5) * 0.98);
    sum += k * Math.pow(grade === "dark" ? g : 1 - g, p);
  }
  return sum / (buf.length / 3);
}
