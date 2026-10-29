import data from "@/notices.json";

export type Notice = {
  id: string;
  title: string;
  type: string;
  category: string;
  buyer: string;
  country: string;
  closes: string | null;
  closes_label: string;
  fit_sample: number;
  revision: { rev: string; history: string[] };
  source_name: string;
  source_url: string;
};

export type CitedClaimData = {
  requirement: string;
  requirement_source: string;
  draft_sentence: string;
  citation_label: string;
  excerpt: string;
  is_sample: boolean;
};

export const notices = data.notices as Notice[];
export const citedClaim = data.cited_claim as CitedClaimData;

export function noticeById(id: string): Notice | undefined {
  return notices.find((n) => n.id === id);
}
