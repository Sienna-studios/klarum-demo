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
