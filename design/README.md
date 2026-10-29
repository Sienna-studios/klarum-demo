# Design reference

Exported on 29 Oct 2026 from Andres's claude.ai design canvases, so cloud sessions can use them without canvas access. `source/` holds each artboard's original HTML (`.dc.html`); `renders/` holds a WebP of it, rendered with the real fonts.

Render caveats: photos, the hero field images and CSS-mask K shapes are missing (they were canvas uploads). Interactive boards show their markup without live values, so `{{…}}` slots are blank. For exact values, read the source HTML. The renders are for layout, hierarchy and feel.

## Priority, highest first

1. **`brief/` = the decision.** "Klarum Design Brief": Night direction chosen, two Print ideas kept (revision tags, hatched fit).
   - `Home-Draft-Light` / `Home-Draft-Dark`: the target homepage, section by section.
   - `C01`–`C14`: one spec card per component (left column = spec, right = Print and Night, light and dark, desktop and phone).
   - `Tokens-Color`, `Tokens-Type`, `Tokens-Space`: already extracted into `/tokens.css`.
   - `Main` (what each page must do), `Direction` (Print vs Night scoring and why Night won).
   - `M3`/`M4-Process`: the scroll-driven "How it works" motion study. Reference only; C07 is the static version.
2. **`selects/` = the idea bank.** "Klarum Design Selects", the 66-board source the Brief was built from. Use it for personality, not layout.
   - `SN-*`: Night pages (Home, Notices, Pricing). `SP-*`: Print pages (Home, Notices, Pricing, Articles).
   - `P1-Footer`: title-block footer (already adapted). `P3-Hero`: section-cut hero. `P3-Overprint`: riso misregistration on headlines and buttons.
   - `BL-Page`, `BN-Page`: alternative full pages. `R-Process`: How it works, Print.
3. **`selects-ii/` = earlier, more product-led exploration** (paper and ink, IBM Plex).
   - `E2-Trace`: requirement → evidence → draft trace with Met / Gap / Unmapped states. This is the strongest proof idea for the cited-claim story.
   - `L3-Evidence`: a notice with underlined phrases that explain the fit score.
   - `F-Home`, `F-Notices`, `F-Pricing`, `F-Components`.

## Rules for using it

- The Brief wins any conflict. Selects and Selects II supply ideas, never overrides.
- Content still comes only from `/claims.md` and `/notices.json`. Design boards contain placeholder and sample copy (`[LOGO]`, "Over thirty contracted sources", sample KPIs); never copy those facts.
- Borrowing a Print idea means re-setting it in the Night tokens, as was done for the footer.
