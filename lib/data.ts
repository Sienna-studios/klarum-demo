import raw from "../notices.json";

export type Notice = {
  id: string;
  title: string;
  type: string;
  category: string;
  buyer: string;
  closes: string | null;
  closes_label: string;
  fit_sample: number;
  revision: { rev: string; history: string[] };
  source_name: string;
  source_url: string;
};

export const notices = raw.notices as Notice[];
export const citedClaim = raw.cited_claim;
export const vanuatu = notices.find((n) => n.id === citedClaim.requirement_source)!;

/** Meta lines drop a missing segment and its separator; they never show an empty slot. */
export const metaLine = (n: Notice) => [n.type, n.category, n.buyer].filter(Boolean).join(" · ");
export const closesLine = (n: Notice) => {
  const when = n.closes ?? n.closes_label;
  return when ? `Closes · ${when}` : "";
};
export const isRevised = (n: Notice) => n.revision.rev !== "A";

export const URLS = {
  trial: "https://app.klarum.com",
  pricing: "https://www.klarum.com/pricing",
  review: "https://www.klarum.com/contact#bookings",
  trust: "https://www.klarum.com/legal#trust",
} as const;
