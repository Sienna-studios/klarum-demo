// Compares light-grade strengths on the squint view (full page, grayscale, 6 px blur): the plate must be quieter than
// the primary action. Quieter = the plate's largest local luminance contrast (95th percentile of |L - L blurred 40 px|)
// is below the contrast of the "Start the Business trial" button against its surround. Also reports the plate's
// peak red saturation against the button's (the red pips and CTA should stay the most saturated red) and its edge
// energy (a readability proxy for the bridge structure). The strengths are served as unencoded PNGs through route
// interception, so no AVIF encode is needed to compare them.
// Run: npm run photos:strength
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { CANDIDATES, CHOSEN, SLOTS } from "./photo-crops.mjs";
import { GRADES, gradeBuffer } from "./photo-grade.mjs";
import { ROOT, launch, main, newPage, outDir, scrollThrough, settle } from "./lib/review.mjs";

const WIDTHS = { mobile: [640, 960], desktop: [1440, 1920] };
const VARIANTS = (process.env.VARIANTS || "lightV1,lightA,lightB").split(",");
const TARGETS = [
  { key: "light-page", path: "/v2/c", theme: "native", button: ".m-hero a.m-btn" },
  { key: "dark-page-in-light", path: "/", theme: "light", button: "#hero a.btn-pri" },
];

async function pngs(params) {
  const out = {};
  for (const slot of Object.keys(SLOTS)) {
    const src = readFileSync(join(ROOT, "photos", `${SLOTS[slot].photo}.jpg`));
    for (const bp of ["mobile", "desktop"]) {
      const c = CANDIDATES[slot][bp].find((x) => x.id === CHOSEN[slot][bp]);
      for (const w of WIDTHS[bp].filter((x) => x <= c.w)) {
        const h = Math.round(w / SLOTS[slot][bp]);
        const { data } = await sharp(src).extract({ left: c.x, top: c.y, width: c.w, height: c.h }).resize(w, h, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
        out[`${slot}-light-${bp}-${w}`] = await sharp(gradeBuffer(data, params), { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
      }
    }
  }
  return out;
}

const pct = (arr, q) => { const s = Float32Array.from(arr).sort(); return s[Math.min(s.length - 1, Math.floor(s.length * q))]; };

main(async (base) => {
  const browser = await launch();
  const results = [];
  const dir = outDir("strength");
  for (const variant of VARIANTS) {
    const bufs = await pngs(GRADES[variant]);
    for (const t of TARGETS) {
      const stored = t.theme === "light" ? "light" : undefined;
      const { ctx, page } = await newPage(browser, { theme: t.theme, width: 1440, height: 900, reducedMotion: "reduce" });
      await ctx.route("**/photos/*-light-*", (route) => {
        const m = route.request().url().match(/photos\/([a-z]+-light-(?:mobile|desktop)-\d+)\./);
        return m && bufs[m[1]] ? route.fulfill({ status: 200, contentType: "image/png", body: bufs[m[1]] }) : route.continue();
      });
      await page.goto(base + t.path, { waitUntil: "load" });
      await settle(page); await scrollThrough(page);
      const rects = await page.evaluate((sel) => {
        const r = (e) => { const b = e.getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height }; };
        return { button: r(document.querySelector(sel)), plate: r(document.querySelector(".plate-img")) };
      }, t.button);
      const shot = await page.screenshot({ fullPage: true });
      await ctx.close();
      const W = 1440;
      const gray = await sharp(shot).grayscale().raw().toBuffer({ resolveWithObject: true });
      const squint = await sharp(shot).grayscale().blur(6).raw().toBuffer();
      const wide = await sharp(shot).grayscale().blur(20).raw().toBuffer(); // local mean at the scale of the plate's large forms
      const H = gray.info.height;
      const box = (r, pad = 0) => ({ x0: Math.max(0, Math.round(r.x - pad)), x1: Math.min(W, Math.round(r.x + r.w + pad)), y0: Math.max(0, Math.round(r.y - pad)), y1: Math.min(H, Math.round(r.y + r.h + pad)) });
      const inB = (b, x, y) => x >= b.x0 && x < b.x1 && y >= b.y0 && y < b.y1;
      const bb = box(rects.button), ann = box(rects.button, 24), pb = box(rects.plate, -8);
      let bs = 0, bn = 0, as = 0, an = 0;
      for (let y = ann.y0; y < ann.y1; y++) for (let x = ann.x0; x < ann.x1; x++) { const v = squint[y * W + x]; if (inB(bb, x, y)) { bs += v; bn++; } else { as += v; an++; } }
      const buttonContrast = Math.abs(bs / bn - as / an);
      const local = [], lum = [], edge = [];
      for (let y = pb.y0; y < pb.y1; y++) for (let x = pb.x0; x < pb.x1; x++) {
        local.push(Math.abs(squint[y * W + x] - wide[y * W + x])); lum.push(squint[y * W + x]);
        if (x + 1 < pb.x1 && y + 1 < pb.y1) edge.push(Math.abs(gray.data[y * W + x] - gray.data[y * W + x + 1]) + Math.abs(gray.data[y * W + x] - gray.data[(y + 1) * W + x]));
      }
      // saturation (HSV) in the unblurred screenshot
      const rgb = await sharp(shot).removeAlpha().raw().toBuffer();
      const sat = (b) => { const v = []; for (let y = b.y0; y < b.y1; y++) for (let x = b.x0; x < b.x1; x++) { const i = (y * W + x) * 3, mx = Math.max(rgb[i], rgb[i + 1], rgb[i + 2]), mn = Math.min(rgb[i], rgb[i + 1], rgb[i + 2]); if (mx > 90) v.push((mx - mn) / mx); } return v; };
      const buttonSat = sat(bb).reduce((a, b) => a + b, 0) / Math.max(1, sat(bb).length);
      const plateSat = pct(sat(pb), 0.999);
      const row = {
        variant, target: t.key,
        buttonContrast: +buttonContrast.toFixed(1),
        plateLocalContrastP95: +pct(local, 0.95).toFixed(1),
        plateLumRange: +(pct(lum, 0.95) - pct(lum, 0.05)).toFixed(1),
        plateEdgeEnergy: +(edge.reduce((a, b) => a + b, 0) / edge.length).toFixed(2),
        buttonSaturation: +buttonSat.toFixed(2), plateSaturationP999: +plateSat.toFixed(2),
      };
      row.quieterThanButton = row.plateLocalContrastP95 < row.buttonContrast;
      row.lessSaturatedThanButton = row.plateSaturationP999 < row.buttonSaturation;
      results.push(row);
      console.log(JSON.stringify(row));
      // the squint view of the stretch of page holding the plate and the hero button
      await sharp(squint, { raw: { width: W, height: H, channels: 1 } }).resize({ width: 720 }).png().toFile(join(dir, `${t.key}-${variant}-squint.png`));
    }
  }
  writeFileSync(join(dir, "strength.json"), JSON.stringify(results, null, 1));
  await browser.close();
});
