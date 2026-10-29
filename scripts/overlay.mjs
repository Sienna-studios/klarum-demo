// Overlay: screenshots each page at 1440 px, pixel-diffs it (pixelmatch) against its Brief render and writes
// a side-by-side contact sheet (build | target | diff) for the first screen and the full page.
// Run: npm run review:overlay
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import sharp from "sharp";
import { PAGES, ROOT, launch, main, newPage, outDir, pageKeys, settle } from "./lib/review.mjs";

const W = 1440;
const FIRST = 900;
const PAD = { r: 128, g: 128, b: 128, alpha: 1 };

const raw = (img) => img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

/** Extends an image to a height with mid grey, so a height difference shows up in the diff. */
async function padTo(buf, h) {
  return sharp(buf).extend({ bottom: Math.max(0, h - (await sharp(buf).metadata()).height), background: PAD }).png().toBuffer();
}

async function sheet(cols, labels, file, scaleW) {
  const label = (t, w) =>
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="36"><rect width="100%" height="100%" fill="#222"/><text x="12" y="24" font-family="sans-serif" font-size="18" fill="#fff">${t}</text></svg>`);
  const imgs = await Promise.all(cols.map((c) => sharp(c).resize({ width: scaleW }).png().toBuffer()));
  const h = (await sharp(imgs[0]).metadata()).height;
  const gap = 8;
  const comp = [];
  imgs.forEach((b, i) => {
    comp.push({ input: label(labels[i], scaleW), left: i * (scaleW + gap), top: 0 });
    comp.push({ input: b, left: i * (scaleW + gap), top: 36 });
  });
  await sharp({ create: { width: imgs.length * scaleW + (imgs.length - 1) * gap, height: h + 36, channels: 3, background: "#000" } })
    .composite(comp).png().toFile(file);
}

async function compare(build, target, heightCap) {
  const h = Math.min(heightCap ?? Infinity, Math.max((await sharp(build).metadata()).height, (await sharp(target).metadata()).height));
  const crop = async (b) => sharp(await padTo(b, h)).extract({ left: 0, top: 0, width: W, height: h }).png().toBuffer();
  const [b, t] = [await crop(build), await crop(target)];
  const [rb, rt] = [await raw(sharp(b)), await raw(sharp(t))];
  const diff = Buffer.alloc(W * h * 4);
  const mismatched = pixelmatch(rb.data, rt.data, diff, W, h, { threshold: 0.1, includeAA: false, diffColor: [255, 0, 80], alpha: 0.25 });
  const diffPng = await sharp(diff, { raw: { width: W, height: h, channels: 4 } }).png().toBuffer();
  // per-band mismatch, to see where the structure parts company
  const bands = [];
  const bh = 400;
  for (let y = 0; y < h; y += bh) {
    const hh = Math.min(bh, h - y);
    const bandA = await sharp(rb.data, { raw: { width: W, height: h, channels: 4 } }).extract({ left: 0, top: y, width: W, height: hh }).raw().toBuffer();
    const bandB = await sharp(rt.data, { raw: { width: W, height: h, channels: 4 } }).extract({ left: 0, top: y, width: W, height: hh }).raw().toBuffer();
    const n = pixelmatch(bandA, bandB, null, W, hh, { threshold: 0.1, includeAA: false });
    bands.push({ y, mismatchPct: +((100 * n) / (W * hh)).toFixed(1) });
  }
  return { b, t, diffPng, mismatched, pct: +((100 * mismatched) / (W * h)).toFixed(1), height: h, bands };
}

main(async (base) => {
  const browser = await launch();
  for (const key of pageKeys()) {
    const cfg = PAGES[key];
    const dir = outDir(key, "overlay");
    const stats = { page: cfg.path, theme: cfg.primaryTheme, target: cfg.target };
    const variants = key === "light" ? ["native", "os-light"] : [cfg.primaryTheme];
    for (const theme of variants) {
      const { ctx, page } = await newPage(browser, { theme, width: W, height: FIRST, reducedMotion: "reduce" });
      await page.goto(base + cfg.path, { waitUntil: "load" });
      await settle(page);
      const build = await page.screenshot({ fullPage: true });
      await ctx.close();
      const targetPng = await sharp(join(ROOT, cfg.target)).png().toBuffer();
      const tm = await sharp(targetPng).metadata();
      const bm = await sharp(build).metadata();
      const full = await compare(build, targetPng);
      const first = await compare(build, targetPng, FIRST);
      const suffix = theme === cfg.primaryTheme ? "" : `-${theme}`;
      stats[theme] = { buildSize: [bm.width, bm.height], targetSize: [tm.width, tm.height], fullMismatchPct: full.pct, firstScreenMismatchPct: first.pct, bands: full.bands };
      if (theme !== cfg.primaryTheme) continue; // sheets for the primary variant only; the other gets numbers
      await sharp(build).png().toFile(join(dir, "build-full.png"));
      await sharp(full.diffPng).toFile(join(dir, "diff-full.png"));
      await sheet([full.b, full.t, full.diffPng], [`build ${cfg.path}`, "target (Brief)", "diff"], join(dir, "contact-full.png"), 720);
      await sheet([first.b, first.t, first.diffPng], [`build ${cfg.path}`, "target (Brief)", "diff"], join(dir, `contact-first-screen${suffix}.png`), 1440);
    }
    writeFileSync(join(dir, "overlay.json"), JSON.stringify(stats, null, 1));
    const s = stats[cfg.primaryTheme];
    console.log(`[overlay] ${key} ${cfg.path}: build ${s.buildSize.join("x")} vs target ${s.targetSize.join("x")}; mismatch ${s.firstScreenMismatchPct}% first screen, ${s.fullMismatchPct}% full`);
  }
  await browser.close();
});
