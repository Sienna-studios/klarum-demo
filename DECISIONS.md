# Decisions

## Step 1: which version

Both versions are kept. Nothing goes to `/archive`.

| Version | Route | Why | Overlay target |
|---|---|---|---|
| Dark | `/` | Matches the Brief's Night target. | `design/brief/renders/Home-Draft-Dark.webp` |
| Light | `/v2` (hero C, `/v2/c`) | Light alternative. | `design/brief/renders/Home-Draft-Light.webp` |

Both share `tokens.css` and the components, so a system fix applies to both. Heroes E, F and G stay reachable at `/v2/e`, `/v2/f` and `/v2/g` for now; `/v2` opens on C.

## Photos, art-direction step 1: what each photo says (29 Oct 2026)

Reader: a bid manager or BD lead at an engineering consultancy that bids design and supervision of roads, rail and bridges, often for development banks (see `notices.json`). A photo earns a place only if that reader would recognise it as their kind of work.

**The file names are misleading.** They are the live site's names, not the content. Use this table, not the names.

| File | What it actually shows | What it says to this reader | Decision |
|---|---|---|---|
| `hero-background-poster.jpg` (2560x1440) | A city river with several road and tram bridges, traffic crossing the nearest steel bridge, old town behind. Appears to be Prague. | Bridges and road crossings: civil works they design and supervise. The strongest match in the set. | **Keep.** Lead image: the full-bleed plate. |
| `aerial-fields.jpg` (2000x2000) | Not fields. A high-speed train leaving a rail yard, tracks and catenary, a city skyline behind. Appears to be Stockholm (X2000 train). Film-era look. | Rail: signalling, track and corridor work. A clear second subject. The dated colour gets fixed by the grade. | **Keep.** Second image: the CTA band. |
| `hangar.jpg` (2000x1333) | Not a hangar. An offshore oil platform at sea. | Oil and gas, not this buyer's roads, rail and bridges. It also sits badly next to the SDG messaging on the live site. | **Drop.** |
| `case-b.jpg` (1600x1056) | A wide-body aircraft under maintenance in a hangar. | Aviation maintenance. Says nothing about bidding for infrastructure work. | **Drop.** |
| `glass-facade.jpg` (2000x1320) | An abstract reflection in a glass office facade. | "Corporate office": the generic stock cliché this redesign is trying to get away from. | **Drop.** |

### Consequences for placement

- Only two photos fit the reader, so **photos do not go on the three workflow cards**: there aren't three relevant images, and repeating the two would look thin. The cards keep the K-mark crop. That also settles "photo or K, never both".
- **Plate:** `hero-background-poster` (bridges), full-bleed between the workflow section and the open notices. Caption in the footer's title-block style, generic, with no place names (the locations are not confirmed): "Plate 1 · River crossings · Sample image".
- **CTA band:** `aerial-fields` (rail), replacing `glass-facade`.
- **Hero:** no photo, so text stays the LCP.
- If Klarum supplies photos of customers' real projects later, those replace both.

### Provenance (from file metadata)

- No EXIF, author or licence data in any file (stripped).
- `aerial-fields.jpg` carries the comment "File written by Adobe Photoshop 5.2": a late-1990s scan, consistent with an older stock library.
- `hero-background-poster.jpg` carries "Lavc63.7.100": a frame pulled from the hero video with ffmpeg, so its licence is the video's licence.
- Licence unknown for all five. Andres to reverse-image-search the two kept photos and ask Klarum before the demo is shown publicly.

## Photos, art-direction steps 2 to 4: crops, grade, placement (29 Oct 2026)

Contact sheet: `screenshots/review/photos-crops.png` (3 candidates per slot per breakpoint, focal point marked, pick outlined). Regenerate with `npm run photos:crops`; candidate and chosen crops live in `scripts/photo-crops.mjs`.

### Crops

| Slot | Breakpoint | Pick | Why |
|---|---|---|---|
| Plate (bridges), 12:5 | Desktop | **A**: full span | The only crop that keeps all the crossings (steel bridge with tram, middle bridge, the stone arches behind) and the dark foliage that gives the bottom right a resting place. B drops the far bridges, so the plate stops being about crossings in the plural. C loses the tram. |
| Plate (bridges), 4:3 | 390 px | **C**: tight on tram and bridge deck | At 390 px the far bridges in A and B shrink to slivers. C shows the structure (piers, arches, deck, traffic) large enough to read, which is the point for a buyer who designs bridges. |
| CTA band (rail), 3:1 | Desktop | **B**: train upper body, road, tracks to the right | The text sits on the left and gets a scrim; the subject has to survive on the right. In B the train climbs to the upper right and the converging tracks fill the right half. In A the nose, the strongest element, would sit under the headline. |
| CTA band (rail), 1:1 | 390 px | **B**: tracks and train rear | The headline and buttons cover the left; the track convergence with signal masts sits on the right, which is the signalling and corridor subject the Step 1 note chose rail for. A and C put the nose behind the buttons. |

### Grade

Baked with `sharp` in `scripts/photos.mjs` (`npm run photos`), one set for both photos, after the riso treatment in `design/selects/source/SP-Articles.dc.html`: grayscale, contrast, duotone to the tokens, a `--red` ink layer.

- **Dark:** `--bg` to `--ink`, red multiplied over the highlights (coverage 0.92 g²). Highlights print red, shadows stay near black.
- **Light:** the inverse, `--ink` to `--bg`, red screened over the shadows. Coverage is 0.6 (1-g)^1.8, lighter than a straight port (0.9, 1.3): at that strength a 1440 px plate is a solid red slab and swamps the page. The tuning sheet compared four strengths.
- The scanline pass (3 px clear, 2 px at 60% of the page ground) stays in CSS (`.ph-riso::before`), so it costs no bytes and follows the theme.
- `/` follows its theme toggle (data-theme, else the OS) and swaps grade when it changes; `/v2` is always light.
- Output: `public/photos/<slot>-<dark|light>-<mobile|desktop>-<width>.{avif,webp}`, mobile at 640 and 960, desktop at 1440 and 1920, one `<picture>` per slot with the mobile crop media-matched at 760 px. Mobile files are all at most 115 KB. Everything old in `public/photos/` is deleted, including the derivatives of the three dropped photos.

### Placement

- **No hero photo.** Text stays the LCP and nothing loads above the fold.
- **Plate 1** (bridges): full-bleed, between the workflow and the open notices on both pages, caption "Plate 1 · River crossings · Sample image" in the footer title-block style. With photos on, `#notices` moves into its own section after the plate; with `?photos=0` it stays where it was, so the baseline is unchanged. No text sits on the plate, so it has no scrim.
- **CTA band** (rail): replaces glass-facade. A scrim only behind the text, fading out to the right.
- **Workflow cards:** no photos; they keep the K crop. (`/v2` has no card tops.)
- All photos load through an IntersectionObserver, alt="".

## Photos: grade revision, and merge (30 Oct 2026)

Changes after the first review of the graded set. Merged into `claude/tender-babbage-km4d1v` once every check was green.

- **Dark grade:** red limited to the top highlights, about 0.7x the previous coverage (0.92 g^3.1, was 0.92 g^2), so the red fit squares and the CTA stay the most saturated red on the page.
- **Light grade:** red only in the darkest areas, about a third of the previous coverage (strength A: 0.24 (1-g)^3, was 0.6 (1-g)^1.8). Two strengths were baked and compared on the squint view (`npm run photos:strength`, results in `screenshots/review/photos-strength/`). The test: the plate's largest local luminance contrast must be below the contrast of the primary "Start the Business trial" button against its surround. Both passed by a wide margin (plate 36 and 37, button 106). A was kept: it is the one at a third of the coverage that was asked for, it is the quieter of the two, and the bridge structure is clearer than before (edge energy 30 to 37). Peak red saturation in the plate fell from 0.57 to 0.13, against 0.77 for the button.
- **Light scanlines:** 3 px clear, 1 px at 35% (was 2 px at 60%). They follow the grade (`data-grade` on the photo), so the dark pass is unchanged.
- **`/v2` hero switcher:** hidden unless `?dev=1`.
- **Judge** (fresh Opus, plate current vs revised, unlabelled): the revision won on both pages. Dark: slightly lighter red keeps the girders, tram and cars clearer and competes less with the CTA. Light: the revision's near-neutral plate keeps the arches, tram and cars crisp on desktop and phone, where the previous one was a full-width red band, the biggest red mass on the page.
- **Checks, photos on** (`screenshots/review/rev-on/`): mobile LCP 1710 ms (dark) and 2027 ms (light), budget passes, 226 and 228 KB before load, axe clean, text over the photos at least 4.66:1. **Photos off** (`rev-off/`): LCP 1740 ms and 2435 ms, same weights. Lighthouse in this container varies by several hundred ms between runs, so a single run near 2.5 s is not a verdict.

## Light page: hero C rebuilt after PD6-HatchMosaic (30 Oct 2026, branch `light-mosaic`, not merged)

**One hero.** The light page is hero C only. Heroes E, F and G, the field graphics and the hero switcher are deleted. `/v2` renders C directly; `/v2/c`, `/v2/e`, `/v2/f` and `/v2/g` redirect to `/v2` (307, query kept, so `?photos=0` and `?stress=1` survive).

**Content is unchanged.** Eyebrow, H1, lead, "Start the Business trial", "See pricing", the trial note, "Or review one upcoming tender with us" and the "Open notices · Sample fit" card with its three notices and fit squares, word for word. Copy left, notice card right, top-aligned, in the old hero C's 1.05fr / 0.95fr columns.

**Layout (second revision).** `components/v2/HeroMosaic.tsx`, `lib/mosaic.ts`, `.mh-*` in `app/v2/minimal.css`:
- **Photo:** `hero-background-poster` in full colour, full-bleed behind the whole hero, cropped as a wide strip so the steel bridge, tram and traffic sit in the top 240 px, above the panel. Desktop is one 1920 px file (167 KB AVIF; the strip is drawn about 2090 px wide at any viewport, so no smaller size is ever picked); mobile is the tight bridge-deck crop, 81.7 KB AVIF and 83.2 KB WebP at 960 px. Preloaded with `fetchpriority="high"`, each preload with its own media condition.
- **Panel:** one off-white panel (`--surf`), square corners, snapped to a 40 px tile grid by CSS `round()` (left edge and width are multiples of 40 at any viewport), 1040 px wide at 1280. At 1280 x 800 the H1, lead, CTA, trial note, review link and all three notices are inside the first screen, with exactly 240 px of photo above the panel (`tests/v2.spec.ts` asserts this).
- **Tiles:** 40 px squares, only in the band above the panel, 48 in all, two thirds hatched (the shortlist hatch) and one third solid `--red`. Row 0 under the header is empty. They sit at the outer corners and above the tram's roofline, off the bridge deck, tram and traffic; three hatched tiles touch the panel's top edge above the notice card, so the hatched tiles read as the same shortlisted state as the card. There is no legend: it was tried at the band's bottom-left ("Fits your index · Shortlisted · Illustrative") and removed on review. Tiles are plain CSS grid cells, so they cost no image bytes. The three above the card cover a thin strip of the far railing: at that spot the road and rail run along the whole width of the band, so a tile touching the panel edge there cannot be fully clear of the bridge.
- **Header button:** outlined while the hero is in view, solid red after it scrolls out; the fill and the outline cross-fade (opacity only, 0 s under reduced motion). The header is now sticky so the change is visible.
- **Phone (390):** photo strip of the bridge deck with a few tiles along its top, then the copy, then the notice card. The primary button is inside the first screen.
- **Tokens:** font sizes and spacing from `tokens.css`; the audit shows 17 distinct off-token values against 20 before, none new.
- **Photography is split by page.** The bridges lead the light hero, so the light page has no bridges plate (the dark page keeps it). The light CTA keeps the rail photo, in full colour, with a light scrim behind the text only; on a phone its two buttons stack so all the text sits inside the scrim. The light page is photographic throughout, the dark page riso throughout.
- **`?photos=0`** on `/v2` drops both photographs and keeps the tiles on a flat ground.

**Checks** (`screenshots/review/light-mosaic/`, final run after the legend was removed, both pages): light `/v2` mobile LCP 2408 ms with the hero photo as the LCP element, budget passes, 311 KB and 12 requests before load (desktop is also under 410 KB), axe clean in all 8 stress configs, no overflow, text contrast at least 5.06:1, the v2 tests pass. Dark `/` unchanged: LCP 1725 ms, 227 KB, axe clean.

**Judge** (fresh Opus, unlabelled, at 1280 and 390; first screens, squint images and full pages; `screenshots/review/light-mosaic/compare/`): ranked the first mosaic version (photo left, panel right) first, the old `/v2/c` second and this revision last. On 5-second clarity, hierarchy and primary action it chose the old page (clean, nothing competing, a filled red header button); on credibility and personality it chose a photographic version. It marked this revision down because its outlined header button leaves only one filled trial button and because the photograph and tiles crowd the top of the screen; it did credit it for credibility on the phone. The header button was kept as specified (outlined, then solid), the main reason the judge ranked this version last on primary action. **Merged into `claude/tender-babbage-km4d1v` on 30 Oct 2026 at Andres's request, after he reviewed it.**

## Step 3: causes, three signature moments, a test page, a quieter page (30 Oct 2026, branch `claude/practical-thompson-rmdwin`)

**Branch note.** `photos` was already an ancestor of `claude/tender-babbage-km4d1v`, so nothing was merged. Work started from that branch's head and is pushed to the session's designated branch `claude/practical-thompson-rmdwin` (not to `tender-babbage`). Results: `screenshots/review/step3-before/` and `step3-after/`; census in each page folder (`census/`), script `scripts/census.mjs` (`npm run review:census`, also part of `npm run review`).

### Root causes fixed (the token audit now groups by source component file)

| Cause, at its source | Fix | Both / dark / light |
|---|---|---|
| `app/v2/minimal.css` overrode `--line` with `#e3e6e8`, an off-token colour used by 61 borders | Removed; `--line` is the light token `#d9dde0` | light |
| `NoticeFeed` row: 20 px padding and gap, 6 px fit gap, 2 px and 3 px gaps, 14 px button padding, 13 px button font | Mapped to `--s-24`, `--s-8`, `--s-4`, `--s-16`, `--fs-14` | both |
| `Footer` and `Plate` captions: `color-mix(--bg 85%)` fills (off-token colour) | Replaced by one caption system with no fill (see moment 3) | both |
| `globals.css`: 10 px logo and stage gaps, 18 px header button padding, 20 px plan-list indent and docs padding, 40 px hero gap | Mapped to `--s-8`, `--s-12`, `--s-16`, `--s-24`, `--s-32` | both |
| `minimal.css`: fluid gutter `clamp(16px, 5vw, 48px)` gave 19.5 px at 390; 128 px and 40 px section padding; 17, 20, 22, 40 px type | `--gutter`, `--section-y`, `--s-48`, `--s-32`, `--fs-18`, `--fs-24`, `--fs-48` | light |
| `card` workflow cards: `margin-top: auto` computed to 9.56 px | Fixed `--s-16` | dark |

**No new token was added.** (`.theme-dark` / `.theme-light` selectors were added to `tokens.css` so `/lab/states` can show both themes at once; no value changed. The token audit's parser reads them.)

Stress-mode causes, each fixed at its component:
- **Clipped card tops** (`.card-top`, 4 per page): the K crop itself, removed with the crops (step 4).
- **Clipped footer** (`footer.foot`, `overflow: hidden` around a K 260 px taller than the footer): the K is now sized to the footer box, and `overflow: hidden` is gone. The first version of this fix let the K ride up over the closing CTA band; Judge A caught it and `tests/smoke.spec.ts` now asserts the K stays inside the footer.
- **Title and meta overlap** (4 px, `.nrow-title` with negative margins): the title is a plain 44 px target, no negative margins.
- **Missing buyer or deadline** printed `Closes ·` with nothing after it: `metaLine` and `closesLine` drop the missing segment and its separator.

The `/v2` hero switcher was already deleted in the light-mosaic work, so there was nothing left to hide behind `?dev=1`.

### The three moments (specs first: `design/system/*.md`)

1. **Cited-claim chip** (`cited-claim.md`). Job: Klarum's one promise, "every claim links to the page that proves it", checked in one click. Draft sentence with a red rule, a chip `Met · Kenya Roads report, p. 47 · Sample` (a `<summary>`, no JS), opening to a three-step chain: requirement (real, Vanuatu REOI, linked), evidence (sample, page 47), draft. After E2-Trace, Met state only. The chip carries a `+`/`–` so it reads as openable (Judge B's note).
2. **Notice row system** (`notice-row.md`). Job: scan for fit, notice revisions, decide. Compact and full variants share one grammar. Fit squares; revision tag (a focusable button that opens an in-flow revision block, Escape closes); shortlist toggles the hatch on the fit squares, a row tint, and an ink-filled button reading "Shortlisted". Compact shows a tag only for notices past Rev A (all real data is Rev A, so the hero card carries none).
3. **Drawing-sheet language** (`drawing-sheet.md`). Job: tell a bid reader the page is made for their paperwork, and label every plate "Sample image". One `SheetCaption` (a `<dl>` title block) renders both the footer and the plate caption; a missing value shows an en dash.

`/lab/states` shows every state in both themes (dark left, light right); `?captions=0` hides every caption. Playwright baselines at 390 and 1280: `tests/lab.spec.ts` (+ `tests/lab.spec.ts-snapshots/`). Keyboard-only interaction tests: `tests/moments.spec.ts`, run on `/` and `/v2`.

### Removed
- K crops on the workflow cards (the K remains as logo, footer wordmark and the footer shape); the K cell in the title block (now the word "Klarum").
- Dot fields (hero, sources, CTA), stage-list squares, the dashed-card decoration kept as a plain border.
- The `/v2` red tile band and `lib/mosaic.ts`. **Andres approved the tile hero on 30 Oct; this step removes it** because the tiles were decoration, not part of the three moments. Reversible from commit `00b08c5`.
- Red outside the four meanings: logo K and footer K now `--ink`; link hover, FAQ and plan marks, plan ring, billing toggle, skip link no longer red; the pressed shortlist button is `--ink`, not red (red fill is the primary action only).

### Light page LCP
Before: 2738 to 2765 ms (budget fail), the hero photo was the LCP element and 65% of it was render delay behind hydration. Image bytes, `decoding`, preload and a thinner strip each moved it by 100 ms or less. What worked: **on phones (<= 960 px) the photo strip now sits below the panel**, so the copy and the primary button come first and the h1 is the LCP element (2113 to 2127 ms). Desktop is unchanged; the mobile preload was dropped; mobile uses the 640 px crop (49 KB).

### Verdicts (fresh Opus judges)
- **Judge A** (before/after, unlabelled, first screens, squint and full pages): preferred the **old dark page** (the new one's closing band was broken by the K bug at that moment) and the **new light page** (on condition the same bug was fixed). The final build was not re-judged, only checked by eye on the closing bands and by the new footer test. Scores, hierarchy / deliberate / primary action: dark old 7/6/8 (it carried the red card K crops) vs new 7/5/7 on a first build that had the K-over-CTA bug; light old 6/4/7 (red pixel tiles) vs new 8/6/8. After its finding the K bug was fixed and the header "See pricing" became a text link. **The squint test does not pass on any version**: the headline outweighs the signature elements, the fit squares barely survive the blur, and on the light desktop page the hero photo survives too. That is recorded as unmet, not reworded.
- **Judge B** (only `/lab/states`, no captions; the first run was discarded because my capture was unstyled): explained the chip (a draft sentence backed by a source, opening to requirement, evidence, draft), the notice rows (a tender with fit, revision and a shortlist) and the sheet grids (drawing title block / figure caption) correctly. Revisions made: chip now says it opens; shortlisted button says "Shortlisted"; compact "REV C" no longer wraps; plate caption and title block share a width; the last title-block cell fills its row on a phone. Its remaining doubts: the grids read as brand flavour more than task meaning, and there is no "not met" state (Met only, by the brief).

### Deviations from the Brief
- **Both:** revision history opens on click or key, not on hover or focus (touch-safe, cannot be clipped). Shortlist button, 44 px, pressed state is ink, not red.
- **Both:** logo K and footer K are ink, not red (red only for four meanings). Focus rings stay red as a state, not a meaning.
- **Both:** the title block has no K cell; the notice-row compact variant shows no tag for Rev A.
- **Dark:** none beyond the above. **Light:** hero tile band removed; on phones the photo strip is below the panel.

### Numbers (before then after; mobile LCP is the Lighthouse median of 3)
| | Off-token | Stress clip / overlap | LCP | KB before load | Red elements (off-meaning) | Decorative |
|---|---|---|---|---|---|---|
| Dark `/` | 12 then 0 | 4 / 3 then 0 / 0 | 2371 then 1809 ms | 226.5 then 227.1 | 64 (18) then 47 (0) | 16 then 5 |
| Light `/v2` | 17 then 0 | 2 / 3 then 0 / 0 | 2738 then 2116 ms | 311.1 then 277.6 | 101 (66) then 36 (0) | 6 then 5 |

Axe: clean in all 16 stress configs and the Playwright axe specs. Photo contrast worst 5.06:1. Budget passes on both. Lighthouse in this container moves by several hundred ms between runs (dark was 1719 to 2371 ms with identical code).
