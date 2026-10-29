# Baseline: live klarum.com homepage

Reference version: homepage **v0.9.39 (28 Oct 2026)** as served on 29 Oct; header and contact pages already on v0.9.49. The live site ships about two releases a day, so compare against this version, not "live".

## Measured earlier (from project doc `claude/klarum-perf-tasks.md`, 22 to 23 Oct 2026, v0.9.22)

| Metric | Value | How |
|---|---|---|
| PageSpeed mobile, median of 3 | score 55, FCP 2.7 s, LCP 7.4 s, TBT 670 ms | PSI web UI |
| PageSpeed desktop, 2 runs | score 80 to 90, LCP 1.2 to 1.3 s, TBT 200 to 370 ms | PSI web UI |
| Page transfer, unthrottled | 27.24 MB over 256 requests | HAR |
| Hero video | 21.8 MB, 2560x1440, autoplay | HAR |
| Tour iframes | 4 boots on timers, 1.94 MB before load, plus PostHog | HAR |
| CLS | 0 | HAR / Lighthouse |

The homepage structure on 28 Oct still has the hero video, the ten-surface tour, the SDG section and the unlabelled sample KPIs, so these numbers are expected to hold. Step 2 re-measures them with this repo's harness.

## Still to fill in step 2 (same harness as the demo)

- [ ] Lighthouse mobile and desktop, median of 3, against https://www.klarum.com
- [ ] Bytes and requests before load, cold, mobile
- [ ] Requests to app.klarum.com / api.klarum.com / posthog before interaction
- [ ] Computed fonts and colours of the live header, H1, body and buttons, compared with `tokens.css` (known match: theme-color `#0d0d10` = `--bg`)
