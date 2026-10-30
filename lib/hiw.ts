// Copy and sample data for the "How it works" click-through (components/v2/HowItWorks.tsx).
// Every sentence maps to a row in claims.md (rows 26 to 31). Sample rows are labelled "Sample" on the page.

export type WallTile = { title: string; src: string; look: "" | "inv" | "dash"; keep?: boolean };

/** Snapshot of klarum.com/notices, 30 Oct 2026, titles verbatim, plus the three notices in notices.json (claims.md #26).
 *  look = how the source formats it when it arrives. keep = the three that fit in step 2. */
export const WALL: WallTile[] = [
  { title: "Removal, Repair, Reinstallation of Winco LP Standby Generator, Sixs Rivers NF", src: "SAM.gov · USA", look: "dash" },
  { title: "NY100136 Heliotropen etapp 2, totalentreprenad - förhandlat förfarande", src: "Mercell · Sweden", look: "inv" },
  { title: "Material - Schaktmassor", src: "Mercell · Sweden", look: "inv" },
  { title: "Sources Sought Installation Services of a Cable Rail Fence System", src: "SAM.gov · USA", look: "dash" },
  { title: "Role of a BA", src: "AusTender · Australia", look: "" },
  { title: "Design and construction supervision, about 60 km of road", src: "PDF · Public Works Dept, Vanuatu", look: "inv", keep: true },
  { title: "Labour hire", src: "AusTender · Australia", look: "" },
  { title: "Labour hire", src: "AusTender · Australia", look: "" },
  { title: "Test Analyst", src: "AusTender · Australia", look: "" },
  { title: "Templafy", src: "AusTender · Australia", look: "" },
  { title: "Occupational Rehabilitation and Assessment Services", src: "AusTender · Australia", look: "" },
  { title: "Corporate Learning and Development Services", src: "AusTender · Australia", look: "" },
  { title: "Supervision of repair and rehabilitation of highways", src: "TED · North Macedonia", look: "", keep: true },
  { title: "Occupational Rehabilitation and Assessment Services", src: "AusTender · Australia", look: "" },
  { title: "Corporate Learning and Development Services", src: "AusTender · Australia", look: "" },
  { title: "Relocation Services", src: "AusTender · Australia", look: "" },
  { title: "Gradate Certificate in Business Program Costs", src: "AusTender · Australia", look: "" },
  { title: "Expert Assistance", src: "AusTender · Australia", look: "" },
  { title: "Office Fitout", src: "AusTender · Australia", look: "" },
  { title: "Global Freedom Summit Film Screening", src: "AusTender · Australia", look: "" },
  { title: "Supervision consultancy for rural road civil works", src: "DevelopmentAid · Sri Lanka", look: "dash", keep: true },
  { title: "Travel and Expense Management Services", src: "AusTender · Australia", look: "" },
  { title: "Legal and Contract Adviser", src: "AusTender · Australia", look: "" },
  { title: "eRecruitment system", src: "AusTender · Australia", look: "" },
  { title: "Extradition", src: "AusTender · Australia", look: "" },
  { title: "Co-Sourced Internal Audit Service", src: "Contracts Finder · UK", look: "inv" },
  { title: "Business continuity uplift, training and testing", src: "AusTender · Australia", look: "" },
  { title: "Gartner Subscription", src: "AusTender · Australia", look: "" },
];

/** Step 2: which sample reference each matched notice leans on. Labelled "Sample" on the page (claims.md #8). */
export const MATCHED_ON: Record<string, string> = {
  "wb-p167382-vanuatu": "Kenya Roads, firm history",
  "ted-535663-2026": "Highway rehabilitation supervision",
  "wb-ibrd9290-srilanka": "Kenya Roads, rural roads",
};

/** Four of the 25 that do not fit. Shown without reasons, because no source says Klarum states one per notice (claims.md #31). */
export const NOT_MATCHED = [
  { title: "Labour hire", src: "AusTender · Australia" },
  { title: "NY100136 Heliotropen etapp 2, totalentreprenad - förhandlat förfarande", src: "Mercell · Sweden" },
  { title: "Removal, Repair, Reinstallation of Winco LP Standby Generator, Sixs Rivers NF", src: "SAM.gov · USA" },
  { title: "Material - Schaktmassor", src: "Mercell · Sweden" },
];

/** Step 4: workspace statuses as the product page lists them (claims.md #30). */
export const STATUSES = ["Selected", "In progress", "Under review", "Submitted", "Won or lost"];

export const STEPS = [
  { tab: "28 notices arrive", sub: "Every portal, every format", key: "1 · Notices arrive", next: "Next: see your fit",
    text: "A sample of what the portals hand you: 28 notices from 7 sources, some listed twice. Most have nothing to do with road consultancy." },
  { tab: "3 fit your record", sub: "Scored on your references", key: "2 · Fit to your record", next: "Next: the requirements",
    text: "Klarum scores each notice against your own references and shows the factors behind the score. Three fit. Say Go and the notice becomes a bid workspace." },
  { tab: "Requirements listed", sub: "One notice, as a checklist", key: "3 · Requirements", next: "Next: the draft",
    text: "Klarum pulls the requirements out of the tender into a checklist. These are the four shortlisting criteria in the Vanuatu REOI." },
  { tab: "Each sentence cited", sub: "Draft, then the workspace", key: "4 · Cited draft", next: "Start again",
    text: "Each sentence in the draft cites the page that proves it. The workspace then carries the bid through review to submission and the result." },
] as const;
