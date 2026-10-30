// Grades the two kept photos as one riso set and encodes art-directed AVIF + WebP into public/photos/.
//   bridges (hero-background-poster.jpg) -> "plate", full-bleed between the workflow and the open notices
//   rail    (aerial-fields.jpg)          -> "cta", the closing call-to-action band
// Per slot: one crop per breakpoint (scripts/photo-crops.mjs CHOSEN), two grades, both baked here with sharp:
//   dark  : grayscale, duotone --bg -> --ink, --red ink layer multiplied over the top highlights
//   light : the inverse: duotone --ink -> --bg, --red ink layer screened over the darkest areas only
// (SP-Articles.dc.html does this with CSS blend modes; baking it means the browser ships one small image.)
// The scanline pass of that treatment stays CSS (.ph-riso::before), so it costs no bytes.
// Output: public/photos/<slot>-<grade>-<mobile|desktop>-<width>.{avif,webp} and lib/photos.json.
// Mobile files are capped at 120 KB (the 960 px file is what a 390 px phone at 2x downloads).
// Run: npm run photos
import { readFileSync, readdirSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { CANDIDATES, CHOSEN, SLOTS } from "./photo-crops.mjs";
import { GRADES as G, gradeBuffer } from "./photo-grade.mjs";
import { ROOT } from "./lib/review.mjs";

const WIDTHS = { mobile: [640, 960], desktop: [1440, 1920] };
const CAP_KB = { mobile: 110, desktop: 220 };
const SLOT_GRADES = { plate: ["dark", "light"], cta: ["dark", "light", "color"], hero: ["color"] };
const HERO_MOBILE_CAP_KB = 82; // the light hero photo is the LCP: at most 90 KB on mobile (the webp gets a 5% allowance) // quality search target on the largest file that bp serves most (960 / 1440); the hard cap is 120 KB on mobile
const SEARCH_W = { mobile: 960, desktop: 1440 };

// grade parameters live in scripts/photo-grade.mjs (LIGHT=lightA|lightB picks the light strength)
const PARAMS = { dark: G.dark, light: G[process.env.LIGHT || "lightA"], color: G.color };

const crop = (slot, bp) => {
  const c = CANDIDATES[slot][bp].find((x) => x.id === CHOSEN[slot][bp]);
  return { ...c, aspect: SLOTS[slot][bp] };
};

async function render(src, c, w, g) {
  const h = Math.round(w / c.aspect);
  const { data } = await sharp(src).extract({ left: c.x, top: c.y, width: c.w, height: c.h }).resize(w, h, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return sharp(gradeBuffer(data, PARAMS[g]), { raw: { width: w, height: h, channels: 3 } });
}

const enc = async (img, fmt, q) => (fmt === "avif" ? img.clone().avif({ quality: q, effort: 4 }) : img.clone().webp({ quality: q, effort: 6 })).toBuffer();

const GRADES = (process.env.GRADES || "dark,light,color").split(","); // GRADES=light re-bakes one grade and keeps the other's files
const outDir = join(ROOT, "public/photos");
mkdirSync(outDir, { recursive: true });
for (const f of readdirSync(outDir)) if (GRADES.some((g) => f.includes(`-${g}-`)) || !/^(plate|cta)-/.test(f)) rmSync(join(outDir, f)); // also drops the old ungraded derivatives, including the three dropped photos

const manifestFile = join(ROOT, "lib/photos.json");
const manifest = GRADES.length < 3 ? JSON.parse(readFileSync(manifestFile, "utf8")) : {};
for (const slot of Object.keys(SLOTS)) {
  if (!SLOT_GRADES[slot].some((g) => GRADES.includes(g))) continue;
  const src = readFileSync(join(ROOT, "photos", `${SLOTS[slot].photo}.jpg`));
  manifest[slot] ||= { crops: {}, kb: {} };
  for (const bp of ["mobile", "desktop"]) {
    const c = crop(slot, bp);
    const widths = WIDTHS[bp].filter((w) => w <= c.w);
    manifest[slot].crops[bp] = { widths, aspect: +c.aspect.toFixed(4), crop: { x: c.x, y: c.y, w: c.w, h: c.h }, focal: [c.fx, c.fy], id: c.id };
    for (const g of GRADES.filter((x) => SLOT_GRADES[slot].includes(x))) {
      const probe = await render(src, c, Math.min(SEARCH_W[bp], c.w), g);
      for (const fmt of ["avif", "webp"]) {
        let lo = 20, hi = 85, q = lo;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if ((await enc(probe, fmt, mid)).length / 1024 <= (slot === "hero" && bp === "mobile" ? HERO_MOBILE_CAP_KB : CAP_KB[bp]) * (fmt === "webp" ? 1.05 : 1)) { q = mid; lo = mid + 1; } else hi = mid - 1;
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
writeFileSync(manifestFile, JSON.stringify(manifest, null, 1) + "\n");
