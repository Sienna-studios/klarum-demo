# Klarum homepage: build spec

Extracted once from the "Klarum Design Brief" canvas (Home-Draft-Light/Dark, Tokens-*, C04) and "Klarum Design Selects" (P1-Footer) on 29 Oct 2026. Later sessions build from this file, `tokens.css`, `claims.md` and `notices.json` only. Do not reopen the canvases.

## Job of the page

For bid managers at infrastructure consultancies: start the Business trial, on the promise that Klarum turns their own project files into an expression of interest that meets the shortlisting criteria, with every claim traced to its source.

One primary action everywhere: **Start the Business trial** (`https://app.klarum.com`). Secondary: **See pricing** (`https://www.klarum.com/pricing`). Low-key third: **Or review one upcoming tender with us** (`https://www.klarum.com/contact#bookings`), plain text link, hero only.

## Direction

Night: near-black ground, Inter / Inter Tight / JetBrains Mono, Klarum red, the K mark as a shape, quiet 1px surfaces, no shadows (except the recommended plan ring). Dark by default, light via OS or `data-theme`. Personality comes from three components (below), which must stay prominent.

## K mark

Inline SVG, `fill="currentColor"`, colour `--red`:

```
<svg viewBox="0 0 700 518" aria-hidden="true"><path d="M18 14 L100 18 L182 190 L186 14 L330 14 L668 252 L670 268 L668 500 L320 500 L205 312 L198 500 L108 500 L18 262 Z"/></svg>
```

Used as: logo (24px tall, with "Klarum" in Inter Tight 700 24px, -.02em), cropped shape in workflow card tops, and a giant `--surf` shape behind the footer (bottom -260px, width min(1180px, 120%), aria-hidden).

## Shared pieces

- `.lab`: JetBrains Mono 12 / 500, .08em, caps, `--mute`.
- Buttons: min-height 48, padding 0 24, radius 4, Inter 16 / 600. Primary: `--red` fill, `--btn-ink` text, hover brightness 1.08. Secondary: inset 1.5px `--ink` ring, hover inverts. Text link: 600, underline offset 4, min-height 44, hover `--redt`.
- Surface: `--surf`, 1px `--line`, radius 6.
- Section: padding `--section-y` 0, 1px `--line` top rule. Container max 1312, padding 0 `--gutter`.
- Dot field: `radial-gradient(var(--dot) 1.2px, transparent 1.3px)` on 14px steps over `--bg`.
- Grids: 3 cols gap 24; 2 cols gap 64. Single column at <=960.
- Breakpoints 960 and 760. At <=760: nav hides, 44px menu button shows, h1/h2 28px.

## Personality components (build these first, screenshot each)

### P1. Notice row (fit, hatched shortlist, revision tag)

Source: C04 Night row plus the two Print ideas the brief kept.

- Container: `--surf` card, radius 6, 1px `--line`, hairline between rows.
- Row grid: title block | fit | revision tag | shortlist button. Gap 8 20, padding 16 20.
- Title Inter 16 / 600 / 1.35. Meta in mono 11 caps .05em `--mute`, two lines: `type · category · buyer` then `Closes date`.
- Fit: five 12px squares, gap 4. Filled `--red` = fit; empty = 1.5px inset `--line`. Expose as text too: `aria-label="Fit 4 of 5"`.
- Shortlisted state: squares become hatched (`repeating-linear-gradient(-45deg, var(--red) 0 2px, transparent 2px 5px)` with 1.5px inset `--red`), row background `--tile`, title gets 2px red underline offset 6.
- Revision tag: 26px tall, padding 0 8, 1px `--red` border, mono 11 / 500, .1em caps, `--redt`, content `Rev C`. Hover or focus shows a 280px `--ink` popover with history (`A 20 Oct published · B 25 Oct clarification · C 1 Nov new drawings`), opacity/transform .16s. It must be a focusable `<button>` with the history in `aria-describedby`.
- Shortlist: `<button aria-pressed>`, min-height 44 (raised from 40), padding 0 14, radius 4, 1px `--off`, 13 / 600. Pressed: `--red` fill, `--btn-ink` text, label "Shortlisted".
- Compact variant (hero feed, workflow card): title 14 / 600, padding 12 16, pips 7px gap 3, no button.
- Phone: title and fit on row one, meta full width, tag and button on their own row.
- Data: `notices.json`. Revision history only where the source shows a real change; otherwise `Rev A` with "published" only.

### P2. Cited claim

The page's proof. A sentence from a draft EOI, with a chip that opens the source.

- Quote: 14 / 1.5, 1.5px `--red` left rule, padding-left 8.
- Chip: `<details>` whose `<summary>` is the chip: mono 11, .05em, padding 4 8, 1px `--red`, radius 4, `--redt`, min-height 44 hit area. Open state shows the source excerpt in a `--surf` panel: document title, page, the excerpt, link to the public source.
- Works with no JS. Uses the real REOI criterion from `notices.json` as the requirement and a clearly labelled sample reference as the evidence (see `claims.md`).

### P3. Title-block footer

Adapted from Print P1-Footer to Night tokens. Static signature, no motion.

- Footer: 1px `--line` top, giant K shape behind (see K mark), links grid 1.4fr 1fr 1fr 1fr gap 48 (2 cols <=960, 1 col <=760).
- Title block: a `<table aria-label="Sheet information">`, max-width 640, cells 1px `--line` (use `--off` in light for contrast), padding 8 12. Keys mono 10 to 11 caps .14em `--mute`; values 14 Inter, mono for codes.
- Cells: [Klarum mark, spans 2x2] | Sheet `A-101` | Rev `C` (in `--redt`) / Title `Home.` | Scale `1:1` / Office `Stockholm, Medborgarplatsen 25` (span 2) | Web `www.klarum.com` | Year `2026`.
- Footer links (real): Notices, Pricing, Integrations, Changelog / About, Articles, Contact, Research / Privacy, Terms, Security, Trust Center (all on www.klarum.com, see `claims.md`). Under the brand: "© 2026 Klarum Technologies AB".

## Sections, in order

1. **Header** (72px): K mark + Klarum | nav: Notices | right: theme toggle (`aria-label="Switch theme"`), "See pricing" secondary (44px). Phone: menu button.
2. **Hero** (min-height 640, dot field, no photo):
   - Left copy (max 620): `.lab` "For infrastructure bid teams"; H1; lead; actions: primary trial, "See pricing" text link; below them the review link.
   - Default copy (from the brief, already matches our belief; step 3 may replace it):
     - H1: "Turn your own project files into an expression of interest that meets the shortlisting criteria."
     - Lead: "Klarum finds open tenders that fit your similar assignments, then drafts the EOI. Every experience claim links to the page that proves it."
   - Right: a compact feed of the 3 notices from `notices.json` on a `--surf` card with fit pips (replaces the photo pins). Hide below 960 or stack under the copy.
3. **Proof strip**: `.lab` "Built and backed by people from" + names as text (KTH, AI Sweden, AWS, Google Maps, Apple, Svea Solar, Lyceum Technology). No logos until Klarum supplies them.
4. **Workflow** "From notice to award, in one place." Three surface cards with a cropped K mark top and a `.chiplab` number:
   - 01 Sourcing: "Every notice worth your time, in one feed." + compact notice rows (P1).
   - 02 Decision and drafting: "Go or no-go, then a draft cited to your own record." + the cited claim (P2).
   - 03 Lifecycle: "The bid does not end at submission." + stage squares (Sourced / Drafting / Submitted / Awarded). KPI values stay empty or are labelled "Sample".
5. **Coverage** (dot field): "Sources" heading per `claims.md` (no "thirty" unless confirmed); tile grid labelled with the source types that are confirmed.
6. **Where your documents go**: dashed `--off` box, 2 columns. Facts from `claims.md` (storage, parsing, training, certifications), each linked to `/legal#trust`.
7. **Pricing**: billing toggle (Monthly / Yearly, two months free); Free, Business (recommended ring), Partner, content per `claims.md`. Business CTA = trial; others = "See pricing".
8. **FAQ**: `<details>` list, + / – in red mono. Questions: free tier vs trial; how the trial works; seat billing; what Partner changes; which sources.
9. **Closing CTA**: "See it on your own pipeline." primary + secondary. Dot field, no photo.
10. **Footer**: P3.

## Budget and rules

- Before load, mobile, cold: <=410 KB, <=25 requests, zero requests to app.klarum.com, api.klarum.com or posthog.
- Fonts via `next/font`: Inter (variable) + JetBrains Mono 500. Inter Tight only if it fits the budget; otherwise Inter 800 with -.04em for display.
- No images above the fold. No video, no iframe.
- Motion: opacity and transform only, `--t-fast`; nothing under reduced motion.
- Contrast: 4.5:1 for all text including 11px labels. `--red` is never used for text on light (use `--redt`).
- Real `<a>`, `<button>`, `<details>`; visible focus ring 2px `--red` offset 2.
