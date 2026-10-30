// Census: per page, counts the elements whose computed colour, background, border or shadow is --red or --redt,
// grouped by what they mean, plus the decorative elements (aria-hidden SVGs and background shapes).
// Red is allowed for four meanings only: fit, revision, citation, primary action. Anything else is "other".
// Output: census.json + census.md per page in screenshots/review/<ROUND>/<page>/census/.
// Run: ROUND=step3-after npm run review:census
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { PAGES, launch, main, newPage, outDir, pageKeys, settle } from "./lib/review.mjs";

const MEANINGS = ["fit", "revision", "citation", "primary action", "other"];

/** Runs in the page. Selectors are the meaning map: what each red thing says to the reader. */
function census() {
  const hasRed = (v) => !!v && /(^|\D)(239, ?65, ?54|255, ?179, ?170|194, ?38, ?28)(\D|$)/.test(v);
  const rules = [
    ["fit", ".pip.on, .pips, .nrow.sl"],
    ["revision", ".rev, .rev-c, .rev-pop, .rev-hist"],
    ["citation", ".chip, .cite, .cite-panel, .claim, .quote, .trace, .trace *"],
    ["primary action", ".btn-pri, .m-btn, .shortlist[aria-pressed=true]"],
  ];
  const meaning = (el) => {
    for (const [m, sel] of rules) if (el.closest(sel)) return m;
    return "other";
  };
  const sel = (el) => {
    const nm = (e) => { const c = [...e.classList].slice(0, 2); return e.tagName.toLowerCase() + (e.id ? `#${e.id}` : c.length ? "." + c.join(".") : ""); };
    return nm(el);
  };

  const red = { total: 0, byMeaning: {}, other: {} };
  const deco = { total: 0, ariaHiddenSvg: 0, ariaHiddenOther: 0, backgroundShapes: 0, pseudoShapes: 0, samples: {} };
  const note = (k, el) => { deco.samples[k] ||= {}; deco.samples[k][sel(el)] = (deco.samples[k][sel(el)] || 0) + 1; };

  for (const el of document.body.querySelectorAll("*")) {
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SOURCE", "LINK", "PATH", "CIRCLE", "RECT"].includes(el.tagName.toUpperCase())) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none") continue;
    const r = el.getBoundingClientRect();
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (el.closest(".lab-page")) continue;
    const sides = ["Top", "Right", "Bottom", "Left"];
    const borderRed = sides.some((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none" && hasRed(cs[`border${s}Color`]));
    const redNow = (hasText && hasRed(cs.color)) || hasRed(cs.backgroundColor) || hasRed(cs.backgroundImage) || borderRed || hasRed(cs.boxShadow) || hasRed(cs.textDecorationColor) && cs.textDecorationLine !== "none";
    // pseudo-elements with their own red (underlines, ticks, etc.)
    let pseudoRed = false;
    for (const p of ["::before", "::after"]) {
      const ps = getComputedStyle(el, p);
      if (ps.content !== "none" && (hasRed(ps.backgroundColor) || hasRed(ps.backgroundImage) || hasRed(ps.color) && ps.content !== '""' || hasRed(ps.boxShadow))) pseudoRed = true;
    }
    if (redNow || pseudoRed) {
      const m = meaning(el);
      red.total++;
      red.byMeaning[m] = (red.byMeaning[m] || 0) + 1;
      if (m === "other") red.other[sel(el)] = (red.other[sel(el)] || 0) + 1;
    }

    // decoration
    const ah = el.closest("[aria-hidden=true]");
    const inPhoto = el.closest("picture, .ph, .plate-img, .mh-photo");
    if (el.tagName.toLowerCase() === "svg" && ah) { deco.ariaHiddenSvg++; deco.total++; note("ariaHiddenSvg", el); continue; }
    if (el.getAttribute("aria-hidden") === "true" && el.tagName.toLowerCase() !== "svg" && !inPhoto && !el.closest("svg")) { deco.ariaHiddenOther++; deco.total++; note("ariaHiddenOther", el); continue; }
    const bgImg = cs.backgroundImage;
    if (!ah && !inPhoto && bgImg && bgImg !== "none" && /gradient/.test(bgImg) && r.width > 0 && !hasText) { deco.backgroundShapes++; deco.total++; note("backgroundShapes", el); continue; }
    for (const p of ["::before", "::after"]) {
      const ps = getComputedStyle(el, p);
      if (ps.content !== "none" && ps.content === '""' && ps.display !== "none" && (ps.backgroundImage !== "none" || ps.backgroundColor !== "rgba(0, 0, 0, 0)") && !inPhoto && !el.classList.contains("ph") && !ah) {
        deco.pseudoShapes++; deco.total++; note("pseudoShapes", el);
      }
    }
  }
  return { red, deco };
}

main(async (base) => {
  const browser = await launch();
  for (const key of pageKeys()) {
    const cfg = PAGES[key];
    const dir = outDir(key, "census");
    const results = {};
    for (const theme of cfg.themes) {
      const { ctx, page } = await newPage(browser, { theme, width: 1280, height: 900, reducedMotion: "reduce" });
      await page.goto(base + cfg.path, { waitUntil: "load" });
      await settle(page);
      results[theme] = await page.evaluate(census);
      await ctx.close();
    }
    const primary = results[cfg.primaryTheme];
    writeFileSync(join(dir, "census.json"), JSON.stringify({ page: cfg.path, meanings: MEANINGS, primaryTheme: cfg.primaryTheme, results }, null, 1));
    const md = [`# Census: ${cfg.path} (1280 px, details closed)`, ""];
    for (const [theme, r] of Object.entries(results)) {
      md.push(`## ${theme}`, "", `Red or red-text elements: **${r.red.total}**`, "",
        "| Meaning | Elements |", "|---|---|", ...MEANINGS.map((m) => `| ${m} | ${r.red.byMeaning[m] || 0} |`), "",
        `Off-meaning red (should be 0): ${Object.entries(r.red.other).map(([k, v]) => `${k} x${v}`).join(", ") || "none"}`, "",
        `Decorative elements: **${r.deco.total}** (aria-hidden SVG ${r.deco.ariaHiddenSvg}, other aria-hidden ${r.deco.ariaHiddenOther}, gradient background shapes ${r.deco.backgroundShapes}, pseudo-element shapes ${r.deco.pseudoShapes})`, "",
        ...Object.entries(r.deco.samples).map(([k, v]) => `- ${k}: ${Object.entries(v).map(([s, n]) => `${s} x${n}`).join(", ")}`), "");
    }
    writeFileSync(join(dir, "census.md"), md.join("\n"));
    console.log(`[census] ${key} ${cfg.path} (${cfg.primaryTheme}): red ${primary.red.total} (${MEANINGS.map((m) => `${m} ${primary.red.byMeaning[m] || 0}`).join(", ")}); decorative ${primary.deco.total}`);
  }
  await browser.close();
});
