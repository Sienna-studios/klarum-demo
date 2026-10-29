// Token audit: walks the rendered DOM of each page and lists every computed font size, colour (text,
// background, border), spacing value (margin, padding, gap) and radius that is not in tokens.css.
// Output: token-audit.json + token-audit.md per page. Run: npm run review:audit
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PAGES, ROOT, launch, main, newPage, outDir, pageKeys, settle } from "./lib/review.mjs";

/** Parse tokens.css into per-theme custom-property maps (light layers over dark). */
function parseTokens() {
  const css = readFileSync(join(ROOT, "tokens.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const grab = (re) => {
    const m = css.match(re);
    const o = {};
    if (m) for (const d of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) o[d[1]] = d[2].trim();
    return o;
  };
  const dark = grab(/:root\s*\{([^}]*)\}/);
  const light = { ...dark, ...grab(/:root\[data-theme="light"\]\s*\{([^}]*)\}/) };
  const small = grab(/@media \(max-width: 760px\)\s*\{\s*:root\s*\{([^}]*)\}/);
  return { dark, light, small };
}

async function audit(page, tokens, theme) {
  const t = tokens[theme === "dark" ? "dark" : "light"];
  const colours = Object.entries(t)
    .filter(([k, v]) => /^(#|rgba?\()/.test(v) || k === "--scrim")
    .map(([k, v]) => (k === "--scrim" ? `rgb(${v})` : v));
  const sizes = Object.entries(t).filter(([k]) => /^--fs-/.test(k)).map(([, v]) => v);
  const space = Object.entries(t).filter(([k]) => /^--s-\d+/.test(k)).map(([, v]) => v);
  space.push(tokens.dark["--gutter"], tokens.small["--gutter"], tokens.dark["--section-y"], tokens.small["--section-y"]);
  const radii = Object.entries(t).filter(([k]) => /^--r-/.test(k)).map(([, v]) => v);

  return page.evaluate(({ colours, sizes, space, radii }) => {
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    const norm = (prop, v) => { probe.style[prop] = ""; probe.style[prop] = v; return getComputedStyle(probe)[prop]; };
    const okColour = new Set(colours.map((c) => norm("color", c)));
    okColour.add("rgba(0, 0, 0, 0)");
    const okSize = new Set(sizes.map((s) => norm("fontSize", s)));
    const okSpace = new Set(["0px", ...space.map((s) => norm("paddingLeft", s))]);
    const okRadius = new Set(["0px", ...radii.map((r) => norm("borderTopLeftRadius", r))]);
    probe.remove();

    // rules that declare margin auto, so computed centring margins are not reported as spacing
    const autoRules = [];
    for (const sheet of document.styleSheets) {
      let rules; try { rules = sheet.cssRules; } catch { continue; }
      const walk = (rs) => { for (const r of rs) { if (r.cssRules && !r.selectorText) walk(r.cssRules); else if (r.style && /auto/.test(r.style.margin + r.style.marginInline + r.style.marginLeft + r.style.marginRight)) autoRules.push(r.selectorText); } };
      walk(rules);
    }
    const isAuto = (el) => autoRules.some((s) => { try { return el.matches(s); } catch { return false; } });

    const sel = (el) => {
      const name = (e) => {
        let s = e.tagName.toLowerCase();
        if (e.id) return `${s}#${e.id}`;
        const cls = [...e.classList].slice(0, 2);
        return cls.length ? `${s}.${cls.join(".")}` : s;
      };
      const own = name(el);
      const p = el.parentElement;
      return p && p !== document.body ? `${name(p)} > ${own}` : own;
    };

    const found = new Map();
    const hit = (kind, value, el, prop) => {
      const key = `${kind}|${value}|${sel(el)}`;
      const f = found.get(key) || { kind, value, selector: sel(el), count: 0, props: new Set() };
      f.count++; f.props.add(prop); found.set(key, f);
    };

    const sides = ["Top", "Right", "Bottom", "Left"];
    for (const el of document.body.querySelectorAll("*")) {
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(el.tagName)) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none") continue;

      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (hasText) {
        if (!okSize.has(cs.fontSize)) hit("font-size", cs.fontSize, el, "font-size");
        if (!okColour.has(cs.color)) hit("text-colour", cs.color, el, "color");
      }
      if (!okColour.has(cs.backgroundColor)) hit("background", cs.backgroundColor, el, "background-color");
      for (const s of sides) {
        if (parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none" && !okColour.has(cs[`border${s}Color`]))
          hit("border-colour", cs[`border${s}Color`], el, `border-${s.toLowerCase()}-color`);
      }
      for (const corner of ["TopLeft", "TopRight", "BottomRight", "BottomLeft"]) {
        for (const v of cs[`border${corner}Radius`].split(" ")) {
          if (!okRadius.has(v)) hit("radius", v, el, "border-radius");
        }
      }
      const auto = isAuto(el);
      for (const s of sides) {
        const m = cs[`margin${s}`];
        if (!(auto && (s === "Left" || s === "Right")) && m !== "0px" && !okSpace.has(m) && !okSpace.has(m.replace("-", ""))) hit("spacing", m, el, `margin-${s.toLowerCase()}`);
        const p = cs[`padding${s}`];
        if (!okSpace.has(p)) hit("spacing", p, el, `padding-${s.toLowerCase()}`);
      }
      if (cs.display.includes("flex") || cs.display.includes("grid")) {
        for (const g of ["rowGap", "columnGap"]) {
          const v = cs[g];
          if (v !== "normal" && !okSpace.has(v)) hit("spacing", v, el, g === "rowGap" ? "row-gap" : "column-gap");
        }
      }
    }
    return [...found.values()].map((f) => ({ ...f, props: [...f.props] }));
  }, { colours, sizes, space, radii });
}

function summarise(items) {
  const byKind = {};
  for (const i of items) (byKind[i.kind] ||= { distinct: 0, uses: 0 }), (byKind[i.kind].distinct++, (byKind[i.kind].uses += i.count));
  const byValue = new Map();
  for (const i of items) {
    const k = `${i.kind} ${i.value}`;
    const v = byValue.get(k) || { kind: i.kind, value: i.value, uses: 0, selectors: [] };
    v.uses += i.count; v.selectors.push(i.selector); byValue.set(k, v);
  }
  const top = [...byValue.values()].sort((a, b) => b.uses - a.uses).slice(0, 10)
    .map((v) => ({ ...v, selectors: [...new Set(v.selectors)].slice(0, 3) }));
  return { distinctValues: byValue.size, distinctOffenders: items.length, uses: items.reduce((n, i) => n + i.count, 0), byKind, top };
}

main(async (base) => {
  const tokens = parseTokens();
  const browser = await launch();
  for (const key of pageKeys()) {
    const cfg = PAGES[key];
    const merged = new Map();
    for (const theme of cfg.themes) {
      for (const width of [1440, 390]) {
        const { ctx, page } = await newPage(browser, { theme, width, height: 900, reducedMotion: "reduce" });
        await page.goto(base + cfg.path, { waitUntil: "load" });
        await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
        await settle(page);
        for (const f of await audit(page, tokens, theme)) {
          const k = `${f.kind}|${f.value}|${f.selector}`;
          const m = merged.get(k) || { ...f, count: 0, themes: [], viewports: [] };
          m.count = Math.max(m.count, f.count);
          if (!m.themes.includes(theme)) m.themes.push(theme);
          if (!m.viewports.includes(width)) m.viewports.push(width);
          m.props = [...new Set([...m.props, ...f.props])];
          merged.set(k, m);
        }
        await ctx.close();
      }
    }
    const items = [...merged.values()].sort((a, b) => b.count - a.count);
    const summary = summarise(items);
    const dir = outDir(key);
    writeFileSync(join(dir, "token-audit.json"), JSON.stringify({ page: cfg.path, themes: cfg.themes, viewports: [1440, 390], summary, items }, null, 1));
    const md = [
      `# Token audit: ${cfg.path} (${cfg.themes.join(" + ")}; 1440 + 390 px)`,
      "",
      `${summary.distinctValues} distinct off-token values, ${summary.distinctOffenders} value/selector pairs, ${summary.uses} uses.`,
      "",
      "| Kind | Distinct values | Uses |", "|---|---|---|",
      ...Object.entries(summary.byKind).map(([k, v]) => `| ${k} | ${v.distinct} | ${v.uses} |`),
      "", "## Top offenders", "",
      ...summary.top.map((v) => `- **${v.kind} ${v.value}** x${v.uses}: ${v.selectors.join(", ")}`),
      "",
    ].join("\n");
    writeFileSync(join(dir, "token-audit.md"), md);
    console.log(`[token-audit] ${key} ${cfg.path}: ${summary.distinctValues} off-token values (${summary.uses} uses)`);
    for (const v of summary.top.slice(0, 3)) console.log(`   ${v.kind} ${v.value} x${v.uses} (${v.selectors[0]})`);
  }
  await browser.close();
});
