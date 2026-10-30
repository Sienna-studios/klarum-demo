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
