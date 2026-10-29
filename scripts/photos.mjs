// Re-encodes photos/*.jpg into public/photos/<name>-<width>.{avif,webp} and writes lib/photos.json.
// Widths 640, 960, 1440, 1920, never upscaled past the source. Quality is searched per photo so the 960 px
// file (what a 390 px phone at 2x downloads) lands under its budget: hero <= 90 KB, cards <= 120 KB.
// Run: npm run photos
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { ROOT } from "./lib/review.mjs";

const WIDTHS = [640, 960, 1440, 1920];
const BUDGET_KB = { "hero-background-poster": 60, "aerial-fields": 100, "case-b": 100, hangar: 100, "glass-facade": 100 }; // 960 px AVIF target; caps are 90 / 120
const out = join(ROOT, "public/photos");
mkdirSync(out, { recursive: true });

const encode = (src, w, fmt, q) =>
  sharp(src).resize({ width: w, withoutEnlargement: true })[fmt](fmt === "avif" ? { quality: q, effort: 6 } : { quality: q, effort: 6 }).toBuffer();

const manifestFile = join(ROOT, "lib/photos.json");
const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, "utf8")) : {};
const only = process.argv.slice(2); // npm run photos -- aerial-fields
for (const [name, kb] of Object.entries(BUDGET_KB)) {
  if (only.length && !only.includes(name)) continue;
  const src = readFileSync(join(ROOT, "photos", `${name}.jpg`));
  const meta = await sharp(src).metadata();
  const q = {};
  for (const fmt of ["avif", "webp"]) {
    let lo = 10, hi = 80, best = lo;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const size = (await encode(src, 960, fmt, mid)).length / 1024;
      if (size <= kb * (fmt === "webp" ? 1.25 : 1)) { best = mid; lo = mid + 1; } else hi = mid - 1;
    }
    q[fmt] = best;
  }
  const widths = WIDTHS.filter((w) => w <= meta.width);
  const sizes = {};
  for (const w of widths) for (const fmt of ["avif", "webp"]) {
    const buf = await encode(src, w, fmt, q[fmt]);
    writeFileSync(join(out, `${name}-${w}.${fmt}`), buf);
    sizes[`${w}.${fmt}`] = +(buf.length / 1024).toFixed(1);
  }
  manifest[name] = { width: meta.width, height: meta.height, widths, quality: q, kb: sizes };
  console.log(name, `q avif ${q.avif} webp ${q.webp}`, JSON.stringify(sizes));
}
writeFileSync(manifestFile, JSON.stringify(manifest, null, 1) + "\n");
