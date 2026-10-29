# klarum-demo

A reference rebuild of the klarum.com homepage (Next.js App Router, TypeScript strict, Tailwind). Owner: Andres (Sienna Studios). Not Klarum's production code.

## Read only these files for context

`SPEC.md` (what to build), `tokens.css` (design tokens), `claims.md` (what the page may say), `notices.json` (real notice data), `BASELINE.md` (live-site numbers). Do not open the claude.ai design canvases and do not re-research Klarum; everything needed was extracted into these files.

For visual design work, use `design/` (start with `design/README.md`): the exported design canvases, as source HTML plus rendered WebPs. Compare your screenshots against `design/brief/renders/Home-Draft-*.webp` and the component cards, and borrow personality ideas from `design/selects/` and `design/selects-ii/`. The Brief wins conflicts. Copy and facts still come only from `claims.md` and `notices.json`.

## Rules

- Budget, mobile, cold, before load: <=410 KB, <=25 requests, zero requests to app.klarum.com, api.klarum.com or posthog.
- Every factual sentence on the page must map to a row in `claims.md`. "sample" rows are labelled on the page; "confirm" rows stay out.
- Motion: opacity and transform only, none under prefers-reduced-motion.
- Accessibility: real buttons, links and details; 4.5:1 contrast including 11px labels; 44px targets; visible focus.
- Deploy previews only (Vercel builds every pushed branch). Never promote to production.
- Keep diffs small; edit only the files a change needs.
