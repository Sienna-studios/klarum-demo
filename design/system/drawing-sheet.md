# Drawing-sheet language

Moment 3 of 3. Brief card: `design/brief/source/C14-Footer.dc.html` (Print title block) and the riso plates from `DECISIONS.md`. Component: `components/SheetCaption.tsx`; used by `components/Footer.tsx` and `components/Plate.tsx`. Styles: `.sheet` in `app/globals.css`.

## Job on the page

Klarum's reader lives in drawing sets and bid documents. A plate or a footer that is captioned like a drawing sheet tells them, before any copy, that this is made for their paperwork: every image has a number, a subject and a status, and the page itself has a sheet number and a revision. It also makes the photos honest: each plate says "Sample image".

## One caption system

A caption is a **title block**: a bordered grid of cells. Each cell is a key (mono 11px caps, `--mute`, .14em) over a value (Inter 14px, `--ink`). Cells share 1px `--off` borders. Nothing else: no fill, no shadow.

| Part | Footer | Plate |
|---|---|---|
| Mark cell (the word "Klarum", two rows tall) | yes | no |
| Cells | Sheet, Rev, Title, Scale, Office, Web, Year | Plate, Subject, Status |
| Revision cell | `Rev C`, value in `--redt` | none |
| Width | max 640px | max 640px, one row |

The same `<SheetCaption>` renders both: a `<dl>` of cells. Keys are `<dt>`, values `<dd>`.

## States

| State | What changes |
|---|---|
| Default | As above. |
| Hover, active | None: it is not interactive. |
| Focus-visible | Links inside a cell (e-mail, web) take the 2px red focus ring. |
| Long value | Wraps inside its cell; the grid row grows. The row never clips. |
| Missing value | The cell shows an en dash, never empty. |
| Phone (<=760) | Footer title block goes full width, mark cell on top; plate caption stacks to one column. |
| Both themes | Same tokens. |
| Reduced motion | Static in all cases. |

## Tokens

`--off`, `--mute`, `--ink`, `--redt`, `--bg`; `--fs-11`, `--fs-14`; `--s-8`, `--s-12`; `--r-bar` is not used (square corners, like paper). `--surf` for the footer K watermark; `--fs-24` and `--ls-wordmark` for the mark cell. No new tokens; the `color-mix(--bg 85%)` fill the old caption used is gone (it was an off-token colour).

## Accessibility

- Real `<dl>`, so a screen reader reads "Plate: 1; Subject: River crossings; Status: Sample image".
- The mark cell holds the word "Klarum" (not the K shape), so the title block adds no decoration.
- 11px keys are 4.5:1 on their ground in both themes (`--mute`).
- The giant footer K watermark is `aria-hidden` and sits inside the footer box (no clipped overflow).

## Don'ts

- No place names or dates on plates (locations are not confirmed; claims ledger).
- No red but the revision cell.
- No third caption style. A new image or sheet uses this one.
- Do not use the system for body copy; it is a caption.
