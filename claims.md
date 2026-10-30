# Claims ledger

Every factual line the homepage may use. Status: **sourced** (with where), **sample** (must be labelled on the page), **confirm** (needs Klarum before it ships; leave it out of the demo or mark it). Evidence dates are when it was observed, not re-checked today unless stated.

| # | Claim as it may appear | Status | Source / note |
|---|---|---|---|
| 1 | Klarum drafts submissions from your own references and cites the source page behind every claim | sourced | Live homepage "Drafting" card, 28 Oct 2026 (v0.9.39) |
| 2 | Search live tender notices, draft submissions from your own references, and track every bid | sourced | Live homepage meta description, 28 Oct 2026 |
| 3 | "More than thirty contracted sources refresh daily" | confirm | Live homepage. No list published. Demo uses "Contracted public sources: national portals, TED and the development banks" instead |
| 4 | Sources include national procurement portals, TED and the development banks; every notice links back to the original publication | sourced | Live homepage FAQ, 28 Oct 2026 |
| 5 | "Draft your first EOI the same day" | confirm | Live homepage (older wording). Leave out |
| 6 | "Hands back an EOI your legal team can sign" | confirm | Live homepage. Leave out |
| 7 | Win rate 41% +6 pts, cycle time 18d, 26 bids/qtr | sample | Live homepage mock UI, unlabelled there. Demo shows empty KPIs or labels them "Sample" |
| 8 | Fit scores on notices | sample | notices.json `fit_sample`; label "Sample fit" |
| 9 | Cited-claim evidence (Kenya roads report, p. 47) | sample | notices.json `cited_claim`; the requirement it answers is real (Vanuatu REOI) |
| 10 | Built and backed by people from KTH, AI Sweden, AWS, Google Maps, Apple, Svea Solar, Lyceum Technology | sourced | Live homepage trust strip (aria-labels), 23 Oct 2026 |
| 11 | Free: €0, one seat, monthly matching allowance (number undisclosed), SharePoint and Google Drive connectors, CSV/PDF exports, no drafting, no team features | sourced | klarum.com/pricing and /free, 23 Oct 2026 (project doc klarum-pricing-analysis.md) |
| 12 | Business: €200 per seat per month or €2,000 per seat per year, excl. VAT; unmetered tender matching; proposal and bid-draft generation; team seats, org settings, invitations; seats prorated | sourced | /pricing and /business, 23 Oct 2026 |
| 13 | Yearly saves two months (16.7%) | sourced | Computed from #12 |
| 14 | Business trial: 7 days, one per organisation, no payment method; access pauses at expiry, data retained | sourced | /business, 23 Oct 2026 |
| 15 | Partner: negotiated seat price and terms, invoiced, org-wide audit log and export, bespoke integrations, dedicated support | sourced | /partner, 23 Oct 2026 |
| 16 | SSO/SCIM | sourced as **planned, not available** | /partner. Show as "Planned", never as included |
| 17 | Free tier "Workspace audit log" (in the design draft) | confirm | Not in the reviewed pricing pages. Leave out |
| 18 | Database hosted in Frankfurt | sourced, re-check | /trust, 23 Oct 2026. Trust Center has since moved to /legal#trust |
| 19 | Model inference in Stockholm (AWS Bedrock) | sourced, re-check | same as #18 |
| 20 | Documents sent for parsing go to a US processor (LlamaParse receives the whole document) | sourced, re-check | same as #18. Say it plainly; it answers the main objection honestly |
| 21 | Customer content is not used for training | sourced, re-check | same as #18 |
| 22 | No certifications listed | sourced, re-check | same as #18. Do not imply ISO/SOC |
| 23 | Office: Medborgarplatsen 25, 118 72 Stockholm; um@klarum.com; Klarum Technologies AB | sourced | Live footer, 29 Oct 2026 |
| 24 | "Book a meeting" goes to /contact#bookings | sourced | Live header, 29 Oct 2026 (v0.9.49) |
| 25 | The free tier is the floor of the plan ladder, not a trial that expires | sourced | Live homepage SDG 8 text, 28 Oct 2026 |
| 26 | Sample feed: 28 notices from 7 sources, 3 listed twice; most are not road consultancy | sample | Snapshot of klarum.com/notices on 30 Oct 2026, titles verbatim (recorded in the "Klarum How It Works" artifact, not re-fetched), plus the three notices in notices.json. Labelled "Sample feed" on the page |
| 27 | Klarum scores each notice against your own references and shows the factors behind the score | sourced | Live homepage FAQ, fetched 30 Oct 2026 ("The score comes with the factors behind it"); klarum.com/klarum lists sector overlap, geographic coverage, budget fit and reference evidence. The "Matched on" labels are sample |
| 28 | Say Go and the notice becomes a bid workspace | sourced | Live homepage FAQ, fetched 30 Oct 2026 |
| 29 | Klarum pulls the requirements out of the tender into a checklist | sourced | klarum.com/klarum, "Requirements auto-extracted from the tender into a checklist", fetched 30 Oct 2026 |
| 30 | A bid workspace has the statuses selected, in progress, under review, submitted, won or lost | sourced | klarum.com/klarum, fetched 30 Oct 2026. Which status is highlighted on the page is a sample |
| 31 | Per-criterion matching against your record ("3 of 4 met"); a stated reason for each notice that does not fit; nothing drafted for a criterion without evidence; a held gap or a joint-venture partner prompt | confirm | Not found on any Klarum page. Kept out. The REOI's own rule (joint-venture members' qualifications count, a sub-consultant's do not) is a fact about the REOI, but Klarum surfacing it is unconfirmed |
| 32 | The four shortlisting criteria of the Vanuatu REOI, in its own wording | sourced | Vanuatu REOI PDF (pwd.gov.vu), fetched 30 Oct 2026; wording in notices.json |
