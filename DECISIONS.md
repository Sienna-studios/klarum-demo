# Decisions

## Step 1: which version

Both versions are kept. Nothing goes to `/archive`.

| Version | Route | Why | Overlay target |
|---|---|---|---|
| Dark | `/` | Matches the Brief's Night target. | `design/brief/renders/Home-Draft-Dark.webp` |
| Light | `/v2` (hero C, `/v2/c`) | Light alternative. | `design/brief/renders/Home-Draft-Light.webp` |

Both share `tokens.css` and the components, so a system fix applies to both. Heroes E, F and G stay reachable at `/v2/e`, `/v2/f` and `/v2/g` for now; `/v2` opens on C.
