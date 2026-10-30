# Klarum homepage rebuild: report

## 1. What this is
A reference rebuild of the klarum.com homepage that Klarum can adopt piece by piece. It is not a replacement site. Two pages share `tokens.css` and the components: dark `/` and light `/v2`.

## 2. Before vs after (mobile, Lighthouse median of 3)
| | Live klarum.com (`BASELINE.md`, v0.9.22) | This build, dark `/` | This build, light `/v2` |
|---|---|---|---|
| Lighthouse score | 55 | 97 | 98 |
| LCP | 7.4 s | 1.81 s | 2.12 s |
| TBT | 670 ms | 176 ms | 91 ms |
| Transfer before load | not measured; 27.24 MB for the whole page, with a 21.8 MB hero video | 227.1 KB | 277.7 KB |
| Requests | 256 for the whole page | 10 before load | 12 before load |
| Third-party requests before interaction | PostHog plus 4 tour iframes (1.94 MB before load) | 0 | 0 |

Source: `screenshots/review/final/`. Live numbers come from PageSpeed and a HAR on 22–23 Oct. Live before-load bytes and requests were never measured (`BASELINE.md`, step 2 is still open).

## 3. The three signature moments
- **Cited-claim chip** ([spec](design/system/cited-claim.md)): a draft sentence carries a chip that opens the requirement → evidence → draft chain. It proves Klarum's one promise, that every claim links to the page behind it, in one click.
- **Notice row system** ([spec](design/system/notice-row.md)): fit squares, a revision tag and a shortlist toggle. One grammar in compact and full sizes, so a bid manager can scan, see revisions and decide.
- **Drawing-sheet language** ([spec](design/system/drawing-sheet.md)): one title-block caption for the photo plate and the footer. It tells a bid reader the page is made for their paperwork, and it labels every plate "Sample image".

All three moments in every state, in both themes: [`/lab/states`](https://klarum-demo-git-claude-epic-lovelace-d6b5tv-sienna-studios.vercel.app/lab/states).

## 4. Photos
- **Kept two of the five live photos**, because only these show the reader's own kind of work:
  - The river bridges (a frame from the live hero video): the plate, and the light hero.
  - The rail yard: the closing CTA band.
- **Dropped:** the offshore platform, the aircraft hangar and the glass facade.
- **Grade:** riso duotone with token colours. Red is kept below the fit squares and the primary button.
- **Licence: unconfirmed, ask Klarum.** The files carry no EXIF, author or licence data.

## 5. Claims ledger (`claims.md`, 24 rows)
**17 sourced, 3 sample, 4 confirm.**
- Of the 17 sourced rows, 5 are marked "re-check" and 1 is "planned, not available".
- The 3 sample rows are labelled "Sample" on the page.
- The 4 confirm rows stay off the page.

Klarum needs to confirm these before the demo is shown publicly:
- **Trust facts shown on the page, still marked re-check** (#18–22): Frankfurt database, Stockholm inference, US parsing processor, no training on customer content, no certifications. The Trust Center has moved to `/legal#trust`.
- **Confirm rows kept off the page:** #3 "thirty contracted sources", #5 "first EOI the same day", #6 "an EOI your legal team can sign", #17 "Workspace audit log" on the free tier.
- **Photo licence** (section 4).

## 6. Adoption map
| Component | Replaces on live klarum.com | Files to copy |
|---|---|---|
| Tokens and base styles | Ad-hoc styles | `tokens.css`, `app/globals.css` (light: `app/v2/minimal.css`) |
| Header | Header | `components/Header.tsx`, `components/KMark.tsx` (light: `components/v2/HeaderCta.tsx`) |
| Hero with notice feed | Hero video | `components/Home.tsx` (hero), `components/NoticeFeed.tsx`, `components/Pips.tsx` (light: `components/v2/HeroMosaic.tsx`) |
| Proof strip | Trust strip | `lib/content.ts` (`BACKERS`) |
| Workflow cards and cited claim | Ten-surface tour iframes and the "Drafting" card | `components/CitedClaim.tsx`, `lib/data.ts` |
| Open notices list | The tour's notice surfaces | `components/NoticeFeed.tsx`, `notices.json` |
| Photo plate | Glass, hangar and platform photo sections | `components/Plate.tsx`, `components/LazyPhoto.tsx`, `lib/photos.ts`, `public/photos/` |
| Where your documents go | Trust Center link | `lib/content.ts` (`DOCS`) |
| Pricing | Pricing teaser | `components/Pricing.tsx` |
| FAQ | FAQ | `lib/content.ts` (`FAQ`) |
| Title-block footer | Footer | `components/Footer.tsx`, `components/SheetCaption.tsx` |

## 7. Open questions for Klarum
1. **Photo licence:** what is the licence for the hero video frame and the rail photo?
2. **Real photos:** can you supply photos of customers' real projects to replace both?
3. **"Thirty contracted sources":** which sources are behind the claim? Is there a list we may publish?
4. **Trial end:** what happens when the trial ends? Is "access pauses at expiry, data retained" still correct?
5. **Review link:** where should "Or review one upcoming tender with us" land? It points to `/contact#bookings` today.

## 8. The 5-second test kit
- **Screenshots:** `screenshots/5-second-test/` holds the hero and the first screen of both pages, at 1280 and 390.
- **Method:** show one image for 5 seconds, hide it, then ask:
  1. "What does this company do?"
  2. "Who is it for?"
  3. "What would you click first?"
- **Pass rule:** at least 4 of 5 testers per page say it drafts EOIs from their own references.

## 9. Preview URLs (Vercel previews; never promoted to production)
- **After step 4** (`claude/epic-lovelace-d6b5tv`):
  - [`/`](https://klarum-demo-git-claude-epic-lovelace-d6b5tv-sienna-studios.vercel.app/)
  - [`/v2`](https://klarum-demo-git-claude-epic-lovelace-d6b5tv-sienna-studios.vercel.app/v2)
  - [`/lab/states`](https://klarum-demo-git-claude-epic-lovelace-d6b5tv-sienna-studios.vercel.app/lab/states)
- **Before step 4** (`claude/practical-thompson-rmdwin`):
  - [`/`](https://klarum-demo-git-claude-practical-thompson-rmdwin-sienna-studios.vercel.app/)
  - [`/v2`](https://klarum-demo-git-claude-practical-thompson-rmdwin-sienna-studios.vercel.app/v2)
- **Note:** the light page lives at `/v2`. This branch has no `/v2/c`.
