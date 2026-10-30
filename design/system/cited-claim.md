# Cited-claim chip

Moment 1 of 3. Source idea: `design/selects-ii/source/E2-Trace.dc.html` (Met state only). Component: `components/CitedClaim.tsx`. Styles: `.claim`, `.cite`, `.chip`, `.trace` in `app/globals.css`.

## Job on the page

Klarum's one promise is "every experience claim links to the page that proves it" (claims #1). The chip lets a bid manager open that proof without leaving the sentence. In bid documents this is the clause-reference habit: a requirement is answered by a statement, and the statement carries a reference (document, page). The chip is that reference, and the chain behind it is the audit trail an evaluator or a partner would ask for.

## Anatomy

Closed:

1. **Label** (`.lab`): "Draft EOI · sample".
2. **Draft sentence** (`blockquote.quote`): the claim, with a 1.5px `--red` rule on its left (the citation rule).
3. **Chip** (the `<summary>`): mono 11px caps, 1px `--red` border, `--redt` text, 4px radius. Reads `Met · Kenya Roads report, p. 47 · Sample`. A trailing "+" (a "–" when open) says it opens. The visible hit area is 44px tall; the chip itself is 26px, centred in it.

Open (the `<details>` panel, `.trace`, an ordered list of three nodes joined by arrows):

1. **Requirement** · "Vanuatu REOI" (real). The requirement text, then "Requirement source: <link>" to the original publication.
2. **Evidence** · "Sample document". Document name, "Page 47", the excerpt, tagged `[Sample excerpt]`. Its left rule is solid 2px `--red` (E2's "solid links, evidence rule"). A gap would be dashed and say "Missing"; that state is not built (Met only).
3. **In the draft**: the sentence again, in full, so the chain ends on the claim.

Arrows are `↓` on a phone and in the narrow workflow card, `→` when the panel is at least 720px wide. They are `aria-hidden`; the order is carried by the list (`<ol>`), whose items start with their step word.

## States

| State | What changes |
|---|---|
| Default (closed) | Chip as above, no fill. |
| Hover | Chip fills `--tile`; summary row takes no other change. |
| Focus-visible | 2px `--red` outline, 2px offset, around the whole summary (the 44px target). |
| Open | Chip fill `--tile`; the panel below fades in (opacity, `--t-fast`). The chip text does not change; open state is native to `<details>`. |
| Active (pressed) | Chip fill `--tile`, no translate. |
| Long text | Sentence and excerpt wrap; chip text wraps to two lines and the chip grows, 44px minimum kept. |
| Missing evidence | Not built. Never show a chip without evidence. |
| Reduced motion | `--t-fast` is 0s: the panel appears with no fade. |

Themes: both use the same tokens. `--red` for rules and borders, `--redt` for chip text (4.5:1 on its ground in each theme: `#ffb3aa` on `#0d0d10`/`#15161b`, `#c2261c` on `#f6f6f3`/`#fff`).

## Tokens

`--red`, `--redt`, `--tile`, `--ink`, `--body`, `--sub`, `--mute`, `--line`, `--surf`, `--bg`; `--fs-11`, `--fs-12`, `--fs-14`; `--s-4` to `--s-24`; `--r-ctl`, `--r-surf`; `--touch`; `--t-fast`. No new tokens.

## Accessibility

- Native `<details>/<summary>`. No JS, no `aria-*` on top. Enter and Space toggle; Tab reaches it.
- The summary's name is its visible text: "Met · Kenya Roads report, p. 47 · Sample". The word "Sample" is in the name, so the label is not visual only.
- "Met" is a word, not only a colour.
- Chip text 4.5:1 at 11px in both themes; target 44px.
- The `<ol>` gives a screen reader "list, 3 items" for the chain.

## Don'ts

- No cited chip without evidence behind it; no invented documents. The evidence is sample content and is labelled so (claims #9).
- No red anywhere else in the panel (links inside use `--redt` underline; the panel border is `--line`).
- No JS popover, no tooltip on hover, no animation but the opacity fade.
- Do not show Gap, Unmapped, Loading or Error states on the homepage. They stay in the E2 board.
