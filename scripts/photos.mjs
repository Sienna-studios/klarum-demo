// Grades the two kept photos as one riso set and encodes art-directed AVIF + WebP into public/photos/.
//   bridges (hero-background-poster.jpg) -> "plate", full-bleed between the workflow and the open notices
//   rail    (aerial-fields.jpg)          -> "cta", the closing call-to-action band
// Per slot: one crop per breakpoint (scripts/photo-crops.mjs CHOSEN), two grades, both baked here with sharp:
//   dark  : grayscale, duotone --bg -> --ink, --red ink layer multiplied over the highlights
//   light : the inverse: duotone --ink -> --bg, --red ink layer screened over the shadows
// (SP-Articles.dc.html does this with CSS blend modes; baking it means the browser ships one small image.)
// The scanline pass of that treatment stays CSS (.ph-riso::before), so it costs no bytes.
// Output: public/photos/<slot>-<grade>-<mobile|desktop>-<width>.{avif,webp} and lib/photos.json.
// Mobile files are capped at 120 KB (the 960 px file is what a 390 px phone at 2x downloads).
// Run: npm run photos
import { readFileSync, readdirSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { CANDIDATES, CHOSEN, SLOTS } from "./photo-crops.mjs";
import { ROOT } from "./lib/review.mjs";

const WIDTHS = { mobile: [640, 960], desktop: [1440, 1920] };
const CAP_KB = { mobile: 110, desktop: 220 }; // quality search target on the largest file that bp serves most (960 / 1440); the hard cap is 120 KB on mobile
const SEARCH_W = { mobile: 960, desktop: 1440 };

// tokens.css
const T = { bg: [13, 13, 16], ink: [255, 255, 255], red: [239, 65, 54], lightBg: [246, 246, 243], lightInk: [20, 32, 44] };
const clamp = (v) => Math.max(0, Math.min(1, v));
const mix = (a, b, t) => a + (b - a) * t;

/** Duotone grade on an RGB raw buffer. */
function grade(buf, grade) {
  const out = Buffer.alloc(buf.length);
  for (let i = 0; i < buf.length; i += 3) {
    const L = (0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2]) / 255;
    if (grade === "dark") {
      const g = clamp(((L - 0.5) * 1.45 + 0.5) * 1.05);
      const m = 0.92 * g * g; // red ink coverage, heaviest in the highlights
      for (let c = 0; c < 3; c++) {
        const base = mix(T.bg[c], T.ink[c], g);
        out[i + c] = Math.round(base * (1 - m + (m * T.red[c]) / 255)); // multiply
      }
    } else {
      const g = clamp(((L - 0.5) * 1.65 + 0.5) * 0.98);
      const m = 0.9 * Math.pow(1 - g, 1.3); // red ink coverage, heaviest in the shadows
      for (let c = 0; c < 3; c++) {
        const base = mix(T.lightInk[c], T.lightBg[c], g) / 255;
        out[i + c] = Math.round(255 * (1 - (1 - base) * (1 - (m * T.red[c]) / 255))); // screen
      }
    }
  }
  return out;
}

const crop = (slot, bp) => {
  const c = CANDIDATES[slot][bp].find((x) => x.id === CHOSEN[slot][bp]);
  return { ...c, aspect: SLOTS[slot][bp] };
};

async function render(src, c, w, g) {
  const h = Math.round(w / c.aspect);
  const { data } = await sharp(src).extract({ left: c.x, top: c.y, width: c.w, height: c.h }).resize(w, h, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return sharp(grade(data, g), { raw: { width: w, height: h, channels: 3 } });
}

const enc = async (img, fmt, q) => (fmt === "avif" ? img.clone().avif({ quality: q, effort: 4 }) : img.clone().webp({ quality: q, effort: 6 })).toBuffer();

const outDir = join(ROOT, "public/photos");
mkdirSync(outDir, { recursive: true });
for (const f of readdirSync(outDir)) rmSync(join(outDir, f)); // drops the old ungraded derivatives, including the three dropped photos

const manifest = {};
for (const slot of Object.keys(SLOTS)) {
  const src = readFileSync(join(ROOT, "photos", `${SLOTS[slot].photo}.jpg`));
  manifest[slot] = { crops: {}, kb: {} };
  for (const bp of ["mobile", "desktop"]) {
    const c = crop(slot, bp);
    const widths = WIDTHS[bp].filter((w) => w <= c.w);
    manifest[slot].crops[bp] = { widths, aspect: +c.aspect.toFixed(4), crop: { x: c.x, y: c.y, w: c.w, h: c.h }, focal: [c.fx, c.fy], id: c.id };
    for (const g of ["dark", "light"]) {
      const probe = await render(src, c, Math.min(SEARCH_W[bp], c.w), g);
      for (const fmt of ["avif", "webp"]) {
        let lo = 20, hi = 85, q = lo;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if ((await enc(probe, fmt, mid)).length / 1024 <= CAP_KB[bp] * (fmt === "webp" ? 1.05 : 1)) { q = mid; lo = mid + 1; } else hi = mid - 1;
        }
        for (const w of widths) {
          const buf = await enc(await render(src, c, w, g), fmt, q);
          writeFileSync(join(outDir, `${slot}-${g}-${bp}-${w}.${fmt}`), buf);
          manifest[slot].kb[`${g}-${bp}-${w}.${fmt}`] = +(buf.length / 1024).toFixed(1);
        }
      }
    }
  }
  console.log(slot, JSON.stringify(manifest[slot].kb));
}
writeFileSync(join(ROOT, "lib/photos.json"), JSON.stringify(manifest, null, 1) + "\n");
