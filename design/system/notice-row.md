# Notice row system

Moment 2 of 3. Brief card: `design/brief/source/C04-NoticeRow.dc.html` (Night variant, with the Print revision tag and hatched fit squares, as the Brief's "Decide" section keeps both). Component: `components/NoticeFeed.tsx`, `components/Pips.tsx`. Styles: `.nrow`, `.pips`, `.rev`, `.shortlist`, `.rev-hist` in `app/globals.css`.

## Job on the page

A bid manager scans notices for two things: does this fit what we have built, and has it changed since we looked. Fit squares answer the first at a glance; the revision tag answers the second. Shortlisting is the decision they make. In bid documents a changed issue is marked by a revision tag (Rev A, B, C) and a revision block listing what changed and when. The tag and its history are that convention.

## Two variants, one grammar

| | Compact | Full |
|---|---|---|
| Where | Hero feed, workflow card | Open notices list |
| Whole row | One link to the original publication | Title is the link; the row holds two buttons |
| Fit squares | 7px, gap 4 | 12px, gap 4 |
| Revision tag | Static text tag, shown only when the notice is past Rev A | Button, always, opens the history |
| Shortlist | Display only (the state of a shortlisted notice) | Toggle button |
| Min row height | 44px | 72px |

## Anatomy (full)

Grid: title, fit, revision tag, shortlist button; second line: meta ("Type · Category · Buyer", "Closes · date").

1. **Title**: Inter 16/600, link. 44px target.
2. **Meta**: JetBrains Mono 11px caps, `--mute`. Missing buyer or deadline: that segment, and its separator, is dropped; the line never shows an empty slot.
3. **Fit squares**: five squares; filled = `--red`, empty = 1.5px `--line` outline. Image role, label "Fit 4 of 5, sample". "Sample fit" word beside them.
4. **Revision tag**: 26px tall, 1px `--red` border, `--redt` mono 11px caps, "Rev A". A real `<button>` with 44px hit area. Opens the **revision block** below the row: a two-column list, `Rev` then note ("A · published on TED"), mono 12px on `--surf`, hairline `--line` top rule, as a drawing-sheet revision table.
5. **Shortlist button**: 44px tall, 104px minimum width, 1px `--off` outline, Inter 600, `--fs-14` (was 13px).

## States

| State | Behaviour |
|---|---|
| Default | As above. |
| Hover | Title underlines (2px `--sub`); the tag fills `--tile`; shortlist outline goes `--ink`. |
| Focus-visible | 2px `--red` outline, 2px offset, on whichever of title, tag, button has focus. |
| Active / open | Revision tag `aria-expanded="true"`, filled `--tile`, block visible. Escape closes it and keeps focus on the tag. Only one block open per row. |
| Shortlisted | Button `aria-pressed="true"`: filled `--ink`, text `--bg`. Row takes `--tile`. Fit squares switch to the hatch: -45deg, 2px `--red`, 3px gap, outlined 1.5px `--red`. The title gets a 2px red underline. |
| 120-character title | Title wraps to as many lines as it needs; the fit and buttons stay top-aligned to the first line; no truncation. |
| Missing buyer and deadline | Meta shows only the type and category. No `Closes ·`, no dangling dot. |
| Compact, revised (Rev B or later) | Static tag after the title line. |
| Both themes | Same tokens; tint `--tile` is 18% red on dark, 12% on light. |
| Reduced motion | `--t-fast` is 0s: no fade on the block, no transform. |

## Tokens

`--red`, `--redt`, `--tile`, `--off`, `--line`, `--ink`, `--bg`, `--surf`, `--mute`, `--sub`; `--fs-11` to `--fs-16`; `--s-4` to `--s-24`; `--r-ctl`; `--touch`; `--t-fast`. Row padding 16 24 (was 20: mapped to the token).

## Accessibility

- Title link, tag button and shortlist button are separate tab stops, in reading order.
- Tag name: "Rev A: show revision history" (an `aria-label` that starts with the visible "Rev A", so the visible label is in the name). `aria-expanded`, `aria-controls` the block's id.
- Shortlist name: "Shortlist: <title>", with `aria-pressed`. Visible text stays "Shortlist" in both states, so the name always contains it. State is also in the hatch, tint and underline, not colour alone.
- Fit has an accessible label; the squares are not read one by one.
- 4.5:1 for every 11px label in both themes; 44px targets (the 26px tag keeps a 44px hit area).

## Don'ts

- No hover-only history. The block opens on click or key, so it works on touch.
- No tooltip role for the history: it is content in the flow, so it cannot be clipped or cover the next row.
- No made-up revisions. Real data is Rev A only (`notices.json`); multi-revision histories appear only in `/lab/states`, labelled sample.
- No red fill on the shortlist button: red fill belongs to the primary action.
- Do not truncate a long title with an ellipsis.
