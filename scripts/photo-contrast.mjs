// Contrast over photos: for every text element inside a photo slot (hero, card tops, closing CTA), renders the page with
// the text made transparent, reads the worst background pixel behind each text box, and computes the WCAG ratio against
// the text's colour. Fails below 4.5:1 (11 px labels included). axe cannot judge text over images, so this is the check.
// Run: npm run review:contrast
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { PAGES, launch, main, newPage, outDir, pageKeys, scrollThrough, settle } from "./lib/review.mjs";

const MIN = 4.5;
const VIEWS = [{ name: "1440", width: 1440, height: 900, mobile: false }, { name: "1024", width: 1024, height: 800, mobile: false }, { name: "390", width: 390, height: 844, mobile: true }];

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Text boxes inside photo slots, with their colour. */
const collect = () => {
  const out = [];
  for (const slot of document.querySelectorAll(".has-photo")) {
    for (const el of slot.querySelectorAll("*")) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const m = cs.color.match(/[\d.]+/g).map(Number);
      const nm = (e) => e.tagName.toLowerCase() + ([...e.classList][0] ? "." + [...e.classList][0] : "");
      out.push({
        sel: `${nm(slot)} ${nm(el)}`, text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 36), size: cs.fontSize,
        color: m.slice(0, 3), alpha: m[3] ?? 1,
        box: { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height },
      });
    }
  }
  return out;
};

main(async (base) => {
  const browser = await launch();
  let failed = false;
  for (const key of pageKeys()) {
    const cfg = PAGES[key];
    const results = [];
    for (const theme of cfg.themes) {
      for (const v of VIEWS) {
        const { ctx, page } = await newPage(browser, { theme, width: v.width, height: v.height, mobile: v.mobile, reducedMotion: "reduce" });
        await page.goto(base + cfg.path, { waitUntil: "load" });
        await settle(page);
        await scrollThrough(page);
        const boxes = await page.evaluate(collect);
        await page.addStyleTag({ content: "*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-decoration-color:transparent!important;caret-color:transparent!important}" });
        await page.waitForTimeout(150);
        const shot = await page.screenshot({ fullPage: true });
        await ctx.close();
        const { data, info } = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
        let worst = { ratio: Infinity };
        const rows = [];
        for (const b of boxes) {
          const x0 = Math.max(0, Math.floor(b.box.x)), x1 = Math.min(info.width, Math.ceil(b.box.x + b.box.w));
          const y0 = Math.max(0, Math.floor(b.box.y)), y1 = Math.min(info.height, Math.ceil(b.box.y + b.box.h));
          const L = [];
          for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) { const i = (y * info.width + x) * 3; L.push(lum(data[i], data[i + 1], data[i + 2])); }
          if (!L.length) continue;
          L.sort((p, q) => p - q);
          const tl = lum(...b.color);
          // worst case = the background pixel (0.5th / 99.5th percentile, to ignore single noisy pixels) nearest the text luminance
          const lo = L[Math.floor(L.length * 0.005)], hi = L[Math.min(L.length - 1, Math.floor(L.length * 0.995))];
          const r = Math.min(ratio(tl, lo), ratio(tl, hi), ratio(tl, L[L.length >> 1]));
          rows.push({ sel: b.sel, text: b.text, size: b.size, ratio: +r.toFixed(2) });
          if (r < worst.ratio) worst = { ratio: +r.toFixed(2), sel: b.sel, text: b.text, size: b.size };
        }
        const fails = rows.filter((r) => r.ratio < MIN);
        if (fails.length) failed = true;
        results.push({ theme, view: v.name, textBoxes: rows.length, worst: rows.length ? worst : null, failing: fails });
        console.log(`[contrast] ${key} ${theme} ${v.name}px: ${rows.length} text boxes in photo slots, worst ${rows.length ? worst.ratio + ":1 (" + worst.text + ")" : "n/a"}${fails.length ? `  FAIL x${fails.length}` : ""}`);
      }
    }
    writeFileSync(join(outDir(key, "contrast"), "photo-contrast.json"), JSON.stringify({ page: cfg.path, min: MIN, results }, null, 1));
  }
  if (failed) process.exitCode = 1;
});
