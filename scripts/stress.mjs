// Stress run: /?stress=1 swaps in a 120-character notice title and a notice with no deadline or buyer.
// Screenshots + axe + overflow / clip / overlap checks at 320, 390, 200% zoom (640x400 CSS px), reduced motion
// (1280) and each theme. Run: npm run review:stress
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import sharp from "sharp";
import { PAGES, launch, main, newPage, outDir, pageKeys, settle } from "./lib/review.mjs";

const CONFIGS = [
  { name: "320", width: 320, height: 640, mobile: true },
  { name: "390", width: 390, height: 844, mobile: true },
  { name: "zoom200", width: 640, height: 400, mobile: false }, // 1280x800 window at 200% = 640x400 CSS px
  { name: "reduced-motion", width: 1280, height: 800, mobile: false, reducedMotion: "reduce" },
];

/** Runs in the page. Returns overflow, clipping and overlap findings. */
function layoutChecks() {
  const vw = document.documentElement.clientWidth;
  const sel = (el) => {
    const nm = (e) => { const c = [...e.classList].slice(0, 2); return e.tagName.toLowerCase() + (e.id ? `#${e.id}` : c.length ? "." + c.join(".") : ""); };
    const p = el.parentElement;
    return p && p !== document.body ? `${nm(p)} > ${nm(el)}` : nm(el);
  };
  const text = (el) => (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
    if (el.closest("[role=tooltip], .sr, .skip, .m-skip, [aria-hidden=true]")) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const findings = { overflow: [], clip: [], overlap: [] };
  const sw = document.documentElement.scrollWidth;
  if (sw > vw + 1) findings.overflow.push({ what: `page scrolls horizontally: scrollWidth ${sw} > ${vw}` });

  const els = [...document.body.querySelectorAll("*")].filter(visible);
  for (const el of els) {
    const r = el.getBoundingClientRect();
    const scroller = el.closest("[style*=overflow], .tscroll, .table-wrap");
    let clippedByAncestor = false;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const o = getComputedStyle(a).overflowX;
      if (o !== "visible") { clippedByAncestor = true; break; }
    }
    if (!clippedByAncestor && !scroller && (r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== "fixed")
      findings.overflow.push({ selector: sel(el), text: text(el), right: Math.round(r.right), left: Math.round(r.left) });

    const cs = getComputedStyle(el);
    const hides = ["hidden", "clip"].includes(cs.overflowX) || ["hidden", "clip"].includes(cs.overflowY);
    if (hides && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1))
      findings.clip.push({ selector: sel(el), text: text(el), box: `${el.clientWidth}x${el.clientHeight}`, content: `${el.scrollWidth}x${el.scrollHeight}` });
    if (cs.textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth + 1)
      findings.clip.push({ selector: sel(el), text: text(el), box: `${el.clientWidth}`, content: `${el.scrollWidth}`, note: "ellipsis truncation" });
    if (cs.overflowX === "auto" || cs.overflowX === "scroll") {
      if (el.scrollWidth > el.clientWidth + 1) findings.clip.push({ selector: sel(el), text: text(el), box: `${el.clientWidth}`, content: `${el.scrollWidth}`, note: "inner horizontal scroll (not clipped, but content is cut off until scrolled)" });
    }
  }

  // overlap: boxes with their own text, plus controls and images, that intersect without one containing the other
  const boxes = els.filter((el) =>
    ["IMG", "SVG", "BUTTON", "INPUT"].includes(el.tagName.toUpperCase()) ||
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (w <= 2 || h <= 2) continue;
      if ((w * h) / Math.min(ra.width * ra.height, rb.width * rb.height) < 0.1) continue;
      const fixed = [a, b].some((e) => getComputedStyle(e).position === "fixed");
      findings.overlap.push({ a: sel(a), aText: text(a), b: sel(b), bText: text(b), area: `${Math.round(w)}x${Math.round(h)}`, fixed });
    }
  }
  return findings;
}

const dedupe = (arr) => { const seen = new Set(); return arr.filter((f) => { const k = JSON.stringify(f); if (seen.has(k)) return false; seen.add(k); return true; }); };

main(async (base) => {
  const browser = await launch();
  for (const key of pageKeys()) {
    const cfg = PAGES[key];
    const dir = outDir(key, "stress");
    const results = [];
    for (const theme of cfg.themes) {
      for (const c of CONFIGS) {
        const { ctx, page } = await newPage(browser, { theme, width: c.width, height: c.height, mobile: c.mobile, reducedMotion: c.reducedMotion });
        await page.goto(`${base}${cfg.path}?stress=1`, { waitUntil: "load" });
        await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
        await settle(page);
        const stressed = await page.evaluate(() => document.body.innerText.includes("(1/2)"));
        const findings = await page.evaluate(layoutChecks);
        const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
        const blocking = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        const shot = await page.screenshot({ fullPage: true });
        const name = `${theme}-${c.name}`;
        await sharp(shot).webp({ quality: 82 }).toFile(join(dir, `${name}.webp`));
        await ctx.close();
        results.push({
          config: name, stressActive: stressed,
          overflow: dedupe(findings.overflow).slice(0, 12),
          clip: dedupe(findings.clip).slice(0, 12),
          overlap: dedupe(findings.overlap).slice(0, 12),
          counts: { overflow: findings.overflow.length, clip: findings.clip.length, overlap: findings.overlap.length },
          axe: {
            blocking: blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 4).join(" | ")}`),
            other: axe.violations.filter((v) => !blocking.includes(v)).map((v) => `${v.id} (${v.impact}) x${v.nodes.length}`),
          },
        });
        console.log(`[stress] ${key} ${name}: overflow ${findings.overflow.length}, clip ${findings.clip.length}, overlap ${findings.overlap.length}, axe blocking ${blocking.length}${stressed ? "" : "  (STRESS NOT ACTIVE)"}`);
      }
    }
    writeFileSync(join(dir, "stress.json"), JSON.stringify({ page: `${cfg.path}?stress=1`, results }, null, 1));
  }
  await browser.close();
});
